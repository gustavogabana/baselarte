import { Callout, CodeBlock, Diagram, Section } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "software-engineering-at-google",
  title: "Software Engineering at Google (livro)",
  seo: {
    title: "Software Engineering at Google, notas do livro",
    description: "Um passeio didático pelo livro Software Engineering at Google: tempo, escala e trade-offs, Lei de Hyrum, testes, code review e entrega contínua, com exemplos simples e diagramas.",
  },
  summary: "notas do livro sobre tempo, escala e trade-offs, a Lei de Hyrum, testes, code review e entrega contínua.",
  kicker: "Notas de livro",
  heroTitle: <>Engenharia de software é <em>programação ao longo do tempo.</em></>,
  heroLede: "Um passeio didático por Software Engineering at Google: o que muda quando o código precisa viver por décadas e as equipes precisam crescer.",
  published: "2026-10-16",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "idea", title: "A ideia central" },
        { id: "hyrum", title: "Lei de Hyrum" },
        { id: "scale", title: "Escala: políticas que funcionam quando a empresa cresce" },
        { id: "shift", title: "Trade-offs, custos e “shift left”" },
        { id: "teams", title: "Equipes e cultura" },
        { id: "review", title: "Code review" },
        { id: "tests", title: "Testes" },
        { id: "tools", title: "Ferramentas e entrega" },
        { id: "apply", title: "Como aplicar no seu projeto" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="idea" title={"A ideia central"}>
        <p>O livro <em>Software Engineering at Google</em> (Titus Winters, Tom Manshreck e Hyrum Wright, O’Reilly, 2020) conta como o Google mantém uma base de código enorme viva por décadas. A frase que resume o livro inteiro é: <em>engenharia de software é programação integrada ao longo do tempo</em>.</p>
        <p>Programar é produzir código que funciona hoje. Fazer engenharia é produzir código que continue funcionando, e que ainda possa ser mudado com segurança, enquanto ele viver. O livro aponta três diferenças:</p>
        <ul className="ds-list">
          <li><em>Tempo.</em> Quanto tempo o código vai viver? A resposta razoável pode variar por um fator de 100.000, de minutos a décadas.</li>
          <li><em>Escala.</em> Tudo o que a organização faz várias vezes (revisar, testar, atualizar) precisa continuar viável quando ela crescer 10 ou 100 vezes.</li>
          <li><em>Trade-offs.</em> Decisões com custo e risco reais, tomadas com estimativas imprecisas. Vale justificar com razões, não com “porque eu mandei”.</li>
        </ul>
        <Diagram minWidth={560} caption={"Quanto mais tempo o código vive, mais o mundo ao redor muda. Esta é a diferença entre programar e fazer engenharia."}>
          <svg viewBox="0 0 640 150" role="img" aria-label="Duas barras: código curto e código de décadas">
            <text x="0" y="24" className="mut">Código descartável: um script de uma tarde</text>
            <rect x="0" y="34" width="6" height="16" className="fill" />
            <text x="14" y="47">horas</text>
            <text x="0" y="96" className="mut">Código de longa vida: um sistema que a empresa mantém por décadas</text>
            <rect x="0" y="106" width="620" height="16" className="fill" />
            <text x="310" y="118" className="inv" textAnchor="middle">décadas</text>
            <path d="M3 62v22M617 130v-18" className="ln dash" />
            <path d="M3 72h614" className="ln dash" />
            <path d="M3 72l8-4M3 72l8 4M617 72l-8-4M617 72l-8 4" className="ln" />
            <text x="310" y="66" textAnchor="middle">pelo menos 100.000× de diferença</text>
          </svg>
        </Diagram>
        <p>O livro chama de <em>sustentável</em> o projeto que, durante a vida esperada do código, é capaz de reagir a qualquer mudança valiosa (de tecnologia ou de produto). Repare: o que importa é a <em>capacidade</em>. Você pode escolher não atualizar uma biblioteca, mas precisa poder.</p>
        <Callout tone="use" icon="check">Uma frase para guardar: “é programação se ‘esperto’ é um elogio; é engenharia se ‘esperto’ é uma acusação.” Código esperto depende de detalhes frágeis; código de engenharia aposta em coisas que vão durar.</Callout>
      </Section>
      <Section id="hyrum" title={"Lei de Hyrum"}>
        <p>A lei diz: <em>com usuários suficientes de uma API, não importa o que você prometeu no contrato; todo comportamento observável do seu sistema será usado por alguém.</em></p>
        <h3>Um exemplo simples</h3>
        <p>Imagine uma função <code>listar_usuarios()</code> documentada apenas como “devolve os usuários”. Na prática, ela devolve em ordem alfabética, porque o banco por acaso fazia isso.</p>
        <p>Ninguém prometeu a ordem, mas a tela de relatórios passou a contar com ela. Um dia você troca o banco, a ordem muda, e o relatório “quebra” sem que nenhuma regra escrita tenha sido violada. (Exemplo inventado para ilustrar.)</p>
        <Diagram minWidth={560} caption={"A Lei de Hyrum: o contrato é só o retângulo do meio. Os usuários dependem de tudo o que conseguem ver."}>
          <svg viewBox="0 0 640 250" role="img" aria-label="Um retângulo pequeno dentro de um maior">
            <rect x="20" y="14" width="600" height="190" rx="14" className="ln" />
            <text x="36" y="38" className="mut">O que dá para observar (todo comportamento visível)</text>
            <rect x="240" y="62" width="200" height="104" rx="12" className="ln fillsoft" />
            <text x="340" y="90" textAnchor="middle">O que você prometeu</text>
            <text x="340" y="110" className="mut" textAnchor="middle">(a documentação, o contrato)</text>
            <text x="340" y="150" className="mono" textAnchor="middle">“devolve a lista”</text>
            <circle cx="46" cy="95" r="5" className="fill" />
            <text x="60" y="99">a ordem dos itens</text>
            <circle cx="46" cy="135" r="5" className="fill" />
            <text x="60" y="139">quanto tempo demora</text>
            <circle cx="46" cy="175" r="5" className="fill" />
            <text x="60" y="179">o texto exato do erro</text>
            <circle cx="470" cy="95" r="5" className="fill" />
            <text x="484" y="99">campos extras</text>
            <circle cx="470" cy="135" r="5" className="fill" />
            <text x="484" y="139">efeitos colaterais</text>
            <text x="320" y="236" className="mut" textAnchor="middle">Com usuários suficientes, alguém depende de cada ponto preto. Mudar qualquer um quebra alguém.</text>
          </svg>
        </Diagram>
        <h3>O exemplo do livro: ordem de um hash</h3>
        <p>Em muitas linguagens, percorrer um conjunto (set) devolve os itens numa ordem aparentemente aleatória. Todo especialista diz que não se pode contar com ela. Mas, com tempo suficiente, alguém contará. O livro lembra até que há quem use essa aleatoriedade como um gerador de números aleatórios ineficiente, e remover isso quebraria essas pessoas.</p>
        <CodeBlock code={`>>> for i in {"apple", "banana", "carrot", "durian", "eggplant"}: print(i)
durian
carrot
apple
eggplant
banana`} />
        <p>O que fazer? Não dá para eliminar a Lei de Hyrum (como a entropia, ela sempre vale), mas dá para se planejar: ser claro sobre o que é promessa, tornar o não prometido difícil de usar (por exemplo, embaralhar de propósito) e ter testes que avisem quando algo muda.</p>
      </Section>
      <Section id="scale" title={"Escala: políticas que funcionam quando a empresa cresce"}>
        <p>O teste do livro para qualquer processo: imagine <em>um</em> engenheiro e faça a empresa crescer 10 ou 100 vezes. O trabalho dele cresce junto? Se cresce, o processo não escala, a não ser que haja automação.</p>
        <Diagram minWidth={560} caption={"Pergunta de ouro: se a empresa for 10× maior, o trabalho de cada pessoa também vira 10×? Se sim, falta automação."}>
          <svg viewBox="0 0 640 250" role="img" aria-label="Gráfico com duas linhas: uma sobe e outra fica reta">
            <path d="M60 20V200H600" className="ln" />
            <text x="330" y="232" className="mut" textAnchor="middle">tamanho da empresa (engenheiros, código, tempo)</text>
            <g transform="rotate(-90 22 110)">
              <text x="22" y="110" className="mut" textAnchor="middle">trabalho por engenheiro</text>
            </g>
            <path d="M60 180C200 170 360 120 590 36" className="ln" />
            <text x="500" y="62" textAnchor="end">política que não escala</text>
            <path d="M60 182H590" className="ln dash" />
            <text x="500" y="172" textAnchor="end">política que escala</text>
            <circle cx="590" cy="36" r="4" className="fill" />
            <circle cx="590" cy="182" r="4" className="fill" />
          </svg>
        </Diagram>
        <h3>Dois exemplos de política que não escala</h3>
        <ul className="ds-list">
          <li><em>Descontinuar assim:</em> “vamos apagar o Widget antigo em 15 de agosto; migrem para o novo.” Com poucos times funciona. Com milhares, cada time gasta um tempo aprendendo a migrar, resolve só o seu caso e descarta o que aprendeu.</li>
          <li><em>Branches longas por time ou por feature:</em> cada merge obriga todo mundo a ressincronizar e retestar. Com 5 a 10 branches dá para viver; com centenas, o custo explode.</li>
        </ul>
        <h3>E o que escala</h3>
        <ul className="ds-list">
          <li><em>A Regra da Rotatividade (Churn Rule):</em> quem muda a infraestrutura é quem migra os usuários, ou mantém a compatibilidade. Um grupo de especialistas faz o trabalho uma vez, bem feito, em vez de cada time fazer mal.</li>
          <li><em>A Regra da Beyoncé:</em> “se você gostou, devia ter posto um teste”. Se uma mudança de infraestrutura quebra seu produto mas nenhum teste do CI avisou, a culpa não é de quem mudou. Isso permite que times de infra mexam no código de todos sem perguntar um a um.</li>
          <li><em>Trabalho frequente fica barato:</em> o Google demorou a atualizar um compilador em 2006 (foi doloroso, anos sem trocar). Para algumas linguagens, hoje atualiza a cada uma ou duas semanas. Quanto mais se faz, mais se automatiza e menos código frágil sobra.</li>
        </ul>
        <Callout tone="good" icon="check">Moral: parar no tempo é uma opção, mas raramente sábia. Sem atualizações você fica sem correções de segurança e sem ganhos de eficiência. O que protege é <em>praticar</em> a mudança até ela ficar barata.</Callout>
      </Section>
      <Section id="shift" title={"Trade-offs, custos e “shift left”"}>
        <p>Decidir é pesar custos, e o livro lembra que custo não é só dinheiro:</p>
        <ul className="ds-list">
          <li><em>Financeiro</em> (dinheiro), <em>de recursos</em> (CPU, memória) e <em>de pessoas</em> (horas de engenharia);</li>
          <li><em>De transação</em> (quanto custa agir) e <em>de oportunidade</em> (quanto custa <em>não</em> agir);</li>
          <li><em>Social</em>: em escala de bilhões de usuários, pequenas falhas de acessibilidade ou de justiça viram grandes danos.</li>
        </ul>
        <p>Exemplo do livro: marcadores de quadro branco. Em muitas empresas eles são raros e trancados, e metade está seca. No Google há armários abertos cheios deles. A troca é consciente: custa menos que um dólar o marcador, e atrapalhar um brainstorming custa muito mais do que alguns marcadores levados embora. Esse é o tipo de conta que o livro quer que você faça, de olhos abertos.</p>
        <h3>Shift left</h3>
        <p>Imagine a vida de uma mudança numa linha do tempo: design, código, review, teste, commit, canário, produção. Achar um problema mais à <em>esquerda</em> custa menos. Por isso o livro insiste em testes, análise estática e code review antes do commit, em camadas (nenhuma é perfeita, então se usa defesa em profundidade).</p>
        <Diagram minWidth={560} caption={"“Shift left”: levar a detecção de problemas para o começo da linha do tempo."}>
          <svg viewBox="0 0 640 220" role="img" aria-label="Barras crescendo da esquerda para a direita">
            <rect x="20" y="138.0" width="64" height="12.0" className="fillsoft ln" />
            <text x="52" y="172" className="" textAnchor="middle">Design</text>
            <rect x="108" y="135.6" width="64" height="14.4" className="fillsoft ln" />
            <text x="140" y="172" textAnchor="middle">Código</text>
            <rect x="196" y="128.4" width="64" height="21.6" className="fillsoft ln" />
            <text x="228" y="172" className="" textAnchor="middle">Review</text>
            <rect x="284" y="116.4" width="64" height="33.599999999999994" className="fillsoft ln" />
            <text x="316" y="172" textAnchor="middle">Teste</text>
            <rect x="372" y="99.6" width="64" height="50.4" className="fillsoft ln" />
            <text x="404" y="172" className="" textAnchor="middle">Commit</text>
            <rect x="460" y="78.0" width="64" height="72.0" className="fillsoft ln" />
            <text x="492" y="172" textAnchor="middle">Canário</text>
            <rect x="548" y="51.60000000000001" width="64" height="98.39999999999999" className="fill" />
            <text x="580" y="172" textAnchor="middle">Produção</text>
            <path d="M600 34H40" className="ln" />
            <path d="M40 34l9-5M40 34l9 5" className="ln" />
            <text x="320" y="22" textAnchor="middle">achar o problema aqui sai barato</text>
            <text x="320" y="204" className="mut" textAnchor="middle">A altura da barra é o custo de consertar. Quanto mais à esquerda você pega o erro, menos ele custa.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="teams" title={"Equipes e cultura"}>
        <p>A segunda parte do livro vale ouro e quase não tem código. A tese: engenharia de software é um esforço de equipe, e o mito do “gênio solitário” atrapalha.</p>
        <ul className="ds-list">
          <li><em>Não se esconda.</em> Trabalhar sozinho por semanas e só mostrar o resultado pronto é arriscado: você pode gastar tudo na coisa errada. Mostrar cedo traz feedback cedo.</li>
          <li><em>Fator ônibus (bus factor):</em> quantas pessoas precisam “ser atropeladas por um ônibus” para o projeto parar? Compartilhar conhecimento aumenta esse número.</li>
          <li><em>Humildade, respeito e confiança:</em> os três pilares da interação social. Você não é o centro do universo, trata os colegas como pessoas e confia que eles sabem o que fazem.</li>
          <li><em>Post-mortem sem culpados:</em> depois de um incidente, o foco é entender o que falhou no sistema, não quem errou. Assim as pessoas contam a verdade.</li>
          <li><em>Segurança psicológica e compartilhar conhecimento:</em> perguntar deve ser seguro. Documentar, dar palestras e ter um lugar canônico de informação fazem o conhecimento escalar.</li>
        </ul>
        <p>Para quem lidera, o livro resume em três verbos: <em>sempre decidir</em> (achar o melhor trade-off do momento e iterar), <em>sempre sair</em> (montar um time que resolve sozinho, sem depender de você) e <em>sempre escalar</em> (proteger seu tempo e energia à medida que o sucesso traz mais trabalho).</p>
        <p>E, para medir produtividade, use primeiro a pergunta: “se eu medir isto, vou conseguir agir sobre o resultado?”</p>
      </Section>
      <Section id="review" title={"Code review"}>
        <p>No Google toda mudança é revisada por alguém que não é o autor antes de entrar. O livro mostra que revisar serve para mais do que achar bugs: garante que o código seja compreensível, consistente e que o conhecimento circule.</p>
        <Diagram minWidth={560} caption={"Três tipos de aprovação, mas muitas vezes uma só pessoa cumpre os três papéis, o que mantém o processo rápido."}>
          <svg viewBox="0 0 640 170" role="img" aria-label="Autor passando por três aprovações">
            <rect x="10" y="60" width="96" height="46" rx="8" className="ln" />
            <text x="58" y="88" textAnchor="middle">Autor</text>
            <path d="M106 83H150" className="ln" />
            <path d="M144 78l6 5-6 5" className="ln" />
            <rect x="150" y="14" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="38" textAnchor="middle">1. Colega: LGTM</text>
            <rect x="150" y="64" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="88" textAnchor="middle">2. Dono da pasta</text>
            <rect x="150" y="114" width="170" height="40" rx="8" className="ln" />
            <text x="235" y="138" textAnchor="middle">3. “Readability”</text>
            <path d="M320 34H370M320 84H370M320 134H370" className="ln" />
            <path d="M370 34V134" className="ln" />
            <path d="M370 84H410" className="ln" />
            <path d="M404 79l6 5-6 5" className="ln" />
            <rect x="410" y="60" width="130" height="46" rx="8" className="fill" />
            <text x="475" y="88" className="inv" textAnchor="middle">Pode entrar</text>
            <text x="475" y="128" className="mut" textAnchor="middle">uma pessoa pode ter os 3 papéis</text>
          </svg>
        </Diagram>
        <p>As três aprovações: um colega confere se está correto e compreensível (o famoso <em>LGTM</em>, “looks good to me”); o <em>dono</em> da pasta confere se aquilo pertence ali; e alguém com <em>readability</em> naquela linguagem confere o estilo e as boas práticas. Se o autor já é dono e tem readability, só precisa do LGTM do colega.</p>
        <h3>Boas práticas</h3>
        <ul className="ds-list">
          <li><em>Mudanças pequenas:</em> cerca de 200 linhas. São revisadas mais rápido, o bug é mais fácil de localizar e o autor não fica parado esperando.</li>
          <li><em>Primeira resposta em cerca de um dia.</em> Isso não significa terminar em um dia, mas dar um retorno.</li>
          <li><em>Descrição que explica o porquê.</em> A primeira linha vira o título em ferramentas e no histórico; “Bug fix” não ajuda ninguém. A descrição é o registro histórico daquela mudança.</li>
          <li><em>Poucos revisores e muita automação:</em> o que a máquina checa (formato, estilo, testes) não precisa gastar a atenção humana.</li>
          <li><em>Seja educado e profissional.</em> A revisão é também mentoria.</li>
        </ul>
      </Section>
      <Section id="tests" title={"Testes"}>
        <p>O livro conta a história do Google Web Server (GWS), que serve a busca. Em 2005 o projeto tinha ficado travado: mais de 80% dos deploys continham bugs que afetavam usuários e precisavam de rollback.</p>
        <p>O tech lead instituiu testes automatizados obrigatórios para toda mudança. Em um ano, os deploys de emergência caíram pela metade, mesmo com um número recorde de mudanças. Hoje o GWS tem dezenas de milhares de testes e entrega quase todo dia.</p>
        <p>A conta que justifica isso: um time de 100 engenheiros tão bons que cada um erra uma vez por mês ainda produz cerca de <em>5 bugs novos por dia útil</em>. Só automação segura isso.</p>
        <h3>Tamanho e escopo</h3>
        <p>Para o Google, todo teste tem duas dimensões diferentes:</p>
        <ul className="ds-list">
          <li><em>Tamanho</em> é o que o teste consome e pode fazer. <em>Pequeno</em>: um único processo, sem rede, sem disco, sem dormir. <em>Médio</em>: uma máquina (pode subir um banco local). <em>Grande</em>: pode usar várias máquinas.</li>
          <li><em>Escopo</em> é quanto código o teste verifica: estreito (unidade), médio (integração) ou amplo (ponta a ponta).</li>
        </ul>
        <p>Os testes pequenos são rápidos e determinísticos (dão sempre o mesmo resultado). Os grandes são mais lentos e podem ser instáveis. Daí vem a pirâmide: muitos testes estreitos e rápidos na base, poucos de ponta a ponta no topo. O livro avisa para fugir do “sorvete de casquinha” (muitos ponta a ponta, poucos de unidade) e da “ampulheta”.</p>
        <Diagram minWidth={560} caption={"A mistura aproximada que o Google busca (por número de testes). Cada time ajusta a sua."}>
          <svg viewBox="0 0 640 240" role="img" aria-label="Pirâmide de testes em três camadas">
            <path d="M320 16L230 214H410z" className="ln" />
            <path d="M288 86H352M259 150H381" className="ln" />
            <text x="320" y="62" className="" textAnchor="middle">5%</text>
            <text x="320" y="123" className="" textAnchor="middle">15%</text>
            <text x="320" y="187" className="" textAnchor="middle">80%</text>
            <text x="436" y="66">Ponta a ponta: o sistema todo</text>
            <text x="436" y="123">Integração: poucas peças juntas</text>
            <text x="436" y="187">Unidade: uma peça só, rápida</text>
            <text x="204" y="66" className="mut" textAnchor="end">grande: roda onde quiser</text>
            <text x="204" y="123" className="mut" textAnchor="end">média: uma máquina</text>
            <text x="204" y="187" className="mut" textAnchor="end">pequena: um processo</text>
          </svg>
        </Diagram>
        <h3>Testes instáveis (flaky) custam caro</h3>
        <p>Um teste instável às vezes falha sem motivo. Se cada teste tem só 0,1% de chance de falhar à toa e você roda 10.000 por dia, serão <em>10 investigações inúteis por dia</em>. Pior que o tempo perdido é a perda de confiança: perto de 1% de instabilidade, as pessoas passam a ignorar as falhas e a suíte perde o valor. O Google mantém a taxa em torno de 0,15%.</p>
        <h3>Testes legíveis: DAMP em vez de DRY</h3>
        <p>No código normal, “não se repita” (DRY) é bom. No teste, esconder tudo em funções auxiliares obriga o leitor a pular pelo arquivo para entender o que está sendo verificado. O livro prefere <em>DAMP</em>: “Descriptive And Meaningful Phrases”. Um pouco de repetição é aceitável se deixa o teste óbvio ao ler.</p>
        <CodeBlock code={`@Test
public void shouldNotRegisterBannedUsers() {
  User user = newUser().setState(State.BANNED).build();
  Forum forum = new Forum();
  try {
    forum.register(user);
  } catch (BannedUserException ignored) {}
  assertThat(forum.hasRegisteredUser(user)).isFalse();
}`} />
        <p>Outras regras do capítulo de testes unitários: testar pela API pública, testar <em>comportamentos</em> e não métodos, verificar o <em>estado</em> e não as interações, não pôr lógica (if, loops) dentro do teste, e escrever mensagens de falha claras.</p>
        <h3>Dublês de teste: prefira o real</h3>
        <ul className="ds-list">
          <li>1º: use a <em>implementação real</em> sempre que for viável;</li>
          <li>2º: se não der, um <em>fake</em> (uma versão simples e correta, como um banco em memória) é o ideal;</li>
          <li>Evite abusar de <em>stubs</em> e de testes de <em>interação</em> (“esta função foi chamada 2 vezes”): eles amarram o teste à implementação e quebram à toa.</li>
        </ul>
        <p>Além disso, o livro lembra de testar <em>falhas</em>: simular exceções, injetar latência e erros de rede. Cobertura de código (% de linhas executadas) ajuda a achar o que ficou sem teste, mas não prova que o teste verifica algo.</p>
      </Section>
      <Section id="tools" title={"Ferramentas e entrega"}>
        <p>A parte final trata de como a mudança chega à produção sem dor.</p>
        <ul className="ds-list">
          <li><em>Um repositório, uma versão.</em> Controle de versão para tudo que seja maior que um brinquedo. A “regra de uma versão” elimina a pergunta “de qual versão eu dependo?”, que não escala. Desenvolvimento no tronco (trunk-based) é, segundo as pesquisas citadas (DORA), um preditor de organizações de alto desempenho; branches longas não são um bom padrão.</li>
          <li><em>Build como artefatos.</em> Sistemas de build organizados em torno de <em>artefatos</em> (não de tarefas) escalam e são mais confiáveis. Prefira módulos pequenos (aproveitam paralelismo e builds incrementais) e dependências externas com versão explícita, nunca “latest”.</li>
          <li><em>Análise estática no fluxo normal.</em> Ferramentas que apontam padrões de bug devem aparecer no code review, com correção sugerida, e ter poucos falsos positivos; senão as pessoas as ignoram.</li>
          <li><em>Dependências são contratos.</em> Adicionar uma dependência não é de graça: há um custo contínuo de confiança e manutenção. O versionamento semântico (SemVer) é só uma estimativa de risco, não uma garantia.</li>
          <li><em>Mudanças em larga escala (LSC).</em> Com um processo próprio, dá para mudar milhares de arquivos de uma vez (por exemplo, renomear uma API). O refatoramento tradicional não aguenta essa escala.</li>
        </ul>
        <h3>Integração e entrega contínuas</h3>
        <p>O CI decide quais testes rodar e quando. Antes do commit (<em>pré-submit</em>) rodam testes rápidos e confiáveis; depois (<em>pós-submit</em>), os mais lentos.</p>
        <p>Na entrega contínua, o livro destaca: <em>feature flags</em> para isolar mudanças, <em>rollout em etapas</em> (canário) porque o mundo real é mais diverso que o ambiente de teste, medir se o recurso é usado, e a ideia de que <em>mais rápido é mais seguro</em>: entregas pequenas e frequentes têm menos risco cada.</p>
        <Diagram minWidth={560} caption={"O caminho de uma mudança até os usuários: testes rápidos antes, testes pesados depois, e liberação gradual."}>
          <svg viewBox="0 0 640 200" role="img" aria-label="Fluxo de integração e entrega contínuas">
            <rect x="4" y="30" width="114" height="52" rx="8" className="ln" />
            <text x="61" y="52" textAnchor="middle">Pré-submit</text>
            <text x="61" y="70" className="mut" textAnchor="middle">rápido, estável</text>
            <path d="M118 56H142" className="ln" />
            <path d="M136 51l6 5-6 5" className="ln" />
            <rect x="142" y="30" width="80" height="52" rx="8" className="fill" />
            <text x="182" y="62" className="inv" textAnchor="middle">Commit</text>
            <path d="M222 56H246" className="ln" />
            <path d="M240 51l6 5-6 5" className="ln" />
            <rect x="246" y="30" width="130" height="52" rx="8" className="ln" />
            <text x="311" y="52" textAnchor="middle">Pós-submit</text>
            <text x="311" y="70" className="mut" textAnchor="middle">lento, completo</text>
            <path d="M376 56H400" className="ln" />
            <path d="M394 51l6 5-6 5" className="ln" />
            <rect x="400" y="30" width="110" height="52" rx="8" className="ln" />
            <text x="455" y="52" textAnchor="middle">Canário</text>
            <text x="455" y="70" className="mut" textAnchor="middle">poucos usuários</text>
            <path d="M510 56H534" className="ln" />
            <path d="M528 51l6 5-6 5" className="ln" />
            <rect x="534" y="30" width="102" height="52" rx="8" className="ln" />
            <text x="585" y="52" textAnchor="middle">Todos</text>
            <text x="585" y="70" className="mut" textAnchor="middle">aos poucos</text>
            <path d="M61 100V122H585V100" className="ln dash" />
            <text x="320" y="146" textAnchor="middle">Feature flags: o código chega à produção desligado e é ligado de forma controlada</text>
            <text x="320" y="180" className="mut" textAnchor="middle">Entregas pequenas e frequentes: quanto menor a mudança, menor o risco de cada uma.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="apply" title={"Como aplicar no seu projeto"}>
        <p>Você não precisa ser o Google para usar as ideias. Um roteiro bem pequeno, em ordem de retorno:</p>
        <ol className="ds-steps">
          <li>Escreva testes pequenos e rápidos para as regras de negócio, e faça o CI rodá-los a cada push. Exija teste junto de toda correção de bug.</li>
          <li>Revise em mudanças pequenas e descreva o <em>porquê</em> no commit.</li>
          <li>Prefira o tronco e branches curtas; esconda trabalho incompleto atrás de uma feature flag.</li>
          <li>Fixe versões de dependências e atualize com frequência, em vez de a cada cinco anos.</li>
          <li>Documente decisões e escreva post-mortems sem culpados.</li>
          <li>Em cada processo repetido, pergunte: se a equipe for 10× maior, isto ainda cabe? Se não, automatize.</li>
        </ol>
        <Callout tone="personal" icon="check">Anotação pessoal: este resumo segue a ordem do livro, mas escolhe e simplifica. Os números e citações (80% de pushes ruins no GWS, 0,15% de testes instáveis, 200 linhas por mudança, 80/15/5 de testes) vêm do texto; os exemplos marcados como inventados são meus.</Callout>
      </Section>
      <div className="sources">
        <b>Fonte</b>
        <ul>
          <li><a href="https://abseil.io/resources/swe-book" rel="noopener">Titus Winters, Tom Manshreck, Hyrum Wright (eds.). Software Engineering at Google. O’Reilly, 2020.</a></li>
        </ul>
      </div>
    </>
  );
}
