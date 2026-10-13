// ==========================================
// АвтоТема — Модуль органического отображения просмотров статей
// 100% безопасный клиентский алгоритм без сбора персональных данных (152-ФЗ)
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

    // Детерминированный хеш от слага статьи для стабильного базового охвата
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    }

    function initViews() {
        const wrapEl = document.getElementById('articleViewsWrap');
        const countEl = document.getElementById('articleViewsCount');
        const wordEl = document.getElementById('articleViewsWord');
        if (!wrapEl || !countEl) return;

        const path = window.location.pathname;
        const articleKey = path.split('/').pop().replace('.html', '') || 'main';
        const storageKey = 'avtotema_views_' + articleKey;
        const sessionKey = 'avtotema_view_hit_' + articleKey;

        // 1. Стабильный базовый охват статьи (380 - 1280 просмотров)
        const slugHash = hashString(articleKey);
        const baseViews = 380 + (slugHash % 890);

        // 2. Локальный органический прирост для читателя
        let userHits = parseInt(localStorage.getItem(storageKey), 10) || 0;
        const hasSessionHit = sessionStorage.getItem(sessionKey) === '1';

        if (!hasSessionHit) {
            userHits += 1;
            sessionStorage.setItem(sessionKey, '1');
            localStorage.setItem(storageKey, userHits);
        } else if (userHits === 0) {
            userHits = 1;
            localStorage.setItem(storageKey, 1);
        }

        const totalViews = baseViews + userHits;

        // Отображаем красивое форматированное значение
        countEl.textContent = totalViews.toLocaleString('ru-RU');
        if (wordEl) wordEl.textContent = getPluralViews(totalViews);
        wrapEl.style.opacity = '1';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViews);
    } else {
        initViews();
    }
})();
