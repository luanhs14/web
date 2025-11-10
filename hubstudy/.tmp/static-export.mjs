// scripts/static-export.ts
import path from "node:path";
import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// components/Navbar.js
import { jsx, jsxs } from "react/jsx-runtime";
var navLinks = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#how-it-works", label: "Como funciona" },
  { href: "#plans", label: "Planos" },
  { href: "#faq", label: "FAQ" },
  { href: "/login", label: "Login" }
];
function Navbar() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "container-shell flex flex-wrap items-center justify-between gap-4 py-4", children: [
    /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-3 text-lg font-heading font-semibold tracking-tight", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg text-white shadow-glow", children: "HS" }),
      /* @__PURE__ */ jsx("span", { className: "text-white", children: "Hub Study" })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex flex-1 flex-wrap items-center justify-center gap-4 text-sm text-fog/80 lg:justify-end", children: navLinks.map((link) => /* @__PURE__ */ jsx("a", { href: link.href, className: "transition hover:text-white", children: link.label }, link.href)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("a", { href: "/login", className: "rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white/10", children: "Entrar" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/signup",
          className: "rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:shadow-none",
          children: "Come\xE7ar gr\xE1tis"
        }
      )
    ] })
  ] }) });
}

// components/Footer.js
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var footerNav = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#how-it-works", label: "Como funciona" },
  { href: "#plans", label: "Planos" },
  { href: "#cta", label: "Come\xE7ar" },
  { href: "/signup", label: "Cadastro" }
];
function Footer() {
  return /* @__PURE__ */ jsxs2("footer", { className: "border-t border-white/10 bg-ink py-12", children: [
    /* @__PURE__ */ jsxs2("div", { className: "container-shell grid gap-10 md:grid-cols-[2fr_1fr_1fr]", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("div", { className: "mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx2("span", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg text-white", children: "HS" }),
          /* @__PURE__ */ jsx2("p", { className: "text-lg font-heading font-semibold", children: "Hub Study" })
        ] }),
        /* @__PURE__ */ jsx2("p", { className: "text-sm text-fog/70", children: "A plataforma inteligente que organiza mat\xE9rias, provas e tarefas para voc\xEA estudar com confian\xE7a." })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("p", { className: "mb-4 text-sm font-semibold uppercase tracking-widest text-fog/70", children: "Mapa do site" }),
        /* @__PURE__ */ jsx2("div", { className: "flex flex-col gap-2 text-sm text-fog/70", children: footerNav.map((item) => /* @__PURE__ */ jsx2("a", { href: item.href, className: "transition hover:text-white", children: item.label }, item.href)) })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("p", { className: "mb-4 text-sm font-semibold uppercase tracking-widest text-fog/70", children: "Newsletter" }),
        /* @__PURE__ */ jsx2("p", { className: "text-sm text-fog/70", children: "Receba novidades e templates de estudo mensais." }),
        /* @__PURE__ */ jsxs2("form", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsx2(
            "input",
            {
              type: "email",
              placeholder: "seuemail@email.com",
              className: "w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder-fog/40 focus:border-primary focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "submit",
              className: "rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110",
              children: "Enviar"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "container-shell mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-fog/50 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs2("p", { children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Hub Study. Todos os direitos reservados."
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx2("a", { href: "#", className: "hover:text-white", children: "Termos" }),
        /* @__PURE__ */ jsx2("a", { href: "#", className: "hover:text-white", children: "Privacidade" }),
        /* @__PURE__ */ jsx2("a", { href: "mailto:oi@hubstudy.com", className: "hover:text-white", children: "Suporte" })
      ] })
    ] })
  ] });
}

// components/Layout.js
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function Layout({ children }) {
  return /* @__PURE__ */ jsxs3("div", { className: "flex min-h-screen flex-col bg-ink text-fog", children: [
    /* @__PURE__ */ jsx3(Navbar, {}),
    /* @__PURE__ */ jsx3("main", { className: "flex-grow", children }),
    /* @__PURE__ */ jsx3(Footer, {})
  ] });
}

