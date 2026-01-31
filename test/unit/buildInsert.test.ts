import { assert, describe, it } from 'poku';
import { buildInsert } from '../../src/queries/insert.js';

describe('buildInsert', () => {
  it('should build a single row insert', () => {
    const result = buildInsert({
      into: 'users',
      values: { name: 'Alice', email: 'a@b.com' },
    });
    assert.strictEqual(
      result.sql,
      'INSERT INTO `users` (`name`, `email`) VALUES (?, ?)'
    );
    assert.deepStrictEqual(result.params, ['Alice', 'a@b.com']);
  });

  it('should build a multi-row insert', () => {
    const result = buildInsert({
      into: 'users',
      values: [
        { name: 'Alice', email: 'a@b.com' },
        { name: 'Bob', email: 'b@b.com' },
      ],
    });
    assert.strictEqual(
      result.sql,
      'INSERT INTO `users` (`name`, `email`) VALUES (?, ?), (?, ?)'
    );
    assert.deepStrictEqual(result.params, [
      'Alice',
      'a@b.com',
      'Bob',
      'b@b.com',
    ]);
  });
});
