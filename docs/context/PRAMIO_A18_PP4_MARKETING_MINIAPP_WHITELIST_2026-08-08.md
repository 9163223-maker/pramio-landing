# PRAMIO / АДМИНКИТ — A18 PP4 MARKETING + MAX MINI APP + WHITE-LIST CANON

**Updated:** 2026-08-08  
**Status:** A18 COMPLETE / MANUAL + WORK REMAIN

## 1. PP4 marketing completeness

Historical Stage-03 PP4 inventory contains exactly 64 capabilities. The known aggregate engineering state remains:

- WORKING 17
- EXISTS_NOT_WIRED 16
- PARTIAL 17
- MISSING 13
- UNSAFE 1

A18 does not invent a row-by-row engineering status because the available historical source proves only the aggregate counts.

Marketing accounting is now complete:

`PP4_MARKETING_COMPLETENESS = 64/64 ACCOUNTED`

Marketing classes:
- HERO 6
- SELL 28
- SUPPORT 18
- TRUST 9
- HIDE_TECH 3

Critical marketing gap found in A17: the product was under-positioning two large PP4 value layers:

1. **Community / chat operations** — chats, participants, admins/rights, messages, pinning and chat information.
2. **Smart moderation** — flood, exact/similar duplicates, prohibited words, link/domain rules, CAPS/mentions/attachments/new-member rules, exceptions, actions, sanction ladder, audit, automation, events and operational chat statistics.

Revised commercial pillars:
1. Контент
2. Рост / механики
3. CRM
4. Каналы и сообщества
5. Умная модерация
6. Аналитика и контроль

Platform reliability/security is a trust layer, not a marketing feature list.

Public claims remain gated by runtime/manual evidence. Marketing accounting is not implementation proof.

## 2. MAX Mini App final concept

Mini App is the primary daily operational interface **inside MAX**.

Final bottom navigation:
1. Сводка
2. Лиды
3. Контент
4. Механики
5. Ещё

Analytics moves to Summary/More; full analytics remains Web. This creates a first-class place for the core mechanics that already exist in AdminKit.

### Сводка
- workspace/channel;
- connectivity/server state;
- new/work leads;
- scheduled posts;
- current MAX participant snapshot;
- moderation alerts;
- failed commands;
- mechanics activity.

### Лиды
Daily CRM without bulk/board/export.

### Контент
Drafts, upcoming, failures, quick editor, schedule/cancel and B3 publish/retry.

### Механики
- Buttons;
- Lead magnets;
- Scenarios;
- Smart moderation;
- Polls/highlights only where actual MAX/backend capability is confirmed.

### Ещё
- channels/chats;
- participants/admins where role allows;
- diagnostics;
- short analytics;
- plan status;
- profile/access;
- support;
- full Web handoff.

Bot deep-links to exact Mini App context via start_param; start_param never authorizes the object.

## 3. Russian mobile Internet white-list requirement

The Russian white-list regime is relevant specifically to temporary **mobile Internet** restrictions.

Important current fact: MAX itself is reported as included in the list, but a developer Mini App is still an ordinary developer-hosted HTTPS web application. Therefore:

`MAX reachable != arbitrary Mini App domain reachable`

Do NOT claim that AdminKit Mini App works during mobile Internet restrictions until the actual Pramio origin is externally reachable/tested.

An important published condition for white-list inclusion is that all computing capacity is located in Russia.

## 4. A18 constrained-mobile architecture

Preferred Mini App critical path:

`https://mini.pramio.ru/`

and same-origin:

`https://mini.pramio.ru/api/web/v1/*`

The `/api` path reverse-proxies to the shared AdminKit backend.

The Mini App browser should **not require `api.pramio.ru` as a second origin** for ordinary daily operation.

This minimizes origins that must stay reachable under constrained mobile connectivity and reduces credentialed CORS dependence.

### Production dependency policy

Critical infrastructure must be explicitly placed in Russian locations:
- Mini App/static edge;
- app/backend compute;
- PostgreSQL;
- critical object storage;
- critical logs/observability.

Frontend critical path:
- system fonts;
- bundled CSS/JS/SVG/icons;
- no Google Fonts;
- no foreign CDN;
- no foreign analytics;
- no foreign captcha;
- no foreign error tracking;
- no arbitrary remote media hosts.

Official MAX Bridge (`st.max.ru`) remains the platform-hosted dependency.

## 5. Network states

Mini App must explicitly distinguish:

### ONLINE_FULL
Everything permitted by role/capability is available.

### ONLINE_RESTRICTED
Core Mini App works; optional external destinations may be unavailable.

Core remains:
- CRM;
- mechanics;
- moderation;
- content core;
- diagnostics;
- short analytics.

Full Web/payment/external links are non-critical handoffs.

### SERVER_UNREACHABLE
Allowed:
- last-known read snapshot with timestamp;
- explicit local drafts;
- retry.

Forbidden:
- false server-save success;
- silent destructive moderation queue;
- silent publish/delete/block;
- false payment success.

## 6. White-list-friendly gift delivery

Prefer:

AdminKit backend -> MAX Bot API -> file/message/attachment inside MAX.

Do not make the main gift-receipt flow depend on a random external download host.

## 7. Whitelist gates

`WHITELIST_ARCHITECTURE_READY` — architecture/dependency minimization complete.

`WHITELIST_RUNTIME_TESTED` — tested during real restricted-mobile conditions.

`WHITELIST_INCLUDED` — external inclusion/reachability confirmed.

Only `WHITELIST_INCLUDED` allows a public availability claim.

## 8. B1 impact

A18 supersedes A13 where the Mini App browser network/origin architecture differs.

New canonical B1 task:
`docs/context/PRAMIO_B1_WORK_TASK_A18_WHITELIST_RECONCILED.md`

Keep all A13 security semantics:
- signed raw WebApp.initData validation;
- initDataUnsafe not authoritative;
- auth_date freshness;
- server tenant/role/capabilities;
- start_param is route hint only;
- Mini -> Web one-time handoff;
- no secret in URL/browser.

Add A18:
- same-origin Mini App API ingress;
- no foreign runtime dependencies in critical Mini App path;
- Russian-location evidence status;
- connectivity/degraded-state contract;
- no claim of whitelist inclusion from architecture alone.

## 9. Work sequence impact

B1 — auth/session/tenant + same-origin Mini ingress.  
B2 — CRM/PostgreSQL.  
B3 — Content + MAX Mechanics as A16 waves.  
B4 — Billing; payment provider is non-critical Mini App handoff.  
B5 — analytics/security/load plus real restricted-mobile dependency/operator acceptance when available.

No production deploy was performed by A18.
