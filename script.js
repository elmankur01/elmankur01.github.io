function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

let currentPage = 1;
const PAGE_SIZE = 20;
let currentFilteredParts = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Cookie consent
    if (!localStorage.getItem('ap_cookies_accepted')) {
        document.getElementById('cookieBanner').classList.add('show');
    }

    // Burger menu
    const burger = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navList.classList.toggle('active');
    });
    navList.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Init catalog
    populateFilters();
    currentFilteredParts = PARTS_DB;
    renderCatalog([]);

    // Init partners
    renderPartners();
    updateClickCount();

    // Chat init
    initChat();
    setupChatScroll();

    // UX enhancements
    initScrollToTop();
    initSectionReveal();
    initAutocomplete();
    updateActiveNav();

    window.addEventListener('scroll', updateActiveNav);
});

function acceptCookies() {
    localStorage.setItem('ap_cookies_accepted', 'true');
    document.getElementById('cookieBanner').classList.remove('show');
}

function rejectCookies() {
    localStorage.setItem('ap_cookies_accepted', 'false');
    document.getElementById('cookieBanner').classList.remove('show');
}

function openPrivacy() {
    document.getElementById('privacyModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePrivacy() {
    document.getElementById('privacyModal').classList.remove('show');
    document.body.style.overflow = '';
}

function openTerms() {
    document.getElementById('termsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeTerms() {
    document.getElementById('termsModal').classList.remove('show');
    document.body.style.overflow = '';
}

// Close modals on overlay click
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('privacyModal').addEventListener('click', function(e) {
        if (e.target === this) closePrivacy();
    });
    document.getElementById('termsModal').addEventListener('click', function(e) {
        if (e.target === this) closeTerms();
    });
});

// === CATALOG ===
function populateFilters() {
    const makeSel = document.getElementById('filterMake');
    getUniqueMakes().forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        makeSel.appendChild(opt);
    });
}

function updateModels() {
    const make = document.getElementById('filterMake').value;
    const modelSel = document.getElementById('filterModel');
    const catSel = document.getElementById('filterCategory');

    modelSel.innerHTML = '<option value="">Все модели</option>';
    catSel.innerHTML = '<option value="">Все категории</option>';

    if (make) {
        getModelsByMake(make).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            modelSel.appendChild(opt);
        });
    }
    filterParts();
}

function updateCategories() {
    const make = document.getElementById('filterMake').value;
    const model = document.getElementById('filterModel').value;
    const catSel = document.getElementById('filterCategory');
    catSel.innerHTML = '<option value="">Все категории</option>';

    if (make && model) {
        getCategoriesByMakeModel(make, model).forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            catSel.appendChild(opt);
        });
    }
    filterParts();
}

function filterParts() {
    const make = document.getElementById('filterMake').value;
    const model = document.getElementById('filterModel').value;
    const category = document.getElementById('filterCategory').value;
    const text = document.getElementById('filterText').value;
    currentFilteredParts = filterPartsData(make, model, category, text);
    currentPage = 1;
    renderCatalog(currentFilteredParts);
}

