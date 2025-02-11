import { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export default function HomeScreen() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fonction pour récupérer la musique en cours
  const fetchCurrentTrack = async () => {
    setLoading(true); // Active le loader pendant la récupération

    const token = await AsyncStorage.getItem('spotify_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) { // 204 = Aucune musique en cours
        setTrack(null);
      } else {
        const data = await response.json();
        setTrack(data);
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : track ? (
        <>
          <Image source={{ uri: track.item.album.images[0].url }} style={{ width: 200, height: 200, marginBottom: 20 }} />
          <Text style={{ color: '#fff', fontSize: 22 }}>{track.item.name}</Text>
          <Text style={{ color: '#aaa', fontSize: 18 }}>{track.item.artists.map(artist => artist.name).join(", ")}</Text>
        </>
      ) : (
        <Text style={{ color: '#aaa', fontSize: 18 }}>Aucune musique en cours</Text>
      )}

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
    </View>
  );
}
