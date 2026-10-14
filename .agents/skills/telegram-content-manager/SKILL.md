---
name: telegram-content-manager
description: Manage, generate, preview, and test Telegram posts and social content for @avtotema_news. Trigger when asked to "prepare a Telegram post", "create a post for channel", "test auto-posting", "generate Shorts/Reels video", or "configure daily post workflow".
metadata:
  author: AvtoTema Team
  version: "1.0.0"
---

# Telegram Content Manager & Auto-Publisher Skill

Dedicated skill for managing editorial content, post generation, and automated publishing workflows for the official Telegram channel **@avtotema_news** (`https://t.me/avtotema_news`).

## Post Format Standards

Every post published to `@avtotema_news` must follow this high-engagement structure:

```text
[Emoji рубрики] [Заголовок статьи]

[2-3 динамичных предложения с ключевой сутью новости, цифрами и фактами]

⏱️ [N] мин чтения · 🏷️ #[тег1] #[тег2]

🔗 Читать статью целиком:
https://avtotema-news.online/articles/[slug].html
```

### Rubric Emoji & Hashtags
- **Мировые новости**: 🌍 `#мировые_новости #авторынок`
- **Новые модели**: 🏎️ `#новые_модели #премьера`
- **Электромобили**: ⚡ `#электромобили #ev`
- **Двигатели**: ⚙️ `#двигатели #моторы`
- **История марок**: 🏛️ `#история_марок #легенды`
- **Лайфхаки**: 💡 `#авто_лайфхаки #советы_водителям`

### Character Limits & Media Rules
- **Photo Posts (`sendPhoto`)**: Caption must NOT exceed 1024 UTF-16 code units (safe target: ≤850 characters to accommodate Russian multibyte characters and links).
- **Text Posts (`sendMessage`)**: Maximum 4096 characters (target: ≤1200 characters).
- **Image Requirements**: High-res 16:9 ratio (1280x720 or 1200x675), full color RGB, attribution included where required.

## Testing & Automation Workflows

### Dry-Run Testing
Always test auto-posting scripts without sending messages to the live channel:
```bash
NEWS_DRY_RUN=1 node .github/workflows/fetch_news.js
```
This tests RSS fetching, translation quality, deduplication, and database insertion without writing files or notifying subscribers.

### Tracking Posted Articles
- The state of posted articles is tracked in `state/posted.json`.
- `publish_daily.js` picks the latest unpublished article index, formats the caption, calls the Bot API, and appends `{ n, d: new Date().toISOString() }` upon 200 OK response.
- Never manually delete entries from `state/posted.json` unless intentional reposting is requested.

## Admin Panel Integration (Shorts / Reels)
- The admin panel (`4cc55b6066d79bfb2a80.html`) provides client-side HTML5 Canvas 9:16 vertical video rendering for YouTube Shorts & Telegram Video posts.
- Features Ken Burns zoom on article images, animated title overlays, category badges, and instant WebM/MP4 recording without server-side processing.

## Production Templates & CLI Validator

### Ready-to-Use Templates
- `templates/breaking-news.md` — молнии и срочные мировые новости.
- `templates/car-review.md` — детальные обзоры новинок с плюсами, минусами и ТТХ.
- `templates/market-analysis.md` — разбор параллельного импорта, расчет утильсбора и цен под ключ.
- `templates/shorts-reel-script.md` — готовый сценарий для 35–45 сек вертикального ролика (YouTube Shorts, VK Клипы, Reels).

### CLI Validator & Preview Tool
Validate any drafted post before posting:
```bash
# Validate drafted file:
node .agents/skills/telegram-content-manager/scripts/format-post.js path/to/draft.txt

# Preview template:
node .agents/skills/telegram-content-manager/scripts/format-post.js .agents/skills/telegram-content-manager/templates/breaking-news.md
```

