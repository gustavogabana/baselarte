import { Callout, CodeBlock, Diagram, QA, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "cloudflare-containers-neon",
  title: { en: "Cloudflare Containers and Neon: dev and prod", pt: "Cloudflare Containers e Neon: dev e prod" },
  seo: {
    title: { en: "Tutorial: a Next.js (SSR) front end and a Node API on Cloudflare Containers with Neon Postgres, environment variables, dev equal to prod, exports and LGPD", pt: "Tutorial: front em Next.js (SSR) e API Node no Cloudflare Containers com Neon Postgres, variáveis de ambiente, dev igual a prod, exportação e LGPD" },
    description: { en: "Step by step: a Next.js image with server-side rendering and a Node API image behind a Worker on Cloudflare Containers, Neon Postgres in São Paulo, many environment variables and secrets per container, dev with the same security as production, backups, a D+1/D+7 anonymized copy, exporting data out of Neon (to a customer or to AWS RDS), and what Brazil's LGPD requires.", pt: "Passo a passo: uma imagem Next.js com renderização no servidor e uma imagem da API Node atrás de um Worker no Cloudflare Containers, Neon Postgres em São Paulo, muitas variáveis de ambiente e segredos por container, dev com a mesma segurança de produção, backups, cópia anonimizada D+1/D+7, exportação dos dados do Neon (para o cliente ou para o AWS RDS) e o que a LGPD exige." },
  },
  summary: "a didactic tutorial for running a Dockerized app on Cloudflare Containers with Neon Postgres: a Next.js 16 front end in standalone output (Docker because server-side rendering needs a Node server; connection() so process.env is read per request; no NEXT_PUBLIC_ variables, since they are frozen at build time) and a Node API, each in its own image; a Worker routes /api/* to the API and everything else to Next.js, each container driven by a Durable Object (durable_object scheduling policy, ctx.container.start, getTcpPort, a /health readiness loop, a fixed pool of named instances); the Next.js container has no Internet access and reaches the API during SSR through interceptOutboundHttp on a virtual host handled by a WorkerEntrypoint; environment variables in three kinds (build_vars at build time, vars per environment, secrets set with wrangler secret bulk and declared in secrets.required) with a per-container allowlist passed through start({ env }); dev and production with identical configuration and the same security, differing only in name, domain, data and credentials; Neon (Lakebase Postgres, from Databricks) in aws-sa-east-1 with one project per environment, pooled connection for the app and direct connection for migrations and pg_dump; GitHub Actions for deploy with an approval gate, nightly encrypted pg_dump exports, history window and snapshots, and a D+1/D+7 anonymized refresh from production to dev; getting data out of Neon (no export button or data API: pg_dump/pg_restore, psql \\copy to CSV, or logical replication with Neon as publisher, irreversible wal_level change, sequences not replicated) for a customer request or a move to AWS RDS; and LGPD considerations (controller and processors, international transfer under art. 33 and ANPD Resolution 19/2024, container placement that cannot be pinned to Brazil, access requests within 15 days, retention in backups, incident reporting in 3 business days). Code follows the official Cloudflare, Next.js, Neon, PostgreSQL and AWS docs; nothing was deployed to a Cloudflare or Neon account.",
  kicker: { en: "Cloudflare · Next.js · Neon · LGPD", pt: "Cloudflare · Next.js · Neon · LGPD" },
  heroTitle: { en: <>Two containers on Cloudflare, <em>Postgres on Neon, two environments.</em></>, pt: <>Dois containers na Cloudflare, <em>Postgres no Neon, dois ambientes.</em></> },
  heroLede: { en: "A Next.js front end with server-side rendering and a Node API, each in its own Docker image, run on Cloudflare Containers behind a Worker that splits traffic by path. The database is Neon in São Paulo. Dev and production are identical, with the same security. Along the way: how to feed many environment variables to the images, how to get the data out of Neon, and what Brazil's LGPD changes in this design.", pt: "Um front em Next.js com renderização no servidor e uma API Node, cada um na sua imagem Docker, rodando no Cloudflare Containers atrás de um Worker que divide o tráfego pelo caminho. O banco é o Neon em São Paulo. Dev e produção são iguais, com a mesma segurança. No caminho: como passar muitas variáveis de ambiente para as imagens, como tirar os dados do Neon e o que a LGPD muda nesse desenho." },
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="O desenho" en="The design" /> },
        { id: "before", title: <T pt="1. Antes de começar" en="1. Before you start" /> },
        { id: "images", title: <T pt="2. As duas imagens" en="2. The two images" /> },
        { id: "worker", title: <T pt="3. O Worker e os containers" en="3. The Worker and the containers" /> },
        { id: "vars", title: <T pt="4. Variáveis de ambiente" en="4. Environment variables" /> },
        { id: "envs", title: <T pt="5. Dev igual a produção" en="5. Dev equal to production" /> },
        { id: "neon", title: <T pt="6. Neon: projetos e conexões" en="6. Neon: projects and connections" /> },
        { id: "local", title: <T pt="7. Rodar na sua máquina" en="7. Running on your machine" /> },
        { id: "deploy", title: <T pt="8. Deploy com aprovação" en="8. Deploy with approval" /> },
        { id: "backups", title: <T pt="9. Backups" en="9. Backups" /> },
        { id: "refresh", title: <T pt="10. Prod → dev em D+1 ou D+7" en="10. Prod → dev at D+1 or D+7" /> },
        { id: "export", title: <T pt="11. Tirar os dados do Neon" en="11. Getting the data out of Neon" /> },
        { id: "lgpd", title: <T pt="12. LGPD" en="12. LGPD" /> },
        { id: "verify", title: <T pt="13. Conferir e diagnosticar" en="13. Checking and troubleshooting" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={<T pt="O desenho" en="The design" />}>
        <p><T pt={<>O app de exemplo é um mural de <b>recados</b>: a pessoa deixa o nome e uma mensagem, e a página mostra os últimos vinte. É pequeno, mas guarda dado pessoal, o que torna a parte de LGPD concreta.</>} en={<>The example app is a <b>message board</b> (“recados”): a visitor leaves a name and a message, and the page shows the last twenty. It is small, but it stores personal data, which makes the LGPD part concrete.</>} /></p>
        <p><T pt={<>São três peças. O <b>front</b> é um Next.js que renderiza as páginas no servidor (SSR). A <b>API</b> é um processo Node que fala com o banco. O <b>banco</b> é um Postgres no Neon. As duas primeiras viram imagens Docker; o banco é um serviço gerenciado.</>} en={<>There are three pieces. The <b>front end</b> is Next.js rendering pages on the server (SSR). The <b>API</b> is a Node process that talks to the database. The <b>database</b> is Postgres on Neon. The first two become Docker images; the database is a managed service.</>} /></p>
        <p><T pt={<>No Cloudflare Containers, um container nunca recebe tráfego direto da internet. Quem recebe é um <b>Worker</b> (código JavaScript que roda na borda da Cloudflare). Ele olha o caminho da URL e repassa o pedido para um <b>Durable Object</b>, que liga e controla o container.</>} en={<>On Cloudflare Containers, a container never takes traffic straight from the Internet. A <b>Worker</b> does (JavaScript running at Cloudflare's edge). It looks at the URL path and hands the request to a <b>Durable Object</b>, which starts and controls the container.</>} /></p>
        <Diagram minWidth={540} caption={<T pt="Um Worker por ambiente. /api/* vai para o container da API, o resto para o Next.js. Durante o SSR, o Next chama a API por um host virtual que o próprio Worker atende. Só a API sai para a internet, para falar com o Neon em São Paulo." en="One Worker per environment. /api/* goes to the API container, everything else to Next.js. During SSR, Next calls the API through a virtual host the Worker itself handles. Only the API reaches the Internet, to talk to Neon in São Paulo." />}>
          <svg viewBox="0 0 720 340" role="img" aria-label="Worker, dois containers e Neon / Worker, two containers and Neon">
            <rect x="128" y="10" width="392" height="320" rx="6" className="ln dash" />
            <text x="142" y="30" className="pt mut" textAnchor="start">Cloudflare · rede global</text>
            <text x="142" y="30" className="en mut" textAnchor="start">Cloudflare · global network</text>
            <rect x="8" y="135" width="100" height="60" rx="4" className="ln fillsoft" />
            <text x="58" y="160" className="pt" textAnchor="middle">Visitante</text>
            <text x="58" y="160" className="en" textAnchor="middle">Visitor</text>
            <text x="58" y="179" className="mono mut" textAnchor="middle">HTTPS</text>
            <rect x="146" y="125" width="140" height="80" rx="4" className="ln brandfill" />
            <text x="216" y="150" textAnchor="middle">Worker</text>
            <text x="216" y="170" className="mono mut" textAnchor="middle">/api/* → API</text>
            <text x="216" y="188" className="pt mono mut" textAnchor="middle">resto → WEB</text>
            <text x="216" y="188" className="en mono mut" textAnchor="middle">rest → WEB</text>
            <rect x="330" y="40" width="172" height="70" rx="4" className="ln fillsoft" />
            <text x="416" y="66" textAnchor="middle">Web · Next.js :8080</text>
            <text x="416" y="86" className="pt mut" textAnchor="middle">DO · sem internet</text>
            <text x="416" y="86" className="en mut" textAnchor="middle">DO · no Internet</text>
            <rect x="330" y="220" width="172" height="70" rx="4" className="ln fillsoft" />
            <text x="416" y="246" textAnchor="middle">Api · Node :8080</text>
            <text x="416" y="266" className="mut" textAnchor="middle">DO + container</text>
            <path d="M416 110L416 220" className="ln dash" />
            <path d="M412.5 212.8L416 220L419.5 212.8" className="ln" />
            <text x="424" y="158" className="mono mut" textAnchor="start">SSR</text>
            <text x="424" y="176" className="mono mut" textAnchor="start">api.recados</text>
            <rect x="558" y="210" width="154" height="90" rx="4" className="ln brandfill" />
            <text x="635" y="236" textAnchor="middle">Neon Postgres</text>
            <text x="635" y="256" className="mono mut" textAnchor="middle">aws-sa-east-1</text>
            <text x="635" y="276" className="mono mut" textAnchor="middle">-pooler → main</text>
            <path d="M108 165L146 165" className="ln" />
            <path d="M138.8 168.5L146 165L138.8 161.5" className="ln" />
            <path d="M286 150L308 150L308 75L330 75" className="ln" />
            <path d="M322.8 78.5L330 75L322.8 71.5" className="ln" />
            <path d="M286 180L308 180L308 255L330 255" className="ln" />
            <path d="M322.8 258.5L330 255L322.8 251.5" className="ln" />
            <path d="M502 255L558 255" className="ln" />
            <path d="M550.8 258.5L558 255L550.8 251.5" className="ln" />
            <text x="540" y="245" className="mono mut" textAnchor="middle">TLS</text>
            <text x="324" y="316" className="pt mut" textAnchor="middle">um Worker por ambiente: recados-dev e recados-production</text>
            <text x="324" y="316" className="en mut" textAnchor="middle">one Worker per environment: recados-dev and recados-production</text>
          </svg>
        </Diagram>
        <p><T pt={<>Dev e produção são <b>iguais</b>: mesma imagem, mesma configuração, mesma segurança. A tabela mostra tudo o que muda entre eles, e é de propósito que ela é curta (a <a href="#envs">seção 5</a> explica por quê).</>} en={<>Dev and production are <b>the same</b>: same image, same configuration, same security. The table shows everything that differs between them, and it is short on purpose (<a href="#envs">section 5</a> explains why).</>} /></p>
        <Table
          head={[<T pt="" en="" />, <T pt="dev" en="dev" />, <T pt="produção" en="production" />]}
          rows={[
            [<T pt="Worker" en="Worker" />, <code>recados-dev</code>, <code>recados-production</code>],
            [<T pt="Domínio" en="Domain" />, <code>dev.example.com.br</code>, <code>example.com.br</code>],
            [<T pt="Banco" en="Database" />, <T pt={<>Projeto Neon <code>recados-dev</code></>} en={<>Neon project <code>recados-dev</code></>} />, <T pt={<>Projeto Neon <code>recados-prod</code></>} en={<>Neon project <code>recados-prod</code></>} />],
            [<T pt="Dados" en="Data" />, <T pt="Cópia anonimizada de produção (D+1 ou D+7) ou dados gerados" en="Anonymized copy of production (D+1 or D+7) or generated data" />, <T pt="Reais" en="Real" />],
            [<T pt="Credenciais" en="Credentials" />, <T pt="Próprias de dev, nunca as de produção" en="Dev's own, never production's" />, <T pt="Próprias de produção" en="Production's own" />],
            [<T pt="Quando entra no ar" en="When it goes live" />, <T pt="A cada push na main" en="On every push to main" />, <T pt="Depois que alguém aprova no GitHub" en="After someone approves it on GitHub" />],
          ]}
        />
        <h3><T pt="O roteiro" en="The route" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><b>Construir (seções 1 a 5).</b> As duas imagens, o Worker que as liga, as variáveis de ambiente e a configuração com dois ambientes iguais.</>} en={<><b>Build (sections 1 to 5).</b> Both images, the Worker that drives them, the environment variables and the config with two identical environments.</>} /></li>
          <li><T pt={<><b>Banco e máquina local (6 e 7).</b> Projetos no Neon, strings de conexão e o app inteiro rodando no seu Docker.</>} en={<><b>Database and local machine (6 and 7).</b> Neon projects, connection strings and the whole app running in your Docker.</>} /></li>
          <li><T pt={<><b>Operar (8 a 11).</b> Deploy com aprovação, backups, a cópia de produção para dev e como tirar os dados do Neon.</>} en={<><b>Operate (8 to 11).</b> Deploy with approval, backups, the copy from production to dev, and how to get the data out of Neon.</>} /></li>
          <li><T pt={<><b>Conformidade (12 e 13).</b> O que a LGPD exige deste desenho, e como conferir que tudo funciona.</>} en={<><b>Compliance (12 and 13).</b> What the LGPD asks of this design, and how to check that it all works.</>} /></li>
        </ol>
        <Callout tone="use" icon="check"><T pt={<><b>Notas vizinhas.</b> O mesmo app de dois containers na AWS está na <a href="/notas/front-back-ecs-cloudflare/">nota de front e back no ECS</a>. Postgres em si na <a href="/notas/postgres-for-devs/">nota de Postgres</a>, o RDS na <a href="/notas/rds/">nota de RDS</a> e ferramentas de migration na <a href="/notas/db-migrations/">nota de migrations</a>.</>} en={<><b>Neighbouring notes.</b> The same two-container app on AWS is in the <a href="/notas/front-back-ecs-cloudflare/">front and back on ECS note</a>. Postgres itself in the <a href="/notas/postgres-for-devs/">Postgres note</a>, RDS in the <a href="/notas/rds/">RDS note</a>, and migration tools in the <a href="/notas/db-migrations/">migrations note</a>.</>} /></Callout>
      </Section>

      <Section id="before" title={<T pt="1. Antes de começar" en="1. Before you start" />}>
        <ul className="ds-list">
          <li><T pt={<><em>Conta Cloudflare no plano Workers Paid</em> (US$ 5 por mês). O preço dos Containers é descrito como uso incluído nesse plano, mais o excedente.</>} en={<><em>A Cloudflare account on Workers Paid</em> (US$5 a month). Containers pricing is described as usage included in that plan, plus overage.</>} /></li>
          <li><T pt={<><em>Um domínio ativo na Cloudflare.</em> O <i>custom domain</i> do Worker exige que a zona esteja na conta; a Cloudflare cria o registro DNS e o certificado sozinha.</>} en={<><em>A domain active on Cloudflare.</em> A Worker <i>custom domain</i> requires the zone to be in the account; Cloudflare creates the DNS record and the certificate itself.</>} /></li>
          <li><T pt={<><em>Docker na sua máquina e no CI.</em> O <code>wrangler deploy</code> constrói as imagens localmente e as envia para o registro da Cloudflare. As imagens precisam ser <code>linux/amd64</code>.</>} en={<><em>Docker on your machine and in CI.</em> <code>wrangler deploy</code> builds the images locally and pushes them to Cloudflare's registry. Images must be <code>linux/amd64</code>.</>} /></li>
          <li><T pt={<><em>Conta no Neon</em>, Node 22 e Next.js 16 (que pede Node 20.9 ou mais novo).</>} en={<><em>A Neon account</em>, Node 22 and Next.js 16 (which needs Node 20.9 or newer).</>} /></li>
        </ul>
        <h3><T pt="O que é o Neon hoje" en="What Neon is today" /></h3>
        <p><T pt={<>O Neon é da Databricks. O site se apresenta como “um backend completo da Databricks”, e o banco agora se chama <b>Lakebase Postgres</b>. Para esta nota nada muda: é Postgres de verdade, acessado por uma connection string comum. A diferença para um Postgres tradicional é a arquitetura: computação e armazenamento separados.</>} en={<>Neon belongs to Databricks. Its site calls it “a complete backend from Databricks”, and the database is now called <b>Lakebase Postgres</b>. For this note nothing changes: it is real Postgres, reached with an ordinary connection string. What differs from traditional Postgres is the architecture: compute and storage are separate.</>} /></p>
        <p><T pt="Duas consequências práticas dessa separação aparecem ao longo da nota:" en="Two practical consequences of that split show up throughout the note:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Branches.</em> Uma branch é um clone <i>copy-on-write</i> do banco, criado na hora, inclusive de um ponto no passado. É o que torna o D+1/D+7 da <a href="#refresh">seção 10</a> barato.</>} en={<><em>Branches.</em> A branch is a copy-on-write clone of the database, created instantly, even from a point in the past. That is what makes the D+1/D+7 copy in <a href="#refresh">section 10</a> cheap.</>} /></li>
          <li><T pt={<><em>Scale to zero.</em> Sem conexões por 5 minutos, a computação desliga, e a primeira consulta depois disso espera algumas centenas de milissegundos. No plano Free isso não se desliga; nos pagos, sim.</>} en={<><em>Scale to zero.</em> After 5 minutes without connections the compute shuts down, and the first query after that waits a few hundred milliseconds. On the Free plan this cannot be turned off; on paid plans it can.</>} /></li>
        </ul>
        <Callout tone="info" icon="alert"><T pt={<><b>Por que o front é um container?</b> Um site Next.js só estático caberia num CDN. Com SSR, cada página é montada por um servidor Node no momento do pedido, e esse servidor precisa rodar em algum lugar. O Next gera esse servidor pronto (o modo <code>standalone</code>), e a imagem Docker leva ele para o Cloudflare Containers do mesmo jeito que levaria para qualquer outra nuvem.</>} en={<><b>Why is the front end a container?</b> A purely static Next.js site would fit on a CDN. With SSR, each page is built by a Node server at request time, and that server has to run somewhere. Next generates that server ready to go (<code>standalone</code> mode), and the Docker image carries it to Cloudflare Containers the same way it would to any other cloud.</>} /></Callout>
      </Section>

      <Section id="images" title={<T pt="2. As duas imagens" en="2. The two images" />}>
        <p><T pt="Um repositório, duas pastas com Dockerfile, e o Worker na raiz:" en="One repository, two folders with a Dockerfile each, and the Worker at the root:" /></p>
        <CodeBlock code={`recados/
├── api/                    Node API (image 1)
│   ├── Dockerfile
│   ├── server.js
│   ├── migrate.js          runs in CI, not in the image
│   ├── db/001_recados.sql
│   └── package.json        (+ package-lock.json)
├── web/                    Next.js with SSR (image 2)
│   ├── Dockerfile
│   ├── .dockerignore       keeps .env* out of the image
│   ├── next.config.ts      output: "standalone"
│   ├── lib/config.ts       the only file that reads process.env
│   ├── lib/api.ts          server-side calls to the API
│   └── app/                page.tsx, formulario.tsx, health/route.ts, privacidade/
├── scripts/anonimizar.sql  used by the prod → dev copy
├── src/index.ts            the Worker and the two Durable Objects
├── wrangler.jsonc          dev and production, identical
├── .dev.vars.dev           local secrets (in .gitignore)
└── .github/workflows/      deploy.yml, backup.yml, refresh-dev.yml`} />

        <h3><T pt="2.1 A API" en="2.1 The API" /></h3>
        <p><T pt={<>Node com uma única dependência, o driver <code>pg</code>. Toda rota pública começa com <code>/api</code>, porque o Worker repassa o caminho inteiro. A rota <code>/health</code> não toca no banco: ela só diz que o processo está de pé, e é o que o Worker consulta antes de mandar tráfego.</>} en={<>Node with a single dependency, the <code>pg</code> driver. Every public route starts with <code>/api</code>, because the Worker forwards the whole path. The <code>/health</code> route does not touch the database: it only says the process is up, and it is what the Worker checks before sending traffic.</>} /></p>
        <CodeBlock code={`// api/server.js
import http from 'node:http';
import pg from 'pg';

const PORT = 8080;
// Pooled Neon URL (host with -pooler). Few connections per container: Neon's PgBouncer multiplexes them.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 30_000 });
pool.on('error', (err) => console.error('idle database client failed', err));

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req, limit = 4096) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > limit) throw Object.assign(new Error('body too large'), { status: 413 });
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('invalid JSON'), { status: 400 });
  }
}

async function handle(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');

  // Shallow check used by the Worker before forwarding traffic: the process is up, no database call.
  if (req.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    return json(res, 200, { ok: true, env: process.env.APP_ENV ?? 'local' });
  }

  if (req.method === 'GET' && pathname === '/api/recados') {
    const { rows } = await pool.query('select id, nome, texto, criado_em from recados order by id desc limit 20');
    return json(res, 200, rows);
  }

  if (req.method === 'POST' && pathname === '/api/recados') {
    const body = await readJson(req);
    const nome = String(body.nome ?? '').trim();
    const texto = String(body.texto ?? '').trim();
    if (!nome || nome.length > 80 || !texto || texto.length > 500) {
      return json(res, 422, { error: 'nome (1-80) e texto (1-500) são obrigatórios' });
    }
    const { rows } = await pool.query(
      'insert into recados (nome, texto) values ($1, $2) returning id, nome, texto, criado_em',
      [nome, texto],
    );
    return json(res, 201, rows[0]);
  }

  return json(res, 404, { error: 'not found' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(req.method, req.url, err);
    json(res, err.status ?? 500, { error: err.status ? err.message : 'internal error' });
  });
});

server.listen(PORT, () => console.log(\`api listening on \${PORT} (\${process.env.APP_ENV ?? 'local'})\`));

// Cloudflare sends SIGTERM before stopping a container (on rollout or after the inactivity timeout).
process.on('SIGTERM', () => {
  server.close(() => pool.end().then(() => process.exit(0)));
  server.closeIdleConnections();
});`} />
        <CodeBlock code={`# api/Dockerfile
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]`} />
        <p><T pt={<>A tabela e o script que aplica as migrations. O script roda no CI com a URL <b>direta</b> do banco, nunca dentro do container (veja a <a href="#neon">seção 6</a> sobre direta e pooled).</>} en={<>The table and the script that applies migrations. The script runs in CI with the <b>direct</b> database URL, never inside the container (see <a href="#neon">section 6</a> on direct versus pooled).</>} /></p>
        <CodeBlock code={`-- api/db/001_recados.sql
create table recados (
  id        bigint generated always as identity primary key,
  nome      text not null check (length(nome) between 1 and 80),
  texto     text not null check (length(texto) between 1 and 500),
  criado_em timestamptz not null default now()
);
create index recados_criado_em_idx on recados (criado_em);`} />
        <CodeBlock code={`// api/migrate.js: applies db/*.sql in name order, once each. Run with the DIRECT (non-pooled) URL.
import { readdir, readFile } from 'node:fs/promises';
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL_DIRECT });
await client.connect();
await client.query(\`create table if not exists schema_migrations (
  name text primary key, applied_at timestamptz not null default now())\`);

const dir = new URL('./db/', import.meta.url);
const files = (await readdir(dir)).filter((file) => file.endsWith('.sql')).sort();
for (const file of files) {
  const { rowCount } = await client.query('select 1 from schema_migrations where name = $1', [file]);
  if (rowCount) continue;
  const sql = await readFile(new URL(file, dir), 'utf8');
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('insert into schema_migrations (name) values ($1)', [file]);
    await client.query('commit');
    console.log('applied', file);
  } catch (err) {
    await client.query('rollback');
    throw err;
  }
}
await client.end();`} />
        <Callout tone="info" icon="alert"><T pt={<><b>Um script de 30 linhas no lugar de uma ferramenta.</b> Ele aplica cada arquivo uma vez, em ordem, dentro de uma transação. Para um projeto real, use uma ferramenta de migration (Prisma, Flyway, Alembic…), como mostra a <a href="/notas/db-migrations/">nota de migrations</a>. O princípio é o mesmo.</>} en={<><b>A 30-line script instead of a tool.</b> It applies each file once, in order, inside a transaction. For a real project use a migration tool (Prisma, Flyway, Alembic…), as the <a href="/notas/db-migrations/">migrations note</a> shows. The principle is the same.</>} /></Callout>

        <h3><T pt="2.2 O front em Next.js" en="2.2 The Next.js front end" /></h3>
        <p><T pt={<>Com <code>output: "standalone"</code>, o <code>next build</code> gera em <code>.next/standalone</code> um <code>server.js</code> mínimo, com só os pedaços de <code>node_modules</code> que o app usa. A imagem final roda esse arquivo, sem <code>npm install</code>.</>} en={<>With <code>output: "standalone"</code>, <code>next build</code> writes a minimal <code>server.js</code> to <code>.next/standalone</code>, with only the parts of <code>node_modules</code> the app uses. The final image runs that file, with no <code>npm install</code>.</>} /></p>
        <CodeBlock code={`// web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // .next/standalone/server.js runs without node_modules
  poweredByHeader: false,
};

export default nextConfig;`} />
        <p><T pt={<>O Dockerfile segue o exemplo oficial <code>with-docker</code> do Next: um estágio instala, outro constrói, o último só copia o resultado e roda como usuário sem privilégio. O servidor do standalone lê <code>PORT</code> e <code>HOSTNAME</code> do ambiente; <code>0.0.0.0</code> faz ele aceitar conexões de fora do próprio container.</>} en={<>The Dockerfile follows Next's official <code>with-docker</code> example: one stage installs, another builds, the last only copies the result and runs as an unprivileged user. The standalone server reads <code>PORT</code> and <code>HOSTNAME</code> from the environment; <code>0.0.0.0</code> makes it accept connections from outside the container itself.</>} /></p>
        <CodeBlock code={`# web/Dockerfile: Next.js standalone (based on the official with-docker example)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 8080
CMD ["node", "server.js"]`} />
        <CodeBlock code={`# web/.dockerignore: no .env file ever enters the image
node_modules
.next
.env*`} />
        <p><T pt={<>O ponto que mais importa no Next é <b>quando</b> ele lê as variáveis. Tudo que começa com <code>NEXT_PUBLIC_</code> é copiado para o JavaScript do navegador no <code>next build</code> e fica congelado na imagem. A documentação avisa: uma imagem promovida de dev para produção leva os valores de dev. Por isso este front não usa nenhuma <code>NEXT_PUBLIC_</code>. As variáveis são lidas no servidor, a cada pedido, num único arquivo:</>} en={<>What matters most in Next is <b>when</b> it reads variables. Anything starting with <code>NEXT_PUBLIC_</code> is copied into the browser JavaScript at <code>next build</code> and frozen in the image. The docs warn that an image promoted from dev to production carries dev's values. So this front end uses no <code>NEXT_PUBLIC_</code> at all. Variables are read on the server, on each request, in a single file:</>} /></p>
        <CodeBlock code={`// web/lib/config.ts: the only place that reads process.env. Read per request, never at build time.
import "server-only"; // importing this from a client component is a build error

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(\`missing environment variable \${name}\`);
  return value;
}

export function config() {
  return {
    appEnv: required("APP_ENV"),
    apiUrl: required("API_INTERNAL_URL"), // http://api.recados, handled by the Worker (section 3)
    retencaoDias: Number(required("RETENCAO_DIAS")),
    contatoEncarregado: required("CONTATO_ENCARREGADO"),
  };
}`} />
        <CodeBlock code={`// web/lib/api.ts: server-side calls to the API, during SSR.
import "server-only";
import { config } from "./config";

export type Recado = { id: number; nome: string; texto: string; criado_em: string };

export async function listarRecados(): Promise<Recado[]> {
  const res = await fetch(\`\${config().apiUrl}/api/recados\`, { cache: "no-store" });
  if (!res.ok) throw new Error(\`API answered HTTP \${res.status}\`);
  return res.json();
}`} />
        <p><T pt={<>A página chama <code>connection()</code> antes de ler qualquer coisa. Isso diz ao Next para esperar um pedido de verdade: sem essa linha, ele poderia pré-renderizar a página no build, com as variáveis da máquina de build.</>} en={<>The page calls <code>connection()</code> before reading anything. That tells Next to wait for a real request: without that line it could prerender the page at build time, with the build machine's variables.</>} /></p>
        <CodeBlock code={`// web/app/page.tsx: rendered on the server for every request, with data from the API.
import { connection } from "next/server";
import { listarRecados } from "@/lib/api";
import { config } from "@/lib/config";
import { Formulario } from "./formulario";

export default async function Home() {
  await connection(); // wait for a real request: process.env is read now, not at build time
  const { retencaoDias, contatoEncarregado } = config();
  const recados = await listarRecados();

  return (
    <main>
      <h1>Recados</h1>
      <ul>
        {recados.map((r) => <li key={r.id}>{r.nome}: {r.texto}</li>)}  {/* React escapes text: no XSS */}
      </ul>
      {/* Only plain values cross to the browser, as props. No NEXT_PUBLIC_ variables. */}
      <Formulario retencaoDias={retencaoDias} contato={contatoEncarregado} />
    </main>
  );
}`} />
        <CodeBlock code={`// web/app/formulario.tsx: posts to /api/recados (the Worker sends it to the API), then re-renders.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Formulario({ retencaoDias, contato }: { retencaoDias: number; contato: string }) {
  const router = useRouter();
  const [erro, setErro] = useState("");

  async function enviar(form: FormData) {
    const res = await fetch("/api/recados", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    if (!res.ok) return setErro(\`Erro: HTTP \${res.status}\`);
    setErro("");
    router.refresh(); // a new server render, now with the new message
  }

  return (
    <form action={enviar}>
      <input name="nome" maxLength={80} required placeholder="Nome" />
      <textarea name="texto" maxLength={500} required placeholder="Recado" />
      <button>Enviar</button>
      <p>Guardamos nome e recado por {retencaoDias} dias. <a href="/privacidade">Privacidade</a> · encarregado: {contato}</p>
      {erro && <p role="alert">{erro}</p>}
    </form>
  );
}`} />
        <CodeBlock code={`// web/app/health/route.ts: the Durable Object polls this before sending traffic. No API call.
export function GET() {
  return new Response("ok\\n", { headers: { "cache-control": "no-store" } });
}`} />
        <ul className="ds-list">
          <li><T pt={<><em>Dois caminhos até a API.</em> No servidor (SSR), o Next chama <code>http://api.recados</code>, um host que só existe dentro da Cloudflare (<a href="#worker">seção 3</a>). No navegador, o formulário chama <code>/api/recados</code>, um caminho <b>relativo</b> que o Worker manda para a API. Nenhum dos dois depende do domínio, então a mesma imagem serve dev e produção.</>} en={<><em>Two roads to the API.</em> On the server (SSR), Next calls <code>http://api.recados</code>, a host that only exists inside Cloudflare (<a href="#worker">section 3</a>). In the browser, the form calls <code>/api/recados</code>, a <b>relative</b> path the Worker sends to the API. Neither depends on the domain, so the same image serves dev and production.</>} /></li>
          <li><T pt={<><em>Cache por instância.</em> O cache do Next fica no disco do container, que é efêmero e separado em cada instância do pool. Esta página não usa cache (<code>no-store</code>). Se o seu app usar, a documentação do Next indica um <code>cacheHandler</code> compartilhado.</>} en={<><em>Per-instance cache.</em> Next's cache lives on the container's disk, which is ephemeral and separate in each pool instance. This page uses no cache (<code>no-store</code>). If your app does, Next's docs point to a shared <code>cacheHandler</code>.</>} /></li>
          <li><T pt={<><em>Desligamento.</em> Ao receber <code>SIGTERM</code>, o servidor do Next termina os pedidos em andamento antes de sair, então não é preciso código próprio, ao contrário da API.</>} en={<><em>Shutdown.</em> On <code>SIGTERM</code>, the Next server finishes in-flight requests before exiting, so no code of your own is needed, unlike the API.</>} /></li>
        </ul>
        <p><T pt={<>O formulário avisa, ao lado do botão, quais dados são guardados, por quanto tempo, onde está a política de privacidade e quem é o encarregado. Isso é o princípio da transparência da LGPD aplicado na tela, e volta na <a href="#lgpd">seção 12</a>. Os dois valores vêm de variáveis de ambiente, porque mudam por decisão jurídica, não por código.</>} en={<>Next to the button, the form says which data is kept, for how long, where the privacy policy is and who the data protection officer is. That is the LGPD transparency principle applied on screen, and it comes back in <a href="#lgpd">section 12</a>. Both values come from environment variables, because they change by legal decision, not by code.</>} /></p>
      </Section>

      <Section id="worker" title={<T pt="3. O Worker e os containers" en="3. The Worker and the containers" />}>
        <p><T pt={<>Cada container pertence a uma <b>classe de Durable Object</b>. Um Durable Object é um objeto com nome, que vive num único lugar da rede da Cloudflare. Quando ele recebe o primeiro pedido, liga o seu container com <code>ctx.container.start()</code>. Daí em diante, repassa os pedidos pela porta do container com <code>getTcpPort(8080).fetch()</code>.</>} en={<>Each container belongs to a <b>Durable Object class</b>. A Durable Object is a named object that lives in one place on Cloudflare's network. When it gets its first request, it starts its container with <code>ctx.container.start()</code>. From then on, it forwards requests to the container's port with <code>getTcpPort(8080).fetch()</code>.</>} /></p>
        <p><T pt={<>Um detalhe importa: <code>start()</code> volta antes de o processo estar pronto. A documentação diz que <code>running</code> verdadeiro não garante que o container já aceita pedidos. Por isso o código consulta <code>/health</code> até receber 200, como no exemplo oficial.</>} en={<>One detail matters: <code>start()</code> returns before the process is ready. The docs say that <code>running</code> being true does not mean the container accepts requests yet. So the code polls <code>/health</code> until it gets a 200, as in the official example.</>} /></p>
        <p><T pt={<>O outro detalhe é como o Next chega à API durante o SSR <b>sem acesso à internet</b>. O container web registra um <i>intercept</i>: todo pedido HTTP que ele fizer para <code>api.recados</code> é atendido por código do Worker (a classe <code>ApiGateway</code>), que o entrega ao pool da API. Esse host não existe no DNS público; a rede do container só responde pelos hosts interceptados.</>} en={<>The other detail is how Next reaches the API during SSR <b>with no Internet access</b>. The web container registers an <i>intercept</i>: every HTTP request it makes to <code>api.recados</code> is handled by Worker code (the <code>ApiGateway</code> class), which hands it to the API pool. That host does not exist in public DNS; the container's network only answers for intercepted hosts.</>} /></p>
        <CodeBlock code={`// src/index.ts: the Worker (router), the gateway for SSR and one Durable Object class per container.
import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";

const PORT = 8080;
const IDLE_MS = 10 * 60 * 1000; // stop the container after 10 min without requests

// What each container receives (section 4). The web container never sees DATABASE_URL.
const WEB_ENV = ["APP_ENV", "API_INTERNAL_URL", "RETENCAO_DIAS", "CONTATO_ENCARREGADO"] as const;
const API_ENV = ["APP_ENV", "LOG_LEVEL", "DATABASE_URL"] as const;

/** Copies the listed vars and secrets from the Worker env, and fails loudly if one is missing. */
function pick(env: Env, keys: readonly (keyof Env)[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = env[key];
    if (typeof value !== "string" || value === "") throw new Error(\`missing var or secret \${String(key)}\`);
    out[key] = value;
  }
  return out;
}

/** A fixed pool of named instances; a random one takes each request (Cloudflare's load-balancing pattern). */
function pickInstance(namespace: DurableObjectNamespace, env: Env) {
  const index = Math.floor(Math.random() * Number(env.POOL_SIZE));
  return namespace.getByName(\`pool-\${index}\`);
}

/** Starts its container on the first request, waits for /health, then forwards every request. */
abstract class ContainerProxy extends DurableObject<Env> {
  private starting?: Promise<void>;

  protected abstract startOptions(images: Record<string, string>): ContainerStartupOptions;
  /** Runs before every start: intercepts last only until the container stops. */
  protected async beforeStart(_container: Container): Promise<void> {}

  async fetch(request: Request): Promise<Response> {
    const container = this.ctx.container!;
    if (!container.running) this.starting = undefined; // it stopped (idle or crash): start again
    this.starting ??= this.boot();
    await this.starting;

    const url = new URL(request.url);
    const forwarded = new Request(new URL(url.pathname + url.search, "http://container"), request);
    forwarded.headers.delete("host");
    return container.getTcpPort(PORT).fetch(forwarded);
  }

  private async boot(): Promise<void> {
    const container = this.ctx.container!;
    if (!container.running) {
      await this.beforeStart(container);
      container.start(this.startOptions(container.images));
    }
    await container.setInactivityTimeout(IDLE_MS);
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const res = await container.getTcpPort(PORT).fetch("http://container/health", { signal: AbortSignal.timeout(1000) });
        if (res.ok) return;
      } catch {
        // Not listening yet: expected while the process boots. Try again below.
      }
      await scheduler.wait(200);
    }
    this.starting = undefined;
    throw new Error(\`container did not answer /health on port \${PORT}\`);
  }
}

/** Next.js. No Internet: the only way out is http://api.recados, handled by ApiGateway. */
export class Web extends ContainerProxy {
  protected startOptions(images: Record<string, string>): ContainerStartupOptions {
    return { image: images.base, instance: "basic", enableInternet: false, env: pick(this.env, WEB_ENV) };
  }
  protected async beforeStart(container: Container): Promise<void> {
    await container.interceptOutboundHttp("api.recados", this.ctx.exports.ApiGateway({ props: {} }));
  }
}

/** Node API. Needs the Internet to reach Neon; the database URL is a Worker secret. */
export class Api extends ContainerProxy {
  protected startOptions(images: Record<string, string>): ContainerStartupOptions {
    return { image: images.base, instance: "basic", enableInternet: true, env: pick(this.env, API_ENV) };
  }
}

/** Requests the web container sends to http://api.recados land here, inside the Workers runtime. */
export class ApiGateway extends WorkerEntrypoint<Env> {
  fetch(request: Request): Promise<Response> {
    return pickInstance(this.env.API, this.env).fetch(request);
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const namespace = pathname === "/api" || pathname.startsWith("/api/") ? env.API : env.WEB;
    return pickInstance(namespace, env).fetch(request);
  },
} satisfies ExportedHandler<Env>;`} />
        <ul className="ds-list">
          <li><T pt={<><em>Um pool fixo de instâncias com nome.</em> Cada nome (<code>pool-0</code>, <code>pool-1</code>…) é um Durable Object com o seu container. O Worker sorteia um nome por pedido, que é o padrão de balanceamento da documentação. O tamanho do pool vem de <code>POOL_SIZE</code>, igual nos dois ambientes.</>} en={<><em>A fixed pool of named instances.</em> Each name (<code>pool-0</code>, <code>pool-1</code>…) is a Durable Object with its own container. The Worker picks a name at random for each request, which is the load-balancing pattern from the docs. The pool size comes from <code>POOL_SIZE</code>, the same in both environments.</>} /></li>
          <li><T pt={<><em>Internet só para quem precisa.</em> O Next sobe com <code>enableInternet: false</code>: só sai pelo intercept, e só para a API. A API precisa de <code>true</code> para chegar ao Neon. Um front comprometido sem saída para a internet não consegue mandar dados para fora.</>} en={<><em>Internet only where needed.</em> Next starts with <code>enableInternet: false</code>: its only way out is the intercept, and only to the API. The API needs <code>true</code> to reach Neon. A compromised front end with no way out to the Internet cannot send data anywhere.</>} /></li>
          <li><T pt={<><em>O intercept é registrado antes de cada <code>start()</code>.</em> A documentação diz que ele dura até o container parar. Como o container para por inatividade, o registro fica no <code>boot()</code>, que roda em todo início. O intercept HTTP não pega HTTPS, e não precisa: o tráfego não sai da Cloudflare.</>} en={<><em>The intercept is registered before every <code>start()</code>.</em> The docs say it lasts until the container stops. Since the container stops when idle, the registration lives in <code>boot()</code>, which runs on every start. The HTTP intercept does not catch HTTPS, and does not need to: the traffic never leaves Cloudflare.</>} /></li>
          <li><T pt={<><em>Desligar por inatividade.</em> Sem pedidos por 10 minutos, o container para (o máximo é 6 horas). O disco é efêmero: ao religar, ele volta limpo, igual à imagem. Nada que importe pode ficar no disco do container; o que importa vai para o banco.</>} en={<><em>Idle shutdown.</em> After 10 minutes without requests the container stops (the maximum is 6 hours). The disk is ephemeral: on restart it comes back clean, like the image. Nothing that matters can live on the container's disk; what matters goes to the database.</>} /></li>
          <li><T pt={<><em>Partida a frio.</em> A documentação fala em 1 a 3 segundos, dependendo do tamanho da imagem. Imagens Alpine e o modo <code>standalone</code> do Next ajudam.</>} en={<><em>Cold start.</em> The docs say 1 to 3 seconds, depending on image size. Alpine images and Next's <code>standalone</code> mode help.</>} /></li>
        </ul>
        <Table
          head={[<T pt="Tamanho" en="Size" />, "vCPU", <T pt="Memória" en="Memory" />, <T pt="Disco" en="Disk" />]}
          rows={[
            [<code>lite</code>, "1/16", "256 MiB", "2 GB"],
            [<code>basic</code>, "1/4", "1 GiB", "4 GB"],
            [<code>standard-1</code>, "1/2", "4 GiB", "8 GB"],
            [<code>standard-2</code>, "1", "6 GiB", "12 GB"],
            [<code>standard-3</code>, "2", "8 GiB", "16 GB"],
            [<code>standard-4</code>, "4", "12 GiB", "20 GB"],
          ]}
        />
        <p><T pt={<>O tamanho é escolhido no <code>start()</code> (<code>instance</code>), não no wrangler. Os dois containers usam <code>basic</code>: o SSR do Next não cabe com folga em 256 MiB. A cobrança é por cada 10 ms de container ligado: memória e disco pelo tamanho reservado, CPU pelo uso real. Um container desligado por inatividade não cobra.</>} en={<>The size is chosen in <code>start()</code> (<code>instance</code>), not in wrangler. Both containers use <code>basic</code>: Next's SSR does not fit comfortably in 256 MiB. Billing is per 10 ms the container runs: memory and disk by the provisioned size, CPU by actual use. A container stopped for inactivity costs nothing.</>} /></p>
      </Section>

      <Section id="vars" title={<T pt="4. Variáveis de ambiente" en="4. Environment variables" />}>
        <p><T pt={<>Um projeto real tem dezenas de variáveis: URLs, chaves de serviços, ajustes de log, textos jurídicos. Neste desenho elas são de três tipos, e cada tipo tem um lugar diferente. A regra que organiza tudo: <b>a imagem não carrega nenhum valor que mude entre dev e produção</b>. Os valores entram quando o container liga.</>} en={<>A real project has dozens of variables: URLs, service keys, log settings, legal texts. In this design they come in three kinds, and each kind has its own place. The rule that organises everything: <b>the image carries no value that differs between dev and production</b>. Values come in when the container starts.</>} /></p>
        <Table
          head={[<T pt="Tipo" en="Kind" />, <T pt="Onde fica" en="Where it lives" />, <T pt="Quando entra" en="When it comes in" />, <T pt="Exemplos" en="Examples" />]}
          rows={[
            [<T pt="De build" en="Build-time" />, <T pt={<><code>build_vars</code> na imagem, no wrangler (vira <code>ARG</code> no Dockerfile)</>} en={<><code>build_vars</code> on the image, in wrangler (an <code>ARG</code> in the Dockerfile)</>} />, <code>wrangler deploy</code>, <T pt="Versão do app, commit. Nunca segredo, nunca valor que muda por ambiente" en="App version, commit. Never a secret, never a per-environment value" />],
            [<T pt="Comum, de execução" en="Plain, runtime" />, <T pt={<><code>vars</code> de cada ambiente no <code>wrangler.jsonc</code>, no git</>} en={<><code>vars</code> per environment in <code>wrangler.jsonc</code>, in git</>} />, <T pt={<><code>start(&#123; env &#125;)</code></>} en={<><code>start(&#123; env &#125;)</code></>} />, <code>APP_ENV, LOG_LEVEL, API_INTERNAL_URL, RETENCAO_DIAS</code>],
            [<T pt="Segredo" en="Secret" />, <T pt={<><i>Secrets</i> do Worker, cifrados na Cloudflare, fora do git</>} en={<>Worker <i>secrets</i>, encrypted at Cloudflare, out of git</>} />, <T pt={<><code>start(&#123; env &#125;)</code></>} en={<><code>start(&#123; env &#125;)</code></>} />, <T pt={<><code>DATABASE_URL</code>, chaves de pagamento, senha de SMTP</>} en={<><code>DATABASE_URL</code>, payment keys, SMTP password</>} />],
          ]}
        />
        <p><T pt={<>Um container não lê os <i>vars</i> nem os <i>secrets</i> do Worker sozinho. Eles só chegam ao processo se o Durable Object os passar no <code>env</code> do <code>start()</code>. Isso é bom: cada container recebe só a sua lista (<code>WEB_ENV</code> e <code>API_ENV</code> na <a href="#worker">seção 3</a>), e o front nunca vê a senha do banco.</>} en={<>A container does not read the Worker's <i>vars</i> or <i>secrets</i> on its own. They only reach the process if the Durable Object passes them in <code>start()</code>'s <code>env</code>. That is a good thing: each container gets only its own list (<code>WEB_ENV</code> and <code>API_ENV</code> in <a href="#worker">section 3</a>), and the front end never sees the database password.</>} /></p>

        <h3><T pt="4.1 Comuns: vars por ambiente" en="4.1 Plain values: vars per environment" /></h3>
        <p><T pt={<>Ficam no <code>wrangler.jsonc</code>, dentro de cada ambiente, porque <code>vars</code> não é herdado do topo do arquivo (<a href="#envs">seção 5</a>). A documentação lembra que <code>vars</code> não é cifrado: nada sensível vai ali.</>} en={<>They live in <code>wrangler.jsonc</code>, inside each environment, because <code>vars</code> is not inherited from the top of the file (<a href="#envs">section 5</a>). The docs point out that <code>vars</code> is not encrypted: nothing sensitive goes there.</>} /></p>

        <h3><T pt="4.2 Segredos: declarados, cadastrados em lote" en="4.2 Secrets: declared, set in bulk" /></h3>
        <p><T pt={<>Os <b>nomes</b> dos segredos ficam no git, em <code>secrets.required</code>. Com isso, o <code>wrangler deploy</code> falha se faltar algum naquele ambiente, e o <code>wrangler types</code> gera o tipo <code>Env</code> com eles. Os <b>valores</b> nunca vão para o git:</>} en={<>Secret <b>names</b> live in git, in <code>secrets.required</code>. With that, <code>wrangler deploy</code> fails if one is missing in that environment, and <code>wrangler types</code> generates the <code>Env</code> type with them. The <b>values</b> never go to git:</>} /></p>
        <CodeBlock code={`// in wrangler.jsonc, inside each environment (secrets is not inherited either).
// This app needs only DATABASE_URL; a real project's list grows like this:
"secrets": { "required": ["DATABASE_URL", "PAGAMENTOS_API_KEY", "SMTP_PASSWORD"] }`} />
        <p><T pt={<>Para cadastrar vários de uma vez, o <code>wrangler secret bulk</code> lê um arquivo JSON ou <code>.env</code> (até 100 segredos por comando). Gere o arquivo a partir do cofre de senhas da equipe, use e apague:</>} en={<>To set many at once, <code>wrangler secret bulk</code> reads a JSON or <code>.env</code> file (up to 100 secrets per command). Generate the file from the team's password vault, use it and delete it:</>} /></p>
        <CodeBlock code={`umask 077                                   # the file is readable only by you
cat > secrets.production.env <<'EOT'        # values from the password vault, never typed into git
DATABASE_URL="postgresql://app:...@ep-xxx-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require"
PAGAMENTOS_API_KEY="..."
SMTP_PASSWORD="..."
EOT
npx wrangler secret bulk secrets.production.env --env production
shred -u secrets.production.env

npx wrangler secret list --env production   # names only; values cannot be read back`} />
        <p><T pt={<>A fonte da verdade dos segredos de execução é a Cloudflare: o deploy não precisa deles, só confere que existem. O GitHub guarda apenas o que o CI usa (token da Cloudflare, URL direta para migrations). Uma cópia a menos é um lugar a menos para vazar.</>} en={<>Cloudflare is the source of truth for runtime secrets: deploy does not need them, it only checks they exist. GitHub keeps only what CI uses (the Cloudflare token, the direct URL for migrations). One copy fewer is one place fewer to leak from.</>} /></p>

        <h3><T pt="4.3 Adicionar uma variável nova" en="4.3 Adding a new variable" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><b>Comum:</b> a chave em <code>vars</code> nos <b>dois</b> ambientes. <b>Segredo:</b> o nome em <code>secrets.required</code> nos dois, e o valor com <code>wrangler secret put NOME --env dev</code> e <code>--env production</code>.</>} en={<><b>Plain:</b> the key in <code>vars</code> in <b>both</b> environments. <b>Secret:</b> the name in <code>secrets.required</code> in both, and the value with <code>wrangler secret put NAME --env dev</code> and <code>--env production</code>.</>} /></li>
          <li><T pt={<>O nome na lista do container que usa (<code>WEB_ENV</code> ou <code>API_ENV</code>), e <code>npx wrangler types</code> para atualizar o <code>Env</code>.</>} en={<>The name in the list of the container that uses it (<code>WEB_ENV</code> or <code>API_ENV</code>), and <code>npx wrangler types</code> to update <code>Env</code>.</>} /></li>
          <li><T pt={<>A leitura no código: no Next, só em <code>lib/config.ts</code>; na API, num ponto só, no início. Variável que falta derruba o início, não o pedido número mil.</>} en={<>The read in code: in Next, only in <code>lib/config.ts</code>; in the API, in one place, at startup. A missing variable breaks the start, not request number one thousand.</>} /></li>
          <li><T pt={<>Localmente, o valor em <code>.dev.vars.dev</code> (<a href="#local">seção 7</a>).</>} en={<>Locally, the value in <code>.dev.vars.dev</code> (<a href="#local">section 7</a>).</>} /></li>
        </ol>
        <ul className="ds-list">
          <li><T pt={<><em>Trocar um valor exige reiniciar.</em> O container lê o <code>env</code> quando liga. Depois de um <code>secret put</code>, quem já está rodando continua com o valor antigo até parar por inatividade ou até o próximo deploy.</>} en={<><em>Changing a value needs a restart.</em> The container reads <code>env</code> when it starts. After a <code>secret put</code>, running containers keep the old value until they stop for inactivity or until the next deploy.</>} /></li>
          <li><T pt={<><em>Variável e segredo com o mesmo nome</em> não podem coexistir na mesma versão do Worker.</>} en={<><em>A variable and a secret with the same name</em> cannot coexist in the same Worker version.</>} /></li>
          <li><T pt={<><em>Segredos de build</em> (um token para baixar pacote privado, por exemplo) não devem ir em <code>build_vars</code>, que acabam no histórico da imagem. A documentação manda construir e enviar a imagem à mão, com <code>wrangler containers push</code>.</>} en={<><em>Build secrets</em> (a token to fetch a private package, for example) must not go into <code>build_vars</code>, which end up in the image history. The docs say to build and push the image yourself, with <code>wrangler containers push</code>.</>} /></li>
          <li><T pt={<><em>Segredos da conta inteira.</em> O Secrets Store da Cloudflare (em beta aberto) guarda um segredo uma vez para vários Workers, lido com <code>await env.NOME.get()</code>. Útil quando muitos serviços usam a mesma chave; para este app, os <i>secrets</i> por Worker bastam.</>} en={<><em>Account-wide secrets.</em> Cloudflare's Secrets Store (in open beta) keeps a secret once for many Workers, read with <code>await env.NAME.get()</code>. Useful when many services share a key; for this app, per-Worker <i>secrets</i> are enough.</>} /></li>
        </ul>
      </Section>

      <Section id="envs" title={<T pt="5. Dev igual a produção" en="5. Dev equal to production" />}>
        <p><T pt={<>Dev existe para pegar o problema antes de produção. Se dev for mais frouxo, ele deixa de pegar justamente os problemas de segurança e de configuração: o segredo que falta, o container sem internet que tenta sair, a permissão de banco apertada demais. Por isso aqui dev é uma <b>cópia</b> de produção, com a mesma segurança. Só mudam quatro coisas: nome, domínio, dados e credenciais.</>} en={<>Dev exists to catch problems before production. If dev is looser, it stops catching exactly the security and configuration problems: the missing secret, the Internet-less container trying to get out, the database permission that is too tight. So here dev is a <b>copy</b> of production, with the same security. Only four things differ: name, domain, data and credentials.</>} /></p>
        <p><T pt={<>No wrangler, cada ambiente vira um <b>Worker separado</b>, chamado <code>&lt;nome&gt;-&lt;ambiente&gt;</code>: aqui, <code>recados-dev</code> e <code>recados-production</code>. Eles não compartilham nada: nem containers, nem Durable Objects, nem segredos.</>} en={<>In wrangler, each environment becomes a <b>separate Worker</b>, named <code>&lt;name&gt;-&lt;environment&gt;</code>: here, <code>recados-dev</code> and <code>recados-production</code>. They share nothing: no containers, no Durable Objects, no secrets.</>} /></p>
        <CodeBlock code={`// wrangler.jsonc: two identical environments (recados-dev, recados-production).
// Only routes, APP_ENV and the secret values differ.
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "recados",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-01",
  "observability": { "enabled": true },
  "workers_dev": false,
  // Inheritable: each environment gets the same two Durable Object classes.
  "exports": {
    "Web": { "type": "durable-object", "storage": "sqlite" },
    "Api": { "type": "durable-object", "storage": "sqlite" }
  },
  "env": {
    "dev": {
      "routes": [{ "pattern": "dev.example.com.br", "custom_domain": true }],
      "vars": {
        "APP_ENV": "dev", "POOL_SIZE": "3", "LOG_LEVEL": "info",
        "API_INTERNAL_URL": "http://api.recados", "RETENCAO_DIAS": "90",
        "CONTATO_ENCARREGADO": "privacidade@example.com.br"
      },
      "secrets": { "required": ["DATABASE_URL"] },
      // Not inherited: containers and durable_objects are repeated in every environment.
      "containers": [
        { "class_name": "Web", "scheduling_policy": "durable_object", "images": { "base": { "dockerfile": "./web/Dockerfile" } } },
        { "class_name": "Api", "scheduling_policy": "durable_object", "images": { "base": { "dockerfile": "./api/Dockerfile" } } }
      ],
      "durable_objects": {
        "bindings": [
          { "name": "WEB", "class_name": "Web" },
          { "name": "API", "class_name": "Api" }
        ]
      }
    },
    "production": {
      "routes": [{ "pattern": "example.com.br", "custom_domain": true }],
      "vars": {
        "APP_ENV": "production", "POOL_SIZE": "3", "LOG_LEVEL": "info",
        "API_INTERNAL_URL": "http://api.recados", "RETENCAO_DIAS": "90",
        "CONTATO_ENCARREGADO": "privacidade@example.com.br"
      },
      "secrets": { "required": ["DATABASE_URL"] },
      "containers": [
        { "class_name": "Web", "scheduling_policy": "durable_object", "images": { "base": { "dockerfile": "./web/Dockerfile" } } },
        { "class_name": "Api", "scheduling_policy": "durable_object", "images": { "base": { "dockerfile": "./api/Dockerfile" } } }
      ],
      "durable_objects": {
        "bindings": [
          { "name": "WEB", "class_name": "Web" },
          { "name": "API", "class_name": "Api" }
        ]
      }
    }
  }
}`} />
        <p><T pt={<>A pegadinha é a herança. Algumas chaves passam do topo para os ambientes (<code>name</code>, <code>main</code>, <code>compatibility_date</code>, <code>exports</code>, <code>routes</code>). Outras não: <code>vars</code>, <code>secrets</code>, <code>durable_objects</code>, <code>containers</code> e <code>hyperdrive</code> precisam ser repetidas em <b>cada</b> ambiente. É fácil um ambiente ficar para trás. Uma checagem simples no CI evita isso: compare os blocos dos dois ambientes, ignorando as chaves que podem mudar.</>} en={<>The catch is inheritance. Some keys flow from the top level into environments (<code>name</code>, <code>main</code>, <code>compatibility_date</code>, <code>exports</code>, <code>routes</code>). Others do not: <code>vars</code>, <code>secrets</code>, <code>durable_objects</code>, <code>containers</code> and <code>hyperdrive</code> must be repeated in <b>each</b> environment. It is easy for one environment to fall behind. A simple CI check prevents that: compare both environment blocks, ignoring the keys allowed to differ.</>} /></p>
        <CodeBlock code={`npx wrangler types --env dev                       # generates the Env type (WEB, API, vars and secrets)
npx wrangler deploy --dry-run --env production     # validates the config and builds both images`} />
        <Table
          head={[<T pt="Controle" en="Control" />, <T pt="dev e produção" en="dev and production" />]}
          rows={[
            [<T pt="Imagem" en="Image" />, <T pt="O mesmo Dockerfile, construído do mesmo commit" en="The same Dockerfile, built from the same commit" />],
            [<T pt="Containers" en="Containers" />, <T pt={<>Mesmo tamanho (<code>basic</code>), mesmo pool (3), mesmo <code>enableInternet</code> e mesmo intercept</>} en={<>Same size (<code>basic</code>), same pool (3), same <code>enableInternet</code> and same intercept</>} />],
            [<T pt="Segredos" en="Secrets" />, <T pt={<>Mesma lista em <code>secrets.required</code>; valores diferentes, nunca compartilhados</>} en={<>Same list in <code>secrets.required</code>; different values, never shared</>} />],
            [<T pt="Banco" en="Database" />, <T pt={<>Projetos Neon no mesmo plano e região, branch <code>main</code> protegida, papel próprio do app, TLS</>} en={<>Neon projects on the same plan and region, protected <code>main</code> branch, the app's own role, TLS</>} />],
            [<T pt="Acesso" en="Access" />, <T pt="Tokens da Cloudflare e chaves do Neon separados por ambiente, com o mínimo de permissão" en="Cloudflare tokens and Neon keys separate per environment, with least privilege" />],
            [<T pt="Deploy" en="Deploy" />, <T pt={<>Só a partir da <code>main</code>, que só recebe código revisado em PR; produção ainda pede aprovação</>} en={<>Only from <code>main</code>, which only takes code reviewed in a PR; production also needs approval</>} />],
            [<T pt="Logs e retenção" en="Logs and retention" />, <T pt="Mesma observabilidade, mesma retenção de 90 dias" en="Same observability, same 90-day retention" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>A consequência: credenciais de dev valem como as de produção.</b> Se dev tem a mesma segurança, a senha do banco de dev não circula em notebook, chat ou <code>.env</code> compartilhado. Quem desenvolve usa um Postgres local (<a href="#local">seção 7</a>), e só o CI e a Cloudflare conhecem as credenciais de dev. Dados anonimizados reduzem o dano de um vazamento, mas não são desculpa para afrouxar o resto.</>} en={<><b>The consequence: dev credentials count as much as production's.</b> If dev has the same security, the dev database password does not travel on laptops, in chat or in a shared <code>.env</code>. Developers use a local Postgres (<a href="#local">section 7</a>), and only CI and Cloudflare know dev's credentials. Anonymized data limits the damage of a leak, but is no excuse to loosen the rest.</>} /></Callout>
        <Callout tone="info" icon="alert"><T pt={<><b>A política de agendamento.</b> A chave <code>"scheduling_policy": "durable_object"</code> é a que a documentação usa hoje: cada container pertence a um Durable Object. A política antiga (<code>default</code>, ou sem a chave) está marcada como obsoleta, e a nova ainda é beta. Na nova, opções como <code>instance_type</code>, <code>max_instances</code> e restrições de região não são aceitas no wrangler, e as variáveis de build se chamam <code>build_vars</code> (na antiga, <code>image_vars</code>). A falta de restrição de região pesa na LGPD (<a href="#lgpd">seção 12</a>).</>} en={<><b>The scheduling policy.</b> <code>"scheduling_policy": "durable_object"</code> is what the docs use today: each container belongs to a Durable Object. The old policy (<code>default</code>, or no key) is marked deprecated, and the new one is still in beta. Under the new one, wrangler rejects options such as <code>instance_type</code>, <code>max_instances</code> and region constraints, and build variables are called <code>build_vars</code> (in the old one, <code>image_vars</code>). The lack of region constraints matters for the LGPD (<a href="#lgpd">section 12</a>).</>} /></Callout>
      </Section>

      <Section id="neon" title={<T pt="6. Neon: projetos e conexões" en="6. Neon: projects and connections" />}>
        <h3><T pt="6.1 Um projeto por ambiente, em São Paulo" en="6.1 One project per environment, in São Paulo" /></h3>
        <p><T pt={<>Crie dois projetos no console do Neon, no mesmo plano: <code>recados-prod</code> e <code>recados-dev</code>, os dois na região <b>AWS South America (São Paulo)</b>, id <code>aws-sa-east-1</code>. A região é escolhida na criação do projeto e não muda depois; trocar exige um projeto novo e migrar os dados.</>} en={<>Create two projects in the Neon console, on the same plan: <code>recados-prod</code> and <code>recados-dev</code>, both in <b>AWS South America (São Paulo)</b>, id <code>aws-sa-east-1</code>. The region is chosen when the project is created and cannot change later; moving means a new project and migrating the data.</>} /></p>
        <p><T pt="Por que dois projetos, se o Neon tem branches? Branch é ótima para cópias rápidas, mas mora no mesmo projeto: mesma chave de API, mesmas pessoas com acesso ao console. Projetos separados deixam produção fechada para quem só trabalha em dev." en="Why two projects, when Neon has branches? A branch is great for quick copies, but it lives in the same project: same API key, same people with console access. Separate projects keep production closed to people who only work on dev." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Nos dois projetos,</em> marque a branch <code>main</code> como <b>protegida</b> (planos pagos). Branch protegida não pode ser apagada nem resetada. Em dev também: um <code>reset</code> acidental em dev é o ensaio de um em produção.</>} en={<><em>In both projects,</em> mark the <code>main</code> branch as <b>protected</b> (paid plans). A protected branch cannot be deleted or reset. In dev too: an accidental <code>reset</code> in dev is the rehearsal of one in production.</>} /></li>
          <li><T pt={<><em>Crie um banco <code>recados</code></em> em cada projeto e um papel (role) só para o app, com as mesmas permissões nos dois, em vez de usar o dono do banco.</>} en={<><em>Create a <code>recados</code> database</em> in each project, and a role just for the app with the same grants in both, instead of the database owner.</>} /></li>
          <li><T pt={<><em>A única diferença é o conteúdo.</em> Dev recebe as mesmas migrations e, uma vez por semana ou por dia, uma cópia anonimizada de produção (<a href="#refresh">seção 10</a>).</>} en={<><em>The only difference is the content.</em> Dev gets the same migrations and, once a week or once a day, an anonymized copy of production (<a href="#refresh">section 10</a>).</>} /></li>
        </ul>

        <Callout tone="warn" icon="alert"><T pt={<><b>A distância entre a API e o banco.</b> O container roda onde o seu Durable Object estiver, e a documentação avisa que hoje Durable Objects não nascem na América do Sul: quem pede América do Sul recebe o leste da América do Norte. Ou seja, a API roda lá, e o banco está em São Paulo. Cada consulta atravessa essa distância, ida e volta. Faça poucas consultas por pedido (uma, de preferência), sem laços que consultam linha a linha. Pôr o Neon em <code>aws-us-east-1</code> encurtaria o caminho, mas tiraria os dados em repouso do Brasil. É uma troca entre latência e localização dos dados (<a href="#lgpd">seção 12</a>).</>} en={<><b>The distance between the API and the database.</b> A container runs wherever its Durable Object is, and the docs warn that Durable Objects are not currently created in South America: asking for South America gets Eastern North America. So the API runs there, while the database is in São Paulo. Every query crosses that distance and back. Make few queries per request (one, ideally), with no loops that query row by row. Putting Neon in <code>aws-us-east-1</code> would shorten the path, but would move the data at rest out of Brazil. It is a trade-off between latency and where the data lives (<a href="#lgpd">section 12</a>).</>} /></Callout>

        <h3><T pt="6.2 Duas connection strings: pooled e direta" en="6.2 Two connection strings: pooled and direct" /></h3>
        <CodeBlock code={`# pooled (PgBouncer, transaction mode): the app inside the container
postgresql://app:<password>@ep-xxx-123456-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require

# direct: migrations, pg_dump, pg_restore, admin work
postgresql://app:<password>@ep-xxx-123456.sa-east-1.aws.neon.tech/recados?sslmode=require`} />
        <p><T pt={<>A única diferença é o <code>-pooler</code> no host. A versão pooled passa por um PgBouncer do Neon em modo transação, que junta milhares de conexões de cliente em poucas conexões reais. Ela combina com containers que ligam e desligam e com várias instâncias abrindo conexões ao mesmo tempo.</>} en={<>The only difference is <code>-pooler</code> in the host. The pooled one goes through Neon's PgBouncer in transaction mode, which folds thousands of client connections into a few real ones. It suits containers that start and stop, with several instances opening connections at once.</>} /></p>
        <p><T pt={<>O modo transação tem um custo: cada transação pode cair numa conexão diferente. Por isso não funcionam, pela conexão pooled, coisas que dependem da sessão: <code>SET</code> fora de uma transação, <code>LISTEN</code>/<code>NOTIFY</code>, tabelas temporárias, <code>PREPARE</code> em SQL e <i>advisory locks</i> de sessão. Migrations e <code>pg_dump</code> usam a <b>direta</b>.</>} en={<>Transaction mode has a cost: each transaction may land on a different connection. So, over the pooled connection, anything tied to the session does not work: <code>SET</code> outside a transaction, <code>LISTEN</code>/<code>NOTIFY</code>, temporary tables, SQL-level <code>PREPARE</code> and session advisory locks. Migrations and <code>pg_dump</code> use the <b>direct</b> one.</>} /></p>
        <Callout tone="info" icon="alert"><T pt={<><b>E o Hyperdrive?</b> O Hyperdrive é o pool de conexões da própria Cloudflare, e funciona com o Neon. Mas ele é um <i>binding</i> do Worker; a documentação não mostra uso de dentro de um container. Como a nossa API roda no container, ela vai direto ao pooler do Neon. Se um dia a API virar código de Worker, o Hyperdrive passa a fazer sentido. Nesse caso, o guia do Neon manda desligar o pooling no Neon e usar a URL direta.</>} en={<><b>What about Hyperdrive?</b> Hyperdrive is Cloudflare's own connection pooler, and it works with Neon. But it is a Worker binding; the docs do not show it used from inside a container. Since our API runs in the container, it goes straight to Neon's pooler. If the API ever becomes Worker code, Hyperdrive makes sense. In that case, Neon's guide says to turn off Neon's pooling and use the direct URL.</>} /></Callout>
      </Section>

      <Section id="local" title={<T pt="7. Rodar na sua máquina" en="7. Running on your machine" />}>
        <p><T pt={<>O <code>wrangler dev</code> roda o Worker e os dois containers no seu Docker, com o mesmo roteamento da nuvem e com o intercept de saída (a documentação diz que ele imita o comportamento de produção). Os <code>vars</code> vêm do <code>wrangler.jsonc</code>; os segredos, de um arquivo <code>.dev.vars.&lt;ambiente&gt;</code> fora do git.</>} en={<><code>wrangler dev</code> runs the Worker and both containers in your Docker, with the same routing as the cloud and with the outbound intercept (the docs say it mirrors production behaviour). <code>vars</code> come from <code>wrangler.jsonc</code>; secrets from a <code>.dev.vars.&lt;environment&gt;</code> file outside git.</>} /></p>
        <p><T pt={<>Como dev tem a segurança de produção (<a href="#envs">seção 5</a>), esse arquivo aponta para um <b>Postgres local</b>, nunca para o Neon de dev ou de produção:</>} en={<>Since dev has production's security (<a href="#envs">section 5</a>), that file points at a <b>local Postgres</b>, never at Neon's dev or production:</>} /></p>
        <CodeBlock code={`# .dev.vars.dev  (add .dev.vars* and .env* to .gitignore)
# With secrets.required set, only the keys listed there are loaded from this file.
DATABASE_URL="postgresql://recados:local@host.docker.internal:5432/recados?sslmode=disable"`} />
        <CodeBlock code={`docker run -d --name recados-pg -p 5432:5432 -e POSTGRES_USER=recados -e POSTGRES_PASSWORD=local \\
  -e POSTGRES_DB=recados postgres:17-alpine
npm install && npm install --prefix api && npm install --prefix web
DATABASE_URL_DIRECT="postgresql://recados:local@localhost:5432/recados" npm run migrate --prefix api
npx wrangler dev --env dev            # http://localhost:8787 ; press "r" to rebuild the containers

curl -s localhost:8787/api/health     # {"ok":true,"env":"dev"}
curl -s -XPOST localhost:8787/api/recados -H 'content-type: application/json' \\
  -d '{"nome":"Bia","texto":"via Worker"}'
curl -s localhost:8787/ | grep Bia    # the SSR page already has it: Next called the API via api.recados`} />
        <ul className="ds-list">
          <li><T pt={<><em>Um arquivo por ambiente.</em> Se <code>.dev.vars.dev</code> existe, o wrangler carrega só ele, e ignora o <code>.dev.vars</code>. Use um ou outro estilo (<code>.dev.vars</code> ou <code>.env</code>), não os dois.</>} en={<><em>One file per environment.</em> If <code>.dev.vars.dev</code> exists, wrangler loads only that one and ignores <code>.dev.vars</code>. Use one style (<code>.dev.vars</code> or <code>.env</code>), not both.</>} /></li>
          <li><T pt={<><em>O endereço do Postgres.</em> O container roda no Docker, então <code>localhost</code> dentro dele é o próprio container. O host da sua máquina aparece como <code>host.docker.internal</code> no Docker Desktop; no Linux, use o IP da ponte do Docker (em geral <code>172.17.0.1</code>).</>} en={<><em>The Postgres address.</em> The container runs in Docker, so <code>localhost</code> inside it is the container itself. Your machine appears as <code>host.docker.internal</code> on Docker Desktop; on Linux, use Docker's bridge IP (usually <code>172.17.0.1</code>).</>} /></li>
          <li><T pt={<><em>Para mexer só no front,</em> <code>npm run dev --prefix web</code> com as variáveis do Next num <code>web/.env.local</code> é mais rápido. O <code>wrangler dev</code> é para conferir o conjunto, com intercept e Worker.</>} en={<><em>To work only on the front end,</em> <code>npm run dev --prefix web</code> with Next's variables in a <code>web/.env.local</code> is faster. <code>wrangler dev</code> is for checking the whole, with the intercept and the Worker.</>} /></li>
        </ul>
      </Section>

      <Section id="deploy" title={<T pt="8. Deploy com aprovação" en="8. Deploy with approval" />}>
        <p><T pt={<>O fluxo: cada push na <code>main</code> aplica as migrations e faz deploy em dev. O job de produção espera alguém aprovar. A aprovação é uma regra do <i>environment</i> <code>production</code> no GitHub (<i>Required reviewers</i>). Os dois environments, <code>dev</code> e <code>production</code>, aceitam deploy só da <code>main</code> (<i>Deployment branches</i>), e cada um guarda os próprios segredos.</>} en={<>The flow: every push to <code>main</code> applies migrations and deploys dev. The production job waits for someone to approve. The approval is a rule on the <code>production</code> <i>environment</i> on GitHub (<i>Required reviewers</i>). Both environments, <code>dev</code> and <code>production</code>, accept deploys only from <code>main</code> (<i>Deployment branches</i>), and each keeps its own secrets.</>} /></p>
        <CodeBlock code={`# .github/workflows/deploy.yml: push to main → dev; a person approves → production.
name: deploy
on:
  push:
    branches: [main]
concurrency: deploy

jobs:
  dev:
    runs-on: ubuntu-latest
    environment: dev                 # secrets below come from the "dev" environment
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 22 }
      - run: npm ci && npm ci --prefix api
      - name: Migrate (direct URL, not the pooler)
        run: npm run migrate --prefix api
        env:
          DATABASE_URL_DIRECT: \${{ secrets.DATABASE_URL_DIRECT }}
      - name: Deploy recados-dev (builds both images; fails if a required secret is missing)
        run: npx wrangler deploy --env dev
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ vars.CLOUDFLARE_ACCOUNT_ID }}

  production:
    needs: dev
    runs-on: ubuntu-latest
    environment: production          # "Required reviewers": the job waits for an approval
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 22 }
      - run: npm ci && npm ci --prefix api
      - name: Migrate (direct URL, not the pooler)
        run: npm run migrate --prefix api
        env:
          DATABASE_URL_DIRECT: \${{ secrets.DATABASE_URL_DIRECT }}
      - name: Deploy recados-production
        run: npx wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ vars.CLOUDFLARE_ACCOUNT_ID }}`} />
        <ul className="ds-list">
          <li><T pt={<><em>Token da Cloudflare.</em> Crie um API token com permissão de editar Workers e guarde como <code>CLOUDFLARE_API_TOKEN</code>, junto com o <code>CLOUDFLARE_ACCOUNT_ID</code>. Use tokens diferentes para dev e produção, cada um com o mínimo de permissão.</>} en={<><em>Cloudflare token.</em> Create an API token that can edit Workers and store it as <code>CLOUDFLARE_API_TOKEN</code>, along with <code>CLOUDFLARE_ACCOUNT_ID</code>. Use different tokens for dev and production, each with least privilege.</>} /></li>
          <li><T pt={<><em>Migration antes do deploy.</em> Ela roda primeiro, com o código antigo ainda no ar. Por isso cada migration precisa funcionar com o código antigo e com o novo (adicionar coluna, sim; renomear de uma vez, não).</>} en={<><em>Migration before deploy.</em> It runs first, with the old code still live. So each migration must work with both the old and the new code (adding a column, yes; renaming in one go, no).</>} /></li>
          <li><T pt={<><em>O deploy não é atômico.</em> Segundo a documentação, o Worker novo entra no ar primeiro, e os containers são atualizados aos poucos (<i>rollout</i> gradual). Por alguns minutos, um front novo pode falar com uma API antiga. Mantenha a API compatível com a versão anterior do front.</>} en={<><em>Deploy is not atomic.</em> According to the docs, the new Worker goes live first and the containers update gradually (a rolling rollout). For a few minutes, a new front end may talk to an old API. Keep the API compatible with the previous front end.</>} /></li>
          <li><T pt={<><em>Primeiro deploy.</em> Depois do primeiro <code>wrangler deploy</code>, a documentação pede para esperar alguns minutos até os containers ficarem prontos. Acompanhe com <code>npx wrangler containers list</code>.</>} en={<><em>First deploy.</em> After the first <code>wrangler deploy</code>, the docs say to wait several minutes until containers are ready. Watch with <code>npx wrangler containers list</code>.</>} /></li>
        </ul>
      </Section>

      <Section id="backups" title={<T pt="9. Backups" en="9. Backups" />}>
        <p><T pt="O Neon oferece três camadas. Elas se complementam: cada uma cobre uma falha que a anterior não cobre." en="Neon offers three layers. They complement each other: each covers a failure the previous one does not." /></p>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="O que é" en="What it is" />, <T pt="Quanto tempo" en="How long" />, <T pt="Cobre" en="Covers" />]}
          rows={[
            [<T pt="Janela de histórico (instant restore)" en="History window (instant restore)" />, <T pt="Volta a branch para qualquer segundo dentro da janela" en="Rewinds the branch to any second inside the window" />, <T pt="Padrão de 1 dia nos planos pagos; até 7 dias no Launch e 30 no Scale; 6 horas no Free" en="Default 1 day on paid plans; up to 7 days on Launch and 30 on Scale; 6 hours on Free" />, <T pt={<>O <code>DELETE</code> sem <code>WHERE</code> de agora há pouco</>} en={<>The <code>DELETE</code> without <code>WHERE</code> from a moment ago</>} />],
            [<T pt="Snapshots agendados" en="Scheduled snapshots" />, <T pt="Uma foto diária, semanal ou mensal da branch raiz" en="A daily, weekly or monthly picture of the root branch" />, <T pt="Retenção de 1 hora a 35 dias (planos pagos)" en="Retention from 1 hour to 35 days (paid plans)" />, <T pt="Erros que só alguém percebe dias depois" en="Mistakes nobody notices for days" />],
            [<T pt={<>Exportação com <code>pg_dump</code></>} en={<>Export with <code>pg_dump</code></>} />, <T pt="Um arquivo seu, fora do Neon" en="A file of yours, outside Neon" />, <T pt="O quanto você guardar" en="As long as you keep it" />, <T pt="Perder a conta, sair do Neon, auditoria" en="Losing the account, leaving Neon, audits" />],
          ]}
        />

        <h3><T pt="9.1 Janela de histórico e snapshots" en="9.1 History window and snapshots" /></h3>
        <CodeBlock code={`export NEON_API_KEY=...            # from the Neon console; the CLI is the "neon" package
PROJECT=<recados-prod project id>

# history window: 8 days (needs Scale; Launch stops at 7). Value in seconds.
curl -s -X PATCH "https://console.neon.tech/api/v2/projects/$PROJECT" \\
  -H "Authorization: Bearer $NEON_API_KEY" -H "Content-Type: application/json" \\
  -d '{"project": {"history_retention_seconds": 691200}}'

# a daily snapshot at 23:00, kept for 14 days
npx neon@9 snapshots schedule set --project-id $PROJECT --branch main \\
  --frequency daily --hour 23 --retention 1209600

# a manual snapshot before a risky migration
npx neon@9 snapshots create --project-id $PROJECT --branch main --name antes-da-migration-007`} />
        <p><T pt={<>Para restaurar um snapshot, o Neon cria uma branch nova com os dados. Você confere e só então “finaliza”, trocando a branch atual pela restaurada. A connection string continua a mesma.</>} en={<>To restore a snapshot, Neon creates a new branch with the data. You check it and only then “finalize”, swapping the current branch for the restored one. The connection string stays the same.</>} /></p>
        <CodeBlock code={`npx neon@9 snapshots list --project-id $PROJECT
npx neon@9 snapshots restore <snapshot-id> --project-id $PROJECT --target-branch main --name conferir
npx neon@9 connection-string conferir --project-id $PROJECT     # look at the data first
npx neon@9 snapshots finalize <id of the "conferir" branch> --project-id $PROJECT`} />
        <p><T pt={<>A janela também se ajusta no console, em <i>Settings → Postgres</i>. Ela é cobrada como armazenamento de histórico: quanto maior, mais caro.</>} en={<>The window can also be set in the console, under <i>Settings → Postgres</i>. It is billed as history storage: the longer, the pricier.</>} /></p>

        <h3><T pt="9.2 Exportação noturna" en="9.2 Nightly export" /></h3>
        <p><T pt={<>O <code>pg_dump</code> precisa da URL <b>direta</b>; a documentação do Neon pede para evitar a pooled. A versão do cliente deve acompanhar a do servidor, e o jeito mais simples de garantir isso é rodar o <code>pg_dump</code> da imagem oficial do Postgres da mesma versão. O arquivo é cifrado antes de sair do runner.</>} en={<><code>pg_dump</code> needs the <b>direct</b> URL; Neon's docs say to avoid the pooled one. The client version should match the server's, and the simplest way to guarantee that is to run <code>pg_dump</code> from the official Postgres image of the same version. The file is encrypted before it leaves the runner.</>} /></p>
        <CodeBlock code={`# .github/workflows/backup.yml: nightly retention, then an export that lives outside Neon.
name: backup
on:
  schedule:
    - cron: "0 5 * * *"              # every day 05:00 UTC
  workflow_dispatch:
concurrency: backup

jobs:
  retention:                         # same rule in both environments
    strategy:
      matrix:
        env: [dev, production]
    runs-on: ubuntu-latest
    environment: \${{ matrix.env }}
    steps:
      - name: Delete what is past the 90 days promised on screen
        env:
          SRC: \${{ secrets.DATABASE_URL_DIRECT }}
        run: |
          docker run --rm -e SRC postgres:17-alpine psql "$SRC" -v ON_ERROR_STOP=1 \\
            -c "delete from recados where criado_em < now() - interval '90 days'"

  dump:
    needs: retention                 # retention first, so expired rows do not enter tonight's export
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: pg_dump with the same major version as the server, over the direct URL
        env:
          SRC: \${{ secrets.DATABASE_URL_DIRECT }}
        run: |
          docker run --rm -e SRC -v "$PWD:/out" -w /out postgres:17-alpine \\
            pg_dump -Fc --no-owner --no-acl -d "$SRC" -f recados.dump
      - name: Encrypt before it leaves the runner
        env:
          BACKUP_PASSPHRASE: \${{ secrets.BACKUP_PASSPHRASE }}
        run: |
          gpg --batch --symmetric --cipher-algo AES256 --passphrase-fd 0 \\
            -o "recados-$(date -u +%F).dump.gpg" recados.dump <<< "$BACKUP_PASSPHRASE"
          rm recados.dump
      # Upload recados-YYYY-MM-DD.dump.gpg to a bucket you control, with a lifecycle rule
      # that deletes objects after your retention period (Neon's guide does it with S3).`} />
        <p><T pt="Para restaurar o arquivo num banco vazio, ou para testar o backup (um backup que nunca foi restaurado é só uma esperança):" en="To restore the file into an empty database, or to test the backup (a backup never restored is only a hope):" /></p>
        <CodeBlock code={`gpg -d recados-2026-11-23.dump.gpg > recados.dump
docker run --rm -e DST -v "$PWD:/in" -w /in postgres:17-alpine \\
  pg_restore --no-owner --no-acl -d "$DST" recados.dump
psql "$DST" -c "select count(*), max(criado_em) from recados"   # does it look like production?`} />
        <Callout tone="info" icon="alert"><T pt={<><b>A retenção vem antes do dump.</b> O primeiro job apaga os recados com mais de 90 dias, o prazo prometido na tela, nos dois ambientes. Assim, o que já venceu não entra no arquivo da noite. Os backups guardam o que já foi apagado por um tempo. Isso tem consequência na LGPD (<a href="#lgpd">seção 12</a>).</>} en={<><b>Retention comes before the dump.</b> The first job deletes messages older than 90 days, the period promised on screen, in both environments. That way, expired data does not enter tonight's file. Backups keep deleted data for a while. That has an LGPD consequence (<a href="#lgpd">section 12</a>).</>} /></Callout>
      </Section>

      <Section id="refresh" title={<T pt="10. Prod → dev em D+1 ou D+7" en="10. Prod → dev at D+1 or D+7" />}>
        <p><T pt={<>Às vezes dev precisa de dados com a cara de produção: volume, distribuição, casos estranhos. A ideia é dar a dev produção <b>como ela era há N dias</b>: D+1 (ontem) ou D+7 (uma semana atrás). Sempre anonimizada.</>} en={<>Sometimes dev needs data that looks like production: volume, distribution, odd cases. The idea is to give dev production <b>as it was N days ago</b>: D+1 (yesterday) or D+7 (a week ago). Always anonymized.</>} /></p>
        <p><T pt="O atraso tem duas vantagens. Dev nunca tem os dados de hoje, o que reduz a exposição. E um bug relatado na semana passada pode ser reproduzido com os dados daquele dia." en="The lag has two advantages. Dev never holds today's data, which reduces exposure. And a bug reported last week can be reproduced with that day's data." /></p>
        <ol className="ds-steps">
          <li><T pt={<><b>Branch no passado.</b> Uma branch temporária de produção, criada a partir de um timestamp (<code>--parent &lt;data&gt;</code>), com validade de 3 horas. É instantânea e não pesa na <code>main</code>.</>} en={<><b>Branch in the past.</b> A temporary branch of production, created from a timestamp (<code>--parent &lt;date&gt;</code>), expiring in 3 hours. It is instant and puts no load on <code>main</code>.</>} /></li>
          <li><T pt={<><b>Anonimizar na cópia.</b> O script de mascaramento roda na branch temporária, que só o CI acessa. A <code>main</code> não muda: escrever numa branch não afeta a mãe.</>} en={<><b>Anonymize the copy.</b> The masking script runs on the temporary branch, which only CI can reach. <code>main</code> does not change: writing to a branch does not affect its parent.</>} /></li>
          <li><T pt={<><b>Exportar e substituir dev.</b> <code>pg_dump</code> da cópia já mascarada, <code>pg_restore --clean</code> no projeto <code>recados-dev</code>. Dado real nunca chega ao projeto de dev.</>} en={<><b>Export and replace dev.</b> <code>pg_dump</code> of the masked copy, <code>pg_restore --clean</code> into the <code>recados-dev</code> project. Real data never reaches the dev project.</>} /></li>
          <li><T pt={<><b>Apagar tudo,</b> mesmo se um passo falhar: a branch temporária e o arquivo.</>} en={<><b>Delete everything,</b> even if a step failed: the temporary branch and the file.</>} /></li>
        </ol>
        <CodeBlock code={`-- scripts/anonimizar.sql: runs on a throwaway copy of production, never on main.
begin;
update recados set
  nome  = 'pessoa-' || id,
  texto = 'recado de teste nº ' || id;   -- free text can hold anything: replace it whole

-- Fail the job (and send nothing to dev) if a row escaped the masking.
do $$
begin
  if exists (select 1 from recados where nome not like 'pessoa-%') then
    raise exception 'anonimização incompleta em recados';
  end if;
end $$;
commit;`} />
        <CodeBlock code={`# .github/workflows/refresh-dev.yml: dev gets production as it was N days ago, anonymized.
name: refresh-dev
on:
  schedule:
    - cron: "0 6 * * 1"              # Mondays 06:00 UTC (03:00 in Brasília)
  workflow_dispatch:
    inputs:
      lag_days:
        description: "Lag in days: 1 = D+1, 7 = D+7"
        default: "7"
concurrency: refresh-dev

jobs:
  refresh:
    runs-on: ubuntu-latest
    environment: production          # only this job sees the production API key
    env:
      NEON_API_KEY: \${{ secrets.NEON_API_KEY }}
      PROJECT: \${{ vars.NEON_PROD_PROJECT_ID }}
      BRANCH: refresh-\${{ github.run_id }}
      LAG_DAYS: \${{ inputs.lag_days || '7' }}
    steps:
      - uses: actions/checkout@v7

      - name: Branch production as it was N days ago (must be inside the history window)
        run: |
          AT=$(date -u -d "-\${LAG_DAYS} days" +%Y-%m-%dT%H:%M:%SZ)
          npx -y neon@9 branches create --project-id "$PROJECT" --name "$BRANCH" \\
            --parent "$AT" --expires-at "$(date -u -d '+3 hours' +%Y-%m-%dT%H:%M:%SZ)" --no-secrets
          SRC=$(npx -y neon@9 connection-string "$BRANCH" --project-id "$PROJECT" --database-name recados)
          echo "::add-mask::$SRC"
          echo "SRC=$SRC" >> "$GITHUB_ENV"

      - name: Anonymize the copy, then dump it
        run: |
          docker run --rm -e SRC -v "$PWD/scripts:/s" -w /s postgres:17-alpine sh -c \\
            'psql "$SRC" -q -v ON_ERROR_STOP=1 -f anonimizar.sql &&
             pg_dump -Fc --no-owner --no-acl -d "$SRC" -f dev.dump'

      - name: Replace the dev database
        env:
          DST: \${{ secrets.DEV_DATABASE_URL_DIRECT }}
        run: |
          docker run --rm -e DST -v "$PWD/scripts:/s" -w /s postgres:17-alpine \\
            pg_restore --clean --if-exists --no-owner --no-acl -d "$DST" dev.dump

      - name: Delete the copy and the dump, even if a step failed
        if: always()
        run: |
          rm -f scripts/dev.dump
          npx -y neon@9 branches delete "$BRANCH" --project-id "$PROJECT" || echo "branch already gone or never created"`} />
        <ul className="ds-list">
          <li><T pt={<><em>O atraso cabe na janela de histórico?</em> A branch só pode nascer de um instante dentro da janela. O padrão de 1 dia não basta nem para D+1 (o instante cai exatamente na borda). Use 2 dias para D+1 e 8 dias para D+7, o que exige o plano Scale, já que o Launch para em 7. No Launch, a alternativa é D+6, ou restaurar um snapshot agendado.</>} en={<><em>Does the lag fit in the history window?</em> A branch can only start from an instant inside the window. The 1-day default is not enough even for D+1 (the instant falls right on the edge). Use 2 days for D+1 and 8 days for D+7, which needs the Scale plan, since Launch stops at 7. On Launch, the alternative is D+6, or restoring a scheduled snapshot.</>} /></li>
          <li><T pt={<><em>Por que não <code>neon branches reset</code>?</em> O reset só leva a branch ao estado <b>atual</b> da mãe, sem voltar no tempo. Para um instante passado, a ferramenta é o <code>restore</code> (<code>main@&lt;timestamp&gt;</code>), mas ele trabalha dentro do mesmo projeto, e aqui dev é outro projeto. Daí o <code>pg_dump</code>.</>} en={<><em>Why not <code>neon branches reset</code>?</em> Reset only brings a branch to its parent's <b>current</b> state; it does not go back in time. For a past instant the tool is <code>restore</code> (<code>main@&lt;timestamp&gt;</code>), but it works inside one project, and here dev is another project. Hence <code>pg_dump</code>.</>} /></li>
          <li><T pt={<><em>A trava no fim do SQL.</em> Se alguém criar uma coluna nova com dado pessoal e esquecer de mascarar, o ideal é o job falhar, não copiar. O bloco <code>do $$ … raise exception</code> faz isso para os campos conhecidos. Revise o script a cada migration que adicionar dado pessoal.</>} en={<><em>The guard at the end of the SQL.</em> If someone adds a new column with personal data and forgets to mask it, the job should fail rather than copy it. The <code>do $$ … raise exception</code> block does that for the known fields. Review the script with every migration that adds personal data.</>} /></li>
          <li><T pt={<><em>A extensão <code>anon</code>.</em> O Neon também documenta o PostgreSQL Anonymizer (<code>anon</code>), com regras de mascaramento declaradas por coluna e <i>branches anonimizadas</i> pelo console. Hoje ela é experimental no Neon. O SQL simples acima não depende dela e roda em qualquer Postgres.</>} en={<><em>The <code>anon</code> extension.</em> Neon also documents PostgreSQL Anonymizer (<code>anon</code>), with masking rules declared per column and <i>anonymized branches</i> from the console. It is experimental on Neon today. The plain SQL above does not depend on it and runs on any Postgres.</>} /></li>
          <li><T pt={<><em>Branch só com o schema.</em> Se dev não precisa de volume, o Neon cria branches <code>--schema-only</code> (beta): a estrutura sem nenhuma linha. Junto com um seed gerado, é a opção que não copia dado pessoal nenhum.</>} en={<><em>Schema-only branch.</em> If dev does not need volume, Neon creates <code>--schema-only</code> branches (beta): the structure with no rows. Together with a generated seed, it is the option that copies no personal data at all.</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, o que foi testado:</b> o caminho anonimizar → <code>pg_dump</code> → <code>pg_restore --clean</code> rodou aqui com Postgres 17 em Docker, usando um banco copiado por <code>template</code> no lugar da branch do Neon. Dev ficou só com <code>pessoa-1</code> e <code>pessoa-2</code>, produção ficou intacta, e a trava abortou o script (código de saída 3) quando uma linha escapou do mascaramento. Os comandos <code>neon</code> seguem a ajuda da CLI 9.9.3 e a documentação, mas não rodaram contra uma conta.</>} en={<><b>Personal note, what was tested:</b> the anonymize → <code>pg_dump</code> → <code>pg_restore --clean</code> path ran here with Postgres 17 in Docker, using a database copied by <code>template</code> in place of the Neon branch. Dev ended up with only <code>pessoa-1</code> and <code>pessoa-2</code>, production stayed intact, and the guard aborted the script (exit code 3) when a row escaped the masking. The <code>neon</code> commands follow the 9.9.3 CLI help and the docs, but were not run against an account.</>} /></Callout>
      </Section>

      <Section id="export" title={<T pt="11. Tirar os dados do Neon" en="11. Getting the data out of Neon" />}>
        <p><T pt={<>Cedo ou tarde alguém pede os dados: o cliente, no fim do contrato ou numa auditoria, ou a própria equipe, que decidiu ir para o AWS RDS. A documentação do Neon não tem botão nem API de exportação de dados. A API cuida de projetos, branches e papéis. O que ela documenta são as ferramentas do próprio Postgres, e isso é uma boa notícia: nada no formato é proprietário.</>} en={<>Sooner or later someone asks for the data: the customer, at the end of a contract or in an audit, or your own team, which decided to move to AWS RDS. Neon's docs have no data export button or API. The API handles projects, branches and roles. What the docs cover are Postgres's own tools, and that is good news: nothing about the format is proprietary.</>} /></p>
        <Table
          head={[<T pt="Caminho" en="Path" />, <T pt="Serve para" en="Good for" />, <T pt="Parada de escrita" en="Write freeze" />]}
          rows={[
            [<T pt={<><code>pg_dump</code> / <code>pg_restore</code></>} en={<><code>pg_dump</code> / <code>pg_restore</code></>} />, <T pt="Entregar o banco inteiro; migrar um banco pequeno ou médio" en="Handing over the whole database; moving a small or medium one" />, <T pt="Durante todo o dump e restore" en="For the whole dump and restore" />],
            [<T pt={<><code>psql \copy</code> para CSV</>} en={<><code>psql \copy</code> to CSV</>} />, <T pt="Entregar tabelas ou um recorte em planilha; pedido de um titular" en="Handing over tables or a slice as spreadsheets; a data subject's request" />, <T pt="Nenhuma" en="None" />],
            [<T pt="Replicação lógica, Neon como origem" en="Logical replication, Neon as publisher" />, <T pt="Migrar para outro Postgres (RDS) com poucos minutos de parada" en="Moving to another Postgres (RDS) with only minutes of downtime" />, <T pt="Só na virada" en="Only at cutover" />],
          ]}
        />

        <h3><T pt="11.1 O cliente pediu os dados" en="11.1 The customer asked for the data" /></h3>
        <p><T pt={<>Para o banco inteiro, o mesmo <code>pg_dump</code> da <a href="#backups">seção 9</a>, pela URL direta. Escolha o formato pelo que o cliente vai fazer com ele: <code>-Fc</code> só abre com <code>pg_restore</code>; SQL puro (sem <code>-F</code>) abre com <code>psql</code> e é legível num editor. Para quem não tem Postgres, CSV por tabela com o <code>\copy</code> do <code>psql</code>, que grava o arquivo do lado do cliente e não precisa de superusuário.</>} en={<>For the whole database, the same <code>pg_dump</code> as in <a href="#backups">section 9</a>, over the direct URL. Pick the format by what the customer will do with it: <code>-Fc</code> only opens with <code>pg_restore</code>; plain SQL (no <code>-F</code>) opens with <code>psql</code> and is readable in an editor. For someone without Postgres, one CSV per table with <code>psql</code>'s <code>\copy</code>, which writes the file on the client side and needs no superuser.</>} /></p>
        <CodeBlock code={`SRC="<direct URL of recados-prod>"   # never the -pooler host for pg_dump

# the whole database, as plain SQL anyone can read or replay with psql
docker run --rm -e SRC -v "$PWD:/out" -w /out postgres:17-alpine \\
  pg_dump --no-owner --no-acl -d "$SRC" -f recados.sql

# one table as CSV with a header line
psql "$SRC" -c "\\copy (select id, nome, texto, criado_em from recados order by id) to 'recados.csv' with (format csv, header)"

# then: encrypt (gpg, section 9), send by a secure channel, record who received what and when`} />
        <p><T pt={<>Se quem pede é um <b>titular</b> (a pessoa a quem os dados se referem), a LGPD dá o direito de acesso e de portabilidade (art. 18, II e V). A resposta completa sai em até <b>15 dias</b> do pedido (art. 19, II). Exporte só as linhas dela, nunca o banco:</>} en={<>If the request comes from a <b>data subject</b> (the person the data is about), the LGPD grants access and portability rights (art. 18, II and V). The complete answer is due within <b>15 days</b> of the request (art. 19, II). Export only their rows, never the database:</>} /></p>
        <CodeBlock code={`psql "$SRC" -c "\\copy (select nome, texto, criado_em from recados where nome = 'Bia' order by criado_em) to 'titular.csv' with (format csv, header)"`} />
        <Callout tone="info" icon="alert"><T pt={<><b>Identificar a pessoa é o difícil.</b> Este app só guarda o nome, e duas pessoas podem ter o mesmo. Num sistema real, a busca é por um identificador confirmado (conta logada, e-mail verificado). Sem isso, você corre o risco de entregar dados de outra pessoa, o que já é um incidente.</>} en={<><b>Identifying the person is the hard part.</b> This app only stores a name, and two people may share it. In a real system the lookup uses a confirmed identifier (a logged-in account, a verified e-mail). Without it, you risk handing over someone else's data, which is itself an incident.</>} /></Callout>

        <h3><T pt="11.2 Mudar para o AWS RDS com dump e restore" en="11.2 Moving to AWS RDS with dump and restore" /></h3>
        <p><T pt={<>O caminho mais simples, quando dá para parar as escritas por um tempo. Crie a instância RDS com a <b>mesma versão principal</b> do Postgres, de preferência em <code>sa-east-1</code>, a mesma região AWS onde o Neon está. Depois:</>} en={<>The simplest path, when writes can stop for a while. Create the RDS instance with the <b>same major</b> Postgres version, preferably in <code>sa-east-1</code>, the same AWS region Neon is in. Then:</>} /></p>
        <CodeBlock code={`SRC="<direct URL of recados-prod>"
DST="postgresql://app:<password>@recados.xxxx.sa-east-1.rds.amazonaws.com:5432/recados?sslmode=require"

# 1. freeze writes: the app keeps reading, POSTs fail until the switch
psql "$SRC" -c "revoke insert, update, delete on all tables in schema public from app"

# 2. dump in parallel (-j needs the directory format, -Fd), restore in parallel
docker run --rm -e SRC -e DST -v "$PWD:/w" -w /w postgres:17-alpine sh -c '
  pg_dump -Fd -j 4 --no-owner --no-acl -d "$SRC" -f recados.dir &&
  pg_restore -j 4 --no-owner --no-acl -d "$DST" recados.dir'

# 3. compare before switching
psql "$SRC" -Atc "select count(*), max(id) from recados"
psql "$DST" -Atc "select count(*), max(id) from recados"

# 4. point the app at RDS (both environments follow the same steps) and restart the containers
npx wrangler secret put DATABASE_URL --env production
npx wrangler deploy --env production`} />
        <p><T pt={<>O guia de importação da AWS sugere, só durante a carga, ajustes que a aceleram (backups automáticos e Multi-AZ desligados, mais <code>maintenance_work_mem</code>), e lembra de desfazê-los depois. O <code>pg_dumpall</code> não serve: nem o Neon nem o RDS dão o superusuário que ele exige.</>} en={<>AWS's import guide suggests, during the load only, settings that speed it up (automated backups and Multi-AZ off, more <code>maintenance_work_mem</code>), and reminds you to undo them afterwards. <code>pg_dumpall</code> is out: neither Neon nor RDS grants the superuser it needs.</>} /></p>

        <h3><T pt="11.3 Mudar com replicação lógica" en="11.3 Moving with logical replication" /></h3>
        <p><T pt={<>Quando o banco é grande ou a parada precisa ser de minutos, o RDS vira <b>assinante</b> do Neon: copia tudo uma vez e depois recebe cada mudança, até a virada. O Neon documenta esse sentido (Neon como origem, outro Postgres como destino). Antes de começar, três avisos da documentação:</>} en={<>When the database is large or the downtime must be minutes, RDS becomes a <b>subscriber</b> of Neon: it copies everything once and then receives each change, until cutover. Neon documents this direction (Neon as publisher, another Postgres as subscriber). Before starting, three warnings from the docs:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Ligar é para sempre.</em> Ativar a replicação lógica muda o <code>wal_level</code> do projeto para <code>logical</code> e, segundo o Neon, não dá para voltar. A mudança reinicia todas as computações do projeto e derruba as conexões abertas.</>} en={<><em>Turning it on is permanent.</em> Enabling logical replication changes the project's <code>wal_level</code> to <code>logical</code>, and Neon says it cannot be reverted. The change restarts every compute in the project and drops open connections.</>} /></li>
          <li><T pt={<><em>Conexão direta.</em> A replicação exige conexão persistente e não funciona pelo pooler. Enquanto o assinante estiver conectado, a computação do Neon não desliga (custo).</>} en={<><em>Direct connection.</em> Replication needs a persistent connection and does not work through the pooler. While the subscriber is connected, Neon's compute does not scale to zero (cost).</>} /></li>
          <li><T pt={<><em>O que não vai junto.</em> Estrutura (DDL) e valores de sequência não são replicados. Congele as migrations durante a mudança, e acerte as sequências na virada.</>} en={<><em>What does not travel.</em> Schema (DDL) and sequence values are not replicated. Freeze migrations during the move, and fix the sequences at cutover.</>} /></li>
        </ul>
        <CodeBlock code={`# --- on Neon (recados-prod), over the DIRECT URL ---
npx neon@9 projects update $PROJECT --enable-logical-replication   # restarts computes; cannot be undone
psql "$SRC" <<'SQL'
create role replicador with login replication password '<strong password>';
grant usage on schema public to replicador;
grant select on all tables in schema public to replicador;
create publication para_rds for table recados, schema_migrations;
SQL

# --- on RDS: the schema first (logical replication only copies rows) ---
docker run --rm -e SRC -e DST postgres:17-alpine sh -c \\
  'pg_dump --schema-only --no-owner --no-acl -d "$SRC" | psql "$DST" -v ON_ERROR_STOP=1'
psql "$DST" -c "create subscription de_neon
  connection 'postgresql://replicador:<password>@ep-xxx-123456.sa-east-1.aws.neon.tech/recados?sslmode=require'
  publication para_rds"            # copy_data defaults to true: the initial copy, then changes

psql "$DST" -c "select * from pg_stat_subscription"   # is it receiving?`} />
        <p><T pt={<>No RDS, quem cria a assinatura precisa dos privilégios do papel <code>pg_create_subscription</code> e de <code>CREATE</code> no banco, como em qualquer Postgres. Na virada, a parada dura o tempo de os últimos dados chegarem:</>} en={<>On RDS, whoever creates the subscription needs the privileges of the <code>pg_create_subscription</code> role and <code>CREATE</code> on the database, as on any Postgres. At cutover, the downtime lasts as long as the last changes take to arrive:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><b>Congelar as escritas no Neon</b> (o mesmo <code>revoke</code> da seção anterior) e esperar o assinante alcançar: as contagens dos dois lados batem.</>} en={<><b>Freeze writes on Neon</b> (the same <code>revoke</code> as above) and wait for the subscriber to catch up: counts match on both sides.</>} /></li>
          <li><T pt={<><b>Acertar as sequências no RDS</b>, senão o próximo <code>insert</code> tenta um <code>id</code> que já existe.</>} en={<><b>Fix the sequences on RDS</b>, or the next <code>insert</code> tries an <code>id</code> that already exists.</>} /></li>
          <li><T pt={<><b>Trocar o segredo e reiniciar</b> (<code>wrangler secret put DATABASE_URL</code>, depois <code>wrangler deploy</code>), nos dois ambientes.</>} en={<><b>Swap the secret and restart</b> (<code>wrangler secret put DATABASE_URL</code>, then <code>wrangler deploy</code>), in both environments.</>} /></li>
          <li><T pt={<><b>Desfazer a ponte:</b> <code>drop subscription</code> no RDS, que também remove o slot de replicação no Neon.</>} en={<><b>Remove the bridge:</b> <code>drop subscription</code> on RDS, which also removes the replication slot on Neon.</>} /></li>
        </ol>
        <CodeBlock code={`-- on RDS, after the last change arrived
select setval(pg_get_serial_sequence('recados', 'id'), coalesce(max(id), 0) + 1, false) from recados;
drop subscription de_neon;`} />
        <ul className="ds-list">
          <li><T pt={<><em>Slots parados somem.</em> O Neon remove slots de replicação inativos depois de cerca de 40 horas. Se o RDS ficar desconectado esse tempo, a replicação precisa recomeçar do zero.</>} en={<><em>Idle slots disappear.</em> Neon removes inactive replication slots after about 40 hours. If RDS stays disconnected that long, replication has to start over.</>} /></li>
          <li><T pt={<><em>Restaurar a branch apaga os slots.</em> Não use o <i>instant restore</i> na <code>main</code> durante a migração.</>} en={<><em>Restoring the branch deletes the slots.</em> Do not use instant restore on <code>main</code> during the move.</>} /></li>
          <li><T pt={<><em>O resto da nota muda.</em> No RDS não há branch nem janela de histórico do Neon: o D+1/D+7 da <a href="#refresh">seção 10</a> vira restauração de snapshot ou <i>point-in-time recovery</i> do RDS, e a <a href="/notas/rds/">nota de RDS</a> cobre isso. A distância entre os containers e o banco continua a mesma (<a href="#neon">seção 6</a>).</>} en={<><em>The rest of the note changes.</em> RDS has no Neon branches or history window: the D+1/D+7 copy in <a href="#refresh">section 10</a> becomes an RDS snapshot restore or point-in-time recovery, which the <a href="/notas/rds/">RDS note</a> covers. The distance between the containers and the database stays the same (<a href="#neon">section 6</a>).</>} /></li>
        </ul>

        <h3><T pt="11.4 Depois: apagar o projeto no Neon" en="11.4 Afterwards: deleting the Neon project" /></h3>
        <p><T pt={<>Apagar o projeto leva junto computações, branches, bancos e papéis. O Neon permite recuperá-lo por <b>7 dias</b>; depois disso, a exclusão é definitiva. A documentação consultada não diz mais nada sobre o destino dos dados nesse período. Se o contrato exigir prova de eliminação, peça ao fornecedor. Nos planos pagos, apagar todos os projetos não encerra a cobrança: é preciso voltar ao plano Free.</>} en={<>Deleting the project also deletes its computes, branches, databases and roles. Neon lets you recover it for <b>7 days</b>; after that, deletion is permanent. The docs checked say nothing more about what happens to the data in that period. If a contract requires proof of deletion, ask the vendor. On paid plans, deleting every project does not stop billing: you have to downgrade to Free.</>} /></p>
        <p><T pt={<>Para a LGPD, trocar de banco é trocar de operador. Atualize o registro das operações de tratamento (art. 37) e a política de privacidade, e guarde os arquivos exportados com o mesmo prazo de retenção dos backups (<a href="#lgpd">seção 12</a>).</>} en={<>For the LGPD, changing database means changing processor. Update the record of processing operations (art. 37) and the privacy policy, and keep exported files under the same retention period as the backups (<a href="#lgpd">section 12</a>).</>} /></p>
      </Section>

      <Section id="lgpd" title={<T pt="12. LGPD" en="12. LGPD (Brazil's data protection law)" />}>
        <Callout tone="warn" icon="alert"><T pt={<><b>Isto não é parecer jurídico.</b> São os pontos em que a lei e as resoluções da ANPD encostam neste desenho técnico, com os artigos para você ler e levar a quem cuida do jurídico.</>} en={<><b>This is not legal advice.</b> These are the points where the law (Lei 13.709/2018) and the ANPD's resolutions touch this technical design, with the articles for you to read and take to whoever handles legal.</>} /></Callout>

        <h3><T pt="12.1 Quem é quem" en="12.1 Who is who" /></h3>
        <p><T pt={<>Você (a empresa dona do app) é o <b>controlador</b>: decide o que se coleta e para quê (art. 5º, VI). Cloudflare, Neon/Databricks e GitHub, quando tocam nos dados, são <b>operadores</b>: tratam em seu nome e seguem suas instruções (art. 5º, VII, e art. 39). Na prática, isso é o contrato de tratamento de dados (DPA) de cada fornecedor, que você precisa ter lido e aceito.</>} en={<>You (the company that owns the app) are the <b>controller</b>: you decide what is collected and why (art. 5, VI). Cloudflare, Neon/Databricks and GitHub, when they touch the data, are <b>processors</b>: they process it on your behalf and follow your instructions (art. 5, VII, and art. 39). In practice, that is each vendor's data processing agreement (DPA), which you need to have read and accepted.</>} /></p>

        <h3><T pt="12.2 Onde os dados ficam, e onde passam" en="12.2 Where the data rests, and where it passes" /></h3>
        <Table
          head={[<T pt="Peça" en="Piece" />, <T pt="Onde" en="Where" />, <T pt="Dá para fixar no Brasil?" en="Can it be pinned to Brazil?" />]}
          rows={[
            [<T pt="Banco (Neon)" en="Database (Neon)" />, <T pt={<>Região do projeto: <code>aws-sa-east-1</code>, São Paulo</>} en={<>The project's region: <code>aws-sa-east-1</code>, São Paulo</>} />, <T pt="Sim, na criação do projeto" en="Yes, when the project is created" />],
            [<T pt="Containers (durable_object)" en="Containers (durable_object)" />, <T pt="Onde o Durable Object estiver" en="Wherever its Durable Object is" />, <T pt={<>Não. As jurisdições documentadas são <code>eu</code>, <code>us</code> e <code>fedramp</code>; nenhuma é o Brasil. A dica de local <code>sam</code> (América do Sul) existe, mas a documentação avisa que hoje esses objetos nascem no leste da América do Norte.</>} en={<>No. The documented jurisdictions are <code>eu</code>, <code>us</code> and <code>fedramp</code>; none is Brazil. The <code>sam</code> (South America) location hint exists, but the docs warn that such objects are currently created in Eastern North America.</>} />],
            [<T pt="Worker e proxy" en="Worker and proxy" />, <T pt="O ponto da rede da Cloudflare mais perto do visitante" en="The Cloudflare location closest to the visitor" />, <T pt="Não neste desenho" en="Not in this design" />],
            [<T pt="Logs (Workers Logs)" en="Logs (Workers Logs)" />, <T pt="Cloudflare, por 7 dias" en="Cloudflare, for 7 days" />, <T pt="Não documentado" en="Not documented" />],
            [<T pt="Backups exportados" en="Exported backups" />, <T pt="O bucket que você escolher" en="The bucket you choose" />, <T pt="Sim, se o bucket estiver no Brasil" en="Yes, if the bucket is in Brazil" />],
          ]}
        />
        <p><T pt={<>A conclusão prática: o banco fica no Brasil, mas o processamento passa por fora. Trate o desenho como <b>transferência internacional</b> de dados (art. 33). A LGPD não proíbe a transferência. Ela exige um dos fundamentos do art. 33, e os dois que interessam aqui são estes:</>} en={<>The practical conclusion: the database stays in Brazil, but processing happens abroad. Treat the design as an <b>international data transfer</b> (art. 33). The LGPD does not forbid transfers. It requires one of art. 33's grounds, and the two that matter here are these:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><em>País ou organismo com proteção adequada (art. 33, I).</em> A Resolução CD/ANPD nº 32/2026 reconheceu a União Europeia. Na lista de regulamentações da ANPD consultada para esta nota, é a única decisão de adequação, e os EUA não estão nela.</>} en={<><em>A country or body with adequate protection (art. 33, I).</em> ANPD Resolution 32/2026 recognised the European Union. In the ANPD's list of regulations checked for this note, it is the only adequacy decision, and the US is not on it.</>} /></li>
          <li><T pt={<><em>Cláusulas-padrão contratuais da ANPD (art. 33, II, e Resolução CD/ANPD nº 19/2024).</em> As cláusulas precisam ser adotadas <b>na íntegra e sem alteração</b> (art. 16 do regulamento). O prazo para incorporá-las aos contratos existentes era de 12 meses a partir de 23/08/2024, e já venceu.</>} en={<><em>The ANPD's standard contractual clauses (art. 33, II, and ANPD Resolution 19/2024).</em> The clauses must be adopted <b>in full and unaltered</b> (art. 16 of the regulation). The deadline to add them to existing contracts was 12 months from 23 Aug 2024, and it has passed.</>} /></li>
        </ul>
        <p><T pt={<>O que fazer: verifique se os DPAs da Cloudflare e do Neon/Databricks incluem as cláusulas-padrão <b>da ANPD</b>. As cláusulas da União Europeia são outro instrumento. Se elas não estiverem lá, peça o aditivo. E, quando usar cláusulas-padrão, publique no seu site, em português simples, uma página sobre a transferência: países, finalidade, medidas de segurança e direitos do titular. Ela pode ficar dentro da política de privacidade (art. 17, §§ 2º e 3º, do regulamento).</>} en={<>What to do: check whether the Cloudflare and Neon/Databricks DPAs include the <b>ANPD's</b> standard clauses. The European Union's clauses are a different instrument. If they are not there, ask for the addendum. And, when using standard clauses, publish on your site, in plain Portuguese, a page about the transfer: countries, purpose, security measures and data subject rights. It can live inside the privacy policy (art. 17, §§ 2 and 3, of the regulation).</>} /></p>
        <Callout tone="info" icon="alert"><T pt={<><b>E se o requisito for “os dados não saem do Brasil”?</b> Isso é mais rígido que a LGPD: costuma vir de contrato com cliente ou de regulação setorial. Nesse caso este desenho não serve como está, porque os containers não podem ser fixados no Brasil. A saída é rodar o app numa nuvem com região em São Paulo, como a <a href="/notas/front-back-ecs-cloudflare/">nota do ECS</a>, com a Cloudflare só no DNS.</>} en={<><b>What if the requirement is “data never leaves Brazil”?</b> That is stricter than the LGPD: it usually comes from a customer contract or from sector regulation. In that case this design does not work as is, because the containers cannot be pinned to Brazil. The way out is to run the app on a cloud with a São Paulo region, as in the <a href="/notas/front-back-ecs-cloudflare/">ECS note</a>, with Cloudflare only for DNS.</>} /></Callout>

        <h3><T pt="12.3 O que este desenho já faz pela lei" en="12.3 What this design already does for the law" /></h3>
        <Table
          head={[<T pt="Exigência" en="Requirement" />, <T pt="Onde aparece na nota" en="Where it shows up in the note" />]}
          rows={[
            [<T pt="Necessidade: o mínimo de dados (art. 6º, III)" en="Necessity: the minimum data (art. 6, III)" />, <T pt="Só nome e recado; nada de e-mail, IP ou CPF guardado" en="Only name and message; no e-mail, IP or tax ID stored" />],
            [<T pt="Transparência (art. 6º, VI)" en="Transparency (art. 6, VI)" />, <T pt="Aviso no formulário e link para a política de privacidade" en="Notice on the form and a link to the privacy policy" />],
            [<T pt="Segurança (art. 46)" en="Security (art. 46)" />, <T pt={<>TLS até o Neon (o Neon exige TLS em toda conexão), segredos como <i>secrets</i> do Worker e cada container só com os seus, front sem internet, branch <code>main</code> protegida, dev com a mesma segurança de produção, produção só com aprovação</>} en={<>TLS all the way to Neon (Neon requires TLS on every connection), secrets as Worker secrets and each container with only its own, front end with no Internet, protected <code>main</code> branch, dev with the same security as production, production only with approval</>} />],
            [<T pt="Dado real fora de dev" en="Real data kept out of dev" />, <T pt={<>Projeto separado e cópia anonimizada (<a href="#refresh">seção 10</a>). Dados anonimizados de forma irreversível deixam de ser dados pessoais (art. 12). Um mascaramento que mantém o <code>id</code> de produção pode ser revertido por quem acessa produção, então trate dev com cuidado mesmo assim.</>} en={<>A separate project and an anonymized copy (<a href="#refresh">section 10</a>). Irreversibly anonymized data stops being personal data (art. 12). A masking that keeps the production <code>id</code> can be reversed by anyone with production access, so treat dev with care anyway.</>} />],
            [<T pt="Término e eliminação (arts. 15, 16 e 18, VI)" en="End of processing and deletion (arts. 15, 16 and 18, VI)" />, <T pt="Retenção de 90 dias aplicada todo dia, antes do backup" en="90-day retention applied daily, before the backup" />],
            [<T pt="Acesso e portabilidade (arts. 18, II e V, e 19)" en="Access and portability (arts. 18, II and V, and 19)" />, <T pt={<>Exportação só das linhas do titular, em CSV (<a href="#export">seção 11</a>)</>} en={<>Exporting only the data subject's rows, as CSV (<a href="#export">section 11</a>)</>} />],
          ]}
        />

        <h3><T pt="12.4 O que ainda é com você" en="12.4 What is still on you" /></h3>
        <QA
          items={[
            [<T pt="Alguém pede para apagar os dados. E os backups?" en="Someone asks for their data to be deleted. What about the backups?" />, <T pt={<>Apague no banco na hora. O dado ainda vive nos backups até eles vencerem: janela de histórico (até 8 dias), snapshots (14 dias) e arquivos exportados (o prazo do seu bucket). Calcule o maior desses prazos, escreva na política de privacidade e não restaure backup antigo sem reaplicar as exclusões.</>} en={<>Delete it from the database right away. The data still lives in backups until they expire: history window (up to 8 days), snapshots (14 days) and exported files (your bucket's period). Work out the longest of these, write it in the privacy policy, and do not restore an old backup without reapplying the deletions.</>} />],
            [<T pt="Vazou. Qual é o prazo?" en="There was a leak. What is the deadline?" />, <T pt={<>Se o incidente puder trazer risco ou dano relevante, o controlador comunica a ANPD e os titulares em <b>3 dias úteis</b> (Resolução CD/ANPD nº 15/2024; art. 48 da LGPD). Os fornecedores, como operadores, avisam você; quem comunica é você. Para agentes de pequeno porte, o prazo é em dobro (Resolução CD/ANPD nº 2/2022, art. 14).</>} en={<>If the incident may bring relevant risk or harm, the controller notifies the ANPD and the data subjects within <b>3 business days</b> (ANPD Resolution 15/2024; LGPD art. 48). Vendors, as processors, tell you; you are the one who notifies. For small processing agents the deadline is doubled (ANPD Resolution 2/2022, art. 14).</>} />],
            [<T pt="Preciso de um encarregado (DPO)?" en="Do I need a DPO (encarregado)?" />, <T pt={<>Em regra, sim, com nome e contato públicos, de preferência no site (art. 41). Microempresas, empresas de pequeno porte e startups que não fazem tratamento de alto risco estão dispensadas, mas precisam manter um canal de comunicação com o titular (Resolução CD/ANPD nº 2/2022, art. 11).</>} en={<>As a rule, yes, with a public name and contact, preferably on the site (art. 41). Micro and small companies and startups that do no high-risk processing are exempt, but must keep a communication channel with data subjects (ANPD Resolution 2/2022, art. 11).</>} />],
            [<T pt="Preciso documentar o tratamento?" en="Do I need to document the processing?" />, <T pt={<>Sim: o registro das operações de tratamento (art. 37), em forma simplificada para pequeno porte. Se o tratamento for de alto risco, por exemplo com dados sensíveis (art. 5º, II) ou em larga escala, a ANPD pode exigir o relatório de impacto, o RIPD (art. 38).</>} en={<>Yes: the record of processing operations (art. 37), in a simplified form for small agents. If the processing is high-risk, for instance with sensitive data (art. 5, II) or at large scale, the ANPD may require a data protection impact report, the RIPD (art. 38).</>} />],
            [<T pt="O que está em jogo?" en="What is at stake?" />, <T pt={<>Entre as sanções do art. 52 está multa de até 2% do faturamento no Brasil no último exercício, limitada a R$ 50 milhões por infração. Há também bloqueio ou eliminação dos dados e suspensão da atividade de tratamento.</>} en={<>Art. 52's sanctions include a fine of up to 2% of revenue in Brazil in the last fiscal year, capped at R$50 million per infraction. There is also blocking or deletion of the data and suspension of the processing.</>} />],
          ]}
        />
      </Section>

      <Section id="verify" title={<T pt="13. Conferir e diagnosticar" en="13. Checking and troubleshooting" />}>
        <CodeBlock code={`DOMAIN=example.com.br
curl -s https://$DOMAIN/api/health                 # {"ok":true,"env":"production"}
curl -s https://$DOMAIN/ | grep -c '<li>'           # the SSR page lists the messages (Next → api.recados → API)
npx wrangler containers list                        # instances and their state
npx wrangler deployments list --env production      # which version is live`} />
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />]}
          rows={[
            [<T pt={<>Logo após o primeiro deploy, erro nas rotas e a página não carrega</>} en={<>Right after the first deploy, errors on every route and the page does not load</>} />, <T pt="Os containers ainda estão sendo provisionados. A documentação pede alguns minutos; acompanhe com wrangler containers list." en="The containers are still being provisioned. The docs say to wait several minutes; watch with wrangler containers list." />],
            [<T pt={<><code>container did not answer /health on port 8080</code></>} en={<><code>container did not answer /health on port 8080</code></>} />, <T pt={<>O processo não escuta na 8080, não tem a rota <code>/health</code> ou quebrou ao iniciar. Veja os logs do container no painel (com <code>observability</code> ligado).</>} en={<>The process does not listen on 8080, has no <code>/health</code> route, or crashed on start. Check the container logs in the dashboard (with <code>observability</code> on).</>} />],
            [<T pt={<>A API responde, mas <code>/api/recados</code> dá 500 e o log mostra <code>ENOTFOUND</code> ou <code>ETIMEDOUT</code></>} en={<>The API answers, but <code>/api/recados</code> gives 500 and the log shows <code>ENOTFOUND</code> or <code>ETIMEDOUT</code></>} />, <T pt={<>O container da API subiu com <code>enableInternet: false</code>, ou o segredo <code>DATABASE_URL</code> não existe naquele ambiente (<code>--env</code>).</>} en={<>The API container started with <code>enableInternet: false</code>, or the <code>DATABASE_URL</code> secret does not exist in that environment (<code>--env</code>).</>} />],
            [<T pt={<>A página dá erro no SSR e o log do Next mostra <code>fetch failed</code> para <code>api.recados</code></>} en={<>The page fails during SSR and Next's log shows <code>fetch failed</code> for <code>api.recados</code></>} />, <T pt={<>O intercept não foi registrado antes do <code>start()</code>, ou o container religou sem passar pelo <code>beforeStart</code>. Sem intercept e sem internet, o DNS do container não responde por esse host.</>} en={<>The intercept was not registered before <code>start()</code>, or the container restarted without going through <code>beforeStart</code>. With no intercept and no Internet, the container's DNS does not answer for that host.</>} />],
            [<T pt={<><code>missing var or secret X</code> no Worker, ou <code>missing environment variable X</code> no Next</>} en={<><code>missing var or secret X</code> in the Worker, or <code>missing environment variable X</code> in Next</>} />, <T pt={<>A chave falta em <code>vars</code> daquele ambiente, o segredo não foi cadastrado com <code>--env</code>, ou o nome não está na lista do container (<code>WEB_ENV</code>/<code>API_ENV</code>).</>} en={<>The key is missing from that environment's <code>vars</code>, the secret was not set with <code>--env</code>, or the name is not in the container's list (<code>WEB_ENV</code>/<code>API_ENV</code>).</>} />],
            [<T pt={<>O <code>wrangler deploy</code> recusa por segredo faltando</>} en={<><code>wrangler deploy</code> refuses because of a missing secret</>} />, <T pt={<>É o <code>secrets.required</code> funcionando: cadastre o valor naquele ambiente e repita.</>} en={<>That is <code>secrets.required</code> doing its job: set the value in that environment and retry.</>} />],
            [<T pt={<>Produção mostra um valor de dev no navegador</>} en={<>Production shows a dev value in the browser</>} />, <T pt={<>Uma variável <code>NEXT_PUBLIC_</code> foi congelada no build. Leia o valor no servidor e passe como prop.</>} en={<>A <code>NEXT_PUBLIC_</code> variable was frozen at build time. Read the value on the server and pass it as a prop.</>} />],
            [<T pt={<>Trocou o segredo e nada mudou</>} en={<>Changed the secret and nothing changed</>} />, <T pt="O container em execução guarda o ambiente de quando ligou. Ele lê o valor novo no próximo início (após inatividade ou novo deploy)." en="A running container keeps the environment it started with. It reads the new value on the next start (after inactivity or a new deploy)." />],
            [<T pt={<>Erro com <code>SET</code>, <code>LISTEN</code> ou <i>prepared statement</i></>} en={<>Errors with <code>SET</code>, <code>LISTEN</code> or prepared statements</>} />, <T pt="É o modo transação do pooler. Use a URL direta para isso, ou mude o código." en="That is the pooler's transaction mode. Use the direct URL for it, or change the code." />],
            [<T pt={<>O <code>neon branches create --parent &lt;data&gt;</code> falha no refresh</>} en={<><code>neon branches create --parent &lt;date&gt;</code> fails in the refresh</>} />, <T pt="O instante está fora da janela de histórico. Aumente a janela ou diminua o atraso." en="The instant is outside the history window. Widen the window or shorten the lag." />],
            [<T pt={<>O <code>pg_dump</code> recusa o servidor por versão</>} en={<><code>pg_dump</code> refuses the server because of its version</>} />, <T pt="O cliente é mais antigo que o servidor. Use a imagem postgres com a mesma versão principal do projeto." en="The client is older than the server. Use the postgres image with the project's major version." />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, sobre o que foi testado:</b> a API, as migrations, o Worker com dois containers no <code>wrangler dev</code> 4.167, o <code>wrangler deploy --dry-run</code> e o caminho anonimizar → dump → restore rodaram nesta máquina na primeira versão desta nota, que tinha um nginx no front. A imagem do Next foi construída aqui (Next 16.4, <code>node:22-alpine</code>). O front em Next no <code>wrangler dev</code>, o intercept, o fluxo de variáveis e a migração para o RDS seguem a documentação oficial, mas não foram executados. <b>Nada foi publicado numa conta Cloudflare, Neon ou AWS</b> para escrever esta nota.</>} en={<><b>Personal note, on what was tested:</b> the API, the migrations, the Worker with two containers under <code>wrangler dev</code> 4.167, <code>wrangler deploy --dry-run</code> and the anonymize → dump → restore path ran on this machine in the first version of this note, which had nginx as the front end. The Next image was built here (Next 16.4, <code>node:22-alpine</code>). The Next front end under <code>wrangler dev</code>, the intercept, the variable flow and the RDS migration follow the official docs but were not run. <b>Nothing was deployed to a Cloudflare, Neon or AWS account</b> to write this note.</>} /></Callout>
        <Sources title={<T pt="Fontes oficiais (consultadas em 23/11/2026)" en="Official sources (checked 23 Nov 2026)" />}>
          <ul>
            <li><a href="https://developers.cloudflare.com/containers/get-started/">Cloudflare Docs · Containers: Get started</a></li>
            <li><a href="https://developers.cloudflare.com/containers/api/durable-object-container/">Cloudflare Docs · Containers: Durable Object Container API (start, running, getTcpPort, setInactivityTimeout)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/configuration/scheduling-policy/">Cloudflare Docs · Containers: Scheduling policy</a></li>
            <li><a href="https://developers.cloudflare.com/containers/concepts/placement/">Cloudflare Docs · Containers: Placement (regions and jurisdictions)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/">Cloudflare Docs · Containers: Env vars and secrets</a></li>
            <li><a href="https://developers.cloudflare.com/containers/configuration/outbound-traffic/">Cloudflare Docs · Containers: Outbound traffic (enableInternet, intercepts)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/configuration/workers-connections/">Cloudflare Docs · Containers: Connect to Workers and bindings</a></li>
            <li><a href="https://developers.cloudflare.com/containers/platform-details/limits/">Cloudflare Docs · Containers: Limits and instance types</a></li>
            <li><a href="https://developers.cloudflare.com/containers/pricing/">Cloudflare Docs · Containers: Pricing</a></li>
            <li><a href="https://developers.cloudflare.com/containers/faq/">Cloudflare Docs · Containers: FAQ (rollouts, cold starts, ephemeral disk, logs)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/local-dev/">Cloudflare Docs · Containers: Local development</a></li>
            <li><a href="https://developers.cloudflare.com/workers/wrangler/configuration/">Cloudflare Docs · Wrangler configuration (non-inheritable keys, containers)</a></li>
            <li><a href="https://developers.cloudflare.com/workers/wrangler/environments/">Cloudflare Docs · Wrangler environments</a></li>
            <li><a href="https://developers.cloudflare.com/workers/configuration/environment-variables/">Cloudflare Docs · Workers environment variables</a></li>
            <li><a href="https://developers.cloudflare.com/workers/configuration/secrets/">Cloudflare Docs · Workers secrets (secrets.required, .dev.vars)</a></li>
            <li><a href="https://developers.cloudflare.com/workers/wrangler/commands/workers/">Cloudflare Docs · Wrangler commands (secret bulk)</a></li>
            <li><a href="https://developers.cloudflare.com/secrets-store/">Cloudflare Docs · Secrets Store</a></li>
            <li><a href="https://developers.cloudflare.com/workers/configuration/routing/custom-domains/">Cloudflare Docs · Workers custom domains</a></li>
            <li><a href="https://developers.cloudflare.com/durable-objects/reference/data-location/">Cloudflare Docs · Durable Objects: Data location (location hints, jurisdictions)</a></li>
            <li><a href="https://developers.cloudflare.com/hyperdrive/">Cloudflare Docs · Hyperdrive</a></li>
            <li><a href="https://neon.com/docs/introduction/regions">Neon Docs · Regions</a></li>
            <li><a href="https://neon.com/docs/introduction/branching">Neon Docs · Branching</a></li>
            <li><a href="https://neon.com/docs/guides/branching-schema-only">Neon Docs · Schema-only branches</a></li>
            <li><a href="https://neon.com/docs/connect/connection-pooling">Neon Docs · Connection pooling</a></li>
            <li><a href="https://neon.com/docs/introduction/scale-to-zero">Neon Docs · Scale to zero</a></li>
            <li><a href="https://neon.com/docs/introduction/plans">Neon Docs · Plans</a></li>
            <li><a href="https://neon.com/docs/guides/protected-branches">Neon Docs · Protected branches</a></li>
            <li><a href="https://neon.com/docs/manage/backups">Neon Docs · Backup strategies</a></li>
            <li><a href="https://neon.com/docs/postgres/backup-restore/history-window">Neon Docs · History window</a></li>
            <li><a href="https://neon.com/docs/guides/backup-restore">Neon Docs · Backup and restore (snapshots and schedules)</a></li>
            <li><a href="https://neon.com/docs/introduction/branch-restore">Neon Docs · Instant restore</a></li>
            <li><a href="https://neon.com/docs/reference/cli-branches">Neon Docs · CLI: branches</a></li>
            <li><a href="https://neon.com/docs/manage/backup-pg-dump">Neon Docs · Backups with pg_dump</a></li>
            <li><a href="https://neon.com/docs/manage/backup-pg-dump-automate">Neon Docs · Automate pg_dump backups</a></li>
            <li><a href="https://neon.com/docs/import/migrate-intro">Neon Docs · Migration overview</a></li>
            <li><a href="https://neon.com/docs/import/migrate-from-postgres">Neon Docs · Migrate from Postgres (pg_dump options)</a></li>
            <li><a href="https://neon.com/docs/guides/logical-replication-guide">Neon Docs · Logical replication</a></li>
            <li><a href="https://neon.com/docs/guides/logical-replication-postgres">Neon Docs · Replicate data from Neon to Postgres</a></li>
            <li><a href="https://neon.com/docs/guides/logical-replication-manage">Neon Docs · Manage logical replication (DDL, inactive slots)</a></li>
            <li><a href="https://neon.com/docs/guides/logical-replication-neon">Neon Docs · Logical replication in Neon (direct connection, restore deletes slots)</a></li>
            <li><a href="https://neon.com/docs/manage/projects">Neon Docs · Manage projects (deletion and 7-day recovery)</a></li>
            <li><a href="https://neon.com/docs/extensions/postgresql-anonymizer">Neon Docs · PostgreSQL Anonymizer</a></li>
            <li><a href="https://neon.com/docs/guides/cloudflare-hyperdrive">Neon Docs · Cloudflare Hyperdrive</a></li>
            <li><a href="https://neon.com/docs/security/security-overview">Neon Docs · Security overview</a></li>
            <li><a href="https://nextjs.org/docs/app/guides/self-hosting">Next.js Docs · Self-hosting (Docker, one image across environments)</a></li>
            <li><a href="https://nextjs.org/docs/app/guides/environment-variables">Next.js Docs · Environment variables (NEXT_PUBLIC_ inlined at build)</a></li>
            <li><a href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output">Next.js Docs · output: standalone (PORT, HOSTNAME)</a></li>
            <li><a href="https://nextjs.org/docs/app/api-reference/functions/connection">Next.js Docs · connection()</a></li>
            <li><a href="https://nextjs.org/docs/app/guides/data-security">Next.js Docs · Data security (server-only)</a></li>
            <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-docker">Next.js · Official with-docker example</a></li>
            <li><a href="https://www.postgresql.org/docs/17/logical-replication-restrictions.html">PostgreSQL 17 · Logical replication restrictions (DDL, sequences)</a></li>
            <li><a href="https://www.postgresql.org/docs/17/sql-createsubscription.html">PostgreSQL 17 · CREATE SUBSCRIPTION</a></li>
            <li><a href="https://www.postgresql.org/docs/17/app-pgdump.html">PostgreSQL 17 · pg_dump (-Fd and -j)</a></li>
            <li><a href="https://www.postgresql.org/docs/17/app-psql.html">PostgreSQL 17 · psql (\copy)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Procedural.Importing.html">AWS Docs · Importing data into RDS for PostgreSQL</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.FeatureSupport.LogicalReplication.html">AWS Docs · Logical replication on RDS for PostgreSQL</a></li>
            <li><a href="https://www.databricks.com/product/lakebase">Databricks · Lakebase Postgres</a></li>
            <li><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm">Planalto · Lei nº 13.709/2018 (LGPD)</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd">ANPD · Regulamentações (inclui a Resolução nº 32/2026, adequação da UE)</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024">ANPD · Resolução CD/ANPD nº 19/2024 (transferência internacional)</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022">ANPD · Resolução CD/ANPD nº 2/2022 (agentes de pequeno porte)</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/assuntos/comunicacao-de-incidentes-de-seguranca-cis">ANPD · Comunicação de incidente de segurança (Resolução nº 15/2024)</a></li>
            <li><a href="https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment">GitHub Docs · Environments (required reviewers, environment secrets)</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
