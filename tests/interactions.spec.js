import { expect, test } from '@playwright/test'

test('mobile preserves a single viewport width and closes the menu with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)

  const menu = page.locator('[data-menu-trigger]')
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(menu).toHaveAccessibleName('Fechar menu')

  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await expect(menu).toHaveAccessibleName('Abrir menu')
  await expect(menu).toBeFocused()
})

test('a search suggestion can be dismissed with Escape and returns focus', async ({ page }) => {
  await page.goto('/')

  const trigger = page.locator('[data-open-search]')
  await trigger.click()
  await page.getByRole('button', { name: 'soberania' }).click()

  await expect(page.locator('[data-global-results]')).toContainText('Configurações da soberania')
  await page.keyboard.press('Escape')

  await expect(page.locator('[data-search-dialog]')).not.toHaveAttribute('open', '')
  await expect(trigger).toBeFocused()
})

test('a slower older search result cannot replace the latest query', async ({ page }) => {
  await page.route('**/api/archive?*', async (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('q') || ''
    await new Promise((resolve) => setTimeout(resolve, query === 'so' ? 300 : 20))
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        count: 1,
        results: [{
          slug: query,
          year: '2026',
          type: 'teste',
          title: `Resultado ${query}`,
          eyebrow: 'Teste',
          summary: 'Resposta controlada',
          tags: []
        }]
      })
    })
  })

  await page.goto('/')
  await page.locator('[data-open-search]').click()
  const input = page.locator('[data-global-search]')
  await input.fill('so')
  await page.waitForTimeout(240)
  await input.fill('soberania')

  const resultTitle = page.locator('[data-global-results] h3')
  await expect(resultTitle).toHaveText('Resultado soberania')
  await expect(resultTitle).not.toHaveText('Resultado so')
})
