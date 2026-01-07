# Luquinhas - Revista Digital Educativa Infantil

Uma aplicação educativa infantil interativa sobre doenças tropicais (dengue, zika, chikungunya, malária) para crianças de 4 a 10 anos.

## 🎨 Identidade Visual

- **Cores Principais:** Azul (#2196F3) e Verde (#4CAF50)
- **Cores Secundárias:** Amarelo (#FFC107) e Rosa (#EC407A)
- **Tipografia:** Fredoka (Google Fonts)
- **Estilo:** Design infantil, lúdico, com formas arredondadas e gradientes suaves

## 🏗️ Arquitetura do Projeto

```
src/
├── react-app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Mascot.tsx      # Mascote animado Luquinhas
│   │   └── NavigationButton.tsx
│   ├── pages/              # Páginas principais
│   │   ├── Home.tsx        # Tela inicial
│   │   ├── Stories.tsx     # Leitor de histórias
│   │   ├── Curiosities.tsx # Cards educativos
│   │   ├── Activities.tsx  # Menu de atividades
│   │   ├── Sponsors.tsx    # Patrocinadores
│   │   ├── Admin.tsx       # Painel administrativo
│   │   └── games/          # Jogos interativos
│   │       ├── Colorir.tsx
│   │       ├── LigarPontos.tsx
│   │       ├── Quiz.tsx
│   │       ├── Memoria.tsx
│   │       ├── CacaPalavras.tsx
│   │       └── Puzzle.tsx
│   ├── store/              # Gerenciamento de estado (Zustand)
│   │   └── useAppStore.ts
│   ├── App.tsx             # Rotas principais
│   ├── main.tsx
│   └── index.css
├── shared/
│   ├── content.ts          # Conteúdo editável (histórias, quiz, etc)
│   └── types.ts
└── worker/
    └── index.ts            # Cloudflare Worker
```

## 📱 Funcionalidades

### Telas Principais

1. **Tela Inicial**
   - Mascote Luquinhas animado
   - Navegação para todas as seções
   - Acesso ao painel administrativo

2. **Histórias**
   - Leitor de páginas com imagens
   - Botão "Ouvir história" (Text-to-Speech)
   - Navegação entre páginas
   - Indicador de progresso

3. **Curiosidades**
   - Cards ilustrados sobre doenças tropicais
   - Informações educativas simplificadas
   - Layout em grid responsivo

4. **Atividades Lúdicas**
   - 6 jogos interativos completos
   - Sistema de pontuação e conquistas
   - Telas de vitória com opção de jogar novamente

5. **Patrocinadores**
   - Exibição de logos e links
   - Sistema configurável

6. **Painel Administrativo**
   - Login protegido por senha (admin123)
   - Interface para gerenciamento futuro
   - Instruções de personalização

### Jogos Disponíveis

1. **Colorir**
   - Canvas HTML5 interativo
   - Paleta de 10 cores
   - Seleção de tamanho do pincel
   - Borracha e opção de recomeçar
   - Download do desenho

2. **Ligar Pontos**
   - 15 pontos numerados
   - Desenho progressivo do mosquito
   - Feedback visual em tempo real

3. **Quiz**
   - 4 perguntas sobre doenças tropicais
   - Feedback imediato de acertos/erros
   - Barra de progresso
   - Tela de resultado com porcentagem

4. **Jogo da Memória**
   - 8 pares de emojis temáticos
   - Contador de jogadas
   - Animações de flip

5. **Caça-palavras**
   - Grade 10x10
   - 5 palavras para encontrar
   - Sistema de seleção por clique
   - Indicador de progresso

6. **Quebra-cabeça**
   - Grid 3x3 (8 peças + espaço vazio)
   - Imagem de mosquito
   - Contador de movimentos
   - Sistema de peças adjacentes

## 🎯 Como Personalizar

### 1. Editar Conteúdo

Todo o conteúdo está em `src/shared/content.ts`:

```typescript
// Adicionar nova história
export const stories: Story[] = [
  {
    id: 'story-2',
    title: 'Nova História',
    pages: [
      {
        image: 'URL_DA_IMAGEM',
        text: 'Texto da página...',
      }
    ]
  }
];

// Adicionar nova curiosidade
export const curiosities: Curiosity[] = [
  {
    id: 'curiosity-new',
    title: 'Título',
    description: 'Descrição...',
    image: 'URL_DA_IMAGEM',
    icon: 'bug' // ou: droplet, thermometer, trees, virus, home
  }
];

// Adicionar pergunta ao quiz
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-new',
    question: 'Pergunta?',
    options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
    correctAnswer: 0 // índice da resposta correta (0-3)
  }
];
```

### 2. Trocar Imagens

Use URLs públicas de serviços como:
- Unsplash: `https://images.unsplash.com/photo-ID?w=800`
- Pexels: URLs diretas das imagens
- Qualquer URL pública de imagem

### 3. Personalizar Cores

Edite `tailwind.config.js`:

```javascript
colors: {
  luquinhas: {
    blue: {
      light: '#4FC3F7',
      DEFAULT: '#2196F3',
      dark: '#1976D2'
    },
    // ... outras cores
  }
}
```

### 4. Modificar Jogos

Cada jogo está em arquivo separado em `src/react-app/pages/games/`:
- `Colorir.tsx` - Configurar cores e tamanhos do pincel
- `LigarPontos.tsx` - Modificar pontos e coordenadas
- `Quiz.tsx` - Usar conteúdo de `content.ts`
- `Memoria.tsx` - Alterar emojis e tamanho do grid
- `CacaPalavras.tsx` - Modificar palavras e tamanho
- `Puzzle.tsx` - Alterar imagem e dificuldade

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **React Router 7** - Navegação
- **Zustand** - Gerenciamento de estado
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Cloudflare Workers** - Backend
- **Cloudflare D1** - Banco de dados (SQLite)

## 📦 Comandos

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Gera build de produção
npm run check      # Verifica tipos TypeScript
```

## 🔐 Acesso Administrativo

- **URL:** `/admin`
- **Senha padrão:** `admin123`
- **Funcionalidades:** Interface em desenvolvimento para gerenciamento de conteúdo

## 🎮 Fluxo de Navegação

```
Tela Inicial
├── Histórias → Leitor de Páginas
├── Curiosidades → Grid de Cards
├── Atividades
│   ├── Colorir
│   ├── Ligar Pontos
│   ├── Quiz
│   ├── Jogo da Memória
│   ├── Caça-palavras
│   └── Quebra-cabeça
├── Patrocinadores
└── Admin (protegido)
```

## 🎨 Características de Design

- Botões grandes e arredondados (rounded-3xl)
- Animações suaves (bounce, float, wiggle)
- Gradientes coloridos
- Shadows e glows
- Feedback visual em todas as interações
- Fontes grandes e legíveis
- Alto contraste para acessibilidade
- Responsivo mobile-first

## 📱 Responsividade

- **Mobile:** Design otimizado touch-first
- **Tablet:** Grid adaptativo
- **Desktop:** Layout expandido com sidebars

## 🔄 Próximos Passos

1. Implementar sistema completo de upload de imagens
2. Editor visual de quiz no painel admin
3. Editor WYSIWYG de histórias
4. Sistema de autenticação robusto
5. Integração com banco de dados para conteúdo dinâmico
6. Analytics de uso e progresso das crianças
7. Sistema de certificados/prêmios
8. Modo offline (PWA)

## 📄 Licença

Projeto educativo - Luquinhas © 2024
