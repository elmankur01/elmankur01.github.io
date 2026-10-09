// ===== Telegram Web App (Mini App) Integration =====
// Поддержка запуска портала «АвтоТема» внутри Telegram в качестве Mini App

(function () {
    'use strict';

    // Глобальная функция нативной тактильной отдачи
    window.tgHaptic = function (type) {
        try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
                const style = type || 'light';
                if (style === 'success' || style === 'warning' || style === 'error') {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred(style);
                } else {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
                }
            }
        } catch (e) {}
    };

    function initTelegramWebApp() {
        if (!window.Telegram || !window.Telegram.WebApp) return;
        const tg = window.Telegram.WebApp;

        // Сообщаем Telegram о готовности
        try {
            tg.ready();
            tg.expand();
        } catch (e) {}

        // Устанавливаем цвета интерфейса Telegram под темную тему АвтоТемы
        try {
            if (tg.setHeaderColor) tg.setHeaderColor('#0b0f14');
            if (tg.setBackgroundColor) tg.setBackgroundColor('#0b0f14');
        } catch (e) {}

        document.documentElement.classList.add('is-telegram-webapp');
        document.body.classList.add('is-telegram-webapp');

        // Управление нативной кнопкой «Назад» в Telegram
        if (tg.BackButton) {
            const isRoot = window.location.pathname === '/' || window.location.pathname === '/index.html';
            if (!isRoot && window.history.length > 1) {
                tg.BackButton.show();
                tg.BackButton.onClick(function () {
                    window.tgHaptic('light');
                    window.history.back();
                });
            } else {
                tg.BackButton.hide();
            }
        }

        // Синхронизация темы (если пользователь в светлой теме Telegram)
        if (tg.colorScheme === 'light' && !localStorage.getItem('avtotema_theme')) {
            document.documentElement.setAttribute('data-theme', 'light');
        }

        // Добавляем тактильную отдачу на клики по интерактивным элементам
        document.addEventListener('click', function (e) {
            const target = e.target.closest('button, .btn, .calc-car-preset-pill, .tco-preset-pill, .tag-btn, .like-btn, .bookmark-btn, .advisor-choice-btn');
            if (target) {
                window.tgHaptic('light');
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegramWebApp);
    } else {
        initTelegramWebApp();
    }
})();
