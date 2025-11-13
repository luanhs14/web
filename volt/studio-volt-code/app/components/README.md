# 🧩 Components Documentation

Documentação dos componentes e suas props tipadas.

## Type Safety

Todos os componentes agora possuem interfaces TypeScript definidas em `./types.ts`, garantindo:

- ✅ Type safety completo
- ✅ Autocomplete no editor
- ✅ Detecção de erros em tempo de desenvolvimento
- ✅ Refatoração segura
- ✅ Documentação inline

## Componentes Principais

### HeroSection

Seção principal (hero) da página inicial.

```typescript
import HeroSection from "@/app/components/HeroSection";

// Uso padrão (usa valores default)
<HeroSection />

// Uso customizado (futuro)
<HeroSection
  title="Título Customizado"
  subtitle="Subtítulo Customizado"
  primaryCtaText="Botão Personalizado"
/>
```

**Props disponíveis:**
- `title?: string` - Título principal
- `subtitle?: string` - Subtítulo
- `description?: string` - Descrição adicional
- `primaryCtaText?: string` - Texto do CTA principal
- `primaryCtaLink?: string` - Link do CTA principal
- `secondaryCtaText?: string` - Texto do CTA secundário
- `secondaryCtaLink?: string` - Link do CTA secundário

---

### DiferenciaisSection

Seção que exibe os diferenciais da empresa.

```typescript
import DiferenciaisSection from "@/app/components/DiferenciaisSection";
import { diferenciais } from "@/data";

// Uso padrão
<DiferenciaisSection />

// Uso customizado
<DiferenciaisSection
  title="Por Que Nos Escolher?"
  subtitle="Nossas vantagens"
  diferenciais={diferenciais}
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção (default: "Por Que Escolher o Studio Volt Code?")
- `subtitle?: string` - Subtítulo (default: "Combinamos o melhor da tecnologia...")
- `diferenciais?: Diferencial[]` - Array de diferenciais customizados

---

### ServicosSection

Seção de serviços oferecidos.

```typescript
import ServicosSection from "@/app/components/ServicosSection";
import { services } from "@/data";

// Uso padrão
<ServicosSection />

// Uso customizado
<ServicosSection
  title="Nossos Serviços"
  subtitle="O que oferecemos"
  services={services}
  showCustomProjectCTA={false}
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção
- `subtitle?: string` - Subtítulo
- `services?: Service[]` - Array de serviços
- `showCustomProjectCTA?: boolean` - Mostrar CTA de projeto customizado (default: true)

---

### PortfolioSection

Seção de portfólio com projetos.

```typescript
import PortfolioSection from "@/app/components/PortfolioSection";
import { projects } from "@/data";

// Uso padrão
<PortfolioSection />

// Uso customizado
<PortfolioSection
  title="Nossos Trabalhos"
  subtitle="Projetos de sucesso"
  projects={projects}
  showCTA={true}
  ctaText="Ver Mais Projetos"
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção
- `subtitle?: string` - Subtítulo
- `projects?: Project[]` - Array de projetos
- `showCTA?: boolean` - Mostrar botão CTA (default: true)
- `ctaText?: string` - Texto do botão CTA

---

### ProcessoSection

Seção que exibe o processo de trabalho.

```typescript
import ProcessoSection from "@/app/components/ProcessoSection";
import { processSteps } from "@/data";

// Uso padrão
<ProcessoSection />

// Uso customizado
<ProcessoSection
  title="Como Trabalhamos"
  subtitle="Nosso método"
  steps={processSteps}
  bottomText="Acompanhe cada etapa"
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção
- `subtitle?: string` - Subtítulo
- `steps?: ProcessStep[]` - Array de etapas do processo
- `bottomText?: string` - Texto no rodapé da seção

---

### DepoimentosSection

Seção de depoimentos de clientes.

