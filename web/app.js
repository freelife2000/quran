// ===================== APP STATE =====================
let SURAHS = [];
let TRANSLATIONS = [];
let CURRENT_SURAH = null;
let CURRENT_AYAH = 1;

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', async () => {
    setupTheme();
    await Promise.all([loadSurahs(), loadTranslations()]);
    setupEventListeners();
    showVerse(1, 1);
});

// ===================== THEME MANAGEMENT =====================
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===================== DATA LOADING =====================
async function loadSurahs() {
    try {
        const res = await fetch('/api/surahs');
        SURAHS = await res.json();
        populateSurahSelect();
        populateSurahBrowser();
    } catch (e) {
        console.error('Error loading surahs:', e);
        showError('خطأ في تحميل السور');
    }
}

async function loadTranslations() {
    try {
        const res = await fetch('/api/translations');
        const list = await res.json();
        const sel = document.getElementById('translation');
        const searchSel = document.getElementById('searchTranslation');
        
        sel.innerHTML = '<option value="">— بدون ترجمة —</option>';
        
        list.forEach(it => {
            const opt = document.createElement('option');
            opt.value = it.code;
            const name = it.meta?.filename 
                ? `${it.meta.filename} (${it.code})` 
                : it.code;
            opt.text = name;
            sel.appendChild(opt);
            
            const opt2 = opt.cloneNode(true);
            searchSel.appendChild(opt2);
        });
        TRANSLATIONS = list;
    } catch (e) {
        console.error('Error loading translations:', e);
    }
}

// ===================== DOM POPULATION =====================
function populateSurahSelect() {
    const sel = document.getElementById('sura');
    sel.innerHTML = '<option value="">اختر سورة...</option>';
    (SURAHS || []).forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id || s.number;
        const id = s.id || s.number;
        const aya = s.aya_count || s.ayat_count || 286;
        opt.text = `${id}. ${s.name} (${aya} آية)`;
        sel.appendChild(opt);
    });
}

function populateSurahBrowser() {
    const browser = document.getElementById('surahBrowser');
    browser.innerHTML = '';
    (SURAHS || []).forEach(s => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        const id = s.id || s.number;
        const aya = s.aya_count || s.ayat_count || 286;
        card.innerHTML = `
            <div class="surah-number">${id}</div>
            <div class="surah-name" style="font-weight: 600;">${s.name}</div>
            <div class="ayat-count">${aya} آية</div>
        `;
        card.onclick = () => showVerse(parseInt(id), 1);
        browser.appendChild(card);
    });
}

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
    // Main buttons
    document.getElementById('go').addEventListener('click', () => {
        const sura = document.getElementById('sura').value;
        const ayah = document.getElementById('ayah').value;
        if (sura) showVerse(parseInt(sura), parseInt(ayah) || 1);
        else showError('اختر سورة أولاً');
    });

    document.getElementById('searchBtn')?.addEventListener('click', () => {
        switchTab('search');
        document.getElementById('searchInput').focus();
    });

    document.getElementById('prayerBtn')?.addEventListener('click', openPrayerModal);
    document.getElementById('ahkamBtn')?.addEventListener('click', openAhkamModal);

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Search
    document.getElementById('doSearch')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Sura select
    document.getElementById('sura').addEventListener('change', (e) => {
        if (e.target.value) document.getElementById('ayah').value = 1;
    });

    // Translation change
    document.getElementById('translation').addEventListener('change', () => {
        const sura = parseInt(document.getElementById('sura').value);
        const ayah = parseInt(document.getElementById('ayah').value);
        if (sura && ayah) showVerse(sura, ayah);
    });

    // Modal close on outside click
    document.getElementById('prayerModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'prayerModal') closePrayerModal();
    });

    document.getElementById('ahkamModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'ahkamModal') closeAhkamModal();
    });
}

