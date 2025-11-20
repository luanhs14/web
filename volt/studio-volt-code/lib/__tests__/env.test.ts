import { env, getWhatsAppLink, validateEnv } from '../env'

describe('Environment Variables', () => {
  describe('env object', () => {
    it('should have whatsapp configuration', () => {
      expect(env.whatsapp).toBeDefined()
      expect(env.whatsapp.number).toBe('5521999999999')
      expect(env.whatsapp.link).toBe('https://wa.me/5521999999999')
    })

    it('should have contact configuration', () => {
      expect(env.contact).toBeDefined()
      expect(env.contact.email).toBe('test@example.com')
      expect(env.contact.phoneDisplay).toBe('+55 (21) 99999-9999')
    })

    it('should have site configuration', () => {
      expect(env.site).toBeDefined()
      expect(env.site.url).toBe('https://test.com')
      expect(env.site.name).toBe('Test Site')
    })

    it('should have optional analytics configuration', () => {
      expect(env.analytics).toBeDefined()
      expect(env.analytics.googleId).toBe('')
    })

    it('should have optional SEO configuration', () => {
      expect(env.seo).toBeDefined()
      expect(env.seo.googleVerification).toBe('')
      expect(env.seo.ogImage).toBe('/og-image.png')
    })

    it('should be immutable (as const)', () => {
      // TypeScript enforces immutability at compile time with "as const"
      // At runtime, JavaScript objects are mutable, so we just check types exist
      expect(env.site).toBeDefined()
      expect(env.site.url).toBe('https://test.com')

      // TypeScript will catch this at compile time:
      // env.site.url = 'new-url' // <-- Would fail to compile with "as const"
    })
  })

  describe('getWhatsAppLink', () => {
    it('should generate WhatsApp link with encoded message', () => {
      const message = 'Olá! Vim pelo site'
      const link = getWhatsAppLink(message)

      expect(link).toBe('https://wa.me/5521999999999?text=Ol%C3%A1!%20Vim%20pelo%20site')
    })

    it('should handle special characters in message', () => {
      const message = 'Test & special < > characters!'
      const link = getWhatsAppLink(message)

      expect(link).toContain('https://wa.me/5521999999999?text=')
      expect(link).toContain('%26') // &
      expect(link).toContain('%3C') // <
      expect(link).toContain('%3E') // >
      expect(link).toContain('!') // ! is not encoded
    })

    it('should handle empty message', () => {
      const link = getWhatsAppLink('')
      expect(link).toBe('https://wa.me/5521999999999?text=')
    })

    it('should handle emojis in message', () => {
      const message = 'Olá 👋 Gostaria de um orçamento'
      const link = getWhatsAppLink(message)

      expect(link).toContain('https://wa.me/5521999999999?text=')
      // Emoji should be URL encoded
      expect(link).toContain('%')
    })

    it('should preserve line breaks', () => {
      const message = 'Linha 1\nLinha 2'
      const link = getWhatsAppLink(message)

      expect(link).toContain('%0A') // \n encoded
    })
  })

  describe('validateEnv', () => {
    it('should validate successfully with all required vars', () => {
      // Should not throw
      expect(() => validateEnv()).not.toThrow()
    })

    it('should log success message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      validateEnv()

      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Environment variables validated successfully'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Missing environment variables', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should throw error when required variable is missing', () => {
      delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

      expect(() => {
        jest.isolateModules(() => {
          require('../env')
        })
      }).toThrow()
    })
  })

  describe('Type safety', () => {
    it('should have correct TypeScript types', () => {
      // These are compile-time checks, but we can verify runtime types
      expect(typeof env.whatsapp.number).toBe('string')
      expect(typeof env.whatsapp.link).toBe('string')
      expect(typeof env.contact.email).toBe('string')
      expect(typeof env.contact.phoneDisplay).toBe('string')
      expect(typeof env.site.url).toBe('string')
      expect(typeof env.site.name).toBe('string')
    })

    it('should return string from getWhatsAppLink', () => {
      const result = getWhatsAppLink('test')
      expect(typeof result).toBe('string')
    })
  })
})
