from django.db import models
from django.utils import timezone

MONTH_NAMES_FR = {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',
}

MONTH_CHOICES = [(m, MONTH_NAMES_FR[m]) for m in range(1, 13)]

class Album(models.Model):
    """Album représentant une année de suivi du projet / chantier."""
    year = models.PositiveIntegerField(unique=True, db_index=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    cover_image = models.ImageField(upload_to='album_covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']
        verbose_name = "Album Année"
        verbose_name_plural = "Albums Années"

    def __str__(self):
        return f"{self.year} - {self.title}"

    @property
    def photos_count(self):
        return self.photos.count()

    @property
    def videos_count(self):
        return self.photos.filter(media_type='video').count()


class Photo(models.Model):
    """Photo ou Vidéo d'avancement rattachée à une année et un mois."""
    MEDIA_TYPES = [
        ('photo', 'Photo'),
        ('video', 'Vidéo'),
    ]

    album = models.ForeignKey(Album, related_name='photos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True, default='')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='photo', db_index=True)
    image = models.ImageField(upload_to='gallery_photos/', blank=True, null=True)
    video = models.FileField(upload_to='gallery_videos/', blank=True, null=True)
    year = models.PositiveIntegerField(db_index=True)
    month = models.PositiveSmallIntegerField(choices=MONTH_CHOICES, default=1, db_index=True)
    caption = models.TextField(blank=True, default='')
    date_taken = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_taken', '-created_at']
        verbose_name = "Média Galerie"
        verbose_name_plural = "Médias Galerie"

    def __str__(self):
        type_prefix = "[Vidéo]" if self.media_type == 'video' else "[Photo]"
        return f"{type_prefix} {self.year}/{self.month:02d} - {self.title or 'Média ' + str(self.id)}"

    @property
    def month_name(self):
        return MONTH_NAMES_FR.get(self.month, '')

    def save(self, *args, **kwargs):
        # Auto-détection du media_type si un fichier vidéo est fourni
        if self.video and not self.image:
            self.media_type = 'video'
        elif self.image and not self.video:
            self.media_type = 'photo'

        # Auto-synchronise year and month from date_taken if album is set or updated
        if self.date_taken:
            if isinstance(self.date_taken, str):
                import datetime
                try:
                    self.date_taken = datetime.date.fromisoformat(self.date_taken)
                except ValueError:
                    pass
            if hasattr(self.date_taken, 'year'):
                self.year = self.date_taken.year
                self.month = self.date_taken.month
        elif self.album:
            self.year = self.album.year
        super().save(*args, **kwargs)


class DemandeVisite(models.Model):
    """Demande de réservation ou de visite soumise par un client prospect."""
    STATUS_CHOICES = [
        ('NOUVEAU', 'Nouvelle Demande'),
        ('CONTACTE', 'Client Contacté'),
        ('RDV_CONFIRME', 'Rendez-vous Confirmé'),
        ('VISITE_EFFECTUEE', 'Visite Effectuée'),
        ('ARCHIVE', 'Classé / Archivé'),
    ]

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, default='')
    residence = models.CharField(max_length=120, default='F4 Prestige (135 m²)')
    preferred_date = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='NOUVEAU', db_index=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Demande de Visite"
        verbose_name_plural = "Demandes de Visite"

    def __str__(self):
        return f"{self.name} - {self.phone} ({self.residence})"
