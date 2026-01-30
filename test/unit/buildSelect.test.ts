import { assert, describe, it } from 'poku';
import { buildSelect } from '../../src/queries/select.js';
import { OP } from '../../src/queries/where/operators.js';

describe('buildSelect', () => {
  it('should build a basic select', () => {
    const result = buildSelect({ table: 'users' });
    assert.strictEqual(result.sql, 'SELECT * FROM `users`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with specific columns', () => {
    const result = buildSelect({ table: 'users', columns: ['name', 'email'] });
    assert.strictEqual(result.sql, 'SELECT `name`, `email` FROM `users`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with string column', () => {
    const result = buildSelect({ table: 'users', columns: 'COUNT(*)' });
    assert.strictEqual(result.sql, 'SELECT COUNT(*) FROM `users`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with distinct', () => {
    const result = buildSelect({ table: 'users', distinct: true });
    assert.strictEqual(result.sql, 'SELECT DISTINCT * FROM `users`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with where clause', () => {
    const result = buildSelect({
      table: 'users',
      where: OP.eq('name', 'Alice'),
    });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` WHERE `name` = ?');
    assert.deepStrictEqual(result.params, ['Alice']);
  });

  it('should build select with limit', () => {
    const result = buildSelect({ table: 'users', limit: 10 });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` LIMIT ?');
    assert.deepStrictEqual(result.params, [10]);
  });

  it('should build select with offset', () => {
    const result = buildSelect({ table: 'users', limit: 10, offset: 5 });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` LIMIT ? OFFSET ?');
    assert.deepStrictEqual(result.params, [10, 5]);
  });

  it('should build select with orderBy', () => {
    const result = buildSelect({ table: 'users', orderBy: ['name', 'DESC'] });
    assert.strictEqual(
      result.sql,
      'SELECT * FROM `users` ORDER BY `name` DESC'
    );
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with orderBy default ASC', () => {
    const result = buildSelect({ table: 'users', orderBy: ['name'] });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` ORDER BY `name` ASC');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with groupBy', () => {
    const result = buildSelect({ table: 'users', groupBy: 'name' });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` GROUP BY `name`');
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with join', () => {
    const result = buildSelect({
      table: 'users',
      join: {
        type: 'inner',
        table: 'orders',
        on: { a: 'users.id', b: 'orders.user_id' },
      },
    });
    assert.strictEqual(
      result.sql,
      'SELECT * FROM `users` INNER JOIN `orders` ON `users`.`id` = `orders`.`user_id`'
    );
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with outer join', () => {
    const result = buildSelect({
      table: 'users',
      join: {
        type: 'left',
        table: 'orders',
        on: { a: 'users.id', b: 'orders.user_id' },
        outer: true,
      },
    });
    assert.strictEqual(
      result.sql,
      'SELECT * FROM `users` LEFT OUTER JOIN `orders` ON `users`.`id` = `orders`.`user_id`'
    );
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with multiple joins', () => {
    const result = buildSelect({
      table: 'users',
      join: [
        {
          type: 'inner',
          table: 'orders',
          on: { a: 'users.id', b: 'orders.user_id' },
        },
        {
          type: 'left',
          table: 'items',
          on: { a: 'orders.id', b: 'items.order_id' },
        },
      ],
    });
    assert.strictEqual(
      result.sql,
      'SELECT * FROM `users` INNER JOIN `orders` ON `users`.`id` = `orders`.`user_id` LEFT JOIN `items` ON `orders`.`id` = `items`.`order_id`'
    );
    assert.deepStrictEqual(result.params, []);
  });

  it('should build select with params', () => {
    const result = buildSelect({
      table: 'users',
      where: 'name = ?',
      params: ['Alice'],
    });
    assert.strictEqual(result.sql, 'SELECT * FROM `users` WHERE name = ?');
    assert.deepStrictEqual(result.params, ['Alice']);
  });
});
