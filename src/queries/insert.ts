import type { InsertOptions } from '../types.js';
import { backtick } from './_utils.js';

export const buildInsert = (
  options: InsertOptions
): { sql: string; params: unknown[] } => {
  const rows = Array.isArray(options.values)
    ? options.values
    : [options.values];
  const columns = Object.keys(rows[0]);

  const columnsSql = columns.map(backtick).join(', ');
  const placeholders = `(${columns.map(() => '?').join(', ')})`;
  const valuesSql = rows.map(() => placeholders).join(', ');

  const params = rows.flatMap((row) => columns.map((col) => row[col]));

  return {
    sql: `INSERT INTO ${backtick(options.into)} (${columnsSql}) VALUES ${valuesSql}`,
    params,
  };
};
