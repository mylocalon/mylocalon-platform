import pino from "pino";

/** JSON logs, secrets redacted (OBSERVABILITY.md §1, SECURITY.md §2). */
export const logger = pino({
  base: { service: "platform", env: process.env["NODE_ENV"] ?? "development" },
  level: process.env["LOG_LEVEL"] ?? "info",
  timestamp: () => `,"ts":"${new Date().toISOString()}"`,
  messageKey: "msg",
  formatters: { level: (label) => ({ level: label }) },
  redact: {
    paths: [
      "token", "*.token", "apiKey", "*.apiKey", "secret", "*.secret", "password", "*.password",
      "authorization", "*.authorization", "headers.authorization", "headers.cookie", "cookie",
    ],
    censor: "[REDACTED]",
  },
});
