# PRAMIO / АДМИНКИТ — FINAL CURRENT CONTEXT AFTER A18

**Updated:** 2026-08-08  
**Chat product/planning/frontend phase:** COMPLETE through A18  
**Next engineering stage:** B1  
**Manual acceptance:** pending  
**Production deploy:** not performed

## Three-surface product

АдминКИТ is one server product with three clients:

1. **MAX Bot** — notifications, one-tap actions, short wizards, contextual help and deep-links.
2. **MAX Mini App** — primary daily operational UI inside MAX.
3. **Web Cabinet** — heavy/full workspace for bulk CRM, full calendar/editor, comparative analytics, team, billing, exports and integrations.

**Server/PostgreSQL is canonical business state.** No UI surface is an independent source of truth.

## Backend target

Repository: `9163223-maker/amio-comments-max`  
Branch: `agent/issue-298-intermediate-remediation-deploy`  
Last verified HEAD: `3f0c7716c90181eaf9c583febd7938ab25f89e1e`

Work MUST re-check remote HEAD before any write. If different: STOP and report actual SHA.

## A14 — latest Web candidate

`pramio-timeweb-test-v0.3.11.1-a14-responsive-hotfix-public_html.zip`

Fixed:
- 900–1100px navigation-loss cascade;
- mobile section-header positioning;
- compact rail accessibility.

Manual real-device acceptance remains required.

## A15 — functional MAX Mini App prototype

Latest functional prototype before A18 concept reconciliation:
`pramio-max-miniapp-a15-functional-v0.3.zip`

Includes:
- CRM daily flow;
- quick content;
- analytics provenance;
- diagnostics/profile;
- MAX Bridge/start_param contract;
- Buttons CRUD;
- Lead Magnets CRUD with independent conditions;
- Scenarios CRUD with canonical callback-button identity.

Real server auth and real MAX operations remain B1/B3.

## A16 — complete product surface coverage

Coverage includes channels, comments/subfeatures, moderation, content, buttons, lead magnets, scenarios, highlight, polls, CRM, analytics, billing, referrals, team, settings, help and legal.

B3 is sequential:
- B3.1 Content / scheduler / outbox / MAX messages;
- B3.2 Buttons + Lead Magnets + Scenarios;
- B3.3 Comments + Moderation + Highlight + Polls;
- B3.4 Cross-surface mechanics compatibility / referrals/platform mechanics.

A16 contains 15 mechanics E2E cases and the B3 Work task template.

## A17 — marketing/public launch base

Parent positioning:
`Pramio — управление бизнесом в мессенджерах.`

Product positioning:
`АдминКИТ — управление бизнесом в MAX.`

Prepared landing/public pages, CTA system, SEO/event taxonomy, tariff architecture and B2/B4/B5 Work task templates.

Tariff architecture:
- Free
- Start
- Pro
- Business

Prices/trial/limits remain owner decisions and were not invented.

## A18 — PP4 marketing completeness

Historical PP4 Stage-03 inventory contains exactly 64 capabilities.
Known aggregate engineering state:
- WORKING 17
- EXISTS_NOT_WIRED 16
- PARTIAL 17
- MISSING 13
- UNSAFE 1

The available historical source does not prove a row-by-row engineering-status mapping, so A18 does not invent one.

Marketing accounting is complete:

`PP4_MARKETING_COMPLETENESS = 64/64 ACCOUNTED`

Marketing classes:
- HERO 6
- SELL 28
- SUPPORT 18
- TRUST 9
- HIDE_TECH 3

Critical marketing gaps discovered after A17:

### Community / chat operations
Chats, participants, admins/rights, messages, pinning and chat information are a commercially meaningful product pillar.

### Smart moderation
Flood, exact/similar duplicates, prohibited words, links/domains, mentions/CAPS/attachments/new-member restrictions, exception rules, automated sanctions, sanction ladder, audit, per-chat automation, events and operational chat statistics are a separate strong value layer.

Revised public commercial pillars:
1. Контент
2. Рост / механики
3. CRM
4. Каналы и сообщества
5. Умная модерация
6. Аналитика и контроль

Marketing completeness never equals implementation proof. Public claims remain runtime/manual-evidence gated.

A18 detail:
`docs/context/PRAMIO_A18_PP4_MARKETING_MINIAPP_WHITELIST_2026-08-08.md`

## A18 — final MAX Mini App concept

Final bottom navigation:
1. Сводка
2. Лиды
3. Контент
4. Механики
5. Ещё

