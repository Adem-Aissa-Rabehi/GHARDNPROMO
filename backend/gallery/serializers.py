from rest_framework import serializers
from .models import Album, Photo, DemandeVisite

class PhotoSerializer(serializers.ModelSerializer):
    month_name = serializers.ReadOnlyField()
    album_title = serializers.CharField(source='album.title', read_only=True)
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = [
            'id',
            'album',
            'album_title',
            'title',
            'media_type',
            'image',
            'image_url',
            'video',
            'video_url',
            'year',
            'month',
            'month_name',
            'caption',
            'date_taken',
            'created_at',
        ]
        read_only_fields = ['year', 'month', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video:
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None


class AlbumSerializer(serializers.ModelSerializer):
    photos_count = serializers.ReadOnlyField()
    videos_count = serializers.ReadOnlyField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            'id',
            'year',
            'title',
            'subtitle',
            'description',
            'cover_image',
            'cover_image_url',
            'photos_count',
            'videos_count',
            'created_at',
            'updated_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class AlbumDetailSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    photos_count = serializers.ReadOnlyField()
    videos_count = serializers.ReadOnlyField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            'id',
            'year',
            'title',
            'subtitle',
            'description',
            'cover_image',
            'cover_image_url',
            'photos_count',
            'videos_count',
            'photos',
            'created_at',
            'updated_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class DemandeVisiteSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = DemandeVisite
        fields = [
            'id',
            'name',
            'phone',
            'email',
            'residence',
            'preferred_date',
            'message',
            'status',
            'status_display',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
