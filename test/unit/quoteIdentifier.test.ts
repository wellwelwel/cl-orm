import { assert, describe, it } from 'poku';
import { quoteIdentifier } from '../../src/queries/_utils.js';

describe('quoteIdentifier', () => {
  it('should quote a simple name', () => {
    assert.strictEqual(quoteIdentifier('users'), '`users`');
  });

  it('should quote a dotted name', () => {
    assert.strictEqual(quoteIdentifier('users.id'), '`users`.`id`');
  });
});
