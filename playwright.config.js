import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:8791',
    browserName: 'chromium'
  },
  webServer: {
    command: 'npx wrangler dev --local --port 8791',
    url: 'http://127.0.0.1:8791',
    reuseExistingServer: !process.env.CI
  }
})
