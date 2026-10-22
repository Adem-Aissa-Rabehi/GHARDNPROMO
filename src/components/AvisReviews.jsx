import React from 'react';
import { Star, Award, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';

export default function AvisReviews() {
  const reviews = [
    {
      name: 'M. & Mme Benali',
      typology: 'Acquéreurs F4 Prestige',
      rating: 5,
      comment: 'La qualité des finitions du hall d\'entrée et la hauteur sous plafond dépassent nos attentes. GHARDN PROM a su tenir toutes ses promesses architecturales.',
      date: 'Janvier 2026',
    },
    {
      name: 'Karim S.',
      typology: 'Résident F3 Centre',
      rating: 5,
      comment: 'Un agencement parfait, une isolation phonique exemplaire et un service de conciergerie irréprochable au quotidien.',
      date: 'Février 2026',
    },
    {
      name: 'Sarah M.',
      typology: 'Investisseuse F3 Sud',
      rating: 5,
      comment: 'Accompagnement très professionnel du premier rendez-vous jusqu\'à la remise des clés. L\'emplacement est véritablement stratégique.',
      date: 'Août 2026',
    },
  ];

  return (
    <section id="avis" className="py-24 bg-ghardn-dark relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-ghardn-red text-xs uppercase tracking-mega font-bold mb-2 font-mono">
              <Award className="w-4 h-4" /> CONFIANCE & SATISFACTION
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              CE QUE DISENT NOS ACQUÉREURS
            </h2>
            <p className="mt-3 text-base text-gray-400 max-w-xl font-sans">
              La réputation de GHARDN PROM repose sur la satisfaction de nos résidents et la rigueur de nos réalisations.
            </p>
          </div>

          {/* 98% Recommandé Rating Card */}
          <div className="mt-6 md:mt-0 glass-card px-6 py-4 rounded-2xl border border-ghardn-red/40 bg-ghardn-red/10 flex items-center gap-4 shadow-red-glow">
            <div className="p-3 rounded-full bg-ghardn-red text-white">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white font-display tracking-tight block leading-none">
                98%
              </span>
              <span className="text-[11px] uppercase font-mono tracking-widest text-ghardn-red font-bold">
                Taux de Recommandation
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-2xl bg-ghardn-dark-800 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-luxury relative"
            >
              <Quote className="w-8 h-8 text-ghardn-red/20 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 mb-4 text-ghardn-red">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-ghardn-red text-ghardn-red" />
                  ))}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase text-white font-display tracking-wider">
                    {rev.name}
                  </h4>
                  <span className="text-[10px] font-mono text-ghardn-red block mt-0.5">
                    {rev.typology}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">
                  {rev.date}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