function renderCatalog(parts) {
    const grid = document.getElementById('catalogGrid');
    const empty = document.getElementById('catalogEmpty');
    const counter = document.getElementById('resultsCounter');
    const make = document.getElementById('filterMake').value;
    const model = document.getElementById('filterModel').value;

    document.getElementById('heroSearch').value ? document.getElementById('searchClear').classList.add('visible') : document.getElementById('searchClear').classList.remove('visible');

    if (parts.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        counter.textContent = '';
        if (!make && !model) {
            empty.innerHTML = '<i class="fas fa-car"></i><p style="font-size:1.1rem;margin-top:10px;">Выберите марку и модель автомобиля, чтобы увидеть подходящие запчасти</p>';
        } else {
            empty.innerHTML = '<i class="fas fa-box-open"></i><p>Ничего не найдено. Попробуйте изменить параметры поиска.</p>';
        }
        return;
    }
    empty.style.display = 'none';
    counter.textContent = `Найдено ${parts.length} ${formatResultCount(parts.length)}`;

    const end = currentPage * PAGE_SIZE;
    const visible = parts.slice(0, end);
    const hasMore = end < parts.length;

    grid.innerHTML = visible.map(p => `
        <div class="part-card">
            <div class="part-card-header">
                <span class="part-brand">${p.brand}</span>
                <span class="part-category">${p.category}</span>
            </div>
            <h3>${p.name}</h3>
            <div class="part-desc">${p.make} ${p.model} ${p.year} · ${p.engine}${p.note ? '<br><em>' + p.note + '</em>' : ''}</div>
            <div class="part-oem" onclick="copyOEM(this)">${p.oem}</div>
            <div class="part-stores">
                ${document.getElementById('filterModel').value
                    ? getStoreLinks(p.oem).map(s => `
                        <a href="${s.fullUrl}" target="_blank" rel="noopener" class="store-btn" style="--store-color:${s.color}" onclick="trackClick('${s.name}','${p.oem}')">
                            <i class="${s.icon}"></i> ${s.name} <span class="ad-label">Реклама</span>
                        </a>
                    `).join('')
                    : '<span class="part-store-hint">Выберите модель, чтобы перейти в магазин</span>'
                }
            </div>
            <div class="part-card-footer">
                <span class="part-stock ${p.inStock ? 'in-stock' : 'on-order'}">
                    <i class="fas ${p.inStock ? 'fa-check-circle' : 'fa-clock'}"></i>
                    ${p.inStock ? 'В наличии' : 'Под заказ'}
                </span>
                <button class="part-copy-btn" onclick="copyOEMBtn(this, '${p.oem}')">
                    <i class="far fa-copy"></i> Копировать
                </button>
            </div>
        </div>
    `).join('');

    if (hasMore) {
        const loadMore = document.createElement('div');
        loadMore.style.cssText = 'grid-column:1/-1;text-align:center;margin-top:20px;margin-bottom:10px;';
        loadMore.innerHTML = `<button onclick="loadMore()" class="btn btn-primary" style="padding:12px 40px;"><i class="fas fa-chevron-down"></i> Показать ещё (${parts.length - end})</button>`;
        grid.appendChild(loadMore);
    }
}

