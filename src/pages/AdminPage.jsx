import React, { useState, useEffect, useMemo } from 'react';

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('ghardn_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Modules autorisés : strictement 'gallery' et 'visites'
  const [activeModule, setActiveModule] = useState('gallery'); // 'gallery' | 'visites'

  // --- ÉTAT MODULE GALERIE ---
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Album ouvert en drill-down
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('all');

  // Modales Galerie
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [isEditAlbumModalOpen, setIsEditAlbumModalOpen] = useState(false);
  const [isUploadPhotosModalOpen, setIsUploadPhotosModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Formulaire Nouvel Album
  const [newAlbumYear, setNewAlbumYear] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumSubtitle, setNewAlbumSubtitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState(null);
  const [createAlbumStatus, setCreateAlbumStatus] = useState({ state: 'idle', message: '' });

  // Formulaire Édition Album
  const [editAlbumTitle, setEditAlbumTitle] = useState('');
  const [editAlbumSubtitle, setEditAlbumSubtitle] = useState('');
  const [editAlbumDesc, setEditAlbumDesc] = useState('');
  const [editAlbumCover, setEditAlbumCover] = useState(null);
  const [editAlbumStatus, setEditAlbumStatus] = useState({ state: 'idle', message: '' });

  // Focus & Aperçu direct des champs pour les modales
  const [createFocusedField, setCreateFocusedField] = useState(null);
  const [editFocusedField, setEditFocusedField] = useState(null);

  const newCoverPreviewUrl = useMemo(() => {
    if (newAlbumCover && typeof newAlbumCover === 'object') {
      try {
        return URL.createObjectURL(newAlbumCover);
      } catch (e) {
        return '/media/album_covers/cover_2026_piscine_panoramique_pergola.jpg';
      }
    }
    return '/media/album_covers/cover_2026_piscine_panoramique_pergola.jpg';
  }, [newAlbumCover]);

  const editCoverPreviewUrl = useMemo(() => {
    if (editAlbumCover && typeof editAlbumCover === 'object') {
      try {
        return URL.createObjectURL(editAlbumCover);
      } catch (e) {
        // fallback
      }
    }
    if (selectedAlbum?.cover_image_url || selectedAlbum?.cover_image) {
      return selectedAlbum.cover_image_url || selectedAlbum.cover_image;
    }
    return '/media/album_covers/cover_2026_piscine_panoramique_pergola.jpg';
  }, [editAlbumCover, selectedAlbum]);

  // Formulaire Téléversement Photos
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ state: 'idle', message: '' });

  // --- ÉTAT MODULE DEMANDES DE VISITES ---
  const [visites, setVisites] = useState([]);
  const [visiteStats, setVisiteStats] = useState({ total: 0, nouveau: 0, contacte: 0, rdv_confirme: 0 });
  const [loadingVisites, setLoadingVisites] = useState(false);
  const [visiteFilterStatus, setVisiteFilterStatus] = useState('all');
  const [visiteSearch, setVisiteSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [visiteToDelete, setVisiteToDelete] = useState(null);

  // Vérification initiale du token
  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      try {
        const res = await fetch('/api/auth/me/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem('ghardn_admin_token');
          setToken('');
        } else {
          loadAllData();
        }
      } catch (err) {
        console.error('Erreur vérification token:', err);
      }
    };

    checkToken();
  }, [token]);

  const loadAllData = () => {
    loadGalleryData();
    loadVisitesData();
  };

  // Chargement Galerie
  const loadGalleryData = async () => {
    setLoadingGallery(true);
    try {
      const [albumsRes, timelineRes] = await Promise.all([
        fetch('/api/albums/'),
        fetch('/api/timeline/'),
      ]);

      if (albumsRes.ok) {
        const aData = await albumsRes.json();
        setAlbums(aData || []);
        if (selectedAlbum) {
          const fresh = aData.find((a) => a.id === selectedAlbum.id);
          if (fresh) setSelectedAlbum(fresh);
        }
      }

      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        const allP = (tData.timeline || []).flatMap((g) => g.photos);
        setPhotos(allP);
      }
    } catch (err) {
      console.error('Erreur chargement galerie:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Chargement Demandes de Visites
  const loadVisitesData = async () => {
    if (!token) return;
    setLoadingVisites(true);
    try {
      const res = await fetch('/api/admin/visites/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVisites(data.visites || []);
        if (data.stats) setVisiteStats(data.stats);
      }
    } catch (err) {
      console.error('Erreur chargement visites:', err);
    } finally {
      setLoadingVisites(false);
    }
  };

  // Authentification
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        // En cas de réponse HTML (erreur serveur 500 ou 404)
      }

      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('ghardn_admin_token', data.token);
        loadAllData();
      } else {
        setAuthError(data.error || 'Identifiant ou mot de passe incorrect.');
      }
    } catch (err) {
      setAuthError('Erreur de connexion au serveur. Veuillez vérifier votre connexion.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout/', {
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
        });
      }
    } catch (err) {}
    setToken('');
    localStorage.removeItem('ghardn_admin_token');
    setSelectedAlbum(null);
  };

  // --- ACTIONS ALBUM ---
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumYear || !newAlbumTitle) {
      setCreateAlbumStatus({ state: 'error', message: "Veuillez renseigner l'année et le titre." });
      return;
    }

    setCreateAlbumStatus({ state: 'loading', message: "Création de l'album en cours..." });

    const formData = new FormData();
    formData.append('year', newAlbumYear);
    formData.append('title', newAlbumTitle);
    formData.append('subtitle', newAlbumSubtitle);
    formData.append('description', newAlbumDesc);
    if (newAlbumCover) {
      formData.append('cover_image', newAlbumCover);
    }

    try {
      const res = await fetch('/api/admin/albums/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCreateAlbumStatus({ state: 'success', message: `Album ${newAlbumYear} créé !` });
        setNewAlbumYear('');
        setNewAlbumTitle('');
        setNewAlbumSubtitle('');
        setNewAlbumDesc('');
        setNewAlbumCover(null);
        setIsCreateAlbumModalOpen(false);

        await loadGalleryData();
        setSelectedAlbum(data);
      } else {
        setCreateAlbumStatus({
          state: 'error',
          message: data.year ? "Cette année d'album existe déjà." : JSON.stringify(data),
        });
      }
    } catch (err) {
      setCreateAlbumStatus({ state: 'error', message: 'Erreur réseau.' });
    }
  };

  const handleOpenEditAlbum = (album, e) => {
    if (e) e.stopPropagation();
    setEditAlbumTitle(album.title || '');
    setEditAlbumSubtitle(album.subtitle || '');
    setEditAlbumDesc(album.description || '');
    setEditAlbumCover(null);
    setEditAlbumStatus({ state: 'idle', message: '' });
    setIsEditAlbumModalOpen(true);
  };

  const handleSaveEditAlbum = async (e) => {
    e.preventDefault();
    if (!selectedAlbum) return;

    setEditAlbumStatus({ state: 'loading', message: 'Mise à jour en cours...' });

    const formData = new FormData();
    formData.append('title', editAlbumTitle);
    formData.append('subtitle', editAlbumSubtitle);
    formData.append('description', editAlbumDesc);
    if (editAlbumCover) {
      formData.append('cover_image', editAlbumCover);
    }

    try {
      const res = await fetch(`/api/admin/albums/${selectedAlbum.id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setEditAlbumStatus({ state: 'success', message: 'Album mis à jour !' });
        setIsEditAlbumModalOpen(false);
        setSelectedAlbum(data);
        loadGalleryData();
      } else {
        setEditAlbumStatus({ state: 'error', message: JSON.stringify(data) });
      }
    } catch (err) {
      setEditAlbumStatus({ state: 'error', message: 'Erreur réseau.' });
    }
  };

  const handleConfirmDeleteAlbum = async () => {
    if (!albumToDelete) return;

    try {
      const res = await fetch(`/api/admin/albums/${albumToDelete.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        if (selectedAlbum && selectedAlbum.id === albumToDelete.id) {
          setSelectedAlbum(null);
        }
        setAlbumToDelete(null);
        loadGalleryData();
      } else {
        alert("Erreur lors de la suppression de l'album.");
      }
    } catch (err) {
      alert('Erreur réseau lors de la suppression.');
    }
  };

  // --- ACTIONS PHOTOS ---
  const handleUploadPhotosToAlbum = async (e) => {
    e.preventDefault();
    if (!selectedAlbum) return;
    if (!uploadFiles || uploadFiles.length === 0) {
      setUploadStatus({ state: 'error', message: 'Veuillez sélectionner au moins un fichier (photo ou vidéo).' });
      return;
    }

    setUploadStatus({ state: 'loading', message: `Téléversement de ${uploadFiles.length} fichier(s)...` });

    const formData = new FormData();
    formData.append('album', selectedAlbum.id);
    formData.append('year', selectedAlbum.year);
    formData.append('date_taken', uploadDate);
    formData.append('title', uploadTitle);
    formData.append('caption', uploadCaption);

    Array.from(uploadFiles).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await fetch('/api/admin/photos/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadStatus({ state: 'success', message: `${uploadFiles.length} média(s) ajouté(s) avec succès !` });
        setUploadFiles([]);
        setUploadTitle('');
        setUploadCaption('');
        setIsUploadPhotosModalOpen(false);
        loadGalleryData();
      } else {
        const data = await res.json();
        setUploadStatus({ state: 'error', message: data.error || 'Erreur téléversement.' });
      }
    } catch (err) {
      setUploadStatus({ state: 'error', message: 'Erreur réseau.' });
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      const res = await fetch(`/api/admin/photos/${photoToDelete.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        setPhotoToDelete(null);
        loadGalleryData();
      } else {
        alert('Erreur lors de la suppression de la photo.');
      }
    } catch (err) {
      alert('Erreur réseau.');
    }
  };

  // --- ACTIONS DEMANDES DE VISITES ---
  const handleUpdateVisiteStatus = async (visiteId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/visites/${visiteId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        loadVisitesData();
      }
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  const handleSaveVisiteNotes = async (visiteId) => {
    try {
      const res = await fetch(`/api/admin/visites/${visiteId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ notes: editingNoteText }),
      });

      if (res.ok) {
        setEditingNoteId(null);
        loadVisitesData();
      }
    } catch (err) {
      console.error('Erreur sauvegarde note:', err);
    }
  };

  const handleConfirmDeleteVisite = async () => {
    if (!visiteToDelete) return;

    try {
      const res = await fetch(`/api/admin/visites/${visiteToDelete.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        setVisiteToDelete(null);
        loadVisitesData();
      }
    } catch (err) {
      alert('Erreur lors de la suppression de la demande.');
    }
  };

  // Filtrage photos album actif
  const albumPhotos = selectedAlbum
    ? photos.filter((p) => p.album === selectedAlbum.id || p.year === selectedAlbum.year)
    : [];

  const filteredAlbumPhotos = albumPhotos.filter((p) => {
    if (selectedMonthFilter === 'all') return true;
    return String(p.month) === String(selectedMonthFilter);
  });

  const availableMonthsInAlbum = Array.from(
    new Set(albumPhotos.map((p) => p.month))
  ).sort((a, b) => b - a);

  // Filtrage des demandes de visites
  const filteredVisites = visites.filter((v) => {
    const matchesStatus = visiteFilterStatus === 'all' || v.status === visiteFilterStatus;
    const matchesSearch =
      !visiteSearch ||
      v.name.toLowerCase().includes(visiteSearch.toLowerCase()) ||
      v.phone.includes(visiteSearch) ||
      (v.email && v.email.toLowerCase().includes(visiteSearch.toLowerCase())) ||
      v.residence.toLowerCase().includes(visiteSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const monthNamesFR = {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',
  };

  const statusBadges = {
    NOUVEAU: { label: 'Nouvelle Demande', bg: 'bg-red-500/20 text-red-300 border-red-500/40' },
    CONTACTE: { label: 'Client Contacté', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    RDV_CONFIRME: { label: 'RDV Confirmé', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    VISITE_EFFECTUEE: { label: 'Visite Effectuée', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    ARCHIVE: { label: 'Classé / Archivé', bg: 'bg-white/10 text-white/50 border-white/20' },
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-white font-sans flex flex-col selection:bg-ghardn-red selection:text-white">
      
      {/* 1. EN-TÊTE SUPÉRIEURE DE NAVIGATION */}
      <header className="bg-ghardn-dark-900 border-b border-white/10 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-5 min-w-0">
          <a
            href="/"
            className="text-[11px] sm:text-xs font-sans font-semibold text-white/70 hover:text-white flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all shrink-0"
            title="Retour au site public"
          >
            <span>&larr;</span>
            <span className="hidden sm:inline">Retour au site public</span>
            <span className="sm:hidden">Site</span>
          </a>

          <div className="h-6 w-px bg-white/15 hidden sm:block shrink-0" />

          {/* LOGO DU SITE VITRINE (EMBLÈME + TYPOGRAPHIE) */}
          <div className="flex flex-col justify-center min-w-0">
            <a href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              {/* 1. EMBLEM LOGO */}
              <div className="h-7 sm:h-9 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/svg/ch black.svg" 
                  alt="CH Emblem" 
                  className="h-7 sm:h-9 w-auto object-contain brightness-0 invert"
                />
              </div>

              {/* 2. TYPOGRAPHY LOGO */}
              <div className="h-5 sm:h-7 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border-l border-white/20 pl-2 sm:pl-2.5">
                <img 
                  src="/svg/ChGhardnProm black.svg" 
                  alt="GHARDN PROM Typography" 
                  className="h-5 sm:h-7 w-auto object-contain brightness-0 invert"
                />
              </div>
            </a>
            <p className="text-[9px] sm:text-[10px] text-ghardn-red font-semibold uppercase tracking-wider font-sans hidden sm:block mt-0.5">
              Galerie & Gestion des Visites Privées
            </p>
          </div>
        </div>

        {token && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-red-500/20 hover:bg-ghardn-red text-red-200 hover:text-white text-[11px] sm:text-xs font-semibold transition-all border border-red-500/30 shrink-0 shadow-sm"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">Quitter</span>
            </button>
          </div>
        )}
      </header>

      {/* 2. CONTENU DU TABLEAU DE BORD */}
      {!token ? (
        
        /* LOGIN AVEC MOT DE PASSE HACHÉ */
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-ghardn-dark-800 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-ghardn-red/20 border border-ghardn-red/40 mx-auto flex items-center justify-center text-ghardn-red font-bold text-lg">
                GP
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">Espace Administrateur</h2>
              <p className="text-xs text-white/60 font-sans">
                Accès sécurisé par mot de passe haché (Django PBKDF2 SHA-256).
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 font-sans">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm focus:border-ghardn-red focus:outline-none"
                  placeholder="Nom d'utilisateur"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm focus:border-ghardn-red focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-ghardn-red hover:bg-ghardn-red/90 text-white font-semibold rounded-xl text-sm transition-all shadow-xl disabled:opacity-50"
              >
                {isAuthenticating ? 'Vérification en cours...' : 'Accéder au panneau de gestion'}
              </button>
            </form>
          </div>
        </div>

      ) : (

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* BARRE LATÉRALE DESKTOP (MASQUÉE SUR MOBILE) */}
          <aside className="hidden md:flex w-64 bg-ghardn-dark-900 border-r border-white/10 p-5 shrink-0 flex-col justify-between">
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-2">
                MODULES DE GESTION
              </p>
              
              <nav className="space-y-2">
                {/* 1. MODULE GALERIE & ALBUMS */}
                <button
                  onClick={() => {
                    setActiveModule('gallery');
                    setSelectedAlbum(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold font-sans transition-all flex items-center justify-between ${
                    activeModule === 'gallery'
                      ? 'bg-ghardn-red text-white shadow-xl shadow-ghardn-red/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm">Galerie & Albums</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono ${
                    activeModule === 'gallery' ? 'bg-black/30 text-white' : 'bg-white/10 text-white/60'
                  }`}>
                    {albums.length}
                  </span>
                </button>

                {/* 2. MODULE DEMANDES DE VISITES */}
                <button
                  onClick={() => setActiveModule('visites')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold font-sans transition-all flex items-center justify-between ${
                    activeModule === 'visites'
                      ? 'bg-ghardn-red text-white shadow-xl shadow-ghardn-red/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm">Demandes Visites</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                    visiteStats.nouveau > 0
                      ? 'bg-white text-ghardn-red animate-pulse'
                      : activeModule === 'visites'
                      ? 'bg-black/30 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {visiteStats.total}
                  </span>
                </button>
              </nav>
            </div>
          </aside>

          {/* BARRE DE NAVIGATION MOBILE (ONGLETS TACTILES ERGONOMIQUES) */}
          <div className="md:hidden bg-ghardn-dark-900 border-b border-white/10 p-2.5 shrink-0 z-20">
            <div className="grid grid-cols-2 gap-2 bg-black/60 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  setActiveModule('gallery');
                  setSelectedAlbum(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all ${
                  activeModule === 'gallery'
                    ? 'bg-ghardn-red text-white shadow-lg shadow-ghardn-red/40'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>Galerie</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  activeModule === 'gallery' ? 'bg-black/40 text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {albums.length}
                </span>
              </button>

              <button
                onClick={() => setActiveModule('visites')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all relative ${
                  activeModule === 'visites'
                    ? 'bg-ghardn-red text-white shadow-lg shadow-ghardn-red/40'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>Demandes Visites</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  visiteStats.nouveau > 0
                    ? 'bg-white text-ghardn-red animate-pulse'
                    : activeModule === 'visites'
                    ? 'bg-black/40 text-white'
                    : 'bg-white/10 text-white/60'
                }`}>
                  {visiteStats.total}
                </span>
              </button>
            </div>
          </div>

          {/* ZONE PRINCIPALE DU MODULE ACTIF */}
          <main className="flex-1 flex flex-col overflow-hidden bg-ghardn-dark-800/40 min-h-0">
            
            {/* ================= MODULE 1 : GALERIE & ALBUMS ================= */}
            {activeModule === 'gallery' && (
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                
                {/* VUE 1 : LISTE DES ALBUMS TYPE TÉLÉPHONE */}
                {!selectedAlbum ? (
                  
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="bg-ghardn-dark-900/70 border-b border-white/10 px-4 sm:px-10 py-3.5 sm:py-5 flex items-center justify-between gap-3 shrink-0">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ghardn-red/15 border border-ghardn-red/30 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-ghardn-red" />
                          <span className="text-[10px] font-semibold text-ghardn-red uppercase tracking-wider">
                            Photothèque du Chantier
                          </span>
                        </div>
                        <h2 className="text-base sm:text-2xl font-serif font-bold text-white truncate">
                          Albums par Année ({albums.length})
                        </h2>
                        <p className="text-xs text-white/60 font-sans mt-0.5 hidden sm:block">
                          Touchez un album pour le développer, ajouter des photos ou modifier son contenu.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCreateAlbumStatus({ state: 'idle', message: '' });
                          setIsCreateAlbumModalOpen(true);
                        }}
                        className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-ghardn-red hover:bg-ghardn-red/90 text-white font-sans text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xl hover:shadow-ghardn-red/40 flex items-center gap-1.5 sm:gap-2 shrink-0"
                      >
                        <span className="text-base leading-none">+</span>
                        <span className="hidden sm:inline">Créer un Album</span>
                        <span className="sm:hidden">Créer</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3.5 sm:p-8 lg:p-10 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                      {loadingGallery ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-white/60">
                          <div className="w-8 h-8 border-2 border-ghardn-red border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-sans tracking-widest uppercase">Chargement des albums...</p>
                        </div>
                      ) : albums.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 bg-black/30 border border-dashed border-white/15 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
                          <p className="text-base font-serif text-white/70">Aucun album créé pour l'instant.</p>
                          <button
                            onClick={() => setIsCreateAlbumModalOpen(true)}
                            className="px-5 py-2.5 bg-ghardn-red text-white text-xs font-bold rounded-xl"
                          >
                            + Créer le premier album
                          </button>
                        </div>
                      ) : (
                        albums.map((album) => (
                          <div
                            key={`album-row-${album.id}`}
                            onClick={() => {
                              setSelectedAlbum(album);
                              setSelectedMonthFilter('all');
                            }}
                            className="group bg-ghardn-dark-900/90 border border-white/10 hover:border-ghardn-red/80 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:bg-black/50"
                          >
                            <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                              <div className="w-16 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                <img
                                  src={album.cover_image_url || album.cover_image}
                                  alt={album.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-white">
                                  {album.year}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-ghardn-red/20 text-ghardn-red text-[10px] sm:text-[11px] font-bold tracking-wider font-sans">
                                    ANNÉE {album.year}
                                  </span>
                                  <span className="text-[11px] sm:text-xs text-white/50 font-sans">
                                    {album.photos_count} photo{album.photos_count > 1 ? 's' : ''}
                                  </span>
                                </div>

                                <h3 className="text-sm sm:text-lg font-serif font-bold text-white group-hover:text-ghardn-red transition-colors truncate">
                                  {album.title}
                                </h3>

                                {album.subtitle && (
                                  <p className="text-[11px] sm:text-xs text-white/60 font-sans truncate">
                                    {album.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleOpenEditAlbum(album, e)}
                                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium border border-white/10 transition-colors"
                                >
                                  Modifier
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAlbumToDelete(album);
                                  }}
                                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white text-xs font-medium border border-red-500/20 transition-colors"
                                >
                                  Supprimer
                                </button>
                              </div>

                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 group-hover:bg-ghardn-red flex items-center justify-center text-white/70 group-hover:text-white transition-all text-xs sm:text-sm">
                                &rarr;
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                ) : (

                  /* VUE 2 : ALBUM OUVERT EN DRILL-DOWN */
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="bg-ghardn-dark-900 border-b border-white/10 px-3 sm:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <button
                          onClick={() => setSelectedAlbum(null)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
                        >
                          &larr; <span className="hidden sm:inline">Tous les albums</span><span className="sm:hidden">Albums</span>
                        </button>
                        <span className="text-white/30 hidden sm:inline">|</span>
                        <div className="min-w-0">
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-ghardn-red font-bold block sm:inline sm:mr-2">
                            Album Actif
                          </span>
                          <h2 className="text-sm sm:text-lg font-serif font-bold text-white truncate inline">
                            {selectedAlbum.year} — {selectedAlbum.title}
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            setUploadStatus({ state: 'idle', message: '' });
                            setIsUploadPhotosModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl bg-ghardn-red hover:bg-ghardn-red/90 text-white text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-lg transition-all"
                        >
                          <span>+ Ajouter photos & vidéos</span>
                        </button>

                        <button
                          onClick={(e) => handleOpenEditAlbum(selectedAlbum, e)}
                          className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => setAlbumToDelete(selectedAlbum)}
                          className="px-2.5 sm:px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-medium transition-all"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3.5 sm:p-8 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-white/20">
                      {/* Bannière de l'album */}
                      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black/60 p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl">
                        <div className="w-full sm:w-48 h-32 sm:h-36 rounded-2xl overflow-hidden bg-black shrink-0 relative border border-white/10 shadow-lg">
                          <img
                            src={selectedAlbum.cover_image_url || selectedAlbum.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 px-2.5 py-0.5 rounded-full text-xs font-bold text-white">
                            {selectedAlbum.year}
                          </div>
                        </div>

                        <div className="flex-1 space-y-1.5 sm:space-y-2 text-center sm:text-left">
                          <span className="inline-block px-3 py-0.5 rounded-full bg-ghardn-red/20 text-ghardn-red text-xs font-bold font-sans">
                            {albumPhotos.length} média{albumPhotos.length > 1 ? 's' : ''} (photos/vidéos) répertorié{albumPhotos.length > 1 ? 's' : ''}
                          </span>
                          <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">
                            {selectedAlbum.title}
                          </h3>
                          {selectedAlbum.subtitle && (
                            <p className="text-xs text-ghardn-red font-medium">
                              {selectedAlbum.subtitle}
                            </p>
                          )}
                          {selectedAlbum.description && (
                            <p className="text-xs text-white/70 leading-relaxed font-light max-w-2xl">
                              {selectedAlbum.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Filtres par mois */}
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1">
                          <span className="text-xs text-white/50 font-sans hidden sm:inline">Mois :</span>
                          <button
                            onClick={() => setSelectedMonthFilter('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                              selectedMonthFilter === 'all'
                                ? 'bg-white text-black font-bold'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            Tous ({albumPhotos.length})
                          </button>

                          {availableMonthsInAlbum.map((m) => {
                            const count = albumPhotos.filter((p) => p.month === m).length;
                            return (
                              <button
                                key={`m-filter-${m}`}
                                onClick={() => setSelectedMonthFilter(String(m))}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                                  selectedMonthFilter === String(m)
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                              >
                                {monthNamesFR[m] || `Mois ${m}`} ({count})
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => {
                            setUploadStatus({ state: 'idle', message: '' });
                            setIsUploadPhotosModalOpen(true);
                          }}
                          className="px-3 py-1 bg-white/10 hover:bg-ghardn-red text-white text-xs rounded-lg transition-colors shrink-0"
                        >
                          + Ajouter
                        </button>
                      </div>

                      {/* Grille des photos */}
                      {filteredAlbumPhotos.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 bg-black/30 rounded-2xl border border-dashed border-white/15 p-6 space-y-3">
                          <p className="text-sm font-serif text-white/60">
                            Aucune photographie dans cet album pour cette sélection.
                          </p>
                          <button
                            onClick={() => {
                              setUploadStatus({ state: 'idle', message: '' });
                              setIsUploadPhotosModalOpen(true);
                            }}
                            className="px-4 py-2 bg-ghardn-red text-white text-xs font-bold rounded-xl"
                          >
                            + Téléverser des photos maintenant
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                          {filteredAlbumPhotos.map((photo) => {
                            const isVideo = photo.media_type === 'video' || Boolean(photo.video_url);

                            return (
                              <div
                                key={`photo-card-${photo.id}`}
                                className="group bg-black/60 border border-white/10 hover:border-ghardn-red/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl"
                              >
                                <div
                                  onClick={() => setPreviewPhoto(photo)}
                                  className="aspect-square relative overflow-hidden bg-black/80 cursor-pointer"
                                >
                                  {isVideo && !photo.image_url ? (
                                    <video
                                      src={photo.video_url || photo.video}
                                      className="w-full h-full object-cover pointer-events-none"
                                      muted
                                      preload="metadata"
                                    />
                                  ) : (
                                    <img
                                      src={photo.image_url || photo.image}
                                      alt={photo.title}
                                      loading="lazy"
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  )}

                                  {isVideo && (
                                    <>
                                      <div className="absolute top-1.5 right-1.5 bg-ghardn-red px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-md flex items-center gap-1 z-10">
                                        <span>▶</span>
                                        <span>VIDÉO</span>
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                                        <div className="w-8 h-8 rounded-full bg-ghardn-red/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                          <svg className="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono text-white">
                                    {photo.month_name}
                                  </div>
                                </div>

                                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                                  <div>
                                    <div className="flex items-center gap-1">
                                      {isVideo ? (
                                        <span className="text-[10px] font-bold text-ghardn-red">▶ Vidéo</span>
                                      ) : (
                                        <span className="text-[10px] text-white/50">📷 Photo</span>
                                      )}
                                    </div>
                                    <p className="text-xs font-serif font-bold text-white line-clamp-1 mt-0.5">
                                      {photo.title || (isVideo ? `Vidéo #${photo.id}` : `Photo #${photo.id}`)}
                                    </p>
                                    <p className="text-[10px] text-white/50 font-sans">
                                      Prise le : {photo.date_taken}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => setPhotoToDelete(photo)}
                                    className="w-full py-1.5 rounded-lg bg-red-500/15 hover:bg-red-600 text-red-200 hover:text-white text-xs font-medium transition-all"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                )}

              </div>
            )}

            {/* ================= MODULE 2 : DEMANDES DE VISITES ================= */}
            {activeModule === 'visites' && (
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                
                {/* EN-TÊTE DU MODULE VISITES */}
                <div className="bg-ghardn-dark-900/70 border-b border-white/10 px-4 sm:px-10 py-3.5 sm:py-5 flex items-center justify-between gap-3 shrink-0">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ghardn-red/15 border border-ghardn-red/30 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ghardn-red animate-pulse" />
                      <span className="text-[10px] font-semibold text-ghardn-red uppercase tracking-wider">
                        Gestion Commerciale & Prospects
                      </span>
                    </div>
                    <h2 className="text-base sm:text-2xl font-serif font-bold text-white truncate">
                      Demandes de Visites ({visites.length})
                    </h2>
                    <p className="text-xs text-white/60 font-sans mt-0.5 hidden sm:block">
                      Suivez les prises de contact soumises par les acquéreurs depuis les formulaires du site.
                    </p>
                  </div>

                  <button
                    onClick={loadVisitesData}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>🔄</span>
                    <span className="hidden sm:inline">Actualiser la liste</span>
                    <span className="sm:hidden">Actualiser</span>
                  </button>
                </div>

                {/* STATISTIQUES EN CARTES RAPIDES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-8 shrink-0 pb-1 sm:pb-2">
                  <div className="bg-ghardn-dark-900 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider font-sans">Total Demandes</p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5 sm:mt-1">{visiteStats.total}</h3>
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/30 font-mono">Dossiers</span>
                  </div>

                  <div className="bg-ghardn-dark-900 border border-red-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between bg-red-950/20">
                    <div>
                      <p className="text-[10px] sm:text-xs text-red-300 uppercase tracking-wider font-sans font-semibold">À Traiter</p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-red-400 mt-0.5 sm:mt-1">{visiteStats.nouveau}</h3>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-ghardn-red animate-pulse" />
                  </div>

                  <div className="bg-ghardn-dark-900 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between bg-amber-950/20">
                    <div>
                      <p className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider font-sans font-semibold">Contactés</p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-400 mt-0.5 sm:mt-1">{visiteStats.contacte}</h3>
                    </div>
                    <span className="text-[10px] sm:text-xs text-amber-300 font-mono">En cours</span>
                  </div>

                  <div className="bg-ghardn-dark-900 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between bg-emerald-950/20">
                    <div>
                      <p className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-wider font-sans font-semibold">RDV Confirmés</p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 mt-0.5 sm:mt-1">{visiteStats.rdv_confirme}</h3>
                    </div>
                    <span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Prévus</span>
                  </div>
                </div>

                {/* BARRE DE FILTRES ET RECHERCHE */}
                <div className="px-3 sm:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    <button
                      onClick={() => setVisiteFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        visiteFilterStatus === 'all'
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Toutes ({visiteStats.total})
                    </button>
                    <button
                      onClick={() => setVisiteFilterStatus('NOUVEAU')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        visiteFilterStatus === 'NOUVEAU'
                          ? 'bg-ghardn-red text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Nouvelles ({visiteStats.nouveau})
                    </button>
                    <button
                      onClick={() => setVisiteFilterStatus('CONTACTE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        visiteFilterStatus === 'CONTACTE'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Contacté ({visiteStats.contacte})
                    </button>
                    <button
                      onClick={() => setVisiteFilterStatus('RDV_CONFIRME')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        visiteFilterStatus === 'RDV_CONFIRME'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      RDV ({visiteStats.rdv_confirme})
                    </button>
                    <button
                      onClick={() => setVisiteFilterStatus('ARCHIVE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        visiteFilterStatus === 'ARCHIVE'
                          ? 'bg-white/30 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Archivé
                    </button>
                  </div>

                  <input
                    type="text"
                    value={visiteSearch}
                    onChange={(e) => setVisiteSearch(e.target.value)}
                    placeholder="Rechercher nom, tél, résidence..."
                    className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-white/40 focus:border-ghardn-red focus:outline-none"
                  />
                </div>

                {/* LISTE DES DEMANDES DE VISITES */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-8 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                  {loadingVisites ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/60">
                      <div className="w-8 h-8 border-2 border-ghardn-red border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-sans tracking-widest uppercase">Chargement des demandes...</p>
                    </div>
                  ) : filteredVisites.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-black/20 border border-dashed border-white/15 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-2">
                      <p className="text-base font-serif text-white/70">Aucune demande de visite trouvée.</p>
                      <p className="text-xs text-white/40">Les nouvelles demandes soumises apparaîtront ici automatiquement.</p>
                    </div>
                  ) : (
                    filteredVisites.map((v) => {
                      const badgeInfo = statusBadges[v.status] || statusBadges.NOUVEAU;
                      const isEditingThisNote = editingNoteId === v.id;

                      return (
                        <div
                          key={`visite-card-${v.id}`}
                          className="bg-ghardn-dark-900 border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-6 space-y-3.5 sm:space-y-4 transition-all hover:shadow-2xl"
                        >
                          {/* Ligne 1 : Nom, Typologie, Statut & Date */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                                  {v.name}
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] sm:text-xs font-medium font-sans">
                                  {v.residence}
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-white/50 font-sans">
                                Demande enregistrée le {new Date(v.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>

                            {/* SÉLECTEUR DE STATUT INTERACTIF */}
                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                              <select
                                value={v.status}
                                onChange={(e) => handleUpdateVisiteStatus(v.id, e.target.value)}
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl border text-xs font-bold font-sans cursor-pointer focus:outline-none ${badgeInfo.bg}`}
                              >
                                <option value="NOUVEAU" className="bg-ghardn-dark-900 text-white">Nouvelle Demande</option>
                                <option value="CONTACTE" className="bg-ghardn-dark-900 text-white">Client Contacté</option>
                                <option value="RDV_CONFIRME" className="bg-ghardn-dark-900 text-white">Rendez-vous Confirmé</option>
                                <option value="VISITE_EFFECTUEE" className="bg-ghardn-dark-900 text-white">Visite Effectuée</option>
                                <option value="ARCHIVE" className="bg-ghardn-dark-900 text-white">Classé / Archivé</option>
                              </select>

                              <button
                                onClick={() => setVisiteToDelete(v)}
                                className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white flex items-center justify-center text-xs transition-colors shrink-0"
                                title="Supprimer cette demande"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Ligne 2 : Coordonnées Directes (Téléphone & Email cliquables) */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-sans">
                            <a
                              href={`tel:${v.phone}`}
                              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-emerald-300 font-medium transition-all"
                            >
                              <span>📞 Appeler :</span>
                              <strong className="tracking-wider">{v.phone}</strong>
                            </a>

                            {v.email && (
                              <a
                                href={`mailto:${v.email}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all max-w-full truncate"
                              >
                                <span>✉️</span>
                                <span className="underline truncate">{v.email}</span>
                              </a>
                            )}

                            {v.preferred_date && (
                              <div className="flex items-center gap-1.5 text-ghardn-red font-medium px-2 py-1 bg-ghardn-red/10 rounded-lg border border-ghardn-red/20 text-[11px] sm:text-xs">
                                <span>📅 Créneau :</span>
                                <strong>{v.preferred_date}</strong>
                              </div>
                            )}
                          </div>

                          {/* Ligne 3 : Message du prospect */}
                          {v.message && (
                            <div className="p-3 sm:p-3.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white/80 font-sans leading-relaxed">
                              <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">
                                Message de l'acquéreur :
                              </span>
                              « {v.message} »
                            </div>
                          )}

                          {/* Ligne 4 : Notes internes administrateur */}
                          <div className="pt-2 border-t border-white/5">
                            {isEditingThisNote ? (
                              <div className="space-y-2">
                                <textarea
                                  rows={2}
                                  value={editingNoteText}
                                  onChange={(e) => setEditingNoteText(e.target.value)}
                                  placeholder="Note interne (ex: Client intéressé pour investissement locatif, rappel prévu mardi 10h)..."
                                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:border-ghardn-red focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingNoteId(null)}
                                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    onClick={() => handleSaveVisiteNotes(v.id)}
                                    className="px-4 py-1 rounded-lg bg-ghardn-red hover:bg-ghardn-red/90 text-xs font-bold text-white"
                                  >
                                    Enregistrer la note
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-xs text-white/60 font-sans">
                                <p className="truncate mr-4">
                                  <span className="text-white/40 font-semibold mr-1">Note de suivi :</span>
                                  {v.notes ? (
                                    <span className="text-white/80 font-medium">{v.notes}</span>
                                  ) : (
                                    <span className="italic text-white/40">Aucune note pour le moment.</span>
                                  )}
                                </p>
                                <button
                                  onClick={() => {
                                    setEditingNoteId(v.id);
                                    setEditingNoteText(v.notes || '');
                                  }}
                                  className="text-[11px] text-ghardn-red hover:underline font-semibold shrink-0"
                                >
                                  {v.notes ? 'Modifier la note' : '+ Ajouter une note'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

          </main>

        </div>
      )}

      {/* ================= MODALE 1 : CRÉER UN NOUVEL ALBUM ================= */}
      {isCreateAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl lg:max-w-6xl max-h-[92dvh] overflow-y-auto bg-ghardn-dark-900 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 scrollbar-thin scrollbar-thumb-white/20">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ghardn-red font-bold">
                  Nouveau Dossier
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Créer un Album Année
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Remplissez le formulaire à gauche : l'aperçu à droite vous montre en temps réel la destination exacte de chaque champ sur la carte de la galerie.
                </p>
              </div>
              <button
                onClick={() => setIsCreateAlbumModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Grid 2 colonnes : Formulaire à gauche (7 cols), Capture interactive avec flèches à droite (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* COLONNE GAUCHE (FORMULAIRE) */}
              <form onSubmit={handleCreateAlbum} className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Champ 1 : Année */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/40">
                        1
                      </span>
                      Année (ex: 2027)
                    </label>
                    <input
                      type="number"
                      value={newAlbumYear}
                      onChange={(e) => setNewAlbumYear(e.target.value)}
                      onFocus={() => setCreateFocusedField('year')}
                      onBlur={() => setCreateFocusedField(null)}
                      placeholder="2027"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                        createFocusedField === 'year'
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                          : 'border-white/20 focus:border-ghardn-red'
                      }`}
                      required
                    />
                    <span className="text-[10px] text-cyan-400/80 block mt-1">
                      ➔ Définit le badge de l'année en haut à gauche
                    </span>
                  </div>

                  {/* Champ 2 : Titre de l'Album */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                      <span className="px-1.5 py-0.5 rounded bg-ghardn-red/20 text-ghardn-red font-mono font-bold text-[10px] border border-ghardn-red/40">
                        2
                      </span>
                      Titre de l'Album
                    </label>
                    <input
                      type="text"
                      value={newAlbumTitle}
                      onChange={(e) => setNewAlbumTitle(e.target.value)}
                      onFocus={() => setCreateFocusedField('title')}
                      onBlur={() => setCreateFocusedField(null)}
                      placeholder="Ex: Finitions Extérieures & Espaces Verts"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                        createFocusedField === 'title'
                          ? 'border-ghardn-red ring-2 ring-ghardn-red/40'
                          : 'border-white/20 focus:border-ghardn-red'
                      }`}
                      required
                    />
                    <span className="text-[10px] text-ghardn-red/80 block mt-1">
                      ➔ Définit le grand titre rouge de la carte
                    </span>
                  </div>
                </div>

                {/* Champ 3 : Sous-titre */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/40">
                      3
                    </span>
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={newAlbumSubtitle}
                    onChange={(e) => setNewAlbumSubtitle(e.target.value)}
                    onFocus={() => setCreateFocusedField('subtitle')}
                    onBlur={() => setCreateFocusedField(null)}
                    placeholder="Ex: Aménagement paysager et clôtures"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                      createFocusedField === 'subtitle'
                        ? 'border-rose-400 ring-2 ring-rose-400/40'
                        : 'border-white/20 focus:border-ghardn-red'
                    }`}
                  />
                  <span className="text-[10px] text-rose-400/80 block mt-1">
                    ➔ Définit la ligne d'accroche sous le titre
                  </span>
                </div>

                {/* Champ 4 : Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/40">
                      4
                    </span>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newAlbumDesc}
                    onChange={(e) => setNewAlbumDesc(e.target.value)}
                    onFocus={() => setCreateFocusedField('desc')}
                    onBlur={() => setCreateFocusedField(null)}
                    placeholder="Détails du chantier et des travaux réalisés cette année-là..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                      createFocusedField === 'desc'
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-white/20 focus:border-ghardn-red'
                    }`}
                  />
                  <span className="text-[10px] text-amber-400/80 block mt-1">
                    ➔ Définit le paragraphe descriptif des travaux
                  </span>
                </div>

                {/* Champ 5 : Photo de Couverture */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/40">
                      5
                    </span>
                    Photo de Couverture de l'Album
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewAlbumCover(e.target.files[0])}
                    onFocus={() => setCreateFocusedField('cover')}
                    onBlur={() => setCreateFocusedField(null)}
                    className={`w-full px-3.5 py-2 rounded-xl bg-black/60 border text-white text-xs sm:text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ghardn-red file:text-white transition-all ${
                      createFocusedField === 'cover'
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                        : 'border-white/20'
                    }`}
                  />
                  <span className="text-[10px] text-emerald-400/80 block mt-1">
                    ➔ Définit la grande image d'illustration en haut
                  </span>
                </div>

                {createAlbumStatus.message && (
                  <div
                    className={`p-3 rounded-xl text-xs ${
                      createAlbumStatus.state === 'success'
                        ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                        : 'bg-red-500/20 border border-red-500/40 text-red-200'
                    }`}
                  >
                    {createAlbumStatus.message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsCreateAlbumModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createAlbumStatus.state === 'loading'}
                    className="px-6 py-2.5 rounded-xl bg-ghardn-red hover:bg-ghardn-red/90 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    {createAlbumStatus.state === 'loading' ? 'Création en cours...' : "Créer l'Album & Ouvrir"}
                  </button>
                </div>
              </form>

              {/* COLONNE DROITE (CAPTURE EN DIRECT AVEC FLÈCHES VERS LES DESTINATAIRES) */}
              <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 lg:sticky lg:top-0">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Aperçu Carte Galerie
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Site Public
                  </span>
                </div>

                {/* LA CARTE EXACTE DU SITE AVEC SES FLÈCHES D'ANNOTATIONS */}
                <div className="relative bg-ghardn-dark-800 border border-ghardn-red/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all">
                  
                  {/* ZONE 5 : PHOTO DE COUVERTURE & BADGES */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/80">
                    <img
                      src={newCoverPreviewUrl}
                      alt="Couverture"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        createFocusedField === 'cover' ? 'brightness-110 scale-105 ring-4 ring-emerald-400' : ''
                      }`}
                    />

                    {/* Flèche / étiquette pointant vers la photo */}
                    <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 backdrop-blur-md transition-all ${
                      createFocusedField === 'cover'
                        ? 'bg-emerald-500 text-black ring-2 ring-white scale-105'
                        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                    }`}>
                      <span>📸 5. Photo de couverture</span>
                      <span>↙</span>
                    </div>

                    {/* ZONE 1 : BADGE ANNÉE */}
                    <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1">
                      <div className={`bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full border transition-all ${
                        createFocusedField === 'year'
                          ? 'border-cyan-400 ring-4 ring-cyan-400/50 scale-105 bg-cyan-950/80'
                          : 'border-white/30'
                      }`}>
                        <span className="text-xs font-bold text-white font-sans tracking-wide">
                          ANNÉE {newAlbumYear || '2027'}
                        </span>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide shadow flex items-center gap-1 backdrop-blur-md transition-all ${
                        createFocusedField === 'year'
                          ? 'bg-cyan-400 text-black ring-2 ring-white scale-105'
                          : 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50'
                      }`}>
                        <span>↑ 1. Année</span>
                      </div>
                    </div>

                    {/* BADGE MÉDIAS FIXE */}
                    <div className="absolute bottom-3 right-3 bg-ghardn-red/90 px-3 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-sans text-white font-medium">
                        0 média (nouveau)
                      </span>
                    </div>
                  </div>

                  {/* CONTENU TEXTE DE LA CARTE */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      
                      {/* ZONE 2 : TITRE */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            createFocusedField === 'title'
                              ? 'bg-ghardn-red text-white ring-2 ring-white scale-105'
                              : 'bg-ghardn-red/20 text-ghardn-red border border-ghardn-red/40'
                          }`}>
                            <span>↓ 2. Titre de l'Album</span>
                          </span>
                        </div>
                        <h4 className={`text-lg font-serif font-bold text-ghardn-red transition-all rounded-lg p-1.5 leading-snug ${
                          createFocusedField === 'title'
                            ? 'bg-ghardn-red/20 ring-2 ring-ghardn-red scale-[1.02]'
                            : ''
                        }`}>
                          {newAlbumTitle || "Ex: Finitions d'Exception & Espaces Verts"}
                        </h4>
                      </div>

                      {/* ZONE 3 : SOUS-TITRE */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            createFocusedField === 'subtitle'
                              ? 'bg-rose-500 text-white ring-2 ring-white scale-105'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}>
                            <span>↓ 3. Sous-titre</span>
                          </span>
                        </div>
                        <p className={`text-xs text-rose-300/90 font-sans rounded-lg p-1.5 transition-all ${
                          createFocusedField === 'subtitle'
                            ? 'bg-rose-500/20 ring-2 ring-rose-400 scale-[1.02]'
                            : ''
                        }`}>
                          {newAlbumSubtitle || "Ex: Aménagement paysager, pergolas & rooftop"}
                        </p>
                      </div>

                      {/* ZONE 4 : DESCRIPTION */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            createFocusedField === 'desc'
                              ? 'bg-amber-400 text-black ring-2 ring-white scale-105'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}>
                            <span>↓ 4. Description complète</span>
                          </span>
                        </div>
                        <p className={`text-xs text-white/60 font-sans rounded-lg p-1.5 line-clamp-3 leading-relaxed transition-all ${
                          createFocusedField === 'desc'
                            ? 'bg-amber-500/20 ring-2 ring-amber-400 text-white scale-[1.02]'
                            : ''
                        }`}>
                          {newAlbumDesc || "Détails du chantier et des travaux d'aménagement réalisés cette année-là..."}
                        </p>
                      </div>

                    </div>

                    {/* PIED DE CARTE FIXE */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/60">Consulter l'album</span>
                      <span className="text-ghardn-red font-bold font-sans">
                        Voir les médias &rarr;
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE 2 : MODIFIER L'ALBUM ================= */}
      {isEditAlbumModalOpen && selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl lg:max-w-6xl max-h-[92dvh] overflow-y-auto bg-ghardn-dark-900 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 scrollbar-thin scrollbar-thumb-white/20">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ghardn-red font-bold">
                  Édition Album
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Modifier l'Album {selectedAlbum.year}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Aperçu en direct : les modifications effectuées à gauche se reflètent instantanément sur la carte ci-contre.
                </p>
              </div>
              <button
                onClick={() => setIsEditAlbumModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Grid 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Formulaire Édition (7 cols) */}
              <form onSubmit={handleSaveEditAlbum} className="lg:col-span-7 space-y-4">
                {/* Champ 2 : Titre de l'Album */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-ghardn-red/20 text-ghardn-red font-mono font-bold text-[10px] border border-ghardn-red/40">
                      2
                    </span>
                    Titre de l'Album
                  </label>
                  <input
                    type="text"
                    value={editAlbumTitle}
                    onChange={(e) => setEditAlbumTitle(e.target.value)}
                    onFocus={() => setEditFocusedField('title')}
                    onBlur={() => setEditFocusedField(null)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                      editFocusedField === 'title'
                        ? 'border-ghardn-red ring-2 ring-ghardn-red/40'
                        : 'border-white/20 focus:border-ghardn-red'
                    }`}
                    required
                  />
                  <span className="text-[10px] text-ghardn-red/80 block mt-1">
                    ➔ Définit le grand titre rouge de la carte
                  </span>
                </div>

                {/* Champ 3 : Sous-titre */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/40">
                      3
                    </span>
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={editAlbumSubtitle}
                    onChange={(e) => setEditAlbumSubtitle(e.target.value)}
                    onFocus={() => setEditFocusedField('subtitle')}
                    onBlur={() => setEditFocusedField(null)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                      editFocusedField === 'subtitle'
                        ? 'border-rose-400 ring-2 ring-rose-400/40'
                        : 'border-white/20 focus:border-ghardn-red'
                    }`}
                  />
                  <span className="text-[10px] text-rose-400/80 block mt-1">
                    ➔ Définit la ligne d'accroche sous le titre
                  </span>
                </div>

                {/* Champ 4 : Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/40">
                      4
                    </span>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editAlbumDesc}
                    onChange={(e) => setEditAlbumDesc(e.target.value)}
                    onFocus={() => setEditFocusedField('desc')}
                    onBlur={() => setEditFocusedField(null)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/60 border text-white text-base sm:text-sm focus:outline-none transition-all ${
                      editFocusedField === 'desc'
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-white/20 focus:border-ghardn-red'
                    }`}
                  />
                  <span className="text-[10px] text-amber-400/80 block mt-1">
                    ➔ Définit le paragraphe descriptif des travaux
                  </span>
                </div>

                {/* Champ 5 : Photo de Couverture */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase text-white/70 mb-1.5 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/40">
                      5
                    </span>
                    Remplacer la photo de couverture (optionnel)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditAlbumCover(e.target.files[0])}
                    onFocus={() => setEditFocusedField('cover')}
                    onBlur={() => setEditFocusedField(null)}
                    className={`w-full px-3.5 py-2 rounded-xl bg-black/60 border text-white text-xs sm:text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ghardn-red file:text-white transition-all ${
                      editFocusedField === 'cover'
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                        : 'border-white/20'
                    }`}
                  />
                  <span className="text-[10px] text-emerald-400/80 block mt-1">
                    ➔ Définit la grande image d'illustration en haut
                  </span>
                </div>

                {editAlbumStatus.message && (
                  <div
                    className={`p-3 rounded-xl text-xs ${
                      editAlbumStatus.state === 'success'
                        ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                        : 'bg-red-500/20 border border-red-500/40 text-red-200'
                    }`}
                  >
                    {editAlbumStatus.message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditAlbumModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editAlbumStatus.state === 'loading'}
                    className="px-6 py-2.5 rounded-xl bg-ghardn-red hover:bg-ghardn-red/90 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    {editAlbumStatus.state === 'loading' ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>

              {/* Aperçu en direct (5 cols) */}
              <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 lg:sticky lg:top-0">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Aperçu Carte Galerie
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Site Public
                  </span>
                </div>

                {/* Carte avec flèches */}
                <div className="relative bg-ghardn-dark-800 border border-ghardn-red/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all">
                  
                  {/* Photo de couverture & badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/80">
                    <img
                      src={editCoverPreviewUrl}
                      alt="Couverture"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        editFocusedField === 'cover' ? 'brightness-110 scale-105 ring-4 ring-emerald-400' : ''
                      }`}
                    />

                    {/* Flèche photo */}
                    <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 backdrop-blur-md transition-all ${
                      editFocusedField === 'cover'
                        ? 'bg-emerald-500 text-black ring-2 ring-white scale-105'
                        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                    }`}>
                      <span>📸 5. Photo de couverture</span>
                      <span>↙</span>
                    </div>

                    {/* Badge Année */}
                    <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1">
                      <div className="bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30">
                        <span className="text-xs font-bold text-white font-sans tracking-wide">
                          ANNÉE {selectedAlbum.year}
                        </span>
                      </div>
                      <div className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide shadow flex items-center gap-1 backdrop-blur-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/50">
                        <span>↑ 1. Année ({selectedAlbum.year})</span>
                      </div>
                    </div>

                    {/* Badge médias */}
                    <div className="absolute bottom-3 right-3 bg-ghardn-red/90 px-3 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-sans text-white font-medium">
                        {selectedAlbum.photos_count || 0} média{(selectedAlbum.photos_count || 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Contenu texte */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      
                      {/* Titre */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            editFocusedField === 'title'
                              ? 'bg-ghardn-red text-white ring-2 ring-white scale-105'
                              : 'bg-ghardn-red/20 text-ghardn-red border border-ghardn-red/40'
                          }`}>
                            <span>↓ 2. Titre de l'Album</span>
                          </span>
                        </div>
                        <h4 className={`text-lg font-serif font-bold text-ghardn-red transition-all rounded-lg p-1.5 leading-snug ${
                          editFocusedField === 'title'
                            ? 'bg-ghardn-red/20 ring-2 ring-ghardn-red scale-[1.02]'
                            : ''
                        }`}>
                          {editAlbumTitle || selectedAlbum.title || "Titre de l'album"}
                        </h4>
                      </div>

                      {/* Sous-titre */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            editFocusedField === 'subtitle'
                              ? 'bg-rose-500 text-white ring-2 ring-white scale-105'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}>
                            <span>↓ 3. Sous-titre</span>
                          </span>
                        </div>
                        <p className={`text-xs text-rose-300/90 font-sans rounded-lg p-1.5 transition-all ${
                          editFocusedField === 'subtitle'
                            ? 'bg-rose-500/20 ring-2 ring-rose-400 scale-[1.02]'
                            : ''
                        }`}>
                          {editAlbumSubtitle || selectedAlbum.subtitle || "Sous-titre..."}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center gap-1 transition-all ${
                            editFocusedField === 'desc'
                              ? 'bg-amber-400 text-black ring-2 ring-white scale-105'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}>
                            <span>↓ 4. Description complète</span>
                          </span>
                        </div>
                        <p className={`text-xs text-white/60 font-sans rounded-lg p-1.5 line-clamp-3 leading-relaxed transition-all ${
                          editFocusedField === 'desc'
                            ? 'bg-amber-500/20 ring-2 ring-amber-400 text-white scale-[1.02]'
                            : ''
                        }`}>
                          {editAlbumDesc || selectedAlbum.description || "Description..."}
                        </p>
                      </div>

                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/60">Consulter l'album</span>
                      <span className="text-ghardn-red font-bold font-sans">
                        Voir les médias &rarr;
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE 3 : AJOUTER DES PHOTOS & VIDÉOS DANS L'ALBUM ================= */}
      {isUploadPhotosModalOpen && selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl max-h-[90dvh] overflow-y-auto bg-ghardn-dark-900 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-white/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ghardn-red font-bold">
                  Téléversement Multimédia
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Ajouter Photos & Vidéos ({selectedAlbum.year})
                </h3>
              </div>
              <button
                onClick={() => setIsUploadPhotosModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadPhotosToAlbum} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1.5 font-medium">
                  Date de la prise de vue
                </label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm focus:border-ghardn-red focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1.5 font-medium">
                  Titre des fichiers (optionnel)
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ex: Pose du carrelage grand format et étanchéité"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm focus:border-ghardn-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1.5 font-medium">
                  Légende / Notes
                </label>
                <textarea
                  rows={2}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Ex: Contrôle de conformité avant réception..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm focus:border-ghardn-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1.5 font-medium">
                  Sélectionner les Photos et/ou Vidéos (Un ou plusieurs fichiers)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="w-full px-3.5 py-3 sm:py-4 rounded-xl bg-black/60 border border-dashed border-white/30 text-white text-xs sm:text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ghardn-red file:text-white hover:file:bg-ghardn-red/80 cursor-pointer"
                  required
                />
                <p className="text-[11px] text-white/50 mt-1 font-sans">
                  Formats acceptés : Photos (JPG, PNG, WEBP) & Vidéos (MP4, MOV, WEBM).
                </p>
                {uploadFiles.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-2 font-sans font-semibold">
                    ✓ {uploadFiles.length} fichier(s) multimédia sélectionné(s)
                  </p>
                )}
              </div>

              {uploadStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    uploadStatus.state === 'success'
                      ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                      : 'bg-red-500/20 border border-red-500/40 text-red-200'
                  }`}
                >
                  {uploadStatus.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotosModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploadStatus.state === 'loading'}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-ghardn-red hover:bg-ghardn-red/90 text-white text-xs font-bold shadow-lg"
                >
                  {uploadStatus.state === 'loading' ? 'Téléversement...' : `Téléverser (${uploadFiles.length || 0})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALE 4 : CONFIRMATION SUPPRESSION TOTALE ALBUM ================= */}
      {albumToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-ghardn-dark-900 border border-red-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-5 text-center scrollbar-thin scrollbar-thumb-white/20">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 text-xl sm:text-2xl font-bold">
              !
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                Supprimer l'Album {albumToDelete.year} ?
              </h3>
              <p className="text-xs sm:text-sm font-sans font-semibold text-red-300">
                « {albumToDelete.title} »
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-xs text-red-200 text-left space-y-2 font-sans">
              <p className="font-bold text-white uppercase tracking-wider text-[10px] sm:text-[11px]">
                Avertissement critique :
              </p>
              <p>
                La suppression entraînera la <strong className="text-white">suppression définitive de tous les {albumToDelete.photos_count || 0} média(s) (photos et vidéos)</strong> de cet album.
              </p>
              <p className="text-[11px] text-white/60">
                Cette action est immédiate et irréversible.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setAlbumToDelete(null)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeleteAlbum}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xl"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE 5 : CONFIRMATION SUPPRESSION PHOTO / VIDÉO ================= */}
      {photoToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-ghardn-dark-900 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Supprimer ce média ?
            </h3>
            <p className="text-xs text-white/70">
              « {photoToDelete.title || `Média #${photoToDelete.id}`} » ({photoToDelete.date_taken})
            </p>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeletePhoto}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE 6 : CONFIRMATION SUPPRESSION VISITE ================= */}
      {visiteToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-ghardn-dark-900 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Supprimer cette demande ?
            </h3>
            <p className="text-xs text-white/70">
              Prospect : <strong>{visiteToDelete.name}</strong> ({visiteToDelete.phone})
            </p>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setVisiteToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeleteVisite}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE 7 : APERÇU PHOTO & VIDÉO GRAND FORMAT ================= */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer animate-fadeIn"
          style={{ zIndex: 9999 }}
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-lg z-10"
          >
            ✕
          </button>
          
          {previewPhoto.media_type === 'video' || previewPhoto.video_url ? (
            <video
              src={previewPhoto.video_url || previewPhoto.video}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[75vh] max-w-[92vw] rounded-2xl border border-white/20 shadow-2xl bg-black"
            />
          ) : (
            <img
              src={previewPhoto.image_url || previewPhoto.image}
              alt={previewPhoto.title}
              className="max-h-[75vh] max-w-[92vw] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
          )}

          <div className="mt-3 sm:mt-4 text-center space-y-1">
            <h4 className="text-sm sm:text-base font-serif font-bold text-white">
              {previewPhoto.title || (previewPhoto.media_type === 'video' ? 'Vidéo' : 'Cliché')}
            </h4>
            <p className="text-[11px] sm:text-xs text-white/60">
              {previewPhoto.month_name} {previewPhoto.year} {previewPhoto.date_taken ? `· Prise le ${previewPhoto.date_taken}` : ''}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
