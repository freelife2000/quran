# ⚡ ابدأ الآن! - Start Now!

## 🎯 3 خطوات فقط لتشغيل التطبيق:

### 1️⃣ افتح Terminal وانتقل للمشروع:
```bash
cd quran/mobile
```

### 2️⃣ شغّل السكريبت التفاعلي:
```bash
chmod +x start.sh
./start.sh
```

### 3️⃣ اختر رقم الخيار:
```
1 = Android ← اختر هذا!
2 = iOS
3 = Web
```

---

## ✨ ماذا يحدث بعد اختيار 1?

- ✅ التطبيق ينطلق مباشرة
- ✅ QR code يظهر في الـ terminal
- ✅ افتح Expo Go في هاتفك
- ✅ امسح الـ QR code
- ✅ **التطبيق يعمل داخل هاتفك!** 📱

---

## 📱 لم تثبت Expo Go بعد؟

### Android:
1. اذهب إلى Google Play Store
2. ابحث عن "Expo Go"
3. ثبّت التطبيق

### iPhone:
1. اذهب إلى App Store
2. ابحث عن "Expo Go"
3. ثبّت التطبيق

---

## ⚠️ ملاحظة مهمة:

**تأكد من أن الخادم يعمل!**

في terminal آخر:
```bash
cd quran
python -m uvicorn app.server:app --host 0.0.0.0 --port 8000
```

---

## 🆘 المشاكل الشائعة:

### "لا يعمل"
```bash
npm install --legacy-peer-deps
npm run android
```

### "الخادم غير متصل"
- تحقق من IP في ملف `.env`
- تأكد من الخادم يعمل

---

## 📚 للمزيد من المعلومات:
- [SUCCESS.md](./SUCCESS.md) - شرح مفصل
- [QUICKSTART.md](./QUICKSTART.md) - بدء سريع
- [DEPLOYMENT.md](./DEPLOYMENT.md) - نشر

---

## 🚀 هيا بنا!

```bash
cd quran/mobile && ./start.sh
```

**واستمتع بالتطبيق!** 🎊✨
