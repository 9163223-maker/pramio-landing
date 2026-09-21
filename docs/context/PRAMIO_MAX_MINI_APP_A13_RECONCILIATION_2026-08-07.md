# A13 — MAX Mini App Contract & Acceptance Reconciliation

Status: COMPLETE / SUPERSEDES A9-A11 WHERE MINI APP CHANGES THE CONTRACT

## What changed

A12 exposed a structural omission: the product has three surfaces, not two.

A13 reconciles the server and acceptance model before Work starts.

No production code, PostgreSQL, ENV, Timeweb runtime or deploy was changed.

## Three surfaces

- MAX Bot — push/actions/wizards/deep-links.
- MAX Mini App — daily rich work inside MAX.
- Web Cabinet — heavy/full workspace.

## Auth model

### Full Web from Bot
One-time short-lived token -> secure API session.

### Mini App
Signed `window.WebApp.initData` -> server validation -> same API session model.

Official MAX validation requirements incorporated:
- raw WebAppData;
- exactly one hash;
- duplicate parameters rejected;
- URL decoding;
- alphabetic sorting;
- launch_params joined by newline;
- HMAC-SHA256 secret derivation using `WebAppData` + BOT_TOKEN;
- HMAC comparison;
- auth_date freshness.

`initDataUnsafe` is not trusted.

## Mini -> Web handoff

Mini App does not pass its API session secret in a URL.

It asks backend for a new one-time login token, then opens:
`https://app.pramio.ru/login/max?token=...`

This preserves the existing Web login model.

## start_param

`start_param` is a navigation hint only.

Even if its signature is valid, it does not prove authorization to the referenced lead/post/channel. Resource access remains tenant/capability checked.

## Session/CORS

Both frontends call `api.pramio.ru`.

Target session cookie:
`__Host-pramio_session`

- host-only API cookie;
- Secure;
- HttpOnly;
- SameSite=Lax or stricter.

Credentialed CORS:
- exact `app.pramio.ru`;
- exact `mini.pramio.ru`;
- explicit test origins only;
- never wildcard with credentials.

## Work consequence

The A11 B1 task is obsolete.

Use the A13 reconciled B1 task.

B1 now builds the shared identity/access foundation once for Bot -> Web and Mini App -> API -> Web handoff.

## Product/frontend consequence

A12 v0.1 is only the product/interaction prototype.

Production Mini App UI should later adopt MAX UI components where practical and be manually accepted inside real MAX on:
- iOS;
- Android;
- desktop/web MAX where supported.

## Official MAX sources verified 2026-08-07

- WebAppData validation:
  https://dev.max.ru/docs/webapps/validation
- MAX Bridge:
  https://dev.max.ru/docs/webapps/bridge
- Mini App connection/direct start:
  https://dev.max.ru/docs/webapps/introduction
