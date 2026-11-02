import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-migrations",
  title: { en: "Database migrations: Flyway, Prisma and Alembic", pt: "Migrations de banco: Flyway, Prisma e Alembic" },
  seo: {
    title: { en: "Database migrations: Flyway, Prisma and Alembic", pt: "Migrations de banco: Flyway, Prisma e Alembic" },
    description: { en: "What database migrations are and the problem they solve, how to start them in a new project, what the database must look like, the first migration versus the next ones, baselining an existing database, avoiding conflicts in a team and running them in production, with Flyway (Java/Spring), Prisma (TypeScript) and Alembic (Python/FastAPI).", pt: "O que são migrations de banco e qual problema resolvem, como começar num projeto novo, como o banco precisa estar, a primeira migration e as seguintes, baseline de um banco existente, como evitar conflitos em equipe e como rodar em produção, com Flyway (Java/Spring), Prisma (TypeScript) e Alembic (Python/FastAPI)." },
  },
  summary: "what migrations are and the drift problem they solve, how the tools work (history table, checksums, locking), what the database must look like before the first migration, the first migration versus incremental deltas, baselining an existing database, and side-by-side setups for Flyway with Spring Boot, Prisma with TypeScript (plus TypeORM and Sequelize) and Alembic with FastAPI and SQLAlchemy; team conflicts (duplicate versions, Alembic multiple heads) and CI checks, expand/contract for zero-downtime changes, production practices and a Flyway lab in Docker.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>The schema is code, <em>and it has a history.</em></>, pt: <>O esquema é código, <em>e tem histórico.</em></> },
  heroLede: { en: "What database migrations are, the problem they solve, how to start them in a new project, what the database must look like before the first one, how to avoid conflicts in a team and how to run them in production, with Flyway (Java/Spring), Prisma (TypeScript) and Alembic (Python/FastAPI).", pt: "O que são migrations de banco, qual problema resolvem, como começar num projeto novo, como o banco precisa estar antes da primeira, como evitar conflitos em equipe e como rodar em produção, com Flyway (Java/Spring), Prisma (TypeScript) e Alembic (Python/FastAPI)." },
  published: "2026-10-31",
  updated: "2026-10-31",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é uma migration" en="What a migration is" /> },
        { id: "how", title: <T pt="Como a ferramenta funciona" en="How the tool works" /> },
        { id: "start", title: <T pt="Começando do zero" en="Starting from scratch" /> },
        { id: "flyway", title: <T pt="Java + Spring: Flyway" en="Java + Spring: Flyway" /> },
        { id: "prisma", title: <T pt="TypeScript: Prisma" en="TypeScript: Prisma" /> },
        { id: "alembic", title: <T pt="Python + FastAPI: Alembic" en="Python + FastAPI: Alembic" /> },
        { id: "conflicts", title: <T pt="Conflitos em equipe" en="Conflicts in a team" /> },
        { id: "prod", title: <T pt="Em produção" en="In production" /> },
        { id: "lab", title: <T pt="Exercício: Flyway em 10 minutos" en="Exercise: Flyway in 10 minutes" /> },
        { id: "cheat-mig", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é uma migration" en="What a migration is" />}>
        <p><T pt={<>Uma <strong>migration</strong> é um arquivo versionado que descreve <em>uma</em> mudança no esquema do banco: criar uma tabela, adicionar uma coluna, criar um índice, renomear algo, mover dados. Os arquivos ficam no repositório, ao lado do código, e são aplicados <strong>em ordem</strong> por uma ferramenta que lembra, dentro do próprio banco, quais já rodaram.</>} en={<>A <strong>migration</strong> is a versioned file that describes <em>one</em> change to the database schema: create a table, add a column, create an index, rename something, move data. The files live in the repository next to the code and are applied <strong>in order</strong> by a tool that remembers, inside the database itself, which ones have already run.</>} /></p>
        <p><T pt="Pense no Git, só que para o banco: cada migration é um commit do esquema. O estado atual do banco é a soma de todas as migrations aplicadas, da primeira até a última. Qualquer banco (o seu notebook, o CI, staging, produção) que rodar a mesma sequência chega ao mesmo esquema." en="Think of Git, but for the database: each migration is a commit of the schema. The current state of the database is the sum of every applied migration, from the first to the last. Any database (your laptop, CI, staging, production) that runs the same sequence ends up with the same schema." /></p>
        <Diagram minWidth={620} caption={<T pt="Os arquivos dizem o que deve existir; a tabela de histórico diz o que já existe. A diferença são as migrations pendentes." en="The files say what should exist; the history table says what already exists. The difference is the pending migrations." />}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Arquivos de migration no repositório e tabela de histórico no banco / Migration files in the repository and the history table in the database">
            <text x="20" y="22" className="pt mut" textAnchor="start">repositório (pasta de migrations)</text>
            <text x="20" y="22" className="en mut" textAnchor="start">repository (migrations folder)</text>
            <rect x="10" y="32" width="260" height="140" rx="4" className="ln" />
            <rect x="22" y="44" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="34" y="65" className="mono" textAnchor="start">V1__create_users.sql</text>
            <rect x="22" y="86" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="34" y="107" className="mono" textAnchor="start">V2__create_orders.sql</text>
            <rect x="22" y="128" width="236" height="32" rx="3" className="brandfill" />
            <text x="34" y="149" className="mono" textAnchor="start">V3__add_phone.sql</text>
            <text x="440" y="22" className="pt mut" textAnchor="start">banco: tabela de histórico</text>
            <text x="440" y="22" className="en mut" textAnchor="start">database: history table</text>
            <rect x="430" y="32" width="260" height="140" rx="4" className="ln" />
            <rect x="442" y="44" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="454" y="65" className="mono" textAnchor="start">1 · create_users · ✓</text>
            <rect x="442" y="86" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="454" y="107" className="mono" textAnchor="start">2 · create_orders · ✓</text>
            <rect x="442" y="128" width="236" height="32" rx="3" className="ln dash" />
            <text x="454" y="149" className="pt mono mut" textAnchor="start">3 · (pendente)</text>
            <text x="454" y="149" className="en mono mut" textAnchor="start">3 · (pending)</text>
            <path d="M258 60L442 60" className="ln dash" />
            <path d="M258 102L442 102" className="ln dash" />
            <text x="350" y="54" className="pt mut" textAnchor="middle">já aplicada</text>
            <text x="350" y="54" className="en mut" textAnchor="middle">already applied</text>
            <path d="M258 144L442 144" className="ln" />
            <path d="M435.2 140.7L442 144L435.2 147.3" className="ln" />
            <text x="350" y="138" className="pt" textAnchor="middle">migrate aplica</text>
            <text x="350" y="138" className="en" textAnchor="middle">migrate applies</text>
            <text x="10" y="200" className="pt mut" textAnchor="start">A ferramenta compara a pasta com o histórico e roda só o que falta, em ordem.</text>
            <text x="10" y="200" className="en mut" textAnchor="start">The tool compares the folder with the history and runs only what is missing, in order.</text>
          </svg>
        </Diagram>
        <h3><T pt="Qual problema resolve" en="What problem it solves" /></h3>
        <p><T pt={<>Sem migrations, o esquema muda "na mão": alguém roda um <code>ALTER TABLE</code> no banco de produção, outro esquece de rodar no staging, o colega novo não sabe quais comandos rodar para montar o banco local. O resultado tem nome: <strong>drift</strong>, quando bancos que deveriam ser iguais ficam diferentes e ninguém sabe exatamente como.</>} en={<>Without migrations, the schema changes "by hand": someone runs an <code>ALTER TABLE</code> on the production database, someone else forgets to run it on staging, the new colleague does not know which commands to run to build the local database. The result has a name: <strong>drift</strong>, when databases that should be identical end up different and nobody knows exactly how.</>} /></p>
        <Table
          head={[<T pt="Sem migrations" en="Without migrations" />, <T pt="Com migrations" en="With migrations" />]}
          rows={[
            [<T pt="SQL solto em chat, wiki ou na memória de alguém" en="SQL scattered in chat, a wiki or someone's memory" />, <T pt="cada mudança é um arquivo no Git, revisado em PR" en="each change is a file in Git, reviewed in a PR" />],
            [<T pt={"\"funciona na minha máquina\" porque o seu banco tem uma coluna a mais"} en={"\"works on my machine\" because your database has one extra column"} />, <T pt="todo ambiente roda a mesma sequência e chega ao mesmo esquema" en="every environment runs the same sequence and reaches the same schema" />],
            [<T pt="deploy do código novo antes da coluna existir: erro 500" en="deploying new code before the column exists: 500 error" />, <T pt="o deploy aplica as migrations pendentes antes (ou junto) de subir o código" en="the deploy applies pending migrations before (or together with) the code" />],
            [<T pt="ninguém sabe em que versão o banco de produção está" en="nobody knows which version the production database is at" />, <T pt="a tabela de histórico responde: versão, data, quem e checksum" en="the history table answers: version, date, who and checksum" />],
            [<T pt="montar um banco novo exige um dump de produção" en="building a new database needs a production dump" />, <T pt={<>banco vazio + <code>migrate</code> = esquema completo</>} en={<>empty database + <code>migrate</code> = full schema</>} />],
          ]}
        />
        <h3><T pt="Duas filosofias: SQL escrito ou esquema declarativo" en="Two philosophies: hand-written SQL or a declarative schema" /></h3>
        <p><T pt={<>Todas as ferramentas acabam executando SQL, mas diferem em <em>quem escreve</em> esse SQL:</>} en={<>Every tool ends up running SQL, but they differ in <em>who writes</em> that SQL:</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Versionada por SQL (Flyway, Liquibase):</strong> você escreve o <code>ALTER TABLE</code>. Controle total, nenhuma mágica, mas é você quem mantém o código das entidades e o SQL em sincronia.</>} en={<><strong>SQL-versioned (Flyway, Liquibase):</strong> you write the <code>ALTER TABLE</code>. Full control, no magic, but you keep the entity code and the SQL in sync.</>} /></li>
          <li><T pt={<><strong>Gerada a partir do modelo (Prisma, Alembic com autogenerate, TypeORM, Django):</strong> você muda o modelo (o <code>schema.prisma</code> ou as classes do SQLAlchemy), a ferramenta compara com o banco e <em>gera</em> o SQL da diferença. Rápido, mas o SQL gerado <strong>precisa ser lido</strong> antes do commit: renomear uma coluna pode virar "apagar e criar", perdendo dados.</>} en={<><strong>Generated from the model (Prisma, Alembic with autogenerate, TypeORM, Django):</strong> you change the model (the <code>schema.prisma</code> or the SQLAlchemy classes), the tool diffs it against the database and <em>generates</em> the SQL for the difference. Fast, but the generated SQL <strong>must be read</strong> before committing: renaming a column can turn into "drop and create", losing data.</>} /></li>
        </ul>
        <Callout icon="check"><T pt={<>Nas duas filosofias o artefato que vai para produção é o mesmo: um arquivo de migration imutável, com SQL concreto. O modelo declarativo é só uma forma mais confortável de <em>produzir</em> esse arquivo.</>} en={<>In both philosophies the artifact that reaches production is the same: an immutable migration file with concrete SQL. The declarative model is just a more comfortable way of <em>producing</em> that file.</>} /></Callout>
      </Section>
      <Section id="how" title={<T pt="Como a ferramenta funciona" en="How the tool works" />}>
        <p><T pt="Flyway, Prisma e Alembic seguem o mesmo algoritmo. Entendê-lo uma vez explica as três:" en="Flyway, Prisma and Alembic follow the same algorithm. Understanding it once explains all three:" /></p>
        <Diagram minWidth={620} caption={<T pt="O mesmo ciclo em Flyway, Prisma e Alembic: travar, comparar, aplicar o que falta e registrar." en="The same cycle in Flyway, Prisma and Alembic: lock, compare, apply what is missing and record it." />}>
          <svg viewBox="0 0 700 150" role="img" aria-label="Passos do comando migrate / Steps of the migrate command">
            <rect x="10" y="20" width="120" height="56" rx="4" className="ln fillsoft" />
            <text x="70" y="44" className="pt" textAnchor="middle">1. trava</text>
            <text x="70" y="44" className="en" textAnchor="middle">1. lock</text>
            <text x="70" y="62" className="pt mut" textAnchor="middle">um por vez</text>
            <text x="70" y="62" className="en mut" textAnchor="middle">one at a time</text>
            <rect x="148" y="20" width="120" height="56" rx="4" className="ln" />
            <text x="208" y="44" className="pt" textAnchor="middle">2. lê arquivos</text>
            <text x="208" y="44" className="en" textAnchor="middle">2. read files</text>
            <text x="208" y="62" className="pt mut" textAnchor="middle">e ordena</text>
            <text x="208" y="62" className="en mut" textAnchor="middle">and sort them</text>
            <rect x="286" y="20" width="120" height="56" rx="4" className="ln" />
            <text x="346" y="44" className="pt" textAnchor="middle">3. lê histórico</text>
            <text x="346" y="44" className="en" textAnchor="middle">3. read history</text>
            <text x="346" y="62" className="pt mut" textAnchor="middle">valida checksums</text>
            <text x="346" y="62" className="en mut" textAnchor="middle">check checksums</text>
            <rect x="424" y="20" width="120" height="56" rx="4" className="brandfill" />
            <text x="484" y="44" className="pt" textAnchor="middle">4. aplica</text>
            <text x="484" y="44" className="en" textAnchor="middle">4. apply</text>
            <text x="484" y="62" className="pt" textAnchor="middle">as pendentes</text>
            <text x="484" y="62" className="en" textAnchor="middle">pending ones</text>
            <rect x="562" y="20" width="128" height="56" rx="4" className="ln fillsoft" />
            <text x="626" y="44" className="pt" textAnchor="middle">5. registra</text>
            <text x="626" y="44" className="en" textAnchor="middle">5. record</text>
            <text x="626" y="62" className="pt mut" textAnchor="middle">linha no histórico</text>
            <text x="626" y="62" className="en mut" textAnchor="middle">row in history</text>
            <path d="M130 48L148 48" className="ln" />
            <path d="M142 45L148 48L142 51" className="ln" />
            <path d="M268 48L286 48" className="ln" />
            <path d="M280 45L286 48L280 51" className="ln" />
            <path d="M406 48L424 48" className="ln" />
            <path d="M418 45L424 48L418 51" className="ln" />
            <path d="M544 48L562 48" className="ln" />
            <path d="M556 45L562 48L556 51" className="ln" />
            <text x="10" y="110" className="pt mut" textAnchor="start">Se um arquivo já aplicado mudou (checksum diferente), a ferramenta para no passo 3.</text>
            <text x="10" y="110" className="en mut" textAnchor="start">If an already-applied file changed (different checksum), the tool stops at step 3.</text>
            <text x="10" y="130" className="pt mut" textAnchor="start">Os passos 4 e 5 se repetem para cada pendente, uma de cada vez e em ordem.</text>
            <text x="10" y="130" className="en mut" textAnchor="start">Steps 4 and 5 repeat for each pending migration, one at a time and in order.</text>
          </svg>
        </Diagram>
        <Table
          head={[null, "Flyway", "Prisma", "Alembic"]}
          rows={[
            [<T pt="Tabela de histórico" en="History table" />, <code>flyway_schema_history</code>, <code>_prisma_migrations</code>, <code>alembic_version</code>],
            [<T pt="O que guarda" en="What it stores" />, <T pt="uma linha por migration: versão, descrição, checksum, data, sucesso" en="one row per migration: version, description, checksum, date, success" />, <T pt="uma linha por migration: nome, checksum, início, fim, logs" en="one row per migration: name, checksum, start, finish, logs" />, <T pt={<>só <em>uma</em> linha: o id da revisão atual (a "head")</>} en={<>just <em>one</em> row: the id of the current revision (the "head")</>} />],
            [<T pt="Como ordena" en="How it orders" />, <T pt={<>pelo número da versão no nome (<code>V3</code> &lt; <code>V10</code>)</>} en={<>by the version number in the name (<code>V3</code> &lt; <code>V10</code>)</>} />, <T pt="pelo timestamp no nome da pasta" en="by the timestamp in the folder name" />, <T pt={<>por uma lista encadeada: cada arquivo aponta para o anterior (<code>down_revision</code>)</>} en={<>by a linked list: each file points to the previous one (<code>down_revision</code>)</>} />],
            [<T pt="Detecta arquivo editado" en="Detects an edited file" />, <T pt="sim (checksum)" en="yes (checksum)" />, <T pt="sim (checksum)" en="yes (checksum)" />, <T pt="não: confia em você" en="no: it trusts you" />],
            [<T pt="Trava contra execuções simultâneas" en="Lock against simultaneous runs" />, <T pt="sim" en="yes" />, <T pt="sim (advisory lock)" en="yes (advisory lock)" />, <T pt="não: rode uma vez só, num passo do deploy" en="no: run it once, in a deploy step" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>A regra de ouro de qualquer ferramenta: <strong>migration aplicada em qualquer ambiente compartilhado é imutável</strong>. Errou? Escreva uma migration nova que corrige. Editar a antiga não muda nada nos bancos que já a rodaram, e o checksum vai travar o próximo deploy.</>} en={<>The golden rule of every tool: <strong>a migration applied to any shared environment is immutable</strong>. Made a mistake? Write a new migration that fixes it. Editing the old one changes nothing in databases that already ran it, and the checksum will block the next deploy.</>} /></Callout>
      </Section>
      <Section id="start" title={<T pt="Começando do zero" en="Starting from scratch" />}>
        <h3><T pt="Como o banco precisa estar" en="What the database must look like" /></h3>
        <p><T pt={<>Migrations cuidam do que fica <em>dentro</em> do banco (tabelas, índices, constraints, dados de referência). O que está <em>em volta</em> normalmente vem antes, por infraestrutura (Docker Compose, Terraform, o painel do provedor):</>} en={<>Migrations take care of what lives <em>inside</em> the database (tables, indexes, constraints, reference data). What is <em>around</em> it usually comes first, from infrastructure (Docker Compose, Terraform, the provider's console):</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>O servidor e o database existem</strong> (<code>CREATE DATABASE app</code>). Flyway e Alembic não criam o database; o <code>prisma migrate dev</code> cria em desenvolvimento, mas em produção você não deve depender disso.</>} en={<><strong>The server and the database exist</strong> (<code>CREATE DATABASE app</code>). Flyway and Alembic do not create the database; <code>prisma migrate dev</code> does in development, but in production you should not rely on it.</>} /></li>
          <li><T pt={<><strong>Um usuário com permissão de DDL</strong> (criar e alterar tabelas) para rodar as migrations. Em produção, o ideal é separar: um usuário de migration (dono das tabelas) e um usuário da aplicação só com <code>SELECT/INSERT/UPDATE/DELETE</code>.</>} en={<><strong>A user with DDL permission</strong> (create and alter tables) to run the migrations. In production, ideally separate them: a migration user (owner of the tables) and an application user with only <code>SELECT/INSERT/UPDATE/DELETE</code>.</>} /></li>
          <li><T pt={<><strong>O schema vazio</strong> (sem tabelas) num projeto novo. A ferramenta cria a tabela de histórico sozinha na primeira execução.</>} en={<><strong>An empty schema</strong> (no tables) in a new project. The tool creates its history table on its own on the first run.</>} /></li>
          <li><T pt={<><strong>Extensões</strong> como <code>pgcrypto</code> ou <code>postgis</code> podem ir numa migration (<code>CREATE EXTENSION IF NOT EXISTS</code>) se o usuário tiver permissão; em bancos gerenciados às vezes só o admin pode, aí ficam na infraestrutura.</>} en={<><strong>Extensions</strong> such as <code>pgcrypto</code> or <code>postgis</code> can go in a migration (<code>CREATE EXTENSION IF NOT EXISTS</code>) if the user is allowed; on managed databases sometimes only the admin can, so they stay in the infrastructure.</>} /></li>
        </ul>
        <CodeBlock code={`# docker-compose.yml (dev): the server and an empty database, nothing else
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app          # the database exists, with no tables
      POSTGRES_USER: app
      POSTGRES_PASSWORD: dev
    ports: ["5432:5432"]`} />
        <h3><T pt="A primeira migration tem todas as tabelas?" en="Does the first migration have every table?" /></h3>
        <p><T pt={<>A primeira migration contém <strong>tudo o que existe no momento em que você a cria</strong>, e nada além. Num projeto realmente novo, isso costuma ser pouco: <code>users</code> e talvez mais uma ou duas tabelas. Você não precisa (nem deve) desenhar o banco inteiro do futuro no <code>V1</code>.</>} en={<>The first migration contains <strong>everything that exists at the moment you create it</strong>, and nothing more. In a truly new project, that is usually little: <code>users</code> and maybe one or two more tables. You do not need to (and should not) design the whole future database in <code>V1</code>.</>} /></p>
        <p><T pt={<>Daí em diante, cada migration é um <strong>delta</strong>: só a mudança daquela tarefa. Feature de pedidos? <code>V2__create_orders.sql</code>. Precisa do telefone do usuário? <code>V3__add_users_phone.sql</code>. Nunca volte ao <code>V1</code> para "encaixar" a coluna nova, nem num projeto que ainda não está em produção, assim que alguém além de você já rodou aquele arquivo.</>} en={<>From then on, each migration is a <strong>delta</strong>: only the change for that task. Orders feature? <code>V2__create_orders.sql</code>. Need the user's phone? <code>V3__add_users_phone.sql</code>. Never go back to <code>V1</code> to "fit in" the new column, even in a project not yet in production, as soon as anyone other than you has run that file.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Banco vazio começa pelo V1; banco que já existe sem migrations precisa de um baseline; banco com histórico só recebe o que falta." en="An empty database starts at V1; an existing database without migrations needs a baseline; a database with history only gets what is missing." />}>
          <svg viewBox="0 0 700 210" role="img" aria-label="Três situações iniciais do banco / Three starting situations for the database">
            <rect x="10" y="80" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="85" y="102" className="pt" textAnchor="middle">qual o estado</text>
            <text x="85" y="102" className="en" textAnchor="middle">what state is</text>
            <text x="85" y="120" className="pt" textAnchor="middle">do banco?</text>
            <text x="85" y="120" className="en" textAnchor="middle">the database in?</text>
            <rect x="230" y="14" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="41" className="pt" textAnchor="middle">vazio (projeto novo)</text>
            <text x="315" y="41" className="en" textAnchor="middle">empty (new project)</text>
            <rect x="230" y="83" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="102" className="pt" textAnchor="middle">já tem tabelas,</text>
            <text x="315" y="102" className="en" textAnchor="middle">has tables,</text>
            <text x="315" y="118" className="pt" textAnchor="middle">sem histórico</text>
            <text x="315" y="118" className="en" textAnchor="middle">no history</text>
            <rect x="230" y="152" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="179" className="pt" textAnchor="middle">já tem histórico</text>
            <text x="315" y="179" className="en" textAnchor="middle">already has history</text>
            <rect x="460" y="14" width="230" height="44" rx="4" className="brandfill" />
            <text x="575" y="33" className="pt" textAnchor="middle">V1 com as tabelas de hoje,</text>
            <text x="575" y="33" className="en" textAnchor="middle">V1 with today's tables,</text>
            <text x="575" y="49" className="pt" textAnchor="middle">depois um delta por tarefa</text>
            <text x="575" y="49" className="en" textAnchor="middle">then one delta per task</text>
            <rect x="460" y="83" width="230" height="44" rx="4" className="ln fillsoft" />
            <text x="575" y="102" className="pt" textAnchor="middle">baseline: V1 = dump do esquema,</text>
            <text x="575" y="102" className="en" textAnchor="middle">baseline: V1 = schema dump,</text>
            <text x="575" y="118" className="pt" textAnchor="middle">marcado como aplicado</text>
            <text x="575" y="118" className="en" textAnchor="middle">marked as applied</text>
            <rect x="460" y="152" width="230" height="44" rx="4" className="ln fillsoft" />
            <text x="575" y="179" className="pt" textAnchor="middle">roda só as pendentes</text>
            <text x="575" y="179" className="en" textAnchor="middle">runs only the pending ones</text>
            <path d="M160 105L230 36" className="ln" />
            <path d="M222.6 38.6L230 36L227.3 43.3" className="ln" />
            <path d="M160 105L230 105" className="ln" />
            <path d="M223.2 101.7L230 105L223.2 108.3" className="ln" />
            <path d="M160 105L230 174" className="ln" />
            <path d="M227.3 166.7L230 174L222.6 171.4" className="ln" />
            <path d="M400 36L460 36" className="ln" />
            <path d="M453.2 32.7L460 36L453.2 39.3" className="ln" />
            <path d="M400 105L460 105" className="ln" />
            <path d="M453.2 101.7L460 105L453.2 108.3" className="ln" />
            <path d="M400 174L460 174" className="ln" />
            <path d="M453.2 170.7L460 174L453.2 177.3" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="Banco que já existe: baseline" en="An existing database: baseline" /></h3>
        <p><T pt={<>Se o projeto já tem um banco em produção criado na mão (ou com <code>ddl-auto=update</code>, <code>create_all()</code>, <code>synchronize: true</code>), você não pode rodar um <code>V1</code> com <code>CREATE TABLE users</code>: a tabela já existe e vai dar erro. O caminho é o <strong>baseline</strong>:</>} en={<>If the project already has a production database created by hand (or with <code>ddl-auto=update</code>, <code>create_all()</code>, <code>synchronize: true</code>), you cannot run a <code>V1</code> with <code>CREATE TABLE users</code>: the table exists and it will fail. The way out is a <strong>baseline</strong>:</>} /></p>
        <ol>
          <li><T pt={<>Gere o SQL do esquema atual (<code>pg_dump --schema-only</code> ou o diff da ferramenta) e salve como a primeira migration.</>} en={<>Generate the SQL of the current schema (<code>pg_dump --schema-only</code> or the tool's diff) and save it as the first migration.</>} /></li>
          <li><T pt={<>Nos bancos que <em>já têm</em> essas tabelas, <strong>marque essa migration como aplicada sem executá-la</strong>.</>} en={<>On databases that <em>already have</em> those tables, <strong>mark that migration as applied without running it</strong>.</>} /></li>
          <li><T pt="Bancos novos (dev, CI) rodam o baseline normalmente e chegam ao mesmo esquema." en="New databases (dev, CI) run the baseline normally and reach the same schema." /></li>
        </ol>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Marcar o baseline como aplicado" en="Mark the baseline as applied" />]}
          rows={[
            ["Flyway", <><code>flyway baseline</code> <T pt="ou" en="or" /> <code>spring.flyway.baseline-on-migrate=true</code> <T pt={<>(versão do baseline: <code>baseline-version</code>)</>} en={<>(baseline version: <code>baseline-version</code>)</>} /></>],
            ["Prisma", <code>npx prisma migrate resolve --applied 0_init</code>],
            ["Alembic", <><code>alembic stamp &lt;revision&gt;</code> <T pt={<>(grava a revisão sem rodar o <code>upgrade</code>)</>} en={<>(records the revision without running <code>upgrade</code>)</>} /></>],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Desligue a geração automática de esquema assim que adotar migrations: <code>spring.jpa.hibernate.ddl-auto=validate</code> (ou <code>none</code>), nada de <code>Base.metadata.create_all()</code> no startup do FastAPI, <code>synchronize: false</code> no TypeORM. Duas fontes de verdade para o esquema é exatamente o drift que as migrations vieram resolver.</>} en={<>Turn off automatic schema generation as soon as you adopt migrations: <code>spring.jpa.hibernate.ddl-auto=validate</code> (or <code>none</code>), no <code>Base.metadata.create_all()</code> at FastAPI startup, <code>synchronize: false</code> in TypeORM. Two sources of truth for the schema is exactly the drift migrations came to solve.</>} /></Callout>
      </Section>
      <Section id="flyway" title={<T pt="Java + Spring: Flyway" en="Java + Spring: Flyway" />}>
        <p><T pt={<>O Flyway é a escolha mais comum em Spring Boot. Você escreve SQL puro, e o Spring Boot roda o Flyway sozinho no startup, <em>antes</em> do Hibernate/JPA subir.</>} en={<>Flyway is the most common choice in Spring Boot. You write plain SQL, and Spring Boot runs Flyway on its own at startup, <em>before</em> Hibernate/JPA comes up.</>} /></p>
        <h3><T pt="1. Dependências" en="1. Dependencies" /></h3>
        <CodeBlock code={`<!-- pom.xml -->
<!-- Spring Boot 4: the dedicated starter. Spring Boot 3: org.flywaydb:flyway-core instead. -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-flyway</artifactId>
</dependency>
<!-- Since Flyway 10, each database has its own module -->
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-database-postgresql</artifactId>
</dependency>
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>`} />
        <h3><T pt="2. Configuração" en="2. Configuration" /></h3>
        <CodeBlock code={`# src/main/resources/application.yml
spring:
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/app}
    username: \${DB_USER:app}
    password: \${DB_PASSWORD:dev}
  jpa:
    hibernate:
      ddl-auto: validate        # Hibernate only CHECKS the schema; Flyway is the one who changes it
  flyway:
    enabled: true
    locations: classpath:db/migration   # the default, written out for clarity
    # baseline-on-migrate: true         # only when adopting Flyway on an existing database`} />
        <h3><T pt="3. A primeira migration e as seguintes" en="3. The first migration and the next ones" /></h3>
        <p><T pt={<>O nome do arquivo <em>é</em> a configuração: <code>V</code> + versão + <strong>dois</strong> underscores + descrição + <code>.sql</code>.</>} en={<>The file name <em>is</em> the configuration: <code>V</code> + version + <strong>two</strong> underscores + description + <code>.sql</code>.</>} /></p>
        <CodeBlock code={`src/main/resources/db/migration/
├── V1__create_users.sql
├── V2__create_orders.sql
├── V3__add_users_phone.sql
└── R__orders_summary_view.sql      # repeatable: re-runs whenever its content changes`} />
        <CodeBlock code={`-- V1__create_users.sql  (the first one: only what exists today)
CREATE TABLE users (
  id          bigserial    PRIMARY KEY,
  email       varchar(255) NOT NULL UNIQUE,
  name        varchar(120) NOT NULL,
  created_at  timestamptz  NOT NULL DEFAULT now()
);

-- V2__create_orders.sql  (a delta: the orders feature)
CREATE TABLE orders (
  id          bigserial    PRIMARY KEY,
  user_id     bigint       NOT NULL REFERENCES users(id),
  total_cents integer      NOT NULL CHECK (total_cents >= 0),
  created_at  timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- V3__add_users_phone.sql  (another delta: nullable, so existing rows stay valid)
ALTER TABLE users ADD COLUMN phone varchar(30);`} />
        <CodeBlock code={`// The entity must match the schema; with ddl-auto=validate the app refuses to start if it does not
@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(nullable = false, unique = true) private String email;
  @Column(nullable = false) private String name;
  private String phone;                                   // added in V3
  @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
}`} />
        <h3><T pt="4. Rodar e inspecionar" en="4. Run and inspect" /></h3>
        <CodeBlock code={`./mvnw spring-boot:run          # applies pending migrations at startup, then starts the app

# Outside the app (CI, a deploy step), with the Flyway CLI or the Docker image:
flyway -url=jdbc:postgresql://localhost:5432/app -user=app -password=dev \\
       -locations=filesystem:src/main/resources/db/migration info      # what is applied / pending
flyway ... migrate        # apply pending
flyway ... validate       # do the files match the history? (checksums)
flyway ... repair         # fix the history after a failed migration (never to hide an edited file)`} />
        <Callout icon="check"><T pt={<>O Flyway Community não tem <code>undo</code> (os scripts <code>U1__...</code> são da edição paga). Na prática isso é bom: em produção, desfazer quase sempre é uma migration nova para frente (<em>roll forward</em>), não um <code>DROP</code> às pressas.</>} en={<>Flyway Community has no <code>undo</code> (the <code>U1__...</code> scripts are a paid feature). In practice that is fine: in production, undoing is almost always a new forward migration (<em>roll forward</em>), not a rushed <code>DROP</code>.</>} /></Callout>
      </Section>
      <Section id="prisma" title={<T pt="TypeScript: Prisma" en="TypeScript: Prisma" />}>
        <p><T pt={<>No Prisma, a fonte da verdade é o arquivo <code>schema.prisma</code>. Você altera o modelo, e o <code>prisma migrate dev</code> gera uma pasta com o SQL da diferença. É o modelo "declarativo": você descreve o destino, a ferramenta escreve o caminho.</>} en={<>In Prisma, the source of truth is the <code>schema.prisma</code> file. You change the model, and <code>prisma migrate dev</code> generates a folder with the SQL for the difference. It is the "declarative" model: you describe the destination, the tool writes the route.</>} /></p>
        <h3><T pt="1. Instalar e iniciar" en="1. Install and initialise" /></h3>
        <CodeBlock code={`npm install -D prisma
npm install @prisma/client @prisma/adapter-pg dotenv
npx prisma init --datasource-provider postgresql     # creates prisma/schema.prisma, prisma.config.ts and .env
echo 'DATABASE_URL="postgresql://app:dev@localhost:5432/app"' > .env`} />
        <CodeBlock code={`// prisma.config.ts  (Prisma 7: the connection URL lives here; in Prisma 6 it was url = env(...) in the schema)
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});`} />
        <h3><T pt="2. O modelo e a primeira migration" en="2. The model and the first migration" /></h3>
        <CodeBlock code={`// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        BigInt   @id @default(autoincrement())
  email     String   @unique @db.VarChar(255)
  name      String   @db.VarChar(120)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  @@map("users")
}`} />
        <CodeBlock code={`npx prisma migrate dev --name init
# 1. diffs schema.prisma against the database (using a temporary "shadow database")
# 2. writes prisma/migrations/20261031120000_init/migration.sql
# 3. applies it and records it in _prisma_migrations`} />
        <CodeBlock code={`prisma/migrations/
├── migration_lock.toml                       # pins the provider (postgresql); commit it
├── 20261031120000_init/migration.sql         # the first one: CREATE TABLE "users" ...
└── 20261104093000_create_orders/migration.sql`} />
        <h3><T pt="3. As próximas: altere o modelo, gere, leia o SQL" en="3. The next ones: change the model, generate, read the SQL" /></h3>
        <CodeBlock code={`model User {
  // ...
  phone  String? @db.VarChar(30)      // new, optional
  orders Order[]
}

model Order {
  id         BigInt   @id @default(autoincrement())
  userId     BigInt   @map("user_id")
  user       User     @relation(fields: [userId], references: [id])
  totalCents Int      @map("total_cents")
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz
  @@index([userId])
  @@map("orders")
}`} />
        <CodeBlock code={`npx prisma migrate dev --name create_orders --create-only   # generate the SQL but do NOT apply yet
# open prisma/migrations/<timestamp>_create_orders/migration.sql, review (or edit) it
npx prisma migrate dev                                      # now apply it`} />
        <Callout tone="warn" icon="alert"><T pt={<>Renomear um campo no <code>schema.prisma</code> gera <code>DROP COLUMN</code> + <code>ADD COLUMN</code>: os dados somem. Use <code>--create-only</code>, troque o SQL por <code>ALTER TABLE ... RENAME COLUMN</code> e só então aplique. O <code>migrate dev</code> também pode pedir para <strong>resetar</strong> o banco quando detecta drift: tudo bem no seu notebook, nunca em produção.</>} en={<>Renaming a field in <code>schema.prisma</code> generates <code>DROP COLUMN</code> + <code>ADD COLUMN</code>: the data is gone. Use <code>--create-only</code>, replace the SQL with <code>ALTER TABLE ... RENAME COLUMN</code> and only then apply. <code>migrate dev</code> may also ask to <strong>reset</strong> the database when it detects drift: fine on your laptop, never in production.</>} /></Callout>
        <h3><T pt="4. dev × deploy" en="4. dev × deploy" /></h3>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="Onde" en="Where" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<code>prisma migrate dev</code>, <T pt="só no seu notebook" en="your laptop only" />, <T pt="gera migrations, aplica, pode resetar o banco" en="generates migrations, applies, may reset the database" />],
            [<code>prisma migrate deploy</code>, <T pt="CI, staging, produção" en="CI, staging, production" />, <T pt="só aplica as pendentes; nunca gera, nunca reseta" en="only applies pending ones; never generates, never resets" />],
            [<code>prisma migrate status</code>, <T pt="qualquer lugar" en="anywhere" />, <T pt="mostra pendentes e divergências" en="shows pending ones and divergences" />],
            [<code>prisma migrate reset</code>, <T pt="só dev" en="dev only" />, <T pt="apaga tudo e reaplica do zero (e roda o seed)" en="drops everything and re-applies from scratch (and runs the seed)" />],
            [<code>prisma db push</code>, <T pt="protótipo" en="prototype" />, <T pt={<>empurra o modelo direto, <strong>sem</strong> criar migration: não use em projeto com migrations</>} en={<>pushes the model directly, <strong>without</strong> a migration: do not use in a project with migrations</>} />],
          ]}
        />
        <h3><T pt="E TypeORM ou Sequelize?" en="What about TypeORM or Sequelize?" /></h3>
        <p><T pt={<>Mesmo conceito, outros nomes. No <strong>TypeORM</strong>: <code>synchronize: false</code>, <code>typeorm migration:generate src/migrations/AddPhone -d src/data-source.ts</code> gera uma classe com <code>up()</code>/<code>down()</code> a partir das entidades, e <code>migration:run</code> aplica (histórico na tabela <code>migrations</code>). No <strong>Sequelize</strong>, o <code>sequelize-cli</code> cria arquivos com <code>up</code>/<code>down</code> escritos à mão e guarda o histórico em <code>SequelizeMeta</code>.</>} en={<>Same concept, different names. In <strong>TypeORM</strong>: <code>synchronize: false</code>, <code>typeorm migration:generate src/migrations/AddPhone -d src/data-source.ts</code> generates a class with <code>up()</code>/<code>down()</code> from the entities, and <code>migration:run</code> applies it (history in the <code>migrations</code> table). In <strong>Sequelize</strong>, <code>sequelize-cli</code> creates files with hand-written <code>up</code>/<code>down</code> and keeps the history in <code>SequelizeMeta</code>.</>} /></p>
      </Section>
      <Section id="alembic" title={<T pt="Python + FastAPI: Alembic" en="Python + FastAPI: Alembic" />}>
        <p><T pt={<>O FastAPI não tem ORM próprio; o par mais comum é <strong>SQLAlchemy</strong> (o ORM) + <strong>Alembic</strong> (as migrations, do mesmo autor). O Alembic gera migrations em Python comparando seus modelos com o banco (<code>--autogenerate</code>), e você revisa.</>} en={<>FastAPI has no ORM of its own; the most common pair is <strong>SQLAlchemy</strong> (the ORM) + <strong>Alembic</strong> (the migrations, by the same author). Alembic generates Python migrations by diffing your models against the database (<code>--autogenerate</code>), and you review them.</>} /></p>
        <h3><T pt="1. Instalar e iniciar" en="1. Install and initialise" /></h3>
        <CodeBlock code={`uv add fastapi sqlalchemy alembic "psycopg[binary]" pydantic-settings
uv run alembic init migrations       # creates alembic.ini and migrations/ (env.py, versions/)`} />
        <CodeBlock code={`# app/db.py
from datetime import datetime
from sqlalchemy import BigInteger, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())`} />
        <CodeBlock code={`# migrations/env.py (the two lines that matter)
from app.db import Base
from app.settings import settings          # pydantic-settings, reads DATABASE_URL from env/.env

config.set_main_option("sqlalchemy.url", settings.database_url)  # e.g. postgresql+psycopg://app:dev@localhost/app
target_metadata = Base.metadata            # what autogenerate compares against`} />
        <h3><T pt="2. A primeira revisão" en="2. The first revision" /></h3>
        <CodeBlock code={`uv run alembic revision --autogenerate -m "create users"
# writes migrations/versions/3f1a9c2b7d10_create_users.py
uv run alembic upgrade head          # apply everything up to the latest revision`} />
        <CodeBlock code={`# migrations/versions/3f1a9c2b7d10_create_users.py
from alembic import op
import sqlalchemy as sa

revision = "3f1a9c2b7d10"
down_revision = None                 # None = this is the first one (the root of the chain)

def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )

def downgrade() -> None:
    op.drop_table("users")`} />
        <h3><T pt="3. As próximas: a corrente de revisões" en="3. The next ones: the chain of revisions" /></h3>
        <p><T pt={<>Cada revisão nova aponta para a anterior com <code>down_revision</code>. É isso, e não o nome do arquivo, que define a ordem.</>} en={<>Each new revision points to the previous one with <code>down_revision</code>. That, not the file name, defines the order.</>} /></p>
        <CodeBlock code={`# add \`phone: Mapped[str | None] = mapped_column(String(30))\` to User, then:
uv run alembic revision --autogenerate -m "add users phone"
#   revision = "8b2e44c0a5f1"
#   down_revision = "3f1a9c2b7d10"      <- the chain
#   def upgrade(): op.add_column("users", sa.Column("phone", sa.String(30), nullable=True))
uv run alembic upgrade head

uv run alembic current               # which revision this database is at
uv run alembic history               # the whole chain
uv run alembic downgrade -1          # undo the last one (dev); in production prefer roll forward
uv run alembic check                 # fails if the models have changes with no migration (great in CI)`} />
        <Callout tone="warn" icon="alert"><T pt={<>O autogenerate não enxerga tudo: renomeações viram "apagar + criar", e mudanças de tipo, constraints sem nome e alguns defaults podem passar batido. Sempre abra o arquivo gerado. E tire o <code>Base.metadata.create_all()</code> do startup da aplicação: quem cria tabela agora é o Alembic.</>} en={<>Autogenerate does not see everything: renames become "drop + create", and type changes, unnamed constraints and some defaults may slip by. Always open the generated file. And remove <code>Base.metadata.create_all()</code> from the application startup: Alembic creates the tables now.</>} /></Callout>
      </Section>
      <Section id="conflicts" title={<T pt="Conflitos em equipe" en="Conflicts in a team" />}>
        <p><T pt="O conflito clássico: duas pessoas criam migrations ao mesmo tempo, em branches diferentes, a partir do mesmo ponto. Cada branch funciona sozinha; o problema aparece no merge." en="The classic conflict: two people create migrations at the same time, on different branches, from the same starting point. Each branch works alone; the problem shows up at merge time." /></p>
        <Diagram minWidth={620} caption={<T pt="Cada branch é válida sozinha. Juntas, duas migrations disputam o mesmo lugar na sequência." en="Each branch is valid alone. Together, two migrations compete for the same place in the sequence." />}>
          <svg viewBox="0 0 700 230" role="img" aria-label="Duas branches criam a mesma versão de migration / Two branches create the same migration version">
            <text x="10" y="44" className="mono mut" textAnchor="start">main</text>
            <path d="M60 40L640 40" className="ln" />
            <circle cx="90" cy="40" r="14" className="ln fillsoft" />
            <text x="90" y="45" className="mono" textAnchor="middle">V3</text>
            <circle cx="170" cy="40" r="14" className="ln fillsoft" />
            <text x="170" y="45" className="mono" textAnchor="middle">V4</text>
            <path d="M170 54C170 90 220 100 260 110" className="ln" />
            <path d="M170 54C170 150 220 170 260 180" className="ln" />
            <rect x="260" y="94" width="190" height="32" rx="4" className="ln" />
            <text x="355" y="115" className="mono" textAnchor="middle">V5__add_phone.sql</text>
            <text x="355" y="143" className="pt mut" textAnchor="middle">branch da Ana</text>
            <text x="355" y="143" className="en mut" textAnchor="middle">Ana's branch</text>
            <rect x="260" y="164" width="190" height="32" rx="4" className="ln" />
            <text x="355" y="185" className="mono" textAnchor="middle">V5__add_index.sql</text>
            <text x="355" y="213" className="pt mut" textAnchor="middle">branch do Bruno</text>
            <text x="355" y="213" className="en mut" textAnchor="middle">Bruno's branch</text>
            <rect x="430" y="18" width="210" height="44" rx="4" className="brandfill" />
            <text x="535" y="37" className="pt" textAnchor="middle">merge: dois V5 ✗</text>
            <text x="535" y="37" className="en" textAnchor="middle">merge: two V5s ✗</text>
            <text x="535" y="53" className="pt" textAnchor="middle">(Alembic: duas heads)</text>
            <text x="535" y="53" className="en" textAnchor="middle">(Alembic: two heads)</text>
            <path d="M450 110C520 100 535 80 535 62" className="ln dash" />
            <path d="M450 180C560 170 560 90 545 62" className="ln dash" />
          </svg>
        </Diagram>
        <h3><T pt="Como cada ferramenta reage e como resolver" en="How each tool reacts and how to fix it" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Sintoma" en="Symptom" />, <T pt="Resolução" en="Fix" />]}
          rows={[
            ["Flyway", <T pt={<>"Found more than one migration with version 5": o app não sobe. Ou, com números diferentes, uma versão menor chega depois de uma maior já aplicada e o <code>validate</code> acusa migration fora de ordem.</>} en={<>"Found more than one migration with version 5": the app does not start. Or, with different numbers, a lower version arrives after a higher one was applied and <code>validate</code> flags an out-of-order migration.</>} />, <T pt={<>Quem fizer merge por último renumera a sua (V5 → V6) <em>antes</em> de ela chegar a qualquer ambiente compartilhado. Para reduzir colisões, use versões por timestamp: <code>V20261031_1412__add_phone.sql</code>.</>} en={<>Whoever merges last renumbers theirs (V5 → V6) <em>before</em> it reaches any shared environment. To reduce collisions, use timestamp versions: <code>V20261031_1412__add_phone.sql</code>.</>} />],
            ["Prisma", <T pt={<>Os nomes não colidem (têm timestamp), mas uma migration pode ter sido gerada contra um esquema que não incluía a do colega; o <code>migrate dev</code> detecta drift.</>} en={<>Names do not collide (they have timestamps), but a migration may have been generated against a schema that lacked the colleague's; <code>migrate dev</code> detects drift.</>} />, <T pt={<>Se a sua ainda não foi para ambiente compartilhado: apague a pasta dela, faça pull/rebase, rode <code>migrate dev</code> de novo para gerar uma migration em cima do esquema atualizado.</>} en={<>If yours has not reached a shared environment: delete its folder, pull/rebase, run <code>migrate dev</code> again to generate a migration on top of the updated schema.</>} />],
            ["Alembic", <T pt={<>"Multiple head revisions are present": as duas revisões têm o mesmo <code>down_revision</code>.</>} en={<>"Multiple head revisions are present": both revisions have the same <code>down_revision</code>.</>} />, <T pt={<><code>alembic merge heads -m "merge"</code> cria uma revisão que junta as duas; ou, se a sua não saiu da branch, edite o <code>down_revision</code> dela para apontar para a do colega.</>} en={<><code>alembic merge heads -m "merge"</code> creates a revision that joins both; or, if yours never left the branch, edit its <code>down_revision</code> to point at the colleague's.</>} />],
          ]}
        />
        <h3><T pt="Regras que evitam a maior parte dos conflitos" en="Rules that avoid most conflicts" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Nunca edite uma migration que já saiu da sua máquina.</strong> Corrija com outra migration.</>} en={<><strong>Never edit a migration that has left your machine.</strong> Fix it with another migration.</>} /></li>
          <li><T pt={<><strong>Uma mudança de esquema por migration</strong>, pequena e com nome descritivo. Migrations gigantes conflitam mais e são mais difíceis de revisar.</>} en={<><strong>One schema change per migration</strong>, small and descriptively named. Huge migrations conflict more and are harder to review.</>} /></li>
          <li><T pt={<><strong>Rebase antes do merge</strong> e rode as migrations de novo localmente (de um banco limpo) para ver a sequência final.</>} en={<><strong>Rebase before merging</strong> and run the migrations again locally (from a clean database) to see the final sequence.</>} /></li>
          <li><T pt={<><strong>O CI aplica todas as migrations num banco vazio</strong> a cada PR (e roda <code>flyway validate</code>, <code>prisma migrate status</code> ou <code>alembic check</code>). Se a sequência não monta do zero, o PR não entra.</>} en={<><strong>CI applies every migration to an empty database</strong> on each PR (and runs <code>flyway validate</code>, <code>prisma migrate status</code> or <code>alembic check</code>). If the sequence does not build from scratch, the PR does not merge.</>} /></li>
          <li><T pt={<><strong>Ninguém altera o banco compartilhado na mão.</strong> Um <code>ALTER</code> manual em staging é drift garantido no próximo deploy.</>} en={<><strong>Nobody changes the shared database by hand.</strong> A manual <code>ALTER</code> on staging is guaranteed drift on the next deploy.</>} /></li>
        </ul>
        <CodeBlock code={`# .github/workflows/migrations.yml (the core of the check)
services:
  postgres:
    image: postgres:17
    env: { POSTGRES_DB: app, POSTGRES_USER: app, POSTGRES_PASSWORD: dev }
    ports: ["5432:5432"]
steps:
  - uses: actions/checkout@v4
  # pick the line for your stack:
  - run: ./mvnw -q flyway:migrate flyway:validate -Dflyway.url=jdbc:postgresql://localhost:5432/app -Dflyway.user=app -Dflyway.password=dev
  - run: npx prisma migrate deploy && npx prisma migrate status
  - run: uv run alembic upgrade head && uv run alembic check`} />
      </Section>
      <Section id="prod" title={<T pt="Em produção" en="In production" />}>
        <h3><T pt="Quando rodar" en="When to run" /></h3>
        <p><T pt={<>Duas opções comuns: (a) a aplicação roda as migrations no startup (padrão do Spring Boot com Flyway), ou (b) um <strong>passo separado do deploy</strong> roda <code>migrate</code> antes de subir a versão nova (um job no pipeline, um init container no Kubernetes, uma task one-off no ECS). Com várias réplicas, (b) é mais previsível: uma execução só, logs separados, e se falhar o deploy para antes de trocar o código.</>} en={<>Two common options: (a) the application runs the migrations at startup (the Spring Boot default with Flyway), or (b) a <strong>separate deploy step</strong> runs <code>migrate</code> before rolling out the new version (a pipeline job, a Kubernetes init container, a one-off ECS task). With several replicas, (b) is more predictable: a single run, separate logs, and if it fails the deploy stops before swapping the code.</>} /></p>
        <h3><T pt="Mudanças sem downtime: expandir e contrair" en="Zero-downtime changes: expand and contract" /></h3>
        <p><T pt={<>Durante um deploy, a versão antiga e a nova do código rodam ao mesmo tempo contra o <em>mesmo</em> banco. Então toda migration precisa ser compatível com as duas. Renomear <code>name</code> para <code>full_name</code> num passo só quebra a versão antiga. O jeito seguro é dividir em etapas:</>} en={<>During a deploy, the old and new versions of the code run at the same time against the <em>same</em> database. So every migration must be compatible with both. Renaming <code>name</code> to <code>full_name</code> in one step breaks the old version. The safe way is to split it into stages:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Uma mudança incompatível vira três mudanças compatíveis, cada uma segura de aplicar com o código antigo ainda no ar." en="One incompatible change becomes three compatible ones, each safe to apply with the old code still running." />}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Expandir, migrar, contrair / Expand, migrate, contract">
            <rect x="10" y="20" width="210" height="90" rx="4" className="ln fillsoft" />
            <text x="115" y="44" className="pt" textAnchor="middle">1. expandir</text>
            <text x="115" y="44" className="en" textAnchor="middle">1. expand</text>
            <text x="115" y="66" className="mono mut" textAnchor="middle">ADD COLUMN full_name</text>
            <text x="115" y="86" className="pt mut" textAnchor="middle">app escreve nas duas</text>
            <text x="115" y="86" className="en mut" textAnchor="middle">app writes to both</text>
            <rect x="245" y="20" width="210" height="90" rx="4" className="brandfill" />
            <text x="350" y="44" className="pt" textAnchor="middle">2. migrar dados</text>
            <text x="350" y="44" className="en" textAnchor="middle">2. migrate data</text>
            <text x="350" y="66" className="mono" textAnchor="middle">UPDATE ... (em lotes)</text>
            <text x="350" y="86" className="pt" textAnchor="middle">app passa a ler a nova</text>
            <text x="350" y="86" className="en" textAnchor="middle">app reads the new one</text>
            <rect x="480" y="20" width="210" height="90" rx="4" className="ln fillsoft" />
            <text x="585" y="44" className="pt" textAnchor="middle">3. contrair</text>
            <text x="585" y="44" className="en" textAnchor="middle">3. contract</text>
            <text x="585" y="66" className="mono mut" textAnchor="middle">DROP COLUMN name</text>
            <text x="585" y="86" className="pt mut" textAnchor="middle">nenhum código usa mais</text>
            <text x="585" y="86" className="en mut" textAnchor="middle">no code uses it anymore</text>
            <path d="M220 65L245 65" className="ln" />
            <path d="M238.2 61.7L245 65L238.2 68.3" className="ln" />
            <path d="M455 65L480 65" className="ln" />
            <path d="M473.2 61.7L480 65L473.2 68.3" className="ln" />
            <text x="10" y="145" className="pt mut" textAnchor="start">Cada etapa é uma migration e um deploy separados; entre elas, as duas versões do código convivem.</text>
            <text x="10" y="145" className="en mut" textAnchor="start">Each stage is a separate migration and deploy; between them, both versions of the code coexist.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Ponto" en="Point" />, <T pt="Prática" en="Practice" />]}
          rows={[
            [<T pt="Coluna nova" en="New column" />, <T pt={<>crie como <code>NULL</code> (ou com <code>DEFAULT</code> constante); <code>NOT NULL</code> só depois de preencher as linhas existentes</>} en={<>create it as <code>NULL</code> (or with a constant <code>DEFAULT</code>); <code>NOT NULL</code> only after filling the existing rows</>} />],
            [<T pt="Índice em tabela grande" en="Index on a big table" />, <T pt={<><code>CREATE INDEX CONCURRENTLY</code> não trava escrita, mas não roda dentro de transação: no Flyway, configure <code>executeInTransaction=false</code> para esse script; no Alembic, use <code>op.get_context().autocommit_block()</code></>} en={<><code>CREATE INDEX CONCURRENTLY</code> does not block writes, but cannot run inside a transaction: in Flyway, set <code>executeInTransaction=false</code> for that script; in Alembic, use <code>op.get_context().autocommit_block()</code></>} />],
            [<T pt="Locks longos" en="Long locks" />, <T pt={<>defina <code>SET lock_timeout = '5s'</code> no início: melhor a migration falhar do que travar a aplicação inteira esperando um lock</>} en={<>set <code>SET lock_timeout = '5s'</code> at the start: better for the migration to fail than to freeze the whole application waiting on a lock</>} />],
            [<T pt="Transações" en="Transactions" />, <T pt={<>no Postgres, DDL é transacional: uma migration que falha volta inteira. No MySQL não: um erro no meio deixa a migration pela metade, e o Flyway exige <code>repair</code> depois de você limpar à mão</>} en={<>in Postgres, DDL is transactional: a failing migration rolls back entirely. Not in MySQL: an error halfway leaves the migration half-applied, and Flyway requires <code>repair</code> after you clean up by hand</>} />],
            [<T pt="Dados em massa" en="Bulk data" />, <T pt={<>backfill de milhões de linhas em lotes, num job à parte, não num único <code>UPDATE</code> dentro da migration</>} en={<>backfill millions of rows in batches, in a separate job, not in a single <code>UPDATE</code> inside the migration</>} />],
            [<T pt="Backup" en="Backup" />, <T pt={<>snapshot ou PITR ligado antes de migrations destrutivas (<code>DROP</code>, mudança de tipo)</>} en={<>a snapshot or PITR enabled before destructive migrations (<code>DROP</code>, type changes)</>} />],
            [<T pt="Desfazer" en="Undo" />, <T pt={<>prefira <em>roll forward</em> (migration nova). <code>down</code>/<code>downgrade</code> ajudam em dev, mas em produção um <code>DROP</code> de volta pode apagar dados escritos depois</>} en={<>prefer <em>roll forward</em> (a new migration). <code>down</code>/<code>downgrade</code> help in dev, but in production a reverse <code>DROP</code> can erase data written afterwards</>} />],
            [<T pt="Permissões" en="Permissions" />, <T pt="o deploy usa o usuário de migration; a aplicação roda com um usuário sem DDL" en="the deploy uses the migration user; the application runs with a user without DDL" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>O comando que roda em produção é sempre o "só aplica": <code>flyway migrate</code>, <code>prisma migrate deploy</code>, <code>alembic upgrade head</code>. Nunca <code>prisma migrate dev</code>, <code>migrate reset</code>, <code>db push</code>, <code>flyway clean</code> ou <code>ddl-auto=update</code> contra um banco com dados reais. No Spring Boot, mantenha <code>spring.flyway.clean-disabled=true</code> (o padrão).</>} en={<>The command that runs in production is always the "apply only" one: <code>flyway migrate</code>, <code>prisma migrate deploy</code>, <code>alembic upgrade head</code>. Never <code>prisma migrate dev</code>, <code>migrate reset</code>, <code>db push</code>, <code>flyway clean</code> or <code>ddl-auto=update</code> against a database with real data. In Spring Boot, keep <code>spring.flyway.clean-disabled=true</code> (the default).</>} /></Callout>
      </Section>
      <Section id="lab" title={<T pt="Exercício: Flyway em 10 minutos" en="Exercise: Flyway in 10 minutes" />}>
        <p><T pt="Pré-requisito: só Docker. Você vai criar um banco vazio, aplicar duas migrations, quebrar o checksum de propósito e ver a ferramenta recusar. Os conceitos valem igual para Prisma e Alembic." en="Prerequisite: just Docker. You will create an empty database, apply two migrations, break the checksum on purpose and watch the tool refuse. The concepts apply the same way to Prisma and Alembic." /></p>
        <CodeBlock code={`mkdir -p mig-lab/sql && cd mig-lab
docker network create mig
docker run -d --name pg-mig --network mig -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=app postgres:17

# a helper so each command stays short
fw() { docker run --rm --network mig -v "$PWD/sql:/flyway/sql" flyway/flyway \\
  -url=jdbc:postgresql://pg-mig:5432/app -user=postgres -password=dev "$@"; }

cat > sql/V1__create_users.sql <<'SQL'
CREATE TABLE users (id bigserial PRIMARY KEY, email varchar(255) NOT NULL UNIQUE);
SQL
fw info       # V1: Pending
fw migrate    # creates flyway_schema_history and applies V1
fw info       # V1: Success`} />
        <p><T pt="Agora um delta, e depois a infração:" en="Now a delta, and then the violation:" /></p>
        <CodeBlock code={`echo "ALTER TABLE users ADD COLUMN phone varchar(30);" > sql/V2__add_users_phone.sql
fw migrate    # applies only V2

# Edit an already-applied migration:
echo "-- just a comment" >> sql/V1__create_users.sql
fw validate   # ERROR: Migration checksum mismatch for migration version 1

docker exec pg-mig psql -U postgres -d app -c \\
  "SELECT version, description, checksum, success FROM flyway_schema_history;"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> duas linhas no histórico e o <code>validate</code> falhando por checksum. Desfaça a edição (<code>git checkout</code> num projeto real) e o <code>validate</code> volta a passar. Esse erro é o que protege produção de alguém "consertar" uma migration antiga.</>} en={<><strong>Expected result:</strong> two rows in the history and <code>validate</code> failing on the checksum. Undo the edit (<code>git checkout</code> in a real project) and <code>validate</code> passes again. That error is what protects production from someone "fixing" an old migration.</>} /></p>
        <CodeBlock code={`docker rm -f pg-mig && docker network rm mig   # cleanup`} />
      </Section>
      <Section id="cheat-mig" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, "Flyway", "Prisma", "Alembic"]}
          rows={[
            [<T pt="criar uma migration" en="create a migration" />, <T pt={<>novo arquivo <code>V&lt;n&gt;__nome.sql</code></>} en={<>new file <code>V&lt;n&gt;__name.sql</code></>} />, <code>migrate dev --name x</code>, <code>revision --autogenerate -m x</code>],
            [<T pt="aplicar pendentes" en="apply pending" />, <code>migrate</code>, <code>migrate deploy</code>, <code>upgrade head</code>],
            [<T pt="ver o estado" en="see the state" />, <code>info</code>, <code>migrate status</code>, <><code>current</code> / <code>history</code></>],
            [<T pt="banco existente (baseline)" en="existing database (baseline)" />, <code>baseline</code>, <code>migrate resolve --applied</code>, <code>stamp</code>],
            [<T pt="checar no CI" en="check in CI" />, <code>validate</code>, <code>migrate status</code>, <code>check</code>],
            [<T pt="resolver conflito" en="resolve a conflict" />, <T pt="renumerar a sua" en="renumber yours" />, <T pt="apagar a sua e regenerar" en="delete yours and regenerate" />, <code>merge heads</code>],
            [<T pt="desfazer" en="undo" />, <T pt="migration nova" en="new migration" />, <T pt="migration nova" en="new migration" />, <><code>downgrade -1</code> <T pt="(dev)" en="(dev)" /></>],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul className="ds-list">
          <li><T pt="O que é drift e por que migrations o evitam?" en="What is drift and why do migrations prevent it?" /></li>
          <li><T pt="O que a primeira migration deve conter num projeto novo? E as seguintes?" en="What should the first migration contain in a new project? And the next ones?" /></li>
          <li><T pt="O que precisa existir no banco antes da primeira migration rodar?" en="What must exist in the database before the first migration runs?" /></li>
          <li><T pt="Como adotar migrations num banco que já está em produção?" en="How do you adopt migrations on a database already in production?" /></li>
          <li><T pt="Por que editar uma migration já aplicada é um erro, e como o Flyway e o Prisma detectam isso?" en="Why is editing an applied migration a mistake, and how do Flyway and Prisma detect it?" /></li>
          <li><T pt="Duas branches criaram migrations ao mesmo tempo. O que acontece em cada ferramenta e como resolver?" en="Two branches created migrations at the same time. What happens in each tool and how do you fix it?" /></li>
          <li><T pt="Por que renomear uma coluna exige expandir e contrair num sistema com deploy sem downtime?" en="Why does renaming a column require expand and contract in a system with zero-downtime deploys?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "Flyway: Migrations", href: "https://documentation.red-gate.com/fd/migrations-271585107.html" },
          { label: "Spring Boot: Database Initialization (Flyway)", href: "https://docs.spring.io/spring-boot/how-to/data-initialization.html" },
          { label: "Prisma Migrate", href: "https://www.prisma.io/docs/orm/prisma-migrate" },
          { label: "Prisma: Baselining a database", href: "https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining" },
          { label: "Prisma 7: Config API (prisma.config.ts)", href: "https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference" },
          { label: "Alembic tutorial", href: "https://alembic.sqlalchemy.org/en/latest/tutorial.html" },
          { label: "Alembic: Working with branches", href: "https://alembic.sqlalchemy.org/en/latest/branches.html" },
          { label: "PostgreSQL: CREATE INDEX CONCURRENTLY", href: "https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY" },
        ]}
      />
    </>
  );
}
