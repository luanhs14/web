import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

/**
 * Custom render function that wraps components with providers if needed
 * Currently no providers, but can be extended for future needs
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, { ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

/**
 * Helper to mock window.location
 */
export const mockLocation = (url: string) => {
  delete (window as any).location
  window.location = new URL(url) as any
}

/**
 * Helper to wait for async updates
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Mock function for window.open
 */
export const mockWindowOpen = () => {
  const mockOpen = jest.fn()
  window.open = mockOpen
  return mockOpen
}

/**
 * Mock for next/image
 */
export const mockNextImage = () => {
  jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
      return <img {...props} />
    },
  }))
}
