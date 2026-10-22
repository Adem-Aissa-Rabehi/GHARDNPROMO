import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Philosophie({ onOpenContact }) {
  return (
    <section id="philosophie" className="py-16 sm:py-24 bg-ghardn-dark text-white relative border-t border-white/10">
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* 2-COLUMN MAIN GRID (items-stretch so both columns match in height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* ================= LEFT COLUMN (h-full flex flex-col justify-between pushes cards to the bottom!) ================= */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-8">
            
            {/* Top Left: Circular Thumbnail + Main Headline */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-xl shrink-0">
                  <img 
                    src="/lobby/impact_photo.jpeg" 
                    alt="GHARDN PROM" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h2 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-white leading-[1.08]">
                  Pensé autour de <br />
                  votre style de <span className="font-light italic text-gray-400 font-serif">vie</span>
                </h2>
              </div>

              {/* Middle Left: Sub-paragraph */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-lg">
                L'architecture avant tout. Chaque plan est conçu en fonction de la vue, de l'orientation solaire et de la circulation naturelle dans votre intérieur — jamais l'inverse.
              </p>
            </div>

            {/* Bottom Left: 2 Side-by-Side Cards (Pushed to the very bottom to align with right photo!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-auto">
              
              {/* Card 1: Dark Card (100% Architect-designed) */}
              <div className="bg-[#1C1A18] text-white p-6 rounded-[24px] border border-white/15 shadow-luxury flex flex-col justify-between min-h-[150px] relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div></div>
                  <span className="bg-white/10 text-white/80 font-mono text-[10px] uppercase px-3 py-1 rounded-full border border-white/15">
                    Design
                  </span>
                </div>

                <div>
                  <div className="text-4xl font-extrabold font-display tracking-tight text-white mb-1">
                    100%
                  </div>
                  <p className="text-xs text-gray-400 font-sans">
                    Conception architecturale
                  </p>
                </div>
              </div>

              {/* Card 2: White Card (Move-in ready / Prêt à emménager) */}
              <div 
                onClick={onOpenContact}
                className="bg-white text-black p-6 rounded-[24px] shadow-2xl flex flex-col justify-between min-h-[150px] group cursor-pointer hover:bg-gray-100 transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-black">
                    Prêt à emménager
                  </h3>
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-md group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </div>

                <p className="text-[11px] text-gray-600 leading-snug font-sans">
                  Des résidences livrées complètes — aménagées, finies et prêtes pour la vie que vous imaginez.
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-8">
            
            {/* Top Right: Pill Badge • Philosophy & Description Paragraph */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200 text-xs font-mono font-medium mb-4 backdrop-blur-md">
                <span>• Philosophie</span>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans font-normal max-w-xl">
                Chaque résidence <strong className="text-white font-bold">GHARDN PROM</strong> est façonnée par son environnement. Nous concevons pour la lumière naturelle, les volumes généreux et les matériaux nobles — des intérieurs qui apaisent dès le premier pas.
              </p>
            </div>

            {/* Bottom Right: Clean Photo Card */}
            <div className="w-full aspect-[4/3] rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-white/15 relative group mt-auto">
              <img 
                src="/lobby/impact_photo.jpeg" 
                alt="GHARDN PROM Hall & Architecture" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
