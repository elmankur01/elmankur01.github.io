// ==========================================
// АвтоТема — переключатель темы (тёмная / светлая)
// ==========================================
(function () {
    const THEME_KEY = 'avtotema_theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
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
        localStorage.setItem(THEME_KEY, next);
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

    // Инициализация при загрузке
    const initTheme = getPreferredTheme();
    applyTheme(initTheme);

    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;
})();
