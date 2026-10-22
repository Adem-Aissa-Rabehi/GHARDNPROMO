from collections import defaultdict
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Album, Photo, DemandeVisite, MONTH_NAMES_FR
from .serializers import AlbumSerializer, AlbumDetailSerializer, PhotoSerializer, DemandeVisiteSerializer


class LoginView(APIView):
    """
    Authentification sécurisée avec mot de passe haché (Django PBKDF2/SHA256).
    Retourne un jeton API Token si les identifiants sont valides.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'error': 'Identifiant et mot de passe requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {'error': 'Identifiants incorrects. Accès refusé.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        })


class AuthCheckView(APIView):
    """Vérifie si le jeton est valide pour l'interface d'administration React."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'valid': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'is_staff': request.user.is_staff,
            }
        })


class LogoutView(APIView):
    """Déconnexion et invalidation du jeton."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Déconnexion réussie.'})


class AlbumListAPIView(APIView):
    """Liste publique des albums par année avec couvertures."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        albums = Album.objects.all().order_by('-year')
        serializer = AlbumSerializer(albums, many=True, context={'request': request})
        return Response(serializer.data)


class AlbumDetailAPIView(APIView):
    """Détail d'un album avec toutes ses photos."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, year):
        try:
            album = Album.objects.get(year=year)
        except Album.DoesNotExist:
            return Response({'error': f'Album {year} introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AlbumDetailSerializer(album, context={'request': request})
        return Response(serializer.data)


class GalleryTimelineAPIView(APIView):
    """
    Vue galerie smartphone : photos regroupées par Année et par Mois.
    Reproduit la timeline native type Apple Photos / Google Photos.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        year_filter = request.query_params.get('year')
        month_filter = request.query_params.get('month')

        photos = Photo.objects.select_related('album').all().order_by('-date_taken', '-created_at')

        if year_filter:
            try:
                photos = photos.filter(year=int(year_filter))
            except ValueError:
                pass

        if month_filter:
            try:
                photos = photos.filter(month=int(month_filter))
            except ValueError:
                pass

        # Regroupement par (year, month)
        grouped_dict = defaultdict(list)
        serialized_photos = PhotoSerializer(photos, many=True, context={'request': request}).data

        for p in serialized_photos:
            key = (p['year'], p['month'])
            grouped_dict[key].append(p)

        timeline = []
        for (y, m), items in grouped_dict.items():
            month_label = MONTH_NAMES_FR.get(m, f"Mois {m}")
            timeline.append({
                'year': y,
                'month': m,
                'month_name': month_label,
                'title': f"{month_label} {y}",
                'count': len(items),
                'photos': items,
            })

        return Response({
            'total_photos': photos.count(),
            'timeline': timeline,
        })


# --- ADMIN API (PROTECTED) ---

