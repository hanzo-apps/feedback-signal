# feedback-signal (Signal) — agent notes

Signal is a two-pane product-feedback triage inbox, and one of the real Hanzo
app templates forked on hanzo.app. Vite + React 19 + `@hanzo/gui` (UI) +
`@hanzo/iam` (auth) + `@hanzo/base` (data). Keep it minimal and REAL — every
surface must build and run, no fabricated UI or metrics.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam is what makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`. The
  IAM client id is `VITE_IAM_CLIENT_ID` (fallback `hanzo-app`).
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind). The slate palette + helpers live in `src/theme.ts`; shared atoms
  (Chip, ActionBtn, Caption) in `src/views/ui.tsx`.
- **Three views** — `signed-out` (landing + PKCE), the inbox `home` (two-pane
  shell), `list`/`detail`/`capture`.

## Data model (`schema.sql`)

- `feedback` — `source`, `body`, `sentiment` (positive|neutral|negative),
  `theme`, `status` (new|triaged|archived), `received_at` (ISO).
- `themes` — `name`, `color`.
- Lifecycle: an item lands `new` (unread weight in the list); triaging or
  archiving clears that weight. Base manages `id`/`created`/`updated`/`owner`/
  `org` and scopes rows to the org (`@request.auth.org_id = org`).

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo — the optimizer is a perf pass, not a correctness one.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`alignSelf`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`self`/
  `rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
  `Button` uses `onPress`; `Input`/`TextArea` use `value`/`onChangeText`.
  `color`/`backgroundColor`/`borderColor` accept raw hex; `placeholderTextColor`
  wants a `ColorTokens` token, so it is left to the theme default.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Keep it in
  lockstep with `src/views/*`.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage (the `*.hanzo.app` published-sites edge). No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped, IAM-native). Runtime read/write is browser → `VITE_HANZO_BASE_URL`
  with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Production needs a `https://*.hanzo.app/auth/callback`
  wildcard on the shared client (or a per-app `feedback-signal` client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` · `login()` performs a real PKCE
S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
