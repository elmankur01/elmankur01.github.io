// Скрипт для публикации интерактивных битв-сравнений авто в Telegram с контролем дублей
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { CARS_DATABASE } = require('../../cars_data.js');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
    console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    process.exit(1);
}

const STATE_FILE = path.join(__dirname, '..', '..', 'state', 'posted_battles.json');

function loadPostedBattles() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
            if (Array.isArray(data.posted)) return data.posted;
        }
    } catch (e) {}
    return [];
}

function savePostedBattle(battleId) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const list = loadPostedBattles();
    list.push({ id: battleId, date: new Date().toISOString() });
    fs.writeFileSync(STATE_FILE, JSON.stringify({ updated: new Date().toISOString(), posted: list }, null, 2) + '\n');

    try {
        execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
        execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
        execSync('git add ' + STATE_FILE, { stdio: 'inherit' });
        if (execSync('git diff --cached --quiet; echo $?').toString().trim() !== '0') {
            execSync('git commit -m "Auto: отметка опубликованной битвы авто"', { stdio: 'inherit' });
            execSync('git pull --rebase origin main', { stdio: 'inherit' });
            execSync('git push', { stdio: 'inherit' });
            console.log('✅ История баттлов сохранена в Git.');
        }
    } catch (err) {
        console.warn('Предупреждение при коммите истории баттлов:', err.message);
    }
}

