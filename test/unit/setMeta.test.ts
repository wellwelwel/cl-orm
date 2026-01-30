import { assert, describe, it } from 'poku';
import { setMeta } from '../../src/drivers/utils.js';

describe('setMeta', () => {
  it('should map cursor fields to Meta object', () => {
    const mockCursor = {
      rowsRead: 5,
      rowsWritten: 2,
    } as SqlStorageCursor<Record<string, SqlStorageValue>>;

    const meta = setMeta(mockCursor);
    assert.strictEqual(meta.duration, 0);
    assert.strictEqual(meta.size_after, 0);
    assert.strictEqual(meta.rows_read, 5);
    assert.strictEqual(meta.rows_written, 2);
    assert.strictEqual(meta.last_row_id, 0);
    assert.strictEqual(meta.changed_db, true);
    assert.strictEqual(meta.changes, 2);
  });

  it('should set changed_db to false when no rows written', () => {
    const mockCursor = {
      rowsRead: 3,
      rowsWritten: 0,
    } as SqlStorageCursor<Record<string, SqlStorageValue>>;

    const meta = setMeta(mockCursor);
    assert.strictEqual(meta.changed_db, false);
    assert.strictEqual(meta.changes, 0);
  });
});
