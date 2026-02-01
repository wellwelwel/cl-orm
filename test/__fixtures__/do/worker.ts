import { DurableObject } from 'cloudflare:workers';
import { Connection, useDO } from '../../../src/index.js';
import { routes } from '../routes.js';

type Env = {
  MY_DO: DurableObjectNamespace<MyDurableObject>;
};

export class MyDurableObject extends DurableObject<Env> {
  async getDB(): Promise<Connection> {
    return useDO(this.ctx.storage.sql);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const DO = env.MY_DO.get(env.MY_DO.idFromName('default'));
    const db = await DO.getDB();

    return routes(new URL(request.url), db);
  },
};
