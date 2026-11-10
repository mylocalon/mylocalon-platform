---
title: FAQ
description: Answers about mylocalon: pricing, how long URLs last, HTTPS local servers, WebSockets, MCP servers, custom domains, privacy and ngrok comparison.
updated: 2026-11-10
---

## Is mylocalon free?

Yes. The hosted service has a free plan (see [Limits](/docs/limits)), and the
code is open source if you'd rather [run your own](/docs/self-hosting).

## How long does my URL last?

Random URLs last while the tunnel runs (and survive short reconnects). For a URL
that never changes, [reserve a subdomain](/docs/subdomains).

## Does it work on Windows / Linux / macOS?

Yes — anywhere Node.js 20+ runs.

## Can I share an HTTPS local server?

Yes: `mylocalon http https://localhost:8443`. Self-signed certificates are fine.

## Can I use it for MCP servers?

Yes. Run your MCP server with the Streamable HTTP transport (JSON responses),
then `mylocalon http <port>` and give your AI client the
`https://….mylocalon.com/mcp` URL. See [Share a local MCP server](/docs/mcp).

## Do WebSockets work?

Not through the tunnel yet — regular HTTP pages and APIs do. See [Limits](/docs/limits).

## Can I use my own domain?

Not on the hosted service yet. Self-hosting lets you use any domain.

## Can other people see my requests?

Only the people you give the URL to can reach your app. The mylocalon server
routes the traffic but doesn't store request bodies. See [Security](/docs/security).

## Is it like ngrok?

Same idea — a public URL for a local app — built to be simple and fully open
source, with a free plan and a self-hosting option.

## How do I report a bug?

Open an issue on [GitHub](https://github.com/mylocalon/mylocalon-cli/issues).
