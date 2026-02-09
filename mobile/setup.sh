#!/usr/bin/env bash

# Complete Setup and Development Guide for Quran App
# دليل الإعداد الكامل لتطبيق القرآن

echo "======================================"
echo "🎯 تطبيق القرآن - دليل الإعداد الكامل"
echo "======================================"

# Step 1: Check Node.js version
echo ""
echo "1️⃣ فحص Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت!"
    echo "تثبيت من: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION مثبت"

# Step 2: Install global CLI tools
echo ""
echo "2️⃣ تثبيت أدوات موثوقة..."
npm install -g expo-cli eas-cli

# Step 3: Create mobile directory if not exists
echo ""
echo "3️⃣ التحقق من مجلد التطبيق..."
if [ ! -d "mobile" ]; then
    echo "❌ مجلد mobile غير موجود!"
    echo "تأكد من وجودك في المجلد الصحيح"
    exit 1
fi

echo "✅ مجلد mobile موجود"

# Step 4: Install dependencies
echo ""
echo "4️⃣ تثبيت المكتبات..."
cd mobile

if [ -d "node_modules" ]; then
    echo "📦 المكتبات موجودة بالفعل"
else
    npm install
fi

echo "✅ المكتبات مثبتة"

# Step 5: Check for .env file
echo ""
echo "5️⃣ التحقق من ملف الإعدادات..."
if [ ! -f ".env" ]; then
    echo "⚠️ ملف .env غير موجود. سيتم إنشاء نسخة افتراضية..."
    cat > .env << EOF
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_API_TIMEOUT=10000
EOF
    echo "✅ تم إنشاء .env"
else
    echo "✅ .env موجود"
fi

# Step 6: Provide next steps
echo ""
echo "======================================"
echo "🎉 اكتمل الإعداد! الخطوات التالية:"
echo "======================================"
echo ""
echo "📱 لتشغيل التطبيق:"
echo "   npm run android      (Android)"
echo "   npm run ios          (iOS)"
echo "   npm run web          (الويب)"
echo ""
echo "📤 للنشر على متجر بلاي:"
echo "   bash build-and-publish.sh"
echo ""
echo "📚 للمزيد من المعلومات:"
echo "   - اقرأ QUICKSTART.md"
echo "   - اقرأ DEPLOYMENT.md"
echo "   - اقرأ README.md"
echo ""
echo "⚙️ ملاحظة مهمة:"
echo "   تأكد من أن خادم FastAPI يعمل:"
echo "   cd .. && python -m uvicorn app.server:app --host 0.0.0.0 --port 8000"
echo ""
echo "======================================"
