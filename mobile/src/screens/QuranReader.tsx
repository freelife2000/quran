/**
 * Quran Reader Screen - Display and Read Quran
 * شاشة قارئ القرآن - عرض وقراءة القرآن
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { useAppStore } from '../store/appStore';

const QuranReader = ({ route, navigation }: any) => {
  const { surahNumber, suraName } = route.params;
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks, addBookmark, removeBookmark, addToHistory } =
    useAppStore();

  useEffect(() => {
    loadVerses();
    addToHistory(surahNumber, 1);
  }, [surahNumber]);

  const loadVerses = async () => {
    try {
      setLoading(true);
      const data = await API.getSurahVerses(surahNumber);
      setVerses(data);
    } catch (err: any) {
      console.error('Error loading verses:', err);
    } finally {
      setLoading(false);
    }
  };

  const isVerseBookmarked = (ayahNo: number) => {
    return bookmarks.some((b) => b.suraNo === surahNumber && b.ayahNo === ayahNo);
  };

  const handleBookmark = (ayahNo: number) => {
    if (isVerseBookmarked(ayahNo)) {
      removeBookmark(surahNumber, ayahNo);
      Alert.alert('تم', 'تم حذف الآية من المفضلة');
    } else {
      addBookmark({
        suraNo: surahNumber,
        ayahNo,
        timestamp: Date.now(),
      });
      Alert.alert('تم', 'تمت إضافة الآية إلى المفضلة');
    }
  };

  const handleShareVerse = async (ayahNo: number) => {
    const verse = verses.find((v) => v.aya_no === ayahNo);
    if (verse) {
      try {
        await Share.share({
          message: `${verse.text}\nسورة ${suraName} - الآية ${ayahNo}`,
          title: 'شارك الآية',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Surah Header */}
        <View style={styles.header}>
          <Text style={styles.bismillah}>بسم الله الرحمن الرحيم</Text>
          <Text style={styles.surahTitle}>{suraName}</Text>
        </View>

        {/* Verses */}
        <View style={styles.versesContainer}>
          {verses.map((verse) => (
            <View key={`${verse.sura_no}-${verse.aya_no}`} style={styles.verseCard}>
              {/* Verse Number Badge */}
              <View style={styles.verseNumberBadge}>
                <Text style={styles.verseNumberText}>{verse.aya_no}</Text>
              </View>

              {/* Verse Text */}
              <View style={styles.verseContent}>
                <Text style={styles.verseText}>{verse.text}</Text>

                {/* Actions */}
                <View style={styles.verseActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleBookmark(verse.aya_no)}
                  >
                    <Ionicons
                      name={isVerseBookmarked(verse.aya_no) ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={isVerseBookmarked(verse.aya_no) ? '#FFB81C' : '#999'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Tafsir', { surahNumber, ayahNo: verse.aya_no })}
                  >
                    <Ionicons name="book-outline" size={20} color="#1E3A5F" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShareVerse(verse.aya_no)}
                  >
                    <Ionicons name="share-social" size={20} color="#1E3A5F" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Translations', { surahNumber, suraName })}
        >
          <Ionicons name="globe-outline" size={24} color="#1E3A5F" />
          <Text style={styles.navButtonText}>ترجمات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#1E3A5F" />
          <Text style={styles.navButtonText}>الإعدادات</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1E3A5F',
    fontFamily: 'amiri-regular',
  },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  bismillah: {
    fontSize: 18,
    color: '#E8D5B9',
    fontFamily: 'amiri-regular',
    marginBottom: 8,
  },
  surahTitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'amiri-bold',
  },
  versesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  verseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8D5B9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  verseNumberText: {
    fontSize: 12,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
  },
  verseContent: {
    flex: 1,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1E3A5F',
    fontFamily: 'amiri-regular',
    textAlign: 'right',
    marginBottom: 12,
  },
  verseActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  navButtonText: {
    fontSize: 10,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
});

export default QuranReader;
