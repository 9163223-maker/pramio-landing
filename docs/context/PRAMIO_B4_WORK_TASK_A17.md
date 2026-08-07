# WORK TASK TEMPLATE — B4 BILLING

Use only after B3 acceptance. Replace `<B3_ACCEPTED_SHA>`.

Repository: `9163223-maker/amio-comments-max`
Branch: `agent/issue-298-intermediate-remediation-deploy`
Starting HEAD: `<B3_ACCEPTED_SHA>`

FIRST: verify remote HEAD exactly. If different, STOP.
NO NEW BRANCH. NO DEPLOY.

## Inputs
A7 provider-neutral contract
A8 legal/compliance contract
A9/A13 server contract
A10 security/gates
Owner/provider commercial decision when available

## Scope
- subscription domain;
- normalized payments;
- provider adapter(s): YooKassa and/or T-Business;
- checkout;
- server-verified notifications;
- durable notification inbox/dedup;
- recurring consent/version log;
- cancel/resume renewal;
- payment-instrument refusal;
- refunds;
- server-derived entitlements;
- receipt/fiscal adapter integration only after actual business/tax model is supplied.

## Mandatory rules
Browser return URL NEVER grants entitlement.
Provider secrets and reusable payment refs are server-only.
Every mutation is idempotent.
Saved-instrument refusal blocks later periodic charge on that instrument.
Provider webhook must be verified before state mutation.

## Required A10 cases
B4-BILLING-001 through B4-BILLING-007
X-SEC-001
X-IDEMP-001
X-AUTHZ-001
X-ERROR-001

## If provider choice is not final
Implement normalized domain + adapter interface/test doubles first.
Do not invent commercial credentials or live endpoints.

## Forbidden
No live charge.
No production deploy.
No fake KKT/VAT/tax values.
No unrelated CRM/content changes.

## Report
Starting/result SHA, files, migrations, provider sandbox evidence, idempotency, webhook verification, entitlements proof, cases, blockers, NO DEPLOY.
