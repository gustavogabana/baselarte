import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "agency-hosting-handover",
  title: { en: "Agency hosting and client handover: Cloudflare, Netlify, Vercel and what to deliver", pt: "Hospedagem e entrega para agências: Cloudflare, Netlify, Vercel e o que entregar ao cliente" },
  seo: {
    title: { en: "Agency hosting and client handover: Cloudflare, Netlify, Vercel and what to deliver", pt: "Hospedagem e entrega para agências: Cloudflare, Netlify, Vercel e o que entregar ao cliente" },
    description: { en: "How an agency building landing pages, company websites and small web projects picks a default stack and host per project type (Cloudflare Pages, Netlify, Vercel, GitHub Pages), runs previews and deploys, decides who owns the accounts, and what to hand over to the client after delivery: domain, code, access, DNS, README, analytics, privacy and a go-live checklist.", pt: "Como uma agência que faz landing pages, sites institucionais e pequenos projetos web escolhe stack e hospedagem padrão por tipo de projeto (Cloudflare Pages, Netlify, Vercel, GitHub Pages), trabalha com previews e deploys, decide de quem são as contas e o que entregar ao cliente depois do projeto: domínio, código, acessos, DNS, README, analytics, privacidade e um checklist de go-live." },
  },
  summary: "a default stack and host per project type for agencies (landing pages, company websites, blogs, small apps), how Cloudflare Pages, Netlify, Vercel and GitHub Pages compare for agency work (previews, forms, commercial use, transfers), the preview-approve-merge workflow, forms/CMS/analytics, client-owned versus agency-managed accounts, the handover package (domain, code, hosting, DNS, credentials, README, editor guide, analytics, privacy, acceptance) and a go-live checklist.",
  kicker: { en: "Agency playbook", pt: "Guia da agência" },
  heroTitle: { en: <>The site going live <em>is not the whole delivery.</em></>, pt: <>O site no ar <em>não é a entrega inteira.</em></> },
  heroLede: { en: "Which hosting an agency should standardise on for landing pages, company websites and small apps, how to run previews and deploys, who should own each account, and the handover package that lets the client carry on without you.", pt: "Qual hospedagem uma agência deve padronizar para landing pages, sites institucionais e pequenos apps, como trabalhar com previews e deploys, de quem deve ser cada conta, e o pacote de entrega que deixa o cliente seguir sem você." },
  published: "2026-11-02",
  updated: "2026-11-02",
  toc: [
    {
      items: [
        { id: "stack", title: <T pt="Uma stack padrão por tipo de projeto" en="One default stack per project type" /> },
        { id: "workflow", title: <T pt="O fluxo de trabalho" en="The workflow" /> },
        { id: "ownership", title: <T pt="De quem são as contas" en="Who owns the accounts" /> },
        { id: "handover", title: <T pt="O que entregar ao cliente" en="What to hand over to the client" /> },
        { id: "golive", title: <T pt="Checklist de go-live" en="Go-live checklist" /> },
        { id: "cheat-agy", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="stack" title={<T pt="Uma stack padrão por tipo de projeto" en="One default stack per project type" />}>
        <p><T pt={<>Uma agência pequena ganha dinheiro repetindo o que já sabe fazer bem. Escolher a hospedagem do zero a cada cliente custa horas e gera um parque de projetos diferentes entre si, cada um com o seu jeito de publicar, de quebrar e de ser consertado. O melhor é ter <strong>um padrão por tipo de projeto</strong> e só sair dele com motivo.</>} en={<>A small agency makes money by repeating what it already does well. Picking hosting from scratch for every client costs hours and leaves a fleet of projects that are all different: each one deploys, breaks and gets fixed its own way. Better to have <strong>one default per project type</strong> and only leave it for a reason.</>} /></p>
        <Table
          head={[<T pt="Tipo de projeto" en="Project type" />, <T pt="Stack sugerida" en="Suggested stack" />, <T pt="Hospedagem padrão" en="Default hosting" />]}
          rows={[
            [<T pt="Landing page" en="Landing page" />, <T pt="HTML/CSS ou Astro, formulário por serviço externo" en="HTML/CSS or Astro, form through an external service" />, "Cloudflare Pages"],
            [<T pt="Site institucional" en="Company website" />, <T pt="Astro ou Next.js estático + CMS headless se o cliente for editar" en="Astro or static Next.js + headless CMS if the client will edit" />, <T pt="Cloudflare Pages ou Netlify" en="Cloudflare Pages or Netlify" />],
            [<T pt="Blog ou site que o cliente edita sozinho" en="Blog or site the client edits alone" />, <T pt="WordPress gerenciado, ou Astro + CMS (Decap, Sanity, TinaCMS)" en="Managed WordPress, or Astro + CMS (Decap, Sanity, TinaCMS)" />, <T pt="hospedagem WordPress gerenciada / Netlify" en="managed WordPress hosting / Netlify" />],
            [<T pt="Pequeno app (login, painel, banco)" en="Small app (login, dashboard, database)" />, <T pt="Next.js ou React + API, Supabase para banco e auth" en="Next.js or React + API, Supabase for database and auth" />, <T pt="Vercel (plano Pro) ou Netlify + Supabase" en="Vercel (Pro plan) or Netlify + Supabase" />],
            [<T pt="API ou processo sempre ligado" en="Always-on API or worker" />, <T pt="container Docker" en="Docker container" />, <T pt="Railway, Render, Fly.io ou VPS com Coolify" en="Railway, Render, Fly.io or a VPS with Coolify" />],
          ]}
        />
        <p><T pt={<>Preços, limites dos planos gratuitos e alternativas estão em <a href="/notas/small-project-hosting/">Hospedagem e bancos para pequenos projetos</a>. Aqui o foco é como a agência <em>opera</em> com essas plataformas.</>} en={<>Prices, free-tier limits and alternatives are in <a href="/notas/small-project-hosting/">Hosting and databases for small projects</a>. Here the focus is how the agency <em>operates</em> these platforms.</>} /></p>
        <h3><T pt="Como as plataformas se comparam para uma agência" en="How the platforms compare for an agency" /></h3>
        <Table
          head={[null, "Cloudflare Pages", "Netlify", "Vercel", "GitHub Pages"]}
          rows={[
            [<T pt="Melhor para" en="Best for" />, <T pt="sites estáticos com muito tráfego, DNS no mesmo lugar" en="high-traffic static sites, DNS in the same place" />, <T pt="sites com formulários e CMS, fluxo simples" en="sites with forms and a CMS, simple workflow" />, <T pt="Next.js e apps com renderização no servidor" en="Next.js and server-rendered apps" />, <T pt="documentação, projetos open source, sites pessoais" en="docs, open-source projects, personal sites" />],
            [<T pt="Deploy de preview por PR" en="Preview deploy per PR" />, <T pt="sim" en="yes" />, <T pt="sim" en="yes" />, <T pt="sim" en="yes" />, <T pt="não nativo" en="not built in" />],
            [<T pt="Formulários" en="Forms" />, <T pt="via Worker/Pages Function + Turnstile" en="via a Worker/Pages Function + Turnstile" />, <T pt="Netlify Forms, sem back-end" en="Netlify Forms, no back end" />, <T pt="via função serverless ou serviço externo" en="via a serverless function or external service" />, <T pt="só serviço externo" en="external service only" />],
            [<T pt="Uso comercial no plano grátis" en="Commercial use on the free plan" />, <T pt="permitido" en="allowed" />, <T pt="permitido" en="allowed" />, <T pt="não: o Hobby é só pessoal; cliente pagante vai no Pro" en="no: Hobby is personal only; paying clients go on Pro" />, <T pt="não é feito para negócio ou e-commerce" en="not meant for a business or e-commerce" />],
            [<T pt="Transferir projeto para o cliente" en="Transfer the project to the client" />, <T pt="recriar na conta do cliente (o repositório é o que importa)" en="recreate on the client's account (the repository is what matters)" />, <T pt="transferir o site entre times" en="transfer the site between teams" />, <T pt="transferir o projeto entre times" en="transfer the project between teams" />, <T pt="transferir o repositório" en="transfer the repository" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Para landing pages e sites institucionais, um site <strong>estático</strong> é quase sempre a resposta certa: não tem servidor para atualizar, não tem banco para invadir, custa perto de zero e aguenta pico de tráfego de campanha sem ninguém acordar de madrugada.</>} en={<>For landing pages and company websites, a <strong>static</strong> site is almost always the right answer: no server to patch, no database to breach, close to zero cost, and it survives a campaign traffic spike without anyone waking up at night.</>} /></Callout>
      </Section>
      <Section id="workflow" title={<T pt="O fluxo de trabalho" en="The workflow" />}>
        <p><T pt={<>O mesmo fluxo para todos os clientes: código no Git, cada mudança vira um <strong>preview</strong> com URL própria para o cliente aprovar, e o merge na branch principal publica em produção.</>} en={<>The same workflow for every client: code in Git, every change becomes a <strong>preview</strong> with its own URL for the client to approve, and the merge into the main branch publishes to production.</>} /></p>
        <Diagram minWidth={620} caption={<T pt={"Preview por PR acaba com \"manda print\" e \"sobe para eu ver\": o cliente abre o link no celular e aprova."} en={"A preview per PR ends \"send me a screenshot\" and \"upload it so I can see\": the client opens the link on their phone and approves."} />}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Fluxo: branch, preview, aprovação, produção / Flow: branch, preview, approval, production">
            <rect x="10" y="40" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="75" y="64" className="pt" textAnchor="middle">branch + PR</text>
            <text x="75" y="64" className="en" textAnchor="middle">branch + PR</text>
            <text x="75" y="82" className="pt mut" textAnchor="middle">a mudança</text>
            <text x="75" y="82" className="en mut" textAnchor="middle">the change</text>
            <rect x="190" y="40" width="130" height="56" rx="4" className="ln" />
            <text x="255" y="64" className="pt" textAnchor="middle">preview</text>
            <text x="255" y="64" className="en" textAnchor="middle">preview</text>
            <text x="255" y="82" className="mono mut" textAnchor="middle">pr-12.site.dev</text>
            <rect x="370" y="40" width="130" height="56" rx="4" className="ln" />
            <text x="435" y="64" className="pt" textAnchor="middle">cliente aprova</text>
            <text x="435" y="64" className="en" textAnchor="middle">client approves</text>
            <text x="435" y="82" className="pt mut" textAnchor="middle">por escrito</text>
            <text x="435" y="82" className="en mut" textAnchor="middle">in writing</text>
            <rect x="550" y="40" width="140" height="56" rx="4" className="brandfill" />
            <text x="620" y="64" className="pt" textAnchor="middle">merge = produção</text>
            <text x="620" y="64" className="en" textAnchor="middle">merge = production</text>
            <text x="620" y="82" className="mono" textAnchor="middle">cliente.com.br</text>
            <path d="M140 68L190 68" className="ln" />
            <path d="M183.2 64.7L190 68L183.2 71.3" className="ln" />
            <path d="M320 68L370 68" className="ln" />
            <path d="M363.2 64.7L370 68L363.2 71.3" className="ln" />
            <path d="M500 68L550 68" className="ln" />
            <path d="M543.2 64.7L550 68L543.2 71.3" className="ln" />
            <path d="M620 96C620 140 75 140 75 96" className="ln dash" />
            <path d="M71.7 102.8L75 96L78.3 102.8" className="ln" />
            <text x="350" y="155" className="pt mut" textAnchor="middle">deu errado? reverta o merge: o deploy anterior volta</text>
            <text x="350" y="155" className="en mut" textAnchor="middle">went wrong? revert the merge: the previous deploy comes back</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><strong>Um repositório por cliente</strong>, numa organização do GitHub da agência enquanto o projeto está em desenvolvimento (ou já na do cliente, se ele tiver uma).</>} en={<><strong>One repository per client</strong>, in the agency's GitHub organization while the project is in development (or already in the client's, if they have one).</>} /></li>
          <li><T pt={<><strong>Variáveis de ambiente na plataforma</strong>, nunca no código. Liste todas no README (nome e para que serve, sem o valor).</>} en={<><strong>Environment variables on the platform</strong>, never in the code. List them all in the README (name and purpose, never the value).</>} /></li>
          <li><T pt={<><strong>Domínio de teste</strong> (o <code>*.pages.dev</code>, <code>*.netlify.app</code> ou <code>*.vercel.app</code>) até a aprovação; o domínio do cliente só entra no go-live.</>} en={<><strong>Test domain</strong> (the <code>*.pages.dev</code>, <code>*.netlify.app</code> or <code>*.vercel.app</code>) until approval; the client's domain only comes in at go-live.</>} /></li>
          <li><T pt={<><strong>Rollback é um clique</strong>: as três plataformas guardam os deploys anteriores e permitem voltar para qualquer um.</>} en={<><strong>Rollback is one click</strong>: all three platforms keep previous deploys and let you go back to any of them.</>} /></li>
        </ul>
        <h3><T pt="O que quase todo site precisa além do HTML" en="What almost every site needs besides the HTML" /></h3>
        <Table
          head={[<T pt="Necessidade" en="Need" />, <T pt="Opções simples" en="Simple options" />]}
          rows={[
            [<T pt="Formulário de contato" en="Contact form" />, <T pt="Netlify Forms, Formspree, Web3Forms, ou uma função própria com Cloudflare Turnstile contra spam" en="Netlify Forms, Formspree, Web3Forms, or your own function with Cloudflare Turnstile against spam" />],
            [<T pt="Cliente editar textos e posts" en="Client edits copy and posts" />, <T pt="CMS headless (Decap, Sanity, TinaCMS) ou WordPress quando a edição livre é o produto" en="Headless CMS (Decap, Sanity, TinaCMS) or WordPress when free editing is the product" />],
            [<T pt="Métricas de visita" en="Visit analytics" />, <T pt="Cloudflare Web Analytics ou Plausible (sem cookies), ou GA4 na conta do cliente" en="Cloudflare Web Analytics or Plausible (cookie-free), or GA4 in the client's account" />],
            [<T pt="Aparecer no Google" en="Showing up on Google" />, <T pt={<>Search Console verificado pelo DNS do domínio do cliente; veja <a href="/notas/seo-geo/">SEO e busca por IA</a></>} en={<>Search Console verified through the client's domain DNS; see <a href="/notas/seo-geo/">SEO and AI search</a></>} />],
            [<T pt="E-mail no domínio" en="Email on the domain" />, <T pt={<>Google Workspace, Microsoft 365, Zoho; veja <a href="/notas/company-accounts/">Identidade e contas da empresa</a></>} en={<>Google Workspace, Microsoft 365, Zoho; see <a href="/notas/company-accounts/">Company identity and accounts</a></>} />],
          ]}
        />
      </Section>
      <Section id="ownership" title={<T pt="De quem são as contas" en="Who owns the accounts" />}>
        <p><T pt="Há dois modelos honestos. O que não é honesto é deixar o cliente sem saber qual dos dois ele contratou." en="There are two honest models. What is not honest is leaving the client unaware of which one they signed up for." /></p>
        <Table
          head={[null, <T pt="Contas do cliente" en="Client-owned accounts" />, <T pt="Hospedagem gerenciada pela agência" en="Agency-managed hosting" />]}
          rows={[
            [<T pt="Como funciona" en="How it works" />, <T pt="o cliente cria as contas (domínio, hospedagem, GitHub) e convida a agência como membro" en="the client creates the accounts (domain, hosting, GitHub) and invites the agency as a member" />, <T pt="o site roda no time da agência, e a hospedagem é cobrada como parte da mensalidade" en="the site runs in the agency's team, and hosting is billed as part of the monthly fee" />],
            [<T pt="Bom para" en="Good for" />, <T pt="clientes com equipe técnica ou que querem independência" en="clients with a tech team or who want independence" />, <T pt={"clientes que querem \"não pensar nisso\" e pagam manutenção"} en={"clients who want to \"not think about it\" and pay for maintenance"} />],
            [<T pt="Risco" en="Risk" />, <T pt="o cliente perde o acesso ou o cartão expira e ninguém percebe" en="the client loses access or the card expires and nobody notices" />, <T pt="dependência da agência; precisa de plano de saída no contrato" en="dependence on the agency; needs an exit plan in the contract" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Nos dois modelos, o <strong>domínio</strong> é sempre registrado no nome e na conta do cliente.</>} en={<>In both models, the <strong>domain</strong> is always registered in the client's name and account.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt="No modelo gerenciado pela agência, lembre que planos gratuitos com restrição de uso comercial (como o Hobby da Vercel) não servem para site de cliente. Use o plano pago do time da agência e repasse o custo." en="In the agency-managed model, remember that free plans with commercial-use restrictions (like Vercel's Hobby) do not cover client sites. Use the agency team's paid plan and pass the cost on." /></Callout>
      </Section>
      <Section id="handover" title={<T pt="O que entregar ao cliente" en="What to hand over to the client" />}>
        <p><T pt={<>O site no ar não é a entrega inteira. A entrega é <strong>o cliente conseguir continuar sem você</strong>, mesmo que ele prefira não fazer isso. Monte um pacote de entrega igual para todo projeto:</>} en={<>The live site is not the whole delivery. The delivery is <strong>the client being able to carry on without you</strong>, even if they would rather not. Build the same handover package for every project:</>} /></p>
        <Table
          head={[<T pt="Item" en="Item" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<T pt="Domínio" en="Domain" />, <T pt="no nome do cliente, com renovação automática e o login do registrador com ele" en="in the client's name, auto-renewing, with the registrar login in their hands" />],
            [<T pt="Código-fonte" en="Source code" />, <T pt={<>repositório transferido para a organização do cliente no GitHub (ou um <code>.zip</code> com o histórico, se ele não tiver conta)</>} en={<>repository transferred to the client's GitHub organization (or a <code>.zip</code> with history if they have no account)</>} />],
            [<T pt="Hospedagem" en="Hosting" />, <T pt="projeto na conta do cliente, ou acordo escrito do modelo gerenciado" en="project on the client's account, or a written agreement for the managed model" />],
            [<T pt="Registros DNS" en="DNS records" />, <T pt="lista de cada registro e para que serve (site, e-mail, verificações)" en="a list of each record and what it is for (site, email, verifications)" />],
            [<T pt="Acessos e credenciais" en="Access and credentials" />, <T pt="compartilhados por um gerenciador de senhas ou por convite de membro, nunca por e-mail ou WhatsApp" en="shared through a password manager or a member invite, never by email or WhatsApp" />],
            ["README", <T pt="como rodar localmente, como publicar, variáveis de ambiente, serviços usados" en="how to run locally, how to publish, environment variables, services used" />],
            [<T pt="Manual do editor" en="Editor's guide" />, <T pt="se houver CMS: como editar textos, trocar imagens, publicar um post (vídeo curto vale ouro)" en="if there is a CMS: how to edit copy, swap images, publish a post (a short video is gold)" />],
            [<T pt="Analytics e Search Console" en="Analytics and Search Console" />, <T pt="propriedades criadas na conta do cliente, com a agência como usuária" en="properties created in the client's account, with the agency as a user" />],
            [<T pt="Arquivos de marca e mídia" en="Brand and media files" />, <T pt="logos, fontes (com licença), imagens originais, textos finais" en="logos, fonts (with licence), original images, final copy" />],
            [<T pt="Privacidade (LGPD)" en="Privacy (LGPD/GDPR)" />, <T pt="política de privacidade, aviso de cookies se houver rastreamento, onde ficam os dados dos formulários" en="privacy policy, cookie notice if there is tracking, where form submissions are stored" />],
            [<T pt="Termo de entrega" en="Delivery acceptance" />, <T pt="documento assinado listando o que foi entregue, a garantia e o que é manutenção paga" en="a signed document listing what was delivered, the warranty and what is paid maintenance" />],
          ]}
        />
        <p><T pt={<>As cláusulas que tornam isso obrigatório (cessão de direitos, prazo de garantia, manutenção) estão em <a href="/notas/small-project-contracts/">Contratos e preços para pequenos projetos web</a>.</>} en={<>The clauses that make this binding (rights assignment, warranty period, maintenance) are in <a href="/notas/small-project-contracts/">Contracts and pricing for small web projects</a>.</>} /></p>
        <h3><T pt="Um README de entrega" en="A handover README" /></h3>
        <CodeBlock code={`# cliente.com.br

## Stack
Astro 5 · Cloudflare Pages · Formspree (contact form) · Plausible (analytics)

## Run locally
npm ci
npm run dev            # http://localhost:4321

## Publish
Merge into main. Cloudflare Pages builds and publishes on its own.
Every pull request gets a preview URL.

## Environment variables (Cloudflare Pages → Settings → Variables)
PUBLIC_FORM_ENDPOINT   Formspree form URL
PUBLIC_SITE_URL        https://cliente.com.br

## Accounts (all owned by the client)
Domain        Registro.br         contato@cliente.com.br
Hosting       Cloudflare          contato@cliente.com.br
Repository    github.com/cliente-org/site
Analytics     Plausible           contato@cliente.com.br

## DNS
@     CNAME  cliente-site.pages.dev     site
www   CNAME  cliente-site.pages.dev     site
@     MX     ...                        email (Google Workspace)
@     TXT    google-site-verification   Search Console`} />
      </Section>
      <Section id="golive" title={<T pt="Checklist de go-live" en="Go-live checklist" />}>
        <ol>
          <li><T pt={<>Domínio do cliente apontado, HTTPS ativo, <code>www</code> redirecionando para o principal (ou o contrário).</>} en={<>Client domain pointed, HTTPS on, <code>www</code> redirecting to the main host (or the other way round).</>} /></li>
          <li><T pt="Formulários testados de ponta a ponta: a mensagem chega na caixa certa e não cai no spam." en="Forms tested end to end: the message reaches the right inbox and does not land in spam." /></li>
          <li><T pt={<>Título, descrição e imagem de compartilhamento em cada página; <code>sitemap.xml</code> e <code>robots.txt</code> publicados; Search Console verificado.</>} en={<>Title, description and share image on every page; <code>sitemap.xml</code> and <code>robots.txt</code> published; Search Console verified.</>} /></li>
          <li><T pt="Teste no celular de verdade, não só no modo responsivo do navegador." en="Test on a real phone, not just the browser's responsive mode." /></li>
          <li><T pt="Página 404, favicon, redirecionamentos das URLs antigas (se o site substituiu outro)." en="404 page, favicon, redirects from old URLs (if the site replaced another one)." /></li>
          <li><T pt="Monitor de disponibilidade simples (UptimeRobot, Better Stack) avisando a agência e o cliente." en="A simple uptime monitor (UptimeRobot, Better Stack) alerting the agency and the client." /></li>
          <li><T pt="Pacote de entrega enviado e termo de entrega assinado." en="Handover package sent and delivery acceptance signed." /></li>
        </ol>
        <Callout icon="check"><T pt="Depois do go-live, ofereça manutenção com escopo claro (atualizações, pequenas alterações por mês, monitoramento). Sites estáticos quase não quebram sozinhos; o que o cliente compra é ter alguém para chamar." en="After go-live, offer maintenance with a clear scope (updates, small changes per month, monitoring). Static sites almost never break on their own; what the client buys is someone to call." /></Callout>
      </Section>
      <Section id="cheat-agy" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <ul className="ds-list">
          <li><T pt="Landing page ou institucional: site estático no Cloudflare Pages ou Netlify." en="Landing page or company site: a static site on Cloudflare Pages or Netlify." /></li>
          <li><T pt="App com servidor: Vercel no plano pago ou Netlify, com Supabase." en="App with a server: Vercel on a paid plan or Netlify, with Supabase." /></li>
          <li><T pt="Preview por PR, aprovação por escrito, merge publica, rollback em um clique." en="Preview per PR, written approval, merge publishes, one-click rollback." /></li>
          <li><T pt="Domínio sempre do cliente; o resto depende do modelo combinado." en="The domain always belongs to the client; the rest depends on the agreed model." /></li>
          <li><T pt="Entrega = código, acessos, DNS, README, manual, analytics, privacidade e termo assinado." en="Handover = code, access, DNS, README, guide, analytics, privacy and a signed acceptance." /></li>
        </ul>
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul className="ds-list">
          <li><T pt="Por que um site estático é a escolha padrão para landing pages?" en="Why is a static site the default choice for landing pages?" /></li>
          <li><T pt="Por que o plano Hobby da Vercel não serve para o site de um cliente?" en="Why does Vercel's Hobby plan not cover a client's website?" /></li>
          <li><T pt="Quais são os dois modelos de propriedade de contas e o que é igual nos dois?" en="What are the two account-ownership models and what is the same in both?" /></li>
          <li><T pt="O cliente quer trocar de agência amanhã. O que ele precisa ter recebido para isso ser fácil?" en="The client wants to switch agencies tomorrow. What must they have received for that to be easy?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "Cloudflare Pages documentation", href: "https://developers.cloudflare.com/pages/" },
          { label: "Netlify Forms setup", href: "https://docs.netlify.com/forms/setup/" },
          { label: "Netlify Deploy Previews", href: "https://docs.netlify.com/site-deploys/deploy-previews/" },
          { label: "Vercel Hobby plan", href: "https://vercel.com/docs/plans/hobby" },
          { label: "Vercel Preview Deployments", href: "https://vercel.com/docs/deployments/preview-deployments" },
          { label: "GitHub Pages limits", href: "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits" },
          { label: "GitHub: Transferring a repository", href: "https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository" },
        ]}
      />
    </>
  );
}
