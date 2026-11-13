import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "nodejs-typescript",
  title: { en: "Node.js and TypeScript: from the language to production", pt: "Node.js e TypeScript: da linguagem à produção" },
  seo: {
    title: {
      en: "Node.js and TypeScript end to end: event loop, streams, env, tests, CI/CD, observability and load testing",
      pt: "Node.js e TypeScript de ponta a ponta: event loop, streams, env, testes, CI/CD, observabilidade e carga",
    },
    description: {
      en: "What someone who specialises in JavaScript and TypeScript, on the back and the front end, should know: how V8, libuv and the event loop work, why blocking hurts, streams and backpressure, TypeScript in Node and the browser, environment variables, tests with node:test, Docker and graceful shutdown, CI/CD, observability, profiling and load testing. Every number was measured.",
      pt: "O que quem se especializa em JavaScript e TypeScript, no back e no front, deveria saber: como V8, libuv e o event loop funcionam, por que bloquear dói, streams e backpressure, TypeScript no Node e no navegador, variáveis de ambiente, testes com node:test, Docker e desligamento gracioso, CI/CD, observabilidade, profiling e teste de carga. Todos os números foram medidos.",
    },
  },
  summary:
    "A study guide for developers who specialise in JavaScript and TypeScript on both the back and the front end, with Erick Wendel (Node.js core committer, author of the node:test mock timers, creator of a JavaScript runtime built from scratch on V8 and libuv) as the reference for going deep. Covers the language (single thread, promises, errors, ESM versus CommonJS), the runtime (V8, libuv, the event loop phases, microtasks, the thread pool) with a measured ordering experiment that differs between ESM and CommonJS, a measured event-loop blocking experiment (1.5 s of CPU makes /health wait 1.36 s; a worker thread brings it back to 10 ms), streams and backpressure (868 MB versus 75 MB peak memory for a 200 MB file), TypeScript in Node (type stripping, tsc, tsconfig) and in the browser (Vite, public VITE_ variables, Web Vitals), configuration with --env-file and zod, tests with node:test and mock timers, Vitest and Playwright, Docker and graceful shutdown (node as PID 1 takes 10 s to stop without a SIGTERM handler), CI/CD with GitHub Actions and supply-chain hygiene, observability (pino, AsyncLocalStorage, OpenTelemetry, event loop delay) and performance (CPU profiles, autocannon, k6), plus a study path, cheat sheet and review questions.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: {
    en: <>Node.js and TypeScript, <em>from the event loop to production.</em></>,
    pt: <>Node.js e TypeScript, <em>do event loop à produção.</em></>,
  },
  heroLede: {
    en: "One language on both sides of the wire. What someone who specialises in it should know beyond the syntax: how the runtime works, what blocks it, how configuration arrives, how to test, ship, observe and load-test it. Every experiment here was run, and the numbers are the ones measured.",
    pt: "Uma linguagem dos dois lados do fio. O que quem se especializa nela deveria saber além da sintaxe: como o runtime funciona, o que o trava, como a configuração chega, como testar, publicar, observar e colocar sob carga. Todos os experimentos daqui foram executados, e os números são os medidos.",
  },
  published: "2026-11-03",
  updated: "2026-11-03",
  toc: [
    {
      label: <T pt="A linguagem e o runtime" en="The language and the runtime" />,
      items: [
        { id: "map", title: <T pt="O mapa e a referência" en="The map and the reference" /> },
        { id: "language", title: <T pt="JavaScript: o que importa de verdade" en="JavaScript: what really matters" /> },
        { id: "runtime", title: <T pt="Como o Node funciona: V8, libuv e o event loop" en="How Node works: V8, libuv and the event loop" /> },
        { id: "blocking", title: <T pt="Não bloqueie o event loop" en="Do not block the event loop" /> },
        { id: "streams", title: <T pt="Streams e backpressure" en="Streams and backpressure" /> },
        { id: "typescript", title: <T pt="TypeScript no back e no front" en="TypeScript on the back and the front" /> },
      ],
    },
    {
      label: <T pt="Do código à produção" en="From code to production" />,
      items: [
        { id: "tooling", title: <T pt="Ferramentas do dia a dia" en="Everyday tools" /> },
        { id: "env", title: <T pt="Configuração e variáveis de ambiente" en="Configuration and environment variables" /> },
        { id: "front", title: <T pt="O lado do front" en="The front-end side" /> },
        { id: "tests", title: <T pt="Testes" en="Tests" /> },
        { id: "prod", title: <T pt="Produção: Docker, processos e desligamento" en="Production: Docker, processes and shutdown" /> },
        { id: "cicd", title: <T pt="CI/CD e a cadeia de dependências" en="CI/CD and the dependency chain" /> },
      ],
    },
    {
      label: <T pt="Operando" en="Operating it" />,
      items: [
        { id: "observability", title: <T pt="Observabilidade em Node" en="Observability in Node" /> },
        { id: "performance", title: <T pt="Performance, profiling e teste de carga" en="Performance, profiling and load testing" /> },
        { id: "path", title: <T pt="Trilha de estudo" en="Study path" /> },
        { id: "cheat-node", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

/** A straight connector with an arrowhead at `to`, drawn in the figure's line colour. */
function Arrow({ from, to, dashed = false }: { from: [number, number]; to: [number, number]; dashed?: boolean }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headPoint = (spread: number) =>
    `${(x2 - 7 * Math.cos(angle - spread)).toFixed(1)} ${(y2 - 7 * Math.sin(angle - spread)).toFixed(1)}`;
  return (
    <>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} className={dashed ? "ln dash" : "ln"} />
      <path d={`M${headPoint(0.45)}L${x2} ${y2}L${headPoint(-0.45)}`} className="ln" />
    </>
  );
}

/** The same SVG label in both languages; CSS shows the active one. */
function Label({ x, y, pt, en, className = "", anchor = "middle" }: { x: number; y: number; pt: string; en: string; className?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <>
      <text x={x} y={y} className={`pt ${className}`.trim()} textAnchor={anchor}>{pt}</text>
      <text x={x} y={y} className={`en ${className}`.trim()} textAnchor={anchor}>{en}</text>
    </>
  );
}

function Body() {
  return (
    <>
      <Section id="map" title={<T pt="O mapa e a referência" en="The map and the reference" />}>
        <p><T pt={<>JavaScript é a única linguagem que roda nativamente no navegador e, com o <strong>Node.js</strong>, também no servidor. Quem escolhe se especializar nela ganha uma vantagem rara: o mesmo idioma, os mesmos tipos e às vezes o mesmo código dos dois lados do fio. O preço é que “saber JavaScript” não basta. É preciso entender o <strong>runtime</strong> (o que executa o código e como ele espera por I/O), o <strong>ferramental</strong> (TypeScript, gerenciador de pacotes, bundler, test runner) e a <strong>operação</strong> (configuração, deploy, observabilidade, carga). Esta nota percorre os três.</>} en={<>JavaScript is the only language that runs natively in the browser and, with <strong>Node.js</strong>, on the server too. Whoever chooses to specialise in it gets a rare advantage: the same language, the same types and sometimes the same code on both sides of the wire. The price is that “knowing JavaScript” is not enough. You need to understand the <strong>runtime</strong> (what executes the code and how it waits for I/O), the <strong>tooling</strong> (TypeScript, package manager, bundler, test runner) and the <strong>operation</strong> (configuration, deploy, observability, load). This note walks through all three.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="As camadas de um processo Node. O seu código fala com APIs em JavaScript; por baixo, o V8 executa o JavaScript e o libuv cuida do event loop, do I/O e de um pool de threads." en="The layers of a Node process. Your code talks to JavaScript APIs; underneath, V8 runs the JavaScript and libuv handles the event loop, I/O and a thread pool." />}>
          <svg viewBox="0 0 700 300" role="img" aria-label="Camadas do Node.js / Node.js layers">
            <rect x="10" y="10" width="680" height="46" rx="4" className="brandfill" />
            <Label x={350} y={30} pt="Seu código (TypeScript compilado ou com tipos apagados)" en="Your code (TypeScript compiled or with types stripped)" />
            <text x="350" y="47" className="mono mut" textAnchor="middle">app.ts · express · fastify · react-dom/server</text>
            <rect x="10" y="70" width="680" height="46" rx="4" className="ln fillsoft" />
            <Label x={350} y={90} pt="APIs do Node em JavaScript" en="Node's JavaScript APIs" />
            <text x="350" y="107" className="mono mut" textAnchor="middle">node:fs · node:http · node:stream · node:crypto · node:test · node:worker_threads</text>
            <rect x="10" y="130" width="680" height="40" rx="4" className="ln" />
            <Label x={350} y={155} pt="Bindings em C++ (a ponte entre o JavaScript e o sistema)" en="C++ bindings (the bridge between JavaScript and the system)" className="mut" />
            <rect x="10" y="184" width="330" height="58" rx="4" className="ln fillsoft" />
            <text x="175" y="206" className="mono" textAnchor="middle">V8</text>
            <Label x={175} y={226} pt="compila e executa JS, heap, GC" en="compiles and runs JS, heap, GC" className="mut" />
            <rect x="360" y="184" width="330" height="58" rx="4" className="ln fillsoft" />
            <text x="525" y="206" className="mono" textAnchor="middle">libuv</text>
            <Label x={525} y={226} pt="event loop, I/O assíncrono, thread pool" en="event loop, async I/O, thread pool" className="mut" />
            <rect x="10" y="256" width="680" height="36" rx="4" className="ln" />
            <Label x={350} y={279} pt="Sistema operacional: epoll (Linux), kqueue (macOS), IOCP (Windows)" en="Operating system: epoll (Linux), kqueue (macOS), IOCP (Windows)" className="mut" />
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="O que saber" en="What to know" />, <T pt="Ferramentas" en="Tools" />]}
          rows={[
            [<T pt="Linguagem" en="Language" />, <T pt="promises, async/await, closures, erros, ESM e CommonJS" en="promises, async/await, closures, errors, ESM and CommonJS" />, <>ECMAScript, MDN</>],
            [<T pt="Runtime" en="Runtime" />, <T pt="event loop, microtasks, thread pool, streams, workers" en="event loop, microtasks, thread pool, streams, workers" />, <>Node.js (V8 + libuv)</>],
            [<T pt="Tipos" en="Types" />, <T pt="tsconfig, tipos nas fronteiras, validação em runtime" en="tsconfig, types at the boundaries, runtime validation" />, <>TypeScript, zod</>],
            [<T pt="Front" en="Front end" />, <T pt="event loop do navegador, bundle, hidratação, Web Vitals" en="browser event loop, bundle, hydration, Web Vitals" />, <>Vite, React, Lighthouse</>],
            [<T pt="Testes" en="Tests" />, <T pt="unidade, integração, ponta a ponta, mocks de tempo" en="unit, integration, end to end, time mocks" />, <>node:test, Vitest, Playwright</>],
            [<T pt="Entrega" en="Delivery" />, <T pt="lockfile, imagem, sinais, health check, pipeline" en="lockfile, image, signals, health check, pipeline" />, <>pnpm/npm, Docker, GitHub Actions</>],
            [<T pt="Operação" en="Operation" />, <T pt="logs estruturados, traces, atraso do event loop, carga" en="structured logs, traces, event loop delay, load" />, <>pino, OpenTelemetry, autocannon, k6</>],
          ]}
        />
        <h3><T pt="A referência: Erick Wendel" en="The reference: Erick Wendel" /></h3>
        <p><T pt={<>Para ir fundo em Node, uma boa referência brasileira é o <strong>Erick Wendel</strong>. Ele é committer do <a href="https://github.com/nodejs/node" rel="noopener">núcleo do Node.js</a> e escreveu partes que você vai usar nesta nota: os <strong>mock timers</strong> do test runner nativo (<a href="https://github.com/nodejs/node/pull/47775" rel="noopener">PR #47775</a>, no Node 20.4) e depois o mock de <code>Date</code>, que levou o recurso a estável no Node 23.1. Ele também <a href="https://github.com/ErickWendel/myownnode" rel="noopener">recriou um runtime JavaScript do zero</a> em C++, com V8 e libuv, para mostrar o que o Node faz por baixo (conversa no <a href="https://changelog.com/jsparty/268" rel="noopener">JS Party #268</a>). O estilo dele é o desta nota: entender o mecanismo construindo e medindo, em vez de decorar API. Os conteúdos estão no <a href="https://erickwendel.com.br" rel="noopener">site dele</a> e nos cursos da <a href="https://ew.academy" rel="noopener">ew.academy</a>.</>} en={<>To go deep in Node, a good Brazilian reference is <strong>Erick Wendel</strong>. He is a <a href="https://github.com/nodejs/node" rel="noopener">Node.js core</a> committer and wrote parts you will use in this note: the native test runner's <strong>mock timers</strong> (<a href="https://github.com/nodejs/node/pull/47775" rel="noopener">PR #47775</a>, in Node 20.4) and later the <code>Date</code> mock, which took the feature to stable in Node 23.1. He also <a href="https://github.com/ErickWendel/myownnode" rel="noopener">rebuilt a JavaScript runtime from scratch</a> in C++, with V8 and libuv, to show what Node does underneath (discussed on <a href="https://changelog.com/jsparty/268" rel="noopener">JS Party #268</a>). His style is this note's: understand the mechanism by building and measuring, instead of memorising APIs. His material is on his <a href="https://erickwendel.com.br" rel="noopener">site</a> and in the <a href="https://ew.academy" rel="noopener">ew.academy</a> courses.</>} /></p>
        <Callout icon="check"><T pt={<><strong>Como os números desta nota foram obtidos.</strong> Rodei tudo no Node 24.18 (Linux) e conferi os pontos sensíveis no Node 26.13 em contêiner (<code>node:26-alpine</code>). Em 3 de novembro de 2026, o Node 26 é a linha <em>Active LTS</em> e o 24 está em manutenção até abril de 2028, segundo o <a href="https://github.com/nodejs/Release" rel="noopener">calendário oficial</a>. A partir do Node 27 o projeto passa a lançar uma versão por ano, e toda versão vira LTS.</>} en={<><strong>How this note's numbers were obtained.</strong> I ran everything on Node 24.18 (Linux) and checked the sensitive points on Node 26.13 in a container (<code>node:26-alpine</code>). On 3 November 2026, Node 26 is the <em>Active LTS</em> line and 24 is in maintenance until April 2028, according to the <a href="https://github.com/nodejs/Release" rel="noopener">official schedule</a>. From Node 27 on, the project ships one major a year, and every major becomes LTS.</>} /></Callout>
      </Section>

      <Section id="language" title={<T pt="JavaScript: o que importa de verdade" en="JavaScript: what really matters" />}>
        <p><T pt={<>Sintaxe se aprende em uma semana. O que separa quem domina JavaScript é entender poucas ideias que explicam quase todos os bugs estranhos.</>} en={<>Syntax takes a week to learn. What sets apart someone who masters JavaScript is understanding a few ideas that explain almost every strange bug.</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Uma thread executa o seu JavaScript.</strong> Nunca duas funções suas rodam ao mesmo tempo no mesmo processo (salvo em workers, que têm memória separada). Isso elimina condições de corrida em variáveis, mas significa que um laço demorado trava <em>tudo</em>. Concorrência em JavaScript é <em>esperar</em> várias coisas ao mesmo tempo, não <em>calcular</em> várias ao mesmo tempo.</>} en={<><strong>One thread runs your JavaScript.</strong> Two of your functions never run at the same time in the same process (except in workers, which have separate memory). This removes race conditions on variables, but it means a long loop freezes <em>everything</em>. Concurrency in JavaScript is <em>waiting</em> for several things at once, not <em>computing</em> several at once.</>} /></li>
          <li><T pt={<><strong>Promise é um valor que chega depois.</strong> <code>async/await</code> é açúcar sobre promises: cada <code>await</code> devolve o controle ao event loop e continua numa <em>microtask</em>. Para esperar várias coisas em paralelo, inicie todas e espere juntas com <code>Promise.all</code> (falha na primeira rejeição) ou <code>Promise.allSettled</code> (espera todas). Um <code>await</code> dentro de um <code>for</code> transforma chamadas independentes em uma fila.</>} en={<><strong>A promise is a value that arrives later.</strong> <code>async/await</code> is sugar over promises: each <code>await</code> hands control back to the event loop and resumes in a <em>microtask</em>. To wait for several things in parallel, start them all and wait together with <code>Promise.all</code> (fails on the first rejection) or <code>Promise.allSettled</code> (waits for all). An <code>await</code> inside a <code>for</code> turns independent calls into a queue.</>} /></li>
          <li><T pt={<><strong>Erro assíncrono não tratado derruba o processo.</strong> Desde o Node 15 uma promise rejeitada sem <code>catch</code> encerra o processo (modo <code>--unhandled-rejections=throw</code>). Vi isso acontecer no laboratório: um handler HTTP <code>async</code> lançou erro, ninguém capturou, e o servidor caiu. Todo ponto de entrada assíncrono (handler, job, listener) precisa de um <code>catch</code> que registra e responde.</>} en={<><strong>An unhandled async error kills the process.</strong> Since Node 15 a rejected promise with no <code>catch</code> ends the process (<code>--unhandled-rejections=throw</code> mode). I saw it happen in the lab: an <code>async</code> HTTP handler threw, nobody caught it, and the server went down. Every async entry point (handler, job, listener) needs a <code>catch</code> that logs and responds.</>} /></li>
          <li><T pt={<><strong>Closures guardam variáveis, não valores.</strong> Uma função lembra o escopo onde nasceu. É assim que funcionam <code>debounce</code>, caches e módulos, e também a origem de vazamentos de memória: um listener que nunca é removido mantém vivo tudo o que a sua closure enxerga.</>} en={<><strong>Closures keep variables, not values.</strong> A function remembers the scope it was born in. That is how <code>debounce</code>, caches and modules work, and also the origin of memory leaks: a listener that is never removed keeps alive everything its closure can see.</>} /></li>
          <li><T pt={<><strong>Números são <code>double</code>.</strong> <code>0.1 + 0.2 !== 0.3</code> e inteiros só são exatos até <code>Number.MAX_SAFE_INTEGER</code> (2⁵³ − 1). Dinheiro em centavos inteiros; IDs grandes de banco (bigint do Postgres) como string ou <code>BigInt</code>.</>} en={<><strong>Numbers are <code>double</code>.</strong> <code>0.1 + 0.2 !== 0.3</code> and integers are only exact up to <code>Number.MAX_SAFE_INTEGER</code> (2⁵³ − 1). Money in integer cents; large database IDs (Postgres bigint) as strings or <code>BigInt</code>.</>} /></li>
          <li><T pt={<><strong>Dois sistemas de módulos.</strong> <strong>ESM</strong> (<code>import</code>/<code>export</code>) é o padrão da linguagem e o que o navegador entende. <strong>CommonJS</strong> (<code>require</code>) é o formato original do Node. O Node decide pelo campo <code>"type"</code> do <code>package.json</code> ou pela extensão (<code>.mjs</code>, <code>.cjs</code>). Projeto novo: ESM. Atenção: o <code>npm init</code> do npm 11 grava <code>"type": "commonjs"</code>, e meu primeiro <code>import</code> falhou por isso.</>} en={<><strong>Two module systems.</strong> <strong>ESM</strong> (<code>import</code>/<code>export</code>) is the language standard and what the browser understands. <strong>CommonJS</strong> (<code>require</code>) is Node's original format. Node decides by the <code>"type"</code> field in <code>package.json</code> or by the extension (<code>.mjs</code>, <code>.cjs</code>). New project: ESM. Watch out: npm 11's <code>npm init</code> writes <code>"type": "commonjs"</code>, and my first <code>import</code> failed because of it.</>} /></li>
          <li><T pt={<><strong>Cancelamento é um padrão, não um detalhe.</strong> <code>AbortController</code> e <code>AbortSignal.timeout(ms)</code> funcionam no <code>fetch</code>, em streams, timers e várias APIs do Node. Toda chamada de rede precisa de timeout; sem ele, uma dependência lenta prende conexões até esgotar o servidor.</>} en={<><strong>Cancellation is a pattern, not a detail.</strong> <code>AbortController</code> and <code>AbortSignal.timeout(ms)</code> work with <code>fetch</code>, streams, timers and many Node APIs. Every network call needs a timeout; without one, a slow dependency holds connections until the server runs out.</>} /></li>
        </ul>
        <CodeBlock code={`// Sequencial sem querer: ~3 × latência
for (const id of ids) users.push(await fetchUser(id));

// Paralelo: ~1 × latência (e cada chamada com timeout)
const users = await Promise.all(
  ids.map((id) => fetch(\`\${API}/users/\${id}\`, { signal: AbortSignal.timeout(2_000) })
    .then((response) => response.json())),
);`} />
      </Section>

      <Section id="runtime" title={<T pt="Como o Node funciona: V8, libuv e o event loop" en="How Node works: V8, libuv and the event loop" />}>
        <p><T pt={<>O <strong>V8</strong> é o motor JavaScript do Chrome: compila o código para instruções de máquina (com um compilador que otimiza as funções “quentes”), gerencia o heap e faz a coleta de lixo. Ele não sabe abrir arquivo nem socket. Quem sabe é o <strong>libuv</strong>, uma biblioteca em C que dá ao Node um <strong>event loop</strong>: um laço que pergunta ao sistema operacional “o que ficou pronto?” e chama os callbacks correspondentes. Rede usa as APIs assíncronas do próprio sistema (epoll no Linux). O que o sistema não oferece de forma assíncrona vai para um <strong>pool de threads</strong> (4 por padrão, ajustável com <code>UV_THREADPOOL_SIZE</code>): leitura de arquivos, <code>dns.lookup</code>, <code>crypto.pbkdf2</code>, <code>scrypt</code> e <code>zlib</code>.</>} en={<><strong>V8</strong> is Chrome's JavaScript engine: it compiles code to machine instructions (with a compiler that optimises “hot” functions), manages the heap and collects garbage. It cannot open a file or a socket. <strong>libuv</strong> can: a C library that gives Node an <strong>event loop</strong>, a loop that asks the operating system “what is ready?” and calls the matching callbacks. Networking uses the system's own async APIs (epoll on Linux). What the system does not offer asynchronously goes to a <strong>thread pool</strong> (4 by default, tunable with <code>UV_THREADPOOL_SIZE</code>): file reads, <code>dns.lookup</code>, <code>crypto.pbkdf2</code>, <code>scrypt</code> and <code>zlib</code>.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="As fases de uma volta do event loop. Entre um callback e o próximo, o Node esvazia as filas de microtasks: primeiro process.nextTick, depois as promises." en="The phases of one turn of the event loop. Between one callback and the next, Node drains the microtask queues: process.nextTick first, then promises." />}>
          <svg viewBox="0 0 700 300" role="img" aria-label="Fases do event loop / Event loop phases">
            <rect x="20" y="20" width="200" height="52" rx="4" className="brandfill" />
            <text x="120" y="42" className="mono" textAnchor="middle">timers</text>
            <text x="120" y="60" className="mono mut" textAnchor="middle">setTimeout, setInterval</text>
            <rect x="250" y="20" width="200" height="52" rx="4" className="ln fillsoft" />
            <text x="350" y="42" className="mono" textAnchor="middle">pending</text>
            <Label x={350} y={60} pt="callbacks de sistema adiados" en="deferred system callbacks" className="mut" />
            <rect x="480" y="20" width="200" height="52" rx="4" className="brandfill" />
            <text x="580" y="42" className="mono" textAnchor="middle">poll</text>
            <Label x={580} y={60} pt="espera e roda I/O pronto" en="waits for and runs ready I/O" className="mut" />
            <rect x="480" y="150" width="200" height="52" rx="4" className="brandfill" />
            <text x="580" y="172" className="mono" textAnchor="middle">check</text>
            <text x="580" y="190" className="mono mut" textAnchor="middle">setImmediate</text>
            <rect x="250" y="150" width="200" height="52" rx="4" className="ln fillsoft" />
            <text x="350" y="172" className="mono" textAnchor="middle">close</text>
            <text x="350" y="190" className="mono mut" textAnchor="middle">socket.on('close')</text>
            <Arrow from={[220, 46]} to={[250, 46]} />
            <Arrow from={[450, 46]} to={[480, 46]} />
            <Arrow from={[580, 72]} to={[580, 150]} />
            <Arrow from={[480, 176]} to={[450, 176]} />
            <path d="M250 176H120V80" className="ln" />
            <Arrow from={[120, 80]} to={[120, 72]} />
            <rect x="20" y="232" width="660" height="56" rx="4" className="ln dash" />
            <Label x={350} y={254} pt="Depois de cada callback: esvazia process.nextTick, depois as microtasks (promises, queueMicrotask)" en="After each callback: drain process.nextTick, then microtasks (promises, queueMicrotask)" />
            <Label x={350} y={274} pt="Se essas filas nunca esvaziam, o loop nunca avança" en="If these queues never empty, the loop never advances" className="mut" />
          </svg>
        </Diagram>
        <h3><T pt="O experimento da ordem" en="The ordering experiment" /></h3>
        <p><T pt={<>O clássico das entrevistas: em que ordem isto imprime? Rodei o mesmo arquivo como ESM (<code>.mjs</code>) e como CommonJS (<code>.cjs</code>), no Node 24 e no 26. O resultado tem uma pegadinha que a maioria dos artigos não menciona.</>} en={<>The interview classic: in what order does this print? I ran the same file as ESM (<code>.mjs</code>) and as CommonJS (<code>.cjs</code>), on Node 24 and 26. The result has a catch most articles do not mention.</>} /></p>
        <CodeBlock code={`import fs from "node:fs";

console.log("1 sync");
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
queueMicrotask(() => console.log("queueMicrotask"));
fs.readFile(import.meta.filename, () => {
  setTimeout(() => console.log("io → timeout"), 0);
  setImmediate(() => console.log("io → immediate"));
});
console.log("2 sync");`} />
        <Table
          head={[<T pt="Posição" en="Position" />, <T pt="ESM (.mjs)" en="ESM (.mjs)" />, <T pt="CommonJS (.cjs)" en="CommonJS (.cjs)" />]}
          rows={[
            ["1–2", <code>1 sync, 2 sync</code>, <code>1 sync, 2 sync</code>],
            ["3", <code>promise</code>, <code>nextTick</code>],
            ["4", <code>queueMicrotask</code>, <code>promise</code>],
            ["5", <code>nextTick</code>, <code>queueMicrotask</code>],
            ["6–7", <code>timeout, immediate</code>, <code>timeout, immediate</code>],
            ["8–9", <code>io → immediate, io → timeout</code>, <code>io → immediate, io → timeout</code>],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong>Código síncrono sempre termina antes.</strong> Nenhum callback interrompe uma função no meio.</>} en={<><strong>Synchronous code always finishes first.</strong> No callback interrupts a function halfway.</>} /></li>
          <li><T pt={<><strong>No ESM, as promises passaram na frente do <code>nextTick</code>.</strong> Um módulo ES é avaliado de forma assíncrona, como se já estivesse dentro de uma promise; quando ele termina, a fila de microtasks está sendo esvaziada e as promises novas entram nela antes de o Node olhar a fila do <code>nextTick</code>. No CommonJS, o script roda “fora” de uma microtask e o <code>nextTick</code> vem primeiro, como dizem os livros. Moral: não escreva código que dependa dessa ordem.</>} en={<><strong>In ESM, promises jumped ahead of <code>nextTick</code>.</strong> An ES module is evaluated asynchronously, as if already inside a promise; when it ends, the microtask queue is being drained and new promises join it before Node looks at the <code>nextTick</code> queue. In CommonJS, the script runs “outside” a microtask and <code>nextTick</code> comes first, as the books say. Moral: do not write code that depends on this order.</>} /></li>
          <li><T pt={<><strong><code>setTimeout(0)</code> contra <code>setImmediate</code> no módulo principal não é garantido.</strong> A <a href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" rel="noopener">documentação</a> diz que depende de quanto tempo o processo levou para entrar no loop. Dentro de um callback de I/O, porém, o <code>setImmediate</code> vence sempre: depois do <em>poll</em> vem o <em>check</em>, e os timers só na volta seguinte.</>} en={<><strong><code>setTimeout(0)</code> versus <code>setImmediate</code> in the main module is not guaranteed.</strong> The <a href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" rel="noopener">docs</a> say it depends on how long the process took to enter the loop. Inside an I/O callback, however, <code>setImmediate</code> always wins: after <em>poll</em> comes <em>check</em>, and timers only on the next turn.</>} /></li>
        </ul>
      </Section>

      <Section id="blocking" title={<T pt="Não bloqueie o event loop" en="Do not block the event loop" />}>
        <p><T pt={<>Se uma thread executa todo o seu JavaScript, um cálculo de 1,5 segundo faz <em>todos</em> os outros usuários esperarem 1,5 segundo. Montei um servidor com três rotas: <code>/health</code> (responde na hora), <code>/block</code> (calcula <code>fib(38)</code> na thread principal) e <code>/worker</code> (o mesmo cálculo num <code>worker_thread</code>). E medi o atraso do event loop com <code>monitorEventLoopDelay</code>.</>} en={<>If one thread runs all your JavaScript, a 1.5-second computation makes <em>every</em> other user wait 1.5 seconds. I built a server with three routes: <code>/health</code> (answers at once), <code>/block</code> (computes <code>fib(38)</code> on the main thread) and <code>/worker</code> (the same computation in a <code>worker_thread</code>). And I measured event loop delay with <code>monitorEventLoopDelay</code>.</>} /></p>
        <CodeBlock code={`import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { monitorEventLoopDelay } from "node:perf_hooks";
import { Worker } from "node:worker_threads";
import { extname } from "node:path";

// tsc reescreve imports, não URLs: usa a extensão deste arquivo (.ts ou .js)
const workerFile = new URL(\`./fib-worker\${extname(import.meta.filename)}\`, import.meta.url);

const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();

const fib = (n: number): number => (n < 2 ? n : fib(n - 1) + fib(n - 2));

function fibInWorker(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFile, { workerData: n });
    worker.once("message", resolve);
    worker.once("error", reject);
  });
}

async function handle(req: IncomingMessage, res: ServerResponse) {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (pathname === "/health") return res.end("ok\\n");
  if (pathname === "/block") return res.end(\`fib=\${fib(38)}\\n\`);
  if (pathname === "/worker") return res.end(\`fib=\${await fibInWorker(38)}\\n\`);
  res.statusCode = 404;
  res.end();
}

// Um erro num handler async vira 500 e log, em vez de derrubar o processo.
const server = createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    res.statusCode = 500;
    res.end();
  });
});

server.listen(Number(process.env.PORT ?? 3000));

process.on("SIGTERM", () => server.close(() => process.exit(0)));`} />
        <CodeBlock code={`// fib-worker.ts: roda em outra thread, com outro event loop e outro heap
import { parentPort, workerData } from "node:worker_threads";
const fib = (n: number): number => (n < 2 ? n : fib(n - 1) + fib(n - 2));
parentPort?.postMessage(fib(workerData as number));`} />
        <Table
          head={[<T pt="Medição" en="Measurement" />, <T pt="Cálculo na thread principal" en="Computation on the main thread" />, <T pt="Cálculo num worker" en="Computation in a worker" />]}
          rows={[
            [<T pt="Tempo de fib(38)" en="Time of fib(38)" />, "1,50 s", <T pt="igual (a CPU é a mesma)" en="same (same CPU)" />],
            [<T pt={<><code>/health</code> chamado durante o cálculo</>} en={<><code>/health</code> called during the computation</>} />, <strong>1,36 s</strong>, <strong>0,01 s</strong>],
            [<T pt="Atraso máximo do event loop" en="Max event loop delay" />, "1476 ms", "10,9 ms"],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="Na thread principal, o pedido de /health chega no meio do cálculo e só é atendido quando ele acaba. Com o worker, o cálculo roda ao lado e o loop continua livre." en="On the main thread, the /health request arrives mid-computation and is only served when it ends. With a worker, the computation runs alongside and the loop stays free." />}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Linha do tempo do bloqueio / Blocking timeline">
            <Label x={10} y={30} pt="Sem worker" en="No worker" anchor="start" />
            <rect x="120" y="14" width="450" height="26" rx="3" className="brandfill" />
            <text x="345" y="32" className="mono" textAnchor="middle">fib(38) · 1,5 s</text>
            <rect x="572" y="14" width="18" height="26" rx="3" className="ln fillsoft" />
            <Arrow from={[160, 70]} to={[160, 44]} />
            <Label x={160} y={86} pt="chega /health" en="/health arrives" className="mut" />
            <Arrow from={[581, 44]} to={[581, 70]} />
            <Label x={581} y={86} pt="responde (1,36 s)" en="answers (1.36 s)" className="mut" />
            <Label x={10} y={130} pt="Com worker" en="With worker" anchor="start" />
            <rect x="120" y="114" width="20" height="26" rx="3" className="ln fillsoft" />
            <rect x="162" y="114" width="16" height="26" rx="3" className="ln fillsoft" />
            <rect x="120" y="150" width="450" height="26" rx="3" className="ln dash" />
            <Label x={345} y={168} pt="worker: fib(38) em outra thread" en="worker: fib(38) on another thread" className="mut" />
            <Label x={210} y={132} pt="/health responde em 10 ms" en="/health answers in 10 ms" anchor="start" className="mut" />
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><strong>O que bloqueia na prática:</strong> <code>JSON.parse</code>/<code>stringify</code> de payloads enormes, regex com backtracking catastrófico (o ataque ReDoS), laços sobre milhões de itens, criptografia e compressão síncronas (<code>*Sync</code>), e qualquer <code>fs.*Sync</code> dentro de um handler.</>} en={<><strong>What blocks in practice:</strong> <code>JSON.parse</code>/<code>stringify</code> of huge payloads, regexes with catastrophic backtracking (the ReDoS attack), loops over millions of items, synchronous crypto and compression (<code>*Sync</code>), and any <code>fs.*Sync</code> inside a handler.</>} /></li>
          <li><T pt={<><strong>As saídas:</strong> mover para um <code>worker_thread</code> (use um pool, como o <a href="https://github.com/piscinajs/piscina" rel="noopener">Piscina</a>, em vez de criar um worker por pedido), quebrar o trabalho em pedaços que cedem a vez (<code>await setImmediate()</code> de <code>node:timers/promises</code>), ou tirar o trabalho do processo (fila + outro serviço).</>} en={<><strong>The ways out:</strong> move it to a <code>worker_thread</code> (use a pool, such as <a href="https://github.com/piscinajs/piscina" rel="noopener">Piscina</a>, instead of creating a worker per request), split the work into chunks that yield (<code>await setImmediate()</code> from <code>node:timers/promises</code>), or move the work out of the process (queue + another service).</>} /></li>
          <li><T pt={<><strong>Workers não são para I/O.</strong> Esperar banco ou rede já é concorrente no event loop. Worker serve para CPU. Para usar vários núcleos com HTTP, rode vários processos (réplicas no Kubernetes, tarefas no ECS, ou <code>node:cluster</code>).</>} en={<><strong>Workers are not for I/O.</strong> Waiting on a database or network is already concurrent on the event loop. Workers are for CPU. To use several cores for HTTP, run several processes (Kubernetes replicas, ECS tasks, or <code>node:cluster</code>).</>} /></li>
        </ul>
      </Section>

      <Section id="streams" title={<T pt="Streams e backpressure" en="Streams and backpressure" />}>
        <p><T pt={<>Stream é processar dados <em>em pedaços</em> enquanto eles chegam, em vez de carregar tudo na memória. É o que permite a um servidor com 512 MB de RAM servir um arquivo de 10 GB. <strong>Backpressure</strong> é o mecanismo que faz o produtor esperar quando o consumidor está lento: sem ele, os pedaços se acumulam na memória até o processo morrer.</>} en={<>A stream processes data <em>in chunks</em> as it arrives, instead of loading everything into memory. It is what lets a server with 512 MB of RAM serve a 10 GB file. <strong>Backpressure</strong> is the mechanism that makes the producer wait when the consumer is slow: without it, chunks pile up in memory until the process dies.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="pipeline() liga as pontas e propaga a backpressure: quando o destino enche o buffer, a origem para de ler. Também propaga erros e fecha tudo no fim." en="pipeline() connects the ends and propagates backpressure: when the destination fills its buffer, the source stops reading. It also propagates errors and closes everything at the end." />}>
          <svg viewBox="0 0 700 150" role="img" aria-label="Pipeline de streams / Stream pipeline">
            <rect x="10" y="40" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="100" y="63" className="mono" textAnchor="middle">createReadStream</text>
            <Label x={100} y={82} pt="origem (Readable)" en="source (Readable)" className="mut" />
            <rect x="260" y="40" width="180" height="56" rx="4" className="brandfill" />
            <text x="350" y="63" className="mono" textAnchor="middle">Transform</text>
            <Label x={350} y={82} pt="pedaço a pedaço" en="chunk by chunk" className="mut" />
            <rect x="510" y="40" width="180" height="56" rx="4" className="ln fillsoft" />
            <text x="600" y="63" className="mono" textAnchor="middle">createWriteStream</text>
            <Label x={600} y={82} pt="destino (Writable)" en="destination (Writable)" className="mut" />
            <Arrow from={[190, 60]} to={[260, 60]} />
            <Arrow from={[440, 60]} to={[510, 60]} />
            <Arrow from={[510, 84]} to={[440, 84]} dashed />
            <Arrow from={[260, 84]} to={[190, 84]} dashed />
            <Label x={350} y={128} pt="- - -  “espera”: o buffer de destino está cheio (backpressure)" en="- - -  “wait”: the destination buffer is full (backpressure)" className="mut" />
          </svg>
        </Diagram>
        <CodeBlock code={`import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const upperCase = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

await pipeline(createReadStream("big.txt"), upperCase, createWriteStream("out.txt"));`} />
        <Table
          head={[<T pt="Arquivo" en="File" />, <T pt="readFile + writeFile (tudo na memória)" en="readFile + writeFile (all in memory)" />, <T pt="pipeline (streams)" en="pipeline (streams)" />]}
          rows={[
            ["200 MB", <T pt="pico de 868 MB de RAM, 1,6 s" en="868 MB peak RAM, 1.6 s" />, <T pt="pico de 75 MB de RAM, 3,6 s" en="75 MB peak RAM, 3.6 s" />],
            ["674 MB", <T pt={<>falhou: <code>RangeError: Invalid string length</code></>} en={<>failed: <code>RangeError: Invalid string length</code></>} />, <T pt="pico de 78 MB, terminou" en="78 MB peak, finished" />],
          ]}
        />
        <p><T pt={<>Duas lições. A memória do stream ficou constante independentemente do tamanho; a do <code>readFile</code> cresceu mais de 4 vezes o arquivo (texto, cópia em maiúsculas, buffers). E acima de cerca de 512 milhões de caracteres o V8 nem consegue criar a string (<code>buffer.constants.MAX_STRING_LENGTH</code> é 536.870.888 no Node 24). O stream foi mais lento aqui porque converte pedaço a pedaço, um preço pequeno por memória previsível. Use sempre <code>pipeline</code> (e não <code>.pipe()</code>), porque ele trata erros e fecha as pontas. Requisições e respostas HTTP, <code>fetch().body</code>, gzip e cursores de banco são todos streams.</>} en={<>Two lessons. The stream's memory stayed constant regardless of size; <code>readFile</code>'s grew to more than 4 times the file (text, upper-cased copy, buffers). And above roughly 512 million characters V8 cannot even create the string (<code>buffer.constants.MAX_STRING_LENGTH</code> is 536,870,888 on Node 24). The stream was slower here because it converts chunk by chunk, a small price for predictable memory. Always use <code>pipeline</code> (not <code>.pipe()</code>), because it handles errors and closes both ends. HTTP requests and responses, <code>fetch().body</code>, gzip and database cursors are all streams.</>} /></p>
      </Section>

      <Section id="typescript" title={<T pt="TypeScript no back e no front" en="TypeScript on the back and the front" />}>
        <p><T pt={<>TypeScript é JavaScript com tipos que <strong>somem na execução</strong>. Serve para o editor e o compilador acharem erros antes de rodar. Há três formas de executá-lo, e confundir as três é a origem de metade das dúvidas. Aqui fica o que muda para quem vive nisso.</>} en={<>TypeScript is JavaScript with types that <strong>vanish at runtime</strong>. It lets the editor and the compiler find errors before running. There are three ways to execute it, and mixing them up causes half of the confusion. Here is what changes for someone who lives in it.</>} /></p>
        <Table
          head={[<T pt="Onde" en="Where" />, <T pt="Quem transforma TS em JS" en="Who turns TS into JS" />, <T pt="Quem confere os tipos" en="Who checks types" />]}
          rows={[
            [<T pt="Node em desenvolvimento" en="Node in development" />, <T pt={<>o próprio Node (apaga os tipos ao carregar <code>.ts</code>)</>} en={<>Node itself (strips types when loading <code>.ts</code>)</>} />, <><code>tsc --noEmit</code> <T pt="e o editor" en="and the editor" /></>],
            [<T pt="Node em produção" en="Node in production" />, <><code>tsc</code> → <code>dist/*.js</code></>, <code>tsc</code>],
            [<T pt="Navegador" en="Browser" />, <T pt="o bundler (Vite), que apaga os tipos sem checá-los" en="the bundler (Vite), which strips types without checking them" />, <><code>tsc --noEmit</code> <T pt="no CI" en="in CI" /></>],
          ]}
        />
        <CodeBlock code={`{
  "compilerOptions": {
    "target": "es2024",
    // segue as regras reais de ESM/CJS do Node
    "module": "nodenext",
    // sem isto, TypeScript é só autocomplete
    "strict": true,
    // arr[i] é T | undefined, como de fato é
    "noUncheckedIndexedAccess": true,
    // proíbe enum/namespace, que o Node não sabe apagar
    "erasableSyntaxOnly": true,
    // exige "import type" para tipos
    "verbatimModuleSyntax": true,
    // import "./x.ts" vira "./x.js" no dist
    "rewriteRelativeImportExtensions": true,
    "outDir": "dist"
  }
}`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Tipos não validam dados de fora.</strong> <code>req.body as User</code> é uma promessa sua ao compilador, não uma checagem. Tudo o que cruza uma fronteira (corpo HTTP, variável de ambiente, resposta de API, linha do banco, <code>localStorage</code>) deve ser validado em runtime com um schema (<a href="https://zod.dev" rel="noopener">zod</a>, valibot, ArkType) que também gera o tipo. Um schema, uma fonte de verdade.</>} en={<><strong>Types do not validate outside data.</strong> <code>req.body as User</code> is a promise you make to the compiler, not a check. Everything that crosses a boundary (HTTP body, environment variable, API response, database row, <code>localStorage</code>) should be validated at runtime with a schema (<a href="https://zod.dev" rel="noopener">zod</a>, valibot, ArkType) that also produces the type. One schema, one source of truth.</>} /></li>
          <li><T pt={<><strong>Front e back compartilham tipos, não código de servidor.</strong> Num monorepo (pnpm workspaces), um pacote <code>contracts</code> com os schemas é importado pelos dois lados. Assim, mudar um campo da API quebra o build do front, não o usuário. tRPC, OpenAPI com geração de tipos e GraphQL codegen são variações da mesma ideia.</>} en={<><strong>Front and back share types, not server code.</strong> In a monorepo (pnpm workspaces), a <code>contracts</code> package with the schemas is imported by both sides. Changing an API field then breaks the front-end build, not the user. tRPC, OpenAPI with type generation and GraphQL codegen are variations of the same idea.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><strong>A pegadinha que eu caí: URLs não são reescritas.</strong> Com <code>rewriteRelativeImportExtensions</code>, o <code>tsc</code> troca <code>import "./x.ts"</code> por <code>"./x.js"</code>. Mas o worker era carregado por <code>new URL("./fib-worker.ts", import.meta.url)</code>, que é só uma string. Em desenvolvimento funcionou; na imagem Docker, compilada, o worker falhou com <code>Cannot find module '/app/dist/fib-worker.ts'</code>, a promise rejeitou sem tratamento e o servidor caiu. A correção está no código acima: escolher a extensão a partir do próprio arquivo. Teste sempre o artefato compilado, não só o <code>.ts</code>.</>} en={<><strong>The trap I fell into: URLs are not rewritten.</strong> With <code>rewriteRelativeImportExtensions</code>, <code>tsc</code> changes <code>import "./x.ts"</code> to <code>"./x.js"</code>. But the worker was loaded through <code>new URL("./fib-worker.ts", import.meta.url)</code>, which is just a string. In development it worked; in the compiled Docker image the worker failed with <code>Cannot find module '/app/dist/fib-worker.ts'</code>, the promise rejected unhandled and the server went down. The fix is in the code above: pick the extension from the file itself. Always test the compiled artifact, not only the <code>.ts</code>.</>} /></Callout>
      </Section>

      <Section id="tooling" title={<T pt="Ferramentas do dia a dia" en="Everyday tools" />}>
        <Table
          head={[<T pt="Necessidade" en="Need" />, <T pt="Escolha comum" en="Common choice" />, <T pt="Por quê / atenção" en="Why / watch out" />]}
          rows={[
            [<T pt="Versão do Node" en="Node version" />, <>fnm, nvm, mise <T pt="+ arquivo" en="+ file" /> <code>.nvmrc</code></>, <T pt={<>todos usam a mesma; o campo <code>engines</code> documenta o mínimo</>} en={<>everyone uses the same one; the <code>engines</code> field documents the minimum</>} />],
            [<T pt="Pacotes" en="Packages" />, <>pnpm <T pt="ou" en="or" /> npm</>, <T pt={<>pnpm economiza disco e é estrito com dependências não declaradas; em CI use <code>pnpm install --frozen-lockfile</code> / <code>npm ci</code></>} en={<>pnpm saves disk and is strict about undeclared dependencies; in CI use <code>pnpm install --frozen-lockfile</code> / <code>npm ci</code></>} />],
            [<T pt="Versão do gerenciador" en="Manager version" />, <><code>packageManager</code> <T pt="no" en="in" /> package.json</>, <T pt={<>a imagem do Node 26 não traz mais o <code>corepack</code> (conferi: <code>which corepack</code> veio vazio); instale-o ou use a action do pnpm</>} en={<>the Node 26 image no longer ships <code>corepack</code> (I checked: <code>which corepack</code> was empty); install it or use the pnpm action</>} />],
            [<T pt="Rodar em dev" en="Run in dev" />, <><code>node --watch</code>, <code>node --env-file</code></>, <T pt="sem nodemon nem dotenv: já vem no Node" en="no nodemon or dotenv: built into Node" />],
            [<T pt="Lint e formatação" en="Lint and format" />, <>ESLint + typescript-eslint, Prettier; <T pt="ou" en="or" /> Biome</>, <T pt={<>a regra <code>no-floating-promises</code> pega promise esquecida, a causa do processo que cai</>} en={<>the <code>no-floating-promises</code> rule catches forgotten promises, the cause of crashed processes</>} />],
            [<T pt="HTTP no back" en="HTTP on the back" />, <>Fastify, Hono, Express, NestJS</>, <T pt="Fastify valida e serializa por schema; Hono roda também em edge; Nest dá estrutura para times grandes" en="Fastify validates and serialises by schema; Hono also runs on the edge; Nest gives structure to large teams" />],
            [<T pt="Banco" en="Database" />, <>Prisma, Drizzle, Kysely, <code>pg</code></>, <T pt={<>pool de conexões tem tamanho; veja <a href="/notas/postgres-for-devs/">Postgres para devs</a></>} en={<>connection pools have a size; see <a href="/notas/postgres-for-devs/">Postgres for devs</a></>} />],
            [<T pt="Bundler / front" en="Bundler / front end" />, <>Vite, Next.js, React Router</>, <T pt="Vite para SPA e sites estáticos; frameworks quando precisa de SSR" en="Vite for SPAs and static sites; frameworks when you need SSR" />],
          ]}
        />
        <p><T pt={<>Outros runtimes existem: <strong>Deno</strong> e <strong>Bun</strong> rodam TypeScript direto e trazem ferramentas embutidas, e o Cloudflare Workers roda JavaScript na borda. Vale conhecê-los, mas o mercado e as bibliotecas ainda giram em torno do Node, e o próprio Node absorveu boa parte do que os tornava atraentes (TypeScript nativo, <code>--watch</code>, <code>--env-file</code>, test runner, <code>fetch</code>).</>} en={<>Other runtimes exist: <strong>Deno</strong> and <strong>Bun</strong> run TypeScript directly and bundle tools, and Cloudflare Workers runs JavaScript at the edge. They are worth knowing, but the market and the libraries still revolve around Node, and Node itself absorbed much of what made them attractive (native TypeScript, <code>--watch</code>, <code>--env-file</code>, a test runner, <code>fetch</code>).</>} /></p>
      </Section>

      <Section id="env" title={<T pt="Configuração e variáveis de ambiente" en="Configuration and environment variables" />}>
        <p><T pt={<>A regra é a do <a href="https://12factor.net/config" rel="noopener">Twelve-Factor App</a>: o que muda entre ambientes (URL do banco, chaves, nível de log) vive no ambiente, não no código. O Node lê as variáveis em <code>process.env</code>, sempre como <strong>texto</strong>. O arquivo <code>.env</code> não é lido sozinho: você liga com <code>--env-file</code> (ou <code>process.loadEnvFile()</code> no código). Uma variável já definida no ambiente vence o <code>.env</code>, o que permite ao servidor sobrescrever sem tocar no arquivo.</>} en={<>The rule is the <a href="https://12factor.net/config" rel="noopener">Twelve-Factor App</a>'s: what changes between environments (database URL, keys, log level) lives in the environment, not in code. Node reads variables from <code>process.env</code>, always as <strong>text</strong>. The <code>.env</code> file is not read by itself: you turn it on with <code>--env-file</code> (or <code>process.loadEnvFile()</code> in code). A variable already set in the environment beats the <code>.env</code>, which lets the server override without touching the file.</>} /></p>
        <CodeBlock code={`// src/env.ts: valida uma vez, na partida.
// O resto do app importa \`env\`, nunca process.env.
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment:", z.prettifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;`} />
        <Table
          head={[<T pt="Como rodei" en="How I ran it" />, <T pt="Resultado" en="Result" />]}
          rows={[
            [<code>node src/print-env.ts</code>, <T pt={<>saiu com código 1: <code>✖ Invalid input: expected string, received undefined → at DATABASE_URL</code></>} en={<>exited with code 1: <code>✖ Invalid input: expected string, received undefined → at DATABASE_URL</code></>} />],
            [<code>node --env-file=.env src/print-env.ts</code>, <T pt={<><code>PORT: 8080</code> (do <code>.env</code>), já como <code>number</code></>} en={<><code>PORT: 8080</code> (from <code>.env</code>), already a <code>number</code></>} />],
            [<code>PORT=9090 node --env-file=.env …</code>, <T pt={<><code>PORT: 9090</code>: o ambiente venceu o <code>.env</code></>} en={<><code>PORT: 9090</code>: the environment beat the <code>.env</code></>} />],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong><code>NODE_ENV</code> não é “o ambiente”.</strong> Bibliotecas (React, Express) leem <code>NODE_ENV=production</code> para desligar checagens e ficar mais rápidas. Use-o só para isso, e defina em produção. Para “staging contra produção”, use outra variável (<code>APP_ENV</code>) ou, melhor, valores diferentes para as mesmas chaves.</>} en={<><strong><code>NODE_ENV</code> is not “the environment”.</strong> Libraries (React, Express) read <code>NODE_ENV=production</code> to turn off checks and run faster. Use it only for that, and set it in production. For “staging versus production”, use another variable (<code>APP_ENV</code>) or, better, different values for the same keys.</>} /></li>
          <li><T pt={<><strong>Segredos de produção não moram em arquivo no repositório.</strong> <code>.env</code> no <code>.gitignore</code> e no <code>.dockerignore</code>, um <code>.env.example</code> versionado, e em produção os valores vêm do orquestrador ou de um cofre (Secrets Manager, Parameter Store, secrets do Kubernetes, secrets do GitHub). Nunca registre <code>env</code> inteiro no log.</>} en={<><strong>Production secrets do not live in a file in the repository.</strong> <code>.env</code> in <code>.gitignore</code> and <code>.dockerignore</code>, a committed <code>.env.example</code>, and in production the values come from the orchestrator or a vault (Secrets Manager, Parameter Store, Kubernetes secrets, GitHub secrets). Never log the whole <code>env</code>.</>} /></li>
        </ul>
      </Section>

      <Section id="front" title={<T pt="O lado do front" en="The front-end side" />}>
        <p><T pt={<>No navegador a linguagem é a mesma, mas o runtime é outro. Também há uma thread principal com um event loop, só que ela divide o tempo com o <strong>desenho da tela</strong>: entre tarefas, o navegador calcula estilos, layout e pinta. Um JavaScript que ocupa a thread por 200 ms congela cliques e rolagem por 200 ms. O mesmo princípio do servidor (não bloqueie o loop) vira aqui uma métrica de experiência.</>} en={<>In the browser the language is the same but the runtime is different. There is also a main thread with an event loop, but it shares time with <strong>drawing the screen</strong>: between tasks, the browser computes styles, layout and paints. JavaScript that holds the thread for 200 ms freezes clicks and scrolling for 200 ms. The server's principle (do not block the loop) becomes a user-experience metric here.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O mesmo TypeScript segue dois caminhos. No servidor ele vira um processo que responde pedidos; no navegador vira um bundle que precisa ser pequeno, porque cada byte é baixado e executado no aparelho do usuário." en="The same TypeScript takes two paths. On the server it becomes a process that answers requests; in the browser it becomes a bundle that must be small, because every byte is downloaded and executed on the user's device." />}>
          <svg viewBox="0 0 700 220" role="img" aria-label="TypeScript no servidor e no navegador / TypeScript on server and browser">
            <rect x="10" y="84" width="150" height="52" rx="4" className="brandfill" />
            <text x="85" y="106" className="mono" textAnchor="middle">src/*.ts</text>
            <Label x={85} y={124} pt="+ contracts (zod)" en="+ contracts (zod)" className="mut" />
            <rect x="230" y="20" width="200" height="52" rx="4" className="ln fillsoft" />
            <text x="330" y="42" className="mono" textAnchor="middle">tsc → dist/</text>
            <Label x={330} y={60} pt="servidor" en="server" className="mut" />
            <rect x="230" y="148" width="200" height="52" rx="4" className="ln fillsoft" />
            <text x="330" y="170" className="mono" textAnchor="middle">vite build</text>
            <Label x={330} y={188} pt="bundle com hash, minificado" en="hashed, minified bundle" className="mut" />
            <rect x="500" y="20" width="190" height="52" rx="4" className="ln" />
            <text x="595" y="42" className="mono" textAnchor="middle">node dist/server.js</text>
            <Label x={595} y={60} pt="env lido em runtime" en="env read at runtime" className="mut" />
            <rect x="500" y="148" width="190" height="52" rx="4" className="ln" />
            <Label x={595} y={170} pt="navegador do usuário" en="user's browser" />
            <Label x={595} y={188} pt="env embutido no build" en="env baked in at build" className="mut" />
            <Arrow from={[160, 100]} to={[230, 50]} />
            <Arrow from={[160, 120]} to={[230, 172]} />
            <Arrow from={[430, 46]} to={[500, 46]} />
            <Arrow from={[430, 174]} to={[500, 174]} />
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><strong>Variável de ambiente no front é pública.</strong> No Vite, só as variáveis com prefixo <code>VITE_</code> chegam ao código, por <code>import.meta.env</code>, e são <em>substituídas no bundle no momento do build</em> (no Next.js, o prefixo é <code>NEXT_PUBLIC_</code>). Qualquer pessoa lê no DevTools. Chave de API secreta nunca vai para o front; o front chama o seu back, que tem a chave. E trocar a variável exige um novo build, não um restart.</>} en={<><strong>Front-end environment variables are public.</strong> In Vite, only variables prefixed with <code>VITE_</code> reach the code, through <code>import.meta.env</code>, and they are <em>replaced in the bundle at build time</em> (in Next.js the prefix is <code>NEXT_PUBLIC_</code>). Anyone can read them in DevTools. A secret API key never goes to the front end; the front end calls your back end, which holds the key. And changing the variable needs a new build, not a restart.</>} /></li>
          <li><T pt={<><strong>Renderização: onde o HTML nasce.</strong> SPA (o navegador monta tudo), SSR (o servidor Node gera o HTML a cada pedido), SSG (gera no build, como este site) e hidratação (o React “acorda” o HTML pronto, anexando eventos). Cada escolha muda custo de servidor, tempo até o conteúdo e SEO.</>} en={<><strong>Rendering: where the HTML is born.</strong> SPA (the browser builds everything), SSR (the Node server generates HTML per request), SSG (generated at build, like this site) and hydration (React “wakes up” the ready HTML, attaching events). Each choice changes server cost, time to content and SEO.</>} /></li>
          <li><T pt={<><strong>Meça o que o usuário sente: Core Web Vitals.</strong> LCP (maior conteúdo visível, bom até 2,5 s), INP (resposta a interações, bom até 200 ms) e CLS (pulos de layout, bom até 0,1), segundo o <a href="https://web.dev/articles/vitals" rel="noopener">web.dev</a>. Lighthouse dá a medida de laboratório; a biblioteca <code>web-vitals</code> mede usuários reais. INP ruim quase sempre é JavaScript longo na thread principal.</>} en={<><strong>Measure what the user feels: Core Web Vitals.</strong> LCP (largest visible content, good up to 2.5 s), INP (response to interactions, good up to 200 ms) and CLS (layout shifts, good up to 0.1), according to <a href="https://web.dev/articles/vitals" rel="noopener">web.dev</a>. Lighthouse gives the lab measurement; the <code>web-vitals</code> library measures real users. Poor INP is almost always long JavaScript on the main thread.</>} /></li>
          <li><T pt={<><strong>Estado e dados.</strong> Separe estado do servidor (cache de requisições: TanStack Query, SWR) de estado da interface. A nota <a href="/notas/react-state/">Estado no React</a> trata disso.</>} en={<><strong>State and data.</strong> Keep server state (request cache: TanStack Query, SWR) apart from UI state. The note <a href="/notas/react-state/">State in React</a> covers this.</>} /></li>
        </ul>
      </Section>

      <Section id="tests" title={<T pt="Testes" en="Tests" />}>
        <Diagram minWidth={560} caption={<T pt="A pirâmide: muitos testes rápidos embaixo, poucos lentos e caros em cima. Em APIs Node, a camada de integração (HTTP real + banco real em contêiner) costuma dar o melhor retorno." en="The pyramid: many fast tests at the bottom, few slow and expensive ones at the top. For Node APIs, the integration layer (real HTTP + real database in a container) usually gives the best return." />}>
          <svg viewBox="0 0 600 230" role="img" aria-label="Pirâmide de testes / Test pyramid">
            <path d="M300 14L390 84H210Z" className="ln fillsoft" />
            <Label x={300} y={66} pt="E2E" en="E2E" />
            <path d="M210 90H390L460 150H140Z" className="ln fillsoft" />
            <Label x={300} y={126} pt="Integração" en="Integration" />
            <path d="M140 156H460L540 216H60Z" className="brandfill" />
            <Label x={300} y={192} pt="Unidade" en="Unit" />
            <text x="470" y="52" className="mono mut" textAnchor="start">Playwright</text>
            <text x="466" y="114" className="mono mut" textAnchor="start">fetch +</text>
            <text x="466" y="132" className="mono mut" textAnchor="start">Testcontainers</text>
            <text x="10" y="190" className="mono mut" textAnchor="start">node:test</text>
            <text x="10" y="208" className="mono mut" textAnchor="start">Vitest</text>
          </svg>
        </Diagram>
        <p><T pt={<>O Node tem test runner próprio: <code>node:test</code> com <code>node:assert</code>, mocks de função e de tempo, cobertura e modo watch, sem instalar nada. Ele roda arquivos <code>.ts</code> direto. Este é o teste de um <code>debounce</code> usando os <strong>mock timers</strong> do Erick Wendel: o tempo avança na hora, sem esperar 300 ms de verdade.</>} en={<>Node has its own test runner: <code>node:test</code> with <code>node:assert</code>, function and time mocks, coverage and watch mode, with nothing to install. It runs <code>.ts</code> files directly. This is the test of a <code>debounce</code> using Erick Wendel's <strong>mock timers</strong>: time advances instantly, without really waiting 300 ms.</>} /></p>
        <CodeBlock code={`// src/debounce.ts
export function debounce<A extends unknown[]>(fn: (...args: A) => void, waitMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

// test/debounce.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { debounce } from "../src/debounce.ts";

test("only the last call within the window runs", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const save = t.mock.fn();
  const debouncedSave = debounce(save, 300);

  debouncedSave("a");
  debouncedSave("b");
  t.mock.timers.tick(299);
  assert.equal(save.mock.callCount(), 0);

  t.mock.timers.tick(1);
  assert.equal(save.mock.callCount(), 1);
  assert.deepEqual(save.mock.calls[0].arguments, ["b"]);
});`} />
        <CodeBlock code={`$ node --test
✔ only the last call within the window runs (6.06ms)
ℹ tests 1  ℹ pass 1  ℹ fail 0

$ node --test --experimental-test-coverage
ℹ file         | line % | branch % | funcs %
ℹ  debounce.ts | 100.00 |   100.00 |  100.00`} />
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Quando usar" en="When to use" />]}
          rows={[
            [<code>node:test</code>, <T pt="back end e bibliotecas; zero dependência, roda TS direto" en="back end and libraries; zero dependencies, runs TS directly" />],
            ["Vitest", <T pt="front com Vite (mesma configuração e transformações), ambiente jsdom/happy-dom, snapshot, modo navegador" en="front end with Vite (same config and transforms), jsdom/happy-dom environment, snapshots, browser mode" />],
            ["Testing Library", <T pt="testar componentes pelo que o usuário vê e faz, não pela implementação" en="test components by what the user sees and does, not by implementation" />],
            ["Playwright", <T pt="ponta a ponta em Chromium, Firefox e WebKit; poucos testes, fluxos críticos (login, compra)" en="end to end in Chromium, Firefox and WebKit; few tests, critical flows (login, checkout)" />],
            ["Testcontainers", <T pt="sobe Postgres, Redis etc. reais em Docker durante o teste de integração" en="starts real Postgres, Redis etc. in Docker during the integration test" />],
            ["MSW", <T pt="intercepta fetch no front e no Node para simular APIs externas" en="intercepts fetch on the front and in Node to fake external APIs" />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Teste de integração de API sem biblioteca.</strong> Suba o servidor com <code>listen(0)</code> (porta livre aleatória), leia a porta em <code>server.address()</code>, chame com <code>fetch</code> e feche no <code>after()</code>. O <code>fetch</code> nativo dispensa o supertest, e você testa o mesmo caminho que o cliente usa.</>} en={<><strong>API integration test without a library.</strong> Start the server with <code>listen(0)</code> (random free port), read the port from <code>server.address()</code>, call it with <code>fetch</code> and close it in <code>after()</code>. Native <code>fetch</code> removes the need for supertest, and you test the same path the client uses.</>} /></Callout>
      </Section>

      <Section id="prod" title={<T pt="Produção: Docker, processos e desligamento" en="Production: Docker, processes and shutdown" />}>
        <p><T pt={<>Em produção, o app Node quase sempre roda num contêiner. O Dockerfile tem dois estágios: um compila com todas as dependências; o outro leva só o <code>dist/</code> e as dependências de produção, e roda como usuário sem privilégio. A nota <a href="/notas/docker/">Docker</a> explica camadas e cache.</>} en={<>In production, a Node app almost always runs in a container. The Dockerfile has two stages: one compiles with all dependencies; the other takes only <code>dist/</code> and production dependencies, and runs as an unprivileged user. The <a href="/notas/docker/">Docker</a> note explains layers and caching.</>} /></p>
        <CodeBlock code={`FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`} />
        <h3><T pt="Sinais e desligamento gracioso" en="Signals and graceful shutdown" /></h3>
        <p><T pt={<>Quando o orquestrador vai trocar uma versão, ele manda <code>SIGTERM</code>, espera um prazo (10 s no <code>docker stop</code>, 30 s no Kubernetes) e depois mata com <code>SIGKILL</code>. O app deveria parar de aceitar conexões, terminar as em andamento, fechar o pool do banco e sair. Medi três casos:</>} en={<>When the orchestrator replaces a version, it sends <code>SIGTERM</code>, waits a grace period (10 s for <code>docker stop</code>, 30 s on Kubernetes) and then kills with <code>SIGKILL</code>. The app should stop accepting connections, finish those in flight, close the database pool and exit. I measured three cases:</>} /></p>
        <Table
          head={[<T pt="Caso" en="Case" />, <T pt="Tempo do docker stop" en="docker stop time" />, <T pt="Código de saída" en="Exit code" />]}
          rows={[
            [<T pt={<>Node como PID 1, <strong>sem</strong> handler de <code>SIGTERM</code></>} en={<>Node as PID 1, <strong>without</strong> a <code>SIGTERM</code> handler</>} />, <strong>10,29 s</strong>, <T pt="137 (morto por SIGKILL)" en="137 (killed by SIGKILL)" />],
            [<T pt={<>Mesmo app com <code>docker run --init</code></>} en={<>Same app with <code>docker run --init</code></>} />, "0,24 s", <T pt="143 (encerrado por SIGTERM)" en="143 (ended by SIGTERM)" />],
            [<T pt={<>Node como PID 1, <strong>com</strong> handler que fecha o servidor</>} en={<>Node as PID 1, <strong>with</strong> a handler that closes the server</>} />, "0,24 s", <T pt="0 (saída limpa)" en="0 (clean exit)" />],
          ]}
        />
        <p><T pt={<>Por quê: o processo com PID 1 no Linux não recebe o comportamento padrão de sinais. Sem handler, o Node ignora o <code>SIGTERM</code> e só morre no <code>SIGKILL</code>, 10 segundos depois e sem fechar nada. Isso torna cada deploy 10 s mais lento e corta requisições no meio. Escreva o handler e rode <code>node</code> direto no <code>CMD</code> (não <code>npm start</code>, que acrescenta um processo intermediário).</>} en={<>Why: the process with PID 1 on Linux does not get default signal behaviour. Without a handler, Node ignores <code>SIGTERM</code> and only dies on <code>SIGKILL</code>, 10 seconds later and without closing anything. That makes every deploy 10 s slower and cuts requests mid-way. Write the handler and run <code>node</code> directly in <code>CMD</code> (not <code>npm start</code>, which adds an intermediate process).</>} /></p>
        <CodeBlock code={`async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  server.close();                       // para de aceitar conexões novas
  server.closeIdleConnections();        // fecha keep-alives ociosos
  await db.end();                       // fecha o pool do banco
  process.exit(0);
}
process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Health checks separados.</strong> <em>Liveness</em> responde se o processo está vivo (não toca no banco); <em>readiness</em> responde se ele pode receber tráfego (pode checar dependências e passa a falhar durante o desligamento). Confundir os dois faz o orquestrador reiniciar tudo quando o banco oscila.</>} en={<><strong>Separate health checks.</strong> <em>Liveness</em> answers whether the process is alive (does not touch the database); <em>readiness</em> answers whether it can take traffic (may check dependencies and starts failing during shutdown). Mixing them makes the orchestrator restart everything when the database blips.</>} /></li>
          <li><T pt={<><strong>Memória.</strong> O heap do V8 tem limite próprio, separado do limite do contêiner. Defina <code>--max-old-space-size</code> (em MB) abaixo da memória do contêiner, deixando margem para buffers e o que fica fora do heap: assim o V8 coleta lixo com mais vontade antes de o kernel matar o processo por falta de memória.</>} en={<><strong>Memory.</strong> V8's heap has its own limit, separate from the container's. Set <code>--max-old-space-size</code> (in MB) below the container memory, leaving headroom for buffers and what lives off-heap: V8 then collects garbage harder before the kernel kills the process for running out of memory.</>} /></li>
          <li><T pt={<><strong>Um processo por contêiner.</strong> Para usar mais núcleos, escale réplicas. PM2 e <code>cluster</code> fazem sentido numa VM sem orquestrador, não dentro do Kubernetes.</>} en={<><strong>One process per container.</strong> To use more cores, scale replicas. PM2 and <code>cluster</code> make sense on a VM without an orchestrator, not inside Kubernetes.</>} /></li>
          <li><T pt={<><strong>Logs no stdout.</strong> O app escreve JSON no stdout; quem coleta, roteia e guarda é a plataforma. Nada de arquivos de log dentro do contêiner.</>} en={<><strong>Logs to stdout.</strong> The app writes JSON to stdout; the platform collects, routes and stores it. No log files inside the container.</>} /></li>
        </ul>
      </Section>

      <Section id="cicd" title={<T pt="CI/CD e a cadeia de dependências" en="CI/CD and the dependency chain" />}>
        <Diagram minWidth={660} caption={<T pt="Cada etapa barra um tipo de erro antes do seguinte. As rápidas vêm primeiro; o deploy só acontece na branch principal, com a imagem que passou em tudo." en="Each stage stops one kind of error before the next. The fast ones come first; deploy only happens on the main branch, with the image that passed everything." />}>
          <svg viewBox="0 0 700 150" role="img" aria-label="Pipeline de CI/CD / CI/CD pipeline">
            <rect x="10" y="30" width="96" height="52" rx="4" className="ln fillsoft" />
            <text x="58" y="52" className="mono" textAnchor="middle">install</text>
            <text x="58" y="70" className="mono mut" textAnchor="middle">--frozen</text>
            <rect x="124" y="30" width="96" height="52" rx="4" className="ln fillsoft" />
            <text x="172" y="52" className="mono" textAnchor="middle">lint</text>
            <text x="172" y="70" className="mono mut" textAnchor="middle">eslint</text>
            <rect x="238" y="30" width="96" height="52" rx="4" className="ln fillsoft" />
            <text x="286" y="52" className="mono" textAnchor="middle">typecheck</text>
            <text x="286" y="70" className="mono mut" textAnchor="middle">tsc</text>
            <rect x="352" y="30" width="96" height="52" rx="4" className="ln fillsoft" />
            <text x="400" y="52" className="mono" textAnchor="middle">test</text>
            <text x="400" y="70" className="mono mut" textAnchor="middle">node --test</text>
            <rect x="466" y="30" width="96" height="52" rx="4" className="brandfill" />
            <text x="514" y="52" className="mono" textAnchor="middle">build</text>
            <text x="514" y="70" className="mono mut" textAnchor="middle">image:sha</text>
            <rect x="580" y="30" width="110" height="52" rx="4" className="brandfill" />
            <text x="635" y="52" className="mono" textAnchor="middle">deploy</text>
            <Label x={635} y={70} pt="só na main" en="main only" className="mut" />
            <Arrow from={[106, 56]} to={[124, 56]} />
            <Arrow from={[220, 56]} to={[238, 56]} />
            <Arrow from={[334, 56]} to={[352, 56]} />
            <Arrow from={[448, 56]} to={[466, 56]} />
            <Arrow from={[562, 56]} to={[580, 56]} />
            <Label x={229} y={116} pt="em todo pull request: segundos a poucos minutos" en="on every pull request: seconds to a few minutes" className="mut" />
            <path d="M10 100H448" className="ln dash" />
            <path d="M466 100H690" className="ln" />
            <Label x={578} y={116} pt="no merge na main" en="on merge to main" className="mut" />
          </svg>
        </Diagram>
        <CodeBlock code={`# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6          # usa a versão de "packageManager"
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Uma imagem, vários ambientes.</strong> Construa a imagem uma vez, marque com o SHA do commit, e promova a mesma imagem de staging para produção mudando só as variáveis de ambiente. Reconstruir por ambiente é testar uma coisa e publicar outra.</>} en={<><strong>One image, several environments.</strong> Build the image once, tag it with the commit SHA, and promote the same image from staging to production changing only environment variables. Rebuilding per environment means testing one thing and shipping another.</>} /></li>
          <li><T pt={<><strong>Credenciais de nuvem sem chave guardada.</strong> Use OIDC do GitHub para assumir um papel na AWS durante o job; veja <a href="/notas/github-aws-oidc/">GitHub Actions com AWS via OIDC</a>.</>} en={<><strong>Cloud credentials without a stored key.</strong> Use GitHub OIDC to assume an AWS role during the job; see <a href="/notas/github-aws-oidc/">GitHub Actions to AWS via OIDC</a>.</>} /></li>
          <li><T pt={<><strong>A cadeia de dependências é superfície de ataque.</strong> Um projeto típico puxa centenas de pacotes. Versione o lockfile e instale sempre com ele (<code>npm ci</code>, <code>--frozen-lockfile</code>); desde o pnpm 10, scripts de instalação de dependências ficam bloqueados até você liberar pacote a pacote; Dependabot ou Renovate para atualizar em PRs pequenos; <code>npm audit</code>/<code>pnpm audit</code> no CI; e prefira poucas dependências bem mantidas. O <a href="https://nodejs.org/api/permissions.html" rel="noopener">modelo de permissões</a> (<code>--permission</code>) restringe o que o processo pode ler, escrever e executar.</>} en={<><strong>The dependency chain is attack surface.</strong> A typical project pulls hundreds of packages. Commit the lockfile and always install from it (<code>npm ci</code>, <code>--frozen-lockfile</code>); since pnpm 10, dependency install scripts are blocked until you allow them package by package; Dependabot or Renovate to update in small PRs; <code>npm audit</code>/<code>pnpm audit</code> in CI; and prefer few, well-maintained dependencies. The <a href="https://nodejs.org/api/permissions.html" rel="noopener">permission model</a> (<code>--permission</code>) restricts what the process can read, write and execute.</>} /></li>
        </ul>
      </Section>

      <Section id="observability" title={<T pt="Observabilidade em Node" en="Observability in Node" />}>
        <p><T pt={<>Os conceitos (métricas, logs, traces, percentis, Prometheus e Grafana) estão na nota <a href="/notas/observability/">Observabilidade</a>. O que é específico de Node:</>} en={<>The concepts (metrics, logs, traces, percentiles, Prometheus and Grafana) are in the <a href="/notas/observability/">Observability</a> note. What is specific to Node:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Logs estruturados com <a href="https://getpino.io" rel="noopener">pino</a>.</strong> Uma linha JSON por evento, com nível, mensagem e campos. Ele é rápido porque formata pouco no processo; para ler bonito em dev, use <code>pino-pretty</code> no pipe, não no código.</>} en={<><strong>Structured logs with <a href="https://getpino.io" rel="noopener">pino</a>.</strong> One JSON line per event, with level, message and fields. It is fast because it formats little in-process; for pretty output in dev, use <code>pino-pretty</code> on the pipe, not in code.</>} /></li>
          <li><T pt={<><strong>Contexto por requisição com <code>AsyncLocalStorage</code>.</strong> Como não há uma thread por requisição, não dá para guardar o “request ID atual” numa variável global. O <code>AsyncLocalStorage</code> (de <code>node:async_hooks</code>) carrega um valor através de todos os <code>await</code> daquela requisição, e o logger o inclui em cada linha. É também o que o OpenTelemetry usa por baixo para saber a qual trace cada chamada pertence.</>} en={<><strong>Per-request context with <code>AsyncLocalStorage</code>.</strong> Since there is no thread per request, you cannot keep the “current request ID” in a global variable. <code>AsyncLocalStorage</code> (from <code>node:async_hooks</code>) carries a value through every <code>await</code> of that request, and the logger adds it to each line. It is also what OpenTelemetry uses underneath to know which trace each call belongs to.</>} /></li>
          <li><T pt={<><strong>Traces sem mexer no código.</strong> <code>node --import @opentelemetry/auto-instrumentations-node/register dist/server.js</code> instrumenta HTTP, <code>pg</code>, Redis, Express, Fastify e outros, e exporta para um coletor OTLP definido por variáveis <code>OTEL_*</code>.</>} en={<><strong>Traces without touching code.</strong> <code>node --import @opentelemetry/auto-instrumentations-node/register dist/server.js</code> instruments HTTP, <code>pg</code>, Redis, Express, Fastify and others, and exports to an OTLP collector set by <code>OTEL_*</code> variables.</>} /></li>
          <li><T pt={<><strong>A métrica que só o Node tem: atraso do event loop.</strong> <code>monitorEventLoopDelay</code> (usado no experimento) ou <code>prom-client</code>, que já exporta <code>nodejs_eventloop_lag_seconds</code>, heap usado e pausas do GC. Atraso alto com CPU baixa costuma ser código síncrono; atraso alto com heap crescendo é vazamento e GC lutando.</>} en={<><strong>The metric only Node has: event loop delay.</strong> <code>monitorEventLoopDelay</code> (used in the experiment) or <code>prom-client</code>, which already exports <code>nodejs_eventloop_lag_seconds</code>, heap used and GC pauses. High delay with low CPU is usually synchronous code; high delay with a growing heap is a leak and the GC struggling.</>} /></li>
        </ul>
        <CodeBlock code={`import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import pino from "pino";

const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export const logger = pino({
  level: env.LOG_LEVEL,
  mixin: () => requestContext.getStore() ?? {},   // todo log ganha o requestId
  redact: ["req.headers.authorization", "*.password"],
});

createServer((req, res) => {
  const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
  requestContext.run({ requestId }, () => handle(req, res).catch(/* … */));
});`} />
      </Section>

      <Section id="performance" title={<T pt="Performance, profiling e teste de carga" en="Performance, profiling and load testing" />}>
        <p><T pt={<>Otimizar sem medir é chutar. O ciclo é: <strong>carga</strong> para reproduzir o problema, <strong>profile</strong> para achar onde o tempo vai, correção, e carga de novo para confirmar. Medi o servidor do experimento com o <a href="https://github.com/mcollina/autocannon" rel="noopener">autocannon</a> (50 conexões por 5 s):</>} en={<>Optimising without measuring is guessing. The cycle is: <strong>load</strong> to reproduce the problem, <strong>profile</strong> to find where the time goes, fix, and load again to confirm. I measured the experiment's server with <a href="https://github.com/mcollina/autocannon" rel="noopener">autocannon</a> (50 connections for 5 s):</>} /></p>
        <CodeBlock code={`$ npx autocannon -c 50 -d 5 http://localhost:3000/health`} />
        <Table
          head={[<T pt="Cenário" en="Scenario" />, <T pt="Requisições em 5 s" en="Requests in 5 s" />, <T pt="Latência média" en="Avg latency" />, "p99", <T pt="Máxima" en="Max" />]}
          rows={[
            [<T pt={<>Só <code>/health</code></>} en={<>Only <code>/health</code></>} />, "49 mil", "4,8 ms", "15 ms", "152 ms"],
            [<T pt={<><code>/health</code> + 3 chamadas a <code>/block</code> ao mesmo tempo</>} en={<><code>/health</code> + 3 <code>/block</code> calls at the same time</>} />, "16 mil", "15,4 ms", "37 ms", "1443 ms"],
          ]}
        />
        <p><T pt={<>Três chamadas que bloqueiam derrubaram a vazão de todo o servidor em dois terços e levaram a latência máxima a 1,4 s, enquanto o p99 continuou parecendo razoável (37 ms). Por isso se olha a <em>distribuição</em> (p50, p99, máxima) e não a média, e por isso o atraso do event loop é a primeira métrica a checar.</>} en={<>Three blocking calls cut the whole server's throughput by two thirds and took max latency to 1.4 s, while p99 still looked reasonable (37 ms). That is why you look at the <em>distribution</em> (p50, p99, max) and not the average, and why event loop delay is the first metric to check.</>} /></p>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Ferramenta" en="Tool" />]}
          rows={[
            [<T pt="Onde a CPU vai?" en="Where does CPU go?" />, <T pt={<><code>node --cpu-prof</code> gera um <code>.cpuprofile</code>; abra na aba Performance do Chrome DevTools e veja o flame graph. Ou <code>node --inspect</code> e conecte em <code>chrome://inspect</code>.</>} en={<><code>node --cpu-prof</code> writes a <code>.cpuprofile</code>; open it in Chrome DevTools' Performance tab and read the flame graph. Or <code>node --inspect</code> and connect at <code>chrome://inspect</code>.</>} />],
            [<T pt="A memória só cresce?" en="Does memory only grow?" />, <T pt={<>dois heap snapshots (DevTools, ou <code>v8.writeHeapSnapshot()</code>) separados por carga, e compare o que sobrou; <code>--heap-prof</code> para alocação</>} en={<>two heap snapshots (DevTools, or <code>v8.writeHeapSnapshot()</code>) separated by load, and compare what stayed; <code>--heap-prof</code> for allocation</>} />],
            [<T pt="Aguenta quanto?" en="How much can it take?" />, <T pt={<>autocannon (rápido, local) ou <a href="https://grafana.com/docs/k6/latest/" rel="noopener">k6</a> (cenários em JavaScript, rampas, limites que reprovam o CI)</>} en={<>autocannon (quick, local) or <a href="https://grafana.com/docs/k6/latest/" rel="noopener">k6</a> (scenarios in JavaScript, ramps, thresholds that fail CI)</>} />],
            [<T pt="Função A ou B?" en="Function A or B?" />, <T pt={<>micro-benchmark com <code>performance.now()</code> em muitas iterações, ou <code>mitata</code>/<code>tinybench</code>; desconfie de diferenças pequenas</>} en={<>micro-benchmark with <code>performance.now()</code> over many iterations, or <code>mitata</code>/<code>tinybench</code>; distrust small differences</>} />],
          ]}
        />
        <CodeBlock code={`// load.js: k6 com rampa e limites (falha se p95 > 200 ms ou erros > 1%)
import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },   // sobe até 50 usuários virtuais
    { duration: "1m", target: 50 },    // mantém
    { duration: "15s", target: 0 },    // desce
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const response = http.get("http://localhost:3000/health");
  check(response, { "status 200": (r) => r.status === 200 });
}`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Teste de carga, de estresse e de resistência são coisas diferentes.</strong> Carga confirma que o sistema aguenta o tráfego esperado; estresse sobe até quebrar, para saber <em>como</em> quebra (erro rápido é melhor que fila infinita); resistência (soak) mantém carga por horas para revelar vazamentos.</>} en={<><strong>Load, stress and soak tests are different things.</strong> Load confirms the system handles the expected traffic; stress pushes until it breaks, to learn <em>how</em> it breaks (failing fast beats an infinite queue); soak holds load for hours to reveal leaks.</>} /></li>
          <li><T pt={<><strong>Os ganhos grandes raramente estão no JavaScript.</strong> Em APIs, quase sempre o gargalo é a consulta sem índice, o N+1 do ORM, a falta de cache ou o pool de conexões pequeno. Profile antes de reescrever laços.</>} en={<><strong>The big wins are rarely in the JavaScript.</strong> In APIs, the bottleneck is almost always the unindexed query, the ORM's N+1, missing caching or a small connection pool. Profile before rewriting loops.</>} /></li>
        </ul>
      </Section>

      <Section id="path" title={<T pt="Trilha de estudo" en="Study path" />}>
        <p><T pt={<>Uma ordem que funciona, do fundamento à operação. Cada etapa tem um exercício que prova que você entendeu, no espírito do Erick Wendel: construir para entender.</>} en={<>An order that works, from foundation to operation. Each step has an exercise that proves you understood, in Erick Wendel's spirit: build to understand.</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><strong>Linguagem e assincronia.</strong> Promises, <code>async/await</code>, erros, closures, módulos. Exercício: implemente <code>Promise.all</code> e um <code>retry</code> com backoff à mão.</>} en={<><strong>Language and asynchrony.</strong> Promises, <code>async/await</code>, errors, closures, modules. Exercise: implement <code>Promise.all</code> and a <code>retry</code> with backoff by hand.</>} /></li>
          <li><T pt={<><strong>Runtime.</strong> Event loop, microtasks, thread pool, streams, workers. Exercício: reproduza a tabela de ordem e o experimento de bloqueio desta nota; depois leia o <a href="https://github.com/ErickWendel/myownnode" rel="noopener">runtime feito do zero</a> do Erick.</>} en={<><strong>Runtime.</strong> Event loop, microtasks, thread pool, streams, workers. Exercise: reproduce this note's ordering table and blocking experiment; then read Erick's <a href="https://github.com/ErickWendel/myownnode" rel="noopener">runtime built from scratch</a>.</>} /></li>
          <li><T pt={<><strong>HTTP sem framework.</strong> Um servidor só com <code>node:http</code>: rotas, corpo JSON validado, streams, erros, timeouts. Depois Fastify, e você vai saber o que ele faz por você.</>} en={<><strong>HTTP without a framework.</strong> A server with only <code>node:http</code>: routes, validated JSON body, streams, errors, timeouts. Then Fastify, and you will know what it does for you.</>} /></li>
          <li><T pt={<><strong>TypeScript a sério.</strong> <code>strict</code>, genéricos, tipos de união discriminada, schemas compartilhados entre front e back num monorepo.</>} en={<><strong>TypeScript for real.</strong> <code>strict</code>, generics, discriminated unions, schemas shared between front and back in a monorepo.</>} /></li>
          <li><T pt={<><strong>Testes.</strong> <code>node:test</code> com mocks de tempo, integração com banco real em contêiner, alguns E2E com Playwright.</>} en={<><strong>Tests.</strong> <code>node:test</code> with time mocks, integration with a real database in a container, a few Playwright E2E tests.</>} /></li>
          <li><T pt={<><strong>Front.</strong> Vite + React, um formulário que consome a sua API com os tipos compartilhados, Lighthouse e Web Vitals medidos.</>} en={<><strong>Front end.</strong> Vite + React, a form that consumes your API with the shared types, Lighthouse and Web Vitals measured.</>} /></li>
          <li><T pt={<><strong>Entrega e operação.</strong> Dockerfile multiestágio, desligamento gracioso, pipeline no GitHub Actions, logs com pino, traces com OpenTelemetry, um teste k6 com limites no CI.</>} en={<><strong>Delivery and operation.</strong> Multi-stage Dockerfile, graceful shutdown, a GitHub Actions pipeline, pino logs, OpenTelemetry traces, a k6 test with thresholds in CI.</>} /></li>
        </ol>
      </Section>

      <Section id="cheat-node" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Tarefa" en="Task" />, <T pt="Comando" en="Command" />]}
          rows={[
            [<T pt="Rodar TS em dev, recarregando" en="Run TS in dev, reloading" />, <code>node --watch --env-file-if-exists=.env src/server.ts</code>],
            [<T pt="Rodar um script do package.json" en="Run a package.json script" />, <code>node --run build</code>],
            [<T pt="Conferir tipos" en="Check types" />, <code>tsc --noEmit</code>],
            [<T pt="Testes e cobertura" en="Tests and coverage" />, <code>node --test --experimental-test-coverage</code>],
            [<T pt="Instalar no CI" en="Install in CI" />, <><code>npm ci</code> · <code>pnpm install --frozen-lockfile</code></>],
            [<T pt="Depurar" en="Debug" />, <><code>node --inspect src/server.ts</code> → <code>chrome://inspect</code></>],
            [<T pt="Profile de CPU" en="CPU profile" />, <code>node --cpu-prof dist/server.js</code>],
            [<T pt="Carga rápida" en="Quick load" />, <code>npx autocannon -c 50 -d 10 URL</code>],
            [<T pt="Mais threads para fs/crypto" en="More threads for fs/crypto" />, <code>UV_THREADPOOL_SIZE=8</code>],
            [<T pt="Desligamento limpo no Docker" en="Clean shutdown in Docker" />, <T pt={<>handler de <code>SIGTERM</code> + <code>CMD ["node", …]</code></>} en={<><code>SIGTERM</code> handler + <code>CMD ["node", …]</code></>} />],
          ]}
        />
        <h3><T pt="Laboratório: reproduza em 30 minutos" en="Lab: reproduce in 30 minutes" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Rode o arquivo de ordem como <code>.mjs</code> e como <code>.cjs</code>. Explique por que <code>nextTick</code> muda de lugar.</>} en={<>Run the ordering file as <code>.mjs</code> and as <code>.cjs</code>. Explain why <code>nextTick</code> moves.</>} /></li>
          <li><T pt={<>Suba o servidor do experimento, chame <code>/block</code> e, ao mesmo tempo, <code>/health</code>. Repita com <code>/worker</code>. Compare os tempos.</>} en={<>Start the experiment's server, call <code>/block</code> and, at the same time, <code>/health</code>. Repeat with <code>/worker</code>. Compare the times.</>} /></li>
          <li><T pt={<>Rode o autocannon contra <code>/health</code> sozinho e com <code>/block</code> em paralelo. Anote p50, p99 e máxima.</>} en={<>Run autocannon against <code>/health</code> alone and with <code>/block</code> in parallel. Write down p50, p99 and max.</>} /></li>
          <li><T pt={<>Gere um arquivo de 200 MB e compare <code>readFile</code> com <code>pipeline</code> usando <code>process.resourceUsage().maxRSS</code>.</>} en={<>Generate a 200 MB file and compare <code>readFile</code> with <code>pipeline</code> using <code>process.resourceUsage().maxRSS</code>.</>} /></li>
          <li><T pt={<>Construa a imagem, rode e meça <code>docker stop</code> com e sem o handler de <code>SIGTERM</code>.</>} en={<>Build the image, run it and time <code>docker stop</code> with and without the <code>SIGTERM</code> handler.</>} /></li>
        </ol>
        <Callout icon="check"><T pt={<><strong>O que foi e o que não foi executado.</strong> Executei: a ordem do event loop (ESM e CJS, Node 24 e 26), o servidor com <code>/block</code> e <code>/worker</code>, o autocannon 8, a comparação de memória com streams, os testes com <code>node:test</code> e mock timers (incluindo cobertura), a validação de ambiente com zod 4 e <code>--env-file</code>, a imagem Docker em <code>node:26-alpine</code> (267 MB) e os três tempos de <code>docker stop</code>, e o <code>--cpu-prof</code>. Não executei: o workflow do GitHub Actions, o script k6, o exemplo de pino com <code>AsyncLocalStorage</code> e a auto-instrumentação do OpenTelemetry; eles seguem a documentação oficial de cada ferramenta.</>} en={<><strong>What was and was not run.</strong> I ran: the event loop ordering (ESM and CJS, Node 24 and 26), the server with <code>/block</code> and <code>/worker</code>, autocannon 8, the streams memory comparison, the <code>node:test</code> tests with mock timers (including coverage), environment validation with zod 4 and <code>--env-file</code>, the Docker image on <code>node:26-alpine</code> (267 MB) and the three <code>docker stop</code> timings, and <code>--cpu-prof</code>. I did not run: the GitHub Actions workflow, the k6 script, the pino example with <code>AsyncLocalStorage</code> and OpenTelemetry auto-instrumentation; they follow each tool's official documentation.</>} /></Callout>
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="O que o V8 faz e o que o libuv faz? Quais operações vão para o pool de threads?" en="What does V8 do and what does libuv do? Which operations go to the thread pool?" /></li>
          <li><T pt={<>Por que <code>nextTick</code> imprime antes das promises no CommonJS e depois no ESM?</>} en={<>Why does <code>nextTick</code> print before promises in CommonJS and after them in ESM?</>} /></li>
          <li><T pt={<>Um cálculo de 1,5 s no handler: o que acontece com o <code>/health</code>? Quando usar worker, e quando réplicas?</>} en={<>A 1.5 s computation in the handler: what happens to <code>/health</code>? When to use a worker, and when replicas?</>} /></li>
          <li><T pt="O que é backpressure e o que acontece sem ela? Por que pipeline e não .pipe()?" en="What is backpressure and what happens without it? Why pipeline and not .pipe()?" /></li>
          <li><T pt={<>Por que <code>req.body as User</code> não é validação? Onde o schema deve morar num monorepo?</>} en={<>Why is <code>req.body as User</code> not validation? Where should the schema live in a monorepo?</>} /></li>
          <li><T pt={<>Qual a diferença entre uma variável do back e uma <code>VITE_</code> do front, em quando é lida e em quem a vê?</>} en={<>What is the difference between a back-end variable and a front-end <code>VITE_</code> one, in when it is read and who sees it?</>} /></li>
          <li><T pt={<>Por que o <code>docker stop</code> levou 10 s sem handler de <code>SIGTERM</code>? Quais as duas correções?</>} en={<>Why did <code>docker stop</code> take 10 s without a <code>SIGTERM</code> handler? What are the two fixes?</>} /></li>
          <li><T pt="Liveness e readiness: o que cada um checa e o que dá errado se você confundir?" en="Liveness and readiness: what does each check and what goes wrong if you mix them up?" /></li>
          <li><T pt={<>Para que serve o <code>AsyncLocalStorage</code>, e por que um “request ID global” não funciona em Node?</>} en={<>What is <code>AsyncLocalStorage</code> for, and why does a “global request ID” not work in Node?</>} /></li>
          <li><T pt="No teste de carga, o p99 ficou em 37 ms mas a máxima em 1,4 s. O que isso diz, e qual métrica do Node explicaria?" en="In the load test, p99 stayed at 37 ms but max hit 1.4 s. What does that tell you, and which Node metric would explain it?" /></li>
        </ul>
      </Section>

      <Sources>
        <ul>
          <li><a href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" rel="noopener">Node.js: the event loop, timers and process.nextTick()</a> · <a href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" rel="noopener">Don't block the event loop</a> · <a href="https://docs.libuv.org/en/v1.x/design.html" rel="noopener">libuv: design overview</a></li>
          <li><a href="https://nodejs.org/api/worker_threads.html" rel="noopener">Node.js: worker_threads</a> · <a href="https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions" rel="noopener">monitorEventLoopDelay</a> · <a href="https://nodejs.org/api/stream.html" rel="noopener">Stream</a> · <a href="https://nodejs.org/en/learn/modules/backpressuring-in-streams" rel="noopener">Backpressuring in streams</a></li>
          <li><a href="https://nodejs.org/api/typescript.html" rel="noopener">Node.js: TypeScript</a> · <a href="https://nodejs.org/api/cli.html#--env-fileconfig" rel="noopener">--env-file</a> · <a href="https://nodejs.org/api/test.html" rel="noopener">node:test</a> (<a href="https://nodejs.org/api/test.html#class-mocktimers" rel="noopener">MockTimers</a>) · <a href="https://nodejs.org/api/async_context.html" rel="noopener">AsyncLocalStorage</a> · <a href="https://nodejs.org/api/permissions.html" rel="noopener">Permissions</a> · <a href="https://nodejs.org/en/learn/getting-started/profiling" rel="noopener">Profiling</a></li>
          <li><a href="https://github.com/nodejs/Release" rel="noopener">Node.js release schedule</a> · <a href="https://www.typescriptlang.org/tsconfig/" rel="noopener">TSConfig reference</a> · <a href="https://zod.dev" rel="noopener">zod</a></li>
          <li><a href="https://vite.dev/guide/env-and-mode" rel="noopener">Vite: env variables and modes</a> · <a href="https://web.dev/articles/vitals" rel="noopener">web.dev: Web Vitals</a> · <a href="https://vitest.dev" rel="noopener">Vitest</a> · <a href="https://playwright.dev" rel="noopener">Playwright</a> · <a href="https://testcontainers.com" rel="noopener">Testcontainers</a></li>
          <li><a href="https://docs.docker.com/reference/cli/docker/container/run/#init" rel="noopener">Docker: --init</a> · <a href="https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/" rel="noopener">Kubernetes: container lifecycle</a> · <a href="https://12factor.net/config" rel="noopener">The Twelve-Factor App: config</a> · <a href="https://pnpm.io/settings#onlybuiltdependencies" rel="noopener">pnpm: build scripts of dependencies</a></li>
          <li><a href="https://getpino.io" rel="noopener">pino</a> · <a href="https://opentelemetry.io/docs/zero-code/js/" rel="noopener">OpenTelemetry: zero-code instrumentation for JavaScript</a> · <a href="https://github.com/siimon/prom-client" rel="noopener">prom-client</a> · <a href="https://github.com/mcollina/autocannon" rel="noopener">autocannon</a> · <a href="https://grafana.com/docs/k6/latest/" rel="noopener">k6</a></li>
          <li>Erick Wendel: <a href="https://github.com/nodejs/node/pull/47775" rel="noopener">MockTimers (PR #47775)</a> · <a href="https://github.com/ErickWendel/myownnode" rel="noopener">myownnode: a JavaScript runtime on V8 and libuv</a> · <a href="https://changelog.com/jsparty/268" rel="noopener">JS Party #268: Recreating Node.js from scratch</a> · <a href="https://ew.academy" rel="noopener">ew.academy</a></li>
        </ul>
      </Sources>
    </>
  );
}
