import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WallpaperSettings as WallpaperSettingsType, TextPosition } from "../types/quran";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
} from "../constants/theme";

interface WallpaperSettingsProps {
  settings: WallpaperSettingsType;
  onSettingsChange: (settings: WallpaperSettingsType) => void;
}

const PRESET_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1a1a2e" },
  { name: "Dark Green", value: "#0d1f0d" },
  { name: "Dark Brown", value: "#1f150d" },
  { name: "Dark Purple", value: "#1a0d1f" },
];

const TEXT_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Gold", value: "#c9a227" },
  { name: "Silver", value: "#C0C0C0" },
  { name: "Light Blue", value: "#87CEEB" },
  { name: "Light Green", value: "#90EE90" },
];

const FONT_SIZES = [
  { name: "Small", arabic: 48, translation: 28 },
  { name: "Medium", arabic: 60, translation: 36 },
  { name: "Large", arabic: 72, translation: 42 },
  { name: "X-Large", arabic: 84, translation: 48 },
];

const TEXT_POSITIONS: { name: string; value: TextPosition }[] = [
  { name: "Top", value: "top" },
  { name: "Center", value: "center" },
  { name: "Bottom", value: "bottom" },
];

export function WallpaperSettingsComponent({
  settings,
  onSettingsChange,
}: WallpaperSettingsProps) {
  const handleBackgroundColorChange = (color: string) => {
    onSettingsChange({ ...settings, backgroundColor: color });
  };

  const handleArabicTextColorChange = (color: string) => {
    onSettingsChange({ ...settings, arabicTextColor: color });
  };

  const handleTranslationTextColorChange = (color: string) => {
    onSettingsChange({ ...settings, translationTextColor: color });
  };

  const handleFontSizeChange = (arabicSize: number, translationSize: number) => {
    onSettingsChange({
      ...settings,
      arabicFontSize: arabicSize,
      translationFontSize: translationSize,
    });
  };

  const handleTextPositionChange = (position: TextPosition) => {
    onSettingsChange({ ...settings, textPosition: position });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Background Color</Text>
        <View style={styles.colorRow}>
          {PRESET_COLORS.map((color) => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                settings.backgroundColor === color.value && styles.colorButtonSelected,
              ]}
              onPress={() => handleBackgroundColorChange(color.value)}
            >
              {settings.backgroundColor === color.value && (
                <Text style={[styles.checkmark, color.value === "#FFFFFF" && styles.checkmarkDark]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Arabic Text Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Arabic Text Color</Text>
        <View style={styles.colorRow}>
          {TEXT_COLORS.map((color) => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                settings.arabicTextColor === color.value && styles.colorButtonSelected,
              ]}
              onPress={() => handleArabicTextColorChange(color.value)}
            >
              {settings.arabicTextColor === color.value && (
                <Text style={[styles.checkmark, styles.checkmarkDark]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Translation Text Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translation Text Color</Text>
        <View style={styles.colorRow}>
          {TEXT_COLORS.map((color) => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                settings.translationTextColor === color.value && styles.colorButtonSelected,
              ]}
              onPress={() => handleTranslationTextColorChange(color.value)}
            >
              {settings.translationTextColor === color.value && (
                <Text style={[styles.checkmark, styles.checkmarkDark]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Font Size */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        <View style={styles.optionRow}>
          {FONT_SIZES.map((size) => (
            <TouchableOpacity
              key={size.name}
              style={[
                styles.optionButton,
                settings.arabicFontSize === size.arabic && styles.optionButtonSelected,
              ]}
              onPress={() => handleFontSizeChange(size.arabic, size.translation)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.arabicFontSize === size.arabic && styles.optionTextSelected,
                ]}
              >
                {size.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Text Position */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Position</Text>
        <View style={styles.optionRow}>
          {TEXT_POSITIONS.map((pos) => (
            <TouchableOpacity
              key={pos.value}
              style={[
                styles.optionButton,
                settings.textPosition === pos.value && styles.optionButtonSelected,
              ]}
              onPress={() => handleTextPositionChange(pos.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.textPosition === pos.value && styles.optionTextSelected,
                ]}
              >
                {pos.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  colorButtonSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  checkmark: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  checkmarkDark: {
    color: Colors.background,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  optionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  optionTextSelected: {
    color: Colors.background,
  },
});
