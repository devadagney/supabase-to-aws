# AI Agent Operating Contract

## Mission
Build a generic Supabase/Lovable-to-AWS migration generator that preserves existing behavior. Do not redesign product functionality during migration.

## Required reading
Before architectural or generator work read: `docs/ARCHITECTURE.md`, `docs/PROJECT_KNOWLEDGE.md`, `docs/DECISIONS.md`, `docs/SECURITY_RULES.md`, `docs/STATUS.md`, `docs/ROADMAP.md`.

## Architectural boundary
Scanners collect evidence. Compilers reconstruct state. The versioned IR represents normalized truth. Transformers create an AWS Plan IR. Generators consume IR/plan only. Never couple CloudFormation or service generation directly to regex matches or Trackgle structures.

## Sources of truth
When live Supabase PostgreSQL access is available, introspect the live database for current state and compare it with chronological migration reconstruction. Migrations provide history, provenance, and offline fallback. Application source analysis provides actual runtime usage. Platform configuration provides managed-service behavior. Reconcile discrepancies explicitly; never silently choose a convenient result.

## Database compiler rules
Model CREATE, CREATE OR REPLACE, ALTER, RENAME, DROP, DROP IF EXISTS, table/schema drops, CASCADE effects, and recreation. Identity must be scoped correctly: table=(schema,name), column=(schema,table,name), trigger=(schema,table,name), policy=(schema,table,name), function=(schema,name,argument signature), constraint=(schema,table,name), index=(schema,name), sequence=(schema,name), type=(schema,name). Final state is not a statement inventory.

## Evidence and uncertainty
Every discovered capability should retain source evidence and confidence. Use HIGH, MEDIUM, LOW, or AMBIGUOUS. If semantics cannot be inferred safely, emit `MANUAL_DECISION`; never invent business or security behavior.

## Dispositions
Every source capability/object must end with exactly one disposition: PRESERVED, EMITTED, TRANSFORMED, EXTERNALIZED, GENERATED_SCAFFOLD, MAPPED_NOT_IMPLEMENTED, BLOCKED, EXCLUDED, or MANUAL_DECISION. Nothing may disappear silently.

## Readiness honesty
Do not equate generated scaffolding with implementation. Track states such as DISCOVERED, CLASSIFIED, GENERATED_SCAFFOLD, MAPPED_NOT_IMPLEMENTED, BLOCKED, IMPLEMENTED_LOCAL, DEPLOYED_DEV, LIVE_VERIFIED, PARITY_VERIFIED. Deployment success alone is not parity.

## Behavior preservation
Preserve auth behavior, RLS/authorization, null/error behavior, response contracts, side effects, workflows, storage behavior, realtime behavior, and runtime semantics unless an explicit transformation decision says otherwise.

## Safety
Never delete source Supabase data automatically; modify production automatically; expose private RDS; commit plaintext secrets; silently broaden IAM; silently weaken RLS; disable tenant isolation to make migration easier; invent missing semantics; execute destructive infrastructure without preview; or ignore unsupported SQL.

## Trackgle rule
Trackgle is a regression/reference fixture only. Never hardcode Trackgle table names, domains, counts, roles, auth decisions, AWS names, or service methods into generic core logic.

## Generated-file ownership
Classify output as GENERATED (generator owns fully), MANAGED (generator edits only marked sections), or USER_OWNED (never overwrite). Never silently overwrite developer business logic.

## Workflow
Inspect before editing. Identify the relevant IR representation and ownership boundary. Implement the smallest coherent change. Add tests. Run appropriate verification. Update `docs/STATUS.md` when readiness changes. Prefer unit tests -> synthetic fixtures -> Trackgle regression -> second unrelated project -> disposable PostgreSQL -> DEV/live verification.

## Genericity gate
Trackgle alone cannot prove genericity. After analyzer + IR are viable, test a second unrelated Lovable/Supabase project before deep generator implementation.
