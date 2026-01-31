export type Param = string | number | boolean | null;

export type Condition = {
  condition: string;
  params: Param[];
};

export type Connector = 'AND' | 'OR' | 'XOR' | 'NOT';

export type WhereItem = Condition | Connector | WhereItem[];

export type WhereClause = string | Condition | WhereItem[];

type Values = Record<string, unknown>;

export type InsertOptions = {
  table: string;
  values: Values | Values[];
};

export type JoinOptions = {
  type: 'left' | 'right' | 'inner' | 'cross';
  table: string;
  on: {
    a: string;
    b: string;
  };
  outer?: boolean;
};

export type SelectOptions = {
  columns?: string | string[];
  distinct?: boolean;
  from: string;
  join?: JoinOptions | JoinOptions[];
  where?: WhereClause;
  limit?: number;
  offset?: number;
  groupBy?: string;
  orderBy?: [string] | [string, 'ASC' | 'DESC'];
  params?: unknown[];
};

export type UpdateOptions = {
  table: string;
  set: Record<string, unknown>;
  where?: WhereClause;
  params?: unknown[];
};

export type DeleteOptions = {
  from: string;
  where?: WhereClause;
  limit?: number;
  params?: unknown[];
};

export type Meta = D1Meta & Record<string, unknown>;

export type QueryResult<T> = { rows: T[]; meta: Meta };

export type Connection = {
  query: <T = Record<string, unknown>>(
    sql: string,
    values?: unknown[]
  ) => Promise<QueryResult<T>>;
  select: {
    <T = Record<string, unknown>>(
      options: SelectOptions & { limit: 1 }
    ): Promise<T | null>;
    <T = Record<string, unknown>>(options: SelectOptions): Promise<T[]>;
  };
  insert: (options: InsertOptions) => Promise<Meta>;
  update: (options: UpdateOptions) => Promise<Meta>;
  delete: (options: DeleteOptions) => Promise<Meta>;
};
