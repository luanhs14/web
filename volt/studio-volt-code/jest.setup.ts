import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '5521999999999'
process.env.NEXT_PUBLIC_WHATSAPP_LINK = 'https://wa.me/5521999999999'
process.env.NEXT_PUBLIC_EMAIL = 'test@example.com'
process.env.NEXT_PUBLIC_PHONE_DISPLAY = '+55 (21) 99999-9999'
process.env.NEXT_PUBLIC_SITE_URL = 'https://test.com'
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Site'
process.env.NEXT_PUBLIC_OG_IMAGE = '/og-image.png'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Suppress console errors during tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
