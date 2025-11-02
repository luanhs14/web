# DayZ Wiki PT-BR 🎮

Um wiki completo e moderno sobre DayZ em Português Brasileiro, construído com HTML, CSS e JavaScript puro.

![DayZ Wiki](https://via.placeholder.com/1200x400?text=DayZ+Wiki+PT-BR)

## 📋 Sobre o Projeto

Este é um wiki comunitário dedicado a fornecer informações completas e atualizadas sobre DayZ em português brasileiro. O projeto foi desenvolvido com tecnologias web simples para facilitar contribuições e manutenção.

## ✨ Características

- 🎨 **Design Moderno**: Interface dark theme inspirada no estilo survival/militar do DayZ
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 📝 **Markdown Support**: Todo o conteúdo é escrito em Markdown para facilitar edições
- 🔍 **Sistema de Busca**: Busca em tempo real por artigos
- 🗂️ **Categorizado**: Conteúdo organizado em categorias lógicas
- ⚡ **Performance**: Site estático, carregamento rápido
- 🌐 **100% PT-BR**: Todo conteúdo em português brasileiro

## 🚀 Como Usar

### Instalação

1. Clone ou baixe este repositório
2. Não precisa instalar dependências! É apenas HTML/CSS/JS
3. Abra `index.html` em qualquer navegador moderno

### Servidor Local (Opcional)

Para melhor experiência com loading de Markdown:

```bash
# Usando Python 3
python3 -m http.server 8000

# Usando Node.js
npx http-server -p 8000

# Usando PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
dayz/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos do site
├── js/
│   └── app.js             # Lógica da aplicação
├── content/               # Conteúdo em Markdown
│   ├── armas/
│   │   ├── ak101.md
│   │   └── m4a1.md
│   ├── equipamentos/
│   ├── guias/
│   │   └── sobrevivencia.md
│   ├── itens/
│   ├── mapas/
│   │   └── chernarus.md
│   └── veiculos/
├── assets/
│   └── images/            # Imagens e mídia
└── README.md              # Este arquivo
```

## ✍️ Adicionando Conteúdo

### Criar Novo Artigo

1. Navegue até a pasta da categoria em `content/`
2. Crie um arquivo `.md` com nome em lowercase e sem espaços
   - ✅ Correto: `ak101.md`, `guia-sobrevivencia.md`
   - ❌ Incorreto: `AK-101.md`, `Guia de Sobrevivência.md`

3. Escreva o conteúdo em Markdown:

```markdown
# Título do Artigo

![Imagem](url-da-imagem)

## Seção 1

Conteúdo aqui...

## Seção 2

Mais conteúdo...

| Tabela | Exemplo |
|--------|---------|
| Item 1 | Valor 1 |
```

4. Adicione o artigo ao `js/app.js` no array `allArticles`:

```javascript
{
    category: 'armas',
    slug: 'ak101',
    title: 'AK-101',
    description: 'Rifle de assalto automático 5.56x45mm',
    tags: ['rifle', 'automático', '556']
}
```

### Markdown Suportado

- **Títulos**: `#`, `##`, `###`
- **Negrito**: `**texto**`
- **Itálico**: `*texto*`
- **Links**: `[texto](url)`
- **Imagens**: `![alt](url)`
- **Listas**: `- item` ou `1. item`
- **Tabelas**: `| col1 | col2 |`
- **Código**: `` `código` `` ou ` ```código``` `
- **Citações**: `> texto`

## 🎨 Customização

### Cores do Tema

Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --color-primary: #c41e3a;        /* Vermelho DayZ */
    --color-secondary: #2d5016;      /* Verde militar */
    --color-accent: #d4af37;         /* Dourado */
    --color-bg: #0d0d0d;             /* Fundo escuro */
}
```

### Layout

Ajuste espaçamentos e tamanhos:

```css
:root {
    --spacing-md: 1rem;
    --max-width: 1400px;
    --sidebar-width: 280px;
}
```

## 🗂️ Categorias Disponíveis

- 🔫 **Armas**: Rifles, pistolas, shotguns, snipers
- 🎒 **Equipamentos**: Mochilas, coletes, capacetes
- 🍖 **Itens**: Comida, bebidas, materiais médicos
- 🚗 **Veículos**: Carros, caminhões, helicópteros
- 📖 **Guias**: Tutoriais, dicas, estratégias
- 🗺️ **Mapas**: Chernarus, Livonia, Sakhal

## 🔍 Sistema de Busca

O sistema de busca procura em:
- Títulos dos artigos
- Nomes de categorias
- Tags associadas

Mínimo de 2 caracteres para iniciar busca.

## 📱 Responsividade

Breakpoints:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🌐 Deploy

### GitHub Pages

1. Suba o projeto para GitHub
2. Vá em Settings > Pages
3. Selecione branch `main` e pasta `/root`
4. Salve e aguarde deploy

### Netlify

1. Arraste a pasta do projeto para Netlify
2. Deploy automático!

### Servidor Próprio

1. Suba os arquivos via FTP/SSH
2. Configure servidor web (Apache/Nginx)
3. Aponte para `index.html`

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-contribuicao`
3. Faça suas alterações
4. Commit: `git commit -m 'Adiciona artigo sobre SVD'`
5. Push: `git push origin minha-contribuicao`
6. Abra um Pull Request

### Guidelines

- Mantenha conteúdo em PT-BR
- Use Markdown corretamente
- Adicione imagens quando possível
- Teste em diferentes navegadores
- Verifique ortografia

## 📜 Licença

Conteúdo disponível sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Você é livre para:
- ✅ Compartilhar
- ✅ Adaptar
- ✅ Usar comercialmente

Sob as condições:
- 📝 Dar crédito apropriado
- 🔗 Indicar mudanças
- 📜 Usar mesma licença

## 🔗 Links Úteis

- [Site Oficial DayZ](https://dayz.com)
- [DayZ no Steam](https://store.steampowered.com/app/221100/DayZ/)
- [iZurvive - Mapa Interativo](https://www.izurvive.com/)
- [DayZ Wiki Original (EN)](https://dayz.fandom.com/wiki/DayZ_Wiki)

## 📞 Suporte

Problemas ou sugestões? Abra uma [Issue](https://github.com/seu-usuario/dayz-wiki-ptbr/issues)

## 🙏 Créditos

- **DayZ**: Bohemia Interactive
- **Inspiração**: DayZ Fandom Wiki
- **Markdown Parser**: Marked.js
- **Comunidade DayZ BR**: Contribuidores de conteúdo

## 📊 Status do Projeto

- ✅ Estrutura básica completa
- ✅ Sistema de navegação
- ✅ Sistema de busca
- ✅ Artigos de exemplo
- 🚧 Expandindo conteúdo
- 📋 Aguardando contribuições

---

**Desenvolvido com ❤️ para a comunidade DayZ Brasil**

*Última atualização: 2025-11-01*
