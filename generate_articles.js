// Генератор страниц статей, хаб-страниц брендов, тегов и sitemap.xml
// Читает ARTICLE_BANK из script.js, BODIES из article_content.js и BRANDS/TAGS из seo_taxonomy.js
// Запуск: node generate_articles.js
const fs = require('fs');
const path = require('path');
const { BRANDS, TAGS } = require('./seo_taxonomy.js');

const SITE = 'https://avtotema-news.online';
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

const brandsDir = path.join(__dirname, 'brands');
fs.mkdirSync(brandsDir, { recursive: true });

const tagsDir = path.join(__dirname, 'tags');
fs.mkdirSync(tagsDir, { recursive: true });

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
                        <span class="current" aria-current="page">${esc(article.title)}</span>
                    </nav>`;
}

function readerToolbar(article, n) {
    return `<div class="reader-toolbar">
                        <button type="button" class="btn-read-aloud" id="readAloudBtn" data-state="idle" aria-label="Слушать статью">
                            <span class="read-icon">🔊</span>
                            <span class="read-label">Слушать</span>
                            <span class="read-time-hint">~${article.readTime} мин</span>
                        </button>
                        <div class="reading-stats">
                            <span class="reading-stat-item">⏱️ ${article.readTime} мин чтения</span>
                        </div>
                    </div>`;
}

function reactionsBlock(article, n) {
    return `<div class="article-reactions" id="articleReactions">
                        <div class="reactions-heading">Понравилась статья? Оцените материал:</div>
                        <div class="reactions-actions">
                            <button type="button" class="reaction-like-btn" id="articleLikeBtn" data-id="${n}" aria-label="Поставить лайк">
                                <span class="reaction-icon">❤️</span>
                                <span class="reaction-label">Полезно</span>
                                <span class="reaction-count" id="articleLikeCount">—</span>
                            </button>
                            <button type="button" class="reaction-bookmark-btn bookmark-btn" data-id="${n}" aria-label="В закладки">
                                <span class="reaction-icon">⭐</span>
                                <span class="reaction-label">В закладки</span>
                            </button>
                        </div>
                    </div>`;
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

// ── Интеллектуальное извлечение тегов и брендов для статьи ──
function getArticlePills(article, n) {
    const fullText = (article.title + ' ' + article.text + ' ' + (bodies[n - 1] || []).join(' ')).toLowerCase();
    const pills = [];

    // Поиск по брендам
    BRANDS.forEach(brand => {
        const matches = brand.keywords.some(kw => fullText.includes(kw));
        if (matches) {
            pills.push({
                href: `/brands/${brand.slug}.html`,
                label: '#' + brand.slug
            });
        }
    });

    // Поиск по тематическим тегам
    TAGS.forEach(tag => {
        const matches = tag.keywords.some(kw => fullText.includes(kw));
        if (matches) {
            pills.push({
                href: `/tags/${tag.slug}.html`,
                label: tag.hashtag
            });
        }
    });

    if (pills.length === 0) {
        pills.push({
            href: `/tags/kitayskie-avto.html`,
            label: '#китайские_авто'
        });
        pills.push({
            href: `/tags/krossovery.html`,
            label: '#кроссоверы'
        });
    }

    return pills.slice(0, 5);
}

function articleTagsBar(article, n) {
    const pills = getArticlePills(article, n);
    const pillsHtml = pills.map(p => `<a href="${p.href}" class="tag-pill">${esc(p.label)}</a>`).join('\n                            ');
    return `<!-- ARTICLE TAGS PILLS -->
                    <div class="article-tags-bar">
                        <span class="tags-label">🏷️ Теги:</span>
                        <div class="tags-pills-list">
                            ${pillsHtml}
                        </div>
                    </div>`;
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

function articleNav(n) {
    const prevN = n > 1 ? n - 1 : bank.length;
    const nextN = n < bank.length ? n + 1 : 1;
    const prevA = bank[prevN - 1];
    const nextA = bank[nextN - 1];
    const prevSlug = slugs[prevN] || ('article-' + prevN);
    const nextSlug = slugs[nextN] || ('article-' + nextN);

    return `
    <nav class="article-nav" aria-label="Навигация по статьям">
        <a href="${prevSlug}.html" class="art-nav-item art-nav-prev">
            <span class="art-nav-label">← Предыдущая статья</span>
            <span class="art-nav-title">${esc(prevA.title)}</span>
        </a>
        <a href="${nextSlug}.html" class="art-nav-item art-nav-next">
            <span class="art-nav-label">Следующая статья →</span>
            <span class="art-nav-title">${esc(nextA.title)}</span>
        </a>
    </nav>`;
}

function page(article, n) {
    const slug = slugs[n] || ('article-' + n);
    const imgObj = images[n] || {};
    const ogImg = imgObj.url ? `${SITE}${imgObj.url}` : `${SITE}/og-image.jpg`;

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#e8433c">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://*.github.io; script-src 'self' 'unsafe-inline' https://*.github.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://* http://*; connect-src 'self' https://* http://*; frame-src 'self' https://*; object-src 'none'; base-uri 'self'">
    <meta name="description" content="${esc(article.text.slice(0, 160))}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${esc(article.title)} | АвтоТема">
    <meta property="og:description" content="${esc(article.text)}">
    <meta property="og:url" content="${SITE}/articles/${slug}.html">
    <meta property="og:site_name" content="АвтоТема">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:image" content="${ogImg}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="675">
    <meta property="og:image:alt" content="${esc(article.title)}">
    <title>${esc(article.title)} | АвтоТема</title>
    <link rel="canonical" href="${SITE}/articles/${slug}.html">
    <link rel="stylesheet" href="/styles.css?v=6">
    <link rel="stylesheet" href="/ugc.css?v=3">
    <link rel="stylesheet" href="/brands_tags.css?v=1">
    <script>
    (function(){
        var t = localStorage.getItem('avtotema_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    })();
    </script>
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${esc(article.title)}",
        "description": "${esc(article.text)}",
        "datePublished": "${dateFor(n)}",
        "inLanguage": "ru",
        "mainEntityOfPage": "${SITE}/articles/${slug}.html",
        "image": {
            "@type": "ImageObject",
            "url": "${ogImg}",
            "width": 1200,
            "height": 675
        },
        "author": { "@type": "Organization", "name": "АвтоТема" },
        "publisher": { "@type": "Organization", "name": "АвтоТема" }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "${SITE}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "${esc(article.tag)}",
                "item": "${SITE}/#${tagAnchor(article.tag)}"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "${esc(article.title)}",
                "item": "${SITE}/articles/${slug}.html"
            }
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "О чём статья «${esc(article.title)}»?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${esc(article.text)}"
                }
            },
            {
                "@type": "Question",
                "name": "К какой рубрике относится статья?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Статья относится к рубрике «${esc(article.tag)}» портала АвтоТема."
                }
            }
        ]
    }
    </script>
</head>
<body>
    <div class="reading-progress" id="progress"></div>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
            <nav class="nav" id="mainNav">
                <ul class="nav-list" id="navList">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/brands/">Марки</a></li>
                    <li><a href="/compare.html" style="color:var(--accent);font-weight:700;">⚔️ Сравнение</a></li>
                    <li><a href="/#world">Мир</a></li>
                    <li><a href="/#market">Рынок</a></li>
                    <li><a href="/#calculator">Калькулятор</a></li>
                    <li><a href="/#history">История</a></li>
                    <li><a href="/#tips">Лайфхаки</a></li>
                    <li><a href="/#interactive">Тест</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Переключить тему" title="Светлая / тёмная тема">
                    <span class="theme-icon-dark">🌙</span>
                    <span class="theme-icon-light" hidden>☀️</span>
                </button>
                <button type="button" class="fav-nav-btn fav-modal-open" title="Избранные статьи">
                    ⭐ <span class="fav-count" hidden>0</span>
                </button>
                <button class="burger" id="burger" aria-label="Меню" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
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
                    ${readerToolbar(article, n)}
                    ${heroImage(n)}
                    <div class="article-body">
                        ${paragraphs(article, n)}
                    </div>
                    ${articleTagsBar(article, n)}
                    ${reactionsBlock(article, n)}
                    ${shareBlock(article, slug)}

                    <!-- UGC COLLAPSIBLE 1: LIVE POLL -->
                    <div class="ugc-collapsible-box" id="articlePollBox">
                        <button type="button" class="ugc-collapsible-header" aria-expanded="false" aria-controls="pollCollapseBody">
                            <span class="ugc-header-left">
                                <span class="ugc-icon">📊</span>
                                <span class="ugc-title">Опрос читателей</span>
                            </span>
                            <span class="ugc-toggle-arrow">▼</span>
                        </button>
                        <div class="ugc-collapsible-body" id="pollCollapseBody" hidden>
                            <h3 class="poll-question" id="pollQuestion">Загрузка опроса…</h3>
                            <div class="poll-options-list" id="pollOptionsList"></div>
                            <div class="poll-footer-info">
                                <span id="pollTotalVotes">Всего голосов: 0</span>
                                <span>🔒 Анонимное голосование</span>
                            </div>
                        </div>
                    </div>

                    <!-- UGC COLLAPSIBLE 2: OWNER REVIEWS -->
                    <div class="ugc-collapsible-box" id="articleReviewsBox">
                        <div class="ugc-collapsible-header-wrap">
                            <button type="button" class="ugc-collapsible-header" aria-expanded="false" aria-controls="reviewsCollapseBody">
                                <span class="ugc-header-left">
                                    <span class="ugc-icon">⭐</span>
                                    <span class="ugc-title">Отзывы реальных владельцев</span>
                                </span>
                                <span class="ugc-toggle-arrow">▼</span>
                            </button>
                            <button type="button" class="btn-add-review" id="openReviewModalBtn">✍️ Оставить отзыв</button>
                        </div>
                        <div class="ugc-collapsible-body" id="reviewsCollapseBody" hidden>
                            <div class="reviews-list-wrap" id="reviewsListWrap"></div>
                        </div>
                    </div>

                    <!-- UGC COLLAPSIBLE 3: COMMUNITY COMMENTS -->
                    <div class="ugc-collapsible-box" id="articleCommentsBox">
                        <button type="button" class="ugc-collapsible-header" aria-expanded="false" aria-controls="commentsCollapseBody">
                            <span class="ugc-header-left">
                                <span class="ugc-icon">💬</span>
                                <span class="ugc-title">Обсуждение статьи</span>
                                <span class="comments-count-badge" id="commentsCountBadge">0</span>
                            </span>
                            <span class="ugc-toggle-arrow">▼</span>
                        </button>
                        <div class="ugc-collapsible-body" id="commentsCollapseBody" hidden>
                            <div class="comment-form-wrap">
                                <div class="comment-form-grid">
                                    <input type="text" id="commentAuthorInput" class="comment-input-field" placeholder="Ваше имя или никнейм *" required>
                                    <input type="text" id="commentRoleInput" class="comment-input-field" placeholder="Автомобиль или стаж (например: Haval Jolion / 8 лет)">
                                </div>
                                <textarea id="commentTextInput" class="comment-textarea-field" placeholder="Напишите ваш комментарий или мнение о статье… *" required></textarea>
                                <div class="comment-form-footer">
                                    <button type="button" class="btn-send-comment" id="sendCommentBtn">Отправить комментарий</button>
                                </div>
                            </div>
                            <div class="comments-list-wrap" id="commentsListWrap"></div>
                        </div>
                    </div>

                    ${sourcesBlock(n)}
                    ${articleNav(n)}
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
                                <a href="${rSlug}.html" class="card-link"></a>
                                ${rMedia}
                                <span class="card-tag">${esc(a.tag)}</span>
                                <button type="button" class="bookmark-btn card-bookmark-btn" data-id="${ri}" title="Сохранить в избранное" aria-label="Сохранить в избранное">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                                </button>
                                <div class="card-body">
                                    <h3>${esc(a.title)}</h3>
                                    <p>${esc(a.text)}</p>
                                    <div class="card-meta">
                                        <span class="article-meta">${a.readTime} мин</span>
                                        <span class="card-arrow" aria-hidden="true">→</span>
                                    </div>
                                </div>
                            </article>`;
                        }).join('\n                        ')}
                    </div>
                </aside>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <div class="footer-brand">
                <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
                <p>Все права защищены &copy; <span id="year">2026</span></p>
            </div>
            <div class="footer-socials">
                <a href="https://t.me/avtotema_news" class="social-btn tg" target="_blank" rel="noopener noreferrer" aria-label="Telegram-канал">
                    <span class="social-btn-icon">✈️</span>
                    <span class="social-btn-text">
                        <span class="social-btn-name">Telegram</span>
                        <span class="social-btn-sub">@avtotema_news</span>
                    </span>
                </a>
                <a href="https://youtube.com" class="social-btn yt" target="_blank" rel="noopener noreferrer" aria-label="YouTube-канал">
                    <span class="social-btn-icon">▶️</span>
                    <span class="social-btn-text">
                        <span class="social-btn-name">YouTube</span>
                        <span class="social-btn-sub">Видеообзоры</span>
                    </span>
                </a>
            </div>
            <p class="footer-links">
                <a href="/brands/">Каталог марок</a>
                <a href="/tags/">Теги</a>
                <a href="/compare.html">Сравнение авто</a>
                <a href="/privacy.html">Конфиденциальность</a>
                <a href="/terms.html">Условия использования</a>
                <a href="/">Главная</a>
            </p>
            <p class="age-mark"><span class="age-badge">0+</span> Сайт не содержит материалов, причиняющих вред здоровью и развитию детей (436-ФЗ)</p>
        </div>
    </footer>

    <!-- REVIEW MODAL -->
    <div class="modal-review-backdrop" id="reviewModalBackdrop">
        <div class="modal-review-card">
            <button type="button" class="modal-close-btn" id="closeReviewModalBtn">&times;</button>
            <h3 style="font-size:1.3rem;font-weight:800;margin-bottom:6px;">✍️ Отзыв реального владельца</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:16px;">Поделитесь вашим личным опытом эксплуатации автомобиля</p>

            <div style="margin-bottom:12px;">
                <label style="font-size:0.85rem;font-weight:700;display:block;margin-bottom:4px;">Ваша оценка:</label>
                <div class="star-rating-select" id="starRatingSelect">
                    <span data-val="1">★</span>
                    <span data-val="2">★</span>
                    <span data-val="3">★</span>
                    <span data-val="4">★</span>
                    <span data-val="5">★</span>
                </div>
            </div>

            <div style="margin-bottom:10px;">
                <input type="text" id="revAuthorInput" class="comment-input-field" placeholder="Ваше имя или никнейм *" required>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <input type="text" id="revCarInput" class="comment-input-field" placeholder="Марка и модель (напр. Chery Tiggo 7) *" required>
                <input type="text" id="revMileageInput" class="comment-input-field" placeholder="Пробег (напр. 35 000 км)">
            </div>
            <div style="margin-bottom:10px;">
                <input type="text" id="revProsInput" class="comment-input-field" placeholder="Главные плюсы (через запятую)">
            </div>
            <div style="margin-bottom:10px;">
                <input type="text" id="revConsInput" class="comment-input-field" placeholder="Главные минусы (через запятую)">
            </div>
            <div style="margin-bottom:16px;">
                <textarea id="revTextInput" class="comment-textarea-field" style="min-height:80px;" placeholder="Ваш подробный отзыв о надёжности, расходе топлива и комфорте… *" required></textarea>
            </div>

            <button type="button" class="btn btn-primary" id="submitReviewBtn" style="width:100%;">Опубликовать отзыв</button>
        </div>
    </div>

    <script src="/theme.js"></script>
    <script src="/script.js?v=3" defer></script>
    <script src="/article_images.js?v=2" defer></script>
    <script src="/speech.js?v=1" defer></script>
    <script src="/favorites.js?v=2" defer></script>
    <script src="/likes.js?v=2" defer></script>
    <script src="/ugc_data.js?v=2" defer></script>
    <script src="/ugc.js?v=4" defer></script>
    <script src="/footer.js?v=2" defer></script>
