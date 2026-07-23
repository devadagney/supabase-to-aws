# Verification Strategy

## Gate 1 — Static analysis
Validate syntax/types/tests, IR schema, unsupported constructs, disposition completeness, deterministic generation, drift, and absence of direct source-backend escapes where the service abstraction requires removal.

## Gate 2 — Source reconciliation
If live Supabase DB access exists, compare introspected current state with chronological migration-compiled final state. Report mismatches explicitly.

## Gate 3 — Disposable PostgreSQL reconstruction
Create a clean disposable PostgreSQL instance, apply generated bootstrap in exact dependency order, run structural checks, destroy it, and rerun from zero after any generator fix. Never hand-patch the database to hide generator defects.

Structural checks should cover tables, columns, enums/types, PK/FK/unique/check constraints, sequences, extensions, application functions excluding extension-owned objects, triggers using correct pg_catalog identity, indexes with awareness of automatically-created indexes, RLS-enabled tables, policies, roles/grants, and expected externalizations.

## Gate 4 — Runtime RLS matrix
For representative/all scoped tables, test positive same-tenant access and negative cross-tenant select/insert/update/delete, plus role-gated operations. Treat expected manual-review findings separately from surprises.

## Gate 5 — Generated infrastructure validation
Validate CloudFormation references, packaging, Lambda smoke behavior, IAM requirements, stateful replacement/deletion risk, API routes/integrations, secret references, VPC connectivity assumptions, and artifact hashes.

## Gate 6 — DEV deployment
Deploy only after approval. Confirm resources actually exist and code hashes/routes/config match intended artifacts. CloudFormation success is not behavioral proof.

## Gate 7 — Live capability verification
Exercise real auth/session/bootstrap, data gateway, workflows, storage, realtime, scheduled jobs, external integrations, and service contracts as applicable.

## Gate 8 — Parity verification
Compare AWS behavior with source behavior, including responses, authorization, side effects, errors/nulls, and UI-visible behavior. Only then mark PARITY_VERIFIED.

## Status vocabulary
DISCOVERED -> CLASSIFIED -> GENERATED_SCAFFOLD/MAPPED_NOT_IMPLEMENTED/BLOCKED -> IMPLEMENTED_LOCAL -> DEPLOYED_DEV -> LIVE_VERIFIED -> PARITY_VERIFIED.

Never skip status levels in reporting without evidence.