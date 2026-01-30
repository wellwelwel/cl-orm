import type { InsertOptions } from './types.js';
import { quoteIdentifier } from './utils.js';

export const buildInsert = (
  options: InsertOptions
): { sql: string; params: unknown[] } => {
  const rows = Array.isArray(options.values)
    ? options.values
    : [options.values];
  const columns = Object.keys(rows[0]);

  const columnsSql = columns.map(quoteIdentifier).join(', ');
  const placeholders = `(${columns.map(() => '?').join(', ')})`;
  const valuesSql = rows.map(() => placeholders).join(', ');

  const params = rows.flatMap((row) => columns.map((col) => row[col]));

  return {
    sql: `INSERT INTO ${quoteIdentifier(options.table)} (${columnsSql}) VALUES ${valuesSql}`,
    params,
  };
};
