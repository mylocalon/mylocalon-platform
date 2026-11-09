import { hash, verify } from "@node-rs/argon2";

// Argon2id (algorithm 2) with OWASP-recommended parameters.
const OPTS = { algorithm: 2, memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export const hashSecret = (s: string) => hash(s, OPTS);

export async function verifySecret(hashed: string, s: string): Promise<boolean> {
  try {
    return await verify(hashed, s);
  } catch {
    return false;
  }
}

/** A real hash to burn equal time when the user/key doesn't exist (no timing oracle). */
let dummy: Promise<string> | undefined;
export async function burnVerify(s: string): Promise<void> {
  dummy ??= hashSecret("mylocalon-dummy-password");
  await verifySecret(await dummy, s);
}
