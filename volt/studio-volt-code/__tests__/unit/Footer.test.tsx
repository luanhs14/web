import { render, screen } from '../test-utils'
import Footer from '@/app/components/Footer'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('Footer', () => {
  it('should render the company name and logo', () => {
    render(<Footer />)

    // Check for Studio Volt Code in footer (text appears in multiple places)
    const studioTexts = screen.getAllByText(/Studio/)
    const voltTexts = screen.getAllByText(/Volt/)
    const codeTexts = screen.getAllByText(/Code/)

    expect(studioTexts.length).toBeGreaterThan(0)
    expect(voltTexts.length).toBeGreaterThan(0)
    expect(codeTexts.length).toBeGreaterThan(0)
  })

  it('should render the tagline', () => {
    render(<Footer />)

    // Check for tagline in footer specifically
    const premiumText = screen.getByText(/Premium web development/)
    const qualityText = screen.getByText(/Velocidade sem comprometer qualidade/)

    expect(premiumText).toBeInTheDocument()
    expect(qualityText).toBeInTheDocument()
  })

  it('should render navigation menu links', () => {
    render(<Footer />)

    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Portfólio')).toBeInTheDocument()
    expect(screen.getByText('Processo')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('should have correct anchor links for menu items', () => {
    render(<Footer />)

    const servicosLink = screen.getByRole('link', { name: /Serviços/i })
    const portfolioLink = screen.getByRole('link', { name: /Portfólio/i })
    const processoLink = screen.getByRole('link', { name: /Processo/i })
    const faqLink = screen.getByRole('link', { name: /FAQ/i })

    expect(servicosLink).toHaveAttribute('href', '#servicos')
    expect(portfolioLink).toHaveAttribute('href', '#portfolio')
    expect(processoLink).toHaveAttribute('href', '#processo')
    expect(faqLink).toHaveAttribute('href', '#faq')
  })

  it('should render contact information with environment variables', () => {
    render(<Footer />)

    // Email from env
    const emailLink = screen.getByRole('link', { name: /test@example\.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')

    // Phone display from env
    expect(screen.getByText('+55 (21) 99999-9999')).toBeInTheDocument()
  })

  it('should render social media links', () => {
    render(<Footer />)

    const instagramLink = screen.getByRole('link', { name: /Instagram/i })
    const githubLink = screen.getByRole('link', { name: /GitHub/i })
    const linkedinLink = screen.getByRole('link', { name: /LinkedIn/i })

    expect(instagramLink).toBeInTheDocument()
    expect(githubLink).toBeInTheDocument()
    expect(linkedinLink).toBeInTheDocument()

    // Should have target="_blank"
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('target', '_blank')

    // Should have security attributes
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render WhatsApp CTA button', () => {
    render(<Footer />)

    const whatsappCTA = screen.getByRole('link', { name: /Fale Conosco/i })

    expect(whatsappCTA).toBeInTheDocument()
    expect(whatsappCTA.getAttribute('href')).toContain('wa.me')
    expect(whatsappCTA).toHaveAttribute('target', '_blank')
  })

  it('should render current year in copyright', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(`© ${currentYear} Studio Volt Code. Todos os direitos reservados.`)
    ).toBeInTheDocument()
  })

  it('should render "Desenvolvido com" message', () => {
    render(<Footer />)

    expect(screen.getByText(/Desenvolvido com/i)).toBeInTheDocument()
    expect(screen.getByText(/e IA/i)).toBeInTheDocument()
  })

  it('should render as footer element', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')

    expect(footer).toBeInTheDocument()
  })

  it('should have proper grid layout structure', () => {
    const { container } = render(<Footer />)

    // Should have grid layout
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should have aria-label on social media links', () => {
      render(<Footer />)

      const instagramLink = screen.getByRole('link', { name: /Instagram/i })
      const githubLink = screen.getByRole('link', { name: /GitHub/i })
      const linkedinLink = screen.getByRole('link', { name: /LinkedIn/i })

      expect(instagramLink).toHaveAttribute('aria-label')
      expect(githubLink).toHaveAttribute('aria-label')
      expect(linkedinLink).toHaveAttribute('aria-label')
    })

    it('should have noopener noreferrer on external links', () => {
      render(<Footer />)

      const externalLinks = screen.getAllByRole('link', {
        name: /Instagram|GitHub|LinkedIn|Fale Conosco/i,
      })

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Environment Variables Integration', () => {
    it('should use email from environment', () => {
      render(<Footer />)

      const emailLink = screen.getByText('test@example.com')
      expect(emailLink).toBeInTheDocument()
    })

    it('should use phone display from environment', () => {
      render(<Footer />)

      const phoneDisplay = screen.getByText('+55 (21) 99999-9999')
      expect(phoneDisplay).toBeInTheDocument()
    })

    it('should use WhatsApp link from environment', () => {
      render(<Footer />)

      const whatsappCTA = screen.getByRole('link', { name: /Fale Conosco/i })
      expect(whatsappCTA.getAttribute('href')).toContain('5521999999999')
    })
  })
})
