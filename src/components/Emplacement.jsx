import React from 'react';
import { MapPin, Navigation, Car, ShoppingBag, ShieldCheck, Sun } from 'lucide-react';

export default function Emplacement() {
  const points = [
    {
      time: '02 MIN',
      title: 'Commerces & Boutiques',
      desc: 'Supermarchés, boulangeries artisanales et pharmacies à proximité immédiate.',
      icon: ShoppingBag,
    },
    {
      time: '05 MIN',
      title: 'Hyper Centre-Ville',
      desc: 'Accès rapide aux artères principales, banques et centres administratifs.',
      icon: Navigation,
    },
    {
      time: '10 MIN',
      title: 'Littoral & Promenade',
      desc: 'Proximité des espaces verts et du bord de mer pour vos moments de détente.',
      icon: Sun,
    },
    {
      time: '15 MIN',
      title: 'Aéroport & Gare',
      desc: 'Liaison directe avec les grands axes de transport régionaux et internationaux.',
      icon: Car,
    },
  ];

  return (
    <section id="emplacement" className="py-24 bg-ghardn-dark-900 text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ghardn-red/10 border border-ghardn-red/30 text-ghardn-red text-xs uppercase tracking-mega font-bold mb-4 font-mono">
            <MapPin className="w-3.5 h-3.5" /> EMPLACEMENT PRIVILÉGIÉ
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-display">
            AU CŒUR DE LA VILLE, <br />
            <span className="text-ghardn-red font-light">PROCHE DE TOUT</span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed font-sans">
            La signature <strong className="text-white">GHARDN PROM</strong> s'installe dans un quartier prisé conciliant sérénité résidentielle et connectivité urbaine totale.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl bg-ghardn-dark-800 border border-white/10 hover:border-ghardn-red/40 transition-all duration-300 transform hover:-translate-y-1 shadow-luxury"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-ghardn-red font-display tracking-wider">
                    {pt.time}
                  </span>
                  <div className="p-2.5 rounded-lg bg-ghardn-dark border border-white/10">
                    <IconComp className="w-5 h-5 text-gray-300" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 font-display">
                  {pt.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Location Banner Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-ghardn-red/20 border border-ghardn-red flex items-center justify-center shrink-0 shadow-red-glow">
              <MapPin className="w-7 h-7 text-ghardn-red" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ghardn-red font-bold">
                PROMOTION CERTIFIÉE GHARDN PROM
              </span>
              <h4 className="text-xl font-bold text-white uppercase font-display tracking-wider mt-0.5">
                Adresse d'Exception & Valorisation Garantie
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xl font-sans">
                Un investissement sécurisé dans une zone urbaine à forte plus-value patrimoniale.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
              <ShieldCheck className="w-4 h-4 text-ghardn-red" />
              <span>Secteur Résidentiel Calme</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
