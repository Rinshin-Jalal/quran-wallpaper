import { View, Text, StyleSheet } from 'react-native';
import { ProgressData } from '../services/storage';
import { Colors, Spacing, FontSizes, FontWeights } from '../constants/theme';

interface ProgressStatsProps {
  progress: ProgressData;
  totalVerses: number;
}

export function ProgressStats({ progress, totalVerses }: ProgressStatsProps) {
  const progressPercentage = Math.min(
    100,
    (progress.memorizedVerses.length / totalVerses) * 100
  );

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {progress.memorizedVerses.length} / {totalVerses} memorized
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.totalViews}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {progress.currentVerseIndex + 1}
          </Text>
          <Text style={styles.statLabel}>Current</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    width: '100%',
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statValue: {
    color: Colors.primary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    color: Colors.textTertiary,
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
});
