import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "web-app-security",
  title: { en: "Secure web apps: headers, auth and agents", pt: "Apps web seguros: cabeçalhos, auth e agentes" },
  seo: {
    title: { en: "Secure web apps: headers, auth and AI agents", pt: "Apps web seguros: cabeçalhos, auth e agentes de IA" },
    description: { en: "HTTPS and security headers (HSTS, CSP with nonces, building your own middleware, Next.js and Nginx), cookie attributes, stateful sessions vs. stateless JWT (access + refresh tokens), CSRF, SQL injection and XSS from the builder's side, and the new frontier: AI agent security (prompt injection, excessive agency, MCP risks), per OWASP.", pt: "HTTPS e cabeçalhos de segurança (HSTS, CSP com nonce, middleware próprio, Next.js e Nginx), atributos de cookie, sessões stateful vs. JWT stateless (access e refresh tokens), CSRF, SQL injection e XSS do lado de quem constrói, e a nova fronteira: segurança de agentes de IA (prompt injection, agência excessiva, riscos do MCP), segundo a OWASP." },
  },
  summary: "HTTPS and security headers (HSTS, CSP with nonces, building your own middleware, Next.js and Nginx), cookie attributes, stateful sessions vs. stateless JWT (access + refresh tokens), CSRF, SQL injection and XSS from the builder's side, and AI agent security (prompt injection, excessive agency, MCP risks) per OWASP.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Web apps, <em>protected end to end.</em></>, pt: <>Apps web, <em>protegidos de ponta a ponta.</em></> },
  heroLede: { en: "From HTTPS and security headers to stateful sessions, stateless JWTs, CSRF, injection — and the new frontier of AI agent security.", pt: "De HTTPS e cabeçalhos de segurança a sessões stateful, JWTs stateless, CSRF, injeção — e a nova fronteira da segurança de agentes de IA." },
  published: "2026-10-18",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "http-https", title: <T pt="HTTP e HTTPS: a base" en="HTTP and HTTPS: the base" /> },
        { id: "headers", title: <T pt="Cabeçalhos de segurança: do básico ao seu próprio" en="Security headers: from the basics to your own" /> },
        { id: "cookies", title: <T pt="Cookies: os três atributos que importam" en="Cookies: the three attributes that matter" /> },
        { id: "stateful", title: <T pt="Autenticação stateful: sessões no servidor" en="Stateful authentication: server-side sessions" /> },
        { id: "stateless", title: <T pt="Autenticação stateless: JWT, access e refresh" en="Stateless authentication: JWT, access and refresh" /> },
        { id: "choosing", title: <T pt="Qual escolher" en="Which one to choose" /> },
        { id: "csrf", title: <T pt="CSRF: o pedido que você não pediu" en="CSRF: the request you did not ask for" /> },
        { id: "injection", title: <T pt="SQL injection e XSS: o lado de quem constrói" en="SQL injection and XSS: the builder's side" /> },
        { id: "ai-agents", title: <T pt="A nova fronteira: segurança de agentes de IA" en="The new frontier: AI agent security" /> },
        { id: "cheat-wa", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="http-https" title={<T pt="HTTP e HTTPS: a base" en="HTTP and HTTPS: the base" />}>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é a <strong>etapa 1</strong> da <a href="/notas/cybersecurity-for-devs/">trilha de cibersegurança para quem programa</a> (segurança de aplicações, o ponto de partida recomendado para um dev).</>} en={<>Where this note fits: it is <strong>stage 1</strong> of the <a href="/notas/cybersecurity-for-devs/">cybersecurity path for developers</a> (application security, the recommended starting point for a developer).</>} /></Callout>
        <p><T pt={"Esta nota é o lado de dentro da muralha: como proteger a aplicação web que você constrói, não como atacar a de outra pessoa (isso fica na nota de Red Team). O fio condutor é simples: HTTP é um protocolo de texto, sem memória entre uma requisição e a próxima; tudo que chamamos de \"segurança de app web\" é uma camada de proteções em cima dessa base simples — cifrar o transporte, autenticar quem está do outro lado, lembrar quem é quem entre requisições, e desconfiar de qualquer dado que entra."} en={"This note is the inside of the wall: how to protect the web app you build, not how to attack someone else's (that is the Red Team note). The thread running through it is simple: HTTP is a text protocol with no memory between one request and the next; everything we call \"web app security\" is a layer of protections on top of that simple base — encrypting the transport, authenticating who is on the other side, remembering who is who between requests, and distrusting any data that comes in."} /></p>
        <h3><T pt="HTTP e HTTPS: a mesma coisa, uma delas cifrada" en="HTTP and HTTPS: the same thing, one of them encrypted" /></h3>
        <p><T pt={<>HTTP descreve <em>o que</em> é trocado (método, cabeçalhos, corpo); HTTPS é HTTP rodando dentro de uma conexão TLS, que cifra e autentica o transporte. A nota de segurança e redes já mostrou isso na prática: uma captura de pacotes da porta 80 mostra a requisição em texto puro; da porta 443, só ruído. TLS resolve três problemas de uma vez:</>} en={<>HTTP describes <em>what</em> is exchanged (method, headers, body); HTTPS is HTTP running inside a TLS connection, which encrypts and authenticates the transport. The security and networking note already showed this in practice: a packet capture of port 80 shows the request in plain text; of port 443, just noise. TLS solves three problems at once:</>} /></p>
        <Table
          head={[<T pt="Propriedade" en="Property" />, <T pt="O que garante" en="What it guarantees" />]}
          rows={[
            [<T pt="Confidencialidade" en="Confidentiality" />, <T pt="ninguém no meio do caminho lê o conteúdo (cookies, senhas, tokens)" en="nobody along the way can read the content (cookies, passwords, tokens)" />],
            [<T pt="Integridade" en="Integrity" />, <T pt="ninguém no meio do caminho altera o conteúdo sem ser percebido" en="nobody along the way can alter the content undetected" />],
            [<T pt="Autenticidade" en="Authenticity" />, <T pt={"o certificado prova que você está falando com o servidor certo, não um impostor (o \"s\" de HTTPS)"} en={"the certificate proves you are talking to the right server, not an impostor (the \"s\" in HTTPS)"} />],
          ]}
        />
        <Diagram minWidth={600} caption={<T pt="O handshake TLS (simplificado). Veja a nota de segurança e redes para capturar isso de verdade com o Wireshark." en="The TLS handshake (simplified). See the security and networking note to capture this for real with Wireshark." />}>
          <svg viewBox="0 0 650 280" role="img" aria-label="Handshake TLS / TLS handshake">
            <rect x="10" y="20" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="85.0" y="49.0" className="pt" textAnchor="middle">navegador</text>
            <text x="85.0" y="49.0" className="en" textAnchor="middle">browser</text>
            <rect x="480" y="20" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="555.0" y="49.0" className="pt" textAnchor="middle">servidor</text>
            <text x="555.0" y="49.0" className="en" textAnchor="middle">server</text>
            <path d="M170 85L480 85" className="ln" />
            <path d="M472.8 88.5L480 85L472.8 81.5" className="ln" />
            <text x="325" y="79" className="mono" textAnchor="middle">ClientHello</text>
            <path d="M480 125L170 125" className="ln" />
            <path d="M177.2 121.5L170 125L177.2 128.5" className="ln" />
            <text x="325" y="119" className="pt mono" textAnchor="middle">ServerHello + certificado</text>
            <text x="325" y="119" className="en mono" textAnchor="middle">ServerHello + certificate</text>
            <path d="M170 165L480 165" className="ln" />
            <path d="M472.8 168.5L480 165L472.8 161.5" className="ln" />
            <text x="325" y="159" className="pt mono" textAnchor="middle">chaves de sessão combinadas</text>
            <text x="325" y="159" className="en mono" textAnchor="middle">session keys agreed</text>
            <path d="M10 200L640 200" className="ln dash" />
            <path d="M170 230L480 230" className="ln" />
            <path d="M472.8 233.5L480 230L472.8 226.5" className="ln" />
            <text x="325" y="222" className="pt mono" textAnchor="middle">dados da aplicação, cifrados</text>
            <text x="325" y="222" className="en mono" textAnchor="middle">application data, encrypted</text>
            <text x="10" y="260" className="pt mut">Tudo depois da linha pontilhada está cifrado: método, caminho, cabeçalhos, cookies e corpo.</text>
            <text x="10" y="260" className="en mut">Everything after the dashed line is encrypted: method, path, headers, cookies and body.</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={<>HTTPS protege o <em>transporte</em>. Ele não impede SQL injection, não impede XSS, não valida nada que o usuário digita. É a base, não a proteção inteira — o resto desta nota cobre o que vem depois do TLS.</>} en={<>HTTPS protects the <em>transport</em>. It does not prevent SQL injection, does not prevent XSS, does not validate anything the user types. It is the foundation, not the whole protection — the rest of this note covers what comes after TLS.</>} /></Callout>
      </Section>
      <Section id="headers" title={<T pt="Cabeçalhos de segurança: do básico ao seu próprio" en="Security headers: from the basics to your own" />}>
        <p><T pt="O navegador obedece a instruções que o SERVIDOR manda em cabeçalhos HTTP de resposta. Um punhado deles fecha a maior parte das portas de ataque mais comuns, de graça, sem mudar uma linha de lógica de negócio." en="The browser obeys instructions the SERVER sends in HTTP response headers. A handful of them close most of the common attack doors, for free, without changing a line of business logic." /></p>
        <Table
          head={[<T pt="Cabeçalho" en="Header" />, <T pt="Faz" en="Does" />]}
          rows={[
            [<code>Strict-Transport-Security</code>, <T pt="diz ao navegador para NUNCA mais tentar HTTP nesse domínio, nem seguindo um link — fecha a janela de um downgrade para texto puro" en="tells the browser to NEVER try HTTP on this domain again, even via a link — closes the window for a downgrade to plain text" />],
            [<code>Content-Security-Policy</code>, <T pt="lista de onde scripts, estilos e outros recursos podem vir; a defesa mais forte contra XSS que existe no navegador" en="a whitelist of where scripts, styles and other resources may come from; the strongest browser-side defence against XSS" />],
            [<code>X-Content-Type-Options: nosniff</code>, <T pt={"impede o navegador de \"adivinhar\" o tipo de um arquivo e executá-lo como script por engano"} en={"stops the browser from \"guessing\" a file's type and running it as script by mistake"} />],
            [<><code>X-Frame-Options</code> / <code>frame-ancestors</code></>, <T pt={<>impede que o seu site seja carregado dentro de um <code>&lt;iframe&gt;</code> de outro site (clickjacking)</>} en={<>stops your site from being loaded inside another site's <code>&lt;iframe&gt;</code> (clickjacking)</>} />],
            [<code>Referrer-Policy</code>, <T pt="controla quanto da URL de origem vaza para o próximo site quando alguém clica num link seu" en="controls how much of the originating URL leaks to the next site when someone clicks a link of yours" />],
            [<code>Permissions-Policy</code>, <T pt="desliga recursos do navegador (câmera, geolocalização, microfone) que a página não usa" en="turns off browser features (camera, geolocation, microphone) the page does not use" />],
          ]}
        />
        <h3><T pt="CORS: a exceção controlada à regra de mesma origem" en="CORS: the controlled exception to same-origin" /></h3>
        <p><T pt={<>Por padrão, o navegador bloqueia JavaScript de um site lendo a resposta de outro (a <em>same-origin policy</em>). <code>Access-Control-Allow-Origin</code> e companhia são o jeito do SERVIDOR abrir uma exceção explícita para origens específicas. <code>Access-Control-Allow-Origin: *</code> é seguro para uma API pública e sem cookies; para uma API autenticada, liste as origens exatas e use <code>Access-Control-Allow-Credentials: true</code> só quando precisar enviar cookies entre origens.</>} en={<>By default, the browser blocks JavaScript from one site reading another site's response (the <em>same-origin policy</em>). <code>Access-Control-Allow-Origin</code> and friends are how the SERVER opens an explicit exception for specific origins. <code>Access-Control-Allow-Origin: *</code> is fine for a public, cookie-free API; for an authenticated API, list exact origins and use <code>Access-Control-Allow-Credentials: true</code> only when you need to send cookies cross-origin.</>} /></p>
        <h3 id="how-headers"><T pt="Como um cabeçalho funciona (e por que o navegador obedece)" en="How a header works (and why the browser obeys)" /></h3>
        <p><T pt={<>Toda resposta HTTP tem três partes: a linha de status, os <strong>cabeçalhos</strong> (pares <code>Nome: valor</code>, um por linha) e o corpo. Os cabeçalhos de segurança são instruções que o servidor escreve nessa área e que o navegador <em>escolhe cumprir</em>: ele não pergunta se faz sentido, só aplica. Por isso eles protegem tão bem — e por isso só protegem quem usa um navegador moderno (um <code>curl</code> ou um atacante com script próprio ignora todos).</>} en={<>Every HTTP response has three parts: the status line, the <strong>headers</strong> (<code>Name: value</code> pairs, one per line) and the body. Security headers are instructions the server writes in that area and the browser <em>chooses to follow</em>: it does not ask whether they make sense, it just applies them. That is why they protect so well — and why they only protect people on a modern browser (a <code>curl</code> or an attacker with their own script ignores all of them).</>} /></p>
        <CodeBlock code={`HTTP/2 200
content-type: text/html; charset=utf-8
strict-transport-security: max-age=63072000; includeSubDomains
content-security-policy: default-src 'self'; frame-ancestors 'none'
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin

<!doctype html>...`} />
        <p><T pt={<>Três lugares podem escrever esses cabeçalhos, e vale escolher <strong>um só como dono</strong> de cada um para não duplicar nem se contradizer: (1) o código da aplicação (middleware), que enxerga a requisição e pode variar por rota ou gerar um valor por resposta, como um nonce; (2) o proxy reverso (Nginx, Caddy), bom para o que vale para o site inteiro; (3) a CDN/edge (Cloudflare, CloudFront), que cobre também arquivos estáticos. Cabeçalhos devem ir em <em>todas</em> as respostas — inclusive erros 404/500 e arquivos estáticos.</>} en={<>Three places can write these headers, and it pays to pick <strong>one owner</strong> for each so they neither duplicate nor contradict: (1) the application code (middleware), which sees the request and can vary per route or generate a per-response value such as a nonce; (2) the reverse proxy (Nginx, Caddy), good for what applies to the whole site; (3) the CDN/edge (Cloudflare, CloudFront), which also covers static files. Headers belong on <em>every</em> response — including 404/500 errors and static files.</>} /></p>
        <h3 id="recommended-set"><T pt="O conjunto recomendado, cabeçalho por cabeçalho" en="The recommended set, header by header" /></h3>
        <p><T pt={<>A tabela segue o <em>HTTP Headers Cheat Sheet</em> do OWASP. O que importa decorar é a coluna "ação": o que ligar, o que ligar com cuidado e o que remover.</>} en={<>The table follows the OWASP <em>HTTP Headers Cheat Sheet</em>. What is worth memorising is the "action" column: what to turn on, what to turn on carefully and what to remove.</>} /></p>
        <Table
          head={[<T pt="Cabeçalho" en="Header" />, <T pt="Valor recomendado" en="Recommended value" />, <T pt="Ação" en="Action" />]}
          rows={[
            [<code>Strict-Transport-Security</code>, <T pt={<><code>max-age=63072000; includeSubDomains</code> (<code>preload</code> só após conferir os requisitos)</>} en={<><code>max-age=63072000; includeSubDomains</code> (<code>preload</code> only after checking the requirements)</>} />, <T pt="ligar, com cuidado" en="on, carefully" />],
            [<code>Content-Security-Policy</code>, <T pt={<>política própria; comece por <code>default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'</code></>} en={<>your own policy; start with <code>default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'</code></>} />, <T pt="ligar (em Report-Only primeiro)" en="on (Report-Only first)" />],
            [<code>X-Content-Type-Options</code>, <code>nosniff</code>, <T pt="ligar" en="on" />],
            [<code>Referrer-Policy</code>, <code>strict-origin-when-cross-origin</code>, <T pt="ligar, de forma explícita" en="on, explicitly" />],
            [<code>Permissions-Policy</code>, <code>camera=(), microphone=(), geolocation=()</code>, <T pt="ligar, listando o que não usa" en="on, listing what you do not use" />],
            [<code>X-Frame-Options</code>, <T pt={<><code>DENY</code> (o moderno é <code>frame-ancestors</code> na CSP)</>} en={<><code>DENY</code> (the modern one is <code>frame-ancestors</code> in the CSP)</>} />, <T pt="ligar (legado)" en="on (legacy)" />],
            [<code>Cross-Origin-Opener-Policy</code>, <code>same-origin</code>, <T pt="ligar em páginas de navegador" en="on for browser pages" />],
            [<code>Cross-Origin-Resource-Policy</code>, <code>same-site</code>, <T pt="ligar" en="on" />],
            [<code>Cross-Origin-Embedder-Policy</code>, <code>require-corp</code>, <T pt="só depois de testar: bloqueia recursos de outras origens sem permissão" en="only after testing: it blocks cross-origin resources that lack permission" />],
            [<code>Cache-Control</code>, <T pt={<><code>no-store</code> em respostas sensíveis (<code>no-cache</code> não impede de guardar)</>} en={<><code>no-store</code> on sensitive responses (<code>no-cache</code> does not prevent storing)</>} />, <T pt="ligar onde há dado pessoal" en="on wherever there is personal data" />],
            [<><code>Server</code>, <code>X-Powered-By</code></>, <T pt="nenhum, ou um valor genérico" en="none, or a generic value" />, <T pt="remover" en="remove" />],
            [<><code>X-XSS-Protection</code>, <code>Expect-CT</code>, <code>Public-Key-Pins</code></>, <T pt="não enviar (obsoletos)" en="do not send (obsolete)" />, <T pt="remover" en="remove" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>O <code>X-XSS-Protection</code> era o "filtro anti-XSS" dos navegadores antigos e hoje é considerado <em>perigoso</em>: o filtro podia ele mesmo criar brechas. A recomendação atual é não enviar o cabeçalho e fechar XSS com uma CSP que proíbe scripts inline.</>} en={<>The <code>X-XSS-Protection</code> header was the old browsers' "anti-XSS filter" and is now considered <em>harmful</em>: the filter could itself create holes. The current advice is not to send it and to close XSS with a CSP that forbids inline scripts.</>} /></Callout>
        <h3 id="hsts"><T pt="HSTS: como não se trancar para fora" en="HSTS: how not to lock yourself out" /></h3>
        <p><T pt={<>O <code>Strict-Transport-Security</code> faz o navegador lembrar, por <code>max-age</code> segundos, que aquele domínio só fala HTTPS. <code>includeSubDomains</code> estende a regra a todos os subdomínios, e <code>preload</code> pede para entrar numa lista embutida nos navegadores, valendo até na primeira visita. O risco é real: se um subdomínio ainda só tem HTTP, ele some para quem já recebeu o cabeçalho, e desfazer <code>preload</code> leva meses. O caminho seguro é subir aos poucos: <code>max-age=300</code> (5 min) → um dia → um mês → dois anos, só avançando quando nada quebrou.</>} en={<>The <code>Strict-Transport-Security</code> header makes the browser remember, for <code>max-age</code> seconds, that the domain only speaks HTTPS. <code>includeSubDomains</code> extends the rule to every subdomain, and <code>preload</code> asks to join a list built into browsers, effective even on the first visit. The risk is real: if a subdomain is still HTTP-only, it disappears for anyone who already received the header, and undoing <code>preload</code> takes months. The safe path is to ramp up: <code>max-age=300</code> (5 min) → one day → one month → two years, advancing only when nothing broke.</>} /></p>
        <h3 id="csp"><T pt="CSP passo a passo" en="CSP step by step" /></h3>
        <p><T pt={<>A <em>Content Security Policy</em> é uma lista de diretivas separadas por <code>;</code>, cada uma dizendo de onde um tipo de recurso pode vir. Se algo não está na lista, o navegador bloqueia — então, mesmo que um atacante consiga injetar um <code>&lt;script&gt;</code> na página (XSS), ele não roda.</>} en={<>The <em>Content Security Policy</em> is a list of directives separated by <code>;</code>, each saying where a type of resource may come from. If something is not on the list, the browser blocks it — so even if an attacker manages to inject a <code>&lt;script&gt;</code> into the page (XSS), it does not run.</>} /></p>
        <Table
          head={[<T pt="Diretiva" en="Directive" />, <T pt="Para que serve" en="What it is for" />]}
          rows={[
            [<code>default-src</code>, <T pt="reserva: vale para toda diretiva de recurso que você não definiu" en="fallback: applies to every resource directive you did not define" />],
            [<code>script-src</code>, <T pt="de onde scripts podem vir — a diretiva anti-XSS principal" en="where scripts may come from — the main anti-XSS directive" />],
            [<code>object-src 'none'</code>, <T pt={<>bloqueia <code>&lt;object&gt;</code> e <code>&lt;embed&gt;</code> (plugins)</>} en={<>blocks <code>&lt;object&gt;</code> and <code>&lt;embed&gt;</code> (plugins)</>} />],
            [<code>base-uri 'none'</code>, <T pt={<>impede que um <code>&lt;base&gt;</code> injetado redirecione links relativos</>} en={<>stops an injected <code>&lt;base&gt;</code> from redirecting relative links</>} />],
            [<code>frame-ancestors</code>, <T pt={<>quem pode colocar sua página num iframe; substitui o <code>X-Frame-Options</code> (anti-clickjacking)</>} en={<>who may put your page in an iframe; replaces <code>X-Frame-Options</code> (anti-clickjacking)</>} />],
            [<code>form-action</code>, <T pt="para onde formulários podem enviar dados" en="where forms may submit data" />],
            [<code>report-to</code>, <T pt="endpoint que recebe os relatórios de violação" en="endpoint that receives violation reports" />],
          ]}
        />
        <p><T pt={<>Listar domínios permitidos ("allowlist") é frágil: basta um domínio da lista hospedar um script qualquer para furar a regra. A forma moderna, chamada <strong>CSP estrita</strong>, usa um <strong>nonce</strong> (valor aleatório gerado a cada resposta, repetido no cabeçalho e no atributo <code>nonce</code> das tags permitidas) ou um <strong>hash</strong> do conteúdo do script. O atacante não consegue adivinhar o nonce, então o script injetado dele não roda. <code>'strict-dynamic'</code> estende a confiança de um script com nonce aos scripts que ele carrega.</>} en={<>Listing allowed domains (an "allowlist") is fragile: one listed domain hosting any script is enough to bypass the rule. The modern way, called a <strong>strict CSP</strong>, uses a <strong>nonce</strong> (a random value generated per response, repeated in the header and in the <code>nonce</code> attribute of the permitted tags) or a <strong>hash</strong> of the script content. The attacker cannot guess the nonce, so their injected script does not run. <code>'strict-dynamic'</code> extends trust from a nonce-tagged script to the scripts it loads.</>} /></p>
        <CodeBlock code={`Content-Security-Policy:
  script-src 'nonce-R4nd0m...' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none'

<script nonce="R4nd0m...">/* roda */</script>
<script>/* injetado pelo atacante: bloqueado */</script>`} />
        <Callout icon="check"><T pt={<>Adote em duas etapas. Primeiro envie a política como <code>Content-Security-Policy-Report-Only</code>: nada é bloqueado, mas o navegador relata cada violação (declare o destino com <code>Reporting-Endpoints</code> e <code>report-to</code>). Quando os relatórios ficarem limpos, troque o nome do cabeçalho para <code>Content-Security-Policy</code> e passe a aplicar. E lembre: a CSP complementa a validação e o escape de saída, não os substitui.</>} en={<>Adopt it in two stages. First send the policy as <code>Content-Security-Policy-Report-Only</code>: nothing is blocked, but the browser reports each violation (declare the destination with <code>Reporting-Endpoints</code> and <code>report-to</code>). When the reports are clean, rename the header to <code>Content-Security-Policy</code> and start enforcing. And remember: CSP complements input validation and output escaping, it does not replace them.</>} /></Callout>
        <h3 id="own-header"><T pt="Criando o seu próprio cabeçalho (middleware)" en="Creating your own header (middleware)" /></h3>
        <p><T pt={<>"Criar um cabeçalho" tem dois sentidos. O primeiro, e mais comum: escrever <strong>o seu próprio middleware</strong> que aplica o conjunto de segurança em toda resposta (é isso que o <code>helmet</code> faz por baixo). O segundo: inventar um cabeçalho <em>seu</em>, como um identificador de requisição. Os dois cabem no mesmo código:</>} en={<>"Creating a header" has two meanings. The first, and most common: writing <strong>your own middleware</strong> that applies the security set to every response (that is what <code>helmet</code> does under the hood). The second: inventing a header of <em>your own</em>, such as a request identifier. Both fit in the same code:</>} /></p>
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
        <p><T pt="Regras para um cabeçalho que você inventa:" en="Rules for a header you invent:" /></p>
        <ul>
          <li><T pt={<><strong>Nome:</strong> palavras separadas por hífen, sem diferenciar maiúsculas de minúsculas. O prefixo <code>X-</code> foi desencorajado pela RFC 6648; para um cabeçalho novo, prefira um nome descritivo (ex.: <code>Request-Id</code>) ou um prefixo da sua empresa.</>} en={<><strong>Name:</strong> hyphen-separated words, case-insensitive. The <code>X-</code> prefix was deprecated by RFC 6648; for a new header prefer a descriptive name (e.g. <code>Request-Id</code>) or a company prefix.</>} /></li>
          <li><T pt={<><strong>Nunca coloque segredo ou dado pessoal</strong> num valor: cabeçalhos vão para logs, proxies e CDNs.</>} en={<><strong>Never put a secret or personal data</strong> in a value: headers end up in logs, proxies and CDNs.</>} /></li>
          <li><T pt={<><strong>Entre origens (CORS):</strong> para o JavaScript de outro site <em>enviar</em> seu cabeçalho, o servidor precisa listá-lo em <code>Access-Control-Allow-Headers</code>; para <em>ler</em> o cabeçalho da resposta, em <code>Access-Control-Expose-Headers</code>.</>} en={<><strong>Across origins (CORS):</strong> for another site's JavaScript to <em>send</em> your header, the server must list it in <code>Access-Control-Allow-Headers</code>; to <em>read</em> a response header, in <code>Access-Control-Expose-Headers</code>.</>} /></li>
          <li><T pt={<><strong>Valide o que entra:</strong> um cabeçalho de requisição é entrada do usuário como qualquer outra — nunca o repita na resposta sem validar (risco de injeção de cabeçalho/CRLF).</>} en={<><strong>Validate what comes in:</strong> a request header is user input like any other — never echo it into a response without validating it (header/CRLF injection risk).</>} /></li>
        </ul>
        <h3 id="nextjs-headers"><T pt="Em Next.js: next.config.js e proxy.ts" en="In Next.js: next.config.js and proxy.ts" /></h3>
        <p><T pt={<>No Next.js, cabeçalhos <em>fixos</em> vão na chave <code>headers()</code> do <code>next.config.js</code>; cabeçalhos <em>por requisição</em> (como o nonce da CSP) vão no <code>proxy.ts</code> (o antigo <code>middleware.ts</code>). A documentação oficial recomenda este formato:</>} en={<>In Next.js, <em>fixed</em> headers go in the <code>headers()</code> key of <code>next.config.js</code>; <em>per-request</em> headers (such as the CSP nonce) go in <code>proxy.ts</code> (the former <code>middleware.ts</code>). The official docs recommend this shape:</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<>Nonce exige <strong>renderização dinâmica</strong>: o HTML é gerado a cada requisição, então páginas estáticas, ISR e cache de CDN deixam de valer, e o Partial Prerendering é incompatível. Se precisa manter geração estática, a alternativa (experimental, só App Router) é a CSP com hashes via Subresource Integrity (<code>experimental.sri</code>). Em desenvolvimento o React precisa de <code>'unsafe-eval'</code>; em produção, não.</>} en={<>A nonce requires <strong>dynamic rendering</strong>: the HTML is generated on every request, so static pages, ISR and CDN caching stop applying, and Partial Prerendering is incompatible. If you need to keep static generation, the alternative (experimental, App Router only) is a hash-based CSP through Subresource Integrity (<code>experimental.sri</code>). In development React needs <code>'unsafe-eval'</code>; in production it does not.</>} /></Callout>
        <h3 id="nginx-headers"><T pt="Em Nginx (proxy reverso)" en="In Nginx (reverse proxy)" /></h3>
        <CodeBlock code={`server {
  listen 443 ssl;
  server_tokens off;                      # esconde a versão do Nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  proxy_hide_header X-Powered-By;         # remove o que o app vazou
}`} />
        <p><T pt={<>O <code>always</code> é o detalhe que mais se esquece: sem ele o Nginx só adiciona o cabeçalho em respostas 2xx/3xx, e as páginas de erro ficam sem proteção. Outra pegadinha: um <code>add_header</code> declarado dentro de um <code>location</code> <em>substitui</em> os do bloco pai, em vez de somá-los.</>} en={<>The <code>always</code> is the detail most often forgotten: without it Nginx only adds the header on 2xx/3xx responses, and error pages go unprotected. Another gotcha: an <code>add_header</code> declared inside a <code>location</code> <em>replaces</em> the parent block's, instead of adding to them.</>} /></p>
        <h3 id="more-headers"><T pt="Mais três cabeçalhos que valem conhecer" en="Three more headers worth knowing" /></h3>
        <Table
          head={[<T pt="Cabeçalho" en="Header" />, <T pt="Quando usar" en="When to use it" />]}
          rows={[
            [<code>Cache-Control: no-store</code>, <T pt="em páginas e respostas de API com dados pessoais ou de sessão, para que nem o navegador nem um proxy compartilhado guardem uma cópia" en="on pages and API responses with personal or session data, so neither the browser nor a shared proxy keeps a copy" />],
            [<code>Clear-Site-Data</code>, <T pt={<>na resposta do logout (<code>"cache", "cookies", "storage"</code>) para apagar o que ficou no navegador</>} en={<>on the logout response (<code>"cache", "cookies", "storage"</code>) to wipe what is left in the browser</>} />],
            [<code>Content-Disposition: attachment</code>, <T pt={<>em downloads de arquivos enviados por usuários, com <code>application/octet-stream</code>: o navegador baixa em vez de executar</>} en={<>on downloads of user-uploaded files, with <code>application/octet-stream</code>: the browser downloads instead of executing</>} />],
          ]}
        />
        <h3 id="headers-checklist"><T pt="Checklist para colocar no ar" en="Go-live checklist" /></h3>
        <ul>
          <li><T pt={<>Conjunto básico ligado em <em>todas</em> as respostas (inclusive erros e estáticos) e <code>Server</code>/<code>X-Powered-By</code> removidos.</>} en={<>Basic set on <em>every</em> response (errors and static files included), and <code>Server</code>/<code>X-Powered-By</code> removed.</>} /></li>
          <li><T pt="HSTS subindo aos poucos; CSP primeiro em Report-Only, depois aplicada." en="HSTS ramped up gradually; CSP in Report-Only first, then enforced." /></li>
          <li><T pt="Cada cabeçalho com um único dono (app, proxy ou CDN), sem duplicatas." en="Each header with a single owner (app, proxy or CDN), no duplicates." /></li>
          <li><T pt={<>Conferido com <code>curl -sI</code>, com a aba Network do navegador e com scanners como securityheaders.com ou o Mozilla Observatory.</>} en={<>Verified with <code>curl -sI</code>, the browser Network tab and scanners such as securityheaders.com or Mozilla Observatory.</>} /></li>
          <li><T pt="Teste automatizado que falha o build se um cabeçalho essencial sumir." en="An automated test that fails the build if an essential header disappears." /></li>
        </ul>
        <h3><T pt="Exercício: ver e testar os cabeçalhos de um app" en="Exercise: see and test an app's headers" /></h3>
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
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>curl -I</code> (só cabeçalhos) mostra todas as seis linhas configuradas no servidor. Compare depois com um site real: abra o DevTools do navegador → aba Network → clique na primeira requisição → "Headers", ou rode o mesmo <code>curl -sI</code> contra <code>https://baselarte.com</code>.</>} en={<><strong>Expected result:</strong> <code>curl -I</code> (headers only) shows all six lines configured on the server. Afterwards compare with a real site: open the browser DevTools → Network tab → click the first request → "Headers", or run the same <code>curl -sI</code> against <code>https://baselarte.com</code>.</>} /></p>
        <Callout icon="check"><T pt={<>Na prática, raramente se escreve cada cabeçalho à mão: frameworks como <code>helmet</code> (Node/Express), <code>django-csp</code> (Django) ou o próprio proxy reverso (Nginx, Caddy, Cloudflare) aplicam um conjunto sensato por padrão. O scanner gratuito <a href="https://securityheaders.com" rel="noopener">securityheaders.com</a> testa qualquer site público e dá uma nota.</>} en={<>In practice, headers are rarely hand-written one by one: frameworks like <code>helmet</code> (Node/Express), <code>django-csp</code> (Django) or the reverse proxy itself (Nginx, Caddy, Cloudflare) apply a sane set by default. The free scanner <a href="https://securityheaders.com" rel="noopener">securityheaders.com</a> tests any public site and gives it a grade.</>} /></Callout>
      </Section>
      <Section id="cookies" title={<T pt="Cookies: os três atributos que importam" en="Cookies: the three attributes that matter" />}>
        <p><T pt={"Um cookie é um pedacinho de texto que o servidor pede ao navegador para guardar e devolver em toda requisição futura ao mesmo site. É o mecanismo mais comum para \"lembrar\" quem está logado — e, mal configurado, uma das formas mais fáceis de vazar uma sessão inteira."} en={"A cookie is a small piece of text the server asks the browser to store and send back on every future request to the same site. It is the most common mechanism to \"remember\" who is logged in — and, misconfigured, one of the easiest ways to leak a whole session."} /></p>
        <Diagram minWidth={640} caption={<T pt="Um cookie de sessão sem os três atributos é texto puro que qualquer script na página, ou qualquer site terceiro, pode tentar usar." en="A session cookie without the three attributes is plain text any script on the page, or any third-party site, can try to use." />}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Os três atributos que importam / The three attributes that matter">
            <rect x="10" y="10" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="42.0" className="mono" textAnchor="middle">Secure</text>
            <text x="250" y="34" className="pt">só viaja em HTTPS</text>
            <text x="250" y="34" className="en">only travels over HTTPS</text>
            <rect x="10" y="80" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="112.0" className="mono" textAnchor="middle">HttpOnly</text>
            <text x="250" y="104" className="pt">JavaScript da página não consegue ler</text>
            <text x="250" y="104" className="en">the page's JavaScript cannot read it</text>
            <rect x="10" y="150" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="182.0" className="mono" textAnchor="middle">SameSite=Lax/Strict</text>
            <text x="250" y="174" className="pt">não viaja em requisições vindas de outro site</text>
            <text x="250" y="174" className="en">does not travel on requests coming from another site</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Valor de SameSite" en="SameSite value" />, <T pt="Comportamento" en="Behaviour" />]}
          rows={[
            [<code>Strict</code>, <T pt="nunca envia o cookie numa navegação vinda de outro site, nem clicando num link — mais seguro, pode quebrar fluxos de login vindos de e-mail" en="never sends the cookie on navigation coming from another site, not even via a clicked link — safest, can break login flows arriving from email" />],
            [<code>Lax</code>, <T pt="envia em navegação de nível superior (clicar num link), mas não em requisições de fundo (imagem, formulário POST de outro site) — o equilíbrio padrão para cookies de autenticação" en="sends on top-level navigation (clicking a link), but not on background requests (image, a POST form from another site) — the default balance for authentication cookies" />],
            [<code>None</code>, <T pt={<>envia sempre, inclusive entre sites — exige <code>Secure</code> junto; use só quando o cookie PRECISA cruzar origens (ex.: um widget embutido)</>} en={<>always sends, including cross-site — requires <code>Secure</code> alongside it; use only when the cookie MUST cross origins (e.g. an embedded widget)</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Um erro real de 2025: um projeto de IA de código aberto configurou o cookie do <em>refresh token</em> com <code>SameSite: 'None'</code> combinado com CORS permissivo demais — a combinação deixou o token alcançável de qualquer origem. <code>SameSite=None</code> num cookie de autenticação quase sempre é um sinal de alerta.</>} en={<>A real 2025 mistake: an open-source AI project configured its refresh-token cookie with <code>SameSite: 'None'</code> combined with overly permissive CORS — the combination left the token reachable from any origin. <code>SameSite=None</code> on an authentication cookie is almost always a red flag.</>} /></Callout>
        <h3><T pt="Fixação de sessão" en="Session fixation" /></h3>
        <p><T pt={<>Um ataque simples: o atacante planta um ID de sessão conhecido na vítima (por um link, ou porque o site aceita qualquer ID enviado) e espera ela fazer login — se o site mantém o MESMO ID depois do login, o atacante agora está "logado" também. A defesa: <strong>sempre gerar um ID de sessão novo no momento do login</strong> (e de novo em qualquer mudança de privilégio), nunca aceitar um ID de sessão que já veio do cliente antes de autenticar.</>} en={<>A simple attack: the attacker plants a known session ID on the victim (via a link, or because the site accepts any submitted ID) and waits for them to log in — if the site keeps the SAME ID after login, the attacker is now "logged in" too. The defence: <strong>always generate a new session ID at the moment of login</strong> (and again on any privilege change), never accept a session ID that arrived from the client before authenticating.</>} /></p>
      </Section>
      <Section id="stateful" title={<T pt="Autenticação stateful: sessões no servidor" en="Stateful authentication: server-side sessions" />}>
        <p><T pt={<>Autenticação <em>stateful</em> (com estado): o servidor guarda, num banco ou cache (Redis é o padrão de mercado), um registro de cada sessão ativa. O cookie carrega só um ID opaco e aleatório — o resto da informação (quem é o usuário, quando expira) fica no servidor.</>} en={<><em>Stateful</em> authentication: the server keeps, in a database or cache (Redis is the market standard), a record of each active session. The cookie carries only an opaque, random ID — the rest of the information (who the user is, when it expires) lives on the server.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A cada requisição, o servidor troca o ID do cookie por dados reais numa consulta." en="On every request, the server exchanges the cookie ID for real data in a lookup." />}>
          <svg viewBox="0 0 680 150" role="img" aria-label="Sessão stateful / Stateful session">
            <rect x="10" y="20" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="85" y="42" className="pt" textAnchor="middle">navegador</text>
            <text x="85" y="42" className="en" textAnchor="middle">browser</text>
            <text x="85" y="60" className="mut mono" textAnchor="middle">cookie: sid=a1b2c3</text>
            <rect x="270" y="20" width="140" height="54" rx="4" className="ln" />
            <text x="340" y="52" className="pt" textAnchor="middle">servidor</text>
            <text x="340" y="52" className="en" textAnchor="middle">server</text>
            <rect x="520" y="20" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="595" y="42" className="mono" textAnchor="middle">Redis</text>
            <text x="595" y="60" className="mut mono" textAnchor="middle">sid → user_id, exp</text>
            <path d="M160 38L270 38" className="ln" />
            <path d="M263.2 34.7L270 38L263.2 41.3" className="ln" />
            <path d="M520 38L410 38" className="ln" />
            <path d="M416.8 41.3L410 38L416.8 34.7" className="ln" />
            <text x="465" y="64" className="pt mut" textAnchor="middle">consulta/confirma</text>
            <text x="465" y="64" className="en mut" textAnchor="middle">look up/confirm</text>
            <text x="10" y="112" className="pt mut" textAnchor="start">O cookie sozinho não diz nada: fora de contexto, "a1b2c3" não significa nada.</text>
            <text x="10" y="112" className="en mut" textAnchor="start">The cookie alone says nothing: out of context, "a1b2c3" means nothing.</text>
            <text x="10" y="132" className="pt mut" textAnchor="start">Revogar a sessão = apagar a linha no Redis.</text>
            <text x="10" y="132" className="en mut" textAnchor="start">Revoking the session = delete the row in Redis.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Vantagem" en="Advantage" />, <T pt="Custo" en="Cost" />]}
          rows={[
            [<T pt="Revogar é trivial: apague a linha e a sessão morre na hora" en="Revoking is trivial: delete the row and the session dies instantly" />, <T pt="precisa de um banco/cache compartilhado — escalar horizontalmente exige um Redis central, não memória local" en="needs a shared database/cache — scaling horizontally requires a central Redis, not local memory" />],
            [<T pt="O cookie não carrega dado nenhum sensível" en="The cookie carries no sensitive data at all" />, <T pt="toda requisição faz uma consulta extra (mitigável com cache)" en="every request makes an extra lookup (mitigable with caching)" />],
          ]}
        />
        <h3><T pt="Logout, na prática" en="Logout, in practice" /></h3>
        <CodeBlock>
          <span className="tok-c"># pseudocódigo do lado do servidor</span>{"\n"}
          {"POST /login    -> gera sid aleatório, grava {user_id, criado_em} no Redis, seta cookie Secure+HttpOnly+SameSite=Lax\n"}
          {"GET  /perfil   -> lê sid do cookie, busca no Redis, 401 se não achar ou expirado\n"}
          {"POST /logout   -> apaga a chave sid no Redis, expira o cookie no navegador"}
        </CodeBlock>
        <p><T pt={<>Esse é o ponto central: logout stateful é só <code>DELETE</code>. Isso fica bem mais difícil no modelo stateless, que vem a seguir.</>} en={<>This is the key point: stateful logout is just a <code>DELETE</code>. This gets much harder in the stateless model, which comes next.</>} /></p>
      </Section>
      <Section id="stateless" title={<T pt="Autenticação stateless: JWT, access e refresh" en="Stateless authentication: JWT, access and refresh" />}>
        <p><T pt={<>Autenticação <em>stateless</em> (sem estado): em vez de um ID opaco, o servidor assina um token que carrega os dados nele mesmo — tipicamente um <strong>JWT</strong> (JSON Web Token). Qualquer servidor que conheça a chave de assinatura pode validar o token sozinho, sem consultar banco nenhum. É o modelo padrão para APIs e microsserviços, e para SPAs que falam com uma API separada.</>} en={<><em>Stateless</em> authentication: instead of an opaque ID, the server signs a token that carries the data inside itself — typically a <strong>JWT</strong> (JSON Web Token). Any server that knows the signing key can validate the token on its own, with no database lookup. It is the standard model for APIs and microservices, and for SPAs talking to a separate API.</>} /></p>
        <h3><T pt="A anatomia de um JWT" en="The anatomy of a JWT" /></h3>
        <Diagram minWidth={600} caption={<T pt="Nunca coloque um segredo no payload de um JWT: qualquer pessoa pode decodificá-lo em jwt.io sem a chave." en="Never put a secret in a JWT's payload: anyone can decode it on jwt.io without the key." />}>
          <svg viewBox="0 0 650 160" role="img" aria-label="Anatomia de um JWT / JWT anatomy">
            <rect x="10" y="10" width="190" height="44" rx="4" className="ln fillsoft" />
            <text x="105.0" y="37" className="mono" textAnchor="middle">eyJhbGciOiJIUzI1NiJ9</text>
            <text x="105.0" y="76" className="" textAnchor="middle">header</text>
            <text x="105.0" y="94" className="pt mut" textAnchor="middle">algoritmo, tipo</text>
            <text x="105.0" y="94" className="en mut" textAnchor="middle">algorithm, type</text>
            <rect x="216" y="10" width="260" height="44" rx="4" className="ln fillsoft" />
            <text x="346.0" y="37" className="mono" textAnchor="middle">eyJzdWIiOiIxMjMiLCJleHAiOi4uLn0</text>
            <text x="346.0" y="76" className="" textAnchor="middle">payload</text>
            <text x="346.0" y="94" className="mut" textAnchor="middle">claims: sub, exp, roles…</text>
            <rect x="482" y="10" width="158" height="44" rx="4" className="ln fillsoft" />
            <text x="561.0" y="37" className="mono" textAnchor="middle">SflKxwRJSMe...</text>
            <text x="561.0" y="76" className="pt" textAnchor="middle">assinatura</text>
            <text x="561.0" y="76" className="en" textAnchor="middle">signature</text>
            <text x="561.0" y="94" className="pt mut" textAnchor="middle">prova que nada mudou</text>
            <text x="561.0" y="94" className="en mut" textAnchor="middle">proves nothing changed</text>
            <text x="10" y="128" className="pt mut" textAnchor="start">header.payload.signature — os dois primeiros são só Base64 (legíveis por qualquer um).</text>
            <text x="10" y="128" className="en mut" textAnchor="start">header.payload.signature — the first two are just Base64 (readable by anyone).</text>
            <text x="10" y="148" className="pt mut" textAnchor="start">Só a assinatura impede alteração; nada ali é cifrado.</text>
            <text x="10" y="148" className="en mut" textAnchor="start">Only the signature prevents tampering; nothing here is encrypted.</text>
          </svg>
        </Diagram>
        <h3><T pt="Access token curto + refresh token longo" en="Short access token + long refresh token" /></h3>
        <p><T pt={"O padrão que resolve o maior problema do modelo stateless (não dá para \"apagar\" um token já emitido) é usar DOIS tokens com vidas diferentes:"} en={"The pattern that solves stateless's biggest problem (you cannot \"delete\" an already-issued token) is using TWO tokens with different lifetimes:"} /></p>
        <Diagram minWidth={500} caption={<T pt="O access token vive pouco (o estrago de um vazamento é limitado pelo tempo); o refresh token vive mais, mas só serve para pedir um access token novo." en="The access token lives briefly (the damage from a leak is limited by time); the refresh token lives longer, but only serves to request a new access token." />}>
          <svg viewBox="0 0 540 215" role="img" aria-label="Access + refresh / Access + refresh">
            <rect x="10" y="20" width="210" height="60" rx="4" className="brandfill" />
            <text x="115" y="46" className="" textAnchor="middle">access token</text>
            <text x="115" y="65" className="pt mut mono" textAnchor="middle">minutos · cada requisição</text>
            <text x="115" y="65" className="en mut mono" textAnchor="middle">minutes · every request</text>
            <rect x="320" y="20" width="210" height="60" rx="4" className="ln fillsoft" />
            <text x="425" y="46" className="" textAnchor="middle">refresh token</text>
            <text x="425" y="65" className="pt mut mono" textAnchor="middle">dias/semanas · só renova</text>
            <text x="425" y="65" className="en mut mono" textAnchor="middle">days/weeks · renew only</text>
            <path d="M220 50L320 50" className="ln dash" />
            <path d="M313.2 46.7L320 50L313.2 53.3" className="ln" />
            <text x="270" y="38" className="pt mut" textAnchor="middle">expirou?</text>
            <text x="270" y="38" className="en mut" textAnchor="middle">expired?</text>
            <path d="M425 80L425 124" className="ln" />
            <path d="M428.3 117.2L425 124L421.7 117.2" className="ln" />
            <rect x="320" y="124" width="210" height="46" rx="4" className="ln" />
            <text x="425" y="152" className="mono" textAnchor="middle">POST /refresh</text>
            <path d="M320 147L220 147" className="ln" />
            <path d="M226.8 150.3L220 147L226.8 143.7" className="ln" />
            <rect x="10" y="124" width="210" height="46" rx="4" className="brandfill" />
            <text x="115" y="152" className="pt" textAnchor="middle">access token novo</text>
            <text x="115" y="152" className="en" textAnchor="middle">new access token</text>
            <text x="10" y="198" className="pt mut" textAnchor="start">Com rotação, a resposta traz também um refresh token novo (veja abaixo).</text>
            <text x="10" y="198" className="en mut" textAnchor="start">With rotation, the response also carries a new refresh token (see below).</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Onde guardar" en="Where to store" />, <T pt="Risco principal" en="Main risk" />]}
          rows={[
            [<T pt={<><code>localStorage</code>/<code>sessionStorage</code></>} en={<><code>localStorage</code>/<code>sessionStorage</code></>} />, <T pt="acessível por QUALQUER script na página — um XSS rouba o token inteiro" en="readable by ANY script on the page — one XSS steals the whole token" />],
            [<T pt={<>Cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict/Lax</code></>} en={<>Cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict/Lax</code></>} />, <T pt="invisível a scripts (mitiga XSS), mas exige proteção de CSRF para o endpoint que o lê" en="invisible to scripts (mitigates XSS), but needs CSRF protection for the endpoint that reads it" />],
            [<T pt="Memória (variável JS, nunca persistida)" en="Memory (a JS variable, never persisted)" />, <T pt="mais seguro para o access token; some ao recarregar a página (por isso existe o refresh token)" en="safest for the access token; disappears on page reload (which is exactly why the refresh token exists)" />],
          ]}
        />
        <p><T pt={<>Padrão recomendado hoje: access token em memória, refresh token num cookie <code>HttpOnly</code>+<code>Secure</code>+<code>SameSite=Strict</code>. Evite <code>localStorage</code> para qualquer um dos dois se puder.</>} en={<>Today's recommended pattern: access token in memory, refresh token in an <code>HttpOnly</code>+<code>Secure</code>+<code>SameSite=Strict</code> cookie. Avoid <code>localStorage</code> for either one if you can.</>} /></p>
        <h3><T pt="Rotação de refresh token e detecção de reuso" en="Refresh token rotation and reuse detection" /></h3>
        <p><T pt="A cada uso, o refresh token é TROCADO por um novo, e o antigo é invalidado. Se o antigo aparecer de novo (alguém tentando reusar um token roubado, ou uma cópia antiga), isso significa que ele vazou — a resposta correta é revogar a CADEIA inteira daquele token, derrubando a sessão." en="On every use, the refresh token is SWAPPED for a new one, and the old one is invalidated. If the old one shows up again (someone trying to reuse a stolen token, or an old copy), that means it leaked — the correct response is to revoke the WHOLE chain for that token, killing the session." /></p>
        <CodeBlock>
          <span className="tok-c"># pseudocódigo do endpoint de refresh</span>{"\n"}
          {"POST /refresh  (cookie: refresh_token=rt_antigo)\n"}
          {"  1. valida assinatura e expiração de rt_antigo\n"}
          {"  2. rt_antigo já foi usado antes (está na lista de "}<span className="tok-s">"já trocados"</span>{")?\n"}
          {"       SIM -> REUSO DETECTADO: revoga toda a família de tokens desse usuário, força novo login\n"}
          {"       NÃO -> gera access_token novo (minutos) + refresh_token novo (dias)\n"}
          {"              marca rt_antigo como "}<span className="tok-s">"já trocado"</span>{", responde com os dois"}
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt="Diferente do modelo stateful, revogar um JWT antes do tempo é difícil por definição — ele é válido até expirar, mesmo que o usuário troque a senha. Por isso: access tokens CURTOS (minutos) e, se precisar revogar de verdade e na hora, uma lista de bloqueio (denylist) consultada nas rotas sensíveis, ou volte para sessões stateful nelas." en="Unlike the stateful model, revoking a JWT early is hard by definition — it is valid until it expires, even if the user changes their password. Hence: SHORT access tokens (minutes) and, if you need to revoke immediately for real, a denylist checked on sensitive routes, or fall back to stateful sessions there." /></Callout>
      </Section>
      <Section id="choosing" title={<T pt="Qual escolher" en="Which one to choose" />}>
        <p><T pt={"Nenhum dos dois é \"o certo\"; são otimizados para coisas diferentes."} en={"Neither one is \"the right one\"; they are optimised for different things."} /></p>
        <Table
          head={[<T pt="" en="" />, <T pt="Stateful (sessão)" en="Stateful (session)" />, <T pt="Stateless (JWT)" en="Stateless (JWT)" />]}
          rows={[
            [<T pt="Revogação imediata" en="Immediate revocation" />, <T pt="trivial (apaga a linha)" en="trivial (delete the row)" />, <T pt="difícil (precisa de denylist)" en="hard (needs a denylist)" />],
            [<T pt="Escala entre serviços" en="Scaling across services" />, <T pt="precisa de um store compartilhado" en="needs a shared store" />, <T pt="qualquer serviço valida sozinho, sem consultar nada" en="any service validates on its own, no lookup" />],
            [<T pt="Tamanho na requisição" en="Request size" />, <T pt="pequeno (só o ID)" en="small (just the ID)" />, <T pt="maior (o token inteiro, em cada chamada)" en="bigger (the whole token, on every call)" />],
            [<T pt="Caso de uso típico" en="Typical use case" />, <T pt="aplicação monolítica, painel administrativo" en="a monolithic app, an admin panel" />, <T pt="API pública, microsserviços, mobile, SSO entre domínios" en="a public API, microservices, mobile, SSO across domains" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Um padrão comum e pragmático: <strong>sessão stateful</strong> para o site principal (login no navegador, cookie simples) e <strong>JWT</strong> só para a API pública ou para comunicação entre serviços internos. Não é incomum os dois convivendo no mesmo produto.</>} en={<>A common, pragmatic pattern: <strong>stateful session</strong> for the main site (browser login, simple cookie) and <strong>JWT</strong> only for the public API or service-to-service communication. It is not unusual for both to coexist in the same product.</>} /></Callout>
      </Section>
      <Section id="csrf" title={<T pt="CSRF: o pedido que você não pediu" en="CSRF: the request you did not ask for" />}>
        <p><T pt={<><em>Cross-Site Request Forgery</em>: um site malicioso faz o SEU navegador mandar uma requisição para um site onde você já está logado, usando seus cookies automaticamente — sem roubar nada, só abusando do fato de que o navegador sempre anexa os cookies do domínio.</>} en={<><em>Cross-Site Request Forgery</em>: a malicious site makes YOUR browser send a request to a site where you are already logged in, using your cookies automatically — without stealing anything, just abusing the fact that the browser always attaches the domain's cookies.</>} /></p>
        <Diagram minWidth={680} caption={<T pt={"O navegador não sabe que o pedido \"não era bem-vindo\" — ele só vê um formulário normal pedindo para enviar a banco.com, com os cookies certos em mãos."} en={"The browser does not know the request was \"unwelcome\" — it just sees a normal form asking to submit to bank.com, with the right cookies in hand."} />}>
          <svg viewBox="0 0 740 170" role="img" aria-label="CSRF / CSRF">
            <rect x="10" y="70" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="100" y="102" className="pt" textAnchor="middle">você, logado em banco.com</text>
            <text x="100" y="102" className="en" textAnchor="middle">you, logged into bank.com</text>
            <rect x="250" y="10" width="220" height="52" rx="4" className="ln" />
            <text x="360" y="32" className="pt" textAnchor="middle">site-malicioso.com</text>
            <text x="360" y="32" className="en" textAnchor="middle">evil-site.com</text>
            <text x="360" y="50" className="pt mut mono" textAnchor="middle">&lt;form action="banco.com"&gt;</text>
            <text x="360" y="50" className="en mut mono" textAnchor="middle">&lt;form action="bank.com"&gt;</text>
            <rect x="570" y="80" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="645" y="112" className="pt" textAnchor="middle">banco.com</text>
            <text x="645" y="112" className="en" textAnchor="middle">bank.com</text>
            <path d="M190 86L250 46" className="ln" />
            <path d="M242.6 47.0L250 46L246.2 52.5" className="ln" />
            <text x="150" y="52" className="pt mut" textAnchor="middle">1. visita</text>
            <text x="150" y="52" className="en mut" textAnchor="middle">1. visits</text>
            <path d="M470 50L580 80" className="ln" />
            <path d="M574.3 75.1L580 80L572.6 81.4" className="ln" />
            <text x="645" y="56" className="pt mut" textAnchor="middle">2. o formulário se envia sozinho</text>
            <text x="645" y="56" className="en mut" textAnchor="middle">2. the form submits itself</text>
            <text x="645" y="156" className="pt mut" textAnchor="middle">(com os cookies de banco.com)</text>
            <text x="645" y="156" className="en mut" textAnchor="middle">(with bank.com's cookies)</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Defesa" en="Defence" />, <T pt="Como funciona" en="How it works" />]}
          rows={[
            [<T pt={<><code>SameSite=Lax</code>/<code>Strict</code> no cookie</>} en={<><code>SameSite=Lax</code>/<code>Strict</code> on the cookie</>} />, <T pt="o navegador simplesmente NÃO anexa o cookie numa requisição de fundo vinda de outro site — resolve a maior parte dos casos sozinho, hoje" en="the browser simply does NOT attach the cookie on a background request coming from another site — solves most cases on its own, today" />],
            [<T pt="Token CSRF (synchronizer token)" en="CSRF token (synchronizer token)" />, <T pt="um valor aleatório, único por sessão/formulário, que o site malicioso não tem como adivinhar ou ler (same-origin policy o impede)" en="a random, per-session/per-form value the malicious site has no way to guess or read (same-origin policy blocks it)" />],
            [<T pt={<>Checar o cabeçalho <code>Origin</code>/<code>Referer</code></>} en={<>Checking the <code>Origin</code>/<code>Referer</code> header</>} />, <T pt="rejeita requisições sensíveis cuja origem não bate com a esperada — uma camada extra, não a única" en="rejects sensitive requests whose origin does not match what is expected — an extra layer, not the only one" />],
          ]}
        />
        <Callout icon="check"><T pt={<><code>SameSite=Lax</code> (o padrão em navegadores modernos quando nada é especificado) já neutraliza boa parte do CSRF clássico. Ainda assim, APIs com estado que mudam dados (POST/PUT/DELETE) continuam se beneficiando de um token CSRF como segunda camada — "defesa em profundidade", o mesmo princípio da nota de Linux.</>} en={<><code>SameSite=Lax</code> (the default in modern browsers when nothing is specified) already neutralises much of classic CSRF. Still, state-changing APIs (POST/PUT/DELETE) keep benefiting from a CSRF token as a second layer — "defence in depth", the same principle from the Linux note.</>} /></Callout>
      </Section>
      <Section id="injection" title={<T pt="SQL injection e XSS: o lado de quem constrói" en="SQL injection and XSS: the builder's side" />}>
        <p><T pt="Confiar em qualquer dado que entra de fora é a raiz da maioria das falhas de aplicação web. As duas mais comuns já apareceram na nota de Red Team do ponto de vista de quem ataca; aqui é o lado de quem constrói." en="Trusting any data that comes in from outside is the root of most web application flaws. The two most common ones already showed up in the Red Team note from the attacker's side; here is the builder's side." /></p>
        <h3><T pt="SQL injection: nunca monte SQL colando texto" en="SQL injection: never build SQL by pasting text" /></h3>
        <CodeBlock>
          <span className="tok-c">-- NUNCA: concatena a entrada direto na consulta</span>{"\n"}
          {"const query = `"}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" usuarios "}<span className="tok-k">WHERE</span>{" email = "}<span className="tok-s">'$&#123;emailDoFormulario&#125;'</span>{"`;\n"}
          {"\n"}
          <span className="tok-c">-- SEMPRE: consulta parametrizada — a entrada é um VALOR, nunca parte do comando</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" usuarios "}<span className="tok-k">WHERE</span>{" email = $"}<span className="tok-n">1</span>{";   "}<span className="tok-c">-- Postgres (driver node-postgres, por exemplo)</span>
        </CodeBlock>
        <p><T pt={"Veja a nota de Postgres para os comandos e a seção de exploração da nota de Red Team para como essa falha é usada do outro lado. ORMs (Prisma, SQLAlchemy, ActiveRecord) fazem isso por padrão — o risco real aparece quando alguém usa SQL \"cru\" dentro do ORM para um caso especial e esquece de parametrizar."} en={"See the Postgres note for commands and the Red Team note's exploitation section for how this flaw is used from the other side. ORMs (Prisma, SQLAlchemy, ActiveRecord) do this by default — the real risk shows up when someone drops down to \"raw\" SQL inside the ORM for a special case and forgets to parameterise."} /></p>
        <h3><T pt="XSS: escapar saída, não só validar entrada" en="XSS: escape output, not just validate input" /></h3>
        <p><T pt={"Frameworks modernos (React, Vue, Angular) escapam a saída por padrão quando você usa a sintaxe normal de template — o perigo mora nas \"válvulas de escape\" que pulam essa proteção de propósito."} en={"Modern frameworks (React, Vue, Angular) escape output by default when you use their normal template syntax — the danger lives in the \"escape hatches\" that skip that protection on purpose."} /></p>
        <CodeBlock code={`// React: ESCAPADO automaticamente, seguro mesmo se bio vier de um usuário
<p>{usuario.bio}</p>

// React: a válvula de escape — NUNCA com texto de usuário sem sanitizar antes
<div dangerouslySetInnerHTML={{ __html: usuario.bio }} />`} />
        <p><T pt={<>Se você realmente precisa renderizar HTML vindo do usuário (um editor rich-text, por exemplo), sanitize com uma biblioteca testada para isso (como <code>DOMPurify</code>) — nunca confie em regex caseira para "limpar" HTML.</>} en={<>If you genuinely need to render user-supplied HTML (a rich-text editor, for example), sanitise it with a battle-tested library (like <code>DOMPurify</code>) — never trust a homemade regex to "clean" HTML.</>} /></p>
        <h3><T pt="Uma checklist curta" en="A short checklist" /></h3>
        <ul className="ds-list">
          <li><T pt="Toda consulta com dado externo é parametrizada; nenhum SQL é montado por concatenação de string." en="Every query with external data is parameterised; no SQL is built by string concatenation." /></li>
          <li><T pt={<>Toda saída em HTML usa a escapagem padrão do framework; <code>dangerouslySetInnerHTML</code>/<code>v-html</code>/<code>|safe</code> só com conteúdo sanitizado.</>} en={<>All HTML output uses the framework's default escaping; <code>dangerouslySetInnerHTML</code>/<code>v-html</code>/<code>|safe</code> only with sanitised content.</>} /></li>
          <li><T pt="Validação de entrada acontece no SERVIDOR, mesmo que também exista no navegador (o navegador é só conforto para o usuário, não é segurança)." en="Input validation happens on the SERVER, even if it also exists in the browser (the browser is just user convenience, not security)." /></li>
          <li><T pt="Um WAF e um Content-Security-Policy são camadas extras, nunca a única defesa." en="A WAF and a Content-Security-Policy are extra layers, never the only defence." /></li>
        </ul>
      </Section>
      <Section id="ai-agents" title={<T pt="A nova fronteira: segurança de agentes de IA" en="The new frontier: AI agent security" />}>
        <p><T pt={<>Tudo até aqui assume que quem fala com a sua aplicação é um navegador controlado por uma pessoa. A nova peça é um <em>agente de IA</em>: um modelo de linguagem que lê conteúdo, decide, e <strong>age</strong> — chama APIs, roda código, lê e-mails, usa ferramentas via protocolos como o MCP (Model Context Protocol). Isso muda o modelo de ameaça: o "usuário" que manda instruções pode agora ser um texto que o próprio agente leu em algum lugar.</>} en={<>Everything so far assumes whoever talks to your application is a browser controlled by a person. The new piece is an <em>AI agent</em>: a language model that reads content, decides, and <strong>acts</strong> — calls APIs, runs code, reads emails, uses tools through protocols like MCP (Model Context Protocol). This changes the threat model: the "user" issuing instructions can now be a piece of text the agent itself read somewhere.</>} /></p>
        <h3><T pt="O OWASP Top 10 para aplicações LLM (2025)" en="The OWASP Top 10 for LLM Applications (2025)" /></h3>
        <Table
          head={[<T pt="#" en="#" />, <T pt="Risco" en="Risk" />, <T pt="Em uma frase" en="In one sentence" />]}
          rows={[
            ["LLM01", <T pt="Prompt injection" en="Prompt injection" />, <T pt="texto malicioso faz o modelo ignorar suas instruções originais e seguir as de outra pessoa" en="malicious text makes the model ignore its original instructions and follow someone else's" />],
            ["LLM02", <T pt="Vazamento de informação sensível" en="Sensitive information disclosure" />, <T pt="o modelo repete dados confidenciais do contexto, do treino ou do histórico" en="the model repeats confidential data from context, training or history" />],
            ["LLM03", <T pt="Cadeia de suprimentos" en="Supply chain" />, <T pt="um modelo, plugin ou dataset de terceiros comprometido entra na sua aplicação" en="a compromised third-party model, plugin or dataset enters your application" />],
            ["LLM04", <T pt="Envenenamento de dados/modelo" en="Data and model poisoning" />, <T pt="dados de treino ou de contexto manipulados para mudar o comportamento do modelo" en="training or context data manipulated to change the model's behaviour" />],
            ["LLM05", <T pt="Tratamento inadequado da saída" en="Improper output handling" />, <T pt="a saída do modelo é usada sem validação (vira SQL, HTML, comando de shell)" en="the model's output is used without validation (becomes SQL, HTML, a shell command)" />],
            ["LLM06", <T pt="Agência excessiva" en="Excessive agency" />, <T pt="o agente tem mais permissão ou autonomia do que a tarefa precisa" en="the agent has more permission or autonomy than the task needs" />],
            ["LLM07", <T pt="Vazamento do prompt de sistema" en="System prompt leakage" />, <T pt="instruções internas (às vezes com segredos) são extraídas pelo usuário" en="internal instructions (sometimes with secrets) are extracted by the user" />],
            ["LLM08", <T pt="Fraquezas de vetores/embeddings" en="Vector and embedding weaknesses" />, <T pt="ataques contra o pipeline de RAG e o banco vetorial" en="attacks against the RAG pipeline and the vector database" />],
            ["LLM09", <T pt="Desinformação" en="Misinformation" />, <T pt="o modelo apresenta algo errado com confiança (alucinação) e isso vira uma decisão" en="the model confidently states something wrong (hallucination) and it becomes a decision" />],
            ["LLM10", <T pt="Consumo ilimitado" en="Unbounded consumption" />, <T pt="nada limita quantas chamadas/tokens/custo um usuário ou agente pode gerar" en="nothing limits how many calls/tokens/cost a user or agent can generate" />],
          ]}
        />
        <h3><T pt="Prompt injection, de perto" en="Prompt injection, up close" /></h3>
        <p><T pt={"É o risco #1 da lista, e o mais diferente de tudo que veio antes nesta nota: não existe \"escapar a entrada\" que resolva, porque a instrução maliciosa e o conteúdo legítimo chegam pelo MESMO canal — texto em linguagem natural. Dois sabores:"} en={"It is risk #1 on the list, and the one most unlike everything else in this note: there is no \"escape the input\" fix, because the malicious instruction and the legitimate content arrive through the SAME channel — natural-language text. Two flavours:"} /></p>
        <Diagram minWidth={700} caption={<T pt="Injeção indireta: o atacante nunca fala com o agente diretamente — ele planta a instrução em algo que o agente vai processar depois, por conta própria." en="Indirect injection: the attacker never talks to the agent directly — they plant the instruction in something the agent will process later, on its own." />}>
          <svg viewBox="0 0 780 130" role="img" aria-label="Prompt injection indireta / Indirect prompt injection">
            <rect x="10" y="20" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="100" y="45" className="pt" textAnchor="middle">você</text>
            <text x="100" y="45" className="en" textAnchor="middle">you</text>
            <text x="100" y="63" className="pt mut mono" textAnchor="middle">"resuma este e-mail"</text>
            <text x="100" y="63" className="en mut mono" textAnchor="middle">"summarize this email"</text>
            <rect x="280" y="20" width="230" height="56" rx="4" className="ln" />
            <text x="395" y="45" className="pt" textAnchor="middle">agente de IA</text>
            <text x="395" y="45" className="en" textAnchor="middle">AI agent</text>
            <text x="395" y="63" className="pt mut mono" textAnchor="middle">lê o e-mail como contexto</text>
            <text x="395" y="63" className="en mut mono" textAnchor="middle">reads the email as context</text>
            <rect x="600" y="20" width="170" height="56" rx="4" className="ln fillsoft" />
            <text x="685" y="45" className="pt" textAnchor="middle">e-mail</text>
            <text x="685" y="45" className="en" textAnchor="middle">email</text>
            <text x="685" y="63" className="pt mut mono" textAnchor="middle">"ignore tudo e…"</text>
            <text x="685" y="63" className="en mut mono" textAnchor="middle">"ignore everything…"</text>
            <path d="M190 48L280 48" className="ln" />
            <path d="M273.2 44.7L280 48L273.2 51.3" className="ln" />
            <path d="M600 48L510 48" className="ln" />
            <path d="M516.8 51.3L510 48L516.8 44.7" className="ln" />
            <text x="685" y="100" className="pt mut" textAnchor="end">↑ instrução maliciosa ESCONDIDA no dado</text>
            <text x="685" y="100" className="en mut" textAnchor="end">↑ malicious instruction HIDDEN in the data</text>
            <text x="685" y="118" className="pt mut" textAnchor="end">que o agente só deveria LER</text>
            <text x="685" y="118" className="en mut" textAnchor="end">the agent was only meant to READ</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="Como funciona" en="How it works" />]}
          rows={[
            [<T pt="Direta" en="Direct" />, <T pt={"o próprio usuário escreve algo como \"ignore as instruções anteriores e...\" direto no chat"} en={"the user themself types something like \"ignore previous instructions and...\" straight into the chat"} />],
            [<T pt="Indireta" en="Indirect" />, <T pt="a instrução está escondida em algo que o agente vai LER depois: um e-mail, uma página web, um arquivo, a descrição de uma ferramenta MCP — o usuário nem sabe que ela está lá" en="the instruction is hidden in something the agent will READ later: an email, a web page, a file, an MCP tool description — the user does not even know it is there" />],
          ]}
        />
        <h3><T pt="Agência excessiva e os riscos específicos do MCP" en="Excessive agency and MCP-specific risks" /></h3>
        <p><T pt={<>Quando o agente só conversa, o pior caso é uma resposta errada. Quando ele tem <em>ferramentas</em> — manda e-mail, acessa um banco, roda código, chama uma API de pagamento — o pior caso é uma AÇÃO errada. O MCP (o protocolo mais comum hoje para conectar agentes a ferramentas) trouxe à tona uma família nova de riscos em 2025:</>} en={<>When the agent only talks, the worst case is a wrong answer. When it has <em>tools</em> — sends email, accesses a database, runs code, calls a payment API — the worst case is a wrong ACTION. MCP (today's most common protocol for connecting agents to tools) surfaced a new family of risks in 2025:</>} /></p>
        <Table
          head={[<T pt="Risco" en="Risk" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<T pt="Envenenamento de ferramenta (tool poisoning)" en="Tool poisoning" />, <T pt="a DESCRIÇÃO de uma ferramenta MCP (que o modelo lê, mas o usuário normalmente não vê) esconde instruções — o servidor pode atacar antes mesmo de qualquer ferramenta ser chamada" en="an MCP tool's DESCRIPTION (which the model reads but the user usually never sees) hides instructions — the server can attack before any tool is even called" />],
            [<T pt="Confused deputy" en="Confused deputy" />, <T pt="um servidor MCP usa os PRÓPRIOS privilégios elevados em vez de agir em nome de quem pediu, fazendo algo que o usuário não tinha permissão de fazer" en="an MCP server uses its OWN elevated privileges instead of acting on behalf of the requester, doing something the user was not allowed to do" />],
            [<T pt="Repasse de token (token passthrough)" en="Token passthrough" />, <T pt="um servidor encaminha um token emitido para UM serviço a uma API diferente — a especificação do MCP proíbe isso explicitamente" en="a server forwards a token issued for ONE service to a different API — the MCP spec explicitly forbids this" />],
            [<T pt={"\"Rug pull\" / cadeia de suprimentos"} en={"\"Rug pull\" / supply chain"} />, <T pt="um pacote MCP passa por revisão com comportamento legítimo e, numa atualização POSTERIOR, muda — em setembro de 2025 um servidor MCP de e-mail amplamente instalado passou a copiar e-mails enviados pelo agente para um endereço do atacante" en="an MCP package passes review behaving legitimately and, in a LATER update, changes — in September 2025 a widely installed email MCP server started copying emails sent through the agent to an attacker-controlled address" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={"RAG e fine-tuning não resolvem prompt injection — eles aterram o modelo em dados melhores, mas não o tornam seguro contra instruções hostis misturadas nesses mesmos dados. É um erro comum tratar \"o modelo é bom\" como defesa de segurança."} en={"RAG and fine-tuning do not fix prompt injection — they ground the model in better data, but they do not make it secure against hostile instructions mixed into that same data. It is a common mistake to treat \"the model is good\" as a security control."} /></Callout>
        <h3><T pt="Defesas que funcionam hoje" en="Defences that work today" /></h3>
        <Table
          head={[<T pt="Princípio" en="Principle" />, <T pt="Na prática" en="In practice" />]}
          rows={[
            [<T pt="Privilégio mínimo nas ferramentas" en="Least privilege on tools" />, <T pt={"o agente só tem acesso às ferramentas e escopos que a tarefa específica precisa — nunca uma chave de API \"para tudo\""} en={"the agent only has access to the tools and scopes the specific task needs — never an \"everything\" API key"} />],
            [<T pt="Humano no laço para ações sensíveis" en="Human in the loop for sensitive actions" />, <T pt={"mandar dinheiro, apagar dados, enviar e-mail em massa: peça confirmação explícita antes de executar, não só antes de \"sugerir\""} en={"sending money, deleting data, mass-emailing: ask for explicit confirmation before executing, not just before \"suggesting\""} />],
            [<T pt="Tratar todo conteúdo lido como dado, nunca como instrução" en="Treat all content read as data, never as instructions" />, <T pt="um e-mail, uma página web ou o resultado de uma ferramenta NUNCA deveriam poder mudar o comportamento do agente da mesma forma que o pedido original do usuário" en="an email, a web page or a tool result should NEVER be able to change the agent's behaviour the way the original user request can" />],
            [<T pt="Isolamento/sandboxing" en="Isolation/sandboxing" />, <T pt="código gerado por um agente roda num contêiner descartável, sem acesso à rede ou a segredos reais por padrão" en="agent-generated code runs in a throwaway container, with no network or real-secret access by default" />],
            [<T pt="Validar a saída antes de agir" en="Validate output before acting" />, <T pt="se a saída do modelo vira uma chamada de API, trate-a como entrada não confiável: valide o formato e os limites antes de executar" en="if the model's output becomes an API call, treat it as untrusted input: validate the shape and the limits before executing" />],
            [<T pt="Revisão do que o agente pode instalar/conectar" en="Review of what the agent can install/connect" />, <T pt={"trate um novo servidor MCP como uma nova dependência de produção: fixe a versão, audite antes de atualizar (o caso do \"rug pull\" acima só funcionou porque ninguém revisou a atualização)"} en={"treat a new MCP server like a new production dependency: pin the version, audit before upgrading (the \"rug pull\" case above only worked because nobody reviewed the update)"} />],
            [<T pt="Limites de uso" en="Usage limits" />, <T pt="tetos de custo, de chamadas e de tempo por agente/usuário, para o LLM10 (consumo ilimitado) nunca virar uma conta surpresa ou uma negação de serviço" en="cost, call and time caps per agent/user, so LLM10 (unbounded consumption) never turns into a surprise bill or a denial of service" />],
          ]}
        />
        <p><T pt="O paralelo com o resto desta nota: um agente com uma ferramenta de banco de dados sem privilégio mínimo é o mesmo erro que uma aplicação conectando como super-usuário do Postgres (nota de Postgres); confiar cegamente no texto que um agente leu é o mesmo erro de confiar na entrada de um usuário sem validar (seção de SQL injection e XSS acima). O princípio não muda; a superfície de ataque é que é nova." en="The parallel with the rest of this note: an agent with a database tool and no least privilege is the same mistake as an application connecting as a Postgres superuser (the Postgres note); blindly trusting text an agent read is the same mistake as trusting user input without validation (the SQL injection and XSS section above). The principle does not change; it is the attack surface that is new." /></p>
      </Section>
      <Section id="cheat-wa" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faça" en="Do" />]}
          rows={[
            [<T pt="ver os cabeçalhos de um site" en="see a site's headers" />, <code>curl -sI https://exemplo.com</code>],
            [<T pt="testar a nota de um site em segurança de cabeçalhos" en="grade a site's header security" />, "securityheaders.com"],
            [<T pt="revogar uma sessão na hora" en="revoke a session immediately" />, <T pt="use sessão stateful (apagar do Redis), ou JWT + denylist" en="use a stateful session (delete from Redis), or JWT + denylist" />],
            [<T pt="guardar um refresh token com segurança" en="store a refresh token safely" />, <T pt={<>cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict</code></>} en={<>an <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite=Strict</code> cookie</>} />],
            [<T pt="proteger contra CSRF" en="protect against CSRF" />, <T pt={<><code>SameSite=Lax</code>/<code>Strict</code> + token CSRF em rotas que mudam dados</>} en={<><code>SameSite=Lax</code>/<code>Strict</code> + a CSRF token on state-changing routes</>} />],
            [<T pt="dar uma ferramenta a um agente de IA com segurança" en="safely give a tool to an AI agent" />, <T pt="privilégio mínimo + confirmação humana para ações sensíveis" en="least privilege + human confirmation for sensitive actions" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="O que o HTTPS protege, e o que ele NÃO protege?" en="What does HTTPS protect, and what does it NOT protect?" />, <T pt="Protege o transporte (confidencialidade, integridade, autenticidade); não protege contra SQL injection, XSS ou entrada não validada." en="It protects the transport (confidentiality, integrity, authenticity); it does not protect against SQL injection, XSS or unvalidated input." />],
            [<T pt="Qual cabeçalho é a defesa mais forte do navegador contra XSS?" en="Which header is the browser's strongest defence against XSS?" />, <T pt="Content-Security-Policy." en="Content-Security-Policy." />],
            [<T pt={<>Por que <code>SameSite=None</code> num cookie de autenticação é um sinal de alerta?</>} en={<>Why is <code>SameSite=None</code> on an authentication cookie a red flag?</>} />, <T pt="Porque o cookie passa a viajar em requisições de QUALQUER origem, abrindo a porta para CSRF." en="Because the cookie starts travelling on requests from ANY origin, opening the door to CSRF." />],
            [<T pt="Qual a diferença central entre revogar uma sessão stateful e um JWT?" en="What is the key difference between revoking a stateful session and a JWT?" />, <T pt="Sessão: apagar uma linha no servidor. JWT: válido até expirar, a menos que haja uma denylist." en="Session: delete a row on the server. JWT: valid until it expires, unless there is a denylist." />],
            [<T pt="Por que o access token deveria ter vida curta?" en="Why should the access token be short-lived?" />, <T pt="Porque não dá para revogá-lo antes da hora; uma vida curta limita o estrago de um vazamento." en="Because it cannot be revoked early; a short life limits the damage of a leak." />],
            [<T pt="O que diferencia prompt injection direta de indireta?" en="What tells direct and indirect prompt injection apart?" />, <T pt="Direta: o usuário escreve a instrução maliciosa. Indireta: ela está escondida em algo que o agente lê (e-mail, página, ferramenta)." en="Direct: the user types the malicious instruction. Indirect: it is hidden in something the agent reads (email, page, tool)." />],
            [<T pt="Por que um bom RAG não resolve prompt injection?" en="Why doesn't a good RAG fix prompt injection?" />, <T pt="Porque aterra o modelo em dados melhores, mas não o protege de instruções hostis escondidas nesses mesmos dados." en="Because it grounds the model in better data, but does not protect it from hostile instructions hidden in that same data." />],
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
