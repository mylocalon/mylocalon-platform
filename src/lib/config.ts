import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url().default("http://localhost:3001"),
  BASE_DOMAIN: z.string().default("localtest.me"),
  /** How tunnel URLs are shown: https in prod; http + gateway port in dev. */
  TUNNEL_URL_SCHEME: z.enum(["http", "https"]).default("https"),
  TUNNEL_URL_PORT: z.string().default(""),
  JWT_PRIVATE_KEY_PATH: z.string().default("keys/ed25519.key"),
  JWT_KID: z.string().default("k1"),
  /** Old public keys still served by JWKS during rotation: "kid=path,kid=path". */
  JWT_EXTRA_PUBLIC_KEYS: z.string().default(""),
  JWT_ISSUER: z.string().default("mylocalon-platform"),
  JWT_AUDIENCE: z.string().default("mylocalon-gateway"),
  JWT_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(3600),
  /** Shared secret the Gateway uses for /api/v1/internal/* (private network only). */
  INTERNAL_API_TOKEN: z.string().min(32),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).default(30),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).default("info"),
  // Plan defaults (plans/limits table comes with billing).
  MAX_TUNNELS: z.coerce.number().int().min(1).default(5),
  MAX_BODY_BYTES: z.coerce.number().int().min(1024).default(10 * 1024 * 1024),
  MAX_RESERVED_SUBDOMAINS: z.coerce.number().int().min(0).default(5),
  API_RATE_PER_MIN: z.coerce.number().int().min(1).default(120),
  AUTH_RATE_PER_MIN: z.coerce.number().int().min(1).default(10),
});

export type Config = z.infer<typeof schema> & { cookieSecure: boolean };

let cached: Config | undefined;

/** Loaded lazily so `next build` works without runtime secrets. */
export function getConfig(): Config {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new Error(`invalid platform configuration: ${issues}`);
    }
    const c = parsed.data;
    cached = { ...c, cookieSecure: c.COOKIE_SECURE ?? c.NODE_ENV === "production" };
  }
  return cached;
}

export function resetConfigForTests(): void {
  cached = undefined;
}
