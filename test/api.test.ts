import { createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createLocalJWKSet, jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import * as login from "../app/api/v1/auth/login/route";
import * as logout from "../app/api/v1/auth/logout/route";
import * as signup from "../app/api/v1/auth/signup/route";
import * as decide from "../app/api/v1/device/decide/route";
import * as poll from "../app/api/v1/device/poll/route";
import * as start from "../app/api/v1/device/start/route";
import * as reserved from "../app/api/v1/internal/reserved-subdomains/route";
import * as events from "../app/api/v1/internal/tunnel-events/route";
import * as jwksRoute from "../app/api/v1/jwks/route";
import * as keyById from "../app/api/v1/keys/[id]/route";
import * as keys from "../app/api/v1/keys/route";
import * as me from "../app/api/v1/me/route";
import * as projects from "../app/api/v1/projects/route";
import * as subByName from "../app/api/v1/subdomains/[name]/route";
import * as subs from "../app/api/v1/subdomains/route";
import * as tokens from "../app/api/v1/tokens/route";
import * as tunnels from "../app/api/v1/tunnels/route";
import { TEST_KEY_DIR } from "./paths";
import { call, cookieFrom } from "./helpers";

const INTERNAL = "internal-test-token-0123456789abcdef";

async function newUser(email = "dev@example.com") {
  const r = await call(signup.POST, "POST", "/api/v1/auth/signup", { body: { email, password: "correct-horse-1" } });
  expect(r.status).toBe(201);
  return { cookie: cookieFrom(r.headers), user: r.json.user as { id: string } };
}

async function newKey(cookie: string) {
  const r = await call(keys.POST, "POST", "/api/v1/keys", { cookie, body: { name: "laptop" } });
  expect(r.status).toBe(201);
  return r.json as { key: { id: string; prefix: string }; secret: string };
}

describe("auth", () => {
  it("signup → session cookie → /me", async () => {
    const { cookie, user } = await newUser();
    expect(cookie).toMatch(/^ml_session=/);
    const r = await call(me.GET, "GET", "/api/v1/me", { cookie });
    expect(r.json).toMatchObject({ user: { id: user.id, email: "dev@example.com" }, via: "session" });
    expect(JSON.stringify(r.json)).not.toContain("password");
  });

  it("cookie is httpOnly + SameSite=Lax", async () => {
    const r = await call(signup.POST, "POST", "/api/v1/auth/signup", { body: { email: "a@b.co", password: "correct-horse-1" } });
    expect(r.headers.get("set-cookie")).toMatch(/HttpOnly; SameSite=Lax/);
  });

  it("duplicate email (case-insensitive) → 409", async () => {
    await newUser("Dup@Example.com");
    const r = await call(signup.POST, "POST", "/api/v1/auth/signup", { body: { email: "dup@example.com", password: "correct-horse-1" } });
    expect(r.status).toBe(409);
  });

  it("weak password / unknown fields → 422", async () => {
    expect((await call(signup.POST, "POST", "/x", { body: { email: "a@b.co", password: "short" } })).status).toBe(422);
    expect((await call(signup.POST, "POST", "/x", { body: { email: "a@b.co", password: "correct-horse-1", admin: true } })).status).toBe(422);
  });

  it("login: wrong password and unknown email give the same 401", async () => {
    await newUser();
    const a = await call(login.POST, "POST", "/x", { body: { email: "dev@example.com", password: "nope-nope-nope" } });
    const b = await call(login.POST, "POST", "/x", { body: { email: "who@example.com", password: "nope-nope-nope" } });
    expect(a.status).toBe(401);
    expect(b.json).toEqual(a.json);
    const ok = await call(login.POST, "POST", "/x", { body: { email: "DEV@example.com", password: "correct-horse-1" } });
    expect(ok.status).toBe(200);
  });

  it("logout invalidates the session", async () => {
    const { cookie } = await newUser();
    await call(logout.POST, "POST", "/x", { cookie });
    expect((await call(me.GET, "GET", "/x", { cookie })).status).toBe(401);
  });

  it("CSRF: cookie-auth mutation without/with foreign Origin → 403", async () => {
    const { cookie } = await newUser();
    expect((await call(keys.POST, "POST", "/x", { cookie, body: { name: "k" }, origin: null })).status).toBe(403);
    expect((await call(keys.POST, "POST", "/x", { cookie, body: { name: "k" }, origin: "https://evil.com" })).status).toBe(403);
  });

  it("login is rate limited per IP", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) {
      statuses.push((await call(login.POST, "POST", "/x", { body: { email: "x@y.co", password: "pw" }, headers: { "x-forwarded-for": "9.9.9.9" } })).status);
    }
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });
});

