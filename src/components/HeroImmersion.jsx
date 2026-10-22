import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const TOTAL_FRAMES = 192;

export default function HeroImmersion({ onOpenContact, onProgressChange }) {
  const [loadedFramesCount, setLoadedFramesCount] = useState(0);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const framesCacheRef = useRef([]);

  // Preload Frame Sequence
  useEffect(() => {
    let isMounted = true;
    const frames = [];
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/frame_${numStr}.webp`;

      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedFramesCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsPreloaderDone(true);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedFramesCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsPreloaderDone(true);
        }
      };

      frames.push(img);
    }

    framesCacheRef.current = frames;

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas Frame Rendering Helper
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = framesCacheRef.current[index];
    if (img && img.complete) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width || 1280;
      const imgHeight = img.height || 720;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
      const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    }
  };

  // Resize Canvas listener
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderFrame(currentFrameIndex);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameIndex]);

  // Scroll listener for Scrollytelling (Pins canvas while scrubbing frames 0 -> 239)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const rect = scrollContainerRef.current.getBoundingClientRect();
      const containerHeight = scrollContainerRef.current.offsetHeight - window.innerHeight;
      
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
      
      setScrollProgress(progress);
      if (onProgressChange) {
        onProgressChange(progress);
      }

      const targetFrame = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      setCurrentFrameIndex(targetFrame);
      renderFrame(targetFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPreloaderDone, onProgressChange]);

  // VISIBILITY LOGIC:
  const isStartPhase = scrollProgress <= 0.02;
  const isEndPhase = scrollProgress >= 0.90;

  return (
    <section id="hero" className="relative text-white bg-gradient-to-b from-white via-white/70 to-[#12161f]">
      
      {/* PRELOADER OVERLAY */}
      {!isPreloaderDone && (
        <div className="fixed inset-0 z-50 bg-ghardn-dark flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 relative">
            <img 
              src="/GHARDN PROM WHITE.png" 
              alt="GHARDN PROM White Logo" 
              className="h-20 sm:h-24 w-auto object-contain animate-pulse filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
              onError={(e) => {
                e.target.src = '/logo_white.png';
              }}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-ghardn-red rounded-full shadow-red-glow"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-mega text-white uppercase mb-2 font-display">
            <span className="text-ghardn-red font-extrabold">GHARDN</span> <span className="text-white font-light">PROM</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-8 max-w-sm font-sans">
            Chargement de l'expérience d'immersion architecturale...
          </p>

          <div className="w-full max-w-md bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
            <div 
              className="bg-gradient-to-r from-ghardn-red to-red-500 h-full rounded-full transition-all duration-300 shadow-red-glow"
              style={{ width: `${(loadedFramesCount / TOTAL_FRAMES) * 100}%` }}
            ></div>
          </div>
          <span className="mt-3 text-xs font-mono text-ghardn-red font-semibold">
            {Math.round((loadedFramesCount / TOTAL_FRAMES) * 100)}% ({loadedFramesCount}/{TOTAL_FRAMES} FRAMES)
          </span>
        </div>
      )}

      {/* TALL SCROLL CONTAINER */}
      <div 
        ref={scrollContainerRef}
        className="relative h-[550vh]"
      >
        {/* STICKY FULLSCREEN VIEWPORT */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center p-2 sm:p-4">
          
          {/* THE CANVAS CONTAINER */}
          <div className={`relative w-full h-full transition-all duration-700 overflow-hidden ${
            isEndPhase 
              ? 'scale-[0.93] sm:scale-[0.95] rounded-[32px] sm:rounded-[40px] border border-white/20 shadow-2xl bg-ghardn-dark-900' 
              : 'scale-100 rounded-[24px] sm:rounded-[32px] border border-white/15 shadow-2xl'
          }`}>
            
            {/* CANVAS RENDERER FOR SCROLL MODE */}
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-cover transition-all duration-500 rounded-[inherit]"
            />

            {/* WHITE TRANSLUCENT OVERLAY FILTER (REPLACES BLACK FILTER PER USER DIRECTIVE) */}
            <div className={`absolute inset-0 bg-gradient-to-b from-white/85 via-white/50 to-white/20 backdrop-blur-[1px] transition-opacity duration-700 pointer-events-none ${
              isStartPhase ? 'opacity-100' : 'opacity-0'
            }`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent transition-opacity duration-700 pointer-events-none ${
              isStartPhase ? 'opacity-100' : 'opacity-0'
            }`}></div>

            {/* START PHASE HERO TEXT OVERLAY */}
            <div 
              className={`absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-14 lg:px-20 pointer-events-none transition-all duration-700 ${
                isStartPhase ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="max-w-3xl pointer-events-auto">
                
                {/* Sur-titre: RÉSIDENCES ARCHITECTURALES */}
                <span className="text-xs uppercase tracking-[0.25em] text-ghardn-red font-mono font-extrabold mb-3 block">
                  RÉSIDENCES ARCHITECTURALES D'EXCEPTION
                </span>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-950 font-display leading-[1.02] mb-5 drop-shadow-sm">
                  L'élégance moderne <br />
                  <span className="font-light italic text-gray-800 font-serif">au cœur de la ville</span>
                </h1>

                {/* Sub-paragraph */}
                <p className="text-base sm:text-xl font-medium text-gray-800/90 max-w-xl mb-8 leading-relaxed font-sans">
                  Une collection exclusive de résidences contemporaines, conçues pour sublimer votre quotidien à travers un design épuré et des finitions d'exception.
                </p>

                {/* Action Buttons Row with Rouge Signature #E20916 */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={onOpenContact}
                    className="bg-ghardn-red hover:bg-ghardn-red-hover text-white font-bold pl-7 pr-2.5 py-2 rounded-full flex items-center gap-3 shadow-red-glow transition-all duration-300 hover:scale-105 active:scale-95 group text-sm"
                  >
                    <span>Réserver une visite</span>
                    <span className="w-8 h-8 rounded-full bg-white text-ghardn-red flex items-center justify-center font-bold shadow-md group-hover:rotate-45 transition-transform duration-300">
                      <ArrowUpRight className="w-4 h-4 text-ghardn-red stroke-[2.5]" />
                    </span>
                  </button>

                  <a
                    href="#appartements"
                    className="bg-black/90 hover:bg-black text-white font-semibold px-7 py-3 rounded-full text-sm shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Explorer les résidences
                  </a>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
