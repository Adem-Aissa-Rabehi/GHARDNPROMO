import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    residence: 'F4 Prestige (135 m²)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Smooth frame loop for background video frames (48 WebP frames)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 48);
    }, 45); // ~22 FPS smooth looping

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/visites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Erreur soumission visite:', err);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        residence: 'F4 Prestige (135 m²)',
        message: ''
      });
    }, 5000);
  };

  const frameSrc = `/frames_form/frame_${String(currentFrame).padStart(3, '0')}.webp`;

  return (
    <section id="contact" className="py-16 sm:py-24 bg-transparent text-white relative">
      <div className="w-full px-4 sm:px-8 lg:px-12 mx-auto">
        
        {/* LARGE FRAMED SECTION CONTAINER WITH SMOOTH LOOPING VIDEO BACKGROUND */}
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden border border-white/15 shadow-luxury min-h-[620px] flex items-center p-6 sm:p-12 lg:p-16">
          
          {/* BACKGROUND VIDEO FRAME SEQUENCE (Looping smoothly) */}
          <div className="absolute inset-0 z-0">
            <img
              src={frameSrc}
              alt="Background Loop"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay gradient for optimal legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40"></div>
          </div>

          {/* SECTION CONTENT GRID (Form on the LEFT as requested!) */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* FORM CARD ON THE LEFT (col-span-6 order-1) */}
            <div className="lg:col-span-6 order-1">
              <div className="bg-black/75 backdrop-blur-2xl p-7 sm:p-10 rounded-[28px] border border-white/20 shadow-2xl">
                
                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-ghardn-red/20 text-ghardn-red border border-ghardn-red/40 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white">Demande transmise avec succès</h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                      Merci <strong className="text-white">{formData.name || 'cher client'}</strong>. Notre conseiller GHARDN PROM prendra contact avec vous rapidement pour organiser votre visite privée.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ghardn-red font-bold block mb-1">
                        RÉSERVATION PRIVÉE
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
                        Organisez votre visite
                      </h4>
                    </div>

                    {/* Input 1: Nom complet */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Votre nom complet"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-ghardn-red transition-colors"
                      />
                    </div>

                    {/* Input 2: Numéro de téléphone */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Votre numéro de téléphone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-ghardn-red transition-colors"
                      />
                    </div>

                    {/* Input 3: Email */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Votre adresse email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-ghardn-red transition-colors"
                      />
                    </div>

                    {/* Input 4: Typologie sélectionnée */}
                    <div>
                      <select
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-ghardn-red transition-colors [&>option]:bg-ghardn-dark-900 [&>option]:text-white"
                      >
                        <option value="F4 Prestige (135 m²)">Penthouse F4 Prestige (135 m²)</option>
                        <option value="F3 Centre (88 m²)">Résidence F3 Centre (88 m²)</option>
                        <option value="F3 Sud (94 m²)">Résidence F3 Sud (94 m²)</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02]"
                      >
                        <span>Demander une visite</span>
                        <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

            {/* HEADLINE TEXT ON THE RIGHT (col-span-6 order-2) */}
            <div className="lg:col-span-6 order-2 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-gray-300 backdrop-blur-md">
                <span>• GHARDN PROM VIP</span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.05]">
                Votre résidence <br />
                <span className="font-light italic text-gray-300 font-serif">commence ici</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans max-w-lg">
                Dites-nous ce que vous recherchez et nous organiserons une visite privée exclusive des résidences qui vous correspondent — sans engagement, à votre rythme.
              </p>

              <div className="pt-4 flex items-center gap-6 border-t border-white/15">
                <div>
                  <span className="block text-2xl font-bold text-white font-display">100%</span>
                  <span className="text-xs text-gray-400 font-sans">Accompagnement dédié</span>
                </div>
                <div className="h-8 w-px bg-white/15"></div>
                <div>
                  <span className="block text-2xl font-bold text-white font-display">Clé en main</span>
                  <span className="text-xs text-gray-400 font-sans">Livraison haute couture</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
