// ==========================================
// АвтоТема — Полноэкранный просмотр фото (lightbox.js)
// ==========================================

(function () {
    let isOpen = false;

    function injectLightbox() {
        if (document.getElementById('siteLightboxBackdrop')) return;

        const html = `
        <div class="site-lightbox-backdrop" id="siteLightboxBackdrop" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" hidden>
            <div class="site-lightbox-wrapper">
                <button type="button" class="site-lightbox-close" id="siteLightboxClose" aria-label="Закрыть (ESC)">&times;</button>
                <div class="site-lightbox-img-box">
                    <img src="" alt="" class="site-lightbox-img" id="siteLightboxImg">
                </div>
                <div class="site-lightbox-caption" id="siteLightboxCaption"></div>
            </div>
        </div>`;

        const el = document.createElement('div');
        el.innerHTML = html;
        document.body.appendChild(el.firstElementChild);
    }

    function openLightbox(src, alt, credit) {
        injectLightbox();
        const backdrop = document.getElementById('siteLightboxBackdrop');
        const img = document.getElementById('siteLightboxImg');
        const caption = document.getElementById('siteLightboxCaption');
        if (!backdrop || !img) return;

        img.src = src;
        img.alt = alt || '';

        let captionText = alt || '';
        if (credit) {
            captionText += (captionText ? ' · <span class="lightbox-credit">' : '<span class="lightbox-credit">') + credit + '</span>';
        }
        if (caption) caption.innerHTML = captionText;

        backdrop.hidden = false;
        document.body.style.overflow = 'hidden';
        isOpen = true;
    }

    function closeLightbox() {
        const backdrop = document.getElementById('siteLightboxBackdrop');
        if (!backdrop) return;
        backdrop.hidden = true;
        document.body.style.overflow = '';
        isOpen = false;
        const img = document.getElementById('siteLightboxImg');
        if (img) img.src = '';
    }

    function init() {
        injectLightbox();

        // Клик по изображениям статей
        document.addEventListener('click', (e) => {
            const targetImg = e.target.closest('.article-hero img, .article-body img, .hero-slider-img-wrap img, .card-media img');
            if (targetImg && targetImg.src && !e.target.closest('.card-link')) {
                // Если клик не является переходом по ссылке карточки
                if (targetImg.closest('.article-hero, .article-body')) {
                    e.preventDefault();
                    const creditEl = document.querySelector('.hero-credit, .article-hero-credit');
                    const credit = creditEl ? creditEl.textContent.trim() : '';
                    openLightbox(targetImg.src, targetImg.alt, credit);
                    return;
                }
            }

            if (e.target.closest('#siteLightboxClose')) {
                closeLightbox();
                return;
            }

            const backdrop = document.getElementById('siteLightboxBackdrop');
            if (isOpen && (e.target === backdrop || e.target.closest('.site-lightbox-wrapper') === e.target)) {
                closeLightbox();
            }
        });

        // Клавиша Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeLightbox();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.SiteLightbox = { open: openLightbox, close: closeLightbox };
})();
