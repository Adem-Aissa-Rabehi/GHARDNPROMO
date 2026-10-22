import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroImmersion from './components/HeroImmersion';
import ResidencesShowcase from './components/ResidencesShowcase';
import EspacesCommuns from './components/EspacesCommuns';
import ChantierEvolutionGallery from './components/ChantierEvolutionGallery';
import ContactSection from './components/ContactSection';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Détection de la route de la page d'administration dédiée (/admin ou #/admin)
  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath === '/admin/' ||
    window.location.hash === '#/admin' ||
    window.location.hash.startsWith('#/admin');

  if (isAdminRoute) {
    return <AdminPage />;
  }

  const handleOpenContact = () => {
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  // Masquer la barre de navigation pendant le scrollytelling actif
  const hideNavbar = heroProgress > 0.04 && heroProgress < 0.90;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#12161f] to-ghardn-dark text-white font-sans selection:bg-ghardn-red selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar onOpenContact={handleOpenContact} hideNavbar={hideNavbar} />

      {/* 2. Hero Section Scrollytelling Immersion */}
      <HeroImmersion 
        onOpenContact={handleOpenContact} 
        onProgressChange={setHeroProgress} 
      />

      {/* 3. Grille des 3 Typologies Résidentielles (F4 Prestige, F3 Centre, F3 Sud) */}
      <ResidencesShowcase onOpenContact={handleOpenContact} />

      {/* 4. Espaces Communs d'Exception (Terrasse 66.31m², Piscine 18.04m², Cour 23.47m² & Double Ascenseur) */}
      <EspacesCommuns onOpenContact={handleOpenContact} />

      {/* 5. Chronologie & Évolution du Projet (Carrousel Plein Écran & Galerie par Mois) */}
      <ChantierEvolutionGallery />

      {/* 6. Section Formulaire de Réservation & Visite */}
      <ContactSection />

      {/* 7. Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* 8. Modal Contact / Visite */}
      <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />
    </div>
  );
}
