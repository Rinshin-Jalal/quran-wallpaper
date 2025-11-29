import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Surah, UserSettings } from "../types/quran";
import { saveSettings, resetProgress } from "../services/storage";
import { AyahToggle } from "./AyahToggle";
import { VerseStepper } from "./VerseStepper";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
} from "../constants/theme";

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
  // Clamp "from" so it can never be > current "to"
  const handleStartChange = (value: number) => {
    const clamped = Math.min(Math.max(1, value), endVerse);
    onStartVerseChange(clamped);
  };

  // Clamp "to" so it can never be < current "from"
  const handleEndChange = (value: number) => {
    const clamped = Math.max(Math.min(maxVerses, value), startVerse);
    onEndVerseChange(clamped);
  };

  const isInvalidRange = !singleAyah && endVerse < startVerse; // safety fallback

  const handleSave = async () => {
    if (!selectedSurah) return;
    if (isInvalidRange) return; // extra guard

    const settings: UserSettings = {
      verseRange: {
        surahNumber: selectedSurah.number,
        startVerse: startVerse,
        endVerse: singleAyah ? startVerse : endVerse,
      },
      showArabic: true,
      showTranslation: true,
      translationEdition: "en.asad",
    };

    await saveSettings(settings);
    await resetProgress();

    const verseCount = singleAyah ? 1 : endVerse - startVerse + 1;
    await onSave(settings);

    onClose();

    Alert.alert(
      "✓ Saved",
      `${selectedSurah.englishName} ${
        singleAyah ? `Ayah ${startVerse}` : `Ayah ${startVerse}-${endVerse}`
      }\n${verseCount} verse${
        verseCount > 1 ? "s" : ""
      } will appear on your wallpaper.`
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Outer touchable: click outside to close */}
      <TouchableWithoutFeedback onPressOut={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "stretch",
            backgroundColor: Colors.overlay,
          }}
        >
          {/* Inner touchable: prevent outside-close when tapping content */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                backgroundColor: Colors.cardBg,
                borderTopLeftRadius: BorderRadius.xl,
                borderTopRightRadius: BorderRadius.xl,
                padding: Spacing.xxxl,
                paddingBottom: 40,
                width: "100%",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginBottom: Spacing.xxxl,
                }}
              >
                <Text
                  style={{
                    color: Colors.text,
                    fontSize: FontSizes.xxxl,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  {selectedSurah?.englishName}
                </Text>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: FontSizes.huge,
                    marginTop: Spacing.md,
                  }}
                >
                  {selectedSurah?.name}
                </Text>
              </View>

              <AyahToggle
                singleAyah={singleAyah}
                onToggle={onSingleAyahChange}
              />

              {singleAyah ? (
                <View
                  style={{
                    alignItems: "center",
                    marginBottom: Spacing.xxl,
                  }}
                >
                  <VerseStepper
                    value={startVerse}
                    onChange={onStartVerseChange}
                    min={1}
                    max={maxVerses}
                    label="Select Ayah"
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: Spacing.xxl,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <VerseStepper
                      value={startVerse}
                      onChange={handleStartChange}
                      min={1}
                      max={endVerse}
                      label="From"
                    />
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <VerseStepper
                      value={endVerse}
                      onChange={handleEndChange}
                      min={startVerse}
                      max={maxVerses}
                      label="To"
                    />
                  </View>
                </View>
              )}

              <View
                style={{
                  backgroundColor: Colors.background,
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.lg,
                  alignItems: "center",
                  marginBottom: Spacing.xxxl,
                }}
              >
                <Text
                  style={{
                    color: isInvalidRange ? Colors.error : Colors.primary,
                    fontSize: FontSizes.xl,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  {singleAyah
                    ? `Ayah ${startVerse}`
                    : endVerse >= startVerse
                    ? `${
                        endVerse - startVerse + 1
                      } verses (${startVerse}-${endVerse})`
                    : "Invalid range"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  columnGap: Spacing.md,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.surface,
                    paddingVertical: Spacing.lg,
                    borderRadius: BorderRadius.md,
                    alignItems: "center",
                  }}
                  onPress={onClose}
                >
                  <Text
                    style={{
                      color: Colors.textSecondary,
                      fontSize: FontSizes.lg,
                      fontWeight: FontWeights.semibold,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isInvalidRange
                      ? Colors.surface
                      : Colors.primary,
                    opacity: isInvalidRange ? 0.5 : 1,
                    paddingVertical: Spacing.lg,
                    borderRadius: BorderRadius.md,
                    alignItems: "center",
                  }}
                  onPress={handleSave}
                  disabled={isInvalidRange}
                >
                  <Text
                    style={{
                      color: Colors.background,
                      fontSize: FontSizes.lg,
                      fontWeight: FontWeights.semibold,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
