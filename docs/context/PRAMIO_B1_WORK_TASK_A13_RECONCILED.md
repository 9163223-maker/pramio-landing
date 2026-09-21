# WORK TASK — PRAMIO / АДМИНКИТ B1 (A13 RECONCILED)

## Status

This task **SUPERSEDES** the A11 `PRAMIO_B1_WORK_TASK.md`.

Reason: A12 introduced MAX Mini App as a first-class product surface. B1 must establish one shared auth/session/tenant foundation for both Mini App and full Web, otherwise authentication would be redesigned twice.

## Role

You are the technical executor in Work / GPT-5.6 Sol High.

No product discovery. Use A12/A13 + A9/A10 semantics as frozen product input.

## Repository / branch

Repository:
`9163223-maker/amio-comments-max`

Branch:
`agent/issue-298-intermediate-remediation-deploy`

Last verified backend HEAD:
`3f0c7716c90181eaf9c583febd7938ab25f89e1e`

### Mandatory first action

Re-check the actual remote HEAD before any write.

- If equal to `3f0c7716c90181eaf9c583febd7938ab25f89e1e`: continue.
- If different: STOP and report actual SHA. Do not code until confirmed.

Do not create a new branch.

## B1 scope — shared foundation for THREE surfaces

Surfaces:
1. MAX Bot
2. MAX Mini App
3. Full Web Cabinet

B1 implements only auth/session/access/read-only bootstrap and cross-surface handoff.

### A. Existing Web login
Implement/retain:
MAX bot -> short-lived one-time token -> `/auth/max/exchange` -> secure API session.

Requirements:
- TTL 1–3 min;
- atomic one-time consume;
- reuse/expired rejection;
- no bot token in browser.

### B. MAX Mini App signed launch auth

Implement:
`POST /api/web/v1/auth/max/webapp/exchange`

Input:
- raw `window.WebApp.initData`;
- optional platform/version metadata.

Server MUST:
1. parse WebAppData;
2. reject duplicate parameters and duplicate/missing `hash`;
3. URL-decode values as required;
4. sort parameters and build launch_params;
5. derive secret_key with official MAX HMAC-SHA256 WebAppData algorithm;
6. compare signature safely;
7. reject stale `auth_date` (target max age 3600 sec);
8. only AFTER validation map MAX user -> AdminKit user/workspace;
9. establish the same secure session model used by full Web;
10. return only safe launch/user/workspace data.

`window.WebApp.initDataUnsafe` is presentation-only and MUST NOT authorize anything.

BOT_TOKEN stays server-only.

Official basis:
- MAX WebApp validation docs;
- MAX Bridge initData/initDataUnsafe contract.

### C. start_param deep-link routing

Validated `start_param` may hint:
- lead
- post
- diagnostics
- campaign/context

It is never authorization.

Any referenced object is separately tenant/capability checked.

### D. Mini App -> full Web handoff

Implement:
`POST /api/web/v1/auth/max/web-handoff`

From authenticated Mini App session:
- create new one-time Web login token;
- TTL target 1–3 min;
- token one-time;
- return allow-listed `https://app.pramio.ru/login/max?token=...` URL;
- NEVER put API session secret in URL.

### E. Common session
- cookie on API host;
- Secure;
- HttpOnly;
- SameSite=Lax or stricter unless reviewed constraint;
- no session secret in localStorage;
- session expiry/logout;
- server workspace membership;
- server role/capabilities.

### F. CORS
Credentialed API calls:
- exact allowlist for `https://app.pramio.ru`;
- exact allowlist for `https://mini.pramio.ru`;
- configured test origins only when explicitly needed;
- no wildcard origin with credentials.

### G. Read-only bootstrap
Only:
- session;
- workspaces;
- accessible MAX channels;
- basic diagnostics/read status.

No B2 CRM writes.
No B3 content publishing/scheduler.
No B4 payments.
No B5 analytics implementation.

## Contracts

Authoritative for B1:
- `PRAMIO_A13_OPENAPI_RECONCILED.yaml`
- `PRAMIO_A13_E2E_RECONCILED.json`
- `PRAMIO_A13_SECURITY_RECONCILED.json`
- `PRAMIO_A13_B_STAGE_GATES_RECONCILED.json`
- `PRAMIO_A13_SURFACE_RESPONSIBILITY_MATRIX.json`

A9/A10 remain historical foundations but A13 supersedes them where Mini App is concerned.

## Required A10/A13 cases

Existing:
- B1-AUTH-001
- B1-AUTH-002
- B1-SESSION-001
- B1-TENANT-001
- B1-LOGOUT-001
- X-SEC-001
- X-IDEMP-001
- X-AUTHZ-001
- X-ERROR-001

New Mini App:
- B1-MINI-AUTH-001
- B1-MINI-AUTH-002
- B1-MINI-AUTH-003
- B1-MINI-AUTH-004
- B1-MINI-AUTH-005
- B1-MINI-DEEP-001
- B1-MINI-HANDOFF-001
- B1-MINI-CORS-001
- B1-MINI-BRIDGE-001

Every required case must be PASS/FAIL/BLOCKED with evidence.

## PostgreSQL

B1 may add only minimal persistence required for:
- one-time Web tokens;
- session;
- Mini App launch/security metadata if necessary;
- workspace membership/roles if not already canonical;
- audit/security metadata directly needed by B1.

Any schema change:
- narrow migration;
- preserves production data;
- rollback/reversibility assessment;
- explicitly listed in report.

No unrelated schema redesign.

## Forbidden

Without separate approval:
- new branch;
- ENV change;
- Timeweb runtime/config change;
- production deploy;
- unrelated AdminKit fixes.

Do not implement:
- CRM writes;
- scheduler/outbox/publication;
- payment provider integration;
- analytics redesign;
- landing redesign.

## Tests

Mandatory evidence:
- official MAX HMAC validation test vector or deterministic local fixture;
- invalid signature;
- duplicate hash/key;
- stale auth_date;
- initDataUnsafe forgery cannot authenticate;
- start_param cannot cross tenant;
- Mini->Web handoff single use + expiry;
- secure cookie;
- exact CORS origins;
- Web one-time token single use;
- logout;
- tenant/role forgery denial;
- idempotency conflict;
- request_id on errors;
- no BOT_TOKEN/session/provider-secret leakage.

## Final report

1. STARTING_REMOTE_HEAD
2. RESULT_SHA
3. changed files
4. migrations
5. exact A10/A13 case matrix
6. test commands + exact PASS/FAIL counts
7. security checklist
8. blockers
9. confirmation:
   - same branch;
   - no unrelated changes;
   - no ENV changes unless authorized;
   - no Timeweb changes unless authorized;
   - NO DEPLOY.

## Deploy

**DO NOT DEPLOY.**

Stop after commit + tests + report.
