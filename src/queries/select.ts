import type { JoinOptions, SelectOptions } from '../types.js';
import { backtick } from './_utils.js';
import { buildWhere } from './where/where.js';

const buildColumns = (columns?: string | string[]): string => {
  if (!columns) return '*';
  if (typeof columns === 'string') return columns;

  return columns.map(backtick).join(', ');
};

const buildJoin = (join: JoinOptions): string => {
  const type = join.outer
    ? `${join.type.toUpperCase()} OUTER`
    : join.type.toUpperCase();

  return `${type} JOIN ${backtick(join.table)} ON ${backtick(join.on.a)} = ${backtick(join.on.b)}`;
};

export const buildSelect = (
  options: SelectOptions
): { sql: string; params: unknown[] } => {
  const parts: string[] = ['SELECT'];
  const params: unknown[] = [];

  if (options.distinct) parts.push('DISTINCT');

  parts.push(buildColumns(options.columns));
  parts.push('FROM', backtick(options.from));

  if (options.join) {
    const joins = Array.isArray(options.join) ? options.join : [options.join];
    for (const join of joins) {
      parts.push(buildJoin(join));
    }
  }

  if (options.where) {
    const where = buildWhere(options.where);
    parts.push('WHERE', where.sql);
    params.push(...where.params);
  }

  if (options.groupBy) parts.push('GROUP BY', backtick(options.groupBy));

  if (options.orderBy) {
    const [column, direction = 'ASC'] = options.orderBy;
    parts.push('ORDER BY', backtick(column), direction);
  }

  if (options.limit !== undefined) {
    parts.push('LIMIT ?');
    params.push(options.limit);
  }

  if (options.offset !== undefined) {
    parts.push('OFFSET ?');
    params.push(options.offset);
  }

  if (options.params) params.unshift(...options.params);

  return { sql: parts.join(' '), params };
};
