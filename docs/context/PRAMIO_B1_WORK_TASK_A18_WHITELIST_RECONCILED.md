# WORK TASK — PRAMIO / АДМИНКИТ B1 (A18 WHITELIST RECONCILED)

## Status

This task **SUPERSEDES** the A13 B1 task where network/origin architecture differs.

A13 security/auth semantics remain mandatory.

## Repository / branch

Repository:
`9163223-maker/amio-comments-max`

Branch:
`agent/issue-298-intermediate-remediation-deploy`

Last known verified backend HEAD before A18:
`3f0c7716c90181eaf9c583febd7938ab25f89e1e`

### Mandatory first action

Re-check actual remote HEAD before any write.

- If equal: continue.
- If different: STOP and report actual SHA.

Do not create a new branch.

## B1 goal

Build one shared server auth/session/tenant foundation for:
1. MAX Bot
2. MAX Mini App
3. Full Web Cabinet

B1 remains auth/session/access/read-only bootstrap only.

## A. Full Web one-time login

Keep the existing target:
MAX bot -> one-time short-lived token -> `/auth/max/exchange` -> secure Web session.

Requirements:
- TTL 1–3 min;
- atomic one-time consume;
- expired/reuse rejection;
- BOT_TOKEN never enters browser.

## B. MAX Mini App signed launch

Implement:
`POST /api/web/v1/auth/max/webapp/exchange`

Input:
- raw `window.WebApp.initData`;
- optional platform/version metadata.

Server MUST:
1. parse WebAppData;
2. reject duplicate/missing hash and duplicate parameters;
3. build the official verification string correctly;
4. validate HMAC with server-side BOT_TOKEN;
5. safely compare signature;
6. reject stale auth_date; target max age 3600 seconds;
7. only after validation map MAX user -> AdminKit user/workspace;
8. establish secure server session;
9. return only safe user/workspace/capability data.

`window.WebApp.initDataUnsafe` is presentation/navigation context only and MUST NOT authorize anything.

## C. start_param

May route to:
- lead;
- post;
- button;
- lead magnet;
- scenario;
- moderation/context;
- diagnostics/campaign.

It is a route hint only.
Every referenced object gets a separate tenant/capability check.

## D. Mini App -> Web handoff

Authenticated Mini App can request a NEW one-time Web token.

Return only allow-listed `https://app.pramio.ru/login/max?token=...`.

Never put API session secret in URL.

## E. A18 same-origin Mini App ingress

Preferred browser critical path:

`https://mini.pramio.ru/`

and:

`https://mini.pramio.ru/api/web/v1/*`

Use same-origin reverse proxy to the shared AdminKit backend.

The Mini App browser should not require `api.pramio.ru` as a second origin for ordinary daily work.

This is an ingress/network architecture choice, NOT a second backend/domain truth.

Full Web may use its own same-origin ingress or the canonical API service according to final deployment architecture.

## F. Session/security

- Secure cookie;
- HttpOnly;
- SameSite=Lax or stricter unless reviewed constraint proves otherwise;
- no session secret in localStorage;
- expiry/logout;
- workspace membership server-side;
- role/capabilities server-side;
- tenant guard at service/DB boundary.

## G. White-list / constrained-mobile dependency policy

Mini App critical frontend must not depend at runtime on:
- foreign CDN;
- Google Fonts;
- foreign analytics;
- foreign captcha;
- foreign error tracking;
- arbitrary remote media hosts.

Use:
- system fonts;
- bundled CSS/JS/SVG/icons;
- first-party Russian-hosted assets.

Official MAX Bridge on `st.max.ru` is the platform-hosted dependency.

Do not claim that architecture proves white-list inclusion.

## H. Russia-location evidence

A18 architecture requires production critical compute/storage in Russia.

B1 final report must state evidence/status for:
- Mini App/static ingress location;
- backend/app compute location;
- PostgreSQL location;
- critical object storage location;
- critical observability/logging location.

