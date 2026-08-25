// Скрипт для GitHub Actions: автоматически добавляет статьи в банк из мировых авто-СМИ и российских источников.
// Запускается из auto_news.yml (по расписанию, 2 раза в день).
// Зарубежные новости (Motor1, Electrek, Autocar, Car & Driver) автоматически качественно переводятся на русский язык.
// Статьи добавляются в ARTICLE_BANK (script.js), BODIES/SOURCES (article_content.js) и SLUGS/IMAGES (article_images.js).
// Уже использованные ссылки не повторяются (state/seen_news.json).
// Дополнительно:
//  - если перевод не сработал (сервис недоступен) — статья пропускается и будет повторена в следующем запуске;
//  - похожие заголовки из разных лент (одна тема у двух СМИ) дедуплицируются;
//  - текст статьи строится из content:encoded (полный текст ленты) и разбивается на 3–4 абзаца;
//    если материал короткий — добирается рубрикный контекстный абзац (варианты чередуются);
//  - материалы короче ~350 знаков не публикуются вовсе (фильтр малоценного контента);
//  - фото подбирается через API Wikimedia Commons (свободные лицензии) и скачивается в images/auto/,
//    при неудаче — тематический fallback из уже имеющихся фото сайта;
//  - время чтения считается честно (объём текста / 1100 знаков в минуту);
//  - state/seen_news.json автоматически ужимается до последних 2000 ссылок.
// Для теста без изменений: NEWS_DRY_RUN=1 node .github/workflows/fetch_news.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const STATE_FILE = path.join(ROOT, 'state', 'seen_news.json');
const TARGET = parseInt(process.env.NEWS_TARGET || '1', 10);
const DRY_RUN = process.env.NEWS_DRY_RUN === '1';

const UA = { 'user-agent': 'Mozilla/5.0 (compatible; AvtoTemaBot/1.0; +https://avtotema-news.online)' };

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

// Тематический запас фотографий сайта (если Commons ничего не нашёл / скачивание не удалось).
const FALLBACK_POOLS = {
    'Электромобили': ['/images/art-01.jpg', '/images/art-15.jpg', '/images/art-10.jpg'],
    'Двигатели': ['/images/art-08.jpg', '/images/art-14.jpg'],
    'Новые модели': ['/images/art-02.jpg', '/images/art-07.jpg'],
    'Новости рынка': ['/images/art-17.jpg', '/images/art-13.jpg']
};
const FALLBACK_DEFAULT = ['/images/art-05.jpg', '/images/art-06.jpg', '/images/ferrari.jpg'];

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

function cyrLat(text) {
    const t = String(text || '');
    return {
        lat: (t.match(/[a-zA-Z]/g) || []).length,
        cyr: (t.match(/[а-яА-ЯёЁ]/g) || []).length
    };
}

function looksRussian(text) {
    const c = cyrLat(text);
    return c.cyr >= c.lat && c.cyr > 5;
}

// Переводчики по цепочке: основной gtx → зеркало clients5 → запасной MyMemory.
// Возвращает переведённый текст или null, если не сработал ни один сервис.
async function translateViaGtx(text) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ru&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url, Object.assign({ signal: AbortSignal.timeout(10000) }, UA));
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data[0]) return data[0].map(x => x[0]).join('');
    return null;
}

async function translateViaClients5(text) {
    const url = 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=ru&q=' + encodeURIComponent(text);
    const res = await fetch(url, Object.assign({ signal: AbortSignal.timeout(10000) }, UA));
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    if (typeof data[0] === 'string') return data.join(' ');
    if (Array.isArray(data[0])) return data.map(x => (Array.isArray(x) ? x[0] : x)).join('');
    return null;
}