describe("api keys", () => {
  it("created once, listed without secret, usable as Bearer, revocable", async () => {
    const { cookie } = await newUser();
    const { key, secret } = await newKey(cookie);
    expect(secret).toMatch(/^mlk_live_[0-9A-Za-z]{40}$/);
    expect(secret.startsWith(key.prefix)).toBe(true);

    const list = await call(keys.GET, "GET", "/x", { cookie });
    expect(JSON.stringify(list.json)).not.toContain(secret);
    expect(list.json.keys).toHaveLength(1);

    expect((await call(me.GET, "GET", "/x", { bearer: secret })).json.via).toBe("apikey");

    expect((await call(keyById.DELETE, "DELETE", "/x", { cookie, params: { id: key.id } })).status).toBe(200);
    expect((await call(me.GET, "GET", "/x", { bearer: secret })).status).toBe(401);
    expect((await call(keyById.DELETE, "DELETE", "/x", { cookie, params: { id: key.id } })).status).toBe(404);
  });

  it("cannot revoke another user's key", async () => {
    const a = await newUser("a@example.com");
    const b = await newUser("b@example.com");
    const { key } = await newKey(a.cookie);
    expect((await call(keyById.DELETE, "DELETE", "/x", { cookie: b.cookie, params: { id: key.id } })).status).toBe(404);
  });

  it("garbage or tampered keys → 401", async () => {
    const { cookie } = await newUser();
    const { secret } = await newKey(cookie);
    expect((await call(me.GET, "GET", "/x", { bearer: "mlk_live_nope" })).status).toBe(401);
    const tampered = secret.slice(0, -1) + (secret.endsWith("A") ? "B" : "A");
    expect((await call(me.GET, "GET", "/x", { bearer: tampered })).status).toBe(401);
  });
});

describe("tokens + jwks", () => {
  it("API key → Ed25519 JWT verifiable with the published JWKS", async () => {
    const { cookie, user } = await newUser();
    const { secret } = await newKey(cookie);
    await call(subs.POST, "POST", "/x", { cookie, body: { name: "myapp" } });

    const r = await call(tokens.POST, "POST", "/api/v1/tokens", { bearer: secret, origin: null });
    expect(r.status).toBe(200);
    const jwks = (await call(jwksRoute.GET, "GET", "/api/v1/jwks")).json;
    expect(jwks.keys[0]).toMatchObject({ kty: "OKP", crv: "Ed25519", kid: "test1", alg: "EdDSA" });
    expect(JSON.stringify(jwks)).not.toContain('"d"'); // no private material

    const { payload, protectedHeader } = await jwtVerify(r.json.token, createLocalJWKSet(jwks), {
      issuer: "mylocalon-platform",
      audience: "mylocalon-gateway",
    });
    expect(protectedHeader).toMatchObject({ alg: "EdDSA", kid: "test1" });
    expect(payload.sub).toBe(user.id);
    expect(payload.jti).toBeTruthy();
    expect(payload.exp! - payload.iat!).toBe(3600);
    expect(payload["limits"]).toMatchObject({ maxTunnels: 5, subdomains: ["myapp"] });
  });

  it("JWKS key matches the on-disk public key", async () => {
    const jwks = (await call(jwksRoute.GET, "GET", "/x")).json;
    const pub = createPublicKey(readFileSync(join(TEST_KEY_DIR, "ed25519.pub")));
    expect(pub.export({ format: "jwk" }).x).toBe(jwks.keys[0].x);
  });

  it("session cookie cannot mint gateway tokens; revoked key → 401", async () => {
    const { cookie } = await newUser();
    expect((await call(tokens.POST, "POST", "/x", { cookie })).status).toBe(401);
    const { key, secret } = await newKey(cookie);
    await call(keyById.DELETE, "DELETE", "/x", { cookie, params: { id: key.id } });
    expect((await call(tokens.POST, "POST", "/x", { bearer: secret })).status).toBe(401);
  });

  it("ttlSec can shorten but never extend", async () => {
    const { cookie } = await newUser();
    const { secret } = await newKey(cookie);
    const r = await call(tokens.POST, "POST", "/x", { bearer: secret, body: { ttlSec: 120 } });
    const exp = new Date(r.json.expiresAt).getTime();
    expect(exp - Date.now()).toBeLessThan(121_000);
    expect((await call(tokens.POST, "POST", "/x", { bearer: secret, body: { ttlSec: 99999 } })).status).toBe(422);
  });
});

