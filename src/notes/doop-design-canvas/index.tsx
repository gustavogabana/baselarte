import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "doop-design-canvas",
  title: { en: "Doop: an open-source design canvas where humans and AI agents design together, and how to run it", pt: "Doop: uma tela de design de código aberto onde pessoas e agentes de IA desenham juntos, e como rodá-la" },
  seo: {
    title: { en: "Doop: an open-source design canvas where humans and AI agents design together, and how to run it", pt: "Doop: uma tela de design de código aberto onde pessoas e agentes de IA desenham juntos, e como rodá-la" },
    description: { en: "What Doop is (an open-source, AGPL-3.0 alternative to Paper.design), how it is built, how to run it on your computer (Bun, Docker) or in a cloud (Railway, Fly, a VPS with Postgres), the environment variables that matter and how to connect Claude Code, Codex and other agents through its MCP server.", pt: "O que é o Doop (uma alternativa de código aberto, AGPL-3.0, ao Paper.design), como ele é construído, como rodá-lo no seu computador (Bun, Docker) ou numa nuvem (Railway, Fly, uma VPS com Postgres), as variáveis de ambiente que importam e como conectar Claude Code, Codex e outros agentes pelo servidor MCP." },
  },
  summary: "what Doop is (open-source, AGPL-3.0 design canvas where people and AI agents design together, an alternative to Paper.design), its architecture (Node server on port 4400 with REST, WebSocket and MCP; React client; PGlite or Postgres), how to run it locally with Bun, with Docker Compose and in a cloud (Railway, Fly or a VPS with managed Postgres, BETTER_AUTH_SECRET and BETTER_AUTH_URL, /healthz), the key environment variables, connecting Claude Code, Codex and other MCP clients (OAuth or agent keys) and care points (open signup, AGPL, backups). Based on the project README; not executed.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Doop: <em>a design canvas where you and your agents work side by side.</em></>, pt: <>Doop: <em>uma tela de design onde você e seus agentes trabalham lado a lado.</em></> },
  heroLede: { en: "An analysis of the open-source Doop: what it is, how it is built, how to run it on your computer or in a cloud of yours, which settings matter and how to plug Claude Code, Codex and other agents into it.", pt: "Uma análise do Doop, de código aberto: o que é, como é construído, como rodá-lo no seu computador ou numa nuvem sua, quais configurações importam e como ligar Claude Code, Codex e outros agentes a ele." },
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é o Doop" en="What Doop is" /> },
        { id: "arch", title: <T pt="Como ele é por dentro" en="How it works inside" /> },
        { id: "local", title: <T pt="Rodar no seu computador" en="Run it on your computer" /> },
        { id: "docker", title: <T pt="Rodar com Docker" en="Run it with Docker" /> },
        { id: "cloud", title: <T pt="Rodar numa nuvem" en="Run it in a cloud" /> },
        { id: "env", title: <T pt="Variáveis de ambiente que importam" en="Environment variables that matter" /> },
        { id: "agents", title: <T pt="Conectar agentes de IA" en="Connecting AI agents" /> },
        { id: "update", title: <T pt="Atualizar quando o projeto melhorar" en="Updating when the project improves" /> },
        { id: "care", title: <T pt="Cuidados antes de abrir para outras pessoas" en="Care before opening it to other people" /> },
        { id: "cheat-dp", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Callout icon="check"><T pt={<><strong>O que eu fiz e o que não fiz.</strong> Li o README e a documentação pública do repositório <a href="https://github.com/kgoedecke/doop" rel="noopener">kgoedecke/doop</a> em 2026-10-29. <strong>Não executei</strong> o Doop: os comandos abaixo vêm da documentação do projeto e não foram testados por mim. Confira no README do commit que você baixar, porque o projeto muda rápido.</>} en={<><strong>What I did and did not do.</strong> I read the README and the public documentation of the <a href="https://github.com/kgoedecke/doop" rel="noopener">kgoedecke/doop</a> repository on 2026-10-29. I <strong>did not run</strong> Doop: the commands below come from the project documentation and were not tested by me. Check the README of the commit you download, because the project moves fast.</>} /></Callout>
      <Section id="what" title={<T pt="O que é o Doop" en="What Doop is" />}>
        <p><T pt={<>O <a href="https://github.com/kgoedecke/doop" rel="noopener">Doop</a> é uma alternativa de código aberto ao Paper.design: uma tela de design multiusuário onde pessoas e agentes de IA desenham juntos, em tempo real. Cada design vive numa tela compartilhável (<code>/c/&lt;id&gt;</code>) feita de frames que renderizam HTML dentro de iframes isolados. Pessoas editam no navegador; agentes editam por um servidor MCP embutido. A licença é AGPL-3.0; o nome e o logo são marcas registradas e a licença não os cobre.</>} en={<><a href="https://github.com/kgoedecke/doop" rel="noopener">Doop</a> is an open-source alternative to Paper.design: a multiplayer design canvas where people and AI agents design together in real time. Each design lives on a shareable canvas (<code>/c/&lt;id&gt;</code>) made of frames that render HTML inside sandboxed iframes. People edit in the browser; agents edit through a built-in MCP server. The license is AGPL-3.0; the name and logo are trademarks and the license does not cover them.</>} /></p>
        <Table
          head={[<T pt="Função" en="Feature" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<T pt="Design por agentes (MCP)" en="Agent design (MCP)" />, <T pt="Claude Code, Codex, ChatGPT, Cursor, OpenCode e outros clientes MCP desenham na tela, tiram screenshots e revisam o próprio trabalho." en="Claude Code, Codex, ChatGPT, Cursor, OpenCode and other MCP clients draw on the canvas, take screenshots and review their own work." />],
            [<T pt="Agente embutido" en="Built-in agent" />, <T pt="O Doop Agent roda numa conta de modelo que você conecta (inclusive assinatura do ChatGPT) ou numa chave OpenAI, Claude, Gemini ou OpenRouter. Há uma camada gratuita opcional paga pelo servidor." en="The Doop Agent runs on a model account you connect (including a ChatGPT subscription) or on an OpenAI, Claude, Gemini or OpenRouter key. There is an optional free tier paid by the server." />],
            [<T pt="Editor" en="Editor" />, <T pt="Frames, retângulos, círculos, caminhos de caneta e texto, com layout flex, réguas, guias e zoom de 8% a 1600%." en="Frames, rectangles, circles, pen paths and text, with flex layout, rulers, guides and zoom from 8% to 1600%." />],
            [<T pt="Multiusuário" en="Multiplayer" />, <T pt="Cursores ao vivo, presença, modo seguir, comentários em fio e feed de atividade, numa sala WebSocket por tela." en="Live cursors, presence, follow mode, threaded comments and an activity feed, over one WebSocket room per canvas." />],
            [<T pt="Protótipo e aprovação" en="Prototype and approval" />, <T pt={<>Interações clicáveis entre frames (<code>/c/&lt;id&gt;/proto</code>) e frames marcados “pronto para dev”, que os agentes podem consultar.</>} en={<>Clickable interactions between frames (<code>/c/&lt;id&gt;/proto</code>) and frames marked “ready for dev”, which agents can query.</>} />],
            [<T pt="Memória de design" en="Design memory" />, <T pt="Guias de estilo, referências fixadas e decisões registradas que os agentes seguem." en="Style guides, pinned references and recorded decisions that agents follow." />],
            [<T pt="Importar e exportar" en="Import and export" />, <T pt="Captura de sites e apps, revisão de repositório do GitHub; exporta PNG, JPG e PDF. Figma, Canva e PSD só no Doop Cloud." en="Website and app capture, GitHub repo review; exports PNG, JPG and PDF. Figma, Canva and PSD are Doop Cloud only." />],
            [<T pt="Contas" en="Accounts" />, <T pt="E-mail e senha, OIDC SSO, Google, Microsoft e Apple, workspaces e plano Team opcional com Stripe." en="Email and password, OIDC SSO, Google, Microsoft and Apple, workspaces and an optional Stripe-backed Team plan." />],
          ]}
        />
      </Section>
      <Section id="arch" title={<T pt="Como ele é por dentro" en="How it works inside" />}>
        <p><T pt={<>O repositório separa o servidor, o cliente e o código compartilhado. Isso importa na hora de hospedar: <strong>em produção é um único processo Node na porta 4400</strong> que serve a API, o WebSocket, o MCP e o cliente já compilado.</>} en={<>The repository splits the server, the client and the shared code. That matters when hosting: <strong>in production it is a single Node process on port 4400</strong> that serves the API, the WebSocket, the MCP and the built client.</>} /></p>
        <Table
          head={[<T pt="Pasta" en="Folder" />, <T pt="Papel" en="Role" />]}
          rows={[
            [<code>server/</code>, <T pt={<>Node na porta 4400: API REST (Express), salas WebSocket, presença, servidor MCP (HTTP em streaming sem estado em <code>/mcp</code>), better-auth, Doop Agent e automações. O estado quente fica em memória e é gravado no banco.</>} en={<>Node on port 4400: REST API (Express), WebSocket rooms, presence, the MCP server (stateless streamable HTTP at <code>/mcp</code>), better-auth, the Doop Agent and automations. Hot state is in memory and written through to the database.</>} />],
            [<code>src/</code>, <T pt={<>Cliente React + Vite + zustand na porta 4300 (só no desenvolvimento; ele repassa <code>/api</code>, <code>/ws</code> e <code>/mcp</code> ao servidor).</>} en={<>React + Vite + zustand client on port 4300 (development only; it proxies <code>/api</code>, <code>/ws</code> and <code>/mcp</code> to the server).</>} />],
            [<code>shared/</code>, <T pt="Tipos e lógica usados pelos dois lados." en="Types and logic used by both sides." />],
            [<><code>desktop/</code>, <code>ios/</code>, <code>claude-extension/</code>, <code>cursor-plugin/</code>, <code>chatgpt-plugin/</code></>, <T pt="Pacotes de clientes: app desktop em Tauri (macOS e Windows), app iOS em SwiftUI (em desenvolvimento) e plugins." en="Client packages: a Tauri desktop app (macOS and Windows), a SwiftUI iOS app (in development) and plugins." />],
          ]}
        />
        <p><T pt={<>Stack: Bun (instalar e compilar), Node (rodar o servidor), TypeScript, Express, ws, Drizzle ORM, PGlite (Postgres embutido) ou Postgres, better-auth, React, Tailwind e Vitest. Cada frame é um iframe com <code>sandbox="allow-scripts"</code>, atualizado por “morph” do DOM em vez de recarregar. As imagens dos frames vêm do <code>puppeteer-core</code> dirigindo o Chrome ou Chromium do sistema.</>} en={<>Stack: Bun (install and build), Node (server runtime), TypeScript, Express, ws, Drizzle ORM, PGlite (embedded Postgres) or Postgres, better-auth, React, Tailwind and Vitest. Each frame is an iframe with <code>sandbox="allow-scripts"</code>, updated by DOM morphing instead of reloading. Frame screenshots come from <code>puppeteer-core</code> driving the system Chrome or Chromium.</>} /></p>
      </Section>
      <Section id="local" title={<T pt="Rodar no seu computador" en="Run it on your computer" />}>
        <p><T pt={<>Requisitos: <strong>Bun</strong> (instala e compila), <strong>Node</strong> no <code>PATH</code> (o <code>bun run dev</code> e o <code>bun run build</code> também empacotam a extensão do Claude Desktop com Node) e <strong>Chrome ou Chromium</strong> para os screenshots (detectado sozinho, ou defina <code>CHROME_PATH</code>).</>} en={<>Requirements: <strong>Bun</strong> (install and build), <strong>Node</strong> on your <code>PATH</code> (<code>bun run dev</code> and <code>bun run build</code> also package the Claude Desktop extension with Node) and <strong>Chrome or Chromium</strong> for screenshots (auto-detected, or set <code>CHROME_PATH</code>).</>} /></p>
        <CodeBlock code={`git clone https://github.com/kgoedecke/doop && cd doop
bun install
bun run dev`} />
        <p><T pt={<>Abra <code>http://localhost:4300</code> (o app). A API, o WebSocket e o MCP ficam em <code>http://localhost:4400</code>. Não precisa de configuração: os dados vão para um Postgres embutido (PGlite) em <code>data/pg</code>. Apague essa pasta para zerar tudo.</>} en={<>Open <code>http://localhost:4300</code> (the app). The API, WebSocket and MCP are on <code>http://localhost:4400</code>. No configuration is needed: data goes to an embedded Postgres (PGlite) in <code>data/pg</code>. Delete that folder to reset everything.</>} /></p>
        <p><T pt="Para testar o build de produção sem Docker, num único processo:" en="To try the production build without Docker, as a single process:" /></p>
        <CodeBlock code={`bun run build && bun run start
# tudo em http://localhost:4400
# com um Postgres de verdade: DATABASE_URL=postgres://usuario:senha@host:5432/doop bun run start`} />
      </Section>
      <Section id="docker" title={<T pt="Rodar com Docker" en="Run it with Docker" />}>
        <p><T pt={<>O Compose do projeto sobe o app e um Postgres, na porta 4400. O <code>BETTER_AUTH_SECRET</code> assina as sessões: gere um valor longo e aleatório e guarde-o, porque trocá-lo derruba os logins.</>} en={<>The project Compose file starts the app and a Postgres on port 4400. <code>BETTER_AUTH_SECRET</code> signs sessions: generate a long random value and keep it, because changing it logs everyone out.</>} /></p>
        <CodeBlock code={`BETTER_AUTH_SECRET=$(openssl rand -hex 32) docker compose up -d`} />
        <p><T pt="Para só conferir a imagem de produção na sua máquina:" en="To just check the production image on your machine:" /></p>
        <CodeBlock code={`docker build -t doop .
docker run -p 4400:4400 \\
  -e BETTER_AUTH_URL=http://localhost:4400 \\
  -e BETTER_AUTH_SECRET=dev-only doop`} />
        <Callout tone="warn" icon="alert"><T pt={<>O segredo <code>dev-only</code> serve apenas para esse teste local. Nunca o use numa máquina acessível de fora. Sem <code>DATABASE_URL</code> o contêiner usa PGlite: monte um volume em <code>/app/data</code> ou os dados somem quando o contêiner for recriado.</>} en={<>The <code>dev-only</code> secret is for that local test only. Never use it on a machine reachable from outside. Without <code>DATABASE_URL</code> the container uses PGlite: mount a volume at <code>/app/data</code> or the data disappears when the container is recreated.</>} /></Callout>
      </Section>
      <Section id="cloud" title={<T pt="Rodar numa nuvem" en="Run it in a cloud" />}>
        <p><T pt={<>O <code>Dockerfile</code> de produção já inclui o cliente compilado e o Chromium. A documentação indica o Railway e o Fly como o caminho de menor atrito, mas qualquer lugar que rode um contêiner serve (uma VPS com Docker Compose, ECS, Cloud Run).</>} en={<>The production <code>Dockerfile</code> already bundles the built client and Chromium. The documentation names Railway and Fly as the least-friction path, but anywhere that runs a container works (a VPS with Docker Compose, ECS, Cloud Run).</>} /></p>
        <ol>
          <li><T pt="Crie o app a partir do repositório. As duas plataformas detectam o Dockerfile sozinhas." en="Create the app from the repository. Both platforms detect the Dockerfile on their own." /></li>
          <li><T pt={<>Adicione um Postgres gerenciado e defina <code>DATABASE_URL</code>. O PGlite é de um processo só: só serve para uma instância com um volume persistente em <code>/app/data</code>.</>} en={<>Add a managed Postgres and set <code>DATABASE_URL</code>. PGlite is single-process: it only suits one instance with a persistent volume at <code>/app/data</code>.</>} /></li>
          <li><T pt={<>Defina <code>BETTER_AUTH_SECRET</code> (string longa e aleatória, obrigatória em produção) e <code>BETTER_AUTH_URL</code> (a origem pública, como <code>https://doop.exemplo.com</code>, também obrigatória). Use <code>TRUSTED_ORIGINS</code> para outras origens permitidas.</>} en={<>Set <code>BETTER_AUTH_SECRET</code> (a long random string, required in production) and <code>BETTER_AUTH_URL</code> (the public origin, such as <code>https://doop.example.com</code>, also required). Use <code>TRUSTED_ORIGINS</code> for any other allowed origins.</>} /></li>
          <li><T pt={<>Use <code>GET /healthz</code> como health check. O servidor confia em um salto de proxy, então terminar o TLS na borda da plataforma funciona.</>} en={<>Use <code>GET /healthz</code> as the health check. The server trusts one proxy hop, so terminating TLS at the platform edge works.</>} /></li>
          <li><T pt="Se quiser, defina um SMTP, o armazenamento S3 e os logins sociais (próxima seção)." en="Optionally set SMTP, S3 storage and social sign-in (next section)." /></li>
        </ol>
        <p><T pt="Exemplo numa VPS qualquer, com Postgres no mesmo Compose e HTTPS na frente (Caddy ou Cloudflare Tunnel, que não precisam de portas abertas além da 443):" en="Example on any VPS, with Postgres in the same Compose and HTTPS in front (Caddy or a Cloudflare Tunnel, which need no ports open besides 443):" /></p>
        <CodeBlock code={`# no servidor, dentro de uma cópia do repositório
cat > .env <<EOF
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=https://doop.exemplo.com
EOF
docker compose up -d
curl -fsS http://127.0.0.1:4400/healthz   # health check
# coloque o proxy HTTPS na frente da porta 4400`} />
        <Callout tone="warn" icon="alert"><T pt={<>Se o SMTP estiver bloqueado (comum em PaaS), o cadastro ou a recuperação de senha pode travar. A documentação cita o Resend com <code>SMTP_PORT=2587</code> como contorno. Sem SMTP configurado, os e-mails só aparecem no log do servidor.</>} en={<>If SMTP is blocked (common on PaaS hosts), signup or password reset can hang. The documentation mentions Resend with <code>SMTP_PORT=2587</code> as a workaround. With no SMTP configured, emails only show up in the server log.</>} /></Callout>
      </Section>
      <Section id="env" title={<T pt="Variáveis de ambiente que importam" en="Environment variables that matter" />}>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="Variáveis" en="Variables" />, <T pt="Sem elas" en="Without them" />]}
          rows={[
            [<T pt="Núcleo" en="Core" />, <><code>BETTER_AUTH_SECRET</code>, <code>BETTER_AUTH_URL</code>, <code>DATABASE_URL</code>, <code>TRUSTED_ORIGINS</code>, <code>PORT</code></>, <T pt={<>PGlite embutido em <code>data/pg</code>; origens localhost (as duas primeiras são obrigatórias em produção)</>} en={<>Embedded PGlite in <code>data/pg</code>; localhost origins (the first two are required in production)</>} />],
            [<T pt="E-mail" en="Email" />, <><code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code>, <code>SMTP_SECURE</code>, <code>EMAIL_FROM</code>, <code>REQUIRE_EMAIL_VERIFICATION</code></>, <T pt="E-mails vão para o log; sem verificação" en="Emails go to the log; no verification" />],
            [<T pt="Login" en="Sign-in" />, <><code>OIDC_*</code>, <code>GOOGLE_*</code>, <code>MICROSOFT_*</code>, <code>APPLE_*</code>, <code>SIGNUP_EMAIL_DOMAINS</code>, <code>ADMIN_EMAILS</code></>, <T pt="Só e-mail e senha; cadastro aberto" en="Email and password only; open signup" />],
            [<T pt="Doop Agent" en="Doop Agent" />, <><code>ANTHROPIC_API_KEY</code>, <code>RESIDENT_TASK_LIMIT</code>, <code>DOOP_AGENT_PROVIDER</code>, <code>DOOP_AGENT_MODEL</code>, <code>AZURE_OPENAI_*</code></>, <T pt={<>Só roda em contas que os usuários conectam (<code>RESIDENT_TASK_LIMIT</code> padrão <code>0</code>)</>} en={<>Only runs on accounts users connect (<code>RESIDENT_TASK_LIMIT</code> defaults to <code>0</code>)</>} />],
            [<T pt="Armazenamento" en="Storage" />, <><code>BUCKET</code>, <code>ACCESS_KEY_ID</code>, <code>SECRET_ACCESS_KEY</code>, <code>ENDPOINT</code>, <code>REGION</code></>, <T pt={<>Arquivos em <code>data/assets</code> (S3 compatível se definido)</>} en={<>Files in <code>data/assets</code> (S3-compatible if set)</>} />],
            [<T pt="Screenshots" en="Screenshots" />, <><code>CHROME_PATH</code>, <code>CHROME_NO_SANDBOX</code></>, <T pt="Chrome ou Chromium detectado sozinho" en="Chrome or Chromium auto-detected" />],
            [<T pt="Cobrança" en="Billing" />, <><code>STRIPE_SECRET_KEY</code>, <code>STRIPE_PRICE_TEAM_*</code>, <code>STRIPE_WEBHOOK_SECRET</code></>, <T pt="Cobrança desligada; todo workspace ativo" en="Billing off; every workspace active" />],
          ]}
        />
        <p><T pt={<>O arquivo <code>.env.example</code> do repositório lista o conjunto completo (endpoints, chaves de geração de imagem e busca, limites de taxa).</>} en={<>The repository <code>.env.example</code> lists the full set (endpoint overrides, image generation and search keys, rate limits).</>} /></p>
      </Section>
      <Section id="agents" title={<T pt="Conectar agentes de IA" en="Connecting AI agents" />}>
        <p><T pt={<>O endpoint MCP é <code>/mcp</code>. Em desenvolvimento, <code>http://localhost:4300/mcp</code>; em produção, a sua origem pública mais <code>/mcp</code>.</>} en={<>The MCP endpoint is <code>/mcp</code>. In development, <code>http://localhost:4300/mcp</code>; in production, your public origin plus <code>/mcp</code>.</>} /></p>
        <CodeBlock code={`# Claude Code (login pelo navegador, OAuth)
claude mcp add --transport http doop http://localhost:4300/mcp

# Codex
codex mcp add doop --url http://localhost:4300/mcp
codex mcp login doop`} />
        <p><T pt="Configuração genérica para qualquer cliente MCP:" en="Generic configuration for any MCP client:" /></p>
        <CodeBlock code={`{ "mcpServers": { "doop": { "type": "http", "url": "http://localhost:4300/mcp" } } }`} />
        <p><T pt={<>Para agentes sem navegador (CI, servidores), crie uma <strong>chave de agente</strong> em Configurações → Agent keys e envie-a como cabeçalho <code>Authorization: Bearer</code>. Ela dispensa o login e, ao ser revogada, corta o acesso na hora. Use uma chave por agente. O Doop Agent embutido fica desligado até um usuário conectar uma conta de modelo ou o operador definir <code>ANTHROPIC_API_KEY</code> e um <code>RESIDENT_TASK_LIMIT</code> maior que 0; agentes ligados por MCP usam as próprias assinaturas.</>} en={<>For agents without a browser (CI, servers), create an <strong>agent key</strong> under Settings → Agent keys and send it as an <code>Authorization: Bearer</code> header. It skips the sign-in and, once revoked, cuts access immediately. Use one key per agent. The built-in Doop Agent stays off until a user connects a model account or the operator sets <code>ANTHROPIC_API_KEY</code> and a <code>RESIDENT_TASK_LIMIT</code> above 0; agents connected over MCP use their own subscriptions.</>} /></p>
      </Section>
      <Section id="update" title={<T pt="Atualizar quando o projeto melhorar" en="Updating when the project improves" />}>
        <p><T pt={<>O Doop ainda é jovem (versão 0.x, lançamentos frequentes), então atualizar faz parte da rotina. O que eu vi no repositório em 2026-10-29: o ramo padrão é <code>main</code>; os lançamentos são tags <code>vX.Y.Z</code> geradas pelo release-please (a última do servidor era <code>v0.10.0</code>); o <code>CHANGELOG.md</code> lista cada versão; tags <code>desktop-v…</code> são só do app desktop; as mudanças entram por squash no <code>main</code>, e há dezenas de ramos <code>feat/*</code> e <code>fix/*</code> de trabalho em andamento.</>} en={<>Doop is still young (0.x versions, frequent releases), so updating is part of the routine. What I saw in the repository on 2026-10-29: the default branch is <code>main</code>; releases are <code>vX.Y.Z</code> tags produced by release-please (the latest server one was <code>v0.10.0</code>); <code>CHANGELOG.md</code> lists every version; <code>desktop-v…</code> tags are the desktop app only; changes land as squashes on <code>main</code>, and there are dozens of work-in-progress <code>feat/*</code> and <code>fix/*</code> branches.</>} /></p>
        <Table
          head={[<T pt="Uso" en="Use" />, <T pt="O que seguir" en="What to follow" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt={<><strong>Produção ou uso diário (recomendado)</strong></>} en={<><strong>Production or daily use (recommended)</strong></>} />, <T pt={<>Uma <strong>tag de versão</strong> (<code>v0.10.0</code>, a mais recente que não comece com <code>desktop-</code>)</>} en={<>A <strong>version tag</strong> (<code>v0.10.0</code>, the newest one that does not start with <code>desktop-</code>)</>} />, <T pt="É um ponto fixo e reproduzível, com notas no changelog, e dá para voltar para a anterior." en="It is a fixed, reproducible point with changelog notes, and you can go back to the previous one." />],
            [<T pt="Testar novidades, contribuir" en="Trying new things, contributing" />, <code>main</code>, <T pt="Tem tudo o que já foi aceito, mas entre dois lançamentos pode estar quebrado ou mudar o banco." en="It has everything accepted so far, but between two releases it can be broken or change the database." />],
            [<T pt="Evitar" en="Avoid" />, <T pt={<>Ramos <code>feat/*</code>, <code>fix/*</code>, <code>ci/*</code></>} en={<><code>feat/*</code>, <code>fix/*</code>, <code>ci/*</code> branches</>} />, <T pt="Trabalho em andamento, que pode ser reescrito ou apagado." en="Work in progress that can be rewritten or deleted." />],
          ]}
        />
        <p><T pt={<>Se você só clonou, o jeito simples é fixar numa tag. Se pretende ter alterações suas, faça um <em>fork</em> e mantenha um ramo seu em cima da tag.</>} en={<>If you only cloned, the simple way is to pin to a tag. If you plan to keep changes of your own, make a <em>fork</em> and keep a branch of yours on top of the tag.</>} /></p>
        <h3><T pt="Passo a passo (Docker Compose ou Bun)" en="Step by step (Docker Compose or Bun)" /></h3>
        <CodeBlock code={`cd doop
git fetch --tags origin
git tag -l 'v*' --sort=-v:refname | head -5     # as versões mais recentes / the newest versions
git log --oneline HEAD..origin/main | head -20  # o que mudou desde a sua versão / what changed

# 1) leia o CHANGELOG e o .env.example novo (v0.11.0 é só um exemplo: use a tag que aparecer acima) / read them (v0.11.0 is just an example: use the tag listed above)
git diff HEAD v0.11.0 -- CHANGELOG.md .env.example docker-compose.yml

# 2) faça backup ANTES (banco e arquivos)
docker compose exec db pg_dump -U doop doop > backup-$(date +%F).sql

# 3) troque para a tag nova (exemplo: v0.11.0)
git checkout v0.11.0

# 4a) Docker Compose: recompile a imagem e recrie
docker compose build --pull && docker compose up -d
# 4b) Bun, sem Docker
bun install && bun run build && bun run start

# 5) confira
curl -fsS http://127.0.0.1:4400/healthz`} />
        <p><T pt={<>Para acompanhar o <code>main</code> em vez de uma tag, troque o passo 3 por <code>git checkout main &amp;&amp; git pull --ff-only</code>. Se você tem commits seus numa cópia (fork), use <code>git remote add upstream https://github.com/kgoedecke/doop</code>, depois <code>git fetch upstream --tags</code> e <code>git rebase v0.11.0</code> (ou <code>git merge v0.11.0</code>) no seu ramo.</>} en={<>To follow <code>main</code> instead of a tag, replace step 3 with <code>git checkout main &amp;&amp; git pull --ff-only</code>. If you have commits of your own in a copy (fork), use <code>git remote add upstream https://github.com/kgoedecke/doop</code>, then <code>git fetch upstream --tags</code> and <code>git rebase v0.11.0</code> (or <code>git merge v0.11.0</code>) on your branch.</>} /></p>
        <ul>
          <li><T pt={<><strong>Seus dados ficam fora do código.</strong> No Compose, o banco está no volume <code>doop-pg</code> e sobrevive ao <code>docker compose up -d</code>; <strong>não use <code>down -v</code></strong>, que apaga o volume. Com PGlite, o dado está em <code>data/pg</code> (ou no volume em <code>/app/data</code>) e o <code>git checkout</code> não mexe nele.</>} en={<><strong>Your data lives outside the code.</strong> In Compose the database is in the <code>doop-pg</code> volume and survives <code>docker compose up -d</code>; <strong>do not use <code>down -v</code></strong>, which deletes the volume. With PGlite the data is in <code>data/pg</code> (or the volume at <code>/app/data</code>) and <code>git checkout</code> does not touch it.</>} /></li>
          <li><T pt={<><strong>Mudanças de esquema.</strong> O projeto usa migrações do Drizzle (pasta <code>server/db</code>). Eu não confirmei se elas rodam sozinhas ao iniciar; por isso o backup do passo 2 e a leitura do changelog antes de subir uma versão nova em produção.</>} en={<><strong>Schema changes.</strong> The project uses Drizzle migrations (the <code>server/db</code> folder). I did not confirm whether they run on their own at startup; hence the backup in step 2 and reading the changelog before putting a new version in production.</>} /></li>
          <li><T pt={<><strong>Troque uma versão por vez</strong> quando houver muitas entre a sua e a nova, e teste primeiro numa cópia (outra porta, outro banco).</>} en={<><strong>Move one version at a time</strong> when there are many between yours and the new one, and test first on a copy (another port, another database).</>} /></li>
          <li><T pt={<><strong>Voltar atrás:</strong> <code>git checkout &lt;tag-anterior&gt;</code>, recompile e, se o esquema mudou, restaure o backup (<code>docker compose exec -T db psql -U doop doop &lt; backup.sql</code> num banco vazio).</>} en={<><strong>Rolling back:</strong> <code>git checkout &lt;previous-tag&gt;</code>, rebuild and, if the schema changed, restore the backup (<code>docker compose exec -T db psql -U doop doop &lt; backup.sql</code> into an empty database).</>} /></li>
          <li><T pt={<><strong>Avisos de nova versão:</strong> no GitHub, “Watch” → “Custom” → “Releases” no repositório, ou assine o feed <code>https://github.com/kgoedecke/doop/releases.atom</code>.</>} en={<><strong>New-version alerts:</strong> on GitHub, “Watch” → “Custom” → “Releases” on the repository, or subscribe to the feed <code>https://github.com/kgoedecke/doop/releases.atom</code>.</>} /></li>
        </ul>
      </Section>
      <Section id="care" title={<T pt="Cuidados antes de abrir para outras pessoas" en="Care before opening it to other people" />}>
        <ul>
          <li><T pt={<><strong>Cadastro aberto por padrão.</strong> Sem <code>SIGNUP_EMAIL_DOMAINS</code>, qualquer pessoa que alcance o endereço cria uma conta. Restrinja por domínio, ou deixe o serviço atrás de VPN, Tailscale ou Cloudflare Access.</>} en={<><strong>Open signup by default.</strong> Without <code>SIGNUP_EMAIL_DOMAINS</code>, anyone who can reach the address creates an account. Restrict by domain, or keep the service behind a VPN, Tailscale or Cloudflare Access.</>} /></li>
          <li><T pt={<><strong>Um agente com acesso à tela escreve HTML que roda.</strong> Os frames ficam em iframes com <code>sandbox="allow-scripts"</code>, mas trate o conteúdo gerado por agentes como não confiável e não cole nele segredos.</>} en={<><strong>An agent with canvas access writes HTML that runs.</strong> Frames sit in iframes with <code>sandbox="allow-scripts"</code>, but treat agent-generated content as untrusted and do not paste secrets into it.</>} /></li>
          <li><T pt={<><strong>O servidor dirige um Chrome.</strong> <code>CHROME_NO_SANDBOX</code> existe para contêineres sem as permissões do sandbox; só o ligue se precisar e dentro de um contêiner sem privilégios.</>} en={<><strong>The server drives a Chrome.</strong> <code>CHROME_NO_SANDBOX</code> exists for containers without sandbox permissions; only turn it on if you must, and inside an unprivileged container.</>} /></li>
          <li><T pt={<><strong>Backup.</strong> Faça backup do Postgres (<code>pg_dump</code>) e do armazenamento de arquivos (<code>data/assets</code> ou o bucket S3).</>} en={<><strong>Backup.</strong> Back up Postgres (<code>pg_dump</code>) and file storage (<code>data/assets</code> or the S3 bucket).</>} /></li>
          <li><T pt={<><strong>AGPL-3.0.</strong> Se você modificar o Doop e oferecê-lo a outras pessoas pela rede, precisa disponibilizar o código modificado a elas. As marcas “doop” e o logo não vêm com a licença.</>} en={<><strong>AGPL-3.0.</strong> If you modify Doop and offer it to other people over a network, you must make the modified source available to them. The “doop” name and logo do not come with the license.</>} /></li>
        </ul>
      </Section>
      <Section id="cheat-dp" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Assunto" en="Topic" />, <T pt="Regra" en="Rule" />]}
          rows={[
            ["Doop", <T pt="Tela de design multiusuário com agentes via MCP; AGPL-3.0; um processo Node na 4400 em produção." en="Multiplayer design canvas with agents over MCP; AGPL-3.0; one Node process on 4400 in production." />],
            [<T pt="Local" en="Local" />, <T pt={<><code>bun install</code> e <code>bun run dev</code>; app em 4300, API e MCP em 4400; dados em <code>data/pg</code>.</>} en={<><code>bun install</code> and <code>bun run dev</code>; app on 4300, API and MCP on 4400; data in <code>data/pg</code>.</>} />],
            ["Docker", <T pt={<><code>docker compose up -d</code> com <code>BETTER_AUTH_SECRET</code>; volume em <code>/app/data</code> se usar PGlite.</>} en={<><code>docker compose up -d</code> with <code>BETTER_AUTH_SECRET</code>; a volume at <code>/app/data</code> if using PGlite.</>} />],
            [<T pt="Nuvem" en="Cloud" />, <T pt={<>Dockerfile + Postgres gerenciado + <code>BETTER_AUTH_SECRET</code> e <code>BETTER_AUTH_URL</code> + <code>/healthz</code>.</>} en={<>Dockerfile + managed Postgres + <code>BETTER_AUTH_SECRET</code> and <code>BETTER_AUTH_URL</code> + <code>/healthz</code>.</>} />],
            [<T pt="Agentes" en="Agents" />, <T pt={<><code>/mcp</code>; OAuth no navegador, ou chave de agente em <code>Authorization: Bearer</code>.</>} en={<><code>/mcp</code>; browser OAuth, or an agent key in <code>Authorization: Bearer</code>.</>} />],
            [<T pt="Atualizar" en="Updating" />, <T pt={<>Siga uma tag <code>vX.Y.Z</code> (não <code>desktop-v…</code>), não ramos de trabalho; <code>main</code> só para testar. Backup, changelog, <code>git checkout &lt;tag&gt;</code>, recompilar; nunca <code>down -v</code>.</>} en={<>Follow a <code>vX.Y.Z</code> tag (not <code>desktop-v…</code>), not work branches; <code>main</code> only for testing. Backup, changelog, <code>git checkout &lt;tag&gt;</code>, rebuild; never <code>down -v</code>.</>} />],
            [<T pt="Cuidados" en="Care" />, <T pt="Cadastro aberto por padrão; restrinja domínios; backup do banco e dos arquivos." en="Open signup by default; restrict domains; back up the database and files." />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Por que o Doop usa duas portas no desenvolvimento e uma só em produção?" en="Why does Doop use two ports in development and only one in production?" /></li>
          <li><T pt="Quando o PGlite basta e quando você precisa de um Postgres gerenciado?" en="When is PGlite enough and when do you need a managed Postgres?" /></li>
          <li><T pt="Quais duas variáveis são obrigatórias em produção, e por quê?" en="Which two variables are required in production, and why?" /></li>
          <li><T pt="Qual a diferença entre o login por OAuth e uma chave de agente?" en="What is the difference between OAuth sign-in and an agent key?" /></li>
          <li><T pt="Qual ramo ou tag você seguiria em produção, e o que fazer antes de atualizar?" en="Which branch or tag would you follow in production, and what do you do before updating?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://github.com/kgoedecke/doop" rel="noopener">kgoedecke/doop</a>: <code>README.md</code>, <code>Dockerfile</code>, <code>.env.example</code> (lido em 2026-10-29)</li>
          <li><a href="https://modelcontextprotocol.io/" rel="noopener">Model Context Protocol</a> · <a href="https://www.better-auth.com/" rel="noopener">better-auth</a> · <a href="https://pglite.dev/" rel="noopener">PGlite</a> · <a href="https://bun.sh/docs" rel="noopener">Bun</a></li>
          <li><a href="https://docs.railway.com/" rel="noopener">Railway</a> · <a href="https://fly.io/docs/" rel="noopener">Fly.io</a> · <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">GNU AGPL-3.0</a></li>
        </ul>
      </Sources>
    </>
  );
}
