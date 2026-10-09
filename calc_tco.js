// ===== Калькулятор реальной стоимости владения автомобилем (TCO) 2026 =====
// Расчёт стоимости 1 км, расходов в месяц и в год для портала АвтоТема

(function () {
    'use strict';

    // Цены на топливо в РФ на 2026 год (среднероссийские)
    const FUEL_PRICES = {
        'ai92': 56.5,
        'ai95': 65.0,
        'ai98': 82.0,
        'dt': 68.5,
        'electro_home': 7.5,
        'electro_fast': 22.0
    };

    // Ставки транспортного налога по регионам (руб. за 1 л.с.)
    const TAX_RATES = {
        moscow: [
            { max: 100, rate: 12 },
            { max: 125, rate: 25 },
            { max: 150, rate: 35 },
            { max: 175, rate: 45 },
            { max: 200, rate: 50 },
            { max: 225, rate: 65 },
            { max: 250, rate: 75 },
            { max: Infinity, rate: 150 }
        ],
        spb: [
            { max: 100, rate: 24 },
            { max: 150, rate: 35 },
            { max: 200, rate: 50 },
            { max: 250, rate: 75 },
            { max: Infinity, rate: 150 }
        ],
        mo: [
            { max: 100, rate: 10 },
            { max: 150, rate: 34 },
            { max: 200, rate: 49 },
            { max: 250, rate: 75 },
            { max: Infinity, rate: 150 }
        ],
        regions: [
            { max: 100, rate: 12 },
            { max: 150, rate: 30 },
            { max: 200, rate: 45 },
            { max: 250, rate: 70 },
            { max: Infinity, rate: 130 }
        ]
    };

    // Пресеты популярных авто
    const TCO_PRESETS = {
        'vesta': {
            name: 'Лада Vesta NG (1.8 EVO)',
            price: 1700000,
            power: 122,
            fuelType: 'ai92',
            consumption: 7.3,
            isElectric: false,
            serviceYear: 15000,
            tiresYear: 6000,
            depreciationRate: 9,
            image: '/images/art-53.jpg'
        },
        'jolion': {
            name: 'Haval Jolion 4WD (1.5T)',
            price: 2600000,
            power: 150,
            fuelType: 'ai95',
            consumption: 8.2,
            isElectric: false,
            serviceYear: 18000,
            tiresYear: 8000,
            depreciationRate: 9,
            image: '/images/art-75.jpg'
        },
        'coolray': {
            name: 'Geely Coolray New (1.5T)',
            price: 2700000,
            power: 147,
            fuelType: 'ai95',
            consumption: 6.1,
            isElectric: false,
            serviceYear: 19000,
            tiresYear: 8500,
            depreciationRate: 8.5,
            image: '/images/art-23.jpg'
        },
        'chery7': {
            name: 'Chery Tiggo 7 Pro Max AWD',
            price: 2850000,
            power: 150,
            fuelType: 'ai95',
            consumption: 7.7,
            isElectric: false,
            serviceYear: 19500,
            tiresYear: 8500,
            depreciationRate: 9,
            image: '/images/art-72.jpg'
        },
        'tank300': {
            name: 'Tank 300 4WD (2.0T)',
            price: 4200000,
            power: 220,
            fuelType: 'ai95',
            consumption: 10.7,
            isElectric: false,
            serviceYear: 26000,
            tiresYear: 11000,
            depreciationRate: 8,
            image: '/images/art-74.jpg'
        },
        'zeekr001': {
            name: 'Zeekr 001 4WD (Электро)',
            price: 6200000,
            power: 544,
            fuelType: 'electro_home',
            consumption: 21.0, // кВт·ч на 100 км
            isElectric: true,
            serviceYear: 12000,
            tiresYear: 12000,
            depreciationRate: 11,
            image: '/images/art-21.jpg'
        },
        'camry': {
            name: 'Toyota Camry XV80 (2.5L)',
            price: 4300000,
            power: 204,
            fuelType: 'ai95',
            consumption: 6.8,
            isElectric: false,
            serviceYear: 24000,
            tiresYear: 9500,
            depreciationRate: 7,
            image: '/images/art-30.jpg'
        },
        'moskvich3': {
            name: 'Москвич 3 (1.5T)',
            price: 1950000,
            power: 136,
            fuelType: 'ai92',
            consumption: 6.6,
            isElectric: false,
            serviceYear: 16000,
            tiresYear: 7000,
            depreciationRate: 10,
            image: '/images/art-26.jpg'
        }
    };

    function haptic() {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }

    function calcTax(power, region, isElectric) {
        if (isElectric && (region === 'moscow' || region === 'spb' || region === 'mo')) {
            return 0; // В Москве, МО и СПб электромобили освобождены от транспортного налога
        }
        const brackets = TAX_RATES[region] || TAX_RATES.moscow;
        let rate = 35;
        for (let i = 0; i < brackets.length; i++) {
            if (power <= brackets[i].max) {
                rate = brackets[i].rate;
                break;
            }
        }
        let tax = power * rate;
        // Налог на роскошь для авто от 10 млн (коэффициент 3)
        return Math.round(tax);
    }

    function formatNumber(num) {
        return Math.round(num).toLocaleString('ru-RU');
    }

    function calculateTCO(params) {
        const annualKm = Number(params.annualKm) || 15000;
        const price = Number(params.price) || 2000000;
        const power = Number(params.power) || 150;
        const consumption = Number(params.consumption) || 8.0;
        const fuelType = params.fuelType || 'ai95';
        const region = params.region || 'moscow';
        const isElectric = params.isElectric || (fuelType.startsWith('electro'));
        const fuelPrice = FUEL_PRICES[fuelType] || 65.0;

        // 1. Топливо / зарядка в год
        const fuelCostYear = (annualKm / 100) * consumption * fuelPrice;

        // 2. Транспортный налог в год
        const taxYear = calcTax(power, region, isElectric);

        // 3. Страховка (ОСАГО + опциональное КАСКО)
        const osagoYear = Number(params.osago) || 9500;
        const hasKasko = Boolean(params.hasKasko);
        const kaskoYear = hasKasko ? (price * 0.035) : 0;
        const insuranceYear = osagoYear + kaskoYear;

        // 4. ТО и расходники
        const baseService = Number(params.serviceYear) || 18000;
        // Масштабируем стоимость ТО пропорционально пробегу (база на 15 000 км)
        const serviceYear = (baseService * (annualKm / 15000));

        // 5. Шины и сезонный шиномонтаж / хранение
        const tiresYear = Number(params.tiresYear) || 8000;

        // 6. Потеря стоимости (амортизация за год)
        const depRate = (Number(params.depreciationRate) || 9) / 100;
        const depreciationYear = price * depRate;

        // 7. Прочие расходы (мойки, парковка, омывайка, мелкие штрафы)
        const extraYear = Number(params.extraYear) || 14000;

        // Итоги
        const totalYear = fuelCostYear + taxYear + insuranceYear + serviceYear + tiresYear + depreciationYear + extraYear;
        const totalMonth = totalYear / 12;
        const costPerKm = totalYear / Math.max(1, annualKm);

        // Итог без амортизации («из кармана»)
        const outOfPocketYear = totalYear - depreciationYear;
        const outOfPocketMonth = outOfPocketYear / 12;
        const outOfPocketPerKm = outOfPocketYear / Math.max(1, annualKm);

        return {
            annualKm,
            price,
            fuelCostYear,
            taxYear,
            insuranceYear,
            osagoYear,
            kaskoYear,
            serviceYear,
            tiresYear,
            depreciationYear,
            extraYear,
            totalYear,
            totalMonth,
            costPerKm,
            outOfPocketYear,
            outOfPocketMonth,
            outOfPocketPerKm
        };
    }

    // Инициализация калькулятора на странице
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('tcoForm');
        if (!form) return;

        // Элементы ввода машины 1
        const annualKmInput = document.getElementById('tcoAnnualKm');
        const kmValSpan = document.getElementById('tcoKmVal');
        const priceInput = document.getElementById('tcoPrice');
        const powerInput = document.getElementById('tcoPower');
        const fuelTypeSelect = document.getElementById('tcoFuelType');
        const consumptionInput = document.getElementById('tcoConsumption');
        const regionSelect = document.getElementById('tcoRegion');
        const osagoInput = document.getElementById('tcoOsago');
        const kaskoCheckbox = document.getElementById('tcoKasko');
        const serviceInput = document.getElementById('tcoService');
        const tiresInput = document.getElementById('tcoTires');
        const depRateInput = document.getElementById('tcoDepRate');
        const extraInput = document.getElementById('tcoExtra');

        // Элементы вывода машины 1
        const resCostPerKm = document.getElementById('tcoResCostPerKm');
        const resMonth = document.getElementById('tcoResMonth');
        const resYear = document.getElementById('tcoResYear');
        const resPocketPerKm = document.getElementById('tcoResPocketPerKm');

        // Строки детализации расходов
        const detFuel = document.getElementById('tcoDetFuel');
        const detDep = document.getElementById('tcoDetDep');
        const detIns = document.getElementById('tcoDetIns');
        const detService = document.getElementById('tcoDetService');
        const detTax = document.getElementById('tcoDetTax');
        const detExtra = document.getElementById('tcoDetExtra');

        // Прогресс-бары структуры расходов
        const barFuel = document.getElementById('tcoBarFuel');
        const barDep = document.getElementById('tcoBarDep');
        const barIns = document.getElementById('tcoBarIns');
        const barService = document.getElementById('tcoBarService');
        const barTax = document.getElementById('tcoBarTax');

        // Проценты структуры
        const pctFuel = document.getElementById('tcoPctFuel');
        const pctDep = document.getElementById('tcoPctDep');
        const pctIns = document.getElementById('tcoPctIns');
        const pctService = document.getElementById('tcoPctService');
        const pctTax = document.getElementById('tcoPctTax');

        // Блок сравнения (Автомобиль 2)
        const compareToggleBtn = document.getElementById('tcoCompareToggle');
        const compareBlock = document.getElementById('tcoCompareBlock');
        const compareSelectPreset = document.getElementById('tcoComparePreset');
        const compareDiffBox = document.getElementById('tcoCompareDiffBox');
        let isComparing = false;

        function getParams() {
            const fuelType = fuelTypeSelect.value;
            const isElectric = fuelType.startsWith('electro');
            return {
                annualKm: Number(annualKmInput.value) || 15000,
                price: Number(priceInput.value) || 2000000,
                power: Number(powerInput.value) || 150,
                consumption: Number(consumptionInput.value) || 8.0,
                fuelType: fuelType,
                region: regionSelect.value,
                isElectric: isElectric,
                osago: Number(osagoInput.value) || 9500,
                hasKasko: kaskoCheckbox.checked,
                serviceYear: Number(serviceInput.value) || 18000,
                tiresYear: Number(tiresInput.value) || 8000,
                depreciationRate: Number(depRateInput.value) || 9,
                extraYear: Number(extraInput.value) || 14000
            };
        }

        function update() {
            if (kmValSpan) {
                kmValSpan.textContent = formatNumber(annualKmInput.value) + ' км/год';
            }

            const params = getParams();
            const res = calculateTCO(params);

            // Вывод главных цифр
            if (resCostPerKm) resCostPerKm.textContent = res.costPerKm.toFixed(1) + ' ₽';
            if (resMonth) resMonth.textContent = formatNumber(res.totalMonth) + ' ₽';
            if (resYear) resYear.textContent = formatNumber(res.totalYear) + ' ₽';
            if (resPocketPerKm) resPocketPerKm.textContent = res.outOfPocketPerKm.toFixed(1) + ' ₽/км (' + formatNumber(res.outOfPocketMonth) + ' ₽/мес)';

            // Детализация
            if (detFuel) detFuel.textContent = formatNumber(res.fuelCostYear) + ' ₽';
            if (detDep) detDep.textContent = formatNumber(res.depreciationYear) + ' ₽';
            if (detIns) detIns.textContent = formatNumber(res.insuranceYear) + ' ₽';
            if (detService) detService.textContent = formatNumber(res.serviceYear + res.tiresYear) + ' ₽';
            if (detTax) detTax.textContent = formatNumber(res.taxYear) + ' ₽';
            if (detExtra) detExtra.textContent = formatNumber(res.extraYear) + ' ₽';

            // Проценты
            const total = res.totalYear || 1;
            const pFuel = Math.round((res.fuelCostYear / total) * 100);
            const pDep = Math.round((res.depreciationYear / total) * 100);
            const pIns = Math.round((res.insuranceYear / total) * 100);
            const pServ = Math.round(((res.serviceYear + res.tiresYear) / total) * 100);
            const pTax = Math.round((res.taxYear / total) * 100);

            if (barFuel) barFuel.style.width = pFuel + '%';
            if (barDep) barDep.style.width = pDep + '%';
            if (barIns) barIns.style.width = pIns + '%';
            if (barService) barService.style.width = pServ + '%';
            if (barTax) barTax.style.width = Math.max(1, pTax) + '%';

            if (pctFuel) pctFuel.textContent = pFuel + '%';
            if (pctDep) pctDep.textContent = pDep + '%';
            if (pctIns) pctIns.textContent = pIns + '%';
            if (pctService) pctService.textContent = pServ + '%';
            if (pctTax) pctTax.textContent = pTax + '%';

            // Сравнение со вторым авто (если включено)
            if (isComparing && compareSelectPreset) {
                updateComparison(res, params.annualKm);
            }
        }

        function updateComparison(res1, annualKm) {
            const presetKey = compareSelectPreset.value;
            const car2 = TCO_PRESETS[presetKey];
            if (!car2 || !compareDiffBox) return;

            const res2 = calculateTCO({
                annualKm: annualKm,
                price: car2.price,
                power: car2.power,
                consumption: car2.consumption,
                fuelType: car2.fuelType,
                region: regionSelect.value,
                isElectric: car2.isElectric,
                osago: Number(osagoInput.value) || 9500,
                hasKasko: kaskoCheckbox.checked,
                serviceYear: car2.serviceYear,
                tiresYear: car2.tiresYear,
                depreciationRate: car2.depreciationRate,
                extraYear: Number(extraInput.value) || 14000
            });

            const diffKm = res1.costPerKm - res2.costPerKm;
            const diffYear = res1.totalYear - res2.totalYear;
            const absDiffYear = Math.abs(diffYear);
            const isCheaper = diffYear < 0;

            let html = '<div class="tco-diff-card ' + (isCheaper ? 'diff-cheaper' : 'diff-costlier') + '">';
            html += '<div class="tco-diff-header">';
            html += '<span>⚔️ Сравнение с: <strong>' + car2.name + '</strong></span>';
            html += '<span class="tco-diff-badge">' + res2.costPerKm.toFixed(1) + ' ₽/км</span>';
            html += '</div>';
            html += '<div class="tco-diff-body">';
            if (isCheaper) {
                html += '🎉 <strong>Ваш выбор выгоднее на ' + Math.abs(diffKm).toFixed(1) + ' ₽/км!</strong>';
                html += '<p>Экономия составляет около <strong>' + formatNumber(absDiffYear) + ' ₽ в год</strong> (' + formatNumber(absDiffYear / 12) + ' ₽/мес).</p>';
            } else if (diffYear > 0) {
                html += '⚠️ <strong>Ваш выбор дороже на ' + Math.abs(diffKm).toFixed(1) + ' ₽/км</strong>';
                html += '<p>Переплата составляет около <strong>' + formatNumber(absDiffYear) + ' ₽ в год</strong> по сравнению с ' + car2.name + '.</p>';
            } else {
                html += '🤝 <strong>Расходы практически одинаковые!</strong>';
            }
            html += '<div class="tco-diff-details">';
            html += '<span>' + car2.name + ': ' + formatNumber(res2.totalYear) + ' ₽/год (' + formatNumber(res2.totalMonth) + ' ₽/мес)</span>';
            html += '</div>';
            html += '</div></div>';

            compareDiffBox.innerHTML = html;
        }

        // Пресеты кликами
        document.querySelectorAll('.tco-preset-pill').forEach(btn => {
            btn.addEventListener('click', function () {
                haptic();
                document.querySelectorAll('.tco-preset-pill').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const key = this.getAttribute('data-preset');
                const p = TCO_PRESETS[key];
                if (!p) return;

                priceInput.value = p.price;
                powerInput.value = p.power;
                fuelTypeSelect.value = p.fuelType;
                consumptionInput.value = p.consumption;
                serviceInput.value = p.serviceYear;
                tiresInput.value = p.tiresYear;
                depRateInput.value = p.depreciationRate;

                // Подпись расхода
                const consLabel = document.getElementById('tcoConsLabel');
                if (consLabel) {
                    consLabel.textContent = p.isElectric ? 'Расход энергии (кВт·ч на 100 км):' : 'Расход топлива (л на 100 км):';
                }

                update();
            });
        });

        // Слушатели событий
        [annualKmInput, priceInput, powerInput, consumptionInput, serviceInput, tiresInput, depRateInput, extraInput, osagoInput].forEach(el => {
            if (el) el.addEventListener('input', update);
        });

        [fuelTypeSelect, regionSelect, kaskoCheckbox].forEach(el => {
            if (el) el.addEventListener('change', function () {
                if (this === fuelTypeSelect) {
                    const consLabel = document.getElementById('tcoConsLabel');
                    const isEl = this.value.startsWith('electro');
                    if (consLabel) consLabel.textContent = isEl ? 'Расход энергии (кВт·ч на 100 км):' : 'Расход топлива (л на 100 км):';
                    if (isEl && Number(consumptionInput.value) < 12) consumptionInput.value = 18;
                    if (!isEl && Number(consumptionInput.value) > 16) consumptionInput.value = 8;
                }
                haptic();
                update();
            });
        });

        // Кнопка включения сравнения
        if (compareToggleBtn && compareBlock) {
            compareToggleBtn.addEventListener('click', function () {
                haptic();
                isComparing = !isComparing;
                compareBlock.style.display = isComparing ? 'block' : 'none';
                this.textContent = isComparing ? '✕ Скрыть сравнение' : '⚖️ Сравнить с другим авто';
                this.classList.toggle('active', isComparing);
                if (isComparing) update();
            });
        }

        if (compareSelectPreset) {
            compareSelectPreset.addEventListener('change', function () {
                haptic();
                update();
            });
        }

        // Проверяем параметр url ?car=...
        const urlParams = new URLSearchParams(window.location.search);
        const urlCar = urlParams.get('car');
        if (urlCar && TCO_PRESETS[urlCar]) {
            const targetPill = document.querySelector('.tco-preset-pill[data-preset="' + urlCar + '"]');
            if (targetPill) targetPill.click();
        } else {
            update();
        }
    });
})();
