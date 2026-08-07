# app-studio-monorepo

A pnpm workspace containing two Sanity applications that share one content lake:

| Workspace     | What it is                                        | Dev URL                 |
| ------------- | ------------------------------------------------- | ----------------------- |
| `apps/studio` | Sanity Studio — schema definitions and editing UI  | http://localhost:3333   |
| `apps/app`    | Custom app built on the Sanity App SDK             | http://localhost:3334   |

Both point at Sanity project `j6kaz436`, dataset `production`.

## Requirements

- Node.js 20.19 or newer
- pnpm 10 (`corepack enable` picks up the pinned version from `packageManager`)
- A Sanity account with access to the project (`npx sanity login`)

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs both dev servers in parallel. To run just one:

```bash
pnpm dev:studio
pnpm dev:app
```

## Scripts

Run from the repo root:

| Script           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `pnpm dev`       | Start the Studio and the app together                           |
| `pnpm build`     | Production build of both workspaces                             |
| `pnpm lint`      | ESLint across both workspaces                                   |
| `pnpm typecheck` | `tsc --noEmit` across both workspaces                           |
| `pnpm typegen`   | Extract the schema and regenerate `apps/app/src/sanity.types.ts` |

## How the two apps relate

`apps/studio` owns the content model. Schema types live in `apps/studio/schemaTypes/`,
split into `documents/` (and `objects/`, `blocks/` as the model grows), with
`schemaTypes/index.ts` as the single export point.

`apps/app` is a read/write client for that same content. It uses App SDK hooks rather
than a Studio: `useDocuments` for lists, `useDocumentProjection` for previews, and
`useDocument` + `useEditDocument` for edits that write to the Content Lake on every
keystroke. Edits made in either app show up live in the other.

### Type generation

TypeGen is configured in `apps/studio/sanity.cli.ts` with `enabled: true`, so types are
regenerated automatically whenever the Studio dev server or build runs. It reads GROQ
queries from `apps/app/src` and writes `apps/app/src/sanity.types.ts`. Both
`schema.json` and the generated types are committed so a fresh clone typechecks before
anything is run.

Queries only get typed if they are assigned to a variable via `defineQuery` or the
`groq` template tag — inline query strings are skipped.

## Configuration

Project ID, dataset, and titles come from environment variables, with defaults in
`apps/studio/env.ts` and `apps/app/src/env.ts` so local development works with no
`.env` file. Copy `.env.example` in either workspace to `.env` to override.

Only prefixed variables are inlined into the browser bundle at build time:
`SANITY_STUDIO_*` for the Studio, `SANITY_APP_*` for the app.

