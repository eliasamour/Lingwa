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
        const res = await fetch(`http://192.168.1.42:3000/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
        const text = await res.text();

        try {
          const data = JSON.parse(text);
          if (data.lyrics) {
            setLyrics(data.lyrics);
          } else {
            console.warn("⚠️ Pas de lyrics dans la réponse :", data);
            setLyrics(null);
            setError("Pas de paroles trouvées.");
          }
        } catch (parseError) {
          console.error("❌ JSON parse failed :", text);
          setError("Réponse invalide du serveur.");
        }

      } catch (e) {
        console.error("❌ Erreur côté app:", e);
        setError("Impossible de récupérer les paroles.");
      }

      setLoading(false);
    };

    fetchLyrics();
  }, [artist, title]);

  return { lyrics, loading, error };
};

export default useLyrics;
