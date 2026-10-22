import React, { useState, useEffect } from 'react';

const commonItems = [
  {
    id: 'terrasse-1',
    tag: 'ROOFTOP PLEIN CIEL',
    surface: '66.31 m²',
    category: 'Terrasse Accessible',
    shortLabel: 'Terrasse 66 m²',
    headline: 'Terrasse panoramique en teck et solarium',
    subtitle: 'Rooftop Plein Ciel · 66.31 m²',
    description: 'Une vaste terrasse panoramique de 66.31 m² habillée d\'un platelage en teck noble. Aménagée avec des pergolas bioclimatiques, des salons d\'extérieur modulables et un solarium face au coucher de soleil.',
    metrics: [
      { label: 'Surface au sol', value: '66.31 m²' },
      { label: 'Revêtement', value: 'Platelage teck imputrescible' },
      { label: 'Exposition', value: 'Plein Ciel & Coucher de Soleil' }
    ],
    image: '/commun/terrasse_accessible_vue_ensemble.jpg'
  },
  {
    id: 'piscine-1',
    tag: 'BASSIN D\'EXCEPTION',
    surface: '18.04 m²',
    category: 'Piscine Panoramique',
    shortLabel: 'Piscine 18 m²',
    headline: 'Piscine suspendue en verre cristal face à l\'horizon',
    subtitle: 'Bassin de 5.64 m × 3.20 m · 18.04 m²',
    description: 'Bassin d\'exception de 18.04 m² aux dimensions précises de 5.64 m × 3.20 m. Sa paroi frontale en verre cristal transparent et ses marches rétroéclairées par LED offrent une sensation unique de nager face au vide.',
    metrics: [
      { label: 'Dimensions', value: '5.64 m × 3.20 m' },
      { label: 'Surface d\'eau', value: '18.04 m²' },
      { label: 'Paroi frontale', value: 'Verre feuilleté sécurit' }
    ],
    image: '/commun/piscine_verre_couchant.jpg'
  },
  {
    id: 'piscine-2',
    tag: 'ARCHITECTURE & SKYLINE',
    surface: '18.04 m²',
    category: 'Piscine & Pergola',
    shortLabel: 'Bassin & Pergola',
    headline: 'Perspective d\'angle sous pergola bioclimatique',
    subtitle: 'Régulation thermique & ambiance nocturne',
    description: 'Une mise en lumière spectaculaire au crépuscule soulignant l\'harmonie entre les boiseries en teck, la structure suspendue et la vue imprenable sur la ville.',
    metrics: [
      { label: 'Éclairage intégré', value: 'LEDs d\'ambiance indirectes' },
      { label: 'Pergola', value: 'Structure contemporaine' },
      { label: 'Vue panoramique', value: 'Dégagée sur la ville' }
    ],
    image: '/commun/piscine_panoramique_pergola.jpg'
  },
  {
    id: 'terrasse-2',
    tag: 'DÉTENTE EN PLEIN AIR',
    surface: '66.31 m²',
    category: 'Salon Lounge',
    shortLabel: 'Salon Lounge',
    headline: 'Salons d\'angle et espace de réception nocturne',
    subtitle: 'Convivialité & confort en plein ciel',
    description: 'Un espace intime pensé pour recevoir en plein air ou savourer des soirées paisibles, doté de canapés d\'angle grand confort, de tables basses et d\'appliques murales tamisées.',
    metrics: [
      { label: 'Capacité d\'accueil', value: 'Salons modulables spacieux' },
      { label: 'Ambiance', value: 'Éclairages muraux tamisés' },
      { label: 'Protection', value: 'Garde-corps en verre sécurit' }
    ],
    image: '/commun/terrasse_salon_angle_cosy.jpg'
  },
  {
    id: 'solarium',
    tag: 'PLAGE & BIEN-ÊTRE',
    surface: '66.31 m²',
    category: 'Solarium & Plage',
    shortLabel: 'Solarium',
    headline: 'Bain de soleil et transats en bord de bassin',
    subtitle: 'Espace relaxation au fil de l\'eau',
    description: 'Zone de détente privative directement attenante à la piscine suspendue pour profiter d\'un ensoleillement optimal toute la journée dans un cadre contemporain.',
    metrics: [
      { label: 'Mobilier', value: 'Transats cuir & teck' },
      { label: 'Accès direct', value: 'Bassin & plage immergée' },
      { label: 'Orientation', value: 'Ensoleillement continu' }
    ],
    image: '/commun/solarium_transats_piscine.jpg'
  },
  {
    id: 'patio-1',
    tag: 'COUR PRIVATIVE & HALL',
    surface: '23.47 m²',
    category: 'Cour Intérieure',
    shortLabel: 'Cour 23 m²',
    headline: 'Cour arborée à ciel ouvert et double ascenseur',
    subtitle: 'Cour de 23.47 m² · 2 Ascenseurs 5P',
    description: 'Un patio privatif de 23.47 m² apportant lumière zénithale et fraîcheur naturelle, complété par un hall d\'accueil moderne équipé de deux ascenseurs 5 personnes (Asc 5P) et d\'un sas d\'accès sécurisé.',
    metrics: [
      { label: 'Surface de la cour', value: '23.47 m² à ciel ouvert' },
      { label: 'Ascenseurs', value: '2 cabines · 5 personnes (Asc 5P)' },
      { label: 'Sécurisation', value: 'SAS d\'accès contrôlé' }
    ],
    image: '/commun/patio_lounge_crepuscule.jpg'
  }
];

