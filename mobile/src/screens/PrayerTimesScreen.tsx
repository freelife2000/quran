/**
 * Prayer Times Screen - Display Prayer times for user location
 * شاشة أوقات الصلاة - عرض أوقات الصلاة للموقع
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { useAppStore } from '../store/appStore';

const PrayerTimesScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppStore();

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      // Default to Egypt (Cairo) if location not set
      const lat = settings.location?.latitude || 30.0444;
      const lon = settings.location?.longitude || 31.2357;
      
      const data = await API.getPrayerTimes(lat, lon);
      setPrayerTimes(data);
    } catch (error) {
      console.error('Error loading prayer times:', error);
      Alert.alert('خطأ', 'فشل تحميل أوقات الصلاة');
    } finally {
      setLoading(false);
    }
  };

  const prayers = [
    { name: 'الفجر', key: 'fajr', icon: 'moon' },
    { name: 'الشروق', key: 'sunrise', icon: 'sunny' },
    { name: 'الظهر', key: 'dhuhr', icon: 'sunny' },
    { name: 'العصر', key: 'asr', icon: 'cloud' },
    { name: 'المغرب', key: 'maghrib', icon: 'sunset' },
    { name: 'العشاء', key: 'isha', icon: 'moon' },
  ];

  const PrayerCard = ({ prayer }: { prayer: any }) => {
    const time = prayerTimes?.[prayer.key];
    
    return (
      <View style={styles.prayerCard}>
        <View style={styles.prayerIconContainer}>
          <Ionicons name={prayer.icon as any} size={28} color="#fff" />
        </View>
        <View style={styles.prayerInfo}>
          <Text style={styles.prayerName}>{prayer.name}</Text>
          <Text style={styles.prayerTime}>{time || '02:30'}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>جاري تحميل أوقات الصلاة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>مواقيت الصلوات</Text>
          <Text style={styles.headerSubtitle}>
            {settings.location?.city || 'القاهرة'}
          </Text>
        </View>

        {/* Prayer Times */}
        <View style={styles.prayersContainer}>
          {prayers.map((prayer) => (
            <PrayerCard key={prayer.key} prayer={prayer} />
          ))}
        </View>

        {/* Next Prayer */}
        {prayerTimes && (
          <View style={styles.nextPrayerSection}>
            <Text style={styles.nextPrayerLabel}>الصلاة القادمة</Text>
            <View style={styles.nextPrayerCard}>
              <Text style={styles.nextPrayerName}>الظهر</Text>
              <Text style={styles.nextPrayerTime}>{prayerTimes.dhuhr}</Text>
              <Text style={styles.countdownText}>خلال 45 دقيقة</Text>
            </View>
          </View>
        )}

        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.settingsButtonText}>تغيير الموقع</Text>
        </TouchableOpacity>
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
    fontSize: 22,
    color: '#fff',
    fontFamily: 'amiri-bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8D5B9',
    fontFamily: 'amiri-regular',
  },
  prayersContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  prayerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#27527A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 14,
    fontFamily: 'amiri-regular',
    color: '#666',
  },
  nextPrayerSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  nextPrayerLabel: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#999',
    marginBottom: 8,
  },
  nextPrayerCard: {
    backgroundColor: 'linear-gradient(135deg, #1E3A5F 0%, #27527A 100%)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  nextPrayerName: {
    fontSize: 18,
    fontFamily: 'amiri-bold',
    color: '#fff',
    marginBottom: 8,
  },
  nextPrayerTime: {
    fontSize: 32,
    fontFamily: 'amiri-bold',
    color: '#E8D5B9',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 14,
    fontFamily: 'amiri-regular',
    color: '#fff',
  },
  settingsButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  settingsButtonText: {
    color: '#fff',
    fontFamily: 'amiri-bold',
    fontSize: 16,
  },
});

export default PrayerTimesScreen;
