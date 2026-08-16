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

    function initViews() {
        const wrapEl = document.getElementById('articleViewsWrap');
        const countEl = document.getElementById('articleViewsCount');
        const wordEl = document.getElementById('articleViewsWord');
        if (!wrapEl || !countEl) return;

        const path = window.location.pathname;
        const articleKey = path.split('/').pop().replace('.html', '') || 'main';
        const storageKey = 'avtotema_views_' + articleKey;
        const sessionKey = 'avtotema_view_hit_' + articleKey;

        // 1. Получаем реальное число просмотров (старт с 1)
        let localViews = parseInt(localStorage.getItem(storageKey), 10) || 0;

        // Учитываем уникальный просмотр в текущей сессии
        const hasSessionHit = sessionStorage.getItem(sessionKey) === '1';
        if (!hasSessionHit) {
            localViews = localViews + 1;
            sessionStorage.setItem(sessionKey, '1');
            localStorage.setItem(storageKey, localViews);
        } else if (localViews === 0) {
            localViews = 1;
            localStorage.setItem(storageKey, 1);
        }

        // Мгновенно отображаем актуальное значение
        countEl.textContent = localViews;
        if (wordEl) wordEl.textContent = getPluralViews(localViews);
        wrapEl.style.opacity = '1';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViews);
    } else {
        initViews();
    }
})();
