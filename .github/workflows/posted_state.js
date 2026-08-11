// Общий учёт статей, уже опубликованных в Telegram-канале.
// Состояние — state/posted.json в корне репозитория (массив номеров статей, 1-базисный,
// совпадает с ключами SLUGS в article_images.js). Файл намеренно лежит НЕ в .github/workflows:
// GITHUB_TOKEN не может пушить изменения внутри этой папки (нужны права workflows).
// Используется publish_daily.js и publish_category.js, чтобы одни и те же статьи не повторялись.
// После успешной публикации скрипт добавляет номер статьи в состояние и коммитит его,
// поэтому следующий запуск (в т.ч. в другом workflow) уже знает о публикации.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'posted.json');

function loadPosted() {
    try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        if (Array.isArray(data.posted)) return data.posted;
    } catch (e) {}
    return [];
}

function savePosted(posted) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const payload = { updated: new Date().toISOString(), posted: [...posted].sort((a, b) => a - b) };
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

module.exports = { loadPosted, savePosted, commitAndPush };
