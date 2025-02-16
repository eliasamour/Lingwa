import { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import useLyrics from '../hooks/useLyrics';
import useTranslation from '../hooks/useTranslation';
import { styles, COLORS } from '../styles';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function HomeScreen() {
  const router = useRouter();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentTrack();
    }, [])
  );

  const fetchCurrentTrack = async () => {
    setLoading(true);
    let token = await AsyncStorage.getItem('spotify_token');

    if (!token) {
      setTrack(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        setTrack(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTrack(data);
    } catch {
      setTrack(null);
    }
    setLoading(false);
  };

  const artist = track?.item?.artists[0]?.name;
  const title = track?.item?.name;
  const { lyrics, loading: lyricsLoading } = useLyrics(artist, title);
  const { translatedLyrics } = useTranslation(lyrics, selectedLanguage);

  const cleanText = (text) => {
    return text ? text.split("\n").map(line => line.trim()).filter(line => line !== "").join("\n") : "";
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
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* ✅ MODAL DE LANGUE */}
<Modal
  animationType="slide"
  transparent={true}
  visible={isPickerVisible}
  onRequestClose={() => setIsPickerVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>🌍 Choisissez une langue</Text>

      {/* ✅ Sélection des langues */}
      <View style={styles.languageSelection}>
        {[
          { code: 'fr', flag: '🇫🇷' },
          { code: 'en', flag: '🇬🇧' },
          { code: 'es', flag: '🇪🇸' },
          { code: 'de', flag: '🇩🇪' },
          { code: 'it', flag: '🇮🇹' },
          { code: 'pt', flag: '🇵🇹' }
        ].map((lang, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedLanguage(lang.code)}>
            <Text style={{ fontSize: 30 }}>{lang.flag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Bouton Valider */}
      <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>✅ Valider</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* ✅ HEADER AMÉLIORÉ */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Lingwa</Text>

        <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.languageButton}>
  <Text style={styles.languageButtonText}>🌍 Langue</Text>
</TouchableOpacity>
      </View>

      {/* ✅ Cover de l'album + Infos musique */}
      {track && track.item ? (
        <Animatable.View animation="fadeInUp" duration={800} style={styles.albumContainer}>
          <Image source={{ uri: track.item.album.images[0].url }} style={styles.albumCover} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">
              {track.item.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
              {track.item.artists.map(artist => artist.name).join(", ")}
            </Text>
          </View>
        </Animatable.View>
      ) : null}

      {/* ✅ Paroles */}
      <ScrollView style={styles.lyricsContainer}>
        {lyricsLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : lyrics ? (
          originalLines.map((line, index) => (
            <Animatable.View key={index} animation="fadeInUp" duration={500} delay={index * 100} style={styles.lyricsLine}>
              <Text style={styles.lyricsText}>{line}</Text>
              <Text style={styles.translatedLyricsText}>{translatedLines[index] || " "}</Text>
            </Animatable.View>
          ))
        ) : (
          <Animatable.View animation="fadeIn" duration={800} style={styles.noLyricsContainer}>
            <Text style={styles.noLyricsText}>🚫 Pas de paroles pour cette chanson.</Text>
          </Animatable.View>
        )}
      </ScrollView>

      {/* ✅ Bouton Rafraîchir bien placé en bas */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={fetchCurrentTrack} style={styles.button}>
          <Text style={styles.buttonText}>🔄 Rafraîchir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
