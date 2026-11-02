import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "llm-agents-open-source",
  title: { en: "Open-source LLMs and AI agents: run, connect and deploy", pt: "LLMs e agentes de IA open-source: rodar, conectar e subir na nuvem" },
  seo: {
    title: { en: "Open-source LLMs and AI agents: run, connect and deploy", pt: "LLMs e agentes de IA open-source: rodar, conectar e subir na nuvem" },
    description: { en: "A practical guide to open-source LLMs and AI agents: how much memory a model needs, running models with Ollama, llama.cpp and vLLM, writing an agent loop with tool calling, connecting agent and model through the OpenAI-compatible API and MCP, and renting a GPU in the cloud securely. Eight activities with expected results.", pt: "Um guia prático de LLMs e agentes de IA open-source: quanta memória um modelo precisa, rodar modelos com Ollama, llama.cpp e vLLM, escrever um laço de agente com chamada de ferramentas, conectar agente e modelo pela API compatível com a da OpenAI e pelo MCP, e alugar uma GPU na nuvem com segurança. Oito atividades com resultados esperados." },
  },
  summary: "how much memory a model needs, running open-source models with Ollama, llama.cpp and vLLM, writing a tool-calling agent loop in plain Python, connecting agent and model through the OpenAI-compatible API and MCP, and renting a GPU in the cloud securely (SSH tunnel, no public ports). Also covers Chinese open-weights models (DeepSeek, Qwen, Kimi, GLM), ready-made agents (Hermes Agent, OpenHands, Aider, Goose, Cline) and RAG with Postgres and pgvector. Eleven hands-on activities with expected results.",
  kicker: { en: "Hands-on guide", pt: "Guia prático" },
  heroTitle: { en: <>Open-source LLMs and agents, <em>on your machine or in the cloud.</em></>, pt: <>LLMs e agentes open-source, <em>na sua máquina ou na nuvem.</em></> },
  heroLede: { en: "What a model, a server and an agent each are, how much hardware you need, how to run and connect them with open-source tools, and how to rent a GPU safely when your computer falls short. With exercises and expected results.", pt: "O que são o modelo, o servidor e o agente, quanto hardware você precisa, como rodar e conectar tudo com ferramentas open-source e como alugar uma GPU com segurança quando o seu computador não der conta. Com exercícios e resultados esperados." },
  published: "2026-10-21",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "map", title: <T pt="O mapa das peças" en="The map of the pieces" /> },
        { id: "hardware", title: <T pt="Cabe na minha máquina?" en="Will it fit on my machine?" /> },
        { id: "models", title: <T pt="Qual modelo? (inclui os chineses)" en="Which model? (incl. Chinese)" /> },
        { id: "run", title: <T pt="Rodar localmente" en="Run it locally" /> },
        { id: "agent", title: <T pt="Seu primeiro agente" en="Your first agent" /> },
        { id: "connect", title: <T pt="Conectar agente, modelo e ferramentas" en="Connect agent, model and tools" /> },
        { id: "catalog", title: <T pt="Agentes prontos" en="Ready-made agents" /> },
        { id: "cloud", title: <T pt="Subir na nuvem" en="Move to the cloud" /> },
        { id: "rag", title: <T pt="Prática: RAG com pgvector" en="Hands-on: RAG with pgvector" /> },
        { id: "security", title: <T pt="Segurança" en="Security" /> },
        { id: "cheat-llm", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={<T pt="O mapa: modelo, servidor, agente e ferramentas" en="The map: model, server, agent and tools" />}>
        <p><T pt="Quase toda confusão sobre “rodar IA” vem de misturar quatro coisas diferentes. Separe-as e o resto fica simples." en="Almost all the confusion about “running AI” comes from mixing four different things. Separate them and the rest gets simple." /></p>
        <Table
          head={[<T pt="Peça" en="Piece" />, <T pt="O que é, em uma frase" en="What it is, in one sentence" />, <T pt="Exemplos open-source" en="Open-source examples" />]}
          rows={[
            [<T pt={<><strong>Modelo</strong> (pesos)</>} en={<><strong>Model</strong> (weights)</>} />, <T pt="Um arquivo grande de números que guarda o que o modelo “aprendeu”. Sozinho, não faz nada." en="A large file of numbers that stores what the model “learned”. On its own it does nothing." />, "Qwen, Llama, Gemma, Mistral, gpt-oss"],
            [<T pt={<><strong>Servidor</strong> de inferência</>} en={<><strong>Inference server</strong></>} />, <T pt="Programa que carrega os pesos na memória e responde a pedidos HTTP: manda texto, recebe texto." en="A program that loads the weights into memory and answers HTTP requests: text in, text out." />, "Ollama, llama.cpp, vLLM"],
            [<T pt={<><strong>Agente</strong></>} en={<><strong>Agent</strong></>} />, <T pt={<>Um programa seu que chama o servidor <em>em laço</em>, deixando o modelo escolher ferramentas até terminar a tarefa.</>} en={<>A program of yours that calls the server <em>in a loop</em>, letting the model pick tools until the task is done.</>} />, <T pt={<>o <code>agent.py</code> desta nota, smolagents, LangGraph</>} en={<>the <code>agent.py</code> in this note, smolagents, LangGraph</>} />],
            [<T pt={<><strong>Ferramentas</strong></>} en={<><strong>Tools</strong></>} />, <T pt="Funções que o agente executa no mundo real: ler arquivo, buscar na web, consultar um banco." en="Functions the agent runs in the real world: read a file, search the web, query a database." />, <T pt="funções Python, servidores MCP" en="Python functions, MCP servers" />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="Quatro peças: você fala com o agente; o agente fala com o servidor pela API e com as ferramentas pelo MCP; o servidor carrega os pesos." en="Four pieces: you talk to the agent; the agent talks to the server over the API and to tools over MCP; the server loads the weights." />}>
          <svg viewBox="0 0 700 300" role="img" aria-label="Camadas de um agente de IA / Layers of an AI agent">
            <rect x="10" y="125" width="120" height="50" rx="4" className="ln" />
            <text x="70" y="147" className="pt" textAnchor="middle">Você</text>
            <text x="70" y="147" className="en" textAnchor="middle">You</text>
            <text x="70" y="164" className="pt mut" textAnchor="middle">terminal · chat</text>
            <text x="70" y="164" className="en mut" textAnchor="middle">terminal · chat</text>
            <rect x="180" y="105" width="140" height="90" rx="4" className="brandfill" />
            <text x="250" y="135" className="pt" textAnchor="middle">Agente</text>
            <text x="250" y="135" className="en" textAnchor="middle">Agent</text>
            <text x="250" y="153" className="pt mut" textAnchor="middle">laço + ferramentas</text>
            <text x="250" y="153" className="en mut" textAnchor="middle">loop + tools</text>
            <text x="250" y="171" className="mono" textAnchor="middle">agent.py · smolagents</text>
            <rect x="370" y="105" width="150" height="90" rx="4" className="ln" />
            <text x="445" y="135" className="pt" textAnchor="middle">Servidor de LLM</text>
            <text x="445" y="135" className="en" textAnchor="middle">LLM server</text>
            <text x="445" y="153" className="pt mut" textAnchor="middle">API HTTP</text>
            <text x="445" y="153" className="en mut" textAnchor="middle">HTTP API</text>
            <text x="445" y="171" className="mono" textAnchor="middle">Ollama · llama.cpp · vLLM</text>
            <rect x="570" y="105" width="120" height="90" rx="4" className="ln fillsoft" />
            <text x="630" y="135" className="pt" textAnchor="middle">Pesos</text>
            <text x="630" y="135" className="en" textAnchor="middle">Weights</text>
            <text x="630" y="153" className="pt mut" textAnchor="middle">arquivo GGUF</text>
            <text x="630" y="153" className="en mut" textAnchor="middle">GGUF file</text>
            <text x="630" y="171" className="mono" textAnchor="middle">GPU / CPU</text>
            <rect x="180" y="235" width="140" height="50" rx="4" className="ln" />
            <text x="250" y="257" className="pt" textAnchor="middle">Ferramentas</text>
            <text x="250" y="257" className="en" textAnchor="middle">Tools</text>
            <text x="250" y="274" className="pt mut" textAnchor="middle">arquivos · web · bancos</text>
            <text x="250" y="274" className="en mut" textAnchor="middle">files · web · databases</text>
            <path d="M130 150L180 150" className="ln" />
            <path d="M173.7 153.0L180 150L173.7 147.0" className="ln" />
            <path d="M320 150L370 150" className="ln" />
            <path d="M363.7 153.0L370 150L363.7 147.0" className="ln" />
            <path d="M520 150L570 150" className="ln" />
            <path d="M563.7 153.0L570 150L563.7 147.0" className="ln" />
            <path d="M250 195L250 235" className="ln" />
            <path d="M247.0 228.7L250 235L253.0 228.7" className="ln" />
            <text x="345" y="216" className="mut mono" textAnchor="middle">/v1/chat/completions</text>
            <text x="258" y="222" className="mono" textAnchor="start">MCP</text>
            <text x="370" y="55" className="pt mut" textAnchor="start">Camada 1: o modelo é só um arquivo de números.</text>
            <text x="370" y="55" className="en mut" textAnchor="start">Layer 1: the model is just a file of numbers.</text>
            <text x="370" y="75" className="pt mut" textAnchor="start">Camada 2: o servidor o carrega e abre uma API.</text>
            <text x="370" y="75" className="en mut" textAnchor="start">Layer 2: the server loads it and opens an API.</text>
            <text x="370" y="95" className="pt mut" textAnchor="start">Camada 3: o agente chama a API em laço.</text>
            <text x="370" y="95" className="en mut" textAnchor="start">Layer 3: the agent calls the API in a loop.</text>
          </svg>
        </Diagram>
        <p><T pt={<>A Anthropic, no guia <em>Building effective agents</em>, define a diferença com precisão: em um <em>workflow</em>, o código decide a ordem dos passos; em um <strong>agente</strong>, é o próprio modelo que decide os próximos passos e quais ferramentas usar, usando o retorno do ambiente em um laço. O mesmo guia dá um conselho valioso: comece com a solução mais simples possível; muitas vezes, uma única chamada ao modelo já basta.</>} en={<>Anthropic, in the guide <em>Building effective agents</em>, defines the difference precisely: in a <em>workflow</em>, code decides the order of the steps; in an <strong>agent</strong>, the model itself decides the next steps and which tools to use, using feedback from the environment in a loop. The same guide gives valuable advice: start with the simplest solution possible; often a single call to the model is enough.</>} /></p>
        <Callout icon="check"><T pt={<>Por que open-source? Três razões práticas: <strong>privacidade</strong> (os dados não saem da sua máquina), <strong>custo previsível</strong> (sem cobrança por token) e <strong>controle</strong> (você escolhe a versão e ela não muda sozinha). O preço é que você cuida do hardware e os melhores modelos fechados costumam ser mais capazes.</>} en={<>Why open-source? Three practical reasons: <strong>privacy</strong> (data never leaves your machine), <strong>predictable cost</strong> (no per-token billing) and <strong>control</strong> (you pick the version and it does not change on its own). The price is that you look after the hardware, and the best closed models are usually more capable.</>} /></Callout>
      </Section>
      <Section id="hardware" title={<T pt="Cabe na minha máquina? A conta da memória" en="Will it fit on my machine? The memory maths" />}>
        <p><T pt={<>Um modelo é medido em <strong>parâmetros</strong> (os números dentro do arquivo). “8B” significa 8 bilhões. Cada parâmetro ocupa alguns bits, e quantos bits depende da <strong>quantização</strong>: reduzir a precisão dos números (de 16 bits para 8 ou 4) para o modelo ocupar menos memória, com uma perda pequena de qualidade. Pesquisa de Dettmers e Zettlemoyer (2022) mostra que, para uma mesma memória, modelos maiores quantizados em 4 bits tendem a superar modelos menores em precisão maior, e por isso 4 bits virou o padrão no uso local.</>} en={<>A model is measured in <strong>parameters</strong> (the numbers inside the file). “8B” means 8 billion. Each parameter takes a few bits, and how many depends on <strong>quantization</strong>: lowering the precision of the numbers (from 16 bits to 8 or 4) so the model takes less memory, with a small loss of quality. Research by Dettmers and Zettlemoyer (2022) shows that, for the same memory, larger models quantized to 4 bits tend to beat smaller models at higher precision, which is why 4 bits became the default for local use.</>} /></p>
        <p><T pt={<>A regra de bolso: <strong>memória dos pesos ≈ parâmetros × bits ÷ 8</strong>. Some ainda 1 a 3 GB de folga para o <em>contexto</em> (o “cache KV”, que cresce com o tamanho da conversa) e para o sistema.</>} en={<>The rule of thumb: <strong>weights memory ≈ parameters × bits ÷ 8</strong>. Add 1 to 3 GB of headroom for the <em>context</em> (the “KV cache”, which grows with conversation length) and for the system.</>} /></p>
        <CodeBlock code={`def gb(params_billion, bits):
    return params_billion * bits / 8

for size in (3, 8, 14, 32):
    print(f"{size:>3}B  fp16={gb(size,16):5.1f} GB   int8={gb(size,8):5.1f} GB   int4={gb(size,4):5.1f} GB")`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o programa imprime 3B → 6,0 / 3,0 / 1,5 GB; 8B → 16 / 8 / 4 GB; 14B → 28 / 14 / 7 GB; 32B → 64 / 32 / 16 GB. Na prática, arquivos “4 bits” ficam perto de 5 bits por parâmetro: a página do Qwen3 no Ollama lista 5,2 GB para o 8b, 9,3 GB para o 14b e 20 GB para o 32b.</>} en={<><strong>Expected result:</strong> the program prints 3B → 6.0 / 3.0 / 1.5 GB; 8B → 16 / 8 / 4 GB; 14B → 28 / 14 / 7 GB; 32B → 64 / 32 / 16 GB. In practice “4-bit” files land near 5 bits per parameter: the Qwen3 page on Ollama lists 5.2 GB for 8b, 9.3 GB for 14b and 20 GB for 32b.</>} /></p>
        <Table
          head={[<T pt="Seu hardware" en="Your hardware" />, <T pt="Memória que conta" en="Memory that counts" />, <T pt="Modelo realista (4 bits)" en="Realistic model (4-bit)" />]}
          rows={[
            [<T pt="Sem GPU, 8 GB de RAM" en="No GPU, 8 GB RAM" />, <T pt="RAM (lento)" en="RAM (slow)" />, <T pt="1B a 4B" en="1B to 4B" />],
            [<T pt="Sem GPU, 16 GB de RAM" en="No GPU, 16 GB RAM" />, <T pt="RAM (lento, mas funciona)" en="RAM (slow, but works)" />, <T pt="até 8B" en="up to 8B" />],
            [<T pt="GPU NVIDIA com 8 GB de VRAM" en="NVIDIA GPU with 8 GB VRAM" />, "VRAM", <T pt="até 8B" en="up to 8B" />],
            [<T pt="GPU com 24 GB de VRAM" en="GPU with 24 GB VRAM" />, "VRAM", <T pt="14B a 32B" en="14B to 32B" />],
            [<T pt="Mac com chip Apple Silicon (memória unificada)" en="Mac with Apple Silicon (unified memory)" />, <T pt="a RAM toda, menos uns 25%" en="most of the RAM, minus about 25%" />, <T pt="conforme a RAM: 16 GB → 8B; 32 GB → 14B a 32B" en="by RAM: 16 GB → 8B; 32 GB → 14B to 32B" />],
          ]}
        />
        <p><T pt="Se o modelo não cabe na VRAM, o servidor despeja parte das camadas na RAM e a velocidade despenca. É o sinal de que está na hora de reduzir o modelo ou ir para a nuvem (seção 8)." en="If the model does not fit in VRAM, the server spills some layers into RAM and speed collapses. That is the sign to pick a smaller model or move to the cloud (section 8)." /></p>
        <h3><T pt="Atividade 1: meça o seu hardware" en="Activity 1: measure your hardware" /></h3>
        <CodeBlock code={`# Linux
free -h                 # RAM total and available
nvidia-smi              # NVIDIA GPU, VRAM (skip if you have no NVIDIA GPU)
lscpu | grep "Model name"

# macOS
sysctl -n hw.memsize | awk '{print $1/1024/1024/1024 " GB"}'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> você consegue completar a frase “tenho X GB de VRAM (ou de RAM)”. Com X, escolha na tabela o maior modelo que cabe e anote o nome. Esse é o seu alvo para as próximas atividades; se X for pequeno, use um modelo de 1B a 4B, como <code>llama3.2:3b</code>.</>} en={<><strong>Expected result:</strong> you can complete the sentence “I have X GB of VRAM (or RAM)”. With X, pick the largest model in the table that fits and write down its name. That is your target for the next activities; if X is small, use a 1B to 4B model such as <code>llama3.2:3b</code>.</>} /></p>
      </Section>
      <Section id="models" title={<T pt="Qual modelo? As famílias open-weights, incluindo as chinesas" en="Which model? The open-weights families, including the Chinese ones" />}>
        <p><T pt="Hoje, boa parte dos melhores modelos de pesos abertos vem de laboratórios chineses. Todos seguem o mesmo caminho das seções anteriores: baixar os pesos, servir por Ollama, llama.cpp ou vLLM e chamar pela API compatível com a da OpenAI. Só o nome do modelo muda." en="Today, a good share of the best open-weights models come from Chinese labs. They all follow the same path as the earlier sections: download the weights, serve them with Ollama, llama.cpp or vLLM and call them through the OpenAI-compatible API. Only the model name changes." /></p>
        <Table
          head={[<T pt="Família" en="Family" />, <T pt="Quem fez" en="Who made it" />, <T pt="O que a distingue" en="What sets it apart" />, <T pt="Para rodar localmente" en="To run locally" />]}
          rows={[
            [<><strong>DeepSeek</strong> (V3, R1)</>, <T pt="DeepSeek, laboratório de Hangzhou" en="DeepSeek, a lab in Hangzhou" />, <T pt="O R1 popularizou o raciocínio treinado por aprendizado por reforço (o modelo “pensa” antes de responder). O V3 e o R1 completos são MoE de 671B parâmetros. Pesos sob licença MIT." en="R1 popularised reasoning trained with reinforcement learning (the model “thinks” before answering). The full V3 and R1 are 671B-parameter MoE models. Weights under the MIT license." />, <T pt={<>O modelo completo (671b) tem 404 GB no Ollama. Para a sua máquina, use as versões <em>destiladas</em> (1.5b a 70b): modelos menores, de outras famílias, treinados para imitar o raciocínio do R1. Ex.: <code>deepseek-r1:8b</code> (5,2 GB).</>} en={<>The full model (671b) is 404 GB on Ollama. For your machine use the <em>distilled</em> versions (1.5b to 70b): smaller models from other families, trained to imitate R1’s reasoning. E.g. <code>deepseek-r1:8b</code> (5.2 GB).</>} />],
            [<strong>Qwen</strong>, <T pt="Alibaba Cloud" en="Alibaba Cloud" />, <T pt="A família mais variada: de 0,6B a centenas de bilhões, versões densas e MoE, bom suporte a ferramentas e a português. Em geral Apache 2.0." en="The widest family: from 0.6B to hundreds of billions, dense and MoE versions, good tool support and multilingual quality. Usually Apache 2.0." />, <T pt={<>É o que este guia usa: <code>qwen3:8b</code>, <code>qwen3:14b</code>, <code>qwen3:32b</code>.</>} en={<>It is what this guide uses: <code>qwen3:8b</code>, <code>qwen3:14b</code>, <code>qwen3:32b</code>.</>} />],
            [<strong>GLM</strong>, <T pt="Zhipu AI (Z.ai), da Universidade Tsinghua" en="Zhipu AI (Z.ai), a Tsinghua University spin-off" />, <T pt="Foco em agentes e programação, com chamada de ferramentas nativa." en="Focus on agents and coding, with native tool calling." />, <T pt="Há variantes “Flash” menores; confira o tamanho na página do Ollama." en="There are smaller “Flash” variants; check the size on the Ollama page." />],
            [<strong>Kimi K2</strong>, "Moonshot AI", <T pt="MoE com cerca de 1 trilhão de parâmetros totais e 32B ativos, treinado para uso de ferramentas e tarefas longas. Licença MIT modificada." en="MoE with about 1 trillion total parameters and 32B active, trained for tool use and long tasks. Modified MIT license." />, <T pt="Grande demais para um PC: use por GPUs alugadas ou por um provedor." en="Too big for a PC: use it on rented GPUs or through a provider." />],
            [<strong>MiniMax</strong>, "MiniMax", <T pt="MoE voltado a agentes e código." en="MoE aimed at agents and code." />, <T pt="Também grande; veja a licença antes de qualquer uso comercial." en="Also large; read the license before any commercial use." />],
          ]}
        />
        <p><T pt={<><strong>MoE (<em>mixture of experts</em>)</strong> explica os números enormes. O modelo é dividido em “especialistas” e, a cada token, só alguns são usados: o Kimi K2 tem ~1T de parâmetros no total, mas só 32B ativos por token. O que isso muda na conta da memória: <strong>a velocidade acompanha os parâmetros ativos, mas a memória acompanha os totais</strong>, porque todos os especialistas precisam estar carregados. Por isso um MoE é rápido para o tamanho, e ainda assim exige muita VRAM.</>} en={<><strong>MoE (<em>mixture of experts</em>)</strong> explains the huge numbers. The model is split into “experts” and, for each token, only a few are used: Kimi K2 has ~1T parameters in total but only 32B active per token. What it changes in the memory maths: <strong>speed follows the active parameters, but memory follows the total</strong>, because every expert has to be loaded. That is why a MoE is fast for its size and still demands a lot of VRAM.</>} /></p>
        <Callout icon="alert"><T pt={<><strong>Três cuidados.</strong> (1) <em>Pesos abertos</em> não é o mesmo que <em>open-source</em> no sentido estrito: em geral o código e os dados de treino não são publicados, e a licença varia por modelo e por versão. Leia a licença no cartão do modelo no Hugging Face antes de usar comercialmente. (2) Rodar os pesos na sua máquina não envia dados a ninguém; já usar a <em>API hospedada</em> do laboratório (por exemplo, a do DeepSeek) envia o seu texto aos servidores dele, sob a legislação do país dele. (3) Modelos treinados na China costumam recusar ou enviesar respostas sobre alguns temas políticos; teste com o seu caso de uso.</>} en={<><strong>Three cautions.</strong> (1) <em>Open weights</em> is not the same as <em>open source</em> in the strict sense: usually the code and training data are not published, and the license varies by model and version. Read the license on the model card on Hugging Face before commercial use. (2) Running the weights on your machine sends data to nobody; using the lab’s <em>hosted API</em> (for example DeepSeek’s) sends your text to their servers, under their country’s laws. (3) Models trained in China often refuse or skew answers on some political topics; test with your own use case.</>} /></Callout>
        <h3><T pt="Atividade 9: compare um modelo de raciocínio com o Qwen3" en="Activity 9: compare a reasoning model with Qwen3" /></h3>
        <CodeBlock code={`ollama pull deepseek-r1:8b
ollama run deepseek-r1:8b --verbose
>>> A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much is the ball?
>>> /bye

# the same question to the model from Activity 2, for comparison
ollama run qwen3:8b --verbose`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o DeepSeek-R1 mostra primeiro um bloco de raciocínio (entre <code>&lt;think&gt;</code> e <code>&lt;/think&gt;</code> ou numa seção “Thinking…”) e só depois a resposta: 5 centavos (e não os 10 da intuição apressada). Compare o <code>eval rate</code> e o tamanho da resposta: modelos de raciocínio gastam muitos tokens “pensando”, o que custa tempo. Para usar um modelo no <code>agent.py</code>, confirme na página dele no Ollama que ele tem a etiqueta <code>tools</code>; sem ela, o servidor recusa a chamada de ferramentas. Nesse caso, mantenha o Qwen3 como “motor” do agente.</>} en={<><strong>Expected result:</strong> DeepSeek-R1 first shows a reasoning block (between <code>&lt;think&gt;</code> and <code>&lt;/think&gt;</code> or in a “Thinking…” section) and only then the answer: 5 cents (not the 10 of hasty intuition). Compare the <code>eval rate</code> and the answer length: reasoning models spend many tokens “thinking”, which costs time. To use a model in <code>agent.py</code>, check on its Ollama page that it has the <code>tools</code> tag; without it the server rejects tool calling. In that case keep Qwen3 as the agent’s “engine”.</>} /></p>
      </Section>
      <Section id="run" title={<T pt="Rodar na sua máquina: Ollama, llama.cpp e vLLM" en="Run it on your machine: Ollama, llama.cpp and vLLM" />}>
        <p><T pt="Os três são open-source e expõem uma API compatível com a da OpenAI. A diferença é o público." en="All three are open-source and expose an OpenAI-compatible API. The difference is the audience." /></p>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Quando usar" en="When to use" />, <T pt="Porta padrão" en="Default port" />]}
          rows={[
            [<strong>Ollama</strong>, <T pt="O caminho mais curto: baixa o modelo, gerencia a memória e já traz uma API. Ideal para começar e para uso pessoal." en="The shortest path: it downloads the model, manages memory and ships with an API. Ideal to start and for personal use." />, "11434"],
            [<><strong>llama.cpp</strong> (<code>llama-server</code>)</>, <T pt="Mais controle: roda arquivos GGUF direto, em CPU, GPU ou Apple Silicon, com muitas opções de quantização." en="More control: runs GGUF files directly on CPU, GPU or Apple Silicon, with many quantization options." />, <T pt={<>você define (use <code>--port 8080</code>)</>} en={<>you set it (use <code>--port 8080</code>)</>} />],
            [<strong>vLLM</strong>, <T pt="Servidor de produção em GPU: atende muitos usuários ao mesmo tempo. Usa o PagedAttention (Kwon et al., 2023) para aproveitar melhor a memória. É a escolha para a nuvem." en="Production server on GPU: serves many users at once. It uses PagedAttention (Kwon et al., 2023) to make better use of memory. It is the pick for the cloud." />, "8000"],
          ]}
        />
        <h3><T pt="Atividade 2: Ollama, do zero a uma conversa" en="Activity 2: Ollama, from zero to a conversation" /></h3>
        <p><T pt={<>No Linux, o instalador oficial é um script (leia-o antes de executar, como com qualquer <code>curl | sh</code>). No macOS e no Windows, baixe o instalador em ollama.com.</>} en={<>On Linux, the official installer is a script (read it before running, as with any <code>curl | sh</code>). On macOS and Windows, download the installer from ollama.com.</>} /></p>
        <CodeBlock code={`curl -fsSL https://ollama.com/install.sh | sh

ollama pull qwen3:8b          # download (about 5.2 GB); pick the size from Activity 1
ollama run qwen3:8b --verbose # chat in the terminal; --verbose prints speed at the end
>>> Explain what a GPU does in two sentences.
>>> /bye

ollama ps                     # which models are loaded, and on GPU or CPU`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o modelo responde em português ou inglês (o Qwen3 pode mostrar um trecho de “raciocínio” antes da resposta). Com <code>--verbose</code> aparece a linha <code>eval rate</code>, em tokens por segundo. Em GPU, espere dezenas de tokens por segundo; só em CPU, de 2 a 10. O <code>ollama ps</code> mostra a coluna <code>PROCESSOR</code>: <code>100% GPU</code> é o ideal; <code>100% CPU</code> ou divisões como <code>40%/60% CPU/GPU</code> indicam que faltou VRAM.</>} en={<><strong>Expected result:</strong> the model replies (Qwen3 may show a “thinking” section before the answer). With <code>--verbose</code> you get an <code>eval rate</code> line, in tokens per second. On a GPU expect tens of tokens per second; on CPU only, 2 to 10. <code>ollama ps</code> shows a <code>PROCESSOR</code> column: <code>100% GPU</code> is ideal; <code>100% CPU</code> or splits such as <code>40%/60% CPU/GPU</code> mean VRAM ran short.</>} /></p>
        <h3><T pt="Atividade 3: a API HTTP por trás do chat" en="Activity 3: the HTTP API behind the chat" /></h3>
        <p><T pt={<>O terminal é só um cliente. O servidor do Ollama escuta em <code>127.0.0.1:11434</code> e, segundo a documentação, oferece o endpoint compatível <code>/v1/chat/completions</code>, com suporte a streaming e a ferramentas.</>} en={<>The terminal is just a client. The Ollama server listens on <code>127.0.0.1:11434</code> and, per its documentation, offers the compatible <code>/v1/chat/completions</code> endpoint, with streaming and tool support.</>} /></p>
        <CodeBlock code={`curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen3:8b",
    "messages": [{"role": "user", "content": "Say hello in five words."}]
  }' `} />
        <p><T pt={<><strong>Resultado esperado:</strong> um JSON com <code>choices[0].message.content</code> contendo a resposta, mais <code>usage</code> com a contagem de tokens. Esse é todo o “segredo”: conversar com um modelo é um <code>POST</code>. Tudo o que vem depois (agentes, interfaces, frameworks) apenas chama esse endereço.</>} en={<><strong>Expected result:</strong> a JSON with <code>choices[0].message.content</code> holding the reply, plus <code>usage</code> with the token counts. That is the whole “secret”: talking to a model is a <code>POST</code>. Everything that follows (agents, interfaces, frameworks) just calls this address.</>} /></p>
        <h3><T pt="Atividade 4: o mesmo, com llama.cpp" en="Activity 4: the same, with llama.cpp" /></h3>
        <p><T pt={<>Instale o <code>llama.cpp</code> (pacotes, binários e Docker estão no README do projeto) e suba o servidor com um modelo do Hugging Face. A opção <code>-hf</code> baixa o arquivo GGUF; <code>--jinja</code> liga o template de chat necessário para chamada de ferramentas; <code>--api-key</code> exige uma chave.</>} en={<>Install <code>llama.cpp</code> (packages, binaries and Docker are in the project README) and start the server with a Hugging Face model. The <code>-hf</code> option downloads the GGUF file; <code>--jinja</code> turns on the chat template needed for tool calling; <code>--api-key</code> requires a key.</>} /></p>
        <CodeBlock code={`llama-server -hf ggml-org/gemma-3-4b-it-GGUF --port 8080 --jinja --api-key my-secret-key

# in another terminal
curl http://127.0.0.1:8080/v1/chat/completions \\
  -H "Authorization: Bearer my-secret-key" -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "Say hello in five words."}]}' `} />
        <p><T pt={<><strong>Resultado esperado:</strong> a primeira execução baixa o modelo e depois o log diz que o servidor está escutando em 127.0.0.1:8080. A resposta do <code>curl</code> tem o mesmo formato da Atividade 3. Sem o cabeçalho <code>Authorization</code>, o servidor responde <code>401</code>: a chave funciona.</>} en={<><strong>Expected result:</strong> the first run downloads the model, then the log says the server is listening on 127.0.0.1:8080. The <code>curl</code> reply has the same shape as in Activity 3. Without the <code>Authorization</code> header the server answers <code>401</code>: the key works.</>} /></p>
        <Callout icon="check"><T pt="O vLLM, o terceiro da lista, precisa de GPU NVIDIA e é o que usaremos na nuvem. Os comandos estão na seção 8." en="vLLM, the third on the list, needs an NVIDIA GPU and is what we will use in the cloud. The commands are in section 8." /></Callout>
      </Section>
      <Section id="agent" title={<T pt="Seu primeiro agente: um laço de 70 linhas" en="Your first agent: a 70-line loop" />}>
        <p><T pt={<>Um agente parece mágico até você ver o código. O truque se chama <strong>chamada de ferramentas</strong> (<em>tool calling</em>): junto com a pergunta, você descreve funções que o modelo pode pedir. Se ele quiser usar uma, em vez de texto ele devolve um <code>tool_calls</code> com o nome da função e os argumentos. <strong>Quem executa é o seu código</strong>, não o modelo; o resultado volta como uma mensagem <code>role: "tool"</code>, e o modelo continua. A ideia combina raciocínio e ação em passos alternados, como no artigo <em>ReAct</em> (Yao et al., 2022).</>} en={<>An agent feels like magic until you see the code. The trick is called <strong>tool calling</strong>: along with the question, you describe functions the model may ask for. If it wants one, instead of text it returns a <code>tool_calls</code> with the function name and arguments. <strong>Your code runs it</strong>, not the model; the result goes back as a <code>role: "tool"</code> message, and the model continues. The idea mixes reasoning and acting in alternating steps, as in the <em>ReAct</em> paper (Yao et al., 2022).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O laço do agente: o modelo pede uma ferramenta, o seu código a executa, o resultado volta ao modelo; repete até o modelo responder sem pedir nada." en="The agent loop: the model asks for a tool, your code runs it, the result goes back to the model; repeat until the model answers without asking for anything." />}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Laço do agente / Agent loop">
            <rect x="10" y="100" width="130" height="50" rx="4" className="ln" />
            <text x="75" y="122" className="pt" textAnchor="middle">Pergunta</text>
            <text x="75" y="122" className="en" textAnchor="middle">Question</text>
            <text x="75" y="139" className="pt mut" textAnchor="middle">do usuário</text>
            <text x="75" y="139" className="en mut" textAnchor="middle">from the user</text>
            <rect x="190" y="90" width="150" height="70" rx="4" className="brandfill" />
            <text x="265" y="120" className="pt" textAnchor="middle">Modelo (LLM)</text>
            <text x="265" y="120" className="en" textAnchor="middle">Model (LLM)</text>
            <text x="265" y="138" className="pt mut" textAnchor="middle">decide o próximo passo</text>
            <text x="265" y="138" className="en mut" textAnchor="middle">decides the next step</text>
            <rect x="400" y="20" width="150" height="56" rx="4" className="ln" />
            <text x="475" y="44" className="pt" textAnchor="middle">Executa a ferramenta</text>
            <text x="475" y="44" className="en" textAnchor="middle">Runs the tool</text>
            <text x="475" y="62" className="mono" textAnchor="middle">calc · read_file</text>
            <rect x="400" y="175" width="150" height="56" rx="4" className="ln" />
            <text x="475" y="199" className="pt" textAnchor="middle">Resposta final</text>
            <text x="475" y="199" className="en" textAnchor="middle">Final answer</text>
            <text x="475" y="217" className="pt mut" textAnchor="middle">sem tool_calls</text>
            <text x="475" y="217" className="en mut" textAnchor="middle">no tool_calls</text>
            <path d="M140 125L190 125" className="ln" />
            <path d="M183.7 128.0L190 125L183.7 122.0" className="ln" />
            <path d="M340 105L400 58" className="ln" />
            <path d="M396.9 64.3L400 58L393.2 59.5" className="ln" />
            <path d="M340 145L400 195" className="ln" />
            <path d="M393.2 193.3L400 195L397.1 188.6" className="ln" />
            <text x="372" y="70" className="pt mut" textAnchor="end">pede ferramenta</text>
            <text x="372" y="70" className="en mut" textAnchor="end">asks for a tool</text>
            <text x="372" y="196" className="pt mut" textAnchor="end">termina</text>
            <text x="372" y="196" className="en mut" textAnchor="end">finishes</text>
            <path d="M550 48L650 48" className="ln" />
            <path d="M650 48L650 125" className="ln" />
            <path d="M650 125L345 125" className="ln dash" />
            <path d="M351.3 122.0L345 125L351.3 128.0" className="ln" />
            <text x="500" y="146" className="pt mut" textAnchor="middle">resultado volta como mensagem</text>
            <text x="500" y="146" className="en mut" textAnchor="middle">result goes back as a message</text>
            <text x="500" y="118" className="mono" textAnchor="middle">role: tool</text>
          </svg>
        </Diagram>
        <h3><T pt="Atividade 5: escreva e rode o agente" en="Activity 5: write and run the agent" /></h3>
        <p><T pt={<>Só usa a biblioteca padrão do Python (3.9 ou mais novo). Duas ferramentas: <code>calc</code> (faz contas sem usar <code>eval</code>) e <code>read_file</code> (lê arquivos, mas só dentro da pasta <code>workspace</code>). Salve como <code>agent.py</code>.</>} en={<>It uses only the Python standard library (3.9 or newer). Two tools: <code>calc</code> (does maths without using <code>eval</code>) and <code>read_file</code> (reads files, but only inside the <code>workspace</code> folder). Save it as <code>agent.py</code>.</>} /></p>
        <p><code>agent.py</code></p>
        <CodeBlock code={`import ast, json, operator, os, sys, urllib.request

BASE_URL = os.environ.get("LLM_BASE_URL", "http://localhost:11434/v1")
MODEL = os.environ.get("LLM_MODEL", "qwen3:8b")
API_KEY = os.environ.get("LLM_API_KEY", "not-needed")
WORKDIR = os.path.abspath("workspace")
MAX_STEPS = 6

# ---- tools: plain Python functions -------------------------------------
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
       ast.Div: operator.truediv, ast.Pow: operator.pow, ast.USub: operator.neg}

def calc(expression):
    def ev(n):
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
            return n.value
        if isinstance(n, ast.BinOp) and type(n.op) in OPS:
            return OPS[type(n.op)](ev(n.left), ev(n.right))
        if isinstance(n, ast.UnaryOp) and type(n.op) in OPS:
            return OPS[type(n.op)](ev(n.operand))
        raise ValueError("only numbers and + - * / ** are allowed")
    return str(ev(ast.parse(expression, mode="eval").body))

def read_file(path):
    full = os.path.abspath(os.path.join(WORKDIR, path))
    if not full.startswith(WORKDIR + os.sep):          # never leave the workspace
        raise ValueError("path outside workspace")
    with open(full, encoding="utf-8") as f:
        return f.read()[:4000]                          # cap what goes back to the model

TOOLS = {"calc": calc, "read_file": read_file}
SCHEMAS = [
    {"type": "function", "function": {
        "name": "calc", "description": "Evaluate an arithmetic expression, e.g. 12*(3+4)",
        "parameters": {"type": "object", "required": ["expression"],
                       "properties": {"expression": {"type": "string"}}}}},
    {"type": "function", "function": {
        "name": "read_file", "description": "Read a text file from the workspace folder",
        "parameters": {"type": "object", "required": ["path"],
                       "properties": {"path": {"type": "string"}}}}},
]

# ---- the model call: one HTTP POST ---------------------------------------
def chat(messages):
    body = json.dumps({"model": MODEL, "messages": messages, "tools": SCHEMAS}).encode()
    req = urllib.request.Request(f"{BASE_URL}/chat/completions", data=body, headers={
        "Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        return json.load(resp)["choices"][0]["message"]

# ---- the agent loop --------------------------------------------------------
def run(task):
    messages = [{"role": "system", "content": "You are a careful assistant. Use tools when needed."},
                {"role": "user", "content": task}]
    for step in range(1, MAX_STEPS + 1):
        msg = chat(messages)
        messages.append(msg)
        calls = msg.get("tool_calls") or []
        if not calls:                                   # no tool requested: this is the answer
            return msg["content"]
        for call in calls:
            name = call["function"]["name"]
            args = json.loads(call["function"]["arguments"])
            print(f"[step {step}] {name}({args})", file=sys.stderr)
            try:
                result = TOOLS[name](**args)
            except Exception as e:                      # give the error back so the model can recover
                result = f"error: {e}"
            messages.append({"role": "tool", "tool_call_id": call["id"], "content": result})
    return "stopped: step limit reached"

if __name__ == "__main__":
    print(run(" ".join(sys.argv[1:]) or "What is 17% of 2350?"))`} />
        <CodeBlock code={`mkdir workspace && echo "The deploy key rotates every 90 days." > workspace/notes.txt

python3 agent.py "What is 17% of 2350?"
python3 agent.py "Read notes.txt and tell me how often the deploy key rotates."
python3 agent.py "Read ../../etc/passwd"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> na primeira, o terminal mostra em <code>stderr</code> uma linha como <code>[step 1] calc(&#123;'expression': '2350*0.17'&#125;)</code> e a resposta final cita <strong>399,5</strong> (o modelo pode escrever “399.5”). Na segunda, aparece <code>read_file</code> e a resposta é “a cada 90 dias”. Na terceira, o seu código bloqueia: a ferramenta devolve <code>error: path outside workspace</code>, o modelo lê o erro e explica que não pôde ler. O laço funcionou como mostrado na figura, e a trava de segurança está no <em>seu</em> código, não na boa vontade do modelo. Modelos muito pequenos às vezes erram o formato da chamada: se acontecer, troque por um que liste “tools” (como o <code>qwen3</code>).</>} en={<><strong>Expected result:</strong> on the first, the terminal shows on <code>stderr</code> a line like <code>[step 1] calc(&#123;'expression': '2350*0.17'&#125;)</code> and the final answer cites <strong>399.5</strong>. On the second, <code>read_file</code> appears and the answer is “every 90 days”. On the third, your code blocks it: the tool returns <code>error: path outside workspace</code>, the model reads the error and explains it could not read the file. The loop worked as in the figure, and the safety guard lives in <em>your</em> code, not in the model’s goodwill. Very small models sometimes get the call format wrong: if that happens, switch to one that lists “tools” (such as <code>qwen3</code>).</>} /></p>
        <Callout icon="check"><T pt={<>Por que o <code>try/except</code> devolve o erro ao modelo em vez de parar? Porque um agente útil se recupera: ele lê “file not found”, tenta outro nome e segue. O <code>MAX_STEPS</code> impede um laço infinito (e uma conta inesperada, se o modelo for pago).</>} en={<>Why does the <code>try/except</code> hand the error back to the model instead of stopping? Because a useful agent recovers: it reads “file not found”, tries another name and moves on. <code>MAX_STEPS</code> prevents an infinite loop (and a surprise bill, if the model is paid).</>} /></Callout>
      </Section>
      <Section id="connect" title={<T pt="Conectando agente, modelo e ferramentas" en="Connecting agent, model and tools" />}>
        <p><T pt={<>Há <strong>duas conexões</strong> diferentes, e cada uma tem o seu padrão aberto.</>} en={<>There are <strong>two different connections</strong>, and each has its own open standard.</>} /></p>
        <Table
          head={[<T pt="Conexão" en="Connection" />, <T pt="Padrão" en="Standard" />, <T pt="Na prática" en="In practice" />]}
          rows={[
            [<T pt="Agente ↔ modelo" en="Agent ↔ model" />, <T pt="API compatível com a da OpenAI" en="OpenAI-compatible API" />, <T pt={<>Você só troca a <code>base_url</code> (e a chave). Ollama, llama.cpp e vLLM falam o mesmo dialeto.</>} en={<>You only change the <code>base_url</code> (and the key). Ollama, llama.cpp and vLLM speak the same dialect.</>} />],
            [<T pt="Agente ↔ ferramentas" en="Agent ↔ tools" />, "MCP (Model Context Protocol)", <T pt="Um servidor MCP expõe ferramentas, dados e prompts; qualquer agente que fale MCP os usa sem código novo." en="An MCP server exposes tools, data and prompts; any agent that speaks MCP uses them with no new code." />],
          ]}
        />
        <p><T pt="A documentação do MCP o descreve como um padrão aberto para conectar aplicações de IA a sistemas externos, e usa a analogia de uma porta USB-C: um conector único em vez de uma integração sob medida para cada par agente-ferramenta. É por isso que o agente da seção anterior, com funções Python escritas à mão, é só o começo: em projetos maiores você troca essas funções por servidores MCP prontos (arquivos, bancos, repositórios, navegador)." en="The MCP documentation describes it as an open standard for connecting AI applications to external systems, and uses the USB-C analogy: one connector instead of a custom integration for every agent-tool pair. That is why the agent in the previous section, with hand-written Python functions, is only the start: in larger projects you swap those functions for ready-made MCP servers (files, databases, repositories, browser)." /></p>
        <h3><T pt="Atividade 6: troque o modelo sem mexer no agente" en="Activity 6: swap the model without touching the agent" /></h3>
        <p><T pt={<>O <code>agent.py</code> lê a <code>base_url</code>, o modelo e a chave de variáveis de ambiente. Rode a mesma tarefa contra cada servidor:</>} en={<>The <code>agent.py</code> reads the <code>base_url</code>, the model and the key from environment variables. Run the same task against each server:</>} /></p>
        <CodeBlock code={`# 1) Ollama (defaults)
python3 agent.py "What is 17% of 2350?"

# 2) llama.cpp, from Activity 4
LLM_BASE_URL=http://127.0.0.1:8080/v1 LLM_API_KEY=my-secret-key LLM_MODEL=gemma-3-4b-it \\
  python3 agent.py "What is 17% of 2350?"

# 3) any other OpenAI-compatible server (cloud, in Section 6)
LLM_BASE_URL=http://localhost:8000/v1 LLM_API_KEY=$VLLM_TOKEN LLM_MODEL=Qwen/Qwen2.5-7B-Instruct \\
  python3 agent.py "What is 17% of 2350?"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> as respostas têm o mesmo formato e chegam ao mesmo número, mesmo com modelos e servidores diferentes. O texto exato muda (modelos são probabilísticos), o contrato não. Esse desacoplamento é o que permite desenvolver no notebook e rodar na nuvem sem reescrever nada.</>} en={<><strong>Expected result:</strong> the answers have the same shape and reach the same number, even with different models and servers. The exact wording changes (models are probabilistic), the contract does not. This decoupling is what lets you develop on a laptop and run in the cloud without rewriting anything.</>} /></p>
        <h3><T pt="E se eu não quiser escrever o laço?" en="What if I do not want to write the loop?" /></h3>
        <ul>
          <li><T pt={<><strong>smolagents</strong> (Hugging Face): biblioteca open-source minúscula, com agentes que escrevem código como ação (<code>CodeAgent</code>) ou chamam ferramentas em JSON (<code>ToolCallingAgent</code>). Funciona com modelos locais, via Ollama, e aceita ferramentas de servidores MCP.</>} en={<><strong>smolagents</strong> (Hugging Face): a tiny open-source library, with agents that write code as their action (<code>CodeAgent</code>) or call tools in JSON (<code>ToolCallingAgent</code>). It works with local models through Ollama and accepts tools from MCP servers.</>} /></li>
          <li><T pt={<><strong>LangGraph</strong>: modela o agente como um grafo de estados, útil quando o fluxo tem ramificações, repetições e pontos de aprovação humana.</>} en={<><strong>LangGraph</strong>: models the agent as a state graph, useful when the flow has branches, repeats and human-approval points.</>} /></li>
          <li><T pt={<><strong>Open WebUI</strong>: uma interface de chat web, open-source, que se conecta a Ollama ou a qualquer API compatível com a da OpenAI.</>} en={<><strong>Open WebUI</strong>: an open-source web chat interface that connects to Ollama or to any OpenAI-compatible API.</>} /></li>
        </ul>
        <p><T pt="Aprenda primeiro o laço de 70 linhas: com ele entendido, qualquer framework deixa de ser caixa-preta, e você sabe depurar quando algo der errado." en="Learn the 70-line loop first: once you understand it, any framework stops being a black box, and you know how to debug when something goes wrong." /></p>
      </Section>
      <Section id="catalog" title={<T pt="Agentes open-source prontos: quem são e como são feitos" en="Ready-made open-source agents: who they are and how they are built" />}>
        <p><T pt={<>Todos os agentes abaixo são variações do mesmo desenho que você escreveu na seção 5: <strong>um laço</strong> que chama o modelo, <strong>ferramentas</strong> que ele pode pedir, um <strong>prompt de sistema</strong> que define o comportamento e, conforme o projeto, <strong>memória</strong> entre sessões, uma <strong>sandbox</strong> para executar código com segurança e <strong>canais</strong> (terminal, IDE, Telegram). A diferença está em qual desses pedaços cada um caprichou.</>} en={<>Every agent below is a variation on the same design you wrote in section 5: <strong>a loop</strong> that calls the model, <strong>tools</strong> it can ask for, a <strong>system prompt</strong> that sets its behaviour and, depending on the project, <strong>memory</strong> across sessions, a <strong>sandbox</strong> to run code safely and <strong>channels</strong> (terminal, IDE, Telegram). What differs is which of those pieces each one polished.</>} /></p>
        <Table
          head={[<T pt="Agente" en="Agent" />, <T pt="Quem fez" en="Who made it" />, <T pt="O que é" en="What it is" />, <T pt="Licença" en="License" />]}
          rows={[
            [<strong>Hermes Agent</strong>, "Nous Research", <T pt={<>Agente de uso geral que “cresce com você”: guarda memória entre sessões, cria e refina <em>skills</em> a partir da experiência, agenda tarefas em linguagem natural e delega a subagentes. Traz dezenas de ferramentas (busca na web, navegador, visão), conversa por Telegram, Discord, Slack e outros, e executa em 5 tipos de sandbox (local, Docker, SSH, Singularity, Modal). Usa o seu provedor de modelo.</>} en={<>General-purpose agent that “grows with you”: keeps memory across sessions, creates and refines <em>skills</em> from experience, schedules tasks in natural language and delegates to subagents. It ships dozens of tools (web search, browser, vision), talks through Telegram, Discord, Slack and more, and runs in 5 kinds of sandbox (local, Docker, SSH, Singularity, Modal). It uses your own model provider.</>} />, "MIT"],
            [<strong>OpenHands</strong>, <T pt="All Hands AI e comunidade (antes OpenDevin)" en="All Hands AI and community (formerly OpenDevin)" />, <T pt="Engenheiro de software autônomo: recebe uma tarefa, edita arquivos, roda comandos e navega na web dentro de uma sandbox em contêiner. Também roda sem interface, em CI." en="Autonomous software engineer: takes a task, edits files, runs commands and browses the web inside a container sandbox. It also runs headless, in CI." />, "MIT"],
            [<strong>OpenClaw</strong>, <T pt="Projeto da comunidade" en="Community project" />, <T pt={<>Assistente pessoal que roda no seu computador e responde em WhatsApp, Telegram, Slack, Discord e dezenas de outros canais. Extensível por <em>skills</em> da comunidade, que merecem desconfiança (veja a seção de segurança).</>} en={<>Personal assistant that runs on your computer and answers in WhatsApp, Telegram, Slack, Discord and dozens of other channels. Extensible through community <em>skills</em>, which deserve suspicion (see the security section).</>} />, "MIT"],
            [<strong>Goose</strong>, <T pt="Block (hoje na Agentic AI Foundation, da Linux Foundation)" en="Block (now at the Linux Foundation’s Agentic AI Foundation)" />, <T pt="Agente local para automatizar tarefas de código e de uso geral; suas extensões são servidores MCP." en="Local agent to automate coding and general tasks; its extensions are MCP servers." />, "Apache 2.0"],
            [<strong>Cline</strong>, "Cline", <T pt="Agente de programação dentro do VS Code (e no terminal): lê o projeto, propõe edições e comandos e pede a sua aprovação a cada passo." en="Coding agent inside VS Code (and the terminal): reads the project, proposes edits and commands and asks your approval at each step." />, "Apache 2.0"],
            [<strong>Aider</strong>, "Paul Gauthier", <T pt="“Par de programação” no terminal, integrado ao git: cada edição vira um commit que você pode desfazer." en="Terminal “pair programmer” built on git: every edit becomes a commit you can undo." />, "Apache 2.0"],
            [<strong>smolagents</strong>, "Hugging Face", <T pt={<>Biblioteca mínima para <em>construir</em> o seu agente; o <code>CodeAgent</code> escreve código Python como ação.</>} en={<>Minimal library to <em>build</em> your own agent; the <code>CodeAgent</code> writes Python code as its action.</>} />, "Apache 2.0"],
            [<strong>LangGraph</strong>, "LangChain", <T pt="Biblioteca para modelar agentes como grafos de estados, com pontos de aprovação humana e retomada." en="Library to model agents as state graphs, with human-approval points and resuming." />, "MIT"],
          ]}
        />
        <Callout icon="alert"><T pt={<><strong>Não confunda “Hermes” modelo com “Hermes” agente.</strong> A Nous Research também faz a série de <em>modelos</em> Hermes (o Hermes 3, por exemplo, é um ajuste fino do Llama 3.1 com um formato próprio de chamada de ferramentas). O <em>Hermes Agent</em> é o programa que usa um modelo; pode funcionar com qualquer um. Modelo é o cérebro; agente é o corpo.</>} en={<><strong>Do not confuse the “Hermes” model with the “Hermes” agent.</strong> Nous Research also makes the Hermes <em>model</em> series (Hermes 3, for example, is a fine-tune of Llama 3.1 with its own tool-calling format). <em>Hermes Agent</em> is the program that uses a model; it can work with any. The model is the brain; the agent is the body.</>} /></Callout>
        <p><T pt={<><strong>Como escolher:</strong> para programar, Aider (terminal) ou Cline (VS Code); para entregar tarefas inteiras de engenharia a um agente isolado, OpenHands; para um assistente que fica ligado e lembra de você, Hermes Agent ou OpenClaw; para construir o seu, smolagents ou LangGraph. Estrelas no GitHub e funções mudam rápido: antes de escolher, confira o repositório e a data do último commit.</>} en={<><strong>How to choose:</strong> for coding, Aider (terminal) or Cline (VS Code); to hand whole engineering tasks to an isolated agent, OpenHands; for an always-on assistant that remembers you, Hermes Agent or OpenClaw; to build your own, smolagents or LangGraph. GitHub stars and features change fast: check the repository and the date of the last commit before choosing.</>} /></p>
        <h3><T pt="Atividade 10: ligue um agente pronto ao seu Ollama" en="Activity 10: plug a ready-made agent into your Ollama" /></h3>
        <p><T pt="O Aider é o mais simples de testar. Dentro de um repositório git qualquer (um de teste, de preferência):" en="Aider is the simplest to try. Inside any git repository (a throwaway one, preferably):" /></p>
        <CodeBlock code={`python3 -m pip install aider-install && aider-install

export OLLAMA_API_BASE=http://127.0.0.1:11434
aider --model ollama_chat/qwen3:8b
> add a function is_prime(n) to a new file primes.py

git log --oneline -3     # in another terminal`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o Aider cria o <code>primes.py</code> e registra um commit com a mudança; <code>git log</code> mostra o commit, e <code>/undo</code> no Aider o desfaz. Foi o mesmo laço da Atividade 5, só que com ferramentas de edição de arquivo e git. Com um modelo pequeno, espere erros: agentes de código rendem muito mais com modelos de 14B ou mais. O Hermes Agent e o OpenClaw seguem a mesma ideia (apontar para um servidor compatível); o procedimento exato está na documentação de cada um.</>} en={<><strong>Expected result:</strong> Aider creates <code>primes.py</code> and records a commit with the change; <code>git log</code> shows it, and <code>/undo</code> in Aider reverts it. It was the same loop as Activity 5, only with file-editing and git tools. With a small model expect mistakes: coding agents do far better with models of 14B or more. Hermes Agent and OpenClaw follow the same idea (point to a compatible server); the exact steps are in each one’s documentation.</>} /></p>
      </Section>
      <Section id="cloud" title={<T pt="Quando o seu computador não basta: subir na nuvem" en="When your computer is not enough: move to the cloud" />}>
        <p><T pt={<>Sinais de que chegou a hora: o modelo que você precisa não cabe na memória (o <code>ollama ps</code> mostra divisão CPU/GPU), a velocidade é pequena demais para trabalhar (poucos tokens por segundo), ou várias pessoas precisam usar o mesmo modelo. Existem três caminhos:</>} en={<>Signs it is time: the model you need does not fit in memory (<code>ollama ps</code> shows a CPU/GPU split), the speed is too low to work with (few tokens per second), or several people need the same model. There are three paths:</>} /></p>
        <Table
          head={[<T pt="Caminho" en="Path" />, <T pt="Como funciona" en="How it works" />, <T pt="Quando escolher" en="When to choose it" />]}
          rows={[
            [<T pt={<><strong>Alugar uma VM com GPU</strong></>} en={<><strong>Rent a GPU VM</strong></>} />, <T pt="Você liga uma máquina com GPU (AWS EC2, ou provedores especializados), instala Ollama ou vLLM e paga por hora enquanto ela estiver ligada." en="You start a GPU machine (AWS EC2, or specialised providers), install Ollama or vLLM and pay by the hour while it is on." />, <T pt={<>Mais controle, mesmo software do local. <strong>É o caminho desta nota.</strong></>} en={<>Most control, same software as local. <strong>This is the path in this note.</strong></>} />],
            [<T pt="Endpoint gerenciado" en="Managed endpoint" />, <T pt="O provedor hospeda o modelo aberto e cobra por uso ou por hora (por exemplo, Amazon Bedrock ou Hugging Face Inference Endpoints)." en="The provider hosts the open model and bills per use or per hour (for example Amazon Bedrock or Hugging Face Inference Endpoints)." />, <T pt="Você não quer administrar servidor." en="You do not want to run a server." />],
            [<T pt="Híbrido" en="Hybrid" />, <T pt="O agente roda no notebook e só o modelo vai para a nuvem (a Atividade 7)." en="The agent runs on the laptop and only the model goes to the cloud (Activity 7)." />, <T pt="Quer manter ferramentas e arquivos locais." en="You want tools and files to stay local." />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="O agente continua no seu notebook e acha que o modelo é local; o túnel SSH leva a porta 11434 até a GPU alugada, que nunca é exposta à internet." en="The agent stays on your laptop and thinks the model is local; the SSH tunnel carries port 11434 to the rented GPU, which is never exposed to the internet." />}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Túnel SSH para GPU / SSH tunnel to a GPU">
            <rect x="10" y="70" width="200" height="110" rx="4" className="ln" />
            <text x="110" y="98" className="pt" textAnchor="middle">Seu notebook</text>
            <text x="110" y="98" className="en" textAnchor="middle">Your laptop</text>
            <text x="110" y="120" className="mono" textAnchor="middle">agent.py</text>
            <text x="110" y="140" className="mono" textAnchor="middle">localhost:11434</text>
            <text x="110" y="162" className="pt mut" textAnchor="middle">sem GPU</text>
            <text x="110" y="162" className="en mut" textAnchor="middle">no GPU</text>
            <rect x="300" y="85" width="120" height="80" rx="4" className="ln fillsoft" />
            <text x="360" y="112" className="pt" textAnchor="middle">Túnel SSH</text>
            <text x="360" y="112" className="en" textAnchor="middle">SSH tunnel</text>
            <text x="360" y="132" className="pt mut" textAnchor="middle">criptografado</text>
            <text x="360" y="132" className="en mut" textAnchor="middle">encrypted</text>
            <text x="360" y="150" className="pt mut" textAnchor="middle">porta 22</text>
            <text x="360" y="150" className="en mut" textAnchor="middle">port 22</text>
            <rect x="480" y="40" width="210" height="170" rx="4" className="brandfill" />
            <text x="585" y="68" className="pt" textAnchor="middle">VM com GPU</text>
            <text x="585" y="68" className="en" textAnchor="middle">GPU VM</text>
            <text x="585" y="90" className="pt mut" textAnchor="middle">ex.: g5.xlarge (A10G, 24 GB)</text>
            <text x="585" y="90" className="en mut" textAnchor="middle">e.g. g5.xlarge (A10G, 24 GB)</text>
            <text x="585" y="120" className="mono" textAnchor="middle">Ollama / vLLM</text>
            <text x="585" y="140" className="mono" textAnchor="middle">127.0.0.1:11434</text>
            <text x="585" y="168" className="pt mut" textAnchor="middle">só aceita conexão local</text>
            <text x="585" y="168" className="en mut" textAnchor="middle">accepts local connections only</text>
            <text x="585" y="188" className="pt mut" textAnchor="middle">firewall: só o SSH, só o seu IP</text>
            <text x="585" y="188" className="en mut" textAnchor="middle">firewall: SSH only, your IP only</text>
            <path d="M210 125L300 125" className="ln" />
            <path d="M293.7 128.0L300 125L293.7 122.0" className="ln" />
            <path d="M420 125L480 125" className="ln" />
            <path d="M473.7 128.0L480 125L473.7 122.0" className="ln" />
          </svg>
        </Diagram>
        <p><T pt={<>Como referência de tamanho, a instância <strong>g5.xlarge</strong> da AWS traz uma GPU NVIDIA A10G com 24 GB de memória, 4 vCPUs e 16 GiB de RAM (página oficial da família G5): dá para um modelo de até 14B a 32B em 4 bits, conforme a tabela da seção 2. Os preços mudam por região e por tempo; consulte a página de preços da AWS antes de ligar, e leia a nota de <a href="/notas/aws/">AWS</a> deste site para criar a conta, os alertas de orçamento e o acesso seguro.</>} en={<>As a size reference, the AWS <strong>g5.xlarge</strong> instance has an NVIDIA A10G GPU with 24 GB of memory, 4 vCPUs and 16 GiB of RAM (official G5 family page): enough for a model of 14B to 32B in 4 bits, per the table in section 2. Prices vary by region and time; check the AWS pricing page before you start, and read the <a href="/notas/aws/">AWS</a> note on this site to set up the account, budget alerts and secure access.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Antes de ligar qualquer GPU:</strong> crie um alerta de orçamento (AWS Budgets) e anote como desligar a máquina. Uma GPU esquecida ligada é a forma mais comum de levar um susto na fatura.</>} en={<><strong>Before starting any GPU:</strong> create a budget alert (AWS Budgets) and note how to stop the machine. A GPU left running is the most common way to get a surprise bill.</>} /></Callout>
        <h3><T pt="Atividade 7: Ollama numa GPU alugada, acessado por túnel SSH" en="Activity 7: Ollama on a rented GPU, reached through an SSH tunnel" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><strong>Ligue a máquina.</strong> No console da AWS, inicie uma instância g5.xlarge com uma imagem que já traga os drivers NVIDIA (por exemplo, uma Deep Learning AMI de Ubuntu) e disco de 100 GB. No grupo de segurança, libere <em>apenas</em> a porta 22 (SSH) e <em>apenas</em> para o seu IP.</>} en={<><strong>Start the machine.</strong> In the AWS console, launch a g5.xlarge instance with an image that already includes NVIDIA drivers (for example an Ubuntu Deep Learning AMI) and a 100 GB disk. In the security group, open <em>only</em> port 22 (SSH) and <em>only</em> to your IP.</>} /></li>
          <li><T pt={<><strong>Entre e confirme a GPU:</strong> <code>ssh -i key.pem ubuntu@IP_DA_MAQUINA</code> e depois <code>nvidia-smi</code>. Deve listar a A10G com cerca de 24 GB.</>} en={<><strong>Log in and confirm the GPU:</strong> <code>ssh -i key.pem ubuntu@MACHINE_IP</code> and then <code>nvidia-smi</code>. It should list the A10G with about 24 GB.</>} /></li>
          <li><T pt={<><strong>Instale o Docker e o NVIDIA Container Toolkit</strong> (a documentação do Ollama indica este kit para usar GPU em contêiner) e suba o Ollama <em>preso ao localhost da VM</em>:</>} en={<><strong>Install Docker and the NVIDIA Container Toolkit</strong> (the Ollama documentation points to this toolkit for GPU in containers) and start Ollama <em>bound to the VM’s localhost</em>:</>} /></li>
        </ol>
        <CodeBlock code={`# on the GPU VM
docker run -d --gpus=all -v ollama:/root/.ollama -p 127.0.0.1:11434:11434 --name ollama ollama/ollama
docker exec ollama ollama pull qwen3:32b
docker exec ollama ollama ps`} />
        <ol className="ds-steps">
          <li><T pt={<><strong>Abra o túnel no seu notebook</strong> e rode o mesmo agente:</>} en={<><strong>Open the tunnel on your laptop</strong> and run the same agent:</>} /></li>
        </ol>
        <CodeBlock code={`# on your laptop, terminal 1 (leave it open)
ssh -i key.pem -N -L 11434:127.0.0.1:11434 ubuntu@MACHINE_IP

# terminal 2: the agent does not change, it still talks to localhost:11434
LLM_MODEL=qwen3:32b python3 agent.py "What is 17% of 2350?"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>nvidia-smi</code> da VM mostra o processo do Ollama usando a VRAM durante a resposta, o <code>ollama ps</code> mostra <code>100% GPU</code> e a resposta do agente chega mais rápida do que no notebook, com um modelo maior. Do ponto de vista do <code>agent.py</code>, nada mudou: a porta local 11434 agora é o túnel até a GPU.</>} en={<><strong>Expected result:</strong> the VM’s <code>nvidia-smi</code> shows the Ollama process using VRAM during the answer, <code>ollama ps</code> shows <code>100% GPU</code>, and the agent’s answer arrives faster than on the laptop, with a larger model. From <code>agent.py</code>’s point of view nothing changed: local port 11434 is now the tunnel to the GPU.</>} /></p>
        <h3><T pt="Alternativa para vários usuários: vLLM" en="Alternative for several users: vLLM" /></h3>
        <p><T pt={<>Para atender uma equipe, o vLLM é mais eficiente. Na VM, instale-o (<code>pip install vllm</code>, de preferência num ambiente virtual) e suba o servidor. Segundo a documentação, ligar a chamada de ferramentas exige <code>--enable-auto-tool-choice</code> e um <code>--tool-call-parser</code> que combine com o modelo (para o Qwen2.5, o <code>hermes</code>):</>} en={<>To serve a team, vLLM is more efficient. On the VM, install it (<code>pip install vllm</code>, preferably in a virtual environment) and start the server. Per the documentation, enabling tool calling requires <code>--enable-auto-tool-choice</code> and a <code>--tool-call-parser</code> that matches the model (for Qwen2.5, <code>hermes</code>):</>} /></p>
        <CodeBlock code={`# on the GPU VM
export VLLM_TOKEN=$(openssl rand -hex 24)      # a long random key; save it
vllm serve Qwen/Qwen2.5-7B-Instruct \\
  --enable-auto-tool-choice --tool-call-parser hermes \\
  --host 127.0.0.1 --port 8000 --api-key "$VLLM_TOKEN"

# on your laptop
ssh -i key.pem -N -L 8000:127.0.0.1:8000 ubuntu@MACHINE_IP
LLM_BASE_URL=http://localhost:8000/v1 LLM_API_KEY=<the-token> LLM_MODEL=Qwen/Qwen2.5-7B-Instruct \\
  python3 agent.py "What is 17% of 2350?"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o log do vLLM termina com o servidor escutando em 127.0.0.1:8000. Uma chamada sem a chave devolve <code>401</code>, e com a chave o agente responde como antes. Duas camadas de proteção: o servidor só escuta no localhost da VM e ainda exige a chave.</>} en={<><strong>Expected result:</strong> the vLLM log ends with the server listening on 127.0.0.1:8000. A call without the key returns <code>401</code>, and with the key the agent answers as before. Two layers of protection: the server only listens on the VM’s localhost and still requires the key.</>} /></p>
        <h3><T pt="Atividade 8: desligue e confirme" en="Activity 8: shut down and confirm" /></h3>
        <p><T pt={<>Terminou? Encerre o túnel (<kbd>Ctrl+C</kbd>), e no console da AWS <strong>encerre (terminate)</strong> a instância, ou <em>pare</em> (stop) se quiser voltar depois. Parar interrompe a cobrança da computação, mas o disco continua cobrado; encerrar apaga tudo.</>} en={<>Done? Close the tunnel (<kbd>Ctrl+C</kbd>), and in the AWS console <strong>terminate</strong> the instance, or <em>stop</em> it if you want to return later. Stopping ends compute billing, but the disk is still billed; terminating deletes everything.</>} /></p>
        <p><T pt={<><strong>Resultado esperado:</strong> no console, a instância aparece como <code>terminated</code> (ou <code>stopped</code>), a lista de volumes está vazia quando encerrada, e o painel de custos deixa de somar horas de GPU. Seu agente continua funcionando no notebook com um modelo local menor.</>} en={<><strong>Expected result:</strong> in the console the instance shows as <code>terminated</code> (or <code>stopped</code>), the volume list is empty when terminated, and the cost dashboard stops adding GPU hours. Your agent keeps working on the laptop with a smaller local model.</>} /></p>
      </Section>
      <Section id="rag" title={<T pt="Prática: dar memória de documentos ao agente com RAG" en="Hands-on: give the agent document memory with RAG" />}>
        <p><T pt={<><strong>RAG</strong> (<em>Retrieval-Augmented Generation</em>) é buscar, antes de responder, os trechos relevantes dos <em>seus</em> documentos e colocá-los no contexto do modelo. Serve para três coisas: responder sobre dados privados ou recentes que o modelo nunca viu, <strong>reduzir invenções</strong> (a resposta pode citar a fonte) e evitar re-treinar o modelo a cada mudança nos documentos. A explicação completa, com medições, está na nota <a href="/notas/ai-engineering/">AI Engineering</a>; aqui vai só o que precisa para ligá-lo ao agente.</>} en={<><strong>RAG</strong> (<em>Retrieval-Augmented Generation</em>) means fetching, before answering, the relevant passages from <em>your</em> documents and putting them into the model’s context. It serves three purposes: answering about private or recent data the model never saw, <strong>cutting down invention</strong> (the answer can cite its source) and avoiding retraining the model whenever the documents change. The full explanation, with measurements, is in the <a href="/notas/ai-engineering/">AI Engineering</a> note; here is only what you need to wire it to the agent.</>} /></p>
        <p><T pt={<>Como funciona: um <strong>modelo de embeddings</strong> transforma cada trecho de texto em um vetor (uma lista de números) em que textos de sentido parecido ficam <em>perto</em>. Você guarda os vetores num <strong>banco vetorial</strong>. Na pergunta, transforma-a em vetor também e pede ao banco os vizinhos mais próximos. Para o agente, a busca vira só <strong>mais uma ferramenta</strong>, ao lado de <code>calc</code> e <code>read_file</code>.</>} en={<>How it works: an <strong>embedding model</strong> turns each piece of text into a vector (a list of numbers) where texts with similar meaning end up <em>close</em>. You store the vectors in a <strong>vector database</strong>. At question time you turn the question into a vector too and ask the database for the nearest neighbours. For the agent, search becomes just <strong>one more tool</strong>, next to <code>calc</code> and <code>read_file</code>.</>} /></p>
        <Table
          head={[<T pt="Onde guardar os vetores" en="Where to store the vectors" />, <T pt="Quando escolher" en="When to choose it" />]}
          rows={[
            [<strong>PostgreSQL + pgvector</strong>, <T pt="Padrão recomendado para começar: você já tem (ou terá) um Postgres, os vetores ficam ao lado dos dados de negócio, e você usa SQL, transações, backup e permissões que já conhece. Atende bem de milhares a alguns milhões de trechos." en="Recommended default to start: you already have (or will have) a Postgres, vectors sit next to your business data, and you use the SQL, transactions, backups and permissions you already know. Handles thousands to a few million chunks well." />],
            [<strong>Qdrant, Milvus, Weaviate</strong>, <T pt="Bancos feitos só para vetores (open-source). Valem a pena com volumes muito grandes, filtros complexos ou necessidade de escalar a busca separadamente do resto." en="Databases built only for vectors (open-source). Worth it with very large volumes, complex filters or a need to scale search separately from everything else." />],
            [<strong>Chroma, SQLite-vec</strong>, <T pt="Protótipos e projetos pequenos, sem servidor para administrar." en="Prototypes and small projects, with no server to run." />],
          ]}
        />
        <h3><T pt="Atividade 11: RAG com Postgres + pgvector, usado pelo agente" en="Activity 11: RAG with Postgres + pgvector, used by the agent" /></h3>
        <p><T pt="Passo 1: suba um Postgres com a extensão (a imagem oficial do projeto já a traz) e baixe um modelo de embeddings pequeno." en="Step 1: start a Postgres with the extension (the project’s official image already includes it) and pull a small embedding model." /></p>
        <CodeBlock code={`docker run -d --name pg-rag -e POSTGRES_PASSWORD=dev -p 127.0.0.1:5432:5432 pgvector/pgvector:pg17
ollama pull nomic-embed-text      # embedding model, 768 dimensions
pip install "psycopg[binary]"`} />
        <p><T pt={<>Passo 2: salve como <code>rag.py</code>. Ele cria a tabela e o índice, indexa os arquivos da pasta <code>workspace</code> (um trecho por parágrafo) e expõe a função de busca.</>} en={<>Step 2: save as <code>rag.py</code>. It creates the table and the index, indexes the files in the <code>workspace</code> folder (one chunk per paragraph) and exposes the search function.</>} /></p>
        <p><code>rag.py</code></p>
        <CodeBlock code={`import glob, json, os, sys, urllib.request
import psycopg

BASE_URL = os.environ.get("LLM_BASE_URL", "http://localhost:11434/v1")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
DSN = os.environ.get("PG_DSN", "postgresql://postgres:dev@127.0.0.1:5432/postgres")

def embed(text):
    body = json.dumps({"model": EMBED_MODEL, "input": text}).encode()
    req = urllib.request.Request(f"{BASE_URL}/embeddings", data=body,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        vec = json.load(resp)["data"][0]["embedding"]
    return "[" + ",".join(map(str, vec)) + "]"          # pgvector text format

def setup(conn):
    conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    conn.execute("""CREATE TABLE IF NOT EXISTS chunks (
        id bigserial PRIMARY KEY, source text, content text, embedding vector(768))""")
    conn.execute("CREATE INDEX IF NOT EXISTS chunks_hnsw ON chunks "
                 "USING hnsw (embedding vector_cosine_ops)")

def ingest():
    with psycopg.connect(DSN, autocommit=True) as conn:
        setup(conn)
        conn.execute("TRUNCATE chunks")                  # simple: re-index everything
        for path in glob.glob("workspace/*.txt") + glob.glob("workspace/*.md"):
            for para in open(path, encoding="utf-8").read().split("\\n\\n"):
                if para.strip():
                    conn.execute("INSERT INTO chunks (source, content, embedding) "
                                 "VALUES (%s, %s, %s::vector)",
                                 (os.path.basename(path), para.strip(), embed(para)))

def search_docs(query, k=3):
    with psycopg.connect(DSN) as conn:
        rows = conn.execute("SELECT source, content, embedding <=> %s::vector AS dist "
                            "FROM chunks ORDER BY dist LIMIT %s", (embed(query), k)).fetchall()
    return "\\n\\n".join(f"[{src}] {txt}" for src, txt, _ in rows) or "no results"

if __name__ == "__main__":
    ingest(); print("indexed")`} />
        <p><T pt={<>Passo 3: registre a busca como ferramenta no <code>agent.py</code>, com três acréscimos (o resto do arquivo não muda):</>} en={<>Step 3: register the search as a tool in <code>agent.py</code>, with three additions (the rest of the file stays the same):</>} /></p>
        <CodeBlock code={`from rag import search_docs                                   # 1) import

TOOLS = {"calc": calc, "read_file": read_file, "search_docs": search_docs}   # 2) register

SCHEMAS.append({"type": "function", "function": {                          # 3) describe
    "name": "search_docs",
    "description": "Search the user's indexed documents. Use it for questions about their notes.",
    "parameters": {"type": "object", "required": ["query"],
                   "properties": {"query": {"type": "string"}}}}})`} />
        <CodeBlock code={`cat > workspace/policy.md << 'EOF'
The deploy key rotates every 90 days.

Production database backups run at 03:00 UTC and are kept for 14 days.

On-call engineers are paged only for severity 1 incidents.
EOF

python3 rag.py
python3 agent.py "How long are production backups kept?"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> <code>rag.py</code> imprime <code>indexed</code>; o agente mostra em <code>stderr</code> uma linha como <code>[step 1] search_docs(&#123;'query': 'production backups retention'&#125;)</code> e responde que os backups ficam 14 dias. Para ver o banco trabalhando: <code>docker exec -it pg-rag psql -U postgres -c "SELECT source, left(content,40) FROM chunks"</code>. Se o agente responder sem chamar a ferramenta, o modelo é pequeno demais para decidir sozinho; teste um modelo maior ou diga na pergunta “search the documents”.</>} en={<><strong>Expected result:</strong> <code>rag.py</code> prints <code>indexed</code>; the agent shows on <code>stderr</code> a line such as <code>[step 1] search_docs(&#123;'query': 'production backups retention'&#125;)</code> and answers that backups are kept for 14 days. To see the database at work: <code>docker exec -it pg-rag psql -U postgres -c "SELECT source, left(content,40) FROM chunks"</code>. If the agent answers without calling the tool, the model is too small to decide on its own; try a larger model or say “search the documents” in the question.</>} /></p>
        <Callout icon="check"><T pt={<><strong>Detalhes que importam.</strong> O modelo de embeddings usado para indexar e para buscar tem de ser <em>o mesmo</em> (e a dimensão da coluna, <code>vector(768)</code>, tem de bater com a dele). O operador <code>&lt;=&gt;</code> é a distância de cosseno, o mesmo que o índice <code>vector_cosine_ops</code> acelera; o HNSW é um índice <em>aproximado</em>, que troca um pouco de precisão por muita velocidade. Em produção, divida os documentos em trechos de algumas centenas de palavras com sobreposição, guarde metadados (fonte, data, dono) e <strong>filtre por permissão na própria consulta SQL</strong>, para o agente nunca recuperar o que o usuário não pode ver. Também trate o texto recuperado como dado não confiável: um documento pode conter instruções maliciosas (<em>prompt injection</em>).</>} en={<><strong>Details that matter.</strong> The embedding model used to index and to search must be <em>the same</em> (and the column dimension, <code>vector(768)</code>, must match it). The <code>&lt;=&gt;</code> operator is cosine distance, the same the <code>vector_cosine_ops</code> index speeds up; HNSW is an <em>approximate</em> index, trading a little accuracy for a lot of speed. In production, split documents into chunks of a few hundred words with overlap, store metadata (source, date, owner) and <strong>filter by permission inside the SQL query itself</strong>, so the agent never retrieves what the user may not see. Also treat retrieved text as untrusted data: a document can contain malicious instructions (<em>prompt injection</em>).</>} /></Callout>
      </Section>
      <Section id="security" title={<T pt="Segurança: o que muda quando o modelo tem “mãos”" en="Security: what changes when the model has “hands”" />}>
        <ul>
          <li><T pt={<><strong>Nunca exponha o servidor à internet.</strong> A documentação do Ollama explica que ele escuta só em <code>127.0.0.1</code> por padrão e que mudar o <code>OLLAMA_HOST</code> para <code>0.0.0.0</code> não adiciona nenhuma autenticação. Use túnel SSH, VPN ou um proxy reverso com autenticação.</>} en={<><strong>Never expose the server to the internet.</strong> The Ollama documentation explains it listens only on <code>127.0.0.1</code> by default and that changing <code>OLLAMA_HOST</code> to <code>0.0.0.0</code> adds no authentication. Use an SSH tunnel, a VPN or an authenticated reverse proxy.</>} /></li>
          <li><T pt={<><strong>Menor privilégio nas ferramentas.</strong> Dê ao agente só o que a tarefa exige: uma pasta, não o disco inteiro (como o <code>read_file</code> faz); leitura, não escrita; uma conta de banco somente leitura.</>} en={<><strong>Least privilege on tools.</strong> Give the agent only what the task needs: one folder, not the whole disk (as <code>read_file</code> does); read, not write; a read-only database account.</>} /></li>
          <li><T pt={<><strong>Injeção de prompt.</strong> Qualquer texto que o agente leia (página web, e-mail, arquivo) pode conter instruções escondidas. O OWASP lista a injeção de prompt e o excesso de autonomia entre os principais riscos de aplicações com LLMs. Peça confirmação humana antes de ações irreversíveis (apagar, enviar, pagar).</>} en={<><strong>Prompt injection.</strong> Any text the agent reads (a web page, an email, a file) may carry hidden instructions. OWASP lists prompt injection and excessive agency among the top risks of LLM applications. Ask for human confirmation before irreversible actions (delete, send, pay).</>} /></li>
          <li><T pt={<><strong>Segredos fora do código.</strong> Chaves em variáveis de ambiente ou no gerenciador de segredos, nunca no repositório.</>} en={<><strong>Secrets out of code.</strong> Keys in environment variables or a secrets manager, never in the repository.</>} /></li>
        </ul>
        <p><T pt={<>Para ir mais fundo, veja a nota <a href="/notas/web-app-security/">Secure web apps: headers, auth and AI agents</a> deste site.</>} en={<>To go deeper, see the <a href="/notas/web-app-security/">Secure web apps: headers, auth and AI agents</a> note on this site.</>} /></p>
      </Section>
      <Section id="cheat-llm" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="estimar a memória" en="estimate memory" />, <code><T pt="parâmetros × bits ÷ 8, mais 1–3 GB" en="parameters × bits ÷ 8, plus 1–3 GB" /></code>],
            [<T pt="rodar um modelo rápido" en="run a model quickly" />, <code>ollama run qwen3:8b</code>],
            [<T pt="ver se está na GPU" en="see if it is on the GPU" />, <code>ollama ps</code>],
            [<T pt="chamar por HTTP" en="call over HTTP" />, <code>POST /v1/chat/completions</code>],
            [<T pt="servir GGUF com chave" en="serve GGUF with a key" />, <code>llama-server -hf … --port 8080 --api-key …</code>],
            [<T pt="servir vários usuários na GPU" en="serve several users on GPU" />, <code>vllm serve … --enable-auto-tool-choice --tool-call-parser …</code>],
            [<T pt="trocar de servidor" en="switch server" />, <><code>LLM_BASE_URL</code>, <code>LLM_MODEL</code>, <code>LLM_API_KEY</code></>],
            [<T pt="um modelo de raciocínio local" en="a local reasoning model" />, <code>ollama run deepseek-r1:8b</code>],
            [<T pt="um agente pronto no meu Ollama" en="a ready-made agent on my Ollama" />, <code>OLLAMA_API_BASE=… aider --model ollama_chat/qwen3:8b</code>],
            [<T pt="busca por significado no Postgres" en="search by meaning in Postgres" />, <code>ORDER BY embedding &lt;=&gt; $1::vector LIMIT 3</code>],
            [<T pt="usar a GPU da nuvem sem expô-la" en="use the cloud GPU without exposing it" />, <code>ssh -N -L 11434:127.0.0.1:11434 user@ip</code>],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Qual a diferença entre modelo, servidor e agente? Qual deles é “só um arquivo”?" en="What is the difference between model, server and agent? Which one is “just a file”?" /></li>
          <li><T pt="Por que um modelo de 8B em 4 bits ocupa perto de 5 GB e não 16 GB?" en="Why does an 8B model in 4 bits take close to 5 GB and not 16 GB?" /></li>
          <li><T pt="No laço do agente, quem executa a ferramenta: o modelo ou o seu código? Por que isso importa para a segurança?" en="In the agent loop, who runs the tool: the model or your code? Why does that matter for security?" /></li>
          <li><T pt={<>O que muda no <code>agent.py</code> ao sair do Ollama local para o vLLM na nuvem?</>} en={<>What changes in <code>agent.py</code> when moving from local Ollama to vLLM in the cloud?</>} /></li>
          <li><T pt="Por que o Kimi K2, com 32B ativos, não cabe numa GPU de 24 GB? Qual a diferença entre parâmetros totais e ativos?" en="Why does Kimi K2, with 32B active, not fit a 24 GB GPU? What is the difference between total and active parameters?" /></li>
          <li><T pt={<>O que o Hermes Agent, o OpenHands e o Aider têm em comum com o <code>agent.py</code>? O que cada um acrescenta?</>} en={<>What do Hermes Agent, OpenHands and Aider have in common with <code>agent.py</code>? What does each add?</>} /></li>
          <li><T pt="Por que o RAG precisa usar o mesmo modelo de embeddings para indexar e para buscar? Onde se filtra por permissão?" en="Why must RAG use the same embedding model to index and to search? Where do you filter by permission?" /></li>
          <li><T pt="Por que usar um túnel SSH em vez de abrir a porta 11434 para a internet?" en="Why use an SSH tunnel instead of opening port 11434 to the internet?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://docs.ollama.com/api/openai-compatibility" rel="noopener">Ollama docs: OpenAI compatibility</a></li>
          <li><a href="https://docs.ollama.com/capabilities/tool-calling" rel="noopener">Ollama docs: Tool calling</a></li>
          <li><a href="https://docs.ollama.com/faq" rel="noopener">Ollama docs: FAQ (OLLAMA_HOST, keep-alive, context length, GPU, Docker)</a></li>
          <li><a href="https://ollama.com/library/qwen3" rel="noopener">Ollama library: Qwen3 (sizes and tags)</a></li>
          <li><a href="https://ollama.com/library/deepseek-r1" rel="noopener">Ollama library: DeepSeek-R1 (sizes, tags and license)</a></li>
          <li><a href="https://hermes-agent.nousresearch.com/" rel="noopener">Nous Research: Hermes Agent</a></li>
          <li><a href="https://github.com/All-Hands-AI/OpenHands" rel="noopener">OpenHands (GitHub)</a> · <a href="https://github.com/block/goose" rel="noopener">Goose (GitHub)</a> · <a href="https://github.com/cline/cline" rel="noopener">Cline (GitHub)</a> · <a href="https://aider.chat/docs/llms/ollama.html" rel="noopener">Aider: using Ollama</a></li>
          <li><a href="https://github.com/pgvector/pgvector" rel="noopener">pgvector (GitHub): install, HNSW index and distance operators</a></li>
          <li><a href="https://docs.ollama.com/capabilities/embeddings" rel="noopener">Ollama docs: Embeddings</a></li>
          <li><a href="https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md" rel="noopener">llama.cpp: llama-server README</a></li>
          <li><a href="https://docs.vllm.ai/en/latest/serving/online_serving/" rel="noopener">vLLM docs: OpenAI-compatible server</a> · <a href="https://docs.vllm.ai/en/stable/features/tool_calling.html" rel="noopener">Tool calling</a></li>
          <li><a href="https://arxiv.org/abs/2309.06180" rel="noopener">Kwon et al. (2023): Efficient Memory Management for LLM Serving with PagedAttention (vLLM)</a></li>
          <li><a href="https://arxiv.org/abs/2212.09720" rel="noopener">Dettmers and Zettlemoyer (2022): The case for 4-bit precision: k-bit inference scaling laws</a></li>
          <li><a href="https://arxiv.org/abs/2210.03629" rel="noopener">Yao et al. (2022): ReAct: Synergizing Reasoning and Acting in Language Models</a></li>
          <li><a href="https://www.anthropic.com/engineering/building-effective-agents" rel="noopener">Anthropic: Building effective agents</a></li>
          <li><a href="https://modelcontextprotocol.io/docs/getting-started/intro" rel="noopener">Model Context Protocol: What is MCP?</a></li>
          <li><a href="https://huggingface.co/docs/smolagents/index" rel="noopener">Hugging Face: smolagents docs</a></li>
          <li><a href="https://langchain-ai.github.io/langgraph/" rel="noopener">LangGraph docs</a></li>
          <li><a href="https://docs.openwebui.com/" rel="noopener">Open WebUI docs</a></li>
          <li><a href="https://aws.amazon.com/ec2/instance-types/g5/" rel="noopener">AWS: Amazon EC2 G5 instances</a></li>
          <li><a href="https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html" rel="noopener">AWS: Managing your costs with AWS Budgets</a></li>
          <li><a href="https://genai.owasp.org/llm-top-10/" rel="noopener">OWASP: Top 10 for LLM Applications</a></li>
        </ul>
      </Sources>
    </>
  );
}
