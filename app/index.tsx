import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Surah, UserSettings } from "../types/quran";
import { getSurahAyahs } from "../services/quranApi";
import { getProgress } from "../services/storage";
import { useQuranApp } from "../hooks/useQuranApp";
import { SearchBar } from "../components/SearchBar";
import { SurahList } from "../components/SurahList";
import { CurrentSelectionCard } from "../components/CurrentSelectionCard";
import { VerseSelectionModal } from "../components/VerseSelectionModal";
import { Colors, Spacing, FontSizes, FontWeights } from "../constants/theme";
import * as WallpaperService from "../modules/quran-wallpaper-service";

export default function HomeScreen() {
  const { surahs, loading, currentSelection, progress } = useQuranApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [maxVerses, setMaxVerses] = useState(7);
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(7);
  const [singleAyah, setSingleAyah] = useState(false);
  const [currentSelectionState, setCurrentSelectionState] =
    useState(currentSelection);
  const [progressState, setProgressState] = useState(progress);

  useEffect(() => {
    setCurrentSelectionState(currentSelection);
  }, [currentSelection]);

  useEffect(() => {
    setProgressState(progress);
  }, [progress]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString().includes(searchQuery)
  );

  const handleSurahPress = async (surah: Surah) => {
    setSelectedSurah(surah);
    // const count = await getSurahVerseCount(surah.number);
    setMaxVerses(surah.numberOfAyahs);
    setStartVerse(1);
    setEndVerse(surah.numberOfAyahs);
    setSingleAyah(false);
    setShowVerseModal(true);
  };

  const handleSave = async (settings: UserSettings) => {
    if (!selectedSurah) return;

    setCurrentSelectionState({
      surahName: selectedSurah.englishName,
      surahArabic: selectedSurah.name,
      startVerse: settings.verseRange.startVerse,
      endVerse: settings.verseRange.endVerse,
    });

    const newProgress = await getProgress();
    setProgressState(newProgress);

    const ayahs: any = await getSurahAyahs(selectedSurah.number);

    // Set wallpaper config first
    WallpaperService.setWallpaperConfig({
      backgroundColor: settings.wallpaperSettings.backgroundColor,
      arabicTextColor: settings.wallpaperSettings.arabicTextColor,
      translationTextColor: settings.wallpaperSettings.translationTextColor,
      arabicFontSize: settings.wallpaperSettings.arabicFontSize,
      translationFontSize: settings.wallpaperSettings.translationFontSize,
      textPosition: settings.wallpaperSettings.textPosition,
    });

    WallpaperService.setSurahData(
      selectedSurah.number,
      ayahs,
      settings.verseRange.startVerse - 1,
      settings.verseRange.endVerse - 1
    );
    WallpaperService.startWallpaperService();

    handleSetWallpaper();
  };

  const handleSetWallpaper = () => {
    try {
      WallpaperService.setLiveWallpaper();
    } catch (error) {
      Alert.alert("Error", "Could not open wallpaper picker");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentSelectionState ? (
        <CurrentSelectionCard
          surahName={currentSelectionState.surahName}
          surahArabic={currentSelectionState.surahArabic}
          startVerse={currentSelectionState.startVerse}
          endVerse={currentSelectionState.endVerse}
          progress={progressState}
        />
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>القرآن</Text>
          <Text style={styles.subtitle}>Select verses to memorize</Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <SurahList surahs={filteredSurahs} onSurahPress={handleSurahPress} />

      <VerseSelectionModal
        visible={showVerseModal}
        selectedSurah={selectedSurah}
        singleAyah={singleAyah}
        onSingleAyahChange={setSingleAyah}
        startVerse={startVerse}
        onStartVerseChange={setStartVerse}
        endVerse={endVerse}
        onEndVerseChange={setEndVerse}
        maxVerses={maxVerses}
        onClose={() => setShowVerseModal(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 70,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    alignItems: "center",
  },
  title: {
    color: Colors.primary,
    fontSize: FontSizes.giant,
    fontWeight: FontWeights.light,
  },
  subtitle: {
    color: Colors.textDisabled,
    fontSize: FontSizes.base,
    marginTop: Spacing.md,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  searchContainer: {
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
});
