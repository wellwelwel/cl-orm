import { assert, describe, it } from 'poku';
import { OP } from '../../src/operators.js';
import { buildUpdate } from '../../src/update.js';

describe('buildUpdate', () => {
  it('should build a basic update', () => {
    const result = buildUpdate({ table: 'users', set: { name: 'Bob' } });
    assert.strictEqual(result.sql, 'UPDATE `users` SET `name` = ?');
    assert.deepStrictEqual(result.params, ['Bob']);
  });

  it('should build update with where clause', () => {
    const result = buildUpdate({
      table: 'users',
      set: { name: 'Bob' },
      where: OP.eq('name', 'Alice'),
    });
    assert.strictEqual(
      result.sql,
      'UPDATE `users` SET `name` = ? WHERE `name` = ?'
    );
    assert.deepStrictEqual(result.params, ['Bob', 'Alice']);
  });

  it('should build update with extra params', () => {
    const result = buildUpdate({
      table: 'users',
      set: { name: 'Bob' },
      params: ['extra'],
    });
    assert.strictEqual(result.sql, 'UPDATE `users` SET `name` = ?');
    assert.deepStrictEqual(result.params, ['Bob', 'extra']);
  });
});
