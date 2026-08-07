# PRAMIO WEB CABINET — AUTHORITATIVE CONTEXT HANDOFF

**Updated:** 2026-08-07  
**Project:** Pramio / АдминКИТ  
**A-phase:** COMPLETE through A11  
**Next engineering stage:** B1  
**Purpose:** seamless continuation in a new Chat or Work session without repeating discovery.

## 1. Role split

Main Chat account works as **product lead, UX architect and acceptance owner**. It does not implement production code.

Second account in **Work / GPT-5.6 Sol High** is the technical executor.

The user transfers between accounts:
- Work assignments;
- reports;
- exact SHA;
- test results;
- production screenshots.

Do not repeat product discovery unless an explicit new unknown appears.

## 2. Product identity

Parent ecosystem: **Pramio**.  
User-facing product name: **АдминКИТ**.

Positioning:
`Pramio — управление бизнесом в мессенджерах.`

АдминКИТ is one product/sub-brand inside Pramio.

The web cabinet is not a mirror of the MAX bot.

### MAX / bot
- quick notifications;
- quick actions;
- one-lead operational work;
- simple wizards;
- short stats;
- operational diagnostics.

### Web
- CRM and large lists;
- filters/search;
- content calendar;
- extended editor;
- comparative/provenance analytics;
- channel diagnostics;
- team;
- billing;
- exports;
- settings.

## 3. Approved IA

Desktop:
1. Сводка
2. Лиды
3. Контент
4. Аналитика
5. Каналы
6. Ещё

`Ещё`:
- команда;
- тариф и оплата;
- экспорт;
- интеграции;
- настройки;
- помощь;
- документы/право.

Mobile bottom nav:
- Сводка
- Лиды
- Контент
- Аналитика
- Ещё

## 4. CRM canon

Statuses:
- `new` — Новый;
- `work` — В работе;
- `won` — Успешный;
- `lost` — Закрыт без результата.

Lead fields include:
- name;
- MAX ID/username;
- phone;
- source;
- campaign;
- channel;
- lead magnet/scenario;
- created_at;
- status;
- manager;
- comments/activity/tasks;
- next contact;
- result;
- amount.

Closing a lead requires a human-readable result; closed leads do not keep an active next-contact time.

## 5. Data integrity / analytics

Never mix MAX-native data and АдминКИТ-computed/observed data without provenance labels.

### MAX native / snapshot examples
- channel/chat parameters;
- current participants count when available;
- posts/messages;
- Message.stat;
- administrators;
- permissions;
- pinned message.

### Own АдминКИТ data
- tracking/CTA clicks;
- observed join/leave after connection;
- bot started/stopped when observed;
- attributed joins when attribution exists;
- gift requests/claims;
- lead events;
- campaigns;
- manual costs;
- CRM outcomes;
- saved metric snapshots.

### Do not promise/synthesize
- unique reach when not supplied by platform evidence;
- viewer identities;
- reaction-author analytics without confirmed platform event/API;
- full demographics;
- complete pre-install history;
- exact source of every organic join;
- unconfirmed native MAX metrics.

A current MAX snapshot is not period growth unless historical snapshots exist.

Cross-source clicks→leads→sales conversion must not be calculated without event-level cohort attribution.

## 6. MVP architecture

Target:

```text
pramio.ru
landing / public documents

app.pramio.ru
Web Cabinet frontend

api.pramio.ru
backend / auth / Web API / MAX webhook / payment webhook

PostgreSQL
Timeweb Cloud
sole server source of truth
```

Correct data flow:

```text
MAX -> webhook -> backend -> PostgreSQL
Web -> API -> backend -> PostgreSQL -> MAX API
```

Do not build MySQL↔PostgreSQL sync.  
Do not build Web↔Bot webhook.

The first MVP may share the existing Timeweb Cloud App logically under `/auth`, `/api/web/v1`, `/webhooks/max`, payment webhook routes, etc.

## 7. Web authentication canon

Preferred flow:

```text
АдминКИТ/MAX
-> “Открыть веб-кабинет”
-> short-lived one-time token
-> app.pramio.ru/login/max?token=...
-> backend token exchange
-> Secure HttpOnly web session
```

Requirements:
- TTL 1–3 minutes;
- one-time use;
- bot token never reaches browser;
- Secure HttpOnly session cookie;
- tenant/role/capabilities server-derived;
- browser cannot self-elevate;
- audit trail.

## 8. Frontend test stand

