#!/usr/bin/env python3
"""Link verses in `data/hafs_smart_v8.json` with tafsir from `data/tafeser.csv`.
Outputs:
 - data/verses_with_tafsir.json (same structure as original but each verse gains `aya_tafseer` if found)
 - data/missing_tafsir.csv (list of verses with no tafsir found)
"""
import json
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_IN = ROOT / 'data' / 'hafs_smart_v8.json'
CSV_IN = ROOT / 'data' / 'tafeser.csv'
JSON_OUT = ROOT / 'data' / 'verses_with_tafsir.json'
MISSING_OUT = ROOT / 'data' / 'missing_tafsir.csv'


def load_tafseer(csv_path):
    tafs = {}
    with csv_path.open(newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                s = int(row.get('sura_no') or row.get('sura') or 0)
                a = int(row.get('aya_no') or row.get('aya') or 0)
            except Exception:
                continue
            key = (s, a)
            taf = row.get('aya_tafseer') or row.get('tafsir') or ''
            if taf:
                tafs.setdefault(key, []).append(taf.strip())
    return tafs


def main():
    tafs = load_tafseer(CSV_IN)
    verses = json.loads(JSON_IN.read_text(encoding='utf-8'))

    matched = 0
    missing = []

    for v in verses:
        key = (int(v.get('sura_no', 0)), int(v.get('aya_no', 0)))
        # ensure placeholders for translations and reasons of revelation (asbab)
        if 'translations' not in v:
            v['translations'] = {}
        if 'asbab' not in v:
            v['asbab'] = []

        if key in tafs:
            v['aya_tafseer'] = '\n\n'.join(tafs[key])
            matched += 1
        else:
            v['aya_tafseer'] = None
            missing.append({'sura_no': key[0], 'aya_no': key[1], 'sura_name_ar': v.get('sura_name_ar'), 'aya_text_emlaey': v.get('aya_text_emlaey')})

    JSON_OUT.write_text(json.dumps(verses, ensure_ascii=False, indent=2), encoding='utf-8')

    # write missing list for inspection
    with MISSING_OUT.open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['sura_no', 'aya_no', 'sura_name_ar', 'aya_text_emlaey'])
        writer.writeheader()
        for m in missing:
            writer.writerow(m)

    print(f"Total verses: {len(verses)}")
    print(f"Matched verses with tafsir: {matched}")
    print(f"Missing tafsir for: {len(missing)} verses (see {MISSING_OUT})")


if __name__ == '__main__':
    main()
