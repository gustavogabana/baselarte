import { Callout, CodeBlock, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "seo-geo",
  title: "SEO e busca por IA: como ser encontrado",
  seo: {
    title: "SEO e busca por IA: meta tags, JSON-LD, robots.txt, llms.txt e como ser indexado",
    description: "Um passo a passo de um setup real de SEO para um site pequeno: meta tags do head, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt para buscadores e rastreadores de IA, llms.txt, noindex, IndexNow e uma lista para o site ser indexado.",
  },
  summary: "um passeio por uma configuração completa de SEO e GEO para um site pequeno e bilíngue: tags do head (title, description, robots, canonical), Open Graph e Twitter Cards, hreflang, JSON-LD (Organization, WebSite, WebPage, Service, FAQPage), sitemap.xml, robots.txt para robôs de busca, de respostas de IA e de treinamento, llms.txt e llms-full.txt, páginas noindex, conteúdo que uma IA consegue ler, redirecionamentos, headers de segurança e cache, IndexNow, validação e um plano para tornar um site indexável.",
  kicker: "Guia prático",
  heroTitle: <>SEO e busca por IA: <em>como um site pequeno é encontrado e citado.</em></>,
  heroLede: "Um passo a passo de um setup real para o site de uma pequena empresa: as meta tags do head, Open Graph, hreflang, JSON-LD, sitemap.xml, robots.txt para buscadores e rastreadores de IA, llms.txt, páginas noindex e uma lista para tornar o site indexável.",
  published: "2026-10-28",
  updated: "2026-10-28",
  toc: [
    {
      items: [
        { id: "what", title: "SEO, GEO e o exemplo usado aqui" },
        { id: "pipeline", title: "Como uma página chega ao índice" },
        { id: "head", title: "Tags do <head>" },
        { id: "social", title: "Open Graph e Twitter Cards" },
        { id: "hreflang", title: "Dois idiomas: hreflang" },
        { id: "jsonld", title: "Dados estruturados: JSON-LD" },
        { id: "sitemap", title: "sitemap.xml" },
        { id: "robots", title: "robots.txt e rastreadores de IA" },
        { id: "llms", title: "llms.txt e llms-full.txt" },
        { id: "noindex", title: "Páginas noindex" },
        { id: "html", title: "HTML e conteúdo que a IA consegue ler" },
        { id: "hosting", title: "Redirecionamentos, cabeçalhos e cache" },
        { id: "extras", title: "manifest, security.txt e IndexNow" },
        { id: "validate", title: "Validar e o que ficou de fora" },
        { id: "plan", title: "Plano para tornar o site indexável" },
        { id: "cheat-seo", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"SEO, GEO e o exemplo usado aqui"}>
        <p><strong>SEO</strong> (otimização para mecanismos de busca) é tornar o site fácil de rastrear, entender e exibir no Google, Bing e similares. <strong>GEO</strong> (otimização para mecanismos generativos) é o mesmo esforço para que ChatGPT, Claude, Perplexity e Gemini consigam ler o site e citá-lo ao responder.</p>
        <p>As duas coisas se apoiam no mesmo alicerce: HTML claro, URLs estáveis, dados estruturados e permissão explícita para os rastreadores.</p>
        <p>O exemplo desta nota é o setup de SEO de um site fictício, a <strong>Arcada Software</strong> (landing pages e sites institucionais), em português e inglês, hospedado na Cloudflare Pages. O domínio <code>arcada.example</code> é reservado para exemplos e não existe de verdade; troque pelo seu. Cada seção mostra o arquivo, explica cada linha e diz o que ele <em>não</em> faz.</p>
        <Callout tone="warn" icon="alert"><strong>Sem garantia de posição:</strong> nenhuma tag faz o site subir ao topo. Elas tiram obstáculos (página que o rastreador não acha, duplicada ou mal interpretada). Quem decide a posição é a relevância e a qualidade do conteúdo, e o tempo.</Callout>
      </Section>
      <Section id="pipeline" title={"Como uma página chega ao índice"}>
        <p>Um buscador faz quatro coisas em sequência, e cada arquivo desta nota atua em uma delas:</p>
        <Table
          head={["Etapa", "O que acontece", "O que você controla"]}
          rows={[
            ["1. Descobrir", "O rastreador acha a URL por links, sitemap ou aviso direto", <>sitemap.xml, IndexNow, links internos</>],
            ["2. Rastrear", "Baixa a página, se o robots.txt permitir", <>robots.txt, status HTTP, redirecionamentos</>],
            ["3. Indexar", "Entende o conteúdo, escolhe a URL canônica e decide se guarda", "title, description, canonical, noindex, JSON-LD, hreflang"],
            ["4. Exibir", "Ordena os resultados e monta o trecho exibido", "Conteúdo, velocidade, max-snippet, Open Graph"],
          ]}
        />
        <p>Daí sai uma regra importante: <strong>o rastreador precisa conseguir ler a página para obedecer a ela</strong>. Por isso um <code>noindex</code> funciona se a página for rastreável, e deixa de funcionar se o robots.txt a bloquear (veja <a href="#noindex">noindex</a>).</p>
      </Section>
      <Section id="head" title={<>{"Tags do <head>"}</>}>
        <p>Este é o <code>&lt;head&gt;</code> da página em português. A versão em inglês (<code>/en/</code>) espelha tudo com <code>lang="en"</code>, textos equivalentes (não tradução seca) e canonical <code>/en/</code>.</p>
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
          head={["Tag", "Para que serve"]}
          rows={[
            [<><code>charset</code>, <code>viewport</code></>, "Codificação correta dos acentos e layout de celular. Sem o viewport, o Google trata a página como não otimizada para mobile."],
            [<code>&lt;title&gt;</code>, <>O título azul nos resultados. Cerca de 50 a 60 caracteres, marca + proposta, <strong>único por página e por idioma</strong>. É o sinal on-page mais forte.</>],
            [<code>meta description</code>, "A frase sob o título. 120 a 155 caracteres, escrita para humanos. Não é fator de ranqueamento, mas o Google a usa como trecho e ela influencia o clique."],
            [<code>meta robots</code>, <><code>index, follow</code> é o padrão (explicitar não faz mal). <code>max-snippet:-1</code>, <code>max-image-preview:large</code> e <code>max-video-preview:-1</code> removem o limite de trecho, para que o buscador possa mostrar e citar mais texto.</>],
            [<code>canonical</code>, <>A URL oficial da página, <strong>autorreferente</strong> (aponta para si mesma), absoluta e sem parâmetros. Evita que <code>/?utm=x</code>, <code>/index.html</code> e <code>/</code> sejam tratadas como três páginas duplicadas.</>],
            [<>manifest, icons, <code>theme-color</code></>, <>Identidade em abas, atalhos de celular e barra do navegador. O <code>favicon.ico</code> na raiz também é o que o Google exibe ao lado do resultado.</>],
            [<><code>preload</code> da fonte</>, <>Faz o navegador baixar a fonte do título cedo, acelerando a pintura do <code>h1</code> (métrica LCP). <code>crossorigin</code> é obrigatório para fontes, mesmo do mesmo domínio.</>],
            [<code>?v=hash</code>, "O build troca o hash quando o CSS/JS muda, o que permite cache imutável de um ano sem servir arquivo velho."],
          ]}
        />
        <Callout icon="check"><strong>Não existe <code>meta keywords</code>:</strong> o Google e o Bing ignoram a tag há anos. Adicioná-la só entrega a lista de termos aos concorrentes.</Callout>
      </Section>
      <Section id="social" title={"Open Graph e Twitter Cards"}>
        <p>Open Graph (<code>og:*</code>) controla a pré-visualização quando alguém cola o link no WhatsApp, LinkedIn, Facebook, Slack ou iMessage. Os Twitter Cards fazem o mesmo no X. Não ajudam no ranking, mas decidem se o link compartilhado parece confiável.</p>
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
          <li><code>og:image</code> em <strong>1200×630</strong> px (proporção 1,91:1), URL <strong>absoluta</strong> e hospedada no próprio site (aqui em <code>/og/</code>), uma por idioma. Largura e altura declaradas evitam que a primeira partilha saia sem imagem enquanto a rede baixa o arquivo.</li>
          <li><code>og:locale</code> e <code>og:locale:alternate</code> usam o formato <code>pt_BR</code> (com sublinhado), diferente do <code>hreflang</code>, que usa <code>pt-BR</code> (com hífen).</li>
          <li><code>twitter:card = summary_large_image</code> reaproveita a mesma imagem. O X também lê <code>og:*</code> quando faltam as tags próprias.</li>
          <li><code>twitter:site</code> e <code>twitter:creator</code> só entram com um perfil real. Por isso ficou um <code>TODO</code> no código em vez de um @ inventado.</li>
          <li>Depois de mudar a imagem, o WhatsApp e o Facebook guardam a antiga em cache; use o Facebook Sharing Debugger ou o LinkedIn Post Inspector para forçar a atualização.</li>
        </ul>
      </Section>
      <Section id="hreflang" title={"Dois idiomas: hreflang"}>
        <CodeBlock code={`<link rel="alternate" hreflang="pt-BR" href="https://arcada.example/">
<link rel="alternate" hreflang="en" href="https://arcada.example/en/">
<link rel="alternate" hreflang="x-default" href="https://arcada.example/">`} />
        <p><code>hreflang</code> diz ao buscador que as duas URLs são o mesmo conteúdo em idiomas diferentes, para mostrar a versão certa a cada pessoa em vez de tratá-las como duplicatas. Regras que costumam dar erro:</p>
        <ul className="ds-list">
          <li><strong>Recíproco:</strong> a página PT lista a EN <em>e</em> a EN lista a PT. Sem a volta, o Google ignora o par.</li>
          <li><strong>Inclua a própria página</strong> na lista (a PT lista <code>pt-BR</code> apontando para si).</li>
          <li><code>x-default</code> é a versão para quem não casa com nenhum idioma listado; aqui, o português.</li>
          <li>O canonical de cada versão aponta para <strong>ela mesma</strong>, nunca para a outra. Apontar o canonical da EN para a PT diria ao Google que a EN é cópia e a tiraria do índice.</li>
          <li>Os mesmos três links aparecem também no sitemap (veja abaixo); basta manter um dos dois lugares coerente com o outro.</li>
        </ul>
      </Section>
      <Section id="jsonld" title={"Dados estruturados: JSON-LD"}>
        <p>O HTML descreve como a página <em>aparece</em>; o JSON-LD descreve <em>o que ela é</em> em um vocabulário que máquinas entendem (schema.org). Fica num bloco <code>&lt;script type="application/ld+json"&gt;</code>, e como é dado, não executa nada e não precisa de exceção na CSP. Um bloco só, com <code>@graph</code>, liga as entidades por <code>@id</code>:</p>
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
        <p>O bloco acima está abreviado: o real tem <strong>três</strong> <code>Service</code> (Landing page, Site institucional, Pequenos projetos web) e <strong>oito</strong> perguntas no <code>FAQPage</code>. A versão em inglês tem a mesma estrutura, com textos e <code>inLanguage</code> em inglês.</p>
        <Table
          head={["Tipo", "O que declara"]}
          rows={[
            [<code>Organization</code>, <>Quem é a empresa: nome, logo (512×512), e-mail, idiomas, temas (<code>knowsAbout</code>). É o que ajuda o buscador e as IAs a reconhecer a marca como uma entidade. <code>sameAs</code> (perfis em redes) só entra com perfis reais; hoje está omitido.</>],
            [<><code>WebSite</code>, <code>WebPage</code></>, <>O site e a página, com <code>inLanguage</code> e <code>dateModified</code> real (a data da última mudança de conteúdo, não a de hoje).</>],
            [<code>Service</code>, <>Cada serviço, igual à tabela visível. <strong>Sem preço</strong>, porque o dono não confirmou nenhum.</>],
            [<code>FAQPage</code>, "Exatamente as mesmas 8 perguntas e respostas do FAQ visível (gerado da mesma fonte de dados), com 40 a 60 palavras cada: curtas o bastante para serem citadas, longas o bastante para fazerem sentido sozinhas."],
          ]}
        />
        <Callout tone="warn" icon="alert"><strong>A regra de ouro:</strong> o JSON-LD só pode espelhar o que está <em>visível</em> na página. Não use <code>AggregateRating</code>, <code>Review</code>, <code>LocalBusiness</code>, <code>Product</code>, <code>HowTo</code> nem <code>Speakable</code> se não houver esses dados na tela. Marcar avaliações que não existem viola as diretrizes do Google e pode render uma ação manual contra o site.</Callout>
        <Callout icon="check"><strong>Expectativa realista sobre o FAQ:</strong> desde 2023 o Google só exibe o resultado rico de FAQ para sites governamentais e de saúde muito conhecidos. Para um site pequeno o <code>FAQPage</code> <em>não</em> vira o acordeão nos resultados, mas continua sendo uma forma limpa e legível por máquina de entregar perguntas e respostas a buscadores e IAs. Confira o estado atual na documentação do Google antes de prometer o contrário.</Callout>
        <ul className="ds-list">
          <li>Os <code>@id</code> são identificadores, não precisam abrir nada; o <code>#org</code> é reaproveitado pelo <code>WebSite</code> (<code>publisher</code>), <code>WebPage</code> (<code>about</code>) e cada <code>Service</code> (<code>provider</code>). Assim a empresa é descrita uma vez e referenciada.</li>
          <li>Mantenha os dados e o HTML saindo da <strong>mesma fonte</strong> (um arquivo de dados que gera as duas coisas) para que nunca divirjam.</li>
          <li>Valide em <em>Rich Results Test</em> e em <em>validator.schema.org</em> depois que o site estiver num domínio público (eles precisam acessar a URL, ou aceitam o código colado).</li>
        </ul>
      </Section>
      <Section id="sitemap" title={"sitemap.xml"}>
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
          <li>É a <strong>lista de URLs que você quer indexadas</strong>, não de todas as que existem. Aqui: <code>/</code> e <code>/en/</code>. Ficam de fora <code>/links/</code>, <code>/404.html</code>, <code>/api/</code> e as páginas de agradecimento. Um sitemap que lista páginas <code>noindex</code> ou que redirecionam envia sinais contraditórios.</li>
          <li>Todas as URLs são <strong>absolutas</strong>, no mesmo protocolo, domínio e padrão de barra final do canonical (aqui, sempre com barra).</li>
          <li><code>lastmod</code> é a data <strong>real</strong> da última mudança de conteúdo. Atualizá-la todo dia sem mudança faz o Google desconfiar e passar a ignorar o campo.</li>
          <li><code>priority</code> e <code>changefreq</code> não são usados: o Google os ignora.</li>
          <li>O <code>xhtml:link</code> repete o hreflang para cada versão, incluindo ela mesma. É uma alternativa (ou reforço) às tags do <code>&lt;head&gt;</code>.</li>
          <li>Limite de um sitemap: 50.000 URLs ou 50 MB sem compressão. Acima disso, divida e use um índice de sitemaps.</li>
          <li>Anuncie o sitemap na última linha do <code>robots.txt</code> e envie no Google Search Console e no Bing Webmaster Tools.</li>
        </ul>
      </Section>
      <Section id="robots" title={"robots.txt e rastreadores de IA"}>
        <p>O <code>robots.txt</code> fica na raiz (<code>/robots.txt</code>) e diz a cada rastreador o que ele pode buscar. É um <strong>pedido de boa-fé, não uma barreira</strong>: bots de bem obedecem; bots maliciosos ignoram. Nunca use o robots.txt para esconder algo secreto (ele próprio é público) e nunca para proteger dados: para isso use autenticação.</p>
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
        <p>Há três famílias de bots de IA, e a decisão de liberar ou bloquear é diferente para cada uma:</p>
        <Table
          head={["Tipo", "Exemplos", "Para que serve", "Decisão do exemplo"]}
          rows={[
            ["Busca e resposta", "OAI-SearchBot, Claude-SearchBot, PerplexityBot, Applebot", "Indexa o site para o assistente poder encontrá-lo e citá-lo com link", "Liberado. Bloquear tira o site das respostas"],
            ["Ação do usuário", "ChatGPT-User, Claude-User, Perplexity-User", "Busca a página na hora, porque uma pessoa pediu ao assistente para abri-la", "Liberado"],
            ["Treino de modelos", "GPTBot, ClaudeBot, Google-Extended, Applebot-Extended", "Coleta texto para treinar modelos futuros. Não afeta a busca comum", <>Liberado por padrão; o dono pode trocar <code>Allow</code> por <code>Disallow</code></>],
          ]}
        />
        <ul className="ds-list">
          <li><strong>Grupos específicos não herdam o <code>*</code>.</strong> Quando um bot encontra um grupo com o seu nome, ele usa só aquele grupo e ignora o <code>User-agent: *</code>. Por isso o <code>Disallow: /api/</code> é repetido em cada grupo; esquecer isso abriria <code>/api/</code> para os bots de IA.</li>
          <li><code>Google-Extended</code> e <code>Applebot-Extended</code> não são rastreadores separados: são <em>tokens</em> que controlam se o conteúdo já rastreado pelo Googlebot/Applebot pode ser usado para treino. Bloqueá-los não tira o site da busca.</li>
          <li>Liberar ou bloquear o treino é uma <strong>decisão de negócio</strong> (direitos sobre o conteúdo, visibilidade futura), não técnica. Não há resposta certa; o importante é decidir de propósito.</li>
          <li>Os nomes dos user agents mudam e novos aparecem. Confira cada nome na documentação oficial do fornecedor antes de publicar; a lista deste exemplo não foi reconferida.</li>
          <li><strong>Não bloqueie CSS, JS ou imagens</strong> que a página usa para renderizar: o Google precisa delas para entender o layout.</li>
        </ul>
      </Section>
      <Section id="llms" title={"llms.txt e llms-full.txt"}>
        <p>O <code>llms.txt</code> (proposta em llmstxt.org) é um arquivo em Markdown na raiz que resume o site para modelos de linguagem: um título, uma citação com a descrição, e seções de links com uma linha explicando cada um.</p>
        <p>A ideia é entregar a uma IA o mapa do site sem que ela precise ler HTML cheio de menus e scripts. O <code>llms-full.txt</code> é a versão completa, com todo o conteúdo visível em Markdown, em português e inglês.</p>
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
        <p>O <code>llms-full.txt</code> repete o conteúdo visível em Markdown puro: a tabela de serviços, "para quem é e para quem não é", o processo em cinco passos, as 8 perguntas e respostas, o contato e a data de atualização. Abaixo, um trecho:</p>
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
        <Callout tone="warn" icon="alert"><strong>Honestidade sobre o llms.txt:</strong> o Google diz que não usa o arquivo; Anthropic e Perplexity dizem ler, sem confirmação independente do efeito. Custa pouco e não faz mal, mas <strong>não é fator de ranqueamento</strong> e ninguém deve contar com ele para aparecer em respostas de IA. O que mais pesa continua sendo o conteúdo claro no HTML.</Callout>
        <Callout icon="check"><strong>E o "agents.llm"?</strong> Esse nome não existe como padrão; o arquivo do exemplo é o <code>llms.txt</code>. Não confunda com o <code>AGENTS.md</code>, que é outra coisa: instruções para <em>agentes de código</em> (Claude Code, Codex, Cursor) dentro de um repositório, e não ajuda em SEO. Para controlar quais bots de IA entram no site, o arquivo é o <code>robots.txt</code>. Veja a nota de agent harness para o <code>AGENTS.md</code>.</Callout>
      </Section>
      <Section id="noindex" title={"Páginas noindex"}>
        <CodeBlock code={`<meta name="robots" content="noindex, follow">   <!-- /links/, obrigado.html, en/thanks.html -->
<meta name="robots" content="noindex">           <!-- 404.html -->`} />
        <p>Nem toda página deve aparecer no Google. A página de bio (<code>/links/</code>), a de erro 404 e as de agradecimento (que só fazem sentido depois de um formulário) usam <code>noindex</code>. As duas primeiras ficam fora do sitemap.</p>
        <Callout tone="warn" icon="alert"><strong>noindex e Disallow se anulam.</strong> Se você bloqueia <code>/links/</code> no robots.txt, o rastreador não baixa a página, nunca vê o <code>noindex</code>, e a URL ainda pode aparecer nos resultados (sem descrição) por causa de links externos. Para tirar uma página do índice: <strong>permita o rastreamento e use <code>noindex</code></strong>. Use <code>Disallow</code> só para poupar o servidor de trechos sem valor, como <code>/api/</code>.</Callout>
        <ul className="ds-list">
          <li><code>follow</code> deixa o rastreador seguir os links da página mesmo sem indexá-la.</li>
          <li>O 404 precisa responder com o <strong>status HTTP 404</strong> de verdade (não 200 com a mensagem "não encontrado", o chamado soft 404).</li>
        </ul>
      </Section>
      <Section id="html" title={"HTML e conteúdo que a IA consegue ler"}>
        <p>Meta tags e dados estruturados só ajudam se a página em si for boa de ler. As regras aplicadas no exemplo:</p>
        <ul className="ds-list">
          <li><strong>Um <code>h1</code> por página</strong>, e <code>h2</code> com <code>id</code> estáveis (<code>servicos</code>, <code>para-quem</code>, <code>processo</code>, <code>projetos</code>, <code>sobre</code>, <code>faq</code>, <code>contato</code>). Âncoras estáveis permitem links diretos para a seção, usados no <code>llms.txt</code> e nos resultados.</li>
          <li><strong>Marcos semânticos</strong> (<code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>), link "Ir para o conteúdo" e <strong>texto de link descritivo</strong> ("Pedir orçamento", não "clique aqui").</li>
          <li><strong>A primeira frase visível define a empresa</strong>: "A Arcada Software cria landing pages, sites institucionais e pequenos projetos web para negócios que querem uma presença online clara, com escopo, prazo e preço fechados antes de começar." Um modelo que leia só o começo já sabe quem é e o que faz.</li>
          <li>Formatos fáceis de extrair: <strong>tabela HTML</strong> de serviços, "para quem é / não é", processo em <code>&lt;ol&gt;</code>, FAQ em <code>&lt;details&gt;&lt;summary&gt;</code> (nativo, sem JavaScript), seção de provas honesta (sem casos inventados) e "Atualizado em" no rodapé.</li>
          <li><strong>Todo o conteúdo existe no HTML sem JavaScript.</strong> Muitos rastreadores de IA não executam JS; se o texto só aparece depois de um script, para eles a página está vazia. Teste com <code>curl https://seu-site/ | less</code> e veja se o texto está lá.</li>
          <li>Fontes hospedadas localmente (WOFF2), um CSS só, JS apenas para tema, formulário e eventos (<code>defer</code>). Menos requisições, página mais rápida.</li>
          <li><strong>Medição sem cookies</strong> (Plausible, Cloudflare Web Analytics ou PostHog), com eventos por atributo <code>data-evento</code> (<code>pedir-orcamento</code>, <code>enviar-formulario</code>, <code>whatsapp</code>). Sem banner de cookies e sem script pesado.</li>
        </ul>
        <p>Velocidade também conta: o Google mede <em>Core Web Vitals</em> (LCP, INP, CLS). O exemplo mira LCP abaixo de 2,5 s e CLS próximo de 0, o que o preload da fonte, o CSS único e a ausência de scripts bloqueantes ajudam a alcançar.</p>
      </Section>
      <Section id="hosting" title={"Redirecionamentos, cabeçalhos e cache"}>
        <p>Duas URLs para a mesma página diluem o sinal. O arquivo <code>_redirects</code> da Cloudflare Pages unifica tudo numa forma só (<strong>sempre com barra final</strong>, igual ao canonical e ao sitemap):</p>
        <CodeBlock code={`# Padrão do site: sempre COM barra final (canonical, sitemap e links).
https://www.arcada.example/* https://arcada.example/:splat 301
/index.html / 301
/en/index.html /en/ 301
/en /en/ 301
/links /links/ 301`} />
        <p>O <code>301</code> é o redirecionamento permanente, e o buscador transfere o sinal para o destino. Aqui o <code>www</code> vai para o domínio sem <code>www</code> e <code>/index.html</code> vai para <code>/</code>. Escolha uma forma (com ou sem <code>www</code>) e mantenha-a em todos os lugares.</p>
        <p>O arquivo <code>_headers</code> define segurança e cache. A segurança importa para SEO indiretamente (HTTPS é sinal de confiança e site invadido é desindexado); o cache importa para velocidade:</p>
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
          <li><strong>CSP estrita</strong> (sem <code>unsafe-inline</code>): como o JSON-LD é dado e não script executável, não precisa de exceção. Se ligar uma medição como o Plausible, acrescente o domínio do script em <code>script-src</code> e <code>connect-src</code>. Detalhes na nota de apps web seguros.</li>
          <li><strong>HTML sempre revalidado</strong> (<code>max-age=0, must-revalidate</code>): uma mudança de texto aparece na hora. <strong>CSS, JS e fontes imutáveis por um ano</strong>, porque o nome do arquivo muda (<code>?v=hash</code>) quando o conteúdo muda.</li>
          <li>A compressão Brotli vem da Cloudflare e deve ser conferida no site real (<code>curl -I -H "Accept-Encoding: br" ...</code>).</li>
        </ul>
      </Section>
      <Section id="extras" title={"manifest, security.txt e IndexNow"}>
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
        <p>Nome, ícones, cores e <code>start_url</code> para quando alguém adiciona o site à tela inicial do celular. Não afeta o ranking, mas completa a identidade e é exigido por auditorias como o Lighthouse. O ícone <code>maskable</code> tem margem de segurança para o sistema recortá-lo em círculo ou quadrado arredondado.</p>
        <h3>.well-known/security.txt (RFC 9116)</h3>
        <CodeBlock code={`Contact: mailto:contato@arcada.example
Expires: 2027-10-01T00:00:00.000Z
Preferred-Languages: pt-BR, en
Canonical: https://arcada.example/.well-known/security.txt`} />
        <p>Diz a quem achar uma vulnerabilidade para onde reportá-la. Não é SEO, é boa prática de confiança. O campo <code>Expires</code> é obrigatório e <strong>precisa ser renovado antes de vencer</strong>; um arquivo vencido é tratado como obsoleto.</p>
        <h3>IndexNow</h3>
        <p>IndexNow é um protocolo para <em>avisar</em> os buscadores quando uma URL muda, em vez de esperar o rastreador voltar. Funciona com Bing, Yandex, Seznam e outros; o <strong>Google não o usa</strong>. Você gera uma chave, publica um arquivo <code>/&lt;chave&gt;.txt</code> na raiz contendo a própria chave (prova de que o domínio é seu) e, depois de cada publicação, envia as URLs:</p>
        <CodeBlock code={`curl -X POST https://api.indexnow.org/indexnow \\
  -H "Content-Type: application/json; charset=utf-8" \\
  -d '{
    "host": "arcada.example",
    "key": "7c1e5a90b2d44f68a3e9d5c07b816f2a",
    "keyLocation": "https://arcada.example/7c1e5a90b2d44f68a3e9d5c07b816f2a.txt",
    "urlList": ["https://arcada.example/", "https://arcada.example/en/"]
  }'`} />
        <p>Só faz sentido depois de publicar com o domínio real. A chave do exemplo é fictícia; gere a sua.</p>
      </Section>
      <Section id="validate" title={"Validar e o que ficou de fora"}>
        <p>Um bom relatório separa o que foi <strong>verificado</strong> do que <strong>não foi</strong>. No exemplo:</p>
        <Table
          head={["Feito", "Não feito (exige o site público)"]}
          rows={[
            ["W3C Nu Validator sem erros (páginas principais, 404, links, agradecimento)", "Rich Results Test, validator.schema.org"],
            ["Lighthouse mobile local: PT 96/100/100/100 e EN 99/100/100/100 (Desempenho, Acessibilidade, Boas práticas, SEO); LCP 1,8 s; CLS 0", <>PageSpeed Insights, cabeçalhos e Brotli reais da Cloudflare</>],
            ["Sem violações de CSP no console; sem rolagem horizontal em 320 px", "Facebook Debugger, LinkedIn Post Inspector"],
            ["5 user agents de busca/IA receberam 200 e o 404 real foi servido (servidor local); JSON-LD válido e coerente com o HTML; 31 testes automáticos passando", "Painel de bots de IA da Cloudflare; nomes dos user agents na documentação oficial"],
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
        <p>Os primeiros testes só mostram que o servidor responde; o que o <strong>Google decide indexar</strong> só aparece no Search Console (relatório "Páginas", ferramenta "Inspeção de URL").</p>
      </Section>
      <Section id="plan" title={"Plano para tornar o site indexável"}>
        <p>Escrever os arquivos é metade do caminho; o resto é publicar com o domínio real e avisar os buscadores. Uma ordem que costuma funcionar:</p>
        <Table
          head={["Quando", "Ação"]}
          rows={[
            ["Antes de publicar", <>Definir o domínio definitivo e usá-lo em canonical, sitemap, Open Graph e JSON-LD; confirmar que o site não tem <code>noindex</code> esquecido de um ambiente de teste; conferir que o texto está no HTML sem JS; preencher TODOs (e-mail real, perfis para <code>sameAs</code>, WhatsApp)</>],
            ["No dia da publicação", <>Verificar o domínio no <strong>Google Search Console</strong> e no <strong>Bing Webmaster Tools</strong> (registro DNS TXT); enviar o <code>sitemap.xml</code>; usar "Inspeção de URL" → "Solicitar indexação" nas páginas principais; rodar o IndexNow</>],
            ["Primeira semana", <>Rodar Rich Results Test, validator.schema.org, PageSpeed Insights e os depuradores de Open Graph; conferir cabeçalhos reais com <code>curl -I</code>; ver no Search Console se há erros de cobertura</>],
            ["Primeiro mês", <>Ganhar links de fora (perfis de empresa, diretórios sérios, parceiros, clientes), o fator que mais move um site novo; criar o <strong>Google Business Profile</strong> se houver atendimento local, com o mesmo nome e descrição do site; publicar os primeiros projetos e depoimentos reais, com permissão</>],
            ["Contínuo", <>Renovar o <code>Expires</code> do security.txt; atualizar <code>lastmod</code> e <code>dateModified</code> só quando o conteúdo mudar; rodar o IndexNow após cada publicação; <strong>rotina mensal:</strong> perguntar a ChatGPT, Claude, Perplexity e Gemini "quem cria landing pages?" e registrar se a marca aparece</>],
          ]}
        />
        <Callout icon="check"><strong>Quanto tempo leva:</strong> a indexação de um site novo costuma levar de dias a algumas semanas, e a posição para buscas competitivas, meses. Se uma página não entra, as causas mais comuns são: <code>noindex</code> esquecido, bloqueio no robots.txt, canonical apontando para outra URL, conteúdo fino ou duplicado, ou a página não estar ligada a nenhuma outra. O relatório "Páginas" do Search Console diz qual delas é.</Callout>
        <h3>Atividade: auditar o seu site (30 minutos)</h3>
        <p><strong>O que fazer:</strong> escolha uma página do seu site e confira, nesta ordem: (1) <code>curl -I</code> devolve 200 e a URL final, sem cadeia de redirecionamentos; (2) o texto principal aparece em <code>curl -s</code> sem JS; (3) title e description são únicos e dentro do tamanho; (4) o canonical aponta para a própria URL; (5) a URL está no sitemap e não está bloqueada no robots.txt; (6) o JSON-LD bate com o que se vê na tela; (7) o link colado no WhatsApp mostra título e imagem. Anote cada falha e corrija na mesma ordem.</p>
        <p><strong>Resultado esperado:</strong> é comum achar no mínimo um canonical errado, um title duplicado ou um texto que só existe via JavaScript. Corrigir isso costuma pesar mais do que qualquer tag nova.</p>
      </Section>
      <Section id="cheat-seo" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Arquivo ou tag", "Papel", "Cuidado"]}
          rows={[
            ["title + description", "Aparência nos resultados", "Únicos por página e idioma"],
            ["canonical", "Escolhe a URL oficial", "Aponta para si mesmo, nunca para outro idioma"],
            ["hreflang", "Liga idiomas", <>Recíproco e com <code>x-default</code></>],
            ["Open Graph / Twitter", "Pré-visualização ao compartilhar", "Imagem 1200×630, URL absoluta"],
            ["JSON-LD", "Diz o que a página é", "Só espelha o que está visível"],
            ["sitemap.xml", "Lista o que indexar", <><code>lastmod</code> real; sem páginas noindex</>],
            ["robots.txt", "Quem rastreia o quê", <>Pedido, não barreira; grupos não herdam <code>*</code></>],
            ["noindex", "Tira uma página do índice", "Não bloqueie a mesma URL no robots.txt"],
            ["llms.txt", "Resumo do site para IAs", "Não é fator de ranqueamento"],
            ["IndexNow", "Avisa mudanças", "Bing e outros; o Google não usa"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <ul>
          <li>Por que bloquear <code>/links/</code> no robots.txt e ao mesmo tempo usar <code>noindex</code> nela não funciona?</li>
          <li>Qual a diferença entre um bot de busca de IA, um bot de ação do usuário e um de treino, e por que você trataria cada um diferente?</li>
          <li>Por que o JSON-LD não deve conter avaliações ou preços que não aparecem na página?</li>
          <li>O que acontece se o canonical da versão em inglês apontar para a versão em português?</li>
          <li>Por que um texto que só aparece depois de um script pode ser invisível para uma IA?</li>
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
