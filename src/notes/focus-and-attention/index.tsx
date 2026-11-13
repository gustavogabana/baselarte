import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "focus-and-attention",
  title: { en: "Habits: focus, reading, exercise and study", pt: "Hábitos: foco, leitura, exercício e estudo" },
  seo: {
    title: { en: "Good habits: building focus, reading, exercise and study", pt: "Bons hábitos: construir foco, leitura, exercício e estudo" },
    description: { en: "A science-based guide to building good habits: how a habit forms, and an eight-week plan to widen your attention span and add daily reading, exercise and effective study, with expected results and a source for each step.", pt: "Um guia baseado em ciência para construir bons hábitos: como um hábito se forma, e um plano de oito semanas para ampliar a atenção e incluir leitura diária, exercício e estudo eficaz, com resultados esperados e uma fonte para cada passo." },
  },
  summary: "how a habit is formed (cue, action, reward; Lally, Gollwitzer and Sheeran, fresh start, temptation bundling) and an eight-week plan to build four good ones: a longer attention span, daily reading, aerobic exercise and study by retrieval and spacing, with expected results, a progress log in Python and a peer-reviewed source for each step; also what research says, and does not say, about \"brain rot\".",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Good habits, <em>building focus, reading, exercise and study.</em></>, pt: <>Bons hábitos, <em>construindo foco, leitura, exercício e estudo.</em></> },
  heroLede: { en: "How a habit is actually built, which four are worth the effort (a longer attention span, reading, exercise and studying), and an eight-week plan that starts tiny, with expected results and the sources behind each step.", pt: "Como um hábito é construído de verdade, quais quatro valem o esforço (atenção mais longa, leitura, exercício e estudo) e um plano de oito semanas que começa minúsculo, com resultados esperados e as fontes de cada passo." },
  published: "2026-10-21",
  updated: "2026-10-27",
  toc: [
    {
      items: [
        { id: "why", title: <T pt="Como um hábito se forma" en="How a habit is formed" /> },
        { id: "choose", title: <T pt="Quatro hábitos que valem o esforço" en="Four habits worth the effort" /> },
        { id: "plan", title: <T pt="O plano de oito semanas" en="The eight-week plan" /> },
        { id: "track", title: <T pt="Como medir o progresso" en="How to track progress" /> },
        { id: "expect", title: <T pt="O que esperar e ajustes" en="What to expect and adjustments" /> },
        { id: "rot", title: <T pt="E o “brainrot”?" en="And “brain rot”?" /> },
        { id: "cheat-foc", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="why" title={<T pt="Como um hábito se forma (e por que construir vence proibir)" en="How a habit is formed (and why building beats banning)" />}>
        <p><T pt={<>Tentar <em>parar</em> de fazer algo deixa um buraco: o gatilho continua lá, pedindo uma ação. Construir um bom hábito resolve isso do jeito certo, porque dá ao mesmo gatilho uma ação nova. O cérebro aprende por um ciclo de três passos: <strong>gatilho</strong> (um horário, um lugar, algo que você acabou de fazer), <strong>ação</strong> (o comportamento) e <strong>recompensa</strong> (algo bom logo depois). Repetido num contexto estável, o gatilho passa a puxar a ação quase sem decisão; é isso que a psicologia chama de hábito (Wood e Neal, 2007).</>} en={<>Trying to <em>stop</em> doing something leaves a hole: the cue is still there, asking for an action. Building a good habit fixes that the right way, because it gives the same cue a new action. The brain learns through a three-step loop: <strong>cue</strong> (a time, a place, something you just did), <strong>action</strong> (the behaviour) and <strong>reward</strong> (something good soon after). Repeated in a stable context, the cue starts pulling the action with almost no decision; that is what psychology calls a habit (Wood and Neal, 2007).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O ciclo gatilho, ação e recompensa aplicado a um hábito bom. Em vez de lutar contra um impulso, você escolhe o gatilho, encolhe a ação e garante uma recompensa imediata." en="The cue, action and reward loop applied to a good habit. Instead of fighting an urge, you choose the cue, shrink the action and secure an immediate reward." />}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Ciclo do hábito / Habit loop">
            <rect x="20" y="100" width="170" height="70" rx="4" className="ln" />
            <text x="105" y="128" className="pt" textAnchor="middle">Gatilho</text>
            <text x="105" y="128" className="en" textAnchor="middle">Cue</text>
            <text x="105" y="148" className="pt mut" textAnchor="middle">após o café · hora fixa</text>
            <text x="105" y="148" className="en mut" textAnchor="middle">after coffee · fixed time</text>
            <rect x="265" y="100" width="170" height="70" rx="4" className="ln" />
            <text x="350" y="128" className="pt" textAnchor="middle">Ação</text>
            <text x="350" y="128" className="en" textAnchor="middle">Action</text>
            <text x="350" y="148" className="pt mut" textAnchor="middle">uma versão minúscula</text>
            <text x="350" y="148" className="en mut" textAnchor="middle">a tiny version</text>
            <rect x="510" y="100" width="170" height="70" rx="4" className="ln" />
            <text x="595" y="128" className="pt" textAnchor="middle">Recompensa</text>
            <text x="595" y="128" className="en" textAnchor="middle">Reward</text>
            <text x="595" y="148" className="pt mut" textAnchor="middle">marcar o dia · algo bom</text>
            <text x="595" y="148" className="en mut" textAnchor="middle">tick the day · something nice</text>
            <path d="M190 135L265 135" className="ln" />
            <path d="M258.7 138.0L265 135L258.7 132.0" className="ln" />
            <path d="M435 135L510 135" className="ln" />
            <path d="M503.7 138.0L510 135L503.7 132.0" className="ln" />
            <path d="M595 170L595 225" className="ln" />
            <path d="M595 225L105 225" className="ln" />
            <path d="M105 225L105 170" className="ln dash" />
            <path d="M108.0 176.3L105 170L102.0 176.3" className="ln" />
            <text x="350" y="245" className="pt mut" textAnchor="middle">o cérebro aprende: da próxima vez, o gatilho já pede a ação</text>
            <text x="350" y="245" className="en mut" textAnchor="middle">the brain learns: next time, the cue already asks for the action</text>
            <rect x="20" y="20" width="170" height="50" rx="4" className="brandfill" />
            <text x="105" y="42" className="pt brandtext" textAnchor="middle">Projete aqui primeiro</text>
            <text x="105" y="42" className="en brandtext" textAnchor="middle">Design here first</text>
            <text x="105" y="59" className="pt mut" textAnchor="middle">visível, sempre no mesmo ponto</text>
            <text x="105" y="59" className="en mut" textAnchor="middle">visible, always the same spot</text>
            <rect x="265" y="20" width="170" height="50" rx="4" className="brandfill" />
            <text x="350" y="42" className="pt brandtext" textAnchor="middle">Depois aqui</text>
            <text x="350" y="42" className="en brandtext" textAnchor="middle">Then here</text>
            <text x="350" y="59" className="pt mut" textAnchor="middle">tão fácil que não dá para recusar</text>
            <text x="350" y="59" className="en mut" textAnchor="middle">so easy you cannot refuse</text>
            <path d="M105 70L105 100" className="ln" />
            <path d="M102.0 93.7L105 100L108.0 93.7" className="ln" />
            <path d="M350 70L350 100" className="ln" />
            <path d="M347.0 93.7L350 100L353.0 93.7" className="ln" />
          </svg>
        </Diagram>
        <p><T pt="Quatro resultados de pesquisa sustentam o desenho do plano:" en="Four research results shape the design of the plan:" /></p>
        <ul>
          <li><T pt={<><strong>Leva semanas, e falhar um dia não zera.</strong> No estudo de Lally e colegas (2010), 96 voluntários repetiram um comportamento diário por 12 semanas; o tempo para ficar automático variou de 18 a 254 dias, com mediana em torno de 66, e <strong>errar um dia não atrapalhou significativamente</strong> o processo.</>} en={<><strong>It takes weeks, and missing one day does not reset it.</strong> In the study by Lally and colleagues (2010), 96 volunteers repeated a daily behaviour for 12 weeks; the time to become automatic ranged from 18 to 254 days, with a median around 66, and <strong>missing a day did not materially affect</strong> the process.</>} /></li>
          <li><T pt={<><strong>Planos “se… então” funcionam.</strong> A meta-análise de Gollwitzer e Sheeran (2006), com mais de 90 estudos, encontrou que “intenções de implementação” (“Se [situação], então [ação]”) ajudam a alcançar metas, com efeito médio a grande (d = 0,65).</>} en={<><strong>“If… then” plans work.</strong> The meta-analysis by Gollwitzer and Sheeran (2006), covering more than 90 studies, found that “implementation intentions” (“If [situation], then [action]”) help people reach goals, with a medium-to-large effect (d = 0.65).</>} /></li>
          <li><T pt={<><strong>Marcos de “recomeço” ajudam a começar.</strong> Dai, Milkman e Riis (2014) mostraram que datas como segunda-feira, início de mês ou aniversário aumentam as buscas por academia e o registro de metas (o “efeito do novo começo”). Use essas datas para largar, não para esperar.</>} en={<><strong>“Fresh start” dates help you begin.</strong> Dai, Milkman and Riis (2014) showed that dates such as a Monday, a new month or a birthday increase gym visits and goal commitments (the “fresh start effect”). Use those dates to start, not to wait.</>} /></li>
          <li><T pt={<><strong>Junte o útil com o prazeroso.</strong> Num experimento com 226 pessoas, quem só podia ouvir audiolivros envolventes na academia foi mais vezes à academia (Milkman, Minson e Volpp, 2014); é a “vinculação de tentação”. Reserve seu podcast ou música favoritos para a caminhada ou para a leitura.</>} en={<><strong>Pair the useful with the enjoyable.</strong> In an experiment with 226 people, those who could listen to gripping audiobooks only at the gym went to the gym more often (Milkman, Minson and Volpp, 2014); this is “temptation bundling”. Save your favourite podcast or music for the walk or for reading.</>} /></li>
        </ul>
        <p><T pt="Daí saem as regras do plano: um gatilho fixo, uma versão tão pequena que dá vontade de rir, uma recompensa na hora, e crescimento aos poucos." en="From that come the plan’s rules: a fixed cue, a version so small it feels silly, a reward right away, and gradual growth." /></p>
      </Section>
      <Section id="choose" title={<T pt="Quatro hábitos que valem o esforço" en="Four habits worth the effort" />}>
        <p><T pt="Escolhi quatro porque cada um tem evidência razoável e eles se reforçam: o foco deixa os outros três mais rendosos, e o exercício e o sono sustentam o foco." en="I chose four because each has reasonable evidence and they reinforce each other: focus makes the other three more productive, and exercise and sleep sustain focus." /></p>
        <Table
          head={[<T pt="Hábito" en="Habit" />, <T pt="O que a pesquisa mostra" en="What the research shows" />, <T pt="Confiança" en="Confidence" />]}
          rows={[
            [<T pt="Ampliar a atenção (blocos de foco)" en="Widen attention (focus blocks)" />, <T pt={<>Interrupções cobram em estresse e esforço (Mark et al., 2008) e deixam “resíduo de atenção” (Leroy, 2009). Num ensaio randomizado com 467 pessoas, bloquear a internet móvel por duas semanas melhorou a atenção sustentada medida em teste (Castelo et al., 2025). Dois pontos de cautela: o treino de atenção plena de Mrazek et al. (2013) tinha amostra pequena, e <strong>não existe “detox” comprovado</strong> que reinicie a atenção em um dia.</>} en={<>Interruptions charge in stress and effort (Mark et al., 2008) and leave “attention residue” (Leroy, 2009). In a randomized trial with 467 people, blocking mobile internet for two weeks improved objectively measured sustained attention (Castelo et al., 2025). Two cautions: the mindfulness training in Mrazek et al. (2013) had a small sample, and <strong>there is no proven “detox”</strong> that resets attention in a day.</>} />, <T pt="Média" en="Medium" />],
            [<T pt="Ler todo dia" en="Read every day" />, <T pt={<>Uma meta-análise de Mol e Bus (2011) encontrou associação positiva entre exposição à leitura e linguagem, compreensão e ortografia, e Stanovich (1986) descreve o “efeito Mateus”: quem lê mais ganha vocabulário e lê ainda melhor. É em boa parte <strong>correlação</strong>, mas é plausível nos dois sentidos, e ler contínuo é o oposto, em formato, de consumir em fatias de segundos.</>} en={<>A meta-analysis by Mol and Bus (2011) found a positive association between print exposure and language, comprehension and spelling, and Stanovich (1986) describes the “Matthew effect”: those who read more gain vocabulary and read even better. It is largely <strong>correlational</strong>, but plausible in both directions, and continuous reading is the opposite, in format, of consuming in slices of seconds.</>} />, <T pt="Média (correlacional)" en="Medium (correlational)" />],
            [<T pt="Exercício aeróbico" en="Aerobic exercise" />, <T pt="Uma meta-análise (Chang et al., 2012) encontrou efeito pequeno, mas positivo, de uma sessão sobre o desempenho cognitivo, e a revisão de Hillman, Erickson e Kramer (2008) liga o exercício aeróbico à saúde do cérebro. Efeito imediato modesto; o ganho maior vem de humor, sono e constância." en="A meta-analysis (Chang et al., 2012) found a small but positive effect of a single session on cognitive performance, and the review by Hillman, Erickson and Kramer (2008) links aerobic exercise to brain health. The immediate effect is modest; the bigger gain comes from mood, sleep and consistency." />, <T pt="Média a alta" en="Medium to high" />],
            [<T pt="Estudar com método" en="Study with method" />, <T pt={<>A revisão de Dunlosky et al. (2013) avaliou dez técnicas de estudo e deu “alta utilidade” a só duas: <strong>prática de recuperação</strong> (testar-se) e <strong>estudo espaçado</strong> (pouco, em vários dias). Reler e grifar tiveram utilidade baixa. Roediger e Karpicke (2006) mostraram que se testar rende mais retenção a longo prazo do que reestudar.</>} en={<>The review by Dunlosky et al. (2013) assessed ten study techniques and gave “high utility” to only two: <strong>practice testing</strong> (testing yourself) and <strong>distributed practice</strong> (a little, over several days). Rereading and highlighting had low utility. Roediger and Karpicke (2006) showed that testing yourself yields more long-term retention than restudying.</>} />, <T pt="Alta" en="High" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Aviso:</strong> esta nota é educativa e não substitui avaliação profissional. Dificuldade de atenção que vem desde a infância, que piora muito, ou que vem com tristeza persistente, ansiedade ou insônia pode ter outras causas (TDAH, depressão, apneia do sono, entre elas). Se for o seu caso, procure um profissional de saúde; para exercício intenso, consulte um médico antes. O plano abaixo é suave, mas não é tratamento.</>} en={<><strong>Notice:</strong> this note is educational and does not replace professional assessment. Attention difficulty that began in childhood, that is getting much worse, or that comes with persistent sadness, anxiety or insomnia can have other causes (ADHD, depression, sleep apnoea, among them). If that is you, see a health professional; check with a doctor before intense exercise. The plan below is gentle, but it is not treatment.</>} /></Callout>
      </Section>
      <Section id="plan" title={<T pt="O plano de oito semanas" en="The eight-week plan" />}>
        <p><T pt={<>A lógica tem quatro regras, nesta ordem: <strong>1)</strong> comece minúsculo e ancore num gatilho fixo, <strong>2)</strong> facilite o hábito bom (deixe tudo pronto e à vista), <strong>3)</strong> aumente a carga aos poucos e <strong>4)</strong> proteja a base (sono). Só um hábito novo por vez nas primeiras semanas; quando o anterior estiver estável, empilhe o próximo no mesmo horário ou logo depois dele.</>} en={<>The logic has four rules, in this order: <strong>1)</strong> start tiny and anchor to a fixed cue, <strong>2)</strong> make the good habit easy (everything ready and in sight), <strong>3)</strong> raise the load gradually and <strong>4)</strong> protect the base (sleep). Only one new habit at a time in the first weeks; when the previous one is stable, stack the next at the same time or right after it.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A escada de treino: o bloco de foco cresce aos poucos, como um peso na academia. Os números são metas de treino, não promessas de resultado." en="The training ladder: the focus block grows gradually, like weight at the gym. The numbers are training targets, not promised results." />}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Metas semanais de foco / Weekly focus targets">
            <path d="M60 220L660 220" className="ln" />
            <rect x="90" y="166.0" width="90" height="54.0" rx="4" className="ln fillsoft" />
            <text x="135" y="156.0" className="mono" textAnchor="middle">15 min</text>
            <text x="135" y="242" className="pt mut" textAnchor="middle">Semana 1–2</text>
            <text x="135" y="242" className="en mut" textAnchor="middle">Week 1–2</text>
            <rect x="235" y="130.0" width="90" height="90.0" rx="4" className="ln fillsoft" />
            <text x="280" y="120.0" className="mono" textAnchor="middle">25 min</text>
            <text x="280" y="242" className="pt mut" textAnchor="middle">Semana 3–4</text>
            <text x="280" y="242" className="en mut" textAnchor="middle">Week 3–4</text>
            <rect x="380" y="76.0" width="90" height="144.0" rx="4" className="ln fillsoft" />
            <text x="425" y="66.0" className="mono" textAnchor="middle">40 min</text>
            <text x="425" y="242" className="pt mut" textAnchor="middle">Semana 5–6</text>
            <text x="425" y="242" className="en mut" textAnchor="middle">Week 5–6</text>
            <rect x="525" y="40.0" width="90" height="180.0" rx="4" className="brandfill" />
            <text x="570" y="30.0" className="mono" textAnchor="middle">50 min</text>
            <text x="570" y="242" className="pt mut" textAnchor="middle">Semana 7–8</text>
            <text x="570" y="242" className="en mut" textAnchor="middle">Week 7–8</text>
            <text x="60" y="30" className="pt mut" textAnchor="start">Meta do bloco de foco sem interrupção</text>
            <text x="60" y="30" className="en mut" textAnchor="start">Target for one uninterrupted focus block</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Semana" en="Week" />, <T pt="Foco da semana" en="Focus of the week" />, <T pt="Atividades" en="Activities" />]}
          rows={[
            ["0", <T pt="Linha de base e escolha dos gatilhos" en="Baseline and choosing cues" />, "0"],
            ["1–2", <T pt="Ambiente fácil + o bloco de foco minúsculo" en="An easy environment + the tiny focus block" />, "1, 2"],
            ["3–4", <T pt="Empilhar a leitura diária" en="Stack daily reading" />, "3"],
            ["5–6", <T pt="Empilhar o estudo com recuperação e espaçamento" en="Stack study with retrieval and spacing" />, "4"],
            ["7–8", <T pt="Empilhar o exercício e proteger o sono; consolidar" en="Stack exercise and protect sleep; consolidate" />, "5, 6"],
          ]}
        />
        <p><T pt={<>Cada atividade segue o mesmo formato: <strong>o que fazer</strong>, <strong>por quê</strong> (com a fonte) e <strong>resultado esperado</strong>. Os resultados esperados são <em>metas realistas e tendências</em>, não garantias: pessoas diferentes respondem de formas diferentes.</>} en={<>Each activity follows the same format: <strong>what to do</strong>, <strong>why</strong> (with the source) and <strong>expected result</strong>. The expected results are <em>realistic targets and trends</em>, not guarantees: different people respond differently.</>} /></p>
        <h3><T pt="Atividade 0: linha de base e gatilhos (3 dias)" en="Activity 0: baseline and cues (3 days)" /></h3>
        <p><T pt={<><strong>O que fazer:</strong> durante 3 dias comuns, sem mudar nada, anote: (a) quando você já tem um respiro natural no dia (depois do café, ao chegar em casa, antes de dormir): esses serão seus gatilhos; (b) uma vez por dia, faça um bloco de 30 minutos numa tarefa que exige concentração e anote o maior tempo seguido que ficou nela; (c) quanto tempo você já lê, se exercita e estuda. Crie o arquivo <code>habits.csv</code> (exemplo na seção 4). Escolha a data de início num “novo começo” (próxima segunda ou início de mês), como em Dai et al. (2014).</>} en={<><strong>What to do:</strong> for 3 ordinary days, changing nothing, record: (a) when you already have a natural pause in the day (after coffee, arriving home, before bed): these will be your cues; (b) once a day, do a 30-minute block on a task that needs concentration and note the longest stretch you stayed on it; (c) how long you already read, exercise and study. Create the <code>habits.csv</code> file (example in section 4). Pick the start date at a “fresh start” (next Monday or the start of a month), as in Dai et al. (2014).</>} /></p>
        <p><T pt={<><strong>Por quê:</strong> sem número inicial você não sabe se melhorou, e a sensação engana; e um hábito precisa de um gatilho que já existe. <strong>Resultado esperado:</strong> um ponto de partida honesto (blocos de 8 a 15 minutos são comuns) e três gatilhos definidos. O objetivo não é se julgar.</>} en={<><strong>Why:</strong> without a starting number you cannot know if you improved, and feelings mislead; and a habit needs a cue that already exists. <strong>Expected result:</strong> an honest starting point (blocks of 8 to 15 minutes are common) and three defined cues. The goal is not to judge yourself.</>} /></p>
        <h3><T pt="Semanas 1 e 2: facilitar e começar minúsculo" en="Weeks 1 and 2: make it easy and start tiny" /></h3>
        <p><T pt={<><strong>Atividade 1: prepare o terreno para o hábito bom.</strong> Deixe à vista e pronto o que o hábito pede: o livro sobre a mesa de cabeceira, o caderno de estudo aberto na mesa, o tênis perto da porta. Para os blocos de foco, ponha o celular em outro cômodo (ou numa gaveta, som desligado) e deixe só notificações de pessoas. <em>Por quê:</em> menos esforço na hora significa mais repetições, e repetições formam o hábito (Lally et al., 2010); tirar interrupções poupa o custo de trocar de contexto (Mark et al., 2008). O efeito de “só a presença” do celular na mesa é debatido (Ward et al., 2017, com réplicas que falharam), então conte com a ausência de interrupção, não com mágica. <em>Resultado esperado:</em> nos primeiros dias, uma vontade de checar que cai ao longo de alguns blocos.</>} en={<><strong>Activity 1: set the stage for the good habit.</strong> Leave in sight and ready whatever the habit asks for: the book on the bedside table, the study notebook open on the desk, the trainers near the door. For focus blocks, put the phone in another room (or a drawer, sound off) and keep only notifications from people. <em>Why:</em> less effort in the moment means more repetitions, and repetitions form the habit (Lally et al., 2010); removing interruptions saves the cost of context switching (Mark et al., 2008). The “mere presence” effect of the phone on the desk is debated (Ward et al., 2017, with failed replications), so count on the absence of interruption, not on magic. <em>Expected result:</em> in the first days, an urge to check that fades over a few blocks.</>} /></p>
        <p><T pt={<><strong>Atividade 2: o bloco de foco minúsculo e a escada.</strong> Escreva três frases “Se… então…”, por exemplo: “Se eu terminar o café, então abro o caderno e trabalho 15 minutos numa só tarefa”; “Se a vontade de pegar o celular vier, então respiro fundo três vezes e anoto a vontade numa lista de estacionamento”. Use um cronômetro, uma tarefa só, descanse 5 minutos longe de telas. Suba o bloco a cada duas semanas, seguindo a figura 2. Ao terminar, marque o dia no calendário (a recompensa). <em>Por quê:</em> planos “se… então” têm efeito médio a grande (Gollwitzer e Sheeran, 2006), e anotar o pensamento intruso impede que ele vire uma troca de tarefa (Leroy, 2009). Como complemento, 10 minutos de contagem de respirações (contar cada expiração de 1 a 10 e recomeçar) treina notar e voltar; no estudo de Mrazek et al. (2013) duas semanas de atenção plena reduziram a divagação, mas a amostra era pequena, então é indício. <em>Resultado esperado:</em> falhar nos últimos minutos no início é normal; ao fim da semana 2, blocos de 15 minutos sem interrupção na maior parte dos dias.</>} en={<><strong>Activity 2: the tiny focus block and the ladder.</strong> Write three “If… then…” sentences, for example: “If I finish my coffee, then I open the notebook and work 15 minutes on one task”; “If the urge to grab the phone comes, then I take three deep breaths and write the urge on a parking-lot list”. Use a timer, one task only, rest 5 minutes away from screens. Raise the block every two weeks, following figure 2. When done, tick the day on a calendar (the reward). <em>Why:</em> “if… then” plans have a medium-to-large effect (Gollwitzer and Sheeran, 2006), and writing the intruding thought keeps it from becoming a task switch (Leroy, 2009). As a complement, 10 minutes of breath counting (count each exhale from 1 to 10 and restart) trains noticing and returning; in Mrazek et al. (2013) two weeks of mindfulness reduced mind wandering, but the sample was small, so take it as a hint. <em>Expected result:</em> failing in the last minutes at first is normal; by the end of week 2, 15-minute blocks without interruption on most days.</>} /></p>
        <h3><T pt="Semanas 3 e 4: empilhe a leitura" en="Weeks 3 and 4: stack reading" /></h3>
        <p><T pt={<><strong>Atividade 3: leitura diária contínua.</strong> Logo depois do bloco de foco (ou antes de dormir), leia 10 minutos de papel ou de um leitor sem notificações, subindo para 20 e depois 30. Escolha algo que você <em>goste</em> (o hábito precisa de recompensa), sem celular e sem abas. Se quiser, junte com uma bebida de que gosta (vinculação de tentação, Milkman et al., 2014). <em>Por quê:</em> a leitura contínua treina a atenção sustentada e acumula vocabulário (Mol e Bus, 2011; Stanovich, 1986). <em>Resultado esperado:</em> nos primeiros dias a mente escapa e você relê parágrafos; depois de uma ou duas semanas, a leitura “flui” por mais tempo. Se o livro estiver difícil demais, troque por um mais leve, mas contínuo.</>} en={<><strong>Activity 3: continuous daily reading.</strong> Right after the focus block (or before bed), read 10 minutes from paper or a reader without notifications, rising to 20 and then 30. Pick something you <em>like</em> (the habit needs a reward), with no phone and no tabs. If you want, pair it with a drink you enjoy (temptation bundling, Milkman et al., 2014). <em>Why:</em> continuous reading trains sustained attention and accumulates vocabulary (Mol and Bus, 2011; Stanovich, 1986). <em>Expected result:</em> in the first days the mind drifts and you reread paragraphs; after a week or two, reading “flows” for longer. If the book is too hard, swap for a lighter but continuous one.</>} /></p>
        <h3><T pt="Semanas 5 e 6: empilhe o estudo" en="Weeks 5 and 6: stack study" /></h3>
        <p><T pt={<><strong>Atividade 4: estudar com recuperação e espaçamento.</strong> Escolha uma matéria (um curso, um idioma, um livro técnico). Depois de estudar 10 a 20 minutos, <em>feche o material</em> e escreva de memória o que lembra, ou responda perguntas que você mesmo fez; confira só depois. Volte ao tema em 1 dia, 3 dias e 1 semana, em vez de reler tudo numa tarde. <em>Por quê:</em> prática de recuperação e estudo espaçado são as duas técnicas de “alta utilidade” da revisão de Dunlosky et al. (2013); em Roediger e Karpicke (2006), quem se testou lembrou mais depois de uma semana do que quem releu. <em>Resultado esperado:</em> parece mais difícil e menos “confortável” do que reler (é o sinal de que está funcionando) e, em duas ou três semanas, você lembra mais com menos tempo de estudo.</>} en={<><strong>Activity 4: study with retrieval and spacing.</strong> Pick one subject (a course, a language, a technical book). After studying 10 to 20 minutes, <em>close the material</em> and write from memory what you recall, or answer questions you wrote yourself; check only afterwards. Return to the topic after 1 day, 3 days and 1 week, instead of rereading everything in one afternoon. <em>Why:</em> practice testing and distributed practice are the two “high utility” techniques in the review by Dunlosky et al. (2013); in Roediger and Karpicke (2006), those who tested themselves remembered more after a week than those who reread. <em>Expected result:</em> it feels harder and less “comfortable” than rereading (the sign it is working) and, in two or three weeks, you remember more with less study time.</>} /></p>
        <h3><T pt="Semanas 7 e 8: empilhe o exercício e proteja o sono" en="Weeks 7 and 8: stack exercise and protect sleep" /></h3>
        <p><T pt={<><strong>Atividade 5: exercício aeróbico.</strong> Comece com uma caminhada de 10 minutos logo após o gatilho escolhido, e suba até 20 a 30 minutos de exercício aeróbico (caminhada rápida, bicicleta, corrida leve) na maior parte dos dias. Reserve seu podcast ou música favoritos para esse momento (Milkman et al., 2014). Uma vez por semana, faça a caminhada em área verde, com o celular guardado: num experimento clássico, andar num ambiente natural melhorou a memória de trabalho mais do que andar numa rua movimentada (Berman, Jonides e Kaplan, 2008), com efeito modesto e curto. <em>Por quê:</em> Chang et al. (2012) e Hillman et al. (2008). <em>Resultado esperado:</em> um ganho modesto de disposição e clareza logo depois, e melhora de humor e sono ao longo das semanas.</>} en={<><strong>Activity 5: aerobic exercise.</strong> Start with a 10-minute walk right after the chosen cue, and build up to 20 to 30 minutes of aerobic exercise (brisk walking, cycling, easy running) on most days. Save your favourite podcast or music for this moment (Milkman et al., 2014). Once a week, do the walk in a green area with the phone stowed: in a classic experiment, walking in a natural setting improved working memory more than walking on a busy street (Berman, Jonides and Kaplan, 2008), with a modest and short-lived effect. <em>Why:</em> Chang et al. (2012) and Hillman et al. (2008). <em>Expected result:</em> a modest gain in alertness and clarity right after, and better mood and sleep over the weeks.</>} /></p>
        <p><T pt={<><strong>Atividade 6: sono como base.</strong> Janela fixa de 7 a 9 horas, celular carregando fora do quarto (ou longe da cama). <em>Por quê:</em> uma meta-análise (Lim e Dinges, 2010) mostrou que a falta de sono por poucos dias prejudica a atenção simples e aumenta os “lapsos”; sem sono, os outros quatro hábitos rendem menos. <em>Resultado esperado:</em> menos lapsos e menos esforço para manter o foco.</>} en={<><strong>Activity 6: sleep as the base.</strong> A fixed 7 to 9 hour window, the phone charging outside the bedroom (or away from the bed). <em>Why:</em> a meta-analysis (Lim and Dinges, 2010) showed that short-term sleep loss impairs simple attention and increases “lapses”; without sleep the other four habits pay off less. <em>Expected result:</em> fewer lapses and less effort to hold focus.</>} /></p>
      </Section>
      <Section id="track" title={<T pt="Como medir o progresso" en="How to track progress" />}>
        <p><T pt={<>Todo dia, ao fim do dia, anote uma linha: a data, o maior bloco de foco sem interrupção e os minutos de leitura, exercício e estudo. Um arquivo CSV serve (zero é um valor válido, e anotar um dia ruim é parte do método). Exemplo de <code>habits.csv</code> com três semanas de dados:</>} en={<>Every day, at the end of the day, write one line: the date, the longest uninterrupted focus block and the minutes of reading, exercise and study. A CSV file will do (zero is a valid value, and logging a bad day is part of the method). Example <code>habits.csv</code> with three weeks of data:</>} /></p>
        <p><code>habits.csv</code></p>
        <CodeBlock code={`date,focus_block_min,reading_min,exercise_min,study_min
2026-11-02,10,5,0,0
2026-11-03,12,10,15,10
2026-11-04,10,10,0,10
2026-11-09,20,15,20,15
2026-11-10,25,20,20,15
2026-11-11,22,20,0,20
2026-11-16,35,25,25,20
2026-11-17,40,30,25,25
2026-11-18,38,30,30,25`} />
        <p><T pt="E um programa curto, em Python padrão, que resume por semana:" en="And a short standard-Python program that summarises by week:" /></p>
        <p><code>summary.py</code></p>
        <CodeBlock code={`import csv, sys
from collections import defaultdict
from datetime import date

COLUMNS = ["focus_block_min", "reading_min", "exercise_min", "study_min"]
weeks = defaultdict(lambda: defaultdict(list))
with open(sys.argv[1] if len(sys.argv) > 1 else "habits.csv") as f:
    for row in csv.DictReader(f):
        year, week, _ = date.fromisoformat(row["date"]).isocalendar()
        for column in COLUMNS:
            weeks[(year, week)][column].append(int(row[column]))

print("week      focus  reading  exercise  study   (average minutes per day logged)")
for (year, week), d in sorted(weeks.items()):
    averages = [sum(d[c]) / len(d[c]) for c in COLUMNS]
    print(f"{year}-W{week:02d}  " + "  ".join(f"{a:>7.1f}" for a in averages))`} />
        <CodeBlock code={`python3 summary.py habits.csv`} />
        <p><T pt={<><strong>Resultado esperado:</strong> uma tabela por semana ISO, como a abaixo (com os dados do exemplo). Se as suas linhas mostrarem as médias subindo, o plano está funcionando; se estiverem paradas, volte ao degrau anterior e reforce o gatilho e a preparação (Atividade 1) antes de aumentar a dificuldade.</>} en={<><strong>Expected result:</strong> a table per ISO week, like the one below (with the sample data). If your lines show the averages rising, the plan is working; if they are flat, go back one step and strengthen the cue and the preparation (Activity 1) before raising the difficulty.</>} /></p>
        <CodeBlock code={`week      focus  reading  exercise  study   (average minutes per day logged)
2026-W45     10.7      8.3      5.0      6.7
2026-W46     22.3     18.3     13.3     16.7
2026-W47     37.7     28.3     26.7     23.3`} />
        <p><T pt="Uma vez por semana (10 minutos, num domingo), faça a revisão: o que funcionou? Qual gatilho falhou? Qual ajuste faço na semana que vem?" en="Once a week (10 minutes, on a Sunday), do the review: what worked? Which cue failed? What adjustment will I make next week?" /></p>
      </Section>
      <Section id="expect" title={<T pt="O que esperar, recaídas e ajustes" en="What to expect, relapses and adjustments" />}>
        <Table
          head={[<T pt="Quando" en="When" />, <T pt="O que costuma acontecer" en="What usually happens" />]}
          rows={[
            [<T pt="Dias 1 a 7" en="Days 1 to 7" />, <T pt="O hábito exige decisão a cada vez e parece bobo de tão pequeno. Está certo assim: o objetivo é repetir, não render." en="The habit takes a decision each time and feels silly for being so small. That is right: the goal is to repeat, not to perform." />],
            [<T pt="Semanas 2 a 4" en="Weeks 2 to 4" />, <T pt="Os primeiros blocos que terminam sem interrupção; a leitura começa a fluir. Em estudos de bloqueio de celular, efeitos na atenção aparecem em cerca de duas semanas." en="The first blocks that end without interruption; reading starts to flow. In phone-blocking studies, effects on attention show up in about two weeks." />],
            [<T pt="Semanas 5 a 8" en="Weeks 5 to 8" />, <T pt="Quatro hábitos empilhados, cada um já com gatilho próprio. Ainda exigem atenção ao ambiente." en="Four stacked habits, each with its own cue. They still need attention to the environment." />],
            [<T pt="Meses 2 a 4" en="Months 2 to 4" />, <T pt="Os comportamentos ficam automáticos, em média por volta de 66 dias, mas com grande variação (18 a 254; Lally et al., 2010). Mantenha o gatilho e o registro até lá." en="The behaviours become automatic, on average around 66 days, but with wide variation (18 to 254; Lally et al., 2010). Keep the cue and the log until then." />],
          ]}
        />
        <h3><T pt="Ajustes comuns" en="Common adjustments" /></h3>
        <Table
          head={[<T pt="Problema" en="Problem" />, <T pt="Ajuste" en="Adjustment" />]}
          rows={[
            [<T pt="Falhei três dias seguidos" en="I failed three days in a row" />, <T pt="Não zere. O estudo de Lally et al. (2010) mostra que falhar uma ocasião não atrapalhou o processo. Volte ao degrau anterior, use um novo “recomeço” (próxima segunda) e continue." en="Do not reset. The study by Lally et al. (2010) shows that missing one occasion did not materially affect the process. Go back one step, use a new “fresh start” (next Monday) and continue." />],
            [<T pt="Esqueço de fazer" en="I forget to do it" />, <T pt="O gatilho está fraco. Troque por algo que acontece todo dia sem falta (escovar os dentes, o primeiro café) e deixe o material à vista." en="The cue is weak. Swap for something that happens every day without fail (brushing teeth, the first coffee) and leave the material in sight." />],
            [<T pt="Fico sem vontade" en="I lose motivation" />, <T pt="Encolha a ação até ficar ridícula (2 minutos) e faça só isso; junte com algo de que você gosta (Milkman et al., 2014). Continuar o gatilho importa mais que a duração." en="Shrink the action until it is ridiculous (2 minutes) and do only that; pair it with something you enjoy (Milkman et al., 2014). Keeping the cue matters more than the duration." />],
            [<T pt="A mente não para de divagar na leitura" en="My mind keeps drifting while reading" />, <T pt="Reduza o bloco (10 minutos), escolha um texto que você goste, e use a lista de estacionamento. Divagar e voltar é o treino." en="Shorten the block (10 minutes), pick a text you like, and use the parking list. Drifting and returning is the training." />],
            [<T pt="Não vejo melhora depois de 8 semanas" en="No improvement after 8 weeks" />, <T pt="Cheque o sono e o humor primeiro; considere conversar com um profissional de saúde (veja o aviso no início)." en="Check sleep and mood first; consider talking to a health professional (see the notice at the start)." />],
          ]}
        />
        <Callout icon="check"><T pt="Atenção não é um interruptor, é um músculo que também depende de sono, humor e ambiente. O que a pesquisa sustenta são mudanças concretas de rotina, pequenas e mantidas por semanas, não soluções de um dia." en="Attention is not a switch, it is a muscle that also depends on sleep, mood and environment. What the research supports are concrete changes of routine, small and kept up for weeks, not one-day fixes." /></Callout>
      </Section>
      <Section id="rot" title={<T pt="E o “brainrot”? O que a ciência diz, sem exagero" en="And “brain rot”? What science says, without exaggeration" />}>
        <p><T pt={<>“Brain rot” foi a palavra do ano de 2024 do dicionário Oxford, definida como a suposta deterioração do estado mental de uma pessoa por consumir demais conteúdo trivial, hoje sobretudo online. Repare no “suposta”: <strong>não é um diagnóstico médico</strong>, e o cérebro não “apodrece”. Esta nota foca no que construir, mas vale saber o que se sabe sobre o que você tira do lugar:</>} en={<>“Brain rot” was Oxford’s 2024 Word of the Year, defined as the supposed deterioration of a person’s mental state from overconsuming trivial content, now mostly online. Note the word “supposed”: <strong>it is not a medical diagnosis</strong>, and the brain does not “rot”. This note focuses on what to build, but it is worth knowing what is known about what you displace:</>} /></p>
        <Table
          head={[<T pt="Afirmação" en="Claim" />, <T pt="O que a pesquisa mostra" en="What the research shows" />, <T pt="Confiança" en="Confidence" />]}
          rows={[
            [<T pt="Vídeo curto e cognição andam juntos" en="Short video and cognition go together" />, <T pt={<>Uma meta-análise de 71 estudos (Nguyen et al., 2025) encontrou associação negativa moderada entre o uso de vídeos curtos e a cognição, com a atenção entre as áreas mais afetadas. É <strong>correlação</strong>: não prova que o vídeo causa o problema; quem já tem dificuldade de atenção pode também usar mais.</>} en={<>A meta-analysis of 71 studies (Nguyen et al., 2025) found a moderate negative association between short-form video use and cognition, with attention among the most affected areas. It is a <strong>correlation</strong>: it does not prove the video causes the problem; people who already struggle with attention may also use it more.</>} />, <T pt="Média (correlacional)" en="Medium (correlational)" />],
            [<T pt="Multitarefa pesada e atenção" en="Heavy multitasking and attention" />, <T pt="Quem faz muita multitarefa com mídia tende a ir pior em testes de controle da atenção (Ophir, Nass e Wagner, 2009; revisão em Uncapher e Wagner, 2018), mas causa e efeito não estão claros." en="Heavy media multitaskers tend to do worse on attention-control tests (Ophir, Nass and Wagner, 2009; review in Uncapher and Wagner, 2018), but cause and effect are unclear." />, <T pt="Média" en="Medium" />],
            [<T pt="Reduzir o uso melhora a atenção" en="Cutting use improves attention" />, <T pt={<>O ensaio de Castelo et al. (2025) mostrou ganho de atenção sustentada, saúde mental e bem-estar após duas semanas sem internet móvel no celular, e parte do ganho veio de passar mais tempo com pessoas, em movimento e ao ar livre: ou seja, de <em>trocar</em> por hábitos bons.</>} en={<>The trial by Castelo et al. (2025) showed gains in sustained attention, mental health and well-being after two weeks without mobile internet on the phone, and part of the gain came from more time with people, moving and outdoors: that is, from <em>swapping in</em> good habits.</>} />, <T pt="Média a alta (curto prazo)" en="Medium to high (short term)" />],
          ]}
        />
        <p><T pt="Leitura prática: o que mais funciona é o par “tirar o gatilho do mau hábito” e “pôr um hábito bom no lugar”, que é o que o plano acima faz. Quem só tira, deixa a lacuna para o celular." en="Practical reading: what works best is the pair “remove the cue of the bad habit” and “put a good habit in its place”, which is what the plan above does. Whoever only removes leaves the gap for the phone." /></p>
      </Section>
      <Section id="cheat-foc" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Hábito" en="Habit" />, <T pt="Regra curta" en="Short rule" />]}
          rows={[
            [<T pt="Formar" en="Forming" />, <T pt="Gatilho fixo, ação minúscula, recompensa na hora; um hábito novo por vez" en="Fixed cue, tiny action, instant reward; one new habit at a time" />],
            [<T pt="Foco" en="Focus" />, <T pt="Uma tarefa, cronômetro, 15 → 50 min, lista de estacionamento, celular fora" en="One task, timer, 15 → 50 min, parking list, phone away" />],
            [<T pt="Impulso" en="Urge" />, <T pt="“Se… então…”: resposta pronta" en="“If… then…”: a ready answer" />],
            [<T pt="Leitura" en="Reading" />, <T pt="10 → 30 min por dia, algo de que você gosta, sem telas" en="10 → 30 min a day, something you like, no screens" />],
            [<T pt="Estudo" en="Study" />, <T pt="Fechar o material e lembrar; rever em 1 dia, 3 dias, 1 semana" en="Close the material and recall; review at 1 day, 3 days, 1 week" />],
            [<T pt="Exercício" en="Exercise" />, <T pt="10 → 30 min aeróbicos na maior parte dos dias; natureza sem celular 1 vez por semana" en="10 → 30 min aerobic on most days; nature without the phone once a week" />],
            [<T pt="Base" en="Foundations" />, <T pt="7–9 h de sono, celular fora do quarto" en="7–9 h of sleep, phone outside the bedroom" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Por que construir um hábito bom funciona melhor do que apenas tentar parar de fazer um mau?" en="Why does building a good habit work better than just trying to stop a bad one?" /></li>
          <li><T pt="Descreva o ciclo gatilho, ação e recompensa e dê um exemplo de como projetar cada ponto." en="Describe the cue, action and reward loop and give an example of how to design each point." /></li>
          <li><T pt="O que Lally et al. (2010) mostram sobre o tempo para formar um hábito e sobre falhar um dia?" en="What do Lally et al. (2010) show about the time to form a habit and about missing a day?" /></li>
          <li><T pt="Quais são as duas técnicas de estudo de “alta utilidade” e por que reler não está entre elas?" en="Which are the two “high utility” study techniques and why is rereading not among them?" /></li>
          <li><T pt="Por que “brainrot” não é um diagnóstico? O que a meta-análise de 2025 mostra, e o que ela não consegue provar?" en="Why is “brain rot” not a diagnosis? What does the 2025 meta-analysis show, and what can it not prove?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://doi.org/10.1037/0033-295x.114.4.843" rel="noopener">Wood and Neal (2007): A new look at habits and the habit-goal interface. Psychological Review 114(4)</a></li>
          <li><a href="https://doi.org/10.1002/ejsp.674" rel="noopener">Lally, van Jaarsveld, Potts and Wardle (2010): How are habits formed: modelling habit formation in the real world. European Journal of Social Psychology 40(6)</a></li>
          <li><a href="https://doi.org/10.1016/S0065-2601(06)38002-1" rel="noopener">Gollwitzer and Sheeran (2006): Implementation intentions and goal achievement: a meta-analysis of effects and processes. Advances in Experimental Social Psychology 38</a></li>
          <li><a href="https://doi.org/10.1287/mnsc.2014.1901" rel="noopener">Dai, Milkman and Riis (2014): The fresh start effect: temporal landmarks motivate aspirational behavior. Management Science 60(10)</a></li>
          <li><a href="https://doi.org/10.1287/mnsc.2013.1784" rel="noopener">Milkman, Minson and Volpp (2014): Holding the Hunger Games hostage at the gym: an evaluation of temptation bundling. Management Science 60(2)</a></li>
          <li><a href="https://doi.org/10.1177/1529100612453266" rel="noopener">Dunlosky, Rawson, Marsh, Nathan and Willingham (2013): Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest 14(1)</a></li>
          <li><a href="https://doi.org/10.1111/j.1467-9280.2006.01693.x" rel="noopener">Roediger and Karpicke (2006): Test-enhanced learning. Psychological Science 17(3)</a></li>
          <li><a href="https://doi.org/10.1037/a0021890" rel="noopener">Mol and Bus (2011): To read or not to read: a meta-analysis of print exposure from infancy to early adulthood. Psychological Bulletin 137(2)</a></li>
          <li><a href="https://doi.org/10.1598/rrq.21.4.1" rel="noopener">Stanovich (1986): Matthew effects in reading. Reading Research Quarterly 21(4)</a></li>
          <li><a href="https://doi.org/10.1016/j.brainres.2012.02.068" rel="noopener">Chang, Labban, Gapin and Etnier (2012): The effects of acute exercise on cognitive performance: a meta-analysis. Brain Research 1453</a> · <a href="https://doi.org/10.1038/nrn2298" rel="noopener">Hillman, Erickson and Kramer (2008): Be smart, exercise your heart. Nature Reviews Neuroscience 9</a></li>
          <li><a href="https://doi.org/10.1111/j.1467-9280.2008.02225.x" rel="noopener">Berman, Jonides and Kaplan (2008): The cognitive benefits of interacting with nature. Psychological Science 19(12)</a></li>
          <li><a href="https://doi.org/10.1037/a0018883" rel="noopener">Lim and Dinges (2010): A meta-analysis of the impact of short-term sleep deprivation on cognitive variables. Psychological Bulletin 136(3)</a></li>
          <li><a href="https://doi.org/10.1145/1357054.1357072" rel="noopener">Mark, Gudith and Klocke (2008): The cost of interrupted work: more speed and stress. CHI 2008</a></li>
          <li><a href="https://doi.org/10.1016/j.obhdp.2009.04.002" rel="noopener">Leroy (2009): Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes 109</a></li>
          <li><a href="https://doi.org/10.1177/0956797612459659" rel="noopener">Mrazek, Franklin, Phillips, Baird and Schooler (2013): Mindfulness training improves working memory capacity and GRE performance while reducing mind wandering. Psychological Science 24(5)</a></li>
          <li><a href="https://academic.oup.com/pnasnexus/article/4/2/pgaf017/8016017" rel="noopener">Castelo, Kushlev, Ward, Esterman and Reiner (2025): Blocking mobile internet on smartphones improves sustained attention, mental health, and subjective well-being. PNAS Nexus 4(2)</a></li>
          <li><a href="https://doi.org/10.1086/691462" rel="noopener">Ward et al. (2017): Brain Drain: the mere presence of one’s own smartphone reduces available cognitive capacity. JACR 2(2)</a> · <a href="https://www.bps.org.uk/research-digest/revisiting-brain-drain-effect" rel="noopener">BPS Research Digest: revisiting the “brain drain” effect (replications)</a></li>
          <li><a href="https://corp.oup.com/news/brain-rot-named-oxford-word-of-the-year-2024/" rel="noopener">Oxford University Press: ‘Brain rot’ named Oxford Word of the Year 2024</a></li>
          <li><a href="https://doi.org/10.1037/bul0000498" rel="noopener">Nguyen et al. (2025): Feeds, Feelings, and Focus: a systematic review and meta-analysis of the cognitive and mental health correlates of short-form video use. Psychological Bulletin 151(9)</a></li>
          <li><a href="https://doi.org/10.1073/pnas.0903620106" rel="noopener">Ophir, Nass and Wagner (2009): Cognitive control in media multitaskers. PNAS 106</a> · <a href="https://doi.org/10.1073/pnas.1611612115" rel="noopener">Uncapher and Wagner (2018): Minds and brains of media multitaskers. PNAS 115</a></li>
        </ul>
      </Sources>
    </>
  );
}
