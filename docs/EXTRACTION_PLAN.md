# Extraction Plan

## Rule
Do not copy the Trackgle migration folder wholesale. Extract algorithms behind stable IR contracts and retain Trackgle-specific data as fixtures/configuration.

## Step 1 — Freeze regression evidence
Import representative synthetic fixtures/tests for every known compiler regression before refactoring: DROP TABLE/trigger lifecycle, trigger scoped identity, DROP POLICY/table parsing, policy names containing `on`, policy chronology, overloaded functions, enum/ALTER/CHECK/FK/sequence/extension/constraint parsing.

## Step 2 — Create core package
Implement versioned IR types/schema, evidence/confidence, scoped identities, lifecycle events, dispositions, readiness, deterministic serialization, reconciliation result types and manual-decision model.

## Step 3 — Extract chronological compiler
Move generic state-machine behavior from Trackgle `schema-compiler.mjs`. Inputs become ordered SQL statements/evidence; output becomes Database Final-State IR. Remove Trackgle counts/table names/roles/paths. Unsupported semantics must emit evidence + manual decision/failure.

## Step 4 — Extract analyzers
- Supabase migration analyzer from `sql-scanner.mjs`.
- TypeScript runtime analyzer from `ts-scanner.mjs`.
- Project discovery/path conventions behind configuration.
- New live PostgreSQL introspector for pg_catalog/information_schema/RLS/functions/triggers/grants/extensions/types.

## Step 5 — Reconciliation
Compare live DB vs compiled migration state. Preserve both evidence sets. Surface drift (`LIVE_ONLY`, `MIGRATION_ONLY`, `DIFFERS`) and do not generate destructive corrections automatically.

## Step 6 — Trackgle fixture
Store Trackgle-derived sanitized expectations/config under `fixtures/trackgle`; do not include credentials, account IDs, live endpoints, or production data. Use its known regression cases to prove extraction parity.

## Step 7 — Second-project gate
Analyze a second unrelated Lovable/Supabase project before building deep AWS generators. Confirm no Trackgle table/domain/role/resource assumptions in core.

## Step 8 — RDS generators
Generate dependency-ordered extensions/schema/constraints/indexes/sequences/auth compatibility/helpers/triggers/grants/RLS from IR and explicit transformations. No hand-maintained historical-policy aggregation.

## Step 9 — Verification harness
Disposable PostgreSQL bootstrap from zero, semantic structural checks, runtime RLS matrices, deterministic rerun. Fix generators, not the database.

## Step 10 — Runtime/AWS adapters
Classify actual runtime capabilities into AWS target classes; generate service/provider scaffolds with honest statuses. Preserve source contracts and side effects.

## Step 11 — CloudFormation
Generate parameterized capability-driven stacks. No hardcoded account, region, project names, Cognito IDs, API IDs, VPC IDs or Trackgle domains. Use secure secrets, private RDS, least privilege and change-set safety.

## Step 12 — CLI
Target commands: `analyze`, `plan`, `generate`, `generate --dry-run`, `diff`, `verify`, `status`, guarded `deploy`. Do not document unimplemented commands as working.

## Initial extraction candidates
1. manifest/status vocabulary -> core IR vocabulary.
2. schema compiler -> chronological compiler.
3. SQL scanner -> migration analyzer.
4. TS scanner -> runtime analyzer.
5. drift/sync -> reconciliation/change engine.
6. schema/triggers/RLS generators -> RDS generators after IR.
7. bootstrap reconstruction -> verification harness.
8. escape checker -> configurable provider-boundary verification.

## Keep fixture-only
Trackgle domain map, concrete table/RPC lists, org/Jira/notification/WhatsApp business semantics, fixed counts, AWS resource IDs/names, and historical readiness numbers.