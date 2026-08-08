// ==========================================
// АвтоТема — веб-аналитика
// Яндекс.Метрика + Google Analytics (GA4)
// ЗАМЕНИТЕ ПЛЕЙСХОЛДЕРЫ на свои ID после создания счётчиков:
//   YM_COUNTER_ID — номер счётчика Яндекс.Метрики (только цифры)
//   GA4_ID — Measurement ID Google Analytics (формат G-XXXXXXXXXX)
//
// Аналитика загружается ТОЛЬКО после явного согласия пользователя
// (см. consent.js). Требование 152-ФЗ «О персональных данных».
// ==========================================

(function () {
    function loadAnalytics() {
        // ---------- Яндекс.Метрика ----------
        var YM_COUNTER_ID = '111426400';

        if (YM_COUNTER_ID !== '00000000') {
            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
                m[i].l = 1 * new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                    if (document.scripts[j].src === r) { return; }
                }
                k = e.createElement(t); a = e.getElementsByTagName(t)[0];
                k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(YM_COUNTER_ID, 'init', {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
            });
        }

        // ---------- Google Analytics (GA4) ----------
        var GA4_ID = 'G-XXXXXXXXXX'; // ← вставьте Measurement ID

        if (GA4_ID !== 'G-XXXXXXXXXX') {
            var script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function () { dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', GA4_ID);
        }
    }

    var consent = (window.AvtoTemaConsent && window.AvtoTemaConsent.get) ? window.AvtoTemaConsent.get() : null;
    if (consent === 'accepted') {
        loadAnalytics();
    } else if (consent === null) {
        // Согласие ещё не дано — ждём события от consent.js
        document.addEventListener('avtotema:consent', function (e) {
            if (e.detail === 'accepted') loadAnalytics();
        });
    }
})();
