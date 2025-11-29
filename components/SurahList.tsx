import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Surah } from '../types/quran';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';

interface SurahListProps {
  surahs: Surah[];
  onSurahPress: (surah: Surah) => void;
}

export function SurahList({ surahs, onSurahPress }: SurahListProps) {
  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => onSurahPress(item)}
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

  return (
    <FlatList
      data={surahs}
      keyExtractor={(item) => item.number.toString()}
      renderItem={renderSurahItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: 10,
  },
  surahNumber: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  surahNumberText: {
    color: Colors.primary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  surahMeta: {
    color: Colors.textTertiary,
    fontSize: FontSizes.sm,
  },
  surahArabic: {
    color: Colors.primary,
    fontSize: FontSizes.huge,
  },
});
