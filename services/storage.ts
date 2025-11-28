import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerseRange, UserSettings } from '../types/quran';

const SETTINGS_KEY = 'user_settings';
const CURRENT_VERSE_KEY = 'current_verse_index';

const defaultSettings: UserSettings = {
  verseRange: {
    surahNumber: 1,
    startVerse: 1,
    endVerse: 7,
  },
  showArabic: true,
  showTranslation: true,
  translationEdition: 'en.asad',
};

export async function getSettings(): Promise<UserSettings> {
  try {
    const value = await AsyncStorage.getItem(SETTINGS_KEY);
    if (value) {
      return JSON.parse(value);
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function getCurrentVerseIndex(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(CURRENT_VERSE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveCurrentVerseIndex(index: number): Promise<void> {
  await AsyncStorage.setItem(CURRENT_VERSE_KEY, index.toString());
}
