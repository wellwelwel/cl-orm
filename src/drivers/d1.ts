import type {
  Connection,
  DeleteOptions,
  InsertOptions,
  Meta,
  QueryResult,
  SelectOptions,
  UpdateOptions,
} from '../types.js';
import { buildDelete } from '../delete.js';
import { buildInsert } from '../insert.js';
import { buildSelect } from '../select.js';
import { buildUpdate } from '../update.js';
import { prepare, returnsRows } from './utils.js';

export const useD1 = (db: D1Database): Connection => {
  const query = async <T = Record<string, unknown>>(
    sql: string,
    values?: unknown[]
  ): Promise<QueryResult<T>> => {
    const statement = values
      ? db.prepare(sql).bind(...values)
      : db.prepare(sql);

    if (returnsRows(sql)) {
      const { results, meta } = await statement.all<T>();
      return { rows: results, meta: meta as Meta };
    }

    const { meta } = await statement.run();
    return { rows: [], meta: meta as Meta };
  };

  const select = async <T = Record<string, unknown>>(
    options: SelectOptions
  ): Promise<T | null | T[]> => {
    const { sql, params } = buildSelect(options);
    const statement = prepare(db, sql, params);

    if (options.limit === 1) return statement.first<T>();

    const { results } = await statement.all<T>();
    return results;
  };

  const insert = async (options: InsertOptions): Promise<Meta> => {
    const { sql, params } = buildInsert(options);
    const { meta } = await query(sql, params);

    return meta;
  };

  const update = async (options: UpdateOptions): Promise<Meta> => {
    const { sql, params } = buildUpdate(options);
    const statement = prepare(db, sql, params);
    const { meta } = await statement.run();

    return meta as Meta;
  };

  const del = async (options: DeleteOptions): Promise<Meta> => {
    const { sql, params } = buildDelete(options);
    const statement = prepare(db, sql, params);
    const { meta } = await statement.run();

    return meta as Meta;
  };

  return { query, select, insert, update, delete: del };
};
