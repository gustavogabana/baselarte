import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "private-ai-workspace",
  title: { en: "Private AI: self-hosting Odysseus", pt: "IA privada: hospedar o Odysseus" },
  seo: {
    title: { en: "A private AI workspace: self-hosting Odysseus, keeping data in and giving agents access", pt: "Uma IA privada: hospedar o Odysseus, manter os dados em casa e dar acesso aos agentes" },
    description: { en: "How to run your own AI workspace on your computer or in a cloud of yours without sending data to third parties, using the open-source Odysseus as a worked example: a map of what leaves, network isolation, how to talk to it, scoped tokens for agents and a lab.", pt: "Como ter o seu próprio workspace de IA no computador ou numa nuvem sua sem enviar dados a terceiros, usando o Odysseus (código aberto) como exemplo: um mapa do que sai, isolamento de rede, como se comunicar com ele, tokens com escopo para agentes e um laboratório." },
  },
  summary: "how to run your own AI workspace on your computer or in a cloud of yours without sending data to third parties, using the open-source Odysseus (AGPL-3.0, FastAPI, Chroma, SearXNG, ntfy) as a worked example: the four paths data leaves by (inference, tools, telemetry, operations), a per-feature egress map from the code (model providers, web search, weather, emoji CDN, Cookbook, skills, email), network isolation with a Docker internal network and a proxy (overlay validated with docker compose config), where to run it (laptop, VPS plus GPU, GPU VM), how to reach it (SSH tunnel, Tailscale, Cloudflare Access, companion app, API tokens and POST /api/v1/chat), layers of authority for agents (roles, scoped ody_ tokens, turn contract, the post-external-content approval gate, host overlays), maturity and threat-model caveats, a lab and a checklist. States which parts were run and which were derived from reading the code.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Your own AI workspace, <em>private by design.</em></>, pt: <>Seu próprio workspace de IA, <em>privado por projeto.</em></> },
  heroLede: { en: "An analysis of the open-source Odysseus used as a practical example: where to run it (your computer or your own cloud), what it can still send out, how to block it with the network, how to reach it, and how to give agents access with the least power.", pt: "Uma análise do Odysseus, de código aberto, usado como exemplo prático: onde rodar (seu computador ou a sua nuvem), o que ele ainda pode enviar para fora, como bloquear pela rede, como chegar até ele e como dar acesso aos agentes com o menor poder possível." },
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que significa “uma IA que não envia dados”" en="What “an AI that does not send data” means" /> },
        { id: "odysseus", title: <T pt="O exemplo: Odysseus, um workspace de IA auto-hospedado" en="The example: Odysseus, a self-hosted AI workspace" /> },
        { id: "where", title: <T pt="Onde rodar: no seu computador ou numa nuvem sua" en="Where to run it: on your computer or in a cloud of yours" /> },
        { id: "egress", title: <T pt="O mapa de saída: o que o Odysseus pode mandar para fora" en="The egress map: what Odysseus can send out" /> },
        { id: "isolate", title: <T pt="Garantir pela rede: o isolamento" en="Guaranteeing it with the network: isolation" /> },
        { id: "access", title: <T pt="Como se comunicar com ela" en="How to talk to it" /> },
        { id: "agents", title: <T pt="Dar acesso a agentes sem entregar a casa" en="Giving agents access without handing over the house" /> },
        { id: "lab", title: <T pt="Praticar na sua máquina" en="Practise on your machine" /> },
        { id: "checklist", title: <T pt="Checklist: uma IA privada de verdade" en="Checklist: a truly private AI" /> },
        { id: "cheat-pw", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Callout icon="check"><T pt={<><strong>O que eu fiz e o que não fiz.</strong> Li o código e a documentação do Odysseus (commit <code>0f996f5</code>, de 2026-10-29, ramo <code>dev</code>), baixei as imagens oficiais, preparei os modelos num volume do Ollama e validei com <code>docker compose config</code> que o arquivo de isolamento desta nota funde corretamente com o Compose do projeto. <strong>Não executei o Odysseus.</strong> O ambiente em que escrevi a nota bloqueou a execução de código de um repositório externo, e eu não contornei isso. Por isso tudo que descrevo sobre o comportamento do app vem da <em>leitura</em> do código (cada afirmação cita o arquivo), e as atividades do laboratório marcadas como “não executada” são derivadas desse código e precisam ser conferidas por você. Quando algo foi de fato rodado, a nota diz.</>} en={<><strong>What I did and did not do.</strong> I read Odysseus's code and documentation (commit <code>0f996f5</code>, dated 2026-10-29, <code>dev</code> branch), pulled the official images, prepared the models in an Ollama volume and checked with <code>docker compose config</code> that this note's isolation file merges correctly with the project's Compose. <strong>I did not run Odysseus.</strong> The environment I wrote the note in blocked running code from an external repository, and I did not work around that. So everything I describe about the app's behaviour comes from <em>reading</em> the code (each claim names the file), and the lab activities marked “not run” are derived from that code and need to be checked by you. Where something was actually run, the note says so.</>} /></Callout>
      <Section id="what" title={<T pt="O que significa “uma IA que não envia dados”" en="What “an AI that does not send data” means" />}>
        <p><T pt="Muita gente resume privacidade a “rodar local”. Mas os dados que importam saem por quatro caminhos diferentes, e só o primeiro é o modelo:" en="Many people reduce privacy to “run it locally”. But the data that matters leaves through four different paths, and only the first is the model:" /></p>
        <Table
          head={[<T pt="Caminho" en="Path" />, <T pt="O que sai" en="What leaves" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<strong><T pt="1. Inferência" en="1. Inference" /></strong>, <T pt="Seu prompt, o histórico e os trechos de documentos e e-mails que o app coloca no contexto." en="Your prompt, the history and the document and email excerpts the app puts into the context." />, <T pt="Usar uma chave da OpenAI em vez de um modelo seu." en="Using an OpenAI key instead of a model of your own." />],
            [<strong><T pt="2. Ferramentas" en="2. Tools" /></strong>, <T pt="O que o agente manda para serviços externos ao usar uma ferramenta." en="What the agent sends to external services when it uses a tool." />, <T pt="Uma busca na web, a previsão do tempo de uma cidade, um download de modelo." en="A web search, a city's weather forecast, a model download." />],
            [<strong><T pt="3. Telemetria" en="3. Telemetry" /></strong>, <T pt="Uso, erros e identificadores que o software envia ao autor." en="Usage, errors and identifiers the software sends to its author." />, <T pt="Analytics, relatórios de falha." en="Analytics, crash reports." />],
            [<strong><T pt="4. Operação" en="4. Operations" /></strong>, <T pt="Backups, logs, imagens e contas na nuvem onde tudo roda." en="Backups, logs, images and the cloud account where it all runs." />, <T pt="Um snapshot do disco; um log com o conteúdo dos prompts." en="A disk snapshot; a log containing prompt contents." />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="Por padrão o app, o modelo local, a memória e a busca ficam na sua infraestrutura. Cada seta tracejada é uma saída que existe por causa de uma função que você escolhe usar." en="By default the app, the local model, memory and search stay in your infrastructure. Each dashed arrow is an exit that exists because of a feature you choose to use." />}>
          <svg viewBox="0 0 700 258" role="img" aria-label="Mapa do fluxo de dados / Data flow map">
            <rect x="10" y="20" width="470" height="210" rx="4" className="ln dash" />
            <text x="245" y="40" className="pt mut" textAnchor="middle">A sua infraestrutura (máquina, VPS ou nuvem sua)</text>
            <text x="245" y="40" className="en mut" textAnchor="middle">Your infrastructure (machine, VPS or your own cloud)</text>
            <rect x="30" y="70" width="120" height="60" rx="4" className="ln fillsoft" />
            <text x="90.0" y="97.0" textAnchor="middle">Você</text>
            <text x="90.0" y="113.0" className="pt mut" textAnchor="middle">navegador, celular</text>
            <text x="90.0" y="113.0" className="en mut" textAnchor="middle">browser, phone</text>
            <path d="M150 100L190 100" className="ln" />
            <path d="M183.7 103.0L190 100L183.7 97.0" className="ln" />
            <rect x="190" y="60" width="120" height="80" rx="4" className="brandfill" />
            <text x="250.0" y="97.0" textAnchor="middle">Odysseus</text>
            <text x="250.0" y="113.0" className="pt mut" textAnchor="middle">agente e tools</text>
            <text x="250.0" y="113.0" className="en mut" textAnchor="middle">agent and tools</text>
            <path d="M310 85L350 85" className="ln" />
            <path d="M343.7 88.0L350 85L343.7 82.0" className="ln" />
            <rect x="350" y="60" width="115" height="50" rx="4" className="ln fillsoft" />
            <text x="407.5" y="82.0" textAnchor="middle">modelo</text>
            <text x="407.5" y="98.0" className="mut" textAnchor="middle">Ollama, vLLM</text>
            <path d="M250 140L250 170" className="ln" />
            <path d="M247.0 163.7L250 170L253.0 163.7" className="ln" />
            <rect x="190" y="170" width="120" height="46" rx="4" className="ln fillsoft" />
            <text x="250.0" y="190.0" textAnchor="middle">Chroma, ntfy</text>
            <text x="250.0" y="206.0" className="pt mut" textAnchor="middle">memória, avisos</text>
            <text x="250.0" y="206.0" className="en mut" textAnchor="middle">memory, alerts</text>
            <path d="M310 195L350 195" className="ln" />
            <path d="M343.7 198.0L350 195L343.7 192.0" className="ln" />
            <rect x="350" y="170" width="115" height="46" rx="4" className="ln fillsoft" />
            <text x="407.5" y="190.0" textAnchor="middle">SearXNG</text>
            <text x="407.5" y="206.0" className="pt mut" textAnchor="middle">busca privada</text>
            <text x="407.5" y="206.0" className="en mut" textAnchor="middle">private search</text>
            <text x="585" y="40" className="pt mut" textAnchor="middle">Pode sair da sua rede</text>
            <text x="585" y="40" className="en mut" textAnchor="middle">Can leave your network</text>
            <path d="M465 195L520 195" className="ln dash" />
            <path d="M513.7 198.0L520 195L513.7 192.0" className="ln" />
            <path d="M310 100L520 140" className="ln dash" />
            <path d="M513.2 141.8L520 140L514.4 135.8" className="ln" />
            <rect x="520" y="60" width="170" height="44" rx="4" className="ln" />
            <text x="605.0" y="79.0" textAnchor="middle">API de modelo</text>
            <text x="605.0" y="95.0" className="mut" textAnchor="middle">OpenAI, Anthropic…</text>
            <rect x="520" y="118" width="170" height="44" rx="4" className="ln" />
            <text x="605.0" y="137.0" textAnchor="middle">GitHub, Hugging Face</text>
            <text x="605.0" y="153.0" className="mut" textAnchor="middle">downloads, skills</text>
            <rect x="520" y="176" width="170" height="44" rx="4" className="ln" />
            <text x="605.0" y="195.0" textAnchor="middle">buscadores, e-mail</text>
            <text x="605.0" y="211.0" className="pt mut" textAnchor="middle">consultas, IMAP/SMTP</text>
            <text x="605.0" y="211.0" className="en mut" textAnchor="middle">queries, IMAP/SMTP</text>
            <text x="350" y="244" className="pt mut" textAnchor="middle">linha cheia = fica dentro · tracejada = só se você ligar</text>
            <text x="350" y="244" className="en mut" textAnchor="middle">solid = stays inside · dashed = only if you turn it on</text>
          </svg>
        </Diagram>
        <p><T pt={<>Daí a definição prática que a nota usa: uma IA “que não envia dados” é aquela em que <strong>você consegue listar, por função, para onde cada dado pode ir, e a rede impede o resto</strong>. A palavra importante é <em>impede</em>. Uma promessa de “sem telemetria” no README é uma afirmação sobre o código de hoje; um firewall é uma garantia independente do código. As duas coisas somam, mas só a segunda vale quando o código muda ou é enganado por um texto malicioso (veja <a href="#agents">agentes</a>).</>} en={<>Hence the practical definition the note uses: an AI “that does not send data” is one where <strong>you can list, per feature, where each piece of data may go, and the network blocks the rest</strong>. The key word is <em>blocks</em>. A “no telemetry” promise in the README is a statement about today's code; a firewall is a guarantee independent of the code. The two add up, but only the second holds when the code changes or is tricked by malicious text (see <a href="#agents">agents</a>).</>} /></p>
        <p><T pt={<>Nuvem também conta. Rodar numa VM sua em um provedor de nuvem mantém os dados fora de qualquer API de IA de terceiros, mas o provedor continua hospedando o disco. “Não envia dados” aqui significa <em>nenhum serviço de IA de terceiros recebe seus dados</em>, não “ninguém além de mim consegue tecnicamente ver”. Para dados regulados ou muito sensíveis, essa diferença importa e foge do escopo desta nota.</>} en={<>The cloud counts too. Running on a VM of yours at a cloud provider keeps data away from any third-party AI API, but the provider still hosts the disk. “Does not send data” here means <em>no third-party AI service receives your data</em>, not “nobody but me can technically see it”. For regulated or highly sensitive data that difference matters and is outside this note's scope.</>} /></p>
      </Section>
      <Section id="odysseus" title={<T pt="O exemplo: Odysseus, um workspace de IA auto-hospedado" en="The example: Odysseus, a self-hosted AI workspace" />}>
        <p><T pt={<><a href="https://github.com/odysseus-dev/odysseus" rel="noopener">Odysseus</a> é descrito pelo próprio projeto como “um workspace de IA auto-hospedado para chat, agentes, pesquisa, documentos, e-mail, notas, calendário e fluxos com modelos locais”. Ele não é um modelo: é o <strong>aplicativo em volta do modelo</strong> (a interface, o agente, as ferramentas, a memória), que você liga a um modelo que roda em outro lugar. Dados do repositório na data da análise: licença <strong>AGPL-3.0-or-later</strong>, escrito em Python (FastAPI) com front-end em módulos ES sem bundler, criado em 2026-05-31, cerca de 95 mil estrelas, ramo padrão <code>dev</code> (o ramo <code>main</code> é o mais curado).</>} en={<><a href="https://github.com/odysseus-dev/odysseus" rel="noopener">Odysseus</a> is described by the project itself as “a self-hosted AI workspace for chat, agents, research, documents, email, notes, calendar and local model workflows”. It is not a model: it is the <strong>application around the model</strong> (the interface, the agent, the tools, the memory), which you connect to a model running somewhere else. Repository facts at the time of analysis: <strong>AGPL-3.0-or-later</strong> license, written in Python (FastAPI) with a front-end of ES modules and no bundler, created 2026-05-31, about 95 thousand stars, default branch <code>dev</code> (the <code>main</code> branch is the more curated one).</>} /></p>
        <Table
          head={[<T pt="Função" en="Feature" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            ["Chat + Agents", <T pt="Modelos locais ou de API, ferramentas, MCP, arquivos, shell, skills e memória." en="Local or API models, tools, MCP, files, shell, skills and memory." />],
            ["Cookbook", <T pt="Recomenda modelos conforme o seu hardware, baixa e serve (vLLM, llama.cpp e outros), inclusive em servidores remotos por SSH." en="Recommends models for your hardware, downloads and serves them (vLLM, llama.cpp and others), including on remote servers over SSH." />],
            ["Deep Research", <T pt="Pesquisa na web em várias etapas, com leitura das fontes e relatório." en="Multi-step web research with source reading and a report." />],
            ["Compare", <T pt="Teste lado a lado e às cegas entre modelos." en="Blind side-by-side model testing." />],
            [<T pt="Documentos, e-mail, notas, calendário" en="Documents, email, notes, calendar" />, <T pt="Editor com edições por IA; caixa IMAP/SMTP com triagem e rascunhos; tarefas agendadas e CalDAV." en="Editor with AI edits; IMAP/SMTP inbox with triage and drafts; scheduled tasks and CalDAV." />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="O Compose do projeto sobe quatro contêineres. O modelo fica fora dele: é qualquer endpoint compatível com a API da OpenAI (Ollama, vLLM, llama.cpp) ou um provedor." en="The project's Compose starts four containers. The model lives outside it: any OpenAI-compatible endpoint (Ollama, vLLM, llama.cpp) or a provider." />}>
          <svg viewBox="0 0 700 290" role="img" aria-label="Arquitetura do Odysseus / Odysseus architecture">
            <rect x="10" y="90" width="110" height="56" rx="4" className="ln fillsoft" />
            <text x="65.0" y="115.0" textAnchor="middle">navegador</text>
            <text x="65.0" y="131.0" className="mut" textAnchor="middle">127.0.0.1:7011</text>
            <path d="M120 118L175 118" className="ln" />
            <path d="M168.7 121.0L175 118L168.7 115.0" className="ln" />
            <rect x="175" y="70" width="160" height="96" rx="4" className="brandfill" />
            <text x="255.0" y="115.0" className="mono" textAnchor="middle">odysseus</text>
            <text x="255.0" y="131.0" className="mut" textAnchor="middle">FastAPI :7000</text>
            <text x="255" y="144" className="pt mut" textAnchor="middle">chat, agente, e-mail,</text>
            <text x="255" y="144" className="en mut" textAnchor="middle">chat, agent, email,</text>
            <text x="255" y="160" className="pt mut" textAnchor="middle">notas, documentos</text>
            <text x="255" y="160" className="en mut" textAnchor="middle">notes, documents</text>
            <path d="M335 90L395 40" className="ln" />
            <path d="M392.1 46.4L395 40L388.2 41.7" className="ln" />
            <path d="M335 118L395 118" className="ln" />
            <path d="M388.7 121.0L395 118L388.7 115.0" className="ln" />
            <path d="M335 146L395 196" className="ln" />
            <path d="M388.2 194.3L395 196L392.1 189.6" className="ln" />
            <rect x="395" y="15" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="460.0" y="35.0" className="mono" textAnchor="middle">chromadb</text>
            <text x="460.0" y="51.0" className="pt mut" textAnchor="middle">vetores · :8100</text>
            <text x="460.0" y="51.0" className="en mut" textAnchor="middle">vectors · :8100</text>
            <rect x="395" y="95" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="460.0" y="115.0" className="mono" textAnchor="middle">searxng</text>
            <text x="460.0" y="131.0" className="pt mut" textAnchor="middle">busca · :8080</text>
            <text x="460.0" y="131.0" className="en mut" textAnchor="middle">search · :8080</text>
            <rect x="395" y="173" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="460.0" y="193.0" className="mono" textAnchor="middle">ntfy</text>
            <text x="460.0" y="209.0" className="mut" textAnchor="middle">push · :8091</text>
            <path d="M255 166L255 235" className="ln" />
            <path d="M252.0 228.7L255 235L258.0 228.7" className="ln" />
            <rect x="175" y="235" width="160" height="40" rx="4" className="ln" />
            <text x="255.0" y="252.0" textAnchor="middle">endpoint do modelo</text>
            <text x="255.0" y="268.0" className="pt mut" textAnchor="middle">OpenAI-compatível</text>
            <text x="255.0" y="268.0" className="en mut" textAnchor="middle">OpenAI-compatible</text>
            <text x="262" y="228" className="mut" textAnchor="middle"></text>
            <rect x="395" y="235" width="130" height="40" rx="4" className="ln fillsoft" />
            <text x="460.0" y="252.0" className="mono" textAnchor="middle">data/</text>
            <text x="460.0" y="268.0" className="pt mut" textAnchor="middle">SQLite, chaves</text>
            <text x="460.0" y="268.0" className="en mut" textAnchor="middle">SQLite, keys</text>
            <path d="M335 255L395 255" className="ln" />
            <path d="M388.7 258.0L395 255L388.7 252.0" className="ln" />
            <text x="550" y="120" className="pt mut" textAnchor="start">tudo em 127.0.0.1</text>
            <text x="550" y="120" className="en mut" textAnchor="start">all on 127.0.0.1</text>
            <text x="550" y="136" className="pt mut" textAnchor="start">por padrão</text>
            <text x="550" y="136" className="en mut" textAnchor="start">by default</text>
          </svg>
        </Diagram>
        <p><T pt={<>O <code>docker-compose.yml</code> do projeto sobe quatro serviços e liga todos a <code>127.0.0.1</code> por padrão. A interface fica em <code>http://localhost:7011</code> (a porta 7000 é a de dentro do contêiner), e a senha do primeiro admin aparece em <code>docker compose logs odysseus</code>:</>} en={<>The project's <code>docker-compose.yml</code> starts four services and binds all of them to <code>127.0.0.1</code> by default. The interface is at <code>http://localhost:7011</code> (port 7000 is the one inside the container), and the first admin's password shows in <code>docker compose logs odysseus</code>:</>} /></p>
        <CodeBlock code={`git clone https://github.com/odysseus-dev/odysseus.git
cd odysseus
cp .env.example .env
docker compose up -d --build
# abra http://localhost:7011 ; a senha do admin está em: docker compose logs odysseus`} />
        <Table
          head={[<T pt="Serviço" en="Service" />, <T pt="Papel" en="Role" />, <T pt="Tamanho da imagem (medido ao baixar)" en="Image size (measured on pull)" />]}
          rows={[
            [<code>odysseus</code>, <T pt={<>A aplicação (FastAPI, agente, ferramentas). Dados em <code>data/</code>: banco SQLite, chaves, uploads, memória.</>} en={<>The application (FastAPI, agent, tools). Data in <code>data/</code>: SQLite database, keys, uploads, memory.</>} />, "3,7 GB"],
            [<code>chromadb</code>, <T pt={<>Banco vetorial para memória e RAG (a telemetria do Chroma vem desligada: <code>ANONYMIZED_TELEMETRY=FALSE</code>).</>} en={<>Vector database for memory and RAG (Chroma telemetry ships off: <code>ANONYMIZED_TELEMETRY=FALSE</code>).</>} />, "826 MB"],
            [<code>searxng</code>, <T pt="Meta-buscador que você hospeda; é o que dá busca na web ao agente sem uma chave de API de busca." en="A metasearch engine you host; it gives the agent web search without a search API key." />, "383 MB"],
            [<code>ntfy</code>, <T pt="Servidor de notificações push (lembretes no celular)." en="Push notification server (phone reminders)." />, "123 MB"],
          ]}
        />
        <p><T pt={<>As imagens são fixadas por <em>digest</em> no Compose (<code>chromadb/chroma:1.5.9@sha256:…</code>, e o mesmo para SearXNG e ntfy), o que é a prática certa da <a href="/notas/docker/">nota de Docker</a>. Para o app, o README manda fixar uma tag imutável (<code>ghcr.io/odysseus-dev/odysseus:1.0.2-7c8070f</code>, formato <code>X.Y.Z-&lt;sha&gt;</code>) em vez de <code>:latest</code>, que muda a cada push.</>} en={<>The images are pinned by <em>digest</em> in Compose (<code>chromadb/chroma:1.5.9@sha256:…</code>, and the same for SearXNG and ntfy), which is the right practice from the <a href="/notas/docker/">Docker note</a>. For the app, the README says to pin an immutable tag (<code>ghcr.io/odysseus-dev/odysseus:1.0.2-7c8070f</code>, format <code>X.Y.Z-&lt;sha&gt;</code>) instead of <code>:latest</code>, which moves on every push.</>} /></p>
        <h3><T pt="Maturidade e licença: leia antes de depender" en="Maturity and license: read before you depend on it" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Projeto jovem e rápido.</strong> O próprio <code>ROADMAP.md</code> é franco: diz que o projeto funciona bem para o autor, que “o navio está andando rápido” e que há cantos do código que é melhor evitar. A prioridade alta inclui “matar bugs”, testes de instalação limpa em Linux, macOS e Windows, e confiabilidade do Cookbook em outras máquinas. Trate como software em evolução, não como produto estável.</>} en={<><strong>Young, fast-moving project.</strong> The <code>ROADMAP.md</code> itself is frank: it says the project works well for its author, that “the ship is moving fast” and that some corners of the code are best avoided. High priority includes “squash bugs”, clean-install tests on Linux, macOS and Windows, and Cookbook reliability on other machines. Treat it as evolving software, not a stable product.</>} /></li>
          <li><T pt={<><strong>Modelo de confiança declarado.</strong> O <code>THREAT_MODEL.md</code> diz que o Odysseus é feito para <em>usuários confiáveis numa rede privada, não para exposição pública</em>, e que deve ser tratado “como um console de administrador”. Concordo e a nota segue essa linha: nada de porta aberta na internet.</>} en={<><strong>Declared trust model.</strong> <code>THREAT_MODEL.md</code> says Odysseus is built for <em>trusted users on a private network, not public exposure</em>, and should be treated “like an admin console”. I agree, and the note follows that line: no port open to the internet.</>} /></li>
          <li><T pt={<><strong>Lacunas conhecidas, listadas pelo projeto.</strong> A primeira é a mais importante para esta nota: <em>não há sandbox de shell nem de sistema de arquivos</em>; as ferramentas <code>bash</code> e <code>read_file</code>/<code>write_file</code> rodam com o usuário do processo, sem filtro de saída de rede nem confinamento. O documento pode estar parcialmente desatualizado (por exemplo, diz que os escopos de token são grosseiros, mas o código atual tem escopos por capacidade, veja <a href="#agents">agentes</a>); confirme no commit que você for usar.</>} en={<><strong>Known gaps, listed by the project.</strong> The first is the most important for this note: <em>there is no shell or file-system sandbox</em>; the <code>bash</code> and <code>read_file</code>/<code>write_file</code> tools run as the process user, with no network egress filtering or confinement. The document may be partly out of date (for example, it says token scopes are coarse, but the current code has per-capability scopes, see <a href="#agents">agents</a>); confirm on the commit you use.</>} /></li>
          <li><T pt={<><strong>AGPL-3.0.</strong> Para uso próprio, sem modificar, nada muda. Se você modificar o código e oferecer o serviço a outras pessoas pela rede, a licença exige oferecer a elas o código-fonte modificado. (Não é aconselhamento jurídico; leia a licença.)</>} en={<><strong>AGPL-3.0.</strong> For your own use, unmodified, nothing changes. If you modify the code and offer the service to other people over a network, the license requires offering them the modified source. (Not legal advice; read the license.)</>} /></li>
        </ul>
      </Section>
      <Section id="where" title={<T pt="Onde rodar: no seu computador ou numa nuvem sua" en="Where to run it: on your computer or in a cloud of yours" />}>
        <p><T pt={<>A decisão central é separar duas peças com custos opostos. O <strong>app</strong> (workspace, Chroma, SearXNG, ntfy) é leve: a documentação diz que “o app em si é leve; servir modelo local é a parte pesada”, e que hosts pequenos podem se conectar a uma API ou a servidores de modelo remotos. O <strong>modelo</strong> é o que pede memória de GPU, e o cálculo de quanto cabe está na <a href="/notas/llm-agents-open-source/">nota de LLMs open-source</a>.</>} en={<>The central decision is to separate two parts with opposite costs. The <strong>app</strong> (workspace, Chroma, SearXNG, ntfy) is light: the documentation says “the app itself is lightweight; local model serving is the heavy part”, and that small hosts can connect to an API or to remote model servers. The <strong>model</strong> is what needs GPU memory, and the math of how much fits is in the <a href="/notas/llm-agents-open-source/">open-source LLMs note</a>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O app é leve; o modelo é o que pesa. Separar os dois permite um servidor barato para o workspace e uma GPU só quando precisar." en="The app is light; the model is the heavy part. Splitting them allows a cheap server for the workspace and a GPU only when needed." />}>
          <svg viewBox="0 0 700 232" role="img" aria-label="Onde rodar / Where to run it">
            <rect x="10" y="15" width="220" height="200" rx="4" className="ln dash" />
            <text x="120" y="35" className="pt mut" textAnchor="middle">A. Tudo na sua máquina</text>
            <text x="120" y="35" className="en mut" textAnchor="middle">A. All on your machine</text>
            <text x="120" y="52" className="pt mut" textAnchor="middle">notebook ou desktop</text>
            <text x="120" y="52" className="en mut" textAnchor="middle">laptop or desktop</text>
            <rect x="240" y="15" width="220" height="200" rx="4" className="ln dash" />
            <text x="350" y="35" className="pt mut" textAnchor="middle">B. App no VPS, modelo na GPU</text>
            <text x="350" y="35" className="en mut" textAnchor="middle">B. App on a VPS, model on a GPU</text>
            <text x="350" y="52" className="pt mut" textAnchor="middle">dois servidores seus</text>
            <text x="350" y="52" className="en mut" textAnchor="middle">two servers of yours</text>
            <rect x="470" y="15" width="220" height="200" rx="4" className="ln dash" />
            <text x="580" y="35" className="pt mut" textAnchor="middle">C. Tudo numa VM com GPU</text>
            <text x="580" y="35" className="en mut" textAnchor="middle">C. All on one GPU VM</text>
            <text x="580" y="52" className="pt mut" textAnchor="middle">um servidor na nuvem</text>
            <text x="580" y="52" className="en mut" textAnchor="middle">one server in the cloud</text>
            <rect x="25" y="70" width="190" height="44" rx="4" className="brandfill" />
            <text x="120.0" y="89.0" textAnchor="middle">Odysseus + serviços</text>
            <text x="120.0" y="105.0" className="mut" textAnchor="middle">Chroma, SearXNG, ntfy</text>
            <path d="M120 114L120 140" className="ln" />
            <path d="M117.0 133.7L120 140L123.0 133.7" className="ln" />
            <rect x="25" y="140" width="190" height="44" rx="4" className="ln fillsoft" />
            <text x="120.0" y="159.0" textAnchor="middle">Ollama</text>
            <text x="120.0" y="175.0" className="pt mut" textAnchor="middle">no host (ou Docker)</text>
            <text x="120.0" y="175.0" className="en mut" textAnchor="middle">on the host (or Docker)</text>
            <text x="120" y="204" className="pt mut" textAnchor="middle">simples · limitada pela GPU</text>
            <text x="120" y="204" className="en mut" textAnchor="middle">simple · limited by GPU</text>
            <rect x="255" y="70" width="190" height="44" rx="4" className="brandfill" />
            <text x="350.0" y="89.0" textAnchor="middle">VPS pequeno: Odysseus</text>
            <text x="350.0" y="105.0" className="pt mut" textAnchor="middle">sem GPU</text>
            <text x="350.0" y="105.0" className="en mut" textAnchor="middle">no GPU</text>
            <path d="M350 114L350 140" className="ln" />
            <path d="M347.0 133.7L350 140L353.0 133.7" className="ln" />
            <text x="358" y="132" className="pt mono mut" textAnchor="start">rede privada</text>
            <text x="358" y="132" className="en mono mut" textAnchor="start">private network</text>
            <rect x="255" y="140" width="190" height="44" rx="4" className="ln fillsoft" />
            <text x="350.0" y="159.0" textAnchor="middle">GPU: vLLM ou Ollama</text>
            <text x="350.0" y="175.0" className="pt mut" textAnchor="middle">só aceita o VPS</text>
            <text x="350.0" y="175.0" className="en mut" textAnchor="middle">accepts the VPS only</text>
            <text x="350" y="204" className="pt mut" textAnchor="middle">app 24h · GPU sob demanda</text>
            <text x="350" y="204" className="en mut" textAnchor="middle">app 24/7 · GPU on demand</text>
            <rect x="485" y="70" width="190" height="44" rx="4" className="brandfill" />
            <text x="580.0" y="89.0" textAnchor="middle">Odysseus + serviços</text>
            <text x="580.0" y="105.0" className="mut" textAnchor="middle">Chroma, SearXNG, ntfy</text>
            <path d="M580 114L580 140" className="ln" />
            <path d="M577.0 133.7L580 140L583.0 133.7" className="ln" />
            <rect x="485" y="140" width="190" height="44" rx="4" className="ln fillsoft" />
            <text x="580.0" y="159.0" textAnchor="middle">vLLM / llama.cpp</text>
            <text x="580.0" y="175.0" className="mut" textAnchor="middle">Cookbook, GPU overlay</text>
            <text x="580" y="204" className="pt mut" textAnchor="middle">tudo junto · GPU cobra ligada</text>
            <text x="580" y="204" className="en mut" textAnchor="middle">all in one · GPU bills while on</text>
          </svg>
        </Diagram>
        <Table
          head={[null, <T pt="Como fica" en="How it looks" />, <T pt="Cuidados específicos" en="Specific cautions" />]}
          rows={[
            [<strong>A</strong>, <T pt={<>Compose do projeto + Ollama no host. O <code>.env.example</code> sugere <code>OLLAMA_BASE_URL=http://host.docker.internal:11434/v1</code>.</>} en={<>Project Compose + Ollama on the host. <code>.env.example</code> suggests <code>OLLAMA_BASE_URL=http://host.docker.internal:11434/v1</code>.</>} />, <T pt={<>Para o contêiner alcançar o Ollama do host, o Ollama precisa escutar em <code>0.0.0.0</code> (o próprio <code>.env.example</code> diz isso), o que o expõe à sua rede local: feche a porta 11434 no firewall. Em Mac com Apple Silicon o Docker não enxerga a GPU Metal; para acelerar, rode o Odysseus nativo (<code>./start-macos.sh</code>, porta 7860).</>} en={<>For the container to reach the host's Ollama, Ollama must listen on <code>0.0.0.0</code> (<code>.env.example</code> itself says so), which exposes it to your local network: close port 11434 in the firewall. On an Apple Silicon Mac Docker cannot see the Metal GPU; to accelerate, run Odysseus natively (<code>./start-macos.sh</code>, port 7860).</>} />],
            [<strong>B</strong>, <T pt="Um VPS barato roda o app e fala com o modelo numa GPU alugada por uma rede privada. A receita da GPU com túnel SSH está na nota de LLMs." en="A cheap VPS runs the app and talks to the model on a rented GPU over a private network. The GPU recipe with an SSH tunnel is in the LLMs note." />, <T pt="O modelo não pode ter porta pública: aceite só o IP do VPS (ou use a rede privada do provedor, ou Tailscale). Você paga o VPS 24 h e a GPU só quando liga. O Cookbook também sabe controlar servidores remotos por SSH, com uma chave que o próprio app gera." en="The model must not have a public port: accept only the VPS IP (or use the provider's private network, or Tailscale). You pay for the VPS 24/7 and the GPU only when it is on. Cookbook can also drive remote servers over SSH, with a key the app itself generates." />],
            [<strong>C</strong>, <T pt={<>Uma VM com GPU roda tudo. O projeto traz overlays <code>docker-compose.gpu-nvidia.yml</code> e <code>docker-compose.gpu-amd.yml</code>.</>} en={<>One GPU VM runs everything. The project ships <code>docker-compose.gpu-nvidia.yml</code> and <code>docker-compose.gpu-amd.yml</code> overlays.</>} />, <T pt="Precisa do NVIDIA Container Toolkit no host. O overlay só expõe os dispositivos: a imagem enxuta ainda precisa instalar CUDA/ROCm via Cookbook → Dependencies antes de servir um modelo na GPU. Esqueça a GPU ligada e a fatura sobe." en="Needs the NVIDIA Container Toolkit on the host. The overlay only exposes the devices: the slim image still needs CUDA/ROCm installed through Cookbook → Dependencies before serving a model on the GPU. Forget the GPU on and the bill climbs." />],
          ]}
        />
        <p><T pt={<>Em qualquer das três, o Odysseus fala com o modelo por um <em>endpoint</em>: qualquer servidor com API compatível com a da OpenAI (Ollama, vLLM, llama.cpp, LM Studio) ou um provedor. Você cadastra o endpoint em Settings, ou o app o descobre sozinho: <code>LLM_HOSTS</code> lista hosts para ele varrer em portas comuns (11434 do Ollama, 8000 a 8020). <strong>Aqui está o ponto em que a privacidade se decide</strong>: um endpoint apontando para <code>ollama:11434</code> mantém o prompt na sua infraestrutura; um endpoint de <code>api.openai.com</code> o envia para fora. O app trata os dois igual, e quem diferencia é você.</>} en={<>In any of the three, Odysseus talks to the model through an <em>endpoint</em>: any server with an OpenAI-compatible API (Ollama, vLLM, llama.cpp, LM Studio) or a provider. You register the endpoint in Settings, or the app discovers it: <code>LLM_HOSTS</code> lists hosts for it to scan on common ports (Ollama's 11434, 8000 to 8020). <strong>This is where privacy is decided</strong>: an endpoint pointing to <code>ollama:11434</code> keeps the prompt in your infrastructure; an endpoint at <code>api.openai.com</code> sends it out. The app treats both the same, and you are the one who tells them apart.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Modelo pequeno, agente pesado.</strong> O próprio roadmap lista como problema aberto que “o modo agente é pesado demais para modelos locais pequenos”: esquemas de ferramentas, skills, memória e instruções consomem o contexto antes de a sua pergunta chegar, principalmente em janelas de 4k a 16k. Um modelo de 0,5B serve para testar a ligação (é o que o laboratório usa), não para trabalho de agente. Para isso, escolha um modelo maior e com bom suporte a ferramentas.</>} en={<><strong>Small model, heavy agent.</strong> The roadmap itself lists as an open problem that “agent mode is too heavy for smaller local models”: tool schemas, skills, memory and instructions eat the context before your question arrives, especially on 4k to 16k windows. A 0.5B model is fine for testing the plumbing (it is what the lab uses), not for agent work. For that, pick a larger model with good tool-calling support.</>} /></Callout>
      </Section>
      <Section id="egress" title={<T pt="O mapa de saída: o que o Odysseus pode mandar para fora" en="The egress map: what Odysseus can send out" />}>
        <p><T pt="Para responder “ele envia dados?” sem confiar em slogan, procurei no código do commit analisado (1) clientes de telemetria e (2) todos os endereços externos escritos nos arquivos Python do app. O resultado, por função:" en="To answer “does it send data?” without trusting a slogan, I searched the analysed commit's code for (1) telemetry clients and (2) every external address written into the app's Python files. The result, per feature:" /></p>
        <Table
          head={[<T pt="Função" en="Feature" />, <T pt="Para onde vai" en="Where it goes" />, <T pt="Evidência" en="Evidence" />, <T pt="Como conter" en="How to contain" />]}
          rows={[
            [<strong><T pt="Chat e agente" en="Chat and agent" /></strong>, <T pt="Para o endpoint de modelo que você cadastrou. Local: fica. Provedor: sai." en="To the model endpoint you registered. Local: stays. Provider: leaves." />, <><code>src/llm_core.py</code>: <T pt="trata OpenAI-compatível, Ollama, Anthropic, Copilot e ChatGPT (assinatura)" en="handles OpenAI-compatible, Ollama, Anthropic, Copilot and ChatGPT (subscription)" /></>, <T pt={<>Cadastre só endpoints seus e deixe <code>OPENAI_API_KEY</code> vazio.</>} en={<>Register only endpoints of yours and leave <code>OPENAI_API_KEY</code> empty.</>} />],
            [<strong><T pt="Busca na web, Deep Research" en="Web search, Deep Research" /></strong>, <T pt={<>O SearXNG repassa a <em>consulta</em> a buscadores públicos; as ferramentas web baixam as páginas. O Compose usa as configurações padrão do SearXNG.</>} en={<>SearXNG forwards the <em>query</em> to public search engines; the web tools download the pages. The Compose uses SearXNG's default settings.</>} />, <><code>config/searxng/settings.yml</code> (<code>use_default_settings: true</code>); <code>src/agent_tools/web_tools.py</code></>, <T pt={<>Deixe a função desligada, ou aceite que a consulta (texto que o <em>modelo</em> escreve) sai. Veja o aviso abaixo.</>} en={<>Leave the feature off, or accept that the query (text the <em>model</em> writes) leaves. See the warning below.</>} />],
            [<strong><T pt="Tempo" en="Weather" /></strong>, <T pt={<>A ferramenta de clima consulta <code>geocoding-api.open-meteo.com</code> e <code>api.open-meteo.com</code> com o nome do lugar.</>} en={<>The weather tool queries <code>geocoding-api.open-meteo.com</code> and <code>api.open-meteo.com</code> with the place name.</>} />, <code>src/agent_tools/weather_tools.py</code>, <T pt="Bloqueio de rede; ou não use a ferramenta." en="Network block; or do not use the tool." />],
            [<strong><T pt="Seletor de emoji" en="Emoji picker" /></strong>, <T pt={<>O servidor busca os SVGs em <code>cdn.jsdelivr.net/npm/openmoji</code>; a CSP também libera esse domínio para o navegador.</>} en={<>The server fetches SVGs from <code>cdn.jsdelivr.net/npm/openmoji</code>; the CSP also allows that domain for the browser.</>} />, <><code>routes/emoji_routes.py</code>, <code>core/middleware.py</code></>, <T pt="Uma saída “escondida” num detalhe de interface: só um bloqueio de rede a pega com certeza." en="An exit “hidden” in an interface detail: only a network block reliably catches it." />],
            [<strong>Cookbook</strong>, <T pt="Hugging Face (modelos), GitHub (releases do llama.cpp, receitas do vLLM)." en="Hugging Face (models), GitHub (llama.cpp releases, vLLM recipes)." />, <><code>routes/cookbook_routes.py</code>, <code>routes/cookbook_helpers.py</code></>, <T pt="Só quando você baixa ou serve um modelo. Baixe os pesos antes e depois corte a saída (veja o isolamento)." en="Only when you download or serve a model. Download the weights beforehand and then cut egress (see isolation)." />],
            [<strong>Skills</strong>, <T pt={<>Importar uma skill de um repositório busca em <code>github.com</code>, <code>api.github.com</code> e <code>raw.githubusercontent.com</code>.</>} en={<>Importing a skill from a repository fetches from <code>github.com</code>, <code>api.github.com</code> and <code>raw.githubusercontent.com</code>.</>} />, <code>services/memory/skill_importer.py</code>, <T pt="Só na importação. Skills importadas são texto que o agente lê: trate como código não confiável." en="Only on import. Imported skills are text the agent reads: treat them as untrusted code." />],
            [<strong><T pt="Embeddings" en="Embeddings" /></strong>, <T pt={<>Sem <code>EMBEDDING_URL</code>, cai num modelo local <code>fastembed</code> que, segundo o <code>.env.example</code>, “baixa o modelo na primeira execução (~50 MB)”.</>} en={<>Without <code>EMBEDDING_URL</code>, it falls back to a local <code>fastembed</code> model that, per <code>.env.example</code>, “downloads the model on first run (~50 MB)”.</>} />, <><code>.env.example</code>, <code>src/embedding_lanes.py</code></>, <T pt={<>Aponte <code>EMBEDDING_URL</code> para o seu Ollama (modelo <code>all-minilm</code>) e nada é baixado em tempo de execução.</>} en={<>Point <code>EMBEDDING_URL</code> at your Ollama (the <code>all-minilm</code> model) and nothing is downloaded at run time.</>} />],
            [<strong><T pt="E-mail e calendário" en="Email and calendar" /></strong>, <T pt="IMAP/SMTP para o seu provedor; OAuth do Google se você conectar uma conta Google; CalDAV para o seu servidor." en="IMAP/SMTP to your provider; Google OAuth if you connect a Google account; CalDAV to your server." />, <><code>routes/email_routes.py</code>, <code>.env.example</code></>, <T pt={<>É o seu e-mail, que já está “fora”. O risco novo é o agente <em>ler e escrever</em> nele (veja agentes). E exige uma saída de rede para o provedor.</>} en={<>It is your email, which is already “out there”. The new risk is the agent <em>reading and writing</em> it (see agents). It also needs an outbound path to the provider.</>} />],
            [<strong>Webhooks</strong>, <T pt="Você cadastra a URL; o app envia eventos para ela." en="You register the URL; the app sends events to it." />, <code>routes/webhook/webhook_routes.py</code>, <T pt="Só para onde você mandar." en="Only where you point it." />],
            [<strong><T pt="Telemetria" en="Telemetry" /></strong>, <T pt={<>Não encontrei nenhum cliente de analytics ou relatório de erros no código. O único ajuste relacionado é o <code>ANONYMIZED_TELEMETRY=FALSE</code> do Chroma, e a página do projeto afirma “no telemetry”.</>} en={<>I found no analytics or error-reporting client in the code. The only related setting is Chroma's <code>ANONYMIZED_TELEMETRY=FALSE</code>, and the project page states “no telemetry”.</>} />, <T pt={<>Busca por <code>sentry</code>, <code>posthog</code>, <code>mixpanel</code>, <code>gtag</code>, <code>amplitude</code>, <code>telemetry</code>: sem clientes</>} en={<>Search for <code>sentry</code>, <code>posthog</code>, <code>mixpanel</code>, <code>gtag</code>, <code>amplitude</code>, <code>telemetry</code>: no clients</>} />, <T pt="É leitura de código, não captura de tráfego. Confirme na atividade de captura." en="This is code reading, not traffic capture. Confirm it in the capture activity." />],
          ]}
        />
        <p><T pt={<>Os provedores de modelo que o código sabe chamar incluem OpenAI, Anthropic, Google (Gemini), DeepSeek, Groq, Together, Fireworks, Mistral, OpenRouter, Venice, Kimi, GitHub Copilot e a assinatura do ChatGPT. Nenhum é chamado sem você cadastrar uma chave ou conta; a lista mostra só <em>o que fica a um clique de distância</em> quando você abre a tela de endpoints.</>} en={<>The model providers the code knows how to call include OpenAI, Anthropic, Google (Gemini), DeepSeek, Groq, Together, Fireworks, Mistral, OpenRouter, Venice, Kimi, GitHub Copilot and the ChatGPT subscription. None is called until you register a key or account; the list only shows <em>what is one click away</em> when you open the endpoints screen.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>A busca na web é um canal de saída controlado pelo modelo.</strong> O texto da consulta é escrito pelo modelo, e o modelo lê conteúdo que pode conter instruções maliciosas (uma página, um e-mail). Um atacante pode induzi-lo a pôr dados seus na “busca”. É a razão de o projeto ter o portão de aprovação descrito na seção de agentes, e de eu tratar a busca como uma função que você liga de propósito, não como algo “privado porque o SearXNG é meu”: o SearXNG é seu, mas as consultas dele vão para os buscadores.</>} en={<><strong>Web search is a model-controlled exit channel.</strong> The query text is written by the model, and the model reads content that may contain malicious instructions (a page, an email). An attacker can induce it to put your data into the “search”. That is why the project has the approval gate described in the agents section, and why I treat search as a feature you turn on deliberately, not as “private because SearXNG is mine”: SearXNG is yours, but its queries go to the search engines.</>} /></Callout>
        <h3><T pt="Audite você mesmo" en="Audit it yourself" /></h3>
        <p><T pt="Rodei versões destes comandos no clone do repositório; refaça no commit que você for usar, porque o projeto muda todo dia:" en="I ran versions of these commands on the repository clone; redo them on the commit you will use, because the project changes every day:" /></p>
        <CodeBlock code={`# 1) clientes de telemetria no código do app
grep -rniE "sentry|posthog|mixpanel|google-analytics|gtag|amplitude" \\
  --include=*.py --include=*.js src services routes core static | head

# 2) todos os hosts externos escritos nos arquivos Python do app
grep -rhoE "https?://[a-zA-Z0-9.-]+\\.[a-z]{2,}" --include=*.py src services routes core app.py \\
  | grep -vE "example\\.|localhost|127\\.0|w3\\.org|schemas\\." | sort | uniq -c | sort -rn | head -40

# 3) o portão que impede o agente de agir depois de ler conteúdo externo
grep -n "ODYSSEUS_TOOL_APPROVAL_GATE" -r src | head`} />
      </Section>
      <Section id="isolate" title={<T pt="Garantir pela rede: o isolamento" en="Guaranteeing it with the network: isolation" />}>
        <p><T pt={<>A tabela acima é o que o código <em>faz</em>. Para <strong>impedir</strong>, a camada certa é a rede. O Docker oferece isso de graça: uma rede marcada como <code>internal: true</code> não tem rota para fora. A ideia é a mesma da <a href="/notas/docker/">nota de Docker</a>: todos os serviços numa rede interna e um único proxy, ligado às duas redes, como porta de entrada.</>} en={<>The table above is what the code <em>does</em>. To <strong>prevent</strong>, the right layer is the network. Docker offers it for free: a network marked <code>internal: true</code> has no route out. The idea is the same as the <a href="/notas/docker/">Docker note</a>: all services on an internal network and a single proxy, joined to both networks, as the front door.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Todos os serviços ficam numa rede sem rota para fora. Só o proxy tem porta publicada, e só em 127.0.0.1." en="Every service sits on a network with no route out. Only the proxy has a published port, and only on 127.0.0.1." />}>
          <svg viewBox="0 0 700 262" role="img" aria-label="Rede isolada / Isolated network">
            <rect x="10" y="95" width="100" height="50" rx="4" className="ln dash" />
            <text x="60.0" y="124.0" textAnchor="middle">internet</text>
            <text x="130" y="88" className="pt mut" textAnchor="middle">✗ sem rota</text>
            <text x="130" y="88" className="en mut" textAnchor="middle">✗ no route</text>
            <rect x="190" y="15" width="500" height="235" rx="4" className="ln dash" />
            <text x="440" y="33" className="pt mut" textAnchor="middle">rede backend (internal: true)</text>
            <text x="440" y="33" className="en mut" textAnchor="middle">backend network (internal: true)</text>
            <rect x="30" y="170" width="120" height="46" rx="4" className="ln fillsoft" />
            <text x="90.0" y="190.0" textAnchor="middle">você</text>
            <text x="90.0" y="206.0" className="mut" textAnchor="middle">127.0.0.1:7011</text>
            <path d="M150 193L205 193" className="ln" />
            <path d="M198.7 196.0L205 193L198.7 190.0" className="ln" />
            <rect x="205" y="170" width="100" height="46" rx="4" className="brandfill" />
            <text x="255.0" y="190.0" textAnchor="middle">proxy nginx</text>
            <text x="255.0" y="206.0" className="pt mut" textAnchor="middle">único com porta</text>
            <text x="255.0" y="206.0" className="en mut" textAnchor="middle">only one with a port</text>
            <path d="M305 193L345 150" className="ln" />
            <path d="M342.9 156.7L345 150L338.5 152.5" className="ln" />
            <rect x="345" y="60" width="150" height="90" rx="4" className="brandfill" />
            <text x="420.0" y="102.0" className="mono" textAnchor="middle">odysseus</text>
            <text x="420.0" y="118.0" className="pt mut" textAnchor="middle">sem saída</text>
            <text x="420.0" y="118.0" className="en mut" textAnchor="middle">no outbound</text>
            <path d="M495 85L540 60" className="ln" />
            <path d="M536.0 65.7L540 60L533.0 60.4" className="ln" />
            <path d="M495 105L540 105" className="ln" />
            <path d="M533.7 108.0L540 105L533.7 102.0" className="ln" />
            <path d="M495 125L540 150" className="ln" />
            <path d="M533.0 149.6L540 150L536.0 144.3" className="ln" />
            <rect x="540" y="45" width="140" height="34" rx="4" className="ln fillsoft" />
            <text x="610.0" y="66.0" className="mono" textAnchor="middle">ollama</text>
            <rect x="540" y="90" width="140" height="34" rx="4" className="ln fillsoft" />
            <text x="610.0" y="111.0" className="mono" textAnchor="middle">chromadb</text>
            <rect x="540" y="135" width="140" height="34" rx="4" className="ln fillsoft" />
            <text x="610.0" y="156.0" className="mono" textAnchor="middle">searxng · ntfy</text>
            <text x="440" y="232" className="pt mut" textAnchor="middle">o proxy também participa da rede frontend, a única com acesso ao host</text>
            <text x="440" y="232" className="en mut" textAnchor="middle">the proxy also joins the frontend network, the only one with host access</text>
          </svg>
        </Diagram>
        <p><T pt={<>O arquivo abaixo é um <em>overlay</em> do Compose: o Compose do projeto continua intacto e este arquivo, passado com um segundo <code>-f</code>, muda só o que precisa. Eu o validei com <code>docker compose config</code> (a fusão resulta em portas publicadas apenas no proxy, em <code>127.0.0.1:7011</code>, e todos os outros serviços só na rede <code>backend</code>, que é <code>internal</code>).</>} en={<>The file below is a Compose <em>overlay</em>: the project's Compose stays intact and this file, passed with a second <code>-f</code>, changes only what it must. I validated it with <code>docker compose config</code> (the merge results in ports published only on the proxy, at <code>127.0.0.1:7011</code>, and every other service only on the <code>backend</code> network, which is <code>internal</code>).</>} /></p>
        <CodeBlock code={`# Overlay: everything on an internal network (no route to the internet),
# a local Ollama, and one reverse proxy as the only way in.
services:
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama-data:/root/.ollama
    networks: [backend]
    restart: unless-stopped

  odysseus:
    ports: !reset []
    networks: !override [backend]
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434/v1
      - EMBEDDING_URL=http://ollama:11434/v1/embeddings
      - EMBEDDING_MODEL=all-minilm
      - ALLOWED_ORIGINS=http://localhost:7011,http://127.0.0.1:7011

  chromadb:
    ports: !reset []
    networks: !override [backend]

  searxng:
    ports: !reset []
    networks: !override [backend]

  ntfy:
    ports: !reset []
    networks: !override [backend]

  proxy:
    image: nginx:alpine
    ports:
      - "127.0.0.1:7011:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [backend, frontend]
    depends_on: [odysseus]
    restart: unless-stopped

networks:
  backend:
    internal: true
  frontend: {}

volumes:
  ollama-data:`} />
        <CodeBlock code={`server {
  listen 80;
  client_max_body_size 50m;
  location / {
    proxy_pass http://odysseus:7000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_buffering off;
    proxy_read_timeout 3600s;
  }
}`} />
        <ul className="ds-list">
          <li><T pt={<><code>ports: !reset []</code> e <code>networks: !override [backend]</code> são marcadores do Compose: o primeiro apaga a lista de portas herdada do arquivo do projeto, o segundo <em>substitui</em> (em vez de somar) a lista de redes. Sem eles, a fusão manteria as portas publicadas e a rede padrão, que tem saída.</>} en={<><code>ports: !reset []</code> and <code>networks: !override [backend]</code> are Compose markers: the first clears the port list inherited from the project's file, the second <em>replaces</em> (instead of adding to) the network list. Without them the merge would keep the published ports and the default network, which has egress.</>} /></li>
          <li><T pt={<>Um contêiner que está <strong>só</strong> numa rede interna não consegue publicar porta. Eu testei isso com um nginx genérico: o <code>-p</code> não cria nenhum mapeamento e o <code>curl</code> falha (código 000). Por isso o proxy precisa estar na rede <code>backend</code> <em>e</em> na <code>frontend</code>; nesse arranjo o <code>curl</code> pelo proxy deu 200 e o contêiner interno não resolveu nenhum nome externo.</>} en={<>A container that is <strong>only</strong> on an internal network cannot publish a port. I tested it with a generic nginx: <code>-p</code> creates no mapping and <code>curl</code> fails (code 000). That is why the proxy must be on the <code>backend</code> network <em>and</em> the <code>frontend</code> one; in that arrangement <code>curl</code> through the proxy gave 200 and the internal container resolved no external name.</>} /></li>
          <li><T pt={<><strong>O proxy tem saída.</strong> Por estar na rede <code>frontend</code>, ele alcança a internet. Mantenha-o um repassador simples, sem executar nada que venha do modelo. A garantia vale para o Odysseus, o Chroma, o SearXNG, o ntfy e o Ollama, não para o proxy.</>} en={<><strong>The proxy has egress.</strong> Being on the <code>frontend</code> network, it reaches the internet. Keep it a plain forwarder that runs nothing that comes from the model. The guarantee holds for Odysseus, Chroma, SearXNG, ntfy and Ollama, not for the proxy.</>} /></li>
          <li><T pt={<><strong>Baixe os pesos antes de cortar a rede.</strong> Rede interna significa que o <code>ollama pull</code> falha dentro dela. O laboratório baixa os modelos num volume com um contêiner temporário e só depois sobe o stack isolado. O <code>EMBEDDING_URL</code> aponta para o Ollama pelo mesmo motivo: sem ele o app tentaria baixar o modelo <code>fastembed</code> na primeira execução.</>} en={<><strong>Download the weights before cutting the network.</strong> An internal network means <code>ollama pull</code> fails inside it. The lab downloads the models into a volume with a temporary container and only then starts the isolated stack. <code>EMBEDDING_URL</code> points at Ollama for the same reason: without it the app would try to download the <code>fastembed</code> model on first run.</>} /></li>
          <li><T pt={<><strong>O que quebra, de propósito:</strong> busca na web e Deep Research (o SearXNG não alcança os buscadores), clima, emoji, Cookbook (downloads), importação de skills, o servidor MCP de navegador (instalado por <code>npx</code>), e e-mail com um provedor externo. Cada item é uma saída da tabela anterior que agora está impedida.</>} en={<><strong>What breaks, on purpose:</strong> web search and Deep Research (SearXNG cannot reach the search engines), weather, emoji, Cookbook (downloads), skill import, the browser MCP server (installed through <code>npx</code>) and email with an external provider. Each item is an exit from the previous table that is now blocked.</>} /></li>
          <li><T pt={<><strong>Quer busca?</strong> Ponha <em>só o SearXNG</em> também na rede <code>frontend</code> (ele ganha saída; o app continua sem). Assim a única saída do sistema é a consulta de busca, o que é fácil de auditar, e você sabe exatamente o que está aceitando.</>} en={<><strong>Want search?</strong> Put <em>only SearXNG</em> on the <code>frontend</code> network as well (it gains egress; the app still has none). Then the system's only exit is the search query, which is easy to audit, and you know exactly what you are accepting.</>} /></li>
        </ul>
        <h3><T pt="Outras camadas de bloqueio" en="Other blocking layers" /></h3>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="Como" en="How" />, <T pt="Quando usar" en="When to use" />]}
          rows={[
            [<T pt="Rede do Docker" en="Docker network" />, <><code>internal: true</code> + proxy</>, <T pt="O caso desta nota: tudo no mesmo host." en="This note's case: everything on one host." />],
            [<T pt="Firewall do host" en="Host firewall" />, <T pt={<>Regras de saída para a ponte do Docker (cadeia <code>DOCKER-USER</code> do iptables), liberando só os destinos permitidos.</>} en={<>Outbound rules for the Docker bridge (iptables <code>DOCKER-USER</code> chain), allowing only permitted destinations.</>} />, <T pt={<>Quando precisa de uma <em>lista de permissão</em> (por exemplo, só o seu servidor de e-mail).</>} en={<>When you need an <em>allowlist</em> (for example, only your mail server).</>} />],
            [<T pt="Nuvem" en="Cloud" />, <T pt="Regras de saída do security group / firewall da VPC; sub-rede privada sem NAT para o servidor do modelo." en="Outbound rules on the security group / VPC firewall; a private subnet with no NAT for the model server." />, <T pt="Nas opções B e C da seção “onde rodar”." en="In options B and C of the “where to run” section." />],
            [<T pt="Proxy de saída" en="Egress proxy" />, <T pt="Um proxy HTTP com lista de domínios; o app só conhece o proxy." en="An HTTP proxy with a domain list; the app only knows the proxy." />, <T pt="Quando precisa de poucos destinos HTTP e quer registro de cada um." en="When you need a few HTTP destinations and want each one logged." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Por que a rede e não só a configuração.</strong> O <code>THREAT_MODEL.md</code> do projeto admite que as ferramentas de shell e de arquivos do agente rodam sem filtro de saída. Um admin com o shell ligado, enganado por um texto malicioso, pode fazer qualquer requisição que o processo consiga. Nenhum interruptor de configuração protege disso; um contêiner sem rota para fora, sim.</>} en={<><strong>Why the network and not just configuration.</strong> The project's <code>THREAT_MODEL.md</code> admits that the agent's shell and file tools run without egress filtering. An admin with the shell on, tricked by malicious text, can make any request the process can. No configuration switch protects against that; a container with no route out does.</>} /></Callout>
      </Section>
      <Section id="access" title={<T pt="Como se comunicar com ela" en="How to talk to it" />}>
        <p><T pt={<>A regra do projeto, repetida no README, no <code>SECURITY.md</code> e no guia de instalação: <strong>não exponha a porta do app à internet</strong>. Mantenha-a em <code>127.0.0.1</code> e chegue até ela por uma camada privada. As formas, da mais simples à mais completa:</>} en={<>The project's rule, repeated in the README, in <code>SECURITY.md</code> and in the setup guide: <strong>do not expose the app's port to the internet</strong>. Keep it on <code>127.0.0.1</code> and reach it through a private layer. The ways, from the simplest to the most complete:</>} /></p>
        <Table
          head={[<T pt="Quem fala" en="Who talks" />, <T pt="Como" en="How" />, <T pt="Detalhes" en="Details" />]}
          rows={[
            [<T pt="Você, no navegador, de longe" en="You, in a browser, remotely" />, <T pt={<>Túnel SSH: <code>ssh -N -L 7011:127.0.0.1:7011 usuario@servidor</code> e abra <code>http://localhost:7011</code>.</>} en={<>SSH tunnel: <code>ssh -N -L 7011:127.0.0.1:7011 user@server</code> and open <code>http://localhost:7011</code>.</>} />, <T pt={<>Nenhuma porta aberta além do SSH, e <code>localhost</code> conta como origem segura (o botão de copiar funciona).</>} en={<>No open port besides SSH, and <code>localhost</code> counts as a secure origin (the copy button works).</>} />],
            [<T pt="Você e outros usuários" en="You and other users" />, <T pt={<>Tailscale, Cloudflare Access, VPN, ou um proxy reverso (Caddy, nginx, Traefik) com HTTPS na frente de <code>127.0.0.1:7011</code>.</>} en={<>Tailscale, Cloudflare Access, a VPN, or a reverse proxy (Caddy, nginx, Traefik) with HTTPS in front of <code>127.0.0.1:7011</code>.</>} />, <T pt={<>Mantenha <code>AUTH_ENABLED=true</code> e <code>LOCALHOST_BYPASS=false</code>. Em HTTP puro por LAN, o navegador bloqueia o botão de copiar (só HTTPS e <code>localhost</code> são “origem segura”); o guia sugere <code>mkcert</code> para certificado local. Para redes lentas, HTTP/2 no proxy (Caddy) acelera o carregamento, porque o front-end faz centenas de requisições pequenas. Veja a <a href="/notas/cloudflare/">nota de Cloudflare</a>.</>} en={<>Keep <code>AUTH_ENABLED=true</code> and <code>LOCALHOST_BYPASS=false</code>. Over plain HTTP on a LAN the browser blocks the copy button (only HTTPS and <code>localhost</code> are “secure origins”); the guide suggests <code>mkcert</code> for a local certificate. For slow networks, HTTP/2 at the proxy (Caddy) speeds up loading, because the front-end makes hundreds of small requests. See the <a href="/notas/cloudflare/">Cloudflare note</a>.</>} />],
            [<T pt="Seu celular" en="Your phone" />, <T pt={<>App companion: o admin gera um <em>token de pareamento de uso único</em> (<code>POST /api/companion/pair</code>, só com cookie de admin).</>} en={<>Companion app: the admin mints a <em>one-time pairing token</em> (<code>POST /api/companion/pair</code>, admin cookie only).</>} />, <T pt={<>O <code>COMPANION_BASE_URL</code> anunciado precisa ser um IP de LAN ou Tailscale. O cliente atual aceita só HTTP, sem nome público nem HTTPS.</>} en={<>The advertised <code>COMPANION_BASE_URL</code> must be a LAN or Tailscale IP. The current client accepts only HTTP, with no public name and no HTTPS.</>} />],
            [<T pt="Um script ou outro programa" en="A script or another program" />, <T pt={<>Token de API com escopo <code>chat</code> e <code>POST /api/v1/chat</code>.</>} en={<>API token with the <code>chat</code> scope and <code>POST /api/v1/chat</code>.</>} />, <T pt="Veja abaixo." en="See below." />],
            [<T pt="Alertas para você" en="Alerts to you" />, <T pt={<>ntfy (push) e webhooks (<code>POST</code> para uma URL sua).</>} en={<>ntfy (push) and webhooks (<code>POST</code> to a URL of yours).</>} />, <T pt={<>Para o ntfy chegar ao celular, mude <code>NTFY_BIND</code> para o IP do host ou do Tailscale e acerte <code>NTFY_BASE_URL</code>.</>} en={<>For ntfy to reach the phone, change <code>NTFY_BIND</code> to the host or Tailscale IP and set <code>NTFY_BASE_URL</code> accordingly.</>} />],
          ]}
        />
        <h3><T pt="Pela API: login, endpoint de modelo, token e chat" en="Through the API: login, model endpoint, token and chat" /></h3>
        <p><T pt={<>O fluxo abaixo vem da leitura das rotas (<code>routes/auth_routes.py</code>, <code>routes/model_routes.py</code>, <code>routes/api_token_routes.py</code>, <code>routes/webhook/webhook_routes.py</code>). <strong>Não foi executado por mim</strong>; confira cada resposta.</>} en={<>The flow below comes from reading the routes (<code>routes/auth_routes.py</code>, <code>routes/model_routes.py</code>, <code>routes/api_token_routes.py</code>, <code>routes/webhook/webhook_routes.py</code>). <strong>I did not run it</strong>; check each response.</>} /></p>
        <CodeBlock code={`BASE=http://127.0.0.1:7011

# 1) login como admin (a senha inicial está em: docker compose logs odysseus)
curl -s -c cookies.txt -X POST $BASE/api/auth/login \\
  -H 'content-type: application/json' \\
  -d '{"username":"admin","password":"SENHA_DO_LOG"}'

# 2) cadastrar o Ollama como endpoint de modelo (só admin)
curl -s -b cookies.txt -X POST $BASE/api/model-endpoints \\
  -d 'name=ollama' -d 'base_url=http://ollama:11434/v1'

# 3) criar um token com escopo "chat" (a resposta traz o token UMA vez: ody_...)
curl -s -b cookies.txt -X POST $BASE/api/tokens -d 'name=meu-script' -d 'scopes=chat'

# 4) conversar com o token, sem cookie
curl -s -X POST $BASE/api/v1/chat \\
  -H "Authorization: Bearer $ODY_TOKEN" -H 'content-type: application/json' \\
  -d '{"message":"Diga olá em cinco palavras","model":"qwen2.5:0.5b"}'
# -> {"response": "...", "session_id": "...", "model": "qwen2.5:0.5b"}`} />
        <ul className="ds-list">
          <li><T pt={<>O token é gerado como <code>ody_</code> + 32 bytes aleatórios, e o servidor guarda só o <strong>hash bcrypt</strong>: a resposta do passo 3 é a única vez que você vê o valor. Perdeu, crie outro e apague o antigo (<code>DELETE /api/tokens/&#123;id&#125;</code>).</>} en={<>The token is generated as <code>ody_</code> + 32 random bytes, and the server stores only the <strong>bcrypt hash</strong>: the step 3 response is the only time you see the value. Lost it, create another and delete the old one (<code>DELETE /api/tokens/&#123;id&#125;</code>).</>} /></li>
          <li><T pt={<>O <code>/api/v1/chat</code> exige um token com escopo <code>chat</code> (um cookie de navegador não serve) e usa o primeiro endpoint habilitado <strong>do dono do token</strong>. Passar <code>session</code> retoma uma conversa; o código só deixa retomar sessões do próprio dono.</>} en={<><code>/api/v1/chat</code> requires a token with the <code>chat</code> scope (a browser cookie will not do) and uses the first enabled endpoint <strong>of the token's owner</strong>. Passing <code>session</code> resumes a conversation; the code only lets you resume sessions of the owner.</>} /></li>
          <li><T pt={<>O corpo aceita também <code>base_url</code>, <code>api_key</code> e <code>provider</code>, o que deixaria o chamador apontar o servidor para <em>qualquer</em> endpoint. O <code>THREAT_MODEL.md</code> lista isso como uma lacuna (SSRF) com correção em andamento; num setup privado, dê esse token só a quem você confiaria com o servidor, e confira no seu commit se a validação já entrou.</>} en={<>The body also accepts <code>base_url</code>, <code>api_key</code> and <code>provider</code>, which would let the caller point the server at <em>any</em> endpoint. <code>THREAT_MODEL.md</code> lists this as a gap (SSRF) with a fix in progress; in a private setup, give that token only to whoever you would trust with the server, and check on your commit whether the validation has landed.</>} /></li>
        </ul>
      </Section>
      <Section id="agents" title={<T pt="Dar acesso a agentes sem entregar a casa" en="Giving agents access without handing over the house" />}>
        <p><T pt={<>“Agente” aqui tem dois sentidos, e o Odysseus trata os dois: o <strong>agente de dentro</strong> (o modo agente do chat, que usa as ferramentas do app) e os <strong>agentes de fora</strong> (Claude Code, Codex, o seu script) que usam o Odysseus como fonte de dados e ferramenta. Em ambos, a pergunta é a mesma: <em>qual é o menor poder que resolve a tarefa?</em> O projeto responde com camadas:</>} en={<>“Agent” here has two meanings, and Odysseus handles both: the <strong>inside agent</strong> (the chat's agent mode, which uses the app's tools) and the <strong>outside agents</strong> (Claude Code, Codex, your script) that use Odysseus as a data source and tool. In both, the question is the same: <em>what is the least power that does the job?</em> The project answers with layers:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Cada camada reduz o que um agente (ou quem o enganar) consegue fazer. As duas destacadas são as específicas de agentes." en="Each layer reduces what an agent (or whoever tricks it) can do. The two highlighted ones are specific to agents." />}>
          <svg viewBox="0 0 700 308" role="img" aria-label="Camadas de autoridade / Layers of authority">
            <rect x="10" y="10" width="680" height="36" rx="4" className="ln fillsoft" />
            <text x="32" y="33" className="mono" textAnchor="middle">1</text>
            <text x="55" y="33" className="pt" textAnchor="start">Rede privada</text>
            <text x="55" y="33" className="en" textAnchor="start">Private network</text>
            <text x="210" y="33" className="pt mut" textAnchor="start">SSH, Tailscale ou Cloudflare Access; nada exposto à internet</text>
            <text x="210" y="33" className="en mut" textAnchor="start">SSH, Tailscale or Cloudflare Access; nothing exposed to the internet</text>
            <rect x="10" y="52" width="680" height="36" rx="4" className="ln fillsoft" />
            <text x="32" y="75" className="mono" textAnchor="middle">2</text>
            <text x="55" y="75" className="pt" textAnchor="start">Login e 2FA</text>
            <text x="55" y="75" className="en" textAnchor="start">Login and 2FA</text>
            <text x="210" y="75" className="pt mut" textAnchor="start">AUTH_ENABLED=true, senha com bcrypt, TOTP, cadastro aberto desligado</text>
            <text x="210" y="75" className="en mut" textAnchor="start">AUTH_ENABLED=true, bcrypt password, TOTP, open signup off</text>
            <rect x="10" y="94" width="680" height="36" rx="4" className="ln fillsoft" />
            <text x="32" y="117" className="mono" textAnchor="middle">3</text>
            <text x="55" y="117" className="pt" textAnchor="start">Papel</text>
            <text x="55" y="117" className="en" textAnchor="start">Role</text>
            <text x="210" y="117" className="pt mut" textAnchor="start">admin tem shell, arquivos, e-mail, MCP; usuário comum não</text>
            <text x="210" y="117" className="en mut" textAnchor="start">admin gets shell, files, email, MCP; a regular user does not</text>
            <rect x="10" y="136" width="680" height="36" rx="4" className="brandfill" />
            <text x="32" y="159" className="mono" textAnchor="middle">4</text>
            <text x="55" y="159" className="pt" textAnchor="start">Token com escopo</text>
            <text x="55" y="159" className="en" textAnchor="start">Scoped token</text>
            <text x="210" y="159" className="pt mut" textAnchor="start">agentes externos entram por ody_…, com escopos como todos:read</text>
            <text x="210" y="159" className="en mut" textAnchor="start">external agents come in with ody_… and scopes like todos:read</text>
            <rect x="10" y="178" width="680" height="36" rx="4" className="ln fillsoft" />
            <text x="32" y="201" className="mono" textAnchor="middle">5</text>
            <text x="55" y="201" className="pt" textAnchor="start">Contrato do turno</text>
            <text x="55" y="201" className="en" textAnchor="start">Turn contract</text>
            <text x="210" y="201" className="pt mut" textAnchor="start">só as ferramentas pedidas e permitidas são oferecidas ao modelo</text>
            <text x="210" y="201" className="en mut" textAnchor="start">only the requested and allowed tools are offered to the model</text>
            <rect x="10" y="220" width="680" height="36" rx="4" className="brandfill" />
            <text x="32" y="243" className="mono" textAnchor="middle">6</text>
            <text x="55" y="243" className="pt" textAnchor="start">Portão de aprovação</text>
            <text x="55" y="243" className="en" textAnchor="start">Approval gate</text>
            <text x="210" y="243" className="pt mut" textAnchor="start">depois de conteúdo externo, ações com efeito pedem aprovação</text>
            <text x="210" y="243" className="en mut" textAnchor="start">after external content, actions with effects need approval</text>
            <rect x="10" y="262" width="680" height="36" rx="4" className="ln fillsoft" />
            <text x="32" y="285" className="mono" textAnchor="middle">7</text>
            <text x="55" y="285" className="pt" textAnchor="start">Usuário do processo</text>
            <text x="55" y="285" className="en" textAnchor="start">Process user</text>
            <text x="210" y="285" className="pt mut" textAnchor="start">PUID/PGID no contêiner; docker.sock e pasta do host só por opt-in</text>
            <text x="210" y="285" className="en mut" textAnchor="start">PUID/PGID in the container; docker.sock and host folder opt-in only</text>
          </svg>
        </Diagram>
        <h3><T pt="Camada 3: papéis" en="Layer 3: roles" /></h3>
        <Table
          head={[<T pt="Capacidade" en="Capability" />, "Admin", <T pt="Usuário comum (padrão)" en="Regular user (default)" />]}
          rows={[
            [<T pt="Chat com o agente, navegador, documentos, pesquisa, imagem, memória" en="Agent chat, browser, documents, research, images, memory" />, "✓", "✓"],
            [<T pt="Shell e Python, leitura e escrita de arquivos" en="Shell and Python, file read and write" />, "✓", "✗"],
            [<T pt="Ler e enviar e-mail, calendário" en="Read and send email, calendar" />, "✓", "✗"],
            [<T pt={<>Ferramentas MCP (<code>mcp__*</code>)</>} en={<>MCP tools (<code>mcp__*</code>)</>} />, "✓", "✗"],
            [<T pt="Tokens, webhooks, servir modelo, cofre, configurações" en="Tokens, webhooks, model serving, vault, settings" />, "✓", "✗"],
          ]}
        />
        <p><T pt={<>Esta tabela é a do <code>THREAT_MODEL.md</code>, e o código a aplica por uma lista de bloqueio (<code>NON_ADMIN_BLOCKED_TOOLS</code> em <code>src/tool_security.py</code>) que inclui <code>bash</code>, <code>python</code>, <code>read_file</code>, <code>write_file</code>, <code>manage_tokens</code>, <code>manage_mcp</code>, <code>serve_model</code> e qualquer nome que comece com <code>mcp__</code>. Os comentários do arquivo explicam até as exclusões que parecem inocentes: ferramentas “somente leitura” do Cookbook também são bloqueadas, porque chamam rotas de admin com o token interno e dariam alcance de admin a um usuário comum. <strong>Regra prática:</strong> use sua conta de admin só para administrar, e uma conta comum para o trabalho diário com o agente.</>} en={<>This table is the one in <code>THREAT_MODEL.md</code>, and the code applies it through a blocklist (<code>NON_ADMIN_BLOCKED_TOOLS</code> in <code>src/tool_security.py</code>) that includes <code>bash</code>, <code>python</code>, <code>read_file</code>, <code>write_file</code>, <code>manage_tokens</code>, <code>manage_mcp</code>, <code>serve_model</code> and any name starting with <code>mcp__</code>. The file's comments explain even the exclusions that look harmless: “read-only” Cookbook tools are blocked too, because they call admin routes with the internal token and would give a regular user admin reach. <strong>Practical rule:</strong> use your admin account only to administer, and a regular account for day-to-day agent work.</>} /></p>
        <h3><T pt="Camada 5: o contrato do turno" en="Layer 5: the turn contract" /></h3>
        <p><T pt={<>Para o agente de dentro, o <code>docs/AGENT_TURN_CONTRACT.md</code> descreve que, a cada turno, o servidor congela o conjunto de ferramentas oferecido ao modelo e confere que <code>exigido ⊆ oferecido ⊆ executável</code>: ligar o interruptor “Web” sozinho não seleciona as ferramentas web, e uma ferramenta oferecida ainda passa pelas políticas de execução e de dono. É o princípio de <em>quanto menos ferramentas visíveis, menos o modelo consegue usar</em>, aplicado turno a turno (e ainda ajuda a poupar contexto de modelos pequenos).</>} en={<>For the inside agent, <code>docs/AGENT_TURN_CONTRACT.md</code> describes that, on each turn, the server freezes the set of tools offered to the model and checks that <code>required ⊆ offered ⊆ executable</code>: turning on the “Web” switch alone does not select the web tools, and an offered tool still passes through the execution and owner policies. It is the principle of <em>the fewer tools visible, the less the model can use</em>, applied turn by turn (and it also saves context on small models).</>} /></p>
        <h3><T pt="Camada 6: o portão depois de conteúdo externo" en="Layer 6: the gate after external content" /></h3>
        <p><T pt={<>É a defesa mais específica contra o risco central dos agentes. Em <code>src/tool_capabilities.py</code>, cada ferramenta declara seus <em>efeitos</em>. Quando conteúdo não confiável entra na conversa (resultado de busca, página baixada, transcrição do YouTube, pesquisa), o servidor passa a <strong>bloquear</strong> as ferramentas com estes efeitos até o usuário autorizar à parte:</>} en={<>It is the most specific defence against the central risk of agents. In <code>src/tool_capabilities.py</code>, each tool declares its <em>effects</em>. When untrusted content enters the conversation (a search result, a downloaded page, a YouTube transcript, research), the server starts <strong>blocking</strong> tools with these effects until the user authorises separately:</>} /></p>
        <CodeBlock code={`POST_EXTERNAL_BLOCKED_EFFECTS = frozenset({
    ToolEffect.READ_PRIVATE,      ToolEffect.WRITE_WORKSPACE,
    ToolEffect.WRITE_PRIVATE,     ToolEffect.EXECUTE_CODE,
    ToolEffect.NETWORK_EGRESS,    ToolEffect.EXTERNAL_SIDE_EFFECT,
    ToolEffect.UI_SIDE_EFFECT,    ToolEffect.ADMIN_CHANGE,
    ToolEffect.DESTRUCTIVE,
})`} />
        <p><T pt={<>Em termos da <a href="/notas/agent-harness/">nota de harness</a>, isso quebra a “trifeta letal” (dados privados + conteúdo não confiável + saída para fora) <em>no servidor</em>, e não pedindo gentilmente ao modelo. Está ligado por padrão (<code>ODYSSEUS_TOOL_APPROVAL_GATE=1</code>); o comentário do código diz que, enquanto os processos do agente não rodarem sem rede, ele é “a única verificação” entre conteúdo injetado e essas ferramentas, e que desligar só é razoável em instalações de um usuário só que aceitam o risco. Há exceções deliberadas: metadados do próprio sistema (skills, o documento aberto, o e-mail aberto, anexos do chat) ainda permitem ferramentas de leitura. <strong>Não desligue para “o agente parar de perguntar”.</strong> Se ele pergunta demais, restrinja as ferramentas.</>} en={<>In terms of the <a href="/notas/agent-harness/">harness note</a>, this breaks the “lethal trifecta” (private data + untrusted content + an outbound channel) <em>in the server</em>, rather than politely asking the model. It is on by default (<code>ODYSSEUS_TOOL_APPROVAL_GATE=1</code>); the code comment says that until agent processes run without network it is “the only check” between injected content and those tools, and that turning it off is only reasonable on single-user installs that accept the risk. There are deliberate exceptions: the system's own metadata (skills, the open document, the open email, chat attachments) still permits read tools. <strong>Do not turn it off to “make the agent stop asking”.</strong> If it asks too much, restrict the tools.</>} /></p>
        <h3><T pt="Camada 4: agentes de fora, com token de escopo" en="Layer 4: outside agents, with a scoped token" /></h3>
        <p><T pt={<>Para o Claude Code ou o Codex usarem seu workspace, o Odysseus traz um fluxo pronto em <em>Settings → Integrations</em>: você adiciona um “Claude Agent” (ou Codex), o app gera um token, você liga <strong>só as ferramentas</strong> que esse agente pode usar e copia os comandos de configuração. O agente então usa duas variáveis de ambiente e uma skill baixada do próprio servidor:</>} en={<>For Claude Code or Codex to use your workspace, Odysseus ships a ready flow in <em>Settings → Integrations</em>: you add a “Claude Agent” (or Codex), the app generates a token, you turn on <strong>only the tools</strong> that agent may use and copy the setup commands. The agent then uses two environment variables and a skill downloaded from the server itself:</>} /></p>
        <CodeBlock code={`export ODYSSEUS_URL=http://seu-servidor:7000
export ODYSSEUS_API_TOKEN=ody_token_gerado
curl -fsSL -H "Authorization: Bearer $ODYSSEUS_API_TOKEN" "$ODYSSEUS_URL/api/claude/plugin.zip" -o /tmp/odysseus-claude-skill.zip
python3 -m zipfile -e /tmp/odysseus-claude-skill.zip ~/.claude/
python3 ~/.claude/skills/odysseus/scripts/odysseus_api.py capabilities
`} />
        <p><T pt={<>O token carrega <strong>escopos</strong>. Em <code>routes/api_token_routes.py</code> a lista permitida é fechada, e o servidor recusa qualquer escopo fora dela:</>} en={<>The token carries <strong>scopes</strong>. In <code>routes/api_token_routes.py</code> the allowed list is closed, and the server rejects any scope outside it:</>} /></p>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="Escopos" en="Scopes" />]}
          rows={[
            ["Chat", <><code>chat</code> <T pt="(o padrão)" en="(the default)" /></>],
            ["Todos", <><code>todos:read</code>, <code>todos:write</code></>],
            [<T pt="Documentos" en="Documents" />, <><code>documents:read</code>, <code>documents:write</code></>],
            ["E-mail", <><code>email:read</code>, <code>email:draft</code>, <code>email:send</code></>],
            [<T pt="Calendário" en="Calendar" />, <><code>calendar:read</code>, <code>calendar:write</code></>],
            [<T pt="Memória" en="Memory" />, <><code>memory:read</code>, <code>memory:write</code></>],
            ["Cookbook", <><code>cookbook:read</code>, <code>cookbook:launch</code></>],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong>Escrever implica ler.</strong> Pedir <code>todos:write</code> acrescenta <code>todos:read</code> sozinho (o mesmo para documentos, calendário, memória, rascunho de e-mail e <code>cookbook:launch</code>). Há perfis prontos, como <code>codex_email_drafts</code> (ler e-mail, <em>rascunhar</em>, documentos), que deliberadamente <strong>não inclui <code>email:send</code></strong>: o agente prepara o rascunho e uma pessoa envia.</>} en={<><strong>Writing implies reading.</strong> Asking for <code>todos:write</code> adds <code>todos:read</code> by itself (the same for documents, calendar, memory, email draft and <code>cookbook:launch</code>). There are ready profiles, like <code>codex_email_drafts</code> (read email, <em>draft</em>, documents), which deliberately <strong>does not include <code>email:send</code></strong>: the agent prepares the draft and a person sends it.</>} /></li>
          <li><T pt={<><strong>O servidor confere no caminho de cada chamada.</strong> O agente começa por <code>GET /api/codex/capabilities</code> para saber o que pode e, se tentar algo fora do escopo, recebe <code>403</code>. O <code>SKILL.md</code> que o Odysseus entrega manda tratar o <code>403</code> como restrição intencional, sem contorná-la. (O nome <code>/api/codex/*</code> é histórico: é a API de agentes de todas as integrações.)</>} en={<><strong>The server checks on every call's path.</strong> The agent starts with <code>GET /api/codex/capabilities</code> to learn what it may do and, if it tries something outside the scope, gets <code>403</code>. The <code>SKILL.md</code> Odysseus delivers says to treat <code>403</code> as an intentional restriction, without working around it. (The <code>/api/codex/*</code> name is historical: it is the agent API for all integrations.)</>} /></li>
          <li><T pt={<><strong>Token ≠ sessão de pessoa.</strong> Quando uma execução é dirigida por um token, o servidor a marca como “credencial delegada”: ferramentas privilegiadas são <em>recusadas</em> (“não está disponível para chamadores com token de API; exige uma sessão interativa”) e nenhuma aprovação levanta isso. As rotas de admin do Cookbook também não aceitam token (um token alcança só a superfície <code>/api/codex/cookbook/*</code>, com os escopos <code>cookbook:*</code>).</>} en={<><strong>Token ≠ a person's session.</strong> When a run is driven by a token, the server marks it a “delegated credential”: privileged tools are <em>refused</em> (“not available to API-token callers; requires an interactive session”) and no approval lifts that. The admin Cookbook routes do not accept tokens either (a token reaches only the <code>/api/codex/cookbook/*</code> surface, with the <code>cookbook:*</code> scopes).</>} /></li>
          <li><T pt={<><strong>Um token por integração, e apague os que sobram.</strong> É a recomendação do projeto, e permite revogar um agente sem afetar os outros. Se o usuário dono for apagado, os tokens dele são revogados junto.</>} en={<><strong>One token per integration, and delete the leftovers.</strong> It is the project's recommendation, and it lets you revoke one agent without affecting the others. If the owning user is deleted, their tokens are revoked with them.</>} /></li>
          <li><T pt={<><strong>O escopo protege a <em>API</em>, não o disco.</strong> O <code>SKILL.md</code> proíbe o agente de usar SSH, Docker, SQLite ou arquivos locais para ler dados do Odysseus, mas isso é uma instrução ao agente. Se o Claude Code roda <em>na mesma máquina</em> e consegue ler <code>data/</code>, o escopo do token não impede nada. Rode o agente externo em outro usuário ou outra máquina, sem acesso ao diretório de dados.</>} en={<><strong>The scope protects the <em>API</em>, not the disk.</strong> The <code>SKILL.md</code> forbids the agent from using SSH, Docker, SQLite or local files to read Odysseus data, but that is an instruction to the agent. If Claude Code runs <em>on the same machine</em> and can read <code>data/</code>, the token scope prevents nothing. Run the outside agent as another user or on another machine, without access to the data directory.</>} /></li>
        </ul>
        <h3><T pt="MCP: o Odysseus como cliente" en="MCP: Odysseus as a client" /></h3>
        <p><T pt={<>O Odysseus também é um <em>cliente MCP</em> (veja a <a href="/notas/mcp-server-client/">nota de MCP</a>): o admin cadastra servidores MCP e as ferramentas deles aparecem para o agente com o prefixo <code>mcp__</code>, que <strong>só admins</strong> usam. O app registra servidores internos (<code>mcp_servers/</code>: e-mail, geração de imagem, memória e RAG), e o servidor MCP de navegador (<code>@playwright/mcp</code>) só entra se o pacote já estiver no cache do <code>npx</code>, o que exige um <code>npx -y @playwright/mcp@latest --version</code> prévio (cerca de 300 MB). Servidores MCP remotos com OAuth precisam do <code>OAUTH_REDIRECT_BASE_URL</code> correto atrás de proxy. Cada servidor MCP que você acrescenta é código com acesso: aplique à ferramenta dele o mesmo teste de menor poder.</>} en={<>Odysseus is also an <em>MCP client</em> (see the <a href="/notas/mcp-server-client/">MCP note</a>): the admin registers MCP servers and their tools appear to the agent with the <code>mcp__</code> prefix, which <strong>only admins</strong> use. The app registers internal servers (<code>mcp_servers/</code>: email, image generation, memory and RAG), and the browser MCP server (<code>@playwright/mcp</code>) only joins if the package is already in the <code>npx</code> cache, which needs a prior <code>npx -y @playwright/mcp@latest --version</code> (about 300 MB). Remote MCP servers with OAuth need the right <code>OAUTH_REDIRECT_BASE_URL</code> behind a proxy. Every MCP server you add is code with access: apply the same least-power test to its tools.</>} /></p>
        <h3><T pt="Camada 7: o que o agente toca no computador" en="Layer 7: what the agent touches on the computer" /></h3>
        <p><T pt={<>Por padrão o contêiner do Odysseus enxerga só seus volumes. Três sobreposições do Compose, todas <strong>desligadas por padrão</strong> e descritas no <code>.env.example</code> como “alta confiança”, ampliam o alcance. Você as liga com a variável <code>COMPOSE_FILE</code>:</>} en={<>By default the Odysseus container sees only its volumes. Three Compose overlays, all <strong>off by default</strong> and described in <code>.env.example</code> as “high-trust”, widen the reach. You turn them on with the <code>COMPOSE_FILE</code> variable:</>} /></p>
        <Table
          head={[<T pt="Overlay" en="Overlay" />, <T pt="O que concede" en="What it grants" />, <T pt="Cuidado" en="Caution" />]}
          rows={[
            [<code>docker/host-workspace.yml</code>, <T pt="Monta uma pasta do host, gravável, para o agente editar arquivos reais “como o Codex”." en="Mounts a host folder, writable, so the agent edits real files “like Codex”." />, <T pt={<>O exemplo do <code>.env.example</code> usa <code>ODYSSEUS_HOST_WORKSPACE_DIR=/home/you</code>, a casa inteira. Use <strong>uma pasta de projeto</strong>, de preferência um clone descartável.</>} en={<>The <code>.env.example</code> example uses <code>ODYSSEUS_HOST_WORKSPACE_DIR=/home/you</code>, the whole home. Use <strong>a project folder</strong>, preferably a disposable clone.</>} />],
            [<code>docker/host-docker.yml</code>, <T pt={<>Monta o <code>docker.sock</code> para o Cookbook gerenciar o Docker do host.</>} en={<>Mounts <code>docker.sock</code> so Cookbook can manage the host's Docker.</>} />, <T pt={<>Quem controla o socket controla o host (veja a <a href="/notas/docker/">nota de Docker</a>). O projeto prefere servidores remotos por SSH. Só ative com um motivo claro.</>} en={<>Whoever controls the socket controls the host (see the <a href="/notas/docker/">Docker note</a>). The project prefers remote servers over SSH. Enable only with a clear reason.</>} />],
            [<code>docker/host-network.yml</code>, <T pt="Faz o contêiner usar a rede do host (descoberta de LAN, estado da VPN)." en="Makes the container use the host network (LAN discovery, VPN state)." />, <T pt="Desfaz o isolamento de rede da seção anterior. Incompatível com o objetivo desta nota." en="Undoes the previous section's network isolation. Incompatible with this note's goal." />],
          ]}
        />
        <CodeBlock code={`# exemplo (do .env.example): o agente passa a editar uma pasta real do host
COMPOSE_FILE=docker-compose.yml:docker/host-workspace.yml
ODYSSEUS_HOST_WORKSPACE_DIR=/caminho/da/pasta-do-projeto   # NÃO a sua home
ODYSSEUS_HOST_WORKSPACE_MOUNT=/host/workspace`} />
        <h3><T pt="Tarefas agendadas e jobs em segundo plano" en="Scheduled tasks and background jobs" /></h3>
        <p><T pt={<>O Odysseus pode rodar tarefas agendadas de agente e jobs em segundo plano (um bloco <code>bash</code> que começa com <code>#!bg</code> vira um job destacado, com estado em <code>data/bg_jobs/</code>). Isso é o que faz um agente “trabalhar sozinho”, e também o que tira a pessoa do laço. A ação <code>run_script</code> usa o host em <code>ODYSSEUS_SCRIPT_HOST</code> (padrão: o próprio host do app). Para autonomia segura, combine três coisas: contas sem shell, o portão de aprovação ligado e a rede isolada, de modo que a pior tarefa agendada ainda não tenha para onde mandar dados.</>} en={<>Odysseus can run scheduled agent tasks and background jobs (a <code>bash</code> block that starts with <code>#!bg</code> becomes a detached job, with state in <code>data/bg_jobs/</code>). That is what makes an agent “work on its own”, and also what takes the person out of the loop. The <code>run_script</code> action uses the host in <code>ODYSSEUS_SCRIPT_HOST</code> (default: the app's own host). For safe autonomy, combine three things: accounts without shell, the approval gate on and the isolated network, so that even the worst scheduled task has nowhere to send data.</>} /></p>
      </Section>
      <Section id="lab" title={<T pt="Praticar na sua máquina" en="Practise on your machine" />}>
        <p><T pt={<>Pré-requisitos: Docker com Compose v2.24 ou mais (para os marcadores <code>!reset</code> e <code>!override</code>; testei com o Compose v5) e uns 15 GB livres: as imagens medidas foram 3,7 GB (app), 826 MB (Chroma), 383 MB (SearXNG), 123 MB (ntfy) e 8,5 GB (a imagem do Ollama, que já vem com CUDA). <strong>Cada atividade diz se eu a executei.</strong> As executadas têm a saída real; as outras trazem o resultado esperado <em>segundo o código</em> e valem como roteiro para você conferir.</>} en={<>Prerequisites: Docker with Compose v2.24 or newer (for the <code>!reset</code> and <code>!override</code> markers; I tested on Compose v5) and about 15 GB free: the measured images were 3.7 GB (app), 826 MB (Chroma), 383 MB (SearXNG), 123 MB (ntfy) and 8.5 GB (the Ollama image, which ships with CUDA). <strong>Each activity says whether I ran it.</strong> The ones I ran show real output; the others give the expected result <em>according to the code</em> and serve as a script for you to check.</>} /></p>
        <Table
          head={["#", <T pt="Atividade" en="Activity" />, <T pt="Executei?" en="Did I run it?" />]}
          rows={[
            ["0", <T pt="Montar a pasta do laboratório" en="Set up the lab folder" />, <T pt="Sim" en="Yes" />],
            ["1", <T pt="Baixar os modelos para um volume" en="Download the models into a volume" />, <T pt="Sim" en="Yes" />],
            ["2", <T pt="Validar a fusão dos arquivos do Compose" en="Validate the Compose file merge" />, <T pt="Sim" en="Yes" />],
            ["3", <T pt="Provar a rede isolada com um contêiner qualquer" en="Prove the isolated network with any container" />, <T pt="Sim" en="Yes" />],
            ["4", <T pt="Subir o Odysseus isolado e entrar" en="Start the isolated Odysseus and sign in" />, <T pt="Não" en="No" />],
            ["5", <T pt="Conversar pela API com um token" en="Chat through the API with a token" />, <T pt="Não" en="No" />],
            ["6", <T pt="Um token com escopo mínimo" en="A minimal-scope token" />, <T pt="Não" en="No" />],
            ["7", <T pt="Capturar o que o app tenta alcançar" en="Capture what the app tries to reach" />, <T pt="Não" en="No" />],
            ["8", <T pt="Auditar o código" en="Audit the code" />, <T pt="Sim" en="Yes" />],
            ["9", <T pt="Limpar" en="Clean up" />, "—"],
          ]}
        />
        <h3><T pt="Atividade 0: montar a pasta do laboratório (executada)" en="Activity 0: set up the lab folder (run)" /></h3>
        <CodeBlock code={`git clone --depth 1 https://github.com/odysseus-dev/odysseus.git src
mkdir -p lab/config/searxng lab/scripts && cd lab
cp ../src/docker-compose.yml .
cp ../src/config/searxng/settings.yml config/searxng/
cp ../src/scripts/migrate_searxng_settings.py scripts/
# crie aqui: compose.private.yml e nginx.conf (os da seção de isolamento)
printf 'COMPOSE_PROJECT_NAME=odylab\\nAPP_PORT=7011\\n' > .env`} />
        <p><T pt={<>O projeto <code>odylab</code> dá nome aos volumes e redes (<code>odylab_ollama-data</code>, <code>odylab_backend</code>). Leia os arquivos que você copiou antes de subir qualquer coisa: é código de terceiros.</>} en={<>The <code>odylab</code> project names the volumes and networks (<code>odylab_ollama-data</code>, <code>odylab_backend</code>). Read the files you copied before starting anything: it is third-party code.</>} /></p>
        <h3><T pt="Atividade 1: baixar os modelos para um volume (executada)" en="Activity 1: download the models into a volume (run)" /></h3>
        <CodeBlock code={`docker volume create odylab_ollama-data
docker run -d --name ollama-prep -v odylab_ollama-data:/root/.ollama ollama/ollama
docker exec ollama-prep ollama pull qwen2.5:0.5b     # modelo de chat minúsculo (397 MB)
docker exec ollama-prep ollama pull all-minilm       # embeddings (45 MB)
docker exec ollama-prep ollama list
# NAME                 ID              SIZE
# all-minilm:latest    1b226e2802db    45 MB
# qwen2.5:0.5b         a8b0c5157701    397 MB
docker rm -f ollama-prep`} />
        <p><T pt={<><strong>O que isso mostra:</strong> o contêiner temporário está na rede padrão, com internet, e só existe para encher o volume. Depois o Ollama do stack isolado monta o mesmo volume e <em>nunca precisa de internet</em>. É o padrão “baixe, depois corte a rede”.</>} en={<><strong>What this shows:</strong> the temporary container is on the default network, with internet, and exists only to fill the volume. Afterwards the isolated stack's Ollama mounts the same volume and <em>never needs the internet</em>. It is the “download, then cut the network” pattern.</>} /></p>
        <h3><T pt="Atividade 2: validar a fusão dos arquivos do Compose (executada)" en="Activity 2: validate the Compose file merge (run)" /></h3>
        <CodeBlock code={`export ODYSSEUS_TTS_CACHE_MAX_BYTES=524288000   # o Compose do projeto lê essa variável sem padrão
docker compose -f docker-compose.yml -f compose.private.yml config \\
 | python3 -c "
import sys,yaml
d=yaml.safe_load(sys.stdin)
for n,s in d['services'].items():
    print(n, 'ports=',[(p.get('host_ip'),p.get('published'),p['target']) for p in s.get('ports',[])], 'networks=',list(s.get('networks',{})))
print(d['networks'])"
# chromadb ports= [] networks= ['backend']
# ntfy ports= [] networks= ['backend']
# odysseus ports= [] networks= ['backend']
# ollama ports= [] networks= ['backend']
# proxy ports= [('127.0.0.1', '7011', 80)] networks= ['backend', 'frontend']
# searxng ports= [] networks= ['backend']
# {'backend': {'name': 'odylab_backend', 'internal': True}, 'frontend': {'name': 'odylab_frontend'}}`} />
        <p><T pt={<><strong>Resultado:</strong> o <code>config</code> só <em>lê e funde</em> os arquivos, sem iniciar nada. Ele mostra o que importa: uma única porta publicada (a do proxy, em <code>127.0.0.1</code>) e todos os serviços na rede interna. Se aparecer porta em outro serviço, o overlay não está agindo.</>} en={<><strong>Result:</strong> <code>config</code> only <em>reads and merges</em> the files, starting nothing. It shows what matters: a single published port (the proxy's, on <code>127.0.0.1</code>) and every service on the internal network. If a port shows on another service, the overlay is not taking effect.</>} /></p>
        <h3><T pt="Atividade 3: provar a rede isolada com um contêiner qualquer (executada)" en="Activity 3: prove the isolated network with any container (run)" /></h3>
        <CodeBlock code={`docker network create --internal t-int ; docker network create t-front

# (a) só na rede interna: -p não publica nada
docker run -d --name t-only --network t-int -p 127.0.0.1:18081:80 nginx:alpine
curl -s -o /dev/null -m 3 -w "%{http_code}\\n" http://127.0.0.1:18081/      # 000

# (b) proxy nas duas redes, app só na interna
docker run -d --name t-app   --network t-int nginx:alpine
docker run -d --name t-proxy --network t-int -p 127.0.0.1:18082:80 nginx:alpine
docker network connect t-front t-proxy
# (configure o proxy_pass para t-app, como no nginx.conf do overlay)
curl -s -o /dev/null -w "via proxy: %{http_code}\\n" http://127.0.0.1:18082/ # 200

# (c) quem tem saída
docker exec t-app   wget -q -T3 -O- http://example.com   # wget: bad address 'example.com'
docker exec t-proxy wget -q -T4 -O- http://example.com   # <!doctype html>...

docker rm -f t-only t-app t-proxy ; docker network rm t-int t-front`} />
        <p><T pt={<><strong>Resultado real:</strong> <code>000</code> no caso (a), <code>200</code> pelo proxy e “bad address” no app, enquanto o proxy alcançou a internet. É a mesma topologia do overlay, com contêineres que você pode confiar.</>} en={<><strong>Real result:</strong> <code>000</code> in case (a), <code>200</code> through the proxy and “bad address” on the app, while the proxy reached the internet. It is the same topology as the overlay, with containers you can trust.</>} /></p>
        <h3><T pt="Atividade 4: subir o Odysseus isolado e entrar (não executada)" en="Activity 4: start the isolated Odysseus and sign in (not run)" /></h3>
        <CodeBlock code={`docker compose -f docker-compose.yml -f compose.private.yml up -d
docker compose -f docker-compose.yml -f compose.private.yml ps
docker compose -f docker-compose.yml -f compose.private.yml logs odysseus | grep -i password
# abra http://localhost:7011 e entre como admin com a senha do log`} />
        <p><T pt={<><strong>Esperado:</strong> o app depende do SearXNG saudável (<code>depends_on: service_healthy</code>) e do Chroma; o SearXNG tem healthcheck local, então deve ficar saudável mesmo sem internet. Em <em>Settings</em>, cadastre o endpoint <code>http://ollama:11434/v1</code> e escolha <code>qwen2.5:0.5b</code>. Se o endpoint não aparecer sozinho, é o passo 2 da seção da API. <strong>Troque a senha inicial e ligue o 2FA.</strong></>} en={<><strong>Expected:</strong> the app depends on a healthy SearXNG (<code>depends_on: service_healthy</code>) and on Chroma; SearXNG has a local healthcheck, so it should become healthy even with no internet. In <em>Settings</em>, register the endpoint <code>http://ollama:11434/v1</code> and pick <code>qwen2.5:0.5b</code>. If the endpoint does not show up by itself, that is step 2 of the API section. <strong>Change the initial password and turn on 2FA.</strong></>} /></p>
        <h3><T pt="Atividade 5: conversar pela API com um token (não executada)" en="Activity 5: chat through the API with a token (not run)" /></h3>
        <p><T pt={<>Faça os quatro <code>curl</code> da seção “Pela API”. <strong>Esperado:</strong> o passo 3 devolve um <code>ody_…</code> uma única vez; o passo 4 devolve <code>&#123;"response": …, "session_id": …, "model": "qwen2.5:0.5b"&#125;</code>, com a resposta de um modelo que roda no seu volume, sem nenhuma saída de rede. Repita o passo 4 sem o cabeçalho <code>Authorization</code> e confirme o <code>401</code>, e com um token <em>sem</em> o escopo <code>chat</code> e confirme o <code>403</code>.</>} en={<>Run the four <code>curl</code> calls in the “Through the API” section. <strong>Expected:</strong> step 3 returns an <code>ody_…</code> once; step 4 returns <code>&#123;"response": …, "session_id": …, "model": "qwen2.5:0.5b"&#125;</code>, with the answer from a model running in your volume, with no network egress. Repeat step 4 without the <code>Authorization</code> header and confirm <code>401</code>, and with a token <em>without</em> the <code>chat</code> scope and confirm <code>403</code>.</>} /></p>
        <h3><T pt="Atividade 6: um token com escopo mínimo (não executada)" en="Activity 6: a minimal-scope token (not run)" /></h3>
        <CodeBlock code={`curl -s -b cookies.txt -X POST $BASE/api/tokens -d 'name=so-todos' -d 'scopes=todos:read'
export ODY_READ=ody_...
curl -s -H "Authorization: Bearer $ODY_READ" $BASE/api/codex/capabilities
curl -s -H "Authorization: Bearer $ODY_READ" $BASE/api/codex/todos            # permitido
curl -s -o /dev/null -w "%{http_code}\\n" -H "Authorization: Bearer $ODY_READ" \\
  "$BASE/api/codex/emails?folder=INBOX&limit=5"                               # esperado: 403
`} />
        <p><T pt={<><strong>Esperado:</strong> as duas primeiras respondem, a terceira devolve <code>403</code> (o token não tem <code>email:read</code>). Depois acrescente <code>email:read</code> com <code>PATCH /api/tokens/&#123;id&#125;</code> e veja o <code>403</code> sumir. É o ciclo “comece com o mínimo e conceda sob demanda”.</>} en={<><strong>Expected:</strong> the first two answer, the third returns <code>403</code> (the token lacks <code>email:read</code>). Then add <code>email:read</code> with <code>PATCH /api/tokens/&#123;id&#125;</code> and watch the <code>403</code> go away. It is the “start with the minimum and grant on demand” cycle.</>} /></p>
        <h3><T pt="Atividade 7: capturar o que o app tenta alcançar (não executada)" en="Activity 7: capture what the app tries to reach (not run)" /></h3>
        <CodeBlock code={`docker pull nicolaka/netshoot          # antes: o contêiner do passo seguinte compartilha a rede do alvo

# anexa um capturador ao namespace de rede do contêiner do app e lista DNS e novas conexões
docker run --rm --net container:odylab-odysseus-1 --cap-add NET_RAW nicolaka/netshoot \\
  tcpdump -ni any -c 300 'udp port 53 or (tcp[tcpflags] & tcp-syn != 0 and not dst net 172.16.0.0/12)'
`} />
        <p><T pt={<><strong>Esperado:</strong> no stack isolado, o app só tenta alcançar nomes da rede interna (<code>ollama</code>, <code>chromadb</code>, <code>searxng</code>) e as tentativas externas aparecem como consultas DNS sem resposta. Rode o mesmo comando no <em>Compose padrão do projeto</em> (sem o overlay) e anote cada nome externo que aparecer em repouso e durante um chat com o modelo local: é a sua medição da telemetria e das saídas “escondidas”, que a leitura de código só sugere (a lista de hosts da tabela de saída é o que você deve esperar ver, ou não ver).</>} en={<><strong>Expected:</strong> on the isolated stack, the app only tries to reach internal-network names (<code>ollama</code>, <code>chromadb</code>, <code>searxng</code>) and external attempts show up as unanswered DNS queries. Run the same command on the <em>project's default Compose</em> (without the overlay) and note every external name that appears at idle and during a chat with the local model: that is your measurement of telemetry and “hidden” exits, which code reading only suggests (the host list in the egress table is what you should expect to see, or not see).</>} /></p>
        <h3><T pt="Atividade 8: auditar o código (executada)" en="Activity 8: audit the code (run)" /></h3>
        <p><T pt={<>Rode os três <code>grep</code> da seção do mapa de saída no clone. <strong>Resultado real que obtive:</strong> nenhum cliente de analytics; o <code>ANONYMIZED_TELEMETRY=FALSE</code> do Chroma nos três Compose; e a lista de hosts externos com, no topo, <code>huggingface.co</code> (14 menções), <code>www.youtube.com</code> (12), <code>github.com</code> (12), <code>ollama.com</code> (8), <code>chatgpt.com</code> (7) e os provedores de API, além de <code>api.open-meteo.com</code> e <code>cdn.jsdelivr.net</code>. Cada um corresponde a uma linha da tabela. Pergunte-se de novo, para cada um: <em>eu uso essa função?</em></>} en={<>Run the three <code>grep</code> commands from the egress map section on the clone. <strong>The real result I got:</strong> no analytics client; Chroma's <code>ANONYMIZED_TELEMETRY=FALSE</code> in all three Compose files; and the list of external hosts with, at the top, <code>huggingface.co</code> (14 mentions), <code>www.youtube.com</code> (12), <code>github.com</code> (12), <code>ollama.com</code> (8), <code>chatgpt.com</code> (7) and the API providers, plus <code>api.open-meteo.com</code> and <code>cdn.jsdelivr.net</code>. Each one matches a row of the table. Ask yourself again, for each: <em>do I use that feature?</em></>} /></p>
        <h3><T pt="Atividade 9: limpar" en="Activity 9: clean up" /></h3>
        <CodeBlock code={`docker compose -f docker-compose.yml -f compose.private.yml down -v   # contêineres, redes e volumes do stack
docker volume rm odylab_ollama-data                                    # os modelos
docker rmi ghcr.io/odysseus-dev/odysseus:latest ollama/ollama:latest  # imagens grandes, se não vai reutilizar
rm -rf src lab                                                         # o clone e os arquivos`} />
      </Section>
      <Section id="checklist" title={<T pt="Checklist: uma IA privada de verdade" en="Checklist: a truly private AI" />}>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="Faça" en="Do" />]}
          rows={[
            [<T pt="Modelo" en="Model" />, <T pt="Só endpoints seus (Ollama, vLLM, llama.cpp). Nenhuma chave de provedor preenchida. Porta do modelo fechada ao mundo (só o app ou o túnel alcançam)." en="Only endpoints of yours (Ollama, vLLM, llama.cpp). No provider key filled in. Model port closed to the world (only the app or the tunnel reach it)." />],
            [<T pt="Rede" en="Network" />, <T pt={<>Serviços em rede <code>internal</code>; um proxy como única porta; <code>APP_BIND=127.0.0.1</code>; acesso por SSH, Tailscale ou Cloudflare Access; na nuvem, saída negada por padrão no security group.</>} en={<>Services on an <code>internal</code> network; one proxy as the only port; <code>APP_BIND=127.0.0.1</code>; access through SSH, Tailscale or Cloudflare Access; in the cloud, outbound denied by default on the security group.</>} />],
            [<T pt="Funções com saída" en="Features with egress" />, <T pt="Liste as que você usa (busca, e-mail, clima, downloads) e dê saída só a elas, uma a uma. O resto fica fechado." en="List the ones you use (search, email, weather, downloads) and give egress to those only, one by one. The rest stays closed." />],
            [<T pt="Contas" en="Accounts" />, <T pt={<><code>AUTH_ENABLED=true</code>, <code>LOCALHOST_BYPASS=false</code>, senha inicial trocada, 2FA no admin, cadastro aberto desligado, conta comum para o trabalho diário.</>} en={<><code>AUTH_ENABLED=true</code>, <code>LOCALHOST_BYPASS=false</code>, initial password changed, 2FA on the admin, open signup off, a regular account for daily work.</>} />],
            [<T pt="Agentes" en="Agents" />, <T pt={<>Um token por integração, escopos mínimos, sem <code>email:send</code>; portão de aprovação ligado; sem overlays de host; agente externo em outro usuário ou máquina.</>} en={<>One token per integration, minimal scopes, no <code>email:send</code>; approval gate on; no host overlays; outside agent on another user or machine.</>} />],
            [<T pt="Dados" en="Data" />, <T pt={<><code>data/</code> guarda o banco, a chave de criptografia (<code>.app_key</code>) e o cofre. O snapshot do <code>odysseus-backup</code> inclui tudo isso: trate-o como senha e guarde-o cifrado. Deixe <code>ODYSSEUS_CAPTURE_MODEL_REQUESTS=0</code> (o padrão do Compose), para o app não gravar os pedidos ao modelo.</>} en={<><code>data/</code> holds the database, the encryption key (<code>.app_key</code>) and the vault. The <code>odysseus-backup</code> snapshot includes all of it: treat it like a password and store it encrypted. Keep <code>ODYSSEUS_CAPTURE_MODEL_REQUESTS=0</code> (the Compose default) so the app does not record the requests to the model.</>} />],
            [<T pt="Versão" en="Version" />, <T pt={<>Tag imutável da imagem (<code>X.Y.Z-&lt;sha&gt;</code>), digests nos outros serviços, <code>requirements</code> sem versão fixa só em instalação nativa (use <code>uv pip compile</code> para travar). Leia o histórico antes de atualizar: o ramo <code>dev</code> muda todo dia. Teste a restauração do backup uma vez.</>} en={<>Immutable image tag (<code>X.Y.Z-&lt;sha&gt;</code>), digests on the other services, unpinned <code>requirements</code> only on native installs (use <code>uv pip compile</code> to lock). Read the history before upgrading: the <code>dev</code> branch changes every day. Test restoring the backup once.</>} />],
          ]}
        />
        <h3><T pt="Quando não usar" en="When not to use it" /></h3>
        <ul className="ds-list">
          <li><T pt="Se você precisa de um produto estável, com suporte e SLA, e não de software em evolução rápida." en="If you need a stable, supported product with an SLA, not fast-moving software." /></li>
          <li><T pt="Se o servidor tem que ficar aberto à internet, para pessoas que você não controla: o projeto diz, com todas as letras, que não foi feito para isso." en="If the server must be open to the internet, for people you do not control: the project says outright that it was not built for that." /></li>
          <li><T pt="Se você precisa de confinamento forte do agente com shell: o projeto admite que não há sandbox. Use uma VM descartável ou desligue o shell." en="If you need strong confinement of a shell-enabled agent: the project admits there is no sandbox. Use a disposable VM or turn the shell off." /></li>
          <li><T pt="Se o seu hardware só roda modelos pequenos demais para o modo agente: um bom chat local pode ser tudo de que você precisa, e então um front-end mais simples (por exemplo, o do próprio Ollama) é suficiente." en="If your hardware only runs models too small for agent mode: a good local chat may be all you need, and then a simpler front-end (for example, Ollama's own) is enough." /></li>
        </ul>
        <h3><T pt="Quando algo dá errado" en="When something goes wrong" /></h3>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />, <T pt="O que fazer" en="What to do" />]}
          rows={[
            [<T pt="O app não acha o Ollama do host" en="The app cannot find the host's Ollama" />, <T pt={<>O Ollama escuta só em <code>127.0.0.1</code>; de dentro do contêiner, o host é <code>host.docker.internal</code></>} en={<>Ollama listens only on <code>127.0.0.1</code>; from inside the container, the host is <code>host.docker.internal</code></>} />, <T pt={<>Suba o Ollama com <code>OLLAMA_HOST=0.0.0.0:11434</code> e feche a porta no firewall; ou rode o Ollama como serviço do próprio Compose (como no overlay)</>} en={<>Start Ollama with <code>OLLAMA_HOST=0.0.0.0:11434</code> and close the port in the firewall; or run Ollama as a service in the same Compose (as in the overlay)</>} />],
            [<T pt="O app não sobe e fica esperando" en="The app does not start and keeps waiting" />, <T pt={<>O SearXNG não ficou saudável (o app depende dele); o Compose do projeto já teve uma imagem <code>latest</code> quebrada por isso</>} en={<>SearXNG did not become healthy (the app depends on it); the project's Compose once had a broken <code>latest</code> image because of this</>} />, <><code>docker compose logs searxng</code>; <T pt="use os digests fixados do Compose" en="use the Compose's pinned digests" /></>],
            [<T pt="Login falha ou volta ao formulário atrás de proxy" en="Login fails or returns to the form behind a proxy" />, <T pt={<><code>ALLOWED_ORIGINS</code> não inclui a origem do navegador, ou o cookie <code>Secure</code> não combina com o esquema que o app enxerga</>} en={<><code>ALLOWED_ORIGINS</code> does not include the browser's origin, or the <code>Secure</code> cookie does not match the scheme the app sees</>} />, <T pt={<>Liste a origem exata em <code>ALLOWED_ORIGINS</code>; ajuste <code>SECURE_COOKIES</code> só se o proxy esconde o HTTPS</>} en={<>List the exact origin in <code>ALLOWED_ORIGINS</code>; adjust <code>SECURE_COOKIES</code> only if the proxy hides the HTTPS</>} />],
            [<>403 <T pt="de um agente externo" en="from an outside agent" /></>, <T pt="O escopo do token não cobre a ferramenta (é o comportamento esperado)" en="The token scope does not cover the tool (the expected behaviour)" />, <T pt={<>Confira <code>/api/codex/capabilities</code>; conceda o escopo mínimo necessário, nunca contorne</>} en={<>Check <code>/api/codex/capabilities</code>; grant the minimum scope needed, never work around it</>} />],
            [<T pt="O agente “pede aprovação” o tempo todo" en="The agent “asks for approval” all the time" />, <T pt="O portão depois de conteúdo externo está agindo, e a conversa tem busca ou páginas" en="The post-external-content gate is working, and the conversation has search or pages" />, <T pt="Restrinja as ferramentas do turno em vez de desligar o portão" en="Restrict the turn's tools instead of turning the gate off" />],
            [<T pt="Resposta ruim ou agente “perdido”" en="Poor answers or a “lost” agent" />, <T pt="Modelo pequeno demais; contexto consumido pelos esquemas de ferramentas" en="Model too small; context eaten by tool schemas" />, <T pt="Modelo maior, menos ferramentas por turno, janela de contexto maior" en="Larger model, fewer tools per turn, larger context window" />],
          ]}
        />
      </Section>
      <Section id="cheat-pw" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Assunto" en="Topic" />, <T pt="Regra" en="Rule" />]}
          rows={[
            [<T pt="“Não envia dados”" en="“Does not send data”" />, <T pt={<>Quatro caminhos: inferência, ferramentas, telemetria e operação. Liste cada um por função e deixe a <strong>rede</strong> impedir o resto.</>} en={<>Four paths: inference, tools, telemetry and operations. List each per feature and let the <strong>network</strong> block the rest.</>} />],
            ["Odysseus", <T pt="Workspace em volta do modelo: app + Chroma + SearXNG + ntfy; modelo é um endpoint à parte; AGPL-3.0; jovem e rápido; “console de admin”, não para a internet." en="Workspace around the model: app + Chroma + SearXNG + ntfy; the model is a separate endpoint; AGPL-3.0; young and fast; an “admin console”, not for the internet." />],
            [<T pt="Onde rodar" en="Where to run" />, <T pt="App leve, modelo pesado: separe. Notebook, VPS + GPU sob demanda, ou VM com GPU. Modelo sem porta pública." en="Light app, heavy model: split them. Laptop, VPS + on-demand GPU, or a GPU VM. Model with no public port." />],
            [<T pt="Saídas" en="Exits" />, <T pt="Provedor de modelo, busca, clima, emoji (CDN), Cookbook, skills, e-mail, webhooks. Telemetria: não encontrada no código (confirme por captura)." en="Model provider, search, weather, emoji (CDN), Cookbook, skills, email, webhooks. Telemetry: not found in the code (confirm by capture)." />],
            [<T pt="Isolamento" en="Isolation" />, <T pt={<><code>internal: true</code> + proxy nas duas redes; <code>!reset</code>/<code>!override</code> no overlay; baixe os pesos antes; o proxy tem saída.</>} en={<><code>internal: true</code> + proxy on both networks; <code>!reset</code>/<code>!override</code> in the overlay; download weights first; the proxy has egress.</>} />],
            [<T pt="Acesso" en="Access" />, <T pt={<>Loopback + túnel SSH, Tailscale ou Cloudflare Access; HTTPS na frente; app de celular por pareamento (LAN/Tailscale); scripts por token <code>chat</code> + <code>POST /api/v1/chat</code>.</>} en={<>Loopback + SSH tunnel, Tailscale or Cloudflare Access; HTTPS in front; phone app by pairing (LAN/Tailscale); scripts by <code>chat</code> token + <code>POST /api/v1/chat</code>.</>} />],
            [<T pt="Agentes" en="Agents" />, <T pt={<>Papéis (admin × comum), contrato do turno, token com escopo (<code>ody_</code>, bcrypt, <code>403</code> intencional), portão pós-conteúdo-externo, overlays de host só por opt-in.</>} en={<>Roles (admin × regular), turn contract, scoped token (<code>ody_</code>, bcrypt, intentional <code>403</code>), post-external-content gate, host overlays opt-in only.</>} />],
            [<T pt="Limite honesto" en="Honest limit" />, <T pt="Escopo protege a API, não o disco. Sem sandbox de shell. A rede é a garantia final." en="A scope protects the API, not the disk. No shell sandbox. The network is the final guarantee." />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Quais são os quatro caminhos pelos quais dados saem de um workspace de IA? Em qual deles “rodar local” ajuda e em quais não?" en="What are the four paths through which data leaves an AI workspace? In which does “running locally” help and in which does it not?" /></li>
          <li><T pt="Por que o Odysseus é dividido em app e modelo, e como isso muda onde cada um pode rodar (notebook, VPS, GPU na nuvem)?" en="Why is Odysseus split into app and model, and how does that change where each can run (laptop, VPS, cloud GPU)?" /></li>
          <li><T pt="Cite três saídas de rede do Odysseus que um “modo local” de modelo não elimina. Como cada uma é contida?" en="Name three network exits of Odysseus that a local-model setup does not eliminate. How is each contained?" /></li>
          <li><T pt="Por que a busca na web, mesmo com um SearXNG seu, pode ser um canal de vazamento controlado pelo modelo?" en="Why can web search, even with a SearXNG of your own, be a model-controlled leak channel?" /></li>
          <li><T pt={<>Por que um contêiner só numa rede <code>internal</code> não publica porta, e como o proxy nas duas redes resolve? O que o proxy continua podendo fazer?</>} en={<>Why does a container only on an <code>internal</code> network not publish a port, and how does a proxy on both networks solve it? What can the proxy still do?</>} /></li>
          <li><T pt="Descreva as sete camadas de autoridade. Quais são as duas específicas de agentes e o que cada uma impede?" en="Describe the seven layers of authority. Which two are specific to agents and what does each prevent?" /></li>
          <li><T pt="O que o portão “depois de conteúdo externo” bloqueia e por que isso responde à “trifeta letal”? Por que não desligá-lo?" en="What does the “after external content” gate block and why does that answer the “lethal trifecta”? Why not turn it off?" /></li>
          <li><T pt={<>Um token tem escopo <code>todos:read</code>. O que o servidor faz se o agente tentar ler e-mail? E se o agente roda na mesma máquina e lê <code>data/</code> direto?</>} en={<>A token has the <code>todos:read</code> scope. What does the server do if the agent tries to read email? And if the agent runs on the same machine and reads <code>data/</code> directly?</>} /></li>
          <li><T pt="Por que a nota diz que “sem telemetria” no README é uma afirmação sobre o código e a rede é uma garantia? Como você mediria o tráfego real?" en="Why does the note say “no telemetry” in the README is a statement about the code while the network is a guarantee? How would you measure the real traffic?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://github.com/odysseus-dev/odysseus" rel="noopener">odysseus-dev/odysseus</a>: <code>README.md</code>, <code>docker-compose.yml</code>, <code>.env.example</code>, <code>THREAT_MODEL.md</code>, <code>SECURITY.md</code>, <code>ROADMAP.md</code>, <code>specs/auth-security.md</code>, <code>specs/shell-mcp.md</code>, <code>docs/AGENT_TURN_CONTRACT.md</code>, <code>integrations/claude/README.md</code>, <code>routes/api_token_routes.py</code>, <code>src/tool_capabilities.py</code>, <code>src/tool_security.py</code> (commit 0f996f5, 2026-10-29)</li>
          <li><a href="https://github.com/odysseus-dev/odysseus/blob/dev/website/setup.md" rel="noopener">Odysseus setup guide</a> · <a href="https://github.com/odysseus-dev/odysseus/blob/dev/website/backup-restore.md" rel="noopener">Backup &amp; restore</a> · <a href="https://github.com/odysseus-dev/odysseus/blob/dev/website/security-ci.md" rel="noopener">Security CI guide</a></li>
          <li><a href="https://docs.docker.com/reference/compose-file/networks/" rel="noopener">Docker Compose: networks (<code>internal</code>)</a> · <a href="https://docs.docker.com/reference/compose-file/merge/" rel="noopener">Compose merge and override (<code>!reset</code>, <code>!override</code>)</a> · <a href="https://docs.docker.com/engine/network/drivers/bridge/" rel="noopener">Bridge networks</a></li>
          <li><a href="https://github.com/ollama/ollama/blob/main/docs/faq.md" rel="noopener">Ollama FAQ (<code>OLLAMA_HOST</code>)</a> · <a href="https://docs.searxng.org/" rel="noopener">SearXNG documentation</a> · <a href="https://ntfy.sh/docs/" rel="noopener">ntfy documentation</a></li>
          <li><a href="https://tailscale.com/kb/" rel="noopener">Tailscale knowledge base</a> · <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/" rel="noopener">Cloudflare Access</a> · <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" rel="noopener">OWASP Top 10 for LLM Applications</a> (prompt injection, excessive agency)</li>
        </ul>
      </Sources>
    </>
  );
}