describe("reserved subdomains", () => {
  it("reserve, uniqueness across users, blocklist, release, re-reserve", async () => {
    const a = await newUser("a@example.com");
    const b = await newUser("b@example.com");
    expect((await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "MyApp" } })).json.subdomain.name).toBe("myapp");
    expect((await call(subs.POST, "POST", "/x", { cookie: b.cookie, body: { name: "myapp" } })).status).toBe(409);
    expect((await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "admin" } })).status).toBe(422);
    expect((await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "-bad-" } })).status).toBe(422);
    expect((await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "a--b" } })).status).toBe(422);
    expect((await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "staging" } })).status).toBe(422);
    const phish = await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "paypal-login" } });
    expect(phish.status).toBe(422);
    expect(phish.json.error.message).toMatch(/brand/);

    expect((await call(subByName.DELETE, "DELETE", "/x", { cookie: b.cookie, params: { name: "myapp" } })).status).toBe(404);
    expect((await call(subByName.DELETE, "DELETE", "/x", { cookie: a.cookie, params: { name: "myapp" } })).status).toBe(200);
    expect((await call(subs.POST, "POST", "/x", { cookie: b.cookie, body: { name: "myapp" } })).status).toBe(201);
  });

  it("plan limit on reserved subdomains (3 in tests)", async () => {
    const { cookie } = await newUser();
    for (const n of ["one1", "two2", "three3"]) {
      expect((await call(subs.POST, "POST", "/x", { cookie, body: { name: n } })).status).toBe(201);
    }
    expect((await call(subs.POST, "POST", "/x", { cookie, body: { name: "four4" } })).status).toBe(422);
  });

  it("can attach to own project only", async () => {
    const a = await newUser("a@example.com");
    const b = await newUser("b@example.com");
    const prj = (await call(projects.POST, "POST", "/x", { cookie: a.cookie, body: { name: "web" } })).json.project;
    expect((await call(subs.POST, "POST", "/x", { cookie: b.cookie, body: { name: "bapp", projectId: prj.id } })).status).toBe(404);
    const r = await call(subs.POST, "POST", "/x", { cookie: a.cookie, body: { name: "aapp", projectId: prj.id } });
    expect(r.json.subdomain.projectId).toBe(prj.id);
  });
});

