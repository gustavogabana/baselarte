import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "attention-is-all-you-need",
  title: "Transformers: Attention Is All You Need explicado",
  seo: {
    title: "Attention Is All You Need, explicado",
    description: "Um guia em linguagem simples do paper Attention Is All You Need: queries, keys e values, atenção por produto escalar e multi-cabeça, codificação posicional, arquitetura encoder-decoder, máscara, treino, resultados e um exemplo de código executável.",
  },
  summary: "um guia em linguagem simples do artigo do Transformer: queries, keys e values, atenção scaled dot-product e multi-head com contas pequenas, positional encoding, a arquitetura encoder-decoder, máscaras, treinamento, resultados e um exemplo de código para rodar.",
  kicker: "Paper explicado",
  heroTitle: <>Attention Is All You Need, <em>explicado do zero.</em></>,
  heroLede: "O paper que introduziu o Transformer, em linguagem simples: queries, keys e values, a atenção passo a passo com números pequenos, atenção multi-cabeça, codificação posicional, a arquitetura completa, treino, resultados e código.",
  published: "2026-10-21",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "why", title: "O problema que o paper resolve" },
        { id: "intuition", title: "A intuição: atenção como uma busca em biblioteca" },
        { id: "sdpa", title: "Scaled dot-product attention: a fórmula passo a passo" },
        { id: "multihead", title: "Multi-head attention: várias atenções em paralelo" },
        { id: "position", title: "Posição: como o modelo sabe a ordem das palavras" },
        { id: "architecture", title: "A arquitetura completa do Transformer" },
        { id: "mask", title: "Máscara: o decoder não pode espiar o futuro" },
        { id: "walk", title: "Passeio completo: traduzindo “I love you”" },
        { id: "compare", title: "Por que a auto-atenção? (Tabela 1 do paper)" },
        { id: "results", title: "Treino e resultados" },
        { id: "ablation", title: "O que realmente importa? As ablações (Tabela 3)" },
        { id: "code", title: "Em código: atenção em 15 linhas" },
        { id: "legacy", title: "Depois do paper: o que veio a seguir" },
        { id: "cheat-att", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="why" title={"O problema que o paper resolve"}>
        <p>Em 2017, os melhores modelos de tradução e de texto usavam <strong>redes recorrentes</strong> (RNN, LSTM, GRU). Elas leem a frase <em>uma palavra por vez</em>, da esquerda para a direita, carregando um “resumo” do que já leram.</p>
        <p>Isso tem dois custos: (1) <strong>não dá para paralelizar</strong> dentro de uma frase, porque a palavra 5 só pode ser processada depois da 4; (2) informação de palavras distantes precisa atravessar muitos passos e vai se perdendo.</p>
        <Diagram minWidth={620} caption={"Em cima, a RNN: uma fila. Embaixo, a atenção: ligações diretas entre quaisquer duas palavras."}>
          <svg viewBox="0 0 700 250" role="img" aria-label="RNN vs. atenção">
            <text x="20" y="28" className="mono" textAnchor="start">RNN</text>
            <text x="20" y="48" className="mut" textAnchor="start">Cada palavra espera a anterior</text>
            <rect x="40" y="64" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="80" y="84" textAnchor="middle">The</text>
            <rect x="170" y="64" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="210" y="84" textAnchor="middle">cat</text>
            <path d="M120 79L170 79" className="ln" />
            <path d="M163.7 82.0L170 79L163.7 76.0" className="ln" />
            <rect x="300" y="64" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="340" y="84" textAnchor="middle">sat</text>
            <path d="M250 79L300 79" className="ln" />
            <path d="M293.7 82.0L300 79L293.7 76.0" className="ln" />
            <rect x="430" y="64" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="470" y="84" textAnchor="middle">on</text>
            <path d="M380 79L430 79" className="ln" />
            <path d="M423.7 82.0L430 79L423.7 76.0" className="ln" />
            <rect x="560" y="64" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="600" y="84" textAnchor="middle">mat</text>
            <path d="M510 79L560 79" className="ln" />
            <path d="M553.7 82.0L560 79L553.7 76.0" className="ln" />
            <text x="20" y="140" className="mono" textAnchor="start">Attention</text>
            <text x="20" y="160" className="mut" textAnchor="start">Toda palavra olha para todas, ao mesmo tempo</text>
            <rect x="40" y="200" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="80" y="220" textAnchor="middle">The</text>
            <rect x="170" y="200" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="210" y="220" textAnchor="middle">cat</text>
            <rect x="300" y="200" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="340" y="220" textAnchor="middle">sat</text>
            <rect x="430" y="200" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="470" y="220" textAnchor="middle">on</text>
            <rect x="560" y="200" width="80" height="30" rx="4" className="ln fillsoft" />
            <text x="600" y="220" textAnchor="middle">mat</text>
            <path d="M80 200Q145.0 144 210 200" className="ln" fill="none" opacity="0.55" />
            <path d="M80 200Q210.0 138 340 200" className="ln" fill="none" opacity="0.55" />
            <path d="M80 200Q275.0 132 470 200" className="ln" fill="none" opacity="0.55" />
            <path d="M80 200Q340.0 126 600 200" className="ln" fill="none" opacity="0.55" />
            <path d="M210 200Q275.0 144 340 200" className="ln" fill="none" opacity="0.55" />
            <path d="M210 200Q340.0 138 470 200" className="ln" fill="none" opacity="0.55" />
            <path d="M210 200Q405.0 132 600 200" className="ln" fill="none" opacity="0.55" />
            <path d="M340 200Q405.0 144 470 200" className="ln" fill="none" opacity="0.55" />
            <path d="M340 200Q470.0 138 600 200" className="ln" fill="none" opacity="0.55" />
            <path d="M470 200Q535.0 144 600 200" className="ln" fill="none" opacity="0.55" />
          </svg>
        </Diagram>
        <p>A ideia do paper cabe no título: <strong>“Attention Is All You Need”</strong> (“atenção é tudo de que você precisa”). Os autores propõem o <strong>Transformer</strong>, uma arquitetura que <em>abandona a recorrência e a convolução</em> e usa só <strong>mecanismos de atenção</strong> para relacionar as palavras entre si.</p>
        <p>O resultado: treina bem mais rápido (a atenção é toda feita com multiplicações de matrizes, ótimas para GPU) e traduz melhor.</p>
        <Callout icon="check"><strong>Como ler esta nota.</strong> As seções seguem a ordem do paper (seção 3, “Model Architecture”, é o coração). Os números e fórmulas vêm do próprio paper (Vaswani et al., 2017, arXiv:1706.03762); os exemplos numéricos pequenos são meus, calculados à mão para você acompanhar. Quando algo não está no paper, está marcado.</Callout>
      </Section>
      <Section id="intuition" title={"A intuição: atenção como uma busca em biblioteca"}>
        <p>Imagine uma biblioteca. Você chega com uma <strong>pergunta</strong> (Query). Cada livro tem um <strong>título na lombada</strong> (Key) e um <strong>conteúdo</strong> (Value). Você compara sua pergunta com todas as lombadas, decide “esse combina 70%, aquele 25%, aquele 5%” e leva uma <em>mistura</em> dos conteúdos, na proporção dessas notas. Isso é atenção.</p>
        <Diagram minWidth={620} caption={"Query, Key e Value: a Query pontua cada Key; as pontuações viram pesos que misturam os Values."}>
          <svg viewBox="0 0 700 190" role="img" aria-label="Analogia de Q, K e V">
            <rect x="10" y="20" width="150" height="60" rx="4" className="brandfill" />
            <text x="85" y="45" textAnchor="middle">Query (Q)</text>
            <text x="85" y="65" className="mut" textAnchor="middle">“o que eu procuro?”</text>
            <rect x="270" y="10" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="345" y="32" textAnchor="middle">Key (K): título 1</text>
            <rect x="270" y="50" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="345" y="72" textAnchor="middle">Key (K): título 2</text>
            <rect x="270" y="90" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="345" y="112" textAnchor="middle">Key (K): título 3</text>
            <rect x="530" y="10" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="605" y="32" textAnchor="middle">Value (V): conteúdo 1</text>
            <rect x="530" y="50" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="605" y="72" textAnchor="middle">Value (V): conteúdo 2</text>
            <rect x="530" y="90" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="605" y="112" textAnchor="middle">Value (V): conteúdo 3</text>
            <path d="M160 50L270 27" className="ln" />
            <path d="M264.5 31.3L270 27L263.2 25.3" className="ln" />
            <path d="M160 50L270 67" className="ln" />
            <path d="M263.3 69.0L270 67L264.2 63.0" className="ln" />
            <path d="M160 50L270 107" className="ln" />
            <path d="M263.0 106.8L270 107L265.8 101.4" className="ln" />
            <path d="M420 27L530 27" className="ln" />
            <path d="M523.7 30.0L530 27L523.7 24.0" className="ln" />
            <path d="M420 67L530 67" className="ln" />
            <path d="M523.7 70.0L530 67L523.7 64.0" className="ln" />
            <path d="M420 107L530 107" className="ln" />
            <path d="M523.7 110.0L530 107L523.7 104.0" className="ln" />
            <text x="215" y="150" className="mut" textAnchor="middle">compara a Query com cada Key → pesos (somam 1)</text>
            <text x="560" y="150" className="mut" textAnchor="middle">mistura os Values usando esses pesos</text>
            <text x="350" y="182" className="mut" textAnchor="middle">Resultado: um “resumo” dos Values, mais parecido com os que combinam com a Query.</text>
          </svg>
        </Diagram>
        <h3>Um exemplo em linguagem natural</h3>
        <p>Na frase <em>“O animal não atravessou a rua porque <strong>ele</strong> estava cansado”</em>, a palavra “ele” precisa descobrir a quem se refere. Na atenção, “ele” faz uma Query; todas as palavras oferecem Keys; “animal” recebe a nota mais alta e passa seu Value para “ele”.</p>
        <p>A representação de “ele” passa a carregar o significado de “animal”. (O paper mostra figuras assim no apêndice, com pesos de atenção reais.)</p>
        <p><strong>Self-attention</strong> (auto-atenção) é quando Query, Key e Value vêm <em>da mesma frase</em>: cada palavra consulta todas as outras da própria frase (e a si mesma). É isso que substitui a recorrência.</p>
      </Section>
      <Section id="sdpa" title={"Scaled dot-product attention: a fórmula passo a passo"}>
        <p>Esta é a equação central do paper (a número 1). Em matrizes: <code>Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V</code>. Vamos desmontá-la.</p>
        <Diagram minWidth={640} caption={"O pipeline da atenção: cinco operações simples."}>
          <svg viewBox="0 0 700 130" role="img" aria-label="Etapas da atenção scaled dot-product">
            <rect x="10" y="25" width="115" height="60" rx="4" className="brandfill" />
            <text x="67" y="52" className="mono" textAnchor="middle">Q · Kᵀ</text>
            <text x="67" y="72" className="mut" textAnchor="middle">pontuações</text>
            <path d="M125 55L148 55" className="ln" />
            <path d="M141.7 58.0L148 55L141.7 52.0" className="ln" />
            <rect x="148" y="25" width="115" height="60" rx="4" className="ln fillsoft" />
            <text x="205" y="52" className="mono" textAnchor="middle">÷ √dₖ</text>
            <text x="205" y="72" className="mut" textAnchor="middle">escala</text>
            <path d="M263 55L286 55" className="ln" />
            <path d="M279.7 58.0L286 55L279.7 52.0" className="ln" />
            <rect x="286" y="25" width="115" height="60" rx="4" className="ln fillsoft" />
            <text x="343" y="52" className="mono" textAnchor="middle">máscara</text>
            <text x="343" y="72" className="mut" textAnchor="middle">(só no decoder)</text>
            <path d="M401 55L424 55" className="ln" />
            <path d="M417.7 58.0L424 55L417.7 52.0" className="ln" />
            <rect x="424" y="25" width="115" height="60" rx="4" className="brandfill" />
            <text x="481" y="52" className="mono" textAnchor="middle">softmax</text>
            <text x="481" y="72" className="mut" textAnchor="middle">pesos, soma 1</text>
            <path d="M539 55L562 55" className="ln" />
            <path d="M555.7 58.0L562 55L555.7 52.0" className="ln" />
            <rect x="562" y="25" width="115" height="60" rx="4" className="ln fillsoft" />
            <text x="619" y="52" className="mono" textAnchor="middle">× V</text>
            <text x="619" y="72" className="mut" textAnchor="middle">mistura</text>
            <text x="350" y="115" className="mono" textAnchor="middle">Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V — equação (1) do paper</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><strong>Q·Kᵀ:</strong> o produto escalar entre a Query de uma palavra e a Key de cada palavra mede “o quanto combinam” (quanto maior, mais parecidas). Como Q e K são matrizes, uma multiplicação calcula <em>todas</em> as combinações de uma vez: uma tabela n × n.</li>
          <li><strong>÷ √dₖ:</strong> divide pelo tamanho do vetor de Key. Explicado logo abaixo.</li>
          <li><strong>softmax:</strong> transforma cada linha de pontuações em <em>pesos positivos que somam 1</em> (como porcentagens). Pontuações altas viram pesos grandes.</li>
          <li><strong>× V:</strong> cada palavra recebe a média dos Values de todas as palavras, ponderada por esses pesos.</li>
        </ol>
        <h3>Exemplo numérico minúsculo</h3>
        <p>Frase de 3 palavras, vetores de 2 números (dₖ = 2), e para simplificar Q = K = V = o próprio vetor da palavra: <code>the = [1, 0]</code>, <code>cat = [0, 1]</code>, <code>sleeps = [1, 1]</code>. Para a query “sleeps”: produtos escalares com cada palavra = 1, 1 e 2; dividindo por √2 ≈ 1,41 dá 0,71, 0,71 e 1,41; o softmax dá pesos 0,25, 0,25 e 0,50. A saída é 0,25·[1,0] + 0,25·[0,1] + 0,50·[1,1] = <strong>[0,75 ; 0,75]</strong>.</p>
        <Table
          head={["Palavra (query)", "Pontuações vs. the, cat, sleeps", "Pesos (softmax)", "Saída"]}
          rows={[
            ["the", "0,71 · 0,00 · 0,71", "0,40 · 0,20 · 0,40", "[0,80 ; 0,60]"],
            ["cat", "0,00 · 0,71 · 0,71", "0,20 · 0,40 · 0,40", "[0,60 ; 0,80]"],
            ["sleeps", "0,71 · 0,71 · 1,41", "0,25 · 0,25 · 0,50", "[0,75 ; 0,75]"],
          ]}
        />
        <p>Repare: “sleeps” deu o maior peso a si mesma (0,50) porque seu vetor é o mais “forte”. Num modelo real, Q, K e V são <em>projeções aprendidas</em> do vetor da palavra, então o modelo aprende o que consultar, o que anunciar e o que entregar.</p>
        <h3>Por que dividir por √dₖ?</h3>
        <p>O paper explica em uma nota de rodapé: se os componentes de q e k são variáveis independentes com média 0 e variância 1, o produto escalar q·k (soma de dₖ termos) tem média 0 e <strong>variância dₖ</strong>. Com dₖ = 64, os números ficam em torno de ±8 ou mais; o softmax de números tão grandes “satura” (um peso quase 1, o resto quase 0) e o gradiente fica minúsculo, o que dificulta o treino. Dividir por √dₖ devolve a variância para 1. É o “scaled” do nome.</p>
        <Callout icon="check">O paper compara com a <strong>atenção aditiva</strong> (uma pequena rede neural para pontuar). Teoricamente parecidas, mas a atenção por produto escalar é bem mais rápida e usa menos memória na prática, porque é só multiplicação de matrizes.</Callout>
      </Section>
      <Section id="multihead" title={"Multi-head attention: várias atenções em paralelo"}>
        <p>Uma única atenção tira uma <em>média</em> sobre as palavras, e isso mistura tudo num só “ponto de vista”. O paper propõe rodar <strong>h atenções em paralelo</strong>, cada uma com suas próprias projeções aprendidas, e juntar os resultados. Cada cabeça pode se especializar numa relação: uma olha o sujeito do verbo, outra o adjetivo vizinho, outra a referência de um pronome.</p>
        <Diagram minWidth={620} caption={"Cada cabeça projeta x com matrizes próprias, faz a atenção, e os resultados são concatenados e projetados por Wᴼ."}>
          <svg viewBox="0 0 700 230" role="img" aria-label="Atenção multi-head">
            <rect x="10" y="85" width="90" height="50" rx="4" className="ln fillsoft" />
            <text x="55" y="115" className="mono" textAnchor="middle">x</text>
            <rect x="160" y="20" width="150" height="44" rx="4" className="brandfill" />
            <text x="235" y="39" textAnchor="middle">cabeça 1</text>
            <text x="235" y="55" className="mut" textAnchor="middle">Wq,Wk,Wv próprios</text>
            <path d="M100 110L160 42" className="ln" />
            <path d="M158.1 48.7L160 42L153.5 44.7" className="ln" />
            <path d="M310 42L380 110" className="ln" />
            <path d="M373.4 107.8L380 110L377.6 103.4" className="ln" />
            <rect x="160" y="82" width="150" height="44" rx="4" className="brandfill" />
            <text x="235" y="101" textAnchor="middle">cabeça 2</text>
            <text x="235" y="117" className="mut" textAnchor="middle">Wq,Wk,Wv próprios</text>
            <path d="M100 110L160 104" className="ln" />
            <path d="M154.0 107.7L160 104L153.4 101.6" className="ln" />
            <path d="M310 104L380 110" className="ln" />
            <path d="M373.5 112.5L380 110L374.0 106.4" className="ln" />
            <rect x="160" y="144" width="150" height="44" rx="4" className="brandfill" />
            <text x="235" y="163" textAnchor="middle">cabeça 3</text>
            <text x="235" y="179" className="mut" textAnchor="middle">Wq,Wk,Wv próprios</text>
            <path d="M100 110L160 166" className="ln" />
            <path d="M153.3 163.9L160 166L157.5 159.5" className="ln" />
            <path d="M310 166L380 110" className="ln" />
            <path d="M377.0 116.3L380 110L373.2 111.6" className="ln" />
            <text x="235" y="200" textAnchor="middle">…</text>
            <text x="235" y="222" className="mut" textAnchor="middle">h = 8 cabeças</text>
            <rect x="380" y="85" width="110" height="50" rx="4" className="ln fillsoft" />
            <text x="435" y="115" textAnchor="middle">concatena</text>
            <path d="M490 110L520 110" className="ln" />
            <path d="M513.7 113.0L520 110L513.7 107.0" className="ln" />
            <rect x="520" y="85" width="90" height="50" rx="4" className="ln fillsoft" />
            <text x="565" y="115" className="mono" textAnchor="middle">Wᴼ</text>
            <path d="M610 110L640 110" className="ln" />
            <path d="M633.7 113.0L640 110L633.7 107.0" className="ln" />
            <rect x="640" y="85" width="50" height="50" rx="4" className="ln" />
            <text x="665" y="115" textAnchor="middle">out</text>
          </svg>
        </Diagram>
        <Table
          head={["Item", "Valor no paper (modelo base)", "O que significa"]}
          rows={[
            ["d_model", "512", "tamanho do vetor que representa cada palavra, em todo o modelo"],
            ["h", "8", "número de cabeças"],
            ["d_k = d_v", "64 (= 512 / 8)", "cada cabeça trabalha com vetores menores"],
          ]}
        />
        <p>Detalhe esperto: como cada cabeça usa vetores de 64 (e não 512), o <strong>custo total é parecido com o de uma atenção única</strong> de 512. Você ganha vários pontos de vista quase de graça. Fórmula do paper: <code>MultiHead(Q,K,V) = Concat(head₁,…,head_h)·Wᴼ</code>, com <code>head_i = Attention(Q·Wᵢᵠ, K·Wᵢᴷ, V·Wᵢⱽ)</code>.</p>
        <p>O experimento do paper (Tabela 3, linha A) confirma: com 1 cabeça, o BLEU é 0,9 pior que o melhor ajuste; mas com cabeças demais (32) também piora. Há um ponto ótimo (8 ou 16).</p>
      </Section>
      <Section id="position" title={"Posição: como o modelo sabe a ordem das palavras"}>
        <p>Há um problema: a atenção trata a frase como um <em>conjunto</em>. Se você embaralhar as palavras, as contas de Q·Kᵀ dão os mesmos números só que reordenados. “O cão mordeu o homem” e “O homem mordeu o cão” pareceriam iguais. Sem recorrência, o modelo não tem noção de ordem, então o paper <strong>soma ao vetor de cada palavra um vetor de posição</strong>.</p>
        <CodeBlock code={`PE(pos, 2i)   = sin( pos / 10000^(2i / d_model) )
PE(pos, 2i+1) = cos( pos / 10000^(2i / d_model) )`} />
        <p><code>pos</code> é a posição da palavra (0, 1, 2…) e <code>i</code> indexa a dimensão do vetor. Cada dimensão é uma onda (seno ou cosseno) de comprimento diferente: as primeiras oscilam rápido, as últimas devagar, como os ponteiros de segundos, minutos e horas de um relógio. A combinação de todos os “ponteiros” identifica cada posição de forma única. Exemplo com d_model = 4:</p>
        <Table
          head={["Posição", "dim 0 (sin)", "dim 1 (cos)", "dim 2 (sin)", "dim 3 (cos)"]}
          rows={[
            ["0", "0,000", "1,000", "0,000", "1,000"],
            ["1", "0,841", "0,540", "0,010", "1,000"],
            ["2", "0,909", "−0,416", "0,020", "1,000"],
          ]}
        />
        <p>Por que senos? O paper levanta a hipótese de que isso facilita o modelo a aprender a atender por <strong>posição relativa</strong>, pois, para qualquer deslocamento fixo k, PE(pos+k) é uma função linear de PE(pos).</p>
        <p>Os autores também testaram <em>embeddings de posição aprendidos</em> e obtiveram resultados quase idênticos (Tabela 3, linha E); escolheram os senoidais porque podem extrapolar para frases mais longas que as vistas no treino.</p>
        <Callout icon="check">Os vetores de posição têm o mesmo tamanho (d_model) dos embeddings das palavras e são <strong>somados</strong>, não concatenados. Os embeddings das palavras ainda são multiplicados por √d_model antes da soma (seção 3.4).</Callout>
      </Section>
      <Section id="architecture" title={"A arquitetura completa do Transformer"}>
        <p>O Transformer segue o desenho clássico de <strong>encoder-decoder</strong>: o encoder lê a frase de entrada e a transforma em representações ricas; o decoder usa essas representações para gerar a saída uma palavra por vez. Cada um é uma <strong>pilha de N = 6 camadas idênticas</strong>.</p>
        <Diagram minWidth={640} caption={"Encoder à esquerda, decoder à direita. A seta do meio é a “memória” que o decoder consulta."}>
          <svg viewBox="0 0 700 430" role="img" aria-label="Arquitetura do Transformer">
            <text x="165" y="22" className="mono" textAnchor="middle">ENCODER ×6</text>
            <text x="525" y="22" className="mono" textAnchor="middle">DECODER ×6</text>
            <rect x="60" y="40" width="210" height="300" rx="4" className="ln" />
            <rect x="80" y="60" width="170" height="50" rx="4" className="brandfill" />
            <text x="165" y="80" textAnchor="middle">Feed-forward</text>
            <text x="165" y="98" className="mut" textAnchor="middle">+ Add &amp; Norm</text>
            <rect x="80" y="150" width="170" height="60" rx="4" className="brandfill" />
            <text x="165" y="172" textAnchor="middle">Self-attention</text>
            <text x="165" y="188" className="mut" textAnchor="middle">multi-cabeça</text>
            <text x="165" y="204" className="mut" textAnchor="middle">+ Add &amp; Norm</text>
            <path d="M165 150L165 110" className="ln" />
            <path d="M168.0 116.3L165 110L162.0 116.3" className="ln" />
            <rect x="420" y="40" width="210" height="350" rx="4" className="ln" />
            <rect x="440" y="55" width="170" height="45" rx="4" className="brandfill" />
            <text x="525" y="75" textAnchor="middle">Feed-forward</text>
            <text x="525" y="92" className="mut" textAnchor="middle">+ Add &amp; Norm</text>
            <rect x="440" y="118" width="170" height="68" rx="4" className="brandfill" />
            <text x="525" y="138" textAnchor="middle">Atenção encoder-decoder</text>
            <text x="525" y="155" className="mut" textAnchor="middle">Q: decoder · K,V: encoder</text>
            <text x="525" y="175" className="mut" textAnchor="middle">+ Add &amp; Norm</text>
            <rect x="440" y="205" width="170" height="60" rx="4" className="brandfill" />
            <text x="525" y="227" textAnchor="middle">Self-attention mascarada</text>
            <text x="525" y="243" className="mut" textAnchor="middle">não vê o futuro</text>
            <text x="525" y="259" className="mut" textAnchor="middle">+ Add &amp; Norm</text>
            <path d="M525 205L525 186" className="ln" />
            <path d="M528.0 192.3L525 186L522.0 192.3" className="ln" />
            <path d="M525 118L525 100" className="ln" />
            <path d="M528.0 106.3L525 100L522.0 106.3" className="ln" />
            <path d="M270 100L440 152" className="ln" />
            <path d="M433.1 153.1L440 152L434.9 147.2" className="ln" />
            <text x="345" y="95" className="mut" textAnchor="middle">memória do encoder</text>
            <rect x="80" y="270" width="170" height="34" rx="4" className="ln fillsoft" />
            <text x="165" y="291" textAnchor="middle">Embedding + posição</text>
            <path d="M165 270L165 210" className="ln" />
            <path d="M168.0 216.3L165 210L162.0 216.3" className="ln" />
            <rect x="440" y="300" width="170" height="34" rx="4" className="ln fillsoft" />
            <text x="525" y="321" textAnchor="middle">Embedding + posição</text>
            <path d="M525 300L525 265" className="ln" />
            <path d="M528.0 271.3L525 265L522.0 271.3" className="ln" />
            <text x="165" y="375" className="mut" textAnchor="middle">frase de entrada</text>
            <path d="M165 365L165 304" className="ln" />
            <path d="M168.0 310.3L165 304L162.0 310.3" className="ln" />
            <text x="525" y="415" className="mut" textAnchor="middle">palavras já geradas (deslocadas)</text>
            <path d="M525 405L525 334" className="ln" />
            <path d="M528.0 340.3L525 334L522.0 340.3" className="ln" />
          </svg>
        </Diagram>
        <h3>Cada camada do encoder tem 2 sub-blocos</h3>
        <ol className="ds-steps">
          <li><strong>Self-attention multi-cabeça:</strong> cada palavra olha todas as outras da frase de entrada.</li>
          <li><strong>Rede feed-forward por posição:</strong> <code>FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂</code>. Duas camadas lineares com ReLU no meio (512 → 2048 → 512), aplicadas <em>igualmente a cada palavra</em>, separadamente. É onde o modelo “pensa” sobre o que a atenção juntou.</li>
        </ol>
        <p>Em volta de cada sub-bloco há uma <strong>conexão residual</strong> (soma-se a entrada à saída: <code>x + Sublayer(x)</code>) seguida de <strong>normalização de camada</strong> (LayerNorm). Isso ajuda o treino de redes profundas: o sinal original sempre passa direto. É o “Add &amp; Norm” do desenho.</p>
        <h3>O decoder tem 3 sub-blocos</h3>
        <ol className="ds-steps">
          <li><strong>Self-attention mascarada:</strong> cada palavra gerada só pode olhar as <em>anteriores</em> (veja abaixo).</li>
          <li><strong>Atenção encoder-decoder:</strong> as Queries vêm do decoder; as Keys e Values vêm da saída do encoder. É assim que, ao gerar “gato”, o decoder consulta a frase original.</li>
          <li><strong>Feed-forward</strong>, igual ao do encoder.</li>
        </ol>
        <p>Por fim, a saída do decoder passa por uma camada linear e um <strong>softmax</strong>, que dá a probabilidade de cada palavra do vocabulário ser a próxima. O paper reaproveita a mesma matriz de pesos para os embeddings de entrada, de saída e para essa camada final (seção 3.4).</p>
        <h3>As três formas de uso da atenção (seção 3.2.3)</h3>
        <Table
          head={["Onde", "Q vem de…", "K, V vêm de…", "Para quê"]}
          rows={[
            ["Self-attention do encoder", "camada anterior do encoder", "camada anterior do encoder", "entender a frase de entrada"],
            ["Self-attention mascarada do decoder", "camada anterior do decoder", "camada anterior do decoder", "gerar sem “colar” do futuro"],
            ["Atenção encoder-decoder", "camada anterior do decoder", "saída do encoder", "alinhar saída com entrada"],
          ]}
        />
      </Section>
      <Section id="mask" title={"Máscara: o decoder não pode espiar o futuro"}>
        <p>Ao <em>treinar</em>, o modelo recebe a frase de saída inteira de uma vez (para ser rápido). Se cada palavra pudesse olhar as seguintes, ela “copiaria a resposta”. Para impedir, o paper (seção 3.2.3) coloca <strong>−∞ nas pontuações das posições futuras antes do softmax</strong>; como e^(−∞) = 0, o peso delas vira exatamente zero.</p>
        <Diagram minWidth={620} caption={"Matriz de atenção do decoder: cada linha só enxerga até a diagonal."}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Máscara causal">
            <text x="230" y="40" className="mono" textAnchor="middle">&lt;s&gt;</text>
            <text x="150" y="85" className="mono" textAnchor="end">&lt;s&gt;</text>
            <text x="300" y="40" className="mono" textAnchor="middle">Eu</text>
            <text x="150" y="125" className="mono" textAnchor="end">Eu</text>
            <text x="370" y="40" className="mono" textAnchor="middle">amo</text>
            <text x="150" y="165" className="mono" textAnchor="end">amo</text>
            <text x="440" y="40" className="mono" textAnchor="middle">você</text>
            <text x="150" y="205" className="mono" textAnchor="end">você</text>
            <rect x="200" y="55" width="60" height="32" rx="3" className="brandfill" />
            <text x="230" y="76" textAnchor="middle">✓</text>
            <rect x="270" y="55" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="300" y="76" className="mut" textAnchor="middle">−∞</text>
            <rect x="340" y="55" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="370" y="76" className="mut" textAnchor="middle">−∞</text>
            <rect x="410" y="55" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="440" y="76" className="mut" textAnchor="middle">−∞</text>
            <rect x="200" y="95" width="60" height="32" rx="3" className="brandfill" />
            <text x="230" y="116" textAnchor="middle">✓</text>
            <rect x="270" y="95" width="60" height="32" rx="3" className="brandfill" />
            <text x="300" y="116" textAnchor="middle">✓</text>
            <rect x="340" y="95" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="370" y="116" className="mut" textAnchor="middle">−∞</text>
            <rect x="410" y="95" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="440" y="116" className="mut" textAnchor="middle">−∞</text>
            <rect x="200" y="135" width="60" height="32" rx="3" className="brandfill" />
            <text x="230" y="156" textAnchor="middle">✓</text>
            <rect x="270" y="135" width="60" height="32" rx="3" className="brandfill" />
            <text x="300" y="156" textAnchor="middle">✓</text>
            <rect x="340" y="135" width="60" height="32" rx="3" className="brandfill" />
            <text x="370" y="156" textAnchor="middle">✓</text>
            <rect x="410" y="135" width="60" height="32" rx="3" className="ln fillsoft" />
            <text x="440" y="156" className="mut" textAnchor="middle">−∞</text>
            <rect x="200" y="175" width="60" height="32" rx="3" className="brandfill" />
            <text x="230" y="196" textAnchor="middle">✓</text>
            <rect x="270" y="175" width="60" height="32" rx="3" className="brandfill" />
            <text x="300" y="196" textAnchor="middle">✓</text>
            <rect x="340" y="175" width="60" height="32" rx="3" className="brandfill" />
            <text x="370" y="196" textAnchor="middle">✓</text>
            <rect x="410" y="175" width="60" height="32" rx="3" className="brandfill" />
            <text x="440" y="196" textAnchor="middle">✓</text>
            <text x="10" y="35" className="mut" textAnchor="start">palavra que pergunta ↓</text>
            <text x="410" y="17" className="mut" textAnchor="middle">palavra consultada →</text>
          </svg>
        </Diagram>
        <p>No exemplo numérico anterior, se “cat” fosse a 2ª palavra de um decoder, só enxergaria “the” e “cat”: pontuações 0 e 0,71, pesos 0,33 e 0,67, e “sleeps” teria peso 0. A isso se chama propriedade <strong>auto-regressiva</strong>: cada palavra depende só das anteriores.</p>
      </Section>
      <Section id="walk" title={"Passeio completo: traduzindo “I love you”"}>
        <p>Juntando as peças, veja o que acontece ao traduzir <em>“I love you”</em> para o português. (Valores ilustrativos; o paper não publica essa tradução.)</p>
        <ol className="ds-steps">
          <li><strong>Tokenização.</strong> A frase vira pedaços (o paper usa byte-pair encoding / word-pieces): <code>I | love | you</code>.</li>
          <li><strong>Embedding + posição.</strong> Cada token vira um vetor de 512 números; soma-se o vetor de posição 0, 1, 2.</li>
          <li><strong>Encoder (6 camadas).</strong> Em cada camada, “love” consulta “I” e “you” (quem ama? quem é amado?) e o resultado passa pela FFN. Ao final, cada token tem um vetor que já “sabe” do contexto.</li>
          <li><strong>Decoder, passo 1.</strong> Entra o símbolo de início. A atenção encoder-decoder consulta a memória; o softmax final dá, por exemplo, “Eu” com a maior probabilidade.</li>
          <li><strong>Passo 2.</strong> Entra <code>[início, Eu]</code>. A self-attention mascarada deixa “Eu” ver só a si mesmo; a atenção ao encoder foca em “love”. Sai “amo”.</li>
          <li><strong>Passo 3 e fim.</strong> Entra <code>[início, Eu, amo]</code>, sai “você”, depois um símbolo de fim. Pronto: “Eu amo você”.</li>
        </ol>
        <p>Na <strong>inferência</strong> o decoder gera uma palavra por vez (não dá para paralelizar, porque cada palavra depende da anterior). O paper usa <strong>beam search</strong> com largura 4 e penalidade de comprimento α = 0,6: em vez de escolher só a palavra mais provável a cada passo, mantém as 4 melhores sequências parciais e fica com a melhor no fim.</p>
      </Section>
      <Section id="compare" title={"Por que a auto-atenção? (Tabela 1 do paper)"}>
        <p>A seção 4 compara a auto-atenção com camadas recorrentes e convolucionais em três critérios. n é o tamanho da sequência, d o tamanho do vetor e k o tamanho do kernel da convolução.</p>
        <Table
          head={["Tipo de camada", "Custo por camada", "Operações sequenciais", "Caminho máximo entre 2 palavras"]}
          rows={[
            ["Auto-atenção", "O(n² · d)", "O(1)", "O(1)"],
            ["Recorrente", "O(n · d²)", "O(n)", "O(n)"],
            ["Convolucional", "O(k · n · d²)", "O(1)", "O(logₖ n)"],
            ["Auto-atenção restrita (vizinhança r)", "O(r · n · d)", "O(1)", "O(n/r)"],
          ]}
        />
        <ul>
          <li><strong>Operações sequenciais O(1):</strong> todas as palavras são processadas ao mesmo tempo. Na RNN são n passos em fila. É o ganho de velocidade de treino.</li>
          <li><strong>Caminho máximo O(1):</strong> duas palavras, mesmo muito distantes, se conectam diretamente. Quanto mais curto o caminho, mais fácil aprender dependências de longa distância.</li>
          <li><strong>O preço: n² · d.</strong> Cada palavra se compara com todas, então o custo cresce com o <em>quadrado</em> do tamanho da frase. O paper nota que, para frases típicas de tradução, n é menor que d, então a atenção sai mais barata que a RNN. Para sequências muito longas, sugere a versão restrita.</li>
          <li><strong>Bônus (paper):</strong> as cabeças de atenção costumam aprender comportamentos interpretáveis, ligados à sintaxe e à semântica das frases.</li>
        </ul>
      </Section>
      <Section id="results" title={"Treino e resultados"}>
        <Table
          head={["Item", "No paper"]}
          rows={[
            ["Dados", "WMT 2014 inglês→alemão (≈ 4,5 mi de pares de frases) e inglês→francês (36 mi de frases)"],
            ["Hardware", "1 máquina com 8 GPUs NVIDIA P100"],
            ["Tempo", "Base: 100 mil passos ≈ 12 horas. Big: 300 mil passos ≈ 3,5 dias"],
            ["Lote", "≈ 25 mil tokens de origem e 25 mil de destino por lote"],
            ["Otimizador", "Adam (β₁ = 0,9; β₂ = 0,98; ε = 10⁻⁹)"],
            ["Taxa de aprendizado", "sobe linearmente por 4000 passos (warmup) e depois cai com 1/√passo"],
            ["Regularização", "dropout 0,1 (base) em cada sub-bloco e nas somas de embeddings; label smoothing 0,1"],
          ]}
        />
        <p>O <em>warmup</em> evita que o modelo dê passos enormes e instáveis no começo; o <em>label smoothing</em> impede o modelo de ficar 100% confiante (piora a perplexidade, mas melhora a acurácia e o BLEU, diz o paper).</p>
        <h3>Resultados (Tabela 2)</h3>
        <Table
          head={["Modelo", "BLEU EN→DE", "BLEU EN→FR", "Custo de treino (FLOPs, EN→DE)"]}
          rows={[
            ["GNMT + RL", "24,6", "39,92", "2,3·10¹⁹"],
            ["ConvS2S", "25,16", "40,46", "9,6·10¹⁸"],
            ["MoE", "26,03", "40,56", "2,0·10¹⁹"],
            ["ConvS2S (ensemble)", "26,36", "41,29", "7,7·10¹⁹"],
            [<strong>Transformer (base)</strong>, "27,3", "38,1", "3,3·10¹⁸"],
            [<strong>Transformer (big)</strong>, <><strong>28,4</strong></>, <><strong>41,8</strong></>, "2,3·10¹⁹"],
          ]}
        />
        <p>BLEU é uma nota de 0 a 100 que compara a tradução da máquina com traduções humanas de referência (quanto maior, melhor). No inglês→alemão, o Transformer big superou o melhor resultado anterior, <em>inclusive conjuntos de modelos</em>, em mais de 2 BLEU; mesmo o modelo base superou todos os anteriores, gastando uma fração do custo (≈ 3,3·10¹⁸ FLOPs, contra 10¹⁹ a 10²¹ dos concorrentes).</p>
        <Callout tone="warn" icon="alert">O texto do paper cita 41,0 BLEU para o inglês→francês, mas a tabela e o resumo dizem 41,8. Usei o valor da tabela. Detalhe curioso para quem confere números.</Callout>
        <p>O paper ainda mostra que o Transformer generaliza para outra tarefa, a <strong>análise sintática (constituency parsing)</strong>, sem ajustes específicos (seção 6.3).</p>
      </Section>
      <Section id="ablation" title={"O que realmente importa? As ablações (Tabela 3)"}>
        <p>Os autores mudaram uma peça por vez no modelo base (N=6, d_model=512, d_ff=2048, h=8) e mediram no conjunto de desenvolvimento (BLEU 25,8 no base). Isso mostra o que é essencial:</p>
        <Table
          head={["Mudança", "BLEU (dev)", "Lição"]}
          rows={[
            ["1 cabeça (em vez de 8)", "24,9", "várias cabeças ajudam (−0,9)"],
            ["32 cabeças", "25,4", "cabeças demais também pioram"],
            ["d_k reduzido para 16", "25,1", "o “casamento” Q/K precisa de espaço"],
            ["2 camadas (em vez de 6)", "23,7", "profundidade importa"],
            ["d_model = 256", "24,5", "modelos maiores são melhores"],
            ["d_model = 1024", "26,0", "...mas custam mais parâmetros (168 mi)"],
            ["d_ff = 4096", "26,2", "FFN maior ajuda"],
            ["sem dropout", "24,6", "dropout evita overfitting"],
            ["posição aprendida em vez de senoidal", "25,7", "quase igual"],
          ]}
        />
      </Section>
      <Section id="code" title={"Em código: atenção em 15 linhas"}>
        <p>Python puro, sem bibliotecas, reproduzindo o exemplo numérico acima. Rode e confira as saídas.</p>
        <CodeBlock code={`import math

def softmax(row):
    m = max(row)                       # subtracting the max avoids overflow
    e = [math.exp(x - m) for x in row]
    s = sum(e)
    return [x / s for x in e]

def attention(Q, K, V, causal=False):
    d_k = len(K[0])
    out = []
    for i, q in enumerate(Q):
        # 1) score the query against every key, scaled by sqrt(d_k)
        scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d_k) for k in K]
        # 2) mask the future (decoder only)
        if causal:
            scores = [s if j <= i else float("-inf") for j, s in enumerate(scores)]
        # 3) weights that sum to 1
        w = softmax(scores)
        # 4) blend the values
        out.append([sum(w[j] * V[j][c] for j in range(len(V))) for c in range(len(V[0]))])
    return out

X = [[1, 0], [0, 1], [1, 1]]           # the, cat, sleeps
print(attention(X, X, X))               # last row ≈ [0.752, 0.752]
print(attention(X, X, X, causal=True))  # "cat" now ignores "sleeps"`} />
        <p>Em bibliotecas reais (PyTorch, JAX), a mesma conta é feita com matrizes em GPU: <code>softmax(Q @ K.T / sqrt(d_k)) @ V</code>. O PyTorch tem <code>torch.nn.MultiheadAttention</code> e <code>torch.nn.Transformer</code> prontos. O código oficial do paper, o Tensor2Tensor, está no endereço citado no artigo.</p>
      </Section>
      <Section id="legacy" title={"Depois do paper: o que veio a seguir"}>
        <Callout tone="warn" icon="alert">Esta seção é contexto geral, <strong>não vem do paper</strong>.</Callout>
        <ul>
          <li><strong>Só o encoder</strong> (ex.: BERT): bom para entender texto (classificação, busca).</li>
          <li><strong>Só o decoder</strong> (ex.: família GPT e os assistentes de IA atuais): geram texto palavra por palavra, com a máscara causal que você viu.</li>
          <li><strong>Visão e áudio:</strong> a mesma ideia foi aplicada a imagens (Vision Transformer) e fala.</li>
          <li><strong>O limite do n²:</strong> o custo quadrático da atenção motivou muita pesquisa em contextos longos e atenções mais eficientes.</li>
        </ul>
        <p>Por isso o Transformer é a base dos modelos de linguagem atuais. Para ver como eles são usados na prática (tokens, prompts, RAG, agentes), veja a nota <a href="/notas/ai-engineering/">AI Engineering</a>.</p>
      </Section>
      <Section id="cheat-att" title={"Cola e revisão"}>
        <Table
          head={["Conceito", "Em uma frase"]}
          rows={[
            ["Query / Key / Value", "pergunta, lombada e conteúdo: a Query pontua as Keys e mistura os Values"],
            ["softmax(QKᵀ/√dₖ)V", "a equação da atenção; √dₖ evita softmax saturado"],
            ["Multi-head", "8 atenções em paralelo com vetores de 64; custo ≈ 1 de 512"],
            ["Codificação posicional", "seno/cosseno somados aos embeddings para dar noção de ordem"],
            ["Máscara", "−∞ nas posições futuras: o decoder não espia"],
            ["Add & Norm", "residual + LayerNorm em volta de cada sub-bloco"],
            ["N=6, 512, 2048, h=8", "configuração do modelo base (65 mi de parâmetros); big: 1024, 4096, h=16 (213 mi)"],
          ]}
        />
        <h3>Teste-se</h3>
        <ol className="ds-steps">
          <li>Por que o Transformer treina mais rápido que uma RNN? <em>(Resposta: sem dependência sequencial dentro da camada, tudo é multiplicação de matrizes em paralelo.)</em></li>
          <li>O que aconteceria sem a codificação posicional? <em>(Resposta: o modelo veria a frase como um conjunto, sem ordem.)</em></li>
          <li>Qual é a diferença entre a self-attention do decoder e a atenção encoder-decoder? <em>(Resposta: na primeira, Q, K e V vêm do decoder e há máscara; na segunda, K e V vêm do encoder.)</em></li>
          <li>Se a frase dobrar de tamanho, quanto cresce o custo da atenção? <em>(Resposta: ≈ 4 vezes, por causa do n².)</em></li>
        </ol>
      </Section>
      <Sources
        links={[
          { label: "Vaswani et al. (2017), Attention Is All You Need, arXiv:1706.03762", href: "https://arxiv.org/abs/1706.03762" },
          { label: "PDF do paper / paper PDF", href: "https://arxiv.org/pdf/1706.03762" },
          { label: "NeurIPS 2017 proceedings", href: "https://papers.nips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html" },
          { label: "Tensor2Tensor (código original / original code)", href: "https://github.com/tensorflow/tensor2tensor" },
          { label: "PyTorch: MultiheadAttention", href: "https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html" },
        ]}
      />
    </>
  );
}