function loadMore() {
    currentPage++;
    renderCatalog(currentFilteredParts);
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function copyOEM(el) {
    navigator.clipboard.writeText(el.textContent.trim()).then(() => {
        el.style.background = '#d8f3dc';
        el.style.color = '#2d6a4f';
        setTimeout(() => {
            el.style.background = '';
            el.style.color = '';
        }, 1500);
    });
}

function copyOEMBtn(el, oem) {
    navigator.clipboard.writeText(oem).then(() => {
        el.innerHTML = '<i class="fas fa-check"></i> Скопировано';
        el.classList.add('copied');
        setTimeout(() => {
            el.innerHTML = '<i class="far fa-copy"></i> Копировать';
            el.classList.remove('copied');
        }, 2000);
    });
}

function searchParts() {
    const query = document.getElementById('heroSearch').value.trim();
    if (!query) return;

    document.getElementById('filterText').value = query;
    document.getElementById('filterMake').value = '';
    document.getElementById('filterModel').value = '';
    document.getElementById('filterCategory').value = '';

    const result = filterPartsData('', '', '', query);
    renderCatalog(result);

    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

// === CHAT CONSULTANT ===
let chatState = 'greeting';
let carContext = { make: '', model: '', year: '', engine: '' };

const CAR_SYNONYMS = {
  'лада': 'Lada', 'ваз': 'Lada', 'lada': 'Lada', 'vaz': 'Lada',
  'бмв': 'BMW', 'bmw': 'BMW', 'beemer': 'BMW', 'bimmer': 'BMW',
  'мерседес': 'Mercedes', 'mersedes': 'Mercedes', 'mercedes': 'Mercedes', 'merc': 'Mercedes',
  'ауди': 'Audi', 'audi': 'Audi',
  'тойота': 'Toyota', 'toyota': 'Toyota',
  'киа': 'Kia', 'kia': 'Kia',
  'хендай': 'Hyundai', 'hyundai': 'Hyundai', 'хундай': 'Hyundai',
  'ниссан': 'Nissan', 'nissan': 'Nissan',
  'мазда': 'Mazda', 'mazda': 'Mazda',
  'форд': 'Ford', 'ford': 'Ford',
  'шкода': 'Skoda', 'skoda': 'Skoda', 'skoda': 'Skoda',
  'фольксваген': 'Volkswagen', 'volkswagen': 'Volkswagen', 'vw': 'Volkswagen', 'фв': 'Volkswagen',
  'рено': 'Renault', 'renault': 'Renault',
  'шэври': 'Chery', 'chery': 'Chery', 'чери': 'Chery',
  'хавал': 'Haval', 'haval': 'Haval',
  'джили': 'Geely', 'geely': 'Geely',
  'changan': 'Changan', 'чанган': 'Changan',
  'exeed': 'Exeed', 'эксид': 'Exeed',
  'omoda': 'Omoda', 'омода': 'Omoda'
};

const CATEGORY_KEYWORDS = {
  'тормоз': 'Тормозная система',
  'колодк': 'Тормозная система',
  'диск': 'Тормозная система',
  'барабан': 'Тормозная система',
  'суппорт': 'Тормозная система',
  'фильтр': 'Фильтры',
  'маслян': 'Фильтры',
  'воздушн': 'Фильтры',
  'салонн': 'Фильтры',
  'топливн': 'Фильтры',
  'масло': 'Масла и жидкости',
  'антифриз': 'Масла и жидкости',
  'жидкост': 'Масла и жидкости',
  'подвеск': 'Подвеска',
  'амортизатор': 'Подвеска',
  'сайлент': 'Подвеска',
  'стойк': 'Подвеска',
  'стабилизатор': 'Подвеска',
  'пружин': 'Подвеска',
  'рычаг': 'Подвеска',
  'двигатель': 'Двигатель и системы',
  'помпа': 'Двигатель и системы',
  'ремень': 'Привод',
  'цепь': 'Привод',
  'генератор': 'Привод',
  'привод': 'Привод',
  'свеч': 'Электрика',
  'электрик': 'Электрика',
  'аккумулятор': 'Электрика',
  'ламп': 'Электрика',
  'датчик': 'Электрика',
  'стартер': 'Электрика',
  'генератор': 'Электрика',
  'кузов': 'Кузов',
  'стекл': 'Кузов',
  'фары': 'Кузов',
  'оптик': 'Кузов',
  'трансмисси': 'Трансмиссия',
  'коробк': 'Трансмиссия',
  'сцепление': 'Трансмиссия',
  'акпп': 'Трансмиссия',
  'мкпп': 'Трансмиссия',
  'выхлоп': 'Выхлопная система',
  'глушитель': 'Выхлопная система',
  'катализатор': 'Выхлопная система',
  'охлажден': 'Охлаждение',
  'радиатор': 'Охлаждение',
  'термостат': 'Охлаждение',
  'вентилятор': 'Охлаждение'
};

const ALL_CATEGORIES = [...new Set(PARTS_DB.map(p => p.category))].sort();

// VIN WMI lookup (first 3 chars identify manufacturer)
const VIN_WMI = {
  'JSA': 'Mitsubishi', 'JN1': 'Nissan', 'JN6': 'Nissan',
  'JTE': 'Toyota', 'JTM': 'Toyota', 'JT2': 'Toyota', 'JT3': 'Toyota',
  'JT6': 'Toyota', 'JTD': 'Toyota',
  'KMH': 'Hyundai', 'KNA': 'Kia', 'KNC': 'Kia',
  'LGW': 'Great Wall', 'LHA': 'Chery',
  'LSY': 'Chery', 'LVS': 'Chery', 'LVV': 'Chery',
  'LTV': 'Changan', 'LS5': 'Geely',
  'MAK': 'Mazda', 'MMM': 'Mitsubishi', 'MMB': 'Mitsubishi',
  'MPA': 'Ford',
  'SAL': 'Land Rover', 'SAJ': 'Jaguar',
  'SB1': 'Toyota', 'SMT': 'Toyota',
  'VF1': 'Renault', 'VF3': 'Renault', 'VF7': 'Citroen',
  'VSS': 'SEAT', 'VW1': 'Volkswagen', 'VW2': 'Volkswagen',
  'VWV': 'Volkswagen', 'WBA': 'BMW', 'WBS': 'BMW',
  'WDB': 'Mercedes', 'WDC': 'Mercedes', 'WDD': 'Mercedes',
  'WF0': 'Ford', 'WF1': 'Ford',
  'WOL': 'Opel', 'W0L': 'Opel',
  'WVW': 'Volkswagen', 'WV1': 'Volkswagen', 'WV2': 'Volkswagen',
  'XTA': 'Lada', 'XTT': 'Lada', 'XTC': 'Lada',
  'XW8': 'Volkswagen', 'XW7': 'Audi',
  'YS3': 'Saab', 'YV1': 'Volvo', 'YV4': 'Volvo',
  'ZAR': 'Alfa Romeo', 'ZCF': 'Fiat', 'ZFA': 'Fiat',
  'ZLA': 'Lancia', 'ZAA': 'Fiat'
};

function initChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    addBotMessage('Здравствуйте! Я ИИ-консультант по подбору автозапчастей 🚗');
    addBotMessage('Назовите марку и модель автомобиля, чтобы я помог найти нужную деталь. Например: <strong>Toyota Camry 2018</strong>');
    addQuickReplies(['Toyota Camry 2018', 'BMW 3 Series 2020', 'Hyundai Sonata 2021', 'Lada Vesta']);
    chatState = 'awaiting_car';
}

function setupChatScroll() {
    const chat = document.getElementById('chatMessages');
    const obs = new MutationObserver(() => {
        requestAnimationFrame(() => {
            chat.scrollTop = chat.scrollHeight;
        });
    });
    obs.observe(chat, { childList: true, subtree: true });
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    carContext = { make: '', model: '', year: '', engine: '' };
    chatState = 'greeting';
    initChat();
}

function toggleChat() {
    const panel = document.getElementById('chatPanel');
    const toggle = document.getElementById('chatToggle');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
        document.getElementById('chatInput').focus();
        const msg = document.getElementById('chatMessages');
        msg.scrollTop = msg.scrollHeight;
    }
}

