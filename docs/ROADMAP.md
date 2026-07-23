# Roadmap

## G0 — Architecture and extraction audit
Audit existing Trackgle tooling at implementation/dependency level. Define core/plugin boundaries, evidence model, dispositions, ownership, config decisions, CloudFormation generalization rules, and versioned IR. Exit only when generic assumptions are proven rather than inferred from filenames.

## G1 — Core IR and evidence model
Implement versioned Source IR, Final-State DB IR, Runtime/Behavior IR, AWS Plan IR, Verification IR, schemas/validation, evidence/confidence, object identities, dispositions, deterministic serialization.

## G2 — Analyzers and reconciliation
Implement project discovery, TypeScript AST scanning, Supabase capability detection, migration chronology compiler, live PostgreSQL introspection, platform config discovery, and reconciliation/drift reporting.

### Early genericity gate
Run Trackgle plus a second unrelated Lovable/Supabase project. Required: TRACKGLE_ANALYSIS_PASS=YES, SECOND_PROJECT_ANALYSIS_PASS=YES, ZERO_TRACKGLE_ASSUMPTIONS_IN_CORE=YES.

## G3 — Database/RDS generation
Generate extensions, schema baseline, constraints/indexes/sequences, auth compatibility, helper functions, triggers, grants, RLS policies, ordered bootstrap, migration runner/preflight artifacts, and structural/RLS verification expectations.

## G4 — Service-layer and behavioral mapping
Generate/assist contracts and provider adapters while preserving behavior. Classify DATA_GATEWAY, DEDICATED_WORKFLOW, COGNITO_AUTH, S3_STORAGE, ASYNC_SCHEDULED, EXTERNAL_INTEGRATION, REALTIME, and project-specific capabilities without assuming Trackgle domains.

## G5 — AWS infrastructure generation
Generate parameterized CloudFormation from AWS Plan IR: network/security, RDS, Cognito, Lambda/layers, API Gateway, S3, queues/schedules, secrets, monitoring, and optional capability stacks. No hardcoded account/region/project names.

## G6 — Verification framework
Disposable PostgreSQL bootstrap, source-vs-generated structural comparison, RLS matrix, service contract tests, auth/storage/realtime verification, CloudFormation validation, package/smoke checks, live DEV evidence.

## G7 — CLI and developer UX
Commands: analyze, plan, generate, generate --dry-run, diff, verify, status, deploy (guarded). Generate setup/deployment docs and manual-decision reports. Enforce deterministic reruns and ownership rules.

## G8 — Multi-project hardening and release
Expand fixtures/projects, plugin/adaptor coverage, backward-compatible IR migrations, documentation, CI, release/versioning, and production-readiness guidance.

## Production is separate
Production cutover requires data migration strategy, backup/rollback, Multi-AZ/HA decisions, secret rotation, observability, performance/load validation, security review, and explicit approval.