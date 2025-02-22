🎵 Lingwa – Apprends les langues en chantant ! 🌍

📌 Description

Lingwa est une application mobile qui permet de traduire en temps réel les paroles des musiques écoutées sur Spotify.L'objectif est d'aider les utilisateurs à apprendre des langues étrangères en comprenant les paroles de leurs chansons préférées.

✨ Fonctionnalités

✅ Connexion à Spotify – Récupère la musique en cours d'écoute
✅ Affichage des paroles originales – Directement depuis l’API Lyrics.ovh
✅ Traduction en temps réel – Utilisation de Google Translate API
✅ Sélection de la langue – Français, Anglais, Espagnol, Allemand, Italien, Portugais
✅ Interface fluide et intuitive – Expérience utilisateur simplifiée

📦 Installation et Configuration

1 - Prérequis

Node.js et npm installés

Expo CLI installé :

npm install -g expo-cli

Clé API Google Translate

Compte Spotify Developer avec une application configurée

2 - Installation du projet

Clonez le dépôt et installez les dépendances :

git clone https://github.com/ton-profil/lingwa.git
cd lingwa
npm install

3 - Configuration des variables d'environnement

Dans spotify.js, ajoutez votre Client ID Spotify et votre Redirect URI :

export const SPOTIFY_CLIENT_ID = 'VOTRE_CLIENT_ID';
export const SPOTIFY_REDIRECT_URI = 'VOTRE_REDIRECT_URI';

Dans useTranslation.js, ajoutez votre clé Google Translate API :

const GOOGLE_API_KEY = "VOTRE_CLE_API_GOOGLE";

4 - Lancer l’application

expo start

Scannez le QR code avec votre téléphone pour ouvrir l’application sur Expo Go.

🔥 Défis rencontrés

❌ Scraping interdit sur Genius → Utilisation de l’API Lyrics.ovh
❌ Limitation des modèles IA open-source → Passage à Google Translate API
❌ Gestion du rafraîchissement des paroles → Optimisation des requêtes pour éviter la surcharge

🚀 Améliorations futures

🔹 Améliorer l'UI/UX pour une meilleure expérience utilisateur
🔹 Développer un modèle IA personnalisé pour une traduction plus naturelle
🔹 Utiliser Musixmatch pour une base de données plus complète des paroles

📩 Contact

Si vous souhaitez contribuer ou avez des suggestions, contactez-moi !
📧 Email : elias.amour21@gmail.com
📍 LinkedIn : https://www.linkedin.com/in/elias-amour-1249aa225/
