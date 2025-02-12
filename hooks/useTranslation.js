import { useState, useEffect } from 'react';

const DEEPL_API_KEY = '***REMOVED***'; // ⚠️ Remplace par ta clé API

const useTranslation = (lyrics, targetLanguage) => {
  const [translatedLyrics, setTranslatedLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const translateLyrics = async () => {
      if (!lyrics || !targetLanguage) return;

      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Traduction complète en cours avec DeepL...");

        // Nettoyage des paroles (suppression des caractères spéciaux qui posent problème)
        const cleanedLyrics = lyrics.replace(/[^\w\s.,!?;:áéíóúüñÁÉÍÓÚÜÑ-]/g, "").trim();

        if (!cleanedLyrics) {
          setError("❌ Paroles invalides ou vides.");
          setLoading(false);
          return;
        }

        // Découpage en morceaux de 450 caractères max pour éviter les erreurs 400
        const MAX_LENGTH = 450;
        let chunks = [];
        let currentChunk = "";

        cleanedLyrics.split("\n").forEach(line => {
          if ((currentChunk.length + line.length) > MAX_LENGTH) {
            chunks.push(currentChunk);
            currentChunk = "";
          }
          currentChunk += line + "\n";
        });

        if (currentChunk.length > 0) chunks.push(currentChunk);

        console.warn(`⚠️ Texte trop long (${cleanedLyrics.length} caractères), divisé en ${chunks.length} parties.`);

        let translatedText = [];

        for (const chunk of chunks) {
          console.log(`📤 Envoi d'un segment de ${chunk.length} caractères à DeepL...`);

          await new Promise(resolve => setTimeout(resolve, 1000)); // ⏳ Attente de 1s entre chaque requête

          const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
              "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              text: chunk,
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

          if (response.status === 400) {
            console.error("❌ Erreur HTTP 400 : Texte non accepté par DeepL. Vérifie le format.");
            setError("Erreur d'envoi des paroles, texte trop complexe pour DeepL.");
            setLoading(false);
            return;
          }

          if (!response.ok) {
            console.error(`❌ Erreur HTTP : ${response.status} ${response.statusText}`);
            setError(`Erreur DeepL : ${response.statusText}`);
            setLoading(false);
            return;
          }

          const data = await response.json();

          if (data.translations && data.translations.length > 0) {
            translatedText.push(data.translations[0].text);
          } else {
            console.error("❌ Erreur de DeepL :", data);
            setError("Impossible de traduire certaines parties des paroles.");
          }
        }

        setTranslatedLyrics(translatedText.join("\n\n")); // 🔹 Assemble les segments traduits
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
