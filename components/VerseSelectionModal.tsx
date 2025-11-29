import { View, Modal, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Surah, UserSettings } from '../types/quran';
import { saveSettings, resetProgress } from '../services/storage';
import { AyahToggle } from './AyahToggle';
import { VerseStepper } from './VerseStepper';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';

interface VerseSelectionModalProps {
  visible: boolean;
  selectedSurah: Surah | null;
  singleAyah: boolean;
  onSingleAyahChange: (value: boolean) => void;
  startVerse: number;
  onStartVerseChange: (value: number) => void;
  endVerse: number;
  onEndVerseChange: (value: number) => void;
  maxVerses: number;
  onClose: () => void;
  onSave: (settings: UserSettings) => Promise<void>;
}

export function VerseSelectionModal({
  visible,
  selectedSurah,
  singleAyah,
  onSingleAyahChange,
  startVerse,
  onStartVerseChange,
  endVerse,
  onEndVerseChange,
  maxVerses,
  onClose,
  onSave,
}: VerseSelectionModalProps) {
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
    await resetProgress();

    const verseCount = singleAyah ? 1 : endVerse - startVerse + 1;
    await onSave(settings);

    onClose();

    Alert.alert(
      '✓ Saved',
      `${selectedSurah.englishName} ${
        singleAyah ? `Ayah ${startVerse}` : `Ayah ${startVerse}-${endVerse}`
      }\n${verseCount} verse${verseCount > 1 ? 's' : ''} will appear on your wallpaper.`
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedSurah?.englishName}</Text>
            <Text style={styles.modalArabic}>{selectedSurah?.name}</Text>
          </View>

          <AyahToggle singleAyah={singleAyah} onToggle={onSingleAyahChange} />

          {singleAyah ? (
            <View style={styles.singleAyahPicker}>
              <VerseStepper
                value={startVerse}
                onChange={onStartVerseChange}
                min={1}
                max={maxVerses}
                label="Select Ayah"
              />
            </View>
          ) : (
            <View style={styles.rangePicker}>
              <View style={styles.rangeItem}>
                <VerseStepper
                  value={startVerse}
                  onChange={onStartVerseChange}
                  min={1}
                  max={endVerse}
                  label="From"
                />
              </View>

              <View style={styles.rangeItem}>
                <VerseStepper
                  value={endVerse}
                  onChange={onEndVerseChange}
                  min={startVerse}
                  max={maxVerses}
                  label="To"
                />
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
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.semibold,
  },
  modalArabic: {
    color: Colors.primary,
    fontSize: FontSizes.huge,
    marginTop: Spacing.md,
  },
  singleAyahPicker: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  rangePicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xxl,
  },
  rangeItem: {
    alignItems: 'center',
  },
  summaryBox: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  summaryText: {
    color: Colors.primary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.background,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
});
