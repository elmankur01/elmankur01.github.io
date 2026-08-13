// Скрипт для GitHub Actions: берёт «свежую» статью из ARTICLE_BANK и публикует в Telegram.
// Запускается 4 раза в день (каждые 6 часов). Статья выбирается по дню года и слоту,
// но уже опубликованные (см. state/posted.json) пропускаются — повторные посты исключены.
// Когда весь банк опубликован, пост не отправляется до добавления новых статей.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');
const { loadPosted, savePosted, commitAndPush } = require('./posted_state');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

const bank = eval(m[1]);
let slugs = {}, images = {};
try {
    const imgMod = require('../../article_images.js');
    slugs = imgMod.SLUGS || {};
    images = imgMod.IMAGES || {};
} catch (e) {}
const now = new Date();
const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const slot = Math.floor(now.getUTCHours() / 6);
const posted = new Set(loadPosted());
let offset = (dayOfYear * 4 + slot) % bank.length;
let guard = 0;
while (posted.has(offset + 1) && guard < bank.length) {
    offset = (offset + 1) % bank.length;
    guard++;
}
if (guard >= bank.length) {
    console.log('Весь ARTICLE_BANK уже опубликован. Добавьте новые статьи, чтобы посты продолжились.');
    process.exit(0);
}
const article = bank[offset];

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const url = 'https://elmankur01.github.io/articles/' + (slugs[offset + 1] || ('article-' + (offset + 1))) + '.html';

const text = [
    '🔥 <b>' + escHtml(article.title) + '</b>',
    '',
    escHtml(article.text),
    '',
    '📰 <a href="' + url + '">Читать на АвтоТеме</a>',
    '',
    'Подпишитесь: <a href="https://t.me/avtotema_news">@avtotema_news</a>',
    '',
    '#авто #новости'
].join('\n');

const replyMarkup = {
    inline_keyboard: [[{ text: '📰 Читать на АвтоТеме', url }]]
};

const img = images[offset + 1];
const photoUrl = (img && img.url) ? ('https://elmankur01.github.io' + img.url) : null;
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
        console.log('✅ Опубликовано (' + apiMethod + ')');
        const posted = loadPosted();
        posted.push(offset + 1);
        savePosted(posted);
        commitAndPush();
        process.exit(0);
    }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
