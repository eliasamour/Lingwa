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

  const fetchCurrentTrack = async () => {
    setLoading(true);
    let token = await AsyncStorage.getItem('spotify_token');

    if (!token) {
      console.log("⚠️ Aucun token trouvé, l'utilisateur doit se reconnecter.");
      setTrack(null);
      setLoading(false);
      return;
    }

    try {
      console.log("🛜 Requête envoyée à Spotify...");
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        console.log("🎵 Aucune musique en cours sur Spotify.");
        setTrack(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data && data.item) {
        setTrack(data);
        console.log("🎶 Musique détectée :", data.item.name);
      } else {
        setTrack(null);
        console.log("⚠️ Aucune musique détectée.");
      }
    } catch (error) {
      console.error("❌ Erreur en récupérant la musique :", error);
      setTrack(null);
    }

    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentTrack();
    }, [])
  );

  const artist = track?.item?.artists[0]?.name;
  const title = track?.item?.name;
  const { lyrics, loading: lyricsLoading, error: lyricsError } = useLyrics(artist, title);
  const { translatedLyrics, loading: translationLoading, error: translationError } = useTranslation(lyrics, selectedLanguage);

  // ✅ Correction : Nettoyer les sauts de ligne inutiles
  const cleanText = (text) => {
    return text
      ? text
          .split("\n")
          .map(line => line.trim()) // Supprime les espaces vides
          .filter(line => line !== "") // Supprime les lignes vides
          .join("\n") // Reconstruit le texte proprement
      : "";
  };

  const originalLines = lyrics ? cleanText(lyrics).split("\n") : [];
  const translatedLines = translatedLyrics ? cleanText(translatedLyrics).split("\n") : [];

  // ✅ Correction : S'assurer que le nombre de lignes correspond
  while (translatedLines.length < originalLines.length) {
    translatedLines.push(""); // Ajoute une ligne vide si la traduction est trop courte
  }
  while (originalLines.length < translatedLines.length) {
    originalLines.push(""); // Ajoute une ligne vide si l'original est trop court
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : track && track.item ? (
        <>
          {/* ✅ Infos sur la musique en cours */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10 }}>
            <Image source={{ uri: track.item.album.images[0].url }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 15 }} />
            <View>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{track.item.name}</Text>
              <Text style={{ color: '#aaa', fontSize: 16 }}>{track.item.artists.map(artist => artist.name).join(", ")}</Text>
            </View>
          </View>

          {/* ✅ Affichage des paroles et traduction alignée */}
          <ScrollView style={{ marginTop: 20, padding: 10, maxHeight: 400 }}>
            {lyricsLoading || translationLoading ? (
              <ActivityIndicator size="small" color="#1DB954" />
            ) : lyricsError || translationError ? (
              <Text style={{ color: '#aaa', fontSize: 16 }}>{lyricsError || translationError}</Text>
            ) : (
              originalLines.map((line, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{line}</Text>
                  <Text style={{ color: '#1DB954', fontSize: 16, textAlign: 'center', fontStyle: 'italic' }}>
                    {translatedLines[index] || ""}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={{ color: '#aaa', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Aucune musique en cours
          </Text>
        </>
      )}

      {/* ✅ Bouton "Rafraîchir" toujours visible */}
      <TouchableOpacity
        onPress={fetchCurrentTrack}
        style={{
          marginTop: 20,
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: '#1DB954',
          borderRadius: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>🔄 Rafraîchir</Text>
      </TouchableOpacity>
    </View>
  );
}
