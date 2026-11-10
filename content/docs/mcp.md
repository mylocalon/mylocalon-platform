---
title: Share a local MCP server
description: Give Claude, ChatGPT or any MCP client a public HTTPS URL for the MCP server on your laptop.
updated: 2026-11-10
---

The **Model Context Protocol (MCP)** lets AI assistants call tools and read
data from your own servers. While you build an MCP server it runs on
`localhost` — which cloud-hosted assistants (Claude.ai custom connectors,
ChatGPT, hosted agents) can't reach. mylocalon gives it a public HTTPS URL in
one command, so you can test a remote MCP server **without deploying it**.

```bash
mylocalon http 8000 --subdomain my-mcp
```

```text
  Forwarding  https://my-mcp.mylocalon.com → http://localhost:8000
```

Your MCP endpoint is now `https://my-mcp.mylocalon.com/mcp`.

## What works

mylocalon forwards plain HTTP requests and delivers each response when it is
complete. That matches MCP's **Streamable HTTP** transport in
request/response mode:

| MCP setup | Works through mylocalon? |
|---|---|
| Streamable HTTP, JSON responses (`application/json`) | ✅ Yes — recommended |
| Streamable HTTP, a short SSE response per request that then closes | ✅ Yes — delivered when the response finishes |
| Stateless or session-based (`Mcp-Session-Id` header) | ✅ Yes — headers pass through unchanged |
| A long-lived `GET` event stream for server-initiated messages | ❌ No — it never completes, so it times out after 30 s |
| Legacy HTTP+SSE transport (separate `/sse` endpoint) | ❌ No — needs a streaming connection |
| `stdio` servers (launched as a local process) | ❌ Not over a network — wrap them with an HTTP transport first |

Tool calls must finish within **30 seconds** and responses stay under **10 MB**
([Limits](/docs/limits)).

## Python (official MCP SDK, FastMCP)

```python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("demo", stateless_http=True, json_response=True)

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

if __name__ == "__main__":
    mcp.run(transport="streamable-http")  # serves http://localhost:8000/mcp
```

```bash
python server.py
mylocalon http 8000 --subdomain my-mcp
```

## TypeScript (official MCP SDK)

Use the Streamable HTTP transport with JSON responses enabled:

```ts
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // stateless
  enableJsonResponse: true,      // plain JSON instead of an event stream
});
```

Mount it on `POST /mcp` in your HTTP server (Express, Hono, Node `http`), then
run `mylocalon http <port>`.

## Connect an AI client

1. **Test it first** with the MCP Inspector:

   ```bash
   npx @modelcontextprotocol/inspector
   ```

   Choose **Streamable HTTP**, enter `https://my-mcp.mylocalon.com/mcp`, and
   list the tools.

2. **Add it to your assistant** as a remote / custom connector using the same
   URL — for example in Claude: *Settings → Connectors → Add custom connector*.

3. **Watch the calls** arrive in your terminal as the assistant uses your tools:

   ```text
   10:42:07  POST   /mcp   200   38ms
   ```

> **Tip:** reserve the subdomain ([Reserved subdomains](/docs/subdomains)) so
> the connector URL never changes between sessions.

## Secure it

A tunnel URL is public: **anyone who has it can call your tools.** A hard-to-guess
subdomain is not protection.

- Require a secret on every request — check an `Authorization: Bearer …`
  header in your server and reject everything else.
- Never expose tools that run shell commands or touch real data without auth.
- Stop the tunnel (`Ctrl+C`) when you finish testing.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Client hangs, then **504** | The server opened a long-lived event stream. Enable JSON responses (`json_response=True` / `enableJsonResponse: true`). |
| **404** on `/mcp` | Check the path your server mounts; FastMCP uses `/mcp` by default. |
| **502** | Your MCP server isn't running on the port you tunneled. |
| Tools list is empty | Test with the MCP Inspector to separate server bugs from client setup. |
