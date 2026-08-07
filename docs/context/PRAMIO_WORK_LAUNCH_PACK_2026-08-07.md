# PRAMIO — WORK LAUNCH CONTEXT

**Updated:** 2026-08-07  
**A-phase:** COMPLETE through A11  
**Next engineering stage:** B1

## Current role split

- Main Chat account: product lead / UX architect / acceptance owner. Does not implement production code.
- Second account in Work / GPT-5.6 Sol High: technical executor.
- User transfers tasks, reports, SHA, tests and production screenshots between accounts.

## Backend target

Repository: `9163223-maker/amio-comments-max`  
Branch: `agent/issue-298-intermediate-remediation-deploy`  
A11 verified HEAD: `3f0c7716c90181eaf9c583febd7938ab25f89e1e`

This HEAD was rechecked during A11. Work must recheck it again immediately before any write.

Do not create a new branch unless explicitly approved.

## A1–A11 completed

A1 Product UI Canon  
A2 Responsive System & Device Matrix  
A3 Frontend Hardening  
A4 Account / Workspace / Roles UX  
A5 CRM & Content Production UX  
A6 Analytics & Data Provenance  
A7 Billing Product & Universal Payment Contract  
A8 Legal / Privacy & Commercial Readiness  
A9 Full Server Contract / OpenAPI  
A10 Acceptance & Security Pack  
A11 Work Launch Pack

## Current frontend candidate

`pramio-timeweb-test-v0.3.11-a8-legal-commercial-readiness-public_html.zip`

Real-device consolidated manual acceptance remains pending.

## Server contract

A9 freezes:
- one-time MAX auth;
- secure session;
- tenant/roles/capabilities;
- CRM;
- content/scheduler/outbox;
- analytics provenance;
- diagnostics;
- billing/entitlements;
- MAX webhook;
- payment webhook;
- normalized errors;
- idempotency.

## Acceptance

A10 contains 33 deterministic E2E cases plus security/source-of-truth/stage gates.

Every Work report must map required A10 case IDs to PASS/FAIL/BLOCKED.

## B sequence

B1 Shell + Auth + Read-only  
B2 CRM + PostgreSQL  
B3 Content + MAX API  
B4 Billing  
B5 Analytics + Audit + Production Readiness

Do not run later B stages in parallel unless explicitly approved.

## B1 scope

Only:
- short-lived one-time MAX login;
- exchange to secure session;
- workspace membership;
- server roles/capabilities;
- session expiry/logout;
- read-only workspace/channels;
- read-only diagnostics bootstrap.

Explicitly not B1:
- CRM writes;
- content publishing/scheduler;
- payment integration;
- analytics implementation.

## Global restrictions

Without explicit approval:
- no new branch;
- no ENV change;
- no Timeweb config/runtime change;
- no production deploy;
- no unrelated АдминКИТ fixes.

PostgreSQL changes only when the current B-stage explicitly requires them, using narrow migrations and reporting.

## Deploy policy

B1–B5 default to NO DEPLOY.  
Deploy is a separate gate after code acceptance and explicit user authorization.

## Work handoff

Use the A11 artifact `PRAMIO_B1_WORK_TASK.md` verbatim as the first Work assignment.

The executor must first verify remote branch HEAD. If it differs from `3f0c7716c90181eaf9c583febd7938ab25f89e1e`, stop and report the actual SHA before coding.
