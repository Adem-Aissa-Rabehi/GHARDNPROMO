import React from 'react';
import { ArrowUpRight, MapPin, ArrowUp, Phone } from 'lucide-react';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const googleMapsUrl = "https://maps.app.goo.gl/xZi8CxzAJBNL4pSD6?g_st=aw";
  const phoneNumber = "0560 32 35 30";
  const phoneHref = "tel:0560323530";
  const facebookUrl = "https://www.facebook.com/ghardn.prom/?locale=fr_FR";
  const instagramUrl = "https://www.instagram.com/ghardn.prom";
  const tiktokUrl = "https://www.tiktok.com/@ghardn.prom";

  return (
    <footer className="py-12 sm:py-20 bg-transparent text-white relative">
      {/* 100% FULL WIDTH CONTAINER */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* LARGE FRAMED FOOTER CARD */}
        <div className="bg-ghardn-dark-800/95 rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 lg:p-16 border border-white/15 shadow-luxury relative overflow-hidden backdrop-blur-xl">
          
          {/* ================= TOP ROW: LOGO & TEXT (LEFT) + MAPS JUST NEXT TO IT (RIGHT) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 mb-12 border-b border-white/15 items-center">
            
            {/* LEFT: LOGO & DESCRIPTION TEXT & RESERVATION BUTTON */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Logo GHARDN PROM WHITE (lang white.svg) */}
              <div className="flex items-center gap-3">
                <img 
                  src="/svg/lang white.svg" 
                  alt="GHARDN PROM Logo White" 
                  className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                />
              </div>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-lg">
                Une collection exclusive de résidences d'architectes façonnées avec soin. Conçues pour un art de vivre calme, contemporain et d'une qualité sans compromis.
              </p>

              {/* Actions: Bouton Réservation & Appel Téléphonique Direct */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={onOpenContact}
                  className="bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl transition-all hover:scale-105"
                >
                  <span>Réserver une visite</span>
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">↗</span>
                </button>

                <a
                  href={phoneHref}
                  className="bg-ghardn-red hover:bg-ghardn-red/90 text-white font-bold text-xs sm:text-sm font-mono px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 border border-white/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>{phoneNumber}</span>
                </a>
              </div>

              {/* Réseaux Sociaux Officiels */}
              <div className="flex items-center gap-2.5 pt-2">
                <span className="text-xs text-white/50 font-mono uppercase tracking-wider mr-1">Réseaux :</span>
                
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/10"
                  title="Facebook GHARDN PROM"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/10"
                  title="Instagram GHARDN PROM"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/10"
                  title="TikTok GHARDN PROM"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* RIGHT: GOOGLE MAPS WIDGET RIGHT NEXT TO THE LOGO/TEXT */}
            <div className="lg:col-span-6">
              <div className="bg-black/60 rounded-[28px] p-4 border border-white/15 shadow-2xl space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ghardn-red font-bold">
                    <MapPin className="w-4 h-4 text-ghardn-red" />
                    <span>Localisation Google Maps</span>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-gray-300 hover:text-white transition-colors underline flex items-center gap-1"
                  >
                    <span>Ouvrir dans Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-ghardn-red" />
                  </a>
                </div>

                {/* Interactive Google Map Frame */}
                <div className="rounded-[20px] overflow-hidden border border-white/15 h-[220px] sm:h-[240px] relative group">
                  <iframe
                    title="GHARDN PROM Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999388950851!2d2.292292615674395!3d48.85837007928746!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1647890123456!5m2!1sfr!2sfr"
                    className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-80 group-hover:opacity-100 transition-opacity"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center"
                  >
                    <span className="bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 group-hover:scale-105 transition-transform">
                      <MapPin className="w-4 h-4 text-ghardn-red" />
                      <span>Voir la position exacte sur Google Maps ↗</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ================= EN BAS DE ÇA (BELOW TOP ROW): GIANT TITLE & NAV COLUMNS ================= */}
          


          {/* 3 NAVIGATION COLUMNS (EXPLORER, SOCIÉTÉ, CONTACT) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pb-10 border-b border-white/10">
            
            {/* Column 1: EXPLORER */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 font-bold">
                EXPLORER
              </h4>
              <ul className="space-y-2 text-xs font-sans text-gray-300">
                <li><a href="#hero" className="hover:text-ghardn-red transition-colors">La Résidence</a></li>
                <li><a href="#philosophie" className="hover:text-ghardn-red transition-colors">Philosophie</a></li>
                <li><a href="#appartements" className="hover:text-ghardn-red transition-colors">Appartements (F4 / F3)</a></li>
                <li><a href="#contact" className="hover:text-ghardn-red transition-colors">Réservation Privée</a></li>
              </ul>
            </div>

            {/* Column 2: SOCIÉTÉ */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 font-bold">
                SOCIÉTÉ
              </h4>
              <ul className="space-y-2 text-xs font-sans text-gray-300">
                <li><a href="#philosophie" className="hover:text-ghardn-red transition-colors">À Propos</a></li>
                <li><a href="#contact" className="hover:text-ghardn-red transition-colors">Livraison Clé en main</a></li>
                <li><a href="#contact" className="hover:text-ghardn-red transition-colors">Garanties Décennales</a></li>
                <li><a href="#contact" className="hover:text-ghardn-red transition-colors">Mentions Légales</a></li>
                <li><a href="/admin" className="hover:text-ghardn-red transition-colors text-gray-400 hover:text-white">Portail Administration</a></li>
              </ul>
            </div>

            {/* Column 3: CONTACT & RÉSEAUX */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 font-bold">
                CONTACT & RÉSEAUX
              </h4>
              <ul className="space-y-2.5 text-xs font-sans text-gray-300">
                <li>
                  <a 
                    href={phoneHref} 
                    className="hover:text-ghardn-red transition-colors flex items-center gap-2 font-mono font-bold text-white text-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-ghardn-red" />
                    <span>{phoneNumber}</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-ghardn-red transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-white/70 group-hover:text-ghardn-red shrink-0 transition-colors" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook : @ghardn.prom</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-ghardn-red transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-white/70 group-hover:text-ghardn-red shrink-0 transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram : @ghardn.prom</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={tiktokUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-ghardn-red transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-white/70 group-hover:text-ghardn-red shrink-0 transition-colors" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                    <span>TikTok : @ghardn.prom</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-ghardn-red transition-colors flex items-center gap-2 text-white/70 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-ghardn-red shrink-0" />
                    <span>Localisation Google Maps</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT & BACK TO TOP BAR */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500">
            <div>
              © 2026 <span className="text-white font-bold">GHARDN PROM</span> — Promotion Immobilière d'Exception. Tous droits réservés.
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-gray-400 hover:text-ghardn-red transition-colors font-bold"
              >
                <span>REMONTER EN HAUT</span>
                <ArrowUp className="w-3.5 h-3.5 text-ghardn-red" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
