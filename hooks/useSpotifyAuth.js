import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../constants/spotify';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function useSpotifyAuth() {
  const authenticate = async () => {
    console.log("🔄 Tentative de connexion à Spotify...");

    const authUrl = `${discovery.authorizationEndpoint}?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=user-read-currently-playing`;

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
