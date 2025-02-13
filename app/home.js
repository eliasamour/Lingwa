import { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import useLyrics from '../hooks/useLyrics';
import useTranslation from '../hooks/useTranslation';

export default function HomeScreen() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [tempLanguage, setTempLanguage] = useState('fr');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

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

  const cleanText = (text) => {
    return text
      ? text
          .split("\n")
          .map(line => line.trim())
          .filter(line => line !== "")
          .join("\n")
      : "";
  };

  const originalLines = lyrics ? cleanText(lyrics).split("\n") : [];
  const translatedLines = translatedLyrics ? cleanText(translatedLyrics).split("\n") : [];

  while (translatedLines.length < originalLines.length) {
    translatedLines.push("");
  }
  while (originalLines.length < translatedLines.length) {
    originalLines.push("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      {/* ✅ Titre + Bouton Langue */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Paroles</Text>

        <TouchableOpacity
          onPress={() => setIsPickerVisible(true)}
          style={{
            backgroundColor: '#333',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#fff'
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>🌍 Langue</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal de Sélection de Langue */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)' 
        }}>
          <View style={{
            backgroundColor: '#222',
            padding: 20,
            borderRadius: 15,
            width: '85%',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
              🌍 Choisissez une langue
            </Text>

            {/* ✅ Drapeaux */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15 }}>
              {[
                { code: 'fr', flag: '🇫🇷' },
                { code: 'en', flag: '🇬🇧' },
                { code: 'es', flag: '🇪🇸' },
                { code: 'de', flag: '🇩🇪' },
                { code: 'it', flag: '🇮🇹' },
                { code: 'pt', flag: '🇵🇹' }
              ].map((lang, index) => (
                <TouchableOpacity key={index} onPress={() => setTempLanguage(lang.code)}>
                  <Text style={{ fontSize: 30 }}>{lang.flag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ✅ Valider */}
            <TouchableOpacity
              onPress={() => {
                setSelectedLanguage(tempLanguage);
                setIsPickerVisible(false);
              }}
              style={{
                backgroundColor: '#1DB954',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✅ Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Affichage des paroles */}
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : track && track.item ? (
        <>
          {/* ✅ Cover de l'album + Détails */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 20 }}>
            <Image source={{ uri: track.item.album.images[0].url }} style={{ width: 100, height: 100, borderRadius: 10, marginRight: 15 }} />
            <View>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{track.item.name}</Text>
              <Text style={{ color: '#aaa', fontSize: 16 }}>{track.item.artists.map(artist => artist.name).join(", ")}</Text>
            </View>
          </View>

          {/* ✅ Paroles */}
          <ScrollView style={{ padding: 10, maxHeight: 400 }}>
            {originalLines.map((line, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{line}</Text>
                <Text style={{ color: '#1DB954', fontSize: 16, textAlign: 'center', fontStyle: 'italic' }}>
                  {translatedLines[index] || " "}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}

      {/* ✅ Bouton Rafraîchir */}
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
