import React, { useState } from 'react';
import { X, CheckCircle, Send, Phone, Mail, User, Building, Calendar } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    typology: 'f4',
    date: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/visites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          residence: formData.typology === 'f4' ? 'F4 Prestige (135 m²)' : formData.typology === 'f3_centre' ? 'F3 Centre (105 m²)' : 'F3 Sud (102 m²)',
          preferred_date: formData.date || null,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.error('Erreur soumission visite modal:', err);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-ghardn-dark rounded-2xl border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/5 hover:bg-ghardn-red p-2 rounded-full border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase font-mono tracking-mega text-ghardn-red font-bold">
                BUREAU DE VENTE EXCLUSIF
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide mt-1 font-display">
                RÉSERVER UNE VISITE PRIVÉE
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-sans">
                Sélectionnez vos créneaux souhaités pour visiter le hall d'accueil et nos appartements témoins GHARDN PROM.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                  Nom & Prénom *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="M. Alex Dupont"
                    className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors"
                  />
                </div>
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@exemple.fr"
                      className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Typology & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                    Appartement Souhaité
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.typology}
                      onChange={(e) => setFormData({ ...formData, typology: e.target.value })}
                      className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors appearance-none"
                    >
                      <option value="f4">Penthouse F4 Prestige (135 m²)</option>
                      <option value="f3-centre">Résidence F3 Centre (88 m²)</option>
                      <option value="f3-sud">Résidence F3 Sud (94 m²)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                    Date Souhaitée
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-300 font-medium mb-1.5 font-mono">
                  Message / Remarques
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Précisez l'heure souhaitée ou vos questions particulières..."
                  className="w-full bg-ghardn-dark-800 border border-white/15 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-ghardn-red transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-ghardn-red hover:bg-ghardn-red-hover text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-bold shadow-red-glow transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirmer ma réservation de visite</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation state */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-ghardn-red/20 border-2 border-ghardn-red mx-auto flex items-center justify-center mb-6 shadow-red-glow animate-bounce">
              <CheckCircle className="w-8 h-8 text-ghardn-red" />
            </div>

            <h3 className="text-2xl font-bold uppercase text-white font-display tracking-wider mb-2">
              VISITE CONFIRMÉE
            </h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-6 font-sans">
              Merci M./Mme <span className="text-white font-bold">{formData.name}</span>. Votre demande de visite privée pour la résidence <span className="text-ghardn-red font-bold">GHARDN PROM</span> a été enregistrée avec succès. Notre équipe vous recontacte rapidement.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
