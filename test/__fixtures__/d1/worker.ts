import { OP, useD1 } from '../../../src/index.js';

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const db = useD1(env.DB);

    switch (url.pathname) {
      case '/setup': {
        await db.query('DROP TABLE IF EXISTS users');
        await db.query(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL)'
        );
        return Response.json({ ok: true });
      }

      case '/query': {
        const sql = url.searchParams.get('sql')!;
        const result = await db.query(sql);
        return Response.json(result);
      }

      case '/insert': {
        const name = url.searchParams.get('name')!;
        const email = url.searchParams.get('email')!;
        const meta = await db.insert({
          table: 'users',
          values: { name, email },
        });
        return Response.json(meta);
      }

      case '/select': {
        const limit = url.searchParams.get('limit');
        const rows = await db.select({
          from: 'users',
          ...(limit ? { limit: Number(limit) } : {}),
        });
        return Response.json({ rows });
      }

      case '/update': {
        const name = url.searchParams.get('name')!;
        const where = url.searchParams.get('where')!;
        const meta = await db.update({
          table: 'users',
          set: { name },
          where: OP.eq('name', where),
        });
        return Response.json(meta);
      }

      case '/delete': {
        const name = url.searchParams.get('name')!;
        const meta = await db.delete({
          from: 'users',
          where: OP.eq('name', name),
        });
        return Response.json(meta);
      }

      default:
        return new Response('Not found', { status: 404 });
    }
  },
};
