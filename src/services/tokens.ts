import { createPrivateKey, createPublicKey, randomBytes, type KeyObject } from "node:crypto";
import { readFileSync } from "node:fs";
import { exportJWK, SignJWT, type JWK } from "jose";
import { getConfig } from "@/lib/config";
import { listReserved } from "@/services/subdomains";

interface KeyMaterial {
  kid: string;
  privateKey: KeyObject;
  jwks: { keys: JWK[] };
}

let material: Promise<KeyMaterial> | undefined;

/**
 * Ed25519 signing key (private, Platform only) plus the public JWKS the
 * Gateway verifies against. Old keys listed in JWT_EXTRA_PUBLIC_KEYS stay in
 * JWKS during rotation (SECURITY.md §8).
 */
function keys(): Promise<KeyMaterial> {
  material ??= (async () => {
    const c = getConfig();
    const privateKey = createPrivateKey(readFileSync(c.JWT_PRIVATE_KEY_PATH));
    if (privateKey.asymmetricKeyType !== "ed25519") throw new Error("JWT private key must be Ed25519");
    const pubs: [string, KeyObject][] = [[c.JWT_KID, createPublicKey(privateKey)]];
    for (const item of c.JWT_EXTRA_PUBLIC_KEYS.split(",").map((s) => s.trim()).filter(Boolean)) {
      const [kid, path] = item.split("=");
      if (!kid || !path) throw new Error(`bad JWT_EXTRA_PUBLIC_KEYS entry: ${item}`);
      pubs.push([kid, createPublicKey(readFileSync(path))]);
    }
    const jwks = {
      keys: await Promise.all(
        pubs.map(async ([kid, k]) => ({ ...(await exportJWK(k)), kid, alg: "EdDSA", use: "sig" })),
      ),
    };
    return { kid: c.JWT_KID, privateKey, jwks };
  })();
  return material;
}

export function resetKeysForTests(): void {
  material = undefined;
}

export async function jwks(): Promise<{ keys: JWK[] }> {
  return (await keys()).jwks;
}

/**
 * Short-lived Gateway JWT (PROTOCOL.md §4). `limits.subdomains` lists the
 * user's reserved names so the Gateway can authorize them offline.
 */
export async function issueGatewayJWT(userId: string, opts: { ttlSec?: number } = {}): Promise<{ token: string; expiresAt: Date }> {
  const c = getConfig();
  const { kid, privateKey } = await keys();
  const ttl = Math.min(opts.ttlSec ?? c.JWT_TTL_SECONDS, c.JWT_TTL_SECONDS);
  const now = Math.floor(Date.now() / 1000);
  const reserved = await listReserved(userId);
  const token = await new SignJWT({
    plan: "free",
    limits: {
      maxTunnels: c.MAX_TUNNELS,
      maxBodyBytes: c.MAX_BODY_BYTES,
      subdomains: reserved.map((r) => r.name),
    },
  })
    .setProtectedHeader({ alg: "EdDSA", typ: "JWT", kid })
    .setSubject(userId)
    .setIssuer(c.JWT_ISSUER)
    .setAudience(c.JWT_AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(now + ttl)
    .setJti(`jti_${randomBytes(12).toString("hex")}`)
    .sign(privateKey);
  return { token, expiresAt: new Date((now + ttl) * 1000) };
}
