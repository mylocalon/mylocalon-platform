---
title: Troubleshooting
description: Fixes for the most common problems.
---

## Install

### `command not found: mylocalon`

1. **Make sure you got the real package** — it installs 3 packages, not 1:

   ```bash
   npm install -g mylocalon@latest
   mylocalon --version
   ```

   If `npm install` says "added 1 package", clear the cache and retry:

   ```bash
   npm cache clean --force && npm install -g mylocalon@latest
   ```

2. **Open a new terminal** — some shells only see new commands after a restart.
3. **Check npm's global folder is on your PATH:**

   ```bash
   npm prefix -g
   ```

   Add its `bin` folder to your shell (macOS/Linux, zsh):

   ```bash
   echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
   ```

4. **Skip PATH entirely:** `npx mylocalon login` and `npx mylocalon http 3000`.

### `EACCES` permission error during install

Don't use `sudo`. Either use `npx`, or point npm at a folder you own:

```bash
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
npm install -g mylocalon
```

### `SyntaxError` or `Unsupported engine`

Your Node.js is too old. Install Node 20 or 22 LTS from [nodejs.org](https://nodejs.org).

## Login

| Problem | Fix |
|---|---|
| Browser doesn't open | Run `mylocalon login --no-browser` and open the printed link yourself |
| Page says the code is invalid or expired | Codes last 10 minutes. Run `mylocalon login` again |
| `could not reach https://mylocalon.com` | Check your internet; try another network (some office Wi-Fi and VPNs block it) |
| `API key was rejected (revoked?)` | The key was revoked in the dashboard. Run `mylocalon login` again |
| `not logged in` | Run `mylocalon login` |

## Visiting the URL

| You see | Meaning and fix |
|---|---|
| **404 Tunnel not found** | Nothing is running on that subdomain. Is `mylocalon http` still running? Did the URL change? |
| **502 The local app is not reachable** | The tunnel works, but nothing answers on your port. Start your app, check the port number |
| **502 Tunnel is reconnecting** | The CLI lost its connection and is reconnecting — wait a few seconds |
| **504 took too long** | Your app took more than 30 s to respond |
| **413** | Upload bigger than 10 MB |
| **429** | Too many requests — slow down |

### Redirects to localhost

Your app sends visitors to `http://localhost:3000/...`. That's because it builds
absolute URLs from the `Host` header, which mylocalon sets to your local target.
Use `X-Forwarded-Host` and `X-Forwarded-Proto` instead — most frameworks do this
when told they're behind a proxy:

- **Express:** `app.set("trust proxy", true)`
- **Django:** `USE_X_FORWARDED_HOST = True` and
  `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`
- **Rails:** works out of the box behind proxies; check `config.hosts`
- **Laravel:** configure `TrustProxies` middleware

Or use relative links (`/login` instead of `http://localhost:3000/login`).

### Hot reload / live updates don't work on the public URL

WebSockets aren't tunneled yet — see [Limits](/docs/limits). Pages load fine;
reload manually.

## Tunnel errors in the CLI

| Code | Fix |
|---|---|
| `TUNNEL_LIMIT` | You have 5 tunnels running. Stop one (check other terminals) |
| `SUBDOMAIN_TAKEN` | That reserved name is already running in another tunnel |
| `SUBDOMAIN_FORBIDDEN` | [Reserve the subdomain](/docs/subdomains) first |
| `RATE_LIMITED` | Too many connection attempts — wait a minute |
| `VERSION_UNSUPPORTED` | Update: `npm install -g mylocalon@latest` |
