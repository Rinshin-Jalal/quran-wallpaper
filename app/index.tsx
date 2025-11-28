import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  Keyboard,
} from 'react-native';
import { Surah, UserSettings } from '../types/quran';
import { getSurahs, getSurahVerseCount } from '../services/quranApi';
import { getSettings, saveSettings } from '../services/storage';

type SelectMode = 'surah' | 'juz';

const JUZ_DATA = [
  { number: 1, name: "Alif Lam Mim", start: "1:1", end: "2:141" },
  { number: 2, name: "Sayaqool", start: "2:142", end: "2:252" },
  { number: 3, name: "Tilkal Rusul", start: "2:253", end: "3:92" },
  { number: 4, name: "Lan Tana Loo", start: "3:93", end: "4:23" },
  { number: 5, name: "Wal Mohsanat", start: "4:24", end: "4:147" },
  { number: 6, name: "La Yuhibbullah", start: "4:148", end: "5:81" },
  { number: 7, name: "Wa Iza Samiu", start: "5:82", end: "6:110" },
  { number: 8, name: "Wa Lau Annana", start: "6:111", end: "7:87" },
  { number: 9, name: "Qalal Malao", start: "7:88", end: "8:40" },
  { number: 10, name: "Wa Alamu", start: "8:41", end: "9:92" },
  { number: 11, name: "Yatazeroon", start: "9:93", end: "11:5" },
  { number: 12, name: "Wa Mamin Da'able", start: "11:6", end: "12:52" },
  { number: 13, name: "Wa Ma Ubarrio", start: "12:53", end: "14:52" },
  { number: 14, name: "Rubama", start: "15:1", end: "16:128" },
  { number: 15, name: "Subhanallazi", start: "17:1", end: "18:74" },
  { number: 16, name: "Qal Alam", start: "18:75", end: "20:135" },
  { number: 17, name: "Iqtaraba", start: "21:1", end: "22:78" },
  { number: 18, name: "Qadd Aflaha", start: "23:1", end: "25:20" },
  { number: 19, name: "Wa Qalallazina", start: "25:21", end: "27:55" },
  { number: 20, name: "Amman Khalaq", start: "27:56", end: "29:45" },
  { number: 21, name: "Otlu Ma Oohi", start: "29:46", end: "33:30" },
  { number: 22, name: "Wa Manyaqnut", start: "33:31", end: "36:27" },
  { number: 23, name: "Wa Mali", start: "36:28", end: "39:31" },
  { number: 24, name: "Faman Azlam", start: "39:32", end: "41:46" },
  { number: 25, name: "Elahe Yuruddo", start: "41:47", end: "45:37" },
  { number: 26, name: "Ha Meem", start: "46:1", end: "51:30" },
  { number: 27, name: "Qala Fama Khatbukum", start: "51:31", end: "57:29" },
  { number: 28, name: "Qadd Sami Allah", start: "58:1", end: "66:12" },
  { number: 29, name: "Tabarakallazi", start: "67:1", end: "77:50" },
  { number: 30, name: "Amma Yatasa'aloon", start: "78:1", end: "114:6" },
];

