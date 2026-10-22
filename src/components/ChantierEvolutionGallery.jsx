import React, { useState, useEffect } from 'react';
import SmartphoneGalleryModal from './SmartphoneGalleryModal';

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

export default function ChantierEvolutionGallery() {
  const [albums, setAlbums] = useState(DEFAULT_ALBUMS);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Chargement des albums depuis l'API Django
  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setAlbums(data);
        }
      }
    } catch (err) {
      console.warn('Utilisation des albums par défaut:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Défilement automatique doux (pause au survol)
  useEffect(() => {
    if (isPaused || albums.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % albums.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [albums.length, isPaused]);

  const handleNextSlide = () => {
    if (albums.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % albums.length);
  };

  const handlePrevSlide = () => {
    if (albums.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + albums.length) % albums.length);
  };

  const activeAlbum = albums[currentSlide] || null;

  return (
    <section
      id="evolution-chantier"
      className="py-12 sm:py-20 bg-transparent text-white relative snap-start sm:snap-center scroll-mt-6 sm:scroll-mt-12"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* CARROUSEL PLEIN CADRE : LA PHOTO COUVRE TOUTE LA SECTION, LE TEXTE EST DIRECTEMENT DESSUS */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[85vh] sm:h-[90vh] min-h-[580px] rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/20 shadow-2xl bg-black select-none"
        >
          
          {/* SLIDES D'IMAGES EN ARRIÈRE-PLAN PLEIN ÉCRAN */}
          {albums.map((album, idx) => (
            <div
              key={`album-bg-${album.id}`}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentSlide === idx
                  ? 'opacity-100 scale-100 z-0'
                  : 'opacity-0 scale-105 pointer-events-none -z-10'
              }`}
            >
              <img
                src={album.cover_image_url || album.cover_image || album.cover_fallback}
                alt={album.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (album.cover_fallback && e.currentTarget.src !== album.cover_fallback) {
                    e.currentTarget.src = album.cover_fallback;
                  }
                }}
              />
            </div>
          ))}

          {/* VOILE DÉGRADÉ NOBLE POUR GARANTIR UNE LISIBILITÉ PARFAITE DU TEXTE */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

          {/* CONTENU DIRECTEMENT SUR LA PHOTO */}
          <div className="relative z-20 h-full flex flex-col justify-between p-4 sm:p-10 lg:p-16">
            
            {/* PARTIE SUPÉRIEURE : BADGE ET SÉLECTEUR RAPIDE DES ANNÉES */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-ghardn-red animate-pulse" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white font-sans">
                  Chronologie du Projet
                </span>
              </div>

              {/* SÉLECTEUR D'ANNÉES EN HAUT À DROITE */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/20">
                {albums.map((album, idx) => (
                  <button
                    key={`year-pill-${album.id}`}
                    onClick={() => setCurrentSlide(idx)}
                    className={`px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold transition-all ${
                      currentSlide === idx
                        ? 'bg-ghardn-red text-white shadow-md'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {album.year}
                  </button>
                ))}
              </div>
            </div>

            {/* PARTIE CENTRALE / BAS GAUCHE : ANNÉE, DATE, TITRE ET TEXTE DE L'ALBUM */}
            {activeAlbum && (
              <div className="max-w-3xl space-y-2.5 sm:space-y-4 my-auto pt-4 sm:pt-8">
                
                {/* DATE / ANNÉE MISE EN AVANT */}
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-0.5 sm:py-1 rounded-md bg-ghardn-red text-white font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                    Année {activeAlbum.year}
                  </span>
                  <span className="text-[11px] sm:text-xs font-sans text-white/70 tracking-wider">
                    {activeAlbum.photos_count} photo{activeAlbum.photos_count > 1 ? 's' : ''}
                    {activeAlbum.videos_count > 0 && ` · ${activeAlbum.videos_count} vidéo${activeAlbum.videos_count > 1 ? 's' : ''}`}
                  </span>
                </div>

                {/* GRAND TITRE EN PLAYFAIR DISPLAY */}
                <h3 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
                  {activeAlbum.title}
                </h3>

                {/* SOUS-TITRE EN MONTSERRAT */}
                {activeAlbum.subtitle && (
                  <p className="text-xs sm:text-lg text-white/90 font-sans font-medium tracking-wide">
                    {activeAlbum.subtitle}
                  </p>
                )}

                {/* TEXTE DESCRIPTIF ÉDITORIAL */}
                {activeAlbum.description && (
                  <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed max-w-2xl font-light line-clamp-3 sm:line-clamp-none">
                    {activeAlbum.description}
                  </p>
                )}

              </div>
            )}

            {/* PARTIE INFÉRIEURE : FLÈCHES DE NAVIGATION À GAUCHE & BOUTON VOIR TOUTE LA GALERIE EN BAS À DROITE */}
            <div className="flex items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-white/10">
              
              {/* FLÈCHES PRÉCÉDENT / SUIVANT */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrevSlide}
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-lg active:scale-95"
                  aria-label="Année précédente"
                >
                  <span className="text-sm sm:text-base font-bold font-sans">&larr;</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-lg active:scale-95"
                  aria-label="Année suivante"
                >
                  <span className="text-sm sm:text-base font-bold font-sans">&rarr;</span>
                </button>

                <span className="text-xs font-sans text-white/60 ml-1.5 hidden sm:inline">
                  {currentSlide + 1} / {albums.length}
                </span>
              </div>

              {/* BOUTON EN BAS À DROITE : VOIR TOUTE LA GALERIE */}
              <div>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-gradient-to-r from-ghardn-red to-red-700 hover:from-red-700 hover:to-ghardn-red text-white font-sans text-xs sm:text-sm font-bold tracking-wider uppercase shadow-2xl hover:shadow-ghardn-red/40 transition-all flex items-center gap-2 sm:gap-3 group border border-white/20 active:scale-95"
                >
                  <span>Voir la galerie</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL EXPÉRIENCE GALERIE (AFFICHE PAR DÉFAUT TOUS LES ALBUMS) */}
      <SmartphoneGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </section>
  );
}
