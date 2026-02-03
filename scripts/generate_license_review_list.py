#!/usr/bin/env python3
"""Generate a list of translations needing license review.

Scans data/translations/*.meta.json and outputs data/translations/license_review_list.json
with entries: resource_id, filename, name, author, slug, suggested_check_url
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
TRANS_DIR = ROOT / 'data' / 'translations'
OUT = TRANS_DIR / 'license_review_list.json'

items = []
for p in sorted(TRANS_DIR.glob('*.meta.json')):
    m = json.load(open(p, 'r', encoding='utf-8'))
    if m.get('license') is None:
        info = m.get('resource_info') or {}
        slug = info.get('slug') or m.get('filename')
        name = info.get('name') or info.get('translated_name', {}).get('name') or ''
        author = info.get('author_name') or ''
        check_url = f'https://quran.com/resources/translations/{slug}'
        items.append({
            'resource_id': m.get('resource_id'),
            'filename': m.get('filename'),
            'name': name,
            'author': author,
            'slug': slug,
            'suggested_check_url': check_url,
        })

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f'Wrote {len(items)} entries to {OUT}')
