import pg from "pg";
import { getConfig } from "@/lib/config";
import { logger } from "@/lib/logger";

const g = globalThis as unknown as { __mlPool?: pg.Pool };

/** One pool per process (survives Next dev hot reloads). */
export function db(): pg.Pool {
  if (!g.__mlPool) {
    g.__mlPool = new pg.Pool({ connectionString: getConfig().DATABASE_URL, max: 10 });
    g.__mlPool.on("error", (err) => logger.error({ err }, "pg_pool_error"));
  }
  return g.__mlPool;
}

export type Queryable = Pick<pg.Pool, "query">;

/** Run fn in a transaction. */
export async function tx<T>(fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await db().connect();
  try {
    await client.query("BEGIN");
    const r = await fn(client);
    await client.query("COMMIT");
    return r;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
