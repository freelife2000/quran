/**
 * Home Screen - Main Entry Point
 * شاشة الرئيسية - نقطة الدخول الرئيسية
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { useAppStore } from '../store/appStore';

const HomeScreen = ({ navigation }: any) => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { readingHistory } = useAppStore();

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const data = await API.getSurahs();
      setSurahs(data);
    } catch (err: any) {
      console.error('Error loading surahs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahPress = (surah: any) => {
    navigation.navigate('QuranReader', {
      surahNumber: surah.number,
      suraName: surah.name,
    });
  };

  const getRecentSurahs = () => {
    const recent = readingHistory.slice(0, 5);
    return surahs.filter((s: any) => recent.some((h: any) => h.surah === s.number));
  };

  const renderSurahItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => handleSurahPress(item)}
    >
      <View style={styles.surahNumberBadge}>
        <Text style={styles.surahNumber}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>
        <Text style={styles.surahDetails}>
          {item.numberOfAyahs} آية • {item.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#1E3A5F" />
    </TouchableOpacity>
  );

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

  const recentSurahs = getRecentSurahs();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>بسم الله الرحمن الرحيم</Text>
          <Text style={styles.headerSubtitle}>القرآن الكريم</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Prayers')}
          >
            <Ionicons name="time" size={28} color="#fff" />
            <Text style={styles.actionText}>أوقات الصلاة</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Adhkar')}
          >
            <Ionicons name="hand-left" size={28} color="#fff" />
            <Text style={styles.actionText}>الأذكار</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Surahs */}
        {recentSurahs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>آخر ما قرأت</Text>
            <FlatList
              data={recentSurahs}
              keyExtractor={(item) => item.number.toString()}
              renderItem={renderSurahItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* All Surahs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>جميع السور</Text>
          <FlatList
            data={surahs}
            keyExtractor={(item) => item.number.toString()}
            renderItem={renderSurahItem}
            scrollEnabled={false}
          />
        </View>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1E3A5F',
    fontFamily: 'amiri-regular',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'amiri-bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8D5B9',
    fontFamily: 'amiri-regular',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#27527A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'amiri-regular',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  surahCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surahNumberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8D5B9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumber: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'amiri-regular',
  },
});

export default HomeScreen;
