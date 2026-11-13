import { Callout, CodeBlock, Diagram, Section, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "ai-engineering",
  title: { en: "AI Engineering (book)", pt: "AI Engineering (livro)" },
  seo: {
    title: { en: "AI Engineering, book notes", pt: "AI Engineering, notas do livro" },
    description: { en: "A friendly walkthrough of the book AI Engineering by Chip Huyen: tokens, sampling, prompting, RAG, agents, evaluation, finetuning with LoRA, inference and application architecture, with simple examples and diagrams.", pt: "Um passeio didático pelo livro AI Engineering, de Chip Huyen: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas." },
  },
  summary: "book notes on tokens, sampling, prompting, RAG, agents, evaluation, finetuning, inference and AI application architecture.",
  kicker: { en: "Book notes", pt: "Notas de livro" },
  heroTitle: { en: <>AI engineering, <em>one layer at a time.</em></>, pt: <>Engenharia de IA, <em>uma camada por vez.</em></> },
  heroLede: { en: "A friendly walkthrough of AI Engineering by Chip Huyen: how models write, how to prompt, retrieve, evaluate and ship them.", pt: "Um passeio didático por AI Engineering, de Chip Huyen: como os modelos escrevem e como pedir, buscar, avaliar e entregar." },
  published: "2026-10-16",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro", title: <T pt="O que é engenharia de IA" en="What AI engineering is" /> },
        { id: "generation", title: <T pt="Como o modelo escolhe cada palavra" en="How the model picks each word" /> },
        { id: "prompt", title: <T pt="Prompt engineering" en="Prompt engineering" /> },
        { id: "rag", title: <T pt="RAG: dar ao modelo o que ele não sabe" en="RAG: giving the model what it doesn’t know" /> },
        { id: "agents", title: <T pt="Agentes" en="Agents" /> },
        { id: "eval", title: <T pt="Avaliação: como saber se funciona" en="Evaluation: knowing whether it works" /> },
        { id: "finetune", title: <T pt="Finetuning e dados" en="Finetuning and data" /> },
        { id: "inference", title: <T pt="Inferência: velocidade e custo" en="Inference: speed and cost" /> },
        { id: "architecture", title: <T pt="Arquitetura de uma aplicação de IA" en="Architecture of an AI application" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={<T pt="O que é engenharia de IA" en="What AI engineering is" />}>
        <p><T pt={<>O livro <em>AI Engineering</em> (Chip Huyen, O’Reilly, 2025) ensina a construir aplicações em cima de <em>modelos de fundação</em> (foundation models): grandes modelos de linguagem, de imagem e outros, treinados por terceiros e usados por API ou hospedados por você.</>} en={<>The book <em>AI Engineering</em> (Chip Huyen, O’Reilly, 2025) teaches how to build applications on top of <em>foundation models</em>: large language, image and other models, trained by others and used through an API or hosted by you.</>} /></p>
        <p><T pt={<>A virada está no <em>autossupervisionamento</em>: o modelo aprende prevendo partes do próprio texto, sem rótulos feitos à mão. Isso permitiu escalar para bilhões de parâmetros e deu origem a uma nova profissão. Comparada à engenharia de ML tradicional, a engenharia de IA lida com modelos maiores, mais caros e com <em>respostas abertas</em> (texto livre), o que torna testar e avaliar muito mais difícil. Por isso ela fica mais próxima do produto.</>} en={<>The turning point is <em>self-supervision</em>: the model learns by predicting parts of its own text, with no hand-made labels. That made it possible to scale to billions of parameters and created a new profession. Compared with traditional ML engineering, AI engineering deals with bigger, costlier models with <em>open-ended outputs</em> (free text), which makes testing and evaluating much harder. That is why it sits closer to the product.</>} /></p>
        <h3><T pt="Tokens: a unidade do modelo" en="Tokens: the model’s unit" /></h3>
        <p><T pt={<>Um modelo de linguagem não trabalha com letras nem com palavras, e sim com <em>tokens</em>. O conjunto de todos os tokens é o <em>vocabulário</em> (o do GPT-4 tem 100.256; o do Mixtral 8x7B, 32.000). Há dois tipos de modelo: o <em>mascarado</em> (preenche lacunas, como o BERT) e o <em>autorregressivo</em> (prevê o próximo token, usado para gerar texto). Daqui em diante, “modelo” é o autorregressivo: uma máquina de completar texto.</>} en={<>A language model works with neither letters nor words, but with <em>tokens</em>. The set of all tokens is the <em>vocabulary</em> (GPT-4’s has 100,256; Mixtral 8x7B’s has 32,000). There are two kinds of model: the <em>masked</em> one (fills in blanks, like BERT) and the <em>autoregressive</em> one (predicts the next token, used to generate text). From here on, “model” means the autoregressive kind: a text-completion machine.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Tokenização: o modelo não lê letras nem palavras inteiras, lê tokens." en="Tokenization: the model reads neither letters nor whole words, it reads tokens." />}>
          <svg viewBox="0 0 640 170" role="img" aria-label="Frase dividida em quatro tokens / A phrase split into four tokens">
            <rect x="40" y="50" width="74" height="44" rx="6" className="ln fillsoft" />
            <text x="77.0" y="77" className="mono" textAnchor="middle">cook</text>
            <rect x="122" y="50" width="61" height="44" rx="6" className="ln fillsoft" />
            <text x="152.5" y="77" className="mono" textAnchor="middle">ing</text>
            <rect x="191" y="50" width="61" height="44" rx="6" className="ln fillsoft" />
            <text x="221.5" y="77" className="mono" textAnchor="middle">·is</text>
            <rect x="260" y="50" width="74" height="44" rx="6" className="ln fillsoft" />
            <text x="297.0" y="77" className="mono" textAnchor="middle">·fun</text>
            <text x="40" y="30" className="pt mut">O texto vira pedaços chamados tokens (a bolinha · é um espaço)</text>
            <text x="40" y="30" className="en mut">Text becomes chunks called tokens (the dot · is a space)</text>
            <text x="40" y="128" className="pt">“cooking” = cook + ing: cada pedaço carrega um pouco do sentido.</text>
            <text x="40" y="128" className="en">“cooking” = cook + ing: each piece carries part of the meaning.</text>
            <text x="40" y="150" className="pt mut">Em média, 1 token ≈ ¾ de palavra: 100 tokens ≈ 75 palavras.</text>
            <text x="40" y="150" className="en mut">On average 1 token ≈ ¾ of a word: 100 tokens ≈ 75 words.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="generation" title={<T pt="Como o modelo escolhe cada palavra" en="How the model picks each word" />}>
        <p><T pt={<>A cada passo o modelo calcula uma pontuação (<em>logit</em>) para cada token do vocabulário e as converte em probabilidades (<em>softmax</em>). Depois <em>sorteia</em> um token. É por isso que a mesma pergunta pode ter respostas diferentes: a geração é probabilística.</>} en={<>At each step the model computes a score (<em>logit</em>) for every token in the vocabulary and turns them into probabilities (<em>softmax</em>). Then it <em>samples</em> one token. That is why the same question can get different answers: generation is probabilistic.</>} /></p>
        <h3><T pt="Temperatura, top-k e top-p" en="Temperature, top-k and top-p" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Temperatura</em> divide os logits antes do softmax. Exemplo do livro com dois tokens, A (logit 1) e B (logit 2): com temperatura 1, B sai 73% das vezes; com 0,5, sobe para 88%. Perto de 0, o modelo escolhe sempre o mais provável. Temperatura 0 é a escolha comum para respostas consistentes.</>} en={<><em>Temperature</em> divides the logits before the softmax. Book example with two tokens, A (logit 1) and B (logit 2): at temperature 1, B comes out 73% of the time; at 0.5 it rises to 88%. Close to 0, the model always picks the most likely one. Temperature 0 is the usual choice for consistent answers.</>} /></li>
          <li><T pt={<><em>Top-k</em> considera só os k tokens mais prováveis (k costuma ficar entre 50 e 500).</>} en={<><em>Top-k</em> considers only the k most likely tokens (k is usually between 50 and 500).</>} /></li>
          <li><T pt={<><em>Top-p</em> (nucleus) considera o menor grupo de tokens cuja probabilidade soma p (por exemplo, 0,9). Para “responda só sim ou não” sobram dois; para “qual o sentido da vida?” sobram muitos.</>} en={<><em>Top-p</em> (nucleus) considers the smallest group of tokens whose probabilities add up to p (for example, 0.9). For “answer yes or no only” two remain; for “what is the meaning of life?” many remain.</>} /></li>
        </ul>
        <Diagram minWidth={560} caption={<T pt="Temperatura baixa deixa o modelo previsível (quase sempre B); alta o deixa mais variado e menos coerente." en="Low temperature makes the model predictable (almost always B); high makes it more varied and less coherent." />}>
          <svg viewBox="0 0 640 220" role="img" aria-label="Barras de probabilidade para três temperaturas / Probability bars for three temperatures">
            <text x="0" y="18" className="pt mut">Logits: A = 1, B = 2. Quanto a escolha de B muda com a temperatura:</text>
            <text x="0" y="18" className="en mut">Logits: A = 1, B = 2. How the chance of picking B changes with temperature:</text>
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
        <Callout tone="good" icon="check"><T pt={<>Dica de depuração do livro: olhe as <em>logprobs</em> (probabilidades em escala log) quando a API as oferece. Se elas parecem aleatórias, o modelo não aprendeu o que você espera.</>} en={<>Debugging tip from the book: look at the <em>logprobs</em> (probabilities on a log scale) when the API offers them. If they look random, the model has not learned what you expect.</>} /></Callout>
        <h3><T pt="Do modelo bruto ao assistente" en="From raw model to assistant" /></h3>
        <p><T pt={<>O modelo só pré-treinado é um completador de texto “selvagem”. Dois passos de <em>pós-treinamento</em> o tornam útil: <em>ajuste supervisionado</em> (SFT), em que ele vê exemplos de boas respostas, e <em>ajuste por preferência</em>, em que aprende quais respostas as pessoas preferem. A qualidade dos dados de treino e a escala (parâmetros, tokens e capacidade de computação) explicam grande parte do desempenho.</>} en={<>The pre-trained-only model is a “wild” text completer. Two <em>post-training</em> steps make it useful: <em>supervised finetuning</em> (SFT), where it sees examples of good answers, and <em>preference finetuning</em>, where it learns which answers people prefer. The quality of the training data and the scale (parameters, tokens and compute) explain a large share of performance.</>} /></p>
      </Section>
      <Section id="prompt" title={<T pt="Prompt engineering" en="Prompt engineering" />}>
        <p><T pt={<>Um <em>prompt</em> reúne instruções, exemplos, contexto e a pergunta. Por baixo dos panos, o prompt do sistema e o do usuário são concatenados num texto só, seguindo um <em>chat template</em> que cada modelo define. Usar o template errado causa falhas silenciosas: o modelo responde algo razoável, só que pior. Imprima o prompt final antes de enviar.</>} en={<>A <em>prompt</em> brings together instructions, examples, context and the question. Under the hood, the system and user prompts are concatenated into a single text, following a <em>chat template</em> each model defines. Using the wrong template causes silent failures: the model answers something reasonable, only worse. Print the final prompt before sending it.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Os modelos tendem a usar melhor o que está no começo e no fim do prompt do que o que fica no meio." en="Models tend to use what sits at the start and end of a prompt better than what sits in the middle." />}>
          <svg viewBox="0 0 640 222" role="img" aria-label="Partes de um prompt e atenção por posição / Prompt parts and attention by position">
            <text x="0" y="16" className="pt mut">Um prompt é uma pilha de partes, enviada ao modelo como um texto só:</text>
            <text x="0" y="16" className="en mut">A prompt is a stack of parts, sent to the model as a single text:</text>
            <rect x="0" y="30" width="360" height="38" rx="8" className="ln fillsoft" />
            <text x="180.0" y="53.0" className="pt" textAnchor="middle">Instruções do sistema (papel, regras, formato)</text>
            <text x="180.0" y="53.0" className="en" textAnchor="middle">System instructions (role, rules, format)</text>
            <rect x="0" y="76" width="360" height="38" rx="8" className="ln" />
            <text x="180.0" y="99.0" className="pt" textAnchor="middle">Exemplos do que você espera</text>
            <text x="180.0" y="99.0" className="en" textAnchor="middle">Examples of what you expect</text>
            <rect x="0" y="122" width="360" height="38" rx="8" className="ln" />
            <text x="180.0" y="145.0" className="pt" textAnchor="middle">Contexto (documentos, histórico)</text>
            <text x="180.0" y="145.0" className="en" textAnchor="middle">Context (documents, history)</text>
            <rect x="0" y="168" width="360" height="38" rx="8" className="ln fillsoft" />
            <text x="180.0" y="191.0" className="pt" textAnchor="middle">Pergunta do usuário</text>
            <text x="180.0" y="191.0" className="en" textAnchor="middle">User question</text>
            <text x="400" y="52" className="pt mut">Atenção do modelo</text>
            <text x="400" y="52" className="en mut">Model attention</text>
            <path d="M400 140C430 70 470 60 500 120C520 170 540 170 560 120C580 70 610 60 630 60" className="ln" />
            <path d="M400 190H630" className="ln" />
            <text x="400" y="210" className="pt mut">início</text>
            <text x="400" y="210" className="en mut">start</text>
            <text x="630" y="210" className="pt mut" textAnchor="end">fim</text>
            <text x="630" y="210" className="en mut" textAnchor="end">end</text>
            <text x="515" y="210" className="pt mut" textAnchor="middle">meio</text>
            <text x="515" y="210" className="en mut" textAnchor="middle">middle</text>
          </svg>
        </Diagram>
        <p><T pt="O teste “agulha no palheiro” mostra o efeito da figura: esconda um fato em posições diferentes de um texto longo e peça para o modelo achá-lo. Os modelos testados achavam melhor no começo e no fim." en="The “needle in a haystack” test shows the effect in the figure: hide a fact at different positions in a long text and ask the model to find it. The models tested did better at the start and end." /></p>
        <h3><T pt="Boas práticas que valem para quase todo modelo" en="Best practices that hold for almost any model" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Instruções claras e explícitas:</em> diga o papel, a tarefa, o formato e o que evitar.</>} en={<><em>Clear, explicit instructions:</em> state the role, the task, the format and what to avoid.</>} /></li>
          <li><T pt={<><em>Dê contexto suficiente:</em> o modelo só sabe o que está no prompt (e no treino).</>} en={<><em>Give enough context:</em> the model only knows what is in the prompt (and in training).</>} /></li>
          <li><T pt={<><em>Quebre tarefas complexas em subtarefas</em> encadeadas, cada uma com seu prompt simples.</>} en={<><em>Break complex tasks into subtasks</em> chained together, each with its own simple prompt.</>} /></li>
          <li><T pt={<><em>Dê tempo para pensar:</em> pedir o raciocínio passo a passo (chain-of-thought) melhora tarefas difíceis.</>} en={<><em>Give the model time to think:</em> asking for step-by-step reasoning (chain-of-thought) improves hard tasks.</>} /></li>
          <li><T pt={<><em>Itere e versione:</em> trate prompts como código: teste, compare, guarde versões.</>} en={<><em>Iterate and version:</em> treat prompts like code: test, compare, keep versions.</>} /></li>
        </ul>
        <h3><T pt="Um exemplo simples (inventado)" en="A simple example (invented)" /></h3>
        <CodeBlock code={`Ruim:   "Resuma isto."

Melhor: "Você é um assistente de suporte. Resuma o e-mail abaixo
        em até 3 frases para um gerente. Destaque o pedido do
        cliente e o prazo. Se faltar o prazo, escreva 'prazo não
        informado'.

        E-mail: <<<...>>>"`} />
        <h3><T pt="Defesa: seu prompt também é uma superfície de ataque" en="Defense: your prompt is also an attack surface" /></h3>
        <p><T pt={<>O livro lista três ataques: <em>extração do prompt</em> (descobrir suas instruções), <em>jailbreak e injeção de prompt</em> (fazer o modelo agir mal, inclusive por texto escondido em documentos que ele lê) e <em>extração de informação</em> (vazar dados de treino ou de contexto). Com ferramentas, o risco sobe: um ataque pode virar execução de código ou consulta indevida ao banco. Mitigue limitando as permissões das ferramentas, filtrando entradas e saídas e tratando todo conteúdo externo como dado, não como ordem.</>} en={<>The book lists three attacks: <em>prompt extraction</em> (discovering your instructions), <em>jailbreaking and prompt injection</em> (making the model misbehave, including through text hidden in documents it reads) and <em>information extraction</em> (leaking training or context data). With tools the risk goes up: an attack can become code execution or an improper database query. Mitigate by limiting tool permissions, filtering inputs and outputs, and treating all external content as data, not orders.</>} /></p>
      </Section>
      <Section id="rag" title={<T pt="RAG: dar ao modelo o que ele não sabe" en="RAG: giving the model what it doesn’t know" />}>
        <p><T pt={<>O modelo não conhece seus documentos privados e pode estar desatualizado. O <em>RAG</em> (Retrieval-Augmented Generation) resolve em dois passos: <em>buscar</em> os trechos relevantes numa base externa e <em>gerar</em> a resposta com eles no prompt. Também economiza contexto e dinheiro, porque você manda só o que importa.</>} en={<>The model doesn’t know your private documents and may be out of date. <em>RAG</em> (Retrieval-Augmented Generation) fixes that in two steps: <em>retrieve</em> the relevant chunks from an external base and <em>generate</em> the answer with them in the prompt. It also saves context and money, because you send only what matters.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="O modelo não precisa saber tudo: ele recebe, junto da pergunta, os trechos mais relevantes." en="The model does not need to know everything: it receives, together with the question, the most relevant chunks." />}>
          <svg viewBox="0 0 640 190" role="img" aria-label="Fluxo do RAG / RAG flow">
            <rect x="0" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="50.0" y="82.0" className="pt" textAnchor="middle">Pergunta</text>
            <text x="50.0" y="82.0" className="en" textAnchor="middle">Question</text>
            <path d="M100 78H128" className="ln" />
            <path d="M122 73L128 78L122 83" className="ln" />
            <rect x="128" y="52" width="110" height="52" rx="8" className="ln fillsoft" />
            <text x="183.0" y="76.0" className="" textAnchor="middle">Retriever</text>
            <text x="183.0" y="93.0" className="pt mut" textAnchor="middle">busca trechos</text>
            <text x="183.0" y="93.0" className="en mut" textAnchor="middle">finds chunks</text>
            <path d="M238 78H266" className="ln" />
            <path d="M260 73L266 78L260 83" className="ln" />
            <rect x="266" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="316.0" y="76.0" className="" textAnchor="middle">Prompt</text>
            <text x="316.0" y="93.0" className="pt mut" textAnchor="middle">+ trechos</text>
            <text x="316.0" y="93.0" className="en mut" textAnchor="middle">+ chunks</text>
            <path d="M366 78H394" className="ln" />
            <path d="M388 73L394 78L388 83" className="ln" />
            <rect x="394" y="52" width="100" height="52" rx="8" className="ln" />
            <text x="444.0" y="82.0" className="pt" textAnchor="middle">Modelo</text>
            <text x="444.0" y="82.0" className="en" textAnchor="middle">Model</text>
            <path d="M494 78H522" className="ln" />
            <path d="M516 73L522 78L516 83" className="ln" />
            <rect x="522" y="52" width="112" height="52" rx="8" className="ln fill" />
            <text x="578.0" y="82.0" className="pt inv" textAnchor="middle">Resposta</text>
            <text x="578.0" y="82.0" className="en inv" textAnchor="middle">Answer</text>
            <path d="M183 104V158H176" className="ln dash" />
            <rect x="0" y="140" width="176" height="36" rx="8" className="ln dash" />
            <text x="88.0" y="162.0" className="pt" textAnchor="middle">Base de conhecimento</text>
            <text x="88.0" y="162.0" className="en" textAnchor="middle">Knowledge base</text>
            <text x="300" y="20" className="pt" textAnchor="middle">RAG: primeiro buscar, depois responder</text>
            <text x="300" y="20" className="en" textAnchor="middle">RAG: first retrieve, then answer</text>
          </svg>
        </Diagram>
        <h3><T pt="Dois jeitos de buscar" en="Two ways to retrieve" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Por termos</em> (TF-IDF, BM25, Elasticsearch): conta palavras. Quanto mais um termo aparece num documento (<em>TF</em>), mais relevante; quanto mais documentos contêm o termo, menos informativo ele é (<em>IDF</em>). Um <em>índice invertido</em> guarda, para cada termo, os documentos onde ele aparece. É leve e um excelente ponto de partida.</>} en={<><em>By terms</em> (TF-IDF, BM25, Elasticsearch): counts words. The more a term appears in a document (<em>TF</em>), the more relevant; the more documents contain the term, the less informative it is (<em>IDF</em>). An <em>inverted index</em> stores, for each term, the documents where it appears. It is light and an excellent starting point.</>} /></li>
          <li><T pt={<><em>Por embeddings</em> (busca vetorial): cada trecho vira um vetor numérico que captura o <em>significado</em>, e a busca acha os vetores mais próximos do vetor da pergunta. Acha “carro” quando você escreveu “automóvel”, mas custa mais.</>} en={<><em>By embeddings</em> (vector search): each chunk becomes a numeric vector capturing its <em>meaning</em>, and the search finds the vectors closest to the question’s vector. It finds “car” when you wrote “automobile”, but costs more.</>} /></li>
        </ul>
        <CodeBlock code={`Índice invertido (simplificado)
termo      docs onde aparece (documento, frequência)
banana     (10, 3)  (5, 2)
machine    (1, 5)  (10, 1)  (38, 9)  (42, 5)`} />
        <p><T pt="Exemplo de IDF do livro: se há 10 documentos e 5 contêm o termo, a razão 10 / 5 = 2. Um termo presente em todos os documentos (como “de”) tem IDF baixo e pouco ajuda. Na prática usa-se o logaritmo dessa razão." en="Book example of IDF: with 10 documents, 5 of which contain the term, the ratio is 10 / 5 = 2. A term in every document (like “the”) has a low IDF and helps little. In practice the logarithm of that ratio is used." /></p>
        <h3><T pt="Quebrar os documentos em trechos (chunking)" en="Splitting documents into chunks" /></h3>
        <p><T pt={<>Como você divide importa. Dá para cortar por tamanho fixo, por frase, por parágrafo ou recursivamente (seção, depois parágrafo, depois frase). Use <em>sobreposição</em> entre trechos: se o texto “Deixei um bilhete para minha esposa” for cortado em “Deixei um bilhete para” e “minha esposa”, nenhum pedaço faz sentido sozinho. Trechos menores permitem colocar mais fontes no prompt; trechos maiores guardam mais contexto.</>} en={<>How you split matters. You can cut by fixed size, by sentence, by paragraph or recursively (section, then paragraph, then sentence). Use <em>overlap</em> between chunks: if “I left my wife a note” is cut into “I left my wife” and “a note”, neither piece makes sense alone. Smaller chunks let you fit more sources in the prompt; bigger ones keep more context.</>} /></p>
      </Section>
      <Section id="agents" title={<T pt="Agentes" en="Agents" />}>
        <p><T pt={<>Um <em>agente</em> é qualquer coisa que percebe um ambiente e age nele. Em IA, o modelo é o “cérebro” que planeja, e as <em>ferramentas</em> (buscar na web, rodar código, consultar SQL, chamar APIs) são as mãos. Um sistema RAG é um agente simples cuja única ferramenta é o buscador.</>} en={<>An <em>agent</em> is anything that perceives an environment and acts on it. In AI, the model is the “brain” that plans, and <em>tools</em> (web search, running code, SQL queries, API calls) are the hands. A RAG system is a simple agent whose only tool is the retriever.</>} /></p>
        <p><T pt="Exemplo do livro: “projete as vendas dos próximos três meses”. O agente raciocina que precisa do histórico, gera e executa uma consulta SQL, vê que faltam dados, busca as campanhas de marketing passadas, e só então produz a projeção." en="Book example: “project sales for the next three months”. The agent reasons that it needs the history, generates and runs a SQL query, sees data is missing, fetches past marketing campaigns, and only then produces the projection." /></p>
        <Diagram minWidth={600} caption={<T pt="Mesmo com 95% de acerto por passo, tarefas de 10 passos acertam ~60% e as de 100 passos, ~0,6%." en="Even at 95% accuracy per step, 10-step tasks succeed ~60% and 100-step tasks ~0.6%." />}>
          <svg viewBox="0 0 680 140" role="img" aria-label="Ciclo do agente e queda de acerto / Agent loop and accuracy drop">
            <text x="10" y="20" className="pt mut" textAnchor="start">Ciclo de um agente</text>
            <text x="10" y="20" className="en mut" textAnchor="start">An agent’s loop</text>
            <rect x="10" y="34" width="110" height="44" rx="4" className="ln" />
            <text x="65" y="60" className="pt" textAnchor="middle">Planejar</text>
            <text x="65" y="60" className="en" textAnchor="middle">Plan</text>
            <rect x="160" y="34" width="130" height="44" rx="4" className="ln fillsoft" />
            <text x="225" y="60" className="pt" textAnchor="middle">Agir (ferramenta)</text>
            <text x="225" y="60" className="en" textAnchor="middle">Act (tool)</text>
            <rect x="330" y="34" width="110" height="44" rx="4" className="ln" />
            <text x="385" y="60" className="pt" textAnchor="middle">Observar</text>
            <text x="385" y="60" className="en" textAnchor="middle">Observe</text>
            <path d="M120 56L160 56" className="ln" />
            <path d="M153.2 52.7L160 56L153.2 59.3" className="ln" />
            <path d="M290 56L330 56" className="ln" />
            <path d="M323.2 52.7L330 56L323.2 59.3" className="ln" />
            <path d="M385 78L385 104" className="ln" />
            <path d="M385 104L65 104" className="ln" />
            <path d="M65 104L65 80" className="ln" />
            <path d="M61.7 86.8L65 80L68.3 86.8" className="ln" />
            <text x="225" y="124" className="pt mut" textAnchor="middle">repete até concluir (ou desistir)</text>
            <text x="225" y="124" className="en mut" textAnchor="middle">repeats until done (or abandoned)</text>
            <text x="480" y="20" className="pt mut" textAnchor="start">Erro composto, 95% por passo</text>
            <text x="480" y="20" className="en mut" textAnchor="start">Compounding error, 95% per step</text>
            <text x="480" y="52" className="pt mono" textAnchor="start">1 passo</text>
            <text x="480" y="52" className="en mono" textAnchor="start">1 step</text>
            <rect x="560" y="38" width="57" height="18" rx="4" className="fill" />
            <text x="625" y="52" className="mono" textAnchor="start">95%</text>
            <text x="480" y="82" className="pt mono" textAnchor="start">10 passos</text>
            <text x="480" y="82" className="en mono" textAnchor="start">10 steps</text>
            <rect x="560" y="68" width="36" height="18" rx="4" className="fill" />
            <text x="604" y="82" className="mono" textAnchor="start">60%</text>
            <text x="480" y="112" className="pt mono" textAnchor="start">100 passos</text>
            <text x="480" y="112" className="en mono" textAnchor="start">100 steps</text>
            <rect x="560" y="98" width="2" height="18" rx="4" className="fill" />
            <text x="570" y="112" className="mono" textAnchor="start">0.6%</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><em>Planejamento:</em> separar o plano da execução permite validar o plano antes de agir.</>} en={<><em>Planning:</em> separating the plan from execution lets you validate the plan before acting.</>} /></li>
          <li><T pt={<><em>Reflexão e correção de erros:</em> o agente confere o resultado e tenta de novo.</>} en={<><em>Reflection and error correction:</em> the agent checks the result and tries again.</>} /></li>
          <li><T pt={<><em>Memória:</em> guardar o que já foi feito e aprendido.</>} en={<><em>Memory:</em> keeping what has been done and learned.</>} /></li>
          <li><T pt={<><em>Mais ferramentas, mais poder, mais risco:</em> quanto mais autonomia, mais graves as falhas. Peça confirmação humana antes de ações irreversíveis.</>} en={<><em>More tools, more power, more risk:</em> the more autonomy, the worse the failures. Ask for human confirmation before irreversible actions.</>} /></li>
        </ul>
      </Section>
      <Section id="eval" title={<T pt="Avaliação: como saber se funciona" en="Evaluation: knowing whether it works" />}>
        <p><T pt="O livro dedica dois capítulos à avaliação, porque sem ela você não sabe se melhorou ou piorou. Como as respostas são abertas, não dá para só comparar com um gabarito. As técnicas:" en="The book devotes two chapters to evaluation, because without it you can’t tell whether you improved or regressed. Since answers are open-ended, you can’t just compare against an answer key. The techniques:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Correção funcional:</em> rode o resultado. O SQL gerado devolve os dados certos? O código passa nos testes? É a avaliação mais confiável quando é possível.</>} en={<><em>Functional correctness:</em> run the result. Does the generated SQL return the right data? Does the code pass the tests? It is the most reliable evaluation when possible.</>} /></li>
          <li><T pt={<><em>Similaridade com uma resposta de referência:</em> igualdade exata, parecença de texto ou de significado (embeddings).</>} en={<><em>Similarity to a reference answer:</em> exact match, text overlap or meaning similarity (embeddings).</>} /></li>
          <li><T pt={<><em>IA como juiz:</em> outro modelo dá nota ou compara respostas. É flexível e explica a nota, mas é subjetivo: depende do juiz e do prompt do juiz, e muda quando o juiz muda.</>} en={<><em>AI as a judge:</em> another model scores or compares answers. It is flexible and explains its score, but it is subjective: it depends on the judge and the judge’s prompt, and it changes when the judge changes.</>} /></li>
          <li><T pt={<><em>Avaliação comparativa:</em> “qual das duas é melhor, A ou B?”, como num ranking de xadrez.</>} en={<><em>Comparative evaluation:</em> “which one is better, A or B?”, like a chess ranking.</>} /></li>
          <li><T pt={<><em>Pessoas:</em> amostras revisadas por humanos continuam essenciais.</>} en={<><em>People:</em> samples reviewed by humans remain essential.</>} /></li>
        </ul>
        <CodeBlock code={`Prompt de juiz (simplificado, do tipo mostrado no livro)
"Dada a pergunta e a resposta, dê uma nota de 1 a 5.
 1 = muito ruim, 5 = muito boa.
 Pergunta: [PERGUNTA]
 Resposta: [RESPOSTA]
 Nota:"`} />
        <h3><T pt="Montando seu pipeline de avaliação" en="Building your evaluation pipeline" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Avalie <em>cada componente</em> do sistema (busca, geração, ferramentas), não só o resultado final.</>} en={<>Evaluate <em>each component</em> of the system (retrieval, generation, tools), not only the final result.</>} /></li>
          <li><T pt={<>Escreva um <em>guia de avaliação</em>: o que é uma boa resposta para o seu caso? Inclua exemplos.</>} en={<>Write an <em>evaluation guideline</em>: what is a good answer in your case? Include examples.</>} /></li>
          <li><T pt={<>Defina <em>métodos e dados</em>: um conjunto de perguntas reais, de casos fáceis e difíceis, que você roda a cada mudança.</>} en={<>Define <em>methods and data</em>: a set of real questions, easy and hard cases, that you run on every change.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt="Cuidado com benchmarks públicos: servem para descartar modelos ruins, não para achar o melhor para você, e podem estar “contaminados” (ter entrado nos dados de treino). Monte o seu próprio “ranking privado”." en="Beware of public benchmarks: they help weed out bad models, not find the best one for you, and may be “contaminated” (they may have entered the training data). Build your own “private leaderboard”." /></Callout>
      </Section>
      <Section id="finetune" title={<T pt="Finetuning e dados" en="Finetuning and data" />}>
        <p><T pt={<><em>Finetuning</em> é continuar o treino do modelo com seus exemplos. A regra de bolso do livro: <em>finetuning é para forma, RAG é para fatos.</em></>} en={<><em>Finetuning</em> is continuing the model’s training on your examples. The book’s rule of thumb: <em>finetuning is for form, RAG is for facts.</em></>} /></p>
        <Table
          head={[<T pt="Problema do modelo" en="Model problem" />, <T pt="Tipo" en="Type" />, <T pt="Tente primeiro" en="Try first" />]}
          rows={[
            [<T pt="Inventa ou desconhece fatos, informação desatualizada" en="Makes up or lacks facts, outdated information" />, <T pt="de informação" en="information" />, "RAG"],
            [<T pt="Formato errado, tom errado, resposta correta porém inútil" en="Wrong format, wrong tone, correct but useless answer" />, <T pt="de comportamento" en="behavior" />, "Finetuning"],
          ]}
        />
        <p><T pt="Antes de ajustar, esgote o prompting. Para testar a ideia, comece com um conjunto pequeno e bem feito (50 a 100 exemplos); se não há melhora nenhuma, mais dados raramente resolvem." en="Before finetuning, exhaust prompting. To test the idea, start with a small, well-made set (50 to 100 examples); if there is no improvement at all, more data rarely helps." /></p>
        <h3><T pt="Ajustar sem quebrar o orçamento: PEFT e LoRA" en="Finetuning without breaking the budget: PEFT and LoRA" /></h3>
        <p><T pt={<>Treinar todos os pesos de um modelo grande exige muita memória. Os métodos <em>PEFT</em> treinam só uma fração. O mais popular é o <em>LoRA</em>: em vez de alterar uma matriz grande <code>W</code>, você a congela e treina duas matrizes finas, <code>A</code> e <code>B</code>, cujo produto é somado a <code>W</code>. No exemplo do livro, uma matriz 9 × 9 tem 81 números, mas fatorada em 9 × 1 e 1 × 9 tem só 18. Num caso citado do GPT-3, o LoRA treinou cerca de 4,7 milhões de parâmetros, 0,0027% do ajuste completo, com desempenho comparável em várias tarefas. Os módulos LoRA também são fáceis de trocar e combinar.</>} en={<>Training all the weights of a big model takes a lot of memory. <em>PEFT</em> methods train only a fraction. The most popular is <em>LoRA</em>: instead of changing a large matrix <code>W</code>, you freeze it and train two thin matrices, <code>A</code> and <code>B</code>, whose product is added to <code>W</code>. In the book’s example a 9 × 9 matrix has 81 numbers, but factored into 9 × 1 and 1 × 9 it has only 18. In a cited GPT-3 case, LoRA trained about 4.7 million parameters, 0.0027% of full finetuning, with comparable performance on several tasks. LoRA modules are also easy to swap and combine.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="LoRA ajusta o modelo treinando só duas matrizes pequenas, em vez de todos os pesos." en="LoRA adapts the model by training only two small matrices instead of all the weights." />}>
          <svg viewBox="0 0 640 230" role="img" aria-label="Matriz W somada ao produto de A por B / Matrix W plus the product of A and B">
            <text x="10" y="28" className="pt mut" textAnchor="start">duas matrizes finas, só estas são treinadas</text>
            <text x="10" y="28" className="en mut" textAnchor="start">two thin matrices, only these get trained</text>
            <rect x="10" y="44" width="150" height="150" rx="4" className="ln fillsoft" />
            <text x="85" y="123" className="" textAnchor="middle">W</text>
            <text x="85" y="214" className="pt mut" textAnchor="middle">pesos originais, congelados</text>
            <text x="85" y="214" className="en mut" textAnchor="middle">original weights, frozen</text>
            <text x="190" y="123" className="" textAnchor="middle">+</text>
            <rect x="215" y="44" width="26" height="150" rx="4" className="fill" />
            <text x="228" y="214" className="mut" textAnchor="middle">A</text>
            <text x="262" y="123" className="" textAnchor="middle">×</text>
            <rect x="285" y="108" width="150" height="26" rx="4" className="fill" />
            <text x="360" y="154" className="mut" textAnchor="middle">B</text>
            <text x="470" y="90" className="pt" textAnchor="start">Exemplo: matriz 9 × 9</text>
            <text x="470" y="90" className="en" textAnchor="start">Example: 9 × 9 matrix</text>
            <text x="470" y="112" className="pt mut" textAnchor="start">completa: 81 números</text>
            <text x="470" y="112" className="en mut" textAnchor="start">full: 81 numbers</text>
            <text x="470" y="134" className="mut" textAnchor="start">A (9×1) + B (1×9):</text>
            <text x="470" y="152" className="pt mut" textAnchor="start">18 números</text>
            <text x="470" y="152" className="en mut" textAnchor="start">18 numbers</text>
          </svg>
        </Diagram>
        <h3><T pt="Engenharia de dados" en="Dataset engineering" /></h3>
        <p><T pt={<>Os dados de treino têm três critérios: <em>qualidade</em>, <em>cobertura</em> (variedade de casos) e <em>quantidade</em>. Pouco dado de alta qualidade pode superar muito dado ruidoso. Quando faltam exemplos, usa-se <em>dados sintéticos</em> gerados por outro modelo, que também precisam ser avaliados. O livro lembra: dá para automatizar a geração, mas não o pensar sobre quais dados você quer nem a atenção aos detalhes.</>} en={<>Training data has three criteria: <em>quality</em>, <em>coverage</em> (variety of cases) and <em>quantity</em>. A little high-quality data can beat a lot of noisy data. When examples are scarce, <em>synthetic data</em> generated by another model is used, and it must be evaluated too. The book reminds us: you can automate generation, but not thinking about which data you want, nor attention to detail.</>} /></p>
      </Section>
      <Section id="inference" title={<T pt="Inferência: velocidade e custo" en="Inference: speed and cost" />}>
        <p><T pt={<>Um modelo bom demais e lento demais não serve. A resposta tem duas fases: o <em>prefill</em> (ler o prompt, que define o tempo até o primeiro token, <em>TTFT</em>) e o <em>decode</em> (gerar um token por vez, com tempo por token <em>TPOT</em>). Para ler em streaming, algo como 120 ms por token já acompanha uma leitura rápida.</>} en={<>A model that is too good and too slow is useless. The answer has two phases: <em>prefill</em> (reading the prompt, which sets the time to first token, <em>TTFT</em>) and <em>decode</em> (generating one token at a time, with time per token <em>TPOT</em>). For streamed reading, around 120 ms per token already keeps up with fast readers.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="O 1º token depende da leitura do prompt (prefill); os seguintes são gerados um a um (decode)." en="The first token depends on reading the prompt (prefill); the rest are generated one by one (decode)." />}>
          <svg viewBox="0 0 640 156" role="img" aria-label="Linha do tempo de uma resposta / Timeline of a response">
            <text x="0" y="16" className="pt mut">Uma resposta em streaming:</text>
            <text x="0" y="16" className="en mut">A streaming response:</text>
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
            <text x="65" y="80" className="pt mut" textAnchor="middle">tempo até o 1º token</text>
            <text x="65" y="80" className="en mut" textAnchor="middle">time to first token</text>
            <text x="375" y="80" className="pt mut" textAnchor="middle">TPOT: tempo por token de saída, repetido a cada token</text>
            <text x="375" y="80" className="en mut" textAnchor="middle">TPOT: time per output token, repeated for each token</text>
            <text x="0" y="116" className="pt">latência total = TTFT + TPOT × nº de tokens de saída</text>
            <text x="0" y="116" className="en">total latency = TTFT + TPOT × number of output tokens</text>
            <text x="0" y="140" className="pt mut">Ex.: se cada token leva 100 ms, 1.000 tokens levam 100 s.</text>
            <text x="0" y="140" className="en mut">E.g. if each token takes 100 ms, 1,000 tokens take 100 s.</text>
          </svg>
        </Diagram>
        <p><T pt={<>Há um equilíbrio entre latência e custo: agrupar muitas requisições (batching) baixa o custo por resposta, mas pode aumentar a espera. Técnicas citadas: <em>quantização</em> (usar menos bits por número), <em>destilação</em> (treinar um modelo menor para imitar um maior), <em>KV cache</em> (guardar cálculos já feitos do prompt) e <em>prompt caching</em> (reaproveitar o início de prompts repetidos, útil com documentos longos). Se você usa APIs, boa parte já vem pronta; saber isso ajuda a comparar fornecedores.</>} en={<>There is a trade-off between latency and cost: grouping many requests (batching) lowers cost per answer but can increase waiting. Techniques mentioned: <em>quantization</em> (fewer bits per number), <em>distillation</em> (training a smaller model to imitate a bigger one), <em>KV cache</em> (keeping calculations already done on the prompt) and <em>prompt caching</em> (reusing the start of repeated prompts, useful with long documents). If you use APIs much of this comes built in; knowing it helps compare vendors.</>} /></p>
      </Section>
      <Section id="architecture" title={<T pt="Arquitetura de uma aplicação de IA" en="Architecture of an AI application" />}>
        <p><T pt="O último capítulo junta tudo e propõe crescer em etapas, só quando preciso. Começa com o caminho mínimo (a pergunta vai ao modelo e a resposta volta) e vai acrescentando:" en="The last chapter ties it all together and proposes growing in steps, only when needed. It starts with the minimal path (the question goes to the model and the answer comes back) and adds:" /></p>
        <Diagram minWidth={560} caption={<T pt="Comece pelo caminho simples (usuário → modelo) e vá adicionando camadas só quando surgir a necessidade." en="Start with the simple path (user → model) and add layers only when a need appears." />}>
          <svg viewBox="0 0 640 296" role="img" aria-label="Camadas entre o usuário e o modelo / Layers between the user and the model">
            <rect x="0" y="6" width="150" height="40" rx="8" className="ln" />
            <text x="75.0" y="30.0" className="pt" textAnchor="middle">Usuário</text>
            <text x="75.0" y="30.0" className="en" textAnchor="middle">User</text>
            <path d="M150 26H190" className="ln" />
            <path d="M184 21L190 26L184 31" className="ln" />
            <rect x="190" y="6" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="25.0" className="pt" textAnchor="middle">1. Contexto</text>
            <text x="315.0" y="25.0" className="en" textAnchor="middle">1. Context</text>
            <text x="315.0" y="42.0" className="pt mut" textAnchor="middle">RAG e ferramentas</text>
            <text x="315.0" y="42.0" className="en mut" textAnchor="middle">RAG and tools</text>
            <rect x="190" y="56" width="250" height="42" rx="8" className="ln" />
            <text x="315.0" y="75.0" className="" textAnchor="middle">2. Guardrails</text>
            <text x="315.0" y="92.0" className="pt mut" textAnchor="middle">filtros de entrada e saída</text>
            <text x="315.0" y="92.0" className="en mut" textAnchor="middle">input and output filters</text>
            <rect x="190" y="106" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="125.0" className="pt" textAnchor="middle">3. Router e gateway</text>
            <text x="315.0" y="125.0" className="en" textAnchor="middle">3. Router and gateway</text>
            <text x="315.0" y="142.0" className="pt mut" textAnchor="middle">escolhe o modelo certo</text>
            <text x="315.0" y="142.0" className="en mut" textAnchor="middle">picks the right model</text>
            <rect x="190" y="156" width="250" height="42" rx="8" className="ln" />
            <text x="315.0" y="175.0" className="" textAnchor="middle">4. Caches</text>
            <text x="315.0" y="192.0" className="pt mut" textAnchor="middle">exato e semântico</text>
            <text x="315.0" y="192.0" className="en mut" textAnchor="middle">exact and semantic</text>
            <rect x="190" y="206" width="250" height="42" rx="8" className="ln fillsoft" />
            <text x="315.0" y="225.0" className="pt" textAnchor="middle">5. Agentes</text>
            <text x="315.0" y="225.0" className="en" textAnchor="middle">5. Agents</text>
            <text x="315.0" y="242.0" className="pt mut" textAnchor="middle">lógica complexa e ações</text>
            <text x="315.0" y="242.0" className="en mut" textAnchor="middle">complex logic and actions</text>
            <path d="M440 26H480" className="ln" />
            <path d="M474 21L480 26L474 31" className="ln" />
            <rect x="480" y="6" width="150" height="40" rx="8" className="ln fill" />
            <text x="555.0" y="30.0" className="pt inv" textAnchor="middle">Modelo</text>
            <text x="555.0" y="30.0" className="en inv" textAnchor="middle">Model</text>
            <path d="M565 46V262H0V262" className="ln dash" />
            <text x="320" y="282" className="pt mut" textAnchor="middle">Monitoramento e observabilidade cobrem tudo; o feedback dos usuários volta como dados.</text>
            <text x="320" y="282" className="en mut" textAnchor="middle">Monitoring and observability cover everything; user feedback flows back as data.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><T pt={<><em>Contexto:</em> RAG e ferramentas, como “feature engineering” do modelo.</>} en={<><em>Context:</em> RAG and tools, like “feature engineering” for the model.</>} /></li>
          <li><T pt={<><em>Guardrails:</em> na entrada, bloquear ou mascarar dados sensíveis e ataques; na saída, checar formato, toxicidade e fatos.</>} en={<><em>Guardrails:</em> on input, block or mask sensitive data and attacks; on output, check format, toxicity and facts.</>} /></li>
          <li><T pt={<><em>Router e gateway:</em> um classificador de intenção manda perguntas simples para modelos baratos e as difíceis para os fortes; o gateway centraliza chaves, limites e trocas de fornecedor.</>} en={<><em>Router and gateway:</em> an intent classifier sends simple questions to cheap models and hard ones to strong models; the gateway centralizes keys, limits and vendor swaps.</>} /></li>
          <li><T pt={<><em>Caches:</em> o <em>exato</em> reaproveita respostas para pedidos idênticos; o <em>semântico</em> reaproveita para pedidos parecidos.</>} en={<><em>Caches:</em> the <em>exact</em> one reuses answers for identical requests; the <em>semantic</em> one reuses them for similar requests.</>} /></li>
          <li><T pt={<><em>Agentes:</em> fluxos com laços, condições e ações de escrita.</>} en={<><em>Agents:</em> flows with loops, conditions and write actions.</>} /></li>
        </ol>
        <p><T pt={<>Em cima de tudo, <em>observabilidade</em>: métricas e alertas para saber como o sistema falha e achar a causa. E o <em>feedback dos usuários</em> (um polegar para cima, uma edição, uma reclamação) vira dado para melhorar o produto: o chamado <em>data flywheel</em>.</>} en={<>On top of everything, <em>observability</em>: metrics and alerts to know how the system fails and find the cause. And <em>user feedback</em> (a thumbs-up, an edit, a complaint) becomes data to improve the product: the so-called <em>data flywheel</em>.</>} /></p>
        <Callout tone="personal" icon="check"><T pt="Anotação pessoal: este resumo escolhe e simplifica os pontos centrais do livro. Os números (73% e 88% na temperatura, 81 contra 18 parâmetros, 95% por passo, 100 ms por token) vêm do texto; os exemplos marcados como inventados são meus." en="Personal note: this summary picks and simplifies the book’s central points. The numbers (73% and 88% on temperature, 81 versus 18 parameters, 95% per step, 100 ms per token) come from the text; examples marked as invented are mine." /></Callout>
      </Section>
      <div className="sources">
        <b><T pt="Fonte" en="Source" /></b>
        <ul>
          <li><a href="https://www.oreilly.com/library/view/ai-engineering/9781098166298/" rel="noopener">Chip Huyen. AI Engineering: Building Applications with Foundation Models. O’Reilly, 2025.</a></li>
        </ul>
      </div>
    </>
  );
}
