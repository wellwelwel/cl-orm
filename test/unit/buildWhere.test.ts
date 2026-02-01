import { assert, describe, it } from 'poku';
import { OP } from '../../src/queries/where/operators.js';
import { buildWhere } from '../../src/queries/where/where.js';

describe('buildWhere', () => {
  it('should handle raw string', () => {
    const result = buildWhere('id = 1');
    assert.strictEqual(result.sql, 'id = 1');
    assert.deepStrictEqual(result.params, []);
  });

  it('should handle a single eq condition', () => {
    const result = buildWhere(OP.eq('name', 'Alice'));
    assert.strictEqual(result.sql, '`name` = ?');
    assert.deepStrictEqual(result.params, ['Alice']);
  });

  it('should handle a single ne condition', () => {
    const result = buildWhere(OP.ne('status', 'inactive'));
    assert.strictEqual(result.sql, '`status` != ?');
    assert.deepStrictEqual(result.params, ['inactive']);
  });

  it('should handle a single gt condition', () => {
    const result = buildWhere(OP.gt('age', 18));
    assert.strictEqual(result.sql, '`age` > ?');
    assert.deepStrictEqual(result.params, [18]);
  });

  it('should handle a single lt condition', () => {
    const result = buildWhere(OP.lt('price', 100));
    assert.strictEqual(result.sql, '`price` < ?');
    assert.deepStrictEqual(result.params, [100]);
  });

  it('should handle a single gte condition', () => {
    const result = buildWhere(OP.gte('score', 90));
    assert.strictEqual(result.sql, '`score` >= ?');
    assert.deepStrictEqual(result.params, [90]);
  });

  it('should handle a single lte condition', () => {
    const result = buildWhere(OP.lte('quantity', 0));
    assert.strictEqual(result.sql, '`quantity` <= ?');
    assert.deepStrictEqual(result.params, [0]);
  });

  it('should handle a single like condition', () => {
    const result = buildWhere(OP.like('name', '%Ali%'));
    assert.strictEqual(result.sql, '`name` LIKE ?');
    assert.deepStrictEqual(result.params, ['%Ali%']);
  });

  it('should handle a single notLike condition', () => {
    const result = buildWhere(OP.notLike('name', '%Bot%'));
    assert.strictEqual(result.sql, '`name` NOT LIKE ?');
    assert.deepStrictEqual(result.params, ['%Bot%']);
  });

  it('should handle a single isNull condition', () => {
    const result = buildWhere(OP.isNull('email'));
    assert.strictEqual(result.sql, '`email` IS NULL');
    assert.deepStrictEqual(result.params, []);
  });

  it('should handle a single isNotNull condition', () => {
    const result = buildWhere(OP.isNotNull('email'));
    assert.strictEqual(result.sql, '`email` IS NOT NULL');
    assert.deepStrictEqual(result.params, []);
  });

  it('should handle a single in condition with values', () => {
    const result = buildWhere(OP.in('id', [1, 2, 3]));
    assert.strictEqual(result.sql, '`id` IN (?, ?, ?)');
    assert.deepStrictEqual(result.params, [1, 2, 3]);
  });

  it('should handle a single in condition with subquery', () => {
    const result = buildWhere(
      OP.in('id', 'SELECT id FROM other WHERE x = ?', [42])
    );
    assert.strictEqual(
      result.sql,
      '`id` IN (SELECT id FROM other WHERE x = ?)'
    );
    assert.deepStrictEqual(result.params, [42]);
  });

  it('should handle a single notIn condition with values', () => {
    const result = buildWhere(OP.notIn('id', [4, 5]));
    assert.strictEqual(result.sql, '`id` NOT IN (?, ?)');
    assert.deepStrictEqual(result.params, [4, 5]);
  });

  it('should handle a single notIn condition with subquery', () => {
    const result = buildWhere(OP.notIn('id', 'SELECT id FROM blocked', []));
    assert.strictEqual(result.sql, '`id` NOT IN (SELECT id FROM blocked)');
    assert.deepStrictEqual(result.params, []);
  });

  it('should handle a single between condition', () => {
    const result = buildWhere(OP.between('age', [18, 65]));
    assert.strictEqual(result.sql, '`age` BETWEEN ? AND ?');
    assert.deepStrictEqual(result.params, [18, 65]);
  });

  it('should handle a single notBetween condition', () => {
    const result = buildWhere(OP.notBetween('price', [0, 10]));
    assert.strictEqual(result.sql, '`price` NOT BETWEEN ? AND ?');
    assert.deepStrictEqual(result.params, [0, 10]);
  });

  it('should handle array with AND connector', () => {
    const result = buildWhere([
      OP.eq('name', 'Alice'),
      'AND',
      OP.gt('age', 18),
    ]);
    assert.strictEqual(result.sql, '`name` = ? AND `age` > ?');
    assert.deepStrictEqual(result.params, ['Alice', 18]);
  });

  it('should handle array with OR connector', () => {
    const result = buildWhere([
      OP.eq('role', 'admin'),
      'OR',
      OP.eq('role', 'superadmin'),
    ]);
    assert.strictEqual(result.sql, '`role` = ? OR `role` = ?');
    assert.deepStrictEqual(result.params, ['admin', 'superadmin']);
  });

  it('should handle array with XOR connector', () => {
    const result = buildWhere([OP.eq('a', 1), 'XOR', OP.eq('b', 2)]);
    assert.strictEqual(result.sql, '`a` = ? XOR `b` = ?');
    assert.deepStrictEqual(result.params, [1, 2]);
  });

  it('should handle array with NOT connector', () => {
    const result = buildWhere(['NOT', OP.eq('active', 0)]);
    assert.strictEqual(result.sql, 'NOT `active` = ?');
    assert.deepStrictEqual(result.params, [0]);
  });

  it('should handle multiple AND conditions', () => {
    const result = buildWhere([
      OP.eq('name', 'Alice'),
      'AND',
      OP.gt('age', 18),
      'AND',
      OP.isNotNull('email'),
    ]);
    assert.strictEqual(
      result.sql,
      '`name` = ? AND `age` > ? AND `email` IS NOT NULL'
    );
    assert.deepStrictEqual(result.params, ['Alice', 18]);
  });

  it('should handle mixed AND and OR connectors', () => {
    const result = buildWhere([
      OP.eq('status', 'active'),
      'AND',
      OP.gt('age', 18),
      'OR',
      OP.eq('role', 'admin'),
    ]);
    assert.strictEqual(result.sql, '`status` = ? AND `age` > ? OR `role` = ?');
    assert.deepStrictEqual(result.params, ['active', 18, 'admin']);
  });

  it('should handle nested groups', () => {
    const result = buildWhere([
      OP.eq('a', 1),
      'OR',
      [OP.eq('b', 2), 'AND', OP.eq('c', 3)],
    ]);
    assert.strictEqual(result.sql, '`a` = ? OR (`b` = ? AND `c` = ?)');
    assert.deepStrictEqual(result.params, [1, 2, 3]);
  });

  it('should handle deeply nested groups', () => {
    const result = buildWhere([
      OP.eq('a', 1),
      'AND',
      [OP.eq('b', 2), 'OR', [OP.eq('c', 3), 'AND', OP.eq('d', 4)]],
    ]);
    assert.strictEqual(
      result.sql,
      '`a` = ? AND (`b` = ? OR (`c` = ? AND `d` = ?))'
    );
    assert.deepStrictEqual(result.params, [1, 2, 3, 4]);
  });

  it('should handle multiple nested groups', () => {
    const result = buildWhere([
      [OP.eq('a', 1), 'AND', OP.eq('b', 2)],
      'OR',
      [OP.eq('c', 3), 'AND', OP.eq('d', 4)],
    ]);
    assert.strictEqual(
      result.sql,
      '(`a` = ? AND `b` = ?) OR (`c` = ? AND `d` = ?)'
    );
    assert.deepStrictEqual(result.params, [1, 2, 3, 4]);
  });

  it('should handle nested group with mixed operators', () => {
    const result = buildWhere([
      OP.isNotNull('email'),
      'AND',
      [OP.like('name', '%Alice%'), 'OR', OP.in('role', ['admin', 'editor'])],
    ]);
    assert.strictEqual(
      result.sql,
      '`email` IS NOT NULL AND (`name` LIKE ? OR `role` IN (?, ?))'
    );
    assert.deepStrictEqual(result.params, ['%Alice%', 'admin', 'editor']);
  });

  it('should handle between inside a group with AND', () => {
    const result = buildWhere([
      OP.between('age', [18, 65]),
      'AND',
      OP.eq('active', 1),
    ]);
    assert.strictEqual(result.sql, '`age` BETWEEN ? AND ? AND `active` = ?');
    assert.deepStrictEqual(result.params, [18, 65, 1]);
  });

  it('should handle notIn with nested group', () => {
    const result = buildWhere([
      OP.notIn('id', [10, 20, 30]),
      'AND',
      [OP.gte('score', 50), 'OR', OP.isNull('score')],
    ]);
    assert.strictEqual(
      result.sql,
      '`id` NOT IN (?, ?, ?) AND (`score` >= ? OR `score` IS NULL)'
    );
    assert.deepStrictEqual(result.params, [10, 20, 30, 50]);
  });

  it('should handle single condition inside an array', () => {
    const result = buildWhere([OP.eq('x', 1)]);
    assert.strictEqual(result.sql, '`x` = ?');
    assert.deepStrictEqual(result.params, [1]);
  });

  it('should handle OP.AND as a single condition', () => {
    const result = buildWhere(
      OP.AND(OP.gte('age', 18), OP.eq('status', 'active'))
    );
    assert.strictEqual(result.sql, '(`age` >= ? AND `status` = ?)');
    assert.deepStrictEqual(result.params, [18, 'active']);
  });

  it('should handle OP.OR as a single condition', () => {
    const result = buildWhere(
      OP.OR(OP.eq('status', 'active'), OP.eq('status', 'pending'))
    );
    assert.strictEqual(result.sql, '(`status` = ? OR `status` = ?)');
    assert.deepStrictEqual(result.params, ['active', 'pending']);
  });

  it('should handle OP.XOR as a single condition', () => {
    const result = buildWhere(
      OP.XOR(OP.eq('isAdmin', true), OP.eq('isModerator', true))
    );
    assert.strictEqual(result.sql, '(`isAdmin` = ? XOR `isModerator` = ?)');
    assert.deepStrictEqual(result.params, [true, true]);
  });

  it('should handle nested OP.AND inside OP.OR', () => {
    const result = buildWhere(
      OP.OR(
        OP.AND(OP.gte('age', 18), OP.eq('status', 'locked')),
        OP.AND(OP.lt('age', 18), OP.eq('status', 'enabled'))
      )
    );
    assert.strictEqual(
      result.sql,
      '((`age` >= ? AND `status` = ?) OR (`age` < ? AND `status` = ?))'
    );
    assert.deepStrictEqual(result.params, [18, 'locked', 18, 'enabled']);
  });

  it('should handle OP.AND with three conditions', () => {
    const result = buildWhere(
      OP.AND(OP.eq('a', 1), OP.eq('b', 2), OP.eq('c', 3))
    );
    assert.strictEqual(result.sql, '(`a` = ? AND `b` = ? AND `c` = ?)');
    assert.deepStrictEqual(result.params, [1, 2, 3]);
  });

  it('should handle OP.OR mixed with array connector', () => {
    const result = buildWhere([
      OP.OR(OP.eq('a', 1), OP.eq('b', 2)),
      'AND',
      OP.eq('c', 3),
    ]);
    assert.strictEqual(result.sql, '(`a` = ? OR `b` = ?) AND `c` = ?');
    assert.deepStrictEqual(result.params, [1, 2, 3]);
  });

  it('should handle object shorthand with a single key', () => {
    const result = buildWhere({ status: 'active' });
    assert.strictEqual(result.sql, '`status` = ?');
    assert.deepStrictEqual(result.params, ['active']);
  });

  it('should handle object shorthand with multiple keys', () => {
    const result = buildWhere({ status: 'active', role: 'admin' });
    assert.strictEqual(result.sql, '`status` = ? AND `role` = ?');
    assert.deepStrictEqual(result.params, ['active', 'admin']);
  });

  it('should handle object shorthand with numeric values', () => {
    const result = buildWhere({ age: 18, active: 1 });
    assert.strictEqual(result.sql, '`age` = ? AND `active` = ?');
    assert.deepStrictEqual(result.params, [18, 1]);
  });

  it('should handle object shorthand with null value', () => {
    const result = buildWhere({ status: 'active', deletedAt: null });
    assert.strictEqual(result.sql, '`status` = ? AND `deletedAt` IS NULL');
    assert.deepStrictEqual(result.params, ['active']);
  });

  it('should handle object shorthand with boolean value', () => {
    const result = buildWhere({ active: true });
    assert.strictEqual(result.sql, '`active` = ?');
    assert.deepStrictEqual(result.params, [true]);
  });
});