// 20 разнообразных уникальных баттлов из моделей базы CARS_DATABASE
const BATTLES = [
    {
        id: 'crossovers-main-trio',
        title: 'Битва популярных кроссоверов',
        cars: ['haval-jolion', 'geely-coolray', 'chery-tiggo-7'],
        pollQuestion: 'Какой кроссовер до 3 млн ₽ вы бы выбрали?'
    },
    {
        id: 'ev-titans-zeekr-xiaomi',
        title: 'Битва флагманских электрокаров',
        cars: ['zeekr-001', 'xiaomi-su7'],
        pollQuestion: 'Zeekr 001 или Xiaomi SU7: за кем будущее?'
    },
    {
        id: 'frame-suv-vs-premium-crossover',
        title: 'Рамный внедорожник против Премиум-кроссовера',
        cars: ['tank-300', 'exeed-rx'],
        pollQuestion: 'Что лучше для российских дорог: Tank 300 или Exeed RX?'
    },
    {
        id: 'budget-city-choice',
        title: 'Доступный выбор для города и семьи',
        cars: ['lada-vesta', 'moskvich-3'],
        pollQuestion: 'Лада Vesta NG или Москвич 3?'
    },
    {
        id: 'long-range-hybrids',
        title: 'Битва дальнобойных премиум-гибридов',
        cars: ['li-auto-l7', 'esteo-v27'],
        pollQuestion: 'Какой гибрид с запасом хода >1200 км круче?'
    },
    {
        id: 'sport-legend-vs-tech-rocket',
        title: 'Культовый спорткар против хайтек-электрокара',
        cars: ['porsche-911', 'xiaomi-su7'],
        pollQuestion: 'Классика Porsche 911 или инновационный Xiaomi SU7?'
    },
    {
        id: 'business-classic-vs-modern-ev',
        title: 'Бизнес-седан: классика против электро-будущего',
        cars: ['toyota-camry', 'zeekr-001'],
        pollQuestion: 'Легендарная Toyota Camry или мощный Zeekr 001?'
    },
    {
        id: 'family-suv-changan-chery',
        title: 'Битва семейных кроссоверов',
        cars: ['changan-cs75', 'chery-tiggo-7'],
        pollQuestion: 'Что надежнее и комфортнее: Changan CS75 или Chery Tiggo 7?'
    },
    {
        id: 'compact-ev-city',
        title: 'Компактные электрокары для мегаполиса',
        cars: ['kia-ev3', 'esteo-v27'],
        pollQuestion: 'Kia EV3 или инновационный Esteo V27?'
    },
    {
        id: 'youth-drive-coolray-jolion',
        title: 'Молодежные городские бестселлеры',
        cars: ['geely-coolray', 'haval-jolion'],
        pollQuestion: 'Драйвовый Geely Coolray или просторный Haval Jolion?'
    },
    {
        id: 'practical-changan-vs-moskvich',
        title: 'Практичный городской кроссовер до 2.3 млн ₽',
        cars: ['moskvich-3', 'changan-cs75'],
        pollQuestion: 'Москвич 3 или более крупный Changan CS75?'
    },
    {
        id: 'comfort-offroad-tank-changan',
        title: 'Проходимость и вместительность',
        cars: ['tank-300', 'changan-cs75'],
        pollQuestion: 'Брутальный Tank 300 или универсальный кроссовер Changan?'
    },
    {
        id: 'sedan-vs-crossover-folk',
        title: 'Народный седан против кроссовера',
        cars: ['lada-vesta', 'haval-jolion'],
        pollQuestion: 'Седан Lada Vesta или популярный кроссовер Haval Jolion?'
    },
    {
        id: 'premium-crossover-flagships',
        title: 'Битва премиальных флагманов',
        cars: ['exeed-rx', 'li-auto-l7'],
        pollQuestion: 'Exeed RX или просторный семейный Li Auto L7?'
    },
    {
        id: 'pure-drive-porsche-zeekr',
        title: 'Экстремальная динамика и управляемость',
        cars: ['porsche-911', 'zeekr-001'],
        pollQuestion: 'Porsche 911 или полноприводный 544-сильный Zeekr 001?'
    },
    {
        id: 'business-vs-premium-hybrid',
        title: 'Комфорт бизнес-класса',
        cars: ['toyota-camry', 'li-auto-l7'],
        pollQuestion: 'Бизнес-седан Toyota Camry или роскошный гибрид Li Auto L7?'
    },
    {
        id: 'modern-suv-trio',
        title: 'Битва полного привода',
        cars: ['tank-300', 'exeed-rx', 'chery-tiggo-7'],
        pollQuestion: 'Кто лучше справится с суровой зимой и бездорожьем?'
    },
    {
        id: 'ev-vs-turbo-crossover',
        title: 'Электротяга против турбомотора',
        cars: ['kia-ev3', 'geely-coolray'],
        pollQuestion: 'Электрический Kia EV3 или проверенный бензиновый Geely Coolray?'
    },
    {
        id: 'tech-luxury-exeed-zeekr',
        title: 'Битва премиального хайтека',
        cars: ['exeed-rx', 'zeekr-001'],
        pollQuestion: 'Купе-кроссовер Exeed RX или спортивный лифтбек Zeekr 001?'
    },
    {
        id: 'smart-city-cars',
        title: 'Лучший автомобиль на каждый день',
        cars: ['geely-coolray', 'changan-cs75', 'haval-jolion'],
        pollQuestion: 'Главный городской фаворит для российских условий?'
    }
];

// Подбираем баттл, который ещё НЕ выходил (или выходил дольше всего назад)
const postedHistory = loadPostedBattles();
const recentIds = new Set(postedHistory.slice(-15).map(x => x.id));

let battle = BATTLES.find(b => !recentIds.has(b.id));
if (!battle) {
    // Если все 20 баттлов уже выходили, берем самый старый по времени
    const lastDates = {};
    postedHistory.forEach(h => { lastDates[h.id] = new Date(h.date).getTime(); });
    const sorted = [...BATTLES].sort((a, b) => (lastDates[a.id] || 0) - (lastDates[b.id] || 0));
    battle = sorted[0];
}

console.log(`🎯 Выбран уникальный баттл: "${battle.title}" [ID: ${battle.id}]`);

const selectedCars = battle.cars.map(id => CARS_DATABASE.find(c => c.id === id)).filter(Boolean);

// Расчёт лучших параметров
const minAccel = Math.min(...selectedCars.map(c => c.acceleration));
const maxClearance = Math.max(...selectedCars.map(c => c.clearance));
const maxTrunk = Math.max(...selectedCars.map(c => c.trunk));
const maxPower = Math.max(...selectedCars.map(c => c.power));

