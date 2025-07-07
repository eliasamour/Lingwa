import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { StatusBar } from "expo-status-bar";

import useLyrics from "../hooks/useLyrics";
import useTranslation from "../hooks/useTranslation";
import { styles, COLORS } from "../styles";

export default function HomeScreen() {
  const router = useRouter();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // ➡ récupérer la musique courante
  const fetchCurrentTrack = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("spotify_token");

    if (!token) {
      setTrack(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 204) {
        setTrack(null);
      } else {
        const data = await response.json();
        setTrack(data);
      }
    } catch (error) {
      console.error("❌ Erreur Spotify:", error);
      setTrack(null);
    }

    setLoading(false);
  };

  // ➡ se rafraîchit à chaque focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentTrack();
    }, [])
  );

  // ➡ extraction artiste/titre
  const artist = track?.item?.artists[0]?.name;
  const title = track?.item?.name;

  useEffect(() => {
    if (artist && title) {
      console.log("🎤 artist:", artist);
      console.log("🎵 title:", title);
    }
  }, [track]);

  // ➡ hook de récupération des paroles
  const { lyrics, loading: lyricsLoading } = useLyrics(artist, title);

  // ➡ hook de traduction
  const {
    translatedLyrics,
    loading: translationLoading,
    error: translationError,
  } = useTranslation(lyrics, selectedLanguage);

  // ➡ transforme le texte en tableau de lignes
  const getLines = (text) =>
    text
      ? text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      : [];

  const originalLines = getLines(lyrics);
  const translatedLines = getLines(translatedLyrics);

  // ➡ égaliser la longueur
  while (translatedLines.length < originalLines.length) {
    translatedLines.push("");
  }
  while (originalLines.length < translatedLines.length) {
    originalLines.push("");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ✅ Modal langue */}
      <Modal
        animationType="slide"
        transparent
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌍 Choisissez une langue</Text>
            <View style={styles.languageSelection}>
              {[
                { code: "fr", flag: "🇫🇷" },
                { code: "en", flag: "🇬🇧" },
                { code: "es", flag: "🇪🇸" },
                { code: "de", flag: "🇩🇪" },
                { code: "it", flag: "🇮🇹" },
                { code: "pt", flag: "🇵🇹" },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setSelectedLanguage(lang.code)}
                >
                  <Text style={{ fontSize: 30 }}>{lang.flag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setIsPickerVisible(false)}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>✅ Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lingwa</Text>
        <TouchableOpacity
          onPress={() => setIsPickerVisible(true)}
          style={styles.languageButton}
        >
          <Text style={styles.languageButtonText}>🌍 Langue</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Pochette */}
      {track?.item && (
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          style={styles.albumContainer}
        >
          <Image
            source={{ uri: track.item.album.images[0].url }}
            style={styles.albumCover}
          />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {track.item.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {track.item.artists.map((a) => a.name).join(", ")}
            </Text>
          </View>
        </Animatable.View>
      )}

      {/* ✅ Paroles */}
      <ScrollView style={styles.lyricsContainer}>
        {lyricsLoading || translationLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : originalLines.length ? (
          originalLines.map((line, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              duration={500}
              delay={index * 100}
              style={styles.lyricsLine}
            >
              <Text style={styles.lyricsText}>{line}</Text>
              {translatedLines[index] && (
                <Text style={styles.translatedLyricsText}>
                  {translatedLines[index]}
                </Text>
              )}
            </Animatable.View>
          ))
        ) : (
          <Animatable.View
            animation="fadeIn"
            duration={800}
            style={styles.noLyricsContainer}
          >
            <Text style={styles.noLyricsText}>🚫 Pas de paroles pour cette chanson.</Text>
          </Animatable.View>
        )}
      </ScrollView>

      {/* ✅ Bouton refresh */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={fetchCurrentTrack} style={styles.button}>
          <Text style={styles.buttonText}>🔄 Rafraîchir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