Current test domain:
`https://cr083957.tw1.ru`

Normal Timeweb Hosting is only frontend test stand / landing infrastructure.

Files for cabinet test are unpacked directly into `public_html`.

Preserve `cgi-bin`.

Do not treat this hosting as the production backend.

## 9. UI/usability canon

Primary target: 48×48 CSS px.  
Standard UI icon: 24×24 inline SVG.  
Large tile icon: 28×28 inside 48×48.  
Mobile body: 16 px.  
Secondary: 14 px.  
Metadata: 13 px.  
Micro: 12 px.  
Mobile forms: 16 px.  
System-native iPhone font stack.

System navigation/actions use inline SVG, not emoji/Unicode glyphs.

Compact header preserves meaning:
- identity/workspace stay visible;
- Overview has no artificial create-post action;
- Content may show create action;
- Analytics may show export;
- compact mode changes geometry, not brand/workspace typography.

`ОП` is the canonical account/profile entry.

## 10. A-stage completed

### A1 — Product UI Canon & Mobile Acceptance candidate
- clickable `ОП` profile entry;
- deterministic language/no-translate policy;
- header identity/typography stabilization;
- mobile canon prepared.

Manual real-device acceptance is still pending.

### A2 — Responsive System & Device Matrix
- narrow phones;
- standard phones;
- large phones;
- foldables;
- tablets/iPad;
- compact desktop;
- desktop;
- landscape and pointer modes.

### A3 — Frontend Hardening
- JSON import validation;
- unsaved-change protection;
- focus/keyboard/modal behavior;
- loading/error states;
- local audit;
- accessibility semantics;
- robust localStorage handling.

### A4 — Account / Workspace / Roles UX
- workspace is distinct from MAX channel;
- roles: owner/admin/manager/editor;
- capability UX;
- access-denied/session-expired states;
- server remains authoritative later.

### A5 — CRM & Content Production UX
- CRM lifecycle and task/activity behavior;
- content states: draft/scheduled/published/failed;
- workspace timezone;
- 7-day content calendar;
- schedule/cancel/retry/publish UX;
- UI does not pretend demo schedule has executed in MAX.

### A6 — Analytics & Data Provenance
Implemented as an isolated analytics pipeline.

Existing Overview analytics logic was deliberately not used as a causal input.

A6 defines:
- 7/30/90/all periods;
- provenance labels;
- partial coverage;
- CRM cohort reporting;
- no fake cross-source funnel;
- explicit unavailable metrics.

### A7 — Billing Product & Universal Payment Contract
Provider-neutral product layer for:
- ЮKassa;
- Т-Бизнес.

Provider choice remains open pending commercial responses.

Normalized subscription/payment states, checkout, recurring consent, cancel/resume, refunds and entitlements are contractually separated from provider APIs.

Browser return URL never activates entitlements.

### A8 — Legal / Privacy / Commercial Readiness
Created:
- offer structure;
- privacy structure;
- separate PD consent structure;
- recurring-payment consent separation;
- payment-instrument refusal UX;
- refunds checklist;
- 54-FZ/fiscal readiness checklist;
- Roskomnadzor/localization checklist;
- acquiring public-site readiness.

**LEGAL PRODUCTION PASS is intentionally not granted.**
Real seller legal name, INN/OGRN/address/contacts, tax/VAT/KKT model and lawyer/accountant review are still required.

### A9 — Full Server Contract / OpenAPI
Canonical artifacts define:
- auth/session;
- tenant access;
- CRM;
- content/scheduler/outbox;
- analytics provenance;
- diagnostics;
- billing/entitlements;
- MAX webhook;
- payment webhook;
- idempotency;
- error semantics.

### A10 — Acceptance & Security Pack
Contains 33 deterministic E2E cases plus:
- fixtures;
- security checklist;
- source-of-truth matrix;
- exact B-stage gates;
- manual/device acceptance checklist.

Each Work report must map required A10 case IDs to PASS/FAIL/BLOCKED.

### A11 — Work Launch Pack
A-phase is now complete.

Canonical Work launch context:
`docs/context/PRAMIO_WORK_LAUNCH_PACK_2026-08-07.md`

First Work assignment artifact:
`PRAMIO_B1_WORK_TASK.md`

## 11. Current frontend candidate

Latest consolidated frontend candidate:
`pramio-timeweb-test-v0.3.11-a8-legal-commercial-readiness-public_html.zip`

