# تطبيق القرآن الكريم | Quran Application

تطبيق ويب سهل الاستخدام لتصفح آيات القرآن الكريم مع التفاسير والترجمات متعددة اللغات، بالإضافة إلى أوقات الصلاة والأحكام والأذكار الإسلامية.

## الميزات | Features

- 📖 **تصفح القرآن الكريم**: عرض آيات القرآن بالنص الأصلي مع التفاسير
- 🌍 **ترجمات متعددة اللغات**: أكثر من 60 ترجمة لآيات القرآن الكريم
- 🕌 **أوقات الصلاة**: عرض مواقيت الصلوات الخمس (قابل للتطوير مع APIs خارجية)
- 📖 **أحكام وأذكار**: مجموعة من الأحكام الشرعية والأذكار الإسلامية
- 🔍 **واجهة سهلة الاستخدام**: تصميم بسيط وعملي
- 📱 **متوافق مع الأجهزة**: استجابي وسهل الاستخدام على جميع الأجهزة

## البناء والتشغيل | Setup & Installation

### المتطلبات | Requirements

- Python 3.12+
- pip (مدير الحزم)

### التثبيت | Installation

```bash
# استنساخ المشروع
git clone https://github.com/freelife2000/quran.git
cd quran

# إنشاء بيئة افتراضية
python3 -m venv .venv
source .venv/bin/activate  # على Linux/Mac
# أو
.venv\Scripts\activate  # على Windows

# تثبيت المكتبات
pip install -r requirements.txt
```

### التشغيل المحلي | Running Locally

```bash
# تشغيل الخادم بوضع التطوير (مع إعادة التحميل التلقائي)
python -m uvicorn app.server:app --host 127.0.0.1 --port 8000 --reload
```

ثم افتح المتصفح على: `http://127.0.0.1:8000`

## استخدام التطبيق | Usage

### تصفح آية
1. أدخل رقم السورة (1-114)
2. أدخل رقم الآية
3. اختر ترجمة (اختياري)
4. اضغط "عرض الآية"

### عرض أوقات الصلاة
- اضغط زر "أوقات الصلاة" لعرض مواقيت الصلوات الخمس

### عرض الأحكام والأذكار
- اضغط زر "الأحكام والأذكار" لعرض أحكام وأذكار إسلامية

## API Endpoints

- `GET /` - الصفحة الرئيسية
- `GET /api/verse/{sura}/{ayah}?translation={code}` - الحصول على آية محددة
- `GET /api/translations` - قائمة الترجمات المتاحة
- `GET /api/prayer-times` - أوقات الصلاة
- `GET /api/ahkam-adhkar` - الأحكام والأذكار

## هيكل المشروع | Project Structure

```
quran/
├── app/
│   └── server.py              # FastAPI server
├── web/
│   ├── index.html             # الصفحة الرئيسية
│   └── app.js                 # سكربت الواجهة الأمامية
├── data/
│   ├── quran.json             # نص القرآن الكريم
│   ├── verses_with_tafsir.json # مع التفاسير
│   ├── prayer_times.json      # أوقات الصلاة
│   ├── ahkam_adhkar.json      # الأحكام والأذكار
│   ├── translations/          # ملفات الترجمات (135+ ملف)
│   └── translations_validation_report.json
├── scripts/
│   ├── validate_translations.py
│   └── ...
├── requirements.txt           # المكتبات المطلوبة
└── README.md                  # هذا الملف
```

## مصادر البيانات | Data Sources

- **نص القرآن**: من `data/quran.json`
- **التفاسير**: من `data/verses_with_tafsir.json`
- **الترجمات**: 135+ ترجمة في `data/translations/`
- **أوقات الصلاة**: من `data/prayer_times.json`

## التحقق من الترجمات | Validation

```bash
python scripts/validate_translations.py
```

سيُنتج التقارير:
- `data/translations_validation_report.json`
- `data/translations/validation_report.json`

## الترجمات المدعومة | Supported Languages

اللغات المدعومة: العربية، English، Français، Español، Deutsch، Português، Türkçe، اردو، 中文، 日本語، وغيرها.

## الترخيص | License

هذا المشروع مفتوح المصدر.

---

**تم تطويره بكل محبة وإخلاص** ❤️


- ضع أسباب النزول في `data/asbab/` بصيغة JSON:

```json
{
  "2": {"255": [{"text": "سبب...", "source": "..."}]}
}
```

- لدمج الترجمات والأسباب في الملف الرئيسي شغّل:

```bash
python3 scripts/add_annotations.py --translations data/translations/en_example.json --lang en
python3 scripts/add_annotations.py --asbab data/asbab/template_asbab.json
```

الإخراج سيذهب إلى `data/verses_with_annotations.json`.

## أدوات

- `scripts/link_tafsir.py` — رابط آلي بين `hafs_smart_v8.json` و`tafeser.csv`، ويُهيّئ حقول `translations` و `asbab` لكل آية.
- `scripts/add_annotations.py` — يضيف الترجمات وأسباب النزول (يدعم JSON و CSV).

---

(تم تهيئة المستودع للحفظ وإضافة الترجمات وأسباب النزول لاحقًا بدون أخطاء.)