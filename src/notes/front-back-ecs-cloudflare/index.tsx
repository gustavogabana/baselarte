import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "front-back-ecs-cloudflare",
  title: "Front e back no ECS atrás de um ALB",
  seo: {
    title: "Front-end e back-end no AWS ECS com domínio e certificado de origem da Cloudflare",
    description: "Passo a passo: um front-end React (nginx) e uma API Node como duas imagens Docker no ECS Fargate, um ALB que manda /api/* para o back-end, o domínio comprado na Cloudflare e o certificado de origem da Cloudflare importado no ACM.",
  },
  summary: "deploy de um front e de um back como duas imagens Docker no AWS ECS Fargate: roteamento por caminho num só ALB (/api/* para a API, o resto para um nginx servindo um build Vite/React), chamadas na mesma origem sem CORS, domínio registrado na Cloudflare com DNS em proxy e CNAME flattening, SSL Full (strict) com certificado de origem da Cloudflare importado no ACM, security groups que só aceitam a Cloudflare, regras de cache para assets com hash e para o index.html, uma matriz no GitHub Actions que publica cada imagem e uma tabela de diagnóstico. As imagens e o roteamento local foram executados; os comandos da AWS não rodaram contra uma conta.",
  kicker: "AWS · Cloudflare",
  heroTitle: <>Front e back na AWS: <em>duas imagens, um ALB, um domínio.</em></>,
  heroLede: "Um front-end React servido pelo nginx e uma API em Node, cada um na sua imagem Docker no ECS Fargate, atrás de um único load balancer que divide o tráfego pelo caminho. O domínio foi comprado na Cloudflare, que também emite o certificado que o ALB usa.",
  published: "2026-11-03",
  updated: "2026-11-03",
  toc: [
    {
      items: [
        { id: "overview", title: "O desenho" },
        { id: "routing", title: "1. Caminho ou subdomínio?" },
        { id: "project", title: "2. O projeto e as duas imagens" },
        { id: "cloudflare", title: "3. Cloudflare: SSL e certificado" },
        { id: "network", title: "4. Rede e security groups" },
        { id: "ecr", title: "5. Dois repositórios no ECR" },
        { id: "tasks", title: "6. Roles e task definitions" },
        { id: "alb", title: "7. ALB, regras e services" },
        { id: "dns", title: "8. DNS e o caminho de cada pedido" },
        { id: "deploy", title: "9. Deploy das duas imagens" },
        { id: "verify", title: "10. Conferir e diagnosticar" },
        { id: "cleanup", title: "11. Apagar tudo" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={"O desenho"}>
        <p>A ideia é simples: o site tem duas partes que mudam em ritmos diferentes. O <b>front</b> são arquivos estáticos (HTML, JS, CSS) que o navegador baixa; o <b>back</b> é um processo que responde JSON. Cada parte vira uma imagem Docker, cada imagem vira um <i>service</i> no ECS, e um único <b>ALB</b> decide, pelo caminho da URL, para qual delas mandar cada pedido.</p>
        <p>A Cloudflare fica na frente de tudo: é onde o domínio foi comprado, onde mora o DNS e quem emite o certificado que o ALB apresenta.</p>
        <Diagram minWidth={600} caption={"Um domínio, um ALB, dois services. O ALB olha o caminho: /api/* vai para a API, o resto vai para o nginx com o build do React."}>
          <svg viewBox="0 0 720 320" role="img" aria-label="Cloudflare, ALB e dois services">
            <rect x="282" y="10" width="430" height="300" rx="6" className="ln dash" />
            <text x="296" y="30" className="mut" textAnchor="start">sua conta AWS · VPC</text>
            <rect x="8" y="122" width="104" height="60" rx="4" className="ln fillsoft" />
            <text x="60" y="148" textAnchor="middle">Visitante</text>
            <text x="60" y="167" className="mono mut" textAnchor="middle">example.com</text>
            <rect x="138" y="122" width="122" height="60" rx="4" className="ln brandfill" />
            <text x="199" y="148" textAnchor="middle">Cloudflare</text>
            <text x="199" y="167" className="mut" textAnchor="middle">DNS · proxy</text>
            <rect x="302" y="106" width="140" height="92" rx="4" className="ln fillsoft" />
            <text x="372" y="130" textAnchor="middle">ALB :443</text>
            <text x="372" y="150" className="mut" textAnchor="middle">cert. de origem (ACM)</text>
            <text x="372" y="170" className="mono mut" textAnchor="middle">/api/* → api</text>
            <text x="372" y="187" className="mono mut" textAnchor="middle">padrão → web</text>
            <text x="372" y="230" className="mut" textAnchor="middle">subnets públicas</text>
            <rect x="528" y="44" width="172" height="66" rx="4" className="ln brandfill" />
            <text x="614" y="70" textAnchor="middle">web · nginx :8080</text>
            <text x="614" y="90" className="mut" textAnchor="middle">2 tasks · build do React</text>
            <rect x="528" y="194" width="172" height="66" rx="4" className="ln brandfill" />
            <text x="614" y="220" textAnchor="middle">api · Node :3000</text>
            <text x="614" y="240" className="mut" textAnchor="middle">2 tasks · JSON</text>
            <text x="614" y="290" className="mut" textAnchor="middle">subnets privadas</text>
            <path d="M112 152L138 152" className="ln" />
            <path d="M130.8 155.5L138 152L130.8 148.5" className="ln" />
            <text x="125" y="140" className="mono mut" textAnchor="middle">1</text>
            <path d="M260 152L302 152" className="ln" />
            <path d="M294.8 155.5L302 152L294.8 148.5" className="ln" />
            <text x="270" y="140" className="mono mut" textAnchor="middle">2</text>
            <path d="M442 152L464 152L464 77L528 77" className="ln" />
            <path d="M520.8 80.5L528 77L520.8 73.5" className="ln" />
            <path d="M464 152L464 227L528 227" className="ln" />
            <path d="M520.8 230.5L528 227L520.8 223.5" className="ln" />
            <text x="494" y="68" className="mono mut" textAnchor="middle">/*</text>
            <text x="494" y="218" className="mono mut" textAnchor="middle">/api/*</text>
            <text x="453" y="140" className="mono mut" textAnchor="middle">3</text>
          </svg>
        </Diagram>
        <Table
          head={["Trecho", "Quem apresenta o certificado", "Quem confere"]}
          rows={[
            ["1 · navegador → Cloudflare", "Cloudflare (Universal SSL, automático e gratuito)", "O navegador"],
            ["2 · Cloudflare → ALB", "ALB, com o certificado de origem da Cloudflare importado no ACM", "A Cloudflare, no modo Full (strict)"],
            ["3 · ALB → containers", "Ninguém: HTTP dentro da VPC (veja a callout abaixo)", "—"],
          ]}
        />
        <Callout tone="use" icon="check"><b>Por que HTTP no trecho 3.</b> O ALB termina o TLS e fala HTTP com os containers. É o desenho mais comum e o mais simples: os containers não guardam chave privada e o certificado se renova num lugar só. Se você precisa de criptografia também dentro da VPC (conformidade, defesa em profundidade), a <a href="/notas/ecs-todo-app/#tls">nota do ECS do zero</a> mostra como levar o mesmo certificado até o container.</Callout>
        <h3>O roteiro</h3>
        <ol className="ds-steps">
          <li><b>Decidir e construir (seções 1 e 2).</b> Caminho ou subdomínio, o código de exemplo, as duas imagens e um teste local que imita o ALB.</li>
          <li><b>Fundação (3 a 5).</b> Certificado na Cloudflare, rede na AWS e os dois repositórios de imagens.</li>
          <li><b>No ar (6 a 8).</b> Task definitions, ALB com a regra <code>/api/*</code>, dois services e o DNS apontando para o ALB.</li>
          <li><b>Rotina (9 a 11).</b> Deploy automático das duas imagens, diagnóstico e limpeza.</li>
        </ol>
        <Callout tone="warn" icon="alert"><b>Custo.</b> O ALB, as tasks Fargate e os endpoints de VPC cobram por hora enquanto existirem, mesmo sem visitas. Um ALB só para os dois services já é a economia principal deste desenho (são dois apps, mas um load balancer). Ao terminar de estudar, siga a <a href="#cleanup">seção 11</a>.</Callout>
        <Callout tone="use" icon="check"><b>Notas vizinhas.</b> VPC, security groups e prefix lists na <a href="/notas/aws/">nota de AWS</a>; GitHub entrando na AWS sem chaves na <a href="/notas/github-aws-oidc/">nota de OIDC</a>; banco RDS e segredos na <a href="/notas/ecs-todo-app/">nota do ECS do zero</a>. Esta nota junta as peças para o caso de dois containers.</Callout>
      </Section>

      <Section id="routing" title={"1. Caminho ou subdomínio?"}>
        <p>Antes de criar qualquer coisa, decida como o navegador vai chegar na API. Há duas formas de dividir o tráfego no ALB, e a escolha muda o código do front:</p>
        <Table
          head={["", <><b>Por caminho</b> (esta nota)</>, <><b>Por subdomínio</b></>]}
          rows={[
            ["URLs", <><code>example.com/</code> e <code>example.com/api/...</code></>, <><code>example.com</code> e <code>api.example.com</code></>],
            ["Condição da regra no ALB", <><code>path-pattern</code> = <code>/api/*</code></>, <><code>host-header</code> = <code>api.example.com</code></>],
            ["CORS", "Não existe: é a mesma origem", <>Obrigatório: a API precisa responder <code>Access-Control-Allow-Origin</code> e tratar o <code>OPTIONS</code> (preflight)</>],
            ["Cookies de sessão", "Funcionam sem configuração extra", <>Precisam de <code>Domain=example.com</code> e <code>credentials: 'include'</code> no fetch</>],
            ["URL da API no build do front", <>Nenhuma: o código chama <code>/api/...</code> (relativo)</>, <>Uma variável de build (<code>VITE_API_URL</code>), e uma imagem diferente por ambiente</>],
            ["Exigência no código da API", <>As rotas começam com <code>/api</code> (o ALB repassa o caminho inteiro)</>, "Nenhuma"],
            ["Quando escolher", "Um site e a sua própria API: o caso comum", "A API é pública e usada por outros clientes (app mobile, parceiros)"],
          ]}
        />
        <p>Esta nota segue <b>por caminho</b>. A variante por subdomínio é a mesma montagem com uma linha diferente na regra do ALB e um registro DNS a mais; ela aparece no fim da <a href="#alb">seção 7</a>.</p>
        <Callout tone="info" icon="alert"><b>E se o front não usasse container?</b> Um front que é só arquivo estático pode ir para o S3 com CloudFront, ou para o Cloudflare Pages, e custar quase nada. A imagem com nginx faz sentido quando você quer o mesmo fluxo de deploy para as duas partes, versionar front e back juntos, ou quando o front tem servidor (SSR). É o caso desta nota.</Callout>
      </Section>

      <Section id="project" title={"2. O projeto e as duas imagens"}>
        <p>Um repositório, duas pastas, uma imagem por pasta. A API é de propósito <b>sem estado</b> (não tem banco): ela diz qual task respondeu, o que deixa visível o ALB dividindo o tráfego. Para pôr um Postgres atrás dela, siga a <a href="/notas/ecs-todo-app/#data">seção de RDS da nota do ECS</a>.</p>
        <CodeBlock code={`mural/
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── web/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json        (+ package-lock.json)
│   ├── vite.config.js
│   ├── index.html
│   └── src/main.jsx
├── .aws/
│   ├── task-definition.web.json
│   └── task-definition.api.json
├── compose.yaml            (local test)
├── local/alb.conf          (local test)
└── .github/workflows/deploy.yml`} />

        <h3>2.1 A API (back)</h3>
        <p>Node puro, sem dependências. Repare que <b>toda rota começa com <code>/api</code></b>: o ALB não remove o prefixo, ele entrega <code>/api/info</code> do jeito que chegou.</p>
        <CodeBlock code={`// api/server.js
import http from 'node:http';
import os from 'node:os';

const PORT = Number(process.env.PORT || 3000);
const VERSION = process.env.APP_VERSION || 'dev';

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');

  // Shallow: "is the process up". The ALB and the container health check call it.
  if (req.method === 'GET' && pathname === '/api/health') return json(res, 200, { ok: true });

  // Which task answered: refresh the page and watch it change between the two tasks.
  if (req.method === 'GET' && pathname === '/api/info') {
    return json(res, 200, {
      task: os.hostname(),
      version: VERSION,
      time: new Date().toISOString(),
      // Cloudflare puts the visitor's IP here; X-Forwarded-For starts with Cloudflare's own hop.
      visitor: req.headers['cf-connecting-ip'] ?? null,
    });
  }

  if (req.method === 'GET' && pathname === '/api/hello') {
    const name = (searchParams.get('name') || 'world').slice(0, 50);
    return json(res, 200, { message: \`hello, \${name}\` });
  }

  return json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => console.log(\`api listening on \${PORT}, version \${VERSION}\`));

// ECS sends SIGTERM, then SIGKILL after stopTimeout (30 s by default).
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  server.closeIdleConnections();
});`} />
        <CodeBlock code={`// api/package.json
{
  "name": "mural-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": { "start": "node server.js" }
}`} />
        <CodeBlock code={`# api/Dockerfile
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json server.js ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]`} />
        <ul className="ds-list">
          <li><em><code>cache-control: no-store</code> em toda resposta.</em> A Cloudflare já não guarda JSON por padrão, mas o cabeçalho deixa a intenção explícita para qualquer cache no caminho.</li>
          <li><em><code>cf-connecting-ip</code>.</em> Atrás de Cloudflare e ALB, o IP da conexão é o do ALB e o primeiro do <code>X-Forwarded-For</code> é o da Cloudflare. O IP do visitante vem nesse cabeçalho, que o ALB repassa intacto.</li>
          <li><em>Parada limpa.</em> No deploy o ECS manda <code>SIGTERM</code>; o servidor para de aceitar conexões e sai. Medido localmente: <code>docker compose stop api</code> levou 0,5 s, em vez dos 10 s do timeout do Docker.</li>
        </ul>

        <h3>2.2 O front (React + Vite, servido pelo nginx)</h3>
        <p>O ponto central: o front chama <b><code>/api/info</code>, um caminho relativo</b>. Em produção o navegador manda para o mesmo domínio da página, e o ALB encaminha para a API. Em desenvolvimento, o proxy do Vite faz o mesmo papel. A mesma imagem do front serve para dev, homologação e produção, porque ela não carrega nenhuma URL de API.</p>
        <CodeBlock code={`// web/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // In development, /api goes to the API on your machine: the same path the ALB uses in the cloud.
  server: { proxy: { '/api': 'http://localhost:3000' } },
});`} />
        <CodeBlock code={`// web/src/main.jsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    try {
      // Relative URL: same domain as the page. No CORS, no API URL baked into the build.
      const res = await fetch('/api/info');
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      setInfo(await res.json());
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 480, margin: '3rem auto' }}>
      <h1>Mural</h1>
      {error && <p>API error: {error}</p>}
      {info && <p>Task <code>{info.task}</code> · version {info.version} · {info.time}</p>}
      <button onClick={load}>Ask again</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);`} />
        <p>O <code>index.html</code> é o padrão do Vite (um <code>&lt;div id="root"&gt;</code> e o <code>&lt;script type="module" src="/src/main.jsx"&gt;</code>), e o <code>package.json</code> tem <code>react</code>, <code>react-dom</code>, <code>vite</code> e <code>@vitejs/plugin-react</code>. Rode <code>npm install</code> uma vez e versione o <code>package-lock.json</code>: o <code>npm ci</code> do Dockerfile exige esse arquivo.</p>
        <CodeBlock code={`# web/nginx.conf
server {
    listen 8080;
    root /usr/share/nginx/html;
    server_tokens off;

    # Health check for the ALB and the container. Does not touch the disk.
    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 "ok\\n";
    }

    # Vite puts a hash in every file name under /assets: safe to cache for a year.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Single-page app: any other path returns index.html, which is never cached.
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }
}`} />
        <CodeBlock code={`# web/Dockerfile
# Stage 1: build the static files with Node
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve them with nginx, as a non-root user, on port 8080
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080`} />
        <ul className="ds-list">
          <li><em>Dois estágios.</em> O Node só existe para gerar o <code>dist/</code>; a imagem final tem apenas nginx e os arquivos. Medido: <b>82 MB</b> para o front contra <b>239 MB</b> da API (que precisa do Node para rodar).</li>
          <li><em><code>nginx-unprivileged</code>.</em> Roda como o usuário <code>nginx</code> (uid 101), não como root, e por isso escuta na 8080 (portas abaixo de 1024 exigem root).</li>
          <li><em><code>try_files ... /index.html</code>.</em> Sem essa linha, abrir <code>example.com/perfil</code> direto (ou dar F5 nela) dá 404, porque não existe arquivo <code>perfil</code>: quem conhece essa rota é o React, no navegador.</li>
          <li><em>Duas regras de cache.</em> Os arquivos em <code>/assets/</code> têm hash no nome (<code>index-ChZJ-1oU.js</code>): um conteúdo novo gera um nome novo, então podem ficar em cache por um ano. O <code>index.html</code> fica com <code>no-cache</code>, para que cada deploy chegue ao visitante na hora.</li>
        </ul>
        <p>Os dois projetos levam um <code>.dockerignore</code> com <code>node_modules</code>, <code>dist</code>, <code>.git</code>, <code>.env</code> e <code>*.key</code>, para que nada local nem segredo entre na imagem.</p>

        <h3>2.3 Testar localmente, com um “ALB” de mentira</h3>
        <p>Antes de pagar por um ALB, imite as regras dele com um nginx na frente das duas imagens. Se funcionar aqui, as regras na AWS são a tradução direta. Os <code>read_only</code> imitam o <code>readonlyRootFilesystem</code> que a task definition vai usar.</p>
        <CodeBlock code={`# local/alb.conf: plays the ALB's listener rules on your machine
server {
    listen 80;
    location /api/ { proxy_pass http://api:3000; }   # rule: path-pattern /api/*
    location /     { proxy_pass http://web:8080; }   # default action
}`} />
        <CodeBlock code={`# compose.yaml
services:
  web:
    build: ./web
    read_only: true
    tmpfs: [/tmp]          # nginx writes its temp files here
  api:
    build: ./api
    read_only: true
    environment:
      APP_VERSION: local
  alb:
    image: nginx:1.29-alpine
    volumes: ["./local/alb.conf:/etc/nginx/conf.d/default.conf:ro"]
    ports: ["8000:80"]
    depends_on: [web, api]`} />
        <CodeBlock code={`docker compose up -d --build

curl -s localhost:8000/api/info                       # JSON from the API
curl -s -H 'CF-Connecting-IP: 203.0.113.7' localhost:8000/api/info   # "visitor":"203.0.113.7"
curl -s -o /dev/null -w '%{http_code}\\n' localhost:8000/any/react/route   # 200: index.html
curl -sI localhost:8000/ | grep -i cache-control      # no-cache
# open http://localhost:8000 in the browser

docker compose down`} />
        <p>Resultado desta execução: <code>/</code> devolveu o HTML com <code>Cache-Control: no-cache</code>; <code>/assets/index-ChZJ-1oU.js</code> veio com <code>public, max-age=31536000, immutable</code>; uma rota inventada devolveu 200 com o <code>index.html</code>; <code>/assets/nao-existe.js</code> deu 404 (e não o HTML, que quebraria o navegador com um erro confuso); e <code>/api/info</code> respondeu o JSON com o IP do cabeçalho.</p>
        <Callout tone="warn" icon="alert"><b>Duas armadilhas que apareceram no teste.</b> (1) Sem o <code>tmpfs: [/tmp]</code>, o nginx não sobe com o disco somente leitura: <code>mkdir() "/tmp/proxy_temp" failed (30: Read-only file system)</code>. No Fargate a solução é um volume montado em <code>/tmp</code> (seção 6). (2) Dentro do container do nginx, <code>wget http://localhost:8080/healthz</code> deu <i>Connection refused</i>: <code>localhost</code> resolveu para o IPv6 <code>::1</code>, e o nginx só escuta em IPv4. Com <code>127.0.0.1</code> funcionou. Por isso os health checks da seção 6 usam o IP, não o nome.</Callout>
      </Section>

      <Section id="cloudflare" title={"3. Cloudflare: modo SSL e certificado de origem"}>
        <p>Domínio comprado na Cloudflare já nasce usando o DNS dela: o Cloudflare Registrar exige os nameservers da Cloudflare, então não há nada a apontar no registrador. Faltam três ajustes no painel, todos em <b>SSL/TLS</b>.</p>
        <ol className="ds-steps">
          <li><b>SSL/TLS → Overview → Full (strict).</b> A Cloudflare só conecta ao ALB se o certificado dele for válido, não vencido e cobrir o hostname, emitido por uma CA pública ou pela Origin CA da Cloudflare. Nos modos <i>Flexible</i> ou <i>Full</i> (sem strict), qualquer um no meio do caminho poderia se passar pelo seu ALB.</li>
          <li><b>SSL/TLS → Origin Server → Create Certificate.</b> Deixe a Cloudflare gerar a chave (RSA 2048 serve). Os hostnames padrão já são os certos para este desenho: <code>example.com</code> e <code>*.example.com</code>, o que cobre também o <code>www</code> e um eventual <code>api.</code>. Escolha a validade e o formato <b>PEM</b>.</li>
          <li>Salve o certificado em <code>origin.pem</code> e a chave em <code>origin.key</code> <b>antes de sair da tela</b>: a chave não pode ser vista de novo.</li>
          <li><b>SSL/TLS → Edge Certificates → Always Use HTTPS: On.</b> O visitante que digitar <code>http://</code> é redirecionado na Cloudflare, antes de chegar à AWS. Por isso o ALB não precisa de listener na porta 80.</li>
        </ol>
        <Callout tone="warn" icon="alert"><b>Esse certificado só vale para a Cloudflare.</b> Navegadores não confiam na Origin CA. Se o registro DNS ficar como <i>DNS only</i> (nuvem cinza) ou o proxy for pausado, o visitante vê erro de certificado. Os registros deste desenho ficam sempre com proxy (nuvem laranja). E a Cloudflare não avisa quando o certificado de origem vai vencer: anote a data no calendário.</Callout>
        <p>O certificado entra na AWS na <a href="#alb">seção 7</a>.</p>
      </Section>

      <Section id="network" title={"4. Rede e security groups"}>
        <p>A rede é a mesma de um app só, com um security group a mais. O ALB fica nas subnets <b>públicas</b>; as tasks dos dois services ficam nas <b>privadas</b>, sem IP público. Cada service tem o seu security group, que só aceita o ALB e só na porta do seu container.</p>
        <ol className="ds-steps">
          <li>Console: <b>VPC → Create VPC → VPC and more</b>. Nome <code>mural</code>, <code>10.0.0.0/16</code>, <b>2</b> AZs, <b>2</b> subnets públicas e <b>2</b> privadas, <b>NAT gateways: None</b>, <b>VPC endpoints: S3 Gateway</b>, DNS hostnames e DNS resolution ligados.</li>
          <li>Anote os IDs nas variáveis abaixo; os comandos das próximas seções usam todas elas.</li>
        </ol>
        <CodeBlock code={`REGION=sa-east-1
ACCOUNT_ID=<ACCOUNT_ID>
DOMAIN=example.com
VPC_ID=<vpc-id>
PUB_A=<subnet-public-a>;  PUB_B=<subnet-public-b>
PRIV_A=<subnet-private-a>; PRIV_B=<subnet-private-b>`} />
        <Table
          head={["Grupo", "Entrada permitida", "Por quê"]}
          rows={[
            [<><code>mural-alb</code></>, "443 só dos IPs da Cloudflare (prefix list)", "Quem tentar o DNS do ALB direto, pulando a Cloudflare, nem conecta."],
            [<><code>mural-web</code></>, <>8080 de <code>mural-alb</code></>, "Só o ALB fala com o nginx."],
            [<><code>mural-api</code></>, <>3000 de <code>mural-alb</code></>, "Só o ALB fala com a API. O front não chama a API por dentro: quem chama é o navegador, passando pelo ALB."],
            [<><code>mural-vpce</code></>, <>443 de <code>mural-web</code> e de <code>mural-api</code></>, "As tasks baixam a imagem e mandam logs pelos endpoints, sem internet."],
          ]}
        />
        <CodeBlock code={`mksg() { aws ec2 create-security-group --group-name "$1" --description "$1" --vpc-id $VPC_ID --query GroupId --output text; }
SG_ALB=$(mksg mural-alb); SG_WEB=$(mksg mural-web); SG_API=$(mksg mural-api); SG_VPCE=$(mksg mural-vpce)

allow() { aws ec2 authorize-security-group-ingress --group-id "$1" --protocol tcp --port "$2" --source-group "$3"; }
allow $SG_WEB  8080 $SG_ALB
allow $SG_API  3000 $SG_ALB
allow $SG_VPCE 443  $SG_WEB
allow $SG_VPCE 443  $SG_API

# Cloudflare's published IPv4 ranges as a managed prefix list, allowed on 443
PL_CF=$(aws ec2 create-managed-prefix-list --prefix-list-name cloudflare-ipv4 \\
  --address-family IPv4 --max-entries 30 \\
  --entries $(curl -s https://www.cloudflare.com/ips-v4 | sed 's/^/Cidr=/') \\
  --query PrefixList.PrefixListId --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_ALB \\
  --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,PrefixListIds=[{PrefixListId=$PL_CF}]"

# Interface endpoints: pull images from ECR and write logs without a NAT gateway
for SVC in ecr.api ecr.dkr logs; do
  aws ec2 create-vpc-endpoint --vpc-endpoint-type Interface --vpc-id $VPC_ID \\
    --service-name com.amazonaws.$REGION.$SVC \\
    --subnet-ids $PRIV_A $PRIV_B --security-group-ids $SG_VPCE --private-dns-enabled
done`} />
        <ul className="ds-list">
          <li><em>Sem <code>secretsmanager</code>.</em> Como os containers não recebem certificado nem senha, este desenho não precisa do endpoint do Secrets Manager. Se a API ganhar um banco, acrescente-o (e veja a <a href="/notas/ecs-todo-app/#network">seção de rede da nota do ECS</a>, que explica cada endpoint).</li>
          <li><em>A lista da Cloudflare muda.</em> Revise a prefix list de tempos em tempos (<code>modify-managed-prefix-list</code>). Uma faixa nova que falte aparece como erro 522 para parte dos visitantes.</li>
          <li><em>API externa?</em> Se a API chamar algo fora da AWS (pagamento, e-mail), as subnets privadas precisam de um NAT gateway; sem saída para a internet, a chamada só expira.</li>
        </ul>
      </Section>

      <Section id="ecr" title={"5. Dois repositórios no ECR e as primeiras imagens"}>
        <p>Uma imagem, um repositório. Tags imutáveis garantem que <code>:abc123</code> sempre aponte para o mesmo conteúdo. Um service só sobe com uma imagem que exista, então envie a primeira de cada à mão, uma única vez, com a tag <code>bootstrap</code>; depois disso quem envia é o pipeline.</p>
        <CodeBlock code={`for APP in web api; do
  aws ecr create-repository --repository-name mural-$APP \\
    --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true
done

REGISTRY=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
aws ecr get-login-password | docker login --username AWS --password-stdin $REGISTRY

for APP in web api; do
  docker build --platform linux/amd64 -t $REGISTRY/mural-$APP:bootstrap ./$APP
  docker push $REGISTRY/mural-$APP:bootstrap
done`} />
        <Callout tone="use" icon="check"><b><code>--platform linux/amd64</code>.</b> A task definition abaixo pede <code>X86_64</code>. Num Mac com Apple Silicon o <code>docker build</code> gera ARM por padrão, e a task para com <code>exec format error</code>. O runner do GitHub já é x86_64.</Callout>
      </Section>

      <Section id="tasks" title={"6. Roles, logs e as duas task definitions"}>
        <p>Uma única <b>execution role</b> serve aos dois services: ela é usada pelo agente do ECS para baixar a imagem e escrever logs, antes de o container iniciar. Nenhum dos dois apps chama APIs da AWS, então não há <i>task role</i>. Um cluster agrupa os dois services.</p>
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
aws iam create-role --role-name muralExecutionRole --assume-role-policy-document file://ecs-trust.json
aws iam attach-role-policy --role-name muralExecutionRole \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

for APP in web api; do
  aws logs create-log-group --log-group-name /ecs/mural-$APP
  aws logs put-retention-policy --log-group-name /ecs/mural-$APP --retention-in-days 14
done

aws ecs create-cluster --cluster-name mural`} />
        <h3>6.1 Front: .aws/task-definition.web.json</h3>
        <CodeBlock code={`{
  "family": "mural-web",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "runtimePlatform": { "cpuArchitecture": "X86_64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/muralExecutionRole",
  "volumes": [{ "name": "tmp" }],
  "containerDefinitions": [
    {
      "name": "web",
      "image": "<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/mural-web:bootstrap",
      "essential": true,
      "readonlyRootFilesystem": true,
      "mountPoints": [{ "sourceVolume": "tmp", "containerPath": "/tmp" }],
      "portMappings": [{ "containerPort": 8080, "protocol": "tcp" }],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1"],
        "interval": 15, "timeout": 5, "retries": 3, "startPeriod": 10
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mural-web",
          "awslogs-region": "<REGION>",
          "awslogs-stream-prefix": "web"
        }
      }
    }
  ]
}`} />
        <h3>6.2 Back: .aws/task-definition.api.json</h3>
        <CodeBlock code={`{
  "family": "mural-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "runtimePlatform": { "cpuArchitecture": "X86_64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/muralExecutionRole",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/mural-api:bootstrap",
      "essential": true,
      "readonlyRootFilesystem": true,
      "stopTimeout": 30,
      "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
      "environment": [
        { "name": "PORT", "value": "3000" },
        { "name": "APP_VERSION", "value": "bootstrap" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1"],
        "interval": 15, "timeout": 5, "retries": 3, "startPeriod": 10
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mural-api",
          "awslogs-region": "<REGION>",
          "awslogs-stream-prefix": "api"
        }
      }
    }
  ]
}`} />
        <CodeBlock code={`aws ecs register-task-definition --cli-input-json file://.aws/task-definition.web.json
aws ecs register-task-definition --cli-input-json file://.aws/task-definition.api.json`} />
        <ul className="ds-list">
          <li><em>O volume <code>tmp</code>.</em> Um volume sem <code>host</code> no Fargate é um <i>bind mount</i> no armazenamento efêmero da task: some quando a task para. Ele dá ao nginx o <code>/tmp</code> gravável que o teste local mostrou ser necessário, enquanto o resto do disco continua somente leitura.</li>
          <li><em>Health check com <code>wget</code> e <code>127.0.0.1</code>.</em> As duas imagens são Alpine, que traz o <code>wget</code> do BusyBox e não traz <code>curl</code>. O IP evita a armadilha do <code>localhost</code> → IPv6.</li>
          <li><em>Nomes dos containers.</em> <code>web</code> e <code>api</code> são usados de novo no service (para ligar ao target group) e no workflow (para trocar a imagem). Os três lugares precisam bater.</li>
          <li><em>256 CPU e 512 MB</em> é a menor combinação do Fargate e sobra para os dois. O nginx servindo arquivos estáticos quase não usa CPU.</li>
        </ul>
      </Section>

      <Section id="alb" title={"7. ALB, a regra /api/* e os dois services"}>
        <p>Aqui está o coração do desenho. O ALB tem <b>um</b> listener HTTPS na 443 com o certificado da Cloudflare, e o listener tem <b>regras</b>: cada regra tem uma condição e um destino. As regras são avaliadas da menor prioridade para a maior; se nenhuma bate, vale a <b>ação padrão</b>.</p>
        <Table
          head={["Prioridade", "Condição", "Destino"]}
          rows={[
            ["10", <><code>path-pattern</code> <code>/api/*</code></>, <>target group <code>mural-api</code> (porta 3000)</>],
            ["padrão", "qualquer outro pedido", <>target group <code>mural-web</code> (porta 8080)</>],
          ]}
        />
        <h3>7.1 Certificado no ACM</h3>
        <p>Importe na <b>mesma região do ALB</b>. O ACM exige PEM e chave sem senha. Depois de importar, a chave não precisa ficar no seu disco.</p>
        <CodeBlock code={`CERT_ARN=$(aws acm import-certificate \\
  --certificate fileb://origin.pem --private-key fileb://origin.key \\
  --query CertificateArn --output text)
rm origin.key   # keep a copy only in your password manager, if at all`} />
        <h3>7.2 Dois target groups</h3>
        <p>Um por service, do tipo <code>ip</code> (obrigatório no modo <code>awsvpc</code> do Fargate), falando HTTP com o container. Cada um tem o seu health check, no caminho que o próprio app responde.</p>
        <CodeBlock code={`TG_WEB=$(aws elbv2 create-target-group --name mural-web --target-type ip \\
  --protocol HTTP --port 8080 --vpc-id $VPC_ID \\
  --health-check-path /healthz --health-check-interval-seconds 15 --healthy-threshold-count 2 \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)

TG_API=$(aws elbv2 create-target-group --name mural-api --target-type ip \\
  --protocol HTTP --port 3000 --vpc-id $VPC_ID \\
  --health-check-path /api/health --health-check-interval-seconds 15 --healthy-threshold-count 2 \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)

for TG in $TG_WEB $TG_API; do
  aws elbv2 modify-target-group-attributes --target-group-arn $TG \\
    --attributes Key=deregistration_delay.timeout_seconds,Value=30
done`} />
        <h3>7.3 ALB, listener e a regra</h3>
        <CodeBlock code={`ALB_ARN=$(aws elbv2 create-load-balancer --name mural --type application --scheme internet-facing \\
  --subnets $PUB_A $PUB_B --security-groups $SG_ALB \\
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

# HTTPS listener: Cloudflare origin certificate; default action = front end
LISTENER_ARN=$(aws elbv2 create-listener --load-balancer-arn $ALB_ARN \\
  --protocol HTTPS --port 443 \\
  --certificates CertificateArn=$CERT_ARN --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \\
  --default-actions Type=forward,TargetGroupArn=$TG_WEB \\
  --query 'Listeners[0].ListenerArn' --output text)

# Rule: /api/* goes to the API
aws elbv2 create-rule --listener-arn $LISTENER_ARN --priority 10 \\
  --conditions Field=path-pattern,Values='/api/*' \\
  --actions Type=forward,TargetGroupArn=$TG_API

ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN \\
  --query 'LoadBalancers[0].DNSName' --output text); echo $ALB_DNS`} />
        <ul className="ds-list">
          <li><em><code>/api/*</code> não casa com <code>/api</code>.</em> O padrão exige algo depois da barra. Se o front chamar <code>/api</code> puro, o pedido cai na ação padrão e volta o <code>index.html</code>. O padrão também diferencia maiúsculas: <code>/API/info</code> vai para o front.</li>
          <li><em>Por que o front é o padrão.</em> O front precisa responder qualquer caminho (as rotas do React), e a API só os que começam com <code>/api/</code>. Deixar o caso amplo como padrão e o específico como regra é o mais simples de ler.</li>
          <li><em>Sem listener na 80.</em> O <code>mural-alb</code> nem aceita a porta 80; o redirecionamento para HTTPS é feito pela Cloudflare (seção 3).</li>
        </ul>
        <h3>7.4 Os dois services</h3>
        <CodeBlock code={`aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com   # once per account; ignore "already exists"

svc() {  # $1 = web|api, $2 = target group, $3 = port, $4 = security group
  aws ecs create-service --cluster mural --service-name mural-$1 \\
    --task-definition mural-$1 --desired-count 2 --launch-type FARGATE \\
    --network-configuration "awsvpcConfiguration={subnets=[$PRIV_A,$PRIV_B],securityGroups=[$4],assignPublicIp=DISABLED}" \\
    --load-balancers targetGroupArn=$2,containerName=$1,containerPort=$3 \\
    --health-check-grace-period-seconds 30 \\
    --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200,deploymentCircuitBreaker={enable=true,rollback=true}"
}
svc web $TG_WEB 8080 $SG_WEB
svc api $TG_API 3000 $SG_API

aws ecs wait services-stable --cluster mural --services mural-web mural-api`} />
        <ul className="ds-list">
          <li><em>Duas tasks por service</em>, uma em cada AZ. Uma zona pode cair sem tirar o site do ar, e no deploy as novas sobem antes de as antigas saírem (100/200).</li>
          <li><em>Cada service escala sozinho.</em> Se a API precisar de mais tasks, mude só o <code>desired-count</code> dela (ou ponha auto scaling); o front continua com duas. Essa é a vantagem prática de separar as imagens.</li>
          <li><em>Circuit breaker com rollback.</em> Se as tasks novas não ficarem saudáveis, o ECS volta sozinho para a revisão anterior.</li>
        </ul>
        <h3>7.5 Variante: API num subdomínio</h3>
        <p>Se você escolheu <code>api.example.com</code> na seção 1, troque só a condição da regra, crie o registro DNS <code>api</code> igual aos da seção 8 e ligue o CORS na API. As rotas da API podem então deixar de ter o prefixo <code>/api</code>.</p>
        <CodeBlock code={`aws elbv2 create-rule --listener-arn $LISTENER_ARN --priority 10 \\
  --conditions Field=host-header,Values=api.$DOMAIN \\
  --actions Type=forward,TargetGroupArn=$TG_API`} />
      </Section>

      <Section id="dns" title={"8. DNS na Cloudflare e o caminho de cada pedido"}>
        <ol className="ds-steps">
          <li>Cloudflare → <b>DNS → Records → Add record</b>: tipo <code>CNAME</code>, nome <code>@</code> (a raiz, <code>example.com</code>), destino = o <code>$ALB_DNS</code>, <b>Proxied</b>.</li>
          <li>Mais um <code>CNAME</code>, nome <code>www</code>, mesmo destino, <b>Proxied</b>. Se quiser um endereço só, crie uma <i>Redirect Rule</i> de <code>www.example.com/*</code> para <code>https://example.com/$&#123;1&#125;</code> (301).</li>
        </ol>
        <Callout tone="info" icon="alert"><b>CNAME na raiz?</b> O padrão de DNS não permite CNAME no domínio raiz, e o ALB não tem IP fixo (só um nome). A Cloudflare resolve isso com <i>CNAME flattening</i>: ela aceita o CNAME na raiz e responde ao visitante com os IPs, que de qualquer forma são os dela, por causa do proxy. É uma das vantagens de o DNS estar na Cloudflare; no Route 53 o equivalente é o registro <i>Alias</i>.</Callout>
        <h3>O que acontece quando alguém abre o site</h3>
        <Diagram minWidth={600} caption={"Três pedidos de uma visita. Só o primeiro e o terceiro chegam à AWS; os arquivos com hash ficam no cache da Cloudflare depois da primeira vez."}>
          <svg viewBox="0 0 720 250" role="img" aria-label="Caminho de três pedidos">
            <text x="98" y="22" className="mut" textAnchor="middle">Navegador</text>
            <text x="300" y="22" className="mut" textAnchor="middle">Cloudflare</text>
            <text x="472" y="22" className="mut" textAnchor="middle">ALB</text>
            <text x="630" y="22" className="mut" textAnchor="middle">Service</text>

            <rect x="8" y="36" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="66" className="mono" textAnchor="middle">GET /</text>
            <rect x="220" y="36" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="58" textAnchor="middle">HTML não é cacheado</text>
            <text x="300" y="76" className="mut" textAnchor="middle">repassa ao ALB</text>
            <rect x="412" y="36" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="472" y="66" textAnchor="middle">ação padrão</text>
            <rect x="564" y="36" width="132" height="50" rx="4" className="ln brandfill" />
            <text x="630" y="58" textAnchor="middle">web</text>
            <text x="630" y="76" className="mono mut" textAnchor="middle">index.html</text>
            <path d="M188 61L220 61M380 61L412 61M532 61L564 61" className="ln" />
            <path d="M212.8 64.5L220 61L212.8 57.5M404.8 64.5L412 61L404.8 57.5M556.8 64.5L564 61L556.8 57.5" className="ln" />

            <rect x="8" y="106" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="136" className="mono" textAnchor="middle">GET /assets/index-….js</text>
            <rect x="220" y="106" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="128" textAnchor="middle">cache HIT</text>
            <text x="300" y="146" className="mut" textAnchor="middle">responde da borda</text>
            <rect x="412" y="106" width="284" height="50" rx="4" className="ln dash" />
            <text x="554" y="136" className="mut" textAnchor="middle">não chega à AWS (após o 1º pedido)</text>
            <path d="M188 131L220 131" className="ln" />
            <path d="M212.8 134.5L220 131L212.8 127.5" className="ln" />

            <rect x="8" y="176" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="206" className="mono" textAnchor="middle">GET /api/info</text>
            <rect x="220" y="176" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="198" textAnchor="middle">sem extensão: passa</text>
            <text x="300" y="216" className="mono mut" textAnchor="middle">+ CF-Connecting-IP</text>
            <rect x="412" y="176" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="472" y="206" textAnchor="middle">regra /api/*</text>
            <rect x="564" y="176" width="132" height="50" rx="4" className="ln brandfill" />
            <text x="630" y="198" textAnchor="middle">api</text>
            <text x="630" y="216" className="mono mut" textAnchor="middle">JSON</text>
            <path d="M188 201L220 201M380 201L412 201M532 201L564 201" className="ln" />
            <path d="M212.8 204.5L220 201L212.8 197.5M404.8 204.5L412 201L404.8 197.5M556.8 204.5L564 201L556.8 197.5" className="ln" />
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><em>O cache padrão da Cloudflare</em> decide pela extensão do arquivo: guarda <code>.js</code>, <code>.css</code>, imagens e fontes, e não guarda HTML nem respostas sem extensão como <code>/api/info</code>. Para este desenho o padrão já está certo; você não precisa de nenhuma regra de cache.</li>
          <li><em>Por que isso combina com o nginx.</em> Os arquivos de <code>/assets/</code> mudam de nome a cada build, então um cache longo nunca serve versão velha. O <code>index.html</code> não é guardado, e é ele que aponta para os nomes novos. Resultado: o deploy aparece na hora, sem purgar cache.</li>
        </ul>
        <Callout tone="info" icon="alert"><b>Um passo além: só a <i>sua</i> zona da Cloudflare.</b> A prefix list garante que o tráfego vem da Cloudflare, mas qualquer cliente da Cloudflare poderia apontar o próprio domínio para o seu ALB. Para fechar isso, crie na Cloudflare uma <i>Transform Rule</i> que acrescenta um cabeçalho secreto a todo pedido (por exemplo <code>X-Origin-Auth</code>) e faça as regras do ALB exigirem esse cabeçalho (condição <code>http-header</code>), com a ação padrão devolvendo 403.</Callout>
      </Section>

      <Section id="deploy" title={"9. Deploy das duas imagens"}>
        <p>O workflow é o da <a href="/notas/github-aws-oidc/#workflow">nota de OIDC</a> com uma diferença: uma <b>matrix</b> roda o mesmo job duas vezes, uma para <code>web</code> e outra para <code>api</code>. Cada execução constrói a sua pasta, envia ao seu repositório e atualiza o seu service.</p>
        <Diagram minWidth={600} caption={"Um push, dois jobs em paralelo. Cada service troca as tasks aos poucos: o site não sai do ar."}>
          <svg viewBox="0 0 720 200" role="img" aria-label="Deploy com matrix">
            <rect x="8" y="72" width="104" height="56" rx="4" className="ln fillsoft" />
            <text x="60" y="96" className="mono" textAnchor="middle">git push</text>
            <text x="60" y="114" className="mono mut" textAnchor="middle">main</text>
            <rect x="138" y="72" width="128" height="56" rx="4" className="ln fillsoft" />
            <text x="202" y="96" textAnchor="middle">GitHub Actions</text>
            <text x="202" y="114" className="mono mut" textAnchor="middle">OIDC → role</text>
            <rect x="314" y="18" width="116" height="52" rx="4" className="ln brandfill" />
            <text x="372" y="40" className="mono" textAnchor="middle">job web</text>
            <text x="372" y="58" className="mono mut" textAnchor="middle">build ./web</text>
            <rect x="314" y="130" width="116" height="52" rx="4" className="ln brandfill" />
            <text x="372" y="152" className="mono" textAnchor="middle">job api</text>
            <text x="372" y="170" className="mono mut" textAnchor="middle">build ./api</text>
            <rect x="460" y="18" width="110" height="52" rx="4" className="ln fillsoft" />
            <text x="515" y="40" textAnchor="middle">ECR</text>
            <text x="515" y="58" className="mono mut" textAnchor="middle">mural-web:sha</text>
            <rect x="460" y="130" width="110" height="52" rx="4" className="ln fillsoft" />
            <text x="515" y="152" textAnchor="middle">ECR</text>
            <text x="515" y="170" className="mono mut" textAnchor="middle">mural-api:sha</text>
            <rect x="598" y="18" width="114" height="52" rx="4" className="ln fillsoft" />
            <text x="655" y="40" className="mono" textAnchor="middle">mural-web</text>
            <text x="655" y="58" className="mono mut" textAnchor="middle">rolling</text>
            <rect x="598" y="130" width="114" height="52" rx="4" className="ln fillsoft" />
            <text x="655" y="152" className="mono" textAnchor="middle">mural-api</text>
            <text x="655" y="170" className="mono mut" textAnchor="middle">rolling</text>
            <path d="M112 100L138 100" className="ln" />
            <path d="M130.8 103.5L138 100L130.8 96.5" className="ln" />
            <path d="M266 100L290 100L290 44L314 44M290 100L290 156L314 156" className="ln" />
            <path d="M306.8 47.5L314 44L306.8 40.5M306.8 159.5L314 156L306.8 152.5" className="ln" />
            <path d="M430 44L460 44M430 156L460 156M570 44L598 44M570 156L598 156" className="ln" />
            <path d="M452.8 47.5L460 44L452.8 40.5M452.8 159.5L460 156L452.8 152.5M590.8 47.5L598 44L590.8 40.5M590.8 159.5L598 156L590.8 152.5" className="ln" />
          </svg>
        </Diagram>
        <CodeBlock code={`# .github/workflows/deploy.yml
name: deploy

on:
  push:
    branches: [main]

permissions:
  id-token: write   # OIDC: GitHub proves who it is to AWS, no stored keys
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    strategy:
      fail-fast: false        # a failing web deploy does not cancel the api one
      matrix:
        app: [web, api]
    steps:
      - uses: actions/checkout@v6

      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: \${{ vars.AWS_ROLE_ARN }}
          aws-region: \${{ vars.AWS_REGION }}

      - id: ecr
        uses: aws-actions/amazon-ecr-login@v2

      - id: image
        env:
          IMAGE: \${{ steps.ecr.outputs.registry }}/mural-\${{ matrix.app }}:\${{ github.sha }}
        run: |
          docker build -t "$IMAGE" ./\${{ matrix.app }}
          docker push "$IMAGE"
          echo "image=$IMAGE" >> "$GITHUB_OUTPUT"

      - id: taskdef
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: .aws/task-definition.\${{ matrix.app }}.json
          container-name: \${{ matrix.app }}
          image: \${{ steps.image.outputs.image }}
          environment-variables: APP_VERSION=\${{ github.sha }}

      - uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: \${{ steps.taskdef.outputs.task-definition }}
          cluster: mural
          service: mural-\${{ matrix.app }}
          wait-for-service-stability: true`} />
        <ul className="ds-list">
          <li><em>Pré-requisitos.</em> O provedor OIDC e a role de deploy (com <code>iam:PassRole</code> para a <code>muralExecutionRole</code>) vêm das etapas 1 e 2 da <a href="/notas/github-aws-oidc/">nota de OIDC</a>; as variáveis <code>AWS_ROLE_ARN</code> e <code>AWS_REGION</code> ficam no environment <code>production</code> do GitHub. A política da role precisa cobrir os <b>dois</b> repositórios do ECR e os <b>dois</b> services.</li>
          <li><em><code>APP_VERSION</code> com o SHA.</em> A action de render acrescenta a variável ao container; abrindo o site você vê qual commit está no ar. No nginx a variável existe mas não é usada, o que não faz mal.</li>
          <li><em>Só o que mudou.</em> Este workflow publica as duas imagens a cada push, o que é simples e previsível. Se os builds ficarem lentos, filtre por pasta (por exemplo, com dois workflows e <code>on.push.paths</code>: <code>web/**</code> e <code>api/**</code>).</li>
        </ul>
        <Callout tone="warn" icon="alert"><b>Front e back não trocam no mesmo instante.</b> Os dois services fazem deploy em paralelo, cada um no seu ritmo; por alguns minutos o front novo pode falar com a API velha, ou o contrário. Mudanças na API precisam ser <b>compatíveis com a versão anterior</b>: acrescente campos e rotas novos primeiro, passe o front a usá-los num deploy seguinte, e só depois remova o que ficou velho. É a mesma ideia de <i>expand and contract</i> da <a href="/notas/db-migrations/">nota de migrações</a>.</Callout>
      </Section>

      <Section id="verify" title={"10. Conferir e diagnosticar"}>
        <CodeBlock code={`# 1) both services stable, all targets healthy
aws ecs describe-services --cluster mural --services mural-web mural-api \\
  --query 'services[].{name:serviceName,running:runningCount,desired:desiredCount}'
for TG in $TG_WEB $TG_API; do
  aws elbv2 describe-target-health --target-group-arn $TG --query 'TargetHealthDescriptions[].TargetHealth.State'
done

# 2) through Cloudflare, end to end
curl -sI https://$DOMAIN/ | grep -i 'cache-control\\|cf-cache-status'   # no-cache, DYNAMIC
curl -s  https://$DOMAIN/api/info                                     # JSON; "task" alternates between 2 values
curl -s -o /dev/null -w '%{http_code}\\n' https://$DOMAIN/some/react/route   # 200

# 3) negative tests: both must FAIL or redirect
curl -m 8 -k https://$ALB_DNS/                # times out: the ALB only accepts Cloudflare
curl -sI http://$DOMAIN/ | head -1            # 301 to https, done by Cloudflare

# 4) logs
aws logs tail /ecs/mural-api --since 10m
aws logs tail /ecs/mural-web --since 10m`} />
        <Table
          head={["Sintoma", "Causa provável"]}
          rows={[
            [<>A página abre, mas o <code>fetch('/api/info')</code> recebe HTML em vez de JSON (<code>Unexpected token '&lt;'</code>)</>, <>A regra <code>/api/*</code> não existe ou não está no listener 443, e o pedido caiu na ação padrão (o nginx devolveu o <code>index.html</code>). Confira com <code>aws elbv2 describe-rules --listener-arn $LISTENER_ARN</code>.</>],
            [<><code>/api/info</code> responde <code>{'{"error":"not found"}'}</code></>, <>A regra funciona, mas o código da API registrou as rotas sem o prefixo <code>/api</code>. O ALB repassa o caminho inteiro.</>],
            [<>F5 numa rota do React dá 404</>, <>Falta o <code>try_files $uri $uri/ /index.html</code> no <code>nginx.conf</code>.</>],
            ["Depois do deploy, alguns visitantes ainda veem o front antigo", <>O <code>index.html</code> está sendo guardado em cache (no navegador ou por uma <i>Cache Rule</i> “Cache Everything” na Cloudflare). Ele precisa de <code>no-cache</code>; só <code>/assets/</code> pode ter cache longo.</>],
            [<>Task do <code>web</code> para logo ao iniciar; log: <code>Read-only file system</code></>, <>Falta o volume <code>tmp</code> montado em <code>/tmp</code> na task definition.</>],
            [<>Task <i>unhealthy</i> no ECS, mas o app parece funcionar</>, <>O health check do container usa <code>localhost</code> e caiu no IPv6, ou usa <code>curl</code>, que não existe na imagem Alpine. Use <code>wget</code> e <code>127.0.0.1</code>.</>],
            [<>Cloudflare <b>502</b>; ALB 502/503</>, <>O target group daquele caminho não tem target saudável: porta ou caminho de health check errados, ou o SG do service não aceita a porta vinda do <code>mural-alb</code>.</>],
            [<>Cloudflare <b>521</b> ou <b>522</b></>, "O SG do ALB não tem os IPs da Cloudflare na 443, ou o listener 443 não existe."],
            [<>Cloudflare <b>525</b> ou <b>526</b></>, "O listener não usa o certificado de origem, o certificado não cobre o hostname (raiz e www), ou ele venceu."],
            [<><code>CannotPullContainerError</code> ou <code>exec format error</code></>, <>Faltam os endpoints <code>ecr.api</code>/<code>ecr.dkr</code>/<code>s3</code>, a tag não existe, ou a imagem foi construída para ARM.</>],
            [<>Erro de CORS no console (só na variante com subdomínio)</>, <>A API não devolve <code>Access-Control-Allow-Origin: https://example.com</code> ou não responde ao <code>OPTIONS</code>.</>],
          ]}
        />
        <Callout tone="personal" icon="alert"><b>Nota pessoal:</b> as linhas sobre HTML no lugar de JSON, <code>Read-only file system</code> e <code>localhost</code> → IPv6 foram reproduzidas localmente com as imagens desta nota. As outras causas são o meu diagnóstico a partir das documentações, não uma lista oficial.</Callout>
      </Section>

      <Section id="cleanup" title={"11. Apagar tudo"}>
        <p>Na ordem inversa das dependências, para nada ficar preso e nada continuar cobrando por hora:</p>
        <CodeBlock code={`# Cloudflare: delete the @ and www records (dashboard). GitHub: disable the workflow.

for APP in web api; do
  aws ecs update-service --cluster mural --service mural-$APP --desired-count 0
  aws ecs delete-service --cluster mural --service mural-$APP --force
done
aws ecs delete-cluster --cluster mural

aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN       # takes the listener and rule with it
aws elbv2 wait load-balancers-deleted --load-balancer-arns $ALB_ARN
aws elbv2 delete-target-group --target-group-arn $TG_WEB
aws elbv2 delete-target-group --target-group-arn $TG_API
aws acm delete-certificate --certificate-arn $CERT_ARN

for APP in web api; do
  aws ecr delete-repository --repository-name mural-$APP --force
  aws logs delete-log-group --log-group-name /ecs/mural-$APP
done
# then: deregister the task definitions, delete muralExecutionRole,
# the VPC endpoints, the security groups, the prefix list and the VPC (in that order)`} />
        <Callout tone="personal" icon="alert"><b>Nota pessoal, sobre o que foi testado:</b> o código, as duas imagens, o <code>compose.yaml</code> com o “ALB” local, os cabeçalhos de cache, o fallback do React, o <code>wget</code> dos health checks e a parada com <code>SIGTERM</code> foram executados nesta máquina (Docker 29, Node 22, Vite 7, nginx 1.29). Os comandos <code>aws</code>, as task definitions e o workflow seguem as documentações abaixo e o padrão das notas vizinhas, mas <b>não foram executados contra uma conta AWS</b> para escrever esta nota.</Callout>
        <Sources title={"Fontes oficiais"}>
          <ul>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html">AWS Docs · ALB: Listener rules (priority order, default action)</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-condition-types.html">AWS Docs · ALB: Rule condition types (path-pattern, host-header, http-header)</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html">AWS Docs · ALB: Target groups (ip target type, health checks)</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html">AWS Docs · ALB: Create an HTTPS listener (security policies, certificates)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html">AWS Docs · ECS: Use an Application Load Balancer (one target group per service)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html">AWS Docs · ECS: Task definition parameters (readonlyRootFilesystem, healthCheck, stopTimeout)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bind-mounts.html">AWS Docs · ECS: Bind mounts (ephemeral volumes on Fargate)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html">AWS Docs · ECS: Task execution IAM role</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/vpc-endpoints.html">AWS Docs · ECS: Interface VPC endpoints</a></li>
            <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/import-certificate-prerequisites.html">AWS Docs · ACM: Prerequisites for importing certificates</a></li>
            <li><a href="https://developers.cloudflare.com/registrar/">Cloudflare Docs · Registrar</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/">Cloudflare Docs · SSL mode Full (strict)</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/">Cloudflare Docs · Origin CA certificates</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/">Cloudflare Docs · Always Use HTTPS</a></li>
            <li><a href="https://developers.cloudflare.com/dns/cname-flattening/">Cloudflare Docs · CNAME flattening</a></li>
            <li><a href="https://developers.cloudflare.com/cache/concepts/default-cache-behavior/">Cloudflare Docs · Default cache behavior (cached file extensions)</a></li>
            <li><a href="https://developers.cloudflare.com/fundamentals/reference/http-headers/">Cloudflare Docs · HTTP headers (CF-Connecting-IP, X-Forwarded-For)</a></li>
            <li><a href="https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/">Cloudflare Docs · Cloudflare IP addresses</a></li>
            <li><a href="https://developers.cloudflare.com/rules/transform/request-header-modification/">Cloudflare Docs · Request header Transform Rules</a></li>
            <li><a href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/">Cloudflare Docs · 5xx errors</a></li>
            <li><a href="https://vite.dev/config/server-options#server-proxy">Vite Docs · server.proxy</a></li>
            <li><a href="https://hub.docker.com/r/nginxinc/nginx-unprivileged">Docker Hub · nginxinc/nginx-unprivileged</a></li>
            <li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files">nginx Docs · try_files</a></li>
            <li><a href="https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs">GitHub Docs · Using a matrix for your jobs</a></li>
            <li><a href="https://github.com/aws-actions/amazon-ecs-render-task-definition">GitHub · aws-actions/amazon-ecs-render-task-definition (environment-variables input)</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