When the user can test again, use the latest consolidated candidate rather than historical intermediate ZIPs.

Manual consolidated iPhone/device acceptance remains pending.

## 12. Backend GitHub state — VERIFIED DURING A11

Repository:
`9163223-maker/amio-comments-max`

Branch:
`agent/issue-298-intermediate-remediation-deploy`

Verified HEAD on 2026-08-07 during A11:
`3f0c7716c90181eaf9c583febd7938ab25f89e1e`

This SHA was rechecked via GitHub during A11.

**Work must recheck remote HEAD again immediately before any code write.**
If it differs, stop and report the new SHA before coding.

Do not create a new branch unless explicitly approved.

## 13. B-stage sequence

### B1 — Shell + Auth + Read-only
Only:
- one-time MAX login;
- secure session;
- workspace membership;
- server roles/capabilities;
- session expiry/logout;
- read-only workspaces/channels;
- diagnostics bootstrap.

Not B1:
- CRM writes;
- content publish/scheduler;
- payment integration;
- analytics implementation.

### B2 — CRM + PostgreSQL
- canonical lead persistence;
- lifecycle;
- comments/tasks/activity;
- assignment;
- next contact;
- result/amount;
- multi-device sync;
- server audit.

### B3 — Content + MAX API
- drafts;
- schedule/cancel;
- publish now;
- retry;
- scheduler/outbox;
- MAX webhook inbox/dedup;
- rate limits/retries;
- platform message IDs/snapshots.

АдминКИТ backend owns delayed scheduling; do not assume native MAX scheduling.

### B4 — Billing
- normalized subscription/payment domain;
- provider adapter(s);
- verified notifications;
- recurring consent;
- cancel/resume;
- payment-instrument refusal;
- refunds;
- entitlements.

### B5 — Analytics + Audit + Production Readiness
- provenance metrics;
- saved MAX snapshots;
- coverage;
- audit;
- exports;
- tenant/security regression;
- restart/retry;
- backup/restore;
- load/stress readiness.

Do not synthesize unavailable MAX metrics.

## 14. Global Work restrictions

Without explicit approval:
- no new branch;
- no ENV changes;
- no Timeweb config/runtime changes;
- no production deploy;
- no unrelated АдминКИТ fixes;
- no silent scope expansion.

PostgreSQL changes are permitted only where the current B-stage explicitly requires them and must use narrow migrations with reporting/rollback assessment.

B1–B5 default to **NO DEPLOY**.

Deploy is a separate gate after:
1. code/report acceptance;
2. explicit user authorization;
3. exact target SHA;
4. pre-deploy regression;
5. post-deploy runtime acceptance.

## 15. Work report contract

Every B-stage report must include:
- repository;
- branch;
- starting remote HEAD;
- result SHA;
- exact changed files;
- migrations, if any;
- required A10 case matrix;
- exact tests/counts/results;
- security checklist results;
- blockers;
- confirmation of forbidden changes not made;
- deploy status explicitly stated.

`BLOCKED` is allowed only with a named external blocker and evidence. It is not PASS.

## 16. Immediate next action

When Work limit is available:

1. Open the A11 `PRAMIO_B1_WORK_TASK.md`.
2. Send it verbatim to the Work executor.
3. Executor first rechecks remote HEAD of `agent/issue-298-intermediate-remediation-deploy`.
4. If HEAD equals `3f0c7716c90181eaf9c583febd7938ab25f89e1e`, execute B1 only.
5. No deploy.
6. Return SHA + A10 mapping + tests to the main Chat account for acceptance.

## COPY-PASTE START MESSAGE FOR A NEW MAIN CHAT

Ты продолжаешь проект **Pramio / АдминКИТ** как руководитель продукта, UX-архитектор и приёмщик.

Authoritative context:
- repo: `9163223-maker/pramio-landing`
- branch: `main`
- file: `docs/context/PRAMIO_WEB_HANDOFF_2026-08-07.md`
- Work launch file: `docs/context/PRAMIO_WORK_LAUNCH_PACK_2026-08-07.md`

Сначала прочитай эти файлы через GitHub. Не повторяй discovery.

A1–A11 завершены. Следующий инженерный этап — B1. Основной backend repo/branch: `9163223-maker/amio-comments-max` / `agent/issue-298-intermediate-remediation-deploy`. A11 verified HEAD: `3f0c7716c90181eaf9c583febd7938ab25f89e1e`; перед любыми изменениями Work обязан проверить его заново.
