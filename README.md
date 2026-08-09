# АвтоТема — автомобильный блог

Многостраничный блог об автомобилях: новые модели, электромобили, двигатели, история марок, мировые новости автопрома, российские авто, новости рынка.

- **Сайт:** https://elmankur01.github.io/
- **Репозиторий:** https://github.com/elmankur01/elmankur01.github.io (ветка main)
- **Хостинг:** GitHub Pages (деплой автоматически из main)
- **Telegram-канал:** https://t.me/avtotema_news

---

## Как добавить статью

1. Добавьте объект в `ARTICLE_BANK` (файл `script.js`) — заголовок, рубрика, превью-текст.
2. Добавьте полный текст статьи в `BODIES` (файл `article_content.js`).
3. Добавьте запись в `SOURCES` (файл `article_content.js`) — официальные источники.
4. Подберите свободное фото (Wikimedia Commons, лицензия CC/PD) и добавьте в `IMAGES` (`article_images.js`) + положите файл в `images/`. Автора и лицензию — в `credit`.
5. Добавьте ЧПУ-слаг в `SLUGS` (`article_images.js`) — транслитерация заголовка. Без слага ссылки будут `article-N`.
6. Закоммитьте и запушите. GitHub Actions `auto_build.yml` автоматически пересоберёт страницы статей и `sitemap.xml`.

> **Правило:** каждая статья получает фотографию со свободной лицензией.

---

## Как сделать ролик по статье

### В облаке (через админку)
1. Откройте `/admin.html` на живом сайте.
2. В блоке «Сделать ролики по статьям» введите GitHub-токен (нужен доступ к репозиторию) и выберите статьи.
3. Нажмите «Запустить генерацию». Workflow `generate_videos.yml` сам установит ffmpeg и edge-tts, соберёт ролики и зальёт их в артефакты.
4. Скачайте архив с роликами — **или** они автоматически попадут в папку `videos/` репозитория (workflow сам коммитит их в main). После `git pull` ролики будут в локальной папке `auto-parts/videos/`, а на сайте доступны по прямой ссылке `https://elmankur01.github.io/videos/<имя>.mp4`.

### Локально
```bash
node tools/generate_video.js                # выбрать статьи интерактивно
node tools/generate_video.js 2 5 9          # конкретные статьи
node tools/generate_video.js --all          # все статьи
```
Ролики появятся в `tools/videos/`.

**Требования локально:**
- Node.js
- ffmpeg с фильтром `drawtext` (macOS: `brew install ffmpeg-full` — обычный ffmpeg без drawtext)
- Python 3 + `pip install edge-tts` (озвучка)

---

## Как отправить статью в Telegram вручную

1. Откройте `/admin.html`.
2. В блоке отправки выберите номер статьи, получателя (канал или личный чат) и нажмите кнопку.

Автопостинг работает сам: `daily_post.yml` публикует статью 4 раза в день (00, 06, 12, 18 UTC), `daily_rf_post.yml` — рубрику «Российские авто» в 07:00, `daily_market_post.yml` — «Новости рынка» в 08:00.

---

## Как задеплоить изменения

Локальная папка `auto-parts/` — это и есть git-репозиторий. Обычный флоу:

```bash
git add .
git commit -m "описание изменения"
git push
```

GitHub Pages обновится автоматически. Если вы меняли исходники, которые перечислены в triggers `auto_build.yml` (script.js, article_content.js, article_images.js, generate_articles.js, index.html, styles.css), страницы статей и sitemap пересоберутся сами. **Не коммитьте вручную `articles/` и `sitemap.xml`** — их пересобирает workflow.

Локально пересобрать страницы: `node generate_articles.js`.

---

## Секреты GitHub Actions

Настраиваются в Settings → Secrets and variables → Actions:

| Секрет | Назначение |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен бота для автопостинга и ручной отправки |
| `TELEGRAM_CHAT_ID` | ID канала `@avtotema_news` |
| `TELEGRAM_OWNER_CHAT_ID` | ID личного чата владельца (для тестов) |

GitHub-токен для генерации роликов вводится в админке каждый раз и в репозитории не хранится.

---

## Структура проекта

```
auto-parts/
  index.html             — лендинг-блог (главная)
  styles.css             — все стили (тёмная тема)
  script.js              — банк статей ARTICLE_BANK, ротация, меню, reveal
  article_content.js     — полные тексты статей (BODIES) + SOURCES
  article_images.js      — IMAGES (фото статей) + SLUGS (ЧПУ-адреса)
  generate_articles.js   — генератор страниц статей
  articles/              — сгенерированные страницы (пересобирает workflow, не коммитить)
  images/                — фотографии статей
  admin.html, admin.js   — админка (отправка в Telegram + генерация роликов)
  stats.html, stats.js   — панель статистики Telegram
  tools/                 — generate_video.js (ролики), videos/ (выходные файлы)
  .github/workflows/     — CI: сборка, автопостинг, генерация роликов
  AGENTS.md              — подробное описание проекта для агента
  consent.js             — баннер согласия на cookie/аналитику
  analytics.js           — Яндекс.Метрика и GA4 (только после согласия)
  privacy.html, terms.html — юридические страницы (152-ФЗ, ГК РФ)
  fonts/                 — шрифт Inter (селф-хостинг)
```

---

## Технические заметки

- **CSP:** `script-src 'self'` — никаких inline-скриптов/обработчиков, всё через внешние `.js` и addEventListener.
- **Шрифты:** Inter подключён локально, Google Fonts не используются (CSP `font-src 'self'`).
- **Аналитика:** Яндекс.Метрика (счётчик 111426400) и GA4 загружаются только после явного согласия посетителя.
- **Возрастная маркировка:** бейдж «0+» в футере всех страниц (436-ФЗ).
- **Формат статьи:** `/articles/<слаг>.html` (ЧПУ). Старые адреса `article-N.html` — редирект-заглушки на ЧПУ-версию.
