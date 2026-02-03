#!/usr/bin/env python3
"""For resources with verse count mismatches, report per-sura counts to help debugging."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANS_DIR = ROOT / 'data' / 'translations'
ERR_PATH = TRANS_DIR / 'fetch_errors.json'
QURAN = ROOT / 'data' / 'quran.json'


def load_ref():
    v = json.load(open(QURAN, 'r', encoding='utf-8'))
    ref = {}
    for item in v:
        ref.setdefault(str(item['sura_no']), []).append(item['aya_no'])
    return ref


def analyze():
    if not ERR_PATH.exists():
        print('No fetch errors file.')
        return
    errs = json.load(open(ERR_PATH, 'r', encoding='utf-8'))
    ref = load_ref()
    out = []
    for e in errs:
        rid = e.get('resource_id')
        rawp = TRANS_DIR / f'resource_{rid}.raw.json'
        if not rawp.exists():
            out.append({'resource_id': rid, 'error': 'raw json missing'})
            continue
        raw = json.load(open(rawp, 'r', encoding='utf-8'))
        trans = raw.get('translations', [])
        # build per-sura counts assuming contiguous order of translations corresponds to verses
        # we need to map index -> sura/aya by referring to quran.json order
        qverses = json.load(open(QURAN, 'r', encoding='utf-8'))
        trans_len = len(trans)
        q_len = len(qverses)
        per_sura_counts = {}
        for idx, tv in enumerate(trans):
            # map idx to sura via qverses
            if idx < len(qverses):
                s = str(qverses[idx]['sura_no'])
                per_sura_counts.setdefault(s, 0)
                per_sura_counts[s] += 1
            else:
                per_sura_counts.setdefault('extra', 0)
                per_sura_counts['extra'] += 1
        # compare to reference
        diffs = []
        for s, expected in ref.items():
            got = per_sura_counts.get(s, 0)
            if got != len(expected):
                diffs.append({'sura': s, 'expected': len(expected), 'got': got})
        out.append({'resource_id': rid, 'trans_len': trans_len, 'expected_total': q_len, 'diffs': diffs[:10]})
    print(json.dumps(out, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    analyze()
