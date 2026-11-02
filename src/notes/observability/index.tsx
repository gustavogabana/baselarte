import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "observability",
  title: { en: "Observability: metrics, p95/p99, logs and traces", pt: "Observabilidade: métricas, p95/p99, logs e traces" },
  seo: {
    title: { en: "Observability: metrics, p95/p99, logs and traces", pt: "Observabilidade: métricas, p95/p99, logs e traces" },
    description: { en: "Observability for developers: metrics, KPIs, SLIs and SLOs, why p95 and p99 matter more than the average, Prometheus and Grafana with PromQL, traces (Jaeger, OpenTelemetry) and logs (Loki, Elasticsearch), a nine-activity Docker lab with expected results, and a secure production setup on Kubernetes and AWS.", pt: "Observabilidade para quem programa: métricas, KPIs, SLIs e SLOs, por que p95 e p99 importam mais que a média, Prometheus e Grafana com PromQL, traces (Jaeger, OpenTelemetry) e logs (Loki, Elasticsearch), um laboratório Docker de nove atividades com resultados esperados e uma produção segura no Kubernetes e na AWS." },
  },
  summary: "what observability is, the KPIs worth measuring, why p95 and p99 beat the average, how to add Prometheus and Grafana to a project, when you also need traces and logs (Jaeger, Loki, Elasticsearch), a hands-on Docker lab, and how to run it securely in production.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Observability, <em>see what your system is doing.</em></>, pt: <>Observabilidade, <em>veja o que o seu sistema está fazendo.</em></> },
  heroLede: { en: "Metrics, KPIs and percentiles (p95, p99), Prometheus and Grafana from scratch, traces and logs when metrics are not enough, hands-on labs with Docker, and how to run it securely in production.", pt: "Métricas, KPIs e percentis (p95, p99), Prometheus e Grafana do zero, traces e logs quando as métricas não bastam, laboratórios práticos com Docker e como operar com segurança em produção." },
  published: "2026-10-21",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é observabilidade" en="What observability is" /> },
        { id: "metrics", title: <T pt="Métricas e KPIs" en="Metrics and KPIs" /> },
        { id: "percentiles", title: <T pt="Percentis: p50, p95, p99" en="Percentiles: p50, p95, p99" /> },
        { id: "prometheus", title: <T pt="Prometheus e Grafana" en="Prometheus and Grafana" /> },
        { id: "beyond", title: <T pt="Traces, logs e outras ferramentas" en="Traces, logs and other tools" /> },
        { id: "instrument", title: <T pt="Como instrumentar" en="How to instrument" /> },
        { id: "lab", title: <T pt="Praticar com Docker" en="Practise with Docker" /> },
        { id: "prod", title: <T pt="Produção com segurança" en="Secure production" /> },
        { id: "cheat-obs", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é observabilidade e por que importa" en="What observability is and why it matters" />}>
        <p><T pt={<><strong>Observabilidade</strong> é a capacidade de entender o que acontece <em>dentro</em> de um sistema olhando só para o que ele emite para fora: a <strong>telemetria</strong>. Pense no painel de um carro: o velocímetro e a luz do óleo (<em>monitoramento</em>) avisam de problemas que você já previu; já o scanner do mecânico, que lê o motor e responde perguntas novas, é a observabilidade. Em software, você vai precisar das duas coisas.</>} en={<><strong>Observability</strong> is the ability to understand what happens <em>inside</em> a system by looking only at what it emits to the outside: its <strong>telemetry</strong>. Think of a car dashboard: the speedometer and the oil light (<em>monitoring</em>) warn about problems you foresaw; the mechanic's scanner, which reads the engine and answers new questions, is observability. In software you need both.</>} /></p>
        <p><T pt={<>Sem isso, o usuário reclama (“está lento”) e você descobre o problema <em>depois</em>, sem saber onde olhar. Com isso, você responde em minutos: <strong>está lento? para quem? desde quando? em qual serviço? por quê?</strong></>} en={<>Without it, the user complains (“it is slow”) and you find out <em>afterwards</em>, with no idea where to look. With it, you answer in minutes: <strong>is it slow? for whom? since when? in which service? why?</strong></>} /></p>
        <h3><T pt="Os três sinais" en="The three signals" /></h3>
        <Diagram minWidth={620} caption={<T pt="Cada sinal responde uma pergunta diferente; nenhum substitui os outros." en="Each signal answers a different question; none replaces the others." />}>
          <svg viewBox="0 0 700 205" role="img" aria-label="Três pilares / Three pillars">
            <rect x="10" y="10" width="215" height="150" rx="4" className="ln fillsoft" />
            <text x="117" y="38" className="pt" textAnchor="middle">Métricas</text>
            <text x="117" y="38" className="en" textAnchor="middle">Metrics</text>
            <text x="117" y="62" className="pt mut" textAnchor="middle">Quanto? Com que frequência?</text>
            <text x="117" y="62" className="en mut" textAnchor="middle">How much? How often?</text>
            <text x="117" y="92" className="pt mut" textAnchor="middle">números ao longo do tempo</text>
            <text x="117" y="92" className="en mut" textAnchor="middle">numbers over time</text>
            <text x="117" y="110" className="pt mut" textAnchor="middle">barato, ótimo para alertas</text>
            <text x="117" y="110" className="en mut" textAnchor="middle">cheap, great for alerts</text>
            <rect x="40" y="124" width="155" height="26" rx="4" className="brandfill" />
            <text x="117" y="142" className="mono" textAnchor="middle">Prometheus</text>
            <rect x="245" y="10" width="215" height="150" rx="4" className="ln fillsoft" />
            <text x="352" y="38" textAnchor="middle">Traces</text>
            <text x="352" y="62" className="pt mut" textAnchor="middle">Onde o tempo foi gasto?</text>
            <text x="352" y="62" className="en mut" textAnchor="middle">Where did the time go?</text>
            <text x="352" y="92" className="pt mut" textAnchor="middle">o caminho de UMA requisição</text>
            <text x="352" y="92" className="en mut" textAnchor="middle">the path of ONE request</text>
            <text x="352" y="110" className="pt mut" textAnchor="middle">atravessa vários serviços</text>
            <text x="352" y="110" className="en mut" textAnchor="middle">crosses several services</text>
            <rect x="275" y="124" width="155" height="26" rx="4" className="brandfill" />
            <text x="352" y="142" className="mono" textAnchor="middle">Jaeger · Tempo</text>
            <rect x="480" y="10" width="215" height="150" rx="4" className="ln fillsoft" />
            <text x="587" y="38" textAnchor="middle">Logs</text>
            <text x="587" y="62" className="pt mut" textAnchor="middle">O que aconteceu, e por quê?</text>
            <text x="587" y="62" className="en mut" textAnchor="middle">What happened, and why?</text>
            <text x="587" y="92" className="pt mut" textAnchor="middle">eventos em texto ou JSON</text>
            <text x="587" y="92" className="en mut" textAnchor="middle">events as text or JSON</text>
            <text x="587" y="110" className="pt mut" textAnchor="middle">detalhe alto, custo alto</text>
            <text x="587" y="110" className="en mut" textAnchor="middle">high detail, high cost</text>
            <rect x="510" y="124" width="155" height="26" rx="4" className="brandfill" />
            <text x="587" y="142" className="mono" textAnchor="middle">Loki · Elasticsearch</text>
            <text x="350" y="190" className="pt mut" textAnchor="middle">Juntos: a métrica avisa, o trace localiza, o log explica.</text>
            <text x="350" y="190" className="en mut" textAnchor="middle">Together: the metric alerts, the trace locates, the log explains.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Sinal" en="Signal" />, <T pt="O que é" en="What it is" />, <T pt="Boa para" en="Good for" />, <T pt="Limite" en="Limit" />]}
          rows={[
            [<T pt="Métricas" en="Metrics" />, <T pt="Números agregados ao longo do tempo (requisições/s, % de erro, p99)." en="Aggregated numbers over time (requests/s, % errors, p99)." />, <T pt="painéis, alertas, tendências, SLOs" en="dashboards, alerts, trends, SLOs" />, <T pt={<>não dizem <em>qual</em> requisição nem <em>por quê</em></>} en={<>do not say <em>which</em> request or <em>why</em></>} />],
            [<T pt="Traces" en="Traces" />, <T pt={<>O caminho de <em>uma</em> requisição, dividido em <em>spans</em> (cada etapa, com início e duração).</>} en={<>The path of <em>one</em> request, split into <em>spans</em> (each step, with start and duration).</>} />, <T pt="achar onde o tempo foi gasto, sobretudo entre serviços" en="finding where the time went, especially across services" />, <T pt="custam armazenamento; normalmente amostrados" en="storage cost; usually sampled" />],
            [<T pt="Logs" en="Logs" />, <T pt="Registros de eventos, de preferência em JSON estruturado." en="Event records, preferably structured JSON." />, <T pt="explicar o motivo: mensagem de erro, entrada, estado" en="explaining the reason: error message, input, state" />, <T pt="volume e custo altos; difíceis de agregar" en="high volume and cost; hard to aggregate" />],
          ]}
        />
        <Callout icon="check"><T pt={<>O padrão aberto para produzir esses três sinais é o <strong>OpenTelemetry</strong> (OTel), da CNCF: uma API/SDK por linguagem, um formato de transporte (OTLP) e um <em>Collector</em>. Instrumentando com OTel, você troca o destino (Jaeger, Tempo, Datadog, X-Ray…) sem reescrever o app.</>} en={<>The open standard for producing these three signals is <strong>OpenTelemetry</strong> (OTel), from the CNCF: one API/SDK per language, a transport format (OTLP) and a <em>Collector</em>. If you instrument with OTel, you change the destination (Jaeger, Tempo, Datadog, X-Ray…) without rewriting the app.</>} /></Callout>
      </Section>
      <Section id="metrics" title={<T pt="Métricas e KPIs: o que medir" en="Metrics and KPIs: what to measure" />}>
        <p><T pt={<>Medir tudo é o mesmo que não medir nada. Três “receitas” curtas dizem <em>o que</em> olhar primeiro:</>} en={<>Measuring everything is the same as measuring nothing. Three short “recipes” say <em>what</em> to look at first:</>} /></p>
        <Table
          head={[<T pt="Receita" en="Recipe" />, <T pt="Para quê" en="Used for" />, <T pt="O que mede" en="What it measures" />]}
          rows={[
            [<T pt={<><strong>Quatro sinais de ouro</strong> (Google SRE)</>} en={<><strong>Four golden signals</strong> (Google SRE)</>} />, <T pt="qualquer serviço" en="any service" />, <T pt={<><strong>latência</strong>, <strong>tráfego</strong>, <strong>erros</strong> e <strong>saturação</strong> (quão cheio está o recurso mais limitado)</>} en={<><strong>latency</strong>, <strong>traffic</strong>, <strong>errors</strong> and <strong>saturation</strong> (how full the most constrained resource is)</>} />],
            [<T pt={<><strong>RED</strong></>} en={<><strong>RED</strong></>} />, <T pt="serviços que respondem requisições (APIs, sites)" en="request-serving services (APIs, sites)" />, <T pt={<><strong>R</strong>ate (req/s), <strong>E</strong>rrors (% de falhas), <strong>D</strong>uration (latência por percentil)</>} en={<><strong>R</strong>ate (req/s), <strong>E</strong>rrors (% failing), <strong>D</strong>uration (latency by percentile)</>} />],
            [<T pt={<><strong>USE</strong></>} en={<><strong>USE</strong></>} />, <T pt="recursos: CPU, disco, rede, filas, pools" en="resources: CPU, disk, network, queues, pools" />, <T pt={<><strong>U</strong>tilization (% ocupado), <strong>S</strong>aturation (fila de espera), <strong>E</strong>rrors</>} en={<><strong>U</strong>tilization (% busy), <strong>S</strong>aturation (waiting queue), <strong>E</strong>rrors</>} />],
          ]}
        />
        <p><T pt={<>Na prática: <strong>RED para cada serviço, USE para cada recurso compartilhado</strong> (banco, fila, pool de conexões). É o que o painel do laboratório mostra.</>} en={<>In practice: <strong>RED for every service, USE for every shared resource</strong> (database, queue, connection pool). That is what the lab's dashboard shows.</>} /></p>
        <h3><T pt="KPIs: do técnico ao negócio" en="KPIs: from technical to business" /></h3>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="Exemplos de KPI" en="KPI examples" />, <T pt="Pergunta que responde" en="Question it answers" />]}
          rows={[
            [<T pt="Serviço" en="Service" />, <T pt="p95/p99 de latência por rota · taxa de erro 5xx · requisições/s · disponibilidade (% de requisições bem-sucedidas)" en="p95/p99 latency per route · 5xx error rate · requests/s · availability (% of successful requests)" />, <T pt="o serviço está saudável para o usuário?" en="is the service healthy for the user?" />],
            [<T pt="Infraestrutura" en="Infrastructure" />, <T pt="CPU, memória, atraso do event loop, conexões do banco em uso, profundidade e idade da fila" en="CPU, memory, event loop lag, DB connections in use, queue depth and age" />, <T pt="onde vamos ficar sem fôlego?" en="where will we run out of room?" />],
            [<T pt="Entrega (DORA)" en="Delivery (DORA)" />, <T pt="frequência de deploy · lead time · taxa de falha de mudança · tempo para restaurar" en="deploy frequency · lead time · change failure rate · time to restore" />, <T pt="entregamos rápido e com segurança?" en="do we ship fast and safely?" />],
            [<T pt="Negócio" en="Business" />, <T pt="pedidos/min · taxa de sucesso do pagamento · cadastros · conversão do checkout · receita/min" en="orders/min · payment success rate · sign-ups · checkout conversion · revenue/min" />, <T pt="o produto está funcionando para o negócio?" en="is the product working for the business?" />],
          ]}
        />
        <Callout icon="check"><T pt={<>A métrica de negócio costuma ser o <em>primeiro</em> alarme confiável: se “pedidos por minuto” cai, algo está errado mesmo que CPU, memória e erros pareçam normais.</>} en={<>The business metric is often the <em>first</em> reliable alarm: if “orders per minute” drops, something is wrong even when CPU, memory and errors look normal.</>} /></Callout>
        <h3><T pt="SLI, SLO e orçamento de erro" en="SLI, SLO and error budget" /></h3>
        <p><T pt="Metas sem número viram discussão. O vocabulário do SRE resolve isso:" en="Goals without numbers turn into arguments. SRE vocabulary fixes that:" /></p>
        <ul>
          <li><T pt={<><strong>SLI</strong> (indicador): o que você mede. Ex.: “% de requisições <code>/checkout</code> respondidas em menos de 500 ms e sem erro”.</>} en={<><strong>SLI</strong> (indicator): what you measure. E.g. “% of <code>/checkout</code> requests answered in under 500 ms with no error”.</>} /></li>
          <li><T pt={<><strong>SLO</strong> (objetivo): a meta para o SLI. Ex.: “99,9% em 30 dias”.</>} en={<><strong>SLO</strong> (objective): the target for the SLI. E.g. “99.9% over 30 days”.</>} /></li>
          <li><T pt={<><strong>Orçamento de erro</strong>: o que sobra para falhar. 99,9% em 30 dias = 0,1% de 43.200 min ≈ <strong>43 minutos</strong> (99% = 7,2 h; 99,95% = 21,6 min). Gastou o orçamento, pare de lançar novidades e conserte a confiabilidade.</>} en={<><strong>Error budget</strong>: what is left to fail. 99.9% over 30 days = 0.1% of 43,200 min ≈ <strong>43 minutes</strong> (99% = 7.2 h; 99.95% = 21.6 min). Budget spent, stop shipping features and fix reliability.</>} /></li>
          <li><T pt={<><strong>SLA</strong>: o contrato com o cliente (com multa). Costuma ser mais folgado que o SLO interno.</>} en={<><strong>SLA</strong>: the contract with the customer (with penalties). Usually looser than the internal SLO.</>} /></li>
        </ul>
      </Section>
      <Section id="percentiles" title={<T pt="Percentis (p50, p95, p99): por que a média engana" en="Percentiles (p50, p95, p99): why the average lies" />}>
        <p><T pt={<>O <strong>percentil</strong> responde “qual o tempo que X% das requisições não ultrapassam?”. Se o <strong>p95 = 300 ms</strong>, 95% das requisições terminaram em até 300 ms e 5% foram mais lentas. O <strong>p50</strong> é a mediana (a experiência típica); <strong>p95</strong> e <strong>p99</strong> mostram a <em>cauda</em>: os piores casos que ainda são frequentes o bastante para incomodar usuários reais.</>} en={<>A <strong>percentile</strong> answers “what time do X% of requests not exceed?”. If <strong>p95 = 300 ms</strong>, 95% of requests finished within 300 ms and 5% were slower. <strong>p50</strong> is the median (the typical experience); <strong>p95</strong> and <strong>p99</strong> show the <em>tail</em>: the worst cases that are still frequent enough to bother real users.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A maioria das requisições é rápida; poucas, muito lentas. A média cai no meio do nada e o p99 mostra a cauda." en="Most requests are fast; a few are very slow. The mean lands in the middle of nowhere and p99 shows the tail." />}>
          <svg viewBox="0 0 700 248" role="img" aria-label="Distribuição de latência / Latency distribution">
            <path d="M40 190L660 190" className="ln" />
            <rect x="42.0" y="40.0" width="27.0" height="150.0" className="ln fillsoft" />
            <rect x="73.0" y="80.4" width="27.0" height="109.6" className="ln fillsoft" />
            <rect x="104.0" y="178.5" width="27.0" height="11.5" className="ln fillsoft" />
            <rect x="135.0" y="187.7" width="27.0" height="2.3" className="ln fillsoft" />
            <rect x="166.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="197.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="228.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="259.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="290.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="321.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="352.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="383.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="414.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="445.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="476.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="507.0" y="187.1" width="27.0" height="2.9" className="ln fillsoft" />
            <rect x="538.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="569.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="600.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <rect x="631.0" y="188.0" width="27.0" height="2.0" className="ln fillsoft" />
            <path d="M40.0 190L40.0 195" className="ln" />
            <text x="40" y="210" className="mut" textAnchor="middle">0 ms</text>
            <path d="M195.0 190L195.0 195" className="ln" />
            <text x="195" y="210" className="mut" textAnchor="middle">500 ms</text>
            <path d="M350.0 190L350.0 195" className="ln" />
            <text x="350" y="210" className="mut" textAnchor="middle">1000 ms</text>
            <path d="M505.0 190L505.0 195" className="ln" />
            <text x="505" y="210" className="mut" textAnchor="middle">1500 ms</text>
            <path d="M660.0 190L660.0 195" className="ln" />
            <text x="660" y="210" className="mut" textAnchor="middle">2000 ms</text>
            <path d="M69.5 16L69.5 190" className="ln" />
            <text x="74" y="22" className="mono" textAnchor="start">p50 ≈ 95 ms</text>
            <path d="M86.8 34L86.8 190" className="ln dash" />
            <text x="92" y="40" className="pt mono" textAnchor="start">média ≈ 151 ms</text>
            <text x="92" y="40" className="en mono" textAnchor="start">mean ≈ 151 ms</text>
            <path d="M131.9 52L131.9 190" className="ln" />
            <text x="137" y="58" className="mono" textAnchor="start">p95 ≈ 296 ms</text>
            <path d="M536.6 16L536.6 190" className="ln" />
            <text x="542" y="22" className="mono" textAnchor="start">p99 ≈ 1602 ms</text>
            <text x="350" y="235" className="pt mut" textAnchor="middle">tempo da requisição (altura da barra = nº de requisições)</text>
            <text x="350" y="235" className="en mut" textAnchor="middle">request time (bar height = number of requests)</text>
          </svg>
        </Diagram>
        <p><T pt={<>No gráfico (1.000 requisições de exemplo), a média dá ≈ 151 ms: um número que <em>nenhum</em> usuário real viveu (a maioria levou ~100 ms; alguns levaram ~1,6 s). Um painel só com a média diria que está tudo bem, enquanto 1 em cada 100 usuários espera mais de 1,6 s.</>} en={<>In the chart (1,000 sample requests), the mean is ≈ 151 ms: a number that <em>no</em> real user experienced (most took ~100 ms; a few took ~1.6 s). A mean-only dashboard would say all is well while 1 in every 100 users waits over 1.6 s.</>} /></p>
        <h3><T pt="Por que a cauda importa mais do que parece" en="Why the tail matters more than it looks" /></h3>
        <p><T pt={<>Uma tela quase nunca faz <em>uma</em> chamada: faz dezenas (API, banco, cache, serviços internos). Se cada chamada tem 1% de chance de cair na cauda, a chance de a <em>página</em> pegar ao menos uma chamada lenta é <code>1 − 0,99<sup>n</sup></code>: com 100 chamadas, <strong>63%</strong>. O p99 de cada peça vira a experiência típica do todo (o artigo “The Tail at Scale”, de Dean e Barroso, trata disso).</>} en={<>A screen almost never makes <em>one</em> call: it makes dozens (API, database, cache, internal services). If each call has a 1% chance of landing in the tail, the chance that the <em>page</em> hits at least one slow call is <code>1 − 0.99<sup>n</sup></code>: with 100 calls, <strong>63%</strong>. Each piece's p99 becomes the typical experience of the whole (the paper “The Tail at Scale” by Dean and Barroso covers this).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Com 100 chamadas e 1% lentas, 63% das páginas pegam ao menos uma: o p99 de cada serviço vira a experiência típica do usuário." en="With 100 calls and 1% slow, 63% of pages hit at least one: each service's p99 becomes the user's typical experience." />}>
          <svg viewBox="0 0 700 245" role="img" aria-label="Cauda e amplificação / Tail amplification">
            <path d="M60 190L650 190M60 190L60 20" className="ln" />
            <path d="M60.0 190L60.0 195" className="ln" />
            <text x="60" y="210" className="mut" textAnchor="middle">0</text>
            <path d="M207.5 190L207.5 195" className="ln" />
            <text x="208" y="210" className="mut" textAnchor="middle">50</text>
            <path d="M355.0 190L355.0 195" className="ln" />
            <text x="355" y="210" className="mut" textAnchor="middle">100</text>
            <path d="M502.5 190L502.5 195" className="ln" />
            <text x="502" y="210" className="mut" textAnchor="middle">150</text>
            <path d="M650.0 190L650.0 195" className="ln" />
            <text x="650" y="210" className="mut" textAnchor="middle">200</text>
            <path d="M55 190L60 190" className="ln" />
            <text x="50" y="194" className="mut" textAnchor="end">0%</text>
            <path d="M55 148L60 148" className="ln" />
            <text x="50" y="152" className="mut" textAnchor="end">25%</text>
            <path d="M55 105L60 105" className="ln" />
            <text x="50" y="109" className="mut" textAnchor="end">50%</text>
            <path d="M55 62L60 62" className="ln" />
            <text x="50" y="66" className="mut" textAnchor="end">75%</text>
            <path d="M55 20L60 20" className="ln" />
            <text x="50" y="24" className="mut" textAnchor="end">100%</text>
            <polyline points="60.0,190.0 71.8,183.3 83.6,176.9 95.4,170.7 107.2,164.7 119.0,159.0 130.8,153.6 142.6,148.3 154.4,143.2 166.2,138.4 178.0,133.7 189.8,129.2 201.6,124.9 213.4,120.8 225.2,116.8 237.0,113.0 248.8,109.4 260.6,105.8 272.4,102.4 284.2,99.2 296.0,96.1 307.8,93.1 319.6,90.2 331.4,87.4 343.2,84.8 355.0,82.2 366.8,79.8 378.6,77.4 390.4,75.2 402.2,73.0 414.0,70.9 425.8,68.9 437.6,67.0 449.4,65.1 461.2,63.3 473.0,61.6 484.8,60.0 496.6,58.4 508.4,56.9 520.2,55.4 532.0,54.0 543.8,52.7 555.6,51.4 567.4,50.2 579.2,49.0 591.0,47.8 602.8,46.8 614.6,45.7 626.4,44.7 638.2,43.7 650.0,42.8" className="ln" />
            <polyline points="60.0,190.0 71.8,189.3 83.6,188.6 95.4,188.0 107.2,187.3 119.0,186.6 130.8,186.0 142.6,185.3 154.4,184.6 166.2,184.0 178.0,183.3 189.8,182.7 201.6,182.0 213.4,181.4 225.2,180.7 237.0,180.1 248.8,179.5 260.6,178.8 272.4,178.2 284.2,177.6 296.0,176.9 307.8,176.3 319.6,175.7 331.4,175.1 343.2,174.4 355.0,173.8 366.8,173.2 378.6,172.6 390.4,172.0 402.2,171.4 414.0,170.8 425.8,170.2 437.6,169.6 449.4,169.0 461.2,168.4 473.0,167.8 484.8,167.2 496.6,166.6 508.4,166.0 520.2,165.4 532.0,164.9 543.8,164.3 555.6,163.7 567.4,163.1 579.2,162.6 591.0,162.0 602.8,161.4 614.6,160.9 626.4,160.3 638.2,159.7 650.0,159.2" className="ln dash" />
            <text x="560" y="70" className="pt" textAnchor="middle">p99 por chamada</text>
            <text x="560" y="70" className="en" textAnchor="middle">p99 per call</text>
            <text x="560" y="148" className="pt mut" textAnchor="middle">p99.9 por chamada</text>
            <text x="560" y="148" className="en mut" textAnchor="middle">p99.9 per call</text>
            <text x="355" y="232" className="pt mut" textAnchor="middle">chamadas feitas por uma página/ação</text>
            <text x="355" y="232" className="en mut" textAnchor="middle">calls made by one page/action</text>
            <text x="70" y="36" className="pt mut" textAnchor="start">chance de pegar pelo menos 1 chamada lenta</text>
            <text x="70" y="36" className="en mut" textAnchor="start">chance of hitting at least 1 slow call</text>
          </svg>
        </Diagram>
        <h3><T pt="Regras para trabalhar com percentis" en="Rules for working with percentiles" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><strong>Nunca faça a média de percentis.</strong> A média dos p99 de 10 servidores não é o p99 do conjunto. Some os <em>buckets</em> dos histogramas de todos os servidores e só depois calcule o percentil (é o que o <code>histogram_quantile</code> faz sobre <code>sum by (le)</code>).</>} en={<><strong>Never average percentiles.</strong> The average of 10 servers' p99s is not the fleet's p99. Sum the histograms' <em>buckets</em> across all servers and only then compute the percentile (which is what <code>histogram_quantile</code> does over <code>sum by (le)</code>).</>} /></li>
          <li><T pt={<><strong>Meça por rota</strong> (ou por operação). Um endpoint rápido e muito chamado esconde o lento e crítico, como o <code>/checkout</code>.</>} en={<><strong>Measure per route</strong> (or per operation). A fast, heavily-called endpoint hides the slow, critical one, like <code>/checkout</code>.</>} /></li>
          <li><T pt={<><strong>Escolha o percentil pelo impacto:</strong> p95 para a experiência geral, p99 para fluxos críticos e dependências chamadas em cascata, p99.9 para sistemas com milhões de chamadas.</>} en={<><strong>Pick the percentile by impact:</strong> p95 for the general experience, p99 for critical flows and cascaded dependencies, p99.9 for systems with millions of calls.</>} /></li>
          <li><T pt={<><strong>Percentil sobre poucas amostras é ruído.</strong> Com 20 requisições por janela, o “p99” é basicamente o máximo. Use janelas maiores ou ignore rotas com pouco tráfego.</>} en={<><strong>A percentile over few samples is noise.</strong> With 20 requests per window, the “p99” is basically the maximum. Use longer windows or ignore low-traffic routes.</>} /></li>
          <li><T pt={<><strong>Histogramas são estimativas.</strong> A precisão depende dos <em>buckets</em> (veja o laboratório): ponha limites perto do seu SLO (ex.: 0,5 s e 1 s).</>} en={<><strong>Histograms are estimates.</strong> Precision depends on the <em>buckets</em> (see the lab): put boundaries near your SLO (e.g. 0.5 s and 1 s).</>} /></li>
        </ol>
      </Section>
      <Section id="prometheus" title={<T pt="Prometheus e Grafana: como funcionam" en="Prometheus and Grafana: how they work" />}>
        <p><T pt={<>O <strong>Prometheus</strong> é um banco de <em>séries temporais</em> que <strong>busca</strong> (pull) as métricas: a cada intervalo (ex.: 15 s) ele faz um <code>GET /metrics</code> em cada alvo, lê o texto e guarda os números com a hora. O <strong>Grafana</strong> não guarda nada: só consulta o Prometheus (e outros) e desenha painéis. O <strong>Alertmanager</strong> recebe os alertas que o Prometheus dispara e cuida de agrupar, silenciar e enviar (Slack, e-mail, PagerDuty).</>} en={<><strong>Prometheus</strong> is a <em>time-series</em> database that <strong>pulls</strong> metrics: every interval (e.g. 15 s) it does a <code>GET /metrics</code> on each target, reads the text and stores the numbers with the time. <strong>Grafana</strong> stores nothing: it only queries Prometheus (and others) and draws dashboards. <strong>Alertmanager</strong> receives the alerts Prometheus fires and handles grouping, silencing and sending (Slack, email, PagerDuty).</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O Prometheus busca (pull) as métricas, guarda como séries temporais e avalia regras; o Grafana só consulta." en="Prometheus pulls the metrics, stores them as time series and evaluates rules; Grafana only queries." />}>
          <svg viewBox="0 0 700 232" role="img" aria-label="Arquitetura do Prometheus / Prometheus architecture">
            <rect x="10" y="20" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="85.0" y="44.0" className="pt mono" textAnchor="middle">seu app</text>
            <text x="85.0" y="44.0" className="en mono" textAnchor="middle">your app</text>
            <text x="85.0" y="60.0" className="pt mut" textAnchor="middle">/metrics (texto)</text>
            <text x="85.0" y="60.0" className="en mut" textAnchor="middle">/metrics (text)</text>
            <rect x="10" y="92" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="85.0" y="116.0" className="mono" textAnchor="middle">node_exporter</text>
            <text x="85.0" y="132.0" className="pt mut" textAnchor="middle">CPU/disco da máquina</text>
            <text x="85.0" y="132.0" className="en mut" textAnchor="middle">machine CPU/disk</text>
            <rect x="10" y="164" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="85.0" y="188.0" className="pt" textAnchor="middle">banco, fila…</text>
            <text x="85.0" y="188.0" className="en" textAnchor="middle">database, queue…</text>
            <text x="85.0" y="204.0" className="pt mut" textAnchor="middle">exporters prontos</text>
            <text x="85.0" y="204.0" className="en mut" textAnchor="middle">ready-made exporters</text>
            <rect x="250" y="20" width="180" height="196" rx="4" className="brandfill" />
            <text x="340" y="46" textAnchor="middle">Prometheus</text>
            <text x="340" y="68" className="pt mut" textAnchor="middle">scrape a cada 15 s</text>
            <text x="340" y="68" className="en mut" textAnchor="middle">scrape every 15 s</text>
            <rect x="268" y="86" width="144" height="40" rx="4" className="ln" />
            <text x="340.0" y="104.0" textAnchor="middle">TSDB</text>
            <text x="340.0" y="120.0" className="pt mut" textAnchor="middle">séries no disco</text>
            <text x="340.0" y="120.0" className="en mut" textAnchor="middle">series on disk</text>
            <rect x="268" y="138" width="144" height="40" rx="4" className="ln" />
            <text x="340.0" y="156.0" className="pt" textAnchor="middle">regras</text>
            <text x="340.0" y="156.0" className="en" textAnchor="middle">rules</text>
            <text x="340.0" y="172.0" className="pt mut" textAnchor="middle">gravação e alerta</text>
            <text x="340.0" y="172.0" className="en mut" textAnchor="middle">recording &amp; alerts</text>
            <text x="340" y="204" className="mut" textAnchor="middle">PromQL</text>
            <path d="M250 46L160 46" className="ln" />
            <path d="M167.0 42.6L160 46L167.0 49.4" className="ln" />
            <path d="M250 118L160 118" className="ln" />
            <path d="M167.0 114.6L160 118L167.0 121.4" className="ln" />
            <path d="M250 190L160 190" className="ln" />
            <path d="M167.0 186.6L160 190L167.0 193.4" className="ln" />
            <text x="205" y="36" className="pt mut" textAnchor="middle">puxa (pull)</text>
            <text x="205" y="36" className="en mut" textAnchor="middle">pulls</text>
            <rect x="520" y="20" width="170" height="52" rx="4" className="ln" />
            <text x="605.0" y="44.0" textAnchor="middle">Alertmanager</text>
            <text x="605.0" y="60.0" className="pt mut" textAnchor="middle">agrupa e silencia</text>
            <text x="605.0" y="60.0" className="en mut" textAnchor="middle">groups and silences</text>
            <rect x="520" y="92" width="170" height="52" rx="4" className="ln fillsoft" />
            <text x="605.0" y="122.0" className="pt" textAnchor="middle">Slack · e-mail · PagerDuty</text>
            <text x="605.0" y="122.0" className="en" textAnchor="middle">Slack · email · PagerDuty</text>
            <path d="M430 140L520 56" className="ln" />
            <path d="M517.2 63.3L520 56L512.6 58.3" className="ln" />
            <path d="M605 72L605 92" className="ln" />
            <path d="M601.6 85.0L605 92L608.4 85.0" className="ln" />
            <rect x="520" y="164" width="170" height="52" rx="4" className="ln fillsoft" />
            <text x="605.0" y="188.0" textAnchor="middle">Grafana</text>
            <text x="605.0" y="204.0" className="pt mut" textAnchor="middle">painéis via PromQL</text>
            <text x="605.0" y="204.0" className="en mut" textAnchor="middle">dashboards via PromQL</text>
            <path d="M520 190L430 190" className="ln" />
            <path d="M437.0 186.6L430 190L437.0 193.4" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="Os quatro tipos de métrica" en="The four metric types" /></h3>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="Comportamento" en="Behaviour" />, <T pt="Exemplo" en="Example" />, <T pt="Como consultar" en="How to query" />]}
          rows={[
            [<T pt="Counter" en="Counter" />, <T pt="só cresce (zera ao reiniciar)" en="only goes up (resets on restart)" />, <T pt={<><code>http_requests_total</code></>} en={<><code>http_requests_total</code></>} />, <T pt={<><code>rate(x[5m])</code> = por segundo</>} en={<><code>rate(x[5m])</code> = per second</>} />],
            [<T pt="Gauge" en="Gauge" />, <T pt="sobe e desce" en="goes up and down" />, <T pt="memória usada, itens na fila" en="memory in use, items in queue" />, <T pt={<>o valor direto, ou <code>avg_over_time</code></>} en={<>the value itself, or <code>avg_over_time</code></>} />],
            [<T pt="Histogram" en="Histogram" />, <T pt={<>conta observações em <em>buckets</em> acumulados (<code>le</code> = “menor ou igual”), mais <code>_sum</code> e <code>_count</code></>} en={<>counts observations into cumulative <em>buckets</em> (<code>le</code> = “less than or equal”), plus <code>_sum</code> and <code>_count</code></>} />, <T pt={<><code>http_request_duration_seconds</code></>} en={<><code>http_request_duration_seconds</code></>} />, <T pt={<><code>histogram_quantile(0.99, …)</code></>} en={<><code>histogram_quantile(0.99, …)</code></>} />],
            [<T pt="Summary" en="Summary" />, <T pt="calcula percentis no próprio app" en="computes percentiles inside the app" />, <T pt="(evite para latência)" en="(avoid for latency)" />, <T pt={<><strong>não dá para agregar</strong> entre instâncias</>} en={<><strong>cannot be aggregated</strong> across instances</>} />],
          ]}
        />
        <Callout icon="check"><T pt={<>Para latência use <strong>Histogram</strong>: é o único que permite calcular o p95/p99 do <em>conjunto</em> de servidores. O <code>histogram_quantile</code> estima o valor interpolando <em>dentro</em> do bucket onde o percentil cai.</>} en={<>For latency use a <strong>Histogram</strong>: it is the only one that lets you compute the p95/p99 of the <em>whole fleet</em>. <code>histogram_quantile</code> estimates the value by interpolating <em>inside</em> the bucket where the percentile falls.</>} /></Callout>
        <h3><T pt="Rótulos e cardinalidade: o erro mais caro" en="Labels and cardinality: the costliest mistake" /></h3>
        <p><T pt={<>Cada combinação única de rótulos vira uma <em>série</em> separada na memória e no disco. <code>route="/orders/:id"</code> é uma série; usar a URL crua (<code>/orders/8841</code>, <code>/orders/8842</code>…) cria uma série por pedido e <strong>derruba o Prometheus</strong>. Regra: rótulos têm poucos valores possíveis (rota-modelo, método, status, região). <strong>Nunca</strong> use <code>user_id</code>, e-mail, ID de requisição ou URL crua como rótulo; esses dados vão em logs e traces.</>} en={<>Every unique label combination becomes a separate <em>series</em> in memory and on disk. <code>route="/orders/:id"</code> is one series; using the raw URL (<code>/orders/8841</code>, <code>/orders/8842</code>…) creates a series per order and <strong>brings Prometheus down</strong>. Rule: labels have few possible values (route template, method, status, region). <strong>Never</strong> use <code>user_id</code>, email, request ID or raw URL as a label; that data belongs in logs and traces.</>} /></p>
        <h3><T pt="PromQL: o essencial" en="PromQL: the essentials" /></h3>
        <CodeBlock code={`# Throughput: requests per second, per route (average over the last 5 minutes)
sum by (route) (rate(http_request_duration_seconds_count[5m]))

# Errors: percentage of requests that returned 5xx
100 * sum(rate(http_request_duration_seconds_count{status_code=~"5.."}[5m]))
    / sum(rate(http_request_duration_seconds_count[5m]))

# Duration: p95 and p99 per route
histogram_quantile(0.95, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.99, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m])))

# Average (for comparison with the percentiles)
sum(rate(http_request_duration_seconds_sum[5m])) / sum(rate(http_request_duration_seconds_count[5m]))

# Is everything being scraped? (1 = up, 0 = down)
up`} />
        <p><T pt={<>Leia assim: <code>rate(...[5m])</code> transforma o contador em “por segundo” numa janela de 5 minutos (use pelo menos 4× o intervalo de coleta); <code>sum by (le)</code> soma os servidores mantendo os buckets; <code>histogram_quantile</code> estima o percentil. Documentação: <em>Querying basics</em> no site do Prometheus.</>} en={<>Read it like this: <code>rate(...[5m])</code> turns the counter into “per second” over a 5-minute window (use at least 4× the scrape interval); <code>sum by (le)</code> adds up the servers keeping the buckets; <code>histogram_quantile</code> estimates the percentile. Docs: <em>Querying basics</em> on the Prometheus site.</>} /></p>
        <h3><T pt="Alertas que valem a pena" en="Alerts worth having" /></h3>
        <ul>
          <li><T pt={<><strong>Alerte em sintomas, não em causas.</strong> “p99 do checkout &gt; 1 s” e “erros &gt; 1%” importam para o usuário; “CPU &gt; 80%” pode ser normal. Causas ficam em painéis.</>} en={<><strong>Alert on symptoms, not causes.</strong> “checkout p99 &gt; 1 s” and “errors &gt; 1%” matter to the user; “CPU &gt; 80%” may be normal. Causes belong on dashboards.</>} /></li>
          <li><T pt={<><strong>Use <code>for:</code></strong> (ex.: 5 min) para não acordar ninguém por um pico de 10 segundos.</>} en={<><strong>Use <code>for:</code></strong> (e.g. 5 min) so nobody is woken by a 10-second spike.</>} /></li>
          <li><T pt={<><strong>Alerte pela velocidade de queima do orçamento (<em>burn rate</em>)</strong>, em duas janelas (ex.: 1 h e 5 min). Reduz ruído e avisa cedo (veja <em>Alerting on SLOs</em>, no SRE Workbook).</>} en={<><strong>Alert on error-budget burn rate</strong>, over two windows (e.g. 1 h and 5 min). It cuts noise and warns early (see <em>Alerting on SLOs</em> in the SRE Workbook).</>} /></li>
          <li><T pt={<><strong>Todo alerta que acorda alguém precisa de ação humana</strong> e de um link para o <em>runbook</em> (passo a passo). Alerta que ninguém age vira ruído e é apagado.</>} en={<><strong>Every alert that wakes someone needs a human action</strong> and a link to a <em>runbook</em> (step by step). An alert nobody acts on becomes noise and gets deleted.</>} /></li>
        </ul>
      </Section>
      <Section id="beyond" title={<T pt="Prometheus + Grafana bastam? Traces, logs e outras ferramentas" en="Are Prometheus + Grafana enough? Traces, logs and other tools" />}>
        <p><T pt={<><strong>Para latência e percentis, sim:</strong> com histogramas você tem p50/p95/p99 por rota, alertas e SLOs. <strong>Para depurar, não sozinhos.</strong> A métrica diz que o p99 do <code>/checkout</code> está em 2 s, mas não diz <em>qual</em> requisição, <em>qual etapa</em> demorou nem <em>por quê</em>. Para isso entram traces e logs:</>} en={<><strong>For latency and percentiles, yes:</strong> with histograms you get p50/p95/p99 per route, alerts and SLOs. <strong>For debugging, not on their own.</strong> The metric says the <code>/checkout</code> p99 is 2 s, but not <em>which</em> request, <em>which step</em> was slow or <em>why</em>. That is where traces and logs come in:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O caminho típico de um incidente: alerta de métrica, trace da requisição lenta, log da causa." en="The typical incident path: metric alert, trace of the slow request, log of the cause." />}>
          <svg viewBox="0 0 700 165" role="img" aria-label="Fluxo de depuração / Debugging flow">
            <rect x="10" y="20" width="150" height="66" rx="4" className="brandfill" />
            <text x="85.0" y="51.0" className="pt" textAnchor="middle">1. Alerta</text>
            <text x="85.0" y="51.0" className="en" textAnchor="middle">1. Alert</text>
            <text x="85.0" y="67.0" className="pt mut" textAnchor="middle">p99 de /checkout &gt; 1 s</text>
            <text x="85.0" y="67.0" className="en mut" textAnchor="middle">p99 of /checkout &gt; 1 s</text>
            <text x="85" y="108" className="mono mut" textAnchor="middle">Prometheus</text>
            <path d="M160 53L185 53" className="ln" />
            <path d="M178.0 56.4L185 53L178.0 49.6" className="ln" />
            <rect x="185" y="20" width="150" height="66" rx="4" className="ln fillsoft" />
            <text x="260.0" y="51.0" textAnchor="middle">2. Trace</text>
            <text x="260.0" y="67.0" className="pt mut" textAnchor="middle">qual span demorou?</text>
            <text x="260.0" y="67.0" className="en mut" textAnchor="middle">which span was slow?</text>
            <text x="260" y="108" className="mono mut" textAnchor="middle">Jaeger · Tempo</text>
            <path d="M335 53L360 53" className="ln" />
            <path d="M353.0 56.4L360 53L353.0 49.6" className="ln" />
            <rect x="360" y="20" width="150" height="66" rx="4" className="ln fillsoft" />
            <text x="435.0" y="51.0" textAnchor="middle">3. Log</text>
            <text x="435.0" y="67.0" className="pt mut" textAnchor="middle">por quê? (trace_id)</text>
            <text x="435.0" y="67.0" className="en mut" textAnchor="middle">why? (trace_id)</text>
            <text x="435" y="108" className="mono mut" textAnchor="middle">Loki · Elastic</text>
            <path d="M510 53L535 53" className="ln" />
            <path d="M528.0 56.4L535 53L528.0 49.6" className="ln" />
            <rect x="535" y="20" width="150" height="66" rx="4" className="ln fillsoft" />
            <text x="610.0" y="51.0" className="pt" textAnchor="middle">4. Correção</text>
            <text x="610.0" y="51.0" className="en" textAnchor="middle">4. Fix</text>
            <text x="610.0" y="67.0" className="pt mut" textAnchor="middle">e teste/alerta novo</text>
            <text x="610.0" y="67.0" className="en mut" textAnchor="middle">and a new test/alert</text>
            <text x="610" y="108" className="mono mut" textAnchor="middle">k6 · CI</text>
            <text x="350" y="150" className="pt mut" textAnchor="middle">do sintoma agregado à causa em uma requisição concreta</text>
            <text x="350" y="150" className="en mut" textAnchor="middle">from the aggregate symptom to the cause in one concrete request</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Quem responde" en="Who answers" />]}
          rows={[
            [<T pt="O p99 subiu? Desde quando? Em qual rota?" en="Did p99 go up? Since when? On which route?" />, <T pt={<><strong>Prometheus + Grafana</strong> (métricas)</>} en={<><strong>Prometheus + Grafana</strong> (metrics)</>} />],
            [<T pt="Qual etapa dessa requisição lenta demorou (banco, API de pagamento, cache)?" en="Which step of that slow request took the time (database, payment API, cache)?" />, <T pt={<><strong>Traces</strong>: Jaeger, Grafana Tempo, Elastic APM, AWS X-Ray</>} en={<><strong>Traces</strong>: Jaeger, Grafana Tempo, Elastic APM, AWS X-Ray</>} />],
            [<T pt="Qual foi o erro e com que dados? Quem foi afetado?" en="What was the error and with what data? Who was affected?" />, <T pt={<><strong>Logs</strong>: Loki, Elasticsearch/OpenSearch, CloudWatch Logs</>} en={<><strong>Logs</strong>: Loki, Elasticsearch/OpenSearch, CloudWatch Logs</>} />],
            [<T pt="Quais clientes, versões ou regiões estão piores? (dimensões de alta cardinalidade)" en="Which customers, versions or regions are worse? (high-cardinality dimensions)" />, <T pt={<><strong>Traces/logs</strong> consultados por atributo (ou plataformas de eventos como Honeycomb)</>} en={<><strong>Traces/logs</strong> queried by attribute (or event platforms such as Honeycomb)</>} />],
          ]}
        />
        <p><T pt={<>O elo entre os três é o <strong><code>trace_id</code></strong>: o app o coloca em cada log e o OpenTelemetry o propaga entre serviços (cabeçalho <code>traceparent</code>). Assim, do log de erro você abre o trace completo, e do trace lento você lê os logs daquela requisição. No laboratório você fará exatamente isso.</>} en={<>The link between the three is the <strong><code>trace_id</code></strong>: the app puts it in every log and OpenTelemetry propagates it between services (the <code>traceparent</code> header). So from an error log you open the full trace, and from a slow trace you read the logs of that very request. In the lab you will do exactly that.</>} /></p>
        <h3><T pt="Que pilha escolher" en="Which stack to choose" /></h3>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Composição" en="Makeup" />, <T pt="Pontos fortes" en="Strengths" />, <T pt="Custo de operar / atenção" en="Cost to run / watch out" />]}
          rows={[
            [<T pt={<><strong>Grafana stack</strong> (o do laboratório)</>} en={<><strong>Grafana stack</strong> (the lab's)</>} />, <T pt="Prometheus (métricas) + Loki (logs) + Tempo ou Jaeger (traces) + Grafana; coleta com OTel Collector ou Grafana Alloy" en="Prometheus (metrics) + Loki (logs) + Tempo or Jaeger (traces) + Grafana; collection with OTel Collector or Grafana Alloy" />, <T pt="open source, uma tela só, armazenamento barato (o Loki indexa só os rótulos, não o texto)" en="open source, single pane, cheap storage (Loki indexes only labels, not the text)" />, <T pt="você opera tudo; busca de texto livre nos logs é mais lenta que no Elasticsearch" en="you run everything; free-text log search is slower than in Elasticsearch" />],
            [<T pt={<><strong>Elastic Stack</strong> (Elasticsearch + Kibana + APM)</>} en={<><strong>Elastic Stack</strong> (Elasticsearch + Kibana + APM)</>} />, <T pt="tudo em um motor de busca; aceita OpenTelemetry" en="everything in one search engine; accepts OpenTelemetry" />, <T pt="busca de texto e análise de logs excelentes, agregações poderosas (percentis nos documentos), um só lugar para logs, traces e métricas" en="excellent text search and log analytics, powerful aggregations (percentiles over documents), one place for logs, traces and metrics" />, <T pt="pesado (JVM, memória, shards, retenção); é o mais caro de manter. OpenSearch é o fork Apache 2.0 (Amazon OpenSearch Service)" en="heavy (JVM, memory, shards, retention); the costliest to maintain. OpenSearch is the Apache 2.0 fork (Amazon OpenSearch Service)" />],
            [<T pt={<><strong>Gerenciado na AWS</strong></>} en={<><strong>Managed on AWS</strong></>} />, <T pt="CloudWatch (métricas, Logs Insights, Application Signals) + X-Ray ou OTel; ou Amazon Managed Prometheus + Managed Grafana" en="CloudWatch (metrics, Logs Insights, Application Signals) + X-Ray or OTel; or Amazon Managed Prometheus + Managed Grafana" />, <T pt="quase nada para operar; já integrado a ALB, ECS, EKS, Lambda; percentis do ALB sem instrumentar" en="almost nothing to run; already integrated with ALB, ECS, EKS, Lambda; ALB percentiles with no instrumentation" />, <T pt="preço por métrica, log ingerido e consulta: monitore a conta; menos flexível que o PromQL" en="priced per metric, ingested log and query: watch the bill; less flexible than PromQL" />],
            [<T pt={<><strong>SaaS</strong> (Datadog, New Relic, Honeycomb, Grafana Cloud)</>} en={<><strong>SaaS</strong> (Datadog, New Relic, Honeycomb, Grafana Cloud)</>} />, <T pt="plataforma pronta, com agentes" en="ready platform, with agents" />, <T pt="começa em minutos; ótimas buscas por alta cardinalidade" en="starts in minutes; great high-cardinality search" />, <T pt="custo cresce rápido com volume; dependência do fornecedor (OTel reduz isso)" en="cost grows fast with volume; vendor lock-in (OTel reduces it)" />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Recomendação para começar:</strong> métricas com Prometheus + Grafana, instrumentação com OpenTelemetry, e adicione traces (Jaeger/Tempo) e logs (Loki) quando o primeiro incidente pedir. Se sua equipe é pequena e já está na AWS, comece pelo CloudWatch e pelo Managed Prometheus/Grafana para não operar a pilha. Escolha Elasticsearch/OpenSearch quando a <em>busca e a análise de logs</em> forem o centro do trabalho.</>} en={<><strong>Recommendation to start:</strong> metrics with Prometheus + Grafana, instrumentation with OpenTelemetry, and add traces (Jaeger/Tempo) and logs (Loki) when the first incident asks for them. If your team is small and already on AWS, start with CloudWatch and Managed Prometheus/Grafana so you do not run the stack. Choose Elasticsearch/OpenSearch when <em>log search and analytics</em> are the centre of the work.</>} /></Callout>
        <Callout icon="check"><T pt={<>Percentil de <em>histograma</em> (Prometheus) é uma estimativa barata e agregável; percentil de <em>eventos brutos</em> (Elasticsearch, traces) é exato, mas custa armazenar cada requisição. Os dois se complementam: o histograma alerta, os eventos investigam. Os <em>exemplars</em> do Prometheus ligam um ponto do gráfico a um trace específico.</>} en={<>A <em>histogram</em> percentile (Prometheus) is a cheap, aggregatable estimate; a percentile over <em>raw events</em> (Elasticsearch, traces) is exact but costs storing every request. They complement each other: the histogram alerts, the events investigate. Prometheus <em>exemplars</em> link a point on the graph to a specific trace.</>} /></Callout>
      </Section>
      <Section id="instrument" title={<T pt="Como instrumentar um projeto" en="How to instrument a project" />}>
        <p><T pt={<>Instrumentar é fazer o app <em>emitir</em> os sinais. Três lugares cobrem quase tudo:</>} en={<>Instrumenting is making the app <em>emit</em> the signals. Three places cover almost everything:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><strong>Middleware HTTP</strong> (entrada): cronometra cada requisição e gera o RED por rota. É o que o laboratório faz.</>} en={<><strong>HTTP middleware</strong> (the entry): times every request and produces RED per route. That is what the lab does.</>} /></li>
          <li><T pt={<><strong>Chamadas de saída</strong> (banco, HTTP, fila, cache): viram <em>spans</em> nos traces. A auto-instrumentação do OpenTelemetry cobre as bibliotecas comuns sem mexer no código.</>} en={<><strong>Outbound calls</strong> (database, HTTP, queue, cache): become <em>spans</em> in the traces. OpenTelemetry auto-instrumentation covers common libraries without touching the code.</>} /></li>
          <li><T pt={<><strong>Eventos de negócio</strong> (pedido criado, pagamento aprovado): contadores e atributos de span escritos por você.</>} en={<><strong>Business events</strong> (order created, payment approved): counters and span attributes written by you.</>} /></li>
        </ol>
        <Table
          head={[<T pt="Stack" en="Stack" />, <T pt="Métricas Prometheus" en="Prometheus metrics" />, <T pt="Traces OpenTelemetry" en="OpenTelemetry traces" />]}
          rows={[
            [<T pt="Node.js" en="Node.js" />, <T pt={<><code>prom-client</code></>} en={<><code>prom-client</code></>} />, <T pt={<><code>@opentelemetry/auto-instrumentations-node</code></>} en={<><code>@opentelemetry/auto-instrumentations-node</code></>} />],
            [<T pt="Python" en="Python" />, <T pt={<><code>prometheus-client</code> (ou <code>prometheus-fastapi-instrumentator</code>)</>} en={<><code>prometheus-client</code> (or <code>prometheus-fastapi-instrumentator</code>)</>} />, <T pt={<><code>opentelemetry-instrument</code> (agente)</>} en={<><code>opentelemetry-instrument</code> (agent)</>} />],
            [<T pt="Java / Spring Boot" en="Java / Spring Boot" />, <T pt={<>Actuator + Micrometer (<code>/actuator/prometheus</code>)</>} en={<>Actuator + Micrometer (<code>/actuator/prometheus</code>)</>} />, <T pt={<>OTel Java agent (<code>-javaagent</code>)</>} en={<>OTel Java agent (<code>-javaagent</code>)</>} />],
            [<T pt="Go" en="Go" />, <T pt={<><code>client_golang</code></>} en={<><code>client_golang</code></>} />, <T pt={<>OTel Go SDK + <code>otelhttp</code></>} en={<>OTel Go SDK + <code>otelhttp</code></>} />],
            [<T pt="Nginx, Postgres, Redis, host" en="Nginx, Postgres, Redis, host" />, <T pt={<>exporters prontos (<code>nginx-prometheus-exporter</code>, <code>postgres_exporter</code>, <code>redis_exporter</code>, <code>node_exporter</code>)</>} en={<>ready-made exporters (<code>nginx-prometheus-exporter</code>, <code>postgres_exporter</code>, <code>redis_exporter</code>, <code>node_exporter</code>)</>} />, <T pt="—" en="—" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Cuidado com dados sensíveis.</strong> Telemetria vaza fácil: senha, token, CPF, e-mail e corpo de requisição não entram em rótulo, log nem atributo de span. Registre IDs internos, não dados pessoais, e mascare o que for inevitável. Veja <a href="/notas/web-app-security/">Secure web apps</a> para o raciocínio de superfície de ataque.</>} en={<><strong>Watch out for sensitive data.</strong> Telemetry leaks easily: passwords, tokens, personal IDs, emails and request bodies must not go into labels, logs or span attributes. Record internal IDs, not personal data, and mask what is unavoidable. See <a href="/notas/web-app-security/">Secure web apps</a> for the attack-surface reasoning.</>} /></Callout>
      </Section>
      <Section id="lab" title={<T pt="Praticar na sua máquina com Docker" en="Practise on your machine with Docker" />}>
        <p><T pt="Você vai montar, com o Docker Compose, um mini-ambiente de produção: uma API Node.js de “loja” com um endpoint lento de propósito, e ao redor dela Prometheus, Grafana, Jaeger, Loki e um gerador de carga (k6). Cada atividade é pequena e usa a anterior. Todos os arquivos e comandos abaixo foram executados de ponta a ponta, e os resultados esperados vêm dessas execuções (os números variam um pouco a cada rodada, porque a lentidão é aleatória)." en="With Docker Compose you will build a mini production environment: a “shop” Node.js API with a deliberately slow endpoint, and around it Prometheus, Grafana, Jaeger, Loki and a load generator (k6). Each activity is small and builds on the previous one. Every file and command below was run end to end, and the expected results come from those runs (numbers vary a bit between runs, because the slowness is random)." /></p>
        <Diagram minWidth={620} caption={<T pt="Seis contêineres no Docker Compose: a app emite métricas, traces e logs; o Grafana consulta os três." en="Six containers in Docker Compose: the app emits metrics, traces and logs; Grafana queries all three." />}>
          <svg viewBox="0 0 700 295" role="img" aria-label="Arquitetura do laboratório / Lab architecture">
            <rect x="10" y="110" width="100" height="46" rx="4" className="ln fillsoft" />
            <text x="60.0" y="131.0" className="mono" textAnchor="middle">k6</text>
            <text x="60.0" y="147.0" className="pt mut" textAnchor="middle">gera carga</text>
            <text x="60.0" y="147.0" className="en mut" textAnchor="middle">generates load</text>
            <path d="M110 133L175 133" className="ln" />
            <path d="M168.0 136.4L175 133L168.0 129.6" className="ln" />
            <rect x="175" y="100" width="130" height="66" rx="4" className="brandfill" />
            <text x="240.0" y="131.0" className="mono" textAnchor="middle">app (Node)</text>
            <text x="240.0" y="147.0" className="mut" textAnchor="middle">/products /checkout</text>
            <rect x="400" y="15" width="140" height="46" rx="4" className="ln" />
            <text x="470.0" y="36.0" textAnchor="middle">Prometheus</text>
            <text x="470.0" y="52.0" className="mut" textAnchor="middle">:9090</text>
            <path d="M400 45L305 108" className="ln" />
            <path d="M309.0 101.3L305 108L312.7 107.0" className="ln" />
            <text x="348" y="84" className="mut" textAnchor="start">scrape /metrics</text>
            <rect x="400" y="110" width="140" height="46" rx="4" className="ln" />
            <text x="470.0" y="131.0" textAnchor="middle">Jaeger</text>
            <text x="470.0" y="147.0" className="mut" textAnchor="middle">:16686</text>
            <path d="M305 133L400 133" className="ln" />
            <path d="M393.0 136.4L400 133L393.0 129.6" className="ln" />
            <text x="352" y="126" className="mut" textAnchor="middle">OTLP</text>
            <rect x="175" y="235" width="130" height="46" rx="4" className="ln" />
            <text x="240.0" y="256.0" textAnchor="middle">Alloy</text>
            <text x="240.0" y="272.0" className="pt mut" textAnchor="middle">lê logs do Docker</text>
            <text x="240.0" y="272.0" className="en mut" textAnchor="middle">reads Docker logs</text>
            <path d="M240 166L240 235" className="ln" />
            <path d="M236.6 228.0L240 235L243.4 228.0" className="ln" />
            <text x="248" y="205" className="pt mut" textAnchor="start">stdout JSON</text>
            <text x="248" y="205" className="en mut" textAnchor="start">JSON stdout</text>
            <rect x="400" y="235" width="140" height="46" rx="4" className="ln" />
            <text x="470.0" y="256.0" textAnchor="middle">Loki</text>
            <text x="470.0" y="272.0" className="pt mut" textAnchor="middle">guarda os logs</text>
            <text x="470.0" y="272.0" className="en mut" textAnchor="middle">stores the logs</text>
            <path d="M305 258L400 258" className="ln" />
            <path d="M393.0 261.4L400 258L393.0 254.6" className="ln" />
            <rect x="585" y="110" width="105" height="66" rx="4" className="brandfill" />
            <text x="637.5" y="141.0" textAnchor="middle">Grafana</text>
            <text x="637.5" y="157.0" className="mut" textAnchor="middle">:3001</text>
            <path d="M620 110L540 52" className="ln" />
            <path d="M547.7 53.4L540 52L543.7 58.9" className="ln" />
            <path d="M585 143L540 143" className="ln" />
            <path d="M547.0 139.6L540 143L547.0 146.4" className="ln" />
            <path d="M630 176L540 250" className="ln" />
            <path d="M543.2 242.9L540 250L547.6 248.2" className="ln" />
            <text x="10" y="40" className="pt mut" textAnchor="start">você: http://localhost:3001</text>
            <text x="10" y="40" className="en mut" textAnchor="start">you: http://localhost:3001</text>
            <text x="10" y="58" className="pt mut" textAnchor="start">e :9090 · :16686 · :8081</text>
            <text x="10" y="58" className="en mut" textAnchor="start">and :9090 · :16686 · :8081</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="#" en="#" />, <T pt="Atividade" en="Activity" />, <T pt="Você aprende" en="You learn" />]}
          rows={[
            [<T pt="0" en="0" />, <T pt="Criar os arquivos e subir" en="Create the files and start" />, <T pt="a estrutura do projeto" en="the project layout" />],
            [<T pt="1" en="1" />, <T pt={<>Ver o <code>/metrics</code> cru</>} en={<>See the raw <code>/metrics</code></>} />, <T pt="o formato de counters e histogramas" en="the counter and histogram format" />],
            [<T pt="2" en="2" />, <T pt="Prometheus coletando" en="Prometheus scraping" />, <T pt={<>targets, <code>up</code> e PromQL</>} en={<>targets, <code>up</code> and PromQL</>} />],
            [<T pt="3" en="3" />, <T pt="Painel no Grafana" en="Grafana dashboard" />, <T pt="RED por rota" en="RED per route" />],
            [<T pt="4" en="4" />, <T pt="Carga com k6: média × p95 × p99" en="Load with k6: average × p95 × p99" />, <T pt="por que a média engana" en="why the average lies" />],
            [<T pt="5" en="5" />, <T pt="Alertas" en="Alerts" />, <T pt={<>regras e estado <code>firing</code></>} en={<>rules and the <code>firing</code> state</>} />],
            [<T pt="6" en="6" />, <T pt="Traces no Jaeger" en="Traces in Jaeger" />, <T pt="achar a etapa lenta" en="finding the slow step" />],
            [<T pt="7" en="7" />, <T pt={<>Logs no Loki e o <code>trace_id</code></>} en={<>Logs in Loki and the <code>trace_id</code></>} />, <T pt="do log ao trace" en="from log to trace" />],
            [<T pt="8" en="8" />, <T pt="Opção Elasticsearch" en="Elasticsearch option" />, <T pt="percentis sobre eventos brutos" en="percentiles over raw events" />],
            [<T pt="9" en="9" />, <T pt="Limpar" en="Clean up" />, <T pt="apagar tudo" en="delete everything" />],
          ]}
        />
        <h3><T pt="Atividade 0: criar os arquivos e subir" en="Activity 0: create the files and start" /></h3>
        <p><T pt={<>Pré-requisitos: Docker com Compose v2 (<code>docker compose version</code>). Crie esta estrutura:</>} en={<>Prerequisites: Docker with Compose v2 (<code>docker compose version</code>). Create this layout:</>} /></p>
        <CodeBlock code={`obs-lab/
├── docker-compose.yml
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── prometheus/
│   ├── prometheus.yml
│   └── rules.yml
├── alloy/config.alloy
├── grafana/
│   ├── provisioning/datasources/datasources.yml
│   ├── provisioning/dashboards/dashboards.yml
│   └── dashboards/shop-red.json
└── k6/load.js`} />
        <p><T pt={<><strong>A aplicação.</strong> Uma API Express com três rotas: <code>/products</code> (rápida), <code>/checkout</code> (lenta em 5% das chamadas e com 4% de erros) e <code>/metrics</code>. O trecho que importa: o <em>histograma</em> da duração, o <em>middleware</em> que o alimenta (note que o rótulo é o <strong>modelo da rota</strong>, não a URL), os logs em JSON com o <code>trace_id</code> e um <em>span</em> manual em volta do pagamento.</>} en={<><strong>The application.</strong> An Express API with three routes: <code>/products</code> (fast), <code>/checkout</code> (slow on 5% of calls and failing 4%) and <code>/metrics</code>. The part that matters: the duration <em>histogram</em>, the <em>middleware</em> feeding it (note the label is the <strong>route template</strong>, not the URL), JSON logs with the <code>trace_id</code> and a manual <em>span</em> around the payment.</>} /></p>
        <p><code>app/server.js</code></p>
        <CodeBlock code={`const express = require('express');
const client = require('prom-client');
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const tracer = trace.getTracer('shop-api');

const app = express();
client.collectDefaultMetrics();                       // CPU, memory, event loop lag, GC...

// Duration of every HTTP request. Buckets decide how precise p95/p99 will be.
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (level, msg, extra = {}) => {
  const span = trace.getActiveSpan();
  console.log(JSON.stringify({
    time: new Date().toISOString(), level, msg,
    trace_id: span ? span.spanContext().traceId : undefined,   // lets you jump from a log to its trace
    ...extra,
  }));
};

// Middleware: time every request. Use the route TEMPLATE (/orders/:id), never the raw URL.
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : 'unmatched';
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => res.json({ ok: true }));

app.get('/products', async (req, res) => {          // fast: 10-40 ms
  await sleep(10 + Math.random() * 30);
  res.json([{ id: 1 }, { id: 2 }]);
});

app.get('/checkout', async (req, res) => {          // mostly 50-150 ms, 5% take ~1.5-2 s (the "tail")
  const slow = Math.random() < 0.05;
  const failed = Math.random() < 0.04;               // 4% fail

  // A manual span: the slow part now shows up by name inside the trace.
  await tracer.startActiveSpan('payment-provider.charge', async (span) => {
    span.setAttribute('payment.slow', slow);
    await sleep(slow ? 1500 + Math.random() * 500 : 50 + Math.random() * 100);
    if (failed) span.setStatus({ code: SpanStatusCode.ERROR, message: 'provider timeout' });
    span.end();
  });

  if (failed) {
    log('error', 'payment provider timeout', { route: '/checkout' });
    return res.status(500).json({ error: 'payment failed' });
  }
  log('info', 'checkout ok', { route: '/checkout', slow });
  res.json({ ok: true });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => log('info', 'listening on :3000'));`} />
        <p><code>app/package.json</code></p>
        <CodeBlock code={`{
  "name": "shop-api",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/auto-instrumentations-node": "^0.56.0",
    "express": "^4.21.0",
    "prom-client": "^15.1.3"
  }
}`} />
        <p><code>app/Dockerfile</code></p>
        <CodeBlock code={`FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
USER node
EXPOSE 3000
CMD ["node", "--require", "@opentelemetry/auto-instrumentations-node/register", "server.js"]`} />
        <p><T pt={<>O <code>CMD</code> carrega <code>@opentelemetry/auto-instrumentations-node/register</code>: sem mudar o código, o OpenTelemetry cria spans para cada requisição HTTP e rota Express e os envia por OTLP ao Jaeger.</>} en={<>The <code>CMD</code> loads <code>@opentelemetry/auto-instrumentations-node/register</code>: without changing the code, OpenTelemetry creates spans for each HTTP request and Express route and sends them over OTLP to Jaeger.</>} /></p>
        <p><T pt={<><strong>O Compose.</strong> Todas as portas publicadas ficam em <code>127.0.0.1</code> (só a sua máquina). O Grafana usa a porta <code>3001</code> para não colidir com apps que já usem a <code>3000</code>.</>} en={<><strong>Compose.</strong> All published ports bind to <code>127.0.0.1</code> (your machine only). Grafana uses port <code>3001</code> so it does not clash with apps already using <code>3000</code>.</>} /></p>
        <p><code>docker-compose.yml</code></p>
        <CodeBlock code={`services:
  app:
    build: ./app
    environment:
      OTEL_SERVICE_NAME: shop-api
      OTEL_EXPORTER_OTLP_ENDPOINT: http://jaeger:4318      # traces go to Jaeger over OTLP/HTTP
      OTEL_TRACES_EXPORTER: otlp
      OTEL_METRICS_EXPORTER: none                          # metrics come from prom-client instead
      OTEL_LOGS_EXPORTER: none
      OTEL_NODE_ENABLED_INSTRUMENTATIONS: http,express
    ports: ["127.0.0.1:8081:3000"]

  prometheus:
    image: prom/prometheus:v3.5.0
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./prometheus/rules.yml:/etc/prometheus/rules.yml:ro
    ports: ["127.0.0.1:9090:9090"]

  grafana:
    image: grafana/grafana:12.1.0
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin          # lab only
      GF_AUTH_ANONYMOUS_ENABLED: "false"
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - ./grafana/dashboards:/var/lib/grafana/dashboards:ro
    ports: ["127.0.0.1:3001:3000"]
    depends_on: [prometheus]

  jaeger:
    image: jaegertracing/jaeger:2.9.0
    ports: ["127.0.0.1:16686:16686"]             # UI; OTLP (4318) stays inside the network

  loki:
    image: grafana/loki:3.5.0
    command: ["-config.file=/etc/loki/local-config.yaml"]

  alloy:                                         # reads container logs and ships them to Loki
    image: grafana/alloy:v1.10.0
    command: ["run", "/etc/alloy/config.alloy"]
    volumes:
      - ./alloy/config.alloy:/etc/alloy/config.alloy:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro   # LAB ONLY: this socket is root on the host
    depends_on: [loki]

  k6:
    image: grafana/k6:1.2.0
    profiles: ["load"]                           # only runs when you ask for it
    volumes: ["./k6:/scripts:ro"]
    command: ["run", "/scripts/load.js"]
    depends_on: [app]`} />
        <Callout tone="warn" icon="alert"><T pt={<>O Alloy monta o <code>/var/run/docker.sock</code> para ler os logs dos contêineres. Quem acessa esse socket controla o Docker (na prática, é root na máquina). Aceitável num laboratório local; <strong>em produção não faça isso</strong>: use agentes por nó com permissão mínima (veja a seção de produção).</>} en={<>Alloy mounts <code>/var/run/docker.sock</code> to read container logs. Whoever reaches that socket controls Docker (effectively root on the machine). Acceptable in a local lab; <strong>do not do this in production</strong>: use per-node agents with minimal permissions (see the production section).</>} /></Callout>
        <p><T pt={<><strong>Prometheus:</strong> o arquivo de coleta e as regras (gravação do p99 e dois alertas).</>} en={<><strong>Prometheus:</strong> the scrape file and the rules (p99 recording rule and two alerts).</>} /></p>
        <p><code>prometheus/prometheus.yml</code></p>
        <CodeBlock code={`global:
  scrape_interval: 5s          # lab value; production usually 15s-60s
  evaluation_interval: 5s

rule_files:
  - /etc/prometheus/rules.yml

scrape_configs:
  - job_name: shop-api
    static_configs:
      - targets: ["app:3000"]  # Prometheus PULLS http://app:3000/metrics
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]`} />
        <p><code>prometheus/rules.yml</code></p>
        <CodeBlock code={`groups:
  - name: shop-api
    rules:
      # Recording rule: compute the expensive p99 once and store it as a new series
      - record: route:http_request_duration_seconds:p99_5m
        expr: histogram_quantile(0.99, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m])))

      - alert: HighLatencyP99
        expr: route:http_request_duration_seconds:p99_5m{route="/checkout"} > 1
        for: 1m
        labels: { severity: page }
        annotations:
          summary: "p99 of {{ $labels.route }} is above 1s"

      - alert: HighErrorRate
        expr: |
          sum(rate(http_request_duration_seconds_count{status_code=~"5.."}[5m]))
            / sum(rate(http_request_duration_seconds_count[5m])) > 0.01
        for: 1m
        labels: { severity: page }
        annotations:
          summary: "more than 1% of requests are failing"`} />
        <p><T pt={<><strong>Grafana e Alloy:</strong> as fontes de dados (Prometheus, Loki, Jaeger) e o painel “RED” são carregados sozinhos (<em>provisioning</em>); o campo derivado do Loki transforma o <code>trace_id</code> de cada log em link para o Jaeger. O Alloy descobre os contêineres e envia os logs ao Loki.</>} en={<><strong>Grafana and Alloy:</strong> the data sources (Prometheus, Loki, Jaeger) and the “RED” dashboard load themselves (<em>provisioning</em>); Loki's derived field turns each log's <code>trace_id</code> into a link to Jaeger. Alloy discovers the containers and ships the logs to Loki.</>} /></p>
        <p><code>grafana/provisioning/datasources/datasources.yml</code></p>
        <CodeBlock code={`apiVersion: 1
datasources:
  - name: Prometheus
    uid: prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
  - name: Loki
    uid: loki
    type: loki
    url: http://loki:3100
    jsonData:
      derivedFields:                      # turns trace_id in a log line into a link to the trace
        - name: trace_id
          matcherRegex: '"trace_id":"(\\w+)"'
          url: '$\${__value.raw}'
          datasourceUid: jaeger
  - name: Jaeger
    uid: jaeger
    type: jaeger
    url: http://jaeger:16686`} />
        <p><code>grafana/provisioning/dashboards/dashboards.yml</code></p>
        <CodeBlock code={`apiVersion: 1
providers:
  - name: lab
    type: file
    options:
      path: /var/lib/grafana/dashboards`} />
        <p><code>grafana/dashboards/shop-red.json</code></p>
        <CodeBlock code={`{
  "title": "Shop API (RED)",
  "uid": "shop-red",
  "refresh": "5s",
  "time": { "from": "now-15m", "to": "now" },
  "schemaVersion": 39,
  "panels": [
    { "id": 1, "type": "timeseries", "title": "Rate: requests per second",
      "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "reqps" }, "overrides": [] },
      "targets": [ { "refId": "A", "legendFormat": "{{route}}",
        "expr": "sum by (route) (rate(http_request_duration_seconds_count[1m]))" } ] },

    { "id": 2, "type": "timeseries", "title": "Errors: % of requests with 5xx",
      "gridPos": { "x": 12, "y": 0, "w": 12, "h": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "percent" }, "overrides": [] },
      "targets": [ { "refId": "A", "legendFormat": "5xx %",
        "expr": "100 * sum(rate(http_request_duration_seconds_count{status_code=~\\"5..\\"}[1m])) / sum(rate(http_request_duration_seconds_count[1m]))" } ] },

    { "id": 3, "type": "timeseries", "title": "Duration: /checkout p50, p95, p99 and average",
      "gridPos": { "x": 0, "y": 8, "w": 16, "h": 9 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "s" }, "overrides": [] },
      "targets": [
        { "refId": "A", "legendFormat": "p50", "expr": "histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket{route=\\"/checkout\\"}[1m])))" },
        { "refId": "B", "legendFormat": "p95", "expr": "histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{route=\\"/checkout\\"}[1m])))" },
        { "refId": "C", "legendFormat": "p99", "expr": "histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{route=\\"/checkout\\"}[1m])))" },
        { "refId": "D", "legendFormat": "average", "expr": "sum(rate(http_request_duration_seconds_sum{route=\\"/checkout\\"}[1m])) / sum(rate(http_request_duration_seconds_count{route=\\"/checkout\\"}[1m]))" } ] },

    { "id": 4, "type": "timeseries", "title": "Saturation: event loop lag p99",
      "gridPos": { "x": 16, "y": 8, "w": 8, "h": 9 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "s" }, "overrides": [] },
      "targets": [ { "refId": "A", "legendFormat": "lag p99", "expr": "nodejs_eventloop_lag_p99_seconds" } ] }
  ]
}`} />
        <p><code>alloy/config.alloy</code></p>
        <CodeBlock code={`discovery.docker "containers" {
  host = "unix:///var/run/docker.sock"
}

discovery.relabel "containers" {
  targets = discovery.docker.containers.targets
  rule {
    source_labels = ["__meta_docker_container_label_com_docker_compose_service"]
    target_label  = "service"
  }
}

loki.source.docker "containers" {
  host       = "unix:///var/run/docker.sock"
  targets    = discovery.relabel.containers.output
  forward_to = [loki.write.default.receiver]
}

loki.write "default" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push"
  }
}`} />
        <p><T pt={<>E o teste de carga: 10 usuários virtuais por 2 minutos, com <em>thresholds</em> que fazem o teste <strong>falhar</strong> se o SLO for violado (p95 &lt; 500 ms, p99 &lt; 1 s, erros &lt; 1%).</>} en={<>And the load test: 10 virtual users for 2 minutes, with <em>thresholds</em> that make the test <strong>fail</strong> if the SLO is broken (p95 &lt; 500 ms, p99 &lt; 1 s, errors &lt; 1%).</>} /></p>
        <p><code>k6/load.js</code></p>
        <CodeBlock code={`import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '2m',
  summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)', 'max'],   // print p99 in the summary
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],   // the test FAILS if the SLO is broken
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  http.get('http://app:3000/products');
  http.get('http://app:3000/checkout');
  sleep(0.5);
}`} />
        <CodeBlock code={`cd obs-lab
docker compose up -d --build
docker compose ps`} />
        <p><T pt={<><strong>Resultado esperado:</strong> seis serviços <code>Up</code> (o <code>k6</code> não aparece: só roda quando você pede).</>} en={<><strong>Expected result:</strong> six services <code>Up</code> (<code>k6</code> does not appear: it only runs when you ask).</>} /></p>
        <CodeBlock code={`NAME                 SERVICE      STATUS
obs-lab-alloy-1      alloy        Up 20 seconds
obs-lab-app-1        app          Up 22 seconds
obs-lab-grafana-1    grafana      Up 21 seconds
obs-lab-jaeger-1     jaeger       Up 21 seconds
obs-lab-loki-1       loki         Up 20 seconds
obs-lab-prometheus-1 prometheus   Up 22 seconds`} />
        <Callout tone="warn" icon="alert"><T pt={<>Se alguma porta (<code>8081</code>, <code>9090</code>, <code>3001</code>, <code>16686</code>) já estiver em uso, o Compose falha com “port is already allocated”. Troque só o número da esquerda em <code>ports</code>.</>} en={<>If any port (<code>8081</code>, <code>9090</code>, <code>3001</code>, <code>16686</code>) is already in use, Compose fails with “port is already allocated”. Change only the left-hand number in <code>ports</code>.</>} /></Callout>
        <h3><T pt="Atividade 1: ver o /metrics cru" en="Activity 1: see the raw /metrics" /></h3>
        <CodeBlock code={`curl -s localhost:8081/products
curl -s localhost:8081/metrics | grep -E 'http_request_duration_seconds_(bucket|sum|count)\\{.*route="/products"'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> um histograma em texto: cada linha <code>_bucket&#123;le="X"&#125;</code> conta quantas requisições levaram <em>até</em> X segundos (os números são acumulados), mais a soma e a contagem.</>} en={<><strong>Expected result:</strong> a histogram in plain text: each <code>_bucket&#123;le="X"&#125;</code> line counts how many requests took <em>up to</em> X seconds (the numbers are cumulative), plus the sum and the count.</>} /></p>
        <CodeBlock code={`http_request_duration_seconds_bucket{le="0.025",method="GET",route="/products",status_code="200"} 0
http_request_duration_seconds_bucket{le="0.05",method="GET",route="/products",status_code="200"} 1
http_request_duration_seconds_bucket{le="0.1",method="GET",route="/products",status_code="200"} 1
...
http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/products",status_code="200"} 1
http_request_duration_seconds_sum{method="GET",route="/products",status_code="200"} 0.0373
http_request_duration_seconds_count{method="GET",route="/products",status_code="200"} 1`} />
        <p><T pt={<>Aqui está o segredo do percentil: o Prometheus <em>não</em> guarda cada requisição, só estes contadores por faixa. Dá para estimar p95/p99 a partir deles, de graça e para qualquer número de requisições.</>} en={<>Here is the percentile secret: Prometheus does <em>not</em> store each request, only these per-range counters. You can estimate p95/p99 from them, cheaply and for any number of requests.</>} /></p>
        <h3><T pt="Atividade 2: o Prometheus coletando" en="Activity 2: Prometheus scraping" /></h3>
        <p><T pt={<>Abra <code>http://localhost:9090/targets</code>: os dois alvos devem estar <strong>UP</strong>. Depois, em <code>http://localhost:9090/query</code>, rode <code>up</code>. Ou pela linha de comando:</>} en={<>Open <code>http://localhost:9090/targets</code>: both targets should be <strong>UP</strong>. Then, at <code>http://localhost:9090/query</code>, run <code>up</code>. Or from the command line:</>} /></p>
        <CodeBlock code={`curl -s localhost:9090/api/v1/targets | grep -o '"health":"[a-z]*"'
curl -s -G localhost:9090/api/v1/query --data-urlencode 'query=up'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> os dois alvos saudáveis e <code>up</code> igual a 1 para cada job.</>} en={<><strong>Expected result:</strong> both targets healthy and <code>up</code> equal to 1 for each job.</>} /></p>
        <CodeBlock code={`"health":"up"
"health":"up"
{"metric":{"__name__":"up","instance":"app:3000","job":"shop-api"},"value":[...,"1"]}
{"metric":{"__name__":"up","instance":"localhost:9090","job":"prometheus"},"value":[...,"1"]}`} />
        <h3><T pt="Atividade 3: o painel no Grafana" en="Activity 3: the Grafana dashboard" /></h3>
        <p><T pt={<>Abra <code>http://localhost:3001</code> (usuário <code>admin</code>, senha <code>admin</code>; só no laboratório) e vá em <em>Dashboards → Shop API (RED)</em>. Há quatro painéis: <strong>Rate</strong> (req/s por rota), <strong>Errors</strong> (% de 5xx), <strong>Duration</strong> (p50, p95, p99 e média do <code>/checkout</code>) e <strong>Saturation</strong> (atraso do event loop). Sem tráfego, os gráficos ficam vazios. Gere um pouco de tráfego:</>} en={<>Open <code>http://localhost:3001</code> (user <code>admin</code>, password <code>admin</code>; lab only) and go to <em>Dashboards → Shop API (RED)</em>. There are four panels: <strong>Rate</strong> (req/s per route), <strong>Errors</strong> (% of 5xx), <strong>Duration</strong> (p50, p95, p99 and average of <code>/checkout</code>) and <strong>Saturation</strong> (event loop lag). With no traffic the charts are empty. Generate some traffic:</>} /></p>
        <CodeBlock code={`for i in $(seq 1 100); do curl -s -o /dev/null localhost:8081/checkout; done`} />
        <p><T pt={<>Clique no título de um painel e escolha <em>Explore</em> para ver (e editar) a consulta PromQL: é a mesma da seção anterior. Aprender a ler o PromQL por trás de cada painel é metade do ofício.</>} en={<>Click a panel's title and choose <em>Explore</em> to see (and edit) the PromQL query: it is the same as in the previous section. Learning to read the PromQL behind each panel is half the craft.</>} /></p>
        <h3><T pt="Atividade 4: carga com k6, média × p95 × p99" en="Activity 4: load with k6, average × p95 × p99" /></h3>
        <CodeBlock code={`docker compose --profile load run --rm k6 run --quiet /scripts/load.js`} />
        <p><T pt={<><strong>Resultado esperado:</strong> em 2 minutos o k6 imprime o resumo. Repare: a <strong>média é ≈ 108 ms</strong>, o <strong>p95 passa</strong> no limite, e só o <strong>p99 revela o problema</strong>. O k6 sai com código 99, porque dois <em>thresholds</em> falharam.</>} en={<><strong>Expected result:</strong> after 2 minutes k6 prints the summary. Note: the <strong>average is ≈ 108 ms</strong>, <strong>p95 passes</strong> its limit, and only <strong>p99 reveals the problem</strong>. k6 exits with code 99, because two <em>thresholds</em> failed.</>} /></p>
        <CodeBlock code={`  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<500' p(95)=148.3ms
    ✗ 'p(99)<1000' p(99)=1.79s

    http_req_failed
    ✗ 'rate<0.01' rate=2.05%

  █ TOTAL RESULTS

    http_req_duration..............: avg=108.26ms med=53.5ms   p(95)=148.3ms  p(99)=1.79s max=1.99s
    http_req_failed................: 2.05%  69 out of 3356
    http_reqs......................: 3356   27.710167/s`} />
        <p><T pt={<>Agora volte ao Grafana (painel <em>Duration</em>, últimos 5 minutos) ou consulte o Prometheus. Os valores só do <code>/checkout</code>, com a carga rodando:</>} en={<>Now go back to Grafana (the <em>Duration</em> panel, last 5 minutes) or query Prometheus. The values for <code>/checkout</code> alone, with the load running:</>} /></p>
        <CodeBlock code={`curl -s -G localhost:9090/api/v1/query --data-urlencode \\
 'query=histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{route="/checkout"}[1m])))'`} />
        <Table
          head={[<T pt="Métrica do /checkout" en="/checkout metric" />, <T pt="Valor típico" en="Typical value" />, <T pt="Leitura" en="Reading" />]}
          rows={[
            [<T pt="p50" en="p50" />, <T pt="≈ 0,10 s" en="≈ 0.10 s" />, <T pt="a experiência típica é ótima" en="the typical experience is great" />],
            [<T pt="média" en="average" />, <T pt="≈ 0,18 s" en="≈ 0.18 s" />, <T pt="parece “ok”, mas esconde a cauda" en="looks “fine” but hides the tail" />],
            [<T pt="p95" en="p95" />, <T pt="≈ 0,25 s" en="≈ 0.25 s" />, <T pt="ainda dentro do SLO de 500 ms" en="still within the 500 ms SLO" />],
            [<T pt="p99" en="p99" />, <T pt="≈ 2 s" en="≈ 2 s" />, <T pt={<>1 em cada 100 usuários espera ~2 s: <strong>SLO violado</strong></>} en={<>1 in 100 users waits ~2 s: <strong>SLO broken</strong></>} />],
            [<T pt="% de erros" en="% errors" />, <T pt="≈ 2%" en="≈ 2%" />, <T pt="acima do limite de 1%" en="above the 1% limit" />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Uma lição escondida no número:</strong> o p99 do Prometheus deu ≈ 2,2 s, mas o k6 mediu ≈ 1,8 s. A lentidão real fica entre 1,5 e 2 s; o histograma só conhece o <em>bucket</em> de 1 s a 2,5 s e <em>interpola</em> dentro dele. Quanto mais largos os buckets perto do valor que importa, mais impreciso o percentil. Desafio: troque <code>buckets</code> em <code>server.js</code> para incluir <code>1.5</code> e <code>2</code>, rode <code>docker compose up -d --build app</code>, repita a carga e compare.</>} en={<><strong>A lesson hidden in the number:</strong> Prometheus's p99 came out ≈ 2.2 s, but k6 measured ≈ 1.8 s. The real slowness sits between 1.5 and 2 s; the histogram only knows the 1 s to 2.5 s <em>bucket</em> and <em>interpolates</em> inside it. The wider the buckets near the value that matters, the less precise the percentile. Challenge: change <code>buckets</code> in <code>server.js</code> to include <code>1.5</code> and <code>2</code>, run <code>docker compose up -d --build app</code>, repeat the load and compare.</>} /></Callout>
        <h3><T pt="Atividade 5: alertas" en="Activity 5: alerts" /></h3>
        <p><T pt={<>Com a carga rodando (ou logo depois), abra <code>http://localhost:9090/alerts</code>. A regra <code>HighLatencyP99</code> fica <em>pending</em> por 1 minuto (o <code>for:</code>) e então <strong>firing</strong>; <code>HighErrorRate</code> também. Pela API:</>} en={<>With the load running (or right after), open <code>http://localhost:9090/alerts</code>. The <code>HighLatencyP99</code> rule stays <em>pending</em> for 1 minute (the <code>for:</code>) and then goes <strong>firing</strong>; so does <code>HighErrorRate</code>. Through the API:</>} /></p>
        <CodeBlock code={`curl -s localhost:9090/api/v1/alerts | grep -o '"alertname":"[A-Za-z0-9]*"\\|"state":"[a-z]*"'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> os alertas disparados.</>} en={<><strong>Expected result:</strong> the fired alerts.</>} /></p>
        <CodeBlock code={`"alertname":"HighLatencyP99"
"state":"firing"
"alertname":"HighErrorRate"
"state":"firing"`} />
        <p><T pt={<>No laboratório não há Alertmanager, então nada é enviado a ninguém; em produção, o Prometheus aponta para um Alertmanager que manda a mensagem ao Slack ou ao PagerDuty. Depois que a carga termina e a janela de 5 minutos esvazia, os alertas voltam ao normal sozinhos. Se editar o <code>rules.yml</code>, aplique com <code>docker compose restart prometheus</code>.</>} en={<>The lab has no Alertmanager, so nothing is sent to anyone; in production, Prometheus points to an Alertmanager that posts to Slack or PagerDuty. After the load ends and the 5-minute window drains, the alerts resolve themselves. If you edit <code>rules.yml</code>, apply it with <code>docker compose restart prometheus</code>.</>} /></p>
        <h3><T pt="Atividade 6: traces no Jaeger" en="Activity 6: traces in Jaeger" /></h3>
        <p><T pt={<>O alerta disse <em>que</em> o <code>/checkout</code> está lento. Agora descubra <em>onde</em>. Abra <code>http://localhost:16686</code>, escolha o serviço <code>shop-api</code>, a operação <code>GET /checkout</code>, ponha <strong>Min Duration = 1s</strong> e clique em <em>Find Traces</em>. Abra um trace. Ou pela API:</>} en={<>The alert said <em>that</em> <code>/checkout</code> is slow. Now find <em>where</em>. Open <code>http://localhost:16686</code>, choose the <code>shop-api</code> service, the <code>GET /checkout</code> operation, set <strong>Min Duration = 1s</strong> and click <em>Find Traces</em>. Open a trace. Or through the API:</>} /></p>
        <CodeBlock code={`curl -s "localhost:16686/api/traces?service=shop-api&operation=GET%20%2Fcheckout&minDuration=1s&limit=2" \\
 | python3 -c "
import sys, json
for t in json.load(sys.stdin)['data']:
    spans = sorted(t['spans'], key=lambda s: -s['duration'])[:2]
    print(t['traceID'], [(s['operationName'], s['duration'] // 1000) for s in spans])"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> quase todo o tempo está no span manual <code>payment-provider.charge</code> (em ms), com o atributo <code>payment.slow = true</code>. A causa não está no Express nem no seu código de rota, mas na chamada ao provedor de pagamento.</>} en={<><strong>Expected result:</strong> almost all the time is in the manual span <code>payment-provider.charge</code> (in ms), with the attribute <code>payment.slow = true</code>. The cause is not Express nor your route code, but the call to the payment provider.</>} /></p>
        <CodeBlock code={`a0b4fcd7e981c58dfc6fef6ab8c7455a [('GET /checkout', 1677), ('payment-provider.charge', 1675)]
42c31eab59b6ca2e89853d257e72435c [('GET /checkout', 1729), ('payment-provider.charge', 1728)]`} />
        <p><T pt={<>Na interface, o trace aparece como barras horizontais (um <em>flame/Gantt</em>): a barra do <code>payment-provider.charge</code> ocupa quase toda a largura do trace. Num sistema real, essas barras seriam chamadas ao banco, ao cache e a outros serviços, e é assim que você acha o culpado em uma arquitetura distribuída.</>} en={<>In the UI the trace shows as horizontal bars (a <em>flame/Gantt</em>): the <code>payment-provider.charge</code> bar takes almost the whole width of the trace. In a real system, those bars would be calls to the database, cache and other services, and that is how you find the culprit in a distributed architecture.</>} /></p>
        <h3><T pt="Atividade 7: logs no Loki e o trace_id" en="Activity 7: logs in Loki and the trace_id" /></h3>
        <p><T pt={<>No Grafana, abra <em>Explore</em> (ícone de bússola), escolha a fonte <strong>Loki</strong> e consulte os erros do app com LogQL:</>} en={<>In Grafana, open <em>Explore</em> (the compass icon), choose the <strong>Loki</strong> data source and query the app's errors with LogQL:</>} /></p>
        <CodeBlock code={`{service="app"} |= "error"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> linhas JSON de erro, cada uma com um <code>trace_id</code>. Ao lado do campo aparece um link <strong>Jaeger</strong> (o campo derivado do <code>datasources.yml</code>): clique e você cai no trace daquela requisição que falhou.</>} en={<><strong>Expected result:</strong> JSON error lines, each with a <code>trace_id</code>. Next to the field a <strong>Jaeger</strong> link appears (the derived field from <code>datasources.yml</code>): click it and you land on the trace of that failed request.</>} /></p>
        <CodeBlock code={`{"time":"2026-10-21T12:15:04.678Z","level":"error","msg":"payment provider timeout","trace_id":"41c4b47ae4d055290cf8035332d751b5","route":"/checkout"}
{"time":"2026-10-21T12:15:00.433Z","level":"error","msg":"payment provider timeout","trace_id":"d11ce37091a1f000fd889b7ac959154a","route":"/checkout"}`} />
        <p><T pt={<>Outras consultas úteis: <code>&#123;service="app"&#125; | json | slow="true"</code> (só as lentas) e <code>sum(rate(&#123;service="app"&#125; |= "error" [1m]))</code> (erros por segundo, a partir dos logs).</>} en={<>Other useful queries: <code>&#123;service="app"&#125; | json | slow="true"</code> (slow ones only) and <code>sum(rate(&#123;service="app"&#125; |= "error" [1m]))</code> (errors per second, from the logs).</>} /></p>
        <Callout icon="check"><T pt={<>Você acabou de percorrer o fluxo completo de um incidente: <strong>alerta (métrica) → trace → log</strong>. Esse é o valor de ter os três sinais ligados pelo <code>trace_id</code>.</>} en={<>You just walked the full incident flow: <strong>alert (metric) → trace → log</strong>. That is the value of having the three signals tied together by the <code>trace_id</code>.</>} /></Callout>
        <h3><T pt="Atividade 8: a opção Elasticsearch (percentis sobre eventos brutos)" en="Activity 8: the Elasticsearch option (percentiles over raw events)" /></h3>
        <p><T pt={<>Para ver como o outro mundo faz, suba um Elasticsearch de um nó (sem segurança, só no laboratório e só em <code>127.0.0.1</code>), grave 1.000 eventos de requisição sintéticos e peça os percentis. Aqui o cálculo é sobre <em>cada evento</em>, não sobre buckets:</>} en={<>To see how the other world does it, start a single-node Elasticsearch (no security, lab only and on <code>127.0.0.1</code> only), store 1,000 synthetic request events and ask for the percentiles. Here the calculation runs over <em>each event</em>, not over buckets:</>} /></p>
        <CodeBlock code={`docker run -d --name es-lab -p 127.0.0.1:9200:9200 \\
  -e discovery.type=single-node -e xpack.security.enabled=false \\
  -e ES_JAVA_OPTS="-Xms512m -Xmx512m" \\
  docker.elastic.co/elasticsearch/elasticsearch:9.1.0

# wait until it answers, then generate 1000 events (3% slow) and bulk-load them
until curl -s localhost:9200 >/dev/null; do sleep 3; done
awk 'BEGIN{srand(42); for(i=0;i<1000;i++){slow=(rand()<0.03); d=slow?1500+rand()*500:50+rand()*100;
  printf "{\\"index\\":{}}\\n{\\"@timestamp\\":\\"2026-01-01T00:00:00Z\\",\\"route\\":\\"/checkout\\",\\"duration_ms\\":%d}\\n", d}}' > bulk.ndjson
curl -s -H 'Content-Type: application/x-ndjson' -X POST 'localhost:9200/requests/_bulk?refresh=true' --data-binary @bulk.ndjson > /dev/null

curl -s -H 'Content-Type: application/json' 'localhost:9200/requests/_search?size=0&pretty' -d '{
  "aggs": {
    "latency": { "percentiles": { "field": "duration_ms", "percents": [50, 95, 99] } },
    "avg_ms":  { "avg": { "field": "duration_ms" } } } }'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> de novo, p50 e p95 baixos, p99 enorme e média “enganosa” (os números exatos dependem do seu <code>awk</code>).</>} en={<><strong>Expected result:</strong> again, low p50 and p95, a huge p99 and a “misleading” average (exact numbers depend on your <code>awk</code>).</>} /></p>
        <CodeBlock code={`  "aggregations" : {
    "latency" : { "values" : { "50.0" : 100.5, "95.0" : 147.0, "99.0" : 1818.0 } },
    "avg_ms"  : { "value" : 147.6 }
  }`} />
        <p><T pt={<>Na prática você não carrega dados à mão: o Elastic Agent, o Filebeat ou um OpenTelemetry Collector enviam logs e traces, e o Kibana (a interface) faz os gráficos. O que este exercício mostra é a diferença de modelo: <strong>Prometheus guarda contagens agregadas (barato, estimado)</strong>; <strong>Elasticsearch guarda cada evento (caro, exato e pesquisável por qualquer campo)</strong>.</>} en={<>In practice you do not load data by hand: Elastic Agent, Filebeat or an OpenTelemetry Collector ship logs and traces, and Kibana (the UI) draws the charts. What this exercise shows is the model difference: <strong>Prometheus stores aggregated counts (cheap, estimated)</strong>; <strong>Elasticsearch stores every event (costly, exact and searchable by any field)</strong>.</>} /></p>
        <h3><T pt="Atividade 9: limpar" en="Activity 9: clean up" /></h3>
        <CodeBlock code={`docker compose down -v          # stops the stack and removes its volumes
docker rm -f es-lab             # only if you ran activity 8
rm -f bulk.ndjson`} />
        <h3><T pt="Desafios para continuar" en="Challenges to continue" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><strong>Cardinalidade na prática:</strong> adicione um rótulo <code>user_id</code> (valor aleatório) ao histograma, gere carga e compare <code>curl -s localhost:8081/metrics | wc -l</code> antes e depois. Veja o crescimento e entenda por que isso derruba o Prometheus.</>} en={<><strong>Cardinality in practice:</strong> add a <code>user_id</code> label (random value) to the histogram, generate load and compare <code>curl -s localhost:8081/metrics | wc -l</code> before and after. See the growth and understand why it brings Prometheus down.</>} /></li>
          <li><T pt={<><strong>Seu próprio SLO:</strong> escreva uma regra de gravação para a proporção de requisições <code>/checkout</code> abaixo de 500 ms e sem erro, e um painel “orçamento de erro restante”.</>} en={<><strong>Your own SLO:</strong> write a recording rule for the ratio of <code>/checkout</code> requests under 500 ms and error-free, and an “error budget remaining” panel.</>} /></li>
          <li><T pt={<><strong>Mais um serviço:</strong> faça o <code>/checkout</code> chamar outro serviço (um segundo contêiner) e veja o trace atravessar os dois, com o mesmo <code>trace_id</code>.</>} en={<><strong>One more service:</strong> make <code>/checkout</code> call another service (a second container) and watch the trace cross both, with the same <code>trace_id</code>.</>} /></li>
          <li><T pt={<><strong>Alertmanager:</strong> adicione o contêiner <code>prom/alertmanager</code> com um receptor de webhook e veja o alerta chegar.</>} en={<><strong>Alertmanager:</strong> add the <code>prom/alertmanager</code> container with a webhook receiver and watch the alert arrive.</>} /></li>
          <li><T pt={<><strong>Seus próprios apps:</strong> ponha <code>postgres_exporter</code> e <code>node_exporter</code> no Compose e monte um painel USE para o banco (use o <a href="/notas/postgres-for-devs/">Postgres</a> da outra nota).</>} en={<><strong>Your own apps:</strong> put <code>postgres_exporter</code> and <code>node_exporter</code> in Compose and build a USE panel for the database (use the <a href="/notas/postgres-for-devs/">Postgres</a> from the other note).</>} /></li>
        </ol>
      </Section>
      <Section id="prod" title={<T pt="Colocar em produção com segurança" en="Running it in production, securely" />}>
        <p><T pt={<>O laboratório tem tudo num só Compose, sem alta disponibilidade e com senha <code>admin</code>. Em produção, o desenho muda em três eixos: <strong>onde</strong> roda, <strong>como</strong> os dados são guardados e <strong>quem</strong> pode ver ou mexer. A arquitetura de referência:</>} en={<>The lab has everything in one Compose, with no high availability and an <code>admin</code> password. In production, the design changes along three axes: <strong>where</strong> it runs, <strong>how</strong> data is stored and <strong>who</strong> may see or touch it. The reference architecture:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Os apps falam só com um coletor; o armazenamento de cada sinal pode ser trocado sem mexer nos apps." en="Apps talk only to a collector; each signal's storage can be swapped without touching the apps." />}>
          <svg viewBox="0 0 700 318" role="img" aria-label="Produção de referência / Reference production setup">
            <rect x="10" y="15" width="190" height="240" rx="4" className="ln dash" />
            <text x="22" y="36" className="mut" textAnchor="start">cluster / VMs</text>
            <rect x="25" y="50" width="160" height="44" rx="4" className="ln fillsoft" />
            <text x="105.0" y="70.0" textAnchor="middle">app 1</text>
            <text x="105.0" y="86.0" className="pt mut" textAnchor="middle">SDK OpenTelemetry</text>
            <text x="105.0" y="86.0" className="en mut" textAnchor="middle">OpenTelemetry SDK</text>
            <rect x="25" y="106" width="160" height="44" rx="4" className="ln fillsoft" />
            <text x="105.0" y="126.0" textAnchor="middle">app 2</text>
            <text x="105.0" y="142.0" className="pt mut" textAnchor="middle">SDK OpenTelemetry</text>
            <text x="105.0" y="142.0" className="en mut" textAnchor="middle">OpenTelemetry SDK</text>
            <rect x="25" y="162" width="160" height="44" rx="4" className="ln fillsoft" />
            <text x="105.0" y="182.0" textAnchor="middle">app 3</text>
            <text x="105.0" y="198.0" className="pt mut" textAnchor="middle">SDK OpenTelemetry</text>
            <text x="105.0" y="198.0" className="en mut" textAnchor="middle">OpenTelemetry SDK</text>
            <text x="105" y="232" className="mut mono" textAnchor="middle">/metrics · OTLP · stdout</text>
            <rect x="250" y="100" width="130" height="80" rx="4" className="brandfill" />
            <text x="315.0" y="138.0" textAnchor="middle">Collector</text>
            <text x="315.0" y="154.0" className="mut" textAnchor="middle">OTel / Alloy</text>
            <path d="M200 140L250 140" className="ln" />
            <path d="M243.0 143.4L250 140L243.0 136.6" className="ln" />
            <rect x="440" y="12" width="160" height="52" rx="4" className="ln" />
            <text x="520.0" y="36.0" textAnchor="middle">Alertmanager</text>
            <text x="520.0" y="52.0" className="mut" textAnchor="middle">→ Slack · PagerDuty</text>
            <rect x="440" y="80" width="160" height="52" rx="4" className="ln" />
            <text x="520.0" y="104.0" className="pt" textAnchor="middle">Métricas</text>
            <text x="520.0" y="104.0" className="en" textAnchor="middle">Metrics</text>
            <text x="520.0" y="120.0" className="mut" textAnchor="middle">Prometheus / AMP</text>
            <rect x="440" y="148" width="160" height="52" rx="4" className="ln" />
            <text x="520.0" y="172.0" textAnchor="middle">Traces</text>
            <text x="520.0" y="188.0" className="mut" textAnchor="middle">Tempo / X-Ray</text>
            <rect x="440" y="216" width="160" height="52" rx="4" className="ln" />
            <text x="520.0" y="240.0" textAnchor="middle">Logs</text>
            <text x="520.0" y="256.0" className="mut" textAnchor="middle">Loki / CloudWatch</text>
            <path d="M520 80L520 64" className="ln" />
            <path d="M523.4 71.0L520 64L516.6 71.0" className="ln" />
            <path d="M380 125L440 106" className="ln" />
            <path d="M434.4 111.4L440 106L432.3 104.9" className="ln" />
            <path d="M380 140L440 174" className="ln" />
            <path d="M432.2 173.5L440 174L435.6 167.6" className="ln" />
            <path d="M380 155L440 242" className="ln" />
            <path d="M433.2 238.2L440 242L438.8 234.3" className="ln" />
            <rect x="635" y="80" width="55" height="188" rx="4" className="brandfill" />
            <text x="662.5" y="178.0" textAnchor="middle">Grafana</text>
            <path d="M600 106L635 106" className="ln" />
            <path d="M628.0 109.4L635 106L628.0 102.6" className="ln" />
            <path d="M600 174L635 174" className="ln" />
            <path d="M628.0 177.4L635 174L628.0 170.6" className="ln" />
            <path d="M600 242L635 242" className="ln" />
            <path d="M628.0 245.4L635 242L628.0 238.6" className="ln" />
            <text x="350" y="304" className="pt mut" textAnchor="middle">tudo atrás de login/SSO e rede privada; o Grafana é a única janela</text>
            <text x="350" y="304" className="en mut" textAnchor="middle">everything behind login/SSO and a private network; Grafana is the only window</text>
          </svg>
        </Diagram>
        <p><T pt={<>Os apps falam só com um <strong>coletor</strong> (OpenTelemetry Collector ou Grafana Alloy, rodando como agente em cada nó). É o coletor que decide para onde cada sinal vai, faz amostragem e remove dados sensíveis: trocar de fornecedor vira configuração, não reescrita de código.</>} en={<>Apps talk only to a <strong>collector</strong> (OpenTelemetry Collector or Grafana Alloy, running as an agent on each node). The collector decides where each signal goes, samples and strips sensitive data: changing vendor becomes configuration, not a rewrite.</>} /></p>
        <h3><T pt="Caminho A: Kubernetes (kube-prometheus-stack)" en="Path A: Kubernetes (kube-prometheus-stack)" /></h3>
        <p><T pt={<>Se você já roda <a href="/notas/kubernetes/">Kubernetes</a>, o jeito padrão é o Helm chart <code>kube-prometheus-stack</code>: instala Prometheus (via Operator), Alertmanager, Grafana, <code>node-exporter</code> e <code>kube-state-metrics</code> já configurados, com painéis prontos para o cluster. Os alvos são declarados com um objeto <code>ServiceMonitor</code>, em vez de editar o <code>prometheus.yml</code>:</>} en={<>If you already run <a href="/notas/kubernetes/">Kubernetes</a>, the standard way is the <code>kube-prometheus-stack</code> Helm chart: it installs Prometheus (via the Operator), Alertmanager, Grafana, <code>node-exporter</code> and <code>kube-state-metrics</code> already wired, with cluster dashboards included. Targets are declared with a <code>ServiceMonitor</code> object instead of editing <code>prometheus.yml</code>:</>} /></p>
        <CodeBlock code={`kubectl create namespace monitoring
kubectl -n monitoring create secret generic grafana-admin \\
  --from-literal=admin-user=admin --from-literal=admin-password="$(openssl rand -base64 24)"

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kps prometheus-community/kube-prometheus-stack -n monitoring \\
  --set grafana.admin.existingSecret=grafana-admin \\
  --set grafana.admin.userKey=admin-user --set grafana.admin.passwordKey=admin-password
# read the password later with:
# kubectl -n monitoring get secret grafana-admin -o jsonpath='{.data.admin-password}' | base64 -d`} />
        <CodeBlock code={`apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: shop-api
  namespace: monitoring
  labels:
    release: kps                  # must match the chart's serviceMonitorSelector
spec:
  namespaceSelector:
    matchNames: [prod]
  selector:
    matchLabels:
      app: shop-api               # the Service's labels
  endpoints:
    - port: http                  # the Service's port NAME
      path: /metrics
      interval: 30s`} />
        <p><T pt={<>Para logs e traces, instale Loki e Tempo (charts da Grafana) e um Alloy como <em>DaemonSet</em> que lê os logs de cada nó. O app envia OTLP para o Collector do cluster (<code>OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.monitoring:4318</code>).</>} en={<>For logs and traces, install Loki and Tempo (Grafana charts) and an Alloy as a <em>DaemonSet</em> reading each node's logs. The app sends OTLP to the cluster's Collector (<code>OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.monitoring:4318</code>).</>} /></p>
        <h3><T pt="Caminho B: AWS gerenciada" en="Path B: managed AWS" /></h3>
        <p><T pt="Para não operar armazenamento, retenção e alta disponibilidade:" en="To avoid operating storage, retention and high availability:" /></p>
        <ul>
          <li><T pt={<><strong>Amazon Managed Service for Prometheus (AMP):</strong> seu Prometheus (ou o Collector) faz <code>remote_write</code> para um <em>workspace</em> gerenciado e durável; você mantém PromQL e regras.</>} en={<><strong>Amazon Managed Service for Prometheus (AMP):</strong> your Prometheus (or the Collector) does <code>remote_write</code> to a managed, durable <em>workspace</em>; you keep PromQL and rules.</>} /></li>
          <li><T pt={<><strong>Amazon Managed Grafana (AMG):</strong> Grafana gerenciado com login por SSO (IAM Identity Center) e fontes AMP, CloudWatch e X-Ray.</>} en={<><strong>Amazon Managed Grafana (AMG):</strong> managed Grafana with SSO login (IAM Identity Center) and AMP, CloudWatch and X-Ray sources.</>} /></li>
          <li><T pt={<><strong>CloudWatch:</strong> o ALB já publica <code>TargetResponseTime</code> com percentis, sem instrumentar nada; Logs Insights consulta logs; <em>Application Signals</em> dá latência, erros e SLOs por serviço no EKS/ECS.</>} en={<><strong>CloudWatch:</strong> the ALB already publishes <code>TargetResponseTime</code> with percentiles, with no instrumentation; Logs Insights queries logs; <em>Application Signals</em> gives latency, errors and SLOs per service on EKS/ECS.</>} /></li>
          <li><T pt={<><strong>AWS Distro for OpenTelemetry (ADOT) / X-Ray:</strong> coletor suportado pela AWS que envia traces ao X-Ray e métricas ao AMP.</>} en={<><strong>AWS Distro for OpenTelemetry (ADOT) / X-Ray:</strong> an AWS-supported collector that ships traces to X-Ray and metrics to AMP.</>} /></li>
        </ul>
        <CodeBlock code={`# prometheus.yml: keep scraping locally, also copy everything to AMP (SigV4 = IAM-signed requests, no passwords)
remote_write:
  - url: https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-REPLACE-ME/api/v1/remote_write
    sigv4:
      region: us-east-1           # credentials come from the pod/instance IAM role`} />
        <CodeBlock code={`# p95 and p99 of an ALB with zero instrumentation (CloudWatch extended statistics)
aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB --metric-name TargetResponseTime \\
  --dimensions Name=LoadBalancer,Value=app/my-alb/0123456789abcdef \\
  --start-time "$(date -u -d '-1 hour' +%FT%TZ)" --end-time "$(date -u +%FT%TZ)" \\
  --period 300 --extended-statistics p95 p99`} />
        <Callout icon="check"><T pt={<>A conta IAM da escrita no AMP é mínima: <code>aps:RemoteWrite</code> no workspace, atrelada à role do Pod (<a href="/notas/kubernetes/">Pod Identity/IRSA</a>) ou da instância. Sem chaves de acesso no arquivo.</>} en={<>The IAM permission to write to AMP is minimal: <code>aps:RemoteWrite</code> on the workspace, attached to the Pod's role (<a href="/notas/kubernetes/">Pod Identity/IRSA</a>) or the instance's. No access keys in the file.</>} /></Callout>
        <h3><T pt="Caminho C: uma VM com Docker Compose" en="Path C: a single VM with Docker Compose" /></h3>
        <p><T pt={<>Para um projeto pequeno, o próprio Compose do laboratório serve em uma VM, <strong>depois dos ajustes de segurança abaixo</strong>: tire o <code>docker.sock</code>, ponha as portas atrás de um proxy reverso com HTTPS e login (ou de uma VPN/Tailscale), troque as senhas, defina retenção e faça backup dos volumes.</>} en={<>For a small project, the lab's own Compose works on a VM, <strong>after the security changes below</strong>: remove <code>docker.sock</code>, put the ports behind a reverse proxy with HTTPS and login (or a VPN/Tailscale), change the passwords, set retention and back up the volumes.</>} /></p>
        <h3><T pt="Lista de verificação de produção" en="Production checklist" /></h3>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="O que fazer" en="What to do" />]}
          rows={[
            [<T pt="Acesso" en="Access" />, <T pt={<>Grafana atrás de SSO/OIDC (nada de <code>admin/admin</code>), sem cadastro aberto, papéis de leitura para a equipe; Prometheus, Alertmanager, Loki e Jaeger <strong>nunca</strong> expostos à internet (sem autenticação própria forte, entregam seus dados e permitem consultas pesadas).</>} en={<>Grafana behind SSO/OIDC (no <code>admin/admin</code>), no open sign-up, read roles for the team; Prometheus, Alertmanager, Loki and Jaeger <strong>never</strong> exposed to the internet (without strong built-in auth they hand over your data and allow heavy queries).</>} />],
            [<T pt="Rede" en="Network" />, <T pt={<><code>/metrics</code> só na rede interna (NetworkPolicy/Security Group); o app responde <code>/metrics</code> em uma porta separada da pública quando possível; TLS entre componentes que cruzam redes.</>} en={<><code>/metrics</code> only on the internal network (NetworkPolicy/Security Group); the app serves <code>/metrics</code> on a port separate from the public one when possible; TLS between components crossing networks.</>} />],
            [<T pt="Segredos" en="Secrets" />, <T pt={<>Senhas e tokens (webhook do Slack, chave do PagerDuty) em Secrets Manager/Secret do Kubernetes, nunca no <code>docker-compose.yml</code> nem no Git.</>} en={<>Passwords and tokens (Slack webhook, PagerDuty key) in Secrets Manager/Kubernetes Secrets, never in <code>docker-compose.yml</code> or Git.</>} />],
            [<T pt="Privilégio do coletor" en="Collector privilege" />, <T pt={<>Sem <code>docker.sock</code>: agente por nó (DaemonSet) com RBAC mínimo e leitura dos logs do nó. Nunca <code>privileged</code>.</>} en={<>No <code>docker.sock</code>: a per-node agent (DaemonSet) with minimal RBAC and read access to the node's logs. Never <code>privileged</code>.</>} />],
            [<T pt="Dados sensíveis" en="Sensitive data" />, <T pt="Sem PII, senha ou token em logs, rótulos e atributos; redija no app e no Collector (processor de redação); cuide da LGPD/GDPR: retenção curta de logs com dados pessoais." en="No PII, password or token in logs, labels or attributes; redact in the app and in the Collector (a redaction processor); mind GDPR/LGPD: short retention for logs with personal data." />],
            [<T pt="Cardinalidade e custo" en="Cardinality and cost" />, <T pt={<>Revise séries ativas (<code>prometheus_tsdb_head_series</code>); use <code>sample_limit</code> e <code>label_limit</code> no <code>scrape_config</code> para um app com bug não derrubar o Prometheus; rótulos sem ID.</>} en={<>Review active series (<code>prometheus_tsdb_head_series</code>); use <code>sample_limit</code> and <code>label_limit</code> in <code>scrape_config</code> so a buggy app cannot take Prometheus down; no IDs in labels.</>} />],
            [<T pt="Retenção e disco" en="Retention and disk" />, <T pt={<>Defina retenção (o padrão do Prometheus é 15 dias; <code>--storage.tsdb.retention.time</code>); volume dedicado, com alerta de espaço; dados de longo prazo via <code>remote_write</code> (AMP, Mimir, Thanos).</>} en={<>Set retention (Prometheus defaults to 15 days; <code>--storage.tsdb.retention.time</code>); dedicated volume with a disk-space alert; long-term data via <code>remote_write</code> (AMP, Mimir, Thanos).</>} />],
            [<T pt="Alta disponibilidade" en="High availability" />, <T pt={<>Dois Prometheus idênticos ou <code>remote_write</code> para um armazenamento gerenciado; Alertmanager em cluster (3 réplicas). Monitore o monitor: um alerta “sempre disparando” (<em>dead man's switch</em>) que avisa quando o alerta <em>deixa</em> de chegar.</>} en={<>Two identical Prometheus instances or <code>remote_write</code> to managed storage; clustered Alertmanager (3 replicas). Monitor the monitor: an “always firing” alert (a <em>dead man's switch</em>) that tells you when alerts <em>stop</em> arriving.</>} />],
            [<T pt="Traces" en="Traces" />, <T pt={<>Amostragem: guarde de 1% a 10% por <em>head sampling</em>, ou 100% dos erros e dos lentos com <em>tail sampling</em> no Collector. Propague o <code>traceparent</code> entre serviços.</>} en={<>Sampling: keep 1% to 10% with <em>head sampling</em>, or 100% of errors and slow ones with <em>tail sampling</em> in the Collector. Propagate <code>traceparent</code> between services.</>} />],
            [<T pt="Logs" en="Logs" />, <T pt={<>JSON estruturado com <code>trace_id</code>, nível e serviço; níveis <code>debug</code> desligados em produção; amostre logs repetitivos.</>} en={<>Structured JSON with <code>trace_id</code>, level and service; <code>debug</code> level off in production; sample repetitive logs.</>} />],
            [<T pt="Alertas" en="Alerts" />, <T pt={<>Sintoma, não causa; <em>burn rate</em> de SLO em duas janelas; severidade (página × ticket); <em>runbook</em> em cada alerta; revisão mensal dos que mais dispararam.</>} en={<>Symptom, not cause; SLO <em>burn rate</em> over two windows; severity (page × ticket); a <em>runbook</em> on every alert; monthly review of the noisiest.</>} />],
            [<T pt="Painéis como código" en="Dashboards as code" />, <T pt={<>Versione os JSON (provisioning, como no laboratório) ou use o provider Grafana do <a href="/notas/terraform/">Terraform</a>. Painel editado só na interface se perde.</>} en={<>Version the JSON (provisioning, as in the lab) or use the Grafana provider of <a href="/notas/terraform/">Terraform</a>. A dashboard edited only in the UI gets lost.</>} />],
            [<T pt="Atualizações" en="Upgrades" />, <T pt={<>Fixe versões de imagem (nada de <code>:latest</code>) e atualize de propósito; leia as notas de versão (ex.: mudanças entre Prometheus 2 e 3).</>} en={<>Pin image versions (no <code>:latest</code>) and upgrade on purpose; read release notes (e.g. changes between Prometheus 2 and 3).</>} />],
            [<T pt="Cultura" en="Culture" />, <T pt="Defina SLOs com o produto; revise o orçamento de erro toda semana; faça post-mortems sem culpa e transforme cada incidente em um alerta, painel ou teste novo." en="Define SLOs with product; review the error budget weekly; run blameless post-mortems and turn every incident into a new alert, dashboard or test." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>O erro mais comum não é técnico: é ter painéis lindos que ninguém olha e alertas demais que todos silenciam. Comece com <strong>poucos alertas que acordam por sintomas reais</strong>, um painel RED por serviço e um SLO combinado com o negócio. Dá para refinar depois; o contrário (apagar 200 alertas ruidosos) é muito mais difícil.</>} en={<>The most common failure is not technical: it is beautiful dashboards nobody looks at and too many alerts everyone mutes. Start with <strong>a few alerts that wake people for real symptoms</strong>, one RED dashboard per service and an SLO agreed with the business. You can refine later; the reverse (deleting 200 noisy alerts) is far harder.</>} /></Callout>
      </Section>
      <Section id="cheat-obs" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="ver o p95 por rota" en="see p95 per route" />, <T pt={<><code>histogram_quantile(0.95, sum by (le, route) (rate(x_bucket[5m])))</code></>} en={<><code>histogram_quantile(0.95, sum by (le, route) (rate(x_bucket[5m])))</code></>} />],
            [<T pt="requisições por segundo" en="requests per second" />, <T pt={<><code>sum(rate(x_count[5m]))</code></>} en={<><code>sum(rate(x_count[5m]))</code></>} />],
            [<T pt="% de erros" en="% errors" />, <T pt={<><code>sum(rate(x_count&#123;status_code=~"5.."&#125;[5m])) / sum(rate(x_count[5m]))</code></>} en={<><code>sum(rate(x_count&#123;status_code=~"5.."&#125;[5m])) / sum(rate(x_count[5m]))</code></>} />],
            [<T pt="média (para comparar)" en="average (to compare)" />, <T pt={<><code>rate(x_sum[5m]) / rate(x_count[5m])</code></>} en={<><code>rate(x_sum[5m]) / rate(x_count[5m])</code></>} />],
            [<T pt="todo mundo está sendo coletado?" en="is everything being scraped?" />, <T pt={<><code>up == 0</code> (lista o que caiu)</>} en={<><code>up == 0</code> (lists what is down)</>} />],
            [<T pt="orçamento de erro de 99,9%/30 dias" en="error budget of 99.9%/30 days" />, <T pt="0,1% × 43.200 min ≈ 43 min" en="0.1% × 43,200 min ≈ 43 min" />],
            [<T pt="achar o trace lento" en="find the slow trace" />, <T pt="Jaeger/Tempo: serviço + operação + duração mínima" en="Jaeger/Tempo: service + operation + min duration" />],
            [<T pt="achar o erro" en="find the error" />, <T pt={<>Loki: <code>&#123;service="app"&#125; |= "error"</code>; clique no <code>trace_id</code></>} en={<>Loki: <code>&#123;service="app"&#125; |= "error"</code>; click the <code>trace_id</code></>} />],
            [<T pt="RED / USE / golden signals" en="RED / USE / golden signals" />, <T pt="RED por serviço; USE por recurso; latência, tráfego, erros, saturação" en="RED per service; USE per resource; latency, traffic, errors, saturation" />],
            [<T pt="evitar derrubar o Prometheus" en="avoid taking Prometheus down" />, <T pt="rótulos com poucos valores; nunca ID de usuário/requisição/URL crua" en="labels with few values; never user/request IDs or raw URLs" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Qual a diferença entre monitoramento e observabilidade? O que cada um dos três sinais responde?" en="What is the difference between monitoring and observability? What does each of the three signals answer?" /></li>
          <li><T pt="O que significa p99 = 2 s? Por que a média não mostra isso?" en="What does p99 = 2 s mean? Why does the average not show it?" /></li>
          <li><T pt="Por que um p99 de 1% de lentidão por chamada vira 63% das páginas lentas com 100 chamadas?" en="Why does a 1% per-call tail become 63% slow pages with 100 calls?" /></li>
          <li><T pt="Por que não se faz a média de percentis de vários servidores? Como se calcula o certo?" en="Why do you not average percentiles across servers? How do you compute it correctly?" /></li>
          <li><T pt="Por que usar Histogram e não Summary para latência? Como a escolha dos buckets afeta o p99?" en="Why use a Histogram rather than a Summary for latency? How does bucket choice affect p99?" /></li>
          <li><T pt={<>O que é cardinalidade, e por que <code>user_id</code> como rótulo é um erro?</>} en={<>What is cardinality, and why is <code>user_id</code> as a label a mistake?</>} /></li>
          <li><T pt="Que alertas valem a pena? Por que alertar em sintomas e não em causas?" en="Which alerts are worth having? Why alert on symptoms rather than causes?" /></li>
          <li><T pt="Dado um alerta de p99 alto, descreva o caminho até a causa (métrica → trace → log)." en="Given a high-p99 alert, describe the path to the cause (metric → trace → log)." /></li>
          <li><T pt="Quando escolher Elasticsearch/OpenSearch no lugar de (ou junto com) Loki? E o CloudWatch?" en="When would you choose Elasticsearch/OpenSearch instead of (or alongside) Loki? And CloudWatch?" /></li>
          <li><T pt="Cite cinco cuidados de segurança ao colocar a observabilidade em produção." en="Name five security precautions when taking observability to production." /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://prometheus.io/docs/introduction/overview/" rel="noopener">Prometheus docs: Overview and architecture</a></li>
          <li><a href="https://prometheus.io/docs/concepts/metric_types/" rel="noopener">Prometheus docs: Metric types</a></li>
          <li><a href="https://prometheus.io/docs/practices/histograms/" rel="noopener">Prometheus docs: Histograms and summaries</a></li>
          <li><a href="https://prometheus.io/docs/prometheus/latest/querying/basics/" rel="noopener">Prometheus docs: Querying basics (PromQL)</a></li>
          <li><a href="https://prometheus.io/docs/practices/alerting/" rel="noopener">Prometheus docs: Alerting best practices</a></li>
          <li><a href="https://prometheus.io/docs/practices/naming/" rel="noopener">Prometheus docs: Metric and label naming</a></li>
          <li><a href="https://grafana.com/docs/grafana/latest/administration/provisioning/" rel="noopener">Grafana docs: Provisioning</a></li>
          <li><a href="https://grafana.com/docs/loki/latest/" rel="noopener">Grafana Loki docs</a> · <a href="https://grafana.com/docs/alloy/latest/" rel="noopener">Grafana Alloy docs</a></li>
          <li><a href="https://opentelemetry.io/docs/" rel="noopener">OpenTelemetry docs</a> · <a href="https://opentelemetry.io/docs/languages/js/getting-started/nodejs/" rel="noopener">Node.js getting started</a></li>
          <li><a href="https://www.jaegertracing.io/docs/" rel="noopener">Jaeger docs</a></li>
          <li><a href="https://grafana.com/docs/k6/latest/using-k6/thresholds/" rel="noopener">k6 docs: Thresholds</a></li>
          <li><a href="https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-aggregation" rel="noopener">Elasticsearch docs: Percentiles aggregation</a></li>
          <li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" rel="noopener">Google SRE Book: Monitoring Distributed Systems (the four golden signals)</a></li>
          <li><a href="https://sre.google/workbook/alerting-on-slos/" rel="noopener">Google SRE Workbook: Alerting on SLOs</a></li>
          <li><a href="https://research.google/pubs/the-tail-at-scale/" rel="noopener">Dean and Barroso: The Tail at Scale</a></li>
          <li><a href="https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html" rel="noopener">AWS: Amazon Managed Service for Prometheus</a></li>
          <li><a href="https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html" rel="noopener">AWS: Amazon Managed Grafana</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html" rel="noopener">AWS: CloudWatch concepts (percentiles)</a></li>
          <li><a href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" rel="noopener">kube-prometheus-stack Helm chart</a></li>
        </ul>
      </Sources>
    </>
  );
}