```typescript
import DepoimentosSection from "@/app/components/DepoimentosSection";
import { testimonials } from "@/data";

// Uso padrão
<DepoimentosSection />

// Uso customizado
<DepoimentosSection
  title="Clientes Satisfeitos"
  subtitle="O que dizem sobre nós"
  testimonials={testimonials}
  showCTA={true}
  ctaText="Solicitar Orçamento"
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção
- `subtitle?: string` - Subtítulo
- `testimonials?: Testimonial[]` - Array de depoimentos
- `showCTA?: boolean` - Mostrar botão CTA (default: true)
- `ctaText?: string` - Texto do botão CTA

---

### FAQSection

Seção de perguntas frequentes (FAQ).

```typescript
import FAQSection from "@/app/components/FAQSection";
import { faqs } from "@/data";

// Uso padrão
<FAQSection />

// Uso customizado
<FAQSection
  title="Dúvidas Comuns"
  subtitle="Respostas rápidas"
  faqs={faqs}
  showCTA={true}
  ctaText="Fale Conosco"
/>
```

**Props disponíveis:**
- `title?: string` - Título da seção
- `subtitle?: string` - Subtítulo
- `faqs?: FAQ[]` - Array de perguntas e respostas
- `showCTA?: boolean` - Mostrar botão CTA (default: true)
- `ctaText?: string` - Texto do botão CTA

---

## Subcomponentes Reutilizáveis

### ProjectImage

Componente de imagem com fallback para projetos do portfólio.

```typescript
import { ProjectImage } from "@/app/components/PortfolioSection";

<ProjectImage
  src="https://example.com/image.jpg"
  alt="Nome do projeto"
  color="from-purple-600 to-blue-600"
/>
```

**Props:**
- `src: string` - URL da imagem
- `alt: string` - Texto alternativo
- `color: string` - Classe Tailwind para gradiente de fallback

---

### AvatarWithFallback

Componente de avatar com fallback para depoimentos.

```typescript
import { AvatarWithFallback } from "@/app/components/DepoimentosSection";

<AvatarWithFallback
  src="https://example.com/avatar.jpg"
  alt="Nome do cliente"
  size={56}
/>
```

**Props:**
- `src: string` - URL do avatar
- `alt: string` - Texto alternativo
- `size?: number` - Tamanho em pixels (default: 56)

---

## Importando Tipos

Para usar os tipos em outros arquivos:

```typescript
import type {
  HeroSectionProps,
  DiferenciaisSectionProps,
  ServicosSectionProps,
  PortfolioSectionProps,
  ProcessoSectionProps,
  DepoimentosSectionProps,
  FAQSectionProps,
  CTASectionProps,
  ProjectImageProps,
  AvatarWithFallbackProps,
} from "@/app/components/types";
```

## Benefícios da Tipagem

### 1. Autocomplete
O editor sugere automaticamente as props disponíveis e seus tipos.

### 2. Validação em Tempo Real
Erros de tipo são detectados durante o desenvolvimento, não em produção.

### 3. Refatoração Segura
Ao mudar uma interface, o TypeScript aponta todos os lugares que precisam ser atualizados.

### 4. Documentação Inline
Os tipos servem como documentação viva do código.

### 5. Melhor DX (Developer Experience)
Menos bugs, mais produtividade, código mais confiável.

## Boas Práticas

### ✅ DO

```typescript
// Use props tipadas
<ServicosSection title="Nossos Serviços" />

// Importe tipos quando necessário
import type { ServicosSectionProps } from "@/app/components/types";

// Use valores default quando fizer sentido
export default function MySection({ title = "Default" }: MyProps = {}) {
  // ...
}
```

### ❌ DON'T

```typescript
// Não use 'any'
const props: any = { title: "Test" };

// Não ignore erros de tipo
// @ts-ignore
<ServicosSection invalidProp="value" />

// Não crie props sem tipagem
export default function MySection(props) {
  // ...
}
```

## Próximos Passos

- [ ] Adicionar storybook para documentação visual
- [ ] Criar testes unitários com tipos
- [ ] Adicionar validação runtime com Zod
- [ ] Documentar padrões de composição de componentes
