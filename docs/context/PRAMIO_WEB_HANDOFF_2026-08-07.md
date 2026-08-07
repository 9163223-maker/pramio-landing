# PRAMIO WEB CABINET — CONTEXT HANDOFF

**Дата:** 2026-08-07  
**Проект:** АдминКИТ / Pramio  
**Назначение:** бесшовное продолжение в новом обычном чате ChatGPT.

## Роль нового чата

Работать как **руководитель продукта, UX-архитектор и приёмщик Pramio / AdminKit**. Не начинать заново discovery, не расширять scope и не трогать production АдминКИТ, PostgreSQL, ENV, Timeweb Cloud runtime или deploy без прямого согласования.

Стратегия пользователя:

1. **Без режима Work** сделать всё, что возможно на клиентской стороне: product/UX, functional frontend, mobile polish, API-контракты, acceptance pack, тестовый стенд, accessibility/performance hardening.
2. **После восстановления Work** подключить технического исполнителя для server integration: MAX + PostgreSQL + auth + webhook + real CRM + content actions + billing + audit + stress/load tests + production readiness.

Главный принцип: **web не является зеркалом MAX-бота**.

## Продуктовая модель

Pramio — экосистема сервисов для бизнеса в мессенджерах. Первый продукт — **Pramio AdminKit** для MAX; Telegram позже.

Позиционирование:
- `Pramio — управление бизнесом в мессенджерах.`
- `AdminKit — native daily MAX operations.`

### MAX / бот
- быстрые уведомления;
- быстрые действия;
- обработка одного лида;
- простые мастера;
- короткая статистика;
- оперативная диагностика.

### Web
- CRM и большие списки;
- фильтры и поиск;
- календарь контента;
- расширенный редактор;
- сравнительная аналитика;
- диагностика каналов;
- команда;
- тариф;
- экспорт;
- настройки.

## Утверждённая IA Web Cabinet 1.0

Основные разделы:
1. Сводка
2. Лиды
3. Контент
4. Аналитика
5. Каналы
6. Ещё

В `Ещё`:
- команда;
- тариф и оплата;
- экспорт;
- интеграции;
- настройки;
- помощь.

Мобильная нижняя навигация:
- Сводка
- Лиды
- Контент
- Аналитика
- Ещё

## CRM

Статусы:
- красный — Новый;
- жёлтый — В работе;
- зелёный — Успешный;
- серый — Закрыт без результата.

Карточка лида: имя, MAX ID/username, телефон, источник, кампания, канал, лид-магнит/сценарий, created_at, статус, менеджер, комментарии, activity, next contact, result, amount.

## Данные и аналитика

Нельзя смешивать данные MAX и вычисления AdminKit без маркировки.

### MAX API / native
Можно использовать:
- параметры канала;
- текущее число участников, когда доступно;
- посты/сообщения;
- `Message.stat.views`;
- администраторов;
- права;
- закреплённый пост.

### Собственные события AdminKit
Можно считать:
- tracking clicks;
- member joined / left после подключения;
- bot started / stopped;
- attributed joins;
- наблюдаемые комментарии;
- CTA clicks;
- gift requests / claims;
- lead events;
- campaigns;
- manual costs;
- CRM outcomes;
- snapshots просмотров.

### Не обещать
- unique reach;
- identities of viewers;
- reaction-author analytics;
- полную демографию;
- полную историю до установки;
- точный источник любого органического вступления;
- неподтверждённые нативные MAX-метрики.

## Архитектура MVP

Обычный Timeweb Hosting работает с MySQL, Timeweb Cloud — с PostgreSQL.

Решение: **MySQL не включать в продуктовый контур**.

Целевая схема:

```text
pramio.ru
обычный Timeweb Hosting
лендинг / документы

app.pramio.ru
веб-кабинет

api.pramio.ru
backend / auth / API / MAX webhook

PostgreSQL
Timeweb Cloud
единственный source of truth
```

Первый MVP можно запускать в **том же существующем Timeweb Cloud App**, логически разделив:
- `/webhooks/max/...`
- `/api/web/v1/...`
- `/auth/...`
- `/app/...`

Позже frontend можно вынести во второй App без миграции PostgreSQL.

Правильный обмен:

```text
MAX -> webhook -> backend -> PostgreSQL
Web -> API -> backend -> PostgreSQL -> MAX API
```

