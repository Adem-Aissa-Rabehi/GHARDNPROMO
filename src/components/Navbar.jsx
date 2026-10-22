import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Sparkles, Globe } from 'lucide-react';

export default function Navbar({ onOpenContact, hideNavbar }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ACCUEIL');
  const [currentLang, setCurrentLang] = useState('FR');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ACCUEIL', href: '#hero' },
    { name: 'APPARTEMENTS', href: '#appartements' },
    { name: 'ESPACES COMMUNS', href: '#espaces-communs' },
    { name: 'GALERIE', href: '#evolution-chantier' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none ${
          hideNavbar 
            ? 'opacity-0 -translate-y-full' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        {/* HEADER CONTAINER WITH CUSTOM CURVED SVG BACKGROUND & WHITE SHADOW */}
        <div className="relative w-full filter drop-shadow-[0_12px_28px_rgba(255,255,255,0.6)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          
          {/* SVG CURVED HEADER BACKGROUND */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <svg 
              className="w-full h-full min-h-[72px] sm:min-h-[84px]" 
              preserveAspectRatio="none" 
              viewBox="0 0 1440 84" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* WHITE CURVED HEADER FILL */}
              <path 
                d="M 0 0 L 1440 0 L 1440 56 L 410 56 C 360 56, 345 84, 300 84 L 0 84 Z" 
                fill="#FFFFFF"
              />
            </svg>
          </div>

          {/* HEADER CONTENT CONTENT WRAPPER */}
          <div className="relative pointer-events-auto w-full px-2 sm:px-4 lg:px-6 flex items-center justify-between min-h-[72px] sm:min-h-[84px]">
            
            {/* LEFT: LOGO SECTION (POSITIONED ALL THE WAY TO THE LEFT EDGE) */}
            <div className="flex items-center gap-2 sm:gap-3.5 pt-1 sm:pt-1.5 pb-2 pl-0 sm:pl-1 pr-4 z-10">
              <a href="#hero" className="flex items-center gap-2 sm:gap-2.5 group">
                
                {/* 1. EMBLEM LOGO: ch black.svg */}
                <div className="h-10 sm:h-12 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src="/svg/ch black.svg" 
                    alt="CH Emblem" 
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>

                {/* 2. TYPOGRAPHY LOGO: ChGhardnProm black.svg */}
                <div className="h-7 sm:h-9 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border-l border-gray-200 pl-2 sm:pl-2.5">
                  <img 
                    src="/svg/ChGhardnProm black.svg" 
                    alt="GHARDN PROM Typography" 
                    className="h-7 sm:h-9 w-auto object-contain"
                  />
                </div>

              </a>
            </div>

            {/* CENTER: DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-6 sm:gap-8 pb-3 z-10">
              {navLinks.map((link) => {
                const isActive = activeTab === link.name;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveTab(link.name)}
                    className={`relative text-[11px] sm:text-xs font-serif tracking-[0.2em] uppercase transition-colors duration-300 py-1 ${
                      isActive 
                        ? 'text-black font-extrabold' 
                        : 'text-gray-600 hover:text-black font-semibold'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ghardn-red shadow-sm"></span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* RIGHT: LANGUAGE SWITCHER & VISIT BUTTON */}
            <div className="flex items-center gap-3 pb-3 z-10">
              
              {/* FR / AR LANGUAGE SWITCHER CAPSULE */}
              <div className="flex items-center bg-gray-100/90 border border-gray-200 rounded-full p-0.5 shadow-inner">
                <button
                  onClick={() => setCurrentLang('FR')}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                    currentLang === 'FR'
                      ? 'bg-white text-black shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setCurrentLang('AR')}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                    currentLang === 'AR'
                      ? 'bg-white text-black shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  AR
                </button>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={onOpenContact}
                className="hidden md:flex bg-ghardn-red hover:bg-ghardn-red-hover text-white px-4 py-1.5 rounded-full items-center gap-2.5 text-xs font-bold uppercase tracking-wider shadow-red-glow transition-all hover:scale-105 active:scale-95 group"
              >
                <span>Réserver</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-800 hover:text-black focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-ghardn-red" /> : <Menu className="w-6 h-6 text-black" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && !hideNavbar && (
        <div className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between pt-28 pb-8 px-6 transition-all duration-500 text-black">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-ghardn-red text-xs uppercase tracking-widest font-mono font-bold pb-2 border-b border-gray-200">
              <Sparkles className="w-4 h-4" /> Navigation GHARDN PROM
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveTab(link.name);
                  setMobileMenuOpen(false);
                }}
                className="text-base uppercase tracking-widest text-gray-800 hover:text-ghardn-red transition-colors font-serif font-bold py-2 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full bg-ghardn-red text-white py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-red-glow"
            >
              <span>Réserver une visite</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] uppercase tracking-widest text-gray-500 font-mono">
              <span className="text-ghardn-red font-bold">GHARDN</span> PROM © 2026 — Architecture Contemporaine
            </div>
          </div>
        </div>
      )}
    </>
  );
}

