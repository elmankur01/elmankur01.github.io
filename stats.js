// Панель статистики Telegram-канала. Читает данные через Bot API.
(function () {
    const DEFAULT_CHAT = '-1004315542026';
    const CHANNEL_USERNAME = 'avtotema_news';
    const TOKEN_KEY = 'tg_stats_token';

    function getStored(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
    function setStored(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
    function removeStored(k) { try { window.localStorage.removeItem(k); } catch (e) {} }

    let token = getStored(TOKEN_KEY) || '';

    const tokenInput = document.getElementById('tokenInput');
    const saveTokenBtn = document.getElementById('saveTokenBtn');
    const clearTokenBtn = document.getElementById('clearTokenBtn');
    const tokenStatus = document.getElementById('tokenStatus');
    const chanTitle = document.getElementById('chanTitle');
    const chanLink = document.getElementById('chanLink');
    const chanCount = document.getElementById('chanCount');
    const botStatus = document.getElementById('botStatus');
    const updatedAt = document.getElementById('updatedAt');
    const refreshBtn = document.getElementById('refreshBtn');

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function setBadge(el, ok, text) {
        el.innerHTML = '<span class="badge ' + (ok ? 'ok' : 'err') + '">' + esc(text) + '</span>';
    }

    function requireKey() {
        setBadge(botStatus, false, 'Требуется ключ');
        chanTitle.textContent = '—';
        chanLink.textContent = '—';
        chanCount.textContent = '—';
        updatedAt.textContent = 'Введите ключ и нажмите «Сохранить ключ»';
    }

    async function load() {
        if (!token) { requireKey(); return; }
        setBadge(botStatus, true, 'Проверяем…');

        try {
            const me = await (await fetch('https://api.telegram.org/bot' + token + '/getMe')).json();
            if (!me.ok) { setBadge(botStatus, false, 'Токен неверный'); return; }
            setBadge(botStatus, true, 'Бот: @' + me.result.username);
        } catch (e) {
            setBadge(botStatus, false, 'Ошибка соединения');
            return;
        }

        try {
            const info = await (await fetch('https://api.telegram.org/bot' + token + '/getChat?chat_id=@' + CHANNEL_USERNAME)).json();
            if (info.ok) {
                chanTitle.textContent = info.result.title || '—';
                chanLink.innerHTML = '<a href="https://t.me/' + CHANNEL_USERNAME + '" target="_blank" rel="noopener">t.me/' + CHANNEL_USERNAME + '</a>';
            }
        } catch (e) {}

        try {
            const count = await (await fetch('https://api.telegram.org/bot' + token + '/getChatMemberCount?chat_id=' + DEFAULT_CHAT)).json();
            if (count.ok) {
                chanCount.textContent = count.result.toLocaleString('ru-RU');
            } else {
                const info = await (await fetch('https://api.telegram.org/bot' + token + '/getChat?chat_id=@' + CHANNEL_USERNAME)).json();
                if (info.ok && info.result && info.result.subscriber_count) {
                    chanCount.textContent = info.result.subscriber_count.toLocaleString('ru-RU');
                } else {
                    chanCount.textContent = 'нет доступа';
                }
            }
        } catch (e) {
            chanCount.textContent = 'ошибка';
        }

        updatedAt.textContent = 'Обновлено: ' + new Date().toLocaleString('ru-RU');
    }

    saveTokenBtn.addEventListener('click', function () {
        token = tokenInput.value.trim();
        if (!token) {
            setBadge(botStatus, false, 'Требуется ключ');
            tokenStatus.textContent = 'Введите токен бота.';
            return;
        }
        setStored(TOKEN_KEY, token);
        tokenStatus.textContent = 'Ключ сохранён в браузере (localStorage).';
        load();
    });

    clearTokenBtn.addEventListener('click', function () {
        removeStored(TOKEN_KEY);
        token = '';
        tokenInput.value = '';
        tokenStatus.textContent = 'Ключ удалён из браузера.';
        requireKey();
    });

    if (token) {
        tokenInput.value = token;
        tokenStatus.textContent = 'Ключ найден в браузере (localStorage).';
        load();
    } else {
        requireKey();
    }

    refreshBtn.addEventListener('click', load);
})();
