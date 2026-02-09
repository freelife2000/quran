#!/usr/bin/env bash

# Quran App Build and Publish Script
# سكريبت بناء ونشر تطبيق القرآن

set -e

echo "======================================"
echo "🚀 تطبيق القرآن - سكريبت البناء والنشر"
echo "======================================"

# Check dependencies
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI غير مثبت. تثبيت الآن..."
    npm install -g eas-cli
fi

if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI غير مثبت. تثبيت الآن..."
    npm install -g expo-cli
fi

# Install dependencies
echo "📦 تثبيت المكتبات..."
cd mobile && npm install && cd ..

# Login to Expo
echo "🔐 تسجيل الدخول إلى Expo..."
eas login

# Navigate to mobile directory
cd mobile

# Build for Android
echo "🔨 بناء التطبيق لـ Android..."
eas build --platform android

# Ask if user wants to submit
read -p "هل تريد إرسال التطبيق لـ متجر بلاي الآن؟ (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 جاري الإرسال إلى Google Play..."
    eas submit --platform android
    echo "✅ تم الإرسال بنجاح!"
else
    echo "⚠️ للإرسال لاحقاً، استخدم: eas submit --platform android"
fi

echo ""
echo "======================================"
echo "✨ تم! للمزيد، اقرأ DEPLOYMENT.md"
echo "======================================"