class AdminAlbumAPIView(APIView):
    """Gestion des albums dans le panneau admin React."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = AlbumSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            album = Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            return Response({'error': 'Album non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AlbumSerializer(album, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            album = Album.objects.get(pk=pk)
            photos_count = album.photos.count()
            year = album.year
            album.delete()
            return Response({
                'message': f"L'album {year} et ses {photos_count} photo(s) ont été supprimés avec succès.",
                'deleted_id': pk
            })
        except Album.DoesNotExist:
            return Response({'error': 'Album non trouvé.'}, status=status.HTTP_404_NOT_FOUND)


class AdminPhotoAPIView(APIView):
    """Upload et suppression de photos et vidéos pour l'admin."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        album_id = request.data.get('album')
        if not album_id:
            year_val = request.data.get('year')
            if year_val:
                album, _ = Album.objects.get_or_create(
                    year=int(year_val),
                    defaults={'title': f'Chantier & Avancement {year_val}'}
                )
                album_id = album.id
            else:
                return Response({'error': 'Veuillez spécifier un album ou une année.'}, status=status.HTTP_400_BAD_REQUEST)

        # Récupère tous les fichiers envoyés (images ou vidéos)
        files = (
            request.FILES.getlist('files')
            or request.FILES.getlist('images')
            or request.FILES.getlist('videos')
            or request.FILES.getlist('image')
            or request.FILES.getlist('video')
        )
        if not files:
            return Response({'error': 'Aucun fichier (photo ou vidéo) fourni.'}, status=status.HTTP_400_BAD_REQUEST)

        album = Album.objects.get(pk=album_id)
        created_items = []

        date_taken = request.data.get('date_taken')
        title = request.data.get('title', '')
        caption = request.data.get('caption', '')
        specified_media_type = request.data.get('media_type', '')

        video_extensions = {'mp4', 'mov', 'webm', 'ogg', 'mkv', 'avi', 'm4v'}

        for file in files:
            ext = file.name.lower().split('.')[-1] if '.' in file.name else ''
            is_video = (
                specified_media_type == 'video'
                or ext in video_extensions
                or (file.content_type and 'video' in file.content_type.lower())
            )

            clean_title = title or file.name.rsplit('.', 1)[0].replace('_', ' ')

            if is_video:
                item = Photo(
                    album=album,
                    video=file,
                    media_type='video',
                    title=clean_title,
                    caption=caption,
                    year=album.year,
                )
            else:
                item = Photo(
                    album=album,
                    image=file,
                    media_type='photo',
                    title=clean_title,
                    caption=caption,
                    year=album.year,
                )

            if date_taken:
                item.date_taken = date_taken
            item.save()
            created_items.append(item)

        # Définit la couverture de l'album s'il n'en a pas encore
        if not album.cover_image:
            for itm in created_items:
                if itm.image:
                    album.cover_image = itm.image
                    album.save()
                    break

        serialized = PhotoSerializer(created_items, many=True, context={'request': request}).data
        return Response({
            'message': f'{len(created_items)} média(s) ajouté(s) avec succès (photos / vidéos).',
            'photos': serialized
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        try:
            photo = Photo.objects.get(pk=pk)
            photo.delete()
            return Response({'message': 'Média supprimé avec succès.'})
        except Photo.DoesNotExist:
            return Response({'error': 'Média introuvable.'}, status=status.HTTP_404_NOT_FOUND)


# --- DEMANDES DE VISITES & CONTACTS ---

class PublicVisiteAPIView(APIView):
    """Enregistrement d'une demande de visite soumise depuis le formulaire public."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DemandeVisiteSerializer(data=request.data)
        if serializer.is_valid():
            visite = serializer.save()
            return Response({
                'message': 'Votre demande de visite a été enregistrée avec succès. Notre conseiller vous contactera rapidement.',
                'visite': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminVisiteAPIView(APIView):
    """Consultation et gestion des demandes de visites dans le panneau admin."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get('status')
        visites = DemandeVisite.objects.all().order_by('-created_at')

        if status_filter and status_filter != 'all':
            visites = visites.filter(status=status_filter)

        total_count = DemandeVisite.objects.count()
        nouveau_count = DemandeVisite.objects.filter(status='NOUVEAU').count()
        contacte_count = DemandeVisite.objects.filter(status='CONTACTE').count()
        rdv_count = DemandeVisite.objects.filter(status='RDV_CONFIRME').count()

        serializer = DemandeVisiteSerializer(visites, many=True)
        return Response({
            'stats': {
                'total': total_count,
                'nouveau': nouveau_count,
                'contacte': contacte_count,
                'rdv_confirme': rdv_count,
            },
            'visites': serializer.data
        })

    def patch(self, request, pk):
        try:
            visite = DemandeVisite.objects.get(pk=pk)
        except DemandeVisite.DoesNotExist:
            return Response({'error': 'Demande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DemandeVisiteSerializer(visite, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            visite = DemandeVisite.objects.get(pk=pk)
            visite.delete()
            return Response({'message': 'Demande de visite supprimée avec succès.'})
        except DemandeVisite.DoesNotExist:
            return Response({'error': 'Demande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

