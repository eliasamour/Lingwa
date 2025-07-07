# 🎵 Lingwa

*Lingwa* est une application React Native connectée à Spotify qui affiche et traduit les paroles de la chanson en cours de lecture.

---

## 🚀 Fonctionnalités

* Récupère le morceau en cours sur Spotify
* Récupère automatiquement les paroles via Genius (scraping)
* Traduit les paroles dans la langue de votre choix
* Design optimisé pour mobile avec Expo

---

## 📂 Structure du projet

```
 ├── Lingwa/           -> Code de l'application mobile (Expo)
    └── lyrics-server/    -> Serveur Node.js pour scraper les paroles
```

---

## ⚙️ Installation et lancement

1. **Cloner le projet depuis GitHub**

```bash
git clone https://github.com/eliasamour/Lingwa.git
```

2. **Installer les dépendances**

```bash
cd Lingwa
npm install
```

3. **Démarrer l'application mobile (Expo)**

```bash
npx expo start -c
```

4. **Démarrer le serveur Node.js (scraping des paroles)**

```bash
cd lyrics-server
node server.js
```

---

## 🛡️ Sécurité

**⚠️ Important**

* Ne publiez jamais vos fichiers `.env` contenant :

  * `GENIUS_ACCESS_TOKEN`
  * `SPOTIFY_CLIENT_ID`
  * `SPOTIFY_REDIRECT_URI`
  * `TRANSLATION_API_KEY`
* Ajoutez bien le `.env` dans votre `.gitignore` pour éviter de compromettre vos clés API.

---

AMOUR Elias
