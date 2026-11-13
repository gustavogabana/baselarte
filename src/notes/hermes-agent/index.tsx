import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "hermes-agent",
  title: { en: "Hermes Agent: an agent running 24/7", pt: "Hermes Agent: um agente rodando 24/7" },
  seo: {
    title: { en: "Hermes Agent: memory, skills, messaging apps, guardrails and running it 24/7", pt: "Hermes Agent: memória, skills, apps de mensagem, guardrails e como deixá-lo rodando 24/7" },
    description: { en: "What Nous Research's Hermes Agent is and how it works: memory, self-created skills, Telegram, WhatsApp and Signal integration, guardrails, installation, supported LLMs and how to keep it running 24/7 on a Hostinger or AWS server.", pt: "O que é o Hermes Agent da Nous Research e como funciona: memória, skills criadas por ele mesmo, integração com Telegram, WhatsApp e Signal, guardrails, instalação, LLMs suportados e como mantê-lo rodando 24/7 num servidor da Hostinger ou da AWS." },
  },
  summary: "what Nous Research's open-source Hermes Agent is, its agent loop, three-layer memory (MEMORY.md, USER.md, FTS5 session search, external providers), self-created skills (SKILL.md, skill_manage), the messaging gateway (Telegram, WhatsApp, Signal and others, DM pairing), its guardrails (command approval, blocklist, container isolation, prompt-injection scanning), installation, supported LLM providers and a Docker Compose setup to keep it running 24/7 on Hostinger or AWS.",
  kicker: { en: "AI engineering", pt: "Engenharia de IA" },
  heroTitle: { en: <>Hermes Agent: <em>an agent that remembers, learns skills and answers you on WhatsApp, 24/7.</em></>, pt: <>Hermes Agent: <em>um agente que lembra, aprende skills e responde a você no WhatsApp, 24/7.</em></> },
  heroLede: { en: "What it is and how it works, its memory, how it creates skills, how it plugs into Telegram, WhatsApp and Signal, its guardrails, how to install it, which models it supports and how to leave it running on a Hostinger or AWS server.", pt: "O que é e como funciona, a memória, como ele cria skills, como se liga ao Telegram, WhatsApp e Signal, os guardrails, como instalar, quais modelos suporta e como deixá-lo rodando num servidor da Hostinger ou da AWS." },
  published: "2026-10-27",
  updated: "2026-10-27",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é" en="What it is" /> },
        { id: "how", title: <T pt="1. Como funciona por dentro" en="1. How it works inside" /> },
        { id: "memory", title: <T pt="2. Memória" en="2. Memory" /> },
        { id: "skills", title: <T pt="3. Skills que ele mesmo cria" en="3. Skills it creates itself" /> },
        { id: "gateway", title: <T pt="4. Telegram, WhatsApp, Signal e o resto" en="4. Telegram, WhatsApp, Signal and the rest" /> },
        { id: "guardrails", title: <T pt="5. Guardrails" en="5. Guardrails" /> },
        { id: "install", title: <T pt="6. Instalar e escolher o modelo" en="6. Installing and choosing the model" /> },
        { id: "server", title: <T pt="7. Deixar rodando 24/7 (Hostinger ou AWS)" en="7. Running 24/7 (Hostinger or AWS)" /> },
        { id: "cheat", title: <T pt="8. Checklist" en="8. Checklist" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é" en="What it is" />}>
        <p><T pt={<><b>Hermes Agent</b> é um agente de IA open-source (licença MIT) da <b>Nous Research</b>, que o descreve como "o agente que se melhora sozinho". Na prática é um programa que você instala, aponta para um modelo de linguagem (LLM) e conversa com ele pelo terminal <b>ou pelo celular</b>, via Telegram, WhatsApp, Signal e outros. Ele executa comandos, edita arquivos, pesquisa na web, agenda tarefas e, o que o distingue, <b>guarda memória entre conversas e transforma o que aprendeu em skills reutilizáveis</b>.</>} en={<><b>Hermes Agent</b> is an open-source AI agent (MIT license) from <b>Nous Research</b>, which describes it as "the self-improving agent". In practice it is a program you install, point at a large language model (LLM) and talk to from the terminal <b>or from your phone</b>, via Telegram, WhatsApp, Signal and others. It runs commands, edits files, searches the web, schedules tasks and, what sets it apart, <b>keeps memory across conversations and turns what it learned into reusable skills</b>.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><b>Não confunda o agente com os modelos.</b> "Hermes" também é uma família de modelos da Nous (Hermes 3, Hermes 4). O <i>Hermes Agent</i> é o programa em volta do modelo e funciona com <b>qualquer</b> LLM que você configurar (seção 6). A nota sobre <a href="/notas/agent-harness/">harness de agentes</a> explica o que é essa camada; aqui vemos um exemplo completo dela.</>} en={<><b>Do not confuse the agent with the models.</b> "Hermes" is also a family of Nous models (Hermes 3, Hermes 4). <i>Hermes Agent</i> is the program around the model and works with <b>any</b> LLM you configure (section 6). The <a href="/notas/agent-harness/">agent harness note</a> explains what that layer is; here we see a complete example of it.</>} /></Callout>
        <Diagram minWidth={640} caption={<T pt="Os apps de mensagem falam com o gateway; o gateway chama o mesmo agente, com a mesma memória e as mesmas skills, que usa o LLM e as ferramentas." en="The messaging apps talk to the gateway; the gateway calls the same agent, with the same memory and skills, which uses the LLM and the tools." />}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Visão geral do Hermes Agent / Hermes Agent overview">
            <rect x="4" y="12" width="130" height="150" rx="6" className="ln dash" />
            <text x="14" y="28" className="mut mono pt" textAnchor="start">você</text>
            <text x="14" y="28" className="mut mono en" textAnchor="start">you</text>
            <rect x="16" y="38" width="106" height="30" rx="4" className="ln fillsoft" />
            <text x="69" y="58" className="pt" textAnchor="middle">Terminal / app</text>
            <text x="69" y="58" className="en" textAnchor="middle">Terminal / app</text>
            <rect x="16" y="76" width="106" height="30" rx="4" className="ln fillsoft" />
            <text x="69" y="96" className="pt" textAnchor="middle">Telegram</text>
            <text x="69" y="96" className="en" textAnchor="middle">Telegram</text>
            <rect x="16" y="114" width="106" height="30" rx="4" className="ln fillsoft" />
            <text x="69" y="134" className="pt" textAnchor="middle">WhatsApp, Signal...</text>
            <text x="69" y="134" className="en" textAnchor="middle">WhatsApp, Signal...</text>
            <rect x="170" y="38" width="110" height="106" rx="4" className="ln brandfill" />
            <text x="225" y="76" className="pt" textAnchor="middle">Gateway</text>
            <text x="225" y="76" className="en" textAnchor="middle">Gateway</text>
            <text x="225" y="94" className="mut pt" textAnchor="middle">um processo,</text>
            <text x="225" y="94" className="mut en" textAnchor="middle">one process,</text>
            <text x="225" y="110" className="mut pt" textAnchor="middle">vários apps</text>
            <text x="225" y="110" className="mut en" textAnchor="middle">many apps</text>
            <rect x="326" y="12" width="200" height="150" rx="6" className="ln dash" />
            <text x="336" y="28" className="mut mono" textAnchor="start">AIAgent</text>
            <rect x="340" y="38" width="172" height="34" rx="4" className="ln brandfill" />
            <text x="426" y="60" className="pt" textAnchor="middle">Loop do agente</text>
            <text x="426" y="60" className="en" textAnchor="middle">Agent loop</text>
            <rect x="340" y="80" width="80" height="34" rx="4" className="ln fillsoft" />
            <text x="380" y="102" className="pt" textAnchor="middle">Memória</text>
            <text x="380" y="102" className="en" textAnchor="middle">Memory</text>
            <rect x="432" y="80" width="80" height="34" rx="4" className="ln fillsoft" />
            <text x="472" y="102" className="pt" textAnchor="middle">Skills</text>
            <text x="472" y="102" className="en" textAnchor="middle">Skills</text>
            <rect x="340" y="122" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="380" y="142" className="pt" textAnchor="middle">Cron</text>
            <text x="380" y="142" className="en" textAnchor="middle">Cron</text>
            <rect x="432" y="122" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="472" y="142" className="pt" textAnchor="middle">Subagentes</text>
            <text x="472" y="142" className="en" textAnchor="middle">Subagents</text>
            <rect x="566" y="38" width="130" height="50" rx="4" className="ln fillsoft" />
            <text x="631" y="60" className="pt" textAnchor="middle">LLM</text>
            <text x="631" y="60" className="en" textAnchor="middle">LLM</text>
            <text x="631" y="77" className="mut pt" textAnchor="middle">nuvem ou local</text>
            <text x="631" y="77" className="mut en" textAnchor="middle">cloud or local</text>
            <rect x="566" y="100" width="130" height="62" rx="4" className="ln fillsoft" />
            <text x="631" y="122" className="pt" textAnchor="middle">Ferramentas</text>
            <text x="631" y="122" className="en" textAnchor="middle">Tools</text>
            <text x="631" y="140" className="mut pt" textAnchor="middle">terminal, web, MCP</text>
            <text x="631" y="140" className="mut en" textAnchor="middle">terminal, web, MCP</text>
            <path d="M122 91L170 91" className="ln" />
            <path d="M280 91L326 91" className="ln" />
            <path d="M526 63L566 63" className="ln" />
            <path d="M526 131L566 131" className="ln" />
            <path d="M319 91L326 88M319 91L326 94" className="ln" />
            <path d="M559 63L566 60M559 63L566 66" className="ln" />
            <path d="M559 131L566 128M559 131L566 134" className="ln" />
            <rect x="326" y="186" width="370" height="64" rx="6" className="ln dash" />
            <text x="336" y="202" className="mut mono pt" textAnchor="start">tudo em ~/.hermes (no Docker: /opt/data)</text>
            <text x="336" y="202" className="mut mono en" textAnchor="start">all in ~/.hermes (in Docker: /opt/data)</text>
            <text x="511" y="226" className="mut mono" textAnchor="middle">config.yaml · .env · SOUL.md · memories/ · skills/ · state.db · cron/</text>
            <path d="M426 162L426 186" className="ln dash" />
            <text x="100" y="228" className="mut pt" textAnchor="middle">a mesma memória em todos os canais</text>
            <text x="100" y="228" className="mut en" textAnchor="middle">the same memory on every channel</text>
          </svg>
        </Diagram>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, sobre as fontes:</b> esta nota vem da documentação oficial (hermes-agent.nousresearch.com) e do README no GitHub, lidos em 27/10/2026, e de um tutorial da Hostinger. Eu baixei a imagem Docker oficial (4,31 GB) e vi que a primeira partida cria a estrutura de <code>~/.hermes</code> (<code>memories/</code>, <code>skills/</code>, <code>sessions/</code>, <code>cron/</code>, <code>pairing/</code>, <code>platforms/</code>, <code>SOUL.md</code>, <code>config.yaml</code>), mas <b>não rodei o agente com um modelo de verdade</b>; os comandos são os da documentação, não saídas que eu tenha visto. O projeto muda rápido; confira a página da versão que instalar.</>} en={<><b>Personal note, on sources:</b> this note comes from the official documentation (hermes-agent.nousresearch.com) and the GitHub README, read on 2026-10-27, and from a Hostinger tutorial. I pulled the official Docker image (4.31 GB) and saw that the first start creates the <code>~/.hermes</code> structure (<code>memories/</code>, <code>skills/</code>, <code>sessions/</code>, <code>cron/</code>, <code>pairing/</code>, <code>platforms/</code>, <code>SOUL.md</code>, <code>config.yaml</code>), but I <b>did not run the agent against a real model</b>; the commands are the documentation's, not outputs I have seen. The project moves fast; check the page for the version you install.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://github.com/NousResearch/hermes-agent">GitHub · NousResearch/hermes-agent (README)</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/">Hermes Agent · site oficial / official site</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="how" title={<T pt="1. Como funciona por dentro" en="1. How it works inside" />}>
        <p><T pt={<>Todas as portas de entrada (o terminal <code>cli.py</code>, o gateway <code>gateway/run.py</code>, a integração com editores, a API) acabam na mesma classe, a <code>AIAgent</code>. O coração dela é um <b>loop de agente</b>, o mesmo padrão de qualquer agente com ferramentas:</>} en={<>All entry points (the <code>cli.py</code> terminal, the <code>gateway/run.py</code> gateway, the editor integration, the API) end up in the same class, <code>AIAgent</code>. Its heart is an <b>agent loop</b>, the same pattern as any agent with tools:</>} /></p>
        <Diagram minWidth={640} caption={<T pt="Se a resposta do LLM tem uma chamada de ferramenta, o agente a executa e devolve o resultado; quando não tem, a resposta é entregue e a sessão é gravada no SQLite." en="If the LLM's reply contains a tool call, the agent runs it and returns the result; when it does not, the answer is delivered and the session is written to SQLite." />}>
          <svg viewBox="0 0 700 150" role="img" aria-label="O loop do agente / The agent loop">
            <rect x="4" y="40" width="120" height="56" rx="4" className="ln fillsoft" />
            <text x="64" y="64" className="pt" textAnchor="middle">Sua mensagem</text>
            <text x="64" y="64" className="en" textAnchor="middle">Your message</text>
            <text x="64" y="82" className="mut pt" textAnchor="middle">chat ou terminal</text>
            <text x="64" y="82" className="mut en" textAnchor="middle">chat or terminal</text>
            <rect x="160" y="40" width="130" height="56" rx="4" className="ln brandfill" />
            <text x="225" y="64" className="pt" textAnchor="middle">Monta o prompt</text>
            <text x="225" y="64" className="en" textAnchor="middle">Builds the prompt</text>
            <text x="225" y="82" className="mut pt" textAnchor="middle">SOUL + memória + skills</text>
            <text x="225" y="82" className="mut en" textAnchor="middle">SOUL + memory + skills</text>
            <rect x="326" y="40" width="110" height="56" rx="4" className="ln brandfill" />
            <text x="381" y="64" className="pt" textAnchor="middle">Chama o LLM</text>
            <text x="381" y="64" className="en" textAnchor="middle">Calls the LLM</text>
            <text x="381" y="82" className="mut pt" textAnchor="middle">decide o próximo passo</text>
            <text x="381" y="82" className="mut en" textAnchor="middle">decides the next step</text>
            <rect x="472" y="40" width="110" height="56" rx="4" className="ln fillsoft" />
            <text x="527" y="64" className="pt" textAnchor="middle">Executa a</text>
            <text x="527" y="64" className="en" textAnchor="middle">Runs the</text>
            <text x="527" y="82" className="pt" textAnchor="middle">ferramenta</text>
            <text x="527" y="82" className="en" textAnchor="middle">tool</text>
            <rect x="618" y="40" width="78" height="56" rx="4" className="ln fillsoft" />
            <text x="657" y="64" className="pt" textAnchor="middle">Resposta</text>
            <text x="657" y="64" className="en" textAnchor="middle">Answer</text>
            <text x="657" y="82" className="mut pt" textAnchor="middle">e sessão salva</text>
            <text x="657" y="82" className="mut en" textAnchor="middle">and session saved</text>
            <path d="M124 68L160 68" className="ln" />
            <path d="M290 68L326 68" className="ln" />
            <path d="M436 68L472 68" className="ln" />
            <path d="M582 68L618 68" className="ln dash" />
            <path d="M527 96L527 122L381 122L381 96" className="ln" />
            <path d="M377.5 103L381 96L384.5 103" className="ln" />
            <text x="454" y="116" className="mut mono pt" textAnchor="middle">resultado volta ao LLM; repete até terminar</text>
            <text x="454" y="116" className="mut mono en" textAnchor="middle">result goes back to the LLM; repeats until done</text>
            <text x="527" y="30" className="mut mono pt" textAnchor="middle">pede aprovação se perigoso</text>
            <text x="527" y="30" className="mut mono en" textAnchor="middle">asks approval if dangerous</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Peça" en="Piece" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<T pt="Prompt do sistema" en="System prompt" />, <T pt={<>Montado em camadas: identidade (<code>SOUL.md</code>), guia das ferramentas, memória, lista de skills, arquivos de contexto (<code>AGENTS.md</code>), data e hora, dicas da plataforma e, por último, a personalidade escolhida. As partes estáveis vêm primeiro para aproveitar o cache de prompt do provedor.</>} en={<>Built in layers: identity (<code>SOUL.md</code>), tool guidance, memory, skill list, context files (<code>AGENTS.md</code>), date and time, platform hints and, last, the chosen personality. Stable parts come first to take advantage of the provider's prompt cache.</>} />],
            [<T pt="Ferramentas" en="Tools" />, <T pt={<>Mais de 70, em cerca de 28 grupos (<i>toolsets</i>): terminal, arquivos, web, navegador, visão, geração de imagem, voz, MCP, agendamento. Cada uma se registra sozinha.</>} en={<>Over 70, in about 28 groups (<i>toolsets</i>): terminal, files, web, browser, vision, image generation, voice, MCP, scheduling. Each registers itself.</>} />],
            [<T pt="Compressão de contexto" en="Context compression" />, <T pt={<>Quando a conversa passa de um limite, um modelo auxiliar resume os turnos do meio. O modelo de resumo precisa ter janela de contexto <b>pelo menos igual</b> à do principal, senão os turnos são descartados sem resumo.</>} en={<>When the conversation passes a threshold, an auxiliary model summarizes the middle turns. The summary model needs a context window <b>at least as large</b> as the main one, or the turns are dropped without a summary.</>} />],
            [<T pt="Subagentes" en="Subagents" />, <T pt="Instâncias isoladas, com conversa e terminal próprios, para trabalho em paralelo." en="Isolated instances, with their own conversation and terminal, for parallel work." />],
            [<T pt="Agendador (cron)" en="Scheduler (cron)" />, <T pt={"Tarefas em linguagem natural (\"todo dia às 8h me mande um resumo\"). Roda dentro do gateway, que confere a cada 60 s, e entrega o resultado no app que você escolher."} en={"Tasks in natural language (\"every day at 8am send me a summary\"). Runs inside the gateway, which checks every 60 s, and delivers the result to the app you choose."} />],
            [<T pt="Backends de terminal" en="Terminal backends" />, <T pt={<>Onde os comandos rodam: <code>local</code>, <code>docker</code>, <code>ssh</code>, Modal, Daytona, Vercel Sandbox (e Singularity por plugin). Importa muito para a segurança (seção 5).</>} en={<>Where commands run: <code>local</code>, <code>docker</code>, <code>ssh</code>, Modal, Daytona, Vercel Sandbox (and Singularity by plugin). It matters a lot for security (section 5).</>} />],
          ]}
        />
        <h3><T pt="SOUL.md e AGENTS.md" en="SOUL.md and AGENTS.md" /></h3>
        <p><T pt={<>São dois arquivos de texto que você escreve. O <code>~/.hermes/SOUL.md</code> é a <b>identidade</b> do agente (tom, jeito de responder) e vale para tudo. O <code>AGENTS.md</code> traz as instruções de <b>um projeto</b> (comandos, convenções). Regra da documentação: o que deve seguir você a todo lugar vai no SOUL.md; o que pertence a um projeto, no AGENTS.md. Os dois são varridos em busca de injeção de prompt antes de entrar no prompt (seção 5).</>} en={<>They are two text files you write. <code>~/.hermes/SOUL.md</code> is the agent's <b>identity</b> (tone, way of answering) and applies everywhere. <code>AGENTS.md</code> carries the instructions of <b>one project</b> (commands, conventions). The documentation's rule: what should follow you everywhere goes in SOUL.md; what belongs to a project, in AGENTS.md. Both are scanned for prompt injection before entering the prompt (section 5).</>} /></p>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/developer-guide/architecture">Hermes docs · Architecture</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/personality">Hermes docs · Personality &amp; SOUL.md</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/configuration">Hermes docs · Configuration (compression, directory)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="memory" title={<T pt="2. Memória" en="2. Memory" />}>
        <p><T pt={<>Um LLM não lembra de nada entre chamadas; tudo o que ele "sabe" numa conversa está no prompt. A memória do Hermes é um conjunto de arquivos e um banco que ele <b>escreve e relê</b>, em três camadas:</>} en={<>An LLM remembers nothing between calls; everything it "knows" in a conversation is in the prompt. Hermes's memory is a set of files and a database that it <b>writes and rereads</b>, in three layers:</>} /></p>
        <Diagram minWidth={640} caption={<T pt={<>Duas ideias diferentes: o que o agente <i>sempre</i> sabe (camada 1) e o que ele <i>consegue consultar</i> (camadas 2 e 3).</>} en={<>Two different ideas: what the agent <i>always</i> knows (layer 1) and what it <i>can look up</i> (layers 2 and 3).</>} />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="As camadas de memória / The memory layers">
            <rect x="4" y="10" width="210" height="150" rx="6" className="ln brandfill" />
            <text x="109" y="34" className="pt" textAnchor="middle">1. Memória curada</text>
            <text x="109" y="34" className="en" textAnchor="middle">1. Curated memory</text>
            <text x="109" y="62" className="mono" textAnchor="middle">MEMORY.md</text>
            <text x="109" y="80" className="mut pt" textAnchor="middle">notas do agente · 2.200 car.</text>
            <text x="109" y="80" className="mut en" textAnchor="middle">agent notes · 2,200 chars</text>
            <text x="109" y="106" className="mono" textAnchor="middle">USER.md</text>
            <text x="109" y="124" className="mut pt" textAnchor="middle">perfil de você · 1.375 car.</text>
            <text x="109" y="124" className="mut en" textAnchor="middle">profile of you · 1,375 chars</text>
            <text x="109" y="150" className="mut pt" textAnchor="middle">sempre dentro do prompt</text>
            <text x="109" y="150" className="mut en" textAnchor="middle">always inside the prompt</text>
            <rect x="245" y="10" width="210" height="150" rx="6" className="ln fillsoft" />
            <text x="350" y="34" className="pt" textAnchor="middle">2. Histórico pesquisável</text>
            <text x="350" y="34" className="en" textAnchor="middle">2. Searchable history</text>
            <text x="350" y="68" className="mono" textAnchor="middle">~/.hermes/state.db</text>
            <text x="350" y="88" className="mut" textAnchor="middle">SQLite + FTS5</text>
            <text x="350" y="114" className="mut pt" textAnchor="middle">todas as sessões (terminal</text>
            <text x="350" y="114" className="mut en" textAnchor="middle">every session (terminal</text>
            <text x="350" y="130" className="mut pt" textAnchor="middle">e apps); o agente busca</text>
            <text x="350" y="130" className="mut en" textAnchor="middle">and apps); the agent searches</text>
            <text x="350" y="150" className="mut pt" textAnchor="middle">só quando precisa</text>
            <text x="350" y="150" className="mut en" textAnchor="middle">only when it needs to</text>
            <rect x="486" y="10" width="210" height="150" rx="6" className="ln fillsoft" />
            <text x="591" y="34" className="pt" textAnchor="middle">3. Provedores externos</text>
            <text x="591" y="34" className="en" textAnchor="middle">3. External providers</text>
            <text x="591" y="68" className="mut" textAnchor="middle">Honcho · Mem0 · Hindsight</text>
            <text x="591" y="88" className="mut" textAnchor="middle">Supermemory · RetainDB ...</text>
            <text x="591" y="114" className="mut pt" textAnchor="middle">plugins opcionais, ao lado</text>
            <text x="591" y="114" className="mut en" textAnchor="middle">optional plugins, alongside</text>
            <text x="591" y="130" className="mut pt" textAnchor="middle">das camadas 1 e 2</text>
            <text x="591" y="130" className="mut en" textAnchor="middle">layers 1 and 2</text>
            <text x="350" y="194" className="mut pt" textAnchor="middle">a camada 1 é minúscula de propósito: só cabe o que vale a pena ver em toda conversa</text>
            <text x="350" y="194" className="mut en" textAnchor="middle">layer 1 is tiny on purpose: it only holds what is worth seeing in every conversation</text>
          </svg>
        </Diagram>
        <h3><T pt="Camada 1: MEMORY.md e USER.md" en="Layer 1: MEMORY.md and USER.md" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Ficam em <code>~/.hermes/memories/</code>. O <code>MEMORY.md</code> guarda fatos do ambiente, convenções e lições (limite de 2.200 caracteres, uns 800 tokens); o <code>USER.md</code> guarda suas preferências e estilo (1.375 caracteres).</>} en={<>They live in <code>~/.hermes/memories/</code>. <code>MEMORY.md</code> holds environment facts, conventions and lessons (limit 2,200 characters, about 800 tokens); <code>USER.md</code> holds your preferences and style (1,375 characters).</>} /></li>
          <li><T pt={<>O agente escreve com a ferramenta <code>memory</code> (ações <code>add</code>, <code>patch</code> e <code>remove</code>; não há "ler", porque o conteúdo já está no prompt). Quando estoura o limite, a ferramenta devolve erro e o agente precisa reorganizar: <b>nada é apagado sozinho</b>.</>} en={<>The agent writes with the <code>memory</code> tool (actions <code>add</code>, <code>patch</code> and <code>remove</code>; there is no "read", because the content is already in the prompt). When the limit is exceeded the tool returns an error and the agent must reorganize: <b>nothing is deleted by itself</b>.</>} /></li>
          <li><T pt={<><b>Instantâneo congelado:</b> o conteúdo é carregado no prompt no começo da sessão. O que o agente escreve durante a sessão vai para o disco na hora, mas só aparece no prompt na <i>próxima</i> sessão. Isso mantém o prefixo do prompt estável e o cache do provedor funcionando.</>} en={<><b>Frozen snapshot:</b> the content is loaded into the prompt at session start. What the agent writes mid-session goes to disk immediately but only appears in the prompt in the <i>next</i> session. This keeps the prompt prefix stable and the provider's cache working.</>} /></li>
          <li><T pt={"Cada escrita é varrida em busca de padrões de injeção de prompt e exfiltração, e de caracteres Unicode invisíveis, que são bloqueados. Faz sentido: uma página web maliciosa não deve conseguir plantar uma \"lembrança\" que valha para sempre."} en={"Each write is scanned for prompt-injection and exfiltration patterns, and invisible Unicode characters, which are blocked. This makes sense: a malicious web page should not be able to plant a \"memory\" that lasts forever."} /></li>
          <li><T pt={<>Para revisar antes de gravar, ligue <code>memory.write_approval: true</code>: as escritas ficam pendentes e você usa <code>/memory pending</code>, <code>/memory approve</code> e <code>/memory reject</code>.</>} en={<>To review before saving, turn on <code>memory.write_approval: true</code>: writes stay pending and you use <code>/memory pending</code>, <code>/memory approve</code> and <code>/memory reject</code>.</>} /></li>
        </ul>
        <CodeBlock code={`# ~/.hermes/config.yaml (trecho da documentação)
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375
  write_approval: false      # true = você aprova cada escrita
skills:
  write_approval: false      # idem para skills (seção 3)`} />
        <h3><T pt="Camada 2: o histórico de sessões" en="Layer 2: session history" /></h3>
        <p><T pt={<>Toda conversa, do terminal ou de qualquer app, é gravada em <code>~/.hermes/state.db</code> (SQLite) com busca de texto <b>FTS5</b>. Quando você pergunta "o que decidimos sobre o deploy semana passada?", o agente busca ali e recebe as mensagens originais, sem resumo no meio. Você também lista as sessões com <code>hermes sessions list</code>. Como é um banco e não o prompt, ele cresce sem custo de contexto.</>} en={<>Every conversation, from the terminal or any app, is written to <code>~/.hermes/state.db</code> (SQLite) with <b>FTS5</b> full-text search. When you ask "what did we decide about the deploy last week?", the agent searches there and receives the original messages, with no summary in between. You can also list sessions with <code>hermes sessions list</code>. Because it is a database and not the prompt, it grows at no context cost.</>} /></p>
        <h3><T pt="Camada 3: provedores externos" en="Layer 3: external providers" /></h3>
        <p><T pt={<>Plugins como Honcho (que monta um modelo de você ao longo do tempo), Mem0, Hindsight e Supermemory rodam <b>ao lado</b> das camadas 1 e 2, sem substituí-las. Configure com <code>hermes memory setup</code> e veja o estado com <code>hermes memory status</code>.</>} en={<>Plugins such as Honcho (which builds a model of you over time), Mem0, Hindsight and Supermemory run <b>alongside</b> layers 1 and 2, without replacing them. Set up with <code>hermes memory setup</code> and check with <code>hermes memory status</code>.</>} /></p>
        <Callout tone="use" icon="check"><T pt={<><b>Uma memória por casa.</b> A memória é por <i>perfil</i> (<code>hermes -p work</code> usa <code>~/.hermes/profiles/work/</code>). A documentação avisa para nunca apontar dois processos do agente para o mesmo diretório do Hermes: dois gateways gravando no mesmo <code>state.db</code> é pedir problema.</>} en={<><b>One memory per home.</b> Memory is per <i>profile</i> (<code>hermes -p work</code> uses <code>~/.hermes/profiles/work/</code>). The documentation warns never to point two agent processes at the same Hermes directory: two gateways writing to the same <code>state.db</code> is asking for trouble.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/memory">Hermes docs · Persistent Memory</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="skills" title={<T pt="3. Skills que ele mesmo cria" en="3. Skills it creates itself" />}>
        <p><T pt={<>Uma <b>skill</b> é uma pasta com um arquivo <code>SKILL.md</code> (frontmatter YAML + instruções em Markdown) que ensina o agente a fazer uma tarefa. O formato segue o padrão aberto <i>agentskills.io</i>, o mesmo das <a href="/notas/agent-harness/">Agent Skills</a> da nota de harness. A diferença do Hermes é que ele <b>escreve as próprias skills</b>: o prompt do sistema pede que ele salve fluxos que valem repetir.</>} en={<>A <b>skill</b> is a folder with a <code>SKILL.md</code> file (YAML frontmatter + Markdown instructions) that teaches the agent a task. The format follows the open <i>agentskills.io</i> standard, the same as the <a href="/notas/agent-harness/">Agent Skills</a> in the harness note. What is different in Hermes is that it <b>writes its own skills</b>: the system prompt asks it to save workflows worth repeating.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="Os gatilhos listados na documentação: um fluxo de vários passos que vale repetir, um beco sem saída em que ele achou o caminho, ou uma correção sua." en="The triggers listed in the documentation: a multi-step workflow worth repeating, a dead end where it found the way, or a correction from you." />}>
          <svg viewBox="0 0 700 150" role="img" aria-label="O ciclo de uma skill / The skill cycle">
            <rect x="4" y="34" width="120" height="60" rx="4" className="ln fillsoft" />
            <text x="64" y="58" className="pt" textAnchor="middle">Tarefa difícil</text>
            <text x="64" y="58" className="en" textAnchor="middle">Hard task</text>
            <text x="64" y="76" className="mut pt" textAnchor="middle">muitos passos</text>
            <text x="64" y="76" className="mut en" textAnchor="middle">many steps</text>
            <rect x="160" y="34" width="120" height="60" rx="4" className="ln fillsoft" />
            <text x="220" y="58" className="pt" textAnchor="middle">Dá certo</text>
            <text x="220" y="58" className="en" textAnchor="middle">Works</text>
            <text x="220" y="76" className="mut pt" textAnchor="middle">ou você corrige</text>
            <text x="220" y="76" className="mut en" textAnchor="middle">or you correct it</text>
            <rect x="316" y="34" width="130" height="60" rx="4" className="ln brandfill" />
            <text x="381" y="58" className="mono" textAnchor="middle">skill_manage</text>
            <text x="381" y="76" className="mut pt" textAnchor="middle">create → SKILL.md</text>
            <text x="381" y="76" className="mut en" textAnchor="middle">create → SKILL.md</text>
            <rect x="482" y="34" width="100" height="60" rx="4" className="ln fillsoft" />
            <text x="532" y="58" className="pt" textAnchor="middle">Próxima vez</text>
            <text x="532" y="58" className="en" textAnchor="middle">Next time</text>
            <text x="532" y="76" className="mut pt" textAnchor="middle">carrega a skill</text>
            <text x="532" y="76" className="mut en" textAnchor="middle">loads the skill</text>
            <rect x="616" y="34" width="80" height="60" rx="4" className="ln brandfill" />
            <text x="656" y="58" className="mono" textAnchor="middle">patch</text>
            <text x="656" y="76" className="mut pt" textAnchor="middle">corrige em uso</text>
            <text x="656" y="76" className="mut en" textAnchor="middle">fixes in use</text>
            <path d="M124 64L160 64" className="ln" />
            <path d="M280 64L316 64" className="ln" />
            <path d="M446 64L482 64" className="ln" />
            <path d="M582 64L616 64" className="ln" />
            <path d="M656 94L656 122L381 122L381 94" className="ln dash" />
            <text x="518" y="116" className="mut mono pt" textAnchor="middle">a skill melhora a cada uso</text>
            <text x="518" y="116" className="mut mono en" textAnchor="middle">the skill improves with each use</text>
          </svg>
        </Diagram>
        <CodeBlock code={`# ~/.hermes/skills/devops/deploy-site/SKILL.md  (exemplo, no formato da documentação)
---
name: deploy-site
description: Publica o site estático no servidor e confere se subiu
version: 1.0.0
platforms: [linux]
metadata:
  hermes:
    tags: [deploy]
    category: devops
    requires_toolsets: [terminal]
---
# Deploy do site
## Quando usar
Quando o usuário pedir para publicar ou atualizar o site.
## Procedimento
1. Rode os testes: \`npm test\`.
2. Faça o build e envie com \`rsync\`.
3. Confira com \`curl -I\` que a página responde 200.
## Armadilhas
- O build falha se a pasta \`dist/\` estiver suja: apague antes.
## Verificação
\`curl -I https://meusite.com\` deve devolver \`HTTP/2 200\`.`} />
        <ul className="ds-list">
          <li><T pt={<><b>Ferramenta <code>skill_manage</code>:</b> ações <code>create</code>, <code>patch</code> (correção pontual, a preferida), <code>delete</code>, <code>write_file</code> e <code>remove_file</code> para arquivos de apoio (<code>references/</code>, <code>scripts/</code>...).</>} en={<><b>The <code>skill_manage</code> tool:</b> actions <code>create</code>, <code>patch</code> (a targeted fix, the preferred one), <code>delete</code>, <code>write_file</code> and <code>remove_file</code> for support files (<code>references/</code>, <code>scripts/</code>...).</>} /></li>
          <li><T pt={<><b>Divulgação progressiva</b> para não gastar contexto: o prompt só leva a lista (nome e descrição, uns 3 mil tokens no total); o <code>SKILL.md</code> inteiro só é carregado quando a skill é usada, e os arquivos de referência só quando necessários. Você também as chama na mão com <code>/nome-da-skill</code>.</>} en={<><b>Progressive disclosure</b> so as not to spend context: the prompt only carries the list (name and description, about 3k tokens in total); the whole <code>SKILL.md</code> is loaded only when the skill is used, and reference files only when needed. You can also call them by hand with <code>/skill-name</code>.</>} /></li>
          <li><T pt={<><b>Revisão humana:</b> com <code>skills.write_approval: true</code>, as skills novas ficam em <code>~/.hermes/pending/skills/</code> até você aprovar (<code>/skills pending</code>, <code>/skills diff &lt;id&gt;</code>, <code>/skills approve &lt;id&gt;</code>). Eu recomendo ligar isto no começo: uma skill é código que roda com as suas permissões.</>} en={<><b>Human review:</b> with <code>skills.write_approval: true</code>, new skills sit in <code>~/.hermes/pending/skills/</code> until you approve (<code>/skills pending</code>, <code>/skills diff &lt;id&gt;</code>, <code>/skills approve &lt;id&gt;</code>). I recommend turning this on at first: a skill is instructions that run with your permissions.</>} /></li>
          <li><T pt={<><b>Skills de terceiros</b> vêm de um hub (<code>hermes skills browse</code>, <code>search</code>, <code>install</code>). Todo <code>install</code> passa por um scanner (exfiltração, injeção de prompt, comandos destrutivos, cadeia de suprimentos). Há níveis de confiança (<code>builtin</code>, <code>official</code>, <code>trusted</code>, <code>community</code>), e o <code>--force</code> nunca passa por cima de um veredito <code>dangerous</code>.</>} en={<><b>Third-party skills</b> come from a hub (<code>hermes skills browse</code>, <code>search</code>, <code>install</code>). Every <code>install</code> goes through a scanner (exfiltration, prompt injection, destructive commands, supply chain). There are trust levels (<code>builtin</code>, <code>official</code>, <code>trusted</code>, <code>community</code>), and <code>--force</code> never overrides a <code>dangerous</code> verdict.</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> o <code>SKILL.md</code> acima é um exemplo que eu escrevi seguindo o formato da documentação; não é uma skill que o Hermes gerou. A qualidade do que ele cria sozinho depende do modelo, e skills ruins se acumulam: revise de vez em quando a pasta <code>~/.hermes/skills/</code>.</>} en={<><b>Personal note, not verified in the sources:</b> the <code>SKILL.md</code> above is an example I wrote following the documentation's format; it is not a skill Hermes generated. The quality of what it creates on its own depends on the model, and bad skills pile up: review the <code>~/.hermes/skills/</code> folder from time to time.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/skills">Hermes docs · Skills System</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="gateway" title={<T pt="4. Telegram, WhatsApp, Signal e o resto" en="4. Telegram, WhatsApp, Signal and the rest" />}>
        <p><T pt={<>O <b>gateway</b> é um processo em segundo plano que se conecta a todos os apps configurados. Cada app tem um <i>adaptador</i> que recebe as mensagens, e todas passam por uma sessão por conversa e chegam ao mesmo agente. Por isso a mesma memória e as mesmas skills valem no celular e no terminal. As plataformas da documentação:</>} en={<>The <b>gateway</b> is a background process that connects to all configured apps. Each app has an <i>adapter</i> that receives messages, and all of them go through one session per conversation and reach the same agent. That is why the same memory and skills apply on the phone and in the terminal. The platforms in the documentation:</>} /></p>
        <Table
          head={[<T pt="Grupo" en="Group" />, <T pt="Plataformas" en="Platforms" />]}
          rows={[
            [<T pt="Chat e times" en="Chat and teams" />, "Telegram, Discord, Slack, Google Chat, Mattermost, Matrix, Microsoft Teams, Feishu/Lark, DingTalk, WeCom, LINE, QQ..."],
            [<T pt="Mensageiros" en="Messengers" />, "WhatsApp (ponte Baileys ou Cloud API / Baileys bridge or Cloud API), Signal, SMS (Twilio), Email, SimpleX"],
            ["Apple", "BlueBubbles, Photon (iMessage)"],
            [<T pt="Outros" en="Other" />, "Home Assistant (plugin), ntfy, IRC, Webhooks, API Server"],
          ]}
        />
        <p><T pt={<>A configuração é guiada: <code>hermes gateway setup</code> pergunta qual plataforma você quer e pede os dados. Os três apps que você citou:</>} en={<>Setup is guided: <code>hermes gateway setup</code> asks which platform you want and requests the details. The three apps you mentioned:</>} /></p>
        <h3>Telegram</h3>
        <ol className="ds-steps">
          <li><T pt={<>No Telegram, abra o <b>@BotFather</b>, envie <code>/newbot</code>, escolha um nome e um usuário que termine em <code>bot</code>. Ele devolve o <b>token</b> (segredo: se vazar, <code>/revoke</code>).</>} en={<>In Telegram, open <b>@BotFather</b>, send <code>/newbot</code>, choose a name and a username ending in <code>bot</code>. It returns the <b>token</b> (secret: if it leaks, <code>/revoke</code>).</>} /></li>
          <li><T pt={<>Descubra o seu ID numérico (não o @usuário) com o <b>@userinfobot</b>.</>} en={<>Find your numeric ID (not the @username) with <b>@userinfobot</b>.</>} /></li>
          <li><T pt={<>Em <code>~/.hermes/.env</code> coloque <code>TELEGRAM_BOT_TOKEN</code> e <code>TELEGRAM_ALLOWED_USERS</code> (seu ID). Sem a lista, o gateway <b>nega todo mundo</b>.</>} en={<>In <code>~/.hermes/.env</code> set <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_ALLOWED_USERS</code> (your ID). Without the list, the gateway <b>denies everyone</b>.</>} /></li>
          <li><T pt={<>Rode <code>hermes gateway</code> e mande uma mensagem ao bot. Use <code>/sethome</code> no chat para ele receber os resultados das tarefas agendadas.</>} en={<>Run <code>hermes gateway</code> and message the bot. Use <code>/sethome</code> in the chat so it receives the scheduled tasks' results.</>} /></li>
        </ol>
        <p><T pt={<>O Telegram é o <b>melhor para um servidor</b>: por padrão o gateway usa <i>polling</i> (ele pergunta ao Telegram se há mensagens), ou seja, <b>só conexões de saída</b>. Não precisa abrir porta nem ter domínio. O modo webhook (<code>TELEGRAM_WEBHOOK_URL</code>) existe para plataformas que acordam a máquina com tráfego de entrada.</>} en={<>Telegram is the <b>best fit for a server</b>: by default the gateway uses <i>polling</i> (it asks Telegram whether there are messages), meaning <b>outbound connections only</b>. No need to open a port or own a domain. Webhook mode (<code>TELEGRAM_WEBHOOK_URL</code>) exists for platforms that wake the machine on inbound traffic.</>} /></p>
        <h3>WhatsApp</h3>
        <p><T pt={<>Há dois caminhos. A <b>ponte Baileys</b> (<code>hermes whatsapp</code>) emula uma sessão do WhatsApp Web: você escaneia um QR code em <i>Configurações → Dispositivos conectados</i>, não precisa de conta Meta nem de URL pública, mas <b>tem risco de banimento</b>, porque o WhatsApp não suporta bots de terceiros fora da API oficial. A <b>Cloud API</b> (oficial, da Meta) evita esse risco, mas exige conta Business e um webhook público.</>} en={<>There are two paths. The <b>Baileys bridge</b> (<code>hermes whatsapp</code>) emulates a WhatsApp Web session: you scan a QR code in <i>Settings → Linked Devices</i>, need no Meta account or public URL, but it <b>carries a ban risk</b>, because WhatsApp does not support third-party bots outside the official API. The <b>Cloud API</b> (official, from Meta) avoids that risk, but requires a Business account and a public webhook.</>} /></p>
        <CodeBlock code={`# ~/.hermes/.env  (ponte Baileys)
WHATSAPP_ENABLED=true
WHATSAPP_MODE=bot                    # "bot" (número próprio do bot) ou "self-chat"
WHATSAPP_ALLOWED_USERS=5511999999999 # código do país, sem "+"
WHATSAPP_GROUP_POLICY=pairing        # grupos: pairing | allowlist | open
WHATSAPP_REQUIRE_MENTION=true        # em grupos, só responde a @menções`} />
        <Callout tone="warn" icon="alert"><T pt={<><b>Cuidados da própria documentação:</b> use um <b>número dedicado</b>, não o seu pessoal; não mande mensagens em massa nem para quem não falou com você primeiro; e proteja <code>~/.hermes/platforms/whatsapp/session</code> como uma senha (<code>chmod 700</code>), porque ela guarda as credenciais da conta. Se vazar, desconecte o aparelho em Dispositivos conectados. Atualizações do protocolo do WhatsApp podem quebrar a ponte; atualize o Hermes e refaça o pareamento.</>} en={<><b>Cautions from the documentation itself:</b> use a <b>dedicated number</b>, not your personal one; do not send bulk messages or message people who did not write first; and protect <code>~/.hermes/platforms/whatsapp/session</code> like a password (<code>chmod 700</code>), because it holds the account credentials. If it leaks, unlink the device under Linked Devices. WhatsApp protocol updates can break the bridge; update Hermes and re-pair.</>} /></Callout>
        <h3>Signal</h3>
        <p><T pt={<>O Signal depende de um programa separado, o <b><code>signal-cli</code></b> (precisa de Java 17+), que roda como serviço local e que o Hermes acessa por HTTP. Você vincula o <code>signal-cli</code> ao seu número como aparelho secundário e deixa o daemon rodando:</>} en={<>Signal depends on a separate program, <b><code>signal-cli</code></b> (needs Java 17+), which runs as a local service that Hermes reaches over HTTP. You link <code>signal-cli</code> to your number as a secondary device and leave the daemon running:</>} /></p>
        <CodeBlock code={`signal-cli link -n "HermesAgent"                      # escaneie o QR em Signal > Aparelhos vinculados
signal-cli --account +5511999999999 daemon --http 127.0.0.1:8080

# ~/.hermes/.env
SIGNAL_HTTP_URL=http://127.0.0.1:8080
SIGNAL_ACCOUNT=+5511999999999
SIGNAL_ALLOWED_USERS=+5511999999999`} />
        <p><T pt={<>Detalhes da documentação: mensagens passam de 8.000 caracteres são divididas em partes numeradas; só uma instância do <code>signal-cli</code> deve escutar cada número; e <code>~/.local/share/signal-cli/</code> guarda as credenciais da conta.</>} en={<>Documentation details: messages over 8,000 characters are split into numbered parts; only one <code>signal-cli</code> instance should listen on each number; and <code>~/.local/share/signal-cli/</code> holds the account credentials.</>} /></p>
        <h3><T pt="Quem pode falar com o bot: pareamento de DM" en="Who can talk to the bot: DM pairing" /></h3>
        <p><T pt={<>Um bot de chat é público por natureza: qualquer um que achar o nome pode mandar mensagem, e esse bot executa comandos. Por isso o gateway <b>nega por padrão</b>. Há duas formas de liberar alguém: uma lista (<code>TELEGRAM_ALLOWED_USERS</code>, <code>WHATSAPP_ALLOWED_USERS</code>, <code>GATEWAY_ALLOWED_USERS</code>...) ou o <b>pareamento</b>: um desconhecido manda mensagem, o bot responde com um código de 8 caracteres, e você, no servidor, aprova:</>} en={<>A chat bot is public by nature: anyone who finds the name can message it, and this bot runs commands. So the gateway <b>denies by default</b>. There are two ways to let someone in: a list (<code>TELEGRAM_ALLOWED_USERS</code>, <code>WHATSAPP_ALLOWED_USERS</code>, <code>GATEWAY_ALLOWED_USERS</code>...) or <b>pairing</b>: a stranger messages, the bot replies with an 8-character code, and you, on the server, approve:</>} /></p>
        <CodeBlock code={`hermes pairing list
hermes pairing approve telegram XKGH5N7P
hermes pairing revoke telegram 123456789`} />
        <p><T pt={<>Dá para separar <b>administradores</b> de usuários comuns por plataforma (<code>allow_admin_from</code>, <code>user_allowed_commands</code>), e o <code>/whoami</code> mostra o seu nível. Outras coisas úteis do gateway: se um adaptador falha várias vezes, um <i>circuit breaker</i> o pausa (retome com <code>/platform resume &lt;nome&gt;</code>); um <i>watchdog</i> encerra o processo se o loop travar, para o supervisor reiniciá-lo; e as respostas finais ficam num registro no <code>state.db</code> e são reenviadas após uma queda.</>} en={<>You can split <b>admins</b> from regular users per platform (<code>allow_admin_from</code>, <code>user_allowed_commands</code>), and <code>/whoami</code> shows your tier. Other useful gateway behaviours: if an adapter fails repeatedly, a <i>circuit breaker</i> pauses it (resume with <code>/platform resume &lt;name&gt;</code>); a <i>watchdog</i> exits the process if the loop stalls, so the supervisor restarts it; and final replies are kept in a ledger in <code>state.db</code> and resent after a crash.</>} /></p>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/messaging/">Hermes docs · Messaging Gateway</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram">Hermes docs · Telegram</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp">Hermes docs · WhatsApp</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/messaging/signal">Hermes docs · Signal</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="guardrails" title={<T pt="5. Guardrails" en="5. Guardrails" />}>
        <p><T pt={<>Um agente que executa comandos a partir de mensagens de chat é, por definição, perigoso: um erro do modelo, um texto malicioso numa página que ele leu ou um desconhecido no bot podem virar um <code>rm -rf</code>. A documentação descreve <b>oito camadas</b>. As que mais importam:</>} en={<>An agent that runs commands from chat messages is dangerous by definition: a model mistake, malicious text on a page it read or a stranger on the bot can become an <code>rm -rf</code>. The documentation describes <b>eight layers</b>. The ones that matter most:</>} /></p>
        <Diagram minWidth={640} caption={<T pt="A ordem de uma mensagem do celular até o efeito no servidor." en="The order of a message from the phone to the effect on the server." />}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Camadas de segurança / Security layers">
            <rect x="4" y="10" width="130" height="110" rx="4" className="ln brandfill" />
            <text x="69" y="34" className="pt" textAnchor="middle">1. Quem fala</text>
            <text x="69" y="34" className="en" textAnchor="middle">1. Who talks</text>
            <text x="69" y="58" className="mut pt" textAnchor="middle">allowlist e</text>
            <text x="69" y="58" className="mut en" textAnchor="middle">allowlist and</text>
            <text x="69" y="74" className="mut pt" textAnchor="middle">pareamento;</text>
            <text x="69" y="74" className="mut en" textAnchor="middle">pairing;</text>
            <text x="69" y="90" className="mut pt" textAnchor="middle">padrão: negar</text>
            <text x="69" y="90" className="mut en" textAnchor="middle">default: deny</text>
            <rect x="144" y="10" width="130" height="110" rx="4" className="ln brandfill" />
            <text x="209" y="34" className="pt" textAnchor="middle">2. O que lê</text>
            <text x="209" y="34" className="en" textAnchor="middle">2. What it reads</text>
            <text x="209" y="58" className="mut pt" textAnchor="middle">varre AGENTS.md,</text>
            <text x="209" y="58" className="mut en" textAnchor="middle">scans AGENTS.md,</text>
            <text x="209" y="74" className="mut pt" textAnchor="middle">memória, skills;</text>
            <text x="209" y="74" className="mut en" textAnchor="middle">memory, skills;</text>
            <text x="209" y="90" className="mut pt" textAnchor="middle">bloqueio SSRF</text>
            <text x="209" y="90" className="mut en" textAnchor="middle">SSRF blocking</text>
            <rect x="284" y="10" width="130" height="110" rx="4" className="ln brandfill" />
            <text x="349" y="34" className="pt" textAnchor="middle">3. O que executa</text>
            <text x="349" y="34" className="en" textAnchor="middle">3. What it runs</text>
            <text x="349" y="58" className="mut pt" textAnchor="middle">aprovação de</text>
            <text x="349" y="58" className="mut en" textAnchor="middle">approval of</text>
            <text x="349" y="74" className="mut pt" textAnchor="middle">comandos;</text>
            <text x="349" y="74" className="mut en" textAnchor="middle">commands;</text>
            <text x="349" y="90" className="mut pt" textAnchor="middle">lista negra fixa</text>
            <text x="349" y="90" className="mut en" textAnchor="middle">fixed blocklist</text>
            <rect x="424" y="10" width="130" height="110" rx="4" className="ln brandfill" />
            <text x="489" y="34" className="pt" textAnchor="middle">4. O que escreve</text>
            <text x="489" y="34" className="en" textAnchor="middle">4. What it writes</text>
            <text x="489" y="58" className="mut pt" textAnchor="middle">~/.ssh, ~/.aws,</text>
            <text x="489" y="58" className="mut en" textAnchor="middle">~/.ssh, ~/.aws,</text>
            <text x="489" y="74" className="mut pt" textAnchor="middle">.env sempre</text>
            <text x="489" y="74" className="mut en" textAnchor="middle">.env always</text>
            <text x="489" y="90" className="mut pt" textAnchor="middle">bloqueados</text>
            <text x="489" y="90" className="mut en" textAnchor="middle">blocked</text>
            <rect x="564" y="10" width="132" height="110" rx="4" className="ln brandfill" />
            <text x="630" y="34" className="pt" textAnchor="middle">5. Onde roda</text>
            <text x="630" y="34" className="en" textAnchor="middle">5. Where it runs</text>
            <text x="630" y="58" className="mut pt" textAnchor="middle">contêiner sem</text>
            <text x="630" y="58" className="mut en" textAnchor="middle">container with no</text>
            <text x="630" y="74" className="mut pt" textAnchor="middle">privilégios;</text>
            <text x="630" y="74" className="mut en" textAnchor="middle">privileges;</text>
            <text x="630" y="90" className="mut pt" textAnchor="middle">segredos filtrados</text>
            <text x="630" y="90" className="mut en" textAnchor="middle">secrets filtered</text>
            <text x="350" y="158" className="mut pt" textAnchor="middle">as quatro primeiras são políticas (guarda-corpos); só a quinta é uma fronteira de verdade (sandbox)</text>
            <text x="350" y="158" className="mut en" textAnchor="middle">the first four are policies (guardrails); only the fifth is a real boundary (sandbox)</text>
            <text x="350" y="182" className="mut pt" textAnchor="middle">a própria documentação diz: "é uma camada de política, não um sandbox"</text>
            <text x="350" y="182" className="mut en" textAnchor="middle">the documentation itself says: "this is a policy layer, not a sandbox"</text>
          </svg>
        </Diagram>
        <h3><T pt="Aprovação de comandos" en="Command approval" /></h3>
        <p><T pt={<>Em <code>~/.hermes/config.yaml</code>, a chave <code>approvals.mode</code> tem três valores: <code>smart</code> (padrão: um modelo auxiliar avalia o risco; baixo risco passa, perigoso é negado, incerto vira pergunta para você), <code>manual</code> (sempre pergunta) e <code>off</code> (equivale ao modo <code>--yolo</code>). Comandos que disparam a aprovação incluem <code>rm</code> recursivo, <code>chmod 777</code>, <code>DROP</code>/<code>TRUNCATE</code>, <code>curl | sh</code>, <code>kill -9</code>, escritas em <code>/etc/</code> e em <code>~/.ssh/</code>. No chat você responde <code>yes</code> ou <code>no</code>; no terminal, <code>once</code>, <code>session</code>, <code>always</code> ou <code>deny</code>. Se você não responder em <code>approvals.timeout</code> (300 s por padrão), o pedido é <b>negado</b>.</>} en={<>In <code>~/.hermes/config.yaml</code>, the <code>approvals.mode</code> key has three values: <code>smart</code> (default: an auxiliary model rates the risk; low risk passes, dangerous is denied, uncertain becomes a question to you), <code>manual</code> (always asks) and <code>off</code> (same as <code>--yolo</code>). Commands that trigger approval include recursive <code>rm</code>, <code>chmod 777</code>, <code>DROP</code>/<code>TRUNCATE</code>, <code>curl | sh</code>, <code>kill -9</code>, writes to <code>/etc/</code> and <code>~/.ssh/</code>. In chat you answer <code>yes</code> or <code>no</code>; in the terminal, <code>once</code>, <code>session</code>, <code>always</code> or <code>deny</code>. If you do not answer within <code>approvals.timeout</code> (300 s by default), the request is <b>denied</b>.</>} /></p>
        <CodeBlock code={`# ~/.hermes/config.yaml
approvals:
  mode: manual            # para um servidor exposto, comece com "manual"
  timeout: 300
  cron_mode: deny         # tarefas agendadas sem ninguém para aprovar: negar
  deny:                   # regras suas, avaliadas antes de qualquer modo
    - "rm -rf *"
    - "*curl*|*sh*"`} />
        <p><T pt={<>Dois detalhes importantes. Primeiro, há uma <b>lista negra fixa</b> (<code>rm -rf /</code>, fork bomb, <code>mkfs</code> no disco raiz, <code>dd</code> sobre disco) que vale <b>até no modo <code>--yolo</code></b>. Segundo, tarefas sem ninguém por perto (agendadas, webhooks) usam <code>cron_mode</code>, <code>unattended_mode</code> etc., todos <code>deny</code> por padrão: um comando perigoso numa tarefa das 3h da manhã é negado, não executado.</>} en={<>Two important details. First, there is a <b>fixed blocklist</b> (<code>rm -rf /</code>, fork bomb, <code>mkfs</code> on the root disk, <code>dd</code> over a disk) that applies <b>even in <code>--yolo</code> mode</b>. Second, tasks with nobody around (scheduled, webhooks) use <code>cron_mode</code>, <code>unattended_mode</code> etc., all <code>deny</code> by default: a dangerous command in a 3am task is denied, not run.</>} /></p>
        <h3><T pt="Escrita de arquivos, segredos e injeção de prompt" en="File writes, secrets and prompt injection" /></h3>
        <ul className="ds-list">
          <li><T pt={<><b>Escrita:</b> as ferramentas <code>write_file</code> e <code>patch</code> não gravam em <code>~/.ssh/</code>, <code>~/.aws/</code>, <code>~/.kube/</code>, <code>/etc/sudoers</code> nem nos segredos do próprio Hermes (<code>.env</code>, <code>vault/</code>, <code>pairing/</code>), sem pedir aprovação.</>} en={<><b>Writes:</b> the <code>write_file</code> and <code>patch</code> tools do not write to <code>~/.ssh/</code>, <code>~/.aws/</code>, <code>~/.kube/</code>, <code>/etc/sudoers</code> nor Hermes's own secrets (<code>.env</code>, <code>vault/</code>, <code>pairing/</code>), without asking for approval.</>} /></li>
          <li><T pt={<><b>Segredos:</b> o <code>execute_code</code> remove variáveis com <code>KEY</code>, <code>TOKEN</code>, <code>SECRET</code>, <code>PASSWORD</code> no nome; o backend Docker e o SSH não herdam variáveis do host; processos MCP só recebem variáveis seguras mais as que você declara; e erros de MCP têm tokens (<code>ghp_</code>, <code>sk-</code>, <code>Bearer</code>) trocados por <code>[REDACTED]</code> antes de chegar ao LLM.</>} en={<><b>Secrets:</b> <code>execute_code</code> strips variables with <code>KEY</code>, <code>TOKEN</code>, <code>SECRET</code>, <code>PASSWORD</code> in the name; the Docker and SSH backends do not inherit host variables; MCP processes only get safe variables plus the ones you declare; and MCP errors have tokens (<code>ghp_</code>, <code>sk-</code>, <code>Bearer</code>) replaced with <code>[REDACTED]</code> before reaching the LLM.</>} /></li>
          <li><T pt={<><b>Injeção de prompt:</b> <code>AGENTS.md</code>, <code>.cursorrules</code> e <code>SOUL.md</code> são varridos (instruções do tipo "ignore as anteriores", comentários HTML escondidos, tentativas de ler <code>.env</code>, exfiltração por <code>curl</code>, Unicode invisível) e bloqueados se suspeitos. Comandos que enviam segredos por <code>curl</code> são sinalizados.</>} en={<><b>Prompt injection:</b> <code>AGENTS.md</code>, <code>.cursorrules</code> and <code>SOUL.md</code> are scanned ("ignore previous instructions", hidden HTML comments, attempts to read <code>.env</code>, <code>curl</code> exfiltration, invisible Unicode) and blocked if suspicious. Commands that send secrets via <code>curl</code> are flagged.</>} /></li>
          <li><T pt={<><b>Rede:</b> a proteção <b>SSRF</b> bloqueia endereços privados, <i>loopback</i> e o endpoint de metadados da nuvem (<code>169.254.169.254</code>) nas ferramentas de URL, e há uma lista de domínios proibidos (<code>security.website_blocklist</code>). Isso importa na AWS: sem ela, uma página maliciosa poderia induzir o agente a ler as credenciais da instância.</>} en={<><b>Network:</b> <b>SSRF</b> protection blocks private addresses, loopback and the cloud metadata endpoint (<code>169.254.169.254</code>) in URL tools, and there is a domain blocklist (<code>security.website_blocklist</code>). This matters on AWS: without it, a malicious page could trick the agent into reading the instance credentials.</>} /></li>
        </ul>
        <h3><T pt="Onde roda: a única fronteira de verdade" en="Where it runs: the only real boundary" /></h3>
        <p><T pt={<>O backend de terminal <code>local</code> executa os comandos <b>como o seu usuário, sem isolamento</b>. Os backends de contêiner (<code>docker</code>, Modal, Daytona...) isolam de verdade: no Docker, o Hermes usa <code>--cap-drop ALL</code>, <code>no-new-privileges</code>, limite de processos (256) e <code>/tmp</code> em memória, com limites de CPU, memória e disco configuráveis. Nesses backends a verificação de comandos perigosos é <b>dispensada</b>, porque o contêiner é a fronteira. A documentação lista o que fazer em produção:</>} en={<>The <code>local</code> terminal backend runs commands <b>as your user, with no isolation</b>. The container backends (<code>docker</code>, Modal, Daytona...) isolate for real: with Docker, Hermes uses <code>--cap-drop ALL</code>, <code>no-new-privileges</code>, a process limit (256) and an in-memory <code>/tmp</code>, with configurable CPU, memory and disk limits. On those backends the dangerous-command check is <b>skipped</b>, because the container is the boundary. The documentation lists what to do in production:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<>Allowlists explícitas; evite <code>GATEWAY_ALLOW_ALL_USERS=true</code>; use pareamento onde der.</>} en={<>Explicit allowlists; avoid <code>GATEWAY_ALLOW_ALL_USERS=true</code>; use pairing where possible.</>} /></li>
          <li><T pt="Backend de contêiner, com limites de CPU, memória e disco." en="A container backend, with CPU, memory and disk limits." /></li>
          <li><T pt={<>Segredos em <code>~/.hermes/.env</code> com <code>chmod 600</code>; <code>terminal.cwd</code> numa pasta sem nada sensível.</>} en={<>Secrets in <code>~/.hermes/.env</code> with <code>chmod 600</code>; <code>terminal.cwd</code> in a folder with nothing sensitive.</>} /></li>
          <li><T pt={<>Não rodar o gateway como root; auditar o <code>command_allowlist</code>; olhar <code>~/.hermes/logs/</code>; rodar <code>hermes update</code> com frequência.</>} en={<>Do not run the gateway as root; audit the <code>command_allowlist</code>; watch <code>~/.hermes/logs/</code>; run <code>hermes update</code> often.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><b>Aviso sobre o <code>--yolo</code>.</b> Ele desliga as aprovações para a sessão. Num bot que atende o celular, nunca o deixe ligado de forma permanente. Como o modo <code>smart</code> usa <i>outro LLM</i> para julgar risco, ele reduz o ruído, mas não é garantia: para um agente exposto à internet, comece em <code>manual</code>.</>} en={<><b>Warning about <code>--yolo</code>.</b> It turns off approvals for the session. On a bot serving your phone, never leave it permanently on. Because <code>smart</code> mode uses <i>another LLM</i> to judge risk, it reduces noise but is no guarantee: for an agent exposed to the internet, start with <code>manual</code>.</>} /></Callout>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> a conclusão de que "só o contêiner é fronteira de verdade" é minha leitura da própria documentação (que chama a lista de negação de "guarda-corpo, não sandbox"). Ligue isto à nota de <a href="/notas/agent-harness/">harness e guardrails</a> (a "trifeta letal": dados privados + conteúdo não confiável + comunicação externa): um agente com memória, web e shell tem as três.</>} en={<><b>Personal note, not verified in the sources:</b> the conclusion that "only the container is a real boundary" is my reading of the documentation itself (which calls the denylist a "guardrail, not a sandbox"). Tie this to the <a href="/notas/agent-harness/">harness and guardrails</a> note (the "lethal trifecta": private data + untrusted content + external communication): an agent with memory, web and shell has all three.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/security">Hermes docs · Security</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="install" title={<T pt="6. Instalar e escolher o modelo" en="6. Installing and choosing the model" />}>
        <h3><T pt="Instalação" en="Installation" /></h3>
        <CodeBlock code={`# Linux, macOS ou WSL2
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Windows (PowerShell)
iex (irm https://hermes-agent.nousresearch.com/install.ps1)

# depois
source ~/.bashrc      # ou ~/.zshrc
hermes                # abre o assistente na primeira vez

# conferir e reconfigurar
hermes doctor
hermes model          # escolher provedor e modelo
hermes gateway setup  # conectar Telegram, WhatsApp, Signal...
hermes update`} />
        <Callout tone="warn" icon="alert"><T pt={<><b>Leia antes de rodar um <code>curl | bash</code>.</b> É o método oficial, mas executa um script da internet. Baixe o <code>install.sh</code> primeiro, leia, e só então rode. Na documentação, o instalador baixa Python 3.14, Node.js, ripgrep e FFmpeg gerenciados por ele, instala o Chromium (para a automação do navegador) e cria <code>~/.hermes</code>; <code>--skip-browser</code> e <code>--non-interactive</code> existem. Há também apps para macOS (Apple Silicon) e Windows, e um pacote para Android/Termux.</>} en={<><b>Read before running a <code>curl | bash</code>.</b> It is the official method, but it runs a script from the internet. Download <code>install.sh</code> first, read it, and only then run it. Per the documentation, the installer fetches Python 3.14, Node.js, ripgrep and FFmpeg managed by itself, installs Chromium (for browser automation) and creates <code>~/.hermes</code>; <code>--skip-browser</code> and <code>--non-interactive</code> exist. There are also apps for macOS (Apple Silicon) and Windows, and a package for Android/Termux.</>} /></Callout>
        <h3><T pt="Quais LLMs ele suporta" en="Which LLMs it supports" /></h3>
        <p><T pt={<>Quase todos: o Hermes não é preso a um fornecedor. Você escolhe com <code>hermes model</code>, ou troca no meio da conversa com <code>/model provedor:modelo</code>. A tabela traz os principais da documentação:</>} en={<>Almost all of them: Hermes is not tied to one vendor. You choose with <code>hermes model</code>, or switch mid-conversation with <code>/model provider:model</code>. The table lists the main ones from the documentation:</>} /></p>
        <Table
          head={[<T pt="Provedor (id)" en="Provider (id)" />, <T pt="Credencial" en="Credential" />]}
          rows={[
            [<code>anthropic</code>, <code>ANTHROPIC_API_KEY</code>],
            [<code>openai-api</code>, <><code>OPENAI_API_KEY</code> (<code>OPENAI_BASE_URL</code> opcional)</>],
            [<><code>gemini</code> / <code>vertex</code></>, <><code>GEMINI_API_KEY</code> / <T pt="conta de serviço" en="service account" /></>],
            [<code>bedrock</code>, <T pt="cadeia de credenciais da AWS (boto3)" en="AWS credentials chain (boto3)" />],
            [<code>openrouter</code>, <><code>OPENROUTER_API_KEY</code> <T pt="(centenas de modelos)" en="(hundreds of models)" /></>],
            [<code>nous</code>, <T pt={<>OAuth (<code>hermes setup --portal</code>): o Nous Portal, com 200+ modelos e ferramentas hospedadas</>} en={<>OAuth (<code>hermes setup --portal</code>): Nous Portal, with 200+ models and hosted tools</>} />],
            [<><code>deepseek</code>, <code>zai</code> (GLM), <code>kimi-coding</code>, <code>minimax</code>, <code>alibaba</code> (Qwen), <code>xai</code>, <code>nvidia</code>, <code>huggingface</code>, <code>fireworks</code>...</>, <T pt={<>uma chave por provedor, em <code>~/.hermes/.env</code></>} en={<>one key per provider, in <code>~/.hermes/.env</code></>} />],
            [<code>custom</code>, <T pt="qualquer endpoint compatível com a API da OpenAI: Ollama, vLLM, llama.cpp" en="any OpenAI-compatible endpoint: Ollama, vLLM, llama.cpp" />],
          ]}
        />
        <CodeBlock code={`# ~/.hermes/config.yaml: modelo principal e reserva se o principal cair
model:
  provider: "anthropic"
  default: "claude-sonnet-4-6"
fallback_providers:
  - provider: openrouter
    model: anthropic/claude-sonnet-4

# modelo local (Ollama): a documentação exige 64 mil tokens de contexto, no mínimo
model:
  provider: custom
  default: qwen2.5-coder:32b
  base_url: http://localhost:11434/v1
  context_length: 64000          # e suba o servidor com OLLAMA_CONTEXT_LENGTH=64000`} />
        <ul className="ds-list">
          <li><T pt={<><b>Contexto mínimo de 64 mil tokens:</b> o Hermes recusa, na partida, um modelo com janela menor. Com Ollama, o contexto padrão costuma ser bem menor, então defina-o no servidor. No vLLM use <code>--enable-auto-tool-choice --tool-call-parser hermes</code>, e no llama.cpp <code>--jinja</code> (necessário para chamada de ferramentas).</>} en={<><b>64k tokens minimum context:</b> Hermes refuses, at startup, a model with a smaller window. With Ollama the default context is usually much smaller, so set it on the server. On vLLM use <code>--enable-auto-tool-choice --tool-call-parser hermes</code>, and on llama.cpp <code>--jinja</code> (required for tool calling).</>} /></li>
          <li><T pt={<><b>Modelo pequeno local não é o mesmo que um de ponta.</b> Um agente faz muitas chamadas de ferramenta seguidas; modelos fracos erram o formato ou se perdem. Para um bot que mexe em servidor, use um modelo forte. Veja a <a href="/notas/llm-agents-open-source/">nota de LLMs open-source</a> para rodar modelos locais e alugar GPU.</>} en={<><b>A small local model is not the same as a frontier one.</b> An agent makes many tool calls in a row; weak models get the format wrong or lose the thread. For a bot that touches a server, use a strong model. See the <a href="/notas/llm-agents-open-source/">open-source LLMs note</a> for running local models and renting a GPU.</>} /></li>
          <li><T pt={<><b>Custo:</b> um agente que roda 24/7 com tarefas agendadas gasta tokens sem você estar olhando. Use <code>/usage</code>, defina um limite de gasto no painel do provedor e prefira cache de prompt (o Hermes monta o prompt justamente para isso).</>} en={<><b>Cost:</b> an agent running 24/7 with scheduled tasks spends tokens while you are not looking. Use <code>/usage</code>, set a spend limit in the provider's dashboard and rely on prompt caching (Hermes builds the prompt exactly for that).</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, sobre as fontes:</b> a página da documentação diz que o login OAuth da Anthropic exige um plano Claude Max com créditos extras, e que o Claude Pro não serve; para o caminho simples use uma chave de API. Os ids de modelo (<code>claude-sonnet-4-6</code>, <code>qwen2.5-coder:32b</code>) são os do exemplo da documentação e envelhecem: use o que o seu provedor listar hoje.</>} en={<><b>Personal note, on sources:</b> the documentation page says Anthropic's OAuth login requires a Claude Max plan with extra credits, and that Claude Pro does not work; for the simple path use an API key. The model ids (<code>claude-sonnet-4-6</code>, <code>qwen2.5-coder:32b</code>) are the documentation's examples and age: use what your provider lists today.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/getting-started/installation">Hermes docs · Installation</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/integrations/providers">Hermes docs · AI Providers</a></li>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/configuration">Hermes docs · Configuration</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="server" title={<T pt="7. Deixar rodando 24/7 (Hostinger ou AWS)" en="7. Running 24/7 (Hostinger or AWS)" />}>
        <p><T pt={<>Para o agente responder sempre, ele precisa rodar numa máquina que fica ligada: um servidor virtual (VPS). O desenho é simples e, graças ao polling do Telegram, <b>não precisa de nenhuma porta aberta</b>:</>} en={<>For the agent to always answer, it must run on a machine that stays on: a virtual server (VPS). The design is simple and, thanks to Telegram polling, <b>needs no open port</b>:</>} /></p>
        <Diagram minWidth={640} caption={<T pt="O servidor só faz conexões de saída (para o Telegram e para o LLM). Sem portas de entrada abertas, a superfície de ataque é pequena." en="The server only makes outbound connections (to Telegram and to the LLM). With no inbound ports open, the attack surface is small." />}>
          <svg viewBox="0 0 700 210" role="img" aria-label="Hermes num servidor 24/7 / Hermes on a 24/7 server">
            <rect x="4" y="50" width="110" height="60" rx="4" className="ln fillsoft" />
            <text x="59" y="76" className="pt" textAnchor="middle">Seu celular</text>
            <text x="59" y="76" className="en" textAnchor="middle">Your phone</text>
            <text x="59" y="94" className="mut" textAnchor="middle">Telegram</text>
            <rect x="170" y="50" width="110" height="60" rx="4" className="ln fillsoft" />
            <text x="225" y="76" className="pt" textAnchor="middle">Servidores do</text>
            <text x="225" y="76" className="en" textAnchor="middle">Telegram's</text>
            <text x="225" y="94" className="pt" textAnchor="middle">Telegram</text>
            <text x="225" y="94" className="en" textAnchor="middle">servers</text>
            <rect x="336" y="10" width="220" height="150" rx="6" className="ln dash" />
            <text x="346" y="26" className="mut mono pt" textAnchor="start">VPS (Hostinger ou EC2)</text>
            <text x="346" y="26" className="mut mono en" textAnchor="start">VPS (Hostinger or EC2)</text>
            <rect x="352" y="40" width="188" height="70" rx="4" className="ln brandfill" />
            <text x="446" y="64" className="mono" textAnchor="middle">hermes gateway run</text>
            <text x="446" y="82" className="mut pt" textAnchor="middle">contêiner, restart: unless-stopped</text>
            <text x="446" y="82" className="mut en" textAnchor="middle">container, restart: unless-stopped</text>
            <text x="446" y="98" className="mut mono" textAnchor="middle">/opt/data ← ~/.hermes</text>
            <text x="446" y="140" className="mut pt" textAnchor="middle">entrada: só SSH (ou nenhuma)</text>
            <text x="446" y="140" className="mut en" textAnchor="middle">inbound: SSH only (or none)</text>
            <rect x="596" y="50" width="100" height="60" rx="4" className="ln fillsoft" />
            <text x="646" y="76" className="pt" textAnchor="middle">API do LLM</text>
            <text x="646" y="76" className="en" textAnchor="middle">LLM API</text>
            <text x="646" y="94" className="mut pt" textAnchor="middle">HTTPS</text>
            <text x="646" y="94" className="mut en" textAnchor="middle">HTTPS</text>
            <path d="M114 80L170 80" className="ln" />
            <path d="M336 80L280 80" className="ln" />
            <path d="M556 80L596 80" className="ln" />
            <path d="M287 80L280 77M287 80L280 83" className="ln" />
            <path d="M589 80L596 77M589 80L596 83" className="ln" />
            <text x="308" y="70" className="mut mono pt" textAnchor="middle">polling (saída)</text>
            <text x="308" y="70" className="mut mono en" textAnchor="middle">polling (outbound)</text>
            <text x="350" y="190" className="mut pt" textAnchor="middle">as setas saem do servidor; ninguém na internet inicia uma conexão com ele</text>
            <text x="350" y="190" className="mut en" textAnchor="middle">the arrows leave the server; nobody on the internet starts a connection to it</text>
          </svg>
        </Diagram>
        <h3><T pt="Tamanho do servidor" en="Server size" /></h3>
        <p><T pt={<>Com um modelo na nuvem (API), o servidor não roda o LLM, só o agente. As fontes divergem: o container usa cerca de 1 GB de RAM, 2 a 4 GB se você ligar a automação de navegador; o tutorial da Hostinger recomenda no mínimo 2 vCPU e 8 GB; um guia de VPS fala em uns 2 GB para modelos na nuvem. Eu começaria com <b>2 vCPU e 4 GB</b> e subiria se usar navegador. <b>Não rode o LLM local no mesmo VPS</b> barato: modelo de verdade pede GPU (veja a nota de LLMs).</>} en={<>With a cloud model (API), the server does not run the LLM, only the agent. Sources differ: the container uses about 1 GB of RAM, 2 to 4 GB if you turn on browser automation; the Hostinger tutorial recommends at least 2 vCPU and 8 GB; a VPS guide mentions about 2 GB for cloud models. I would start with <b>2 vCPU and 4 GB</b> and go up if you use the browser. <b>Do not run the local LLM on the same cheap VPS</b>: a real model needs a GPU (see the LLMs note).</>} /></p>
        <h3><T pt="Passo a passo (serve para Hostinger e AWS)" en="Step by step (works for Hostinger and AWS)" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><b>Crie o servidor</b> com Ubuntu 24.04 e acesso por <b>chave SSH</b>. Detalhes por provedor logo abaixo.</>} en={<><b>Create the server</b> with Ubuntu 24.04 and <b>SSH key</b> access. Provider details just below.</>} /></li>
          <li><T pt={<><b>Endureça o básico:</b> usuário comum com <code>sudo</code> (nada de operar como root), login root por SSH desligado, senha por SSH desligada, firewall liberando só o SSH, <code>fail2ban</code> e atualizações automáticas de segurança.</>} en={<><b>Harden the basics:</b> a regular user with <code>sudo</code> (no operating as root), SSH root login off, SSH password login off, a firewall allowing only SSH, <code>fail2ban</code> and automatic security updates.</>} /></li>
          <li><T pt={<><b>Instale o Docker</b> pelo repositório oficial dele e ponha seu usuário no grupo <code>docker</code>.</>} en={<><b>Install Docker</b> from its official repository and add your user to the <code>docker</code> group.</>} /></li>
          <li><T pt={<><b>Configure uma vez</b>, com o assistente dentro de um contêiner (ele grava a chave do modelo em <code>~/.hermes/.env</code>).</>} en={<><b>Configure once</b>, with the wizard inside a container (it writes the model key to <code>~/.hermes/.env</code>).</>} /></li>
          <li><T pt={<><b>Suba o gateway</b> com <code>--restart unless-stopped</code>, para ele voltar sozinho após uma queda ou reinício do servidor.</>} en={<><b>Start the gateway</b> with <code>--restart unless-stopped</code>, so it comes back by itself after a crash or server reboot.</>} /></li>
          <li><T pt={<><b>Mande uma mensagem pelo celular</b> e confira os logs.</>} en={<><b>Message it from your phone</b> and check the logs.</>} /></li>
        </ol>
        <CodeBlock code={`# no servidor (Ubuntu), como usuário comum
sudo ufw default deny incoming && sudo ufw allow OpenSSH && sudo ufw enable
sudo apt update && sudo apt install -y fail2ban unattended-upgrades

mkdir -p ~/.hermes
# 1) assistente de configuração: informe o provedor e a chave do modelo
docker run -it --rm -v ~/.hermes:/opt/data nousresearch/hermes-agent setup

# 2) credenciais do Telegram (token do BotFather e o seu ID)
cat >> ~/.hermes/.env <<'EOF'
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_ALLOWED_USERS=123456789
EOF
chmod 600 ~/.hermes/.env`} />
        <p><T pt={<><code>compose.yaml</code> (baseado no exemplo oficial, sem publicar portas, já que só usamos o chat):</>} en={<><code>compose.yaml</code> (based on the official example, publishing no ports since we only use chat):</>} /></p>
        <CodeBlock code={`services:
  hermes:
    image: nousresearch/hermes-agent:stable   # "stable" em vez de "latest" também é aceito
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    volumes:
      - ~/.hermes:/opt/data
    environment:
      - HERMES_UID=1000      # dono da pasta ~/.hermes no host (confira com: id -u)
      - HERMES_GID=1000
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"`} />
        <CodeBlock code={`docker compose up -d
docker compose logs -f                 # deve mostrar o adaptador do Telegram conectado

# monitorar e operar
docker exec hermes hermes gateway status
docker exec -u hermes hermes hermes pairing list

# atualizar (os dados ficam em ~/.hermes, que é um volume)
docker compose pull && docker compose up -d`} />
        <Callout tone="warn" icon="alert"><T pt={<><b>Não publique as portas 8642 e 9119.</b> A 8642 é a API do gateway e a 9119 é o painel web. Para chat, nenhuma das duas é necessária. Se quiser o painel, ligue-o só em <code>127.0.0.1</code> e acesse por túnel SSH (<code>ssh -L 9119:127.0.0.1:9119 usuario@servidor</code>). Se expuser a API, defina <code>API_SERVER_KEY</code> forte. Nunca rode dois contêineres sobre o mesmo <code>~/.hermes</code>.</>} en={<><b>Do not publish ports 8642 and 9119.</b> 8642 is the gateway API and 9119 is the web dashboard. For chat, neither is needed. If you want the dashboard, bind it only to <code>127.0.0.1</code> and reach it through an SSH tunnel (<code>ssh -L 9119:127.0.0.1:9119 user@server</code>). If you expose the API, set a strong <code>API_SERVER_KEY</code>. Never run two containers over the same <code>~/.hermes</code>.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt={<><b>O contêiner do Hermes não é o backend Docker.</b> Rodando o agente no contêiner, os comandos dele rodam <i>dentro</i> desse contêiner (backend <code>local</code> dentro dele), o que já o separa do servidor. Isso é diferente do backend <code>docker</code> da seção 5, que cria um contêiner por tarefa. As aprovações de comando continuam valendo no primeiro caso. Mantenha o <code>approvals.mode</code> em <code>smart</code> ou <code>manual</code> e não monte o <code>docker.sock</code> do host dentro dele: quem controla o socket controla a máquina.</>} en={<><b>The Hermes container is not the Docker backend.</b> Running the agent in the container, its commands run <i>inside</i> that container (the <code>local</code> backend inside it), which already separates it from the server. This differs from the section 5 <code>docker</code> backend, which creates a container per task. Command approvals still apply in the first case. Keep <code>approvals.mode</code> at <code>smart</code> or <code>manual</code> and do not mount the host's <code>docker.sock</code> into it: whoever controls the socket controls the machine.</>} /></Callout>
        <h3>Hostinger</h3>
        <ul className="ds-list">
          <li><T pt={<><b>Modelo pronto:</b> a Hostinger oferece um template de <b>Hermes Agent</b> para VPS. Ao criar o VPS (ou em <i>VPS → OS &amp; Panel → Operating System → Change OS</i>, procurando "Hermes Agent"), ele instala sozinho, e você abre o projeto no <b>Docker Manager</b> e acessa o terminal web. Atualizar é o menu de três pontos do projeto → <b>Update</b>.</>} en={<><b>Ready-made template:</b> Hostinger offers a <b>Hermes Agent</b> VPS template. When creating the VPS (or in <i>VPS → OS &amp; Panel → Operating System → Change OS</i>, searching "Hermes Agent"), it installs itself, and you open the project in <b>Docker Manager</b> and reach the web terminal. To update, use the project's three-dot menu → <b>Update</b>.</>} /></li>
          <li><T pt={<><b>Do zero:</b> escolha um VPS com Ubuntu, acesse por SSH e siga o passo a passo acima. É o mesmo caminho do tutorial deles.</>} en={<><b>From scratch:</b> pick an Ubuntu VPS, connect over SSH and follow the step-by-step above. It is the same path as their tutorial.</>} /></li>
          <li><T pt={<>Se usar o painel, o firewall da Hostinger também pode bloquear tudo menos o SSH; faça nos dois lugares (painel e <code>ufw</code>).</>} en={<>If you use the panel, Hostinger's firewall can also block everything but SSH; do it in both places (panel and <code>ufw</code>).</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, discrepância nas fontes:</b> o tutorial da Hostinger indica liberar o usuário do Telegram em <code>gateway → telegram → allowed_user_ids</code> no <code>config.yaml</code>, mas a documentação oficial de segurança e de Telegram usa a variável <code>TELEGRAM_ALLOWED_USERS</code> no <code>.env</code>. Usei a oficial. Também não vi preços; confira o plano na Hostinger.</>} en={<><b>Personal note, a discrepancy in the sources:</b> the Hostinger tutorial says to allow the Telegram user at <code>gateway → telegram → allowed_user_ids</code> in <code>config.yaml</code>, but the official security and Telegram documentation uses the <code>TELEGRAM_ALLOWED_USERS</code> variable in <code>.env</code>. I used the official one. I also did not see prices; check the plan at Hostinger.</>} /></Callout>
        <h3>AWS</h3>
        <p><T pt={<>Não encontrei um guia oficial do Hermes para a AWS. O que segue é a minha adaptação do mesmo passo a passo, e <b>não foi testado</b>:</>} en={<>I did not find an official Hermes guide for AWS. What follows is my adaptation of the same step-by-step, and it is <b>untested</b>:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><b>Instância EC2</b> (ou Lightsail, mais simples) com Ubuntu 24.04, tipo com 2 vCPU e 4 GB (a família <code>t3</code>/<code>t4g</code> serve) e um volume EBS criptografado de uns 30 GB. Não precisa de Elastic IP: o agente só faz conexões de saída.</>} en={<><b>An EC2 instance</b> (or Lightsail, simpler) with Ubuntu 24.04, a 2 vCPU and 4 GB type (the <code>t3</code>/<code>t4g</code> family works) and an encrypted EBS volume of about 30 GB. No Elastic IP needed: the agent only makes outbound connections.</>} /></li>
          <li><T pt={<><b>Security group sem nenhuma regra de entrada.</b> Para administrar, use o <b>SSM Session Manager</b> (anexe à instância um perfil IAM com <code>AmazonSSMManagedInstanceCore</code>) em vez de abrir a porta 22. Se preferir SSH, libere a 22 só para o seu IP.</>} en={<><b>A security group with no inbound rules.</b> To administer, use <b>SSM Session Manager</b> (attach an IAM profile with <code>AmazonSSMManagedInstanceCore</code> to the instance) instead of opening port 22. If you prefer SSH, allow 22 only from your IP.</>} /></li>
          <li><T pt={<><b>IMDSv2 obrigatório</b> nas opções de metadados da instância. Combina com a proteção SSRF do Hermes (seção 5): um agente que lê páginas da web é exatamente o tipo de coisa que tenta alcançar o <code>169.254.169.254</code>.</>} en={<><b>Require IMDSv2</b> in the instance metadata options. It pairs with Hermes's SSRF protection (section 5): an agent that reads web pages is exactly the kind of thing that tries to reach <code>169.254.169.254</code>.</>} /></li>
          <li><T pt={<><b>Modelo pelo Bedrock, sem chave nenhuma:</b> o provedor <code>bedrock</code> usa a cadeia de credenciais da AWS, então um <b>perfil IAM da instância</b> com permissão mínima (<code>bedrock:InvokeModel*</code> nos modelos que você usa) dispensa guardar uma chave de API no <code>.env</code>. É o mesmo princípio da nota de <a href="/notas/github-aws-oidc/">OIDC</a>: credencial temporária em vez de segredo fixo.</>} en={<><b>Model through Bedrock, with no key at all:</b> the <code>bedrock</code> provider uses the AWS credentials chain, so an <b>instance IAM profile</b> with minimal permission (<code>bedrock:InvokeModel*</code> on the models you use) removes the need to store an API key in <code>.env</code>. It is the same principle as the <a href="/notas/github-aws-oidc/">OIDC</a> note: temporary credentials instead of a fixed secret.</>} /></li>
          <li><T pt={<><b>Cuidado com o perfil IAM:</b> tudo o que o perfil permite, o agente (e quem o enganar) consegue fazer. Dê só o Bedrock, nada de S3 amplo ou administração.</>} en={<><b>Watch the IAM profile:</b> whatever the profile allows, the agent (and anyone who tricks it) can do. Give only Bedrock, no broad S3 or admin.</>} /></li>
          <li><T pt={<>Depois, é o mesmo: instalar o Docker, <code>setup</code>, <code>.env</code> e <code>docker compose up -d</code>. Os logs podem ir ao CloudWatch com o driver de log do Docker, e um alarme de custo (AWS Budgets) protege contra um agente em loop.</>} en={<>After that, it is the same: install Docker, <code>setup</code>, <code>.env</code> and <code>docker compose up -d</code>. Logs can go to CloudWatch with Docker's log driver, and a cost alarm (AWS Budgets) protects against an agent in a loop.</>} /></li>
        </ul>
        <h3><T pt="Hostinger ou AWS?" en="Hostinger or AWS?" /></h3>
        <Table
          head={[null, "Hostinger", "AWS"]}
          rows={[
            [<T pt="Começo" en="Getting started" />, <T pt="Template pronto + Docker Manager; minutos" en="Ready template + Docker Manager; minutes" />, <T pt="Você monta tudo (EC2, rede, IAM)" en="You assemble everything (EC2, network, IAM)" />],
            [<T pt="Credenciais do modelo" en="Model credentials" />, <T pt={<>Chave de API no <code>.env</code></>} en={<>API key in <code>.env</code></>} />, <T pt="Perfil IAM + Bedrock: sem chave guardada" en="IAM profile + Bedrock: no stored key" />],
            [<T pt="Acesso administrativo" en="Admin access" />, <>SSH / <T pt="terminal web" en="web terminal" /></>, <T pt="SSM, sem porta aberta" en="SSM, no open port" />],
            [<T pt="Custo e previsibilidade" en="Cost and predictability" />, <T pt="Mensalidade fixa de VPS" en="Fixed monthly VPS fee" />, <T pt="Pago por uso; defina alarme de custo" en="Pay per use; set a cost alarm" />],
            [<T pt="Bom para" en="Good for" />, <T pt="Bot pessoal, simples e barato" en="A personal bot, simple and cheap" />, <T pt="Quem já está na AWS e quer IAM e logs integrados" en="Those already on AWS wanting integrated IAM and logs" />],
          ]}
        />
        <Sources title={<T pt="Fontes · verificadas em 2026-10-27" en="Sources · checked on 2026-10-27" />}>
          <ul>
            <li><a href="https://hermes-agent.nousresearch.com/docs/user-guide/docker">Hermes docs · Docker</a></li>
            <li><a href="https://www.hostinger.com/tutorials/?p=146279">Hostinger · How to set up Hermes Agent with Docker</a></li>
            <li><a href="https://www.virtua.cloud/learn/en/tutorials/run-hermes-agent-docker-compose-vps">Virtua Cloud · Run Hermes Agent with Docker Compose on a VPS (guia de terceiros / third-party guide)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="cheat" title={<T pt="8. Checklist" en="8. Checklist" />}>
        <ul className="ds-list">
          <li><T pt="Modelo forte e com 64 mil tokens de contexto ou mais; limite de gasto no provedor." en="A strong model with 64k tokens of context or more; a spend limit at the provider." /></li>
          <li><T pt={<>Allowlist ou pareamento em toda plataforma; <code>GATEWAY_ALLOW_ALL_USERS</code> desligado.</>} en={<>Allowlist or pairing on every platform; <code>GATEWAY_ALLOW_ALL_USERS</code> off.</>} /></li>
          <li><T pt={<><code>approvals.mode: manual</code> (ou <code>smart</code> com atenção); nunca <code>--yolo</code> permanente.</>} en={<><code>approvals.mode: manual</code> (or <code>smart</code> with care); never a permanent <code>--yolo</code>.</>} /></li>
          <li><T pt={<>Agente em contêiner, sem <code>docker.sock</code>, sem root, sem portas publicadas.</>} en={<>Agent in a container, no <code>docker.sock</code>, no root, no published ports.</>} /></li>
          <li><T pt={<>Segredos só em <code>~/.hermes/.env</code> (<code>chmod 600</code>); no WhatsApp, a pasta da sessão com <code>chmod 700</code> e número dedicado.</>} en={<>Secrets only in <code>~/.hermes/.env</code> (<code>chmod 600</code>); on WhatsApp, the session folder with <code>chmod 700</code> and a dedicated number.</>} /></li>
          <li><T pt={<><code>skills.write_approval</code> e <code>memory.write_approval</code> ligados no começo; revisar <code>~/.hermes/skills/</code> de vez em quando.</>} en={<><code>skills.write_approval</code> and <code>memory.write_approval</code> on at first; review <code>~/.hermes/skills/</code> from time to time.</>} /></li>
          <li><T pt={<>Servidor: SSH por chave, firewall só com o necessário, fail2ban, atualizações automáticas, <code>restart: unless-stopped</code>.</>} en={<>Server: SSH keys, firewall with only what is needed, fail2ban, automatic updates, <code>restart: unless-stopped</code>.</>} /></li>
          <li><T pt="Na AWS: sem entrada no security group, SSM, IMDSv2, perfil IAM mínimo, alarme de custo." en="On AWS: no inbound in the security group, SSM, IMDSv2, minimal IAM profile, cost alarm." /></li>
          <li><T pt={<>Backup de <code>~/.hermes</code> (é a memória, as skills e as sessões do agente) e <code>hermes update</code> ou <code>docker compose pull</code> regularmente.</>} en={<>Back up <code>~/.hermes</code> (it is the agent's memory, skills and sessions) and run <code>hermes update</code> or <code>docker compose pull</code> regularly.</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Limites desta nota.</b> A documentação do Hermes, o README e o tutorial da Hostinger foram lidos em 27/10/2026. <b>Eu não rodei o Hermes com um modelo real</b>: só baixei a imagem oficial e vi a estrutura de pastas criada na primeira partida; nenhum outro comando desta nota foi executado por mim, e a seção da AWS é minha adaptação, sem teste. O projeto muda rápido (chaves de configuração, tags de imagem, plataformas); confira a documentação da versão que instalar antes de depender de um detalhe.</>} en={<><b>Limits of this note.</b> The Hermes documentation, the README and the Hostinger tutorial were read on 2026-10-27. <b>I did not run Hermes against a real model</b>: I only pulled the official image and saw the folder structure created on first start; no other command in this note was executed by me, and the AWS section is my untested adaptation. The project moves fast (configuration keys, image tags, platforms); check the documentation for the version you install before relying on a detail.</>} /></Callout>
      </Section>
    </>
  );
}
