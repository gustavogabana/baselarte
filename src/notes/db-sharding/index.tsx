import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-sharding",
  title: "Sharding: dividir os dados entre servidores",
  seo: {
    title: "Sharding de banco: particionamento, Citus, Aurora Limitless e laboratório no Docker",
    description: "Quando e como fazer sharding (particionamento vs sharding, Citus, Aurora Limitless), uma requisição ponta a ponta e um laboratório de Postgres no Docker com primário, réplica e shards.",
  },
  summary: "particionamento vs sharding, como escolher a chave de shard, Citus e Aurora Limitless, um pedido seguido de ponta a ponta pelo primário e pela réplica, e um laboratório de Postgres em Docker com replicação e shards.",
  kicker: "Bancos de dados",
  heroTitle: <>Sharding: <em>quando um servidor não dá conta da escrita.</em></>,
  heroLede: "Particionamento versus sharding, como escolher a chave de shard, o que a AWS oferece, e um laboratório no Docker para rodar.",
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "intro", title: "Antes de ler" },
        { id: "sharding", title: "1. Sharding" },
        { id: "e2e", title: "2. Uma requisição ponta a ponta" },
        { id: "lab", title: "3. Laboratório em Docker" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={"Antes de ler"}>
        <Callout icon="check">Esta nota continua <a href="/notas/db-replicas-sharding/">Escala de banco: réplicas de leitura</a>. Réplicas resolvem leitura demais; sharding resolve escrita demais ou dados demais para um servidor. No fim, um laboratório no Docker junta primário, réplica e shards.</Callout>
      </Section>
      <Section id="sharding" title={"1. Sharding: dividir os dados entre servidores"}>
        <p>No sharding cada servidor (<i>shard</i>) guarda um pedaço das linhas, e cada shard é o primário dos seus dados, com as suas próprias réplicas. A escrita escala porque deixa de passar por um único nó. O preço é que o banco deixa de ser “um banco”: o que era trivial (um join, uma transação, um <code>COUNT</code>) vira problema distribuído.</p>
        <h3>Particionar não é fazer shard</h3>
        <p>O Postgres tem <b>particionamento declarativo</b> (range, list e hash), que divide uma tabela em pedaços <i>dentro do mesmo servidor</i>. Ele ajuda com poda de partições (<i>partition pruning</i>), com manutenção (apagar uma partição antiga é quase instantâneo) e com localidade de cache, mas CPU, memória e disco continuam sendo de uma máquina só.</p>
        <p>A documentação sugere considerar particionar quando a tabela passa da memória do servidor. Sharding é o passo seguinte: os pedaços ficam em máquinas diferentes.</p>
        <CodeBlock code={`CREATE TABLE measurement (
    city_id int NOT NULL, logdate date NOT NULL, peaktemp int
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_y2026m10 PARTITION OF measurement
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

-- Hash: espalha por uma chave (útil quando não há um eixo natural de tempo)
CREATE TABLE m_p0 PARTITION OF measurement FOR VALUES WITH (MODULUS 4, REMAINDER 0);`} />
        <p>Duas restrições que importam: uma chave primária ou <code>UNIQUE</code> numa tabela particionada precisa incluir todas as colunas da chave de partição, e partições demais aumentam o tempo de planejamento.</p>
        <h3>Escolher a chave de shard</h3>
        <p>É a decisão mais difícil de desfazer. Uma boa chave: (1) aparece em quase toda consulta, para que ela caia em um shard só; (2) distribui bem, sem shards quentes; (3) mantém junto o que é consultado junto. Em SaaS multi-tenant, <code>tenant_id</code> costuma ser a escolha natural.</p>
        <Table
          head={["Estratégia", "Como decide o shard", "Bom para", "Problema"]}
          rows={[
            ["Hash", <><code>hash(chave) % N</code></>, "Distribuição uniforme", "Consulta por faixa vira todos os shards; mudar N remapeia quase tudo (sem buckets)"],
            ["Faixa (range)", "Intervalos da chave (datas, IDs)", "Consultas por faixa; dados que envelhecem", "Shard “do mês atual” recebe todas as escritas (quente)"],
            ["Diretório (lookup)", "Uma tabela diz onde cada tenant está", "Mover um tenant grande para um shard só dele", "O diretório vira dependência crítica e precisa de cache"],
            ["Geográfico", "Região do usuário", "Latência e residência de dados", "Usuário que viaja; distribuição desigual"],
          ]}
        />
        <Diagram minWidth={640} caption={"O hash mapeia a chave para um de 64 buckets fixos; só o mapa bucket → shard muda quando você adiciona um servidor."}>
          <svg viewBox="0 0 700 256" role="img" aria-label="Roteamento por buckets com um shard novo">
            <rect x="8" y="100" width="90" height="56" rx="4" className="ln fillsoft" />
            <text x="53.0" y="132.0" textAnchor="middle">App</text>
            <rect x="130" y="82" width="190" height="92" rx="4" className="ln brandfill" />
            <text x="225.0" y="125.0" textAnchor="middle">Router</text>
            <text x="225.0" y="142.0" className="mut" textAnchor="middle">hash(tenant) % 64 = bucket</text>
            <text x="225" y="160" className="mut mono" textAnchor="middle">mapa: bucket → shard</text>
            <rect x="380" y="20" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="43.0" textAnchor="middle">Shard 0</text>
            <text x="455.0" y="60.0" className="mut" textAnchor="middle">buckets 0 a 31</text>
            <rect x="380" y="106" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="129.0" textAnchor="middle">Shard 1</text>
            <text x="455.0" y="146.0" className="mut" textAnchor="middle">buckets 32 a 63</text>
            <rect x="380" y="192" width="150" height="52" rx="4" className="ln fillsoft" />
            <text x="455.0" y="215.0" textAnchor="middle">Shard 2 (novo)</text>
            <text x="455.0" y="232.0" className="mut" textAnchor="middle">recebe buckets movidos</text>
            <rect x="570" y="20" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="50.0" textAnchor="middle">Réplica 0</text>
            <rect x="570" y="106" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="136.0" textAnchor="middle">Réplica 1</text>
            <rect x="570" y="192" width="120" height="52" rx="4" className="ln fillsoft" />
            <text x="630.0" y="222.0" textAnchor="middle">Réplica 2</text>
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
            <text x="550" y="36" className="mut mono" textAnchor="middle">WAL</text>
          </svg>
        </Diagram>
        <p>O truque do desenho acima é o que torna o resharding viável: <b>shards lógicos (buckets) fixos, shards físicos variáveis</b>. A chave nunca muda de bucket; para crescer, você move alguns buckets de um servidor para outro e atualiza o mapa. Sem isso, <code>hash % N</code> com <code>N</code> novo obriga a mover quase todas as linhas.</p>
        <h3>O que quebra</h3>
        <Table
          head={["Problema", "Por que", "Como lidar"]}
          rows={[
            ["Consulta sem a chave de shard", <>Precisa perguntar a todos os shards (<i>scatter-gather</i>) e juntar</>, "Evite no caminho quente; relatórios vão para um data warehouse"],
            ["Join entre shards", "Os dados estão em máquinas diferentes", <>Co-localizar tabelas pela mesma chave; replicar tabelas pequenas em todos os shards (<i>reference tables</i>)</>],
            ["Transação entre shards", "Exige commit em duas fases ou compensação (saga)", "Desenhe para a transação caber em um shard"],
            ["IDs únicos", <><code>serial</code> repete entre shards</>, <>UUID (o laboratório usa <code>gen_random_uuid()</code>) ou IDs com prefixo de tempo</>],
            ["Tenant gigante, shard quente", "Um tenant concentra a carga", "Diretório para isolar o tenant num shard próprio"],
            ["Migrações de schema", "N bancos para migrar, alguns podem falhar no meio", "Migração versionada e idempotente, aplicada shard a shard"],
            ["Resharding", "Mover dados com o sistema no ar", "Buckets fixos; copiar, sincronizar, trocar o mapa, apagar a origem"],
          ]}
        />
        <h3>Três jeitos de fazer</h3>
        <Table
          head={["Opção", "Como funciona", "Quando"]}
          rows={[
            [<><b>No app</b> (o laboratório)</>, "O código calcula o bucket e escolhe a conexão.", "Poucos shards, equipe que aceita ser dona do roteamento e do resharding"],
            [<><b>Citus</b> (extensão do Postgres)</>, <>Um <i>coordinator</i> recebe o SQL e o envia aos <i>workers</i>. Tabelas distribuídas por uma coluna de distribuição, <i>reference tables</i> replicadas em todos os workers e <i>co-location</i> por chave. Sharding por linha (<code>tenant_id</code>) ou por schema (Citus 12+).</>, "Você quer SQL distribuído sem trocar de motor"],
            [<><b>Aurora PostgreSQL Limitless</b></>, <><i>Routers</i> escondem os <i>shards</i> atrás de um endpoint de cluster. Três tipos de tabela: <i>sharded</i> (hash por uma chave, com co-location), <i>reference</i> (cópia em todos os shards) e <i>standard</i> (padrão, num shard só). Cada shard é uma instância Aurora (limite de 128 TiB).</>, "Já está na AWS e quer sharding gerenciado"],
          ]}
        />
        <p>Em todos, a lição é a mesma da escolha da chave: o que for consultado e transacionado junto precisa ter a mesma chave de shard.</p>
        <Callout tone="personal" icon="alert"><b>Nota pessoal, não verificada nas fontes:</b> o texto sobre a ordem de grandeza em que vale partir para sharding (“só depois de esgotar a escada”) é opinião minha. Não tenho um número de corte; ele depende da carga. Também não testei Citus nem Limitless; descrevi só o que as documentações dizem.</Callout>
        <Sources title={"Fontes · verificadas em 2026-10-26"}>
          <ul>
            <li><a href="https://www.postgresql.org/docs/current/ddl-partitioning.html">PostgreSQL Docs · Table partitioning</a></li>
            <li><a href="https://docs.citusdata.com/en/stable/get_started/concepts.html">Citus Docs · Concepts (coordinator, workers, distributed and reference tables, co-location)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless.html">AWS Docs · Aurora PostgreSQL Limitless Database</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless-architecture.html">AWS Docs · Limitless architecture (routers, shards, table types)</a></li>
          </ul>
        </Sources>
      </Section>
      <Section id="e2e" title={"2. Uma requisição ponta a ponta"}>
        <p>O exemplo: um endpoint <code>POST /orders</code> cria um pedido e o cliente imediatamente faz <code>GET /orders/&#123;id&#125;</code>. É o caso em que a leitura na réplica mais dói. O desenho abaixo é o que o <a href="#lab">laboratório</a> implementa.</p>
        <Diagram minWidth={640} caption={"O tempo corre para baixo. Os números são os passos da lista abaixo; tracejado é resposta."}>
          <svg viewBox="0 0 700 326" role="img" aria-label="Uma escrita e a leitura seguinte">
            <rect x="15" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="70.0" y="30.0" textAnchor="middle">Cliente</text>
            <path d="M70 46L70 318" className="ln dash" />
            <rect x="185" y="6" width="110" height="40" rx="4" className="ln brandfill" />
            <text x="240.0" y="30.0" textAnchor="middle">API</text>
            <path d="M240 46L240 318" className="ln dash" />
            <rect x="375" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="430.0" y="30.0" textAnchor="middle">Primário</text>
            <path d="M430 46L430 318" className="ln dash" />
            <rect x="565" y="6" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="620.0" y="30.0" textAnchor="middle">Réplica</text>
            <path d="M620 46L620 318" className="ln dash" />
            <path d="M70 76L240 76" className="ln" />
            <path d="M232.8 79.5L240 76L232.8 72.5" className="ln" />
            <text x="78" y="70" className="mono" textAnchor="start">1 POST /orders</text>
            <path d="M240 102L430 102" className="ln" />
            <path d="M422.8 105.5L430 102L422.8 98.5" className="ln" />
            <text x="248" y="96" className="mono" textAnchor="start">2 INSERT RETURNING id</text>
            <path d="M240 128L430 128" className="ln" />
            <path d="M422.8 131.5L430 128L422.8 124.5" className="ln" />
            <text x="248" y="122" className="mono" textAnchor="start">3 pg_current_wal_lsn()</text>
            <path d="M240 154L70 154" className="ln dash" />
            <path d="M77.2 157.5L70 154L77.2 150.5" className="ln" />
            <text x="78" y="148" className="mono" textAnchor="start">3 201 + X-Min-LSN</text>
            <path d="M430 180L620 180" className="ln" />
            <path d="M612.8 183.5L620 180L612.8 176.5" className="ln" />
            <text x="438" y="174" className="mono" textAnchor="start">4 WAL (assíncrono)</text>
            <path d="M70 210L240 210" className="ln" />
            <path d="M232.8 213.5L240 210L232.8 206.5" className="ln" />
            <text x="78" y="204" className="mono" textAnchor="start">5 GET + X-Min-LSN</text>
            <path d="M240 236L620 236" className="ln" />
            <path d="M612.8 239.5L620 236L612.8 232.5" className="ln" />
            <text x="248" y="230" className="mono" textAnchor="start">6 replay_lsn &gt;= token ?</text>
            <path d="M620 262L240 262" className="ln dash" />
            <path d="M247.2 265.5L240 262L247.2 258.5" className="ln" />
            <text x="248" y="256" className="mono" textAnchor="start">sim: lê aqui</text>
            <path d="M240 288L430 288" className="ln" />
            <path d="M422.8 291.5L430 288L422.8 284.5" className="ln" />
            <text x="248" y="282" className="mono" textAnchor="start">não: lê do primário</text>
            <path d="M240 312L70 312" className="ln dash" />
            <path d="M77.2 315.5L70 312L77.2 308.5" className="ln" />
            <text x="78" y="306" className="mono" textAnchor="start">200 + served_by</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><b>POST /orders.</b> O router sabe que isto é escrita e abre conexão com o <b>primário</b>.</li>
          <li><b>INSERT ... RETURNING id.</b> O primário grava no WAL e confirma o commit. Assíncrono: não espera a réplica.</li>
          <li><b>Token.</b> Logo <i>depois</i> do commit, a API lê <code>pg_current_wal_lsn()</code>. Como foi lido depois, é maior ou igual à posição do commit. A resposta carrega o id e o cabeçalho <code>X-Min-LSN</code>.</li>
          <li><b>Replicação.</b> Em paralelo, o walsender envia o WAL; a réplica o grava e reaplica. Milissegundos, mas não zero.</li>
          <li><b>GET /orders/&#123;id&#125;</b> com <code>X-Min-LSN</code>. O router quer usar a réplica, para poupar o primário.</li>
          <li><b>Checagem.</b> Na réplica, <code>SELECT pg_last_wal_replay_lsn() &gt;= token</code>. Se verdadeiro, a réplica já enxerga o pedido e responde (<code>served_by: replica</code>). Se falso, ou se a réplica estiver fora do ar, a API lê do primário (<code>served_by: primary (...)</code>). A posição de reaplicação só avança, então a checagem não tem condição de corrida.</li>
        </ol>
        <Table
          head={["Situação", "Sem o token (split ingênuo)", "Com o token"]}
          rows={[
            ["Réplica em dia", "Lê da réplica", "Lê da réplica (uma checagem a mais)"],
            ["Réplica atrasada", <><b>404</b>: o pedido “não existe”</>, "Lê do primário: correto, mais lento"],
            ["Réplica fora do ar", "Erro, a menos que haja fallback", "Lê do primário"],
            ["Primário fora do ar", "Escritas falham; leituras seguem na réplica", "Escritas falham; leituras com token falham até o failover (a réplica não prova estar em dia)"],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>O que esse desenho não resolve.</b> (1) O token precisa viajar: cabeçalho, cookie ou sessão; se o cliente o perde, volta ao split ingênuo. (2) Se a réplica fica muito atrás, quase todas as leituras vão ao primário: o lag vira carga no primário. Alarme o lag. (3) Entre dois pedidos diferentes de usuários diferentes, a leitura ainda pode ser velha; para isso o token não é necessário e a estratégia é aceitar.</Callout>
      </Section>
      <Section id="lab" title={"3. Laboratório em Docker: primário, réplica, API e shards"}>
        <p>O laboratório sobe um Postgres 18 primário, uma réplica de verdade (feita com <code>pg_basebackup -R</code>, em streaming replication), uma API em Python que separa leitura e escrita com o token de read-your-writes (veja <a href="/notas/db-replicas-sharding/#replicas">réplicas</a>) e, num perfil à parte, dois shards do roteamento por buckets da <a href="#sharding">seção 1</a>. Só a API tem dependência externa (<code>psycopg</code>).</p>
        <Callout tone="use" icon="check"><b>O que eu testei.</b> Subi tudo no Docker (versão 29, Postgres 18.6) e rodei os dois cenários abaixo, e as saídas mostradas são as reais, só reformatadas. Verifiquei que a réplica está em <code>streaming</code>, que ela recusa escrita e que a leitura obsoleta acontece e é corrigida pelo token. <b>Não testei na AWS.</b></Callout>
        <h3>Estrutura</h3>
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
        <h3>compose.yaml</h3>
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
        <h3>initdb/00-replication.sh</h3>
        <CodeBlock code={`#!/bin/sh
set -e
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \\
  -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replpass'"
echo "host replication replicator all scram-sha-256" >> "$PGDATA/pg_hba.conf"`} />
        <h3>initdb/10-schema.sql</h3>
        <CodeBlock code={`CREATE TABLE orders (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  text        NOT NULL,
    customer   text        NOT NULL,
    total      numeric(10,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_tenant_idx ON orders (tenant_id, created_at DESC);`} />
        <h3>replica.sh</h3>
        <CodeBlock code={`#!/bin/sh
set -e
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  PGPASSWORD=replpass pg_basebackup -h primary -U replicator -D "$PGDATA" \\
    -R -X stream -C -S replica1
  chmod 700 "$PGDATA"
fi
exec postgres -c hot_standby=on -c hot_standby_feedback=on`} />
        <h3>app/Dockerfile</h3>
        <CodeBlock code={`FROM python:3.12-slim
RUN pip install --no-cache-dir "psycopg[binary]==3.2.*"
WORKDIR /app
COPY app.py .
USER 10001
CMD ["python", "-u", "app.py"]`} />
        <p>A API inteira cabe em um arquivo. Leia <code>create_order</code> e <code>read_order</code> (token e fallback) e depois <code>bucket_of</code> e <code>shard_of</code> (sharding):</p>
        <h3>app/app.py</h3>
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
        <h3>Cenário 1: réplica saudável, atrasada e fora do ar</h3>
        <CodeBlock code={`docker compose up -d --build primary replica api
docker compose exec primary psql -U app -d shop -c "select application_name,state,sync_state from pg_stat_replication"
#  application_name |   state   | sync_state
#  walreceiver      | streaming | async
./demo.sh`} />
        <h3>demo.sh</h3>
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
        <p>Saída real (o <code>pg_wal_replay_pause()</code> congela a reaplicação na réplica, simulando lag):</p>
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
        <p>Repare no passo 3: a leitura <b>sem</b> o token devolveu um 404 de um pedido que acabou de ser criado. É a anomalia de <i>read-your-writes</i> reproduzida, com a réplica respondendo com toda a confiança.</p>
        <h3>Cenário 2: sharding por tenant</h3>
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
        <p>A distribuição ficou equilibrada (12 e 13 pedidos) com só 8 tenants. Note também que <code>acme</code> e <code>umbrella</code> caíram no mesmo bucket (32), o que é normal com 64 buckets: o bucket é uma unidade de movimentação, não de isolamento.</p>
        <Callout tone="warn" icon="alert"><b>Este laboratório não faz resharding.</b> Ele mostra o roteamento (bucket para shard) e a consulta em todos os shards, mas não move dados. Mover um bucket de verdade exige copiar as linhas, sincronizar as escritas feitas durante a cópia (por exemplo, com replicação lógica), trocar o mapa de forma atômica e só então apagar a origem. Também não há réplicas por shard nem tolerância a falha de shard.</Callout>
        <h3>Limpar e exercícios</h3>
        <CodeBlock code={`docker compose --profile shard down -v`} />
        <ol className="ds-steps">
          <li>Coloque <code>synchronous_standby_names = 'replica1'</code> e <code>synchronous_commit = remote_apply</code> no primário. Repita o cenário 1: o passo 3 trava o <code>POST</code>? Por quê? (Dica: a réplica está com a reaplicação pausada.)</li>
          <li>Desligue o <code>hot_standby_feedback</code>, rode um <code>pg_sleep(60)</code> numa transação na réplica e um <code>UPDATE</code> mais <code>VACUUM</code> no primário. Veja a consulta ser cancelada e consulte <code>pg_stat_database_conflicts</code>.</li>
          <li>Pare o primário e promova a réplica com <code>SELECT pg_promote()</code>. O que a API faz? O que precisa mudar para o failover ser automático?</li>
          <li>Adicione um terceiro shard: mude <code>shard_of</code> para usar um mapa explícito bucket → shard, mova um bucket à mão (<code>INSERT ... SELECT</code> entre os dois bancos) e troque o mapa.</li>
        </ol>
      </Section>
    </>
  );
}
