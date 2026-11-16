import { Callout, CodeBlock, Diagram, QA, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "kafka",
  title: { en: "Kafka: topics, partitions and consumer groups", pt: "Kafka: tópicos, partições e grupos de consumo" },
  seo: {
    title: { en: "Apache Kafka explained: topics, partitions, brokers, groups and idempotency", pt: "Apache Kafka explicado: tópicos, partições, brokers, grupos e idempotência" },
    description: { en: "What Kafka is and which problem it solves: messages, topics, partitions, producers, consumers, every kind of group, brokers and replication, why 3 is the magic number, and why every message should carry an idempotency key, with a Docker lab.", pt: "O que é o Kafka e qual problema resolve: mensagens, tópicos, partições, produtores, consumidores, todos os tipos de grupo, brokers e replicação, por que 3 é o número mágico, e por que toda mensagem deve levar uma chave de idempotência, com laboratório em Docker." },
  },
  summary: "what Apache Kafka is (a replicated, partitioned commit log) and which problem it solves: records, topics, partitions and keys, producers (acks, idempotent producer), consumers and offsets, every kind of group (consumer, share, streams, ISR, controller quorum), brokers and KRaft, why replication factor 3 with min.insync.replicas 2 is the default, why every message should carry an idempotency key with the outbox pattern and consumer-side deduplication, delivery guarantees, production settings and a Docker lab.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>A log everyone can read, <em>in order, more than once.</em></>, pt: <>Um log que todos podem ler, <em>em ordem, quantas vezes quiserem.</em></> },
  heroLede: { en: "What Kafka is, which problem it solves, and the pieces that make it work: messages, topics, partitions, producers, consumers, groups and brokers. Plus the two defaults to never skip: replicate in threes, and put an idempotency key in every message.", pt: "O que é o Kafka, qual problema resolve, e as peças que fazem ele funcionar: mensagens, tópicos, partições, produtores, consumidores, grupos e brokers. Mais os dois padrões que não se pula: replicar de três em três, e colocar uma chave de idempotência em toda mensagem." },
  published: "2026-11-15",
  updated: "2026-11-15",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é e qual problema resolve" en="What it is and which problem it solves" /> },
        { id: "glossary", title: <T pt="Vocabulário" en="Vocabulary" /> },
        { id: "records", title: <T pt="Mensagens" en="Messages" /> },
        { id: "topics", title: <T pt="Tópicos, partições e chaves" en="Topics, partitions and keys" /> },
        { id: "brokers", title: <T pt="Brokers, réplicas e KRaft" en="Brokers, replicas and KRaft" /> },
        { id: "three", title: <T pt="Por que sempre 3" en="Why always 3" /> },
        { id: "producers", title: <T pt="Produtores" en="Producers" /> },
        { id: "consumers", title: <T pt="Consumidores e offsets" en="Consumers and offsets" /> },
        { id: "groups", title: <T pt="Grupos: todos os tipos" en="Groups: every kind" /> },
        { id: "idempotency", title: <T pt="Chave de idempotência, sempre" en="An idempotency key, always" /> },
        { id: "delivery", title: <T pt="Garantias de entrega" en="Delivery guarantees" /> },
        { id: "prod", title: <T pt="Em produção" en="In production" /> },
        { id: "lab", title: <T pt="Exercício: um Kafka no Docker" en="Exercise: Kafka in Docker" /> },
        { id: "cheat-kf", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

/** Offsets drawn in each partition of the first diagram. */
const PARTITION_ROWS = [
  { name: "P0", y: 56, cells: 6 },
  { name: "P1", y: 106, cells: 4 },
  { name: "P2", y: 156, cells: 7 },
];

/** Which broker leads which partition in the replication diagram. */
const BROKER_COLUMNS = [
  { x: 20, leads: "P0" },
  { x: 250, leads: "P1" },
  { x: 480, leads: "P2" },
];

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é e qual problema resolve" en="What it is and which problem it solves" />}>
        <p><T pt={<>O <strong>Apache Kafka</strong> é um <em>log de eventos distribuído</em>: uma lista que só cresce no fim, gravada em disco, replicada em várias máquinas e dividida em pedaços para escalar. Quem escreve (produtor) acrescenta mensagens no fim; quem lê (consumidor) anda pela lista no seu próprio ritmo e lembra onde parou.</>} en={<><strong>Apache Kafka</strong> is a <em>distributed event log</em>: a list that only grows at the end, written to disk, replicated across several machines and split into pieces to scale. Writers (producers) append messages at the end; readers (consumers) walk the list at their own pace and remember where they stopped.</>} /></p>
        <p><T pt={<>O problema que ele resolve aparece quando um sistema cresce: o serviço de pedidos precisa avisar cobrança, estoque, e-mail, analytics e busca. Com chamadas diretas, cada novo interessado é mais uma dependência do serviço de pedidos, e se um deles cai, o pedido falha ou o aviso se perde. Com o Kafka, pedidos publica <em>um</em> evento <code>order.created</code> num tópico e esquece; cada interessado lê quando puder.</>} en={<>The problem it solves shows up as a system grows: the orders service has to tell billing, stock, email, analytics and search. With direct calls, every new listener is one more dependency of the orders service, and if one is down, the order fails or the notice is lost. With Kafka, orders publishes <em>one</em> <code>order.created</code> event to a topic and moves on; each listener reads it when it can.</>} /></p>
        <ul>
          <li><T pt={<><strong>Desacoplamento:</strong> quem produz não conhece quem consome. Adicionar um consumidor novo não muda o produtor.</>} en={<><strong>Decoupling:</strong> producers do not know consumers. Adding a new consumer does not touch the producer.</>} /></li>
          <li><T pt={<><strong>Absorver picos:</strong> se o consumidor é lento ou está fora, as mensagens esperam no disco (por dias, se você quiser), em vez de derrubar alguém.</>} en={<><strong>Absorbing spikes:</strong> if a consumer is slow or down, messages wait on disk (for days, if you want), instead of knocking someone over.</>} /></li>
          <li><T pt={<><strong>Reprocessar:</strong> ler não apaga. Dá para voltar o ponteiro e reler a semana inteira para corrigir um bug ou alimentar um sistema novo.</>} en={<><strong>Replay:</strong> reading does not delete. You can move the pointer back and reread the whole week to fix a bug or feed a new system.</>} /></li>
          <li><T pt={<><strong>Ordem e escala juntas:</strong> ordem garantida dentro de cada partição, e paralelismo espalhando partições por máquinas.</>} en={<><strong>Order and scale together:</strong> guaranteed order inside each partition, and parallelism by spreading partitions across machines.</>} /></li>
        </ul>
        <h3><T pt="Kafka não é uma fila comum" en="Kafka is not a regular queue" /></h3>
        <Table
          head={[<T pt="Aspecto" en="Aspect" />, <T pt="Fila (SQS, RabbitMQ)" en="Queue (SQS, RabbitMQ)" />, <T pt="Kafka (log)" en="Kafka (log)" />]}
          rows={[
            [<T pt="Ao ler" en="On read" />, <T pt="a mensagem some da fila (após o ack)" en="the message leaves the queue (after the ack)" />, <T pt="a mensagem fica; o consumidor só avança o offset" en="the message stays; the consumer only advances its offset" />],
            [<T pt="Vários leitores" en="Several readers" />, <T pt="competem pela mesma mensagem" en="compete for the same message" />, <T pt="cada grupo lê tudo, independente dos outros" en="each group reads everything, independent of the others" />],
            [<T pt="Ordem" en="Order" />, <T pt="em geral sem garantia (ou FIFO com limite de vazão)" en="usually none (or FIFO with a throughput cap)" />, <T pt="garantida por partição" en="guaranteed per partition" />],
            [<T pt="Reprocessar" en="Replay" />, <T pt="não (a mensagem já foi)" en="no (the message is gone)" />, <T pt="sim, até o fim da retenção" en="yes, until retention ends" />],
            [<T pt="Operação" en="Operations" />, <T pt="simples, quase nada para configurar" en="simple, almost nothing to configure" />, <T pt="um cluster para cuidar (ou um serviço gerenciado)" en="a cluster to look after (or a managed service)" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Quando <em>não</em> usar: um app pequeno com um produtor e um consumidor, ou só "rodar este job depois", fica mais simples com SQS ou uma tabela de jobs no Postgres. Kafka vale quando há <strong>vários consumidores do mesmo fato</strong>, volume alto, ou necessidade de reler o histórico.</>} en={<>When <em>not</em> to use it: a small app with one producer and one consumer, or just "run this job later", is simpler with SQS or a jobs table in Postgres. Kafka pays off when there are <strong>several consumers of the same fact</strong>, high volume, or a need to reread history.</>} /></Callout>
      </Section>

      <Section id="glossary" title={<T pt="Vocabulário" en="Vocabulary" />}>
        <p><T pt="Os termos que aparecem em toda conversa, painel e mensagem de erro do Kafka. Cada um é detalhado nas seções seguintes." en="The terms that show up in every Kafka conversation, dashboard and error message. Each one is detailed in the sections below." /></p>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<T pt="Mensagem (record)" en="Message (record)" />, <T pt="um evento: chave, valor, headers, timestamp e offset" en="one event: key, value, headers, timestamp and offset" />],
            [<T pt="Tópico" en="Topic" />, <T pt={<>um nome para um fluxo de eventos do mesmo assunto (<code>orders</code>)</>} en={<>a name for a stream of events about one subject (<code>orders</code>)</>} />],
            [<T pt="Partição" en="Partition" />, <T pt="um pedaço do tópico: um log separado, ordenado, que mora num broker; a unidade de ordem, paralelismo e replicação" en="a slice of the topic: a separate, ordered log living on one broker; the unit of order, parallelism and replication" />],
            [<strong>Offset</strong>, <T pt="a posição de uma mensagem dentro da partição (0, 1, 2…). Sempre cresce, nunca se repete, e só tem sentido junto com a partição" en="a message's position inside its partition (0, 1, 2…). Always grows, never repeats, and only means something together with the partition" />],
            [<T pt="Offset commitado" en="Committed offset" />, <T pt={<>o próximo offset que um <em>grupo</em> vai ler numa partição; guardado em <code>__consumer_offsets</code>. É o "marcador de página" do grupo</>} en={<>the next offset a <em>group</em> will read in a partition; stored in <code>__consumer_offsets</code>. The group's "bookmark"</>} />],
            [<T pt="Log-end offset" en="Log-end offset" />, <T pt="o offset que a próxima mensagem escrita na partição vai receber" en="the offset the next message written to the partition will get" />],
            [<T pt="High watermark" en="High watermark" />, <T pt="até onde a partição está replicada em todo o ISR; consumidores só leem até aqui, então nunca veem algo que poderia sumir numa falha" en="how far the partition is replicated across the whole ISR; consumers only read up to here, so they never see something a failure could undo" />],
            [<strong>Consumer lag</strong>, <T pt={<>log-end offset menos offset commitado, por partição: quantas mensagens o grupo ainda não processou. Ex.: log-end 1840, commitado 1834, lag 6. Lag crescendo sem parar = consumidor mais lento que o produtor</>} en={<>log-end offset minus committed offset, per partition: how many messages the group has not processed yet. E.g. log-end 1840, committed 1834, lag 6. Lag that keeps growing = consumer slower than the producer</>} />],
            [<T pt="Retenção" en="Retention" />, <T pt={<>por quanto tempo (ou até que tamanho) as mensagens ficam: <code>retention.ms</code>, padrão 7 dias. Ler não apaga</>} en={<>how long (or up to what size) messages are kept: <code>retention.ms</code>, 7 days by default. Reading does not delete</>} />],
            [<T pt="Segmento" en="Segment" />, <T pt="o arquivo em disco onde a partição é gravada; a retenção apaga segmentos inteiros, os mais antigos primeiro" en="the file on disk the partition is written to; retention deletes whole segments, oldest first" />],
            [<T pt="Broker" en="Broker" />, <T pt="um servidor Kafka; um cluster é um conjunto deles" en="a Kafka server; a cluster is a set of them" />],
            [<strong><T pt="Fator de replicação (RF)" en="Replication factor (RF)" /></strong>, <T pt="quantas cópias de cada partição existem, em brokers diferentes. RF=3: uma líder e duas seguidoras" en="how many copies of each partition exist, on different brokers. RF=3: one leader and two followers" />],
            [<T pt="Líder / seguidora" en="Leader / follower" />, <T pt="a líder recebe as escritas (e, por padrão, as leituras); as seguidoras copiam a líder" en="the leader takes writes (and, by default, reads); followers copy the leader" />],
            [<T pt="ISR (in-sync replicas)" en="ISR (in-sync replicas)" />, <T pt="as réplicas em dia com a líder; só elas podem virar líder" en="the replicas caught up with the leader; only they can become leader" />],
            [<code>min.insync.replicas</code>, <T pt={<>quantas réplicas do ISR precisam gravar para uma escrita com <code>acks=all</code> ser aceita</>} en={<>how many ISR replicas must write for an <code>acks=all</code> write to be accepted</>} />],
            [<code>acks</code>, <T pt={<>quantas confirmações o produtor espera: <code>0</code> nenhuma, <code>1</code> só a líder, <code>all</code> todo o ISR</>} en={<>how many acknowledgements the producer waits for: <code>0</code> none, <code>1</code> the leader only, <code>all</code> the whole ISR</>} />],
            [<T pt="Produtor / consumidor" en="Producer / consumer" />, <T pt="a biblioteca que escreve / lê mensagens" en="the library that writes / reads messages" />],
            [<T pt="Grupo de consumo" en="Consumer group" />, <T pt={<>consumidores com o mesmo <code>group.id</code>, que dividem as partições entre si</>} en={<>consumers with the same <code>group.id</code>, splitting the partitions among themselves</>} />],
            [<T pt="Rebalance" en="Rebalance" />, <T pt="a redistribuição de partições quando alguém entra ou sai do grupo" en="the redistribution of partitions when someone joins or leaves the group" />],
            [<T pt="Controller / KRaft" en="Controller / KRaft" />, <T pt="os nós que guardam os metadados e escolhem líderes, por votação (Raft); substituíram o ZooKeeper" en="the nodes that hold metadata and pick leaders, by vote (Raft); they replaced ZooKeeper" />],
            [<code>bootstrap.servers</code>, <T pt="alguns brokers para o cliente se apresentar; dali ele descobre o cluster inteiro" en="a few brokers for the client to introduce itself to; from there it discovers the whole cluster" />],
            [<T pt="DLQ (dead letter queue)" en="DLQ (dead letter queue)" />, <T pt="um tópico para onde vão as mensagens que falharam N vezes, para não travar a partição" en="a topic for messages that failed N times, so they do not block the partition" />],
            [<T pt="Chave de idempotência" en="Idempotency key" />, <T pt="um id único por evento, num header, que o consumidor usa para descartar cópias" en="a unique id per event, in a header, that the consumer uses to drop copies" />],
          ]}
        />
      </Section>

      <Section id="records" title={<T pt="Mensagens" en="Messages" />}>
        <p><T pt={<>Uma mensagem (no jargão do Kafka, um <strong>record</strong>) tem cinco partes. O Kafka não olha o conteúdo: para ele, chave e valor são só bytes. O formato (JSON, Avro, Protobuf) é um acordo entre produtor e consumidor.</>} en={<>A message (in Kafka's jargon, a <strong>record</strong>) has five parts. Kafka does not look inside: to it, key and value are just bytes. The format (JSON, Avro, Protobuf) is an agreement between producer and consumer.</>} /></p>
        <Table
          head={[<T pt="Campo" en="Field" />, <T pt="Para que serve" en="What it is for" />]}
          rows={[
            [<code>key</code>, <T pt={<>decide a partição: mesma chave, mesma partição, mesma ordem. Use o id da entidade (<code>order-42</code>). Pode ser nula</>} en={<>picks the partition: same key, same partition, same order. Use the entity id (<code>order-42</code>). May be null</>} />],
            [<code>value</code>, <T pt="o conteúdo do evento (o pedido criado, o pagamento aprovado)" en="the event's content (the created order, the approved payment)" />],
            [<code>headers</code>, <T pt={<>metadados chave/valor: <strong>a chave de idempotência</strong>, o tipo do evento, o trace id</>} en={<>key/value metadata: <strong>the idempotency key</strong>, the event type, the trace id</>} />],
            [<code>timestamp</code>, <T pt="quando foi criada (pelo produtor) ou gravada (pelo broker)" en="when it was created (by the producer) or written (by the broker)" />],
            [<code>offset</code>, <T pt="a posição na partição (0, 1, 2…), dada pelo broker; nunca se repete nem muda" en="its position in the partition (0, 1, 2…), set by the broker; never repeats or changes" />],
          ]}
        />
        <CodeBlock code={`topic:     orders
partition: 1
offset:    1834
key:       order-42
headers:   idempotency-key=0f8e2c1a-7b3d-4e59-9c11-2a6d5f0b9e47
           event-type=order.created
value:     {"orderId":42,"customerId":7,"total":1990,"currency":"BRL"}`} />
        <p><T pt={<>As mensagens ficam guardadas pela <strong>retenção</strong> do tópico, por tempo (<code>retention.ms</code>, o padrão é 7 dias) ou tamanho. Com <code>cleanup.policy=compact</code>, em vez de apagar por idade, o Kafka guarda só a última mensagem de cada chave: o tópico vira uma tabela "estado atual por id".</>} en={<>Messages are kept for the topic's <strong>retention</strong>, by time (<code>retention.ms</code>, 7 days by default) or size. With <code>cleanup.policy=compact</code>, instead of deleting by age, Kafka keeps only the latest message per key: the topic becomes a "current state per id" table.</>} /></p>
        <Callout icon="check"><T pt={<>Escreva eventos como <strong>fatos no passado</strong> (<code>order.created</code>, <code>payment.approved</code>), não como ordens (<code>send-email</code>). Um fato pode ter dez consumidores; uma ordem tem um dono, e aí talvez você quisesse uma fila.</>} en={<>Write events as <strong>facts in the past</strong> (<code>order.created</code>, <code>payment.approved</code>), not commands (<code>send-email</code>). A fact can have ten consumers; a command has one owner, and then maybe you wanted a queue.</>} /></Callout>
      </Section>

      <Section id="topics" title={<T pt="Tópicos, partições e chaves" en="Topics, partitions and keys" />}>
        <p><T pt={<>Um <strong>tópico</strong> é um nome para um fluxo de eventos do mesmo assunto (<code>orders</code>, <code>payments</code>). Cada tópico é dividido em <strong>partições</strong>: cada partição é um log separado, com seus próprios offsets, que pode morar num broker diferente. A partição é a unidade de tudo no Kafka: de ordem, de paralelismo e de replicação.</>} en={<>A <strong>topic</strong> is a name for a stream of events about one subject (<code>orders</code>, <code>payments</code>). Each topic is split into <strong>partitions</strong>: each partition is a separate log, with its own offsets, that can live on a different broker. The partition is the unit of everything in Kafka: of order, of parallelism and of replication.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="Produtores acrescentam no fim de cada partição; num grupo, cada partição é lida por um único consumidor." en="Producers append at the end of each partition; in a group, each partition is read by exactly one consumer." />}>
          <svg viewBox="0 0 700 240" role="img" aria-label="Tópico com três partições e um grupo de consumidores / Topic with three partitions and a consumer group">
            <rect x="10" y="60" width="110" height="36" rx="4" className="ln fillsoft" />
            <text x="65" y="83" className="pt" textAnchor="middle">produtor A</text>
            <text x="65" y="83" className="en" textAnchor="middle">producer A</text>
            <rect x="10" y="140" width="110" height="36" rx="4" className="ln fillsoft" />
            <text x="65" y="163" className="pt" textAnchor="middle">produtor B</text>
            <text x="65" y="163" className="en" textAnchor="middle">producer B</text>
            <rect x="160" y="20" width="330" height="190" rx="6" className="ln dash" />
            <text x="172" y="40" className="pt mut" textAnchor="start">tópico orders</text>
            <text x="172" y="40" className="en mut" textAnchor="start">topic orders</text>
            {PARTITION_ROWS.map((row) => (
              <g key={row.name}>
                <text x="172" y={row.y + 20} className="mono" textAnchor="start">{row.name}</text>
                {Array.from({ length: row.cells }, (_, offset) => (
                  <g key={offset}>
                    <rect x={205 + offset * 34} y={row.y} width="30" height="30" rx="3" className={offset === row.cells - 1 ? "brandfill" : "ln fillsoft"} />
                    <text x={220 + offset * 34} y={row.y + 20} className="mono" textAnchor="middle">{offset}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x="205" y="202" className="pt mut" textAnchor="start">offset 0 … mais novo →</text>
            <text x="205" y="202" className="en mut" textAnchor="start">offset 0 … newest →</text>
            <path d="M120 78L160 78" className="ln" />
            <path d="M153.2 74.7L160 78L153.2 81.3" className="ln" />
            <path d="M120 158L160 158" className="ln" />
            <path d="M153.2 154.7L160 158L153.2 161.3" className="ln" />
            <rect x="540" y="20" width="150" height="190" rx="6" className="ln dash" />
            <text x="552" y="40" className="pt mut" textAnchor="start">grupo billing</text>
            <text x="552" y="40" className="en mut" textAnchor="start">group billing</text>
            <rect x="560" y="60" width="110" height="36" rx="4" className="ln" />
            <text x="615" y="83" className="" textAnchor="middle">C1 ← P0, P1</text>
            <rect x="560" y="140" width="110" height="36" rx="4" className="ln" />
            <text x="615" y="163" className="" textAnchor="middle">C2 ← P2</text>
            <path d="M490 71L525 71L525 74L560 74" className="ln" />
            <path d="M553.2 70.7L560 74L553.2 77.3" className="ln" />
            <path d="M490 121L530 121L530 84L560 84" className="ln" />
            <path d="M553.2 80.7L560 84L553.2 87.3" className="ln" />
            <path d="M490 171L525 171L525 158L560 158" className="ln" />
            <path d="M553.2 154.7L560 158L553.2 161.3" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="A chave escolhe a partição" en="The key picks the partition" /></h3>
        <p><T pt={<>Com chave, o produtor calcula <code>hash(chave) % número_de_partições</code>: todos os eventos de <code>order-42</code> caem na mesma partição e são lidos na ordem em que foram escritos. Sem chave, o produtor espalha as mensagens (em lotes, para encher cada requisição) e não há ordem entre elas.</>} en={<>With a key, the producer computes <code>hash(key) % number_of_partitions</code>: every event for <code>order-42</code> lands in the same partition and is read in the order it was written. Without a key, the producer spreads messages (in batches, to fill each request) and there is no order between them.</>} /></p>
        <ul>
          <li><T pt={<><strong>Ordem só existe dentro da partição.</strong> Entre partições, não há ordem global. Se dois eventos precisam de ordem entre si, eles precisam da mesma chave.</>} en={<><strong>Order only exists inside a partition.</strong> Across partitions there is no global order. If two events must stay ordered, they need the same key.</>} /></li>
          <li><T pt={<><strong>Chave quente:</strong> se 80% do tráfego é de um cliente só e a chave é o id do cliente, uma partição recebe 80% da carga. Escolha uma chave com muitos valores bem distribuídos.</>} en={<><strong>Hot key:</strong> if 80% of the traffic is from one customer and the key is the customer id, one partition takes 80% of the load. Pick a key with many, evenly spread values.</>} /></li>
          <li><T pt={<><strong>Hash diferente por cliente:</strong> o cliente Java usa murmur2; o librdkafka (Node, Python, Go, .NET) usa CRC32 por padrão. Se produtores em linguagens diferentes escrevem na mesma chave, configure <code>partitioner=murmur2_random</code> no librdkafka.</>} en={<><strong>Different hash per client:</strong> the Java client uses murmur2; librdkafka (Node, Python, Go, .NET) uses CRC32 by default. If producers in different languages write the same key, set <code>partitioner=murmur2_random</code> in librdkafka.</>} /></li>
        </ul>
        <h3><T pt="Quantas partições?" en="How many partitions?" /></h3>
        <p><T pt={<>O número de partições é o <strong>limite de paralelismo</strong> de um grupo de consumo: com 6 partições, no máximo 6 consumidores do mesmo grupo trabalham ao mesmo tempo. Dá para <em>aumentar</em> depois, mas nunca diminuir, e aumentar muda o resultado de <code>hash % n</code>: chaves antigas passam a cair em outra partição e a ordem por chave quebra durante a transição.</>} en={<>The partition count is a consumer group's <strong>parallelism ceiling</strong>: with 6 partitions, at most 6 consumers of the same group work at once. You can <em>increase</em> it later, but never decrease it, and increasing it changes the result of <code>hash % n</code>: old keys start landing in another partition and per-key order breaks during the switch.</>} /></p>
        <Callout icon="check"><T pt={<>Regra prática: escolha pensando no pico de consumidores que você imagina em um ou dois anos, e prefira números com muitos divisores e múltiplos do número de brokers: <strong>6, 12 ou 24</strong> se dividem bem entre 2, 3, 4 ou 6 consumidores e entre 3 brokers. Milhares de partições por tópico só fazem sentido com volume que justifique.</>} en={<>Rule of thumb: size it for the peak number of consumers you expect in a year or two, and prefer numbers with many divisors that are multiples of the broker count: <strong>6, 12 or 24</strong> split evenly across 2, 3, 4 or 6 consumers and across 3 brokers. Thousands of partitions per topic only make sense with the volume to justify them.</>} /></Callout>
      </Section>

      <Section id="brokers" title={<T pt="Brokers, réplicas e KRaft" en="Brokers, replicas and KRaft" />}>
        <p><T pt={<>Um <strong>broker</strong> é um servidor Kafka: guarda partições em disco e atende produtores e consumidores. Um <strong>cluster</strong> é um conjunto de brokers. Cada partição tem <em>N cópias</em> (o <strong>replication factor</strong>) em brokers diferentes: uma é a <strong>líder</strong>, que recebe todas as escritas, e as outras são <strong>seguidoras</strong>, que copiam a líder.</>} en={<>A <strong>broker</strong> is a Kafka server: it stores partitions on disk and serves producers and consumers. A <strong>cluster</strong> is a set of brokers. Each partition has <em>N copies</em> (the <strong>replication factor</strong>) on different brokers: one is the <strong>leader</strong>, which takes all writes, and the others are <strong>followers</strong>, which copy the leader.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="Replication factor 3: cada partição tem uma líder e duas seguidoras, e as lideranças se espalham pelos brokers." en="Replication factor 3: each partition has one leader and two followers, and leadership is spread across the brokers." />}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Três brokers com réplicas de três partições / Three brokers holding replicas of three partitions">
            {BROKER_COLUMNS.map((broker, index) => (
              <g key={broker.x}>
                <rect x={broker.x} y="20" width="200" height="170" rx="6" className="ln" />
                <text x={broker.x + 100} y="44" className="" textAnchor="middle">broker {index + 1}</text>
                {["P0", "P1", "P2"].map((partition, row) => {
                  const leader = partition === broker.leads;
                  return (
                    <g key={partition}>
                      <rect x={broker.x + 20} y={62 + row * 40} width="160" height="30" rx="4" className={leader ? "brandfill" : "ln fillsoft"} />
                      <text x={broker.x + 100} y={82 + row * 40} className={leader ? "pt" : "pt mut"} textAnchor="middle">{partition} {leader ? "líder" : "seguidora"}</text>
                      <text x={broker.x + 100} y={82 + row * 40} className={leader ? "en" : "en mut"} textAnchor="middle">{partition} {leader ? "leader" : "follower"}</text>
                    </g>
                  );
                })}
              </g>
            ))}
            <text x="20" y="218" className="pt mut" textAnchor="start">Se o broker 1 cai, uma seguidora de P0 em sincronia (broker 2 ou 3) vira líder em segundos.</text>
            <text x="20" y="218" className="en mut" textAnchor="start">If broker 1 dies, an in-sync P0 follower (broker 2 or 3) becomes leader within seconds.</text>
            <text x="20" y="238" className="pt mut" textAnchor="start">Produtores e consumidores descobrem a nova líder sozinhos; nada é perdido.</text>
            <text x="20" y="238" className="en mut" textAnchor="start">Producers and consumers find the new leader on their own; nothing is lost.</text>
          </svg>
        </Diagram>
        <ul>
          <li><T pt={<><strong>ISR (in-sync replicas):</strong> as réplicas que estão em dia com a líder. Uma seguidora que fica para trás (rede lenta, disco cheio) sai do ISR e só volta quando alcançar. Só uma réplica do ISR pode virar líder.</>} en={<><strong>ISR (in-sync replicas):</strong> the replicas that are caught up with the leader. A follower that falls behind (slow network, full disk) leaves the ISR and returns only once it catches up. Only an ISR replica can become leader.</>} /></li>
          <li><T pt={<><strong>Controller e KRaft:</strong> alguém precisa decidir quem é líder de cada partição e guardar os metadados do cluster. Desde o Kafka 4.0, isso é feito pelo próprio Kafka com o protocolo <strong>KRaft</strong> (baseado em Raft), num grupo de <em>controllers</em>. O ZooKeeper, usado antes, foi removido.</>} en={<><strong>Controller and KRaft:</strong> someone has to decide who leads each partition and store the cluster's metadata. Since Kafka 4.0 this is done by Kafka itself with the <strong>KRaft</strong> protocol (based on Raft), in a group of <em>controllers</em>. ZooKeeper, used before, has been removed.</>} /></li>
          <li><T pt={<><strong>Rack awareness:</strong> com <code>broker.rack</code> configurado (na nuvem, a zona de disponibilidade), o Kafka coloca as cópias de uma partição em racks diferentes. Perder uma zona inteira não perde nenhuma partição.</>} en={<><strong>Rack awareness:</strong> with <code>broker.rack</code> set (in the cloud, the availability zone), Kafka puts a partition's copies on different racks. Losing a whole zone loses no partition.</>} /></li>
        </ul>
      </Section>

      <Section id="three" title={<T pt="Por que sempre 3" en="Why always 3" />}>
        <p><T pt={<>O número 3 aparece em três lugares do Kafka, pelo mesmo motivo: é o <strong>menor número que tolera uma falha e continua funcionando com maioria</strong>. Com 2, uma falha te obriga a escolher entre parar ou arriscar perder dados. Com 3, você não precisa escolher.</>} en={<>The number 3 shows up in three places in Kafka, for the same reason: it is the <strong>smallest number that tolerates one failure and keeps working with a majority</strong>. With 2, one failure forces you to choose between stopping and risking data loss. With 3, you do not have to choose.</>} /></p>
        <h3><T pt="1. Replication factor 3 + min.insync.replicas 2 + acks=all" en="1. Replication factor 3 + min.insync.replicas 2 + acks=all" /></h3>
        <p><T pt={<>Com <code>acks=all</code>, o produtor só recebe "ok" depois que todas as réplicas do ISR gravaram. <code>min.insync.replicas</code> diz o mínimo de réplicas no ISR para aceitar a escrita; abaixo disso, o broker recusa (<code>NotEnoughReplicas</code>) em vez de aceitar uma escrita frágil.</>} en={<>With <code>acks=all</code>, the producer only gets "ok" after every ISR replica has written. <code>min.insync.replicas</code> sets the minimum number of ISR replicas to accept a write; below it, the broker refuses (<code>NotEnoughReplicas</code>) instead of accepting a fragile write.</>} /></p>
        <Table
          head={[<T pt="Configuração" en="Setup" />, <T pt="1 broker cai" en="1 broker down" />, <T pt="Risco" en="Risk" />]}
          rows={[
            [<code>RF=1</code>, <T pt="partição fora do ar" en="partition offline" />, <T pt="disco perdido = dados perdidos" en="lost disk = lost data" />],
            [<code>RF=2, min.isr=1</code>, <T pt="continua escrevendo" en="keeps writing" />, <T pt="nesse momento só há uma cópia: se ela cair, perde dados confirmados" en="right then there is only one copy: if it dies, confirmed data is lost" />],
            [<code>RF=2, min.isr=2</code>, <T pt="para de aceitar escritas" en="stops accepting writes" />, <T pt="seguro, mas qualquer manutenção vira indisponibilidade" en="safe, but every maintenance becomes downtime" />],
            [<strong><code>RF=3, min.isr=2</code></strong>, <strong><T pt="continua escrevendo" en="keeps writing" /></strong>, <strong><T pt="toda escrita confirmada está em pelo menos 2 discos" en="every confirmed write is on at least 2 disks" /></strong>],
            [<><code>RF=3, min.isr=2</code> <T pt="(2 caem)" en="(2 down)" /></>, <T pt="para de aceitar escritas" en="stops accepting writes" />, <T pt="nenhum dado confirmado se perde; leituras seguem" en="no confirmed data is lost; reads go on" />],
          ]}
        />
        <h3><T pt="2. Três controllers no quorum KRaft" en="2. Three controllers in the KRaft quorum" /></h3>
        <p><T pt={<>O quorum de controllers decide por <strong>maioria</strong>. Com 3, a maioria é 2: um pode cair. Com 4, a maioria é 3: ainda só um pode cair, então o quarto não compra nada. Com 2, a maioria é 2: nenhum pode cair, pior que um só. Por isso quóruns são <strong>ímpares</strong>: 3 para tolerar uma falha, 5 para tolerar duas.</>} en={<>The controller quorum decides by <strong>majority</strong>. With 3, the majority is 2: one can fail. With 4, the majority is 3: still only one can fail, so the fourth buys nothing. With 2, the majority is 2: none can fail, worse than just one. That is why quorums are <strong>odd</strong>: 3 to tolerate one failure, 5 to tolerate two.</>} /></p>
        <Table
          head={[<T pt="Nós no quorum" en="Quorum nodes" />, <T pt="Maioria" en="Majority" />, <T pt="Falhas toleradas" en="Failures tolerated" />]}
          rows={[
            ["1", "1", "0"],
            ["2", "2", "0"],
            [<strong>3</strong>, <strong>2</strong>, <strong>1</strong>],
            ["4", "3", "1"],
            ["5", "3", "2"],
          ]}
        />
        <h3><T pt="3. Três zonas de disponibilidade" en="3. Three availability zones" /></h3>
        <p><T pt={<>Na nuvem, um broker (e um controller) por zona, com <code>broker.rack</code> apontando a zona. Uma zona inteira pode cair e ainda sobram 2 cópias de cada partição e 2 de 3 controllers: maioria nos dois casos.</>} en={<>In the cloud, one broker (and one controller) per zone, with <code>broker.rack</code> set to the zone. A whole zone can fail and there are still 2 copies of each partition and 2 of 3 controllers: a majority in both cases.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>O padrão de fábrica de <code>min.insync.replicas</code> é <strong>1</strong>. Com <code>RF=3</code> e <code>min.isr=1</code>, o <code>acks=all</code> pode confirmar uma escrita que está num único disco. Ajuste para 2 no broker (vale para todos os tópicos) e não deixe ninguém criar tópico com <code>RF</code> menor que 3 em produção.</>} en={<>The factory default for <code>min.insync.replicas</code> is <strong>1</strong>. With <code>RF=3</code> and <code>min.isr=1</code>, <code>acks=all</code> may confirm a write that lives on a single disk. Set it to 2 on the broker (applies to every topic) and do not let anyone create a topic with <code>RF</code> below 3 in production.</>} /></Callout>
      </Section>

      <Section id="producers" title={<T pt="Produtores" en="Producers" />}>
        <p><T pt={<>O produtor é a biblioteca no seu serviço que escreve no Kafka. Ele não manda uma mensagem por vez: junta mensagens por partição em <em>lotes</em>, comprime e envia para a líder de cada partição. As configurações que importam:</>} en={<>The producer is the library in your service that writes to Kafka. It does not send one message at a time: it groups messages per partition into <em>batches</em>, compresses them and sends them to each partition's leader. The settings that matter:</>} /></p>
        <Table
          head={[<T pt="Configuração" en="Setting" />, <T pt="Use" en="Use" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<code>acks</code>, <code>all</code>, <T pt="só confirma depois que o ISR gravou; o padrão desde o Kafka 3.0" en="confirms only after the ISR has written; the default since Kafka 3.0" />],
            [<code>enable.idempotence</code>, <code>true</code>, <T pt="o broker descarta duplicatas criadas pelos retries do próprio produtor; padrão desde o 3.0" en="the broker drops duplicates created by the producer's own retries; default since 3.0" />],
            [<><code>retries</code> / <code>delivery.timeout.ms</code></>, <T pt="padrões (infinito / 2 min)" en="defaults (infinite / 2 min)" />, <T pt="tenta de novo até o prazo total; com idempotência, sem duplicar nem reordenar" en="retries until the total deadline; with idempotence, without duplicating or reordering" />],
            [<code>linger.ms</code>, "5–20", <T pt="espera uns milissegundos para encher o lote: mais vazão, um pouco mais de latência" en="waits a few milliseconds to fill the batch: more throughput, a bit more latency" />],
            [<code>compression.type</code>, <><code>zstd</code> <T pt="ou" en="or" /> <code>lz4</code></>, <T pt="menos rede e disco; o lote vai comprimido até o consumidor" en="less network and disk; the batch stays compressed all the way to the consumer" />],
          ]}
        />
        <p><T pt={<>O <strong>produtor idempotente</strong> funciona assim: o broker dá ao produtor um id (PID) e o produtor numera cada lote por partição. Se um retry chega com um número que o broker já gravou, ele responde "ok" sem gravar de novo. Isso resolve a duplicata do <em>retry de rede</em>, e só ela: se o seu serviço reinicia e manda o evento outra vez, é um PID novo e o broker não tem como saber. Para isso existe a chave de idempotência (mais abaixo).</>} en={<>The <strong>idempotent producer</strong> works like this: the broker gives the producer an id (PID) and the producer numbers each batch per partition. If a retry arrives with a number the broker already wrote, it answers "ok" without writing again. That fixes the <em>network retry</em> duplicate, and only that one: if your service restarts and sends the event again, it is a new PID and the broker cannot know. That is what the idempotency key is for (below).</>} /></p>
        <CodeBlock code={`// npm i @confluentinc/kafka-javascript   (the maintained client; KafkaJS-style API on librdkafka)
import { KafkaJS } from '@confluentinc/kafka-javascript';

const producer = new KafkaJS.Kafka().producer({
  'bootstrap.servers': 'localhost:9092',
  'acks': 'all',
  'enable.idempotence': true,
  'compression.type': 'zstd',
  'linger.ms': 10,
  'partitioner': 'murmur2_random',      // same key -> same partition as the Java client
});
await producer.connect();

await producer.send({
  topic: 'orders',
  messages: [{
    key: 'order-42',                                   // ordering: every event of order 42 in one partition
    value: JSON.stringify({ orderId: 42, total: 1990 }),
    headers: {
      'idempotency-key': '0f8e2c1a-7b3d-4e59-9c11-2a6d5f0b9e47',   // dedupe: one per event, reused on resend
      'event-type': 'order.created',
    },
  }],
});`} />
        <Callout tone="warn" icon="alert"><T pt={<>O <code>send</code> só garante algo quando a promessa resolve. Se o processo morre antes, a mensagem pode não ter saído. Nunca dê "ok" ao usuário dizendo que o evento foi publicado sem esperar a confirmação, e não trate um <code>send</code> sem <code>await</code> como entregue.</>} en={<><code>send</code> only guarantees anything once the promise resolves. If the process dies before that, the message may never have left. Never tell the user the event was published without waiting for the acknowledgement, and do not treat an un-awaited <code>send</code> as delivered.</>} /></Callout>
      </Section>

      <Section id="consumers" title={<T pt="Consumidores e offsets" en="Consumers and offsets" />}>
        <p><T pt={<>O consumidor pede ao broker "mensagens da partição P a partir do offset X" e processa em ordem. Para lembrar onde parou, ele <strong>confirma (commit) o offset</strong> da próxima mensagem a ler; o Kafka guarda esse valor num tópico interno, <code>__consumer_offsets</code>, por grupo e partição. Se o consumidor reinicia, continua do último commit.</>} en={<>The consumer asks the broker for "messages from partition P starting at offset X" and processes them in order. To remember where it stopped, it <strong>commits the offset</strong> of the next message to read; Kafka stores that value in an internal topic, <code>__consumer_offsets</code>, per group and partition. If the consumer restarts, it continues from the last commit.</>} /></p>
        <p><T pt={<>A ordem entre <em>processar</em> e <em>commitar</em> decide o que acontece numa queda:</>} en={<>The order of <em>processing</em> and <em>committing</em> decides what happens in a crash:</>} /></p>
        <Table
          head={[<T pt="Ordem" en="Order" />, <T pt="Se cair no meio" en="If it crashes in between" />, <T pt="Resultado" en="Result" />]}
          rows={[
            [<T pt="commit, depois processa" en="commit, then process" />, <T pt="a mensagem foi marcada como lida, mas não foi processada" en="the message was marked read but never processed" />, <T pt="at-most-once: pode perder" en="at-most-once: may lose" />],
            [<strong><T pt="processa, depois commit" en="process, then commit" /></strong>, <T pt="a mensagem foi processada, mas o offset não avançou" en="the message was processed but the offset did not move" />, <strong><T pt="at-least-once: pode repetir (o padrão certo)" en="at-least-once: may repeat (the right default)" /></strong>],
          ]}
        />
        <p><T pt={<>O auto-commit (<code>enable.auto.commit=true</code>, o padrão) commita a cada 5 segundos o que já foi <em>entregue</em> ao seu código, não o que terminou de processar. Num serviço que faz trabalho assíncrono, desligue e commite à mão depois do processamento:</>} en={<>Auto-commit (<code>enable.auto.commit=true</code>, the default) commits every 5 seconds what has been <em>handed</em> to your code, not what finished processing. In a service that does async work, turn it off and commit by hand after processing:</>} /></p>
        <CodeBlock code={`import { KafkaJS } from '@confluentinc/kafka-javascript';

const consumer = new KafkaJS.Kafka().consumer({
  'bootstrap.servers': 'localhost:9092',
  'group.id': 'billing',
  'enable.auto.commit': false,
  'auto.offset.reset': 'earliest',      // a brand-new group starts from the oldest message
});
await consumer.connect();
await consumer.subscribe({ topics: ['orders'] });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    await handleOrderEvent(message);     // idempotent: see "An idempotency key, always"
    await consumer.commitOffsets([
      { topic, partition, offset: (BigInt(message.offset) + 1n).toString() },   // next to read
    ]);
  },
});`} />
        <p><T pt={<>Os três números de cada partição, como o <code>kafka-consumer-groups.sh --describe</code> mostra:</>} en={<>The three numbers per partition, as <code>kafka-consumer-groups.sh --describe</code> shows them:</>} /></p>
        <CodeBlock code={`GROUP    TOPIC   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG   CONSUMER-ID
billing  orders  0          1834            1840            6     billing-1-3f2a…
billing  orders  1          2210            2210            0     billing-1-3f2a…
billing  orders  2          1502            9877            8375  billing-2-91cd…   <- stuck or slow

# CURRENT-OFFSET = committed offset (next to read)
# LOG-END-OFFSET = offset the next written message will get
# LAG            = LOG-END-OFFSET - CURRENT-OFFSET`} />
        <ul>
          <li><T pt={<><strong>Lag</strong> é a distância entre o último offset da partição e o offset commitado do grupo. É a métrica nº 1 de um consumidor: lag crescendo = consumidor mais lento que o produtor.</>} en={<><strong>Lag</strong> is the distance between the partition's latest offset and the group's committed offset. It is a consumer's #1 metric: growing lag = consumer slower than the producer.</>} /></li>
          <li><T pt={<><strong>Mensagem envenenada:</strong> uma mensagem que sempre falha trava a partição inteira (a ordem impede pular). Depois de N tentativas, mande para um tópico <code>orders.dlq</code> (dead letter) e siga em frente.</>} en={<><strong>Poison message:</strong> a message that always fails blocks the whole partition (order forbids skipping). After N attempts, send it to an <code>orders.dlq</code> topic (dead letter) and move on.</>} /></li>
          <li><T pt={<><strong>Processamento demorado:</strong> se passar de <code>max.poll.interval.ms</code> (5 min) sem pedir mais mensagens, o Kafka acha que o consumidor morreu e entrega as partições dele a outro, que vai reprocessar. Trabalho longo vai para uma fila de jobs, não para o handler.</>} en={<><strong>Slow processing:</strong> if it goes past <code>max.poll.interval.ms</code> (5 min) without asking for more messages, Kafka assumes the consumer died and hands its partitions to another, which will reprocess them. Long work belongs in a job queue, not in the handler.</>} /></li>
        </ul>
      </Section>

      <Section id="groups" title={<T pt="Grupos: todos os tipos" en="Groups: every kind" />}>
        <p><T pt={<>"Grupo" aparece em vários lugares no Kafka. O mais importante é o <strong>grupo de consumo</strong>: consumidores com o mesmo <code>group.id</code> dividem as partições de um tópico entre si, e cada partição é lida por exatamente um membro do grupo. Grupos diferentes são independentes: cobrança e analytics leem o mesmo tópico inteiro, cada um com seus offsets.</>} en={<>"Group" shows up in several places in Kafka. The most important one is the <strong>consumer group</strong>: consumers with the same <code>group.id</code> split a topic's partitions among themselves, and each partition is read by exactly one group member. Different groups are independent: billing and analytics read the whole topic, each with its own offsets.</>} /></p>
        <Table
          head={[<T pt="Tópico com 6 partições" en="Topic with 6 partitions" />, <T pt="Resultado" en="Result" />]}
          rows={[
            [<T pt="1 consumidor no grupo" en="1 consumer in the group" />, <T pt="lê as 6 partições sozinho" en="reads all 6 partitions alone" />],
            [<T pt="3 consumidores" en="3 consumers" />, <T pt="2 partições cada" en="2 partitions each" />],
            [<T pt="6 consumidores" en="6 consumers" />, <T pt="1 partição cada: o máximo de paralelismo" en="1 partition each: maximum parallelism" />],
            [<T pt="8 consumidores" en="8 consumers" />, <T pt="6 trabalham, 2 ficam parados (servem de reserva)" en="6 work, 2 sit idle (as spares)" />],
            [<T pt="2 grupos com 3 cada" en="2 groups of 3 each" />, <T pt="cada grupo recebe todas as mensagens" en="each group gets every message" />],
          ]}
        />
        <p><T pt={<>Quando alguém entra ou sai do grupo (deploy, queda, autoscaling), acontece um <strong>rebalance</strong>: as partições são redistribuídas. Durante ele, as partições em movimento param de ser lidas, e a mensagem processada mas não commitada será lida de novo pelo novo dono. Mais um motivo para o consumidor ser idempotente.</>} en={<>When someone joins or leaves the group (deploy, crash, autoscaling), a <strong>rebalance</strong> happens: partitions are redistributed. During it, partitions on the move stop being read, and a message processed but not committed will be read again by the new owner. One more reason for the consumer to be idempotent.</>} /></p>
        <h3><T pt="Todos os tipos de grupo" en="Every kind of group" /></h3>
        <Table
          head={[<T pt="Grupo" en="Group" />, <T pt="O que é" en="What it is" />, <T pt="Quando importa" en="When it matters" />]}
          rows={[
            [<T pt="Grupo de consumo (protocolo clássico)" en="Consumer group (classic protocol)" />, <T pt="o modelo original: um membro líder calcula a divisão; um rebalance para o grupo todo (ou parte dele, com o assignor cooperativo)" en="the original model: a leader member computes the split; a rebalance stops the whole group (or part of it, with the cooperative assignor)" />, <T pt={<>clientes antigos; use <code>CooperativeStickyAssignor</code> para rebalances menores</>} en={<>older clients; use <code>CooperativeStickyAssignor</code> for smaller rebalances</>} />],
            [<T pt="Grupo de consumo (protocolo novo, KIP-848)" en="Consumer group (new protocol, KIP-848)" />, <T pt="o broker calcula a divisão e move uma partição de cada vez; quase sem pausa" en="the broker computes the split and moves one partition at a time; almost no pause" />, <T pt={<>padrão para novos projetos no Kafka 4.x: <code>group.protocol=consumer</code></>} en={<>the default for new projects on Kafka 4.x: <code>group.protocol=consumer</code></>} />],
            [<T pt="Share group (KIP-932)" en="Share group (KIP-932)" />, <T pt="semântica de fila: vários consumidores leem a mesma partição, cada mensagem tem ack individual e redelivery; sem ordem" en="queue semantics: several consumers read the same partition, each message is acked individually and redelivered; no order" />, <T pt="mais consumidores que partições, jobs independentes; chegou no 4.0 como early access, confira o status na sua versão" en="more consumers than partitions, independent jobs; arrived in 4.0 as early access, check the status in your version" />],
            [<T pt="Streams group (KIP-1071)" en="Streams group (KIP-1071)" />, <T pt="protocolo próprio de rebalance para apps Kafka Streams, gerido pelo broker" en="a rebalance protocol of its own for Kafka Streams apps, managed by the broker" />, <T pt="se você usa Kafka Streams; ainda recente" en="if you use Kafka Streams; still recent" />],
            [<T pt="Grupo de workers do Connect" en="Connect worker group" />, <T pt={<>workers do Kafka Connect com o mesmo <code>group.id</code> dividem conectores e tarefas</>} en={<>Kafka Connect workers with the same <code>group.id</code> split connectors and tasks</>} />, <T pt="ao mover dados de/para bancos e S3 sem escrever código" en="when moving data to/from databases and S3 without writing code" />],
            [<T pt="ISR" en="ISR" />, <T pt="o grupo de réplicas em dia de cada partição" en="each partition's group of caught-up replicas" />, <T pt={<>durabilidade: <code>min.insync.replicas</code></>} en={<>durability: <code>min.insync.replicas</code></>} />],
            [<T pt="Quorum de controllers (KRaft)" en="Controller quorum (KRaft)" />, <T pt="os nós que votam os metadados do cluster" en="the nodes that vote on cluster metadata" />, <T pt="sempre ímpar: 3 ou 5" en="always odd: 3 or 5" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Para deploys com menos rebalance, use <strong>static membership</strong>: dê a cada instância um <code>group.instance.id</code> fixo (o nome do pod, por exemplo). Uma instância que reinicia dentro do <code>session.timeout.ms</code> volta para as mesmas partições sem disparar rebalance.</>} en={<>For deploys with fewer rebalances, use <strong>static membership</strong>: give each instance a fixed <code>group.instance.id</code> (the pod name, for example). An instance that restarts within <code>session.timeout.ms</code> gets its same partitions back without triggering a rebalance.</>} /></Callout>
      </Section>

      <Section id="idempotency" title={<T pt="Chave de idempotência, sempre" en="An idempotency key, always" />}>
        <p><T pt={<>O Kafka entrega <strong>pelo menos uma vez</strong>. Duplicatas vêm do produtor (o serviço reinicia e reenvia), do consumidor (caiu entre processar e commitar), do rebalance e do reprocessamento proposital (voltar o offset). Nenhuma configuração do Kafka resolve todas elas. Por isso o padrão desta nota é: <strong>toda mensagem sai com uma chave de idempotência, e todo consumidor deduplica por ela</strong>. É barato no começo e caríssimo de adicionar depois. A teoria completa está em <a href="/notas/idempotency/">Idempotência</a>.</>} en={<>Kafka delivers <strong>at least once</strong>. Duplicates come from the producer (the service restarts and resends), from the consumer (it died between processing and committing), from rebalances and from deliberate replays (moving the offset back). No Kafka setting fixes all of them. So this note's default is: <strong>every message leaves with an idempotency key, and every consumer deduplicates by it</strong>. It is cheap at the start and very expensive to add later. The full theory is in <a href="/notas/idempotency/">Idempotency</a>.</>} /></p>
        <Table
          head={["", <T pt="Chave da mensagem (key)" en="Message key" />, <T pt="Chave de idempotência (header)" en="Idempotency key (header)" />]}
          rows={[
            [<T pt="Exemplo" en="Example" />, <code>order-42</code>, <code>0f8e2c1a-…</code>],
            [<T pt="Identifica" en="Identifies" />, <T pt="a entidade" en="the entity" />, <T pt="o evento (uma intenção)" en="the event (one intent)" />],
            [<T pt="Repete?" en="Repeats?" />, <T pt="sim: todos os eventos do pedido 42" en="yes: every event for order 42" />, <T pt="só nas cópias do mesmo evento" en="only in copies of the same event" />],
            [<T pt="Serve para" en="Used for" />, <T pt="partição e ordem" en="partition and order" />, <T pt="descartar duplicatas no consumidor" en="dropping duplicates in the consumer" />],
          ]}
        />
        <h3><T pt="No produtor: gere uma vez, guarde, reutilize" en="Producer side: generate once, store, reuse" /></h3>
        <p><T pt={<>A chave nasce junto com a intenção e é <strong>guardada</strong>, não gerada a cada tentativa de envio (um <code>randomUUID()</code> dentro do retry dá uma chave nova por tentativa e não protege nada). O jeito robusto é o <strong>outbox</strong>: gravar o evento numa tabela na <em>mesma transação</em> da mudança de negócio, e um processo separado publica a tabela no Kafka. O id da linha do outbox é a chave de idempotência.</>} en={<>The key is born with the intent and is <strong>stored</strong>, not generated on each send attempt (a <code>randomUUID()</code> inside the retry gives a new key per attempt and protects nothing). The robust way is the <strong>outbox</strong>: write the event to a table in the <em>same transaction</em> as the business change, and a separate process publishes the table to Kafka. The outbox row id is the idempotency key.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="O evento nasce na mesma transação do pedido; reenviar é seguro porque o consumidor deduplica pelo id." en="The event is born in the same transaction as the order; resending is safe because the consumer deduplicates by id." />}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Padrão outbox com deduplicação no consumidor / Outbox pattern with consumer-side deduplication">
            <rect x="10" y="20" width="150" height="70" rx="4" className="ln fillsoft" />
            <text x="85" y="42" className="pt" textAnchor="middle">transação</text>
            <text x="85" y="42" className="en" textAnchor="middle">transaction</text>
            <text x="85" y="62" className="mono" textAnchor="middle">INSERT orders</text>
            <text x="85" y="78" className="mono" textAnchor="middle">INSERT outbox</text>
            <rect x="200" y="37" width="110" height="36" rx="4" className="ln" />
            <text x="255" y="60" className="" textAnchor="middle">relay</text>
            <rect x="350" y="37" width="110" height="36" rx="4" className="brandfill" />
            <text x="405" y="60" className="" textAnchor="middle">Kafka</text>
            <rect x="500" y="20" width="190" height="70" rx="4" className="ln fillsoft" />
            <text x="595" y="42" className="pt" textAnchor="middle">consumidor (transação)</text>
            <text x="595" y="42" className="en" textAnchor="middle">consumer (transaction)</text>
            <text x="595" y="62" className="mono" textAnchor="middle">INSERT processed_events</text>
            <text x="595" y="78" className="mono" textAnchor="middle">+ efeito / effect</text>
            <path d="M160 55L200 55" className="ln" />
            <path d="M193.2 51.7L200 55L193.2 58.3" className="ln" />
            <path d="M310 55L350 55" className="ln" />
            <path d="M343.2 51.7L350 55L343.2 58.3" className="ln" />
            <path d="M460 55L500 55" className="ln" />
            <path d="M493.2 51.7L500 55L493.2 58.3" className="ln" />
            <text x="10" y="125" className="pt mut" textAnchor="start">O relay pode cair depois de publicar e antes de marcar "enviado": ele reenvia, com o mesmo id.</text>
            <text x="10" y="125" className="en mut" textAnchor="start">The relay may die after publishing and before marking "sent": it resends, with the same id.</text>
            <text x="10" y="145" className="pt mut" textAnchor="start">O consumidor vê o id em processed_events e só commita o offset. Efeito: exatamente uma vez.</text>
            <text x="10" y="145" className="en mut" textAnchor="start">The consumer finds the id in processed_events and just commits the offset. Effect: exactly once.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`CREATE TABLE outbox (
  id         uuid        PRIMARY KEY,          -- becomes the idempotency-key header
  topic      text        NOT NULL,
  msg_key    text        NOT NULL,             -- e.g. 'order-42'
  event_type text        NOT NULL,
  payload    jsonb       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at    timestamptz
);

-- In the request that creates the order: one transaction, two inserts
BEGIN;
INSERT INTO orders (id, customer_id, total) VALUES (42, 7, 1990);
INSERT INTO outbox (id, topic, msg_key, event_type, payload)
VALUES (gen_random_uuid(), 'orders', 'order-42', 'order.created', '{"orderId":42,"total":1990}');
COMMIT;`} />
        <CodeBlock code={`// Relay: publish pending rows, mark them sent. Crashing between the two only causes a resend.
async function relayOnce() {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const { rows } = await tx.query(
      \`SELECT * FROM outbox WHERE sent_at IS NULL
        ORDER BY created_at LIMIT 100 FOR UPDATE SKIP LOCKED\`);   // several relays can run safely
    if (rows.length > 0) {
      await producer.send({
        topic: 'orders',
        messages: rows.map((row) => ({
          key: row.msg_key,
          value: JSON.stringify(row.payload),
          headers: { 'idempotency-key': row.id, 'event-type': row.event_type },
        })),
      });
      await tx.query('UPDATE outbox SET sent_at = now() WHERE id = ANY($1)', [rows.map((r) => r.id)]);
    }
    await tx.query('COMMIT');
  } catch (err) {
    await tx.query('ROLLBACK');
    throw err;
  } finally {
    tx.release();
  }
}`} />
        <p><T pt={<>Em vez de um relay que consulta a tabela, dá para usar CDC (Debezium lendo o WAL do Postgres e publicando no Kafka). O princípio é o mesmo: o evento só existe se a transação de negócio fez commit.</>} en={<>Instead of a relay polling the table, you can use CDC (Debezium reading Postgres' WAL and publishing to Kafka). The principle is the same: the event exists only if the business transaction committed.</>} /></p>
        <h3><T pt="No consumidor: deduplicar na mesma transação do efeito" en="Consumer side: deduplicate in the same transaction as the effect" /></h3>
        <CodeBlock code={`CREATE TABLE processed_events (
  consumer_group text        NOT NULL,         -- billing and email dedupe separately
  event_id       uuid        NOT NULL,
  processed_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (consumer_group, event_id)
);`} />
        <CodeBlock code={`async function handleOrderEvent(message: KafkaJS.KafkaMessage) {
  const eventId = message.headers?.['idempotency-key']?.toString();
  if (!eventId) throw new Error('Message without idempotency-key header');   // goes to the DLQ

  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const claim = await tx.query(
      \`INSERT INTO processed_events (consumer_group, event_id) VALUES ('billing', $1)
       ON CONFLICT DO NOTHING\`, [eventId]);
    if (claim.rowCount === 0) { await tx.query('COMMIT'); return; }   // duplicate: skip, offset gets committed

    const order = JSON.parse(message.value!.toString());
    await tx.query('INSERT INTO invoices (order_id, total) VALUES ($1, $2)', [order.orderId, order.total]);
    await tx.query('COMMIT');
  } catch (err) {
    await tx.query('ROLLBACK');      // nothing recorded: the redelivery will really run
    throw err;
  } finally {
    tx.release();
  }
}`} />
        <Callout tone="warn" icon="alert"><T pt={<>Se o efeito é externo (chamar um gateway de pagamento, mandar e-mail), a transação local não desfaz a chamada. Repasse a <em>mesma</em> chave ao provedor (a Stripe aceita <code>Idempotency-Key</code>) ou registre o estado <code>processing</code> antes e <code>done</code> depois. Veja <a href="/notas/payment-gateways/">Pagamentos</a>.</>} en={<>If the effect is external (calling a payment gateway, sending an email), the local transaction cannot undo the call. Forward the <em>same</em> key to the provider (Stripe accepts <code>Idempotency-Key</code>) or record a <code>processing</code> state before and <code>done</code> after. See <a href="/notas/payment-gateways/">Payments</a>.</>} /></Callout>
        <ul>
          <li><T pt={<>Mensagem <strong>sem</strong> chave de idempotência é erro de contrato: rejeite (DLQ), não processe "na sorte".</>} en={<>A message <strong>without</strong> an idempotency key is a contract error: reject it (DLQ), do not process it "and hope".</>} /></li>
          <li><T pt={<>Guarde <code>processed_events</code> por mais tempo que a retenção do tópico (se o tópico guarda 7 dias, guarde 14): um replay do tópico inteiro ainda deve ser deduplicado.</>} en={<>Keep <code>processed_events</code> longer than the topic's retention (if the topic keeps 7 days, keep 14): a replay of the whole topic must still be deduplicated.</>} /></li>
          <li><T pt={<>Quando o efeito é naturalmente idempotente (um <code>UPSERT</code> do estado atual, um <code>SET status = 'paid'</code>), a tabela de dedupe é dispensável, mas a chave continua na mensagem: custa nada e vale no próximo consumidor.</>} en={<>When the effect is naturally idempotent (an <code>UPSERT</code> of current state, a <code>SET status = 'paid'</code>), the dedupe table is optional, but the key still goes in the message: it costs nothing and pays off in the next consumer.</>} /></li>
        </ul>
      </Section>

      <Section id="delivery" title={<T pt="Garantias de entrega" en="Delivery guarantees" />}>
        <Table
          head={[<T pt="Garantia" en="Guarantee" />, <T pt="Como se consegue" en="How you get it" />, <T pt="Quando usar" en="When to use" />]}
          rows={[
            [<T pt="no máximo uma vez" en="at most once" />, <T pt={<>commit antes de processar, <code>acks=0</code> ou <code>1</code></>} en={<>commit before processing, <code>acks=0</code> or <code>1</code></>} />, <T pt="métricas descartáveis, logs de debug" en="throwaway metrics, debug logs" />],
            [<strong><T pt="pelo menos uma vez" en="at least once" /></strong>, <T pt={<><code>acks=all</code>, idempotência ligada, commit depois de processar</>} en={<><code>acks=all</code>, idempotence on, commit after processing</>} />, <strong><T pt="o padrão; com consumidor idempotente, vira efeito único" en="the default; with an idempotent consumer, it becomes a single effect" /></strong>],
            [<T pt="exatamente uma vez (EOS)" en="exactly once (EOS)" />, <T pt={<>produtor transacional (<code>transactional.id</code>) + consumidores com <code>isolation.level=read_committed</code></>} en={<>transactional producer (<code>transactional.id</code>) + consumers with <code>isolation.level=read_committed</code></>} />, <T pt="ler de um tópico, transformar e escrever em outro (Kafka Streams)" en="read from one topic, transform and write to another (Kafka Streams)" />],
          ]}
        />
        <Callout icon="check"><T pt={<>O "exactly once" do Kafka vale <strong>de Kafka para Kafka</strong>: o offset lido e as mensagens escritas são commitados juntos. No momento em que o efeito sai do Kafka (um banco, uma API, um e-mail), você volta ao "pelo menos uma vez" e precisa da chave de idempotência do mesmo jeito.</>} en={<>Kafka's "exactly once" holds <strong>from Kafka to Kafka</strong>: the offset read and the messages written are committed together. The moment the effect leaves Kafka (a database, an API, an email), you are back to "at least once" and need the idempotency key all the same.</>} /></Callout>
      </Section>

      <Section id="prod" title={<T pt="Em produção" en="In production" />}>
        <h3><T pt="Configuração base" en="Baseline settings" /></h3>
        <CodeBlock code={`# Broker / cluster
default.replication.factor=3
min.insync.replicas=2
unclean.leader.election.enable=false      # never elect an out-of-sync replica (would lose data)
auto.create.topics.enable=false           # topics are created on purpose, with Terraform or a script
broker.rack=<availability zone>           # copies spread across zones

# Producer
acks=all
enable.idempotence=true
compression.type=zstd
linger.ms=10

# Consumer
enable.auto.commit=false                  # commit after processing
group.protocol=consumer                   # new rebalance protocol (Kafka 4.x)
group.instance.id=<pod name>              # static membership: fewer rebalances on deploy`} />
        <Table
          head={[<T pt="Ponto" en="Point" />, <T pt="Prática" en="Practice" />]}
          rows={[
            [<T pt="Onde rodar" en="Where to run" />, <T pt="gerenciado (Amazon MSK, Confluent Cloud, Aiven) a menos que você tenha gente para operar; Redpanda fala o mesmo protocolo se quiser algo mais leve" en="managed (Amazon MSK, Confluent Cloud, Aiven) unless you have people to run it; Redpanda speaks the same protocol if you want something lighter" />],
            [<T pt="Contrato das mensagens" en="Message contract" />, <T pt="schema registry com Avro ou Protobuf, ou pelo menos JSON Schema versionado; mudanças só compatíveis (campo novo opcional, nunca renomear)" en="a schema registry with Avro or Protobuf, or at least versioned JSON Schema; only compatible changes (new optional field, never rename)" />],
            [<T pt="Nomes de tópicos" en="Topic names" />, <T pt={<>um padrão e nada criado à mão: <code>&lt;domínio&gt;.&lt;evento&gt;</code>, com partições, RF e retenção no código (Terraform)</>} en={<>one pattern and nothing created by hand: <code>&lt;domain&gt;.&lt;event&gt;</code>, with partitions, RF and retention in code (Terraform)</>} />],
            [<T pt="Métricas" en="Metrics" />, <T pt="lag por grupo, partições sub-replicadas (UnderReplicatedPartitions > 0), partições offline, tamanho em disco, erros de produção" en="lag per group, under-replicated partitions (UnderReplicatedPartitions > 0), offline partitions, disk size, produce errors" />],
            [<T pt="Segurança" en="Security" />, <T pt="TLS no tráfego, SASL (SCRAM ou IAM no MSK) para autenticar, ACLs por tópico e grupo: cada serviço só lê e escreve o que é dele" en="TLS in transit, SASL (SCRAM or IAM on MSK) to authenticate, ACLs per topic and group: each service reads and writes only its own" />],
            [<T pt="Dados sensíveis" en="Sensitive data" />, <T pt="o log guarda tudo por dias e é relido; não publique senhas e evite dados pessoais desnecessários (LGPD: apagar é difícil num log)" en="the log keeps everything for days and is reread; do not publish passwords and avoid unneeded personal data (GDPR/LGPD: deleting from a log is hard)" />],
          ]}
        />
        <h3><T pt="Checklist antes de subir" en="Pre-release checklist" /></h3>
        <ul>
          <li><T pt={<>3 brokers em 3 zonas, 3 controllers, <code>RF=3</code>, <code>min.insync.replicas=2</code>, <code>acks=all</code>.</>} en={<>3 brokers in 3 zones, 3 controllers, <code>RF=3</code>, <code>min.insync.replicas=2</code>, <code>acks=all</code>.</>} /></li>
          <li><T pt="Toda mensagem tem chave de idempotência no header; todo consumidor deduplica por ela na transação do efeito." en="Every message carries an idempotency key header; every consumer deduplicates by it in the effect's transaction." /></li>
          <li><T pt="Eventos de negócio saem por outbox (ou CDC), nunca com um send solto depois do commit." en="Business events go out through an outbox (or CDC), never with a loose send after the commit." /></li>
          <li><T pt="A chave da mensagem garante a ordem que o negócio precisa e não concentra carga numa partição." en="The message key gives the order the business needs and does not pile load onto one partition." /></li>
          <li><T pt="Commit manual depois de processar, DLQ para mensagens envenenadas, alerta de lag." en="Manual commit after processing, a DLQ for poison messages, a lag alert." /></li>
          <li><T pt="Testado: mandar o mesmo evento duas vezes e reiniciar o consumidor no meio produz um efeito só." en="Tested: sending the same event twice and restarting the consumer halfway produces a single effect." /></li>
        </ul>
      </Section>

      <Section id="lab" title={<T pt="Exercício: um Kafka no Docker" en="Exercise: Kafka in Docker" />}>
        <p><T pt={<>Pré-requisito: Docker. Você vai subir um Kafka de um nó só (em modo KRaft), criar um tópico com 3 partições, ver a chave escolhendo a partição e ver um grupo dividindo o trabalho. Um nó só serve para aprender; por isso aqui o <code>RF</code> é 1.</>} en={<>Prerequisite: Docker. You will start a single-node Kafka (in KRaft mode), create a topic with 3 partitions, watch the key pick the partition and watch a group split the work. One node is only for learning; that is why <code>RF</code> is 1 here.</>} /></p>
        <CodeBlock code={`docker run -d --name kafka -p 9092:9092 apache/kafka:4.1.0

docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \\
  --create --topic orders --partitions 3 --replication-factor 1

docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \\
  --describe --topic orders          # 3 partitions, leader = broker 1`} />
        <p><T pt={<>Num terminal, um produtor que lê <code>chave:valor</code>. Escreva algumas linhas repetindo chaves (<code>order-1:created</code>, <code>order-2:created</code>, <code>order-1:paid</code>…):</>} en={<>In one terminal, a producer that reads <code>key:value</code>. Type a few lines, repeating keys (<code>order-1:created</code>, <code>order-2:created</code>, <code>order-1:paid</code>…):</>} /></p>
        <CodeBlock code={`docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 \\
  --topic orders --property parse.key=true --property key.separator=:`} />
        <p><T pt="Em outros dois terminais, dois consumidores do mesmo grupo:" en="In two other terminals, two consumers in the same group:" /></p>
        <CodeBlock code={`docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \\
  --topic orders --group billing --from-beginning \\
  --property print.key=true --property print.partition=true`} />
        <p><T pt={<><strong>O que observar:</strong> todas as mensagens de <code>order-1</code> mostram a mesma partição e chegam em ordem; cada consumidor recebe só as partições dele. Feche um consumidor: depois do rebalance, o outro assume tudo. Abra um terceiro com <code>--group analytics</code>: ele recebe todas as mensagens desde o início, sem afetar o grupo <code>billing</code>.</>} en={<><strong>What to watch:</strong> every <code>order-1</code> message shows the same partition and arrives in order; each consumer gets only its own partitions. Close one consumer: after the rebalance, the other takes everything. Open a third with <code>--group analytics</code>: it gets every message from the start, without affecting the <code>billing</code> group.</>} /></p>
        <CodeBlock code={`# Who reads what, and how far behind (LAG) each partition is
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
  --describe --group billing

# Replay: stop the billing consumers, then move the group back to the start
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
  --group billing --topic orders --reset-offsets --to-earliest --execute

docker rm -f kafka   # cleanup`} />
        <p><T pt={<>O replay é exatamente a duplicata da seção de idempotência: depois do <code>--reset-offsets</code>, o grupo <code>billing</code> recebe de novo tudo o que já processou. Com <code>processed_events</code>, nada é cobrado duas vezes.</>} en={<>The replay is exactly the duplicate from the idempotency section: after <code>--reset-offsets</code>, the <code>billing</code> group gets everything it already processed again. With <code>processed_events</code>, nothing is charged twice.</>} /></p>
      </Section>

      <Section id="cheat-kf" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="ordem entre eventos da mesma entidade" en="order between events of one entity" />, <T pt="a mesma chave de mensagem (id da entidade)" en="the same message key (entity id)" />],
            [<T pt="mais paralelismo no consumo" en="more consumer parallelism" />, <T pt="mais partições e mais consumidores no grupo" en="more partitions and more consumers in the group" />],
            [<T pt="dois sistemas lendo tudo" en="two systems reading everything" />, <T pt={<>dois <code>group.id</code> diferentes</>} en={<>two different <code>group.id</code>s</>} />],
            [<T pt="não perder escrita confirmada" en="never lose a confirmed write" />, <T pt={<><code>RF=3</code>, <code>min.insync.replicas=2</code>, <code>acks=all</code></>} en={<><code>RF=3</code>, <code>min.insync.replicas=2</code>, <code>acks=all</code></>} />],
            [<T pt="sem duplicata de retry de rede" en="no network-retry duplicates" />, <T pt={<><code>enable.idempotence=true</code> (padrão)</>} en={<><code>enable.idempotence=true</code> (default)</>} />],
            [<T pt="efeito único de verdade" en="a truly single effect" />, <T pt={<>header <code>idempotency-key</code> + <code>processed_events</code> na transação do efeito</>} en={<><code>idempotency-key</code> header + <code>processed_events</code> in the effect's transaction</>} />],
            [<T pt="publicar só se o commit aconteceu" en="publish only if the commit happened" />, <T pt="outbox ou CDC (Debezium)" en="outbox or CDC (Debezium)" />],
            [<T pt="reprocessar" en="reprocess" />, <code>kafka-consumer-groups.sh --reset-offsets</code>],
            [<T pt="semântica de fila, sem ordem" en="queue semantics, no order" />, <T pt="share groups (Kafka 4.x) ou SQS" en="share groups (Kafka 4.x) or SQS" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
          [<T pt="Qual a diferença entre ler de uma fila e ler de um tópico do Kafka?" en="What is the difference between reading from a queue and reading from a Kafka topic?" />, <T pt="Na fila, a mensagem some depois do ack. No Kafka, ela fica no log; o consumidor só avança o offset do seu grupo, e outros grupos (ou um replay) leem de novo." en="In a queue, the message is gone after the ack. In Kafka it stays in the log; the consumer only advances its group's offset, and other groups (or a replay) read it again." />],
          [<T pt="Por que o Kafka só garante ordem dentro de uma partição?" en="Why does Kafka only guarantee order inside a partition?" />, <T pt="Cada partição é um log independente, em brokers possivelmente diferentes. Para eventos ficarem em ordem, eles precisam da mesma chave e, portanto, da mesma partição." en="Each partition is an independent log, possibly on different brokers. For events to stay ordered, they need the same key and therefore the same partition." />],
          [<T pt="O que acontece com 8 consumidores num grupo e um tópico de 6 partições?" en="What happens with 8 consumers in a group and a 6-partition topic?" />, <T pt="6 trabalham com uma partição cada e 2 ficam parados, de reserva. Partições são o teto de paralelismo do grupo." en="6 work with one partition each and 2 sit idle, as spares. Partitions are the group's parallelism ceiling." />],
          [<T pt="Por que RF=3 com min.insync.replicas=2 e não RF=2?" en="Why RF=3 with min.insync.replicas=2 and not RF=2?" />, <T pt="Com RF=2 uma falha obriga a escolher entre parar as escritas (min.isr=2) ou aceitar escritas em um disco só (min.isr=1). Com RF=3 e min.isr=2, um broker pode cair e toda escrita confirmada continua em pelo menos dois discos." en="With RF=2 one failure forces a choice between stopping writes (min.isr=2) and accepting writes on a single disk (min.isr=1). With RF=3 and min.isr=2, one broker can fail and every confirmed write is still on at least two disks." />],
          [<T pt="Por que um quorum de 4 controllers não é melhor que um de 3?" en="Why is a quorum of 4 controllers no better than one of 3?" />, <T pt="A maioria de 4 é 3, então também só tolera uma falha, com uma máquina a mais para manter. Quóruns são ímpares: 3 tolera uma, 5 tolera duas." en="The majority of 4 is 3, so it also tolerates only one failure, with one more machine to run. Quorums are odd: 3 tolerates one, 5 tolerates two." />],
          [<T pt="Se o produtor já é idempotente, por que colocar uma chave de idempotência na mensagem?" en="If the producer is already idempotent, why put an idempotency key in the message?" />, <T pt="O produtor idempotente só elimina duplicatas de retry de rede dentro da mesma sessão. Reinício do serviço, reenvio do outbox, queda do consumidor antes do commit, rebalance e replay geram duplicatas que só o consumidor, olhando a chave, consegue descartar." en="The idempotent producer only removes network-retry duplicates within one session. Service restarts, outbox resends, a consumer dying before its commit, rebalances and replays all create duplicates that only the consumer, looking at the key, can drop." />],
          [<T pt="Qual a diferença entre a chave da mensagem e a chave de idempotência?" en="What is the difference between the message key and the idempotency key?" />, <T pt="A chave da mensagem identifica a entidade (order-42) e decide partição e ordem; repete em todos os eventos do pedido. A chave de idempotência identifica um evento e só repete nas cópias dele." en="The message key identifies the entity (order-42) and decides partition and order; it repeats across all the order's events. The idempotency key identifies one event and only repeats in its copies." />],
          [<T pt="Por que commitar o offset depois de processar, e não antes?" en="Why commit the offset after processing, not before?" />, <T pt="Commitar antes perde a mensagem se o consumidor cair no meio (at-most-once). Commitar depois pode repetir (at-least-once), e a repetição é resolvida pela deduplicação." en="Committing first loses the message if the consumer dies halfway (at-most-once). Committing after may repeat (at-least-once), and the repeat is handled by deduplication." />],
          [<T pt="O exactly-once do Kafka dispensa a idempotência no consumidor que grava no Postgres?" en="Does Kafka's exactly-once make consumer idempotency unnecessary when writing to Postgres?" />, <T pt="Não. EOS vale de Kafka para Kafka. Um efeito num banco ou API externa está fora da transação do Kafka e volta a ser pelo menos uma vez." en="No. EOS holds from Kafka to Kafka. An effect in a database or external API is outside Kafka's transaction and is back to at least once." />],
        ]} />
      </Section>
      <Sources
        links={[
          { label: "Apache Kafka: Documentation", href: "https://kafka.apache.org/documentation/" },
          { label: "Apache Kafka: Design (replication, ISR, delivery semantics)", href: "https://kafka.apache.org/documentation/#design" },
          { label: "KIP-848: The Next Generation of the Consumer Rebalance Protocol", href: "https://cwiki.apache.org/confluence/display/KAFKA/KIP-848%3A+The+Next+Generation+of+the+Consumer+Rebalance+Protocol" },
          { label: "KIP-932: Queues for Kafka (share groups)", href: "https://cwiki.apache.org/confluence/display/KAFKA/KIP-932%3A+Queues+for+Kafka" },
          { label: "KIP-500: Replace ZooKeeper with a Self-Managed Metadata Quorum", href: "https://cwiki.apache.org/confluence/display/KAFKA/KIP-500%3A+Replace+ZooKeeper+with+a+Self-Managed+Metadata+Quorum" },
          { label: "Confluent: Kafka JavaScript client", href: "https://github.com/confluentinc/confluent-kafka-javascript" },
          { label: "microservices.io: Transactional outbox", href: "https://microservices.io/patterns/data/transactional-outbox.html" },
        ]}
      />
    </>
  );
}
