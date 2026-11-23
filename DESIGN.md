---
name: Baselarte
description: Editorial. Página off-white quente, uma coluna de leitura estreita, títulos numa serifa condensada, texto numa sem serifa discreta, cinzas para todo o resto e um azul-marinho para hover e para o item atual. A magnólia só como um detalhe pequeno no rodapé.
colors:
  page: "#faf9f7"
  page-faint: "#f4f2ee"
  hairline: "#ece9e4"
  ink: "#1a1a1a"
  text: "#555555"
  label: "#6f6f6f"
  faint: "#8a8a8a"
  ghost: "#aaaaaa"
  navy: "#1b2a4e"
  navy-hover: "#0f1a33"
  night: "#141413"
  night-navy: "#9fb2dc"
typography:
  display: "Instrument Serif 400 (redonda e itálica), Google Fonts"
  text: "Inter 400/500, Google Fonts; ui-monospace para código"
  home-title: "clamp(2.5rem, 6vw, 3.25rem), serifa, 1.12"
  note-title: "clamp(2.375rem, 5.6vw, 3.25rem), serifa, 1.1"
  section: "2.125rem a 2.5rem, serifa (cinza ghost no índice, ink nas notas)"
  row-title: "1.5rem serifa"
  body: "0.9375rem / 1.6"
rounded:
  sheets: "6px (código, callouts, figuras)"
  controls: "4px"
---

# Sistema de design: Baselarte

## Visão geral

**Norte: uma página editorial pessoal.** Uma coluna de leitura de 600px centrada numa página off-white quente, bastante espaço vertical, seções divididas por filetes, títulos grandes em serifa e texto pequeno em cinza sem serifa. A cor quase não aparece: os cinzas fazem o trabalho, e o **azul-marinho** marca os dois únicos estados que importam, o hover e o "você está aqui".

## Cores

- **Página** `#faf9f7`, **filetes** `#ece9e4`, folhas claras `#f4f2ee` (código, figuras).
- **Ink** `#1a1a1a`: títulos, títulos das linhas. **Text** `#555`: corpo. **Faint** `#8a8a8a`: resumos, moldura. **Ghost** `#aaa`: títulos do índice, separadores, rodapé.
- **Azul-marinho** `#1b2a4e`: todo link e controle fica azul-marinho no hover; o item atual do cabeçalho e o tema escolhido são azul-marinho. Os anéis de foco são azul-marinho. Tema escuro: página `#141413`, azul-marinho clareado para `#9fb2dc`.
- Os tons de estado (callouts) ficam discretos: verde, âmbar, vermelho, azul-marinho.

## Tipografia

Títulos em **Instrument Serif** (condensada, redonda; itálica no lema e para ênfase nos títulos). Texto em **Inter**, 15px. Código em ui-monospace.

## Layout

- **Cabeçalho:** fixo no topo, na cor da página, sem filete; só `início / notas` em minúsculas na borda direita da coluna.
- **Início:** duas linhas em serifa ("Baselarte. / Notas de estudo."), um parágrafo cinza, a citação da IBM e as contagens em tom mais claro; um filete; depois cada série: um título em serifa cinza ghost com o seu número, e as notas como linhas (título em serifa, resumo cinza de uma linha com o número da nota, um chevron), separadas por filetes. No hover, o título e o chevron ficam azul-marinho.
- **Nota:** a mesma coluna: trilha, kicker, título em serifa, lede, fatos sobre um filete; "Nesta página" à direita acima de 1360px.
- **Rodapé:** um filete; o lema em serifa itálica pequena e "© ano · domínio" à esquerda; `auto / claro / escuro` à direita; abaixo, os arquivos para máquinas e, no canto direito, a magnólia (20px, cinza ghost) com "baselarte magnolia" embaixo em letra miúda.

## Componentes

- **Alternador de texto** (`src/components/ui/toggle.ts`): palavras separadas por barras, a escolhida em azul-marinho.
- **Linhas** com chevron (`src/components/ui/Chevron.tsx`).
- **Voltar ao topo:** um quadrado de 32px com filete e um chevron para cima.
- **Botões:** cantos pequenos; o principal em azul-marinho sólido, o normal com um filete que fica azul-marinho.
- **Links no texto:** ink com sublinhado claro; os dois ficam azul-marinho no hover.

## A magnólia

Só no canto do rodapé, pequena e cinza, como um detalhe. Não vai no cabeçalho, no topo da página nem no favicon.

## Favicon

Um bloco cinza-claro de cantos arredondados (`#e6e7e8`) com um quadrado azul-marinho arredondado dentro (`public/favicon.svg`, tamanhos PNG/ICO em `public/`, prévia em `favicon.png`).

## Implementação

Tailwind CSS v4, utilities nos componentes; `src/styles/app.css` é a única folha de estilo (tokens redefinidos em `[data-theme="dark"]`, o mapeamento `@theme inline`: `text-accent`, `text-ghost`, `font-display`…, camada base, vocabulário das notas).

## Faça e não faça

- **Faça** os cinzas e os filetes carregarem a estrutura.
- **Faça** uso do azul-marinho só para hover, estado atual e foco.
- **Não** acrescente blocos, sombras ou preenchimentos de cor às listas.
- **Não** coloque a magnólia em nenhum lugar além do rodapé.
