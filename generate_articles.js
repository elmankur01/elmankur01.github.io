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
try { bodies = require('./article_content.js'); } catch (e) {}

const outDir = path.join(__dirname, 'articles');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
    if (/^article-\d+\.html$/.test(f)) fs.unlinkSync(path.join(outDir, f));
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function dateFor(n) {
    return new Date(2026, 7, 1 + n).toISOString().slice(0, 10);
}

function paragraphs(article, n) {
    const body = bodies[n - 1] || [article.text];
    return body.map(p => `<p>${esc(p)}</p>`).join('\n                        ');
}

function page(article, n) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(article.title)} | АвтоТема</title>
    <meta name="description" content="${esc(article.text)}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#0b0f14">
    <meta property="og:title" content="${esc(article.title)}">
    <meta property="og:description" content="${esc(article.text)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${SITE}/articles/article-${n}.html">
    <meta property="og:locale" content="ru_RU">
    <link rel="canonical" href="${SITE}/articles/article-${n}.html">
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ${JSON.stringify(article.title)},
        "description": ${JSON.stringify(article.text)},
        "datePublished": "${dateFor(n)}",
        "inLanguage": "ru",
        "mainEntityOfPage": "${SITE}/articles/article-${n}.html",
        "publisher": { "@type": "Organization", "name": "АвтоТема" }
    }
    </script>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><i class="logo-svg">🚗</i></span>Авто<span>Тема</span></a>
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
                <a href="/#news" class="back-link">← К новостям</a>
                <article class="article-full">
                    <span class="tag">${esc(article.tag)}</span>
                    <h1>${esc(article.title)}</h1>
                    <span class="article-meta">${article.readTime} мин · ${dateFor(n)}</span>
                    <div class="article-body">
                        ${paragraphs(article, n)}
                    </div>
                </article>

                <aside class="related">
                    <h2>Читайте также</h2>
                    <div class="articles-grid">
                        ${[1, 2, 3].map(k => {
                            const r = bank[(n - 1 + k) % bank.length];
                            const ri = bank.indexOf(r) + 1;
                            return `<article class="article-card">
                                <span class="tag">${esc(r.tag)}</span>
                                <h3><a href="article-${ri}.html">${esc(r.title)}</a></h3>
                                <p>${esc(r.text)}</p>
                                <span class="article-meta">${r.readTime} мин</span>
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
                <a href="/">Главная</a> ·
                <a href="mailto:elmankur01@gmail.com">Контакты</a>
            </p>
        </div>
    </footer>

    <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body>
</html>`;
}

function sitemap() {
    let out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    for (let i = 0; i < bank.length; i++) {
        out += `  <url>\n    <loc>${SITE}/articles/article-${i + 1}.html</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    return out + '</urlset>\n';
}

for (let n = 1; n <= bank.length; n++) {
    fs.writeFileSync(path.join(outDir, `article-${n}.html`), page(bank[n - 1], n));
}
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
console.log(`Сгенерировано страниц: ${bank.length}, sitemap обновлён`);
