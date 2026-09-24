// ==========================================
// АвтоТема — Калькулятор транспортного налога РФ 2026 (calc_tax.js)
// ==========================================

(function () {
    // Региональные ставки транспортного налога (рублей за 1 л.с.) для легковых авто на 2026 г.
    const REGION_RATES = {
        moscow: {
            name: 'Москва',
            auto: [
                { upTo: 100, rate: 12 },
                { upTo: 125, rate: 25 },
                { upTo: 150, rate: 35 },
                { upTo: 175, rate: 45 },
                { upTo: 200, rate: 50 },
                { upTo: 225, rate: 65 },
                { upTo: 250, rate: 75 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 7 },
                { upTo: 35, rate: 15 },
                { upTo: Infinity, rate: 50 }
            ],
            truck: [
                { upTo: 100, rate: 15 },
                { upTo: 150, rate: 26 },
                { upTo: 200, rate: 38 },
                { upTo: 250, rate: 55 },
                { upTo: Infinity, rate: 85 }
            ]
        },
        spb: {
            name: 'Санкт-Петербург',
            auto: [
                { upTo: 100, rate: 24 },
                { upTo: 150, rate: 35 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 75 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 10 },
                { upTo: 35, rate: 20 },
                { upTo: Infinity, rate: 50 }
            ],
            truck: [
                { upTo: 100, rate: 25 },
                { upTo: 150, rate: 40 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 65 },
                { upTo: Infinity, rate: 85 }
            ]
        },
        mo: {
            name: 'Московская обл.',
            auto: [
                { upTo: 100, rate: 10 },
                { upTo: 150, rate: 34 },
                { upTo: 200, rate: 49 },
                { upTo: 250, rate: 75 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 7 },
                { upTo: 35, rate: 15 },
                { upTo: Infinity, rate: 50 }
            ],
            truck: [
                { upTo: 100, rate: 25 },
                { upTo: 150, rate: 40 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 65 },
                { upTo: Infinity, rate: 85 }
            ]
        },
        krasnodar: {
            name: 'Краснодарский край',
            auto: [
                { upTo: 100, rate: 12 },
                { upTo: 150, rate: 25 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 75 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 7 },
                { upTo: 35, rate: 15 },
                { upTo: Infinity, rate: 50 }
            ],
            truck: [
                { upTo: 100, rate: 25 },
                { upTo: 150, rate: 40 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 65 },
                { upTo: Infinity, rate: 85 }
            ]
        },
        tatarstan: {
            name: 'Татарстан',
            auto: [
                { upTo: 100, rate: 25 },
                { upTo: 150, rate: 35 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 75 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 10 },
                { upTo: 35, rate: 20 },
                { upTo: Infinity, rate: 50 }
            ],
            truck: [
                { upTo: 100, rate: 25 },
                { upTo: 150, rate: 40 },
                { upTo: 200, rate: 50 },
                { upTo: 250, rate: 65 },
                { upTo: Infinity, rate: 85 }
            ]
        },
        sverdlovsk: {
            name: 'Свердловская обл.',
            auto: [
                { upTo: 100, rate: 0 }, // Льгота 0 руб до 100 л.с.
                { upTo: 150, rate: 14 },
                { upTo: 200, rate: 33.6 },
                { upTo: 250, rate: 49.6 },
                { upTo: Infinity, rate: 99.2 }
            ],
            moto: [
                { upTo: 20, rate: 5.6 },
                { upTo: 35, rate: 11.2 },
                { upTo: Infinity, rate: 28 }
            ],
            truck: [
                { upTo: 100, rate: 14 },
                { upTo: 150, rate: 24.8 },
                { upTo: 200, rate: 33.6 },
                { upTo: 250, rate: 44.8 },
                { upTo: Infinity, rate: 56 }
            ]
        },
        novosibirsk: {
            name: 'Новосибирская обл.',
            auto: [
                { upTo: 100, rate: 10 },
                { upTo: 150, rate: 15 },
                { upTo: 200, rate: 30 },
                { upTo: 250, rate: 60 },
                { upTo: Infinity, rate: 150 }
            ],
            moto: [
                { upTo: 20, rate: 5 },
                { upTo: 35, rate: 10 },
                { upTo: Infinity, rate: 25 }
            ],
            truck: [
                { upTo: 100, rate: 15 },
                { upTo: 150, rate: 25 },
                { upTo: 200, rate: 35 },
                { upTo: 250, rate: 45 },
                { upTo: Infinity, rate: 70 }
            ]
        },
        base: {
            name: 'Базовая ставка РФ',
            auto: [
                { upTo: 100, rate: 2.5 },
                { upTo: 150, rate: 3.5 },
                { upTo: 200, rate: 5.0 },
                { upTo: 250, rate: 7.5 },
                { upTo: Infinity, rate: 15.0 }
            ],
            moto: [
                { upTo: 20, rate: 1.0 },
                { upTo: 35, rate: 2.0 },
                { upTo: Infinity, rate: 5.0 }
            ],
            truck: [
                { upTo: 100, rate: 2.5 },
                { upTo: 150, rate: 4.0 },
                { upTo: 200, rate: 5.0 },
                { upTo: 250, rate: 6.5 },
                { upTo: Infinity, rate: 8.5 }
            ]
        }
    };

    // Алиасы для остальных регионов
    REGION_RATES.nnov = REGION_RATES.tatarstan;
    REGION_RATES.rostov = REGION_RATES.krasnodar;
    REGION_RATES.bashkortostan = REGION_RATES.tatarstan;
    REGION_RATES.chelyabinsk = REGION_RATES.sverdlovsk;
    REGION_RATES.samara = REGION_RATES.mo;
    REGION_RATES.voronezh = REGION_RATES.krasnodar;

    let currentType = 'auto';

    function getRate(regionKey, type, hp) {
        const reg = REGION_RATES[regionKey] || REGION_RATES.base;
        const scale = reg[type] || reg.auto;
        for (const item of scale) {
            if (hp <= item.upTo) return item.rate;
        }
        return scale[scale.length - 1].rate;
    }

    function formatNumber(num) {
        return Math.round(num).toLocaleString('ru-RU');
    }

    function calculate() {
        const regionEl = document.getElementById('taxRegion');
        const hpInput = document.getElementById('taxPowerInput');
        const hpRange = document.getElementById('taxPowerRange');
        const monthsRange = document.getElementById('taxMonthsRange');
        const luxuryCheck = document.getElementById('taxLuxuryCheck');

        if (!regionEl || !hpInput) return;

        const regionKey = regionEl.value || 'moscow';
        const hp = Math.max(1, parseInt(hpInput.value, 10) || 100);
        const months = parseInt(monthsRange.value, 10) || 12;
        const isLuxury = luxuryCheck ? luxuryCheck.checked : false;
        const luxuryCoeff = isLuxury ? 3.0 : 1.0;

        const rate = getRate(regionKey, currentType, hp);
        const total = hp * rate * (months / 12) * luxuryCoeff;

        // Обновление UI
        const totalEl = document.getElementById('taxTotalSum');
        const subInfoEl = document.getElementById('taxSubInfo');
        const resHp = document.getElementById('resHp');
        const resRate = document.getElementById('resRate');
        const resMonths = document.getElementById('resMonths');
        const resLuxury = document.getElementById('resLuxury');
        const resFormula = document.getElementById('resFormula');
        const hpVal = document.getElementById('taxPowerVal');
        const monthsVal = document.getElementById('taxMonthsVal');

        if (totalEl) totalEl.textContent = formatNumber(total) + ' ₽';
        if (subInfoEl) {
            const regName = regionEl.options[regionEl.selectedIndex].text;
            subInfoEl.textContent = `Ставка: ${rate} ₽ / л.с. (${regName})`;
        }

        if (resHp) resHp.textContent = hp + ' л.с.';
        if (resRate) resRate.textContent = rate + ' ₽ за 1 л.с.';
        if (resMonths) resMonths.textContent = months === 12 ? '12 / 12 мес. (полный год)' : `${months} / 12 мес.`;
        if (resLuxury) resLuxury.textContent = isLuxury ? '3.0 (авто от 10 млн ₽)' : '1.0 (стандартный)';

        if (resFormula) {
            resFormula.textContent = `${hp} л.с. × ${rate} ₽ × (${months}/12) × ${luxuryCoeff} = ${formatNumber(total)} ₽`;
        }

        if (hpVal) hpVal.textContent = hp + ' л.с.';
        if (monthsVal) monthsVal.textContent = months === 12 ? '12 месяцев (полный год)' : `${months} ${months === 1 ? 'месяц' : (months < 5 ? 'месяца' : 'месяцев')}`;

        // Сравнение с популярными регионами
        const compGrid = document.getElementById('regionComparisonGrid');
        if (compGrid) {
            const compareRegions = [
                { key: 'moscow', label: 'Москва' },
                { key: 'spb', label: 'Санкт-Петербург' },
                { key: 'mo', label: 'Московская обл.' },
                { key: 'krasnodar', label: 'Краснодарский кр.' },
                { key: 'tatarstan', label: 'Татарстан' },
                { key: 'sverdlovsk', label: 'Свердловская обл.' }
            ];

            compGrid.innerHTML = compareRegions.map(reg => {
                const regRate = getRate(reg.key, currentType, hp);
                const regTotal = hp * regRate * (months / 12) * luxuryCoeff;
                const isSelected = reg.key === regionKey;
                return `
                <div class="comp-item ${isSelected ? 'comp-item-active' : ''}">
                    <span class="comp-reg-name">${reg.label}</span>
                    <strong class="comp-reg-sum">${formatNumber(regTotal)} ₽</strong>
                    <span class="comp-reg-rate">${regRate} ₽/л.с.</span>
                </div>`;
            }).join('');
        }
    }

    function init() {
        const regionEl = document.getElementById('taxRegion');
        const hpInput = document.getElementById('taxPowerInput');
        const hpRange = document.getElementById('taxPowerRange');
        const monthsRange = document.getElementById('taxMonthsRange');
        const luxuryCheck = document.getElementById('taxLuxuryCheck');
        const typeChips = document.getElementById('taxTypeChips');

        if (!hpInput || !hpRange) return;

        // Синхронизация слайдера и инпута л.с.
        hpRange.addEventListener('input', () => {
            hpInput.value = hpRange.value;
            calculate();
        });

        hpInput.addEventListener('input', () => {
            const val = parseInt(hpInput.value, 10);
            if (!isNaN(val) && val >= 50 && val <= 650) {
                hpRange.value = val;
            }
            calculate();
        });

        if (monthsRange) monthsRange.addEventListener('input', calculate);
        if (regionEl) regionEl.addEventListener('change', calculate);
        if (luxuryCheck) luxuryCheck.addEventListener('change', calculate);

        // Переключение типов ТС (авто / мото / грузовик)
        if (typeChips) {
            typeChips.addEventListener('click', (e) => {
                const chip = e.target.closest('.calc-type-chip');
                if (chip && chip.dataset.type) {
                    typeChips.querySelectorAll('.calc-type-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    currentType = chip.dataset.type;
                    calculate();
                }
            });
        }

        // Быстрые пресеты л.с.
        document.addEventListener('click', (e) => {
            const pill = e.target.closest('.quick-pill');
            if (pill && pill.dataset.hp) {
                const hp = parseInt(pill.dataset.hp, 10);
                hpInput.value = hp;
                if (hp >= 50 && hp <= 650) hpRange.value = hp;
                calculate();
            }
        });

        calculate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
