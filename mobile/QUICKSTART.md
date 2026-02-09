# البدء السريع - Quick Start

## 1️⃣ التثبيت الأول (One-Time Setup)

```bash
# انتقل إلى مجلد التطبيق المحمول
cd mobile

# ثبّت المكتبات
npm install

# سجل الدخول إلى Expo (لأول مرة فقط)
eas login
```

## 2️⃣ تشغيل التطبيق على جهازك

### الخيار 1️⃣: على هاتفك الحقيقي 📱
```bash
# اختر النظام:
npm run android    # لأجهزة Android
npm run ios        # لأجهزة Apple

# سيظهر QR code - امسحه بالهاتف من تطبيق Expo Go
```

### الخيار 2️⃣: على محاكي (Emulator)
```bash
npm run android
# أو
npm run ios
```

### الخيار 3️⃣: على الويب (للاختبار السريع)
```bash
npm run web
```

## 3️⃣ قبل النشر على متجر بلاي

### تحديث معلومات التطبيق:

**ملف** `mobile/app.json`:
```json
{
  "name": "Quran App",
  "version": "1.0.0",
  "android": {
    "versionCode": 1,
    "package": "com.freelice2000.quranapp"
  }
}
```

### إضافة أيقونات وصور:
```bash
# ضع هذه الملفات في mobilehassets/
- icon.png (512x512) - أيقونة التطبيق
- splash.png (1080x1920) - صورة البداية
- feature-icon.png (1024x500) - صورة الميزة
```

## 4️⃣ بناء وإرسال إلى متجر بلاي 🚀

### بناء APK للاختبار المحلي:
```bash
eas build --platform android --local
```

### بناء AAB للمتجر الرسمي:
```bash
eas build --platform android
```

### إرسال إلى Google Play Store:
```bash
# بعد البناء الناجح
eas submit --platform android

# سيطلب منك:
# 1. اختيار الملف المُرسل
# 2. بيانات Google Play Console
```

## 5️⃣ اختبار سريع للتطبيق ✅

```bash
# تشغيل النسخة الكاملة على محاكي
npm run android

# قم باختبار:
- ✅ عرض السور والآيات
- ✅ الترجمات تعمل
- ✅ البحث يعمل
- ✅ الأرقام واضحة
- ✅ الضغط على الآية يفتح التفسير
- ✅ إضافة المفضلة تعمل
```

## 6️⃣ الأسئلة الشائعة

**س: هل أحتاج تثبيت Android Studio؟**
ج: نعم، لـ محاكي جيد. أو استخدم هاتفك الحقيقي

**س: الخادم غير متاح؟**
ج: تأكد من:
```bash
cd ..
python -m uvicorn app.server:app --host 0.0.0.0 --port 8000
```

**س: كيف أرفع على متجر بلاي؟**
ج: اتبع [DEPLOYMENT.md](./DEPLOYMENT.md) الكامل

**س: هل يمكن تعديل الألوان؟**
ج: نعم، في `src/constants.ts` تحت `THEMES`

## 7️⃣ الملفات المهمة 📁

| الملف | الوصف |
|------|-------|
| `package.json` | المكتبات والسكريبتات |
| `app.json` | إعدادات التطبيق |
| `App.tsx` | نقطة البداية الرئيسية |
| `src/screens/` | شاشات التطبيق |
| `src/services/api.ts` | الاتصال بالخادم |
| `DEPLOYMENT.md` | دليل النشر الكامل |

## 8️⃣ دعم سريع 💬

- مشاكل Expo? https://forums.expo.dev
- مشاكل React Native? https://reactnative.dev
- مشاكل Google Play? https://support.google.com/googleplay

---

**استعد الآن! 🎯** نشرة تطبيقك الأول على متجر بلاي قريباً!
