# quran

مستودع لبيانات القرآن: نص الآيات مع تفسير مرفق، وبيئة لإضافة الترجمات وأسباب النزول.

## الملفات الأساسية

- `data/hafs_smart_v8.json` — نص القرآن وحقول الميتاداتا لكل آية.
- `data/tafeser.csv` — ملف التفسير (تحتوي حقل `aya_tafseer` مع HTML/ملاحظات).
- `data/verses_with_tafsir.json` — ناتج ربط الآيات بالتفاسير (مُنشأ بواسطة `scripts/link_tafsir.py`).

## إضافة الترجمات وأسباب النزول (Annotations) 🔧

- ضع ملفات الترجمات في `data/translations/`، لكل لغة ملف JSON بصيغة:

```json
{
  "1": {"1": "In the name of Allah...", "2": "All praise..."},
  "2": {"255": "..."}
}
```

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