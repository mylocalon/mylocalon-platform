---
title: Reserved subdomains
description: Reserve a subdomain like myapp.mylocalon.com to get the same HTTPS URL every time — ideal for webhooks and OAuth callbacks. Naming rules and limits.
updated: 2026-11-10
---

By default each `mylocalon http` run gets a random address like
`abc123xy.mylocalon.com`. **Reserve a subdomain** to get the same one every time
— essential for webhooks and OAuth callbacks.

## Reserve one

1. Open **[Dashboard → Subdomains](https://mylocalon.com/dashboard/subdomains)**.
2. Type a name, e.g. `myapp`, and click **Reserve**.
3. Use it:

   ```bash
   mylocalon http 3000 --subdomain myapp
   ```

Your tunnel is now at `https://myapp.mylocalon.com`. Running tunnels pick up new
reservations the next time they connect — no new login needed.

## Naming rules

- 3–63 characters: lowercase letters, numbers and hyphens
- Can't start or end with a hyphen, or contain `--`
- **Reserved names** can't be claimed by anyone: mylocalon's own surfaces
  (`www`, `api`, `docs`, `status`, `gateway`, `mylocalon`), account and billing
  words (`login`, `account`, `secure`, `billing`), environment names
  (`staging`, `prod`, `dev`, `demo`, `beta`) and privileged words (`admin`,
  `root`, `official`)
- **Brand protection:** names that contain a well-known brand as a
  hyphen-separated word are refused too — `paypal-login`, `secure-gmail-verify`
  and `my-icloud` all fail. This keeps tunnels from being used for phishing on a
  trusted HTTPS domain. Names that merely *contain* the letters (`applepie`) are fine.
- First come, first served — a name held by someone else can't be reserved

The free plan includes **5 reserved subdomains**. Group them by **project** in
the dashboard if you like.

## Releasing

Click **Release** next to a name. Anyone can then reserve it, so only release
names you're done with.

## Errors

| Message | Meaning |
|---|---|
| `SUBDOMAIN_FORBIDDEN` | You haven't reserved that name (or it's not allowed). Reserve it first. |
| `SUBDOMAIN_TAKEN` | That name is already running in another tunnel — maybe one you left open in another terminal. |
