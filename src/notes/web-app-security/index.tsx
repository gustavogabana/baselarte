import { Callout, CodeBlock, Diagram, Section, Sources, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "web-app-security",
  title: "Apps web seguros: cabeçalhos, auth e agentes",
  seo: {
    title: "Apps web seguros: cabeçalhos, auth e agentes de IA",
    description: "HTTPS e cabeçalhos de segurança (HSTS, CSP com nonce, middleware próprio, Next.js e Nginx), atributos de cookie, sessões stateful vs. JWT stateless (access e refresh tokens), CSRF, SQL injection e XSS do lado de quem constrói, e a nova fronteira: segurança de agentes de IA (prompt injection, agência excessiva, riscos do MCP), segundo a OWASP.",
  },
  summary: "HTTPS e headers de segurança (HSTS, CSP com nonces, como montar o seu middleware, Next.js e Nginx), atributos de cookie, sessões com estado vs. JWT sem estado (access e refresh tokens), CSRF, SQL injection e XSS do lado de quem constrói, e segurança de agentes de IA (prompt injection, agência excessiva, riscos do MCP) segundo a OWASP.",
  kicker: "Guia de estudo",
  heroTitle: <>Apps web, <em>protegidos de ponta a ponta.</em></>,
  heroLede: "De HTTPS e cabeçalhos de segurança a sessões stateful, JWTs stateless, CSRF, injeção — e a nova fronteira da segurança de agentes de IA.",
  published: "2026-10-18",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "http-https", title: "HTTP e HTTPS: a base" },
        { id: "headers", title: "Cabeçalhos de segurança: do básico ao seu próprio" },
        { id: "cookies", title: "Cookies: os três atributos que importam" },
        { id: "stateful", title: "Autenticação stateful: sessões no servidor" },
        { id: "stateless", title: "Autenticação stateless: JWT, access e refresh" },
        { id: "choosing", title: "Qual escolher" },
        { id: "csrf", title: "CSRF: o pedido que você não pediu" },
        { id: "injection", title: "SQL injection e XSS: o lado de quem constrói" },
        { id: "ai-agents", title: "A nova fronteira: segurança de agentes de IA" },
        { id: "cheat-wa", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="http-https" title={"HTTP e HTTPS: a base"}>
        <Callout icon="check">Onde esta nota se encaixa: segurança de aplicações, o ponto de partida recomendado para um dev. Os riscos catalogados estão no <a href="/notas/owasp-top-10/">OWASP Top 10</a>.</Callout>
        <p>{"Esta nota é o lado de dentro da muralha: como proteger a aplicação web que você constrói, não como atacar a de outra pessoa (isso fica na nota de Red Team). O fio condutor é simples: HTTP é um protocolo de texto, sem memória entre uma requisição e a próxima; tudo que chamamos de \"segurança de app web\" é uma camada de proteções em cima dessa base simples — cifrar o transporte, autenticar quem está do outro lado, lembrar quem é quem entre requisições, e desconfiar de qualquer dado que entra."}</p>
        <h3>HTTP e HTTPS: a mesma coisa, uma delas cifrada</h3>
        <p>HTTP descreve <em>o que</em> é trocado (método, cabeçalhos, corpo); HTTPS é HTTP rodando dentro de uma conexão TLS, que cifra e autentica o transporte. A nota de segurança e redes já mostrou isso na prática: uma captura de pacotes da porta 80 mostra a requisição em texto puro; da porta 443, só ruído. TLS resolve três problemas de uma vez:</p>
        <Table
          head={["Propriedade", "O que garante"]}
          rows={[
            ["Confidencialidade", "ninguém no meio do caminho lê o conteúdo (cookies, senhas, tokens)"],
            ["Integridade", "ninguém no meio do caminho altera o conteúdo sem ser percebido"],
            ["Autenticidade", "o certificado prova que você está falando com o servidor certo, não um impostor (o \"s\" de HTTPS)"],
          ]}
        />
        <Diagram minWidth={600} caption={"O handshake TLS (simplificado). Veja a nota de segurança e redes para capturar isso de verdade com o Wireshark."}>
          <svg viewBox="0 0 650 280" role="img" aria-label="Handshake TLS">
            <rect x="10" y="20" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="85.0" y="49.0" textAnchor="middle">navegador</text>
            <rect x="480" y="20" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="555.0" y="49.0" textAnchor="middle">servidor</text>
            <path d="M170 85L480 85" className="ln" />
            <path d="M472.8 88.5L480 85L472.8 81.5" className="ln" />
            <text x="325" y="79" className="mono" textAnchor="middle">ClientHello</text>
            <path d="M480 125L170 125" className="ln" />
            <path d="M177.2 121.5L170 125L177.2 128.5" className="ln" />
            <text x="325" y="119" className="mono" textAnchor="middle">ServerHello + certificado</text>
            <path d="M170 165L480 165" className="ln" />
            <path d="M472.8 168.5L480 165L472.8 161.5" className="ln" />
            <text x="325" y="159" className="mono" textAnchor="middle">chaves de sessão combinadas</text>
            <path d="M10 200L640 200" className="ln dash" />
            <path d="M170 230L480 230" className="ln" />
            <path d="M472.8 233.5L480 230L472.8 226.5" className="ln" />
            <text x="325" y="222" className="mono" textAnchor="middle">dados da aplicação, cifrados</text>
            <text x="10" y="260" className="mut">Tudo depois da linha pontilhada está cifrado: método, caminho, cabeçalhos, cookies e corpo.</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert">HTTPS protege o <em>transporte</em>. Ele não impede SQL injection, não impede XSS, não valida nada que o usuário digita. É a base, não a proteção inteira — o resto desta nota cobre o que vem depois do TLS.</Callout>
      </Section>
      <Section id="headers" title={"Cabeçalhos de segurança: do básico ao seu próprio"}>
        <p>O navegador obedece a instruções que o SERVIDOR manda em cabeçalhos HTTP de resposta. Um punhado deles fecha a maior parte das portas de ataque mais comuns, de graça, sem mudar uma linha de lógica de negócio.</p>
        <Table
          head={["Cabeçalho", "Faz"]}
          rows={[
            [<code>Strict-Transport-Security</code>, "diz ao navegador para NUNCA mais tentar HTTP nesse domínio, nem seguindo um link — fecha a janela de um downgrade para texto puro"],
            [<code>Content-Security-Policy</code>, "lista de onde scripts, estilos e outros recursos podem vir; a defesa mais forte contra XSS que existe no navegador"],
            [<code>X-Content-Type-Options: nosniff</code>, "impede o navegador de \"adivinhar\" o tipo de um arquivo e executá-lo como script por engano"],
            [<><code>X-Frame-Options</code> / <code>frame-ancestors</code></>, <>impede que o seu site seja carregado dentro de um <code>&lt;iframe&gt;</code> de outro site (clickjacking)</>],
            [<code>Referrer-Policy</code>, "controla quanto da URL de origem vaza para o próximo site quando alguém clica num link seu"],
            [<code>Permissions-Policy</code>, "desliga recursos do navegador (câmera, geolocalização, microfone) que a página não usa"],
          ]}
        />
        <h3>CORS: a exceção controlada à regra de mesma origem</h3>
        <p>Por padrão, o navegador bloqueia JavaScript de um site lendo a resposta de outro (a <em>same-origin policy</em>). <code>Access-Control-Allow-Origin</code> e companhia são o jeito do SERVIDOR abrir uma exceção explícita para origens específicas.</p>
        <p><code>Access-Control-Allow-Origin: *</code> é seguro para uma API pública e sem cookies; para uma API autenticada, liste as origens exatas e use <code>Access-Control-Allow-Credentials: true</code> só quando precisar enviar cookies entre origens.</p>
        <h3 id="how-headers">Como um cabeçalho funciona (e por que o navegador obedece)</h3>
        <p>Toda resposta HTTP tem três partes: a linha de status, os <strong>cabeçalhos</strong> (pares <code>Nome: valor</code>, um por linha) e o corpo. Os cabeçalhos de segurança são instruções que o servidor escreve nessa área e que o navegador <em>escolhe cumprir</em>: ele não pergunta se faz sentido, só aplica.</p>
        <p>Por isso eles protegem tão bem — e por isso só protegem quem usa um navegador moderno (um <code>curl</code> ou um atacante com script próprio ignora todos).</p>
        <CodeBlock code={`HTTP/2 200
content-type: text/html; charset=utf-8
strict-transport-security: max-age=63072000; includeSubDomains
content-security-policy: default-src 'self'; frame-ancestors 'none'
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin

<!doctype html>...`} />
        <p>Três lugares podem escrever esses cabeçalhos, e vale escolher <strong>um só como dono</strong> de cada um para não duplicar nem se contradizer: (1) o código da aplicação (middleware), que enxerga a requisição e pode variar por rota ou gerar um valor por resposta, como um nonce; (2) o proxy reverso (Nginx, Caddy), bom para o que vale para o site inteiro; (3) a CDN/edge (Cloudflare, CloudFront), que cobre também arquivos estáticos. Cabeçalhos devem ir em <em>todas</em> as respostas — inclusive erros 404/500 e arquivos estáticos.</p>
        <h3 id="recommended-set">O conjunto recomendado, cabeçalho por cabeçalho</h3>
        <p>A tabela segue o <em>HTTP Headers Cheat Sheet</em> do OWASP. O que importa decorar é a coluna "ação": o que ligar, o que ligar com cuidado e o que remover.</p>
        <Table
          head={["Cabeçalho", "Valor recomendado", "Ação"]}
          rows={[
            [<code>Strict-Transport-Security</code>, <><code>max-age=63072000; includeSubDomains</code> (<code>preload</code> só após conferir os requisitos)</>, "ligar, com cuidado"],
            [<code>Content-Security-Policy</code>, <>política própria; comece por <code>default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'</code></>, "ligar (em Report-Only primeiro)"],
            [<code>X-Content-Type-Options</code>, <code>nosniff</code>, "ligar"],
            [<code>Referrer-Policy</code>, <code>strict-origin-when-cross-origin</code>, "ligar, de forma explícita"],
            [<code>Permissions-Policy</code>, <code>camera=(), microphone=(), geolocation=()</code>, "ligar, listando o que não usa"],
            [<code>X-Frame-Options</code>, <><code>DENY</code> (o moderno é <code>frame-ancestors</code> na CSP)</>, "ligar (legado)"],
            [<code>Cross-Origin-Opener-Policy</code>, <code>same-origin</code>, "ligar em páginas de navegador"],
            [<code>Cross-Origin-Resource-Policy</code>, <code>same-site</code>, "ligar"],
            [<code>Cross-Origin-Embedder-Policy</code>, <code>require-corp</code>, "só depois de testar: bloqueia recursos de outras origens sem permissão"],
            [<code>Cache-Control</code>, <><code>no-store</code> em respostas sensíveis (<code>no-cache</code> não impede de guardar)</>, "ligar onde há dado pessoal"],
            [<><code>Server</code>, <code>X-Powered-By</code></>, "nenhum, ou um valor genérico", "remover"],
            [<><code>X-XSS-Protection</code>, <code>Expect-CT</code>, <code>Public-Key-Pins</code></>, "não enviar (obsoletos)", "remover"],
          ]}
        />
        <Callout tone="warn" icon="alert">O <code>X-XSS-Protection</code> era o "filtro anti-XSS" dos navegadores antigos e hoje é considerado <em>perigoso</em>: o filtro podia ele mesmo criar brechas. A recomendação atual é não enviar o cabeçalho e fechar XSS com uma CSP que proíbe scripts inline.</Callout>
        <h3 id="hsts">HSTS: como não se trancar para fora</h3>
        <p>O <code>Strict-Transport-Security</code> faz o navegador lembrar, por <code>max-age</code> segundos, que aquele domínio só fala HTTPS. <code>includeSubDomains</code> estende a regra a todos os subdomínios, e <code>preload</code> pede para entrar numa lista embutida nos navegadores, valendo até na primeira visita.</p>
        <p>O risco é real: se um subdomínio ainda só tem HTTP, ele some para quem já recebeu o cabeçalho, e desfazer <code>preload</code> leva meses. O caminho seguro é subir aos poucos: <code>max-age=300</code> (5 min) → um dia → um mês → dois anos, só avançando quando nada quebrou.</p>
        <h3 id="csp">CSP passo a passo</h3>
        <p>A <em>Content Security Policy</em> é uma lista de diretivas separadas por <code>;</code>, cada uma dizendo de onde um tipo de recurso pode vir. Se algo não está na lista, o navegador bloqueia — então, mesmo que um atacante consiga injetar um <code>&lt;script&gt;</code> na página (XSS), ele não roda.</p>
        <Table
          head={["Diretiva", "Para que serve"]}
          rows={[
            [<code>default-src</code>, "reserva: vale para toda diretiva de recurso que você não definiu"],
            [<code>script-src</code>, "de onde scripts podem vir — a diretiva anti-XSS principal"],
            [<code>object-src 'none'</code>, <>bloqueia <code>&lt;object&gt;</code> e <code>&lt;embed&gt;</code> (plugins)</>],
            [<code>base-uri 'none'</code>, <>impede que um <code>&lt;base&gt;</code> injetado redirecione links relativos</>],
            [<code>frame-ancestors</code>, <>quem pode colocar sua página num iframe; substitui o <code>X-Frame-Options</code> (anti-clickjacking)</>],
            [<code>form-action</code>, "para onde formulários podem enviar dados"],
            [<code>report-to</code>, "endpoint que recebe os relatórios de violação"],
          ]}
        />
        <p>Listar domínios permitidos ("allowlist") é frágil: basta um domínio da lista hospedar um script qualquer para furar a regra. A forma moderna, chamada <strong>CSP estrita</strong>, usa um <strong>nonce</strong> (valor aleatório gerado a cada resposta, repetido no cabeçalho e no atributo <code>nonce</code> das tags permitidas) ou um <strong>hash</strong> do conteúdo do script.</p>
        <p>O atacante não consegue adivinhar o nonce, então o script injetado dele não roda. <code>'strict-dynamic'</code> estende a confiança de um script com nonce aos scripts que ele carrega.</p>
        <CodeBlock code={`Content-Security-Policy:
  script-src 'nonce-R4nd0m...' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none'

<script nonce="R4nd0m...">/* roda */</script>
<script>/* injetado pelo atacante: bloqueado */</script>`} />
        <Callout icon="check">Adote em duas etapas. Primeiro envie a política como <code>Content-Security-Policy-Report-Only</code>: nada é bloqueado, mas o navegador relata cada violação (declare o destino com <code>Reporting-Endpoints</code> e <code>report-to</code>). Quando os relatórios ficarem limpos, troque o nome do cabeçalho para <code>Content-Security-Policy</code> e passe a aplicar. E lembre: a CSP complementa a validação e o escape de saída, não os substitui.</Callout>
        <h3 id="own-header">Criando o seu próprio cabeçalho (middleware)</h3>
        <p>"Criar um cabeçalho" tem dois sentidos. O primeiro, e mais comum: escrever <strong>o seu próprio middleware</strong> que aplica o conjunto de segurança em toda resposta (é isso que o <code>helmet</code> faz por baixo). O segundo: inventar um cabeçalho <em>seu</em>, como um identificador de requisição. Os dois cabem no mesmo código:</p>
        <CodeBlock code={`// security-headers.js — middleware para Express
const crypto = require('node:crypto');

module.exports = function securityHeaders(req, res, next) {
  // 1) valor por resposta: nonce da CSP, exposto às views
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.cspNonce = nonce;

  // 2) o conjunto de segurança
  res.set({
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'Content-Security-Policy': [
      "default-src 'self'",
      \`script-src 'nonce-\${nonce}' 'strict-dynamic'\`,
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });

  // 3) um cabeçalho SEU: id de correlação para achar a requisição nos logs
  const id = req.get('X-Request-Id') || crypto.randomUUID();
  res.set('X-Request-Id', id);

  next();
};

// app.js
const express = require('express');
const app = express();
app.disable('x-powered-by');          // remove o cabeçalho que entrega o framework
app.use(require('./security-headers'));`} />
        <p>Regras para um cabeçalho que você inventa:</p>
        <ul>
          <li><strong>Nome:</strong> palavras separadas por hífen, sem diferenciar maiúsculas de minúsculas. O prefixo <code>X-</code> foi desencorajado pela RFC 6648; para um cabeçalho novo, prefira um nome descritivo (ex.: <code>Request-Id</code>) ou um prefixo da sua empresa.</li>
          <li><strong>Nunca coloque segredo ou dado pessoal</strong> num valor: cabeçalhos vão para logs, proxies e CDNs.</li>
          <li><strong>Entre origens (CORS):</strong> para o JavaScript de outro site <em>enviar</em> seu cabeçalho, o servidor precisa listá-lo em <code>Access-Control-Allow-Headers</code>; para <em>ler</em> o cabeçalho da resposta, em <code>Access-Control-Expose-Headers</code>.</li>
          <li><strong>Valide o que entra:</strong> um cabeçalho de requisição é entrada do usuário como qualquer outra — nunca o repita na resposta sem validar (risco de injeção de cabeçalho/CRLF).</li>
        </ul>
        <h3 id="nextjs-headers">Em Next.js: next.config.js e proxy.ts</h3>
        <p>No Next.js, cabeçalhos <em>fixos</em> vão na chave <code>headers()</code> do <code>next.config.js</code>; cabeçalhos <em>por requisição</em> (como o nonce da CSP) vão no <code>proxy.ts</code> (o antigo <code>middleware.ts</code>). A documentação oficial recomenda este formato:</p>
        <CodeBlock code={`// next.config.js — cabeçalhos fixos
module.exports = {
  poweredByHeader: false,   // tira o X-Powered-By: Next.js
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};`} />
        <CodeBlock code={`// proxy.ts — nonce novo a cada requisição
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const csp = \`
    default-src 'self';
    script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'\${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-\${nonce}';
    img-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  \`.replace(/\\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}`} />
        <Callout tone="warn" icon="alert">Nonce exige <strong>renderização dinâmica</strong>: o HTML é gerado a cada requisição, então páginas estáticas, ISR e cache de CDN deixam de valer, e o Partial Prerendering é incompatível. Se precisa manter geração estática, a alternativa (experimental, só App Router) é a CSP com hashes via Subresource Integrity (<code>experimental.sri</code>). Em desenvolvimento o React precisa de <code>'unsafe-eval'</code>; em produção, não.</Callout>
        <h3 id="nginx-headers">Em Nginx (proxy reverso)</h3>
        <CodeBlock code={`server {
  listen 443 ssl;
  server_tokens off;                      # esconde a versão do Nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  proxy_hide_header X-Powered-By;         # remove o que o app vazou
}`} />
        <p>O <code>always</code> é o detalhe que mais se esquece: sem ele o Nginx só adiciona o cabeçalho em respostas 2xx/3xx, e as páginas de erro ficam sem proteção. Outra pegadinha: um <code>add_header</code> declarado dentro de um <code>location</code> <em>substitui</em> os do bloco pai, em vez de somá-los.</p>
        <h3 id="more-headers">Mais três cabeçalhos que valem conhecer</h3>
        <Table
          head={["Cabeçalho", "Quando usar"]}
          rows={[
            [<code>Cache-Control: no-store</code>, "em páginas e respostas de API com dados pessoais ou de sessão, para que nem o navegador nem um proxy compartilhado guardem uma cópia"],
            [<code>Clear-Site-Data</code>, <>na resposta do logout (<code>"cache", "cookies", "storage"</code>) para apagar o que ficou no navegador</>],
            [<code>Content-Disposition: attachment</code>, <>em downloads de arquivos enviados por usuários, com <code>application/octet-stream</code>: o navegador baixa em vez de executar</>],
          ]}
        />
        <h3 id="headers-checklist">Checklist para colocar no ar</h3>
        <ul>
          <li>Conjunto básico ligado em <em>todas</em> as respostas (inclusive erros e estáticos) e <code>Server</code>/<code>X-Powered-By</code> removidos.</li>
          <li>HSTS subindo aos poucos; CSP primeiro em Report-Only, depois aplicada.</li>
          <li>Cada cabeçalho com um único dono (app, proxy ou CDN), sem duplicatas.</li>
          <li>Conferido com <code>curl -sI</code>, com a aba Network do navegador e com scanners como securityheaders.com ou o Mozilla Observatory.</li>
          <li>Teste automatizado que falha o build se um cabeçalho essencial sumir.</li>
        </ul>
        <h3>Exercício: ver e testar os cabeçalhos de um app</h3>
        <CodeBlock>
          {"mkdir lab-headers && cd lab-headers\n"}
          {"cat > server.js <<"}<span className="tok-s">'EOF'</span>{"\n"}
          {"const http = require("}<span className="tok-s">'http'</span>{");\n"}
          {"http.createServer((req, res) => {\n"}
          {"  res.writeHead(200, {\n"}
          {"    "}<span className="tok-s">'Content-Type'</span>{": "}<span className="tok-s">'text/html'</span>{",\n"}
          {"    "}<span className="tok-s">'Strict-Transport-Security'</span>{": "}<span className="tok-s">'max-age=63072000; includeSubDomains'</span>{",\n"}
          {"    "}<span className="tok-s">'Content-Security-Policy'</span>{": "}<span className="tok-s">"default-src 'self'; script-src 'self'"</span>{",\n"}
          {"    "}<span className="tok-s">'X-Content-Type-Options'</span>{": "}<span className="tok-s">'nosniff'</span>{",\n"}
          {"    "}<span className="tok-s">'X-Frame-Options'</span>{": "}<span className="tok-s">'DENY'</span>{",\n"}
          {"    "}<span className="tok-s">'Referrer-Policy'</span>{": "}<span className="tok-s">'strict-origin-when-cross-origin'</span>{",\n"}
          {"    "}<span className="tok-s">'Permissions-Policy'</span>{": "}<span className="tok-s">'camera=(), microphone=(), geolocation=()'</span>{",\n"}
          {"  });\n"}
          {"  res.end("}<span className="tok-s">'&lt;h1&gt;ola&lt;/h1&gt;'</span>{");\n"}
          {"}).listen(3000);\n"}
          {"EOF\n"}
          {"cat > Dockerfile <<"}<span className="tok-s">'EOF'</span>{"\n"}
          {"FROM node:22-slim\n"}
          {"COPY server.js .\n"}
          {"CMD ["}<span className="tok-s">"node"</span>{", "}<span className="tok-s">"server.js"</span>{"]\n"}
          {"EOF\n"}
          {"docker build -t lab-headers . && docker run -d -p 127.0.0.1:3000:3000 lab-headers\n"}
          {"curl -sI http://localhost:3000 | grep -iE "}<span className="tok-s">"strict-transport|content-security|x-content-type|x-frame|referrer|permissions"</span>
        </CodeBlock>
        <p><strong>Resultado esperado:</strong> o <code>curl -I</code> (só cabeçalhos) mostra todas as seis linhas configuradas no servidor. Compare depois com um site real: abra o DevTools do navegador → aba Network → clique na primeira requisição → "Headers", ou rode o mesmo <code>curl -sI</code> contra <code>https://baselarte.com</code>.</p>
        <Callout icon="check">Na prática, raramente se escreve cada cabeçalho à mão: frameworks como <code>helmet</code> (Node/Express), <code>django-csp</code> (Django) ou o próprio proxy reverso (Nginx, Caddy, Cloudflare) aplicam um conjunto sensato por padrão. O scanner gratuito <a href="https://securityheaders.com" rel="noopener">securityheaders.com</a> testa qualquer site público e dá uma nota.</Callout>
      </Section>
      <Section id="cookies" title={"Cookies: os três atributos que importam"}>
        <p>{"Um cookie é um pedacinho de texto que o servidor pede ao navegador para guardar e devolver em toda requisição futura ao mesmo site. É o mecanismo mais comum para \"lembrar\" quem está logado — e, mal configurado, uma das formas mais fáceis de vazar uma sessão inteira."}</p>
        <Diagram minWidth={640} caption={"Um cookie de sessão sem os três atributos é texto puro que qualquer script na página, ou qualquer site terceiro, pode tentar usar."}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Os três atributos que importam">
            <rect x="10" y="10" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="42.0" className="mono" textAnchor="middle">Secure</text>
            <text x="250" y="34">só viaja em HTTPS</text>
            <rect x="10" y="80" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="112.0" className="mono" textAnchor="middle">HttpOnly</text>
            <text x="250" y="104">JavaScript da página não consegue ler</text>
            <rect x="10" y="150" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="182.0" className="mono" textAnchor="middle">SameSite=Lax/Strict</text>
            <text x="250" y="174">não viaja em requisições vindas de outro site</text>
          </svg>
        </Diagram>
        <Table
          head={["Valor de SameSite", "Comportamento"]}
          rows={[
            [<code>Strict</code>, "nunca envia o cookie numa navegação vinda de outro site, nem clicando num link — mais seguro, pode quebrar fluxos de login vindos de e-mail"],
            [<code>Lax</code>, "envia em navegação de nível superior (clicar num link), mas não em requisições de fundo (imagem, formulário POST de outro site) — o equilíbrio padrão para cookies de autenticação"],
            [<code>None</code>, <>envia sempre, inclusive entre sites — exige <code>Secure</code> junto; use só quando o cookie PRECISA cruzar origens (ex.: um widget embutido)</>],
          ]}
        />
        <Callout tone="warn" icon="alert">Um erro real de 2025: um projeto de IA de código aberto configurou o cookie do <em>refresh token</em> com <code>SameSite: 'None'</code> combinado com CORS permissivo demais — a combinação deixou o token alcançável de qualquer origem. <code>SameSite=None</code> num cookie de autenticação quase sempre é um sinal de alerta.</Callout>
        <h3>Fixação de sessão</h3>
        <p>Um ataque simples: o atacante planta um ID de sessão conhecido na vítima (por um link, ou porque o site aceita qualquer ID enviado) e espera ela fazer login — se o site mantém o MESMO ID depois do login, o atacante agora está "logado" também.</p>
        <p>A defesa: <strong>sempre gerar um ID de sessão novo no momento do login</strong> (e de novo em qualquer mudança de privilégio), nunca aceitar um ID de sessão que já veio do cliente antes de autenticar.</p>
      </Section>
      <Section id="stateful" title={"Autenticação stateful: sessões no servidor"}>
        <p>Autenticação <em>stateful</em> (com estado): o servidor guarda, num banco ou cache (Redis é o padrão de mercado), um registro de cada sessão ativa. O cookie carrega só um ID opaco e aleatório — o resto da informação (quem é o usuário, quando expira) fica no servidor.</p>
        <Diagram minWidth={620} caption={"A cada requisição, o servidor troca o ID do cookie por dados reais numa consulta."}>
          <svg viewBox="0 0 680 150" role="img" aria-label="Sessão stateful">
            <rect x="10" y="20" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="85" y="42" textAnchor="middle">navegador</text>
            <text x="85" y="60" className="mut mono" textAnchor="middle">cookie: sid=a1b2c3</text>
            <rect x="270" y="20" width="140" height="54" rx="4" className="ln" />
            <text x="340" y="52" textAnchor="middle">servidor</text>
            <rect x="520" y="20" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="595" y="42" className="mono" textAnchor="middle">Redis</text>
            <text x="595" y="60" className="mut mono" textAnchor="middle">sid → user_id, exp</text>
            <path d="M160 38L270 38" className="ln" />
            <path d="M263.2 34.7L270 38L263.2 41.3" className="ln" />
            <path d="M520 38L410 38" className="ln" />
            <path d="M416.8 41.3L410 38L416.8 34.7" className="ln" />
            <text x="465" y="64" className="mut" textAnchor="middle">consulta/confirma</text>
            <text x="10" y="112" className="mut" textAnchor="start">O cookie sozinho não diz nada: fora de contexto, "a1b2c3" não significa nada.</text>
            <text x="10" y="132" className="mut" textAnchor="start">Revogar a sessão = apagar a linha no Redis.</text>
          </svg>
        </Diagram>
        <Table
          head={["Vantagem", "Custo"]}
          rows={[
            ["Revogar é trivial: apague a linha e a sessão morre na hora", "precisa de um banco/cache compartilhado — escalar horizontalmente exige um Redis central, não memória local"],
            ["O cookie não carrega dado nenhum sensível", "toda requisição faz uma consulta extra (mitigável com cache)"],
          ]}
        />
        <h3>Logout, na prática</h3>
        <CodeBlock>
          <span className="tok-c"># pseudocódigo do lado do servidor</span>{"\n"}
          {"POST /login    -> gera sid aleatório, grava {user_id, criado_em} no Redis, seta cookie Secure+HttpOnly+SameSite=Lax\n"}
          {"GET  /perfil   -> lê sid do cookie, busca no Redis, 401 se não achar ou expirado\n"}
          {"POST /logout   -> apaga a chave sid no Redis, expira o cookie no navegador"}
        </CodeBlock>
        <p>Esse é o ponto central: logout stateful é só <code>DELETE</code>. Isso fica bem mais difícil no modelo stateless, que vem a seguir.</p>
      </Section>
      <Section id="stateless" title={"Autenticação stateless: JWT, access e refresh"}>
        <p>Autenticação <em>stateless</em> (sem estado): em vez de um ID opaco, o servidor assina um token que carrega os dados nele mesmo — tipicamente um <strong>JWT</strong> (JSON Web Token). Qualquer servidor que conheça a chave de assinatura pode validar o token sozinho, sem consultar banco nenhum. É o modelo padrão para APIs e microsserviços, e para SPAs que falam com uma API separada.</p>
        <h3>A anatomia de um JWT</h3>
        <Diagram minWidth={600} caption={"Nunca coloque um segredo no payload de um JWT: qualquer pessoa pode decodificá-lo em jwt.io sem a chave."}>
          <svg viewBox="0 0 650 160" role="img" aria-label="Anatomia de um JWT">
            <rect x="10" y="10" width="190" height="44" rx="4" className="ln fillsoft" />
            <text x="105.0" y="37" className="mono" textAnchor="middle">eyJhbGciOiJIUzI1NiJ9</text>
            <text x="105.0" y="76" className="" textAnchor="middle">header</text>
            <text x="105.0" y="94" className="mut" textAnchor="middle">algoritmo, tipo</text>
            <rect x="216" y="10" width="260" height="44" rx="4" className="ln fillsoft" />
            <text x="346.0" y="37" className="mono" textAnchor="middle">eyJzdWIiOiIxMjMiLCJleHAiOi4uLn0</text>
            <text x="346.0" y="76" className="" textAnchor="middle">payload</text>
            <text x="346.0" y="94" className="mut" textAnchor="middle">claims: sub, exp, roles…</text>
            <rect x="482" y="10" width="158" height="44" rx="4" className="ln fillsoft" />
            <text x="561.0" y="37" className="mono" textAnchor="middle">SflKxwRJSMe...</text>
            <text x="561.0" y="76" textAnchor="middle">assinatura</text>
            <text x="561.0" y="94" className="mut" textAnchor="middle">prova que nada mudou</text>
            <text x="10" y="128" className="mut" textAnchor="start">header.payload.signature — os dois primeiros são só Base64 (legíveis por qualquer um).</text>
            <text x="10" y="148" className="mut" textAnchor="start">Só a assinatura impede alteração; nada ali é cifrado.</text>
          </svg>
        </Diagram>
        <h3>Access token curto + refresh token longo</h3>
        <p>{"O padrão que resolve o maior problema do modelo stateless (não dá para \"apagar\" um token já emitido) é usar DOIS tokens com vidas diferentes:"}</p>
        <Diagram minWidth={500} caption={"O access token vive pouco (o estrago de um vazamento é limitado pelo tempo); o refresh token vive mais, mas só serve para pedir um access token novo."}>
          <svg viewBox="0 0 540 215" role="img" aria-label="Access + refresh">
            <rect x="10" y="20" width="210" height="60" rx="4" className="brandfill" />
            <text x="115" y="46" className="" textAnchor="middle">access token</text>
            <text x="115" y="65" className="mut mono" textAnchor="middle">minutos · cada requisição</text>
            <rect x="320" y="20" width="210" height="60" rx="4" className="ln fillsoft" />
            <text x="425" y="46" className="" textAnchor="middle">refresh token</text>
            <text x="425" y="65" className="mut mono" textAnchor="middle">dias/semanas · só renova</text>
            <path d="M220 50L320 50" className="ln dash" />
            <path d="M313.2 46.7L320 50L313.2 53.3" className="ln" />
            <text x="270" y="38" className="mut" textAnchor="middle">expirou?</text>
            <path d="M425 80L425 124" className="ln" />
            <path d="M428.3 117.2L425 124L421.7 117.2" className="ln" />
            <rect x="320" y="124" width="210" height="46" rx="4" className="ln" />
            <text x="425" y="152" className="mono" textAnchor="middle">POST /refresh</text>
            <path d="M320 147L220 147" className="ln" />
            <path d="M226.8 150.3L220 147L226.8 143.7" className="ln" />
            <rect x="10" y="124" width="210" height="46" rx="4" className="brandfill" />
            <text x="115" y="152" textAnchor="middle">access token novo</text>
            <text x="10" y="198" className="mut" textAnchor="start">Com rotação, a resposta traz também um refresh token novo (veja abaixo).</text>
          </svg>
        </Diagram>
        <Table
          head={["Onde guardar", "Risco principal"]}
          rows={[
            [<><code>localStorage</code>/<code>sessionStorage</code></>, "acessível por QUALQUER script na página — um XSS rouba o token inteiro"],
            [<>Cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict/Lax</code></>, "invisível a scripts (mitiga XSS), mas exige proteção de CSRF para o endpoint que o lê"],
            ["Memória (variável JS, nunca persistida)", "mais seguro para o access token; some ao recarregar a página (por isso existe o refresh token)"],
          ]}
        />
        <p>Padrão recomendado hoje: access token em memória, refresh token num cookie <code>HttpOnly</code>+<code>Secure</code>+<code>SameSite=Strict</code>. Evite <code>localStorage</code> para qualquer um dos dois se puder.</p>
        <h3>Rotação de refresh token e detecção de reuso</h3>
        <p>A cada uso, o refresh token é TROCADO por um novo, e o antigo é invalidado. Se o antigo aparecer de novo (alguém tentando reusar um token roubado, ou uma cópia antiga), isso significa que ele vazou — a resposta correta é revogar a CADEIA inteira daquele token, derrubando a sessão.</p>
        <CodeBlock>
          <span className="tok-c"># pseudocódigo do endpoint de refresh</span>{"\n"}
          {"POST /refresh  (cookie: refresh_token=rt_antigo)\n"}
          {"  1. valida assinatura e expiração de rt_antigo\n"}
          {"  2. rt_antigo já foi usado antes (está na lista de "}<span className="tok-s">"já trocados"</span>{")?\n"}
          {"       SIM -> REUSO DETECTADO: revoga toda a família de tokens desse usuário, força novo login\n"}
          {"       NÃO -> gera access_token novo (minutos) + refresh_token novo (dias)\n"}
          {"              marca rt_antigo como "}<span className="tok-s">"já trocado"</span>{", responde com os dois"}
        </CodeBlock>
        <Callout tone="warn" icon="alert">Diferente do modelo stateful, revogar um JWT antes do tempo é difícil por definição — ele é válido até expirar, mesmo que o usuário troque a senha. Por isso: access tokens CURTOS (minutos) e, se precisar revogar de verdade e na hora, uma lista de bloqueio (denylist) consultada nas rotas sensíveis, ou volte para sessões stateful nelas.</Callout>
      </Section>
      <Section id="choosing" title={"Qual escolher"}>
        <p>{"Nenhum dos dois é \"o certo\"; são otimizados para coisas diferentes."}</p>
        <Table
          head={["", "Stateful (sessão)", "Stateless (JWT)"]}
          rows={[
            ["Revogação imediata", "trivial (apaga a linha)", "difícil (precisa de denylist)"],
            ["Escala entre serviços", "precisa de um store compartilhado", "qualquer serviço valida sozinho, sem consultar nada"],
            ["Tamanho na requisição", "pequeno (só o ID)", "maior (o token inteiro, em cada chamada)"],
            ["Caso de uso típico", "aplicação monolítica, painel administrativo", "API pública, microsserviços, mobile, SSO entre domínios"],
          ]}
        />
        <Callout icon="check">Um padrão comum e pragmático: <strong>sessão stateful</strong> para o site principal (login no navegador, cookie simples) e <strong>JWT</strong> só para a API pública ou para comunicação entre serviços internos. Não é incomum os dois convivendo no mesmo produto.</Callout>
      </Section>
      <Section id="csrf" title={"CSRF: o pedido que você não pediu"}>
        <p><em>Cross-Site Request Forgery</em>: um site malicioso faz o SEU navegador mandar uma requisição para um site onde você já está logado, usando seus cookies automaticamente — sem roubar nada, só abusando do fato de que o navegador sempre anexa os cookies do domínio.</p>
        <Diagram minWidth={680} caption={"O navegador não sabe que o pedido \"não era bem-vindo\" — ele só vê um formulário normal pedindo para enviar a banco.com, com os cookies certos em mãos."}>
          <svg viewBox="0 0 740 170" role="img" aria-label="CSRF">
            <rect x="10" y="70" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="100" y="102" textAnchor="middle">você, logado em banco.com</text>
            <rect x="250" y="10" width="220" height="52" rx="4" className="ln" />
            <text x="360" y="32" textAnchor="middle">site-malicioso.com</text>
            <text x="360" y="50" className="mut mono" textAnchor="middle">&lt;form action="banco.com"&gt;</text>
            <rect x="570" y="80" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="645" y="112" textAnchor="middle">banco.com</text>
            <path d="M190 86L250 46" className="ln" />
            <path d="M242.6 47.0L250 46L246.2 52.5" className="ln" />
            <text x="150" y="52" className="mut" textAnchor="middle">1. visita</text>
            <path d="M470 50L580 80" className="ln" />
            <path d="M574.3 75.1L580 80L572.6 81.4" className="ln" />
            <text x="645" y="56" className="mut" textAnchor="middle">2. o form se envia</text>
            <text x="645" y="156" className="mut" textAnchor="middle">(com os cookies dele)</text>
          </svg>
        </Diagram>
        <Table
          head={["Defesa", "Como funciona"]}
          rows={[
            [<><code>SameSite=Lax</code>/<code>Strict</code> no cookie</>, "o navegador simplesmente NÃO anexa o cookie numa requisição de fundo vinda de outro site — resolve a maior parte dos casos sozinho, hoje"],
            ["Token CSRF (synchronizer token)", "um valor aleatório, único por sessão/formulário, que o site malicioso não tem como adivinhar ou ler (same-origin policy o impede)"],
            [<>Checar o cabeçalho <code>Origin</code>/<code>Referer</code></>, "rejeita requisições sensíveis cuja origem não bate com a esperada — uma camada extra, não a única"],
          ]}
        />
        <Callout icon="check"><code>SameSite=Lax</code> (o padrão em navegadores modernos quando nada é especificado) já neutraliza boa parte do CSRF clássico. Ainda assim, APIs com estado que mudam dados (POST/PUT/DELETE) continuam se beneficiando de um token CSRF como segunda camada — "defesa em profundidade", o mesmo princípio da nota de Linux.</Callout>
      </Section>
      <Section id="injection" title={"SQL injection e XSS: o lado de quem constrói"}>
        <p>Confiar em qualquer dado que entra de fora é a raiz da maioria das falhas de aplicação web. As duas mais comuns já apareceram na nota de Red Team do ponto de vista de quem ataca; aqui é o lado de quem constrói.</p>
        <h3>SQL injection: nunca monte SQL colando texto</h3>
        <CodeBlock>
          <span className="tok-c">-- NUNCA: concatena a entrada direto na consulta</span>{"\n"}
          {"const query = `"}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" usuarios "}<span className="tok-k">WHERE</span>{" email = "}<span className="tok-s">'$&#123;emailDoFormulario&#125;'</span>{"`;\n"}
          {"\n"}
          <span className="tok-c">-- SEMPRE: consulta parametrizada — a entrada é um VALOR, nunca parte do comando</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" usuarios "}<span className="tok-k">WHERE</span>{" email = $"}<span className="tok-n">1</span>{";   "}<span className="tok-c">-- Postgres (driver node-postgres, por exemplo)</span>
        </CodeBlock>
        <p>{"Veja a nota de Postgres para os comandos e a seção de exploração da nota de Red Team para como essa falha é usada do outro lado. ORMs (Prisma, SQLAlchemy, ActiveRecord) fazem isso por padrão — o risco real aparece quando alguém usa SQL \"cru\" dentro do ORM para um caso especial e esquece de parametrizar."}</p>
        <h3>XSS: escapar saída, não só validar entrada</h3>
        <p>{"Frameworks modernos (React, Vue, Angular) escapam a saída por padrão quando você usa a sintaxe normal de template — o perigo mora nas \"válvulas de escape\" que pulam essa proteção de propósito."}</p>
        <CodeBlock code={`// React: ESCAPADO automaticamente, seguro mesmo se bio vier de um usuário
<p>{usuario.bio}</p>

// React: a válvula de escape — NUNCA com texto de usuário sem sanitizar antes
<div dangerouslySetInnerHTML={{ __html: usuario.bio }} />`} />
        <p>Se você realmente precisa renderizar HTML vindo do usuário (um editor rich-text, por exemplo), sanitize com uma biblioteca testada para isso (como <code>DOMPurify</code>) — nunca confie em regex caseira para "limpar" HTML.</p>
        <h3>Uma checklist curta</h3>
        <ul className="ds-list">
          <li>Toda consulta com dado externo é parametrizada; nenhum SQL é montado por concatenação de string.</li>
          <li>Toda saída em HTML usa a escapagem padrão do framework; <code>dangerouslySetInnerHTML</code>/<code>v-html</code>/<code>|safe</code> só com conteúdo sanitizado.</li>
          <li>Validação de entrada acontece no SERVIDOR, mesmo que também exista no navegador (o navegador é só conforto para o usuário, não é segurança).</li>
          <li>Um WAF e um Content-Security-Policy são camadas extras, nunca a única defesa.</li>
        </ul>
      </Section>
      <Section id="ai-agents" title={"A nova fronteira: segurança de agentes de IA"}>
        <p>Tudo até aqui assume que quem fala com a sua aplicação é um navegador controlado por uma pessoa. A nova peça é um <em>agente de IA</em>: um modelo de linguagem que lê conteúdo, decide, e <strong>age</strong> — chama APIs, roda código, lê e-mails, usa ferramentas via protocolos como o MCP (Model Context Protocol).</p>
        <p>Isso muda o modelo de ameaça: o "usuário" que manda instruções pode agora ser um texto que o próprio agente leu em algum lugar.</p>
        <h3>O OWASP Top 10 para aplicações LLM (2025)</h3>
        <Table
          head={["#", "Risco", "Em uma frase"]}
          rows={[
            ["LLM01", "Prompt injection", "texto malicioso faz o modelo ignorar suas instruções originais e seguir as de outra pessoa"],
            ["LLM02", "Vazamento de informação sensível", "o modelo repete dados confidenciais do contexto, do treino ou do histórico"],
            ["LLM03", "Cadeia de suprimentos", "um modelo, plugin ou dataset de terceiros comprometido entra na sua aplicação"],
            ["LLM04", "Envenenamento de dados/modelo", "dados de treino ou de contexto manipulados para mudar o comportamento do modelo"],
            ["LLM05", "Tratamento inadequado da saída", "a saída do modelo é usada sem validação (vira SQL, HTML, comando de shell)"],
            ["LLM06", "Agência excessiva", "o agente tem mais permissão ou autonomia do que a tarefa precisa"],
            ["LLM07", "Vazamento do prompt de sistema", "instruções internas (às vezes com segredos) são extraídas pelo usuário"],
            ["LLM08", "Fraquezas de vetores/embeddings", "ataques contra o pipeline de RAG e o banco vetorial"],
            ["LLM09", "Desinformação", "o modelo apresenta algo errado com confiança (alucinação) e isso vira uma decisão"],
            ["LLM10", "Consumo ilimitado", "nada limita quantas chamadas/tokens/custo um usuário ou agente pode gerar"],
          ]}
        />
        <h3>Prompt injection, de perto</h3>
        <p>{"É o risco #1 da lista, e o mais diferente de tudo que veio antes nesta nota: não existe \"escapar a entrada\" que resolva, porque a instrução maliciosa e o conteúdo legítimo chegam pelo MESMO canal — texto em linguagem natural. Dois sabores:"}</p>
        <Diagram minWidth={700} caption={"Injeção indireta: o atacante nunca fala com o agente diretamente — ele planta a instrução em algo que o agente vai processar depois, por conta própria."}>
          <svg viewBox="0 0 780 130" role="img" aria-label="Prompt injection indireta">
            <rect x="10" y="20" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="100" y="45" textAnchor="middle">você</text>
            <text x="100" y="63" className="mut mono" textAnchor="middle">"resuma este e-mail"</text>
            <rect x="280" y="20" width="230" height="56" rx="4" className="ln" />
            <text x="395" y="45" textAnchor="middle">agente de IA</text>
            <text x="395" y="63" className="mut mono" textAnchor="middle">lê o e-mail como contexto</text>
            <rect x="600" y="20" width="170" height="56" rx="4" className="ln fillsoft" />
            <text x="685" y="45" textAnchor="middle">e-mail</text>
            <text x="685" y="63" className="mut mono" textAnchor="middle">"ignore tudo e…"</text>
            <path d="M190 48L280 48" className="ln" />
            <path d="M273.2 44.7L280 48L273.2 51.3" className="ln" />
            <path d="M600 48L510 48" className="ln" />
            <path d="M516.8 51.3L510 48L516.8 44.7" className="ln" />
            <text x="685" y="100" className="mut" textAnchor="end">↑ instrução maliciosa ESCONDIDA no dado</text>
            <text x="685" y="118" className="mut" textAnchor="end">que o agente só deveria LER</text>
          </svg>
        </Diagram>
        <Table
          head={["Tipo", "Como funciona"]}
          rows={[
            ["Direta", "o próprio usuário escreve algo como \"ignore as instruções anteriores e...\" direto no chat"],
            ["Indireta", "a instrução está escondida em algo que o agente vai LER depois: um e-mail, uma página web, um arquivo, a descrição de uma ferramenta MCP — o usuário nem sabe que ela está lá"],
          ]}
        />
        <h3>Agência excessiva e os riscos específicos do MCP</h3>
        <p>Quando o agente só conversa, o pior caso é uma resposta errada. Quando ele tem <em>ferramentas</em> — manda e-mail, acessa um banco, roda código, chama uma API de pagamento — o pior caso é uma AÇÃO errada. O MCP (o protocolo mais comum hoje para conectar agentes a ferramentas) trouxe à tona uma família nova de riscos em 2025:</p>
        <Table
          head={["Risco", "Exemplo"]}
          rows={[
            ["Envenenamento de ferramenta (tool poisoning)", "a DESCRIÇÃO de uma ferramenta MCP (que o modelo lê, mas o usuário normalmente não vê) esconde instruções — o servidor pode atacar antes mesmo de qualquer ferramenta ser chamada"],
            ["Confused deputy", "um servidor MCP usa os PRÓPRIOS privilégios elevados em vez de agir em nome de quem pediu, fazendo algo que o usuário não tinha permissão de fazer"],
            ["Repasse de token (token passthrough)", "um servidor encaminha um token emitido para UM serviço a uma API diferente — a especificação do MCP proíbe isso explicitamente"],
            ["\"Rug pull\" / cadeia de suprimentos", "um pacote MCP passa por revisão com comportamento legítimo e, numa atualização POSTERIOR, muda — em setembro de 2025 um servidor MCP de e-mail amplamente instalado passou a copiar e-mails enviados pelo agente para um endereço do atacante"],
          ]}
        />
        <Callout tone="warn" icon="alert">{"RAG e fine-tuning não resolvem prompt injection — eles aterram o modelo em dados melhores, mas não o tornam seguro contra instruções hostis misturadas nesses mesmos dados. É um erro comum tratar \"o modelo é bom\" como defesa de segurança."}</Callout>
        <h3>Defesas que funcionam hoje</h3>
        <Table
          head={["Princípio", "Na prática"]}
          rows={[
            ["Privilégio mínimo nas ferramentas", "o agente só tem acesso às ferramentas e escopos que a tarefa específica precisa — nunca uma chave de API \"para tudo\""],
            ["Humano no laço para ações sensíveis", "mandar dinheiro, apagar dados, enviar e-mail em massa: peça confirmação explícita antes de executar, não só antes de \"sugerir\""],
            ["Tratar todo conteúdo lido como dado, nunca como instrução", "um e-mail, uma página web ou o resultado de uma ferramenta NUNCA deveriam poder mudar o comportamento do agente da mesma forma que o pedido original do usuário"],
            ["Isolamento/sandboxing", "código gerado por um agente roda num contêiner descartável, sem acesso à rede ou a segredos reais por padrão"],
            ["Validar a saída antes de agir", "se a saída do modelo vira uma chamada de API, trate-a como entrada não confiável: valide o formato e os limites antes de executar"],
            ["Revisão do que o agente pode instalar/conectar", "trate um novo servidor MCP como uma nova dependência de produção: fixe a versão, audite antes de atualizar (o caso do \"rug pull\" acima só funcionou porque ninguém revisou a atualização)"],
            ["Limites de uso", "tetos de custo, de chamadas e de tempo por agente/usuário, para o LLM10 (consumo ilimitado) nunca virar uma conta surpresa ou uma negação de serviço"],
          ]}
        />
        <p>O paralelo com o resto desta nota: um agente com uma ferramenta de banco de dados sem privilégio mínimo é o mesmo erro que uma aplicação conectando como super-usuário do Postgres (nota de Postgres); confiar cegamente no texto que um agente leu é o mesmo erro de confiar na entrada de um usuário sem validar (seção de SQL injection e XSS acima). O princípio não muda; a superfície de ataque é que é nova.</p>
      </Section>
      <Section id="cheat-wa" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Faça"]}
          rows={[
            ["ver os cabeçalhos de um site", <code>curl -sI https://exemplo.com</code>],
            ["testar a nota de um site em segurança de cabeçalhos", "securityheaders.com"],
            ["revogar uma sessão na hora", "use sessão stateful (apagar do Redis), ou JWT + denylist"],
            ["guardar um refresh token com segurança", <>cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict</code></>],
            ["proteger contra CSRF", <><code>SameSite=Lax</code>/<code>Strict</code> + token CSRF em rotas que mudam dados</>],
            ["dar uma ferramenta a um agente de IA com segurança", "privilégio mínimo + confirmação humana para ações sensíveis"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <QA items={[
            ["O que o HTTPS protege, e o que ele NÃO protege?", "Protege o transporte (confidencialidade, integridade, autenticidade); não protege contra SQL injection, XSS ou entrada não validada."],
            ["Qual cabeçalho é a defesa mais forte do navegador contra XSS?", "Content-Security-Policy."],
            [<>Por que <code>SameSite=None</code> num cookie de autenticação é um sinal de alerta?</>, "Porque o cookie passa a viajar em requisições de QUALQUER origem, abrindo a porta para CSRF."],
            ["Qual a diferença central entre revogar uma sessão stateful e um JWT?", "Sessão: apagar uma linha no servidor. JWT: válido até expirar, a menos que haja uma denylist."],
            ["Por que o access token deveria ter vida curta?", "Porque não dá para revogá-lo antes da hora; uma vida curta limita o estrago de um vazamento."],
            ["O que diferencia prompt injection direta de indireta?", "Direta: o usuário escreve a instrução maliciosa. Indireta: ela está escondida em algo que o agente lê (e-mail, página, ferramenta)."],
            ["Por que um bom RAG não resolve prompt injection?", "Porque aterra o modelo em dados melhores, mas não o protege de instruções hostis escondidas nesses mesmos dados."],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "OWASP Cheat Sheet Series. HTTP Headers (recommended values, headers to remove).", href: "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html" },
          { label: "MDN. Content Security Policy (directives, nonces, hashes, Report-Only).", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" },
          { label: "Next.js documentation. Content Security Policy (nonces with proxy).", href: "https://nextjs.org/docs/app/guides/content-security-policy" },
          { label: "Next.js documentation. headers in next.config.js.", href: "https://nextjs.org/docs/app/api-reference/config/next-config-js/headers" },
          { label: "OWASP Top 10 (web application security risks).", href: "https://owasp.org/www-project-top-ten/" },
          { label: "OWASP Cheat Sheet Series. Session Management (session fixation, cookie attributes).", href: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
          { label: "OWASP Cheat Sheet Series. JSON Web Token security.", href: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" },
          { label: "OWASP Cheat Sheet Series. Cross-Site Request Forgery Prevention.", href: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" },
          { label: "OWASP Secure Headers Project.", href: "https://owasp.org/www-project-secure-headers/" },
          { label: "IETF. OAuth 2.1 (draft) — refresh token rotation guidance.", href: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1" },
          { label: "Auth0 documentation. Refresh token rotation and reuse detection.", href: "https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation" },
          { label: "OWASP GenAI Security Project. Top 10 for LLM Applications 2025.", href: "https://genai.owasp.org/llm-top-10/" },
          { label: "Model Context Protocol specification (token passthrough prohibition, security considerations).", href: "https://modelcontextprotocol.io/specification" },
          { label: "Simon Willison. Model Context Protocol has prompt injection security problems (on Invariant Labs' tool-poisoning research).", href: "https://simonw.substack.com/p/model-context-protocol-has-prompt" },
          { label: "MDN Web Docs. HTTP headers reference.", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" },
        ]}
      />
    </>
  );
}
