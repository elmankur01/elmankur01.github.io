// ==========================================
// АвтоТема — Модуль озвучки статей (Web Speech API)
// ==========================================
(function () {
    let utterance = null;
    let isSpeaking = false;
    let isPaused = false;

    function initSpeech() {
        const btn = document.getElementById('readAloudBtn');
        if (!btn) return;

        if (!('speechSynthesis' in window)) {
            btn.style.display = 'none';
            return;
        }

        const titleEl = document.querySelector('.article-full h1');
        const bodyEl = document.querySelector('.article-body');
        if (!bodyEl) return;

        // Формируем чистый текст статьи без спецсимволов и разметки
        const cleanText = (titleEl ? titleEl.textContent.trim() + '. ' : '') + 
            Array.from(bodyEl.querySelectorAll('p')).map(p => p.textContent.trim()).join(' ');

        btn.addEventListener('click', function () {
            if (isSpeaking && !isPaused) {
                // Ставим на паузу
                window.speechSynthesis.pause();
                isPaused = true;
                btn.setAttribute('data-state', 'paused');
                const icon = btn.querySelector('.read-icon');
                const label = btn.querySelector('.read-label');
                if (icon) icon.textContent = '▶️';
                if (label) label.textContent = 'Продолжить';
            } else if (isSpeaking && isPaused) {
                // Возобновляем воспроизведение
                window.speechSynthesis.resume();
                isPaused = false;
                btn.setAttribute('data-state', 'playing');
                const icon = btn.querySelector('.read-icon');
                const label = btn.querySelector('.read-label');
                if (icon) icon.textContent = '⏸️';
                if (label) label.textContent = 'Пауза';
            } else {
                // Запускаем озвучку с начала
                window.speechSynthesis.cancel();
                utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'ru-RU';
                utterance.rate = 1.0;
                utterance.pitch = 1.0;

                // Подбираем русский голос
                const voices = window.speechSynthesis.getVoices();
                const ruVoice = voices.find(v => v.lang && (v.lang.startsWith('ru') || v.lang.startsWith('RU')));
                if (ruVoice) utterance.voice = ruVoice;

                utterance.onstart = () => {
                    isSpeaking = true;
                    isPaused = false;
                    btn.setAttribute('data-state', 'playing');
                    const icon = btn.querySelector('.read-icon');
                    const label = btn.querySelector('.read-label');
                    if (icon) icon.textContent = '⏸️';
                    if (label) label.textContent = 'Пауза';
                };

                utterance.onend = () => {
                    resetSpeechUI();
                };

                utterance.onerror = () => {
                    resetSpeechUI();
                };

                window.speechSynthesis.speak(utterance);
            }
        });

        function resetSpeechUI() {
            isSpeaking = false;
            isPaused = false;
            btn.setAttribute('data-state', 'idle');
            const icon = btn.querySelector('.read-icon');
            const label = btn.querySelector('.read-label');
            if (icon) icon.textContent = '🔊';
            if (label) label.textContent = 'Слушать';
        }

        // Остановка озвучки при закрытии страницы или переходе
        window.addEventListener('beforeunload', () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpeech);
    } else {
        initSpeech();
    }
})();
