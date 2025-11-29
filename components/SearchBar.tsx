import { TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Search surah..."
      placeholderTextColor={Colors.textTertiary}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: Colors.darkBg,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    color: Colors.text,
    fontSize: FontSizes.md,
  },
});
