#!/usr/bin/env python3
"""Validate translation JSON files in data/translations.

This script runs two checks and emits two reports:
- `data/translations_validation_report.json`: structural checks (parseable, numeric keys, basic shape)
- `data/translations/validation_report.json`: reference checks (114 suras, total 6236 ayas, per-sura counts)

Exits with code 1 if any of the checks detect errors, otherwise 0.
"""
from __future__ import annotations
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
TDIR = ROOT / 'data' / 'translations'
OUT = ROOT / 'data' / 'translations_validation_report.json'
QURAN_JSON = ROOT / 'data' / 'quran.json'
TRANS_DIR = TDIR


def inspect_file(fp: Path):
    rec = {'file': fp.name, 'ok': False, 'errors': [], 'warnings': []}
    try:
        data = json.loads(fp.read_text(encoding='utf-8'))
    except Exception as e:
        rec['errors'].append(f'parse_error: {e!r}')
        return rec

    if not isinstance(data, dict):
        rec['errors'].append('top-level-not-dict')
        return rec

    keys = list(data.keys())
    if not keys:
        rec['warnings'].append('empty-file')
        rec['ok'] = True
        return rec

    # check sample top-level keys are numeric-strings
    sample = keys[:10]
    nonnum = [k for k in sample if not (isinstance(k, str) and k.isdigit())]
    if nonnum:
        rec['errors'].append(f'top-level keys not numeric-strings (sample: {nonnum})')
        return rec

    # check structure per surah
    for s in keys:
        val = data[s]
        if not isinstance(val, dict):
            rec['errors'].append(f'surah {s} value not dict (type={type(val).__name__})')
            continue
        # check ayah keys
        subkeys = list(val.keys())
        if not subkeys:
            rec['warnings'].append(f'surah {s} empty')
            continue
        nonnum2 = [sk for sk in subkeys[:10] if not (isinstance(sk, str) and sk.isdigit())]
        if nonnum2:
            rec['errors'].append(f'surah {s} has non-numeric ayah keys (sample: {nonnum2})')
        # check value types
        for ak in subkeys:
            v = val[ak]
            if not (isinstance(v, str) or isinstance(v, (dict, list))):
                rec['warnings'].append(f'surah {s} ayah {ak} has unexpected type {type(v).__name__}')

    rec['ok'] = len(rec['errors']) == 0
    return rec


def load_reference():
    with open(QURAN_JSON, 'r', encoding='utf-8') as f:
        verses = json.load(f)
    ref = {}
    for v in verses:
        s = str(v['sura_no'])
        ref.setdefault(s, []).append(v['aya_no'])
    return ref


def validate_one(path: Path, ref):
    data = json.load(path.open(encoding='utf-8'))
    result = {'file': str(path.name), 'ok': True, 'issues': []}
    if isinstance(data, dict):
        if len(data.keys()) != 114:
            result['ok'] = False
            result['issues'].append(f'Sura count {len(data.keys())} != 114')
        def _count_entries(x):
            if isinstance(x, dict):
                return len(x)
            if isinstance(x, list):
                return len(x)
            return 1
        total_ayas = sum(_count_entries(ayas) for ayas in data.values())
        if total_ayas != 6236:
            result['ok'] = False
            result['issues'].append(f'Total ayas {total_ayas} != 6236')
        for s, ayas in ref.items():
            if s not in data:
                result['ok'] = False
                result['issues'].append(f'Missing sura {s}')
                continue
            val = data[s]
            if isinstance(val, dict):
                c = len(val.keys())
            elif isinstance(val, list):
                c = len(val)
            else:
                c = 1
            expected = len(ayas)
            if c != expected:
                result['ok'] = False
                result['issues'].append(f'Sura {s} ayas {c} != expected {expected}')
    elif isinstance(data, list):
        if len(data) != 6236:
            result['ok'] = False
            result['issues'].append(f'Raw translations length {len(data)} != 6236')
    else:
        result['ok'] = False
        result['issues'].append('Unexpected JSON format')
    return result


def main():
    if not TDIR.exists():
        print('translations dir not found:', TDIR)
        sys.exit(1)

    inspect_results = []
    for fp in sorted(TDIR.glob('*.json')):
        name = fp.name
        if name.endswith('.meta.json') or name.endswith('.raw.json'):
            continue
        inspect_results.append(inspect_file(fp))

    OUT.write_text(json.dumps(inspect_results, ensure_ascii=False, indent=2), encoding='utf-8')

    # reference checks
    ref = load_reference()
    ref_results = []
    for p in sorted(TRANS_DIR.glob('*.json')):
        if p.name.endswith('.meta.json') or p.name == 'quran_com_translations_index.json' or p.name == 'fetch_errors.json' or p.name == 'en_example.json':
            continue
        ref_results.append(validate_one(p, ref))

    out = TRANS_DIR / 'validation_report.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(ref_results, f, ensure_ascii=False, indent=2)

    # summaries and exit code
    total = len(inspect_results)
    errors = sum(1 for r in inspect_results if r.get('errors'))
    warnings = sum(1 for r in inspect_results if r.get('warnings'))
    print(f'total translation files inspected: {total}')
    print(f'files with errors: {errors}, files with warnings: {warnings}')

    ok_ref = sum(1 for r in ref_results if r.get('ok'))
    bad_ref = len(ref_results) - ok_ref
    print(f'Reference validation: {ok_ref} ok, {bad_ref} with issues. Report: {out}')

    if errors or bad_ref:
        print('See reports for details:', OUT, out)
        sys.exit(1)
    else:
        print('Validation completed (no structural/reference errors). Reports at', OUT, out)
        sys.exit(0)


if __name__ == '__main__':
    main()
