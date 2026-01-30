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
import { returnsRows, setMeta } from './utils.js';

export const useDO = (sql: SqlStorage): Connection => {
  const exec = <T extends Record<string, SqlStorageValue>>(
    query: string,
    values?: unknown[]
  ) => (values ? sql.exec<T>(query, ...values) : sql.exec<T>(query));

  const query = async <T = Record<string, unknown>>(
    queryStr: string,
    values?: unknown[]
  ): Promise<QueryResult<T>> => {
    const cursor = exec(queryStr, values);

    if (returnsRows(queryStr)) {
      const rows = cursor.toArray() as T[];
      return { rows, meta: setMeta(cursor) };
    }

    return { rows: [], meta: setMeta(cursor) };
  };

  const select = async <T = Record<string, unknown>>(
    options: SelectOptions
  ): Promise<T | null | T[]> => {
    const built = buildSelect(options);
    const cursor = exec(
      built.sql,
      built.params.length > 0 ? built.params : undefined
    );

    if (options.limit === 1) {
      const rows = cursor.toArray() as T[];
      return rows[0] ?? null;
    }

    return cursor.toArray() as T[];
  };

  const insert = async (options: InsertOptions): Promise<Meta> => {
    const built = buildInsert(options);
    const cursor = exec(built.sql, built.params);

    return setMeta(cursor);
  };

  const update = async (options: UpdateOptions): Promise<Meta> => {
    const built = buildUpdate(options);
    const cursor = exec(
      built.sql,
      built.params.length > 0 ? built.params : undefined
    );

    return setMeta(cursor);
  };

  const del = async (options: DeleteOptions): Promise<Meta> => {
    const built = buildDelete(options);
    const cursor = exec(
      built.sql,
      built.params.length > 0 ? built.params : undefined
    );

    return setMeta(cursor);
  };

  return { query, select, insert, update, delete: del };
};
