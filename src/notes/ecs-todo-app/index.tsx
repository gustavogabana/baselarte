import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "ecs-todo-app",
  title: "ECS na prática: um app com ALB, Cloudflare e RDS",
  seo: {
    title: "ECS do zero: um app de to-do atrás de ALB, Cloudflare e RDS",
    description: "Passo a passo para quem só usou EC2 à mão: uma API de to-do em Node no Docker, no ECS Fargate, atrás de um ALB com certificado de origem da Cloudflare, TLS até o RDS e deploy automático pelo GitHub.",
  },
  summary: "ECS Fargate passo a passo para quem só usou EC2: VPC privada, ALB com certificado de origem da Cloudflare importado no ACM, TLS até o container e até o RDS, Secrets Manager, task definition, service e deploy automático pelo GitHub.",
  kicker: "AWS",
  heroTitle: <>ECS do zero: <em>um app de to-do atrás de ALB, Cloudflare e RDS.</em></>,
  heroLede: "Uma API de to-do em Node no Docker, no ECS Fargate, com TLS do visitante até o banco, deploy a cada push e cada passo explicado para quem só usou EC2 à mão.",
  published: "2026-10-25",
  updated: "2026-10-25",
  toc: [
    {
      items: [
        { id: "overview", title: "O fluxo completo" },
        { id: "ecs101", title: "1. ECS para quem vem da EC2" },
        { id: "app", title: "2. O projeto de exemplo" },
        { id: "network", title: "3. Rede e security groups" },
        { id: "tls", title: "4. SSL ponta a ponta" },
        { id: "data", title: "5. Banco e segredos" },
        { id: "roles", title: "6. As duas roles do ECS" },
        { id: "ecs-setup", title: "7. Cluster, task, ALB e service" },
        { id: "github", title: "8. Deploy automático" },
        { id: "verify", title: "9. Conferir e diagnosticar" },
        { id: "variantb", title: "10. Variante B: HTTP interno" },
        { id: "cleanup", title: "11. Apagar tudo" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={"O fluxo completo"}>
        <p>Este roteiro leva você de uma conta AWS vazia até um <code>git push</code> que publica uma API de to-do no ECS. O projeto é de propósito pequeno: um servidor Node nativo, um Postgres com <b>uma tabela</b> e quatro rotas. O que importa aqui é a infraestrutura em volta, e ela é a mesma de um projeto grande.</p>
        <Diagram minWidth={560} caption={"Quatro conexões, todas criptografadas. Nada trafega em texto puro, nem dentro da VPC."}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Quatro trechos com TLS">
            <rect x="278" y="14" width="416" height="118" rx="6" className="ln dash" />
            <text x="483" y="150" className="mut" textAnchor="middle">sua conta AWS: VPC com subnets públicas e privadas</text>
            <rect x="8" y="40" width="112" height="64" rx="4" className="ln fillsoft" />
            <text x="64.0" y="68" textAnchor="middle">Visitante</text>
            <text x="64.0" y="88" className="mut" textAnchor="middle">navegador</text>
            <rect x="146" y="40" width="112" height="64" rx="4" className="ln brandfill" />
            <text x="202.0" y="68" textAnchor="middle">Cloudflare</text>
            <text x="202.0" y="88" className="mut" textAnchor="middle">proxy · Full (strict)</text>
            <rect x="284" y="40" width="112" height="64" rx="4" className="ln fillsoft" />
            <text x="340.0" y="68" textAnchor="middle">ALB :443</text>
            <text x="340.0" y="88" className="mut" textAnchor="middle">subnets públicas</text>
            <rect x="422" y="40" width="112" height="64" rx="4" className="ln brandfill" />
            <text x="478.0" y="68" textAnchor="middle">Task :8443</text>
            <text x="478.0" y="88" className="mut" textAnchor="middle">Fargate · privada</text>
            <rect x="560" y="40" width="126" height="64" rx="4" className="ln fillsoft" />
            <text x="623.0" y="68" textAnchor="middle">RDS :5432</text>
            <text x="623.0" y="88" className="mut" textAnchor="middle">Postgres · privada</text>
            <path d="M120 72L146 72" className="ln" />
            <path d="M138.8 75.5L146 72L138.8 68.5" className="ln" />
            <text x="133.0" y="30" className="mono mut" textAnchor="middle">1</text>
            <path d="M258 72L284 72" className="ln" />
            <path d="M276.8 75.5L284 72L276.8 68.5" className="ln" />
            <text x="271.0" y="30" className="mono mut" textAnchor="middle">2</text>
            <path d="M396 72L422 72" className="ln" />
            <path d="M414.8 75.5L422 72L414.8 68.5" className="ln" />
            <text x="409.0" y="30" className="mono mut" textAnchor="middle">3</text>
            <path d="M534 72L560 72" className="ln" />
            <path d="M552.8 75.5L560 72L552.8 68.5" className="ln" />
            <text x="547.0" y="30" className="mono mut" textAnchor="middle">4</text>
            <text x="8" y="176" className="mut" textAnchor="start">1 certificado da Cloudflare (Universal SSL), automático</text>
            <text x="8" y="196" className="mut" textAnchor="start">2 certificado de origem da Cloudflare, importado no ACM e usado pelo listener do ALB</text>
            <text x="8" y="216" className="mut" textAnchor="start">3 o mesmo certificado, guardado no Secrets Manager e usado pelo Node dentro da task</text>
            <text x="8" y="236" className="mut" textAnchor="start">4 certificado do RDS, verificado pela aplicação com a CA da AWS (verify-full)</text>
          </svg>
        </Diagram>
        <p>Você já fez à mão o equivalente na EC2: VPC, ALB com certificado da Cloudflare, Docker, security groups, internet gateway. O ECS troca só a parte do meio. Em vez de você acessar a máquina para rodar <code>docker run</code>, você descreve o container num arquivo e o ECS roda e mantém no ar. O resto (rede, ALB, certificado) segue o que você já conhece.</p>
        <ol className="ds-steps">
          <li><b>Fundamentos (seções 1 e 2).</b> O que é cada peça do ECS e o código do app.</li>
          <li><b>Infraestrutura (3 a 6).</b> Rede, SSL ponta a ponta, banco, segredos e roles. Feito uma vez por conta.</li>
          <li><b>ECS (7).</b> Cluster, task definition, target group, ALB e service. Aqui o app sobe pela primeira vez.</li>
          <li><b>Deploy automático (8).</b> Liga o que você criou ao workflow da <a href="/notas/github-aws-oidc/">nota de OIDC</a>. A partir daí, cada push troca a task.</li>
        </ol>
        <Callout tone="warn" icon="alert"><b>Custo.</b> ALB, RDS, Fargate e endpoints de interface cobram por hora enquanto existirem, mesmo sem tráfego. Ao terminar de estudar, apague tudo na ordem da <a href="#cleanup">seção 11</a>. Consulte os preços atuais na página de preços de cada serviço.</Callout>
        <Callout tone="use" icon="check"><b>Antes de ler.</b> Esta nota não repete o que já está nas outras: contas e roles na <a href="/notas/aws/#accounts-roles">nota de AWS</a> e o OIDC com o workflow na <a href="/notas/github-aws-oidc/">nota de GitHub para AWS</a>. Ela mostra como as peças se encaixam num projeto.</Callout>
      </Section>
      <Section id="ecs101" title={"1. ECS para quem vem da EC2"}>
        <p>O ECS (Elastic Container Service) é o orquestrador de containers da AWS. Ele tem poucos conceitos, e quase todos têm um equivalente no que você fez à mão:</p>
        <Table
          head={["O que você fez na EC2", "No ECS"]}
          rows={[
            ["Subir a instância e instalar o Docker", <><b>Fargate</b>: a AWS fornece a capacidade de computação. Não há instância para você acessar, atualizar ou proteger com SSH.</>],
            [<><code>docker run -p ... -e ...</code></>, <><b>Task definition</b>: um JSON com imagem, portas, variáveis, segredos, CPU, memória e logs. É a “receita” e é versionada (revisão 1, 2, 3...).</>],
            ["O container em execução", <><b>Task</b>: uma execução da task definition. É descartável: se morrer, o service cria outra.</>],
            ["Um script ou systemd para manter no ar e reiniciar", <><b>Service</b>: mantém N tasks rodando, repõe as que caem, registra no ALB e faz a troca a cada deploy.</>],
            ["O conjunto das suas instâncias", <><b>Cluster</b>: só um agrupamento lógico de services e tasks.</>],
            ["Target group por instância e porta", <>Target group do tipo <code>ip</code>. No modo de rede <code>awsvpc</code> cada task ganha a sua própria interface de rede (ENI) e IP; a documentação exige <code>ip</code>, não <code>instance</code>.</>],
            ["Security group da instância", <>Security group da <b>task</b> (fica na ENI dela). Dá para ter uma regra por serviço, não por máquina.</>],
            [<><code>docker pull</code> com login no ECR</>, <>A <b>task execution role</b> puxa a imagem do ECR e lê os segredos antes de o container iniciar.</>],
            [<>Arquivo <code>.env</code> ou variáveis na máquina</>, <><code>environment</code> (valores comuns) e <code>secrets</code> (vêm do Secrets Manager) na task definition.</>],
            [<><code>ssh</code> + <code>docker logs</code></>, <>O driver <code>awslogs</code> envia o stdout do container para o CloudWatch Logs.</>],
          ]}
        />
        <h3>Duas roles, dois papéis</h3>
        <Table
          head={["Role", "Quem usa", "Para quê"]}
          rows={[
            [<><b>Task execution role</b></>, <>O agente do ECS/Fargate, <i>antes</i> do container iniciar</>, <>Puxar a imagem do ECR, escrever logs, ler os segredos do <code>secrets</code>. A documentação diz que essas permissões não ficam acessíveis aos containers.</>],
            [<><b>Task role</b></>, <>O <i>seu código</i>, dentro do container</>, "Chamar APIs da AWS (S3, SQS...). Este app não chama nenhuma, então a role fica sem permissões. Mantê-la separada permite dar acesso depois sem mexer na execução."],
          ]}
        />
        <p>O ECS também roda em instâncias EC2 suas (“launch type EC2”). Aqui usamos Fargate para não ter servidor para manter. O resto da nota vale para os dois, exceto a parte da máquina.</p>
        <Callout tone="use" icon="check"><b>Importante para a arquitetura da imagem.</b> A imagem precisa ser da mesma arquitetura da task (<code>X86_64</code> por padrão). O runner <code>ubuntu-latest</code> do GitHub é x86_64, então o workflow da nota de OIDC já gera uma imagem compatível. Se um dia você buildar num Mac com Apple Silicon, use <code>docker build --platform linux/amd64</code>.</Callout>
      </Section>
      <Section id="app" title={"2. O projeto de exemplo: uma API de to-do"}>
        <p>Quatro arquivos na raiz do repositório. O servidor usa os módulos <code>http</code> e <code>https</code> do Node; a única dependência é o driver <code>pg</code> para falar com o Postgres. Testei este código e esta imagem localmente (Docker, Postgres 16 e um certificado autoassinado): criar, listar, marcar, apagar, validação de entrada, health check, filesystem somente leitura e parada limpa com <code>SIGTERM</code>.</p>
        <h3>server.js</h3>
        <CodeBlock code={`'use strict';

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT || 8443);
const MAX_BODY = 10 * 1024;

// TLS_CERT and TLS_KEY come from Secrets Manager (injected by ECS).
// Without them the server speaks plain HTTP (variant B in the note).
const tls = process.env.TLS_CERT && process.env.TLS_KEY
  ? { cert: process.env.TLS_CERT, key: process.env.TLS_KEY }
  : null;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'todos',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Verify the RDS certificate chain and host name (sslmode=verify-full).
  ssl: process.env.DB_SSL === 'off'
    ? false
    : { ca: fs.readFileSync(process.env.DB_CA_FILE || '/app/rds-global-bundle.pem', 'utf8') },
  max: 5,
  connectionTimeoutMillis: 5000,
});

function send(res, status, body) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); }
      catch { reject(Object.assign(new Error('invalid json'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const m = url.pathname.match(/^\\/todos(?:\\/(\\d+))?$/);

  // Shallow on purpose: it answers "is the process up", not "is the database up".
  if (url.pathname === '/health' && req.method === 'GET') return send(res, 200, { ok: true });

  if (m && !m[1] && req.method === 'GET') {
    const { rows } = await pool.query('SELECT id, title, done, created_at FROM todos ORDER BY id');
    return send(res, 200, rows);
  }
  if (m && !m[1] && req.method === 'POST') {
    const { title } = await readJson(req);
    if (typeof title !== 'string' || !title.trim() || title.length > 200) return send(res, 400, { error: 'title: 1 to 200 characters' });
    const { rows } = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING id, title, done, created_at', [title.trim()]);
    return send(res, 201, rows[0]);
  }
  if (m && m[1] && req.method === 'PATCH') {
    const { done } = await readJson(req);
    if (typeof done !== 'boolean') return send(res, 400, { error: 'done: boolean' });
    const { rows } = await pool.query('UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, title, done, created_at', [done, m[1]]);
    return rows[0] ? send(res, 200, rows[0]) : send(res, 404, { error: 'not found' });
  }
  if (m && m[1] && req.method === 'DELETE') {
    const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [m[1]]);
    return rowCount ? send(res, 204) : send(res, 404, { error: 'not found' });
  }
  return send(res, 404, { error: 'not found' });
}

const onRequest = (req, res) => {
  handle(req, res).catch((err) => {
    if (err.status) return send(res, err.status, { error: err.message });
    console.error(err);
    send(res, 500, { error: 'internal error' });
  });
};

async function main() {
  // Demo-only migration. Idempotent, so two tasks starting together do not conflict.
  await pool.query(\`CREATE TABLE IF NOT EXISTS todos (
    id         integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      text        NOT NULL,
    done       boolean     NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )\`);

  const server = tls ? https.createServer(tls, onRequest) : http.createServer(onRequest);
  server.listen(PORT, () => console.log(\`listening on \${PORT} (\${tls ? 'https' : 'http'})\`));

  // ECS sends SIGTERM, then SIGKILL after stopTimeout (30 s by default).
  const shutdown = () => {
    server.close(async () => { await pool.end(); process.exit(0); });
    server.closeIdleConnections();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => { console.error(err); process.exit(1); });`} />
        <ul className="ds-list">
          <li><em>TLS na própria aplicação.</em> Se <code>TLS_CERT</code> e <code>TLS_KEY</code> existirem, o servidor sobe em HTTPS; se não, em HTTP. É isso que permite a <a href="#variantb">variante B</a> sem trocar a imagem.</li>
          <li><em>Banco com verificação.</em> O <code>ssl.ca</code> carrega o bundle de CAs da AWS; com isso o driver valida a cadeia e o nome do host do RDS. Sem <code>ca</code>, o <code>pg</code> não confia no certificado do RDS.</li>
          <li><em><code>/health</code> é rasa de propósito.</em> Ela só diz que o processo responde. Se checasse o banco, uma queda do RDS faria o ECS matar e recriar todas as tasks sem resolver nada.</li>
          <li><em>Parada limpa.</em> O ECS manda <code>SIGTERM</code> e, se o processo não sair, <code>SIGKILL</code> depois do <code>stopTimeout</code> (30 s por padrão, máximo 120 s). O handler deixa terminar as requisições em andamento.</li>
          <li><em>Migração no start.</em> O <code>CREATE TABLE IF NOT EXISTS</code> serve para o exemplo e é seguro com duas tasks iniciando juntas. Em um projeto real, rode migrações como uma etapa separada do deploy.</li>
        </ul>
        <h3>package.json e Dockerfile</h3>
        <CodeBlock code={`{
  "name": "todo-api",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "engines": { "node": ">=22" },
  "dependencies": { "pg": "^8.13.0" }
}`} />
        <CodeBlock code={`FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
# CA bundle used to verify the RDS certificate (global bundle, AWS docs).
ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /app/rds-global-bundle.pem
COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js ./
USER node
EXPOSE 8443
CMD ["node", "server.js"]`} />
        <p>Rode <code>npm install</code> uma vez para gerar o <code>package-lock.json</code> e versione-o: o <code>npm ci</code> do Dockerfile exige esse arquivo. O Dockerfile usa dois estágios, roda como o usuário <code>node</code> (não como root) e baixa o bundle de CAs do RDS da URL oficial. Crie também um <code>.dockerignore</code> para que chaves e <code>node_modules</code> não entrem na imagem:</p>
        <CodeBlock code={`node_modules
.git
.github
*.pem
*.key
.env`} />
        <h3>Testar localmente</h3>
        <CodeBlock code={`docker build -t todo .
docker network create tnet
docker run -d --name pg --network tnet -e POSTGRES_PASSWORD=pw -e POSTGRES_DB=todos postgres:16-alpine
# local Postgres has no TLS, so turn the DB check off (never do this in the cloud)
docker run -d --name app --network tnet -p 8443:8443 \\
  -e DB_HOST=pg -e DB_USER=postgres -e DB_PASSWORD=pw -e DB_SSL=off todo
curl -s -X POST localhost:8443/todos -d '{"title":"buy milk"}'
curl -s localhost:8443/todos`} />
      </Section>
      <Section id="network" title={"3. Rede: VPC, subnets, endpoints e security groups"}>
        <p>Você já montou uma VPC com ALB e EC2. A diferença aqui é onde cada peça mora: o ALB fica em subnets <b>públicas</b>; as tasks e o banco ficam em subnets <b>privadas</b>, sem IP público e sem rota para o internet gateway. A task só aceita tráfego do ALB e só fala com o banco e com a AWS.</p>
        <Diagram minWidth={560} caption={"Quem pode falar com quem. Cada seta é uma regra de entrada que aponta para o SG de origem, não para um CIDR. A task não tem IP público: alcança ECR, logs e segredos pelos endpoints."}>
          <svg viewBox="0 0 700 262" role="img" aria-label="Rede e security groups">
            <rect x="136" y="10" width="554" height="240" rx="6" className="ln dash" />
            <text x="146" y="28" className="mono mut" textAnchor="start">VPC 10.0.0.0/16</text>
            <rect x="8" y="60" width="112" height="64" rx="4" className="ln fillsoft" />
            <text x="64.0" y="88" textAnchor="middle">Internet</text>
            <text x="64.0" y="108" className="mut" textAnchor="middle">só IPs Cloudflare</text>
            <rect x="176" y="60" width="120" height="64" rx="4" className="ln fillsoft" />
            <text x="236.0" y="88" textAnchor="middle">ALB</text>
            <text x="236.0" y="108" className="mut" textAnchor="middle">sg-alb · pública</text>
            <rect x="346" y="60" width="120" height="64" rx="4" className="ln brandfill" />
            <text x="406.0" y="88" textAnchor="middle">Tasks Fargate</text>
            <text x="406.0" y="108" className="mut" textAnchor="middle">sg-app · privada</text>
            <rect x="536" y="60" width="142" height="64" rx="4" className="ln fillsoft" />
            <text x="607.0" y="88" textAnchor="middle">RDS</text>
            <text x="607.0" y="108" className="mut" textAnchor="middle">sg-db · privada</text>
            <path d="M120 92L176 92" className="ln" />
            <path d="M168.8 95.5L176 92L168.8 88.5" className="ln" />
            <path d="M296 92L346 92" className="ln" />
            <path d="M338.8 95.5L346 92L338.8 88.5" className="ln" />
            <path d="M466 92L536 92" className="ln" />
            <path d="M528.8 95.5L536 92L528.8 88.5" className="ln" />
            <text x="156" y="82" className="mono mut" textAnchor="middle">443</text>
            <text x="321" y="82" className="mono mut" textAnchor="middle">8443</text>
            <text x="501" y="82" className="mono mut" textAnchor="middle">5432</text>
            <rect x="346" y="166" width="332" height="68" rx="4" className="ln fillsoft" />
            <text x="512" y="188" textAnchor="middle">VPC endpoints (sg-vpce, porta 443)</text>
            <text x="512" y="210" className="mono mut" textAnchor="middle">ecr.api · ecr.dkr · logs · secretsmanager</text>
            <text x="512" y="226" className="mono mut" textAnchor="middle">s3 (gateway)</text>
            <path d="M406 124L406 166" className="ln dash" />
          </svg>
        </Diagram>
        <h3>3.1 VPC e subnets</h3>
        <ol className="ds-steps">
          <li>Console: <b>VPC → Create VPC → VPC and more</b>. Nome <code>todo</code>, IPv4 <code>10.0.0.0/16</code>, <b>2</b> Availability Zones, <b>2</b> subnets públicas, <b>2</b> privadas.</li>
          <li><b>NAT gateways: None</b> e <b>VPC endpoints: S3 Gateway</b>. Mantenha ativos <i>Enable DNS hostnames</i> e <i>Enable DNS resolution</i> (os endpoints de interface usam DNS privado).</li>
          <li>O assistente cria o internet gateway, a tabela de rotas das públicas (<code>0.0.0.0/0</code> → IGW) e as das privadas (sem rota para a internet, só o endpoint do S3). Os detalhes de VPC, rotas e IGW estão na <a href="/notas/aws/#vpc">nota de AWS</a>.</li>
        </ol>
        <p>Para simplificar, o RDS reaproveita as subnets privadas das tasks. Em produção, é comum uma camada separada só para dados.</p>
        <CodeBlock code={`REGION=sa-east-1
ACCOUNT_ID=<ACCOUNT_ID>        # the account of this environment (dev or prod)
export AWS_PROFILE=dev         # one CLI profile per account
DOMAIN=todo.example.com        # the hostname that Cloudflare will serve
VPC_ID=<vpc-id>; PUB_A=<subnet-public-a>; PUB_B=<subnet-public-b>; PRIV_A=<subnet-private-a>; PRIV_B=<subnet-private-b>`} />
        <h3>3.2 Security groups encadeados</h3>
        <p>Quatro grupos. Cada regra de entrada aponta para o <i>grupo</i> de origem, não para um CIDR: se as tasks mudarem de IP, nada precisa ser editado. É o mesmo encadeamento da <a href="/notas/aws/#sg">nota de AWS</a>.</p>
        <Table
          head={["Grupo", "Entrada permitida", "Por quê"]}
          rows={[
            [<><code>sg-alb</code></>, "443 dos IPs da Cloudflare", "Ninguém além da Cloudflare chega ao ALB. Quem tentar o DNS do ALB direto não conecta."],
            [<><code>sg-app</code></>, <>8443 de <code>sg-alb</code></>, "Só o ALB fala com a task."],
            [<><code>sg-db</code></>, <>5432 de <code>sg-app</code></>, "Só a aplicação fala com o banco."],
            [<><code>sg-vpce</code></>, <>443 de <code>sg-app</code></>, "Os endpoints de interface só atendem as tasks. A documentação exige 443 de entrada a partir das subnets privadas."],
          ]}
        />
        <CodeBlock code={`mksg() { aws ec2 create-security-group --group-name "$1" --description "$1" --vpc-id $VPC_ID --query GroupId --output text; }
SG_ALB=$(mksg todo-alb); SG_APP=$(mksg todo-app); SG_DB=$(mksg todo-db); SG_VPCE=$(mksg todo-vpce)

allow() { aws ec2 authorize-security-group-ingress --group-id "$1" --protocol tcp --port "$2" --source-group "$3"; }
allow $SG_APP 8443 $SG_ALB
allow $SG_DB 5432 $SG_APP
allow $SG_VPCE 443 $SG_APP`} />
        <h3>3.3 Só a Cloudflare chega ao ALB</h3>
        <p>A Cloudflare publica os endereços de onde conecta à sua origem (<a href="https://www.cloudflare.com/ips-v4">ips-v4</a>, <a href="https://www.cloudflare.com/ips-v6">ips-v6</a>), e a documentação recomenda descartar o tráfego web que não venha deles. Em vez de copiar 15 regras para o security group, use uma <i>prefix list</i> (veja <a href="/notas/aws/#sg">Prefix Lists</a> na nota de AWS). Este exemplo cobre IPv4; o ALB padrão é IPv4 e a Cloudflare consegue alcançá-lo assim.</p>
        <CodeBlock code={`PL_CF=$(aws ec2 create-managed-prefix-list --prefix-list-name cloudflare-ipv4 \\
  --address-family IPv4 --max-entries 30 \\
  --entries $(curl -s https://www.cloudflare.com/ips-v4 | sed 's/^/Cidr=/') \\
  --query PrefixList.PrefixListId --output text)

aws ec2 authorize-security-group-ingress --group-id $SG_ALB \\
  --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,PrefixListIds=[{PrefixListId=$PL_CF}]"`} />
        <Callout tone="warn" icon="alert">A lista da Cloudflare muda de vez em quando. Revise a prefix list periodicamente (<code>modify-managed-prefix-list</code>) ou automatize com um job agendado. Além disso, a documentação avisa: a Cloudflare usa <code>172.64.0.0/13</code> para se conectar, e uma rota mais ampla que aponte para um destino interno (por exemplo, <code>172.16.0.0/12</code> ou maior) causa erros 521/522.</Callout>
        <h3>3.4 Como a task alcança a AWS sem internet</h3>
        <p>Uma task Fargate numa subnet privada precisa falar com quatro serviços antes e durante a execução. Sem NAT, cada um ganha um endpoint dentro da sua VPC. Segundo as documentações do ECS e do ECR (Fargate com plataforma 1.4.0 ou mais nova):</p>
        <Table
          head={["Para quê", "Endpoint", "Tipo"]}
          rows={[
            ["Autenticar e consultar o ECR", <><code>ecr.api</code></>, "Interface"],
            ["Baixar a imagem (protocolo Docker)", <><code>ecr.dkr</code> (com DNS privado ligado)</>, "Interface"],
            ["Baixar as camadas da imagem, que o ECR guarda no S3", <><code>s3</code></>, "Gateway (o assistente já criou)"],
            ["Enviar logs ao CloudWatch", <><code>logs</code></>, "Interface"],
            ["Ler segredos antes de iniciar", <><code>secretsmanager</code></>, "Interface"],
          ]}
        />
        <CodeBlock code={`for SVC in ecr.api ecr.dkr logs secretsmanager; do
  aws ec2 create-vpc-endpoint --vpc-endpoint-type Interface --vpc-id $VPC_ID \\
    --service-name com.amazonaws.$REGION.$SVC \\
    --subnet-ids $PRIV_A $PRIV_B --security-group-ids $SG_VPCE --private-dns-enabled
done`} />
        <p>Alternativa: um NAT gateway numa subnet pública e uma rota <code>0.0.0.0/0</code> → NAT nas privadas. É mais simples de configurar, mas todo tráfego de saída passa por um dispositivo na internet pública e o NAT cobra por hora e por GB. Para uma API que só fala com serviços da AWS, os endpoints mantêm o tráfego dentro da rede da Amazon.</p>
        <Callout tone="warn" icon="alert">Se sua aplicação chamar uma API externa (pagamento, e-mail), a task precisará de NAT além dos endpoints. Sem saída para a internet, a chamada simplesmente expira.</Callout>
      </Section>
      <Section id="tls" title={"4. SSL ponta a ponta"}>
        <p>Voltando à figura do início: são <b>quatro conexões</b> e cada uma tem o seu certificado. O trecho 1 a Cloudflare resolve sozinha. O trecho 4 já está na seção 5 (RDS). Esta seção cuida dos trechos 2 e 3, que usam o <b>mesmo</b> certificado de origem da Cloudflare em dois lugares.</p>
        <Table
          head={["Trecho", "Termina em", "Certificado", "Quem valida"]}
          rows={[
            ["1 · visitante → Cloudflare", "Cloudflare", "Universal SSL da Cloudflare", "O navegador"],
            ["2 · Cloudflare → ALB", "Listener 443 do ALB", "Origem da Cloudflare, importado no ACM", "A Cloudflare (Full strict)"],
            ["3 · ALB → task", "Node, dentro do container", "O mesmo, vindo do Secrets Manager", "Ninguém (veja abaixo)"],
            ["4 · task → RDS", "PostgreSQL no RDS", "CA do RDS", <>O driver <code>pg</code> (verify-full)</>],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>O que o trecho 3 protege (e o que não).</b> A documentação do ALB diz que ele <i>não valida</i> o certificado dos targets: aceita autoassinado ou expirado, porque o tráfego dentro da VPC é autenticado no nível do pacote, sem risco de man-in-the-middle ou falsificação. Então o HTTPS até a task não serve para provar identidade; ele serve para <b>confidencialidade</b>: ninguém que consiga observar o tráfego da VPC vê o conteúdo. É uma defesa em profundidade e muitas vezes uma exigência de conformidade. Se você não precisa disso, a <a href="#variantb">variante B</a> é mais simples.</Callout>
        <h3>4.1 Cloudflare: modo Full (strict) e certificado de origem</h3>
        <ol className="ds-steps">
          <li>Dashboard da Cloudflare → seu domínio → <b>SSL/TLS → Overview</b> → modo <b>Full (strict)</b>. Nesse modo a Cloudflare só conecta à origem se o certificado for válido para o hostname e emitido por uma CA pública ou pela Origin CA da Cloudflare.</li>
          <li><b>SSL/TLS → Origin Server → Create Certificate</b>. Deixe a Cloudflare gerar a chave privada (RSA 2048 é suficiente), liste o hostname (<code>todo.example.com</code>) e escolha a validade.</li>
          <li>Copie o certificado para <code>origin.pem</code> e a chave para <code>origin.key</code> <b>antes de sair da tela</b>: a documentação avisa que a chave não pode ser vista depois.</li>
        </ol>
        <p>Esse certificado só é confiável para a Cloudflare: um navegador que falasse direto com o ALB o rejeitaria, o que é mais um motivo para o <code>sg-alb</code> aceitar só os IPs dela.</p>
        <h3>4.2 Trecho 2: importar no ACM (para o ALB)</h3>
        <p>O ACM aceita certificados importados em PEM, com chave privada sem senha e de até 5 KB; RSA 2048 e ECDSA entre os suportados, e o ALB aceita todos os algoritmos do ACM.</p>
        <CodeBlock code={`CERT_ARN=$(aws acm import-certificate \\
  --certificate fileb://origin.pem --private-key fileb://origin.key \\
  --query CertificateArn --output text)
echo $CERT_ARN`} />
        <h3>4.3 Trecho 3: guardar no Secrets Manager (para o Node)</h3>
        <p>O ACM não entrega a chave privada de volta, e a chave nunca deve entrar na imagem. Por isso a mesma chave vai para um segredo, e o ECS a injeta como variável de ambiente <code>TLS_KEY</code> quando a task inicia (é o que o <code>server.js</code> lê). O <code>jq</code> monta o JSON e cuida das quebras de linha do PEM:</p>
        <CodeBlock code={`aws secretsmanager create-secret --name todo/tls --description "Cloudflare origin cert for the todo app" \\
  --secret-string "$(jq -n --rawfile c origin.pem --rawfile k origin.key '{tls_cert:$c, tls_key:$k}')"

rm origin.key   # keep the only other copy in your password manager, if you want one`} />
        <h3>4.4 Renovar sem derrubar nada</h3>
        <ul className="ds-list">
          <li>A Cloudflare não avisa quando o certificado de origem vai vencer (a documentação diz isso), e certificados importados no ACM não renovam sozinhos. Crie um lembrete no calendário com bastante antecedência.</li>
          <li>Os segredos só são lidos <b>quando a task inicia</b>: a documentação do ECS avisa que, se o segredo mudar, o container não recebe o valor novo sozinho. É preciso forçar um deploy novo.</li>
        </ul>
        <CodeBlock code={`# 1) create a new origin certificate in Cloudflare and save origin.pem / origin.key
# 2) re-import over the same ARN, so the listener keeps working
aws acm import-certificate --certificate-arn $CERT_ARN \\
  --certificate fileb://origin.pem --private-key fileb://origin.key
# 3) update the secret
aws secretsmanager put-secret-value --secret-id todo/tls \\
  --secret-string "$(jq -n --rawfile c origin.pem --rawfile k origin.key '{tls_cert:$c, tls_key:$k}')"
# 4) restart the tasks, one by one, with the rolling update
aws ecs update-service --cluster todo --service todo --force-new-deployment`} />
        <Callout tone="use" icon="check">Dica de segurança: o certificado de origem valer por muito tempo é conveniente, mas o risco é a chave vazar e ficar válida por anos. Escolha uma validade que você consiga renovar com disciplina.</Callout>
      </Section>
      <Section id="data" title={"5. Banco de dados: RDS e segredos"}>
        <p>O RDS Postgres vai nas subnets privadas, sem acesso público, criptografado em repouso, e só aceita a porta 5432 vinda do <code>sg-app</code>. A senha é gerada na hora, vai direto para o Secrets Manager e nunca aparece no terminal.</p>
        <CodeBlock code={`aws rds create-db-subnet-group --db-subnet-group-name todo \\
  --db-subnet-group-description "todo private subnets" --subnet-ids $PRIV_A $PRIV_B

DB_PASS=$(aws secretsmanager get-random-password --password-length 32 --exclude-punctuation \\
  --query RandomPassword --output text)

aws secretsmanager create-secret --name todo/db --description "todo app database login" \\
  --secret-string "$(jq -n --arg u todo_admin --arg p "$DB_PASS" '{username:$u, password:$p}')"

aws rds create-db-instance --db-instance-identifier todo-db \\
  --engine postgres --db-instance-class db.t4g.micro --allocated-storage 20 \\
  --db-name todos --master-username todo_admin --master-user-password "$DB_PASS" \\
  --db-subnet-group-name todo --vpc-security-group-ids $SG_DB \\
  --no-publicly-accessible --storage-encrypted --backup-retention-period 7
unset DB_PASS

aws rds wait db-instance-available --db-instance-identifier todo-db
DB_HOST=$(aws rds describe-db-instances --db-instance-identifier todo-db \\
  --query 'DBInstances[0].Endpoint.Address' --output text)
echo $DB_HOST`} />
        <h3>SSL até o banco (trecho 4)</h3>
        <ul className="ds-list">
          <li><em>Exigir SSL no servidor.</em> Segundo a documentação do RDS, o parâmetro <code>rds.force_ssl</code> vem ligado (1) por padrão no PostgreSQL 15 ou mais novo; nas versões 14 e anteriores o padrão é 0 e você precisa de um parameter group próprio. Confira a versão com <code>aws rds describe-db-instances --query "DBInstances[0].EngineVersion"</code>.</li>
          <li><em>Verificar o servidor no cliente.</em> Cliente que só “usa SSL” não sabe com quem fala. Com <code>sslmode=verify-full</code> (o que o <code>ssl.ca</code> do <code>server.js</code> faz), o driver confere a cadeia e o nome do host. Para isso ele precisa da CA da AWS, que o Dockerfile baixa do <code>truststore.pki.rds.amazonaws.com</code>.</li>
          <li><em>CA do bundle.</em> O bundle global inclui as CAs <code>rds-ca-rsa2048-g1</code> (padrão), <code>rds-ca-rsa4096-g1</code> e <code>rds-ca-ecc384-g1</code>. A documentação manda registrar só as CAs raiz, não as intermediárias, para não quebrar quando o RDS rotaciona o certificado do servidor.</li>
        </ul>
        <Callout tone="warn" icon="alert"><b>Usuário mestre no app é atalho de estudo.</b> Em produção crie um usuário só com <code>SELECT/INSERT/UPDATE/DELETE</code> na tabela e use as credenciais mestras apenas para migrações.</Callout>
        <Callout tone="warn" icon="alert"><b>Cuidado com a senha gerenciada pelo RDS.</b> O RDS pode guardar e rotacionar a senha mestra no Secrets Manager (<code>--manage-master-user-password</code>), por padrão a cada sete dias. Mas o ECS lê o segredo só quando a task <i>inicia</i>: depois de uma rotação, as tasks em execução continuam com a senha antiga e novas conexões falham até um deploy novo. Para usar esse recurso, o app precisa ler o segredo em tempo de execução (com a task role e o endpoint do Secrets Manager) ou você precisa de um processo que force o deploy após a rotação. Por isso este exemplo usa um segredo próprio e estático.</Callout>
      </Section>
      <Section id="roles" title={"6. As duas roles do ECS"}>
        <p>Crie as duas roles <b>em cada conta</b> (dev e prod). A de execução usa a política gerenciada <code>AmazonECSTaskExecutionRolePolicy</code> (ECR e logs) e ganha uma política embutida para ler só os dois segredos do app. Como os segredos usam a chave KMS padrão do Secrets Manager, a documentação não pede <code>kms:Decrypt</code>.</p>
        <CodeBlock code={`cat > ecs-trust.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ecs-tasks.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role --role-name todoExecutionRole --assume-role-policy-document file://ecs-trust.json
aws iam attach-role-policy --role-name todoExecutionRole \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam put-role-policy --role-name todoExecutionRole --policy-name read-todo-secrets \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": [
        "arn:aws:secretsmanager:'$REGION':'$ACCOUNT_ID':secret:todo/db-*",
        "arn:aws:secretsmanager:'$REGION':'$ACCOUNT_ID':secret:todo/tls-*"
      ]
    }]
  }'

# task role: no permissions, the app calls no AWS API
aws iam create-role --role-name todoTaskRole --assume-role-policy-document file://ecs-trust.json`} />
        <p>O <code>-*</code> no fim cobre o sufixo aleatório que o Secrets Manager acrescenta ao ARN. A role de deploy do GitHub (nota de OIDC) já tem <code>iam:PassRole</code> para <i>essas duas</i> roles; ajuste o ARN dela se você usou outros nomes.</p>
      </Section>
      <Section id="ecs-setup" title={"7. ECS: cluster, task definition, ALB e service"}>
        <p>Agora as peças do ECS, na ordem em que uma depende da outra. Os comandos usam as variáveis das seções anteriores.</p>
        <h3>7.1 Repositório de imagens e a primeira imagem</h3>
        <p>O repositório é o da <a href="/notas/github-aws-oidc/#ecr">etapa 6 da nota de OIDC</a> (tags imutáveis). Um service precisa de uma imagem que exista para subir; como o pipeline só funciona depois que o service existe, envie a primeira imagem à mão, uma única vez, com a tag <code>bootstrap</code>.</p>
        <CodeBlock code={`aws ecr create-repository --repository-name todo --image-tag-mutability IMMUTABLE \\
  --image-scanning-configuration scanOnPush=true

REGISTRY=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
aws ecr get-login-password | docker login --username AWS --password-stdin $REGISTRY
docker build --platform linux/amd64 -t $REGISTRY/todo:bootstrap .
docker push $REGISTRY/todo:bootstrap`} />
        <h3>7.2 Logs e cluster</h3>
        <CodeBlock code={`aws logs create-log-group --log-group-name /ecs/todo
aws logs put-retention-policy --log-group-name /ecs/todo --retention-in-days 14

aws ecs create-cluster --cluster-name todo`} />
        <h3>7.3 Task definition</h3>
        <p>Salve como <code>.aws/task-definition.develop.json</code> (e outro, <code>.aws/task-definition.production.json</code>, para a conta de produção). Troque os marcadores <code>&lt;...&gt;</code>. Os ARNs completos dos segredos, com o sufixo aleatório, saem de <code>aws secretsmanager describe-secret --secret-id todo/db --query ARN --output text</code> (e o mesmo para <code>todo/tls</code>).</p>
        <CodeBlock code={`{
  "family": "todo",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "runtimePlatform": { "cpuArchitecture": "X86_64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/todoExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/todoTaskRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/todo:bootstrap",
      "essential": true,
      "readonlyRootFilesystem": true,
      "stopTimeout": 30,
      "portMappings": [{ "containerPort": 8443, "protocol": "tcp" }],
      "environment": [
        { "name": "PORT", "value": "8443" },
        { "name": "DB_HOST", "value": "<DB_HOST>" },
        { "name": "DB_NAME", "value": "todos" }
      ],
      "secrets": [
        { "name": "DB_USER",     "valueFrom": "<TODO_DB_SECRET_ARN>:username::" },
        { "name": "DB_PASSWORD", "valueFrom": "<TODO_DB_SECRET_ARN>:password::" },
        { "name": "TLS_CERT",    "valueFrom": "<TODO_TLS_SECRET_ARN>:tls_cert::" },
        { "name": "TLS_KEY",     "valueFrom": "<TODO_TLS_SECRET_ARN>:tls_key::" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \\"require('https').get({host:'localhost',port:8443,path:'/health',rejectUnauthorized:false},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))\\""],
        "interval": 15,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 20
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/todo",
          "awslogs-region": "<REGION>",
          "awslogs-stream-prefix": "app"
        }
      }
    }
  ]
}`} />
        <ul className="ds-list">
          <li><em><code>secrets</code> × <code>environment</code>.</em> O que está em <code>secrets</code> vem do Secrets Manager e não aparece no JSON. A sintaxe <code>ARN:chave::</code> pega uma chave do JSON do segredo (exige Fargate com plataforma 1.4.0 ou mais nova). Os dois pontos finais são as partes opcionais (estágio e versão) deixadas em branco.</li>
          <li><em><code>awsvpc</code> e portas.</em> Em <code>awsvpc</code> a task tem seu próprio IP, então a porta do container é a porta que o ALB acessa. Não existe mapeamento de porta do host.</li>
          <li><em><code>readonlyRootFilesystem</code>.</em> O container não pode escrever no próprio disco. Se um invasor entrar, não consegue gravar binários nem alterar o app. O Node não precisa de disco para este exemplo.</li>
          <li><em>Health check do container.</em> Usa o próprio Node (a imagem Alpine não traz <code>curl</code>) e aceita o certificado local com <code>rejectUnauthorized:false</code>, já que a checagem é interna. Na variante B troque <code>https</code> por <code>http</code>.</li>
          <li><em>CPU e memória.</em> 256 (0,25 vCPU) e 512 MB é uma combinação válida para Fargate e basta para o exemplo.</li>
        </ul>
        <CodeBlock code={`aws ecs register-task-definition --cli-input-json file://.aws/task-definition.develop.json`} />
        <h3>7.4 Target group, ALB e listener HTTPS</h3>
        <p>O target group é <code>ip</code> e fala <b>HTTPS</b> com a task na 8443; o health check do ALB também é HTTPS no <code>/health</code>. Mesmo que o ALB seja compartilhado com outros apps, cada service usa o seu próprio target group (a documentação do ECS recomenda um por service).</p>
        <CodeBlock code={`TG_ARN=$(aws elbv2 create-target-group --name todo --target-type ip \\
  --protocol HTTPS --port 8443 --vpc-id $VPC_ID \\
  --health-check-protocol HTTPS --health-check-path /health \\
  --health-check-interval-seconds 15 --healthy-threshold-count 2 --matcher HttpCode=200 \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)
aws elbv2 modify-target-group-attributes --target-group-arn $TG_ARN \\
  --attributes Key=deregistration_delay.timeout_seconds,Value=30

ALB_ARN=$(aws elbv2 create-load-balancer --name todo --type application --scheme internet-facing \\
  --subnets $PUB_A $PUB_B --security-groups $SG_ALB \\
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

aws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTPS --port 443 \\
  --certificates CertificateArn=$CERT_ARN --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \\
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text`} />
        <p>Não há listener na porta 80: o <code>sg-alb</code> nem a deixa entrar. O redirecionamento de HTTP para HTTPS fica na Cloudflare (<b>SSL/TLS → Edge Certificates → Always Use HTTPS</b>), antes de o tráfego chegar à sua conta.</p>
        <h3>7.5 Service</h3>
        <CodeBlock code={`# once per account; the console does it for you, the CLI does not
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com   # ignore "already exists"

aws ecs create-service --cluster todo --service-name todo \\
  --task-definition todo --desired-count 2 --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[$PRIV_A,$PRIV_B],securityGroups=[$SG_APP],assignPublicIp=DISABLED}" \\
  --load-balancers targetGroupArn=$TG_ARN,containerName=app,containerPort=8443 \\
  --health-check-grace-period-seconds 60 \\
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200,deploymentCircuitBreaker={enable=true,rollback=true}"`} />
        <ul className="ds-list">
          <li><em><code>desired-count 2</code>.</em> Duas tasks, uma em cada subnet privada (AZs diferentes). Uma AZ pode cair sem tirar o app do ar. Com 1 task só, a troca de versão passa por um instante com a nova e a antiga juntas (100/200).</li>
          <li><em><code>assignPublicIp=DISABLED</code>.</em> A task não ganha IP público. Ela é alcançável só de dentro da VPC, via ALB.</li>
          <li><em><code>health-check-grace-period-seconds 60</code>.</em> Pela referência da API, o scheduler ignora health checks do ALB reprovados por esse tempo depois de a task iniciar. Sem ele (padrão 0) uma task que ainda está carregando seria morta antes de ficar pronta.</li>
          <li><em>Circuit breaker com rollback.</em> Se as tasks novas não ficarem saudáveis, o ECS volta para a revisão anterior sozinho. Detalhes na <a href="/notas/github-aws-oidc/#ecs">etapa 7 da nota de OIDC</a>.</li>
          <li><em>Service-linked role.</em> O ECS precisa dela para registrar e remover as tasks no ALB, segundo a documentação.</li>
        </ul>
        <h3>7.6 DNS na Cloudflare</h3>
        <ol className="ds-steps">
          <li>Cloudflare → <b>DNS → Records → Add record</b>: tipo <code>CNAME</code>, nome <code>todo</code>, destino = o DNS do ALB que o último comando acima imprimiu, <b>Proxy status: Proxied</b> (nuvem laranja).</li>
          <li>Com o proxy ligado, a Cloudflare termina o trecho 1 e abre o trecho 2 até o ALB, validando o certificado de origem (Full strict).</li>
        </ol>
      </Section>
      <Section id="github" title={"8. Ligar ao deploy automático"}>
        <p>Tudo o que a <a href="/notas/github-aws-oidc/">nota de OIDC</a> chamava de “já existe” (ECR, cluster, service, roles) agora existe. Falta entregar ao workflow os nomes certos, em cada environment do GitHub:</p>
        <Table
          head={["Variável do environment", "Valor deste exemplo"]}
          rows={[
            [<><code>AWS_ROLE_ARN</code></>, "A role de deploy via OIDC daquela conta (etapa 2 da nota de OIDC)"],
            [<><code>AWS_REGION</code></>, <><code>sa-east-1</code> (a mesma de <code>$REGION</code>)</>],
            [<><code>ECR_REPOSITORY</code></>, <><code>todo</code></>],
            [<><code>ECS_CLUSTER</code></>, <><code>todo</code></>],
            [<><code>ECS_SERVICE</code></>, <><code>todo</code></>],
          ]}
        />
        <CodeBlock code={`gh variable set ECR_REPOSITORY --env develop --body "todo"
gh variable set ECS_CLUSTER    --env develop --body "todo"
gh variable set ECS_SERVICE    --env develop --body "todo"
# AWS_ROLE_ARN and AWS_REGION: see step 3 of the OIDC note; repeat all of them for --env production`} />
        <h3>Um arquivo de task definition por ambiente</h3>
        <p>O workflow da nota de OIDC usa um único <code>.aws/task-definition.json</code>. Aqui o arquivo carrega o ID da conta (nos ARNs das roles e dos segredos) e o endpoint do banco, que são diferentes em dev e prod. Por isso há um arquivo por environment, e uma única linha do workflow muda para escolher o certo:</p>
        <CodeBlock code={`    env:
      # ...
      ECS_TASK_DEFINITION: .aws/task-definition.\${{ github.ref_name == 'main' && 'production' || 'develop' }}.json
      CONTAINER_NAME: app`} />
        <ul className="ds-list">
          <li><em>A imagem do arquivo é só um marcador.</em> A action de render troca o campo <code>image</code> do container <code>app</code> pela imagem do commit; o <code>:bootstrap</code> nunca mais é usado.</li>
          <li><em>O app não usa <code>--build-arg</code>.</em> Se o seu Dockerfile não declara <code>ARG APP_ENV</code>, o <code>docker build</code> ignora o argumento extra com um aviso. Você pode apagar essas linhas do workflow, já que a configuração do app vem em tempo de execução (<code>environment</code> e <code>secrets</code>).</li>
          <li><em>O que o pipeline não faz.</em> Não cria rede, banco, segredos nem roles; só troca a imagem. Mudou um segredo (por exemplo, o certificado)? Rode <code>update-service --force-new-deployment</code>, como na seção 4.4.</li>
        </ul>
        <ol className="ds-steps">
          <li>Faça merge de uma mudança em <code>develop</code>. O workflow constrói a imagem (a do GitHub é x86_64, como a task), envia ao ECR com o SHA como tag, registra uma revisão da task definition e atualiza o service.</li>
          <li>O ECS sobe duas tasks novas, espera passarem nos health checks do container e do ALB, e só então para as antigas (100/200). Enquanto isso, o ALB só manda tráfego às saudáveis.</li>
          <li>O job do GitHub espera o service estabilizar. Se o circuit breaker fizer rollback, o job falha e o app antigo continua no ar.</li>
        </ol>
      </Section>
      <Section id="verify" title={"9. Conferir que funciona e que está seguro"}>
        <CodeBlock code={`# 1) the service reached steady state, and the targets are healthy
aws ecs describe-services --cluster todo --services todo \\
  --query 'services[0].{running:runningCount,desired:desiredCount,events:events[0].message}'
aws elbv2 describe-target-health --target-group-arn $TG_ARN \\
  --query 'TargetHealthDescriptions[].TargetHealth.State'

# 2) the app log says it started over HTTPS
aws logs tail /ecs/todo --since 10m

# 3) through Cloudflare, end to end
curl -i https://$DOMAIN/health
curl -s -X POST https://$DOMAIN/todos -d '{"title":"first task"}'
curl -s https://$DOMAIN/todos

# 4) negative tests: both must FAIL
curl -m 8 -k https://<ALB_DNS_NAME>/health     # times out: sg-alb only accepts Cloudflare IPs
curl -m 8 http://$DOMAIN/health                # redirected to HTTPS by Cloudflare`} />
        <h3>Quando algo dá errado</h3>
        <Table
          head={["Sintoma", "Causa provável"]}
          rows={[
            [<>Cloudflare <b>521</b> (web server is down) ou <b>522</b> (connection timed out)</>, <>O <code>sg-alb</code> não tem os IPs da Cloudflare na 443, ou o listener 443 não existe. Verifique também a rota de 172.64.0.0/13 citada na seção 3.</>],
            [<>Cloudflare <b>525</b> (SSL handshake failed) ou <b>526</b> (invalid SSL certificate)</>, "O listener do ALB não usa o certificado de origem importado, o certificado não cobre o hostname, ou o modo Full (strict) está com um certificado vencido."],
            [<>Cloudflare <b>502</b>, ALB 502/503</>, <>Nenhum target saudável. Veja <code>describe-target-health</code>: se estiver <i>unhealthy</i>, o target group fala HTTPS e a task HTTP (ou o contrário), ou <code>sg-app</code> não aceita 8443 do <code>sg-alb</code>.</>],
            [<>A task para logo depois de iniciar: <code>ResourceInitializationError ... unable to pull secrets</code></>, <>A execution role não pode ler o segredo (ARN errado na política ou no <code>valueFrom</code>), ou falta o endpoint <code>secretsmanager</code>, ou o <code>sg-vpce</code> não aceita 443 do <code>sg-app</code>.</>],
            [<><code>CannotPullContainerError</code></>, <>Faltam <code>ecr.api</code>, <code>ecr.dkr</code> ou o gateway do <code>s3</code>; o DNS privado do endpoint está desligado; ou a imagem/tag não existe no ECR.</>],
            ["Sem logs no CloudWatch", <>Falta o endpoint <code>logs</code>, ou o grupo <code>/ecs/todo</code> não existe (o <code>awslogs</code> não o cria sozinho nesta configuração).</>],
            [<>O log mostra <code>self-signed certificate in certificate chain</code> ao falar com o banco</>, <>O bundle de CAs não foi baixado na imagem, ou o <code>DB_CA_FILE</code> aponta para outro arquivo. O RDS exige confiar na CA da AWS para o <code>verify-full</code>.</>],
            [<><code>no pg_hba.conf entry ... SSL off</code></>, <>O servidor exige SSL (<code>rds.force_ssl</code>) e o cliente tentou sem. Confira que <code>DB_SSL</code> não está <code>off</code> na task.</>],
            ["Deploy fica em loop e volta para a versão antiga", "É o circuit breaker fazendo o trabalho dele. Leia os eventos do service e os logs da task nova para achar o motivo."],
          ]}
        />
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> as causas da tabela acima são o diagnóstico que faço a partir da leitura das documentações, não uma lista oficial. Das mensagens da Cloudflare, só os títulos dos erros foram conferidos na documentação.</Callout>
      </Section>
      <Section id="variantb" title={"10. Variante B: HTTP dentro da VPC"}>
        <p>Se você não precisa da criptografia entre o ALB e a task, o ALB pode terminar o TLS e falar HTTP com o container. Fica bem mais simples: a task não precisa do certificado, o segredo <code>todo/tls</code> deixa de existir e não há renovação em dois lugares. O mesmo código serve, porque o <code>server.js</code> cai para HTTP quando não recebe <code>TLS_CERT</code>.</p>
        <Table
          head={["O que muda", "Variante A (principal)", "Variante B"]}
          rows={[
            ["Target group", "HTTPS · 8443 · health check HTTPS", "HTTP · 8080 · health check HTTP"],
            ["Task definition", <><code>TLS_CERT</code> e <code>TLS_KEY</code> em <code>secrets</code>; <code>PORT=8443</code></>, <>Sem os dois; <code>PORT=8080</code>; health check com <code>http</code></>],
            ["Security group", <><code>sg-app</code> aceita 8443 do ALB</>, <><code>sg-app</code> aceita 8080 do ALB</>],
            ["Trecho ALB → task", "Criptografado", "Texto puro dentro da VPC, autenticado por pacote"],
            ["Trechos 1, 2 e 4", "Iguais", "Iguais (Cloudflare → ALB e task → RDS continuam em TLS)"],
          ]}
        />
        <p>O target group não pode mudar de protocolo depois de criado, então migrar da A para a B (ou ao contrário) significa criar outro target group e trocar o service para ele.</p>
      </Section>
      <Section id="cleanup" title={"11. Apagar tudo"}>
        <p>Apague na ordem inversa da dependência, para que nada fique preso. Desfazer o que você criou evita cobranças por hora de ALB, RDS, endpoints e tasks.</p>
        <ol className="ds-steps">
          <li>Cloudflare: apague o registro CNAME. GitHub: apague as variáveis (ou desligue o workflow).</li>
          <li><code>aws ecs update-service --cluster todo --service todo --desired-count 0</code> e depois <code>aws ecs delete-service --cluster todo --service todo --force</code>; então <code>aws ecs delete-cluster --cluster todo</code>.</li>
          <li>Apague o listener e o ALB (<code>aws elbv2 delete-load-balancer</code>), depois o target group. Remova o certificado do ACM (<code>aws acm delete-certificate</code>), que só pode ser apagado depois de sair do listener.</li>
          <li>RDS: <code>aws rds delete-db-instance --db-instance-identifier todo-db --skip-final-snapshot</code> (ou tire um snapshot final se os dados importarem).</li>
          <li>Segredos (<code>aws secretsmanager delete-secret</code>), repositório ECR, log group, roles IAM, as task definitions (desregistre as revisões).</li>
          <li>Por último a rede: endpoints, security groups, prefix list e a VPC (o assistente remove as subnets, rotas e o IGW junto).</li>
        </ol>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> esta combinação (Cloudflare Full strict, certificado de origem no ACM e no container, Fargate em subnets privadas com endpoints, RDS com verify-full) não aparece num único exemplo oficial; ela junta as páginas listadas abaixo. O <code>server.js</code>, a imagem e o <code>jq</code> que monta o segredo foram executados localmente (Docker, Postgres 16, certificado autoassinado), com o TLS ligado e desligado. Os comandos <code>aws</code> e a task definition <b>não foram executados contra uma conta AWS</b>: foram escritos pelas referências da CLI e da API, então confira os parâmetros com <code>--help</code> na sua versão antes de depender deles.</Callout>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> a Cloudflare oferece o Authenticated Origin Pulls (mTLS) para que a origem só aceite conexões da sua conta. Não verifiquei se o ALB consegue exigi-lo, então esta nota usa a lista de IPs no security group. O ponto de partida é a página oficial de Authenticated Origin Pulls, listada abaixo.</Callout>
        <Sources title={"Fontes oficiais · verificadas em 2026-10-25"}>
          <ul>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html">AWS Docs · ECS: Use an Application Load Balancer (target type ip for awsvpc, one target group per service)</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html">AWS Docs · ELB: Target groups for ALB (HTTPS targets, certificates are not validated, ip targets)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html">AWS Docs · ECS: Pass Secrets Manager secrets through environment variables (valueFrom syntax, platform 1.4.0, no rotation pickup)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html">AWS Docs · ECS: Task execution IAM role (managed policy, Secrets Manager permissions)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/vpc-endpoints.html">AWS Docs · ECS: Interface VPC endpoints (Fargate: ECR, Secrets Manager and CloudWatch Logs)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html">AWS Docs · ECR: Interface VPC endpoints (ecr.api, ecr.dkr, S3 gateway, logs)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html">AWS Docs · ECS: Task definition parameters for Fargate (stopTimeout, readonlyRootFilesystem, healthCheck)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html">AWS Docs · ECS API: CreateService (healthCheckGracePeriodSeconds)</a></li>
            <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/import-certificate-prerequisites.html">AWS Docs · ACM: Prerequisites for importing certificates</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html">AWS Docs · RDS: Using SSL with a PostgreSQL DB instance (rds.force_ssl, verify-full)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html">AWS Docs · RDS: Using SSL/TLS to encrypt a connection (CA bundle, root CAs only)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html">AWS Docs · RDS: Password management with Secrets Manager (default 7-day rotation)</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/">Cloudflare Docs · Origin CA certificates</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/">Cloudflare Docs · Authenticated Origin Pulls</a></li>
            <li><a href="https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/">Cloudflare Docs · Cloudflare IP addresses</a></li>
            <li><a href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/">Cloudflare Docs · 5xx errors</a></li>
            <li><a href="https://nodejs.org/docs/latest-v22.x/api/https.html">Node.js Docs · HTTPS (createServer, server.close)</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
