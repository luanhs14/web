const navLinks = [
  { href: '#features', label: 'Funcionalidades' },
  { href: '#how-it-works', label: 'Como funciona' },
  { href: '#plans', label: 'Planos' },
  { href: '#faq', label: 'FAQ' },
  { href: '/dashboard', label: 'App' },
  { href: '/login', label: 'Login' },
];

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
      <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-heading font-semibold tracking-tight">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg text-white shadow-glow">
            HS
          </span>
          <span className="text-white">Hub Study</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-4 text-sm text-fog/80 lg:justify-end">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            )
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:shadow-none"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
