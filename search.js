// ==========================================
// АвтоТема — Мгновенный клиентский Живой Поиск (search.js)
// ==========================================

(function () {
    let searchData = [];
    let isDataLoaded = false;
    let isOpen = false;
    let selectedIndex = -1;

    // Вспомогательная очистка и нормализация текста для поиска
    function normalize(str) {
        return String(str || '')
            .toLowerCase()
            .replace(/ё/g, 'е')
            .replace(/[^a-zа-я0-9\s]/gi, ' ')
            .trim();
    }

    // Подсветка совпадений в тексте
    function highlight(text, query) {
        if (!query || !text) return text || '';
        const qNorm = query.toLowerCase().replace(/ё/g, 'е').trim();
        const words = qNorm.split(/\s+/).filter(w => w.length > 1);
        if (!words.length) return text;

        const pattern = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
        return String(text).replace(pattern, '<mark class="search-highlight">$1</mark>');
    }

    // Загрузка поисковых данных (из памяти или search_index.json)
    async function loadIndex() {
        if (isDataLoaded && searchData.length > 0) return searchData;

        // Если в странице уже подключен ARTICLE_BANK из script.js
        if (typeof ARTICLE_BANK !== 'undefined' && Array.isArray(ARTICLE_BANK) && ARTICLE_BANK.length > 0) {
            const slugsObj = typeof SLUGS !== 'undefined' ? SLUGS : {};
            const imgsObj = typeof IMAGES !== 'undefined' ? IMAGES : {};

            searchData = ARTICLE_BANK.map((a, idx) => {
                const id = idx + 1;
                const slug = slugsObj[id] || ('article-' + id);
                const img = imgsObj[id] || null;
                return {
                    id,
                    title: a.title,
                    tag: a.tag || 'Автоновости',
                    text: a.text || '',
                    readTime: a.readTime || 5,
                    url: '/articles/' + slug + '.html',
                    image: img ? img.url : null
                };
            });
            isDataLoaded = true;
            return searchData;
        }

        // Фоллбек: загрузка компактного search_index.json
        try {
            const res = await fetch('/search_index.json');
            if (res.ok) {
                searchData = await res.json();
                isDataLoaded = true;
                return searchData;
            }
        } catch (e) {}

        return [];
    }

    // Поиск по ключевым словам и рубрике
    function performSearch(query, activeTag) {
        if (!searchData || !searchData.length) return [];
        const q = normalize(query);
        const qWords = q.split(/\s+/).filter(w => w.length > 1);

        return searchData.filter(item => {
            if (activeTag && activeTag !== 'Все' && item.tag !== activeTag) {
                return false;
            }
            if (!q) return true; // При пустом запросе отдаём статьи выбранного тега

            const titleNorm = normalize(item.title);
            const textNorm = normalize(item.text);
            const tagNorm = normalize(item.tag);

            // Все введённые слова должны присутствовать в статье
            return qWords.every(w => titleNorm.includes(w) || textNorm.includes(w) || tagNorm.includes(w));
        }).slice(0, 15); // Топ-15 релевантных совпадений
    }

    // Создание DOM модального окна поиска
    function injectModal() {
        if (document.getElementById('siteSearchBackdrop')) return;

        const modalHtml = `
        <div class="site-search-backdrop" id="siteSearchBackdrop" role="dialog" aria-modal="true" aria-label="Поиск по статьям" hidden>
            <div class="site-search-modal" id="siteSearchModal">
                <div class="site-search-header">
                    <span class="search-input-icon">🔍</span>
                    <input type="search" class="site-search-input" id="siteSearchInput" placeholder="Поиск по статьям, маркам и темам…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                    <button type="button" class="site-search-clear" id="siteSearchClear" aria-label="Очистить" hidden>&times;</button>
                    <button type="button" class="site-search-close" id="siteSearchClose" aria-label="Закрыть">ESC</button>
                </div>

                <div class="site-search-tags" id="siteSearchTags">
                    <button type="button" class="search-tag-chip active" data-tag="Все">Все темы</button>
                    <button type="button" class="search-tag-chip" data-tag="Электромобили">⚡ Электро</button>
                    <button type="button" class="search-tag-chip" data-tag="Новые модели">🚗 Модели</button>
                    <button type="button" class="search-tag-chip" data-tag="Двигатели">🔧 Двигатели</button>
                    <button type="button" class="search-tag-chip" data-tag="Мировые новости">🌍 Мир</button>
                    <button type="button" class="search-tag-chip" data-tag="Новости рынка">📊 Рынок</button>
                    <button type="button" class="search-tag-chip" data-tag="Авто лайфхаки">💡 Лайфхаки</button>
                </div>

                <div class="site-search-body" id="siteSearchBody">
                    <div class="search-suggestions" id="searchSuggestions">
                        <div class="search-suggestions-title">🔥 Популярные темы для поиска:</div>
                        <div class="search-suggestions-pills">
                            <span class="search-pill" data-query="Lada Iskra">Lada Iskra</span>
                            <span class="search-pill" data-query="Твердотельные батареи">Твёрдотельные батареи</span>
                            <span class="search-pill" data-query="Вариатор">Вариатор или АКПП</span>
                            <span class="search-pill" data-query="Geely Monjaro">Geely Monjaro</span>
                            <span class="search-pill" data-query="Утильсбор">Утильсбор 2026</span>
                            <span class="search-pill" data-query="Li Auto">Li Auto</span>
                            <span class="search-pill" data-query="Ремень ГРМ">Ремень ГРМ</span>
                        </div>
                    </div>
                    <div class="site-search-results" id="siteSearchResults" hidden></div>
                </div>

                <div class="site-search-footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> навигация</span>
                    <span><kbd>↵</kbd> открыть</span>
                    <span><kbd>ESC</kbd> закрыть</span>
                </div>
            </div>
        </div>`;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHtml;
        document.body.appendChild(wrapper.firstElementChild);
    }

    // Рендер результатов поиска
    function renderResults(results, query) {
        const bodyEl = document.getElementById('siteSearchBody');
        const resultsEl = document.getElementById('siteSearchResults');
        const suggestionsEl = document.getElementById('searchSuggestions');
        if (!resultsEl || !suggestionsEl) return;

        selectedIndex = -1;

        if (!query.trim() && (!results || results.length === 0)) {
            suggestionsEl.hidden = false;
            resultsEl.hidden = true;
            return;
        }

        suggestionsEl.hidden = true;
        resultsEl.hidden = false;

        if (!results || results.length === 0) {
            resultsEl.innerHTML = `
                <div class="search-empty-state">
                    <span class="search-empty-icon">🚗💨</span>
                    <h4>Ничего не найдено по запросу «${escapeHtml(query)}»</h4>
                    <p>Попробуйте поискать по марке машины (напр. <i>Geely, Lada, Porsche</i>), типу мотора или теме (<i>акпп, батареи, гибрид</i>).</p>
                </div>`;
            return;
        }

        const tagIcons = {
            'Новые модели': '🚗',
            'Электромобили': '⚡',
            'Двигатели': '🔧',
            'История марок': '🏛️',
            'Мировые новости': '🌍',
            'Новости рынка': '📊',
            'Авто лайфхаки': '💡'
        };

        const countHeader = `<div class="search-results-count">Найдено материалов: <b>${results.length}</b></div>`;

        const itemsHtml = results.map((item, idx) => {
            const icon = tagIcons[item.tag] || '🚗';
            const media = item.image
                ? `<div class="search-item-thumb"><img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy"></div>`
                : `<div class="search-item-thumb search-thumb-placeholder">${icon}</div>`;

            const highlightedTitle = highlight(escapeHtml(item.title), query);
            const highlightedText = highlight(escapeHtml(item.text), query);

            return `
            <a href="${item.url}" class="search-result-item" data-index="${idx}">
                ${media}
                <div class="search-item-content">
                    <div class="search-item-meta">
                        <span class="search-item-tag">${icon} ${escapeHtml(item.tag)}</span>
                        <span class="search-item-time">⏱️ ${item.readTime} мин</span>
                    </div>
                    <div class="search-item-title">${highlightedTitle}</div>
                    <div class="search-item-desc">${highlightedText}</div>
                </div>
                <span class="search-item-arrow">→</span>
            </a>`;
        }).join('');

        resultsEl.innerHTML = countHeader + itemsHtml;
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Открытие модального окна
    async function openSearch(defaultQuery) {
        injectModal();
        const backdrop = document.getElementById('siteSearchBackdrop');
        const input = document.getElementById('siteSearchInput');
        if (!backdrop || !input) return;

        backdrop.hidden = false;
        document.body.style.overflow = 'hidden';
        isOpen = true;

        await loadIndex();

        if (typeof defaultQuery === 'string') {
            input.value = defaultQuery;
            document.getElementById('siteSearchClear').hidden = !defaultQuery;
            const activeTagBtn = document.querySelector('.search-tag-chip.active');
            const activeTag = activeTagBtn ? activeTagBtn.dataset.tag : 'Все';
            renderResults(performSearch(defaultQuery, activeTag), defaultQuery);
        } else {
            input.value = '';
            document.getElementById('siteSearchClear').hidden = true;
            renderResults([], '');
        }

        setTimeout(() => input.focus(), 50);
    }

    // Закрытие модального окна
    function closeSearch() {
        const backdrop = document.getElementById('siteSearchBackdrop');
        if (!backdrop) return;
        backdrop.hidden = true;
        document.body.style.overflow = '';
        isOpen = false;
        selectedIndex = -1;
    }

    // Навигация клавишами вверх/вниз
    function handleKeyNav(e) {
        const items = document.querySelectorAll('.search-result-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateItemSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateItemSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
            e.preventDefault();
            items[selectedIndex].click();
        }
    }

    function updateItemSelection(items) {
        items.forEach((item, idx) => {
            if (idx === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Инициализация событий
    function init() {
        injectModal();

        // Делегирование клика по кнопкам открытия поиска
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.site-search-open, #siteSearchOpenBtn, .search-nav-btn');
            if (btn) {
                e.preventDefault();
                openSearch();
                return;
            }

            // Клик по подсказкам (пиллам)
            const pill = e.target.closest('.search-pill');
            if (pill && pill.dataset.query) {
                const q = pill.dataset.query;
                const input = document.getElementById('siteSearchInput');
                if (input) input.value = q;
                const activeTagBtn = document.querySelector('.search-tag-chip.active');
                const activeTag = activeTagBtn ? activeTagBtn.dataset.tag : 'Все';
                renderResults(performSearch(q, activeTag), q);
                document.getElementById('siteSearchClear').hidden = false;
                return;
            }

            // Клик по чипам категорий
            const chip = e.target.closest('.search-tag-chip');
            if (chip && chip.dataset.tag) {
                document.querySelectorAll('.search-tag-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const input = document.getElementById('siteSearchInput');
                const q = input ? input.value : '';
                renderResults(performSearch(q, chip.dataset.tag), q);
                return;
            }

            // Клик по кнопке очистки
            if (e.target.closest('#siteSearchClear')) {
                const input = document.getElementById('siteSearchInput');
                if (input) {
                    input.value = '';
                    input.focus();
                }
                e.target.closest('#siteSearchClear').hidden = true;
                const activeTagBtn = document.querySelector('.search-tag-chip.active');
                const activeTag = activeTagBtn ? activeTagBtn.dataset.tag : 'Все';
                renderResults(performSearch('', activeTag), '');
                return;
            }

            // Клик по закрытию
            if (e.target.closest('#siteSearchClose')) {
                closeSearch();
                return;
            }

            // Клик вне модального окна (по бэкдропу)
            const backdrop = document.getElementById('siteSearchBackdrop');
            if (isOpen && e.target === backdrop) {
                closeSearch();
            }
        });

        // Ввод в поисковую строку
        document.addEventListener('input', (e) => {
            if (e.target && e.target.id === 'siteSearchInput') {
                const q = e.target.value;
                const clearBtn = document.getElementById('siteSearchClear');
                if (clearBtn) clearBtn.hidden = !q;

                const activeTagBtn = document.querySelector('.search-tag-chip.active');
                const activeTag = activeTagBtn ? activeTagBtn.dataset.tag : 'Все';
                renderResults(performSearch(q, activeTag), q);
            }
        });

        // Горячие клавиши (Cmd+K / Ctrl+K, '/', ESC, навигация стрелками)
        document.addEventListener('keydown', (e) => {
            // Закрытие по ESC
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                closeSearch();
                return;
            }

            // Открытие по Cmd+K или Ctrl+K
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'л' || e.key === 'K')) {
                e.preventDefault();
                if (isOpen) closeSearch();
                else openSearch();
                return;
            }

            // Открытие по '/' если фокус не в инпуте
            if (e.key === '/' && !isOpen) {
                const tag = (document.activeElement && document.activeElement.tagName) || '';
                if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
                    e.preventDefault();
                    openSearch();
                    return;
                }
            }

            // Навигация стрелками внутри поиска
            if (isOpen) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                    handleKeyNav(e);
                }
            }
        });

        // Авто-добавление кнопки поиска в шапку (.header-actions), если её там ещё нет
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && !headerActions.querySelector('.search-nav-btn')) {
            const searchBtn = document.createElement('button');
            searchBtn.type = 'button';
            searchBtn.className = 'search-nav-btn site-search-open';
            searchBtn.setAttribute('aria-label', 'Поиск по сайту');
            searchBtn.title = 'Поиск по сайту (Ctrl+K / /)';
            searchBtn.innerHTML = `
                <span class="search-nav-icon">🔍</span>
                <span class="search-nav-label">Поиск</span>
                <kbd class="search-nav-kbd">⌘K</kbd>`;
            headerActions.insertBefore(searchBtn, headerActions.firstChild);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Экспорт в глобальную область
    window.SiteSearch = { open: openSearch, close: closeSearch };
})();
