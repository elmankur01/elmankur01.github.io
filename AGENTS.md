# Проект: AvtoPartsPro

Сайт-агрегатор автозапчастей на CPA-модели (аффилиатные ссылки). Пользователь ищет OEM-номер через каталог или ИИ-консультант, переходит в магазин-партнёр — владелец получает комиссию.

## Ссылки
- Сайт: https://elmankur01.github.io/
- Репозиторий: https://github.com/elmankur01/elmankur01.github.io (ветка main)
- Deploy: GitHub Pages (автоматически с main)
- Репо-источник (локальный): https://github.com/elmankur01/-auto-parts

## Владелец
- ИП Саругланов Эльман Ибрагимович
- ИНН: 052904150421
- ОГРНИП: 318057100006968
- Email: elmankur01@gmail.com

## Партнёрские сети
- **Takprodam (Admitad)** — все 4 магазина. Площадка `https://elmankur01.github.io/` **подтверждена** ✅ (после повторной подачи). Теперь можно запрашивать офферы (campaign ID) для Exist и Autopiter.
- **MyLead** — отказ, не используется.

## Магазины (STORES в data.js)
| Магазин | URL | Commission | Campaign ID | ERID | Статус |
|---------|-----|------------|-------------|------|--------|
| Exist.ru | exist.ru | Takprodam ~2.1% | `ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM` | — | ❌ ждём campaign ID |
| Rossko.ru | rossko.ru | Takprodam | `on8kt46xpp4c6955f9a4648980e865` ✅ | `2bL9aMPo2e49hMef4piUd4V2My` ✅ | ✅ настроен, URL `msk.rossko.ru/search/?text=` |
| Autopiter.ru | autopiter.ru | Takprodam ~4% | `ЗАМЕНИТЬ_НА_ID_ИЗ_TAKPRODAM` | — | ❌ ждём campaign ID |
| AvtoALL.ru | avtoall.ru | Takprodam ~3.5% | `5rermd1rb54c6955f9a4aeed5c54e0` ✅ | `25H8d7vbP8SRTvHZB1b5vJ` ✅ | ✅ настроен, short `sgkaa.com` |

## Важно: структура деплоя
Файлы сайта лежат в **корне репозитория** `elmankur01.github.io`, а не в `auto-parts/`. Папка `auto-parts/` — локальная рабочая копия, которая не деплоится. При правках нужно:
1. Редактировать файлы в локальной папке
2. Клонировать `elmankur01.github.io` и переносить изменения
3. Либо править напрямую через веб-интерфейс GitHub

## ERID / Маркировка рекламы
- ✅ Rossko — ERID получен
- ✅ AvtoALL — ERID получен
- ❌ Exist, Autopiter — ждём кампании

## Юридический статус
- ✅ Маркировка рекламы («Реклама» на каждой ссылке)
- ✅ Политика конфиденциальности (с ИП реквизитами)
- ✅ Пользовательское соглашение
- ✅ Cookie-баннер (Принять / Отклонить)
- ✅ Трекинг отключается при отказе от cookie
- ✅ Яндекс.Вебмастер — подтверждён (`yandex_9d4b4dc75e2f36bd.html`)
- ✅ Google Search Console — подтверждён (`google70a162b366d85b3b.html`)
- ❌ ERID на Exist, Autopiter — ждём кампании
- ❌ Уведомление РКН — не требуется

## Структура проекта (локальная копия auto-parts/)
```
auto-parts/
  index.html    — главная страница (SEO-метатеги, Open Graph)
  styles.css    — все стили
  script.js     — логика каталога, чата, UX-улучшения
  data.js       — база деталей (597+ шт), конфиг магазинов
  admin.html    — админ-панель (CRUD, магазины, статистика)
  AGENTS.md     — этот файл
  start.sh      — скрипт локального запуска
```
Файлы `sitemap.xml`, `robots.txt`, `favicon.svg`, `.nojekyll` — в корне репозитория.

## Админ-панель
- URL: `https://elmankur01.github.io/admin.html`
- **Пароль по умолчанию:** `admin123` (строка `ADMIN_PASSWORD` в admin.html)
- Вкладки: Каталог, Магазины, Статистика, Экспорт
- Скрыта от поисковиков (`noindex, nofollow`)

## Особенности реализации
- Каталог: 597+ деталей, 19 марок (+ Universal), фильтры по марке/модели/категории/поиску
- Пагинация: по 20 деталей, кнопка «Показать ещё»
- ИИ-консультант: чат-виджет с пошаговым поиском (марка → деталь → OEM)
- Автодополнение в поиске + клавиатурная навигация
- MODEL_SYNONYMS для русских названий моделей
- CAR_SYNONYMS для русских названий марок
- VIN-распознавание (первые 3 символа)
- Анимации появления секций (IntersectionObserver)
- Scroll spy + кнопка «Наверх»
- Счётчик результатов, копирование OEM
- Кнопка очистки чата 🗑️

## Что ждём
- ✅ Rossko — настроен и работает (`msk.rossko.ru/search/?text=`, campaign, ERID)
- ✅ AvtoALL — настроен и работает (`takprodam_short`, campaign, ERID)
- ✅ Takprodam площадка — подтверждена
- ✅ Фавиконки — созданы `favicon.svg`, `favicon.png`, `favicon.ico` (для Яндекса), все 200 OK
- ⏳ Campaign ID для Exist и Autopiter от Takprodam (площадка подтверждена — нужно запросить офферы в ЛК)
- ⏳ ERID для Exist и Autopiter (после получения campaign)
- ⏳ Rossko — подтвердить у пользователя, что ссылка `msk.rossko.ru` реально работает
- ⏳ Аудит безопасности — проведён (12 уязвимостей), исправления по запросу

## Локальные копии
- Рабочая: `/Users/elmansaruglanov/Documents/first project/first project1/auto-parts/`
- Git-репозиторий (источник): `/Users/elmansaruglanov/Desktop/auto-parts/` → `elmankur01/-auto-parts`
