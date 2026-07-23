# Security Rules

## Credentials
Never commit plaintext passwords, tokens, client secrets, or database credentials. Prefer Secrets Manager/dynamic references. Never print secrets in logs or verification output.

## RDS
Default target is private RDS. Do not make RDS publicly accessible merely to run migrations. Use approved private-network mechanisms such as a temporary VPC migration runner when necessary.

## Temporary migration/preflight runner
- VPC-attached to the intended private path.
- No API Gateway route or Function URL.
- Accept allowlisted actions only; no arbitrary SQL endpoint.
- Credentials resolved securely.
- Never log/return environment credentials.
- Delete temporary Lambda/stack/artifact after use.
- Prefer read-only preflight before mutation.

## RLS
Never weaken, disable, or bypass tenant isolation to make migration pass. Compare final policy state, test positive and negative cross-tenant cases, and account for PostgreSQL permissive-policy OR semantics.

## IAM
Use least privilege. Preview CloudFormation changes. Do not silently add wildcard service permissions. Distinguish deployer permissions, CloudFormation service-role permissions, and Lambda runtime permissions.

## Deployment
Do not mutate production automatically. DEV deployment requires explicit approval and change review. Stateful resources require replacement/deletion safety checks. Use versioned artifacts and rollback plans.

## Source system
Do not delete or mutate Supabase source data as part of analysis/generation. Real data migration is a separately approved phase.

## Unsupported semantics
Fail loudly or emit MANUAL_DECISION/BLOCKED. Never generate an insecure approximation just to reach 100% completion.

## Logging and reports
Reports may include resource names and structural metadata but must redact credentials and sensitive values.