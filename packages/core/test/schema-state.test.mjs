import test from 'node:test';
import assert from 'node:assert/strict';
import { SchemaState } from '../src/schema-state.mjs';
import { triggerKey, policyKey, functionKey } from '../src/model.mjs';

test('trigger identity is schema + table + name', () => {
  const s = new SchemaState();
  s.applyAll([
    { kind: 'trigger', action: 'create', schema: 'public', table: 'a', name: 'set_org', functionName: 'f' },
    { kind: 'trigger', action: 'create', schema: 'public', table: 'b', name: 'set_org', functionName: 'f' },
  ]);
  assert.equal(Object.keys(s.triggers).length, 2);
});

test('drop table removes only table-owned triggers and policies', () => {
  const s = new SchemaState();
  s.applyAll([
    { kind: 'table', action: 'create', name: 'a' }, { kind: 'table', action: 'create', name: 'b' },
    { kind: 'trigger', action: 'create', table: 'a', name: 't' }, { kind: 'trigger', action: 'create', table: 'b', name: 't' },
    { kind: 'policy', action: 'create', table: 'a', name: 'Users can read based on role' },
    { kind: 'policy', action: 'create', table: 'b', name: 'Users can read based on role' },
    { kind: 'table', action: 'drop', name: 'a' },
  ]);
  assert.equal(s.triggers[triggerKey('public', 'a', 't')], undefined);
  assert.ok(s.triggers[triggerKey('public', 'b', 't')]);
  assert.equal(s.policies[policyKey('public', 'a', 'Users can read based on role')], undefined);
  assert.ok(s.policies[policyKey('public', 'b', 'Users can read based on role')]);
});

test('drop policy is table scoped even when name contains on', () => {
  const s = new SchemaState();
  const name = 'Users can read projects based on role';
  s.apply({ kind: 'policy', action: 'create', table: 'projects', name });
  s.apply({ kind: 'policy', action: 'drop', table: 'projects', name });
  assert.equal(s.policies[policyKey('public', 'projects', name)], undefined);
});

test('function overloads have distinct identities', () => {
  const s = new SchemaState();
  s.apply({ kind: 'function', action: 'create', name: 'lookup', signature: 'uuid' });
  s.apply({ kind: 'function', action: 'create', name: 'lookup', signature: 'text' });
  assert.ok(s.functions[functionKey('public', 'lookup', 'uuid')]);
  assert.ok(s.functions[functionKey('public', 'lookup', 'text')]);
});
