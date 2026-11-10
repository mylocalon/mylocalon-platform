---
title: Quickstart
description: Share a local app on a public HTTPS URL in two minutes: install the mylocalon CLI, log in once, run mylocalon http 3000 and open the link anywhere.
updated: 2026-11-10
---

This guide assumes you've [installed the CLI](/docs/installation).

## 1. Start something locally

Any web server works. If you don't have one handy, this serves the current
folder on port 3000:

```bash
python3 -m http.server 3000
```

Check it at [http://localhost:3000](http://localhost:3000).

## 2. Log in (first time only)

```bash
mylocalon login
```

Approve the request in the browser window that opens. Your login is saved, so
you won't need to do this again on this computer.

## 3. Share it

```bash
mylocalon http 3000
```

```text
  ● mylocalon tunnel online

  Forwarding  https://abc123xy.mylocalon.com → http://localhost:3000
  Gateway     wss://gateway.mylocalon.com/tunnel

  Ctrl+C to stop
```

Open the `https://….mylocalon.com` URL on any device — your phone on mobile
data is a good test. Every request shows up in your terminal:

```text
11:31:54 AM  GET    /            200  26ms
11:31:56 AM  GET    /style.css   200  4ms
```

## 4. Stop sharing

Press **Ctrl+C**. The URL stops working immediately.

## Next

- Want the same URL every time? [Reserve a subdomain](/docs/subdomains).
- See your tunnels live in the [dashboard](https://mylocalon.com/dashboard).
- Browse [use cases](/docs/use-cases) — webhooks, demos, mobile testing.
