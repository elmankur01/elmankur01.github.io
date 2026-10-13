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
                <button type="button" class="fav-item-remove" data-remove-id="${id}" title="Удалить из закладок">&times;</button>
            </div>`;
    }).join('');
}

function ensureFavoritesModal() {
    let modal = document.getElementById('favoritesModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'favorites-modal';
        modal.id = 'favoritesModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'favModalTitle');
        modal.innerHTML = `
            <div class="fav-modal-dialog">
                <div class="fav-modal-header">
                    <h3 id="favModalTitle">⭐ Избранные статьи</h3>
                    <button type="button" class="fav-modal-close" aria-label="Закрыть">&times;</button>
                </div>
                <div class="fav-modal-body" id="favModalList"></div>
                <div class="fav-modal-footer">
                    <button type="button" class="btn btn-ghost" id="clearAllFavsBtn">Очистить всё</button>
                    <button type="button" class="btn btn-primary fav-modal-close">Готово</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }
    return modal;
}

function initFavorites() {
    if (window.__favoritesInitialized) return;
    window.__favoritesInitialized = true;

    // Глобальное делегирование кликов для модального окна и кнопок избранного
    document.addEventListener('click', (e) => {
        // Открытие модалки избранного
        const openBtn = e.target.closest('.fav-modal-open');
        if (openBtn) {
            e.preventDefault();
            const modal = ensureFavoritesModal();
            renderFavoritesModalContent();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }

        // Закрытие модалки
        const closeBtn = e.target.closest('.fav-modal-close');
        if (closeBtn) {
            e.preventDefault();
            const modal = document.getElementById('favoritesModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            return;
        }

        // Клик по оверлею (вне диалога)
        const modal = document.getElementById('favoritesModal');
        if (modal && e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            return;
        }

        // Очистить все закладки
        if (e.target.closest('#clearAllFavsBtn')) {
            e.preventDefault();
            if (confirm('Очистить все сохранённые статьи?')) {
                saveFavorites([]);
            }
            return;
        }

        // Удаление одной статьи из списка
        const removeBtn = e.target.closest('[data-remove-id]');
        if (removeBtn) {
            e.preventDefault();
            const id = parseInt(removeBtn.dataset.removeId, 10);
            if (id) toggleFavorite(id);
            return;
        }

        // Клик по кнопке закладки на карточке или странице статьи
        const btn = e.target.closest('.bookmark-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            if (id) {
                toggleFavorite(id);
            }
            return;
        }
    });

    // Закрытие модалки по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('favoritesModal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    updateFavUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavorites);
} else {
    initFavorites();
}