async function translateViaMyMemory(text) {
    // Бесплатный официальный API, лимит ~500 знаков на запрос
    const chunk = String(text).slice(0, 480);
    const url = 'https://api.mymemory.translated.net/get?langpair=en|ru&q=' + encodeURIComponent(chunk);
    const res = await fetch(url, Object.assign({ signal: AbortSignal.timeout(10000) }, UA));
    if (!res.ok) return null;
    const data = await res.json();
    const out = data && data.responseData && data.responseData.translatedText;
    return (out && !/<\//.test(out)) ? out : null;
}

async function translateToRussian(text) {
    if (!text) return '';
    if (looksRussian(text)) return text;

    const providers = [translateViaGtx, translateViaClients5, translateViaMyMemory];
    for (const provider of providers) {
        try {
            const out = await provider(text);
            if (out && looksRussian(out)) return out;
        } catch (e) { /* пробуем следующего поставщика */ }
    }
    console.log('Все переводчики недоступны');
    return null;
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

// Достаёт content:encoded (полный текст записи в RSS) с учётом CDATA
function getContent(block) {
    const mm = block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i);
    return mm ? mm[1] : '';
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
        // Полный текст из content:encoded (если лента отдаёт) — для объёмных статей
        const full = stripHtml(getContent(block));
        if (!title || !link) continue;
        items.push({ title, link, desc, full, source });
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
        const summaryM2 = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
        const contentM = block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
        const desc = (summaryM2 || contentM) ? stripHtml((summaryM2 || contentM)[1]) : '';
        if (!title || !link) continue;
        items.push({ title, link, desc, full: '', source });
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
    // Ужимаем историю, чтобы файл не рос бесконечно
    state.links = state.links.slice(-2000);
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ updated: new Date().toISOString(), links: state.links, added: state.added }, null, 2) + '\n');
    fs.renameSync(tmp, STATE_FILE);
}

function jsStr(s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r\t]+/g, ' ');
}

