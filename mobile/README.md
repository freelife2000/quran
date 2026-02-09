# Quran App - React Native Mobile Application

تطبيق القرآن الكريم - تطبيق محمول حديث مع React Native

## الميزات | Features

✅ **قراءة القرآن الكريم** - عرض آيات القرآن بشكل واضح وجميل
✅ **ترجمات متعددة اللغات** - أكثر من 60 ترجمة متاحة
✅ **التفاسير** - شرح الآيات مع التفسيرات الإسلامية
✅ **أوقات الصلاة** - عرض مواقيت الصلوات حسب الموقع الجغرافي
✅ **الأذكار** - أذكار الصباح والمساء والنوم والعامة
✅ **المرجعيات والملاحظات** - حفظ الآيات المفضلة
✅ **سجل القراءة** - تتبع ما قرأته مؤخراً
✅ **واجهة جميلة وسهلة الاستخدام** - تصميم عصري وملائم

## المتطلبات | Requirements

- Node.js 18+
- npm أو yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (لتطوير Android)
- Xcode (لتطوير iOS على Mac)

## التثبيت والتشغيل | Installation & Running

### 1. التثبيت الأولي
```bash
cd mobile
npm install
# أو
yarn install
```

### 2. تشغيل التطبيق في وضع التطوير
```bash
# تشغيل على Android
npm run android

# أو تشغيل على iOS (Mac فقط)
npm run ios

# أو تشغيل على الويب
npm run web
```

### 3. تشغيل على جهازك الشخصي

#### على Android:
- قم بتثبيت تطبيق Expo Go من Google Play Store
- قم بمسح QR code الذي سيظهر في الـ terminal

#### على iOS:
- قم بتثبيت تطبيق Expo Go من App Store
- قم بمسح QR code

### 4. بناء وتطوير التطبيق

#### استخدام Expo EAS (الموصوفة)
```bash
# تسجيل الدخول إلى Expo
eas login

# بناء لـ Android APK
eas build --platform android

# بناء لـ iOS
eas build --platform ios
```

#### بناء محلي
```bash
# للبناء المحلي، استخدم:
npm run eject
# ثم اتبع التعليمات في Android Studio أو Xcode
```

## إعدادات البيئة | Environment Setup

أنشئ ملف `.env` في مجلد `mobile`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_API_TIMEOUT=10000
```

استبدل IP address بعنوان الخادم الخاص بك.

## بنية المشروع | Project Structure

```
mobile/
├── src/
│   ├── screens/           # شاشات التطبيق
│   │   ├── HomeScreen.tsx
│   │   ├── QuranReader.tsx
│   │   ├── TranslationsScreen.tsx
│   │   ├── TafsirScreen.tsx
│   │   ├── PrayerTimesScreen.tsx
│   │   ├── AdhkarScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # خدمات API والواجهات
│   │   └── api.ts
│   ├── store/             # إدارة الحالة (Zustand)
│   │   └── appStore.ts
│   ├── types/             # أنواع TypeScript
│   │   └── index.ts
│   └── constants.ts       # الثوابت والإعدادات
├── assets/               # الصور والخطوط
│   └── fonts/
├── App.tsx              # النقطة الرئيسية للتطبيق
├── app.json            # إعدادات Expo
├── package.json        # المكتبات والمشاريع
└── tsconfig.json      # إعدادات TypeScript
```

## متطلبات الخادم | Server Requirements

يحتاج التطبيق إلى خادم FastAPI قيد التشغيل على العنوان المحدد في `.env`

المسارات المطلوبة:
- `GET /surahs` - قائمة السور
- `GET /surahs/{surah_number}` - آيات سورة
- `GET /verses/{surah}/{ayah}/tafsir` - تفسير آية
- `GET /translations` - قائمة الترجمات
- `GET /translations/{translation_id}/surah/{surah}` - ترجمة سورة
- `GET /prayer-times` - أوقات الصلاة
- `GET /adhkar` - الأذكار
- `GET /search` - البحث في القرآن

## النشر على متجر بلاي | Publish to Google Play Store

### الخطوات:

1. **إنشاء حساب Google Play**
   - اذهب إلى https://play.google.com/console
   - دفع رسوم التسجيل ($25)

2. **إنشاء التطبيق**
   ```bash
   eas build --platform android --release
   ```

3. **إعداد توقيع التطبيق (Signing)**
   - Expo سيساعدك تلقائياً في هذا

4. **رفع ملف AAB**
   - بعد البناء، سيكون لديك ملف `.aab`
   - ارفعه في Play Console

5. **تعبئة متطلبات المتجر**
   - أيقونة التطبيق (512x512)
   - لقطات الشاشة (4-8)
   - الوصف والميزات
   - سياسة الخصوصية

6. **الإطلاق**
   - اضغط على "Publish" في Play Console
   - قد يستغرق 2-4 ساعات للظهور

## استكشاف الأخطاء وإصلاحها | Troubleshooting

### مشكلة: الخادم غير متاح
```bash
# تأكد من تشغيل الخادم
cd ..
python -m uvicorn app.server:app --host 0.0.0.0 --port 8000
```

### مشكلة: CORS بين الجوال والخادم
- تأكد من أن CORS مفعل في FastAPI
- تحقق من عنوان IP الصحيح في `.env`

### مشكلة: الخطوط لا تظهر
```bash
# أعد بناء المشروع
expo prebuild --clean
```

## رابط توثيق Expo
https://docs.expo.dev

## ترخيص | License

هذا المشروع مرخص تحت MIT License

## المساهمة | Contributing

نرحب بمساهماتك! يرجى:
1. Fork المشروع
2. إنشاء فرع جديد لميزتك
3. Commit التغييرات
4. Push إلى الفرع
5. فتح Pull Request
