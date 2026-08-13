// ===== Общий скрипт для страниц сайта АвтоТема =====
document.addEventListener('DOMContentLoaded', function () {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initAudioReader();
    initFontSizeControls();
    initReadingProgress();
    initCopyButton();
    registerServiceWorker();
});

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

// 4. Кнопка копирования ссылки
function initCopyButton() {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            copyBtn.textContent = 'Ссылка скопирована!';
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
            copyBtn.textContent = 'Ссылка скопирована!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = 'Скопировать ссылку';
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    });
}

// 5. PWA Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}
