document.addEventListener('DOMContentLoaded', function () {
    const articleFullEl = document.querySelector('.article-full');
    if (!articleFullEl) return;

    // Определяем ID и категорию текущей статьи
    const path = window.location.pathname;
    const articleKey = path.split('/').pop().replace('.html', '');
    const tagEl = document.querySelector('.tag');
    const articleTag = tagEl ? tagEl.textContent.trim() : 'Новости';

    initUgcAccordions();
    initInArticlePoll(articleKey, articleTag);
    initOwnerReviews(articleKey);
    initArticleComments(articleKey);
});

// ── 0. Раскрытие блоков при нажатии (Аккордеон) ──
function initUgcAccordions() {
    const boxes = document.querySelectorAll('.ugc-collapsible-box');
    boxes.forEach(box => {
        const header = box.querySelector('.ugc-collapsible-header');
        const body = box.querySelector('.ugc-collapsible-body');
        if (!header || !body) return;

        header.addEventListener('click', function (e) {
            // Если кликнули не на отдельную кнопку внутри
            if (e.target.closest('.btn-add-review')) return;
            const isOpen = box.classList.toggle('open');
            header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            body.hidden = !isOpen;
        });
    });
}

// ── 1. Интерактивный опрос в статье ──
function initInArticlePoll(articleKey, tag) {
    const pollBox = document.getElementById('articlePollBox');
    if (!pollBox) return;

    // Подбираем опрос под категорию статьи или берём дефолтный
    let pollData = (typeof UGC_POLLS !== 'undefined' && UGC_POLLS[tag])
        ? UGC_POLLS[tag]
        : (typeof UGC_POLLS !== 'undefined' ? UGC_POLLS['Новости рынка'] : null);

    if (!pollData) return;

    const storageKey = 'avtotema_poll_' + articleKey;
    let savedVoteIdx = localStorage.getItem(storageKey);

    const questionEl = document.getElementById('pollQuestion');
    const optionsWrap = document.getElementById('pollOptionsList');
    const totalVotesEl = document.getElementById('pollTotalVotes');

    if (questionEl) questionEl.textContent = pollData.question;
    if (!optionsWrap) return;

    optionsWrap.innerHTML = '';
    let totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
    if (savedVoteIdx !== null) totalVotes += 1;

    pollData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'poll-option-btn';
        if (savedVoteIdx !== null && parseInt(savedVoteIdx, 10) === idx) {
            btn.classList.add('selected');
        }

        const count = opt.votes + (savedVoteIdx !== null && parseInt(savedVoteIdx, 10) === idx ? 1 : 0);
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

        btn.innerHTML = `
            <span class="poll-option-text">${opt.text}</span>
            <span class="poll-percent">${percent}%</span>
            <div class="poll-option-progress" style="width: ${savedVoteIdx !== null ? percent : 0}%"></div>
        `;

        if (savedVoteIdx !== null) {
            btn.disabled = true;
            pollBox.classList.add('poll-voted');
        }

        btn.addEventListener('click', function () {
            if (localStorage.getItem(storageKey) !== null) return;
            localStorage.setItem(storageKey, idx);
            initInArticlePoll(articleKey, tag);
        });

        optionsWrap.appendChild(btn);
    });

    if (totalVotesEl) {
        totalVotesEl.textContent = `Всего голосов: ${totalVotes.toLocaleString('ru-RU')}`;
    }
}

