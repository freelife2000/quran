#!/usr/bin/env python3
"""Check translation pages for license indicators and update .meta.json files.

Writes results into each meta file under key 'license_scan'. Also produces summary data/translations/license_scan_report.json
"""
from __future__ import annotations
import requests
import json
from pathlib import Path
import re
import time

ROOT = Path(__file__).resolve().parents[1]
TRANS_DIR = ROOT / 'data' / 'translations'
REVIEW = TRANS_DIR / 'license_review_list.json'
OUT_SUMMARY = TRANS_DIR / 'license_scan_report.json'

KEYWORDS = [
    'creative commons', 'cc-by', 'cc by', 'cc-by-nc', 'cc-by-sa', 'public domain',
    'all rights reserved', 'copyright', 'licensed under', 'license', 'free to use', 'open license'
]

URL_TIMEOUT = 15


def scan_text_for_license(text: str):
    lower = text.lower()
    for kw in KEYWORDS:
        if kw in lower:
            # return the first matching line/snippet
            m = re.search(r'.{0,60}'+re.escape(kw)+r'.{0,60}', lower)
            snippet = m.group(0) if m else kw
            return kw, snippet
    return None, None


def try_fetch(url: str):
    r = requests.get(url, timeout=URL_TIMEOUT)
    return r.status_code, r.text


def main():
    if not REVIEW.exists():
        print('License review list not found:', REVIEW)
        return
    items = json.load(open(REVIEW, 'r', encoding='utf-8'))
    summary = []
    for it in items:
        rid = it.get('resource_id')
        slug = it.get('slug')
        filename = it.get('filename')
        candidates = []
        if slug:
            candidates.append(f'https://quran.com/resources/translations/{slug}')
            candidates.append(f'https://quran.com/resources/translations/{slug}/')
        # try fallback to quran.com direct resources path by id
        candidates.append(f'https://quran.com/resources/translations/{rid}')
        # also check a few known places like islamicity or islamhouse? for now just quran.com

        found = None
        checked_urls = []
        for u in candidates:
            try:
                code, text = try_fetch(u)
            except Exception as e:
                checked_urls.append({'url': u, 'status': 'error', 'error': str(e)})
                continue
            checked_urls.append({'url': u, 'status_code': code})
            if code != 200:
                continue
            kw, snippet = scan_text_for_license(text)
            if kw:
                found = {'keyword': kw, 'snippet': snippet, 'url': u}
                break
        # also inspect local meta if present
        meta_path = TRANS_DIR / (filename + '.meta.json') if filename else None
        if meta_path and meta_path.exists():
            meta = json.load(open(meta_path, 'r', encoding='utf-8'))
        else:
            meta = {'resource_id': rid}
        meta['license_scan'] = {'checked_at': int(time.time()), 'found': found, 'checked_urls': checked_urls}
        with open(TRANS_DIR / f'{meta.get("filename") or filename or f"resource_{rid}"}.meta.json', 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        summary.append({'resource_id': rid, 'filename': filename, 'found': bool(found), 'detail': found})
        time.sleep(0.15)
    with open(OUT_SUMMARY, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print('License scan complete. Summary:', OUT_SUMMARY)


if __name__ == '__main__':
    main()