// Безопасный разбор JS-литерала массива (вместо eval): изолированная песочница без доступа к fs/network/process.
function parseArrayLiteral(literal, label) {
    try {
        return vm.runInNewContext('(' + literal + ')', Object.create(null), { timeout: 3000 });
    } catch (e) {
        console.error('Не удалось разобрать литерал ' + label + ': ' + e.message);
        process.exit(1);
    }
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

// ---------- Дедупликация похожих тем ----------

const DEDUP_STOP = new Set([
    'в','на','и','с','по','для','о','от','до','за','из','у','же','не','что','как','это','эта','этот',
    'новый','новая','новое','новые','будет','будут','своих','очень','после','также','более','самых',
    'the','a','an','of','in','for','to','on','with','and','is','are','was','were','new','its','his'
]);

function titleWordSet(title) {
    const words = String(title || '')
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[^a-zа-я0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !DEDUP_STOP.has(w))
        .map(w => w.slice(0, 6));
    return new Set(words);
}

function titlesSimilar(aSet, bSet) {
    if (!aSet.size || !bSet.size) return false;
    let inter = 0;
    for (const w of aSet) if (bSet.has(w)) inter++;
    return inter / Math.min(aSet.size, bSet.size) >= 0.6;
}

// ---------- Разбивка текста на абзацы ----------

function splitSentences(t) {
    return String(t).replace(/\s+/g, ' ').split(/(?<=[.!?…])\s+(?=[А-ЯЁA-Z«"0-9])/).filter(s => s.trim());
}

// Рубрикный контекст: короткий абзац, добавляемый к статье, если материала из ленты мало.
// Несколько вариантов на рубрику чередуются (по номеру статьи), чтобы тексты не повторялись слово в слово.
const RUBRIC_CONTEXT = {
    'Электромобили': [
        'Для покупателя это очередной сигнал: электрические модели перестают быть экзотикой и всё заметнее влияют на цены как новых машин, так и вторички. Если планировали переход на электрокар, такие новости стоит отслеживать — они напрямую сказываются на предложениях дилеров.',
        'Подобные решения автопроизводителей обычно отражают борьбу за себестоимость батарей и логистику. В итоге выигрывает покупатель: предложение на рынке электротранспорта становится разнообразнее, а сроки поставок — короче.',
        'Инженеры продолжают спорить, какая архитектура станет стандартом ближайших лет, но направление очевидно: больше запас хода при меньшей цене киловатт-часа. Такие новости помогают понять, менять ли машину сейчас или подождать следующее поколение.'
    ],
    'Двигатели': [
        'Решения по моторам такого масштаба традиционно влияют на весь модельный ряд: от компактных версий до флагманов. Покупателям стоит учитывать эти тренды при выборе между турбомотором, атмосферником и гибридной установкой.',
        'За каждым таким анонсом стоят годы испытаний и миллионы километров тестов. Для автомобилиста главное практическое следствие — ресурс и стоимость обслуживания силовых установок будущих поколений.',
        'Конкуренция между классическими ДВС и электрическими платформами только обостряется. Именно поэтому новости о двигателях остаются одними из самых важных для тех, кто планирует покупку в ближайшие год-два.'
    ],
    'Новые модели': [
        'Премьеры такого уровня задают тон всему сегменту: именно по ним покупатели сравнивают комплектации и цены конкурентов в салонах. Если модель доберётся до российского рынка, детали по комплектациям появятся ближе к старту продаж.',
        'Каждая новинка проходит через сито тестов и доработок, прежде чем попасть к первым клиентам. Следить за такими дебютами полезно всем, кто выбирает автомобиль: уже через год эти технологии спускаются в массовый сегмент.',
        'Производители всё чаще делают ставку на локализацию и адаптацию под конкретные рынки. От этого зависит не только цена, но и набор опций, который получат покупатели в разных странах.'
    ],
    'Новости рынка': [
        'Для рынка это движение более чем показательное: цены, утильсбор и курсы валют формируют предложения дилеров на месяцы вперёд. Планирующим покупку имеет смысл наблюдать за динамикой, а не принимать решение спешно.',
        'Аналитики отмечают, что подобные сдвиги обычно отражаются на вторичном рынке быстрее, чем в официальных прайс-листах. Продавцам и покупателям машин с пробегом стоит закладывать эти изменения в свои ожидания.',
        'Каждое такое решение перекраивает расстановку сил среди брендов. В выигрыше чаще всего оказывается тот покупатель, который сравнивает предложения нескольких дилеров и не привязывается к одной марке.'
    ],
    'Мировые новости': [
        'Глобальный автопром давно живёт в режиме постоянной гонки: решения в одном регионе буквально через квартал отражаются на предложениях в другом. Поэтому мировые новости важны даже тем, кто выбирает машину исключительно для города.',
        'За громкими заявлениями корпораций всегда стоят контракты, заводы и тысячи рабочих мест. Итог таких перестановок рано или поздно доходит до конвейера — а значит, и до салонов.',
        'Наблюдать за глобальными трендами полезно хотя бы ради понимания, куда движется индустрия: электрокары, автономные системы и новые рынки меняют правила игры быстрее, чем успевают выходить обзоры.'
    ]
};

function rubricParagraph(tag, num) {
    const pool = RUBRIC_CONTEXT[tag] || RUBRIC_CONTEXT['Мировые новости'];
    return pool[num % pool.length];
}

function buildParagraphs(desc, tag, num) {
    const sentences = splitSentences(desc);
    const paras = [];
    let cur = '';
    for (const s of sentences) {
        cur = cur ? cur + ' ' + s : s;
        if (cur.length >= 260) { paras.push(cur); cur = ''; }
    }
    if (cur) {
        if (paras.length && cur.length < 80) paras[paras.length - 1] += ' ' + cur;
        else paras.push(cur);
    }
    if (!paras.length) paras.push(String(desc).trim());
    // Добираем объём: рубрикный контекст, затем универсальный финал
    if (paras.length === 1) paras.push(rubricParagraph(tag, num));
    if (paras.length === 2 && String(desc).length < 500) {
        paras.push(rubricParagraph(tag, num + 1));
    }
    if (paras.length < 3) {
        paras.push('АвтоТема следит за развитием событий — мы дополним материал подробностями, как только появится новая информация.');
    }
    return paras.slice(0, 4);
}

function truncateWords(t, maxLen) {
    if (String(t).length <= maxLen) return t;
    return String(t).slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

// ---------- Фото: Wikimedia Commons ----------

// Ключевые слова для поиска фото на Commons. Стратегия: фото ищем только по бренду или типу кузова —
// так выдача стабильно содержит машины. Если в заголовке ни бренда, ни термина нет,
// возвращаем пустую строку и статья получает тематический fallback сайта.
const CAR_BRANDS = new Set(['tesla','bmw','toyota','honda','ford','chevrolet','porsche','audi','mercedes','volkswagen','nissan','hyundai','kia','volvo','mazda','subaru','lexus','ferrari','lamborghini','byd','zeekr','chery','haval','geely','exeed','xiaomi','nio','rivian','lucid','bentley','mclaren','bugatti','jaguar','rover','mini','skoda','peugeot','renault','fiat','jeep','dodge','ram','gmc','cadillac','lincoln','buick','acura','infiniti','genesis','polestar','suzuki','mitsubishi','cupra','rimac','omoda','jaecoo','kaiyi','moskvich','lada','uaz','kamaz','aurus']);
// Марки, у которых на Wikimedia Commons нет подходящих фото — поиск пропускается, сразу fallback.
const SKIP_PHOTO_BRANDS = new Set(['esteo']);
const CAR_TERMS = new Set(['suv','crossover','sedan','ev','truck','pickup','coupe','roadster','hatchback','wagon','convertible','hypercar','supercar']);

function commonsQuery(enTitle) {
    const words = String(enTitle || '').match(/[A-Za-z][A-Za-z0-9\-]{2,}/g) || [];
    const brand = words.find(w => CAR_BRANDS.has(w.toLowerCase()));
    if (brand) {
        if (SKIP_PHOTO_BRANDS.has(brand.toLowerCase())) return '';
        return brand + ' automobile';
    }
    const term = words.find(w => CAR_TERMS.has(w.toLowerCase()));
    if (term) return term + ' automobile';
    return '';
}

async function fetchCommonsImage(query) {
    if (!query) return null;
    const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json'
        + '&generator=search&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + query)
        + '&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1280';
    try {
        const res = await fetch(api, Object.assign({ signal: AbortSignal.timeout(20000) }, UA));
        if (!res.ok) return null;
        const data = await res.json();
        const pages = Object.values((data.query && data.query.pages) || {});
        // Сортируем по index — релевантность выдачи поиска
        pages.sort((a, b) => (a.index || 99) - (b.index || 99));
        for (const p of pages) {
            const ii = p.imageinfo && p.imageinfo[0];
            if (!ii || ii.mime !== 'image/jpeg') continue;
            if ((ii.width || 0) < 700) continue;
            const meta = ii.extmetadata || {};
            const artist = stripHtml((meta.Artist && meta.Artist.value) || '').slice(0, 60) || 'Wikimedia Commons';
            const lic = stripHtml((meta.LicenseShortName && meta.LicenseShortName.value) || '') || 'Wikimedia Commons';
            return { thumb: ii.thumburl || ii.url, credit: ('Фото: ' + artist + ', ' + lic).slice(0, 140) };
        }
    } catch (e) {
        console.log('Поиск фото Commons не удался: ' + e.message);
    }
    return null;
}

async function downloadImage(localPath, url) {
    const res = await fetch(url, Object.assign({ signal: AbortSignal.timeout(30000) }, UA));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10000 || buf.length > 6 * 1024 * 1024) throw new Error('подозрительный размер файла');
    fs.mkdirSync(path.dirname(path.join(ROOT, '.' + localPath)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, '.' + localPath), buf);
}

function insertBeforeClosing(src, marker, closing, block) {
    const mi = src.indexOf(marker);
    if (mi < 0) throw new Error('Маркер не найден: ' + marker);
    const ci = src.indexOf(closing, mi);
    if (ci < 0) throw new Error('Закрывающий маркер не найден: ' + marker);
    return src.slice(0, ci) + block + src.slice(ci);
}

async function main() {
    const state = loadSeen();
    const seen = new Set(state.links);
    const perFeed = [];

    for (const f of FEEDS) {
        try {
            const res = await fetch(f.url, {
                headers: UA,
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
    const bank = parseArrayLiteral(m[1], 'ARTICLE_BANK');
    const base = bank.length;
    const bankTitleSets = bank.map(a => titleWordSet(a.title));
    const usedSlugs = new Set();
    const acceptedSets = [];

    const articles = [];
    const retryLinks = [];
    for (let i = 0; i < selected.length; i++) {
        const it = selected[i];

        // Перевод. При сбое сервиса — пропускаем статью БЕЗ пометки «виденной»,
        // чтобы следующий запуск попробовал снова.
        // Тело: берём content:encoded, если он заметно длиннее анонса (объёмнее материал).
        const descLen = (it.desc || '').length;
        const rawBody = (it.full && it.full.length > descLen + 120) ? it.full : (it.desc || it.title);
        const bodySrc = truncateWords(rawBody, 1600);
        const ruTitle = looksRussian(it.title) ? it.title : await translateToRussian(it.title);
        if (!ruTitle || !looksRussian(ruTitle)) {
            console.log('Пропуск — перевод временно недоступен [' + it.source + ']: ' + it.title);
            retryLinks.push(it.link);
            continue;
        }
        let bodyRu = looksRussian(bodySrc) ? bodySrc : await translateToRussian(bodySrc);
        if (!bodyRu || !looksRussian(bodyRu)) bodyRu = ruTitle;

        console.log('Переведено [' + it.source + ']: ' + ruTitle);

        // Дедупликация тем: слишком похожий заголовок уже есть в банке или в этой партии
        const wordSet = titleWordSet(ruTitle);
        const isDup = bankTitleSets.some(set => titlesSimilar(wordSet, set)) || acceptedSets.some(set => titlesSimilar(wordSet, set));
        if (isDup) {
            console.log('Пропуск — дубликат темы: ' + ruTitle);
            state.links.push(it.link);
            continue;
        }

        const num = base + articles.length + 1;
        const tag = detectTag(ruTitle, bodyRu);
        const paragraphs = buildParagraphs(bodyRu, tag, num);
        const totalChars = paragraphs.join('').length;

        // Фильтр малоценного контента: короче ~350 знаков не публикуем вовсе
        if (totalChars < 350) {
            console.log('Пропуск — слишком короткий материал (' + totalChars + ' зн.): ' + ruTitle);
            state.links.push(it.link);
            continue;
        }

        const text = truncateWords(paragraphs[0], 240);

        let slug = slugify(ruTitle);
        if (!slug) slug = 'news-' + num;
        if (usedSlugs.has(slug)) slug = slug + '-' + num;
        usedSlugs.add(slug);

        const readTime = Math.max(1, Math.round(totalChars / 1100));

        acceptedSets.push(wordSet);

        articles.push({
            title: ruTitle,
            origTitle: it.title,
            text,
            paragraphs,
            tag,
            readTime,
            slug,
            num,
            sourceName: it.source,
            sourceUrl: it.link
        });
    }

    if (!articles.length) {
        console.log(retryLinks.length ? 'Переводчик недоступен — статьи будут обработаны в следующем запуске' : 'Новых подходящих статей нет');
        saveSeen(state);
        process.exit(0);
    }

    console.log('Добавляю статей: ' + articles.length);

    // Подбираем фото: сперва Wikimedia Commons (по бренду/типу), при неудаче — тематический fallback сайта.
    for (const a of articles) {
        const query = commonsQuery(a.origTitle);
        if (DRY_RUN) {
            console.log('[DRY RUN] фото: ' + (query ? 'искали бы «' + query + '»' : 'бренда/типа кузова нет — сразу fallback') + ', рубрика ' + a.tag);
            a.image = { url: FALLBACK_POOLS[a.tag] ? FALLBACK_POOLS[a.tag][a.num % FALLBACK_POOLS[a.tag].length] : FALLBACK_DEFAULT[a.num % FALLBACK_DEFAULT.length], alt: a.title, credit: 'Фото: АвтоТема' };
            continue;
        }
        const found = query ? await fetchCommonsImage(query) : null;
        let image = null;
        if (found) {
            const localUrl = '/images/auto/art-' + a.num + '.jpg';
            try {
                await downloadImage(localUrl, found.thumb);
                image = { url: localUrl, alt: a.title, credit: found.credit };
            } catch (e) {
                console.log('Скачивание фото не удалось (' + e.message + '), берём fallback');
            }
        }
        if (!image) {
            const pool = FALLBACK_POOLS[a.tag] || FALLBACK_DEFAULT;
            image = { url: pool[a.num % pool.length], alt: a.title, credit: 'Фото: АвтоТема' };
        }
        a.image = image;
        console.log('  #' + a.num + ' [' + a.sourceName + ' / ' + a.tag + '] ' + a.title + ' | фото: ' + a.image.url);
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

    // 2. article_content.js → BODIES (2–4 абзаца) и SOURCES (ссылка на новость)
    const contentPath = path.join(ROOT, 'article_content.js');
    let contentSrc = fs.readFileSync(contentPath, 'utf8');
    const bodiesBlock = articles.map(a =>
        '    [\n' + a.paragraphs.map(p => '        "' + jsStr(p) + '"').join(',\n') + '\n    ]'
    ).join(',\n');
    contentSrc = insertBeforeClosing(contentSrc, 'const BODIES = [', '\n];', ',\n' + bodiesBlock + '\n');
    const sourcesBlock = articles.map(a =>
        '    [\n        { name: "' + jsStr(a.sourceName + ' — первоисточник') + '", url: "' + jsStr(a.sourceUrl) + '" }\n    ]'
    ).join(',\n');
    contentSrc = insertBeforeClosing(contentSrc, 'const SOURCES = [', '\n];', ',\n' + sourcesBlock + '\n');
    fs.writeFileSync(contentPath, contentSrc);

    // 3. article_images.js → SLUGS + IMAGES (фото скачаны локально либо fallback)
    const imagesPath = path.join(ROOT, 'article_images.js');
    const imagesSrc = fs.readFileSync(imagesPath, 'utf8');
    const slugsBlock = articles.map(a => '    ' + a.num + ': "' + a.slug + '"').join(',\n');
    let newImages = insertBeforeClosing(imagesSrc, 'const SLUGS = {', '\n};', ',\n' + slugsBlock + '\n');
    const imagesBlock = articles.map(a =>
        '    ' + a.num + ': { url: "' + jsStr(a.image.url) + '", alt: "' + jsStr(a.image.alt) + '", credit: "' + jsStr(a.image.credit) + '" }'
    ).join(',\n');
    newImages = insertBeforeClosing(newImages, 'const IMAGES = {', '\n};', ',\n' + imagesBlock + '\n');
    fs.writeFileSync(imagesPath, newImages);

    // 4. state/seen_news.json — запоминаем использованные ссылки (неудачный перевод оставляем на следующий раз)
    for (const it of selected) {
        if (!retryLinks.includes(it.link)) state.links.push(it.link);
    }
    state.added += articles.length;
    saveSeen(state);

    console.log('Файлы успешно подготовлены');
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
