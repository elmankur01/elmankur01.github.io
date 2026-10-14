---
name: performance-pwa
description: Audits and optimizes Core Web Vitals (LCP, CLS, INP), Service Worker (sw.js) cache lifecycle, offline support, image formats (WebP/AVIF), and script loading for АвтоТема.
metadata:
  author: avtotema
  version: 1.0.0
  tags: [performance, pwa, core-web-vitals, sw, cache, lighthouse, webp]
---

# Performance & PWA Specialist (АвтоТема)

Этот скилл регламентирует оптимизацию скорости загрузки, соответствие стандартам Google Core Web Vitals (LCP, CLS, INP) и управление жизненным циклом Service Worker (`sw.js`) и PWA-манифеста на портале [АвтоТема](https://avtotema-news.online/).

---

## 1. Google Core Web Vitals: Целевые показатели

| Метрика | Описание | Норма (Good) | Критично (Poor) |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Скорость отрисовки главного контентного блока | $\le 2.5\text{ с}$ | $> 4.0\text{ с}$ |
| **CLS** (Cumulative Layout Shift) | Стабильность верстки, отсутствие прыжков | $\le 0.1$ | $> 0.25$ |
| **INP** (Interaction to Next Paint) | Отзывчивость интерфейса на клики и тапы | $\le 200\text{ мс}$ | $> 500\text{ мс}$ |

---

## 2. Оптимизация LCP (Largest Contentful Paint)

1. **Главное изображение статьи (Hero image):**
   - Указывать атрибут `fetchpriority="high"` для первого большого изображения в статье.
   - **Запрещено** использовать `loading="lazy"` для баннера/hero-изображения в первом экране (above the fold).
   - Для ускорения резолвинга DNS и соединения со сторонними хранилищами (CDN) использовать `<link rel="preconnect">` в `<head>`.
2. **Форматы изображений:**
   - Предпочтительный формат: **WebP** или **AVIF**.
   - Рекомендуется тег `<picture>` с fallback:
     ```html
     <picture>
       <source srcset="/images/hero.webp" type="image/webp">
       <img src="/images/hero.jpg" alt="Описание" width="1200" height="675" fetchpriority="high">
     </picture>
     ```

---

## 3. Оптимизация CLS (Cumulative Layout Shift)

1. **Жесткие габариты медиаконтента:**
   - Каждое изображение `<img>`, видео `<video>` и iframe обязаны содержать атрибуты `width` и `height` либо явный CSS `aspect-ratio: 16 / 9;`.
2. **Динамические блоки и реклама:**
   - Для рекламных баннеров, виджетов погоды/курсов и формы комментариев резервировать минимальную высоту (`min-height: 250px;`) до их отрисовки.
3. **Шрифты без сдвигов:**
   - Подключение веб-шрифтов только со свойством `font-display: swap;`.

---

## 4. Оптимизация INP и JavaScript

1. **Пассивные обработчики событий:**
   - Все слушатели событий скролла (`scroll`, `touchmove`, `wheel`) должны использовать опцию `{ passive: true }`:
     ```javascript
     window.addEventListener('scroll', handleScroll, { passive: true });
     ```
2. **Разгрузка Main Thread:**
   - Никаких блокирующих циклов или тяжелых регулярных выражений при вводе текста в поиск (`#searchInput`).
   - Использовать `debounce` (300–400 мс) для поиска и автокомплита.
   - Для плавной анимации кнопки «Вверх» или чтения прогресса использовать `requestAnimationFrame`.

---

## 5. Управление Service Worker (`sw.js`) и PWA-манифестом

### 5.1. Стратегии кэширования
- **Cache-First (статические ресурсы):**
  - CSS, JS, шрифты (woff2), SVG-иконки, фавиконки.
  - При наличии файла в кэше — отдается мгновенно.
- **Stale-While-Revalidate (статьи и каталог):**
  - Пользователь видит кэшированную версию моментально, в фоне скачивается свежая версия и обновляет кэш.
- **Network-First (интерактивные страницы / профиль):**
  - Запрос в сеть, при сбое связи — показ страницы `offline.html`.

### 5.2. Правило инкремента версии кэша
При внесении любых изменений в базовые скрипты (`script.js`, `articles.js`) или стили (`style.css`), обязательно обновлять версию кэша в заголовке `sw.js`:
```javascript
const CACHE_NAME = 'avtotema-v1.X.X'; // <-- Инкрементировать при каждом релизе!
```

### 5.3. Очистка устаревших кэшей (`activate`)
```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});
```

---

## 6. Чек-лист проверки производительности перед коммитом

- [ ] Все картинки в `articles/*.html` имеют явные `width` и `height`.
- [ ] Картинки ниже первого экрана имеют `loading="lazy"` и `decoding="async"`.
- [ ] Hero-изображение имеет `fetchpriority="high"` и **не** имеет `loading="lazy"`.
- [ ] В `sw.js` обновлен идентификатор версии кэша `CACHE_NAME`, если правились стили или скрипты.
- [ ] Манифест `manifest.json` валиден, содержит актуальные иконки и цвета темы.
- [ ] В консоли нет предупреждений `[Violation] 'scroll' handler took <N>ms`.

---

## 7. Консольный аудит производительности

Запуск автоматического аудитора картинок (CLS/LCP), `sw.js` и `manifest.json`:

```bash
# Аудит главной страницы:
node .agents/skills/performance-pwa/scripts/audit-performance.js index.html

# Аудит конкретной статьи:
node .agents/skills/performance-pwa/scripts/audit-performance.js articles/some-article.html
```

