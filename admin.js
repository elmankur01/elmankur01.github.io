// Админ-панель АвтоТема: Метрика + Telegram + состояние сайта.
(function () {
    var DEFAULT_CHAT = '-1004315542026';
    var CHANNEL_USERNAME = 'avtotema_news';
    var TOKEN_KEY = 'at_admin_token';
    var YM_COUNTER = '111426400';

    function getStored(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
    function setStored(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
    function removeStored(k) { try { window.localStorage.removeItem(k); } catch (e) {} }

    var token = getStored(TOKEN_KEY) || '';

    var tokenInput = document.getElementById('tokenInput');
    var saveTokenBtn = document.getElementById('saveTokenBtn');
    var clearTokenBtn = document.getElementById('clearTokenBtn');
    var tokenStatus = document.getElementById('tokenStatus');
    var chanTitle = document.getElementById('chanTitle');
    var chanLink = document.getElementById('chanLink');
    var chanCount = document.getElementById('chanCount');
    var botStatus = document.getElementById('botStatus');
    var updatedAt = document.getElementById('updatedAt');
    var refreshBtn = document.getElementById('refreshBtn');

    var ymId = document.getElementById('ymId');
    var ymStatus = document.getElementById('ymStatus');

    ymId.textContent = YM_COUNTER;
    ymStatus.innerHTML = '<span class="badge ok">Счётчик подключён</span>';

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
            var me = await (await fetch('https://api.telegram.org/bot' + token + '/getMe')).json();
            if (!me.ok) { setBadge(botStatus, false, 'Токен неверный'); return; }
            setBadge(botStatus, true, 'Бот: @' + me.result.username);
        } catch (e) {
            setBadge(botStatus, false, 'Ошибка соединения');
            return;
        }

        try {
            var info = await (await fetch('https://api.telegram.org/bot' + token + '/getChat?chat_id=@' + CHANNEL_USERNAME)).json();
            if (info.ok) {
                chanTitle.textContent = info.result.title || '—';
                chanLink.innerHTML = '<a href="https://t.me/' + CHANNEL_USERNAME + '" target="_blank" rel="noopener">t.me/' + CHANNEL_USERNAME + '</a>';
            }
        } catch (e) {}

        try {
            var count = await (await fetch('https://api.telegram.org/bot' + token + '/getChatMemberCount?chat_id=' + DEFAULT_CHAT)).json();
            if (count.ok) {
                chanCount.textContent = count.result.toLocaleString('ru-RU');
            } else {
                var info2 = await (await fetch('https://api.telegram.org/bot' + token + '/getChat?chat_id=@' + CHANNEL_USERNAME)).json();
                if (info2.ok && info2.result && info2.result.subscriber_count) {
                    chanCount.textContent = info2.result.subscriber_count.toLocaleString('ru-RU');
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

    // ── Ручная отправка статьи в Telegram ──
    var destSelect = document.getElementById('destSelect');
    var articleSelect = document.getElementById('articleSelect');
    var sendBtn = document.getElementById('sendBtn');
    var sendStatus = document.getElementById('sendStatus');
    var sendPreview = document.getElementById('sendPreview');

    var articles = [];
    var slugMap = {};

    function escHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function loadArticles() {
        Promise.all([
            fetch('/script.js').then(function (r) { return r.text(); }),
            fetch('/article_images.js').then(function (r) { return r.text(); })
        ]).then(function (res) {
            var src = res[0], img = res[1];
            var sm;
            var sre = /(\d+)\s*:\s*"([^"]*)"/g;
            while ((sm = sre.exec(img)) !== null) {
                if (sm[1] !== 'module') slugMap[+sm[1]] = sm[2];
            }
            var m;
            var re = /\{\s*tag:\s*"([^"]*)"\s*,\s*title:\s*"([^"]*)"\s*,\s*text:\s*"([^"]*)"\s*,\s*readTime:\s*(\d+)\s*\}/g;
            var items = [];
            while ((m = re.exec(src)) !== null) {
                items.push({ tag: m[1], title: m[2], text: m[3], readTime: +m[4] });
            }
            articles = items;
            articleSelect.innerHTML = '';
            items.forEach(function (a, i) {
                var opt = document.createElement('option');
                opt.value = i;
                opt.textContent = (i + 1) + '. ' + a.title;
                articleSelect.appendChild(opt);
            });
            if (items.length) {
                articleSelect.value = 0;
                showPreview();
            } else {
                sendPreview.textContent = 'Не удалось прочитать список статей.';
            }
        }).catch(function () {
            sendPreview.textContent = 'Ошибка загрузки статей.';
        });
    }

    function showPreview() {
        var a = articles[+articleSelect.value];
        if (!a) { sendPreview.textContent = ''; return; }
        sendPreview.textContent = '«' + a.title + '» — ' + a.readTime + ' мин · ' + a.tag;
    }

    function sendArticle() {
        if (!token) {
            sendStatus.innerHTML = '<span class="badge err">Сначала введите и сохраните токен бота выше</span>';
            return;
        }
        var idx = +articleSelect.value;
        var a = articles[idx];
        if (!a) { sendStatus.textContent = 'Выберите статью.'; return; }

        var slug = slugMap[idx + 1] || ('article-' + (idx + 1));
        var url = 'https://elmankur01.github.io/articles/' + slug + '.html';

        var text = [
            '🔥 <b>' + escHtml(a.title) + '</b>',
            '',
            escHtml(a.text),
            '',
            '📰 <a href="' + url + '">Читать на АвтоТеме</a>',
            '',
            'Подпишитесь: <a href="https://t.me/avtotema_news">@avtotema_news</a>',
            '',
            '#авто #новости'
        ].join('\n');

        var replyMarkup = {
            inline_keyboard: [[{ text: '📰 Читать на АвтоТеме', url }]]
        };

        sendBtn.disabled = true;
        sendStatus.textContent = 'Отправляю…';

        fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: destSelect.value,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: replyMarkup
            })
        }).then(function (r) { return r.json(); }).then(function (j) {
            sendBtn.disabled = false;
            if (j.ok) {
                sendStatus.innerHTML = '<span class="badge ok">✅ Опубликовано (id ' + j.result.message_id + ')</span>';
            } else {
                sendStatus.innerHTML = '<span class="badge err">Ошибка: ' + esc(j.description || JSON.stringify(j)) + '</span>';
            }
        }).catch(function () {
            sendBtn.disabled = false;
            sendStatus.innerHTML = '<span class="badge err">Ошибка соединения</span>';
        });
    }

    articleSelect.addEventListener('change', showPreview);
    sendBtn.addEventListener('click', sendArticle);

    loadArticles();

    // Состояние сайта — счётчики из sitemap.xml
    var articleCount = document.getElementById('articleCount');
    var sitemapCount = document.getElementById('sitemapCount');
    fetch('/sitemap.xml').then(function (r) { return r.text(); }).then(function (xml) {
        var locs = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
        sitemapCount.textContent = locs.length;
        var articles = 0;
        locs.forEach(function (loc) {
            if (/\/articles\/[^/]+\.html/.test(loc)) articles++;
        });
        articleCount.textContent = articles;
    }).catch(function () {
        articleCount.textContent = '—';
        sitemapCount.textContent = '—';
    });
})();
