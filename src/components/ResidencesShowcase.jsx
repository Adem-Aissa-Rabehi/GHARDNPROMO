import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, X, Eye, ChevronLeft, ChevronRight, Layers, Sparkles, Camera } from 'lucide-react';

const apartmentTypes = [
  {
    id: 'f4-prestige',
    tag: 'F4 PRESTIGE',
    title: 'Penthouse F4 Prestige',
    surface: '135 m²',
    rooms: '4 Pièces · 3 Chambres',
    floor: 'Dernier Étage · Vue Panoramique',
    coverImage: '/apartments/f4/sejour_salon.jpg',
    planImage: '/plans/f4.jpg',
    desc: 'La plus haute expression du luxe résidentiel. Un vaste séjour traversant baigné de lumière, une suite parentale avec dressing privé et des finitions d\'exception.',
    highlights: ['Séjour d\'exception 27.15 m²', 'Suite parentale 20.98 m² avec SDB', 'Grand balcon terrasse 13.01 m²'],
    roomsData: [
      {
        id: 'f4-balcon',
        name: 'Grand Balcon Terrasse',
        surface: '13.01 m²',
        category: 'Extérieur',
        pin: { x: 50, y: 14 },
        label: { y: 14, align: 'left' },
        desc: 'Une vaste terrasse extérieure filante idéale pour recevoir et profiter des couchers de soleil en toute sérénité.',
        specs: ['Superficie 13.01 m²', 'Garde-corps en verre sécurit', 'Revêtement de sol antidérapant', 'Éclairage étanche intégré'],
        gallery: ['/apartments/f4/sejour_salon.jpg']
      },
      {
        id: 'f4-suite',
        name: 'Suite Parentale Prestige',
        surface: '20.98 m²',
        category: 'Espace Nuit',
        pin: { x: 30, y: 28 },
        label: { y: 28, align: 'left' },
        desc: 'Une suite parentale majestueuse comprenant un espace nuit raffiné, un grand dressing privatif et sa salle de bain attenante.',
        specs: ['Salle de bain privative attenante', 'Tête de lit mur tasseaux bois & LED', 'Parquet en bois noble & marbre', 'Isolation acoustique renforcée'],
        gallery: ['/apartments/f4/suite_parentale.jpg', '/apartments/f4/salle_de_bain.jpg']
      },
      {
        id: 'f4-sdb-suite',
        name: 'Salle de Bain de la Suite',
        surface: '3.15 m²',
        category: 'Sanitaire',
        pin: { x: 36, y: 44 },
        label: { y: 44, align: 'left' },
        desc: 'Salle d\'eau privative attenante à la suite parentale équipée de sanitaire haut de gamme, meuble vasque suspendu et douche italienne.',
        specs: ['Accès privé direct depuis la Suite', 'Cabine de douche italienne vitrée', 'Sanitaires suspendus', 'VMC permanente'],
        gallery: ['/apartments/f4/salle_de_bain.jpg', '/apartments/f4/suite_parentale.jpg']
      },
      {
        id: 'f4-sdb-principale',
        name: 'Salle de Bain Principale',
        surface: '4.42 m²',
        category: 'Sanitaire',
        pin: { x: 36, y: 54 },
        label: { y: 54, align: 'left' },
        desc: 'Salle de bain indépendante située à côté de la salle de bain de la suite, équipée d\'une grande douche italienne et meuble vasque design.',
        specs: ['Douche italienne grand format', 'Sanitaires suspendus haut de gamme', 'Miroir rétroéclairé à LED', 'Ventilation VMC permanente'],
        gallery: ['/apartments/f4/salle_de_bain.jpg']
      },
      {
        id: 'f4-chambre1',
        name: 'Chambre Spacieuse 1',
        surface: '14.60 m²',
        category: 'Espace Nuit',
        pin: { x: 30, y: 70 },
        label: { y: 70, align: 'left' },
        desc: 'Grande chambre lumineuse avec dressing vitré contemporain, bureau coiffeuse intégré et finitions soignées.',
        specs: ['Surface généreuse 14.60 m²', 'Dressing vitré rétroéclairé', 'Bureau / coiffeuse sur-mesure', 'Prises USB et domotique intégrée'],
        gallery: ['/apartments/f4/chambre_1.jpg']
      },
      {
        id: 'f4-sejour',
        name: 'Grand Séjour & Reception',
        surface: '27.15 m²',
        category: 'Espace de Vie',
        pin: { x: 72, y: 24 },
        label: { y: 24, align: 'right' },
        desc: 'Un séjour traversant monumental de 27.15 m² baigné de lumière naturelle, comprenant un salon d\'exception et un espace salle à manger raffiné.',
        specs: ['Sol en marbre noble grand format', 'Canapé d\'angle & meuble TV marbre', 'Accès direct au balcon terrasse', 'Espace salle à manger avec vaisselier vitré'],
        gallery: ['/apartments/f4/sejour_salon.jpg', '/apartments/f4/sejour_salle_a_manger.jpg']
      },
      {
        id: 'f4-cuisine',
        name: 'Cuisine Haute Performance',
        surface: '12.57 m²',
        category: 'Cuisine',
        pin: { x: 52, y: 28 },
        label: { y: 38, align: 'right' },
        desc: 'Une cuisine ergonomique haut de gamme alliant lignes épurées, plan de travail marbre, électroménagers encastrés et réfrigérateur connecté Samsung.',
        specs: ['Surface optimale 12.57 m²', 'Réfrigérateur connecté Samsung Family Hub', 'Espace repas / table intégrée', 'Vitrine rétroéclairée et hotte design'],
        gallery: ['/apartments/f4/cuisine_vue_generale.jpg', '/apartments/f4/cuisine_equipement.jpg']
      },
      {
        id: 'f4-chambre2',
        name: 'Chambre 2 / Bureau',
        surface: '13.45 m²',
        category: 'Espace Nuit',
        pin: { x: 58, y: 68 },
        label: { y: 68, align: 'right' },
        desc: 'Espace polyvalent avec lit double, grand bureau suspendu, armoire dressing sur-mesure et étagères murales.',
        specs: ['Surface 13.45 m²', 'Bureau suspendu et étagères bibliothèques', 'Armoire dressing pleine hauteur', 'Éclairage d\'ambiance LED'],
        gallery: ['/apartments/f4/chambre_2_bureau.jpg']
      },
      {
        id: 'f4-hall',
        name: 'Hall & Dégagement',
        surface: '25.92 m²',
        category: 'Distribution',
        pin: { x: 70, y: 84 },
        label: { y: 84, align: 'right' },
        desc: 'Un hall d\'entrée monumental et dégagements fluides desservant harmonieusement toutes les pièces de la résidence.',
        specs: ['Vaste superficie 25.92 m²', 'Porte blindée certifiée A2P', 'Marbre noble poli au sol', 'Vidéophone couleur tactile'],
        gallery: ['/apartments/f4/sejour_salle_a_manger.jpg', '/apartments/f4/sejour_salon.jpg']
      }
    ]
  },
  {
    id: 'f3-centre',
    tag: 'F3 CENTRE',
    title: 'Résidence F3 Centre',
    surface: '88 m²',
    rooms: '3 Pièces · 2 Chambres',
    floor: 'Étage Intermédiaire',
    coverImage: '/apartments/f3_centre/sejour_salon.jpg',
    planImage: '/plans/f3_centre.jpg',
    desc: 'Un agencement contemporain optimisé favorisant les volumes ouverts et la convivialité. Cuisine ouverte sur séjour et chambres spacieuses.',
    highlights: ['Séjour de 19.36 m² ultra-lumineux', 'Chambres spacieuses de 14.91 m² et 13.81 m²', 'Balcon privé de 4.50 m²'],
    roomsData: [
      {
        id: 'f3c-balcon',
        name: 'Balcon Privatif',
        surface: '4.50 m²',
        category: 'Extérieur',
        pin: { x: 50, y: 14 },
        label: { y: 14, align: 'left' },
        desc: 'Balcon extérieur agréable accessible depuis le séjour et la cuisine pour profiter du plein air.',
        specs: ['Surface 4.50 m²', 'Sol résistant aux intempéries', 'Garde-corps contemporain'],
        gallery: ['/apartments/f3_centre/sejour_panoramique.jpg']
      },
      {
        id: 'f3c-sejour',
        name: 'Séjour Contemporain',
        surface: '19.36 m²',
        category: 'Espace de Vie',
        pin: { x: 32, y: 28 },
        label: { y: 28, align: 'left' },
        desc: 'Un salon moderne et chaleureux avec grand canapé d\'angle, coin repas convivial et larges baies vitrées inondées de lumière.',
        specs: ['Surface 19.36 m²', 'Dalles marbrées grand format', 'Espace salon & table repas ronde', 'Accès direct vers le balcon'],
        gallery: ['/apartments/f3_centre/sejour_salon.jpg', '/apartments/f3_centre/sejour_panoramique.jpg']
      },
      {
        id: 'f3c-cuisine',
        name: 'Cuisine Indépendante',
        surface: '12.64 m²',
        category: 'Cuisine',
        pin: { x: 68, y: 28 },
        label: { y: 28, align: 'right' },
        desc: 'Espace culinaire parfaitement aménagé avec vaisselier vitrine rétroéclairé, plan en quartz et table ronde.',
        specs: ['Surface 12.64 m²', 'Vitrine rétroéclairée haut de gamme', 'Plaque induction & four encastré', 'Aération naturelle & baie vitrée'],
        gallery: ['/apartments/f3_centre/cuisine.jpg']
      },
      {
        id: 'f3c-sdb',
        name: 'Salle de Bain Équipée',
        surface: '5.03 m²',
        category: 'Sanitaire',
        pin: { x: 32, y: 52 },
        label: { y: 52, align: 'left' },
        desc: 'Salle d\'eau contemporaine avec vasque à poser OTOT, faïence chevron dorée et cabine de douche vitrée.',
        specs: ['Surface 5.03 m²', 'Vasque design sur meuble suspendu', 'Carrelage motif chevron doré', 'Douche à l\'italienne avec paroi vitrée'],
        gallery: ['/apartments/f3_centre/salle_de_bain.jpg']
      },
      {
        id: 'f3c-hall',
        name: 'Hall d\'Entrée & Dressing',
        surface: '11.31 m²',
        category: 'Distribution',
        pin: { x: 68, y: 52 },
        label: { y: 52, align: 'right' },
        desc: 'Hall d\'accueil chaleureux avec grand dressing d\'entrée encastré, niches déco éclairées par LED et porte sécurisée.',
        specs: ['Superficie 11.31 m²', 'Grand placard dressing intégré', 'Niches décoratives rétroéclairées LED', 'Porte d\'entrée avec serrure numérique'],
        gallery: ['/apartments/f3_centre/hall_dressing.jpg']
      },
      {
        id: 'f3c-chambre1',
        name: 'Chambre Principale',
        surface: '14.91 m²',
        category: 'Espace Nuit',
        pin: { x: 32, y: 78 },
        label: { y: 78, align: 'left' },
        desc: 'Une belle chambre de maître spacieuse avec lit double, tête de lit capitonnée grise, coiffeuse et grande fenêtre.',
        specs: ['Superficie 14.91 m²', 'Lit double avec tête textile élégante', 'Espace coiffeuse / bureau', 'Grande luminosité naturelle'],
        gallery: ['/apartments/f3_centre/chambre_principale.jpg']
      },
      {
        id: 'f3c-chambre2',
        name: 'Chambre Secondaire',
        surface: '13.81 m²',
        category: 'Espace Nuit',
        pin: { x: 68, y: 78 },
        label: { y: 78, align: 'right' },
        desc: 'Une seconde chambre raffinée avec tête de lit capitonnée velours beige, luminaires suspendus et grande armoire dressing intégrée.',
        specs: ['Superficie 13.81 m²', 'Suspensions lumineuses sphériques', 'Armoire dressing 3 battants intégrée', 'Tête de lit capitonnée haut de gamme'],
        gallery: ['/apartments/f3_centre/chambre_2.jpg']
      }
    ]
  },
  {
    id: 'f3-sud',
    tag: 'F3 SUD',
    title: 'Résidence F3 Sud',
    surface: '94 m²',
    rooms: '3 Pièces · 2 Chambres',
    floor: 'Orientation Plein Sud',
    coverImage: '/apartments/f3_sud/sejour_salon.jpg',
    planImage: '/plans/f3_sud.jpg',
    desc: 'Une orientation plein Sud garantissant un ensoleillement optimal toute la journée. Matériaux nobles, marbre italien et balcons généreux.',
    highlights: ['Ensoleillement permanent Plein Sud', 'Séjour lumineux de 21.34 m²', 'Suite parentale 15.96 m² avec SDB'],
    roomsData: [
      {
        id: 'f3s-balcon-haut',
        name: 'Balcon Terrasse',
        surface: '4.42 m²',
        category: 'Extérieur',
        pin: { x: 42, y: 14 },
        label: { y: 14, align: 'left' },
        desc: 'Balcon extérieur privatif ensoleillé accessible directement depuis la cuisine.',
        specs: ['Superficie 4.42 m²', 'Garde-corps contemporain', 'Accès direct baie vitrée cuisine'],
        gallery: ['/apartments/f3_sud/cuisine.jpg']
      },
      {
        id: 'f3s-cuisine',
        name: 'Grande Cuisine Indépendante',
        surface: '14.32 m²',
        category: 'Cuisine',
        pin: { x: 42, y: 26 },
        label: { y: 26, align: 'left' },
        desc: 'Vaste cuisine moderne indépendante avec réfrigérateur connecté Samsung, table repas ronde et baie vitrée ouvrant sur le balcon.',
        specs: ['Grande surface 14.32 m²', 'Réfrigérateur Samsung connecté', 'Table repas familiale intégrée', 'Accès balcon indépendant'],
        gallery: ['/apartments/f3_sud/cuisine.jpg']
      },
      {
        id: 'f3s-sdb2',
        name: 'Salle d\'Eau',
        surface: '4.42 m²',
        category: 'Sanitaire',
        pin: { x: 42, y: 40 },
        label: { y: 40, align: 'left' },
        desc: 'Deuxième salle d\'eau moderne en travertin avec douche italienne et finitions soignées.',
        specs: ['Surface 4.42 m²', 'Douche à l\'italienne avec paroi vitrée', 'Robinetterie chromée de prestige', 'Revêtement mural travertin beige'],
        gallery: ['/apartments/f3_sud/salle_de_bain.jpg']
      },
      {
        id: 'f3s-sdb1',
        name: 'Salle de Bain Suite',
        surface: '4.68 m²',
        category: 'Sanitaire',
        pin: { x: 42, y: 52 },
        label: { y: 52, align: 'left' },
        desc: 'Salle de bain privative attenante à la suite parentale avec douche italienne, vasque en marbre intégrée et WC suspendu.',
        specs: ['Surface 4.68 m²', 'Vasque intégrée marbre beige', 'Douche à l\'italienne grand format', 'Meuble vasque bois et miroir'],
        gallery: ['/apartments/f3_sud/salle_de_bain.jpg', '/apartments/f3_sud/suite_parentale.jpg']
      },
      {
        id: 'f3s-suite',
        name: 'Suite Parentale Plein Sud',
        surface: '15.96 m²',
        category: 'Espace Nuit',
        pin: { x: 42, y: 72 },
        label: { y: 72, align: 'left' },
        desc: 'Suite d\'exception orientée Sud disposant d\'un grand lit double, bibliothèque intégrée, tête de lit bois et salle d\'eau privative.',
        specs: ['Chambre 15.96 m² + SDB privative', 'Bibliothèque intégrée sur-mesure', 'Tête de lit murale tasseaux bois', 'Orientation plein Sud'],
        gallery: ['/apartments/f3_sud/suite_parentale.jpg', '/apartments/f3_sud/salle_de_bain.jpg']
      },
      {
        id: 'f3s-balcon',
        name: 'Balcon Filant Sud',
        surface: '5.18 m²',
        category: 'Extérieur',
        pin: { x: 42, y: 86 },
        label: { y: 86, align: 'left' },
        desc: 'Balcon filant prolongeant le séjour et la chambre vers l\'extérieur pour profiter pleinement du soleil tout au long de la journée.',
        specs: ['Surface 5.18 m²', 'Orientation plein Sud ensoleillée', 'Garde-corps vitré sécurisé'],
        gallery: ['/apartments/f3_sud/chambre_2.jpg', '/apartments/f3_sud/sejour_salon.jpg']
      },
      {
        id: 'f3s-hall',
        name: 'Hall & Distribution',
        surface: '8.86 m²',
        category: 'Distribution',
        pin: { x: 68, y: 34 },
        label: { y: 34, align: 'right' },
        desc: 'Entrée élégante avec console en marbre, grand miroir mural et portes intérieures en bois noble.',
        specs: ['Surface 8.86 m²', 'Console design marbre & miroir', 'Portes de distribution contemporaines', 'Sol marbre poli'],
        gallery: ['/apartments/f3_sud/hall_entree.jpg']
      },
      {
        id: 'f3s-chambre',
        name: 'Chambre 2 Confort',
        surface: '12.70 m²',
        category: 'Espace Nuit',
        pin: { x: 68, y: 62 },
        label: { y: 62, align: 'right' },
        desc: 'Chambre d\'amis ou d\'enfants d\'un raffinement exceptionnel avec dressing vitré toute hauteur et large porte-fenêtre donnant sur l\'extérieur.',
        specs: ['Surface 12.70 m²', 'Grand dressing vitré rétroéclairé', 'Banquette pouf & lit douillet', 'Accès direct vers l\'extérieur ensoleillé'],
        gallery: ['/apartments/f3_sud/chambre_2.jpg']
      },
      {
        id: 'f3s-sejour',
        name: 'Séjour Plein Sud',
        surface: '21.34 m²',
        category: 'Espace de Vie',
        pin: { x: 68, y: 78 },
        label: { y: 78, align: 'right' },
        desc: 'Un salon d\'exception baigné de soleil toute la journée, avec meuble TV mural rétroéclairé, fauteuils cuir caramel et coin salle à manger.',
        specs: ['Superficie 21.34 m²', 'Meuble TV design avec niches éclairées', 'Salon cuir caramel et tissu écru', 'Espace salle à manger avec claustra'],
        gallery: ['/apartments/f3_sud/sejour_salon.jpg', '/apartments/f3_sud/sejour_coin_repas.jpg']
      }
    ]
  }
];