// ===================== TAB SWITCHING =====================
function switchTab(tabName) {
    document.querySelectorAll('[id*="-tab"]').forEach(el => {
        el.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const tabEl = document.getElementById(tabName + '-tab');
    if (tabEl) tabEl.style.display = 'block';

    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}

// ===================== VERSE DISPLAY =====================
async function showVerse(surah, ayah) {
    CURRENT_SURAH = surah;
    CURRENT_AYAH = ayah;

    const result = document.getElementById('result');
    result.innerHTML = '<div class="loading">جاري التحميل...</div>';

    try {
        const surahData = SURAHS.find(s => (s.id || s.number) === surah);
        const maxAyah = surahData?.aya_count || surahData?.ayat_count || 286;

        document.getElementById('ayah').max = maxAyah;
        document.getElementById('ayah').value = ayah;

        const res = await fetch(`/api/verse/${surah}/${ayah}`);
        if (!res.ok) throw new Error('Verse not found');
        
        const verse = await res.json();
        const translation = document.getElementById('translation').value;
        let translationData = '';

        if (translation) {
            try {
                const transRes = await fetch(`/api/translation/${translation}/${surah}/${ayah}`);
                if (transRes.ok) translationData = await transRes.json();
            } catch (e) {
                console.warn('Translation not found');
            }
        }

        let tafsirData = '';
        try {
            const tafsirRes = await fetch(`/api/tafsir/${surah}/${ayah}`);
            if (tafsirRes.ok) tafsirData = await tafsirRes.json();
        } catch (e) {
            console.warn('Tafsir not found');
        }

        result.innerHTML = renderVerse(verse, translationData, tafsirData, surahData, maxAyah);
        switchTab('viewer');
        window.scrollTo(0, 0);

    } catch (e) {
        console.error('Error:', e);
        result.innerHTML = `<div class="error">خطأ في تحميل الآية: ${e.message}</div>`;
    }
}

function renderVerse(verse, translation, tafsir, surahData, maxAyah) {
    const suraText = surahData?.name || `السورة ${verse.sura_no || verse.sura}`;
    const ayahNum = verse.aya_no || verse.ayah;
    const text = verse.text || verse.arabic;
    
    return `
        <div class="verse-display">
            <div class="verse-meta">
                <div class="verse-info">
                    <strong>${suraText} - الآية ${ayahNum}</strong>
                </div>
                <div class="verse-controls" style="display: flex; gap: 10px;">
                    ${ayahNum > 1 ? `<button class="btn-secondary" onclick="showVerse(${verse.sura_no || verse.sura}, ${ayahNum - 1})" style="min-width: 80px;">← السابقة</button>` : ''}
                    ${ayahNum < maxAyah ? `<button class="btn-secondary" onclick="showVerse(${verse.sura_no || verse.sura}, ${ayahNum + 1})" style="min-width: 80px;">التالية →</button>` : ''}
                </div>
            </div>

            <div class="arabic-text">${text}</div>

            ${translation ? `
                <div class="translation-box">
                    <h4>🌐 الترجمة</h4>
                    <div class="translation-text">${translation.text || translation}</div>
                </div>
            ` : ''}

            ${tafsir ? `
                <div class="tafsir-box">
                    <h4>📚 التفسير</h4>
                    <div class="tafsir-text">${tafsir.tafsir || tafsir}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// ===================== SEARCH FUNCTIONALITY =====================
async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('searchResults');

    if (!query) {
        showError('اكتب نص للبحث');
        return;
    }

    resultsDiv.innerHTML = '<div class="loading">جاري البحث...</div>';

    try {
        const translation = document.getElementById('searchTranslation').value;
        const endpoint = translation 
            ? `/api/search?q=${encodeURIComponent(query)}&translation=${translation}`
            : `/api/search?q=${encodeURIComponent(query)}`;
        
        const res = await fetch(endpoint);
        const results = await res.json();

        if (!results || results.length === 0) {
            resultsDiv.innerHTML = '<p style="color: var(--text-muted);">لم يتم العثور على نتائج</p>';
            return;
        }

        let html = `<p style="margin-bottom: 20px; color: var(--success-color); font-weight: 600;">✓ وجدنا ${results.length || 0} نتيجة</p>`;
        const resultsToShow = Array.isArray(results) ? results : results.results || [];
        resultsToShow.slice(0, 50).forEach(result => {
            const suraNum = result.sura_no || result.sura;
            const ayahNum = result.aya_no || result.ayah;
            const text = result.text || result.arabic;
            html += `
                <div class="verse-display" style="cursor: pointer;" onclick="showVerse(${suraNum}, ${ayahNum})">
                    <div class="verse-meta">
                        <strong>${result.sura_name || 'السورة'} : ${ayahNum}</strong>
                    </div>
                    <div class="arabic-text" style="font-size: 1.6em;">${text}</div>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
    } catch (e) {
        console.error('Error:', e);
        resultsDiv.innerHTML = `<div class="error">خطأ في البحث: ${e.message}</div>`;
    }
}

// ===================== PRAYER TIMES =====================
async function openPrayerModal() {
    const modal = document.getElementById('prayerModal');
    const content = document.getElementById('prayerContent');
    content.innerHTML = '<div class="loading">جاري تحميل أوقات الصلاة...</div>';
    modal.classList.add('active');

    try {
        const res = await fetch('/api/prayer-times');
        const data = await res.json();

        let html = '<table style="width: 100%; border-collapse: collapse;">';
        Object.entries(data || {}).forEach(([prayer, time]) => {
            html += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px; font-weight: 600; color: var(--primary-color);">${prayer}</td>
                    <td style="padding: 12px; text-align: center; font-size: 1.1em;">${time}</td>
                </tr>
            `;
        });
        html += '</table>';

        content.innerHTML = html || '<div class="error">لا توجد بيانات متاحة</div>';
    } catch (e) {
        content.innerHTML = `<div class="error">خطأ في تحميل أوقات الصلاة</div>`;
    }
}

function closePrayerModal() {
    document.getElementById('prayerModal').classList.remove('active');
}

// ===================== AHKAM & ADHKAR =====================
async function openAhkamModal() {
    const modal = document.getElementById('ahkamModal');
    const content = document.getElementById('ahkamContent');
    content.innerHTML = '<div class="loading">جاري تحميل الأحكام والأذكار...</div>';
    modal.classList.add('active');

    try {
        const res = await fetch('/api/ahkam-adhkar');
        const data = await res.json();

        let html = '';
        Object.entries(data || {}).forEach(([category, items]) => {
            html += `<div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary-color); margin-bottom: 10px;">📖 ${category}</h3>`;
            
            if (Array.isArray(items)) {
                items.forEach(item => {
                    html += `<p style="padding: 10px; background: var(--light-bg); border-right: 4px solid var(--primary-color); border-radius: 4px; margin-bottom: 8px; line-height: 1.8;">${item}</p>`;
                });
            } else {
                html += `<p style="line-height: 1.8;">${items}</p>`;
            }
            
            html += '</div>';
        });

        content.innerHTML = html || '<div class="error">لا توجد بيانات متاحة</div>';
    } catch (e) {
        content.innerHTML = `<div class="error">خطأ في تحميل الأحكام والأذكار</div>`;
    }
}

function closeAhkamModal() {
    document.getElementById('ahkamModal').classList.remove('active');
}

// ===================== UTILITIES =====================
function showError(msg) {
    const div = document.createElement('div');
    div.className = 'error';
    div.innerHTML = `❌ ${msg}`;
    const container = document.querySelector('.controls') || document.body;
    container.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

function showSuccess(msg) {
    const div = document.createElement('div');
    div.className = 'success';
    div.innerHTML = `✅ ${msg}`;
    const container = document.querySelector('.controls') || document.body;
    container.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}
