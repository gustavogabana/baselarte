import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-replicas-sharding",
  title: "Escala de banco: réplicas de leitura",
  seo: {
    title: "Réplicas de leitura: WAL, lag de replicação e AWS (Postgres)",
    description: "Como escalar a leitura além de um servidor: o WAL, réplicas de leitura, lag de replicação e read-your-writes, Multi-AZ, Aurora e RDS Proxy.",
  },
  summary: "a escada de escala do banco, como o WAL alimenta réplicas, atraso de replicação e read-your-writes, conflitos no hot standby, réplicas de leitura do RDS, Multi-AZ, Aurora e RDS Proxy, com um checklist de decisão. Sharding e um laboratório em Docker estão numa nota irmã.",
  kicker: "Bancos de dados",
  heroTitle: <>Leitura, escrita e réplicas: <em>escalar um banco além de um servidor.</em></>,
  heroLede: "Como o WAL alimenta as réplicas, o que o lag de replicação quebra e como conviver com ele, e o que a AWS oferece (RDS, Multi-AZ, Aurora, Proxy).",
  published: "2026-10-26",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "map", title: "O problema e a escada" },
        { id: "replication", title: "1. Primário, WAL e réplicas" },
        { id: "replicas", title: "2. Lidar com réplicas" },
        { id: "aws", title: "3. Na AWS" },
        { id: "cheat", title: "4. Decisão e checklist" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={"O problema e a escada"}>
        <p>Um banco em um servidor só cresce até o limite da máquina: CPU, memória, disco, conexões. Depois disso há duas perguntas diferentes, e elas têm respostas diferentes. <b>Leitura demais?</b> Réplicas copiam os dados para outras máquinas que só respondem consultas.</p>
        <p><b>Escrita demais, ou dados demais para um disco?</b> Só dividir os dados entre servidores (sharding) resolve, porque toda escrita de uma linha ainda passa por um único primário.</p>
        <Diagram minWidth={640} caption={"Cada degrau à direita custa mais complexidade. Réplicas e sharding resolvem problemas diferentes."}>
          <svg viewBox="0 0 700 140" role="img" aria-label="A escada de escala de um banco">
            <rect x="4" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="56.0" y="56.0" textAnchor="middle">Índices</text>
            <text x="56.0" y="73.0" className="mut" textAnchor="middle">query lenta</text>
            <path d="M108 59L120 59" className="ln" />
            <path d="M112.8 62.5L120 59L112.8 55.5" className="ln" />
            <rect x="120" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="172.0" y="56.0" textAnchor="middle">Pool</text>
            <text x="172.0" y="73.0" className="mut" textAnchor="middle">conexões</text>
            <path d="M224 59L236 59" className="ln" />
            <path d="M228.8 62.5L236 59L228.8 55.5" className="ln" />
            <rect x="236" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="288.0" y="56.0" textAnchor="middle">Cache</text>
            <text x="288.0" y="73.0" className="mut" textAnchor="middle">repetições</text>
            <path d="M340 59L352 59" className="ln" />
            <path d="M344.8 62.5L352 59L344.8 55.5" className="ln" />
            <rect x="352" y="30" width="104" height="58" rx="4" className="ln fillsoft" />
            <text x="404.0" y="56.0" textAnchor="middle">Scale up</text>
            <text x="404.0" y="73.0" className="mut" textAnchor="middle">mais máquina</text>
            <path d="M456 59L468 59" className="ln" />
            <path d="M460.8 62.5L468 59L460.8 55.5" className="ln" />
            <rect x="468" y="30" width="104" height="58" rx="4" className="ln brandfill" />
            <text x="520.0" y="56.0" textAnchor="middle">Réplicas</text>
            <text x="520.0" y="73.0" className="mut" textAnchor="middle">mais leitura</text>
            <path d="M572 59L584 59" className="ln" />
            <path d="M576.8 62.5L584 59L576.8 55.5" className="ln" />
            <rect x="584" y="30" width="104" height="58" rx="4" className="ln brandfill" />
            <text x="636.0" y="56.0" textAnchor="middle">Sharding</text>
            <text x="636.0" y="73.0" className="mut" textAnchor="middle">mais escrita</text>
            <text x="4" y="14" className="mut mono" textAnchor="start">barato e reversível</text>
            <text x="696" y="14" className="mut mono" textAnchor="end">caro e quase irreversível</text>
            <path d="M4 108L696 108" className="ln dash" />
            <text x="350" y="128" className="mut" textAnchor="middle">suba um degrau só quando o anterior estiver esgotado e medido</text>
          </svg>
        </Diagram>
        <Table
          head={["Sintoma", "Causa provável", "Primeira ferramenta"]}
          rows={[
            ["CPU alta, poucas queries muito lentas", "Falta de índice, plano ruim", <><code>EXPLAIN ANALYZE</code>, índices (veja a <a href="/notas/postgres-for-devs/">nota de Postgres</a>)</>],
            [<>Erro <code>too many connections</code></>, "Cada conexão do Postgres é um processo; muitas instâncias do app", "Pool de conexões (PgBouncer, RDS Proxy)"],
            ["As mesmas leituras repetidas milhares de vezes", "Dados quentes e estáveis", "Cache (Redis, CDN)"],
            ["Leitura satura o primário; relatórios travam o app", "Muita consulta, pouca escrita", <><b>Réplicas de leitura</b></>],
            ["Primário não aguenta as escritas, ou a tabela não cabe", "Escrita e volume passam de um servidor", <>Particionar; se não bastar, <b>sharding</b></>],
            ["Indisponibilidade quando o primário cai", "Ponto único de falha", "Standby com failover (Multi-AZ); réplica também serve"],
          ]}
        />
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> a escada e a tabela de sintomas são a minha síntese, uma ordem prática comum e não uma recomendação oficial. O ponto de fundo é que réplica não escala escrita, e é o erro de diagnóstico mais comum.</Callout>
      </Section>
      <Section id="replication" title={"1. Primário, WAL e réplicas"}>
        <p>Todo banco relacional grava as mudanças primeiro em um log (no Postgres, o <b>WAL</b>, <i>write-ahead log</i>) e só depois nos arquivos de dados.</p>
        <p>A <i>streaming replication</i> do Postgres aproveita isso: o primário envia o WAL a um standby assim que ele é gerado, sem esperar o segmento de 16 MB encher, e o standby reaplica as mudanças. Em modo assíncrono ele costuma ficar menos de um segundo atrás.</p>
        <Diagram minWidth={640} caption={"A réplica é uma cópia física: reaplica exatamente o mesmo WAL, byte a byte."}>
          <svg viewBox="0 0 700 204" role="img" aria-label="Streaming replication do Postgres">
            <rect x="150" y="8" width="230" height="170" rx="6" className="ln dash" />
            <text x="160" y="24" className="mut mono" textAnchor="start">primário</text>
            <rect x="440" y="8" width="252" height="170" rx="6" className="ln dash" />
            <text x="450" y="24" className="mut mono" textAnchor="start">réplica (hot standby)</text>
            <rect x="8" y="60" width="100" height="56" rx="4" className="ln fillsoft" />
            <text x="58.0" y="85.0" textAnchor="middle">App</text>
            <text x="58.0" y="102.0" className="mut" textAnchor="middle">escreve</text>
            <rect x="162" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="212.0" y="60.0" textAnchor="middle">COMMIT</text>
            <text x="212.0" y="77.0" className="mut" textAnchor="middle">linha nova</text>
            <rect x="162" y="108" width="100" height="50" rx="4" className="ln brandfill" />
            <text x="212.0" y="130.0" textAnchor="middle">WAL</text>
            <text x="212.0" y="147.0" className="mut" textAnchor="middle">log</text>
            <rect x="278" y="108" width="90" height="50" rx="4" className="ln fillsoft" />
            <text x="323.0" y="137.0" textAnchor="middle">walsender</text>
            <rect x="452" y="108" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="502.0" y="137.0" textAnchor="middle">walreceiver</text>
            <rect x="582" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="632.0" y="60.0" textAnchor="middle">Replay</text>
            <text x="632.0" y="77.0" className="mut" textAnchor="middle">aplica o WAL</text>
            <rect x="582" y="108" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="632.0" y="130.0" textAnchor="middle">Dados</text>
            <text x="632.0" y="147.0" className="mut" textAnchor="middle">arquivos</text>
            <rect x="452" y="38" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="502.0" y="60.0" textAnchor="middle">SELECT</text>
            <text x="502.0" y="77.0" className="mut" textAnchor="middle">só leitura</text>
            <path d="M108 63L162 63" className="ln" />
            <path d="M154.8 66.5L162 63L154.8 59.5" className="ln" />
            <path d="M212 88L212 108" className="ln" />
            <path d="M215.5 100.8L212 108L208.5 100.8" className="ln" />
            <path d="M262 133L278 133" className="ln" />
            <path d="M270.8 136.5L278 133L270.8 129.5" className="ln" />
            <path d="M368 133L452 133" className="ln" />
            <path d="M444.8 136.5L452 133L444.8 129.5" className="ln" />
            <text x="410" y="124" className="mut mono" textAnchor="middle">TCP</text>
            <path d="M552 133L582 133" className="ln" />
            <path d="M574.8 136.5L582 133L574.8 129.5" className="ln" />
            <path d="M632 108L632 88" className="ln" />
            <path d="M635.5 95.2L632 88L628.5 95.2" className="ln" />
            <path d="M582 63L552 63" className="ln" />
            <path d="M559.2 66.5L552 63L559.2 59.5" className="ln" />
            <text x="350" y="194" className="mut" textAnchor="middle">cada COMMIT vira WAL; a réplica reaplica o WAL; o atraso entre os dois é o lag</text>
          </svg>
        </Diagram>
        <h3>Montar na mão (Postgres)</h3>
        <p>É o que o <a href="/notas/db-sharding/#lab">laboratório</a> faz, e é o que o RDS faz por você. No primário, um usuário de replicação, uma linha no <code>pg_hba.conf</code> e <code>max_wal_senders</code> suficiente. No standby, um backup base, um arquivo <code>standby.signal</code> vazio e o <code>primary_conninfo</code>. A opção <code>-R</code> do <code>pg_basebackup</code> grava os dois últimos.</p>
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
        <Callout tone="warn" icon="alert"><b>Slot de replicação enche o disco.</b> Um slot impede o primário de reciclar o WAL que o standby ainda precisa. Se o standby some, o WAL acumula em <code>pg_wal</code> até lotar o disco. Limite com <code>max_slot_wal_keep_size</code>, como no <a href="/notas/db-sharding/#lab">laboratório</a>, e alarme o tamanho do WAL retido.</Callout>
        <h3>Assíncrona ou síncrona</h3>
        <p>O padrão é <b>assíncrono</b>: o <code>COMMIT</code> não espera o standby, então uma queda do primário pode perder as últimas transações confirmadas. No modo <b>síncrono</b> (<code>synchronous_standby_names</code> não vazio) o commit espera, e <code>synchronous_commit</code> escolhe até onde:</p>
        <Table
          head={[<><code>synchronous_commit</code></>, "O commit espera o standby ter...", "Troca"]}
          rows={[
            [<><code>on</code> (padrão)</>, "gravado o WAL em disco", "Não perde dado confirmado; não garante que a leitura na réplica já veja"],
            [<><code>remote_write</code></>, "recebido e entregue ao SO (sem flush)", "Mais rápido, um pouco menos durável"],
            [<><code>remote_apply</code></>, <><b>reaplicado</b>: visível a consultas</>, "Leitura na réplica enxerga o commit, mas a escrita fica mais lenta"],
            [<><code>local</code> / <code>off</code></>, "não espera o standby", "Menor latência, maior risco"],
          ]}
        />
        <p>O <code>synchronous_commit</code> pode ser definido por usuário, banco ou transação, então dá para pagar a latência só nas escritas que importam. Também há quórum: <code>ANY 2 (s1, s2, s3)</code> espera dois quaisquer.</p>
        <h3>O que a réplica aceita</h3>
        <p>Uma réplica que aceita consultas se chama <i>hot standby</i>. Ela é somente leitura de verdade: <code>transaction_read_only</code> é sempre verdadeiro e não dá para mudar. Confirmei no laboratório:</p>
        <CodeBlock code={`$ psql -h replica -c "INSERT INTO orders(tenant_id,customer,total) VALUES ('x','y',1)"
ERROR:  cannot execute INSERT in a read-only transaction`} />
        <Table
          head={["Permitido", "Proibido (erro)"]}
          rows={[
            [<><code>SELECT</code>, <code>COPY TO</code>, cursores, <code>SHOW</code>/<code>SET</code>, <code>PREPARE</code>/<code>EXECUTE</code></>, <><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>, <code>TRUNCATE</code>, tabelas temporárias</>],
            [<><code>BEGIN</code>/<code>COMMIT</code> de transação somente leitura</>, <>DDL (<code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>), <code>VACUUM</code>, <code>ANALYZE</code>, <code>REINDEX</code></>],
            [<><code>LOCK TABLE</code> só em <code>ACCESS SHARE</code>, <code>ROW SHARE</code>, <code>ROW EXCLUSIVE</code></>, <><code>SELECT ... FOR UPDATE/SHARE</code>, <code>nextval()</code>, <code>LISTEN</code>/<code>NOTIFY</code>, isolamento <code>SERIALIZABLE</code></>],
          ]}
        />
        <p>Consequência de design: <b>uma transação que lê para depois escrever, ou que usa <code>FOR UPDATE</code>, tem que ir inteira ao primário</b>. Só roteie para a réplica o que é leitura de ponta a ponta.</p>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://www.postgresql.org/docs/current/warm-standby.html">PostgreSQL Docs · Log-Shipping Standby Servers (streaming replication, slots, synchronous commit)</a></li>
            <li><a href="https://www.postgresql.org/docs/current/hot-standby.html">PostgreSQL Docs · Hot Standby (allowed queries, conflicts)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="replicas" title={"2. Lidar com réplicas: lag, consistência, conflitos"}>
        <p>Adicionar a réplica é a parte fácil. O difícil é que ela <b>sempre</b> está um pouco no passado, e o app precisa ser desenhado para isso.</p>
        <h3>Medir o lag</h3>
        <ul className="ds-list">
          <li><b>Em bytes, no primário:</b> <code>pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)</code> em <code>pg_stat_replication</code>. Se a distância até <code>sent_lsn</code> é grande, o primário está carregado; entre <code>sent</code> e <code>replay</code>, é rede ou réplica lenta.</li>
          <li><b>Em tempo, na réplica:</b> <code>now() - pg_last_xact_replay_timestamp()</code>. Cuidado: num primário parado esse valor cresce mesmo com a réplica em dia. É o mesmo cálculo da métrica <code>ReplicaLag</code> do RDS, que por isso pode mostrar até 5 minutos de lag sem transações.</li>
        </ul>
        <p>As causas típicas de lag, segundo a AWS: escrita muito concorrente ou lotes grandes no primário; consultas pesadas ou lentas na própria réplica, que disputam recurso com a reaplicação; e transações enormes ou DDL, porque a ordem dos commits é preservada.</p>
        <h3>Consistência: o que o usuário percebe</h3>
        <p>Com réplica assíncrona, três anomalias aparecem para o usuário, e todas têm a mesma raiz:</p>
        <Table
          head={["Anomalia", "Exemplo", "Por quê"]}
          rows={[
            [<>Ler o que acabei de escrever (<i>read-your-writes</i>)</>, "Cria o pedido e a página seguinte diz “não encontrado”", <>O <code>GET</code> caiu numa réplica que ainda não reaplicou o <code>INSERT</code></>],
            [<>Leituras voltando no tempo (<i>monotonic reads</i>)</>, "Atualiza a página: o comentário some e volta", "Duas réplicas com lags diferentes"],
            ["Decidir com dado velho", "Checa estoque na réplica e vende o que acabou", "A decisão exige o dado atual"],
          ]}
        />
        <p>As estratégias, da mais simples à mais precisa:</p>
        <Table
          head={["Estratégia", "Como", "Custo"]}
          rows={[
            ["Decisões e leituras críticas vão ao primário", "Classifique cada leitura: “pode ser velha?” Se não, primário.", "Simples; o primário continua recebendo essas leituras"],
            ["Janela pós-escrita", "Depois de uma escrita, o usuário lê do primário por N segundos (cookie ou sessão).", "Simples; N é um chute (lag pode passar de N)"],
            [<><b>Token de posição do WAL (LSN)</b></>, <>A escrita devolve <code>pg_current_wal_lsn()</code>; a leitura só usa a réplica se <code>pg_last_wal_replay_lsn()</code> já passou dele, senão vai ao primário. <b>É o que o laboratório faz.</b></>, "Uma consulta extra por leitura; o app carrega o token"],
            [<><code>WAIT FOR LSN</code> (PostgreSQL 19)</>, <>A réplica bloqueia a sessão até reaplicar o LSN (com <code>TIMEOUT</code>), em vez de o app decidir.</>, <>Requer a versão 19; com pool em modo transação o <code>WAIT</code> e a leitura podem cair em conexões diferentes</>],
            [<>Commit síncrono com <code>remote_apply</code></>, "O commit só volta depois que a réplica reaplicou.", "Escritas mais lentas; uma réplica parada trava as escritas"],
            [<>Aurora: <i>write forwarding</i> local</>, "O app abre transação de leitura/escrita direto na réplica; a escrita é encaminhada ao writer.", "Só Aurora PostgreSQL 14.13+, 15.8+ ou 16.4+; é para escritas ocasionais"],
          ]}
        />
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> a data de lançamento e a sintaxe final do <code>WAIT FOR LSN</code> eu não consegui confirmar na página oficial (devolveu 404 para mim). O que sei vem de resumos de busca da documentação da versão 19, que descrevem <code>WAIT FOR LSN '...' WITH (MODE, TIMEOUT, NO_THROW)</code> executado numa réplica; confira na documentação da sua versão antes de usar. A técnica do token, que o laboratório usa, funciona em qualquer versão.</Callout>
        <h3>Conflitos: a réplica cancela consultas</h3>
        <p>O primário não enxerga as consultas da réplica. Quando a reaplicação do WAL entra em conflito com uma consulta que está rodando na réplica (por exemplo, o <code>VACUUM</code> do primário removeu linhas que a consulta ainda via, ou um <code>DROP TABLE</code> pegou um lock exclusivo), a réplica espera ou cancela a consulta. Os controles:</p>
        <Table
          head={["Parâmetro", "Efeito", "Use quando"]}
          rows={[
            [<><code>max_standby_streaming_delay</code></>, <>Quanto a reaplicação pode esperar a consulta. Passado o tempo, a consulta é cancelada. <code>-1</code> espera para sempre.</>, <>Réplica de relatório: valor alto (horas) ou <code>-1</code>, aceitando mais lag</>],
            [<><code>hot_standby_feedback = on</code></>, "A réplica avisa o primário para não remover linhas que ela ainda usa.", <>Muitos cancelamentos; custo: <i>bloat</i> no primário</>],
            [<>Delay curto ou <code>0</code></>, "A réplica nunca se atrasa; cancela consultas.", "Réplica de alta disponibilidade, que precisa estar em dia para o failover"],
          ]}
        />
        <p>Duas regras práticas: <b>separe a réplica de relatório da réplica de failover</b>, porque elas querem configurações opostas; e trate o cancelamento como erro normal, com nova tentativa em outra transação. A visão <code>pg_stat_database_conflicts</code>, na réplica, mostra os cancelamentos por motivo.</p>
        <h3>Rotear no app, no pool ou no DNS</h3>
        <Table
          head={["Onde", "Como", "Cuidado"]}
          rows={[
            ["No app (router explícito)", <>Duas conexões: <code>primary</code> e <code>replica</code>; o código escolhe por leitura.</>, "É o que dá controle de consistência; é mais código"],
            ["Endpoint de leitura do provedor", "O app usa um nome para escrita e outro para leitura (Aurora reader endpoint).", <>Balanceia <b>conexões</b>, não consultas; um pool que reaproveita conexões fica desbalanceado</>],
            ["Proxy / pool", "RDS Proxy, PgBouncer: um endpoint de leitura que escolhe réplica viva.", "O proxy não sabe do seu token de consistência; ele escolhe a réplica, não a leitura segura"],
            ["Driver", <>Alguns drivers aceitam várias URLs e papéis (<code>targetServerType</code> no driver JDBC do Postgres, por exemplo).</>, "Confira na doc do seu driver (de memória)"],
          ]}
        />
        <Callout tone="use" icon="check"><b>Regra de ouro.</b> Um endpoint de leitura resolve <i>onde</i> ler. Nenhum endpoint resolve <i>quando é seguro</i> ler da réplica. Isso é regra de negócio e fica no seu código, como o token de read-your-writes da <a href="#replicas">seção 2</a>.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
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
      <Section id="aws" title={"3. Na AWS: o que existe e quando usar"}>
        <p>A AWS tem várias formas de ter “mais de uma cópia”, e elas resolvem problemas diferentes. A confusão mais comum é tratar <b>Multi-AZ</b> (disponibilidade) como <b>réplica de leitura</b> (escala de leitura). A documentação separa as duas.</p>
        <Table
          head={["Opção", "Como replica", "Lê da cópia?", "Serve para"]}
          rows={[
            ["RDS Multi-AZ (instância)", <>Um standby, replicação <b>síncrona</b></>, "Não", "Alta disponibilidade e failover"],
            ["RDS read replica", <>Mecanismo nativo do motor, <b>assíncrono</b>. Parte de um snapshot do primário.</>, "Sim", "Escalar leitura, relatórios, DR (promover)"],
            ["RDS Multi-AZ DB cluster (MySQL, PostgreSQL)", <>Writer + 2 readers em 3 AZs, <b>semissíncrona</b>: o commit espera ao menos um reader</>, "Sim (reader endpoint)", "HA e leitura juntas, com menor latência de escrita que Multi-AZ instância"],
            ["Aurora", <>Os nós <b>compartilham um volume</b> do cluster, com cópias em 3 AZs; até 15 réplicas</>, "Sim (reader endpoint)", "Muita leitura, failover rápido, lag normalmente bem abaixo de 100 ms"],
            ["Aurora Global Database", "Replica o volume para até 10 Regiões secundárias; latência tipicamente abaixo de 1 s", "Sim, nas Regiões secundárias", "Leitura perto do usuário e recuperação de falha de Região"],
            ["Aurora PostgreSQL Limitless", <><b>Sharding</b> gerenciado: routers e shards</>, "Via routers", "Escrita e volume além de um writer"],
          ]}
        />
        <Diagram minWidth={640} caption={"No RDS cada cópia é um disco e o WAL viaja pela rede. No Aurora o volume é do cluster, por isso a réplica não reaplica um WAL próprio e o lag é baixo."}>
          <svg viewBox="0 0 700 206" role="img" aria-label="RDS contra Aurora">
            <rect x="4" y="8" width="330" height="190" rx="6" className="ln dash" />
            <text x="14" y="24" className="mut mono" textAnchor="start">RDS: cada instância tem o seu disco</text>
            <rect x="24" y="44" width="120" height="52" rx="4" className="ln brandfill" />
            <text x="84.0" y="67.0" textAnchor="middle">Primário</text>
            <text x="84.0" y="84.0" className="mut" textAnchor="middle">AZ a</text>
            <rect x="194" y="44" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="254.0" y="67.0" textAnchor="middle">Réplica</text>
            <text x="254.0" y="84.0" className="mut" textAnchor="middle">AZ b</text>
            <rect x="24" y="128" width="120" height="44" rx="4" className="ln fillsoft" />
            <text x="84.0" y="154.0" textAnchor="middle">Volume (EBS)</text>
            <rect x="194" y="128" width="120" height="44" rx="4" className="ln fillsoft" />
            <text x="254.0" y="154.0" textAnchor="middle">Volume (EBS)</text>
            <path d="M84 96L84 128" className="ln" />
            <path d="M87.5 120.8L84 128L80.5 120.8" className="ln" />
            <path d="M254 96L254 128" className="ln" />
            <path d="M257.5 120.8L254 128L250.5 120.8" className="ln" />
            <path d="M144 70L194 70" className="ln" />
            <path d="M186.8 73.5L194 70L186.8 66.5" className="ln" />
            <text x="169" y="38" className="mut mono" textAnchor="middle">WAL async</text>
            <rect x="366" y="8" width="330" height="190" rx="6" className="ln dash" />
            <text x="376" y="24" className="mut mono" textAnchor="start">Aurora: um volume do cluster para todos</text>
            <rect x="382" y="44" width="90" height="52" rx="4" className="ln brandfill" />
            <text x="427.0" y="67.0" textAnchor="middle">Writer</text>
            <text x="427.0" y="84.0" className="mut" textAnchor="middle">AZ a</text>
            <rect x="484" y="44" width="90" height="52" rx="4" className="ln fillsoft" />
            <text x="529.0" y="67.0" textAnchor="middle">Reader</text>
            <text x="529.0" y="84.0" className="mut" textAnchor="middle">AZ b</text>
            <rect x="586" y="44" width="90" height="52" rx="4" className="ln fillsoft" />
            <text x="631.0" y="67.0" textAnchor="middle">Reader</text>
            <text x="631.0" y="84.0" className="mut" textAnchor="middle">AZ c</text>
            <rect x="382" y="128" width="294" height="44" rx="4" className="ln fillsoft" />
            <text x="529.0" y="154.0" textAnchor="middle">Volume do cluster · cópias em 3 AZs</text>
            <path d="M427 96L427 128" className="ln" />
            <path d="M430.5 120.8L427 128L423.5 120.8" className="ln" />
            <path d="M529 96L529 128" className="ln" />
            <path d="M532.5 120.8L529 128L525.5 120.8" className="ln" />
            <path d="M631 96L631 128" className="ln" />
            <path d="M634.5 120.8L631 128L627.5 120.8" className="ln" />
          </svg>
        </Diagram>
        <h3>Uma topologia típica</h3>
        <Diagram minWidth={640} caption={"O app fala com um proxy. Escritas vão ao writer; leituras, a um endpoint de leitura que escolhe um reader vivo."}>
          <svg viewBox="0 0 700 298" role="img" aria-label="Topologia de leitura e escrita na AWS">
            <rect x="196" y="8" width="318" height="258" rx="6" className="ln dash" />
            <text x="206" y="24" className="mut mono" textAnchor="start">VPC · subnets privadas em 3 AZs</text>
            <rect x="8" y="106" width="100" height="56" rx="4" className="ln fillsoft" />
            <text x="58.0" y="131.0" textAnchor="middle">App</text>
            <text x="58.0" y="148.0" className="mut" textAnchor="middle">ECS / Lambda</text>
            <rect x="214" y="106" width="110" height="56" rx="4" className="ln brandfill" />
            <text x="269.0" y="131.0" textAnchor="middle">RDS Proxy</text>
            <text x="269.0" y="148.0" className="mut" textAnchor="middle">pool + failover</text>
            <rect x="380" y="36" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="59.0" textAnchor="middle">Writer</text>
            <text x="440.0" y="76.0" className="mut" textAnchor="middle">cluster endpoint</text>
            <rect x="380" y="106" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="129.0" textAnchor="middle">Reader</text>
            <text x="440.0" y="146.0" className="mut" textAnchor="middle">reader endpoint</text>
            <rect x="380" y="176" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="440.0" y="199.0" textAnchor="middle">Reader</text>
            <text x="440.0" y="216.0" className="mut" textAnchor="middle">custom: relatórios</text>
            <path d="M108 134L214 134" className="ln" />
            <path d="M206.8 137.5L214 134L206.8 130.5" className="ln" />
            <path d="M324 126L352 126L352 62L380 62" className="ln" />
            <path d="M372.8 65.5L380 62L372.8 58.5" className="ln" />
            <path d="M324 134L380 134" className="ln" />
            <path d="M372.8 137.5L380 134L372.8 130.5" className="ln" />
            <path d="M324 142L352 142L352 202L380 202" className="ln" />
            <path d="M372.8 205.5L380 202L372.8 198.5" className="ln" />
            <text x="110" y="124" className="mut mono" textAnchor="start">SQL</text>
            <text x="560" y="62" className="mut" textAnchor="start">escritas</text>
            <text x="560" y="134" className="mut" textAnchor="start">leituras</text>
            <text x="560" y="202" className="mut" textAnchor="start">análise</text>
            <text x="355" y="288" className="mut mono" textAnchor="middle">RDS Proxy: endpoints de leitura só em Aurora e Multi-AZ DB cluster</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><b>Endpoints do Aurora:</b> o <i>cluster endpoint</i> sempre aponta para o writer (muda sozinho no failover); o <i>reader endpoint</i> balanceia <b>conexões</b> entre os readers (não balanceia consultas: para espalhar cada consulta, abra uma conexão por consulta); o <i>custom endpoint</i> agrupa um subconjunto de instâncias (por exemplo, readers maiores para relatórios); o <i>instance endpoint</i> serve para diagnóstico. Se o cluster só tem o writer, o reader endpoint aponta para ele.</li>
          <li><b>RDS Proxy:</b> mantém um pool de conexões e as multiplexa (todas as operações de uma transação usam uma conexão do banco), o que protege o banco de rajadas, e reconecta a um standby no failover preservando as conexões do app. Para Aurora e Multi-AZ DB cluster você pode criar <b>endpoints somente leitura</b> (<code>TargetRole = READ_ONLY</code>), que reagem a um reader que cai sem esperar o cache de DNS. Já para uma instância RDS com réplicas, o proxy só se associa ao <b>writer</b>, não a uma réplica de leitura.</li>
          <li><b>Sem autoscaling de réplica no RDS:</b> o RDS não adiciona nem remove réplicas conforme a demanda; você cria e apaga à mão. Se apagar o primário sem apagar as réplicas na mesma Região, cada réplica é promovida a instância independente.</li>
          <li><b>Lag e failover:</b> no Multi-AZ DB cluster com PostgreSQL, o tempo de failover depende do menor lag entre os dois readers, porque o escolhido precisa aplicar o que falta antes de virar writer. Por isso a AWS recomenda alarmar o lag.</li>
        </ul>
        <h3>Como fazer (AWS CLI)</h3>
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
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> <b>não executei nada disto na AWS</b> (custa dinheiro e não tenho conta de teste aqui). Conferi na documentação os comandos de réplica de leitura e de Multi-AZ DB cluster. Os comandos do Aurora, o alarme de CloudWatch e a ideia de ajustar <code>hot_standby_feedback</code> e <code>max_standby_streaming_delay</code> pelo parameter group são de memória; no Aurora a métrica de lag tem outro nome (<code>AuroraReplicaLag</code>, em milissegundos, se me lembro bem). Valores como classes de instância, nomes e IDs são exemplos.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
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
      <Section id="cheat" title={"4. Decisão e checklist"}>
        <Table
          head={["Se você precisa de...", "Use"]}
          rows={[
            ["Sobreviver à queda do primário", "Multi-AZ (instância ou cluster) ou Aurora; teste o failover"],
            ["Aliviar leitura e relatórios", "Réplicas de leitura; réplica de relatório separada da de failover"],
            ["Ler o que acabou de escrever", "Token de LSN, janela pós-escrita ou ler do primário"],
            ["Muitas conexões, Lambda, picos", "RDS Proxy ou PgBouncer"],
            ["Leitura perto do usuário em outra Região", "Aurora Global Database (ou réplica entre Regiões no RDS)"],
            ["Tabela enorme, sem escala de escrita necessária", "Particionamento declarativo"],
            ["Escrita e volume além de um servidor", "Sharding: Citus, Aurora Limitless ou no app"],
          ]}
        />
        <h3>Checklist</h3>
        <ul className="ds-list">
          <li>Meça antes: qual é o gargalo? CPU, IO, conexões, leitura, escrita?</li>
          <li>Cada leitura classificada: pode ser velha? Se não, vai ao primário ou usa token.</li>
          <li>Transação que escreve (ou usa <code>FOR UPDATE</code>) inteira no primário.</li>
          <li>Alarme de lag, de WAL retido e de conexões; fallback para o primário se a réplica falhar.</li>
          <li>Réplica de relatório com <code>max_standby_streaming_delay</code> alto, separada da de failover.</li>
          <li>Failover testado de verdade, com a aplicação reconectando (DNS e pool).</li>
          <li>Se for fazer shard: chave que aparece em quase toda consulta, buckets fixos, UUIDs, migrações versionadas.</li>
          <li>Cada shard com as suas réplicas e o seu backup.</li>
        </ul>
        <Callout tone="personal" icon="alert"><b>Limites desta nota.</b> Os dados e comportamentos vêm das documentações citadas em cada seção, consultadas em 26/10/2026; limites, preços e versões da AWS mudam. O laboratório foi testado no Docker, com um primário e uma réplica de verdade; nada foi executado na AWS, e Citus e Limitless não foram testados.</Callout>
      </Section>
    </>
  );
}
