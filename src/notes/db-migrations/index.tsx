import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "db-migrations",
  title: "Migrations: Flyway, Prisma e Alembic",
  seo: {
    title: "Migrations de banco: Flyway, Prisma e Alembic",
    description: "O que são migrations de banco e qual problema resolvem, como começar num projeto novo, como o banco precisa estar, a primeira migration e as seguintes, baseline de um banco existente, como evitar conflitos em equipe e como rodar em produção, com Flyway (Java/Spring), Prisma (TypeScript) e Alembic (Python/FastAPI).",
  },
  summary: "o que são migrations e o problema de drift que resolvem, como as ferramentas funcionam (tabela de histórico, checksums, lock), como o banco deve estar antes da primeira migration, a primeira migration versus deltas incrementais, baseline de um banco existente, e montagens lado a lado de Flyway com Spring Boot, Prisma com TypeScript (mais TypeORM e Sequelize) e Alembic com FastAPI e SQLAlchemy; conflitos no time (versões duplicadas, múltiplos heads no Alembic) e checagens no CI, expand/contract para mudanças sem parada, práticas de produção e um laboratório de Flyway em Docker.",
  kicker: "Guia de estudo",
  heroTitle: <>O esquema é código, <em>e tem histórico.</em></>,
  heroLede: "O que são migrations de banco, qual problema resolvem, como começar num projeto novo, como o banco precisa estar antes da primeira, como evitar conflitos em equipe e como rodar em produção, com Flyway (Java/Spring), Prisma (TypeScript) e Alembic (Python/FastAPI).",
  published: "2026-10-31",
  updated: "2026-10-31",
  toc: [
    {
      items: [
        { id: "what", title: "O que é uma migration" },
        { id: "how", title: "Como a ferramenta funciona" },
        { id: "start", title: "Começando do zero" },
        { id: "flyway", title: "Java + Spring: Flyway" },
        { id: "prisma", title: "TypeScript: Prisma" },
        { id: "alembic", title: "Python + FastAPI: Alembic" },
        { id: "conflicts", title: "Conflitos em equipe" },
        { id: "prod", title: "Em produção" },
        { id: "lab", title: "Exercício: Flyway em 10 minutos" },
        { id: "cheat-mig", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que é uma migration"}>
        <p>Uma <strong>migration</strong> é um arquivo versionado que descreve <em>uma</em> mudança no esquema do banco: criar uma tabela, adicionar uma coluna, criar um índice, renomear algo, mover dados. Os arquivos ficam no repositório, ao lado do código, e são aplicados <strong>em ordem</strong> por uma ferramenta que lembra, dentro do próprio banco, quais já rodaram.</p>
        <p>Pense no Git, só que para o banco: cada migration é um commit do esquema. O estado atual do banco é a soma de todas as migrations aplicadas, da primeira até a última. Qualquer banco (o seu notebook, o CI, staging, produção) que rodar a mesma sequência chega ao mesmo esquema.</p>
        <Diagram minWidth={620} caption={"Os arquivos dizem o que deve existir; a tabela de histórico diz o que já existe. A diferença são as migrations pendentes."}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Arquivos de migration no repositório e tabela de histórico no banco">
            <text x="20" y="22" className="mut" textAnchor="start">repositório (pasta de migrations)</text>
            <rect x="10" y="32" width="260" height="140" rx="4" className="ln" />
            <rect x="22" y="44" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="34" y="65" className="mono" textAnchor="start">V1__create_users.sql</text>
            <rect x="22" y="86" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="34" y="107" className="mono" textAnchor="start">V2__create_orders.sql</text>
            <rect x="22" y="128" width="236" height="32" rx="3" className="brandfill" />
            <text x="34" y="149" className="mono" textAnchor="start">V3__add_phone.sql</text>
            <text x="440" y="22" className="mut" textAnchor="start">banco: tabela de histórico</text>
            <rect x="430" y="32" width="260" height="140" rx="4" className="ln" />
            <rect x="442" y="44" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="454" y="65" className="mono" textAnchor="start">1 · create_users · ✓</text>
            <rect x="442" y="86" width="236" height="32" rx="3" className="ln fillsoft" />
            <text x="454" y="107" className="mono" textAnchor="start">2 · create_orders · ✓</text>
            <rect x="442" y="128" width="236" height="32" rx="3" className="ln dash" />
            <text x="454" y="149" className="mono mut" textAnchor="start">3 · (pendente)</text>
            <path d="M258 60L442 60" className="ln dash" />
            <path d="M258 102L442 102" className="ln dash" />
            <text x="350" y="54" className="mut" textAnchor="middle">já aplicada</text>
            <path d="M258 144L442 144" className="ln" />
            <path d="M435.2 140.7L442 144L435.2 147.3" className="ln" />
            <text x="350" y="138" textAnchor="middle">migrate aplica</text>
            <text x="10" y="200" className="mut" textAnchor="start">A ferramenta compara a pasta com o histórico e roda só o que falta, em ordem.</text>
          </svg>
        </Diagram>
        <h3>Qual problema resolve</h3>
        <p>Sem migrations, o esquema muda "na mão": alguém roda um <code>ALTER TABLE</code> no banco de produção, outro esquece de rodar no staging, o colega novo não sabe quais comandos rodar para montar o banco local. O resultado tem nome: <strong>drift</strong>, quando bancos que deveriam ser iguais ficam diferentes e ninguém sabe exatamente como.</p>
        <Table
          head={["Sem migrations", "Com migrations"]}
          rows={[
            ["SQL solto em chat, wiki ou na memória de alguém", "cada mudança é um arquivo no Git, revisado em PR"],
            ["\"funciona na minha máquina\" porque o seu banco tem uma coluna a mais", "todo ambiente roda a mesma sequência e chega ao mesmo esquema"],
            ["deploy do código novo antes da coluna existir: erro 500", "o deploy aplica as migrations pendentes antes (ou junto) de subir o código"],
            ["ninguém sabe em que versão o banco de produção está", "a tabela de histórico responde: versão, data, quem e checksum"],
            ["montar um banco novo exige um dump de produção", <>banco vazio + <code>migrate</code> = esquema completo</>],
          ]}
        />
        <h3>Duas filosofias: SQL escrito ou esquema declarativo</h3>
        <p>Todas as ferramentas acabam executando SQL, mas diferem em <em>quem escreve</em> esse SQL:</p>
        <ul className="ds-list">
          <li><strong>Versionada por SQL (Flyway, Liquibase):</strong> você escreve o <code>ALTER TABLE</code>. Controle total, nenhuma mágica, mas é você quem mantém o código das entidades e o SQL em sincronia.</li>
          <li><strong>Gerada a partir do modelo (Prisma, Alembic com autogenerate, TypeORM, Django):</strong> você muda o modelo (o <code>schema.prisma</code> ou as classes do SQLAlchemy), a ferramenta compara com o banco e <em>gera</em> o SQL da diferença. Rápido, mas o SQL gerado <strong>precisa ser lido</strong> antes do commit: renomear uma coluna pode virar "apagar e criar", perdendo dados.</li>
        </ul>
        <Callout icon="check">Nas duas filosofias o artefato que vai para produção é o mesmo: um arquivo de migration imutável, com SQL concreto. O modelo declarativo é só uma forma mais confortável de <em>produzir</em> esse arquivo.</Callout>
      </Section>
      <Section id="how" title={"Como a ferramenta funciona"}>
        <p>Flyway, Prisma e Alembic seguem o mesmo algoritmo. Entendê-lo uma vez explica as três:</p>
        <Diagram minWidth={620} caption={"O mesmo ciclo em Flyway, Prisma e Alembic: travar, comparar, aplicar o que falta e registrar."}>
          <svg viewBox="0 0 700 150" role="img" aria-label="Passos do comando migrate">
            <rect x="10" y="20" width="120" height="56" rx="4" className="ln fillsoft" />
            <text x="70" y="44" textAnchor="middle">1. trava</text>
            <text x="70" y="62" className="mut" textAnchor="middle">um por vez</text>
            <rect x="148" y="20" width="120" height="56" rx="4" className="ln" />
            <text x="208" y="44" textAnchor="middle">2. lê arquivos</text>
            <text x="208" y="62" className="mut" textAnchor="middle">e ordena</text>
            <rect x="286" y="20" width="120" height="56" rx="4" className="ln" />
            <text x="346" y="44" textAnchor="middle">3. lê histórico</text>
            <text x="346" y="62" className="mut" textAnchor="middle">valida checksums</text>
            <rect x="424" y="20" width="120" height="56" rx="4" className="brandfill" />
            <text x="484" y="44" textAnchor="middle">4. aplica</text>
            <text x="484" y="62" textAnchor="middle">as pendentes</text>
            <rect x="562" y="20" width="128" height="56" rx="4" className="ln fillsoft" />
            <text x="626" y="44" textAnchor="middle">5. registra</text>
            <text x="626" y="62" className="mut" textAnchor="middle">linha no histórico</text>
            <path d="M130 48L148 48" className="ln" />
            <path d="M142 45L148 48L142 51" className="ln" />
            <path d="M268 48L286 48" className="ln" />
            <path d="M280 45L286 48L280 51" className="ln" />
            <path d="M406 48L424 48" className="ln" />
            <path d="M418 45L424 48L418 51" className="ln" />
            <path d="M544 48L562 48" className="ln" />
            <path d="M556 45L562 48L556 51" className="ln" />
            <text x="10" y="110" className="mut" textAnchor="start">Se um arquivo já aplicado mudou (checksum diferente), a ferramenta para no passo 3.</text>
            <text x="10" y="130" className="mut" textAnchor="start">Os passos 4 e 5 se repetem para cada pendente, uma de cada vez e em ordem.</text>
          </svg>
        </Diagram>
        <Table
          head={[null, "Flyway", "Prisma", "Alembic"]}
          rows={[
            ["Tabela de histórico", <code>flyway_schema_history</code>, <code>_prisma_migrations</code>, <code>alembic_version</code>],
            ["O que guarda", "uma linha por migration: versão, descrição, checksum, data, sucesso", "uma linha por migration: nome, checksum, início, fim, logs", <>só <em>uma</em> linha: o id da revisão atual (a "head")</>],
            ["Como ordena", <>pelo número da versão no nome (<code>V3</code> &lt; <code>V10</code>)</>, "pelo timestamp no nome da pasta", <>por uma lista encadeada: cada arquivo aponta para o anterior (<code>down_revision</code>)</>],
            ["Detecta arquivo editado", "sim (checksum)", "sim (checksum)", "não: confia em você"],
            ["Trava contra execuções simultâneas", "sim", "sim (advisory lock)", "não: rode uma vez só, num passo do deploy"],
          ]}
        />
        <Callout tone="warn" icon="alert">A regra de ouro de qualquer ferramenta: <strong>migration aplicada em qualquer ambiente compartilhado é imutável</strong>. Errou? Escreva uma migration nova que corrige. Editar a antiga não muda nada nos bancos que já a rodaram, e o checksum vai travar o próximo deploy.</Callout>
      </Section>
      <Section id="start" title={"Começando do zero"}>
        <h3>Como o banco precisa estar</h3>
        <p>Migrations cuidam do que fica <em>dentro</em> do banco (tabelas, índices, constraints, dados de referência). O que está <em>em volta</em> normalmente vem antes, por infraestrutura (Docker Compose, Terraform, o painel do provedor):</p>
        <ul className="ds-list">
          <li><strong>O servidor e o database existem</strong> (<code>CREATE DATABASE app</code>). Flyway e Alembic não criam o database; o <code>prisma migrate dev</code> cria em desenvolvimento, mas em produção você não deve depender disso.</li>
          <li><strong>Um usuário com permissão de DDL</strong> (criar e alterar tabelas) para rodar as migrations. Em produção, o ideal é separar: um usuário de migration (dono das tabelas) e um usuário da aplicação só com <code>SELECT/INSERT/UPDATE/DELETE</code>.</li>
          <li><strong>O schema vazio</strong> (sem tabelas) num projeto novo. A ferramenta cria a tabela de histórico sozinha na primeira execução.</li>
          <li><strong>Extensões</strong> como <code>pgcrypto</code> ou <code>postgis</code> podem ir numa migration (<code>CREATE EXTENSION IF NOT EXISTS</code>) se o usuário tiver permissão; em bancos gerenciados às vezes só o admin pode, aí ficam na infraestrutura.</li>
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
        <h3>A primeira migration tem todas as tabelas?</h3>
        <p>A primeira migration contém <strong>tudo o que existe no momento em que você a cria</strong>, e nada além. Num projeto realmente novo, isso costuma ser pouco: <code>users</code> e talvez mais uma ou duas tabelas. Você não precisa (nem deve) desenhar o banco inteiro do futuro no <code>V1</code>.</p>
        <p>Daí em diante, cada migration é um <strong>delta</strong>: só a mudança daquela tarefa. Feature de pedidos? <code>V2__create_orders.sql</code>. Precisa do telefone do usuário? <code>V3__add_users_phone.sql</code>. Nunca volte ao <code>V1</code> para "encaixar" a coluna nova, nem num projeto que ainda não está em produção, assim que alguém além de você já rodou aquele arquivo.</p>
        <Diagram minWidth={620} caption={"Banco vazio começa pelo V1; banco que já existe sem migrations precisa de um baseline; banco com histórico só recebe o que falta."}>
          <svg viewBox="0 0 700 210" role="img" aria-label="Três situações iniciais do banco">
            <rect x="10" y="80" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="85" y="102" textAnchor="middle">qual o estado</text>
            <text x="85" y="120" textAnchor="middle">do banco?</text>
            <rect x="230" y="14" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="41" textAnchor="middle">vazio (projeto novo)</text>
            <rect x="230" y="83" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="102" textAnchor="middle">já tem tabelas,</text>
            <text x="315" y="118" textAnchor="middle">sem histórico</text>
            <rect x="230" y="152" width="170" height="44" rx="4" className="ln" />
            <text x="315" y="179" textAnchor="middle">já tem histórico</text>
            <rect x="460" y="14" width="230" height="44" rx="4" className="brandfill" />
            <text x="575" y="33" textAnchor="middle">V1 com as tabelas de hoje,</text>
            <text x="575" y="49" textAnchor="middle">depois um delta por tarefa</text>
            <rect x="460" y="83" width="230" height="44" rx="4" className="ln fillsoft" />
            <text x="575" y="102" textAnchor="middle">baseline: V1 = dump do esquema,</text>
            <text x="575" y="118" textAnchor="middle">marcado como aplicado</text>
            <rect x="460" y="152" width="230" height="44" rx="4" className="ln fillsoft" />
            <text x="575" y="179" textAnchor="middle">roda só as pendentes</text>
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
        <h3>Banco que já existe: baseline</h3>
        <p>Se o projeto já tem um banco em produção criado na mão (ou com <code>ddl-auto=update</code>, <code>create_all()</code>, <code>synchronize: true</code>), você não pode rodar um <code>V1</code> com <code>CREATE TABLE users</code>: a tabela já existe e vai dar erro. O caminho é o <strong>baseline</strong>:</p>
        <ol>
          <li>Gere o SQL do esquema atual (<code>pg_dump --schema-only</code> ou o diff da ferramenta) e salve como a primeira migration.</li>
          <li>Nos bancos que <em>já têm</em> essas tabelas, <strong>marque essa migration como aplicada sem executá-la</strong>.</li>
          <li>Bancos novos (dev, CI) rodam o baseline normalmente e chegam ao mesmo esquema.</li>
        </ol>
        <Table
          head={["Ferramenta", "Marcar o baseline como aplicado"]}
          rows={[
            ["Flyway", <><code>flyway baseline</code> ou <code>spring.flyway.baseline-on-migrate=true</code> (versão do baseline: <code>baseline-version</code>)</>],
            ["Prisma", <code>npx prisma migrate resolve --applied 0_init</code>],
            ["Alembic", <><code>alembic stamp &lt;revision&gt;</code> (grava a revisão sem rodar o <code>upgrade</code>)</>],
          ]}
        />
        <Callout tone="warn" icon="alert">Desligue a geração automática de esquema assim que adotar migrations: <code>spring.jpa.hibernate.ddl-auto=validate</code> (ou <code>none</code>), nada de <code>Base.metadata.create_all()</code> no startup do FastAPI, <code>synchronize: false</code> no TypeORM. Duas fontes de verdade para o esquema é exatamente o drift que as migrations vieram resolver.</Callout>
      </Section>
      <Section id="flyway" title={"Java + Spring: Flyway"}>
        <p>O Flyway é a escolha mais comum em Spring Boot. Você escreve SQL puro, e o Spring Boot roda o Flyway sozinho no startup, <em>antes</em> do Hibernate/JPA subir.</p>
        <h3>1. Dependências</h3>
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
        <h3>2. Configuração</h3>
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
        <h3>3. A primeira migration e as seguintes</h3>
        <p>O nome do arquivo <em>é</em> a configuração: <code>V</code> + versão + <strong>dois</strong> underscores + descrição + <code>.sql</code>.</p>
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
        <h3>4. Rodar e inspecionar</h3>
        <CodeBlock code={`./mvnw spring-boot:run          # applies pending migrations at startup, then starts the app

# Outside the app (CI, a deploy step), with the Flyway CLI or the Docker image:
flyway -url=jdbc:postgresql://localhost:5432/app -user=app -password=dev \\
       -locations=filesystem:src/main/resources/db/migration info      # what is applied / pending
flyway ... migrate        # apply pending
flyway ... validate       # do the files match the history? (checksums)
flyway ... repair         # fix the history after a failed migration (never to hide an edited file)`} />
        <Callout icon="check">O Flyway Community não tem <code>undo</code> (os scripts <code>U1__...</code> são da edição paga). Na prática isso é bom: em produção, desfazer quase sempre é uma migration nova para frente (<em>roll forward</em>), não um <code>DROP</code> às pressas.</Callout>
      </Section>
      <Section id="prisma" title={"TypeScript: Prisma"}>
        <p>No Prisma, a fonte da verdade é o arquivo <code>schema.prisma</code>. Você altera o modelo, e o <code>prisma migrate dev</code> gera uma pasta com o SQL da diferença. É o modelo "declarativo": você descreve o destino, a ferramenta escreve o caminho.</p>
        <h3>1. Instalar e iniciar</h3>
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
        <h3>2. O modelo e a primeira migration</h3>
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
        <h3>3. As próximas: altere o modelo, gere, leia o SQL</h3>
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
        <Callout tone="warn" icon="alert">Renomear um campo no <code>schema.prisma</code> gera <code>DROP COLUMN</code> + <code>ADD COLUMN</code>: os dados somem. Use <code>--create-only</code>, troque o SQL por <code>ALTER TABLE ... RENAME COLUMN</code> e só então aplique. O <code>migrate dev</code> também pode pedir para <strong>resetar</strong> o banco quando detecta drift: tudo bem no seu notebook, nunca em produção.</Callout>
        <h3>4. dev × deploy</h3>
        <Table
          head={["Comando", "Onde", "O que faz"]}
          rows={[
            [<code>prisma migrate dev</code>, "só no seu notebook", "gera migrations, aplica, pode resetar o banco"],
            [<code>prisma migrate deploy</code>, "CI, staging, produção", "só aplica as pendentes; nunca gera, nunca reseta"],
            [<code>prisma migrate status</code>, "qualquer lugar", "mostra pendentes e divergências"],
            [<code>prisma migrate reset</code>, "só dev", "apaga tudo e reaplica do zero (e roda o seed)"],
            [<code>prisma db push</code>, "protótipo", <>empurra o modelo direto, <strong>sem</strong> criar migration: não use em projeto com migrations</>],
          ]}
        />
        <h3>E TypeORM ou Sequelize?</h3>
        <p>Mesmo conceito, outros nomes. No <strong>TypeORM</strong>: <code>synchronize: false</code>, <code>typeorm migration:generate src/migrations/AddPhone -d src/data-source.ts</code> gera uma classe com <code>up()</code>/<code>down()</code> a partir das entidades, e <code>migration:run</code> aplica (histórico na tabela <code>migrations</code>). No <strong>Sequelize</strong>, o <code>sequelize-cli</code> cria arquivos com <code>up</code>/<code>down</code> escritos à mão e guarda o histórico em <code>SequelizeMeta</code>.</p>
      </Section>
      <Section id="alembic" title={"Python + FastAPI: Alembic"}>
        <p>O FastAPI não tem ORM próprio; o par mais comum é <strong>SQLAlchemy</strong> (o ORM) + <strong>Alembic</strong> (as migrations, do mesmo autor). O Alembic gera migrations em Python comparando seus modelos com o banco (<code>--autogenerate</code>), e você revisa.</p>
        <h3>1. Instalar e iniciar</h3>
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
        <h3>2. A primeira revisão</h3>
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
        <h3>3. As próximas: a corrente de revisões</h3>
        <p>Cada revisão nova aponta para a anterior com <code>down_revision</code>. É isso, e não o nome do arquivo, que define a ordem.</p>
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
        <Callout tone="warn" icon="alert">O autogenerate não enxerga tudo: renomeações viram "apagar + criar", e mudanças de tipo, constraints sem nome e alguns defaults podem passar batido. Sempre abra o arquivo gerado. E tire o <code>Base.metadata.create_all()</code> do startup da aplicação: quem cria tabela agora é o Alembic.</Callout>
      </Section>
      <Section id="conflicts" title={"Conflitos em equipe"}>
        <p>O conflito clássico: duas pessoas criam migrations ao mesmo tempo, em branches diferentes, a partir do mesmo ponto. Cada branch funciona sozinha; o problema aparece no merge.</p>
        <Diagram minWidth={620} caption={"Cada branch é válida sozinha. Juntas, duas migrations disputam o mesmo lugar na sequência."}>
          <svg viewBox="0 0 700 230" role="img" aria-label="Duas branches criam a mesma versão de migration">
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
            <text x="355" y="143" className="mut" textAnchor="middle">branch da Ana</text>
            <rect x="260" y="164" width="190" height="32" rx="4" className="ln" />
            <text x="355" y="185" className="mono" textAnchor="middle">V5__add_index.sql</text>
            <text x="355" y="213" className="mut" textAnchor="middle">branch do Bruno</text>
            <rect x="430" y="18" width="210" height="44" rx="4" className="brandfill" />
            <text x="535" y="37" textAnchor="middle">merge: dois V5 ✗</text>
            <text x="535" y="53" textAnchor="middle">(Alembic: duas heads)</text>
            <path d="M450 110C520 100 535 80 535 62" className="ln dash" />
            <path d="M450 180C560 170 560 90 545 62" className="ln dash" />
          </svg>
        </Diagram>
        <h3>Como cada ferramenta reage e como resolver</h3>
        <Table
          head={["Ferramenta", "Sintoma", "Resolução"]}
          rows={[
            ["Flyway", <>"Found more than one migration with version 5": o app não sobe. Ou, com números diferentes, uma versão menor chega depois de uma maior já aplicada e o <code>validate</code> acusa migration fora de ordem.</>, <>Quem fizer merge por último renumera a sua (V5 → V6) <em>antes</em> de ela chegar a qualquer ambiente compartilhado. Para reduzir colisões, use versões por timestamp: <code>V20261031_1412__add_phone.sql</code>.</>],
            ["Prisma", <>Os nomes não colidem (têm timestamp), mas uma migration pode ter sido gerada contra um esquema que não incluía a do colega; o <code>migrate dev</code> detecta drift.</>, <>Se a sua ainda não foi para ambiente compartilhado: apague a pasta dela, faça pull/rebase, rode <code>migrate dev</code> de novo para gerar uma migration em cima do esquema atualizado.</>],
            ["Alembic", <>"Multiple head revisions are present": as duas revisões têm o mesmo <code>down_revision</code>.</>, <><code>alembic merge heads -m "merge"</code> cria uma revisão que junta as duas; ou, se a sua não saiu da branch, edite o <code>down_revision</code> dela para apontar para a do colega.</>],
          ]}
        />
        <h3>Regras que evitam a maior parte dos conflitos</h3>
        <ul className="ds-list">
          <li><strong>Nunca edite uma migration que já saiu da sua máquina.</strong> Corrija com outra migration.</li>
          <li><strong>Uma mudança de esquema por migration</strong>, pequena e com nome descritivo. Migrations gigantes conflitam mais e são mais difíceis de revisar.</li>
          <li><strong>Rebase antes do merge</strong> e rode as migrations de novo localmente (de um banco limpo) para ver a sequência final.</li>
          <li><strong>O CI aplica todas as migrations num banco vazio</strong> a cada PR (e roda <code>flyway validate</code>, <code>prisma migrate status</code> ou <code>alembic check</code>). Se a sequência não monta do zero, o PR não entra.</li>
          <li><strong>Ninguém altera o banco compartilhado na mão.</strong> Um <code>ALTER</code> manual em staging é drift garantido no próximo deploy.</li>
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
      <Section id="prod" title={"Em produção"}>
        <h3>Quando rodar</h3>
        <p>Duas opções comuns: (a) a aplicação roda as migrations no startup (padrão do Spring Boot com Flyway), ou (b) um <strong>passo separado do deploy</strong> roda <code>migrate</code> antes de subir a versão nova (um job no pipeline, um init container no Kubernetes, uma task one-off no ECS).</p>
        <p>Com várias réplicas, (b) é mais previsível: uma execução só, logs separados, e se falhar o deploy para antes de trocar o código.</p>
        <h3>Mudanças sem downtime: expandir e contrair</h3>
        <p>Durante um deploy, a versão antiga e a nova do código rodam ao mesmo tempo contra o <em>mesmo</em> banco. Então toda migration precisa ser compatível com as duas. Renomear <code>name</code> para <code>full_name</code> num passo só quebra a versão antiga. O jeito seguro é dividir em etapas:</p>
        <Diagram minWidth={620} caption={"Uma mudança incompatível vira três mudanças compatíveis, cada uma segura de aplicar com o código antigo ainda no ar."}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Expandir, migrar, contrair">
            <rect x="10" y="20" width="210" height="90" rx="4" className="ln fillsoft" />
            <text x="115" y="44" textAnchor="middle">1. expandir</text>
            <text x="115" y="66" className="mono mut" textAnchor="middle">ADD COLUMN full_name</text>
            <text x="115" y="86" className="mut" textAnchor="middle">app escreve nas duas</text>
            <rect x="245" y="20" width="210" height="90" rx="4" className="brandfill" />
            <text x="350" y="44" textAnchor="middle">2. migrar dados</text>
            <text x="350" y="66" className="mono" textAnchor="middle">UPDATE ... (em lotes)</text>
            <text x="350" y="86" textAnchor="middle">app passa a ler a nova</text>
            <rect x="480" y="20" width="210" height="90" rx="4" className="ln fillsoft" />
            <text x="585" y="44" textAnchor="middle">3. contrair</text>
            <text x="585" y="66" className="mono mut" textAnchor="middle">DROP COLUMN name</text>
            <text x="585" y="86" className="mut" textAnchor="middle">nenhum código usa mais</text>
            <path d="M220 65L245 65" className="ln" />
            <path d="M238.2 61.7L245 65L238.2 68.3" className="ln" />
            <path d="M455 65L480 65" className="ln" />
            <path d="M473.2 61.7L480 65L473.2 68.3" className="ln" />
            <text x="10" y="145" className="mut" textAnchor="start">Cada etapa é uma migration e um deploy separados; entre elas, as duas versões do código convivem.</text>
          </svg>
        </Diagram>
        <Table
          head={["Ponto", "Prática"]}
          rows={[
            ["Coluna nova", <>crie como <code>NULL</code> (ou com <code>DEFAULT</code> constante); <code>NOT NULL</code> só depois de preencher as linhas existentes</>],
            ["Índice em tabela grande", <><code>CREATE INDEX CONCURRENTLY</code> não trava escrita, mas não roda dentro de transação: no Flyway, configure <code>executeInTransaction=false</code> para esse script; no Alembic, use <code>op.get_context().autocommit_block()</code></>],
            ["Locks longos", <>defina <code>SET lock_timeout = '5s'</code> no início: melhor a migration falhar do que travar a aplicação inteira esperando um lock</>],
            ["Transações", <>no Postgres, DDL é transacional: uma migration que falha volta inteira. No MySQL não: um erro no meio deixa a migration pela metade, e o Flyway exige <code>repair</code> depois de você limpar à mão</>],
            ["Dados em massa", <>backfill de milhões de linhas em lotes, num job à parte, não num único <code>UPDATE</code> dentro da migration</>],
            ["Backup", <>snapshot ou PITR ligado antes de migrations destrutivas (<code>DROP</code>, mudança de tipo)</>],
            ["Desfazer", <>prefira <em>roll forward</em> (migration nova). <code>down</code>/<code>downgrade</code> ajudam em dev, mas em produção um <code>DROP</code> de volta pode apagar dados escritos depois</>],
            ["Permissões", "o deploy usa o usuário de migration; a aplicação roda com um usuário sem DDL"],
          ]}
        />
        <Callout tone="warn" icon="alert">O comando que roda em produção é sempre o "só aplica": <code>flyway migrate</code>, <code>prisma migrate deploy</code>, <code>alembic upgrade head</code>. Nunca <code>prisma migrate dev</code>, <code>migrate reset</code>, <code>db push</code>, <code>flyway clean</code> ou <code>ddl-auto=update</code> contra um banco com dados reais. No Spring Boot, mantenha <code>spring.flyway.clean-disabled=true</code> (o padrão).</Callout>
      </Section>
      <Section id="lab" title={"Exercício: Flyway em 10 minutos"}>
        <p>Pré-requisito: só Docker. Você vai criar um banco vazio, aplicar duas migrations, quebrar o checksum de propósito e ver a ferramenta recusar. Os conceitos valem igual para Prisma e Alembic.</p>
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
        <p>Agora um delta, e depois a infração:</p>
        <CodeBlock code={`echo "ALTER TABLE users ADD COLUMN phone varchar(30);" > sql/V2__add_users_phone.sql
fw migrate    # applies only V2

# Edit an already-applied migration:
echo "-- just a comment" >> sql/V1__create_users.sql
fw validate   # ERROR: Migration checksum mismatch for migration version 1

docker exec pg-mig psql -U postgres -d app -c \\
  "SELECT version, description, checksum, success FROM flyway_schema_history;"`} />
        <p><strong>Resultado esperado:</strong> duas linhas no histórico e o <code>validate</code> falhando por checksum. Desfaça a edição (<code>git checkout</code> num projeto real) e o <code>validate</code> volta a passar. Esse erro é o que protege produção de alguém "consertar" uma migration antiga.</p>
        <CodeBlock code={`docker rm -f pg-mig && docker network rm mig   # cleanup`} />
      </Section>
      <Section id="cheat-mig" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Flyway", "Prisma", "Alembic"]}
          rows={[
            ["criar uma migration", <>novo arquivo <code>V&lt;n&gt;__nome.sql</code></>, <code>migrate dev --name x</code>, <code>revision --autogenerate -m x</code>],
            ["aplicar pendentes", <code>migrate</code>, <code>migrate deploy</code>, <code>upgrade head</code>],
            ["ver o estado", <code>info</code>, <code>migrate status</code>, <><code>current</code> / <code>history</code></>],
            ["banco existente (baseline)", <code>baseline</code>, <code>migrate resolve --applied</code>, <code>stamp</code>],
            ["checar no CI", <code>validate</code>, <code>migrate status</code>, <code>check</code>],
            ["resolver conflito", "renumerar a sua", "apagar a sua e regenerar", <code>merge heads</code>],
            ["desfazer", "migration nova", "migration nova", <><code>downgrade -1</code> (dev)</>],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <ul className="ds-list">
          <li>O que é drift e por que migrations o evitam?</li>
          <li>O que a primeira migration deve conter num projeto novo? E as seguintes?</li>
          <li>O que precisa existir no banco antes da primeira migration rodar?</li>
          <li>Como adotar migrations num banco que já está em produção?</li>
          <li>Por que editar uma migration já aplicada é um erro, e como o Flyway e o Prisma detectam isso?</li>
          <li>Duas branches criaram migrations ao mesmo tempo. O que acontece em cada ferramenta e como resolver?</li>
          <li>Por que renomear uma coluna exige expandir e contrair num sistema com deploy sem downtime?</li>
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
