const logos = ['UFSP', 'Anglo+', 'PoliVest', 'Prefixo', 'EduLive'];

const painPoints = [
  {
    title: 'Sem caos',
    copy: 'Visualize matérias, provas e tarefas numa linha do tempo inteligente.',
    meta: 'Agenda conectada',
  },
  {
    title: 'Revisões guiadas',
    copy: 'O Hub sugere ciclos de revisão baseados nos seus objetivos.',
    meta: 'Lembretes ativos',
  },
  {
    title: 'Datas seguras',
    copy: 'Alertas multicanal garantem que você não esqueça nenhum prazo.',
    meta: 'Alertas + Insights',
  },
];

const journeySteps = [
  {
    title: 'Monte sua conta',
    copy: 'Escolha matérias, carga horária desejada e metas.',
    detail: '2 min',
  },
  {
    title: 'Planejamento automágico',
    copy: 'O algoritmo distribui suas atividades e revisões.',
    detail: 'IA Hub Flow',
  },
  {
    title: 'Receba alertas',
    copy: 'Notificações por e-mail, WhatsApp e push.',
    detail: 'Alertas +2 canais',
  },
  {
    title: 'Meça o progresso',
    copy: 'Dashboard mostra tempo estudado e streaks semanais.',
    detail: 'Insights live',
  },
];

const features = [
  {
    title: 'Calendário inteligente',
    bullets: ['Arraste tarefas com snap automático', 'Filtros por matéria e prova', 'Visual semanal e mensal'],
    metric: '+32% organização',
  },
  {
    title: 'Alertas multicanal',
    bullets: ['WhatsApp, e-mail e push', 'Recomendações de horário', 'Confirmação com 1 toque'],
    metric: '0 prazos perdidos',
  },
  {
    title: 'Planos personalizados',
    bullets: ['Templates ENEM, vestibulares e concursos', 'Sugestões automáticas de revisão', 'Checklist diário'],
    metric: 'Planejamento em 3 min',
  },
  {
    title: 'Insights semanais',
    bullets: ['Gráficos por matéria', 'Tempo investido vs. meta', 'Sugestões para focar'],
    metric: '+18% produtividade',
  },
];

const testimonials = [
  {
    name: 'Maria Eduarda',
    role: '3º ano | Medicina',
    quote: 'Com o Hub Study parei de descobrir prova em cima da hora. O app avisa tudo e eu só executo.',
    color: '#FF5ED6',
  },
  {
    name: 'João Victor',
    role: 'Pré-vestibular',
    quote: 'As revisões guiadas me salvaram. Consigo ver o que está atrasado e manter o ritmo.',
    color: '#3D5AFE',
  },
  {
    name: 'Larissa Gomes',
    role: 'Estagiária + faculdade',
    quote: 'Tenho rotina corrida e finalmente achei um planner que respeita meu tempo.',
    color: '#00D791',
  },
];

const plans = [
  {
    name: 'Free',
    price: 'R$0',
    tagline: 'Comece com o essencial',
    description: 'Ideal para testar o fluxo e organizar uma rotina básica.',
    features: ['Calendário semanal', 'Até 3 matérias', 'Alertas por e-mail'],
    cta: 'Começar grátis',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'R$29/mês',
    tagline: 'Plano favorito dos estudantes',
    description: 'Alertas completos, planner ilimitado e insights avançados.',
    features: ['Matérias ilimitadas', 'Alertas WhatsApp + push', 'Templates ENEM + Vestibulares', 'Insights semanais'],
    cta: 'Assinar Pro',
    highlight: true,
    badge: 'Economize 20% no anual',
  },
  {
    name: 'Squad',
    price: 'Sob consulta',
    tagline: 'Para escolas e cursinhos',
    description: 'Dashboards para mentores, relatórios e onboarding dedicado.',
    features: ['Painel de turmas', 'Integração LMS', 'Suporte prioritário', 'Treinamento da equipe'],
    cta: 'Falar com vendas',
    highlight: false,
  },
];

