// ==========================================
// АвтоТема — логика интерактивного сравнения автомобилей
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Интеграция с Telegram Mini App
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        } catch (e) {}
    }

    const select1 = document.getElementById('carSelect1');
    const select2 = document.getElementById('carSelect2');
    const select3 = document.getElementById('carSelect3');
    const col3 = document.getElementById('colSel3');
    const toggleCar3Btn = document.getElementById('toggleCar3Btn');
    const tableWrap = document.getElementById('compareTableWrap');
    const shareTgBtn = document.getElementById('shareTgBtn');
    const copyCompareBtn = document.getElementById('copyCompareBtn');
    const presetChips = document.querySelectorAll('.preset-chip');

    let showThirdCar = true;

    // 1. Заполнение выпадающих списков
    function populateSelects() {
        const selects = [select1, select2, select3];
        selects.forEach(sel => {
            if (!sel) return;
            sel.innerHTML = '';
            CARS_DATABASE.forEach(car => {
                const opt = document.createElement('option');
                opt.value = car.id;
                opt.textContent = `${car.name} (${car.price})`;
                sel.appendChild(opt);
            });
        });
    }

    // 2. Чтение параметров из URL
    function getSelectedCarIdsFromURL() {
        const params = new URLSearchParams(window.location.search);
        const carsParam = params.get('cars');
        if (carsParam) {
            const arr = carsParam.split(',').filter(id => CARS_DATABASE.some(c => c.id === id));
            if (arr.length >= 2) return arr;
        }
        // Дефолтный баттл: Haval Jolion vs Geely Coolray vs Chery Tiggo 7
        return ['haval-jolion', 'geely-coolray', 'chery-tiggo-7'];
    }

    // 3. Установка выбранных значений в селекторы
    function setSelectValues(ids) {
        if (ids[0] && select1) select1.value = ids[0];
        if (ids[1] && select2) select2.value = ids[1];
        if (ids.length >= 3 && select3) {
            showThirdCar = true;
            col3.classList.remove('hidden');
            select3.value = ids[2];
            if (toggleCar3Btn) toggleCar3Btn.textContent = '− Убрать 3-й';
        } else if (ids.length === 2) {
            showThirdCar = false;
            col3.classList.add('hidden');
            if (toggleCar3Btn) toggleCar3Btn.textContent = '+ Добавить 3-й';
        }
    }

    // 4. Определение лучших характеристик среди выбранных
    function getBestStats(cars) {
        const best = {
            accel: Math.min(...cars.map(c => c.acceleration)),
            clearance: Math.max(...cars.map(c => c.clearance)),
            trunk: Math.max(...cars.map(c => c.trunk)),
            power: Math.max(...cars.map(c => c.power)),
            length: Math.max(...cars.map(c => c.length))
        };
        return best;
    }

    // 5. Рендеринг таблицы сравнения
    function renderComparison() {
        const car1Id = select1 ? select1.value : '';
        const car2Id = select2 ? select2.value : '';
        const car3Id = (showThirdCar && select3) ? select3.value : null;

        const selectedCars = [
            CARS_DATABASE.find(c => c.id === car1Id),
            CARS_DATABASE.find(c => c.id === car2Id),
            car3Id ? CARS_DATABASE.find(c => c.id === car3Id) : null
        ].filter(Boolean);

        if (selectedCars.length < 2) return;

        const best = getBestStats(selectedCars);
        const isTwoCols = selectedCars.length === 2;

        let html = `<div class="compare-grid ${isTwoCols ? 'two-cols' : ''}">`;

        selectedCars.forEach(car => {
            const isBestAccel = car.acceleration === best.accel;
            const isBestClearance = car.clearance === best.clearance;
            const isBestTrunk = car.trunk === best.trunk;
            const isBestPower = car.power === best.power;

            html += `
            <div class="compare-card">
                <div class="car-card-header">
                    <img src="${car.image}" alt="${car.name}" loading="lazy">
                    <span class="car-card-price-badge">${car.price}</span>
                </div>
                <div class="car-card-info">
                    <div class="car-card-cat">${car.category}</div>
                    <h3 class="car-card-title">${car.name}</h3>
                </div>
                <div class="car-specs-list">
                    <!-- Разгон 0-100 -->
                    <div class="spec-item">
                        <span class="spec-title">⚡ Разгон 0-100 км/ч:</span>
                        <div class="spec-val-wrap">
                            <span class="spec-value">${car.acceleration} с</span>
                            ${isBestAccel ? '<span class="winner-badge">🏆 Быстрее всех</span>' : ''}
                        </div>
                    </div>

                    <!-- Клиренс -->
                    <div class="spec-item">
                        <span class="spec-title">🏔️ Клиренс (просвет):</span>
                        <div class="spec-val-wrap">
                            <span class="spec-value">${car.clearance} мм</span>
                            ${isBestClearance ? '<span class="winner-badge">🏆 Выше всех</span>' : ''}
                        </div>
                    </div>

                    <!-- Багажник -->
                    <div class="spec-item">
                        <span class="spec-title">📦 Объём багажника:</span>
                        <div class="spec-val-wrap">
                            <span class="spec-value">${car.trunk} л</span>
                            ${isBestTrunk ? '<span class="winner-badge">🏆 Самый вместительный</span>' : ''}
                        </div>
                    </div>

                    <!-- Мощность -->
                    <div class="spec-item">
                        <span class="spec-title">🐎 Мощность двигателя:</span>
                        <div class="spec-val-wrap">
                            <span class="spec-value">${car.power} ${car.powerUnit}</span>
                            ${isBestPower ? '<span class="winner-badge">🏆 Самый мощный</span>' : ''}
                        </div>
                    </div>

                    <!-- Двигатель и КПП -->
                    <div class="spec-item">
                        <span class="spec-title">🔧 Двигатель и трансмиссия:</span>
                        <span class="spec-value" style="font-size:0.92rem;">${car.engine}, ${car.transmission}</span>
                    </div>

                    <!-- Привод -->
                    <div class="spec-item">
                        <span class="spec-title">🛞 Тип привода:</span>
                        <span class="spec-value" style="font-size:0.95rem;">${car.drive}</span>
                    </div>

                    <!-- Габариты -->
                    <div class="spec-item">
                        <span class="spec-title">📐 Габариты (Д × Ш × В):</span>
                        <span class="spec-value" style="font-size:0.92rem;">${car.dimensions}</span>
                    </div>

                    <!-- Расход / Запас хода -->
                    <div class="spec-item">
                        <span class="spec-title">⛽ Расход / Запас хода:</span>
                        <span class="spec-value" style="font-size:0.95rem;">${car.fuel}</span>
                    </div>
                </div>
            </div>`;
        });

        html += `</div>`;
        tableWrap.innerHTML = html;

        // Обновление адресной строки без перезагрузки
        const currentIds = selectedCars.map(c => c.id).join(',');
        const newUrl = `${window.location.pathname}?cars=${currentIds}`;
        window.history.replaceState(null, '', newUrl);

        // Обновление подсветки чипов пресетов
        presetChips.forEach(chip => {
            if (chip.getAttribute('data-cars') === currentIds) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    // 6. Обработчики событий
    if (select1) select1.addEventListener('change', renderComparison);
    if (select2) select2.addEventListener('change', renderComparison);
    if (select3) select3.addEventListener('change', renderComparison);

    if (toggleCar3Btn) {
        toggleCar3Btn.addEventListener('click', function () {
            showThirdCar = !showThirdCar;
            if (showThirdCar) {
                col3.classList.remove('hidden');
                toggleCar3Btn.textContent = '− Убрать 3-й';
            } else {
                col3.classList.add('hidden');
                toggleCar3Btn.textContent = '+ Добавить 3-й';
            }
            renderComparison();
        });
    }

    presetChips.forEach(chip => {
        chip.addEventListener('click', function () {
            const carsStr = this.getAttribute('data-cars');
            const carIds = carsStr.split(',');
            setSelectValues(carIds);
            renderComparison();
        });
    });

    // 7. Поделиться в Telegram
    if (shareTgBtn) {
        shareTgBtn.addEventListener('click', function () {
            const url = window.location.href;
            const text = '⚔️ Сравнение характеристик автомобилей «бок о бок» на АвтоТема!';
            const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(tgUrl, '_blank');
        });
    }

    // 8. Скопировать ссылку
    if (copyCompareBtn) {
        copyCompareBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalText = copyCompareBtn.textContent;
                copyCompareBtn.textContent = '✅ Ссылка скопирована!';
                setTimeout(() => {
                    copyCompareBtn.textContent = originalText;
                }, 2000);
            });
        });
    }

    // Инициализация
    populateSelects();
    const initialIds = getSelectedCarIdsFromURL();
    setSelectValues(initialIds);
    renderComparison();
});
