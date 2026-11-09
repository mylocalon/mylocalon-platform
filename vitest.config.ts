import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { TEST_KEY_DIR } from "./test/paths";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    globalSetup: ["./test/global-setup.ts"],
    setupFiles: ["./test/setup.ts"],
    fileParallelism: false, // tests share one Postgres database
    testTimeout: 20_000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: process.env["TEST_DATABASE_URL"] ?? "postgres://mylocalon:mylocalon@localhost:5433/mylocalon_test",
      JWT_PRIVATE_KEY_PATH: TEST_KEY_DIR + "/ed25519.key",
      JWT_KID: "test1",
      INTERNAL_API_TOKEN: "internal-test-token-0123456789abcdef",
      BASE_URL: "http://localhost:3001",
      LOG_LEVEL: "silent",
      MAX_RESERVED_SUBDOMAINS: "3",
    },
  },
});
