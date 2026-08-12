/**
 * Only `SANITY_APP_`-prefixed variables are inlined into the app bundle at build
 * time. The project ID has no default and must be provided via `.env` (or the CI
 * environment); dataset falls back to a sensible default.
 */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const projectId = required('SANITY_APP_PROJECT_ID', process.env.SANITY_APP_PROJECT_ID)
export const dataset = process.env.SANITY_APP_DATASET || 'production'
