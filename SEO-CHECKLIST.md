# SEO-Чеклист «АвтоТема»

Сайт: https://elmankur01.github.io/
Sitemap: https://elmankur01.github.io/sitemap.xml

## Первичная подача / переобход

### Яндекс.Вебмастер

| Шаг | Действие | Ссылка |
|-----|----------|--------|
| 0 | Проверить, что бот видит сайт | https://webmaster.yandex.ru/tools/server-response/ |
| 1 | Анализ sitemap (валидатор), вставить `https://elmankur01.github.io/sitemap.xml`, проверить 0 ошибок | https://webmaster.yandex.ru/tools/sitemap/ |
| 2 | Подача sitemap → Индексирование → Файлы Sitemap → «Добавить файл» → `sitemap.xml` → «Отправить». Повторно отправлять при обновлении не нужно | https://webmaster.yandex.ru/site/indexing/sitemap/ |
| 3 | Переобход страниц — вставить пример ЧПУ (до 10 запросов на хост) | https://webmaster.yandex.ru/site/tools/add-url/ |
| 4 | Проверка отдельного URL | https://webmaster.yandex.ru/site/indexing/urlchecker/ |

Пример ЧПУ для переобхода:
```
https://elmankur01.github.io/articles/elektromobili-v-2026-godu-gonka-za-zapasom-khoda-v-1000-km.html
```

### Google Search Console

| Шаг | Действие | Ссылка |
|-----|----------|--------|
| 0 | Выбрать сайт (или добавить URL-префикс `https://elmankur01.github.io/`) | https://search.google.com/search-console |
| 1 | Карты сайта (Sitemaps) → ввести `sitemap.xml` → «Отправить» → статус «Success» | через навигацию слева в консоли |
| 2 | Проверка URL-адреса (URL Inspection) → вставить пример ЧПУ → «Запросить индексирование» | через верхнее поле консоли |
| 3 | Ускоренный обход всех слагов — Sitemaps API: `PUT https://www.googleapis.com/webmasters/v3/sites/<siteUrl>/sitemaps/<feedpath>` (нужен OAuth-токен) | — |

Примечания:
- Глубокая ссылка GSC `https://search.google.com/search-console/sitemaps?resource_id=...` зависит от выбранного property — надёжнее идти через навигацию консоли.
- Старые `article-N.html` (404) и кэш AvtoPartsPro выпадут сами после переобхода sitemap — удалять вручную не нужно.

## Регулярные проверки

- [ ] Метрика 111426400: визиты растут, счётчик работает после согласия на cookie
- [ ] Sitemap: 71 URL (главная + privacy + terms + 68 статей), все свои, без дубликатов
- [ ] Новые статьи: добавлен слаг в `SLUGS` (article_images.js) перед запуском генерации
- [ ] ЧПУ-страницы отдают 200, `article-N.html` — заглушки с canonical на слаг
- [ ] PageSpeed (ручная проверка): https://pagespeed.web.dev/
- [ ] Проверка индексации: поиск `site:elmankur01.github.io`

## Перспектива

- Покупка домена `.ru` (github.io ранжируется хуже)
- Внешний трафик: Дзен, VK
- Контент-план под семантику Вордстата
