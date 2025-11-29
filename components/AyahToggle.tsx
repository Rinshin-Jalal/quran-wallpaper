import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';

interface AyahToggleProps {
  singleAyah: boolean;
  onToggle: (isSingle: boolean) => void;
}

export function AyahToggle({ singleAyah, onToggle }: AyahToggleProps) {
  return (
    <View style={styles.ayahToggle}>
      <TouchableOpacity
        style={[styles.ayahToggleBtn, !singleAyah && styles.ayahToggleBtnActive]}
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.ayahToggleText, !singleAyah && styles.ayahToggleTextActive]}>
          Range
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.ayahToggleBtn, singleAyah && styles.ayahToggleBtnActive]}
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.ayahToggleText, singleAyah && styles.ayahToggleTextActive]}>
          Single Ayah
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ayahToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  ayahToggleBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderRadius: BorderRadius.lg - 4,
  },
  ayahToggleBtnActive: {
    backgroundColor: Colors.surface,
  },
  ayahToggleText: {
    color: Colors.textTertiary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  ayahToggleTextActive: {
    color: Colors.text,
  },
});
