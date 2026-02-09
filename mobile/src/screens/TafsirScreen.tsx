/**
 * Tafsir Screen - Show Islamic Commentary/Interpretation
 * شاشة التفسير - عرض التفسيرات الإسلامية
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import API from '../services/api';

const TafsirScreen = ({ route }: any) => {
  const { surahNumber, ayahNo } = route.params;
  const [tafsir, setTafsir] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTafsir();
  }, [surahNumber, ayahNo]);

  const loadTafsir = async () => {
    try {
      setLoading(true);
      const data = await API.getVerseTafsir(surahNumber, ayahNo);
      setTafsir(data);
    } catch (err: any) {
      setError('فشل تحميل التفسير');
      console.error('Error loading tafsir:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>جاري تحميل التفسير...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tafsir) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'لم يتم العثور على تفسير'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Verse Info */}
        <View style={styles.verseCard}>
          <Text style={styles.verseLabel}>الآية</Text>
          <Text style={styles.verseText}>{tafsir.text}</Text>
          <Text style={styles.verseReference}>
            سورة {tafsir.sura_name} - الآية {ayahNo}
          </Text>
        </View>

        {/* Tafsir */}
        <View style={styles.tafsirSection}>
          <Text style={styles.tafsirTitle}>التفسير</Text>
          <View style={styles.tafsirCard}>
            <Text style={styles.tafsirText}>{tafsir.tafsir}</Text>
          </View>
        </View>

        {/* Related Verses */}
        {tafsir.related_verses && tafsir.related_verses.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>آيات ذات صلة</Text>
            {tafsir.related_verses.map((verse: any, index: number) => (
              <View key={index} style={styles.relatedVerseCard}>
                <Text style={styles.relatedVerseText}>{verse.text}</Text>
                <Text style={styles.relatedVerseRef}>{verse.reference}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1E3A5F',
    fontFamily: 'amiri-regular',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    fontFamily: 'amiri-regular',
    textAlign: 'center',
  },
  verseCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A5F',
  },
  verseLabel: {
    fontSize: 12,
    fontFamily: 'amiri-bold',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
    textAlign: 'right',
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#999',
    textAlign: 'right',
  },
  tafsirSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tafsirTitle: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  tafsirCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E8D5B9',
  },
  tafsirText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'amiri-regular',
    color: '#333',
    textAlign: 'right',
  },
  relatedSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  relatedVerseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#27527A',
  },
  relatedVerseText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
    textAlign: 'right',
    marginBottom: 4,
  },
  relatedVerseRef: {
    fontSize: 11,
    fontFamily: 'amiri-regular',
    color: '#999',
    textAlign: 'right',
  },
});

export default TafsirScreen;
