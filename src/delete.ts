import type { DeleteOptions } from './types.js';
import { quoteIdentifier } from './utils.js';
import { buildWhere } from './where.js';

export const buildDelete = (
  options: DeleteOptions
): { sql: string; params: unknown[] } => {
  const parts: string[] = ['DELETE FROM', quoteIdentifier(options.table)];
  const params: unknown[] = [];

  if (options.where) {
    const where = buildWhere(options.where);

    parts.push('WHERE', where.sql);
    params.push(...where.params);
  }

  if (options.limit !== undefined) {
    parts.push('LIMIT ?');
    params.push(options.limit);
  }

  if (options.params) params.unshift(...options.params);

  return { sql: parts.join(' '), params };
};
