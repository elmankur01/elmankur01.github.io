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
    renderCatalog(currentFilteredParts);

    // Init partners
    renderPartners();
    updateClickCount();

    // Chat init
    initChat();

    // Hero search
    document.getElementById('heroSearch').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') searchParts();
    });
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

    if (parts.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

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
                ${getStoreLinks(p.oem).map(s => `
                    <a href="${s.fullUrl}" target="_blank" rel="noopener" class="store-btn" style="--store-color:${s.color}" onclick="trackClick('${s.name}','${p.oem}')">
                        <i class="${s.icon}"></i> ${s.name} <span class="ad-label">Реклама</span>
                    </a>
                `).join('')}
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

function initChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    addBotMessage('Здравствуйте! Я ИИ-консультант по подбору автозапчастей. Назовите марку и модель вашего автомобиля (например, <strong>Toyota Camry</strong>), чтобы я помог найти нужную деталь.');
    addQuickReplies(['Toyota Camry', 'BMW 3 Series', 'Mercedes C-Class', 'Hyundai Sonata']);
    chatState = 'awaiting_car';
}

function toggleChat() {
    const panel = document.getElementById('chatPanel');
    const toggle = document.getElementById('chatToggle');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
        document.getElementById('chatInput').focus();
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
    processMessage(msg);
}

function addUserMessage(text) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-user"></i></div>
        <div class="msg-content">${text}</div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addBotMessage(text, actions = false) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    let html = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content">${text}</div>
    `;
    div.innerHTML = html;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addQuickReplies(replies) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content">
            <div class="quick-replies">
                ${replies.map(r => `<button class="quick-reply" onclick="sendMessage('${r}')">${r}</button>`).join('')}
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
                <div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;">
                    <strong style="color:var(--secondary);font-size:0.9rem;">${p.name}</strong><br>
                    <span style="font-size:0.75rem;color:var(--accent);">${p.category} · ${p.brand}</span><br>
                    <code style="display:inline-block;background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:0.85rem;font-weight:700;color:var(--primary);margin:4px 0;user-select:all;">${p.oem}</code><br>
                    <span style="font-size:0.8rem;color:${p.inStock ? '#2d6a4f' : '#e07c00'};">
                        ${p.inStock ? '✓ В наличии' : '⏳ Под заказ'}
                    </span>
                    ${p.note ? '<br><em style="font-size:0.75rem;color:var(--gray);">' + p.note + '</em>' : ''}
                    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;">
                        ${getStoreLinks(p.oem).map(s => `
                            <a href="${s.fullUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;background:${s.color};color:white;padding:4px 10px;border-radius:6px;font-size:0.75rem;text-decoration:none;" onclick="trackClick('${s.name}','${p.oem}')">
                                <i class="${s.icon}"></i> ${s.name} <span class="ad-label" style="background:rgba(255,255,255,0.25);font-size:0.6rem;padding:1px 5px;border-radius:3px;">Реклама</span>
                            </a>
                        `).join('')}
                    </div>
                    <br><button class="quick-reply" onclick="copyFromChat('${p.oem}', this)" style="font-size:0.75rem;padding:3px 10px;margin-top:4px;">📋 Копировать ${p.oem}</button>
                </div>
            `).join('')}
            <div style="margin-top:6px;font-size:0.8rem;color:var(--gray);">
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

function processMessage(msg) {
    switch (chatState) {
        case 'awaiting_car':
            handleCarInfo(msg);
            break;
        case 'awaiting_part':
            handlePartSearch(msg);
            break;
        case 'awaiting_details':
            handleDetails(msg);
            break;
        default:
            initChat();
    }
}

function handleCarInfo(msg) {
    const carMatch = msg.match(/(\w+)\s+(\w[\w\s-]*?)(?:\s+(\d{4}))?(?:\s+(\d[\d.]*\s*\w+))?/i);
    if (carMatch) {
        carContext.make = carMatch[1];
        carContext.model = carMatch[2].trim();
        carContext.year = carMatch[3] || '';
        carContext.engine = carMatch[4] || '';

        addBotMessage(`Отлично! ${carContext.make} ${carContext.model}${carContext.year ? ' ' + carContext.year : ''}${carContext.engine ? ', ' + carContext.engine : ''}. Какая деталь или категория вас интересует? (например: <strong>тормозные колодки</strong>, <strong>масляный фильтр</strong>, <strong>подвеска</strong>)`);
        addQuickReplies(['Тормозные колодки', 'Масляный фильтр', 'Воздушный фильтр', 'Амортизаторы', 'Свечи зажигания']);
        chatState = 'awaiting_part';
    } else {
        addBotMessage('Пожалуйста, укажите марку и модель автомобиля. Например: <strong>Toyota Camry 2018 2.5 бензин</strong>');
    }
}

function handlePartSearch(msg) {
    const parts = findPartsForCar(carContext.make, carContext.model, carContext.year, carContext.engine, msg);

    if (parts.length === 0) {
        addBotMessage(`К сожалению, не удалось найти детали "${msg}" для ${carContext.make} ${carContext.model} в нашей базе. Попробуйте уточнить название: <strong>колодки</strong>, <strong>фильтр</strong>, <strong>амортизатор</strong>. Либо проверьте по VIN-коду для точного подбора.`);
        addQuickReplies(['Колодки тормозные', 'Масляный фильтр', 'Воздушный фильтр', 'Амортизаторы', 'Свечи']);
        return;
    }

    const header = carContext.year ? `${carContext.make} ${carContext.model}, ${carContext.year}` : `${carContext.make} ${carContext.model}`;
    const engineInfo = carContext.engine ? `, ${carContext.engine}` : '';

    let response = `📋 <strong>Результаты поиска для ${header}${engineInfo}:</strong><br><br>`;
    addBotMessage(response);

    addResultCard(parts);

    addBotMessage('Рекомендуется проверить совместимость по VIN-коду перед заказом. Если деталь не та — напишите "ещё" для уточнения.');
    addQuickReplies(['Найти ещё деталь', 'Проверить по VIN', '✅ Спасибо!']);
    chatState = 'awaiting_details';
}

function handleDetails(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('ещё') || lower.includes('друг') || lower.includes('искать')) {
        addBotMessage('Какая деталь вас интересует? Например: <strong>тормозные диски</strong>, <strong>салонный фильтр</strong>, <strong>сайлентблоки</strong>.');
        chatState = 'awaiting_part';
    } else if (lower.includes('vin') || lower.includes('vin') || lower.includes('провер')) {
        addBotMessage('Для проверки по VIN введите VIN-код вашего автомобиля. Обычно он находится в ПТС или на кузове под капотом.');
        chatState = 'awaiting_vin';
    } else if (lower.includes('спас') || lower.includes('благодар')) {
        addBotMessage('Рад был помочь! Скопируйте артикул и вставьте его в поле поиска на сайте для оформления заказа. Если понадобится ещё что-то — просто напишите! 🚗');
        setTimeout(() => {
            addQuickReplies(['Найти новую деталь']);
            chatState = 'awaiting_car';
        }, 1000);
    } else {
        addBotMessage('Не совсем понял. Если хотите найти другую деталь — напишите "ещё". Если всё устраивает — "спасибо".');
    }
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
            exampleUrl = s.type === 'mylead'
                ? `https://mylead.global/go/${s.campaignId}/?url=${encodeURIComponent(directUrl)}`
                : `https://ad.admitad.com/g/${s.campaignId}/?ulp=${encodeURIComponent(directUrl)}`;
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
        // Animate increment
        el.style.transition = 'all 0.3s';
        el.style.transform = 'scale(1.3)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);
    }
}
