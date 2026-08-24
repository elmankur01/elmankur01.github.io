// Скрипт для GitHub Actions: берёт статью из ARTICLE_BANK и публикует в Telegram.
// Запускается 4 раза в день (каждые 6 часов).
// Выбор статьи: сначала публикуются САМЫЕ СВЕЖИЕ неопубликованные (максимальный номер),
// затем по убыванию — так автоновости попадают в канал сразу после появления на сайте.
// Уже опубликованные (state/posted.json) повторно не выходят; когда весь банк опубликован,
// пост не отправляется до добавления новых статей.
// Подпись поста формируется из полного текста статьи (BODIES), а не из короткого анонса.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');
const vm = require('vm');
const { loadPosted, savePosted, commitAndPush } = require('./posted_state');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

// Безопасный разбор литерала вместо eval
const bank = vm.runInNewContext('(' + m[1] + ')', Object.create(null), { timeout: 3000 });

let slugs = {}, images = {}, bodies = [];
try {
    const imgMod = require('../../article_images.js');
    slugs = imgMod.SLUGS || {};
    images = imgMod.IMAGES || {};
} catch (e) {}
try {
    bodies = require('../../article_content.js').BODIES || [];
} catch (e) {}

// Свежие неопубликованные — первыми: ищем максимальный номер вне posted.json
const posted = new Set(loadPosted());
let nextN = 0;
for (let n = bank.length; n >= 1; n--) {
    if (!posted.has(n)) { nextN = n; break; }
}
if (!nextN) {
    console.log('Весь ARTICLE_BANK уже опубликован. Добавьте новые статьи, чтобы посты продолжились.');
    process.exit(0);
}
const offset = nextN - 1;
const article = bank[offset];

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const tagIcons = {
    'Новые модели': '🚗',
    'Электромобили': '⚡',
    'Двигатели': '🔧',
    'История марок': '🏛️',
    'Мировые новости': '🌍',
    'Новости рынка': '📊',
    'Авто лайфхаки': '💡'
};
const icon = tagIcons[article.tag] || '🚗';

// Подпись: полный текст статьи (все абзацы), при необходимости укорачиваем до лимита Telegram (~1024 знака на caption)
let bodyText = Array.isArray(bodies[offset]) ? bodies[offset].join('\n\n') : '';
if (bodyText.length > 850) bodyText = bodyText.slice(0, 850).replace(/\s+\S*$/, '') + '…';
if (!bodyText) bodyText = article.text;

const url = 'https://avtotema-news.online/articles/' + (slugs[nextN] || ('article-' + nextN)) + '.html';

const text = [
    icon + ' <b>' + (article.tag || 'Автоновости').toUpperCase() + '</b> | <i>АвтоТема</i>',
    '━━━━━━━━━━━━━━━━━━━',
    '',
    '🔥 <b>' + escHtml(article.title) + '</b>',
    '',
    escHtml(bodyText),
    '',
    '⏱ <i>Время чтения: ~' + (article.readTime || 5) + ' мин</i>',
    '',
    '━━━━━━━━━━━━━━━━━━━',
    '👉 <b>Читать полную версию статьи:</b>',
    '🔗 <a href="' + url + '">avtotema-news.online</a>',
    '',
    '📢 <b>Подписывайтесь:</b> <a href="https://t.me/avtotema_news">@avtotema_news</a>',
    '',
    '#авто #новости #' + ((article.tag || 'новости').replace(/\s+/g, '_').toLowerCase())
].join('\n');

const replyMarkup = {
    inline_keyboard: [
        [{ text: '📖 Читать статью на сайте ↗', url: url }],
        [{ text: '🚗 Все новости на АвтоТеме', url: 'https://avtotema-news.online/' }]
    ]
};

const img = images[nextN];
const photoUrl = (img && img.url) ? ('https://avtotema-news.online' + img.url) : null;
const apiMethod = photoUrl ? 'sendPhoto' : 'sendMessage';
const apiPayload = photoUrl
    ? { chat_id: chatId, photo: photoUrl, caption: text, parse_mode: 'HTML', reply_markup: replyMarkup }
    : { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup };

fetch('https://api.telegram.org/bot' + token + '/' + apiMethod, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload)
}).then(r => r.json()).then(j => {
    if (j.ok) {
        console.log('✅ Опубликовано (' + apiMethod + ', статья #' + nextN + ')');
        const postedList = loadPosted();
        postedList.push(nextN);
        savePosted(postedList);
        commitAndPush();
        process.exit(0);
    }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
