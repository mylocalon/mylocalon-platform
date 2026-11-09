import { db } from "@/db/pool";
import { burnVerify, hashSecret, verifySecret } from "@/auth/password";
import { newId, randomBase62 } from "@/lib/crypto";
import { notFound } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ApiKey } from "@/domain/types";

const KEY_PREFIX = "mlk_live_";
const PREFIX_LEN = KEY_PREFIX.length + 8;
const KEY_RE = /^mlk_live_[0-9A-Za-z]{40}$/;

interface KeyRow {
  id: string;
  name: string;
  prefix: string;
  created_at: Date;
  revoked_at: Date | null;
  last_used_at: Date | null;
}

const toKey = (r: KeyRow): ApiKey => ({
  id: r.id,
  name: r.name,
  prefix: r.prefix,
  createdAt: r.created_at,
  revokedAt: r.revoked_at,
  lastUsedAt: r.last_used_at,
});

/** Creates a key; the secret is returned exactly once and stored as argon2id. */
export async function createApiKey(userId: string, name: string): Promise<{ key: ApiKey; secret: string }> {
  const secret = KEY_PREFIX + randomBase62(40);
  const { rows } = await db().query(
    `INSERT INTO api_keys (id, user_id, name, prefix, key_hash) VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, prefix, created_at, revoked_at, last_used_at`,
    [newId("key"), userId, name, secret.slice(0, PREFIX_LEN), await hashSecret(secret)],
  );
  return { key: toKey(rows[0]), secret };
}

export async function listApiKeys(userId: string): Promise<ApiKey[]> {
  const { rows } = await db().query(
    `SELECT id, name, prefix, created_at, revoked_at, last_used_at FROM api_keys
     WHERE user_id = $1 ORDER BY revoked_at IS NOT NULL, created_at DESC`,
    [userId],
  );
  return rows.map(toKey);
}

export async function verifyApiKey(secret: string): Promise<{ userId: string; keyId: string } | null> {
  if (!KEY_RE.test(secret)) return null;
  const { rows } = await db().query(
    "SELECT id, user_id, key_hash FROM api_keys WHERE prefix = $1 AND revoked_at IS NULL",
    [secret.slice(0, PREFIX_LEN)],
  );
  const row = rows[0];
  if (!row) {
    await burnVerify(secret);
    return null;
  }
  if (!(await verifySecret(row.key_hash, secret))) return null;
  db()
    .query("UPDATE api_keys SET last_used_at = now() WHERE id = $1", [row.id])
    .catch((err) => logger.warn({ err }, "api_key_touch_failed"));
  return { userId: row.user_id, keyId: row.id };
}

export async function revokeApiKey(userId: string, keyId: string): Promise<void> {
  const { rowCount } = await db().query(
    "UPDATE api_keys SET revoked_at = now() WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL",
    [keyId, userId],
  );
  if (!rowCount) throw notFound("api key not found");
}
