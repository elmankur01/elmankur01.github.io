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
            list.push('https://elmankur01.github.io/videos/out_' + n + '_' + slug + '.mp4');
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
        return 'https://elmankur01.github.io/videos/out_' + (idx + 1) + '_' + slug + '.mp4';
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

    // OAuth-callback: admin.html?code=...&state=yt_avtotema (возврат с Google)
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
