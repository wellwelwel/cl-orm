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

  it('should throw when values is an empty array', () => {
    assert.throws(() => buildInsert({ into: 'users', values: [] }), {
      message: 'Values must not be empty.',
    });
  });

  it('should throw when columns are inconsistent', () => {
    assert.throws(
      () =>
        buildInsert({
          into: 'users',
          values: [
            { name: 'Alice', email: 'a@b.com' },
            { name: 'Bob', age: 30 },
          ],
        }),
      { message: 'Inconsistent columns across values.' }
    );
  });

  it('should throw when columns count is inconsistent', () => {
    assert.throws(
      () =>
        buildInsert({
          into: 'users',
          values: [{ name: 'Alice', email: 'a@b.com' }, { name: 'Bob' }],
        }),
      { message: 'Inconsistent columns across values.' }
    );
  });

  it('should throw when columns position are inconsistent', () => {
    assert.throws(
      () =>
        buildInsert({
          into: 'users',
          values: [
            { name: 'Alice', email: 'a@b.com' },
            { email: 'b@b.com', name: 'Bob' },
          ],
        }),
      { message: 'Inconsistent columns position across values.' }
    );
  });
});
