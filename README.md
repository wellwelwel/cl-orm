# CL ORM

<img align="right" width="64" height="64" alt="Logo" src="website/static/img/favicon.svg">

A lightweight **ORM** for **Cloudflare Workers** (**D1** and **Durable Objects**), designed to be intuitive, productive and focused on essential functionality.

- This project supports **Cloudflare D1** and **Durable Objects SQL Storage** as database drivers.

---

📘 [**Documentation**](https://wellwelwel.github.io/cl-orm/docs/)

---

## Why

- An user-friendly ORM for **INSERT**, **SELECT**, **UPDATE**, **DELETE** and **WHERE** clauses.
- Automatic **Prepared Statements** (including **LIMIT** and **OFFSET**).
- Supports both **Cloudflare D1** and **Durable Objects** SQL Storage.
- Unified **Connection** interface across different database drivers.

---

## Documentation

See detailed specifications and usage in [**Documentation**](https://wellwelwel.github.io/cl-orm/docs/category/documentation) section for queries, advanced concepts and much more.

---

## Quickstart

### Installation

```shell
npm i cl-orm
```

---

### Connect

#### D1

```ts
import { useD1 } from 'cl-orm';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = useD1(env.DB);

    await db.query('SELECT 1');
    // ...
  },
};
```

#### Durable Objects

```ts
import { useDO } from 'cl-orm';
import { DurableObject } from 'cloudflare:workers';

export class MyDurableObject extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    const db = useDO(this.ctx.storage.sql);

    await db.query('SELECT 1');
    // ...
  }
}
```

---

### Basic Usage Example

The following example is based on **TypeScript** and **ES Modules**.

```ts
import type { Connection } from 'cl-orm';
import { OP } from 'cl-orm';

export const getUser = async (db: Connection, id: number) => {
  const user = await db.select({
    table: 'users',
    where: OP.eq('id', id),
    limit: 1,
  });

  return user;
};

// Usage: await getUser(db, 15);
```

- See all available operators (**OP**) [here](https://wellwelwel.github.io/cl-orm/docs/category/operators).
- Due to `limit: 1`, it returns a direct object with the row result or `null`.

---

## Acknowledgements

- The operator names **eq**, **ne**, **gt**, **lt**, **gte** and **lte** are inspired by [**Sequelize**](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators).
- [**Contributors**](https://github.com/wellwelwel/cl-orm/graphs/contributors).
- This project is adapted from [**MySQL2 ORM**](https://github.com/wellwelwel/mysql2-orm).
