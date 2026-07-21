# Signal — Product Feedback Inbox

A real, buildable Hanzo app: a two-pane triage inbox for incoming product
feedback. Feedback lands as items; you read each one, tag it by **theme** and
**sentiment**, and mark it **triaged** or **archived** — a focused, keyboard-inbox
way to turn raw user input into signal.

- **UI** — [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui) (the Hanzo
  design system) under Vite + React 19. 100% gui primitives — no Tailwind, no
  second kit.
- **Auth** — [`@hanzo/iam`](https://www.npmjs.com/package/@hanzo/iam), OAuth2
  **PKCE** against [hanzo.id](https://hanzo.id). No local passwords — IAM owns
  every credential interaction.
- **Data** — [`@hanzo/base`](https://www.npmjs.com/package/@hanzo/base), the
  IAM-native, org-scoped data plane. `feedback` and `themes` are real Base
  collections, isolated to your org.

## The three views

- **Inbox** — a two-pane console: a narrow, dense list of feedback rows (unread
  items carry the visual weight) on the left; the selected item's detail on the
  right.
- **Item detail** — the full body, a sentiment control (positive / neutral /
  negative), theme tags, and the triage actions (Triage · Archive · Reopen ·
  Delete).
- **Capture** — log a new piece of feedback (source, body, sentiment, theme). It
  lands in the inbox as `new`, ready to triage.

## Stack (pinned)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `^19.2.4` |
| `@hanzo/gui` + `@hanzogui/config` | `7.3.0` |
| `@hanzo/iam` | `^0.13.1` |
| `@hanzo/base` | `^0.2.1` |
| `vite` | `^6` (`@vitejs/plugin-react`) |
| `react-native-web` | `^0.21.0` |
| `typescript` | `5.9.3` |

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # serve the production build (SPA fallback on)
```

Out of the box it runs against **live** Hanzo (hanzo.id + api.hanzo.ai) — no
config needed to see the landing and sign-in flow. Copy `.env.example` to `.env`
to point at a different environment.

## Environment contract

Only `VITE_`-prefixed vars reach the browser (this is a static SPA — there is no
server). Defaults in parentheses.

| Var | Purpose |
| --- | --- |
| `VITE_HANZO_IAM_URL` (`https://hanzo.id`) | OIDC issuer. |
| `VITE_IAM_CLIENT_ID` (`hanzo-app`) | IAM application (client) id. Its redirect-URI list must allow this deploy's `/auth/callback` — see **Ambient IAM**. Deploy provisions a per-app client. |
| `VITE_HANZO_REDIRECT_URI` (`${origin}/auth/callback`) | PKCE redirect. |
| `VITE_HANZO_BASE_URL` (`https://api.hanzo.ai`) | Browser-reachable Hanzo Base data plane. Deploy injects the provisioned URL. |

## How auth works — ambient IAM

`login()` starts an OAuth2 **PKCE S256** redirect to hanzo.id; hanzo.id returns
to `/auth/callback`, where `handleCallback()` exchanges the code for tokens
(stored in `localStorage`, refresh-aware via `offline_access`). Every deployed
app is a static site at `<slug>.hanzo.app`; there is **no server token** — the
SPA authenticates the user in the browser and carries the resulting IAM JWT to
Base. The client id is read from `VITE_IAM_CLIENT_ID` (fallback `hanzo-app`).

The one deploy requirement: the IAM client must list this origin's
`/auth/callback` as an allowed redirect URI. Register a
`https://*.hanzo.app/auth/callback` wildcard on the shared client, or a dedicated
`feedback-signal` client per template.

## How data works — Base from `schema.sql`

[`schema.sql`](./schema.sql) is the app's `databaseSchema` (SQL DDL). On publish,
Hanzo Cloud translates each `CREATE TABLE` into a Hanzo Base collection
(`provisionBaseFromDDL`, additive + idempotent). Base manages
`id`/`created`/`updated`/`owner`/`org`, stamps `owner`+`org` from the verified
IAM principal, and scopes every row to the caller's org via the rule
`@request.auth.org_id = org` — a teammate in your org sees the row; other orgs
cannot. At runtime the views read/write `feedback` and `themes` through
`@hanzo/base/react` (`useQuery`/`useMutation`) carrying the IAM token. Keep
`schema.sql` in lockstep with what the app reads/writes.

## Deploy — Hanzo Cloud

[`hanzo.yml`](./hanzo.yml) declares a static build (`npm run build` → `dist/`,
served at `<slug>.hanzo.app`) plus the Base schema to provision and the env to
inject. Do **not** build a container image locally — Hanzo Cloud owns builds and
deploys. CI here only proves the template compiles green.

## Layout

```
src/
  main.tsx          entry
  providers.tsx     GuiProvider -> IamProvider -> BaseProvider(client=IAM-token)
  app.tsx           route (/auth/callback) + auth gate
  gui.config.ts     createGui(defaultConfig from @hanzogui/config/v5)
  iam.config.ts     IAM PKCE config
  env.ts            the VITE_ env contract, one place
  theme.ts          the slate palette + sentiment/status helpers
  types.ts          Feedback + Theme record shapes
  lib/base.ts       BaseClient carrying the IAM bearer token
  auth/callback.tsx PKCE return leg
  views/
    signed-out.tsx  landing + PKCE sign-in (with a static console preview)
    home.tsx        the signed-in two-pane shell (queries + mutations)
    list.tsx        left pane — the dense feedback queue
    detail.tsx      right pane — read, tag sentiment + theme, triage
    capture.tsx     log a new feedback item
    ui.tsx          shared atoms (Chip, ActionBtn, Caption)
schema.sql          databaseSchema -> Base collections on publish
hanzo.yml           Hanzo Cloud build/deploy manifest
```
