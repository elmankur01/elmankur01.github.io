// Панель статистики Telegram-канала. Читает данные через Bot API.
(function () {
    const DEFAULT_CHAT = '-1004315542026';
    const CHANNEL_USERNAME = 'avtotema_news';
    const CHAT_KEY = 'tg_stats_chat';
    const TOKEN_KEY = 'tg_stats_token';

    let token = localStorage.getItem(TOKEN_KEY) || '';
    let chat = localStorage.getItem(CHAT_KEY) || DEFAULT_CHAT;

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

    async function load() {
        if (!token) {
            token = prompt('Введите токен бота (от BotFather):');
            if (!token) return setBadge(botStatus, false, 'Нет токена');
            localStorage.setItem(TOKEN_KEY, token);
        }

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
            const count = await (await fetch('https://api.telegram.org/bot' + token + '/getChatMemberCount?chat_id=' + chat)).json();
            if (count.ok) {
                chanCount.textContent = count.result.toLocaleString('ru-RU');
            } else {
                const info = await (await fetch('https://api.telegram.org/bot' + token + '/getChat?chat_id=@' + CHANNEL_USERNAME)).json();
                if (info.ok && info.result && info.result.members_count) {
                    chanCount.textContent = info.result.members_count.toLocaleString('ru-RU');
                } else {
                    chanCount.textContent = 'нет доступа';
                }
            }
        } catch (e) {
            chanCount.textContent = 'ошибка';
        }

        updatedAt.textContent = 'Обновлено: ' + new Date().toLocaleString('ru-RU');
    }

    refreshBtn.addEventListener('click', load);
    load();
})();
