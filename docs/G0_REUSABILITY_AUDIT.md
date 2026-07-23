# G0 Reusability Audit — Trackgle Migration Tooling

Source: uploaded Trackgle repository snapshot (`j7trackgle.zip`), audited 2026-07-23.

## Result
The existing Trackgle audit classifies migration-related components as:
- GENERIC_REUSABLE: 16
- REQUIRES_EXTRACTION: 23
- TRACKGLE_SPECIFIC: 31
- DEPRECATED: 6

This confirms the reusable generator should extract algorithms and contracts, not copy the Trackgle migration directory wholesale.

## High-value reusable/extractable components observed

### Generic or nearly generic
- `migration/scripts/scan.mjs`: SQL + TypeScript discovery orchestrator. Needs configurable project roots/paths.
- `migration/scripts/lib/manifest-schema.mjs`: status/category vocabulary and stable IDs.
- `migration/scripts/lib/contract-scanner.mjs`: TypeScript service-interface method extraction.
- `migration/scripts/build-manifest.mjs`: capability manifest construction; output path should become configurable.
- Drift/sync concepts: classify ADDED/CHANGED/REMOVED/UNMAPPED/STALE/SECURITY_REVIEW_REQUIRED and preserve explicit human status rather than overwriting security-sensitive changes.

### Requires extraction/parameterization
- `lib/sql-scanner.mjs`: purpose-built PostgreSQL/Supabase migration scanner. Generic value is strong, but defaults/seed/publication/storage assumptions must become adapters/config.
- `lib/ts-scanner.mjs`: TypeScript Compiler API scanning for `.from`, `.rpc`, `.channel`, storage, functions, and auth usage. Client import paths/variable names/project layout must be configurable.
- `build-service-manifest.mjs`: service readiness mapping is reusable but Trackgle directory/status conventions must be pluggable.
- `schema-compiler.mjs`: chronological final-state reconstruction is core reusable logic, but must be extracted with scoped object identities and configuration rather than Trackgle expectations.
- `generate-schema-baseline.mjs`: generation concepts are reusable; hand-authored Trackgle identity/RLS/function assumptions must not become core.
- bootstrap reconstruction/verification: reusable mechanism, but expected counts, file ordering, roles, and project artifacts must derive from IR/dependency planning.

### Trackgle-specific
- `lib/domain-map.mjs`: maps Trackgle's concrete tables/RPCs/buckets/functions to Trackgle domains. Replace with discovered/project config; retain only as a fixture.
- Trackgle service/domain contracts, Jira/notification/WhatsApp semantics, concrete table lists, role names, AWS resource names, and readiness counts.

### Deprecated pattern
Hand-maintained AWS RLS/policy ports that collect historical CREATE statements without chronological DROP resolution must not be used as generator source of truth. Generated final-state artifacts must derive from corrected compiler/introspection state.

## Specific hardcoding found in the source audit
- `supabase/migrations`, `src`, `supabase/functions` directory conventions.
- default `public` schema assumptions.
- `supabase_realtime` publication convention.
- `storage.buckets` conventions.
- Trackgle seed-table special cases such as `role_permissions` and `app_settings`.
- frontend Supabase client import/name conventions.
- Trackgle domain map covering concrete tables/RPCs/buckets/edge functions.
- Trackgle service-provider directory and `notImplemented(... AWS_PROVIDER_STATUS...)` status inference.

These must become project configuration, adapters, discovered evidence, or fixture-only data.

## Extraction rule
Do not copy code verbatim merely because the audit labels it GENERIC_REUSABLE. First preserve its tests/behavior, remove path/global assumptions, define typed IR inputs/outputs, and prove it against Trackgle plus a second unrelated project.

## G0 conclusion
G0_AUDIT_COMPLETE = YES
GENERIC_COMPONENTS_FOUND = 16
EXTRACTION_REQUIRED = 23
TRACKGLE_SPECIFIC = 31
DEPRECATED = 6
IR_READY_FOR_IMPLEMENTATION = PARTIAL

IR is architecturally ready to specify, but implementation should wait until the versioned schema and evidence/reconciliation contracts are committed.