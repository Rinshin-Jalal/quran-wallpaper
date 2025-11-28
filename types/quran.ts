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
  juz: number;
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

export interface UserSettings {
  verseRange: VerseRange;
  showArabic: boolean;
  showTranslation: boolean;
  translationEdition: string;
}