const faqs = [
  {
    question: 'Posso usar o Hub Study no celular?',
    answer: 'Sim. O site é responsivo e você também recebe lembretes por WhatsApp, então nunca perde uma notificação.',
  },
  {
    question: 'Quanto tempo leva para montar meu plano?',
    answer: 'Em menos de 3 minutos você cadastra matérias e datas. Depois é só ajustar as sugestões do Hub.',
  },
  {
    question: 'E se eu mudar de rotina?',
    answer: 'Atualize sua disponibilidade e o algoritmo redistribui tudo automaticamente, mantendo alertas e revisões.',
  },
  {
    question: 'Tem desconto anual?',
    answer: 'Sim! O plano anual Pro tem 20% OFF e ainda libera templates exclusivos e suporte priorizado.',
  },
  {
    question: 'Instituições podem usar?',
    answer: 'O plano Squad foi feito para escolas, cursinhos e mentorias com relatórios completos e onboarding guiado.',
  },
  {
    question: 'Existe teste grátis?',
    answer: 'Você pode usar o plano Free sem cartão ou testar o Pro por 14 dias e cancelar quando quiser.',
  },
];

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mb-10 max-w-3xl text-center md:text-left">
    {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>}
    <h2 className="mt-3 text-3xl font-heading font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-base text-fog/80">{description}</p>}
  </div>
);

