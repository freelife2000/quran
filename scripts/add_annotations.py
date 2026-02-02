#!/usr/bin/env python3
"""Merge translations and asbab (reasons) into the verses file.

Usage examples:
  python3 scripts/add_annotations.py --translations data/translations/en.json --lang en
  python3 scripts/add_annotations.py --asbab data/asbab/template_asbab.json
  python3 scripts/add_annotations.py --translations file.csv --lang en --asbab file.csv
"""
import json
import csv
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_IN = ROOT / 'data' / 'verses_with_tafsir.json'
DEFAULT_OUT = ROOT / 'data' / 'verses_with_annotations.json'


def load_translation_file(path):
    path = Path(path)
    data = {}
    if path.suffix.lower() == '.json':
        raw = json.loads(path.read_text(encoding='utf-8'))
        # nested mapping {sura: {aya: text}} or flat {"sura:aya": text}
        for k, v in raw.items():
            if isinstance(v, dict):
                s = int(k)
                for a, text in v.items():
                    data[(s, int(a))] = text
            else:
                # flat mapping
                if ':' in k:
                    s, a = k.split(':', 1)
                    data[(int(s), int(a))] = v
    elif path.suffix.lower() == '.csv':
        with path.open(newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                try:
                    s = int(r.get('sura_no') or r.get('sura'))
                    a = int(r.get('aya_no') or r.get('aya'))
                    text = r.get('translation') or r.get('text') or ''
                    if text:
                        data[(s, a)] = text
                except Exception:
                    continue
    return data


def load_asbab_file(path):
    path = Path(path)
    data = {}
    if path.suffix.lower() == '.json':
        raw = json.loads(path.read_text(encoding='utf-8'))
        for s, ayas in raw.items():
            for a, reasons in ayas.items():
                data.setdefault((int(s), int(a)), []).extend(reasons)
    elif path.suffix.lower() == '.csv':
        with path.open(newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                try:
                    s = int(r.get('sura_no') or r.get('sura'))
                    a = int(r.get('aya_no') or r.get('aya'))
                    text = r.get('asbab') or r.get('asbab_text') or r.get('text') or ''
                    source = r.get('source') or ''
                    if text:
                        data.setdefault((s, a), []).append({'text': text, 'source': source})
                except Exception:
                    continue
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--in', dest='infile', default=str(DEFAULT_IN))
    parser.add_argument('--out', dest='outfile', default=str(DEFAULT_OUT))
    parser.add_argument('--translations', help='path to translations file (JSON or CSV)')
    parser.add_argument('--lang', help='language code for translations (e.g., en, fr)')
    parser.add_argument('--asbab', help='path to asbab (JSON or CSV)')
    args = parser.parse_args()

    verses = json.loads(Path(args.infile).read_text(encoding='utf-8'))

    # index verses by (sura, aya)
    index = {(int(v.get('sura_no')), int(v.get('aya_no'))): v for v in verses}

    if args.translations:
        if not args.lang:
            print('Error: --lang required when using --translations')
            return
        tdata = load_translation_file(args.translations)
        unmatched = []
        applied = 0
        for (s, a), text in tdata.items():
            v = index.get((s, a))
            if v:
                if 'translations' not in v:
                    v['translations'] = {}
                v['translations'][args.lang] = text
                applied += 1
            else:
                unmatched.append((s, a))
        print(f'Translations applied: {applied}, unmatched entries: {len(unmatched)}')

    if args.asbab:
        adata = load_asbab_file(args.asbab)
        unmatched = []
        applied = 0
        for (s, a), reasons in adata.items():
            v = index.get((s, a))
            if v:
                if 'asbab' not in v:
                    v['asbab'] = []
                v['asbab'].extend(reasons)
                applied += 1
            else:
                unmatched.append((s, a))
        print(f'Asbab entries applied to {applied} verses, unmatched entries: {len(unmatched)}')

    Path(args.outfile).write_text(json.dumps(verses, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Wrote annotations to {args.outfile}')


if __name__ == '__main__':
    main()
