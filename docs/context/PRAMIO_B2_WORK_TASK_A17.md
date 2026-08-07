# WORK TASK TEMPLATE — B2 CRM + POSTGRESQL

Use only after B1 acceptance. Replace `<B1_ACCEPTED_SHA>`.

Repository: `9163223-maker/amio-comments-max`
Branch: `agent/issue-298-intermediate-remediation-deploy`
Starting HEAD: `<B1_ACCEPTED_SHA>`

FIRST: verify remote HEAD exactly. If different, STOP.
NO NEW BRANCH. NO DEPLOY.

## Scope
Only canonical CRM persistence/API:
- leads CRUD;
- status new/work/won/lost;
- close requires result;
- closed_at;
- next contact;
- manager;
- comments;
- tasks complete/reopen;
- activity/audit;
- amount/currency;
- search/filter/pagination;
- multi-device/server persistence;
- tenant/role/capability enforcement;
- optimistic version conflict;
- idempotency.

## Required cases
A10:
B2-CRM-001
B2-CRM-002
B2-CRM-003
B2-CRM-004
B2-CRM-005
X-IDEMP-001
X-AUTHZ-001
X-ERROR-001

## PostgreSQL
Schema/migrations permitted only for B2 domain.
Migration must be narrow, preserve production data and report rollback assessment.

## Forbidden
No B3 mechanics/content integration except read-only foreign keys needed by canonical data model.
No B4 billing.
No B5 analytics redesign.
No ENV/Timeweb/deploy.

## Report
Starting HEAD, result SHA, changed files, migrations, exact tests/counts, case matrix, security findings, blockers, NO DEPLOY confirmation.
