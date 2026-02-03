#!/usr/bin/env python3
"""Fetch all translations listed in quran.com index and write JSON files.

Skips files that already exist unless --force is passed. Writes fetch_errors.json for issues.
"""
from __future__ import annotations
import time
import json
from pathlib import Path
import requests
import argparse

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'data' / 'translations'
INDEX_PATH = OUT_DIR / 'quran_com_translations_index.json'
ERR_PATH = OUT_DIR / 'fetch_errors.json'

OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_index():
    if not INDEX_PATH.exists():
        r = requests.get('https://api.quran.com/api/v4/resources/translations', timeout=30)
        r.raise_for_status()
        idx = r.json().get('translations', [])
        with open(INDEX_PATH, 'w', encoding='utf-8') as f:
            json.dump(idx, f, ensure_ascii=False, indent=2)
        return idx
    else:
        return json.load(open(INDEX_PATH, 'r', encoding='utf-8'))


def fetch_translation(resource_id: int):
    url = f'https://api.quran.com/api/v4/quran/translations/{resource_id}'
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.json()


def main(argv):
    p = argparse.ArgumentParser()
    p.add_argument('--force', action='store_true', help='Refetch even if file exists')
    p.add_argument('--delay', type=float, default=0.3, help='Delay between requests')
    args = p.parse_args(argv)

    idx = load_index()
    ids = [int(item['id']) for item in idx]

    errors = []
    for rid in ids:
        try:
            # determine filename via lookup
            item = next((it for it in idx if int(it['id'])==rid), None)
            slug = (item.get('slug') or f'resource_{rid}').replace('/', '_')
            filename = f"{slug}.json"
            path = OUT_DIR / filename
            if path.exists() and not args.force:
                print(f'Skipping existing: {filename}')
                continue
            print(f'Fetching {rid} -> {filename}...')
            obj = fetch_translation(rid)
            texts = [t.get('text','').strip() for t in obj.get('translations', [])]
            # write mapping using quran.json reference
            # reuse existing helper from other script? simple write per resource for now
            # save raw translations array and metadata
            with open(OUT_DIR / f'resource_{rid}.raw.json', 'w', encoding='utf-8') as f:
                json.dump(obj, f, ensure_ascii=False, indent=2)
            # write simplified mapping if lengths match quran.json
            # load reference verses directly from data/quran.json to avoid import issues
            ref_path = ROOT / 'data' / 'quran.json'
            with open(ref_path, 'r', encoding='utf-8') as f:
                verses = json.load(f)
            if len(texts) != len(verses):
                raise RuntimeError(f'Verse count mismatch: translation has {len(texts)} items, quran.json has {len(verses)}')
            out = {}
            for v, t in zip(verses, texts):
                s = str(v['sura_no']); a = str(v['aya_no'])
                out.setdefault(s, {})[a] = t
            with open(OUT_DIR / filename, 'w', encoding='utf-8') as f:
                json.dump(out, f, ensure_ascii=False, indent=2)
            meta = {'resource_id': rid, 'fetched_at': int(time.time()), 'resource_info': item, 'source': 'quran.com API'}
            with open(OUT_DIR / f'{slug}.meta.json', 'w', encoding='utf-8') as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
            print(f'  Saved {filename}')
        except Exception as e:
            print(f'  ERROR fetching {rid}: {e}')
            errors.append({'resource_id': rid, 'error': str(e)})
        time.sleep(args.delay)

    if errors:
        if ERR_PATH.exists():
            arr = json.load(open(ERR_PATH, 'r', encoding='utf-8'))
        else:
            arr = []
        arr.extend(errors)
        with open(ERR_PATH, 'w', encoding='utf-8') as f:
            json.dump(arr, f, ensure_ascii=False, indent=2)
        print(f'Wrote {len(errors)} errors to {ERR_PATH}')
    else:
        print('All fetched with no new errors')


if __name__ == '__main__':
    import sys
    main(sys.argv[1:])
