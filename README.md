# Baselarte

Site da **Baselarte Ltda.**, uma empresa de engenharia de software e tecnologia criativa: uma página inicial e uma seção de notas de estudo (livros, aplicações web, bancos de dados, AWS, segurança, IA). No ar em [baselarte.com](https://baselarte.com). Todo o site é em português do Brasil.

```
 src/notes/*  ─┐                                  ┌─▶ dist/  HTML puro, um arquivo por página
 src/pages/*  ─┼─▶ render do React (no build) ────┤
 src/styles/* ─┘                                  └─▶ ilhas: tema, player (hidratadas)

 git push ─▶ main ─▶ GitHub Actions ─▶ pnpm build ─▶ dist/ ─▶ GitHub Pages ─▶ baselarte.com
```

Cada página vira HTML estático no build. O navegador recebe páginas prontas; o JavaScript só acrescenta as poucas partes interativas.

## Ferramentas (além de HTML, CSS e JavaScript)

| Ferramenta | Como é usada | Problema que resolve |
| --- | --- | --- |
| **React** | Componentes renderizam cada página em HTML no build; alguns (tema, player) são hidratados como ilhas no navegador. | 46 páginas repetiam à mão o mesmo head, cabeçalho, rodapé e marcação; agora cada peça é escrita uma vez. |
| **TypeScript** | Todo o código, inclusive as notas; o `pnpm build` checa os tipos antes. | Uma prop quebrada ou uma nota sem metadados falha no build, não no site no ar. |
| **Vite** | Servidor de desenvolvimento que renderiza as páginas a cada pedido, e o bundler do código do navegador e do CSS. | Retorno rápido enquanto se escreve, e assets pequenos com hash em produção. |
| **Motion** | Animações nos simuladores da nota de AWS, carregadas só nessa página. | Animações suaves e interrompíveis sem código de tempo escrito à mão. |
| **GitHub Actions** | Faz o build a cada push na `main` e publica o `dist/` no Pages. | O GitHub Pages recebe só os arquivos estáticos prontos, nunca o código-fonte. |

## Estrutura

```
src/
  notes/        uma pasta por nota (index.tsx: metadados + corpo); catalog.ts define a ordem
  components/   note/ blocos das notas (Section, Callout, Diagram, Table, CodeBlock, Sources),
                layout/ (Document, Head, cabeçalho, rodapé) e ui/ (Icon, FlowerLogo)
  pages/        início, nota, 404
  islands/      os componentes React interativos hidratados no navegador
  client/       entrada do navegador: hidrata as ilhas, botões de copiar, progresso de leitura
  preferences/  tema: configurações, o script de boot inline, o store compartilhado
  server/       renderiza cada página, o sitemap.xml e o llms.txt
  styles/       app.css: entrada do Tailwind v4 (tokens, tema, base, classes do conteúdo das notas)
  ui.ts         os textos da moldura do site (cabeçalho, rodapé, navegação)
  site.ts       os fatos do site (nome, URL, descrição, imagem de compartilhamento)
public/         copiado como está: CNAME, robots.txt, favicons, manifest, imagem de compartilhamento
                (e audio/, opcional: veja src/easter-egg/)
scripts/build.ts  build de produção
```

## Escrever uma nota

Crie `src/notes/<slug>/index.tsx` exportando `note: Note` (veja `src/notes/types.ts`) e acrescente o slug a um grupo em `src/notes/catalog.ts`. O build falha se um existir sem o outro. O sitemap, o llms.txt, as listas e os dados estruturados saem desses metadados.

Depois rode `pnpm notes:index` para atualizar o [NOTAS.md](NOTAS.md), o índice rápido de todas as notas.

O texto é escrito direto em JSX, em português. O `summary` de cada nota (o parágrafo que vai para o llms.txt) também.

## Comportamento

- **Layout:** editorial: página off-white quente, uma coluna de leitura de 600px, títulos em serifa (Instrument Serif), texto sem serifa em cinza discreto (Inter), filetes entre as seções e azul-marinho para hover e para o item atual. Início: duas linhas em serifa, uma introdução curta e as seis séries numeradas (01 a 06), cada uma uma lista de linhas (título em serifa, resumo de uma linha, chevron); cada nota tem o seu número na série (04.2). A magnólia aparece só no canto do rodapé, pequena, sobre "baselarte magnolia". O estilo é Tailwind CSS v4: as utilities ficam nos componentes; `src/styles/app.css` é a única folha de estilo. Contexto do produto em [PRODUCT.md](PRODUCT.md), sistema visual em [DESIGN.md](DESIGN.md).
- **Tema:** automático por padrão (segue o sistema do visitante), ou fixado com `auto / claro / escuro`. Todas as cores são tokens no topo de `src/styles/app.css` (mapeados para valores do tema do Tailwind); o tema escuro só os redefine.
- **Idioma:** só português do Brasil (`<html lang="pt-BR">`, `og:locale` `pt_BR`, `inLanguage` `pt-BR` no JSON-LD).
- **SEO e busca por IA:** cada nota tem URL canônica, tags Open Graph e Twitter, JSON-LD `TechArticle` + `BreadcrumbList` e link para o `llms.txt`; o `sitemap.xml` e o `llms.txt` são gerados no build.
- **Preferências** ficam no `localStorage`.
- Funciona sem JavaScript: todo o texto está no HTML.

## Convenções

- Uma fonte por configuração: tema e chaves de armazenamento em `src/preferences/settings.ts`, cores em `src/styles/app.css`, fatos do site em `src/site.ts`, textos da moldura em `src/ui.ts`.
- Nada que dependa do tempo fica fixo no código (ano, hora e período do dia são lidos no navegador).
- Nenhuma falha silenciosa: todo `catch` se recupera e registra, ou relança.
- Nomes descritivos para variáveis, classes e atributos de dados.

## Rodar

Precisa de Node 22.18 ou mais novo e de [pnpm](https://pnpm.io) (`corepack enable` escolhe a versão fixada no `package.json`).

```bash
pnpm install
pnpm dev          # http://localhost:5173, páginas renderizadas a cada pedido
pnpm build        # checa os tipos e escreve o site estático em dist/
pnpm preview      # serve o dist/ como o GitHub Pages serviria
```

## Deploy

O `.github/workflows/deploy.yml` faz o build a cada push na `main` e publica o `dist/` no GitHub Pages (Settings → Pages → Source: **GitHub Actions**). Só os arquivos do build são publicados; o `baselarte.com` aponta para ele pelo `public/CNAME`.
