import { expect, type Page, test } from '@playwright/test'

/**
 * Smoke tests for the public site. They run against the seeded sample data
 * (`npm run seed`), so they only rely on structure, not on brand copy.
 */

const PAGES = ['', '/products', '/news', '/about', '/services', '/how-to-order', '/contact']

/** JSON-LD blocks on the page, parsed. */
const jsonLd = async (page: Page) =>
  Promise.all(
    (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t)),
  )

test.describe('Pages', () => {
  for (const locale of ['th', 'en']) {
    for (const path of PAGES) {
      test(`/${locale}${path} renders`, async ({ page }) => {
        const response = await page.goto(`/${locale}${path}`)
        expect(response?.status()).toBe(200)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('h1').first()).toBeVisible()
        await expect(page.locator('header')).toBeVisible()
        await expect(page.locator('footer')).toBeVisible()
      })
    }
  }

  test('unknown page shows the 404 page', async ({ page }) => {
    const response = await page.goto('/th/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Catalog', () => {
  test('product list links to a product detail page with Product JSON-LD', async ({ page }) => {
    await page.goto('/th/products')
    const firstProduct = page.locator('main a[href*="/th/products/"]:not([href*="/category/"])').first()
    const href = await firstProduct.getAttribute('href')
    expect(href).toBeTruthy()
    await page.goto(href!)
    await expect(page.locator('h1')).toBeVisible()
    const schemas = await jsonLd(page)
    expect(schemas.some((s) => s['@type'] === 'Product' && s.name)).toBe(true)
  })

  test('category page lists products', async ({ page }) => {
    await page.goto('/th/products')
    const category = page.locator('a[href*="/th/products/category/"]').first()
    await page.goto((await category.getAttribute('href'))!)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('news detail has NewsArticle JSON-LD', async ({ page }) => {
    await page.goto('/en/news')
    const post = page.locator('main a[href*="/en/news/"]').first()
    await page.goto((await post.getAttribute('href'))!)
    const schemas = await jsonLd(page)
    expect(schemas.some((s) => s['@type'] === 'NewsArticle' && s.headline)).toBe(true)
  })
})

test.describe('Navigation', () => {
  test('language switcher keeps the page', async ({ page }) => {
    await page.goto('/th/about')
    await page.locator('header').getByRole('link', { name: 'English' }).first().click()
    await expect(page).toHaveURL(/\/en\/about$/)
  })

  test('mobile menu opens and links work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/th')
    const toggle = page.locator('header button[aria-expanded]')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.locator('nav[aria-label="Mobile"] a[href="/th/contact"]').click()
    await expect(page).toHaveURL(/\/th\/contact$/)
  })

  test('mobile pages do not scroll sideways', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    for (const path of PAGES) {
      await page.goto(`/th${path}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `/th${path}`).toBeLessThanOrEqual(0)
    }
  })
})

test.describe('Contact form', () => {
  test('shows a validation error when empty', async ({ page }) => {
    await page.goto('/th/contact')
    await page.locator('form button[type="submit"]').click()
    await expect(page.locator('form [role="alert"]')).toBeVisible()
    await expect(page.locator('form [name="name"]')).toHaveAttribute('aria-invalid', 'true')
  })
})

test.describe('SEO', () => {
  test('pages have canonical, hreflang and Open Graph tags', async ({ page }) => {
    await page.goto('/en/products')
    await expect(page).toHaveTitle(/\|/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/products$/)
    for (const lang of ['th', 'en', 'x-default']) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1)
    }
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    await expect(page.locator('meta[name="description"]')).toHaveCount(1)
  })

  test('home page has Organization JSON-LD', async ({ page }) => {
    await page.goto('/th')
    const schemas = await jsonLd(page)
    expect(schemas.some((s) => s['@type'] === 'Organization')).toBe(true)
  })

  test('robots.txt and sitemap.xml', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const xml = await sitemap.text()
    expect(xml).toContain('/th/products/')
    expect(xml).toContain('hreflang="en"')
  })
})

test.describe('Old site redirects', () => {
  const cases: [string, RegExp][] = [
    ['/shop/', /\/th\/products$/],
    ['/about/', /\/th\/about$/],
    ['/shop_location/', /\/th\/contact$/],
    ['/product/no-such-old-product/', /\/th\/products$/],
    ['/product-category/no-such-old-category/', /\/th\/products$/],
  ]
  for (const [from, to] of cases) {
    test(`${from} redirects permanently`, async ({ request }) => {
      const first = await request.get(from, { maxRedirects: 0 })
      expect([301, 308]).toContain(first.status())
      const final = await request.get(from)
      expect(final.status()).toBe(200)
      expect(final.url()).toMatch(to)
    })
  }
})
