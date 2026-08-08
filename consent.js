// ==========================================
// АвтоТема — согласие на cookie и веб-аналитику
// Показывает баннер о cookie; Яндекс.Метрика и Google Analytics
// загружаются ТОЛЬКО после явного согласия пользователя (152-ФЗ).
// Хранится в localStorage: ap_cookie_consent = 'accepted' | 'declined'
// ==========================================
(function () {
    var KEY = 'ap_cookie_consent';
    var state = null;
    try { state = localStorage.getItem(KEY); } catch (e) {}

    window.AvtoTemaConsent = {
        get: function () { return state; },
        isAccepted: function () { return state === 'accepted'; }
    };

    function persist(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
        state = v;
        notify();
        hideBanner();
    }

    function notify() {
        var evt = new CustomEvent('avtotema:consent', { detail: state });
        document.dispatchEvent(evt);
    }

    function hideBanner() {
        var b = document.getElementById('consentBanner');
        if (b) b.classList.remove('show');
    }

    function showBanner() {
        if (state === 'accepted' || state === 'declined') return;
        if (!document.getElementById('consentBanner')) {
            var banner = document.createElement('div');
            banner.id = 'consentBanner';
            banner.className = 'consent-banner';
            banner.innerHTML =
                '<p>Мы используем файлы cookie и сервисы аналитики (Яндекс.Метрика, Google Analytics) для улучшения работы сайта. ' +
                '<a href="/privacy.html">Подробнее в Политике конфиденциальности</a>.</p>' +
                '<div class="consent-actions">' +
                '<button type="button" class="btn btn-primary" data-consent="accepted">Принять</button>' +
                '<button type="button" class="btn btn-ghost" data-consent="declined">Отклонить</button>' +
                '</div>';
            document.body.appendChild(banner);
            banner.querySelectorAll('[data-consent]').forEach(function (btn) {
                btn.addEventListener('click', function () { persist(btn.getAttribute('data-consent')); });
            });
        }
        setTimeout(function () {
            var b = document.getElementById('consentBanner');
            if (b) b.classList.add('show');
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();
