/**
 * Only `SANITY_STUDIO_`-prefixed variables are inlined into the Studio bundle at
 * build time. The project ID has no default and must be provided via `.env` (or
 * the CI environment); dataset and title fall back to sensible defaults.
 */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const projectId = required('SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID)
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
export const studioTitle = process.env.SANITY_STUDIO_TITLE || 'App Studio Monorepo'
