import { Callout, CodeBlock, Diagram, QA, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "cloudflare-containers-neon",
  title: { en: "Cloudflare Containers and Neon: dev and prod", pt: "Cloudflare Containers e Neon: dev e prod" },
  seo: {
    title: { en: "Tutorial: a Dockerized front end and API on Cloudflare Containers with Neon Postgres, dev and prod, and LGPD", pt: "Tutorial: front e API em Docker no Cloudflare Containers com Neon Postgres, dev e prod, e a LGPD" },
    description: { en: "Step by step: two Docker images (nginx and Node) behind a Worker on Cloudflare Containers, Neon Postgres (Databricks) in São Paulo, dev and production environments, backups, pg_dump exports, a D+1/D+7 anonymized copy from prod to dev, and what Brazil's LGPD requires.", pt: "Passo a passo: duas imagens Docker (nginx e Node) atrás de um Worker no Cloudflare Containers, Neon Postgres (Databricks) em São Paulo, ambientes dev e produção, backups, exportação com pg_dump, cópia anonimizada D+1/D+7 de prod para dev e o que a LGPD exige." },
  },
  summary: "a didactic tutorial for running a Dockerized app on Cloudflare Containers with Neon Postgres: a Worker routes /api/* to a Node API container and everything else to an nginx container, each container driven by a Durable Object (durable_object scheduling policy, ctx.container.start, getTcpPort, a /health readiness loop, a fixed pool of named instances); wrangler.jsonc with dev and production environments (containers and durable_objects are not inherited and are repeated per environment), Worker secrets passed into the container's env; Neon (Lakebase Postgres, from Databricks) in aws-sa-east-1 with one project per environment, pooled connection for the app and direct connection for migrations and pg_dump; GitHub Actions for deploy with an approval gate, nightly retention and encrypted pg_dump exports, history window and scheduled snapshots, and a D+1/D+7 refresh that branches production at a past timestamp, anonymizes the copy, dumps it and restores it into dev; and LGPD considerations (controller and processors, international transfer under art. 33 and ANPD Resolution 19/2024 standard clauses, container placement that cannot be pinned to Brazil, retention in backups, incident reporting in 3 business days). The images, the Worker with both containers under wrangler dev, migrations, the anonymize-dump-restore pipeline and the config dry-run were executed locally; nothing was deployed to a Cloudflare or Neon account.",
  kicker: { en: "Cloudflare · Neon · LGPD", pt: "Cloudflare · Neon · LGPD" },
  heroTitle: { en: <>Two containers on Cloudflare, <em>Postgres on Neon, two environments.</em></>, pt: <>Dois containers na Cloudflare, <em>Postgres no Neon, dois ambientes.</em></> },
  heroLede: { en: "A front end (nginx) and an API (Node), each in its own Docker image, run on Cloudflare Containers behind a Worker that splits traffic by path. The database is Neon in São Paulo. There is a dev and a production of everything, and at the end, what Brazil's LGPD changes in this design.", pt: "Um front (nginx) e uma API (Node), cada um na sua imagem Docker, rodando no Cloudflare Containers atrás de um Worker que divide o tráfego pelo caminho. O banco é o Neon em São Paulo. Tudo existe em dev e em produção e, no fim, o que a LGPD muda nesse desenho." },
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="O desenho" en="The design" /> },
        { id: "before", title: <T pt="1. Antes de começar" en="1. Before you start" /> },
        { id: "images", title: <T pt="2. As duas imagens" en="2. The two images" /> },
        { id: "worker", title: <T pt="3. O Worker e os containers" en="3. The Worker and the containers" /> },
        { id: "envs", title: <T pt="4. Dev e produção no wrangler" en="4. Dev and production in wrangler" /> },
        { id: "neon", title: <T pt="5. Neon: projetos e conexões" en="5. Neon: projects and connections" /> },
        { id: "local", title: <T pt="6. Rodar na sua máquina" en="6. Running on your machine" /> },
        { id: "deploy", title: <T pt="7. Deploy com aprovação" en="7. Deploy with approval" /> },
        { id: "backups", title: <T pt="8. Backups e exportação" en="8. Backups and exports" /> },
        { id: "refresh", title: <T pt="9. Prod → dev em D+1 ou D+7" en="9. Prod → dev at D+1 or D+7" /> },
        { id: "lgpd", title: <T pt="10. LGPD" en="10. LGPD (Brazil)" /> },
        { id: "verify", title: <T pt="11. Conferir e diagnosticar" en="11. Checking and troubleshooting" /> },
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
        <p><T pt={<>São três peças. O <b>front</b> é um nginx servindo arquivos estáticos. A <b>API</b> é um processo Node que fala com o banco. O <b>banco</b> é um Postgres no Neon. As duas primeiras viram imagens Docker; o banco é um serviço gerenciado.</>} en={<>There are three pieces. The <b>front end</b> is nginx serving static files. The <b>API</b> is a Node process that talks to the database. The <b>database</b> is Postgres on Neon. The first two become Docker images; the database is a managed service.</>} /></p>
        <p><T pt={<>No Cloudflare Containers, um container nunca recebe tráfego direto da internet. Quem recebe é um <b>Worker</b> (código JavaScript que roda na borda da Cloudflare). Ele olha o caminho da URL e repassa o pedido para um <b>Durable Object</b>, que liga e controla o container.</>} en={<>On Cloudflare Containers, a container never takes traffic straight from the Internet. A <b>Worker</b> does (JavaScript running at Cloudflare's edge). It looks at the URL path and hands the request to a <b>Durable Object</b>, which starts and controls the container.</>} /></p>
        <Diagram minWidth={540} caption={<T pt="Um Worker por ambiente. /api/* vai para o container da API, o resto para o nginx. Só a API sai para a internet, para falar com o Neon em São Paulo." en="One Worker per environment. /api/* goes to the API container, everything else to nginx. Only the API reaches the Internet, to talk to Neon in São Paulo." />}>
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
            <text x="416" y="66" textAnchor="middle">Web · nginx :8080</text>
            <text x="416" y="86" className="mut" textAnchor="middle">DO + container lite</text>
            <rect x="330" y="220" width="172" height="70" rx="4" className="ln fillsoft" />
            <text x="416" y="246" textAnchor="middle">Api · Node :8080</text>
            <text x="416" y="266" className="mut" textAnchor="middle">DO + container basic</text>
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
        <Table
          head={[<T pt="" en="" />, <T pt="dev" en="dev" />, <T pt="produção" en="production" />]}
          rows={[
            [<T pt="Worker" en="Worker" />, <code>recados-dev</code>, <code>recados-production</code>],
            [<T pt="Domínio" en="Domain" />, <code>dev.example.com.br</code>, <code>example.com.br</code>],
            [<T pt="Banco" en="Database" />, <T pt={<>Projeto Neon <code>recados-dev</code></>} en={<>Neon project <code>recados-dev</code></>} />, <T pt={<>Projeto Neon <code>recados-prod</code>, branch <code>main</code> protegida</>} en={<>Neon project <code>recados-prod</code>, protected <code>main</code> branch</>} />],
            [<T pt="Dados" en="Data" />, <T pt="Cópia anonimizada de produção (D+1 ou D+7) ou dados gerados" en="Anonymized copy of production (D+1 or D+7) or generated data" />, <T pt="Reais" en="Real" />],
            [<T pt="Deploy" en="Deploy" />, <T pt="Automático a cada push na main" en="Automatic on every push to main" />, <T pt="Depois que alguém aprova no GitHub" en="After someone approves it on GitHub" />],
            [<T pt="Instâncias por container" en="Instances per container" />, "1", "3"],
          ]}
        />
        <h3><T pt="O roteiro" en="The route" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><b>Construir (seções 1 a 4).</b> As duas imagens, o Worker que as liga e a configuração com dois ambientes.</>} en={<><b>Build (sections 1 to 4).</b> Both images, the Worker that drives them and the config with two environments.</>} /></li>
          <li><T pt={<><b>Banco e máquina local (5 e 6).</b> Projetos no Neon, strings de conexão, segredos e o app inteiro rodando no seu Docker.</>} en={<><b>Database and local machine (5 and 6).</b> Neon projects, connection strings, secrets and the whole app running in your Docker.</>} /></li>
          <li><T pt={<><b>Operar (7 a 9).</b> Deploy com aprovação, backups, exportação e a cópia de produção para dev.</>} en={<><b>Operate (7 to 9).</b> Deploy with approval, backups, exports and the copy from production to dev.</>} /></li>
          <li><T pt={<><b>Conformidade (10 e 11).</b> O que a LGPD exige deste desenho, e como conferir que tudo funciona.</>} en={<><b>Compliance (10 and 11).</b> What the LGPD asks of this design, and how to check that it all works.</>} /></li>
        </ol>
        <Callout tone="use" icon="check"><T pt={<><b>Notas vizinhas.</b> O mesmo app de dois containers na AWS está na <a href="/notas/front-back-ecs-cloudflare/">nota de front e back no ECS</a>. Postgres em si na <a href="/notas/postgres-for-devs/">nota de Postgres</a>, e ferramentas de migration na <a href="/notas/db-migrations/">nota de migrations</a>.</>} en={<><b>Neighbouring notes.</b> The same two-container app on AWS is in the <a href="/notas/front-back-ecs-cloudflare/">front and back on ECS note</a>. Postgres itself in the <a href="/notas/postgres-for-devs/">Postgres note</a>, and migration tools in the <a href="/notas/db-migrations/">migrations note</a>.</>} /></Callout>
      </Section>

      <Section id="before" title={<T pt="1. Antes de começar" en="1. Before you start" />}>
        <ul className="ds-list">
          <li><T pt={<><em>Conta Cloudflare no plano Workers Paid</em> (US$ 5 por mês). O preço dos Containers é descrito como uso incluído nesse plano, mais o excedente.</>} en={<><em>A Cloudflare account on Workers Paid</em> (US$5 a month). Containers pricing is described as usage included in that plan, plus overage.</>} /></li>
          <li><T pt={<><em>Um domínio ativo na Cloudflare.</em> O <i>custom domain</i> do Worker exige que a zona esteja na conta; a Cloudflare cria o registro DNS e o certificado sozinha.</>} en={<><em>A domain active on Cloudflare.</em> A Worker <i>custom domain</i> requires the zone to be in the account; Cloudflare creates the DNS record and the certificate itself.</>} /></li>
          <li><T pt={<><em>Docker na sua máquina e no CI.</em> O <code>wrangler deploy</code> constrói as imagens localmente e as envia para o registro da Cloudflare. As imagens precisam ser <code>linux/amd64</code>.</>} en={<><em>Docker on your machine and in CI.</em> <code>wrangler deploy</code> builds the images locally and pushes them to Cloudflare's registry. Images must be <code>linux/amd64</code>.</>} /></li>
          <li><T pt={<><em>Conta no Neon</em> e Node 22 ou mais novo.</>} en={<><em>A Neon account</em> and Node 22 or newer.</>} /></li>
        </ul>
        <h3><T pt="O que é o Neon hoje" en="What Neon is today" /></h3>
        <p><T pt={<>O Neon é da Databricks. O site se apresenta como “um backend completo da Databricks”, e o banco agora se chama <b>Lakebase Postgres</b>. Para esta nota nada muda: é Postgres de verdade, acessado por uma connection string comum. A diferença para um Postgres tradicional é a arquitetura: computação e armazenamento separados.</>} en={<>Neon belongs to Databricks. Its site calls it “a complete backend from Databricks”, and the database is now called <b>Lakebase Postgres</b>. For this note nothing changes: it is real Postgres, reached with an ordinary connection string. What differs from traditional Postgres is the architecture: compute and storage are separate.</>} /></p>
        <p><T pt="Duas consequências práticas dessa separação aparecem ao longo da nota:" en="Two practical consequences of that split show up throughout the note:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Branches.</em> Uma branch é um clone <i>copy-on-write</i> do banco, criado na hora, inclusive de um ponto no passado. É o que torna o D+1/D+7 da <a href="#refresh">seção 9</a> barato.</>} en={<><em>Branches.</em> A branch is a copy-on-write clone of the database, created instantly, even from a point in the past. That is what makes the D+1/D+7 copy in <a href="#refresh">section 9</a> cheap.</>} /></li>
          <li><T pt={<><em>Scale to zero.</em> Sem conexões por 5 minutos, a computação desliga, e a primeira consulta depois disso espera algumas centenas de milissegundos. No plano Free isso não se desliga; nos pagos, sim.</>} en={<><em>Scale to zero.</em> After 5 minutes without connections the compute shuts down, and the first query after that waits a few hundred milliseconds. On the Free plan this cannot be turned off; on paid plans it can.</>} /></li>
        </ul>
        <Callout tone="info" icon="alert"><T pt={<><b>Por que containers, e não só um Worker?</b> Um Worker roda JavaScript num ambiente próprio, sem sistema de arquivos e sem processos longos. Um container roda qualquer imagem Linux: o seu servidor Node com dependências nativas, um nginx, um binário em Go. Se a sua API cabe num Worker, ela fica mais simples e barata assim. Esta nota é para o caso em que o projeto já é dockerizado.</>} en={<><b>Why containers, and not just a Worker?</b> A Worker runs JavaScript in its own runtime, with no file system and no long-lived processes. A container runs any Linux image: your Node server with native dependencies, nginx, a Go binary. If your API fits in a Worker, it is simpler and cheaper that way. This note is for when the project is already Dockerized.</>} /></Callout>
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
├── web/                    nginx with static files (image 2)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── public/             index.html, app.js, privacidade.html
├── scripts/anonimizar.sql  used by the prod → dev copy
├── src/index.ts            the Worker and the two Durable Objects
├── wrangler.jsonc          dev and production
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
        <p><T pt={<>A tabela e o script que aplica as migrations. O script roda no CI com a URL <b>direta</b> do banco, nunca dentro do container (veja a <a href="#neon">seção 5</a> sobre direta e pooled).</>} en={<>The table and the script that applies migrations. The script runs in CI with the <b>direct</b> database URL, never inside the container (see <a href="#neon">section 5</a> on direct versus pooled).</>} /></p>
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

        <h3><T pt="2.2 O front" en="2.2 The front end" /></h3>
        <p><T pt={<>O nginx sem root (<code>nginx-unprivileged</code>) escuta na 8080. O JavaScript chama <code>/api/recados</code>, um caminho <b>relativo</b>: a mesma imagem serve dev e produção, porque não carrega a URL de nenhuma API.</>} en={<>Rootless nginx (<code>nginx-unprivileged</code>) listens on 8080. The JavaScript calls <code>/api/recados</code>, a <b>relative</b> path: the same image serves dev and production, because it carries no API URL.</>} /></p>
        <CodeBlock code={`# web/nginx.conf
server {
  listen 8080;
  server_tokens off;
  root /usr/share/nginx/html;

  # The Worker calls this before forwarding traffic to the container.
  location = /health { access_log off; default_type text/plain; return 200 "ok\\n"; }

  location / {
    add_header Cache-Control "no-cache";
    try_files $uri $uri/ /index.html;
  }
}`} />
        <CodeBlock code={`# web/Dockerfile
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 8080`} />
        <CodeBlock code={`// web/public/app.js: relative URLs, so the same image works in dev and prod.
const lista = document.querySelector('#lista');
const form = document.querySelector('#form');

async function carregar() {
  const res = await fetch('/api/recados');
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  lista.replaceChildren(...(await res.json()).map((r) => {
    const li = document.createElement('li');
    li.textContent = \`\${r.nome}: \${r.texto}\`; // textContent, never innerHTML: no XSS
    return li;
  }));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  const res = await fetch('/api/recados', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) return alert(\`Erro: HTTP \${res.status}\`);
  form.reset();
  await carregar();
});

carregar().catch((err) => { lista.textContent = \`Não foi possível carregar: \${err.message}\`; });`} />
        <p><T pt={<>O formulário avisa, ao lado do botão, quais dados são guardados, por quanto tempo e onde está a política de privacidade. Isso é o princípio da transparência da LGPD aplicado na tela, e volta na <a href="#lgpd">seção 10</a>.</>} en={<>Next to the button, the form says which data is kept, for how long, and where the privacy policy is. That is the LGPD transparency principle applied on screen, and it comes back in <a href="#lgpd">section 10</a>.</>} /></p>
      </Section>

      <Section id="worker" title={<T pt="3. O Worker e os containers" en="3. The Worker and the containers" />}>
        <p><T pt={<>Cada container pertence a uma <b>classe de Durable Object</b>. Um Durable Object é um objeto com nome, que vive num único lugar da rede da Cloudflare. Quando ele recebe o primeiro pedido, liga o seu container com <code>ctx.container.start()</code>. Daí em diante, repassa os pedidos pela porta do container com <code>getTcpPort(8080).fetch()</code>.</>} en={<>Each container belongs to a <b>Durable Object class</b>. A Durable Object is a named object that lives in one place on Cloudflare's network. When it gets its first request, it starts its container with <code>ctx.container.start()</code>. From then on, it forwards requests to the container's port with <code>getTcpPort(8080).fetch()</code>.</>} /></p>
        <p><T pt={<>Um detalhe importa: <code>start()</code> volta antes de o processo estar pronto. A documentação diz que <code>running</code> verdadeiro não garante que o container já aceita pedidos. Por isso o código consulta <code>/health</code> até receber 200, como no exemplo oficial.</>} en={<>One detail matters: <code>start()</code> returns before the process is ready. The docs say that <code>running</code> being true does not mean the container accepts requests yet. So the code polls <code>/health</code> until it gets a 200, as in the official example.</>} /></p>
        <CodeBlock code={`// src/index.ts: the Worker (router) and one Durable Object class per container.
import { DurableObject } from "cloudflare:workers";

const PORT = 8080;
const IDLE_MS = 10 * 60 * 1000; // stop the container after 10 min without requests

/** Starts its container on the first request, waits for /health, then forwards every request. */
abstract class ContainerProxy extends DurableObject<Env> {
  private starting?: Promise<void>;

  protected abstract startOptions(images: Record<string, string>): ContainerStartupOptions;

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
    if (!container.running) container.start(this.startOptions(container.images));
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

/** nginx with the static front end. No outbound Internet: it only serves files. */
export class Web extends ContainerProxy {
  protected startOptions(images: Record<string, string>): ContainerStartupOptions {
    return { image: images.base, instance: "lite", enableInternet: false };
  }
}

/** Node API. Needs the Internet to reach Neon; the database URL comes from a Worker secret. */
export class Api extends ContainerProxy {
  protected startOptions(images: Record<string, string>): ContainerStartupOptions {
    return {
      image: images.base,
      instance: "basic",
      enableInternet: true,
      env: { DATABASE_URL: this.env.DATABASE_URL, APP_ENV: this.env.APP_ENV },
    };
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const namespace = pathname === "/api" || pathname.startsWith("/api/") ? env.API : env.WEB;
    // A fixed pool of named instances; a random one takes each request (Cloudflare's load-balancing pattern).
    const index = Math.floor(Math.random() * Number(env.POOL_SIZE));
    return namespace.getByName(\`pool-\${index}\`).fetch(request);
  },
} satisfies ExportedHandler<Env>;`} />
        <ul className="ds-list">
          <li><T pt={<><em>Um pool fixo de instâncias com nome.</em> Cada nome (<code>pool-0</code>, <code>pool-1</code>…) é um Durable Object com o seu container. O Worker sorteia um nome por pedido, que é o padrão de balanceamento da documentação. Em dev o pool tem 1; em produção, 3.</>} en={<><em>A fixed pool of named instances.</em> Each name (<code>pool-0</code>, <code>pool-1</code>…) is a Durable Object with its own container. The Worker picks a name at random for each request, which is the load-balancing pattern from the docs. Dev has a pool of 1; production, 3.</>} /></li>
          <li><T pt={<><em>Internet só para quem precisa.</em> O nginx sobe com <code>enableInternet: false</code>: ele só serve arquivos. A API precisa de <code>true</code> para chegar ao Neon. Um container comprometido sem saída para a internet tem muito menos o que fazer.</>} en={<><em>Internet only where needed.</em> nginx starts with <code>enableInternet: false</code>: it only serves files. The API needs <code>true</code> to reach Neon. A compromised container with no way out to the Internet can do far less.</>} /></li>
          <li><T pt={<><em>Segredos entram pelo <code>env</code> do <code>start()</code>.</em> A URL do banco é um <i>secret</i> do Worker (<code>this.env.DATABASE_URL</code>), passado ao container quando ele liga. Ela nunca vai para a imagem nem para <code>build_vars</code>, que são só de build. Se você trocar o segredo, o container em execução continua com o valor antigo até religar.</>} en={<><em>Secrets enter through <code>start()</code>'s <code>env</code>.</em> The database URL is a Worker <i>secret</i> (<code>this.env.DATABASE_URL</code>), passed to the container when it starts. It never goes into the image or into <code>build_vars</code>, which are build-time only. If you change the secret, a running container keeps the old value until it restarts.</>} /></li>
          <li><T pt={<><em>Desligar por inatividade.</em> Sem pedidos por 10 minutos, o container para (o máximo é 6 horas). O disco é efêmero: ao religar, ele volta limpo, igual à imagem. Nada que importe pode ficar no disco do container; o que importa vai para o banco.</>} en={<><em>Idle shutdown.</em> After 10 minutes without requests the container stops (the maximum is 6 hours). The disk is ephemeral: on restart it comes back clean, like the image. Nothing that matters can live on the container's disk; what matters goes to the database.</>} /></li>
          <li><T pt={<><em>Partida a frio.</em> A documentação fala em 1 a 3 segundos, dependendo do tamanho da imagem. Imagens Alpine pequenas ajudam.</>} en={<><em>Cold start.</em> The docs say 1 to 3 seconds, depending on image size. Small Alpine images help.</>} /></li>
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
        <p><T pt={<>O tamanho é escolhido no <code>start()</code> (<code>instance</code>), não no wrangler. A cobrança é por cada 10 ms de container ligado: memória e disco pelo tamanho reservado, CPU pelo uso real. Um container desligado por inatividade não cobra.</>} en={<>The size is chosen in <code>start()</code> (<code>instance</code>), not in wrangler. Billing is per 10 ms the container runs: memory and disk by the provisioned size, CPU by actual use. A container stopped for inactivity costs nothing.</>} /></p>
      </Section>

      <Section id="envs" title={<T pt="4. Dev e produção no wrangler" en="4. Dev and production in wrangler" />}>
        <p><T pt={<>No wrangler, cada ambiente vira um <b>Worker separado</b>, chamado <code>&lt;nome&gt;-&lt;ambiente&gt;</code>: aqui, <code>recados-dev</code> e <code>recados-production</code>. Eles não compartilham nada: nem containers, nem Durable Objects, nem segredos.</>} en={<>In wrangler, each environment becomes a <b>separate Worker</b>, named <code>&lt;name&gt;-&lt;environment&gt;</code>: here, <code>recados-dev</code> and <code>recados-production</code>. They share nothing: no containers, no Durable Objects, no secrets.</>} /></p>
        <CodeBlock code={`// wrangler.jsonc: one Worker per environment (recados-dev, recados-production).
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
      "vars": { "APP_ENV": "dev", "POOL_SIZE": "1" },
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
      "vars": { "APP_ENV": "production", "POOL_SIZE": "3" },
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
        <p><T pt={<>A pegadinha é a herança. Algumas chaves passam do topo para os ambientes (<code>name</code>, <code>main</code>, <code>compatibility_date</code>, <code>exports</code>, <code>routes</code>). Outras não: <code>vars</code>, <code>durable_objects</code>, <code>containers</code>, <code>hyperdrive</code> e os segredos precisam ser repetidos em <b>cada</b> ambiente. Por isso a lista de containers aparece duas vezes.</>} en={<>The catch is inheritance. Some keys flow from the top level into environments (<code>name</code>, <code>main</code>, <code>compatibility_date</code>, <code>exports</code>, <code>routes</code>). Others do not: <code>vars</code>, <code>durable_objects</code>, <code>containers</code>, <code>hyperdrive</code> and secrets must be repeated in <b>each</b> environment. That is why the container list appears twice.</>} /></p>
        <p><T pt="Os segredos também são por ambiente. O wrangler pergunta o valor, que não fica no repositório nem no histórico do terminal:" en="Secrets are per environment too. Wrangler prompts for the value, so it stays out of the repository and the shell history:" /></p>
        <CodeBlock code={`npx wrangler secret put DATABASE_URL --env dev          # pooled URL of the recados-dev project
npx wrangler secret put DATABASE_URL --env production   # pooled URL of the recados-prod project

npx wrangler types --env dev    # generates the Env type (WEB, API, APP_ENV, POOL_SIZE, DATABASE_URL)
npx wrangler deploy --dry-run --env production   # validates the config and builds both images`} />
        <Callout tone="info" icon="alert"><T pt={<><b>A política de agendamento.</b> A chave <code>"scheduling_policy": "durable_object"</code> é a que a documentação usa hoje: cada container pertence a um Durable Object. A política antiga (<code>default</code>, ou sem a chave) está marcada como obsoleta, e a nova ainda é <i>public beta</i>. Na nova, opções como <code>instance_type</code>, <code>max_instances</code> e restrições de região não são aceitas no wrangler. Isso pesa na LGPD (<a href="#lgpd">seção 10</a>).</>} en={<><b>The scheduling policy.</b> <code>"scheduling_policy": "durable_object"</code> is what the docs use today: each container belongs to a Durable Object. The old policy (<code>default</code>, or no key) is marked deprecated, and the new one is still in public beta. Under the new one, wrangler rejects options such as <code>instance_type</code>, <code>max_instances</code> and region constraints. That matters for the LGPD (<a href="#lgpd">section 10</a>).</>} /></Callout>
      </Section>

      <Section id="neon" title={<T pt="5. Neon: projetos e conexões" en="5. Neon: projects and connections" />}>
        <h3><T pt="5.1 Um projeto por ambiente, em São Paulo" en="5.1 One project per environment, in São Paulo" /></h3>
        <p><T pt={<>Crie dois projetos no console do Neon: <code>recados-prod</code> e <code>recados-dev</code>, os dois na região <b>AWS South America (São Paulo)</b>, id <code>aws-sa-east-1</code>. A região é escolhida na criação do projeto e não muda depois; trocar exige um projeto novo e migrar os dados.</>} en={<>Create two projects in the Neon console: <code>recados-prod</code> and <code>recados-dev</code>, both in <b>AWS South America (São Paulo)</b>, id <code>aws-sa-east-1</code>. The region is chosen when the project is created and cannot change later; moving means a new project and migrating the data.</>} /></p>
        <p><T pt="Por que dois projetos, se o Neon tem branches? Branch é ótima para cópias rápidas, mas mora no mesmo projeto: mesma chave de API, mesmas pessoas com acesso ao console. Projetos separados deixam produção fechada para quem só trabalha em dev." en="Why two projects, when Neon has branches? A branch is great for quick copies, but it lives in the same project: same API key, same people with console access. Separate projects keep production closed to people who only work on dev." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Em <code>recados-prod</code>,</em> marque a branch <code>main</code> como <b>protegida</b> (planos pagos). Branch protegida não pode ser apagada nem resetada.</>} en={<><em>In <code>recados-prod</code>,</em> mark the <code>main</code> branch as <b>protected</b> (paid plans). A protected branch cannot be deleted or reset.</>} /></li>
          <li><T pt={<><em>Em <code>recados-dev</code>,</em> o banco recebe as mesmas migrations e, uma vez por semana ou por dia, uma cópia anonimizada de produção (<a href="#refresh">seção 9</a>).</>} en={<><em>In <code>recados-dev</code>,</em> the database gets the same migrations and, once a week or once a day, an anonymized copy of production (<a href="#refresh">section 9</a>).</>} /></li>
          <li><T pt={<><em>Crie um banco <code>recados</code></em> em cada projeto e um papel (role) só para o app, em vez de usar o dono do banco.</>} en={<><em>Create a <code>recados</code> database</em> in each project, and a role just for the app instead of the database owner.</>} /></li>
        </ul>

        <Callout tone="warn" icon="alert"><T pt={<><b>A distância entre a API e o banco.</b> O container roda onde o seu Durable Object estiver, e a documentação avisa que hoje Durable Objects não nascem na América do Sul: quem pede América do Sul recebe o leste da América do Norte. Ou seja, a API roda lá, e o banco está em São Paulo. Cada consulta atravessa essa distância, ida e volta. Faça poucas consultas por pedido (uma, de preferência), sem laços que consultam linha a linha. Pôr o Neon em <code>aws-us-east-1</code> encurtaria o caminho, mas tiraria os dados em repouso do Brasil. É uma troca entre latência e localização dos dados (<a href="#lgpd">seção 10</a>).</>} en={<><b>The distance between the API and the database.</b> A container runs wherever its Durable Object is, and the docs warn that Durable Objects are not currently created in South America: asking for South America gets Eastern North America. So the API runs there, while the database is in São Paulo. Every query crosses that distance and back. Make few queries per request (one, ideally), with no loops that query row by row. Putting Neon in <code>aws-us-east-1</code> would shorten the path, but would move the data at rest out of Brazil. It is a trade-off between latency and where the data lives (<a href="#lgpd">section 10</a>).</>} /></Callout>

        <h3><T pt="5.2 Duas connection strings: pooled e direta" en="5.2 Two connection strings: pooled and direct" /></h3>
        <CodeBlock code={`# pooled (PgBouncer, transaction mode): the app inside the container
postgresql://app:<password>@ep-xxx-123456-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require

# direct: migrations, pg_dump, pg_restore, admin work
postgresql://app:<password>@ep-xxx-123456.sa-east-1.aws.neon.tech/recados?sslmode=require`} />
        <p><T pt={<>A única diferença é o <code>-pooler</code> no host. A versão pooled passa por um PgBouncer do Neon em modo transação, que junta milhares de conexões de cliente em poucas conexões reais. Ela combina com containers que ligam e desligam e com várias instâncias abrindo conexões ao mesmo tempo.</>} en={<>The only difference is <code>-pooler</code> in the host. The pooled one goes through Neon's PgBouncer in transaction mode, which folds thousands of client connections into a few real ones. It suits containers that start and stop, with several instances opening connections at once.</>} /></p>
        <p><T pt={<>O modo transação tem um custo: cada transação pode cair numa conexão diferente. Por isso não funcionam, pela conexão pooled, coisas que dependem da sessão: <code>SET</code> fora de uma transação, <code>LISTEN</code>/<code>NOTIFY</code>, tabelas temporárias, <code>PREPARE</code> em SQL e <i>advisory locks</i> de sessão. Migrations e <code>pg_dump</code> usam a <b>direta</b>.</>} en={<>Transaction mode has a cost: each transaction may land on a different connection. So, over the pooled connection, anything tied to the session does not work: <code>SET</code> outside a transaction, <code>LISTEN</code>/<code>NOTIFY</code>, temporary tables, SQL-level <code>PREPARE</code> and session advisory locks. Migrations and <code>pg_dump</code> use the <b>direct</b> one.</>} /></p>
        <Callout tone="info" icon="alert"><T pt={<><b>E o Hyperdrive?</b> O Hyperdrive é o pool de conexões da própria Cloudflare, e funciona com o Neon. Mas ele é um <i>binding</i> do Worker; a documentação não mostra uso de dentro de um container. Como a nossa API roda no container, ela vai direto ao pooler do Neon. Se um dia a API virar código de Worker, o Hyperdrive passa a fazer sentido. Nesse caso, o guia do Neon manda desligar o pooling no Neon e usar a URL direta.</>} en={<><b>What about Hyperdrive?</b> Hyperdrive is Cloudflare's own connection pooler, and it works with Neon. But it is a Worker binding; the docs do not show it used from inside a container. Since our API runs in the container, it goes straight to Neon's pooler. If the API ever becomes Worker code, Hyperdrive makes sense. In that case, Neon's guide says to turn off Neon's pooling and use the direct URL.</>} /></Callout>
      </Section>

      <Section id="local" title={<T pt="6. Rodar na sua máquina" en="6. Running on your machine" />}>
        <p><T pt={<>O <code>wrangler dev</code> roda o Worker e os dois containers no seu Docker, com o mesmo roteamento da nuvem. Os segredos locais ficam num arquivo <code>.dev.vars.&lt;ambiente&gt;</code>, fora do git. Ele pode apontar para um Postgres local ou para o projeto <code>recados-dev</code> do Neon. Nunca para produção.</>} en={<><code>wrangler dev</code> runs the Worker and both containers in your Docker, with the same routing as the cloud. Local secrets live in a <code>.dev.vars.&lt;environment&gt;</code> file, outside git. It can point at a local Postgres or at Neon's <code>recados-dev</code> project. Never at production.</>} /></p>
        <CodeBlock code={`# .dev.vars.dev  (add .dev.vars* to .gitignore)
DATABASE_URL="postgresql://app:<password>@ep-xxx-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require"`} />
        <CodeBlock code={`npm install && npm install --prefix api
DATABASE_URL_DIRECT="<direct URL of recados-dev>" npm run migrate --prefix api
npx wrangler dev --env dev            # http://localhost:8787 ; press "r" to rebuild the containers

curl -s localhost:8787/api/health     # {"ok":true,"env":"dev"}
curl -s -XPOST localhost:8787/api/recados -H 'content-type: application/json' \\
  -d '{"nome":"Bia","texto":"via Worker"}'
curl -s localhost:8787/api/recados`} />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, medido aqui:</b> o primeiro pedido ao nginx levou 10,7 s (o wrangler ainda baixava a imagem auxiliar <code>cloudflare/proxy-everything</code>) e o primeiro à API, 2,6 s. Depois disso, 16 a 50 ms. O código do Worker recarrega ao salvar, mas o dos containers só com <code>r</code>.</>} en={<><b>Personal note, measured here:</b> the first request to nginx took 10.7 s (wrangler was still pulling the helper image <code>cloudflare/proxy-everything</code>) and the first to the API, 2.6 s. After that, 16 to 50 ms. Worker code reloads on save, but container code only with <code>r</code>.</>} /></Callout>
      </Section>

      <Section id="deploy" title={<T pt="7. Deploy com aprovação" en="7. Deploy with approval" />}>
        <p><T pt={<>O fluxo: cada push na <code>main</code> aplica as migrations e faz deploy em dev. O job de produção espera alguém aprovar. A aprovação é uma regra do <i>environment</i> <code>production</code> no GitHub (<i>Required reviewers</i>), e os segredos de produção só existem nesse environment.</>} en={<>The flow: every push to <code>main</code> applies migrations and deploys dev. The production job waits for someone to approve. The approval is a rule on the <code>production</code> <i>environment</i> on GitHub (<i>Required reviewers</i>), and production secrets exist only in that environment.</>} /></p>
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
      - name: Deploy recados-dev (builds and pushes both images)
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
          <li><T pt={<><em>Token da Cloudflare.</em> Crie um API token com permissão de editar Workers e guarde como <code>CLOUDFLARE_API_TOKEN</code>, junto com o <code>CLOUDFLARE_ACCOUNT_ID</code>. Se puder, use tokens diferentes para dev e produção.</>} en={<><em>Cloudflare token.</em> Create an API token that can edit Workers and store it as <code>CLOUDFLARE_API_TOKEN</code>, along with <code>CLOUDFLARE_ACCOUNT_ID</code>. If you can, use different tokens for dev and production.</>} /></li>
          <li><T pt={<><em>Migration antes do deploy.</em> Ela roda primeiro, com o código antigo ainda no ar. Por isso cada migration precisa funcionar com o código antigo e com o novo (adicionar coluna, sim; renomear de uma vez, não).</>} en={<><em>Migration before deploy.</em> It runs first, with the old code still live. So each migration must work with both the old and the new code (adding a column, yes; renaming in one go, no).</>} /></li>
          <li><T pt={<><em>O deploy não é atômico.</em> Segundo a documentação, o Worker novo entra no ar primeiro, e os containers são atualizados aos poucos (<i>rollout</i> gradual). Por alguns minutos, um front novo pode falar com uma API antiga. Mantenha a API compatível com a versão anterior do front.</>} en={<><em>Deploy is not atomic.</em> According to the docs, the new Worker goes live first and the containers update gradually (a rolling rollout). For a few minutes, a new front end may talk to an old API. Keep the API compatible with the previous front end.</>} /></li>
          <li><T pt={<><em>Primeiro deploy.</em> Depois do primeiro <code>wrangler deploy</code>, a documentação pede para esperar alguns minutos até os containers ficarem prontos. Acompanhe com <code>npx wrangler containers list</code>.</>} en={<><em>First deploy.</em> After the first <code>wrangler deploy</code>, the docs say to wait several minutes until containers are ready. Watch with <code>npx wrangler containers list</code>.</>} /></li>
        </ul>
      </Section>

      <Section id="backups" title={<T pt="8. Backups e exportação" en="8. Backups and exports" />}>
        <p><T pt="O Neon oferece três camadas. Elas se complementam: cada uma cobre uma falha que a anterior não cobre." en="Neon offers three layers. They complement each other: each covers a failure the previous one does not." /></p>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="O que é" en="What it is" />, <T pt="Quanto tempo" en="How long" />, <T pt="Cobre" en="Covers" />]}
          rows={[
            [<T pt="Janela de histórico (instant restore)" en="History window (instant restore)" />, <T pt="Volta a branch para qualquer segundo dentro da janela" en="Rewinds the branch to any second inside the window" />, <T pt="Padrão de 1 dia nos planos pagos; até 7 dias no Launch e 30 no Scale; 6 horas no Free" en="Default 1 day on paid plans; up to 7 days on Launch and 30 on Scale; 6 hours on Free" />, <T pt={<>O <code>DELETE</code> sem <code>WHERE</code> de agora há pouco</>} en={<>The <code>DELETE</code> without <code>WHERE</code> from a moment ago</>} />],
            [<T pt="Snapshots agendados" en="Scheduled snapshots" />, <T pt="Uma foto diária, semanal ou mensal da branch raiz" en="A daily, weekly or monthly picture of the root branch" />, <T pt="Retenção de 1 hora a 35 dias (planos pagos)" en="Retention from 1 hour to 35 days (paid plans)" />, <T pt="Erros que só alguém percebe dias depois" en="Mistakes nobody notices for days" />],
            [<T pt={<>Exportação com <code>pg_dump</code></>} en={<>Export with <code>pg_dump</code></>} />, <T pt="Um arquivo seu, fora do Neon" en="A file of yours, outside Neon" />, <T pt="O quanto você guardar" en="As long as you keep it" />, <T pt="Perder a conta, sair do Neon, auditoria" en="Losing the account, leaving Neon, audits" />],
          ]}
        />

        <h3><T pt="8.1 Janela de histórico e snapshots" en="8.1 History window and snapshots" /></h3>
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

        <h3><T pt="8.2 Exportação noturna" en="8.2 Nightly export" /></h3>
        <p><T pt={<>O <code>pg_dump</code> precisa da URL <b>direta</b>; a documentação do Neon pede para evitar a pooled. A versão do cliente deve acompanhar a do servidor, e o jeito mais simples de garantir isso é rodar o <code>pg_dump</code> da imagem oficial do Postgres da mesma versão. O arquivo é cifrado antes de sair do runner.</>} en={<><code>pg_dump</code> needs the <b>direct</b> URL; Neon's docs say to avoid the pooled one. The client version should match the server's, and the simplest way to guarantee that is to run <code>pg_dump</code> from the official Postgres image of the same version. The file is encrypted before it leaves the runner.</>} /></p>
        <CodeBlock code={`# .github/workflows/backup.yml: nightly retention, then an export that lives outside Neon.
name: backup
on:
  schedule:
    - cron: "0 5 * * *"              # every day 05:00 UTC
  workflow_dispatch:
concurrency: backup

jobs:
  dump:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Retention first, so expired rows do not enter tonight's export
        env:
          SRC: \${{ secrets.DATABASE_URL_DIRECT }}
        run: |
          docker run --rm -e SRC postgres:17-alpine psql "$SRC" -v ON_ERROR_STOP=1 \\
            -c "delete from recados where criado_em < now() - interval '90 days'"
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
        <Callout tone="info" icon="alert"><T pt={<><b>A retenção vem antes do dump.</b> O primeiro passo do workflow apaga os recados com mais de 90 dias, o prazo prometido na tela. Assim, o que já venceu não entra no arquivo da noite. Os backups guardam o que já foi apagado por um tempo. Isso tem consequência na LGPD (<a href="#lgpd">seção 10</a>).</>} en={<><b>Retention comes before the dump.</b> The workflow's first step deletes messages older than 90 days, the period promised on screen. That way, expired data does not enter tonight's file. Backups keep deleted data for a while. That has an LGPD consequence (<a href="#lgpd">section 10</a>).</>} /></Callout>
      </Section>

      <Section id="refresh" title={<T pt="9. Prod → dev em D+1 ou D+7" en="9. Prod → dev at D+1 or D+7" />}>
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

      <Section id="lgpd" title={<T pt="10. LGPD" en="10. LGPD (Brazil's data protection law)" />}>
        <Callout tone="warn" icon="alert"><T pt={<><b>Isto não é parecer jurídico.</b> São os pontos em que a lei e as resoluções da ANPD encostam neste desenho técnico, com os artigos para você ler e levar a quem cuida do jurídico.</>} en={<><b>This is not legal advice.</b> These are the points where the law (Lei 13.709/2018) and the ANPD's resolutions touch this technical design, with the articles for you to read and take to whoever handles legal.</>} /></Callout>

        <h3><T pt="10.1 Quem é quem" en="10.1 Who is who" /></h3>
        <p><T pt={<>Você (a empresa dona do app) é o <b>controlador</b>: decide o que se coleta e para quê (art. 5º, VI). Cloudflare, Neon/Databricks e GitHub, quando tocam nos dados, são <b>operadores</b>: tratam em seu nome e seguem suas instruções (art. 5º, VII, e art. 39). Na prática, isso é o contrato de tratamento de dados (DPA) de cada fornecedor, que você precisa ter lido e aceito.</>} en={<>You (the company that owns the app) are the <b>controller</b>: you decide what is collected and why (art. 5, VI). Cloudflare, Neon/Databricks and GitHub, when they touch the data, are <b>processors</b>: they process it on your behalf and follow your instructions (art. 5, VII, and art. 39). In practice, that is each vendor's data processing agreement (DPA), which you need to have read and accepted.</>} /></p>

        <h3><T pt="10.2 Onde os dados ficam, e onde passam" en="10.2 Where the data rests, and where it passes" /></h3>
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

        <h3><T pt="10.3 O que este desenho já faz pela lei" en="10.3 What this design already does for the law" /></h3>
        <Table
          head={[<T pt="Exigência" en="Requirement" />, <T pt="Onde aparece na nota" en="Where it shows up in the note" />]}
          rows={[
            [<T pt="Necessidade: o mínimo de dados (art. 6º, III)" en="Necessity: the minimum data (art. 6, III)" />, <T pt="Só nome e recado; nada de e-mail, IP ou CPF guardado" en="Only name and message; no e-mail, IP or tax ID stored" />],
            [<T pt="Transparência (art. 6º, VI)" en="Transparency (art. 6, VI)" />, <T pt="Aviso no formulário e link para a política de privacidade" en="Notice on the form and a link to the privacy policy" />],
            [<T pt="Segurança (art. 46)" en="Security (art. 46)" />, <T pt={<>TLS até o Neon (o Neon exige TLS em toda conexão), segredos como <i>secrets</i> do Worker, nginx sem internet, branch <code>main</code> protegida, produção só com aprovação</>} en={<>TLS all the way to Neon (Neon requires TLS on every connection), secrets as Worker secrets, nginx with no Internet, protected <code>main</code> branch, production only with approval</>} />],
            [<T pt="Dado real fora de dev" en="Real data kept out of dev" />, <T pt={<>Projeto separado e cópia anonimizada (<a href="#refresh">seção 9</a>). Dados anonimizados de forma irreversível deixam de ser dados pessoais (art. 12). Um mascaramento que mantém o <code>id</code> de produção pode ser revertido por quem acessa produção, então trate dev com cuidado mesmo assim.</>} en={<>A separate project and an anonymized copy (<a href="#refresh">section 9</a>). Irreversibly anonymized data stops being personal data (art. 12). A masking that keeps the production <code>id</code> can be reversed by anyone with production access, so treat dev with care anyway.</>} />],
            [<T pt="Término e eliminação (arts. 15, 16 e 18, VI)" en="End of processing and deletion (arts. 15, 16 and 18, VI)" />, <T pt="Retenção de 90 dias aplicada todo dia, antes do backup" en="90-day retention applied daily, before the backup" />],
          ]}
        />

        <h3><T pt="10.4 O que ainda é com você" en="10.4 What is still on you" /></h3>
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

      <Section id="verify" title={<T pt="11. Conferir e diagnosticar" en="11. Checking and troubleshooting" />}>
        <CodeBlock code={`DOMAIN=example.com.br
curl -s https://$DOMAIN/api/health                 # {"ok":true,"env":"production"}
curl -s -o /dev/null -w '%{http_code}\\n' https://$DOMAIN/some/route   # 200 (nginx falls back to index.html)
npx wrangler containers list                        # instances and their state
npx wrangler deployments list --env production      # which version is live`} />
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />]}
          rows={[
            [<T pt={<>Logo após o primeiro deploy, erro nas rotas e a página não carrega</>} en={<>Right after the first deploy, errors on every route and the page does not load</>} />, <T pt="Os containers ainda estão sendo provisionados. A documentação pede alguns minutos; acompanhe com wrangler containers list." en="The containers are still being provisioned. The docs say to wait several minutes; watch with wrangler containers list." />],
            [<T pt={<><code>container did not answer /health on port 8080</code></>} en={<><code>container did not answer /health on port 8080</code></>} />, <T pt={<>O processo não escuta na 8080, não tem a rota <code>/health</code> ou quebrou ao iniciar. Veja os logs do container no painel (com <code>observability</code> ligado).</>} en={<>The process does not listen on 8080, has no <code>/health</code> route, or crashed on start. Check the container logs in the dashboard (with <code>observability</code> on).</>} />],
            [<T pt={<>A API responde, mas <code>/api/recados</code> dá 500 e o log mostra <code>ENOTFOUND</code> ou <code>ETIMEDOUT</code></>} en={<>The API answers, but <code>/api/recados</code> gives 500 and the log shows <code>ENOTFOUND</code> or <code>ETIMEDOUT</code></>} />, <T pt={<>O container da API subiu com <code>enableInternet: false</code>, ou o segredo <code>DATABASE_URL</code> não existe naquele ambiente (<code>--env</code>).</>} en={<>The API container started with <code>enableInternet: false</code>, or the <code>DATABASE_URL</code> secret does not exist in that environment (<code>--env</code>).</>} />],
            [<T pt={<>Trocou o segredo e nada mudou</>} en={<>Changed the secret and nothing changed</>} />, <T pt="O container em execução guarda o ambiente de quando ligou. Ele lê o valor novo no próximo início (após inatividade ou novo deploy)." en="A running container keeps the environment it started with. It reads the new value on the next start (after inactivity or a new deploy)." />],
            [<T pt={<>Erro com <code>SET</code>, <code>LISTEN</code> ou <i>prepared statement</i></>} en={<>Errors with <code>SET</code>, <code>LISTEN</code> or prepared statements</>} />, <T pt="É o modo transação do pooler. Use a URL direta para isso, ou mude o código." en="That is the pooler's transaction mode. Use the direct URL for it, or change the code." />],
            [<T pt={<>O <code>neon branches create --parent &lt;data&gt;</code> falha no refresh</>} en={<><code>neon branches create --parent &lt;date&gt;</code> fails in the refresh</>} />, <T pt="O instante está fora da janela de histórico. Aumente a janela ou diminua o atraso." en="The instant is outside the history window. Widen the window or shorten the lag." />],
            [<T pt={<>O <code>pg_dump</code> recusa o servidor por versão</>} en={<><code>pg_dump</code> refuses the server because of its version</>} />, <T pt="O cliente é mais antigo que o servidor. Use a imagem postgres com a mesma versão principal do projeto." en="The client is older than the server. Use the postgres image with the project's major version." />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, sobre o que foi testado:</b> as duas imagens, a API com Postgres 17 (inserir, listar, 422 para campo vazio, 400 para JSON inválido), o nginx com o <i>fallback</i> de rota, a parada por <code>SIGTERM</code> (0,5 s), as migrations rodando duas vezes sem efeito, o Worker com os dois containers no <code>wrangler dev</code> 4.167, o <code>tsc</code> com os tipos gerados, o <code>wrangler deploy --dry-run</code> nos dois ambientes e o caminho anonimizar → dump → restore foram executados nesta máquina. Os workflows passaram por uma checagem de sintaxe YAML. <b>Nada foi publicado numa conta Cloudflare ou Neon</b> para escrever esta nota.</>} en={<><b>Personal note, on what was tested:</b> both images, the API with Postgres 17 (insert, list, 422 for an empty field, 400 for invalid JSON), nginx with the route fallback, the <code>SIGTERM</code> stop (0.5 s), migrations running twice with no effect, the Worker with both containers under <code>wrangler dev</code> 4.167, <code>tsc</code> with the generated types, <code>wrangler deploy --dry-run</code> for both environments and the anonymize → dump → restore path were run on this machine. The workflows went through a YAML syntax check. <b>Nothing was deployed to a Cloudflare or Neon account</b> to write this note.</>} /></Callout>
        <Sources title={<T pt="Fontes oficiais (consultadas em 23/11/2026)" en="Official sources (checked 23 Nov 2026)" />}>
          <ul>
            <li><a href="https://developers.cloudflare.com/containers/get-started/">Cloudflare Docs · Containers: Get started</a></li>
            <li><a href="https://developers.cloudflare.com/containers/api/durable-object-container/">Cloudflare Docs · Containers: Durable Object Container API (start, running, getTcpPort, setInactivityTimeout)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/configuration/scheduling-policy/">Cloudflare Docs · Containers: Scheduling policy</a></li>
            <li><a href="https://developers.cloudflare.com/containers/concepts/placement/">Cloudflare Docs · Containers: Placement (regions and jurisdictions)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/">Cloudflare Docs · Containers: Env vars and secrets</a></li>
            <li><a href="https://developers.cloudflare.com/containers/configuration/outbound-traffic/">Cloudflare Docs · Containers: Outbound traffic (enableInternet)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/platform-details/limits/">Cloudflare Docs · Containers: Limits and instance types</a></li>
            <li><a href="https://developers.cloudflare.com/containers/pricing/">Cloudflare Docs · Containers: Pricing</a></li>
            <li><a href="https://developers.cloudflare.com/containers/faq/">Cloudflare Docs · Containers: FAQ (rollouts, cold starts, ephemeral disk, logs)</a></li>
            <li><a href="https://developers.cloudflare.com/containers/local-dev/">Cloudflare Docs · Containers: Local development</a></li>
            <li><a href="https://developers.cloudflare.com/workers/wrangler/configuration/">Cloudflare Docs · Wrangler configuration (non-inheritable keys, containers)</a></li>
            <li><a href="https://developers.cloudflare.com/workers/wrangler/environments/">Cloudflare Docs · Wrangler environments</a></li>
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
            <li><a href="https://neon.com/docs/extensions/postgresql-anonymizer">Neon Docs · PostgreSQL Anonymizer</a></li>
            <li><a href="https://neon.com/docs/guides/cloudflare-hyperdrive">Neon Docs · Cloudflare Hyperdrive</a></li>
            <li><a href="https://neon.com/docs/security/security-overview">Neon Docs · Security overview</a></li>
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
