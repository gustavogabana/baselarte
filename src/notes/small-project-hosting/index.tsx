import { Callout, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "small-project-hosting",
  title: { en: "Hosting and databases for small projects and small SaaS", pt: "Hospedagem e banco para projetos pequenos e SaaS pequenos" },
  seo: {
    title: { en: "Hosting and databases for small projects and small SaaS", pt: "Hospedagem e banco para projetos pequenos e SaaS pequenos" },
    description: { en: "Practical hosting and database options for landing pages, institutional sites and small SaaS: Vercel, Netlify, Cloudflare, Hostinger, Railway, Render, Fly.io, Hetzner with Coolify, Supabase, Neon and D1, with prices, limits and account ownership.", pt: "Opções práticas de hospedagem e banco para landing pages, sites institucionais e SaaS pequenos: Vercel, Netlify, Cloudflare, Hostinger, Railway, Render, Fly.io, Hetzner com Coolify, Supabase, Neon e D1, com preços, limites e de quem é a conta." },
  },
  summary: "practical options and prices for landing pages and small SaaS (Vercel, Netlify, Cloudflare, Hostinger, Railway, Render, Fly.io, Hetzner with Coolify, Supabase, Neon, D1), free-plan limits and who should own the domain and accounts.",
  kicker: { en: "Web development", pt: "Desenvolvimento web" },
  heroTitle: { en: <>Hosting and databases for <em>small projects and small SaaS.</em></>, pt: <>Hospedagem e banco para <em>projetos pequenos e SaaS pequenos.</em></> },
  heroLede: { en: "Which platform fits which kind of small project, what it costs, what happens at the free-plan limit, and who should own the domain and the account.", pt: "Qual plataforma serve para qual tipo de projeto pequeno, quanto custa, o que acontece no limite do plano grátis e quem deve ser dono do domínio e da conta." },
  published: "2026-10-26",
  updated: "2026-10-26",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="Como escolher" en="How to choose" /> },
        { id: "static", title: <T pt="1. Estáticos: Cloudflare, Netlify, Vercel" en="1. Static: Cloudflare, Netlify, Vercel" /> },
        { id: "shared", title: <T pt="2. Hospedagem compartilhada" en="2. Shared hosting" /> },
        { id: "paas", title: <T pt="3. PaaS: Railway, Render, Fly.io" en="3. PaaS: Railway, Render, Fly.io" /> },
        { id: "vps", title: <T pt="4. VPS com Coolify" en="4. VPS with Coolify" /> },
        { id: "db", title: <T pt="5. Banco de dados" en="5. Database" /> },
        { id: "accounts", title: <T pt="6. De quem é a conta?" en="6. Whose account is it?" /> },
        { id: "scenarios", title: <T pt="7. Combinações prontas" en="7. Ready-made combinations" /> },
        { id: "rules", title: <T pt="8. Regras" en="8. Rules" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={<T pt="Como escolher" en="How to choose" />}>
        <p><T pt={<>Para landing pages, sites institucionais e SaaS pequenos, a pergunta não é “qual é a melhor plataforma”, e sim <b>quanto de servidor você quer operar</b>. Quanto menos, mais caro por unidade de uso, mas menos madrugada resolvendo problema. Esta nota junta as opções práticas, com preços e limites encontrados em outubro de 2026.</>} en={<>For landing pages, institutional sites and small SaaS, the question is not “which platform is best” but <b>how much server you want to operate</b>. The less you operate, the more you pay per unit of use, but the fewer nights you spend fixing things. This note collects the practical options, with prices and limits found in October 2026.</>} /></p>
        <Table
          head={[<T pt="O que você está entregando" en="What you are delivering" />, <T pt="Opção mais simples" en="Simplest option" />, <T pt="Quando sair dela" en="When to leave it" />]}
          rows={[
            [<T pt="Landing page ou site institucional estático" en="Static landing page or institutional site" />, <T pt="Cloudflare Pages/Workers, Netlify ou Vercel" en="Cloudflare Pages/Workers, Netlify or Vercel" />, <T pt="Precisa de back-end próprio ou tráfego alto" en="You need your own back-end or have high traffic" />],
            [<T pt="Site WordPress ou PHP para o cliente" en="WordPress or PHP site for the client" />, <T pt="Hospedagem compartilhada (Hostinger e similares)" en="Shared hosting (Hostinger and similar)" />, <T pt="Site lento, muitos plugins ou exige controle do servidor" en="Slow site, many plugins, or you need server control" />],
            [<T pt="Next.js/React com API e banco, SaaS pequeno" en="Next.js/React with API and database, small SaaS" />, <T pt="Vercel + Supabase ou Neon" en="Vercel + Supabase or Neon" />, <T pt="Custo por usuário subindo ou back-end pesado" en="Per-user cost climbing, or a heavy back-end" />],
            [<T pt="API/worker sempre ligado (Node, Python, filas)" en="Always-on API/worker (Node, Python, queues)" />, <T pt="Railway, Render ou Fly.io" en="Railway, Render or Fly.io" />, <T pt="Várias apps pequenas juntas" en="Several small apps together" />],
            [<T pt="Muitos projetos pequenos de clientes" en="Many small client projects" />, <T pt="VPS barata com Coolify (Hetzner)" en="Cheap VPS with Coolify (Hetzner)" />, <T pt="Precisa de escala e conformidade: AWS (veja a nota de AWS)" en="You need scale and compliance: AWS (see the AWS note)" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>Preços mudam toda hora.</b> Os valores abaixo vêm de páginas oficiais quando consegui acessar e, quando não, de comparativos de terceiros (marcados). Confirme na página de preços antes de cotar para um cliente.</>} en={<><b>Prices change constantly.</b> The values below come from official pages when I could reach them and, when not, from third-party comparisons (marked). Confirm on the pricing page before quoting a client.</>} /></Callout>
      </Section>
      <Section id="static" title={<T pt="1. Sites estáticos e front-end: Cloudflare, Netlify, Vercel" en="1. Static sites and front-end: Cloudflare, Netlify, Vercel" />}>
        <p><T pt="Você liga o repositório do GitHub e cada push publica o site, com HTTPS e CDN incluídos. É o caminho mais barato e com menos manutenção para landing pages." en="You connect the GitHub repository and every push publishes the site, with HTTPS and a CDN included. It is the cheapest and lowest-maintenance path for landing pages." /></p>
        <Table
          head={[<T pt="Plataforma" en="Platform" />, <T pt="Plano gratuito" en="Free plan" />, <T pt="Plano pago" en="Paid plan" />, <T pt="Atenção" en="Watch out" />]}
          rows={[
            [<T pt="Vercel" en="Vercel" />, <T pt="Hobby: grátis, mas só uso pessoal e não comercial" en="Hobby: free, but personal, non-commercial use only" />, <T pt="Pro: US$ 20 por usuário/mês (US$ 24 se mensal), com crédito de uso incluído" en="Pro: US$ 20 per user/month (US$ 24 if billed monthly), with usage credit included" />, <T pt="Site de cliente que gera lead ou venda conta como comercial: exige Pro" en="A client site that generates leads or sales counts as commercial: it requires Pro" />],
            [<T pt="Netlify" en="Netlify" />, <T pt="Free: 300 créditos/mês" en="Free: 300 credits/month" />, <T pt="Personal: US$ 9/mês (1.000 créditos); Pro: US$ 20/mês (3.000 créditos, reduzido de 5.000 em jul/2026)" en="Personal: US$ 9/month (1,000 credits); Pro: US$ 20/month (3,000 credits, cut from 5,000 in Jul 2026)" />, <T pt="Cobrança por créditos (deploy, banda, formulários); o consumo muda o que cabe no plano. Não achei o texto sobre uso comercial no plano Free" en="Credit-based billing (deploys, bandwidth, forms); usage determines what fits. I did not find the commercial-use wording for the Free plan" />],
            [<T pt="Cloudflare Pages / Workers" en="Cloudflare Pages / Workers" />, <T pt="Workers Free: 100 mil requisições/dia, 10 ms de CPU por chamada; D1 grátis até 5 GB" en="Workers Free: 100k requests/day, 10 ms CPU per call; D1 free up to 5 GB" />, <T pt="Workers Paid: mínimo US$ 5/mês por conta" en="Workers Paid: US$ 5/month minimum per account" />, <T pt="Passou do limite diário, as chamadas falham até o dia seguinte (00:00 UTC). Não achei na busca os limites de banda e build do Pages" en="Over the daily limit, calls fail until the next day (00:00 UTC). My search did not surface Pages bandwidth and build limits" />],
          ]}
        />
        <Callout tone="use" icon="check"><T pt={<><b>Regra prática para agência pequena:</b> um projeto de cliente que gera dinheiro não deveria ficar num plano “pessoal/hobby”. Ou você paga o plano comercial (e embute o custo na mensalidade), ou usa uma plataforma sem essa restrição. Leia os termos de uso da plataforma antes de publicar.</>} en={<><b>Rule of thumb for a small agency:</b> a client project that makes money should not sit on a “personal/hobby” plan. Either you pay for the commercial plan (and build the cost into the monthly fee) or you use a platform without that restriction. Read the platform’s terms of service before publishing.</>} /></Callout>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> o GitHub Pages também serve site estático grátis, mas não o pesquisei aqui, e ele não tem back-end. Para LP simples com formulário, o Cloudflare Pages com um Worker pequeno costuma resolver sem plano pago, porém não testei o limite de 10 ms de CPU com envio de e-mail.</>} en={<><b>Personal note, not verified in the sources:</b> GitHub Pages also serves static sites for free, but I did not research it here, and it has no back-end. For a simple LP with a form, Cloudflare Pages with a small Worker usually works without a paid plan, but I did not test the 10 ms CPU limit with email sending.</>} /></Callout>
      </Section>
      <Section id="shared" title={<T pt="2. Hospedagem compartilhada: Hostinger e similares" en="2. Shared hosting: Hostinger and similar" />}>
        <p><T pt="Você paga uma mensalidade baixa e recebe espaço num servidor dividido, com painel (hPanel, cPanel), e-mail, banco MySQL e instalador de WordPress. Serve bem para sites em WordPress ou PHP e para clientes que querem “o e-mail do domínio funcionando” no mesmo lugar." en="You pay a low monthly fee and get space on a shared server, with a panel (hPanel, cPanel), email, a MySQL database and a WordPress installer. It suits WordPress or PHP sites and clients who want “the domain email working” in the same place." /></p>
        <ul className="ds-list">
          <li><T pt="Preço de entrada no Brasil: cerca de R$ 8,99/mês na Hostinger e R$ 11,69/mês na HostGator, segundo comparativos de 2026 (de afiliados, então confirme). Faixa geral de mercado: R$ 10 a R$ 75/mês." en="Entry price in Brazil: about R$ 8.99/month at Hostinger and R$ 11.69/month at HostGator, per 2026 comparisons (affiliate sites, so confirm). General market range: R$ 10 to R$ 75/month." /></li>
          <li><T pt="Preço promocional exige pagar vários meses ou anos adiantado, e a renovação costuma ser bem maior. Uma fonte cita US$ 2,99/mês com pagamento de 48 meses e renovação a US$ 10,99. Pergunte o preço de renovação antes de vender." en="The promotional price requires paying many months or years upfront, and renewal is usually much higher. One source cites US$ 2.99/month with a 48-month prepayment and renewal at US$ 10.99. Ask for the renewal price before selling." /></li>
          <li><T pt="Os planos mais caros adicionam CDN, backups e mais recursos. O VPS (KVM) da Hostinger dá controle total, mas aí o servidor é seu para atualizar e proteger. Não consegui os preços de VPS nas buscas." en="Higher plans add a CDN, backups and more resources. Hostinger’s VPS (KVM) gives full control, but then the server is yours to update and secure. I could not get VPS prices from my searches." /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>Compartilhada não é lugar para app Node, fila ou SaaS. Se o projeto cresce, a migração de WordPress entre hospedagens dá trabalho: combine isso no contrato de manutenção (veja <a href="/notas/small-project-contracts/">a nota de contratos</a>).</>} en={<>Shared hosting is not the place for a Node app, queue or SaaS. If the project grows, moving WordPress between hosts is real work: agree on that in the maintenance contract (see the <a href="/notas/small-project-contracts/">contracts note</a>).</>} /></Callout>
      </Section>
      <Section id="paas" title={<T pt="3. PaaS para apps sempre ligados: Railway, Render, Fly.io" en="3. PaaS for always-on apps: Railway, Render, Fly.io" />}>
        <p><T pt="Quando o projeto tem uma API, um worker ou um app Node/Python que precisa ficar rodando, você precisa de computação contínua, não só estático. Estas plataformas fazem o deploy a partir de Git ou de um Dockerfile." en="When the project has an API, a worker or a Node/Python app that must stay running, you need continuous compute, not just static hosting. These platforms deploy from Git or a Dockerfile." /></p>
        <Table
          head={[<T pt="Plataforma" en="Platform" />, <T pt="Modelo e preço (comparativos de terceiros, 2026)" en="Model and price (third-party comparisons, 2026)" />, <T pt="Para quem" en="Best for" />]}
          rows={[
            [<T pt="Railway" en="Railway" />, <T pt="Hobby US$ 5/mês com US$ 5 de crédito de uso; Pro US$ 20/mês. Sem plano gratuito permanente; app ocioso ainda gasta" en="Hobby US$ 5/month with US$ 5 usage credit; Pro US$ 20/month. No permanent free tier; an idle app still costs" />, <T pt="Subir rápido um protótipo ou app pequeno" en="Quickly shipping a prototype or small app" />],
            [<T pt="Render" en="Render" />, <T pt="Web service Starter US$ 7/mês, Standard US$ 25/mês; Postgres gerenciado a partir de cerca de US$ 6/mês mais US$ 0,30/GB. O plano gratuito hiberna após 15 min e a primeira requisição demora cerca de 1 minuto" en="Starter web service US$ 7/month, Standard US$ 25/month; managed Postgres from about US$ 6/month plus US$ 0.30/GB. The free tier sleeps after 15 min and the first request takes about a minute" />, <T pt="Preço fixo e previsível, banco gerenciado" en="Fixed, predictable price and a managed database" />],
            [<T pt="Fly.io" en="Fly.io" />, <T pt="Cobrança por segundo de VM: uma shared-cpu-1x de 256 MB custa cerca de US$ 2/mês ligada o mês todo; volumes US$ 0,15/GB/mês. Postgres é por sua conta" en="Per-second VM billing: a 256 MB shared-cpu-1x costs about US$ 2/month running all month; volumes US$ 0.15/GB/month. Postgres is self-managed" />, <T pt="Menor custo de computação, mas mais operação" en="Lowest compute cost, but more operations work" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt="Os comparativos divergem em planos grátis, exigência de cartão e datas de reformulação de preços (Render, por exemplo, aparece com mudanças em abril e em agosto de 2026). Trate os números como ordem de grandeza." en="The comparisons disagree on free plans, card requirements and dates of price overhauls (Render, for example, shows changes in April and in August 2026). Treat the numbers as an order of magnitude." /></Callout>
      </Section>
      <Section id="vps" title={<T pt="4. VPS barata com Coolify: muitos projetos num servidor" en="4. Cheap VPS with Coolify: many projects on one server" />}>
        <p><T pt={<>Para uma empresa que mantém vários projetos pequenos, um único VPS com o <b>Coolify</b> (PaaS de código aberto que você instala no próprio servidor) vira um “Vercel próprio”: deploy por Git, HTTPS automático e banco no mesmo servidor.</>} en={<>For a company that maintains several small projects, a single VPS running <b>Coolify</b> (an open-source PaaS you install on your own server) becomes a “private Vercel”: Git deploys, automatic HTTPS and a database on the same server.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Hetzner: o CX22 (2 vCPU, 4 GB de RAM, 40 GB) aparece por cerca de € 4–4,50/mês depois do reajuste de 1º de abril de 2026; há indício de que o CX23 (€ 3,99) o substituiu. Confirme o plano atual." en="Hetzner: the CX22 (2 vCPU, 4 GB RAM, 40 GB) shows up at about € 4–4.50/month after the 1 April 2026 increase; there are signs the CX23 (€ 3.99) replaced it. Confirm the current plan." /></li>
          <li><T pt="O Coolify pede no mínimo 2 vCPU, 2 GB de RAM e 10 GB livres, segundo a documentação; relatos citam cerca de 800 MB de RAM só para ele. Build pesado no mesmo servidor pode travá-lo." en="Coolify asks for at least 2 vCPU, 2 GB RAM and 10 GB free, per its docs; reports cite about 800 MB of RAM for Coolify alone. A heavy build on the same server can freeze it." /></li>
          <li><T pt="O preço baixo compra o servidor, não o seu tempo: atualizações, backups, monitoramento e segurança passam a ser sua responsabilidade. Precifique isso na mensalidade." en="The low price buys the server, not your time: updates, backups, monitoring and security become your responsibility. Price that into the monthly fee." /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> a Hetzner não tem região no Brasil, então o ping para o usuário final brasileiro é maior. Para sites com público 100% brasileiro, use CDN (Cloudflare) na frente ou escolha uma hospedagem com datacenter no país.</>} en={<><b>Personal note, not verified in the sources:</b> Hetzner has no region in Brazil, so latency for end users in Brazil is higher. For sites with a 100% Brazilian audience, put a CDN (Cloudflare) in front or pick a host with a datacenter in the country.</>} /></Callout>
      </Section>
      <Section id="db" title={<T pt="5. Banco de dados: Supabase, Neon, D1" en="5. Database: Supabase, Neon, D1" />}>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Plano gratuito" en="Free plan" />, <T pt="Pago" en="Paid" />, <T pt="Observações" en="Notes" />]}
          rows={[
            [<T pt="Supabase (Postgres + auth + storage)" en="Supabase (Postgres + auth + storage)" />, <T pt="500 MB de banco, 50 mil usuários ativos/mês, 2 projetos ativos. Projetos inativos por uma semana são pausados (restauráveis no painel)" en="500 MB database, 50k monthly active users, 2 active projects. Projects inactive for a week are paused (restorable from the dashboard)" />, <T pt="Pro: US$ 25/mês, com US$ 10 de crédito de computação (uma instância Micro) e limite de gasto ligado por padrão; Team US$ 599" en="Pro: US$ 25/month, with US$ 10 compute credit (one Micro instance) and a spend cap on by default; Team US$ 599" />, <T pt="O grátis não serve para produção de cliente (pausa). Fontes divergem se o Pro é cobrado por organização ou por projeto" en="The free tier does not suit client production (pausing). Sources disagree on whether Pro is billed per organization or per project" />],
            [<T pt="Neon (Postgres serverless)" en="Neon (serverless Postgres)" />, <T pt="Até 100 projetos, 0,5 GB por projeto, 100 horas de computação por projeto/mês; desliga após 5 min ocioso" en="Up to 100 projects, 0.5 GB each, 100 compute-hours per project/month; scales to zero after 5 min idle" />, <T pt="Launch: US$ 0,106 por CU-hora e US$ 0,35/GB-mês, sem mínimo mensal; dá para desligar o scale-to-zero" en="Launch: US$ 0.106 per CU-hour and US$ 0.35/GB-month, no monthly minimum; scale-to-zero can be disabled" />, <T pt="Paga só o que usa, bom para vários bancos pequenos. A primeira conexão depois de ocioso é mais lenta" en="Pay for what you use, good for many small databases. The first connection after idle is slower" />],
            [<T pt="Cloudflare D1 (SQLite)" en="Cloudflare D1 (SQLite)" />, <T pt="5 milhões de linhas lidas e 100 mil escritas por dia; 5 GB no total na conta" en="5 million rows read and 100k written per day; 5 GB total per account" />, <T pt="Dentro do Workers Paid (US$ 5/mês): 25 bilhões de leituras e 50 milhões de escritas/mês; US$ 0,75/GB acima de 5 GB" en="Within Workers Paid (US$ 5/month): 25 billion reads and 50 million writes/month; US$ 0.75/GB beyond 5 GB" />, <T pt="Só faz sentido junto com Workers; não é Postgres" en="Only makes sense together with Workers; it is not Postgres" />],
            [<T pt="MySQL da hospedagem compartilhada" en="Shared-hosting MySQL" />, <T pt="Incluído no plano" en="Included in the plan" />, <T pt="—" en="—" />, <T pt="Para WordPress. Sem acesso externo fácil e sem escalar" en="For WordPress. No easy external access and no scaling" />],
            [<T pt="RDS (AWS)" en="RDS (AWS)" />, <T pt="Camada gratuita limitada e por tempo" en="Limited, time-boxed free tier" />, <T pt="Por hora de instância e armazenamento" en="Per instance-hour and storage" />, <T pt="Veja a nota de AWS e a de ECS. Para projeto pequeno costuma ser o mais caro" en="See the AWS and ECS notes. For a small project it is usually the most expensive" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Em produção de cliente, <b>não use plano gratuito que pausa ou hiberna</b>: o primeiro visitante depois de uma semana parada cai em erro ou espera. Pague o plano mais barato e embuta no valor mensal. Backup também: confirme o que cada plano inclui e quanto tempo guarda.</>} en={<>In client production, <b>do not use a free plan that pauses or sleeps</b>: the first visitor after a quiet week hits an error or a wait. Pay for the cheapest paid plan and build it into the monthly fee. Backups too: confirm what each plan includes and how long it keeps them.</>} /></Callout>
      </Section>
      <Section id="accounts" title={<T pt="6. De quem é a conta? Domínio, DNS e plataforma" en="6. Whose account is it? Domain, DNS and platform" />}>
        <p><T pt="A decisão que mais dá dor de cabeça não é técnica. É quem é o dono do domínio, do DNS e da conta da hospedagem. Há dois modelos:" en="The decision that causes the most headaches is not technical. It is who owns the domain, the DNS and the hosting account. There are two models:" /></p>
        <Table
          head={[<T pt="" en="" />, <T pt="Conta do cliente (recomendado)" en="Client’s account (recommended)" />, <T pt="Conta da agência (revenda)" en="Agency account (resale)" />]}
          rows={[
            [<T pt="Quem paga a plataforma" en="Who pays the platform" />, <T pt="O cliente, direto no cartão dele; você cobra o serviço" en="The client, directly on their card; you bill for the service" />, <T pt="Você, e repassa na mensalidade" en="You, and pass it on in the monthly fee" />],
            [<T pt="Domínio" en="Domain" />, <T pt="Registrado no CPF/CNPJ do cliente (o .br exige CPF ou CNPJ válido)" en="Registered under the client’s CPF/CNPJ (.br requires a valid CPF or CNPJ)" />, <T pt="Registrado em seu nome é um risco: o cliente não é dono do próprio endereço" en="Registered in your name is a risk: the client does not own their own address" />],
            [<T pt="Seu acesso" en="Your access" />, <T pt="Convidado como colaborador (equipe, IAM, membro do projeto)" en="Invited as a collaborator (team, IAM, project member)" />, <T pt="Total" en="Full" />],
            [<T pt="Saída do contrato" en="Contract exit" />, <T pt="Revoga seu acesso e pronto" en="They revoke your access and that is it" />, <T pt={<>Precisa de um processo de transferência (veja <a href="/notas/small-project-contracts/">a nota de contratos</a>)</>} en={<>Needs a transfer process (see the <a href="/notas/small-project-contracts/">contracts note</a>)</>} />],
            [<T pt="Margem" en="Margin" />, <T pt="Só o serviço" en="Service only" />, <T pt="Serviço mais um pequeno lucro sobre a infraestrutura" en="Service plus a small markup on the infrastructure" />],
          ]}
        />
        <ul className="ds-list">
          <li><T pt="Domínio .br: cerca de R$ 40/ano pelo Registro.br, por até 10 anos; registradores terceiros ficam entre R$ 40 e R$ 80/ano. Um .com pode ficar entre R$ 50 e R$ 100/ano. Veja a nota da Cloudflare para comprar e configurar." en="A .br domain: about R$ 40/year at Registro.br, for up to 10 years; third-party registrars run R$ 40 to R$ 80/year. A .com can run R$ 50 to R$ 100/year. See the Cloudflare note for buying and configuring." /></li>
          <li><T pt="Deixar o DNS na Cloudflare (conta do cliente, você como membro) separa o endereço do provedor de hospedagem: trocar de plataforma vira mudar um registro." en="Keeping DNS on Cloudflare (client’s account, you as a member) separates the address from the hosting provider: changing platforms becomes changing one record." /></li>
          <li><T pt="E-mail do domínio (Google Workspace, Zoho, da própria hospedagem) é um serviço à parte; defina quem contrata. Quase todo cliente espera que “venha junto”." en="Domain email (Google Workspace, Zoho, the host’s own) is a separate service; define who subscribes. Almost every client expects it to “come with it”." /></li>
        </ul>
      </Section>
      <Section id="scenarios" title={<T pt="7. Combinações prontas" en="7. Ready-made combinations" />}>
        <Table
          head={[<T pt="Cenário" en="Scenario" />, <T pt="Combinação" en="Combination" />, <T pt="Custo mensal aproximado" en="Approximate monthly cost" />]}
          rows={[
            [<T pt="Landing page sem back-end" en="Landing page, no back-end" />, <T pt="Cloudflare Pages + DNS na Cloudflare" en="Cloudflare Pages + Cloudflare DNS" />, <T pt="Quase zero, mais o domínio" en="Close to zero, plus the domain" />],
            [<T pt="Site institucional com formulário" en="Institutional site with a form" />, <T pt="Netlify (formulários) ou Cloudflare Pages + Worker" en="Netlify (forms) or Cloudflare Pages + Worker" />, <T pt="US$ 0 a 9" en="US$ 0 to 9" />],
            [<T pt="Site em WordPress" en="WordPress site" />, <T pt="Hospedagem compartilhada com renovação confirmada" en="Shared hosting with confirmed renewal" />, <T pt="R$ 10 a 75" en="R$ 10 to 75" />],
            [<T pt="SaaS pequeno com login e banco" en="Small SaaS with login and database" />, <T pt="Vercel Pro + Supabase Pro" en="Vercel Pro + Supabase Pro" />, <T pt="Cerca de US$ 45 somando os dois planos-base" en="About US$ 45 adding both base plans" />],
            [<T pt="API Node com Postgres" en="Node API with Postgres" />, <T pt="Render (web Starter + Postgres) ou Railway Hobby" en="Render (Starter web + Postgres) or Railway Hobby" />, <T pt="Cerca de US$ 13 a 26, segundo comparativos" en="About US$ 13 to 26, per comparisons" />],
            [<T pt="Vários projetos pequenos do mesmo cliente ou da agência" en="Several small projects for one client or the agency" />, <T pt="Um VPS Hetzner com Coolify" en="One Hetzner VPS with Coolify" />, <T pt="Cerca de € 4 a 5 mais seu tempo" en="About € 4 to 5 plus your time" />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> as somas acima são minhas, a partir dos planos-base citados. Consumo acima do incluído (banda, execuções, armazenamento) cobra à parte, e a taxa de câmbio muda o valor em reais.</>} en={<><b>Personal note, not verified in the sources:</b> the sums above are mine, from the base plans cited. Usage beyond what is included (bandwidth, executions, storage) is billed separately, and the exchange rate changes the amount in reais.</>} /></Callout>
      </Section>
      <Section id="rules" title={<T pt="8. Regras para não ter surpresa" en="8. Rules to avoid surprises" />}>
        <ul className="ds-list">
          <li><T pt={<><b>Leia a política de uso comercial.</b> Vercel Hobby proíbe uso comercial, incluindo sites que geram lead ou venda.</>} en={<><b>Read the commercial-use policy.</b> Vercel Hobby forbids commercial use, including sites that generate leads or sales.</>} /></li>
          <li><T pt={<><b>Conheça o que acontece no limite.</b> Cloudflare derruba chamadas no limite diário; Supabase Free pausa; Render Free hiberna; Netlify consome créditos.</>} en={<><b>Know what happens at the limit.</b> Cloudflare fails calls at the daily limit; Supabase Free pauses; Render Free sleeps; Netlify burns credits.</>} /></li>
          <li><T pt={<><b>Ligue limite de gasto e alerta de custo</b> onde existir (Supabase Pro vem com spend cap).</>} en={<><b>Turn on a spend cap and cost alerts</b> where available (Supabase Pro ships with a spend cap).</>} /></li>
          <li><T pt={<><b>Backup:</b> ninguém faz por você num plano grátis. Defina frequência e quem restaura, e escreva no contrato de manutenção.</>} en={<><b>Backups:</b> nobody does it for you on a free plan. Define frequency and who restores, and write it in the maintenance contract.</>} /></li>
          <li><T pt={<><b>Documente</b> onde está cada coisa (domínio, DNS, plataforma, banco, e-mail, analytics) em um arquivo entregue ao cliente.</>} en={<><b>Document</b> where each thing lives (domain, DNS, platform, database, email, analytics) in a file handed to the client.</>} /></li>
          <li><T pt={<><b>Segredos fora do código:</b> variáveis de ambiente da plataforma, nunca no repositório. Veja a nota de segurança de apps web.</>} en={<><b>Secrets out of the code:</b> platform environment variables, never in the repository. See the web app security note.</>} /></li>
        </ul>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · verified on 2026-10-26" />}>
          <ul>
            <li><a href="https://vercel.com/docs/limits">Vercel · Limits (official; table could not be read, figures from third parties)</a></li>
            <li><a href="https://vercel.com/pricing">Vercel · Pricing (official, confirm there)</a></li>
            <li><a href="https://www.netlify.com/changelog/updates-credit-based-personal-and-pro-plans.md">Netlify · Changelog: updates to credit-based Personal and Pro plans (Jul 2026)</a></li>
            <li><a href="https://developers.cloudflare.com/workers/platform/pricing/">Cloudflare · Workers pricing</a></li>
            <li><a href="https://developers.cloudflare.com/d1/platform/limits">Cloudflare · D1 limits</a></li>
            <li><a href="https://neon.com/pricing">Neon · Pricing</a></li>
            <li><a href="https://supabase.com/pricing">Supabase · Pricing (official, confirm there)</a></li>
            <li><a href="https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/">Third party · Supabase pricing 2026 guide</a></li>
            <li><a href="https://guiaferramentasdigitais.com.br/guias/hostinger-review-2026/">Third party · Hostinger review 2026 (affiliate)</a></li>
            <li><a href="https://guiaferramentasdigitais.com.br/guias/hostinger-vs-hostgator/">Third party · Hostinger vs HostGator (affiliate)</a></li>
            <li><a href="https://sota.io/blog/railway-vs-render-vs-fly-pricing-2026">Third party · Railway vs Render vs Fly.io pricing 2026</a></li>
            <li><a href="https://agentdeals.dev/hetzner-pricing-2026">Third party · Hetzner pricing 2026</a></li>
            <li><a href="https://coolify.io/deploy-apps-on-your-own-vps">Coolify · Deploy apps on your own VPS</a></li>
            <li><a href="https://teletime.com.br/14/10/2026/br-6-milhoes/">Teletime · .br domain price (Oct 2026)</a></li>
            <li><a href="https://www.tecmundo.com.br/internet/405860-descubra-quanto-custa-um-dominio-de-site-e-como-registrar-o-seu.htm">TecMundo · How much a domain costs</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
