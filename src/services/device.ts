import { randomBytes } from "node:crypto";
import { db } from "@/db/pool";
import { getConfig } from "@/lib/config";
import { sha256 } from "@/lib/crypto";
import { AppError, gone, notFound, unprocessable } from "@/lib/errors";
import { createApiKey } from "@/services/apiKeys";

const TTL_SEC = 600;
const INTERVAL_SEC = 2;
// No vowels/lookalikes: avoids accidental words and 0/O, 1/I confusion.
const ALPHABET = "BCDFGHJKLMNPQRSTVWXZ";

function userCode(): string {
  const b = randomBytes(8);
  const s = Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join("");
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export const normalizeUserCode = (c: string) => {
  const s = c.toUpperCase().replace(/[^A-Z]/g, "");
  return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4)}` : c.toUpperCase();
};

/**
 * Device authorization (RFC 8628-style) for `mylocalon login`: the CLI shows
 * a user code, the user approves it in the browser, the CLI polls for a new
 * API key. Only a hash of the device code is stored and the key is minted at
 * poll time, so no secret ever rests in this table.
 */
export async function startDeviceFlow(clientName: string) {
  const deviceCode = randomBytes(32).toString("base64url");
  const code = userCode();
  await db().query(
    "INSERT INTO device_codes (device_code_hash, user_code, client_name, expires_at) VALUES ($1, $2, $3, now() + make_interval(secs => $4))",
    [sha256(deviceCode), code, clientName, TTL_SEC],
  );
  const base = getConfig().BASE_URL;
  return {
    deviceCode,
    userCode: code,
    verificationUri: `${base}/device`,
    verificationUriComplete: `${base}/device?code=${code}`,
    interval: INTERVAL_SEC,
    expiresIn: TTL_SEC,
  };
}

export async function describeDeviceCode(code: string): Promise<{ clientName: string; status: string } | null> {
  const { rows } = await db().query(
    "SELECT client_name, status FROM device_codes WHERE user_code = $1 AND expires_at > now()",
    [normalizeUserCode(code)],
  );
  return rows[0] ? { clientName: rows[0].client_name, status: rows[0].status } : null;
}

export async function decideDeviceCode(userId: string, code: string, approve: boolean): Promise<void> {
  const { rows } = await db().query(
    "SELECT device_code_hash FROM device_codes WHERE user_code = $1 AND status = 'pending' AND expires_at > now()",
    [normalizeUserCode(code)],
  );
  const row = rows[0];
  if (!row) throw notFound("code not found or expired");
  await db().query("UPDATE device_codes SET status = $2, user_id = $3 WHERE device_code_hash = $1", [
    row.device_code_hash,
    approve ? "approved" : "denied",
    userId,
  ]);
}

export type PollResult = { status: "pending" } | { status: "approved"; apiKey: string };

export async function pollDeviceCode(deviceCode: string): Promise<PollResult> {
  if (deviceCode.length < 20) throw unprocessable("invalid device code");
  const h = sha256(deviceCode);
  const { rows } = await db().query(
    "SELECT status, user_id, client_name, expires_at < now() AS expired FROM device_codes WHERE device_code_hash = $1",
    [h],
  );
  const row = rows[0];
  if (!row) throw notFound("unknown device code");
  if (row.status === "denied") {
    await db().query("DELETE FROM device_codes WHERE device_code_hash = $1", [h]);
    throw new AppError(403, "ACCESS_DENIED", "login was denied in the browser");
  }
  if (row.status === "approved") {
    // Single use: the DELETE ... RETURNING makes concurrent polls race-safe.
    const { rowCount } = await db().query("DELETE FROM device_codes WHERE device_code_hash = $1 RETURNING 1", [h]);
    if (!rowCount) throw notFound("unknown device code");
    const { secret } = await createApiKey(row.user_id, `CLI — ${row.client_name}`);
    return { status: "approved", apiKey: secret };
  }
  if (row.expired) {
    await db().query("DELETE FROM device_codes WHERE device_code_hash = $1", [h]);
    throw gone("device code expired; run `mylocalon login` again");
  }
  return { status: "pending" };
}