// app/page.js
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var logos = ["UFSP", "Anglo+", "PoliVest", "Prefixo", "EduLive"];
var painPoints = [
  {
    title: "Sem caos",
    copy: "Visualize mat\xE9rias, provas e tarefas numa linha do tempo inteligente.",
    meta: "Agenda conectada"
  },
  {
    title: "Revis\xF5es guiadas",
    copy: "O Hub sugere ciclos de revis\xE3o baseados nos seus objetivos.",
    meta: "Lembretes ativos"
  },
  {
    title: "Datas seguras",
    copy: "Alertas multicanal garantem que voc\xEA n\xE3o esque\xE7a nenhum prazo.",
    meta: "Alertas + Insights"
  }
];
var journeySteps = [
  {
    title: "Monte sua conta",
    copy: "Escolha mat\xE9rias, carga hor\xE1ria desejada e metas.",
    detail: "2 min"
  },
  {
    title: "Planejamento autom\xE1gico",
    copy: "O algoritmo distribui suas atividades e revis\xF5es.",
    detail: "IA Hub Flow"
  },
  {
    title: "Receba alertas",
    copy: "Notifica\xE7\xF5es por e-mail, WhatsApp e push.",
    detail: "Alertas +2 canais"
  },
  {
    title: "Me\xE7a o progresso",
    copy: "Dashboard mostra tempo estudado e streaks semanais.",
    detail: "Insights live"
  }
];
var features = [
  {
    title: "Calend\xE1rio inteligente",
    bullets: ["Arraste tarefas com snap autom\xE1tico", "Filtros por mat\xE9ria e prova", "Visual semanal e mensal"],
    metric: "+32% organiza\xE7\xE3o"
  },
  {
    title: "Alertas multicanal",
    bullets: ["WhatsApp, e-mail e push", "Recomenda\xE7\xF5es de hor\xE1rio", "Confirma\xE7\xE3o com 1 toque"],
    metric: "0 prazos perdidos"
  },
  {
    title: "Planos personalizados",
    bullets: ["Templates ENEM, vestibulares e concursos", "Sugest\xF5es autom\xE1ticas de revis\xE3o", "Checklist di\xE1rio"],
    metric: "Planejamento em 3 min"
  },
  {
    title: "Insights semanais",
    bullets: ["Gr\xE1ficos por mat\xE9ria", "Tempo investido vs. meta", "Sugest\xF5es para focar"],
    metric: "+18% produtividade"
  }
];
var testimonials = [
  {
    name: "Maria Eduarda",
    role: "3\xBA ano | Medicina",
    quote: "Com o Hub Study parei de descobrir prova em cima da hora. O app avisa tudo e eu s\xF3 executo.",
    color: "#FF5ED6"
  },
  {
    name: "Jo\xE3o Victor",
    role: "Pr\xE9-vestibular",
    quote: "As revis\xF5es guiadas me salvaram. Consigo ver o que est\xE1 atrasado e manter o ritmo.",
    color: "#3D5AFE"
  },
  {
    name: "Larissa Gomes",
    role: "Estagi\xE1ria + faculdade",
    quote: "Tenho rotina corrida e finalmente achei um planner que respeita meu tempo.",
    color: "#00D791"
  }
];
var plans = [
  {
    name: "Free",
    price: "R$0",
    tagline: "Comece com o essencial",
    description: "Ideal para testar o fluxo e organizar uma rotina b\xE1sica.",
    features: ["Calend\xE1rio semanal", "At\xE9 3 mat\xE9rias", "Alertas por e-mail"],
    cta: "Come\xE7ar gr\xE1tis",
    highlight: false
  },
  {
    name: "Pro",
    price: "R$29/m\xEAs",
    tagline: "Plano favorito dos estudantes",
    description: "Alertas completos, planner ilimitado e insights avan\xE7ados.",
    features: ["Mat\xE9rias ilimitadas", "Alertas WhatsApp + push", "Templates ENEM + Vestibulares", "Insights semanais"],
    cta: "Assinar Pro",
    highlight: true,
    badge: "Economize 20% no anual"
  },
  {
    name: "Squad",
    price: "Sob consulta",
    tagline: "Para escolas e cursinhos",
    description: "Dashboards para mentores, relat\xF3rios e onboarding dedicado.",
    features: ["Painel de turmas", "Integra\xE7\xE3o LMS", "Suporte priorit\xE1rio", "Treinamento da equipe"],
    cta: "Falar com vendas",
    highlight: false
  }
];
var faqs = [
  {
    question: "Posso usar o Hub Study no celular?",
    answer: "Sim. O site \xE9 responsivo e voc\xEA tamb\xE9m recebe lembretes por WhatsApp, ent\xE3o nunca perde uma notifica\xE7\xE3o."
  },
  {
    question: "Quanto tempo leva para montar meu plano?",
    answer: "Em menos de 3 minutos voc\xEA cadastra mat\xE9rias e datas. Depois \xE9 s\xF3 ajustar as sugest\xF5es do Hub."
  },
  {
    question: "E se eu mudar de rotina?",
    answer: "Atualize sua disponibilidade e o algoritmo redistribui tudo automaticamente, mantendo alertas e revis\xF5es."
  },
  {
    question: "Tem desconto anual?",
    answer: "Sim! O plano anual Pro tem 20% OFF e ainda libera templates exclusivos e suporte priorizado."
  },
  {
    question: "Institui\xE7\xF5es podem usar?",
    answer: "O plano Squad foi feito para escolas, cursinhos e mentorias com relat\xF3rios completos e onboarding guiado."
  },
  {
    question: "Existe teste gr\xE1tis?",
    answer: "Voc\xEA pode usar o plano Free sem cart\xE3o ou testar o Pro por 14 dias e cancelar quando quiser."
  }
];
var SectionHeading = ({ eyebrow, title, description }) => /* @__PURE__ */ jsxs4("div", { className: "mb-10 max-w-3xl text-center md:text-left", children: [
  eyebrow && /* @__PURE__ */ jsx4("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-secondary", children: eyebrow }),
  /* @__PURE__ */ jsx4("h2", { className: "mt-3 text-3xl font-heading font-semibold tracking-tight text-white md:text-4xl", children: title }),
  description && /* @__PURE__ */ jsx4("p", { className: "mt-4 text-base text-fog/80", children: description })
] });
var IconBadge = ({ color = "from-primary to-secondary", children }) => /* @__PURE__ */ jsx4("div", { className: `flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-card`, children });
function Home() {
  return /* @__PURE__ */ jsxs4("div", { className: "space-y-20 py-12 md:space-y-32 md:py-20", children: [
    /* @__PURE__ */ jsx4("section", { className: "container-shell", "aria-labelledby": "hero", children: /* @__PURE__ */ jsxs4("div", { className: "relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-midnight via-ink to-ink p-8 shadow-card md:p-14", children: [
      /* @__PURE__ */ jsx4("div", { className: "pattern-grid absolute inset-0 opacity-30", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs4("div", { className: "relative grid gap-12 md:grid-cols-[1.1fr_0.9fr]", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx4("p", { className: "inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.4em] text-secondary", children: "Rebranding 2025" }),
          /* @__PURE__ */ jsx4("h1", { id: "hero", className: "mt-6 text-4xl font-heading font-semibold leading-tight text-white md:text-5xl", children: "Organize seus estudos com alertas inteligentes e foco total." }),
          /* @__PURE__ */ jsx4("p", { className: "mt-4 text-lg text-fog/80", children: "Hub Study cria um plano vivo para cada mat\xE9ria, envia lembretes antes das provas e mostra onde voc\xEA precisa ajustar o ritmo." }),
          /* @__PURE__ */ jsxs4("div", { className: "mt-8 flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsx4(
              "a",
              {
                href: "/signup",
                className: "rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-none",
                children: "Come\xE7ar gr\xE1tis"
              }
            ),
            /* @__PURE__ */ jsx4(
              "a",
              {
                href: "#demo",
                className: "rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/60",
                children: "Assistir tour de 60s"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs4("div", { className: "mt-8 flex flex-wrap items-center gap-6 text-sm text-fog/70", children: [
            /* @__PURE__ */ jsx4("div", { className: "flex -space-x-3", children: ["M", "J", "L", "P"].map((letter) => /* @__PURE__ */ jsx4(
              "span",
              {
                className: "flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-white/10 text-sm font-semibold text-white",
                children: letter
              },
              letter
            )) }),
            /* @__PURE__ */ jsx4("p", { children: "+45 mil estudantes organizados \u2022 Nota 4.9/5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card", children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs4("div", { children: [
              /* @__PURE__ */ jsx4("p", { className: "text-xs uppercase tracking-[0.3em] text-fog/50", children: "Hoje" }),
              /* @__PURE__ */ jsx4("p", { className: "mt-1 text-lg font-semibold", children: "Quarta, 07 nov" })
            ] }),
            /* @__PURE__ */ jsx4("span", { className: "rounded-full bg-white/10 px-3 py-1 text-xs text-secondary", children: "Streak 12 dias" })
          ] }),
          /* @__PURE__ */ jsx4("div", { className: "mt-6 space-y-4", children: [
            { title: "Simulado ENEM", time: "08h - 11h", status: "Em andamento", color: "text-secondary" },
            { title: "Revisar Reda\xE7\xE3o", time: "14h - 15h", status: "Agendado", color: "text-primary" },
            { title: "Lista Matem\xE1tica", time: "19h - 21h", status: "Foco profundo", color: "text-accent" }
          ].map((task) => /* @__PURE__ */ jsxs4("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx4("p", { className: "text-sm font-semibold", children: task.title }),
              /* @__PURE__ */ jsx4("span", { className: `text-xs font-semibold ${task.color}`, children: task.status })
            ] }),
            /* @__PURE__ */ jsx4("p", { className: "mt-1 text-sm text-fog/70", children: task.time })
          ] }, task.title)) }),
          /* @__PURE__ */ jsxs4("div", { className: "mt-6 rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx4("p", { className: "text-sm text-fog/70", children: "Tempo estudado (semana)" }),
            /* @__PURE__ */ jsxs4("p", { className: "mt-2 text-3xl font-heading font-semibold", children: [
              "12h ",
              /* @__PURE__ */ jsx4("span", { className: "text-xs text-fog/60", children: "/ 15h meta" })
            ] }),
            /* @__PURE__ */ jsx4("div", { className: "mt-3 h-2 rounded-full bg-white/10", children: /* @__PURE__ */ jsx4("div", { className: "h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-secondary" }) }),
            /* @__PURE__ */ jsx4("p", { className: "mt-2 text-xs text-accent", children: "+18% vs semana passada" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs4("section", { className: "container-shell flex flex-wrap items-center justify-between gap-6 text-sm text-fog/60", children: [
      /* @__PURE__ */ jsx4("p", { className: "font-semibold uppercase tracking-[0.4em] text-fog/40", children: "Confiam no Hub" }),
      /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap items-center gap-6 text-base font-semibold text-fog/40", children: logos.map((logo) => /* @__PURE__ */ jsx4("span", { children: logo }, logo)) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { id: "features", className: "container-shell", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "Organiza\xE7\xE3o real",
          title: "Menos ansiedade, mais clareza.",
          description: "Transforme a avalanche de mat\xE9rias em um plano visual simples. Tudo com alertas inteligentes e foco no que importa agora."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "grid gap-6 md:grid-cols-3", children: painPoints.map((item) => /* @__PURE__ */ jsxs4("article", { className: "rounded-3xl border border-white/10 bg-white/5 p-6", children: [
        /* @__PURE__ */ jsx4(IconBadge, { children: /* @__PURE__ */ jsx4("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx4("path", { d: "M6 4L10 12L6 20L18 12L6 4Z", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
        /* @__PURE__ */ jsx4("h3", { className: "mt-6 text-xl font-heading font-semibold", children: item.title }),
        /* @__PURE__ */ jsx4("p", { className: "mt-3 text-sm text-fog/70", children: item.copy }),
        /* @__PURE__ */ jsx4("p", { className: "mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-fog/50", children: item.meta })
      ] }, item.title)) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { id: "how-it-works", className: "container-shell space-y-10", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "Como funciona",
          title: "Planejar nunca foi t\xE3o fluido.",
          description: "Siga um fluxo simples que conecta objetivos, rotinas e alertas em segundos."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4", children: journeySteps.map((step, index) => /* @__PURE__ */ jsxs4(
        "article",
        {
          className: "min-w-[240px] flex-1 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6",
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between text-sm text-fog/60", children: [
              /* @__PURE__ */ jsxs4("span", { children: [
                "Passo ",
                index + 1
              ] }),
              /* @__PURE__ */ jsx4("span", { className: "text-xs font-semibold text-secondary", children: step.detail })
            ] }),
            /* @__PURE__ */ jsx4("h3", { className: "mt-4 text-lg font-heading font-semibold text-white", children: step.title }),
            /* @__PURE__ */ jsx4("p", { className: "mt-2 text-sm text-fog/70", children: step.copy })
          ]
        },
        step.title
      )) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "container-shell space-y-10", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "Detalhes",
          title: "Tudo o que um planner jovem precisa.",
          description: "Funcionalidades pensadas para estudar em qualquer lugar, com foco e clareza."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "grid gap-6 md:grid-cols-2", children: features.map((feature) => /* @__PURE__ */ jsxs4("article", { className: "rounded-4xl border border-white/10 bg-white/5 p-7", children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsx4("h3", { className: "text-xl font-heading font-semibold text-white", children: feature.title }),
          /* @__PURE__ */ jsx4("span", { className: "rounded-full bg-white/10 px-3 py-1 text-xs text-accent", children: feature.metric })
        ] }),
        /* @__PURE__ */ jsx4("ul", { className: "mt-4 space-y-2 text-sm text-fog/75", children: feature.bullets.map((bullet) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx4("span", { className: "mt-1 h-1.5 w-1.5 rounded-full bg-secondary" }),
          /* @__PURE__ */ jsx4("span", { children: bullet })
        ] }, bullet)) })
      ] }, feature.title)) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "container-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]", children: [
      /* @__PURE__ */ jsxs4("article", { className: "rounded-4xl border border-white/10 bg-gradient-to-br from-primary/20 via-secondary/10 to-ink p-8 shadow-card", children: [
        /* @__PURE__ */ jsx4("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Insights em tempo real" }),
        /* @__PURE__ */ jsx4("h3", { className: "mt-4 text-3xl font-heading font-semibold", children: "Seu progresso, em tempo real." }),
        /* @__PURE__ */ jsx4("p", { className: "mt-3 text-sm text-fog/70", children: "Veja horas estudadas, streaks e mat\xE9rias que merecem aten\xE7\xE3o." }),
        /* @__PURE__ */ jsxs4("div", { className: "mt-8 space-y-6", children: [
          /* @__PURE__ */ jsxs4("div", { children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between text-sm text-fog/70", children: [
              /* @__PURE__ */ jsx4("span", { children: "Horas estudadas" }),
              /* @__PURE__ */ jsx4("span", { children: "Meta 15h" })
            ] }),
            /* @__PURE__ */ jsx4("div", { className: "mt-3 h-3 rounded-full bg-white/10", children: /* @__PURE__ */ jsx4("div", { className: "h-full w-[78%] rounded-full bg-gradient-to-r from-primary to-secondary" }) }),
            /* @__PURE__ */ jsx4("p", { className: "mt-2 text-xs text-accent", children: "+3h versus semana anterior" })
          ] }),
          /* @__PURE__ */ jsx4("div", { className: "grid gap-4 md:grid-cols-3", children: [
            { label: "Matem\xE1tica", value: "92%", tone: "text-primary" },
            { label: "Biologia", value: "74%", tone: "text-secondary" },
            { label: "Hist\xF3ria", value: "63%", tone: "text-accent" }
          ].map((item) => /* @__PURE__ */ jsxs4("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx4("p", { className: "text-xs text-fog/60", children: item.label }),
            /* @__PURE__ */ jsx4("p", { className: `mt-2 text-2xl font-heading font-semibold ${item.tone}`, children: item.value }),
            /* @__PURE__ */ jsx4("p", { className: "text-[11px] text-fog/50", children: "do plano semanal" })
          ] }, item.label)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("article", { className: "rounded-4xl border border-white/10 bg-white/5 p-8", children: [
        /* @__PURE__ */ jsx4("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Gamifica\xE7\xE3o" }),
        /* @__PURE__ */ jsx4("h3", { className: "mt-4 text-2xl font-heading font-semibold", children: "Streaks e checklists motivadores" }),
        /* @__PURE__ */ jsx4("ul", { className: "mt-6 space-y-4 text-sm text-fog/80", children: ["Checklist di\xE1rio pr\xE9-montado", "Anota\xE7\xF5es r\xE1pidas em cada tarefa", "Recompensas simb\xF3licas a cada meta cumprida"].map((item) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx4("span", { className: "mt-1 h-2 w-2 rounded-full bg-accent" }),
          /* @__PURE__ */ jsx4("span", { children: item })
        ] }, item)) }),
        /* @__PURE__ */ jsxs4("div", { className: "mt-8 rounded-3xl border border-white/10 bg-white/5 p-6", children: [
          /* @__PURE__ */ jsx4("p", { className: "text-xs text-fog/60", children: "Checklist de hoje" }),
          ["Revisar Reda\xE7\xE3o - Tema atual", "30 cards de Hist\xF3ria", "Resumo de Qu\xEDmica"].map((item) => /* @__PURE__ */ jsxs4("div", { className: "mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm", children: [
            /* @__PURE__ */ jsx4("span", { className: "flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-[10px]", children: "\u25CF" }),
            /* @__PURE__ */ jsx4("span", { children: item })
          ] }, item))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "container-shell space-y-8", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "Depoimentos",
          title: "Quem usa, recomenda.",
          description: "Estudantes reais que trocaram o caos por clareza."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "flex gap-6 overflow-x-auto pb-4", children: testimonials.map((item) => /* @__PURE__ */ jsxs4("article", { className: "min-w-[280px] flex-1 rounded-4xl border border-white/10 bg-white/5 p-6", children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx4("span", { className: "flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold", style: { backgroundColor: `${item.color}33`, color: item.color }, children: item.name.split(" ").slice(0, 2).map((word) => word[0]).join("") }),
          /* @__PURE__ */ jsxs4("div", { children: [
            /* @__PURE__ */ jsx4("p", { className: "font-semibold", children: item.name }),
            /* @__PURE__ */ jsx4("p", { className: "text-xs text-fog/60", children: item.role })
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("p", { className: "mt-4 text-sm text-fog/80", children: [
          "\u201C",
          item.quote,
          "\u201D"
        ] })
      ] }, item.name)) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { id: "cta", className: "container-shell rounded-4xl border border-white/10 bg-gradient-to-r from-primary via-secondary to-primary px-6 py-10 text-center text-white md:px-12", children: [
      /* @__PURE__ */ jsx4("p", { className: "text-xs uppercase tracking-[0.4em]", children: "14 dias gr\xE1tis" }),
      /* @__PURE__ */ jsx4("h3", { className: "mt-4 text-3xl font-heading font-semibold", children: "Experimente o Hub Study completo sem limite." }),
      /* @__PURE__ */ jsx4("p", { className: "mt-3 text-base text-white/80", children: "Cancelamento simples, alertas ativados instantaneamente e templates exclusivos ENEM, Fuvest e concursos." }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-8 flex flex-wrap justify-center gap-4", children: [
        /* @__PURE__ */ jsx4("a", { href: "/signup", className: "rounded-full bg-white px-8 py-3 text-sm font-semibold text-ink", children: "Come\xE7ar agora" }),
        /* @__PURE__ */ jsx4("a", { href: "/login", className: "rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white", children: "J\xE1 tenho conta" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("section", { id: "plans", className: "container-shell space-y-10", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "Planos",
          title: "Escolha o ritmo perfeito.",
          description: "Planos flex\xEDveis para estudar sozinho, com mentores ou em turma."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "grid gap-6 lg:grid-cols-3", children: plans.map((plan) => /* @__PURE__ */ jsxs4(
        "article",
        {
          className: `rounded-4xl border border-white/10 p-8 ${plan.highlight ? "bg-white text-ink shadow-glow" : "bg-white/5 text-white"}`,
          children: [
            plan.badge && /* @__PURE__ */ jsx4("span", { className: "inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary", children: plan.badge }),
            /* @__PURE__ */ jsx4("p", { className: "mt-4 text-sm uppercase tracking-[0.4em] text-fog/60", children: plan.name }),
            /* @__PURE__ */ jsx4("h3", { className: `mt-2 text-3xl font-heading font-semibold ${plan.highlight ? "text-ink" : "text-white"}`, children: plan.price }),
            /* @__PURE__ */ jsx4("p", { className: `mt-2 text-sm ${plan.highlight ? "text-ink/70" : "text-fog/70"}`, children: plan.tagline }),
            /* @__PURE__ */ jsx4("p", { className: `mt-4 text-sm ${plan.highlight ? "text-ink/80" : "text-fog/70"}`, children: plan.description }),
            /* @__PURE__ */ jsx4("ul", { className: `mt-6 space-y-2 text-sm ${plan.highlight ? "text-ink/80" : "text-fog/80"}`, children: plan.features.map((feature) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx4("span", { className: "mt-1 h-1.5 w-1.5 rounded-full bg-secondary" }),
              /* @__PURE__ */ jsx4("span", { children: feature })
            ] }, feature)) }),
            /* @__PURE__ */ jsx4(
              "a",
              {
                href: "/signup",
                className: `mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold ${plan.highlight ? "bg-ink text-white" : "border border-white/30 text-white"}`,
                children: plan.cta
              }
            )
          ]
        },
        plan.name
      )) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { id: "faq", className: "container-shell space-y-6", children: [
      /* @__PURE__ */ jsx4(
        SectionHeading,
        {
          eyebrow: "FAQ",
          title: "D\xFAvidas frequentes.",
          description: "Caso n\xE3o encontre sua pergunta, fale com nossa equipe pelo WhatsApp."
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: "space-y-4", children: faqs.map((faq) => /* @__PURE__ */ jsxs4("details", { className: "group rounded-3xl border border-white/10 bg-white/5 p-6", children: [
        /* @__PURE__ */ jsxs4("summary", { className: "flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold", children: [
          /* @__PURE__ */ jsx4("span", { children: faq.question }),
          /* @__PURE__ */ jsx4("span", { className: "text-secondary transition group-open:rotate-45", children: "+" })
        ] }),
        /* @__PURE__ */ jsx4("p", { className: "mt-4 text-sm text-fog/70", children: faq.answer })
      ] }, faq.question)) })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "container-shell rounded-4xl border border-white/10 bg-midnight p-10 text-center", children: [
      /* @__PURE__ */ jsx4("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Pronto?" }),
      /* @__PURE__ */ jsx4("h3", { className: "mt-4 text-3xl font-heading font-semibold text-white", children: "Chega de estudar no modo autom\xE1tico." }),
      /* @__PURE__ */ jsx4("p", { className: "mt-3 text-base text-fog/70", children: "Em poucos minutos voc\xEA tem um plano vivo com alertas inteligentes. Bora?" }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-6 flex flex-wrap justify-center gap-4", children: [
        /* @__PURE__ */ jsx4("a", { href: "/signup", className: "rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-glow", children: "Come\xE7ar gr\xE1tis" }),
        /* @__PURE__ */ jsx4("a", { href: "mailto:oi@hubstudy.com", className: "rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white", children: "Falar com um especialista" })
      ] })
    ] })
  ] });
}

// app/login/page.js
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function LoginPage() {
  return /* @__PURE__ */ jsx5("section", { className: "flex min-h-[70vh] items-center justify-center px-6 py-16", children: /* @__PURE__ */ jsxs5("div", { className: "w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card", children: [
    /* @__PURE__ */ jsx5("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Acesse sua conta" }),
    /* @__PURE__ */ jsx5("h1", { className: "mt-4 text-3xl font-heading font-semibold text-white", children: "Bem-vindo de volta ao Hub." }),
    /* @__PURE__ */ jsx5("p", { className: "mt-2 text-sm text-fog/70", children: "Entre para continuar sua rotina sem perder nenhum lembrete." }),
    /* @__PURE__ */ jsxs5("form", { className: "mt-8 space-y-6", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx5("label", { htmlFor: "email", className: "text-sm font-semibold text-fog/80", children: "E-mail" }),
        /* @__PURE__ */ jsx5(
          "input",
          {
            id: "email",
            type: "email",
            required: true,
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
            placeholder: "seuemail@email.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "password", className: "font-semibold text-fog/80", children: "Senha" }),
          /* @__PURE__ */ jsx5("a", { href: "#", className: "text-secondary hover:underline", children: "Esqueci a senha" })
        ] }),
        /* @__PURE__ */ jsx5(
          "input",
          {
            id: "password",
            type: "password",
            required: true,
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          }
        )
      ] }),
      /* @__PURE__ */ jsx5("button", { type: "submit", className: "w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow", children: "Entrar" })
    ] }),
    /* @__PURE__ */ jsxs5("p", { className: "mt-6 text-center text-sm text-fog/70", children: [
      "Ainda n\xE3o tem conta?",
      " ",
      /* @__PURE__ */ jsx5("a", { href: "/signup", className: "text-secondary hover:underline", children: "Cadastre-se gr\xE1tis" })
    ] })
  ] }) });
}

// app/signup/page.js
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var benefits = [
  "Planner inteligente ilimitado",
  "Alertas em m\xFAltiplos canais",
  "Templates prontos para ENEM, vestibulares e concursos",
  "Painel com horas estudadas e streaks"
];
function SignupPage() {
  return /* @__PURE__ */ jsx6("section", { className: "px-6 py-16", children: /* @__PURE__ */ jsxs6("div", { className: "container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]", children: [
    /* @__PURE__ */ jsxs6("div", { className: "rounded-4xl border border-white/10 bg-white/5 p-8", children: [
      /* @__PURE__ */ jsx6("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Bora se organizar?" }),
      /* @__PURE__ */ jsx6("h1", { className: "mt-4 text-3xl font-heading font-semibold text-white", children: "Crie sua conta em minutos." }),
      /* @__PURE__ */ jsx6("p", { className: "mt-2 text-sm text-fog/70", children: "Sem cart\xE3o. Voc\xEA pode testar tudo gratuitamente e migrar quando fizer sentido." }),
      /* @__PURE__ */ jsx6("ul", { className: "mt-6 space-y-3 text-sm text-fog/80", children: benefits.map((benefit) => /* @__PURE__ */ jsxs6("li", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx6("span", { className: "mt-1 h-2 w-2 rounded-full bg-accent" }),
        /* @__PURE__ */ jsx6("span", { children: benefit })
      ] }, benefit)) }),
      /* @__PURE__ */ jsxs6("div", { className: "mt-10 rounded-3xl border border-white/10 bg-white/5 p-6", children: [
        /* @__PURE__ */ jsx6("p", { className: "text-xs uppercase tracking-[0.3em] text-fog/60", children: "FAQ r\xE1pido" }),
        /* @__PURE__ */ jsx6("p", { className: "mt-3 text-sm text-fog/80", children: "Voc\xEA pode cancelar quando quiser e seus dados ficam salvos por 30 dias." }),
        /* @__PURE__ */ jsx6("p", { className: "mt-3 text-sm text-fog/80", children: "Seu plano pode ser atualizado para anual com 20% OFF direto no painel." })
      ] })
    ] }),
    /* @__PURE__ */ jsx6("div", { className: "rounded-4xl border border-white/10 bg-midnight/80 p-8 shadow-card", children: /* @__PURE__ */ jsxs6("form", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("label", { htmlFor: "name", className: "text-sm font-semibold text-fog/80", children: "Nome completo" }),
        /* @__PURE__ */ jsx6(
          "input",
          {
            id: "name",
            type: "text",
            required: true,
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            placeholder: "Seu nome"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("label", { htmlFor: "email", className: "text-sm font-semibold text-fog/80", children: "E-mail" }),
        /* @__PURE__ */ jsx6(
          "input",
          {
            id: "email",
            type: "email",
            required: true,
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            placeholder: "seuemail@email.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("label", { htmlFor: "goal", className: "text-sm font-semibold text-fog/80", children: "Qual seu objetivo?" }),
        /* @__PURE__ */ jsxs6(
          "select",
          {
            id: "goal",
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            defaultValue: "",
            children: [
              /* @__PURE__ */ jsx6("option", { value: "", disabled: true, className: "bg-ink", children: "Escolha uma op\xE7\xE3o" }),
              /* @__PURE__ */ jsx6("option", { className: "bg-ink", value: "enem", children: "ENEM / Vestibular" }),
              /* @__PURE__ */ jsx6("option", { className: "bg-ink", value: "university", children: "Faculdade + trabalho" }),
              /* @__PURE__ */ jsx6("option", { className: "bg-ink", value: "concurso", children: "Concursos" }),
              /* @__PURE__ */ jsx6("option", { className: "bg-ink", value: "outro", children: "Outros" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("label", { htmlFor: "password", className: "text-sm font-semibold text-fog/80", children: "Crie uma senha" }),
        /* @__PURE__ */ jsx6(
          "input",
          {
            id: "password",
            type: "password",
            required: true,
            className: "mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          }
        ),
        /* @__PURE__ */ jsx6("p", { className: "mt-2 text-xs text-fog/50", children: "M\xEDnimo de 8 caracteres com letras e n\xFAmeros." })
      ] }),
      /* @__PURE__ */ jsx6("button", { type: "submit", className: "w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow", children: "Criar conta gratuita" }),
      /* @__PURE__ */ jsxs6("p", { className: "text-center text-xs text-fog/60", children: [
        "Ao continuar voc\xEA concorda com nossos",
        " ",
        /* @__PURE__ */ jsx6("a", { href: "#", className: "text-secondary hover:underline", children: "termos" }),
        " ",
        "e",
        " ",
        /* @__PURE__ */ jsx6("a", { href: "#", className: "text-secondary hover:underline", children: "pol\xEDtica de privacidade" }),
        "."
      ] })
    ] }) })
  ] }) });
}

// app/dashboard/page.js
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var summaryCards = [
  { label: "Horas estudadas", value: "12h", meta: "meta 15h", color: "from-primary to-secondary" },
  { label: "Streak ativa", value: "12 dias", meta: "+3 vs semana passada", color: "from-secondary to-primary" },
  { label: "Mat\xE9rias conclu\xEDdas", value: "8/12", meta: "67% da semana", color: "from-primary via-secondary to-accent" }
];
var schedule = [
  { title: "Simulado ENEM", time: "08h - 11h", tag: "foco", tone: "text-secondary" },
  { title: "Revis\xE3o Reda\xE7\xE3o", time: "14h - 15h", tag: "revis\xE3o", tone: "text-primary" },
  { title: "Lista Matem\xE1tica", time: "19h - 21h", tag: "tarefas", tone: "text-accent" }
];
function DashboardPage() {
  return /* @__PURE__ */ jsxs7("section", { className: "container-shell space-y-10 py-12", children: [
    /* @__PURE__ */ jsxs7("header", { children: [
      /* @__PURE__ */ jsx7("p", { className: "text-xs uppercase tracking-[0.4em] text-secondary", children: "Overview" }),
      /* @__PURE__ */ jsx7("h1", { className: "mt-4 text-3xl font-heading font-semibold text-white", children: "Seu dashboard inteligente." }),
      /* @__PURE__ */ jsx7("p", { className: "mt-2 text-sm text-fog/70", children: "Vis\xE3o geral fict\xEDcia apenas para demonstrar a nova UI." })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "grid gap-6 md:grid-cols-3", children: summaryCards.map((card) => /* @__PURE__ */ jsxs7("div", { className: `rounded-3xl border border-white/10 bg-gradient-to-br ${card.color} p-6 text-white shadow-card`, children: [
      /* @__PURE__ */ jsx7("p", { className: "text-xs uppercase tracking-[0.3em] opacity-70", children: card.label }),
      /* @__PURE__ */ jsx7("p", { className: "mt-3 text-3xl font-heading font-semibold", children: card.value }),
      /* @__PURE__ */ jsx7("p", { className: "mt-1 text-sm opacity-80", children: card.meta })
    ] }, card.label)) }),
    /* @__PURE__ */ jsxs7("div", { className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
      /* @__PURE__ */ jsxs7("article", { className: "rounded-4xl border border-white/10 bg-white/5 p-8", children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs uppercase tracking-[0.3em] text-fog/60", children: "Agenda" }),
            /* @__PURE__ */ jsx7("h2", { className: "text-2xl font-heading font-semibold", children: "Quarta, 07 nov" })
          ] }),
          /* @__PURE__ */ jsx7("button", { className: "rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white", children: "Exportar" })
        ] }),
        /* @__PURE__ */ jsx7("div", { className: "mt-6 space-y-4", children: schedule.map((item) => /* @__PURE__ */ jsxs7("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-4", children: [
          /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-sm font-semibold", children: item.title }),
            /* @__PURE__ */ jsx7("span", { className: `text-xs font-semibold uppercase tracking-wide ${item.tone}`, children: item.tag })
          ] }),
          /* @__PURE__ */ jsx7("p", { className: "mt-1 text-sm text-fog/60", children: item.time })
        ] }, item.title)) })
      ] }),
      /* @__PURE__ */ jsxs7("article", { className: "rounded-4xl border border-white/10 bg-white/5 p-8", children: [
        /* @__PURE__ */ jsx7("p", { className: "text-xs uppercase tracking-[0.3em] text-fog/60", children: "Insights da semana" }),
        /* @__PURE__ */ jsx7("div", { className: "mt-6 space-y-5", children: [
          { title: "Matem\xE1tica", progress: 0.9 },
          { title: "Biologia", progress: 0.7 },
          { title: "Hist\xF3ria", progress: 0.55 }
        ].map((subject) => /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between text-sm text-fog/70", children: [
            /* @__PURE__ */ jsx7("p", { children: subject.title }),
            /* @__PURE__ */ jsxs7("p", { children: [
              Math.round(subject.progress * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx7("div", { className: "mt-2 h-2 rounded-full bg-white/10", children: /* @__PURE__ */ jsx7("div", { className: "h-full rounded-full bg-gradient-to-r from-primary to-secondary", style: { width: `${subject.progress * 100}%` } }) })
        ] }, subject.title)) }),
        /* @__PURE__ */ jsxs7("div", { className: "mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-fog/80", children: [
          /* @__PURE__ */ jsx7("p", { className: "font-semibold text-white", children: "Sugest\xE3o do Hub" }),
          /* @__PURE__ */ jsx7("p", { className: "mt-2", children: "Ajuste 45 min extras para Hist\xF3ria na sexta. Isso garante 85% do plano semanal." })
        ] })
      ] })
    ] })
  ] });
}

// scripts/static-export.ts
var cwd = process.cwd();
var distDir = path.join(cwd, "dist");
var defaultTitle = "Hub Study";
var defaultDescription = "Organize seus estudos, acompanhe seu progresso e conquiste seus objetivos com o Hub Study.";
var routes = [
  { segments: [], Component: Home, meta: { title: `${defaultTitle} | In\xEDcio`, description: defaultDescription } },
  { segments: ["login"], Component: LoginPage, meta: { title: `${defaultTitle} | Login`, description: "Acesse sua conta para continuar organizando seus estudos." } },
  { segments: ["signup"], Component: SignupPage, meta: { title: `${defaultTitle} | Cadastro`, description: "Crie uma conta gratuita e comece a planejar seus estudos." } },
  { segments: ["dashboard"], Component: DashboardPage, meta: { title: `${defaultTitle} | Dashboard`, description: "Visualize tarefas, mat\xE9rias e acompanhe o progresso do seu aprendizado." } }
];
var escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
var renderDocument = ({ Component, meta }) => {
  const body = renderToStaticMarkup(React.createElement(Layout, null, React.createElement(Component)));
  const title = escapeHtml(meta.title ?? defaultTitle);
  const description = meta.description ? `<meta name="description" content="${escapeHtml(meta.description)}" />` : "";
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${description}
    <link rel="stylesheet" href="/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
${body}
  </body>
</html>`;
};
async function copyPublicAssets() {
  const publicDir = path.join(cwd, "public");
  try {
    await fs.access(publicDir);
    await fs.cp(publicDir, distDir, { recursive: true });
  } catch {
  }
}
async function buildCss() {
  execSync("npx tailwindcss -i ./app/globals.css -o ./dist/styles.css --minify", {
    stdio: "inherit",
    cwd
  });
}
async function main() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });
  await buildCss();
  await copyPublicAssets();
  for (const route of routes) {
    const html = renderDocument(route);
    const targetPath = path.join(distDir, ...route.segments, "index.html");
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, html, "utf8");
  }
  console.log(`\u2714 Static site generated in ${distDir}`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
