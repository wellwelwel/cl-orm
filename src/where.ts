import type {
  Condition,
  Connector,
  Param,
  WhereClause,
  WhereItem,
} from './types.js';

const isConnector = (value: WhereItem): value is Connector =>
  typeof value === 'string' && ['AND', 'OR', 'XOR', 'NOT'].includes(value);

const isCondition = (value: WhereItem): value is Condition =>
  typeof value === 'object' && !Array.isArray(value) && 'condition' in value;

const processItems = (items: WhereItem[]): { sql: string; params: Param[] } => {
  const parts: string[] = [];
  const params: Param[] = [];

  for (const item of items) {
    if (isConnector(item)) {
      parts.push(item);
      continue;
    }

    if (isCondition(item)) {
      parts.push(item.condition);
      params.push(...item.params);
      continue;
    }

    if (Array.isArray(item)) {
      const group = processItems(item);

      parts.push(`(${group.sql})`);
      params.push(...group.params);
    }
  }

  return { sql: parts.join(' '), params };
};

export const buildWhere = (
  where: WhereClause
): { sql: string; params: Param[] } => {
  if (typeof where === 'string') return { sql: where, params: [] };
  if (isCondition(where))
    return { sql: where.condition, params: [...where.params] };

  return processItems(where);
};
