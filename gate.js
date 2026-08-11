// ==========================================
// АвтоТема — защита служебных страниц (/admin.html, /stats.html)
// Парольная заглушка на стороне клиента: страница скрыта до ввода пароля.
// Пароль хранится НЕ в открытом виде, а как SHA-256 хэш (константа HASH).
// ВАЖНО: это защита от случайных посетителей, а не от тех, кто умеет читать
// исходный код. Для реальной защиты нужен серверный доступ (GitHub Pages его не даёт).
// Сменить пароль: подставьте хэш нового пароля в HASH.
// ==========================================
(function () {
    var HASH = '2d210ba9a138dc1d43845fe8a35130dc46db92e54a8b1db5b6681f8916332790';
    var KEY = 'at_admin_auth';
    var TOKEN = 'granted';

    var hideStyle = document.createElement('style');
    hideStyle.textContent = 'html,body{visibility:hidden!important;}';
    document.head.appendChild(hideStyle);

    function sha256hex(str) {
        var data = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-256', data).then(function (buf) {
            var arr = new Uint8Array(buf);
            var hex = '';
            for (var i = 0; i < arr.length; i++) hex += ('0' + arr[i].toString(16)).slice(-2);
            return hex;
        });
    }

    function isAuthed() {
        try { return sessionStorage.getItem(KEY) === TOKEN; } catch (e) { return false; }
    }

    function buildGate() {
        var overlay = document.createElement('div');
        overlay.id = 'atGate';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0d1117;display:flex;align-items:center;justify-content:center;';
        var box = document.createElement('div');
        box.style.cssText = 'background:#151b23;border:1px solid #262e3a;border-radius:12px;padding:28px 32px;max-width:340px;width:calc(100% - 40px);text-align:center;';
        box.innerHTML =
            '<div style="font-size:26px;margin-bottom:8px;">🔒</div>' +
            '<h2 style="margin:0 0 4px;color:#fff;font-size:18px;">Служебная страница</h2>' +
            '<p style="margin:0 0 18px;color:#8b95a3;font-size:13px;">Введите пароль для доступа</p>' +
            '<input type="password" id="atGatePass" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid #262e3a;background:#0d1218;color:#fff;font-size:14px;margin-bottom:10px;">' +
            '<button type="button" id="atGateBtn" style="width:100%;padding:10px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">Войти</button>' +
            '<p id="atGateErr" style="margin:10px 0 0;color:#f87171;font-size:12px;display:none;">Неверный пароль</p>';
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        var input = document.getElementById('atGatePass');
        var btn = document.getElementById('atGateBtn');
        var err = document.getElementById('atGateErr');

        function tryLogin() {
            var v = input.value;
            if (!v) return;
            sha256hex(v).then(function (h) {
                if (h === HASH) {
                    try { sessionStorage.setItem(KEY, TOKEN); } catch (e) {}
                    location.reload();
                } else {
                    err.style.display = 'block';
                    input.value = '';
                    input.focus();
                }
            }).catch(function () {
                err.textContent = 'Хэширование недоступно (нужен HTTPS)';
                err.style.display = 'block';
            });
        }

        btn.addEventListener('click', tryLogin);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });
        input.focus();
    }

    function init() {
        if (isAuthed()) { hideStyle.remove(); return; }
        buildGate();
        hideStyle.remove();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
