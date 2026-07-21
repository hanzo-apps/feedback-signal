-- Hanzo Base schema for Signal (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here; every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped by the rule `@request.auth.org_id = org` (a member of your org
-- reads/writes it; other orgs cannot see it).
--
-- Keep this file in lockstep with what the app reads/writes (src/views/*).

-- Themes a PM groups feedback under (name + a swatch color).
CREATE TABLE IF NOT EXISTS themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6ea8fe'
);

-- Incoming feedback items. `status` drives the inbox lifecycle
-- (new -> triaged | archived); `received_at` is an ISO timestamp.
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  body TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'neutral',
  theme TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  received_at TEXT NOT NULL DEFAULT ''
);