export default function EspacesCommuns({ onOpenContact }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // DÉFILEMENT AUTOMATIQUE DES IMAGES & DU TEXTE TOUTES LES 4.5 SECONDES
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % commonItems.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeItem = commonItems[activeIndex];

  return (
    <section id="espaces-communs" className="py-12 sm:py-20 bg-transparent text-white relative snap-start sm:snap-center scroll-mt-6 sm:scroll-mt-12 min-h-[90vh] flex items-center">
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* CADRE PRINCIPAL EN VERRE DÉPOLI SOMBRE AVEC ARRIÈRE-PLAN BLUR MOTION DYNAMIQUE */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-ghardn-dark-800/95 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 border border-white/15 shadow-luxury relative overflow-hidden backdrop-blur-xl snap-center"
        >
          
          {/* FOND DYNAMIQUE AVEC EFFET BLUR MOTION QUI CHANGE À CHAQUE DÉFILEMENT */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[32px] sm:rounded-[40px]">
            {commonItems.map((item, idx) => (
              <div
                key={`bg-${item.id}`}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  activeIndex === idx ? 'opacity-40 scale-110' : 'opacity-0 scale-100'
                }`}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover filter blur-[60px] sm:blur-[90px] saturate-150 transform transition-transform duration-1000"
                />
              </div>
            ))}
            {/* Voile sombre pour garantir un contraste optimal et préserver l'élégance sombre */}
            <div className="absolute inset-0 bg-ghardn-dark-900/80 backdrop-blur-md"></div>
          </div>

          {/* CONTENU PRINCIPAL PAR-DESSUS LE FOND BLUR MOTION */}
          <div className="relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* COLONNE GAUCHE : GRANDE PHOTO PRINCIPALE ÉLARGIE POUR AFFICHER L'ENSEMBLE DU PANORAMA */}
              <div className="lg:col-span-7 xl:col-span-7">
                <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/10.5] w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[460px] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/20 bg-black/70 shadow-2xl group select-none">
                  
                  {/* SLIDESHOW D'IMAGES AVEC TRANSITION FLUIDE ET VUE PANORAMIQUE COMPLÈTE */}
                  {commonItems.map((item, idx) => (
                    <img
                      key={`main-${item.id}`}
                      src={item.image}
                      alt={item.headline}
                      className={`absolute inset-0 w-full h-full object-cover sm:object-cover transition-all duration-700 ease-out ${
                        activeIndex === idx
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-105 z-0 pointer-events-none'
                      }`}
                    />
                  ))}
                  
                  {/* DÉGRADÉ SOMBRE EN BAS POUR LA LISIBILITÉ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-20"></div>

                  {/* TEXTE PUR EN BAS DE LA PHOTO (AUCUN ICONE NI EMOJI) */}
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 pointer-events-none z-30">
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-ghardn-red font-bold block mb-1">
                      {activeItem.tag} — {activeItem.surface}
                    </span>
                    <h4 className="text-lg sm:text-2xl font-bold font-display uppercase tracking-wide text-white leading-tight">
                      {activeItem.headline}
                    </h4>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE : TEXTE DYNAMIQUE + SUPERFICIES DU PLAN + LIGNE DE VIGNETTES EN BAS */}
              <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* BLOC TEXTUEL QUI CHANGE SYNCHRONISÉ AVEC L'IMAGE */}
                <div className="transition-all duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-ghardn-red font-bold">
                      ESPACES COMMUNS — {activeItem.tag}
                    </span>

                    {/* COMPTEUR & INDICATEUR DE DÉFILEMENT */}
                    <span className="text-xs font-mono text-gray-400">
                      0{activeIndex + 1} / 0{commonItems.length}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white mb-2 leading-tight">
                    {activeItem.headline}
                  </h2>

                  <div className="text-xs sm:text-sm font-mono text-gray-300 font-bold mb-3">
                    {activeItem.subtitle}
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed mb-5">
                    {activeItem.description}
                  </p>

                  {/* 3 BLOCS DE SUPERFICIES DU PLAN (TEXTE PUR, CLIQUABLES) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeItem.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl border border-white/15 bg-white/5 transition-all duration-300"
                      >
                        <span className="text-[10px] font-mono font-bold text-ghardn-red uppercase tracking-wider block mb-0.5">
                          {metric.label}
                        </span>
                        <div className="text-xs sm:text-sm font-bold font-display text-white">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LIGNE DE VIGNETTES EN BAS (ARRONDIS CÔTE À CÔTE) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gray-400 font-bold">
                      GALERIE PHOTOGRAPHIQUE
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      DÉFILEMENT AUTOMATIQUE
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {commonItems.map((item, idx) => {
                      const isSelected = activeIndex === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveIndex(idx)}
                          className={`relative aspect-[4/3] rounded-[14px] sm:rounded-[16px] overflow-hidden border-2 transition-all duration-300 cursor-pointer group text-left ${
                            isSelected
                              ? 'border-ghardn-red scale-[1.04] shadow-red-glow ring-2 ring-ghardn-red/40'
                              : 'border-white/15 opacity-65 hover:opacity-100 hover:border-white/40'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.headline}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                          
                          {/* ÉTIQUETTE TEXTE SUR CHAQUE VIGNETTE */}
                          <div className="absolute bottom-1 left-1 right-1 pointer-events-none">
                            <span className="text-[8px] font-mono text-white font-bold block truncate">
                              {item.shortLabel}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOUTON D'ACTION EN BAS (TEXTE SEULEMENT) */}
                <div className="pt-2">
                  <button
                    onClick={() => onOpenContact && onOpenContact()}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ghardn-red hover:bg-ghardn-red-hover text-white font-bold text-xs uppercase tracking-widest transition-all shadow-red-glow hover:scale-[1.02]"
                  >
                    Demander une visite
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
