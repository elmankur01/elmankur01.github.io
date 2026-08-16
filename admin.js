// Админ-панель АвтоТема: Telegram + состояние сайта.
(function () {
    var DEFAULT_CHAT = '-1004315542026';
    var CHANNEL_USERNAME = 'avtotema_news';
    var TOKEN_KEY = 'at_admin_token';

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

    // Обновление описания Telegram-канала
    var updateDescBtn = document.getElementById('updateDescBtn');
    var channelDescInput = document.getElementById('channelDescInput');
    var descStatus = document.getElementById('descStatus');

    if (updateDescBtn && channelDescInput) {
        updateDescBtn.addEventListener('click', async function () {
            if (!token) {
                descStatus.textContent = '❌ Сначала введите и сохраните токен бота выше.';
                return;
            }
            var text = channelDescInput.value.trim();
            descStatus.textContent = '⏳ Обновляем описание канала…';
            try {
                var res = await fetch('https://api.telegram.org/bot' + token + '/setChatDescription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: DEFAULT_CHAT,
                        description: text
                    })
                });
                var data = await res.json();
                if (data.ok) {
                    descStatus.innerHTML = '✅ <span style="color:#4ade80;font-weight:700;">Описание канала успешно обновлено в Telegram!</span>';
                } else {
                    descStatus.textContent = '❌ Ошибка Telegram: ' + (data.description || 'не удалось изменить описание');
                }
            } catch (e) {
                descStatus.textContent = '❌ Ошибка сети: ' + e.message;
            }
        });
    }

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

    function articleDate(n) {
        return new Date(2026, 7, 1 + n).toLocaleDateString('ru-RU');
    }

    var imageMap = {};

    function loadArticles() {
        var bust = '?v=' + Date.now();
        Promise.all([
            fetch('/script.js' + bust).then(function (r) { return r.text(); }),
            fetch('/article_images.js' + bust).then(function (r) { return r.text(); })
        ]).then(function (res) {
            var src = res[0], img = res[1];
            var sm;
            var sre = /(\d+)\s*:\s*"([^"]*)"/g;
            while ((sm = sre.exec(img)) !== null) {
                if (sm[1] !== 'module') slugMap[+sm[1]] = sm[2];
            }
            var im;
            var ire = /(\d+)\s*:\s*\{\s*url:\s*"([^"]*)"/g;
            while ((im = ire.exec(img)) !== null) {
                imageMap[+im[1]] = im[2];
            }
            var m;
            var re = /\{\s*tag:\s*"([^"]*)"\s*,\s*title:\s*"([^"]*)"\s*,\s*text:\s*"([^"]*)"\s*,\s*readTime:\s*(\d+)\s*\}/g;
            var items = [];
            while ((m = re.exec(src)) !== null) {
                items.push({ tag: m[1], title: m[2], text: m[3], readTime: +m[4] });
            }
            articles = items;
            // Банк упорядочен по дате добавления (номер = дата). Новые — сверху.
            var order = items.map(function (_, i) { return i; }).reverse();
            var newest = items.length ? items.length - 1 : 0;
            articleSelect.innerHTML = '';
            order.forEach(function (i) {
                var opt = document.createElement('option');
                opt.value = i;
                opt.textContent = (i + 1) + '. ' + items[i].title + '  (' + articleDate(i + 1) + ')';
                articleSelect.appendChild(opt);
            });
            if (items.length) {
                articleSelect.value = newest;
                showPreview();
            } else {
                sendPreview.textContent = 'Не удалось прочитать список статей.';
            }
            var vlist = document.getElementById('videoArticleList');
            if (vlist) {
                vlist.innerHTML = order.map(function (i) {
                    return '<div>' + (i + 1) + '. ' + esc(items[i].title) + ' [' + esc(items[i].tag) + '] — ' + articleDate(i + 1) + '</div>';
                }).join('');
            }
            var socialSelect = document.getElementById('socialArticleSelect');
            if (socialSelect) {
                socialSelect.innerHTML = '';
                order.forEach(function (i) {
                    var opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = (i + 1) + '. ' + items[i].title + '  (' + articleDate(i + 1) + ')';
                    socialSelect.appendChild(opt);
                });
                if (items.length) {
                    socialSelect.value = newest;
                    showSocialVideoUrl();
                }
            }

            var renderArticleSelect = document.getElementById('renderArticleSelect');
            if (renderArticleSelect) {
                renderArticleSelect.innerHTML = '';
                order.forEach(function (i) {
                    var opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = (i + 1) + '. ' + items[i].title + '  (' + articleDate(i + 1) + ')';
                    renderArticleSelect.appendChild(opt);
                });
                if (items.length) renderArticleSelect.value = newest;
            }

            renderLikesAnalytics();
        }).catch(function () {
            sendPreview.textContent = 'Ошибка загрузки статей.';
        });
    }

    function getArticleRealLikes(id) {
        var num = parseInt(id, 10) || 1;
        var bonus = 0;
        try {
            var bonusMap = JSON.parse(localStorage.getItem('avtotema_likes_bonus')) || {};
            bonus = bonusMap[num] || 0;
        } catch (e) {}
        return bonus;
    }

    function getArticleDisplayLikes(id) {
        var num = parseInt(id, 10) || 1;
        var base = 18 + ((num * 13 + 7) % 42);
        return base + getArticleRealLikes(num);
    }

    function renderLikesAnalytics() {
        var listEl = document.getElementById('topLikesList');
        var realEl = document.getElementById('realLikesCount');
        var likedCountEl = document.getElementById('likedArticlesCount');
        var displayEl = document.getElementById('totalDisplayLikes');
        var filterEl = document.getElementById('likesTagFilter');

        if (!listEl || !articles.length) return;

        var tagFilter = filterEl ? filterEl.value : 'all';

        // Собираем реальные лайки для всех статей
        var stats = articles.map(function (a, i) {
            var id = i + 1;
            return {
                id: id,
                title: a.title,
                tag: a.tag,
                readTime: a.readTime,
                slug: slugMap[id] || ('article-' + id),
                realLikes: getArticleRealLikes(id),
                displayLikes: getArticleDisplayLikes(id)
            };
        });

        // Реальные клики
        var totalReal = stats.reduce(function (sum, item) { return sum + item.realLikes; }, 0);
        var articlesWithRealLikes = stats.filter(function (item) { return item.realLikes > 0; }).length;
        var totalDisplay = stats.reduce(function (sum, item) { return sum + item.displayLikes; }, 0);

        if (realEl) realEl.textContent = totalReal;
        if (likedCountEl) likedCountEl.textContent = articlesWithRealLikes;
        if (displayEl) displayEl.textContent = totalDisplay.toLocaleString('ru-RU') + ' лайков';

        // Фильтрация
        var filtered = tagFilter === 'all'
            ? stats
            : stats.filter(function (s) { return s.tag === tagFilter; });

        // Статьи с реальными лайками (сортируем по реальным, затем по номеру)
        var sortedByReal = filtered.slice().sort(function (a, b) {
            if (b.realLikes !== a.realLikes) return b.realLikes - a.realLikes;
            return b.id - a.id;
        });

        if (totalReal === 0) {
            listEl.innerHTML = '<div style="background:#0d1218;border:1px dashed #262e3a;border-radius:8px;padding:16px;text-align:center;color:#8b95a3;font-size:13px;">' +
                '📊 <b>Реальных лайков пока: 0</b><br>' +
                '<span style="font-size:12px;color:#64748b;display:block;margin-top:4px;">На витрине сайта у статей сейчас активен стартовый посев. Как только первые посетители поставят ❤️, здесь сразу появится статистика живых кликов.</span>' +
            '</div>';
            return;
        }

        var topList = sortedByReal.filter(function (s) { return s.realLikes > 0; }).slice(0, 10);
        if (!topList.length) {
            listEl.innerHTML = '<div style="background:#0d1218;border:1px dashed #262e3a;border-radius:8px;padding:14px;text-align:center;color:#8b95a3;font-size:13px;">В этой рубрике пока нет реальных лайков.</div>';
            return;
        }

        var maxReal = topList[0].realLikes || 1;

        listEl.innerHTML = topList.map(function (item, rank) {
            var medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '#' + (rank + 1);
            var pct = Math.max(10, Math.round((item.realLikes / maxReal) * 100));
            return '<div style="background:#0d1218;border:1px solid #1f2732;border-radius:8px;padding:10px 14px;">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:8px;">' +
                    '<div style="display:flex;align-items:center;gap:8px;overflow:hidden;">' +
                        '<span style="font-size:14px;font-weight:800;color:#facc15;min-width:24px;">' + medal + '</span>' +
                        '<a href="/articles/' + item.slug + '.html" target="_blank" rel="noopener" style="color:#f1f5f9;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(item.title) + '</a>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">' +
                        '<span style="background:rgba(239,68,68,0.2);color:#ff6b6b;font-weight:800;font-size:12px;padding:2px 8px;border-radius:12px;border:1px solid #ef4444;">❤️ +' + item.realLikes + ' реальных</span>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;">' +
                    '<div style="flex:1;background:#1a222d;height:6px;border-radius:3px;overflow:hidden;">' +
                        '<div style="background:linear-gradient(90deg, #ef4444, #f59e0b);height:100%;width:' + pct + '%;border-radius:3px;transition:width 0.4s ease;"></div>' +
                    '</div>' +
                    '<span style="color:#8b95a3;font-size:11px;">' + esc(item.tag) + ' · на сайте: ' + item.displayLikes + '</span>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    var likesFilterSelect = document.getElementById('likesTagFilter');
    if (likesFilterSelect) {
        likesFilterSelect.addEventListener('change', renderLikesAnalytics);
    }

    function showPreview() {
        var a = articles[+articleSelect.value];
        var previewBox = document.getElementById('telegramPostPreview');
        var previewImgBox = document.getElementById('tgPreviewImgBox');
        var previewImg = document.getElementById('tgPreviewImg');
        var previewText = document.getElementById('tgPreviewText');

        if (!a) {
            sendPreview.textContent = '';
            if (previewBox) previewBox.style.display = 'none';
            return;
        }

        var idx = +articleSelect.value;
        var tagIcons = {
            'Новые модели': '🚗',
            'Электромобили': '⚡',
            'Двигатели': '🔧',
            'История марок': '🏛️',
            'Мировые новости': '🌍',
            'Новости рынка': '📊',
            'Авто лайфхаки': '💡'
        };
        var icon = tagIcons[a.tag] || '🚗';
        var slug = slugMap[idx + 1] || ('article-' + (idx + 1));
        var url = 'https://avtotema-news.online/articles/' + slug + '.html';

        sendPreview.textContent = '«' + a.title + '» — ' + a.readTime + ' мин · ' + a.tag;

        if (previewBox && previewText) {
            previewBox.style.display = 'block';
            var photoPath = imageMap[idx + 1];
            if (photoPath && previewImgBox && previewImg) {
                previewImgBox.style.display = 'block';
                previewImg.src = photoPath;
            } else if (previewImgBox) {
                previewImgBox.style.display = 'none';
            }

            previewText.innerHTML = '<b>' + icon + ' ' + escHtml(a.tag).toUpperCase() + ' | АвтоТема</b>\n' +
                '━━━━━━━━━━━━━━━━━━━\n\n' +
                '🔥 <b>' + escHtml(a.title) + '</b>\n\n' +
                escHtml(a.text) + '\n\n' +
                '⏱ <i>Время чтения: ~' + a.readTime + ' мин</i>\n\n' +
                '━━━━━━━━━━━━━━━━━━━\n' +
                '👉 <b>Читать статью:</b> <a href="' + url + '" target="_blank" style="color:#4a9eff;">avtotema-news.online</a>\n' +
                '📢 <b>Канал:</b> <a href="https://t.me/avtotema_news" target="_blank" style="color:#4a9eff;">@avtotema_news</a>';
        }
    }

    function sendArticle() {
        if (!token) {
            sendStatus.innerHTML = '<span class="badge err">Сначала введите и сохраните токен бота выше</span>';
            return;
        }
        var idx = +articleSelect.value;
        var a = articles[idx];
        if (!a) { sendStatus.textContent = 'Выберите статью.'; return; }

        var tagIcons = {
            'Новые модели': '🚗',
            'Электромобили': '⚡',
            'Двигатели': '🔧',
            'История марок': '🏛️',
            'Мировые новости': '🌍',
            'Новости рынка': '📊',
            'Авто лайфхаки': '💡'
        };
        var icon = tagIcons[a.tag] || '🚗';

        var slug = slugMap[idx + 1] || ('article-' + (idx + 1));
        var url = 'https://avtotema-news.online/articles/' + slug + '.html';

        var text = [
            icon + ' <b>' + (a.tag || 'Автоновости').toUpperCase() + '</b> | <i>АвтоТема</i>',
            '━━━━━━━━━━━━━━━━━━━',
            '',
            '🔥 <b>' + escHtml(a.title) + '</b>',
            '',
            escHtml(a.text),
            '',
            '⏱ <i>Время чтения: ~' + a.readTime + ' мин</i>',
            '',
            '━━━━━━━━━━━━━━━━━━━',
            '👉 <b>Читать полную версию статьи:</b>',
            '🔗 <a href="' + url + '">avtotema-news.online</a>',
            '',
            '📢 <b>Подписывайтесь:</b> <a href="https://t.me/avtotema_news">@avtotema_news</a>',
            '',
            '#авто #новости #' + (a.tag.replace(/\s+/g, '_').toLowerCase())
        ].join('\n');

        var replyMarkup = {
            inline_keyboard: [
                [{ text: '📖 Читать статью на сайте ↗', url: url }],
                [{ text: '🚗 Все новости на АвтоТеме', url: 'https://avtotema-news.online/' }]
            ]
        };

        var photoPath = imageMap[idx + 1];
        var photoUrl = photoPath ? ('https://avtotema-news.online' + photoPath) : null;
        var apiMethod = photoUrl ? 'sendPhoto' : 'sendMessage';
        var apiPayload = photoUrl
            ? { chat_id: destSelect.value, photo: photoUrl, caption: text, parse_mode: 'HTML', reply_markup: replyMarkup }
            : { chat_id: destSelect.value, text: text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup };

        sendBtn.disabled = true;
        sendStatus.textContent = 'Отправляю…';

        fetch('https://api.telegram.org/bot' + token + '/' + apiMethod, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload)
        }).then(function (r) { return r.json(); }).then(function (j) {
            sendBtn.disabled = false;
            if (j.ok) {
                sendStatus.innerHTML = '<span class="badge ok">✅ Опубликовано (' + apiMethod + ', id ' + (j.result.message_id || '') + ')</span>';
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

    // ── Генерация роликов в GitHub Actions ──
    var GH_TOKEN_KEY = 'at_gh_token';
    var GH_REPO = 'elmankur01/elmankur01.github.io';
    var GH_WORKFLOW = 'generate_videos.yml';

    var ghTokenInput = document.getElementById('ghTokenInput');
    var saveGhTokenBtn = document.getElementById('saveGhTokenBtn');
    var clearGhTokenBtn = document.getElementById('clearGhTokenBtn');
    var ghTokenStatus = document.getElementById('ghTokenStatus');
    var videoArticlesInput = document.getElementById('videoArticlesInput');
    var startVideoBtn = document.getElementById('startVideoBtn');
    var videoStatus = document.getElementById('videoStatus');

    var ghToken = getStored(GH_TOKEN_KEY) || '';

    saveGhTokenBtn.addEventListener('click', function () {
        ghToken = ghTokenInput.value.trim();
        if (!ghToken) { ghTokenStatus.textContent = 'Введите токен.'; return; }
        setStored(GH_TOKEN_KEY, ghToken);
        ghTokenStatus.textContent = 'Токен сохранён в браузере.';
    });

    clearGhTokenBtn.addEventListener('click', function () {
        removeStored(GH_TOKEN_KEY);
        ghToken = '';
        ghTokenInput.value = '';
        ghTokenStatus.textContent = 'Токен удалён.';
    });

    if (ghToken) {
        ghTokenInput.value = ghToken;
        ghTokenStatus.textContent = 'Токен найден в браузере.';
    }

    function ghHeaders(extra) {
        var h = { 'Accept': 'application/vnd.github+json' };
        if (ghToken) h['Authorization'] = 'Bearer ' + ghToken;
        if (extra) Object.assign(h, extra);
        return h;
    }

    function startVideoGen() {
        var nums = videoArticlesInput.value.trim();
        if (!ghToken) { videoStatus.innerHTML = '<span class="badge err">Сначала сохраните GitHub-токен</span>'; return; }
        if (!nums) { videoStatus.innerHTML = '<span class="badge err">Укажите номера статей</span>'; return; }
        if (!/^(\d+(\s+\d+)*|all)$/.test(nums)) {
            videoStatus.innerHTML = '<span class="badge err">Введите номера статей через пробел (например «3 17 24») или «all»</span>';
            return;
        }

        startVideoBtn.disabled = true;
        videoStatus.textContent = 'Запускаю генерацию…';

        latestDispatchRun().then(function (prev) {
            return fetch('https://api.github.com/repos/' + GH_REPO + '/actions/workflows/' + GH_WORKFLOW + '/dispatches', {
                method: 'POST',
                headers: ghHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ ref: 'main', inputs: { articles: nums } })
            }).then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                videoStatus.textContent = 'Запущено. Ищу задачу…';
                return waitForRun(prev);
            });
        }).then(function (run) {
            return pollRun(run, nums);
        }).catch(function (e) {
            startVideoBtn.disabled = false;
            videoStatus.innerHTML = '<span class="badge err">Ошибка: ' + esc(e.message || e) + '</span>';
        });
    }

    function latestDispatchRun() {
        return fetch('https://api.github.com/repos/' + GH_REPO + '/actions/workflows/' + GH_WORKFLOW + '/runs?event=workflow_dispatch&per_page=1', { headers: ghHeaders() })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var top = d.workflow_runs && d.workflow_runs[0];
                return (top && top.run_number) || 0;
            });
    }

    function waitForRun(minRunNumber) {
        return new Promise(function (resolve, reject) {
            var started = Date.now();
            var timer = setInterval(function () {
                fetch('https://api.github.com/repos/' + GH_REPO + '/actions/workflows/' + GH_WORKFLOW + '/runs?event=workflow_dispatch&per_page=1', { headers: ghHeaders() })
                    .then(function (r) { return r.json(); })
                    .then(function (d) {
                        var run = d.workflow_runs && d.workflow_runs[0];
                        if (run && run.run_number > minRunNumber) {
                            clearInterval(timer);
                            resolve(run);
                            return;
                        }
                        if (Date.now() - started > 60000) {
                            clearInterval(timer);
                            reject(new Error('Не удалось найти запуск workflow'));
                            return;
                        }
                        videoStatus.textContent = 'Ищу задачу… ' + Math.round((Date.now() - started) / 1000) + ' c';
                    })
                    .catch(function () {});
            }, 5000);
        });
    }

    function pollRun(run, nums) {
        var started = Date.now();
        var timer = setInterval(function () {
            fetch('https://api.github.com/repos/' + GH_REPO + '/actions/runs/' + run.id, { headers: ghHeaders() })
                .then(function (r) { return r.json(); })
                .then(function (d) {
                    if (d.status === 'completed') {
                        clearInterval(timer);
                        startVideoBtn.disabled = false;
                        if (d.conclusion === 'success') showArtifacts(run, nums);
                        else {
                            videoStatus.innerHTML = '<span class="badge err">Ошибка генерации (' + d.conclusion + ')</span> · <a href="https://github.com/' + GH_REPO + '/actions/runs/' + run.id + '" target="_blank" rel="noopener" style="color:#4a9eff;">открыть логи</a>';
                        }
                        return;
                    }
                    var sec = Math.round((Date.now() - started) / 1000);
                    videoStatus.textContent = 'Генерация идёт… ' + sec + ' c (примерно 1–2 мин на статью)';
                })
                .catch(function () {
                    clearInterval(timer);
                    startVideoBtn.disabled = false;
                    videoStatus.innerHTML = '<span class="badge err">Ошибка проверки статуса</span>';
                });
        }, 10000);
    }

    function generatedVideoURLs(nums) {
        var list = [];
        var numArr = nums === 'all'
            ? Object.keys(slugMap).map(Number).filter(function (n) { return n >= 1 && n <= articles.length; }).sort(function (a, b) { return a - b; })
            : String(nums).split(/\s+/).map(Number).filter(Boolean);
        numArr.forEach(function (n) {
            if (n < 1 || n > articles.length) return;
            var slug = slugMap[n] || ('article-' + n);
            list.push('https://avtotema-news.online/videos/out_' + n + '_' + slug + '.mp4');
        });
        return list;
    }

    function showArtifacts(run, nums) {
        var linksHtml = '';
        var urls = generatedVideoURLs(nums);
        if (urls.length) {
            linksHtml = '<div class="note" style="margin-top:8px;">Готовые ролики добавлены в репозиторий и появятся по ссылкам через 1–2 минуты (деплой Pages):<br>' +
                urls.map(function (u) { return '<a href="' + u + '" target="_blank" rel="noopener" style="color:#4a9eff;word-break:break-all;">' + u + '</a>'; }).join('<br>') +
                '</div><div class="note">После появления ролика выберите статью в блоке ниже и нажмите «Опубликовать ролик» (YouTube) или «Опубликовать Reels» (Instagram).</div>';
        }
        fetch('https://api.github.com/repos/' + GH_REPO + '/actions/runs/' + run.id + '/artifacts', { headers: ghHeaders() })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var arts = (d.artifacts || []).filter(function (a) { return a.expired === false; });
                var runPage = '<a href="https://github.com/' + GH_REPO + '/actions/runs/' + run.id + '" target="_blank" rel="noopener" style="color:#4a9eff;">страница запуска</a>';
                if (!arts.length) {
                    videoStatus.innerHTML = '<span class="badge ok">✅ Ролики готовы!</span> ' + linksHtml + '<div class="note">Архив не найден, но видео уже в репозитории. Запуск: ' + runPage + '</div>';
                    return;
                }
                videoStatus.innerHTML = '<span class="badge ok">✅ Ролики готовы!</span> <button id="dlArtifact" class="btn btn-red" style="margin-left:8px;">⬇ Скачать архив</button> ' + linksHtml + '<div class="note">Архив также в ' + runPage + ' (раздел Artifacts).</div>';
                document.getElementById('dlArtifact').addEventListener('click', function () {
                    downloadArtifact(arts[0].archive_download_url);
                });
            })
            .catch(function () {
                videoStatus.innerHTML = '<span class="badge ok">✅ Готово!</span> ' + linksHtml + '<div class="note">Скачать в <a href="https://github.com/' + GH_REPO + '/actions/runs/' + run.id + '" target="_blank" rel="noopener" style="color:#4a9eff;">разделе Artifacts</a></div>';
            });
    }

    function downloadArtifact(url) {
        var btn = document.getElementById('dlArtifact');
        if (btn) btn.textContent = 'Загружаю…';
        fetch(url, { headers: ghHeaders(), redirect: 'follow' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.blob();
            })
            .then(function (blob) {
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'avtotema_videos.zip';
                document.body.appendChild(a);
                a.click();
                setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
                if (btn) btn.textContent = '⬇ Скачать архив';
            })
            .catch(function () {
                videoStatus.innerHTML += ' <span class="badge err">Не удалось скачать напрямую — скачайте в <a href="https://github.com/' + GH_REPO + '/actions/runs/' + run.id + '" target="_blank" rel="noopener" style="color:#4a9eff;">Artifacts</a></span>';
                if (btn) btn.textContent = '⬇ Скачать архив';
            });
    }

    startVideoBtn.addEventListener('click', startVideoGen);

    // ── Мгновенный рендеринг видео в браузере (HTML5 Canvas + MediaRecorder) ──
    var renderArticleSelect = document.getElementById('renderArticleSelect');
    var renderDuration = document.getElementById('renderDuration');
    var renderVoice = document.getElementById('renderVoice');
    var startBrowserRenderBtn = document.getElementById('startBrowserRenderBtn');
    var downloadRenderedVideoBtn = document.getElementById('downloadRenderedVideoBtn');
    var renderProgressBox = document.getElementById('renderProgressBox');
    var renderStatusText = document.getElementById('renderStatusText');
    var renderPercentText = document.getElementById('renderPercentText');
    var renderProgressBar = document.getElementById('renderProgressBar');
    var renderPreviewContainer = document.getElementById('renderPreviewContainer');
    var renderedVideoPlayer = document.getElementById('renderedVideoPlayer');
    var hiddenCanvas = document.getElementById('renderHiddenCanvas');

    function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
        var words = text.split(' ');
        var line = '';
        var linesCount = 0;
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, y);
                line = words[n] + ' ';
                y += lineHeight;
                linesCount++;
                if (maxLines && linesCount >= maxLines - 1) {
                    var remaining = words.slice(n).join(' ');
                    ctx.fillText(remaining.length > 35 ? (remaining.slice(0, 32) + '…') : remaining, x, y);
                    return;
                }
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, y);
    }

    if (startBrowserRenderBtn && hiddenCanvas) {
        startBrowserRenderBtn.addEventListener('click', async function () {
            var idx = renderArticleSelect ? +renderArticleSelect.value : 0;
            var a = articles[idx];
            if (!a) {
                alert('Сначала выберите статью');
                return;
            }

            var durationSec = renderDuration ? +renderDuration.value : 9;
            var photoPath = imageMap[idx + 1] || '';
            var slug = slugMap[idx + 1] || ('article-' + (idx + 1));

            startBrowserRenderBtn.disabled = true;
            if (downloadRenderedVideoBtn) downloadRenderedVideoBtn.style.display = 'none';
            if (renderPreviewContainer) renderPreviewContainer.style.display = 'none';
            if (renderProgressBox) renderProgressBox.style.display = 'block';

            if (renderStatusText) renderStatusText.textContent = 'Загрузка изображения…';
            if (renderPercentText) renderPercentText.textContent = '0%';
            if (renderProgressBar) renderProgressBar.style.width = '0%';

            // Загружаем картинку
            var carImg = new Image();
            carImg.crossOrigin = 'anonymous';
            carImg.src = photoPath ? (photoPath.startsWith('http') ? photoPath : photoPath) : '/og-image.png';

            await new Promise(function (resolve) {
                carImg.onload = resolve;
                carImg.onerror = resolve; // продолжаем даже если картинка не загрузилась
            });

            var ctx = hiddenCanvas.getContext('2d');
            var fps = 30;
            var totalFrames = durationSec * fps;
            var currentFrame = 0;

            // Настройка записи
            var stream = hiddenCanvas.captureStream(fps);
            var mimeType = 'video/webm;codecs=vp9';
            if (window.MediaRecorder && !MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
            }

            var recorder;
            var chunks = [];
            try {
                recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: 4000000 });
            } catch (e) {
                recorder = new MediaRecorder(stream);
            }

            recorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = function () {
                var blob = new Blob(chunks, { type: mimeType });
                var videoUrl = URL.createObjectURL(blob);
                if (renderedVideoPlayer) {
                    renderedVideoPlayer.src = videoUrl;
                    renderedVideoPlayer.load();
                }
                if (renderPreviewContainer) renderPreviewContainer.style.display = 'block';
                if (downloadRenderedVideoBtn) {
                    downloadRenderedVideoBtn.href = videoUrl;
                    downloadRenderedVideoBtn.download = 'avtotema_' + (idx + 1) + '_' + slug + '.' + (mimeType.includes('mp4') ? 'mp4' : 'webm');
                    downloadRenderedVideoBtn.style.display = 'inline-flex';
                }
                if (renderStatusText) renderStatusText.textContent = '✅ Видео успешно срендерено!';
                startBrowserRenderBtn.disabled = false;
            };

            // Озвучка через браузер (опционально)
            if (renderVoice && renderVoice.value === 'speech' && window.speechSynthesis) {
                try {
                    window.speechSynthesis.cancel();
                    var utter = new SpeechSynthesisUtterance(a.title + '. ' + a.text);
                    utter.lang = 'ru-RU';
                    utter.rate = 1.05;
                    window.speechSynthesis.speak(utter);
                } catch (e) {}
            }

            recorder.start(100);

            var renderInterval = setInterval(function () {
                currentFrame++;
                var progress = currentFrame / totalFrames;
                var pct = Math.round(progress * 100);

                if (renderProgressBar) renderProgressBar.style.width = pct + '%';
                if (renderPercentText) renderPercentText.textContent = pct + '%';
                if (renderStatusText) renderStatusText.textContent = 'Рендеринг кадра ' + currentFrame + ' из ' + totalFrames + '…';

                // Отрисовка кадра на 1080x1920 (9:16)
                ctx.save();

                // 1. Фон - глубокий премиальный градиент
                var bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
                bgGrad.addColorStop(0, '#070a0e');
                bgGrad.addColorStop(0.5, '#0f1722');
                bgGrad.addColorStop(1, '#05070a');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, 1080, 1920);

                // Декоративные световые акценты
                var glowGrad = ctx.createRadialGradient(540, 750, 100, 540, 750, 700);
                glowGrad.addColorStop(0, 'rgba(230, 26, 39, 0.25)');
                glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glowGrad;
                ctx.fillRect(0, 0, 1080, 1920);

                // 2. Шапка бренда
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 44px -apple-system, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('АВТОТЕМА', 540, 140);

                ctx.fillStyle = '#e61a27';
                ctx.font = '600 28px -apple-system, system-ui, sans-serif';
                ctx.fillText('ГЛАВНЫЕ АВТОНОВОСТИ И ОБЗОРЫ', 540, 185);

                // 3. Рубрика
                var tagIcons = {
                    'Новые модели': '🚗',
                    'Электромобили': '⚡',
                    'Двигатели': '🔧',
                    'История марок': '🏛️',
                    'Мировые новости': '🌍',
                    'Новости рынка': '📊',
                    'Авто лайфхаки': '💡'
                };
                var icon = tagIcons[a.tag] || '🚗';

                // Плашка рубрики
                var tagText = icon + ' ' + a.tag.toUpperCase();
                ctx.font = 'bold 30px -apple-system, system-ui, sans-serif';
                var tagWidth = ctx.measureText(tagText).width + 50;

                ctx.fillStyle = 'rgba(230, 26, 39, 0.9)';
                ctx.beginPath();
                ctx.roundRect(540 - tagWidth / 2, 240, tagWidth, 54, 27);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(tagText, 540, 277);

                // 4. Изображение автомобиля с эффектом зума Ken Burns
                if (carImg && carImg.complete && carImg.naturalWidth > 0) {
                    var cardX = 70;
                    var cardY = 340;
                    var cardW = 940;
                    var cardH = 560;

                    ctx.save();
                    ctx.beginPath();
                    ctx.roundRect(cardX, cardY, cardW, cardH, 28);
                    ctx.clip();

                    // Масштабирование зума от 1.0 до 1.15
                    var zoom = 1.0 + progress * 0.15;
                    var imgW = cardW * zoom;
                    var imgH = cardH * zoom;
                    var imgX = cardX - (imgW - cardW) / 2;
                    var imgY = cardY - (imgH - cardH) / 2;

                    ctx.drawImage(carImg, imgX, imgY, imgW, imgH);
                    ctx.restore();

                    // Рамка карточки фото
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.roundRect(cardX, cardY, cardW, cardH, 28);
                    ctx.stroke();
                }

                // 5. Заголовок статьи
                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 54px -apple-system, system-ui, sans-serif';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 16;
                ctx.shadowOffsetY = 4;

                wrapCanvasText(ctx, a.title, 80, 990, 920, 70, 4);

                // 6. Описание / анонс
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '400 36px -apple-system, system-ui, sans-serif';
                wrapCanvasText(ctx, a.text, 80, 1310, 920, 52, 4);

                // 7. Нижний блок - таймлайн и призыв
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.fillRect(80, 1680, 920, 8);

                ctx.fillStyle = '#e61a27';
                ctx.fillRect(80, 1680, 920 * progress, 8);

                ctx.textAlign = 'center';
                ctx.fillStyle = '#f8fafc';
                ctx.font = 'bold 36px -apple-system, system-ui, sans-serif';
                ctx.fillText('🔗 Читать на avtotema-news.online', 540, 1750);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '500 28px -apple-system, system-ui, sans-serif';
                ctx.fillText('Telegram: @avtotema_news', 540, 1800);

                ctx.restore();

                if (currentFrame >= totalFrames) {
                    clearInterval(renderInterval);
                    setTimeout(function () {
                        if (recorder && recorder.state === 'recording') {
                            recorder.stop();
                        }
                    }, 300);
                }
            }, 1000 / fps);
        });
    }

    // ── Публикация в YouTube и Instagram ──
    var YT_CID = 'at_yt_cid';
    var YT_SECRET = 'at_yt_secret';
    var YT_REFRESH = 'at_yt_refresh';
    var YT_ACCESS = 'at_yt_access';
    var YT_ACCESS_EXP = 'at_yt_access_exp';
    var IG_TOKEN = 'at_ig_token';
    var IG_UID = 'at_ig_uid';

    var socialSelect = document.getElementById('socialArticleSelect');
    var socialVideoUrlEl = document.getElementById('socialVideoUrl');
    var ytClientId = document.getElementById('ytClientId');
    var ytClientSecret = document.getElementById('ytClientSecret');
    var ytRefreshToken = document.getElementById('ytRefreshToken');
    var ytAuthBtn = document.getElementById('ytAuthBtn');
    var ytCheckBtn = document.getElementById('ytCheckBtn');
    var ytPublishBtn = document.getElementById('ytPublishBtn');
    var ytStatus = document.getElementById('ytStatus');
    var igToken = document.getElementById('igToken');
    var igUserId = document.getElementById('igUserId');
    var igPublishBtn = document.getElementById('igPublishBtn');
    var igStatus = document.getElementById('igStatus');

    function socialSetStatus(el, ok, msg) {
        el.innerHTML = '<span class="badge ' + (ok ? 'ok' : 'err') + '">' + escHtml(msg) + '</span>';
    }

    function socialVideoURL() {
        var idx = +socialSelect.value;
        var a = articles[idx];
        if (!a) return '';
        var slug = slugMap[idx + 1] || ('article-' + (idx + 1));
        return 'https://avtotema-news.online/videos/out_' + (idx + 1) + '_' + slug + '.mp4';
    }

    function showSocialVideoUrl() {
        var url = socialVideoURL();
        socialVideoUrlEl.innerHTML = url
            ? 'Ролик: <a href="' + url + '" target="_blank" rel="noopener" style="color:#4a9eff;">' + url + '</a>'
            : '';
    }

    if (socialSelect) {
        socialSelect.addEventListener('change', showSocialVideoUrl);
        ytClientId.value = getStored(YT_CID) || '';
        ytClientSecret.value = getStored(YT_SECRET) || '';
        ytRefreshToken.value = getStored(YT_REFRESH) || '';
        igToken.value = getStored(IG_TOKEN) || '';
        igUserId.value = getStored(IG_UID) || '';
        if (getStored(YT_REFRESH)) {
            socialSetStatus(ytStatus, true, '✅ Авторизовано — refresh token сохранён.');
        } else {
            socialSetStatus(ytStatus, false, 'Не авторизовано — нажмите «Авторизовать YouTube».');
        }
    }

    function syncYouTubeFields() {
        var cid = ytClientId.value.trim();
        var sec = ytClientSecret.value.trim();
        var ref = ytRefreshToken.value.trim();
        if (cid) setStored(YT_CID, cid);
        if (sec) setStored(YT_SECRET, sec);
        if (ref) setStored(YT_REFRESH, ref);
    }

    ytClientId.addEventListener('input', syncYouTubeFields);
    ytClientSecret.addEventListener('input', syncYouTubeFields);
    ytRefreshToken.addEventListener('input', syncYouTubeFields);

    // OAuth-callback: текущая страница?code=...&state=yt_avtotema (возврат с Google)
    (function () {
        var q = new URLSearchParams(window.location.search);
        var code = q.get('code');
        var state = q.get('state');
        if (code && state === 'yt_avtotema') {
            exchangeYouTubeCode(code);
            history.replaceState({}, '', window.location.pathname);
        }
    })();

    function exchangeYouTubeCode(code) {
        var cid = ytClientId.value.trim();
        var sec = ytClientSecret.value.trim();
        if (!cid || !sec) { socialSetStatus(ytStatus, false, 'Введите Client ID и Secret'); return; }
        var redirect = window.location.origin + window.location.pathname;
        fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code, client_id: cid, client_secret: sec, redirect_uri: redirect, grant_type: 'authorization_code' })
        }).then(function (r) { return r.json(); }).then(function (j) {
            if (j.refresh_token) {
                setStored(YT_CID, cid);
                setStored(YT_SECRET, sec);
                setStored(YT_REFRESH, j.refresh_token);
                setStored(YT_ACCESS, j.access_token);
                setStored(YT_ACCESS_EXP, String(Date.now() + (j.expires_in || 3600) * 1000));
                ytRefreshToken.value = j.refresh_token;
                socialSetStatus(ytStatus, true, '✅ Авторизовано! Refresh token сохранён в браузере. Можно публиковать.');
            } else {
                socialSetStatus(ytStatus, false, 'Ошибка: ' + (j.error_description || JSON.stringify(j)));
            }
        }).catch(function (e) {
            socialSetStatus(ytStatus, false, 'Ошибка обмена: ' + e.message);
        });
    }

    ytAuthBtn.addEventListener('click', function () {
        var cid = ytClientId.value.trim();
        var sec = ytClientSecret.value.trim();
        if (!cid || !sec) { socialSetStatus(ytStatus, false, 'Сначала введите Client ID и Client Secret'); return; }
        setStored(YT_CID, cid);
        setStored(YT_SECRET, sec);
        var redirect = window.location.origin + window.location.pathname;
        var url = 'https://accounts.google.com/o/oauth2/v2/auth' +
            '?client_id=' + encodeURIComponent(cid) +
            '&redirect_uri=' + encodeURIComponent(redirect) +
            '&response_type=code' +
            '&scope=' + encodeURIComponent('https://www.googleapis.com/auth/youtube.upload') +
            '&access_type=offline&prompt=consent&state=yt_avtotema';
        socialSetStatus(ytStatus, false, 'Открываем Google… после разрешения вы вернётесь на эту страницу.');
        window.location.href = url;
    });

    ytCheckBtn.addEventListener('click', function () {
        ytCheckBtn.disabled = true;
        socialSetStatus(ytStatus, false, 'Проверяем доступ…');
        getYouTubeAccessToken().then(function (token) {
            return fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
                headers: { 'Authorization': 'Bearer ' + token }
            }).then(function (r) { return r.json(); });
        }).then(function (j) {
            ytCheckBtn.disabled = false;
            if (j.items && j.items.length) {
                socialSetStatus(ytStatus, true, '✅ Доступ работает — канал: «' + j.items[0].snippet.title + '». Можно публиковать.');
            } else {
                socialSetStatus(ytStatus, false, 'Ошибка: ' + ((j.error && j.error.message) || 'канал не найден'));
            }
        }).catch(function (e) {
            ytCheckBtn.disabled = false;
            socialSetStatus(ytStatus, false, 'Ошибка проверки: ' + e.message);
        });
    });

    function getYouTubeAccessToken() {
        return new Promise(function (resolve, reject) {
            syncYouTubeFields();
            var refresh = getStored(YT_REFRESH);
            var cid = getStored(YT_CID);
            var sec = getStored(YT_SECRET);
            if (!refresh || !cid || !sec) { reject(new Error('Нет авторизации YouTube — нажмите «Авторизовать YouTube»')); return; }
            var exp = +getStored(YT_ACCESS_EXP) || 0;
            var acc = getStored(YT_ACCESS);
            if (acc && Date.now() < exp - 60000) { resolve(acc); return; }
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_id: cid, client_secret: sec, refresh_token: refresh, grant_type: 'refresh_token' })
            }).then(function (r) { return r.json(); }).then(function (j) {
                if (!j.access_token) { reject(new Error(j.error_description || 'Не удалось получить токен')); return; }
                setStored(YT_ACCESS, j.access_token);
                setStored(YT_ACCESS_EXP, String(Date.now() + (j.expires_in || 3600) * 1000));
                resolve(j.access_token);
            }).catch(reject);
        });
    }

    ytPublishBtn.addEventListener('click', function () {
        var url = socialVideoURL();
        var a = articles[+socialSelect.value];
        if (!url || !a) { socialSetStatus(ytStatus, false, 'Выберите статью'); return; }
        ytPublishBtn.disabled = true;
        socialSetStatus(ytStatus, false, 'Скачиваем ролик и получаем токен…');
        fetch(url).then(function (r) {
            if (!r.ok) throw new Error('Ролик не найден (HTTP ' + r.status + ') — сначала сгенерируйте видео');
            return r.blob();
        }).then(function (blob) {
            return getYouTubeAccessToken().then(function (token) { return { blob: blob, token: token }; });
        }).then(function (ctx) {
            var size = ctx.blob.size;
            socialSetStatus(ytStatus, false, 'Загружаем на YouTube… (' + Math.round(size / 1024 / 1024) + ' МБ)');
            var meta = {
                snippet: { title: a.title, description: a.text + '\n\nПодпишитесь: https://t.me/avtotema_news', categoryId: '22' },
                status: { privacyStatus: 'public' }
            };
            return fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + ctx.token,
                    'Content-Type': 'application/json',
                    'X-Upload-Content-Type': 'video/mp4',
                    'X-Upload-Content-Length': String(size)
                },
                body: JSON.stringify(meta)
            }).then(function (r) {
                var loc = r.headers.get('Location');
                if (!loc) throw new Error('Не удалось инициировать загрузку (HTTP ' + r.status + ')');
                return fetch(loc, { method: 'PUT', headers: { 'Content-Type': 'video/mp4' }, body: ctx.blob });
            }).then(function (r) { return r.json(); });
        }).then(function (j) {
            ytPublishBtn.disabled = false;
            if (j.id) socialSetStatus(ytStatus, true, '✅ Опубликовано: https://youtu.be/' + j.id);
            else socialSetStatus(ytStatus, false, 'Ошибка: ' + ((j.error && j.error.message) || JSON.stringify(j)));
        }).catch(function (e) {
            ytPublishBtn.disabled = false;
            socialSetStatus(ytStatus, false, e.message);
        });
    });

    igPublishBtn.addEventListener('click', function () {
        var url = socialVideoURL();
        var a = articles[+socialSelect.value];
        var token = igToken.value.trim();
        if (!url || !a) { socialSetStatus(igStatus, false, 'Выберите статью'); return; }
        if (!token) { socialSetStatus(igStatus, false, 'Введите токен Instagram'); return; }
        setStored(IG_TOKEN, token);
        igPublishBtn.disabled = true;
        socialSetStatus(igStatus, false, 'Публикуем Reels…');

        var uid = igUserId.value.trim();
        var first = uid
            ? Promise.resolve(uid)
            : fetch('https://graph.instagram.com/me?fields=id,username&access_token=' + encodeURIComponent(token))
                .then(function (r) { return r.json(); })
                .then(function (j) {
                    if (!j.id) throw new Error((j.error && j.error.message) || 'Не удалось определить ID аккаунта');
                    return j.id;
                });

        first.then(function (id) {
            setStored(IG_UID, id);
            igUserId.value = id;
            var caption = (a.title + '\n\n' + a.text + '\n\nПодпишитесь: https://t.me/avtotema_news').slice(0, 2200);
            var body = new URLSearchParams();
            body.append('media_type', 'REELS');
            body.append('video_url', url);
            body.append('caption', caption);
            body.append('share_to_feed', 'true');
            body.append('access_token', token);
            return fetch('https://graph.instagram.com/' + id + '/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            }).then(function (r) { return r.json(); }).then(function (j) {
                if (!j.id) throw new Error((j.error && j.error.message) || 'Ошибка создания контейнера');
                var p2 = new URLSearchParams();
                p2.append('creation_id', j.id);
                p2.append('access_token', token);
                return fetch('https://graph.instagram.com/' + id + '/media_publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: p2
                }).then(function (r) { return r.json(); });
            });
        }).then(function (j) {
            igPublishBtn.disabled = false;
            if (j.id) socialSetStatus(igStatus, true, '✅ Reels опубликован (media id ' + j.id + ')');
            else socialSetStatus(igStatus, false, 'Ошибка: ' + ((j.error && j.error.message) || JSON.stringify(j)));
        }).catch(function (e) {
            igPublishBtn.disabled = false;
            socialSetStatus(igStatus, false, e.message);
        });
    });

    // ── Публикация Баттла-сравнения в Telegram (Mini App + Опрос) ──
    var sendBattleBtn = document.getElementById('sendBattleBtn');
    var battlePresetSelect = document.getElementById('battlePresetSelect');
    var battleStatus = document.getElementById('battleStatus');

    var BATTLES_DATA = [
        {
            title: 'Битва популярных кроссоверов',
            cars: ['haval-jolion', 'geely-coolray', 'chery-tiggo-7'],
            pollQuestion: 'Какой кроссовер до 3 млн ₽ вы бы выбрали?'
        },
        {
            title: 'Битва флагманских электрокаров',
            cars: ['zeekr-001', 'xiaomi-su7'],
            pollQuestion: 'Zeekr 001 или Xiaomi SU7: за кем будущее?'
        },
        {
            title: 'Рамный внедорожник против Премиум кроссовера',
            cars: ['tank-300', 'exeed-rx'],
            pollQuestion: 'Что лучше для российских дорог: Tank 300 или Exeed RX?'
        },
        {
            title: 'Доступный выбор для города и семьи',
            cars: ['lada-vesta', 'moskvich-3'],
            pollQuestion: 'Лада Vesta NG или Москвич 3?'
        },
        {
            title: 'Битва дальнобойных премиум-гибридов',
            cars: ['li-auto-l7', 'esteo-v27'],
            pollQuestion: 'Какой гибрид с запасом хода >1200 км круче?'
        }
    ];

    if (sendBattleBtn) {
        sendBattleBtn.addEventListener('click', function () {
            var token = getToken();
            var chatId = (destSelect && destSelect.value.trim()) || '@avtotema_news';
            if (!token) {
                battleStatus.className = 'updated error';
                battleStatus.textContent = '❌ Сохраните токен Telegram-бота в блоке настроек выше!';
                return;
            }

            var battleIdx = parseInt(battlePresetSelect ? battlePresetSelect.value : '0', 10);
            var battle = BATTLES_DATA[battleIdx] || BATTLES_DATA[0];

            if (typeof CARS_DATABASE === 'undefined') {
                battleStatus.className = 'updated error';
                battleStatus.textContent = '❌ База автомобилей не загружена!';
                return;
            }

            var selectedCars = battle.cars.map(function (id) {
                return CARS_DATABASE.find(function (c) { return c.id === id; });
            }).filter(Boolean);

            if (selectedCars.length < 2) return;

            var minAccel = Math.min.apply(null, selectedCars.map(function (c) { return c.acceleration; }));
            var maxClearance = Math.max.apply(null, selectedCars.map(function (c) { return c.clearance; }));
            var maxTrunk = Math.max.apply(null, selectedCars.map(function (c) { return c.trunk; }));

            var compareUrl = 'https://avtotema-news.online/compare.html?cars=' + battle.cars.join(',');

            var lines = [
                '⚔️ <b>БИТВА ХАРАКТЕРИСТИК: ' + battle.title.toUpperCase() + '</b> | <i>АвтоТема</i>',
                '━━━━━━━━━━━━━━━━━━━',
                selectedCars.map(function (c) { return '🚗 <b>' + c.name + '</b>'; }).join(' <i>vs</i> '),
                '',
                '📊 <b>Сравнение характеристик «бок о бок»:</b>',
                '',
                '⚡ <b>Разгон 0-100 км/ч:</b>'
            ];

            selectedCars.forEach(function (c) {
                var isWin = c.acceleration === minAccel;
                lines.push('• ' + c.name + ': <b>' + c.acceleration + ' с</b> ' + (isWin ? '🏆 <i>(быстрее всех)</i>' : ''));
            });

            lines.push('', '🏔️ <b>Дорожный просвет (клиренс):</b>');
            selectedCars.forEach(function (c) {
                var isWin = c.clearance === maxClearance;
                lines.push('• ' + c.name + ': <b>' + c.clearance + ' мм</b> ' + (isWin ? '🏆 <i>(выше всех)</i>' : ''));
            });

            lines.push('', '📦 <b>Объём багажника:</b>');
            selectedCars.forEach(function (c) {
                var isWin = c.trunk === maxTrunk;
                lines.push('• ' + c.name + ': <b>' + c.trunk + ' л</b> ' + (isWin ? '🏆 <i>(самый вместительный)</i>' : ''));
            });

            lines.push('', '🐎 <b>Мощность и привод:</b>');
            selectedCars.forEach(function (c) {
                lines.push('• ' + c.name + ': <b>' + c.power + ' л.с.</b>, ' + c.drive);
            });

            lines.push('', '💰 <b>Ориентировочная цена:</b>');
            selectedCars.forEach(function (c) {
                lines.push('• ' + c.name + ': <b>' + c.price + '</b>');
            });

            lines.push(
                '━━━━━━━━━━━━━━━━━━━',
                '👇 <i>Нажмите кнопку ниже, чтобы открыть интерактивное сравнение с полными габаритами и графиками!</i>'
            );

            var text = lines.join('\n');

            var keyboard = {
                inline_keyboard: [
                    [
                        {
                            text: '📊 Интерактивное сравнение (Mini App)',
                            web_app: { url: compareUrl }
                        }
                    ],
                    [
                        {
                            text: '🌐 Открыть на сайте АвтоТема',
                            url: compareUrl
                        }
                    ]
                ]
            };

            var photo = selectedCars[0].image.startsWith('http')
                ? selectedCars[0].image
                : 'https://avtotema-news.online' + selectedCars[0].image;

            sendBattleBtn.disabled = true;
            battleStatus.className = 'updated';
            battleStatus.textContent = '⏳ Публикация баттла в Telegram…';

            fetch('https://api.telegram.org/bot' + token + '/sendPhoto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    photo: photo,
                    caption: text,
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                })
            }).then(function (r) { return r.json(); }).then(function (data) {
                if (data.ok) {
                    battleStatus.className = 'updated success';
                    battleStatus.textContent = '✅ Баттл успешно опубликован в Telegram!';
                    // Отправляем опрос
                    fetch('https://api.telegram.org/bot' + token + '/sendPoll', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            question: battle.pollQuestion,
                            options: selectedCars.map(function (c) { return c.name; }),
                            is_anonymous: false
                        })
                    }).catch(function () {});
                } else {
                    battleStatus.className = 'updated error';
                    battleStatus.textContent = '❌ Ошибка Telegram: ' + (data.description || JSON.stringify(data));
                }
            }).catch(function (e) {
                battleStatus.className = 'updated error';
                battleStatus.textContent = '❌ Ошибка сети: ' + e.message;
            }).finally(function () {
                sendBattleBtn.disabled = false;
            });
        });
    }

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
