// Render check for every page, logged out and logged in. Catches server-render
// crashes (e.g. passing functions to Client Components) that API tests miss.
// Usage: npm run smoke [-- http://localhost:3001]
import { randomBytes } from "node:crypto";

const BASE = process.argv[2] ?? "http://localhost:3001";
const pages = ["/", "/docs", "/docs/quickstart", "/docs/troubleshooting", "/login", "/signup", "/robots.txt", "/sitemap.xml"];
const authed = ["/dashboard", "/dashboard/keys", "/dashboard/subdomains", "/dashboard/projects", "/device", "/device?code=ABCD-EFGH"];

let failed = 0;
async function check(path: string, cookie?: string, expect = [200]) {
  const res = await fetch(BASE + path, { redirect: "manual", headers: cookie ? { cookie } : {} });
  const ok = expect.includes(res.status);
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${res.status}  ${cookie ? "[auth] " : "       "}${path}`);
}

for (const p of pages) await check(p);
for (const p of authed) await check(p, undefined, [307]); // logged out → redirect to login

const email = `smoke-${randomBytes(4).toString("hex")}@example.com`;
const signup = await fetch(`${BASE}/api/v1/auth/signup`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: BASE },
  body: JSON.stringify({ email, password: randomBytes(12).toString("hex") }),
});
const cookie = signup.headers.get("set-cookie")?.split(";")[0];
if (!cookie) {
  console.log(`FAIL signup ${signup.status}`);
  process.exit(1);
}
for (const p of authed) await check(p, cookie);

console.log(failed ? `\n${failed} page(s) failed` : "\nall pages render");
process.exit(failed ? 1 : 0);
