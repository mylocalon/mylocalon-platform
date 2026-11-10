---
title: Limits
description: mylocalon free plan limits — 5 tunnels, 5 reserved subdomains, 10 MB requests, 30 s timeouts, rate limits — and what is not supported yet.
updated: 2026-11-10
---

## Free plan

| | Limit |
|---|---|
| Tunnels running at once | 5 per account |
| Reserved subdomains | 5 per account |
| Request body | 10 MB (bigger uploads get `413`) |
| Response body | 10 MB |
| Request headers | 32 KB (bigger get `431`) |
| Requests per tunnel | 100 per second |
| Requests per visitor IP | 50 per second |
| Time for your app to respond | 30 seconds (then `504`) |
| Reconnect grace (URL kept) | 30 seconds |
| API calls | 120 per minute per key |

Going over a rate limit returns `429` with a `Retry-After` header.

## Not supported yet

- **WebSockets through the tunnel.** Normal pages and APIs work, but a site's
  own WebSocket connections (chat, live updates, **Vite/Next.js hot reload**)
  won't connect via the public URL. Hot reload still works on `localhost`.
- **Streaming / Server-Sent Events.** Responses are delivered once complete.
- **Custom domains** (`dev.yourcompany.com`) — use a reserved subdomain for now.
- **TCP / non-HTTP services** (databases, SSH, game servers).

Need more? [Self-host](/docs/self-hosting) mylocalon and set your own limits.
