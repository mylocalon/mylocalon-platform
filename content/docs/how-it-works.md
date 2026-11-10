---
title: How it works
description: How mylocalon routes a public HTTPS request through a secure WebSocket tunnel to your laptop, which headers your app sees, and how reconnects work.
updated: 2026-11-10
---

```text
 Visitor's browser                 mylocalon server                      Your computer
 ─────────────────                 ────────────────                      ─────────────
 https://myapp.mylocalon.com ──▶  Edge (HTTPS) ──▶ Gateway  ◀══ tunnel ══  mylocalon CLI ──▶ localhost:3000
                             ◀──                ◀──         ══════════▶               ◀──
```

1. **Your computer dials out.** `mylocalon http 3000` opens one secure
   WebSocket *from* your machine *to* `gateway.mylocalon.com`. Because the
   connection is outgoing, no ports need to be opened on your router or
   firewall.
2. **You get a name.** The gateway checks your token, assigns a subdomain
   (random or [reserved](/docs/subdomains)) and replies with your URL.
3. **A visitor opens the URL.** DNS for every `*.mylocalon.com` name points at
   the mylocalon server, which terminates HTTPS with a wildcard certificate.
4. **The gateway finds your tunnel** from the subdomain, wraps the HTTP request
   in a message and sends it down your WebSocket.
5. **The CLI replays it locally** against `http://localhost:3000` and sends the
   response back the same way. Status, headers and body arrive unchanged.

## Headers your app sees

| Header | Value |
|---|---|
| `Host` | your local target, e.g. `localhost:3000` (so dev servers accept the request) |
| `X-Forwarded-Host` | the public name, e.g. `myapp.mylocalon.com` |
| `X-Forwarded-Proto` | `https` |
| `X-Forwarded-For` | the visitor's IP address |

If your app builds absolute links, use `X-Forwarded-Host` — see
[Troubleshooting](/docs/troubleshooting#redirects-to-localhost).

## Staying connected

The gateway pings your CLI every 15 seconds. If the connection drops (Wi-Fi
change, laptop sleep, gateway restart), the CLI reconnects with growing pauses
(0.5 s up to 8 s) and **resumes the same tunnel**: your URL stays the same if it
comes back within **30 seconds**. Requests that arrive during the gap get a
"reconnecting" page.

## Logins and tokens

`mylocalon login` approves your computer in the browser and saves an **API key**.
Each time the CLI connects, it trades that key for a **tunnel token** valid for
one hour. The gateway verifies tokens itself, so tunnels keep working even if
the website is briefly down.
