import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "seo-geo",
  title: { en: "SEO and AI search: meta tags, JSON-LD, robots.txt, llms.txt and getting indexed", pt: "SEO e busca por IA: meta tags, JSON-LD, robots.txt, llms.txt e como ser indexado" },
  seo: {
    title: { en: "SEO and AI search: meta tags, JSON-LD, robots.txt, llms.txt and getting indexed", pt: "SEO e busca por IA: meta tags, JSON-LD, robots.txt, llms.txt e como ser indexado" },
    description: { en: "A walkthrough of a real SEO setup for a small site: head meta tags, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt for search and AI crawlers, llms.txt, noindex, IndexNow and a checklist to get a site indexed.", pt: "Um passo a passo de um setup real de SEO para um site pequeno: meta tags do head, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt para buscadores e rastreadores de IA, llms.txt, noindex, IndexNow e uma lista para o site ser indexado." },
  },
  summary: "a walkthrough of a full SEO and GEO setup for a small bilingual site: head tags (title, description, robots, canonical), Open Graph and Twitter Cards, hreflang, JSON-LD (Organization, WebSite, WebPage, Service, FAQPage), sitemap.xml, robots.txt for search, AI-answer and training crawlers, llms.txt and llms-full.txt, noindex pages, content an AI can read, redirects, security headers and cache, IndexNow, validation, and a plan to make a site indexable.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>SEO and AI search: <em>how a small site gets found and cited.</em></>, pt: <>SEO e busca por IA: <em>como um site pequeno é encontrado e citado.</em></> },
  heroLede: { en: "A walkthrough of a real setup for a small business site: the meta tags in the head, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt for search and AI crawlers, llms.txt, noindex pages and a checklist to make a site indexable.", pt: "Um passo a passo de um setup real para o site de uma pequena empresa: as meta tags do head, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt para buscadores e rastreadores de IA, llms.txt, páginas noindex e uma lista para tornar o site indexável." },
  published: "2026-10-28",
  updated: "2026-10-28",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="SEO, GEO e o exemplo usado aqui" en="SEO, GEO and the example used here" /> },
        { id: "pipeline", title: <T pt="Como uma página chega ao índice" en="How a page reaches the index" /> },
        { id: "head", title: <T pt="Tags do <head>" en="Head tags" /> },
        { id: "social", title: <T pt="Open Graph e Twitter Cards" en="Open Graph and Twitter Cards" /> },
        { id: "hreflang", title: <T pt="Dois idiomas: hreflang" en="Two languages: hreflang" /> },
        { id: "jsonld", title: <T pt="Dados estruturados: JSON-LD" en="Structured data: JSON-LD" /> },
        { id: "sitemap", title: <T pt="sitemap.xml" en="sitemap.xml" /> },
        { id: "robots", title: <T pt="robots.txt e rastreadores de IA" en="robots.txt and AI crawlers" /> },
        { id: "llms", title: <T pt="llms.txt e llms-full.txt" en="llms.txt and llms-full.txt" /> },
        { id: "noindex", title: <T pt="Páginas noindex" en="noindex pages" /> },
        { id: "html", title: <T pt="HTML e conteúdo que a IA consegue ler" en="HTML and content an AI can read" /> },
        { id: "hosting", title: <T pt="Redirecionamentos, cabeçalhos e cache" en="Redirects, headers and cache" /> },
        { id: "extras", title: <T pt="manifest, security.txt e IndexNow" en="manifest, security.txt and IndexNow" /> },
        { id: "validate", title: <T pt="Validar e o que ficou de fora" en="Validating, and what was left out" /> },
        { id: "plan", title: <T pt="Plano para tornar o site indexável" en="Plan to make a site indexable" /> },
        { id: "cheat-seo", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="SEO, GEO e o exemplo usado aqui" en="SEO, GEO and the example used here" />}>
        <p><T pt={<><strong>SEO</strong> (otimização para mecanismos de busca) é tornar o site fácil de rastrear, entender e exibir no Google, Bing e similares. <strong>GEO</strong> (otimização para mecanismos generativos) é o mesmo esforço para que ChatGPT, Claude, Perplexity e Gemini consigam ler o site e citá-lo ao responder. As duas coisas se apoiam no mesmo alicerce: HTML claro, URLs estáveis, dados estruturados e permissão explícita para os rastreadores.</>} en={<><strong>SEO</strong> (search engine optimisation) is making a site easy to crawl, understand and display in Google, Bing and the like. <strong>GEO</strong> (generative engine optimisation) is the same effort so that ChatGPT, Claude, Perplexity and Gemini can read the site and cite it when answering. Both rest on the same foundation: clear HTML, stable URLs, structured data and explicit permission for crawlers.</>} /></p>
        <p><T pt={<>O exemplo desta nota é o setup de SEO de um site fictício, a <strong>Arcada Software</strong> (landing pages e sites institucionais), em português e inglês, hospedado na Cloudflare Pages. O domínio <code>arcada.example</code> é reservado para exemplos e não existe de verdade; troque pelo seu. Cada seção mostra o arquivo, explica cada linha e diz o que ele <em>não</em> faz.</>} en={<>The example in this note is the SEO setup of a fictional site, <strong>Arcada Software</strong> (landing pages and business websites), in Portuguese and English, hosted on Cloudflare Pages. The domain <code>arcada.example</code> is reserved for examples and does not really exist; swap in yours. Each section shows the file, explains each line and says what it does <em>not</em> do.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Sem garantia de posição:</strong> nenhuma tag faz o site subir ao topo. Elas tiram obstáculos (página que o rastreador não acha, duplicada ou mal interpretada). Quem decide a posição é a relevância e a qualidade do conteúdo, e o tempo.</>} en={<><strong>No ranking guarantee:</strong> no tag pushes a site to the top. They remove obstacles (a page the crawler cannot find, duplicated or misread). Position is decided by content relevance and quality, and by time.</>} /></Callout>
      </Section>
      <Section id="pipeline" title={<T pt="Como uma página chega ao índice" en="How a page reaches the index" />}>
        <p><T pt="Um buscador faz quatro coisas em sequência, e cada arquivo desta nota atua em uma delas:" en="A search engine does four things in sequence, and each file in this note acts on one of them:" /></p>
        <Table
          head={[<T pt="Etapa" en="Step" />, <T pt="O que acontece" en="What happens" />, <T pt="O que você controla" en="What you control" />]}
          rows={[
            [<T pt="1. Descobrir" en="1. Discover" />, <T pt="O rastreador acha a URL por links, sitemap ou aviso direto" en="The crawler finds the URL through links, a sitemap or a direct ping" />, <>sitemap.xml, IndexNow, <T pt="links internos" en="internal links" /></>],
            [<T pt="2. Rastrear" en="2. Crawl" />, <T pt="Baixa a página, se o robots.txt permitir" en="Downloads the page, if robots.txt allows it" />, <>robots.txt, <T pt="status HTTP, redirecionamentos" en="HTTP status, redirects" /></>],
            [<T pt="3. Indexar" en="3. Index" />, <T pt="Entende o conteúdo, escolhe a URL canônica e decide se guarda" en="Understands the content, picks the canonical URL and decides whether to store it" />, "title, description, canonical, noindex, JSON-LD, hreflang"],
            [<T pt="4. Exibir" en="4. Serve" />, <T pt="Ordena os resultados e monta o trecho exibido" en="Ranks results and builds the displayed snippet" />, <T pt="Conteúdo, velocidade, max-snippet, Open Graph" en="Content, speed, max-snippet, Open Graph" />],
          ]}
        />
        <p><T pt={<>Daí sai uma regra importante: <strong>o rastreador precisa conseguir ler a página para obedecer a ela</strong>. Por isso um <code>noindex</code> funciona se a página for rastreável, e deixa de funcionar se o robots.txt a bloquear (veja <a href="#noindex">noindex</a>).</>} en={<>One important rule follows: <strong>the crawler must be able to read a page in order to obey it</strong>. That is why a <code>noindex</code> works if the page is crawlable, and stops working if robots.txt blocks it (see <a href="#noindex">noindex</a>).</>} /></p>
      </Section>
      <Section id="head" title={<><T pt="Tags do <head>" en="Head tags" /></>}>
        <p><T pt={<>Este é o <code>&lt;head&gt;</code> da página em português. A versão em inglês (<code>/en/</code>) espelha tudo com <code>lang="en"</code>, textos equivalentes (não tradução seca) e canonical <code>/en/</code>.</>} en={<>This is the <code>&lt;head&gt;</code> of the Portuguese page. The English version (<code>/en/</code>) mirrors it with <code>lang="en"</code>, equivalent texts (not a literal translation) and a <code>/en/</code> canonical.</>} /></p>
        <CodeBlock code={`<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Arcada Software | Landing pages e sites institucionais</title>
<meta name="description" content="A Arcada Software cria landing pages, sites institucionais e pequenos projetos web, com escopo, prazo e preço fechados antes de começar.">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="https://arcada.example/">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0A0A0A">
<link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css?v=0027c125">
<script src="/site.js?v=cb853675" defer></script>`} />
        <Table
          head={["Tag", <T pt="Para que serve" en="What it is for" />]}
          rows={[
            [<><code>charset</code>, <code>viewport</code></>, <T pt="Codificação correta dos acentos e layout de celular. Sem o viewport, o Google trata a página como não otimizada para mobile." en="Correct accent encoding and mobile layout. Without the viewport tag, Google treats the page as not mobile-friendly." />],
            [<code>&lt;title&gt;</code>, <T pt={<>O título azul nos resultados. Cerca de 50 a 60 caracteres, marca + proposta, <strong>único por página e por idioma</strong>. É o sinal on-page mais forte.</>} en={<>The blue headline in results. About 50 to 60 characters, brand + proposition, <strong>unique per page and per language</strong>. It is the strongest on-page signal.</>} />],
            [<code>meta description</code>, <T pt="A frase sob o título. 120 a 155 caracteres, escrita para humanos. Não é fator de ranqueamento, mas o Google a usa como trecho e ela influencia o clique." en="The sentence under the title. 120 to 155 characters, written for humans. Not a ranking factor, but Google uses it as the snippet and it affects the click." />],
            [<code>meta robots</code>, <T pt={<><code>index, follow</code> é o padrão (explicitar não faz mal). <code>max-snippet:-1</code>, <code>max-image-preview:large</code> e <code>max-video-preview:-1</code> removem o limite de trecho, para que o buscador possa mostrar e citar mais texto.</>} en={<><code>index, follow</code> is the default (spelling it out does no harm). <code>max-snippet:-1</code>, <code>max-image-preview:large</code> and <code>max-video-preview:-1</code> remove the snippet limit so the engine may show and quote more text.</>} />],
            [<code>canonical</code>, <T pt={<>A URL oficial da página, <strong>autorreferente</strong> (aponta para si mesma), absoluta e sem parâmetros. Evita que <code>/?utm=x</code>, <code>/index.html</code> e <code>/</code> sejam tratadas como três páginas duplicadas.</>} en={<>The official URL of the page, <strong>self-referencing</strong> (points to itself), absolute and without parameters. It stops <code>/?utm=x</code>, <code>/index.html</code> and <code>/</code> being treated as three duplicate pages.</>} />],
            [<>manifest, icons, <code>theme-color</code></>, <T pt={<>Identidade em abas, atalhos de celular e barra do navegador. O <code>favicon.ico</code> na raiz também é o que o Google exibe ao lado do resultado.</>} en={<>Identity in tabs, phone shortcuts and the browser bar. The <code>favicon.ico</code> is also what Google shows next to the result.</>} />],
            [<><code>preload</code> <T pt="da fonte" en="of the font" /></>, <T pt={<>Faz o navegador baixar a fonte do título cedo, acelerando a pintura do <code>h1</code> (métrica LCP). <code>crossorigin</code> é obrigatório para fontes, mesmo do mesmo domínio.</>} en={<>Makes the browser fetch the heading font early, speeding up the paint of the <code>h1</code> (the LCP metric). <code>crossorigin</code> is mandatory for fonts, even from the same origin.</>} />],
            [<code>?v=hash</code>, <T pt="O build troca o hash quando o CSS/JS muda, o que permite cache imutável de um ano sem servir arquivo velho." en="The build changes the hash when the CSS/JS changes, which allows a one-year immutable cache without serving a stale file." />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Não existe <code>meta keywords</code>:</strong> o Google e o Bing ignoram a tag há anos. Adicioná-la só entrega a lista de termos aos concorrentes.</>} en={<><strong>There is no <code>meta keywords</code>:</strong> Google and Bing have ignored it for years. Adding it only hands your term list to competitors.</>} /></Callout>
      </Section>
      <Section id="social" title={<T pt="Open Graph e Twitter Cards" en="Open Graph and Twitter Cards" />}>
        <p><T pt={<>Open Graph (<code>og:*</code>) controla a pré-visualização quando alguém cola o link no WhatsApp, LinkedIn, Facebook, Slack ou iMessage. Os Twitter Cards fazem o mesmo no X. Não ajudam no ranking, mas decidem se o link compartilhado parece confiável.</>} en={<>Open Graph (<code>og:*</code>) controls the preview when someone pastes the link into WhatsApp, LinkedIn, Facebook, Slack or iMessage. Twitter Cards do the same on X. They do not help ranking, but they decide whether a shared link looks trustworthy.</>} /></p>
        <CodeBlock code={`<meta property="og:type" content="website">
<meta property="og:site_name" content="Arcada Software">
<meta property="og:title" content="Arcada Software: landing pages e sites institucionais">
<meta property="og:description" content="Landing pages, sites institucionais e pequenos projetos web, com escopo, prazo e preço fechados antes de começar.">
<meta property="og:url" content="https://arcada.example/">
<meta property="og:locale" content="pt_BR">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:image" content="https://arcada.example/og/arcada-pt.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Arcada Software: desenho de arcada sobre fundo preto">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Arcada Software: landing pages e sites institucionais">
<meta name="twitter:description" content="Landing pages, sites institucionais e pequenos projetos web, com escopo, prazo e preço fechados antes de começar.">
<meta name="twitter:image" content="https://arcada.example/og/arcada-pt.png">
<meta name="twitter:image:alt" content="Arcada Software: desenho de arcada sobre fundo preto">
<!-- TODO(dono): twitter:site e twitter:creator só com perfil real -->`} />
        <ul className="ds-list">
          <li><T pt={<><code>og:image</code> em <strong>1200×630</strong> px (proporção 1,91:1), URL <strong>absoluta</strong> e hospedada no próprio site (aqui em <code>/og/</code>), uma por idioma. Largura e altura declaradas evitam que a primeira partilha saia sem imagem enquanto a rede baixa o arquivo.</>} en={<><code>og:image</code> at <strong>1200×630</strong> px (1.91:1 ratio), an <strong>absolute</strong> URL hosted on the site itself (here under <code>/og/</code>), one per language. Declared width and height stop the first share going out without an image while the network fetches the file.</>} /></li>
          <li><T pt={<><code>og:locale</code> e <code>og:locale:alternate</code> usam o formato <code>pt_BR</code> (com sublinhado), diferente do <code>hreflang</code>, que usa <code>pt-BR</code> (com hífen).</>} en={<><code>og:locale</code> and <code>og:locale:alternate</code> use the <code>pt_BR</code> format (underscore), unlike <code>hreflang</code>, which uses <code>pt-BR</code> (hyphen).</>} /></li>
          <li><T pt={<><code>twitter:card = summary_large_image</code> reaproveita a mesma imagem. O X também lê <code>og:*</code> quando faltam as tags próprias.</>} en={<><code>twitter:card = summary_large_image</code> reuses the same image. X also reads <code>og:*</code> when its own tags are missing.</>} /></li>
          <li><T pt={<><code>twitter:site</code> e <code>twitter:creator</code> só entram com um perfil real. Por isso ficou um <code>TODO</code> no código em vez de um @ inventado.</>} en={<><code>twitter:site</code> and <code>twitter:creator</code> only go in with a real profile. That is why a <code>TODO</code> was left in the code instead of an invented handle.</>} /></li>
          <li><T pt="Depois de mudar a imagem, o WhatsApp e o Facebook guardam a antiga em cache; use o Facebook Sharing Debugger ou o LinkedIn Post Inspector para forçar a atualização." en="After changing the image, WhatsApp and Facebook keep the old one cached; use the Facebook Sharing Debugger or the LinkedIn Post Inspector to force a refresh." /></li>
        </ul>
      </Section>
      <Section id="hreflang" title={<T pt="Dois idiomas: hreflang" en="Two languages: hreflang" />}>
        <CodeBlock code={`<link rel="alternate" hreflang="pt-BR" href="https://arcada.example/">
<link rel="alternate" hreflang="en" href="https://arcada.example/en/">
<link rel="alternate" hreflang="x-default" href="https://arcada.example/">`} />
        <p><T pt={<><code>hreflang</code> diz ao buscador que as duas URLs são o mesmo conteúdo em idiomas diferentes, para mostrar a versão certa a cada pessoa em vez de tratá-las como duplicatas. Regras que costumam dar erro:</>} en={<><code>hreflang</code> tells the search engine the two URLs are the same content in different languages, so it shows each person the right version instead of treating them as duplicates. Rules that commonly go wrong:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Recíproco:</strong> a página PT lista a EN <em>e</em> a EN lista a PT. Sem a volta, o Google ignora o par.</>} en={<><strong>Reciprocal:</strong> the PT page lists the EN one <em>and</em> the EN lists the PT. Without the return link, Google ignores the pair.</>} /></li>
          <li><T pt={<><strong>Inclua a própria página</strong> na lista (a PT lista <code>pt-BR</code> apontando para si).</>} en={<><strong>Include the page itself</strong> in the list (PT lists <code>pt-BR</code> pointing at itself).</>} /></li>
          <li><T pt={<><code>x-default</code> é a versão para quem não casa com nenhum idioma listado; aqui, o português.</>} en={<><code>x-default</code> is the version for people who match none of the listed languages; here, Portuguese.</>} /></li>
          <li><T pt={<>O canonical de cada versão aponta para <strong>ela mesma</strong>, nunca para a outra. Apontar o canonical da EN para a PT diria ao Google que a EN é cópia e a tiraria do índice.</>} en={<>The canonical of each version points to <strong>itself</strong>, never to the other. Pointing the EN canonical at the PT page would tell Google the EN is a copy and drop it from the index.</>} /></li>
          <li><T pt="Os mesmos três links aparecem também no sitemap (veja abaixo); basta manter um dos dois lugares coerente com o outro." en="The same three links also appear in the sitemap (see below); just keep the two places consistent with each other." /></li>
        </ul>
      </Section>
      <Section id="jsonld" title={<T pt="Dados estruturados: JSON-LD" en="Structured data: JSON-LD" />}>
        <p><T pt={<>O HTML descreve como a página <em>aparece</em>; o JSON-LD descreve <em>o que ela é</em> em um vocabulário que máquinas entendem (schema.org). Fica num bloco <code>&lt;script type="application/ld+json"&gt;</code>, e como é dado, não executa nada e não precisa de exceção na CSP. Um bloco só, com <code>@graph</code>, liga as entidades por <code>@id</code>:</>} en={<>HTML describes how the page <em>looks</em>; JSON-LD describes <em>what it is</em> in a vocabulary machines understand (schema.org). It lives in a <code>&lt;script type="application/ld+json"&gt;</code> block, and being data, it runs nothing and needs no CSP exception. A single block with <code>@graph</code> links the entities by <code>@id</code>:</>} /></p>
        <CodeBlock code={`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://arcada.example/#org",
      "name": "Arcada Software",
      "url": "https://arcada.example/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arcada.example/icon-512.png",
        "width": 512,
        "height": 512
      },
      "description": "Landing pages, sites institucionais e pequenos projetos web.",
      "email": "contato@arcada.example",
      "areaServed": "BR",
      "availableLanguage": ["pt-BR", "en"],
      "knowsAbout": ["landing pages", "sites institucionais", "desenvolvimento web", "SEO técnico"]
    },
    {
      "@type": "WebSite",
      "@id": "https://arcada.example/#site",
      "url": "https://arcada.example/",
      "name": "Arcada Software",
      "inLanguage": "pt-BR",
      "publisher": { "@id": "https://arcada.example/#org" }
    },
    {
      "@type": "WebPage",
      "@id": "https://arcada.example/#page",
      "url": "https://arcada.example/",
      "name": "Arcada Software | Landing pages e sites institucionais",
      "inLanguage": "pt-BR",
      "isPartOf": { "@id": "https://arcada.example/#site" },
      "about": { "@id": "https://arcada.example/#org" },
      "dateModified": "2026-10-28"
    },
    {
      "@type": "Service",
      "@id": "https://arcada.example/#landing",
      "name": "Landing page",
      "serviceType": "Desenvolvimento de landing page",
      "description": "Uma página com um objetivo: captar contatos ou vender, responsiva, com formulário ou WhatsApp e métricas.",
      "provider": { "@id": "https://arcada.example/#org" },
      "areaServed": "BR",
      "inLanguage": "pt-BR"
    },
    {
      "@type": "FAQPage",
      "@id": "https://arcada.example/#faq",
      "inLanguage": "pt-BR",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quanto custa uma landing page?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O preço é fechado na proposta, antes de começar, e depende do número de seções, de integrações como formulário ou WhatsApp e de quanto material você já tem pronto. [...]"
          }
        }
      ]
    }
  ]
}
</script>`} />
        <p><T pt={<>O bloco acima está abreviado: o real tem <strong>três</strong> <code>Service</code> (Landing page, Site institucional, Pequenos projetos web) e <strong>oito</strong> perguntas no <code>FAQPage</code>. A versão em inglês tem a mesma estrutura, com textos e <code>inLanguage</code> em inglês.</>} en={<>The block above is abridged: the real one has <strong>three</strong> <code>Service</code> entries (Landing page, Business website, Small web projects) and <strong>eight</strong> questions in the <code>FAQPage</code>. The English version has the same structure, with English texts and <code>inLanguage</code>.</>} /></p>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="O que declara" en="What it declares" />]}
          rows={[
            [<code>Organization</code>, <T pt={<>Quem é a empresa: nome, logo (512×512), e-mail, idiomas, temas (<code>knowsAbout</code>). É o que ajuda o buscador e as IAs a reconhecer a marca como uma entidade. <code>sameAs</code> (perfis em redes) só entra com perfis reais; hoje está omitido.</>} en={<>Who the company is: name, logo (512×512), email, languages, topics (<code>knowsAbout</code>). It helps engines and AIs recognise the brand as an entity. <code>sameAs</code> (social profiles) only goes in with real profiles; it is omitted for now.</>} />],
            [<><code>WebSite</code>, <code>WebPage</code></>, <T pt={<>O site e a página, com <code>inLanguage</code> e <code>dateModified</code> real (a data da última mudança de conteúdo, não a de hoje).</>} en={<>The site and the page, with <code>inLanguage</code> and a real <code>dateModified</code> (the date the content last changed, not today's).</>} />],
            [<code>Service</code>, <T pt={<>Cada serviço, igual à tabela visível. <strong>Sem preço</strong>, porque o dono não confirmou nenhum.</>} en={<>Each service, matching the visible table. <strong>No price</strong>, because the owner confirmed none.</>} />],
            [<code>FAQPage</code>, <T pt="Exatamente as mesmas 8 perguntas e respostas do FAQ visível (gerado da mesma fonte de dados), com 40 a 60 palavras cada: curtas o bastante para serem citadas, longas o bastante para fazerem sentido sozinhas." en="Exactly the same 8 questions and answers as the visible FAQ (generated from the same data source), 40 to 60 words each: short enough to be quoted, long enough to make sense alone." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>A regra de ouro:</strong> o JSON-LD só pode espelhar o que está <em>visível</em> na página. Não use <code>AggregateRating</code>, <code>Review</code>, <code>LocalBusiness</code>, <code>Product</code>, <code>HowTo</code> nem <code>Speakable</code> se não houver esses dados na tela. Marcar avaliações que não existem viola as diretrizes do Google e pode render uma ação manual contra o site.</>} en={<><strong>The golden rule:</strong> JSON-LD may only mirror what is <em>visible</em> on the page. Do not use <code>AggregateRating</code>, <code>Review</code>, <code>LocalBusiness</code>, <code>Product</code>, <code>HowTo</code> or <code>Speakable</code> if that data is not on screen. Marking up reviews that do not exist violates Google's guidelines and can bring a manual action against the site.</>} /></Callout>
        <Callout icon="check"><T pt={<><strong>Expectativa realista sobre o FAQ:</strong> desde 2023 o Google só exibe o resultado rico de FAQ para sites governamentais e de saúde muito conhecidos. Para um site pequeno o <code>FAQPage</code> <em>não</em> vira o acordeão nos resultados, mas continua sendo uma forma limpa e legível por máquina de entregar perguntas e respostas a buscadores e IAs. Confira o estado atual na documentação do Google antes de prometer o contrário.</>} en={<><strong>Realistic expectation about the FAQ:</strong> since 2023 Google only shows the FAQ rich result for well-known government and health sites. For a small site the <code>FAQPage</code> will <em>not</em> turn into the accordion in results, but it is still a clean, machine-readable way to hand questions and answers to search engines and AIs. Check Google's current documentation before promising otherwise.</>} /></Callout>
        <ul className="ds-list">
          <li><T pt={<>Os <code>@id</code> são identificadores, não precisam abrir nada; o <code>#org</code> é reaproveitado pelo <code>WebSite</code> (<code>publisher</code>), <code>WebPage</code> (<code>about</code>) e cada <code>Service</code> (<code>provider</code>). Assim a empresa é descrita uma vez e referenciada.</>} en={<>The <code>@id</code> values are identifiers; they need not resolve to anything. <code>#org</code> is reused by <code>WebSite</code> (<code>publisher</code>), <code>WebPage</code> (<code>about</code>) and each <code>Service</code> (<code>provider</code>). The company is described once and referenced.</>} /></li>
          <li><T pt={<>Mantenha os dados e o HTML saindo da <strong>mesma fonte</strong> (um arquivo de dados que gera as duas coisas) para que nunca divirjam.</>} en={<>Keep the data and the HTML coming from the <strong>same source</strong> (one data file that generates both) so they never diverge.</>} /></li>
          <li><T pt={<>Valide em <em>Rich Results Test</em> e em <em>validator.schema.org</em> depois que o site estiver num domínio público (eles precisam acessar a URL, ou aceitam o código colado).</>} en={<>Validate in the <em>Rich Results Test</em> and at <em>validator.schema.org</em> once the site is on a public domain (they need to reach the URL, or accept pasted code).</>} /></li>
        </ul>
      </Section>
      <Section id="sitemap" title={<T pt="sitemap.xml" en="sitemap.xml" />}>
        <CodeBlock code={`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://arcada.example/</loc>
    <lastmod>2026-10-28</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://arcada.example/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://arcada.example/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://arcada.example/"/>
  </url>
  <url>
    <loc>https://arcada.example/en/</loc>
    <lastmod>2026-10-28</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://arcada.example/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://arcada.example/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://arcada.example/"/>
  </url>
</urlset>`} />
        <ul className="ds-list">
          <li><T pt={<>É a <strong>lista de URLs que você quer indexadas</strong>, não de todas as que existem. Aqui: <code>/</code> e <code>/en/</code>. Ficam de fora <code>/links/</code>, <code>/404.html</code>, <code>/api/</code> e as páginas de agradecimento. Um sitemap que lista páginas <code>noindex</code> ou que redirecionam envia sinais contraditórios.</>} en={<>It is the <strong>list of URLs you want indexed</strong>, not every URL that exists. Here: <code>/</code> and <code>/en/</code>. Left out: <code>/links/</code>, <code>/404.html</code>, <code>/api/</code> and the thank-you pages. A sitemap that lists <code>noindex</code> or redirecting pages sends contradictory signals.</>} /></li>
          <li><T pt={<>Todas as URLs são <strong>absolutas</strong>, no mesmo protocolo, domínio e padrão de barra final do canonical (aqui, sempre com barra).</>} en={<>All URLs are <strong>absolute</strong>, with the same protocol, domain and trailing-slash style as the canonical (here, always with a slash).</>} /></li>
          <li><T pt={<><code>lastmod</code> é a data <strong>real</strong> da última mudança de conteúdo. Atualizá-la todo dia sem mudança faz o Google desconfiar e passar a ignorar o campo.</>} en={<><code>lastmod</code> is the <strong>real</strong> date of the last content change. Bumping it daily without a change makes Google distrust it and start ignoring the field.</>} /></li>
          <li><T pt={<><code>priority</code> e <code>changefreq</code> não são usados: o Google os ignora.</>} en={<><code>priority</code> and <code>changefreq</code> are not used: Google ignores them.</>} /></li>
          <li><T pt={<>O <code>xhtml:link</code> repete o hreflang para cada versão, incluindo ela mesma. É uma alternativa (ou reforço) às tags do <code>&lt;head&gt;</code>.</>} en={<>The <code>xhtml:link</code> repeats the hreflang for each version, including itself. It is an alternative (or reinforcement) to the <code>&lt;head&gt;</code> tags.</>} /></li>
          <li><T pt="Limite de um sitemap: 50.000 URLs ou 50 MB sem compressão. Acima disso, divida e use um índice de sitemaps." en="Limit of one sitemap: 50,000 URLs or 50 MB uncompressed. Above that, split it and use a sitemap index." /></li>
          <li><T pt={<>Anuncie o sitemap na última linha do <code>robots.txt</code> e envie no Google Search Console e no Bing Webmaster Tools.</>} en={<>Announce the sitemap on the last line of <code>robots.txt</code> and submit it in Google Search Console and Bing Webmaster Tools.</>} /></li>
        </ul>
      </Section>
      <Section id="robots" title={<T pt="robots.txt e rastreadores de IA" en="robots.txt and AI crawlers" />}>
        <p><T pt={<>O <code>robots.txt</code> fica na raiz (<code>/robots.txt</code>) e diz a cada rastreador o que ele pode buscar. É um <strong>pedido de boa-fé, não uma barreira</strong>: bots de bem obedecem; bots maliciosos ignoram. Nunca use o robots.txt para esconder algo secreto (ele próprio é público) e nunca para proteger dados: para isso use autenticação.</>} en={<>The <code>robots.txt</code> sits at the root (<code>/robots.txt</code>) and tells each crawler what it may fetch. It is a <strong>good-faith request, not a barrier</strong>: well-behaved bots obey; malicious ones ignore it. Never use robots.txt to hide something secret (the file itself is public) and never to protect data: use authentication for that.</>} /></p>
        <CodeBlock code={`# Rastreadores de busca comuns (Googlebot, Bingbot etc.)
User-agent: *
Allow: /
Disallow: /api/

# Busca e respostas de IA: permitidos (alimentam as recomendações; bloquear tira o site delas).
# Cada grupo repete Disallow porque um grupo específico não herda as regras de "*".
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Applebot
Allow: /
Disallow: /api/

# Treino de modelos. Decisão do dono: permitido por padrão. Para bloquear, troque Allow por Disallow.
# Não afeta a busca comum.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /
Disallow: /api/

# /links/ não é bloqueado aqui: a página usa noindex e o rastreador precisa lê-la.
Sitemap: https://arcada.example/sitemap.xml`} />
        <p><T pt="Há três famílias de bots de IA, e a decisão de liberar ou bloquear é diferente para cada uma:" en="There are three families of AI bots, and the decision to allow or block differs for each:" /></p>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="Exemplos" en="Examples" />, <T pt="Para que serve" en="What it is for" />, <T pt="Decisão do exemplo" en="Decision in the example" />]}
          rows={[
            [<T pt="Busca e resposta" en="Search and answers" />, "OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot", <T pt="Indexa o site para o assistente poder encontrá-lo e citá-lo com link" en="Indexes the site so the assistant can find and cite it with a link" />, <T pt="Liberado. Bloquear tira o site das respostas" en="Allowed. Blocking removes the site from answers" />],
            [<T pt="Ação do usuário" en="User action" />, "ChatGPT-User, Claude-User, Perplexity-User", <T pt="Busca a página na hora, porque uma pessoa pediu ao assistente para abri-la" en="Fetches the page on the spot because a person asked the assistant to open it" />, <T pt="Liberado" en="Allowed" />],
            [<T pt="Treino de modelos" en="Model training" />, "GPTBot, ClaudeBot, Google-Extended, Applebot-Extended", <T pt="Coleta texto para treinar modelos futuros. Não afeta a busca comum" en="Collects text to train future models. Does not affect regular search" />, <T pt={<>Liberado por padrão; o dono pode trocar <code>Allow</code> por <code>Disallow</code></>} en={<>Allowed by default; the owner may swap <code>Allow</code> for <code>Disallow</code></>} />],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong>Grupos específicos não herdam o <code>*</code>.</strong> Quando um bot encontra um grupo com o seu nome, ele usa só aquele grupo e ignora o <code>User-agent: *</code>. Por isso o <code>Disallow: /api/</code> é repetido em cada grupo; esquecer isso abriria <code>/api/</code> para os bots de IA.</>} en={<><strong>Specific groups do not inherit <code>*</code>.</strong> When a bot finds a group with its name, it uses only that group and ignores <code>User-agent: *</code>. That is why <code>Disallow: /api/</code> is repeated in each group; forgetting it would open <code>/api/</code> to the AI bots.</>} /></li>
          <li><T pt={<><code>Google-Extended</code> e <code>Applebot-Extended</code> não são rastreadores separados: são <em>tokens</em> que controlam se o conteúdo já rastreado pelo Googlebot/Applebot pode ser usado para treino. Bloqueá-los não tira o site da busca.</>} en={<><code>Google-Extended</code> and <code>Applebot-Extended</code> are not separate crawlers: they are <em>tokens</em> controlling whether content already crawled by Googlebot/Applebot may be used for training. Blocking them does not remove the site from search.</>} /></li>
          <li><T pt={<>Liberar ou bloquear o treino é uma <strong>decisão de negócio</strong> (direitos sobre o conteúdo, visibilidade futura), não técnica. Não há resposta certa; o importante é decidir de propósito.</>} en={<>Allowing or blocking training is a <strong>business decision</strong> (rights over the content, future visibility), not a technical one. There is no right answer; what matters is deciding on purpose.</>} /></li>
          <li><T pt="Os nomes dos user agents mudam e novos aparecem. Confira cada nome na documentação oficial do fornecedor antes de publicar; a lista deste exemplo não foi reconferida." en="User-agent names change and new ones appear. Check each name in the vendor's official documentation before publishing; the list in this example was not re-verified." /></li>
          <li><T pt={<><strong>Não bloqueie CSS, JS ou imagens</strong> que a página usa para renderizar: o Google precisa delas para entender o layout.</>} en={<><strong>Do not block CSS, JS or images</strong> the page uses to render: Google needs them to understand the layout.</>} /></li>
        </ul>
      </Section>
      <Section id="llms" title={<T pt="llms.txt e llms-full.txt" en="llms.txt and llms-full.txt" />}>
        <p><T pt={<>O <code>llms.txt</code> (proposta em llmstxt.org) é um arquivo em Markdown na raiz que resume o site para modelos de linguagem: um título, uma citação com a descrição, e seções de links com uma linha explicando cada um. A ideia é entregar a uma IA o mapa do site sem que ela precise ler HTML cheio de menus e scripts. O <code>llms-full.txt</code> é a versão completa, com todo o conteúdo visível em Markdown, em português e inglês.</>} en={<>The <code>llms.txt</code> (a proposal at llmstxt.org) is a Markdown file at the root that summarises the site for language models: a title, a blockquote with the description, and sections of links with a line explaining each. The idea is to hand an AI the site map without making it read HTML full of menus and scripts. The <code>llms-full.txt</code> is the full version, with all the visible content in Markdown, in Portuguese and English.</>} /></p>
        <CodeBlock code={`# Arcada Software

> A Arcada Software cria landing pages, sites institucionais e pequenos projetos web para negócios que querem uma presença online clara, com escopo, prazo e preço fechados antes de começar.

## Serviços
- [Landing page](https://arcada.example/#landing): Uma página com um objetivo: captar contatos ou vender, responsiva, com formulário ou WhatsApp e métricas.
- [Site institucional](https://arcada.example/#site): Um site com página inicial e páginas internas que apresenta a empresa, os serviços e o contato.
- [Pequenos projetos web](https://arcada.example/#pequenos): Projetos web pequenos e bem delimitados, com escopo definido em conversa e publicação incluída.

## Como trabalhamos
- [Processo em cinco passos](https://arcada.example/#processo): conversa, estrutura, design e código, revisão e publicação.

## Perguntas frequentes
- [Perguntas frequentes](https://arcada.example/#faq): custo, prazo, material necessário, revisões, manutenção, edição do site, celular e pagamento.

## Contato
- [Pedir orçamento](https://arcada.example/#contato): formulário do site.
- [E-mail](mailto:contato@arcada.example): contato@arcada.example

## English
- [Arcada Software in English](https://arcada.example/en/): Landing pages, business websites and small web projects.

## Optional
- [Texto completo do site](https://arcada.example/llms-full.txt): todo o conteúdo da página em Markdown.`} />
        <p><T pt={<>O <code>llms-full.txt</code> repete o conteúdo visível em Markdown puro: a tabela de serviços, "para quem é e para quem não é", o processo em cinco passos, as 8 perguntas e respostas, o contato e a data de atualização. Abaixo, um trecho:</>} en={<>The <code>llms-full.txt</code> repeats the visible content in plain Markdown: the services table, "who it is for and who it is not for", the five-step process, the 8 questions and answers, the contact and the update date. An excerpt:</>} /></p>
        <CodeBlock code={`# Arcada Software (português)

> A Arcada Software cria landing pages, sites institucionais e pequenos projetos web [...]

## Serviços

| Serviço | Para quem serve | O que inclui | Prazo de referência | Preço |
|---|---|---|---|---|
| Landing page | Quem quer captar contatos ou vender uma oferta específica. | Uma página com um objetivo, design responsivo, formulário ou WhatsApp, medição de visitas e publicação. | 1 a 2 semanas | Fechado na proposta |

## Perguntas frequentes

### Quanto custa uma landing page?

O preço é fechado na proposta, antes de começar [...]

Atualizado em 28 de outubro de 2026.

---

# Arcada Software (English)
[...]`} />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Honestidade sobre o llms.txt:</strong> o Google diz que não usa o arquivo; Anthropic e Perplexity dizem ler, sem confirmação independente do efeito. Custa pouco e não faz mal, mas <strong>não é fator de ranqueamento</strong> e ninguém deve contar com ele para aparecer em respostas de IA. O que mais pesa continua sendo o conteúdo claro no HTML.</>} en={<><strong>Honesty about llms.txt:</strong> Google says it does not use the file; Anthropic and Perplexity say they read it, with no independent confirmation of the effect. It costs little and does no harm, but <strong>it is not a ranking factor</strong> and nobody should count on it to appear in AI answers. What matters most remains clear content in the HTML.</>} /></Callout>
        <Callout icon="check"><T pt={<><strong>E o "agents.llm"?</strong> Esse nome não existe como padrão; o arquivo do exemplo é o <code>llms.txt</code>. Não confunda com o <code>AGENTS.md</code>, que é outra coisa: instruções para <em>agentes de código</em> (Claude Code, Codex, Cursor) dentro de um repositório, e não ajuda em SEO. Para controlar quais bots de IA entram no site, o arquivo é o <code>robots.txt</code>. Veja a nota de agent harness para o <code>AGENTS.md</code>.</>} en={<><strong>What about "agents.llm"?</strong> That name does not exist as a standard; the file in the example is <code>llms.txt</code>. Do not confuse it with <code>AGENTS.md</code>, which is something else: instructions for <em>coding agents</em> (Claude Code, Codex, Cursor) inside a repository, and it does nothing for SEO. To control which AI bots enter the site, the file is <code>robots.txt</code>. See the agent harness note for <code>AGENTS.md</code>.</>} /></Callout>
      </Section>
      <Section id="noindex" title={<T pt="Páginas noindex" en="noindex pages" />}>
        <CodeBlock code={`<meta name="robots" content="noindex, follow">   <!-- /links/, obrigado.html, en/thanks.html -->
<meta name="robots" content="noindex">           <!-- 404.html -->`} />
        <p><T pt={<>Nem toda página deve aparecer no Google. A página de bio (<code>/links/</code>), a de erro 404 e as de agradecimento (que só fazem sentido depois de um formulário) usam <code>noindex</code>. As duas primeiras ficam fora do sitemap.</>} en={<>Not every page should appear in Google. The bio page (<code>/links/</code>), the 404 error page and the thank-you pages (which only make sense after a form) use <code>noindex</code>. The first two are kept out of the sitemap.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>noindex e Disallow se anulam.</strong> Se você bloqueia <code>/links/</code> no robots.txt, o rastreador não baixa a página, nunca vê o <code>noindex</code>, e a URL ainda pode aparecer nos resultados (sem descrição) por causa de links externos. Para tirar uma página do índice: <strong>permita o rastreamento e use <code>noindex</code></strong>. Use <code>Disallow</code> só para poupar o servidor de trechos sem valor, como <code>/api/</code>.</>} en={<><strong>noindex and Disallow cancel each other out.</strong> If you block <code>/links/</code> in robots.txt, the crawler does not download the page, never sees the <code>noindex</code>, and the URL can still appear in results (without a description) because of external links. To remove a page from the index: <strong>allow crawling and use <code>noindex</code></strong>. Use <code>Disallow</code> only to spare the server from valueless areas, such as <code>/api/</code>.</>} /></Callout>
        <ul className="ds-list">
          <li><T pt={<><code>follow</code> deixa o rastreador seguir os links da página mesmo sem indexá-la.</>} en={<><code>follow</code> lets the crawler follow the page's links even without indexing it.</>} /></li>
          <li><T pt={<>O 404 precisa responder com o <strong>status HTTP 404</strong> de verdade (não 200 com a mensagem "não encontrado", o chamado soft 404).</>} en={<>The 404 page must answer with a real <strong>HTTP 404 status</strong> (not 200 with a "not found" message, the so-called soft 404).</>} /></li>
        </ul>
      </Section>
      <Section id="html" title={<T pt="HTML e conteúdo que a IA consegue ler" en="HTML and content an AI can read" />}>
        <p><T pt="Meta tags e dados estruturados só ajudam se a página em si for boa de ler. As regras aplicadas no exemplo:" en="Meta tags and structured data only help if the page itself reads well. The rules applied in the example:" /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Um <code>h1</code> por página</strong>, e <code>h2</code> com <code>id</code> estáveis (<code>servicos</code>, <code>para-quem</code>, <code>processo</code>, <code>projetos</code>, <code>sobre</code>, <code>faq</code>, <code>contato</code>). Âncoras estáveis permitem links diretos para a seção, usados no <code>llms.txt</code> e nos resultados.</>} en={<><strong>One <code>h1</code> per page</strong>, and <code>h2</code> with stable <code>id</code>s (<code>servicos</code>, <code>para-quem</code>, <code>processo</code>, <code>projetos</code>, <code>sobre</code>, <code>faq</code>, <code>contato</code>). Stable anchors allow direct links to a section, used in <code>llms.txt</code> and in results.</>} /></li>
          <li><T pt={<><strong>Marcos semânticos</strong> (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>), link "Ir para o conteúdo" e <strong>texto de link descritivo</strong> ("Pedir orçamento", não "clique aqui").</>} en={<><strong>Semantic landmarks</strong> (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>), a "Skip to content" link and <strong>descriptive link text</strong> ("Request a quote", not "click here").</>} /></li>
          <li><T pt={<><strong>A primeira frase visível define a empresa</strong>: "A Arcada Software cria landing pages, sites institucionais e pequenos projetos web para negócios que querem uma presença online clara, com escopo, prazo e preço fechados antes de começar." Um modelo que leia só o começo já sabe quem é e o que faz.</>} en={<><strong>The first visible sentence defines the company</strong>: "Arcada Software builds landing pages, business websites and small web projects for companies that want a clear online presence, with scope, deadline and price agreed before work begins." A model that reads only the start already knows who it is and what it does.</>} /></li>
          <li><T pt={<>Formatos fáceis de extrair: <strong>tabela HTML</strong> de serviços, "para quem é / não é", processo em <code>&lt;ol&gt;</code>, FAQ em <code>&lt;details&gt;&lt;summary&gt;</code> (nativo, sem JavaScript), seção de provas honesta (sem casos inventados) e "Atualizado em" no rodapé.</>} en={<>Easy-to-extract formats: an <strong>HTML table</strong> of services, "who it is / is not for", the process in an <code>&lt;ol&gt;</code>, the FAQ in <code>&lt;details&gt;&lt;summary&gt;</code> (native, no JavaScript), an honest proof section (no invented cases) and "Updated on" in the footer.</>} /></li>
          <li><T pt={<><strong>Todo o conteúdo existe no HTML sem JavaScript.</strong> Muitos rastreadores de IA não executam JS; se o texto só aparece depois de um script, para eles a página está vazia. Teste com <code>curl https://seu-site/ | less</code> e veja se o texto está lá.</>} en={<><strong>All content exists in the HTML without JavaScript.</strong> Many AI crawlers do not execute JS; if the text only appears after a script, the page is empty to them. Test with <code>curl https://your-site/ | less</code> and check the text is there.</>} /></li>
          <li><T pt={<>Fontes hospedadas localmente (WOFF2), um CSS só, JS apenas para tema, formulário e eventos (<code>defer</code>). Menos requisições, página mais rápida.</>} en={<>Locally hosted fonts (WOFF2), a single CSS file, JS only for theme, form and events (<code>defer</code>). Fewer requests, a faster page.</>} /></li>
          <li><T pt={<><strong>Medição sem cookies</strong> (Plausible, Cloudflare Web Analytics ou PostHog), com eventos por atributo <code>data-evento</code> (<code>pedir-orcamento</code>, <code>enviar-formulario</code>, <code>whatsapp</code>). Sem banner de cookies e sem script pesado.</>} en={<><strong>Cookie-free analytics</strong> (Plausible, Cloudflare Web Analytics or PostHog), with events via a <code>data-evento</code> attribute (<code>pedir-orcamento</code>, <code>enviar-formulario</code>, <code>whatsapp</code>). No cookie banner and no heavy script.</>} /></li>
        </ul>
        <p><T pt={<>Velocidade também conta: o Google mede <em>Core Web Vitals</em> (LCP, INP, CLS). O exemplo mira LCP abaixo de 2,5 s e CLS próximo de 0, o que o preload da fonte, o CSS único e a ausência de scripts bloqueantes ajudam a alcançar.</>} en={<>Speed counts too: Google measures <em>Core Web Vitals</em> (LCP, INP, CLS). The example aims for LCP under 2.5 s and CLS near 0, which the font preload, the single CSS file and the absence of blocking scripts help achieve.</>} /></p>
      </Section>
      <Section id="hosting" title={<T pt="Redirecionamentos, cabeçalhos e cache" en="Redirects, headers and cache" />}>
        <p><T pt={<>Duas URLs para a mesma página diluem o sinal. O arquivo <code>_redirects</code> da Cloudflare Pages unifica tudo numa forma só (<strong>sempre com barra final</strong>, igual ao canonical e ao sitemap):</>} en={<>Two URLs for the same page dilute the signal. Cloudflare Pages' <code>_redirects</code> file unifies everything into one form (<strong>always with a trailing slash</strong>, matching the canonical and the sitemap):</>} /></p>
        <CodeBlock code={`# Padrão do site: sempre COM barra final (canonical, sitemap e links).
https://www.arcada.example/* https://arcada.example/:splat 301
/index.html / 301
/en/index.html /en/ 301
/en /en/ 301
/links /links/ 301`} />
        <p><T pt={<>O <code>301</code> é o redirecionamento permanente, e o buscador transfere o sinal para o destino. Aqui o <code>www</code> vai para o domínio sem <code>www</code> e <code>/index.html</code> vai para <code>/</code>. Escolha uma forma (com ou sem <code>www</code>) e mantenha-a em todos os lugares.</>} en={<>The <code>301</code> is the permanent redirect, and the engine transfers the signal to the target. Here <code>www</code> goes to the bare domain and <code>/index.html</code> goes to <code>/</code>. Pick one form (with or without <code>www</code>) and keep it everywhere.</>} /></p>
        <p><T pt={<>O arquivo <code>_headers</code> define segurança e cache. A segurança importa para SEO indiretamente (HTTPS é sinal de confiança e site invadido é desindexado); o cache importa para velocidade:</>} en={<>The <code>_headers</code> file sets security and cache. Security matters for SEO indirectly (HTTPS is a trust signal and a hacked site gets deindexed); cache matters for speed:</>} /></p>
        <CodeBlock code={`/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin

# HTML sempre revalidado.
/
  Cache-Control: public, max-age=0, must-revalidate
/en/
  Cache-Control: public, max-age=0, must-revalidate

# CSS e JS têm ?v=<hash>, por isso podem ser imutáveis.
/style.css
  Cache-Control: public, max-age=31536000, immutable
/site.js
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/og/*
  Cache-Control: public, max-age=86400
/api/*
  Cache-Control: no-store`} />
        <ul className="ds-list">
          <li><T pt={<><strong>CSP estrita</strong> (sem <code>unsafe-inline</code>): como o JSON-LD é dado e não script executável, não precisa de exceção. Se ligar uma medição como o Plausible, acrescente o domínio do script em <code>script-src</code> e <code>connect-src</code>. Detalhes na nota de apps web seguros.</>} en={<><strong>Strict CSP</strong> (no <code>unsafe-inline</code>): since JSON-LD is data and not executable script, it needs no exception. If you add analytics such as Plausible, add the script's domain to <code>script-src</code> and <code>connect-src</code>. Details in the secure web apps note.</>} /></li>
          <li><T pt={<><strong>HTML sempre revalidado</strong> (<code>max-age=0, must-revalidate</code>): uma mudança de texto aparece na hora. <strong>CSS, JS e fontes imutáveis por um ano</strong>, porque o nome do arquivo muda (<code>?v=hash</code>) quando o conteúdo muda.</>} en={<><strong>HTML always revalidated</strong> (<code>max-age=0, must-revalidate</code>): a text change shows up at once. <strong>CSS, JS and fonts immutable for a year</strong>, because the file URL changes (<code>?v=hash</code>) when the content changes.</>} /></li>
          <li><T pt={<>A compressão Brotli vem da Cloudflare e deve ser conferida no site real (<code>curl -I -H "Accept-Encoding: br" ...</code>).</>} en={<>Brotli compression comes from Cloudflare and should be checked on the live site (<code>curl -I -H "Accept-Encoding: br" ...</code>).</>} /></li>
        </ul>
      </Section>
      <Section id="extras" title={<T pt="manifest, security.txt e IndexNow" en="manifest, security.txt and IndexNow" />}>
        <h3>manifest.webmanifest</h3>
        <CodeBlock code={`{
  "name": "Arcada Software",
  "short_name": "Arcada",
  "lang": "pt-BR",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0A0A0A",
  "theme_color": "#0A0A0A",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`} />
        <p><T pt={<>Nome, ícones, cores e <code>start_url</code> para quando alguém adiciona o site à tela inicial do celular. Não afeta o ranking, mas completa a identidade e é exigido por auditorias como o Lighthouse. O ícone <code>maskable</code> tem margem de segurança para o sistema recortá-lo em círculo ou quadrado arredondado.</>} en={<>Name, icons, colours and <code>start_url</code> for when someone adds the site to their phone's home screen. It does not affect ranking, but it completes the identity and is required by audits like Lighthouse. The <code>maskable</code> icon has a safe margin so the system can crop it into a circle or rounded square.</>} /></p>
        <h3>.well-known/security.txt (RFC 9116)</h3>
        <CodeBlock code={`Contact: mailto:contato@arcada.example
Expires: 2027-10-01T00:00:00.000Z
Preferred-Languages: pt-BR, en
Canonical: https://arcada.example/.well-known/security.txt`} />
        <p><T pt={<>Diz a quem achar uma vulnerabilidade para onde reportá-la. Não é SEO, é boa prática de confiança. O campo <code>Expires</code> é obrigatório e <strong>precisa ser renovado antes de vencer</strong>; um arquivo vencido é tratado como obsoleto.</>} en={<>Tells anyone who finds a vulnerability where to report it. It is not SEO, it is a trust best practice. The <code>Expires</code> field is mandatory and <strong>must be renewed before it lapses</strong>; an expired file is treated as stale.</>} /></p>
        <h3>IndexNow</h3>
        <p><T pt={<>IndexNow é um protocolo para <em>avisar</em> os buscadores quando uma URL muda, em vez de esperar o rastreador voltar. Funciona com Bing, Yandex, Seznam e outros; o <strong>Google não o usa</strong>. Você gera uma chave, publica um arquivo <code>/&lt;chave&gt;.txt</code> na raiz contendo a própria chave (prova de que o domínio é seu) e, depois de cada publicação, envia as URLs:</>} en={<>IndexNow is a protocol to <em>notify</em> search engines when a URL changes, instead of waiting for the crawler to return. It works with Bing, Yandex, Seznam and others; <strong>Google does not use it</strong>. You generate a key, publish a file <code>/&lt;key&gt;.txt</code> at the root containing the key itself (proof the domain is yours) and, after each deploy, submit the URLs:</>} /></p>
        <CodeBlock code={`curl -X POST https://api.indexnow.org/indexnow \\
  -H "Content-Type: application/json; charset=utf-8" \\
  -d '{
    "host": "arcada.example",
    "key": "7c1e5a90b2d44f68a3e9d5c07b816f2a",
    "keyLocation": "https://arcada.example/7c1e5a90b2d44f68a3e9d5c07b816f2a.txt",
    "urlList": ["https://arcada.example/", "https://arcada.example/en/"]
  }'`} />
        <p><T pt="Só faz sentido depois de publicar com o domínio real. A chave do exemplo é fictícia; gere a sua." en="It only makes sense after publishing on the real domain. The key in the example is fictional; generate your own." /></p>
      </Section>
      <Section id="validate" title={<T pt="Validar e o que ficou de fora" en="Validating, and what was left out" />}>
        <p><T pt={<>Um bom relatório separa o que foi <strong>verificado</strong> do que <strong>não foi</strong>. No exemplo:</>} en={<>A good report separates what was <strong>verified</strong> from what was <strong>not</strong>. In the example:</>} /></p>
        <Table
          head={[<T pt="Feito" en="Done" />, <T pt="Não feito (exige o site público)" en="Not done (needs the public site)" />]}
          rows={[
            [<T pt="W3C Nu Validator sem erros (páginas principais, 404, links, agradecimento)" en="W3C Nu Validator with no errors (main pages, 404, links, thank-you)" />, "Rich Results Test, validator.schema.org"],
            [<T pt="Lighthouse mobile local: PT 96/100/100/100 e EN 99/100/100/100 (Desempenho, Acessibilidade, Boas práticas, SEO); LCP 1,8 s; CLS 0" en="Local mobile Lighthouse: PT 96/100/100/100 and EN 99/100/100/100 (Performance, Accessibility, Best practices, SEO); LCP 1.8 s; CLS 0" />, <>PageSpeed Insights, <T pt="cabeçalhos e Brotli reais da Cloudflare" en="real Cloudflare headers and Brotli" /></>],
            [<T pt="Sem violações de CSP no console; sem rolagem horizontal em 320 px" en="No CSP violations in the console; no horizontal scroll at 320 px" />, "Facebook Debugger, LinkedIn Post Inspector"],
            [<T pt="5 user agents de busca/IA receberam 200 e o 404 real foi servido (servidor local); JSON-LD válido e coerente com o HTML; 31 testes automáticos passando" en="5 search/AI user agents received 200 and the real 404 was served (local server); JSON-LD valid and consistent with the HTML; 31 automated tests passing" />, <T pt="Painel de bots de IA da Cloudflare; nomes dos user agents na documentação oficial" en="Cloudflare AI-bot dashboard; user-agent names against official documentation" />],
          ]}
        />
        <CodeBlock code={`# Teste rápido de user agents (servidor local ou site real)
curl -sI -A "Googlebot" https://arcada.example/ | head -1
curl -sI -A "ClaudeBot" https://arcada.example/ | head -1
curl -sI https://arcada.example/nao-existe | head -1     # deve ser 404

# O texto está no HTML sem JavaScript?
curl -s https://arcada.example/ | grep -c "landing pages"

# Valida o JSON-LD (extrai o bloco e confere se é JSON)
curl -s https://arcada.example/ \\
  | python3 -c "import sys,re,json; m=re.search(r'application/ld\\+json\\">(.*?)</script>', sys.stdin.read(), re.S); json.loads(m.group(1)); print('ok')"`} />
        <p><T pt={<>Os primeiros testes só mostram que o servidor responde; o que o <strong>Google decide indexar</strong> só aparece no Search Console (relatório "Páginas", ferramenta "Inspeção de URL").</>} en={<>The first tests only show that the server responds; what <strong>Google decides to index</strong> only shows up in Search Console (the "Pages" report, the "URL Inspection" tool).</>} /></p>
      </Section>
      <Section id="plan" title={<T pt="Plano para tornar o site indexável" en="Plan to make a site indexable" />}>
        <p><T pt="Escrever os arquivos é metade do caminho; o resto é publicar com o domínio real e avisar os buscadores. Uma ordem que costuma funcionar:" en="Writing the files is half the way; the rest is publishing on the real domain and telling the search engines. An order that usually works:" /></p>
        <Table
          head={[<T pt="Quando" en="When" />, <T pt="Ação" en="Action" />]}
          rows={[
            [<T pt="Antes de publicar" en="Before publishing" />, <T pt={<>Definir o domínio definitivo e usá-lo em canonical, sitemap, Open Graph e JSON-LD; confirmar que o site não tem <code>noindex</code> esquecido de um ambiente de teste; conferir que o texto está no HTML sem JS; preencher TODOs (e-mail real, perfis para <code>sameAs</code>, WhatsApp)</>} en={<>Define the final domain and use it in canonical, sitemap, Open Graph and JSON-LD; make sure no <code>noindex</code> is left over from a test environment; check the text is in the HTML without JS; fill in the TODOs (real email, profiles for <code>sameAs</code>, WhatsApp)</>} />],
            [<T pt="No dia da publicação" en="On launch day" />, <T pt={<>Verificar o domínio no <strong>Google Search Console</strong> e no <strong>Bing Webmaster Tools</strong> (registro DNS TXT); enviar o <code>sitemap.xml</code>; usar "Inspeção de URL" → "Solicitar indexação" nas páginas principais; rodar o IndexNow</>} en={<>Verify the domain in <strong>Google Search Console</strong> and <strong>Bing Webmaster Tools</strong> (DNS TXT record); submit <code>sitemap.xml</code>; use "URL Inspection" → "Request indexing" on the main pages; run IndexNow</>} />],
            [<T pt="Primeira semana" en="First week" />, <T pt={<>Rodar Rich Results Test, validator.schema.org, PageSpeed Insights e os depuradores de Open Graph; conferir cabeçalhos reais com <code>curl -I</code>; ver no Search Console se há erros de cobertura</>} en={<>Run the Rich Results Test, validator.schema.org, PageSpeed Insights and the Open Graph debuggers; check real headers with <code>curl -I</code>; look for coverage errors in Search Console</>} />],
            [<T pt="Primeiro mês" en="First month" />, <T pt={<>Ganhar links de fora (perfis de empresa, diretórios sérios, parceiros, clientes), o fator que mais move um site novo; criar o <strong>Google Business Profile</strong> se houver atendimento local, com o mesmo nome e descrição do site; publicar os primeiros projetos e depoimentos reais, com permissão</>} en={<>Earn external links (company profiles, serious directories, partners, clients), the factor that moves a new site most; create a <strong>Google Business Profile</strong> if there is local service, with the same name and description as the site; publish the first real projects and testimonials, with permission</>} />],
            [<T pt="Contínuo" en="Ongoing" />, <T pt={<>Renovar o <code>Expires</code> do security.txt; atualizar <code>lastmod</code> e <code>dateModified</code> só quando o conteúdo mudar; rodar o IndexNow após cada publicação; <strong>rotina mensal:</strong> perguntar a ChatGPT, Claude, Perplexity e Gemini "quem cria landing pages?" e registrar se a marca aparece</>} en={<>Renew the security.txt <code>Expires</code>; update <code>lastmod</code> and <code>dateModified</code> only when content changes; run IndexNow after each deploy; <strong>monthly routine:</strong> ask ChatGPT, Claude, Perplexity and Gemini "who builds landing pages?" and record whether the brand shows up</>} />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Quanto tempo leva:</strong> a indexação de um site novo costuma levar de dias a algumas semanas, e a posição para buscas competitivas, meses. Se uma página não entra, as causas mais comuns são: <code>noindex</code> esquecido, bloqueio no robots.txt, canonical apontando para outra URL, conteúdo fino ou duplicado, ou a página não estar ligada a nenhuma outra. O relatório "Páginas" do Search Console diz qual delas é.</>} en={<><strong>How long it takes:</strong> a new site usually takes days to a few weeks to be indexed, and months to rank for competitive searches. If a page does not get in, the most common causes are: a forgotten <code>noindex</code>, a robots.txt block, a canonical pointing to another URL, thin or duplicate content, or the page not being linked from any other. The Search Console "Pages" report says which one it is.</>} /></Callout>
        <h3><T pt="Atividade: auditar o seu site (30 minutos)" en="Activity: audit your site (30 minutes)" /></h3>
        <p><T pt={<><strong>O que fazer:</strong> escolha uma página do seu site e confira, nesta ordem: (1) <code>curl -I</code> devolve 200 e a URL final, sem cadeia de redirecionamentos; (2) o texto principal aparece em <code>curl -s</code> sem JS; (3) title e description são únicos e dentro do tamanho; (4) o canonical aponta para a própria URL; (5) a URL está no sitemap e não está bloqueada no robots.txt; (6) o JSON-LD bate com o que se vê na tela; (7) o link colado no WhatsApp mostra título e imagem. Anote cada falha e corrija na mesma ordem.</>} en={<><strong>What to do:</strong> pick one page of your site and check, in this order: (1) <code>curl -I</code> returns 200 and the final URL, with no redirect chain; (2) the main text shows up in <code>curl -s</code> without JS; (3) title and description are unique and within length; (4) the canonical points to its own URL; (5) the URL is in the sitemap and not blocked in robots.txt; (6) the JSON-LD matches what is on screen; (7) the link pasted into WhatsApp shows title and image. Note each failure and fix in the same order.</>} /></p>
        <p><T pt={<><strong>Resultado esperado:</strong> é comum achar no mínimo um canonical errado, um title duplicado ou um texto que só existe via JavaScript. Corrigir isso costuma pesar mais do que qualquer tag nova.</>} en={<><strong>Expected result:</strong> finding at least one wrong canonical, a duplicate title or text that only exists via JavaScript is common. Fixing that usually weighs more than any new tag.</>} /></p>
      </Section>
      <Section id="cheat-seo" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Arquivo ou tag" en="File or tag" />, <T pt="Papel" en="Role" />, <T pt="Cuidado" en="Watch out" />]}
          rows={[
            ["title + description", <T pt="Aparência nos resultados" en="Look in results" />, <T pt="Únicos por página e idioma" en="Unique per page and language" />],
            ["canonical", <T pt="Escolhe a URL oficial" en="Picks the official URL" />, <T pt="Aponta para si mesmo, nunca para outro idioma" en="Points to itself, never to another language" />],
            ["hreflang", <T pt="Liga idiomas" en="Links languages" />, <T pt={<>Recíproco e com <code>x-default</code></>} en={<>Reciprocal and with <code>x-default</code></>} />],
            ["Open Graph / Twitter", <T pt="Pré-visualização ao compartilhar" en="Preview when sharing" />, <T pt="Imagem 1200×630, URL absoluta" en="1200×630 image, absolute URL" />],
            ["JSON-LD", <T pt="Diz o que a página é" en="Says what the page is" />, <T pt="Só espelha o que está visível" en="Only mirrors what is visible" />],
            ["sitemap.xml", <T pt="Lista o que indexar" en="Lists what to index" />, <T pt={<><code>lastmod</code> real; sem páginas noindex</>} en={<>Real <code>lastmod</code>; no noindex pages</>} />],
            ["robots.txt", <T pt="Quem rastreia o quê" en="Who crawls what" />, <T pt={<>Pedido, não barreira; grupos não herdam <code>*</code></>} en={<>A request, not a barrier; groups do not inherit <code>*</code></>} />],
            ["noindex", <T pt="Tira uma página do índice" en="Removes a page from the index" />, <T pt="Não bloqueie a mesma URL no robots.txt" en="Do not block the same URL in robots.txt" />],
            ["llms.txt", <T pt="Resumo do site para IAs" en="Site summary for AIs" />, <T pt="Não é fator de ranqueamento" en="Not a ranking factor" />],
            ["IndexNow", <T pt="Avisa mudanças" en="Announces changes" />, <T pt="Bing e outros; o Google não usa" en="Bing and others; Google does not use it" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt={<>Por que bloquear <code>/links/</code> no robots.txt e ao mesmo tempo usar <code>noindex</code> nela não funciona?</>} en={<>Why does blocking <code>/links/</code> in robots.txt and also using <code>noindex</code> on it not work?</>} /></li>
          <li><T pt="Qual a diferença entre um bot de busca de IA, um bot de ação do usuário e um de treino, e por que você trataria cada um diferente?" en="What is the difference between an AI search bot, a user-action bot and a training bot, and why would you treat each differently?" /></li>
          <li><T pt="Por que o JSON-LD não deve conter avaliações ou preços que não aparecem na página?" en="Why must JSON-LD not contain reviews or prices that do not appear on the page?" /></li>
          <li><T pt="O que acontece se o canonical da versão em inglês apontar para a versão em português?" en="What happens if the canonical of the English version points to the Portuguese version?" /></li>
          <li><T pt="Por que um texto que só aparece depois de um script pode ser invisível para uma IA?" en="Why can text that only appears after a script be invisible to an AI?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://developers.google.com/search/docs" rel="noopener">Google Search Central: documentation</a> (title links, snippets, canonicalization, localized versions/hreflang, sitemaps, robots.txt, robots meta tag, structured data, FAQ rich results)</li>
          <li><a href="https://schema.org/" rel="noopener">schema.org</a> · <a href="https://json-ld.org/" rel="noopener">JSON-LD</a> · <a href="https://validator.schema.org/" rel="noopener">Schema Markup Validator</a></li>
          <li><a href="https://ogp.me/" rel="noopener">The Open Graph protocol</a> · <a href="https://www.sitemaps.org/protocol.html" rel="noopener">sitemaps.org protocol</a> · <a href="https://www.rfc-editor.org/rfc/rfc9309" rel="noopener">RFC 9309: Robots Exclusion Protocol</a></li>
          <li><a href="https://llmstxt.org/" rel="noopener">llmstxt.org</a> · <a href="https://www.indexnow.org/documentation" rel="noopener">IndexNow documentation</a> · <a href="https://www.rfc-editor.org/rfc/rfc9116" rel="noopener">RFC 9116: security.txt</a></li>
          <li><a href="https://platform.openai.com/docs/bots" rel="noopener">OpenAI crawlers</a> · <a href="https://support.anthropic.com/" rel="noopener">Anthropic crawler documentation</a> · <a href="https://docs.perplexity.ai/guides/bots" rel="noopener">Perplexity crawlers</a> (check each vendor for the current user-agent names)</li>
          <li><a href="https://web.dev/articles/vitals" rel="noopener">web.dev: Core Web Vitals</a> · <a href="https://developers.cloudflare.com/pages/configuration/redirects/" rel="noopener">Cloudflare Pages: redirects</a> and <a href="https://developers.cloudflare.com/pages/configuration/headers/" rel="noopener">headers</a></li>
        </ul>
      </Sources>
    </>
  );
}
