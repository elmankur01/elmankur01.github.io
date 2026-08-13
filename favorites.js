// ===== Модуль «Избранное / Закладки» для АвтоТема =====
const FAV_KEY = 'avtotema_favorites';

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveFavorites(list) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(list));
    } catch (e) {}
    updateFavUI();
}

function toggleFavorite(id) {
    const numId = parseInt(id, 10);
    if (!numId) return false;
    let favs = getFavorites();
    if (favs.includes(numId)) {
        favs = favs.filter(x => x !== numId);
    } else {
        favs.push(numId);
    }
    saveFavorites(favs);
    return favs.includes(numId);
}

function updateFavUI() {
    const favs = getFavorites();
    
    // Счетчики в шапке
    document.querySelectorAll('.fav-count').forEach(el => {
        el.textContent = favs.length;
        el.hidden = favs.length === 0;
    });

    // Иконки на карточках
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id, 10);
        if (favs.includes(id)) {
            btn.classList.add('active');
            btn.title = 'В закладках (нажмите, чтобы убрать)';
        } else {
            btn.classList.remove('active');
            btn.title = 'Сохранить в избранное';
        }
    });

    renderFavoritesModalContent();
}

function renderFavoritesModalContent() {
    const listEl = document.getElementById('favModalList');
    if (!listEl) return;
    const favs = getFavorites();

    if (favs.length === 0) {
        listEl.innerHTML = `
            <div class="fav-empty-state">
                <span class="fav-empty-icon">⭐</span>
                <h4>У вас пока нет сохранённых статей</h4>
                <p>Нажмите на значок закладки на любой статье, чтобы добавить её сюда и прочитать позже.</p>
            </div>`;
        return;
    }

    if (typeof ARTICLE_BANK === 'undefined') return;

    listEl.innerHTML = favs.map(id => {
        const idx = id - 1;
        const a = ARTICLE_BANK[idx];
        if (!a) return '';
        const slug = (typeof SLUGS !== 'undefined' && SLUGS[id]) ? SLUGS[id] : 'article-' + id;
        const img = (typeof IMAGES !== 'undefined' && IMAGES[id]) ? IMAGES[id] : null;
        const media = (img && img.url)
            ? `<div class="fav-item-media"><img src="${img.url}" alt="${img.alt || a.title}"></div>`
            : '';

        return `
            <div class="fav-item-card">
                ${media}
                <div class="fav-item-info">
                    <span class="fav-item-tag">${a.tag}</span>
                    <a href="/articles/${slug}.html" class="fav-item-title">${a.title}</a>
                    <span class="fav-item-meta">${a.readTime} мин</span>
                </div>
                <button type="button" class="fav-item-remove" onclick="toggleFavorite(${id})" title="Удалить из закладок">&times;</button>
            </div>`;
    }).join('');
}

function initFavorites() {
    // Открытие/закрытие модального окна
    const modal = document.getElementById('favoritesModal');
    const openBtns = document.querySelectorAll('.fav-modal-open');
    const closeBtns = document.querySelectorAll('.fav-modal-close');
    const clearBtn = document.getElementById('clearAllFavsBtn');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                renderFavoritesModalContent();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Очистить все сохранённые статьи?')) {
                saveFavorites([]);
            }
        });
    }

    // Делегирование кликов по кнопкам закладок
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.bookmark-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            if (id) {
                toggleFavorite(id);
            }
        }
    });

    updateFavUI();
}

document.addEventListener('DOMContentLoaded', initFavorites);
