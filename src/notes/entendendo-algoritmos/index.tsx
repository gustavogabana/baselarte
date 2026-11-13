import { Callout, CodeBlock, Diagram, Section, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "entendendo-algoritmos",
  title: { en: "Grokking Algorithms (book)", pt: "Entendendo Algoritmos (livro)" },
  seo: {
    title: { en: "Grokking Algorithms, book notes", pt: "Entendendo Algoritmos, notas do livro" },
    description: { en: "A friendly walkthrough of the book Grokking Algorithms (Entendendo Algoritmos): Big O notation, binary search, sorting, recursion, hash tables, graphs, Dijkstra, greedy algorithms, dynamic programming and k-nearest neighbours, with simple examples and code.", pt: "Um passeio didático pelo livro Entendendo Algoritmos (Grokking Algorithms): notação Big O, busca binária, ordenação, recursão, tabelas hash, grafos, Dijkstra, algoritmos gulosos, programação dinâmica e k-vizinhos mais próximos, com exemplos simples e código." },
  },
  summary: "book notes on Big O notation, binary search, sorting, recursion, hash tables, graphs, Dijkstra, greedy algorithms, dynamic programming and k-nearest neighbours, with examples and code.",
  kicker: { en: "Book notes", pt: "Notas de livro" },
  heroTitle: { en: <>Algorithms, <em>and how fast they grow.</em></>, pt: <>Algoritmos, <em>e a velocidade com que crescem.</em></> },
  heroLede: { en: "A friendly walkthrough of Grokking Algorithms: Big O notation first, then every algorithm of the book, with everyday examples and short Python code.", pt: "Um passeio didático por Entendendo Algoritmos: primeiro a notação Big O, depois cada algoritmo do livro, com exemplos do dia a dia e códigos curtos em Python." },
  published: "2026-10-17",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "idea", title: <T pt="O livro e o mapa" en="The book and the map" /> },
        { id: "bigo", title: <T pt="Notação Big O" en="Big O notation" /> },
        { id: "ch1", title: <T pt="1. Busca binária" en="1. Binary search" /> },
        { id: "ch2", title: <T pt="2. Ordenação por seleção" en="2. Selection sort" /> },
        { id: "ch3", title: <T pt="3. Recursão" en="3. Recursion" /> },
        { id: "ch4", title: <T pt="4. Quicksort" en="4. Quicksort" /> },
        { id: "ch5", title: <T pt="5. Tabelas hash" en="5. Hash tables" /> },
        { id: "ch6", title: <T pt="6. Busca em largura" en="6. Breadth-first search" /> },
        { id: "ch7", title: <T pt="7. Dijkstra" en="7. Dijkstra" /> },
        { id: "ch8", title: <T pt="8. Algoritmos gulosos" en="8. Greedy algorithms" /> },
        { id: "ch9", title: <T pt="9. Programação dinâmica" en="9. Dynamic programming" /> },
        { id: "ch10", title: <T pt="10. k-vizinhos mais próximos" en="10. k-nearest neighbours" /> },
        { id: "ch11", title: <T pt="11. Para onde ir depois" en="11. Where to go next" /> },
        { id: "cheat", title: <T pt="Resumo" en="Cheat sheet" /> },
        { id: "apply", title: <T pt="Como estudar e aplicar" en="How to study and apply" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="idea" title={<T pt="O livro e o mapa" en="The book and the map" />}>
        <p><T pt={<><em>Entendendo Algoritmos</em> (<em>Grokking Algorithms</em>, de Aditya Bhargava) ensina algoritmos com desenhos e exemplos do dia a dia, sem exigir matemática pesada. Um algoritmo é só uma receita: uma sequência de passos que resolve um problema. A pergunta do livro é sempre a mesma: <em>existe um jeito mais rápido de fazer isso?</em></>} en={<><em>Grokking Algorithms</em> (Portuguese edition: <em>Entendendo Algoritmos</em>, by Aditya Bhargava) teaches algorithms with drawings and everyday examples, without heavy maths. An algorithm is just a recipe: a sequence of steps that solves a problem. The book’s question is always the same: <em>is there a faster way to do this?</em></>} /></p>
        <p><T pt="Para responder, o livro usa uma régua: a notação Big O. Por isso esta nota começa por ela e depois percorre os capítulos na ordem do livro. Cada algoritmo vem com a ideia, um exemplo e um código curto em Python." en="To answer it, the book uses one ruler: Big O notation. That is why this note starts there and then walks through the chapters in the book’s order. Each algorithm comes with the idea, an example and a short Python snippet." /></p>
        <Table
          head={[<T pt="Capítulo" en="Chapter" />, <T pt="Tema" en="Topic" />, <T pt="Ideia em uma frase" en="Idea in one sentence" />]}
          rows={[
            ["1", <T pt="Busca binária e Big O" en="Binary search and Big O" />, <T pt="Dividir ao meio vence olhar um por um." en="Halving beats looking one by one." />],
            ["2", <T pt="Ordenação por seleção" en="Selection sort" />, <T pt="Como os dados ficam na memória muda o custo." en="How data sits in memory changes the cost." />],
            ["3", <T pt="Recursão" en="Recursion" />, <T pt="Resolver um problema resolvendo uma versão menor." en="Solve a problem by solving a smaller one." />],
            ["4", "Quicksort", <T pt="Dividir e conquistar." en="Divide and conquer." />],
            ["5", <T pt="Tabelas hash" en="Hash tables" />, <T pt="Achar pelo nome em um passo só." en="Find by name in a single step." />],
            ["6", <T pt="Busca em largura" en="Breadth-first search" />, <T pt="Caminho com menos passos em um grafo." en="Fewest-steps path in a graph." />],
            ["7", "Dijkstra", <T pt="Caminho de menor custo com pesos." en="Lowest-cost path with weights." />],
            ["8", <T pt="Algoritmos gulosos" en="Greedy algorithms" />, <T pt="Escolher o melhor agora e aceitar um resultado aproximado." en="Pick the best now and accept an approximate result." />],
            ["9", <T pt="Programação dinâmica" en="Dynamic programming" />, <T pt="Resolver subproblemas e guardar as respostas." en="Solve subproblems and keep the answers." />],
            ["10", "k-NN", <T pt="Classificar olhando os vizinhos mais parecidos." en="Classify by looking at the most similar neighbours." />],
            ["11", <T pt="Próximos passos" en="Where to go next" />, <T pt="Um mapa do que estudar depois." en="A map of what to study next." />],
          ]}
        />
      </Section>
      <Section id="bigo" title={<T pt="Notação Big O" en="Big O notation" />}>
        <p><T pt={<>Big O responde a uma pergunta: <em>se a entrada ficar maior, quanto mais trabalho o algoritmo faz?</em> Ela não mede segundos (isso depende do computador), mede <em>a velocidade de crescimento</em> do número de passos.</>} en={<>Big O answers one question: <em>if the input gets bigger, how much more work does the algorithm do?</em> It does not measure seconds (that depends on the computer); it measures <em>how fast the number of steps grows</em>.</>} /></p>
        <h3><T pt="Um exemplo para começar: o livro de telefones" en="A first example: the phone book" /></h3>
        <p><T pt="Você quer achar “Moura” numa lista telefônica de 1.000 nomes em ordem alfabética. Um jeito é começar na primeira página e ir lendo: no pior caso, 1.000 passos. Outro é abrir no meio, ver se “Moura” vem antes ou depois e descartar metade: cerca de 10 passos. Com 1.000.000 de nomes, o primeiro jeito faz até 1.000.000 de passos; o segundo, cerca de 20. Os dois resolvem o problema, mas crescem de forma muito diferente. Big O dá nome a essa diferença." en="You want to find “Moore” in a phone book of 1,000 names in alphabetical order. One way is to start on the first page and read on: in the worst case, 1,000 steps. Another is to open in the middle, check whether “Moore” comes before or after, and discard half: about 10 steps. With 1,000,000 names the first way takes up to 1,000,000 steps; the second takes about 20. Both solve the problem, but they grow very differently. Big O gives that difference a name." /></p>
        <h3><T pt="Como se lê" en="How to read it" /></h3>
        <p><T pt={<><code>O(n)</code> lê-se “O de n”. O <code>n</code> é o tamanho da entrada (quantos itens) e o que está dentro dos parênteses diz como o número de passos cresce com <code>n</code>.</>} en={<><code>O(n)</code> reads “O of n”. The <code>n</code> is the input size (how many items) and what is inside the parentheses says how the number of steps grows with <code>n</code>.</>} /></p>
        <Table
          head={[<T pt="Big O" en="Big O" />, <T pt="Nome" en="Name" />, <T pt="Exemplo do dia a dia" en="Everyday example" />, <T pt="Em código" en="In code" />]}
          rows={[
            [<code>O(1)</code>, <T pt="constante" en="constant" />, <T pt="Pegar o primeiro livro da pilha." en="Grabbing the top book of a pile." />, <T pt={<><code>items[0]</code>, ler uma chave de um dicionário</>} en={<><code>items[0]</code>, reading a dictionary key</>} />],
            [<code>O(log n)</code>, <T pt="logarítmico" en="logarithmic" />, <T pt="Achar um nome no dicionário abrindo no meio." en="Finding a word in a dictionary by opening in the middle." />, <T pt="busca binária" en="binary search" />],
            [<code>O(n)</code>, <T pt="linear" en="linear" />, <T pt="Ler uma lista de compras inteira." en="Reading a whole shopping list." />, <T pt={<>um <code>for</code> sobre a lista</>} en={<>a <code>for</code> over the list</>} />],
            [<code>O(n log n)</code>, <T pt="linearítmico" en="linearithmic" />, <T pt="Ordenar uma estante com um bom método." en="Sorting a shelf with a good method." />, <>quicksort, merge sort, <code>sorted()</code></>],
            [<code>O(n²)</code>, <T pt="quadrático" en="quadratic" />, <T pt="Cada pessoa da festa cumprimenta todas as outras." en="Every guest at a party greets every other guest." />, <T pt={<>dois <code>for</code> aninhados</>} en={<>two nested <code>for</code> loops</>} />],
            [<code>O(2ⁿ)</code>, <T pt="exponencial" en="exponential" />, <T pt="Testar todas as combinações de ligado/desligado de n interruptores." en="Trying every on/off combination of n switches." />, <T pt="todos os subconjuntos, Fibonacci ingênuo" en="all subsets, naive Fibonacci" />],
            [<code>O(n!)</code>, <T pt="fatorial" en="factorial" />, <T pt="Testar todas as ordens possíveis de visitar n cidades." en="Trying every possible order to visit n cities." />, <T pt="todas as permutações" en="all permutations" />],
          ]}
        />
        <Diagram minWidth={560} caption={<T pt="Quanto mais a entrada cresce, mais as curvas se separam. O gráfico corta em 100 passos: O(2ⁿ) já escapou da página em n = 7." en="As the input grows, the curves pull apart. The chart is cut at 100 steps: O(2ⁿ) has already left the page at n = 7." />}>
          <svg viewBox="0 0 700 302" role="img" aria-label="Curvas de crescimento / Growth curves">
            <path d="M60 20V260H620" className="ln" />
            <text x="340" y="292" className="pt mut" textAnchor="middle">tamanho da entrada (n)</text>
            <text x="340" y="292" className="en mut" textAnchor="middle">input size (n)</text>
            <g transform="rotate(-90 22 140)">
              <text x="22" y="140" className="pt mut" textAnchor="middle">passos</text>
              <text x="22" y="140" className="en mut" textAnchor="middle">steps</text>
            </g>
            <path d="M87.0 259.4L100.5 258.7L114.0 257.7L127.5 256.4L141.0 254.8L154.5 253.0L168.0 250.8L181.5 248.4L195.0 245.6L208.5 242.6L222.0 239.3L235.5 235.7L249.0 231.8L262.5 227.7L276.0 223.2L289.5 218.5L303.0 213.4L316.5 208.1L330.0 202.5L343.5 196.6L357.0 190.4L370.5 184.0L384.0 177.2L397.5 170.2L411.0 162.8L424.5 155.2L438.0 147.3L451.5 139.1L465.0 130.6L478.5 121.9L492.0 112.8L505.5 103.5L519.0 93.8L532.5 83.9L546.0 73.7L559.5 63.2L573.0 52.4L586.5 41.4L600.0 30.0" className="ln" />
            <path d="M87.0 256.7L100.5 256.1L114.0 255.4L127.5 254.5L141.0 253.5L154.5 252.3L168.0 250.8L181.5 249.1L195.0 247.0L208.5 244.5L222.0 241.6L235.5 238.1L249.0 234.0L262.5 229.1L276.0 223.2L289.5 216.2L303.0 208.0L316.5 198.1L330.0 186.4L343.5 172.5L357.0 155.9L370.5 136.2L384.0 112.8L397.5 84.9L411.0 51.8" className="ln dash" />
            <path d="M87.0 260.0L100.5 260.0L114.0 260.0L127.5 259.1L141.0 258.0L154.5 256.8L168.0 255.4L181.5 253.9L195.0 252.4L208.5 250.8L222.0 249.1L235.5 247.3L249.0 245.5L262.5 243.6L276.0 241.6L289.5 239.6L303.0 237.5L316.5 235.4L330.0 233.3L343.5 231.1L357.0 228.9L370.5 226.6L384.0 224.3L397.5 222.0L411.0 219.6L424.5 217.2L438.0 214.8L451.5 212.3L465.0 209.9L478.5 207.3L492.0 204.8L505.5 202.2L519.0 199.6L532.5 197.0L546.0 194.4L559.5 191.7L573.0 189.0L586.5 186.3L600.0 183.6" className="ln" />
            <path d="M87.0 258.9L100.5 258.3L114.0 257.7L127.5 257.1L141.0 256.6L154.5 256.0L168.0 255.4L181.5 254.8L195.0 254.2L208.5 253.7L222.0 253.1L235.5 252.5L249.0 251.9L262.5 251.4L276.0 250.8L289.5 250.2L303.0 249.7L316.5 249.1L330.0 248.5L343.5 247.9L357.0 247.3L370.5 246.8L384.0 246.2L397.5 245.6L411.0 245.1L424.5 244.5L438.0 243.9L451.5 243.3L465.0 242.8L478.5 242.2L492.0 241.6L505.5 241.0L519.0 240.4L532.5 239.9L546.0 239.3L559.5 238.7L573.0 238.2L586.5 237.6L600.0 237.0" className="ln" />
            <path d="M87.0 260.0L100.5 260.0L114.0 260.0L127.5 259.3L141.0 258.7L154.5 258.1L168.0 257.7L181.5 257.3L195.0 257.0L208.5 256.6L222.0 256.4L235.5 256.1L249.0 255.8L262.5 255.6L276.0 255.4L289.5 255.2L303.0 255.0L316.5 254.8L330.0 254.7L343.5 254.5L357.0 254.3L370.5 254.2L384.0 254.1L397.5 253.9L411.0 253.8L424.5 253.7L438.0 253.5L451.5 253.4L465.0 253.3L478.5 253.2L492.0 253.1L505.5 253.0L519.0 252.9L532.5 252.8L546.0 252.7L559.5 252.6L573.0 252.5L586.5 252.4L600.0 252.4" className="ln" />
            <path d="M60 257.7H600" className="ln" />
            <text x="606" y="36" className="mono">O(n²)</text>
            <text x="426" y="24" className="mono">O(2ⁿ)</text>
            <text x="606" y="186" className="mono">O(n log n)</text>
            <text x="606" y="232" className="mono">O(n)</text>
            <text x="606" y="250" className="mono">O(log n)</text>
            <text x="606" y="268" className="mono">O(1)</text>
          </svg>
        </Diagram>
        <h3><T pt="O que o logaritmo quer dizer" en="What the logarithm means" /></h3>
        <p><T pt={<><code>log₂ 8 = 3</code> responde: “quantas vezes preciso dividir 8 por 2 até chegar em 1?” (8 → 4 → 2 → 1, três vezes). É por isso que O(log n) cresce tão devagar: dobrar a entrada soma <em>um</em> passo. De 1.000 para 2.000 itens a busca binária faz só mais 1 palpite.</>} en={<><code>log₂ 8 = 3</code> answers: “how many times must I halve 8 until I reach 1?” (8 → 4 → 2 → 1, three times). That is why O(log n) grows so slowly: doubling the input adds <em>one</em> step. Going from 1,000 to 2,000 items, binary search needs just 1 more guess. In Big O the base is dropped, so we write <code>log n</code>.</>} /></p>
        <h3><T pt="Quantos passos de verdade?" en="How many steps, really?" /></h3>
        <Table
          head={[<T pt="Big O" en="Big O" />, "n = 10", <T pt="n = 1.000" en="n = 1,000" />, <T pt="n = 1.000.000" en="n = 1,000,000" />]}
          rows={[
            [<code>O(1)</code>, "1", "1", "1"],
            [<code>O(log n)</code>, "≈ 3", "≈ 10", "≈ 20"],
            [<code>O(n)</code>, "10", <T pt="1.000" en="1,000" />, <T pt="1.000.000" en="1,000,000" />],
            [<code>O(n log n)</code>, "≈ 33", <T pt="≈ 10.000" en="≈ 10,000" />, <T pt="≈ 20.000.000" en="≈ 20,000,000" />],
            [<code>O(n²)</code>, "100", <T pt="1.000.000" en="1,000,000" />, "10¹²"],
            [<code>O(2ⁿ)</code>, <T pt="1.024" en="1,024" />, <T pt="≈ 10³⁰¹ (inviável)" en="≈ 10³⁰¹ (infeasible)" />, <T pt="inviável" en="infeasible" />],
            [<code>O(n!)</code>, <T pt="3.628.800" en="3,628,800" />, <T pt="inviável" en="infeasible" />, <T pt="inviável" en="infeasible" />],
          ]}
        />
        <p><T pt="Se cada passo levasse 1 milissegundo, O(n²) com um milhão de itens levaria uns 31 anos, enquanto O(n log n) levaria cerca de 5 horas e meia. A escolha do algoritmo importa mais do que o computador." en="If each step took 1 millisecond, O(n²) on a million items would take about 31 years, while O(n log n) would take about five and a half hours. The choice of algorithm matters more than the computer." /></p>
        <h3><T pt="As quatro regras de bolso" en="Four rules of thumb" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><em>Pense no pior caso.</em> Big O costuma dizer quanto o algoritmo pode demorar no pior caso. Na busca simples o pior caso é o item estar na última posição (ou não existir): n passos.</>} en={<><em>Think worst case.</em> Big O usually states how long the algorithm can take in the worst case. In simple search the worst case is the item being last (or missing): n steps.</>} /></li>
          <li><T pt={<><em>Ignore constantes.</em> Dois laços um depois do outro dão 2n passos, mas escrevemos O(n). Big O compara o <em>formato</em> do crescimento, não o número exato.</>} en={<><em>Drop constants.</em> Two loops one after the other give 2n steps, but we write O(n). Big O compares the <em>shape</em> of the growth, not the exact count.</>} /></li>
          <li><T pt={<><em>Fique com o termo que domina.</em> n² + n é O(n²), porque para n grande o n² engole o n. Um laço seguido de um laço duplo é O(n²).</>} en={<><em>Keep the dominant term.</em> n² + n is O(n²), because for large n the n² swallows the n. A loop followed by a nested loop is O(n²).</>} /></li>
          <li><T pt={<><em>Laços aninhados multiplicam, laços em sequência somam.</em> Um <code>for</code> dentro de outro: n × n. Um <code>for</code> depois do outro: n + n.</>} en={<><em>Nested loops multiply, sequential loops add.</em> A <code>for</code> inside another: n × n. One <code>for</code> after another: n + n.</>} /></li>
        </ol>
        <CodeBlock code={`def first_item(items):          # O(1): one step, however long the list is
    return items[0]

def contains(items, target):    # O(n): in the worst case looks at every item
    for item in items:
        if item == target:
            return True
    return False

def has_duplicates(items):      # O(n²): compares every item with every other
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def halvings(n):                # O(log n): halves the problem each time
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps`} />
        <h3><T pt="Memória também conta" en="Memory counts too" /></h3>
        <p><T pt={<>O mesmo raciocínio vale para o espaço. Somar números com um laço usa uma variável a mais: <code>O(1)</code> de memória. Copiar a lista para outra usa <code>O(n)</code>. Muitas vezes se troca memória por velocidade: a tabela hash do capítulo 5 gasta espaço extra para achar em um passo.</>} en={<>The same reasoning applies to space. Summing numbers in a loop uses one extra variable: <code>O(1)</code> memory. Copying the list into another uses <code>O(n)</code>. We often trade memory for speed: the hash table of chapter 5 spends extra space to find things in one step.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt="Big O não é o fim da história. Ele ignora constantes, e às vezes elas importam: o livro mostra que o quicksort e o merge sort são ambos O(n log n), mas o quicksort costuma ser mais rápido na prática porque a constante dele é menor. Para listas minúsculas, até um O(n²) simples pode ganhar. Meça antes de otimizar." en="Big O is not the end of the story. It ignores constants, and sometimes they matter: the book shows that quicksort and merge sort are both O(n log n), but quicksort is usually faster in practice because its constant is smaller. For tiny lists, even a simple O(n²) can win. Measure before optimizing." /></Callout>
      </Section>
      <Section id="ch1" title={<T pt="Capítulo 1: busca binária" en="Chapter 1: binary search" />}>
        <p><T pt={<>Estou pensando num número de 1 a 100 e você tenta adivinhar. Chutar 1, 2, 3… é a <em>busca simples</em>: no pior caso 100 palpites. Chutar 50 e ouvir “é maior” ou “é menor” é a <em>busca binária</em>: cada palpite elimina metade, e 7 palpites bastam para 100 números.</>} en={<>I am thinking of a number from 1 to 100 and you try to guess it. Guessing 1, 2, 3… is <em>simple search</em>: 100 guesses in the worst case. Guessing 50 and hearing “higher” or “lower” is <em>binary search</em>: each guess eliminates half, and 7 guesses are enough for 100 numbers.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="A busca binária joga fora metade das possibilidades a cada passo. A busca simples jogaria fora uma." en="Binary search throws away half of the possibilities at each step. Simple search would throw away one." />}>
          <svg viewBox="0 0 640 226" role="img" aria-label="Faixa de busca encolhendo pela metade / Search range halving each step">
            <rect x="20" y="8" width="520" height="16" className="ln fillsoft" />
            <text x="550" y="21" className="pt mut">100 números</text>
            <text x="550" y="21" className="en mut">100 numbers</text>
            <rect x="20" y="32" width="260" height="16" className="ln fillsoft" />
            <text x="290" y="45" className="pt mut">50 números</text>
            <text x="290" y="45" className="en mut">50 numbers</text>
            <rect x="20" y="56" width="130" height="16" className="ln fillsoft" />
            <text x="160" y="69" className="pt mut">25 números</text>
            <text x="160" y="69" className="en mut">25 numbers</text>
            <rect x="20" y="80" width="68" height="16" className="ln fillsoft" />
            <text x="98" y="93" className="pt mut">13 números</text>
            <text x="98" y="93" className="en mut">13 numbers</text>
            <rect x="20" y="104" width="36" height="16" className="ln fillsoft" />
            <text x="66" y="117" className="pt mut">7 números</text>
            <text x="66" y="117" className="en mut">7 numbers</text>
            <rect x="20" y="128" width="21" height="16" className="ln fillsoft" />
            <text x="51" y="141" className="pt mut">4 números</text>
            <text x="51" y="141" className="en mut">4 numbers</text>
            <rect x="20" y="152" width="10" height="16" className="ln fillsoft" />
            <text x="40" y="165" className="pt mut">2 números</text>
            <text x="40" y="165" className="en mut">2 numbers</text>
            <rect x="20" y="176" width="5" height="16" className="fill" />
            <text x="35" y="189" className="pt mut">1 número</text>
            <text x="35" y="189" className="en mut">1 number</text>
            <text x="320" y="214" className="pt mut" textAnchor="middle">Cada palpite descarta metade. 100 números: no máximo 7 palpites (2⁷ = 128).</text>
            <text x="320" y="214" className="en mut" textAnchor="middle">Each guess discards half. 100 numbers: at most 7 guesses (2⁷ = 128).</text>
          </svg>
        </Diagram>
        <CodeBlock code={`def simple_search(items, target):       # O(n)
    for index, item in enumerate(items):
        if item == target:
            return index
    return None


def binary_search(items, target):       # O(log n); items must be sorted
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        guess = items[mid]
        if guess == target:
            return mid
        if guess > target:
            high = mid - 1
        else:
            low = mid + 1
    return None`} />
        <Table
          head={[<T pt="Algoritmo" en="Algorithm" />, <T pt="Big O" en="Big O" />, <T pt="Exige" en="Requires" />]}
          rows={[
            [<T pt="busca simples" en="simple search" />, <code>O(n)</code>, <T pt="nada" en="nothing" />],
            [<T pt="busca binária" en="binary search" />, <code>O(log n)</code>, <T pt={<>lista <em>ordenada</em></>} en={<><em>sorted</em> list</>} />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt="A busca binária só funciona em dados ordenados. Se você vai buscar muitas vezes, vale pagar o custo de ordenar uma vez." en="Binary search only works on sorted data. If you will search many times, it is worth paying the cost of sorting once." /></Callout>
        <h3><T pt="O problema do caixeiro-viajante" en="The travelling salesperson problem" /></h3>
        <p><T pt="O livro fecha o capítulo com um vendedor que precisa passar por n cidades gastando o mínimo de estrada. A solução óbvia testa todas as ordens: O(n!). Com 5 cidades são 120 rotas; com 10, 3,6 milhões; com 20, mais de 2 quintilhões. É o exemplo clássico de um algoritmo que existe, mas é lento demais." en="The book closes the chapter with a salesperson who must visit n cities using the least road. The obvious solution tries every order: O(n!). With 5 cities that is 120 routes; with 10, 3.6 million; with 20, over 2 quintillion. It is the classic example of an algorithm that exists but is too slow." /></p>
      </Section>
      <Section id="ch2" title={<T pt="Capítulo 2: memória e ordenação por seleção" en="Chapter 2: memory and selection sort" />}>
        <p><T pt="Antes de ordenar, o livro mostra como os dados ficam na memória. Imagine uma gaveta numerada por onde você guarda coisas." en="Before sorting, the book shows how data sits in memory. Picture a numbered set of drawers where you keep things." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Array:</em> os itens ficam em gavetas vizinhas. Ler o item de índice 5 é imediato, mas inserir no meio obriga a empurrar todos os seguintes.</>} en={<><em>Array:</em> items sit in neighbouring drawers. Reading index 5 is immediate, but inserting in the middle forces you to shift everything after it.</>} /></li>
          <li><T pt={<><em>Lista encadeada:</em> cada item guarda o endereço do próximo e pode estar em qualquer gaveta. Inserir é fácil (muda um endereço), mas para chegar ao 5º item é preciso passar pelos 4 anteriores.</>} en={<><em>Linked list:</em> each item stores the address of the next and can live in any drawer. Inserting is easy (change one address), but reaching the 5th item means walking through the previous 4.</>} /></li>
        </ul>
        <Table
          head={[<T pt="Operação" en="Operation" />, "Array", <T pt="Lista encadeada" en="Linked list" />]}
          rows={[
            [<T pt="ler um item por posição" en="read an item by position" />, <code>O(1)</code>, <code>O(n)</code>],
            [<T pt="inserir no meio" en="insert in the middle" />, <code>O(n)</code>, <><code>O(1)</code>*</>],
            [<T pt="apagar no meio" en="delete in the middle" />, <code>O(n)</code>, <><code>O(1)</code>*</>],
          ]}
        />
        <p><T pt="*Depois de já estar na posição. Chegar até ela custa O(n). Na prática, arrays vencem na maioria dos casos porque a leitura é muito usada e os itens vizinhos ficam no cache do processador." en="*Once you are already at the position. Getting there costs O(n). In practice arrays win in most cases because reading is so common and neighbouring items sit in the processor cache." /></p>
        <h3><T pt="Ordenação por seleção" en="Selection sort" /></h3>
        <p><T pt="A ideia: ache o menor item, passe-o para uma lista nova, repita. Encontrar o menor custa n passos e isso se repete n vezes, então o total é O(n²). (Na verdade n + (n−1) + … + 1, mas Big O ignora a metade, que é uma constante.)" en="The idea: find the smallest item, move it to a new list, repeat. Finding the smallest costs n steps and this repeats n times, so the total is O(n²). (It is really n + (n−1) + … + 1, but Big O drops the half, a constant.)" /></p>
        <CodeBlock code={`def find_smallest(items):
    smallest, smallest_index = items[0], 0
    for i in range(1, len(items)):
        if items[i] < smallest:
            smallest, smallest_index = items[i], i
    return smallest_index


def selection_sort(items):              # O(n²)
    items = list(items)                 # works on a copy
    result = []
    while items:
        result.append(items.pop(find_smallest(items)))
    return result`} />
        <Callout tone="good" icon="check"><T pt={<>Boa para entender, ruim para usar com listas grandes. Na vida real use o <code>sorted()</code> da linguagem, que é O(n log n).</>} en={<>Good for learning, bad for big lists. In real life use the language’s <code>sorted()</code>, which is O(n log n).</>} /></Callout>
      </Section>
      <Section id="ch3" title={<T pt="Capítulo 3: recursão" en="Chapter 3: recursion" />}>
        <p><T pt="Recursão é uma função que chama a si mesma com um problema menor. A analogia do livro: procurar a chave numa caixa que tem outras caixas dentro. Você abre uma caixa; se achar uma caixa menor, repete o mesmo processo nela; se achar a chave, para." en="Recursion is a function that calls itself with a smaller problem. The book’s analogy: looking for a key in a box that holds other boxes. You open a box; if you find a smaller box, you repeat the same process on it; if you find the key, you stop." /></p>
        <p><T pt={<>Toda função recursiva precisa de duas partes: o <em>caso base</em>, que para a recursão, e o <em>caso recursivo</em>, que chama a função de novo com algo menor. Sem caso base ela chama a si mesma para sempre, até estourar a memória.</>} en={<>Every recursive function needs two parts: the <em>base case</em>, which stops the recursion, and the <em>recursive case</em>, which calls the function again with something smaller. Without a base case it calls itself forever, until memory runs out.</>} /></p>
        <CodeBlock code={`def factorial(n):
    if n <= 1:                  # base case: stops the recursion
        return 1
    return n * factorial(n - 1) # recursive case: a smaller problem


def total(numbers):             # sum of a list, no loop
    if not numbers:
        return 0
    return numbers[0] + total(numbers[1:])`} />
        <Diagram minWidth={560} caption={<T pt="A pilha de chamadas guarda o que cada chamada ainda precisa fazer. Sem caso base, ela cresce até estourar." en="The call stack remembers what each call still has to do. Without a base case it grows until it overflows." />}>
          <svg viewBox="0 0 640 184" role="img" aria-label="Pilha de chamadas de factorial(3) / Call stack of factorial(3)">
            <rect x="40" y="20" width="300" height="36" rx="8" className="ln fillsoft" />
            <text x="56" y="43" className="mono">factorial(1)</text>
            <text x="190" y="43" className="pt mut">devolve 1</text>
            <text x="190" y="43" className="en mut">returns 1</text>
            <rect x="40" y="62" width="300" height="36" rx="8" className="ln" />
            <text x="56" y="85" className="mono">factorial(2)</text>
            <text x="190" y="85" className="pt mut">espera 2 × factorial(1)</text>
            <text x="190" y="85" className="en mut">waits for 2 × factorial(1)</text>
            <rect x="40" y="104" width="300" height="36" rx="8" className="ln" />
            <text x="56" y="127" className="mono">factorial(3)</text>
            <text x="190" y="127" className="pt mut">espera 3 × factorial(2)</text>
            <text x="190" y="127" className="en mut">waits for 3 × factorial(2)</text>
            <path d="M380 125L380 40" className="ln" />
            <path d="M383.8 47.0L380 40L376.2 47.0" className="ln" />
            <text x="400" y="90" className="pt mut">chamadas empilham</text>
            <text x="400" y="90" className="en mut">calls pile up</text>
            <text x="400" y="108" className="pt mut">e depois resolvem de cima para baixo</text>
            <text x="400" y="108" className="en mut">then resolve from the top down</text>
            <text x="40" y="170" className="pt mut">Topo da pilha: factorial(1) é o caso base e responde sem chamar ninguém.</text>
            <text x="40" y="170" className="en mut">Top of the stack: factorial(1) is the base case and answers without calling anyone.</text>
          </svg>
        </Diagram>
        <h3><T pt="A pilha de chamadas" en="The call stack" /></h3>
        <p><T pt={<>O computador guarda as chamadas pendentes numa <em>pilha</em>: a última a entrar é a primeira a sair, como pratos empilhados. Em <code>factorial(3)</code> a pilha chega a 3 chamadas. Cada chamada ocupa memória, então recursão muito profunda usa muito espaço (O(n) para o fatorial). Toda recursão pode virar um laço; às vezes o laço é mais barato, às vezes a recursão é mais clara. O livro diz: o laço pode ser mais rápido, a recursão torna a solução mais fácil de entender.</>} en={<>The computer keeps pending calls in a <em>stack</em>: last in, first out, like stacked plates. In <code>factorial(3)</code> the stack reaches 3 calls. Each call takes memory, so very deep recursion uses a lot of space (O(n) for factorial). Any recursion can become a loop; sometimes the loop is cheaper, sometimes recursion is clearer. The book’s take: a loop may be faster, but recursion makes the solution easier to understand.</>} /></p>
      </Section>
      <Section id="ch4" title={<T pt="Capítulo 4: quicksort e dividir e conquistar" en="Chapter 4: quicksort and divide and conquer" />}>
        <p><T pt={<><em>Dividir e conquistar</em> (D&amp;C) é um jeito de pensar com dois passos: ache o caso mais simples (o caso base) e descubra como reduzir o problema até ele cair nesse caso.</>} en={<><em>Divide and conquer</em> (D&amp;C) is a way of thinking in two steps: find the simplest case (the base case) and work out how to shrink the problem until it falls into that case.</>} /></p>
        <h3><T pt="Exemplo: dividir um terreno" en="Example: splitting a plot of land" /></h3>
        <p><T pt="Você tem um terreno de 1.680 × 640 m e quer dividi-lo em quadrados iguais, os maiores possíveis. Caso base: se um lado é múltiplo do outro, o lado menor é o quadrado. Senão, corte o maior quadrado possível (640 × 640) e repita com o que sobrou (400 × 640), e assim por diante, até sobrar um quadrado de 80 × 80. É o algoritmo de Euclides, e é D&amp;C puro." en="You have a 1,680 × 640 m plot and want to split it into equal squares, as large as possible. Base case: if one side is a multiple of the other, the smaller side is the square. Otherwise cut the largest possible square (640 × 640) and repeat with the leftover (400 × 640), and so on, until a 80 × 80 square remains. That is Euclid’s algorithm, and it is pure D&amp;C." /></p>
        <h3><T pt="Quicksort" en="Quicksort" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Escolha um item como <em>pivô</em>.</>} en={<>Pick an item as the <em>pivot</em>.</>} /></li>
          <li><T pt="Separe o resto em dois grupos: os menores que o pivô e os maiores." en="Split the rest into two groups: smaller than the pivot and larger." /></li>
          <li><T pt="Ordene cada grupo do mesmo jeito (recursão) e junte: menores + pivô + maiores." en="Sort each group the same way (recursion) and join: smaller + pivot + larger." /></li>
        </ol>
        <CodeBlock code={`def quicksort(items):                   # O(n log n) on average
    if len(items) < 2:                  # base case
        return items
    pivot = items[0]
    smaller = [x for x in items[1:] if x <= pivot]
    larger = [x for x in items[1:] if x > pivot]
    return quicksort(smaller) + [pivot] + quicksort(larger)`} />
        <p><T pt={<><em>Exemplo:</em> <code>[5, 2, 9, 1]</code>, pivô 5. Menores: <code>[2, 1]</code>; maiores: <code>[9]</code>. Ordenando os menores sai <code>[1, 2]</code>. Resultado: <code>[1, 2] + [5] + [9]</code>.</>} en={<><em>Example:</em> <code>[5, 2, 9, 1]</code>, pivot 5. Smaller: <code>[2, 1]</code>; larger: <code>[9]</code>. Sorting the smaller gives <code>[1, 2]</code>. Result: <code>[1, 2] + [5] + [9]</code>.</>} /></p>
        <h3><T pt="Por que O(n log n) e quando vira O(n²)" en="Why O(n log n) and when it becomes O(n²)" /></h3>
        <p><T pt="Se o pivô divide a lista mais ou menos ao meio, a pilha tem cerca de log n níveis e cada nível percorre n itens: n × log n. Se o pivô for sempre o menor ou o maior item (por exemplo, a lista já ordenada e o pivô sempre o primeiro), a pilha tem n níveis: O(n²). A defesa é escolher o pivô ao acaso (ou o do meio): na média o resultado é O(n log n)." en="If the pivot splits the list roughly in half, the stack has about log n levels and each level walks n items: n × log n. If the pivot is always the smallest or largest item (for example, an already sorted list with the first item as pivot), the stack has n levels: O(n²). The defence is to pick the pivot at random (or the middle one): on average it is O(n log n)." /></p>
        <Table
          head={[<T pt="Caso" en="Case" />, <T pt="Quicksort" en="Quicksort" />, <T pt="Quando" en="When" />]}
          rows={[
            [<T pt="médio" en="average" />, <code>O(n log n)</code>, <T pt="pivô razoável" en="reasonable pivot" />],
            [<T pt="pior" en="worst" />, <code>O(n²)</code>, <T pt="pivô sempre extremo" en="pivot always extreme" />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt="Merge sort é O(n log n) sempre; quicksort é O(n log n) em média e costuma vencer porque a constante dele é menor. É o exemplo do livro de que Big O não conta tudo." en="Merge sort is O(n log n) always; quicksort is O(n log n) on average and usually wins because its constant is smaller. It is the book’s example of Big O not telling everything." /></Callout>
      </Section>
      <Section id="ch5" title={<T pt="Capítulo 5: tabelas hash" en="Chapter 5: hash tables" />}>
        <p><T pt={<>Pense no caixa de um mercado que sabe o preço de tudo de cabeça. Você diz “leite” e ele responde “5 reais” sem folhear um catálogo. A tabela hash é isso: uma estrutura que associa <em>chaves</em> a <em>valores</em> e responde em um passo. Em Python, é o <code>dict</code>.</>} en={<>Think of a supermarket cashier who knows every price by heart. You say “milk” and they answer “$0.99” without flipping through a catalogue. A hash table is that: a structure that maps <em>keys</em> to <em>values</em> and answers in one step. In Python it is the <code>dict</code>.</>} /></p>
        <p><T pt={<>Por dentro há um array e uma <em>função hash</em>: ela recebe a chave e devolve sempre o mesmo índice. A chave “leite” cai na posição 4, por exemplo, e o valor fica lá. Para ler, a função diz onde olhar.</>} en={<>Inside there is an array and a <em>hash function</em>: it takes the key and always returns the same index. The key “milk” lands on slot 4, say, and the value is stored there. To read, the function tells you where to look.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="A função hash transforma a chave num índice do array. Ler ou gravar é um passo só: O(1) em média." en="The hash function turns the key into an array index. Reading or writing is one step: O(1) on average." />}>
          <svg viewBox="0 0 640 258" role="img" aria-label="Tabela hash / Hash table">
            <rect x="20" y="30" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="52" className="pt" textAnchor="middle">maçã</text>
            <text x="65" y="52" className="en" textAnchor="middle">apple</text>
            <rect x="20" y="82" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="104" className="pt" textAnchor="middle">leite</text>
            <text x="65" y="104" className="en" textAnchor="middle">milk</text>
            <rect x="20" y="134" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="156" className="pt" textAnchor="middle">pão</text>
            <text x="65" y="156" className="en" textAnchor="middle">bread</text>
            <rect x="190" y="60" width="110" height="64" rx="10" className="fill" />
            <text x="245" y="88" className="pt inv" textAnchor="middle">função hash</text>
            <text x="245" y="88" className="en inv" textAnchor="middle">hash function</text>
            <text x="245" y="108" className="pt inv" textAnchor="middle">texto → posição</text>
            <text x="245" y="108" className="en inv" textAnchor="middle">text → position</text>
            <path d="M110 47L190 92" className="ln" />
            <path d="M182.0 91.9L190 92L185.8 85.2" className="ln" />
            <path d="M110 99L190 92" className="ln" />
            <path d="M183.3 96.4L190 92L182.7 88.8" className="ln" />
            <path d="M110 151L190 92" className="ln" />
            <path d="M186.6 99.3L190 92L182.1 93.1" className="ln" />
            <rect x="460" y="16" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="36" className="mono">0</text>
            <rect x="460" y="52" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="72" className="mono">1</text>
            <text x="470" y="72" className="pt">maçã: R$ 3</text>
            <text x="470" y="72" className="en">apple: $0.67</text>
            <rect x="460" y="88" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="108" className="mono">2</text>
            <rect x="460" y="124" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="144" className="mono">3</text>
            <text x="470" y="144" className="pt">pão: R$ 7</text>
            <text x="470" y="144" className="en">bread: $1.49</text>
            <rect x="460" y="160" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="180" className="mono">4</text>
            <text x="470" y="180" className="pt">leite: R$ 5</text>
            <text x="470" y="180" className="en">milk: $0.99</text>
            <rect x="460" y="196" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="216" className="mono">5</text>
            <path d="M300 92L458 67" className="ln" />
            <path d="M451.7 71.9L458 67L450.5 64.3" className="ln" />
            <path d="M300 92L458 175" className="ln" />
            <path d="M450.0 175.1L458 175L453.6 168.3" className="ln" />
            <path d="M300 92L458 139" className="ln" />
            <path d="M450.2 140.7L458 139L452.4 133.3" className="ln" />
            <text x="320" y="246" className="pt mut" textAnchor="middle">Mesma chave, mesma posição, sempre. Por isso achar um item não exige percorrer a lista.</text>
            <text x="320" y="246" className="en mut" textAnchor="middle">Same key, same position, always. That is why finding an item needs no walk through the list.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`voted = {}


def check_voter(name):
    if voted.get(name):                 # O(1) on average
        return "send them away"
    voted[name] = True
    return "let them vote"`} />
        <h3><T pt="Usos" en="Uses" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Busca por nome:</em> agenda de telefones, DNS (domínio → IP).</>} en={<><em>Lookup by name:</em> phone book, DNS (domain → IP).</>} /></li>
          <li><T pt={<><em>Evitar duplicados:</em> a lista de quem já votou (o exemplo do código).</>} en={<><em>Avoiding duplicates:</em> the list of who already voted (the code example).</>} /></li>
          <li><T pt={<><em>Cache:</em> guardar o resultado de uma consulta cara para não repeti-la.</>} en={<><em>Caching:</em> keep the result of an expensive query so you do not repeat it.</>} /></li>
        </ul>
        <h3><T pt="Colisões e fator de carga" en="Collisions and load factor" /></h3>
        <p><T pt={<>Uma <em>colisão</em> acontece quando duas chaves dão o mesmo índice. A saída comum é guardar uma lista curta naquela posição. Se a lista crescer demais, a busca vira O(n). Para evitar isso: uma boa função hash (espalha bem) e um <em>fator de carga</em> baixo, que é itens ÷ posições. Quando passa de uns 0,7, a tabela cresce e redistribui os itens.</>} en={<>A <em>collision</em> happens when two keys give the same index. The common fix is to keep a short list at that slot. If the list grows too long, lookup becomes O(n). To avoid it: a good hash function (spreads well) and a low <em>load factor</em>, which is items ÷ slots. Past roughly 0.7 the table grows and redistributes the items.</>} /></p>
        <Table
          head={[<T pt="Operação" en="Operation" />, <T pt="Média" en="Average" />, <T pt="Pior caso" en="Worst case" />]}
          rows={[
            [<T pt="buscar" en="search" />, <code>O(1)</code>, <code>O(n)</code>],
            [<T pt="inserir" en="insert" />, <code>O(1)</code>, <code>O(n)</code>],
            [<T pt="apagar" en="delete" />, <code>O(1)</code>, <code>O(n)</code>],
          ]}
        />
      </Section>
      <Section id="ch6" title={<T pt="Capítulo 6: busca em largura" en="Chapter 6: breadth-first search" />}>
        <p><T pt={<>Um <em>grafo</em> é um conjunto de nós ligados por arestas: pessoas e amizades, cidades e estradas, páginas e links. A <em>busca em largura</em> (BFS) responde a duas perguntas: <em>existe um caminho de A até B?</em> e <em>qual é o menor, em número de passos?</em></>} en={<>A <em>graph</em> is a set of nodes joined by edges: people and friendships, cities and roads, pages and links. <em>Breadth-first search</em> (BFS) answers two questions: <em>is there a path from A to B?</em> and <em>which is the shortest, in number of steps?</em></>} /></p>
        <p><T pt="O exemplo do livro: você quer achar, entre seus amigos, alguém que venda manga. Primeiro pergunta aos amigos diretos; se nenhum vende, pergunta aos amigos dos amigos, e assim por diante. Os mais próximos são verificados antes dos mais distantes, e por isso o primeiro vendedor encontrado está no menor caminho." en="The book’s example: you want to find a mango seller among your contacts. First you ask your direct friends; if none sells, you ask friends of friends, and so on. The nearest are checked before the farthest, so the first seller found is on the shortest path." /></p>
        <Diagram minWidth={560} caption={<T pt="A busca em largura visita por círculos: o que está a 1 passo vem antes do que está a 2 passos." en="Breadth-first search visits ring by ring: what is 1 step away comes before what is 2 steps away." />}>
          <svg viewBox="0 0 640 246" role="img" aria-label="Grafo de amigos / Friends graph">
            <path d="M320 44L140 86" className="ln" />
            <path d="M320 44L320 86" className="ln" />
            <path d="M320 44L500 86" className="ln" />
            <path d="M140 114L140 166" className="ln" />
            <path d="M320 114L140 166" className="ln" />
            <path d="M320 114L260 166" className="ln" />
            <path d="M500 114L440 166" className="ln" />
            <path d="M500 114L560 166" className="ln" />
            <rect x="284" y="16" width="72" height="28" rx="14" className="fill" />
            <text x="320" y="35" className="inv" textAnchor="middle">you</text>
            <rect x="104" y="86" width="72" height="28" rx="14" className="ln" />
            <text x="140" y="105" textAnchor="middle">alice</text>
            <rect x="284" y="86" width="72" height="28" rx="14" className="ln" />
            <text x="320" y="105" textAnchor="middle">bob</text>
            <rect x="464" y="86" width="72" height="28" rx="14" className="ln" />
            <text x="500" y="105" textAnchor="middle">claire</text>
            <rect x="104" y="166" width="72" height="28" rx="14" className="ln" />
            <text x="140" y="185" textAnchor="middle">peggy</text>
            <rect x="224" y="166" width="72" height="28" rx="14" className="ln" />
            <text x="260" y="185" textAnchor="middle">anuj</text>
            <rect x="404" y="166" width="72" height="28" rx="14" className="ln" />
            <text x="440" y="185" textAnchor="middle">thom</text>
            <rect x="524" y="166" width="72" height="28" rx="14" className="ln" />
            <text x="560" y="185" textAnchor="middle">jonny</text>
            <text x="8" y="34" className="pt mut">círculo 0</text>
            <text x="8" y="34" className="en mut">ring 0</text>
            <text x="8" y="104" className="pt mut">círculo 1</text>
            <text x="8" y="104" className="en mut">ring 1</text>
            <text x="8" y="184" className="pt mut">círculo 2</text>
            <text x="8" y="184" className="en mut">ring 2</text>
            <text x="320" y="232" className="pt mut" textAnchor="middle">Primeiro todos os amigos, depois os amigos dos amigos. A fila garante essa ordem.</text>
            <text x="320" y="232" className="en mut" textAnchor="middle">First all friends, then friends of friends. The queue guarantees that order.</text>
          </svg>
        </Diagram>
        <p><T pt={<>A ferramenta é uma <em>fila</em> (primeiro a entrar, primeiro a sair, como a fila do banco). Os amigos entram na fila; ao tirar alguém, você o verifica e coloca os amigos dele no fim. E guarde quem já foi verificado: sem isso, Alice e Bob (amigos de Peggy) fariam você verificar Peggy duas vezes e, em grafos com ciclos, nunca terminar.</>} en={<>The tool is a <em>queue</em> (first in, first out, like a bank line). Friends join the queue; when you take someone out you check them and add their friends at the end. And remember who was already checked: without that, Alice and Bob (both friends of Peggy) would make you check Peggy twice and, in graphs with cycles, never finish.</>} /></p>
        <CodeBlock code={`from collections import deque

graph = {
    "you": ["alice", "bob", "claire"],
    "bob": ["anuj", "peggy"],
    "alice": ["peggy"],
    "claire": ["thom", "jonny"],
    "anuj": [], "peggy": [], "thom": [], "jonny": [],
}


def is_seller(name):
    return name.endswith("m")           # in the book: "name ends with m"


def search(start):
    queue = deque(graph[start])
    searched = set()
    while queue:
        person = queue.popleft()        # first in, first out
        if person in searched:
            continue
        if is_seller(person):
            return person
        queue.extend(graph[person])
        searched.add(person)
    return None`} />
        <p><T pt={<><strong>Custo:</strong> O(V + E), onde V são os nós (vértices) e E as arestas: cada pessoa entra na fila uma vez e cada amizade é olhada uma vez.</>} en={<><strong>Cost:</strong> O(V + E), where V is the nodes (vertices) and E the edges: each person enters the queue once and each friendship is looked at once.</>} /></p>
        <h3><T pt="Árvores e ordenação topológica" en="Trees and topological sort" /></h3>
        <p><T pt={<>Uma <em>árvore</em> é um grafo sem ciclos e com uma raiz (como uma árvore genealógica ou as pastas do computador). E, se as arestas têm sentido e dependem umas das outras (“escovar os dentes depende de acordar”), a <em>ordenação topológica</em> monta uma lista de tarefas respeitando as dependências: é o que um gerenciador de pacotes faz.</>} en={<>A <em>tree</em> is a graph without cycles and with a root (like a family tree or the folders on your computer). And if edges have a direction and depend on each other (“brushing teeth depends on waking up”), <em>topological sort</em> builds a task list that respects the dependencies: it is what a package manager does.</>} /></p>
      </Section>
      <Section id="ch7" title={<T pt="Capítulo 7: algoritmo de Dijkstra" en="Chapter 7: Dijkstra’s algorithm" />}>
        <p><T pt={<>A busca em largura acha o caminho com menos <em>passos</em>. Mas e se cada aresta tiver um custo (minutos, quilômetros, reais)? Num grafo <em>ponderado</em>, o caminho com menos passos pode ser o mais caro. Dijkstra acha o caminho de <em>menor custo total</em>.</>} en={<>Breadth-first search finds the path with the fewest <em>steps</em>. But what if each edge has a cost (minutes, kilometres, money)? In a <em>weighted</em> graph the path with fewest steps can be the most expensive one. Dijkstra finds the path of <em>lowest total cost</em>.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Com pesos, o menor número de passos deixa de ser o melhor caminho. Dijkstra procura o menor custo total." en="With weights, the fewest steps is no longer the best path. Dijkstra looks for the lowest total cost." />}>
          <svg viewBox="0 0 640 246" role="img" aria-label="Grafo com pesos / Weighted graph">
            <path d="M97 93L271 48" className="ln dash" />
            <path d="M265.2 53.5L271 48L263.2 46.0" className="ln dash" />
            <text x="180" y="56" className="mono" textAnchor="middle">6</text>
            <path d="M97 107L271 152" className="ln" />
            <path d="M263.2 154.0L271 152L265.2 146.5" className="ln" />
            <text x="180" y="146" className="mono" textAnchor="middle">2</text>
            <path d="M300 132L300 70" className="ln" />
            <path d="M303.8 77.0L300 70L296.2 77.0" className="ln" />
            <text x="318" y="100" className="mono" textAnchor="middle">3</text>
            <path d="M327 47L521 93" className="ln" />
            <path d="M513.3 95.1L521 93L515.1 87.6" className="ln" />
            <text x="440" y="56" className="mono" textAnchor="middle">1</text>
            <path d="M327 153L521 107" className="ln dash" />
            <path d="M515.1 112.4L521 107L513.3 104.9" className="ln dash" />
            <text x="440" y="146" className="mono" textAnchor="middle">5</text>
            <circle cx="70" cy="100" r="28" className="ln" />
            <text x="70" y="105" className="pt" textAnchor="middle">início</text>
            <text x="70" y="105" className="en" textAnchor="middle">start</text>
            <circle cx="300" cy="40" r="28" className="ln" />
            <text x="300" y="45" textAnchor="middle">A</text>
            <circle cx="300" cy="160" r="28" className="ln" />
            <text x="300" y="165" textAnchor="middle">B</text>
            <circle cx="550" cy="100" r="28" className="ln" />
            <text x="550" y="105" className="pt" textAnchor="middle">fim</text>
            <text x="550" y="105" className="en" textAnchor="middle">end</text>
            <text x="320" y="214" className="pt mut" textAnchor="middle">Caminho mais barato (linha cheia): início → B → A → fim = 2 + 3 + 1 = 6</text>
            <text x="320" y="214" className="en mut" textAnchor="middle">Cheapest path (solid line): start → B → A → end = 2 + 3 + 1 = 6</text>
            <text x="320" y="234" className="pt mut" textAnchor="middle">O caminho com menos passos (início → A → fim) custa 7.</text>
            <text x="320" y="234" className="en mut" textAnchor="middle">The path with fewer steps (start → A → end) costs 7.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><T pt="Encontre o nó mais barato de alcançar que ainda não foi processado." en="Find the cheapest node still unprocessed." /></li>
          <li><T pt="Atualize o custo de seus vizinhos: se passar por este nó sai mais barato, guarde o novo custo e o “pai”." en="Update its neighbours’ costs: if going through this node is cheaper, store the new cost and the “parent”." /></li>
          <li><T pt="Marque o nó como processado e repita até chegar ao destino." en="Mark the node as processed and repeat until you reach the target." /></li>
          <li><T pt="Siga os “pais” de trás para frente para montar o caminho." en="Follow the “parents” backwards to rebuild the path." /></li>
        </ol>
        <CodeBlock code={`import heapq

graph = {
    "start": {"a": 6, "b": 2},
    "a": {"end": 1},
    "b": {"a": 3, "end": 5},
    "end": {},
}


def dijkstra(graph, source, target):
    costs = {source: 0}
    parents = {}
    heap = [(0, source)]                # (cost, node), smallest cost first
    while heap:
        cost, node = heapq.heappop(heap)
        if node == target:
            break
        if cost > costs.get(node, float("inf")):
            continue                    # outdated entry
        for neighbor, weight in graph[node].items():
            new_cost = cost + weight
            if new_cost < costs.get(neighbor, float("inf")):
                costs[neighbor] = new_cost
                parents[neighbor] = node
                heapq.heappush(heap, (new_cost, neighbor))
    path = [target]
    while path[-1] != source:
        path.append(parents[path[-1]])
    return costs[target], path[::-1]`} />
        <Callout tone="warn" icon="alert"><T pt={<>Dijkstra não funciona com pesos negativos (o truque de “o mais barato agora nunca melhora depois” deixa de valer). Para isso existe o algoritmo de Bellman-Ford. Também só serve a grafos <em>direcionados sem ciclos negativos</em>. Com a fila de prioridade (heap) usada acima, o custo é O((V + E) log V).</>} en="Dijkstra does not work with negative weights (the “cheapest now never improves later” trick no longer holds). For that there is the Bellman-Ford algorithm. With the priority queue (heap) used above the cost is O((V + E) log V)." /></Callout>
      </Section>
      <Section id="ch8" title={<T pt="Capítulo 8: algoritmos gulosos e problemas NP-completos" en="Chapter 8: greedy algorithms and NP-complete problems" />}>
        <p><T pt={<>Um algoritmo <em>guloso</em> escolhe, a cada passo, a melhor opção <em>agora</em>, sem olhar para o futuro. Nem sempre dá a resposta perfeita, mas costuma dar uma boa, e rápido.</>} en={<>A <em>greedy</em> algorithm picks, at each step, the best option <em>right now</em>, without looking ahead. It does not always give the perfect answer, but it usually gives a good one, fast.</>} /></p>
        <h3><T pt="Exemplo: marcar aulas numa sala" en="Example: scheduling classes in a room" /></h3>
        <p><T pt="Muitas aulas disputam a mesma sala e você quer caber o máximo delas. Estratégia gulosa: pegue a aula que termina mais cedo, descarte as que se sobrepõem a ela, repita. Esse caso específico é ótimo, não só aproximado." en="Many classes compete for the same room and you want to fit as many as possible. Greedy strategy: take the class that ends earliest, discard those that overlap it, repeat. This particular case is optimal, not just approximate." /></p>
        <h3><T pt="Exemplo: cobertura de estações de rádio" en="Example: covering states with radio stations" /></h3>
        <p><T pt="Você quer que seu programa de rádio chegue a 8 estados usando o menor número de estações, e cada estação cobre alguns estados. Testar todas as combinações é O(2ⁿ). O guloso escolhe a estação que cobre mais estados ainda descobertos, repete, e termina rápido (aqui, 4 estações)." en="You want your radio show to reach 8 states using as few stations as possible, and each station covers a few states. Trying every combination is O(2ⁿ). The greedy picks the station covering the most still-uncovered states, repeats, and finishes fast (here, 4 stations)." /></p>
        <CodeBlock code={`states_needed = {"mt", "wa", "or", "id", "nv", "ut", "ca", "az"}
stations = {
    "kone": {"id", "nv", "ut"},
    "ktwo": {"wa", "id", "mt"},
    "kthree": {"or", "nv", "ca"},
    "kfour": {"nv", "ut"},
    "kfive": {"ca", "az"},
}

final_stations = set()
while states_needed:
    best_station, states_covered = None, set()
    for station, states in stations.items():
        covered = states_needed & states
        if len(covered) > len(states_covered):
            best_station, states_covered = station, covered
    states_needed -= states_covered
    final_stations.add(best_station)`} />
        <h3><T pt="NP-completo" en="NP-complete" /></h3>
        <p><T pt={<>Há problemas para os quais ninguém conhece um algoritmo rápido, como o caixeiro-viajante e a cobertura de conjuntos acima. Eles são chamados <em>NP-completos</em>. O livro dá pistas para reconhecer um: o algoritmo roda rápido com poucos itens e fica absurdamente lento quando eles aumentam; o enunciado fala em “todas as combinações” ou “todas as ordens”; você não consegue dividir em subproblemas menores. Nesses casos, em vez de procurar a resposta perfeita, use um algoritmo de <em>aproximação</em> (como o guloso) e aceite uma resposta boa.</>} en={<>There are problems for which nobody knows a fast algorithm, like the travelling salesperson and the set cover above. They are called <em>NP-complete</em>. The book gives clues to spot one: the algorithm is fast with few items and absurdly slow as they grow; the statement says “all combinations” or “all orders”; you cannot break it into smaller subproblems. In those cases, instead of chasing the perfect answer, use an <em>approximation</em> algorithm (like the greedy one) and accept a good answer.</>} /></p>
      </Section>
      <Section id="ch9" title={<T pt="Capítulo 9: programação dinâmica" en="Chapter 9: dynamic programming" />}>
        <p><T pt={<>Programação dinâmica resolve um problema difícil quebrando-o em subproblemas menores, <em>resolvendo cada um uma só vez</em> e guardando as respostas numa tabela (grade). O truque é descobrir quais são os subproblemas.</>} en={<>Dynamic programming solves a hard problem by splitting it into smaller subproblems, <em>solving each one only once</em> and storing the answers in a table (grid). The trick is finding what the subproblems are.</>} /></p>
        <h3><T pt="Problema da mochila" en="The knapsack problem" /></h3>
        <p><T pt="Você é ladrão (hipoteticamente) com uma mochila que aguenta 4 kg. Itens: violão (1 kg, R$ 1.500), aparelho de som (4 kg, R$ 3.000) e notebook (3 kg, R$ 2.000). O guloso levaria o som (o mais caro) e ficaria com R$ 3.000. A grade abaixo testa cada capacidade de 1 a 4 kg, adicionando um item por linha. Cada célula é o maior valor possível com os itens até aquela linha e aquele peso." en="You are a (hypothetical) thief with a knapsack that holds 4 kg. Items: guitar (1 kg, $1,500), stereo (4 kg, $3,000) and laptop (3 kg, $2,000). Greedy would take the stereo (the priciest) and end with $3,000. The grid below tests each capacity from 1 to 4 kg, adding one item per row. Each cell is the best value possible using the items up to that row and that weight." /></p>
        <Table
          head={[null, "1 kg", "2 kg", "3 kg", "4 kg"]}
          rows={[
            [<T pt="violão (1 kg)" en="guitar (1 kg)" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />],
            [<T pt="som (4 kg)" en="stereo (4 kg)" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />, <T pt="3.000" en="3,000" />],
            [<T pt="notebook (3 kg)" en="laptop (3 kg)" />, <T pt="1.500" en="1,500" />, <T pt="1.500" en="1,500" />, <T pt="2.000" en="2,000" />, <strong><T pt="3.500" en="3,500" /></strong>],
          ]}
        />
        <p><T pt={<>A última célula vem da fórmula: <code>max(valor sem o item, valor do item + melhor com o peso que sobra)</code>. Para o notebook com 4 kg: máximo entre 3.000 (de cima) e 2.000 + 1.500 (notebook + o melhor com 1 kg) = 3.500. A resposta é violão + notebook.</>} en={<>The last cell comes from the formula: <code>max(value without the item, item value + best with the leftover weight)</code>. For the laptop at 4 kg: the max of 3,000 (from above) and 2,000 + 1,500 (laptop + the best at 1 kg) = 3,500. The answer is guitar + laptop.</>} /></p>
        <CodeBlock code={`def knapsack(items, capacity):          # items: [(name, weight, value)]
    grid = [[0] * (capacity + 1) for _ in range(len(items) + 1)]
    for i, (name, weight, value) in enumerate(items, start=1):
        for w in range(1, capacity + 1):
            best = grid[i - 1][w]                       # without this item
            if weight <= w:
                best = max(best, value + grid[i - 1][w - weight])
            grid[i][w] = best
    return grid[-1][-1]`} />
        <p><T pt="Custo: O(itens × capacidade), muito melhor que testar todos os subconjuntos (O(2ⁿ))." en="Cost: O(items × capacity), far better than trying every subset (O(2ⁿ))." /></p>
        <h3><T pt="Maior subsequência e maior substring comum" en="Longest common substring and subsequence" /></h3>
        <p><T pt={<>O mesmo molde de grade serve para comparar duas palavras, como faz um corretor ortográfico ou o <code>diff</code> do git. Para <em>fish</em> e <em>hish</em>, a maior substring comum (letras seguidas) é <em>ish</em>, de tamanho 3. A <em>subsequência</em> aceita letras não vizinhas, desde que na mesma ordem: <em>fosh</em> e <em>fish</em> compartilham <em>fsh</em> (3).</>} en={<>The same grid template compares two words, as a spell checker or git’s <code>diff</code> does. For <em>fish</em> and <em>hish</em>, the longest common substring (consecutive letters) is <em>ish</em>, length 3. A <em>subsequence</em> allows non-adjacent letters in the same order: <em>fosh</em> and <em>fish</em> share <em>fsh</em> (3).</>} /></p>
        <CodeBlock code={`def longest_common_substring(a, b):
    best = 0
    cell = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cell[i][j] = cell[i - 1][j - 1] + 1
                best = max(best, cell[i][j])
    return best


def longest_common_subsequence(a, b):
    cell = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cell[i][j] = cell[i - 1][j - 1] + 1
            else:
                cell[i][j] = max(cell[i - 1][j], cell[i][j - 1])
    return cell[-1][-1]`} />
        <Callout tone="good" icon="check"><T pt="Dica do livro para reconhecer programação dinâmica: o problema pede para otimizar algo sob uma restrição (valor com limite de peso) e pode ser quebrado em subproblemas que não dependem uns dos outros." en="The book’s hint for spotting dynamic programming: the problem asks you to optimize something under a constraint (value within a weight limit) and can be split into subproblems that do not depend on each other." /></Callout>
      </Section>
      <Section id="ch10" title={<T pt="Capítulo 10: k-vizinhos mais próximos" en="Chapter 10: k-nearest neighbours" />}>
        <p><T pt={<>Para classificar algo novo, olhe o que se parece com ele. É o k-NN. O exemplo do livro: frutas. Se você tem laranjas e toranjas num gráfico de tamanho × cor e aparece uma fruta nova, olhe as <em>k</em> mais próximas (por exemplo 3) e vote: se a maioria for toranja, é toranja.</>} en={<>To classify something new, look at what resembles it. That is k-NN. The book’s example: fruit. If you have oranges and grapefruits on a size × colour chart and a new fruit shows up, look at the nearest <em>k</em> (say 3) and vote: if most are grapefruit, it is a grapefruit.</>} /></p>
        <p><T pt={<>“Perto” é calculado com a fórmula da distância. Com duas características é o teorema de Pitágoras; com cinco, a mesma conta com mais termos: <code>√((a₁−b₁)² + (a₂−b₂)² + …)</code>. O livro usa isso para recomendar filmes: cada pessoa vira um ponto (as notas que deu a cada gênero) e você recomenda o que a pessoa mais próxima gostou.</>} en={<>“Near” is computed with the distance formula. With two features it is the Pythagorean theorem; with five, the same sum with more terms: <code>√((a₁−b₁)² + (a₂−b₂)² + …)</code>. The book uses this to recommend movies: each person becomes a point (the ratings they gave to each genre) and you recommend what the nearest person liked.</>} /></p>
        <CodeBlock code={`from math import sqrt

ratings = {                 # comedy, action, drama, horror, romance (invented)
    "priyanka": (3, 4, 4, 1, 4),
    "justin": (4, 3, 5, 1, 5),
    "morpheus": (2, 5, 1, 3, 1),
}


def distance(a, b):
    return sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def nearest(name, k=1):
    others = [(distance(ratings[name], r), n) for n, r in ratings.items() if n != name]
    return sorted(others)[:k]`} />
        <p><T pt={<>Aqui <code>nearest("priyanka")</code> devolve Justin (distância 2,0), então os filmes que Justin adorou são bons candidatos para Priyanka. (Notas inventadas, só para ilustrar.)</>} en={<>Here <code>nearest("priyanka")</code> returns Justin (distance 2.0), so the movies Justin loved are good candidates for Priyanka. (Invented ratings, for illustration only.)</>} /></p>
        <h3><T pt="Regressão, escolha de características e aprendizado de máquina" en="Regression, picking features and machine learning" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Classificação</em> responde “a qual grupo pertence?” (sim/não, laranja/toranja). <em>Regressão</em> responde “quanto?”: prever uma nota ou quantos pães vender amanhã tirando a média dos vizinhos.</>} en={<><em>Classification</em> answers “which group does it belong to?” (yes/no, orange/grapefruit). <em>Regression</em> answers “how much?”: predict a rating or how many loaves to sell tomorrow by averaging the neighbours.</>} /></li>
          <li><T pt={<>Escolher boas <em>características</em> é o que mais pesa: devem estar ligadas ao que se quer prever e não podem ter viés (por exemplo, pedir só notas de quem ama comédia).</>} en={<>Picking good <em>features</em> matters most: they must relate to what you predict and must not be biased (for example, asking only people who love comedy).</>} /></li>
          <li><T pt="Com a distância do cosseno, em vez da euclidiana, duas pessoas que dão notas altas e baixas em padrões parecidos são vizinhas mesmo que uma seja mais generosa." en="With cosine similarity instead of Euclidean distance, two people who give highs and lows in similar patterns are neighbours even if one is more generous." /></li>
          <li><T pt="O k-NN é a porta de entrada do aprendizado de máquina: reconhecimento de dígitos (OCR), filtro de spam e recomendação, em que o modelo é “treinado” com exemplos já conhecidos." en="k-NN is the gateway to machine learning: digit recognition (OCR), spam filters and recommendation, where the model is “trained” on known examples." /></li>
        </ul>
      </Section>
      <Section id="ch11" title={<T pt="Capítulo 11: para onde ir depois" en="Chapter 11: where to go next" />}>
        <p><T pt="O último capítulo é um mapa rápido de dez ideias para estudar em seguida, cada uma com uma frase de apresentação." en="The last chapter is a quick map of ideas to study next, each with a one-line introduction." /></p>
        <Table
          head={[<T pt="Tema" en="Topic" />, <T pt="Para que serve" en="What it is for" />]}
          rows={[
            [<T pt="Árvores (binárias, de busca, B-trees)" en="Trees (binary, search, B-trees)" />, <T pt="Guardam dados ordenados com inserção e busca em O(log n); bancos de dados usam B-trees." en="Keep data sorted with insert and search in O(log n); databases use B-trees." />],
            [<T pt="Índice invertido" en="Inverted index" />, <T pt="Mapeia cada palavra às páginas em que aparece, a base de um buscador." en="Maps each word to the pages where it appears; the base of a search engine." />],
            [<T pt="Transformada de Fourier" en="Fourier transform" />, <T pt="Separa uma onda nos sons (frequências) que a compõem; usada em música e compressão." en="Splits a wave into the tones (frequencies) that make it up; used in music and compression." />],
            [<T pt="Algoritmos paralelos" en="Parallel algorithms" />, <T pt="Usam vários núcleos do processador ao mesmo tempo." en="Use several processor cores at the same time." />],
            [<T pt="MapReduce" en="MapReduce" />, <T pt="Divide um trabalho enorme entre muitas máquinas (map) e junta os resultados (reduce)." en="Splits a huge job across many machines (map) and combines results (reduce)." />],
            [<T pt="Filtros de Bloom e HyperLogLog" en="Bloom filters and HyperLogLog" />, <T pt="Estruturas probabilísticas: usam pouquíssima memória em troca de uma pequena margem de erro." en="Probabilistic structures: tiny memory in exchange for a small margin of error." />],
            [<T pt="Funções SHA" en="SHA functions" />, <T pt="Transformam qualquer texto numa impressão digital fixa; servem para verificar arquivos e guardar senhas." en="Turn any text into a fixed fingerprint; used to verify files and store passwords." />],
            [<T pt="Hash sensível à localidade" en="Locality-sensitive hashing" />, <T pt="Itens parecidos geram hashes parecidos, o que ajuda a achar semelhantes." en="Similar items give similar hashes, which helps find look-alikes." />],
            [<T pt="Diffie-Hellman e RSA" en="Diffie-Hellman and RSA" />, <T pt="Criptografia de chave pública: duas pessoas combinam um segredo sem nunca o enviar." en="Public-key cryptography: two people agree on a secret without ever sending it." />],
            [<T pt="Programação linear" en="Linear programming" />, <T pt="Maximiza algo sob restrições; o algoritmo Simplex resolve muitos problemas de grafos." en="Maximizes something under constraints; the Simplex algorithm solves many graph problems." />],
          ]}
        />
      </Section>
      <Section id="cheat" title={<T pt="Resumo: algoritmo e Big O" en="Cheat sheet: algorithm and Big O" />}>
        <Table
          head={[<T pt="Algoritmo ou estrutura" en="Algorithm or structure" />, <T pt="Big O" en="Big O" />, <T pt="Use quando" en="Use when" />]}
          rows={[
            [<T pt="busca simples" en="simple search" />, <code>O(n)</code>, <T pt="a lista não está ordenada" en="the list is not sorted" />],
            [<T pt="busca binária" en="binary search" />, <code>O(log n)</code>, <T pt="a lista está ordenada" en="the list is sorted" />],
            [<T pt="ordenação por seleção" en="selection sort" />, <code>O(n²)</code>, <T pt="só para estudar" en="only for study" />],
            ["quicksort", <T pt={<><code>O(n log n)</code> em média</>} en={<><code>O(n log n)</code> average</>} />, <T pt="ordenar na prática" en="sorting in practice" />],
            [<T pt="tabela hash" en="hash table" />, <T pt={<><code>O(1)</code> em média</>} en={<><code>O(1)</code> average</>} />, <T pt="achar por nome, evitar duplicados, cache" en="lookup by name, avoiding duplicates, cache" />],
            [<T pt="busca em largura" en="breadth-first search" />, <code>O(V + E)</code>, <T pt="menor número de passos" en="fewest steps" />],
            ["Dijkstra", <code>O((V + E) log V)</code>, <T pt="menor custo, pesos não negativos" en="lowest cost, non-negative weights" />],
            [<T pt="guloso" en="greedy" />, <T pt="depende" en="depends" />, <T pt="o problema é NP-completo e basta uma boa resposta" en="the problem is NP-complete and a good answer is enough" />],
            [<T pt="programação dinâmica" en="dynamic programming" />, <T pt={<><code>O(itens × capacidade)</code></>} en={<><code>O(items × capacity)</code></>} />, <T pt="otimizar sob restrição, com subproblemas" en="optimizing under a constraint, with subproblems" />],
            ["k-NN", <T pt={<><code>O(n)</code> por consulta</>} en={<><code>O(n)</code> per query</>} />, <T pt="classificar ou prever por semelhança" en="classifying or predicting by similarity" />],
          ]}
        />
      </Section>
      <Section id="apply" title={<T pt="Como estudar e aplicar" en="How to study and apply" />}>
        <ol className="ds-steps">
          <li><T pt={<>Antes de escrever um laço dentro de outro, pergunte: isto é O(n²)? Dá para trocar um dos laços por um <code>dict</code> ou um <code>set</code>?</>} en={<>Before writing a loop inside another, ask: is this O(n²)? Can one of the loops be replaced by a <code>dict</code> or a <code>set</code>?</>} /></li>
          <li><T pt={<>Antes de buscar muitas vezes numa lista, considere ordená-la (e usar <code>bisect</code>) ou convertê-la num <code>set</code>.</>} en={<>Before searching a list many times, consider sorting it (and using <code>bisect</code>) or converting it to a <code>set</code>.</>} /></li>
          <li><T pt="Para relações entre coisas (amigos, rotas, dependências), desenhe o grafo primeiro; quase sempre é BFS ou Dijkstra." en="For relationships between things (friends, routes, dependencies), draw the graph first; it is almost always BFS or Dijkstra." /></li>
          <li><T pt="Se o problema parece exigir “todas as combinações”, suspeite de NP-completo e procure uma aproximação." en="If the problem seems to require “all the combinations”, suspect NP-complete and look for an approximation." /></li>
          <li><T pt="Para praticar: implemente cada código desta nota sem olhar, depois cronometre com listas de 1.000, 10.000 e 100.000 itens e confira se o tempo cresce como o Big O prevê." en="To practise: implement each snippet in this note without looking, then time it with lists of 1,000, 10,000 and 100,000 items and check that the time grows as Big O predicts." /></li>
        </ol>
        <Callout tone="personal" icon="check"><T pt="Anotação pessoal: este resumo segue a ordem do livro, mas escolhe e simplifica. Os exemplos centrais (adivinhar um número, caixeiro-viajante, mochila, estações de rádio, amigos vendedores de manga, preços do mercado) vêm do livro; as tabelas de passos, os códigos e os exemplos marcados como inventados são meus e foram executados para conferir os resultados." en="Personal note: this summary follows the book’s order but picks and simplifies. The central examples (guessing a number, travelling salesperson, knapsack, radio stations, mango-seller friends, grocery prices) come from the book; the step tables, the code and the examples marked as invented are mine, and were run to check the results." /></Callout>
      </Section>
      <div className="sources">
        <b><T pt="Fonte" en="Source" /></b>
        <ul>
          <li><a href="https://www.manning.com/books/grokking-algorithms" rel="noopener">Aditya Bhargava. Grokking Algorithms (Entendendo Algoritmos). Manning, 2016; edição brasileira: Novatec.</a></li>
        </ul>
      </div>
    </>
  );
}
