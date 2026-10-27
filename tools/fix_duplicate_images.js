const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; AvtoTemaBot/1.0; +https://avtotema-news.online)' };

// 5 articles that still have duplicate image files
const REPLACEMENTS = [
  { id: 220, query: 'Koenigsegg Agera GIMS 2018', desc: 'Гиперкар Koenigsegg CC850' },
  { id: 196, query: 'Tesla roadster 2020 prototype', desc: 'Флагманский электрокар Tesla Roadster' },
  { id: 207, query: 'Roadster-2020-shareholder-meeting', desc: 'Концепт родстера Tesla' },
  { id: 188, query: 'Porsche Carrera GT Classic-Gala', desc: 'Гиперкар Porsche 918 Spyder' },
  { id: 168, query: 'BMW Concept X7 iPerformance', desc: 'Флагманский спортивный внедорожник BMW' }
];

function getAllHashes() {
  const hashes = new Set();
  const dir = path.join(ROOT, 'images', 'auto');
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')) {
        const buf = fs.readFileSync(path.join(dir, f));
        hashes.add(crypto.createHash('md5').update(buf).digest('hex'));
      }
    }
  }
  return hashes;
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchUniqueCommonsImage(query, existingHashes) {
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json'
    + '&generator=search&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + query)
    + '&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1280';

  const res = await fetch(api, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values((data.query && data.query.pages) || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));

  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii || ii.mime !== 'image/jpeg' || (ii.width || 0) < 700) continue;

    const thumbUrl = ii.thumburl || ii.url;
    try {
      const imgRes = await fetch(thumbUrl, { headers: UA, signal: AbortSignal.timeout(25000) });
      if (!imgRes.ok) continue;
      const buf = Buffer.from(await imgRes.arrayBuffer());
      if (buf.length < 15000) continue;

      const hash = crypto.createHash('md5').update(buf).digest('hex');
      if (existingHashes.has(hash)) {
        console.log(`[Hash Duplicate skipped] for query "${query}" (hash ${hash})`);
        continue;
      }

      existingHashes.add(hash);
      const meta = ii.extmetadata || {};
      let artist = stripHtml((meta.Artist && meta.Artist.value) || '').slice(0, 60) || 'Wikimedia Commons';
      const lic = stripHtml((meta.LicenseShortName && meta.LicenseShortName.value) || '') || 'CC BY-SA';
      const credit = ('Фото: ' + artist + ', ' + lic).slice(0, 140);

      return { buf, credit, hash, thumbUrl };
    } catch (err) {
      // try next
    }
  }
  return null;
}

async function main() {
  console.log('Начинаю замену оставшихся дубликатов фотографий...');
  const existingHashes = getAllHashes();
  console.log(`Существующих хэшей в базе: ${existingHashes.size}`);

  const imagesModPath = path.join(ROOT, 'article_images.js');
  let imagesSrc = fs.readFileSync(imagesModPath, 'utf8');

  for (const item of REPLACEMENTS) {
    console.log(`\nОбработка статьи #${item.id} (Поиск: "${item.query}")...`);
    const found = await fetchUniqueCommonsImage(item.query, existingHashes);
    if (!found) {
      console.error(`❌ Не удалось найти уникальное фото для статьи #${item.id}`);
      continue;
    }

    const localPath = path.join(ROOT, 'images', 'auto', `art-${item.id}.jpg`);
    fs.writeFileSync(localPath, found.buf);
    console.log(`✅ Записан уникальный файл images/auto/art-${item.id}.jpg [Хэш: ${found.hash}, Размер: ${found.buf.length} байт]`);

    // Update credit in article_images.js
    const creditEsc = found.credit.replace(/"/g, '\\"');
    const regex = new RegExp(`(${item.id}:\\s*\\{[^}]*credit:\\s*")[^"]*(")`);
    if (regex.test(imagesSrc)) {
      imagesSrc = imagesSrc.replace(regex, `$1${creditEsc}$2`);
    } else {
      console.warn(`⚠️ Не удалось найти regex для credit статьи #${item.id} в article_images.js`);
    }
  }

  fs.writeFileSync(imagesModPath, imagesSrc);
  console.log('\narticle_images.js успешно обновлен.');
}

main().catch(err => {
  console.error('Ошибка:', err);
  process.exit(1);
});
