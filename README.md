[npm-image]: https://img.shields.io/npm/v/cl-orm.svg
[npm-url]: https://npmjs.org/package/cl-orm
[downloads-image]: https://img.shields.io/npm/dt/cl-orm.svg
[downloads-url]: https://npmjs.org/package/cl-orm
[ci-url]: https://github.com/wellwelwel/cl-orm/actions/workflows/ci.yml?query=branch%3Amain
[ci-image]: https://img.shields.io/github/actions/workflow/status/wellwelwel/cl-orm/ci.yml?event=push&style=flat&label=ci&branch=main
[license-url]: https://github.com/wellwelwel/cl-orm/blob/main/License
[license-image]: https://img.shields.io/npm/l/cl-orm.svg?maxAge=2592000

# CL ORM

<img align="right" width="64" height="64" alt="Logo" src="website/static/img/favicon.svg">

A lightweight **ORM** for **Cloudflare Workers** (D1 and Durable Objects), designed to be intuitive, productive and focused on essential functionality.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![GitHub Workflow Status (with event)][ci-image]][ci-url]
[![License][license-image]][license-url]

- This project supports **Cloudflare D1** and **Durable Objects SQL Storage** as database drivers.

---

[**Documentation Website**](https://wellwelwel.github.io/cl-orm/docs/)

---

## Table of Contents

- [Why](#why)
- [Documentation](#documentation)
- [Quickstart](#quickstart)
  - [Installation](#installation)
  - [Connect](#connect)
  - [Basic Usage Example](#basic-usage-example)
- [Acknowledgements](#acknowledgements)

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
