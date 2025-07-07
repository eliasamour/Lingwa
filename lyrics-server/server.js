import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/lyrics", async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: "Artist and title required" });
  }

  try {
    // 🔗 Compose une URL Genius au format
    const songSlug = `${artist} ${title}`
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, "")
      .replace(/\s+/g, "-");

    const songUrl = `https://genius.com/${songSlug}-lyrics`;

    console.log(`🔎 Scraping: ${songUrl}`);

    const { data: html } = await axios.get(songUrl);
    const $ = cheerio.load(html);

    // récupère le bloc de paroles
    const container = $("div[data-lyrics-container=true]");

    let extractedLyrics = "";

    container.contents().each((_, el) => {
      if (el.type === "text") {
        extractedLyrics += $(el).text();
      } else if (el.name === "br") {
        extractedLyrics += "\n";
      } else if (el.type === "tag") {
        extractedLyrics += $(el).text();
      }
    });

    // nettoyage
    extractedLyrics = extractedLyrics
      .replace(/\n{3,}/g, "\n\n")   // max 2 sauts de ligne
      .trim();

    res.json({ lyrics: extractedLyrics });
  } catch (err) {
    console.error("❌ Erreur côté server:", err.message);
    res.status(500).json({ error: "Error fetching lyrics" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ lyrics-server running on http://localhost:${PORT}`);
});
