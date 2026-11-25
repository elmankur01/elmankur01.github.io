/**
 * АвтоТема: Интерактивный сервис «Морозный радар: Реальный запас хода в мороз и жару»
 * Точный физический симулятор деградации батареи и аэродинамики
 */

(function () {
    'use strict';

    const PRESETS = {
        zeekr001: {
            name: 'Zeekr 001 (100 кВт·ч, NMC)',
            std: 'CLTC',
            nominalRange: 705,
            battery: 'nmc',
            heatPump: true
        },
        xiaomisu7: {
            name: 'Xiaomi SU7 Max (101 кВт·ч, NMC)',
            std: 'CLTC',
            nominalRange: 800,
            battery: 'nmc',
            heatPump: true
        },
        li7: {
            name: 'Li Auto L7 (42.8 кВт·ч, Электро-режим)',
            std: 'CLTC',
            nominalRange: 225,
            battery: 'nmc',
            heatPump: true
        },
        teslamodely: {
            name: 'Tesla Model Y Long Range (75 кВт·ч, NMC)',
            std: 'WLTP',
            nominalRange: 533,
            battery: 'nmc',
            heatPump: true
        },
        voyahfree: {
            name: 'Voyah Free EVR (39 кВт·ч, NMC)',
            std: 'CLTC',
            nominalRange: 205,
            battery: 'nmc',
            heatPump: false
        },
        elargus: {
            name: 'Lada e-Largus (61 кВт·ч, LFP)',
            std: 'NEDC',
            nominalRange: 400,
            battery: 'lfp',
            heatPump: false
        }
    };

    function calculateRealRange(nominalRange, std, temp, speed, climate, battery, tires, payload) {
        // Базовая калибровка паспортного цикла к реальности при +22°C
        let base = nominalRange;
        if (std === 'CLTC') base *= 0.84; // CLTC завышен на ~16-20%
        else if (std === 'NEDC') base *= 0.78; // NEDC завышен на ~22%
        else if (std === 'WLTP') base *= 0.92; // WLTP ближе к смешанному циклу
        // EPA считается 1:1

        // 1. Температурный коэффициент химии ячеек
        let tempLoss = 0;
        if (temp < 20) {
            const diff = 20 - temp; // от 0 до 50 градусов холода
            if (battery === 'lfp') {
                tempLoss = Math.min(0.55, diff * 0.011); // LFP сильнее замерзает
            } else if (battery === 'naion') {
                tempLoss = Math.min(0.18, diff * 0.0035); // Натрий-ион почти не боится мороза
            } else { // nmc
                tempLoss = Math.min(0.38, diff * 0.0075);
            }
        } else if (temp > 28) {
            const diff = temp - 28;
            tempLoss = Math.min(0.14, diff * 0.01); // Охлаждение батареи в жару
        }

        // 2. Скоростной коэффициент (аэродинамика)
        let speedFactor = 1.0;
        if (speed <= 45) {
            speedFactor = 1.12; // В городе рекуперация и низкое аэро-сопротивление
        } else if (speed <= 80) {
            speedFactor = 1.00;
        } else if (speed <= 100) {
            speedFactor = 0.88;
        } else if (speed <= 120) {
            speedFactor = 0.76;
        } else { // 130+ км/ч
            speedFactor = 0.65; // На автомагистрали расход резко подскакивает
        }

        // 3. Климат-контроль (печка/кондиционер)
        let climateLoss = 0;
        if (climate === 'eco') {
            climateLoss = temp < 10 ? 0.08 : 0.05;
        } else if (climate === 'max') {
            climateLoss = temp < 0 ? 0.18 : 0.10;
        }

        // 4. Шины
        let tireLoss = 0;
        if (tires === 'friction') tireLoss = 0.04;
        else if (tires === 'studded') tireLoss = 0.08;

        // 5. Загрузка пассажирами и багажом
        const payloadLoss = payload ? 0.08 : 0;

        // Итоговый расчет
        const totalLossFactor = Math.max(0.25, (1 - tempLoss - climateLoss - tireLoss - payloadLoss));
        const realRange = Math.round(base * speedFactor * totalLossFactor);
        const lossPercent = Math.round(((nominalRange - realRange) / nominalRange) * 100);

        return {
            realRange,
            lossPercent: Math.max(0, lossPercent),
            tempLoss: Math.round(tempLoss * 100),
            speedFactor
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        const tempSlider = document.getElementById('rangeTempSlider');
        const tempDisplay = document.getElementById('rangeTempDisplay');
        const rangeInput = document.getElementById('rangeNominalInput');
        const stdSelect = document.getElementById('rangeStdSelect');
        const speedSelect = document.getElementById('rangeSpeedSelect');
        const climateSelect = document.getElementById('rangeClimateSelect');
        const batterySelect = document.getElementById('rangeBatterySelect');
        const tiresSelect = document.getElementById('rangeTiresSelect');
        const payloadCheck = document.getElementById('rangePayloadCheck');
        const presetPills = document.querySelectorAll('.range-preset-pill');

        if (!tempSlider || !tempDisplay || !rangeInput) return;

        function updateUI() {
            const temp = parseInt(tempSlider.value, 10);
            const nominal = parseFloat(rangeInput.value) || 500;
            const std = stdSelect.value;
            const speed = parseInt(speedSelect.value, 10);
            const climate = climateSelect.value;
            const battery = batterySelect.value;
            const tires = tiresSelect.value;
            const payload = payloadCheck ? payloadCheck.checked : false;

            // Отображение температуры с цветом
            tempDisplay.textContent = (temp > 0 ? '+' : '') + temp + '°C';
            if (temp <= -15) tempDisplay.style.color = '#38bdf8';
            else if (temp < 5) tempDisplay.style.color = '#60a5fa';
            else if (temp <= 25) tempDisplay.style.color = '#10b981';
            else if (temp <= 32) tempDisplay.style.color = '#f59e0b';
            else tempDisplay.style.color = '#ef4444';

            const res = calculateRealRange(nominal, std, temp, speed, climate, battery, tires, payload);

            // Обновление цифр
            const realValEl = document.getElementById('resRealRangeVal');
            const lossBadgeEl = document.getElementById('resLossBadge');
            if (realValEl) realValEl.textContent = res.realRange + ' км';
            if (lossBadgeEl) {
                lossBadgeEl.textContent = 'Потеря от паспорта: -' + res.lossPercent + '%';
                lossBadgeEl.style.color = res.lossPercent > 35 ? '#ef4444' : (res.lossPercent > 18 ? '#f59e0b' : '#10b981');
            }

            // Маршрутный симулятор
            function checkRoute(distKm, badgeId, textId) {
                const badge = document.getElementById(badgeId);
                const desc = document.getElementById(textId);
                if (!badge) return;

                if (res.realRange >= distKm * 1.15) {
                    badge.className = 'route-badge route-badge-ok';
                    badge.textContent = '✅ Доедет без подзарядки';
                    if (desc) desc.textContent = 'Останется около ' + (res.realRange - distKm) + ' км хода в запасе.';
                } else if (res.realRange >= distKm) {
                    badge.className = 'route-badge route-badge-warn';
                    badge.textContent = '⚠️ Впритык (остаток <15%)';
                    if (desc) desc.textContent = 'Доедет на пределе. Рекомендуется отключить обгоны и ехать со скоростью 80–90 км/ч.';
                } else {
                    const stops = Math.ceil(distKm / (res.realRange * 0.8));
                    badge.className = 'route-badge route-badge-stop';
                    badge.textContent = '⛔ Нужна подзарядка (' + stops + ' ост.)';
                    if (desc) desc.textContent = 'Заряда не хватит на ' + (distKm - res.realRange) + ' км. Потребуется быстрая зарядка на трассе.';
                }
            }

            checkRoute(170, 'badgeTver', 'descTver');
            checkRoute(190, 'badgeVladimir', 'descVladimir');
            checkRoute(705, 'badgeSpb', 'descSpb');

            // Совет эксперта
            const tipEl = document.getElementById('resRangeTip');
            if (tipEl) {
                if (temp < -10) {
                    tipEl.innerHTML = '❄️ <b>Совет для сильного мороза:</b> Обязательно прогревайте салон и батарею от розетки за 15–20 минут до выезда. Это сохранит до 15–20% ёмкости аккумулятора в пути!';
                } else if (speed > 115) {
                    tipEl.innerHTML = '🏎️ <b>Аэродинамика:</b> Снижение скорости со 130 до 105 км/ч увеличит реальный запас хода сразу на 22%! Сопротивление воздуха растет квадратично.';
                } else if (battery === 'lfp' && temp < 0) {
                    tipEl.innerHTML = '🔋 <b>Особенность LFP батарей:</b> Железо-фосфат безопасен, но замерзает быстрее NMC. Старайтесь парковать машину на подземных паркингах или не разряжать ниже 25% на холоде.';
                } else {
                    tipEl.innerHTML = '💡 <b>Плавное вождение:</b> Использование режима рекуперации One-Pedal в городе возвращает в батарею до 15% энергии на торможениях.';
                }
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

                rangeInput.value = p.nominalRange;
                stdSelect.value = p.std;
                batterySelect.value = p.battery;

                updateUI();
            });
        });

        // Слушатели событий
        [tempSlider, rangeInput, stdSelect, speedSelect, climateSelect, batterySelect, tiresSelect].forEach(el => {
            el.addEventListener('input', updateUI);
            el.addEventListener('change', updateUI);
        });

        if (payloadCheck) payloadCheck.addEventListener('change', updateUI);

        updateUI();
    });
})();
