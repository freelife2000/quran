#!/usr/bin/env python3
"""Validate translation JSON files in data/translations.

Checks:
 - file contains 114 suras
 - total ayas == 6236
 - for each sura, number of ayas matches reference from data/quran.json

Writes report to data/translations/validation_report.json
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QURAN_JSON = ROOT / 'data' / 'quran.json'
TRANS_DIR = ROOT / 'data' / 'translations'


def load_reference():
    with open(QURAN_JSON, 'r', encoding='utf-8') as f:
        verses = json.load(f)
    # build map sura -> list of ayas
    ref = {}
    for v in verses:
        s = str(v['sura_no'])
        ref.setdefault(s, []).append(v['aya_no'])
    return ref


def validate_one(path: Path, ref):
    data = json.load(path.open(encoding='utf-8'))
    result = {'file': str(path.name), 'ok': True, 'issues': []}
    # two supported formats: per-sura dict OR a list (raw translations array)
    if isinstance(data, dict):
        # per-sura map
        if len(data.keys()) != 114:
            result['ok'] = False
            result['issues'].append(f'Sura count {len(data.keys())} != 114')
        total_ayas = sum(len(ayas) for ayas in data.values())
        if total_ayas != 6236:
            result['ok'] = False
            result['issues'].append(f'Total ayas {total_ayas} != 6236')
        # per sura counts
        for s, ayas in ref.items():
            if s not in data:
                result['ok'] = False
                result['issues'].append(f'Missing sura {s}')
                continue
            c = len(data[s].keys())
            expected = len(ayas)
            if c != expected:
                result['ok'] = False
                result['issues'].append(f'Sura {s} ayas {c} != expected {expected}')
    elif isinstance(data, list):
        # raw translations array
        if len(data) != 6236:
            result['ok'] = False
            result['issues'].append(f'Raw translations length {len(data)} != 6236')
    else:
        result['ok'] = False
        result['issues'].append('Unexpected JSON format')
    return result


def main():
    ref = load_reference()
    results = []
    for p in sorted(TRANS_DIR.glob('*.json')):
        if p.name.endswith('.meta.json') or p.name == 'quran_com_translations_index.json' or p.name == 'fetch_errors.json' or p.name == 'en_example.json':
            continue
        res = validate_one(p, ref)
        results.append(res)

    out = TRANS_DIR / 'validation_report.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # print summary
    ok = sum(1 for r in results if r['ok'])
    bad = len(results) - ok
    print(f'Validated {len(results)} files: {ok} ok, {bad} with issues. Report: {out}')


if __name__ == '__main__':
    main()