function openChat() {
    document.getElementById('chatPanel').classList.add('active');
    setTimeout(() => document.getElementById('chatInput').focus(), 300);
    document.getElementById('consultant').scrollIntoView({ behavior: 'smooth' });
}

function sendMessage(text) {
    const input = document.getElementById('chatInput');
    const msg = (text || input.value).trim();
    if (!msg) return;
    input.value = '';
    addUserMessage(msg);
    showTyping();
    setTimeout(() => {
        hideTyping();
        processMessage(msg);
    }, 400 + Math.random() * 300);
}

function addUserMessage(text) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg user';
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '<i class="fas fa-user"></i>';
    const content = document.createElement('div');
    content.className = 'msg-content';
    content.textContent = text;
    div.appendChild(avatar);
    div.appendChild(content);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addBotMessage(text) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content">${text}</div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
    if (document.getElementById('typingIndicator')) return;
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function addQuickReplies(replies) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    const safeReplies = replies.map(r => ({
        text: r,
        safe: r.replace(/'/g, "\\'")
    }));
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content">
            <div class="quick-replies">
                ${safeReplies.map(r => `<button class="quick-reply" onclick="sendMessage('${r.safe}')">${escapeHtml(r.text)}</button>`).join('')}
            </div>
        </div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addResultCard(parts) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content">
            ${parts.map(p => `
                <div class="chat-result-card">
                    <strong style="color:var(--secondary);font-size:0.9rem;">${escapeHtml(p.name)}</strong><br>
                    <span style="font-size:0.75rem;color:var(--accent);">${escapeHtml(p.category)} · ${escapeHtml(p.brand)}</span><br>
                    <code style="display:inline-block;background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:0.85rem;font-weight:700;color:var(--primary);margin:4px 0;user-select:all;">${escapeHtml(p.oem)}</code><br>
                    <span style="font-size:0.8rem;color:${p.inStock ? '#2d6a4f' : '#e07c00'};">
                        ${p.inStock ? '✓ В наличии' : '⏳ Под заказ'}
                    </span>
                    ${p.note ? '<br><em style="font-size:0.75rem;color:var(--gray);">' + escapeHtml(p.note) + '</em>' : ''}
                    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;">
                        ${getStoreLinks(p.oem).map(s => `
                            <a href="${s.fullUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;background:${s.color};color:white;padding:4px 10px;border-radius:6px;font-size:0.75rem;text-decoration:none;" onclick="trackClick('${s.name}','${p.oem}')">
                                <i class="${s.icon}"></i> ${s.name} <span class="ad-label" style="background:rgba(255,255,255,0.25);font-size:0.6rem;padding:1px 5px;border-radius:3px;">Реклама</span>
                            </a>
                        `).join('')}
                    </div>
                    <button class="quick-reply" onclick="copyFromChat('${p.oem}', this)" style="font-size:0.75rem;padding:3px 10px;margin-top:6px;">📋 Копировать ${p.oem}</button>
                </div>
            `).join('')}
            <div style="margin-top:8px;font-size:0.8rem;color:var(--gray);">
                Нажмите на магазин, чтобы перейти к оформлению. Вы получите лучшую цену, а я — комиссию с продажи. Спасибо!
            </div>
        </div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function copyFromChat(oem, btn) {
    navigator.clipboard.writeText(oem).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Скопировано';
        btn.style.borderColor = '#2d6a4f';
        btn.style.color = '#2d6a4f';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

const MODEL_SYNONYMS = {
  'солярис': 'Solaris', 'solaris': 'Solaris',
  'рио': 'Rio', 'rio': 'Rio',
  'спортейдж': 'Sportage', 'sportage': 'Sportage',
  'туссан': 'Tucson', 'tucson': 'Tucson',
  'соната': 'Sonata', 'sonata': 'Sonata',
  'церера': 'Cerato', 'cerato': 'Cerato',
  'селтос': 'Seltos', 'seltos': 'Seltos',
  'камри': 'Camry', 'camry': 'Camry',
  'рав4': 'RAV4', 'rav4': 'RAV4',
  'королла': 'Corolla', 'corolla': 'Corolla',
  'октавия': 'Octavia', 'octavia': 'Octavia',
  'кодиак': 'Kodiaq', 'kodiaq': 'Kodiaq',
  'тигуан': 'Tiguan', 'tiguan': 'Tiguan',
  'пассат': 'Passat', 'passat': 'Passat',
  'поло': 'Polo', 'polo': 'Polo',
  'дустер': 'Duster', 'duster': 'Duster',
  'логан': 'Logan', 'logan': 'Logan',
  'веста': 'Vesta', 'vesta': 'Vesta',
  'гранта': 'Granta', 'granta': 'Granta',
  'фокус': 'Focus', 'focus': 'Focus',
  'куга': 'Kuga', 'kuga': 'Kuga',
  'джолион': 'Jolion', 'jolion': 'Jolion',
  'монжаро': 'Monjaro', 'monjaro': 'Monjaro',
  'кулрей': 'Coolray', 'coolray': 'Coolray',
  'атлас': 'Atlas', 'atlas': 'Atlas'
};

function normalizeMake(input) {
    const lower = input.toLowerCase().trim();
    return CAR_SYNONYMS[lower] || input.charAt(0).toUpperCase() + input.slice(1);
}

function normalizeModel(input) {
    const lower = input.toLowerCase().trim();
    return MODEL_SYNONYMS[lower] || input;
}

function decodeVin(vin) {
    if (!vin || vin.length < 3) return null;
    const wmi = vin.substring(0, 3).toUpperCase();
    const make = VIN_WMI[wmi];
    if (!make) return null;
    const yearCode = vin[9];
    const yearMap = {
        'L': 1990, 'M': 1991, 'N': 1992, 'P': 1993, 'R': 1994,
        'S': 1995, 'T': 1996, 'V': 1997, 'W': 1998, 'X': 1999,
        'Y': 2000, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
        '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
        'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
        'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
        'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
        'S': 2025, 'T': 2026
    };
    const year = yearMap[yearCode] || null;
    return { make, model: null, year };
}

function resolveCarInfo(msg) {
    const vinMatch = msg.match(/\b([A-HJ-NPR-Z0-9]{17})\b/i);
    if (vinMatch) {
        const decoded = decodeVin(vinMatch[1]);
        if (decoded) {
            decoded.fromVin = true;
            return decoded;
        }
    }

    const normalized = msg
        .replace(/[–—]/g, '-')
        .replace(/\s+/g, ' ');

    const carMatch = normalized.match(
        /^(.+?)\s+(.+?)(?:\s+(\d{4}))?(?:\s+(.+))?$/
    );

    if (carMatch) {
        const rawMake = carMatch[1];
        const make = normalizeMake(rawMake);
        let model = normalizeModel(carMatch[2].trim());
        const year = carMatch[3] || '';
        let engine = (carMatch[4] || '').trim();

        const modelParts = model.split(/\s+/);
        const yearMatch = modelParts.find(p => /^\d{4}$/.test(p));
        if (yearMatch && !year) {
            model = modelParts.filter(p => p !== yearMatch).join(' ');
        }

        return { make, model, year: year || '', engine, fromVin: false };
    }

    return null;
}

function processMessage(msg) {
    if (chatState === 'awaiting_car') {
        const carInfo = resolveCarInfo(msg);
        if (carInfo && carInfo.fromVin) {
            carContext.make = carInfo.make || '';
            carContext.model = '';
            carContext.year = carInfo.year ? String(carInfo.year) : '';
            carContext.engine = '';
            addBotMessage(`🔍 По VIN определён: <strong>${carInfo.make}</strong>${carInfo.year ? ' (' + carInfo.year + ' г.)' : ''}. Не удалось определить точную модель. Какая деталь вас интересует?`);
            addQuickReplies(['Тормозные колодки', 'Масляный фильтр', 'Подвеска', 'Двигатель']);
            chatState = 'awaiting_part';
            return;
        }
        if (carInfo && carInfo.make) {
            carContext.make = carInfo.make;
            carContext.model = carInfo.model || '';
            carContext.year = carInfo.year || '';
            carContext.engine = carInfo.engine || '';

            const hasInDb = PARTS_DB.some(p =>
                p.make.toLowerCase() === carInfo.make.toLowerCase() &&
                (!carInfo.model || p.model.toLowerCase().includes(carInfo.model.toLowerCase()))
            );

            if (hasInDb) {
                addBotMessage(`Отлично! ${carInfo.make} ${carInfo.model || ''}${carInfo.year ? ' ' + carInfo.year : ''}${carInfo.engine ? ', ' + carInfo.engine : ''}. Какая деталь вас интересует?`);
                const topCats = getTopCategories(carInfo.make, carInfo.model);
                addQuickReplies(topCats.length ? topCats : ['Тормозные колодки', 'Масляный фильтр', 'Воздушный фильтр', 'Подвеска', 'Свечи зажигания']);
                chatState = 'awaiting_part';
            } else {
                addBotMessage(`❌ К сожалению, ${carInfo.make} ${carInfo.model || ''} пока нет в нашем каталоге. Попробуйте другую марку, или используйте поиск по каталогу на сайте.`);
                addQuickReplies(['Toyota Camry', 'BMW 3 Series', 'Hyundai Sonata']);
                chatState = 'awaiting_car';
            }
            return;
        }

        addBotMessage('Пожалуйста, укажите марку и модель. Например: <strong>Toyota Camry 2018</strong> или <strong>BMW X5</strong>. Либо просто напишите <strong>VIN-номер</strong> для автоопределения.');
        return;
    }

    switch (chatState) {
        case 'awaiting_part':
            handlePartSearch(msg);
            break;
        case 'awaiting_details':
            handleDetails(msg);
            break;
        case 'awaiting_vin':
            handleVinInput(msg);
            break;
        default:
            initChat();
    }
}

function getTopCategories(make, model) {
    let cats = PARTS_DB
        .filter(p => p.make.toLowerCase() === make.toLowerCase() &&
            (!model || p.model.toLowerCase().includes(model.toLowerCase())))
        .map(p => p.category);

    if (cats.length === 0) {
        cats = PARTS_DB.map(p => p.category);
    }

    const counts = {};
    cats.forEach(c => counts[c] = (counts[c] || 0) + 1);
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([cat]) => cat);
}

function handlePartSearch(msg) {
    const categoryFromKeywords = findCategoryByKeyword(msg);
    let parts;

    if (categoryFromKeywords) {
        parts = findPartsForCar(carContext.make, carContext.model, carContext.year, carContext.engine, categoryFromKeywords);
    } else {
        parts = findPartsForCar(carContext.make, carContext.model, carContext.year, carContext.engine, msg);
    }

    if (parts.length === 0) {
        const availableCats = getTopCategories(carContext.make, carContext.model);
        if (availableCats.length) {
            addBotMessage(`Не нашёл "${escapeHtml(msg)}" для ${escapeHtml(carContext.make)} ${escapeHtml(carContext.model)}. Вот доступные категории запчастей для этого авто:`);
            addQuickReplies(availableCats);
        } else {
            addBotMessage(`К сожалению, не удалось найти детали "${escapeHtml(msg)}" для ${escapeHtml(carContext.make)} ${escapeHtml(carContext.model)}. Попробуйте уточнить: <strong>колодки</strong>, <strong>фильтр</strong>, <strong>амортизатор</strong>.`);
            addQuickReplies(['Тормозные колодки', 'Масляный фильтр', 'Воздушный фильтр', 'Амортизаторы', 'Другая марка']);
        }
        chatState = 'awaiting_part';
        return;
    }

    const header = carContext.year
        ? `${carContext.make} ${carContext.model}, ${carContext.year}`
        : `${carContext.make} ${carContext.model}`;
    const engineInfo = carContext.engine ? `, ${carContext.engine}` : '';

    addBotMessage(`📋 <strong>Результаты для ${header}${engineInfo}:</strong>`);
    addResultCard(parts);

    const relatedCats = getTopCategories(carContext.make, carContext.model)
        .filter(c => !parts.some(p => p.category === c));
    const suggestions = relatedCats.slice(0, 2);

    let followUp = 'Рекомендуется проверить совместимость по VIN-коду перед заказом.';
    if (suggestions.length) {
        followUp += ` Также у этого авто есть запчасти в категории: <strong>${suggestions.join('</strong>, <strong>')}</strong>.`;
    }
    addBotMessage(followUp);

    const replies = ['Найти ещё деталь'];
    if (suggestions.length) suggestions.slice(0, 1).forEach(c => replies.push(c));
    replies.push('Проверить по VIN');
    replies.push('✅ Спасибо!');
    addQuickReplies(replies);
    chatState = 'awaiting_details';
}

function findCategoryByKeyword(text) {
    const lower = text.toLowerCase();
    for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
        if (lower.includes(keyword)) return category;
    }
    return null;
}

