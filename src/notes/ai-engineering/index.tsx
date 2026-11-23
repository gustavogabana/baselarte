import { Callout, CodeBlock, Diagram, Section, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "ai-engineering",
  title: "AI Engineering (livro)",
  seo: {
    title: "AI Engineering, notas do livro",
    description: "Um passeio didático pelo livro AI Engineering, de Chip Huyen: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas.",
  },
  summary: "notas do livro sobre tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning, inferência e arquitetura de aplicações de IA.",
  kicker: "Notas de livro",
  heroTitle: <>Engenharia de IA, <em>uma camada por vez.</em></>,
  heroLede: "Um passeio didático por AI Engineering, de Chip Huyen: como os modelos escrevem e como pedir, buscar, avaliar e entregar.",
  published: "2026-10-16",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro", title: "O que é engenharia de IA" },
        { id: "generation", title: "Como o modelo escolhe cada palavra" },
        { id: "prompt", title: "Prompt engineering" },
        { id: "rag", title: "RAG: dar ao modelo o que ele não sabe" },
        { id: "agents", title: "Agentes" },
        { id: "eval", title: "Avaliação: como saber se funciona" },
        { id: "finetune", title: "Finetuning e dados" },
        { id: "inference", title: "Inferência: velocidade e custo" },
        { id: "architecture", title: "Arquitetura de uma aplicação de IA" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={"O que é engenharia de IA"}>
        <p>O livro <em>AI Engineering</em> (Chip Huyen, O’Reilly, 2025) ensina a construir aplicações em cima de <em>modelos de fundação</em> (foundation models): grandes modelos de linguagem, de imagem e outros, treinados por terceiros e usados por API ou hospedados por você.</p>
        <p>A virada está no <em>autossupervisionamento</em>: o modelo aprende prevendo partes do próprio texto, sem rótulos feitos à mão. Isso permitiu escalar para bilhões de parâmetros e deu origem a uma nova profissão.</p>
        <p>Comparada à engenharia de ML tradicional, a engenharia de IA lida com modelos maiores, mais caros e com <em>respostas abertas</em> (texto livre), o que torna testar e avaliar muito mais difícil. Por isso ela fica mais próxima do produto.</p>
        <h3>Tokens: a unidade do modelo</h3>
        <p>Um modelo de linguagem não trabalha com letras nem com palavras, e sim com <em>tokens</em>. O conjunto de todos os tokens é o <em>vocabulário</em> (o do GPT-4 tem 100.256; o do Mixtral 8x7B, 32.000).</p>
        <p>Há dois tipos de modelo: o <em>mascarado</em> (preenche lacunas, como o BERT) e o <em>autorregressivo</em> (prevê o próximo token, usado para gerar texto). Daqui em diante, “modelo” é o autorregressivo: uma máquina de completar texto.</p>
        <Diagram minWidth={560} caption={"Tokenização: o modelo não lê letras nem palavras inteiras, lê tokens."}>
          <svg viewBox="0 0 640 170" role="img" aria-label="Frase dividida em quatro tokens">
            <rect x="40" y="50" width="74" height="44" rx="6" className="ln fillsoft" />
            <text x="77.0" y="77" className="mono" textAnchor="middle">cook</text>
            <rect x="122" y="50" width="61" height="44" rx="6" className="ln fillsoft" />
            <text x="152.5" y="77" className="mono" textAnchor="middle">ing</text>
            <rect x="191" y="50" width="61" height="44" rx="6" className="ln fillsoft" />
            <text x="221.5" y="77" className="mono" textAnchor="middle">·is</text>
            <rect x="260" y="50" width="74" height="44" rx="6" className="ln fillsoft" />
            <text x="297.0" y="77" className="mono" textAnchor="middle">·fun</text>
            <text x="40" y="30" className="mut">O texto vira pedaços chamados tokens (a bolinha · é um espaço)</text>
            <text x="40" y="128">“cooking” = cook + ing: cada pedaço carrega um pouco do sentido.</text>
            <text x="40" y="150" className="mut">Em média, 1 token ≈ ¾ de palavra: 100 tokens ≈ 75 palavras.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="generation" title={"Como o modelo escolhe cada palavra"}>
        <p>A cada passo o modelo calcula uma pontuação (<em>logit</em>) para cada token do vocabulário e as converte em probabilidades (<em>softmax</em>). Depois <em>sorteia</em> um token. É por isso que a mesma pergunta pode ter respostas diferentes: a geração é probabilística.</p>
        <h3>Temperatura, top-k e top-p</h3>
        <ul className="ds-list">
          <li><em>Temperatura</em> divide os logits antes do softmax. Exemplo do livro com dois tokens, A (logit 1) e B (logit 2): com temperatura 1, B sai 73% das vezes; com 0,5, sobe para 88%. Perto de 0, o modelo escolhe sempre o mais provável. Temperatura 0 é a escolha comum para respostas consistentes.</li>
          <li><em>Top-k</em> considera só os k tokens mais prováveis (k costuma ficar entre 50 e 500).</li>
          <li><em>Top-p</em> (nucleus) considera o menor grupo de tokens cuja probabilidade soma p (por exemplo, 0,9). Para “responda só sim ou não” sobram dois; para “qual o sentido da vida?” sobram muitos.</li>
        </ul>
        <Diagram minWidth={560} caption={"Temperatura baixa deixa o modelo previsível (quase sempre B); alta o deixa mais variado e menos coerente."}>
          <svg viewBox="0 0 640 220" role="img" aria-label="Barras de probabilidade para três temperaturas">
            <text x="0" y="18" className="mut">Logits: A = 1, B = 2. Quanto a escolha de B muda com a temperatura:</text>
            <text x="0" y="60" className="mono">T = 2.0</text>
            <rect x="90" y="40" width="151" height="20" className="fillsoft ln" />
            <rect x="90" y="66" width="249" height="20" className="fill" />
            <text x="249" y="55" className="mono">A 38%</text>
            <text x="347" y="81" className="mono">B 62%</text>
            <text x="0" y="118" className="mono">T = 1.0</text>
            <rect x="90" y="98" width="108" height="20" className="fillsoft ln" />
            <rect x="90" y="124" width="292" height="20" className="fill" />
            <text x="206" y="113" className="mono">A 27%</text>
            <text x="390" y="139" className="mono">B 73%</text>
            <text x="0" y="176" className="mono">T = 0.5</text>
            <rect x="90" y="156" width="48" height="20" className="fillsoft ln" />
            <rect x="90" y="182" width="352" height="20" className="fill" />
            <text x="146" y="171" className="mono">A 12%</text>
            <text x="450" y="197" className="mono">B 88%</text>
          </svg>
        </Diagram>
        <Callout tone="good" icon="check">Dica de depuração do livro: olhe as <em>logprobs</em> (probabilidades em escala log) quando a API as oferece. Se elas parecem aleatórias, o modelo não aprendeu o que você espera.</Callout>
        <h3>Do modelo bruto ao assistente</h3>
        <p>O modelo só pré-treinado é um completador de texto “selvagem”. Dois passos de <em>pós-treinamento</em> o tornam útil: <em>ajuste supervisionado</em> (SFT), em que ele vê exemplos de boas respostas, e <em>ajuste por preferência</em>, em que aprende quais respostas as pessoas preferem.</p>
        <p>A qualidade dos dados de treino e a escala (parâmetros, tokens e capacidade de computação) explicam grande parte do desempenho.</p>
      </Section>
      <Section id="prompt" title={"Prompt engineering"}>
        <p>Um <em>prompt</em> reúne instruções, exemplos, contexto e a pergunta. Por baixo dos panos, o prompt do sistema e o do usuário são concatenados num texto só, seguindo um <em>chat template</em> que cada modelo define. Usar o template errado causa falhas silenciosas: o modelo responde algo razoável, só que pior. Imprima o prompt final antes de enviar.</p>
        <Diagram minWidth={560} caption={"Os modelos tendem a usar melhor o que está no começo e no fim do prompt do que o que fica no meio."}>
          <svg viewBox="0 0 640 222" role="img" aria-label="Partes de um prompt e atenção por posição">
            <text x="0" y="16" className="mut">Um prompt é uma pilha de partes, enviada ao modelo como um texto só:</text>
            <rect x="0" y="30" width="360" height="38" rx="8" className="ln fillsoft" />
            <text x="180.0" y="53.0" textAnchor="middle">Instruções do sistema (papel, regras, formato)</text>
            <rect x="0" y="76" width="360" height="38" rx="8" className="ln" />
            <text x="180.0" y="99.0" textAnchor="middle">Exemplos do que você espera</text>
            <rect x="0" y="122" width="360" height="38" rx="8" className="ln" />
            <text x="180.0" y="145.0" textAnchor="middle">Contexto (documentos, histórico)</text>
            <rect x="0" y="168" width="360" height="38" rx="8" className="ln fillsoft" />
            <text x="180.0" y="191.0" textAnchor="middle">Pergunta do usuário</text>
            <text x="400" y="52" className="mut">Atenção do modelo</text>
            <path d="M400 140C430 70 470 60 500 120C520 170 540 170 560 120C580 70 610 60 630 60" className="ln" />
            <path d="M400 190H630" className="ln" />
            <text x="400" y="210" className="mut">início</text>
            <text x="630" y="210" className="mut" textAnchor="end">fim</text>
            <text x="515" y="210" className="mut" textAnchor="middle">meio</text>
          </svg>
        </Diagram>
        <p>O teste “agulha no palheiro” mostra o efeito da figura: esconda um fato em posições diferentes de um texto longo e peça para o modelo achá-lo. Os modelos testados achavam melhor no começo e no fim.</p>
        <h3>Boas práticas que valem para quase todo modelo</h3>
        <ul className="ds-list">
          <li><em>Instruções claras e explícitas:</em> diga o papel, a tarefa, o formato e o que evitar.</li>
          <li><em>Dê contexto suficiente:</em> o modelo só sabe o que está no prompt (e no treino).</li>
          <li><em>Quebre tarefas complexas em subtarefas</em> encadeadas, cada uma com seu prompt simples.</li>
          <li><em>Dê tempo para pensar:</em> pedir o raciocínio passo a passo (chain-of-thought) melhora tarefas difíceis.</li>
          <li><em>Itere e versione:</em> trate prompts como código: teste, compare, guarde versões.</li>
        </ul>
        <h3>Um exemplo simples (inventado)</h3>
        <CodeBlock code={`Ruim:   "Resuma isto."

Melhor: "Você é um assistente de suporte. Resuma o e-mail abaixo
        em até 3 frases para um gerente. Destaque o pedido do
        cliente e o prazo. Se faltar o prazo, escreva 'prazo não
        informado'.

        E-mail: <<<...>>>"`} />
        <h3>Defesa: seu prompt também é uma superfície de ataque</h3>
        <p>O livro lista três ataques: <em>extração do prompt</em> (descobrir suas instruções), <em>jailbreak e injeção de prompt</em> (fazer o modelo agir mal, inclusive por texto escondido em documentos que ele lê) e <em>extração de informação</em> (vazar dados de treino ou de contexto).</p>
        <p>Com ferramentas, o risco sobe: um ataque pode virar execução de código ou consulta indevida ao banco. Mitigue limitando as permissões das ferramentas, filtrando entradas e saídas e tratando todo conteúdo externo como dado, não como ordem.</p>
      </Section>
      <Section id="rag" title={"RAG: dar ao modelo o que ele não sabe"}>
        <p>O modelo não conhece seus documentos privados e pode estar desatualizado. O <em>RAG</em> (Retrieval-Augmented Generation) resolve em dois passos: <em>buscar</em> os trechos relevantes numa base externa e <em>gerar</em> a resposta com eles no prompt. Também economiza contexto e dinheiro, porque você manda só o que importa.</p>
        <Diagram minWidth={560} caption={"O modelo não precisa saber tudo: ele recebe, junto da pergunta, os trechos mais relevantes."}>
          <svg viewBox="0 0 640 190" role="img" aria-label="Fluxo do RAG">
            <rect x="0" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="50.0" y="82.0" textAnchor="middle">Pergunta</text>
            <path d="M100 78H128" className="ln" />
            <path d="M122 73L128 78L122 83" className="ln" />
            <rect x="128" y="52" width="110" height="52" rx="8" className="ln fillsoft" />
            <text x="183.0" y="76.0" className="" textAnchor="middle">Retriever</text>
            <text x="183.0" y="93.0" className="mut" textAnchor="middle">busca trechos</text>
            <path d="M238 78H266" className="ln" />
            <path d="M260 73L266 78L260 83" className="ln" />
            <rect x="266" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="316.0" y="76.0" className="" textAnchor="middle">Prompt</text>
            <text x="316.0" y="93.0" className="mut" textAnchor="middle">+ trechos</text>
            <path d="M366 78H394" className="ln" />
            <path d="M388 73L394 78L388 83" className="ln" />
            <rect x="394" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="444.0" y="82.0" textAnchor="middle">Modelo</text>
            <path d="M494 78H522" className="ln" />
            <path d="M516 73L522 78L516 83" className="ln" />
            <rect x="522" y="52" width="112" height="52" rx="8" className="ln fill" />
            <text x="578.0" y="82.0" className="inv" textAnchor="middle">Resposta</text>
            <path d="M183 104V158H176" className="ln dash" />
            <rect x="0" y="140" width="176" height="36" rx="8" className="ln dash" />
            <text x="88.0" y="162.0" textAnchor="middle">Base de conhecimento</text>
            <text x="300" y="20" textAnchor="middle">RAG: primeiro buscar, depois responder</text>
          </svg>
        </Diagram>
        <h3>Dois jeitos de buscar</h3>
        <ul className="ds-list">
          <li><em>Por termos</em> (TF-IDF, BM25, Elasticsearch): conta palavras. Quanto mais um termo aparece num documento (<em>TF</em>), mais relevante; quanto mais documentos contêm o termo, menos informativo ele é (<em>IDF</em>). Um <em>índice invertido</em> guarda, para cada termo, os documentos onde ele aparece. É leve e um excelente ponto de partida.</li>
          <li><em>Por embeddings</em> (busca vetorial): cada trecho vira um vetor numérico que captura o <em>significado</em>, e a busca acha os vetores mais próximos do vetor da pergunta. Acha “carro” quando você escreveu “automóvel”, mas custa mais.</li>
        </ul>
        <CodeBlock code={`Índice invertido (simplificado)
termo      docs onde aparece (documento, frequência)
banana     (10, 3)  (5, 2)
machine    (1, 5)  (10, 1)  (38, 9)  (42, 5)`} />
        <p>Exemplo de IDF do livro: se há 10 documentos e 5 contêm o termo, a razão 10 / 5 = 2. Um termo presente em todos os documentos (como “de”) tem IDF baixo e pouco ajuda. Na prática usa-se o logaritmo dessa razão.</p>
        <h3>Quebrar os documentos em trechos (chunking)</h3>
        <p>Como você divide importa. Dá para cortar por tamanho fixo, por frase, por parágrafo ou recursivamente (seção, depois parágrafo, depois frase).</p>
        <p>Use <em>sobreposição</em> entre trechos: se o texto “Deixei um bilhete para minha esposa” for cortado em “Deixei um bilhete para” e “minha esposa”, nenhum pedaço faz sentido sozinho. Trechos menores permitem colocar mais fontes no prompt; trechos maiores guardam mais contexto.</p>
      </Section>
      <Section id="agents" title={"Agentes"}>
        <p>Um <em>agente</em> é qualquer coisa que percebe um ambiente e age nele. Em IA, o modelo é o “cérebro” que planeja, e as <em>ferramentas</em> (buscar na web, rodar código, consultar SQL, chamar APIs) são as mãos. Um sistema RAG é um agente simples cuja única ferramenta é o buscador.</p>
        <p>Exemplo do livro: “projete as vendas dos próximos três meses”. O agente raciocina que precisa do histórico, gera e executa uma consulta SQL, vê que faltam dados, busca as campanhas de marketing passadas, e só então produz a projeção.</p>
        <Diagram minWidth={600} caption={"Mesmo com 95% de acerto por passo, tarefas de 10 passos acertam ~60% e as de 100 passos, ~0,6%."}>
          <svg viewBox="0 0 680 140" role="img" aria-label="Ciclo do agente e queda de acerto">
            <text x="10" y="20" className="mut" textAnchor="start">Ciclo de um agente</text>
            <rect x="10" y="34" width="110" height="44" rx="4" className="ln" />
            <text x="65" y="60" textAnchor="middle">Planejar</text>
            <rect x="160" y="34" width="130" height="44" rx="4" className="ln fillsoft" />
            <text x="225" y="60" textAnchor="middle">Agir (ferramenta)</text>
            <rect x="330" y="34" width="110" height="44" rx="4" className="ln" />
            <text x="385" y="60" textAnchor="middle">Observar</text>
            <path d="M120 56L160 56" className="ln" />
            <path d="M153.2 52.7L160 56L153.2 59.3" className="ln" />
            <path d="M290 56L330 56" className="ln" />
            <path d="M323.2 52.7L330 56L323.2 59.3" className="ln" />
            <path d="M385 78L385 104" className="ln" />
            <path d="M385 104L65 104" className="ln" />
            <path d="M65 104L65 80" className="ln" />
            <path d="M61.7 86.8L65 80L68.3 86.8" className="ln" />
            <text x="225" y="124" className="mut" textAnchor="middle">repete até concluir (ou desistir)</text>
            <text x="470" y="20" className="mut" textAnchor="start">Erro composto, 95% por passo</text>
            <text x="480" y="52" className="mono" textAnchor="start">1 passo</text>
            <rect x="560" y="38" width="57" height="18" rx="4" className="fill" />
            <text x="625" y="52" className="mono" textAnchor="start">95%</text>
            <text x="480" y="82" className="mono" textAnchor="start">10 passos</text>
            <rect x="560" y="68" width="36" height="18" rx="4" className="fill" />
            <text x="604" y="82" className="mono" textAnchor="start">60%</text>
            <text x="480" y="112" className="mono" textAnchor="start">100 passos</text>
            <rect x="560" y="98" width="2" height="18" rx="4" className="fill" />
            <text x="570" y="112" className="mono" textAnchor="start">0.6%</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><em>Planejamento:</em> separar o plano da execução permite validar o plano antes de agir.</li>
          <li><em>Reflexão e correção de erros:</em> o agente confere o resultado e tenta de novo.</li>
          <li><em>Memória:</em> guardar o que já foi feito e aprendido.</li>
          <li><em>Mais ferramentas, mais poder, mais risco:</em> quanto mais autonomia, mais graves as falhas. Peça confirmação humana antes de ações irreversíveis.</li>
        </ul>
      </Section>
      <Section id="eval" title={"Avaliação: como saber se funciona"}>
        <p>O livro dedica dois capítulos à avaliação, porque sem ela você não sabe se melhorou ou piorou. Como as respostas são abertas, não dá para só comparar com um gabarito. As técnicas:</p>
        <ul className="ds-list">
          <li><em>Correção funcional:</em> rode o resultado. O SQL gerado devolve os dados certos? O código passa nos testes? É a avaliação mais confiável quando é possível.</li>
          <li><em>Similaridade com uma resposta de referência:</em> igualdade exata, parecença de texto ou de significado (embeddings).</li>
          <li><em>IA como juiz:</em> outro modelo dá nota ou compara respostas. É flexível e explica a nota, mas é subjetivo: depende do juiz e do prompt do juiz, e muda quando o juiz muda.</li>
          <li><em>Avaliação comparativa:</em> “qual das duas é melhor, A ou B?”, como num ranking de xadrez.</li>
          <li><em>Pessoas:</em> amostras revisadas por humanos continuam essenciais.</li>
        </ul>
        <CodeBlock code={`Prompt de juiz (simplificado, do tipo mostrado no livro)
"Dada a pergunta e a resposta, dê uma nota de 1 a 5.
 1 = muito ruim, 5 = muito boa.
 Pergunta: [PERGUNTA]
 Resposta: [RESPOSTA]
 Nota:"`} />
        <h3>Montando seu pipeline de avaliação</h3>
        <ol className="ds-steps">
          <li>Avalie <em>cada componente</em> do sistema (busca, geração, ferramentas), não só o resultado final.</li>
          <li>Escreva um <em>guia de avaliação</em>: o que é uma boa resposta para o seu caso? Inclua exemplos.</li>
          <li>Defina <em>métodos e dados</em>: um conjunto de perguntas reais, de casos fáceis e difíceis, que você roda a cada mudança.</li>
        </ol>
        <Callout tone="warn" icon="alert">Cuidado com benchmarks públicos: servem para descartar modelos ruins, não para achar o melhor para você, e podem estar “contaminados” (ter entrado nos dados de treino). Monte o seu próprio “ranking privado”.</Callout>
      </Section>
      <Section id="finetune" title={"Finetuning e dados"}>
        <p><em>Finetuning</em> é continuar o treino do modelo com seus exemplos. A regra de bolso do livro: <em>finetuning é para forma, RAG é para fatos.</em></p>
        <Table
          head={["Problema do modelo", "Tipo", "Tente primeiro"]}
          rows={[
            ["Inventa ou desconhece fatos, informação desatualizada", "de informação", "RAG"],
            ["Formato errado, tom errado, resposta correta porém inútil", "de comportamento", "Finetuning"],
          ]}
        />
        <p>Antes de ajustar, esgote o prompting. Para testar a ideia, comece com um conjunto pequeno e bem feito (50 a 100 exemplos); se não há melhora nenhuma, mais dados raramente resolvem.</p>
        <h3>Ajustar sem quebrar o orçamento: PEFT e LoRA</h3>
        <p>Treinar todos os pesos de um modelo grande exige muita memória. Os métodos <em>PEFT</em> treinam só uma fração. O mais popular é o <em>LoRA</em>: em vez de alterar uma matriz grande <code>W</code>, você a congela e treina duas matrizes finas, <code>A</code> e <code>B</code>, cujo produto é somado a <code>W</code>. No exemplo do livro, uma matriz 9 × 9 tem 81 números, mas fatorada em 9 × 1 e 1 × 9 tem só 18.</p>
        <p>Num caso citado do GPT-3, o LoRA treinou cerca de 4,7 milhões de parâmetros, 0,0027% do ajuste completo, com desempenho comparável em várias tarefas. Os módulos LoRA também são fáceis de trocar e combinar.</p>
        <Diagram minWidth={560} caption={"LoRA ajusta o modelo treinando só duas matrizes pequenas, em vez de todos os pesos."}>
          <svg viewBox="0 0 640 230" role="img" aria-label="Matriz W somada ao produto de A por B">
            <text x="10" y="28" className="mut" textAnchor="start">duas matrizes finas, só estas são treinadas</text>
            <rect x="10" y="44" width="150" height="150" rx="4" className="ln fillsoft" />
            <text x="85" y="123" className="" textAnchor="middle">W</text>
            <text x="85" y="214" className="mut" textAnchor="middle">pesos originais, congelados</text>
            <text x="190" y="123" className="" textAnchor="middle">+</text>
            <rect x="215" y="44" width="26" height="150" rx="4" className="fill" />
            <text x="228" y="214" className="mut" textAnchor="middle">A</text>
            <text x="262" y="123" className="" textAnchor="middle">×</text>
            <rect x="285" y="108" width="150" height="26" rx="4" className="fill" />
            <text x="360" y="154" className="mut" textAnchor="middle">B</text>
            <text x="470" y="90" textAnchor="start">Exemplo: matriz 9 × 9</text>
            <text x="470" y="112" className="mut" textAnchor="start">completa: 81 números</text>
            <text x="470" y="134" className="mut" textAnchor="start">A (9×1) + B (1×9):</text>
            <text x="470" y="152" className="mut" textAnchor="start">18 números</text>
          </svg>
        </Diagram>
        <h3>Engenharia de dados</h3>
        <p>Os dados de treino têm três critérios: <em>qualidade</em>, <em>cobertura</em> (variedade de casos) e <em>quantidade</em>. Pouco dado de alta qualidade pode superar muito dado ruidoso.</p>
        <p>Quando faltam exemplos, usa-se <em>dados sintéticos</em> gerados por outro modelo, que também precisam ser avaliados. O livro lembra: dá para automatizar a geração, mas não o pensar sobre quais dados você quer nem a atenção aos detalhes.</p>
      </Section>
      <Section id="inference" title={"Inferência: velocidade e custo"}>
        <p>Um modelo bom demais e lento demais não serve. A resposta tem duas fases: o <em>prefill</em> (ler o prompt, que define o tempo até o primeiro token, <em>TTFT</em>) e o <em>decode</em> (gerar um token por vez, com tempo por token <em>TPOT</em>). Para ler em streaming, algo como 120 ms por token já acompanha uma leitura rápida.</p>
        <Diagram minWidth={560} caption={"O 1º token depende da leitura do prompt (prefill); os seguintes são gerados um a um (decode)."}>
          <svg viewBox="0 0 640 156" role="img" aria-label="Linha do tempo de uma resposta">
            <text x="0" y="16" className="mut">Uma resposta em streaming:</text>
            <rect x="0" y="30" width="130" height="28" rx="6" className="fill" />
            <text x="65" y="49" className="inv" textAnchor="middle">TTFT</text>
            <rect x="138" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="178" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="218" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="258" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="298" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="338" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="378" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="418" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="458" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="498" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="538" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <rect x="578" y="30" width="34" height="28" rx="6" className="ln fillsoft" />
            <text x="65" y="80" className="mut" textAnchor="middle">tempo até o 1º token</text>
            <text x="375" y="80" className="mut" textAnchor="middle">TPOT: tempo por token de saída, repetido a cada token</text>
            <text x="0" y="116">latência total = TTFT + TPOT × nº de tokens de saída</text>
            <text x="0" y="140" className="mut">Ex.: se cada token leva 100 ms, 1.000 tokens levam 100 s.</text>
          </svg>
        </Diagram>
        <p>Há um equilíbrio entre latência e custo: agrupar muitas requisições (batching) baixa o custo por resposta, mas pode aumentar a espera.</p>
        <p>Técnicas citadas: <em>quantização</em> (usar menos bits por número), <em>destilação</em> (treinar um modelo menor para imitar um maior), <em>KV cache</em> (guardar cálculos já feitos do prompt) e <em>prompt caching</em> (reaproveitar o início de prompts repetidos, útil com documentos longos). Se você usa APIs, boa parte já vem pronta; saber isso ajuda a comparar fornecedores.</p>
      </Section>
      <Section id="architecture" title={"Arquitetura de uma aplicação de IA"}>
        <p>O último capítulo junta tudo e propõe crescer em etapas, só quando preciso. Começa com o caminho mínimo (a pergunta vai ao modelo e a resposta volta) e vai acrescentando:</p>
        <Diagram minWidth={560} caption={"Comece pelo caminho simples (usuário → modelo) e vá adicionando camadas só quando surgir a necessidade."}>
          <svg viewBox="0 0 640 296" role="img" aria-label="Camadas entre o usuário e o modelo">
            <rect x="0" y="6" width="150" height="40" rx="8" className="ln" />
            <text x="75.0" y="30.0" textAnchor="middle">Usuário</text>
            <path d="M150 26H190" className="ln" />
            <path d="M184 21L190 26L184 31" className="ln" />
            <rect x="190" y="6" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="25.0" textAnchor="middle">1. Contexto</text>
            <text x="315.0" y="42.0" className="mut" textAnchor="middle">RAG e ferramentas</text>
            <rect x="190" y="56" width="250" height="42" rx="8" className="ln" />
            <text x="315.0" y="75.0" className="" textAnchor="middle">2. Guardrails</text>
            <text x="315.0" y="92.0" className="mut" textAnchor="middle">filtros de entrada e saída</text>
            <rect x="190" y="106" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="125.0" textAnchor="middle">3. Router e gateway</text>
            <text x="315.0" y="142.0" className="mut" textAnchor="middle">escolhe o modelo certo</text>
            <rect x="190" y="156" width="250" height="42" rx="8" className="ln" />
            <text x="315.0" y="175.0" className="" textAnchor="middle">4. Caches</text>
            <text x="315.0" y="192.0" className="mut" textAnchor="middle">exato e semântico</text>
            <rect x="190" y="206" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="225.0" textAnchor="middle">5. Agentes</text>
            <text x="315.0" y="242.0" className="mut" textAnchor="middle">lógica complexa e ações</text>
            <path d="M440 26H480" className="ln" />
            <path d="M474 21L480 26L474 31" className="ln" />
            <rect x="480" y="6" width="150" height="40" rx="8" className="ln fill" />
            <text x="555.0" y="30.0" className="inv" textAnchor="middle">Modelo</text>
            <path d="M565 46V262H0V262" className="ln dash" />
            <text x="320" y="282" className="mut" textAnchor="middle">Monitoramento e observabilidade cobrem tudo; o feedback dos usuários volta como dados.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><em>Contexto:</em> RAG e ferramentas, como “feature engineering” do modelo.</li>
          <li><em>Guardrails:</em> na entrada, bloquear ou mascarar dados sensíveis e ataques; na saída, checar formato, toxicidade e fatos.</li>
          <li><em>Router e gateway:</em> um classificador de intenção manda perguntas simples para modelos baratos e as difíceis para os fortes; o gateway centraliza chaves, limites e trocas de fornecedor.</li>
          <li><em>Caches:</em> o <em>exato</em> reaproveita respostas para pedidos idênticos; o <em>semântico</em> reaproveita para pedidos parecidos.</li>
          <li><em>Agentes:</em> fluxos com laços, condições e ações de escrita.</li>
        </ol>
        <p>Em cima de tudo, <em>observabilidade</em>: métricas e alertas para saber como o sistema falha e achar a causa. E o <em>feedback dos usuários</em> (um polegar para cima, uma edição, uma reclamação) vira dado para melhorar o produto: o chamado <em>data flywheel</em>.</p>
        <Callout tone="personal" icon="check">Anotação pessoal: este resumo escolhe e simplifica os pontos centrais do livro. Os números (73% e 88% na temperatura, 81 contra 18 parâmetros, 95% por passo, 100 ms por token) vêm do texto; os exemplos marcados como inventados são meus.</Callout>
      </Section>
      <div className="sources">
        <b>Fonte</b>
        <ul>
          <li><a href="https://www.oreilly.com/library/view/ai-engineering/9781098166298/" rel="noopener">Chip Huyen. AI Engineering: Building Applications with Foundation Models. O’Reilly, 2025.</a></li>
        </ul>
      </div>
    </>
  );
}
