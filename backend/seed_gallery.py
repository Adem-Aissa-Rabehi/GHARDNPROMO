import os
import sys
import shutil
from datetime import date
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
import django
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.core.files import File
from gallery.models import Album, Photo

BASE_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BASE_DIR.parent

def seed_database():
    print("[INIT] Demarrage de l'initialisation de la Galerie GHARDN PROM...")

    # 1. Création de l'administrateur sécurisé (mots de passe hachés via set_password / create_superuser)
    admin_user, created = User.objects.get_or_create(username='admin', defaults={'email': 'contact@ghardnpromo.dz'})
    admin_user.set_password('admin2026')  # Mot de passe sécurisé haché PBKDF2/SHA256
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    token, _ = Token.objects.get_or_create(user=admin_user)
    print(f"[AUTH] Compte Administrateur configure: Identifiant 'admin' / Mot de passe 'admin2026' (Hache: {admin_user.password[:20]}...)")
    print(f"[TOKEN] Token API Admin: {token.key}")

    # Répertoires de médias cibles
    media_covers = BASE_DIR / 'media' / 'album_covers'
    media_photos = BASE_DIR / 'media' / 'gallery_photos'
    media_covers.mkdir(parents=True, exist_ok=True)
    media_photos.mkdir(parents=True, exist_ok=True)

    # Sources d'images existantes
    commun_dir = WORKSPACE_DIR / 'public' / 'commun'
    hall_dir = WORKSPACE_DIR / 'hall'
    workspace_images = [
        WORKSPACE_DIR / 'Arranging_balcony_furniture_2K_20261013101037.jpg',
        WORKSPACE_DIR / 'Modify_balcony_shape_2K_20261013101004.jpg',
        WORKSPACE_DIR / 'Arranging_complete_view_of_apart…_2K_20261013100943.jpg',
    ]

    commun_images = list(commun_dir.glob('*.jpg')) if commun_dir.exists() else []
    hall_images = list(hall_dir.glob('*.jpeg')) if hall_dir.exists() else []

    # 2. Configuration des Albums Années
    albums_data = [
        {
            'year': 2026,
            'title': "Finitions d'Exception & Espaces Communs",
            'subtitle': "Rooftop panoramique, piscine suspendue & halls nobles",
            'description': "Aménagement des terrasses accessibles de 66.31 m², bassin d'eau suspendu de 18.04 m², solarium privatif et finitions des appartements de prestige.",
            'cover_src': commun_images[1] if len(commun_images) > 1 else (commun_images[0] if commun_images else None),
            'photos': [
                {'src': commun_images[0] if len(commun_images) > 0 else None, 'title': 'Solarium & Détente Crépusculaire', 'date': date(2026, 10, 12), 'caption': 'Vue panoramique depuis le deck terrasse au coucher du soleil.'},
                {'src': commun_images[1] if len(commun_images) > 1 else None, 'title': 'Bassin Suspendu & Pergola Ombragée', 'date': date(2026, 10, 5), 'caption': 'Pergola contemporaine en aluminium et carrelage anti-dérapant 18.04 m².'},
                {'src': commun_images[2] if len(commun_images) > 2 else None, 'title': 'Ligne d Eau Cristalline', 'date': date(2026, 9, 20), 'caption': 'Reflets dorés sur le plan d eau face à l horizon dégagé.'},
                {'src': commun_images[3] if len(commun_images) > 3 else None, 'title': 'Espace Transats & Bain de Soleil', 'date': date(2026, 8, 14), 'caption': 'Mobilier extérieur lounge et agencement paysager.'},
                {'src': commun_images[4] if len(commun_images) > 4 else None, 'title': 'Vue Aérienne de la Terrasse 66 m²', 'date': date(2026, 7, 28), 'caption': 'Plan large des aménagements extérieurs privatifs de la toiture.'},
                {'src': commun_images[5] if len(commun_images) > 5 else None, 'title': 'Salon d Angle Cosy Extérieur', 'date': date(2026, 6, 15), 'caption': 'Atmosphère feutrée et éclairage LED architectural intégré.'},
            ]
        },
        {
            'year': 2025,
            'title': "Élévation Structurale & Façades",
            'subtitle': "Montée des 5 niveaux et courbures architecturales",
            'description': "Coulage des dalles bétons armés, élévation des étages résidentiels, menuiseries aluminium à rupture thermique et façades contemporaines.",
            'cover_src': workspace_images[1] if workspace_images[1].exists() else None,
            'photos': [
                {'src': workspace_images[0] if workspace_images[0].exists() else None, 'title': 'Garde-Corps Verre & Balcon Filant', 'date': date(2025, 11, 20), 'caption': 'Pose des verres feuilletés sécurisés sur les terrasses F3 Sud.'},
                {'src': workspace_images[1] if workspace_images[1].exists() else None, 'title': 'Courbures de Façade & Volumes', 'date': date(2025, 8, 10), 'caption': 'Finitions des formes dynamiques et enduits minéraux premium.'},
                {'src': workspace_images[2] if workspace_images[2].exists() else None, 'title': 'Agencement des Baies Vitrées', 'date': date(2025, 5, 4), 'caption': 'Ouvertures maximisées orientées sud et double vitrage acoustique.'},
                {'src': hall_images[0] if len(hall_images) > 0 else None, 'title': 'Arrivée des Matériaux Nobles', 'date': date(2025, 3, 18), 'caption': 'Contrôle qualité des marbres et parements importés.'},
            ]
        },
        {
            'year': 2024,
            'title': "Fondations & Gros Œuvre",
            'subtitle': "Terrassements, infrastructures et radier parasismique",
            'description': "Démarrage des travaux d'infrastructure, terrassements en grande masse, voiles béton armé et coulage du radier général.",
            'cover_src': hall_images[1] if len(hall_images) > 1 else None,
            'photos': [
                {'src': hall_images[1] if len(hall_images) > 1 else None, 'title': 'Coulage du Radier Général', 'date': date(2024, 10, 22), 'caption': 'Béton haute performance dosé avec adjuvant hydrofuge.'},
                {'src': hall_images[2] if len(hall_images) > 2 else None, 'title': 'Ferraillage & Voiles Périphériques', 'date': date(2024, 7, 14), 'caption': 'Contrôle parasismique des armatures métalliques sous-sol.'},
                {'src': hall_images[3] if len(hall_images) > 3 else None, 'title': 'Terrassement de la Cour Intérieure', 'date': date(2024, 4, 9), 'caption': 'Préparation du puit de lumière et gaine double ascenseur.'},
                {'src': hall_images[4] if len(hall_images) > 4 else None, 'title': 'Démarrage & Implantation Géomètre', 'date': date(2024, 1, 15), 'caption': 'Bornage cadastral et nivellement topographique du terrain.'},
            ]
        }
    ]

    for a_data in albums_data:
        album, _ = Album.objects.get_or_create(
            year=a_data['year'],
            defaults={
                'title': a_data['title'],
                'subtitle': a_data['subtitle'],
                'description': a_data['description'],
            }
        )
        # Cover
        if a_data['cover_src'] and a_data['cover_src'].exists():
            dest_name = f"cover_{album.year}_{a_data['cover_src'].name}"
            dest_path = media_covers / dest_name
            shutil.copyfile(a_data['cover_src'], dest_path)
            album.cover_image = f"album_covers/{dest_name}"
            album.save()

        # Photos
        for p_info in a_data['photos']:
            src = p_info['src']
            if src and src.exists():
                p_dest_name = f"photo_{album.year}_{p_info['date'].strftime('%m%d')}_{src.name}"
                p_dest_path = media_photos / p_dest_name
                shutil.copyfile(src, p_dest_path)

                # Check if exists
                if not Photo.objects.filter(album=album, title=p_info['title']).exists():
                    photo = Photo.objects.create(
                        album=album,
                        title=p_info['title'],
                        caption=p_info['caption'],
                        image=f"gallery_photos/{p_dest_name}",
                        year=album.year,
                        month=p_info['date'].month,
                        date_taken=p_info['date'],
                    )
                    print(f"  [PHOTO] Photo ajoutee: {photo.year}/{photo.month:02d} - {photo.title}")

        print(f"[OK] Album {album.year} configure avec {album.photos.count()} photos.")

    print("[DONE] Base de donnees de la Galerie initialisee avec succes !")

if __name__ == '__main__':
    seed_database()
