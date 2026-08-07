# PRAMIO / АДМИНКИТ — FINAL CURRENT CONTEXT AFTER A17

**Updated:** 2026-08-07  
**Chat-planning/front-end phase:** COMPLETE through A17  
**Next engineering stage:** B1  
**Manual acceptance:** pending  
**Production deploy:** not performed

## Three-surface product

АдминКИТ is one server product with three clients:

1. **MAX Bot** — notifications, one-tap actions, short wizards, contextual help and deep-links.
2. **MAX Mini App** — daily work inside MAX: leads, quick content, buttons, lead magnets, scenarios, diagnostics and short analytics.
3. **Web Cabinet** — large CRM, board/search/filter/export, full calendar/editor, full mechanics management, comparative analytics, team, billing, settings and legal.

**Server/PostgreSQL is the canonical business state.** No surface may become an independent source of truth.

## Backend target

Repository: `9163223-maker/amio-comments-max`  
Branch: `agent/issue-298-intermediate-remediation-deploy`  
Verified HEAD after A17: `3f0c7716c90181eaf9c583febd7938ab25f89e1e`

Work MUST recheck remote HEAD before any write. If different: STOP and report actual SHA.

## A14 — Web consolidated responsive hotfix

Latest Web candidate:
`pramio-timeweb-test-v0.3.11.1-a14-responsive-hotfix-public_html.zip`

Fixed:
- 900–1100px navigation-loss cascade defect;
- section-header absolute-action containing block;
- compact 82px rail title/aria labels.

A1–A8 product/data behavior preserved. Manual device acceptance still required.

## A15 — MAX Mini App functional frontend

Latest Mini App candidate:
`pramio-max-miniapp-a15-functional-v0.3.zip`

Local functional demo includes:
- Leads CRUD/status/result/next-contact/comments/tasks;
- Content draft/schedule/cancel/retry;
- Analytics provenance;
- Diagnostics/profile;
- MAX Bridge fallback;
- start_param routing;
- signed-initData server adapter stub;
- Mini -> Web one-time handoff stub;
- Buttons CRUD;
- Lead magnets CRUD with independent conditions;
- Scenarios CRUD;
- scenario -> canonical callback button identity.

Real auth and real MAX operations remain B1/B3.

## A16 — Product surface coverage

Coverage includes channels, comments, comments banner/photo/reactions, moderation, post editor, buttons, lead magnets, scenarios, highlight, polls, CRM, analytics, billing, referrals, team, settings, help and legal.

Critical finding: A9/A13 did not fully model all existing AdminKit mechanics as shared server domains.

B3 is therefore reconciled as sequential waves:
- B3.1 Content / scheduler / outbox / MAX message integration;
- B3.2 Buttons + Lead Magnets + Scenarios;
- B3.3 Comments + Moderation + Highlight + Polls;
- B3.4 Cross-surface mechanics compatibility / referrals/platform-mechanics.

A16 defines 15 deterministic B3 mechanics E2E cases.

## Onboarding canon

States cover first open, no channel, bot not admin, missing permission, no mechanics, no leads, no content, role limitation, plan limit, upstream platform blocker, session expired and dependency error.

No blank screen is acceptable onboarding.

## A17 — Marketing / public launch

Parent positioning:
`Pramio — управление бизнесом в мессенджерах.`

Product positioning:
`АдминКИТ — управление бизнесом в MAX.`

Prepared:
- landing candidate;
- three-surface message;
- capabilities and first-value flow;
- CTA system;
- SEO/meta/schema structure;
- event taxonomy;
- tariff architecture;
- public page templates for tariffs, offer, privacy, separate PD consent, subscription, refunds, requisites and support.

Tariff architecture inherited from current product gates:
- Free;
- Start;
- Pro;
- Business.

Prices/trial/limits are owner decisions and were not invented.

## Canonical Work tasks

B1: `docs/context/PRAMIO_B1_WORK_TASK_A13_RECONCILED.md`  
B2: `docs/context/PRAMIO_B2_WORK_TASK_A17.md`  
B3: `docs/context/PRAMIO_B3_WORK_TASK_A16_RECONCILED.md`  
B4: `docs/context/PRAMIO_B4_WORK_TASK_A17.md`  
B5: `docs/context/PRAMIO_B5_WORK_TASK_A17.md`

Run sequentially. Each later stage receives the ACCEPTED SHA from the previous stage.

Default for every B-stage: **NO DEPLOY**.

## Remaining work — only external/manual/engineering

### User / real device
- upload latest Web candidate and perform real-device acceptance;
- register/open Mini App URL in real MAX and perform real MAX acceptance;
- provide screenshots/evidence if defects appear.

### User / business / external
- seller legal details;
- prices / plan limits / trial;
- YooKassa / T-Business commercial answers and provider decision;
- accountant tax/VAT/KKT model;
- lawyer final offer/privacy/refund/consent review.

### Work / Codex engineering
- B1 real auth/session/MAX WebAppData validation/CORS/tenant access;
- B2 PostgreSQL CRM/API;
- B3 real MAX content/mechanics shared server domains and cross-surface E2E;
- B4 real payment providers/webhooks/entitlements/refunds/fiscal integration;
- B5 persisted analytics/audit/export/security/load/backup;
- production DNS/ENV/runtime/deploy only after separate explicit approval.

## Chat exhaustion gate

After A14–A17, there is no known remaining product-definition, local frontend-prototype, contract, acceptance-plan, onboarding, marketing-copy, public-page-template or Work-task-planning item that must be completed before B1.

A new normal-Chat task is needed only if:
- manual testing reveals a product/UI defect;
- Work returns evidence requiring acceptance/remediation;
- owner/provider/legal/accounting inputs change a frozen decision;
- a new product requirement appears.

This does not mean production-ready. It means the remaining known work requires real devices/MAX, owner/external inputs, or real engineering/runtime execution.

## Supersession

Older A11-only statements are incomplete after A12–A17.

Current canon:
`A1–A17 Chat preparation complete -> manual acceptance + B1–B5 engineering`.

Use A13 B1 task, not the old A11 B1 task.
