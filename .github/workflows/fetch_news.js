// Скрипт для GitHub Actions: автоматически добавляет статьи в банк из мировых авто-СМИ и российских источников.
// Запускается из auto_news.yml (по расписанию, 2 раза в день).
// Зарубежные новости (Motor1, Electrek, Autocar, Car & Driver) автоматически качественно переводятся на русский язык.
// Статьи добавляются в ARTICLE_BANK (script.js), BODIES/SOURCES (article_content.js) и SLUGS (article_images.js).
// Уже использованные ссылки не повторяются (state/seen_news.json).
// Для теста без изменений: NEWS_DRY_RUN=1 node .github/workflows/fetch_news.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const STATE_FILE = path.join(ROOT, 'state', 'seen_news.json');
const TARGET = parseInt(process.env.NEWS_TARGET || '1', 10);
const DRY_RUN = process.env.NEWS_DRY_RUN === '1';

const FEEDS = [
    // Ведущие мировые автоиздания
    { name: 'Motor1 Global', url: 'https://www.motor1.com/rss/news/all/' },
    { name: 'CarScoops Global', url: 'https://www.carscoops.com/feed/' },
    { name: 'Electrek (EV & Tesla)', url: 'https://electrek.co/feed/' },
    { name: 'InsideEVs Global', url: 'https://insideevs.com/rss/news/all/' },
    { name: 'Autocar UK', url: 'https://www.autocar.co.uk/rss' },
    { name: 'Car and Driver', url: 'https://www.caranddriver.com/rss/all.xml' },
    // Авторитетные российские автопорталы
    { name: 'Motor.ru', url: 'https://motor.ru/rss/news' },
    { name: 'Quto.ru', url: 'https://quto.ru/rss/news' },
    { name: 'Авто Mail.ru', url: 'https://auto.mail.ru/rss/' }
];

function stripHtml(s) {
    return String(s || '')
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

async function translateToRussian(text) {
    if (!text) return '';
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
    const cyrillicCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
    // Если уже на русском — возвращаем как есть
    if (cyrillicCount >= latinCount && cyrillicCount > 5) return text;

    try {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ru&dt=t&q=' + encodeURIComponent(text);
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
                return data[0].map(x => x[0]).join('');
            }
        }
    } catch (e) {
        console.log('Ошибка автоперевода: ' + e.message);
    }
    return text;
}

function detectTag(title, text) {
    const full = (title + ' ' + text).toLowerCase();
    if (full.includes('электро') || full.includes('electric') || full.includes('ev') || full.includes('battery') || full.includes('батаре') || full.includes('tesla') || full.includes('zeekr')) {
        return 'Электромобили';
    }
    if (full.includes('двигател') || full.includes('мотор') || full.includes('engine') || full.includes('v8') || full.includes('v6') || full.includes('турбо') || full.includes('кпп') || full.includes('трансмисси')) {
        return 'Двигатели';
    }
    if (full.includes('цена') || full.includes('рубл') || full.includes('продаж') || full.includes('рынок') || full.includes('дилер') || full.includes('утильсбор') || full.includes('market') || full.includes('price')) {
        return 'Новости рынка';
    }
    if (full.includes('представил') || full.includes('дебют') || full.includes('поколени') || full.includes('кроссовер') || full.includes('concept') || full.includes('unveil') || full.includes('reveal')) {
        return 'Новые модели';
    }
    return 'Мировые новости';
}

function parseRSS(xml, source) {
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml))) {
        const block = m[1];
        const get = (tag) => {
            const mm = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>'));
            return mm ? mm[1].trim() : '';
        };
        const title = stripHtml(get('title'));
        let link = stripHtml(get('link'));
        link = link.split(/\s+/)[0];
        const desc = stripHtml(get('description'));
        if (!title || !link) continue;
        items.push({ title, link, desc, source });
    }
    return items;
}

function parseAtom(xml, source) {
    const items = [];
    const re = /<entry>([\s\S]*?)<\/entry>/g;
    let m;
    while ((m = re.exec(xml))) {
        const block = m[1];
        const titleM = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        const linkM = block.match(/<link[^>]*href="([^"]+)"/);
        const summaryM = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
        const title = titleM ? stripHtml(titleM[1]) : '';
        const link = linkM ? linkM[1].trim() : '';
        const desc = summaryM ? stripHtml(summaryM[1]) : '';
        if (!title || !link) continue;
        items.push({ title, link, desc, source });
    }
    return items;
}

function loadSeen() {
    try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        return { links: Array.isArray(data.links) ? data.links : [], added: data.added || 0 };
    } catch (e) { return { links: [], added: 0 }; }
}

function saveSeen(state) {
    if (DRY_RUN) return;
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ updated: new Date().toISOString(), links: state.links, added: state.added }, null, 2) + '\n');
    fs.renameSync(tmp, STATE_FILE);
}

function jsStr(s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r\t]+/g, ' ');
}

function slugify(title) {
    const map = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
    };
    let slug = title.toLowerCase()
        .split('')
        .map(c => map[c] || c)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
    return slug;
}

function insertBeforeClosing(src, marker, closing, block) {
    const mi = src.indexOf(marker);
    if (mi < 0) throw new Error('Маркер не найден: ' + marker);
    const ci = src.indexOf(closing, mi);
    if (ci < 0) throw new Error('Закрывающий маркер не найден: ' + closing);
    return src.slice(0, ci) + block + src.slice(ci);
}

