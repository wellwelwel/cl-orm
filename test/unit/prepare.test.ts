import { assert, describe, it } from 'poku';
import { prepare } from '../../src/drivers/utils.js';

describe('prepare', () => {
  const mockBound = {} as D1PreparedStatement;
  const mockStatement = {
    bind: (..._params: unknown[]) => mockBound,
  } as D1PreparedStatement;
  const mockDb = {
    prepare: (_sql: string) => mockStatement,
  } as unknown as D1Database;

  it('should bind params when params are provided', () => {
    const result = prepare(mockDb, 'SELECT * FROM users WHERE id = ?', [1]);
    assert.strictEqual(result, mockBound);
  });

  it('should return statement without bind when no params', () => {
    const result = prepare(mockDb, 'SELECT * FROM users', []);
    assert.strictEqual(result, mockStatement);
  });
});