Не строить MySQL ↔ PostgreSQL sync. Не строить Web ↔ Bot webhook.

## Авторизация web из MAX

Предпочтительный flow:

```text
AdminKit в MAX
-> кнопка «Открыть веб-кабинет»
-> short-lived one-time token
-> https://app.pramio.ru/login/max?token=...
-> secure web session
```

Требования:
- token 1–3 минуты;
- one-time;
- bot token не попадает в браузер;
- secure HttpOnly cookie;
- tenant/role назначаются серверно;
- audit trail.

## Что уже создано без Work

Functional frontend поддерживает:
- навигацию;
- create/edit/delete leads;
- CRM statuses;
- comments/tasks/next contact;
- search/filter;
- board/list;
- CSV export;
- JSON export/import;
- create/edit/delete posts;
- drafts/scheduled/demo publish;
- analytics recalculation;
- demo channels;
- diagnostics;
- team;
- plan/limits;
- settings;
- localStorage;
- API Adapter layer;
- responsive mobile;
- PWA groundwork.

Серверные данные пока имитируются.

## Текущий тестовый стенд

Технический домен обычного Timeweb Hosting:

`https://cr083957.tw1.ru`

Файлы лежат в `public_html`.

`cgi-bin` **сохранять**.

Старый `index.htm` удалён/должен оставаться удалённым или переименованным. Наш основной файл — `index.html`.

Этот hosting — только frontend test stand. Будущий backend остаётся в Timeweb Cloud.

## Usability baseline

После реального тестирования на iPhone выявлено, что Unicode-глифы (`◎`, `⌁`, `▤`, `◉`) давали разную оптическую ширину и stroke. Принят единый cross-platform web baseline на основе Apple HIG, WCAG 2.2, Android/Material и Baymard.

Принятые значения:
- primary interactive target: **48×48 CSS px**;
- standard visible icon: **24×24**;
- large tile icon: **28×28** внутри **48×48**;
- mobile body: **16 px**;
- secondary: **14 px**;
- metadata: **13 px**;
- micro labels: **12 px**;
- mobile form text: **16 px**;
- body line-height около 1.5;
- нормальный text contrast по WCAG AA;
- meaningful non-text UI contrast 3:1;
- длинные текстовые строки около 50–75 символов.

Системные UI-иконки: только inline SVG, `viewBox 24×24`, stroke 2px, round linecap/linejoin. Unicode/emoji для системной навигации больше не использовать.

Typography на iPhone: system-native stack (`-apple-system`, SF Pro fallback chain).

## Последние версии

### v0.3 Usability Standard
Исправлено:
- системная типографика;
- SVG icon family;
- 48px touch targets;
- 24px icons;
- 16px mobile forms;
- contrast;
- focus-visible;
- reduced motion;
- bottom navigation;
- typography scale.

Приёмка v0.3 на iPhone:
- icons — PASS;
- touch targets — PASS;
- readability — PASS;
- contrast — PASS;
- mobile hierarchy — PARTIAL;
- vertical efficiency — PARTIAL;
- task cards — NEEDS POLISH.

### v0.3.1 Mobile Polish — ТЕКУЩАЯ ПОСЛЕДНЯЯ ВЕРСИЯ

Пакет:
`pramio-timeweb-test-v0.3.1-mobile-polish-public_html.zip`

Изменения:
- hero уменьшен примерно на 20–25%;
- sticky topbar после ~72px scroll схлопывается;
- breadcrumb становится `Olga.style`;
- `Создать пост` превращается в квадратную `+`;
- avatar остаётся;
- task cards переведены в 2-row mobile layout;
- bottom nav визуально облегчена;
- touch targets сохранены;
- `Ещё` усилено оптически;
- quick actions сокращены: Новый пост / Добавить лида / Результаты / Диагностика;
- localStorage/data model не менялись.

URL для проверки после загрузки:
`https://cr083957.tw1.ru/?v=0310`

**Важно:** на момент создания этого handoff пользователь ещё не прислал новые скриншоты фактически загруженной v0.3.1. Первое действие нового чата — принять v0.3.1 по реальным iPhone-скриншотам, не начинать новый редизайн заранее.

## Дорожная карта без Work

