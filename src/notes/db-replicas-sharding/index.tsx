import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-replicas-sharding",
  title: { en: "Databases: reads, writes, replicas and sharding", pt: "Bancos de dados: leitura, escrita, réplicas e sharding" },
  seo: {
    title: { en: "Databases: reads, writes, replicas and sharding (Postgres and AWS)", pt: "Bancos de dados: leitura, escrita, réplicas e sharding (Postgres e AWS)" },
    description: { en: "How to scale a database beyond one server: the WAL, read replicas, replication lag and read-your-writes, Multi-AZ, Aurora, RDS Proxy and sharding (Citus, Aurora Limitless), with a Postgres replication lab in Docker and a request traced end to end.", pt: "Como escalar um banco além de um servidor: o WAL, réplicas de leitura, lag de replicação e read-your-writes, Multi-AZ, Aurora, RDS Proxy e sharding (Citus, Aurora Limitless), com um laboratório de replicação do Postgres no Docker e uma requisição ponta a ponta." },
  },
  summary: "how the WAL feeds replicas, replication lag and read-your-writes, hot standby conflicts, RDS read replicas, Multi-AZ, Aurora, RDS Proxy, partitioning vs sharding (Citus, Aurora Limitless), with a Postgres replication lab in Docker and a request traced end to end, based on the Postgres and AWS docs.",
  kicker: { en: "Databases", pt: "Bancos de dados" },
  heroTitle: { en: <>Reads, writes, replicas and sharding: <em>scaling a database past one server.</em></>, pt: <>Leitura, escrita, réplicas e sharding: <em>escalar um banco além de um servidor.</em></> },
  heroLede: { en: "How the WAL feeds replicas, what replication lag breaks and how to live with it, what AWS offers (RDS, Multi-AZ, Aurora, Proxy), when to shard, and one request traced through a real primary and replica in Docker.", pt: "Como o WAL alimenta as réplicas, o que o lag de replicação quebra e como conviver com ele, o que a AWS oferece (RDS, Multi-AZ, Aurora, Proxy), quando fazer shard, e uma requisição rastreada por um primário e uma réplica de verdade no Docker." },
  published: "2026-10-26",
  updated: "2026-10-26",
  toc: [
    {
      items: [
        { id: "map", title: <T pt="O problema e a escada" en="The problem and the ladder" /> },
        { id: "replication", title: <T pt="1. Primário, WAL e réplicas" en="1. Primary, WAL and replicas" /> },
        { id: "replicas", title: <T pt="2. Lidar com réplicas" en="2. Living with replicas" /> },
        { id: "aws", title: <T pt="3. Na AWS" en="3. On AWS" /> },
        { id: "sharding", title: <T pt="4. Sharding" en="4. Sharding" /> },
        { id: "e2e", title: <T pt="5. Uma requisição ponta a ponta" en="5. One request, end to end" /> },
        { id: "lab", title: <T pt="6. Laboratório em Docker" en="6. Docker lab" /> },
        { id: "cheat", title: <T pt="7. Decisão e checklist" en="7. Decision and checklist" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={<T pt="O problema e a escada" en="The problem and the ladder" />}>
        <p><T pt={<>Um banco em um servidor só cresce até o limite da máquina: CPU, memória, disco, conexões. Depois disso há duas perguntas diferentes, e elas têm respostas diferentes. <b>Leitura demais?</b> Réplicas copiam os dados para outras máquinas que só respondem consultas. <b>Escrita demais, ou dados demais para um disco?</b> Só dividir os dados entre servidores (sharding) resolve, porque toda escrita de uma linha ainda passa por um único primário.</>} en={<>A database on one server grows until the machine's limit: CPU, memory, disk, connections. Past that there are two different questions with different answers. <b>Too many reads?</b> Replicas copy the data to other machines that only answer queries. <b>Too many writes, or too much data for one disk?</b> Only splitting the data across servers (sharding) solves it, because every write to a row still goes through a single primary.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="Cada degrau à direita custa mais complexidade. Réplicas e sharding resolvem problemas diferentes." en="Each step to the right costs more complexity. Replicas and sharding solve different problems." />}>
          <svg viewBox="0 0 700 140" role="img" aria-label="A escada de escala de um banco / The database scaling ladder">
            <rect x="4" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="56.0" y="56.0" className="pt" textAnchor="middle">Índices</text>
            <text x="56.0" y="56.0" className="en" textAnchor="middle">Indexes</text>
            <text x="56.0" y="73.0" className="mut pt" textAnchor="middle">query lenta</text>
            <text x="56.0" y="73.0" className="mut en" textAnchor="middle">slow query</text>
            <path d="M108 59L120 59" className="ln" />
            <path d="M112.8 62.5L120 59L112.8 55.5" className="ln" />
            <rect x="120" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="172.0" y="56.0" className="pt" textAnchor="middle">Pool</text>
            <text x="172.0" y="56.0" className="en" textAnchor="middle">Pooling</text>
            <text x="172.0" y="73.0" className="mut pt" textAnchor="middle">conexões</text>
            <text x="172.0" y="73.0" className="mut en" textAnchor="middle">connections</text>
            <path d="M224 59L236 59" className="ln" />
            <path d="M228.8 62.5L236 59L228.8 55.5" className="ln" />
            <rect x="236" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="288.0" y="56.0" className="pt" textAnchor="middle">Cache</text>
            <text x="288.0" y="56.0" className="en" textAnchor="middle">Cache</text>
            <text x="288.0" y="73.0" className="mut pt" textAnchor="middle">repetições</text>
            <text x="288.0" y="73.0" className="mut en" textAnchor="middle">repeats</text>
            <path d="M340 59L352 59" className="ln" />
            <path d="M344.8 62.5L352 59L344.8 55.5" className="ln" />
            <rect x="352" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="404.0" y="56.0" className="pt" textAnchor="middle">Scale up</text>
            <text x="404.0" y="56.0" className="en" textAnchor="middle">Scale up</text>
            <text x="404.0" y="73.0" className="mut pt" textAnchor="middle">mais máquina</text>
            <text x="404.0" y="73.0" className="mut en" textAnchor="middle">bigger box</text>
            <path d="M456 59L468 59" className="ln" />
            <path d="M460.8 62.5L468 59L460.8 55.5" className="ln" />
            <rect x="468" y="30" width="104" height="58" rx="4" className="ln brandfill" />
            <text x="520.0" y="56.0" className="pt" textAnchor="middle">Réplicas</text>
            <text x="520.0" y="56.0" className="en" textAnchor="middle">Replicas</text>
            <text x="520.0" y="73.0" className="mut pt" textAnchor="middle">mais leitura</text>
            <text x="520.0" y="73.0" className="mut en" textAnchor="middle">more reads</text>
            <path d="M572 59L584 59" className="ln" />
            <path d="M576.8 62.5L584 59L576.8 55.5" className="ln" />
            <rect x="584" y="30" width="104" height="58" rx="4" className="ln brandfill" />
            <text x="636.0" y="56.0" className="pt" textAnchor="middle">Sharding</text>
            <text x="636.0" y="56.0" className="en" textAnchor="middle">Sharding</text>
            <text x="636.0" y="73.0" className="mut pt" textAnchor="middle">mais escrita</text>
            <text x="636.0" y="73.0" className="mut en" textAnchor="middle">more writes</text>
            <text x="4" y="14" className="mut mono pt" textAnchor="start">barato e reversível</text>
            <text x="4" y="14" className="mut mono en" textAnchor="start">cheap and reversible</text>
            <text x="696" y="14" className="mut mono pt" textAnchor="end">caro e quase irreversível</text>
            <text x="696" y="14" className="mut mono en" textAnchor="end">costly and nearly irreversible</text>
            <path d="M4 108L696 108" className="ln dash" />
            <text x="350" y="128" className="mut pt" textAnchor="middle">suba um degrau só quando o anterior estiver esgotado e medido</text>
            <text x="350" y="128" className="mut en" textAnchor="middle">climb a step only when the previous one is exhausted and measured</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />, <T pt="Primeira ferramenta" en="First tool" />]}
          rows={[
            [<T pt="CPU alta, poucas queries muito lentas" en="High CPU, a few very slow queries" />, <T pt="Falta de índice, plano ruim" en="Missing index, bad plan" />, <T pt={<><code>EXPLAIN ANALYZE</code>, índices (veja a <a href="/notas/postgres-for-devs/">nota de Postgres</a>)</>} en={<><code>EXPLAIN ANALYZE</code>, indexes (see the <a href="/notas/postgres-for-devs/">Postgres note</a>)</>} />],
            [<T pt={<>Erro <code>too many connections</code></>} en={<><code>too many connections</code> error</>} />, <T pt="Cada conexão do Postgres é um processo; muitas instâncias do app" en="Each Postgres connection is a process; many app instances" />, <T pt="Pool de conexões (PgBouncer, RDS Proxy)" en="Connection pooling (PgBouncer, RDS Proxy)" />],
            [<T pt="As mesmas leituras repetidas milhares de vezes" en="The same reads repeated thousands of times" />, <T pt="Dados quentes e estáveis" en="Hot, stable data" />, <T pt="Cache (Redis, CDN)" en="Cache (Redis, CDN)" />],
            [<T pt="Leitura satura o primário; relatórios travam o app" en="Reads saturate the primary; reports stall the app" />, <T pt="Muita consulta, pouca escrita" en="Lots of queries, few writes" />, <T pt={<><b>Réplicas de leitura</b></>} en={<><b>Read replicas</b></>} />],
            [<T pt="Primário não aguenta as escritas, ou a tabela não cabe" en="Primary cannot take the writes, or the table does not fit" />, <T pt="Escrita e volume passam de um servidor" en="Writes and volume exceed one server" />, <T pt={<>Particionar; se não bastar, <b>sharding</b></>} en={<>Partition; if that is not enough, <b>sharding</b></>} />],
            [<T pt="Indisponibilidade quando o primário cai" en="Downtime when the primary dies" />, <T pt="Ponto único de falha" en="Single point of failure" />, <T pt="Standby com failover (Multi-AZ); réplica também serve" en="Standby with failover (Multi-AZ); a replica also works" />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> a escada e a tabela de sintomas são a minha síntese, uma ordem prática comum e não uma recomendação oficial. O ponto de fundo é que réplica não escala escrita, e é o erro de diagnóstico mais comum.</>} en={<><b>Personal note, not verified in the sources:</b> the ladder and the symptom table are my own synthesis, a common practical order and not an official recommendation. The underlying point is that a replica does not scale writes, and that is the most common diagnosis mistake.</>} /></Callout>
      </Section>
      <Section id="replication" title={<T pt="1. Primário, WAL e réplicas" en="1. Primary, WAL and replicas" />}>
        <p><T pt={<>Todo banco relacional grava as mudanças primeiro em um log (no Postgres, o <b>WAL</b>, <i>write-ahead log</i>) e só depois nos arquivos de dados. A <i>streaming replication</i> do Postgres aproveita isso: o primário envia o WAL a um standby assim que ele é gerado, sem esperar o segmento de 16 MB encher, e o standby reaplica as mudanças. Em modo assíncrono ele costuma ficar menos de um segundo atrás.</>} en={<>Every relational database writes changes first to a log (in Postgres, the <b>WAL</b>, <i>write-ahead log</i>) and only then to the data files. Postgres <i>streaming replication</i> builds on that: the primary sends the WAL to a standby as soon as it is generated, without waiting for the 16 MB segment to fill, and the standby replays the changes. In asynchronous mode it is usually under a second behind.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="A réplica é uma cópia física: reaplica exatamente o mesmo WAL, byte a byte." en="The replica is a physical copy: it replays exactly the same WAL, byte for byte." />}>
          <svg viewBox="0 0 700 204" role="img" aria-label="Streaming replication do Postgres / Postgres streaming replication">
            <rect x="150" y="8" width="230" height="170" rx="6" className="ln dash" />
            <text x="160" y="24" className="mut mono pt" textAnchor="start">primário</text>
            <text x="160" y="24" className="mut mono en" textAnchor="start">primary</text>
            <rect x="440" y="8" width="252" height="170" rx="6" className="ln dash" />
            <text x="450" y="24" className="mut mono pt" textAnchor="start">réplica (hot standby)</text>
            <text x="450" y="24" className="mut mono en" textAnchor="start">replica (hot standby)</text>
            <rect x="8" y="60" width="100" height="56" rx="4" className="ln fillsoft" />
            <text x="58.0" y="85.0" className="pt" textAnchor="middle">App</text>
            <text x="58.0" y="85.0" className="en" textAnchor="middle">App</text>
            <text x="58.0" y="102.0" className="mut pt" textAnchor="middle">escreve</text>
            <text x="58.0" y="102.0" className="mut en" textAnchor="middle">writes</text>
            <rect x="162" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="212.0" y="60.0" className="pt" textAnchor="middle">COMMIT</text>
            <text x="212.0" y="60.0" className="en" textAnchor="middle">COMMIT</text>
            <text x="212.0" y="77.0" className="mut pt" textAnchor="middle">linha nova</text>
            <text x="212.0" y="77.0" className="mut en" textAnchor="middle">new row</text>
            <rect x="162" y="108" width="100" height="50" rx="4" className="ln brandfill" />
            <text x="212.0" y="130.0" className="pt" textAnchor="middle">WAL</text>
            <text x="212.0" y="130.0" className="en" textAnchor="middle">WAL</text>
            <text x="212.0" y="147.0" className="mut pt" textAnchor="middle">log</text>
            <text x="212.0" y="147.0" className="mut en" textAnchor="middle">log</text>
            <rect x="278" y="108" width="90" height="50" rx="4" className="ln fillsoft" />
            <text x="323.0" y="137.0" className="pt" textAnchor="middle">walsender</text>
            <text x="323.0" y="137.0" className="en" textAnchor="middle">walsender</text>
            <rect x="452" y="108" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="502.0" y="137.0" className="pt" textAnchor="middle">walreceiver</text>
            <text x="502.0" y="137.0" className="en" textAnchor="middle">walreceiver</text>
            <rect x="582" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="632.0" y="60.0" className="pt" textAnchor="middle">Replay</text>
            <text x="632.0" y="60.0" className="en" textAnchor="middle">Replay</text>
            <text x="632.0" y="77.0" className="mut pt" textAnchor="middle">aplica o WAL</text>
            <text x="632.0" y="77.0" className="mut en" textAnchor="middle">applies WAL</text>
            <rect x="582" y="108" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="632.0" y="130.0" className="pt" textAnchor="middle">Dados</text>
            <text x="632.0" y="130.0" className="en" textAnchor="middle">Data</text>
            <text x="632.0" y="147.0" className="mut pt" textAnchor="middle">arquivos</text>
            <text x="632.0" y="147.0" className="mut en" textAnchor="middle">files</text>
            <rect x="452" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="502.0" y="60.0" className="pt" textAnchor="middle">SELECT</text>
            <text x="502.0" y="60.0" className="en" textAnchor="middle">SELECT</text>
            <text x="502.0" y="77.0" className="mut pt" textAnchor="middle">só leitura</text>
            <text x="502.0" y="77.0" className="mut en" textAnchor="middle">read only</text>
            <path d="M108 63L162 63" className="ln" />
            <path d="M154.8 66.5L162 63L154.8 59.5" className="ln" />
            <path d="M212 88L212 108" className="ln" />
            <path d="M215.5 100.8L212 108L208.5 100.8" className="ln" />
            <path d="M262 133L278 133" className="ln" />
            <path d="M270.8 136.5L278 133L270.8 129.5" className="ln" />
            <path d="M368 133L452 133" className="ln" />
            <path d="M444.8 136.5L452 133L444.8 129.5" className="ln" />
            <text x="410" y="124" className="mut mono pt" textAnchor="middle">TCP</text>
            <text x="410" y="124" className="mut mono en" textAnchor="middle">TCP</text>
            <path d="M552 133L582 133" className="ln" />
            <path d="M574.8 136.5L582 133L574.8 129.5" className="ln" />
            <path d="M632 108L632 88" className="ln" />
            <path d="M635.5 95.2L632 88L628.5 95.2" className="ln" />
            <path d="M582 63L552 63" className="ln" />
            <path d="M559.2 66.5L552 63L559.2 59.5" className="ln" />
            <text x="350" y="194" className="mut pt" textAnchor="middle">cada COMMIT vira WAL; a réplica reaplica o WAL; o atraso entre os dois é o lag</text>
            <text x="350" y="194" className="mut en" textAnchor="middle">each COMMIT becomes WAL; the replica replays the WAL; the delay between the two is the lag</text>
          </svg>
        </Diagram>
        <h3><T pt="Montar na mão (Postgres)" en="Setting it up by hand (Postgres)" /></h3>
        <p><T pt={<>É o que o laboratório da seção 6 faz, e é o que o RDS faz por você. No primário, um usuário de replicação, uma linha no <code>pg_hba.conf</code> e <code>max_wal_senders</code> suficiente. No standby, um backup base, um arquivo <code>standby.signal</code> vazio e o <code>primary_conninfo</code>. A opção <code>-R</code> do <code>pg_basebackup</code> grava os dois últimos.</>} en={<>This is what the section 6 lab does, and what RDS does for you. On the primary, a replication user, a line in <code>pg_hba.conf</code> and enough <code>max_wal_senders</code>. On the standby, a base backup, an empty <code>standby.signal</code> file and <code>primary_conninfo</code>. The <code>-R</code> option of <code>pg_basebackup</code> writes the last two.</>} /></p>
        <CodeBlock code={`# primário: pg_hba.conf
host  replication  replicator  192.168.1.100/32  scram-sha-256

# standby: backup base + standby.signal + primary_conninfo (e um slot de replicação)
pg_basebackup -h 192.168.1.50 -U replicator -D /var/lib/postgresql/data \\
  -R -X stream -C -S replica1

# monitorar, no primário
SELECT application_name, state, sync_state,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replay_lag_bytes
FROM pg_stat_replication;

# promover o standby a primário (failover)
SELECT pg_promote();`} />
        <Callout tone="warn" icon="alert"><T pt={<><b>Slot de replicação enche o disco.</b> Um slot impede o primário de reciclar o WAL que o standby ainda precisa. Se o standby some, o WAL acumula em <code>pg_wal</code> até lotar o disco. Limite com <code>max_slot_wal_keep_size</code>, como no laboratório, e alarme o tamanho do WAL retido.</>} en={<><b>A replication slot can fill the disk.</b> A slot stops the primary from recycling WAL the standby still needs. If the standby disappears, WAL piles up in <code>pg_wal</code> until the disk is full. Cap it with <code>max_slot_wal_keep_size</code>, as in the lab, and alarm on the retained WAL size.</>} /></Callout>
        <h3><T pt="Assíncrona ou síncrona" en="Asynchronous or synchronous" /></h3>
        <p><T pt={<>O padrão é <b>assíncrono</b>: o <code>COMMIT</code> não espera o standby, então uma queda do primário pode perder as últimas transações confirmadas. No modo <b>síncrono</b> (<code>synchronous_standby_names</code> não vazio) o commit espera, e <code>synchronous_commit</code> escolhe até onde:</>} en={<>The default is <b>asynchronous</b>: <code>COMMIT</code> does not wait for the standby, so a primary crash can lose the last committed transactions. In <b>synchronous</b> mode (<code>synchronous_standby_names</code> non-empty) the commit waits, and <code>synchronous_commit</code> chooses how far:</>} /></p>
        <Table
          head={[<T pt={<><code>synchronous_commit</code></>} en={<><code>synchronous_commit</code></>} />, <T pt="O commit espera o standby ter..." en="The commit waits until the standby has..." />, <T pt="Troca" en="Trade-off" />]}
          rows={[
            [<T pt={<><code>on</code> (padrão)</>} en={<><code>on</code> (default)</>} />, <T pt="gravado o WAL em disco" en="written the WAL to disk" />, <T pt="Não perde dado confirmado; não garante que a leitura na réplica já veja" en="No acknowledged data loss; does not guarantee the replica read already sees it" />],
            [<T pt={<><code>remote_write</code></>} en={<><code>remote_write</code></>} />, <T pt="recebido e entregue ao SO (sem flush)" en="received and handed to the OS (no flush)" />, <T pt="Mais rápido, um pouco menos durável" en="Faster, slightly less durable" />],
            [<T pt={<><code>remote_apply</code></>} en={<><code>remote_apply</code></>} />, <T pt={<><b>reaplicado</b>: visível a consultas</>} en={<><b>replayed</b>: visible to queries</>} />, <T pt="Leitura na réplica enxerga o commit, mas a escrita fica mais lenta" en="A replica read sees the commit, but writes get slower" />],
            [<T pt={<><code>local</code> / <code>off</code></>} en={<><code>local</code> / <code>off</code></>} />, <T pt="não espera o standby" en="does not wait for the standby" />, <T pt="Menor latência, maior risco" en="Lowest latency, highest risk" />],
          ]}
        />
        <p><T pt={<>O <code>synchronous_commit</code> pode ser definido por usuário, banco ou transação, então dá para pagar a latência só nas escritas que importam. Também há quórum: <code>ANY 2 (s1, s2, s3)</code> espera dois quaisquer.</>} en={<><code>synchronous_commit</code> can be set per user, database or transaction, so you can pay the latency only on the writes that matter. There is also quorum: <code>ANY 2 (s1, s2, s3)</code> waits for any two.</>} /></p>
        <h3><T pt="O que a réplica aceita" en="What a replica accepts" /></h3>
        <p><T pt={<>Uma réplica que aceita consultas se chama <i>hot standby</i>. Ela é somente leitura de verdade: <code>transaction_read_only</code> é sempre verdadeiro e não dá para mudar. Confirmei no laboratório:</>} en={<>A replica that accepts queries is called a <i>hot standby</i>. It is truly read-only: <code>transaction_read_only</code> is always true and cannot be changed. I confirmed it in the lab:</>} /></p>
        <CodeBlock code={`$ psql -h replica -c "INSERT INTO orders(tenant_id,customer,total) VALUES ('x','y',1)"
ERROR:  cannot execute INSERT in a read-only transaction`} />
        <Table
          head={[<T pt="Permitido" en="Allowed" />, <T pt="Proibido (erro)" en="Not allowed (error)" />]}
          rows={[
            [<T pt={<><code>SELECT</code>, <code>COPY TO</code>, cursores, <code>SHOW</code>/<code>SET</code>, <code>PREPARE</code>/<code>EXECUTE</code></>} en={<><code>SELECT</code>, <code>COPY TO</code>, cursors, <code>SHOW</code>/<code>SET</code>, <code>PREPARE</code>/<code>EXECUTE</code></>} />, <T pt={<><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>, <code>TRUNCATE</code>, tabelas temporárias</>} en={<><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>, <code>TRUNCATE</code>, temp tables</>} />],
            [<T pt={<><code>BEGIN</code>/<code>COMMIT</code> de transação somente leitura</>} en={<><code>BEGIN</code>/<code>COMMIT</code> of a read-only transaction</>} />, <T pt={<>DDL (<code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>), <code>VACUUM</code>, <code>ANALYZE</code>, <code>REINDEX</code></>} en={<>DDL (<code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>), <code>VACUUM</code>, <code>ANALYZE</code>, <code>REINDEX</code></>} />],
            [<T pt={<><code>LOCK TABLE</code> só em <code>ACCESS SHARE</code>, <code>ROW SHARE</code>, <code>ROW EXCLUSIVE</code></>} en={<><code>LOCK TABLE</code> only in <code>ACCESS SHARE</code>, <code>ROW SHARE</code>, <code>ROW EXCLUSIVE</code></>} />, <T pt={<><code>SELECT ... FOR UPDATE/SHARE</code>, <code>nextval()</code>, <code>LISTEN</code>/<code>NOTIFY</code>, isolamento <code>SERIALIZABLE</code></>} en={<><code>SELECT ... FOR UPDATE/SHARE</code>, <code>nextval()</code>, <code>LISTEN</code>/<code>NOTIFY</code>, <code>SERIALIZABLE</code> isolation</>} />],
          ]}
        />
        <p><T pt={<>Consequência de design: <b>uma transação que lê para depois escrever, ou que usa <code>FOR UPDATE</code>, tem que ir inteira ao primário</b>. Só roteie para a réplica o que é leitura de ponta a ponta.</>} en={<>Design consequence: <b>a transaction that reads and then writes, or that uses <code>FOR UPDATE</code>, must go entirely to the primary</b>. Only route to the replica what is read-only end to end.</>} /></p>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}>
          <ul>
            <li><a href="https://www.postgresql.org/docs/current/warm-standby.html">PostgreSQL Docs · Log-Shipping Standby Servers (streaming replication, slots, synchronous commit)</a></li>
            <li><a href="https://www.postgresql.org/docs/current/hot-standby.html">PostgreSQL Docs · Hot Standby (allowed queries, conflicts)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="replicas" title={<T pt="2. Lidar com réplicas: lag, consistência, conflitos" en="2. Living with replicas: lag, consistency, conflicts" />}>
        <p><T pt={<>Adicionar a réplica é a parte fácil. O difícil é que ela <b>sempre</b> está um pouco no passado, e o app precisa ser desenhado para isso.</>} en={<>Adding the replica is the easy part. The hard part is that it is <b>always</b> a little in the past, and the app must be designed for that.</>} /></p>
        <h3><T pt="Medir o lag" en="Measuring lag" /></h3>
        <ul className="ds-list">
          <li><T pt={<><b>Em bytes, no primário:</b> <code>pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)</code> em <code>pg_stat_replication</code>. Se a distância até <code>sent_lsn</code> é grande, o primário está carregado; entre <code>sent</code> e <code>replay</code>, é rede ou réplica lenta.</>} en={<><b>In bytes, on the primary:</b> <code>pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)</code> from <code>pg_stat_replication</code>. A large gap up to <code>sent_lsn</code> means a loaded primary; between <code>sent</code> and <code>replay</code>, network or a slow replica.</>} /></li>
          <li><T pt={<><b>Em tempo, na réplica:</b> <code>now() - pg_last_xact_replay_timestamp()</code>. Cuidado: num primário parado esse valor cresce mesmo com a réplica em dia. É o mesmo cálculo da métrica <code>ReplicaLag</code> do RDS, que por isso pode mostrar até 5 minutos de lag sem transações.</>} en={<><b>In time, on the replica:</b> <code>now() - pg_last_xact_replay_timestamp()</code>. Careful: on an idle primary this value grows even with the replica caught up. It is the same calculation as RDS's <code>ReplicaLag</code> metric, which is why it can show up to 5 minutes of lag with no transactions.</>} /></li>
        </ul>
        <p><T pt="As causas típicas de lag, segundo a AWS: escrita muito concorrente ou lotes grandes no primário; consultas pesadas ou lentas na própria réplica, que disputam recurso com a reaplicação; e transações enormes ou DDL, porque a ordem dos commits é preservada." en="Typical lag causes, per AWS: highly concurrent writes or big batches on the primary; heavy or slow queries on the replica itself, competing with replay; and huge transactions or DDL, because commit order is preserved." /></p>
        <h3><T pt="Consistência: o que o usuário percebe" en="Consistency: what the user notices" /></h3>
        <p><T pt="Com réplica assíncrona, três anomalias aparecem para o usuário, e todas têm a mesma raiz:" en="With an asynchronous replica, three anomalies reach the user, all with the same root:" /></p>
        <Table
          head={[<T pt="Anomalia" en="Anomaly" />, <T pt="Exemplo" en="Example" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt={<>Ler o que acabei de escrever (<i>read-your-writes</i>)</>} en={<>Reading what I just wrote (<i>read-your-writes</i>)</>} />, <T pt="Cria o pedido e a página seguinte diz “não encontrado”" en="Creates the order and the next page says “not found”" />, <T pt={<>O <code>GET</code> caiu numa réplica que ainda não reaplicou o <code>INSERT</code></>} en={<>The <code>GET</code> hit a replica that has not replayed the <code>INSERT</code> yet</>} />],
            [<T pt={<>Leituras voltando no tempo (<i>monotonic reads</i>)</>} en={<>Reads going back in time (<i>monotonic reads</i>)</>} />, <T pt="Atualiza a página: o comentário some e volta" en="Refreshes the page: the comment vanishes and returns" />, <T pt="Duas réplicas com lags diferentes" en="Two replicas with different lags" />],
            [<T pt="Decidir com dado velho" en="Deciding on stale data" />, <T pt="Checa estoque na réplica e vende o que acabou" en="Checks stock on the replica and sells what ran out" />, <T pt="A decisão exige o dado atual" en="The decision needs current data" />],
          ]}
        />
        <p><T pt="As estratégias, da mais simples à mais precisa:" en="The strategies, from simplest to most precise:" /></p>
        <Table
          head={[<T pt="Estratégia" en="Strategy" />, <T pt="Como" en="How" />, <T pt="Custo" en="Cost" />]}
          rows={[
            [<T pt="Decisões e leituras críticas vão ao primário" en="Decisions and critical reads go to the primary" />, <T pt="Classifique cada leitura: “pode ser velha?” Se não, primário." en="Classify each read: “may it be stale?” If not, primary." />, <T pt="Simples; o primário continua recebendo essas leituras" en="Simple; the primary keeps receiving those reads" />],
            [<T pt="Janela pós-escrita" en="Post-write window" />, <T pt="Depois de uma escrita, o usuário lê do primário por N segundos (cookie ou sessão)." en="After a write, the user reads from the primary for N seconds (cookie or session)." />, <T pt="Simples; N é um chute (lag pode passar de N)" en="Simple; N is a guess (lag can exceed N)" />],
            [<T pt={<><b>Token de posição do WAL (LSN)</b></>} en={<><b>WAL position token (LSN)</b></>} />, <T pt={<>A escrita devolve <code>pg_current_wal_lsn()</code>; a leitura só usa a réplica se <code>pg_last_wal_replay_lsn()</code> já passou dele, senão vai ao primário. <b>É o que o laboratório faz.</b></>} en={<>The write returns <code>pg_current_wal_lsn()</code>; the read only uses the replica if <code>pg_last_wal_replay_lsn()</code> has passed it, otherwise it goes to the primary. <b>This is what the lab does.</b></>} />, <T pt="Uma consulta extra por leitura; o app carrega o token" en="One extra query per read; the app carries the token" />],
            [<T pt={<><code>WAIT FOR LSN</code> (PostgreSQL 19)</>} en={<><code>WAIT FOR LSN</code> (PostgreSQL 19)</>} />, <T pt={<>A réplica bloqueia a sessão até reaplicar o LSN (com <code>TIMEOUT</code>), em vez de o app decidir.</>} en={<>The replica blocks the session until it replays the LSN (with <code>TIMEOUT</code>), instead of the app deciding.</>} />, <T pt={<>Requer a versão 19; com pool em modo transação o <code>WAIT</code> e a leitura podem cair em conexões diferentes</>} en={<>Requires version 19; with transaction-mode pooling the <code>WAIT</code> and the read may land on different connections</>} />],
            [<T pt={<>Commit síncrono com <code>remote_apply</code></>} en={<>Synchronous commit with <code>remote_apply</code></>} />, <T pt="O commit só volta depois que a réplica reaplicou." en="The commit only returns after the replica has replayed." />, <T pt="Escritas mais lentas; uma réplica parada trava as escritas" en="Slower writes; a stalled replica blocks writes" />],
            [<T pt={<>Aurora: <i>write forwarding</i> local</>} en={<>Aurora: local <i>write forwarding</i></>} />, <T pt="O app abre transação de leitura/escrita direto na réplica; a escrita é encaminhada ao writer." en="The app opens a read/write transaction directly on the replica; the write is forwarded to the writer." />, <T pt="Só Aurora PostgreSQL 14.13+, 15.8+ ou 16.4+; é para escritas ocasionais" en="Aurora PostgreSQL 14.13+, 15.8+ or 16.4+ only; meant for occasional writes" />],
          ]}
        />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> a data de lançamento e a sintaxe final do <code>WAIT FOR LSN</code> eu não consegui confirmar na página oficial (devolveu 404 para mim). O que sei vem de resumos de busca da documentação da versão 19, que descrevem <code>WAIT FOR LSN '...' WITH (MODE, TIMEOUT, NO_THROW)</code> executado numa réplica; confira na documentação da sua versão antes de usar. A técnica do token, que o laboratório usa, funciona em qualquer versão.</>} en={<><b>Personal note, not verified in the sources:</b> I could not confirm the release date and final syntax of <code>WAIT FOR LSN</code> on the official page (it returned 404 for me). What I know comes from search summaries of the version 19 docs, which describe <code>WAIT FOR LSN '...' WITH (MODE, TIMEOUT, NO_THROW)</code> run on a replica; check your version's docs before using it. The token technique, which the lab uses, works on any version.</>} /></Callout>
        <h3><T pt="Conflitos: a réplica cancela consultas" en="Conflicts: the replica cancels queries" /></h3>
        <p><T pt={<>O primário não enxerga as consultas da réplica. Quando a reaplicação do WAL entra em conflito com uma consulta que está rodando na réplica (por exemplo, o <code>VACUUM</code> do primário removeu linhas que a consulta ainda via, ou um <code>DROP TABLE</code> pegou um lock exclusivo), a réplica espera ou cancela a consulta. Os controles:</>} en={<>The primary cannot see the replica's queries. When WAL replay conflicts with a query running on the replica (for example, the primary's <code>VACUUM</code> removed rows the query still saw, or a <code>DROP TABLE</code> took an exclusive lock), the replica waits or cancels the query. The controls:</>} /></p>
        <Table
          head={[<T pt="Parâmetro" en="Parameter" />, <T pt="Efeito" en="Effect" />, <T pt="Use quando" en="Use when" />]}
          rows={[
            [<T pt={<><code>max_standby_streaming_delay</code></>} en={<><code>max_standby_streaming_delay</code></>} />, <T pt={<>Quanto a reaplicação pode esperar a consulta. Passado o tempo, a consulta é cancelada. <code>-1</code> espera para sempre.</>} en={<>How long replay may wait for the query. Past it, the query is cancelled. <code>-1</code> waits forever.</>} />, <T pt={<>Réplica de relatório: valor alto (horas) ou <code>-1</code>, aceitando mais lag</>} en={<>Reporting replica: a high value (hours) or <code>-1</code>, accepting more lag</>} />],
            [<T pt={<><code>hot_standby_feedback = on</code></>} en={<><code>hot_standby_feedback = on</code></>} />, <T pt="A réplica avisa o primário para não remover linhas que ela ainda usa." en="The replica tells the primary not to remove rows it still uses." />, <T pt={<>Muitos cancelamentos; custo: <i>bloat</i> no primário</>} en="Many cancellations; cost: bloat on the primary" />],
            [<T pt={<>Delay curto ou <code>0</code></>} en={<>Short delay or <code>0</code></>} />, <T pt="A réplica nunca se atrasa; cancela consultas." en="The replica never falls behind; it cancels queries." />, <T pt="Réplica de alta disponibilidade, que precisa estar em dia para o failover" en="High-availability replica, which must be current for failover" />],
          ]}
        />
        <p><T pt={<>Duas regras práticas: <b>separe a réplica de relatório da réplica de failover</b>, porque elas querem configurações opostas; e trate o cancelamento como erro normal, com nova tentativa em outra transação. A visão <code>pg_stat_database_conflicts</code>, na réplica, mostra os cancelamentos por motivo.</>} en={<>Two practical rules: <b>keep the reporting replica separate from the failover replica</b>, because they want opposite settings; and treat cancellation as a normal error, with a retry in a new transaction. The <code>pg_stat_database_conflicts</code> view, on the replica, shows cancellations by reason.</>} /></p>
        <h3><T pt="Rotear no app, no pool ou no DNS" en="Routing in the app, the pool or DNS" /></h3>
        <Table
          head={[<T pt="Onde" en="Where" />, <T pt="Como" en="How" />, <T pt="Cuidado" en="Watch out for" />]}
          rows={[
            [<T pt="No app (router explícito)" en="In the app (explicit router)" />, <T pt={<>Duas conexões: <code>primary</code> e <code>replica</code>; o código escolhe por leitura.</>} en={<>Two connections: <code>primary</code> and <code>replica</code>; the code chooses per read.</>} />, <T pt="É o que dá controle de consistência; é mais código" en="It gives consistency control; it is more code" />],
            [<T pt="Endpoint de leitura do provedor" en="Provider read endpoint" />, <T pt="O app usa um nome para escrita e outro para leitura (Aurora reader endpoint)." en="The app uses one name for writes and another for reads (Aurora reader endpoint)." />, <T pt={<>Balanceia <b>conexões</b>, não consultas; um pool que reaproveita conexões fica desbalanceado</>} en={<>It balances <b>connections</b>, not queries; a pool that reuses connections ends up unbalanced</>} />],
            [<T pt="Proxy / pool" en="Proxy / pool" />, <T pt="RDS Proxy, PgBouncer: um endpoint de leitura que escolhe réplica viva." en="RDS Proxy, PgBouncer: a read endpoint that picks a live replica." />, <T pt="O proxy não sabe do seu token de consistência; ele escolhe a réplica, não a leitura segura" en="The proxy does not know your consistency token; it picks the replica, not the safe read" />],
            [<T pt="Driver" en="Driver" />, <T pt={<>Alguns drivers aceitam várias URLs e papéis (<code>targetServerType</code> no driver JDBC do Postgres, por exemplo).</>} en={<>Some drivers accept several URLs and roles (<code>targetServerType</code> in the Postgres JDBC driver, for example).</>} />, <T pt="Confira na doc do seu driver (de memória)" en="Check your driver's docs (from memory)" />],
          ]}
        />
        <Callout tone="use" icon="check"><T pt={<><b>Regra de ouro.</b> Um endpoint de leitura resolve <i>onde</i> ler. Nenhum endpoint resolve <i>quando é seguro</i> ler da réplica. Isso é regra de negócio e fica no seu código, como o token da seção 5.</>} en={<><b>Golden rule.</b> A read endpoint solves <i>where</i> to read. No endpoint solves <i>when it is safe</i> to read from the replica. That is business logic and lives in your code, like the token in section 5.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}>
          <ul>
            <li><a href="https://www.postgresql.org/docs/current/hot-standby.html">PostgreSQL Docs · Hot Standby (query conflicts, max_standby_streaming_delay, hot_standby_feedback)</a></li>
            <li><a href="https://www.postgresql.org/docs/19/sql-wait-for.html">PostgreSQL 19 Docs · WAIT FOR (page returned 404 here; see personal note)</a></li>
            <li><a href="https://rednafi.com/system/wait-for-lsn/">Reading your writes with WAIT FOR LSN in Postgres 19 (blog)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.Monitoring.html">AWS Docs · RDS: Monitoring read replication (ReplicaLag)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.Replication.ReadReplicas.html">AWS Docs · RDS for PostgreSQL read replicas (limitations, idle lag)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-postgresql-write-forwarding.html">AWS Docs · Aurora PostgreSQL local write forwarding</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="aws" title={<T pt="3. Na AWS: o que existe e quando usar" en="3. On AWS: what exists and when to use it" />}>
        <p><T pt={<>A AWS tem várias formas de ter “mais de uma cópia”, e elas resolvem problemas diferentes. A confusão mais comum é tratar <b>Multi-AZ</b> (disponibilidade) como <b>réplica de leitura</b> (escala de leitura). A documentação separa as duas.</>} en={<>AWS has several ways to have “more than one copy”, and they solve different problems. The most common confusion is treating <b>Multi-AZ</b> (availability) as a <b>read replica</b> (read scaling). The documentation keeps them separate.</>} /></p>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Como replica" en="How it replicates" />, <T pt="Lê da cópia?" en="Read from the copy?" />, <T pt="Serve para" en="Good for" />]}
          rows={[
            [<T pt="RDS Multi-AZ (instância)" en="RDS Multi-AZ (instance)" />, <T pt={<>Um standby, replicação <b>síncrona</b></>} en={<>One standby, <b>synchronous</b> replication</>} />, <T pt="Não" en="No" />, <T pt="Alta disponibilidade e failover" en="High availability and failover" />],
            [<T pt="RDS read replica" en="RDS read replica" />, <T pt={<>Mecanismo nativo do motor, <b>assíncrono</b>. Parte de um snapshot do primário.</>} en={<>The engine's native mechanism, <b>asynchronous</b>. Starts from a snapshot of the primary.</>} />, <T pt="Sim" en="Yes" />, <T pt="Escalar leitura, relatórios, DR (promover)" en="Scaling reads, reports, DR (promote)" />],
            [<T pt="RDS Multi-AZ DB cluster (MySQL, PostgreSQL)" en="RDS Multi-AZ DB cluster (MySQL, PostgreSQL)" />, <T pt={<>Writer + 2 readers em 3 AZs, <b>semissíncrona</b>: o commit espera ao menos um reader</>} en={<>Writer + 2 readers in 3 AZs, <b>semi-synchronous</b>: the commit waits for at least one reader</>} />, <T pt="Sim (reader endpoint)" en="Yes (reader endpoint)" />, <T pt="HA e leitura juntas, com menor latência de escrita que Multi-AZ instância" en="HA and reads together, with lower write latency than Multi-AZ instance" />],
            [<T pt="Aurora" en="Aurora" />, <T pt={<>Os nós <b>compartilham um volume</b> do cluster, com cópias em 3 AZs; até 15 réplicas</>} en={<>Nodes <b>share one cluster volume</b>, with copies in 3 AZs; up to 15 replicas</>} />, <T pt="Sim (reader endpoint)" en="Yes (reader endpoint)" />, <T pt="Muita leitura, failover rápido, lag normalmente bem abaixo de 100 ms" en="Heavy reads, fast failover, lag usually well under 100 ms" />],
            [<T pt="Aurora Global Database" en="Aurora Global Database" />, <T pt="Replica o volume para até 10 Regiões secundárias; latência tipicamente abaixo de 1 s" en="Replicates the volume to up to 10 secondary Regions; latency typically under 1 s" />, <T pt="Sim, nas Regiões secundárias" en="Yes, in secondary Regions" />, <T pt="Leitura perto do usuário e recuperação de falha de Região" en="Reads near the user and Region-failure recovery" />],
            [<T pt="Aurora PostgreSQL Limitless" en="Aurora PostgreSQL Limitless" />, <T pt={<><b>Sharding</b> gerenciado: routers e shards</>} en={<>Managed <b>sharding</b>: routers and shards</>} />, <T pt="Via routers" en="Through routers" />, <T pt="Escrita e volume além de um writer" en="Writes and volume beyond one writer" />],
          ]}
        />
        <Diagram minWidth={640} caption={<T pt="No RDS cada cópia é um disco e o WAL viaja pela rede. No Aurora o volume é do cluster, por isso a réplica não reaplica um WAL próprio e o lag é baixo." en="On RDS each copy is a disk and the WAL travels over the network. On Aurora the volume belongs to the cluster, so the replica does not replay its own WAL and lag is low." />}>
          <svg viewBox="0 0 700 206" role="img" aria-label="RDS contra Aurora / RDS versus Aurora">
            <rect x="4" y="8" width="330" height="190" rx="6" className="ln dash" />
            <text x="14" y="24" className="mut mono pt" textAnchor="start">RDS: cada instância tem o seu disco</text>
            <text x="14" y="24" className="mut mono en" textAnchor="start">RDS: each instance has its own disk</text>
            <rect x="24" y="44" width="120" height="52" rx="4" className="ln brandfill" />
            <text x="84.0" y="67.0" className="pt" textAnchor="middle">Primário</text>
            <text x="84.0" y="67.0" className="en" textAnchor="middle">Primary</text>
            <text x="84.0" y="84.0" className="mut pt" textAnchor="middle">AZ a</text>
            <text x="84.0" y="84.0" className="mut en" textAnchor="middle">AZ a</text>
            <rect x="194" y="44" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="254.0" y="67.0" className="pt" textAnchor="middle">Réplica</text>
            <text x="254.0" y="67.0" className="en" textAnchor="middle">Replica</text>
            <text x="254.0" y="84.0" className="mut pt" textAnchor="middle">AZ b</text>
            <text x="254.0" y="84.0" className="mut en" textAnchor="middle">AZ b</text>
            <rect x="24" y="128" width="120" height="44" rx="4" className="ln fillsoft" />
            <text x="84.0" y="154.0" className="pt" textAnchor="middle">Volume (EBS)</text>
            <text x="84.0" y="154.0" className="en" textAnchor="middle">Volume (EBS)</text>
            <rect x="194" y="128" width="120" height="44" rx="4" className="ln fillsoft" />
            <text x="254.0" y="154.0" className="pt" textAnchor="middle">Volume (EBS)</text>
            <text x="254.0" y="154.0" className="en" textAnchor="middle">Volume (EBS)</text>
            <path d="M84 96L84 128" className="ln" />
            <path d="M87.5 120.8L84 128L80.5 120.8" className="ln" />
            <path d="M254 96L254 128" className="ln" />
            <path d="M257.5 120.8L254 128L250.5 120.8" className="ln" />
            <path d="M144 70L194 70" className="ln" />
            <path d="M186.8 73.5L194 70L186.8 66.5" className="ln" />
            <text x="169" y="38" className="mut mono pt" textAnchor="middle">WAL async</text>
            <text x="169" y="38" className="mut mono en" textAnchor="middle">WAL async</text>
            <rect x="366" y="8" width="330" height="190" rx="6" className="ln dash" />
            <text x="376" y="24" className="mut mono pt" textAnchor="start">Aurora: um volume do cluster para todos</text>
            <text x="376" y="24" className="mut mono en" textAnchor="start">Aurora: one cluster volume for all</text>
            <rect x="382" y="44" width="90" height="52" rx="4" className="ln brandfill" />
            <text x="427.0" y="67.0" className="pt" textAnchor="middle">Writer</text>
            <text x="427.0" y="67.0" className="en" textAnchor="middle">Writer</text>
            <text x="427.0" y="84.0" className="mut pt" textAnchor="middle">AZ a</text>
            <text x="427.0" y="84.0" className="mut en" textAnchor="middle">AZ a</text>
            <rect x="484" y="44" width="90" height="52" rx="4" className="ln fillsoft" />
            <text x="529.0" y="67.0" className="pt" textAnchor="middle">Reader</text>
            <text x="529.0" y="67.0" className="en" textAnchor="middle">Reader</text>
            <text x="529.0" y="84.0" className="mut pt" textAnchor="middle">AZ b</text>
            <text x="529.0" y="84.0" className="mut en" textAnchor="middle">AZ b</text>
            <rect x="586" y="44" width="90" height="52" rx="4" className="ln fillsoft" />
            <text x="631.0" y="67.0" className="pt" textAnchor="middle">Reader</text>
            <text x="631.0" y="67.0" className="en" textAnchor="middle">Reader</text>
            <text x="631.0" y="84.0" className="mut pt" textAnchor="middle">AZ c</text>
            <text x="631.0" y="84.0" className="mut en" textAnchor="middle">AZ c</text>
            <rect x="382" y="128" width="294" height="44" rx="4" className="ln fillsoft" />
            <text x="529.0" y="154.0" className="pt" textAnchor="middle">Volume do cluster · cópias em 3 AZs</text>
            <text x="529.0" y="154.0" className="en" textAnchor="middle">Cluster volume · copies in 3 AZs</text>
            <path d="M427 96L427 128" className="ln" />
            <path d="M430.5 120.8L427 128L423.5 120.8" className="ln" />
            <path d="M529 96L529 128" className="ln" />
            <path d="M532.5 120.8L529 128L525.5 120.8" className="ln" />
            <path d="M631 96L631 128" className="ln" />
            <path d="M634.5 120.8L631 128L627.5 120.8" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="Uma topologia típica" en="A typical topology" /></h3>
        <Diagram minWidth={640} caption={<T pt="O app fala com um proxy. Escritas vão ao writer; leituras, a um endpoint de leitura que escolhe um reader vivo." en="The app talks to a proxy. Writes go to the writer; reads go to a read endpoint that picks a live reader." />}>
          <svg viewBox="0 0 700 298" role="img" aria-label="Topologia de leitura e escrita na AWS / Read and write topology on AWS">
            <rect x="196" y="8" width="318" height="258" rx="6" className="ln dash" />
            <text x="206" y="24" className="mut mono pt" textAnchor="start">VPC · subnets privadas em 3 AZs</text>
            <text x="206" y="24" className="mut mono en" textAnchor="start">VPC · private subnets in 3 AZs</text>
            <rect x="8" y="106" width="100" height="56" rx="4" className="ln fillsoft" />
            <text x="58.0" y="131.0" className="pt" textAnchor="middle">App</text>
            <text x="58.0" y="131.0" className="en" textAnchor="middle">App</text>
            <text x="58.0" y="148.0" className="mut pt" textAnchor="middle">ECS / Lambda</text>
            <text x="58.0" y="148.0" className="mut en" textAnchor="middle">ECS / Lambda</text>
            <rect x="214" y="106" width="110" height="56" rx="4" className="ln brandfill" />
            <text x="269.0" y="131.0" className="pt" textAnchor="middle">RDS Proxy</text>
            <text x="269.0" y="131.0" className="en" textAnchor="middle">RDS Proxy</text>
            <text x="269.0" y="148.0" className="mut pt" textAnchor="middle">pool + failover</text>
            <text x="269.0" y="148.0" className="mut en" textAnchor="middle">pool + failover</text>
            <rect x="380" y="36" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="59.0" className="pt" textAnchor="middle">Writer</text>
            <text x="440.0" y="59.0" className="en" textAnchor="middle">Writer</text>
            <text x="440.0" y="76.0" className="mut pt" textAnchor="middle">cluster endpoint</text>
            <text x="440.0" y="76.0" className="mut en" textAnchor="middle">cluster endpoint</text>
            <rect x="380" y="106" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="129.0" className="pt" textAnchor="middle">Reader</text>
            <text x="440.0" y="129.0" className="en" textAnchor="middle">Reader</text>
            <text x="440.0" y="146.0" className="mut pt" textAnchor="middle">reader endpoint</text>
            <text x="440.0" y="146.0" className="mut en" textAnchor="middle">reader endpoint</text>
            <rect x="380" y="176" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="199.0" className="pt" textAnchor="middle">Reader</text>
            <text x="440.0" y="199.0" className="en" textAnchor="middle">Reader</text>
            <text x="440.0" y="216.0" className="mut pt" textAnchor="middle">custom: relatórios</text>
            <text x="440.0" y="216.0" className="mut en" textAnchor="middle">custom: reports</text>
            <path d="M108 134L214 134" className="ln" />
            <path d="M206.8 137.5L214 134L206.8 130.5" className="ln" />
            <path d="M324 126L352 126L352 62L380 62" className="ln" />
            <path d="M372.8 65.5L380 62L372.8 58.5" className="ln" />
            <path d="M324 134L380 134" className="ln" />
            <path d="M372.8 137.5L380 134L372.8 130.5" className="ln" />
            <path d="M324 142L352 142L352 202L380 202" className="ln" />
            <path d="M372.8 205.5L380 202L372.8 198.5" className="ln" />
            <text x="110" y="124" className="mut mono pt" textAnchor="start">SQL</text>
            <text x="110" y="124" className="mut mono en" textAnchor="start">SQL</text>
            <text x="560" y="62" className="mut pt" textAnchor="start">escritas</text>
            <text x="560" y="62" className="mut en" textAnchor="start">writes</text>
            <text x="560" y="134" className="mut pt" textAnchor="start">leituras</text>
            <text x="560" y="134" className="mut en" textAnchor="start">reads</text>
            <text x="560" y="202" className="mut pt" textAnchor="start">análise</text>
            <text x="560" y="202" className="mut en" textAnchor="start">analytics</text>
            <text x="355" y="288" className="mut mono pt" textAnchor="middle">RDS Proxy: endpoints de leitura só em Aurora e Multi-AZ DB cluster</text>
            <text x="355" y="288" className="mut mono en" textAnchor="middle">RDS Proxy: read endpoints only on Aurora and Multi-AZ DB clusters</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><b>Endpoints do Aurora:</b> o <i>cluster endpoint</i> sempre aponta para o writer (muda sozinho no failover); o <i>reader endpoint</i> balanceia <b>conexões</b> entre os readers (não balanceia consultas: para espalhar cada consulta, abra uma conexão por consulta); o <i>custom endpoint</i> agrupa um subconjunto de instâncias (por exemplo, readers maiores para relatórios); o <i>instance endpoint</i> serve para diagnóstico. Se o cluster só tem o writer, o reader endpoint aponta para ele.</>} en={<><b>Aurora endpoints:</b> the <i>cluster endpoint</i> always points to the writer (it changes by itself on failover); the <i>reader endpoint</i> balances <b>connections</b> among the readers (it does not balance queries: to spread each query, open a connection per query); the <i>custom endpoint</i> groups a subset of instances (for example, larger readers for reports); the <i>instance endpoint</i> is for diagnosis. If the cluster has only the writer, the reader endpoint points to it.</>} /></li>
          <li><T pt={<><b>RDS Proxy:</b> mantém um pool de conexões e as multiplexa (todas as operações de uma transação usam uma conexão do banco), o que protege o banco de rajadas, e reconecta a um standby no failover preservando as conexões do app. Para Aurora e Multi-AZ DB cluster você pode criar <b>endpoints somente leitura</b> (<code>TargetRole = READ_ONLY</code>), que reagem a um reader que cai sem esperar o cache de DNS. Já para uma instância RDS com réplicas, o proxy só se associa ao <b>writer</b>, não a uma réplica de leitura.</>} en={<><b>RDS Proxy:</b> keeps a connection pool and multiplexes it (all operations of a transaction use one database connection), which protects the database from bursts, and reconnects to a standby on failover while preserving app connections. For Aurora and Multi-AZ DB clusters you can create <b>read-only endpoints</b> (<code>TargetRole = READ_ONLY</code>), which react to a reader dying without waiting for the DNS cache. For an RDS instance with replicas, however, the proxy only associates with the <b>writer</b>, not a read replica.</>} /></li>
          <li><T pt={<><b>Sem autoscaling de réplica no RDS:</b> o RDS não adiciona nem remove réplicas conforme a demanda; você cria e apaga à mão. Se apagar o primário sem apagar as réplicas na mesma Região, cada réplica é promovida a instância independente.</>} en={<><b>No replica autoscaling on RDS:</b> RDS does not add or remove replicas as demand changes; you create and delete them by hand. If you delete the primary without deleting its replicas in the same Region, each replica is promoted to a standalone instance.</>} /></li>
          <li><T pt={<><b>Lag e failover:</b> no Multi-AZ DB cluster com PostgreSQL, o tempo de failover depende do menor lag entre os dois readers, porque o escolhido precisa aplicar o que falta antes de virar writer. Por isso a AWS recomenda alarmar o lag.</>} en={<><b>Lag and failover:</b> in a Multi-AZ DB cluster with PostgreSQL, failover time depends on the lowest lag of the two readers, because the chosen one must apply what is missing before becoming writer. That is why AWS recommends alarming on lag.</>} /></li>
        </ul>
        <h3><T pt="Como fazer (AWS CLI)" en="How to do it (AWS CLI)" /></h3>
        <CodeBlock code={`# 1. réplica de leitura de uma instância RDS (mesma Região)
aws rds create-db-instance-read-replica \\
  --db-instance-identifier shop-replica-1 \\
  --source-db-instance-identifier shop \\
  --availability-zone us-east-1b

# promover a réplica a instância independente (irreversível)
aws rds promote-read-replica --db-instance-identifier shop-replica-1

# 2. Multi-AZ DB cluster (writer + 2 readers em 3 AZs)
aws rds create-db-cluster \\
  --db-cluster-identifier shop-cluster --engine postgres \\
  --master-username postgres --manage-master-user-password \\
  --db-subnet-group-name private-3az --backup-retention-period 1 \\
  --allocated-storage 400 --storage-type io1 --iops 3000 \\
  --db-cluster-instance-class db.m5d.xlarge

# 3. Aurora PostgreSQL: o cluster e depois uma instância por papel
aws rds create-db-cluster --db-cluster-identifier shop-aurora \\
  --engine aurora-postgresql --master-username postgres --manage-master-user-password \\
  --db-subnet-group-name private-3az
aws rds create-db-instance --db-instance-identifier shop-aurora-writer \\
  --db-cluster-identifier shop-aurora --engine aurora-postgresql --db-instance-class db.r6g.large
aws rds create-db-instance --db-instance-identifier shop-aurora-reader-1 \\
  --db-cluster-identifier shop-aurora --engine aurora-postgresql --db-instance-class db.r6g.large

# onde estão os endpoints do cluster
aws rds describe-db-clusters --query '*[].{Writer:Endpoint,Reader:ReaderEndpoint}'

# 4. alarme de lag em instância RDS (métrica ReplicaLag, em segundos)
aws cloudwatch put-metric-alarm --alarm-name shop-replica-lag \\
  --namespace AWS/RDS --metric-name ReplicaLag \\
  --dimensions Name=DBInstanceIdentifier,Value=shop-replica-1 \\
  --statistic Maximum --period 60 --evaluation-periods 5 \\
  --threshold 30 --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:123456789012:db-alerts`} />
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> <b>não executei nada disto na AWS</b> (custa dinheiro e não tenho conta de teste aqui). Conferi na documentação os comandos de réplica de leitura e de Multi-AZ DB cluster. Os comandos do Aurora, o alarme de CloudWatch e a ideia de ajustar <code>hot_standby_feedback</code> e <code>max_standby_streaming_delay</code> pelo parameter group são de memória; no Aurora a métrica de lag tem outro nome (<code>AuroraReplicaLag</code>, em milissegundos, se me lembro bem). Valores como classes de instância, nomes e IDs são exemplos.</>} en={<><b>Personal note, not verified in the sources:</b> <b>I did not run any of this on AWS</b> (it costs money and I have no test account here). I checked the read-replica and Multi-AZ DB cluster commands against the docs. The Aurora commands, the CloudWatch alarm and the idea of tuning <code>hot_standby_feedback</code> and <code>max_standby_streaming_delay</code> through the parameter group are from memory; on Aurora the lag metric has a different name (<code>AuroraReplicaLag</code>, in milliseconds, if I remember right). Values such as instance classes, names and IDs are examples.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}>
          <ul>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html">AWS Docs · RDS: Working with DB instance read replicas</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html">AWS Docs · RDS: Multi-AZ deployments (instance vs cluster)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html">AWS Docs · RDS: Multi-AZ DB cluster deployments (semisynchronous, replica lag, flow control)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/create-multi-az-db-cluster.html">AWS Docs · RDS: Creating a Multi-AZ DB cluster (CLI)</a></li>
            <li><a href="https://docs.aws.amazon.com/cli/latest/reference/rds/create-db-instance-read-replica.html">AWS CLI · create-db-instance-read-replica</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html">AWS Docs · Aurora DB clusters (cluster volume, up to 15 replicas)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html">AWS Docs · Aurora replication (lag usually under 100 ms)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html">AWS Docs · Aurora endpoints (cluster, reader, custom, instance)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Endpoints.Reader.html">AWS Docs · Aurora reader endpoints (connection balancing)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html">AWS Docs · Aurora Global Database</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html">AWS Docs · RDS Proxy (pooling, multiplexing, limitations)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-endpoints.html">AWS Docs · RDS Proxy endpoints (read-only endpoints)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="sharding" title={<T pt="4. Sharding: dividir os dados entre servidores" en="4. Sharding: splitting data across servers" />}>
        <p><T pt={<>No sharding cada servidor (<i>shard</i>) guarda um pedaço das linhas, e cada shard é o primário dos seus dados, com as suas próprias réplicas. A escrita escala porque deixa de passar por um único nó. O preço é que o banco deixa de ser “um banco”: o que era trivial (um join, uma transação, um <code>COUNT</code>) vira problema distribuído.</>} en={<>In sharding each server (<i>shard</i>) holds a slice of the rows, and each shard is the primary of its own data, with its own replicas. Writes scale because they no longer go through a single node. The price is that the database stops being “one database”: what was trivial (a join, a transaction, a <code>COUNT</code>) becomes a distributed problem.</>} /></p>
        <h3><T pt="Particionar não é fazer shard" en="Partitioning is not sharding" /></h3>
        <p><T pt={<>O Postgres tem <b>particionamento declarativo</b> (range, list e hash), que divide uma tabela em pedaços <i>dentro do mesmo servidor</i>. Ele ajuda com poda de partições (<i>partition pruning</i>), com manutenção (apagar uma partição antiga é quase instantâneo) e com localidade de cache, mas CPU, memória e disco continuam sendo de uma máquina só. A documentação sugere considerar particionar quando a tabela passa da memória do servidor. Sharding é o passo seguinte: os pedaços ficam em máquinas diferentes.</>} en={<>Postgres has <b>declarative partitioning</b> (range, list and hash), which splits a table into pieces <i>inside the same server</i>. It helps with partition pruning, with maintenance (dropping an old partition is nearly instant) and with cache locality, but CPU, memory and disk still belong to one machine. The docs suggest considering partitioning when the table exceeds the server's memory. Sharding is the next step: the pieces live on different machines.</>} /></p>
        <CodeBlock code={`CREATE TABLE measurement (
    city_id int NOT NULL, logdate date NOT NULL, peaktemp int
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_y2026m10 PARTITION OF measurement
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

-- Hash: espalha por uma chave (útil quando não há um eixo natural de tempo)
CREATE TABLE m_p0 PARTITION OF measurement FOR VALUES WITH (MODULUS 4, REMAINDER 0);`} />
        <p><T pt={<>Duas restrições que importam: uma chave primária ou <code>UNIQUE</code> numa tabela particionada precisa incluir todas as colunas da chave de partição, e partições demais aumentam o tempo de planejamento.</>} en={<>Two restrictions that matter: a primary key or <code>UNIQUE</code> on a partitioned table must include all the partition key columns, and too many partitions increase planning time.</>} /></p>
        <h3><T pt="Escolher a chave de shard" en="Choosing the shard key" /></h3>
        <p><T pt={<>É a decisão mais difícil de desfazer. Uma boa chave: (1) aparece em quase toda consulta, para que ela caia em um shard só; (2) distribui bem, sem shards quentes; (3) mantém junto o que é consultado junto. Em SaaS multi-tenant, <code>tenant_id</code> costuma ser a escolha natural.</>} en={<>It is the hardest decision to undo. A good key: (1) appears in almost every query, so it lands on a single shard; (2) distributes evenly, with no hot shards; (3) keeps together what is queried together. In multi-tenant SaaS, <code>tenant_id</code> is usually the natural choice.</>} /></p>
        <Table
          head={[<T pt="Estratégia" en="Strategy" />, <T pt="Como decide o shard" en="How it picks the shard" />, <T pt="Bom para" en="Good for" />, <T pt="Problema" en="Problem" />]}
          rows={[
            [<T pt="Hash" en="Hash" />, <T pt={<><code>hash(chave) % N</code></>} en={<><code>hash(key) % N</code></>} />, <T pt="Distribuição uniforme" en="Even distribution" />, <T pt="Consulta por faixa vira todos os shards; mudar N remapeia quase tudo (sem buckets)" en="Range queries hit every shard; changing N remaps almost everything (without buckets)" />],
            [<T pt="Faixa (range)" en="Range" />, <T pt="Intervalos da chave (datas, IDs)" en="Key intervals (dates, IDs)" />, <T pt="Consultas por faixa; dados que envelhecem" en="Range queries; aging data" />, <T pt="Shard “do mês atual” recebe todas as escritas (quente)" en="The “current month” shard takes all writes (hot)" />],
            [<T pt="Diretório (lookup)" en="Directory (lookup)" />, <T pt="Uma tabela diz onde cada tenant está" en="A table says where each tenant lives" />, <T pt="Mover um tenant grande para um shard só dele" en="Moving a big tenant to a shard of its own" />, <T pt="O diretório vira dependência crítica e precisa de cache" en="The directory becomes a critical dependency and needs caching" />],
            [<T pt="Geográfico" en="Geographic" />, <T pt="Região do usuário" en="User's region" />, <T pt="Latência e residência de dados" en="Latency and data residency" />, <T pt="Usuário que viaja; distribuição desigual" en="Users who travel; uneven distribution" />],
          ]}
        />
        <Diagram minWidth={640} caption={<T pt="O hash mapeia a chave para um de 64 buckets fixos; só o mapa bucket → shard muda quando você adiciona um servidor." en="The hash maps the key to one of 64 fixed buckets; only the bucket → shard map changes when you add a server." />}>
          <svg viewBox="0 0 700 256" role="img" aria-label="Roteamento por buckets com um shard novo / Bucket routing with a new shard">
            <rect x="8" y="100" width="90" height="56" rx="4" className="ln fillsoft" />
            <text x="53.0" y="132.0" className="pt" textAnchor="middle">App</text>
            <text x="53.0" y="132.0" className="en" textAnchor="middle">App</text>
            <rect x="130" y="82" width="190" height="92" rx="4" className="ln brandfill" />
            <text x="225.0" y="125.0" className="pt" textAnchor="middle">Router</text>
            <text x="225.0" y="125.0" className="en" textAnchor="middle">Router</text>
            <text x="225.0" y="142.0" className="mut pt" textAnchor="middle">hash(tenant) % 64 = bucket</text>
            <text x="225.0" y="142.0" className="mut en" textAnchor="middle">hash(tenant) % 64 = bucket</text>
            <text x="225" y="160" className="mut mono pt" textAnchor="middle">mapa: bucket → shard</text>
            <text x="225" y="160" className="mut mono en" textAnchor="middle">map: bucket → shard</text>
            <rect x="380" y="20" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="43.0" className="pt" textAnchor="middle">Shard 0</text>
            <text x="455.0" y="43.0" className="en" textAnchor="middle">Shard 0</text>
            <text x="455.0" y="60.0" className="mut pt" textAnchor="middle">buckets 0 a 31</text>
            <text x="455.0" y="60.0" className="mut en" textAnchor="middle">buckets 0 to 31</text>
            <rect x="380" y="106" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="129.0" className="pt" textAnchor="middle">Shard 1</text>
            <text x="455.0" y="129.0" className="en" textAnchor="middle">Shard 1</text>
            <text x="455.0" y="146.0" className="mut pt" textAnchor="middle">buckets 32 a 63</text>
            <text x="455.0" y="146.0" className="mut en" textAnchor="middle">buckets 32 to 63</text>
            <rect x="380" y="192" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="215.0" className="pt" textAnchor="middle">Shard 2 (novo)</text>
            <text x="455.0" y="215.0" className="en" textAnchor="middle">Shard 2 (new)</text>
            <text x="455.0" y="232.0" className="mut pt" textAnchor="middle">recebe buckets movidos</text>
            <text x="455.0" y="232.0" className="mut en" textAnchor="middle">receives moved buckets</text>
            <rect x="570" y="20" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="50.0" className="pt" textAnchor="middle">Réplica 0</text>
            <text x="630.0" y="50.0" className="en" textAnchor="middle">Replica 0</text>
            <rect x="570" y="106" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="136.0" className="pt" textAnchor="middle">Réplica 1</text>
            <text x="630.0" y="136.0" className="en" textAnchor="middle">Replica 1</text>
            <rect x="570" y="192" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="222.0" className="pt" textAnchor="middle">Réplica 2</text>
            <text x="630.0" y="222.0" className="en" textAnchor="middle">Replica 2</text>
            <path d="M98 128L130 128" className="ln" />
            <path d="M122.8 131.5L130 128L122.8 124.5" className="ln" />
            <path d="M320 110L350 110L350 46L380 46" className="ln" />
            <path d="M372.8 49.5L380 46L372.8 42.5" className="ln" />
            <path d="M320 132L380 132" className="ln" />
            <path d="M372.8 135.5L380 132L372.8 128.5" className="ln" />
            <path d="M320 150L350 150L350 218L380 218" className="ln" />
            <path d="M372.8 221.5L380 218L372.8 214.5" className="ln" />
            <path d="M530 46L570 46" className="ln" />
            <path d="M562.8 49.5L570 46L562.8 42.5" className="ln" />
            <path d="M530 132L570 132" className="ln" />
            <path d="M562.8 135.5L570 132L562.8 128.5" className="ln" />
            <path d="M530 218L570 218" className="ln" />
            <path d="M562.8 221.5L570 218L562.8 214.5" className="ln" />
            <text x="550" y="36" className="mut mono pt" textAnchor="middle">WAL</text>
            <text x="550" y="36" className="mut mono en" textAnchor="middle">WAL</text>
          </svg>
        </Diagram>
        <p><T pt={<>O truque do desenho acima é o que torna o resharding viável: <b>shards lógicos (buckets) fixos, shards físicos variáveis</b>. A chave nunca muda de bucket; para crescer, você move alguns buckets de um servidor para outro e atualiza o mapa. Sem isso, <code>hash % N</code> com <code>N</code> novo obriga a mover quase todas as linhas.</>} en={<>The trick in the drawing above is what makes resharding viable: <b>fixed logical shards (buckets), variable physical shards</b>. A key never changes bucket; to grow, you move some buckets from one server to another and update the map. Without it, <code>hash % N</code> with a new <code>N</code> forces moving almost every row.</>} /></p>
        <h3><T pt="O que quebra" en="What breaks" /></h3>
        <Table
          head={[<T pt="Problema" en="Problem" />, <T pt="Por que" en="Why" />, <T pt="Como lidar" en="How to cope" />]}
          rows={[
            [<T pt="Consulta sem a chave de shard" en="Query without the shard key" />, <T pt={<>Precisa perguntar a todos os shards (<i>scatter-gather</i>) e juntar</>} en={<>Must ask every shard (<i>scatter-gather</i>) and merge</>} />, <T pt="Evite no caminho quente; relatórios vão para um data warehouse" en="Avoid on the hot path; reports go to a data warehouse" />],
            [<T pt="Join entre shards" en="Cross-shard join" />, <T pt="Os dados estão em máquinas diferentes" en="The data is on different machines" />, <T pt={<>Co-localizar tabelas pela mesma chave; replicar tabelas pequenas em todos os shards (<i>reference tables</i>)</>} en={<>Co-locate tables by the same key; replicate small tables on every shard (<i>reference tables</i>)</>} />],
            [<T pt="Transação entre shards" en="Cross-shard transaction" />, <T pt="Exige commit em duas fases ou compensação (saga)" en="Needs two-phase commit or compensation (saga)" />, <T pt="Desenhe para a transação caber em um shard" en="Design so the transaction fits one shard" />],
            [<T pt="IDs únicos" en="Unique IDs" />, <T pt={<><code>serial</code> repete entre shards</>} en={<><code>serial</code> repeats across shards</>} />, <T pt={<>UUID (o laboratório usa <code>gen_random_uuid()</code>) ou IDs com prefixo de tempo</>} en={<>UUIDs (the lab uses <code>gen_random_uuid()</code>) or time-prefixed IDs</>} />],
            [<T pt="Tenant gigante, shard quente" en="Giant tenant, hot shard" />, <T pt="Um tenant concentra a carga" en="One tenant concentrates the load" />, <T pt="Diretório para isolar o tenant num shard próprio" en="A directory to isolate the tenant on its own shard" />],
            [<T pt="Migrações de schema" en="Schema migrations" />, <T pt="N bancos para migrar, alguns podem falhar no meio" en="N databases to migrate, some may fail midway" />, <T pt="Migração versionada e idempotente, aplicada shard a shard" en="Versioned, idempotent migration applied shard by shard" />],
            [<T pt="Resharding" en="Resharding" />, <T pt="Mover dados com o sistema no ar" en="Moving data while the system is live" />, <T pt="Buckets fixos; copiar, sincronizar, trocar o mapa, apagar a origem" en="Fixed buckets; copy, sync, switch the map, delete the source" />],
          ]}
        />
        <h3><T pt="Três jeitos de fazer" en="Three ways to do it" /></h3>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Como funciona" en="How it works" />, <T pt="Quando" en="When" />]}
          rows={[
            [<T pt={<><b>No app</b> (o laboratório)</>} en={<><b>In the app</b> (the lab)</>} />, <T pt="O código calcula o bucket e escolhe a conexão." en="The code computes the bucket and picks the connection." />, <T pt="Poucos shards, equipe que aceita ser dona do roteamento e do resharding" en="Few shards, a team willing to own routing and resharding" />],
            [<T pt={<><b>Citus</b> (extensão do Postgres)</>} en={<><b>Citus</b> (Postgres extension)</>} />, <T pt={<>Um <i>coordinator</i> recebe o SQL e o envia aos <i>workers</i>. Tabelas distribuídas por uma coluna de distribuição, <i>reference tables</i> replicadas em todos os workers e <i>co-location</i> por chave. Sharding por linha (<code>tenant_id</code>) ou por schema (Citus 12+).</>} en={<>A <i>coordinator</i> receives the SQL and sends it to the <i>workers</i>. Tables distributed by a distribution column, <i>reference tables</i> replicated on every worker and key <i>co-location</i>. Row-based sharding (<code>tenant_id</code>) or schema-based (Citus 12+).</>} />, <T pt="Você quer SQL distribuído sem trocar de motor" en="You want distributed SQL without changing engines" />],
            [<T pt={<><b>Aurora PostgreSQL Limitless</b></>} en={<><b>Aurora PostgreSQL Limitless</b></>} />, <T pt={<><i>Routers</i> escondem os <i>shards</i> atrás de um endpoint de cluster. Três tipos de tabela: <i>sharded</i> (hash por uma chave, com co-location), <i>reference</i> (cópia em todos os shards) e <i>standard</i> (padrão, num shard só). Cada shard é uma instância Aurora (limite de 128 TiB).</>} en={<><i>Routers</i> hide the <i>shards</i> behind a cluster endpoint. Three table types: <i>sharded</i> (hash on a key, with co-location), <i>reference</i> (copy on every shard) and <i>standard</i> (default, on a single shard). Each shard is an Aurora instance (128 TiB limit).</>} />, <T pt="Já está na AWS e quer sharding gerenciado" en="Already on AWS and want managed sharding" />],
          ]}
        />
        <p><T pt="Em todos, a lição é a mesma da escolha da chave: o que for consultado e transacionado junto precisa ter a mesma chave de shard." en="In all of them the lesson is the same as for key choice: what is queried and transacted together must share the same shard key." /></p>
        <Callout tone="personal" icon="alert"><T pt={<><b>Nota pessoal, não verificada nas fontes:</b> o texto sobre a ordem de grandeza em que vale partir para sharding (“só depois de esgotar a escada”) é opinião minha. Não tenho um número de corte; ele depende da carga. Também não testei Citus nem Limitless; descrevi só o que as documentações dizem.</>} en={<><b>Personal note, not verified in the sources:</b> the claim about when sharding is worth it (“only after exhausting the ladder”) is my opinion. I have no cutoff number; it depends on load. I also did not test Citus or Limitless; I described only what the docs say.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}>
          <ul>
            <li><a href="https://www.postgresql.org/docs/current/ddl-partitioning.html">PostgreSQL Docs · Table partitioning</a></li>
            <li><a href="https://docs.citusdata.com/en/stable/get_started/concepts.html">Citus Docs · Concepts (coordinator, workers, distributed and reference tables, co-location)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless.html">AWS Docs · Aurora PostgreSQL Limitless Database</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless-architecture.html">AWS Docs · Limitless architecture (routers, shards, table types)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="e2e" title={<T pt="5. Uma requisição ponta a ponta" en="5. One request, end to end" />}>
        <p><T pt={<>O exemplo: um endpoint <code>POST /orders</code> cria um pedido e o cliente imediatamente faz <code>GET /orders/&#123;id&#125;</code>. É o caso em que a leitura na réplica mais dói. O desenho abaixo é o que o laboratório da seção 6 implementa.</>} en={<>The example: a <code>POST /orders</code> endpoint creates an order and the client immediately does <code>GET /orders/&#123;id&#125;</code>. It is the case where reading from the replica hurts most. The drawing below is what the section 6 lab implements.</>} /></p>
        <Diagram minWidth={640} caption={<T pt="O tempo corre para baixo. Os números são os passos da lista abaixo; tracejado é resposta." en="Time runs downward. The numbers are the steps in the list below; dashed is a response." />}>
          <svg viewBox="0 0 700 326" role="img" aria-label="Uma escrita e a leitura seguinte / One write and the read that follows">
            <rect x="15" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="70.0" y="30.0" className="pt" textAnchor="middle">Cliente</text>
            <text x="70.0" y="30.0" className="en" textAnchor="middle">Client</text>
            <path d="M70 46L70 318" className="ln dash" />
            <rect x="185" y="6" width="110" height="40" rx="4" className="ln brandfill" />
            <text x="240.0" y="30.0" className="pt" textAnchor="middle">API</text>
            <text x="240.0" y="30.0" className="en" textAnchor="middle">API</text>
            <path d="M240 46L240 318" className="ln dash" />
            <rect x="375" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="430.0" y="30.0" className="pt" textAnchor="middle">Primário</text>
            <text x="430.0" y="30.0" className="en" textAnchor="middle">Primary</text>
            <path d="M430 46L430 318" className="ln dash" />
            <rect x="565" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="620.0" y="30.0" className="pt" textAnchor="middle">Réplica</text>
            <text x="620.0" y="30.0" className="en" textAnchor="middle">Replica</text>
            <path d="M620 46L620 318" className="ln dash" />
            <path d="M70 76L240 76" className="ln" />
            <path d="M232.8 79.5L240 76L232.8 72.5" className="ln" />
            <text x="78" y="70" className="mono pt" textAnchor="start">1 POST /orders</text>
            <text x="78" y="70" className="mono en" textAnchor="start">1 POST /orders</text>
            <path d="M240 102L430 102" className="ln" />
            <path d="M422.8 105.5L430 102L422.8 98.5" className="ln" />
            <text x="248" y="96" className="mono pt" textAnchor="start">2 INSERT RETURNING id</text>
            <text x="248" y="96" className="mono en" textAnchor="start">2 INSERT RETURNING id</text>
            <path d="M240 128L430 128" className="ln" />
            <path d="M422.8 131.5L430 128L422.8 124.5" className="ln" />
            <text x="248" y="122" className="mono pt" textAnchor="start">3 pg_current_wal_lsn()</text>
            <text x="248" y="122" className="mono en" textAnchor="start">3 pg_current_wal_lsn()</text>
            <path d="M240 154L70 154" className="ln dash" />
            <path d="M77.2 157.5L70 154L77.2 150.5" className="ln" />
            <text x="78" y="148" className="mono pt" textAnchor="start">3 201 + X-Min-LSN</text>
            <text x="78" y="148" className="mono en" textAnchor="start">3 201 + X-Min-LSN</text>
            <path d="M430 180L620 180" className="ln" />
            <path d="M612.8 183.5L620 180L612.8 176.5" className="ln" />
            <text x="438" y="174" className="mono pt" textAnchor="start">4 WAL (assíncrono)</text>
            <text x="438" y="174" className="mono en" textAnchor="start">4 WAL (async)</text>
            <path d="M70 210L240 210" className="ln" />
            <path d="M232.8 213.5L240 210L232.8 206.5" className="ln" />
            <text x="78" y="204" className="mono pt" textAnchor="start">5 GET + X-Min-LSN</text>
            <text x="78" y="204" className="mono en" textAnchor="start">5 GET + X-Min-LSN</text>
            <path d="M240 236L620 236" className="ln" />
            <path d="M612.8 239.5L620 236L612.8 232.5" className="ln" />
            <text x="248" y="230" className="mono pt" textAnchor="start">6 replay_lsn &gt;= token ?</text>
            <text x="248" y="230" className="mono en" textAnchor="start">6 replay_lsn &gt;= token ?</text>
            <path d="M620 262L240 262" className="ln dash" />
            <path d="M247.2 265.5L240 262L247.2 258.5" className="ln" />
            <text x="248" y="256" className="mono pt" textAnchor="start">sim: lê aqui</text>
            <text x="248" y="256" className="mono en" textAnchor="start">yes: read here</text>
            <path d="M240 288L430 288" className="ln" />
            <path d="M422.8 291.5L430 288L422.8 284.5" className="ln" />
            <text x="248" y="282" className="mono pt" textAnchor="start">não: lê do primário</text>
            <text x="248" y="282" className="mono en" textAnchor="start">no: read from primary</text>
            <path d="M240 312L70 312" className="ln dash" />
            <path d="M77.2 315.5L70 312L77.2 308.5" className="ln" />
            <text x="78" y="306" className="mono pt" textAnchor="start">200 + served_by</text>
            <text x="78" y="306" className="mono en" textAnchor="start">200 + served_by</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><T pt={<><b>POST /orders.</b> O router sabe que isto é escrita e abre conexão com o <b>primário</b>.</>} en={<><b>POST /orders.</b> The router knows this is a write and opens a connection to the <b>primary</b>.</>} /></li>
          <li><T pt={<><b>INSERT ... RETURNING id.</b> O primário grava no WAL e confirma o commit. Assíncrono: não espera a réplica.</>} en={<><b>INSERT ... RETURNING id.</b> The primary writes to the WAL and acknowledges the commit. Asynchronous: it does not wait for the replica.</>} /></li>
          <li><T pt={<><b>Token.</b> Logo <i>depois</i> do commit, a API lê <code>pg_current_wal_lsn()</code>. Como foi lido depois, é maior ou igual à posição do commit. A resposta carrega o id e o cabeçalho <code>X-Min-LSN</code>.</>} en={<><b>Token.</b> Right <i>after</i> the commit, the API reads <code>pg_current_wal_lsn()</code>. Since it was read after, it is greater than or equal to the commit's position. The response carries the id and the <code>X-Min-LSN</code> header.</>} /></li>
          <li><T pt={<><b>Replicação.</b> Em paralelo, o walsender envia o WAL; a réplica o grava e reaplica. Milissegundos, mas não zero.</>} en={<><b>Replication.</b> In parallel, the walsender ships the WAL; the replica writes and replays it. Milliseconds, but not zero.</>} /></li>
          <li><T pt={<><b>GET /orders/&#123;id&#125;</b> com <code>X-Min-LSN</code>. O router quer usar a réplica, para poupar o primário.</>} en={<><b>GET /orders/&#123;id&#125;</b> with <code>X-Min-LSN</code>. The router wants to use the replica, to spare the primary.</>} /></li>
          <li><T pt={<><b>Checagem.</b> Na réplica, <code>SELECT pg_last_wal_replay_lsn() &gt;= token</code>. Se verdadeiro, a réplica já enxerga o pedido e responde (<code>served_by: replica</code>). Se falso, ou se a réplica estiver fora do ar, a API lê do primário (<code>served_by: primary (...)</code>). A posição de reaplicação só avança, então a checagem não tem condição de corrida.</>} en={<><b>Check.</b> On the replica, <code>SELECT pg_last_wal_replay_lsn() &gt;= token</code>. If true, the replica already sees the order and answers (<code>served_by: replica</code>). If false, or if the replica is down, the API reads from the primary (<code>served_by: primary (...)</code>). The replay position only advances, so the check has no race condition.</>} /></li>
        </ol>
        <Table
          head={[<T pt="Situação" en="Situation" />, <T pt="Sem o token (split ingênuo)" en="Without the token (naive split)" />, <T pt="Com o token" en="With the token" />]}
          rows={[
            [<T pt="Réplica em dia" en="Replica caught up" />, <T pt="Lê da réplica" en="Reads from the replica" />, <T pt="Lê da réplica (uma checagem a mais)" en="Reads from the replica (one extra check)" />],
            [<T pt="Réplica atrasada" en="Replica lagging" />, <T pt={<><b>404</b>: o pedido “não existe”</>} en={<><b>404</b>: the order “does not exist”</>} />, <T pt="Lê do primário: correto, mais lento" en="Reads from the primary: correct, slower" />],
            [<T pt="Réplica fora do ar" en="Replica down" />, <T pt="Erro, a menos que haja fallback" en="Error, unless there is a fallback" />, <T pt="Lê do primário" en="Reads from the primary" />],
            [<T pt="Primário fora do ar" en="Primary down" />, <T pt="Escritas falham; leituras seguem na réplica" en="Writes fail; reads continue on the replica" />, <T pt="Escritas falham; leituras com token falham até o failover (a réplica não prova estar em dia)" en="Writes fail; token reads fail until failover (the replica cannot prove it is current)" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>O que esse desenho não resolve.</b> (1) O token precisa viajar: cabeçalho, cookie ou sessão; se o cliente o perde, volta ao split ingênuo. (2) Se a réplica fica muito atrás, quase todas as leituras vão ao primário: o lag vira carga no primário. Alarme o lag. (3) Entre dois pedidos diferentes de usuários diferentes, a leitura ainda pode ser velha; para isso o token não é necessário e a estratégia é aceitar.</>} en={<><b>What this design does not solve.</b> (1) The token has to travel: header, cookie or session; if the client loses it, you are back to the naive split. (2) If the replica falls far behind, nearly every read goes to the primary: lag becomes load on the primary. Alarm on lag. (3) Between requests from different users, a read may still be stale; the token is not needed for that and the strategy is to accept it.</>} /></Callout>
      </Section>
      <Section id="lab" title={<T pt="6. Laboratório em Docker: primário, réplica, API e shards" en="6. Docker lab: primary, replica, API and shards" />}>
        <p><T pt={<>O laboratório sobe um Postgres 18 primário, uma réplica de verdade (feita com <code>pg_basebackup -R</code>, em streaming replication), uma API em Python que separa leitura e escrita com o token da seção 5 e, num perfil à parte, dois shards do roteamento por buckets da seção 4. Só a API tem dependência externa (<code>psycopg</code>).</>} en={<>The lab starts a primary Postgres 18, a real replica (made with <code>pg_basebackup -R</code>, in streaming replication), a Python API that splits reads and writes using the section 5 token and, under a separate profile, two shards with the section 4 bucket routing. Only the API has an external dependency (<code>psycopg</code>).</>} /></p>
        <Callout tone="use" icon="check"><T pt={<><b>O que eu testei.</b> Subi tudo no Docker (versão 29, Postgres 18.6) e rodei os dois cenários abaixo, e as saídas mostradas são as reais, só reformatadas. Verifiquei que a réplica está em <code>streaming</code>, que ela recusa escrita e que a leitura obsoleta acontece e é corrigida pelo token. <b>Não testei na AWS.</b></>} en={<><b>What I tested.</b> I brought everything up in Docker (version 29, Postgres 18.6) and ran the two scenarios below, and the outputs shown are real, just reformatted. I verified the replica is in <code>streaming</code>, that it refuses writes, and that the stale read happens and is fixed by the token. <b>I did not test on AWS.</b></>} /></Callout>
        <h3><T pt="Estrutura" en="Layout" /></h3>
        <CodeBlock code={`db-lab/
├── compose.yaml
├── replica.sh              # pg_basebackup -R e sobe o standby
├── initdb/
│   ├── 00-replication.sh   # usuário de replicação + pg_hba
│   └── 10-schema.sql       # tabela orders
├── app/
│   ├── Dockerfile
│   └── app.py              # API: split leitura/escrita + sharding
└── demo.sh                 # o cenário ponta a ponta`} />
        <h3><T pt="compose.yaml" en="compose.yaml" /></h3>
        <CodeBlock code={`x-pg: &pg
  image: postgres:18.6-alpine
  environment:
    POSTGRES_USER: app
    POSTGRES_PASSWORD: secret
    POSTGRES_DB: shop

services:
  primary:
    <<: *pg
    command: ["postgres", "-c", "wal_level=replica", "-c", "max_wal_senders=5", "-c", "max_slot_wal_keep_size=256MB"]
    volumes:
      - ./initdb:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d shop"]
      interval: 2s
      retries: 30

  replica:
    <<: *pg
    user: postgres
    entrypoint: ["/replica.sh"]
    volumes:
      - ./replica.sh:/replica.sh:ro
      - replica-data:/var/lib/postgresql
    depends_on:
      primary: { condition: service_healthy }

  api:
    build: ./app
    environment:
      PRIMARY_DSN: postgresql://app:secret@primary/shop
      REPLICA_DSN: postgresql://app:secret@replica/shop
      SHARD_DSNS: postgresql://app:secret@shard0/shop,postgresql://app:secret@shard1/shop
    ports: ["8080:8080"]
    depends_on: [replica]

  shard0:
    <<: *pg
    profiles: [shard]
    volumes: ["./initdb/10-schema.sql:/docker-entrypoint-initdb.d/10-schema.sql:ro"]
  shard1:
    <<: *pg
    profiles: [shard]
    volumes: ["./initdb/10-schema.sql:/docker-entrypoint-initdb.d/10-schema.sql:ro"]

volumes:
  replica-data:`} />
        <h3><T pt="initdb/00-replication.sh" en="initdb/00-replication.sh" /></h3>
        <CodeBlock code={`#!/bin/sh
set -e
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \\
  -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replpass'"
echo "host replication replicator all scram-sha-256" >> "$PGDATA/pg_hba.conf"`} />
        <h3><T pt="initdb/10-schema.sql" en="initdb/10-schema.sql" /></h3>
        <CodeBlock code={`CREATE TABLE orders (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  text        NOT NULL,
    customer   text        NOT NULL,
    total      numeric(10,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_tenant_idx ON orders (tenant_id, created_at DESC);`} />
        <h3><T pt="replica.sh" en="replica.sh" /></h3>
        <CodeBlock code={`#!/bin/sh
set -e
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  PGPASSWORD=replpass pg_basebackup -h primary -U replicator -D "$PGDATA" \\
    -R -X stream -C -S replica1
  chmod 700 "$PGDATA"
fi
exec postgres -c hot_standby=on -c hot_standby_feedback=on`} />
        <h3><T pt="app/Dockerfile" en="app/Dockerfile" /></h3>
        <CodeBlock code={`FROM python:3.12-slim
RUN pip install --no-cache-dir "psycopg[binary]==3.2.*"
WORKDIR /app
COPY app.py .
USER 10001
CMD ["python", "-u", "app.py"]`} />
        <p><T pt={<>A API inteira cabe em um arquivo. Leia <code>create_order</code> e <code>read_order</code> (token e fallback) e depois <code>bucket_of</code> e <code>shard_of</code> (sharding):</>} en={<>The whole API fits in one file. Read <code>create_order</code> and <code>read_order</code> (token and fallback) and then <code>bucket_of</code> and <code>shard_of</code> (sharding):</>} /></p>
        <h3><T pt="app/app.py" en="app/app.py" /></h3>
        <CodeBlock code={`import hashlib
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg

PRIMARY = os.environ["PRIMARY_DSN"]
REPLICA = os.environ["REPLICA_DSN"]
SHARDS = os.environ["SHARD_DSNS"].split(",")
BUCKETS = 64  # logical shards: fixed forever; only the bucket -> server map changes


def connect(dsn):
    return psycopg.connect(dsn, autocommit=True, connect_timeout=2)


# ---- read/write split with read-your-writes --------------------------------
def create_order(tenant, customer, total):
    with connect(PRIMARY) as db:
        order_id = db.execute(
            "INSERT INTO orders (tenant_id, customer, total) VALUES (%s, %s, %s) RETURNING id",
            (tenant, customer, total),
        ).fetchone()[0]
        # taken AFTER the commit, so it is >= the commit's position in the WAL
        lsn = db.execute("SELECT pg_current_wal_lsn()::text").fetchone()[0]
    return {"id": str(order_id), "min_lsn": lsn, "served_by": "primary"}


def read_order(order_id, min_lsn):
    reason = "no token"
    try:
        with connect(REPLICA) as db:
            fresh = min_lsn is None or db.execute(
                "SELECT pg_last_wal_replay_lsn() >= %s::pg_lsn", (min_lsn,)
            ).fetchone()[0]
            if fresh:
                row = db.execute(
                    "SELECT id, customer, total FROM orders WHERE id = %s", (order_id,)
                ).fetchone()
                return row, "replica"
            reason = "replica behind the token"
    except psycopg.OperationalError:
        reason = "replica unreachable"
    with connect(PRIMARY) as db:
        row = db.execute("SELECT id, customer, total FROM orders WHERE id = %s", (order_id,)).fetchone()
    return row, f"primary ({reason})"


def lag():
    with connect(PRIMARY) as db:
        return db.execute(
            "SELECT application_name, state, sync_state, "
            "pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)::bigint AS replay_lag_bytes "
            "FROM pg_stat_replication"
        ).fetchall()


# ---- sharding by tenant -----------------------------------------------------
def bucket_of(tenant):
    return int.from_bytes(hashlib.sha256(tenant.encode()).digest()[:8], "big") % BUCKETS


def shard_of(tenant):
    return bucket_of(tenant) * len(SHARDS) // BUCKETS  # buckets 0..31 -> shard 0, 32..63 -> shard 1


def shard_create(tenant, customer, total):
    with connect(SHARDS[shard_of(tenant)]) as db:
        order_id = db.execute(
            "INSERT INTO orders (tenant_id, customer, total) VALUES (%s, %s, %s) RETURNING id",
            (tenant, customer, total),
        ).fetchone()[0]
    return {"id": str(order_id), "tenant": tenant, "bucket": bucket_of(tenant), "shard": shard_of(tenant)}


def shard_list(tenant):
    with connect(SHARDS[shard_of(tenant)]) as db:  # single-shard query: tenant_id is in the WHERE
        rows = db.execute(
            "SELECT customer, total FROM orders WHERE tenant_id = %s ORDER BY created_at DESC", (tenant,)
        ).fetchall()
    return {"tenant": tenant, "shard": shard_of(tenant), "orders": [[c, str(t)] for c, t in rows]}


def shard_stats():
    out = []  # scatter-gather: touches every shard
    for i, dsn in enumerate(SHARDS):
        with connect(dsn) as db:
            n, s = db.execute("SELECT count(*), coalesce(sum(total), 0) FROM orders").fetchone()
        out.append({"shard": i, "orders": n, "revenue": str(s)})
    return {"shards": out, "total_orders": sum(x["orders"] for x in out)}


class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body, headers=()):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        for k, v in headers:
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def body(self):
        return json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or "{}")

    def do_POST(self):
        parts = self.path.strip("/").split("/")
        data = self.body()
        if parts == ["orders"]:
            out = create_order(data.get("tenant", "acme"), data["customer"], data["total"])
            return self.reply(201, out, [("X-Min-LSN", out["min_lsn"])])
        if len(parts) == 3 and parts[0] == "t" and parts[2] == "orders":
            return self.reply(201, shard_create(parts[1], data["customer"], data["total"]))
        self.reply(404, {"error": "not found"})

    def do_GET(self):
        parts = self.path.strip("/").split("/")
        if len(parts) == 2 and parts[0] == "orders":
            row, served_by = read_order(parts[1], self.headers.get("X-Min-LSN"))
            if row is None:
                return self.reply(404, {"error": "order not found", "served_by": served_by})
            return self.reply(200, {"id": str(row[0]), "customer": row[1], "total": str(row[2]), "served_by": served_by})
        if parts == ["lag"]:
            return self.reply(200, [dict(zip(("replica", "state", "sync", "replay_lag_bytes"), r)) for r in lag()])
        if len(parts) == 3 and parts[0] == "t" and parts[2] == "orders":
            return self.reply(200, shard_list(parts[1]))
        if parts == ["stats"]:
            return self.reply(200, shard_stats())
        self.reply(404, {"error": "not found"})


ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()`} />
        <h3><T pt="Cenário 1: réplica saudável, atrasada e fora do ar" en="Scenario 1: replica healthy, lagging and down" /></h3>
        <CodeBlock code={`docker compose up -d --build primary replica api
docker compose exec primary psql -U app -d shop -c "select application_name,state,sync_state from pg_stat_replication"
#  application_name |   state   | sync_state
#  walreceiver      | streaming | async
./demo.sh`} />
        <h3><T pt="demo.sh" en="demo.sh" /></h3>
        <CodeBlock code={`#!/bin/sh
# end-to-end: one write and its reads, with the replica healthy, lagging and down
api=http://localhost:8080
sql() { docker compose exec -T replica psql -U app -d shop -tAc "$1"; }
post() { curl -s -D /tmp/h -X POST $api/orders -d "{\\"customer\\":\\"$1\\",\\"total\\":$2}"; }

echo "== 1. write goes to the primary and returns a token (WAL position)"
out=$(post ana 49.90); echo "$out"
id=$(echo "$out" | sed 's/.*"id": "\\([^"]*\\)".*/\\1/'); lsn=$(grep -i x-min-lsn /tmp/h | tr -d '\\r' | cut -d' ' -f2)
sleep 1
echo "== 2. read with the token: replica has already replayed it"
curl -s -H "X-Min-LSN: $lsn" $api/orders/$id; echo

echo "== 3. freeze replay on the replica (simulates lag)"
sql "SELECT pg_wal_replay_pause()" >/dev/null
out=$(post bruno 120.00); echo "$out"
id=$(echo "$out" | sed 's/.*"id": "\\([^"]*\\)".*/\\1/'); lsn=$(grep -i x-min-lsn /tmp/h | tr -d '\\r' | cut -d' ' -f2)
echo "-- read WITHOUT token (naive split): stale read"
curl -s $api/orders/$id; echo
echo "-- read WITH token: falls back to the primary"
curl -s -H "X-Min-LSN: $lsn" $api/orders/$id; echo
echo "-- lag as seen by the primary"
curl -s $api/lag; echo

echo "== 4. resume replay: the same read goes back to the replica"
sql "SELECT pg_wal_replay_resume()" >/dev/null; sleep 1
curl -s -H "X-Min-LSN: $lsn" $api/orders/$id; echo

echo "== 5. replica down: reads survive on the primary"
docker compose stop -t 1 replica >/dev/null 2>&1
curl -s -H "X-Min-LSN: $lsn" $api/orders/$id; echo
docker compose start replica >/dev/null 2>&1`} />
        <p><T pt={<>Saída real (o <code>pg_wal_replay_pause()</code> congela a reaplicação na réplica, simulando lag):</>} en={<>Real output (<code>pg_wal_replay_pause()</code> freezes replay on the replica, simulating lag):</>} /></p>
        <CodeBlock code={`== 1. write goes to the primary and returns a token (WAL position)
{"id": "92c500b3-...", "min_lsn": "0/3047348", "served_by": "primary"}
== 2. read with the token: replica has already replayed it
{"id": "92c500b3-...", "customer": "ana", "total": "49.90", "served_by": "replica"}
== 3. freeze replay on the replica (simulates lag)
{"id": "6dc4dfd0-...", "min_lsn": "0/3047460", "served_by": "primary"}
-- read WITHOUT token (naive split): stale read
{"error": "order not found", "served_by": "replica"}
-- read WITH token: falls back to the primary
{"id": "6dc4dfd0-...", "customer": "bruno", "total": "120.00", "served_by": "primary (replica behind the token)"}
-- lag as seen by the primary
[{"replica": "walreceiver", "state": "streaming", "sync": "async", "replay_lag_bytes": 280}]
== 4. resume replay: the same read goes back to the replica
{"id": "6dc4dfd0-...", "customer": "bruno", "total": "120.00", "served_by": "replica"}
== 5. replica down: reads survive on the primary
{"id": "6dc4dfd0-...", "customer": "bruno", "total": "120.00", "served_by": "primary (replica unreachable)"}`} />
        <p><T pt={<>Repare no passo 3: a leitura <b>sem</b> o token devolveu um 404 de um pedido que acabou de ser criado. É a anomalia de <i>read-your-writes</i> reproduzida, com a réplica respondendo com toda a confiança.</>} en={<>Note step 3: the read <b>without</b> the token returned a 404 for an order that had just been created. It is the read-your-writes anomaly reproduced, with the replica answering with full confidence.</>} /></p>
        <h3><T pt="Cenário 2: sharding por tenant" en="Scenario 2: sharding by tenant" /></h3>
        <CodeBlock code={`docker compose --profile shard up -d shard0 shard1
docker compose up -d api          # recria a API já com os shards no ar

# 8 tenants x 3 pedidos cada
curl -X POST localhost:8080/t/acme/orders -d '{"customer":"zed","total":5}'
# {"id": "ebdca5ae-...", "tenant": "acme", "bucket": 32, "shard": 1}

curl localhost:8080/t/acme/orders      # consulta de UM shard (tem a chave)
# {"tenant": "acme", "shard": 1, "orders": [["zed","5.00"],["c3","30.00"],["c2","20.00"],["c1","10.00"]]}

curl localhost:8080/stats              # scatter-gather: consulta TODOS os shards
# {"shards": [{"shard": 0, "orders": 12, "revenue": "240.00"},
#             {"shard": 1, "orders": 13, "revenue": "245.00"}], "total_orders": 25}

# onde cada tenant caiu
# acme 32->1  globex 39->1  initech 3->0  umbrella 32->1
# hooli 11->0 stark 14->0   wayne 31->0   wonka 62->1`} />
        <p><T pt={<>A distribuição ficou equilibrada (12 e 13 pedidos) com só 8 tenants. Note também que <code>acme</code> e <code>umbrella</code> caíram no mesmo bucket (32), o que é normal com 64 buckets: o bucket é uma unidade de movimentação, não de isolamento.</>} en={<>The distribution came out balanced (12 and 13 orders) with only 8 tenants. Also note that <code>acme</code> and <code>umbrella</code> landed in the same bucket (32), which is normal with 64 buckets: the bucket is a unit of movement, not of isolation.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><b>Este laboratório não faz resharding.</b> Ele mostra o roteamento (bucket para shard) e a consulta em todos os shards, mas não move dados. Mover um bucket de verdade exige copiar as linhas, sincronizar as escritas feitas durante a cópia (por exemplo, com replicação lógica), trocar o mapa de forma atômica e só então apagar a origem. Também não há réplicas por shard nem tolerância a falha de shard.</>} en={<><b>This lab does not reshard.</b> It shows the routing (bucket to shard) and the query across all shards, but it does not move data. Really moving a bucket requires copying the rows, syncing the writes made during the copy (for example, with logical replication), switching the map atomically and only then deleting the source. There are also no per-shard replicas or shard-failure tolerance.</>} /></Callout>
        <h3><T pt="Limpar e exercícios" en="Cleanup and exercises" /></h3>
        <CodeBlock code={`docker compose --profile shard down -v`} />
        <ol className="ds-steps">
          <li><T pt={<>Coloque <code>synchronous_standby_names = 'replica1'</code> e <code>synchronous_commit = remote_apply</code> no primário. Repita o cenário 1: o passo 3 trava o <code>POST</code>? Por quê? (Dica: a réplica está com a reaplicação pausada.)</>} en={<>Set <code>synchronous_standby_names = 'replica1'</code> and <code>synchronous_commit = remote_apply</code> on the primary. Repeat scenario 1: does step 3 block the <code>POST</code>? Why? (Hint: the replica has replay paused.)</>} /></li>
          <li><T pt={<>Desligue o <code>hot_standby_feedback</code>, rode um <code>pg_sleep(60)</code> numa transação na réplica e um <code>UPDATE</code> mais <code>VACUUM</code> no primário. Veja a consulta ser cancelada e consulte <code>pg_stat_database_conflicts</code>.</>} en={<>Turn off <code>hot_standby_feedback</code>, run a <code>pg_sleep(60)</code> in a transaction on the replica and an <code>UPDATE</code> plus <code>VACUUM</code> on the primary. Watch the query get cancelled and check <code>pg_stat_database_conflicts</code>.</>} /></li>
          <li><T pt={<>Pare o primário e promova a réplica com <code>SELECT pg_promote()</code>. O que a API faz? O que precisa mudar para o failover ser automático?</>} en={<>Stop the primary and promote the replica with <code>SELECT pg_promote()</code>. What does the API do? What has to change for failover to be automatic?</>} /></li>
          <li><T pt={<>Adicione um terceiro shard: mude <code>shard_of</code> para usar um mapa explícito bucket → shard, mova um bucket à mão (<code>INSERT ... SELECT</code> entre os dois bancos) e troque o mapa.</>} en={<>Add a third shard: change <code>shard_of</code> to use an explicit bucket → shard map, move one bucket by hand (<code>INSERT ... SELECT</code> between the two databases) and switch the map.</>} /></li>
        </ol>
      </Section>
      <Section id="cheat" title={<T pt="7. Decisão e checklist" en="7. Decision and checklist" />}>
        <Table
          head={[<T pt="Se você precisa de..." en="If you need..." />, <T pt="Use" en="Use" />]}
          rows={[
            [<T pt="Sobreviver à queda do primário" en="Surviving the primary's failure" />, <T pt="Multi-AZ (instância ou cluster) ou Aurora; teste o failover" en="Multi-AZ (instance or cluster) or Aurora; test the failover" />],
            [<T pt="Aliviar leitura e relatórios" en="Offloading reads and reports" />, <T pt="Réplicas de leitura; réplica de relatório separada da de failover" en="Read replicas; reporting replica separate from the failover one" />],
            [<T pt="Ler o que acabou de escrever" en="Reading what you just wrote" />, <T pt="Token de LSN, janela pós-escrita ou ler do primário" en="LSN token, post-write window or reading from the primary" />],
            [<T pt="Muitas conexões, Lambda, picos" en="Many connections, Lambda, spikes" />, <T pt="RDS Proxy ou PgBouncer" en="RDS Proxy or PgBouncer" />],
            [<T pt="Leitura perto do usuário em outra Região" en="Reads near users in another Region" />, <T pt="Aurora Global Database (ou réplica entre Regiões no RDS)" en="Aurora Global Database (or a cross-Region replica on RDS)" />],
            [<T pt="Tabela enorme, sem escala de escrita necessária" en="Huge table, no write scaling needed" />, <T pt="Particionamento declarativo" en="Declarative partitioning" />],
            [<T pt="Escrita e volume além de um servidor" en="Writes and volume beyond one server" />, <T pt="Sharding: Citus, Aurora Limitless ou no app" en="Sharding: Citus, Aurora Limitless or in the app" />],
          ]}
        />
        <h3><T pt="Checklist" en="Checklist" /></h3>
        <ul className="ds-list">
          <li><T pt="Meça antes: qual é o gargalo? CPU, IO, conexões, leitura, escrita?" en="Measure first: what is the bottleneck? CPU, IO, connections, reads, writes?" /></li>
          <li><T pt="Cada leitura classificada: pode ser velha? Se não, vai ao primário ou usa token." en="Every read classified: may it be stale? If not, it goes to the primary or uses a token." /></li>
          <li><T pt={<>Transação que escreve (ou usa <code>FOR UPDATE</code>) inteira no primário.</>} en={<>A transaction that writes (or uses <code>FOR UPDATE</code>) entirely on the primary.</>} /></li>
          <li><T pt="Alarme de lag, de WAL retido e de conexões; fallback para o primário se a réplica falhar." en="Alarms on lag, retained WAL and connections; fallback to the primary if the replica fails." /></li>
          <li><T pt={<>Réplica de relatório com <code>max_standby_streaming_delay</code> alto, separada da de failover.</>} en={<>Reporting replica with a high <code>max_standby_streaming_delay</code>, separate from the failover one.</>} /></li>
          <li><T pt="Failover testado de verdade, com a aplicação reconectando (DNS e pool)." en="Failover tested for real, with the application reconnecting (DNS and pool)." /></li>
          <li><T pt="Se for fazer shard: chave que aparece em quase toda consulta, buckets fixos, UUIDs, migrações versionadas." en="If you shard: a key that appears in almost every query, fixed buckets, UUIDs, versioned migrations." /></li>
          <li><T pt="Cada shard com as suas réplicas e o seu backup." en="Each shard with its own replicas and backup." /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><b>Limites desta nota.</b> Os dados e comportamentos vêm das documentações citadas em cada seção, consultadas em 26/10/2026; limites, preços e versões da AWS mudam. O laboratório foi testado no Docker, com um primário e uma réplica de verdade; nada foi executado na AWS, e Citus e Limitless não foram testados.</>} en={<><b>Limits of this note.</b> Facts and behaviors come from the docs cited in each section, consulted on 2026-10-26; AWS limits, prices and versions change. The lab was tested in Docker, with a real primary and replica; nothing was run on AWS, and Citus and Limitless were not tested.</>} /></Callout>
      </Section>
    </>
  );
}
