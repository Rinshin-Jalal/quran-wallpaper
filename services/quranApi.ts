import { Surah, Ayah } from '../types/quran';

const BASE_URL = 'https://api.alquran.cloud/v1';

export async function getSurahs(): Promise<Surah[]> {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  if (data.code !== 200) throw new Error(data.status);
  return data.data;
}

export async function getAyah(
  surahNumber: number,
  ayahNumber: number,
  edition: string = 'quran-uthmani'
): Promise<Ayah> {
  const response = await fetch(
    `${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${edition}`
  );
  const data = await response.json();
  if (data.code !== 200) throw new Error(data.status);
  return data.data;
}

export async function getAyahWithTranslation(
  surahNumber: number,
  ayahNumber: number,
  translationEdition: string = 'en.asad'
): Promise<{ arabic: Ayah; translation: Ayah }> {
  const [arabicRes, translationRes] = await Promise.all([
    fetch(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`),
    fetch(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${translationEdition}`),
  ]);

  const arabicData = await arabicRes.json();
  const translationData = await translationRes.json();

  if (arabicData.code !== 200) throw new Error(arabicData.status);
  if (translationData.code !== 200) throw new Error(translationData.status);

  return {
    arabic: arabicData.data,
    translation: translationData.data,
  };
}

export async function getSurahVerseCount(surahNumber: number): Promise<number> {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}`);
  const data = await response.json();
  if (data.code !== 200) throw new Error(data.status);
  return data.data.numberOfAyahs;
}
