import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerseRange, UserSettings } from '../types/quran';

const SETTINGS_KEY = 'user_settings';
const CURRENT_VERSE_KEY = 'current_verse_index';
const PROGRESS_KEY = 'progress_data';

export interface ProgressData {
  currentVerseIndex: number;
  memorizedVerses: string[];
  verseViewCounts: Record<string, number>;
  totalViews: number;
  streakDays: number;
  lastViewedDate: string;
  startedDate: string;
}

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

const defaultProgress: ProgressData = {
  currentVerseIndex: 0,
  memorizedVerses: [],
  verseViewCounts: {},
  totalViews: 0,
  streakDays: 0,
  lastViewedDate: '',
  startedDate: '',
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

export async function getProgress(): Promise<ProgressData> {
  try {
    const value = await AsyncStorage.getItem(PROGRESS_KEY);
    if (value) {
      return JSON.parse(value);
    }
    return defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: ProgressData): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({
    ...defaultProgress,
    startedDate: new Date().toISOString().split('T')[0],
  }));
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
