# 📊 Data Directory

Diretório centralizado para todos os dados estáticos da aplicação.

## Estrutura

```
/data
├── index.ts           # Exportações centralizadas
├── types.ts           # Definições TypeScript
├── services.ts        # Serviços oferecidos
├── projects.ts        # Projetos do portfólio
├── faqs.ts           # Perguntas frequentes
└── testimonials.ts   # Depoimentos de clientes
```

## Por que separar os dados?

### ✅ Vantagens

1. **Manutenção Facilitada**
   - Atualizar preços, textos e informações sem mexer nos componentes
   - Todos os dados em arquivos dedicados

2. **Preparação para Internacionalização (i18n)**
   - Estrutura pronta para adicionar traduções
   - Fácil integração com bibliotecas como `next-intl` ou `react-i18next`

3. **Integração com CMS**
   - Estrutura compatível com headless CMS (Contentful, Strapi, Sanity)
   - Tipos TypeScript servem como schema para validação

4. **Reuso de Componentes**
   - Componentes puros, focados em apresentação
   - Mesmos dados podem ser usados em múltiplos lugares

5. **Type Safety**
   - Tipos TypeScript garantem consistência
   - Autocompletar e validação no desenvolvimento

## Como Usar

### Importar dados individuais

```typescript
import { services } from "@/data";
import { projects } from "@/data";
import { faqs } from "@/data";
import { testimonials } from "@/data";
```

### Importar tipos

```typescript
import type { Service, Project, FAQ, Testimonial } from "@/data";
```

### Exemplo de uso em componente

```typescript
import { services } from "@/data";

export default function ServicesPage() {
  return (
    <div>
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
}
```

## Próximos Passos (Roadmap)

### Internacionalização (i18n)

```
/data
├── pt-BR/
│   ├── services.ts
│   ├── projects.ts
│   └── ...
└── en-US/
    ├── services.ts
    ├── projects.ts
    └── ...
```

### Integração com CMS

Os tipos TypeScript podem ser usados como base para criar schemas em:
- **Contentful**: Content Models
- **Sanity**: Schemas
- **Strapi**: Content-Types
- **Prismic**: Custom Types

### Validação com Zod

```typescript
import { z } from "zod";

const ServiceSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  // ...
});

export const services = ServiceSchema.array().parse(rawServices);
```

## Manutenção

### Adicionar novo serviço

Edite `/data/services.ts`:

```typescript
export const services: Service[] = [
  // ... serviços existentes
  {
    icon: YourIcon,
    emoji: "🎨",
    title: "NOVO SERVIÇO",
    // ... outros campos
  },
];
```

### Adicionar novo tipo de dado

1. Defina o tipo em `/data/types.ts`
2. Crie arquivo de dados (ex: `/data/new-data.ts`)
3. Exporte em `/data/index.ts`
4. Use nos componentes

## Convenções

- **Nomes de arquivo**: kebab-case (ex: `testimonials.ts`)
- **Exports**: plural (ex: `export const services`)
- **Tipos**: PascalCase singular (ex: `type Service`)
- **Comentários**: Documentar propósito de cada array
