// ==========================================
// АвтоТема — интерактив: тест, «авто дня», факт дня, голосование
// Всё работает на клиенте: данные не отправляются на сервер,
// персональные данные не собираются (сайт остаётся «не оператором» ПД).
// ==========================================

// ===== Тест «Какой автомобиль вам подходит» =====
const QUIZ_ARCHETYPES = {
    city: {
        icon: '🏙️',
        title: 'Городской прагматик',
        text: 'Вам не нужны лишние сантиметры и лошади — нужен компактный, экономичный и манёвренный автомобиль, на котором удобно каждый день ездить по пробкам и парковаться во дворах.',
        slug: 'byudzhetnye-avto-2026-chto-kupit-do-2-mln-rubley'
    },
    family: {
        icon: '👨‍👩‍👧‍👦',
        title: 'Семейный организатор',
        text: 'Просторный салон, багажник и безопасность — вот ваши приоритеты. Кроссовер или минивэн соберёт всю семью и увезёт её куда угодно с комфортом.',
        slug: 'miniveny-i-semeynye-krossovery-obzor-dlya-bolshikh-semey'
    },
    sport: {
        icon: '🏎️',
        title: 'Любитель скорости',
        text: 'Вам важны эмоции за рулём: отклик на газ, звук мотора и характер. Спорткар или горячий хэтчбек — то, что нужно для драйва каждый день.',
        slug: 'sportkary-2026-elektricheskie-i-gibridnye-bestsellery'
    },
    offroad: {
        icon: '⛰️',
        title: 'Покоритель дорог',
        text: 'Асфальт — не предел. Вам нужна рамная надёжность, полный привод и запаска на воротах. Внедорожник не подведёт ни на даче, ни в глуши.',
        slug: 'uaz-patriot-i-vnedorozhniki-chto-novogo-v-2026'
    },
    eco: {
        icon: '🔋',
        title: 'Эко-пионер',
        text: 'Будущее — за электричеством. Низкий расход, тишина и передовые технологии — электромобиль отлично подходит для города и не боится дальних поездок.',
        slug: 'elektromobili-v-2026-godu-gonka-za-zapasom-khoda-v-1000-km'
    }
};

const QUIZ_QUESTIONS = [
    {
        q: 'Где вы ездите чаще всего?',
        options: [
            { text: 'Город, пробки, парковки', scores: { city: 2, eco: 1 } },
            { text: 'Трасса и дальние поездки', scores: { family: 2, offroad: 1 } },
            { text: 'За город: дача, лес, природа', scores: { offroad: 3 } },
            { text: 'Везде понемногу', scores: { family: 1, sport: 1 } }
        ]
    },
    {
        q: 'Что для вас важнее всего в машине?',
        options: [
            { text: 'Экономия и экология', scores: { eco: 3 } },
            { text: 'Комфорт и вместимость', scores: { family: 3 } },
            { text: 'Азарт и скорость', scores: { sport: 3 } },
            { text: 'Проходимость и надёжность', scores: { offroad: 3 } }
        ]
    },
    {
        q: 'Сколько человек обычно ездит с вами?',
        options: [
            { text: 'Только я', scores: { sport: 2, city: 1 } },
            { text: 'Я и пара пассажиров', scores: { sport: 1, city: 1 } },
            { text: 'Семья с детьми', scores: { family: 3 } },
            { text: 'Друзья или коллеги', scores: { family: 2 } }
        ]
    },
    {
        q: 'Какой у вас бюджет на автомобиль?',
        options: [
            { text: 'До 2 млн рублей', scores: { city: 2 } },
            { text: '2–4 млн рублей', scores: { family: 2, offroad: 1 } },
            { text: '4–8 млн рублей', scores: { sport: 2, eco: 1 } },
            { text: 'Цена не главное', scores: { sport: 2, offroad: 2 } }
        ]
    },
    {
        q: 'Какой тип кузова вам ближе?',
        options: [
            { text: 'Компактный хэтчбек', scores: { city: 3 } },
            { text: 'Кроссовер или SUV', scores: { family: 2, offroad: 2 } },
            { text: 'Седан или лифтбек', scores: { family: 1, sport: 1 } },
            { text: 'Купе или родстер', scores: { sport: 3 } }
        ]
    },
    {
        q: 'Что вы думаете об электромобилях?',
        options: [
            { text: 'Мечтаю о таком', scores: { eco: 3 } },
            { text: 'Рассматриваю как вариант', scores: { eco: 2 } },
            { text: 'Пока не мой формат', scores: { offroad: 1 } },
            { text: 'Уже пробовал или владею', scores: { eco: 3, sport: 1 } }
        ]
    }
];

