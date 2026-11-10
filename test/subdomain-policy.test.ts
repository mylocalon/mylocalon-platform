import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND_TOKENS, checkSubdomain, RESERVED } from "@/domain/subdomain";

// Canonical policy shared with mylocalon-gateway; this copy must not drift.
const FIXTURE = join(import.meta.dirname, "../../docs/fixtures/policy/reserved-subdomains.json");

describe.skipIf(!existsSync(FIXTURE))("reserved subdomain policy", () => {
  const fx = JSON.parse(readFileSync(FIXTURE, "utf8")) as {
    reserved: string[];
    brandTokens: string[];
    cases: { name: string; allowed: boolean }[];
  };

  it("matches the canonical reserved list", () => {
    expect([...RESERVED].sort()).toEqual([...fx.reserved].sort());
    expect([...BRAND_TOKENS].sort()).toEqual([...fx.brandTokens].sort());
  });

  it.each(fx.cases)("$name → allowed=$allowed", ({ name, allowed }) => {
    expect(checkSubdomain(name) === null).toBe(allowed);
  });
});
