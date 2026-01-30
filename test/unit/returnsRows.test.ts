import { assert, describe, it } from 'poku';
import { returnsRows } from '../../src/drivers/_utils.js';

describe('returnsRows', () => {
  it('should return true for SELECT', () => {
    assert.strictEqual(returnsRows('SELECT * FROM users'), true);
  });

  it('should return true for WITH', () => {
    assert.strictEqual(
      returnsRows('WITH cte AS (SELECT 1) SELECT * FROM cte'),
      true
    );
  });

  it('should return true for PRAGMA', () => {
    assert.strictEqual(returnsRows('PRAGMA table_info(users)'), true);
  });

  it('should return true for RETURNING', () => {
    assert.strictEqual(
      returnsRows('INSERT INTO users (name) VALUES (?) RETURNING *'),
      true
    );
  });

  it('should return false for INSERT', () => {
    assert.strictEqual(
      returnsRows('INSERT INTO users (name) VALUES (?)'),
      false
    );
  });

  it('should return false for UPDATE', () => {
    assert.strictEqual(returnsRows('UPDATE users SET name = ?'), false);
  });

  it('should return false for DELETE', () => {
    assert.strictEqual(returnsRows('DELETE FROM users'), false);
  });
});
