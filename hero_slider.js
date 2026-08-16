// ==========================================
// АвтоТема — слайдер «Главные премьеры и тренды» в Hero
// ==========================================
(function () {
    const SLIDES_DATA = [
        {
            id: 70,
            tag: 'Электромобили',
            icon: '⚡',
            title: 'Kia EV3: доступный электрокроссовер с запасом хода до 516 км',
            desc: 'Корейский компактный электрокроссовер поступил в продажу: батарея 81.4 кВт·ч, быстрая зарядка до 80% за 31 минуту и рекордный запас хода в доступном сегменте.',
            readTime: '6 мин',
            slug: 'kia-ev3-dostupnyy-elektrokrossover-s-zapasom-khoda-do-516-km',
            image: '/images/art-70.jpg'
        },
        {
            id: 26,
            tag: 'Новые модели',
            icon: '🚗',
            title: 'Changan CS75 Plus AWD: локализация и полный привод',
            desc: 'Популярный кроссовер получил долгожданную систему полного привода, адаптированную для российских зимних дорог и локализованную сборку.',
            readTime: '5 мин',
            slug: 'changan-cs75-plus-awd-lokalizatsiya-i-polnyy-privod',
            image: '/images/art-26.jpg'
        },
        {
            id: 25,
            tag: 'Электромобили',
            icon: '⚡',
            title: 'Zeekr, BMW и гонка за 900-вольтовые платформы',
            desc: 'Новое поколение электромобилей переходит на архитектуру 800V и 900V: зарядка на 300 км пробега теперь занимает меньше 10 минут.',
            readTime: '6 мин',
            slug: 'zeekr-bmw-i-gonka-za-900-voltovye-platformy',
            image: '/images/art-25.jpg'
        },
        {
            id: 53,
            tag: 'Новые модели',
            icon: '🚗',
            title: 'Лада Vesta 2026: что изменилось в главной модели АвтоВАЗа',
            desc: 'Автоматическая трансмиссия, обновлённая электроника, расширенный зимний пакет опций и система стабилизации ESC нового поколения.',
            readTime: '4 мин',
            slug: 'lada-vesta-2026-chto-izmenilos-v-glavnoy-modeli-avtovaza',
            image: '/images/art-53.jpg'
        },
        {
            id: 24,
            tag: 'Новые модели',
            icon: '🚗',
            title: 'ESTEO V27: гибридный флагман на 456 л.с. за 5,75 млн рублей',
            desc: 'Премиальный полноразмерный гибридный внедорожник с комбинированным запасом хода свыше 1200 км и разгоном до 100 км/ч за 4.8 секунды.',
            readTime: '6 мин',
            slug: 'esteo-v27-gibrid-na-456-l-s-za-5-75-mln-rubley',
            image: '/images/art-24.jpg'
        }
    ];

    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTOPLAY_DELAY = 6000;

    function renderSlider() {
        const sliderContainer = document.getElementById('heroSliderTrack');
        const dotsContainer = document.getElementById('heroSliderDots');
        if (!sliderContainer) return;

        sliderContainer.innerHTML = SLIDES_DATA.map((slide, idx) => {
            return `
            <div class="hero-slide${idx === 0 ? ' active' : ''}" data-index="${idx}">
                <div class="hero-slide-content">
                    <div class="hero-slide-badge">
                        <span>${slide.icon} ${slide.tag.toUpperCase()}</span>
                        <span class="hero-slide-time">⏱ ${slide.readTime}</span>
                    </div>
                    <h2 class="hero-slide-title">
                        <a href="/articles/${slide.slug}.html">${slide.title}</a>
                    </h2>
                    <p class="hero-slide-desc">${slide.desc}</p>
                    <div class="hero-slide-actions">
                        <a href="/articles/${slide.slug}.html" class="btn btn-primary hero-slide-btn">
                            Читать полный обзор ↗
                        </a>
                        <button type="button" class="bookmark-btn card-bookmark-btn hero-slide-fav" data-id="${slide.id}" title="В закладки" aria-label="В закладки">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="hero-slide-media">
                    <a href="/articles/${slide.slug}.html" class="hero-slide-media-link" tabindex="-1">
                        <img src="${slide.image}" alt="${slide.title}" class="hero-slide-img" loading="eager" width="800" height="450">
                        <div class="hero-slide-overlay"></div>
                    </a>
                </div>
            </div>`;
        }).join('');

        if (dotsContainer) {
            dotsContainer.innerHTML = SLIDES_DATA.map((_, idx) => {
                return `<button type="button" class="hero-dot${idx === 0 ? ' active' : ''}" data-dot-index="${idx}" aria-label="Слайд ${idx + 1}"></button>`;
            }).join('');
        }

        if (typeof updateFavUI === 'function') updateFavUI();
        startAutoPlay();
    }

    function goToSlide(index) {
        if (index < 0) index = SLIDES_DATA.length - 1;
        if (index >= SLIDES_DATA.length) index = 0;
        currentIndex = index;

        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');

        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function initSliderControls() {
        const nextBtn = document.getElementById('heroSliderNext');
        const prevBtn = document.getElementById('heroSliderPrev');
        const dotsContainer = document.getElementById('heroSliderDots');
        const sliderWrapper = document.querySelector('.hero-slider-box');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                const dot = e.target.closest('.hero-dot');
                if (dot) {
                    const idx = parseInt(dot.dataset.dotIndex, 10);
                    if (!isNaN(idx)) {
                        goToSlide(idx);
                        startAutoPlay();
                    }
                }
            });
        }

        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
            sliderWrapper.addEventListener('mouseleave', startAutoPlay);

            // Поддержка свайпов на смартфонах
            let touchStartX = 0;
            let touchEndX = 0;
            sliderWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });

            sliderWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 45) {
                    nextSlide();
                } else if (touchEndX - touchStartX > 45) {
                    prevSlide();
                }
                startAutoPlay();
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderSlider();
            initSliderControls();
        });
    } else {
        renderSlider();
        initSliderControls();
    }
})();
