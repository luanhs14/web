import { render, screen } from '../test-utils'
import HeroSection from '@/app/components/HeroSection'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

describe('HeroSection', () => {
  it('should render the main heading', () => {
    render(<HeroSection />)

    // Text is split across multiple elements, use regex
    expect(screen.getByText(/Studio/)).toBeInTheDocument()
    expect(screen.getByText(/Volt/)).toBeInTheDocument()
    expect(screen.getByText(/Code/)).toBeInTheDocument()
  })

  it('should render the main headline', () => {
    render(<HeroSection />)

    expect(screen.getByText('Seu Negócio Merece')).toBeInTheDocument()
    expect(screen.getByText('Presença Digital Profissional')).toBeInTheDocument()
  })

  it('should render the subtitle with IA mention', () => {
    render(<HeroSection />)

    expect(
      screen.getByText('Sites e aplicações web desenvolvidos com IA')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Entrega rápida sem comprometer qualidade')
    ).toBeInTheDocument()
  })

  it('should render primary CTA button with WhatsApp link', () => {
    render(<HeroSection />)

    const ctaButton = screen.getByRole('link', {
      name: /Solicitar Orçamento via WhatsApp/i,
    })

    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton).toHaveAttribute('href')
    expect(ctaButton.getAttribute('href')).toContain('wa.me')
    expect(ctaButton).toHaveAttribute('target', '_blank')
    expect(ctaButton).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render secondary CTA button with portfolio link', () => {
    render(<HeroSection />)

    const portfolioButton = screen.getByRole('link', {
      name: /Ver Portfólio/i,
    })

    expect(portfolioButton).toBeInTheDocument()
    expect(portfolioButton).toHaveAttribute('href', '#portfolio')
  })

  it('should render trust indicators', () => {
    render(<HeroSection />)

    expect(screen.getByText('Entrega Rápida')).toBeInTheDocument()
    expect(screen.getByText('Qualidade Premium')).toBeInTheDocument()
    expect(screen.getByText('Código Limpo')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<HeroSection />)

    // Links should have proper rel attributes
    const externalLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('should render as a section element', () => {
    const { container } = render(<HeroSection />)
    const section = container.querySelector('section')

    expect(section).toBeInTheDocument()
  })

  it('should have decorative icons (Zap, Sparkles, Code2)', () => {
    const { container } = render(<HeroSection />)

    // Lucide icons render as SVGs
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  describe('WhatsApp Link Generation', () => {
    it('should generate correct WhatsApp link with message', () => {
      render(<HeroSection />)

      const ctaButton = screen.getByRole('link', {
        name: /Solicitar Orçamento via WhatsApp/i,
      })

      const href = ctaButton.getAttribute('href')
      expect(href).toContain('wa.me/5521999999999')
      expect(href).toContain('text=')
      expect(href).toContain('or%C3%A7amento') // "orçamento" encoded
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      const { container } = render(<HeroSection />)
      const section = container.querySelector('section')

      // Should have min-h-screen for full viewport
      expect(section?.className).toContain('min-h-screen')
    })

    it('should have responsive text sizing', () => {
      render(<HeroSection />)

      const heading = screen.getByText('Presença Digital Profissional')

      // Should have responsive text classes (sm:, md:, lg:)
      expect(heading.className).toMatch(/text-\w+/)
    })
  })
})