// ── 2. Отзывы реальных владельцев ──
function initOwnerReviews(articleKey) {
    const listWrap = document.getElementById('reviewsListWrap');
    const openModalBtn = document.getElementById('openReviewModalBtn');
    const modal = document.getElementById('reviewModalBackdrop');
    const closeModalBtn = document.getElementById('closeReviewModalBtn');
    const submitBtn = document.getElementById('submitReviewBtn');
    const starContainer = document.getElementById('starRatingSelect');

    if (!listWrap) return;

    const storageKey = 'avtotema_reviews_' + articleKey;
    let customReviews = [];
    try {
        customReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    const baseReviews = (typeof UGC_DEFAULT_REVIEWS !== 'undefined') ? UGC_DEFAULT_REVIEWS : [];
    const allReviews = [...customReviews, ...baseReviews];

    function renderReviews() {
        listWrap.innerHTML = '';
        if (allReviews.length === 0) {
            listWrap.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:0.84rem;padding:8px 0;">Пока нет отзывов. Нажмите «Оставить свой отзыв», чтобы поделиться опытом!</div>';
            return;
        }

        allReviews.forEach(r => {
            const card = document.createElement('div');
            card.className = 'review-item-card';

            const starsHtml = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            const avatarInitial = (r.author || 'А')[0].toUpperCase();

            card.innerHTML = `
                <div class="review-item-top">
                    <div class="review-author-info">
                        <div class="review-author-avatar">${avatarInitial}</div>
                        <div>
                            <div class="review-author-name">${r.author} ${r.city ? `(${r.city})` : ''}</div>
                            <div class="review-car-badge">🚗 ${r.car} · Пробег: ${r.mileage}</div>
                        </div>
                    </div>
                    <div class="review-stars" title="Оценка ${r.rating} из 5">${starsHtml}</div>
                </div>
                ${(r.pros || r.cons) ? `
                <div class="review-pros-cons-compact">
                    ${r.pros ? `<span class="review-pro">✅ <b>Плюсы:</b> ${r.pros}</span>` : ''}
                    ${r.cons ? `<span class="review-con">❌ <b>Минусы:</b> ${r.cons}</span>` : ''}
                </div>` : ''}
                <div class="review-text-content">${r.text}</div>
            `;
            listWrap.appendChild(card);
        });
    }

    renderReviews();

    // Модальное окно
    let selectedRating = 5;
    if (starContainer) {
        starContainer.querySelectorAll('span').forEach(s => {
            s.addEventListener('click', function () {
                selectedRating = parseInt(this.getAttribute('data-val') || '5', 10);
                starContainer.querySelectorAll('span').forEach(star => {
                    const val = parseInt(star.getAttribute('data-val'), 10);
                    star.textContent = val <= selectedRating ? '★' : '☆';
                });
            });
        });
    }

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => modal.classList.add('open'));
    }
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('open');
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const name = document.getElementById('revAuthorInput')?.value.trim();
            const car = document.getElementById('revCarInput')?.value.trim();
            const mileage = document.getElementById('revMileageInput')?.value.trim() || '—';
            const pros = document.getElementById('revProsInput')?.value.trim();
            const cons = document.getElementById('revConsInput')?.value.trim();
            const text = document.getElementById('revTextInput')?.value.trim();

            if (!name || !car || !text) {
                alert('Пожалуйста, укажите имя, модель авто и текст вашего отзыва!');
                return;
            }

            const newReview = {
                author: name,
                city: 'Россия',
                car: car,
                rating: selectedRating,
                mileage: mileage,
                pros: pros,
                cons: cons,
                text: text
            };

            customReviews.unshift(newReview);
            try {
                localStorage.setItem(storageKey, JSON.stringify(customReviews));
            } catch (e) {}

            allReviews.unshift(newReview);
            renderReviews();
            if (modal) modal.classList.remove('open');

            const revBox = document.getElementById('articleReviewsBox');
            if (revBox) {
                revBox.classList.add('open');
                const head = revBox.querySelector('.ugc-collapsible-header');
                const body = revBox.querySelector('.ugc-collapsible-body');
                if (head) head.setAttribute('aria-expanded', 'true');
                if (body) body.hidden = false;
            }

            // Очистка полей
            if (document.getElementById('revAuthorInput')) document.getElementById('revAuthorInput').value = '';
            if (document.getElementById('revCarInput')) document.getElementById('revCarInput').value = '';
            if (document.getElementById('revProsInput')) document.getElementById('revProsInput').value = '';
            if (document.getElementById('revConsInput')) document.getElementById('revConsInput').value = '';
            if (document.getElementById('revTextInput')) document.getElementById('revTextInput').value = '';
        });
    }
}

// ── 3. Комментарии и обсуждения автолюбителей ──
function initArticleComments(articleKey) {
    const listWrap = document.getElementById('commentsListWrap');
    const sendBtn = document.getElementById('sendCommentBtn');
    const countBadge = document.getElementById('commentsCountBadge');

    if (!listWrap) return;

    const storageKey = 'avtotema_comments_' + articleKey;
    let customComments = [];
    try {
        customComments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    const baseComments = (typeof UGC_DEFAULT_COMMENTS !== 'undefined') ? UGC_DEFAULT_COMMENTS : [];
    const allComments = [...customComments, ...baseComments];

    function renderComments() {
        listWrap.innerHTML = '';
        if (countBadge) countBadge.textContent = allComments.length;

        if (allComments.length === 0) {
            listWrap.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:0.84rem;padding:8px 0;">Пока нет комментариев. Напишите первый комментарий выше!</div>';
            return;
        }

        allComments.forEach((c, idx) => {
            const card = document.createElement('div');
            card.className = 'comment-card';

            const likedKey = 'avtotema_com_liked_' + articleKey + '_' + idx;
            const isLiked = localStorage.getItem(likedKey) === '1';

            card.innerHTML = `
                <div class="comment-card-top">
                    <div>
                        <b>${c.author}</b>
                        ${c.badge ? `<span class="comment-author-badge">${c.badge}</span>` : ''}
                    </div>
                    <span class="comment-date-text">${c.date || 'Только что'}</span>
                </div>
                <div class="comment-body-text">${c.text}</div>
                <div class="comment-card-actions">
                    <button type="button" class="comment-like-btn ${isLiked ? 'liked' : ''}" data-idx="${idx}">
                        👍 <span>${c.likes || 0}</span>
                    </button>
                </div>
            `;

            const likeBtn = card.querySelector('.comment-like-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', function () {
                    const currentLiked = localStorage.getItem(likedKey) === '1';
                    if (!currentLiked) {
                        localStorage.setItem(likedKey, '1');
                        c.likes = (c.likes || 0) + 1;
                        this.classList.add('liked');
                    } else {
                        localStorage.removeItem(likedKey);
                        c.likes = Math.max(0, (c.likes || 0) - 1);
                        this.classList.remove('liked');
                    }
                    this.querySelector('span').textContent = c.likes;
                });
            }

            listWrap.appendChild(card);
        });
    }

    renderComments();

    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            const nameInput = document.getElementById('commentAuthorInput');
            const roleInput = document.getElementById('commentRoleInput');
            const textInput = document.getElementById('commentTextInput');

            const name = nameInput ? nameInput.value.trim() : '';
            const role = roleInput ? roleInput.value.trim() : '';
            const text = textInput ? textInput.value.trim() : '';

            if (!name || !text) {
                alert('Пожалуйста, введите ваше имя и текст комментария!');
                return;
            }

            const newComment = {
                author: name,
                badge: role || 'Автолюбитель',
                date: 'Только что',
                likes: 0,
                text: text
            };

            customComments.unshift(newComment);
            try {
                localStorage.setItem(storageKey, JSON.stringify(customComments));
            } catch (e) {}

            allComments.unshift(newComment);
            renderComments();

            if (textInput) textInput.value = '';
        });
    }
}