function handleDetails(msg) {
    const lower = msg.toLowerCase();

    const categoryFromKeywords = findCategoryByKeyword(msg);
    if (categoryFromKeywords) {
        chatState = 'awaiting_part';
        handlePartSearch(categoryFromKeywords);
        return;
    }

    if (lower.includes('ещё') || lower.includes('друг') || lower.includes('искать') || lower.includes('нов')) {
        const availableCats = getTopCategories(carContext.make, carContext.model);
        addBotMessage('Какая деталь или категория вас интересует?');
        addQuickReplies(availableCats.length ? availableCats : ['Тормозная система', 'Фильтры', 'Подвеска', 'Двигатель']);
        chatState = 'awaiting_part';
    } else if (lower.includes('vin') || lower.includes('провер')) {
        addBotMessage('Введите VIN-номер автомобиля (17 символов). Обычно он указан в ПТС или на кузове под капотом.');
        chatState = 'awaiting_vin';
    } else if (lower.includes('спас') || lower.includes('благодар') || lower.includes('да') || lower.includes('хорош')) {
        addBotMessage('Рад был помочь! 🚗 Скопируйте OEM-артикул и перейдите в магазин для заказа. Если понадобится ещё что-то — просто напишите!');
        setTimeout(() => {
            addQuickReplies(['Найти новую деталь', 'Другая марка']);
            chatState = 'awaiting_car';
        }, 800);
    } else if (lower.includes('марк') || lower.includes('другой') || lower.includes('меня')) {
        carContext = { make: '', model: '', year: '', engine: '' };
        addBotMessage('Хорошо, давайте начнём заново. Какая марка и модель автомобиля вас интересует?');
        addQuickReplies(['Toyota Camry 2018', 'BMW 3 Series 2020', 'Lada Vesta']);
        chatState = 'awaiting_car';
    } else {
        addBotMessage('Не совсем понял. Если хотите найти другую деталь — напишите <strong>"ещё"</strong> или название категории. Если всё в порядке — <strong>"спасибо"</strong>.');
    }
}

