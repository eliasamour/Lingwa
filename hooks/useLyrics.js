import { useState, useEffect } from 'react';

const useLyrics = (artist, title) => {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!artist || !title) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        const data = await response.json();

        if (data.lyrics) {
          setLyrics(data.lyrics);
        } else {
          setLyrics(null);
          setError("Paroles introuvables.");
        }
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des paroles :", err);
        setError("Impossible de récupérer les paroles.");
      }

      setLoading(false);
    };

    fetchLyrics();
  }, [artist, title]); // Se met à jour à chaque changement de chanson

  return { lyrics, loading, error };
};

export default useLyrics;
