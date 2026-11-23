import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "agent-skills",
  title: "Skills para agentes: escrever um SKILL.md",
  seo: {
    title: "Criar skills para agentes de IA: SKILL.md no Claude Code, Codex e agentes open-source",
    description: "Um guia simples para escrever skills de agentes (SKILL.md): o que uma skill é e faz, como criar, onde cada agente a procura, quando dividir uma skill em duas, skills por tema (review, segurança, código, requisitos), segurança e um laboratório com linter.",
  },
  summary: "um guia simples do formato aberto Agent Skills (SKILL.md): o que uma skill é e faz (progressive disclosure, skill versus AGENTS.md, ferramenta e subagente), como criar uma passo a passo com um exemplo testado de code review, onde Claude Code, Codex, opencode e Hermes procuram skills e o que cada um acrescenta (disable-model-invocation, agents/openai.yaml, permission.skill, metadata.hermes), uma estrutura portátil em .agents/skills com links simbólicos, quando dividir uma skill por intenção e por risco ou mover conteúdo para references/, skills por tema (código, revisão, segurança, requisitos funcionais, testes, release), regras de descrição e escopo da especificação e das boas práticas da Anthropic, controles de segurança por agente e um laboratório com um linter da especificação e um teste de acionamento, com fontes oficiais.",
  kicker: "Guia prático",
  heroTitle: <>Criar skills para agentes de IA, <em>uma vez, para todos os agentes.</em></>,
  heroLede: "O que é uma skill, como criar, onde Claude Code, Codex, opencode e Hermes a procuram, quando dividir uma em duas, como desenhar skills de review, segurança, código e requisitos, e como validar e testar.",
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "what", title: "O que é uma skill e o que ela faz" },
        { id: "create", title: "Como criar uma skill, passo a passo" },
        { id: "where", title: "Onde ficam e o que cada agente acrescenta" },
        { id: "split", title: "Quando dividir uma skill em duas (ou juntar)" },
        { id: "themes", title: "Skills por tema: o que muda em cada uma" },
        { id: "rules", title: "Regras que fazem uma skill funcionar" },
        { id: "security", title: "Segurança: uma skill é código que o agente executa" },
        { id: "lab", title: "Praticar: criar, validar e testar" },
        { id: "cheat-sk", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que é uma skill e o que ela faz"}>
        <p>Uma <strong>skill</strong> é uma pasta com um arquivo <code>SKILL.md</code>: um cabeçalho YAML (nome e descrição) e, abaixo, instruções em Markdown.</p>
        <p>Ela ensina ao agente um <em>procedimento repetível</em> (como revisar um PR, como escrever requisitos, como fazer um release) e só entra no contexto <strong>quando a tarefa pede</strong>. O formato é um padrão aberto, o <a href="https://agentskills.io/specification" rel="noopener">Agent Skills</a>, e a mesma pasta funciona no Claude Code, no Codex, no opencode e no Hermes (cada um acrescenta extras, veja <a href="#where">onde ficam</a>).</p>
        <Diagram minWidth={620} caption={"O agente só paga o custo de contexto do que a tarefa realmente usa. Por isso a descrição vale tanto, e os detalhes vão para arquivos separados."}>
          <svg viewBox="0 0 700 196" role="img" aria-label="Divulgação progressiva">
            <rect x="10" y="20" width="210" height="84" rx="4" className="brandfill" />
            <text x="115" y="44" textAnchor="middle">1. Metadados</text>
            <text x="115" y="64" className="mono mut" textAnchor="middle">name + description</text>
            <text x="115" y="84" className="mut" textAnchor="middle">~100 tokens por skill</text>
            <text x="115" y="128" className="mut" textAnchor="middle">carrega:</text>
            <text x="115" y="144" textAnchor="middle">sempre no contexto</text>
            <rect x="245" y="20" width="210" height="84" rx="4" className="ln fillsoft" />
            <text x="350" y="44" textAnchor="middle">2. Instruções</text>
            <text x="350" y="64" className="mono mut" textAnchor="middle">corpo do SKILL.md</text>
            <text x="350" y="84" className="mut" textAnchor="middle">&lt; 500 linhas, &lt; 5000 tokens</text>
            <text x="350" y="128" className="mut" textAnchor="middle">carrega:</text>
            <text x="350" y="144" textAnchor="middle">quando a tarefa casa</text>
            <rect x="480" y="20" width="210" height="84" rx="4" className="ln" />
            <text x="585" y="44" textAnchor="middle">3. Recursos</text>
            <text x="585" y="64" className="mono mut" textAnchor="middle">scripts/ references/ assets/</text>
            <text x="585" y="84" className="mut" textAnchor="middle">tamanho livre</text>
            <text x="585" y="128" className="mut" textAnchor="middle">carrega:</text>
            <text x="585" y="144" textAnchor="middle">só quando o corpo manda</text>
            <path d="M220 62L245 62" className="ln" />
            <path d="M238.7 65.0L245 62L238.7 59.0" className="ln" />
            <path d="M455 62L480 62" className="ln" />
            <path d="M473.7 65.0L480 62L473.7 59.0" className="ln" />
            <text x="350" y="180" className="mut" textAnchor="middle">A descrição é o único texto sempre carregado: ela decide se a skill será usada.</text>
          </svg>
        </Diagram>
        <p>O truque é a <strong>divulgação progressiva</strong>: no início o agente lê só o nome e a descrição de cada skill (cerca de 100 tokens por skill, segundo a especificação). Se a tarefa casa com a descrição, ele carrega o corpo do <code>SKILL.md</code>. Arquivos de apoio só são lidos se o corpo mandar. Assim você pode ter dezenas de skills instaladas sem encher o contexto.</p>
        <Table
          head={["Mecanismo", "Quando entra", "Serve para"]}
          rows={[
            ["AGENTS.md / CLAUDE.md", "Sempre", <>Fatos curtos que valem em toda tarefa (“rode <code>pnpm test</code>”).</>],
            [<strong>Skill</strong>, "Quando a descrição casa, ou você chama", <>Um <em>procedimento</em> com passos, formato de saída e, às vezes, scripts.</>],
            ["Ferramenta / MCP", "Quando o modelo chama", <>Uma <em>ação</em> que o modelo não faz sozinho (veja a <a href="/notas/mcp-server-client/">nota de MCP</a>).</>],
            ["Subagente", "Quando o agente principal delega", "Trabalho volumoso que não deve poluir o contexto principal."],
          ]}
        />
        <p>A comparação completa, com RAG e hooks, está na <a href="/notas/agent-harness/">nota de harness</a>. A regra prática: <strong>fato curto e sempre válido vai no AGENTS.md; procedimento vai numa skill; ação vai numa ferramenta.</strong></p>
        <h3>O que uma boa skill faz, e o que não faz</h3>
        <ul className="ds-list">
          <li><strong>Traz o que o agente não sabe:</strong> as convenções do seu projeto, os passos na ordem certa, as armadilhas (“a tabela <code>users</code> usa exclusão lógica”). Não explica o que o agente já sabe, como o que é um PDF ou um SQL injection.</li>
          <li><strong>Fixa o formato da saída</strong> com um modelo (template): o agente segue estruturas concretas melhor do que descrições em prosa.</li>
          <li><strong>Entrega scripts</strong> quando um passo precisa ser idêntico a cada vez. O script roda e só a saída gasta contexto.</li>
          <li><strong>Não é um sandbox nem uma permissão.</strong> A skill roda com o acesso que o agente já tem; ela é <em>instrução</em>, e instrução pode ser ignorada ou enganada. O que precisa valer sempre vai em hook, permissão ou rede (veja <a href="#security">segurança</a>).</li>
        </ul>
        <Callout icon="check"><strong>Quando vale criar uma.</strong> A documentação do Claude Code dá o critério: quando você cola as mesmas instruções no chat de novo e de novo, ou quando uma seção do CLAUDE.md virou um <em>procedimento</em> em vez de um fato. A especificação acrescenta o teste inverso: se o agente já faz a tarefa bem sem a skill, ela não está agregando valor.</Callout>
      </Section>
      <Section id="create" title={"Como criar uma skill, passo a passo"}>
        <ol className="ds-steps">
          <li><strong>Faça a tarefa uma vez, com o agente, sem skill.</strong> Dê o contexto, corrija os desvios, diga as preferências. Depois olhe: quais passos funcionaram, quais correções você fez, que formato de entrada e saída apareceu. É isso que vira a skill. As boas práticas oficiais alertam: pedir a um modelo uma skill “do nada” gera procedimentos genéricos (“siga as boas práticas”); o valor está no que é <em>seu</em>.</li>
          <li><strong>Crie a pasta e o arquivo.</strong> O nome da pasta é o nome da skill, e o arquivo chama-se <code>SKILL.md</code> exatamente assim, em maiúsculas.</li>
          <li><strong>Escreva a descrição.</strong> É o campo mais importante (veja <a href="#rules">regras</a>): o que a skill faz <em>e quando usá-la</em>, com as palavras que o usuário usaria.</li>
          <li><strong>Escreva o corpo como um procedimento</strong>: passos numerados, uma seção de armadilhas (gotchas), o modelo de saída. Curto: tudo que está lá fica no contexto enquanto a skill estiver ativa.</li>
          <li><strong>Mova o que é longo ou raro para arquivos de apoio</strong> (<code>references/</code>, <code>assets/</code>) e diga no corpo <em>quando</em> ler cada um. Ponha em <code>scripts/</code> o que precisa ser determinístico.</li>
          <li><strong>Valide e teste</strong> (veja o <a href="#lab">laboratório</a>): o formato com um linter, e o disparo com perguntas reais.</li>
        </ol>
        <p>Exemplo completo: uma skill de revisão de código. Estrutura:</p>
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
          <li><strong>A descrição</strong> diz o que faz (“revisa uma mudança e reporta por severidade”) e quando usar, inclusive quando o usuário <em>não</em> diz a palavra “review” (“olha as minhas mudanças”).</li>
          <li><strong>Os passos</strong> dão uma ordem (bugs, segurança, testes, legibilidade) e um gatilho para o arquivo de apoio: “se a mudança toca autenticação, SQL, arquivos ou segredos, leia <code>references/security-checklist.md</code>”. É melhor do que um genérico “veja references/”.</li>
          <li><strong>As armadilhas</strong> são correções concretas (“lockfiles não se revisam”, “nunca marque como crítico sem dizer a entrada que dispara”). Sempre que você precisar corrigir o agente numa revisão, acrescente a correção aqui: é o jeito mais direto de melhorar uma skill.</li>
          <li><strong>O modelo de saída</strong> garante que toda revisão tenha o mesmo formato.</li>
        </ul>
        <Callout tone="warn" icon="alert"><strong>Cuidado com dois-pontos na descrição.</strong> O cabeçalho é YAML, e <code>description: Cuts a release: bumps the version</code> é inválido (“mapping values are not allowed here”): o segundo <code>:</code> abre um mapa. Reescreva sem dois-pontos ou ponha a descrição entre aspas. Foi um erro real que o linter da atividade 2 pegou ao montar os exemplos. Não verifiquei como cada agente reage a um YAML inválido (a documentação do Claude Code só afirma que campos não reconhecidos são ignorados sem erro), então valide antes de confiar que a skill foi carregada.</Callout>
      </Section>
      <Section id="where" title={"Onde ficam e o que cada agente acrescenta"}>
        <p>O núcleo é o mesmo em todos: <code>name</code> e <code>description</code> obrigatórios, mais <code>license</code>, <code>compatibility</code>, <code>metadata</code> e <code>allowed-tools</code> (este experimental, com suporte variável). Muda onde cada agente procura as pastas e o que ele permite configurar além do núcleo:</p>
        <Table
          head={["Agente", "Onde procura", "Extras além do núcleo"]}
          rows={[
            ["Claude Code", <><code>~/.claude/skills/</code> (pessoal), <code>.claude/skills/</code> (projeto, vai no Git), plugins, política da organização; também pastas aninhadas em monorepos</>, <>Campos como <code>disable-model-invocation</code> (só você chama), <code>user-invocable</code> (só o modelo chama), <code>allowed-tools</code>, <code>context: fork</code> (roda num subagente), <code>paths</code> (só carrega para certos arquivos), <code>arguments</code> e <code>$ARGUMENTS</code>; <code>/nome</code> chama na mão; blocos <code>!`comando`</code> rodam antes de o modelo ver a skill.</>],
            ["Codex", <><code>.agents/skills/</code> no diretório atual e em cada pai até a raiz do repo; <code>~/.agents/skills/</code>; <code>/etc/codex/skills/</code> (máquina); skills do sistema (inclui o <code>skill-creator</code>)</>, <>Arquivo opcional <code>agents/openai.yaml</code>: <code>interface</code> (nome e ícone no app), <code>policy.allow_implicit_invocation: false</code> (só dispara com <code>$skill</code> explícito) e <code>dependencies.tools</code> (servidores MCP exigidos). <code>$skill-creator</code> cria uma skill conversando.</>],
            ["opencode", <><code>.opencode/skills/</code>, <code>~/.config/opencode/skills/</code>, e também lê <code>.claude/skills/</code> e <code>.agents/skills/</code> (projeto e global)</>, <>Só o núcleo (campos desconhecidos são ignorados). O controle fica em <code>opencode.json</code>: <code>permission.skill</code> com padrões <code>allow</code> / <code>deny</code> / <code>ask</code> (por exemplo <code>"internal-*": "deny"</code>), por agente.</>],
            ["Hermes", <><code>~/.hermes/skills/</code> (a fonte da verdade), <code>skills.external_dirs</code> no <code>config.yaml</code>; <code>.hermes/skills/</code> ou <code>.agents/skills/</code> do projeto só depois de <code>hermes skills trust</code></>, <><code>version</code>, <code>platforms</code>, <code>metadata.hermes.*</code> (tags, categoria, ativação condicional por <code>requires_toolsets</code> / <code>fallback_for_tools</code>), <code>required_environment_variables</code>. Toda skill vira um comando <code>/nome</code>, e o próprio agente pode criar e remendar skills (<code>skill_manage</code>), com aprovação opcional.</>],
          ]}
        />
        <Diagram minWidth={620} caption={"Cada agente procura num diretório. Guardar a skill uma vez e apontar os outros por symlink evita cópias que se desencontram."}>
          <svg viewBox="0 0 700 240" role="img" aria-label="Um layout portátil">
            <rect x="10" y="70" width="250" height="90" rx="4" className="brandfill" />
            <text x="135" y="92" className="mono" textAnchor="middle">.agents/skills/reviewing-code/</text>
            <text x="135" y="112" className="mut" textAnchor="middle">a fonte única, versionada no Git</text>
            <text x="135" y="130" className="mono mut" textAnchor="middle">SKILL.md · scripts/ · references/</text>
            <rect x="300" y="20" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="40" textAnchor="middle">Codex</text>
            <text x="435" y="56" className="mut" textAnchor="middle">lê .agents/skills</text>
            <rect x="300" y="74" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="94" textAnchor="middle">opencode</text>
            <text x="435" y="110" className="mut" textAnchor="middle">lê .agents/skills e .claude/skills</text>
            <rect x="300" y="128" width="270" height="44" rx="4" className="ln fillsoft" />
            <text x="435" y="148" textAnchor="middle">Hermes</text>
            <text x="435" y="164" className="mut" textAnchor="middle">lê .agents/skills (após confiar no repo)</text>
            <rect x="300" y="182" width="270" height="44" rx="4" className="ln" />
            <text x="435" y="202" textAnchor="middle">Claude Code</text>
            <text x="435" y="218" className="mut" textAnchor="middle">lê .claude/skills</text>
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
        <p><strong>Dica de portabilidade:</strong> escreva a skill só com o núcleo da especificação, guarde-a em <code>.agents/skills/</code> (que Codex, opencode e Hermes leem) e crie um symlink em <code>.claude/skills/</code> para o Claude Code.</p>
        <p>As documentações do Claude Code e do Codex dizem expressamente que aceitam uma pasta de skill que seja symlink.</p>
        <p>O que for específico de um agente (<code>disable-model-invocation</code>, <code>agents/openai.yaml</code>, <code>metadata.hermes</code>) acrescente só quando precisar: os outros agentes ignoram campos que não conhecem (o opencode diz isso expressamente), mas a documentação do Claude Code avisa que empacotar uma skill para o claude.ai com campos fora do conjunto aberto falha.</p>
        <CodeBlock code={`mkdir -p .agents/skills .claude/skills
cp -r reviewing-code .agents/skills/
ln -s ../../.agents/skills/reviewing-code .claude/skills/reviewing-code`} />
        <Callout icon="check"><strong>Nomes duplicados.</strong> O Codex não funde skills com o mesmo <code>name</code> (as duas aparecem), e o opencode exige nomes únicos entre todos os locais. Como o opencode lê <code>.claude/skills</code> <em>e</em> <code>.agents/skills</code>, o symlink da dica acima pode fazer a mesma skill aparecer duas vezes lá. Se isso acontecer, é o primeiro lugar para olhar.</Callout>
      </Section>
      <Section id="split" title={"Quando dividir uma skill em duas (ou juntar)"}>
        <p>A especificação compara a escolha ao desenho de uma função: uma skill deve ser <em>uma unidade coerente de trabalho que se combina bem com as outras</em>. Estreita demais, e várias skills precisam carregar para uma só tarefa, com custo de contexto e instruções que se contradizem.</p>
        <p>Larga demais, e fica difícil de ativar com precisão (o exemplo oficial: uma skill que consulta um banco e formata o resultado é uma unidade; se ela também faz administração do banco, está tentando fazer demais).</p>
        <Diagram minWidth={620} caption={"Divida por intenção do usuário e por risco. Divida o conteúdo, não a skill, quando o problema é só tamanho."}>
          <svg viewBox="0 0 700 287" role="img" aria-label="Dividir ou não">
            <rect x="10" y="15" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="39" textAnchor="middle">Gatilhos diferentes?</text>
            <path d="M260 34L330 34" className="ln" />
            <path d="M323.7 37.0L330 34L323.7 31.0" className="ln" />
            <text x="295" y="26" className="mono mut" textAnchor="middle">sim</text>
            <rect x="330" y="15" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="39" textAnchor="middle">dividir por intenção</text>
            <path d="M135 53L135 71" className="ln" />
            <path d="M132.0 64.7L135 71L138.0 64.7" className="ln" />
            <text x="150" y="67" className="mono mut" textAnchor="start">não</text>
            <rect x="10" y="71" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="95" textAnchor="middle">Risco ou permissão diferentes?</text>
            <path d="M260 90L330 90" className="ln" />
            <path d="M323.7 93.0L330 90L323.7 87.0" className="ln" />
            <text x="295" y="82" className="mono mut" textAnchor="middle">sim</text>
            <rect x="330" y="71" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="95" textAnchor="middle">dividir por risco</text>
            <path d="M135 109L135 127" className="ln" />
            <path d="M132.0 120.7L135 127L138.0 120.7" className="ln" />
            <text x="150" y="123" className="mono mut" textAnchor="start">não</text>
            <rect x="10" y="127" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="151" textAnchor="middle">Partes usadas só às vezes?</text>
            <path d="M260 146L330 146" className="ln" />
            <path d="M323.7 149.0L330 146L323.7 143.0" className="ln" />
            <text x="295" y="138" className="mono mut" textAnchor="middle">sim</text>
            <rect x="330" y="127" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="151" textAnchor="middle">mover para references/</text>
            <path d="M135 165L135 183" className="ln" />
            <path d="M132.0 176.7L135 183L138.0 176.7" className="ln" />
            <text x="150" y="179" className="mono mut" textAnchor="start">não</text>
            <rect x="10" y="183" width="250" height="38" rx="4" className="ln fillsoft" />
            <text x="135" y="207" textAnchor="middle">Sempre carregam juntas?</text>
            <path d="M260 202L330 202" className="ln" />
            <path d="M323.7 205.0L330 202L323.7 199.0" className="ln" />
            <text x="295" y="194" className="mono mut" textAnchor="middle">sim</text>
            <rect x="330" y="183" width="230" height="38" rx="4" className="brandfill" />
            <text x="445" y="207" textAnchor="middle">juntar numa só</text>
            <path d="M135 221L135 243" className="ln" />
            <path d="M132.0 236.7L135 243L138.0 236.7" className="ln" />
            <text x="150" y="235" className="mono mut" textAnchor="start">não</text>
            <rect x="10" y="243" width="250" height="34" rx="4" className="ln" />
            <text x="135" y="265" textAnchor="middle">uma skill, bem descrita</text>
          </svg>
        </Diagram>
        <Table
          head={["Sinal", "Faça", "Exemplo"]}
          rows={[
            [<><strong>Dois gatilhos diferentes</strong><br />A descrição virou uma lista de “e/ou” de intenções que não se parecem.</>, <strong>Divida por intenção.</strong>, <><code>reviewing-code</code> (“olhe minhas mudanças”) e <code>writing-functional-requirements</code> (“o que isso deve fazer?”): o usuário pede coisas diferentes, em momentos diferentes.</>],
            [<strong>Risco ou permissão diferentes</strong>, <strong>Divida por risco.</strong>, <><code>reviewing-security</code> só lê (<code>allowed-tools: Read Grep</code>); <code>releasing-version</code> publica e usa <code>disable-model-invocation: true</code>, para só rodar quando você pedir. Misturar as duas obrigaria a dar à revisão os poderes do release.</>],
            [<strong>Quem chama é diferente</strong>, <strong>Divida por modo de uso.</strong>, <>Um workflow que <em>você</em> dispara (<code>/handoff</code>) e um conhecimento que o <em>modelo</em> aplica sozinho (convenções de código) têm descrições e riscos diferentes.</>],
            [<strong>Corpo grande, mas uma só intenção</strong>, <strong>Não divida a skill: divida o conteúdo</strong>, <>Passe de 500 linhas? Mova o detalhe para <code>references/</code> por tema (<code>references/finance.md</code>, <code>references/sales.md</code>) e diga no corpo quando ler cada um. A skill continua uma só.</>],
            [<strong>Duas skills sempre carregam juntas</strong>, <strong>Junte.</strong>, <>Se <code>formatting-report</code> nunca roda sem <code>querying-database</code>, é uma unidade só.</>],
            [<strong>Instruções que se contradizem entre skills</strong>, <strong>Junte, ou deixe uma delas fora do disparo automático.</strong>, "Duas skills de “commit” com convenções diferentes: escolha uma e remova a outra, ou desligue o disparo automático de uma."],
          ]}
        />
        <p><strong>Um teste rápido para a descrição:</strong> se você precisa de “e” para dizer <em>quando</em> usar a skill, e os dois lados do “e” não costumam aparecer na mesma conversa, provavelmente são duas skills. Se o “e” está no <em>procedimento</em> (consulta e formata), provavelmente é uma.</p>
      </Section>
      <Section id="themes" title={"Skills por tema: o que muda em cada uma"}>
        <p>O formato é o mesmo, mas o <em>desenho</em> muda com o tema. Duas perguntas orientam: <strong>quão frágil é a tarefa?</strong> (frágil pede passos exatos e scripts; flexível pede um critério e um modelo de saída) e <strong>qual o risco?</strong> (leitura apenas, ou ação com efeito).</p>
        <p>As boas práticas oficiais chamam o primeiro ponto de “calibrar o grau de liberdade”: uma ponte estreita com abismos dos dois lados pede instruções exatas; um campo aberto pede só a direção.</p>
        <Table
          head={["Tema", "O que a skill contém", "Liberdade", "Risco e cuidados"]}
          rows={[
            [<strong>Código e convenções</strong>, <>Estrutura do projeto, comandos de build e teste, padrões de nomes, armadilhas do repositório (“o ID é <code>user_id</code> no banco e <code>uid</code> no auth”).</>, "Média", <>Baixo. Mantenha curto: o que vale em <em>toda</em> tarefa vai no AGENTS.md; a skill é para tarefas específicas.</>],
            [<strong>Review</strong>, "Ordem de verificação, o que ignorar (arquivos gerados), escala de severidade, modelo de saída. Exemplo da seção de criação.", "Alta nos critérios, baixa no formato", "Baixo se só reporta. Diga “não edite arquivos a menos que peçam”."],
            [<strong>Segurança</strong>, "Pontos de entrada, o que cada um confia, o que verificar (validação, autenticação, injeção, segredos), e a regra de ouro: achado sem gatilho concreto é nota, não achado.", "Média, com formato fixo", <><strong>Somente leitura</strong>: restrinja <code>allowed-tools</code> a leitura e busca, e diga “não altere, não rode, não use a rede”. A skill de segurança <em>não</em> deve ter poder de corrigir; separe a correção em outra.</>],
            [<strong>Requisitos funcionais</strong>, "Perguntas de esclarecimento (poucas), modelo de requisito numerado, critérios de aceitação Given/When/Then, lista de perguntas em aberto. Sem desenho nem código.", "Baixa no formato, alta no conteúdo", <>Baixo. O valor está nas <em>proibições</em> (“não proponha solução”, “não adivinhe respostas”) e no modelo em <code>assets/</code>.</>],
            [<strong>Testes</strong>, "Como rodar a suíte, onde ficam os testes, o padrão de nomes, o que mockar e o que nunca mockar.", "Média", "Médio: rodar testes executa código. Liste os comandos permitidos, não “qualquer comando”."],
            [<strong>Release e deploy</strong>, "Uma sequência exata, com verificação a cada passo e parada na primeira falha.", <><strong>Mínima</strong>: scripts e “rode exatamente isto”</>, <><strong>Alto.</strong> Tem efeito no mundo: só você deve disparar (<code>disable-model-invocation: true</code> no Claude Code; <code>allow_implicit_invocation: false</code> no Codex) e sempre com confirmação.</>],
            [<strong>Documentação e commits</strong>, <>Formato (por exemplo Conventional Commits), tom, e <em>exemplos de entrada e saída</em>.</>, "Baixa no formato", "Baixo. Exemplos concretos ensinam o estilo melhor do que descrições."],
          ]}
        />
        <h3>Dois exemplos testados</h3>
        <p><strong>Requisitos funcionais.</strong> Repare nas proibições e no limite de perguntas, que impedem os dois erros típicos (interrogar demais e já sair desenhando):</p>
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
        <p><strong>Segurança, somente leitura.</strong> Os campos opcionais <code>license</code>, <code>compatibility</code> e <code>allowed-tools</code> da especificação deixam o limite explícito, e o corpo repete a regra em palavras, porque <code>allowed-tools</code> tem suporte variável entre agentes:</p>
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
        <p>Note que ela <strong>repete a restrição no texto</strong> (“Report only. Never edit files…”). É um cinto e suspensório: o campo pede ao agente que restrinja as ferramentas, e o texto diz ao modelo o que fazer mesmo onde o campo não é respeitado. Nenhum dos dois é uma garantia (veja <a href="#security">segurança</a>).</p>
      </Section>
      <Section id="rules" title={"Regras que fazem uma skill funcionar"}>
        <Table
          head={["Regra", "Por quê, e como"]}
          rows={[
            [<strong>A descrição carrega o disparo</strong>, <>É o único texto sempre carregado, e o agente decide por ela. Diga o que faz <em>e quando usar</em>, descreva a <em>intenção do usuário</em> (não a mecânica interna), liste contextos em que se aplica mesmo sem a palavra óbvia, e seja “insistente” sem passar de 1024 caracteres (no Claude Code, <code>description</code> e <code>when_to_use</code> juntos são cortados em 1536 na listagem: ponha o caso principal primeiro). Bom: “Extrai texto e tabelas de PDFs… Use quando o usuário mencionar PDFs, formulários ou extração de documentos.” Ruim: “Ajuda com PDFs.”</>],
            [<strong>Uma convenção de voz, mantida</strong>, "As duas fontes oficiais divergem num detalhe: a especificação aberta sugere o imperativo (“Use esta skill quando…”); o guia da Anthropic pede terceira pessoa (“Processa arquivos Excel…”), porque a descrição é injetada no prompt do sistema. Escolha uma e use em todas as suas skills."],
            [<strong>Só o que o agente não sabe</strong>, "Para cada trecho, pergunte: “o agente erraria sem isto?”. Se não, corte. Explicar o que é um PDF gasta contexto e não ajuda."],
            [<strong>Padrões, não cardápios</strong>, "Escolha uma ferramenta e cite as alternativas em uma linha. “Use pdfplumber; para PDFs escaneados use pdf2image com pytesseract” funciona; uma lista de cinco bibliotecas iguais não."],
            [<strong>Procedimentos, não respostas</strong>, <>Ensine <em>como abordar</em> uma classe de problemas (leia o esquema, junte pelas chaves <code>_id</code>, filtre, agregue), não a resposta de um caso (“junte <code>orders</code> com <code>customers</code>…”).</>],
            [<strong>Armadilhas dentro do SKILL.md</strong>, "São o conteúdo de maior valor: correções concretas a erros que o agente cometeria. Deixe no corpo, não num arquivo separado, porque o agente pode não reconhecer o momento de abrir o arquivo."],
            [<strong>Validação e plano antes de agir</strong>, "Em tarefas em lote ou destrutivas: gerar um plano, validar contra a fonte da verdade com um script que dá erro claro (“campo X não existe; disponíveis: …”), e só então executar. Para tarefas longas, uma lista de verificação que o agente marca."],
            [<strong>Scripts que resolvem</strong>, <>O script trata os erros e diz o que fazer (como o <code>changed-files.sh</code>, que avisa “passe uma branch”) em vez de falhar e deixar o agente adivinhar. Diga se o agente deve <em>rodar</em> ou <em>ler</em> o script. Se você vê o agente reinventando a mesma lógica a cada execução, é hora de empacotar um script testado.</>],
            [<strong>Arquivos a um nível</strong>, <>Link direto do <code>SKILL.md</code> a cada arquivo de apoio, sem cadeias (A aponta para B que aponta para C): o agente pode ler só o começo de arquivos aninhados. Arquivos com mais de 100 linhas ganham um sumário no topo. Nomes descritivos (<code>form_validation_rules.md</code>, não <code>doc2.md</code>) e barras normais nos caminhos.</>],
            [<strong>Nada que envelhece</strong>, "Evite “antes de agosto use a API antiga”. Escreva o método atual e deixe o legado numa seção “padrões antigos”. Use um termo para cada conceito, sempre o mesmo."],
            [<strong>Nomes e tamanho</strong>, <>Nome em minúsculas com hífens, igual à pasta, e descritivo (<code>reviewing-code</code>, não <code>helper</code>); o guia da Anthropic sugere o gerúndio. Corpo abaixo de 500 linhas e de cerca de 5000 tokens.</>],
          ]}
        />
      </Section>
      <Section id="security" title={"Segurança: uma skill é código que o agente executa"}>
        <p>Instalar uma skill é entregar ao agente <em>instruções e, às vezes, scripts</em> que ele vai seguir com o acesso que você já deu a ele. Uma skill de origem duvidosa pode mandar o agente ler segredos, rodar comandos ou enviar dados para fora, e o texto da skill é só mais um texto para o modelo obedecer. Os próprios agentes trazem controles; use-os:</p>
        <Table
          head={["Agente", "Controle (segundo a documentação)"]}
          rows={[
            ["Claude Code", <>Regras de permissão <code>Skill(nome)</code> e <code>Skill(nome *)</code> para permitir ou negar skills; <code>disable-model-invocation</code> para só você disparar; <code>allowed-tools</code> estreito (por exemplo <code>Bash(git status *)</code>, não uma permissão ampla). <strong>Leia o <code>allowed-tools</code> das skills de um repositório antes de rodar o Claude Code nele</strong>, se você não confia no repositório. Os blocos <code>!`comando`</code> rodam <em>antes</em> de o modelo ver a skill, e a configuração <code>disableSkillShellExecution</code> os desliga.</>],
            ["Codex", <><code>policy.allow_implicit_invocation: false</code> para só disparar por <code>$skill</code>; <code>[[skills.config]]</code> com <code>enabled = false</code> no <code>config.toml</code> para desligar uma skill.</>],
            ["opencode", <><code>permission.skill</code> com <code>allow</code>, <code>ask</code> ou <code>deny</code> por padrão de nome; uma skill em <code>deny</code> fica escondida do agente; dá para desligar a ferramenta <code>skill</code> por agente.</>],
            ["Hermes", <>Skills de projeto (<code>.hermes/skills</code>, <code>.agents/skills</code>) só carregam depois de <code>hermes skills trust</code>; skills instaladas de um hub passam por um scanner (exfiltração, injeção de prompt, comandos destrutivos) e têm nível de confiança (<code>builtin</code>, <code>official</code>, <code>trusted</code>, <code>community</code>); com <code>skills.write_approval: true</code>, o que o agente escreve como skill fica numa fila de revisão (<code>/skills pending</code>, <code>/skills approve</code>).</>],
          ]}
        />
        <ul className="ds-list">
          <li><strong>Leia antes de instalar</strong>: o <code>SKILL.md</code> inteiro e <em>cada script</em>. Prefira origens conhecidas, fixe a versão (um commit) e guarde as suas skills no Git, para ver o que mudou.</li>
          <li><strong>Não ponha segredos numa skill.</strong> Ela é um arquivo de texto, lido pelo modelo e talvez compartilhado. Chaves vêm de variáveis de ambiente (o Hermes tem <code>required_environment_variables</code> para declarar quais a skill precisa, sem guardar o valor).</li>
          <li><strong>Instrução não é barreira.</strong> “Nunca apague arquivos” numa skill reduz a chance, mas não impede. O que precisa valer sempre vai fora do modelo: permissões, hooks e isolamento de rede. Veja a <a href="/notas/agent-harness/">nota de harness</a> (guardrails).</li>
        </ul>
      </Section>
      <Section id="lab" title={"Praticar: criar, validar e testar"}>
        <Callout icon="check"><strong>O que executei e o que não.</strong> Criei as quatro skills de exemplo desta nota e as validei com o linter da atividade 2 (saída real abaixo, inclusive o erro do dois-pontos). <strong>Não rodei as skills dentro de um agente</strong>: a atividade 3 (disparo) e as de ajuste são roteiros para você executar no seu agente. O linter é meu e segue a especificação aberta; o validador oficial é o <code>skills-ref</code>.</Callout>
        <h3>Atividade 0: criar a estrutura</h3>
        <CodeBlock code={`mkdir -p skills/reviewing-code/{scripts,references}
mkdir -p skills/writing-functional-requirements/assets
mkdir -p skills/reviewing-security skills/releasing-version
# coloque em cada pasta o SKILL.md dos exemplos da nota (e os arquivos de apoio)
chmod +x skills/reviewing-code/scripts/changed-files.sh`} />
        <h3>Atividade 1: escrever uma skill sua</h3>
        <p>Escolha uma tarefa que você repete (revisar, escrever commits, montar um relatório). Faça-a uma vez com o agente, anote as <strong>correções que você teve de fazer</strong> e escreva o <code>SKILL.md</code> com: descrição (o quê e quando), passos, armadilhas (suas correções) e um modelo de saída. Menos de 100 linhas é um bom começo.</p>
        <h3>Atividade 2: validar o formato (executada)</h3>
        <p>Este linter (só biblioteca padrão e PyYAML) confere o que a especificação exige: nome, descrição, tamanhos, links de apoio.</p>
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
        <p>O aviso do <code>disable-model-invocation</code> é esperado: o campo é do Claude Code, não da especificação aberta. Para a verificação oficial, use o <code>skills-ref validate ./minha-skill</code> do repositório da especificação.</p>
        <h3>Atividade 3: testar o disparo (roteiro, não executada)</h3>
        <p>Uma skill só ajuda se for ativada. A orientação oficial é montar cerca de 20 perguntas reais, metade que <em>devem</em> disparar a skill e metade que <em>não</em> devem, e rodar cada uma algumas vezes (o modelo não é determinístico). As mais valiosas são as <strong>quase-erros</strong>: perguntas que compartilham palavras com a skill, mas pedem outra coisa. Exemplo para <code>reviewing-code</code>:</p>
        <CodeBlock code={`[
  { "query": "can you look over my changes on the feat/login branch before I open the PR?", "should_trigger": true },
  { "query": "anything wrong with this diff? it's the retry logic in src/queue.ts", "should_trigger": true },
  { "query": "my manager wants a second pair of eyes on the payment PR, thoughts?", "should_trigger": true },
  { "query": "write a commit message for the staged changes", "should_trigger": false },
  { "query": "explain what this function does line by line", "should_trigger": false },
  { "query": "review the wording of this README paragraph", "should_trigger": false }
]`} />
        <p>Rode cada pergunta no seu agente e veja se ele carregou a skill (no Claude Code, a chamada da ferramenta <code>Skill</code> aparece na saída; nos outros, veja o log de ferramentas). Separe cerca de 60% das perguntas para ajustar a descrição e 40% para conferir se o ajuste vale para perguntas novas, senão você ajusta a descrição às suas frases e ela falha nas dos outros.</p>
        <p>Se perguntas que deviam disparar não disparam, a descrição está estreita; se as quase-erros disparam, está larga. O repositório <code>anthropics/skills</code> traz uma skill <code>skill-creator</code> que automatiza esse ciclo.</p>
        <h3>Atividade 4: comparar com e sem a skill (roteiro)</h3>
        <p>Rode a mesma tarefa real duas vezes, em sessões novas: sem a skill e com ela. Compare o resultado e o <em>rastro</em> (as ferramentas que o agente usou, não só a resposta final). Se a versão sem a skill já saiu boa, a skill não está agregando valor, e você pode apagá-la.</p>
        <p>Se o agente perde tempo, as instruções estão vagas, ou não se aplicam, ou oferecem opções demais sem um padrão. Cada correção que você fizer à mão vira uma linha na seção de armadilhas.</p>
        <h3>Atividade 5: dividir e juntar</h3>
        <p>Junte <code>reviewing-code</code> e <code>releasing-version</code> numa única skill <code>git-helper</code> e observe o que acontece com a descrição (ela ganha um “e” entre intenções que não se parecem) e com o risco (a revisão herda o poder de publicar).</p>
        <p>Depois separe de novo. Em seguida, pegue uma skill sua com mais de 300 linhas e mova os trechos raros para <code>references/</code>, com um gatilho no corpo (“se o erro for X, leia <code>references/x.md</code>”).</p>
      </Section>
      <Section id="cheat-sk" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Assunto", "Regra"]}
          rows={[
            ["O que é", <>Pasta com <code>SKILL.md</code> (YAML + Markdown). Padrão aberto; funciona em Claude Code, Codex, opencode e Hermes.</>],
            ["Como carrega", "Metadados sempre (~100 tokens) → corpo quando casa (< 500 linhas) → arquivos de apoio quando o corpo manda."],
            ["Frontmatter", <><code>name</code> (1 a 64, minúsculas e hífens, igual à pasta) e <code>description</code> (1 a 1024). Opcionais: <code>license</code>, <code>compatibility</code>, <code>metadata</code>, <code>allowed-tools</code>. Cuidado com dois-pontos sem aspas.</>],
            ["Descrição", "O que faz + quando usar + palavras do usuário; caso principal primeiro; uma convenção de voz."],
            ["Corpo", "Passos, armadilhas, modelo de saída; só o que o agente não sabe; padrões, não cardápios."],
            ["Apoio", <><code>scripts/</code> (determinismo, roda sem ser lido), <code>references/</code> (lido sob demanda), <code>assets/</code> (modelos); a um nível do SKILL.md.</>],
            ["Onde", <>Claude Code <code>.claude/skills</code>; Codex, opencode e Hermes <code>.agents/skills</code>; fonte única + symlink.</>],
            ["Dividir", <>Por intenção (gatilhos diferentes) e por risco (permissões diferentes). Tamanho se resolve com <code>references/</code>. Junte o que sempre carrega junto.</>],
            ["Temas", "Review e segurança: só leitura. Requisitos: proibições e modelo. Release: passos exatos, só você dispara. Código: curto, o resto no AGENTS.md."],
            ["Testar", "Linter de formato; ~20 perguntas (metade quase-erros); repetir; separar treino e validação; comparar com e sem a skill."],
            ["Segurança", "Skill = instruções e scripts com o acesso do agente. Leia antes, fixe versão, sem segredos, e use os controles do agente; instrução não é barreira."],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <ul>
          <li>Em que uma skill difere do AGENTS.md, de uma ferramenta MCP e de um subagente? Dê um caso para cada.</li>
          <li>O que são os três níveis da divulgação progressiva e por que a descrição é o campo mais importante?</li>
          <li>Reescreva a descrição “Ajuda com commits” para uma que diga o que faz e quando usar. Por que “Corta um release: sobe a versão” pode quebrar o YAML?</li>
          <li>Uma skill tem 700 linhas e uma única intenção. Você a divide em duas skills? O que faz em vez disso?</li>
          <li>Por que <code>reviewing-security</code> e <code>releasing-version</code> devem ser skills separadas, mesmo que ambas mexam com “código”?</li>
          <li>Como você escreveria uma skill de requisitos funcionais para impedir que o agente já proponha uma solução? E uma de segurança que só pode ler?</li>
          <li>Como você montaria o teste de disparo de uma skill? O que são quase-erros e por que separar treino e validação?</li>
          <li>Como guardar uma skill para Claude Code e Codex sem duplicar a pasta? O que você confere antes de instalar uma skill de terceiros?</li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://agentskills.io/specification" rel="noopener">Agent Skills: specification</a> · <a href="https://agentskills.io/skill-creation/best-practices" rel="noopener">Best practices for skill creators</a> · <a href="https://agentskills.io/skill-creation/optimizing-descriptions" rel="noopener">Optimizing skill descriptions</a> · <a href="https://agentskills.io/skill-creation/evaluating-skills" rel="noopener">Evaluating skill output quality</a></li>
          <li><a href="https://code.claude.com/docs/en/skills" rel="noopener">Claude Code: extend Claude with skills</a> · <a href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices" rel="noopener">Anthropic: skill authoring best practices</a> · <a href="https://github.com/anthropics/skills" rel="noopener">anthropics/skills</a> (<code>skill-creator</code>)</li>
          <li><a href="https://developers.openai.com/codex/skills" rel="noopener">Codex: agent skills</a> (redireciona para a documentação de skills da OpenAI) · <a href="https://opencode.ai/docs/skills" rel="noopener">opencode: agent skills</a> · <a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/skills" rel="noopener">Hermes Agent: skills system</a></li>
        </ul>
      </Sources>
    </>
  );
}
