import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import LanguageSelector from '../components/LanguageSelector';

export default function WelcomeScreen() {
  const router = useRouter();
  const { token, authenticate } = useSpotifyAuth();
  const [language, setLanguage] = useState('fr');

  // ✅ Vérifie l'URL de redirection après connexion Spotify
  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log("🔁 URL complète de redirection :", event.url);
  
      if (event.url.includes("#access_token=")) {
        const accessToken = event.url.split("#access_token=")[1]?.split("&")[0];
        console.log("✅ Access Token récupéré :", accessToken);
      } else {
        console.log("⚠️ Aucun Access Token trouvé dans l'URL. Vérifie les redirections.");
      }
    };
  
    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
  
    return () => {
      subscription.remove();
    };
  }, []);
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Image source={require('../assets/logo.png')} style={{ width: 150, height: 150, marginBottom: 20 }} />

      <Text style={{ color: '#fff', fontSize: 22, textAlign: 'center', marginBottom: 20 }}>
        Traduisez vos chansons Spotify en temps réel et apprenez en chantant ! 🎶
      </Text>

      <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />

      <TouchableOpacity
        onPress={() => {
          console.log("🎯 Bouton cliqué !");
          authenticate();
        }}
        style={{
          backgroundColor: '#1DB954',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 30,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          {token ? 'Connecté ! 🎧' : 'Se connecter avec Spotify'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/home')} style={{ marginTop: 15 }}>
        <Text style={{ color: '#aaa', fontSize: 16 }}>Passer</Text>
      </TouchableOpacity>
    </View>
  );
}
