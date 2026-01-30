import type { UpdateOptions } from './types.js';
import { quoteIdentifier } from './utils.js';
import { buildWhere } from './where.js';

export const buildUpdate = (
  options: UpdateOptions
): { sql: string; params: unknown[] } => {
  const columns = Object.keys(options.set);
  const setSql = columns.map((col) => `${quoteIdentifier(col)} = ?`).join(', ');
  const params: unknown[] = columns.map((col) => options.set[col]);

  const parts: string[] = [
    'UPDATE',
    quoteIdentifier(options.table),
    'SET',
    setSql,
  ];

  if (options.where) {
    const where = buildWhere(options.where);
    parts.push('WHERE', where.sql);
    params.push(...where.params);
  }

  if (options.params) params.push(...options.params);

  return { sql: parts.join(' '), params };
};
