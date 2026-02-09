/**
 * Translations Screen - Show Available translations and switch between them
 * شاشة الترجمات - عرض الترجمات المتاحة والتبديل بينها
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { useAppStore } from '../store/appStore';

const TranslationsScreen = ({ route }: any) => {
  const { surahNumber } = route.params;
  const [translations, setTranslations] = useState<any[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [translationVerses, setTranslationVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedTranslations, setSelectedTranslations } = useAppStore();

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await API.getTranslations();
      setTranslations(data);
      if (data.length > 0) {
        selectTranslation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectTranslation = async (translationId: string) => {
    try {
      setLoading(true);
      setSelectedTranslation(translationId);
      const verses = await API.getTranslation(surahNumber, translationId);
      setTranslationVerses(verses);
    } catch (error) {
      console.error('Error loading translation verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTranslationSelection = (translationId: string) => {
    const updated = selectedTranslations.includes(translationId)
      ? selectedTranslations.filter((id) => id !== translationId)
      : [...selectedTranslations, translationId];
    setSelectedTranslations(updated);
  };

  const renderTranslationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.translationItem,
        selectedTranslation === item.id && styles.selectedTranslation,
      ]}
      onPress={() => selectTranslation(item.id)}
    >
      <View style={styles.translationInfo}>
        <Text style={styles.translationName}>{item.name}</Text>
        <Text style={styles.translationAuthor}>{item.author}</Text>
      </View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => toggleTranslationSelection(item.id)}
      >
        <Ionicons
          name={selectedTranslations.includes(item.id) ? 'checkbox' : 'checkbox-outline'}
          size={24}
          color="#1E3A5F"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderVerseComparison = (verseIndex: number) => (
    <View key={verseIndex} style={styles.verseComparison}>
      <Text style={styles.verseNumber}>{verseIndex + 1}</Text>
      <View style={styles.verseTexts}>
        {selectedTranslations.map((translationId) => {
          const translation = translations.find((t) => t.id === translationId);
          return (
            <View key={translationId} style={styles.translationBlock}>
              <Text style={styles.translationLabel}>{translation?.name}</Text>
              <Text style={styles.translationText}>
                {translationVerses[verseIndex]?.[translationId] || 'N/A'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Available Translations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الترجمات المتاحة</Text>
          <FlatList
            data={translations}
            keyExtractor={(item) => item.id}
            renderItem={renderTranslationItem}
            scrollEnabled={false}
          />
        </View>

        {/* Comparison View */}
        {selectedTranslations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المقارنة</Text>
            {translationVerses.map((_, index) => renderVerseComparison(index))}
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
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  translationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTranslation: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  translationInfo: {
    flex: 1,
  },
  translationName: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  translationAuthor: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#999',
  },
  selectButton: {
    padding: 8,
  },
  verseComparison: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
  },
  verseNumber: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    width: 30,
  },
  verseTexts: {
    flex: 1,
    gap: 12,
  },
  translationBlock: {
    borderLeftWidth: 3,
    borderLeftColor: '#1E3A5F',
    paddingLeft: 12,
  },
  translationLabel: {
    fontSize: 10,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#333',
    lineHeight: 18,
  },
});

export default TranslationsScreen;
