import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || '',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    /**
     * Minted on the first deploy. Pinning it makes redeploys target the same
     * Studio regardless of hostname changes.
     */
    // appId: process.env.SANITY_STUDIO_APP_ID || '',
  },
  typegen: {
    enabled: true,
    path: '../app/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../app/src/sanity.types.ts',
  },
})
