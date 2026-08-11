// Общий учёт статей, уже опубликованных в Telegram-канале.
// Состояние — state/posted.json в корне репозитория. Записи вида { n, d }:
// n — номер статьи (1-базисный, совпадает с ключами SLUGS в article_images.js),
// d — дата публикации (ISO). Дайджест «Итоги недели» (publish_weekly.js) использует d.
// Файл намеренно лежит НЕ в .github/workflows: GITHUB_TOKEN не может пушить
// изменения внутри этой папки (нужны права workflows).
// Используется publish_daily.js и publish_category.js, чтобы одни и те же статьи
// не повторялись. После успешной публикации скрипт добавляет номер статьи
// в состояние и коммитит его, поэтому следующий запуск (в т.ч. в другом
// workflow) уже знает о публикации.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'posted.json');

function loadPosted() {
    try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        if (Array.isArray(data.posted)) return data.posted.map(x => (typeof x === 'number' ? x : x.n));
    } catch (e) {}
    return [];
}

// Для дайджеста «Итоги недели»: возвращает массив { n, d }, d — дата публикации.
function loadPostedWithDates() {
    try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        if (Array.isArray(data.posted)) return data.posted.map(x => (typeof x === 'number' ? { n: x, d: null } : x));
    } catch (e) {}
    return [];
}

function savePosted(posted) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const now = new Date().toISOString();
    // Сохраняем уже известные даты публикаций, чтобы повторный вызов с числами
    // (publish_daily/publish_category делают loadPosted() → push → savePosted)
    // не сбрасывал дату ранее опубликованных статей.
    const known = {};
    try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        if (Array.isArray(data.posted)) {
            for (const x of data.posted) {
                if (typeof x !== 'number' && x && x.n) known[x.n] = x.d;
            }
        }
    } catch (e) {}
    const entries = [...posted].map(x => {
        if (typeof x === 'number') {
            return { n: x, d: known[x] || now };
        }
        return { n: x.n, d: x.d || known[x.n] || now };
    });
    entries.sort((a, b) => a.n - b.n);
    const payload = { updated: now, posted: entries };
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2) + '\n');
    fs.renameSync(tmp, STATE_FILE);
}

function commitAndPush() {
    execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
    execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
    execSync('git add ' + STATE_FILE, { stdio: 'inherit' });
    if (execSync('git diff --cached --quiet; echo $?').toString().trim() === '0') {
        console.log('Состояние опубликованных статей не изменилось');
        return;
    }
    execSync('git commit -m "Auto: отметка опубликованных статей"', { stdio: 'inherit' });
    execSync('git pull --rebase origin main', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    console.log('Состояние опубликованных статей запушено');
}

module.exports = { loadPosted, loadPostedWithDates, savePosted, commitAndPush };
