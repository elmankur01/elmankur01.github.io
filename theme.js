// ==========================================
// АвтоТема — переключатель темы (тёмная / светлая)
// Приоритет: явный выбор пользователя → системная тема → тёмная по умолчанию
// ==========================================
(function () {
    const THEME_KEY = 'avtotema_theme';

    function getPreferredTheme() {
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored === 'light' || stored === 'dark') return stored;
        } catch (e) {}
        // Явного выбора нет — следуем за системной темой устройства
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        // По умолчанию тёмная автомобильная тема
        return 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateToggleButtons(theme);
    }

    function updateToggleButtons(theme) {
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const darkIcon = btn.querySelector('.theme-icon-dark');
            const lightIcon = btn.querySelector('.theme-icon-light');
            if (darkIcon && lightIcon) {
                if (theme === 'light') {
                    darkIcon.hidden = true;
                    lightIcon.hidden = false;
                    btn.title = 'Переключить на тёмную тему';
                } else {
                    darkIcon.hidden = false;
                    lightIcon.hidden = true;
                    btn.title = 'Переключить на светлую тему';
                }
            }
        });
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        applyTheme(next);
    }

    // Делегирование клика
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.theme-toggle-btn');
        if (btn) {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Пока пользователь не сделал явный выбор — тема следует за системой
    if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const onSystemChange = function () {
            let stored = null;
            try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
            if (!stored) applyTheme(getPreferredTheme());
        };
        if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
        else if (mq.addListener) mq.addListener(onSystemChange);
    }

    // Инициализация при загрузке
    const initTheme = getPreferredTheme();
    applyTheme(initTheme);

    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;

    // Service Worker: офлайн-чтение и кэш статики (только https)
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
    }
})();
