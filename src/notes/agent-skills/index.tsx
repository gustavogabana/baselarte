import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "agent-skills",
  title: { en: "Agent skills: writing a SKILL.md", pt: "Skills para agentes: escrever um SKILL.md" },
  seo: {
    title: { en: "Writing skills for AI agents: SKILL.md for Claude Code, Codex and open-source agents", pt: "Criar skills para agentes de IA: SKILL.md no Claude Code, Codex e agentes open-source" },
    description: { en: "A simple guide to writing agent skills (SKILL.md): what a skill is and does, how to create one, where each agent looks for it, when to split a skill in two, skills by theme (review, security, code, requirements), safety, and a lab with a linter.", pt: "Um guia simples para escrever skills de agentes (SKILL.md): o que uma skill é e faz, como criar, onde cada agente a procura, quando dividir uma skill em duas, skills por tema (review, segurança, código, requisitos), segurança e um laboratório com linter." },
  },
  summary: "a simple guide to the open Agent Skills format (SKILL.md): what a skill is and does (progressive disclosure, skill versus AGENTS.md, tool and subagent), how to create one step by step with a tested code review example, where Claude Code, Codex, opencode and Hermes look for skills and what each adds (disable-model-invocation, agents/openai.yaml, permission.skill, metadata.hermes), a portable .agents/skills layout with symlinks, when to split a skill by intent and by risk or move content to references/, skills by theme (code, review, security, functional requirements, tests, release), description-writing and scope rules from the specification and Anthropic's best practices, skill security controls per agent, and a lab with a spec linter and a trigger test, with official sources.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Writing skills for AI agents, <em>once, for every agent.</em></>, pt: <>Criar skills para agentes de IA, <em>uma vez, para todos os agentes.</em></> },
  heroLede: { en: "What a skill is, how to create one, where Claude Code, Codex, opencode and Hermes look for it, when to split one into two, how to design skills for review, security, code and requirements, and how to validate and test them.", pt: "O que é uma skill, como criar, onde Claude Code, Codex, opencode e Hermes a procuram, quando dividir uma em duas, como desenhar skills de review, segurança, código e requisitos, e como validar e testar." },
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é uma skill e o que ela faz" en="What a skill is and what it does" /> },
        { id: "create", title: <T pt="Como criar uma skill, passo a passo" en="How to create a skill, step by step" /> },
        { id: "where", title: <T pt="Onde ficam e o que cada agente acrescenta" en="Where they live and what each agent adds" /> },
        { id: "split", title: <T pt="Quando dividir uma skill em duas (ou juntar)" en="When to split a skill in two (or merge)" /> },
        { id: "themes", title: <T pt="Skills por tema: o que muda em cada uma" en="Skills by theme: what changes in each" /> },
        { id: "rules", title: <T pt="Regras que fazem uma skill funcionar" en="Rules that make a skill work" /> },
        { id: "security", title: <T pt="Segurança: uma skill é código que o agente executa" en="Security: a skill is code the agent runs" /> },
        { id: "lab", title: <T pt="Praticar: criar, validar e testar" en="Practise: create, validate and test" /> },
        { id: "cheat-sk", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é uma skill e o que ela faz" en="What a skill is and what it does" />}>
        <p><T pt={<>Uma <strong>skill</strong> é uma pasta com um arquivo <code>SKILL.md</code>: um cabeçalho YAML (nome e descrição) e, abaixo, instruções em Markdown. Ela ensina ao agente um <em>procedimento repetível</em> (como revisar um PR, como escrever requisitos, como fazer um release) e só entra no contexto <strong>quando a tarefa pede</strong>. O formato é um padrão aberto, o <a href="https://agentskills.io/specification" rel="noopener">Agent Skills</a>, e a mesma pasta funciona no Claude Code, no Codex, no opencode e no Hermes (cada um acrescenta extras, veja <a href="#where">onde ficam</a>).</>} en={<>A <strong>skill</strong> is a folder with a <code>SKILL.md</code> file: a YAML header (name and description) and, below it, instructions in Markdown. It teaches the agent a <em>repeatable procedure</em> (how to review a PR, how to write requirements, how to cut a release) and only enters the context <strong>when the task calls for it</strong>. The format is an open standard, <a href="https://agentskills.io/specification" rel="noopener">Agent Skills</a>, and the same folder works in Claude Code, Codex, opencode and Hermes (each adds extras, see <a href="#where">where they live</a>).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O agente só paga o custo de contexto do que a tarefa realmente usa. Por isso a descrição vale tanto, e os detalhes vão para arquivos separados." en="The agent only pays the context cost of what the task really uses. That is why the description matters so much, and details go in separate files." />}>
          <svg viewBox="0 0 700 196" role="img" aria-label="Divulgação progressiva / Progressive disclosure">
            <rect x="10" y="20" width="210" height="84" rx="4" className="brandfill" />
            <text x="115" y="44" className="pt" textAnchor="middle">1. Metadados</text>
            <text x="115" y="44" className="en" textAnchor="middle">1. Metadata</text>
            <text x="115" y="64" className="mono mut" textAnchor="middle">name + description</text>
            <text x="115" y="84" className="pt mut" textAnchor="middle">~100 tokens por skill</text>
            <text x="115" y="84" className="en mut" textAnchor="middle">~100 tokens per skill</text>
            <text x="115" y="128" className="pt mut" textAnchor="middle">carrega:</text>
            <text x="115" y="128" className="en mut" textAnchor="middle">loads:</text>
            <text x="115" y="144" className="pt" textAnchor="middle">sempre no contexto</text>
            <text x="115" y="144" className="en" textAnchor="middle">always in context</text>
            <rect x="245" y="20" width="210" height="84" rx="4" className="ln fillsoft" />
            <text x="350" y="44" className="pt" textAnchor="middle">2. Instruções</text>
            <text x="350" y="44" className="en" textAnchor="middle">2. Instructions</text>
            <text x="350" y="64" className="mono mut" textAnchor="middle">corpo do SKILL.md</text>
            <text x="350" y="84" className="pt mut" textAnchor="middle">&lt; 500 linhas, &lt; 5000 tokens</text>
            <text x="350" y="84" className="en mut" textAnchor="middle">&lt; 500 lines, &lt; 5000 tokens</text>
            <text x="350" y="128" className="pt mut" textAnchor="middle">carrega:</text>
            <text x="350" y="128" className="en mut" textAnchor="middle">loads:</text>
            <text x="350" y="144" className="pt" textAnchor="middle">quando a tarefa casa</text>
            <text x="350" y="144" className="en" textAnchor="middle">when the task matches</text>
            <rect x="480" y="20" width="210" height="84" rx="4" className="ln" />
            <text x="585" y="44" className="pt" textAnchor="middle">3. Recursos</text>
            <text x="585" y="44" className="en" textAnchor="middle">3. Resources</text>
            <text x="585" y="64" className="mono mut" textAnchor="middle">scripts/ references/ assets/</text>
            <text x="585" y="84" className="pt mut" textAnchor="middle">tamanho livre</text>
            <text x="585" y="84" className="en mut" textAnchor="middle">any size</text>
            <text x="585" y="128" className="pt mut" textAnchor="middle">carrega:</text>
            <text x="585" y="128" className="en mut" textAnchor="middle">loads:</text>
            <text x="585" y="144" className="pt" textAnchor="middle">só quando o corpo manda</text>
            <text x="585" y="144" className="en" textAnchor="middle">only when the body says so</text>
            <path d="M220 62L245 62" className="ln" />
            <path d="M238.7 65.0L245 62L238.7 59.0" className="ln" />
            <path d="M455 62L480 62" className="ln" />
            <path d="M473.7 65.0L480 62L473.7 59.0" className="ln" />
            <text x="350" y="180" className="pt mut" textAnchor="middle">A descrição é o único texto sempre carregado: ela decide se a skill será usada.</text>
            <text x="350" y="180" className="en mut" textAnchor="middle">The description is the only text always loaded: it decides whether the skill gets used.</text>
          </svg>
        </Diagram>
        <p><T pt={<>O truque é a <strong>divulgação progressiva</strong>: no início o agente lê só o nome e a descrição de cada skill (cerca de 100 tokens por skill, segundo a especificação). Se a tarefa casa com a descrição, ele carrega o corpo do <code>SKILL.md</code>. Arquivos de apoio só são lidos se o corpo mandar. Assim você pode ter dezenas de skills instaladas sem encher o contexto.</>} en={<>The trick is <strong>progressive disclosure</strong>: at the start the agent reads only the name and description of each skill (about 100 tokens per skill, per the specification). If the task matches the description, it loads the <code>SKILL.md</code> body. Supporting files are read only if the body says so. That way you can have dozens of skills installed without filling the context.</>} /></p>
        <Table
          head={[<T pt="Mecanismo" en="Mechanism" />, <T pt="Quando entra" en="When it enters" />, <T pt="Serve para" en="What it is for" />]}
          rows={[
            ["AGENTS.md / CLAUDE.md", <T pt="Sempre" en="Always" />, <T pt={<>Fatos curtos que valem em toda tarefa (“rode <code>pnpm test</code>”).</>} en={<>Short facts that hold for every task (“run <code>pnpm test</code>”).</>} />],
            [<strong>Skill</strong>, <T pt="Quando a descrição casa, ou você chama" en="When the description matches, or you call it" />, <T pt={<>Um <em>procedimento</em> com passos, formato de saída e, às vezes, scripts.</>} en={<>A <em>procedure</em> with steps, an output format and sometimes scripts.</>} />],
            [<T pt="Ferramenta / MCP" en="Tool / MCP" />, <T pt="Quando o modelo chama" en="When the model calls it" />, <T pt={<>Uma <em>ação</em> que o modelo não faz sozinho (veja a <a href="/notas/mcp-server-client/">nota de MCP</a>).</>} en={<>An <em>action</em> the model cannot do alone (see the <a href="/notas/mcp-server-client/">MCP note</a>).</>} />],
            [<T pt="Subagente" en="Subagent" />, <T pt="Quando o agente principal delega" en="When the main agent delegates" />, <T pt="Trabalho volumoso que não deve poluir o contexto principal." en="Bulky work that should not pollute the main context." />],
          ]}
        />
        <p><T pt={<>A comparação completa, com RAG e hooks, está na <a href="/notas/agent-harness/">nota de harness</a>. A regra prática: <strong>fato curto e sempre válido vai no AGENTS.md; procedimento vai numa skill; ação vai numa ferramenta.</strong></>} en={<>The full comparison, with RAG and hooks, is in the <a href="/notas/agent-harness/">harness note</a>. The practical rule: <strong>a short, always-valid fact goes in AGENTS.md; a procedure goes in a skill; an action goes in a tool.</strong></>} /></p>
        <h3><T pt="O que uma boa skill faz, e o que não faz" en="What a good skill does, and what it does not" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Traz o que o agente não sabe:</strong> as convenções do seu projeto, os passos na ordem certa, as armadilhas (“a tabela <code>users</code> usa exclusão lógica”). Não explica o que o agente já sabe, como o que é um PDF ou um SQL injection.</>} en={<><strong>Brings what the agent does not know:</strong> your project's conventions, the steps in the right order, the traps (“the <code>users</code> table uses soft deletes”). It does not explain what the agent already knows, like what a PDF or a SQL injection is.</>} /></li>
          <li><T pt={<><strong>Fixa o formato da saída</strong> com um modelo (template): o agente segue estruturas concretas melhor do que descrições em prosa.</>} en={<><strong>Fixes the output format</strong> with a template: the agent follows concrete structures better than prose descriptions.</>} /></li>
          <li><T pt={<><strong>Entrega scripts</strong> quando um passo precisa ser idêntico a cada vez. O script roda e só a saída gasta contexto.</>} en={<><strong>Ships scripts</strong> when a step must be identical every time. The script runs and only its output costs context.</>} /></li>
          <li><T pt={<><strong>Não é um sandbox nem uma permissão.</strong> A skill roda com o acesso que o agente já tem; ela é <em>instrução</em>, e instrução pode ser ignorada ou enganada. O que precisa valer sempre vai em hook, permissão ou rede (veja <a href="#security">segurança</a>).</>} en={<><strong>It is not a sandbox or a permission.</strong> The skill runs with the access the agent already has; it is <em>instruction</em>, and instruction can be ignored or tricked. What must always hold goes in a hook, a permission or the network (see <a href="#security">security</a>).</>} /></li>
        </ul>
        <Callout icon="check"><T pt={<><strong>Quando vale criar uma.</strong> A documentação do Claude Code dá o critério: quando você cola as mesmas instruções no chat de novo e de novo, ou quando uma seção do CLAUDE.md virou um <em>procedimento</em> em vez de um fato. A especificação acrescenta o teste inverso: se o agente já faz a tarefa bem sem a skill, ela não está agregando valor.</>} en={<><strong>When one is worth creating.</strong> The Claude Code documentation gives the criterion: when you paste the same instructions into chat again and again, or when a CLAUDE.md section has become a <em>procedure</em> rather than a fact. The specification adds the opposite test: if the agent already does the task well without the skill, it is not adding value.</>} /></Callout>
      </Section>
      <Section id="create" title={<T pt="Como criar uma skill, passo a passo" en="How to create a skill, step by step" />}>
        <ol className="ds-steps">
          <li><T pt={<><strong>Faça a tarefa uma vez, com o agente, sem skill.</strong> Dê o contexto, corrija os desvios, diga as preferências. Depois olhe: quais passos funcionaram, quais correções você fez, que formato de entrada e saída apareceu. É isso que vira a skill. As boas práticas oficiais alertam: pedir a um modelo uma skill “do nada” gera procedimentos genéricos (“siga as boas práticas”); o valor está no que é <em>seu</em>.</>} en={<><strong>Do the task once, with the agent, with no skill.</strong> Give context, correct the drift, state preferences. Then look at it: which steps worked, which corrections you made, what input and output format showed up. That is what becomes the skill. The official best practices warn: asking a model for a skill “out of thin air” yields generic procedures (“follow best practices”); the value is in what is <em>yours</em>.</>} /></li>
          <li><T pt={<><strong>Crie a pasta e o arquivo.</strong> O nome da pasta é o nome da skill, e o arquivo chama-se <code>SKILL.md</code> exatamente assim, em maiúsculas.</>} en={<><strong>Create the folder and the file.</strong> The folder name is the skill name, and the file is called <code>SKILL.md</code> exactly like that, in capitals.</>} /></li>
          <li><T pt={<><strong>Escreva a descrição.</strong> É o campo mais importante (veja <a href="#rules">regras</a>): o que a skill faz <em>e quando usá-la</em>, com as palavras que o usuário usaria.</>} en={<><strong>Write the description.</strong> It is the most important field (see <a href="#rules">rules</a>): what the skill does <em>and when to use it</em>, with the words the user would use.</>} /></li>
          <li><T pt={<><strong>Escreva o corpo como um procedimento</strong>: passos numerados, uma seção de armadilhas (gotchas), o modelo de saída. Curto: tudo que está lá fica no contexto enquanto a skill estiver ativa.</>} en={<><strong>Write the body as a procedure</strong>: numbered steps, a gotchas section, the output template. Keep it short: everything in it stays in context while the skill is active.</>} /></li>
          <li><T pt={<><strong>Mova o que é longo ou raro para arquivos de apoio</strong> (<code>references/</code>, <code>assets/</code>) e diga no corpo <em>quando</em> ler cada um. Ponha em <code>scripts/</code> o que precisa ser determinístico.</>} en={<><strong>Move what is long or rare into supporting files</strong> (<code>references/</code>, <code>assets/</code>) and say in the body <em>when</em> to read each one. Put in <code>scripts/</code> what must be deterministic.</>} /></li>
          <li><T pt={<><strong>Valide e teste</strong> (veja o <a href="#lab">laboratório</a>): o formato com um linter, e o disparo com perguntas reais.</>} en={<><strong>Validate and test</strong> (see the <a href="#lab">lab</a>): the format with a linter, and the triggering with real prompts.</>} /></li>
        </ol>
        <p><T pt="Exemplo completo: uma skill de revisão de código. Estrutura:" en="A complete example: a code review skill. Structure:" /></p>
        <CodeBlock code={`reviewing-code/
├── SKILL.md                      # obrigatório: metadados + procedimento
├── scripts/changed-files.sh      # roda, não é lido: lista os arquivos alterados
└── references/security-checklist.md   # só é lido se a mudança tocar em segurança`} />
        <CodeBlock code={`---
name: reviewing-code
description: Reviews a code change (a diff, branch or pull request) and reports findings ranked by severity. Use when the user asks to review code, a PR or a diff, or says "look over my changes", even if they never say "review".
---

# Reviewing code

## Steps

1. Get the change: run \`scripts/changed-files.sh\` and read every listed file in full, not only the diff lines.
2. Check in this order: correctness bugs, security, tests, readability.
   - If the change touches authentication, input parsing, SQL, file paths or secrets, read \`references/security-checklist.md\` first.
3. Report with the template below. Do not edit files unless the user asks.

## Gotchas

- Lockfiles, \`dist/\` and generated code are not reviewed; say they were skipped.
- A missing test is a finding only if the changed behaviour is observable. Do not demand tests for renames.
- Never mark something "critical" without naming the input that triggers it.

## Output template

\`\`\`markdown
## Summary
[one sentence: what the change does and your verdict]

## Findings
- **[critical|major|minor] file:line** — what is wrong, the input that triggers it, a suggested fix

## Not reviewed
[files skipped and why]
\`\`\``} />
        <ul className="ds-list">
          <li><T pt={<><strong>A descrição</strong> diz o que faz (“revisa uma mudança e reporta por severidade”) e quando usar, inclusive quando o usuário <em>não</em> diz a palavra “review” (“olha as minhas mudanças”).</>} en={<><strong>The description</strong> says what it does (“reviews a change and reports by severity”) and when to use it, including when the user <em>does not</em> say the word “review” (“look over my changes”).</>} /></li>
          <li><T pt={<><strong>Os passos</strong> dão uma ordem (bugs, segurança, testes, legibilidade) e um gatilho para o arquivo de apoio: “se a mudança toca autenticação, SQL, arquivos ou segredos, leia <code>references/security-checklist.md</code>”. É melhor do que um genérico “veja references/”.</>} en={<><strong>The steps</strong> give an order (bugs, security, tests, readability) and a trigger for the supporting file: “if the change touches authentication, SQL, files or secrets, read <code>references/security-checklist.md</code>”. That beats a generic “see references/”.</>} /></li>
          <li><T pt={<><strong>As armadilhas</strong> são correções concretas (“lockfiles não se revisam”, “nunca marque como crítico sem dizer a entrada que dispara”). Sempre que você precisar corrigir o agente numa revisão, acrescente a correção aqui: é o jeito mais direto de melhorar uma skill.</>} en={<><strong>The gotchas</strong> are concrete corrections (“lockfiles are not reviewed”, “never mark critical without naming the triggering input”). Whenever you have to correct the agent in a review, add the correction here: it is the most direct way to improve a skill.</>} /></li>
          <li><T pt={<><strong>O modelo de saída</strong> garante que toda revisão tenha o mesmo formato.</>} en={<><strong>The output template</strong> guarantees every review has the same format.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Cuidado com dois-pontos na descrição.</strong> O cabeçalho é YAML, e <code>description: Cuts a release: bumps the version</code> é inválido (“mapping values are not allowed here”): o segundo <code>:</code> abre um mapa. Reescreva sem dois-pontos ou ponha a descrição entre aspas. Foi um erro real que o linter da atividade 2 pegou ao montar os exemplos. Não verifiquei como cada agente reage a um YAML inválido (a documentação do Claude Code só afirma que campos não reconhecidos são ignorados sem erro), então valide antes de confiar que a skill foi carregada.</>} en={<><strong>Beware of colons in the description.</strong> The header is YAML, and <code>description: Cuts a release: bumps the version</code> is invalid (“mapping values are not allowed here”): the second <code>:</code> opens a map. Rewrite without a colon or put the description in quotes. It was a real mistake that the activity 2 linter caught while I built the examples. I did not check how each agent reacts to invalid YAML (the Claude Code documentation only states that unrecognised fields are ignored without an error), so validate before trusting that the skill was loaded.</>} /></Callout>
      </Section>
      <Section id="where" title={<T pt="Onde ficam e o que cada agente acrescenta" en="Where they live and what each agent adds" />}>
        <p><T pt={<>O núcleo é o mesmo em todos: <code>name</code> e <code>description</code> obrigatórios, mais <code>license</code>, <code>compatibility</code>, <code>metadata</code> e <code>allowed-tools</code> (este experimental, com suporte variável). Muda onde cada agente procura as pastas e o que ele permite configurar além do núcleo:</>} en={<>The core is the same everywhere: <code>name</code> and <code>description</code> required, plus <code>license</code>, <code>compatibility</code>, <code>metadata</code> and <code>allowed-tools</code> (the latter experimental, with varying support). What changes is where each agent looks for folders and what it lets you configure beyond the core:</>} /></p>
        <Table
          head={[<T pt="Agente" en="Agent" />, <T pt="Onde procura" en="Where it looks" />, <T pt="Extras além do núcleo" en="Extras beyond the core" />]}
          rows={[
            ["Claude Code", <><code>~/.claude/skills/</code> (<T pt="pessoal" en="personal" />), <code>.claude/skills/</code> (<T pt="projeto, vai no Git" en="project, goes in Git" />), <T pt="plugins, política da organização; também pastas aninhadas em monorepos" en="plugins, organisation policy; also nested folders in monorepos" /></>, <T pt={<>Campos como <code>disable-model-invocation</code> (só você chama), <code>user-invocable</code> (só o modelo chama), <code>allowed-tools</code>, <code>context: fork</code> (roda num subagente), <code>paths</code> (só carrega para certos arquivos), <code>arguments</code> e <code>$ARGUMENTS</code>; <code>/nome</code> chama na mão; blocos <code>!`comando`</code> rodam antes de o modelo ver a skill.</>} en={<>Fields such as <code>disable-model-invocation</code> (only you call it), <code>user-invocable</code> (only the model calls it), <code>allowed-tools</code>, <code>context: fork</code> (runs in a subagent), <code>paths</code> (loads only for certain files), <code>arguments</code> and <code>$ARGUMENTS</code>; <code>/name</code> calls it by hand; <code>!`command`</code> blocks run before the model sees the skill.</>} />],
            ["Codex", <><code>.agents/skills/</code> <T pt="no diretório atual e em cada pai até a raiz do repo" en="in the current directory and each parent up to the repo root" />; <code>~/.agents/skills/</code>; <code>/etc/codex/skills/</code> (<T pt="máquina" en="machine" />); <T pt={<>skills do sistema (inclui o <code>skill-creator</code>)</>} en={<>system skills (including <code>skill-creator</code>)</>} /></>, <T pt={<>Arquivo opcional <code>agents/openai.yaml</code>: <code>interface</code> (nome e ícone no app), <code>policy.allow_implicit_invocation: false</code> (só dispara com <code>$skill</code> explícito) e <code>dependencies.tools</code> (servidores MCP exigidos). <code>$skill-creator</code> cria uma skill conversando.</>} en={<>Optional <code>agents/openai.yaml</code> file: <code>interface</code> (name and icon in the app), <code>policy.allow_implicit_invocation: false</code> (fires only on an explicit <code>$skill</code>) and <code>dependencies.tools</code> (required MCP servers). <code>$skill-creator</code> creates a skill through conversation.</>} />],
            ["opencode", <><code>.opencode/skills/</code>, <code>~/.config/opencode/skills/</code>, <T pt="e também lê" en="and also reads" /> <code>.claude/skills/</code> <T pt="e" en="and" /> <code>.agents/skills/</code> (<T pt="projeto e global" en="project and global" />)</>, <T pt={<>Só o núcleo (campos desconhecidos são ignorados). O controle fica em <code>opencode.json</code>: <code>permission.skill</code> com padrões <code>allow</code> / <code>deny</code> / <code>ask</code> (por exemplo <code>"internal-*": "deny"</code>), por agente.</>} en={<>Only the core (unknown fields are ignored). Control lives in <code>opencode.json</code>: <code>permission.skill</code> with <code>allow</code> / <code>deny</code> / <code>ask</code> patterns (for example <code>"internal-*": "deny"</code>), per agent.</>} />],
            ["Hermes", <><code>~/.hermes/skills/</code> (<T pt="a fonte da verdade" en="the source of truth" />), <code>skills.external_dirs</code> <T pt={<>no <code>config.yaml</code></>} en={<>in <code>config.yaml</code></>} />; <code>.hermes/skills/</code> <T pt="ou" en="or" /> <code>.agents/skills/</code> <T pt={<>do projeto só depois de <code>hermes skills trust</code></>} en={<>of the project only after <code>hermes skills trust</code></>} /></>, <T pt={<><code>version</code>, <code>platforms</code>, <code>metadata.hermes.*</code> (tags, categoria, ativação condicional por <code>requires_toolsets</code> / <code>fallback_for_tools</code>), <code>required_environment_variables</code>. Toda skill vira um comando <code>/nome</code>, e o próprio agente pode criar e remendar skills (<code>skill_manage</code>), com aprovação opcional.</>} en={<><code>version</code>, <code>platforms</code>, <code>metadata.hermes.*</code> (tags, category, conditional activation through <code>requires_toolsets</code> / <code>fallback_for_tools</code>), <code>required_environment_variables</code>. Every skill becomes a <code>/name</code> command, and the agent itself can create and patch skills (<code>skill_manage</code>), with optional approval.</>} />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="Cada agente procura num diretório. Guardar a skill uma vez e apontar os outros por symlink evita cópias que se desencontram." en="Each agent looks in a directory. Keeping the skill once and pointing the others at it with a symlink avoids copies that drift apart." />}>
          <svg viewBox="0 0 700 240" role="img" aria-label="Um layout portátil / A portable layout">
            <rect x="10" y="70" width="250" height="90" rx="4" className="brandfill" />
            <text x="135" y="92" className="mono" textAnchor="middle">.agents/skills/reviewing-code/</text>
            <text x="135" y="112" className="pt mut" textAnchor="middle">a fonte única, versionada no Git</text>
            <text x="135" y="112" className="en mut" textAnchor="middle">the single source, versioned in Git</text>
            <text x="135" y="130" className="mono mut" textAnchor="middle">SKILL.md · scripts/ · references/</text>
            <rect x="300" y="20" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="40" textAnchor="middle">Codex</text>
            <text x="435" y="56" className="pt mut" textAnchor="middle">lê .agents/skills</text>
            <text x="435" y="56" className="en mut" textAnchor="middle">reads .agents/skills</text>
            <rect x="300" y="74" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="94" textAnchor="middle">opencode</text>
            <text x="435" y="110" className="pt mut" textAnchor="middle">lê .agents/skills e .claude/skills</text>
            <text x="435" y="110" className="en mut" textAnchor="middle">reads .agents/skills and .claude/skills</text>
            <rect x="300" y="128" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="148" textAnchor="middle">Hermes</text>
            <text x="435" y="164" className="pt mut" textAnchor="middle">lê .agents/skills (após confiar no repo)</text>
            <text x="435" y="164" className="en mut" textAnchor="middle">reads .agents/skills (after trusting the repo)</text>
            <rect x="300" y="182" width="270" height="44" rx="4" className="ln" />
            <text x="435" y="202" textAnchor="middle">Claude Code</text>
            <text x="435" y="218" className="pt mut" textAnchor="middle">lê .claude/skills</text>
            <text x="435" y="218" className="en mut" textAnchor="middle">reads .claude/skills</text>
            <path d="M260 100L300 44" className="ln" />
            <path d="M298.8 50.9L300 44L293.9 47.4" className="ln" />
            <path d="M260 108L300 96" className="ln" />
            <path d="M294.8 100.7L300 96L293.1 94.9" className="ln" />
            <path d="M260 118L300 150" className="ln" />
            <path d="M293.2 148.4L300 150L297.0 143.7" className="ln" />
            <path d="M260 140L280 140L280 204L300 204" className="ln dash" fill="none" />
            <path d="M290 204L300 204" className="ln" />
            <path d="M293.7 207.0L300 204L293.7 201.0" className="ln" />
            <text x="268" y="176" className="mono mut" textAnchor="end">symlink</text>
          </svg>
        </Diagram>
        <p><T pt={<><strong>Dica de portabilidade:</strong> escreva a skill só com o núcleo da especificação, guarde-a em <code>.agents/skills/</code> (que Codex, opencode e Hermes leem) e crie um symlink em <code>.claude/skills/</code> para o Claude Code. As documentações do Claude Code e do Codex dizem expressamente que aceitam uma pasta de skill que seja symlink. O que for específico de um agente (<code>disable-model-invocation</code>, <code>agents/openai.yaml</code>, <code>metadata.hermes</code>) acrescente só quando precisar: os outros agentes ignoram campos que não conhecem (o opencode diz isso expressamente), mas a documentação do Claude Code avisa que empacotar uma skill para o claude.ai com campos fora do conjunto aberto falha.</>} en={<><strong>Portability tip:</strong> write the skill with only the specification's core, keep it in <code>.agents/skills/</code> (which Codex, opencode and Hermes read) and create a symlink in <code>.claude/skills/</code> for Claude Code. The Claude Code and Codex documentation both say they accept a skill folder that is a symlink. Add what is specific to one agent (<code>disable-model-invocation</code>, <code>agents/openai.yaml</code>, <code>metadata.hermes</code>) only when you need it: other agents ignore fields they do not know (opencode says so explicitly), but the Claude Code documentation warns that packaging a skill for claude.ai with fields outside the open set fails.</>} /></p>
        <CodeBlock code={`mkdir -p .agents/skills .claude/skills
cp -r reviewing-code .agents/skills/
ln -s ../../.agents/skills/reviewing-code .claude/skills/reviewing-code`} />
        <Callout icon="check"><T pt={<><strong>Nomes duplicados.</strong> O Codex não funde skills com o mesmo <code>name</code> (as duas aparecem), e o opencode exige nomes únicos entre todos os locais. Como o opencode lê <code>.claude/skills</code> <em>e</em> <code>.agents/skills</code>, o symlink da dica acima pode fazer a mesma skill aparecer duas vezes lá. Se isso acontecer, é o primeiro lugar para olhar.</>} en={<><strong>Duplicate names.</strong> Codex does not merge skills with the same <code>name</code> (both appear), and opencode requires unique names across all locations. Since opencode reads <code>.claude/skills</code> <em>and</em> <code>.agents/skills</code>, the symlink in the tip above may make the same skill show up twice there. If that happens, it is the first place to look.</>} /></Callout>
      </Section>
      <Section id="split" title={<T pt="Quando dividir uma skill em duas (ou juntar)" en="When to split a skill in two (or merge)" />}>
        <p><T pt={<>A especificação compara a escolha ao desenho de uma função: uma skill deve ser <em>uma unidade coerente de trabalho que se combina bem com as outras</em>. Estreita demais, e várias skills precisam carregar para uma só tarefa, com custo de contexto e instruções que se contradizem. Larga demais, e fica difícil de ativar com precisão (o exemplo oficial: uma skill que consulta um banco e formata o resultado é uma unidade; se ela também faz administração do banco, está tentando fazer demais).</>} en={<>The specification compares the choice to function design: a skill should be <em>a coherent unit of work that composes well with the others</em>. Too narrow, and several skills must load for a single task, costing context and giving contradicting instructions. Too broad, and it becomes hard to activate precisely (the official example: a skill that queries a database and formats the result is one unit; if it also does database administration, it is trying to do too much).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Divida por intenção do usuário e por risco. Divida o conteúdo, não a skill, quando o problema é só tamanho." en="Split by user intent and by risk. Split the content, not the skill, when the problem is only size." />}>
          <svg viewBox="0 0 700 287" role="img" aria-label="Dividir ou não / To split or not">
            <rect x="10" y="15" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="39" className="pt" textAnchor="middle">Gatilhos diferentes?</text>
            <text x="135" y="39" className="en" textAnchor="middle">Different triggers?</text>
            <path d="M260 34L330 34" className="ln" />
            <path d="M323.7 37.0L330 34L323.7 31.0" className="ln" />
            <text x="295" y="26" className="pt mono mut" textAnchor="middle">sim</text>
            <text x="295" y="26" className="en mono mut" textAnchor="middle">yes</text>
            <rect x="330" y="15" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="39" className="pt" textAnchor="middle">dividir por intenção</text>
            <text x="445" y="39" className="en" textAnchor="middle">split by intent</text>
            <path d="M135 53L135 71" className="ln" />
            <path d="M132.0 64.7L135 71L138.0 64.7" className="ln" />
            <text x="150" y="67" className="pt mono mut" textAnchor="start">não</text>
            <text x="150" y="67" className="en mono mut" textAnchor="start">no</text>
            <rect x="10" y="71" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="95" className="pt" textAnchor="middle">Risco ou permissão diferentes?</text>
            <text x="135" y="95" className="en" textAnchor="middle">Different risk or permissions?</text>
            <path d="M260 90L330 90" className="ln" />
            <path d="M323.7 93.0L330 90L323.7 87.0" className="ln" />
            <text x="295" y="82" className="pt mono mut" textAnchor="middle">sim</text>
            <text x="295" y="82" className="en mono mut" textAnchor="middle">yes</text>
            <rect x="330" y="71" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="95" className="pt" textAnchor="middle">dividir por risco</text>
            <text x="445" y="95" className="en" textAnchor="middle">split by risk</text>
            <path d="M135 109L135 127" className="ln" />
            <path d="M132.0 120.7L135 127L138.0 120.7" className="ln" />
            <text x="150" y="123" className="pt mono mut" textAnchor="start">não</text>
            <text x="150" y="123" className="en mono mut" textAnchor="start">no</text>
            <rect x="10" y="127" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="151" className="pt" textAnchor="middle">Partes usadas só às vezes?</text>
            <text x="135" y="151" className="en" textAnchor="middle">Parts used only sometimes?</text>
            <path d="M260 146L330 146" className="ln" />
            <path d="M323.7 149.0L330 146L323.7 143.0" className="ln" />
            <text x="295" y="138" className="pt mono mut" textAnchor="middle">sim</text>
            <text x="295" y="138" className="en mono mut" textAnchor="middle">yes</text>
            <rect x="330" y="127" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="151" className="pt" textAnchor="middle">mover para references/</text>
            <text x="445" y="151" className="en" textAnchor="middle">move to references/</text>
            <path d="M135 165L135 183" className="ln" />
            <path d="M132.0 176.7L135 183L138.0 176.7" className="ln" />
            <text x="150" y="179" className="pt mono mut" textAnchor="start">não</text>
            <text x="150" y="179" className="en mono mut" textAnchor="start">no</text>
            <rect x="10" y="183" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="207" className="pt" textAnchor="middle">Sempre carregam juntas?</text>
            <text x="135" y="207" className="en" textAnchor="middle">Always loaded together?</text>
            <path d="M260 202L330 202" className="ln" />
            <path d="M323.7 205.0L330 202L323.7 199.0" className="ln" />
            <text x="295" y="194" className="pt mono mut" textAnchor="middle">sim</text>
            <text x="295" y="194" className="en mono mut" textAnchor="middle">yes</text>
            <rect x="330" y="183" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="207" className="pt" textAnchor="middle">juntar numa só</text>
            <text x="445" y="207" className="en" textAnchor="middle">merge into one</text>
            <path d="M135 221L135 243" className="ln" />
            <path d="M132.0 236.7L135 243L138.0 236.7" className="ln" />
            <text x="150" y="235" className="pt mono mut" textAnchor="start">não</text>
            <text x="150" y="235" className="en mono mut" textAnchor="start">no</text>
            <rect x="10" y="243" width="250" height="34" rx="4" className="ln" />
            <text x="135" y="265" className="pt" textAnchor="middle">uma skill, bem descrita</text>
            <text x="135" y="265" className="en" textAnchor="middle">one well-described skill</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Sinal" en="Signal" />, <T pt="Faça" en="Do" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<><strong><T pt="Dois gatilhos diferentes" en="Two different triggers" /></strong><br /><T pt="A descrição virou uma lista de “e/ou” de intenções que não se parecem." en="The description became an “and/or” list of intents that do not resemble each other." /></>, <strong><T pt="Divida por intenção." en="Split by intent." /></strong>, <T pt={<><code>reviewing-code</code> (“olhe minhas mudanças”) e <code>writing-functional-requirements</code> (“o que isso deve fazer?”): o usuário pede coisas diferentes, em momentos diferentes.</>} en={<><code>reviewing-code</code> (“look at my changes”) and <code>writing-functional-requirements</code> (“what should this do?”): the user asks for different things, at different moments.</>} />],
            [<strong><T pt="Risco ou permissão diferentes" en="Different risk or permissions" /></strong>, <strong><T pt="Divida por risco." en="Split by risk." /></strong>, <T pt={<><code>reviewing-security</code> só lê (<code>allowed-tools: Read Grep</code>); <code>releasing-version</code> publica e usa <code>disable-model-invocation: true</code>, para só rodar quando você pedir. Misturar as duas obrigaria a dar à revisão os poderes do release.</>} en={<><code>reviewing-security</code> only reads (<code>allowed-tools: Read Grep</code>); <code>releasing-version</code> publishes and uses <code>disable-model-invocation: true</code>, so it only runs when you ask. Mixing them would force giving the review the release's powers.</>} />],
            [<strong><T pt="Quem chama é diferente" en="A different caller" /></strong>, <strong><T pt="Divida por modo de uso." en="Split by mode of use." /></strong>, <T pt={<>Um workflow que <em>você</em> dispara (<code>/handoff</code>) e um conhecimento que o <em>modelo</em> aplica sozinho (convenções de código) têm descrições e riscos diferentes.</>} en={<>A workflow that <em>you</em> trigger (<code>/handoff</code>) and knowledge the <em>model</em> applies on its own (code conventions) have different descriptions and risks.</>} />],
            [<strong><T pt="Corpo grande, mas uma só intenção" en="A big body, but one intent" /></strong>, <strong><T pt="Não divida a skill: divida o conteúdo" en="Do not split the skill: split the content" /></strong>, <T pt={<>Passe de 500 linhas? Mova o detalhe para <code>references/</code> por tema (<code>references/finance.md</code>, <code>references/sales.md</code>) e diga no corpo quando ler cada um. A skill continua uma só.</>} en={<>Past 500 lines? Move the detail into <code>references/</code> by topic (<code>references/finance.md</code>, <code>references/sales.md</code>) and say in the body when to read each. The skill stays one.</>} />],
            [<strong><T pt="Duas skills sempre carregam juntas" en="Two skills always load together" /></strong>, <strong><T pt="Junte." en="Merge." /></strong>, <T pt={<>Se <code>formatting-report</code> nunca roda sem <code>querying-database</code>, é uma unidade só.</>} en={<>If <code>formatting-report</code> never runs without <code>querying-database</code>, it is a single unit.</>} />],
            [<strong><T pt="Instruções que se contradizem entre skills" en="Instructions that contradict across skills" /></strong>, <strong><T pt="Junte, ou deixe uma delas fora do disparo automático." en="Merge, or take one out of automatic triggering." /></strong>, <T pt="Duas skills de “commit” com convenções diferentes: escolha uma e remova a outra, ou desligue o disparo automático de uma." en="Two “commit” skills with different conventions: pick one and remove the other, or turn off automatic triggering for one." />],
          ]}
        />
        <p><T pt={<><strong>Um teste rápido para a descrição:</strong> se você precisa de “e” para dizer <em>quando</em> usar a skill, e os dois lados do “e” não costumam aparecer na mesma conversa, provavelmente são duas skills. Se o “e” está no <em>procedimento</em> (consulta e formata), provavelmente é uma.</>} en={<><strong>A quick test for the description:</strong> if you need “and” to say <em>when</em> to use the skill, and the two sides of the “and” do not usually show up in the same conversation, they are probably two skills. If the “and” is in the <em>procedure</em> (queries and formats), it is probably one.</>} /></p>
      </Section>
      <Section id="themes" title={<T pt="Skills por tema: o que muda em cada uma" en="Skills by theme: what changes in each" />}>
        <p><T pt={<>O formato é o mesmo, mas o <em>desenho</em> muda com o tema. Duas perguntas orientam: <strong>quão frágil é a tarefa?</strong> (frágil pede passos exatos e scripts; flexível pede um critério e um modelo de saída) e <strong>qual o risco?</strong> (leitura apenas, ou ação com efeito). As boas práticas oficiais chamam o primeiro ponto de “calibrar o grau de liberdade”: uma ponte estreita com abismos dos dois lados pede instruções exatas; um campo aberto pede só a direção.</>} en={<>The format is the same, but the <em>design</em> changes with the theme. Two questions guide it: <strong>how fragile is the task?</strong> (fragile asks for exact steps and scripts; flexible asks for a criterion and an output template) and <strong>what is the risk?</strong> (read only, or an action with effects). The official best practices call the first point “calibrating the degree of freedom”: a narrow bridge with cliffs on both sides calls for exact instructions; an open field only needs a direction.</>} /></p>
        <Table
          head={[<T pt="Tema" en="Theme" />, <T pt="O que a skill contém" en="What the skill contains" />, <T pt="Liberdade" en="Freedom" />, <T pt="Risco e cuidados" en="Risk and cautions" />]}
          rows={[
            [<strong><T pt="Código e convenções" en="Code and conventions" /></strong>, <T pt={<>Estrutura do projeto, comandos de build e teste, padrões de nomes, armadilhas do repositório (“o ID é <code>user_id</code> no banco e <code>uid</code> no auth”).</>} en={<>Project structure, build and test commands, naming patterns, repository traps (“the ID is <code>user_id</code> in the database and <code>uid</code> in auth”).</>} />, <T pt="Média" en="Medium" />, <T pt={<>Baixo. Mantenha curto: o que vale em <em>toda</em> tarefa vai no AGENTS.md; a skill é para tarefas específicas.</>} en={<>Low. Keep it short: what holds in <em>every</em> task goes in AGENTS.md; the skill is for specific tasks.</>} />],
            [<strong>Review</strong>, <T pt="Ordem de verificação, o que ignorar (arquivos gerados), escala de severidade, modelo de saída. Exemplo da seção de criação." en="Order of checks, what to ignore (generated files), severity scale, output template. Example in the creation section." />, <T pt="Alta nos critérios, baixa no formato" en="High on criteria, low on format" />, <T pt="Baixo se só reporta. Diga “não edite arquivos a menos que peçam”." en="Low if it only reports. Say “do not edit files unless asked”." />],
            [<strong><T pt="Segurança" en="Security" /></strong>, <T pt="Pontos de entrada, o que cada um confia, o que verificar (validação, autenticação, injeção, segredos), e a regra de ouro: achado sem gatilho concreto é nota, não achado." en="Entry points, what each one trusts, what to check (validation, authentication, injection, secrets), and the golden rule: a finding with no concrete trigger is a note, not a finding." />, <T pt="Média, com formato fixo" en="Medium, with a fixed format" />, <T pt={<><strong>Somente leitura</strong>: restrinja <code>allowed-tools</code> a leitura e busca, e diga “não altere, não rode, não use a rede”. A skill de segurança <em>não</em> deve ter poder de corrigir; separe a correção em outra.</>} en={<><strong>Read only</strong>: restrict <code>allowed-tools</code> to reading and search, and say “do not change, run or use the network”. The security skill must <em>not</em> have the power to fix; split the fix into another one.</>} />],
            [<strong><T pt="Requisitos funcionais" en="Functional requirements" /></strong>, <T pt="Perguntas de esclarecimento (poucas), modelo de requisito numerado, critérios de aceitação Given/When/Then, lista de perguntas em aberto. Sem desenho nem código." en="Clarifying questions (few), numbered requirement template, Given/When/Then acceptance criteria, an open-questions list. No design or code." />, <T pt="Baixa no formato, alta no conteúdo" en="Low on format, high on content" />, <T pt={<>Baixo. O valor está nas <em>proibições</em> (“não proponha solução”, “não adivinhe respostas”) e no modelo em <code>assets/</code>.</>} en={<>Low. The value is in the <em>prohibitions</em> (“do not propose a solution”, “do not guess answers”) and in the template in <code>assets/</code>.</>} />],
            [<strong><T pt="Testes" en="Tests" /></strong>, <T pt="Como rodar a suíte, onde ficam os testes, o padrão de nomes, o que mockar e o que nunca mockar." en="How to run the suite, where tests live, the naming pattern, what to mock and what never to mock." />, <T pt="Média" en="Medium" />, <T pt="Médio: rodar testes executa código. Liste os comandos permitidos, não “qualquer comando”." en="Medium: running tests executes code. List the allowed commands, not “any command”." />],
            [<strong><T pt="Release e deploy" en="Release and deploy" /></strong>, <T pt="Uma sequência exata, com verificação a cada passo e parada na primeira falha." en="An exact sequence, with a check at each step and a stop at the first failure." />, <T pt={<><strong>Mínima</strong>: scripts e “rode exatamente isto”</>} en={<><strong>Minimal</strong>: scripts and “run exactly this”</>} />, <T pt={<><strong>Alto.</strong> Tem efeito no mundo: só você deve disparar (<code>disable-model-invocation: true</code> no Claude Code; <code>allow_implicit_invocation: false</code> no Codex) e sempre com confirmação.</>} en={<><strong>High.</strong> It has effects on the world: only you should trigger it (<code>disable-model-invocation: true</code> in Claude Code; <code>allow_implicit_invocation: false</code> in Codex) and always with confirmation.</>} />],
            [<strong><T pt="Documentação e commits" en="Docs and commits" /></strong>, <T pt={<>Formato (por exemplo Conventional Commits), tom, e <em>exemplos de entrada e saída</em>.</>} en={<>Format (for example Conventional Commits), tone, and <em>input and output examples</em>.</>} />, <T pt="Baixa no formato" en="Low on format" />, <T pt="Baixo. Exemplos concretos ensinam o estilo melhor do que descrições." en="Low. Concrete examples teach the style better than descriptions." />],
          ]}
        />
        <h3><T pt="Dois exemplos testados" en="Two tested examples" /></h3>
        <p><T pt={<><strong>Requisitos funcionais.</strong> Repare nas proibições e no limite de perguntas, que impedem os dois erros típicos (interrogar demais e já sair desenhando):</>} en={<><strong>Functional requirements.</strong> Note the prohibitions and the question limit, which prevent the two typical mistakes (interrogating too much and starting to design right away):</>} /></p>
        <CodeBlock code={`---
name: writing-functional-requirements
description: Turns a feature idea into numbered functional requirements with acceptance criteria. Use when the user describes a feature, asks for requirements, a spec or user stories, or says "what should this do", before any code is written.
---

# Writing functional requirements

1. Ask at most five clarifying questions, only about things that change the behaviour (who, trigger, data, failure case, limits). If the user already answered, skip them.
2. Write each requirement as one observable behaviour, using the template in \`assets/requirement-template.md\`.
3. Give every requirement acceptance criteria in Given / When / Then form.
4. End with an "Open questions" list. Do not guess answers to them.
5. Do not propose a design, a database schema or code.

## Gotchas

- "Fast", "easy" and "secure" are not requirements until they have a number or a test.
- One requirement, one behaviour: split any requirement that contains "and".`} />
        <p><T pt={<><strong>Segurança, somente leitura.</strong> Os campos opcionais <code>license</code>, <code>compatibility</code> e <code>allowed-tools</code> da especificação deixam o limite explícito, e o corpo repete a regra em palavras, porque <code>allowed-tools</code> tem suporte variável entre agentes:</>} en={<><strong>Security, read only.</strong> The specification's optional <code>license</code>, <code>compatibility</code> and <code>allowed-tools</code> fields make the limit explicit, and the body repeats the rule in words, because <code>allowed-tools</code> has varying support across agents:</>} /></p>
        <CodeBlock code={`---
name: reviewing-security
description: Audits code or configuration for security weaknesses and reports them without changing anything. Use when the user asks for a security review, threat check, or whether something is safe to expose, or touches authentication, secrets, uploads or user input.
license: MIT
compatibility: Read-only. Needs only file reading and search; no network access.
allowed-tools: Read Grep
---

# Reviewing security

Report only. Never edit files, run the application or contact the network.

1. List the entry points (routes, handlers, CLI arguments, files read) and the data each one trusts.
2. For each, check: input validation, authentication and authorisation, secrets handling, injection (SQL, shell, path), and error messages.
3. Rank findings by exploitability: name the exact input or request that triggers each one. A finding without a trigger is a "note", not a finding.
4. End with what you could not check.`} />
        <p><T pt={<>Note que ela <strong>repete a restrição no texto</strong> (“Report only. Never edit files…”). É um cinto e suspensório: o campo pede ao agente que restrinja as ferramentas, e o texto diz ao modelo o que fazer mesmo onde o campo não é respeitado. Nenhum dos dois é uma garantia (veja <a href="#security">segurança</a>).</>} en={<>Note that it <strong>repeats the restriction in the text</strong> (“Report only. Never edit files…”). It is belt and braces: the field asks the agent to restrict tools, and the text tells the model what to do even where the field is not honoured. Neither is a guarantee (see <a href="#security">security</a>).</>} /></p>
      </Section>
      <Section id="rules" title={<T pt="Regras que fazem uma skill funcionar" en="Rules that make a skill work" />}>
        <Table
          head={[<T pt="Regra" en="Rule" />, <T pt="Por quê, e como" en="Why, and how" />]}
          rows={[
            [<strong><T pt="A descrição carrega o disparo" en="The description carries the trigger" /></strong>, <T pt={<>É o único texto sempre carregado, e o agente decide por ela. Diga o que faz <em>e quando usar</em>, descreva a <em>intenção do usuário</em> (não a mecânica interna), liste contextos em que se aplica mesmo sem a palavra óbvia, e seja “insistente” sem passar de 1024 caracteres (no Claude Code, <code>description</code> e <code>when_to_use</code> juntos são cortados em 1536 na listagem: ponha o caso principal primeiro). Bom: “Extrai texto e tabelas de PDFs… Use quando o usuário mencionar PDFs, formulários ou extração de documentos.” Ruim: “Ajuda com PDFs.”</>} en={<>It is the only text always loaded, and the agent decides by it. Say what it does <em>and when to use it</em>, describe the <em>user's intent</em> (not the internal mechanics), list contexts where it applies even without the obvious word, and be “pushy” without going past 1024 characters (in Claude Code, <code>description</code> and <code>when_to_use</code> together are truncated at 1,536 in the listing: put the main case first). Good: “Extracts text and tables from PDFs… Use when the user mentions PDFs, forms or document extraction.” Bad: “Helps with PDFs.”</>} />],
            [<strong><T pt="Uma convenção de voz, mantida" en="One voice convention, kept" /></strong>, <T pt="As duas fontes oficiais divergem num detalhe: a especificação aberta sugere o imperativo (“Use esta skill quando…”); o guia da Anthropic pede terceira pessoa (“Processa arquivos Excel…”), porque a descrição é injetada no prompt do sistema. Escolha uma e use em todas as suas skills." en="The two official sources differ on one detail: the open specification suggests the imperative (“Use this skill when…”); Anthropic's guide asks for third person (“Processes Excel files…”), because the description is injected into the system prompt. Pick one and use it across all your skills." />],
            [<strong><T pt="Só o que o agente não sabe" en="Only what the agent does not know" /></strong>, <T pt="Para cada trecho, pergunte: “o agente erraria sem isto?”. Se não, corte. Explicar o que é um PDF gasta contexto e não ajuda." en="For each piece, ask: “would the agent get this wrong without it?”. If not, cut it. Explaining what a PDF is costs context and does not help." />],
            [<strong><T pt="Padrões, não cardápios" en="Defaults, not menus" /></strong>, <T pt="Escolha uma ferramenta e cite as alternativas em uma linha. “Use pdfplumber; para PDFs escaneados use pdf2image com pytesseract” funciona; uma lista de cinco bibliotecas iguais não." en="Pick one tool and mention the alternatives in a line. “Use pdfplumber; for scanned PDFs use pdf2image with pytesseract” works; a list of five equal libraries does not." />],
            [<strong><T pt="Procedimentos, não respostas" en="Procedures, not answers" /></strong>, <T pt={<>Ensine <em>como abordar</em> uma classe de problemas (leia o esquema, junte pelas chaves <code>_id</code>, filtre, agregue), não a resposta de um caso (“junte <code>orders</code> com <code>customers</code>…”).</>} en={<>Teach <em>how to approach</em> a class of problems (read the schema, join on the <code>_id</code> keys, filter, aggregate), not the answer to one case (“join <code>orders</code> with <code>customers</code>…”).</>} />],
            [<strong><T pt="Armadilhas dentro do SKILL.md" en="Gotchas inside SKILL.md" /></strong>, <T pt="São o conteúdo de maior valor: correções concretas a erros que o agente cometeria. Deixe no corpo, não num arquivo separado, porque o agente pode não reconhecer o momento de abrir o arquivo." en="They are the highest-value content: concrete corrections to mistakes the agent would make. Keep them in the body, not in a separate file, because the agent may not recognise the moment to open the file." />],
            [<strong><T pt="Validação e plano antes de agir" en="Validation and a plan before acting" /></strong>, <T pt="Em tarefas em lote ou destrutivas: gerar um plano, validar contra a fonte da verdade com um script que dá erro claro (“campo X não existe; disponíveis: …”), e só então executar. Para tarefas longas, uma lista de verificação que o agente marca." en="In batch or destructive tasks: generate a plan, validate it against the source of truth with a script that gives a clear error (“field X not found; available: …”), and only then execute. For long tasks, a checklist the agent ticks off." />],
            [<strong><T pt="Scripts que resolvem" en="Scripts that solve" /></strong>, <T pt={<>O script trata os erros e diz o que fazer (como o <code>changed-files.sh</code>, que avisa “passe uma branch”) em vez de falhar e deixar o agente adivinhar. Diga se o agente deve <em>rodar</em> ou <em>ler</em> o script. Se você vê o agente reinventando a mesma lógica a cada execução, é hora de empacotar um script testado.</>} en={<>The script handles errors and says what to do (like <code>changed-files.sh</code>, which says “pass a branch”) instead of failing and leaving the agent to guess. Say whether the agent should <em>run</em> or <em>read</em> the script. If you see the agent reinventing the same logic every run, it is time to bundle a tested script.</>} />],
            [<strong><T pt="Arquivos a um nível" en="One level of files" /></strong>, <T pt={<>Link direto do <code>SKILL.md</code> a cada arquivo de apoio, sem cadeias (A aponta para B que aponta para C): o agente pode ler só o começo de arquivos aninhados. Arquivos com mais de 100 linhas ganham um sumário no topo. Nomes descritivos (<code>form_validation_rules.md</code>, não <code>doc2.md</code>) e barras normais nos caminhos.</>} en={<>Link directly from <code>SKILL.md</code> to each supporting file, with no chains (A points to B which points to C): the agent may read only the start of nested files. Files over 100 lines get a table of contents at the top. Descriptive names (<code>form_validation_rules.md</code>, not <code>doc2.md</code>) and forward slashes in paths.</>} />],
            [<strong><T pt="Nada que envelhece" en="Nothing that ages" /></strong>, <T pt="Evite “antes de agosto use a API antiga”. Escreva o método atual e deixe o legado numa seção “padrões antigos”. Use um termo para cada conceito, sempre o mesmo." en="Avoid “before August use the old API”. Write the current method and leave the legacy in an “old patterns” section. Use one term per concept, always the same." />],
            [<strong><T pt="Nomes e tamanho" en="Names and size" /></strong>, <T pt={<>Nome em minúsculas com hífens, igual à pasta, e descritivo (<code>reviewing-code</code>, não <code>helper</code>); o guia da Anthropic sugere o gerúndio. Corpo abaixo de 500 linhas e de cerca de 5000 tokens.</>} en={<>Lowercase hyphenated name, equal to the folder, and descriptive (<code>reviewing-code</code>, not <code>helper</code>); Anthropic's guide suggests the gerund. Body under 500 lines and about 5,000 tokens.</>} />],
          ]}
        />
      </Section>
      <Section id="security" title={<T pt="Segurança: uma skill é código que o agente executa" en="Security: a skill is code the agent runs" />}>
        <p><T pt={<>Instalar uma skill é entregar ao agente <em>instruções e, às vezes, scripts</em> que ele vai seguir com o acesso que você já deu a ele. Uma skill de origem duvidosa pode mandar o agente ler segredos, rodar comandos ou enviar dados para fora, e o texto da skill é só mais um texto para o modelo obedecer. Os próprios agentes trazem controles; use-os:</>} en={<>Installing a skill hands the agent <em>instructions and sometimes scripts</em> that it will follow with the access you already gave it. A skill of doubtful origin can tell the agent to read secrets, run commands or send data out, and the skill's text is just more text for the model to obey. The agents themselves ship controls; use them:</>} /></p>
        <Table
          head={[<T pt="Agente" en="Agent" />, <T pt="Controle (segundo a documentação)" en="Control (per the documentation)" />]}
          rows={[
            ["Claude Code", <T pt={<>Regras de permissão <code>Skill(nome)</code> e <code>Skill(nome *)</code> para permitir ou negar skills; <code>disable-model-invocation</code> para só você disparar; <code>allowed-tools</code> estreito (por exemplo <code>Bash(git status *)</code>, não uma permissão ampla). <strong>Leia o <code>allowed-tools</code> das skills de um repositório antes de rodar o Claude Code nele</strong>, se você não confia no repositório. Os blocos <code>!`comando`</code> rodam <em>antes</em> de o modelo ver a skill, e a configuração <code>disableSkillShellExecution</code> os desliga.</>} en={<><code>Skill(name)</code> and <code>Skill(name *)</code> permission rules to allow or deny skills; <code>disable-model-invocation</code> so only you trigger; a narrow <code>allowed-tools</code> (for example <code>Bash(git status *)</code>, not a broad grant). <strong>Read the <code>allowed-tools</code> of a repository's skills before running Claude Code in it</strong>, if you do not trust the repository. <code>!`command`</code> blocks run <em>before</em> the model sees the skill, and the <code>disableSkillShellExecution</code> setting turns them off.</>} />],
            ["Codex", <T pt={<><code>policy.allow_implicit_invocation: false</code> para só disparar por <code>$skill</code>; <code>[[skills.config]]</code> com <code>enabled = false</code> no <code>config.toml</code> para desligar uma skill.</>} en={<><code>policy.allow_implicit_invocation: false</code> so it only fires on <code>$skill</code>; <code>[[skills.config]]</code> with <code>enabled = false</code> in <code>config.toml</code> to turn a skill off.</>} />],
            ["opencode", <T pt={<><code>permission.skill</code> com <code>allow</code>, <code>ask</code> ou <code>deny</code> por padrão de nome; uma skill em <code>deny</code> fica escondida do agente; dá para desligar a ferramenta <code>skill</code> por agente.</>} en={<><code>permission.skill</code> with <code>allow</code>, <code>ask</code> or <code>deny</code> per name pattern; a skill set to <code>deny</code> is hidden from the agent; you can turn off the <code>skill</code> tool per agent.</>} />],
            ["Hermes", <T pt={<>Skills de projeto (<code>.hermes/skills</code>, <code>.agents/skills</code>) só carregam depois de <code>hermes skills trust</code>; skills instaladas de um hub passam por um scanner (exfiltração, injeção de prompt, comandos destrutivos) e têm nível de confiança (<code>builtin</code>, <code>official</code>, <code>trusted</code>, <code>community</code>); com <code>skills.write_approval: true</code>, o que o agente escreve como skill fica numa fila de revisão (<code>/skills pending</code>, <code>/skills approve</code>).</>} en={<>Project skills (<code>.hermes/skills</code>, <code>.agents/skills</code>) only load after <code>hermes skills trust</code>; skills installed from a hub pass through a scanner (exfiltration, prompt injection, destructive commands) and carry a trust level (<code>builtin</code>, <code>official</code>, <code>trusted</code>, <code>community</code>); with <code>skills.write_approval: true</code>, what the agent writes as a skill goes into a review queue (<code>/skills pending</code>, <code>/skills approve</code>).</>} />],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong>Leia antes de instalar</strong>: o <code>SKILL.md</code> inteiro e <em>cada script</em>. Prefira origens conhecidas, fixe a versão (um commit) e guarde as suas skills no Git, para ver o que mudou.</>} en={<><strong>Read before installing</strong>: the whole <code>SKILL.md</code> and <em>every script</em>. Prefer known sources, pin the version (a commit) and keep your skills in Git, to see what changed.</>} /></li>
          <li><T pt={<><strong>Não ponha segredos numa skill.</strong> Ela é um arquivo de texto, lido pelo modelo e talvez compartilhado. Chaves vêm de variáveis de ambiente (o Hermes tem <code>required_environment_variables</code> para declarar quais a skill precisa, sem guardar o valor).</>} en={<><strong>Do not put secrets in a skill.</strong> It is a text file, read by the model and perhaps shared. Keys come from environment variables (Hermes has <code>required_environment_variables</code> to declare which ones the skill needs, without storing the value).</>} /></li>
          <li><T pt={<><strong>Instrução não é barreira.</strong> “Nunca apague arquivos” numa skill reduz a chance, mas não impede. O que precisa valer sempre vai fora do modelo: permissões, hooks e isolamento de rede. Veja a <a href="/notas/agent-harness/">nota de harness</a> (guardrails) e a nota de <a href="/notas/private-ai-workspace/">IA privada</a> (camadas de autoridade).</>} en={<><strong>Instruction is not a barrier.</strong> “Never delete files” in a skill lowers the chance but does not prevent it. What must always hold goes outside the model: permissions, hooks and network isolation. See the <a href="/notas/agent-harness/">harness note</a> (guardrails) and the <a href="/notas/private-ai-workspace/">private AI note</a> (layers of authority).</>} /></li>
        </ul>
      </Section>
      <Section id="lab" title={<T pt="Praticar: criar, validar e testar" en="Practise: create, validate and test" />}>
        <Callout icon="check"><T pt={<><strong>O que executei e o que não.</strong> Criei as quatro skills de exemplo desta nota e as validei com o linter da atividade 2 (saída real abaixo, inclusive o erro do dois-pontos). <strong>Não rodei as skills dentro de um agente</strong>: a atividade 3 (disparo) e as de ajuste são roteiros para você executar no seu agente. O linter é meu e segue a especificação aberta; o validador oficial é o <code>skills-ref</code>.</>} en={<><strong>What I ran and what I did not.</strong> I created this note's four example skills and validated them with the activity 2 linter (real output below, including the colon error). <strong>I did not run the skills inside an agent</strong>: activity 3 (triggering) and the tuning ones are scripts for you to run in your own agent. The linter is mine and follows the open specification; the official validator is <code>skills-ref</code>.</>} /></Callout>
        <h3><T pt="Atividade 0: criar a estrutura" en="Activity 0: create the structure" /></h3>
        <CodeBlock code={`mkdir -p skills/reviewing-code/{scripts,references}
mkdir -p skills/writing-functional-requirements/assets
mkdir -p skills/reviewing-security skills/releasing-version
# coloque em cada pasta o SKILL.md dos exemplos da nota (e os arquivos de apoio)
chmod +x skills/reviewing-code/scripts/changed-files.sh`} />
        <h3><T pt="Atividade 1: escrever uma skill sua" en="Activity 1: write a skill of your own" /></h3>
        <p><T pt={<>Escolha uma tarefa que você repete (revisar, escrever commits, montar um relatório). Faça-a uma vez com o agente, anote as <strong>correções que você teve de fazer</strong> e escreva o <code>SKILL.md</code> com: descrição (o quê e quando), passos, armadilhas (suas correções) e um modelo de saída. Menos de 100 linhas é um bom começo.</>} en={<>Pick a task you repeat (reviewing, writing commits, building a report). Do it once with the agent, note the <strong>corrections you had to make</strong> and write the <code>SKILL.md</code> with: a description (what and when), steps, gotchas (your corrections) and an output template. Under 100 lines is a good start.</>} /></p>
        <h3><T pt="Atividade 2: validar o formato (executada)" en="Activity 2: validate the format (run)" /></h3>
        <p><T pt="Este linter (só biblioteca padrão e PyYAML) confere o que a especificação exige: nome, descrição, tamanhos, links de apoio." en="This linter (standard library and PyYAML only) checks what the specification requires: name, description, sizes, supporting links." /></p>
        <CodeBlock code={`#!/usr/bin/env python3
"""Minimal Agent Skills linter (follows agentskills.io/specification). Not the official skills-ref."""
import re, sys, pathlib
import yaml

SPEC_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}

def lint(d):
    errors, warns = [], []
    f = d / "SKILL.md"
    if not f.is_file():
        return [f"{d}: SKILL.md not found (name it exactly SKILL.md)"], []
    text = f.read_text()
    m = re.match(r"---\\n(.*?)\\n---\\n(.*)", text, re.S)
    if not m:
        return [f"{f}: frontmatter must start on line 1 between --- markers"], []
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        return [f"{f}: invalid YAML: {e}"], []
    body = m.group(2)
    name, desc = fm.get("name"), fm.get("description")
    if not isinstance(name, str) or not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name) or len(name) > 64:
        errors.append(f"name {name!r}: 1-64 chars, lowercase letters/digits, single hyphens, no leading/trailing hyphen")
    elif name != d.name:
        errors.append(f"name {name!r} must match the folder name {d.name!r}")
    if not isinstance(desc, str) or not desc.strip():
        errors.append("description: required and non-empty")
    elif len(desc) > 1024:
        errors.append(f"description: {len(desc)} chars, max 1024")
    if "compatibility" in fm and not (isinstance(fm["compatibility"], str) and 1 <= len(fm["compatibility"]) <= 500):
        errors.append("compatibility: 1-500 chars")
    if "metadata" in fm and not (isinstance(fm["metadata"], dict) and all(isinstance(k, str) and isinstance(v, str) for k, v in fm["metadata"].items())):
        errors.append("metadata: must map strings to strings")
    for k in fm.keys() - SPEC_FIELDS:
        warns.append(f"field '{k}' is not in the open spec (fine if one agent uses it, ignored or rejected by others)")
    if isinstance(desc, str) and not re.search(r"\\b(use when|use this|when the user|use only when)\\b", desc, re.I):
        warns.append("description: no 'use when ...' trigger found (heuristic)")
    if len(text.splitlines()) > 500:
        warns.append(f"SKILL.md has {len(text.splitlines())} lines: keep under 500 (move detail to references/)")
    for link in re.findall(r"\\]\\(([^)#]+)\\)", body):
        if not link.startswith(("http", "mailto")) and not (d / link).exists():
            errors.append(f"link to '{link}' does not exist")
    return errors, warns

bad = 0
for p in sys.argv[1:]:
    d = pathlib.Path(p).resolve()
    errs, warns = lint(d)
    print(f"{'FAIL' if errs else 'ok  '} {d.name}")
    for e in errs: print(f"   error: {e}")
    for w in warns: print(f"   warn:  {w}")
    bad += bool(errs)
sys.exit(1 if bad else 0)`} />
        <CodeBlock code={`$ python3 validate.py skills/*
ok   releasing-version
   warn:  field 'disable-model-invocation' is not in the open spec (fine if one agent uses it, ignored or rejected by others)
ok   reviewing-code
ok   reviewing-security
ok   writing-functional-requirements

$ python3 validate.py bad/Bad_Name        # um exemplo deliberadamente errado
FAIL Bad_Name
   error: name 'Bad_Name': 1-64 chars, lowercase letters/digits, single hyphens, no leading/trailing hyphen
   error: link to 'docs/guide.md' does not exist
   warn:  field 'extra-field' is not in the open spec (fine if one agent uses it, ignored or rejected by others)
   warn:  description: no 'use when ...' trigger found (heuristic)

# e o erro real do dois-pontos, na descrição "Cuts a release: bumps the version ...":
FAIL releasing-version
   error: ...SKILL.md: invalid YAML: mapping values are not allowed here`} />
        <p><T pt={<>O aviso do <code>disable-model-invocation</code> é esperado: o campo é do Claude Code, não da especificação aberta. Para a verificação oficial, use o <code>skills-ref validate ./minha-skill</code> do repositório da especificação.</>} en={<>The <code>disable-model-invocation</code> warning is expected: the field is Claude Code's, not the open specification's. For the official check, use <code>skills-ref validate ./my-skill</code> from the specification repository.</>} /></p>
        <h3><T pt="Atividade 3: testar o disparo (roteiro, não executada)" en="Activity 3: test triggering (script, not run)" /></h3>
        <p><T pt={<>Uma skill só ajuda se for ativada. A orientação oficial é montar cerca de 20 perguntas reais, metade que <em>devem</em> disparar a skill e metade que <em>não</em> devem, e rodar cada uma algumas vezes (o modelo não é determinístico). As mais valiosas são as <strong>quase-erros</strong>: perguntas que compartilham palavras com a skill, mas pedem outra coisa. Exemplo para <code>reviewing-code</code>:</>} en={<>A skill only helps if it is activated. The official guidance is to assemble about 20 real prompts, half that <em>should</em> trigger the skill and half that <em>should not</em>, and run each a few times (the model is not deterministic). The most valuable are the <strong>near-misses</strong>: prompts that share words with the skill but ask for something else. Example for <code>reviewing-code</code>:</>} /></p>
        <CodeBlock code={`[
  { "query": "can you look over my changes on the feat/login branch before I open the PR?", "should_trigger": true },
  { "query": "anything wrong with this diff? it's the retry logic in src/queue.ts", "should_trigger": true },
  { "query": "my manager wants a second pair of eyes on the payment PR, thoughts?", "should_trigger": true },
  { "query": "write a commit message for the staged changes", "should_trigger": false },
  { "query": "explain what this function does line by line", "should_trigger": false },
  { "query": "review the wording of this README paragraph", "should_trigger": false }
]`} />
        <p><T pt={<>Rode cada pergunta no seu agente e veja se ele carregou a skill (no Claude Code, a chamada da ferramenta <code>Skill</code> aparece na saída; nos outros, veja o log de ferramentas). Separe cerca de 60% das perguntas para ajustar a descrição e 40% para conferir se o ajuste vale para perguntas novas, senão você ajusta a descrição às suas frases e ela falha nas dos outros. Se perguntas que deviam disparar não disparam, a descrição está estreita; se as quase-erros disparam, está larga. O repositório <code>anthropics/skills</code> traz uma skill <code>skill-creator</code> que automatiza esse ciclo.</>} en={<>Run each prompt in your agent and see whether it loaded the skill (in Claude Code, the <code>Skill</code> tool call shows in the output; in the others, check the tool log). Set aside about 60% of the prompts to tune the description and 40% to check that the tuning holds for new prompts, otherwise you tune the description to your own phrases and it fails on other people's. If prompts that should trigger do not, the description is too narrow; if the near-misses trigger, it is too broad. The <code>anthropics/skills</code> repository ships a <code>skill-creator</code> skill that automates this loop.</>} /></p>
        <h3><T pt="Atividade 4: comparar com e sem a skill (roteiro)" en="Activity 4: compare with and without the skill (script)" /></h3>
        <p><T pt={<>Rode a mesma tarefa real duas vezes, em sessões novas: sem a skill e com ela. Compare o resultado e o <em>rastro</em> (as ferramentas que o agente usou, não só a resposta final). Se a versão sem a skill já saiu boa, a skill não está agregando valor, e você pode apagá-la. Se o agente perde tempo, as instruções estão vagas, ou não se aplicam, ou oferecem opções demais sem um padrão. Cada correção que você fizer à mão vira uma linha na seção de armadilhas.</>} en={<>Run the same real task twice, in fresh sessions: without the skill and with it. Compare the result and the <em>trace</em> (the tools the agent used, not just the final answer). If the version without the skill already came out well, the skill is not adding value, and you can delete it. If the agent wastes time, the instructions are vague, or do not apply, or offer too many options with no default. Each correction you make by hand becomes a line in the gotchas section.</>} /></p>
        <h3><T pt="Atividade 5: dividir e juntar" en="Activity 5: split and merge" /></h3>
        <p><T pt={<>Junte <code>reviewing-code</code> e <code>releasing-version</code> numa única skill <code>git-helper</code> e observe o que acontece com a descrição (ela ganha um “e” entre intenções que não se parecem) e com o risco (a revisão herda o poder de publicar). Depois separe de novo. Em seguida, pegue uma skill sua com mais de 300 linhas e mova os trechos raros para <code>references/</code>, com um gatilho no corpo (“se o erro for X, leia <code>references/x.md</code>”).</>} en={<>Merge <code>reviewing-code</code> and <code>releasing-version</code> into a single <code>git-helper</code> skill and watch what happens to the description (it gains an “and” between intents that do not resemble each other) and to the risk (the review inherits the power to publish). Then split them again. Next, take a skill of yours with over 300 lines and move the rare parts into <code>references/</code>, with a trigger in the body (“if the error is X, read <code>references/x.md</code>”).</>} /></p>
      </Section>
      <Section id="cheat-sk" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Assunto" en="Topic" />, <T pt="Regra" en="Rule" />]}
          rows={[
            [<T pt="O que é" en="What it is" />, <T pt={<>Pasta com <code>SKILL.md</code> (YAML + Markdown). Padrão aberto; funciona em Claude Code, Codex, opencode e Hermes.</>} en={<>A folder with <code>SKILL.md</code> (YAML + Markdown). Open standard; works in Claude Code, Codex, opencode and Hermes.</>} />],
            [<T pt="Como carrega" en="How it loads" />, <T pt="Metadados sempre (~100 tokens) → corpo quando casa (< 500 linhas) → arquivos de apoio quando o corpo manda." en="Metadata always (~100 tokens) → body when it matches (< 500 lines) → supporting files when the body says so." />],
            ["Frontmatter", <T pt={<><code>name</code> (1 a 64, minúsculas e hífens, igual à pasta) e <code>description</code> (1 a 1024). Opcionais: <code>license</code>, <code>compatibility</code>, <code>metadata</code>, <code>allowed-tools</code>. Cuidado com dois-pontos sem aspas.</>} en={<><code>name</code> (1 to 64, lowercase and hyphens, equal to the folder) and <code>description</code> (1 to 1024). Optional: <code>license</code>, <code>compatibility</code>, <code>metadata</code>, <code>allowed-tools</code>. Mind unquoted colons.</>} />],
            [<T pt="Descrição" en="Description" />, <T pt="O que faz + quando usar + palavras do usuário; caso principal primeiro; uma convenção de voz." en="What it does + when to use it + the user's words; main case first; one voice convention." />],
            [<T pt="Corpo" en="Body" />, <T pt="Passos, armadilhas, modelo de saída; só o que o agente não sabe; padrões, não cardápios." en="Steps, gotchas, output template; only what the agent does not know; defaults, not menus." />],
            [<T pt="Apoio" en="Support" />, <><code>scripts/</code> (<T pt="determinismo, roda sem ser lido" en="determinism, runs without being read" />), <code>references/</code> (<T pt="lido sob demanda" en="read on demand" />), <code>assets/</code> (<T pt="modelos" en="templates" />); <T pt="a um nível do SKILL.md." en="one level from SKILL.md." /></>],
            [<T pt="Onde" en="Where" />, <T pt={<>Claude Code <code>.claude/skills</code>; Codex, opencode e Hermes <code>.agents/skills</code>; fonte única + symlink.</>} en={<>Claude Code <code>.claude/skills</code>; Codex, opencode and Hermes <code>.agents/skills</code>; single source + symlink.</>} />],
            [<T pt="Dividir" en="Split" />, <T pt={<>Por intenção (gatilhos diferentes) e por risco (permissões diferentes). Tamanho se resolve com <code>references/</code>. Junte o que sempre carrega junto.</>} en={<>By intent (different triggers) and by risk (different permissions). Size is solved with <code>references/</code>. Merge what always loads together.</>} />],
            [<T pt="Temas" en="Themes" />, <T pt="Review e segurança: só leitura. Requisitos: proibições e modelo. Release: passos exatos, só você dispara. Código: curto, o resto no AGENTS.md." en="Review and security: read only. Requirements: prohibitions and a template. Release: exact steps, only you trigger. Code: short, the rest in AGENTS.md." />],
            [<T pt="Testar" en="Test" />, <T pt="Linter de formato; ~20 perguntas (metade quase-erros); repetir; separar treino e validação; comparar com e sem a skill." en="Format linter; ~20 prompts (half near-misses); repeat; split train and validation; compare with and without the skill." />],
            [<T pt="Segurança" en="Security" />, <T pt="Skill = instruções e scripts com o acesso do agente. Leia antes, fixe versão, sem segredos, e use os controles do agente; instrução não é barreira." en="A skill = instructions and scripts with the agent's access. Read first, pin the version, no secrets, and use the agent's controls; instruction is not a barrier." />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Em que uma skill difere do AGENTS.md, de uma ferramenta MCP e de um subagente? Dê um caso para cada." en="How does a skill differ from AGENTS.md, an MCP tool and a subagent? Give a case for each." /></li>
          <li><T pt="O que são os três níveis da divulgação progressiva e por que a descrição é o campo mais importante?" en="What are the three levels of progressive disclosure and why is the description the most important field?" /></li>
          <li><T pt="Reescreva a descrição “Ajuda com commits” para uma que diga o que faz e quando usar. Por que “Corta um release: sobe a versão” pode quebrar o YAML?" en="Rewrite the description “Helps with commits” into one that says what it does and when to use it. Why can “Cuts a release: bumps the version” break the YAML?" /></li>
          <li><T pt="Uma skill tem 700 linhas e uma única intenção. Você a divide em duas skills? O que faz em vez disso?" en="A skill has 700 lines and a single intent. Do you split it into two skills? What do you do instead?" /></li>
          <li><T pt={<>Por que <code>reviewing-security</code> e <code>releasing-version</code> devem ser skills separadas, mesmo que ambas mexam com “código”?</>} en={<>Why should <code>reviewing-security</code> and <code>releasing-version</code> be separate skills, even though both touch “code”?</>} /></li>
          <li><T pt="Como você escreveria uma skill de requisitos funcionais para impedir que o agente já proponha uma solução? E uma de segurança que só pode ler?" en="How would you write a functional-requirements skill to stop the agent from proposing a solution right away? And a security skill that may only read?" /></li>
          <li><T pt="Como você montaria o teste de disparo de uma skill? O que são quase-erros e por que separar treino e validação?" en="How would you set up the triggering test for a skill? What are near-misses and why split train and validation?" /></li>
          <li><T pt="Como guardar uma skill para Claude Code e Codex sem duplicar a pasta? O que você confere antes de instalar uma skill de terceiros?" en="How do you store a skill for Claude Code and Codex without duplicating the folder? What do you check before installing a third-party skill?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://agentskills.io/specification" rel="noopener">Agent Skills: specification</a> · <a href="https://agentskills.io/skill-creation/best-practices" rel="noopener">Best practices for skill creators</a> · <a href="https://agentskills.io/skill-creation/optimizing-descriptions" rel="noopener">Optimizing skill descriptions</a> · <a href="https://agentskills.io/skill-creation/evaluating-skills" rel="noopener">Evaluating skill output quality</a></li>
          <li><a href="https://code.claude.com/docs/en/skills" rel="noopener">Claude Code: extend Claude with skills</a> · <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices" rel="noopener">Anthropic: skill authoring best practices</a> · <a href="https://github.com/anthropics/skills" rel="noopener">anthropics/skills</a> (<code>skill-creator</code>)</li>
          <li><a href="https://developers.openai.com/codex/skills" rel="noopener">Codex: agent skills</a> (<T pt="redireciona para a documentação de skills da OpenAI" en="redirects to OpenAI's skills documentation" />) · <a href="https://opencode.ai/docs/skills" rel="noopener">opencode: agent skills</a> · <a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/skills" rel="noopener">Hermes Agent: skills system</a></li>
        </ul>
      </Sources>
    </>
  );
}
