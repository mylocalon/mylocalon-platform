-- mylocalon Platform: source of truth (PLATFORM.md §3).

CREATE TABLE users (
  id            text PRIMARY KEY,
  email         text NOT NULL,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_lower ON users (lower(email));

CREATE TABLE sessions (
  id_hash    text PRIMARY KEY,               -- sha256 of the cookie value
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user ON sessions (user_id);

CREATE TABLE api_keys (
  id           text PRIMARY KEY,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  prefix       text NOT NULL UNIQUE,         -- cleartext lookup/display prefix
  key_hash     text NOT NULL,                -- argon2id
  created_at   timestamptz NOT NULL DEFAULT now(),
  revoked_at   timestamptz,
  last_used_at timestamptz
);
CREATE INDEX api_keys_user ON api_keys (user_id);

CREATE TABLE projects (
  id         text PRIMARY KEY,
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE TABLE reserved_subdomains (
  id          text PRIMARY KEY,
  user_id     text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  project_id  text REFERENCES projects(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz
);
-- A name can be held by only one user at a time; released rows are history.
CREATE UNIQUE INDEX reserved_subdomains_active_name ON reserved_subdomains (name) WHERE released_at IS NULL;
CREATE INDEX reserved_subdomains_user ON reserved_subdomains (user_id);

CREATE TABLE tunnel_audit (
  id         bigserial PRIMARY KEY,
  tunnel_id  text NOT NULL,
  user_id    text NOT NULL,
  subdomain  text NOT NULL,
  event      text NOT NULL,                  -- connected | resumed | disconnected | closed
  meta       jsonb NOT NULL DEFAULT '{}',
  at         timestamptz NOT NULL
);
CREATE INDEX tunnel_audit_user_at ON tunnel_audit (user_id, at DESC);
CREATE INDEX tunnel_audit_tunnel ON tunnel_audit (tunnel_id, at DESC);

-- CLI device-authorization flow (mylocalon login).
CREATE TABLE device_codes (
  device_code_hash text PRIMARY KEY,         -- sha256; the code itself lives only in the CLI
  user_code        text NOT NULL UNIQUE,
  client_name      text NOT NULL,
  status           text NOT NULL DEFAULT 'pending',  -- pending | approved | denied
  user_id          text REFERENCES users(id) ON DELETE CASCADE,
  created_at       timestamptz NOT NULL DEFAULT now(),
  expires_at       timestamptz NOT NULL
);
