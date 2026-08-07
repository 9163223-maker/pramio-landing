# WORK TASK TEMPLATE — B5 ANALYTICS + AUDIT + PRODUCTION READINESS

Use only after B4 acceptance. Replace `<B4_ACCEPTED_SHA>`.

Repository: `9163223-maker/amio-comments-max`
Branch: `agent/issue-298-intermediate-remediation-deploy`
Starting HEAD: `<B4_ACCEPTED_SHA>`

FIRST: verify remote HEAD. If different, STOP.
NO NEW BRANCH. NO DEPLOY until a separate production gate.

## Scope
- persisted MAX metric snapshots;
- AdminKit event log;
- analytics provenance/completeness;
- coverage start/partial periods;
- CRM cohort reporting;
- audit;
- authorized exports;
- restart/retry recovery;
- tenant regression;
- security regression;
- backup/restore evidence;
- load/stress readiness.

## Mandatory data rules
Current MAX snapshot is not period growth.
No unique reach/viewer identity/reaction-author analytics without confirmed platform evidence.
No clicks→leads funnel without event-level binding.
Unattributed remains unattributed.

## Required A10 cases
B5-ANALYTICS-001
B5-ANALYTICS-002
B5-ANALYTICS-003
B5-ANALYTICS-004
B5-AUDIT-001
X-SEC-001
X-AUTHZ-001
X-ERROR-001

## Final technical acceptance
Also prove:
- backup restore;
- service restart;
- webhook/outbox recovery;
- no duplicate side effects;
- tenant isolation;
- secrets/log redaction;
- export authorization;
- reasonable load/stress result with limits documented.

## Deploy
Still NO DEPLOY inside B5 implementation task.
Production deploy is a separate explicit SHA gate after acceptance.
