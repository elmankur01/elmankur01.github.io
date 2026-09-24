// ====================================================================
// АвтоТема — Калькулятор утильсбора и растаможки РФ 2026 (calc_customs.js)
// Соответствует Постановлению Правительства РФ № 1291, ТК ЕАЭС и ЕТТ
// ====================================================================

(function () {
    // Базовые ориентировочные курсы валют (ЦБ РФ)
    const RATES = {
        RUB: 1,
        USD: 92.0,
        EUR: 100.0,
        CNY: 12.8
    };

    // Шкала таможенного сбора за оформление (в зависимости от стоимости авто в рублях)
    const PROCESSING_FEES = [
        { max: 200000, fee: 1067 },
        { max: 450000, fee: 2134 },
        { max: 1200000, fee: 4269 },
        { max: 2700000, fee: 11746 },
        { max: 4200000, fee: 16524 },
        { max: 5500000, fee: 21344 },
        { max: 7000000, fee: 27540 },
        { max: Infinity, fee: 300000 }
    ];

    // Ставки коммерческого утильсбора РФ на 2025–2026 гг. (Постановление Правительства РФ № 1291)
    const COMMERCIAL_UTIL_FEES = {
        electro: {
            under3: 667400,
            over3: 1174000
        },
        ice: [
            { maxVolume: 1000, under3: 180200, over3: 385400 },
            { maxVolume: 2000, under3: 667400, over3: 1174000 },
            { maxVolume: 3000, under3: 1875400, over3: 2807000 },
            { maxVolume: 3500, under3: 2147000, over3: 3296800 },
            { maxVolume: Infinity, under3: 2742200, over3: 4140000 }
        ]
    };

    // Пресеты популярных автомобилей для быстрого выбора
    const PRESETS = {
        monjaro: {
            name: 'Geely Monjaro',
            age: 'under3',
            engineType: 'petrol',
            volume: 1998,
            power: 238,
            currency: 'CNY',
            price: 220000,
            importStatus: 'personal'
        },
        zeekr001: {
            name: 'Zeekr 001',
            age: 'under3',
            engineType: 'electro',
            volume: 0,
            power: 544,
            currency: 'CNY',
            price: 270000,
            importStatus: 'personal'
        },
        bmw320d: {
            name: 'BMW 320d (3–5 лет)',
            age: '3to5',
            engineType: 'diesel',
            volume: 1995,
            power: 190,
            currency: 'EUR',
            price: 28000,
            importStatus: 'personal'
        },
        rav4: {
            name: 'Toyota RAV4 2.0 (3–5 лет)',
            age: '3to5',
            engineType: 'petrol',
            volume: 1987,
            power: 171,
            currency: 'USD',
            price: 25000,
            importStatus: 'personal'
        },
        li7: {
            name: 'Li Auto L7 (EREV)',
            age: 'under3',
            engineType: 'hybrid',
            volume: 1499,
            power: 449,
            currency: 'CNY',
            price: 260000,
            importStatus: 'personal'
        },
        tucson: {
            name: 'Hyundai Tucson 2.0D',
            age: '3to5',
            engineType: 'diesel',
            volume: 1998,
            power: 186,
            currency: 'USD',
            price: 24000,
            importStatus: 'personal'
        }
    };

    function formatNumber(num) {
        return Math.round(num).toLocaleString('ru-RU');
    }

    // Расчёт таможенного сбора за оформление
    function getProcessingFee(priceRub) {
        for (const item of PROCESSING_FEES) {
            if (priceRub <= item.max) return item.fee;
        }
        return 30000;
    }

    // Расчёт таможенной пошлины для физлиц (в евро)
    function getDutyEur(age, engineType, volume, priceEur) {
        if (engineType === 'electro') {
            // Единая пошлина на электрокары для физлиц — 15% стоимости
            return priceEur * 0.15;
        }

        if (age === 'under3') {
            // Автомобили до 3 лет — комбинированная ставка по стоимости
            if (priceEur <= 8500) {
                return Math.max(priceEur * 0.54, volume * 2.5);
            } else if (priceEur <= 16700) {
                return Math.max(priceEur * 0.48, volume * 3.5);
            } else if (priceEur <= 42300) {
                return Math.max(priceEur * 0.48, volume * 5.5);
            } else if (priceEur <= 84500) {
                return Math.max(priceEur * 0.48, volume * 7.5);
            } else if (priceEur <= 169000) {
                return Math.max(priceEur * 0.48, volume * 15.0);
            } else {
                return Math.max(priceEur * 0.48, volume * 20.0);
            }
        } else if (age === '3to5') {
            // Проходные авто от 3 до 5 лет — фиксированная ставка за 1 см³
            if (volume <= 1000) {
                return volume * 1.5;
            } else if (volume <= 1500) {
                return volume * 1.7;
            } else if (volume <= 1800) {
                return volume * 2.5;
            } else if (volume <= 2300) {
                return volume * 2.7;
            } else if (volume <= 3000) {
                return volume * 3.0;
            } else {
                return volume * 3.6;
            }
        } else {
            // Авто старше 5 лет — повышенная ставка за 1 см³
            if (volume <= 1000) {
                return volume * 3.0;
            } else if (volume <= 1500) {
                return volume * 3.2;
            } else if (volume <= 1800) {
                return volume * 3.5;
            } else if (volume <= 2300) {
                return volume * 4.8;
            } else if (volume <= 3000) {
                return volume * 5.0;
            } else {
                return volume * 5.7;
            }
        }
    }

    // Расчёт коммерческого утильсбора
    function getCommercialUtilFee(age, engineType, volume) {
        const isUnder3 = (age === 'under3');
        if (engineType === 'electro') {
            return isUnder3 ? COMMERCIAL_UTIL_FEES.electro.under3 : COMMERCIAL_UTIL_FEES.electro.over3;
        }

        for (const tier of COMMERCIAL_UTIL_FEES.ice) {
            if (volume <= tier.maxVolume) {
                return isUnder3 ? tier.under3 : tier.over3;
            }
        }
        return isUnder3 ? 2742200 : 4140000;
    }

    // Расчёт утилизационного сбора с учётом льготы
    function getUtilFee(age, engineType, volume, importStatus) {
        // Льгота: только для личного пользования, мотор до 3000 см³
        const eligibleForPersonal = (importStatus === 'personal' && volume <= 3000);

        if (eligibleForPersonal) {
            return {
                amount: age === 'under3' ? 3400 : 5200,
                isPreferential: true,
                warningReason: null
            };
        }

        let reason = '';
        if (importStatus === 'commercial') {
            reason = 'Коммерческий ввоз / перепродажа в течение 12 мес.';
        } else if (volume > 3000) {
            reason = 'Объём двигателя свыше 3.0 л (льгота не применяется)';
        }

        return {
            amount: getCommercialUtilFee(age, engineType, volume),
            isPreferential: false,
            warningReason: reason
        };
    }

    function calculate() {
        const priceInput = document.getElementById('customsPriceInput');
        const currencySelect = document.getElementById('customsCurrencySelect');
        const ageSelect = document.getElementById('customsAgeSelect');
        const engineTypeSelect = document.getElementById('customsEngineType');
        const volumeInput = document.getElementById('customsVolumeInput');
        const volumeRange = document.getElementById('customsVolumeRange');
        const powerInput = document.getElementById('customsPowerInput');
        const importStatusRadio = document.querySelector('input[name="importStatus"]:checked');

        if (!priceInput || !currencySelect || !ageSelect) return;

        const price = Math.max(0, parseFloat(priceInput.value) || 0);
        const currency = currencySelect.value || 'CNY';
        const age = ageSelect.value || 'under3';
        const engineType = engineTypeSelect ? engineTypeSelect.value : 'petrol';
        let volume = engineType === 'electro' ? 0 : Math.max(100, parseInt(volumeInput.value, 10) || 1998);
        const power = Math.max(1, parseInt(powerInput ? powerInput.value : 150, 10) || 150);
        const importStatus = importStatusRadio ? importStatusRadio.value : 'personal';

        // Синхронизация контролов двигателя
        const volumeWrap = document.getElementById('volumeFieldWrap');
        if (volumeWrap) {
            volumeWrap.style.display = (engineType === 'electro') ? 'none' : 'block';
        }

        // Перевод цены в рубли и евро
        const rateToRub = RATES[currency] || 1;
        const priceRub = price * rateToRub;
        const priceEur = priceRub / RATES.EUR;

        // 1. Таможенная пошлина
        const dutyEur = getDutyEur(age, engineType, volume, priceEur);
        const dutyRub = dutyEur * RATES.EUR;

        // 2. Утилизационный сбор
        const utilResult = getUtilFee(age, engineType, volume, importStatus);
        const utilFeeRub = utilResult.amount;

        // 3. Таможенное оформление
        const processingFeeRub = getProcessingFee(priceRub);

        // Итого платежи
        const totalCustomsRub = dutyRub + utilFeeRub + processingFeeRub;
        // Итого под ключ (автомобиль + таможня)
        const totalCarWithCustomsRub = priceRub + totalCustomsRub;

        // Коммерческий утильсбор для сравнения экономии
        const commercialUtil = getCommercialUtilFee(age, engineType, volume);
        const savingsRub = Math.max(0, commercialUtil - utilFeeRub);

        // Обновление элементов интерфейса
        const totalSumEl = document.getElementById('customsTotalSum');
        const subInfoEl = document.getElementById('customsSubInfo');
        const totalTurnkeyEl = document.getElementById('customsTotalTurnkey');
        const resDutyEl = document.getElementById('resCustomsDuty');
        const resDutyEurEl = document.getElementById('resCustomsDutyEur');
        const resUtilEl = document.getElementById('resCustomsUtil');
        const resUtilBadgeEl = document.getElementById('resUtilBadge');
        const resProcEl = document.getElementById('resCustomsProc');
        const resPriceRubEl = document.getElementById('resCustomsPriceRub');
        const resRule12WarningEl = document.getElementById('resRule12Warning');
        const resSavingsBoxEl = document.getElementById('resSavingsBox');
        const resSavingsSumEl = document.getElementById('resSavingsSum');
        const volumeValEl = document.getElementById('customsVolumeVal');

        if (totalSumEl) totalSumEl.textContent = formatNumber(totalCustomsRub) + ' ₽';
        if (subInfoEl) {
            subInfoEl.textContent = `По курсу ЦБ: 1€ ≈ ${RATES.EUR} ₽, 1$ ≈ ${RATES.USD} ₽, 1¥ ≈ ${RATES.CNY} ₽`;
        }
        if (totalTurnkeyEl) totalTurnkeyEl.textContent = formatNumber(totalCarWithCustomsRub) + ' ₽';
        if (resDutyEl) resDutyEl.textContent = formatNumber(dutyRub) + ' ₽';
        if (resDutyEurEl) resDutyEurEl.textContent = `(~${formatNumber(dutyEur)} €)`;
        if (resUtilEl) resUtilEl.textContent = formatNumber(utilFeeRub) + ' ₽';
        if (resProcEl) resProcEl.textContent = formatNumber(processingFeeRub) + ' ₽';
        if (resPriceRubEl) resPriceRubEl.textContent = formatNumber(priceRub) + ' ₽';

        if (volumeValEl && engineType !== 'electro') {
            volumeValEl.textContent = `${(volume / 1000).toFixed(1)} л (${volume} см³)`;
        }

        if (resUtilBadgeEl) {
            if (utilResult.isPreferential) {
                resUtilBadgeEl.className = 'customs-badge badge-preferential';
                resUtilBadgeEl.textContent = 'Льготный';
            } else {
                resUtilBadgeEl.className = 'customs-badge badge-commercial';
                resUtilBadgeEl.textContent = 'Коммерческий';
            }
        }

        // Предупреждение о правиле 12 месяцев или объеме мотора
        if (resRule12WarningEl) {
            if (utilResult.isPreferential) {
                resRule12WarningEl.innerHTML = `
                    <div class="customs-notice-box notice-warning">
                        <span class="notice-icon">⚠️</span>
                        <div>
                            <strong>Правило 12 месяцев (льготный тариф):</strong>
                            <p>Для сохранения льготного утильсбора (<b>${formatNumber(utilFeeRub)} ₽</b>) запрещено продавать или переоформлять автомобиль в течение <b>1 года</b> со дня ввоза. При досрочной продаже таможня доначислит разницу до коммерческого тарифа: <b>${formatNumber(commercialUtil)} ₽</b> плюс пени!</p>
                        </div>
                    </div>`;
            } else if (volume > 3000 && importStatus === 'personal') {
                resRule12WarningEl.innerHTML = `
                    <div class="customs-notice-box notice-alert">
                        <span class="notice-icon">🛑</span>
                        <div>
                            <strong>Внимание: двигатель объёмом более 3.0 л (${(volume / 1000).toFixed(1)} л):</strong>
                            <p>По законодательству РФ на легковые автомобили с объёмом двигателя свыше 3000 см³ льготный тариф утильсбора <b>не распространяется</b> даже при ввозе физлицом для личного пользования. Применяется полный коммерческий сбор: <b>${formatNumber(utilFeeRub)} ₽</b>.</p>
                        </div>
                    </div>`;
            } else {
                resRule12WarningEl.innerHTML = `
                    <div class="customs-notice-box notice-commercial">
                        <span class="notice-icon">💼</span>
                        <div>
                            <strong>Применён коммерческий утильсбор:</strong>
                            <p>Установлен коммерческий сбор <b>${formatNumber(utilFeeRub)} ₽</b>. Вы имеете право перепродавать автомобиль в любой момент без риска доначислений.</p>
                        </div>
                    </div>`;
            }
        }

        // Блок экономии
        if (resSavingsBoxEl && resSavingsSumEl) {
            if (savingsRub > 0 && utilResult.isPreferential) {
                resSavingsBoxEl.style.display = 'flex';
                resSavingsSumEl.textContent = formatNumber(savingsRub) + ' ₽';
            } else {
                resSavingsBoxEl.style.display = 'none';
            }
        }
    }

    // Инициализация событий
    function initEvents() {
        const priceInput = document.getElementById('customsPriceInput');
        const currencySelect = document.getElementById('customsCurrencySelect');
        const ageSelect = document.getElementById('customsAgeSelect');
        const engineTypeSelect = document.getElementById('customsEngineType');
        const volumeInput = document.getElementById('customsVolumeInput');
        const volumeRange = document.getElementById('customsVolumeRange');
        const powerInput = document.getElementById('customsPowerInput');
        const importRadios = document.querySelectorAll('input[name="importStatus"]');

        if (priceInput) priceInput.addEventListener('input', calculate);
        if (currencySelect) currencySelect.addEventListener('change', calculate);
        if (ageSelect) ageSelect.addEventListener('change', calculate);
        if (engineTypeSelect) engineTypeSelect.addEventListener('change', calculate);

        if (volumeRange && volumeInput) {
            volumeRange.addEventListener('input', function () {
                volumeInput.value = volumeRange.value;
                calculate();
            });
            volumeInput.addEventListener('input', function () {
                volumeRange.value = volumeInput.value;
                calculate();
            });
        }

        if (powerInput) powerInput.addEventListener('input', calculate);

        importRadios.forEach(radio => {
            radio.addEventListener('change', calculate);
        });

        // Быстрые пресеты объёма двигателя
        document.querySelectorAll('.volume-quick-pill').forEach(pill => {
            pill.addEventListener('click', function () {
                const vol = this.getAttribute('data-vol');
                if (vol && volumeInput && volumeRange) {
                    volumeInput.value = vol;
                    volumeRange.value = vol;
                    calculate();
                }
            });
        });

        // Быстрые пресеты автомобилей
        document.querySelectorAll('.calc-car-preset-pill').forEach(pill => {
            pill.addEventListener('click', function () {
                const key = this.getAttribute('data-preset');
                const p = PRESETS[key];
                if (!p) return;

                document.querySelectorAll('.calc-car-preset-pill').forEach(el => el.classList.remove('active'));
                this.classList.add('active');

                if (ageSelect) ageSelect.value = p.age;
                if (engineTypeSelect) engineTypeSelect.value = p.engineType;
                if (volumeInput) volumeInput.value = p.volume;
                if (volumeRange) volumeRange.value = p.volume;
                if (powerInput) powerInput.value = p.power;
                if (currencySelect) currencySelect.value = p.currency;
                if (priceInput) priceInput.value = p.price;

                const targetRadio = document.querySelector(`input[name="importStatus"][value="${p.importStatus}"]`);
                if (targetRadio) targetRadio.checked = true;

                calculate();
            });
        });

        calculate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEvents);
    } else {
        initEvents();
    }
})();