</body>
</html>`;
}

// ── Генератор карточки статьи для хаб-страниц ──
function renderArticleCard(a, idx) {
    const id = idx + 1;
    const slug = slugs[id] || ('article-' + id);
    const img = images[id];
    const media = img && img.url
        ? `<div class="card-media"><img src="${esc(img.url)}" alt="${esc(img.alt || a.title)}" loading="lazy" width="800" height="450"></div>`
        : '';
    return `<article class="article-card">
        <a href="/articles/${slug}.html" class="card-link"></a>
        ${media}
        <span class="card-tag">${esc(a.tag)}</span>
        <button type="button" class="bookmark-btn card-bookmark-btn" data-id="${id}" title="Сохранить в избранное" aria-label="Сохранить в избранное">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        <div class="card-body">
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.text)}</p>
            <div class="card-meta">
                <span class="article-meta">${a.readTime} мин · ${dateFor(id)}</span>
                <span class="card-arrow" aria-hidden="true">→</span>
            </div>
        </div>
    </article>`;
}

// ── Генерация Хаб-страниц Брендов ──
function generateBrandPages() {
    // 1. Главный каталог всех марок: /brands/index.html
    const catalogCards = BRANDS.map(b => {
        const matchingCount = bank.filter((a, i) => {
            const fullText = (a.title + ' ' + a.text + ' ' + (bodies[i] || []).join(' ')).toLowerCase();
            return b.keywords.some(kw => fullText.includes(kw));
        }).length;

        return `<a href="/brands/${b.slug}.html" class="brand-catalog-card">
            <img src="${b.logo}" alt="Логотип ${esc(b.name)}" class="brand-card-logo" loading="lazy" width="48" height="48">
            <div class="brand-card-info">
                <div class="brand-card-name">${esc(b.name)}</div>
                <div class="brand-card-meta">${b.country} · ${b.year} г. · <b>${matchingCount}</b> статей</div>
            </div>
        </a>`;
    }).join('\n');

    const catalogHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#e8433c">
    <meta name="robots" content="index, follow">
    <title>Каталог марок автомобилей | АвтоТема</title>
    <meta name="description" content="Полный каталог автомобильных брендов: китайские, европейские, российские и японские марки. Новости, обзоры, сравнения и характеристики.">
    <link rel="canonical" href="${SITE}/brands/">
    <link rel="stylesheet" href="/styles.css?v=5">
    <link rel="stylesheet" href="/brands_tags.css?v=1">
    <script>
    (function(){
        var t = localStorage.getItem('avtotema_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    })();
    </script>
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
            <nav class="nav" id="mainNav">
                <ul class="nav-list" id="navList">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/brands/" style="color:var(--accent);font-weight:700;">Марки</a></li>
                    <li><a href="/compare.html" style="color:var(--accent);font-weight:700;">⚔️ Сравнение</a></li>
                    <li><a href="/#world">Мир</a></li>
                    <li><a href="/#market">Рынок</a></li>
                    <li><a href="/#calculator">Калькулятор</a></li>
                    <li><a href="/#history">История</a></li>
                    <li><a href="/#tips">Лайфхаки</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Переключить тему"><span class="theme-icon-dark">🌙</span><span class="theme-icon-light" hidden>☀️</span></button>
                <button class="burger" id="burger" aria-label="Меню" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <main>
        <div class="container" style="padding-top:24px;">
            <nav class="breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <span class="current" aria-current="page">Каталог марок</span>
            </nav>

            <div class="hub-page-hero">
                <div class="hub-hero-top">
                    <div>
                        <h1 class="hub-hero-title">🚗 Каталог марок автомобилей</h1>
                        <p class="hub-hero-desc">Выберите интересующую вас марку, чтобы читать свежие новости, тест-драйвы, историю бренда и технические обзоры моделей.</p>
                    </div>
                    <div class="hub-actions-bar">
                        <a href="/compare.html" class="hub-btn hub-btn-primary">⚔️ Сравнить модели</a>
                        <a href="/tags/" class="hub-btn hub-btn-secondary">🏷️ Все теги</a>
                    </div>
                </div>
            </div>

            <div class="brands-catalog-grid">
                ${catalogCards}
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">&copy; 2026 АвтоТема — Новости и каталог автомобильного мира</p>
        </div>
    </footer>
    <script src="/theme.js"></script>
    <script src="/script.js?v=3" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(brandsDir, 'index.html'), catalogHtml);

    // 2. Индивидуальные хаб-страницы брендов: /brands/chery.html, etc.
    BRANDS.forEach(b => {
        const matches = bank.map((a, i) => ({ a, i })).filter(({ a, i }) => {
            const fullText = (a.title + ' ' + a.text + ' ' + (bodies[i] || []).join(' ')).toLowerCase();
            return b.keywords.some(kw => fullText.includes(kw));
        });

        const articlesGridHtml = matches.length > 0
            ? matches.map(({ a, i }) => renderArticleCard(a, i)).join('\n')
            : `<div class="no-results-card"><h3>Пока нет отдельных статей по марке ${esc(b.name)}</h3><p>Следите за обновлениями, новые материалы публикуются ежедневно!</p></div>`;

        const brandPageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#e8433c">
    <meta name="robots" content="index, follow">
    <title>Автомобили ${esc(b.name)}: новости, обзоры, история марки | АвтоТема</title>
    <meta name="description" content="Всё о марке ${esc(b.name)}: свежие новости, тест-драйвы, история компании ${esc(b.name)}, технические характеристики и сравнение моделей.">
    <link rel="canonical" href="${SITE}/brands/${b.slug}.html">
    <link rel="stylesheet" href="/styles.css?v=5">
    <link rel="stylesheet" href="/brands_tags.css?v=1">
    <script>
    (function(){
        var t = localStorage.getItem('avtotema_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    })();
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": "${esc(b.name)}",
        "description": "${esc(b.description)}",
        "url": "${SITE}/brands/${b.slug}.html"
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "${SITE}/" },
            { "@type": "ListItem", "position": 2, "name": "Каталог марок", "item": "${SITE}/brands/" },
            { "@type": "ListItem", "position": 3, "name": "${esc(b.name)}", "item": "${SITE}/brands/${b.slug}.html" }
        ]
    }
    </script>
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
            <nav class="nav" id="mainNav">
                <ul class="nav-list" id="navList">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/brands/" style="color:var(--accent);font-weight:700;">Марки</a></li>
                    <li><a href="/compare.html" style="color:var(--accent);font-weight:700;">⚔️ Сравнение</a></li>
                    <li><a href="/#world">Мир</a></li>
                    <li><a href="/#market">Рынок</a></li>
                    <li><a href="/#calculator">Калькулятор</a></li>
                    <li><a href="/#history">История</a></li>
                    <li><a href="/#tips">Лайфхаки</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Переключить тему"><span class="theme-icon-dark">🌙</span><span class="theme-icon-light" hidden>☀️</span></button>
                <button class="burger" id="burger" aria-label="Меню" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <main>
        <div class="container" style="padding-top:24px;">
            <nav class="breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <a href="/brands/">Каталог марок</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <span class="current" aria-current="page">${esc(b.name)}</span>
            </nav>

            <div class="hub-page-hero">
                <div class="hub-hero-top">
                    <div class="hub-brand-title-wrap">
                        <img src="${b.logo}" alt="Логотип ${esc(b.name)}" class="hub-brand-logo" loading="lazy" width="60" height="60">
                        <div>
                            <h1 class="hub-hero-title">${esc(b.name)}</h1>
                            <div class="hub-badges-list">
                                <span class="hub-badge">${b.country}</span>
                                <span class="hub-badge">Основан в ${b.year} г.</span>
                                <span class="hub-badge">Материалов: ${matches.length}</span>
                            </div>
                        </div>
                    </div>
                    <div class="hub-actions-bar">
                        <a href="/compare.html" class="hub-btn hub-btn-primary">⚔️ Сравнить ${esc(b.name)}</a>
                        <a href="/brands/" class="hub-btn hub-btn-secondary">← Все марки</a>
                    </div>
                </div>
                <p class="hub-hero-desc">${esc(b.description)}</p>
            </div>

            <section class="section" style="padding:0 0 40px;">
                <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;">Статьи и новости о марке ${esc(b.name)}</h2>
                <div class="articles-grid">
                    ${articlesGridHtml}
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">&copy; 2026 АвтоТема — Новости о марке ${esc(b.name)}</p>
            <p class="footer-links">
                <a href="/brands/">Все марки</a>
                <a href="/tags/">Теги</a>
                <a href="/compare.html">Сравнение авто</a>
                <a href="/">Главная</a>
            </p>
        </div>
    </footer>
    <script src="/theme.js"></script>
    <script src="/script.js?v=3" defer></script>
    <script src="/favorites.js" defer></script>
    <script src="/likes.js" defer></script>
</body>
</html>`;

        fs.writeFileSync(path.join(brandsDir, `${b.slug}.html`), brandPageHtml);
    });
}

