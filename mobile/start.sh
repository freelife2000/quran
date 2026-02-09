#!/bin/bash

# 🎯 Quran App - Complete Setup & Run Script
# تطبيق القرآن - سكريبت الإعداد والتشغيل الكامل

set -e

clear

echo "═══════════════════════════════════════════════════════════"
echo "  🕌 تطبيق القرآن الكريم - Quran App"
echo "  React Native Mobile Application"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ خطأ: يجب أن تكون في مجلد mobile"
    echo "❌ Error: You must be in mobile folder"
    echo ""
    echo "الحل / Solution:"
    echo "cd mobile"
    exit 1
fi

echo "✅ المجلد صحيح / Correct folder"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ المكتبات مثبتة / Libraries installed"
else
    echo "📦 جاري تثبيت المكتبات / Installing libraries..."
    npm install --legacy-peer-deps
    echo "✅ تم التثبيت / Installation complete"
fi

echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️ ملف .env غير موجود / .env file missing"
    echo "إنشاء ملف افتراضي / Creating default file..."
    cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_API_TIMEOUT=10000
EOF
    echo "✅ تم الإنشاء / Created"
else
    echo "✅ ملف .env موجود / .env file exists"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🎯 اختر خياراً / Choose an option:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  تشغيل على Android"
echo "2️⃣  تشغيل على iOS"
echo "3️⃣  تشغيل على الويب (Web)"
echo "4️⃣  بناء لمتجر بلاي (Build for Android)"
echo "5️⃣  إرسال لمتجر بلاي (Submit to Play Store)"
echo "0️⃣  خروج (Exit)"
echo ""

read -p "اختر رقماً / Enter number (0-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 جاري بدء التطبيق على Android / Starting Android..."
        echo ""
        npm run android
        ;;
    2)
        echo ""
        echo "🚀 جاري بدء التطبيق على iOS / Starting iOS..."
        echo ""
        npm run ios
        ;;
    3)
        echo ""
        echo "🚀 جاري بدء التطبيق على الويب / Starting Web..."
        echo ""
        npm run web
        ;;
    4)
        echo ""
        echo "🔨 جاري بناء التطبيق / Building app..."
        echo ""
        eas build --platform android
        ;;
    5)
        echo ""
        echo "📤 جاري إرسال التطبيق / Submitting app..."
        echo ""
        eas submit --platform android
        ;;
    0)
        echo ""
        echo "👋 إلى اللقاء / Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ اختيار غير صحيح / Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✨ تم بنجاح / Success!"
echo "═══════════════════════════════════════════════════════════"
