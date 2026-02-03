#!/usr/bin/env python3
"""Fetch translations from quran.com API and write per-translation JSON files.

Usage:
  python3 scripts/fetch_quran_com_translations.py --ids 20,19,22

This script does NOT modify `data/verses_with_tafsir.json` unless --apply is passed and
only after a manual license-review (default: no apply).
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
import time

import requests

ROOT = Path(__file__).resolve().parents[1]
QURAN_JSON = ROOT / 'data' / 'quran.json'
OUT_DIR = ROOT / 'data' / 'translations'

OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_quran_verses():
    with open(QURAN_JSON, 'r', encoding='utf-8') as f:
        verses = json.load(f)
    return verses


def fetch_translation(resource_id: int):
    url = f'https://api.quran.com/api/v4/quran/translations/{resource_id}'
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    obj = r.json()
    if 'translations' not in obj:
        raise RuntimeError('Unexpected response (missing translations)')
    texts = [t.get('text', '').strip() for t in obj['translations']]
    return texts, obj


def lookup_resource_info(resource_id: int):
    idx_path = OUT_DIR / 'quran_com_translations_index.json'
    if not idx_path.exists():
        # try to fetch and save the index
        r = requests.get('https://api.quran.com/api/v4/resources/translations', timeout=30)
        r.raise_for_status()
        idx = r.json().get('translations', [])
        with open(idx_path, 'w', encoding='utf-8') as f:
            json.dump(idx, f, ensure_ascii=False, indent=2)
    else:
        with open(idx_path, 'r', encoding='utf-8') as f:
            idx = json.load(f)

    for item in idx:
        if int(item.get('id')) == int(resource_id):
            return item
    return None


def sanitize_slug(item, resource_id):
    if not item:
        return f'resource_{resource_id}'
    slug = item.get('slug') or ''
    if slug:
        # sanitize to safe filename
        return slug.replace('/', '_')
    # fallback to name-based slug
    name = item.get('name') or f'resource_{resource_id}'
    safe = ''.join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in name).strip().replace(' ', '_')
    return safe


def write_translation_file(slug, resource_id, texts, meta, resource_info=None):
    # Build mapping by sura -> aya
    verses = load_quran_verses()
    if len(texts) != len(verses):
        raise RuntimeError(f'Verse count mismatch: translation has {len(texts)} items, quran.json has {len(verses)}')

    out = {}
    for v, t in zip(verses, texts):
        s = str(v['sura_no'])
        a = str(v['aya_no'])
        out.setdefault(s, {})[a] = t

    filename = f'{slug or resource_id}'
    out_path = OUT_DIR / f'{filename}.json'
    meta_path = OUT_DIR / f'{filename}.meta.json'

    # Build better metadata
    metadata = {
        'resource_id': resource_id,
        'filename': filename,
        'source': 'quran.com API',
        'fetched_at': int(time.time()),
        'resource_info': resource_info or {},
        'license': None,  # to be filled after manual review
    }
    # attach raw meta under raw_metadata
    metadata['raw_metadata'] = meta.get('raw_metadata') if isinstance(meta, dict) else meta

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    return out_path, meta_path


def main(argv):
    p = argparse.ArgumentParser()
    p.add_argument('--ids', help='Comma-separated resource ids to fetch')
    p.add_argument('--all', action='store_true', help='Fetch all translations from quran.com index (may be many)')
    p.add_argument('--limit', type=int, default=None, help='If --all, limit the number of resources to fetch')
    p.add_argument('--delay', type=float, default=0.5, help='Delay between requests (seconds)')
    args = p.parse_args(argv)

    ids = []
    if args.all:
        # load index and pull all ids
        idx_path = OUT_DIR / 'quran_com_translations_index.json'
        if not idx_path.exists():
            r = requests.get('https://api.quran.com/api/v4/resources/translations', timeout=30)
            r.raise_for_status()
            idx = r.json().get('translations', [])
            with open(idx_path, 'w', encoding='utf-8') as f:
                json.dump(idx, f, ensure_ascii=False, indent=2)
        else:
            with open(idx_path, 'r', encoding='utf-8') as f:
                idx = json.load(f)
        ids = [int(item.get('id')) for item in idx]
        if args.limit:
            ids = ids[:args.limit]
    elif args.ids:
        ids = [int(x.strip()) for x in args.ids.split(',') if x.strip()]
    else:
        p.error('Either --ids or --all must be specified')

    # Basic fetch
    for rid in ids:
        print(f'Fetching resource {rid}...')
        try:
            texts, raw = fetch_translation(rid)
        except Exception as e:
            print(f'  [ERROR] fetch failed for {rid}: {e}')
            continue

        # Try to form metadata and discover resource info from index
        resource_info = lookup_resource_info(rid)
        slug = sanitize_slug(resource_info, rid)
        meta = {
            'resource_id': rid,
            'source': 'quran.com API',
            'fetched_at': int(time.time()),
            'raw_metadata': raw,
            'resource_info': resource_info or {}
        }

        try:
            out_path, meta_path = write_translation_file(slug, rid, texts, meta, resource_info=resource_info)
            print(f'  Saved JSON: {out_path} (meta: {meta_path})')
        except Exception as e:
            # record the error for later manual inspection
            err_path = OUT_DIR / 'fetch_errors.json'
            err = {'resource_id': rid, 'slug': slug, 'error': str(e)}
            if err_path.exists():
                with open(err_path, 'r', encoding='utf-8') as f:
                    arr = json.load(f)
            else:
                arr = []
            arr.append(err)
            with open(err_path, 'w', encoding='utf-8') as f:
                json.dump(arr, f, ensure_ascii=False, indent=2)
            print(f'  [SKIPPED] resource {rid} saved error entry to {err_path}: {e}')
        time.sleep(args.delay)


if __name__ == '__main__':
    main(sys.argv[1:])
