const footerNav = [
  { href: '#features', label: 'Funcionalidades' },
  { href: '#how-it-works', label: 'Como funciona' },
  { href: '#plans', label: 'Planos' },
  { href: '#cta', label: 'Começar' },
  { href: '/signup', label: 'Cadastro' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-12">
      <div className="container-shell grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg text-white">
              HS
            </span>
            <p className="text-lg font-heading font-semibold">Hub Study</p>
          </div>
          <p className="text-sm text-fog/70">
            A plataforma inteligente que organiza matérias, provas e tarefas para você estudar com confiança.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-fog/70">Mapa do site</p>
          <div className="flex flex-col gap-2 text-sm text-fog/70">
            {footerNav.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-fog/70">Newsletter</p>
          <p className="text-sm text-fog/70">Receba novidades e templates de estudo mensais.</p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="seuemail@email.com"
              className="w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder-fog/40 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
      <div className="container-shell mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-fog/50 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Hub Study. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">
            Termos
          </a>
          <a href="#" className="hover:text-white">
            Privacidade
          </a>
          <a href="mailto:oi@hubstudy.com" className="hover:text-white">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
}