### A2 — Frontend Hardening
- mobile acceptance всех разделов;
- undo/restore;
- robust JSON import validation;
- loading/error/empty states;
- keyboard/focus handling;
- unsaved changes protection;
- content calendar polish;
- local audit trail;
- performance;
- regression suite;
- accessibility audit.

### A3 — Full Server Contract
Подготовить OpenAPI для:
- MAX one-time auth;
- sessions;
- tenant context;
- capability flags;
- lead API;
- content API;
- analytics API;
- channel diagnostics;
- idempotency;
- outbox commands;
- audit log;
- MAX webhook contract;
- billing/entitlements;
- payment webhook contract;
- standard errors.

### A4 — Acceptance Pack
- E2E scenarios;
- exact acceptance criteria;
- test fixtures;
- MAX/Web responsibility matrix;
- data-source matrix;
- mobile checklist;
- security checklist;
- server integration plan;
- Work task decomposition.

## После восстановления Work

### B1 — Shell + Auth + Read-only
- existing Timeweb Cloud App;
- one-time login from MAX;
- secure session;
- tenant guard;
- read-only bootstrap;
- real channels;
- diagnostics.

### B2 — CRM + PostgreSQL
- canonical lead services;
- real cards/status/comments/tasks;
- multi-device sync;
- server audit.

### B3 — Content + MAX API
- real post create/edit/delete/pin;
- command queue;
- idempotency;
- retries;
- MAX rate limits;
- webhook confirmation.

### B4 — Billing
- payment provider;
- checkout;
- payment webhook;
- entitlements;
- renewals;
- cancellations/refunds;
- invoices/receipts where applicable.

### B5 — Audit + Stress Test
- tenant isolation;
- token security;
- webhook reliability;
- concurrent writes;
- duplicate clicks;
- load tests;
- restart recovery;
- backups;
- production readiness gate.

## AdminKit GitHub context

Repository:
`9163223-maker/amio-comments-max`

Primary working branch historically:
`agent/issue-298-intermediate-remediation-deploy`

Last explicitly verified HEAD in this conversation:
`3f0c7716c90181eaf9c583febd7938ab25f89e1e`

Этот SHA нужно **проверить заново** перед любой будущей Work-задачей.

Не делать без согласования:
- новую ветку;
- PostgreSQL schema changes;
- ENV changes;
- Timeweb config changes;
- deploy;
- unrelated AdminKit fixes.

## Принципы дальнейшей работы нового чата

1. Считать этот файл authoritative continuity context.
2. Не повторять discovery.
3. Продолжать с последнего практического состояния.
4. Делать инкрементальные frontend-релизы, а не редизайн с нуля.
5. Тестировать mobile по реальным скриншотам пользователя.
6. Для Timeweb-пакетов давать ZIP, который распаковывается **напрямую в `public_html`**.
7. `cgi-bin` сохранять.
8. Не менять localStorage keys без осознанной миграции.
9. Во время быстрого тестирования избегать service-worker cache; использовать asset versioning/cache busting.
10. После возврата Work отдавать серверные задачи узкими волнами и требовать exact SHA/tests/results.

---

## COPY-PASTE START MESSAGE

Ты продолжаешь проект **Pramio / AdminKit** как руководитель продукта, UX-архитектор и приёмщик.

Канонический контекст проекта находится в GitHub:

- repository: `9163223-maker/pramio-landing`
- branch: `main`
- file: `docs/context/PRAMIO_WEB_HANDOFF_2026-08-07.md`

Сначала прочитай этот файл целиком через GitHub и используй его как исходное состояние проекта. Не начинай заново discovery и не расширяй scope.

Ключевое текущее состояние:
- без режима Work мы делаем абсолютно всю клиентскую часть и подготовку, которую возможно;
- серверную интеграцию MAX + PostgreSQL + auth + payments + audit + stress tests подключим отдельными волнами через Work;
- web не является зеркалом MAX-бота;
- frontend-стенд: `https://cr083957.tw1.ru`;
- последняя собранная frontend-версия — **v0.3.1 Mobile Polish**;
- после новых iPhone-скриншотов сначала провести приёмку v0.3.1, не начинать новый редизайн;
- далее A2 Frontend Hardening → A3 Full Server Contract → A4 Acceptance Pack → затем Work B1–B5.

Продолжай бесшовно с этого места.
