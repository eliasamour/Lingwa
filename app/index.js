import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { styles, COLORS } from '../styles';
import * as Animatable from 'react-native-animatable';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function WelcomeScreen() {
  const router = useRouter();
  const { token, authenticate } = useSpotifyAuth();
  const [storedToken, setStoredToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await AsyncStorage.getItem('spotify_token');
      if (savedToken) {
        console.log("🔄 Token trouvé, mais pas de redirection forcée.");
        setStoredToken(savedToken);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      console.log("🔁 URL complète de redirection :", event.url);

      if (event.url.includes("#access_token=")) {
        const accessToken = event.url.split("#access_token=")[1]?.split("&")[0];
        console.log("✅ Access Token récupéré :", accessToken);

        await AsyncStorage.setItem('spotify_token', accessToken);
        setStoredToken(accessToken);

        router.push('/home');
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
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ✅ Texte "Lingwa" avec un dégradé corrigé */}
      <MaskedView
  style={styles.maskedView}
  maskElement={
    <Text style={[styles.appTitle, { backgroundColor: 'transparent' }]}>Lingwa</Text>
  }
>
  <LinearGradient
    colors={['#A855F7', '#3B82F6']} // 🔥 Violet → Bleu
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }} // 🔥 Assure un bon dégradé horizontal
    style={styles.gradientText}
  >
    <Text style={[styles.appTitle, { opacity: 0 }]}>Lingwa</Text>
  </LinearGradient>
</MaskedView>



      <Animatable.Text animation="fadeIn" duration={1200} delay={400} style={styles.subtitle}>
        Revivez vos musiques étrangères préférées. 🎶
      </Animatable.Text>

      {/* ✅ Bouton de connexion animé */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
        <TouchableOpacity onPress={authenticate} style={styles.button}>
          <Text style={styles.buttonText}>
            {storedToken ? 'Connecté ! 🎧' : 'Se connecter avec Spotify'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
