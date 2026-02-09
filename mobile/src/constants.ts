export const QURAN_DATA = {
  surahs: 114,
  totalVerses: 6236,
  revelation: ['Meccan', 'Medinan'],
};

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000',
  timeout: 10000,
};

export const LANGUAGES = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

export const THEMES = {
  light: {
    primary: '#1E3A5F',
    secondary: '#27527A',
    accent: '#E8D5B9',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    error: '#d32f2f',
  },
  dark: {
    primary: '#E8D5B9',
    secondary: '#FFB81C',
    accent: '#1E3A5F',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    error: '#ff6b6b',
  },
};

export const PRAYER_NAMES = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  sunset: 'الغروب',
  maghrib: 'المغرب',
  isha: 'العشاء',
  imsak: 'الإمساك',
  midnight: 'منتصف الليل',
};
