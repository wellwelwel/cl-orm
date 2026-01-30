import { assert, beforeEach, describe, it, kill, startScript } from 'poku';

const PORT = 8788;
const BASE_URL = `http://localhost:${PORT}`;

describe(async () => {
  await kill.port(PORT);

  const server = await startScript('dev:do', {
    startAfter: 'Ready on',
    timeout: 5000,
    verbose: true,
  });

  try {
    await describe('useDO', async () => {
      beforeEach(async () => {
        const res = await fetch(`${BASE_URL}/setup`);

        assert.strictEqual(res.status, 200);
      });

      await it('should insert a row', async () => {
        const res = await fetch(
          `${BASE_URL}/insert?name=Alice&email=alice@example.com`
        );

        assert.strictEqual(res.status, 200);

        const meta = await res.json();

        assert.ok(meta);
      });

      await it('should select multiple rows', async () => {
        await fetch(`${BASE_URL}/insert?name=Alice&email=alice@example.com`);

        const res = await fetch(`${BASE_URL}/select`);

        assert.strictEqual(res.status, 200);

        const data = (await res.json()) as {
          rows: Array<{ id: number; name: string; email: string }>;
        };

        assert.ok(Array.isArray(data.rows));
        assert.ok(data.rows.length > 0);
        assert.strictEqual(data.rows[0].name, 'Alice');
      });

      await it('should select a single row with limit 1', async () => {
        await fetch(`${BASE_URL}/insert?name=Alice&email=alice@example.com`);

        const res = await fetch(`${BASE_URL}/select?limit=1`);

        assert.strictEqual(res.status, 200);

        const data = (await res.json()) as {
          rows: { id: number; name: string; email: string };
        };

        assert.ok(data.rows !== null);
        assert.strictEqual(data.rows.name, 'Alice');
      });

      await it('should run a raw query', async () => {
        await fetch(`${BASE_URL}/insert?name=Alice&email=alice@example.com`);

        const res = await fetch(
          `${BASE_URL}/query?sql=${encodeURIComponent('SELECT * FROM users')}`
        );

        assert.strictEqual(res.status, 200);

        const data = (await res.json()) as {
          rows: Array<{ id: number; name: string; email: string }>;
        };

        assert.ok(data.rows.length > 0);
        assert.strictEqual(data.rows[0].name, 'Alice');
      });

      await it('should update a user', async () => {
        await fetch(`${BASE_URL}/insert?name=Alice&email=alice@example.com`);

        const res = await fetch(`${BASE_URL}/update?oldName=Alice&newName=Bob`);

        assert.strictEqual(res.status, 200);

        const selectRes = await fetch(`${BASE_URL}/select`);
        const data = (await selectRes.json()) as {
          rows: Array<{ id: number; name: string; email: string }>;
        };

        assert.strictEqual(data.rows[0].name, 'Bob');
      });

      await it('should delete a user', async () => {
        await fetch(`${BASE_URL}/insert?name=Bob&email=bob@example.com`);

        const res = await fetch(`${BASE_URL}/delete?name=Bob`);

        assert.strictEqual(res.status, 200);

        const selectRes = await fetch(`${BASE_URL}/select`);
        const data = (await selectRes.json()) as {
          rows: Array<{ id: number; name: string; email: string }>;
        };

        assert.strictEqual(data.rows.length, 0);
      });
    });
  } finally {
    await server.end(PORT);
  }
});
