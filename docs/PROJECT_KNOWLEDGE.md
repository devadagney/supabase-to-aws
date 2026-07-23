# Project Knowledge

## Problem
A Lovable/Supabase application may depend on PostgreSQL, Supabase Auth, RLS, Storage, Realtime, Edge Functions, RPCs, triggers, scheduled work, and frontend SDK behavior. Migration is therefore behavioral reconstruction, not a simple service-name substitution.

## Typical mappings
Supabase PostgreSQL -> RDS PostgreSQL; Auth -> Cognito; Edge/backend operations -> Lambda; HTTP -> API Gateway; Storage -> S3; schedules -> EventBridge; queues -> SQS/DLQ; email -> SES; secrets -> Secrets Manager; observability -> CloudWatch. These are candidate mappings, not unconditional one-to-one replacements.

## Proven lessons
### Final schema requires lifecycle semantics
Historical migrations contain objects that may later be dropped, recreated, renamed, or replaced. Collecting every CREATE caused stale RLS policies and triggers to appear active. Compiler state must model lifecycle chronologically.

### Object identity must be scoped
Name-only identity is unsafe. Trigger identity needs schema+table+name; policy identity needs schema+table+name; functions need signatures; DROP parsing must identify the real target.

### DROP TABLE destroys table-owned triggers
Compiler state must remove dependent table-owned objects when PostgreSQL semantics require it. CASCADE affects external dependents but table-owned triggers disappear with the table itself.

### Policy names are free text
Do not parse SQL using naive searches for words such as `on`; policy names may contain those words. Use a real parser or robust grammar-aware logic.

### Permissive RLS policies are OR-combined
A stale broad policy can defeat a newer narrow policy. Verification must test runtime tenant isolation, not only count policies.

### FOR ALL policy behavior matters
PostgreSQL policy semantics, including USING/WITH CHECK fallback behavior, must be modeled accurately rather than guessed.

### Supabase-specific triggers may be externalized
Example pattern: a trigger on `auth.users` may become a Cognito PostConfirmation/bootstrap workflow. It should have an explicit EXTERNALIZED disposition rather than silently disappearing.

### Schema counts require PostgreSQL-aware verification
Extension-owned functions, automatically-created indexes, and information_schema trigger rows can distort naive counts. Prefer pg_catalog queries that measure the intended object identity.

### Live DB introspection is valuable
When available, inspect the live Supabase PostgreSQL database for authoritative current state and compare it with migration-compiled state. A mismatch is drift/evidence requiring review, not something to hide.

### Source code proves runtime usage
Database configuration alone cannot tell which realtime subscriptions, RPCs, auth flows, storage paths, or tables are actually consumed. Analyze application code/AST.

### Cognito and RDS roles have different responsibilities
Cognito authenticates identity and issues claims/tokens. RDS roles/data/RLS enforce database authorization and application state. Changing a Cognito attribute alone does not necessarily change an application role stored in RDS.

### Identity mapping must be explicit
A migration may need to preserve legacy Supabase UUIDs while Cognito introduces `sub`. Identity resolution and RLS context must be designed, documented, and verified.

### Private RDS migration execution
If RDS is private and the developer machine cannot connect, a temporary VPC-attached migration/preflight Lambda can safely run hardcoded/intended migrations using secure credential references. It must have no public route/function URL, use least privilege, avoid logging secrets, and be deleted after use.

### Disposable reconstruction first
Before persistent DEV RDS changes, bootstrap a completely empty disposable PostgreSQL instance, run the exact intended order, verify structure and runtime RLS, destroy it, fix generators rather than hand-patching DB state, and rerun from zero.

### Structural verification != behavioral verification
Matching tables/functions/triggers/policies is necessary but insufficient. Cross-tenant RLS matrices, auth flows, service contracts, storage/realtime behavior, and live DEV paths require separate proof.

## Trackgle reference findings
Trackgle demonstrated: chronological compiler bugs can create false security findings; stale hand-authored policy ports are dangerous; generated RLS should derive mechanically from corrected final state; trigger accounting may distinguish source final-state count from RDS-emitted count due to externalization; service-layer migration can remove direct Supabase runtime escapes; and readiness must distinguish IMPLEMENTED_LOCAL, DEPLOYED_DEV, LIVE_VERIFIED, and PARITY_VERIFIED.

Trackgle numbers are historical regression evidence only. Never use its table/policy/trigger/method counts as generic expectations.