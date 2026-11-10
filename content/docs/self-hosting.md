---
title: Self-hosting
description: Run mylocalon on your own Ubuntu server and domain: requirements, DNS and wildcard HTTPS, the one-command installer, and pointing the CLI at it.
updated: 2026-11-10
---

mylocalon is open source. Everything that powers mylocalon.com runs on a single
Linux server, and you can run the same stack on your own domain.

## What you need

| | |
|---|---|
| Server | Ubuntu 24.04, 2 vCPU / 2–4 GB RAM, public IPv4, ports 80/443 open |
| Domain | e.g. `tunnels.example.com`, with DNS on Cloudflare |
| DNS records | `A @` and `A *` → server IP (DNS only, not proxied) |
| Cloudflare API token | "Edit zone DNS" for the wildcard HTTPS certificate |

## Components

| Repo | Role |
|---|---|
| [mylocalon-gateway](https://github.com/mylocalon/mylocalon-gateway) | Go tunnel server |
| [mylocalon-platform](https://github.com/mylocalon/mylocalon-platform) | Website, dashboard, API (Next.js) |
| [mylocalon-deploy](https://github.com/mylocalon/mylocalon-deploy) | Caddy, systemd units, install and backup scripts |
| [mylocalon-cli](https://github.com/mylocalon/mylocalon-cli) · [mylocalon-sdk-node](https://github.com/mylocalon/mylocalon-sdk-node) | Clients |

PostgreSQL stores accounts; Redis holds live tunnel state; Caddy terminates
HTTPS. Everything except Caddy listens on localhost only.

## Install

```bash
git clone https://github.com/mylocalon/mylocalon-deploy.git deploy
rsync -a deploy/ root@SERVER:/root/mylocalon-deploy/
ssh root@SERVER /root/mylocalon-deploy/scripts/install.sh
```

The installer sets up Node 22, PostgreSQL, Redis and Caddy, generates every
password and signing key, and installs the services. Then deploy the gateway
binary and the platform, add your Cloudflare token, and start everything —
the full walkthrough is in
[DEPLOYMENT.md](https://github.com/mylocalon/mylocalon-docs/blob/main/DEPLOYMENT.md).

## Point the CLI at your server

```bash
mylocalon login --platform https://tunnels.example.com --gateway wss://gateway.tunnels.example.com/tunnel
```

Limits (tunnels per user, body size, rate limits) are environment variables —
see `/etc/mylocalon/gateway.env` and `platform.env` on the server.
