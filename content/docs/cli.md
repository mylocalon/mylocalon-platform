---
title: CLI reference
description: Reference for every mylocalon CLI command and flag: http, login, status, logout and version, plus config files, environment variables and exit codes.
updated: 2026-11-10
---

## mylocalon http

Share a local web server.

```bash
mylocalon http <port | host:port | url> [options]
```

| Example | Shares |
|---|---|
| `mylocalon http 3000` | `http://localhost:3000` |
| `mylocalon http 127.0.0.1:5173` | `http://127.0.0.1:5173` |
| `mylocalon http https://localhost:8443` | an HTTPS dev server (self-signed certificates are fine) |

| Option | Description |
|---|---|
| `-s, --subdomain <name>` | Use a [reserved subdomain](/docs/subdomains) instead of a random one |
| `--json` | Print one JSON event per line instead of the human view — handy for scripts |
| `--gateway <wss-url>` | Use a different gateway (self-hosting) |

Press **Ctrl+C** once to stop gracefully; press it twice to force quit.

## mylocalon login

```bash
mylocalon login [--no-browser] [--platform <url>] [--gateway <wss-url>]
mylocalon login --api-key <key>
```

| Option | Description |
|---|---|
| *(none)* | Browser login: approve this computer, an API key is created and saved |
| `--no-browser` | Print the approval link instead of opening a browser (SSH, servers, WSL) |
| `--api-key <key>` | Save an API key you created in the [dashboard](https://mylocalon.com/dashboard/keys) |
| `--platform <url>` / `--gateway <url>` | Point the CLI at a [self-hosted](/docs/self-hosting) installation |

## mylocalon status

Shows which platform and gateway the CLI uses and which credential is saved
(secrets are always shown redacted).

## mylocalon logout

Deletes the saved credentials from this computer. To also disable the key
everywhere, revoke it in the [dashboard](https://mylocalon.com/dashboard/keys).

## mylocalon version

Prints the installed version.

## Configuration

| | |
|---|---|
| Config file | `~/.mylocalon/config.json` (folder `0700`, file `0600` — the CLI refuses to read it if others can) |
| `MYLOCALON_TOKEN` | Use this token instead of the saved credentials (CI, containers) |
| `MYLOCALON_CONFIG_DIR` | Use a different config folder |
| `NO_COLOR` | Disable colored output |

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Stopped normally (Ctrl+C) |
| `1` | Error — the message explains what to do (see [Troubleshooting](/docs/troubleshooting)) |
| `2` | Invalid command or option |
