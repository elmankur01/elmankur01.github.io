// Скрипт для GitHub Actions: отправляет в Telegram дайджест «Итоги недели».
// Собирает статьи, опубликованные в канале за последние 7 дней (state/posted.json,
// записи { n, d } — дата публикации), и шлёт один пост со списком.
// Дайджест ничего не коммитит: статьи уже отмечены в posted.json при публикации.
// Токен берётся из секрета TELEGRAM_BOT_TOKEN, ID канала — из секрета TELEGRAM_CHAT_ID
const fs = require('fs');
const vm = require('vm');
const { loadPostedWithDates } = require('./posted_state');

const src = fs.readFileSync('script.js', 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }

// Безопасный разбор литерала вместо eval
const bank = vm.runInNewContext('(' + m[1] + ')', Object.create(null), { timeout: 3000 });
let slugs = {};
try { slugs = require('../../article_images.js').SLUGS || {}; } catch (e) {}

const WEEK_MS = 7 * 86400000;
const now = new Date();
const weekAgo = now.getTime() - WEEK_MS;

const items = loadPostedWithDates()
    .filter(x => x.d && new Date(x.d).getTime() >= weekAgo)
    .sort((a, b) => new Date(a.d) - new Date(b.d))
    .map(x => ({ n: x.n, d: new Date(x.d), article: bank[x.n - 1] }))
    .filter(x => x.article);

if (!items.length) {
    console.log('За последнюю неделю публикаций в Telegram не было — дайджест пропущен');
    process.exit(0);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); process.exit(1); }

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
function fmt(d) {
    const wd = WEEKDAYS[(d.getUTCDay() + 6) % 7];
    return wd + ', ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()];
}

const MAX_ITEMS = 15;
const show = items.slice(0, MAX_ITEMS);
const lines = show.map(it => {
    const url = 'https://avtotema-news.online/articles/' + (slugs[it.n] || ('article-' + it.n)) + '.html';
    return '• ' + fmt(it.d) + ' — <b>' + escHtml(it.article.title) + '</b>\n   <a href="' + url + '">читать</a>';
});
if (items.length > MAX_ITEMS) {
    lines.push('… и ещё ' + (items.length - MAX_ITEMS) + ' статей на сайте');
}

const first = fmt(items[0].d);
const last = fmt(items[items.length - 1].d);
const period = first === last ? first : first + '–' + last.split(', ')[1];

const text = [
    '📊 <b>ИТОГИ НЕДЕЛИ НА АВТОТЕМЕ</b> | <i>Дайджест</i>',
    '━━━━━━━━━━━━━━━━━━━',
    '',
    'Главные автомобильные события и статьи за неделю (<b>' + period + '</b>):',
    '',
    ...lines,
    '',
    '━━━━━━━━━━━━━━━━━━━',
    '📰 <b>Все статьи и новости на официальном сайте:</b>',
    '🔗 <a href="https://avtotema-news.online/">avtotema-news.online</a>',
    '',
    '📢 <b>Подписывайтесь:</b> <a href="https://t.me/avtotema_news">@avtotema_news</a>',
    '',
    '#авто #дайджест #неделя #автоновости'
].join('\n');

const replyMarkup = {
    inline_keyboard: [
        [{ text: '🚗 Читать все статьи на сайте ↗', url: 'https://avtotema-news.online/' }],
        [{ text: '📢 Подписаться на канал', url: 'https://t.me/avtotema_news' }]
    ]
};

console.log('Отправляю дайджест:');
console.log(text);

fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false, reply_markup: replyMarkup })
}).then(r => r.json()).then(j => {
    if (j.ok) { console.log('✅ Дайджест опубликован'); process.exit(0); }
    else { console.error('Ошибка Telegram:', JSON.stringify(j)); process.exit(1); }
}).catch(e => { console.error(e); process.exit(1); });
