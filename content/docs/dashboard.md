---
title: Dashboard & API keys
description: Watch tunnels live and manage access.
---

Log in at **[mylocalon.com/dashboard](https://mylocalon.com/dashboard)**.

## Tunnels

Shows every tunnel you've run in the last 24 hours with its live status:

| Status | Meaning |
|---|---|
| **active** | Connected and serving traffic |
| **reconnecting** | The connection dropped; the CLI is reconnecting and the URL is held for 30 seconds |
| **closed** | Stopped |

*Recent activity* lists connects, disconnects and reconnects with reasons.

## API keys

Every computer you log in from gets its own **API key** (named after the
computer). Keys let the CLI and SDK create tunnels.

- **Create** a key manually to use with `mylocalon login --api-key …`, in CI, or
  with the [SDK](/docs/sdk). The full key is shown **once** — copy it then.
- **Revoke** a key to cut off that computer. Tunnels using it stop on their next
  reconnect, and the CLI tells the user to log in again.

> **Note:** keys are stored hashed. Nobody — including mylocalon — can show you
> an existing key again; create a new one instead.

## Projects

Optional folders for grouping reserved subdomains (e.g. "client-acme").
Deleting a project keeps its subdomains reserved.