// ── Генерация Хаб-страниц Тегов ──
function generateTagPages() {
    // 1. Главный каталог всех тегов: /tags/index.html
    const tagCards = TAGS.map(t => {
        const matchingCount = bank.filter((a, i) => {
            const fullText = (a.title + ' ' + a.text + ' ' + (bodies[i] || []).join(' ')).toLowerCase();
            return t.keywords.some(kw => fullText.includes(kw));
        }).length;

        return `<a href="/tags/${t.slug}.html" class="tag-cloud-card">
            <span>${t.icon}</span>
            <span>${esc(t.hashtag)}</span>
            <span class="tag-card-count">${matchingCount}</span>
        </a>`;
    }).join('\n');

    const tagsIndexHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#e8433c">
    <meta name="robots" content="index, follow">
    <title>Тематические теги и рубрики | АвтоТема</title>
    <meta name="description" content="Облако тегов и тем автопортала АвтоТема: полный привод, электромобили, гибриды, вариаторы, кроссоверы и китайские авто.">
    <link rel="canonical" href="${SITE}/tags/">
    <link rel="stylesheet" href="/styles.css?v=5">
    <link rel="stylesheet" href="/brands_tags.css?v=1">
    <script>
    (function(){
        var t = localStorage.getItem('avtotema_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    })();
    </script>
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
            <nav class="nav" id="mainNav">
                <ul class="nav-list" id="navList">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/brands/">Марки</a></li>
                    <li><a href="/compare.html" style="color:var(--accent);font-weight:700;">⚔️ Сравнение</a></li>
                    <li><a href="/tags/" style="color:var(--accent);font-weight:700;">Теги</a></li>
                    <li><a href="/#world">Мир</a></li>
                    <li><a href="/#market">Рынок</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Переключить тему"><span class="theme-icon-dark">🌙</span><span class="theme-icon-light" hidden>☀️</span></button>
                <button class="burger" id="burger" aria-label="Меню" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <main>
        <div class="container" style="padding-top:24px;">
            <nav class="breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <span class="current" aria-current="page">Тематические теги</span>
            </nav>

            <div class="hub-page-hero">
                <h1 class="hub-hero-title">🏷️ Облако автомобильных тегов</h1>
                <p class="hub-hero-desc">Быстрая навигация по ключевым технологиям, агрегатам и сегментам автомобильного рынка.</p>
            </div>

            <div class="tags-cloud-wrap">
                ${tagCards}
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">&copy; 2026 АвтоТема — Тематические теги</p>
        </div>
    </footer>
    <script src="/theme.js"></script>
    <script src="/script.js?v=3" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(tagsDir, 'index.html'), tagsIndexHtml);

    // 2. Индивидуальные страницы тегов: /tags/kitayskie-avto.html, etc.
    TAGS.forEach(t => {
        const matches = bank.map((a, i) => ({ a, i })).filter(({ a, i }) => {
            const fullText = (a.title + ' ' + a.text + ' ' + (bodies[i] || []).join(' ')).toLowerCase();
            return t.keywords.some(kw => fullText.includes(kw));
        });

        const articlesGridHtml = matches.length > 0
            ? matches.map(({ a, i }) => renderArticleCard(a, i)).join('\n')
            : `<div class="no-results-card"><h3>Пока нет статей по тегу ${esc(t.hashtag)}</h3><p>Следите за обновлениями!</p></div>`;

        const tagPageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#e8433c">
    <meta name="robots" content="index, follow">
    <title>${esc(t.name)} (${esc(t.hashtag)}) — статьи и обзоры | АвтоТема</title>
    <meta name="description" content="${esc(t.description)}">
    <link rel="canonical" href="${SITE}/tags/${t.slug}.html">
    <link rel="stylesheet" href="/styles.css?v=5">
    <link rel="stylesheet" href="/brands_tags.css?v=1">
    <script>
    (function(){
        var t = localStorage.getItem('avtotema_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    })();
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "${SITE}/" },
            { "@type": "ListItem", "position": 2, "name": "Теги", "item": "${SITE}/tags/" },
            { "@type": "ListItem", "position": 3, "name": "${esc(t.hashtag)}", "item": "${SITE}/tags/${t.slug}.html" }
        ]
    }
    </script>
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo"><span class="logo-icon"><img src="/logo-icon.svg" alt="АвтоТема" width="32" height="32"></span>Авто<span>Тема</span></a>
            <nav class="nav" id="mainNav">
                <ul class="nav-list" id="navList">
                    <li><a href="/#news">Новости</a></li>
                    <li><a href="/brands/">Марки</a></li>
                    <li><a href="/compare.html" style="color:var(--accent);font-weight:700;">⚔️ Сравнение</a></li>
                    <li><a href="/tags/" style="color:var(--accent);font-weight:700;">Теги</a></li>
                    <li><a href="/#world">Мир</a></li>
                    <li><a href="/#market">Рынок</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Переключить тему"><span class="theme-icon-dark">🌙</span><span class="theme-icon-light" hidden>☀️</span></button>
                <button class="burger" id="burger" aria-label="Меню" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <main>
        <div class="container" style="padding-top:24px;">
            <nav class="breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <a href="/tags/">Теги</a>
                <span class="crumb-sep" aria-hidden="true">→</span>
                <span class="current" aria-current="page">${esc(t.hashtag)}</span>
            </nav>

            <div class="hub-page-hero">
                <div class="hub-hero-top">
                    <div>
                        <h1 class="hub-hero-title">${t.icon} ${esc(t.name)} <span style="color:var(--accent);">${esc(t.hashtag)}</span></h1>
                        <p class="hub-hero-desc">${esc(t.description)}</p>
                    </div>
                    <div class="hub-actions-bar">
                        <a href="/tags/" class="hub-btn hub-btn-secondary">🏷️ Все теги</a>
                        <a href="/compare.html" class="hub-btn hub-btn-primary">⚔️ Сравнение авто</a>
                    </div>
                </div>
            </div>

            <section class="section" style="padding:0 0 40px;">
                <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;">Материалы по теме (${matches.length})</h2>
                <div class="articles-grid">
                    ${articlesGridHtml}
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">&copy; 2026 АвтоТема — Материалы по тегу ${esc(t.hashtag)}</p>
            <p class="footer-links">
                <a href="/brands/">Марки</a>
                <a href="/tags/">Все теги</a>
                <a href="/compare.html">Сравнение авто</a>
                <a href="/">Главная</a>
            </p>
        </div>
    </footer>
    <script src="/theme.js"></script>
    <script src="/script.js?v=3" defer></script>
    <script src="/favorites.js" defer></script>
    <script src="/likes.js" defer></script>
</body>
</html>`;

        fs.writeFileSync(path.join(tagsDir, `${t.slug}.html`), tagPageHtml);
    });
}

function sitemap() {
    const legal = [
        { path: 'compare.html', freq: 'weekly', priority: '0.9' },
        { path: 'brands/index.html', freq: 'weekly', priority: '0.9' },
        { path: 'tags/index.html', freq: 'weekly', priority: '0.85' },
        { path: 'privacy.html', freq: 'yearly', priority: '0.3' },
        { path: 'terms.html', freq: 'yearly', priority: '0.3' }
    ];
    let out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Legal and hub indices
    for (const p of legal) {
        out += `  <url>\n    <loc>${SITE}/${p.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }

    // Brands
    for (const b of BRANDS) {
        out += `  <url>\n    <loc>${SITE}/brands/${b.slug}.html</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }

    // Tags
    for (const t of TAGS) {
        out += `  <url>\n    <loc>${SITE}/tags/${t.slug}.html</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Articles
    for (let i = 0; i < bank.length; i++) {
        const slug = slugs[i + 1] || ('article-' + (i + 1));
        out += `  <url>\n    <loc>${SITE}/articles/${slug}.html</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    return out + '</urlset>\n';
}

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

// Генерация 80 статей
for (let n = 1; n <= bank.length; n++) {
    const slug = slugs[n] || ('article-' + n);
    fs.writeFileSync(path.join(outDir, `${slug}.html`), page(bank[n - 1], n));
    fs.writeFileSync(path.join(outDir, `article-${n}.html`), redirectStub(bank[n - 1], n));
}

// Генерация хаб-страниц брендов и тегов
generateBrandPages();
generateTagPages();

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
console.log(`Успешно сгенерировано: ${bank.length} статей, ${BRANDS.length + 1} страниц марок, ${TAGS.length + 1} страниц тегов, sitemap.xml обновлён.`);
