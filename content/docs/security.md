---
title: Security
description: How mylocalon protects your traffic and account: HTTPS and TLS tunnels, hashed API keys, short-lived tokens, what the server sees, and safe usage.
updated: 2026-11-10
---

## Your traffic

- **Encrypted on the internet.** Visitors connect over HTTPS, and your CLI talks
  to the gateway over a TLS-encrypted WebSocket.
- **Decrypted on the mylocalon server.** Like every tunneling service, the
  server must read each request to route it. Bodies are never logged or stored;
  logs contain only method, path, status and timing. If that's not acceptable
  for your data, [self-host](/docs/self-hosting).
- **Only what you share is exposed.** The tunnel forwards to the single port you
  name. Nothing else on your computer is reachable, and visitors can't open
  connections back to you.

## Your account

- Passwords and API keys are stored as **Argon2id hashes** — never in plain text.
- API keys are shown once. Lost one? Create a new key and revoke the old one.
- Tunnel tokens expire after **one hour**; the CLI renews them automatically.
- Revoking a key in the dashboard stops new connections with it.
- The CLI's config file is readable only by you (`0600`) and the CLI refuses to
  use it otherwise.

## Good practice

- Stop tunnels (Ctrl+C) when you're done — a running tunnel is a public URL.
- Don't expose admin panels or databases without a password.
- Use a separate API key per computer or CI job so you can revoke one alone.

## Reporting a vulnerability

Please report security issues privately to **security@mylocalon.com** rather
than opening a public issue.
