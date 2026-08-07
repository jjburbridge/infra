/**
 * Only `SANITY_APP_`-prefixed variables are inlined into the app bundle at build
 * time. Defaults keep local development working without a `.env` file.
 */
export const projectId = process.env.SANITY_APP_PROJECT_ID || 'j6kaz436'
export const dataset = process.env.SANITY_APP_DATASET || 'production'
