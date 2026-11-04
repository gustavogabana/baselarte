import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "front-back-ecs-cloudflare",
  title: { en: "Front and back on AWS: two Docker images behind one ALB and Cloudflare", pt: "Front e back na AWS: duas imagens Docker atrás de um ALB e da Cloudflare" },
  seo: {
    title: { en: "Front end and back end on AWS ECS with a Cloudflare domain and origin certificate", pt: "Front-end e back-end no AWS ECS com domínio e certificado de origem da Cloudflare" },
    description: { en: "Step by step: a React front end (nginx) and a Node API as two Docker images on ECS Fargate, one ALB routing /api/* to the back end, the domain bought at Cloudflare and the Cloudflare origin certificate imported into ACM.", pt: "Passo a passo: um front-end React (nginx) e uma API Node como duas imagens Docker no ECS Fargate, um ALB que manda /api/* para o back-end, o domínio comprado na Cloudflare e o certificado de origem da Cloudflare importado no ACM." },
  },
  summary: "deploying a front end and a back end as two Docker images on AWS ECS Fargate: path-based routing on one ALB (/api/* to the API, everything else to nginx serving a Vite/React build), same-origin calls with no CORS, a domain registered at Cloudflare with proxied DNS and CNAME flattening, Full (strict) SSL with a Cloudflare origin certificate imported into ACM, security groups that only accept Cloudflare, caching rules for hashed assets and index.html, a GitHub Actions matrix that deploys each image, and a troubleshooting table. The images and the local routing were run; the AWS commands were not run against an account.",
  kicker: { en: "AWS · Cloudflare", pt: "AWS · Cloudflare" },
  heroTitle: { en: <>Front and back on AWS: <em>two images, one ALB, one domain.</em></>, pt: <>Front e back na AWS: <em>duas imagens, um ALB, um domínio.</em></> },
  heroLede: { en: "A React front end served by nginx and a Node API, each in its own Docker image on ECS Fargate, behind a single load balancer that splits traffic by path. The domain was bought at Cloudflare, which also issues the certificate the ALB uses.", pt: "Um front-end React servido pelo nginx e uma API em Node, cada um na sua imagem Docker no ECS Fargate, atrás de um único load balancer que divide o tráfego pelo caminho. O domínio foi comprado na Cloudflare, que também emite o certificado que o ALB usa." },
  published: "2026-11-03",
  updated: "2026-11-03",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="O desenho" en="The design" /> },
        { id: "routing", title: <T pt="1. Caminho ou subdomínio?" en="1. Path or subdomain?" /> },
        { id: "project", title: <T pt="2. O projeto e as duas imagens" en="2. The project and its two images" /> },
        { id: "cloudflare", title: <T pt="3. Cloudflare: SSL e certificado" en="3. Cloudflare: SSL and certificate" /> },
        { id: "network", title: <T pt="4. Rede e security groups" en="4. Network and security groups" /> },
        { id: "ecr", title: <T pt="5. Dois repositórios no ECR" en="5. Two ECR repositories" /> },
        { id: "tasks", title: <T pt="6. Roles e task definitions" en="6. Roles and task definitions" /> },
        { id: "alb", title: <T pt="7. ALB, regras e services" en="7. ALB, rules and services" /> },
        { id: "dns", title: <T pt="8. DNS e o caminho de cada pedido" en="8. DNS and each request's path" /> },
        { id: "deploy", title: <T pt="9. Deploy das duas imagens" en="9. Deploying both images" /> },
        { id: "verify", title: <T pt="10. Conferir e diagnosticar" en="10. Checking and troubleshooting" /> },
        { id: "cleanup", title: <T pt="11. Apagar tudo" en="11. Deleting everything" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={<T pt="O desenho" en="The design" />}>
        <p><T pt={<>A ideia é simples: o site tem duas partes que mudam em ritmos diferentes. O <b>front</b> são arquivos estáticos (HTML, JS, CSS) que o navegador baixa; o <b>back</b> é um processo que responde JSON. Cada parte vira uma imagem Docker, cada imagem vira um <i>service</i> no ECS, e um único <b>ALB</b> decide, pelo caminho da URL, para qual delas mandar cada pedido. A Cloudflare fica na frente de tudo: é onde o domínio foi comprado, onde mora o DNS e quem emite o certificado que o ALB apresenta.</>} en={<>The idea is simple: the site has two parts that change at different paces. The <b>front end</b> is static files (HTML, JS, CSS) the browser downloads; the <b>back end</b> is a process that answers JSON. Each part becomes a Docker image, each image becomes an ECS <i>service</i>, and a single <b>ALB</b> decides, by the URL path, which one gets each request. Cloudflare sits in front of everything: it is where the domain was bought, where DNS lives and who issues the certificate the ALB presents.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="Um domínio, um ALB, dois services. O ALB olha o caminho: /api/* vai para a API, o resto vai para o nginx com o build do React." en="One domain, one ALB, two services. The ALB looks at the path: /api/* goes to the API, everything else goes to nginx with the React build." />}>
          <svg viewBox="0 0 720 320" role="img" aria-label="Cloudflare, ALB e dois services / Cloudflare, ALB and two services">
            <rect x="282" y="10" width="430" height="300" rx="6" className="ln dash" />
            <text x="296" y="30" className="pt mut" textAnchor="start">sua conta AWS · VPC</text>
            <text x="296" y="30" className="en mut" textAnchor="start">your AWS account · VPC</text>
            <rect x="8" y="122" width="104" height="60" rx="4" className="ln fillsoft" />
            <text x="60" y="148" className="pt" textAnchor="middle">Visitante</text>
            <text x="60" y="148" className="en" textAnchor="middle">Visitor</text>
            <text x="60" y="167" className="mono mut" textAnchor="middle">example.com</text>
            <rect x="138" y="122" width="122" height="60" rx="4" className="ln brandfill" />
            <text x="199" y="148" textAnchor="middle">Cloudflare</text>
            <text x="199" y="167" className="mut" textAnchor="middle">DNS · proxy</text>
            <rect x="302" y="106" width="140" height="92" rx="4" className="ln fillsoft" />
            <text x="372" y="130" textAnchor="middle">ALB :443</text>
            <text x="372" y="150" className="pt mut" textAnchor="middle">cert. de origem (ACM)</text>
            <text x="372" y="150" className="en mut" textAnchor="middle">origin cert (ACM)</text>
            <text x="372" y="170" className="mono mut" textAnchor="middle">/api/* → api</text>
            <text x="372" y="187" className="mono mut" textAnchor="middle">padrão → web</text>
            <text x="372" y="230" className="pt mut" textAnchor="middle">subnets públicas</text>
            <text x="372" y="230" className="en mut" textAnchor="middle">public subnets</text>
            <rect x="528" y="44" width="172" height="66" rx="4" className="ln brandfill" />
            <text x="614" y="70" textAnchor="middle">web · nginx :8080</text>
            <text x="614" y="90" className="pt mut" textAnchor="middle">2 tasks · build do React</text>
            <text x="614" y="90" className="en mut" textAnchor="middle">2 tasks · React build</text>
            <rect x="528" y="194" width="172" height="66" rx="4" className="ln brandfill" />
            <text x="614" y="220" textAnchor="middle">api · Node :3000</text>
            <text x="614" y="240" className="pt mut" textAnchor="middle">2 tasks · JSON</text>
            <text x="614" y="240" className="en mut" textAnchor="middle">2 tasks · JSON</text>
            <text x="614" y="290" className="pt mut" textAnchor="middle">subnets privadas</text>
            <text x="614" y="290" className="en mut" textAnchor="middle">private subnets</text>
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
          head={[<T pt="Trecho" en="Leg" />, <T pt="Quem apresenta o certificado" en="Who presents the certificate" />, <T pt="Quem confere" en="Who checks it" />]}
          rows={[
            [<T pt="1 · navegador → Cloudflare" en="1 · browser → Cloudflare" />, <T pt="Cloudflare (Universal SSL, automático e gratuito)" en="Cloudflare (Universal SSL, automatic and free)" />, <T pt="O navegador" en="The browser" />],
            [<T pt="2 · Cloudflare → ALB" en="2 · Cloudflare → ALB" />, <T pt="ALB, com o certificado de origem da Cloudflare importado no ACM" en="The ALB, with the Cloudflare origin certificate imported into ACM" />, <T pt="A Cloudflare, no modo Full (strict)" en="Cloudflare, in Full (strict) mode" />],
            [<T pt="3 · ALB → containers" en="3 · ALB → containers" />, <T pt="Ninguém: HTTP dentro da VPC (veja a callout abaixo)" en="Nobody: HTTP inside the VPC (see the callout below)" />, <T pt="—" en="—" />],
          ]}
        />
        <Callout tone="use" icon="check"><T pt={<><b>Por que HTTP no trecho 3.</b> O ALB termina o TLS e fala HTTP com os containers. É o desenho mais comum e o mais simples: os containers não guardam chave privada e o certificado se renova num lugar só. Se você precisa de criptografia também dentro da VPC (conformidade, defesa em profundidade), a <a href="/notas/ecs-todo-app/#tls">nota do ECS do zero</a> mostra como levar o mesmo certificado até o container.</>} en={<><b>Why HTTP on leg 3.</b> The ALB terminates TLS and speaks HTTP to the containers. It is the most common design and the simplest: the containers hold no private key and the certificate is renewed in one place. If you also need encryption inside the VPC (compliance, defense in depth), the <a href="/notas/ecs-todo-app/#tls">ECS from zero note</a> shows how to carry the same certificate into the container.</>} /></Callout>
        <h3><T pt="O roteiro" en="The route" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><b>Decidir e construir (seções 1 e 2).</b> Caminho ou subdomínio, o código de exemplo, as duas imagens e um teste local que imita o ALB.</>} en={<><b>Decide and build (sections 1 and 2).</b> Path or subdomain, the example code, both images and a local test that imitates the ALB.</>} /></li>
          <li><T pt={<><b>Fundação (3 a 5).</b> Certificado na Cloudflare, rede na AWS e os dois repositórios de imagens.</>} en={<><b>Foundation (3 to 5).</b> Certificate at Cloudflare, network on AWS and the two image repositories.</>} /></li>
          <li><T pt={<><b>No ar (6 a 8).</b> Task definitions, ALB com a regra <code>/api/*</code>, dois services e o DNS apontando para o ALB.</>} en={<><b>Live (6 to 8).</b> Task definitions, ALB with the <code>/api/*</code> rule, two services and DNS pointing at the ALB.</>} /></li>
          <li><T pt={<><b>Rotina (9 a 11).</b> Deploy automático das duas imagens, diagnóstico e limpeza.</>} en={<><b>Routine (9 to 11).</b> Automatic deploy of both images, troubleshooting and cleanup.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<><b>Custo.</b> O ALB, as tasks Fargate e os endpoints de VPC cobram por hora enquanto existirem, mesmo sem visitas. Um ALB só para os dois services já é a economia principal deste desenho (são dois apps, mas um load balancer). Ao terminar de estudar, siga a <a href="#cleanup">seção 11</a>.</>} en={<><b>Cost.</b> The ALB, the Fargate tasks and the VPC endpoints bill by the hour while they exist, even with no visitors. A single ALB for both services is already the main saving in this design (two apps, one load balancer). When you finish studying, follow <a href="#cleanup">section 11</a>.</>} /></Callout>
        <Callout tone="use" icon="check"><T pt={<><b>Notas vizinhas.</b> Compra do domínio e painel da Cloudflare na <a href="/notas/cloudflare/">nota da Cloudflare</a>; VPC, security groups e prefix lists na <a href="/notas/aws/">nota de AWS</a>; Dockerfile e imagens na <a href="/notas/docker/">nota de Docker</a>; GitHub entrando na AWS sem chaves na <a href="/notas/github-aws-oidc/">nota de OIDC</a>; banco RDS e segredos na <a href="/notas/ecs-todo-app/">nota do ECS do zero</a>. Esta nota junta as peças para o caso de dois containers.</>} en={<><b>Neighbouring notes.</b> Buying the domain and the Cloudflare dashboard in the <a href="/notas/cloudflare/">Cloudflare note</a>; VPC, security groups and prefix lists in the <a href="/notas/aws/">AWS note</a>; Dockerfiles and images in the <a href="/notas/docker/">Docker note</a>; GitHub signing in to AWS without keys in the <a href="/notas/github-aws-oidc/">OIDC note</a>; RDS database and secrets in the <a href="/notas/ecs-todo-app/">ECS from zero note</a>. This note puts the pieces together for the two-container case.</>} /></Callout>
      </Section>

      <Section id="routing" title={<T pt="1. Caminho ou subdomínio?" en="1. Path or subdomain?" />}>
        <p><T pt={<>Antes de criar qualquer coisa, decida como o navegador vai chegar na API. Há duas formas de dividir o tráfego no ALB, e a escolha muda o código do front:</>} en={<>Before creating anything, decide how the browser will reach the API. There are two ways to split traffic on the ALB, and the choice changes the front-end code:</>} /></p>
        <Table
          head={[<T pt="" en="" />, <T pt={<><b>Por caminho</b> (esta nota)</>} en={<><b>By path</b> (this note)</>} />, <T pt={<><b>Por subdomínio</b></>} en={<><b>By subdomain</b></>} />]}
          rows={[
            [<T pt="URLs" en="URLs" />, <T pt={<><code>example.com/</code> e <code>example.com/api/...</code></>} en={<><code>example.com/</code> and <code>example.com/api/...</code></>} />, <T pt={<><code>example.com</code> e <code>api.example.com</code></>} en={<><code>example.com</code> and <code>api.example.com</code></>} />],
            [<T pt="Condição da regra no ALB" en="ALB rule condition" />, <T pt={<><code>path-pattern</code> = <code>/api/*</code></>} en={<><code>path-pattern</code> = <code>/api/*</code></>} />, <T pt={<><code>host-header</code> = <code>api.example.com</code></>} en={<><code>host-header</code> = <code>api.example.com</code></>} />],
            [<T pt="CORS" en="CORS" />, <T pt="Não existe: é a mesma origem" en="Does not exist: same origin" />, <T pt={<>Obrigatório: a API precisa responder <code>Access-Control-Allow-Origin</code> e tratar o <code>OPTIONS</code> (preflight)</>} en={<>Required: the API must answer <code>Access-Control-Allow-Origin</code> and handle <code>OPTIONS</code> (preflight)</>} />],
            [<T pt="Cookies de sessão" en="Session cookies" />, <T pt="Funcionam sem configuração extra" en="Work with no extra setup" />, <T pt={<>Precisam de <code>Domain=example.com</code> e <code>credentials: 'include'</code> no fetch</>} en={<>Need <code>Domain=example.com</code> and <code>credentials: 'include'</code> in fetch</>} />],
            [<T pt="URL da API no build do front" en="API URL in the front-end build" />, <T pt={<>Nenhuma: o código chama <code>/api/...</code> (relativo)</>} en={<>None: the code calls <code>/api/...</code> (relative)</>} />, <T pt={<>Uma variável de build (<code>VITE_API_URL</code>), e uma imagem diferente por ambiente</>} en={<>A build variable (<code>VITE_API_URL</code>), and a different image per environment</>} />],
            [<T pt="Exigência no código da API" en="Requirement on the API code" />, <T pt={<>As rotas começam com <code>/api</code> (o ALB repassa o caminho inteiro)</>} en={<>Routes start with <code>/api</code> (the ALB forwards the full path)</>} />, <T pt="Nenhuma" en="None" />],
            [<T pt="Quando escolher" en="When to choose it" />, <T pt="Um site e a sua própria API: o caso comum" en="A site and its own API: the common case" />, <T pt="A API é pública e usada por outros clientes (app mobile, parceiros)" en="The API is public and used by other clients (mobile app, partners)" />],
          ]}
        />
        <p><T pt={<>Esta nota segue <b>por caminho</b>. A variante por subdomínio é a mesma montagem com uma linha diferente na regra do ALB e um registro DNS a mais; ela aparece no fim da <a href="#alb">seção 7</a>.</>} en={<>This note goes <b>by path</b>. The subdomain variant is the same setup with one different line in the ALB rule and one more DNS record; it shows up at the end of <a href="#alb">section 7</a>.</>} /></p>
        <Callout tone="info" icon="alert"><T pt={<><b>E se o front não usasse container?</b> Um front que é só arquivo estático pode ir para o S3 com CloudFront, ou para o Cloudflare Pages, e custar quase nada. A imagem com nginx faz sentido quando você quer o mesmo fluxo de deploy para as duas partes, versionar front e back juntos, ou quando o front tem servidor (SSR). É o caso desta nota.</>} en={<><b>What if the front end did not use a container?</b> A front end that is only static files can go to S3 with CloudFront, or to Cloudflare Pages, and cost almost nothing. The nginx image makes sense when you want the same deploy flow for both parts, to version front and back together, or when the front end has a server (SSR). That is the case in this note.</>} /></Callout>
      </Section>

      <Section id="project" title={<T pt="2. O projeto e as duas imagens" en="2. The project and its two images" />}>
        <p><T pt={<>Um repositório, duas pastas, uma imagem por pasta. A API é de propósito <b>sem estado</b> (não tem banco): ela diz qual task respondeu, o que deixa visível o ALB dividindo o tráfego. Para pôr um Postgres atrás dela, siga a <a href="/notas/ecs-todo-app/#data">seção de RDS da nota do ECS</a>.</>} en={<>One repository, two folders, one image per folder. The API is <b>stateless</b> on purpose (no database): it says which task answered, which makes the ALB splitting traffic visible. To put Postgres behind it, follow the <a href="/notas/ecs-todo-app/#data">RDS section of the ECS note</a>.</>} /></p>
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

        <h3><T pt="2.1 A API (back)" en="2.1 The API (back end)" /></h3>
        <p><T pt={<>Node puro, sem dependências. Repare que <b>toda rota começa com <code>/api</code></b>: o ALB não remove o prefixo, ele entrega <code>/api/info</code> do jeito que chegou.</>} en={<>Plain Node, no dependencies. Note that <b>every route starts with <code>/api</code></b>: the ALB does not strip the prefix, it delivers <code>/api/info</code> as it arrived.</>} /></p>
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
          <li><T pt={<><em><code>cache-control: no-store</code> em toda resposta.</em> A Cloudflare já não guarda JSON por padrão, mas o cabeçalho deixa a intenção explícita para qualquer cache no caminho.</>} en={<><em><code>cache-control: no-store</code> on every response.</em> Cloudflare already does not store JSON by default, but the header makes the intent explicit to any cache on the way.</>} /></li>
          <li><T pt={<><em><code>cf-connecting-ip</code>.</em> Atrás de Cloudflare e ALB, o IP da conexão é o do ALB e o primeiro do <code>X-Forwarded-For</code> é o da Cloudflare. O IP do visitante vem nesse cabeçalho, que o ALB repassa intacto.</>} en={<><em><code>cf-connecting-ip</code>.</em> Behind Cloudflare and the ALB, the connection's IP is the ALB's and the first in <code>X-Forwarded-For</code> is Cloudflare's. The visitor's IP comes in this header, which the ALB passes through untouched.</>} /></li>
          <li><T pt={<><em>Parada limpa.</em> No deploy o ECS manda <code>SIGTERM</code>; o servidor para de aceitar conexões e sai. Medido localmente: <code>docker compose stop api</code> levou 0,5 s, em vez dos 10 s do timeout do Docker.</>} en={<><em>Clean stop.</em> On deploy ECS sends <code>SIGTERM</code>; the server stops accepting connections and exits. Measured locally: <code>docker compose stop api</code> took 0.5 s, instead of Docker's 10 s timeout.</>} /></li>
        </ul>

        <h3><T pt="2.2 O front (React + Vite, servido pelo nginx)" en="2.2 The front end (React + Vite, served by nginx)" /></h3>
        <p><T pt={<>O ponto central: o front chama <b><code>/api/info</code>, um caminho relativo</b>. Em produção o navegador manda para o mesmo domínio da página, e o ALB encaminha para a API. Em desenvolvimento, o proxy do Vite faz o mesmo papel. A mesma imagem do front serve para dev, homologação e produção, porque ela não carrega nenhuma URL de API.</>} en={<>The key point: the front end calls <b><code>/api/info</code>, a relative path</b>. In production the browser sends it to the page's own domain and the ALB forwards it to the API. In development, Vite's proxy plays the same role. The same front-end image serves dev, staging and production, because it carries no API URL.</>} /></p>
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
        <p><T pt={<>O <code>index.html</code> é o padrão do Vite (um <code>&lt;div id="root"&gt;</code> e o <code>&lt;script type="module" src="/src/main.jsx"&gt;</code>), e o <code>package.json</code> tem <code>react</code>, <code>react-dom</code>, <code>vite</code> e <code>@vitejs/plugin-react</code>. Rode <code>npm install</code> uma vez e versione o <code>package-lock.json</code>: o <code>npm ci</code> do Dockerfile exige esse arquivo.</>} en={<>The <code>index.html</code> is Vite's default (a <code>&lt;div id="root"&gt;</code> and the <code>&lt;script type="module" src="/src/main.jsx"&gt;</code>), and <code>package.json</code> lists <code>react</code>, <code>react-dom</code>, <code>vite</code> and <code>@vitejs/plugin-react</code>. Run <code>npm install</code> once and commit <code>package-lock.json</code>: the Dockerfile's <code>npm ci</code> requires it.</>} /></p>
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
          <li><T pt={<><em>Dois estágios.</em> O Node só existe para gerar o <code>dist/</code>; a imagem final tem apenas nginx e os arquivos. Medido: <b>82 MB</b> para o front contra <b>239 MB</b> da API (que precisa do Node para rodar).</>} en={<><em>Two stages.</em> Node only exists to produce <code>dist/</code>; the final image has only nginx and the files. Measured: <b>82 MB</b> for the front end against <b>239 MB</b> for the API (which needs Node to run).</>} /></li>
          <li><T pt={<><em><code>nginx-unprivileged</code>.</em> Roda como o usuário <code>nginx</code> (uid 101), não como root, e por isso escuta na 8080 (portas abaixo de 1024 exigem root).</>} en={<><em><code>nginx-unprivileged</code>.</em> Runs as the <code>nginx</code> user (uid 101), not root, and so listens on 8080 (ports below 1024 require root).</>} /></li>
          <li><T pt={<><em><code>try_files ... /index.html</code>.</em> Sem essa linha, abrir <code>example.com/perfil</code> direto (ou dar F5 nela) dá 404, porque não existe arquivo <code>perfil</code>: quem conhece essa rota é o React, no navegador.</>} en={<><em><code>try_files ... /index.html</code>.</em> Without this line, opening <code>example.com/profile</code> directly (or refreshing it) gives a 404, because there is no <code>profile</code> file: the route is known only to React, in the browser.</>} /></li>
          <li><T pt={<><em>Duas regras de cache.</em> Os arquivos em <code>/assets/</code> têm hash no nome (<code>index-ChZJ-1oU.js</code>): um conteúdo novo gera um nome novo, então podem ficar em cache por um ano. O <code>index.html</code> fica com <code>no-cache</code>, para que cada deploy chegue ao visitante na hora.</>} en={<><em>Two cache rules.</em> Files in <code>/assets/</code> have a hash in their name (<code>index-ChZJ-1oU.js</code>): new content means a new name, so they can be cached for a year. <code>index.html</code> gets <code>no-cache</code>, so each deploy reaches visitors right away.</>} /></li>
        </ul>
        <p><T pt={<>Os dois projetos levam um <code>.dockerignore</code> com <code>node_modules</code>, <code>dist</code>, <code>.git</code>, <code>.env</code> e <code>*.key</code>, para que nada local nem segredo entre na imagem.</>} en={<>Both projects get a <code>.dockerignore</code> with <code>node_modules</code>, <code>dist</code>, <code>.git</code>, <code>.env</code> and <code>*.key</code>, so nothing local and no secret goes into the image.</>} /></p>

        <h3><T pt="2.3 Testar localmente, com um “ALB” de mentira" en="2.3 Test locally, with a fake “ALB”" /></h3>
        <p><T pt={<>Antes de pagar por um ALB, imite as regras dele com um nginx na frente das duas imagens. Se funcionar aqui, as regras na AWS são a tradução direta. Os <code>read_only</code> imitam o <code>readonlyRootFilesystem</code> que a task definition vai usar.</>} en={<>Before paying for an ALB, imitate its rules with an nginx in front of both images. If it works here, the AWS rules are a direct translation. The <code>read_only</code> flags imitate the <code>readonlyRootFilesystem</code> the task definition will use.</>} /></p>
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
        <p><T pt={<>Resultado desta execução: <code>/</code> devolveu o HTML com <code>Cache-Control: no-cache</code>; <code>/assets/index-ChZJ-1oU.js</code> veio com <code>public, max-age=31536000, immutable</code>; uma rota inventada devolveu 200 com o <code>index.html</code>; <code>/assets/nao-existe.js</code> deu 404 (e não o HTML, que quebraria o navegador com um erro confuso); e <code>/api/info</code> respondeu o JSON com o IP do cabeçalho.</>} en={<>Results from this run: <code>/</code> returned the HTML with <code>Cache-Control: no-cache</code>; <code>/assets/index-ChZJ-1oU.js</code> came with <code>public, max-age=31536000, immutable</code>; a made-up route returned 200 with <code>index.html</code>; <code>/assets/missing.js</code> gave 404 (not the HTML, which would break the browser with a confusing error); and <code>/api/info</code> answered the JSON with the header's IP.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><b>Duas armadilhas que apareceram no teste.</b> (1) Sem o <code>tmpfs: [/tmp]</code>, o nginx não sobe com o disco somente leitura: <code>mkdir() "/tmp/proxy_temp" failed (30: Read-only file system)</code>. No Fargate a solução é um volume montado em <code>/tmp</code> (seção 6). (2) Dentro do container do nginx, <code>wget http://localhost:8080/healthz</code> deu <i>Connection refused</i>: <code>localhost</code> resolveu para o IPv6 <code>::1</code>, e o nginx só escuta em IPv4. Com <code>127.0.0.1</code> funcionou. Por isso os health checks da seção 6 usam o IP, não o nome.</>} en={<><b>Two traps that showed up in testing.</b> (1) Without <code>tmpfs: [/tmp]</code>, nginx does not start with a read-only disk: <code>mkdir() "/tmp/proxy_temp" failed (30: Read-only file system)</code>. On Fargate the fix is a volume mounted at <code>/tmp</code> (section 6). (2) Inside the nginx container, <code>wget http://localhost:8080/healthz</code> gave <i>Connection refused</i>: <code>localhost</code> resolved to IPv6 <code>::1</code>, and nginx only listens on IPv4. With <code>127.0.0.1</code> it worked. That is why the health checks in section 6 use the IP, not the name.</>} /></Callout>
      </Section>

      <Section id="cloudflare" title={<T pt="3. Cloudflare: modo SSL e certificado de origem" en="3. Cloudflare: SSL mode and origin certificate" />}>
        <p><T pt={<>Domínio comprado na Cloudflare já nasce usando o DNS dela: o Cloudflare Registrar exige os nameservers da Cloudflare, então não há nada a apontar no registrador. Faltam três ajustes no painel, todos em <b>SSL/TLS</b>.</>} en={<>A domain bought at Cloudflare already uses its DNS: Cloudflare Registrar requires Cloudflare's nameservers, so there is nothing to point at the registrar. Three settings remain in the dashboard, all under <b>SSL/TLS</b>.</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><b>SSL/TLS → Overview → Full (strict).</b> A Cloudflare só conecta ao ALB se o certificado dele for válido, não vencido e cobrir o hostname, emitido por uma CA pública ou pela Origin CA da Cloudflare. Nos modos <i>Flexible</i> ou <i>Full</i> (sem strict), qualquer um no meio do caminho poderia se passar pelo seu ALB.</>} en={<><b>SSL/TLS → Overview → Full (strict).</b> Cloudflare only connects to the ALB if its certificate is valid, unexpired and covers the hostname, issued by a public CA or Cloudflare's Origin CA. In <i>Flexible</i> or <i>Full</i> (non-strict) modes, anyone in the path could impersonate your ALB.</>} /></li>
          <li><T pt={<><b>SSL/TLS → Origin Server → Create Certificate.</b> Deixe a Cloudflare gerar a chave (RSA 2048 serve). Os hostnames padrão já são os certos para este desenho: <code>example.com</code> e <code>*.example.com</code>, o que cobre também o <code>www</code> e um eventual <code>api.</code>. Escolha a validade e o formato <b>PEM</b>.</>} en={<><b>SSL/TLS → Origin Server → Create Certificate.</b> Let Cloudflare generate the key (RSA 2048 is fine). The default hostnames are already right for this design: <code>example.com</code> and <code>*.example.com</code>, which also covers <code>www</code> and a possible <code>api.</code>. Pick the validity and the <b>PEM</b> format.</>} /></li>
          <li><T pt={<>Salve o certificado em <code>origin.pem</code> e a chave em <code>origin.key</code> <b>antes de sair da tela</b>: a chave não pode ser vista de novo.</>} en={<>Save the certificate as <code>origin.pem</code> and the key as <code>origin.key</code> <b>before leaving the screen</b>: the key cannot be viewed again.</>} /></li>
          <li><T pt={<><b>SSL/TLS → Edge Certificates → Always Use HTTPS: On.</b> O visitante que digitar <code>http://</code> é redirecionado na Cloudflare, antes de chegar à AWS. Por isso o ALB não precisa de listener na porta 80.</>} en={<><b>SSL/TLS → Edge Certificates → Always Use HTTPS: On.</b> A visitor who types <code>http://</code> is redirected at Cloudflare, before reaching AWS. That is why the ALB needs no port 80 listener.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<><b>Esse certificado só vale para a Cloudflare.</b> Navegadores não confiam na Origin CA. Se o registro DNS ficar como <i>DNS only</i> (nuvem cinza) ou o proxy for pausado, o visitante vê erro de certificado. Os registros deste desenho ficam sempre com proxy (nuvem laranja). E a Cloudflare não avisa quando o certificado de origem vai vencer: anote a data no calendário.</>} en={<><b>This certificate is only valid for Cloudflare.</b> Browsers do not trust the Origin CA. If the DNS record is left as <i>DNS only</i> (grey cloud) or the proxy is paused, visitors get a certificate error. The records in this design are always proxied (orange cloud). And Cloudflare does not warn you before the origin certificate expires: put the date in your calendar.</>} /></Callout>
        <p><T pt={<>A versão com capturas de tela de cada opção está na <a href="/notas/cloudflare/#alb">seção de ALB da nota da Cloudflare</a>. O certificado entra na AWS na <a href="#alb">seção 7</a>.</>} en={<>The version with screenshots of each option is in the <a href="/notas/cloudflare/#alb">ALB section of the Cloudflare note</a>. The certificate goes into AWS in <a href="#alb">section 7</a>.</>} /></p>
      </Section>

      <Section id="network" title={<T pt="4. Rede e security groups" en="4. Network and security groups" />}>
        <p><T pt={<>A rede é a mesma de um app só, com um security group a mais. O ALB fica nas subnets <b>públicas</b>; as tasks dos dois services ficam nas <b>privadas</b>, sem IP público. Cada service tem o seu security group, que só aceita o ALB e só na porta do seu container.</>} en={<>The network is the same as for a single app, with one more security group. The ALB sits in the <b>public</b> subnets; both services' tasks sit in the <b>private</b> ones, with no public IP. Each service has its own security group, which only accepts the ALB and only on its container's port.</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<>Console: <b>VPC → Create VPC → VPC and more</b>. Nome <code>mural</code>, <code>10.0.0.0/16</code>, <b>2</b> AZs, <b>2</b> subnets públicas e <b>2</b> privadas, <b>NAT gateways: None</b>, <b>VPC endpoints: S3 Gateway</b>, DNS hostnames e DNS resolution ligados.</>} en={<>Console: <b>VPC → Create VPC → VPC and more</b>. Name <code>mural</code>, <code>10.0.0.0/16</code>, <b>2</b> AZs, <b>2</b> public and <b>2</b> private subnets, <b>NAT gateways: None</b>, <b>VPC endpoints: S3 Gateway</b>, DNS hostnames and DNS resolution on.</>} /></li>
          <li><T pt="Anote os IDs nas variáveis abaixo; os comandos das próximas seções usam todas elas." en="Put the IDs in the variables below; the commands in the next sections use all of them." /></li>
        </ol>
        <CodeBlock code={`REGION=sa-east-1
ACCOUNT_ID=<ACCOUNT_ID>
DOMAIN=example.com
VPC_ID=<vpc-id>
PUB_A=<subnet-public-a>;  PUB_B=<subnet-public-b>
PRIV_A=<subnet-private-a>; PRIV_B=<subnet-private-b>`} />
        <Table
          head={[<T pt="Grupo" en="Group" />, <T pt="Entrada permitida" en="Allowed inbound" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt={<><code>mural-alb</code></>} en={<><code>mural-alb</code></>} />, <T pt="443 só dos IPs da Cloudflare (prefix list)" en="443 only from Cloudflare's IPs (prefix list)" />, <T pt="Quem tentar o DNS do ALB direto, pulando a Cloudflare, nem conecta." en="Anyone trying the ALB's DNS name directly, skipping Cloudflare, cannot even connect." />],
            [<T pt={<><code>mural-web</code></>} en={<><code>mural-web</code></>} />, <T pt={<>8080 de <code>mural-alb</code></>} en={<>8080 from <code>mural-alb</code></>} />, <T pt="Só o ALB fala com o nginx." en="Only the ALB talks to nginx." />],
            [<T pt={<><code>mural-api</code></>} en={<><code>mural-api</code></>} />, <T pt={<>3000 de <code>mural-alb</code></>} en={<>3000 from <code>mural-alb</code></>} />, <T pt="Só o ALB fala com a API. O front não chama a API por dentro: quem chama é o navegador, passando pelo ALB." en="Only the ALB talks to the API. The front end does not call the API internally: the browser does, through the ALB." />],
            [<T pt={<><code>mural-vpce</code></>} en={<><code>mural-vpce</code></>} />, <T pt={<>443 de <code>mural-web</code> e de <code>mural-api</code></>} en={<>443 from <code>mural-web</code> and <code>mural-api</code></>} />, <T pt="As tasks baixam a imagem e mandam logs pelos endpoints, sem internet." en="Tasks pull the image and send logs through the endpoints, without internet." />],
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
          <li><T pt={<><em>Sem <code>secretsmanager</code>.</em> Como os containers não recebem certificado nem senha, este desenho não precisa do endpoint do Secrets Manager. Se a API ganhar um banco, acrescente-o (e veja a <a href="/notas/ecs-todo-app/#network">seção de rede da nota do ECS</a>, que explica cada endpoint).</>} en={<><em>No <code>secretsmanager</code>.</em> Since the containers get no certificate or password, this design does not need the Secrets Manager endpoint. If the API gets a database, add it (and see the <a href="/notas/ecs-todo-app/#network">network section of the ECS note</a>, which explains each endpoint).</>} /></li>
          <li><T pt={<><em>A lista da Cloudflare muda.</em> Revise a prefix list de tempos em tempos (<code>modify-managed-prefix-list</code>). Uma faixa nova que falte aparece como erro 522 para parte dos visitantes.</>} en={<><em>Cloudflare's list changes.</em> Review the prefix list now and then (<code>modify-managed-prefix-list</code>). A missing new range shows up as a 522 error for some visitors.</>} /></li>
          <li><T pt={<><em>API externa?</em> Se a API chamar algo fora da AWS (pagamento, e-mail), as subnets privadas precisam de um NAT gateway; sem saída para a internet, a chamada só expira.</>} en={<><em>External API?</em> If the API calls something outside AWS (payments, email), the private subnets need a NAT gateway; without a way out to the internet, the call just times out.</>} /></li>
        </ul>
      </Section>

      <Section id="ecr" title={<T pt="5. Dois repositórios no ECR e as primeiras imagens" en="5. Two ECR repositories and the first images" />}>
        <p><T pt={<>Uma imagem, um repositório. Tags imutáveis garantem que <code>:abc123</code> sempre aponte para o mesmo conteúdo. Um service só sobe com uma imagem que exista, então envie a primeira de cada à mão, uma única vez, com a tag <code>bootstrap</code>; depois disso quem envia é o pipeline.</>} en={<>One image, one repository. Immutable tags guarantee <code>:abc123</code> always points to the same content. A service only starts with an image that exists, so push the first of each by hand, once, with the <code>bootstrap</code> tag; after that the pipeline does the pushing.</>} /></p>
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
        <Callout tone="use" icon="check"><T pt={<><b><code>--platform linux/amd64</code>.</b> A task definition abaixo pede <code>X86_64</code>. Num Mac com Apple Silicon o <code>docker build</code> gera ARM por padrão, e a task para com <code>exec format error</code>. O runner do GitHub já é x86_64.</>} en={<><b><code>--platform linux/amd64</code>.</b> The task definition below asks for <code>X86_64</code>. On an Apple Silicon Mac <code>docker build</code> produces ARM by default, and the task stops with <code>exec format error</code>. GitHub's runner is already x86_64.</>} /></Callout>
      </Section>

      <Section id="tasks" title={<T pt="6. Roles, logs e as duas task definitions" en="6. Roles, logs and the two task definitions" />}>
        <p><T pt={<>Uma única <b>execution role</b> serve aos dois services: ela é usada pelo agente do ECS para baixar a imagem e escrever logs, antes de o container iniciar. Nenhum dos dois apps chama APIs da AWS, então não há <i>task role</i>. Um cluster agrupa os dois services.</>} en={<>A single <b>execution role</b> serves both services: the ECS agent uses it to pull the image and write logs, before the container starts. Neither app calls AWS APIs, so there is no <i>task role</i>. One cluster groups both services.</>} /></p>
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
        <h3><T pt="6.1 Front: .aws/task-definition.web.json" en="6.1 Front end: .aws/task-definition.web.json" /></h3>
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
        <h3><T pt="6.2 Back: .aws/task-definition.api.json" en="6.2 Back end: .aws/task-definition.api.json" /></h3>
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
          <li><T pt={<><em>O volume <code>tmp</code>.</em> Um volume sem <code>host</code> no Fargate é um <i>bind mount</i> no armazenamento efêmero da task: some quando a task para. Ele dá ao nginx o <code>/tmp</code> gravável que o teste local mostrou ser necessário, enquanto o resto do disco continua somente leitura.</>} en={<><em>The <code>tmp</code> volume.</em> A volume with no <code>host</code> on Fargate is a <i>bind mount</i> on the task's ephemeral storage: it disappears when the task stops. It gives nginx the writable <code>/tmp</code> the local test showed it needs, while the rest of the disk stays read-only.</>} /></li>
          <li><T pt={<><em>Health check com <code>wget</code> e <code>127.0.0.1</code>.</em> As duas imagens são Alpine, que traz o <code>wget</code> do BusyBox e não traz <code>curl</code>. O IP evita a armadilha do <code>localhost</code> → IPv6.</>} en={<><em>Health check with <code>wget</code> and <code>127.0.0.1</code>.</em> Both images are Alpine, which ships BusyBox <code>wget</code> and no <code>curl</code>. The IP avoids the <code>localhost</code> → IPv6 trap.</>} /></li>
          <li><T pt={<><em>Nomes dos containers.</em> <code>web</code> e <code>api</code> são usados de novo no service (para ligar ao target group) e no workflow (para trocar a imagem). Os três lugares precisam bater.</>} en={<><em>Container names.</em> <code>web</code> and <code>api</code> are used again in the service (to attach to the target group) and in the workflow (to swap the image). All three places must match.</>} /></li>
          <li><T pt={<><em>256 CPU e 512 MB</em> é a menor combinação do Fargate e sobra para os dois. O nginx servindo arquivos estáticos quase não usa CPU.</>} en={<><em>256 CPU and 512 MB</em> is Fargate's smallest combination and is plenty for both. nginx serving static files barely uses CPU.</>} /></li>
        </ul>
      </Section>

      <Section id="alb" title={<T pt="7. ALB, a regra /api/* e os dois services" en="7. ALB, the /api/* rule and the two services" />}>
        <p><T pt={<>Aqui está o coração do desenho. O ALB tem <b>um</b> listener HTTPS na 443 com o certificado da Cloudflare, e o listener tem <b>regras</b>: cada regra tem uma condição e um destino. As regras são avaliadas da menor prioridade para a maior; se nenhuma bate, vale a <b>ação padrão</b>.</>} en={<>This is the heart of the design. The ALB has <b>one</b> HTTPS listener on 443 with the Cloudflare certificate, and the listener has <b>rules</b>: each rule has a condition and a target. Rules are evaluated from lowest priority number to highest; if none matches, the <b>default action</b> applies.</>} /></p>
        <Table
          head={[<T pt="Prioridade" en="Priority" />, <T pt="Condição" en="Condition" />, <T pt="Destino" en="Target" />]}
          rows={[
            [<T pt="10" en="10" />, <T pt={<><code>path-pattern</code> <code>/api/*</code></>} en={<><code>path-pattern</code> <code>/api/*</code></>} />, <T pt={<>target group <code>mural-api</code> (porta 3000)</>} en={<>target group <code>mural-api</code> (port 3000)</>} />],
            [<T pt="padrão" en="default" />, <T pt="qualquer outro pedido" en="any other request" />, <T pt={<>target group <code>mural-web</code> (porta 8080)</>} en={<>target group <code>mural-web</code> (port 8080)</>} />],
          ]}
        />
        <h3><T pt="7.1 Certificado no ACM" en="7.1 Certificate in ACM" /></h3>
        <p><T pt={<>Importe na <b>mesma região do ALB</b>. O ACM exige PEM e chave sem senha. Depois de importar, a chave não precisa ficar no seu disco.</>} en={<>Import into the <b>same region as the ALB</b>. ACM requires PEM and an unencrypted key. After importing, the key does not need to stay on your disk.</>} /></p>
        <CodeBlock code={`CERT_ARN=$(aws acm import-certificate \\
  --certificate fileb://origin.pem --private-key fileb://origin.key \\
  --query CertificateArn --output text)
rm origin.key   # keep a copy only in your password manager, if at all`} />
        <h3><T pt="7.2 Dois target groups" en="7.2 Two target groups" /></h3>
        <p><T pt={<>Um por service, do tipo <code>ip</code> (obrigatório no modo <code>awsvpc</code> do Fargate), falando HTTP com o container. Cada um tem o seu health check, no caminho que o próprio app responde.</>} en={<>One per service, of type <code>ip</code> (required in Fargate's <code>awsvpc</code> mode), speaking HTTP to the container. Each has its own health check, on the path that app itself answers.</>} /></p>
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
        <h3><T pt="7.3 ALB, listener e a regra" en="7.3 ALB, listener and the rule" /></h3>
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
          <li><T pt={<><em><code>/api/*</code> não casa com <code>/api</code>.</em> O padrão exige algo depois da barra. Se o front chamar <code>/api</code> puro, o pedido cai na ação padrão e volta o <code>index.html</code>. O padrão também diferencia maiúsculas: <code>/API/info</code> vai para o front.</>} en={<><em><code>/api/*</code> does not match <code>/api</code>.</em> The pattern needs something after the slash. If the front end calls bare <code>/api</code>, the request falls to the default action and gets <code>index.html</code> back. The pattern is also case-sensitive: <code>/API/info</code> goes to the front end.</>} /></li>
          <li><T pt={<><em>Por que o front é o padrão.</em> O front precisa responder qualquer caminho (as rotas do React), e a API só os que começam com <code>/api/</code>. Deixar o caso amplo como padrão e o específico como regra é o mais simples de ler.</>} en={<><em>Why the front end is the default.</em> The front end must answer any path (React's routes), and the API only those starting with <code>/api/</code>. Leaving the broad case as the default and the specific one as a rule is the simplest to read.</>} /></li>
          <li><T pt={<><em>Sem listener na 80.</em> O <code>mural-alb</code> nem aceita a porta 80; o redirecionamento para HTTPS é feito pela Cloudflare (seção 3).</>} en={<><em>No listener on 80.</em> <code>mural-alb</code> does not even accept port 80; the HTTPS redirect is done by Cloudflare (section 3).</>} /></li>
        </ul>
        <h3><T pt="7.4 Os dois services" en="7.4 The two services" /></h3>
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
          <li><T pt={<><em>Duas tasks por service</em>, uma em cada AZ. Uma zona pode cair sem tirar o site do ar, e no deploy as novas sobem antes de as antigas saírem (100/200).</>} en={<><em>Two tasks per service</em>, one in each AZ. A zone can fail without taking the site down, and on deploy the new ones start before the old ones leave (100/200).</>} /></li>
          <li><T pt={<><em>Cada service escala sozinho.</em> Se a API precisar de mais tasks, mude só o <code>desired-count</code> dela (ou ponha auto scaling); o front continua com duas. Essa é a vantagem prática de separar as imagens.</>} en={<><em>Each service scales on its own.</em> If the API needs more tasks, change only its <code>desired-count</code> (or add auto scaling); the front end keeps two. That is the practical advantage of splitting the images.</>} /></li>
          <li><T pt={<><em>Circuit breaker com rollback.</em> Se as tasks novas não ficarem saudáveis, o ECS volta sozinho para a revisão anterior.</>} en={<><em>Circuit breaker with rollback.</em> If the new tasks do not become healthy, ECS rolls back to the previous revision by itself.</>} /></li>
        </ul>
        <h3><T pt="7.5 Variante: API num subdomínio" en="7.5 Variant: API on a subdomain" /></h3>
        <p><T pt={<>Se você escolheu <code>api.example.com</code> na seção 1, troque só a condição da regra, crie o registro DNS <code>api</code> igual aos da seção 8 e ligue o CORS na API. As rotas da API podem então deixar de ter o prefixo <code>/api</code>.</>} en={<>If you chose <code>api.example.com</code> in section 1, change only the rule's condition, create the <code>api</code> DNS record like the ones in section 8 and turn on CORS in the API. The API's routes can then drop the <code>/api</code> prefix.</>} /></p>
        <CodeBlock code={`aws elbv2 create-rule --listener-arn $LISTENER_ARN --priority 10 \\
  --conditions Field=host-header,Values=api.$DOMAIN \\
  --actions Type=forward,TargetGroupArn=$TG_API`} />
      </Section>

      <Section id="dns" title={<T pt="8. DNS na Cloudflare e o caminho de cada pedido" en="8. DNS at Cloudflare and each request's path" />}>
        <ol className="ds-steps">
          <li><T pt={<>Cloudflare → <b>DNS → Records → Add record</b>: tipo <code>CNAME</code>, nome <code>@</code> (a raiz, <code>example.com</code>), destino = o <code>$ALB_DNS</code>, <b>Proxied</b>.</>} en={<>Cloudflare → <b>DNS → Records → Add record</b>: type <code>CNAME</code>, name <code>@</code> (the apex, <code>example.com</code>), target = <code>$ALB_DNS</code>, <b>Proxied</b>.</>} /></li>
          <li><T pt={<>Mais um <code>CNAME</code>, nome <code>www</code>, mesmo destino, <b>Proxied</b>. Se quiser um endereço só, crie uma <i>Redirect Rule</i> de <code>www.example.com/*</code> para <code>https://example.com/$&#123;1&#125;</code> (301).</>} en={<>Another <code>CNAME</code>, name <code>www</code>, same target, <b>Proxied</b>. If you want a single address, create a <i>Redirect Rule</i> from <code>www.example.com/*</code> to <code>https://example.com/$&#123;1&#125;</code> (301).</>} /></li>
        </ol>
        <Callout tone="info" icon="alert"><T pt={<><b>CNAME na raiz?</b> O padrão de DNS não permite CNAME no domínio raiz, e o ALB não tem IP fixo (só um nome). A Cloudflare resolve isso com <i>CNAME flattening</i>: ela aceita o CNAME na raiz e responde ao visitante com os IPs, que de qualquer forma são os dela, por causa do proxy. É uma das vantagens de o DNS estar na Cloudflare; no Route 53 o equivalente é o registro <i>Alias</i>.</>} en={<><b>A CNAME at the apex?</b> The DNS standard does not allow a CNAME at the root domain, and the ALB has no fixed IP (only a name). Cloudflare solves it with <i>CNAME flattening</i>: it accepts the CNAME at the apex and answers visitors with IPs, which are its own anyway, because of the proxy. It is one of the perks of having DNS at Cloudflare; on Route 53 the equivalent is an <i>Alias</i> record.</>} /></Callout>
        <h3><T pt="O que acontece quando alguém abre o site" en="What happens when someone opens the site" /></h3>
        <Diagram minWidth={600} caption={<T pt="Três pedidos de uma visita. Só o primeiro e o terceiro chegam à AWS; os arquivos com hash ficam no cache da Cloudflare depois da primeira vez." en="Three requests from one visit. Only the first and third reach AWS; the hashed files stay in Cloudflare's cache after the first time." />}>
          <svg viewBox="0 0 720 250" role="img" aria-label="Caminho de três pedidos / Path of three requests">
            <text x="98" y="22" className="pt mut" textAnchor="middle">Navegador</text>
            <text x="98" y="22" className="en mut" textAnchor="middle">Browser</text>
            <text x="300" y="22" className="mut" textAnchor="middle">Cloudflare</text>
            <text x="472" y="22" className="mut" textAnchor="middle">ALB</text>
            <text x="630" y="22" className="pt mut" textAnchor="middle">Service</text>
            <text x="630" y="22" className="en mut" textAnchor="middle">Service</text>

            <rect x="8" y="36" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="66" className="mono" textAnchor="middle">GET /</text>
            <rect x="220" y="36" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="58" className="pt" textAnchor="middle">HTML não é cacheado</text>
            <text x="300" y="58" className="en" textAnchor="middle">HTML is not cached</text>
            <text x="300" y="76" className="pt mut" textAnchor="middle">repassa ao ALB</text>
            <text x="300" y="76" className="en mut" textAnchor="middle">passes to the ALB</text>
            <rect x="412" y="36" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="472" y="66" className="pt" textAnchor="middle">ação padrão</text>
            <text x="472" y="66" className="en" textAnchor="middle">default action</text>
            <rect x="564" y="36" width="132" height="50" rx="4" className="ln brandfill" />
            <text x="630" y="58" textAnchor="middle">web</text>
            <text x="630" y="76" className="mono mut" textAnchor="middle">index.html</text>
            <path d="M188 61L220 61M380 61L412 61M532 61L564 61" className="ln" />
            <path d="M212.8 64.5L220 61L212.8 57.5M404.8 64.5L412 61L404.8 57.5M556.8 64.5L564 61L556.8 57.5" className="ln" />

            <rect x="8" y="106" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="136" className="mono" textAnchor="middle">GET /assets/index-….js</text>
            <rect x="220" y="106" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="128" className="pt" textAnchor="middle">cache HIT</text>
            <text x="300" y="128" className="en" textAnchor="middle">cache HIT</text>
            <text x="300" y="146" className="pt mut" textAnchor="middle">responde da borda</text>
            <text x="300" y="146" className="en mut" textAnchor="middle">answers from the edge</text>
            <rect x="412" y="106" width="284" height="50" rx="4" className="ln dash" />
            <text x="554" y="136" className="pt mut" textAnchor="middle">não chega à AWS (após o 1º pedido)</text>
            <text x="554" y="136" className="en mut" textAnchor="middle">never reaches AWS (after the 1st request)</text>
            <path d="M188 131L220 131" className="ln" />
            <path d="M212.8 134.5L220 131L212.8 127.5" className="ln" />

            <rect x="8" y="176" width="180" height="50" rx="4" className="ln fillsoft" />
            <text x="98" y="206" className="mono" textAnchor="middle">GET /api/info</text>
            <rect x="220" y="176" width="160" height="50" rx="4" className="ln brandfill" />
            <text x="300" y="198" className="pt" textAnchor="middle">sem extensão: passa</text>
            <text x="300" y="198" className="en" textAnchor="middle">no extension: passes</text>
            <text x="300" y="216" className="mono mut" textAnchor="middle">+ CF-Connecting-IP</text>
            <rect x="412" y="176" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="472" y="206" className="pt" textAnchor="middle">regra /api/*</text>
            <text x="472" y="206" className="en" textAnchor="middle">rule /api/*</text>
            <rect x="564" y="176" width="132" height="50" rx="4" className="ln brandfill" />
            <text x="630" y="198" textAnchor="middle">api</text>
            <text x="630" y="216" className="mono mut" textAnchor="middle">JSON</text>
            <path d="M188 201L220 201M380 201L412 201M532 201L564 201" className="ln" />
            <path d="M212.8 204.5L220 201L212.8 197.5M404.8 204.5L412 201L404.8 197.5M556.8 204.5L564 201L556.8 197.5" className="ln" />
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><em>O cache padrão da Cloudflare</em> decide pela extensão do arquivo: guarda <code>.js</code>, <code>.css</code>, imagens e fontes, e não guarda HTML nem respostas sem extensão como <code>/api/info</code>. Para este desenho o padrão já está certo; você não precisa de nenhuma regra de cache.</>} en={<><em>Cloudflare's default cache</em> decides by file extension: it stores <code>.js</code>, <code>.css</code>, images and fonts, and does not store HTML or extensionless responses like <code>/api/info</code>. For this design the default is already right; you need no cache rule.</>} /></li>
          <li><T pt={<><em>Por que isso combina com o nginx.</em> Os arquivos de <code>/assets/</code> mudam de nome a cada build, então um cache longo nunca serve versão velha. O <code>index.html</code> não é guardado, e é ele que aponta para os nomes novos. Resultado: o deploy aparece na hora, sem purgar cache.</>} en={<><em>Why that fits the nginx setup.</em> Files in <code>/assets/</code> change name on every build, so a long cache never serves a stale version. <code>index.html</code> is not stored, and it is what points to the new names. Result: a deploy shows up immediately, with no cache purge.</>} /></li>
        </ul>
        <Callout tone="info" icon="alert"><T pt={<><b>Um passo além: só a <i>sua</i> zona da Cloudflare.</b> A prefix list garante que o tráfego vem da Cloudflare, mas qualquer cliente da Cloudflare poderia apontar o próprio domínio para o seu ALB. Para fechar isso, crie na Cloudflare uma <i>Transform Rule</i> que acrescenta um cabeçalho secreto a todo pedido (por exemplo <code>X-Origin-Auth</code>) e faça as regras do ALB exigirem esse cabeçalho (condição <code>http-header</code>), com a ação padrão devolvendo 403.</>} en={<><b>One step further: only <i>your</i> Cloudflare zone.</b> The prefix list ensures traffic comes from Cloudflare, but any Cloudflare customer could point their own domain at your ALB. To close that, create a Cloudflare <i>Transform Rule</i> that adds a secret header to every request (for example <code>X-Origin-Auth</code>) and make the ALB rules require that header (<code>http-header</code> condition), with the default action returning 403.</>} /></Callout>
      </Section>

      <Section id="deploy" title={<T pt="9. Deploy das duas imagens" en="9. Deploying both images" />}>
        <p><T pt={<>O workflow é o da <a href="/notas/github-aws-oidc/#workflow">nota de OIDC</a> com uma diferença: uma <b>matrix</b> roda o mesmo job duas vezes, uma para <code>web</code> e outra para <code>api</code>. Cada execução constrói a sua pasta, envia ao seu repositório e atualiza o seu service.</>} en={<>The workflow is the one from the <a href="/notas/github-aws-oidc/#workflow">OIDC note</a> with one difference: a <b>matrix</b> runs the same job twice, once for <code>web</code> and once for <code>api</code>. Each run builds its folder, pushes to its repository and updates its service.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="Um push, dois jobs em paralelo. Cada service troca as tasks aos poucos: o site não sai do ar." en="One push, two jobs in parallel. Each service swaps its tasks gradually: the site never goes down." />}>
          <svg viewBox="0 0 720 200" role="img" aria-label="Deploy com matrix / Deploy with a matrix">
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
          <li><T pt={<><em>Pré-requisitos.</em> O provedor OIDC e a role de deploy (com <code>iam:PassRole</code> para a <code>muralExecutionRole</code>) vêm das etapas 1 e 2 da <a href="/notas/github-aws-oidc/">nota de OIDC</a>; as variáveis <code>AWS_ROLE_ARN</code> e <code>AWS_REGION</code> ficam no environment <code>production</code> do GitHub. A política da role precisa cobrir os <b>dois</b> repositórios do ECR e os <b>dois</b> services.</>} en={<><em>Prerequisites.</em> The OIDC provider and the deploy role (with <code>iam:PassRole</code> for <code>muralExecutionRole</code>) come from steps 1 and 2 of the <a href="/notas/github-aws-oidc/">OIDC note</a>; the <code>AWS_ROLE_ARN</code> and <code>AWS_REGION</code> variables live in GitHub's <code>production</code> environment. The role's policy must cover <b>both</b> ECR repositories and <b>both</b> services.</>} /></li>
          <li><T pt={<><em><code>APP_VERSION</code> com o SHA.</em> A action de render acrescenta a variável ao container; abrindo o site você vê qual commit está no ar. No nginx a variável existe mas não é usada, o que não faz mal.</>} en={<><em><code>APP_VERSION</code> with the SHA.</em> The render action adds the variable to the container; opening the site shows which commit is live. In nginx the variable exists but is unused, which is harmless.</>} /></li>
          <li><T pt={<><em>Só o que mudou.</em> Este workflow publica as duas imagens a cada push, o que é simples e previsível. Se os builds ficarem lentos, filtre por pasta (por exemplo, com dois workflows e <code>on.push.paths</code>: <code>web/**</code> e <code>api/**</code>).</>} en={<><em>Only what changed.</em> This workflow ships both images on every push, which is simple and predictable. If builds get slow, filter by folder (for example, two workflows with <code>on.push.paths</code>: <code>web/**</code> and <code>api/**</code>).</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><b>Front e back não trocam no mesmo instante.</b> Os dois services fazem deploy em paralelo, cada um no seu ritmo; por alguns minutos o front novo pode falar com a API velha, ou o contrário. Mudanças na API precisam ser <b>compatíveis com a versão anterior</b>: acrescente campos e rotas novos primeiro, passe o front a usá-los num deploy seguinte, e só depois remova o que ficou velho. É a mesma ideia de <i>expand and contract</i> da <a href="/notas/db-migrations/">nota de migrações</a>.</>} en={<><b>Front and back do not switch at the same instant.</b> Both services deploy in parallel, each at its own pace; for a few minutes the new front end may talk to the old API, or the reverse. API changes must be <b>backward compatible</b>: add new fields and routes first, switch the front end to them in a later deploy, and only then remove what is obsolete. It is the same <i>expand and contract</i> idea as in the <a href="/notas/db-migrations/">migrations note</a>.</>} /></Callout>
      </Section>

      <Section id="verify" title={<T pt="10. Conferir e diagnosticar" en="10. Checking and troubleshooting" />}>
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
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />]}
          rows={[
            [<T pt={<>A página abre, mas o <code>fetch('/api/info')</code> recebe HTML em vez de JSON (<code>Unexpected token '&lt;'</code>)</>} en={<>The page loads, but <code>fetch('/api/info')</code> gets HTML instead of JSON (<code>Unexpected token '&lt;'</code>)</>} />, <T pt={<>A regra <code>/api/*</code> não existe ou não está no listener 443, e o pedido caiu na ação padrão (o nginx devolveu o <code>index.html</code>). Confira com <code>aws elbv2 describe-rules --listener-arn $LISTENER_ARN</code>.</>} en={<>The <code>/api/*</code> rule does not exist or is not on the 443 listener, so the request fell to the default action (nginx returned <code>index.html</code>). Check with <code>aws elbv2 describe-rules --listener-arn $LISTENER_ARN</code>.</>} />],
            [<T pt={<><code>/api/info</code> responde <code>{'{"error":"not found"}'}</code></>} en={<><code>/api/info</code> answers <code>{'{"error":"not found"}'}</code></>} />, <T pt={<>A regra funciona, mas o código da API registrou as rotas sem o prefixo <code>/api</code>. O ALB repassa o caminho inteiro.</>} en={<>The rule works, but the API code registered its routes without the <code>/api</code> prefix. The ALB forwards the full path.</>} />],
            [<T pt={<>F5 numa rota do React dá 404</>} en={<>Refreshing a React route gives 404</>} />, <T pt={<>Falta o <code>try_files $uri $uri/ /index.html</code> no <code>nginx.conf</code>.</>} en={<><code>try_files $uri $uri/ /index.html</code> is missing from <code>nginx.conf</code>.</>} />],
            [<T pt="Depois do deploy, alguns visitantes ainda veem o front antigo" en="After deploying, some visitors still see the old front end" />, <T pt={<>O <code>index.html</code> está sendo guardado em cache (no navegador ou por uma <i>Cache Rule</i> “Cache Everything” na Cloudflare). Ele precisa de <code>no-cache</code>; só <code>/assets/</code> pode ter cache longo.</>} en={<><code>index.html</code> is being cached (in the browser or by a “Cache Everything” <i>Cache Rule</i> at Cloudflare). It needs <code>no-cache</code>; only <code>/assets/</code> may be cached long-term.</>} />],
            [<T pt={<>Task do <code>web</code> para logo ao iniciar; log: <code>Read-only file system</code></>} en={<><code>web</code> task stops right after starting; log: <code>Read-only file system</code></>} />, <T pt={<>Falta o volume <code>tmp</code> montado em <code>/tmp</code> na task definition.</>} en={<>The <code>tmp</code> volume mounted at <code>/tmp</code> is missing from the task definition.</>} />],
            [<T pt={<>Task <i>unhealthy</i> no ECS, mas o app parece funcionar</>} en={<>Task <i>unhealthy</i> in ECS, yet the app seems to work</>} />, <T pt={<>O health check do container usa <code>localhost</code> e caiu no IPv6, ou usa <code>curl</code>, que não existe na imagem Alpine. Use <code>wget</code> e <code>127.0.0.1</code>.</>} en={<>The container health check uses <code>localhost</code> and hit IPv6, or uses <code>curl</code>, which does not exist in the Alpine image. Use <code>wget</code> and <code>127.0.0.1</code>.</>} />],
            [<T pt={<>Cloudflare <b>502</b>; ALB 502/503</>} en={<>Cloudflare <b>502</b>; ALB 502/503</>} />, <T pt={<>O target group daquele caminho não tem target saudável: porta ou caminho de health check errados, ou o SG do service não aceita a porta vinda do <code>mural-alb</code>.</>} en={<>The target group for that path has no healthy target: wrong port or health check path, or the service SG does not accept the port from <code>mural-alb</code>.</>} />],
            [<T pt={<>Cloudflare <b>521</b> ou <b>522</b></>} en={<>Cloudflare <b>521</b> or <b>522</b></>} />, <T pt="O SG do ALB não tem os IPs da Cloudflare na 443, ou o listener 443 não existe." en="The ALB SG lacks Cloudflare's IPs on 443, or the 443 listener does not exist." />],
            [<T pt={<>Cloudflare <b>525</b> ou <b>526</b></>} en={<>Cloudflare <b>525</b> or <b>526</b></>} />, <T pt="O listener não usa o certificado de origem, o certificado não cobre o hostname (raiz e www), ou ele venceu." en="The listener does not use the origin certificate, the certificate does not cover the hostname (apex and www), or it expired." />],
            [<T pt={<><code>CannotPullContainerError</code> ou <code>exec format error</code></>} en={<><code>CannotPullContainerError</code> or <code>exec format error</code></>} />, <T pt={<>Faltam os endpoints <code>ecr.api</code>/<code>ecr.dkr</code>/<code>s3</code>, a tag não existe, ou a imagem foi construída para ARM.</>} en={<>The <code>ecr.api</code>/<code>ecr.dkr</code>/<code>s3</code> endpoints are missing, the tag does not exist, or the image was built for ARM.</>} />],
            [<T pt={<>Erro de CORS no console (só na variante com subdomínio)</>} en={<>CORS error in the console (subdomain variant only)</>} />, <T pt={<>A API não devolve <code>Access-Control-Allow-Origin: https://example.com</code> ou não responde ao <code>OPTIONS</code>.</>} en={<>The API does not return <code>Access-Control-Allow-Origin: https://example.com</code> or does not answer <code>OPTIONS</code>.</>} />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal:</b> as linhas sobre HTML no lugar de JSON, <code>Read-only file system</code> e <code>localhost</code> → IPv6 foram reproduzidas localmente com as imagens desta nota. As outras causas são o meu diagnóstico a partir das documentações, não uma lista oficial.</>} en={<><b>Personal note:</b> the rows about HTML instead of JSON, <code>Read-only file system</code> and <code>localhost</code> → IPv6 were reproduced locally with this note's images. The other causes are my own diagnosis from the docs, not an official list.</>} /></Callout>
      </Section>

      <Section id="cleanup" title={<T pt="11. Apagar tudo" en="11. Deleting everything" />}>
        <p><T pt="Na ordem inversa das dependências, para nada ficar preso e nada continuar cobrando por hora:" en="In reverse dependency order, so nothing gets stuck and nothing keeps billing by the hour:" /></p>
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
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, sobre o que foi testado:</b> o código, as duas imagens, o <code>compose.yaml</code> com o “ALB” local, os cabeçalhos de cache, o fallback do React, o <code>wget</code> dos health checks e a parada com <code>SIGTERM</code> foram executados nesta máquina (Docker 29, Node 22, Vite 7, nginx 1.29). Os comandos <code>aws</code>, as task definitions e o workflow seguem as documentações abaixo e o padrão das notas vizinhas, mas <b>não foram executados contra uma conta AWS</b> para escrever esta nota.</>} en={<><b>Personal note, on what was tested:</b> the code, both images, the <code>compose.yaml</code> with the local “ALB”, the cache headers, the React fallback, the health check <code>wget</code> and the <code>SIGTERM</code> stop were run on this machine (Docker 29, Node 22, Vite 7, nginx 1.29). The <code>aws</code> commands, task definitions and workflow follow the docs below and the pattern of the neighbouring notes, but <b>were not run against an AWS account</b> to write this note.</>} /></Callout>
        <Sources title={<T pt="Fontes oficiais" en="Official sources" />}>
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
