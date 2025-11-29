import { View, Text, StyleSheet } from "react-native";
import { ProgressData } from "../services/storage";
import { ProgressStats } from "./ProgressStats";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "../constants/theme";

interface CurrentSelectionCardProps {
  surahName: string;
  surahArabic: string;
  startVerse: number;
  endVerse: number;
  progress: ProgressData | null;
}

export function CurrentSelectionCard({
  surahName,
  surahArabic,
  startVerse,
  endVerse,
  progress,
}: CurrentSelectionCardProps) {
  return (
    <View style={styles.currentCard}>
      <Text style={styles.currentLabel}>CURRENT SELECTION</Text>
      <Text style={styles.currentArabic}>{surahArabic}</Text>
      <Text style={styles.currentSurah}>{surahName}</Text>
      <Text style={styles.currentVerses}>
        {startVerse === endVerse
          ? `Ayah ${startVerse}`
          : `Ayah ${startVerse} - ${endVerse}`}
      </Text>

      {/* {progress && (
        <ProgressStats
          progress={progress}
          totalVerses={endVerse - startVerse + 1}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  currentCard: {
    paddingTop: 60,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  currentLabel: {
    color: Colors.textTertiary,
    fontSize: FontSizes.xs,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  currentArabic: {
    color: Colors.primary,
    fontSize: FontSizes.massive,
    marginBottom: Spacing.sm,
  },
  currentSurah: {
    color: Colors.text,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  currentVerses: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
  },
});