describe("device flow (mylocalon login)", () => {
  it("start → approve in browser → poll returns a working API key exactly once", async () => {
    const { cookie } = await newUser();
    const s = (await call(start.POST, "POST", "/x", { body: { clientName: "macbook" } })).json;
    expect(s.userCode).toMatch(/^[A-Z]{4}-[A-Z]{4}$/);
    expect(s.verificationUriComplete).toBe(`http://localhost:3001/device?code=${s.userCode}`);

    expect((await call(poll.POST, "POST", "/x", { body: { deviceCode: s.deviceCode } })).json).toEqual({ status: "pending" });

    const lower = s.userCode.toLowerCase().replace("-", "");
    expect((await call(decide.POST, "POST", "/x", { cookie, body: { userCode: lower, approve: true } })).status).toBe(200);

    const done = await call(poll.POST, "POST", "/x", { body: { deviceCode: s.deviceCode } });
    expect(done.json.status).toBe("approved");
    expect((await call(me.GET, "GET", "/x", { bearer: done.json.apiKey })).status).toBe(200);
    expect((await call(poll.POST, "POST", "/x", { body: { deviceCode: s.deviceCode } })).status).toBe(404);

    const list = (await call(keys.GET, "GET", "/x", { cookie })).json.keys;
    expect(list[0].name).toBe("CLI — macbook");
  });

  it("denied → 403 ACCESS_DENIED", async () => {
    const { cookie } = await newUser();
    const s = (await call(start.POST, "POST", "/x", { body: {} })).json;
    await call(decide.POST, "POST", "/x", { cookie, body: { userCode: s.userCode, approve: false } });
    const r = await call(poll.POST, "POST", "/x", { body: { deviceCode: s.deviceCode } });
    expect(r.status).toBe(403);
    expect(r.json.error.code).toBe("ACCESS_DENIED");
  });

  it("approval requires a browser session, not an API key", async () => {
    const { cookie } = await newUser();
    const { secret } = await newKey(cookie);
    const s = (await call(start.POST, "POST", "/x", { body: {} })).json;
    expect((await call(decide.POST, "POST", "/x", { bearer: secret, body: { userCode: s.userCode, approve: true } })).status).toBe(401);
  });
});

describe("internal (Gateway) endpoints", () => {
  it("require the internal token", async () => {
    expect((await call(reserved.GET, "GET", "/x")).status).toBe(401);
    expect((await call(reserved.GET, "GET", "/x", { bearer: "wrong" })).status).toBe(401);
  });

  it("reserved names feed", async () => {
    const { cookie } = await newUser();
    await call(subs.POST, "POST", "/x", { cookie, body: { name: "zeta" } });
    await call(subs.POST, "POST", "/x", { cookie, body: { name: "acorn" } });
    expect((await call(reserved.GET, "GET", "/x", { bearer: INTERNAL })).json).toEqual({ names: ["acorn", "zeta"] });
  });

  it("tunnel events → dashboard status + history", async () => {
    const { cookie, user } = await newUser();
    const t = Date.now();
    const ev = (tunnelId: string, event: string, dt: number) => ({ tunnelId, userId: user.id, subdomain: tunnelId.slice(4), event, at: t + dt });
    const r = await call(events.POST, "POST", "/x", {
      bearer: INTERNAL,
      body: { events: [ev("tnl_aaa", "connected", 0), ev("tnl_bbb", "connected", 1), ev("tnl_bbb", "disconnected", 2), ev("tnl_ccc", "connected", 3), ev("tnl_ccc", "closed", 4)] },
    });
    expect(r.status).toBe(202);
    const res = (await call(tunnels.GET, "GET", "/x", { cookie })).json;
    const byId = Object.fromEntries(res.tunnels.map((x: { tunnelId: string; status: string }) => [x.tunnelId, x.status]));
    expect(byId).toEqual({ tnl_aaa: "active", tnl_bbb: "reconnecting", tnl_ccc: "closed" });
    expect(res.history).toHaveLength(5);
    expect(res.history[0].event).toBe("closed");
  });

  it("a tunnel stuck reconnecting past the grace window is reported closed", async () => {
    const { cookie, user } = await newUser();
    const old = Date.now() - 5 * 60_000;
    await call(events.POST, "POST", "/x", {
      bearer: INTERNAL,
      body: { events: [
        { tunnelId: "tnl_old", userId: user.id, subdomain: "old", event: "connected", at: old },
        { tunnelId: "tnl_old", userId: user.id, subdomain: "old", event: "disconnected", at: old + 1 },
      ] },
    });
    const res = (await call(tunnels.GET, "GET", "/x", { cookie })).json;
    expect(res.tunnels[0]).toMatchObject({ tunnelId: "tnl_old", status: "closed" });
  });

  it("rejects malformed events", async () => {
    const r = await call(events.POST, "POST", "/x", { bearer: INTERNAL, body: { events: [{ tunnelId: "x", event: "exploded" }] } });
    expect(r.status).toBe(422);
  });
});