function handleVinInput(msg) {
    const vin = msg.trim().toUpperCase();
    const vinClean = vin.match(/[A-HJ-NPR-Z0-9]{17}/);
    if (!vinClean) {
        addBotMessage('VIN-номер должен содержать 17 символов (буквы и цифры). Проверьте ввод и попробуйте снова.');
        return;
    }

    const decoded = decodeVin(vinClean[0]);
    if (!decoded) {
        addBotMessage('Не удалось определить марку по VIN. Проверьте номер или укажите марку вручную.');
        chatState = 'awaiting_car';
        addQuickReplies(['Toyota Camry', 'BMW 3 Series']);
        return;
    }

    carContext.make = decoded.make || '';
    carContext.year = decoded.year ? String(decoded.year) : '';
    carContext.model = '';
    carContext.engine = '';

    const yearText = decoded.year ? ` (${decoded.year} г.)` : '';
    addBotMessage(`✅ По VIN определён: <strong>${decoded.make}${yearText}</strong>. Какая деталь вам нужна?`);

    const availableCats = getTopCategories(decoded.make, '');
    if (availableCats.length) {
        addQuickReplies(availableCats.slice(0, 5));
    } else {
        addQuickReplies(['Тормозные колодки', 'Масляный фильтр', 'Подвеска']);
    }
    chatState = 'awaiting_part';
}
 
