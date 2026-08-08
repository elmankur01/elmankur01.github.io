// Скрипт для GitHub Actions: публикует в Telegram статью дня по заданной рубрике.
// Рубрика передаётся через переменную окружения POST_CATEGORY
// (например, "Российские авто" или "Новости рынка"). Одна публикация в день.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

const bank = eval(m[1]);

const category = process.env.POST_CATEGORY || '';
if (!category) { console.error('Нет POST_CATEGORY'); process.exit(1); }

const items = bank.map((a, i) => ({ a, i })).filter(x => x.a.tag === category);
if (!items.length) { console.error('Нет статей с рубрикой: ' + category); process.exit(1); }

const now = new Date();
const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const pick = items[dayOfYear % items.length];

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

const icon = category === 'Российские авто' ? '🇷🇺' : '📊';
const text = [
    icon + ' ' + pick.a.title,
    '',
    pick.a.text,
    '',
    '⏱ Читать ~' + pick.a.readTime + ' минут → https://elmankur01.github.io/articles/article-' + (pick.i + 1) + '.html',
    '',
    '#' + category.split(' ')[0].toLowerCase() + ' #авто'
].join('\n');

console.log('Публикую [' + category + ']:');
console.log(text);

fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false })
}).then(r => r.json()).then(j => {
    if (j.ok) { console.log('✅ Опубликовано'); process.exit(0); }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
