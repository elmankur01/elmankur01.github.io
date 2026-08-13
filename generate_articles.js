// Генератор страниц статей для многостраничного блога
// Читает ARTICLE_BANK из script.js и BODIES из article_content.js,
// создаёт articles/article-N.html и обновляет sitemap.xml.
// Запуск: node generate_articles.js  (локально или в GitHub Actions)
const fs = require('fs');
const path = require('path');

const SITE = 'https://elmankur01.github.io';
const TODAY = new Date().toISOString().slice(0, 10);

const src = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const m = src.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!m) { console.error('ARTICLE_BANK не найден'); process.exit(1); }
const bank = eval(m[1]);

let bodies = [];
let sources = [];
let images = [];
let slugs = {};
try {
    const content = require('./article_content.js');
    bodies = content.BODIES || content;
    sources = content.SOURCES || [];
    images = content.IMAGES || [];
    slugs = content.SLUGS || {};
} catch (e) {}

const outDir = path.join(__dirname, 'articles');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.html')) fs.unlinkSync(path.join(outDir, f));
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tagAnchor(tag) {
    const map = {
        'Новости рынка': 'market',
        'Новые модели': 'topics',
        'Электромобили': 'topics',
        'Двигатели': 'topics',
        'История марок': 'history',
        'Мировые новости': 'world',
        'Авто лайфхаки': 'tips'
    };
    return map[tag] || 'topics';
}

function enc(s) {
    return encodeURIComponent(String(s));
}

function breadcrumbs(article, slug) {
    return `<nav class="breadcrumbs" aria-label="Хлебные крошки">
                        <a href="/">Главная</a>
                        <span class="crumb-sep" aria-hidden="true">→</span>
                        <a href="/#${tagAnchor(article.tag)}">${esc(article.tag)}</a>
                        <span class="crumb-sep" aria-hidden="true">→</span>
                        <span class="crumb-current">${esc(article.title)}</span>
                    </nav>`;
}

function shareBlock(article, slug) {
    const url = enc(`${SITE}/articles/${slug}.html`);
    const title = enc(article.title);
    return `<div class="share-block">
                        <span class="share-label">Поделиться:</span>
                        <a class="share-btn share-vk" href="https://vk.com/share.php?url=${url}" target="_blank" rel="noopener nofollow">ВКонтакте</a>
                        <a class="share-btn share-tg" href="https://t.me/share/url?url=${url}&text=${title}" target="_blank" rel="noopener nofollow">Telegram</a>
                        <button class="share-btn share-copy" id="copyBtn">Скопировать ссылку</button>
                    </div>`;
}

function dateFor(n) {
    return new Date(2026, 7, 1 + n).toISOString().slice(0, 10);
}

function paragraphs(article, n) {
    const body = bodies[n - 1] || [article.text];
    return body.map(p => `<p>${esc(p)}</p>`).join('\n                        ');
}

function sourcesBlock(n) {
    const list = sources[n - 1];
    if (!list || !list.length) return '';
    const items = list.map(s =>
        `                        <li><a href="${s.url}" target="_blank" rel="noopener nofollow">${esc(s.name)}</a></li>`
    ).join('\n');
    return `
                        <div class="article-sources">
                            <h3>Источники</h3>
                            <p>Информация в статье основана на официальных материалах автопроизводителей и отраслевых организаций:</p>
                            <ul>
${items}
                            </ul>
                        </div>`;
}

function heroImage(n) {
    const img = images[n];
    if (!img || !img.url) return '';
    const alt = img.alt || bank[n - 1].title;
    const credit = img.credit ? `<span class="article-credit">${esc(img.credit)}</span>` : '';
    return `                    <figure class="article-hero">
                        <img src="${esc(img.url)}" alt="${esc(alt)}" loading="lazy" width="800" height="450">
                        <figcaption>${esc(alt)} ${credit}</figcaption>
                    </figure>`;
}

// Похожие статьи: сначала из той же рубрики, потом добираем другими.
// Стартовая позиция сдвигается от номера статьи + приоритет у «свежих» целей,
// чтобы «похожие» не повторялись и все статьи получали входящие ссылки.
const relatedSeen = new Set();
function pickFresh(pool, k, n, seed) {
    if (!k || !pool.length) return [];
    const start = (n * seed) % pool.length;
    const ordered = [...pool.slice(start), ...pool.slice(0, start)];
    const fresh = ordered.filter(x => !relatedSeen.has(x.i));
    const already = ordered.filter(x => relatedSeen.has(x.i));
    return [...fresh, ...already].slice(0, k);
}

function relatedArticles(n, count) {
    const current = bank[n - 1];
    const sameTag = bank
        .map((a, i) => ({ a, i }))
        .filter(x => x.a.tag === current.tag && x.i !== n - 1);
    const others = bank
        .map((a, i) => ({ a, i }))
        .filter(x => x.a.tag !== current.tag);

    const wantSame = Math.min(2, sameTag.length);
    const same = pickFresh(sameTag, wantSame, n, 3);

    const used = new Set(same.map(x => x.i));
    const rest = pickFresh(others.filter(x => !used.has(x.i)), count - same.length, n, 5);

    same.forEach(r => relatedSeen.add(r.i));
    rest.forEach(r => relatedSeen.add(r.i));
    return [...same, ...rest];
}

