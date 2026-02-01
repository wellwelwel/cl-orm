import { assert, describe, it } from 'poku';
import { backtick } from '../../src/queries/_utils.js';

describe('backtick', () => {
  it('should ignore a quoted name', () => {
    assert.strictEqual(backtick('`users`'), '`users`');
  });

  it('should quote a simple name', () => {
    assert.strictEqual(backtick('users'), '`users`');
  });

  it('should quote a dotted name', () => {
    assert.strictEqual(backtick('users.id'), '`users`.`id`');
  });
});
