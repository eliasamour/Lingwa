import { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      const token = await AsyncStorage.getItem('spotify_token');
      if (!token) return;

      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      setTrack(data);
      setLoading(false);
    };

    fetchCurrentTrack();
  }, []);

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
    </View>
  );
}
