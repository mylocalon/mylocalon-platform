import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { migrate } from "../scripts/migrate";
import { TEST_KEY_DIR } from "./paths";

/** Fresh schema + signing keys once per test run. */
export default async function setup() {
  const url = process.env["TEST_DATABASE_URL"] ?? "postgres://mylocalon:mylocalon@localhost:5433/mylocalon_test";
  const c = new pg.Client({ connectionString: url });
  await c.connect();
  await c.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await c.end();
  await migrate(url, () => {});

  mkdirSync(TEST_KEY_DIR, { recursive: true });
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  writeFileSync(join(TEST_KEY_DIR, "ed25519.key"), privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
  writeFileSync(join(TEST_KEY_DIR, "ed25519.pub"), publicKey.export({ type: "spki", format: "pem" }));
}
