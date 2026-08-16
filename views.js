// ==========================================
// АвтоТема — Модуль реальных просмотров статей (100% органический учёт)
// ==========================================
(function () {
    function getPluralViews(count) {
        const n = Math.abs(count) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return 'просмотров';
        if (n1 > 1 && n1 < 5) return 'просмотра';
        if (n1 === 1) return 'просмотр';
        return 'просмотров';
    }

    async function initViews() {
        const wrapEl = document.getElementById('articleViewsWrap');
        const countEl = document.getElementById('articleViewsCount');
        const wordEl = document.getElementById('articleViewsWord');
        if (!wrapEl || !countEl) return;

        const path = window.location.pathname;
        const articleKey = path.split('/').pop().replace('.html', '') || 'main';
        const storageKey = 'avtotema_views_' + articleKey;
        const sessionKey = 'avtotema_view_hit_' + articleKey;

        // 1. Получаем реальное локальное число просмотров (старт с 1)
        let localViews = parseInt(localStorage.getItem(storageKey), 10) || 1;

        // Учитываем уникальный просмотр в текущей сессии
        const hasSessionHit = sessionStorage.getItem(sessionKey) === '1';
        if (!hasSessionHit) {
            localViews = (localStorage.getItem(storageKey) === null) ? 1 : (localViews + 1);
            sessionStorage.setItem(sessionKey, '1');
            localStorage.setItem(storageKey, localViews);
        }

        // Мгновенно отображаем текущее значение
        countEl.textContent = localViews;
        if (wordEl) wordEl.textContent = getPluralViews(localViews);
        wrapEl.style.opacity = '1';

        // 2. Синхронизация с глобальным сервером подсчёта реальных посетителей
        try {
            const apiNamespace = 'avtotema_online';
            const apiKey = 'art_' + articleKey.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 32);
            const endpoint = !hasSessionHit
                ? `https://api.counterapi.dev/v1/${apiNamespace}/${apiKey}/up`
                : `https://api.counterapi.dev/v1/${apiNamespace}/${apiKey}`;

            const res = await fetch(endpoint, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data.count === 'number' && data.count > 0) {
                    const finalCount = Math.max(data.count, localViews);
                    countEl.textContent = finalCount;
                    if (wordEl) wordEl.textContent = getPluralViews(finalCount);
                    localStorage.setItem(storageKey, finalCount);
                }
            }
        } catch (e) {
            // При отсутствии интернета локальный счётчик работает автономно
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViews);
    } else {
        initViews();
    }
})();
