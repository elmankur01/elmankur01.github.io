// Скрипт для публикации интерактивных битв-сравнений авто в Telegram
const fs = require('fs');
const { CARS_DATABASE } = require('../../cars_data.js');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
    console.error('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    process.exit(1);
}

// Пресеты популярных баттлов
const BATTLES = [
    {
        title: 'Битва популярных кроссоверов',
        cars: ['haval-jolion', 'geely-coolray', 'chery-tiggo-7'],
        pollQuestion: 'Какой кроссовер до 3 млн ₽ вы бы выбрали?'
    },
    {
        title: 'Битва флагманских электрокаров',
        cars: ['zeekr-001', 'xiaomi-su7'],
        pollQuestion: 'Zeekr 001 или Xiaomi SU7: за кем будущее?'
    },
    {
        title: 'Рамный внедорожник против Премиум кроссовера',
        cars: ['tank-300', 'exeed-rx'],
        pollQuestion: 'Что лучше для российских дорог: Tank 300 или Exeed RX?'
    },
    {
        title: 'Доступный выбор для города и семьи',
        cars: ['lada-vesta', 'moskvich-3'],
        pollQuestion: 'Лада Vesta NG или Москвич 3?'
    },
    {
        title: 'Битва дальнобойных премиум-гибридов',
        cars: ['li-auto-l7', 'esteo-v27'],
        pollQuestion: 'Какой гибрид с запасом хода >1200 км круче?'
    }
];

// Выбираем баттл по дню года
const now = new Date();
const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const battle = BATTLES[dayOfYear % BATTLES.length];

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

lines.push(``, `📦 <b>Объём багажника:</b>`);
selectedCars.forEach(c => {
    const isWin = c.trunk === maxTrunk;
    lines.push(`• ${c.name}: <b>${c.trunk} л</b> ${isWin ? '🏆 <i>(самый вместительный)</i>' : ''}`);
});

lines.push(``, `🐎 <b>Мощность и привод:</b>`);
selectedCars.forEach(c => {
    lines.push(`• ${c.name}: <b>${c.power} л.с.</b>, ${c.drive}`);
});

lines.push(``, `💰 <b>Ориентировочная цена:</b>`);
selectedCars.forEach(c => {
    lines.push(`• ${c.name}: <b>${c.price}</b>`);
});

lines.push(
    `━━━━━━━━━━━━━━━━━━━`,
    `👇 <i>Нажмите кнопку ниже, чтобы открыть интерактивное сравнение с полными габаритами и графиками!</i>`
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
            {
                text: '🚗 Все новости на АвтоТеме',
                url: 'https://avtotema-news.online/'
            }
        ]
    ]
};

async function publish() {
    const photo = selectedCars[0].image.startsWith('http')
        ? selectedCars[0].image
        : `https://avtotema-news.online${selectedCars[0].image}`;

    const tgUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
    const res = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            photo: photo,
            caption: text,
            parse_mode: 'HTML',
            reply_markup: keyboard
        })
    });

    const data = await res.json();
    if (data.ok) {
        console.log('✅ Баттл успешно опубликован в Telegram!');
        // Также отправляем опрос для максимального вовлечения подписчиков
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
    } else {
        console.error('Ошибка публикации баттла:', data);
        process.exit(1);
    }
}

publish().catch(e => {
    console.error(e);
    process.exit(1);
});
