import { afterAll, beforeEach } from "vitest";
import { db } from "@/db/pool";
import { resetRateLimitsForTests } from "@/lib/ratelimit";

beforeEach(async () => {
  resetRateLimitsForTests();
  await db().query(
    "TRUNCATE users, sessions, api_keys, projects, reserved_subdomains, tunnel_audit, device_codes RESTART IDENTITY CASCADE",
  );
});

afterAll(async () => {
  await db().end();
  (globalThis as { __mlPool?: unknown }).__mlPool = undefined;
});
