/**
 * Settings Screen - App Configuration and Preferences
 * شاشة الإعدادات - إعدادات التطبيق والتفضيلات
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';

const SettingsScreen = () => {
  const { setFontSize, setTheme, fontSize, theme, saveToStorage } =
    useAppStore();

  useEffect(() => {
    saveToStorage();
  }, [fontSize, theme]);

  const fontSizes = [12, 14, 16, 18, 20];

  const SettingSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Display Settings */}
        <SettingSection title="إعدادات العرض">
          <SettingRow label="حجم الخط">
            <View style={styles.fontSizeControl}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    fontSize === size && styles.activeFontSizeButton,
                  ]}
                  onPress={() => setFontSize(size)}
                >
                  <Text
                    style={[
                      styles.fontSizeButtonText,
                      { fontSize: size },
                      fontSize === size && styles.activeFontSizeButtonText,
                    ]}
                  >
                    أ
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>

          <SettingRow label="المظهر">
            <View style={styles.themeControl}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  theme === 'light' && styles.activeThemeButton,
                ]}
                onPress={() => setTheme('light')}
              >
                <Ionicons name="sunny" size={20} color={theme === 'light' ? '#fff' : '#1E3A5F'} />
                <Text
                  style={[
                    styles.themeButtonText,
                    theme === 'light' && styles.activeThemeButtonText,
                  ]}
                >
                  فاتح
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeButton,
                  theme === 'dark' && styles.activeThemeButton,
                ]}
                onPress={() => setTheme('dark')}
              >
                <Ionicons name="moon" size={20} color={theme === 'dark' ? '#fff' : '#1E3A5F'} />
                <Text
                  style={[
                    styles.themeButtonText,
                    theme === 'dark' && styles.activeThemeButtonText,
                  ]}
                >
                  غامق
                </Text>
              </TouchableOpacity>
            </View>
          </SettingRow>
        </SettingSection>

        {/* Language Settings */}
        <SettingSection title="اللغة">
          <SettingRow label="اللغة الافتراضية">
            <View style={styles.languageButtons}>
              {[
                { code: 'ar', name: 'العربية' },
                { code: 'en', name: 'English' },
              ].map((lang) => (
                <TouchableOpacity key={lang.code} style={styles.languageButton}>
                  <Text style={styles.languageButtonText}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection title="الإشعارات">
          <SettingRow label="إشعارات أوقات الصلاة">
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor="#fff"
            />
          </SettingRow>

          <SettingRow label="إشعارات الأذكار اليومية">
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor="#fff"
            />
          </SettingRow>
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection title="البيانات والخصوصية">
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>مسح المرجعيات</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>مسح سجل القراءة</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>سياسة الخصوصية</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </SettingSection>

        {/* About */}
        <SettingSection title="حول التطبيق">
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>إصدار التطبيق</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>آخر تحديث</Text>
            <Text style={styles.aboutValue}>2024</Text>
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>تقييم التطبيق</Text>
            <Ionicons name="star" size={20} color="#FFB81C" />
          </TouchableOpacity>
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionContent: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
  fontSizeControl: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeFontSizeButton: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  fontSizeButtonText: {
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
  },
  activeFontSizeButtonText: {
    color: '#fff',
  },
  themeControl: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThemeButton: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  themeButtonText: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
  activeThemeButtonText: {
    color: '#fff',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 12,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'amiri-regular',
    color: '#1E3A5F',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutLabel: {
    fontSize: 14,
    fontFamily: 'amiri-regular',
    color: '#999',
  },
  aboutValue: {
    fontSize: 14,
    fontFamily: 'amiri-bold',
    color: '#1E3A5F',
  },
});

export default SettingsScreen;
