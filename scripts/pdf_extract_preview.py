#!/usr/bin/env python3
"""Extract and print first N pages from a PDF for inspection."""
import sys
from pathlib import Path
from pdfminer.high_level import extract_text

def extract_preview(pdf_path, pages=2):
    text = extract_text(pdf_path, maxpages=pages)
    return text

if __name__ == '__main__':
    p = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'data' / 'translations' / 'sahih-international-quran-english-full.pdf'
    pages = int(sys.argv[2]) if len(sys.argv) > 2 else 2
    print(extract_preview(p, pages))
