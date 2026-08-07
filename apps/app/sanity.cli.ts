import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  app: {
    organizationId: process.env.SANITY_APP_ORGANIZATION_ID || 'on85MEGl3',
    entry: './src/App.tsx',
    title: process.env.SANITY_APP_TITLE || 'App Studio Monorepo App',
  },
  deployment: {
    /**
     * Minted on the first deploy. Without it the CLI redeploys over whichever
     * app it finds in the organization, so pin it once CI is live.
     */
    appId: process.env.SANITY_APP_ID,
  },
})
