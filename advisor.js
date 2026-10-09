// ===== Интерактивный сервис «АвтоСоветник» (Smart Car Advisor) =====
// Интеллектуальный подбор автомобиля под бюджет и задачи на основе CARS_DATABASE

(function () {
    'use strict';

    function haptic() {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }

    const STEPS = [
        {
            number: 'Шаг 1 из 3',
            title: 'Какой у вас ориентировочный бюджет?',
            key: 'budget',
            options: [
                {
                    id: 'b1',
                    icon: '🪙',
                    label: 'До 1.8 млн ₽',
                    sub: 'Доступные седаны и городские авто с недорогим обслуживанием'
                },
                {
                    id: 'b2',
                    icon: '🚙',
                    label: '1.8 – 3.0 млн ₽',
                    sub: 'Самый популярный сегмент: современные кроссоверы и богатые комплектации'
                },
                {
                    id: 'b3',
                    icon: '💎',
                    label: '3.0 – 5.0 млн ₽',
                    sub: 'Бизнес-сегмент, рамные внедорожники и вместительные семейные SUV'
                },
                {
                    id: 'b4',
                    icon: '🚀',
                    label: 'От 5 млн ₽',
                    sub: 'Премиум, технологичные гибриды EREV и флагманские электромобили'
                }
            ]
        },
        {
            number: 'Шаг 2 из 3',
            title: 'Какой формат кузова вам ближе?',
            key: 'body',
            options: [
                {
                    id: 'c1',
                    icon: '🏙️',
                    label: 'Городской кроссовер',
                    sub: 'Высокая посадка, отличный обзор и лёгкая парковка у бордюров'
                },
                {
                    id: 'c2',
                    icon: '🚗',
                    label: 'Классический седан',
                    sub: 'Комфортная подвеска, аэродинамика и экономичный расход топлива'
                },
                {
                    id: 'c3',
                    icon: '🏔️',
                    label: 'Настоящий 4WD / Внедорожник',
                    sub: 'Полный привод, просторный салон для дальних путешествий и бездорожья'
                },
                {
                    id: 'c4',
                    icon: '⚡',
                    label: 'Электромобиль или гибрид',
                    sub: 'Бесшумность, мгновенная тяга, инновации и экономия на топливе'
                }
            ]
        },
        {
            number: 'Шаг 3 из 3',
            title: 'Что для вас важнее всего в машине?',
            key: 'priority',
            options: [
                {
                    id: 'p1',
                    icon: '⛽',
                    label: 'Экономичность и дешёвое ТО',
                    sub: 'Минимальный расход топлива и доступные запчасти в любом сервисе'
                },
                {
                    id: 'p2',
                    icon: '🌲',
                    label: 'Высокий дорожный просвет',
                    sub: 'Клиренс от 180–190 мм для уверенной езды зимой и по сугробам'
                },
                {
                    id: 'p3',
                    icon: '🏎️',
                    label: 'Динамика и драйв',
                    sub: 'Бодрый разгон до 100 км/ч, уверенные обгоны на трассе'
                },
                {
                    id: 'p4',
                    icon: '📦',
                    label: 'Вместительный багажник',
                    sub: 'Максимум полезного объёма для семьи, колясок и дачи'
                }
            ]
        }
    ];

    document.addEventListener('DOMContentLoaded', function () {
        const root = document.getElementById('advisorWidget');
        if (!root) return;

        let currentStep = 0;
        const answers = {};

        function renderStep() {
            const step = STEPS[currentStep];
            if (!step) {
                renderResults();
                return;
            }

            let html = '<div class="advisor-card">';
            // Прогресс бар
            html += '<div class="advisor-progress">';
            for (let i = 0; i < STEPS.length; i++) {
                html += '<div class="advisor-step-indicator ' + (i <= currentStep ? 'active' : '') + '"></div>';
            }
            html += '</div>';

            // Заголовок шага
            html += '<div class="advisor-step-header">';
            html += '<div class="advisor-step-number">' + step.number + '</div>';
            html += '<h3 class="advisor-step-title">' + step.title + '</h3>';
            html += '</div>';

            // Варианты выбора
            html += '<div class="advisor-grid">';
            step.options.forEach(opt => {
                html += '<button type="button" class="advisor-choice-btn" data-key="' + step.key + '" data-val="' + opt.id + '">';
                html += '<div class="advisor-choice-icon">' + opt.icon + '</div>';
                html += '<div class="advisor-choice-label">' + opt.label + '</div>';
                html += '<div class="advisor-choice-sub">' + opt.sub + '</div>';
                html += '</button>';
            });
            html += '</div>';

            if (currentStep > 0) {
                html += '<button type="button" class="advisor-restart-btn" id="advisorPrevBtn" style="margin-top:20px;">← Назад</button>';
            }

            html += '</div>';

            root.innerHTML = html;

            root.querySelectorAll('.advisor-choice-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    haptic();
                    const key = this.getAttribute('data-key');
                    const val = this.getAttribute('data-val');
                    answers[key] = val;
                    currentStep++;
                    renderStep();
                });
            });

            const prevBtn = document.getElementById('advisorPrevBtn');
            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    haptic();
                    if (currentStep > 0) {
                        currentStep--;
                        renderStep();
                    }
                });
            }
        }

        function calculateMatches() {
            if (typeof CARS_DATABASE === 'undefined' || !CARS_DATABASE.length) {
                return [];
            }

            const budget = answers.budget;
            const body = answers.body;
            const priority = answers.priority;

            const scored = CARS_DATABASE.map(car => {
                let score = 0;
                const priceStr = car.price.toLowerCase();

                // 1. Оценка бюджета
                const isUnder2 = priceStr.includes('1.') || car.id === 'lada-vesta' || car.id === 'moskvich-3';
                const is2to3 = priceStr.includes('2.') || car.id === 'haval-jolion' || car.id === 'geely-coolray' || car.id === 'chery-tiggo-7';
                const is3to5 = priceStr.includes('3.') || priceStr.includes('4.') || car.id === 'tank-300' || car.id === 'toyota-camry' || car.id === 'changan-cs75';
                const isOver5 = priceStr.includes('6.') || priceStr.includes('7.') || priceStr.includes('18.') || car.id === 'zeekr-001' || car.id === 'li-l7';

                if (budget === 'b1' && isUnder2) score += 35;
                else if (budget === 'b2' && is2to3) score += 35;
                else if (budget === 'b3' && is3to5) score += 35;
                else if (budget === 'b4' && isOver5) score += 35;
                else score += 10;

                // 2. Оценка кузова
                const cat = car.category.toLowerCase();
                const isEVorHybrid = car.engine.includes('Электро') || car.engine.includes('Гибрид') || car.id === 'zeekr-001' || car.id === 'li-l7' || car.id === 'kia-ev3';
                const isSedan = cat.includes('седан');
                const isSUV = cat.includes('внедорожник') || car.driveType === 'AWD' || car.id === 'tank-300';
                const isCrossover = cat.includes('кроссовер');

                if (body === 'c1' && isCrossover) score += 25;
                else if (body === 'c2' && isSedan) score += 25;
                else if (body === 'c3' && isSUV) score += 25;
                else if (body === 'c4' && isEVorHybrid) score += 30;
                else score += 8;

                // 3. Оценка приоритета
                if (priority === 'p1') {
                    // Экономичность: меньший расход
                    if (car.fuelVal && car.fuelVal <= 7.0) score += 25;
                    else if (car.fuelVal && car.fuelVal <= 8.5) score += 15;
                    else if (isEVorHybrid) score += 25;
                } else if (priority === 'p2') {
                    // Клиренс: от 180 мм
                    if (car.clearance >= 200) score += 30;
                    else if (car.clearance >= 180) score += 20;
                    else score += 5;
                } else if (priority === 'p3') {
                    // Разгон: быстрее 9 с
                    if (car.acceleration <= 6.0) score += 30;
                    else if (car.acceleration <= 8.5) score += 20;
                    else if (car.acceleration <= 10.0) score += 10;
                } else if (priority === 'p4') {
                    // Багажник: от 450 л
                    if (car.trunk >= 480) score += 30;
                    else if (car.trunk >= 400) score += 18;
                    else score += 8;
                }

                return { car, score };
            });

            scored.sort((a, b) => b.score - a.score);
            return scored.slice(0, 3).map(item => item.car);
        }

        function renderResults() {
            const matches = calculateMatches();

            let html = '<div class="advisor-card advisor-results-wrap">';
            html += '<div class="advisor-results-header">';
            html += '<div class="advisor-step-number">✨ Результат подбора</div>';
            html += '<h3 class="advisor-step-title">Автомобили, которые идеально вам подходят</h3>';
            html += '<p style="color:var(--muted);font-size:0.9rem;margin-top:6px;">Алгоритм сопоставил ваш бюджет, требования к кузову и ключевые приоритеты:</p>';
            html += '</div>';

            html += '<div class="advisor-results-grid">';
            matches.forEach((car, idx) => {
                const badgeText = idx === 0 ? '🥇 Топ совпадение' : (idx === 1 ? '🥈 Отличная альтернатива' : '🥉 Достойный выбор');
                html += '<div class="advisor-car-card">';
                html += '<img src="' + car.image + '" alt="' + car.name + '" class="advisor-car-img" loading="lazy">';
                html += '<div class="advisor-car-body">';
                html += '<div style="font-size:0.75rem;font-weight:800;color:var(--accent);text-transform:uppercase;margin-bottom:4px;">' + badgeText + '</div>';
                html += '<h4 class="advisor-car-title">' + car.name + '</h4>';
                html += '<div class="advisor-car-price">' + car.price + '</div>';

                html += '<div class="advisor-car-specs">';
                html += '<span class="advisor-spec-pill">🏔️ ' + car.clearance + ' мм</span>';
                html += '<span class="advisor-spec-pill">⚡ ' + car.acceleration + ' с</span>';
                html += '<span class="advisor-spec-pill">⛽ ' + car.fuel + '</span>';
                html += '<span class="advisor-spec-pill">📦 ' + car.trunk + ' л</span>';
                html += '</div>';

                html += '<div class="advisor-car-actions">';
                html += '<a href="/compare.html?cars=' + car.id + '" class="btn btn-secondary">⚔️ В сравнение</a>';
                html += '<a href="/calc-tco.html?car=' + getTcoPresetKey(car.id) + '" class="btn btn-primary">📊 Стоимость 1 км</a>';
                html += '</div>';

                html += '</div>';
                html += '</div>';
            });
            html += '</div>';

            html += '<button type="button" class="advisor-restart-btn" id="advisorRestartBtn">🔄 Пройти тест заново</button>';
            html += '</div>';

            root.innerHTML = html;

            const restartBtn = document.getElementById('advisorRestartBtn');
            if (restartBtn) {
                restartBtn.addEventListener('click', function () {
                    haptic();
                    currentStep = 0;
                    renderStep();
                });
            }
        }

        function getTcoPresetKey(carId) {
            const map = {
                'lada-vesta': 'vesta',
                'haval-jolion': 'jolion',
                'geely-coolray': 'coolray',
                'chery-tiggo-7': 'chery7',
                'tank-300': 'tank300',
                'zeekr-001': 'zeekr001',
                'toyota-camry': 'camry',
                'moskvich-3': 'moskvich3'
            };
            return map[carId] || 'vesta';
        }

        renderStep();
    });
})();
