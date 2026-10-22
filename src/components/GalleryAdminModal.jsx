import React, { useState, useEffect } from 'react';

export default function GalleryAdminModal({ isOpen, onClose, onDataChanged }) {
  const [token, setToken] = useState(() => localStorage.getItem('ghardn_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active view tab
  const [adminTab, setAdminTab] = useState('upload'); // 'upload' | 'manage_photos' | 'create_album'

  // Data lists
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Upload Form State
  const [uploadYear, setUploadYear] = useState('2026');
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ state: 'idle', message: '' });

  // Create Album Form State
  const [newAlbumYear, setNewAlbumYear] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumSubtitle, setNewAlbumSubtitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState(null);
  const [albumStatus, setAlbumStatus] = useState({ state: 'idle', message: '' });

  // Check auth token validity
  useEffect(() => {
    if (!token || !isOpen) return;

    const checkToken = async () => {
      try {
        const res = await fetch('/api/auth/me/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem('ghardn_admin_token');
          setToken('');
        } else {
          loadAdminData();
        }
      } catch (err) {
        console.error('Erreur vérification token:', err);
      }
    };

    checkToken();
  }, [token, isOpen]);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [albumsRes, timelineRes] = await Promise.all([
        fetch('/api/albums/'),
        fetch('/api/timeline/'),
      ]);

      if (albumsRes.ok) {
        const aData = await albumsRes.json();
        setAlbums(aData || []);
        if (aData.length > 0 && !uploadYear) {
          setUploadYear(String(aData[0].year));
        }
      }

      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        const allP = (tData.timeline || []).flatMap((g) => g.photos);
        setPhotos(allP);
      }
    } catch (err) {
      console.error('Erreur chargement données admin:', err);
    } finally {
      setLoadingData(false);
    }
  };

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
      } catch (e) {}

      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('ghardn_admin_token', data.token);
        loadAdminData();
      } else {
        setAuthError(data.error || 'Identifiant ou mot de passe incorrect.');
      }
    } catch (err) {
      setAuthError('Erreur de connexion au serveur.');
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
    } catch (err) {
      // ignore
    }
    setToken('');
    localStorage.removeItem('ghardn_admin_token');
  };

  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    if (!uploadFiles || uploadFiles.length === 0) {
      setUploadStatus({ state: 'error', message: 'Veuillez sélectionner au moins une image.' });
      return;
    }

    setUploadStatus({ state: 'loading', message: 'Téléversement des fichiers en cours...' });

    const formData = new FormData();
    formData.append('year', uploadYear);
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

      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ state: 'success', message: `${uploadFiles.length} photo(s) ajoutée(s) avec succès !` });
        setUploadFiles([]);
        setUploadTitle('');
        setUploadCaption('');
        loadAdminData();
        if (onDataChanged) onDataChanged();
      } else {
        setUploadStatus({ state: 'error', message: data.error || 'Erreur lors du téléversement.' });
      }
    } catch (err) {
      setUploadStatus({ state: 'error', message: 'Erreur réseau avec le serveur Django.' });
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette photo ?')) return;

    try {
      const res = await fetch(`/api/admin/photos/${photoId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        loadAdminData();
        if (onDataChanged) onDataChanged();
      } else {
        alert('Erreur lors de la suppression de la photo.');
      }
    } catch (err) {
      alert('Erreur réseau lors de la suppression.');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumYear || !newAlbumTitle) {
      setAlbumStatus({ state: 'error', message: "Veuillez renseigner l'année et le titre." });
      return;
    }

    setAlbumStatus({ state: 'loading', message: "Création de l'album..." });

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
        setAlbumStatus({ state: 'success', message: `Album ${newAlbumYear} créé avec succès !` });
        setNewAlbumYear('');
        setNewAlbumTitle('');
        setNewAlbumSubtitle('');
        setNewAlbumDesc('');
        setNewAlbumCover(null);
        loadAdminData();
        if (onDataChanged) onDataChanged();
      } else {
        setAlbumStatus({ state: 'error', message: JSON.stringify(data) });
      }
    } catch (err) {
      setAlbumStatus({ state: 'error', message: 'Erreur de connexion serveur.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-ghardn-dark-900 border border-white/20 rounded-[30px] shadow-2xl flex flex-col overflow-hidden relative font-sans text-white">
        
        {/* EN-TÊTE DU PANNEAU ADMIN */}
        <div className="bg-ghardn-dark-800/90 border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] tracking-widest text-ghardn-red font-semibold uppercase">
              Backend Django API & Sécurité Hachée
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              Administration de la Galerie
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-ghardn-red text-xs text-white transition-colors"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-ghardn-red text-white flex items-center justify-center transition-colors text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENU : FORMULAIRE LOGIN OU PANNEAU DE CONTRÔLE */}
        {!token ? (
          
          /* VIEW 1 : AUTHENTIFICATION */
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">Connexion Sécurisée</h3>
              <p className="text-xs text-white/60">
                Authentification Django avec contrôle du mot de passe haché (PBKDF2 SHA-256).
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Identifiant Administrateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-ghardn-red hover:bg-ghardn-red/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg disabled:opacity-50"
              >
                {isAuthenticating ? 'Vérification cryptographique...' : 'Se connecter au Panneau'}
              </button>
            </form>
          </div>

        ) : (

          /* VIEW 2 : PANNEAU D'ADMINISTRATION */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TABS DU DASHBOARD */}
            <div className="bg-ghardn-dark-800/50 border-b border-white/10 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setAdminTab('upload')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  adminTab === 'upload'
                    ? 'bg-ghardn-red text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Ajouter des Photos
              </button>
              <button
                onClick={() => setAdminTab('manage_photos')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  adminTab === 'manage_photos'
                    ? 'bg-ghardn-red text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Gérer la Photothèque ({photos.length})
              </button>
              <button
                onClick={() => setAdminTab('create_album')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  adminTab === 'create_album'
                    ? 'bg-ghardn-red text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Nouvel Album Année ({albums.length})
              </button>
            </div>

            {/* CORPS DE L'ONGLET SÉLECTIONNÉ */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
              
              {/* TAB 1: UPLOAD PHOTOS */}
              {adminTab === 'upload' && (
                <form onSubmit={handleUploadPhotos} className="max-w-2xl space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-white/70 mb-1.5">
                        Année de l'Album
                      </label>
                      <select
                        value={uploadYear}
                        onChange={(e) => setUploadYear(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                      >
                        {albums.map((a) => (
                          <option key={`opt-${a.id}`} value={a.year} className="bg-ghardn-dark-900 text-white">
                            {a.year} - {a.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-white/70 mb-1.5">
                        Date de prise de vue
                      </label>
                      <input
                        type="date"
                        value={uploadDate}
                        onChange={(e) => setUploadDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Titre de la photo (optionnel)
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Ex: Pose du garde-corps vitré rooftop"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Légende / Détails techniques
                    </label>
                    <textarea
                      rows={2}
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="Ex: Verre feuilleté trempé 10+10 mm sur profilé aluminium encastré..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Fichiers Photos (Un ou plusieurs)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setUploadFiles(e.target.files)}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-dashed border-white/30 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ghardn-red file:text-white hover:file:bg-ghardn-red/80 cursor-pointer"
                      required
                    />
                    {uploadFiles.length > 0 && (
                      <p className="text-xs text-white/60 mt-1.5">
                        {uploadFiles.length} fichier(s) sélectionné(s)
                      </p>
                    )}
                  </div>

                  {uploadStatus.message && (
                    <div
                      className={`p-3 rounded-xl text-xs ${
                        uploadStatus.state === 'success'
                          ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                          : uploadStatus.state === 'error'
                          ? 'bg-red-500/20 border border-red-500/40 text-red-200'
                          : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {uploadStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadStatus.state === 'loading'}
                    className="py-3 px-6 bg-ghardn-red hover:bg-ghardn-red/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg disabled:opacity-50"
                  >
                    {uploadStatus.state === 'loading'
                      ? 'Téléversement en cours...'
                      : 'Enregistrer dans la base Django'}
                  </button>
                </form>
              )}

              {/* TAB 2: MANAGE PHOTOS */}
              {adminTab === 'manage_photos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">
                      Total : {photos.length} photographies dans la base de données.
                    </p>
                    <button
                      onClick={loadAdminData}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs"
                    >
                      Rafraîchir la liste
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((p) => (
                      <div
                        key={`admin-p-${p.id}`}
                        className="bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between"
                      >
                        <div className="aspect-square relative overflow-hidden bg-black/80">
                          <img
                            src={p.image_url || p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                            {p.month_name} {p.year}
                          </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-serif font-bold text-white line-clamp-1">
                              {p.title || `Photo #${p.id}`}
                            </p>
                            <p className="text-[10px] text-white/50 mt-0.5">
                              {p.date_taken}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeletePhoto(p.id)}
                            className="mt-3 w-full py-1.5 bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white rounded-lg text-xs font-medium transition-all"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CREATE ALBUM */}
              {adminTab === 'create_album' && (
                <form onSubmit={handleCreateAlbum} className="max-w-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-white/70 mb-1.5">
                        Année (Ex: 2027)
                      </label>
                      <input
                        type="number"
                        value={newAlbumYear}
                        onChange={(e) => setNewAlbumYear(e.target.value)}
                        placeholder="2027"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase text-white/70 mb-1.5">
                        Titre de l'Album
                      </label>
                      <input
                        type="text"
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                        placeholder="Ex: Livraison & Inauguration"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={newAlbumSubtitle}
                      onChange={(e) => setNewAlbumSubtitle(e.target.value)}
                      placeholder="Ex: Réception des clés et aménagements finaux"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Description complète
                    </label>
                    <textarea
                      rows={3}
                      value={newAlbumDesc}
                      onChange={(e) => setNewAlbumDesc(e.target.value)}
                      placeholder="Description détaillée de l'avancement..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:border-ghardn-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-white/70 mb-1.5">
                      Image de Couverture de l'Album
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewAlbumCover(e.target.files[0])}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ghardn-red file:text-white"
                    />
                  </div>

                  {albumStatus.message && (
                    <div
                      className={`p-3 rounded-xl text-xs ${
                        albumStatus.state === 'success'
                          ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                          : 'bg-red-500/20 border border-red-500/40 text-red-200'
                      }`}
                    >
                      {albumStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="py-3 px-6 bg-ghardn-red hover:bg-ghardn-red/90 text-white font-semibold rounded-xl text-sm transition-all"
                  >
                    Créer l'Album Année
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
