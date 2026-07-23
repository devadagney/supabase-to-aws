# Architecture Decisions

## D001 — Versioned normalized IR is mandatory
Status: ACCEPTED. Scanners discover evidence; downstream generators consume normalized IR/AWS Plan IR, never raw regex output.

## D002 — Trackgle is a fixture, not architecture
Status: ACCEPTED. Trackgle-specific names, counts, domains, auth choices, and AWS resources cannot become generic defaults.

## D003 — Use live DB plus migration chronology
Status: ACCEPTED. When live DB access exists, introspection is preferred evidence for current DB state. Chronological migration replay provides history, provenance, comparison, and offline fallback. Disagreement is reported as drift.

## D004 — Final-state compiler models lifecycle
Status: ACCEPTED. CREATE/ALTER/RENAME/DROP/recreation and dependency effects must be reflected in state.

## D005 — Preserve RLS
Status: ACCEPTED. Do not solve migration complexity by disabling or broadening RLS.

## D006 — Ambiguity becomes MANUAL_DECISION
Status: ACCEPTED. Unsafe inference is worse than explicit incompleteness.

## D007 — Scaffolding is not implementation
Status: ACCEPTED. Generated stubs must never be counted as live or parity verified.

## D008 — Deterministic generation
Status: ACCEPTED. Same inputs/config/versions should yield identical generated artifacts and zero-change reruns.

## D009 — Generated-file ownership is explicit
Status: ACCEPTED. GENERATED, MANAGED, USER_OWNED; never silently overwrite business logic.

## D010 — Second-project validation happens early
Status: ACCEPTED. After analyzer + IR viability, test a second unrelated Supabase project before investing deeply in generators.

## D011 — Source capabilities require dispositions
Status: ACCEPTED. Every discovered object/capability receives exactly one explicit disposition; no silent loss.

## D012 — Verification is layered
Status: ACCEPTED. Static generation, disposable reconstruction, DEV deployment, live verification, and parity verification are separate gates.