// === PARTNERS ===
function renderPartners() {
    const grid = document.getElementById('partnersGrid');
    grid.innerHTML = STORES.map(s => {
        const exampleOem = '04465-33220';
        const directUrl = s.urlTemplate.replace('{OEM}', exampleOem);
        const isConfigured = s.campaignId && !s.campaignId.startsWith('ЗАМЕНИТЬ');
        let exampleUrl;
        if (isConfigured) {
            if (s.type === 'mylead') {
                exampleUrl = `https://mylead.global/go/${s.campaignId}/?url=${encodeURIComponent(directUrl)}`;
            } else if (s.type === 'takprodam_short') {
                exampleUrl = `https://sgkaa.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}&erid=${s.erid}`;
            } else {
                exampleUrl = `https://ad.admitad.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}`;
                if (s.erid) exampleUrl += `&erid=${s.erid}`;
            }
        } else {
            exampleUrl = directUrl;
        }
        return `
            <div class="partner-card" style="border-color:${s.color}44;">
                <i class="${s.icon}" style="color:${s.color}"></i>
                <h3>${s.name}</h3>
                <p>Поиск по OEM-номеру, оригиналы и аналоги.<br><small style="opacity:0.6">${s.network}</small></p>
                <a href="${exampleUrl}" target="_blank" rel="noopener" class="partner-link" style="border-color:${s.color};color:${s.color}">
                    <i class="${s.icon}"></i> Перейти в ${s.name} <span class="ad-label">Реклама</span>
                </a>
            </div>
        `;
    }).join('');
}

