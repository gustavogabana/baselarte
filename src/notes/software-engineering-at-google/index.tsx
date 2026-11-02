import { Callout, CodeBlock, Diagram, Section, T } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "software-engineering-at-google",
  title: { en: "Software Engineering at Google", pt: "Software Engineering at Google" },
  seo: {
    title: { en: "Software Engineering at Google, book notes", pt: "Software Engineering at Google, notas do livro" },
    description: { en: "A friendly walkthrough of the book Software Engineering at Google: time, scale and trade-offs, Hyrum’s Law, testing, code review and continuous delivery, with simple examples and diagrams.", pt: "Um passeio didático pelo livro Software Engineering at Google: tempo, escala e trade-offs, Lei de Hyrum, testes, code review e entrega contínua, com exemplos simples e diagramas." },
  },
  summary: "book notes on time, scale and trade-offs, Hyrum's Law, testing, code review and continuous delivery.",
  kicker: { en: "Book notes", pt: "Notas de livro" },
  heroTitle: { en: <>Software engineering is <em>programming over time.</em></>, pt: <>Engenharia de software é <em>programação ao longo do tempo.</em></> },
  heroLede: { en: "A friendly walkthrough of Software Engineering at Google: what changes when code has to live for decades and teams have to grow.", pt: "Um passeio didático por Software Engineering at Google: o que muda quando o código precisa viver por décadas e as equipes precisam crescer." },
  published: "2026-10-16",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "idea", title: <T pt="A ideia central" en="The core idea" /> },
        { id: "hyrum", title: <T pt="Lei de Hyrum" en="Hyrum’s Law" /> },
        { id: "scale", title: <T pt="Escala: políticas que funcionam quando a empresa cresce" en="Scale: policies that work as the company grows" /> },
        { id: "shift", title: <T pt="Trade-offs, custos e “shift left”" en="Trade-offs, costs and “shift left”" /> },
        { id: "teams", title: <T pt="Equipes e cultura" en="Teams and culture" /> },
        { id: "review", title: <T pt="Code review" en="Code review" /> },
        { id: "tests", title: <T pt="Testes" en="Testing" /> },
        { id: "tools", title: <T pt="Ferramentas e entrega" en="Tools and delivery" /> },
        { id: "apply", title: <T pt="Como aplicar no seu projeto" en="Applying it to your project" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="idea" title={<T pt="A ideia central" en="The core idea" />}>
        <p><T pt={<>O livro <em>Software Engineering at Google</em> (Titus Winters, Tom Manshreck e Hyrum Wright, O’Reilly, 2020) conta como o Google mantém uma base de código enorme viva por décadas. A frase que resume o livro inteiro é: <em>engenharia de software é programação integrada ao longo do tempo</em>.</>} en={<>The book <em>Software Engineering at Google</em> (Titus Winters, Tom Manshreck and Hyrum Wright, O’Reilly, 2020) tells how Google keeps a huge codebase alive for decades. The sentence that sums up the whole book is: <em>software engineering is programming integrated over time</em>.</>} /></p>
        <p><T pt="Programar é produzir código que funciona hoje. Fazer engenharia é produzir código que continue funcionando, e que ainda possa ser mudado com segurança, enquanto ele viver. O livro aponta três diferenças:" en="Programming is producing code that works today. Engineering is producing code that keeps working, and can still be changed safely, for as long as it lives. The book points to three differences:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Tempo.</em> Quanto tempo o código vai viver? A resposta razoável pode variar por um fator de 100.000, de minutos a décadas.</>} en={<><em>Time.</em> How long will the code live? A reasonable answer can vary by a factor of 100,000, from minutes to decades.</>} /></li>
          <li><T pt={<><em>Escala.</em> Tudo o que a organização faz várias vezes (revisar, testar, atualizar) precisa continuar viável quando ela crescer 10 ou 100 vezes.</>} en={<><em>Scale.</em> Everything the organization does repeatedly (review, test, upgrade) must stay viable when it grows 10 or 100 times.</>} /></li>
          <li><T pt={<><em>Trade-offs.</em> Decisões com custo e risco reais, tomadas com estimativas imprecisas. Vale justificar com razões, não com “porque eu mandei”.</>} en={<><em>Trade-offs.</em> Decisions with real cost and risk, made with imprecise estimates. Justify them with reasons, not with “because I said so”.</>} /></li>
        </ul>
        <Diagram minWidth={560} caption={<T pt="Quanto mais tempo o código vive, mais o mundo ao redor muda. Esta é a diferença entre programar e fazer engenharia." en="The longer code lives, the more the world around it changes. That is the difference between programming and engineering." />}>
          <svg viewBox="0 0 640 150" role="img" aria-label="Duas barras: código curto e código de décadas / Two bars: short code and decades-long code">
            <text x="0" y="24" className="pt mut">Código descartável: um script de uma tarde</text>
            <text x="0" y="24" className="en mut">Throwaway code: an afternoon script</text>
            <rect x="0" y="34" width="6" height="16" className="fill" />
            <text x="14" y="47" className="pt">horas</text>
            <text x="14" y="47" className="en">hours</text>
            <text x="0" y="96" className="pt mut">Código de longa vida: um sistema que a empresa mantém por décadas</text>
            <text x="0" y="96" className="en mut">Long-lived code: a system the company maintains for decades</text>
            <rect x="0" y="106" width="620" height="16" className="fill" />
            <text x="310" y="118" className="pt inv" textAnchor="middle">décadas</text>
            <text x="310" y="118" className="en inv" textAnchor="middle">decades</text>
            <path d="M3 62v22M617 130v-18" className="ln dash" />
            <path d="M3 72h614" className="ln dash" />
            <path d="M3 72l8-4M3 72l8 4M617 72l-8-4M617 72l-8 4" className="ln" />
            <text x="310" y="66" className="pt" textAnchor="middle">pelo menos 100.000× de diferença</text>
            <text x="310" y="66" className="en" textAnchor="middle">at least 100,000× apart</text>
          </svg>
        </Diagram>
        <p><T pt={<>O livro chama de <em>sustentável</em> o projeto que, durante a vida esperada do código, é capaz de reagir a qualquer mudança valiosa (de tecnologia ou de produto). Repare: o que importa é a <em>capacidade</em>. Você pode escolher não atualizar uma biblioteca, mas precisa poder.</>} en={<>The book calls a project <em>sustainable</em> when, for the code’s expected life span, it can react to any valuable change (technology or product). Note that what matters is the <em>capability</em>. You may choose not to upgrade a library, but you must be able to.</>} /></p>
        <Callout tone="use" icon="check"><T pt="Uma frase para guardar: “é programação se ‘esperto’ é um elogio; é engenharia se ‘esperto’ é uma acusação.” Código esperto depende de detalhes frágeis; código de engenharia aposta em coisas que vão durar." en="A line to remember: “it’s programming if ‘clever’ is a compliment, but it’s software engineering if ‘clever’ is an accusation.” Clever code leans on fragile details; engineered code bets on things that will last." /></Callout>
      </Section>
      <Section id="hyrum" title={<T pt="Lei de Hyrum" en="Hyrum’s Law" />}>
        <p><T pt={<>A lei diz: <em>com usuários suficientes de uma API, não importa o que você prometeu no contrato; todo comportamento observável do seu sistema será usado por alguém.</em></>} en={<>The law says: <em>with a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.</em></>} /></p>
        <h3><T pt="Um exemplo simples" en="A simple example" /></h3>
        <p><T pt={<>Imagine uma função <code>listar_usuarios()</code> documentada apenas como “devolve os usuários”. Na prática, ela devolve em ordem alfabética, porque o banco por acaso fazia isso. Ninguém prometeu a ordem, mas a tela de relatórios passou a contar com ela. Um dia você troca o banco, a ordem muda, e o relatório “quebra” sem que nenhuma regra escrita tenha sido violada. (Exemplo inventado para ilustrar.)</>} en={<>Picture a function <code>list_users()</code> documented only as “returns the users”. In practice it returns them alphabetically, because the database happened to do so. Nobody promised the order, but the reports screen started relying on it. One day you swap the database, the order changes, and the report “breaks” although no written rule was violated. (An invented example, to illustrate.)</>} /></p>
        <Diagram minWidth={560} caption={<T pt="A Lei de Hyrum: o contrato é só o retângulo do meio. Os usuários dependem de tudo o que conseguem ver." en="Hyrum’s Law: the contract is only the middle rectangle. Users depend on everything they can see." />}>
          <svg viewBox="0 0 640 250" role="img" aria-label="Um retângulo pequeno dentro de um maior / A small rectangle inside a bigger one">
            <rect x="20" y="14" width="600" height="190" rx="14" className="ln" />
            <text x="36" y="38" className="pt mut">O que dá para observar (todo comportamento visível)</text>
            <text x="36" y="38" className="en mut">What can be observed (every visible behavior)</text>
            <rect x="240" y="62" width="200" height="104" rx="12" className="ln fillsoft" />
            <text x="340" y="90" className="pt" textAnchor="middle">O que você prometeu</text>
            <text x="340" y="90" className="en" textAnchor="middle">What you promised</text>
            <text x="340" y="110" className="pt mut" textAnchor="middle">(a documentação, o contrato)</text>
            <text x="340" y="110" className="en mut" textAnchor="middle">(the docs, the contract)</text>
            <text x="340" y="150" className="pt mono" textAnchor="middle">“devolve a lista”</text>
            <text x="340" y="150" className="en mono" textAnchor="middle">“returns the list”</text>
            <circle cx="46" cy="95" r="5" className="fill" />
            <text x="60" y="99" className="pt">a ordem dos itens</text>
            <text x="60" y="99" className="en">the order of items</text>
            <circle cx="46" cy="135" r="5" className="fill" />
            <text x="60" y="139" className="pt">quanto tempo demora</text>
            <text x="60" y="139" className="en">how long it takes</text>
            <circle cx="46" cy="175" r="5" className="fill" />
            <text x="60" y="179" className="pt">o texto exato do erro</text>
            <text x="60" y="179" className="en">the exact error text</text>
            <circle cx="470" cy="95" r="5" className="fill" />
            <text x="484" y="99" className="pt">campos extras</text>
            <text x="484" y="99" className="en">extra fields</text>
            <circle cx="470" cy="135" r="5" className="fill" />
            <text x="484" y="139" className="pt">efeitos colaterais</text>
            <text x="484" y="139" className="en">side effects</text>
            <text x="320" y="236" className="pt mut" textAnchor="middle">Com usuários suficientes, alguém depende de cada ponto preto. Mudar qualquer um quebra alguém.</text>
            <text x="320" y="236" className="en mut" textAnchor="middle">With enough users, somebody depends on every black dot. Changing any of them breaks someone.</text>
          </svg>
        </Diagram>
        <h3><T pt="O exemplo do livro: ordem de um hash" en="The book’s example: hash ordering" /></h3>
        <p><T pt="Em muitas linguagens, percorrer um conjunto (set) devolve os itens numa ordem aparentemente aleatória. Todo especialista diz que não se pode contar com ela. Mas, com tempo suficiente, alguém contará. O livro lembra até que há quem use essa aleatoriedade como um gerador de números aleatórios ineficiente, e remover isso quebraria essas pessoas." en="In many languages, walking over a set returns items in a seemingly random order. Every expert says you must not rely on it. But given enough time, someone will. The book even notes that some code uses that randomness as an inefficient random-number generator, so removing it would break those users." /></p>
        <CodeBlock code={`>>> for i in {"apple", "banana", "carrot", "durian", "eggplant"}: print(i)
durian
carrot
apple
eggplant
banana`} />
        <p><T pt="O que fazer? Não dá para eliminar a Lei de Hyrum (como a entropia, ela sempre vale), mas dá para se planejar: ser claro sobre o que é promessa, tornar o não prometido difícil de usar (por exemplo, embaralhar de propósito) e ter testes que avisem quando algo muda." en="What to do? You cannot eliminate Hyrum’s Law (like entropy, it always applies), but you can plan for it: be clear about what is a promise, make the unpromised hard to rely on (for example, shuffling on purpose) and have tests that warn you when something changes." /></p>
      </Section>
      <Section id="scale" title={<T pt="Escala: políticas que funcionam quando a empresa cresce" en="Scale: policies that work as the company grows" />}>
        <p><T pt={<>O teste do livro para qualquer processo: imagine <em>um</em> engenheiro e faça a empresa crescer 10 ou 100 vezes. O trabalho dele cresce junto? Se cresce, o processo não escala, a não ser que haja automação.</>} en={<>The book’s test for any process: picture <em>one</em> engineer and make the company grow 10 or 100 times. Does that engineer’s workload grow too? If it does, the process does not scale, unless there is automation.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Pergunta de ouro: se a empresa for 10× maior, o trabalho de cada pessoa também vira 10×? Se sim, falta automação." en="The golden question: if the company is 10× bigger, does each person’s work become 10× too? If yes, you need automation." />}>
          <svg viewBox="0 0 640 250" role="img" aria-label="Gráfico com duas linhas: uma sobe e outra fica reta / Chart with two lines: one rises and one stays flat">
            <path d="M60 20V200H600" className="ln" />
            <text x="330" y="232" className="pt mut" textAnchor="middle">tamanho da empresa (engenheiros, código, tempo)</text>
            <text x="330" y="232" className="en mut" textAnchor="middle">size of the company (engineers, code, time)</text>
            <g transform="rotate(-90 22 110)">
              <text x="22" y="110" className="pt mut" textAnchor="middle">trabalho por engenheiro</text>
              <text x="22" y="110" className="en mut" textAnchor="middle">work per engineer</text>
            </g>
            <path d="M60 180C200 170 360 120 590 36" className="ln" />
            <text x="500" y="62" className="pt" textAnchor="end">política que não escala</text>
            <text x="500" y="62" className="en" textAnchor="end">policy that does not scale</text>
            <path d="M60 182H590" className="ln dash" />
            <text x="500" y="172" className="pt" textAnchor="end">política que escala</text>
            <text x="500" y="172" className="en" textAnchor="end">policy that scales</text>
            <circle cx="590" cy="36" r="4" className="fill" />
            <circle cx="590" cy="182" r="4" className="fill" />
          </svg>
        </Diagram>
        <h3><T pt="Dois exemplos de política que não escala" en="Two examples of policies that do not scale" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Descontinuar assim:</em> “vamos apagar o Widget antigo em 15 de agosto; migrem para o novo.” Com poucos times funciona. Com milhares, cada time gasta um tempo aprendendo a migrar, resolve só o seu caso e descarta o que aprendeu.</>} en={<><em>Deprecating like this:</em> “we’ll delete the old Widget on August 15; migrate to the new one.” With a few teams it works. With thousands, every team spends time learning to migrate, solves only its own case and throws the knowledge away.</>} /></li>
          <li><T pt={<><em>Branches longas por time ou por feature:</em> cada merge obriga todo mundo a ressincronizar e retestar. Com 5 a 10 branches dá para viver; com centenas, o custo explode.</>} en={<><em>Long-lived branches per team or feature:</em> every merge forces everyone to resync and retest. With 5 to 10 branches you can cope; with hundreds the cost explodes.</>} /></li>
        </ul>
        <h3><T pt="E o que escala" en="And what does scale" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>A Regra da Rotatividade (Churn Rule):</em> quem muda a infraestrutura é quem migra os usuários, ou mantém a compatibilidade. Um grupo de especialistas faz o trabalho uma vez, bem feito, em vez de cada time fazer mal.</>} en={<><em>The Churn Rule:</em> whoever changes the infrastructure is the one who migrates the users, or keeps backward compatibility. A group of experts does the work once, and well, instead of every team doing it badly.</>} /></li>
          <li><T pt={<><em>A Regra da Beyoncé:</em> “se você gostou, devia ter posto um teste”. Se uma mudança de infraestrutura quebra seu produto mas nenhum teste do CI avisou, a culpa não é de quem mudou. Isso permite que times de infra mexam no código de todos sem perguntar um a um.</>} en={<><em>The Beyoncé Rule:</em> “if you liked it, you should have put a test on it”. If an infrastructure change breaks your product but no CI test flagged it, it is not the fault of whoever made the change. This lets infrastructure teams change everyone’s code without asking one team at a time.</>} /></li>
          <li><T pt={<><em>Trabalho frequente fica barato:</em> o Google demorou a atualizar um compilador em 2006 (foi doloroso, anos sem trocar). Para algumas linguagens, hoje atualiza a cada uma ou duas semanas. Quanto mais se faz, mais se automatiza e menos código frágil sobra.</>} en={<><em>Frequent work gets cheap:</em> Google struggled to upgrade a compiler in 2006 (it was painful after years without changing). For some languages, it now upgrades every week or two. The more you do it, the more you automate and the less fragile code remains.</>} /></li>
        </ul>
        <Callout tone="good" icon="check"><T pt={<>Moral: parar no tempo é uma opção, mas raramente sábia. Sem atualizações você fica sem correções de segurança e sem ganhos de eficiência. O que protege é <em>praticar</em> a mudança até ela ficar barata.</>} en={<>Moral: standing still is an option, but rarely a wise one. Without upgrades you lose security fixes and efficiency gains. What protects you is <em>practicing</em> change until it gets cheap.</>} /></Callout>
      </Section>
      <Section id="shift" title={<T pt="Trade-offs, custos e “shift left”" en="Trade-offs, costs and “shift left”" />}>
        <p><T pt="Decidir é pesar custos, e o livro lembra que custo não é só dinheiro:" en="Deciding is weighing costs, and the book reminds us that cost is not only money:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Financeiro</em> (dinheiro), <em>de recursos</em> (CPU, memória) e <em>de pessoas</em> (horas de engenharia);</>} en={<><em>Financial</em> (money), <em>resource</em> (CPU, memory) and <em>personnel</em> (engineering hours);</>} /></li>
          <li><T pt={<><em>De transação</em> (quanto custa agir) e <em>de oportunidade</em> (quanto custa <em>não</em> agir);</>} en={<><em>Transaction</em> (what it costs to act) and <em>opportunity</em> (what it costs <em>not</em> to act);</>} /></li>
          <li><T pt={<><em>Social</em>: em escala de bilhões de usuários, pequenas falhas de acessibilidade ou de justiça viram grandes danos.</>} en={<><em>Societal</em>: at billions of users, small accessibility or fairness gaps become big harms.</>} /></li>
        </ul>
        <p><T pt="Exemplo do livro: marcadores de quadro branco. Em muitas empresas eles são raros e trancados, e metade está seca. No Google há armários abertos cheios deles. A troca é consciente: custa menos que um dólar o marcador, e atrapalhar um brainstorming custa muito mais do que alguns marcadores levados embora. Esse é o tipo de conta que o livro quer que você faça, de olhos abertos." en="A book example: whiteboard markers. In many companies they are scarce and locked up, and half of them are dry. At Google there are open closets full of them. The trade is deliberate: a marker costs less than a dollar, and disrupting a brainstorm costs far more than a few stolen markers. That is the kind of arithmetic the book wants you to do, eyes open." /></p>
        <h3><T pt="Shift left" en="Shift left" /></h3>
        <p><T pt={<>Imagine a vida de uma mudança numa linha do tempo: design, código, review, teste, commit, canário, produção. Achar um problema mais à <em>esquerda</em> custa menos. Por isso o livro insiste em testes, análise estática e code review antes do commit, em camadas (nenhuma é perfeita, então se usa defesa em profundidade).</>} en={<>Picture a change’s life on a timeline: design, code, review, test, commit, canary, production. Finding a problem further <em>left</em> costs less. That is why the book insists on tests, static analysis and code review before the commit, in layers (none is perfect, so you use defense in depth).</>} /></p>
        <Diagram minWidth={560} caption={<T pt="“Shift left”: levar a detecção de problemas para o começo da linha do tempo." en="“Shift left”: moving problem detection to the start of the timeline." />}>
          <svg viewBox="0 0 640 220" role="img" aria-label="Barras crescendo da esquerda para a direita / Bars growing from left to right">
            <rect x="20" y="138.0" width="64" height="12.0" className="fillsoft ln" />
            <text x="52" y="172" className="" textAnchor="middle">Design</text>
            <rect x="108" y="135.6" width="64" height="14.4" className="fillsoft ln" />
            <text x="140" y="172" className="pt" textAnchor="middle">Código</text>
            <text x="140" y="172" className="en" textAnchor="middle">Code</text>
            <rect x="196" y="128.4" width="64" height="21.6" className="fillsoft ln" />
            <text x="228" y="172" className="" textAnchor="middle">Review</text>
            <rect x="284" y="116.4" width="64" height="33.599999999999994" className="fillsoft ln" />
            <text x="316" y="172" className="pt" textAnchor="middle">Teste</text>
            <text x="316" y="172" className="en" textAnchor="middle">Test</text>
            <rect x="372" y="99.6" width="64" height="50.4" className="fillsoft ln" />
            <text x="404" y="172" className="" textAnchor="middle">Commit</text>
            <rect x="460" y="78.0" width="64" height="72.0" className="fillsoft ln" />
            <text x="492" y="172" className="pt" textAnchor="middle">Canário</text>
            <text x="492" y="172" className="en" textAnchor="middle">Canary</text>
            <rect x="548" y="51.60000000000001" width="64" height="98.39999999999999" className="fill" />
            <text x="580" y="172" className="pt" textAnchor="middle">Produção</text>
            <text x="580" y="172" className="en" textAnchor="middle">Production</text>
            <path d="M600 34H40" className="ln" />
            <path d="M40 34l9-5M40 34l9 5" className="ln" />
            <text x="320" y="22" className="pt" textAnchor="middle">achar o problema aqui sai barato</text>
            <text x="320" y="22" className="en" textAnchor="middle">finding the problem here is cheap</text>
            <text x="320" y="204" className="pt mut" textAnchor="middle">A altura da barra é o custo de consertar. Quanto mais à esquerda você pega o erro, menos ele custa.</text>
            <text x="320" y="204" className="en mut" textAnchor="middle">The bar height is the cost of fixing. The further left you catch a bug, the less it costs.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="teams" title={<T pt="Equipes e cultura" en="Teams and culture" />}>
        <p><T pt="A segunda parte do livro vale ouro e quase não tem código. A tese: engenharia de software é um esforço de equipe, e o mito do “gênio solitário” atrapalha." en="The book’s second part is gold and has almost no code. The thesis: software engineering is a team effort, and the “lone genius” myth gets in the way." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Não se esconda.</em> Trabalhar sozinho por semanas e só mostrar o resultado pronto é arriscado: você pode gastar tudo na coisa errada. Mostrar cedo traz feedback cedo.</>} en={<><em>Don’t hide.</em> Working alone for weeks and showing only the finished result is risky: you may spend it all on the wrong thing. Showing early brings feedback early.</>} /></li>
          <li><T pt={<><em>Fator ônibus (bus factor):</em> quantas pessoas precisam “ser atropeladas por um ônibus” para o projeto parar? Compartilhar conhecimento aumenta esse número.</>} en={<><em>Bus factor:</em> how many people would have to be “hit by a bus” for the project to stall? Sharing knowledge raises that number.</>} /></li>
          <li><T pt={<><em>Humildade, respeito e confiança:</em> os três pilares da interação social. Você não é o centro do universo, trata os colegas como pessoas e confia que eles sabem o que fazem.</>} en={<><em>Humility, respect and trust:</em> the three pillars of social interaction. You are not the center of the universe, you treat colleagues as people and you trust they know what they are doing.</>} /></li>
          <li><T pt={<><em>Post-mortem sem culpados:</em> depois de um incidente, o foco é entender o que falhou no sistema, não quem errou. Assim as pessoas contam a verdade.</>} en={<><em>Blameless post-mortems:</em> after an incident the focus is what failed in the system, not who erred. That way people tell the truth.</>} /></li>
          <li><T pt={<><em>Segurança psicológica e compartilhar conhecimento:</em> perguntar deve ser seguro. Documentar, dar palestras e ter um lugar canônico de informação fazem o conhecimento escalar.</>} en={<><em>Psychological safety and knowledge sharing:</em> asking must be safe. Writing docs, giving talks and having a canonical source of information make knowledge scale.</>} /></li>
        </ul>
        <p><T pt={<>Para quem lidera, o livro resume em três verbos: <em>sempre decidir</em> (achar o melhor trade-off do momento e iterar), <em>sempre sair</em> (montar um time que resolve sozinho, sem depender de você) e <em>sempre escalar</em> (proteger seu tempo e energia à medida que o sucesso traz mais trabalho). E, para medir produtividade, use primeiro a pergunta: “se eu medir isto, vou conseguir agir sobre o resultado?”</>} en={<>For leaders, the book boils it down to three verbs: <em>always be deciding</em> (find the best trade-off of the moment and iterate), <em>always be leaving</em> (build a team that solves things without you) and <em>always be scaling</em> (protect your time and energy as success brings more work). And to measure productivity, first ask: “if I measure this, will I be able to act on the result?”</>} /></p>
      </Section>
      <Section id="review" title={<T pt="Code review" en="Code review" />}>
        <p><T pt="No Google toda mudança é revisada por alguém que não é o autor antes de entrar. O livro mostra que revisar serve para mais do que achar bugs: garante que o código seja compreensível, consistente e que o conhecimento circule." en="At Google every change is reviewed by someone other than the author before it lands. The book shows review is for more than finding bugs: it keeps code understandable and consistent, and makes knowledge flow." /></p>
        <Diagram minWidth={560} caption={<T pt="Três tipos de aprovação, mas muitas vezes uma só pessoa cumpre os três papéis, o que mantém o processo rápido." en="Three kinds of approval, but often a single person fills all three roles, which keeps the process fast." />}>
          <svg viewBox="0 0 640 170" role="img" aria-label="Autor passando por três aprovações / Author passing through three approvals">
            <rect x="10" y="60" width="96" height="46" rx="8" className="ln" />
            <text x="58" y="88" className="pt" textAnchor="middle">Autor</text>
            <text x="58" y="88" className="en" textAnchor="middle">Author</text>
            <path d="M106 83H150" className="ln" />
            <path d="M144 78l6 5-6 5" className="ln" />
            <rect x="150" y="14" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="38" className="pt" textAnchor="middle">1. Colega: LGTM</text>
            <text x="235" y="38" className="en" textAnchor="middle">1. Peer: LGTM</text>
            <rect x="150" y="64" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="88" className="pt" textAnchor="middle">2. Dono da pasta</text>
            <text x="235" y="88" className="en" textAnchor="middle">2. Folder owner</text>
            <rect x="150" y="114" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="138" className="pt" textAnchor="middle">3. “Readability”</text>
            <text x="235" y="138" className="en" textAnchor="middle">3. Readability</text>
            <path d="M320 34H370M320 84H370M320 134H370" className="ln" />
            <path d="M370 34V134" className="ln" />
            <path d="M370 84H410" className="ln" />
            <path d="M404 79l6 5-6 5" className="ln" />
            <rect x="410" y="60" width="130" height="46" rx="8" className="fill" />
            <text x="475" y="88" className="pt inv" textAnchor="middle">Pode entrar</text>
            <text x="475" y="88" className="en inv" textAnchor="middle">Can merge</text>
            <text x="475" y="128" className="pt mut" textAnchor="middle">uma pessoa pode ter os 3 papéis</text>
            <text x="475" y="128" className="en mut" textAnchor="middle">one person can hold all 3 roles</text>
          </svg>
        </Diagram>
        <p><T pt={<>As três aprovações: um colega confere se está correto e compreensível (o famoso <em>LGTM</em>, “looks good to me”); o <em>dono</em> da pasta confere se aquilo pertence ali; e alguém com <em>readability</em> naquela linguagem confere o estilo e as boas práticas. Se o autor já é dono e tem readability, só precisa do LGTM do colega.</>} en={<>The three approvals: a peer checks it is correct and understandable (the famous <em>LGTM</em>, “looks good to me”); the folder <em>owner</em> checks it belongs there; and someone with <em>readability</em> in that language checks style and best practices. If the author is already an owner with readability, only the peer’s LGTM is needed.</>} /></p>
        <h3><T pt="Boas práticas" en="Best practices" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Mudanças pequenas:</em> cerca de 200 linhas. São revisadas mais rápido, o bug é mais fácil de localizar e o autor não fica parado esperando.</>} en={<><em>Small changes:</em> around 200 lines. They get reviewed faster, a bug is easier to pinpoint and the author is not stuck waiting.</>} /></li>
          <li><T pt={<><em>Primeira resposta em cerca de um dia.</em> Isso não significa terminar em um dia, mas dar um retorno.</>} en={<><em>First feedback within about a day.</em> That does not mean finishing in a day, just answering.</>} /></li>
          <li><T pt={<><em>Descrição que explica o porquê.</em> A primeira linha vira o título em ferramentas e no histórico; “Bug fix” não ajuda ninguém. A descrição é o registro histórico daquela mudança.</>} en={<><em>A description that explains why.</em> The first line becomes the title in tools and history; “Bug fix” helps nobody. The description is the historical record of that change.</>} /></li>
          <li><T pt={<><em>Poucos revisores e muita automação:</em> o que a máquina checa (formato, estilo, testes) não precisa gastar a atenção humana.</>} en={<><em>Few reviewers and plenty of automation:</em> what a machine can check (format, style, tests) should not use up human attention.</>} /></li>
          <li><T pt={<><em>Seja educado e profissional.</em> A revisão é também mentoria.</>} en={<><em>Be polite and professional.</em> Review is also mentoring.</>} /></li>
        </ul>
      </Section>
      <Section id="tests" title={<T pt="Testes" en="Testing" />}>
        <p><T pt="O livro conta a história do Google Web Server (GWS), que serve a busca. Em 2005 o projeto tinha ficado travado: mais de 80% dos deploys continham bugs que afetavam usuários e precisavam de rollback. O tech lead instituiu testes automatizados obrigatórios para toda mudança. Em um ano, os deploys de emergência caíram pela metade, mesmo com um número recorde de mudanças. Hoje o GWS tem dezenas de milhares de testes e entrega quase todo dia." en="The book tells the story of the Google Web Server (GWS), which serves Search. In 2005 the project had stalled: over 80% of pushes contained user-affecting bugs and had to be rolled back. The tech lead mandated automated tests for every change. Within a year, emergency pushes dropped by half, even with a record number of changes. Today GWS has tens of thousands of tests and ships almost daily." /></p>
        <p><T pt={<>A conta que justifica isso: um time de 100 engenheiros tão bons que cada um erra uma vez por mês ainda produz cerca de <em>5 bugs novos por dia útil</em>. Só automação segura isso.</>} en={<>The math behind it: a team of 100 engineers so good that each makes a single bug a month still produces about <em>5 new bugs every work day</em>. Only automation holds that back.</>} /></p>
        <h3><T pt="Tamanho e escopo" en="Size and scope" /></h3>
        <p><T pt="Para o Google, todo teste tem duas dimensões diferentes:" en="At Google, every test has two different dimensions:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Tamanho</em> é o que o teste consome e pode fazer. <em>Pequeno</em>: um único processo, sem rede, sem disco, sem dormir. <em>Médio</em>: uma máquina (pode subir um banco local). <em>Grande</em>: pode usar várias máquinas.</>} en={<><em>Size</em> is what a test consumes and is allowed to do. <em>Small</em>: a single process, no network, no disk, no sleeping. <em>Medium</em>: one machine (it may start a local database). <em>Large</em>: may span several machines.</>} /></li>
          <li><T pt={<><em>Escopo</em> é quanto código o teste verifica: estreito (unidade), médio (integração) ou amplo (ponta a ponta).</>} en={<><em>Scope</em> is how much code the test verifies: narrow (unit), medium (integration) or broad (end to end).</>} /></li>
        </ul>
        <p><T pt="Os testes pequenos são rápidos e determinísticos (dão sempre o mesmo resultado). Os grandes são mais lentos e podem ser instáveis. Daí vem a pirâmide: muitos testes estreitos e rápidos na base, poucos de ponta a ponta no topo. O livro avisa para fugir do “sorvete de casquinha” (muitos ponta a ponta, poucos de unidade) e da “ampulheta”." en="Small tests are fast and deterministic (always the same result). Large ones are slower and can be unreliable. Hence the pyramid: many narrow, fast tests at the base, few end-to-end ones at the top. The book warns against the “ice cream cone” (many end to end, few unit) and the “hourglass”." /></p>
        <Diagram minWidth={560} caption={<T pt="A mistura aproximada que o Google busca (por número de testes). Cada time ajusta a sua." en="The rough mix Google aims for (by number of tests). Each team tunes its own." />}>
          <svg viewBox="0 0 640 240" role="img" aria-label="Pirâmide de testes em três camadas / Three-layer test pyramid">
            <path d="M320 16L230 214H410z" className="ln" />
            <path d="M288 86H352M259 150H381" className="ln" />
            <text x="320" y="62" className="" textAnchor="middle">5%</text>
            <text x="320" y="123" className="" textAnchor="middle">15%</text>
            <text x="320" y="187" className="" textAnchor="middle">80%</text>
            <text x="436" y="66" className="pt">Ponta a ponta: o sistema todo</text>
            <text x="436" y="66" className="en">End to end: the whole system</text>
            <text x="436" y="123" className="pt">Integração: poucas peças juntas</text>
            <text x="436" y="123" className="en">Integration: a few parts together</text>
            <text x="436" y="187" className="pt">Unidade: uma peça só, rápida</text>
            <text x="436" y="187" className="en">Unit: a single piece, fast</text>
            <text x="204" y="66" className="pt mut" textAnchor="end">grande: roda onde quiser</text>
            <text x="204" y="66" className="en mut" textAnchor="end">large: runs anywhere</text>
            <text x="204" y="123" className="pt mut" textAnchor="end">média: uma máquina</text>
            <text x="204" y="123" className="en mut" textAnchor="end">medium: one machine</text>
            <text x="204" y="187" className="pt mut" textAnchor="end">pequena: um processo</text>
            <text x="204" y="187" className="en mut" textAnchor="end">small: one process</text>
          </svg>
        </Diagram>
        <h3><T pt="Testes instáveis (flaky) custam caro" en="Flaky tests are expensive" /></h3>
        <p><T pt={<>Um teste instável às vezes falha sem motivo. Se cada teste tem só 0,1% de chance de falhar à toa e você roda 10.000 por dia, serão <em>10 investigações inúteis por dia</em>. Pior que o tempo perdido é a perda de confiança: perto de 1% de instabilidade, as pessoas passam a ignorar as falhas e a suíte perde o valor. O Google mantém a taxa em torno de 0,15%.</>} en={<>A flaky test sometimes fails for no reason. If each test has just a 0.1% chance of failing wrongly and you run 10,000 a day, that is <em>10 pointless investigations a day</em>. Worse than the lost time is the lost trust: near 1% flakiness, people start ignoring failures and the suite loses its value. Google keeps the rate around 0.15%.</>} /></p>
        <h3><T pt="Testes legíveis: DAMP em vez de DRY" en="Readable tests: DAMP over DRY" /></h3>
        <p><T pt={<>No código normal, “não se repita” (DRY) é bom. No teste, esconder tudo em funções auxiliares obriga o leitor a pular pelo arquivo para entender o que está sendo verificado. O livro prefere <em>DAMP</em>: “Descriptive And Meaningful Phrases”. Um pouco de repetição é aceitável se deixa o teste óbvio ao ler.</>} en={<>In normal code “don’t repeat yourself” (DRY) is good. In a test, hiding everything in helper functions forces the reader to jump around the file to see what is being verified. The book prefers <em>DAMP</em>: “Descriptive And Meaningful Phrases”. A bit of repetition is fine if it makes the test obvious on reading.</>} /></p>
        <CodeBlock code={`@Test
public void shouldNotRegisterBannedUsers() {
  User user = newUser().setState(State.BANNED).build();
  Forum forum = new Forum();
  try {
    forum.register(user);
  } catch (BannedUserException ignored) {}
  assertThat(forum.hasRegisteredUser(user)).isFalse();
}`} />
        <p><T pt={<>Outras regras do capítulo de testes unitários: testar pela API pública, testar <em>comportamentos</em> e não métodos, verificar o <em>estado</em> e não as interações, não pôr lógica (if, loops) dentro do teste, e escrever mensagens de falha claras.</>} en={<>Other rules from the unit-testing chapter: test through the public API, test <em>behaviors</em> and not methods, verify <em>state</em> and not interactions, put no logic (if, loops) inside a test, and write clear failure messages.</>} /></p>
        <h3><T pt="Dublês de teste: prefira o real" en="Test doubles: prefer the real thing" /></h3>
        <ul className="ds-list">
          <li><T pt={<>1º: use a <em>implementação real</em> sempre que for viável;</>} en={<>1st: use the <em>real implementation</em> whenever it is feasible;</>} /></li>
          <li><T pt={<>2º: se não der, um <em>fake</em> (uma versão simples e correta, como um banco em memória) é o ideal;</>} en={<>2nd: if not, a <em>fake</em> (a simple, correct version, like an in-memory database) is ideal;</>} /></li>
          <li><T pt={<>Evite abusar de <em>stubs</em> e de testes de <em>interação</em> (“esta função foi chamada 2 vezes”): eles amarram o teste à implementação e quebram à toa.</>} en={<>Avoid overusing <em>stubs</em> and <em>interaction</em> tests (“this function was called twice”): they tie the test to the implementation and break for no reason.</>} /></li>
        </ul>
        <p><T pt={<>Além disso, o livro lembra de testar <em>falhas</em>: simular exceções, injetar latência e erros de rede. Cobertura de código (% de linhas executadas) ajuda a achar o que ficou sem teste, mas não prova que o teste verifica algo.</>} en={<>The book also reminds us to test <em>failures</em>: simulate exceptions, inject latency and network errors. Code coverage (% of lines executed) helps find what has no test, but does not prove the test verifies anything.</>} /></p>
      </Section>
      <Section id="tools" title={<T pt="Ferramentas e entrega" en="Tools and delivery" />}>
        <p><T pt="A parte final trata de como a mudança chega à produção sem dor." en="The final part covers how a change reaches production without pain." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Um repositório, uma versão.</em> Controle de versão para tudo que seja maior que um brinquedo. A “regra de uma versão” elimina a pergunta “de qual versão eu dependo?”, que não escala. Desenvolvimento no tronco (trunk-based) é, segundo as pesquisas citadas (DORA), um preditor de organizações de alto desempenho; branches longas não são um bom padrão.</>} en={<><em>One repository, one version.</em> Version control for anything bigger than a toy. The “one-version rule” removes the question “which version do I depend on?”, which does not scale. Trunk-based development is, per the research cited (DORA), a predictor of high-performing organizations; long-lived branches are not a good default.</>} /></li>
          <li><T pt={<><em>Build como artefatos.</em> Sistemas de build organizados em torno de <em>artefatos</em> (não de tarefas) escalam e são mais confiáveis. Prefira módulos pequenos (aproveitam paralelismo e builds incrementais) e dependências externas com versão explícita, nunca “latest”.</>} en={<><em>Build around artifacts.</em> Build systems organized around <em>artifacts</em> (not tasks) scale better and are more reliable. Prefer fine-grained modules (they exploit parallelism and incremental builds) and externally versioned dependencies, never “latest”.</>} /></li>
          <li><T pt={<><em>Análise estática no fluxo normal.</em> Ferramentas que apontam padrões de bug devem aparecer no code review, com correção sugerida, e ter poucos falsos positivos; senão as pessoas as ignoram.</>} en={<><em>Static analysis in the normal flow.</em> Tools that flag bug patterns should show up in code review with a suggested fix and few false positives; otherwise people ignore them.</>} /></li>
          <li><T pt={<><em>Dependências são contratos.</em> Adicionar uma dependência não é de graça: há um custo contínuo de confiança e manutenção. O versionamento semântico (SemVer) é só uma estimativa de risco, não uma garantia.</>} en={<><em>Dependencies are contracts.</em> Adding a dependency is not free: there is an ongoing cost of trust and maintenance. Semantic versioning (SemVer) is just an estimate of risk, not a guarantee.</>} /></li>
          <li><T pt={<><em>Mudanças em larga escala (LSC).</em> Com um processo próprio, dá para mudar milhares de arquivos de uma vez (por exemplo, renomear uma API). O refatoramento tradicional não aguenta essa escala.</>} en={<><em>Large-scale changes (LSC).</em> With a process of their own, you can change thousands of files at once (for example, rename an API). Traditional refactoring breaks at that scale.</>} /></li>
        </ul>
        <h3><T pt="Integração e entrega contínuas" en="Continuous integration and delivery" /></h3>
        <p><T pt={<>O CI decide quais testes rodar e quando. Antes do commit (<em>pré-submit</em>) rodam testes rápidos e confiáveis; depois (<em>pós-submit</em>), os mais lentos. Na entrega contínua, o livro destaca: <em>feature flags</em> para isolar mudanças, <em>rollout em etapas</em> (canário) porque o mundo real é mais diverso que o ambiente de teste, medir se o recurso é usado, e a ideia de que <em>mais rápido é mais seguro</em>: entregas pequenas e frequentes têm menos risco cada.</>} en={<>CI decides which tests to run and when. Before the commit (<em>presubmit</em>) quick, reliable tests run; after it (<em>post-submit</em>), the slower ones. For continuous delivery the book highlights: <em>feature flags</em> to isolate changes, <em>staged rollouts</em> (canary) because the real world is more diverse than a test environment, measuring whether a feature is used, and the idea that <em>faster is safer</em>: small, frequent releases carry less risk each.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="O caminho de uma mudança até os usuários: testes rápidos antes, testes pesados depois, e liberação gradual." en="A change’s path to users: quick tests before, heavy tests after, and a gradual rollout." />}>
          <svg viewBox="0 0 640 200" role="img" aria-label="Fluxo de integração e entrega contínuas / Continuous integration and delivery flow">
            <rect x="4" y="30" width="114" height="52" rx="8" className="ln" />
            <text x="61" y="52" className="pt" textAnchor="middle">Pré-submit</text>
            <text x="61" y="52" className="en" textAnchor="middle">Presubmit</text>
            <text x="61" y="70" className="pt mut" textAnchor="middle">rápido, estável</text>
            <text x="61" y="70" className="en mut" textAnchor="middle">fast, reliable</text>
            <path d="M118 56H142" className="ln" />
            <path d="M136 51l6 5-6 5" className="ln" />
            <rect x="142" y="30" width="80" height="52" rx="8" className="fill" />
            <text x="182" y="62" className="inv" textAnchor="middle">Commit</text>
            <path d="M222 56H246" className="ln" />
            <path d="M240 51l6 5-6 5" className="ln" />
            <rect x="246" y="30" width="130" height="52" rx="8" className="ln" />
            <text x="311" y="52" className="pt" textAnchor="middle">Pós-submit</text>
            <text x="311" y="52" className="en" textAnchor="middle">Post-submit</text>
            <text x="311" y="70" className="pt mut" textAnchor="middle">lento, completo</text>
            <text x="311" y="70" className="en mut" textAnchor="middle">slow, thorough</text>
            <path d="M376 56H400" className="ln" />
            <path d="M394 51l6 5-6 5" className="ln" />
            <rect x="400" y="30" width="110" height="52" rx="8" className="ln" />
            <text x="455" y="52" className="pt" textAnchor="middle">Canário</text>
            <text x="455" y="52" className="en" textAnchor="middle">Canary</text>
            <text x="455" y="70" className="pt mut" textAnchor="middle">poucos usuários</text>
            <text x="455" y="70" className="en mut" textAnchor="middle">a few users</text>
            <path d="M510 56H534" className="ln" />
            <path d="M528 51l6 5-6 5" className="ln" />
            <rect x="534" y="30" width="102" height="52" rx="8" className="ln" />
            <text x="585" y="52" className="pt" textAnchor="middle">Todos</text>
            <text x="585" y="52" className="en" textAnchor="middle">Everyone</text>
            <text x="585" y="70" className="pt mut" textAnchor="middle">aos poucos</text>
            <text x="585" y="70" className="en mut" textAnchor="middle">gradually</text>
            <path d="M61 100V122H585V100" className="ln dash" />
            <text x="320" y="146" className="pt" textAnchor="middle">Feature flags: o código chega à produção desligado e é ligado de forma controlada</text>
            <text x="320" y="146" className="en" textAnchor="middle">Feature flags: code reaches production switched off and is turned on in a controlled way</text>
            <text x="320" y="180" className="pt mut" textAnchor="middle">Entregas pequenas e frequentes: quanto menor a mudança, menor o risco de cada uma.</text>
            <text x="320" y="180" className="en mut" textAnchor="middle">Small, frequent releases: the smaller the change, the lower the risk of each.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="apply" title={<T pt="Como aplicar no seu projeto" en="Applying it to your project" />}>
        <p><T pt="Você não precisa ser o Google para usar as ideias. Um roteiro bem pequeno, em ordem de retorno:" en="You don’t need to be Google to use these ideas. A very small checklist, in order of return:" /></p>
        <ol className="ds-steps">
          <li><T pt="Escreva testes pequenos e rápidos para as regras de negócio, e faça o CI rodá-los a cada push. Exija teste junto de toda correção de bug." en="Write small, fast tests for business rules and make CI run them on every push. Require a test with every bug fix." /></li>
          <li><T pt={<>Revise em mudanças pequenas e descreva o <em>porquê</em> no commit.</>} en={<>Review in small changes and describe the <em>why</em> in the commit.</>} /></li>
          <li><T pt="Prefira o tronco e branches curtas; esconda trabalho incompleto atrás de uma feature flag." en="Prefer trunk and short branches; hide unfinished work behind a feature flag." /></li>
          <li><T pt="Fixe versões de dependências e atualize com frequência, em vez de a cada cinco anos." en="Pin dependency versions and upgrade often, rather than every five years." /></li>
          <li><T pt="Documente decisões e escreva post-mortems sem culpados." en="Document decisions and write blameless post-mortems." /></li>
          <li><T pt="Em cada processo repetido, pergunte: se a equipe for 10× maior, isto ainda cabe? Se não, automatize." en="For each repeated process ask: if the team were 10× bigger, would this still fit? If not, automate it." /></li>
        </ol>
        <Callout tone="personal" icon="check"><T pt="Anotação pessoal: este resumo segue a ordem do livro, mas escolhe e simplifica. Os números e citações (80% de pushes ruins no GWS, 0,15% de testes instáveis, 200 linhas por mudança, 80/15/5 de testes) vêm do texto; os exemplos marcados como inventados são meus." en="Personal note: this summary follows the book’s order but picks and simplifies. The numbers and quotes (80% bad pushes at GWS, 0.15% flaky tests, 200 lines per change, 80/15/5 test mix) come from the text; examples marked as invented are mine." /></Callout>
      </Section>
      <div className="sources">
        <b><T pt="Fonte" en="Source" /></b>
        <ul>
          <li><a href="https://abseil.io/resources/swe-book" rel="noopener">Titus Winters, Tom Manshreck, Hyrum Wright (eds.). Software Engineering at Google. O’Reilly, 2020.</a></li>
        </ul>
      </div>
    </>
  );
}
