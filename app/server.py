from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import re

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / 'data'

app = FastAPI(
    title='تطبيق القرآن الكريم - Quran App',
    description='تطبيق شامل للقرآن الكريم مع الترجمات والتفاسير',
    version='1.0.0'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_quran():
    p = DATA / 'quran.json'
    if not p.exists():
        return {}
    arr = json.loads(p.read_text(encoding='utf-8'))
    d = {}
    for item in arr:
        key = (int(item['sura_no']), int(item['aya_no']))
        d[key] = item
    return d


def load_tafsir():
    p = DATA / 'verses_with_tafsir.json'
    if not p.exists():
        return {}
    arr = json.loads(p.read_text(encoding='utf-8'))
    d = {}
    for item in arr:
        key = (int(item['sura_no']), int(item['aya_no']))
        d[key] = item
    return d


def load_translations():
    tdir = DATA / 'translations'
    out = {}
    if not tdir.exists():
        return out
    for fp in sorted(tdir.glob('*.json')):
        name = fp.name
        if name.endswith('.meta.json') or name.endswith('.raw.json'):
            continue
        try:
            data = json.loads(fp.read_text(encoding='utf-8'))
        except Exception:
            continue
        # require top-level numeric keys
        if isinstance(data, dict) and data.keys():
            sample_keys = list(data.keys())[:5]
            if all(isinstance(k, str) and k.isdigit() for k in sample_keys):
                code = fp.stem
                out[code] = data
    return out


QURAN = load_quran()
TAFSIR = load_tafsir()
TRANSLATIONS = load_translations()


@app.get('/api/verse/{sura:int}/{ayah:int}')
def get_verse(sura: int, ayah: int, translation: str | None = None):
    key = (sura, ayah)
    q = QURAN.get(key)
    if not q:
        raise HTTPException(status_code=404, detail='Verse not found')
    taf = TAFSIR.get(key, {})
    tafsir_text = taf.get('aya_tafseer') if isinstance(taf, dict) else None
    trans_text = None
    if translation:
        t = TRANSLATIONS.get(translation)
        if not t:
            raise HTTPException(status_code=404, detail='Translation not found')
        # safe access
        trans_text = None
        s = t.get(str(sura))
        if isinstance(s, dict):
            v = s.get(str(ayah))
            if isinstance(v, str):
                trans_text = v
            elif isinstance(v, dict):
                # some translations store more structured value
                trans_text = v.get('text') or v.get('translation') or None

    return {
        'sura': sura,
        'ayah': ayah,
        'arabic': q.get('aya_text_emlaey') or q.get('aya_text'),
        'tafsir': tafsir_text,
        'translation': trans_text,
    }


@app.get('/api/translations')
def list_translations():
    res = []
    meta_dir = DATA / 'translations'
    for code in sorted(TRANSLATIONS.keys()):
        meta = {}
        mfp = meta_dir / f'{code}.meta.json'
        if mfp.exists():
            try:
                meta = json.loads(mfp.read_text(encoding='utf-8'))
            except Exception:
                meta = {}
        res.append({'code': code, 'meta': meta})
    return res


from fastapi.responses import FileResponse

# serve index.html at root and static files under /static
app.mount('/static', StaticFiles(directory=str(BASE / 'web')), name='static')

@app.get('/')
def index():
    idx = BASE / 'web' / 'index.html'
    return FileResponse(idx)


@app.get('/api/prayer-times')
def get_prayer_times():
    """Return prayer times and Islamic calendar information."""
    p = DATA / 'prayer_times.json'
    if p.exists():
        try:
            return json.loads(p.read_text(encoding='utf-8'))
        except Exception:
            pass
    return {'error': 'Prayer times data not available'}


@app.get('/api/ahkam-adhkar')
def get_ahkam_adhkar():
    """Return Islamic rulings and remembrances (adhkaar) in multiple languages."""
    p = DATA / 'ahkam_adhkar.json'
    if p.exists():
        try:
            return json.loads(p.read_text(encoding='utf-8'))
        except Exception:
            pass
    return {'error': 'Ahkam and Adhkar data not available'}


# New endpoints for better functionality
SURAHS = None
def load_surahs_list():
    """Load surahs metadata"""
    global SURAHS
    if SURAHS is not None:
        return SURAHS
    
    SURAHS = {}
    if not QURAN:
        return SURAHS
    
    for (sura, ayah), verse_data in QURAN.items():
        if sura not in SURAHS:
            SURAHS[sura] = {
                'number': sura,
                'name': verse_data.get('sura_name', f'Surah {sura}'),
                'verses': [],
                'ayat_count': 0
            }
        SURAHS[sura]['verses'].append(ayah)
    
    for sura in SURAHS:
        SURAHS[sura]['verses'] = sorted(list(set(SURAHS[sura]['verses'])))
        SURAHS[sura]['ayat_count'] = len(SURAHS[sura]['verses'])
    
    return SURAHS


@app.get('/api/surahs')
def get_surahs():
    """Get list of all surahs with metadata"""
    surahs_list = load_surahs_list()
    return sorted(surahs_list.values(), key=lambda x: x['number'])


@app.get('/api/surah/{sura_num:int}')
def get_surah(sura_num: int):
    """Get metadata for a specific surah"""
    surahs_list = load_surahs_list()
    if sura_num not in surahs_list:
        raise HTTPException(status_code=404, detail='Surah not found')
    return surahs_list[sura_num]


@app.get('/api/surah/{sura_num:int}/verses')
def get_surah_verses(sura_num: int, translation: str | None = None):
    """Get all verses of a surah with optional translation"""
    surahs_list = load_surahs_list()
    if sura_num not in surahs_list:
        raise HTTPException(status_code=404, detail='Surah not found')
    
    surah = surahs_list[sura_num]
    verses = []
    
    for ayah_num in surah['verses']:
        key = (sura_num, ayah_num)
        q = QURAN.get(key)
        if not q:
            continue
        
        verse = {
            'sura': sura_num,
            'ayah': ayah_num,
            'arabic': q.get('aya_text_emlaey') or q.get('aya_text'),
        }
        
        if translation:
            t = TRANSLATIONS.get(translation)
            if t:
                s = t.get(str(sura_num))
                if isinstance(s, dict):
                    v = s.get(str(ayah_num))
                    if isinstance(v, str):
                        verse['translation'] = v
                    elif isinstance(v, dict):
                        verse['translation'] = v.get('text') or v.get('translation')
        
        verses.append(verse)
    
    return {
        'surah': surah,
        'verses': verses
    }


@app.get('/api/search')
def search_quran(q: str, translation: str | None = None):
    """Search for verses containing the query text"""
    if not q or len(q) < 2:
        raise HTTPException(status_code=400, detail='Search query too short')
    
    results = []
    search_text = q.lower()
    
    for (sura, ayah), verse_data in QURAN.items():
        arabic_text = verse_data.get('aya_text', '')
        if search_text in arabic_text.lower():
            verse = {
                'sura': sura,
                'ayah': ayah,
                'arabic': arabic_text,
            }
            
            if translation:
                t = TRANSLATIONS.get(translation)
                if t:
                    s = t.get(str(sura))
                    if isinstance(s, dict):
                        v = s.get(str(ayah))
                        if isinstance(v, str):
                            verse['translation'] = v
            
            results.append(verse)
    
    return {'results': results[:50], 'count': len(results)}  # Limit to 50 results


@app.get('/api/translation/{code:str}/metadata')
def get_translation_metadata(code: str):
    """Get metadata for a specific translation"""
    meta_dir = DATA / 'translations'
    mfp = meta_dir / f'{code}.meta.json'
    if mfp.exists():
        try:
            return json.loads(mfp.read_text(encoding='utf-8'))
        except Exception:
            pass
    
    raise HTTPException(status_code=404, detail='Translation metadata not found')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app.server:app', host='0.0.0.0', port=8000, reload=True)
