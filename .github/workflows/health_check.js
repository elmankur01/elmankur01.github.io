// Скрипт health check для GitHub Actions.
// Проверяет сайт (HTTP-статусы, sitemap, свежесть Telegram-постов) и шлёт отчёт владельцу в личку.
// Запускается ежедневно по расписанию (health_check.yml).
const SITE = 'https://elmankur01.github.io';

const PAGES = [
    { path: '/', name: 'Главная' },
    { path: '/privacy.html', name: 'Политика' },
    { path: '/terms.html', name: 'Соглашение' },
    { path: '/sitemap.xml', name: 'Sitemap' },
    { path: '/robots.txt', name: 'Robots' },
    { path: '/articles/elektromobili-v-2026-godu-gonka-za-zapasom-khoda-v-1000-km.html', name: 'Статья (пример)' }
];

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function checkPage(path) {
    try {
        const r = await fetch(SITE + path, { redirect: 'manual' });
        return { status: r.status, ok: r.status === 200 };
    } catch (e) {
        return { status: 'ERR', ok: false };
    }
}

async function checkSitemap() {
    try {
        const r = await fetch(SITE + '/sitemap.xml');
        if (r.status !== 200) return { ok: false, message: 'sitemap вернул ' + r.status };
        const xml = await r.text();
        const urlCount = (xml.match(/<url>/g) || []).length;
        const oldLinks = (xml.match(/article-\d+\.html/g) || []).length;
        const hasDeclaration = xml.startsWith('<?xml');
        const isWellFormed = !xml.includes('<url>\n  <loc>') && hasDeclaration;
        const ok = isWellFormed && urlCount > 0 && oldLinks === 0;
        return {
            ok,
            message: `URL: ${urlCount}, старых article-N: ${oldLinks}, XML-заголовок: ${hasDeclaration ? 'да' : 'нет'}`
        };
    } catch (e) {
        return { ok: false, message: 'sitemap недоступен' };
    }
}

async function checkLastPost() {
    try {
        const r = await fetch('https://api.telegram.org/bot' + TOKEN + '/getUpdates');
        const j = await r.json();
        if (!j.ok) return { ok: false, message: 'Telegram API: ' + (j.description || 'ошибка') };
        const posts = (j.result || []).filter(u => u.channel_post && u.channel_post.message_id);
        if (posts.length === 0) return { ok: false, message: 'в буфере нет постов' };
        const last = posts[posts.length - 1].channel_post;
        const ageDays = (Date.now() / 1000 - last.date) / 86400;
        const fresh = ageDays < 2;
        return { ok: fresh, message: 'последний пост ' + Math.round(ageDays * 10) / 10 + ' дн. назад' };
    } catch (e) {
        return { ok: false, message: 'Telegram недоступен' };
    }
}

async function sendReport(text) {
    const r = await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: OWNER_CHAT_ID, text, parse_mode: 'HTML' })
    });
    const j = await r.json();
    if (!j.ok) {
        console.error('Ошибка отправки отчёта:', JSON.stringify(j));
        process.exit(1);
    }
    console.log('Отчёт отправлен владельцу');
}

(async () => {
    const lines = [];
    const errors = [];

    lines.push('🔍 <b>Отчёт о сайте АвтоТема</b>');
    lines.push('');

    let allOk = true;

    for (const p of PAGES) {
        const res = await checkPage(p.path);
        const mark = res.ok ? '✅' : '❌';
        lines.push(`${mark} ${p.name}: ${res.status}`);
        if (!res.ok) { allOk = false; errors.push(p.name + ' → ' + res.status); }
    }

    const sitemap = await checkSitemap();
    lines.push((sitemap.ok ? '✅' : '❌') + ' Sitemap: ' + sitemap.message);
    if (!sitemap.ok) { allOk = false; errors.push('sitemap'); }

    const post = await checkLastPost();
    lines.push((post.ok ? '✅' : '❌') + ' Telegram-посты: ' + post.message);
    if (!post.ok) { allOk = false; errors.push('telegram'); }

    lines.push('');
    lines.push(allOk
        ? '✅ <b>Всё в порядке</b>'
        : '⚠️ <b>Проблемы:</b> ' + escHtml(errors.join(', ')));

    console.log(lines.join('\n'));
    await sendReport(lines.join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
