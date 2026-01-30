import type { Meta } from '../types.js';

export const returnsRows = (sql: string): boolean => {
  const trimmed = sql.trimStart().toUpperCase();

  return (
    trimmed.indexOf('SELECT') === 0 ||
    trimmed.indexOf('WITH') === 0 ||
    trimmed.indexOf('PRAGMA') === 0 ||
    trimmed.indexOf('RETURNING') !== -1
  );
};

export const prepare = (
  db: D1Database,
  sql: string,
  params: unknown[]
): D1PreparedStatement =>
  params.length > 0 ? db.prepare(sql).bind(...params) : db.prepare(sql);

export const setMeta = (
  cursor: SqlStorageCursor<Record<string, SqlStorageValue>>
): Meta => ({
  duration: 0,
  size_after: 0,
  rows_read: cursor.rowsRead,
  rows_written: cursor.rowsWritten,
  last_row_id: 0,
  changed_db: cursor.rowsWritten > 0,
  changes: cursor.rowsWritten,
});
