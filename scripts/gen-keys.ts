// Generates the Platform's Ed25519 signing keypair. Usage: npm run keys:gen [dir]
import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "keys";
const priv = join(dir, "ed25519.key");
if (existsSync(priv)) {
  console.error(`${priv} exists; refusing to overwrite (rotate with a new dir + JWT_KID)`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true, mode: 0o700 });
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
writeFileSync(priv, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
writeFileSync(join(dir, "ed25519.pub"), publicKey.export({ type: "spki", format: "pem" }), { mode: 0o644 });
console.log(`wrote ${priv} and ${join(dir, "ed25519.pub")}`);
