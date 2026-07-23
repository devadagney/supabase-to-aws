# Architecture

## Pipeline

```text
Lovable / Supabase project
  |-- live PostgreSQL introspection (preferred current-state evidence when available)
  |-- chronological migrations (history, provenance, offline reconstruction)
  |-- TypeScript/JavaScript AST analysis (actual runtime usage)
  |-- Supabase/platform configuration
             |
             v
          Source IR
             |
             v
   Final-State Database IR
             |
             v
 Runtime + Behavioral IR
             |
             v
 Classification / transformation
             |
             v
          AWS Plan IR
             |
   +---------+---------+---------+---------+
   v         v         v         v         v
  RDS     Cognito    Lambda      S3   CloudFormation
   |         |         |         |         |
   +---------+---------+---------+---------+
             v
         Verification IR
```

## Why multiple sources are required
Live DB introspection answers what exists now. Migration replay explains chronological lifecycle and provides an offline fallback. Source analysis answers what the application actually uses. Platform metadata explains managed capabilities. The generator must reconcile them rather than trusting a single source blindly.

## IR layers
1. Source IR: raw facts, source locations, evidence, confidence.
2. Database Final-State IR: normalized current schema, functions, triggers, policies, grants, roles, dependencies.
3. Runtime Capability IR: queries, RPCs, auth calls, storage usage, realtime subscriptions, edge functions, scheduled work, external integrations.
4. Behavioral IR: signup/login/bootstrap semantics, authorization, workflows, side effects, error/null behavior.
5. AWS Plan IR: target services, transformations, generated/scaffold/manual decisions, infrastructure dependencies.
6. Verification IR: structural expectations, behavioral assertions, deployment/live evidence.

## Suggested package boundaries
```text
packages/
  core/            # IR, evidence, classification, lifecycle semantics
  analyzers/       # Supabase, PostgreSQL, TypeScript, Lovable
  adapters/        # Cognito, RDS, S3, API Gateway, EventBridge, SES, realtime
  generators/      # CloudFormation, SQL, providers, docs
  verification/    # reconstruction, RLS, contracts, live AWS
  cli/
fixtures/
  trackgle/
  synthetic/
```

Generic core must contain no Trackgle-specific names or assumptions.

## Determinism
Same source + config + generator version + IR schema version must produce identical artifacts where inputs are unchanged. Support analyze, generate, generate --dry-run, diff, verify, and status. A second generation without changes should report zero changes.

## Ownership
- GENERATED: generator owns complete file.
- MANAGED: generator changes only explicit managed regions.
- USER_OWNED: generator never overwrites.

## Deployment architecture principles
Generate only services justified by discovered capabilities. Prefer private RDS, Secrets Manager references, least-privilege IAM, versioned artifacts, CloudFormation preview/change sets, and explicit DEV verification before production planning.