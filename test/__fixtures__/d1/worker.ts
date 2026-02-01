import { useD1 } from '../../../src/index.js';
import { routes } from '../routes.js';

type Env = {
  DB: D1Database;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const db = useD1(env.DB);

    return routes(url, db);
  },
};
