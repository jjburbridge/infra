/**
 * Only `SANITY_STUDIO_`-prefixed variables are inlined into the Studio bundle at
 * build time. Defaults keep local development working without a `.env` file.
 */
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'j6kaz436'
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
export const studioTitle = process.env.SANITY_STUDIO_TITLE || 'App Studio Monorepo'
