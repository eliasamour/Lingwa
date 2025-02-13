import { useState, useEffect } from "react";
import axios from "axios";

const GOOGLE_API_KEY = "***REMOVED***"; // ⚠️ Remplace avec ta vraie clé API Google Cloud

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
        console.log("🔍 Traduction en cours avec Google Translate...");

        // Vérification : Diviser en lignes et filtrer les vides
        const lines = lyrics.split("\n").filter(line => line.trim() !== "");
        if (lines.length === 0) {
          setError("❌ Aucun texte à traduire.");
          setLoading(false);
          return;
        }

        // Format de la requête API
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2`,
          {
            q: lines, // Envoi toutes les lignes en une seule requête
            target: targetLanguage,
            format: "text",
          },
          {
            params: { key: GOOGLE_API_KEY }, // La clé API doit être passée en paramètre d'URL
            headers: { "Content-Type": "application/json" }
          }
        );

        // Vérification de la réponse
        if (!response.data || !response.data.data || !response.data.data.translations) {
          throw new Error("Réponse invalide de l'API.");
        }

        // Récupérer la traduction ligne par ligne
        const translations = response.data.data.translations.map(t => t.translatedText);
        setTranslatedLyrics(translations.join("\n"));

      } catch (err) {
        console.error("❌ Erreur avec Google Translate :", err.response?.data || err.message);
        setError("Impossible de traduire les paroles.");
      }

      setLoading(false);
    };

    translateLyrics();
  }, [lyrics, targetLanguage]);

  return { translatedLyrics, loading, error };
};

export default useTranslation;
