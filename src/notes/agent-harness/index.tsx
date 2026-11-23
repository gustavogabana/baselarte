import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "agent-harness",
  title: "Agentes de IA: harness, RAG e guardrails",
  seo: {
    title: "Harness de agentes, RAG, guardrails, skills e AGENTS.md: o sistema em volta do modelo",
    description: "O que são harness de agentes, RAG, guardrails, Agent Skills e AGENTS.md e como se encaixam em um só desenho.",
  },
  summary: "o que são harness de agente, engenharia de contexto, AGENTS.md, Agent Skills (SKILL.md), RAG (BM25, contextual retrieval, busca agêntica) e guardrails (lethal trifecta, Rule of Two, hooks), e como se encaixam num só desenho de sistema. Um agente em Docker para rodar está numa nota irmã.",
  kicker: "Engenharia de IA",
  heroTitle: <>Harness, RAG, guardrails, skills e AGENTS.md: <em>o sistema em volta do modelo.</em></>,
  heroLede: "O que cada peça é, onde mora, quanto custa em contexto e como se encaixam em um só desenho.",
  published: "2026-10-26",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "map", title: "O mapa" },
        { id: "harness", title: "1. Harness" },
        { id: "mdfiles", title: "2. Arquivos .md e AGENTS.md" },
        { id: "skills", title: "3. Skills" },
        { id: "rag", title: "4. RAG" },
        { id: "guard", title: "5. Guardrails" },
        { id: "design", title: "6. System design" },
        { id: "cheat", title: "7. Resumo e checklist" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={"O mapa em uma página"}>
        <p>Um LLM recebe texto e devolve texto. Tudo o que faz dele um agente que lê arquivos, consulta documentos, roda testes e não vaza segredo é código e arquivos <b>em volta</b> dele. A fórmula que se firmou em 2026 é <b>agente = modelo + harness</b>, e o trabalho de projetar esse resto ganhou nome: <i>harness engineering</i>.</p>
        <Diagram minWidth={640} caption={"O modelo só pede; quem executa é o harness, e os guardrails ficam entre o pedido e o efeito."}>
          <svg viewBox="0 0 700 336" role="img" aria-label="Arquitetura de um agente">
            <rect x="132" y="8" width="404" height="298" rx="6" className="ln dash" />
            <text x="142" y="24" className="mut mono" textAnchor="start">harness (seu código)</text>
            <rect x="8" y="124" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="56.0" y="149.0" textAnchor="middle">Usuário</text>
            <text x="56.0" y="166.0" className="mut" textAnchor="middle">pergunta</text>
            <rect x="148" y="38" width="176" height="58" rx="4" className="ln fillsoft" />
            <text x="236.0" y="64.0" textAnchor="middle">Contexto</text>
            <text x="236.0" y="81.0" className="mut" textAnchor="middle">regras + AGENTS.md + skills</text>
            <rect x="340" y="38" width="180" height="58" rx="4" className="ln fillsoft" />
            <text x="430.0" y="64.0" textAnchor="middle">Loop do agente</text>
            <text x="430.0" y="81.0" className="mut" textAnchor="middle">limite de passos · trace</text>
            <rect x="148" y="118" width="372" height="54" rx="4" className="ln brandfill" />
            <text x="334.0" y="142.0" textAnchor="middle">Guardrails</text>
            <text x="334.0" y="159.0" className="mut" textAnchor="middle">caminho · aprovação · redação · limites</text>
            <rect x="148" y="192" width="90" height="48" rx="4" className="ln fillsoft" />
            <text x="193.0" y="213.0" textAnchor="middle">search_docs</text>
            <text x="193.0" y="230.0" className="mut" textAnchor="middle">RAG · BM25</text>
            <rect x="242" y="192" width="90" height="48" rx="4" className="ln fillsoft" />
            <text x="287.0" y="213.0" textAnchor="middle">read_file</text>
            <text x="287.0" y="230.0" className="mut" textAnchor="middle">docs/ (ro)</text>
            <rect x="336" y="192" width="90" height="48" rx="4" className="ln fillsoft" />
            <text x="381.0" y="213.0" textAnchor="middle">write_file</text>
            <text x="381.0" y="230.0" className="mut" textAnchor="middle">notes/ (rw)</text>
            <rect x="430" y="192" width="90" height="48" rx="4" className="ln fillsoft" />
            <text x="475.0" y="213.0" textAnchor="middle">load_skill</text>
            <text x="475.0" y="230.0" className="mut" textAnchor="middle">SKILL.md</text>
            <rect x="148" y="260" width="372" height="34" rx="4" className="ln fillsoft" />
            <text x="334.0" y="281.0" textAnchor="middle">Workspace: AGENTS.md · skills/ · docs/ · notes/</text>
            <rect x="566" y="124" width="126" height="56" rx="4" className="ln brandfill" />
            <text x="629.0" y="149.0" textAnchor="middle">Modelo</text>
            <text x="629.0" y="166.0" className="mut" textAnchor="middle">Ollama ou API</text>
            <path d="M104 152L132 152" className="ln" />
            <path d="M124.8 155.5L132 152L124.8 148.5" className="ln" />
            <path d="M536 152L566 152" className="ln" />
            <path d="M558.8 155.5L566 152L558.8 148.5" className="ln" />
            <path d="M543.2 155.5L536 152L543.2 148.5" className="ln" />
            <path d="M324 67L340 67" className="ln" />
            <path d="M332.8 70.5L340 67L332.8 63.5" className="ln" />
            <path d="M430 96L430 118" className="ln" />
            <path d="M433.5 110.8L430 118L426.5 110.8" className="ln" />
            <path d="M334 172L334 192" className="ln" />
            <path d="M337.5 184.8L334 192L330.5 184.8" className="ln" />
            <path d="M193 240L193 260" className="ln" />
            <path d="M196.5 252.8L193 260L189.5 252.8" className="ln" />
            <path d="M287 240L287 260" className="ln" />
            <path d="M290.5 252.8L287 260L283.5 252.8" className="ln" />
            <path d="M381 240L381 260" className="ln" />
            <path d="M384.5 252.8L381 260L377.5 252.8" className="ln" />
            <path d="M475 240L475 260" className="ln" />
            <path d="M478.5 252.8L475 260L471.5 252.8" className="ln" />
            <text x="142" y="326" className="mut mono" textAnchor="start">container: read-only · sem capabilities · rede selada</text>
          </svg>
        </Diagram>
        <p>Cada conceito do título ocupa um lugar diferente nesse desenho:</p>
        <Table
          head={["Conceito", "O que é", "Custo no contexto", "Quem garante"]}
          rows={[
            [<><b>Harness</b></>, "O programa que roda o loop, monta o contexto, executa as ferramentas e aplica limites. Claude Code, Codex e Cursor são harnesses.", "Nenhum por si; define o que entra no contexto.", "Código seu"],
            [<><b>AGENTS.md</b> / CLAUDE.md</>, "Briefing fixo do projeto, carregado em toda sessão.", "Tokens em todo turno, sempre.", "O modelo, por obediência (probabilístico)"],
            [<><b>Skill</b> (SKILL.md)</>, "Procedimento sob demanda, com scripts e referências opcionais.", "~100 tokens por skill no catálogo; o corpo só quando ativa.", <>O modelo (ou você, com <code>/nome</code>)</>],
            [<><b>RAG</b></>, "Buscar trechos de uma base e colocá-los no contexto antes de responder.", "Só os trechos devolvidos.", "A qualidade do índice e da busca"],
            [<><b>Guardrails</b></>, "Controles fora do modelo sobre o que entra, o que as ferramentas fazem e o que sai.", "Nenhum.", "Código, hooks e sandbox (determinístico)"],
          ]}
        />
        <Callout tone="use" icon="check"><b>Regra de bolso.</b> O que precisa valer <i>sempre</i> vira guardrail (código). O que o modelo precisa saber <i>sempre</i> vai para o AGENTS.md. O que só vale <i>às vezes</i> vira skill. O que é grande e consultável vira RAG.</Callout>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> essa regra de bolso é a síntese que faço a partir das fontes abaixo, não uma recomendação oficial de nenhuma delas.</Callout>
      </Section>
      <Section id="harness" title={"1. Harness: o que roda em volta do modelo"}>
        <p>No dicionário de IA para programar de Matt Pocock, harness é tudo em volta do modelo que o transforma em agente: ferramentas, system prompt, gerenciamento de contexto, permissões e hooks. O modelo é <i>stateless</i>: só vê o que está na janela de contexto a cada requisição. A continuidade vem do harness reenviando a conversa e de arquivos no ambiente.</p>
        <h3>O loop</h3>
        <p>Todo harness, do Claude Code ao seu script de cem linhas, repete a mesma coisa. O ponto de design importante é que o modelo nunca executa nada: ele <b>pede</b> uma ferramenta, e o harness decide se executa.</p>
        <CodeBlock code={`enquanto passos < limite:
    resposta = modelo(mensagens, ferramentas)
    se resposta não pede ferramenta:
        devolve resposta                     # condição de parada
    para cada pedido em resposta:
        resultado = guardrails(executa(pedido))   # o harness executa, não o modelo
        mensagens += resultado               # o ambiente vira o próximo contexto`} />
        <p>A Anthropic resume assim: um agente é tipicamente um LLM usando ferramentas em loop, com feedback do ambiente a cada passo, e parando por uma condição de término ou por um limite como número máximo de iterações.</p>
        <h3>Workflow ou agente?</h3>
        <p>Antes de dar autonomia ao modelo, veja se um fluxo fixo resolve. A Anthropic distingue <b>workflows</b> (caminhos definidos em código) de <b>agentes</b> (o modelo decide o caminho) e recomenda começar pelo mais simples, porque agentes trocam latência e custo por desempenho. Os cinco padrões de workflow:</p>
        <Table
          head={["Padrão", "Como funciona", "Use quando"]}
          rows={[
            ["Encadeamento de prompts", "Chamadas em sequência, com checagem em código entre elas.", "A tarefa se divide em etapas limpas."],
            ["Roteamento", "Classifica a entrada e manda para um prompt, ferramenta ou modelo especializado.", "Perguntas simples vão para modelo barato, difíceis para o grande."],
            ["Paralelização", "Subtarefas ao mesmo tempo, ou a mesma tarefa várias vezes para votar.", "Um modelo de guardrail ao lado do que responde; vários revisores."],
            ["Orquestrador e trabalhadores", "Um LLM central quebra a tarefa e delega.", "Não dá para prever as subtarefas, como mudanças em vários arquivos."],
            ["Avaliador e otimizador", "Um gera, outro critica, em loop.", "Há critério claro e a revisão melhora o resultado."],
          ]}
        />
        <h3>Context engineering</h3>
        <p>Se o modelo só vê a janela, o trabalho central do harness é decidir <b>o que entra nela</b>. A Anthropic chama isso de <i>context engineering</i>: curar o conjunto ótimo de tokens a cada inferência, não só escrever o prompt. As técnicas que se repetem nas fontes:</p>
        <ul className="ds-list">
          <li><b>Context rot.</b> Quanto mais tokens, pior a recuperação de detalhes. Contexto é recurso finito. Pocock chama de <i>smart zone</i> e <i>dumb zone</i> e sugere que a segunda costuma começar por volta de 125 a 150 mil tokens, número que ele mesmo diz ser debatido.</li>
          <li><b>Recuperação just-in-time.</b> Em vez de carregar tudo, guarde referências leves (caminhos, queries, links) e busque quando precisar. É a ideia por trás de skills e de RAG como ferramenta.</li>
          <li><b>Compactação.</b> Perto do limite, resumir a conversa e continuar numa janela nova. Primeiro maximize a retenção do essencial, depois corte o supérfluo, como resultados antigos de ferramentas.</li>
          <li><b>Notas estruturadas.</b> O agente escreve em um arquivo fora da janela (lista de tarefas, NOTES.md) e relê depois.</li>
          <li><b>Subagentes.</b> Um agente especializado trabalha numa janela limpa e devolve só um resumo condensado ao principal.</li>
        </ul>
        <h3>Harness engineering: a prática</h3>
        <p>Mitchell Hashimoto (criador do Terraform e do Ghostty) deu o nome em um texto de 2026: “sempre que você descobre que o agente cometeu um erro, dedique tempo a construir uma solução para que ele nunca mais cometa esse erro”.</p>
        <p>Ele descreve duas formas: melhorar o prompt implícito (uma linha no AGENTS.md, cada linha nascida de um mau comportamento) e criar ferramentas programadas (scripts que tiram screenshot, rodam testes filtrados), avisando o agente no AGENTS.md. O objetivo declarado é também que o agente consiga <b>verificar</b> o que fez.</p>
        <p>A OpenAI publicou em fevereiro de 2026 o relato de um experimento em que o Codex escreveu todo o código de um produto (segundo resumos, na casa de um milhão de linhas, sem código escrito à mão).</p>
        <p>As lições que aparecem nos resumos: um AGENTS.md gigante falhou e virou um <b>mapa de cerca de 100 linhas</b> apontando para um diretório <code>docs/</code> que é a fonte da verdade; linters e CI validam que a documentação está atual; um agente “jardineiro” abre PRs contra documentação velha; linters customizados têm mensagens de erro que apontam para runbooks; e o princípio de tornar o erro <b>impossível</b>, não só improvável.</p>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> não consegui abrir o texto original da OpenAI (a página devolveu 403). Os números e as lições acima vêm de resumos de terceiros (ZenML, notas de leitores). Confira no original antes de citar.</Callout>
        <h3>Sessões longas: um harness para vários contextos</h3>
        <p>Quando o trabalho dura mais que uma janela, a Anthropic descreve (com o Claude Agent SDK) dois papéis: um <b>agente inicializador</b> que roda uma vez e prepara o ambiente (script <code>init.sh</code>, arquivo de progresso, commit inicial, lista de features) e um <b>agente de código</b> que, a cada sessão, avança uma feature e deixa o estado limpo.</p>
        <p>A lista de features é um JSON com tudo inicialmente marcado como falhando, porque os modelos sobrescrevem menos JSON do que Markdown. Os problemas e as correções:</p>
        <Table
          head={["Problema", "Correção no harness"]}
          rows={[
            ["Declara o projeto pronto cedo demais", "Lista de features em JSON; uma feature por sessão"],
            ["Deixa bugs e progresso sem registro", "Commits no git, arquivo de progresso e teste básico no início da sessão"],
            ["Marca feature como feita sem testar de verdade", "Exigir teste ponta a ponta como um usuário (automação de navegador), não só unitário ou curl"],
            ["Perde tempo descobrindo como rodar o app", <>Script <code>init.sh</code> que sobe o servidor de desenvolvimento</>],
          ]}
        />
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://github.com/mattpocock/dictionary-of-ai-coding">Matt Pocock · Dictionary of AI Coding (harness, agent, context, smart/dumb zone)</a></li>
            <li><a href="https://mitchellh.com/writing/my-ai-adoption-journey">Mitchell Hashimoto · My AI Adoption Journey (engineer the harness)</a></li>
            <li><a href="https://www.zenml.io/llmops-database/harness-engineering-structuring-context-and-guardrails-for-ai-coding-agents-in-production">ZenML · Harness engineering: structuring context and guardrails (summary of a talk)</a></li>
            <li><a href="https://www.anthropic.com/engineering/building-effective-agents">Anthropic · Building effective agents</a></li>
            <li><a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Anthropic · Effective context engineering for AI agents</a></li>
            <li><a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic · Effective harnesses for long-running agents</a></li>
            <li><a href="https://openai.com/index/harness-engineering/">OpenAI · Harness engineering: leveraging Codex in an agent-first world (original, 403 here)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="mdfiles" title={"2. Arquivos .md que as IAs leem"}>
        <p>Como o modelo não lembra de uma sessão para a outra, o que você quer que ele saiba precisa estar em arquivo. Cada arquivo abaixo tem um papel e um momento diferentes de entrar no contexto, e escolher o lugar errado é o erro mais comum.</p>
        <Table
          head={["Arquivo", "Quem lê", "Entra no contexto", "Serve para"]}
          rows={[
            [<><code>AGENTS.md</code></>, "Padrão aberto, hoje sob a Agentic AI Foundation (Linux Foundation). Codex, Cursor, Copilot coding agent, Gemini CLI, Jules, Amp, Aider, Zed, Windsurf, Devin e outros.", "No início da sessão; em monorepo vale o arquivo mais próximo do que está sendo editado.", "Comandos de build e teste, convenções, restrições duras."],
            [<><code>CLAUDE.md</code></>, "Claude Code.", "No início da sessão.", "O mesmo papel do AGENTS.md. Se usa vários agentes, deixe o conteúdo no AGENTS.md e faça o CLAUDE.md apontar para ele."],
            [<><code>SKILL.md</code></>, "Agentes que adotaram a spec Agent Skills (Claude Code, Codex e outros).", "Nome e descrição no início; o corpo só quando a skill é ativada.", "Procedimentos reutilizáveis."],
            [<><code>GEMINI.md</code>, <code>.github/copilot-instructions.md</code>, <code>.cursor/rules/</code></>, "Gemini CLI, GitHub Copilot, Cursor.", "No início da sessão ou por regra.", "Equivalentes por ferramenta ao AGENTS.md (nomes de memória; confira na doc da sua ferramenta)."],
            [<><code>docs/</code>, ADRs, <code>GLOSSARY.md</code></>, "O agente, lendo ou buscando.", "Sob demanda (just-in-time).", "Decisões e vocabulário. Pocock usa o glossário para reduzir verbosidade e padronizar nomes."],
            [<><code>claude-progress.txt</code>, <code>NOTES.md</code>, <code>features.json</code></>, "O próprio agente, na sessão seguinte.", "No início e no fim de cada sessão.", "Memória entre sessões e handoff."],
          ]}
        />
        <h3>AGENTS.md: um mapa, não um manual</h3>
        <p>O AGENTS.md é descrito como um “README para agentes”: o que não cabe no README humano, como comandos de teste e convenções. Tudo o que está nele é carregado em <b>toda</b> sessão e custa tokens em todo turno, e quanto mais instruções se acumulam, menos confiável é o cumprimento de cada uma (verbete do próprio Pocock). Por isso:</p>
        <ul className="ds-list">
          <li><b>Entra:</b> o que o agente não consegue deduzir do código: comandos exatos, convenções não óbvias, restrições duras (“nunca edite o cliente gerado”). Curto e declarativo.</li>
          <li><b>Fica de fora:</b> visão geral da arquitetura que o código já mostra, guias de estilo longos (vão para uma skill ou para <code>docs/</code>), e regras que um linter pode impor.</li>
          <li><b>Critério de entrada:</b> se você corrigiu o agente duas vezes no mesmo ponto, é candidato (Pocock). É a versão de Hashimoto: cada linha vem de um mau comportamento observado.</li>
          <li><b>Aponte, não copie:</b> o AGENTS.md da OpenAI virou um índice de cerca de 100 linhas para <code>docs/</code>.</li>
        </ul>
        <CodeBlock code={`# Ruim: manual, vago, repete o que o código mostra
Este projeto usa TypeScript e React. Escreva código limpo e bem testado.
Siga boas práticas. A pasta src contém o código-fonte. ...(300 linhas)...

# Bom: mapa, comandos exatos, restrições, ponteiros
- Testes: \`pnpm test --filter api\` (rápido) antes de \`pnpm test\` (lento, CI).
- Nunca edite \`src/client/generated/\`; rode \`pnpm gen:client\`.
- Migrações: veja docs/migrations.md antes de tocar em \`db/\`.
- Vocabulário do domínio: docs/GLOSSARY.md`} />
        <Callout tone="warn" icon="alert"><b>Arquivo gerado por LLM não é produto final.</b> O estudo de Gloaguen et al. (ETH Zurich, arXiv 2602.11988) mediu agentes de código com e sem arquivos de contexto: em média não houve ganho significativo de sucesso, e o custo de inferência subiu mais de 20%. Os arquivos escritos por desenvolvedores se saíram melhor do que os gerados por LLM, e visões gerais do repositório não ajudaram. Quando os autores removeram toda a outra documentação do repositório, os arquivos gerados passaram a ajudar um pouco (cerca de 2,7%). Leitura prática: escreva à mão o que o código não diz, e corte o resto.</Callout>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> o artigo foi revisado e as versões trazem números um pouco diferentes; tratei os resultados como tendência. Os nomes <code>GEMINI.md</code>, <code>copilot-instructions.md</code> e <code>.cursor/rules/</code> são de memória e não os conferi nas documentações.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://agents.md">agents.md · AGENTS.md, a README for agents (adoption, tools, precedence)</a></li>
            <li><a href="https://github.com/mattpocock/dictionary-of-ai-coding/blob/main/dictionary/AGENTS.md.md">Matt Pocock · Dictionary of AI Coding: AGENTS.md</a></li>
            <li><a href="https://arxiv.org/abs/2602.11988">Gloaguen et al. · Evaluating AGENTS.md: Are repository-level context files helpful for coding agents?</a></li>
            <li><a href="https://github.com/mattpocock/skills/issues/558">mattpocock/skills · issue 558 (AGENTS.md vs CLAUDE.md)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="skills" title={"3. Skills: conhecimento sob demanda"}>
        <p>Uma skill é uma pasta com um <code>SKILL.md</code>: frontmatter YAML com nome e descrição, e o procedimento em Markdown.</p>
        <p>A Anthropic criou o formato e o abriu como padrão (uma fonte data o anúncio de 18 de dezembro de 2025); a spec vive em agentskills.io e já é lida por vários agentes além do Claude Code. A ideia central é a <b>divulgação progressiva</b>: o agente carrega só o que a tarefa pede.</p>
        <Diagram minWidth={600} caption={"A descrição é o único texto que fica sempre carregado, então ela decide se a skill será usada."}>
          <svg viewBox="0 0 700 140" role="img" aria-label="Três níveis de carregamento de uma skill">
            <rect x="8" y="20" width="200" height="78" rx="4" className="ln brandfill" />
            <text x="108.0" y="56.0" textAnchor="middle">1. Metadados</text>
            <text x="108.0" y="73.0" className="mut" textAnchor="middle">name + description</text>
            <text x="108.0" y="89.0" className="mut" textAnchor="middle">~100 tokens</text>
            <rect x="250" y="20" width="200" height="78" rx="4" className="ln fillsoft" />
            <text x="350.0" y="56.0" textAnchor="middle">2. Instruções</text>
            <text x="350.0" y="73.0" className="mut" textAnchor="middle">corpo do SKILL.md · &lt; 5000 tokens</text>
            <rect x="492" y="20" width="200" height="78" rx="4" className="ln fillsoft" />
            <text x="592.0" y="56.0" textAnchor="middle">3. Recursos</text>
            <text x="592.0" y="73.0" className="mut" textAnchor="middle">scripts/ · references/ · assets/</text>
            <path d="M208 59L250 59" className="ln" />
            <path d="M242.8 62.5L250 59L242.8 55.5" className="ln" />
            <path d="M450 59L492 59" className="ln" />
            <path d="M484.8 62.5L492 59L484.8 55.5" className="ln" />
            <text x="108" y="124" className="mut" textAnchor="middle">sempre no contexto</text>
            <text x="350" y="124" className="mut" textAnchor="middle">quando a tarefa casa com a descrição</text>
            <text x="592" y="124" className="mut" textAnchor="middle">só quando o corpo manda ler</text>
          </svg>
        </Diagram>
        <CodeBlock code={`skill-name/
├── SKILL.md          # obrigatório: metadados + instruções
├── scripts/          # opcional: código executável
├── references/       # opcional: documentação lida sob demanda
└── assets/           # opcional: templates, esquemas, dados`} />
        <Table
          head={["Campo", "Obrig.", "Regra (spec)"]}
          rows={[
            [<><code>name</code></>, "Sim", "1 a 64 caracteres; letras minúsculas, números e hífens; sem hífen no início, no fim ou duplo; igual ao nome da pasta."],
            [<><code>description</code></>, "Sim", <>1 a 1024 caracteres. Diz o que a skill faz <b>e quando usar</b>, com palavras-chave que o agente reconheça.</>],
            [<><code>license</code>, <code>compatibility</code>, <code>metadata</code></>, "Não", "Licença; requisitos de ambiente (até 500 caracteres); mapa livre de chaves."],
            [<><code>allowed-tools</code></>, "Não", "Ferramentas pré-aprovadas, separadas por espaço. Experimental; o suporte varia entre agentes."],
          ]}
        />
        <p>Duas recomendações da spec importam no design: manter o <code>SKILL.md</code> abaixo de 500 linhas (instruções com menos de 5000 tokens) e referenciar arquivos auxiliares a <b>um nível</b> de profundidade, sem cadeias de referências.</p>
        <CodeBlock code={`# descrição ruim: o agente não sabe quando ativar
description: Helps with PDFs.

# descrição boa: o que faz + quando usar + palavras-chave
description: Extracts text and tables from PDF files, fills PDF forms, and merges
  multiple PDFs. Use when working with PDF documents or when the user mentions
  PDFs, forms, or document extraction.`} />
        <h3>Skill, AGENTS.md, ferramenta, subagente ou RAG?</h3>
        <Table
          head={["Mecanismo", "Quando entra", "Use para", "Exemplo"]}
          rows={[
            ["AGENTS.md", "Sempre", "Fatos curtos que valem em toda tarefa", <>“rode <code>pnpm test</code>”</>],
            ["Skill", "Quando a descrição casa", "Procedimento com passos, às vezes com scripts", "Revisão de PR, processo de release"],
            ["Ferramenta (ou MCP)", "Quando o modelo chama", "Ação ou consulta que o modelo não faz sozinho", <><code>search_docs</code>, <code>run_tests</code></>],
            ["Subagente", "Quando o principal delega", "Trabalho volumoso que não deve poluir o contexto principal", "Explorar o repositório e devolver um resumo"],
            ["RAG", "Quando alguém busca", "Base grande, que muda, consultada por trechos", "Manuais, tickets, wiki"],
            ["Hook / guardrail", "Sempre, fora do modelo", "O que não pode depender de obediência", <>Bloquear edição de <code>.env</code></>],
          ]}
        />
        <h3>As skills de Matt Pocock</h3>
        <p>O repositório <code>mattpocock/skills</code> é um bom estudo de como projetar skills. Ele separa as <b>invocadas por você</b> (<code>/grill-me</code>, <code>/to-spec</code>, <code>/implement</code>, <code>/handoff</code>) das <b>invocadas pelo modelo</b> (<code>tdd</code>, <code>diagnosing-bugs</code>, <code>code-review</code>, <code>research</code>).</p>
        <p>A filosofia declarada: alinhar antes de construir (a maioria das falhas vem de mal-entendido, então o agente te entrevista até resolver cada ramo do design), criar vocabulário compartilhado em um <code>GLOSSARY.md</code>, dar feedback rápido ao agente (tipos, testes, navegador) e trabalhar em fatias verticais pequenas. As skills são pequenas e feitas para você editar.</p>
        <Callout tone="warn" icon="alert"><b>Skill é código com as permissões do agente.</b> Uma skill instala instruções e scripts que o agente vai executar com o seu acesso. Preprints de 2026 já estudam privilégio mínimo para skills e violações da spec em milhares de arquivos. Leia o <code>SKILL.md</code> e os <code>scripts/</code> antes de instalar de terceiros, como faria com uma dependência.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://agentskills.io/specification">Agent Skills · Specification</a></li>
            <li><a href="https://github.com/mattpocock/skills">Matt Pocock · skills (repository and philosophy)</a></li>
            <li><a href="https://arxiv.org/pdf/2605.05868">SkillScope: least-privilege enforcement for agent skills (preprint)</a></li>
            <li><a href="https://arxiv.org/pdf/2608.08453">What keeps agent skills from being reusable? Evidence from 138K SKILL.md files (preprint)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="rag" title={"4. RAG: buscar antes de responder"}>
        <p>RAG (<i>retrieval-augmented generation</i>) é buscar trechos relevantes de uma base e colocá-los no prompt para o modelo responder com base neles. Resolve conhecimento privado ou recente sem retreinar, e permite citar a fonte. O pipeline clássico tem duas metades:</p>
        <ol className="ds-steps">
          <li><b>Ingestão (offline):</b> carregar os documentos, <b>quebrar em chunks</b> (de preferência por título e seção, não por um número cego de caracteres), enriquecer cada chunk e indexar (BM25, vetores ou os dois).</li>
          <li><b>Consulta (online):</b> reescrever a pergunta, recuperar os N melhores, <b>reordenar</b> (<i>rerank</i>), montar o contexto com a fonte de cada trecho, gerar e citar.</li>
        </ol>
        <h3>O estado da arte, em números</h3>
        <p>O resultado mais citado é o <i>Contextual Retrieval</i> da Anthropic. O problema: um chunk como “a receita cresceu 3% no trimestre” perde o contexto (qual empresa, qual trimestre) e não é recuperado. A solução é prefixar cada chunk com 50 a 100 tokens de contexto gerados por um LLM antes de indexar. Taxa de falha da recuperação dos 20 melhores chunks:</p>
        <Table
          head={["Técnica", "Falha", "Redução"]}
          rows={[
            ["Embeddings + BM25 (base)", "5,7%", "—"],
            ["Embeddings contextuais", "3,7%", "35%"],
            ["Embeddings + BM25 contextuais", "2,9%", "49%"],
            ["Idem + reranker (150 candidatos, top 20)", "1,9%", "67%"],
          ]}
        />
        <p>Dois recados do mesmo texto: o custo único de gerar o contexto ficou em torno de US$ 1,02 por milhão de tokens de documento (com prompt caching), e <b>abaixo de 200 mil tokens (cerca de 500 páginas) pode valer mais pôr a base inteira no prompt</b> com cache do que montar RAG.</p>
        <h3>RAG clássico ou busca agêntica?</h3>
        <p>Em 2026 a discussão deixou de ser “RAG morreu?” e virou “quem decide quando e como buscar”. No RAG clássico o pipeline busca sempre e fixo. Na <b>busca agêntica</b>, a busca é uma ferramenta: o modelo escolhe quando buscar, reformula a consulta e lê os arquivos (inclusive com <code>grep</code>).</p>
        <p>Preprints de 2026 reportam que um pipeline simples de grep e leitura rivaliza com frameworks completos em tarefas de engenharia de software, e que a busca lexical (BM25) preserva nomes e termos exatos que embeddings perdem. O consenso das fontes é por <b>roteamento</b>, não por uma técnica única:</p>
        <Table
          head={["Situação", "Abordagem"]}
          rows={[
            ["Base pequena e estável (< 200 mil tokens)", "Tudo no prompt, com prompt caching"],
            ["Código ou texto com nomes exatos (funções, IDs, erros)", "BM25 ou grep como ferramenta; o agente lê o arquivo"],
            ["Base grande, em linguagem natural, perguntas por significado", "Híbrido (vetores + BM25), chunks contextuais, reranker"],
            ["Pergunta de vários saltos, sem caminho previsível", "Busca agêntica (aceite mais latência, tokens e variação)"],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>O texto recuperado é entrada não confiável.</b> Tudo o que o RAG traz para o contexto pode conter instruções (injeção de prompt indireta). Por isso o <a href="/notas/agent-docker-project/">projeto no Docker</a> cerca cada trecho com <code>&lt;untrusted&gt;</code>, redige segredos antes de o modelo ver e filtra por permissão <i>na recuperação</i>, não depois. E meça com as suas perguntas: o recall dos N melhores na sua base decide, não a média dos benchmarks.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://www.anthropic.com/engineering/contextual-retrieval">Anthropic · Introducing Contextual Retrieval</a></li>
            <li><a href="https://arxiv.org/pdf/2605.05242">Beyond semantic similarity: retrieval for agentic search via direct corpus interaction (preprint)</a></li>
            <li><a href="https://arxiv.org/pdf/2603.07379">SoK: Agentic Retrieval-Augmented Generation (preprint)</a></li>
            <li><a href="https://akitaonrails.com/en/2026/04/06/rag-is-dead-long-context/">Is RAG dead? Long context, grep and the end of the mandatory vector DB (blog)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="guard" title={"5. Guardrails: o que vale mesmo se o modelo errar"}>
        <p>Um guardrail é um controle <b>fora do modelo</b> que limita o que pode acontecer, mesmo se o modelo errar ou for manipulado. A distinção que organiza o assunto: um prompt (inclusive o AGENTS.md) é um pedido, e o modelo cumpre com alguma probabilidade; um guardrail em código é uma garantia. Da palestra resumida pela ZenML: aposte em tornar o erro impossível, não só improvável.</p>
        <h3>Camadas</h3>
        <Table
          head={["Camada", "Impede", <>No <a href="/notas/agent-docker-project/">projeto no Docker</a></>]}
          rows={[
            ["1. Entrada", "Abuso, PII, pedidos fora do escopo", "Não implementada (o escopo vem do AGENTS.md)"],
            ["2. Contexto e recuperação", "Texto externo virar instrução; vazar dado a quem não pode ver", <><code>untrusted()</code> cerca e redige cada trecho</>],
            ["3. Política de ferramentas", "Ler ou escrever onde não deve", <><code>Policy.resolve</code>: confina ao workspace e a <code>notes/</code></>],
            ["4. Aprovação humana", "Ação irreversível ou externa sem alguém ver", <><code>Policy.approve</code> em todo <code>write_file</code></>],
            ["5. Saída", "Segredo na resposta ou no arquivo gravado", <><code>redact()</code> na resposta, nos resultados e no conteúdo gravado</>],
            ["6. Limites de execução", "Loop infinito, custo sem teto", <><code>max_steps</code></>],
            ["7. Sandbox", "O que um agente comprometido alcança", "Container read-only, sem capabilities, rede interna"],
            ["8. Observabilidade", "Incidente que ninguém consegue reconstruir", "Uma linha JSON por chamada de ferramenta"],
          ]}
        />
        <h3>O modelo mental: a trifeta letal e a Regra de Dois</h3>
        <p>Simon Willison descreveu em junho de 2025 a <b>trifeta letal</b>: um agente com (1) acesso a dados privados, (2) exposição a conteúdo não confiável e (3) capacidade de se comunicar com o exterior pode ser levado, por injeção de prompt, a exfiltrar os dados.</p>
        <p>Em 31 de outubro de 2025 a Meta publicou a <b>Regra de Dois</b>: enquanto injeção de prompt não puder ser detectada com confiança, um agente deve ter <b>no máximo duas</b> dessas propriedades numa mesma sessão; se precisar das três, não deve rodar sem supervisão (aprovação humana ou outra validação confiável). A própria Meta admite que alguns casos de uso não se encaixam bem.</p>
        <Table
          head={["Propriedade", "O agente do projeto no Docker"]}
          rows={[
            ["Conteúdo não confiável", <>Sim: <code>docs/</code> pode conter texto de terceiros (o <code>onboarding.md</code> traz uma injeção de propósito).</>],
            ["Dados sensíveis", "Sim: há uma chave de teste nos docs."],
            ["Mudar estado ou falar com o exterior", <>Quase não: escreve só em <code>notes/</code>, com aprovação humana, e a rede é selada. É a terceira propriedade, mantida sob supervisão.</>],
          ]}
        />
        <h3>Hooks: guardrails no harness que você não escreveu</h3>
        <p>Se você usa um harness pronto, o lugar de pôr guardrails determinísticos são os hooks. No Claude Code, um hook <code>PreToolUse</code> roda antes da ferramenta, recebe o JSON da chamada na entrada padrão e, com <b>código de saída 2</b>, bloqueia a ação e devolve ao modelo a mensagem escrita em stderr. Exemplo da documentação, que protege arquivos sensíveis:</p>
        <CodeBlock code={`# .claude/hooks/protect-files.sh   (chmod +x)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

for pattern in ".env" "package-lock.json" ".git/"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done
exit 0

# .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [{ "type": "command",
                    "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/protect-files.sh" }] }
    ]
  }
}`} />
        <p>Note a assimetria da documentação: sair com 0 de um hook <code>PreToolUse</code> <b>não aprova</b> a chamada, que ainda passa pelo fluxo normal de permissões. E o linter também é um guardrail: o relato da OpenAI usa lints cujas mensagens de erro ensinam o agente a corrigir.</p>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> existem bibliotecas e modelos de classificação para a camada de entrada e saída (por exemplo NeMo Guardrails, Guardrails AI e Llama Guard). Cito de memória, não testei e não as usei no projeto.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://simonwillison.net/2025/nov/2/new-prompt-injection-papers">Simon Willison · Weblog (lethal trifecta, Meta's Rule of Two)</a></li>
            <li><a href="https://deepstation.ai/blog/metas-agents-rule-of-two-secure-ai-agent-framework">Meta's Agents Rule of Two (summary)</a></li>
            <li><a href="https://code.claude.com/docs/en/hooks-guide">Claude Code Docs · Automate actions with hooks</a></li>
            <li><a href="https://www.anthropic.com/engineering/building-effective-agents">Anthropic · Building effective agents (sandboxing, human checkpoints)</a></li>
            <li><a href="https://arxiv.org/pdf/2604.13630">SafeHarness: lifecycle-integrated security architecture for LLM agents (preprint)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="design" title={"6. System design: do pedido à resposta"}>
        <p>Juntando as peças no agente do <a href="/notas/agent-docker-project/">projeto no Docker</a> (um assistente de documentação de um produto fictício, o Acme Billing), uma pergunta percorre este caminho:</p>
        <ol className="ds-steps">
          <li><b>Montagem (uma vez por sessão).</b> O harness lê <code>AGENTS.md</code>, valida as skills (nome e descrição), indexa <code>docs/</code> em memória e monta o system prompt: regras fixas + AGENTS.md + catálogo de skills (só nomes e descrições).</li>
          <li><b>Pergunta.</b> O usuário pergunta “quanto tempo vale o reembolso?”.</li>
          <li><b>Modelo pede uma ferramenta.</b> Chama <code>search_docs</code> com palavras-chave. O modelo não executa nada.</li>
          <li><b>Harness executa com política.</b> BM25 devolve os chunks; cada um é redigido e cercado com <code>&lt;untrusted source=...&gt;</code>; o resultado vira mensagem de ferramenta.</li>
          <li><b>Rastro.</b> Uma linha JSON (passo, ferramenta, argumentos, resultado truncado, milissegundos) vai para stderr.</li>
          <li><b>Skill, se couber.</b> Se a pergunta pedir um formato, o modelo chama <code>load_skill</code> e só então o corpo da skill entra no contexto.</li>
          <li><b>Resposta.</b> Sem novos pedidos de ferramenta, o loop termina; a resposta passa por <code>redact()</code> e sai com as fontes.</li>
          <li><b>Se algo der errado.</b> Um chunk com injeção pode fazer o modelo pedir <code>write_file</code>. A política confina o caminho; a aprovação humana nega; a redação tira a chave do conteúdo; o limite de passos encerra loops. Cada negação volta ao modelo como texto <code>DENIED: ...</code>, para ele se corrigir.</li>
        </ol>
        <h3>Decisões de design</h3>
        <Table
          head={["Decisão", "Escolha", "Por quê", "Quando mudar"]}
          rows={[
            ["Onde mora a política", "No código do harness", "Prompt não é garantia", "Com harness pronto, use hooks"],
            ["Busca", "SQLite FTS5 (BM25), chunk por título", "Zero dependência, bom para termos exatos, roda na memória", "Base grande ou perguntas por significado: híbrido com vetores e reranker"],
            ["RAG como ferramenta", "O modelo decide quando buscar", "Perguntas triviais não pagam busca; multi-salto é possível", "Se toda pergunta exige busca, faça o pipeline fixo"],
            ["Skills", "Catálogo no prompt, corpo por ferramenta", "Progressive disclosure: custo por skill é só a descrição", "Poucas skills sempre usadas: ponha no AGENTS.md"],
            ["Modelo", <>Qualquer servidor <code>/v1/chat/completions</code></>, "Ollama local ou API hospedada sem mudar o harness", "Recursos exclusivos de um provedor: use o SDK dele"],
            ["Rede", "Rede interna do Compose, sem rota para a internet", "Agente comprometido não exfiltra pela rede", "API hospedada: libere só o domínio do provedor, por proxy"],
          ]}
        />
        <h3>Falhas previsíveis</h3>
        <Table
          head={["Falha", "Sintoma", "Defesa"]}
          rows={[
            ["Injeção de prompt via doc", "O modelo tenta escrever ou vazar algo que ninguém pediu", "Cercar como dado, aprovar escrita, redigir, rede selada"],
            ["Busca traz chunk errado", "Resposta confiante e errada", "Medir recall com perguntas suas; citar fonte; stopwords (veja o projeto no Docker)"],
            ["Contexto incha", "Respostas pioram em sessão longa", "Truncar resultados, skills sob demanda, compactar, subagentes"],
            ["Loop sem fim", "Custo e tempo sem teto", <><code>max_steps</code>; no caso real, orçamento de tokens e tempo</>],
            ["AGENTS.md envelhece", "O agente segue comando que não existe mais", "Teste de CI que roda os comandos citados; revisão a cada incidente"],
          ]}
        />
        <h3>Do protótipo à produção</h3>
        <ul className="ds-list">
          <li><b>Avaliações em CI.</b> Um conjunto fixo de perguntas e ataques (como os testes do <a href="/notas/agent-docker-project/">projeto no Docker</a>, mas com o modelo real) rodando a cada mudança em AGENTS.md, skills, índice ou modelo. Todo incidente vira um caso novo: “nunca dê o mesmo feedback duas vezes”.</li>
          <li><b>Rastro padronizado.</b> Troque o JSON em stderr por OpenTelemetry (o relato da OpenAI padroniza um framework só, para o modelo não precisar descobrir qual).</li>
          <li><b>Configuração versionada.</b> AGENTS.md, skills e política viram código revisado por PR, com dono.</li>
          <li><b>Isolamento por usuário ou tarefa.</b> Um container por execução; segredos fora do ambiente do agente (um proxy injeta a credencial).</li>
          <li><b>Orçamentos.</b> Tokens, tempo e dinheiro por tarefa, com parada e aviso.</li>
        </ul>
      </Section>
      <Section id="cheat" title={"7. Resumo e checklist"}>
        <Table
          head={["Termo", "Em uma frase"]}
          rows={[
            ["Harness", "Tudo em volta do modelo que o faz agir: loop, ferramentas, contexto, permissões, hooks."],
            ["Context engineering", "Decidir quais tokens entram na janela a cada passo."],
            ["AGENTS.md", "Mapa curto do projeto, carregado sempre; cada linha vem de um erro observado."],
            ["Skill", <>Procedimento em <code>SKILL.md</code> que carrega por níveis: descrição, corpo, recursos.</>],
            ["RAG", "Buscar trechos e pô-los no contexto com a fonte; trate o texto como não confiável."],
            ["Guardrail", "Controle em código fora do modelo; prompt é pedido, guardrail é garantia."],
            ["Regra de Dois", "Dados sensíveis, conteúdo não confiável e ação externa: no máximo dois sem supervisão."],
          ]}
        />
        <h3>Checklist para um agente seu</h3>
        <ul className="ds-list">
          <li>O modelo só <b>pede</b>; o código executa e valida cada pedido.</li>
          <li>AGENTS.md abaixo de ~100 linhas, escrito à mão, com comandos exatos e ponteiros para <code>docs/</code>.</li>
          <li>Procedimentos longos ou raros em skills, com descrição que diz <b>quando</b> usar.</li>
          <li>Texto de fora (RAG, web, e-mail, issue) cercado como dado, redigido e sem permissão de comandar.</li>
          <li>Escrita, rede e segredos: confinados, aprovados e fora do alcance do agente.</li>
          <li>Limite de passos, tempo e custo.</li>
          <li>Rastro de cada chamada de ferramenta.</li>
          <li>Testes que fingem um modelo comprometido, mais avaliações com o modelo real.</li>
          <li>Cada erro do agente vira uma linha de AGENTS.md, um lint, um teste ou um guardrail.</li>
        </ul>
        <Callout tone="personal" icon="alert"><b>Limites desta nota.</b> O campo muda por mês. Datas e números vêm das fontes citadas em cada seção, verificadas em 26/10/2026; vários são de posts de blog e preprints, e o texto original da OpenAI não abriu. O projeto foi testado só com o modelo falso; a execução com um modelo de verdade (Ollama) não foi testada por mim.</Callout>
      </Section>
    </>
  );
}
