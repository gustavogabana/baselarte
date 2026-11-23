import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-replicas-sharding",
  title: { en: "Scaling databases: read replicas", pt: "Escala de banco: réplicas de leitura" },
  seo: {
    title: { en: "Database read replicas: WAL, replication lag and AWS (Postgres)", pt: "Réplicas de leitura: WAL, lag de replicação e AWS (Postgres)" },
    description: { en: "How to scale reads beyond one server: the WAL, read replicas, replication lag and read-your-writes, Multi-AZ, Aurora and RDS Proxy.", pt: "Como escalar a leitura além de um servidor: o WAL, réplicas de leitura, lag de replicação e read-your-writes, Multi-AZ, Aurora e RDS Proxy." },
  },
  summary: "the database scaling ladder, how the WAL feeds replicas, replication lag and read-your-writes, hot standby conflicts, RDS read replicas, Multi-AZ, Aurora and RDS Proxy, with a decision checklist. Sharding and a Docker lab are in a companion note.",
  kicker: { en: "Databases", pt: "Bancos de dados" },
  heroTitle: { en: <>Reads, writes and replicas: <em>scaling a database past one server.</em></>, pt: <>Leitura, escrita e réplicas: <em>escalar um banco além de um servidor.</em></> },
  heroLede: { en: "How the WAL feeds replicas, what replication lag breaks and how to live with it, and what AWS offers (RDS, Multi-AZ, Aurora, Proxy).", pt: "Como o WAL alimenta as réplicas, o que o lag de replicação quebra e como conviver com ele, e o que a AWS oferece (RDS, Multi-AZ, Aurora, Proxy)." },
  published: "2026-10-26",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "map", title: <T pt="O problema e a escada" en="The problem and the ladder" /> },
        { id: "replication", title: <T pt="1. Primário, WAL e réplicas" en="1. Primary, WAL and replicas" /> },
        { id: "replicas", title: <T pt="2. Lidar com réplicas" en="2. Living with replicas" /> },
        { id: "aws", title: <T pt="3. Na AWS" en="3. On AWS" /> },
        { id: "cheat", title: <T pt="4. Decisão e checklist" en="4. Decision and checklist" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={<T pt="O problema e a escada" en="The problem and the ladder" />}>
        <p><T pt={<>Um banco em um servidor só cresce até o limite da máquina: CPU, memória, disco, conexões. Depois disso há duas perguntas diferentes, e elas têm respostas diferentes. <b>Leitura demais?</b> Réplicas copiam os dados para outras máquinas que só respondem consultas.</>} en={<>A database on one server grows until the machine's limit: CPU, memory, disk, connections. Past that there are two different questions with different answers. <b>Too many reads?</b> Replicas copy the data to other machines that only answer queries.</>} /></p>
        <p><T pt={<><b>Escrita demais, ou dados demais para um disco?</b> Só dividir os dados entre servidores (sharding) resolve, porque toda escrita de uma linha ainda passa por um único primário.</>} en={<><b>Too many writes, or too much data for one disk?</b> Only splitting the data across servers (sharding) solves it, because every write to a row still goes through a single primary.</>} /></p>
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
        <p><T pt={<>Todo banco relacional grava as mudanças primeiro em um log (no Postgres, o <b>WAL</b>, <i>write-ahead log</i>) e só depois nos arquivos de dados.</>} en={<>Every relational database writes changes first to a log (in Postgres, the <b>WAL</b>, <i>write-ahead log</i>) and only then to the data files.</>} /></p>
        <p><T pt={<>A <i>streaming replication</i> do Postgres aproveita isso: o primário envia o WAL a um standby assim que ele é gerado, sem esperar o segmento de 16 MB encher, e o standby reaplica as mudanças. Em modo assíncrono ele costuma ficar menos de um segundo atrás.</>} en={<>Postgres <i>streaming replication</i> builds on that: the primary sends the WAL to a standby as soon as it is generated, without waiting for the 16 MB segment to fill, and the standby replays the changes. In asynchronous mode it is usually under a second behind.</>} /></p>
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
        <p><T pt={<>É o que o <a href="/notas/db-sharding/#lab">laboratório</a> faz, e é o que o RDS faz por você. No primário, um usuário de replicação, uma linha no <code>pg_hba.conf</code> e <code>max_wal_senders</code> suficiente. No standby, um backup base, um arquivo <code>standby.signal</code> vazio e o <code>primary_conninfo</code>. A opção <code>-R</code> do <code>pg_basebackup</code> grava os dois últimos.</>} en={<>This is what the <a href="/notas/db-sharding/#lab">lab</a> does, and what RDS does for you. On the primary, a replication user, a line in <code>pg_hba.conf</code> and enough <code>max_wal_senders</code>. On the standby, a base backup, an empty <code>standby.signal</code> file and <code>primary_conninfo</code>. The <code>-R</code> option of <code>pg_basebackup</code> writes the last two.</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<><b>Slot de replicação enche o disco.</b> Um slot impede o primário de reciclar o WAL que o standby ainda precisa. Se o standby some, o WAL acumula em <code>pg_wal</code> até lotar o disco. Limite com <code>max_slot_wal_keep_size</code>, como no <a href="/notas/db-sharding/#lab">laboratório</a>, e alarme o tamanho do WAL retido.</>} en={<><b>A replication slot can fill the disk.</b> A slot stops the primary from recycling WAL the standby still needs. If the standby disappears, WAL piles up in <code>pg_wal</code> until the disk is full. Cap it with <code>max_slot_wal_keep_size</code>, as in the <a href="/notas/db-sharding/#lab">lab</a>, and alarm on the retained WAL size.</>} /></Callout>
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
        <Callout tone="use" icon="check"><T pt={<><b>Regra de ouro.</b> Um endpoint de leitura resolve <i>onde</i> ler. Nenhum endpoint resolve <i>quando é seguro</i> ler da réplica. Isso é regra de negócio e fica no seu código, como o token de read-your-writes da <a href="#replicas">seção 2</a>.</>} en={<><b>Golden rule.</b> A read endpoint solves <i>where</i> to read. No endpoint solves <i>when it is safe</i> to read from the replica. That is business logic and lives in your code, like the read-your-writes token in <a href="#replicas">section 2</a>.</>} /></Callout>
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
      <Section id="cheat" title={<T pt="4. Decisão e checklist" en="4. Decision and checklist" />}>
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
