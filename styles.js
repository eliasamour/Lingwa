import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#A855F7', // Violet néon
  secondary: '#3B82F6', // Bleu éléctrique
  background: '#1E1B3A', // Bleu nuit foncé
  card: '#2C2442', // Fond carte violet foncé
  text: '#fff', // Texte blanc
  subText: '#D1D5DB', // Texte secondaire gris clair
  button: '#8B5CF6', // Violet clair
  buttonText: '#fff',
  gradientStart: '#312E81', // Dégradé bleu nuit
  gradientEnd: '#6D28D9', // Dégradé violet profond
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    paddingVertical: 10, // 🔥 Avant : 20 → Maintenant : 10 (moins d'espace)
    marginBottom: 5, // 🔥 Avant : 10 → Maintenant : 5
  },
  languageButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  languageButtonText: {
    color: COLORS.buttonText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  albumCover: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
  },
  songTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  artist: {
    color: COLORS.subText,
    fontSize: 16,
  },
  lyricsContainer: {
    flex: 1, // 🔥 Permet aux paroles d’occuper toute la hauteur dispo
    paddingHorizontal: 10,
    marginBottom: 10, // 🔥 Ajoute un petit espace avant le bouton
  },
  lyricsLine: {
    marginBottom: 20,
  },
  lyricsText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
  },
  translatedLyricsText: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: COLORS.button,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // ✅ Assombrit l'arrière-plan
  },
  modalContent: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noLyricsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200, // Hauteur suffisante pour un bon centrage
    backgroundColor: COLORS.card, // Fond similaire aux autres cartes
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  noLyricsText: {
    color: COLORS.text, // Couleur violet néon pour ressortir
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20, // 🔥 Descend un peu le header
    paddingHorizontal: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // 🔥 Permet au titre de se centrer proprement
  },
  languageButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  languageButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ✅ Container pour la cover de l’album et les infos musique
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  albumCover: {
    width: 80, // 🔥 Taille réduite pour ne pas trop prendre de place
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  songInfo: {
    flex: 1, // 🔥 Pour éviter que le texte dépasse du container
  },
  songTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
  },
  artist: {
    color: COLORS.subText,
    fontSize: 16,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // 🔥 Fond plus sombre
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },



  // ✅ Sous-titre sous "Lingwa"
  subtitle: {
    color: COLORS.subText,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginTop : 20,
    maxWidth: 300, // 🔥 Limite la largeur pour un affichage plus propre
  },

  // ✅ Bouton de connexion
  button: {
    backgroundColor: COLORS.button,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },

  
    // ✅ Dégradé appliqué au texte

    maskedView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  
    // ✅ Étend le LinearGradient pour couvrir le texte en largeur
    gradientText: {
      width: '100%', // 🔥 Permet au gradient de bien couvrir tout le texte
      height: 50, // 🔥 Ajuste la hauteur pour couvrir la taille du texte
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    // ✅ Style du texte "Lingwa"
    appTitle: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 0,
    },
// ✅ Dégradé sur le bouton
  gradientButton: {
    borderRadius: 30, // Arrondi les bords
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250, // Ajuster la taille
  },

  // ✅ Overlay pour que le bouton soit cliquable
  buttonOverlay: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30, // Assure que le TouchableOpacity suit le borderRadius
  },

  // ✅ Texte du bouton
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});