function updateClickCount() {
    const el = document.getElementById('clickCount');
    if (el) {
        const count = getTotalClicks();
        el.textContent = count;
        el.style.transition = 'all 0.3s';
        el.style.transform = 'scale(1.3)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);
    }
}

function formatResultCount(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'деталь';
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'детали';
    return 'деталей';
}

function clearSearch() {
    document.getElementById('heroSearch').value = '';
    document.getElementById('searchClear').classList.remove('visible');
    document.getElementById('heroSearch').focus();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav() {
    const sections = ['catalog', 'consultant', 'partners'];
    const links = document.querySelectorAll('.nav-list a');
    let current = '';

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) current = id;
        }
    });

    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    });
}

function initSectionReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.catalog, .consultant, .partners, .about').forEach(el => {
        el.classList.add('section-reveal');
        observer.observe(el);
    });
}

let autocompleteIndex = -1;

function initAutocomplete() {
    const input = document.getElementById('heroSearch');
    const container = document.createElement('div');
    container.className = 'autocomplete-suggestions';
    container.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--white);border:2px solid var(--border);border-top:none;border-radius:0 0 var(--radius) var(--radius);max-height:260px;overflow-y:auto;z-index:100;display:none;box-shadow:var(--shadow-lg);';
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(container);

    input.addEventListener('input', () => {
        document.getElementById('searchClear').classList.toggle('visible', input.value.length > 0);
        const val = input.value.trim().toLowerCase();
        if (val.length < 2) { container.style.display = 'none'; return; }

        const matches = PARTS_DB
            .filter(p => p.name.toLowerCase().includes(val) || p.oem.toLowerCase().includes(val))
            .slice(0, 8);

        if (matches.length === 0) { container.style.display = 'none'; return; }

        container.innerHTML = matches.map((p, i) =>
            `<div class="suggestion-item" data-index="${i}" style="padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;transition:background 0.15s;">
                <span><strong>${p.name}</strong> <span style="color:var(--gray);font-size:0.8rem;">${p.make} ${p.model}</span></span>
                <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:0.8rem;font-weight:700;color:var(--primary);">${p.oem}</code>
            </div>`
        ).join('');
        container.style.display = 'block';
        autocompleteIndex = -1;

        container.querySelectorAll('.suggestion-item').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const idx = parseInt(el.dataset.index);
                const p = matches[idx];
                input.value = p.name;
                container.style.display = 'none';
                searchParts();
            });
            el.addEventListener('mouseenter', () => {
                el.style.background = 'var(--light)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.background = '';
            });
        });
    });

    input.addEventListener('keydown', (e) => {
        const items = container.querySelectorAll('.suggestion-item');
        if (!items.length || container.style.display === 'none') {
            if (e.key === 'Enter') searchParts();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            autocompleteIndex = Math.min(autocompleteIndex + 1, items.length - 1);
            updateAutocompleteHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            autocompleteIndex = Math.max(autocompleteIndex - 1, -1);
            updateAutocompleteHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (autocompleteIndex >= 0) {
                items[autocompleteIndex].click();
            } else {
                searchParts();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!input.parentElement.contains(e.target)) {
            container.style.display = 'none';
        }
    });
}

function updateAutocompleteHighlight(items) {
    items.forEach((el, i) => {
        el.style.background = i === autocompleteIndex ? 'var(--light)' : '';
    });
}
