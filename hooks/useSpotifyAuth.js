import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { CLIENT_ID, REDIRECT_URI } from '../constants/spotify';

console.log("🔍 CLIENT_ID:", CLIENT_ID);
console.log("🔍 REDIRECT_URI:", REDIRECT_URI);


const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function useSpotifyAuth() {
  const authenticate = async () => {
    console.log("🔄 Tentative de connexion à Spotify...");

    const authUrl = `${discovery.authorizationEndpoint}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-currently-playing`;

    console.log("🔗 URL générée :", authUrl);

    try {
      // 🔥 Ouvre le navigateur pour la connexion Spotify
      await Linking.openURL(authUrl);
      console.log("🌐 Navigateur ouvert avec succès !");
    } catch (error) {
      console.error("❌ Erreur en ouvrant l'URL :", error);
    }
  };

  return { authenticate };
}