| Variable                     | Used by | Purpose                                     |
| ---------------------------- | ------- | ------------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`   | Studio  | Sanity project ID                            |
| `SANITY_STUDIO_DATASET`      | Studio  | Dataset name                                 |
| `SANITY_STUDIO_TITLE`        | Studio  | Studio display title                         |
| `SANITY_STUDIO_HOSTNAME`     | CI      | Deploy hostname → `<name>.sanity.studio`     |
| `SANITY_STUDIO_APP_ID`       | CI      | Pins redeploys to one Studio (see below)     |
| `SANITY_APP_PROJECT_ID`      | App     | Sanity project ID                            |
| `SANITY_APP_DATASET`         | App     | Dataset name                                 |
| `SANITY_APP_ORGANIZATION_ID` | App     | Organization that owns the app               |
| `SANITY_APP_TITLE`           | App     | App name shown in the Sanity dashboard       |
| `SANITY_APP_ID`              | CI      | Pins redeploys to one app (see below)        |

## Deploying

Locally, from within either workspace directory:

```bash
pnpm --filter studio exec sanity deploy --url my-studio      # → my-studio.sanity.studio
pnpm --filter app exec sanity deploy --title "My App"        # → Sanity dashboard
```

`sanity deploy` builds before uploading, so there is no separate build step.

### Continuous deployment

`.github/workflows/deploy.yml` runs on every push to `main` or `staging` (and via
manual dispatch). It resolves the target environment, lints and typechecks once, then
deploys the Studio and the app as two independent jobs, so a failure in one does not
block the other.

#### Branch to environment mapping

The `config` job is the only place this mapping lives; every other job reads its
outputs. Each branch gets its own dataset *and* its own deploy targets, so a staging
deploy can never overwrite production.

| Branch    | Dataset      | Studio hostname            | App title              |
| --------- | ------------ | -------------------------- | ---------------------- |
| `main`    | `production` | `<hostname>`               | `<title>`              |
| `staging` | `staging`    | `<hostname>-staging`       | `<title> (Staging)`    |

Pushing any other branch fails with an explicit error rather than guessing an
environment.

Configure these in **Settings → Secrets and variables → Actions**.

Repository **variables** (not secret):

| Variable                        | Example                   |
| ------------------------------- | ------------------------- |
| `SANITY_PROJECT_ID`             | `j6kaz436`                |
| `SANITY_ORGANIZATION_ID`        | `on85MEGl3`               |
| `SANITY_STUDIO_HOSTNAME`        | `app-studio-monorepo`     |
| `SANITY_STUDIO_TITLE`           | `App Studio Monorepo`     |
| `SANITY_APP_TITLE`              | `App Studio Monorepo App` |
| `SANITY_STUDIO_APP_ID`          | set after first deploy     |
| `SANITY_STUDIO_APP_ID_STAGING`  | set after first deploy     |
| `SANITY_APP_ID`                 | set after first deploy     |
| `SANITY_APP_ID_STAGING`         | set after first deploy     |

The dataset is derived from the branch, so there is no `SANITY_DATASET` variable.

Repository **secrets** — note these are two different tokens:

| Secret                        | Token type                                                          |
| ----------------------------- | ------------------------------------------------------------------- |
| `SANITY_STUDIO_DEPLOY_TOKEN`  | Project-level robot token with deploy permission                     |
| `SANITY_APP_DEPLOY_TOKEN`     | **Organization-level** robot token with the *Manage SDK Apps* permission |

App SDK deploys will not work with a project-level token. Create the org token under
Manage → your organization → Settings → API → Robot tokens.

Each deploy job fails fast with a named error if any required variable is missing,
rather than deploying something half-configured.

### First deploy of each environment

Studios and apps behave differently here.

The **Studio** is identified by hostname, so CI handles it automatically: if
`<hostname>-staging` isn't registered yet, the deploy registers it without prompting.
Nothing manual is needed.

The **app** is identified only by its application ID. An unattended deploy can create
an app when the organization has none, but once one exists the CLI will not guess which
to target — it fails instead. So the first app deploy for each environment has to be
run once interactively, which offers a "New application deployment" choice:

```bash
cd apps/app
SANITY_APP_DATASET=staging pnpm exec sanity deploy --title "My App (Staging)"
```

Then pin the IDs it prints as the `SANITY_STUDIO_APP_ID`, `SANITY_STUDIO_APP_ID_STAGING`,
`SANITY_APP_ID`, and `SANITY_APP_ID_STAGING` repository variables. The app deploy job
warns when its ID is unset, since that run is likely to fail.

You can preview what any deploy would do without uploading anything:

```bash
pnpm --filter app exec sanity deploy --dry-run --title "My App"
```

## Notes on pnpm

The root `.npmrc` sets `node-linker=hoisted`. Sanity Studio and the App SDK resolve
plugins and `styled-components` at runtime and expect a flat `node_modules`, which
pnpm's default symlinked layout breaks.

## Adding a new workspace

`pnpm-workspace.yaml` already globs `apps/*` and `packages/*`, so a new frontend or a
shared package only needs its own `package.json`. Add CORS origins for any new browser
client with `npx sanity cors add http://localhost:PORT --credentials`.
