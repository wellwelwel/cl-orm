import { assert, describe, it } from 'poku';
import { OP } from '../../src/queries/where/operators.js';

describe('OP (operators)', () => {
  it('should build eq condition', () => {
    const cond = OP.eq('name', 'Alice');
    assert.strictEqual(cond.condition, '`name` = ?');
    assert.deepStrictEqual(cond.params, ['Alice']);
  });

  it('should build ne condition', () => {
    const cond = OP.ne('name', 'Alice');
    assert.strictEqual(cond.condition, '`name` != ?');
  });

  it('should build gt condition', () => {
    const cond = OP.gt('age', 18);
    assert.strictEqual(cond.condition, '`age` > ?');
    assert.deepStrictEqual(cond.params, [18]);
  });

  it('should build lt condition', () => {
    const cond = OP.lt('age', 18);
    assert.strictEqual(cond.condition, '`age` < ?');
  });

  it('should build gte condition', () => {
    const cond = OP.gte('age', 18);
    assert.strictEqual(cond.condition, '`age` >= ?');
  });

  it('should build lte condition', () => {
    const cond = OP.lte('age', 18);
    assert.strictEqual(cond.condition, '`age` <= ?');
  });

  it('should build like condition', () => {
    const cond = OP.like('name', '%Ali%');
    assert.strictEqual(cond.condition, '`name` LIKE ?');
    assert.deepStrictEqual(cond.params, ['%Ali%']);
  });

  it('should build notLike condition', () => {
    const cond = OP.notLike('name', '%Ali%');
    assert.strictEqual(cond.condition, '`name` NOT LIKE ?');
  });

  it('should build isNull condition', () => {
    const cond = OP.isNull('email');
    assert.strictEqual(cond.condition, '`email` IS NULL');
    assert.deepStrictEqual(cond.params, []);
  });

  it('should build isNotNull condition', () => {
    const cond = OP.isNotNull('email');
    assert.strictEqual(cond.condition, '`email` IS NOT NULL');
    assert.deepStrictEqual(cond.params, []);
  });

  it('should build in condition with values', () => {
    const cond = OP.in('id', [1, 2, 3]);
    assert.strictEqual(cond.condition, '`id` IN (?, ?, ?)');
    assert.deepStrictEqual(cond.params, [1, 2, 3]);
  });

  it('should build in condition with subquery', () => {
    const cond = OP.in('id', 'SELECT id FROM other WHERE x = ?', [42]);
    assert.strictEqual(
      cond.condition,
      '`id` IN (SELECT id FROM other WHERE x = ?)'
    );
    assert.deepStrictEqual(cond.params, [42]);
  });

  it('should build notIn condition with values', () => {
    const cond = OP.notIn('id', [1, 2]);
    assert.strictEqual(cond.condition, '`id` NOT IN (?, ?)');
    assert.deepStrictEqual(cond.params, [1, 2]);
  });

  it('should build notIn condition with subquery', () => {
    const cond = OP.notIn('id', 'SELECT id FROM other', []);
    assert.strictEqual(cond.condition, '`id` NOT IN (SELECT id FROM other)');
    assert.deepStrictEqual(cond.params, []);
  });

  it('should build between condition', () => {
    const cond = OP.between('age', [18, 65]);
    assert.strictEqual(cond.condition, '`age` BETWEEN ? AND ?');
    assert.deepStrictEqual(cond.params, [18, 65]);
  });

  it('should build notBetween condition', () => {
    const cond = OP.notBetween('age', [18, 65]);
    assert.strictEqual(cond.condition, '`age` NOT BETWEEN ? AND ?');
    assert.deepStrictEqual(cond.params, [18, 65]);
  });

  it('should build AND condition', () => {
    const cond = OP.AND(OP.eq('status', 'active'), OP.eq('role', 'admin'));
    assert.strictEqual(cond.condition, '(`status` = ? AND `role` = ?)');
    assert.deepStrictEqual(cond.params, ['active', 'admin']);
  });

  it('should build AND condition with multiple operands', () => {
    const cond = OP.AND(OP.eq('a', 1), OP.eq('b', 2), OP.eq('c', 3));
    assert.strictEqual(cond.condition, '(`a` = ? AND `b` = ? AND `c` = ?)');
    assert.deepStrictEqual(cond.params, [1, 2, 3]);
  });

  it('should build OR condition', () => {
    const cond = OP.OR(OP.eq('status', 'active'), OP.eq('status', 'pending'));
    assert.strictEqual(cond.condition, '(`status` = ? OR `status` = ?)');
    assert.deepStrictEqual(cond.params, ['active', 'pending']);
  });

  it('should build OR condition with multiple operands', () => {
    const cond = OP.OR(
      OP.eq('role', 'admin'),
      OP.eq('role', 'editor'),
      OP.eq('role', 'viewer')
    );
    assert.strictEqual(
      cond.condition,
      '(`role` = ? OR `role` = ? OR `role` = ?)'
    );
    assert.deepStrictEqual(cond.params, ['admin', 'editor', 'viewer']);
  });

  it('should build XOR condition', () => {
    const cond = OP.XOR(OP.eq('isAdmin', true), OP.eq('isModerator', true));
    assert.strictEqual(cond.condition, '(`isAdmin` = ? XOR `isModerator` = ?)');
    assert.deepStrictEqual(cond.params, [true, true]);
  });

  it('should build nested AND inside OR', () => {
    const cond = OP.OR(
      OP.AND(OP.gte('age', 18), OP.eq('status', 'locked')),
      OP.AND(OP.lt('age', 18), OP.eq('status', 'enabled'))
    );
    assert.strictEqual(
      cond.condition,
      '((`age` >= ? AND `status` = ?) OR (`age` < ? AND `status` = ?))'
    );
    assert.deepStrictEqual(cond.params, [18, 'locked', 18, 'enabled']);
  });
});
