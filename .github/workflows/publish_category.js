// Скрипт для GitHub Actions: публикует в Telegram статью дня по заданной рубрике.
// Рубрика передаётся через переменную окружения POST_CATEGORY
// (например, "Мировые новости" или "Новости рынка"). Одна публикация в день.
// Статья выбирается по дню года, но уже опубликованные (см. state/posted.json)
// пропускаются — повторные посты исключены.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');
const vm = require('vm');
const { loadPosted, savePosted, commitAndPush } = require('./posted_state');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

// Безопасный разбор литерала вместо eval
const bank = vm.runInNewContext('(' + m[1] + ')', Object.create(null), { timeout: 3000 });

const category = process.env.POST_CATEGORY || '';
if (!category) { console.error('Нет POST_CATEGORY'); process.exit(1); }

const items = bank.map((a, i) => ({ a, i })).filter(x => x.a.tag === category);
if (!items.length) { console.error('Нет статей с рубрикой: ' + category); process.exit(1); }

let slugs = {}, images = {};
try {
    const imgMod = require('../../article_images.js');
    slugs = imgMod.SLUGS || {};
    images = imgMod.IMAGES || {};
} catch (e) {}

const now = new Date();
const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
// Основной постинг (daily_post) сегодня отправит 4 статьи по слоту (0, 6, 12, 18 UTC).
// Не публикуем рубричную статью, если она уже стоит в этих слотах — иначе дубль в канале.
const mainPicks = [0, 1, 2, 3].map(k => (dayOfYear * 4 + k) % bank.length);
const posted = new Set(loadPosted());
let pick = null;
for (const it of items) {
    if (posted.has(it.i + 1)) continue;
    if (mainPicks.indexOf(it.i) !== -1) continue;
    pick = it;
    break;
}
if (!pick) {
    console.log('Все статьи рубрики [' + category + '] уже опубликованы. Добавьте новые статьи в банк.');
    process.exit(0);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

const icon = category === 'Мировые новости' ? '🌍' : category === 'Авто лайфхаки' ? '💡' : '📊';
const label = category === 'Авто лайфхаки' ? '💡 Авто лайфхак' : null;
const tagMap = {
    'Авто лайфхаки': '#лайфхаки #авто',
    'Мировые новости': '#новости #авто #мир',
    'Новости рынка': '#новости рынка #авто'
};
const url = 'https://avtotema-news.online/articles/' + (slugs[pick.i + 1] || ('article-' + (pick.i + 1))) + '.html';

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPostText(bodyContent) {
    return [
        icon + ' <b>' + category.toUpperCase() + '</b> | <i>АвтоТема</i>',
        '━━━━━━━━━━━━━━━━━━━',
        '',
        '🔥 <b>' + escHtml(pick.a.title) + '</b>',
        '',
        escHtml(bodyContent),
        '',
        '⏱ <i>Время чтения: ~' + (pick.a.readTime || 5) + ' мин</i>',
        '',
        '━━━━━━━━━━━━━━━━━━━',
        '👉 <b>Читать полную версию статьи:</b>',
        '🔗 <a href="' + url + '">avtotema-news.online</a>',
        '',
        '📢 <b>Подписывайтесь:</b> <a href="https://t.me/avtotema_news">@avtotema_news</a>',
        '',
        tagMap[category] || ('#' + category.replace(/\s+/g, '_').toLowerCase() + ' #авто')
    ].join('\n');
}

let bodyText = pick.a.text || '';
const img = images[pick.i + 1];
const photoUrl = (img && img.url) ? ('https://avtotema-news.online' + img.url) : null;

let text = buildPostText(bodyText);
if (photoUrl && text.length > 1000) {
    const excess = text.length - 1000;
    const targetLen = Math.max(100, bodyText.length - excess - 15);
    bodyText = bodyText.slice(0, targetLen).replace(/\s+\S*$/, '') + '…';
    text = buildPostText(bodyText);
}

const replyMarkup = {
    inline_keyboard: [
        [{ text: '📖 Читать статью на сайте ↗', url: url }],
        [{ text: '🚗 Все новости на АвтоТеме', url: 'https://avtotema-news.online/' }]
    ]
};

async function send() {
    let method = photoUrl ? 'sendPhoto' : 'sendMessage';
    let payload = photoUrl
        ? { chat_id: chatId, photo: photoUrl, caption: text, parse_mode: 'HTML', reply_markup: replyMarkup }
        : { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup };

    try {
        let r = await fetch('https://api.telegram.org/bot' + token + '/' + method, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        let j = await r.json();

        // Если отправка фото вернула ошибку, делаем автоматический фоллбек на текстовое сообщение
        if (!j.ok && photoUrl) {
            console.warn('sendPhoto не удался (' + (j.description || '') + '), отправляю как sendMessage...');
            method = 'sendMessage';
            payload = { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup };
            r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            j = await r.json();
        }

        if (j.ok) {
            console.log('✅ Опубликовано (' + method + ')');
            const posted = loadPosted();
            posted.push(pick.i + 1);
            savePosted(posted);
            commitAndPush();
            process.exit(0);
        } else {
            console.error('Ошибка Telegram:', JSON.stringify(j));
            process.exit(1);
        }
    } catch (e) {
        console.error('Ошибка сети:', e);
        process.exit(1);
    }
}

send();
