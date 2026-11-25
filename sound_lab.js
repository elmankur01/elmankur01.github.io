/**
 * АвтоТема — Лаборатория звука моторов (Engine Sound Lab)
 * Полноценный синтез акустики легендарных двигателей в реальном времени через Web Audio API.
 * Без внешних аудиофайлов, чистая математика гармоник и физика выхлопа.
 */

(function () {
    'use strict';

    // Конфигурации двигателей
    const ENGINES = {
        'v8-muscle': {
            name: '6.2L V8 Supercharged (Crossplane)',
            car: 'Dodge Challenger Hellcat / Corvette Stingray',
            desc: 'Классический американский V8 с крестообразным коленвалом. Утробный, вибрирующий низкочастотный рокот на холостых и громоподобный рык на верхах.',
            idleRpm: 750,
            maxRpm: 6800,
            redline: 6200,
            cylinders: 8,
            type: 'v8-crossplane',
            baseFreqFactor: 4 / 60, // 4 импульса за 1 оборот
            camLope: true,
            timbre: { low: 1.8, mid: 1.2, high: 0.5, distortion: 0.45 },
            accentColor: '#ef4444'
        },
        'inline6-turbo': {
            name: '3.0L Twin-Power Turbo Inline-6',
            car: 'BMW M3 (S58) / Toyota Supra (2JZ-GTE)',
            desc: 'Идеально сбалансированная рядная «шестерка». Шелковистый механический звук, переходящий в яростный металлический вой с характерным свистом турбонаддува.',
            idleRpm: 800,
            maxRpm: 7600,
            redline: 7000,
            cylinders: 6,
            type: 'inline6',
            baseFreqFactor: 3 / 60,
            hasTurbo: true,
            timbre: { low: 1.1, mid: 1.6, high: 1.4, distortion: 0.35 },
            accentColor: '#3b82f6'
        },
        'v10-screamer': {
            name: '5.2L Naturally Aspirated V10',
            car: 'Lexus LFA / Lamborghini Huracán / Audi R8',
            desc: 'Высокооборотный формульный V10. Пронзительный акустический визг, напоминающий болиды Формулы-1 золотой эры, с отсечкой на 9000 об/мин.',
            idleRpm: 950,
            maxRpm: 9200,
            redline: 8700,
            cylinders: 10,
            type: 'v10',
            baseFreqFactor: 5 / 60,
            timbre: { low: 0.8, mid: 1.9, high: 2.2, distortion: 0.5 },
            accentColor: '#f59e0b'
        },
        'boxer6-gt3': {
            name: '4.0L Flat-6 Naturally Aspirated',
            car: 'Porsche 911 GT3 RS (992)',
            desc: 'Оппозитная шестёрка без турбин. Сухой гортанный скрежет, переходящий в чистейшую симфонию трекового спорткара при 9000 об/мин.',
            idleRpm: 850,
            maxRpm: 9000,
            redline: 8400,
            cylinders: 6,
            type: 'boxer6',
            baseFreqFactor: 3 / 60,
            timbre: { low: 1.0, mid: 1.7, high: 1.8, distortion: 0.4 },
            accentColor: '#10b981'
        },
        'rotary-13b': {
            name: '1.3L Twin-Rotor Wankel (13B-REW)',
            car: 'Mazda RX-7 (FD3S) / RX-8',
            desc: 'Роторно-поршневой мотор Ванкеля с агрессивным портингом. Легендарный рваный холостой ход «brap-brap-brap» и бешеный высокочастотный вой до 10 000 об/мин.',
            idleRpm: 1100,
            maxRpm: 9800,
            redline: 9000,
            cylinders: 2,
            type: 'rotary',
            baseFreqFactor: 3 / 60,
            hasTurbo: true,
            brapIdle: true,
            timbre: { low: 0.6, mid: 2.1, high: 2.4, distortion: 0.65 },
            accentColor: '#ec4899'
        },
        'hyper-ev': {
            name: 'Dual-Motor Warp Pulse (Electric)',
            car: 'Porsche Taycan Turbo GT / Zeekr 001 FR',
            desc: 'Футуристический синтетический импульс гипер-электромобиля. Мощный низкочастотный резонанс с полифонической модуляцией катушек инвертора.',
            idleRpm: 0,
            maxRpm: 8000,
            redline: 7500,
            cylinders: 0,
            type: 'ev',
            baseFreqFactor: 1 / 60,
            timbre: { low: 2.0, mid: 1.0, high: 1.5, distortion: 0.1 },
            accentColor: '#06b6d4'
        }
    };

    let audioCtx = null;
    let isRunning = false;
    let currentEngineKey = 'v8-muscle';
    let currentRpm = 750;
    let targetRpm = 750;
    let isGasPressed = false;
    let isShiftSimulating = false;
    let currentGear = 1;

    // Звуковые узлы
    let masterGain = null;
    let exhaustFilter = null;
    let driveDistortion = null;
    let analyserNode = null;
    let osc1 = null;
    let osc2 = null;
    let oscSub = null;
    let turboOsc = null;
    let turboGain = null;
    let lfoNode = null;
    let lfoGain = null;
    let starterNoise = null;

    // Canvas
    let canvas = null;
    let canvasCtx = null;
    let animFrameId = null;

    // DOM элементы
    const els = {};

    function initElements() {
        els.btnPower = document.getElementById('btnEnginePower');
        els.powerLabel = document.getElementById('enginePowerLabel');
        els.powerLed = document.getElementById('enginePowerLed');
        els.rpmSlider = document.getElementById('engineRpmSlider');
        els.rpmGaugeVal = document.getElementById('rpmGaugeVal');
        els.rpmGaugeNeedle = document.getElementById('rpmNeedle');
        els.btnGas = document.getElementById('btnGasPedal');
        els.btnPop = document.getElementById('btnPopBang');
        els.btnShift = document.getElementById('btnShiftGear');
        els.gearDisplay = document.getElementById('gearDisplay');
        els.canvas = document.getElementById('soundVisualizer');
        els.engineCards = document.querySelectorAll('.engine-card');
        els.engineTitle = document.getElementById('activeEngineTitle');
        els.engineCar = document.getElementById('activeEngineCar');
        els.engineDesc = document.getElementById('activeEngineDesc');
        els.volumeSlider = document.getElementById('engineVolume');

        canvas = els.canvas;
        if (canvas) {
            canvasCtx = canvas.getContext('2d');
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
    }

    // Создание кривой дисторшна для рычания
    function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    function initAudio() {
        if (audioCtx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();

        // Главный гейн
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

        // Анализатор для Canvas
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.8;

        // Фильтр выхлопа
        exhaustFilter = audioCtx.createBiquadFilter();
        exhaustFilter.type = 'lowpass';
        exhaustFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
        exhaustFilter.Q.setValueAtTime(3.5, audioCtx.currentTime);

        // Дисторшн
        driveDistortion = audioCtx.createWaveShaper();
        driveDistortion.curve = makeDistortionCurve(35);
        driveDistortion.oversample = '4x';

        // Соединение цепочки
        exhaustFilter.connect(driveDistortion);
        driveDistortion.connect(analyserNode);
        analyserNode.connect(masterGain);
        masterGain.connect(audioCtx.destination);
    }

    function startEngine() {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const engine = ENGINES[currentEngineKey];
        currentRpm = engine.idleRpm;
        targetRpm = engine.idleRpm;
        if (els.rpmSlider) els.rpmSlider.value = currentRpm;

        // Имитация стартера перед запуском
        playStarterSound(() => {
            setupEngineNodes(engine);
            isRunning = true;
            updatePowerUi(true);
            updateRpmDisplay();
            requestAnimationFrame(engineLoop);
            requestAnimationFrame(drawVisualizer);
        });
    }

    function playStarterSound(onComplete) {
        if (!audioCtx) return onComplete();

        // Всплеск белого шума стартера
        const bufferSize = audioCtx.sampleRate * 0.45;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 850;

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        noise.start();
        setTimeout(onComplete, 350);
    }

    function setupEngineNodes(engine) {
        const now = audioCtx.currentTime;

        // Осциллятор 1 (основной тон цилиндров)
        osc1 = audioCtx.createOscillator();
        osc1.type = engine.type === 'ev' ? 'sine' : 'sawtooth';

        // Осциллятор 2 (обертоны / гармоника)
        osc2 = audioCtx.createOscillator();
        osc2.type = engine.type === 'ev' ? 'triangle' : 'triangle';

        // Саб-бас осциллятор (утробный кач на низких частотах)
        oscSub = audioCtx.createOscillator();
        oscSub.type = 'sine';

        // LFO для холостого хода (Cam lope / brap)
        lfoNode = audioCtx.createOscillator();
        lfoNode.type = 'sine';
        lfoNode.frequency.setValueAtTime(engine.brapIdle ? 7.5 : (engine.camLope ? 4.2 : 2.5), now);

        lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(engine.brapIdle ? 30 : (engine.camLope ? 18 : 6), now);
        lfoNode.connect(lfoGain);

        // Турбина (для турбированных моторов)
        if (engine.hasTurbo) {
            turboOsc = audioCtx.createOscillator();
            turboOsc.type = 'sine';
            turboGain = audioCtx.createGain();
            turboGain.gain.setValueAtTime(0.001, now);
            turboOsc.connect(turboGain);
            turboGain.connect(masterGain);
            turboOsc.start(now);
        }

        // Подключение основных осцилляторов
        osc1.connect(exhaustFilter);
        osc2.connect(exhaustFilter);
        oscSub.connect(exhaustFilter);

        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        osc1.start(now);
        osc2.start(now);
        oscSub.start(now);
        lfoNode.start(now);

        // Плавный подъем громкости
        const vol = els.volumeSlider ? parseFloat(els.volumeSlider.value) : 0.75;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(0.01, now);
        masterGain.gain.exponentialRampToValueAtTime(vol * 0.4, now + 0.3);
    }

    function stopEngine() {
        if (!isRunning || !audioCtx) return;
        isRunning = false;
        isGasPressed = false;

        const now = audioCtx.currentTime;
        if (masterGain) {
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        }

        setTimeout(() => {
            try {
                if (osc1) { osc1.stop(); osc1.disconnect(); }
                if (osc2) { osc2.stop(); osc2.disconnect(); }
                if (oscSub) { oscSub.stop(); oscSub.disconnect(); }
                if (turboOsc) { turboOsc.stop(); turboOsc.disconnect(); }
                if (lfoNode) { lfoNode.stop(); lfoNode.disconnect(); }
            } catch (e) {}

            osc1 = null; osc2 = null; oscSub = null; turboOsc = null; lfoNode = null;
            currentRpm = 0;
            targetRpm = 0;
            updatePowerUi(false);
            updateRpmDisplay();
        }, 450);
    }

    function updateAudioParameters() {
        if (!isRunning || !audioCtx || !osc1) return;
        const engine = ENGINES[currentEngineKey];
        const now = audioCtx.currentTime;

        let baseFreq = 30;
        let subFreq = 20;

        if (engine.type === 'ev') {
            baseFreq = 60 + (currentRpm / engine.maxRpm) * 980;
            subFreq = 35 + (currentRpm / engine.maxRpm) * 320;
        } else {
            // Частота выхлопных импульсов
            const rps = currentRpm / 60;
            baseFreq = Math.max(18, rps * (engine.cylinders / 2));
            subFreq = Math.max(10, rps);
        }

        // Частоты осцилляторов
        osc1.frequency.setTargetAtTime(baseFreq, now, 0.04);
        osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.04);
        oscSub.frequency.setTargetAtTime(subFreq, now, 0.04);

        // Резонанс выхлопа (фильтр)
        const filterCutoff = 220 + (currentRpm / engine.maxRpm) * 2800 * engine.timbre.mid;
        exhaustFilter.frequency.setTargetAtTime(filterCutoff, now, 0.05);

        // Турбина
        if (engine.hasTurbo && turboOsc && turboGain) {
            const turboFreq = 1800 + (currentRpm / engine.maxRpm) * 3800;
            const turboLoad = isGasPressed ? 0.08 : 0.005;
            turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.08);
            turboGain.gain.setTargetAtTime(turboLoad, now, 0.08);
        }

        // Интенсивность LFO (уменьшается на высоких оборотах, выражена на холостых)
        if (lfoGain) {
            const idleRatio = Math.max(0, 1 - (currentRpm - engine.idleRpm) / 1200);
            const lfoStrength = (engine.brapIdle ? 35 : (engine.camLope ? 18 : 6)) * idleRatio;
            lfoGain.gain.setTargetAtTime(lfoStrength, now, 0.08);
        }
    }

    // Отстрелы выхлопа (Pop & Bang / Anti-Lag)
    function triggerPopBang() {
        if (!isRunning || !audioCtx) return;
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 хлопка

        for (let i = 0; i < count; i++) {
            const delay = i * (80 + Math.random() * 90);
            setTimeout(() => {
                playSinglePop();
            }, delay);
        }

        // Вспышка на тахометре
        if (els.rpmGaugeVal) {
            els.rpmGaugeVal.style.textShadow = '0 0 25px #ef4444, 0 0 45px #f59e0b';
            setTimeout(() => {
                els.rpmGaugeVal.style.textShadow = '';
            }, 300);
        }
    }

    function playSinglePop() {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const dur = 0.07 + Math.random() * 0.05;
        const bufferSize = Math.floor(audioCtx.sampleRate * dur);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const pop = audioCtx.createBufferSource();
        pop.buffer = buffer;

        const popFilter = audioCtx.createBiquadFilter();
        popFilter.type = 'highpass';
        popFilter.frequency.value = 180 + Math.random() * 120;

        const popGain = audioCtx.createGain();
        popGain.gain.setValueAtTime(0.65 + Math.random() * 0.35, now);
        popGain.gain.exponentialRampToValueAtTime(0.01, now + dur);

        pop.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(masterGain);

        pop.start(now);
    }

    // Симуляция переключения передачи (Shift)
    function simulateGearShift() {
        if (!isRunning || isShiftSimulating) return;
        isShiftSimulating = true;

        const engine = ENGINES[currentEngineKey];
        currentGear = currentGear >= 6 ? 1 : currentGear + 1;
        if (els.gearDisplay) els.gearDisplay.textContent = currentGear + ' ПЕРЕДАЧА';

        // Сброс газа и падение оборотов
        const preRpm = currentRpm;
        targetRpm = Math.max(engine.idleRpm, preRpm * 0.65);

        // Хлопок при сбросе
        triggerPopBang();

        setTimeout(() => {
            isShiftSimulating = false;
            if (isGasPressed) {
                targetRpm = engine.maxRpm;
            }
        }, 280);
    }

    // Главный физический цикл обновления оборотов (Engine Physics Loop)
    function engineLoop() {
        if (!isRunning) return;
        const engine = ENGINES[currentEngineKey];

        // Физика набора и сброса оборотов с инерцией маховика
        if (isGasPressed && !isShiftSimulating) {
            targetRpm = engine.maxRpm;
        } else if (!isGasPressed && !isShiftSimulating && !els.rpmSliderMouseHold) {
            targetRpm = engine.idleRpm;
        }

        // Плавная интерполяция
        const accelRate = isGasPressed ? 0.08 : 0.04;
        currentRpm += (targetRpm - currentRpm) * accelRate;

        // Небольшие естественные микроколебания холостого хода
        if (currentRpm < engine.idleRpm + 100) {
            currentRpm += (Math.random() - 0.5) * 15;
        }

        updateAudioParameters();
        updateRpmDisplay();

        requestAnimationFrame(engineLoop);
    }

    function updateRpmDisplay() {
        const engine = ENGINES[currentEngineKey];
        const displayRpm = Math.round(currentRpm);

        if (els.rpmGaugeVal) {
            els.rpmGaugeVal.textContent = isRunning ? displayRpm.toLocaleString('ru-RU') : '0';
        }

        if (els.rpmSlider && !els.rpmSliderMouseHold) {
            els.rpmSlider.value = displayRpm;
        }

        // Поворот стрелки тахометра (от -120deg до +120deg)
        if (els.rpmGaugeNeedle) {
            const fraction = Math.min(1, Math.max(0, currentRpm / engine.maxRpm));
            const angle = -120 + fraction * 240;
            els.rpmGaugeNeedle.style.transform = `rotate(${angle}deg)`;

            // Подсветка стрелки в Redline
            if (currentRpm >= engine.redline) {
                els.rpmGaugeNeedle.style.stroke = '#ef4444';
                els.rpmGaugeNeedle.style.filter = 'drop-shadow(0 0 10px #ef4444)';
            } else {
                els.rpmGaugeNeedle.style.stroke = engine.accentColor;
                els.rpmGaugeNeedle.style.filter = '';
            }
        }
    }

    function updatePowerUi(active) {
        if (els.btnPower) {
            els.btnPower.classList.toggle('active', active);
        }
        if (els.powerLabel) {
            els.powerLabel.textContent = active ? 'ENGINE RUNNING (STOP)' : 'ENGINE START';
        }
        if (els.powerLed) {
            els.powerLed.classList.toggle('led-active', active);
        }
    }

    // Визуализатор на Canvas (Осциллограмма + Спектр)
    function drawVisualizer() {
        if (!isRunning || !analyserNode || !canvasCtx || !canvas) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        const w = canvas.width;
        const h = canvas.height;
        const engine = ENGINES[currentEngineKey];

        canvasCtx.clearRect(0, 0, w, h);

        // Сетка
        canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        for (let x = 0; x < w; x += 40) {
            canvasCtx.moveTo(x, 0); canvasCtx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += 30) {
            canvasCtx.moveTo(0, y); canvasCtx.lineTo(w, y);
        }
        canvasCtx.stroke();

        // Спектрограмма частот (басы/гармоники)
        const freqArray = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(freqArray);

        const barWidth = (w / bufferLength) * 2.2;
        let barX = 0;
        for (let i = 0; i < bufferLength / 2; i++) {
            const barHeight = (freqArray[i] / 255) * h * 0.75;
            canvasCtx.fillStyle = engine.accentColor + '22';
            canvasCtx.fillRect(barX, h - barHeight, barWidth, barHeight);
            barX += barWidth + 1;
        }

        // Осциллограмма волны
        canvasCtx.lineWidth = 2.5;
        canvasCtx.strokeStyle = engine.accentColor;
        canvasCtx.shadowBlur = 12;
        canvasCtx.shadowColor = engine.accentColor;

        canvasCtx.beginPath();
        const sliceWidth = w / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * h) / 2;
            if (i === 0) canvasCtx.moveTo(x, y);
            else canvasCtx.lineTo(x, y);
            x += sliceWidth;
        }

        canvasCtx.lineTo(w, h / 2);
        canvasCtx.stroke();
        canvasCtx.shadowBlur = 0;

        requestAnimationFrame(drawVisualizer);
    }

    function switchEngine(key) {
        if (!ENGINES[key]) return;
        currentEngineKey = key;
        const engine = ENGINES[key];

        // UI карточек
        if (els.engineCards) {
            els.engineCards.forEach(c => {
                c.classList.toggle('active', c.getAttribute('data-engine') === key);
            });
        }

        // Обновление описания
        if (els.engineTitle) els.engineTitle.textContent = engine.name;
        if (els.engineCar) els.engineCar.textContent = engine.car;
        if (els.engineDesc) els.engineDesc.textContent = engine.desc;

        // Если запущен — перезапуск с новым звуковым ядром
        if (isRunning) {
            stopEngine();
            setTimeout(startEngine, 500);
        }
    }

    function bindEvents() {
        // Кнопка старт/стоп
        if (els.btnPower) {
            els.btnPower.addEventListener('click', () => {
                if (isRunning) stopEngine();
                else startEngine();
            });
        }

        // Ползунок RPM
        if (els.rpmSlider) {
            els.rpmSlider.addEventListener('mousedown', () => { els.rpmSliderMouseHold = true; });
            window.addEventListener('mouseup', () => { els.rpmSliderMouseHold = false; });
            els.rpmSlider.addEventListener('input', (e) => {
                if (!isRunning) startEngine();
                targetRpm = parseFloat(e.target.value);
                currentRpm = targetRpm;
            });
        }

        // Педаль «Газ в пол»
        if (els.btnGas) {
            const pressGas = (e) => {
                e.preventDefault();
                if (!isRunning) startEngine();
                isGasPressed = true;
                els.btnGas.classList.add('gas-active');
            };
            const releaseGas = (e) => {
                e.preventDefault();
                isGasPressed = false;
                els.btnGas.classList.remove('gas-active');
                // Отстрел при резком сбросе газа с высоких оборотов
                if (currentRpm > 4500) {
                    setTimeout(triggerPopBang, 120);
                }
            };

            els.btnGas.addEventListener('mousedown', pressGas);
            window.addEventListener('mouseup', releaseGas);
            els.btnGas.addEventListener('touchstart', pressGas, { passive: false });
            window.addEventListener('touchend', releaseGas, { passive: false });
        }

        // Кнопка Pop & Bang
        if (els.btnPop) {
            els.btnPop.addEventListener('click', () => {
                if (!isRunning) startEngine();
                triggerPopBang();
            });
        }

        // Кнопка переключения передачи
        if (els.btnShift) {
            els.btnShift.addEventListener('click', () => {
                if (!isRunning) startEngine();
                simulateGearShift();
            });
        }

        // Выбор мотора
        if (els.engineCards) {
            els.engineCards.forEach(card => {
                card.addEventListener('click', () => {
                    const k = card.getAttribute('data-engine');
                    switchEngine(k);
                });
            });
        }

        // Громкость
        if (els.volumeSlider) {
            els.volumeSlider.addEventListener('input', (e) => {
                if (masterGain && audioCtx) {
                    const vol = parseFloat(e.target.value);
                    masterGain.gain.setValueAtTime(vol * 0.4, audioCtx.currentTime);
                }
            });
        }

        // Горячие клавиши (Space — газ, S — переключение, P — отстрелы, Esc — стоп)
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (!isRunning) startEngine();
                isGasPressed = true;
                if (els.btnGas) els.btnGas.classList.add('gas-active');
            } else if (e.code === 'KeyP') {
                triggerPopBang();
            } else if (e.code === 'KeyS') {
                simulateGearShift();
            } else if (e.code === 'Escape') {
                stopEngine();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                isGasPressed = false;
                if (els.btnGas) els.btnGas.classList.remove('gas-active');
                if (currentRpm > 4500) setTimeout(triggerPopBang, 120);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initElements();
        bindEvents();
    });
})();