Mini App contains the maximum useful daily work inside MAX:
- CRM;
- quick content;
- buttons;
- lead magnets;
- scenarios;
- moderation;
- channel/chat operations;
- diagnostics;
- short analytics.

Full Web is an enhancement for heavy operations, not the critical mobile path.

## A18 — Russian mobile-Internet white-list architecture

Important product constraint:
MAX itself being reachable does **not** prove that an arbitrary developer-hosted Mini App domain is reachable during restricted mobile Internet.

Preferred Mini App critical path:

`https://mini.pramio.ru/`

with same-origin API ingress:

`https://mini.pramio.ru/api/web/v1/*`

The Mini App browser should not require `api.pramio.ru` as a second origin for ordinary daily work. `/api` reverse-proxies to the same shared AdminKit backend.

Critical production infrastructure must be placed in Russian locations:
- Mini/static ingress;
- backend compute;
- PostgreSQL;
- critical object storage;
- critical observability/logging.

Critical frontend must not depend on foreign CDN/fonts/analytics/captcha/error tracking/arbitrary media hosts. Official MAX Bridge on `st.max.ru` remains the platform-hosted dependency.

Mini App network states:
- ONLINE_FULL;
- ONLINE_RESTRICTED;
- SERVER_UNREACHABLE.

If server is unavailable, only last-known read snapshot and explicit local drafts are allowed. No false mutation success and no silent destructive queue.

White-list gates:
- WHITELIST_ARCHITECTURE_READY
- WHITELIST_RUNTIME_TESTED
- WHITELIST_INCLUDED

Only externally confirmed `WHITELIST_INCLUDED` allows a public claim that the Mini App remains available during restricted mobile Internet.

## White-list-friendly gift delivery

Prefer:
AdminKit backend -> MAX Bot API -> file/message/attachment inside MAX.

Do not make the core gift-delivery flow depend on arbitrary external file hosting.

## Canonical Work tasks

### B1 — CURRENT CANON
`docs/context/PRAMIO_B1_WORK_TASK_A18_WHITELIST_RECONCILED.md`

This supersedes A13 B1 where network/origin architecture differs. A13 signed-initData security semantics remain mandatory.

### B2
`docs/context/PRAMIO_B2_WORK_TASK_A17.md`

### B3
`docs/context/PRAMIO_B3_WORK_TASK_A16_RECONCILED.md`

### B4
`docs/context/PRAMIO_B4_WORK_TASK_A17.md`

### B5
`docs/context/PRAMIO_B5_WORK_TASK_A17.md`

Run sequentially. Each later stage receives the ACCEPTED SHA from the previous stage.

Default for every B-stage: **NO DEPLOY**.

## Remaining work after A18

### User / real devices
- upload and accept latest Web candidate on real devices;
- register/open Mini App in real MAX and test iOS/Android;
- perform real restricted-mobile/white-list tests when such network state is available;
- provide screenshots/evidence for defects.

### User / business / external
- seller legal details;
- prices / plan limits / trial;
- YooKassa / T-Business commercial answers/provider decision;
- accountant tax/VAT/KKT model;
- lawyer final legal review;
- external confirmation/inclusion of Pramio Mini App origin in the Russian mobile white-list if pursued.

### Work / Codex
- B1 real signed MAX auth/session/tenant + A18 same-origin Mini ingress;
- B2 PostgreSQL CRM/API;
- B3 real content/MAX mechanics and cross-surface synchronization;
- B4 payment provider(s)/webhooks/entitlements/refunds/fiscal integration;
- B5 persisted analytics/audit/export/security/load/backup + restricted-network dependency acceptance;
- production DNS/ENV/runtime/deploy only after separate explicit approval.

## Chat exhaustion gate after A18

Known product-definition, local frontend concept/prototype, PP4 marketing-accounting, surface architecture, onboarding, marketing/public-page planning and Work-task planning are now complete.

A new normal-Chat task is needed when:
- manual testing reveals a defect;
- Work returns SHA/tests/evidence for acceptance;
- provider/legal/accounting/owner inputs change a decision;
- white-list inclusion/reachability facts change;
- a new product requirement appears.

This does not mean production-ready. It means the remaining known work requires real devices/MAX/restricted-network evidence, owner/external inputs, or actual engineering/runtime execution.

## Supersession

Current canon:

`A1–A18 Chat preparation complete -> manual/external gates + B1–B5 engineering`

Use A18 B1 task, not A13/A11 B1 tasks.