export default function ResidencesShowcase({ onOpenContact }) {
  const [activeCardId, setActiveCardId] = useState('f4-prestige');
  
  // Full-Screen Interactive Plan Modal State
  const [activePlanApartment, setActivePlanApartment] = useState(null);
  
  // Active Selected Room (Renders inside smooth Right Side Drawer)
  const [activeRoom, setActiveRoom] = useState(null);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Lock body scroll when plan modal is active
  useEffect(() => {
    if (activePlanApartment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveRoom(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePlanApartment]);

  const handleNextPhoto = () => {
    if (!activeRoom) return;
    setActiveGalleryIndex((prev) => (prev + 1) % activeRoom.gallery.length);
  };

  const handlePrevPhoto = () => {
    if (!activeRoom) return;
    setActiveGalleryIndex((prev) => (prev - 1 + activeRoom.gallery.length) % activeRoom.gallery.length);
  };

  const openPlanModal = (apt, e) => {
    if (e) e.stopPropagation();
    setActivePlanApartment(apt);
    setActiveRoom(null);
    setHoveredRoomId(null);
  };

  const handleSelectRoom = (room, e) => {
    if (e) e.stopPropagation();
    setActiveGalleryIndex(0);
    setActiveRoom(room);
  };

  return (
    <section id="appartements" className="py-12 sm:py-20 bg-transparent text-white relative snap-start sm:snap-center scroll-mt-6 sm:scroll-mt-12 min-h-[90vh] flex items-center">
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* LARGE FRAMED SECTION CONTAINER */}
        <div className="bg-ghardn-dark-800/95 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 border border-white/15 shadow-luxury relative overflow-hidden backdrop-blur-xl snap-center">
          
          {/* 1. HEADLINE */}
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.06] mb-2">
              Résidences <span className="font-light italic text-gray-300 font-serif">conçues pour</span> l'exception
            </h2>
          </div>

          {/* 3. 3 APARTMENT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apartmentTypes.map((apt) => {
              const isActive = activeCardId === apt.id;
              return (
                <div
                  key={apt.id}
                  onMouseEnter={() => setActiveCardId(apt.id)}
                  onClick={() => setActiveCardId(apt.id)}
                  className={`snap-center rounded-[24px] border transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer group ${
                    isActive
                      ? 'bg-ghardn-dark-900 border-ghardn-red/60 shadow-luxury scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {/* Photo Cover Card with 'Voir le Plan ↗' Button on bottom right */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={apt.coverImage}
                      alt={apt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Top Left Surface Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className="bg-black/75 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg">
                        {apt.surface}
                      </span>
                    </div>

                    {/* Bottom Right 'Voir le Plan ↗' Button */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
                      <button
                        onClick={(e) => openPlanModal(apt, e)}
                        className="bg-ghardn-red hover:bg-ghardn-red-hover text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 shadow-red-glow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Voir le Plan</span>
                        <span className="w-4 h-4 rounded-full bg-white text-ghardn-red flex items-center justify-center font-bold text-[10px]">↗</span>
                      </button>
                    </div>
                  </div>

                  {/* Text Details Area (Pushed down with generous spacing) */}
                  <div className="p-6 sm:p-7 pt-7 sm:pt-8 flex flex-col justify-between flex-1">
                    <div className="mt-1">
                      <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white group-hover:text-ghardn-red transition-colors mb-1.5">
                        {apt.title}
                      </h3>
                      <span className="text-xs text-gray-400 font-mono block mb-3.5">
                        {apt.rooms} · {apt.surface} · {apt.floor}
                      </span>

                      <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-sans mb-4 line-clamp-2">
                        {apt.desc}
                      </p>

                      <div className="space-y-2 pt-3.5 border-t border-white/10 font-sans">
                        {apt.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-ghardn-red shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* FULL-SCREEN 100VH PLAN MODAL */}
      {activePlanApartment && (
        <div className="fixed inset-0 z-50 bg-[#090b0e] text-white h-screen w-screen overflow-hidden flex flex-col animate-fadeIn select-none font-sans">
          
          {/* 1. TOP NAVBAR */}
          <div className="h-16 px-4 sm:px-6 bg-black/80 backdrop-blur-xl border-b border-white/15 flex items-center justify-between z-40 shrink-0">
            
            {/* LEFT: TITLE & APARTMENT SWITCHER */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="px-2.5 py-1 rounded-full bg-ghardn-red text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-red-glow">
                {activePlanApartment.tag}
              </span>

              <div>
                <h3 className="text-sm sm:text-xl font-bold font-display uppercase text-white leading-none">
                  {activePlanApartment.title}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono hidden sm:inline-block">
                  {activePlanApartment.surface} · {activePlanApartment.rooms} · Plan Conforme PDF
                </span>
              </div>

              {/* APARTMENT SWITCHER TABS (DESKTOP) */}
              <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-white/15">
                {apartmentTypes.map((apt) => (
                  <button
                    key={`modal-nav-${apt.id}`}
                    onClick={() => {
                      setActivePlanApartment(apt);
                      setActiveRoom(null);
                      setHoveredRoomId(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      activePlanApartment.id === apt.id
                        ? 'bg-ghardn-red text-white shadow-red-glow'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {apt.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: ACTIONS & CLOSE */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setActivePlanApartment(null);
                  onOpenContact();
                }}
                className="hidden sm:flex px-4 py-1.5 rounded-full bg-ghardn-red hover:bg-ghardn-red-hover text-white text-xs font-bold uppercase tracking-wider items-center gap-2 shadow-red-glow"
              >
                <span>Réserver</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActivePlanApartment(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center transition-colors border border-white/20"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. MAIN VIEWPORT (FULL PLAN ON MOBILE & DESKTOP + POP-OUT SIDE DRAWER WHEN ROOM CLICKED) */}
          <div className="flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between overflow-hidden relative bg-black/90">
            
            {/* PLAN CANVAS CONTAINER (FULL SCREEN MOBILE & DESKTOP) */}
            <div className="flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden relative">
              
              {/* PLAN IMAGE WRAPPER DIV - EXACT MATCH OF IMAGE BOUNDS */}
              <div className="relative inline-block transition-all duration-500 max-h-[calc(100vh-90px)] sm:max-h-[calc(100vh-140px)] max-w-[calc(100vw-16px)] lg:max-w-[calc(100vw-480px)]">
                
                {/* ARCHITECTURAL PLAN IMAGE */}
                <img
                  src={activePlanApartment.planImage}
                  alt={`Plan ${activePlanApartment.title}`}
                  className="max-h-[calc(100vh-90px)] sm:max-h-[calc(100vh-140px)] w-auto max-w-full object-contain rounded-xl filter brightness-110 contrast-105 shadow-2xl border border-white/20 block"
                />

                {/* --- MOBILE DISPLAY: SUBTLE/LIGHT TEXT TAGS PLACED DIRECTLY ON THE ROOMS THEMSELVES (ECRITURE SEULEMENT) --- */}
                <div className="block md:hidden">
                  {activePlanApartment.roomsData.map((room) => {
                    const isHovered = hoveredRoomId === room.id || activeRoom?.id === room.id;
                    const pinPos = room.pin;

                    return (
                      <div
                        key={`mobile-room-tag-${room.id}`}
                        style={{
                          left: `${pinPos.x}%`,
                          top: `${pinPos.y}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => handleSelectRoom(room, e)}
                          className={`px-2.5 py-1 rounded-md text-[9px] font-sans font-light tracking-wide transition-all duration-300 flex items-center whitespace-nowrap border shadow-sm backdrop-blur-[3px] cursor-pointer ${
                            isHovered
                              ? 'bg-ghardn-red/95 text-white border-white scale-110 shadow-red-glow font-semibold z-40'
                              : 'bg-black/45 text-white/95 border-white/20 hover:bg-ghardn-red hover:text-white hover:border-white'
                          }`}
                        >
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{room.name}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* --- DESKTOP DISPLAY: SVG LEADER LINES EXTENDING FROM ROOMS STRAIGHT TO LEFT (0%) OR RIGHT (100%) BORDER --- */}
                <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                  <defs>
                    <filter id="glow-line-drawer" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {activePlanApartment.roomsData.map((room) => {
                    const isHovered = hoveredRoomId === room.id || activeRoom?.id === room.id;
                    const pinPos = room.pin;
                    const labelPos = room.label;
                    const isLeft = labelPos.align === 'left';
                    const edgeX = isLeft ? 0 : 100;

                    return (
                      <g key={`svg-drawer-line-${room.id}`}>
                        {/* LEADER LINE EXTENDING FROM ROOM PIN TO IMAGE BORDER EDGE */}
                        <line
                          x1={`${pinPos.x}%`}
                          y1={`${pinPos.y}%`}
                          x2={`${edgeX}%`}
                          y2={`${labelPos.y}%`}
                          stroke={isHovered ? '#E20916' : 'rgba(226, 9, 22, 0.85)'}
                          strokeWidth={isHovered ? '3.5' : '2'}
                          strokeDasharray={isHovered ? 'none' : '4 3'}
                          filter={isHovered ? 'url(#glow-line-drawer)' : undefined}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* DESKTOP CLICKABLE CALLOUT LABELS ATTACHED RIGHT OUTSIDE LEFT/RIGHT BORDER (ECRITURE SEULEMENT) */}
                <div className="hidden md:block">
                  {activePlanApartment.roomsData.map((room) => {
                    const isHovered = hoveredRoomId === room.id || activeRoom?.id === room.id;
                    const labelPos = room.label;
                    const isLeft = labelPos.align === 'left';

                    return (
                      <div
                        key={`drawer-label-${room.id}`}
                        style={{
                          top: `${labelPos.y}%`,
                          left: isLeft ? 0 : undefined,
                          right: !isLeft ? 0 : undefined,
                          transform: `translate(${isLeft ? '-100%' : '100%'}, -50%)`,
                          paddingLeft: !isLeft ? '12px' : 0,
                          paddingRight: isLeft ? '12px' : 0
                        }}
                        className="absolute z-30 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => handleSelectRoom(room, e)}
                          onMouseEnter={() => setHoveredRoomId(room.id)}
                          onMouseLeave={() => setHoveredRoomId(null)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans tracking-wide uppercase transition-all duration-300 flex items-center whitespace-nowrap border shadow-2xl backdrop-blur-md cursor-pointer ${
                            isHovered
                              ? 'bg-ghardn-red text-white border-white scale-105 shadow-red-glow z-40'
                              : 'bg-black/90 text-gray-100 border-ghardn-red/80 hover:bg-ghardn-red hover:text-white hover:border-white'
                          }`}
                        >
                          <span className="font-semibold">{room.name}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* BOTTOM INSTRUCTION BAR */}
              <div className="absolute bottom-3 left-4 right-4 z-30 flex items-center justify-between text-xs text-gray-300 font-sans pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 flex items-center gap-2 pointer-events-auto">
                  <span className="w-2 h-2 rounded-full bg-ghardn-red animate-pulse"></span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-white">{activePlanApartment.roomsData.length} Pièces Annotées</span>
                </div>

                <div className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-gray-300 pointer-events-auto hidden sm:block">
                  💡 Cliquez sur une pièce pour afficher sa galerie photo et ses caractéristiques
                </div>
              </div>

            </div>

            {/* DRAWER PANEL (DRAWER MODAL SLIDES UP FROM BOTTOM ON MOBILE, SLIDES FROM RIGHT ON DESKTOP) */}
            {activeRoom && (
              <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] rounded-t-3xl bg-ghardn-dark-900/98 backdrop-blur-2xl border-t border-white/20 shadow-2xl animate-slideUp lg:relative lg:inset-auto lg:w-[450px] lg:h-full lg:max-h-none lg:rounded-none lg:border-t-0 lg:border-l lg:bg-ghardn-dark-900 lg:animate-slideLeft flex flex-col justify-between shrink-0">
                
                <div className="h-full flex flex-col justify-between p-4 sm:p-5 overflow-y-auto custom-scrollbar">
                  
                  <div>
                    {/* DRAWER ROOM HEADER */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-ghardn-red text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-red-glow">
                          {activeRoom.surface}
                        </span>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold font-display uppercase text-white leading-tight">
                            {activeRoom.name}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] text-gray-400 font-sans">{activeRoom.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveRoom(null)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center transition-colors border border-white/20 shrink-0"
                        title="Fermer le panneau"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* TOP SECTION: PHOTO GALLERY SLIDER */}
                    <div className="mb-4">
                      <h5 className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-ghardn-red mb-2 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Photos d'Intérieur de la Pièce :</span>
                      </h5>

                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/15 group shadow-xl mb-2.5">
                        <img
                          src={activeRoom.gallery[activeGalleryIndex]}
                          alt={`${activeRoom.name} photo ${activeGalleryIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                        {/* NAVIGATION ARROWS */}
                        {activeRoom.gallery.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevPhoto}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNextPhoto}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-ghardn-red text-white flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* GALLERY COUNTER BADGE */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/75 border border-white/20 text-[9px] font-mono text-white">
                          {activeGalleryIndex + 1} / {activeRoom.gallery.length} Photos
                        </div>
                      </div>

                      {/* THUMBNAILS ROW */}
                      {activeRoom.gallery.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {activeRoom.gallery.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveGalleryIndex(idx)}
                              className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                activeGalleryIndex === idx
                                  ? 'border-ghardn-red scale-105 shadow-red-glow'
                                  : 'border-white/20 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* BOTTOM SECTION: ROOM SPECIFICATIONS & DETAILS */}
                    <div className="space-y-2.5 border-t border-white/10 pt-3">
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-1">
                          Description de l'Espace :
                        </h5>
                        <p className="text-xs text-gray-200 leading-relaxed font-sans">
                          {activeRoom.desc}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1.5">
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                          Prestations Officielles :
                        </h5>
                        {activeRoom.specs.map((spec, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5 text-ghardn-red shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTON */}
                  <div className="pt-3 border-t border-white/10 mt-3">
                    <button
                      onClick={() => {
                        setActivePlanApartment(null);
                        onOpenContact();
                      }}
                      className="w-full py-2 rounded-full bg-ghardn-red hover:bg-ghardn-red-hover text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-red-glow"
                    >
                      <span>Réserver cet appartement</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </section>
  );
}
