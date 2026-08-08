// Скрипт для GitHub Actions: берёт "свежую" статью дня из ARTICLE_BANK и публикует в Telegram
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

const bank = eval(m[1]);
const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const offset = dayOfYear % bank.length;
const article = bank[offset];

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

const text = [
    '🔥 ' + article.title,
    '',
    article.text,
    '',
    '⏱ Читать ~' + article.readTime + ' минут → https://elmankur01.github.io/',
    '',
    '#авто #новости'
].join('\n');

console.log('Публикую:');
console.log(text);

fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false })
}).then(r => r.json()).then(j => {
    if (j.ok) { console.log('✅ Опубликовано'); process.exit(0); }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
