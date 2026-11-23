import { Callout, CodeBlock, Diagram, Section, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "entendendo-algoritmos",
  title: "Entendendo Algoritmos (livro)",
  seo: {
    title: "Entendendo Algoritmos, notas do livro",
    description: "Um passeio didático pelo livro Entendendo Algoritmos (Grokking Algorithms): notação Big O, busca binária, ordenação, recursão, tabelas hash, grafos, Dijkstra, algoritmos gulosos, programação dinâmica e k-vizinhos mais próximos, com exemplos simples e código.",
  },
  summary: "notas do livro sobre notação Big O, pesquisa binária, ordenação, recursão, tabelas hash, grafos, Dijkstra, algoritmos gulosos, programação dinâmica e k vizinhos mais próximos, com exemplos e código.",
  kicker: "Notas de livro",
  heroTitle: <>Algoritmos, <em>e a velocidade com que crescem.</em></>,
  heroLede: "Um passeio didático por Entendendo Algoritmos: primeiro a notação Big O, depois cada algoritmo do livro, com exemplos do dia a dia e códigos curtos em Python.",
  published: "2026-10-17",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "idea", title: "O livro e o mapa" },
        { id: "bigo", title: "Notação Big O" },
        { id: "ch1", title: "1. Busca binária" },
        { id: "ch2", title: "2. Ordenação por seleção" },
        { id: "ch3", title: "3. Recursão" },
        { id: "ch4", title: "4. Quicksort" },
        { id: "ch5", title: "5. Tabelas hash" },
        { id: "ch6", title: "6. Busca em largura" },
        { id: "ch7", title: "7. Dijkstra" },
        { id: "ch8", title: "8. Algoritmos gulosos" },
        { id: "ch9", title: "9. Programação dinâmica" },
        { id: "ch10", title: "10. k-vizinhos mais próximos" },
        { id: "ch11", title: "11. Para onde ir depois" },
        { id: "cheat", title: "Resumo" },
        { id: "apply", title: "Como estudar e aplicar" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="idea" title={"O livro e o mapa"}>
        <p><em>Entendendo Algoritmos</em> (<em>Grokking Algorithms</em>, de Aditya Bhargava) ensina algoritmos com desenhos e exemplos do dia a dia, sem exigir matemática pesada. Um algoritmo é só uma receita: uma sequência de passos que resolve um problema. A pergunta do livro é sempre a mesma: <em>existe um jeito mais rápido de fazer isso?</em></p>
        <p>Para responder, o livro usa uma régua: a notação Big O. Por isso esta nota começa por ela e depois percorre os capítulos na ordem do livro. Cada algoritmo vem com a ideia, um exemplo e um código curto em Python.</p>
        <Table
          head={["Capítulo", "Tema", "Ideia em uma frase"]}
          rows={[
            ["1", "Busca binária e Big O", "Dividir ao meio vence olhar um por um."],
            ["2", "Ordenação por seleção", "Como os dados ficam na memória muda o custo."],
            ["3", "Recursão", "Resolver um problema resolvendo uma versão menor."],
            ["4", "Quicksort", "Dividir e conquistar."],
            ["5", "Tabelas hash", "Achar pelo nome em um passo só."],
            ["6", "Busca em largura", "Caminho com menos passos em um grafo."],
            ["7", "Dijkstra", "Caminho de menor custo com pesos."],
            ["8", "Algoritmos gulosos", "Escolher o melhor agora e aceitar um resultado aproximado."],
            ["9", "Programação dinâmica", "Resolver subproblemas e guardar as respostas."],
            ["10", "k-NN", "Classificar olhando os vizinhos mais parecidos."],
            ["11", "Próximos passos", "Um mapa do que estudar depois."],
          ]}
        />
      </Section>
      <Section id="bigo" title={"Notação Big O"}>
        <p>Big O responde a uma pergunta: <em>se a entrada ficar maior, quanto mais trabalho o algoritmo faz?</em> Ela não mede segundos (isso depende do computador), mede <em>a velocidade de crescimento</em> do número de passos.</p>
        <h3>Um exemplo para começar: o livro de telefones</h3>
        <p>Você quer achar “Moura” numa lista telefônica de 1.000 nomes em ordem alfabética. Um jeito é começar na primeira página e ir lendo: no pior caso, 1.000 passos. Outro é abrir no meio, ver se “Moura” vem antes ou depois e descartar metade: cerca de 10 passos.</p>
        <p>Com 1.000.000 de nomes, o primeiro jeito faz até 1.000.000 de passos; o segundo, cerca de 20. Os dois resolvem o problema, mas crescem de forma muito diferente. Big O dá nome a essa diferença.</p>
        <h3>Como se lê</h3>
        <p><code>O(n)</code> lê-se “O de n”. O <code>n</code> é o tamanho da entrada (quantos itens) e o que está dentro dos parênteses diz como o número de passos cresce com <code>n</code>.</p>
        <Table
          head={["Big O", "Nome", "Exemplo do dia a dia", "Em código"]}
          rows={[
            [<code>O(1)</code>, "constante", "Pegar o primeiro livro da pilha.", <><code>items[0]</code>, ler uma chave de um dicionário</>],
            [<code>O(log n)</code>, "logarítmico", "Achar um nome no dicionário abrindo no meio.", "busca binária"],
            [<code>O(n)</code>, "linear", "Ler uma lista de compras inteira.", <>um <code>for</code> sobre a lista</>],
            [<code>O(n log n)</code>, "linearítmico", "Ordenar uma estante com um bom método.", <>quicksort, merge sort, <code>sorted()</code></>],
            [<code>O(n²)</code>, "quadrático", "Cada pessoa da festa cumprimenta todas as outras.", <>dois <code>for</code> aninhados</>],
            [<code>O(2ⁿ)</code>, "exponencial", "Testar todas as combinações de ligado/desligado de n interruptores.", "todos os subconjuntos, Fibonacci ingênuo"],
            [<code>O(n!)</code>, "fatorial", "Testar todas as ordens possíveis de visitar n cidades.", "todas as permutações"],
          ]}
        />
        <Diagram minWidth={560} caption={"Quanto mais a entrada cresce, mais as curvas se separam. O gráfico corta em 100 passos: O(2ⁿ) já escapou da página em n = 7."}>
          <svg viewBox="0 0 700 302" role="img" aria-label="Curvas de crescimento">
            <path d="M60 20V260H620" className="ln" />
            <text x="340" y="292" className="mut" textAnchor="middle">tamanho da entrada (n)</text>
            <g transform="rotate(-90 22 140)">
              <text x="22" y="140" className="mut" textAnchor="middle">passos</text>
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
        <h3>O que o logaritmo quer dizer</h3>
        <p><code>log₂ 8 = 3</code> responde: “quantas vezes preciso dividir 8 por 2 até chegar em 1?” (8 → 4 → 2 → 1, três vezes). É por isso que O(log n) cresce tão devagar: dobrar a entrada soma <em>um</em> passo. De 1.000 para 2.000 itens a busca binária faz só mais 1 palpite.</p>
        <h3>Quantos passos de verdade?</h3>
        <Table
          head={["Big O", "n = 10", "n = 1.000", "n = 1.000.000"]}
          rows={[
            [<code>O(1)</code>, "1", "1", "1"],
            [<code>O(log n)</code>, "≈ 3", "≈ 10", "≈ 20"],
            [<code>O(n)</code>, "10", "1.000", "1.000.000"],
            [<code>O(n log n)</code>, "≈ 33", "≈ 10.000", "≈ 20.000.000"],
            [<code>O(n²)</code>, "100", "1.000.000", "10¹²"],
            [<code>O(2ⁿ)</code>, "1.024", "≈ 10³⁰¹ (inviável)", "inviável"],
            [<code>O(n!)</code>, "3.628.800", "inviável", "inviável"],
          ]}
        />
        <p>Se cada passo levasse 1 milissegundo, O(n²) com um milhão de itens levaria uns 31 anos, enquanto O(n log n) levaria cerca de 5 horas e meia. A escolha do algoritmo importa mais do que o computador.</p>
        <h3>As quatro regras de bolso</h3>
        <ol className="ds-steps">
          <li><em>Pense no pior caso.</em> Big O costuma dizer quanto o algoritmo pode demorar no pior caso. Na busca simples o pior caso é o item estar na última posição (ou não existir): n passos.</li>
          <li><em>Ignore constantes.</em> Dois laços um depois do outro dão 2n passos, mas escrevemos O(n). Big O compara o <em>formato</em> do crescimento, não o número exato.</li>
          <li><em>Fique com o termo que domina.</em> n² + n é O(n²), porque para n grande o n² engole o n. Um laço seguido de um laço duplo é O(n²).</li>
          <li><em>Laços aninhados multiplicam, laços em sequência somam.</em> Um <code>for</code> dentro de outro: n × n. Um <code>for</code> depois do outro: n + n.</li>
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
        <h3>Memória também conta</h3>
        <p>O mesmo raciocínio vale para o espaço. Somar números com um laço usa uma variável a mais: <code>O(1)</code> de memória. Copiar a lista para outra usa <code>O(n)</code>. Muitas vezes se troca memória por velocidade: a tabela hash do capítulo 5 gasta espaço extra para achar em um passo.</p>
        <Callout tone="warn" icon="alert">Big O não é o fim da história. Ele ignora constantes, e às vezes elas importam: o livro mostra que o quicksort e o merge sort são ambos O(n log n), mas o quicksort costuma ser mais rápido na prática porque a constante dele é menor. Para listas minúsculas, até um O(n²) simples pode ganhar. Meça antes de otimizar.</Callout>
      </Section>
      <Section id="ch1" title={"Capítulo 1: busca binária"}>
        <p>Estou pensando num número de 1 a 100 e você tenta adivinhar. Chutar 1, 2, 3… é a <em>busca simples</em>: no pior caso 100 palpites. Chutar 50 e ouvir “é maior” ou “é menor” é a <em>busca binária</em>: cada palpite elimina metade, e 7 palpites bastam para 100 números.</p>
        <Diagram minWidth={560} caption={"A busca binária joga fora metade das possibilidades a cada passo. A busca simples jogaria fora uma."}>
          <svg viewBox="0 0 640 226" role="img" aria-label="Faixa de busca encolhendo pela metade">
            <rect x="20" y="8" width="520" height="16" className="ln fillsoft" />
            <text x="550" y="21" className="mut">100 números</text>
            <rect x="20" y="32" width="260" height="16" className="ln fillsoft" />
            <text x="290" y="45" className="mut">50 números</text>
            <rect x="20" y="56" width="130" height="16" className="ln fillsoft" />
            <text x="160" y="69" className="mut">25 números</text>
            <rect x="20" y="80" width="68" height="16" className="ln fillsoft" />
            <text x="98" y="93" className="mut">13 números</text>
            <rect x="20" y="104" width="36" height="16" className="ln fillsoft" />
            <text x="66" y="117" className="mut">7 números</text>
            <rect x="20" y="128" width="21" height="16" className="ln fillsoft" />
            <text x="51" y="141" className="mut">4 números</text>
            <rect x="20" y="152" width="10" height="16" className="ln fillsoft" />
            <text x="40" y="165" className="mut">2 números</text>
            <rect x="20" y="176" width="5" height="16" className="fill" />
            <text x="35" y="189" className="mut">1 número</text>
            <text x="320" y="214" className="mut" textAnchor="middle">Cada palpite descarta metade. 100 números: no máximo 7 palpites (2⁷ = 128).</text>
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
          head={["Algoritmo", "Big O", "Exige"]}
          rows={[
            ["busca simples", <code>O(n)</code>, "nada"],
            ["busca binária", <code>O(log n)</code>, <>lista <em>ordenada</em></>],
          ]}
        />
        <Callout tone="good" icon="check">A busca binária só funciona em dados ordenados. Se você vai buscar muitas vezes, vale pagar o custo de ordenar uma vez.</Callout>
        <h3>O problema do caixeiro-viajante</h3>
        <p>O livro fecha o capítulo com um vendedor que precisa passar por n cidades gastando o mínimo de estrada. A solução óbvia testa todas as ordens: O(n!). Com 5 cidades são 120 rotas; com 10, 3,6 milhões; com 20, mais de 2 quintilhões. É o exemplo clássico de um algoritmo que existe, mas é lento demais.</p>
      </Section>
      <Section id="ch2" title={"Capítulo 2: memória e ordenação por seleção"}>
        <p>Antes de ordenar, o livro mostra como os dados ficam na memória. Imagine uma gaveta numerada por onde você guarda coisas.</p>
        <ul className="ds-list">
          <li><em>Array:</em> os itens ficam em gavetas vizinhas. Ler o item de índice 5 é imediato, mas inserir no meio obriga a empurrar todos os seguintes.</li>
          <li><em>Lista encadeada:</em> cada item guarda o endereço do próximo e pode estar em qualquer gaveta. Inserir é fácil (muda um endereço), mas para chegar ao 5º item é preciso passar pelos 4 anteriores.</li>
        </ul>
        <Table
          head={["Operação", "Array", "Lista encadeada"]}
          rows={[
            ["ler um item por posição", <code>O(1)</code>, <code>O(n)</code>],
            ["inserir no meio", <code>O(n)</code>, <><code>O(1)</code>*</>],
            ["apagar no meio", <code>O(n)</code>, <><code>O(1)</code>*</>],
          ]}
        />
        <p>*Depois de já estar na posição. Chegar até ela custa O(n). Na prática, arrays vencem na maioria dos casos porque a leitura é muito usada e os itens vizinhos ficam no cache do processador.</p>
        <h3>Ordenação por seleção</h3>
        <p>A ideia: ache o menor item, passe-o para uma lista nova, repita. Encontrar o menor custa n passos e isso se repete n vezes, então o total é O(n²). (Na verdade n + (n−1) + … + 1, mas Big O ignora a metade, que é uma constante.)</p>
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
        <Callout tone="good" icon="check">Boa para entender, ruim para usar com listas grandes. Na vida real use o <code>sorted()</code> da linguagem, que é O(n log n).</Callout>
      </Section>
      <Section id="ch3" title={"Capítulo 3: recursão"}>
        <p>Recursão é uma função que chama a si mesma com um problema menor. A analogia do livro: procurar a chave numa caixa que tem outras caixas dentro. Você abre uma caixa; se achar uma caixa menor, repete o mesmo processo nela; se achar a chave, para.</p>
        <p>Toda função recursiva precisa de duas partes: o <em>caso base</em>, que para a recursão, e o <em>caso recursivo</em>, que chama a função de novo com algo menor. Sem caso base ela chama a si mesma para sempre, até estourar a memória.</p>
        <CodeBlock code={`def factorial(n):
    if n <= 1:                  # base case: stops the recursion
        return 1
    return n * factorial(n - 1) # recursive case: a smaller problem


def total(numbers):             # sum of a list, no loop
    if not numbers:
        return 0
    return numbers[0] + total(numbers[1:])`} />
        <Diagram minWidth={560} caption={"A pilha de chamadas guarda o que cada chamada ainda precisa fazer. Sem caso base, ela cresce até estourar."}>
          <svg viewBox="0 0 640 184" role="img" aria-label="Pilha de chamadas de factorial(3)">
            <rect x="40" y="20" width="300" height="36" rx="8" className="ln fillsoft" />
            <text x="56" y="43" className="mono">factorial(1)</text>
            <text x="190" y="43" className="mut">devolve 1</text>
            <rect x="40" y="62" width="300" height="36" rx="8" className="ln" />
            <text x="56" y="85" className="mono">factorial(2)</text>
            <text x="190" y="85" className="mut">espera 2 × factorial(1)</text>
            <rect x="40" y="104" width="300" height="36" rx="8" className="ln" />
            <text x="56" y="127" className="mono">factorial(3)</text>
            <text x="190" y="127" className="mut">espera 3 × factorial(2)</text>
            <path d="M380 125L380 40" className="ln" />
            <path d="M383.8 47.0L380 40L376.2 47.0" className="ln" />
            <text x="400" y="90" className="mut">chamadas empilham</text>
            <text x="400" y="108" className="mut">e depois resolvem de cima para baixo</text>
            <text x="40" y="170" className="mut">Topo da pilha: factorial(1) é o caso base e responde sem chamar ninguém.</text>
          </svg>
        </Diagram>
        <h3>A pilha de chamadas</h3>
        <p>O computador guarda as chamadas pendentes numa <em>pilha</em>: a última a entrar é a primeira a sair, como pratos empilhados. Em <code>factorial(3)</code> a pilha chega a 3 chamadas. Cada chamada ocupa memória, então recursão muito profunda usa muito espaço (O(n) para o fatorial).</p>
        <p>Toda recursão pode virar um laço; às vezes o laço é mais barato, às vezes a recursão é mais clara. O livro diz: o laço pode ser mais rápido, a recursão torna a solução mais fácil de entender.</p>
      </Section>
      <Section id="ch4" title={"Capítulo 4: quicksort e dividir e conquistar"}>
        <p><em>Dividir e conquistar</em> (D&amp;C) é um jeito de pensar com dois passos: ache o caso mais simples (o caso base) e descubra como reduzir o problema até ele cair nesse caso.</p>
        <h3>Exemplo: dividir um terreno</h3>
        <p>Você tem um terreno de 1.680 × 640 m e quer dividi-lo em quadrados iguais, os maiores possíveis. Caso base: se um lado é múltiplo do outro, o lado menor é o quadrado. Senão, corte o maior quadrado possível (640 × 640) e repita com o que sobrou (400 × 640), e assim por diante, até sobrar um quadrado de 80 × 80. É o algoritmo de Euclides, e é D&amp;C puro.</p>
        <h3>Quicksort</h3>
        <ol className="ds-steps">
          <li>Escolha um item como <em>pivô</em>.</li>
          <li>Separe o resto em dois grupos: os menores que o pivô e os maiores.</li>
          <li>Ordene cada grupo do mesmo jeito (recursão) e junte: menores + pivô + maiores.</li>
        </ol>
        <CodeBlock code={`def quicksort(items):                   # O(n log n) on average
    if len(items) < 2:                  # base case
        return items
    pivot = items[0]
    smaller = [x for x in items[1:] if x <= pivot]
    larger = [x for x in items[1:] if x > pivot]
    return quicksort(smaller) + [pivot] + quicksort(larger)`} />
        <p><em>Exemplo:</em> <code>[5, 2, 9, 1]</code>, pivô 5. Menores: <code>[2, 1]</code>; maiores: <code>[9]</code>. Ordenando os menores sai <code>[1, 2]</code>. Resultado: <code>[1, 2] + [5] + [9]</code>.</p>
        <h3>Por que O(n log n) e quando vira O(n²)</h3>
        <p>Se o pivô divide a lista mais ou menos ao meio, a pilha tem cerca de log n níveis e cada nível percorre n itens: n × log n. Se o pivô for sempre o menor ou o maior item (por exemplo, a lista já ordenada e o pivô sempre o primeiro), a pilha tem n níveis: O(n²). A defesa é escolher o pivô ao acaso (ou o do meio): na média o resultado é O(n log n).</p>
        <Table
          head={["Caso", "Quicksort", "Quando"]}
          rows={[
            ["médio", <code>O(n log n)</code>, "pivô razoável"],
            ["pior", <code>O(n²)</code>, "pivô sempre extremo"],
          ]}
        />
        <Callout tone="good" icon="check">Merge sort é O(n log n) sempre; quicksort é O(n log n) em média e costuma vencer porque a constante dele é menor. É o exemplo do livro de que Big O não conta tudo.</Callout>
      </Section>
      <Section id="ch5" title={"Capítulo 5: tabelas hash"}>
        <p>Pense no caixa de um mercado que sabe o preço de tudo de cabeça. Você diz “leite” e ele responde “5 reais” sem folhear um catálogo. A tabela hash é isso: uma estrutura que associa <em>chaves</em> a <em>valores</em> e responde em um passo. Em Python, é o <code>dict</code>.</p>
        <p>Por dentro há um array e uma <em>função hash</em>: ela recebe a chave e devolve sempre o mesmo índice. A chave “leite” cai na posição 4, por exemplo, e o valor fica lá. Para ler, a função diz onde olhar.</p>
        <Diagram minWidth={560} caption={"A função hash transforma a chave num índice do array. Ler ou gravar é um passo só: O(1) em média."}>
          <svg viewBox="0 0 640 258" role="img" aria-label="Tabela hash">
            <rect x="20" y="30" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="52" textAnchor="middle">maçã</text>
            <rect x="20" y="82" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="104" textAnchor="middle">leite</text>
            <rect x="20" y="134" width="90" height="34" rx="8" className="ln" />
            <text x="65" y="156" textAnchor="middle">pão</text>
            <rect x="190" y="60" width="110" height="64" rx="10" className="fill" />
            <text x="245" y="88" className="inv" textAnchor="middle">função hash</text>
            <text x="245" y="108" className="inv" textAnchor="middle">texto → posição</text>
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
            <text x="470" y="72">maçã: R$ 3</text>
            <rect x="460" y="88" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="108" className="mono">2</text>
            <rect x="460" y="124" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="144" className="mono">3</text>
            <text x="470" y="144">pão: R$ 7</text>
            <rect x="460" y="160" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="180" className="mono">4</text>
            <text x="470" y="180">leite: R$ 5</text>
            <rect x="460" y="196" width="150" height="30" rx="4" className="ln" />
            <text x="620" y="216" className="mono">5</text>
            <path d="M300 92L458 67" className="ln" />
            <path d="M451.7 71.9L458 67L450.5 64.3" className="ln" />
            <path d="M300 92L458 175" className="ln" />
            <path d="M450.0 175.1L458 175L453.6 168.3" className="ln" />
            <path d="M300 92L458 139" className="ln" />
            <path d="M450.2 140.7L458 139L452.4 133.3" className="ln" />
            <text x="320" y="246" className="mut" textAnchor="middle">Mesma chave, mesma posição, sempre. Por isso achar um item não exige percorrer a lista.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`voted = {}


def check_voter(name):
    if voted.get(name):                 # O(1) on average
        return "send them away"
    voted[name] = True
    return "let them vote"`} />
        <h3>Usos</h3>
        <ul className="ds-list">
          <li><em>Busca por nome:</em> agenda de telefones, DNS (domínio → IP).</li>
          <li><em>Evitar duplicados:</em> a lista de quem já votou (o exemplo do código).</li>
          <li><em>Cache:</em> guardar o resultado de uma consulta cara para não repeti-la.</li>
        </ul>
        <h3>Colisões e fator de carga</h3>
        <p>Uma <em>colisão</em> acontece quando duas chaves dão o mesmo índice. A saída comum é guardar uma lista curta naquela posição. Se a lista crescer demais, a busca vira O(n). Para evitar isso: uma boa função hash (espalha bem) e um <em>fator de carga</em> baixo, que é itens ÷ posições. Quando passa de uns 0,7, a tabela cresce e redistribui os itens.</p>
        <Table
          head={["Operação", "Média", "Pior caso"]}
          rows={[
            ["buscar", <code>O(1)</code>, <code>O(n)</code>],
            ["inserir", <code>O(1)</code>, <code>O(n)</code>],
            ["apagar", <code>O(1)</code>, <code>O(n)</code>],
          ]}
        />
      </Section>
      <Section id="ch6" title={"Capítulo 6: busca em largura"}>
        <p>Um <em>grafo</em> é um conjunto de nós ligados por arestas: pessoas e amizades, cidades e estradas, páginas e links. A <em>busca em largura</em> (BFS) responde a duas perguntas: <em>existe um caminho de A até B?</em> e <em>qual é o menor, em número de passos?</em></p>
        <p>O exemplo do livro: você quer achar, entre seus amigos, alguém que venda manga. Primeiro pergunta aos amigos diretos; se nenhum vende, pergunta aos amigos dos amigos, e assim por diante. Os mais próximos são verificados antes dos mais distantes, e por isso o primeiro vendedor encontrado está no menor caminho.</p>
        <Diagram minWidth={560} caption={"A busca em largura visita por círculos: o que está a 1 passo vem antes do que está a 2 passos."}>
          <svg viewBox="0 0 640 246" role="img" aria-label="Grafo de amigos">
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
            <text x="8" y="34" className="mut">círculo 0</text>
            <text x="8" y="104" className="mut">círculo 1</text>
            <text x="8" y="184" className="mut">círculo 2</text>
            <text x="320" y="232" className="mut" textAnchor="middle">Primeiro todos os amigos, depois os amigos dos amigos. A fila garante essa ordem.</text>
          </svg>
        </Diagram>
        <p>A ferramenta é uma <em>fila</em> (primeiro a entrar, primeiro a sair, como a fila do banco). Os amigos entram na fila; ao tirar alguém, você o verifica e coloca os amigos dele no fim. E guarde quem já foi verificado: sem isso, Alice e Bob (amigos de Peggy) fariam você verificar Peggy duas vezes e, em grafos com ciclos, nunca terminar.</p>
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
        <p><strong>Custo:</strong> O(V + E), onde V são os nós (vértices) e E as arestas: cada pessoa entra na fila uma vez e cada amizade é olhada uma vez.</p>
        <h3>Árvores e ordenação topológica</h3>
        <p>Uma <em>árvore</em> é um grafo sem ciclos e com uma raiz (como uma árvore genealógica ou as pastas do computador). E, se as arestas têm sentido e dependem umas das outras (“escovar os dentes depende de acordar”), a <em>ordenação topológica</em> monta uma lista de tarefas respeitando as dependências: é o que um gerenciador de pacotes faz.</p>
      </Section>
      <Section id="ch7" title={"Capítulo 7: algoritmo de Dijkstra"}>
        <p>A busca em largura acha o caminho com menos <em>passos</em>. Mas e se cada aresta tiver um custo (minutos, quilômetros, reais)? Num grafo <em>ponderado</em>, o caminho com menos passos pode ser o mais caro. Dijkstra acha o caminho de <em>menor custo total</em>.</p>
        <Diagram minWidth={560} caption={"Com pesos, o menor número de passos deixa de ser o melhor caminho. Dijkstra procura o menor custo total."}>
          <svg viewBox="0 0 640 246" role="img" aria-label="Grafo com pesos">
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
            <text x="70" y="105" textAnchor="middle">início</text>
            <circle cx="300" cy="40" r="28" className="ln" />
            <text x="300" y="45" textAnchor="middle">A</text>
            <circle cx="300" cy="160" r="28" className="ln" />
            <text x="300" y="165" textAnchor="middle">B</text>
            <circle cx="550" cy="100" r="28" className="ln" />
            <text x="550" y="105" textAnchor="middle">fim</text>
            <text x="320" y="214" className="mut" textAnchor="middle">Caminho mais barato (linha cheia): início → B → A → fim = 2 + 3 + 1 = 6</text>
            <text x="320" y="234" className="mut" textAnchor="middle">O caminho com menos passos (início → A → fim) custa 7.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li>Encontre o nó mais barato de alcançar que ainda não foi processado.</li>
          <li>Atualize o custo de seus vizinhos: se passar por este nó sai mais barato, guarde o novo custo e o “pai”.</li>
          <li>Marque o nó como processado e repita até chegar ao destino.</li>
          <li>Siga os “pais” de trás para frente para montar o caminho.</li>
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
        <Callout tone="warn" icon="alert">Dijkstra não funciona com pesos negativos (o truque de “o mais barato agora nunca melhora depois” deixa de valer). Para isso existe o algoritmo de Bellman-Ford. Também só serve a grafos <em>direcionados sem ciclos negativos</em>. Com a fila de prioridade (heap) usada acima, o custo é O((V + E) log V).</Callout>
      </Section>
      <Section id="ch8" title={"Capítulo 8: algoritmos gulosos e problemas NP-completos"}>
        <p>Um algoritmo <em>guloso</em> escolhe, a cada passo, a melhor opção <em>agora</em>, sem olhar para o futuro. Nem sempre dá a resposta perfeita, mas costuma dar uma boa, e rápido.</p>
        <h3>Exemplo: marcar aulas numa sala</h3>
        <p>Muitas aulas disputam a mesma sala e você quer caber o máximo delas. Estratégia gulosa: pegue a aula que termina mais cedo, descarte as que se sobrepõem a ela, repita. Esse caso específico é ótimo, não só aproximado.</p>
        <h3>Exemplo: cobertura de estações de rádio</h3>
        <p>Você quer que seu programa de rádio chegue a 8 estados usando o menor número de estações, e cada estação cobre alguns estados. Testar todas as combinações é O(2ⁿ). O guloso escolhe a estação que cobre mais estados ainda descobertos, repete, e termina rápido (aqui, 4 estações).</p>
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
        <h3>NP-completo</h3>
        <p>Há problemas para os quais ninguém conhece um algoritmo rápido, como o caixeiro-viajante e a cobertura de conjuntos acima. Eles são chamados <em>NP-completos</em>. O livro dá pistas para reconhecer um: o algoritmo roda rápido com poucos itens e fica absurdamente lento quando eles aumentam; o enunciado fala em “todas as combinações” ou “todas as ordens”; você não consegue dividir em subproblemas menores.</p>
        <p>Nesses casos, em vez de procurar a resposta perfeita, use um algoritmo de <em>aproximação</em> (como o guloso) e aceite uma resposta boa.</p>
      </Section>
      <Section id="ch9" title={"Capítulo 9: programação dinâmica"}>
        <p>Programação dinâmica resolve um problema difícil quebrando-o em subproblemas menores, <em>resolvendo cada um uma só vez</em> e guardando as respostas numa tabela (grade). O truque é descobrir quais são os subproblemas.</p>
        <h3>Problema da mochila</h3>
        <p>Você é ladrão (hipoteticamente) com uma mochila que aguenta 4 kg. Itens: violão (1 kg, R$ 1.500), aparelho de som (4 kg, R$ 3.000) e notebook (3 kg, R$ 2.000). O guloso levaria o som (o mais caro) e ficaria com R$ 3.000.</p>
        <p>A grade abaixo testa cada capacidade de 1 a 4 kg, adicionando um item por linha. Cada célula é o maior valor possível com os itens até aquela linha e aquele peso.</p>
        <Table
          head={[null, "1 kg", "2 kg", "3 kg", "4 kg"]}
          rows={[
            ["violão (1 kg)", "1.500", "1.500", "1.500", "1.500"],
            ["som (4 kg)", "1.500", "1.500", "1.500", "3.000"],
            ["notebook (3 kg)", "1.500", "1.500", "2.000", <strong>3.500</strong>],
          ]}
        />
        <p>A última célula vem da fórmula: <code>max(valor sem o item, valor do item + melhor com o peso que sobra)</code>. Para o notebook com 4 kg: máximo entre 3.000 (de cima) e 2.000 + 1.500 (notebook + o melhor com 1 kg) = 3.500. A resposta é violão + notebook.</p>
        <CodeBlock code={`def knapsack(items, capacity):          # items: [(name, weight, value)]
    grid = [[0] * (capacity + 1) for _ in range(len(items) + 1)]
    for i, (name, weight, value) in enumerate(items, start=1):
        for w in range(1, capacity + 1):
            best = grid[i - 1][w]                       # without this item
            if weight <= w:
                best = max(best, value + grid[i - 1][w - weight])
            grid[i][w] = best
    return grid[-1][-1]`} />
        <p>Custo: O(itens × capacidade), muito melhor que testar todos os subconjuntos (O(2ⁿ)).</p>
        <h3>Maior subsequência e maior substring comum</h3>
        <p>O mesmo molde de grade serve para comparar duas palavras, como faz um corretor ortográfico ou o <code>diff</code> do git. Para <em>fish</em> e <em>hish</em>, a maior substring comum (letras seguidas) é <em>ish</em>, de tamanho 3. A <em>subsequência</em> aceita letras não vizinhas, desde que na mesma ordem: <em>fosh</em> e <em>fish</em> compartilham <em>fsh</em> (3).</p>
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
        <Callout tone="good" icon="check">Dica do livro para reconhecer programação dinâmica: o problema pede para otimizar algo sob uma restrição (valor com limite de peso) e pode ser quebrado em subproblemas que não dependem uns dos outros.</Callout>
      </Section>
      <Section id="ch10" title={"Capítulo 10: k-vizinhos mais próximos"}>
        <p>Para classificar algo novo, olhe o que se parece com ele. É o k-NN. O exemplo do livro: frutas. Se você tem laranjas e toranjas num gráfico de tamanho × cor e aparece uma fruta nova, olhe as <em>k</em> mais próximas (por exemplo 3) e vote: se a maioria for toranja, é toranja.</p>
        <p>“Perto” é calculado com a fórmula da distância. Com duas características é o teorema de Pitágoras; com cinco, a mesma conta com mais termos: <code>√((a₁−b₁)² + (a₂−b₂)² + …)</code>. O livro usa isso para recomendar filmes: cada pessoa vira um ponto (as notas que deu a cada gênero) e você recomenda o que a pessoa mais próxima gostou.</p>
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
        <p>Aqui <code>nearest("priyanka")</code> devolve Justin (distância 2,0), então os filmes que Justin adorou são bons candidatos para Priyanka. (Notas inventadas, só para ilustrar.)</p>
        <h3>Regressão, escolha de características e aprendizado de máquina</h3>
        <ul className="ds-list">
          <li><em>Classificação</em> responde “a qual grupo pertence?” (sim/não, laranja/toranja). <em>Regressão</em> responde “quanto?”: prever uma nota ou quantos pães vender amanhã tirando a média dos vizinhos.</li>
          <li>Escolher boas <em>características</em> é o que mais pesa: devem estar ligadas ao que se quer prever e não podem ter viés (por exemplo, pedir só notas de quem ama comédia).</li>
          <li>Com a distância do cosseno, em vez da euclidiana, duas pessoas que dão notas altas e baixas em padrões parecidos são vizinhas mesmo que uma seja mais generosa.</li>
          <li>O k-NN é a porta de entrada do aprendizado de máquina: reconhecimento de dígitos (OCR), filtro de spam e recomendação, em que o modelo é “treinado” com exemplos já conhecidos.</li>
        </ul>
      </Section>
      <Section id="ch11" title={"Capítulo 11: para onde ir depois"}>
        <p>O último capítulo é um mapa rápido de dez ideias para estudar em seguida, cada uma com uma frase de apresentação.</p>
        <Table
          head={["Tema", "Para que serve"]}
          rows={[
            ["Árvores (binárias, de busca, B-trees)", "Guardam dados ordenados com inserção e busca em O(log n); bancos de dados usam B-trees."],
            ["Índice invertido", "Mapeia cada palavra às páginas em que aparece, a base de um buscador."],
            ["Transformada de Fourier", "Separa uma onda nos sons (frequências) que a compõem; usada em música e compressão."],
            ["Algoritmos paralelos", "Usam vários núcleos do processador ao mesmo tempo."],
            ["MapReduce", "Divide um trabalho enorme entre muitas máquinas (map) e junta os resultados (reduce)."],
            ["Filtros de Bloom e HyperLogLog", "Estruturas probabilísticas: usam pouquíssima memória em troca de uma pequena margem de erro."],
            ["Funções SHA", "Transformam qualquer texto numa impressão digital fixa; servem para verificar arquivos e guardar senhas."],
            ["Hash sensível à localidade", "Itens parecidos geram hashes parecidos, o que ajuda a achar semelhantes."],
            ["Diffie-Hellman e RSA", "Criptografia de chave pública: duas pessoas combinam um segredo sem nunca o enviar."],
            ["Programação linear", "Maximiza algo sob restrições; o algoritmo Simplex resolve muitos problemas de grafos."],
          ]}
        />
      </Section>
      <Section id="cheat" title={"Resumo: algoritmo e Big O"}>
        <Table
          head={["Algoritmo ou estrutura", "Big O", "Use quando"]}
          rows={[
            ["busca simples", <code>O(n)</code>, "a lista não está ordenada"],
            ["busca binária", <code>O(log n)</code>, "a lista está ordenada"],
            ["ordenação por seleção", <code>O(n²)</code>, "só para estudar"],
            ["quicksort", <><code>O(n log n)</code> em média</>, "ordenar na prática"],
            ["tabela hash", <><code>O(1)</code> em média</>, "achar por nome, evitar duplicados, cache"],
            ["busca em largura", <code>O(V + E)</code>, "menor número de passos"],
            ["Dijkstra", <code>O((V + E) log V)</code>, "menor custo, pesos não negativos"],
            ["guloso", "depende", "o problema é NP-completo e basta uma boa resposta"],
            ["programação dinâmica", <><code>O(itens × capacidade)</code></>, "otimizar sob restrição, com subproblemas"],
            ["k-NN", <><code>O(n)</code> por consulta</>, "classificar ou prever por semelhança"],
          ]}
        />
      </Section>
      <Section id="apply" title={"Como estudar e aplicar"}>
        <ol className="ds-steps">
          <li>Antes de escrever um laço dentro de outro, pergunte: isto é O(n²)? Dá para trocar um dos laços por um <code>dict</code> ou um <code>set</code>?</li>
          <li>Antes de buscar muitas vezes numa lista, considere ordená-la (e usar <code>bisect</code>) ou convertê-la num <code>set</code>.</li>
          <li>Para relações entre coisas (amigos, rotas, dependências), desenhe o grafo primeiro; quase sempre é BFS ou Dijkstra.</li>
          <li>Se o problema parece exigir “todas as combinações”, suspeite de NP-completo e procure uma aproximação.</li>
          <li>Para praticar: implemente cada código desta nota sem olhar, depois cronometre com listas de 1.000, 10.000 e 100.000 itens e confira se o tempo cresce como o Big O prevê.</li>
        </ol>
        <Callout tone="personal" icon="check">Anotação pessoal: este resumo segue a ordem do livro, mas escolhe e simplifica. Os exemplos centrais (adivinhar um número, caixeiro-viajante, mochila, estações de rádio, amigos vendedores de manga, preços do mercado) vêm do livro; as tabelas de passos, os códigos e os exemplos marcados como inventados são meus e foram executados para conferir os resultados.</Callout>
      </Section>
      <div className="sources">
        <b>Fonte</b>
        <ul>
          <li><a href="https://www.manning.com/books/grokking-algorithms" rel="noopener">Aditya Bhargava. Grokking Algorithms (Entendendo Algoritmos). Manning, 2016; edição brasileira: Novatec.</a></li>
        </ul>
      </div>
    </>
  );
}
