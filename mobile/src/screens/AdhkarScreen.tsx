/**
 * Adhkar Screen - Islamic Remembrances (Dhikrullah)
 * شاشة الأذكار - الأذكار الإسلامية
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

const AdhkarScreen = () => {
  const [adhkar, setAdhkar] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('morning');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'morning', name: 'أذكار الصباح', icon: 'sunny' },
    { id: 'evening', name: 'أذكار المساء', icon: 'moon' },
    { id: 'sleep', name: 'أذكار النوم', icon: 'bed' },
    { id: 'general', name: 'أذكار عامة', icon: 'sparkles' },
  ];

  useEffect(() => {
    loadAdhkar();
  }, [selectedCategory]);

  const loadAdhkar = async () => {
    try {
      setLoading(true);
      const data = await API.getAdhkar(selectedCategory);
      setAdhkar(data);
    } catch (error) {
      console.error('Error loading adhkar:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryTab = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && styles.activeTab,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon as any}
        size={20}
        color={selectedCategory === category.id ? '#fff' : '#1E3A5F'}
      />
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === category.id && styles.activeTabText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderAdhkarItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.adhkarCard}>
      <View style={styles.adhkarNumberBadge}>
        <Text style={styles.adhkarNumber}>{index + 1}</Text>
      </View>
      <View style={styles.adhkarContent}>
        <Text style={styles.adhkarText}>{item.text}</Text>
        {item.count && (
          <Text style={styles.adhkarCount}>x{item.count}</Text>
        )}
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
      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategoryTab)}
        </View>
      </ScrollView>

      {/* Adhkar List */}
      <FlatList
        data={adhkar}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAdhkarItem}
        style={styles.adhkarList}
      />
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
  categoriesScroll: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
  },
  categoryTab: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#1E3A5F',
  },
  categoryTabText: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
  activeTabText: {
    color: '#fff',
  },
  adhkarList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  adhkarCard: {
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
  adhkarNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8D5B9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adhkarNumber: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
  },
  adhkarContent: {
    flex: 1,
  },
  adhkarText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
    textAlign: 'right',
    marginBottom: 8,
  },
  adhkarCount: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#999',
    textAlign: 'right',
  },
});

export default AdhkarScreen;