const compareUrl = `https://avtotema-news.online/compare.html?cars=${battle.cars.join(',')}`;

const lines = [
    `⚔️ <b>БИТВА ХАРАКТЕРИСТИК: ${battle.title.toUpperCase()}</b> | <i>АвтоТема</i>`,
    `━━━━━━━━━━━━━━━━━━━`,
    selectedCars.map(c => `🚗 <b>${c.name}</b>`).join(' <i>vs</i> '),
    ``,
    `📊 <b>Сравнение характеристик «бок о бок»:</b>`,
    ``,
    `⚡ <b>Разгон 0-100 км/ч:</b>`
];

selectedCars.forEach(c => {
    const isWin = c.acceleration === minAccel;
    lines.push(`• ${c.name}: <b>${c.acceleration} с</b> ${isWin ? '🏆 <i>(быстрее всех)</i>' : ''}`);
});

lines.push(``, `🏔️ <b>Дорожный просвет (клиренс):</b>`);
selectedCars.forEach(c => {
    const isWin = c.clearance === maxClearance;
    lines.push(`• ${c.name}: <b>${c.clearance} мм</b> ${isWin ? '🏆 <i>(выше всех)</i>' : ''}`);
});

lines.push(``, `🐎 <b>Мощность двигателя:</b>`);
selectedCars.forEach(c => {
    const isWin = c.power === maxPower;
    lines.push(`• ${c.name}: <b>${c.power} л.с.</b> ${isWin ? '🏆' : ''}`);
});

lines.push(``, `📦 <b>Объем багажника:</b>`);
selectedCars.forEach(c => {
    const isWin = c.trunk === maxTrunk;
    lines.push(`• ${c.name}: <b>${c.trunk} л</b> ${isWin ? '🏆' : ''}`);
});

lines.push(
    ``,
    `━━━━━━━━━━━━━━━━━━━`,
    `👇 <b>Голосуйте в опросе ниже: кто ваш победитель?</b>`,
    `🔗 <i>Сравнить эти модели детально со всеми графиками можно на сайте:</i>`,
    `👉 ${compareUrl}`
);

const text = lines.join('\n');

const keyboard = {
    inline_keyboard: [
        [
            {
                text: '📊 Интерактивное сравнение «Бок о бок» ↗',
                url: compareUrl
            }
        ],
        [
            { text: '🛃 Растаможка и утильсбор', url: 'https://avtotema-news.online/calc-customs.html' },
            { text: '🧮 Налог 2026', url: 'https://avtotema-news.online/calc-tax.html' }
        ],
        [
            { text: '🚗 Каталог марок', url: 'https://avtotema-news.online/brands/' },
            { text: '🌐 АвтоТема Главная', url: 'https://avtotema-news.online/' }
        ]
    ]
};

async function publish() {
    const photo = selectedCars[0].image.startsWith('http')
        ? selectedCars[0].image
        : `https://avtotema-news.online${selectedCars[0].image}`;

    let safeCaption = text;
    if (safeCaption.length > 1000) {
        safeCaption = safeCaption.slice(0, 950).replace(/\n[^\n]*$/, '') + '\n\n👇 <i>Полное сравнение с графиками доступно на сайте!</i>';
    }

    const tgUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
    const res = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            photo: photo,
            caption: safeCaption,
            parse_mode: 'HTML',
            reply_markup: keyboard
        })
    });

    const data = await res.json();
    if (data.ok) {
        console.log('✅ Баттл успешно опубликован в Telegram!');
        const pollUrl = `https://api.telegram.org/bot${token}/sendPoll`;
        await fetch(pollUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                question: battle.pollQuestion,
                options: selectedCars.map(c => c.name),
                is_anonymous: false
            })
        });
        console.log('✅ Опрос прикреплён к посту!');

        // Сохраняем состояние опубликованного баттла
        savePostedBattle(battle.id);
    } else {
        console.error('Ошибка публикации баттла:', data);
        process.exit(1);
    }
}

publish().catch(e => {
    console.error(e);
    process.exit(1);
});
