import { Callout, CodeBlock, Diagram, QA, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "cloudflare-containers-neon",
  title: "Cloudflare Containers e Neon: dev e prod",
  seo: {
    title: "Tutorial: front em Next.js (SSR) e API Node no Cloudflare Containers com Neon Postgres, variáveis de ambiente, dev igual a prod, exportação e LGPD",
    description: "Passo a passo: uma imagem Next.js com renderização no servidor e uma imagem da API Node atrás de um Worker no Cloudflare Containers, Neon Postgres em São Paulo, muitas variáveis de ambiente e segredos por container, dev com a mesma segurança de produção, backups, cópia anonimizada D+1/D+7, exportação dos dados do Neon (para o cliente ou para o AWS RDS) e o que a LGPD exige.",
  },
  summary: "um tutorial didático para rodar um app em Docker no Cloudflare Containers com Neon Postgres: um front em Next.js 16 no modo standalone (Docker porque o SSR precisa de um servidor Node; connection() para ler process.env a cada pedido; nenhuma variável NEXT_PUBLIC_, que congela no build) e uma API Node, cada um na sua imagem; um Worker manda /api/* para a API e o resto para o Next.js, cada container controlado por um Durable Object (política durable_object, ctx.container.start, getTcpPort, espera pelo /health, um pool fixo de instâncias com nome); o container do Next fica sem internet e chega à API durante o SSR por interceptOutboundHttp num host virtual atendido por uma WorkerEntrypoint; variáveis de ambiente em três tipos (build_vars no build, vars por ambiente, segredos cadastrados com wrangler secret bulk e declarados em secrets.required), com uma lista por container passada em start({ env }); dev e produção com configuração idêntica e a mesma segurança, diferentes só em nome, domínio, dados e credenciais; Neon (Lakebase Postgres, da Databricks) em aws-sa-east-1 com um projeto por ambiente, conexão pooled para o app e direta para migrations e pg_dump; GitHub Actions para deploy com aprovação, exportações noturnas cifradas com pg_dump, janela de histórico e snapshots, e uma cópia anonimizada D+1/D+7 de produção para dev; como tirar os dados do Neon (não há botão nem API de exportação: pg_dump/pg_restore, psql \\copy para CSV, ou replicação lógica com o Neon como origem, mudança irreversível do wal_level, sequências não replicadas) para atender um cliente ou ir para o AWS RDS; e a LGPD (controlador e operadores, transferência internacional pelo art. 33 e pela Resolução ANPD 19/2024, containers que não podem ser fixados no Brasil, pedidos de acesso em 15 dias, retenção nos backups, comunicação de incidente em 3 dias úteis). O código segue a documentação oficial da Cloudflare, do Next.js, do Neon, do PostgreSQL e da AWS; nada foi publicado numa conta Cloudflare ou Neon.",
  kicker: "Cloudflare · Next.js · Neon · LGPD",
  heroTitle: <>Dois containers na Cloudflare, <em>Postgres no Neon, dois ambientes.</em></>,
  heroLede: "Um front em Next.js com renderização no servidor e uma API Node, cada um na sua imagem Docker, rodando no Cloudflare Containers atrás de um Worker que divide o tráfego pelo caminho. O banco é o Neon em São Paulo. Dev e produção são iguais, com a mesma segurança. No caminho: como passar muitas variáveis de ambiente para as imagens, como tirar os dados do Neon e o que a LGPD muda nesse desenho.",
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "overview", title: "O desenho" },
        { id: "before", title: "1. Antes de começar" },
        { id: "images", title: "2. As duas imagens" },
        { id: "worker", title: "3. O Worker e os containers" },
        { id: "vars", title: "4. Variáveis de ambiente" },
        { id: "envs", title: "5. Dev igual a produção" },
        { id: "neon", title: "6. Neon: projetos e conexões" },
        { id: "local", title: "7. Rodar na sua máquina" },
        { id: "deploy", title: "8. Deploy com aprovação" },
        { id: "backups", title: "9. Backups" },
        { id: "refresh", title: "10. Prod → dev em D+1 ou D+7" },
        { id: "export", title: "11. Tirar os dados do Neon" },
        { id: "lgpd", title: "12. LGPD" },
        { id: "verify", title: "13. Conferir e diagnosticar" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={"O desenho"}>
        <p>O app de exemplo é um mural de <b>recados</b>: a pessoa deixa o nome e uma mensagem, e a página mostra os últimos vinte. É pequeno, mas guarda dado pessoal, o que torna a parte de LGPD concreta.</p>
        <p>São três peças. O <b>front</b> é um Next.js que renderiza as páginas no servidor (SSR). A <b>API</b> é um processo Node que fala com o banco. O <b>banco</b> é um Postgres no Neon. As duas primeiras viram imagens Docker; o banco é um serviço gerenciado.</p>
        <p>No Cloudflare Containers, um container nunca recebe tráfego direto da internet. Quem recebe é um <b>Worker</b> (código JavaScript que roda na borda da Cloudflare). Ele olha o caminho da URL e repassa o pedido para um <b>Durable Object</b>, que liga e controla o container.</p>
        <Diagram minWidth={540} caption={"Um Worker por ambiente. /api/* vai para o container da API, o resto para o Next.js. Durante o SSR, o Next chama a API por um host virtual que o próprio Worker atende. Só a API sai para a internet, para falar com o Neon em São Paulo."}>
          <svg viewBox="0 0 720 340" role="img" aria-label="Worker, dois containers e Neon">
            <rect x="128" y="10" width="392" height="320" rx="6" className="ln dash" />
            <text x="142" y="30" className="mut" textAnchor="start">Cloudflare · rede global</text>
            <rect x="8" y="135" width="100" height="60" rx="4" className="ln fillsoft" />
            <text x="58" y="160" textAnchor="middle">Visitante</text>
            <text x="58" y="179" className="mono mut" textAnchor="middle">HTTPS</text>
            <rect x="146" y="125" width="140" height="80" rx="4" className="ln brandfill" />
            <text x="216" y="150" textAnchor="middle">Worker</text>
            <text x="216" y="170" className="mono mut" textAnchor="middle">/api/* → API</text>
            <text x="216" y="188" className="mono mut" textAnchor="middle">resto → WEB</text>
            <rect x="330" y="40" width="172" height="70" rx="4" className="ln fillsoft" />
            <text x="416" y="66" textAnchor="middle">Web · Next.js :8080</text>
            <text x="416" y="86" className="mut" textAnchor="middle">DO · sem internet</text>
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
            <text x="324" y="316" className="mut" textAnchor="middle">um Worker por ambiente: recados-dev e recados-production</text>
          </svg>
        </Diagram>
        <p>Dev e produção são <b>iguais</b>: mesma imagem, mesma configuração, mesma segurança. A tabela mostra tudo o que muda entre eles, e é de propósito que ela é curta (a <a href="#envs">seção 5</a> explica por quê).</p>
        <Table
          head={["", "dev", "produção"]}
          rows={[
            ["Worker", <code>recados-dev</code>, <code>recados-production</code>],
            ["Domínio", <code>dev.example.com.br</code>, <code>example.com.br</code>],
            ["Banco", <>Projeto Neon <code>recados-dev</code></>, <>Projeto Neon <code>recados-prod</code></>],
            ["Dados", "Cópia anonimizada de produção (D+1 ou D+7) ou dados gerados", "Reais"],
            ["Credenciais", "Próprias de dev, nunca as de produção", "Próprias de produção"],
            ["Quando entra no ar", "A cada push na main", "Depois que alguém aprova no GitHub"],
          ]}
        />
        <h3>O roteiro</h3>
        <ol className="ds-steps">
          <li><b>Construir (seções 1 a 5).</b> As duas imagens, o Worker que as liga, as variáveis de ambiente e a configuração com dois ambientes iguais.</li>
          <li><b>Banco e máquina local (6 e 7).</b> Projetos no Neon, strings de conexão e o app inteiro rodando no seu Docker.</li>
          <li><b>Operar (8 a 11).</b> Deploy com aprovação, backups, a cópia de produção para dev e como tirar os dados do Neon.</li>
          <li><b>Conformidade (12 e 13).</b> O que a LGPD exige deste desenho, e como conferir que tudo funciona.</li>
        </ol>
        <Callout tone="use" icon="check"><b>Notas vizinhas.</b> O mesmo app de dois containers na AWS está na <a href="/notas/front-back-ecs-cloudflare/">nota de front e back no ECS</a>. Postgres em si na <a href="/notas/postgres-for-devs/">nota de Postgres</a>, o RDS na <a href="/notas/rds/">nota de RDS</a> e ferramentas de migration na <a href="/notas/db-migrations/">nota de migrations</a>.</Callout>
      </Section>

      <Section id="before" title={"1. Antes de começar"}>
        <ul className="ds-list">
          <li><em>Conta Cloudflare no plano Workers Paid</em> (US$ 5 por mês). O preço dos Containers é descrito como uso incluído nesse plano, mais o excedente.</li>
          <li><em>Um domínio ativo na Cloudflare.</em> O <i>custom domain</i> do Worker exige que a zona esteja na conta; a Cloudflare cria o registro DNS e o certificado sozinha.</li>
          <li><em>Docker na sua máquina e no CI.</em> O <code>wrangler deploy</code> constrói as imagens localmente e as envia para o registro da Cloudflare. As imagens precisam ser <code>linux/amd64</code>.</li>
          <li><em>Conta no Neon</em>, Node 22 e Next.js 16 (que pede Node 20.9 ou mais novo).</li>
        </ul>
        <h3>O que é o Neon hoje</h3>
        <p>O Neon é da Databricks. O site se apresenta como “um backend completo da Databricks”, e o banco agora se chama <b>Lakebase Postgres</b>. Para esta nota nada muda: é Postgres de verdade, acessado por uma connection string comum. A diferença para um Postgres tradicional é a arquitetura: computação e armazenamento separados.</p>
        <p>Duas consequências práticas dessa separação aparecem ao longo da nota:</p>
        <ul className="ds-list">
          <li><em>Branches.</em> Uma branch é um clone <i>copy-on-write</i> do banco, criado na hora, inclusive de um ponto no passado. É o que torna o D+1/D+7 da <a href="#refresh">seção 10</a> barato.</li>
          <li><em>Scale to zero.</em> Sem conexões por 5 minutos, a computação desliga, e a primeira consulta depois disso espera algumas centenas de milissegundos. No plano Free isso não se desliga; nos pagos, sim.</li>
        </ul>
        <Callout tone="info" icon="alert"><b>Por que o front é um container?</b> Um site Next.js só estático caberia num CDN. Com SSR, cada página é montada por um servidor Node no momento do pedido, e esse servidor precisa rodar em algum lugar. O Next gera esse servidor pronto (o modo <code>standalone</code>), e a imagem Docker leva ele para o Cloudflare Containers do mesmo jeito que levaria para qualquer outra nuvem.</Callout>
      </Section>

      <Section id="images" title={"2. As duas imagens"}>
        <p>Um repositório, duas pastas com Dockerfile, e o Worker na raiz:</p>
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

        <h3>2.1 A API</h3>
        <p>Node com uma única dependência, o driver <code>pg</code>. Toda rota pública começa com <code>/api</code>, porque o Worker repassa o caminho inteiro. A rota <code>/health</code> não toca no banco: ela só diz que o processo está de pé, e é o que o Worker consulta antes de mandar tráfego.</p>
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
        <p>A tabela e o script que aplica as migrations. O script roda no CI com a URL <b>direta</b> do banco, nunca dentro do container (veja a <a href="#neon">seção 6</a> sobre direta e pooled).</p>
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
        <Callout tone="info" icon="alert"><b>Um script de 30 linhas no lugar de uma ferramenta.</b> Ele aplica cada arquivo uma vez, em ordem, dentro de uma transação. Para um projeto real, use uma ferramenta de migration (Prisma, Flyway, Alembic…), como mostra a <a href="/notas/db-migrations/">nota de migrations</a>. O princípio é o mesmo.</Callout>

        <h3>2.2 O front em Next.js</h3>
        <p>Com <code>output: "standalone"</code>, o <code>next build</code> gera em <code>.next/standalone</code> um <code>server.js</code> mínimo, com só os pedaços de <code>node_modules</code> que o app usa. A imagem final roda esse arquivo, sem <code>npm install</code>.</p>
        <CodeBlock code={`// web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // .next/standalone/server.js runs without node_modules
  poweredByHeader: false,
};

export default nextConfig;`} />
        <p>O Dockerfile segue o exemplo oficial <code>with-docker</code> do Next: um estágio instala, outro constrói, o último só copia o resultado e roda como usuário sem privilégio. O servidor do standalone lê <code>PORT</code> e <code>HOSTNAME</code> do ambiente; <code>0.0.0.0</code> faz ele aceitar conexões de fora do próprio container.</p>
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
        <p>O ponto que mais importa no Next é <b>quando</b> ele lê as variáveis. Tudo que começa com <code>NEXT_PUBLIC_</code> é copiado para o JavaScript do navegador no <code>next build</code> e fica congelado na imagem. A documentação avisa: uma imagem promovida de dev para produção leva os valores de dev. Por isso este front não usa nenhuma <code>NEXT_PUBLIC_</code>. As variáveis são lidas no servidor, a cada pedido, num único arquivo:</p>
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
        <p>A página chama <code>connection()</code> antes de ler qualquer coisa. Isso diz ao Next para esperar um pedido de verdade: sem essa linha, ele poderia pré-renderizar a página no build, com as variáveis da máquina de build.</p>
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
          <li><em>Dois caminhos até a API.</em> No servidor (SSR), o Next chama <code>http://api.recados</code>, um host que só existe dentro da Cloudflare (<a href="#worker">seção 3</a>). No navegador, o formulário chama <code>/api/recados</code>, um caminho <b>relativo</b> que o Worker manda para a API. Nenhum dos dois depende do domínio, então a mesma imagem serve dev e produção.</li>
          <li><em>Cache por instância.</em> O cache do Next fica no disco do container, que é efêmero e separado em cada instância do pool. Esta página não usa cache (<code>no-store</code>). Se o seu app usar, a documentação do Next indica um <code>cacheHandler</code> compartilhado.</li>
          <li><em>Desligamento.</em> Ao receber <code>SIGTERM</code>, o servidor do Next termina os pedidos em andamento antes de sair, então não é preciso código próprio, ao contrário da API.</li>
        </ul>
        <p>O formulário avisa, ao lado do botão, quais dados são guardados, por quanto tempo, onde está a política de privacidade e quem é o encarregado. Isso é o princípio da transparência da LGPD aplicado na tela, e volta na <a href="#lgpd">seção 12</a>. Os dois valores vêm de variáveis de ambiente, porque mudam por decisão jurídica, não por código.</p>
      </Section>

      <Section id="worker" title={"3. O Worker e os containers"}>
        <p>Cada container pertence a uma <b>classe de Durable Object</b>. Um Durable Object é um objeto com nome, que vive num único lugar da rede da Cloudflare. Quando ele recebe o primeiro pedido, liga o seu container com <code>ctx.container.start()</code>. Daí em diante, repassa os pedidos pela porta do container com <code>getTcpPort(8080).fetch()</code>.</p>
        <p>Um detalhe importa: <code>start()</code> volta antes de o processo estar pronto. A documentação diz que <code>running</code> verdadeiro não garante que o container já aceita pedidos. Por isso o código consulta <code>/health</code> até receber 200, como no exemplo oficial.</p>
        <p>O outro detalhe é como o Next chega à API durante o SSR <b>sem acesso à internet</b>. O container web registra um <i>intercept</i>: todo pedido HTTP que ele fizer para <code>api.recados</code> é atendido por código do Worker (a classe <code>ApiGateway</code>), que o entrega ao pool da API. Esse host não existe no DNS público; a rede do container só responde pelos hosts interceptados.</p>
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
          <li><em>Um pool fixo de instâncias com nome.</em> Cada nome (<code>pool-0</code>, <code>pool-1</code>…) é um Durable Object com o seu container. O Worker sorteia um nome por pedido, que é o padrão de balanceamento da documentação. O tamanho do pool vem de <code>POOL_SIZE</code>, igual nos dois ambientes.</li>
          <li><em>Internet só para quem precisa.</em> O Next sobe com <code>enableInternet: false</code>: só sai pelo intercept, e só para a API. A API precisa de <code>true</code> para chegar ao Neon. Um front comprometido sem saída para a internet não consegue mandar dados para fora.</li>
          <li><em>O intercept é registrado antes de cada <code>start()</code>.</em> A documentação diz que ele dura até o container parar. Como o container para por inatividade, o registro fica no <code>boot()</code>, que roda em todo início. O intercept HTTP não pega HTTPS, e não precisa: o tráfego não sai da Cloudflare.</li>
          <li><em>Desligar por inatividade.</em> Sem pedidos por 10 minutos, o container para (o máximo é 6 horas). O disco é efêmero: ao religar, ele volta limpo, igual à imagem. Nada que importe pode ficar no disco do container; o que importa vai para o banco.</li>
          <li><em>Partida a frio.</em> A documentação fala em 1 a 3 segundos, dependendo do tamanho da imagem. Imagens Alpine e o modo <code>standalone</code> do Next ajudam.</li>
        </ul>
        <Table
          head={["Tamanho", "vCPU", "Memória", "Disco"]}
          rows={[
            [<code>lite</code>, "1/16", "256 MiB", "2 GB"],
            [<code>basic</code>, "1/4", "1 GiB", "4 GB"],
            [<code>standard-1</code>, "1/2", "4 GiB", "8 GB"],
            [<code>standard-2</code>, "1", "6 GiB", "12 GB"],
            [<code>standard-3</code>, "2", "8 GiB", "16 GB"],
            [<code>standard-4</code>, "4", "12 GiB", "20 GB"],
          ]}
        />
        <p>O tamanho é escolhido no <code>start()</code> (<code>instance</code>), não no wrangler. Os dois containers usam <code>basic</code>: o SSR do Next não cabe com folga em 256 MiB. A cobrança é por cada 10 ms de container ligado: memória e disco pelo tamanho reservado, CPU pelo uso real. Um container desligado por inatividade não cobra.</p>
      </Section>

      <Section id="vars" title={"4. Variáveis de ambiente"}>
        <p>Um projeto real tem dezenas de variáveis: URLs, chaves de serviços, ajustes de log, textos jurídicos. Neste desenho elas são de três tipos, e cada tipo tem um lugar diferente. A regra que organiza tudo: <b>a imagem não carrega nenhum valor que mude entre dev e produção</b>. Os valores entram quando o container liga.</p>
        <Table
          head={["Tipo", "Onde fica", "Quando entra", "Exemplos"]}
          rows={[
            ["De build", <><code>build_vars</code> na imagem, no wrangler (vira <code>ARG</code> no Dockerfile)</>, <code>wrangler deploy</code>, "Versão do app, commit. Nunca segredo, nunca valor que muda por ambiente"],
            ["Comum, de execução", <><code>vars</code> de cada ambiente no <code>wrangler.jsonc</code>, no git</>, <><code>start(&#123; env &#125;)</code></>, <code>APP_ENV, LOG_LEVEL, API_INTERNAL_URL, RETENCAO_DIAS</code>],
            ["Segredo", <><i>Secrets</i> do Worker, cifrados na Cloudflare, fora do git</>, <><code>start(&#123; env &#125;)</code></>, <><code>DATABASE_URL</code>, chaves de pagamento, senha de SMTP</>],
          ]}
        />
        <p>Um container não lê os <i>vars</i> nem os <i>secrets</i> do Worker sozinho. Eles só chegam ao processo se o Durable Object os passar no <code>env</code> do <code>start()</code>. Isso é bom: cada container recebe só a sua lista (<code>WEB_ENV</code> e <code>API_ENV</code> na <a href="#worker">seção 3</a>), e o front nunca vê a senha do banco.</p>

        <h3>4.1 Comuns: vars por ambiente</h3>
        <p>Ficam no <code>wrangler.jsonc</code>, dentro de cada ambiente, porque <code>vars</code> não é herdado do topo do arquivo (<a href="#envs">seção 5</a>). A documentação lembra que <code>vars</code> não é cifrado: nada sensível vai ali.</p>

        <h3>4.2 Segredos: declarados, cadastrados em lote</h3>
        <p>Os <b>nomes</b> dos segredos ficam no git, em <code>secrets.required</code>. Com isso, o <code>wrangler deploy</code> falha se faltar algum naquele ambiente, e o <code>wrangler types</code> gera o tipo <code>Env</code> com eles. Os <b>valores</b> nunca vão para o git:</p>
        <CodeBlock code={`// in wrangler.jsonc, inside each environment (secrets is not inherited either).
// This app needs only DATABASE_URL; a real project's list grows like this:
"secrets": { "required": ["DATABASE_URL", "PAGAMENTOS_API_KEY", "SMTP_PASSWORD"] }`} />
        <p>Para cadastrar vários de uma vez, o <code>wrangler secret bulk</code> lê um arquivo JSON ou <code>.env</code> (até 100 segredos por comando). Gere o arquivo a partir do cofre de senhas da equipe, use e apague:</p>
        <CodeBlock code={`umask 077                                   # the file is readable only by you
cat > secrets.production.env <<'EOT'        # values from the password vault, never typed into git
DATABASE_URL="postgresql://app:...@ep-xxx-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require"
PAGAMENTOS_API_KEY="..."
SMTP_PASSWORD="..."
EOT
npx wrangler secret bulk secrets.production.env --env production
shred -u secrets.production.env

npx wrangler secret list --env production   # names only; values cannot be read back`} />
        <p>A fonte da verdade dos segredos de execução é a Cloudflare: o deploy não precisa deles, só confere que existem. O GitHub guarda apenas o que o CI usa (token da Cloudflare, URL direta para migrations). Uma cópia a menos é um lugar a menos para vazar.</p>

        <h3>4.3 Adicionar uma variável nova</h3>
        <ol className="ds-steps">
          <li><b>Comum:</b> a chave em <code>vars</code> nos <b>dois</b> ambientes. <b>Segredo:</b> o nome em <code>secrets.required</code> nos dois, e o valor com <code>wrangler secret put NOME --env dev</code> e <code>--env production</code>.</li>
          <li>O nome na lista do container que usa (<code>WEB_ENV</code> ou <code>API_ENV</code>), e <code>npx wrangler types</code> para atualizar o <code>Env</code>.</li>
          <li>A leitura no código: no Next, só em <code>lib/config.ts</code>; na API, num ponto só, no início. Variável que falta derruba o início, não o pedido número mil.</li>
          <li>Localmente, o valor em <code>.dev.vars.dev</code> (<a href="#local">seção 7</a>).</li>
        </ol>
        <ul className="ds-list">
          <li><em>Trocar um valor exige reiniciar.</em> O container lê o <code>env</code> quando liga. Depois de um <code>secret put</code>, quem já está rodando continua com o valor antigo até parar por inatividade ou até o próximo deploy.</li>
          <li><em>Variável e segredo com o mesmo nome</em> não podem coexistir na mesma versão do Worker.</li>
          <li><em>Segredos de build</em> (um token para baixar pacote privado, por exemplo) não devem ir em <code>build_vars</code>, que acabam no histórico da imagem. A documentação manda construir e enviar a imagem à mão, com <code>wrangler containers push</code>.</li>
          <li><em>Segredos da conta inteira.</em> O Secrets Store da Cloudflare (em beta aberto) guarda um segredo uma vez para vários Workers, lido com <code>await env.NOME.get()</code>. Útil quando muitos serviços usam a mesma chave; para este app, os <i>secrets</i> por Worker bastam.</li>
        </ul>
      </Section>

      <Section id="envs" title={"5. Dev igual a produção"}>
        <p>Dev existe para pegar o problema antes de produção. Se dev for mais frouxo, ele deixa de pegar justamente os problemas de segurança e de configuração: o segredo que falta, o container sem internet que tenta sair, a permissão de banco apertada demais. Por isso aqui dev é uma <b>cópia</b> de produção, com a mesma segurança. Só mudam quatro coisas: nome, domínio, dados e credenciais.</p>
        <p>No wrangler, cada ambiente vira um <b>Worker separado</b>, chamado <code>&lt;nome&gt;-&lt;ambiente&gt;</code>: aqui, <code>recados-dev</code> e <code>recados-production</code>. Eles não compartilham nada: nem containers, nem Durable Objects, nem segredos.</p>
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
        <p>A pegadinha é a herança. Algumas chaves passam do topo para os ambientes (<code>name</code>, <code>main</code>, <code>compatibility_date</code>, <code>exports</code>, <code>routes</code>). Outras não: <code>vars</code>, <code>secrets</code>, <code>durable_objects</code>, <code>containers</code> e <code>hyperdrive</code> precisam ser repetidas em <b>cada</b> ambiente. É fácil um ambiente ficar para trás. Uma checagem simples no CI evita isso: compare os blocos dos dois ambientes, ignorando as chaves que podem mudar.</p>
        <CodeBlock code={`npx wrangler types --env dev                       # generates the Env type (WEB, API, vars and secrets)
npx wrangler deploy --dry-run --env production     # validates the config and builds both images`} />
        <Table
          head={["Controle", "dev e produção"]}
          rows={[
            ["Imagem", "O mesmo Dockerfile, construído do mesmo commit"],
            ["Containers", <>Mesmo tamanho (<code>basic</code>), mesmo pool (3), mesmo <code>enableInternet</code> e mesmo intercept</>],
            ["Segredos", <>Mesma lista em <code>secrets.required</code>; valores diferentes, nunca compartilhados</>],
            ["Banco", <>Projetos Neon no mesmo plano e região, branch <code>main</code> protegida, papel próprio do app, TLS</>],
            ["Acesso", "Tokens da Cloudflare e chaves do Neon separados por ambiente, com o mínimo de permissão"],
            ["Deploy", <>Só a partir da <code>main</code>, que só recebe código revisado em PR; produção ainda pede aprovação</>],
            ["Logs e retenção", "Mesma observabilidade, mesma retenção de 90 dias"],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>A consequência: credenciais de dev valem como as de produção.</b> Se dev tem a mesma segurança, a senha do banco de dev não circula em notebook, chat ou <code>.env</code> compartilhado. Quem desenvolve usa um Postgres local (<a href="#local">seção 7</a>), e só o CI e a Cloudflare conhecem as credenciais de dev. Dados anonimizados reduzem o dano de um vazamento, mas não são desculpa para afrouxar o resto.</Callout>
        <Callout tone="info" icon="alert"><b>A política de agendamento.</b> A chave <code>"scheduling_policy": "durable_object"</code> é a que a documentação usa hoje: cada container pertence a um Durable Object. A política antiga (<code>default</code>, ou sem a chave) está marcada como obsoleta, e a nova ainda é beta. Na nova, opções como <code>instance_type</code>, <code>max_instances</code> e restrições de região não são aceitas no wrangler, e as variáveis de build se chamam <code>build_vars</code> (na antiga, <code>image_vars</code>). A falta de restrição de região pesa na LGPD (<a href="#lgpd">seção 12</a>).</Callout>
      </Section>

      <Section id="neon" title={"6. Neon: projetos e conexões"}>
        <h3>6.1 Um projeto por ambiente, em São Paulo</h3>
        <p>Crie dois projetos no console do Neon, no mesmo plano: <code>recados-prod</code> e <code>recados-dev</code>, os dois na região <b>AWS South America (São Paulo)</b>, id <code>aws-sa-east-1</code>. A região é escolhida na criação do projeto e não muda depois; trocar exige um projeto novo e migrar os dados.</p>
        <p>Por que dois projetos, se o Neon tem branches? Branch é ótima para cópias rápidas, mas mora no mesmo projeto: mesma chave de API, mesmas pessoas com acesso ao console. Projetos separados deixam produção fechada para quem só trabalha em dev.</p>
        <ul className="ds-list">
          <li><em>Nos dois projetos,</em> marque a branch <code>main</code> como <b>protegida</b> (planos pagos). Branch protegida não pode ser apagada nem resetada. Em dev também: um <code>reset</code> acidental em dev é o ensaio de um em produção.</li>
          <li><em>Crie um banco <code>recados</code></em> em cada projeto e um papel (role) só para o app, com as mesmas permissões nos dois, em vez de usar o dono do banco.</li>
          <li><em>A única diferença é o conteúdo.</em> Dev recebe as mesmas migrations e, uma vez por semana ou por dia, uma cópia anonimizada de produção (<a href="#refresh">seção 10</a>).</li>
        </ul>

        <Callout tone="warn" icon="alert"><b>A distância entre a API e o banco.</b> O container roda onde o seu Durable Object estiver, e a documentação avisa que hoje Durable Objects não nascem na América do Sul: quem pede América do Sul recebe o leste da América do Norte. Ou seja, a API roda lá, e o banco está em São Paulo. Cada consulta atravessa essa distância, ida e volta. Faça poucas consultas por pedido (uma, de preferência), sem laços que consultam linha a linha. Pôr o Neon em <code>aws-us-east-1</code> encurtaria o caminho, mas tiraria os dados em repouso do Brasil. É uma troca entre latência e localização dos dados (<a href="#lgpd">seção 12</a>).</Callout>

        <h3>6.2 Duas connection strings: pooled e direta</h3>
        <CodeBlock code={`# pooled (PgBouncer, transaction mode): the app inside the container
postgresql://app:<password>@ep-xxx-123456-pooler.sa-east-1.aws.neon.tech/recados?sslmode=require

# direct: migrations, pg_dump, pg_restore, admin work
postgresql://app:<password>@ep-xxx-123456.sa-east-1.aws.neon.tech/recados?sslmode=require`} />
        <p>A única diferença é o <code>-pooler</code> no host. A versão pooled passa por um PgBouncer do Neon em modo transação, que junta milhares de conexões de cliente em poucas conexões reais. Ela combina com containers que ligam e desligam e com várias instâncias abrindo conexões ao mesmo tempo.</p>
        <p>O modo transação tem um custo: cada transação pode cair numa conexão diferente. Por isso não funcionam, pela conexão pooled, coisas que dependem da sessão: <code>SET</code> fora de uma transação, <code>LISTEN</code>/<code>NOTIFY</code>, tabelas temporárias, <code>PREPARE</code> em SQL e <i>advisory locks</i> de sessão. Migrations e <code>pg_dump</code> usam a <b>direta</b>.</p>
        <Callout tone="info" icon="alert"><b>E o Hyperdrive?</b> O Hyperdrive é o pool de conexões da própria Cloudflare, e funciona com o Neon. Mas ele é um <i>binding</i> do Worker; a documentação não mostra uso de dentro de um container. Como a nossa API roda no container, ela vai direto ao pooler do Neon. Se um dia a API virar código de Worker, o Hyperdrive passa a fazer sentido. Nesse caso, o guia do Neon manda desligar o pooling no Neon e usar a URL direta.</Callout>
      </Section>

      <Section id="local" title={"7. Rodar na sua máquina"}>
        <p>O <code>wrangler dev</code> roda o Worker e os dois containers no seu Docker, com o mesmo roteamento da nuvem e com o intercept de saída (a documentação diz que ele imita o comportamento de produção). Os <code>vars</code> vêm do <code>wrangler.jsonc</code>; os segredos, de um arquivo <code>.dev.vars.&lt;ambiente&gt;</code> fora do git.</p>
        <p>Como dev tem a segurança de produção (<a href="#envs">seção 5</a>), esse arquivo aponta para um <b>Postgres local</b>, nunca para o Neon de dev ou de produção:</p>
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
          <li><em>Um arquivo por ambiente.</em> Se <code>.dev.vars.dev</code> existe, o wrangler carrega só ele, e ignora o <code>.dev.vars</code>. Use um ou outro estilo (<code>.dev.vars</code> ou <code>.env</code>), não os dois.</li>
          <li><em>O endereço do Postgres.</em> O container roda no Docker, então <code>localhost</code> dentro dele é o próprio container. O host da sua máquina aparece como <code>host.docker.internal</code> no Docker Desktop; no Linux, use o IP da ponte do Docker (em geral <code>172.17.0.1</code>).</li>
          <li><em>Para mexer só no front,</em> <code>npm run dev --prefix web</code> com as variáveis do Next num <code>web/.env.local</code> é mais rápido. O <code>wrangler dev</code> é para conferir o conjunto, com intercept e Worker.</li>
        </ul>
      </Section>

      <Section id="deploy" title={"8. Deploy com aprovação"}>
        <p>O fluxo: cada push na <code>main</code> aplica as migrations e faz deploy em dev. O job de produção espera alguém aprovar. A aprovação é uma regra do <i>environment</i> <code>production</code> no GitHub (<i>Required reviewers</i>). Os dois environments, <code>dev</code> e <code>production</code>, aceitam deploy só da <code>main</code> (<i>Deployment branches</i>), e cada um guarda os próprios segredos.</p>
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
          <li><em>Token da Cloudflare.</em> Crie um API token com permissão de editar Workers e guarde como <code>CLOUDFLARE_API_TOKEN</code>, junto com o <code>CLOUDFLARE_ACCOUNT_ID</code>. Use tokens diferentes para dev e produção, cada um com o mínimo de permissão.</li>
          <li><em>Migration antes do deploy.</em> Ela roda primeiro, com o código antigo ainda no ar. Por isso cada migration precisa funcionar com o código antigo e com o novo (adicionar coluna, sim; renomear de uma vez, não).</li>
          <li><em>O deploy não é atômico.</em> Segundo a documentação, o Worker novo entra no ar primeiro, e os containers são atualizados aos poucos (<i>rollout</i> gradual). Por alguns minutos, um front novo pode falar com uma API antiga. Mantenha a API compatível com a versão anterior do front.</li>
          <li><em>Primeiro deploy.</em> Depois do primeiro <code>wrangler deploy</code>, a documentação pede para esperar alguns minutos até os containers ficarem prontos. Acompanhe com <code>npx wrangler containers list</code>.</li>
        </ul>
      </Section>

      <Section id="backups" title={"9. Backups"}>
        <p>O Neon oferece três camadas. Elas se complementam: cada uma cobre uma falha que a anterior não cobre.</p>
        <Table
          head={["Camada", "O que é", "Quanto tempo", "Cobre"]}
          rows={[
            ["Janela de histórico (instant restore)", "Volta a branch para qualquer segundo dentro da janela", "Padrão de 1 dia nos planos pagos; até 7 dias no Launch e 30 no Scale; 6 horas no Free", <>O <code>DELETE</code> sem <code>WHERE</code> de agora há pouco</>],
            ["Snapshots agendados", "Uma foto diária, semanal ou mensal da branch raiz", "Retenção de 1 hora a 35 dias (planos pagos)", "Erros que só alguém percebe dias depois"],
            [<>Exportação com <code>pg_dump</code></>, "Um arquivo seu, fora do Neon", "O quanto você guardar", "Perder a conta, sair do Neon, auditoria"],
          ]}
        />

        <h3>9.1 Janela de histórico e snapshots</h3>
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
        <p>Para restaurar um snapshot, o Neon cria uma branch nova com os dados. Você confere e só então “finaliza”, trocando a branch atual pela restaurada. A connection string continua a mesma.</p>
        <CodeBlock code={`npx neon@9 snapshots list --project-id $PROJECT
npx neon@9 snapshots restore <snapshot-id> --project-id $PROJECT --target-branch main --name conferir
npx neon@9 connection-string conferir --project-id $PROJECT     # look at the data first
npx neon@9 snapshots finalize <id of the "conferir" branch> --project-id $PROJECT`} />
        <p>A janela também se ajusta no console, em <i>Settings → Postgres</i>. Ela é cobrada como armazenamento de histórico: quanto maior, mais caro.</p>

        <h3>9.2 Exportação noturna</h3>
        <p>O <code>pg_dump</code> precisa da URL <b>direta</b>; a documentação do Neon pede para evitar a pooled. A versão do cliente deve acompanhar a do servidor, e o jeito mais simples de garantir isso é rodar o <code>pg_dump</code> da imagem oficial do Postgres da mesma versão. O arquivo é cifrado antes de sair do runner.</p>
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
        <p>Para restaurar o arquivo num banco vazio, ou para testar o backup (um backup que nunca foi restaurado é só uma esperança):</p>
        <CodeBlock code={`gpg -d recados-2026-11-23.dump.gpg > recados.dump
docker run --rm -e DST -v "$PWD:/in" -w /in postgres:17-alpine \\
  pg_restore --no-owner --no-acl -d "$DST" recados.dump
psql "$DST" -c "select count(*), max(criado_em) from recados"   # does it look like production?`} />
        <Callout tone="info" icon="alert"><b>A retenção vem antes do dump.</b> O primeiro job apaga os recados com mais de 90 dias, o prazo prometido na tela, nos dois ambientes. Assim, o que já venceu não entra no arquivo da noite. Os backups guardam o que já foi apagado por um tempo. Isso tem consequência na LGPD (<a href="#lgpd">seção 12</a>).</Callout>
      </Section>

      <Section id="refresh" title={"10. Prod → dev em D+1 ou D+7"}>
        <p>Às vezes dev precisa de dados com a cara de produção: volume, distribuição, casos estranhos. A ideia é dar a dev produção <b>como ela era há N dias</b>: D+1 (ontem) ou D+7 (uma semana atrás). Sempre anonimizada.</p>
        <p>O atraso tem duas vantagens. Dev nunca tem os dados de hoje, o que reduz a exposição. E um bug relatado na semana passada pode ser reproduzido com os dados daquele dia.</p>
        <ol className="ds-steps">
          <li><b>Branch no passado.</b> Uma branch temporária de produção, criada a partir de um timestamp (<code>--parent &lt;data&gt;</code>), com validade de 3 horas. É instantânea e não pesa na <code>main</code>.</li>
          <li><b>Anonimizar na cópia.</b> O script de mascaramento roda na branch temporária, que só o CI acessa. A <code>main</code> não muda: escrever numa branch não afeta a mãe.</li>
          <li><b>Exportar e substituir dev.</b> <code>pg_dump</code> da cópia já mascarada, <code>pg_restore --clean</code> no projeto <code>recados-dev</code>. Dado real nunca chega ao projeto de dev.</li>
          <li><b>Apagar tudo,</b> mesmo se um passo falhar: a branch temporária e o arquivo.</li>
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
          <li><em>O atraso cabe na janela de histórico?</em> A branch só pode nascer de um instante dentro da janela. O padrão de 1 dia não basta nem para D+1 (o instante cai exatamente na borda). Use 2 dias para D+1 e 8 dias para D+7, o que exige o plano Scale, já que o Launch para em 7. No Launch, a alternativa é D+6, ou restaurar um snapshot agendado.</li>
          <li><em>Por que não <code>neon branches reset</code>?</em> O reset só leva a branch ao estado <b>atual</b> da mãe, sem voltar no tempo. Para um instante passado, a ferramenta é o <code>restore</code> (<code>main@&lt;timestamp&gt;</code>), mas ele trabalha dentro do mesmo projeto, e aqui dev é outro projeto. Daí o <code>pg_dump</code>.</li>
          <li><em>A trava no fim do SQL.</em> Se alguém criar uma coluna nova com dado pessoal e esquecer de mascarar, o ideal é o job falhar, não copiar. O bloco <code>do $$ … raise exception</code> faz isso para os campos conhecidos. Revise o script a cada migration que adicionar dado pessoal.</li>
          <li><em>A extensão <code>anon</code>.</em> O Neon também documenta o PostgreSQL Anonymizer (<code>anon</code>), com regras de mascaramento declaradas por coluna e <i>branches anonimizadas</i> pelo console. Hoje ela é experimental no Neon. O SQL simples acima não depende dela e roda em qualquer Postgres.</li>
          <li><em>Branch só com o schema.</em> Se dev não precisa de volume, o Neon cria branches <code>--schema-only</code> (beta): a estrutura sem nenhuma linha. Junto com um seed gerado, é a opção que não copia dado pessoal nenhum.</li>
        </ul>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, o que foi testado:</b> o caminho anonimizar → <code>pg_dump</code> → <code>pg_restore --clean</code> rodou aqui com Postgres 17 em Docker, usando um banco copiado por <code>template</code> no lugar da branch do Neon. Dev ficou só com <code>pessoa-1</code> e <code>pessoa-2</code>, produção ficou intacta, e a trava abortou o script (código de saída 3) quando uma linha escapou do mascaramento. Os comandos <code>neon</code> seguem a ajuda da CLI 9.9.3 e a documentação, mas não rodaram contra uma conta.</Callout>
      </Section>

      <Section id="export" title={"11. Tirar os dados do Neon"}>
        <p>Cedo ou tarde alguém pede os dados: o cliente, no fim do contrato ou numa auditoria, ou a própria equipe, que decidiu ir para o AWS RDS. A documentação do Neon não tem botão nem API de exportação de dados. A API cuida de projetos, branches e papéis. O que ela documenta são as ferramentas do próprio Postgres, e isso é uma boa notícia: nada no formato é proprietário.</p>
        <Table
          head={["Caminho", "Serve para", "Parada de escrita"]}
          rows={[
            [<><code>pg_dump</code> / <code>pg_restore</code></>, "Entregar o banco inteiro; migrar um banco pequeno ou médio", "Durante todo o dump e restore"],
            [<><code>psql \copy</code> para CSV</>, "Entregar tabelas ou um recorte em planilha; pedido de um titular", "Nenhuma"],
            ["Replicação lógica, Neon como origem", "Migrar para outro Postgres (RDS) com poucos minutos de parada", "Só na virada"],
          ]}
        />

        <h3>11.1 O cliente pediu os dados</h3>
        <p>Para o banco inteiro, o mesmo <code>pg_dump</code> da <a href="#backups">seção 9</a>, pela URL direta. Escolha o formato pelo que o cliente vai fazer com ele: <code>-Fc</code> só abre com <code>pg_restore</code>; SQL puro (sem <code>-F</code>) abre com <code>psql</code> e é legível num editor. Para quem não tem Postgres, CSV por tabela com o <code>\copy</code> do <code>psql</code>, que grava o arquivo do lado do cliente e não precisa de superusuário.</p>
        <CodeBlock code={`SRC="<direct URL of recados-prod>"   # never the -pooler host for pg_dump

# the whole database, as plain SQL anyone can read or replay with psql
docker run --rm -e SRC -v "$PWD:/out" -w /out postgres:17-alpine \\
  pg_dump --no-owner --no-acl -d "$SRC" -f recados.sql

# one table as CSV with a header line
psql "$SRC" -c "\\copy (select id, nome, texto, criado_em from recados order by id) to 'recados.csv' with (format csv, header)"

# then: encrypt (gpg, section 9), send by a secure channel, record who received what and when`} />
        <p>Se quem pede é um <b>titular</b> (a pessoa a quem os dados se referem), a LGPD dá o direito de acesso e de portabilidade (art. 18, II e V). A resposta completa sai em até <b>15 dias</b> do pedido (art. 19, II). Exporte só as linhas dela, nunca o banco:</p>
        <CodeBlock code={`psql "$SRC" -c "\\copy (select nome, texto, criado_em from recados where nome = 'Bia' order by criado_em) to 'titular.csv' with (format csv, header)"`} />
        <Callout tone="info" icon="alert"><b>Identificar a pessoa é o difícil.</b> Este app só guarda o nome, e duas pessoas podem ter o mesmo. Num sistema real, a busca é por um identificador confirmado (conta logada, e-mail verificado). Sem isso, você corre o risco de entregar dados de outra pessoa, o que já é um incidente.</Callout>

        <h3>11.2 Mudar para o AWS RDS com dump e restore</h3>
        <p>O caminho mais simples, quando dá para parar as escritas por um tempo. Crie a instância RDS com a <b>mesma versão principal</b> do Postgres, de preferência em <code>sa-east-1</code>, a mesma região AWS onde o Neon está. Depois:</p>
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
        <p>O guia de importação da AWS sugere, só durante a carga, ajustes que a aceleram (backups automáticos e Multi-AZ desligados, mais <code>maintenance_work_mem</code>), e lembra de desfazê-los depois. O <code>pg_dumpall</code> não serve: nem o Neon nem o RDS dão o superusuário que ele exige.</p>

        <h3>11.3 Mudar com replicação lógica</h3>
        <p>Quando o banco é grande ou a parada precisa ser de minutos, o RDS vira <b>assinante</b> do Neon: copia tudo uma vez e depois recebe cada mudança, até a virada. O Neon documenta esse sentido (Neon como origem, outro Postgres como destino). Antes de começar, três avisos da documentação:</p>
        <ul className="ds-list">
          <li><em>Ligar é para sempre.</em> Ativar a replicação lógica muda o <code>wal_level</code> do projeto para <code>logical</code> e, segundo o Neon, não dá para voltar. A mudança reinicia todas as computações do projeto e derruba as conexões abertas.</li>
          <li><em>Conexão direta.</em> A replicação exige conexão persistente e não funciona pelo pooler. Enquanto o assinante estiver conectado, a computação do Neon não desliga (custo).</li>
          <li><em>O que não vai junto.</em> Estrutura (DDL) e valores de sequência não são replicados. Congele as migrations durante a mudança, e acerte as sequências na virada.</li>
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
        <p>No RDS, quem cria a assinatura precisa dos privilégios do papel <code>pg_create_subscription</code> e de <code>CREATE</code> no banco, como em qualquer Postgres. Na virada, a parada dura o tempo de os últimos dados chegarem:</p>
        <ol className="ds-steps">
          <li><b>Congelar as escritas no Neon</b> (o mesmo <code>revoke</code> da seção anterior) e esperar o assinante alcançar: as contagens dos dois lados batem.</li>
          <li><b>Acertar as sequências no RDS</b>, senão o próximo <code>insert</code> tenta um <code>id</code> que já existe.</li>
          <li><b>Trocar o segredo e reiniciar</b> (<code>wrangler secret put DATABASE_URL</code>, depois <code>wrangler deploy</code>), nos dois ambientes.</li>
          <li><b>Desfazer a ponte:</b> <code>drop subscription</code> no RDS, que também remove o slot de replicação no Neon.</li>
        </ol>
        <CodeBlock code={`-- on RDS, after the last change arrived
select setval(pg_get_serial_sequence('recados', 'id'), coalesce(max(id), 0) + 1, false) from recados;
drop subscription de_neon;`} />
        <ul className="ds-list">
          <li><em>Slots parados somem.</em> O Neon remove slots de replicação inativos depois de cerca de 40 horas. Se o RDS ficar desconectado esse tempo, a replicação precisa recomeçar do zero.</li>
          <li><em>Restaurar a branch apaga os slots.</em> Não use o <i>instant restore</i> na <code>main</code> durante a migração.</li>
          <li><em>O resto da nota muda.</em> No RDS não há branch nem janela de histórico do Neon: o D+1/D+7 da <a href="#refresh">seção 10</a> vira restauração de snapshot ou <i>point-in-time recovery</i> do RDS, e a <a href="/notas/rds/">nota de RDS</a> cobre isso. A distância entre os containers e o banco continua a mesma (<a href="#neon">seção 6</a>).</li>
        </ul>

        <h3>11.4 Depois: apagar o projeto no Neon</h3>
        <p>Apagar o projeto leva junto computações, branches, bancos e papéis. O Neon permite recuperá-lo por <b>7 dias</b>; depois disso, a exclusão é definitiva. A documentação consultada não diz mais nada sobre o destino dos dados nesse período. Se o contrato exigir prova de eliminação, peça ao fornecedor. Nos planos pagos, apagar todos os projetos não encerra a cobrança: é preciso voltar ao plano Free.</p>
        <p>Para a LGPD, trocar de banco é trocar de operador. Atualize o registro das operações de tratamento (art. 37) e a política de privacidade, e guarde os arquivos exportados com o mesmo prazo de retenção dos backups (<a href="#lgpd">seção 12</a>).</p>
      </Section>

      <Section id="lgpd" title={"12. LGPD"}>
        <Callout tone="warn" icon="alert"><b>Isto não é parecer jurídico.</b> São os pontos em que a lei e as resoluções da ANPD encostam neste desenho técnico, com os artigos para você ler e levar a quem cuida do jurídico.</Callout>

        <h3>12.1 Quem é quem</h3>
        <p>Você (a empresa dona do app) é o <b>controlador</b>: decide o que se coleta e para quê (art. 5º, VI). Cloudflare, Neon/Databricks e GitHub, quando tocam nos dados, são <b>operadores</b>: tratam em seu nome e seguem suas instruções (art. 5º, VII, e art. 39). Na prática, isso é o contrato de tratamento de dados (DPA) de cada fornecedor, que você precisa ter lido e aceito.</p>

        <h3>12.2 Onde os dados ficam, e onde passam</h3>
        <Table
          head={["Peça", "Onde", "Dá para fixar no Brasil?"]}
          rows={[
            ["Banco (Neon)", <>Região do projeto: <code>aws-sa-east-1</code>, São Paulo</>, "Sim, na criação do projeto"],
            ["Containers (durable_object)", "Onde o Durable Object estiver", <>Não. As jurisdições documentadas são <code>eu</code>, <code>us</code> e <code>fedramp</code>; nenhuma é o Brasil. A dica de local <code>sam</code> (América do Sul) existe, mas a documentação avisa que hoje esses objetos nascem no leste da América do Norte.</>],
            ["Worker e proxy", "O ponto da rede da Cloudflare mais perto do visitante", "Não neste desenho"],
            ["Logs (Workers Logs)", "Cloudflare, por 7 dias", "Não documentado"],
            ["Backups exportados", "O bucket que você escolher", "Sim, se o bucket estiver no Brasil"],
          ]}
        />
        <p>A conclusão prática: o banco fica no Brasil, mas o processamento passa por fora. Trate o desenho como <b>transferência internacional</b> de dados (art. 33). A LGPD não proíbe a transferência. Ela exige um dos fundamentos do art. 33, e os dois que interessam aqui são estes:</p>
        <ul className="ds-list">
          <li><em>País ou organismo com proteção adequada (art. 33, I).</em> A Resolução CD/ANPD nº 32/2026 reconheceu a União Europeia. Na lista de regulamentações da ANPD consultada para esta nota, é a única decisão de adequação, e os EUA não estão nela.</li>
          <li><em>Cláusulas-padrão contratuais da ANPD (art. 33, II, e Resolução CD/ANPD nº 19/2024).</em> As cláusulas precisam ser adotadas <b>na íntegra e sem alteração</b> (art. 16 do regulamento). O prazo para incorporá-las aos contratos existentes era de 12 meses a partir de 23/08/2024, e já venceu.</li>
        </ul>
        <p>O que fazer: verifique se os DPAs da Cloudflare e do Neon/Databricks incluem as cláusulas-padrão <b>da ANPD</b>. As cláusulas da União Europeia são outro instrumento. Se elas não estiverem lá, peça o aditivo. E, quando usar cláusulas-padrão, publique no seu site, em português simples, uma página sobre a transferência: países, finalidade, medidas de segurança e direitos do titular. Ela pode ficar dentro da política de privacidade (art. 17, §§ 2º e 3º, do regulamento).</p>
        <Callout tone="info" icon="alert"><b>E se o requisito for “os dados não saem do Brasil”?</b> Isso é mais rígido que a LGPD: costuma vir de contrato com cliente ou de regulação setorial. Nesse caso este desenho não serve como está, porque os containers não podem ser fixados no Brasil. A saída é rodar o app numa nuvem com região em São Paulo, como a <a href="/notas/front-back-ecs-cloudflare/">nota do ECS</a>, com a Cloudflare só no DNS.</Callout>

        <h3>12.3 O que este desenho já faz pela lei</h3>
        <Table
          head={["Exigência", "Onde aparece na nota"]}
          rows={[
            ["Necessidade: o mínimo de dados (art. 6º, III)", "Só nome e recado; nada de e-mail, IP ou CPF guardado"],
            ["Transparência (art. 6º, VI)", "Aviso no formulário e link para a política de privacidade"],
            ["Segurança (art. 46)", <>TLS até o Neon (o Neon exige TLS em toda conexão), segredos como <i>secrets</i> do Worker e cada container só com os seus, front sem internet, branch <code>main</code> protegida, dev com a mesma segurança de produção, produção só com aprovação</>],
            ["Dado real fora de dev", <>Projeto separado e cópia anonimizada (<a href="#refresh">seção 10</a>). Dados anonimizados de forma irreversível deixam de ser dados pessoais (art. 12). Um mascaramento que mantém o <code>id</code> de produção pode ser revertido por quem acessa produção, então trate dev com cuidado mesmo assim.</>],
            ["Término e eliminação (arts. 15, 16 e 18, VI)", "Retenção de 90 dias aplicada todo dia, antes do backup"],
            ["Acesso e portabilidade (arts. 18, II e V, e 19)", <>Exportação só das linhas do titular, em CSV (<a href="#export">seção 11</a>)</>],
          ]}
        />

        <h3>12.4 O que ainda é com você</h3>
        <QA
          items={[
            ["Alguém pede para apagar os dados. E os backups?", <>Apague no banco na hora. O dado ainda vive nos backups até eles vencerem: janela de histórico (até 8 dias), snapshots (14 dias) e arquivos exportados (o prazo do seu bucket). Calcule o maior desses prazos, escreva na política de privacidade e não restaure backup antigo sem reaplicar as exclusões.</>],
            ["Vazou. Qual é o prazo?", <>Se o incidente puder trazer risco ou dano relevante, o controlador comunica a ANPD e os titulares em <b>3 dias úteis</b> (Resolução CD/ANPD nº 15/2024; art. 48 da LGPD). Os fornecedores, como operadores, avisam você; quem comunica é você. Para agentes de pequeno porte, o prazo é em dobro (Resolução CD/ANPD nº 2/2022, art. 14).</>],
            ["Preciso de um encarregado (DPO)?", <>Em regra, sim, com nome e contato públicos, de preferência no site (art. 41). Microempresas, empresas de pequeno porte e startups que não fazem tratamento de alto risco estão dispensadas, mas precisam manter um canal de comunicação com o titular (Resolução CD/ANPD nº 2/2022, art. 11).</>],
            ["Preciso documentar o tratamento?", <>Sim: o registro das operações de tratamento (art. 37), em forma simplificada para pequeno porte. Se o tratamento for de alto risco, por exemplo com dados sensíveis (art. 5º, II) ou em larga escala, a ANPD pode exigir o relatório de impacto, o RIPD (art. 38).</>],
            ["O que está em jogo?", <>Entre as sanções do art. 52 está multa de até 2% do faturamento no Brasil no último exercício, limitada a R$ 50 milhões por infração. Há também bloqueio ou eliminação dos dados e suspensão da atividade de tratamento.</>],
          ]}
        />
      </Section>

      <Section id="verify" title={"13. Conferir e diagnosticar"}>
        <CodeBlock code={`DOMAIN=example.com.br
curl -s https://$DOMAIN/api/health                 # {"ok":true,"env":"production"}
curl -s https://$DOMAIN/ | grep -c '<li>'           # the SSR page lists the messages (Next → api.recados → API)
npx wrangler containers list                        # instances and their state
npx wrangler deployments list --env production      # which version is live`} />
        <Table
          head={["Sintoma", "Causa provável"]}
          rows={[
            [<>Logo após o primeiro deploy, erro nas rotas e a página não carrega</>, "Os containers ainda estão sendo provisionados. A documentação pede alguns minutos; acompanhe com wrangler containers list."],
            [<><code>container did not answer /health on port 8080</code></>, <>O processo não escuta na 8080, não tem a rota <code>/health</code> ou quebrou ao iniciar. Veja os logs do container no painel (com <code>observability</code> ligado).</>],
            [<>A API responde, mas <code>/api/recados</code> dá 500 e o log mostra <code>ENOTFOUND</code> ou <code>ETIMEDOUT</code></>, <>O container da API subiu com <code>enableInternet: false</code>, ou o segredo <code>DATABASE_URL</code> não existe naquele ambiente (<code>--env</code>).</>],
            [<>A página dá erro no SSR e o log do Next mostra <code>fetch failed</code> para <code>api.recados</code></>, <>O intercept não foi registrado antes do <code>start()</code>, ou o container religou sem passar pelo <code>beforeStart</code>. Sem intercept e sem internet, o DNS do container não responde por esse host.</>],
            [<><code>missing var or secret X</code> no Worker, ou <code>missing environment variable X</code> no Next</>, <>A chave falta em <code>vars</code> daquele ambiente, o segredo não foi cadastrado com <code>--env</code>, ou o nome não está na lista do container (<code>WEB_ENV</code>/<code>API_ENV</code>).</>],
            [<>O <code>wrangler deploy</code> recusa por segredo faltando</>, <>É o <code>secrets.required</code> funcionando: cadastre o valor naquele ambiente e repita.</>],
            [<>Produção mostra um valor de dev no navegador</>, <>Uma variável <code>NEXT_PUBLIC_</code> foi congelada no build. Leia o valor no servidor e passe como prop.</>],
            [<>Trocou o segredo e nada mudou</>, "O container em execução guarda o ambiente de quando ligou. Ele lê o valor novo no próximo início (após inatividade ou novo deploy)."],
            [<>Erro com <code>SET</code>, <code>LISTEN</code> ou <i>prepared statement</i></>, "É o modo transação do pooler. Use a URL direta para isso, ou mude o código."],
            [<>O <code>neon branches create --parent &lt;data&gt;</code> falha no refresh</>, "O instante está fora da janela de histórico. Aumente a janela ou diminua o atraso."],
            [<>O <code>pg_dump</code> recusa o servidor por versão</>, "O cliente é mais antigo que o servidor. Use a imagem postgres com a mesma versão principal do projeto."],
          ]}
        />
        <Callout tone="personal" icon="alert"><b>Nota pessoal, sobre o que foi testado:</b> a API, as migrations, o Worker com dois containers no <code>wrangler dev</code> 4.167, o <code>wrangler deploy --dry-run</code> e o caminho anonimizar → dump → restore rodaram nesta máquina na primeira versão desta nota, que tinha um nginx no front. A imagem do Next foi construída aqui (Next 16.4, <code>node:22-alpine</code>). O front em Next no <code>wrangler dev</code>, o intercept, o fluxo de variáveis e a migração para o RDS seguem a documentação oficial, mas não foram executados. <b>Nada foi publicado numa conta Cloudflare, Neon ou AWS</b> para escrever esta nota.</Callout>
        <Sources title={"Fontes oficiais (consultadas em 23/11/2026)"}>
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
