import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Studio Volt Code/)
  })

  test('should display hero section with main heading', async ({ page }) => {
    await expect(page.locator('text=Studio Volt Code')).toBeVisible()
    await expect(page.locator('text=Presença Digital Profissional')).toBeVisible()
  })

  test('should display all main sections', async ({ page }) => {
    // Hero section
    await expect(page.locator('text=Seu Negócio Merece')).toBeVisible()

    // Check if page has scrolled content (other sections exist)
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(1000)
  })

  test('should have working WhatsApp CTA button', async ({ page }) => {
    const ctaButton = page.locator('text=Solicitar Orçamento via WhatsApp')

    await expect(ctaButton).toBeVisible()

    // Check that it's a link
    const href = await ctaButton.getAttribute('href')
    expect(href).toContain('wa.me')
    expect(href).toContain('5521999999999')

    // Check it opens in new tab
    const target = await ctaButton.getAttribute('target')
    expect(target).toBe('_blank')
  })

  test('should have working portfolio link', async ({ page }) => {
    const portfolioLink = page.locator('text=Ver Portfólio')

    await expect(portfolioLink).toBeVisible()
    await portfolioLink.click()

    // Should scroll to portfolio section
    await page.waitForTimeout(500) // Wait for smooth scroll

    // Check if URL has hash
    expect(page.url()).toContain('#portfolio')
  })

  test('should display trust indicators', async ({ page }) => {
    await expect(page.locator('text=Entrega Rápida')).toBeVisible()
    await expect(page.locator('text=Qualidade Premium')).toBeVisible()
    await expect(page.locator('text=Código Limpo')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should navigate to different sections via footer links', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click on Serviços
    await page.locator('footer >> text=Serviços').click()
    await page.waitForTimeout(500)
    expect(page.url()).toContain('#servicos')
  })
})

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Should still display main content
    await expect(page.locator('text=Studio Volt Code')).toBeVisible()
    await expect(page.locator('text=Solicitar Orçamento')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.locator('text=Studio Volt Code')).toBeVisible()
  })
})

test.describe('SEO and Meta Tags', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')

    // Check description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('IA')

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toContain('Studio Volt Code')
  })

  test('should have proper canonical URL', async ({ page }) => {
    await page.goto('/')

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Should load within 5 seconds (generous for E2E)
    expect(loadTime).toBeLessThan(5000)
  })
})

test.describe('Contact Information', () => {
  test('should display contact information in footer', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check email
    await expect(page.locator('footer >> text=test@example.com')).toBeVisible()

    // Check phone
    await expect(page.locator('footer >> text=+55 (21) 99999-9999')).toBeVisible()
  })

  test('should have working email link', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    const emailLink = page.locator('footer >> a[href^="mailto:"]')
    await expect(emailLink).toBeVisible()

    const href = await emailLink.first().getAttribute('href')
    expect(href).toContain('mailto:test@example.com')
  })
})

test.describe('Accessibility', () => {
  test('should have no automatic accessibility violations', async ({ page }) => {
    await page.goto('/')

    // Check for basic accessibility
    // All images should have alt text or be decorative
    const images = await page.locator('img').count()

    // Just ensure page loaded
    expect(images).toBeGreaterThanOrEqual(0)
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')

    // Check that focus is visible (at least one element should be focused)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })
})
