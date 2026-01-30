import type { Condition, Param } from './types.js';
import { quoteIdentifier } from './utils.js';

const comparison = (
  column: string,
  operator: string,
  param: Param
): Condition => ({
  condition: `${quoteIdentifier(column)} ${operator} ?`,
  params: [param],
});

export const OP = {
  eq: (column: string, param: Param): Condition =>
    comparison(column, '=', param),
  ne: (column: string, param: Param): Condition =>
    comparison(column, '!=', param),
  gt: (column: string, param: Param): Condition =>
    comparison(column, '>', param),
  lt: (column: string, param: Param): Condition =>
    comparison(column, '<', param),
  gte: (column: string, param: Param): Condition =>
    comparison(column, '>=', param),
  lte: (column: string, param: Param): Condition =>
    comparison(column, '<=', param),
  like: (column: string, param: Param): Condition =>
    comparison(column, 'LIKE', param),
  notLike: (column: string, param: Param): Condition =>
    comparison(column, 'NOT LIKE', param),

  isNull: (column: string): Condition => ({
    condition: `${quoteIdentifier(column)} IS NULL`,
    params: [],
  }),

  isNotNull: (column: string): Condition => ({
    condition: `${quoteIdentifier(column)} IS NOT NULL`,
    params: [],
  }),

  in: ((
    column: string,
    valuesOrSubquery: Param[] | string,
    subqueryParams?: Param[]
  ): Condition => {
    if (typeof valuesOrSubquery === 'string') {
      return {
        condition: `${quoteIdentifier(column)} IN (${valuesOrSubquery})`,
        params: subqueryParams ?? [],
      };
    }

    const placeholders = valuesOrSubquery.map(() => '?').join(', ');

    return {
      condition: `${quoteIdentifier(column)} IN (${placeholders})`,
      params: valuesOrSubquery,
    };
  }) as {
    (column: string, params: Param[]): Condition;
    (column: string, subquery: string, params: Param[]): Condition;
  },

  notIn: ((
    column: string,
    valuesOrSubquery: Param[] | string,
    subqueryParams?: Param[]
  ): Condition => {
    if (typeof valuesOrSubquery === 'string') {
      return {
        condition: `${quoteIdentifier(column)} NOT IN (${valuesOrSubquery})`,
        params: subqueryParams ?? [],
      };
    }

    const placeholders = valuesOrSubquery.map(() => '?').join(', ');

    return {
      condition: `${quoteIdentifier(column)} NOT IN (${placeholders})`,
      params: valuesOrSubquery,
    };
  }) as {
    (column: string, params: Param[]): Condition;
    (column: string, subquery: string, params: Param[]): Condition;
  },

  between: (column: string, params: [Param, Param]): Condition => ({
    condition: `${quoteIdentifier(column)} BETWEEN ? AND ?`,
    params,
  }),

  notBetween: (column: string, params: [Param, Param]): Condition => ({
    condition: `${quoteIdentifier(column)} NOT BETWEEN ? AND ?`,
    params,
  }),
};