function initQuiz(widget) {
    if (!widget) return;
    let step = -1;
    let scores = {};

    function render() {
        if (step === -1) {
            widget.innerHTML =
                '<div class="quiz-head">' +
                '<h3>Какой автомобиль вам подходит?</h3>' +
                '<p>Ответьте на 6 вопросов — подберём тип машины, который вам действительно нужен.</p>' +
                '</div>' +
                '<button class="btn btn-primary quiz-start" type="button">Начать тест</button>';
            widget.querySelector('.quiz-start').addEventListener('click', () => { step = 0; scores = {}; render(); });
            return;
        }
        if (step >= QUIZ_QUESTIONS.length) {
            const winner = Object.keys(scores).sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0] || 'city';
            const r = QUIZ_ARCHETYPES[winner] || QUIZ_ARCHETYPES.city;
            widget.innerHTML =
                '<div class="quiz-result">' +
                '<div class="quiz-result-icon">' + r.icon + '</div>' +
                '<h3>Ваш тип: ' + r.title + '</h3>' +
                '<p>' + r.text + '</p>' +
                '<a class="btn btn-primary" href="/articles/' + r.slug + '.html">Читать про такой автомобиль</a>' +
                '<button class="btn btn-ghost quiz-again" type="button">Пройти ещё раз</button>' +
                '</div>';
            widget.querySelector('.quiz-again').addEventListener('click', () => { step = -1; render(); });
            return;
        }
        const item = QUIZ_QUESTIONS[step];
        const opts = item.options.map((o, i) =>
            '<button class="quiz-option" type="button" data-i="' + i + '">' + o.text + '</button>'
        ).join('');
        widget.innerHTML =
            '<div class="quiz-head">' +
            '<span class="quiz-progress">Вопрос ' + (step + 1) + ' из ' + QUIZ_QUESTIONS.length + '</span>' +
            '<h3>' + item.q + '</h3>' +
            '</div>' +
            '<div class="quiz-options">' + opts + '</div>';
        widget.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const o = item.options[parseInt(btn.dataset.i, 10)];
                Object.keys(o.scores).forEach(k => { scores[k] = (scores[k] || 0) + o.scores[k]; });
                step++;
                render();
            });
        });
    }
    render();
}

// ===== «Авто дня»: статья недели из банка =====
function initCarOfDay(widget) {
    if (!widget || typeof ARTICLE_BANK === 'undefined') return;
    const bank = ARTICLE_BANK;
    const weekIndex = Math.floor(dayIndex() / 7);
    const idx = (weekIndex * 3) % bank.length;
    const a = bank[idx];
    const img = (typeof IMAGES !== 'undefined' && IMAGES[idx + 1]) ? IMAGES[idx + 1] : null;
    const slug = (typeof SLUGS !== 'undefined' && SLUGS[idx + 1]) ? SLUGS[idx + 1] : 'article-' + (idx + 1);
    widget.innerHTML =
        '<div class="cod-media">' + (img && img.url
            ? '<img src="' + escAttr(img.url) + '" alt="' + escAttr(img.alt || a.title) + '" loading="lazy" width="800" height="450">'
            : '') + '</div>' +
        '<span class="card-tag">' + escHtml(a.tag) + '</span>' +
        '<h3>' + escHtml(a.title) + '</h3>' +
        '<p>' + escHtml(a.text) + '</p>' +
        '<a class="btn btn-ghost" href="/articles/' + slug + '.html">Читать →</a>';
}

