import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "kimi-k2-k3",
  title: { en: "Kimi K2 and K3: open-weight models", pt: "Kimi K2 e K3: modelos de pesos abertos" },
  seo: {
    title: { en: "Kimi K2 and K3: Moonshot AI’s open-weight models", pt: "Kimi K2 e K3: os modelos de pesos abertos da Moonshot AI" },
    description: { en: "Kimi K2 and K3 explained: Mixture-of-Experts (why 2.8T parameters cost 104B per token), hybrid linear attention, 1M context, how to use them by app, API or open weights, cost with a worked example, benchmarks and license.", pt: "Kimi K2 e K3 explicados: Mixture-of-Experts (por que 2,8T de parâmetros custam 104B por token), atenção linear híbrida, contexto de 1M, como usar por app, API ou pesos abertos, custo com um exemplo, benchmarks e licença." },
  },
  summary: "Moonshot AI's Kimi models: Mixture-of-Experts, K2 (1T parameters) versus K3 (2.8T, 104B active, 1M context, hybrid linear attention), how to use them by app, API or open weights, a worked cost example, benchmarks and how to read them, and the K2/K3 licenses.",
  kicker: { en: "Artificial intelligence", pt: "Inteligência artificial" },
  heroTitle: { en: <>Kimi K2 and K3: <em>open-weight models from Moonshot AI.</em></>, pt: <>Kimi K2 e K3: <em>modelos de pesos abertos da Moonshot AI.</em></> },
  heroLede: { en: "What Mixture-of-Experts means in practice, what changed from K2 (1T) to K3 (2.8T, 1M context, always-on reasoning), how to use them by app, API or weights, what they cost, how to read the benchmarks and what the license says.", pt: "O que Mixture-of-Experts significa na prática, o que mudou do K2 (1T) para o K3 (2,8T, contexto de 1M, raciocínio sempre ligado), como usar por app, API ou pesos, quanto custam, como ler os benchmarks e o que diz a licença." },
  published: "2026-10-26",
  updated: "2026-10-26",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é o Kimi" en="What Kimi is" /> },
        { id: "lineup", title: <T pt="A linha do tempo e a família" en="The timeline and the family" /> },
        { id: "moe", title: <T pt="Mixture-of-Experts: por que 2,8 trilhões “custam” 104 bilhões" en="Mixture-of-Experts: why 2.8 trillion “costs” 104 billion" /> },
        { id: "k3", title: <T pt="O que mudou do K2 para o K3" en="What changed from K2 to K3" /> },
        { id: "use", title: <T pt="Como usar: app, API e pesos" en="How to use: app, API and weights" /> },
        { id: "cost", title: <T pt="Quanto custa" en="What it costs" /> },
        { id: "bench", title: <T pt="Benchmarks: como ler os números" en="Benchmarks: how to read the numbers" /> },
        { id: "license", title: <T pt="Licença e cuidados" en="License and cautions" /> },
        { id: "choose", title: <T pt="Quando escolher o Kimi" en="When to choose Kimi" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é o Kimi" en="What Kimi is" />}>
        <p><T pt={<><b>Kimi</b> é a família de modelos de linguagem da <b>Moonshot AI</b>, empresa de Pequim. O nome serve para duas coisas: o <i>assistente</i> (site e app em kimi.com) e os <i>modelos</i> por trás dele, vendidos por API e, na maioria das versões, publicados como <b>pesos abertos</b> (<i>open weights</i>) no Hugging Face. É por esse segundo motivo que o Kimi aparece junto de DeepSeek e Qwen quando se fala em modelos “abertos” que competem com os fechados.</>} en={<><b>Kimi</b> is the language-model family from <b>Moonshot AI</b>, a company based in Beijing. The name covers two things: the <i>assistant</i> (website and app at kimi.com) and the <i>models</i> behind it, sold through an API and, for most versions, published as <b>open weights</b> on Hugging Face. That second point is why Kimi shows up next to DeepSeek and Qwen when people talk about “open” models that compete with closed ones.</>} /></p>
        <Callout tone="use" icon="check"><T pt={<><b>“Pesos abertos” não é “código aberto”.</b> Você pode baixar o modelo treinado e rodá-lo onde quiser, mas os dados e o código de treino não vêm junto, e a licença impõe condições. A seção sobre licença explica o caso do Kimi.</>} en={<><b>“Open weights” is not “open source”.</b> You can download the trained model and run it wherever you like, but the training data and training code do not come with it, and the license sets conditions. The license section explains Kimi’s case.</>} /></Callout>
        <p><T pt={<>Esta nota cobre o <b>Kimi K2</b> (julho de 2025) e o <b>Kimi K3</b> (lançado em julho de 2026), e o que mudou entre eles. Para a ideia geral de modelos abertos e como rodá-los, veja <a href="/notas/llm-agents-open-source/">LLMs de código aberto e agentes</a>; para a arquitetura base de todos eles, <a href="/notas/attention-is-all-you-need/">Attention Is All You Need</a>.</>} en={<>This note covers <b>Kimi K2</b> (July 2025) and <b>Kimi K3</b> (released July 2026), and what changed between them. For the general idea of open models and how to run them, see <a href="/notas/llm-agents-open-source/">Open-source LLMs and AI agents</a>; for the architecture all of them build on, <a href="/notas/attention-is-all-you-need/">Attention Is All You Need</a>.</>} /></p>
      </Section>
      <Section id="lineup" title={<T pt="A linha do tempo e a família" en="The timeline and the family" />}>
        <Diagram minWidth={600} caption={<T pt="Os marcos da família Kimi citados nesta nota." en="The Kimi family milestones cited in this note." />}>
          <svg viewBox="0 0 700 190" role="img" aria-label="Linha do tempo do Kimi / Kimi timeline">
            <path d="M30 80L670 80" className="ln" />
            <circle cx="70" cy="80" r="6" className="ln fillsoft" />
            <text x="70" y="62" className="mono" textAnchor="middle">K2</text>
            <text x="70" y="104" className="pt mut" textAnchor="middle">jul 2025</text>
            <text x="70" y="104" className="en mut" textAnchor="middle">Jul 2025</text>
            <text x="70" y="122" className="mut" textAnchor="middle">1T · 32B</text>
            <circle cx="220" cy="80" r="6" className="ln fillsoft" />
            <text x="220" y="62" className="mono" textAnchor="middle">K2.5</text>
            <text x="220" y="104" className="pt mut" textAnchor="middle">jan 2026</text>
            <text x="220" y="104" className="en mut" textAnchor="middle">Jan 2026</text>
            <circle cx="370" cy="80" r="6" className="ln fillsoft" />
            <text x="370" y="62" className="mono" textAnchor="middle">K2.6 · K2.7 Code</text>
            <text x="370" y="104" className="pt mut" textAnchor="middle">linha atual “barata”</text>
            <text x="370" y="104" className="en mut" textAnchor="middle">current “cheap” line</text>
            <text x="370" y="122" className="mut" textAnchor="middle">$0.95 / $4</text>
            <circle cx="560" cy="80" r="7" className="ln brandfill" />
            <text x="560" y="62" className="mono" textAnchor="middle">K3</text>
            <text x="560" y="104" className="pt mut" textAnchor="middle">API 16 jul 2026</text>
            <text x="560" y="104" className="en mut" textAnchor="middle">API 16 Jul 2026</text>
            <text x="560" y="122" className="pt mut" textAnchor="middle">pesos 27 jul 2026</text>
            <text x="560" y="122" className="en mut" textAnchor="middle">weights 27 Jul 2026</text>
            <text x="560" y="140" className="mut" textAnchor="middle">2.8T · 104B · 1M</text>
            <text x="10" y="176" className="pt mut" textAnchor="start">Preços em US$ por milhão de tokens (entrada / saída). “1T · 32B”: parâmetros totais · ativos.</text>
            <text x="10" y="176" className="en mut" textAnchor="start">Prices in $ per million tokens (input / output). “1T · 32B”: total · active parameters.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Modelo" en="Model" />, <T pt="O que é" en="What it is" />]}
          rows={[
            ["Kimi K2", <T pt={<>Lançado em julho de 2025. MoE com 1 trilhão de parâmetros (32 bilhões ativos por token), contexto de 128K tokens, pesos abertos em duas formas: <code>Kimi-K2-Base</code> (modelo de base, para quem quer ajustar) e <code>Kimi-K2-Instruct</code> (já treinado para seguir instruções e usar ferramentas).</>} en={<>Released July 2025. MoE with 1 trillion parameters (32 billion active per token), 128K-token context, open weights in two forms: <code>Kimi-K2-Base</code> (base model, for fine-tuning) and <code>Kimi-K2-Instruct</code> (already trained to follow instructions and use tools).</>} />],
            ["Kimi K2.5", <T pt="Sucessor do K2, de janeiro de 2026 (data citada pela imprensa; esta nota não detalha o modelo)." en="K2’s successor, from January 2026 (date cited by the press; this note does not detail the model)." />],
            ["Kimi K2.6 · K2.7 Code", <T pt="Hoje formam a linha de custo menor da API: K2.6 de uso geral e K2.7 Code para programação, ambos a US$ 0,95 por milhão de tokens de entrada e US$ 4 de saída, com contexto de pelo menos 256 mil tokens (valores da cobertura do lançamento do K3)." en="Today they form the lower-cost line of the API: K2.6 for general use and K2.7 Code for programming, both at $0.95 per million input tokens and $4 output, with a context of at least 256 thousand tokens (figures from the K3 launch coverage)." />],
            ["Kimi K3", <T pt={<>O carro-chefe. API e app em 16 de julho de 2026; pesos publicados em 27 de julho (alguns relatos dizem que foram um dia antes). MoE de 2,8 trilhões de parâmetros, 104 bilhões ativos, contexto de 1 milhão de tokens, entende imagens e <i>sempre</i> raciocina antes de responder.</>} en={<>The flagship. API and app on July 16, 2026; weights published on July 27 (some reports say a day earlier). MoE with 2.8 trillion parameters, 104 billion active, 1-million-token context, understands images and <i>always</i> reasons before answering.</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Há notícias de um <b>K3.1</b> em outubro de 2026, mas as fontes divergem: umas falam em lançamento, outras só em teaser sem data. Não o cubro aqui. Confira a página oficial antes de escolher a versão.</>} en={<>There are reports of a <b>K3.1</b> in October 2026, but the sources disagree: some say it launched, others only a teaser with no date. I do not cover it here. Check the official page before picking a version.</>} /></Callout>
      </Section>
      <Section id="moe" title={<T pt="Mixture-of-Experts: por que 2,8 trilhões “custam” 104 bilhões" en="Mixture-of-Experts: why 2.8 trillion “costs” 104 billion" />}>
        <p><T pt={<>Num modelo <i>denso</i>, cada token passa por <b>todos</b> os parâmetros. Num <b>Mixture-of-Experts</b> (MoE), a parte “feed-forward” de cada camada é dividida em centenas de blocos pequenos, os <i>especialistas</i>. Um pequeno <b>roteador</b> (<i>router</i>) olha o token e escolhe só alguns especialistas para ele; os outros ficam parados. O modelo tem muito conhecimento guardado (muitos parâmetros), mas cada token só “paga” o cálculo dos poucos especialistas escolhidos mais as partes que sempre rodam (como a atenção).</>} en={<>In a <i>dense</i> model, every token goes through <b>all</b> the parameters. In a <b>Mixture-of-Experts</b> (MoE), each layer’s “feed-forward” part is split into hundreds of small blocks, the <i>experts</i>. A small <b>router</b> looks at the token and picks only a few experts for it; the others sit idle. The model stores a lot of knowledge (many parameters), but each token only “pays” the compute of the few chosen experts plus the parts that always run (like attention).</>} /></p>
        <Diagram minWidth={600} caption={<T pt="Uma camada MoE do K3: o roteador escolhe 16 de 896 especialistas para cada token." en="One K3 MoE layer: the router picks 16 of 896 experts for each token." />}>
          <svg viewBox="0 0 700 258" role="img" aria-label="Roteamento em um MoE / Routing in an MoE">
            <rect x="10" y="90" width="90" height="44" rx="4" className="ln fillsoft" />
            <text x="55" y="116" className="pt" textAnchor="middle">token</text>
            <text x="55" y="116" className="en" textAnchor="middle">token</text>
            <path d="M100 112L150 112" className="ln" />
            <path d="M142.8 115.5L150 112L142.8 108.5" className="ln" />
            <rect x="150" y="82" width="100" height="60" rx="4" className="ln brandfill" />
            <text x="200" y="108" className="pt" textAnchor="middle">roteador</text>
            <text x="200" y="108" className="en" textAnchor="middle">router</text>
            <text x="200" y="127" className="pt mut" textAnchor="middle">escolhe 16</text>
            <text x="200" y="127" className="en mut" textAnchor="middle">picks 16</text>
            <path d="M250 112L300 112" className="ln" />
            <path d="M292.8 115.5L300 112L292.8 108.5" className="ln" />
            <rect x="300" y="20" width="270" height="184" rx="4" className="ln dash" />
            <text x="435" y="40" className="pt mut" textAnchor="middle">896 especialistas (K3)</text>
            <text x="435" y="40" className="en mut" textAnchor="middle">896 experts (K3)</text>
            <rect x="318" y="54" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="354" y="54" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="390" y="54" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="426" y="54" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="462" y="54" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="498" y="54" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="318" y="90" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="354" y="90" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="390" y="90" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="426" y="90" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="462" y="90" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="498" y="90" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="318" y="126" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="354" y="126" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="390" y="126" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="426" y="126" width="28" height="24" rx="3" className="ln brandfill" />
            <rect x="462" y="126" width="28" height="24" rx="3" className="ln fillsoft" />
            <rect x="498" y="126" width="28" height="24" rx="3" className="ln fillsoft" />
            <text x="435" y="172" className="pt mut" textAnchor="middle">… (desenho reduzido; 16 se acendem de 896)</text>
            <text x="435" y="172" className="en mut" textAnchor="middle">… (reduced drawing; 16 light up out of 896)</text>
            <text x="435" y="192" className="pt mut" textAnchor="middle">+ 2 especialistas compartilhados, sempre ativos</text>
            <text x="435" y="192" className="en mut" textAnchor="middle">+ 2 shared experts, always active</text>
            <path d="M570 112L610 112" className="ln" />
            <path d="M602.8 115.5L610 112L602.8 108.5" className="ln" />
            <rect x="610" y="90" width="80" height="44" rx="4" className="ln fillsoft" />
            <text x="650" y="109" className="pt" textAnchor="middle">soma das</text>
            <text x="650" y="109" className="en" textAnchor="middle">sum of</text>
            <text x="650" y="125" className="pt" textAnchor="middle">saídas</text>
            <text x="650" y="125" className="en" textAnchor="middle">outputs</text>
            <text x="10" y="226" className="pt mut" textAnchor="start">Só os especialistas acesos calculam.</text>
            <text x="10" y="226" className="en mut" textAnchor="start">Only the lit experts compute.</text>
            <text x="10" y="246" className="pt mut" textAnchor="start">Mas todos os 896 precisam estar na memória: o próximo token pode escolher outros.</text>
            <text x="10" y="246" className="en mut" textAnchor="start">But all 896 must sit in memory: the next token may pick different ones.</text>
          </svg>
        </Diagram>
        <h3><T pt="As contas, com os números das fichas técnicas" en="The arithmetic, with the numbers from the model cards" /></h3>
        <Table
          head={[null, "K2", "K3"]}
          rows={[
            [<T pt="Parâmetros totais" en="Total parameters" />, "1T", "2.8T"],
            [<T pt="Parâmetros ativos por token" en="Active parameters per token" />, "32B", "104B"],
            [<T pt="Fração ativa (conta minha)" en="Active fraction (my arithmetic)" />, "≈ 3,2%", "≈ 3,7%"],
            [<T pt="Especialistas (escolhidos por token / compartilhados)" en="Experts (picked per token / shared)" />, "384 (8 / 1)", "896 (16 / 2)"],
            [<T pt="Camadas" en="Layers" />, <T pt="61 (1 densa)" en="61 (1 dense)" />, <T pt="93 (1 densa)" en="93 (1 dense)" />],
            [<T pt="Contexto" en="Context" />, "128K", <T pt="1M (1.048.576)" en="1M (1,048,576)" />],
            ["Vocabulário", "160K", "160K"],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><em>Custo de cálculo</em> segue os <b>ativos</b>: o K3 gasta por token algo da ordem de um modelo denso de ~100B, não de 2,8T. É por isso que a resposta sai em velocidade aceitável e o preço da API é viável.</>} en={<><em>Compute cost</em> follows the <b>active</b> parameters: per token, K3 spends something on the order of a ~100B dense model, not a 2.8T one. That is why answers come out at acceptable speed and the API price is viable.</>} /></li>
          <li><T pt={<><em>Custo de memória</em> segue os <b>totais</b>: para hospedar, você precisa carregar tudo. Estimativa minha, só dos pesos: o K3 foi treinado já considerando pesos em 4 bits (MXFP4), ou seja ~0,5 byte por parâmetro, o que dá algo como 1,4 TB; o K2 vinha em 8 bits (block-fp8), ~1 TB. Isso sem contar cache de atenção e ativações. Nenhuma das fichas dá um requisito oficial de hardware, e em ambos os casos o resultado é um servidor com vários GPUs (e não um computador comum).</>} en={<><em>Memory cost</em> follows the <b>total</b>: to host it, you must load everything. My estimate, weights only: K3 was trained with 4-bit weights in mind (MXFP4), about 0.5 byte per parameter, which gives something like 1.4 TB; K2 shipped in 8 bits (block-fp8), ~1 TB. That is before attention cache and activations. Neither card gives an official hardware requirement, and in both cases the result is a multi-GPU server (not an ordinary computer).</>} /></li>
          <li><T pt={<><em>Por que não dá para rodar em casa.</em> Versões quantizadas feitas pela comunidade (GGUF para llama.cpp, Ollama, LM Studio) existem e reduzem o tamanho, mas continuam em centenas de GB. Para estudar o K3 sem infraestrutura, a rota realista é a API.</>} en={<><em>Why you cannot run it at home.</em> Community quantizations (GGUF for llama.cpp, Ollama, LM Studio) exist and shrink the size, but still run to hundreds of GB. To study K3 without infrastructure, the realistic route is the API.</>} /></li>
        </ul>
      </Section>
      <Section id="k3" title={<T pt="O que mudou do K2 para o K3" en="What changed from K2 to K3" />}>
        <Table
          head={[null, "K2 (Instruct)", "K3"]}
          rows={[
            [<T pt="Atenção" en="Attention" />, <T pt="MLA em todas as camadas" en="MLA in every layer" />, <T pt={<>híbrida: 69 camadas de Kimi Delta Attention (linear) + 24 de MLA com <i>gate</i></>} en="hybrid: 69 Kimi Delta Attention (linear) layers + 24 gated MLA layers" />],
            [<T pt="Entrada" en="Input" />, <T pt="texto" en="text" />, <T pt="texto e imagem (nativo, com o codificador MoonViT-V2 de 401M de parâmetros)" en="text and image (native, with the 401M-parameter MoonViT-V2 encoder)" />],
            [<T pt="Raciocínio" en="Reasoning" />, <T pt="responde direto (versão “Instruct”)" en="answers directly (the “Instruct” version)" />, <T pt={<>sempre ligado; nível pelo campo <code>reasoning_effort</code>: <code>low</code>, <code>high</code> ou <code>max</code> (padrão)</>} en={<>always on; level set by the <code>reasoning_effort</code> field: <code>low</code>, <code>high</code> or <code>max</code> (default)</>} />],
            [<T pt="Precisão" en="Precision" />, <T pt="pesos em block-fp8" en="block-fp8 weights" />, <T pt="treino consciente de quantização: pesos MXFP4 e ativações MXFP8" en="quantization-aware training: MXFP4 weights and MXFP8 activations" />],
            [<T pt="Licença" en="License" />, <T pt="MIT modificada" en="Modified MIT" />, <T pt="“Kimi K3 License” (própria)" en="“Kimi K3 License” (custom)" />],
            [<T pt="Motores de inferência indicados" en="Recommended inference engines" />, "vLLM, SGLang, KTransformers, TensorRT-LLM", "vLLM, SGLang, TokenSpeed"],
          ]}
        />
        <h3><T pt="A atenção híbrida, em uma figura" en="Hybrid attention, in one figure" /></h3>
        <p><T pt={<>A atenção “completa” compara cada token com todos os anteriores, e guarda um <i>cache KV</i> que cresce a cada token. Com 1 milhão de tokens, esse custo (de tempo e de memória) vira o gargalo. A atenção <b>linear</b> troca isso por um estado de tamanho fixo que vai sendo atualizado: custo por token constante, mas com menos “memória exata” do passado. O K3 usa as duas: a linear (KDA, a variante própria da Moonshot) na maioria das camadas e a completa-comprimida (MLA) em uma camada a cada ~4, para não perder detalhe preciso. Os números (69 e 24 camadas) vêm da ficha do modelo; a explicação do porquê é a motivação geral da arquitetura híbrida, não um trecho citado do relatório técnico.</>} en={<>“Full” attention compares each token with all previous ones, and keeps a <i>KV cache</i> that grows with every token. At 1 million tokens, that cost (in time and memory) becomes the bottleneck. <b>Linear</b> attention swaps it for a fixed-size state that is updated as you go: constant cost per token, but with less “exact memory” of the past. K3 uses both: linear (KDA, Moonshot’s own variant) in most layers and compressed full attention (MLA) in about one layer out of four, so precise detail is not lost. The numbers (69 and 24 layers) come from the model card; the reason why is the general motivation for hybrid architectures, not a quoted passage of the technical report.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="O K2 usa o mesmo tipo de atenção em todas as camadas; o K3 mistura dois tipos." en="K2 uses the same attention type in every layer; K3 mixes two types." />}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Camadas de atenção do K3 / K3 attention layers">
            <text x="10" y="22" className="mono mut" textAnchor="start">K2</text>
            <rect x="60" y="8" width="610" height="22" rx="3" className="ln fillsoft" />
            <text x="365" y="24" className="pt" textAnchor="middle">61 camadas, todas com atenção MLA (1 delas densa)</text>
            <text x="365" y="24" className="en" textAnchor="middle">61 layers, all with MLA attention (1 of them dense)</text>
            <text x="10" y="86" className="mono mut" textAnchor="start">K3</text>
            <rect x="60" y="72" width="447" height="22" rx="3" className="ln brandfill" />
            <text x="283" y="88" className="pt" textAnchor="middle">69 camadas KDA (atenção linear)</text>
            <text x="283" y="88" className="en" textAnchor="middle">69 KDA layers (linear attention)</text>
            <rect x="507" y="72" width="163" height="22" rx="3" className="ln fillsoft" />
            <text x="588" y="88" className="pt" textAnchor="middle">24 MLA com gate</text>
            <text x="588" y="88" className="en" textAnchor="middle">24 gated MLA</text>
            <text x="60" y="118" className="pt mut" textAnchor="start">(larguras proporcionais ao número de camadas: 69 de 93 contra 24 de 93)</text>
            <text x="60" y="118" className="en mut" textAnchor="start">(widths proportional to the number of layers: 69 of 93 versus 24 of 93)</text>
            <text x="10" y="156" className="pt mut" textAnchor="start">KDA: estado fixo, custo por token constante, bom para contextos enormes.</text>
            <text x="10" y="156" className="en mut" textAnchor="start">KDA: fixed state, constant cost per token, good for huge contexts.</text>
            <text x="10" y="178" className="pt mut" textAnchor="start">MLA: consulta o contexto de verdade (com cache comprimido), para recuperar detalhes exatos.</text>
            <text x="10" y="178" className="en mut" textAnchor="start">MLA: actually looks up the context (with a compressed cache), to recover exact details.</text>
          </svg>
        </Diagram>
      </Section>
      <Section id="use" title={<T pt="Como usar: app, API e pesos" en="How to use: app, API and weights" />}>
        <Table
          head={[<T pt="Caminho" en="Route" />, <T pt="Para quem" en="For whom" />, <T pt="Como" en="How" />]}
          rows={[
            [<T pt="App / site" en="App / website" />, <T pt="testar, conversar, tarefas pontuais" en="trying it out, chatting, one-off tasks" />, <T pt="kimi.com (a cobertura do lançamento diz que dá para usar de graça, entrando com Google ou telefone, sem cartão; confira os limites atuais)" en="kimi.com (launch coverage says it is free to use, signing in with Google or a phone number, no card; check current limits)" />],
            ["API", <T pt="colocar em um produto ou agente" en="putting it in a product or agent" />, <T pt={<>platform.kimi.ai, com endpoints compatíveis com OpenAI e com Anthropic; modelo <code>kimi-k3</code>. Também aparece em agregadores como o OpenRouter.</>} en={<>platform.kimi.ai, with OpenAI- and Anthropic-compatible endpoints; model <code>kimi-k3</code>. It also appears on aggregators such as OpenRouter.</>} />],
            [<T pt="Pesos abertos" en="Open weights" />, <T pt="empresa com GPUs, exigência de dados dentro de casa, ajuste fino" en="a company with GPUs, data-stays-in-house requirements, fine-tuning" />, <T pt={<>Hugging Face: <code>moonshotai/Kimi-K3</code> (e <code>moonshotai/Kimi-K2-Instruct</code>), servindo com vLLM, SGLang ou TokenSpeed</>} en={<>Hugging Face: <code>moonshotai/Kimi-K3</code> (and <code>moonshotai/Kimi-K2-Instruct</code>), served with vLLM, SGLang or TokenSpeed</>} />],
            [<T pt="Programação no terminal" en="Coding in the terminal" />, <T pt="usar como agente de código" en="using it as a coding agent" />, <T pt="Kimi Code (CLI da Moonshot, com integração a VS Code, Cursor e Zed, segundo a cobertura do lançamento). Também dá para apontar outros agentes para o endpoint compatível." en="Kimi Code (Moonshot’s CLI, with VS Code, Cursor and Zed integration, per the launch coverage). Other agents can also be pointed at the compatible endpoint." />],
          ]}
        />
        <h3><T pt="Chamando a API" en="Calling the API" /></h3>
        <p><T pt="Como o endpoint é compatível com o SDK da OpenAI, o código é o de sempre; só mudam a URL base, a chave e o nome do modelo. Pegue a URL base e a chave no painel da plataforma (não escrevi a URL aqui porque a ficha do modelo não a traz)." en="Because the endpoint is compatible with the OpenAI SDK, the code is the usual one; only the base URL, the key and the model name change. Get the base URL and key from the platform dashboard (I did not write the URL here because the model card does not give it)." /></p>
        <CodeBlock code={`from openai import OpenAI

client = OpenAI(
    base_url="<URL base da documentação em platform.kimi.ai>",
    api_key=os.environ["KIMI_API_KEY"],      # nunca no código-fonte
)

resp = client.chat.completions.create(
    model="kimi-k3",
    messages=[{"role": "user", "content": "Explique um índice B-tree em 3 frases."}],
    extra_body={"reasoning_effort": "low"},   # low | high | max (padrão: max)
)
msg = resp.choices[0].message
print(msg.content)                              # a resposta
print(getattr(msg, "reasoning_content", None))  # o raciocínio (sempre vem)`} />
        <ul className="ds-list">
          <li><T pt={<><em>O raciocínio custa tokens.</em> Como o modo de pensar está sempre ligado e o padrão é <code>max</code>, uma pergunta simples pode gastar muito mais tokens de saída do que a resposta visível. Use <code>low</code> para tarefas fáceis e meça.</>} en={<><em>Reasoning costs tokens.</em> Since thinking mode is always on and the default is <code>max</code>, a simple question can spend far more output tokens than the visible answer. Use <code>low</code> for easy tasks and measure.</>} /></li>
          <li><T pt={<><em>Ferramentas e histórico.</em> A ficha diz que, em conversas de várias voltas e chamadas de ferramenta, você deve devolver a mensagem completa do assistente, incluindo <code>reasoning_content</code> e <code>tool_calls</code>, e não só o <code>content</code>. Se o seu código só guarda o texto, o modelo perde o fio do próprio raciocínio. É o mesmo princípio do <a href="/notas/agent-harness/">harness de agente</a>: quem monta o histórico decide o que o modelo “lembra”.</>} en={<><em>Tools and history.</em> The card says that, in multi-turn conversations and tool calls, you must send back the full assistant message, including <code>reasoning_content</code> and <code>tool_calls</code>, not just <code>content</code>. If your code only keeps the text, the model loses the thread of its own reasoning. It is the same principle as the <a href="/notas/agent-harness/">agent harness</a>: whoever builds the history decides what the model “remembers”.</>} /></li>
          <li><T pt={<><em>Cache automático.</em> A Moonshot diz que o cache de contexto é automático, sem ID, TTL ou parâmetro extra. Na prática: mantenha o começo do prompt (instruções, documentos) igual entre chamadas, porque só o trecho repetido do início é cobrado com desconto.</>} en={<><em>Automatic caching.</em> Moonshot says context caching is automatic, with no ID, TTL or extra parameter. In practice: keep the start of the prompt (instructions, documents) identical between calls, because only the repeated prefix is billed at a discount.</>} /></li>
        </ul>
        <h3><T pt="Servindo os pesos (K2 como exemplo)" en="Serving the weights (K2 as an example)" /></h3>
        <p><T pt="A ficha do K2 recomenda vLLM, SGLang, KTransformers ou TensorRT-LLM e traz comandos prontos. A forma geral é esta (confira as flags no guia de deploy do modelo, que mudam com a versão do motor):" en="K2’s card recommends vLLM, SGLang, KTransformers or TensorRT-LLM and ships ready-made commands. The general shape is this (check the flags in the model’s deploy guide, which change with the engine version):" /></p>
        <CodeBlock code={`# forma geral; o número de GPUs e as flags dependem do modelo e da versão
vllm serve moonshotai/Kimi-K2-Instruct \\
  --tensor-parallel-size 16 \\
  --trust-remote-code`} />
        <p><T pt="Depois disso você tem um servidor com a mesma API compatível com OpenAI, na sua rede, e o código acima funciona trocando a URL base. Nenhum token sai da sua infraestrutura. Não executei esse comando (não tenho o hardware); ele ilustra o formato." en="After that you have a server with the same OpenAI-compatible API, on your network, and the code above works by swapping the base URL. No token leaves your infrastructure. I did not run this command (I do not have the hardware); it illustrates the format." /></p>
      </Section>
      <Section id="cost" title={<T pt="Quanto custa" en="What it costs" />}>
        <Table
          head={[<T pt="Modelo (por milhão de tokens)" en="Model (per million tokens)" />, <T pt="Entrada" en="Input" />, <T pt="Entrada em cache" en="Cached input" />, <T pt="Saída" en="Output" />]}
          rows={[
            ["K3", "US$ 3", "US$ 0,30", "US$ 15"],
            ["K2.6 · K2.7 Code", "US$ 0,95", "—", "US$ 4"],
          ]}
        />
        <p><T pt="Um exemplo para ter noção: uma tarefa de agente que manda 100 mil tokens de contexto (90 mil deles repetidos de uma chamada anterior, portanto em cache) e recebe 5 mil tokens de saída (raciocínio incluído)." en="An example to get a feel: an agent task that sends 100 thousand tokens of context (90 thousand of them repeated from an earlier call, hence cached) and gets 5 thousand output tokens (reasoning included)." /></p>
        <CodeBlock code={`entrada nova      10.000 tokens x US$  3 / 1.000.000 = US$ 0,030
entrada em cache  90.000 tokens x US$ 0,30 / 1.000.000 = US$ 0,027
saída              5.000 tokens x US$ 15 / 1.000.000 = US$ 0,075
                                                total = US$ 0,132 por chamada`} />
        <p><T pt={<>Sem o cache, a entrada custaria 100.000 x US$ 3 / 1.000.000 = US$ 0,30 e o total subiria para US$ 0,375. O cache corta a conta pela metade, e ainda assim a <b>saída</b> (US$ 0,075) é o maior item: reduzir o esforço de raciocínio costuma economizar mais do que qualquer outra coisa. Preços vêm da cobertura do lançamento e mudam; confira em platform.kimi.ai.</>} en={<>Without the cache, the input would cost 100,000 x $3 / 1,000,000 = $0.30 and the total would rise to $0.375. Caching cuts the bill by more than half, and still the <b>output</b> ($0.075) is the biggest item: lowering reasoning effort usually saves more than anything else. Prices come from the launch coverage and change; check platform.kimi.ai.</>} /></p>
      </Section>
      <Section id="bench" title={<T pt="Benchmarks: como ler os números" en="Benchmarks: how to read the numbers" />}>
        <p><T pt={<>Os números abaixo são do lançamento do K3 e do K2. A maior parte é <b>divulgada pela própria Moonshot</b>; a cobertura da imprensa diz que a verificação independente ainda estava em andamento. Use como ordem de grandeza, não como veredito.</>} en={<>The numbers below are from the K3 and K2 launches. Most are <b>published by Moonshot itself</b>; press coverage says independent verification was still under way. Use them as orders of magnitude, not as a verdict.</>} /></p>
        <Table
          head={["Benchmark", <T pt="Resultado" en="Result" />, <T pt="O que mede" en="What it measures" />]}
          rows={[
            ["BrowseComp (K3)", "91.2 / 100", <T pt="pesquisar e juntar informação difícil de achar navegando na web" en="searching and piecing together hard-to-find information by browsing the web" />],
            ["GDPval-AA v2 (K3)", <T pt="1.687, 3º lugar" en="1,687, 3rd place" />, <T pt="tarefas de trabalho de escritório/profissional, pontuação Elo; à frente do Claude Opus 4.8 (1.600), atrás do Fable 5 Max (1.815) e do GPT-5.6 Sol Max (1.747,8), segundo a cobertura" en="professional / office-work tasks, Elo-style score; ahead of Claude Opus 4.8 (1,600), behind Fable 5 Max (1,815) and GPT-5.6 Sol Max (1,747.8), per the coverage" />],
            ["Frontend Code Arena (K3)", <T pt="1.679, 1º lugar" en="1,679, 1st place" />, <T pt="geração de interfaces web, avaliada por votação humana" en="web interface generation, judged by human votes" />],
            ["SWE-bench Verified (K2)", <>65.8 (71.6 <T pt="com várias tentativas" en="with multiple attempts" />)</>, <T pt="corrigir issues reais de repositórios Python; marca de julho de 2025" en="fixing real Python repository issues; a July 2025 mark" />],
            ["MATH-500 (K2)", "97.4", <T pt="problemas de matemática de ensino médio/olimpíada leve" en="high-school / light-olympiad math problems" />],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><em>Quem mede importa.</em> Resultado da própria empresa tende a ser o melhor cenário (configuração escolhida, esforço máximo de raciocínio). Um ranking independente (Artificial Analysis) colocou o K3 em 3º no geral no lançamento, consistente com “muito bom, mas não o primeiro”.</>} en={<><em>Who measures matters.</em> A company’s own result tends to be the best case (chosen setup, maximum reasoning effort). An independent ranking (Artificial Analysis) placed K3 3rd overall at launch, consistent with “very good, but not first”.</>} /></li>
          <li><T pt={<><em>Benchmarks envelhecem.</em> O número do K2 é de 2025 e só serve para comparar com a época. Os modelos novos já passaram dele; compare modelos pelos testes mais recentes e, melhor ainda, pela <b>sua</b> tarefa, com 20 ou 30 exemplos reais.</>} en={<><em>Benchmarks age.</em> The K2 figure is from 2025 and only serves to compare with that time. Newer models have passed it; compare models on the latest tests and, better still, on <b>your</b> task, with 20 or 30 real examples.</>} /></li>
          <li><T pt={<><em>“Chip em 48 horas”, “astrofísica em 2 horas”.</em> A Moonshot divulgou demonstrações longas de agente (um projeto de chip de teste com ferramentas de código aberto; a reprodução de um resultado de astrofísica). São casos escolhidos pela empresa, descritos pela própria; mostram o tipo de trabalho de longa duração que o modelo mira, não um desempenho que você terá em qualquer tarefa.</>} en={<><em>“Chip in 48 hours”, “astrophysics in 2 hours”.</em> Moonshot published long agent demos (a test chip design with open-source tools; the reproduction of an astrophysics result). They are company-chosen cases, described by the company; they show the kind of long-running work the model aims at, not performance you will get on any task.</>} /></li>
        </ul>
      </Section>
      <Section id="license" title={<T pt="Licença e cuidados" en="License and cautions" />}>
        <ul className="ds-list">
          <li><T pt={<><em>K2: MIT modificada.</em> A MIT é a licença mais permissiva que existe; a versão “modificada” acrescenta uma exigência de atribuição para produtos muito grandes. Os limites exatos estão no arquivo <code>LICENSE</code> do repositório: leia-o em vez de confiar em resumos.</>} en={<><em>K2: modified MIT.</em> MIT is about the most permissive license there is; the “modified” version adds an attribution requirement for very large products. The exact thresholds are in the repository’s <code>LICENSE</code> file: read it instead of trusting summaries.</>} /></li>
          <li><T pt={<><em>K3: licença própria.</em> Os pesos e o código saíram sob a “Kimi K3 License”, que não é MIT nem está na lista de licenças aprovadas pela OSI. Segundo o OpenRouter, ela exige exibir “Kimi K3” na interface de produtos com mais de 100 milhões de usuários ativos por mês ou mais de US$ 20 milhões de receita mensal. Fontes divergem nos limites e há relato de uma regra separada para empresas que vendem inferência hospedada; trate os números como não confirmados até ler o texto da licença.</>} en={<><em>K3: custom license.</em> The weights and code were released under the “Kimi K3 License”, which is not MIT and not on the OSI-approved list. According to OpenRouter, it requires displaying “Kimi K3” in the interface of products with over 100 million monthly active users or over $20 million in monthly revenue. Sources differ on the thresholds and there is a report of a separate rule for companies selling hosted inference; treat the numbers as unconfirmed until you read the license text.</>} /></li>
          <li><T pt={<><em>Para quase todo mundo,</em> um projeto pequeno ou médio fica muito abaixo desses limites. A diferença prática de “aberto” aparece mais na liberdade de <b>hospedar você mesmo</b>, ajustar o modelo e manter os dados em casa.</>} en={<><em>For almost everyone,</em> a small or mid-size project stays far below those thresholds. The practical difference of “open” shows mostly in the freedom to <b>host it yourself</b>, fine-tune the model and keep data in-house.</>} /></li>
          <li><T pt={<><em>Dados na API oficial.</em> Usar a API da Moonshot significa enviar seus prompts a um serviço de uma empresa chinesa. Leia os termos de uso e de privacidade antes de mandar dados de clientes, código proprietário ou qualquer coisa sensível; se isso for um problema, hospede os pesos ou use um provedor de sua confiança. É a mesma análise que vale para qualquer API de modelo, com as exigências legais do seu setor e país.</>} en={<><em>Data on the official API.</em> Using Moonshot’s API means sending your prompts to a service run by a Chinese company. Read the terms of use and privacy policy before sending customer data, proprietary code or anything sensitive; if that is a problem, host the weights or use a provider you trust. It is the same analysis that applies to any model API, with the legal requirements of your sector and country.</>} /></li>
          <li><T pt={<><em>Segurança de agentes.</em> Um modelo forte em tarefas longas com ferramentas pode fazer estragos reais se tiver acesso demais. Aplique os cuidados de <a href="/notas/agent-harness/">harness e guardrails</a>: permissões mínimas, ambiente isolado, confirmação humana para ações irreversíveis.</>} en={<><em>Agent safety.</em> A model that is strong at long tool-using tasks can do real damage if it has too much access. Apply the <a href="/notas/agent-harness/">harness and guardrails</a> care: least privilege, an isolated environment, human confirmation for irreversible actions.</>} /></li>
        </ul>
      </Section>
      <Section id="choose" title={<T pt="Quando escolher o Kimi" en="When to choose Kimi" />}>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Opinião, não verificada nas fontes:</strong> esta seção é minha leitura dos dados acima, não uma recomendação da Moonshot nem de terceiros.</>} en={<><strong>Opinion, not verified in the sources:</strong> this section is my reading of the data above, not a recommendation from Moonshot or anyone else.</>} /></Callout>
        <Table
          head={[<T pt="Situação" en="Situation" />, <T pt="Faz sentido?" en="Makes sense?" />]}
          rows={[
            [<T pt="Agente que trabalha por horas com muitas ferramentas e contexto enorme" en="An agent that works for hours with many tools and a huge context" />, <T pt="Sim: é o alvo declarado do K3 (1M de contexto, atenção híbrida, raciocínio longo). Teste com a sua carga." en="Yes: it is K3’s stated target (1M context, hybrid attention, long reasoning). Test with your own load." />],
            [<T pt="Exigência de que os dados não saiam da empresa" en="A requirement that data not leave the company" />, <T pt="Sim, se você tem GPUs para hospedar o K3 ou o K2 (infraestrutura pesada). Senão, o ganho de “aberto” não se realiza." en="Yes, if you have GPUs to host K3 or K2 (heavy infrastructure). Otherwise the “open” gain is not realised." />],
            [<T pt="Muito volume de chamadas simples e baratas" en="Lots of simple, cheap calls" />, <T pt="Provavelmente a linha K2.6 (US$ 0,95 / 4) ou um modelo menor; o raciocínio sempre ligado do K3 pesa na conta." en="Probably the K2.6 line ($0.95 / 4) or a smaller model; K3’s always-on reasoning weighs on the bill." />],
            [<T pt="Aprender como funciona um modelo de fronteira por dentro" en="Learning how a frontier model works inside" />, <T pt="Sim: as fichas técnicas e o relatório são públicos (MoE, atenção híbrida, QAT). Comece pelo K2, mais simples, e depois leia o que mudou no K3." en="Yes: the model cards and report are public (MoE, hybrid attention, QAT). Start with K2, which is simpler, and then read what changed in K3." />],
            [<T pt="Dados sensíveis e nenhuma infraestrutura própria" en="Sensitive data and no infrastructure of your own" />, <T pt="Cuidado: a API oficial envia os dados à Moonshot. Avalie termos e alternativas antes." en="Careful: the official API sends data to Moonshot. Evaluate the terms and alternatives first." />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><strong>Limites desta nota.</strong> Arquitetura e número de parâmetros vêm das fichas do Hugging Face (K2-Instruct e K3). Datas, preços e benchmarks do K3 vêm da cobertura do lançamento (VentureBeat, OpenRouter, Fortune) e são divulgados pela empresa. Não rodei nenhum dos modelos nem chamei a API; os trechos de código mostram o formato. As estimativas de memória e a conta de custo são minhas. Verificado em 2026-10-26; tudo isso muda rápido.</>} en={<><strong>Limits of this note.</strong> Architecture and parameter counts come from the Hugging Face cards (K2-Instruct and K3). K3 dates, prices and benchmarks come from the launch coverage (VentureBeat, OpenRouter, Fortune) and are published by the company. I did not run either model nor call the API; the code snippets show the format. The memory estimates and the cost arithmetic are mine. Checked on 2026-10-26; all of this changes fast.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}
          links={[
            { label: "Hugging Face · moonshotai/Kimi-K3 (arquitetura, licença, thinking, API)", href: "https://huggingface.co/moonshotai/Kimi-K3" },
            { label: "Hugging Face · moonshotai/Kimi-K2-Instruct (arquitetura, licença MIT modificada, deploy)", href: "https://huggingface.co/moonshotai/Kimi-K2-Instruct" },
            { label: "VentureBeat · Moonshot AI releases Kimi K3 (datas, preços, benchmarks divulgados)", href: "https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems" },
            { label: "OpenRouter · Is Kimi K3 open source? (licença e limites, citados em resumo de busca)", href: "https://openrouter.ai/blog/insights/kimi-k3-open-source/" },
            { label: "HPCwire · China’s Moonshot AI releases trillion-parameter model Kimi K2", href: "https://www.hpcwire.com/2025/07/16/chinas-moonshot-ai-releases-trillion-parameter-model-kimi-k2/" },
            { label: "Fortune · Moonshot’s Kimi K3 pushes Chinese AI into Fable-level territory", href: "https://fortune.com/2026/07/16/moonshots-kimi-k3-pushes-chinese-ai-into-fable-level-territory/" },
          ]}
        />
      </Section>
    </>
  );
}
