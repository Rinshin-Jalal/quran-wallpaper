export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  page: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
}

export interface VerseRange {
  surahNumber: number;
  startVerse: number;
  endVerse: number;
}

export type TextPosition = 'top' | 'center' | 'bottom';

export interface WallpaperSettings {
  backgroundColor: string;
  arabicTextColor: string;
  translationTextColor: string;
  arabicFontSize: number;
  translationFontSize: number;
  textPosition: TextPosition;
}

export interface UserSettings {
  verseRange: VerseRange;
  showArabic: boolean;
  showTranslation: boolean;
  translationEdition: string;
  wallpaperSettings: WallpaperSettings;
}
