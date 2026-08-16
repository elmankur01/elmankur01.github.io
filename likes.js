// ==========================================
// АвтоТема — модуль лайков и реакций (анонимно, без сбора ПД)
// ==========================================
(function () {
    const LIKED_KEY_PREFIX = 'avtotema_liked_';
    const LIKES_BONUS_KEY = 'avtotema_likes_bonus';

    // Реальный счётчик лайков (начинается с 0 без искусственной накрутки)
    function getBaseLikes(id) {
        return 0;
    }

    function getBonusLikes() {
        try {
            return JSON.parse(localStorage.getItem(LIKES_BONUS_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveBonusLikes(map) {
        try {
            localStorage.setItem(LIKES_BONUS_KEY, JSON.stringify(map));
        } catch (e) {}
    }

    function isLiked(id) {
        try {
            return localStorage.getItem(LIKED_KEY_PREFIX + id) === 'true';
        } catch (e) {
            return false;
        }
    }

    function setLikedState(id, liked) {
        try {
            if (liked) {
                localStorage.setItem(LIKED_KEY_PREFIX + id, 'true');
            } else {
                localStorage.removeItem(LIKED_KEY_PREFIX + id);
            }
        } catch (e) {}
    }

    function getArticleLikes(id) {
        const base = getBaseLikes(id);
        const bonusMap = getBonusLikes();
        const bonus = bonusMap[id] || 0;
        return base + bonus;
    }

    function toggleLike(id, btnElement) {
        const numId = parseInt(id, 10);
        if (!numId) return;

        const liked = isLiked(numId);
        const bonusMap = getBonusLikes();
        const currentBonus = bonusMap[numId] || 0;

        let newCount;
        if (liked) {
            // Снять лайк
            setLikedState(numId, false);
            bonusMap[numId] = Math.max(0, currentBonus - 1);
            newCount = getBaseLikes(numId) + bonusMap[numId];
        } else {
            // Поставить лайк
            setLikedState(numId, true);
            bonusMap[numId] = currentBonus + 1;
            newCount = getBaseLikes(numId) + bonusMap[numId];
            spawnHeartParticle(btnElement);
        }

        saveBonusLikes(bonusMap);
        updateAllLikeElements(numId, !liked, newCount);
    }

    function spawnHeartParticle(btn) {
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.className = 'like-particle';
        particle.textContent = '❤️ +1';
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + window.scrollY - 10) + 'px';
        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 900);
    }

    function updateAllLikeElements(id, liked, count) {
        // Обновление кнопок в карточках
        document.querySelectorAll(`.card-like-btn[data-id="${id}"]`).forEach(btn => {
            if (liked) {
                btn.classList.add('liked');
                btn.title = 'Вам понравилось (нажмите, чтобы отменить)';
            } else {
                btn.classList.remove('liked');
                btn.title = 'Поставить лайк';
            }
            const countSpan = btn.querySelector(`.card-like-count[data-like-id="${id}"]`);
            if (countSpan) countSpan.textContent = count;
        });

        // Обновление кнопки на странице статьи
        const articleBtn = document.getElementById('articleLikeBtn');
        if (articleBtn && parseInt(articleBtn.dataset.id, 10) === id) {
            if (liked) {
                articleBtn.classList.add('liked');
            } else {
                articleBtn.classList.remove('liked');
            }
            const countEl = document.getElementById('articleLikeCount');
            if (countEl) countEl.textContent = count;
        }
    }

    function initLikes() {
        // Инициализация кнопок в карточках
        document.querySelectorAll('.card-like-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id, 10);
            if (!id) return;
            const liked = isLiked(id);
            const count = getArticleLikes(id);
            if (liked) btn.classList.add('liked');
            const countSpan = btn.querySelector(`.card-like-count[data-like-id="${id}"]`);
            if (countSpan) countSpan.textContent = count;
        });

        // Инициализация кнопки на странице статьи
        const articleBtn = document.getElementById('articleLikeBtn');
        if (articleBtn) {
            const id = parseInt(articleBtn.dataset.id, 10);
            if (id) {
                const liked = isLiked(id);
                const count = getArticleLikes(id);
                if (liked) articleBtn.classList.add('liked');
                const countEl = document.getElementById('articleLikeCount');
                if (countEl) countEl.textContent = count;
            }
        }
    }

    // Делегирование событий клика
    document.addEventListener('click', function (e) {
        const cardBtn = e.target.closest('.card-like-btn');
        if (cardBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(cardBtn.dataset.id, 10);
            if (id) toggleLike(id, cardBtn);
            return;
        }

        const articleBtn = e.target.closest('#articleLikeBtn');
        if (articleBtn) {
            e.preventDefault();
            const id = parseInt(articleBtn.dataset.id, 10);
            if (id) toggleLike(id, articleBtn);
            return;
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLikes);
    } else {
        initLikes();
    }

    window.initLikes = initLikes;
    window.getArticleLikes = getArticleLikes;
})();
