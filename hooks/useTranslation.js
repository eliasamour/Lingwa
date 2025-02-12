import { useState, useEffect } from 'react';

const DEEPL_API_KEY = '***REMOVED***'; // ⚠️ Remplace par ta clé API

const useTranslation = (lyrics, targetLanguage) => {
  const [translatedLyrics, setTranslatedLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const translateLyrics = async () => {
      if (!lyrics || !targetLanguage) return;

      setLoading(true);
      setError(null);
      setTranslatedLyrics([]);

      try {
        console.log("🔍 Traduction ligne par ligne en cours avec DeepL...");

        // Séparer les paroles ligne par ligne
        const lines = lyrics.split("\n").map(line => line.trim());

        let translatedLines = [];

        for (const line of lines) {
          console.log(`📤 Envoi de la ligne : "${line}" à DeepL...`);

          // Vérifier si la ligne est vide
          if (line === "") {
            translatedLines.push("");
            continue;
          }

          // Pause pour éviter trop de requêtes à DeepL
          await new Promise(resolve => setTimeout(resolve, 1000));

          const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
              "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              text: line,
              target_lang: targetLanguage.toUpperCase()
            }).toString()
          });

          if (response.status === 403) {
            console.error("❌ Erreur HTTP 403 : Clé API invalide ou quota atteint !");
            setError("Clé API invalide ou quota dépassé. Vérifie ton compte DeepL.");
            setLoading(false);
            return;
          }

          if (response.status === 429) {
            console.warn("⏳ Trop de requêtes envoyées, pause de 5 secondes...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // 🚀 Pause de 5 secondes avant de réessayer
            continue; // Réessayer après la pause
          }

          if (!response.ok) {
            console.error(`❌ Erreur HTTP : ${response.status} ${response.statusText}`);
            setError(`Erreur DeepL : ${response.statusText}`);
            setLoading(false);
            return;
          }

          const data = await response.json();

          if (data.translations && data.translations.length > 0) {
            translatedLines.push(data.translations[0].text);
          } else {
            console.error("❌ Erreur de DeepL :", data);
            setError("Impossible de traduire certaines lignes.");
            translatedLines.push(""); // On met une ligne vide en cas d'erreur pour garder l'alignement
          }
        }

        setTranslatedLyrics(translatedLines);
      } catch (err) {
        console.error("❌ Erreur lors de la traduction avec DeepL :", err);
        setError("Erreur avec DeepL API.");
      }

      setLoading(false);
    };

    translateLyrics();
  }, [lyrics, targetLanguage]);

  return { translatedLyrics, loading, error };
};

export default useTranslation;
