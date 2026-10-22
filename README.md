# GHARDN PROM — Promotion Immobilière de Haut Standing

Plateforme web vitrine moderne et interactive avec galerie de suivi de chantier dynamique et interface d'administration sécurisée pour **GHARDN PROM**.

---

## 🌟 Fonctionnalités Principales

- **Site Vitrine Interactif** :
  - Défilement cinématique immersif (animations fluide GSAP / Lenis).
  - Présentation des résidences haut standing (F4 Prestige 135 m², F3 Centre 105 m², F3 Sud 102 m²).
  - Visite 3D et découverte des espaces nobles (lobby, terrasses, rooftop, piscine suspendue).
  - Formulaire de demande de visite privée avec suivi en direct.
- **Galerie Dynamique Smartphone & Albums** :
  - Classement par années (2024, 2025, 2026...).
  - Filtre mensuel intelligent et vue timeline smartphone.
  - Lecteur plein écran haute définition pour photos et vidéos 4K.
- **Espace d'Administration Dédié** :
  - Création et édition d'albums avec **aperçu carte en direct** et repères visuels interactifs.
  - Téléversement direct de médias (photos/vidéos) avec légendes et dates.
  - Gestion des demandes de visites clients (statuts, notes, historique).

---

## 🛠️ Architecture Technique

- **Frontend** : React 18, Vite, Tailwind CSS, Lucide Icons, GSAP & Lenis Smooth Scroll.
- **Backend** : Django 5, Django REST Framework, Django CORS Headers, SQLite / MySQL.
- **Serveur de Production** : Compatible Apache cPanel & Phusion Passenger (CloudLinux Python).

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- Node.js (v18+)
- Python (v3.10+)

### 2. Lancement du Frontend
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (port 5173)
npm run dev
```

### 3. Lancement du Backend Django
```bash
# Se placer dans le dossier backend
cd backend

# Créer et activer un environnement virtuel
python -m venv venv
# Sur Windows :
.\venv\Scripts\activate
# Sur Mac/Linux :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# (Optionnel) Initialiser la galerie de démonstration
python seed_gallery.py

# Démarrer le serveur API Django (port 8000)
python manage.py runserver
```

---

## 🌐 Déploiement cPanel

Le projet inclut une configuration clé en main pour hébergement mutualisé cPanel :
- `.htaccess` : routage SPA React, mise en cache et types MIME.
- `passenger_wsgi.py` : isolation stricte du virtualenv et amorçage Django WSGI.
- Guide complet disponible dans [`DEPLOYMENT_CPANEL_GUIDE.md`](./DEPLOYMENT_CPANEL_GUIDE.md).

---

## 📄 Licence & Propriété
© 2026 GHARDN PROM. Tous droits réservés.
