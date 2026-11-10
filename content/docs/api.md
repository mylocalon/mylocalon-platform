---
title: REST API
description: mylocalon REST API reference: authenticate with an API key, issue tunnel tokens, and manage keys, reserved subdomains, projects and tunnel history.
updated: 2026-11-10
---

Base URL: `https://mylocalon.com/api/v1`. JSON in, JSON out.

## Authentication

Send an API key from the [dashboard](https://mylocalon.com/dashboard/keys):

```bash
curl https://mylocalon.com/api/v1/me \
  -H "Authorization: Bearer mlk_live_…"
```

Limit: 120 requests per minute per key.

## Endpoints

| Method & path | Body | Returns |
|---|---|---|
| `GET /me` | | your account |
| `POST /tokens` | `{ "ttlSec"?: 60–3600 }` | `{ token, expiresAt }` — a short-lived tunnel token for the [SDK](/docs/sdk) |
| `GET /keys` | | your API keys (never the secrets) |
| `POST /keys` | `{ "name": "ci" }` | `{ key, secret }` — the secret is shown only in this response |
| `DELETE /keys/{id}` | | revokes the key |
| `GET /subdomains` | | your reserved subdomains |
| `POST /subdomains` | `{ "name": "myapp", "projectId"?: "…" }` | the reservation |
| `DELETE /subdomains/{name}` | | releases it |
| `GET /projects` · `POST /projects` · `DELETE /projects/{id}` | `{ "name": "…" }` | projects |
| `GET /tunnels` | | `{ tunnels, history }` for the last 24 hours |
| `GET /jwks` | | public keys used to verify tunnel tokens |

## Errors

```json
{ "error": { "code": "CONFLICT", "message": "\"myapp\" is already taken" } }
```

| Status | Code | Typical cause |
|---|---|---|
| 401 | `UNAUTHORIZED` | missing, wrong or revoked API key |
| 404 | `NOT_FOUND` | doesn't exist, or isn't yours |
| 409 | `CONFLICT` | name already taken |
| 422 | `INVALID` | bad input — `details` says which field |
| 429 | `RATE_LIMITED` | slow down and retry |

Every response has an `x-request-id` header — include it if you report a problem.

## Example: reserve a subdomain from a script

```bash
curl -X POST https://mylocalon.com/api/v1/subdomains \
  -H "Authorization: Bearer $MYLOCALON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"pr-142-preview"}'
```
