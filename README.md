# Supabase to AWS Migration Generator

AI-agent-friendly knowledge base and implementation workspace for building a reusable generator that migrates Lovable/Supabase applications to AWS while preserving behavior.

## Mission
Analyze a source project, reconstruct its real current database and runtime capabilities, map them to AWS, generate migration artifacts and infrastructure, and verify parity before cutover.

## Core pipeline
Source project -> Discovery -> Source IR -> Chronological/Live DB reconciliation -> Final-State IR -> Runtime & Behavioral IR -> AWS Plan IR -> Generators -> Verification.

## Primary mappings
- Supabase PostgreSQL -> Amazon RDS PostgreSQL
- Supabase Auth -> Amazon Cognito
- Edge/backend functions -> AWS Lambda
- HTTP APIs -> API Gateway + Lambda
- Storage -> Amazon S3
- Scheduled/background work -> EventBridge/SQS/Lambda as required
- Secrets -> AWS Secrets Manager
- Infrastructure -> CloudFormation

Trackgle is reference/regression knowledge, not generator architecture.

Read `AGENTS.md` first for agent rules, then `docs/ARCHITECTURE.md`, `docs/PROJECT_KNOWLEDGE.md`, `docs/DECISIONS.md`, `docs/SECURITY_RULES.md`, `docs/STATUS.md`, and `docs/ROADMAP.md`.