export default function HomeScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<SelectMode>('surah');
  
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<typeof JUZ_DATA[0] | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  
  const [maxVerses, setMaxVerses] = useState(7);
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(7);
  const [singleAyah, setSingleAyah] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    surahName: string;
    surahArabic: string;
    startVerse: number;
    endVerse: number;
  } | null>(null);
  
  const handleVerseInput = (
    value: string,
    setter: (n: number) => void,
    min: number,
    max: number
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setter(Math.max(min, Math.min(max, num)));
    } else if (value === '') {
      setter(min);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [surahList, savedSettings] = await Promise.all([
          getSurahs(),
          getSettings(),
        ]);
        setSurahs(surahList);
        
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
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString().includes(searchQuery)
  );

  const handleSurahPress = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
    const count = await getSurahVerseCount(surah.number);
    setMaxVerses(count);
    setStartVerse(1);
    setEndVerse(Math.min(7, count));
    setSingleAyah(false);
    setShowVerseModal(true);
  };

  const handleJuzPress = (juz: typeof JUZ_DATA[0]) => {
    setSelectedJuz(juz);
    setSelectedSurah(null);
    Alert.alert(
      'Juz Selected',
      `Juz ${juz.number}: ${juz.name}\n${juz.start} - ${juz.end}\n\nThis will show verses from this Juz on your wallpaper.`,
      [{ text: 'OK' }]
    );
  };

  const handleSave = async () => {
    if (!selectedSurah) return;
    
    const settings: UserSettings = {
      verseRange: {
        surahNumber: selectedSurah.number,
        startVerse: singleAyah ? startVerse : startVerse,
        endVerse: singleAyah ? startVerse : endVerse,
      },
      showArabic: true,
      showTranslation: true,
      translationEdition: 'en.asad',
    };
    await saveSettings(settings);
    
    setCurrentSelection({
      surahName: selectedSurah.englishName,
      surahArabic: selectedSurah.name,
      startVerse: singleAyah ? startVerse : startVerse,
      endVerse: singleAyah ? startVerse : endVerse,
    });
    
    setShowVerseModal(false);
    
    const verseCount = singleAyah ? 1 : endVerse - startVerse + 1;
    Alert.alert(
      '✓ Saved',
      `${selectedSurah.englishName} ${singleAyah ? `Ayah ${startVerse}` : `Ayah ${startVerse}-${endVerse}`}\n${verseCount} verse${verseCount > 1 ? 's' : ''} will appear on your wallpaper.`
    );
  };

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => handleSurahPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.englishName}</Text>
        <Text style={styles.surahMeta}>
          {item.englishNameTranslation} • {item.numberOfAyahs} ayahs
        </Text>
      </View>
      <Text style={styles.surahArabic}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderJuzItem = ({ item }: { item: typeof JUZ_DATA[0] }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => handleJuzPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.juzNumber}>
        <Text style={styles.juzNumberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>
        <Text style={styles.surahMeta}>{item.start} → {item.end}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c9a227" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentSelection ? (
        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>CURRENT SELECTION</Text>
          <Text style={styles.currentArabic}>{currentSelection.surahArabic}</Text>
          <Text style={styles.currentSurah}>{currentSelection.surahName}</Text>
          <Text style={styles.currentVerses}>
            {currentSelection.startVerse === currentSelection.endVerse
              ? `Ayah ${currentSelection.startVerse}`
              : `Ayah ${currentSelection.startVerse} - ${currentSelection.endVerse}`}
          </Text>
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>
              {currentSelection.endVerse - currentSelection.startVerse + 1} verse{currentSelection.endVerse !== currentSelection.startVerse ? 's' : ''}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>القرآن</Text>
          <Text style={styles.subtitle}>Select verses to memorize</Text>
        </View>
      )}

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'surah' && styles.modeBtnActive]}
          onPress={() => setMode('surah')}
        >
          <Text style={[styles.modeBtnText, mode === 'surah' && styles.modeBtnTextActive]}>
            Surah
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'juz' && styles.modeBtnActive]}
          onPress={() => setMode('juz')}
        >
          <Text style={[styles.modeBtnText, mode === 'juz' && styles.modeBtnTextActive]}>
            Juz
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'surah' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search surah..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {mode === 'surah' ? (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={JUZ_DATA}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderJuzItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showVerseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSurah?.englishName}</Text>
              <Text style={styles.modalArabic}>{selectedSurah?.name}</Text>
            </View>

            <View style={styles.ayahToggle}>
              <TouchableOpacity
                style={[styles.ayahToggleBtn, !singleAyah && styles.ayahToggleBtnActive]}
                onPress={() => setSingleAyah(false)}
              >
                <Text style={[styles.ayahToggleText, !singleAyah && styles.ayahToggleTextActive]}>
                  Range
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ayahToggleBtn, singleAyah && styles.ayahToggleBtnActive]}
                onPress={() => setSingleAyah(true)}
              >
                <Text style={[styles.ayahToggleText, singleAyah && styles.ayahToggleTextActive]}>
                  Single Ayah
                </Text>
              </TouchableOpacity>
            </View>

            {singleAyah ? (
              <View style={styles.singleAyahPicker}>
                <Text style={styles.pickerLabel}>Select Ayah</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setStartVerse(Math.max(1, startVerse - 1))}
                  >
                    <Text style={styles.stepperText}>−</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.stepperInput}
                    value={startVerse.toString()}
                    onChangeText={(v) => handleVerseInput(v, setStartVerse, 1, maxVerses)}
                    keyboardType="number-pad"
                    selectTextOnFocus
                    maxLength={3}
                  />
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setStartVerse(Math.min(maxVerses, startVerse + 1))}
                  >
                    <Text style={styles.stepperText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.maxText}>of {maxVerses}</Text>
              </View>
            ) : (
              <View style={styles.rangePicker}>
                <View style={styles.rangeItem}>
                  <Text style={styles.pickerLabel}>From</Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setStartVerse(Math.max(1, startVerse - 1))}
                    >
                      <Text style={styles.stepperText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.stepperInput}
                      value={startVerse.toString()}
                      onChangeText={(v) => handleVerseInput(v, setStartVerse, 1, endVerse)}
                      keyboardType="number-pad"
                      selectTextOnFocus
                      maxLength={3}
                    />
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setStartVerse(Math.min(endVerse, startVerse + 1))}
                    >
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.rangeItem}>
                  <Text style={styles.pickerLabel}>To</Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setEndVerse(Math.max(startVerse, endVerse - 1))}
                    >
                      <Text style={styles.stepperText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.stepperInput}
                      value={endVerse.toString()}
                      onChangeText={(v) => handleVerseInput(v, setEndVerse, startVerse, maxVerses)}
                      keyboardType="number-pad"
                      selectTextOnFocus
                      maxLength={3}
                    />
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setEndVerse(Math.min(maxVerses, endVerse + 1))}
                    >
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                {singleAyah
                  ? `Ayah ${startVerse}`
                  : `${endVerse - startVerse + 1} verses (${startVerse}-${endVerse})`}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowVerseModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  currentCard: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#141414',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  currentLabel: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
  },
  currentArabic: {
    color: '#c9a227',
    fontSize: 42,
    marginBottom: 4,
  },
  currentSurah: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentVerses: {
    color: '#888',
    fontSize: 15,
    marginBottom: 12,
  },
  currentBadge: {
    backgroundColor: '#c9a227',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  currentBadgeText: {
    color: '#0d0d0d',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#c9a227',
    fontSize: 48,
    fontWeight: '300',
  },
  subtitle: {
    color: '#555',
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: '#c9a227',
  },
  modeBtnText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#0d0d0d',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  surahNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumberText: {
    color: '#c9a227',
    fontSize: 14,
    fontWeight: '600',
  },
  juzNumber: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#c9a227',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  juzNumberText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: '700',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  surahMeta: {
    color: '#666',
    fontSize: 13,
  },
  surahArabic: {
    color: '#c9a227',
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  modalArabic: {
    color: '#c9a227',
    fontSize: 32,
    marginTop: 8,
  },
  ayahToggle: {
    flexDirection: 'row',
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  ayahToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  ayahToggleBtnActive: {
    backgroundColor: '#1f1f1f',
  },
  ayahToggleText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
  },
  ayahToggleTextActive: {
    color: '#fff',
  },
  singleAyahPicker: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pickerLabel: {
    color: '#666',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    padding: 8,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    color: '#c9a227',
    fontSize: 28,
    fontWeight: '300',
  },
  stepperInput: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
    padding: 0,
  },
  maxText: {
    color: '#555',
    fontSize: 14,
    marginTop: 8,
  },
  rangePicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  rangeItem: {
    alignItems: 'center',
  },
  summaryBox: {
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  summaryText: {
    color: '#c9a227',
    fontSize: 18,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#888',
    fontSize: 17,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#c9a227',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#0d0d0d',
    fontSize: 17,
    fontWeight: '600',
  },
});
