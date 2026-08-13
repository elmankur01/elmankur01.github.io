// Скрипт health check для GitHub Actions.
// Проверяет сайт (HTTP-статусы, sitemap, свежесть Telegram-постов) и шлёт отчёт владельцу в личку.
// Запускается ежедневно по расписанию (health_check.yml).
const SITE = 'https://avtotema-news.online';

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
        const token = process.env.GH_TOKEN || '';
        const headers = token ? { Authorization: 'Bearer ' + token } : {};
        const r = await fetch('https://api.github.com/repos/elmankur01/elmankur01.github.io/actions/workflows/329974970/runs?per_page=1', { headers });
        if (r.status !== 200) return { ok: false, message: 'GitHub API: ' + r.status };
        const j = await r.json();
        const runs = j.workflow_runs || [];
        if (runs.length === 0) return { ok: false, message: 'запусков ещё не было' };
        const last = runs[0];
        const ageHours = (Date.now() - new Date(last.created_at).getTime()) / 3600000;
        const ok = last.conclusion === 'success' && ageHours < 30;
        return {
            ok,
            message: (last.conclusion === 'success' ? 'последний успешен' : 'последний: ' + last.conclusion)
                + ', ' + Math.round(ageHours * 10) / 10 + ' ч назад'
        };
    } catch (e) {
        return { ok: false, message: 'GitHub недоступен' };
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
