/**
 * Quran App - Main Entry Point
 * تطبيق القرآن الكريم - نقطة الدخول الرئيسية
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import QuranReader from './src/screens/QuranReader';
import TranslationsScreen from './src/screens/TranslationsScreen';
import TafsirScreen from './src/screens/TafsirScreen';
import PrayerTimesScreen from './src/screens/PrayerTimesScreen';
import AdhkarScreen from './src/screens/AdhkarScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

const QuranStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#1E3A5F',
        headerTitleStyle: {
          fontFamily: 'amiri-regular',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="QuranHome"
        component={HomeScreen}
        options={{ title: 'القرآن الكريم' }}
      />
      <Stack.Screen
        name="QuranReader"
        component={QuranReader}
        options={({ route }: any) => ({
          title: route.params?.suraName ? `سورة ${route.params.suraName}` : 'القرآن الكريم',
        })}
      />
      <Stack.Screen
        name="Translations"
        component={TranslationsScreen}
        options={{ title: 'الترجمات' }}
      />
      <Stack.Screen
        name="Tafsir"
        component={TafsirScreen}
        options={{ title: 'التفسير' }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: any = 'home';

          if (route.name === 'QuranTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Prayers') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Adhkar') {
            iconName = focused ? 'hand-left' : 'hand-left-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: '#999',
        tabBarLabel: ({ focused }: any) => {
          const labels: any = {
            QuranTab: 'القرآن',
            Prayers: 'الصلاة',
            Adhkar: 'الأذكار',
            Settings: 'الإعدادات',
          };
          return focused ? labels[route.name] : '';
        },
      })}
    >
      <Tab.Screen name="QuranTab" component={QuranStack} />
      <Tab.Screen name="Prayers" component={PrayerTimesScreen} />
      <Tab.Screen name="Adhkar" component={AdhkarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync({
          'amiri-regular': require('./assets/fonts/Amiri-Regular.ttf'),
          'amiri-bold': require('./assets/fonts/Amiri-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
