import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight, Sparkles, Layers, Maximize2, ShieldCheck } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    src: '/lobby/lobby_01.jpeg',
    title: 'Perspective Générale du Hall',
    category: 'Lobby Principal',
    desc: 'Lignes épurées, double hauteur sous plafond et intégration lumineuse sur-mesure.',
  },
  {
    id: 2,
    src: '/lobby/lobby_02.jpeg',
    title: 'Matériaux & Éclairage Indirect',
    category: 'Finitions & Marbre',
    desc: 'Alliance subtile du marbre poli et du bois noble traité.',
  },
  {
    id: 3,
    src: '/lobby/lobby_03.jpeg',
    title: 'Espace Accueil Conciergerie',
    category: 'Lobby Principal',
    desc: 'Comptoir d\'accueil design avec sécurité intégrée et assistance 24/7.',
  },
  {
    id: 4,
    src: '/lobby/lobby_04.jpeg',
    title: 'Salon d\'Attente Exclusive',
    category: 'Espace Lounge & Lumières',
    desc: 'Mobilier haut de gamme et ambiance feutrée pour les résidents et invités.',
  },
  {
    id: 5,
    src: '/lobby/lobby_05.jpeg',
    title: 'Ascenseurs & Accès Sécurisés',
    category: 'Finitions & Marbre',
    desc: 'Contrôle d\'accès biométrique et cabines panoramiques haute vitesse.',
  },
  {
    id: 6,
    src: '/lobby/lobby_06.jpeg',
    title: 'Verrière & Bain de Lumière',
    category: 'Espace Lounge & Lumières',
    desc: 'Lumière naturelle optimisée grâce aux grandes baies vitrées toute hauteur.',
  },
];

export default function LobbyGallery() {
  const [activeCategory, setActiveCategory] = useState('Tout voir');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = ['Tout voir', 'Lobby Principal', 'Espace Lounge & Lumières', 'Finitions & Marbre'];

  const filteredItems = activeCategory === 'Tout voir' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item) => {
    setSelectedPhoto(item);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction) => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedPhoto.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    setSelectedPhoto(filteredItems[newIndex]);
  };

  return (
    <section id="gallery" className="py-24 bg-ghardn-dark relative border-t border-white/10">
      {/* Decorative Glow Background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-ghardn-red/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-ghardn-red text-xs uppercase tracking-mega font-bold mb-2">
              <Sparkles className="w-4 h-4" /> GALERIE ARCHITECTURALE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              LE LOBBY D'EXCEPTION
            </h2>
            <p className="mt-3 text-base text-gray-400 max-w-xl font-sans">
              Découvrez chaque angle du hall d'entrée réinventé pour GHARDN PROM. Une fusion parfaite entre confort urbain et élégance intemporelle.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md text-xs uppercase tracking-widest transition-all duration-300 font-medium ${
                  activeCategory === cat
                    ? 'bg-ghardn-red text-white shadow-red-glow font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative rounded-xl overflow-hidden bg-ghardn-dark-800 border border-white/10 cursor-pointer shadow-luxury transform hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                {/* Expand Hover Icon */}
                <div className="absolute top-4 right-4 bg-ghardn-dark/80 backdrop-blur-md p-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-4 h-4 text-ghardn-red" />
                </div>

                {/* Category Pill */}
                <span className="absolute top-4 left-4 text-[10px] uppercase font-mono tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Card Footer Text */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1 font-display group-hover:text-ghardn-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Red Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-ghardn-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8">
            <div className="relative max-w-5xl w-full bg-ghardn-dark rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col lg:flex-row">
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-ghardn-red text-white p-2.5 rounded-full border border-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Photo Area */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] lg:min-h-[500px]">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto object-contain"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 bg-black/60 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 bg-black/60 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Photo Meta & Story Column */}
              <div className="w-full lg:w-80 p-6 bg-ghardn-dark-800 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ghardn-red font-bold">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-white tracking-wide mt-1 mb-3 font-display">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans mb-6">
                    {selectedPhoto.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <ShieldCheck className="w-4 h-4 text-ghardn-red" />
                      <span>Conformité PMR & Normes HQE</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Sparkles className="w-4 h-4 text-ghardn-red" />
                      <span>Matériaux durables & hypoallergéniques</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-[10px] uppercase font-mono text-gray-500">
                  GHARDN PROM ARCHITECTURE // REF-{selectedPhoto.id}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
