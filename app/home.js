import { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import useLyrics from '../hooks/useLyrics';
import useTranslation from '../hooks/useTranslation';

export default function HomeScreen() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Langue par défaut

  // ✅ Fonction pour récupérer la musique en cours
  const fetchCurrentTrack = async () => {
    setLoading(true);

    let token = await AsyncStorage.getItem('spotify_token');
    if (!token) {
      console.log("⚠️ Aucun token trouvé, l'utilisateur doit se reconnecter.");
      setLoading(false);
      return;
    }

    try {
      console.log("🛜 Requête envoyée à Spotify...");
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        console.log("🔄 Token expiré, redirection vers la connexion Spotify...");
        setTrack(null);
        setLoading(false);
        return;
      }

      if (response.status === 204) {
        console.log("🎵 Aucune musique en cours sur Spotify.");
        setTrack(null);
        setLoading(false);
        return;
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("❌ Erreur JSON :", error);
        setTrack(null);
        setLoading(false);
        return;
      }

      if (data && data.item) {
        setTrack(data);
      } else {
        setTrack(null);
      }
    } catch (error) {
      console.error("❌ Erreur en récupérant la musique :", error);
    }

    setLoading(false);
  };

  // ✅ Rafraîchit les données quand l’utilisateur revient sur la page
  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentTrack();
    }, [])
  );

  // ✅ Récupération des paroles et traduction avec DeepL
  const artist = track?.item?.artists[0]?.name;
  const title = track?.item?.name;
  const { lyrics, loading: lyricsLoading, error: lyricsError } = useLyrics(artist, title);
  const { translatedLyrics, loading: translationLoading, error: translationError } = useTranslation(lyrics, selectedLanguage);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : track && track.item ? (
        <>
          {/* ✅ Affichage des infos de la musique */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10 }}>
            <Image source={{ uri: track.item.album.images[0].url }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 15 }} />
            <View>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{track.item.name}</Text>
              <Text style={{ color: '#aaa', fontSize: 16 }}>{track.item.artists.map(artist => artist.name).join(", ")}</Text>
            </View>
          </View>

          {/* ✅ Affichage des paroles traduites */}
          <ScrollView style={{ marginTop: 20, padding: 10, maxHeight: 400 }}>
            {lyricsLoading ? (
              <ActivityIndicator size="small" color="#1DB954" />
            ) : lyricsError ? (
              <Text style={{ color: '#aaa', fontSize: 16 }}>{lyricsError}</Text>
            ) : translationLoading ? (
              <ActivityIndicator size="small" color="#1DB954" />
            ) : translationError ? (
              <Text style={{ color: '#aaa', fontSize: 16 }}>{translationError}</Text>
            ) : translatedLyrics ? (
              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{translatedLyrics}</Text>
            ) : (
              <Text style={{ color: '#aaa', fontSize: 16 }}>Aucune traduction disponible.</Text>
            )}
          </ScrollView>

          {/* ✅ Bouton "Rafraîchir" */}
          <TouchableOpacity
            onPress={fetchCurrentTrack}
            style={{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: '#1DB954',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>🔄 Rafraîchir</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ color: '#aaa', fontSize: 18 }}>Aucune musique en cours</Text>
      )}
    </View>
  );
}
