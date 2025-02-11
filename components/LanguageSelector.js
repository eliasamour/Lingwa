import { View, Text, TouchableOpacity } from 'react-native';

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

export default function LanguageSelector({ selectedLanguage, onSelectLanguage }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Choisissez votre langue :</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => onSelectLanguage(lang.code)} // ✅ Appelle correctement la fonction
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: selectedLanguage === lang.code ? '#1DB954' : '#333',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
