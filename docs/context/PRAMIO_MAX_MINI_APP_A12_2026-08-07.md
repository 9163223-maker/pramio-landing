# A12 — MAX Mini App Product & UX Canon

Status: PRODUCT/FRONTEND PROTOTYPE COMPLETE / SERVER INTEGRATION PENDING

## Why this stage exists

The earlier A1–A11 roadmap covered:
- MAX bot/chat UX;
- external Web Cabinet;
- backend contracts.

It did not cover a third first-class product surface: the MAX Mini App.

Therefore A1–A11 are not sufficient for the complete AdminKit product. A12 adds the missing surface without altering the already accepted assumptions of Bot and Web.

## Three-surface product model

### 1. Bot / chat
Best for:
- push notifications;
- one-tap actions;
- short wizards;
- one lead at a time;
- alerts;
- confirmation;
- deeplinks into a specific Mini App state.

### 2. MAX Mini App
Best for:
- rich daily work without leaving MAX;
- short CRM lists;
- one lead card;
- quick content editor;
- scheduled-post list;
- short analytics;
- channel diagnostics;
- profile/context;
- handoff to full Web when work becomes heavy.

### 3. Web Cabinet
Best for:
- large CRM lists/board;
- bulk filters/search/export;
- full content calendar/editor;
- comparative analytics/provenance;
- team;
- billing;
- integrations/settings;
- long-form desktop work.

The Mini App is NOT a copy of the Web Cabinet and NOT a replacement for the bot.

## Canonical Mini App IA

Bottom navigation:
1. Сводка
2. Лиды
3. Контент
4. Аналитика
5. Ещё

## MAX-native integration

Official platform model:
- Mini App is attached to a MAX bot;
- it is launched from the bot or direct `?startapp` link;
- it uses MAX Bridge (`window.WebApp`);
- `start_param` is used for deep-link context;
- `BackButton` follows Mini App navigation;
- `openLink` opens full Web;
- `openMaxLink` opens MAX deep links;
- `shareMaxContent` handles sharing inside MAX.

## Authentication / security

CRITICAL: `window.WebApp.initDataUnsafe` is presentation context only.

The server must authenticate Mini App launches using signed `window.WebApp.initData`.

Target flow:

MAX client
-> Mini App receives WebApp.initData
-> POST /auth/max/webapp/exchange
-> backend validates HMAC according to MAX WebAppData rules using BOT_TOKEN server-side
-> validates auth_date freshness
-> maps MAX user to AdminKit user/workspace
-> creates/refreshes Mini App session
-> returns only safe user/workspace/capability data

The bot token never enters browser code.

## Hosting

Recommended logical split:
- `mini.pramio.ru` -> Mini App frontend
- `app.pramio.ru` -> full Web Cabinet
- `api.pramio.ru` -> common server/Auth/API/MAX webhook

## Contract impact

A12 introduces a required delta to A9/A10/A11:
- Mini App auth exchange;
- signed WebAppData validation;
- start_param routing;
- MAX Bridge compatibility;
- Mini App-specific acceptance/security cases.

**Do not start B1 from the old A11 task until this delta is reconciled.**

## Official MAX platform basis checked 2026-08-07

- Mini Apps work only inside MAX and are connected through a bot.
- Standard web technologies are supported.
- MAX Bridge exposes `window.WebApp`.
- `initData` is intended for server validation.
- `initDataUnsafe` must not be used to validate authenticity.
- direct launch supports `?startapp` and `start_param`.
- MAX UI is the official React UI kit for visual consistency.