Do not read or expose secrets.

If these resources have not yet been created/configured, report:
`REQUIRES_PRODUCTION_CONFIGURATION`

Do NOT change Timeweb/ENV/runtime without separate authorization.

## I. Connectivity contract

Provide a lightweight server connectivity/session status endpoint or compatible read so the Mini App can distinguish:
- API reachable/session valid;
- session expired;
- dependency/server unavailable.

Do not infer a “white-list mode” from browser heuristics.

Frontend modes are based on actual reachability.

## J. Read-only bootstrap

Only:
- session;
- workspaces;
- accessible channels;
- basic diagnostics/read status.

No B2 CRM write.
No B3 content/mechanics implementation.
No B4 payment integration.
No B5 analytics implementation.

## Existing required A10/A13 cases

- B1-AUTH-001
- B1-AUTH-002
- B1-SESSION-001
- B1-TENANT-001
- B1-LOGOUT-001
- B1-MINI-AUTH-001
- B1-MINI-AUTH-002
- B1-MINI-AUTH-003
- B1-MINI-AUTH-004
- B1-MINI-AUTH-005
- B1-MINI-DEEP-001
- B1-MINI-HANDOFF-001
- B1-MINI-BRIDGE-001
- X-SEC-001
- X-IDEMP-001
- X-AUTHZ-001
- X-ERROR-001

A13 cross-origin CORS case is superseded for the Mini App critical path by same-origin ingress. If any cross-origin API surface remains, exact-origin CORS still applies and wildcard credentials remain forbidden.

## New A18 cases

### B1-WL-001
Mini App auth/session succeeds through same-origin `/api` ingress and maps to the same canonical backend user/workspace.

### B1-WL-002
Critical Mini App runtime dependency audit finds no foreign CDN/font/analytics/captcha/error-tracking/media dependency.

### B1-WL-003
Changing ingress path/origin does not change tenant/role/capability/server identity semantics.

### B1-WL-004
Mini -> Web one-time handoff remains non-critical: Mini core continues even when external Web destination is unavailable.

### B1-WL-005
If API/server is unavailable, no API contract/frontend bootstrap can present a mutation as successfully committed.

## PostgreSQL

B1 may add only minimal persistence required for:
- one-time login tokens;
- sessions;
- workspace membership/roles if not already canonical;
- Mini App launch/security metadata where required;
- audit/security metadata directly required by B1.

Any schema change:
- narrow migration;
- preserves production data;
- rollback/reversibility assessment;
- explicitly reported.

No unrelated redesign.

## Forbidden

Without separate approval:
- new branch;
- ENV change;
- Timeweb runtime/config change;
- production infrastructure creation/migration;
- production deploy;
- unrelated AdminKit fixes.

Do not implement B2/B3/B4/B5 scope.

## Tests / evidence

Mandatory:
- valid MAX signed initData fixture;
- tampered signature;
- duplicate hash/key;
- stale auth_date;
- initDataUnsafe forgery cannot authenticate;
- cross-tenant start_param denial;
- Web one-time token single use;
- Mini->Web handoff single use/expiry;
- secure cookie;
- tenant/role forgery denial;
- idempotency conflict;
- error request_id;
- no secret leakage;
- same-origin Mini ingress test;
- runtime dependency-origin audit;
- location evidence status;
- no false success on server-unavailable path.

## Final report

1. STARTING_REMOTE_HEAD
2. RESULT_SHA
3. changed files
4. migrations
5. A10/A13/A18 case matrix
6. exact test commands/counts
7. security checklist
8. dependency-origin audit
9. Russian-location evidence status
10. blockers
11. confirmation:
   - same branch;
   - no unrelated changes;
   - no ENV changes unless authorized;
   - no Timeweb changes unless authorized;
   - NO DEPLOY.

## Deploy

**DO NOT DEPLOY.**

Stop after commit + tests + report.
