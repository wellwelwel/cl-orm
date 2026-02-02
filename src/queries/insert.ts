import type { InsertOptions } from '../types.js';
import { backtick } from './_utils.js';

const prepareColumns = (rows: Record<string, unknown>[]): string[] => {
  const head = rows[0];
  if (!head) throw new Error('Values must not be empty.');

  const columns = Object.keys(head);
  if (rows.length === 1) return columns;

  let isHead = true;
  const columnSet = new Set(columns);

  for (const row of rows) {
    if (isHead) {
      isHead = false;
      continue;
    }

    const keys = Object.keys(row);

    if (
      keys.length !== columns.length ||
      keys.some((key) => !columnSet.has(key))
    )
      throw new Error('Inconsistent columns across values.');

    if (keys.some((key, position) => key !== columns[position]))
      throw new Error('Inconsistent columns position across values.');
  }

  return columns;
};

export const buildInsert = (
  options: InsertOptions
): { sql: string; params: unknown[] } => {
  const rows = Array.isArray(options.values)
    ? options.values
    : [options.values];

  const columnKeys = prepareColumns(rows);
  const columns = columnKeys.map(backtick).join(', ');
  const placeholders = `(${columnKeys.map(() => '?').join(', ')})`;
  const values = rows.map(() => placeholders).join(', ');
  const params = rows.flatMap((row) => columnKeys.map((key) => row[key]));

  return {
    sql: `INSERT INTO ${backtick(options.into)} (${columns}) VALUES ${values}`,
    params,
  };
};
