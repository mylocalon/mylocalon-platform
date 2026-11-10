---
title: Use cases
description: Step-by-step recipes for mylocalon: receive webhooks locally, share MCP servers with AI assistants, demo to clients, test on phones and OAuth callbacks.
updated: 2026-11-10
---

## Receive webhooks on your laptop

Payment providers and SaaS tools (Stripe, Razorpay, GitHub, Slack, Twilio) send
events to a public HTTPS URL. Point them at your machine instead of deploying:

1. [Reserve a subdomain](/docs/subdomains) so the URL never changes, e.g. `myhooks`.
2. Start your app and the tunnel:

   ```bash
   mylocalon http 3000 --subdomain myhooks
   ```

3. In the provider's dashboard set the webhook URL to
   `https://myhooks.mylocalon.com/webhooks/stripe` (your route).
4. Trigger a test event — it appears in your terminal and hits your code, so you
   can set breakpoints.

> **Tip:** providers retry failed deliveries. If your app was stopped, just
> start it again; the retries arrive at the same URL.

## Share a local MCP server with an AI assistant

Building tools for Claude, ChatGPT or another AI client? Cloud assistants can't
reach `localhost`. Give your MCP server a public HTTPS URL and add it as a
remote connector — no deploy:

```bash
mylocalon http 8000 --subdomain my-mcp
# MCP endpoint: https://my-mcp.mylocalon.com/mcp
```

Use the Streamable HTTP transport with JSON responses. Full guide:
[Share a local MCP server](/docs/mcp).

## Show a client or teammate your work

Skip the staging deploy. Run `mylocalon http 3000` and send the link. They see
your latest code the moment you save. Stop sharing with Ctrl+C.

## Test on real phones and tablets

Emulators miss things. Open the tunnel URL on any phone — on Wi-Fi or mobile
data — to test touch, layout, camera/geolocation APIs (which require HTTPS) and
real network speeds.

## Test OAuth and "Sign in with…" callbacks

Google, GitHub and other identity providers only redirect to registered HTTPS
URLs. Reserve a subdomain and register
`https://myapp.mylocalon.com/auth/callback` once — it keeps working every time
you run `mylocalon http 3000 --subdomain myapp`.

## Share an API with a mobile developer

Your teammate's iOS/Android build can call `https://myapi.mylocalon.com`
directly while you iterate on the backend locally.

## Reach a home server or Raspberry Pi

Run the CLI on the device itself to share a dashboard or service without
opening ports on your router:

```bash
mylocalon login --no-browser
mylocalon http 8080
```

## Script it

`--json` prints machine-readable events, e.g. to grab the URL in CI or a script:

```bash
mylocalon http 3000 --json | while read -r line; do echo "$line"; done
```

```json
{"ts":"…","event":"active","url":"https://abc123xy.mylocalon.com","subdomain":"abc123xy"}
{"ts":"…","event":"request","method":"GET","path":"/","status":200,"durationMs":12}
```

For full control from code, use the [Node.js SDK](/docs/sdk).
