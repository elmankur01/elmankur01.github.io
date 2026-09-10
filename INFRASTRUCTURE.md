# Инфраструктура и устройство проекта «АвтоТема»
_Обновлено: 24.08.2026_

## 🏗️ Где всё зарегистрировано

| Сервис | Что там | Стоимость |
|---|---|---|
| **GitHub** (`elmankur01`) | Аккаунт + публичный репозиторий `elmankur01.github.io` — тут лежит весь код сайта | Бесплатно |
| **GitHub Pages** | Хостинг сайта (статика) | Бесплатно |
| **Регистратор домена** | Домен `avtotema-news.online` (привязан через файл `CNAME` + DNS-записи A/AAAA к серверам GitHub Pages) | Единственный реальный расход: ~700–1200 ₽/год |
| **Telegram @BotFather** | Бот `@avtotema_news` (токен вида `123456:AA...`) + одноимённый канал | Бесплатно |
| **Google Search Console** | Верификация владения — файл `google70a162b366d85b3b.html` | Бесплатно |
| **Яндекс.Вебмастер** | Верификация — файлы `yandex_*.html` | Бесплатно |

## 🔗 Куда привязан сайт

Домен → DNS → GitHub Pages → репозиторий `main` → папка проекта = корень сайта.
Работают оба адреса:
- Основной: **https://avtotema-news.online/**
- Резервный: **https://elmankur01.github.io/**

## 📡 Откуда берёт информацию

Скрипт `.github/workflows/fetch_news.js` читает RSS-ленты:

**Англоязычные** (автопереводятся на русский через `translate.googleapis.com`, эндпоинт `client=gtx` — без API-ключей):
- Motor1 Global — `https://www.motor1.com/rss/news/all/`
- CarScoops — `https://www.carscoops.com/feed/`
- Electrek — `https://electrek.co/feed/`
- InsideEVs — `https://insideevs.com/rss/news/all/`
- Autocar UK — `https://www.autocar.co.uk/rss`
- Car and Driver — `https://www.caranddriver.com/rss/all.xml`

**Русскоязычные** (без перевода):
- Motor.ru — `https://motor.ru/rss/news`
- Quto.ru — `https://quto.ru/rss/news`
- Авто Mail.ru — `https://auto.mail.ru/rss/`

Картинки статей хранятся локально в папке `images/`.

## 🔑 Где расходуются токены

### 1. `TELEGRAM_BOT_TOKEN`
- Хранится в **Settings → Secrets and variables → Actions** репозитория (в коде не светится, подставляется через `${{ secrets.TELEGRAM_BOT_TOKEN }}`).
- Используется воркфлоу: `daily_post.yml`, `publish_daily.js`, `publish_battle.js`, `publish_tips.js`, `publish_weekly.js`, `publish_category.js`, `health_check.js` — вызовы `api.telegram.org/sendPhoto / sendMessage / sendPoll`.
- Также используется в админке (`admin.js`) при ручной отправке постов из браузера владельца.
- **Траты:** 0 ₽ — Bot API бесплатное. Лимиты Telegram (~20 постов/мин в один канал) не достигаются: 4–5 постов в день.

### 2. Минуты GitHub Actions
- Репозиторий публичный → минуты безлимитны и бесплатны.
- ~10 воркфлоу тратят суммарно ~30–60 минут/день → 0 ₽.

### 3. Трафик GitHub Pages
- Лимит ~100 ГБ/мес — используется малая доля → 0 ₽.

## ⏰ Расписание автоматизаций (GitHub Actions)

| Воркфлоу | Что делает | Расписание |
|---|---|---|
| `auto_news.yml` | Сбор мировых новостей → перевод → статьи на сайте + sitemap | 07:00 и 15:00 UTC |
| `daily_post.yml` | Публикация постов в Telegram-канал | каждые 6 часов |
| `daily_battle_post.yml` | Посты рубрики «Баттлы» | своё расписание |
| `daily_market_post.yml` | Посты рубрики «Рынок» | своё расписание |
| `daily_tips_post.yml` | Лайфхаки для водителей | своё расписание |
| `daily_world_post.yml` | Мировые автоновости | своё расписание |
| `weekly_digest.yml` | Еженедельный дайджест | раз в неделю |
| `health_check.yml` | Проверка сайта и уведомление владельца | по расписанию |
| `auto_build.yml` / `generate_videos.yml` | Сборка / генерация видео | по событию/расписанию |

Механика каждого запуска: триггер (cron или вручную) → checkout репозитория → установка Node.js 20 → запуск JS-скрипта → коммит от имени `github-actions[bot]` → `git push origin main` → GitHub Pages пересобирает сайт.

## 💰 Итого расходов

```
Хостинг, Actions, Bot API, переводчик, SSL  →  0 ₽
Домен .online                               →  ~1000 ₽/год (единственная трата)
```

Платных API, серверов и подписок нет — вся инфраструктура построена на бесплатных тарифах.

## 🛡️ Безопасность токенов
- Токен бота никогда не хранится в коде — только в Secrets репозитория GitHub.
- Админка защищена паролем (SHA-256 в `gate.js`), CSP `script-src 'self'`.
