---
title: Node.js SDK
description: Open tunnels from your own code.
---

The CLI is built on **`@mylocalon/sdk-node`** — use it directly to start tunnels
from test suites, dev servers or tools.

```bash
npm install @mylocalon/sdk-node
```

Works with both `import` and `require`, Node.js 20+.

## Example

```ts
import { Tunnel } from "@mylocalon/sdk-node";

const API_KEY = process.env.MYLOCALON_API_KEY!; // create one in the dashboard

// Exchanges the API key for a short-lived tunnel token (called on every connect).
async function tokenProvider() {
  const res = await fetch("https://mylocalon.com/api/v1/tokens", {
    method: "POST",
    headers: { authorization: `Bearer ${API_KEY}` },
  });
  if (res.status === 401) throw Object.assign(new Error("API key revoked"), { fatal: true });
  return (await res.json()).token as string;
}

const tunnel = new Tunnel({
  gatewayUrl: "wss://gateway.mylocalon.com/tunnel",
  tokenProvider,
  target: "http://localhost:3000",
  // subdomain: "myapp",   // a reserved subdomain
});

tunnel.on("request", (r) => console.log(r.method, r.path, r.status ?? r.errorCode));
tunnel.on("disconnected", () => console.log("reconnecting…"));

const { url } = await tunnel.connect();
console.log("public at", url);

// later
await tunnel.close();
```

## Options

| Option | Default | Description |
|---|---|---|
| `gatewayUrl` | — | `wss://gateway.mylocalon.com/tunnel` |
| `tokenProvider` / `token` | — | Function returning a fresh token (recommended), or a fixed token |
| `target` | — | Local origin, e.g. `http://localhost:3000` |
| `subdomain` | random | A reserved subdomain |
| `reconnect` | `true` | Reconnect automatically and keep the same URL |
| `maxConcurrency` | `32` | Requests forwarded to your app at once |
| `requestTimeoutMs` | `30000` | Time your app has to answer before the visitor gets a 504 |

## Events

| Event | Payload |
|---|---|
| `active` | `{ tunnelId, subdomain, url }` — connected (also after a reconnect) |
| `request` | `{ reqId, method, path, status?, errorCode?, durationMs }` |
| `disconnected` / `reconnecting` | connection lost / reconnect attempt number |
| `closed` | `{ reason, error? }` — stopped for good |
| `state` | `{ from, to }` — every state change |

Throwing an error with `fatal: true` from `tokenProvider` stops reconnecting
(e.g. when the key was revoked).
