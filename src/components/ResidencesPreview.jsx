import React, { useState } from 'react';
import { Home, ArrowRight, Download, Check, Sparkles, LayoutGrid } from 'lucide-react';

export default function ResidencesPreview({ onOpenContact }) {
  const [selectedType, setSelectedType] = useState('f3-centre');

  const typologies = [
    {
      id: 'f3-centre',
      name: 'RÉSIDENCE F3 CENTRE',
      surface: '88 M²',
      balcony: '12 M²',
      exposure: 'Plein Sud // Vue Dégagée',
      rooms: '3 Pièces • 2 Chambres • 1 Suite',
      desc: 'Agencement optimal au cœur du bâtiment avec double séjour traversant et baie vitrée panoramique.',
      tag: 'Disponible immédiat',
    },
    {
      id: 'f3-sud',
      name: 'RÉSIDENCE F3 SUD',
      surface: '94 M²',
      balcony: '18 M² Terrasse',
      exposure: 'Sud-Ouest // Luminosité Maximale',
      rooms: '3 Pièces • 2 Suites Master • Dressing',
      desc: 'Espace de vie étendu s\'ouvrant sur une vaste terrasse privative en marbre synthétique.',
      tag: 'Dernières opportunités',
    },
    {
      id: 'f4-prestige',
      name: 'RÉSIDENCE F4 PRESTIGE',
      surface: '135 M²',
      balcony: '25 M² Loggia',
      exposure: 'Triple Exposition // Étage Élevé',
      rooms: '4 Pièces • 3 Chambres • 2 SDB',
      desc: 'Le nec plus ultra de la résidence : penthouse familial d\'exception avec finitions personnalisées sur-mesure.',
      tag: 'Édition Limitée',
    },
  ];

  const currentType = typologies.find(t => t.id === selectedType);

  return (
    <section id="residences" className="py-24 bg-ghardn-dark relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-ghardn-red text-xs uppercase tracking-mega font-bold mb-2">
              <Home className="w-4 h-4" /> CHOIX DES TYPOLOGIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              NOS RÉSIDENCES
            </h2>
            <p className="mt-3 text-base text-gray-400 max-w-xl font-sans">
              Sélectionnez la typologie qui correspond à vos exigences de vie. Des plans pensés dans les moindres détails.
            </p>
          </div>

          {/* Typology Switcher */}
          <div className="mt-6 md:mt-0 flex bg-ghardn-dark-800 p-1.5 rounded-xl border border-white/10">
            {typologies.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 font-bold ${
                  selectedType === t.id
                    ? 'bg-ghardn-red text-white shadow-red-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.name.replace('RÉSIDENCE ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Typology Detail Showcase Card */}
        {currentType && (
          <div className="glass-panel rounded-2xl p-8 lg:p-12 border border-white/15 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block bg-ghardn-red/20 text-ghardn-red border border-ghardn-red/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                {currentType.tag}
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold uppercase text-white font-display tracking-tight">
                {currentType.name}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed font-sans">
                {currentType.desc}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest block">Surface Habitable</span>
                  <span className="text-2xl font-bold text-white font-display">{currentType.surface}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest block">Espace Extérieur</span>
                  <span className="text-2xl font-bold text-ghardn-red font-display">{currentType.balcony}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest block">Configuration</span>
                  <span className="text-sm font-semibold text-gray-200">{currentType.rooms}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest block">Exposition</span>
                  <span className="text-sm font-semibold text-gray-200">{currentType.exposure}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenContact}
                  className="bg-ghardn-red hover:bg-ghardn-red-hover text-white px-7 py-3.5 rounded-md text-xs uppercase tracking-widest font-bold shadow-red-glow transition-all flex items-center gap-2"
                >
                  <span>Réserver cette typologie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="/plan étage.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card hover:bg-white/10 text-gray-200 border border-white/20 px-6 py-3.5 rounded-md text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-ghardn-red" />
                  <span>Plan PDF (Étage)</span>
                </a>
              </div>
            </div>

            {/* Right Visual Architectural Graphic */}
            <div className="lg:col-span-6 bg-ghardn-dark-900 rounded-xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-ghardn-red font-bold">
                  PLAN D'ÉTAGEMENT ARCHITECTURAL
                </span>
                <LayoutGrid className="w-5 h-5 text-gray-500" />
              </div>

              <div className="my-8 text-center">
                <div className="w-24 h-24 rounded-full bg-ghardn-red/10 border-2 border-ghardn-red mx-auto flex items-center justify-center mb-4 shadow-red-glow animate-pulse">
                  <Home className="w-10 h-10 text-ghardn-red" />
                </div>
                <h4 className="text-xl font-bold text-white uppercase font-display tracking-wider">
                  DISPOSITION 2.5D & ERGONOMIE
                </h4>
                <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                  Chaque pièce bénéficie d'une circulation fluide, d'une insonorisation renforcée et d'un apport lumineux optimal.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-4 border-t border-white/10">
                <span>GHARDN PROM EST. 2026</span>
                <span>SCHÉMA ARCHITECTURAL CERTIFIÉ</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
