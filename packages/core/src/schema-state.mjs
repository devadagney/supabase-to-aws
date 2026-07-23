import { functionKey, policyKey, triggerKey } from './model.mjs';

export class SchemaState {
  constructor() {
    this.schemas = {};
    this.extensions = {};
    this.types = {};
    this.sequences = {};
    this.tables = {};
    this.functions = {};
    this.triggers = {};
    this.policies = {};
    this.roles = {};
    this.grants = [];
    this.unclaimed = [];
  }

  ensureTable(schema, table) {
    const key = `${schema}::${table}`;
    return (this.tables[key] ??= { schema, name: table, columns: {}, constraints: {}, indexes: {}, rls: { enabled: false, force: false } });
  }

  apply(event) {
    const schema = event.schema || 'public';
    switch (event.kind) {
      case 'table': {
        const key = `${schema}::${event.name}`;
        if (event.action === 'create') this.tables[key] = { schema, name: event.name, columns: event.columns || {}, constraints: {}, indexes: {}, rls: { enabled: false, force: false } };
        if (event.action === 'drop') {
          delete this.tables[key];
          for (const [k, t] of Object.entries(this.triggers)) if (t.schema === schema && t.table === event.name) delete this.triggers[k];
          for (const [k, p] of Object.entries(this.policies)) if (p.schema === schema && p.table === event.name) delete this.policies[k];
        }
        return true;
      }
      case 'trigger': {
        const key = triggerKey(schema, event.table, event.name);
        if (event.action === 'drop') delete this.triggers[key]; else this.triggers[key] = { ...event, schema };
        return true;
      }
      case 'policy': {
        const key = policyKey(schema, event.table, event.name);
        if (event.action === 'drop') delete this.policies[key]; else this.policies[key] = { ...event, schema };
        return true;
      }
      case 'function': {
        const key = functionKey(schema, event.name, event.signature || '');
        if (event.action === 'drop') delete this.functions[key]; else this.functions[key] = { ...event, schema };
        return true;
      }
      case 'rls': {
        const table = this.ensureTable(schema, event.table);
        if (event.action === 'enable') table.rls.enabled = true;
        if (event.action === 'disable') table.rls.enabled = false;
        if (event.action === 'force') table.rls.force = true;
        if (event.action === 'no_force') table.rls.force = false;
        return true;
      }
      case 'extension': this.extensions[`${schema}::${event.name}`] = { ...event, schema }; return true;
      case 'type': this.types[`${schema}::${event.name}`] = { ...event, schema }; return true;
      case 'sequence': this.sequences[`${schema}::${event.name}`] = { ...event, schema }; return true;
      case 'grant': this.grants.push({ ...event, schema }); return true;
      default: this.unclaimed.push(event); return false;
    }
  }

  applyAll(events) { for (const event of events) this.apply(event); return this; }

  snapshot() {
    return JSON.parse(JSON.stringify({ schemas: this.schemas, extensions: this.extensions, types: this.types, sequences: this.sequences, tables: this.tables, functions: this.functions, triggers: this.triggers, policies: this.policies, roles: this.roles, grants: this.grants, unclaimed: this.unclaimed }));
  }
}
