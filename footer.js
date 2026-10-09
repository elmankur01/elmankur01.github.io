// ===== Общий скрипт для страниц сайта АвтоТема =====
document.addEventListener('DOMContentLoaded', function () {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initBurger();
    initAudioReader();
    initFontSizeControls();
    initReadingProgress();
    initCopyButton();
    registerServiceWorker();
    initTgWebApp();
});

// 0. Мобильное бургер-меню
function initBurger() {
    if (window.__burgerInitialized) return;
    window.__burgerInitialized = true;
    const burger = document.getElementById('burger') || document.querySelector('.burger');
    const nav = document.querySelector('.nav-list') || document.getElementById('navList');
    if (!burger || !nav) return;
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = burger.classList.toggle('active');
        nav.classList.toggle('active');
        burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !nav.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

// 1. Аудио-озвучка статьи (Web Speech API)
function initAudioReader() {
    const btn = document.getElementById('playAudioBtn');
    const textSpan = document.getElementById('playAudioText');
    const statusBox = document.getElementById('audioStatus');
    const stopBtn = document.getElementById('stopAudioBtn');
    const body = document.querySelector('.article-body');

    if (!btn || !body || !('speechSynthesis' in window)) {
        if (btn) btn.style.display = 'none';
        return;
    }

    let isPlaying = false;
    let utterance = null;

    btn.addEventListener('click', function () {
        if (isPlaying) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                btn.classList.add('playing');
                if (textSpan) textSpan.textContent = 'Пауза';
            } else {
                window.speechSynthesis.pause();
                btn.classList.remove('playing');
                if (textSpan) textSpan.textContent = 'Продолжить';
            }
        } else {
            const title = document.querySelector('h1') ? document.querySelector('h1').textContent : '';
            const paragraphs = Array.from(body.querySelectorAll('p')).map(p => p.textContent).join('. ');
            const fullText = title + '. ' + paragraphs;

            window.speechSynthesis.cancel();
            utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'ru-RU';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = function () {
                isPlaying = true;
                btn.classList.add('playing');
                if (statusBox) statusBox.hidden = false;
                if (textSpan) textSpan.textContent = 'Пауза';
            };

            utterance.onend = function () {
                isPlaying = false;
                btn.classList.remove('playing');
                if (statusBox) statusBox.hidden = true;
                if (textSpan) textSpan.textContent = 'Слушать статью';
            };

            utterance.onerror = function () {
                isPlaying = false;
                btn.classList.remove('playing');
                if (statusBox) statusBox.hidden = true;
                if (textSpan) textSpan.textContent = 'Слушать статью';
            };

            window.speechSynthesis.speak(utterance);
        }
    });

    if (stopBtn) {
        stopBtn.addEventListener('click', function () {
            window.speechSynthesis.cancel();
            isPlaying = false;
            btn.classList.remove('playing');
            if (statusBox) statusBox.hidden = true;
            if (textSpan) textSpan.textContent = 'Слушать статью';
        });
    }
}

// 2. Регулятор размера шрифта статьи
function initFontSizeControls() {
    const buttons = document.querySelectorAll('.font-btn');
    if (!buttons.length) return;

    const savedSize = localStorage.getItem('avtotema_font_size') || 'normal';
    applyFontSize(savedSize);

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const size = this.dataset.size;
            applyFontSize(size);
            localStorage.setItem('avtotema_font_size', size);
        });
    });

    function applyFontSize(size) {
        document.body.classList.remove('font-small', 'font-normal', 'font-large');
        document.body.classList.add('font-' + size);

        buttons.forEach(b => {
            if (b.dataset.size === size) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }
}

// 3. Индикатор прогресса чтения
function initReadingProgress() {
    const progress = document.querySelector('.reading-progress');
    if (!progress) return;

    const update = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? Math.max(0, Math.min(100, (scrollTop / docHeight) * 100)) : 0;
        progress.style.width = percent + '%';
    };

    window.addEventListener('scroll', update);
    update();
}

// 4. Кнопка копирования ссылки и нативный шеринг
function initCopyButton() {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
                copyBtn.textContent = '✓ Ссылка скопирована!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Скопировать ссылку';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                const ta = document.createElement('textarea');
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                copyBtn.textContent = '✓ Ссылка скопирована!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Скопировать ссылку';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }

    // Нативный шеринг (Web Share API)
    const nativeShareBtn = document.getElementById('nativeShareBtn');
    if (nativeShareBtn) {
        nativeShareBtn.addEventListener('click', async () => {
            const title = document.querySelector('h1')?.textContent || document.title;
            const text = document.querySelector('.article-body p')?.textContent?.slice(0, 160) || '';
            const url = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                } catch (e) {}
            } else {
                const shareBlock = document.querySelector('.share-block');
                if (shareBlock) {
                    shareBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    shareBlock.classList.add('highlight-pulse');
                    setTimeout(() => shareBlock.classList.remove('highlight-pulse'), 1500);
                }
            }
        });
    }
}

// 5. PWA Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

// 6. Telegram Web App (Mini App)
function initTgWebApp() {
    if (window.__tgWebAppLoaded) return;
    window.__tgWebAppLoaded = true;

    // Глобальный хелпер виброотклика (Haptic Feedback)
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

    function setupTG() {
        if (!window.Telegram || !window.Telegram.WebApp) return;
        const tg = window.Telegram.WebApp;
        try {
            tg.ready();
            tg.expand();
            if (tg.setHeaderColor) tg.setHeaderColor('#0b0f14');
            if (tg.setBackgroundColor) tg.setBackgroundColor('#0b0f14');
        } catch (e) {}

        document.documentElement.classList.add('is-telegram-webapp');

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

        document.addEventListener('click', function (e) {
            const target = e.target.closest('button, .btn, .calc-car-preset-pill, .tco-preset-pill, .tag-btn, .like-btn, .bookmark-btn, .advisor-choice-btn');
            if (target) window.tgHaptic('light');
        }, { passive: true });
    }

    if (window.Telegram && window.Telegram.WebApp) {
        setupTG();
    } else {
        const s = document.createElement('script');
        s.src = 'https://telegram.org/js/telegram-web-app.js';
        s.async = true;
        s.onload = setupTG;
        document.head.appendChild(s);
    }
}
