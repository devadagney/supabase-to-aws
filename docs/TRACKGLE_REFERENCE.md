# Trackgle Reference / Regression Knowledge

Trackgle is the project from which many migration lessons were learned. This document preserves those lessons without making Trackgle the generator architecture.

## Proven migration sequence lessons
A successful RDS reconstruction required dependency-aware ordering: extensions; generated schema baseline; identity/user rewiring where required; roles/table grants; auth compatibility shim; helper/trigger functions; triggers; function grants; final RLS policies. Exact ordering must be generated from dependencies, not blindly copied from this example.

## Compiler bugs discovered
- DROP TABLE detector used the wrong regex capture group, making drops silent no-ops.
- Trigger identity keyed only by name masked table lifecycle effects.
- DROP POLICY did not capture the target table correctly.
- Naive parsing of the word `on` failed because policy names can contain `on`.
- Historical policy collection without chronological drops produced stale/broad AWS policies.

These bugs demonstrate why generic extraction must use scoped identities, lifecycle semantics, regression fixtures, and preferably parser/AST-quality evidence.

## Trigger lesson
Raw CREATE counts did not equal final live trigger state. A table drop destroyed a trigger that was never recreated. One Supabase auth trigger was intentionally externalized to Cognito, so source final-state trigger count and RDS-emitted trigger count were both valid but answered different questions. Transformation reports must account for every object disposition.

## RLS lesson
An early DEV test appeared to expose broad cross-tenant project policies. Later audit proved the real Supabase final state had already dropped those broad policies; the finding came from compiler/hand-authored-port defects. After correcting chronology and mechanically generating final policies, disposable and DEV RLS matrices passed. Lesson: never patch source security based on a finding until source chronology/compiler correctness is independently verified.

## Profile manual-review lesson
A self-profile insert policy allowed identity-based insert without org validation, while normal application creation flowed through a privileged bootstrap path. This illustrates a category where reachable application behavior and raw database/API exposure differ. Such cases require explicit product/security decisions, not automatic generator invention.

## Schema compiler lessons
Parsing fixes included enum values, multi-column ALTER ADD COLUMN, ON DELETE actions, nested CHECK expressions, sequences, extensions, PK/NOT NULL, UNIQUE constraints, role transformations, triggers, and policy lifecycle. Generic tests must include these classes.

## Verification lessons
Naive expected counts failed because extension functions live in public, information_schema can count one trigger per event, PostgreSQL creates indexes automatically for constraints, and stale hardcoded FK counts drift. Verification queries must measure semantic objects rather than simplistic line/count assumptions.

## DEV migration mechanism
Private RDS was initialized using a temporary VPC-attached migration Lambda/stack with secure credential resolution, no public trigger, same private network path, preflight/allowlisted migration actions, and cleanup afterward. This is a reusable deployment pattern, not a mandatory implementation for every environment.

## Service migration lessons
Runtime Supabase calls were moved behind service contracts/providers; escape scanning identified remaining direct usages. AWS methods were classified by execution class rather than guessed from names. Generated scaffolds were kept distinct from implemented methods. Provider parity audits found missing operations, parameter mismatches, and semantic gaps such as cascades.

## Auth lessons
Cognito authentication/session and RDS application profile/role state are distinct. A Cognito role/attribute change alone may not alter application authorization if the app reads role state from RDS. Signup behavior must preserve source semantics; Cognito pool configuration such as admin-only creation can conflict with an existing self-signup UI and must become an explicit transformation/manual decision rather than a silent feature change.

## Historical readiness evidence
Trackgle reached verified DEV schema/RLS reconstruction and substantial AWS service-layer implementation, but those historical counts/statuses are not generator defaults and must not be used to claim this new repository is implemented.