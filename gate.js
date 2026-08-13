// ==========================================
// АвтоТема — защита служебных страниц (админка/статистика, секретные URL)
// ==========================================
(function () {
    var HASH = '06cd11db1c857b78e7519435ef7b1e85a0e189edfb78f267a3d4e478726e5038';
    var KEY = 'at_admin_auth';
    var TOKEN = 'granted';

    var hideStyle = document.createElement('style');
    hideStyle.textContent = 'html,body{visibility:hidden!important;}';
    document.head.appendChild(hideStyle);

    function sha256hex(str) {
        if (!window.crypto || !window.crypto.subtle) {
            return Promise.resolve('');
        }
        var data = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-256', data).then(function (buf) {
            var arr = new Uint8Array(buf);
            var hex = '';
            for (var i = 0; i < arr.length; i++) hex += ('0' + arr[i].toString(16)).slice(-2);
            return hex;
        }).catch(function () { return ''; });
    }

    function isAuthed() {
        try { return sessionStorage.getItem(KEY) === TOKEN; } catch (e) { return false; }
    }

    function buildGate() {
        var overlay = document.createElement('div');
        overlay.id = 'atGate';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0d1117;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;';
        var box = document.createElement('div');
        box.style.cssText = 'background:#151b23;border:1px solid #262e3a;border-radius:12px;padding:28px 32px;max-width:340px;width:calc(100% - 40px);text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.5);';
        box.innerHTML =
            '<div style="font-size:32px;margin-bottom:10px;">🔒</div>' +
            '<h2 style="margin:0 0 6px;color:#fff;font-size:18px;font-weight:700;">Служебная страница</h2>' +
            '<p style="margin:0 0 18px;color:#8b95a3;font-size:13px;">Введите пароль для доступа к панели</p>' +
            '<div style="position:relative;margin-bottom:12px;">' +
                '<input type="password" id="atGatePass" placeholder="Пароль" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:11px 40px 11px 12px;border-radius:8px;border:1px solid #262e3a;background:#0d1218;color:#fff;font-size:14px;outline:none;">' +
                '<button type="button" id="atGateEye" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:#8b95a3;cursor:pointer;font-size:16px;padding:4px;">👁️</button>' +
            '</div>' +
            '<button type="button" id="atGateBtn" style="width:100%;padding:11px;border-radius:8px;border:none;background:#e61a27;color:#fff;font-size:14px;font-weight:700;cursor:pointer;transition:background 0.2s;">Войти</button>' +
            '<p id="atGateErr" style="margin:12px 0 0;color:#f87171;font-size:13px;display:none;font-weight:500;">❌ Неверный пароль</p>';
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        var input = document.getElementById('atGatePass');
        var btn = document.getElementById('atGateBtn');
        var eye = document.getElementById('atGateEye');
        var err = document.getElementById('atGateErr');

        if (eye) {
            eye.addEventListener('click', function () {
                input.type = input.type === 'password' ? 'text' : 'password';
            });
        }

        function unlock() {
            try { sessionStorage.setItem(KEY, TOKEN); } catch (e) {}
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            if (hideStyle && hideStyle.parentNode) {
                hideStyle.parentNode.removeChild(hideStyle);
            }
        }

        function tryLogin() {
            var v = (input.value || '').trim();
            if (!v) return;

            // Прямая проверка + sha256
            if (v === 'avtotema2026' || v.toLowerCase() === 'avtotema2026') {
                unlock();
                return;
            }

            sha256hex(v).then(function (h) {
                if (h === HASH) {
                    unlock();
                } else {
                    err.style.display = 'block';
                    input.value = '';
                    input.focus();
                }
            }).catch(function () {
                if (v === 'avtotema2026') {
                    unlock();
                } else {
                    err.style.display = 'block';
                }
            });
        }

        btn.addEventListener('click', tryLogin);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });
        setTimeout(function () { input.focus(); }, 50);
    }

    function init() {
        if (isAuthed()) {
            if (hideStyle && hideStyle.parentNode) hideStyle.parentNode.removeChild(hideStyle);
            return;
        }
        buildGate();
        if (hideStyle && hideStyle.parentNode) hideStyle.parentNode.removeChild(hideStyle);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
