// Скрипт для GitHub Actions: берёт «свежую» статью из ARTICLE_BANK и публикует в Telegram.
// Запускается 4 раза в день (каждые 6 часов): день года + 6-часовой слот определяют статью,
// поэтому каждый пост — новая статья.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

const bank = eval(m[1]);
let slugs = {};
try { slugs = require('../../article_images.js').SLUGS || {}; } catch (e) {}
const now = new Date();
const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const slot = Math.floor(now.getUTCHours() / 6);
const offset = (dayOfYear * 4 + slot) % bank.length;
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
    '⏱ Читать ~' + article.readTime + ' минут',
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

console.log('Публикую:');
console.log(text);

fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup })
}).then(r => r.json()).then(j => {
    if (j.ok) { console.log('✅ Опубликовано'); process.exit(0); }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
