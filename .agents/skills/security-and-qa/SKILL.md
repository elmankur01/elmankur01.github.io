---
name: security-and-qa
description: Enforce zero-leak security audits, secret scanning, XSS prevention, Content Security Policy (CSP) validation, 152-FZ privacy checks, and code syntax QA. Trigger when asked to "audit security", "check for vulnerabilities", "scan for secrets", "verify safety", or before any commit to ensure code quality.
metadata:
  author: AvtoTema Team
  version: "1.0.0"
---

# Security & QA Validator Skill

Mandatory quality and security protocol for all development, maintenance, and bug fixes on **АвтоТема**.

## Core Verification Protocols

### 1. Zero-Leak Secret Scanning
Never commit or expose tokens, API keys, or private credentials:
- Run scanning commands before every commit:
  ```bash
  grep -rnE "(ghp_[a-zA-Z0-9]+|bot[0-9]{8,}:[a-zA-Z0-9_-]+|AIza[0-9A-Za-z-_]{35})" --exclude="*.log" --exclude-dir=".git" .
  ```
- **Rules:**
  - Telegram bot tokens, GitHub personal access tokens, YouTube OAuth secrets, and Instagram tokens MUST ONLY be stored in GitHub Secrets for CI/CD or in the administrator's local browser `localStorage` (via the admin panel UI).
  - Never hardcode credentials into frontend HTML, client-side JS, or committed JSON files.

### 2. XSS & Code Injection Prevention
- **HTML Sanitization:**
  - All user inputs (comments, reviews) and dynamic strings inserted into HTML templates must pass through the `esc()` sanitization function.
  - Prefer `element.textContent` and `element.setAttribute()` over `innerHTML` when handling non-static strings.
- **Banned Functions:**
  - Absolute ban on `eval()`, `new Function()`, and `document.write()` in client-side code.
  - In Node.js build scripts, evaluate data literals only with sandboxed Node VMs (`vm.runInNewContext`) if necessary.

### 3. Content Security Policy (CSP) Compliance
Verify `<meta http-equiv="Content-Security-Policy">` on all pages:
- Must enforce `default-src 'self'`.
- Script origins strictly restricted to `'self'`, `'unsafe-inline'` where necessary, and authorized CDNs (e.g. `https://*.github.io`, `https://telegram.org`).
- External connections (`connect-src`) and images (`img-src`) restricted to `'self'` and trusted HTTPS domains.
- Objects forbidden (`object-src 'none'`), base-uri restricted (`base-uri 'self'`).

### 4. Privacy & Legal Compliance (152-FZ & 436-FZ)
- **152-ФЗ:** No unconsented personal data collection. No third-party ad trackers or spyware scripts. All analytics (likes, bookmarks, views) must operate client-side via anonymous `localStorage`/`sessionStorage`.
- **436-ФЗ:** Ensure the `0+` badge is visible in all footers.
- **External Links:** All links opening in new tabs (`target="_blank"`) must specify `rel="noopener noreferrer"` or `rel="noopener nofollow"`.

### 5. Automated Pre-Commit Syntax & Build Validation
Always run before committing:
```bash
node -c script.js && node -c footer.js && node -c ugc.js && node -c generate_articles.js
node generate_articles.js
```
Ensure zero syntax errors, zero broken script tags, and 100% build success.
