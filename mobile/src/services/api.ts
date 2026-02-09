/**
 * API Service - Communication with FastAPI Backend
 * خدمة API - التواصل مع خادم FastAPI
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process?.env?.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000';

class QuranAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Get Quran surahs list
   * الحصول على قائمة سور القرآن
   */
  async getSurahs() {
    try {
      const response = await this.api.get('/surahs');
      return response.data;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  }

  /**
   * Get specific surah verses
   * الحصول على آيات سورة محددة
   */
  async getSurahVerses(surahNumber: number) {
    try {
      const response = await this.api.get(`/surahs/${surahNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching surah ${surahNumber}:`, error);
      throw error;
    }
  }

  /**
   * Get verse with tafsir
   * الحصول على آية مع التفسير
   */
  async getVerseTafsir(surahNumber: number, ayahNumber: number) {
    try {
      const response = await this.api.get(`/verses/${surahNumber}/${ayahNumber}/tafsir`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tafsir:', error);
      throw error;
    }
  }

  /**
   * Get available translations
   * الحصول على الترجمات المتاحة
   */
  async getTranslations() {
    try {
      const response = await this.api.get('/translations');
      return response.data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }

  /**
   * Get specific translation for a surah
   * الحصول على ترجمة محددة لسورة
   */
  async getTranslation(surahNumber: number, translationId: string) {
    try {
      const response = await this.api.get(`/translations/${translationId}/surah/${surahNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching translation:', error);
      throw error;
    }
  }

  /**
   * Get prayer times for a location
   * الحصول على أوقات الصلاة لموقع محدد
   */
  async getPrayerTimes(latitude: number, longitude: number, date?: string) {
    try {
      const params: any = { latitude, longitude };
      if (date) params.date = date;
      const response = await this.api.get('/prayer-times', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      throw error;
    }
  }

  /**
   * Get adhkar (remembrances)
   * الحصول على الأذكار
   */
  async getAdhkar(category?: string) {
    try {
      const params = category ? { category } : {};
      const response = await this.api.get('/adhkar', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching adhkar:', error);
      throw error;
    }
  }

  /**
   * Search in quran
   * البحث في القرآن
   */
  async searchQuran(query: string) {
    try {
      const response = await this.api.get('/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error('Error searching quran:', error);
      throw error;
    }
  }

  /**
   * Health check
   * فحص حالة الخادم
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('API Health Check Failed:', error);
      throw error;
    }
  }
}

export default new QuranAPI();
