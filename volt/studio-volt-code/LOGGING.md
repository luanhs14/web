# Logging Guidelines

## 🚫 Não Use `console.log` Diretamente

O ESLint está configurado para **bloquear** o uso de `console.log` no código.

**Por quê?**
- Logs de debug poluem o console de produção
- Impacto negativo na performance
- Exposição de informações sensíveis
- Dificulta debugging real de usuários

## ✅ Use o Logger Utility

### Importação

```typescript
import logger from '@/lib/logger';
```

### Uso

#### Debug (apenas desenvolvimento)

```typescript
logger.log('User clicked button:', buttonId);
logger.info('Component mounted');
```

#### Warnings (dev + prod)

```typescript
logger.warn('API rate limit approaching');
```

#### Errors (dev + prod)

```typescript
logger.error('Failed to fetch data:', error);
```

#### Performance Timing

```typescript
logger.time('data-fetch');
// ... código
logger.timeEnd('data-fetch');
```

#### Agrupamento

```typescript
logger.group('User Action', () => {
  logger.log('Action:', action);
  logger.log('Timestamp:', Date.now());
});
```

#### Tabelas

```typescript
logger.table([
  { name: 'Item 1', value: 100 },
  { name: 'Item 2', value: 200 },
]);
```

## 🔍 Comportamento por Ambiente

| Método | Desenvolvimento | Produção |
|--------|----------------|----------|
| `logger.log()` | ✅ Exibe | ❌ Suprimido |
| `logger.info()` | ✅ Exibe | ❌ Suprimido |
| `logger.warn()` | ✅ Exibe | ✅ Exibe |
| `logger.error()` | ✅ Exibe | ✅ Exibe |
| `logger.table()` | ✅ Exibe | ❌ Suprimido |

## 📋 Scripts de Linting

```bash
# Verificar erros de lint
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Validação completa (type-check + lint + tests)
npm run validate
```

## 🚨 Erros Comuns

### ❌ Errado

```typescript
console.log('Debug info'); // ❌ ESLint error
console.debug('Test'); // ❌ ESLint error
```

### ✅ Correto

```typescript
import logger from '@/lib/logger';

logger.log('Debug info'); // ✅ Funciona em dev
logger.error('Error'); // ✅ Funciona sempre
console.warn('Warning'); // ✅ Permitido (mas prefira logger.warn)
console.error('Error'); // ✅ Permitido (mas prefira logger.error)
```

## 🎯 Casos de Uso Especiais

### Error Boundaries

```typescript
// ErrorBoundary.tsx
console.error("Error caught:", error); // ✅ Permitido
```

### Comentários ESLint

Se **realmente** precisar de `console.log` em um caso específico:

```typescript
// eslint-disable-next-line no-console
console.log('Special case');
```

⚠️ **Aviso:** Use com moderação. Será questionado em code review.

## 🔧 Configuração ESLint

Veja `.eslintrc.json`:

```json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error", "info"] }]
  }
}
```

## 📚 Mais Informações

- [ESLint: no-console](https://eslint.org/docs/latest/rules/no-console)
- [Next.js: ESLint Config](https://nextjs.org/docs/app/api-reference/config/next-config-js/eslint)
