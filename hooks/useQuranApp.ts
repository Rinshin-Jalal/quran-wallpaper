import { useState, useEffect } from 'react';
import { Surah } from '../types/quran';
import { getSurahs } from '../services/quranApi';
import { getSettings, getProgress, ProgressData } from '../services/storage';

interface UseQuranAppReturn {
  surahs: Surah[];
  loading: boolean;
  error: string | null;
  progress: ProgressData | null;
  currentSelection: {
    surahName: string;
    surahArabic: string;
    startVerse: number;
    endVerse: number;
  } | null;
}

export function useQuranApp(): UseQuranAppReturn {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [currentSelection, setCurrentSelection] = useState<UseQuranAppReturn['currentSelection']>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [surahList, savedSettings, savedProgress] = await Promise.all([
          getSurahs(),
          getSettings(),
          getProgress(),
        ]);
        setSurahs(surahList);
        setProgress(savedProgress);

        const savedSurah = surahList.find(s => s.number === savedSettings.verseRange.surahNumber);
        if (savedSurah) {
          setCurrentSelection({
            surahName: savedSurah.englishName,
            surahArabic: savedSurah.name,
            startVerse: savedSettings.verseRange.startVerse,
            endVerse: savedSettings.verseRange.endVerse,
          });
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load data';
        setError(errorMessage);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return {
    surahs,
    loading,
    error,
    progress,
    currentSelection,
  };
}
