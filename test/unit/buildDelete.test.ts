import { assert, describe, it } from 'poku';
import { buildDelete } from '../../src/queries/delete.js';
import { OP } from '../../src/queries/where/operators.js';

describe('buildDelete', () => {
  it('should build a basic delete', () => {
    const result = buildDelete({ table: 'users' });
    assert.strictEqual(result.sql, 'DELETE FROM `users`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build delete with where clause', () => {
    const result = buildDelete({
      table: 'users',
      where: OP.eq('name', 'Alice'),
    });
    assert.strictEqual(result.sql, 'DELETE FROM `users` WHERE `name` = ?');
    assert.deepStrictEqual(result.params, ['Alice']);
  });

  it('should build delete with limit', () => {
    const result = buildDelete({ table: 'users', limit: 1 });
    assert.strictEqual(result.sql, 'DELETE FROM `users` LIMIT ?');
    assert.deepStrictEqual(result.params, [1]);
  });

  it('should build delete with extra params', () => {
    const result = buildDelete({
      table: 'users',
      where: OP.eq('id', 1),
      params: ['extra'],
    });
    assert.strictEqual(result.sql, 'DELETE FROM `users` WHERE `id` = ?');
    assert.deepStrictEqual(result.params, ['extra', 1]);
  });
});
