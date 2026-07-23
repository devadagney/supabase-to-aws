# Intermediate Representation Specification

## Version
Initial contract: `irVersion: "0.1.0"`. IR changes must be versioned and migration-compatible.

## Principle
IR is the boundary between discovery and generation. Raw scanners never drive CloudFormation or AWS code directly.

## Top-level model
```ts
interface ProjectIR {
  irVersion: string;
  generatorVersion?: string;
  project: ProjectMetadata;
  evidenceSources: EvidenceSource[];
  database: DatabaseIR;
  runtime: RuntimeIR;
  behavior: BehaviorIR;
  transformations: TransformationDecision[];
  awsPlan?: AwsPlanIR;
  verification?: VerificationIR;
  unresolved: ManualDecision[];
}
```

## Evidence
Every material fact supports:
```ts
interface Evidence {
  sourceType: 'LIVE_DB'|'MIGRATION'|'SOURCE_AST'|'CONFIG'|'MANUAL'|'GENERATED_VERIFICATION';
  source: string;
  location?: { file?: string; line?: number; object?: string };
  observedAt?: string;
  confidence: 'HIGH'|'MEDIUM'|'LOW'|'AMBIGUOUS';
  notes?: string[];
}
```

Live DB current-state evidence, migration chronology, source runtime usage, and platform config may disagree. Reconciliation records conflicts rather than discarding evidence.

## Common object fields
```ts
interface IrObjectBase {
  id: string;
  name: string;
  evidence: Evidence[];
  dependencies: string[];
  lifecycle?: LifecycleEvent[];
  finalState: 'PRESENT'|'ABSENT'|'UNKNOWN';
  disposition?: Disposition;
  target?: TargetMapping;
  manualDecisionReason?: string;
}
```

## Dispositions
`PRESERVED | EMITTED | TRANSFORMED | EXTERNALIZED | GENERATED_SCAFFOLD | MAPPED_NOT_IMPLEMENTED | BLOCKED | EXCLUDED | MANUAL_DECISION`

Every discovered capability/object must end with exactly one disposition before a migration plan can claim completeness.

## Database IR
Represent:
- schemas
- extensions
- enums/types/domains
- sequences/identity
- tables
- columns/defaults/nullability
- PK/FK/UNIQUE/CHECK constraints
- indexes
- functions with schema/name/argument signature/return/language/security/search_path/body evidence
- triggers with schema/table/name/timing/events/update-of/row-vs-statement/when/function/procedure/args/constraint properties
- RLS enable/force state
- policies with schema/table/name/command/roles/permissive/USING/WITH CHECK
- roles/grants
- publications/realtime metadata
- storage schema/platform-managed objects

Scoped identities are mandatory. Functions include signatures; triggers/policies include table scope.

## Lifecycle
Chronological migration evidence supports CREATE, CREATE_OR_REPLACE, ALTER, RENAME, DROP, DROP_IF_EXISTS, table/schema drop effects, recreation and dependency changes. Final-state reconstruction is stateful.

## Runtime IR
Represent actual source usage:
- table CRUD/query patterns
- RPC/function calls
- auth methods/session listeners
- storage buckets/paths/operations
- realtime channels/postgres_changes/broadcast/presence
- Edge Function invocations
- scheduled/background jobs
- external HTTP/services
- frontend/backend call sites
- dynamic/unresolved targets requiring manual review

## Behavior IR
Capture flows rather than only APIs:
- signup/login/logout/session restore
- email/OTP/password flows
- user/profile/org bootstrap
- role resolution
- authorization expectations
- side effects/cascades
- retries/timeouts
- null/error behavior
- response contracts
- storage/realtime semantics

## Reconciliation
For each database object/capability record observations from live DB, migration compiler and source/config. Classify `MATCH`, `LIVE_ONLY`, `MIGRATION_ONLY`, `DIFFERS`, `UNVERIFIED`. Never silently overwrite conflict evidence.

## AWS Plan IR
Target mapping includes service, resource intent, dependencies, generated artifacts, IAM needs, network needs, secret needs, transformation reason, readiness status, and manual decisions. Generate only resources justified by discovered capabilities.

## Verification IR
Represent expected structural assertions, RLS matrices, auth/service/storage/realtime contract tests, CloudFormation/package assertions, live DEV evidence and parity results.

## Readiness
`DISCOVERED | CLASSIFIED | GENERATED_SCAFFOLD | MAPPED_NOT_IMPLEMENTED | BLOCKED | IMPLEMENTED_LOCAL | DEPLOYED_DEV | LIVE_VERIFIED | PARITY_VERIFIED`

Readiness is evidence-backed and separate from disposition.

## Determinism
IR serialization must use stable IDs/orderings. Same inputs + config + versions should produce identical IR/artifacts where source evidence is unchanged.