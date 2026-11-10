---
title: Installation
description: Install the mylocalon CLI with npm on macOS, Linux or Windows (Node.js 20+), log in, update or uninstall it, and fix common install problems.
updated: 2026-11-10
---

The CLI is distributed on npm and needs **Node.js 20 or newer**.

## 1. Install Node.js

Check whether you already have it:

```bash
node -v
```

If the command is missing or prints a version below `v20`, install the **LTS**
version from [nodejs.org](https://nodejs.org) (or use `nvm`, `brew install node`,
`winget install OpenJS.NodeJS.LTS`).

## 2. Install mylocalon

```bash
npm install -g mylocalon
```

Verify:

```bash
mylocalon --version
```

> **Tip:** don't want a global install? Use `npx` instead — every command
> works the same: `npx mylocalon login`, `npx mylocalon http 3000`.

## 3. Log in

```bash
mylocalon login
```

Your browser opens. Sign up (or log in), check that the code on the page matches
your terminal, and click **Approve**. You're ready — continue with the
[quickstart](/docs/quickstart).

## Updating

```bash
npm install -g mylocalon@latest
```

## Uninstalling

```bash
npm uninstall -g mylocalon
```

Your saved login lives in `~/.mylocalon/` — delete that folder to remove it too.

## Problems?

`command not found` after installing, permission errors, or an old version?
See [Troubleshooting](/docs/troubleshooting#install).
