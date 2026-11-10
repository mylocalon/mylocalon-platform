---
title: Introduction
description: What mylocalon is and when to use it.
---

**mylocalon gives the app running on your computer a public HTTPS URL.** Run one
command and anyone on the internet can reach `http://localhost:3000` at an address
like `https://abc123xy.mylocalon.com`.

```bash
npm install -g mylocalon
mylocalon login
mylocalon http 3000
```

```text
  ● mylocalon tunnel online

  Forwarding  https://abc123xy.mylocalon.com → http://localhost:3000
```

## Why use it

- **No port forwarding, no router setup.** Your computer opens an outgoing
  connection to mylocalon, so it works behind home Wi-Fi, office firewalls and
  mobile hotspots.
- **Real HTTPS.** Every URL has a valid certificate — webhooks, OAuth callbacks
  and phones accept it.
- **Stable URLs when you need them.** Reserve a subdomain like
  `myapp.mylocalon.com` and get the same address every time.
- **Survives hiccups.** If your Wi-Fi drops for a moment, the tunnel reconnects
  and keeps the same URL.
- **Open source and self-hostable.** Run the whole stack on your own server and
  domain.

## Common uses

- Receiving **webhooks** (Stripe, Razorpay, GitHub, Slack) on your laptop
- Showing a **client or teammate** what you're building, without deploying
- Testing your site on **real phones** and other devices
- Testing **OAuth / login callbacks** that need a public HTTPS URL

See [Use cases](/docs/use-cases) for step-by-step recipes.

## Next steps

1. [Install the CLI](/docs/installation)
2. [Follow the quickstart](/docs/quickstart) — first public URL in two minutes
