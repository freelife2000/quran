/**
 * Zustand Store - Application State Management
 * متجر Zustand - إدارة حالة التطبيق
 */

import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserSettings, BookmarkVerse } from '../types';

interface AppStore {
  // Quran Data
  surahs: any[];
  currentSurah: number;
  currentAyah: number;
  
  // Settings
  settings: UserSettings;
  selectedTranslations: string[];
  fontSize: number;
  theme: 'light' | 'dark';
  
  // Bookmarks and History
  bookmarks: BookmarkVerse[];
  readingHistory: { surah: number; ayah: number; timestamp: number }[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSurahs: (surahs: any[]) => void;
  setCurrentSurah: (sura: number) => void;
  setCurrentAyah: (ayah: number) => void;
  setSettings: (settings: UserSettings) => void;
  setSelectedTranslations: (translations: string[]) => void;
  setFontSize: (size: number) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addBookmark: (bookmark: BookmarkVerse) => void;
  removeBookmark: (suraNo: number, ayahNo: number) => void;
  addToHistory: (surah: number, ayah: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial State
  surahs: [],
  currentSurah: 1,
  currentAyah: 1,
  settings: {
    language: 'ar',
    fontSize: 16,
    theme: 'light',
    selectedTranslations: ['en-sahih-international'],
  },
  selectedTranslations: [],
  fontSize: 16,
  theme: 'light',
  bookmarks: [],
  readingHistory: [],
  isLoading: false,
  error: null,

  // Actions
  setSurahs: (surahs) => set({ surahs }),
  
  setCurrentSurah: (sura) => set({ currentSurah: sura }),
  
  setCurrentAyah: (ayah) => set({ currentAyah: ayah }),
  
  setSettings: (settings) => set({ settings }),
  
  setSelectedTranslations: (translations) =>
    set((state) => ({
      selectedTranslations: translations,
      settings: { ...state.settings, selectedTranslations: translations },
    })),
  
  setFontSize: (size) =>
    set((state) => ({
      fontSize: size,
      settings: { ...state.settings, fontSize: size },
    })),
  
  setTheme: (theme) =>
    set((state) => ({
      theme,
      settings: { ...state.settings, theme },
    })),
  
  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, bookmark],
    })),
  
  removeBookmark: (suraNo, ayahNo) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (b) => !(b.suraNo === suraNo && b.ayahNo === ayahNo)
      ),
    })),
  
  addToHistory: (surah, ayah) =>
    set((state) => ({
      readingHistory: [
        { surah, ayah, timestamp: Date.now() },
        ...state.readingHistory.slice(0, 49),
      ],
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  loadFromStorage: async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      const savedBookmarks = await AsyncStorage.getItem('bookmarks');
      const savedHistory = await AsyncStorage.getItem('history');

      set({
        settings: savedSettings ? JSON.parse(savedSettings) : get().settings,
        bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : [],
        readingHistory: savedHistory ? JSON.parse(savedHistory) : [],
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.multiSet([
        ['settings', JSON.stringify(state.settings)],
        ['bookmarks', JSON.stringify(state.bookmarks)],
        ['history', JSON.stringify(state.readingHistory)],
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));