function page(article, n) {
    const slug = slugs[n] || ('article-' + n);
    const img = images[n];
    const ogImg = (img && img.url) ? (img.url.startsWith('http') ? img.url : `${SITE}/${img.url.replace(/^\//, '')}`) : `${SITE}/og-image.png`;

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="${esc(article.title)}">
    <meta property="og:description" content="${esc(article.text)}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="АвтоТема">
    <meta property="og:url" content="${SITE}/articles/${slug}.html">
    <meta property="og:image" content="${ogImg}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="675">
    <meta property="og:image:alt" content="${esc(article.title)}">
    <title>${esc(article.title)} | АвтоТема</title>
    ...
</head>
<body>
    <div class="reading-progress" id="progress"></div>
    <header class="header">

        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="36" height="36"></span>Авто<span>Тема</span></a>
            <nav class="nav">
                <ul class="nav-list">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/#topics">Рубрики</a></li>
                    <li><a href="/#subscribe">Подписка</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="article-page section">
            <div class="container">
                ${breadcrumbs(article, slug)}
                <article class="article-full">
                    <span class="tag">${esc(article.tag)}</span>
                    <h1>${esc(article.title)}</h1>
                    <span class="article-meta">${article.readTime} мин · ${dateFor(n)}</span>
                    ${heroImage(n)}
                    <div class="article-body">
                        ${paragraphs(article, n)}
                    </div>
                    ${shareBlock(article, slug)}
                    ${sourcesBlock(n)}
                </article>

                <aside class="related">
                    <h2>Читайте также</h2>
                    <div class="articles-grid">
                        ${relatedArticles(n, 3).map(({ a, i }) => {
                            const ri = i + 1;
                            const rSlug = slugs[ri] || ('article-' + ri);
                            const rImg = images[ri];
                            const rMedia = rImg && rImg.url
                                ? `<div class="card-media"><img src="${esc(rImg.url)}" alt="${esc(rImg.alt || a.title)}" loading="lazy" width="800" height="450"></div>`
                                : '';
                            return `<article class="article-card">
                                ${rMedia}
                                <span class="card-tag">${esc(a.tag)}</span>
                                <div class="card-body">
                                    <h3><a href="${rSlug}.html">${esc(a.title)}</a></h3>
                                    <p>${esc(a.text)}</p>
                                    <div class="card-meta">
                                        <span class="article-meta">${a.readTime} мин</span>
                                        <span class="card-arrow" aria-hidden="true">→</span>
                                    </div>
                                </div>
                            </article>`;
                        }).join('\n')}
                    </div>
                </aside>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-bottom">
            <p>© <span id="year"></span> АвтоТема. Все права защищены. ·
                <a href="/privacy.html">Политика конфиденциальности</a> ·
                <a href="/terms.html">Пользовательское соглашение</a> ·
                <a href="/">Главная</a>
            </p>
            <p class="age-mark"><span class="age-badge">0+</span> Сайт не содержит материалов, причиняющих вред здоровью и развитию детей (436-ФЗ)</p>
        </div>
    </footer>

    <script src="/footer.js"></script>
</body>
</html>`;
}

function sitemap() {
    const legal = [
        { path: 'privacy.html', freq: 'yearly', priority: '0.3' },
        { path: 'terms.html', freq: 'yearly', priority: '0.3' }
    ];
    let out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    for (const p of legal) {
        out += `  <url>\n    <loc>${SITE}/${p.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }
    for (let i = 0; i < bank.length; i++) {
        const slug = slugs[i + 1] || ('article-' + (i + 1));
        out += `  <url>\n    <loc>${SITE}/articles/${slug}.html</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    return out + '</urlset>\n';
}

// Заглушка со старым адресом article-N.html: переадресация на ЧПУ-страницу.
// Мета-редирект не требует JS и не нарушает CSP. noindex, чтобы в индексе
// оставалась только основная ЧПУ-версия.
function redirectStub(article, n) {
    const slug = slugs[n] || ('article-' + n);
    const target = `${SITE}/articles/${slug}.html`;
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(article.title)} | АвтоТема</title>
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; object-src 'none'; base-uri 'self'">
    <link rel="canonical" href="${target}">
    <meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
    <p>Статья переехала на новый адрес: <a href="${target}">${esc(article.title)}</a></p>
</body>
</html>`;
}

for (let n = 1; n <= bank.length; n++) {
    const slug = slugs[n] || ('article-' + n);
    fs.writeFileSync(path.join(outDir, `${slug}.html`), page(bank[n - 1], n));
    fs.writeFileSync(path.join(outDir, `article-${n}.html`), redirectStub(bank[n - 1], n));
}
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
console.log(`Сгенерировано страниц: ${bank.length}, sitemap обновлён`);