const IconBadge = ({ color = 'from-primary to-secondary', children }) => (
  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-card`}>
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="space-y-20 py-12 md:space-y-32 md:py-20">
      <section className="container-shell" aria-labelledby="hero">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-midnight via-ink to-ink p-8 shadow-card md:p-14">
          <div className="pattern-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.4em] text-secondary">
                Rebranding 2025
              </p>
              <h1 id="hero" className="mt-6 text-4xl font-heading font-semibold leading-tight text-white md:text-5xl">
                Organize seus estudos com alertas inteligentes e foco total.
              </h1>
              <p className="mt-4 text-lg text-fog/80">
                Hub Study cria um plano vivo para cada matéria, envia lembretes antes das provas e mostra onde você precisa ajustar o ritmo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/signup"
                  className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-none"
                >
                  Começar grátis
                </a>
                <a
                  href="#demo"
                  className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                >
                  Assistir tour de 60s
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-fog/70">
                <div className="flex -space-x-3">
                  {['M', 'J', 'L', 'P'].map((letter) => (
                    <span
                      key={letter}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-white/10 text-sm font-semibold text-white"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <p>
                  +45 mil estudantes organizados • Nota 4.9/5
                </p>
              </div>
            </div>
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-fog/50">Hoje</p>
                  <p className="mt-1 text-lg font-semibold">Quarta, 07 nov</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-secondary">Streak 12 dias</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { title: 'Simulado ENEM', time: '08h - 11h', status: 'Em andamento', color: 'text-secondary' },
                  { title: 'Revisar Redação', time: '14h - 15h', status: 'Agendado', color: 'text-primary' },
                  { title: 'Lista Matemática', time: '19h - 21h', status: 'Foco profundo', color: 'text-accent' },
                ].map((task) => (
                  <div key={task.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{task.title}</p>
                      <span className={`text-xs font-semibold ${task.color}`}>{task.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-fog/70">{task.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-fog/70">Tempo estudado (semana)</p>
                <p className="mt-2 text-3xl font-heading font-semibold">12h <span className="text-xs text-fog/60">/ 15h meta</span></p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                </div>
                <p className="mt-2 text-xs text-accent">+18% vs semana passada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell flex flex-wrap items-center justify-between gap-6 text-sm text-fog/60">
        <p className="font-semibold uppercase tracking-[0.4em] text-fog/40">Confiam no Hub</p>
        <div className="flex flex-wrap items-center gap-6 text-base font-semibold text-fog/40">
          {logos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </section>

      <section id="features" className="container-shell">
        <SectionHeading
          eyebrow="Organização real"
          title="Menos ansiedade, mais clareza."
          description="Transforme a avalanche de matérias em um plano visual simples. Tudo com alertas inteligentes e foco no que importa agora."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {painPoints.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <IconBadge>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4L10 12L6 20L18 12L6 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </IconBadge>
              <h3 className="mt-6 text-xl font-heading font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-fog/70">{item.copy}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-fog/50">{item.meta}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Como funciona"
          title="Planejar nunca foi tão fluido."
          description="Siga um fluxo simples que conecta objetivos, rotinas e alertas em segundos."
        />
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4">
          {journeySteps.map((step, index) => (
            <article
              key={step.title}
              className="min-w-[240px] flex-1 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6"
            >
              <div className="flex items-center justify-between text-sm text-fog/60">
                <span>Passo {index + 1}</span>
                <span className="text-xs font-semibold text-secondary">{step.detail}</span>
              </div>
              <h3 className="mt-4 text-lg font-heading font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-fog/70">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Detalhes"
          title="Tudo o que um planner jovem precisa."
          description="Funcionalidades pensadas para estudar em qualquer lugar, com foco e clareza."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-4xl border border-white/10 bg-white/5 p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-heading font-semibold text-white">{feature.title}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-accent">{feature.metric}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-fog/75">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-4xl border border-white/10 bg-gradient-to-br from-primary/20 via-secondary/10 to-ink p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.4em] text-secondary">Insights em tempo real</p>
          <h3 className="mt-4 text-3xl font-heading font-semibold">Seu progresso, em tempo real.</h3>
          <p className="mt-3 text-sm text-fog/70">Veja horas estudadas, streaks e matérias que merecem atenção.</p>
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm text-fog/70">
                <span>Horas estudadas</span>
                <span>Meta 15h</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
              <p className="mt-2 text-xs text-accent">+3h versus semana anterior</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Matemática', value: '92%', tone: 'text-primary' },
                { label: 'Biologia', value: '74%', tone: 'text-secondary' },
                { label: 'História', value: '63%', tone: 'text-accent' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-fog/60">{item.label}</p>
                  <p className={`mt-2 text-2xl font-heading font-semibold ${item.tone}`}>{item.value}</p>
                  <p className="text-[11px] text-fog/50">do plano semanal</p>
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-secondary">Gamificação</p>
          <h3 className="mt-4 text-2xl font-heading font-semibold">Streaks e checklists motivadores</h3>
          <ul className="mt-6 space-y-4 text-sm text-fog/80">
            {['Checklist diário pré-montado', 'Anotações rápidas em cada tarefa', 'Recompensas simbólicas a cada meta cumprida'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs text-fog/60">Checklist de hoje</p>
            {['Revisar Redação - Tema atual', '30 cards de História', 'Resumo de Química'].map((item) => (
              <div key={item} className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-[10px]">●</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="container-shell space-y-8">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem usa, recomenda."
          description="Estudantes reais que trocaram o caos por clareza."
        />
        <div className="flex gap-6 overflow-x-auto pb-4">
          {testimonials.map((item) => (
            <article key={item.name} className="min-w-[280px] flex-1 rounded-4xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: `${item.color}33`, color: item.color }}>
                  {item.name
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                </span>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-fog/60">{item.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-fog/80">&ldquo;{item.quote}&rdquo;</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cta" className="container-shell rounded-4xl border border-white/10 bg-gradient-to-r from-primary via-secondary to-primary px-6 py-10 text-center text-white md:px-12">
        <p className="text-xs uppercase tracking-[0.4em]">14 dias grátis</p>
        <h3 className="mt-4 text-3xl font-heading font-semibold">Experimente o Hub Study completo sem limite.</h3>
        <p className="mt-3 text-base text-white/80">
          Cancelamento simples, alertas ativados instantaneamente e templates exclusivos ENEM, Fuvest e concursos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="/signup" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-ink">
            Começar agora
          </a>
          <a href="/login" className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white">
            Já tenho conta
          </a>
        </div>
      </section>

      <section id="plans" className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha o ritmo perfeito."
          description="Planos flexíveis para estudar sozinho, com mentores ou em turma."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-4xl border border-white/10 p-8 ${plan.highlight ? 'bg-white text-ink shadow-glow' : 'bg-white/5 text-white'}`}
            >
              {plan.badge && (
                <span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">{plan.badge}</span>
              )}
              <p className="mt-4 text-sm uppercase tracking-[0.4em] text-fog/60">{plan.name}</p>
              <h3 className={`mt-2 text-3xl font-heading font-semibold ${plan.highlight ? 'text-ink' : 'text-white'}`}>{plan.price}</h3>
              <p className={`mt-2 text-sm ${plan.highlight ? 'text-ink/70' : 'text-fog/70'}`}>{plan.tagline}</p>
              <p className={`mt-4 text-sm ${plan.highlight ? 'text-ink/80' : 'text-fog/70'}`}>{plan.description}</p>
              <ul className={`mt-6 space-y-2 text-sm ${plan.highlight ? 'text-ink/80' : 'text-fog/80'}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold ${
                  plan.highlight ? 'bg-ink text-white' : 'border border-white/30 text-white'
                }`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="container-shell space-y-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Dúvidas frequentes."
          description="Caso não encontre sua pergunta, fale com nossa equipe pelo WhatsApp."
        />
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/5 p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">
                <span>{faq.question}</span>
                <span className="text-secondary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm text-fog/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-shell rounded-4xl border border-white/10 bg-midnight p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary">Pronto?</p>
        <h3 className="mt-4 text-3xl font-heading font-semibold text-white">Chega de estudar no modo automático.</h3>
        <p className="mt-3 text-base text-fog/70">
          Em poucos minutos você tem um plano vivo com alertas inteligentes. Bora?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href="/signup" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-glow">
            Começar grátis
          </a>
          <a href="mailto:oi@hubstudy.com" className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white">
            Falar com um especialista
          </a>
        </div>
      </section>
    </div>
  );
}
