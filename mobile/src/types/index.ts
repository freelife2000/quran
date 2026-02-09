/**
 * Types and Interfaces for Quran App
 * الأنواع والواجهات لتطبيق القرآن
 */

export interface Verse {
  sura_no: number;
  aya_no: number;
  text: string;
  translation?: string;
  tafsir?: string;
  sura_name: string;
}

export interface Translation {
  id: string;
  name: string;
  language: string;
  author: string;
  verses: Record<string, string>;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
}

export interface Adhkar {
  id: string;
  type: string;
  text: string;
  count?: number;
  category: string;
}

export interface UserSettings {
  language: string;
  fontSize: number;
  theme: 'light' | 'dark';
  selectedTranslations: string[];
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

export interface BookmarkVerse {
  suraNo: number;
  ayahNo: number;
  timestamp: number;
  notes?: string;
}