function commitAll() {
    if (DRY_RUN) return;
    execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
    execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
    execSync('git add script.js article_content.js article_images.js state/seen_news.json', { stdio: 'inherit' });
    const changed = execSync('git diff --cached --quiet; echo $?').toString().trim();
    if (changed === '0') { console.log('Нет изменений для коммита'); return; }
    execSync('git commit -m "Auto: добавлены свежие мировые автоновости"', { stdio: 'inherit' });
    execSync('git pull --rebase origin main', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    console.log('Запушено: статьи добавлены в банк');
}

async function main() {
    const state = loadSeen();
    const seen = new Set(state.links);
    const perFeed = [];

    for (const f of FEEDS) {
        try {
            const res = await fetch(f.url, {
                headers: { 'user-agent': 'Mozilla/5.0 (compatible; AvtoTemaBot/1.0; +https://avtotema-news.online)' },
                signal: AbortSignal.timeout(25000)
            });
            if (!res.ok) { console.log('Пропуск ' + f.name + ': HTTP ' + res.status); continue; }
            const xml = await res.text();
            const items = (xml.indexOf('<item>') !== -1 ? parseRSS(xml, f.name) : parseAtom(xml, f.name)).filter(it => !seen.has(it.link));
            console.log(f.name + ': новых ' + items.length);
            perFeed.push(items);
        } catch (e) {
            console.log('Ошибка ' + f.name + ': ' + e.message);
        }
    }

    // Выбираем TARGET новостей, чередуя источники (по 1 от каждой ленты по кругу).
    const selected = [];
    let progressed = true;
    while (selected.length < TARGET && progressed) {
        progressed = false;
        for (const feed of perFeed) {
            const it = feed.shift();
            if (!it) continue;
            progressed = true;
            selected.push(it);
            if (selected.length >= TARGET) break;
        }
    }

    if (!selected.length) {
        console.log('Новых новостей в лентах нет — изменений нет');
        saveSeen(state);
        process.exit(0);
    }

    // Строим объекты статей с переводом на русский язык
    const scriptPath = path.join(ROOT, 'script.js');
    const scriptSrc = fs.readFileSync(scriptPath, 'utf8');
    const m = scriptSrc.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
    if (!m) { console.error('ARTICLE_BANK не найден в script.js'); process.exit(1); }
    const bank = eval(m[1]);
    const base = bank.length;
    const usedSlugs = new Set();

    const articles = [];
    for (let i = 0; i < selected.length; i++) {
        const it = selected[i];
        console.log('Перевод и обработка [' + it.source + ']: ' + it.title);

        const ruTitle = await translateToRussian(it.title);
        const rawDesc = it.desc || it.title;
        const ruDesc = await translateToRussian(rawDesc);
        const text = ruDesc.length > 320 ? ruDesc.slice(0, 320).replace(/\s+\S*$/, '') + '…' : ruDesc;

        let slug = slugify(ruTitle);
        if (!slug) slug = 'news-' + (base + i + 1);
        if (usedSlugs.has(slug)) slug = slug + '-' + (base + i + 1);
        usedSlugs.add(slug);

        const tag = detectTag(ruTitle, text);

        articles.push({
            title: ruTitle,
            text,
            tag,
            readTime: Math.max(2, Math.round(text.length / 400)),
            slug,
            num: base + i + 1,
            sourceName: it.source,
            sourceUrl: it.link
        });
    }

    console.log('Добавляю статей: ' + articles.length);
    for (const a of articles) {
        console.log('  #' + a.num + ' [' + a.sourceName + ' / ' + a.tag + '] ' + a.title);
    }

    if (DRY_RUN) {
        console.log('DRY RUN — файлы не изменены');
        process.exit(0);
    }

    // 1. script.js → ARTICLE_BANK
    const bankBlock = articles.map(a =>
        '    { tag: "' + a.tag + '", title: "' + jsStr(a.title) + '", text: "' + jsStr(a.text) + '", readTime: ' + a.readTime + ' }'
    ).join(',\n');
    const newScript = insertBeforeClosing(scriptSrc, 'const ARTICLE_BANK = [', '\n];', ',\n' + bankBlock + '\n');
    fs.writeFileSync(scriptPath, newScript);

    // 2. article_content.js → BODIES (по одному абзацу с текстом) и SOURCES (ссылка на новость)
    const contentPath = path.join(ROOT, 'article_content.js');
    let contentSrc = fs.readFileSync(contentPath, 'utf8');
    const bodiesBlock = articles.map(a =>
        '    [\n        "' + jsStr(a.text) + '"\n    ]'
    ).join(',\n');
    contentSrc = insertBeforeClosing(contentSrc, 'const BODIES = [', '\n];', ',\n' + bodiesBlock + '\n');
    const sourcesBlock = articles.map(a =>
        '    [\n        { name: "' + jsStr(a.sourceName + ' — первоисточник') + '", url: "' + jsStr(a.sourceUrl) + '" }\n    ]'
    ).join(',\n');
    contentSrc = insertBeforeClosing(contentSrc, 'const SOURCES = [', '\n];', ',\n' + sourcesBlock + '\n');
    fs.writeFileSync(contentPath, contentSrc);

    // 3. article_images.js → SLUGS
    const imagesPath = path.join(ROOT, 'article_images.js');
    const imagesSrc = fs.readFileSync(imagesPath, 'utf8');
    const slugsBlock = articles.map(a => '    ' + a.num + ': "' + a.slug + '"').join(',\n');
    const newImages = insertBeforeClosing(imagesSrc, 'const SLUGS = {', '\n};', ',\n' + slugsBlock + '\n');
    fs.writeFileSync(imagesPath, newImages);

    // 4. state/seen_news.json — запоминаем использованные ссылки
    for (const it of selected) state.links.push(it.link);
    state.added += articles.length;
    saveSeen(state);

    commitAll();
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
