const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const dirs = [path.join(ROOT, 'images', 'auto'), path.join(ROOT, 'images')];

const hashMap = {};
let total = 0;

dirs.forEach(d => {
  if (fs.existsSync(d)) {
    fs.readdirSync(d).forEach(f => {
      if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg') || f.endsWith('.webp')) {
        const full = path.join(d, f);
        try {
          const buf = fs.readFileSync(full);
          const hash = crypto.createHash('md5').update(buf).digest('hex');
          if (!hashMap[hash]) hashMap[hash] = [];
          hashMap[hash].push(path.relative(ROOT, full));
          total++;
        } catch (e) {}
      }
    });
  }
});

const duplicates = [];
for (const [hash, list] of Object.entries(hashMap)) {
  if (list.length > 1) {
    duplicates.push({ hash, files: list });
  }
}

if (duplicates.length > 0) {
  console.error(`❌ [ОШИБКА ДУБЛИКАТОВ ФОТО] Найдено ${duplicates.length} групп дублирующихся изображений:`);
  duplicates.forEach(d => {
    console.error(`  - Хэш ${d.hash} (${d.files.length} копий): ${d.files.join(' == ')}`);
  });
  process.exit(1);
}

console.log(`✅ [Проверка фото] Все изображения сайта уникальны (${total} файлов). Дубликатов нет.`);
process.exit(0);
