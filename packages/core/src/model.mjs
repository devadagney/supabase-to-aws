export const IR_VERSION = '0.1.0';

export const EVIDENCE_SOURCE = Object.freeze({
  LIVE_DB: 'LIVE_DB', MIGRATION: 'MIGRATION', SOURCE_AST: 'SOURCE_AST', CONFIG: 'CONFIG',
  MANUAL: 'MANUAL', GENERATED_VERIFICATION: 'GENERATED_VERIFICATION',
});

export const CONFIDENCE = Object.freeze({ HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW', AMBIGUOUS: 'AMBIGUOUS' });

export const DISPOSITION = Object.freeze({
  PRESERVED: 'PRESERVED', EMITTED: 'EMITTED', TRANSFORMED: 'TRANSFORMED', EXTERNALIZED: 'EXTERNALIZED',
  GENERATED_SCAFFOLD: 'GENERATED_SCAFFOLD', MAPPED_NOT_IMPLEMENTED: 'MAPPED_NOT_IMPLEMENTED', BLOCKED: 'BLOCKED',
  EXCLUDED: 'EXCLUDED', MANUAL_DECISION: 'MANUAL_DECISION',
});

export const READINESS = Object.freeze({
  DISCOVERED: 'DISCOVERED', CLASSIFIED: 'CLASSIFIED', GENERATED_SCAFFOLD: 'GENERATED_SCAFFOLD',
  MAPPED_NOT_IMPLEMENTED: 'MAPPED_NOT_IMPLEMENTED', BLOCKED: 'BLOCKED', IMPLEMENTED_LOCAL: 'IMPLEMENTED_LOCAL',
  DEPLOYED_DEV: 'DEPLOYED_DEV', LIVE_VERIFIED: 'LIVE_VERIFIED', PARITY_VERIFIED: 'PARITY_VERIFIED',
});

export const RECONCILIATION = Object.freeze({ MATCH: 'MATCH', LIVE_ONLY: 'LIVE_ONLY', MIGRATION_ONLY: 'MIGRATION_ONLY', DIFFERS: 'DIFFERS', UNVERIFIED: 'UNVERIFIED' });

export function stableSlug(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}
export function makeId(category, ...parts) { return `${category}.${parts.map(stableSlug).join('.')}`; }
export function functionKey(schema, name, signature = '') { return `${schema}::${name}::${signature}`; }
export function triggerKey(schema, table, name) { return `${schema}::${table}::${name}`; }
export function policyKey(schema, table, name) { return `${schema}::${table}::${name}`; }

export function createEvidence({ sourceType, source, location, observedAt, confidence = CONFIDENCE.HIGH, notes = [] }) {
  if (!Object.values(EVIDENCE_SOURCE).includes(sourceType)) throw new Error(`Invalid evidence source: ${sourceType}`);
  if (!Object.values(CONFIDENCE).includes(confidence)) throw new Error(`Invalid confidence: ${confidence}`);
  return { sourceType, source, ...(location ? { location } : {}), ...(observedAt ? { observedAt } : {}), confidence, notes };
}

export function createProjectIR(project = {}) {
  return { irVersion: IR_VERSION, project, evidenceSources: [], database: { schemas: {}, extensions: {}, types: {}, sequences: {}, tables: {}, functions: {}, triggers: {}, policies: {}, roles: {}, grants: [] }, runtime: {}, behavior: {}, transformations: [], unresolved: [] };
}

export function assertDispositionCompleteness(items) {
  const missing = items.filter((item) => !item.disposition);
  if (missing.length) throw new Error(`Missing disposition for: ${missing.map((x) => x.id || x.name).join(', ')}`);
  return true;
}
