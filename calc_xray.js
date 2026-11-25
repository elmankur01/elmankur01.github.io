/**
 * АвтоТема: Интерактивный сервис «Рентген цены 2026: Реальная себестоимость авто в РФ»
 * Раскрывает точную структуру цены: Завод -> Утильсбор -> Таможня -> Доставка -> Наценка дилера
 */

(function () {
    'use strict';

    // Актуальные курсы валют (руб)
    const RATES = {
        CNY: 13.20,
        USD: 96.50,
        EUR: 104.50,
        RUB: 1.00
    };

    // Пресеты популярных моделей на российском рынке
    const PRESETS = {
        monjaro: {
            name: 'Geely Monjaro 2.0T (Китай)',
            currency: 'CNY',
            price: 185000,
            engineType: 'gas20',
            importMode: 'comm',
            notes: 'В Китае флагман стоит около 185 000 ¥ (~2.44 млн ₽). В автосалонах РФ цена достигает 4.9–5.2 млн ₽ из-за коммерческого утильсбора и растаможки.'
        },
        zeekr001: {
            name: 'Zeekr 001 EV (Электрокар)',
            currency: 'CNY',
            price: 269000,
            engineType: 'ev',
            importMode: 'comm',
            notes: 'Заводская цена Zeekr в Китае — около 3.55 млн ₽. В РФ пошлина 15%, НДС 20% и коммерческий утильсбор поднимают цену до 6.5 млн ₽.'
        },
        li7: {
            name: 'Li Auto L7 (EREV гибрид)',
            currency: 'CNY',
            price: 319800,
            engineType: 'erev',
            importMode: 'comm',
            notes: 'Последовательный гибрид премиум-класса. Высокая цена в Китае (4.2 млн ₽) умножается на пошлины и акциз до 7.8–8.2 млн ₽ в России.'
        },
        camry: {
            name: 'Toyota Camry 2.5 (Параллельный импорт)',
            currency: 'USD',
            price: 28000,
            engineType: 'gas25',
            importMode: 'comm',
            notes: 'Из-за мотора 2.5 л утилизационный сбор превышает 1.79 млн ₽. Государственные пошлины составляют больше половины от начальной цены машины.'
        },
        jolion: {
            name: 'Haval Jolion 1.5T (Локализация в Туле)',
            currency: 'RUB',
            price: 1450000,
            engineType: 'local',
            importMode: 'local',
            notes: 'Сборка в РФ позволяет заводу компенсировать утильсбор государственными баллами локализации, поэтому переплата минимальна.'
        },
        bmwx5: {
            name: 'BMW X5 3.0d (Германия, параллельный импорт)',
            currency: 'EUR',
            price: 72000,
            engineType: 'gas30',
            importMode: 'comm',
            notes: 'Европейский премиум с 3-литровым дизелем. Коммерческий утильсбор свыше 2.15 млн ₽ и сложная санкционная логистика удваивают цену до 15.5+ млн ₽.'
        }
    };

    function fmt(n) {
        return Math.round(n).toLocaleString('ru-RU') + ' ₽';
    }

    function calculateXray(priceForeign, currency, engineType, importMode) {
        const rate = RATES[currency] || 1;
        const factoryRub = priceForeign * rate;

        let utilFee = 0;
        let customsFee = 0;
        let delivery = 0;
        let dealerMargin = 0;

        if (importMode === 'local') {
            // Локализованное производство в РФ
            utilFee = 0; // компенсируется госсубсидиями за локализацию
            customsFee = Math.round(factoryRub * 0.12); // НДС и пошлины на импортные компоненты
            delivery = 75000; // логистика по РФ
            dealerMargin = Math.round(factoryRub * 0.28); // маржа дилера и автосалона
        } else if (importMode === 'personal') {
            // Ввоз физлицом для личного пользования (<3.0L, без продажи 12 мес)
            utilFee = 3400; // льготный сбор 2026
            delivery = 320000; // доставка, СБКТС, ЭПТС, кнопка ЭРА-ГЛОНАСС

            if (engineType === 'ev') {
                customsFee = Math.round(factoryRub * 0.15 + (factoryRub * 1.15) * 0.20); // 15% пошлина + 20% НДС
            } else {
                customsFee = Math.round(factoryRub * 0.48); // пошлина ЕАЭС для новых авто физлиц
            }
            dealerMargin = 150000; // комиссия брокера / байера
        } else {
            // Коммерческий импорт (автосалоны, дилеры)
            delivery = 360000; // контейнер, автовоз, СБКТС, сертификация

            if (engineType === 'ev') {
                customsFee = Math.round(factoryRub * 0.15 + (factoryRub * 1.15) * 0.20);
                utilFee = 667400; // шкала 2026 для электромобилей
                dealerMargin = Math.round((factoryRub + customsFee + utilFee) * 0.11);
            } else if (engineType === 'erev' || engineType === 'gas15') {
                customsFee = Math.round(factoryRub * 0.48);
                utilFee = 667400; // шкала 2026 для моторов до 2.0L
                dealerMargin = Math.round((factoryRub + customsFee + utilFee) * 0.12);
            } else if (engineType === 'gas20') {
                customsFee = Math.round(factoryRub * 0.48);
                utilFee = 667400; // 2.0L
                dealerMargin = Math.round((factoryRub + customsFee + utilFee) * 0.12);
            } else if (engineType === 'gas25') {
                customsFee = Math.round(factoryRub * 0.48);
                utilFee = 1794600; // моторы от 2.0 до 3.0L коммерческий тариф
                dealerMargin = Math.round((factoryRub + customsFee + utilFee) * 0.10);
            } else { // gas30 or higher
                customsFee = Math.round(factoryRub * 0.48);
                utilFee = 2153400; // от 3.0L коммерческий тариф
                dealerMargin = Math.round((factoryRub + customsFee + utilFee) * 0.12);
            }
        }

        const total = factoryRub + utilFee + customsFee + delivery + dealerMargin;
        const overpayRub = total - factoryRub;
        const overpayPct = Math.round((overpayRub / factoryRub) * 100);

        return {
            factoryRub,
            utilFee,
            customsFee,
            delivery,
            dealerMargin,
            total,
            overpayRub,
            overpayPct
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        const priceInput = document.getElementById('xrayPriceInput');
        const currSelect = document.getElementById('xrayCurrencySelect');
        const engineSelect = document.getElementById('xrayEngineSelect');
        const modeSelect = document.getElementById('xrayModeSelect');
        const presetPills = document.querySelectorAll('.xray-preset-pill');

        if (!priceInput || !currSelect || !engineSelect || !modeSelect) return;

        function updateUI() {
            const price = parseFloat(priceInput.value) || 0;
            const curr = currSelect.value;
            const engine = engineSelect.value;
            const mode = modeSelect.value;

            const res = calculateXray(price, curr, engine, mode);

            // Обновление полосы рентгена (ширины в процентах)
            const pFactory = (res.factoryRub / res.total) * 100;
            const pUtil = (res.utilFee / res.total) * 100;
            const pCustoms = (res.customsFee / res.total) * 100;
            const pDelivery = (res.delivery / res.total) * 100;
            const pMargin = (res.dealerMargin / res.total) * 100;

            const segFactory = document.getElementById('segFactory');
            const segUtil = document.getElementById('segUtil');
            const segCustoms = document.getElementById('segCustoms');
            const segDelivery = document.getElementById('segDelivery');
            const segMargin = document.getElementById('segMargin');

            if (segFactory) {
                segFactory.style.width = pFactory.toFixed(1) + '%';
                segFactory.textContent = pFactory > 12 ? Math.round(pFactory) + '%' : '';
            }
            if (segUtil) {
                segUtil.style.width = pUtil.toFixed(1) + '%';
                segUtil.textContent = pUtil > 7 ? Math.round(pUtil) + '%' : '';
                segUtil.style.display = res.utilFee > 0 ? 'flex' : 'none';
            }
            if (segCustoms) {
                segCustoms.style.width = pCustoms.toFixed(1) + '%';
                segCustoms.textContent = pCustoms > 10 ? Math.round(pCustoms) + '%' : '';
            }
            if (segDelivery) {
                segDelivery.style.width = pDelivery.toFixed(1) + '%';
                segDelivery.textContent = pDelivery > 7 ? Math.round(pDelivery) + '%' : '';
            }
            if (segMargin) {
                segMargin.style.width = pMargin.toFixed(1) + '%';
                segMargin.textContent = pMargin > 7 ? Math.round(pMargin) + '%' : '';
            }

            // Табличные значения
            const setTxt = (id, txt) => {
                const el = document.getElementById(id);
                if (el) el.textContent = txt;
            };

            setTxt('resTotalSum', fmt(res.total));
            setTxt('resFactoryVal', fmt(res.factoryRub));
            setTxt('resUtilVal', fmt(res.utilFee));
            setTxt('resCustomsVal', fmt(res.customsFee));
            setTxt('resDeliveryVal', fmt(res.delivery));
            setTxt('resMarginVal', fmt(res.dealerMargin));

            // Проценты в легенде
            setTxt('pctFactory', Math.round(pFactory) + '%');
            setTxt('pctUtil', Math.round(pUtil) + '%');
            setTxt('pctCustoms', Math.round(pCustoms) + '%');
            setTxt('pctDelivery', Math.round(pDelivery) + '%');
            setTxt('pctMargin', Math.round(pMargin) + '%');

            // Индекс переплаты
            const overpayBadge = document.getElementById('resOverpayBadge');
            if (overpayBadge) {
                if (res.overpayPct > 0) {
                    overpayBadge.textContent = '+' + res.overpayPct + '% к цене завода (+' + fmt(res.overpayRub) + ')';
                    overpayBadge.style.color = res.overpayPct > 100 ? '#ef4444' : '#f59e0b';
                } else {
                    overpayBadge.textContent = 'Без переплаты (локальная цена)';
                    overpayBadge.style.color = '#10b981';
                }
            }

            // Вердикт аналитика
            const verdictText = document.getElementById('resVerdictText');
            if (verdictText) {
                let note = '';
                if (mode === 'local') {
                    note = 'Автомобиль производится в РФ. Утилизационный сбор компенсируется государством по программе СПИК. Это самый выгодный вариант покупки с точки зрения прозрачности цены.';
                } else if (mode === 'personal') {
                    note = 'Ввоз напрямую на покупателя для личного пользования позволяет сэкономить сотни тысяч рублей на утильсборе (всего 3 400 ₽ вместо сотен тысяч), но накладывает запрет на продажу авто в течение 12 месяцев.';
                } else if (res.overpayPct > 120) {
                    note = 'Экстремальная наценка государства и посредников. Налоги, утильсбор 2026 года и дилерская маржа составляют более половины конечной цены в салоне. Завод-изготовитель получает меньше 45% от уплаченных вами денег.';
                } else {
                    note = 'Стандартная структура параллельного импорта. Основную часть наценки составляют ввозная таможенная пошлина и логистика под ключ.';
                }
                verdictText.textContent = note;
            }
        }

        // Пресеты
        presetPills.forEach(pill => {
            pill.addEventListener('click', function () {
                presetPills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');

                const key = this.getAttribute('data-preset');
                const p = PRESETS[key];
                if (!p) return;

                priceInput.value = p.price;
                currSelect.value = p.currency;
                engineSelect.value = p.engineType;
                modeSelect.value = p.importMode;

                updateUI();
            });
        });

        // Слушатели событий
        [priceInput, currSelect, engineSelect, modeSelect].forEach(el => {
            el.addEventListener('input', updateUI);
            el.addEventListener('change', updateUI);
        });

        updateUI();
    });
})();
