import React from 'react';
import { Compass, ShieldAlert, Sparkles, Cpu, Zap, Key, Sun, Building2, Ruler } from 'lucide-react';

export default function SpecsGrid() {
  const specs = [
    {
      icon: Ruler,
      title: 'Hauteur Sous Plafond',
      value: '4,20 M',
      sub: 'Volumes majestueux & confort thermique supérieur',
      accent: 'border-l-4 border-ghardn-red',
    },
    {
      icon: Sparkles,
      title: 'Marbre Italien Certifié',
      value: '100% NOBLE',
      sub: 'Plaques grand format sélectionnées en carrière',
      accent: 'border-l-4 border-white',
    },
    {
      icon: ShieldAlert,
      title: 'Conciergerie & Sécurité',
      value: '24H / 7J',
      sub: 'Présence humaine & vidéo-surveillance intelligente',
      accent: 'border-l-4 border-ghardn-red',
    },
    {
      icon: Sun,
      title: 'Éclairage Biophilique',
      value: 'LED SMART',
      sub: 'Variations lumineuses calquées sur le rythme solaire',
      accent: 'border-l-4 border-white',
    },
    {
      icon: Cpu,
      title: 'Accès Biométrique',
      value: 'SANS CONTACT',
      sub: 'Reconnaissance faciale et badges NFC chiffrés',
      accent: 'border-l-4 border-ghardn-red',
    },
    {
      icon: Zap,
      title: 'Mobilisation Électrique',
      value: 'BORNES 22KW',
      sub: 'Recharge rapide en sous-sol pour véhicules électriques',
      accent: 'border-l-4 border-white',
    },
  ];

  return (
    <section id="prestations" className="py-24 bg-ghardn-dark-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ghardn-red/10 border border-ghardn-red/30 text-ghardn-red text-xs uppercase tracking-mega font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" /> SPECIFICATIONS ARCHITECTURALES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-display">
            L'EXCELLENCE DANS CHAQUE DÉTAIL
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed font-sans">
            La signature GHARDN PROM associe l'innovation technologique aux finitions les plus prestigieuses de l'architecture contemporaine.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`glass-card p-8 rounded-xl bg-ghardn-dark-800 ${item.accent} hover:bg-ghardn-dark transition-all duration-300 transform hover:-translate-y-1 shadow-luxury group`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-lg bg-ghardn-dark border border-white/10 group-hover:border-ghardn-red/40 group-hover:bg-ghardn-red/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-ghardn-red" />
                  </div>
                  <span className="text-2xl font-extrabold text-white tracking-wider font-display">
                    {item.value}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 font-display group-hover:text-ghardn-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-ghardn-dark-800 via-ghardn-dark to-ghardn-dark-800 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ghardn-red/20 border border-ghardn-red flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 text-ghardn-red" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase font-display tracking-wider">
                Un projet immobilier d'exception au cœur de votre ville
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Des espaces conçus pour durer et valoriser votre patrimoine sur plusieurs générations.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="shrink-0 bg-white hover:bg-gray-100 text-ghardn-dark px-6 py-3 rounded-md text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md"
          >
            Consulter les caractéristiques
          </a>
        </div>

      </div>
    </section>
  );
}
