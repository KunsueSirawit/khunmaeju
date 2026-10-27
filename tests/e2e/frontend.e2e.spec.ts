import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  // "/" picks the language from the browser; a Thai browser (and Google, which sends none) gets /th.
  test.use({ locale: 'th-TH' })

  test('root redirects to the Thai home page', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expect(page).toHaveURL(/\/th$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'th')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('English home page renders', async ({ page }) => {
    await page.goto('http://localhost:3000/en')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
