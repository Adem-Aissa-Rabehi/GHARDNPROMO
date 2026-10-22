from django.urls import path, re_path
from .views import (
    LoginView,
    AuthCheckView,
    LogoutView,
    AlbumListAPIView,
    AlbumDetailAPIView,
    GalleryTimelineAPIView,
    AdminAlbumAPIView,
    AdminPhotoAPIView,
    PublicVisiteAPIView,
    AdminVisiteAPIView,
)

urlpatterns = [
    # Auth Endpoints (toutes variantes avec ou sans trailing slash, avec ou sans auth/)
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/login', LoginView.as_view()),
    path('admin/login/', LoginView.as_view(), name='api-admin-login'),
    path('admin/login', LoginView.as_view()),
    path('login/', LoginView.as_view(), name='api-login-direct'),
    path('login', LoginView.as_view()),
    path('api/auth/login/', LoginView.as_view()),
    path('api/auth/login', LoginView.as_view()),
    path('api/login/', LoginView.as_view()),
    path('api/login', LoginView.as_view()),

    path('auth/me/', AuthCheckView.as_view(), name='api-me'),
    path('auth/me', AuthCheckView.as_view()),
    path('api/auth/me/', AuthCheckView.as_view()),
    path('api/auth/me', AuthCheckView.as_view()),
    path('me/', AuthCheckView.as_view()),

    path('auth/logout/', LogoutView.as_view(), name='api-logout'),
    path('auth/logout', LogoutView.as_view()),
    path('api/auth/logout/', LogoutView.as_view()),
    path('logout/', LogoutView.as_view()),

    # Public Gallery Endpoints
    path('albums/', AlbumListAPIView.as_view(), name='album-list'),
    path('albums', AlbumListAPIView.as_view()),
    path('api/albums/', AlbumListAPIView.as_view()),
    path('albums/<int:year>/', AlbumDetailAPIView.as_view(), name='album-detail'),
    path('timeline/', GalleryTimelineAPIView.as_view(), name='gallery-timeline'),
    path('timeline', GalleryTimelineAPIView.as_view()),
    path('api/timeline/', GalleryTimelineAPIView.as_view()),

    # Public Contact & Visites
    path('visites/', PublicVisiteAPIView.as_view(), name='public-visite-create'),
    path('visites', PublicVisiteAPIView.as_view()),
    path('api/visites/', PublicVisiteAPIView.as_view()),

    # Admin Management Endpoints
    path('admin/albums/', AdminAlbumAPIView.as_view(), name='admin-album-create'),
    path('admin/albums', AdminAlbumAPIView.as_view()),
    path('admin/albums/<int:pk>/', AdminAlbumAPIView.as_view(), name='admin-album-detail'),
    path('admin/photos/', AdminPhotoAPIView.as_view(), name='admin-photo-create'),
    path('admin/photos', AdminPhotoAPIView.as_view()),
    path('admin/photos/<int:pk>/', AdminPhotoAPIView.as_view(), name='admin-photo-detail'),
    path('admin/visites/', AdminVisiteAPIView.as_view(), name='admin-visite-list'),
    path('admin/visites', AdminVisiteAPIView.as_view()),
    path('admin/visites/<int:pk>/', AdminVisiteAPIView.as_view(), name='admin-visite-detail'),
]
