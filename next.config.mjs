// Plain JS on purpose: `next start` loads this file, and a .ts config would
// need TypeScript installed in production (we prune dev dependencies).
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Native / worker-thread deps must stay out of the server bundle.
  serverExternalPackages: ["@node-rs/argon2", "pino", "pg"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default config;
