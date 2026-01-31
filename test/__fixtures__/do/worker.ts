import type { Connection } from '../../../src/types.js';
import { DurableObject } from 'cloudflare:workers';
import { OP, useDO } from '../../../src/index.js';

interface Env {
  MY_DO: DurableObjectNamespace<MyDurableObject>;
}

export class MyDurableObject extends DurableObject<Env> {
  private db: Connection;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.db = useDO(ctx.storage.sql);
  }

  async setup() {
    await this.db.query('DROP TABLE IF EXISTS users');
    await this.db.query(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL)'
    );
    return { ok: true };
  }

  async queryRaw(sql: string) {
    return this.db.query(sql);
  }

  async insertUser(name: string, email: string) {
    return this.db.insert({
      table: 'users',
      values: { name, email },
    });
  }

  async selectUsers(limit?: number) {
    return this.db.select({
      from: 'users',
      ...(limit ? { limit: limit as 1 } : {}),
    });
  }

  async updateUser(oldName: string, newName: string) {
    return this.db.update({
      table: 'users',
      set: { name: newName },
      where: OP.eq('name', oldName),
    });
  }

  async deleteUser(name: string) {
    return this.db.delete({
      from: 'users',
      where: OP.eq('name', name),
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const DO = env.MY_DO.get(env.MY_DO.idFromName('default'));

    switch (url.pathname) {
      case '/setup': {
        const result = await DO.setup();
        return Response.json(result);
      }

      case '/query': {
        const sql = url.searchParams.get('sql')!;
        const result = await DO.queryRaw(sql);
        return Response.json(result);
      }

      case '/insert': {
        const name = url.searchParams.get('name')!;
        const email = url.searchParams.get('email')!;
        const meta = await DO.insertUser(name, email);
        return Response.json(meta);
      }

      case '/select': {
        const limit = url.searchParams.get('limit');
        const rows = await DO.selectUsers(limit ? Number(limit) : undefined);
        return Response.json({ rows });
      }

      case '/update': {
        const oldName = url.searchParams.get('oldName')!;
        const newName = url.searchParams.get('newName')!;
        const meta = await DO.updateUser(oldName, newName);
        return Response.json(meta);
      }

      case '/delete': {
        const name = url.searchParams.get('name')!;
        const meta = await DO.deleteUser(name);
        return Response.json(meta);
      }

      default:
        return new Response('Not found', { status: 404 });
    }
  },
};
