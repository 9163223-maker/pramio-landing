# WORK TASK TEMPLATE — B3 CONTENT + MAX MECHANICS

Status: PREPARED BY A16. Use only after B2 is accepted and replace `<B2_ACCEPTED_SHA>` with the actual accepted SHA.

## Repository / branch

Repository: `9163223-maker/amio-comments-max`  
Branch: `agent/issue-298-intermediate-remediation-deploy`  
Starting HEAD: `<B2_ACCEPTED_SHA>`

First action: verify remote HEAD exactly. If different, STOP.

No new branch. No deploy.

## Purpose

B3 is now an umbrella stage with four SEQUENTIAL waves. Do not implement all waves in one uncontrolled rewrite.

### B3.1 — Content / scheduler / outbox
- canonical draft/edit;
- schedule/cancel;
- publish-now;
- retry;
- server scheduler;
- outbox/idempotency;
- MAX rate limits/retries;
- message IDs;
- MAX webhook inbox/dedup;
- snapshots where available.

Gate: original A10/A13 B3 content/webhook cases.

### B3.2 — Buttons + Lead Magnets + Scenarios
Create shared server domains/API so Bot, Mini App and Web reference the SAME identities.

Buttons:
- list/create/get/update/delete/preview;
- confirmed kinds: URL and callback;
- post-scoped ownership;
- optimistic versioning;
- scenario references canonical callback button id.

Lead magnets:
- material types: link/text/attachment;
- recipient message;
- independent condition toggles;
- conditions confirmed by product: first claim, channel subscription, correct answer, phone shared, bot started;
- test delivery;
- post/channel/tenant scoping;
- native reaction-user condition stays platform blocked.

Scenarios:
- list/create/get/update/delete;
- enable/disable/test;
- template_key is UX metadata;
- canonical trigger/steps are persisted;
- Button Reply references canonical button id;
- duplicate triggers are idempotent.

Mandatory A16 cases:
B3-MECH-BTN-001
B3-MECH-BTN-002
B3-MECH-BTN-003
B3-MECH-GIFT-001
B3-MECH-GIFT-002
B3-MECH-GIFT-003
B3-MECH-GIFT-004
B3-MECH-GIFT-005
B3-MECH-SCN-001
B3-MECH-SCN-002
B3-MECH-SCN-003
B3-MECH-SYNC-001

### B3.3 — Comments / Moderation / Highlight / Polls
Expose canonical server state and MAX synchronization for existing product capabilities.

Do not collapse:
- discussion banner;
- photo in comments;
- reactions/replies;
- CTA buttons under posts

into one entity.

Mandatory:
B3-MECH-COMMENTS-001
B3-MECH-POLL-001
B3-MECH-HIGHLIGHT-001

Any MAX limitation must be represented explicitly, never synthesized.

### B3.4 — Cross-surface mechanics compatibility
Verify:
Bot -> server -> Mini/Web
Mini -> server -> Bot/Web
Web -> server -> Bot/Mini

For one button, one lead magnet and one scenario:
create on surface A -> reopen on B -> edit on B -> reopen on C -> same id/version/state.

Also verify referrals/platform-mechanics compatibility as applicable.

## Data/source rules

PostgreSQL/server domain is canonical business state.
MAX is platform state/transport.
Browser localStorage is not authoritative after server integration.
Existing bot flow state must be migrated/wrapped, not silently duplicated.

## Explicitly forbidden

- B4 payment implementation;
- B5 analytics redesign;
- unrelated AdminKit fixes;
- new branch;
- ENV/Timeweb change;
- production deploy.

## Report

For EACH wave:
- starting SHA;
- result SHA;
- changed files;
- migrations;
- exact cases PASS/FAIL/BLOCKED;
- test commands/counts;
- platform blockers;
- no-deploy confirmation.

Do not declare B3 accepted until all approved B3 waves pass.
