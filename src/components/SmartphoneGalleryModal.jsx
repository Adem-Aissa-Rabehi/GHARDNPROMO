import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_ALBUMS = [
  {
    id: 1,
    year: 2026,
    title: "Finitions d'Exception & Espaces Communs",
    subtitle: "Rooftop panoramique, piscine suspendue & halls nobles",
    description: "Aménagement des terrasses accessibles de 66.31 m², bassin d'eau suspendu de 18.04 m², solarium privatif et finitions des appartements de prestige.",
    cover_image_url: "/media/album_covers/cover_2026_piscine_panoramique_pergola.jpg",
    cover_fallback: "/commun/piscine_panoramique_pergola.jpg",
    photos_count: 6,
    videos_count: 1
  },
  {
    id: 2,
    year: 2025,
    title: "Élévation Structurale & Façades",
    subtitle: "Montée des 5 niveaux et courbures architecturales",
    description: "Coulage des dalles bétons armés, élévation des étages résidentiels, menuiseries aluminium à rupture thermique et façades contemporaines.",
    cover_image_url: "/media/album_covers/cover_2025_Modify_balcony_shape_2K_20261013101004.jpg",
    cover_fallback: "/commun/terrasse_accessible_vue_ensemble.jpg",
    photos_count: 4,
    videos_count: 0
  },
  {
    id: 3,
    year: 2024,
    title: "Fondations & Gros Œuvre",
    subtitle: "Terrassements, infrastructures et radier parasismique",
    description: "Démarrage des travaux d'infrastructure, terrassements en grande masse, voiles béton armé et coulage du radier général.",
    cover_image_url: "/media/album_covers/cover_2024_WhatsApp Image 2026-08-29 at 09.21.24 (2).jpeg",
    cover_fallback: "/commun/patio_lounge_crepuscule.jpg",
    photos_count: 4,
    videos_count: 0
  }
];

const DEFAULT_TIMELINE = [
  {
    year: 2026,
    month: 10,
    month_name: "Octobre 2026",
    count: 3,
    photos: [
      {
        id: 20261,
        title: "Pergola bioclimatique & piscine panoramique",
        caption: "Aménagement haut standing en attique",
        image_url: "/media/gallery_photos/photo_2026_1005_piscine_panoramique_pergola.jpg",
        fallback_url: "/commun/piscine_panoramique_pergola.jpg",
        date: "2026-10-05",
        media_type: "photo"
      },
      {
        id: 20262,
        title: "Bassin d'eau & reflets du couchant",
        caption: "Solarium et terrasse suspendue",
        image_url: "/media/gallery_photos/photo_2026_0920_piscine_verre_couchant.jpg",
        fallback_url: "/commun/piscine_verre_couchant.jpg",
        date: "2026-09-20",
        media_type: "photo"
      },
      {
        id: 20263,
        title: "Visite virtuelle intérieure 3D",
        caption: "Aperçu immersif des appartements de standing",
        video_url: "/media/gallery_videos/video_visite_interieure_2026.mp4",
        fallback_url: "/commun/terrasse_accessible_vue_ensemble.jpg",
        date: "2026-10-01",
        media_type: "video"
      }
    ]
  },
  {
    year: 2025,
    month: 11,
    month_name: "Novembre 2025",
    count: 2,
    photos: [
      {
        id: 20251,
        title: "Aménagement des balcons panoramiques",
        caption: "Garde-corps en verre trempé et finitions contemporaines",
        image_url: "/media/gallery_photos/photo_2025_1120_Arranging_balcony_furniture_2K_20261013101037.jpg",
        fallback_url: "/commun/terrasse_salon_angle_cosy.jpg",
        date: "2025-11-20",
        media_type: "photo"
      },
      {
        id: 20252,
        title: "Courbures architecturales des façades",
        caption: "Élévation achevée et pose des baies vitrées",
        image_url: "/media/gallery_photos/photo_2025_0810_Modify_balcony_shape_2K_20261013101004.jpg",
        fallback_url: "/commun/terrasse_accessible_vue_ensemble.jpg",
        date: "2025-08-10",
        media_type: "photo"
      }
    ]
  },
  {
    year: 2024,
    month: 10,
    month_name: "Octobre 2024",
    count: 2,
    photos: [
      {
        id: 20241,
        title: "Travaux d'infrastructure & radier",
        caption: "Coulage du radier général parasismique",
        image_url: "/media/gallery_photos/photo_2024_1022_WhatsApp Image 2026-08-29 at 09.21.24 (2).jpeg",
        fallback_url: "/commun/patio_lounge_crepuscule.jpg",
        date: "2024-10-22",
        media_type: "photo"
      },
      {
        id: 20242,
        title: "Terrassements et voiles béton",
        caption: "Élévation des fondations",
        image_url: "/media/gallery_photos/photo_2024_0714_WhatsApp Image 2026-08-29 at 09.21.24 (3).jpeg",
        fallback_url: "/commun/solarium_transats_piscine.jpg",
        date: "2024-07-14",
        media_type: "photo"
      }
    ]
  }
];

