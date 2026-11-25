/**
 * АвтоТема — Лаборатория звука моторов (Engine Sound Lab) v2.0
 * Полноценный синтез акустики двигателей в реальном времени через Web Audio API.
 * Реализованы:
 * - Hardcut Rev Limiter (боевая отсечка с искрами)
 * - Turbo Blow-Off & Compressor Surge ("stututu" flutter)
 * - 2-Step Launch Control (лонч-контроль с антилагом)
 * - 3 режима выхлопа: Stock / Sport Cat-Back / Straight Pipe (Прямоток)
 * - Анимированные выхлопные трубы с языками пламени
 * - Осциллограмма и спектрограмма FFT 60 FPS
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
            baseFreqFactor: 4 / 60,
            camLope: true,
            timbre: { low: 1.8, mid: 1.2, high: 0.5 },
            accentColor: '#ef4444',
            crankRpm: 220,
            starterFreq: 145,
            crankPulses: 12,
            starterDuration: 850,
            flareRpm: 1750,
            flareDuration: 620
        },
        'inline6-turbo': {
            name: '3.0L Twin-Power Turbo Inline-6',
            car: 'BMW M3 (S58) / Toyota Supra (2JZ-GTE)',
            desc: 'Идеально сбалансированная рядная «шестерка». Шелковистый механический звук, переходящий в яростный металлический вой со свистом турбины и стравливанием вейстгейта.',
            idleRpm: 800,
            maxRpm: 7600,
            redline: 7000,
            cylinders: 6,
            type: 'inline6',
            baseFreqFactor: 3 / 60,
            hasTurbo: true,
            timbre: { low: 1.1, mid: 1.6, high: 1.4 },
            accentColor: '#3b82f6',
            crankRpm: 235,
            starterFreq: 165,
            crankPulses: 10,
            starterDuration: 800,
            flareRpm: 1650,
            flareDuration: 560
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
            timbre: { low: 0.8, mid: 1.9, high: 2.2 },
            accentColor: '#f59e0b',
            crankRpm: 260,
            starterFreq: 195,
            crankPulses: 15,
            starterDuration: 850,
            flareRpm: 2250,
            flareDuration: 680
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
            timbre: { low: 1.0, mid: 1.7, high: 1.8 },
            accentColor: '#10b981',
            crankRpm: 240,
            starterFreq: 155,
            crankPulses: 11,
            starterDuration: 780,
            flareRpm: 1850,
            flareDuration: 580
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
            timbre: { low: 0.6, mid: 2.1, high: 2.4 },
            accentColor: '#ec4899',
            crankRpm: 290,
            starterFreq: 230,
            crankPulses: 16,
            starterDuration: 750,
            flareRpm: 2150,
            flareDuration: 650
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
            timbre: { low: 2.0, mid: 1.0, high: 1.5 },
            accentColor: '#06b6d4',
            crankRpm: 0,
            starterFreq: 0,
            crankPulses: 0,
            starterDuration: 580,
            flareRpm: 450,
            flareDuration: 400
        }
    };

    // Настройки выхлопных систем
    const EXHAUST_PROFILES = {
        'stock': { name: 'Заводской (Stock)', cutoffMult: 0.8, distortion: 20, popGain: 0.4, flameProb: 0.2 },
        'sport': { name: 'Спорт Cat-Back', cutoffMult: 1.15, distortion: 45, popGain: 0.8, flameProb: 0.6 },
        'straight': { name: 'Прямоток (Straight Pipe)', cutoffMult: 1.6, distortion: 80, popGain: 1.3, flameProb: 1.0 }
    };

    let audioCtx = null;
    let isRunning = false;
    let isStarting = false;
    let isStopping = false;
    let currentEngineKey = 'v8-muscle';
    let currentExhaust = 'sport';
    let currentRpm = 750;
    let targetRpm = 750;
    let isGasPressed = false;
    let isShiftSimulating = false;
    let isLaunchControlActive = false;
    let isLimiterCutting = false;
    let lastLimiterCutTime = 0;
    let currentGear = 1;

    // Звуковые узлы Web Audio API
    let mainOut = null;
    let masterGain = null;
    let exhaustFilter = null;
    let driveDistortion = null;
    let analyserNode = null;
    let stereoPanner = null;
    let osc1 = null;
    let osc2 = null;
    let oscSub = null;
    let turboOsc = null;
    let turboGain = null;
    let lfoNode = null;
    let lfoGain = null;

    // Canvas
    let canvas = null;
    let canvasCtx = null;

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
        els.btnLaunch = document.getElementById('btnLaunchControl');
        els.btnFlutter = document.getElementById('btnTurboFlutter');
        els.gearDisplay = document.getElementById('gearDisplay');
        els.canvas = document.getElementById('soundVisualizer');
        els.engineCards = document.querySelectorAll('.engine-card');
        els.exhaustBtns = document.querySelectorAll('.btn-exhaust-mode');
        els.engineTitle = document.getElementById('activeEngineTitle');
        els.engineCar = document.getElementById('activeEngineCar');
        els.engineDesc = document.getElementById('activeEngineDesc');
        els.volumeSlider = document.getElementById('engineVolume');
        els.flameLeft = document.getElementById('flameLeft');
        els.flameRight = document.getElementById('flameRight');
        els.pipeBox = document.getElementById('exhaustPipesBox');

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

        // Главный выход громкости
        mainOut = audioCtx.createGain();
        const vol = els.volumeSlider ? parseFloat(els.volumeSlider.value) : 0.75;
        mainOut.gain.setValueAtTime(vol, audioCtx.currentTime);
        mainOut.connect(audioCtx.destination);

        // Мастер-фейдер рабочего двигателя
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        masterGain.connect(mainOut);

        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.8;

        exhaustFilter = audioCtx.createBiquadFilter();
        exhaustFilter.type = 'lowpass';
        exhaustFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
        exhaustFilter.Q.setValueAtTime(3.5, audioCtx.currentTime);

        driveDistortion = audioCtx.createWaveShaper();
        driveDistortion.curve = makeDistortionCurve(EXHAUST_PROFILES[currentExhaust].distortion);
        driveDistortion.oversample = '4x';

        // Панорамирование
        if (audioCtx.createStereoPanner) {
            stereoPanner = audioCtx.createStereoPanner();
            stereoPanner.pan.setValueAtTime(0, audioCtx.currentTime);
            exhaustFilter.connect(driveDistortion);
            driveDistortion.connect(stereoPanner);
            stereoPanner.connect(analyserNode);
        } else {
            exhaustFilter.connect(driveDistortion);
            driveDistortion.connect(analyserNode);
        }

        analyserNode.connect(masterGain);
    }

    // Реле и контакторы высокого напряжения Hyper-EV
    function playEvContactor(isPowerUp) {
        if (!audioCtx || !mainOut) return;
        const now = audioCtx.currentTime;

        // Щелчок контактов
        const dur = 0.022;
        const buf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * dur), audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.16));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600, now);
        filter.Q.setValueAtTime(2.8, now);
        const nGain = audioCtx.createGain();
        nGain.gain.setValueAtTime(0.35, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(mainOut);
        noise.start(now);

        // Соленоидный механический удар
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isPowerUp ? 115 : 85, now);
        osc.frequency.exponentialRampToValueAtTime(isPowerUp ? 35 : 22, now + 0.04);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.48, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(mainOut);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Включение Hyper-EV (резонансный свист инвертора)
    function playEvPowerUp(onComplete) {
        if (!audioCtx || !mainOut) return onComplete();
        const now = audioCtx.currentTime;
        playEvContactor(true);

        const dur = 0.52;
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, now + 0.05);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.05 + dur);

        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(440, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.05 + dur);

        const gain1 = audioCtx.createGain();
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.setValueAtTime(0.01, now + 0.05);
        gain1.gain.linearRampToValueAtTime(0.25, now + 0.22);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + dur);

        const gain2 = audioCtx.createGain();
        gain2.gain.setValueAtTime(0.0001, now);
        gain2.gain.setValueAtTime(0.01, now + 0.05);
        gain2.gain.linearRampToValueAtTime(0.12, now + 0.22);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + dur);

        osc1.connect(gain1);
        gain1.connect(mainOut);
        osc2.connect(gain2);
        gain2.connect(mainOut);

        osc1.start(now + 0.05);
        osc2.start(now + 0.05);
        osc1.stop(now + 0.05 + dur);
        osc2.stop(now + 0.05 + dur);

        setTimeout(onComplete, Math.floor((dur + 0.06) * 1000));
    }

    // Выключение Hyper-EV (разряд инвертора)
    function playEvPowerDown(onComplete) {
        if (!audioCtx || !mainOut) return onComplete();
        const now = audioCtx.currentTime;
        playEvContactor(false);

        const dur = 0.62;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now + 0.03);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.03 + dur);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.2, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + dur);

        osc.connect(gain);
        gain.connect(mainOut);
        osc.start(now + 0.03);
        osc.stop(now + 0.03 + dur);

        setTimeout(onComplete, Math.floor((dur + 0.06) * 1000));
    }

    // Компрессионный механический толчок (такты сжатия поршней в цилиндрах)
    function playCompressionThump(gainMultiplier, isFinal) {
        if (!audioCtx || !mainOut) return;
        const now = audioCtx.currentTime;
        const mult = gainMultiplier || 1.0;

        // Саб-басовый толчок воздуха в камере сгорания
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isFinal ? 46 : 68, now);
        osc.frequency.exponentialRampToValueAtTime(18, now + (isFinal ? 0.07 : 0.045));

        const oscGain = audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.38 * mult, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.075 : 0.05));

        osc.connect(oscGain);
        oscGain.connect(mainOut);
        osc.start(now);
        osc.stop(now + (isFinal ? 0.08 : 0.055));

        // Механический глухой хлопок клапанов и колец
        const dur = isFinal ? 0.038 : 0.026;
        const buf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * dur), audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.22));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isFinal ? 380 : 280, now);

        const nGain = audioCtx.createGain();
        nGain.gain.setValueAtTime(0.28 * mult, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(mainOut);
        noise.start(now);
    }

    // Первоначальный выхлопной рык и хлопок при схватывании зажигания
    function playStartupBark(engine) {
        if (!audioCtx || !mainOut) return;
        const now = audioCtx.currentTime;

        // 1. Острый импульс вспышки смеси
        const dur = 0.14;
        const buf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * dur), audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.18));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buf;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(150, now);

        const bGain = audioCtx.createGain();
        bGain.gain.setValueAtTime(0.75, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(bGain);
        bGain.connect(mainOut);
        noise.start(now);

        // 2. Глубокий резонанс выхлопного тракта
        const boom = audioCtx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(125, now);
        boom.frequency.exponentialRampToValueAtTime(32, now + 0.13);

        const boomGain = audioCtx.createGain();
        boomGain.gain.setValueAtTime(0.55, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        boom.connect(boomGain);
        boomGain.connect(mainOut);
        boom.start(now);
        boom.stop(now + 0.16);
    }

    // Реалистичный электростартер с компрессионными толчками и просадкой оборотов
    function playRealisticStarter(engine, onCatch) {
        if (engine.type === 'ev') {
            playEvPowerUp(onCatch);
            return;
        }
        if (!audioCtx || !mainOut) return onCatch();

        const now = audioCtx.currentTime;
        const durMs = engine.starterDuration || 820;
        const durSec = durMs / 1000;

        // 1. Электромотор стартера (обмотка + редуктор)
        const starterOsc = audioCtx.createOscillator();
        starterOsc.type = 'sawtooth';
        starterOsc.frequency.setValueAtTime(engine.starterFreq || 150, now);

        // Зубчатый свист шестерни бендикса
        const gearOsc = audioCtx.createOscillator();
        gearOsc.type = 'sine';
        gearOsc.frequency.setValueAtTime((engine.starterFreq || 150) * 3.75, now);

        const gearFilter = audioCtx.createBiquadFilter();
        gearFilter.type = 'bandpass';
        gearFilter.frequency.setValueAtTime(760, now);
        gearFilter.Q.setValueAtTime(3.0, now);

        // Просадка оборотов стартера при прохождении каждой ВМТ (компрессионная модуляция)
        const crankPulses = engine.crankPulses || 12;
        const pulseCadence = crankPulses / durSec;
        const starterMod = audioCtx.createOscillator();
        starterMod.type = 'sine';
        starterMod.frequency.setValueAtTime(pulseCadence, now);

        const starterModGain = audioCtx.createGain();
        starterModGain.gain.setValueAtTime(18, now); // просадка на 18 Гц при сжатии
        starterMod.connect(starterModGain);
        starterModGain.connect(starterOsc.frequency);

        const sFilter = audioCtx.createBiquadFilter();
        sFilter.type = 'lowpass';
        sFilter.frequency.setValueAtTime(680, now);

        const sGain = audioCtx.createGain();
        sGain.gain.setValueAtTime(0.0001, now);
        sGain.gain.linearRampToValueAtTime(0.32, now + 0.04);
        sGain.gain.setValueAtTime(0.32, now + durSec - 0.06);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + durSec);

        starterOsc.connect(sFilter);
        sFilter.connect(sGain);
        gearOsc.connect(gearFilter);
        gearFilter.connect(sGain);
        sGain.connect(mainOut);

        starterOsc.start(now);
        gearOsc.start(now);
        starterMod.start(now);

        starterOsc.stop(now + durSec);
        gearOsc.stop(now + durSec);
        starterMod.stop(now + durSec);

        // 2. Ритмичные компрессионные толчки и колебания стрелки тахометра
        const pulseInterval = durMs / crankPulses;
        for (let i = 0; i < crankPulses; i++) {
            const delay = Math.round(i * pulseInterval);
            setTimeout(() => {
                if (!isStarting) return;
                playCompressionThump(0.42, false);
                currentRpm = (engine.crankRpm || 230) + (Math.random() - 0.5) * 35;
                updateRpmDisplay();
            }, delay);
        }

        setTimeout(() => {
            onCatch();
        }, durMs);
    }

    function startEngine() {
        if (isStarting || isStopping) return;
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const engine = ENGINES[currentEngineKey];
        isStarting = true;
        isRunning = true;
        currentRpm = engine.crankRpm || 200;
        targetRpm = engine.crankRpm || 200;
        if (els.rpmSlider) els.rpmSlider.value = currentRpm;

        updatePowerUi(true, true, false);
        updateRpmDisplay();

        // Синхронный запуск узлов в момент тапа (критично для iOS Safari)
        setupEngineNodes(engine, true);

        requestAnimationFrame(engineLoop);
        requestAnimationFrame(drawVisualizer);

        playRealisticStarter(engine, () => {
            if (!isRunning || !audioCtx || !masterGain) return;

            // Схватывание зажигания
            if (engine.type !== 'ev') {
                playStartupBark(engine);
                triggerExhaustFlame(220);
            }

            const flareTarget = engine.flareRpm || (engine.idleRpm * 1.8);
            const flareDur = engine.flareDuration || 600;
            const now = audioCtx.currentTime;

            // Открытие громкости выхлопа
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(0.04, now);
            masterGain.gain.exponentialRampToValueAtTime(0.42, now + 0.16);

            // Резкое раскрытие выхлопного фильтра на вспышке
            exhaustFilter.frequency.cancelScheduledValues(now);
            exhaustFilter.frequency.setValueAtTime(2200, now);
            exhaustFilter.frequency.exponentialRampToValueAtTime(450, now + 0.65);

            // Анимация стартовой перегазовки (Rev Flare): резкий бросок вверх и плавный выход на холостые
            const flareStartTime = performance.now();
            const startFlareRpm = currentRpm;

            function animateFlare(time) {
                const elapsed = time - flareStartTime;
                if (elapsed < 160) {
                    const t = elapsed / 160;
                    currentRpm = startFlareRpm + (flareTarget - startFlareRpm) * Math.sin(t * Math.PI * 0.5);
                    requestAnimationFrame(animateFlare);
                } else if (elapsed < flareDur) {
                    const t = (elapsed - 160) / (flareDur - 160);
                    currentRpm = flareTarget - (flareTarget - engine.idleRpm) * Math.sin(t * Math.PI * 0.5);
                    requestAnimationFrame(animateFlare);
                } else {
                    currentRpm = engine.idleRpm;
                    targetRpm = engine.idleRpm;
                    isStarting = false;
                    updatePowerUi(true, false, false);
                }
                updateRpmDisplay();
            }
            requestAnimationFrame(animateFlare);
        });
    }

    function setupEngineNodes(engine, duringStarter) {
        const now = audioCtx.currentTime;

        osc1 = audioCtx.createOscillator();
        osc1.type = engine.type === 'ev' ? 'sine' : 'sawtooth';

        osc2 = audioCtx.createOscillator();
        osc2.type = engine.type === 'ev' ? 'triangle' : 'triangle';

        oscSub = audioCtx.createOscillator();
        oscSub.type = 'sine';

        lfoNode = audioCtx.createOscillator();
        lfoNode.type = 'sine';
        lfoNode.frequency.setValueAtTime(engine.brapIdle ? 7.5 : (engine.camLope ? 4.2 : 2.5), now);

        lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(engine.brapIdle ? 32 : (engine.camLope ? 18 : 6), now);
        lfoNode.connect(lfoGain);

        if (engine.hasTurbo) {
            turboOsc = audioCtx.createOscillator();
            turboOsc.type = 'sine';
            turboGain = audioCtx.createGain();
            turboGain.gain.setValueAtTime(0.001, now);
            turboOsc.connect(turboGain);
            turboGain.connect(masterGain);
            turboOsc.start(now);
        }

        osc1.connect(exhaustFilter);
        osc2.connect(exhaustFilter);
        oscSub.connect(exhaustFilter);

        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        osc1.start(now);
        osc2.start(now);
        oscSub.start(now);
        lfoNode.start(now);

        masterGain.gain.cancelScheduledValues(now);
        if (duringStarter) {
            masterGain.gain.setValueAtTime(0.0001, now);
        } else {
            const vol = els.volumeSlider ? parseFloat(els.volumeSlider.value) : 0.75;
            masterGain.gain.setValueAtTime(0.01, now);
            masterGain.gain.exponentialRampToValueAtTime(vol * 0.42, now + 0.3);
        }
    }

    function stopEngine() {
        if (!isRunning || isStopping || isStarting) return;
        isStopping = true;
        isGasPressed = false;
        isLaunchControlActive = false;

        const engine = ENGINES[currentEngineKey];
        updatePowerUi(false, false, true);

        if (engine.type === 'ev') {
            playEvPowerDown(() => {
                finishStopEngine();
            });
            return;
        }

        // Остановка ДВС
        const now = audioCtx.currentTime;

        // 1. Мгновенное прекращение воспламенения (отсечка топлива и искры)
        driveDistortion.curve = makeDistortionCurve(0);
        exhaustFilter.frequency.cancelScheduledValues(now);
        exhaustFilter.frequency.setTargetAtTime(180, now, 0.08);
        if (turboGain) {
            turboGain.gain.cancelScheduledValues(now);
            turboGain.gain.setTargetAtTime(0.0001, now, 0.06);
        }

        // 2. Инерционный выбег коленвала (Spin-Down)
        const spinStartTime = performance.now();
        const spinDuration = 860;
        const initialSpinRpm = Math.max(engine.idleRpm, currentRpm);

        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        // 3. Затухающие финальные такты сжатия поршней
        setTimeout(() => { if (isStopping) playCompressionThump(0.34, false); }, 420);
        setTimeout(() => { if (isStopping) playCompressionThump(0.24, false); }, 630);
        setTimeout(() => { if (isStopping) playCompressionThump(0.18, true); }, 790);

        function animateSpinDown(time) {
            const elapsed = time - spinStartTime;
            if (elapsed < spinDuration) {
                const progress = elapsed / spinDuration;
                currentRpm = Math.max(0, initialSpinRpm * Math.pow(1 - progress, 1.55));
                updateRpmDisplay();
                updateAudioParameters();
                requestAnimationFrame(animateSpinDown);
            } else {
                currentRpm = 0;
                targetRpm = 0;
                updateRpmDisplay();
                finishStopEngine();
            }
        }
        requestAnimationFrame(animateSpinDown);
    }

    function finishStopEngine() {
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
        isRunning = false;
        isStopping = false;
        isStarting = false;
        // Восстановление кривой дисторшна для следующего запуска
        if (driveDistortion) {
            driveDistortion.curve = makeDistortionCurve(EXHAUST_PROFILES[currentExhaust].distortion);
        }
        updatePowerUi(false, false, false);
        updateRpmDisplay();
        hideExhaustFlame();
    }

    function updateAudioParameters() {
        if (!isRunning || !audioCtx || !osc1) return;
        const engine = ENGINES[currentEngineKey];
        const exhaust = EXHAUST_PROFILES[currentExhaust];
        const now = audioCtx.currentTime;

        let baseFreq = 30;
        let subFreq = 20;

        if (engine.type === 'ev') {
            baseFreq = 60 + (currentRpm / engine.maxRpm) * 980;
            subFreq = 35 + (currentRpm / engine.maxRpm) * 320;
        } else {
            const rps = currentRpm / 60;
            baseFreq = Math.max(18, rps * (engine.cylinders / 2));
            subFreq = Math.max(10, rps);
        }

        osc1.frequency.setTargetAtTime(baseFreq, now, 0.04);
        osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.04);
        oscSub.frequency.setTargetAtTime(subFreq, now, 0.04);

        const filterCutoff = (240 + (currentRpm / engine.maxRpm) * 2800 * engine.timbre.mid) * exhaust.cutoffMult;
        exhaustFilter.frequency.setTargetAtTime(filterCutoff, now, 0.05);

        if (engine.hasTurbo && turboOsc && turboGain) {
            const turboFreq = 1800 + (currentRpm / engine.maxRpm) * 3800;
            const turboLoad = isGasPressed ? 0.09 : 0.005;
            turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.08);
            turboGain.gain.setTargetAtTime(turboLoad, now, 0.08);
        }

        if (lfoGain) {
            const idleRatio = Math.max(0, 1 - (currentRpm - engine.idleRpm) / 1200);
            const lfoStrength = (engine.brapIdle ? 35 : (engine.camLope ? 18 : 6)) * idleRatio;
            lfoGain.gain.setTargetAtTime(lfoStrength, now, 0.08);
        }
    }

    // Вспышка пламени из выхлопных труб
    function triggerExhaustFlame(durationMs) {
        const ms = durationMs || 150;
        if (els.flameLeft) els.flameLeft.classList.add('flame-active');
        if (els.flameRight) els.flameRight.classList.add('flame-active');
        if (els.pipeBox) els.pipeBox.classList.add('pipes-glow');

        setTimeout(hideExhaustFlame, ms);
    }

    function hideExhaustFlame() {
        if (els.flameLeft) els.flameLeft.classList.remove('flame-active');
        if (els.flameRight) els.flameRight.classList.remove('flame-active');
        if (els.pipeBox) els.pipeBox.classList.remove('pipes-glow');
    }

    // Отстрелы выхлопа (Pop & Bang)
    function triggerPopBang(customCount) {
        if (!isRunning || !audioCtx) return;
        const count = customCount || (Math.floor(Math.random() * 3) + 2);

        for (let i = 0; i < count; i++) {
            const delay = i * (75 + Math.random() * 85);
            setTimeout(() => {
                playSinglePop();
                triggerExhaustFlame(120);
            }, delay);
        }

        if (els.rpmGaugeVal) {
            els.rpmGaugeVal.style.textShadow = '0 0 25px #ef4444, 0 0 50px #f59e0b';
            setTimeout(() => {
                if (els.rpmGaugeVal) els.rpmGaugeVal.style.textShadow = '';
            }, 350);
        }
    }

    function playSinglePop() {
        if (!audioCtx) return;
        const exhaust = EXHAUST_PROFILES[currentExhaust];
        const now = audioCtx.currentTime;
        const dur = 0.08 + Math.random() * 0.06;
        const bufferSize = Math.floor(audioCtx.sampleRate * dur);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
        }

        const pop = audioCtx.createBufferSource();
        pop.buffer = buffer;

        const popFilter = audioCtx.createBiquadFilter();
        popFilter.type = 'highpass';
        popFilter.frequency.value = 160 + Math.random() * 140;

        const popGain = audioCtx.createGain();
        const baseVol = 0.75 * exhaust.popGain;
        popGain.gain.setValueAtTime(baseVol + Math.random() * 0.3, now);
        popGain.gain.exponentialRampToValueAtTime(0.01, now + dur);

        pop.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(masterGain);

        pop.start(now);
    }

    // Легендарный сброс турбины — Blow-Off & Wastegate flutter ("stututu")
    function triggerTurboFlutter() {
        if (!isRunning || !audioCtx) return;
        const now = audioCtx.currentTime;

        // 1. Воздушный пшик (Blow-off hiss)
        const hissDur = 0.28;
        const hissBuf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * hissDur), audioCtx.sampleRate);
        const hData = hissBuf.getChannelData(0);
        for (let i = 0; i < hData.length; i++) {
            hData[i] = (Math.random() * 2 - 1) * (1 - i / hData.length);
        }
        const hiss = audioCtx.createBufferSource();
        hiss.buffer = hissBuf;
        const hissFilter = audioCtx.createBiquadFilter();
        hissFilter.type = 'bandpass';
        hissFilter.frequency.setValueAtTime(3200, now);
        hissFilter.Q.setValueAtTime(2.0, now);

        const hissGain = audioCtx.createGain();
        hissGain.gain.setValueAtTime(0.45, now);
        hissGain.gain.exponentialRampToValueAtTime(0.01, now + hissDur);

        hiss.connect(hissFilter);
        hissFilter.connect(hissGain);
        hissGain.connect(masterGain);
        hiss.start(now);

        // 2. Культовое пульсирующее чириканье "ту-ту-ту-ту-ту"
        const flutterDur = 0.65;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + flutterDur);

        // LFO модуляция для стука лопаток компрессора (16 Hz)
        const flutterLfo = audioCtx.createOscillator();
        flutterLfo.type = 'square';
        flutterLfo.frequency.setValueAtTime(16, now);

        const fLfoGain = audioCtx.createGain();
        fLfoGain.gain.setValueAtTime(0.5, now);
        flutterLfo.connect(fLfoGain.gain);

        const fGain = audioCtx.createGain();
        fGain.gain.setValueAtTime(0.01, now + 0.05);
        fGain.gain.linearRampToValueAtTime(0.38, now + 0.12);
        fGain.gain.exponentialRampToValueAtTime(0.005, now + flutterDur);

        osc.connect(fGain);
        fGain.connect(masterGain);

        osc.start(now);
        flutterLfo.start(now);
        osc.stop(now + flutterDur);
        flutterLfo.stop(now + flutterDur);

        // Одиночный хлопок в конце
        setTimeout(() => {
            playSinglePop();
            triggerExhaustFlame(100);
        }, 320);
    }

    // Симуляция переключения передачи
    function simulateGearShift() {
        if (!isRunning || isShiftSimulating) return;
        isShiftSimulating = true;

        const engine = ENGINES[currentEngineKey];
        currentGear = currentGear >= 6 ? 1 : currentGear + 1;
        if (els.gearDisplay) els.gearDisplay.textContent = currentGear + ' ПЕРЕДАЧА';

        const preRpm = currentRpm;
        targetRpm = Math.max(engine.idleRpm, preRpm * 0.65);

        triggerPopBang(2);

        setTimeout(() => {
            isShiftSimulating = false;
            if (isGasPressed && !isLaunchControlActive) {
                targetRpm = engine.maxRpm;
            }
        }, 280);
    }

    // 2-Step Launch Control
    function toggleLaunchControl() {
        if (!isRunning) startEngine();
        isLaunchControlActive = !isLaunchControlActive;

        if (els.btnLaunch) {
            els.btnLaunch.classList.toggle('active', isLaunchControlActive);
        }

        if (isLaunchControlActive) {
            targetRpm = 4500;
            // Серия хлопков удержания наддува
            triggerPopBang(3);
        } else {
            if (isGasPressed) {
                const engine = ENGINES[currentEngineKey];
                targetRpm = engine.maxRpm;
                triggerPopBang(2);
            }
        }
    }

    // Переключение профиля выхлопа
    function setExhaustProfile(key) {
        if (!EXHAUST_PROFILES[key]) return;
        currentExhaust = key;
        const profile = EXHAUST_PROFILES[key];

        if (driveDistortion && audioCtx) {
            driveDistortion.curve = makeDistortionCurve(profile.distortion);
        }

        if (els.exhaustBtns) {
            els.exhaustBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-exhaust') === key);
            });
        }

        // Акустический проверочный отстрел при выборе прямотока
        if (isRunning && key === 'straight') {
            triggerPopBang(3);
        }
    }

    // Физический цикл обновления оборотов (Hardcut Rev Limiter & Inertia)
    function engineLoop(timestamp) {
        if (!isRunning) return;
        if (isStarting || isStopping) {
            updateAudioParameters();
            updateRpmDisplay();
            requestAnimationFrame(engineLoop);
            return;
        }

        const engine = ENGINES[currentEngineKey];

        // 1. Режим Launch Control
        if (isLaunchControlActive) {
            targetRpm = 4500 + (Math.random() - 0.5) * 120;
            // Периодические отстрелы антилага
            if (Math.random() < 0.12) {
                playSinglePop();
                triggerExhaustFlame(90);
            }
        }
        // 2. Газ в пол
        else if (isGasPressed && !isShiftSimulating) {
            targetRpm = engine.maxRpm;
        }
        // 3. Холостой ход
        else if (!isGasPressed && !isShiftSimulating && !els.rpmSliderMouseHold) {
            targetRpm = engine.idleRpm;
        }

        // Плавная интерполяция оборотов
        const accelRate = isGasPressed ? 0.085 : 0.045;
        currentRpm += (targetRpm - currentRpm) * accelRate;

        // 4. БОЕВАЯ ОТСЕЧКА (Hardcut Spark-Cut Rev Limiter)
        if (currentRpm >= engine.redline && isGasPressed && !isLaunchControlActive) {
            if (timestamp - lastLimiterCutTime > 75) { // 13 отсечек в секунду (machine-gun bounce)
                lastLimiterCutTime = timestamp;
                // Кратковременный сброс оборотов
                currentRpm = engine.redline - 180 + Math.random() * 40;
                playSinglePop();
                triggerExhaustFlame(60);

                if (els.rpmGaugeNeedle) {
                    els.rpmGaugeNeedle.style.filter = 'drop-shadow(0 0 15px #ef4444)';
                }
            }
        }

        // Микроколебания холостого хода
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
            els.rpmGaugeVal.textContent = (isRunning || isStarting || isStopping) ? displayRpm.toLocaleString('ru-RU') : '0';
        }

        if (els.rpmSlider && !els.rpmSliderMouseHold) {
            els.rpmSlider.value = displayRpm;
        }

        if (els.rpmGaugeNeedle) {
            const fraction = Math.min(1, Math.max(0, currentRpm / engine.maxRpm));
            const angle = -120 + fraction * 240;
            els.rpmGaugeNeedle.style.transform = `rotate(${angle}deg)`;

            if (currentRpm >= engine.redline) {
                els.rpmGaugeNeedle.style.stroke = '#ef4444';
            } else {
                els.rpmGaugeNeedle.style.stroke = engine.accentColor;
                els.rpmGaugeNeedle.style.filter = '';
            }
        }
    }

    function updatePowerUi(active, isCranking, isStoppingState) {
        if (els.btnPower) {
            els.btnPower.classList.toggle('active', active && !isCranking);
            els.btnPower.classList.toggle('cranking', !!isCranking);
        }
        if (els.powerLabel) {
            if (isCranking) els.powerLabel.textContent = 'CRANKING...';
            else if (isStoppingState) els.powerLabel.textContent = 'STOPPING...';
            else if (active) els.powerLabel.textContent = 'ENGINE RUNNING (STOP)';
            else els.powerLabel.textContent = 'ENGINE START';
        }
        if (els.powerLed) {
            els.powerLed.classList.toggle('led-active', active && !isCranking);
            els.powerLed.classList.toggle('led-cranking', !!isCranking);
        }
    }

    // Отрисовка осциллограммы и спектра на Canvas
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

        // Спектр частот
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

        // Волна
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
        if (!ENGINES[key] || isStarting || isStopping) return;
        currentEngineKey = key;
        const engine = ENGINES[key];

        if (els.engineCards) {
            els.engineCards.forEach(c => {
                c.classList.toggle('active', c.getAttribute('data-engine') === key);
            });
        }

        if (els.engineTitle) els.engineTitle.textContent = engine.name;
        if (els.engineCar) els.engineCar.textContent = engine.car;
        if (els.engineDesc) els.engineDesc.textContent = engine.desc;

        if (isRunning) {
            stopEngine();
            setTimeout(startEngine, 950);
        }
    }

    function bindEvents() {
        if (els.btnPower) {
            els.btnPower.addEventListener('click', () => {
                if (isStarting || isStopping) return;
                if (isRunning) stopEngine();
                else startEngine();
            });
        }

        if (els.rpmSlider) {
            els.rpmSlider.addEventListener('mousedown', () => { els.rpmSliderMouseHold = true; });
            window.addEventListener('mouseup', () => { els.rpmSliderMouseHold = false; });
            els.rpmSlider.addEventListener('touchstart', () => { els.rpmSliderMouseHold = true; }, { passive: true });
            window.addEventListener('touchend', () => { els.rpmSliderMouseHold = false; }, { passive: true });
            window.addEventListener('touchcancel', () => { els.rpmSliderMouseHold = false; }, { passive: true });
            els.rpmSlider.addEventListener('input', (e) => {
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                targetRpm = parseFloat(e.target.value);
                currentRpm = targetRpm;
            });
        }

        // Педаль «Газ в пол» (полная поддержка iOS WebKit и Android Touch)
        if (els.btnGas) {
            const pressGas = (e) => {
                if (e.cancelable) e.preventDefault();
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                isGasPressed = true;
                els.btnGas.classList.add('gas-active');
            };
            const releaseGas = (e) => {
                if (e && e.cancelable) e.preventDefault();
                if (isStarting || isStopping) return;
                const wasHigh = currentRpm > 4200;
                isGasPressed = false;
                els.btnGas.classList.remove('gas-active');

                // Если мотор турбированный — триггерим flutter при сбросе газа
                const engine = ENGINES[currentEngineKey];
                if (wasHigh && engine.hasTurbo) {
                    setTimeout(triggerTurboFlutter, 80);
                } else if (wasHigh) {
                    setTimeout(triggerPopBang, 120);
                }
            };

            if (window.PointerEvent) {
                els.btnGas.addEventListener('pointerdown', pressGas);
                window.addEventListener('pointerup', releaseGas);
                window.addEventListener('pointercancel', releaseGas);
            } else {
                els.btnGas.addEventListener('mousedown', pressGas);
                window.addEventListener('mouseup', releaseGas);
                els.btnGas.addEventListener('touchstart', pressGas, { passive: false });
                window.addEventListener('touchend', releaseGas, { passive: false });
                window.addEventListener('touchcancel', releaseGas, { passive: false });
            }
            window.addEventListener('blur', releaseGas);
        }

        if (els.btnPop) {
            els.btnPop.addEventListener('click', () => {
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                triggerPopBang();
            });
        }

        if (els.btnShift) {
            els.btnShift.addEventListener('click', () => {
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                simulateGearShift();
            });
        }

        if (els.btnLaunch) {
            els.btnLaunch.addEventListener('click', () => {
                if (isStarting || isStopping) return;
                toggleLaunchControl();
            });
        }

        if (els.btnFlutter) {
            els.btnFlutter.addEventListener('click', () => {
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                triggerTurboFlutter();
            });
        }

        // Переключение режимов выхлопа
        if (els.exhaustBtns) {
            els.exhaustBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-exhaust');
                    setExhaustProfile(mode);
                });
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

        if (els.volumeSlider) {
            els.volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                if (mainOut && audioCtx) {
                    mainOut.gain.setValueAtTime(vol, audioCtx.currentTime);
                }
            });
        }

        // Горячие клавиши
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (isStarting || isStopping) return;
                if (!isRunning) startEngine();
                isGasPressed = true;
                if (els.btnGas) els.btnGas.classList.add('gas-active');
            } else if (e.code === 'KeyP') {
                if (isStarting || isStopping) return;
                triggerPopBang();
            } else if (e.code === 'KeyS') {
                if (isStarting || isStopping) return;
                simulateGearShift();
            } else if (e.code === 'KeyL') {
                if (isStarting || isStopping) return;
                toggleLaunchControl();
            } else if (e.code === 'KeyF') {
                if (isStarting || isStopping) return;
                triggerTurboFlutter();
            } else if (e.code === 'Escape') {
                if (isStarting || isStopping) return;
                stopEngine();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                if (isStarting || isStopping) return;
                const wasHigh = currentRpm > 4200;
                isGasPressed = false;
                if (els.btnGas) els.btnGas.classList.remove('gas-active');
                const engine = ENGINES[currentEngineKey];
                if (wasHigh && engine.hasTurbo) triggerTurboFlutter();
                else if (wasHigh) triggerPopBang();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initElements();
        bindEvents();
    });
})();
