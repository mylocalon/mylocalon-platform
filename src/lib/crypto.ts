import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** Unbiased random base62 string. */
export function randomBase62(len: number): string {
  let out = "";
  while (out.length < len) {
    for (const b of randomBytes(len * 2)) {
      if (b < 248) out += B62[b % 62]; // 248 = 4*62, rejection sampling
      if (out.length === len) break;
    }
  }
  return out;
}

export const newId = (prefix: string) => `${prefix}_${randomBytes(10).toString("hex")}`;

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
