import {
  EventSubscription,
  NativeModule,
  requireNativeModule,
} from "expo-modules-core";

export interface Verse {
  numberInSurah: number;
  text: string;
  translation?: string;
}

export interface WallpaperConfig {
  backgroundColor: string;
  arabicTextColor: string;
  translationTextColor: string;
  arabicFontSize: number;
  translationFontSize: number;
  textPosition: string;
}

declare class QuranWallpaperServiceModule extends NativeModule {
  setSurahData(
    surahId: number,
    verses: string,
    startVerse: number,
    endVerse: number
  ): void;
  getSurahData(): { surahId: number; versesData: string; currentIndex: number };
  startWallpaperService(): boolean;
  setWallpaperConfig(config: string): void;
}

const Module = requireNativeModule<QuranWallpaperServiceModule>(
  "QuranWallpaperService"
);

export function setSurahData(
  surahId: number,
  verses: Verse[],
  startVerse: number,
  endVerse: number
): void {
  Module.setSurahData(surahId, JSON.stringify(verses), startVerse, endVerse);
}

export function getSurahData() {
  const data = Module.getSurahData();
  return {
    ...data,
    versesData: JSON.parse(data.versesData),
  };
}

export function startWallpaperService(): boolean {
  return Module.startWallpaperService();
}

export function addVerseChangeListener(
  listener: (event: { surahId: number; verseIndex: number }) => void
): EventSubscription {
  return Module.addListener("onVerseChanged", listener);
}

export function setLiveWallpaper(): void {
  Module.setLiveWallpaper();
}

export function setWallpaperConfig(config: WallpaperConfig): void {
  Module.setWallpaperConfig(JSON.stringify(config));
}