export default function SmartphoneGalleryModal({ isOpen, onClose, initialYear = null }) {
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [albums, setAlbums] = useState(DEFAULT_ALBUMS);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  // Par défaut : affiche tous les albums selon la demande de l'utilisateur
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'timeline'
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'photo' | 'video'

  // Synchronise selectedYear si initialYear est fourni
  useEffect(() => {
    if (initialYear) {
      setSelectedYear(initialYear);
      setActiveTab('timeline');
    } else {
      setActiveTab('albums');
    }
  }, [initialYear, isOpen]);

  // Chargement des données timeline & albums depuis l'API Django
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const fetchGalleryData = async () => {
      try {
        const [timelineRes, albumsRes] = await Promise.all([
          fetch('/api/timeline/'),
          fetch('/api/albums/'),
        ]);

        if (timelineRes.ok) {
          const tData = await timelineRes.json();
          setTimeline(tData.timeline || []);
        }

        if (albumsRes.ok) {
          const aData = await albumsRes.json();
          setAlbums(aData || []);
        }
      } catch (err) {
        console.error('Erreur chargement galerie:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [isOpen]);

  // Navigation clavier pour la Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (lightboxPhoto) {
        if (e.key === 'Escape') {
          setLightboxPhoto(null);
        } else if (e.key === 'ArrowRight') {
          handleNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          handlePrevPhoto();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxPhoto, lightboxIndex, timeline, selectedYear]);

  if (!isOpen) return null;

  const allFilteredPhotos = timeline
    .filter((group) => !selectedYear || group.year === Number(selectedYear))
    .flatMap((group) => group.photos)
    .filter((item) => {
      if (mediaFilter === 'video') return item.media_type === 'video' || Boolean(item.video_url);
      if (mediaFilter === 'photo') return item.media_type !== 'video' && !item.video_url;
      return true;
    });

  const filteredTimeline = timeline
    .filter((group) => !selectedYear || group.year === Number(selectedYear))
    .map((group) => {
      const items = group.photos.filter((item) => {
        if (mediaFilter === 'video') return item.media_type === 'video' || Boolean(item.video_url);
        if (mediaFilter === 'photo') return item.media_type !== 'video' && !item.video_url;
        return true;
      });
      return { ...group, photos: items, count: items.length };
    })
    .filter((group) => group.photos.length > 0);

  const handleOpenLightbox = (photo) => {
    const idx = allFilteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxPhoto(photo);
  };

  const handleNextPhoto = () => {
    if (allFilteredPhotos.length === 0) return;
    const nextIdx = (lightboxIndex + 1) % allFilteredPhotos.length;
    setLightboxIndex(nextIdx);
    setLightboxPhoto(allFilteredPhotos[nextIdx]);
  };

  const handlePrevPhoto = () => {
    if (allFilteredPhotos.length === 0) return;
    const prevIdx = (lightboxIndex - 1 + allFilteredPhotos.length) % allFilteredPhotos.length;
    setLightboxIndex(prevIdx);
    setLightboxPhoto(allFilteredPhotos[prevIdx]);
  };

  const handleSelectAlbum = (year) => {
    setSelectedYear(year);
    setActiveTab('timeline');
  };

  // Liste des années disponibles
  const availableYears = Array.from(new Set(timeline.map((g) => g.year))).sort((a, b) => b - a);

  // Compteurs globaux
  const totalMediaCount = timeline.reduce((acc, g) => acc + g.count, 0);

  return (
    <>
      {/* MODAL SIMULATION SMARTPHONE */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
        {/* CADRE SIMULATION APPLICATION MOBILE / SMARTPHONE HIGH-END */}
        <div className="w-full max-w-5xl h-[95vh] sm:h-[90vh] bg-ghardn-dark-900 border border-white/20 rounded-[22px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative font-sans">
        
        {/* BARRE SUPÉRIEURE DE NAVIGATION */}
        <div className="bg-ghardn-dark-800/95 border-b border-white/10 px-3.5 sm:px-8 py-3 sm:py-4 shrink-0 backdrop-blur-xl z-20">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* TITRE DE LA PHOTOTHÈQUE */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-ghardn-red animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs tracking-widest text-ghardn-red font-semibold uppercase font-sans truncate">
                  Photothèque & Vidéothèque Résidentielle
                </p>
                <h2 className="text-sm sm:text-xl font-serif font-bold text-white tracking-wide truncate">
                  {activeTab === 'albums' 
                    ? 'Tous les Albums par Année' 
                    : selectedYear 
                    ? `Album Année ${selectedYear}` 
                    : 'Toutes les Photos & Vidéos'}
                </h2>
              </div>
            </div>

            {/* TABS DE NAVIGATION (DESKTOP) */}
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-black/50 p-1 rounded-full border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('albums');
                  setSelectedYear(null);
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-300 ${
                  activeTab === 'albums'
                    ? 'bg-ghardn-red text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Tous les Albums ({albums.length})
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-300 ${
                  activeTab === 'timeline'
                    ? 'bg-ghardn-red text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Tous les Médias ({totalMediaCount})
              </button>
            </div>

            {/* BOUTON FERMER CIRCULAIRE PROPRE AVEC ICÔNE X */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center transition-all duration-300 border border-white/15 shrink-0 cursor-pointer shadow-sm active:scale-95"
              aria-label="Fermer la galerie"
              title="Fermer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>

          {/* TABS DE NAVIGATION SUR MOBILE */}
          <div className="flex md:hidden items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 mt-2.5 w-full">
            <button
              onClick={() => {
                setActiveTab('albums');
                setSelectedYear(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium font-sans text-center transition-all duration-300 ${
                activeTab === 'albums'
                  ? 'bg-ghardn-red text-white shadow-md font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Albums ({albums.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium font-sans text-center transition-all duration-300 ${
                activeTab === 'timeline'
                  ? 'bg-ghardn-red text-white shadow-md font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Médias ({totalMediaCount})
            </button>
          </div>
        </div>

        {/* SOUS-BARRE : RETOUR, FILTRES D'ANNÉES ET FILTRE PHOTO/VIDÉO */}
        <div className="bg-ghardn-dark-800/50 border-b border-white/5 px-3.5 sm:px-8 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
          {activeTab === 'timeline' ? (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
              <button
                onClick={() => {
                  setActiveTab('albums');
                  setSelectedYear(null);
                }}
                className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-sans font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Albums</span>
              </button>
              
              <span className="text-white/30 hidden sm:inline">|</span>

              <button
                onClick={() => setSelectedYear(null)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all shrink-0 ${
                  selectedYear === null
                    ? 'bg-white text-black font-semibold shadow'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Toutes
              </button>

              {availableYears.map((yr) => (
                <button
                  key={`yr-${yr}`}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all shrink-0 ${
                    selectedYear === yr
                      ? 'bg-white text-black font-semibold shadow'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}

              <span className="text-white/30 hidden sm:inline ml-1">|</span>

              {/* FILTRES PAR TYPE DE MÉDIA (PHOTOS / VIDÉOS) */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  onClick={() => setMediaFilter('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-sans transition-all ${
                    mediaFilter === 'all'
                      ? 'bg-ghardn-red text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setMediaFilter('photo')}
                  className={`px-2 py-0.5 rounded text-[11px] font-sans transition-all ${
                    mediaFilter === 'photo'
                      ? 'bg-ghardn-red text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  📷 Photos
                </button>
                <button
                  onClick={() => setMediaFilter('video')}
                  className={`px-2 py-0.5 rounded text-[11px] font-sans transition-all ${
                    mediaFilter === 'video'
                      ? 'bg-ghardn-red text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  ▶ Vidéos
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[11px] sm:text-xs text-white/60 font-sans truncate">
              Sélectionnez un album pour parcourir les photos & vidéos par mois.
            </p>
          )}

          <p className="text-[11px] text-white/40 font-sans hidden md:block shrink-0">
            {allFilteredPhotos.length} média(s) affiché(s)
          </p>
        </div>

        {/* ZONE DE CONTENU PRINCIPALE */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-white/60">
              <div className="w-8 h-8 border-2 border-ghardn-red border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-sans tracking-widest uppercase">Chargement de la galerie...</p>
            </div>
          ) : activeTab === 'albums' ? (
            
            /* VUE 1 (PAR DÉFAUT) : TOUS LES ALBUMS PAR ANNÉE */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div
                    key={`album-card-${album.id}`}
                    onClick={() => handleSelectAlbum(album.year)}
                    className="group bg-ghardn-dark-800/80 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-ghardn-red transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                      <img
                        src={album.cover_image_url || album.cover_image}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-bold text-white font-sans tracking-wide">
                          ANNÉE {album.year}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-ghardn-red/90 px-3 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-sans text-white font-medium">
                          {album.photos_count} média{album.photos_count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-white group-hover:text-ghardn-red transition-colors">
                          {album.title}
                        </h4>
                        {album.subtitle && (
                          <p className="text-xs text-ghardn-red/90 font-sans mt-1">
                            {album.subtitle}
                          </p>
                        )}
                        {album.description && (
                          <p className="text-xs text-white/60 font-sans mt-2 line-clamp-3 leading-relaxed">
                            {album.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-white/70">Consulter l'album</span>
                        <span className="text-ghardn-red font-bold font-sans group-hover:translate-x-1 transition-transform">
                          Voir les {album.photos_count} médias &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOUTON GLOBAL POUR EXPLORER TOUTES LES PHOTOS & VIDÉOS */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setSelectedYear(null);
                    setActiveTab('timeline');
                  }}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-ghardn-red text-white text-xs font-semibold uppercase tracking-wider transition-all border border-white/20"
                >
                  Voir tous les médias confondus &rarr;
                </button>
              </div>
            </div>

          ) : (

            /* VUE 2 : PHOTOS & VIDÉOS GROUPÉES PAR MOIS (TIMELINE SMARTPHONE) */
            filteredTimeline.length === 0 ? (
              <div className="text-center py-20 text-white/50">
                <p className="text-base font-serif">Aucun média trouvé pour cette sélection.</p>
                <button
                  onClick={() => {
                    setActiveTab('albums');
                    setSelectedYear(null);
                  }}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-white"
                >
                  Retour aux albums
                </button>
              </div>
            ) : (
              filteredTimeline.map((group) => (
                <div key={`group-${group.year}-${group.month}`} className="space-y-3.5">
                  
                  {/* EN-TÊTE STICKY DE MOIS */}
                  <div className="sticky top-0 z-10 bg-ghardn-dark-900/95 backdrop-blur-md py-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                        {group.month_name}
                      </h3>
                      <span className="text-xs font-sans font-medium text-ghardn-red tracking-wider">
                        {group.year}
                      </span>
                    </div>
                    <span className="text-xs text-white/50 font-sans">
                      {group.count} média{group.count > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* GRILLE DES PHOTOS & VIDÉOS DU MOIS */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                    {group.photos.map((photo) => {
                      const isVideo = photo.media_type === 'video' || Boolean(photo.video_url);

                      return (
                        <div
                          key={`photo-${photo.id}`}
                          onClick={() => handleOpenLightbox(photo)}
                          className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/80 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-ghardn-red hover:shadow-xl"
                        >
                          {isVideo && !photo.image_url ? (
                            <video
                              src={photo.video_url || photo.video}
                              className="w-full h-full object-cover pointer-events-none"
                              muted
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={photo.image_url || photo.image}
                              alt={photo.title || 'Média galerie'}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          
                          {/* BADGE VIDÉO DÉDIÉ ET ICÔNE PLAY */}
                          {isVideo && (
                            <>
                              <div className="absolute top-2 right-2 bg-ghardn-red px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-lg flex items-center gap-1 z-10">
                                <span>▶</span>
                                <span>VIDÉO</span>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ghardn-red/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          )}

                          {/* VOILE AU SURVOL AVEC TITRE ET DATE */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 pointer-events-none">
                            <p className="text-xs font-serif font-semibold text-white line-clamp-1">
                              {photo.title || (isVideo ? 'Vidéo du chantier' : 'Photo du chantier')}
                            </p>
                            <p className="text-[10px] text-white/70 font-sans mt-0.5">
                              {photo.date_taken}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            )

          )}

        </div>

        {/* PIED DE FENÊTRE */}
        <div className="bg-ghardn-dark-800/90 border-t border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-white/50 shrink-0 font-sans">
          <span>Résidence GHARDN PROM · Galerie Multimédia</span>
          <span>Photos & Vidéos Haute Résolution</span>
        </div>

        </div>
      </div>

      {/* LIGHTBOX GRAND FORMAT AVEC GESTION PHOTO & VIDÉO ET Z-INDEX ABSOLU ÉTANCHÉIFIÉ (RÉSOUT LE PROBLÈME D'AFFICHAGE) */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-[#06080d] flex flex-col justify-between p-3 sm:p-6 animate-fadeIn font-sans isolate overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {/* BARRE SUPÉRIEURE DE LA VISIONNEUSE */}
          <div className="flex items-center justify-between z-20 px-1 pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs font-sans tracking-widest text-ghardn-red uppercase font-semibold">
                {lightboxPhoto.media_type === 'video' || lightboxPhoto.video_url ? 'Vidéo' : 'Photo'} {lightboxIndex + 1} / {allFilteredPhotos.length}
              </span>
              <span className="text-xs text-white/60 font-sans hidden sm:inline">
                {lightboxPhoto.album_title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxPhoto(null)}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg active:scale-95"
                title="Fermer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* MÉDIA CENTRAL (IMAGE OU VIDÉO PLAYBACK) AVEC BOUTONS PRÉCÉDENT / SUIVANT */}
          <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 select-none">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl cursor-pointer active:scale-95"
              aria-label="Média précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>

            {lightboxPhoto.media_type === 'video' || lightboxPhoto.video_url ? (
              <video
                key={`video-item-${lightboxPhoto.id}`}
                src={lightboxPhoto.video_url || lightboxPhoto.video}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] max-w-[92vw] sm:max-w-[85vw] rounded-xl sm:rounded-2xl shadow-2xl border border-white/15 bg-black"
              />
            ) : (
              <img
                src={lightboxPhoto.image_url || lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="max-h-[75vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 transition-all duration-300"
              />
            )}

            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl cursor-pointer active:scale-95"
              aria-label="Média suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* LÉGENDE INFÉRIEURE */}
          <div className="max-w-2xl mx-auto text-center z-20 space-y-1">
            <h4 className="text-base sm:text-lg font-serif font-bold text-white">
              {lightboxPhoto.title || (lightboxPhoto.media_type === 'video' ? 'Vidéo du Chantier' : 'Photographie du Chantier')}
            </h4>
            <div className="flex items-center justify-center gap-3 text-xs text-white/60 font-sans">
              <span>{lightboxPhoto.month_name} {lightboxPhoto.year}</span>
              <span>·</span>
              <span>Prise de vue : {lightboxPhoto.date_taken}</span>
            </div>
            {lightboxPhoto.caption && (
              <p className="text-xs sm:text-sm text-white/70 font-sans mt-1">
                {lightboxPhoto.caption}
              </p>
            )}
          </div>

        </div>
      )}
    </>
  );
}