// ===== «Факт дня» =====
const FACTS = [
    'Первое дорожное ограничение скорости — 19 км/ч — ввели в 1901 году в Коннектикуте (США).',
    'В Китае водителей не заставляют сдавать на «механику»: достаточно теста на автоматической коробке.',
    'Идею ремней безопасности впервые запатентовали в 1885 году — ещё до изобретения автомобиля.',
    'Подушка безопасности срабатывает примерно за 30–40 миллисекунд — быстрее, чем моргает глаз.',
    'Самый массовый автомобиль в истории — Volkswagen Beetle: выпущено более 21 млн штук.',
    'Шины изобрели, когда до этого 70 лет ездили на цельнолитых колёсах, — благодаря велосипедистам.',
    'В США при левостороннем… нет, правостороннем движении пассажирская дверь слева считается «смертельной» из-за риска выхода на проезжую часть.',
    'Tesla Roadster 2008 года стал первым серийным электромобилем, проехавшим больше 400 км на одной зарядке.',
    'Первая в мире автозаправка открылась в 1895 году и торговала бензином как «патентованным средством».',
    'Дворники для стёкол придумала женщина — Мэри Андерсон, в 1903 году.',
    'Средний срок службы автомобиля в Европе и США — около 12 лет, а в России машины «живут» дольше из-за бережного ухода.',
    'Фары-«прозекторы» с высокой светоотдачей (ксенон) впервые появились на BMW 7-й серии в 1991 году.',
    'Первый автомобиль с передним приводом в массовом производстве — Citroën Traction Avant (1934).',
    'Практически все автопроизводители тестируют машины в Сибири и Аризоне — на мороз и жару.',
    'Электрообогрев зеркал появился в 1960-х, а подогрев сидений стал популярен только в 1990-е.',
    'В Японии машины с «кей-карами» (литровыми моторчиками) получают налоговые льготы — потому их так много.',
    'Первые «умные» ключи с дистанционным запуском появились в 1980-х и считались роскошью.',
    'Антиблокировочная система тормозов (ABS) стала обязательной в ЕС только в 2004 году.',
    'Реальный расход топлива обычно на 10–20% выше заявленного производителем.',
    'Первый автопилот с камерами и радарами для гражданских машин представил Mercedes-Benz в конце 1990-х.',
    'При равном объёме багажника хэтчбек «вмещает» больше, чем седан: грузится выше, до потолка.'
];

function initFactOfDay(widget) {
    if (!widget) return;
    const idx = dayIndex() % FACTS.length;
    widget.innerHTML =
        '<span class="fact-badge">Факт дня</span>' +
        '<p class="fact-text">' + escHtml(FACTS[idx]) + '</p>' +
        '<button class="fact-again" type="button">Показать другой факт</button>';
    widget.querySelector('.fact-again').addEventListener('click', () => {
        const next = (dayIndex() + 1 + Math.floor(Math.random() * (FACTS.length - 1))) % FACTS.length;
        widget.querySelector('.fact-text').textContent = FACTS[next];
    });
}

// ===== Голосование «Авто недели» =====
const POLL_OPTIONS = ['Германия: BMW, Mercedes, Porsche', 'Япония: Toyota, Honda, Nissan', 'США: Tesla, Ford, GM', 'Китай: BYD, Geely, Xiaomi'];
const POLL_STORAGE_KEY = 'avtotema_poll_votes_v2';
const POLL_CHOICE_KEY = 'avtotema_poll_choice_v2';

function initPoll(widget) {
    if (!widget) return;
    const votes = loadPollVotes();
    const voted = localStorage.getItem(POLL_CHOICE_KEY);

    function saveVote(option) {
        votes[option] = (votes[option] || 0) + 1;
        localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(votes));
        localStorage.setItem(POLL_CHOICE_KEY, option);
    }

    function render() {
        const total = Object.keys(votes).reduce((s, k) => s + (votes[k] || 0), 0);
        const rows = POLL_OPTIONS.map(o => {
            const count = votes[o] || 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            const chosen = voted === o;
            return '<div class="poll-row' + (chosen ? ' chosen' : '') + '">' +
                '<span class="poll-label">' + escHtml(o) + '</span>' +
                '<div class="poll-bar"><span style="width:' + pct + '%"></span></div>' +
                '<span class="poll-pct">' + pct + '%</span>' +
                '</div>';
        }).join('');
        widget.innerHTML =
            '<div class="poll-head">' +
            '<span class="quiz-progress">Голосование</span>' +
            '<h3>Какая страна делает лучшие автомобили?</h3>' +
            '</div>' +
            '<div class="poll-options">' + POLL_OPTIONS.map((o, i) =>
                '<button class="quiz-option" type="button" data-i="' + i + '"' + (voted ? ' disabled' : '') + '>' +
                escHtml(o) + '</button>').join('') + '</div>' +
            '<div class="poll-results">' + rows + '</div>' +
            '<p class="poll-note">Результаты хранятся только в вашем браузере и никуда не передаются.</p>';
        widget.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                saveVote(POLL_OPTIONS[parseInt(btn.dataset.i, 10)]);
                render();
            });
        });
    }
    render();
}

// ===== Вспомогательное =====
function dayIndex() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return Math.floor((now - startOfYear) / 86400000);
}

function loadPollVotes() {
    try { return JSON.parse(localStorage.getItem(POLL_STORAGE_KEY)) || {}; } catch (e) { return {}; }
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', function () {
    initQuiz(document.getElementById('quizWidget'));
    initCarOfDay(document.getElementById('carOfDayWidget'));
    initFactOfDay(document.getElementById('factWidget'));
    initPoll(document.getElementById('pollWidget'))
    initFuelCalc(document.getElementById('fuelCalcWidget'));
});
