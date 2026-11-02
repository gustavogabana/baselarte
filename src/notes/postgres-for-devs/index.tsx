import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "postgres-for-devs",
  title: { en: "Postgres for developers", pt: "Postgres para quem programa" },
  seo: {
    title: { en: "Postgres for developers, the 80/20", pt: "Postgres para quem programa, o 80/20" },
    description: { en: "Relational databases 80/20, Postgres-focused: schemas, database managers, connecting, roles and passwords (the classic mix-up), access security, CTEs and window functions, indexes, UUIDs, full-text search instead of LIKE, grants, backups (3-2-1) and caching, with a Docker lab.", pt: "Bancos relacionais 80/20, com foco em Postgres: schemas, gerenciadores de banco, como conectar, usuários e senhas (a confusão clássica), segurança de acesso, CTEs e window functions, índices, UUIDs, busca textual no lugar de LIKE, permissões, backups (3-2-1) e cache, com um laboratório em Docker." },
  },
  summary: "relational databases 80/20 focused on Postgres — schemas, connecting, roles and passwords, access security, CTEs and window functions, indexes, UUIDs, full-text search, grants, backups (3-2-1) and caching, with a Docker lab.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Postgres, <em>the 80/20 for developers.</em></>, pt: <>Postgres, <em>o 80/20 para quem programa.</em></> },
  heroLede: { en: "Relational databases from the ground up, Postgres-focused: schemas, connecting, roles and passwords, access security, indexes, CTEs, full-text search, backups and caching — with a Docker lab you can run today.", pt: "Bancos relacionais do zero, com foco em Postgres: schemas, como conectar, usuários e senhas, segurança de acesso, índices, CTEs, busca textual, backups e cache — com um laboratório em Docker para rodar hoje." },
  published: "2026-10-18",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "basics", title: <T pt="O que é um banco relacional e um schema" en="What a relational database and a schema are" /> },
        { id: "connecting", title: <T pt="Como conectar" en="How to connect" /> },
        { id: "users", title: <T pt="Usuários e senhas: as três camadas" en="Users and passwords: the three layers" /> },
        { id: "access-security", title: <T pt="Segurança de acesso: pg_hba, TLS e privilégio mínimo" en="Access security: pg_hba, TLS and least privilege" /> },
        { id: "commands", title: <T pt="Comandos do dia a dia" en="Everyday commands" /> },
        { id: "cte-window", title: <T pt={"CTEs e window functions (o \"pivô\")"} en={"CTEs and window functions (the \"pivot\")"} /> },
        { id: "indexes", title: <T pt="Index: ler sem escanear tudo" en="Indexes: reading without scanning everything" /> },
        { id: "uuid", title: <T pt="UUID ou serial?" en="UUID or serial?" /> },
        { id: "fulltext", title: <T pt="Full-text search no lugar de LIKE" en="Full-text search instead of LIKE" /> },
        { id: "access-grants", title: <T pt="Quem tem acesso ao quê" en="Who has access to what" /> },
        { id: "backups", title: <T pt="Backups e a regra 3-2-1" en="Backups and the 3-2-1 rule" /> },
        { id: "caching", title: <T pt="Cache: o 80/20 para quem programa" en="Caching: the 80/20 for developers" /> },
        { id: "docker-lab", title: <T pt="Laboratório com Docker" en="Lab with Docker" /> },
        { id: "cheat-pg", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="basics" title={<T pt="O que é um banco relacional e um schema" en="What a relational database and a schema are" />}>
        <p><T pt={<>Um banco <em>relacional</em> guarda dados em tabelas: linhas (registros) e colunas (campos), com <em>relações</em> entre tabelas por chaves. É "relacional" no sentido matemático de relação (um conjunto de tuplas), não porque as tabelas se relacionam entre si — embora também façam isso. O gerenciador que guarda, organiza e responde consultas sobre esses dados é um <em>SGBD</em> (sistema de gerenciamento de banco de dados; em inglês, <em>RDBMS</em>).</>} en={<>A <em>relational</em> database stores data in tables: rows (records) and columns (fields), with <em>relations</em> between tables through keys. It is "relational" in the mathematical sense of a relation (a set of tuples), not because tables relate to one another — though they also do that. The manager that stores, organizes and answers queries over that data is a <em>DBMS</em> (database management system).</>} /></p>
        <Diagram minWidth={680} caption={<T pt={"A hierarquia: instância → database → schema → tabela. Confundir \"database\" com \"schema\" é a troca mais comum."} en={"The hierarchy: instance → database → schema → table. Confusing \"database\" with \"schema\" is the most common mix-up."} />}>
          <svg viewBox="0 0 720 300" role="img" aria-label="Hierarquia do Postgres / Postgres hierarchy">
            <rect x="10" y="10" width="700" height="210" rx="4" className="ln dash" />
            <text x="24" y="32" className="pt mut" textAnchor="start">instância = servidor Postgres (um processo: postgres)</text>
            <text x="24" y="32" className="en mut" textAnchor="start">instance = Postgres server (one process: postgres)</text>
            <rect x="40" y="56" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="125" y="79" className="mono" textAnchor="middle">database "loja"</text>
            <rect x="40" y="106" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="125" y="129" className="mono" textAnchor="middle">database "crm"</text>
            <rect x="40" y="156" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="125" y="179" className="mono" textAnchor="middle">database "postgres"</text>
            <rect x="290" y="56" width="150" height="36" rx="4" className="ln fillsoft" />
            <text x="365" y="79" className="mono" textAnchor="middle">schema public</text>
            <rect x="290" y="106" width="150" height="36" rx="4" className="ln fillsoft" />
            <text x="365" y="129" className="mono" textAnchor="middle">schema vendas</text>
            <rect x="520" y="40" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="605" y="63" className="pt mono" textAnchor="middle">tabela usuarios</text>
            <text x="605" y="63" className="en mono" textAnchor="middle">table usuarios</text>
            <rect x="520" y="92" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="605" y="115" className="pt mono" textAnchor="middle">tabela pedidos</text>
            <text x="605" y="115" className="en mono" textAnchor="middle">table pedidos</text>
            <path d="M210 74L290 74" className="ln" />
            <path d="M283.2 70.7L290 74L283.2 77.3" className="ln" />
            <path d="M210 74L290 124" className="ln" />
            <path d="M286.0 117.7L290 124L282.5 123.2" className="ln" />
            <path d="M440 74L520 58" className="ln" />
            <path d="M512.7 56.1L520 58L514.0 62.5" className="ln" />
            <path d="M440 74L520 110" className="ln" />
            <path d="M515.2 104.3L520 110L512.5 110.2" className="ln" />
            <text x="10" y="244" className="pt mut" textAnchor="start">Uma instância roda vários DATABASES isolados; um database tem vários SCHEMAS</text>
            <text x="10" y="244" className="en mut" textAnchor="start">One instance runs several isolated DATABASES; a database has several SCHEMAS</text>
            <text x="10" y="264" className="pt mut" textAnchor="start">(pastas lógicas); um schema tem as TABELAS.</text>
            <text x="10" y="264" className="en mut" textAnchor="start">(logical folders); a schema has the TABLES.</text>
            <text x="10" y="284" className="pt mut" textAnchor="start">Por padrão você está no schema "public" — por isso o SQL quase nunca o nomeia.</text>
            <text x="10" y="284" className="en mut" textAnchor="start">By default you are in the "public" schema — that is why SQL rarely names it.</text>
          </svg>
        </Diagram>
        <h3><T pt="O que é um schema, de fato" en="What a schema actually is" /></h3>
        <p><T pt={<>Um <em>schema</em> é um namespace dentro de um database: uma forma de organizar tabelas (por exemplo, <code>vendas.pedidos</code> e <code>rh.funcionarios</code> no mesmo database) sem precisar de um database separado para cada área. É diferente do uso da palavra "schema" em outros bancos (no MySQL, "schema" costuma ser sinônimo de "database" inteiro).</>} en={<>A <em>schema</em> is a namespace inside a database: a way to organize tables (for example, <code>vendas.pedidos</code> and <code>rh.funcionarios</code> in the same database) without needing a separate database for each area. This differs from how the word "schema" is used in other databases (in MySQL, "schema" is usually a synonym for a whole "database").</>} /></p>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">SCHEMA</span>{" vendas;\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">TABLE</span>{" vendas.pedidos (id bigint, total numeric("}<span className="tok-n">10</span>{","}<span className="tok-n">2</span>{"));\n"}
          {"\n"}
          <span className="tok-k">SET</span>{" search_path "}<span className="tok-k">TO</span>{" vendas, public;   "}<span className="tok-c">-- define a ordem de busca; agora "pedidos" sozinho já encontra vendas.pedidos</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos;               "}<span className="tok-c">-- funciona sem o prefixo "vendas."</span>
        </CodeBlock>
        <h3><T pt="Gerenciadores de banco: as opções mais comuns" en="Database managers: the common options" /></h3>
        <Table
          head={[<T pt="SGBD" en="DBMS" />, <T pt="Tipo" en="Type" />, <T pt="Quando escolher" en="When to choose" />]}
          rows={[
            [<strong>PostgreSQL</strong>, <T pt="relacional, objeto-relacional" en="relational, object-relational" />, <T pt="o padrão para a maioria dos projetos novos: tipos avançados (JSON, arrays, UUID), extensível, forte em correção e concorrência" en="the default for most new projects: advanced types (JSON, arrays, UUID), extensible, strong on correctness and concurrency" />],
            [<strong>MySQL / MariaDB</strong>, <T pt="relacional" en="relational" />, <T pt="onipresente em hospedagem compartilhada e WordPress; engines de storage plugáveis (InnoDB)" en="ubiquitous in shared hosting and WordPress; pluggable storage engines (InnoDB)" />],
            [<strong>SQLite</strong>, <T pt="relacional, embutido (sem servidor)" en="relational, embedded (serverless)" />, <T pt="um arquivo só, zero configuração: apps mobile/desktop, testes, protótipos" en="a single file, zero config: mobile/desktop apps, tests, prototypes" />],
            [<strong>SQL Server</strong>, <T pt="relacional" en="relational" />, <T pt="ecossistema Microsoft/.NET" en="Microsoft/.NET ecosystem" />],
            [<strong>Oracle Database</strong>, <T pt="relacional" en="relational" />, <T pt="grandes empresas com contratos legados" en="large enterprises with legacy contracts" />],
            [<T pt="Gerenciados (RDS, Cloud SQL, Neon, Supabase)" en="Managed (RDS, Cloud SQL, Neon, Supabase)" />, <T pt="o mesmo Postgres/MySQL, hospedado" en="the same Postgres/MySQL, hosted" />, <T pt="backups, patches e failover geridos pelo provedor (veja a nota de AWS, seção RDS)" en="backups, patches and failover managed by the provider (see the AWS note, RDS section)" />],
          ]}
        />
        <p><T pt="Esta nota usa Postgres porque é hoje a escolha padrão para projetos novos: licença permissiva, extensões (PostGIS, pg_trgm, pgvector), tipos de dado ricos e um dos motores de consulta mais corretos que existem." en="This note uses Postgres because it is today's default choice for new projects: a permissive license, extensions (PostGIS, pg_trgm, pgvector), rich data types, and one of the most correct query engines around." /></p>
        <h3><T pt="Ferramentas para abrir um banco" en="Tools to open a database" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Tipo" en="Type" />]}
          rows={[
            [<code>psql</code>, <T pt="o cliente de linha de comando oficial, sempre disponível" en="the official command-line client, always available" />],
            ["pgAdmin", <T pt="painel web oficial do projeto Postgres" en="the Postgres project's own web panel" />],
            ["DBeaver / TablePlus / DataGrip", <T pt="clientes gráficos multiplataforma, funcionam com vários SGBDs" en="cross-platform graphical clients, work with several DBMSs" />],
            ["VS Code (extensão SQLTools/PostgreSQL)", <T pt="abrir e consultar sem sair do editor" en="opening and querying without leaving the editor" />],
          ]}
        />
      </Section>
      <Section id="connecting" title={<T pt="Como conectar" en="How to connect" />}>
        <p><T pt={<>Conectar ao Postgres sempre passa pelos mesmos seis dados: quem você é, com qual senha, em qual máquina, em qual porta, e em qual database. Toda ferramenta — <code>psql</code>, uma lib de app, um painel gráfico — pede exatamente isso, às vezes como uma <em>connection string</em> só.</>} en={<>Connecting to Postgres always goes through the same six pieces of data: who you are, with which password, on which machine, on which port, and which database. Every tool — <code>psql</code>, an app library, a graphical panel — asks for exactly that, sometimes as a single <em>connection string</em>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt={<>A anatomia de uma connection string. <code>DATABASE_URL=postgresql://ana:s3nha@db.exemplo.com:5432/loja?sslmode=require</code></>} en={<>The anatomy of a connection string. <code>DATABASE_URL=postgresql://ana:s3nha@db.exemplo.com:5432/loja?sslmode=require</code></>} />}>
          <svg viewBox="0 0 640 100" role="img" aria-label="Anatomia da connection string / Connection string anatomy">
            <rect x="10" y="20" width="96" height="40" rx="4" className="ln fillsoft" />
            <text x="58.0" y="45" className="mono" textAnchor="middle">postgresql://</text>
            <text x="58.0" y="80" className="pt mut" textAnchor="middle">esquema</text>
            <text x="58.0" y="80" className="en mut" textAnchor="middle">scheme</text>
            <rect x="110" y="20" width="46" height="40" rx="4" className="ln fillsoft" />
            <text x="133.0" y="45" className="mono" textAnchor="middle">ana</text>
            <text x="133.0" y="80" className="pt mut" textAnchor="middle">usuário</text>
            <text x="133.0" y="80" className="en mut" textAnchor="middle">user</text>
            <rect x="160" y="20" width="58" height="40" rx="4" className="ln fillsoft" />
            <text x="189.0" y="45" className="mono" textAnchor="middle">:s3nha@</text>
            <text x="189.0" y="80" className="pt mut" textAnchor="middle">senha</text>
            <text x="189.0" y="80" className="en mut" textAnchor="middle">password</text>
            <rect x="222" y="20" width="150" height="40" rx="4" className="ln fillsoft" />
            <text x="297.0" y="45" className="mono" textAnchor="middle">db.exemplo.com</text>
            <text x="297.0" y="80" className="mut" textAnchor="middle">host</text>
            <rect x="376" y="20" width="50" height="40" rx="4" className="ln fillsoft" />
            <text x="401.0" y="45" className="mono" textAnchor="middle">:5432</text>
            <text x="401.0" y="80" className="pt mut" textAnchor="middle">porta</text>
            <text x="401.0" y="80" className="en mut" textAnchor="middle">port</text>
            <rect x="430" y="20" width="50" height="40" rx="4" className="ln fillsoft" />
            <text x="455.0" y="45" className="mono" textAnchor="middle">/loja</text>
            <text x="455.0" y="80" className="mut" textAnchor="middle">database</text>
            <rect x="484" y="20" width="148" height="40" rx="4" className="ln fillsoft" />
            <text x="558.0" y="45" className="mono" textAnchor="middle">?sslmode=require</text>
            <text x="558.0" y="80" className="pt mut" textAnchor="middle">parâmetros</text>
            <text x="558.0" y="80" className="en mut" textAnchor="middle">parameters</text>
          </svg>
        </Diagram>
        <h3><T pt="Pelo psql" en="Through psql" /></h3>
        <CodeBlock>
          {"psql -h db.exemplo.com -p 5432 -U ana -d loja        "}<span className="tok-c"># pede a senha interativamente</span>{"\n"}
          {"psql "}<span className="tok-s">"postgresql://ana:s3nha@db.exemplo.com:5432/loja"</span>{"   "}<span className="tok-c"># tudo numa string só</span>{"\n"}
          {"psql -U postgres                                     "}<span className="tok-c"># local, usuário "postgres", pede/usa auth local</span>{"\n"}
          {"PGPASSWORD=s3nha psql -h localhost -U ana loja        "}<span className="tok-c"># senha por variável (cuidado: aparece em `ps`!)</span>
        </CodeBlock>
        <p><T pt={<>Dentro do <code>psql</code>, estes comandos resolvem 80% do dia a dia:</>} en={<>Inside <code>psql</code>, these commands cover 80% of daily use:</>} /></p>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="Faz" en="Does" />]}
          rows={[
            [<code>\l</code>, <T pt="lista os databases" en="lists the databases" />],
            [<code>\c loja</code>, <T pt="troca de database" en="switches database" />],
            [<code>\dn</code>, <T pt="lista os schemas" en="lists the schemas" />],
            [<><code>\dt</code> · <code>\dt vendas.*</code></>, <T pt="lista tabelas (de um schema)" en="lists tables (of a schema)" />],
            [<code>\d pedidos</code>, <T pt="descreve uma tabela: colunas, tipos, índices, chaves estrangeiras" en="describes a table: columns, types, indexes, foreign keys" />],
            [<code>\du</code>, <T pt="lista roles (usuários)" en="lists roles (users)" />],
            [<code>\x</code>, <T pt={"alterna exibição \"expandida\" (uma coluna por linha, ótimo para tabelas largas)"} en={"toggles \"expanded\" display (one column per line, great for wide tables)"} />],
            [<code>\timing</code>, <T pt="mostra quanto tempo cada consulta leva" en="shows how long each query takes" />],
            [<code>\q</code>, <T pt="sai" en="quits" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Localmente, muita gente nem digita usuário/senha: o Postgres usa o método <code>peer</code> por padrão em conexões locais (via socket Unix), que confia no seu usuário <em>do sistema operacional</em>. Isso é exatamente o que a próxima seção desembaraça.</>} en={<>Locally, a lot of people never type a user/password at all: Postgres uses the <code>peer</code> method by default on local connections (via Unix socket), trusting your <em>operating-system</em> user. That is exactly what the next section untangles.</>} /></Callout>
      </Section>
      <Section id="users" title={<T pt="Usuários e senhas: as três camadas" en="Users and passwords: the three layers" />}>
        <p><T pt={<>Esta é a maior fonte de confusão para quem está começando, porque a palavra "usuário" significa <em>três coisas diferentes</em> que não têm relação automática entre si. Desembaraçar isso resolve a maioria dos "funciona na minha máquina, não funciona no servidor".</>} en={<>This is the biggest source of confusion for beginners, because the word "user" means <em>three different things</em> with no automatic relation between them. Untangling this solves most "works on my machine, not on the server" problems.</>} /></p>
        <Diagram minWidth={680} caption={<T pt={"As três camadas de \"usuário\" que costumam ser confundidas."} en={"The three layers of \"user\" that usually get mixed up."} />}>
          <svg viewBox="0 0 720 205" role="img" aria-label="Três tipos de usuário / Three kinds of user">
            <rect x="10" y="10" width="220" height="54" rx="4" className="ln fillsoft" />
            <text x="120" y="34" className="pt" textAnchor="middle">usuário do SO</text>
            <text x="120" y="34" className="en" textAnchor="middle">OS user</text>
            <text x="120" y="52" className="pt mut mono" textAnchor="middle">ex.: "gustavo"</text>
            <text x="120" y="52" className="en mut mono" textAnchor="middle">e.g. "gustavo"</text>
            <text x="18" y="90" className="pt" textAnchor="start">• login na MÁQUINA</text>
            <text x="18" y="90" className="en" textAnchor="start">• logs into the MACHINE</text>
            <text x="18" y="110" className="pt" textAnchor="start">• vive em /etc/passwd</text>
            <text x="18" y="110" className="en" textAnchor="start">• lives in /etc/passwd</text>
            <rect x="250" y="10" width="220" height="54" rx="4" className="ln" />
            <text x="360" y="34" className="pt" textAnchor="middle">role do Postgres</text>
            <text x="360" y="34" className="en" textAnchor="middle">Postgres role</text>
            <text x="360" y="52" className="pt mut mono" textAnchor="middle">ex.: "ana"</text>
            <text x="360" y="52" className="en mut mono" textAnchor="middle">e.g. "ana"</text>
            <text x="258" y="90" className="pt" textAnchor="start">• login no BANCO</text>
            <text x="258" y="90" className="en" textAnchor="start">• logs into the DATABASE</text>
            <text x="258" y="110" className="pt" textAnchor="start">• vive em pg_roles</text>
            <text x="258" y="110" className="en" textAnchor="start">• lives in pg_roles</text>
            <text x="258" y="130" className="pt" textAnchor="start">• senha e permissões PRÓPRIAS</text>
            <text x="258" y="130" className="en" textAnchor="start">• OWN password and permissions</text>
            <rect x="490" y="10" width="220" height="54" rx="4" className="ln fillsoft" />
            <text x="600" y="34" className="pt" textAnchor="middle">usuário da aplicação</text>
            <text x="600" y="34" className="en" textAnchor="middle">application user</text>
            <text x="600" y="52" className="pt mut mono" textAnchor="middle">ex.: conta do cliente</text>
            <text x="600" y="52" className="en mut mono" textAnchor="middle">e.g. customer's account</text>
            <text x="498" y="90" className="pt" textAnchor="start">• é uma LINHA em "usuarios"</text>
            <text x="498" y="90" className="en" textAnchor="start">• is a ROW in "usuarios"</text>
            <text x="498" y="110" className="pt" textAnchor="start">• só a aplicação a entende</text>
            <text x="498" y="110" className="en" textAnchor="start">• only the app understands it</text>
            <text x="498" y="130" className="pt" textAnchor="start">• o Postgres nem sabe dela</text>
            <text x="498" y="130" className="en" textAnchor="start">• Postgres doesn't know it</text>
            <text x="10" y="170" className="pt mut" textAnchor="start">Os três são independentes: a role "ana" não precisa existir como usuário do SO,</text>
            <text x="10" y="170" className="en mut" textAnchor="start">All three are independent: the role "ana" need not exist as an OS user,</text>
            <text x="10" y="190" className="pt mut" textAnchor="start">e o Postgres nunca vê os usuários da sua aplicação.</text>
            <text x="10" y="190" className="en mut" textAnchor="start">and Postgres never sees your application's users.</text>
          </svg>
        </Diagram>
        <h3><T pt="Como as camadas se conectam na prática" en="How the layers connect in practice" /></h3>
        <Table
          head={[<T pt="Cenário" en="Scenario" />, <T pt="O que acontece" en="What happens" />]}
          rows={[
            [<T pt={<>Você digita <code>psql</code> sem argumentos</>} en={<>You type <code>psql</code> with no arguments</>} />, <T pt="tenta conectar como uma role do Postgres com o MESMO NOME do seu usuário do SO, no database de mesmo nome — coincidência de nome, não de identidade" en="tries to connect as a Postgres role with the SAME NAME as your OS user, to a database of the same name — a name coincidence, not an identity one" />],
            [<T pt={"Instalação padrão cria o usuário do SO \"postgres\" e a role \"postgres\""} en={"A default install creates the OS user \"postgres\" and the role \"postgres\""} />, <T pt={<><code>sudo -u postgres psql</code> funciona porque o SO deixa o usuário "postgres" rodar o psql, que conecta à role "postgres" (super-usuária DO BANCO, não do SO)</>} en={<><code>sudo -u postgres psql</code> works because the OS lets the "postgres" OS user run psql, which connects as the "postgres" role (a DATABASE superuser, not an OS one)</>} />],
            [<T pt={<>Sua aplicação conecta com <code>DATABASE_URL</code></>} en={<>Your app connects with <code>DATABASE_URL</code></>} />, <T pt={<>usa uma role do Postgres (ex.: <code>app_user</code>) e SUA senha; não tem nenhuma relação com o usuário do SO onde o app roda</>} en={<>uses a Postgres role (e.g. <code>app_user</code>) with ITS password; has no relation to the OS user the app runs as</>} />],
            [<T pt="Um cliente faz login no seu site" en="A customer logs into your site" />, <T pt="sua aplicação confere a senha na SUA tabela de usuários; o Postgres só vê a role da aplicação executando a consulta" en="your application checks the password against YOUR users table; Postgres only sees the application's role running the query" />],
          ]}
        />
        <h3><T pt="Exercício: criar uma role, um database e testar" en="Exercise: create a role, a database, and test it" /></h3>
        <CodeBlock>
          {"sudo -u postgres psql    "}<span className="tok-c"># entra como a role "postgres" (super-usuária do banco)</span>
        </CodeBlock>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">ROLE</span>{" ana "}<span className="tok-k">LOGIN</span>{" "}<span className="tok-k">PASSWORD</span>{" "}<span className="tok-s">'s3nha-forte-de-verdade'</span>{";\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">DATABASE</span>{" loja "}<span className="tok-k">OWNER</span>{" ana;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">ALL</span>{" PRIVILEGES "}<span className="tok-k">ON</span>{" "}<span className="tok-k">DATABASE</span>{" loja "}<span className="tok-k">TO</span>{" ana;\n"}
          {"\\q"}
        </CodeBlock>
        <CodeBlock>
          {"psql -h localhost -U ana -d loja     "}<span className="tok-c"># agora conecte como ANA, não como postgres</span>{"\n"}
          <span className="tok-c"># Password for user ana: ****</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o segundo <code>psql</code> pede senha (porque agora você está entrando como a <em>role</em> <code>ana</code>, via rede/senha, não por confiança do sistema operacional) e o prompt muda para <code>loja=&gt;</code>. Se <code>ana</code> tentar <code>CREATE DATABASE</code> sem <code>CREATEDB</code>, recebe um erro de permissão — ela só é dona do banco <code>loja</code>, não super-usuária.</>} en={<><strong>Expected result:</strong> the second <code>psql</code> asks for a password (because you are now logging in as the <em>role</em> <code>ana</code>, over the network/password, not by operating-system trust) and the prompt changes to <code>loja=&gt;</code>. If <code>ana</code> tries <code>CREATE DATABASE</code> without <code>CREATEDB</code>, she gets a permission error — she only owns the <code>loja</code> database, she is not a superuser.</>} /></p>
        <h3><T pt="Atributos de role mais usados" en="Most-used role attributes" /></h3>
        <Table
          head={[<T pt="Atributo" en="Attribute" />, <T pt="Significa" en="Means" />]}
          rows={[
            [<code>LOGIN</code>, <T pt="pode se conectar (sem isso, a role só serve para agrupar permissões)" en="can connect (without it, the role only groups permissions)" />],
            [<code>SUPERUSER</code>, <T pt="ignora toda checagem de permissão — use só para administração, nunca para apps" en="skips every permission check — use only for administration, never for apps" />],
            [<code>CREATEDB</code>, <T pt="pode criar databases" en="can create databases" />],
            [<code>PASSWORD</code>, <T pt="define a senha (hash scram-sha-256 por padrão desde o Postgres 14)" en="sets the password (scram-sha-256 hash by default since Postgres 14)" />],
            [<code>VALID UNTIL</code>, <T pt="data de expiração da senha" en="the password's expiry date" />],
            [<code>IN ROLE outra_role</code>, <T pt={<>herda as permissões de outra role (ótimo para grupos como <code>app_readonly</code>)</>} en={<>inherits another role's permissions (great for groups like <code>app_readonly</code>)</>} />],
          ]}
        />
      </Section>
      <Section id="access-security" title={<T pt="Segurança de acesso: pg_hba, TLS e privilégio mínimo" en="Access security: pg_hba, TLS and least privilege" />}>
        <p><T pt={<>Quem pode se conectar, de onde, e como ela precisa provar quem é — tudo isso é decidido por um arquivo: <code>pg_hba.conf</code> (host-based authentication). É o "firewall de identidade" do Postgres, separado do firewall de rede (nftables/ufw) e separado das permissões SQL (<code>GRANT</code>).</>} en={<>Who may connect, from where, and how they must prove who they are — all of that is decided by one file: <code>pg_hba.conf</code> (host-based authentication). It is Postgres's "identity firewall", separate from the network firewall (nftables/ufw) and separate from SQL permissions (<code>GRANT</code>).</>} /></p>
        <Diagram minWidth={600} caption={<T pt="A conexão só acontece se passar pelos três." en="The connection only happens if it passes all three." />}>
          <svg viewBox="0 0 670 130" role="img" aria-label="Os três portões / The three gates">
            <rect x="10" y="10" width="140" height="56" rx="4" className="ln fillsoft" />
            <text x="80" y="43" className="pt" textAnchor="middle">cliente</text>
            <text x="80" y="43" className="en" textAnchor="middle">client</text>
            <rect x="180" y="10" width="140" height="56" rx="4" className="ln" />
            <text x="250" y="34" className="" textAnchor="middle">firewall</text>
            <text x="250" y="53" className="pt mut mono" textAnchor="middle">porta aberta?</text>
            <text x="250" y="53" className="en mut mono" textAnchor="middle">port open?</text>
            <rect x="350" y="10" width="140" height="56" rx="4" className="ln fillsoft" />
            <text x="420" y="34" className="" textAnchor="middle">pg_hba.conf</text>
            <text x="420" y="53" className="pt mut mono" textAnchor="middle">pode entrar?</text>
            <text x="420" y="53" className="en mut mono" textAnchor="middle">may enter?</text>
            <rect x="520" y="10" width="140" height="56" rx="4" className="ln" />
            <text x="590" y="34" className="" textAnchor="middle">GRANT</text>
            <text x="590" y="53" className="pt mut mono" textAnchor="middle">pode fazer o quê?</text>
            <text x="590" y="53" className="en mut mono" textAnchor="middle">may do what?</text>
            <path d="M150 38L180 38" className="ln" />
            <path d="M173.2 34.7L180 38L173.2 41.3" className="ln" />
            <path d="M320 38L350 38" className="ln" />
            <path d="M343.2 34.7L350 38L343.2 41.3" className="ln" />
            <path d="M490 38L520 38" className="ln" />
            <path d="M513.2 34.7L520 38L513.2 41.3" className="ln" />
            <text x="10" y="96" className="pt mut" textAnchor="start">Três portões independentes: rede, identidade (quem pode entrar)</text>
            <text x="10" y="96" className="en mut" textAnchor="start">Three independent gates: network, identity (who may enter)</text>
            <text x="10" y="114" className="pt mut" textAnchor="start">e permissão (o que pode fazer depois de dentro).</text>
            <text x="10" y="114" className="en mut" textAnchor="start">and permission (what it may do once inside).</text>
          </svg>
        </Diagram>
        <h3><T pt="Lendo o pg_hba.conf" en="Reading pg_hba.conf" /></h3>
        <CodeBlock code={`# TYPE  DATABASE  USER   ADDRESS          METHOD
local   all       postgres                         peer
local   all       all                               scram-sha-256
host    loja      ana     127.0.0.1/32              scram-sha-256
host    loja      app     10.0.0.0/8                scram-sha-256
hostssl all       all     0.0.0.0/0                 scram-sha-256
host    all       all     0.0.0.0/0                 reject`} />
        <Table
          head={[<T pt="Coluna" en="Column" />, <T pt="Significa" en="Means" />]}
          rows={[
            ["TYPE", <T pt={<><code>local</code> = socket Unix (mesma máquina); <code>host</code> = TCP (com ou sem TLS); <code>hostssl</code> = TCP, exige TLS</>} en={<><code>local</code> = Unix socket (same machine); <code>host</code> = TCP (with or without TLS); <code>hostssl</code> = TCP, requires TLS</>} />],
            ["METHOD", <T pt={<><code>peer</code>/<code>ident</code> = confia no usuário do SO; <code>scram-sha-256</code> = senha (o padrão recomendado); <code>trust</code> = sem senha nenhuma; <code>reject</code> = nega</>} en={<><code>peer</code>/<code>ident</code> = trusts the OS user; <code>scram-sha-256</code> = password (the recommended default); <code>trust</code> = no password at all; <code>reject</code> = deny</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Regras são lidas de cima para baixo e a <em>primeira</em> que combinar vence. <code>trust</code> (sem senha) só faz sentido para <code>local</code>, numa máquina de estudo só sua — nunca em algo acessível pela rede. Depois de editar: <code>sudo systemctl reload postgresql</code> (recarrega sem derrubar conexões).</>} en={<>Rules are read top to bottom and the <em>first</em> match wins. <code>trust</code> (no password) only makes sense for <code>local</code>, on a study machine that is only yours — never on anything network-reachable. After editing: <code>sudo systemctl reload postgresql</code> (reloads without dropping connections).</>} /></Callout>
        <h3><T pt={"TLS e o que \"sslmode\" realmente garante"} en={"TLS and what \"sslmode\" actually guarantees"} /></h3>
        <Table
          head={[<T pt={<><code>sslmode</code></>} en={<><code>sslmode</code></>} />, <T pt="Garante" en="Guarantees" />]}
          rows={[
            [<code>disable</code>, <T pt={<>nada: conexão em texto puro — ok só em <code>localhost</code></>} en={<>nothing: plain-text connection — fine only on <code>localhost</code></>} />],
            [<code>require</code>, <T pt="cifra o tráfego, mas NÃO confere a identidade do servidor (vulnerável a um impostor na rede)" en="encrypts traffic, but does NOT verify the server's identity (open to a network impostor)" />],
            [<code>verify-full</code>, <T pt={"cifra e confere o certificado do servidor contra uma CA confiável — o equivalente real de \"HTTPS seguro\""} en={"encrypts and verifies the server's certificate against a trusted CA — the real equivalent of \"secure HTTPS\""} />],
          ]}
        />
        <h3><T pt="Privilégio mínimo" en="Least privilege" /></h3>
        <p><T pt="A aplicação nunca deveria conectar como super-usuária. O padrão sensato: uma role por aplicação, com só as permissões que ela usa." en="The application should never connect as a superuser. The sensible default: one role per application, with only the permissions it uses." /></p>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">ROLE</span>{" app_readonly NOLOGIN;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">CONNECT</span>{" "}<span className="tok-k">ON</span>{" "}<span className="tok-k">DATABASE</span>{" loja "}<span className="tok-k">TO</span>{" app_readonly;\n"}
          <span className="tok-k">GRANT</span>{" USAGE "}<span className="tok-k">ON</span>{" "}<span className="tok-k">SCHEMA</span>{" public "}<span className="tok-k">TO</span>{" app_readonly;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">SELECT</span>{" "}<span className="tok-k">ON</span>{" "}<span className="tok-k">ALL</span>{" TABLES "}<span className="tok-k">IN</span>{" "}<span className="tok-k">SCHEMA</span>{" public "}<span className="tok-k">TO</span>{" app_readonly;\n"}
          <span className="tok-k">ALTER</span>{" "}<span className="tok-k">DEFAULT</span>{" PRIVILEGES "}<span className="tok-k">IN</span>{" "}<span className="tok-k">SCHEMA</span>{" public "}<span className="tok-k">GRANT</span>{" "}<span className="tok-k">SELECT</span>{" "}<span className="tok-k">ON</span>{" TABLES "}<span className="tok-k">TO</span>{" app_readonly;  "}<span className="tok-c">-- vale para tabelas FUTURAS também</span>{"\n"}
          {"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">ROLE</span>{" app_web "}<span className="tok-k">LOGIN</span>{" "}<span className="tok-k">PASSWORD</span>{" "}<span className="tok-s">'outra-senha-forte'</span>{" "}<span className="tok-k">IN</span>{" "}<span className="tok-k">ROLE</span>{" app_readonly;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">INSERT</span>{", "}<span className="tok-k">UPDATE</span>{", "}<span className="tok-k">DELETE</span>{" "}<span className="tok-k">ON</span>{" pedidos, itens_pedido "}<span className="tok-k">TO</span>{" app_web;   "}<span className="tok-c">-- só nessas tabelas</span>
        </CodeBlock>
        <h3><T pt="Pooling de conexões" en="Connection pooling" /></h3>
        <p><T pt={<>Cada conexão Postgres custa memória (um processo por conexão). Para apps com muitas conexões curtas (serverless, muitas réplicas), um <em>pooler</em> como <code>PgBouncer</code> ou <code>Supavisor</code> fica entre a aplicação e o Postgres, reaproveitando um número menor de conexões reais — o lado de segurança é que o pooler também costuma ser o lugar certo para autenticar e limitar por aplicação.</>} en={<>Every Postgres connection costs memory (one process per connection). For apps with many short-lived connections (serverless, many replicas), a <em>pooler</em> like <code>PgBouncer</code> or <code>Supavisor</code> sits between the application and Postgres, reusing a smaller number of real connections — the security angle is that the pooler is also usually the right place to authenticate and limit per application.</>} /></p>
      </Section>
      <Section id="commands" title={<T pt="Comandos do dia a dia" en="Everyday commands" />}>
        <p><T pt="Um resumo do SQL que cobre a maior parte do trabalho de um desenvolvedor: criar estrutura (DDL) e ler/escrever dados (DML)." en="A summary of the SQL that covers most of a developer's work: creating structure (DDL) and reading/writing data (DML)." /></p>
        <h3><T pt="DDL: estrutura" en="DDL: structure" /></h3>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">TABLE</span>{" pedidos (\n"}
          {"  id          bigint "}<span className="tok-k">GENERATED</span>{" "}<span className="tok-k">ALWAYS</span>{" "}<span className="tok-k">AS</span>{" "}<span className="tok-k">IDENTITY</span>{" "}<span className="tok-k">PRIMARY</span>{" "}<span className="tok-k">KEY</span>{",\n"}
          {"  cliente_id  bigint "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{" "}<span className="tok-k">REFERENCES</span>{" clientes(id),\n"}
          {"  total       numeric("}<span className="tok-n">10</span>{","}<span className="tok-n">2</span>{") "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{" "}<span className="tok-k">DEFAULT</span>{" "}<span className="tok-n">0</span>{",\n"}
          {"  status      text "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{" "}<span className="tok-k">DEFAULT</span>{" "}<span className="tok-s">'pendente'</span>{",\n"}
          {"  criado_em   timestamptz "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{" "}<span className="tok-k">DEFAULT</span>{" now()\n"}
          {");\n"}
          {"\n"}
          <span className="tok-k">ALTER</span>{" "}<span className="tok-k">TABLE</span>{" pedidos ADD COLUMN observacao text;\n"}
          <span className="tok-k">ALTER</span>{" "}<span className="tok-k">TABLE</span>{" pedidos "}<span className="tok-k">ALTER</span>{" COLUMN total "}<span className="tok-k">SET</span>{" "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{";\n"}
          <span className="tok-k">DROP</span>{" "}<span className="tok-k">TABLE</span>{" "}<span className="tok-k">IF</span>{" "}<span className="tok-k">EXISTS</span>{" tabela_antiga;\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_pedidos_cliente "}<span className="tok-k">ON</span>{" pedidos (cliente_id);"}
        </CodeBlock>
        <h3><T pt="DML: dados" en="DML: data" /></h3>
        <CodeBlock>
          <span className="tok-k">SELECT</span>{" id, total "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" status = "}<span className="tok-s">'pendente'</span>{" "}<span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" criado_em DESC "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">20</span>{";\n"}
          {"\n"}
          <span className="tok-k">INSERT</span>{" "}<span className="tok-k">INTO</span>{" pedidos (cliente_id, total) "}<span className="tok-k">VALUES</span>{" ("}<span className="tok-n">42</span>{", "}<span className="tok-n">199.90</span>{") "}<span className="tok-k">RETURNING</span>{" id;\n"}
          {"\n"}
          <span className="tok-k">UPDATE</span>{" pedidos "}<span className="tok-k">SET</span>{" status = "}<span className="tok-s">'pago'</span>{" "}<span className="tok-k">WHERE</span>{" id = "}<span className="tok-n">7</span>{";\n"}
          {"\n"}
          <span className="tok-k">DELETE</span>{" "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" status = "}<span className="tok-s">'cancelado'</span>{" "}<span className="tok-k">AND</span>{" criado_em < now() - interval "}<span className="tok-s">'1 year'</span>{";\n"}
          {"\n"}
          <span className="tok-k">SELECT</span>{" c.nome, count(p.id) "}<span className="tok-k">AS</span>{" total_pedidos\n"}
          <span className="tok-k">FROM</span>{" clientes c\n"}
          <span className="tok-k">LEFT</span>{" "}<span className="tok-k">JOIN</span>{" pedidos p "}<span className="tok-k">ON</span>{" p.cliente_id = c.id\n"}
          <span className="tok-k">GROUP</span>{" "}<span className="tok-k">BY</span>{" c.nome\n"}
          <span className="tok-k">HAVING</span>{" count(p.id) > "}<span className="tok-n">0</span>{"\n"}
          <span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" total_pedidos DESC;"}
        </CodeBlock>
        <Table
          head={[<T pt="Tipo de JOIN" en="JOIN type" />, <T pt="Traz" en="Brings" />]}
          rows={[
            [<code>INNER JOIN</code>, <T pt="só linhas com correspondência nas duas tabelas" en="only rows matching in both tables" />],
            [<code>LEFT JOIN</code>, <T pt="todas as linhas da esquerda, com NULL onde não houver correspondência à direita" en="all rows from the left, with NULL where there is no match on the right" />],
            [<code>FULL JOIN</code>, <T pt="todas as linhas dos dois lados" en="all rows from both sides" />],
          ]}
        />
        <Callout icon="check"><T pt={<>A transação é a unidade de "tudo ou nada": <code>BEGIN; ... ; COMMIT;</code> (ou <code>ROLLBACK;</code> para desfazer). O Postgres já roda cada comando isolado em sua própria transação implícita por padrão.</>} en={<>The transaction is the "all or nothing" unit: <code>BEGIN; ... ; COMMIT;</code> (or <code>ROLLBACK;</code> to undo). Postgres already runs each standalone statement in its own implicit transaction by default.</>} /></Callout>
      </Section>
      <Section id="cte-window" title={<T pt={"CTEs e window functions (o \"pivô\")"} en={"CTEs and window functions (the \"pivot\")"} />}>
        <p><T pt={<><em>CTEs</em> (Common Table Expressions, o bloco <code>WITH</code>) dão nome a uma subconsulta para usá-la como se fosse uma tabela, tornando consultas grandes legíveis. <em>Window functions</em> (funções de janela) fazem cálculos "através" de um grupo de linhas sem colapsá-las numa só — é a ferramenta certa para o que costuma ser pedido como "pivô" (comparar cada linha com um agregado do seu grupo).</>} en={<><em>CTEs</em> (Common Table Expressions, the <code>WITH</code> block) name a subquery so it can be used as if it were a table, making large queries readable. <em>Window functions</em> compute "across" a group of rows without collapsing them into one — the right tool for what is usually asked for as a "pivot" (comparing each row against an aggregate of its group).</>} /></p>
        <h3><T pt="CTE simples" en="A simple CTE" /></h3>
        <CodeBlock>
          <span className="tok-k">WITH</span>{" pedidos_pagos "}<span className="tok-k">AS</span>{" (\n"}
          {"  "}<span className="tok-k">SELECT</span>{" cliente_id, total "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" status = "}<span className="tok-s">'pago'</span>{"\n"}
          {")\n"}
          <span className="tok-k">SELECT</span>{" c.nome, sum(p.total) "}<span className="tok-k">AS</span>{" total_gasto\n"}
          <span className="tok-k">FROM</span>{" clientes c\n"}
          <span className="tok-k">JOIN</span>{" pedidos_pagos p "}<span className="tok-k">ON</span>{" p.cliente_id = c.id\n"}
          <span className="tok-k">GROUP</span>{" "}<span className="tok-k">BY</span>{" c.nome\n"}
          <span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" total_gasto DESC;"}
        </CodeBlock>
        <h3><T pt="CTE recursiva: percorrer uma árvore" en="Recursive CTE: walking a tree" /></h3>
        <CodeBlock>
          <span className="tok-k">WITH</span>{" "}<span className="tok-k">RECURSIVE</span>{" subordinados "}<span className="tok-k">AS</span>{" (\n"}
          {"  "}<span className="tok-k">SELECT</span>{" id, nome, gerente_id "}<span className="tok-k">FROM</span>{" funcionarios "}<span className="tok-k">WHERE</span>{" id = "}<span className="tok-n">1</span>{"        "}<span className="tok-c">-- âncora: o chefe</span>{"\n"}
          {"  "}<span className="tok-k">UNION</span>{" "}<span className="tok-k">ALL</span>{"\n"}
          {"  "}<span className="tok-k">SELECT</span>{" f.id, f.nome, f.gerente_id\n"}
          {"  "}<span className="tok-k">FROM</span>{" funcionarios f\n"}
          {"  "}<span className="tok-k">JOIN</span>{" subordinados s "}<span className="tok-k">ON</span>{" f.gerente_id = s.id                         "}<span className="tok-c">-- passo recursivo</span>{"\n"}
          {")\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" subordinados;"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> todos os subordinados diretos e indiretos do funcionário 1, por quantos níveis existirem — sem precisar saber a profundidade do organograma de antemão.</>} en={<><strong>Expected result:</strong> every direct and indirect subordinate of employee 1, through however many levels exist — with no need to know the org chart's depth beforehand.</>} /></p>
        <h3><T pt={"Window functions: o \"pivô\" do Postgres"} en={"Window functions: Postgres's \"pivot\""} /></h3>
        <p><T pt={<>Bancos como o SQL Server têm um comando <code>PIVOT</code>; o Postgres resolve o mesmo problema com <code>FILTER</code> (agregação condicional) ou funções de janela com <code>OVER</code>.</>} en={<>Databases like SQL Server have a <code>PIVOT</code> command; Postgres solves the same problem with <code>FILTER</code> (conditional aggregation) or window functions with <code>OVER</code>.</>} /></p>
        <CodeBlock>
          <span className="tok-c">-- "pivô" clássico: uma coluna por status, por mês</span>{"\n"}
          <span className="tok-k">SELECT</span>{"\n"}
          {"  date_trunc("}<span className="tok-s">'month'</span>{", criado_em) "}<span className="tok-k">AS</span>{" mes,\n"}
          {"  count(*) "}<span className="tok-k">FILTER</span>{" ("}<span className="tok-k">WHERE</span>{" status = "}<span className="tok-s">'pago'</span>{")      "}<span className="tok-k">AS</span>{" pagos,\n"}
          {"  count(*) "}<span className="tok-k">FILTER</span>{" ("}<span className="tok-k">WHERE</span>{" status = "}<span className="tok-s">'cancelado'</span>{") "}<span className="tok-k">AS</span>{" cancelados\n"}
          <span className="tok-k">FROM</span>{" pedidos\n"}
          <span className="tok-k">GROUP</span>{" "}<span className="tok-k">BY</span>{" mes\n"}
          <span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" mes;\n"}
          {"\n"}
          <span className="tok-c">-- window function: o total do cliente ao lado de CADA pedido, sem agrupar</span>{"\n"}
          <span className="tok-k">SELECT</span>{"\n"}
          {"  id, cliente_id, total,\n"}
          {"  sum(total) "}<span className="tok-k">OVER</span>{" ("}<span className="tok-k">PARTITION</span>{" "}<span className="tok-k">BY</span>{" cliente_id) "}<span className="tok-k">AS</span>{" total_do_cliente,\n"}
          {"  rank()     "}<span className="tok-k">OVER</span>{" ("}<span className="tok-k">PARTITION</span>{" "}<span className="tok-k">BY</span>{" cliente_id "}<span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" total DESC) "}<span className="tok-k">AS</span>{" posicao\n"}
          <span className="tok-k">FROM</span>{" pedidos;"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> a segunda consulta mantém uma linha por pedido (diferente de um <code>GROUP BY</code>, que colapsaria), com <code>total_do_cliente</code> repetindo a soma do grupo em cada linha e <code>posicao</code> ranqueando os pedidos de cada cliente do maior para o menor.</>} en={<><strong>Expected result:</strong> the second query keeps one row per order (unlike a <code>GROUP BY</code>, which would collapse them), with <code>total_do_cliente</code> repeating the group's sum on every row and <code>posicao</code> ranking each customer's orders from largest to smallest.</>} /></p>
      </Section>
      <Section id="indexes" title={<T pt="Index: ler sem escanear tudo" en="Indexes: reading without scanning everything" />}>
        <p><T pt={<>Um índice é como o sumário de um livro: uma estrutura à parte que aponta direto para onde cada valor está, em vez de o Postgres ler a tabela inteira (<em>sequential scan</em>) para achar o que você pediu. Custa espaço em disco e um pouco de velocidade a mais em cada escrita; em compensação, consultas que filtram ou ordenam por aquela coluna ficam ordens de magnitude mais rápidas.</>} en={<>An index is like a book's index: a separate structure that points straight to where each value is, instead of Postgres reading the whole table (a <em>sequential scan</em>) to find what you asked for. It costs disk space and a little extra time on every write; in exchange, queries that filter or sort by that column get orders of magnitude faster.</>} /></p>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="Bom para" en="Good for" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<><strong>B-tree</strong> (padrão)</>, <T pt={<>igualdade e faixas: <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>, <code>ORDER BY</code></>} en={<>equality and ranges: <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>, <code>ORDER BY</code></>} />, <code>CREATE INDEX ON pedidos (cliente_id);</code>],
            [<strong>GIN</strong>, <T pt={"valores \"compostos\": JSONB, arrays, full-text search"} en="composite values: JSONB, arrays, full-text search" />, <code>CREATE INDEX ON produtos USING gin (busca);</code>],
            [<strong>GiST</strong>, <T pt="dados geométricos/geográficos, faixas que se sobrepõem" en="geometric/geographic data, overlapping ranges" />, <T pt={<>PostGIS, <code>tsrange</code></>} en={<>PostGIS, <code>tsrange</code></>} />],
            [<strong>BRIN</strong>, <T pt="tabelas enormes, ordenadas fisicamente (ex.: logs por data)" en="huge tables, physically ordered (e.g. logs by date)" />, <T pt="bem menor que um B-tree, bom o bastante quando os dados já chegam em ordem" en="much smaller than a B-tree, good enough when data already arrives in order" />],
            [<><strong>Único</strong> (<code>UNIQUE</code>)</>, <T pt="garante que não haja duplicata, além de acelerar" en="guarantees no duplicates, as well as speeding things up" />, <code>CREATE UNIQUE INDEX ON usuarios (email);</code>],
          ]}
        />
        <h3><T pt="Exercício: ver o índice funcionando" en="Exercise: see the index at work" /></h3>
        <CodeBlock>
          <span className="tok-k">EXPLAIN</span>{" "}<span className="tok-k">ANALYZE</span>{" "}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" cliente_id = "}<span className="tok-n">42</span>{";\n"}
          <span className="tok-c">-- antes de criar o índice: "Seq Scan on pedidos ... rows=1 ... Execution Time: 8.421 ms"</span>{"\n"}
          {"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_pedidos_cliente "}<span className="tok-k">ON</span>{" pedidos (cliente_id);\n"}
          {"\n"}
          <span className="tok-k">EXPLAIN</span>{" "}<span className="tok-k">ANALYZE</span>{" "}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" cliente_id = "}<span className="tok-n">42</span>{";\n"}
          <span className="tok-c">-- depois: "Index Scan using idx_pedidos_cliente ... Execution Time: 0.045 ms"</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o plano muda de <code>Seq Scan</code> (lê a tabela inteira) para <code>Index Scan</code> ou <code>Bitmap Index Scan</code>, e o <code>Execution Time</code> cai — em tabelas pequenas a diferença é pequena, mas cresce junto com a tabela. <code>EXPLAIN ANALYZE</code> <em>executa</em> a consulta de verdade; para só ver o plano sem rodar, use <code>EXPLAIN</code> sozinho.</>} en={<><strong>Expected result:</strong> the plan changes from <code>Seq Scan</code> (reads the whole table) to <code>Index Scan</code> or <code>Bitmap Index Scan</code>, and <code>Execution Time</code> drops — on small tables the difference is small, but it grows with the table. <code>EXPLAIN ANALYZE</code> <em>actually runs</em> the query; to see just the plan without running it, use <code>EXPLAIN</code> alone.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Índice não é de graça: cada <code>INSERT</code>/<code>UPDATE</code> precisa atualizar todos os índices da tabela também. Não crie um índice "só por garantia" em toda coluna — crie para as consultas que você de fato tem (olhe o <code>WHERE</code>, o <code>JOIN</code> e o <code>ORDER BY</code> das consultas lentas).</>} en={<>Indexes are not free: every <code>INSERT</code>/<code>UPDATE</code> has to update all of the table's indexes too. Do not create an index "just in case" on every column — create them for the queries you actually have (look at the <code>WHERE</code>, the <code>JOIN</code> and the <code>ORDER BY</code> of your slow queries).</>} /></Callout>
      </Section>
      <Section id="uuid" title={<T pt="UUID ou serial?" en="UUID or serial?" />}>
        <p><T pt={<>A chave primária de uma tabela costuma ser um número sequencial (<code>serial</code>/<code>GENERATED ALWAYS AS IDENTITY</code>) ou um <code>UUID</code> (um número aleatório gigante, praticamente único no universo). Cada um resolve um problema diferente.</>} en={<>A table's primary key is usually either a sequential number (<code>serial</code>/<code>GENERATED ALWAYS AS IDENTITY</code>) or a <code>UUID</code> (a huge random number, practically unique in the universe). Each solves a different problem.</>} /></p>
        <Table
          head={[<T pt="" en="" />, <T pt="serial / IDENTITY" en="serial / IDENTITY" />, <T pt="UUID" en="UUID" />]}
          rows={[
            [<T pt="Tamanho" en="Size" />, "4–8 bytes", "16 bytes"],
            [<T pt="Ordem" en="Order" />, <T pt="crescente e previsível" en="increasing and predictable" />, <T pt="aleatório (v4) — ruim para o índice; ordenável no tempo (v7) — bom" en="random (v4) — bad for the index; time-ordered (v7) — good" />],
            [<T pt="Adivinhável?" en="Guessable?" />, <T pt="sim: o pedido 1001 existe se o 1000 existir" en="yes: order 1001 exists if 1000 does" />, <T pt="não, na prática impossível de adivinhar" en="no, practically impossible to guess" />],
            [<T pt="Gerar sem ir ao banco" en="Generate without a round trip" />, <T pt="não (o banco decide o próximo número)" en="no (the database decides the next number)" />, <T pt="sim: o cliente pode gerar o ID antes de inserir" en="yes: the client can generate the ID before inserting" />],
            [<T pt="Bom para" en="Good for" />, <T pt="a maioria dos casos internos; IDs curtos em URLs" en="most internal cases; short IDs in URLs" />, <T pt="IDs expostos publicamente, sistemas distribuídos, merges entre bancos" en="publicly exposed IDs, distributed systems, merging data across databases" />],
          ]}
        />
        <CodeBlock>
          <span className="tok-c">-- serial moderno (desde o Postgres 10, prefira a IDENTITY ao velho "serial")</span>{"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">TABLE</span>{" pedidos (id bigint "}<span className="tok-k">GENERATED</span>{" "}<span className="tok-k">ALWAYS</span>{" "}<span className="tok-k">AS</span>{" "}<span className="tok-k">IDENTITY</span>{" "}<span className="tok-k">PRIMARY</span>{" "}<span className="tok-k">KEY</span>{", ...);\n"}
          {"\n"}
          <span className="tok-c">-- UUID</span>{"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">EXTENSION</span>{" "}<span className="tok-k">IF</span>{" "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">EXISTS</span>{" pgcrypto;           "}<span className="tok-c">-- só em Postgres &lt; 13</span>{"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">TABLE</span>{" sessoes (\n"}
          {"  id uuid "}<span className="tok-k">PRIMARY</span>{" "}<span className="tok-k">KEY</span>{" "}<span className="tok-k">DEFAULT</span>{" gen_random_uuid(),    "}<span className="tok-c">-- nativo desde o Postgres 13</span>{"\n"}
          {"  usuario_id bigint "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{",\n"}
          {"  criada_em timestamptz "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">NULL</span>{" "}<span className="tok-k">DEFAULT</span>{" now()\n"}
          {");"}
        </CodeBlock>
        <Callout icon="check"><T pt={<>UUID v4 (totalmente aleatório) espalha as escritas pelo índice de forma ruim para o cache e o disco. UUID v7 (ordenado no tempo, como um "serial disfarçado") existe para resolver isso — e o <code>ULID</code> é uma alternativa fora do padrão UUID com a mesma ideia. Prefira v7/ULID quando precisar das vantagens do UUID sem perder a localidade de um ID crescente.</>} en={<>UUID v4 (fully random) spreads writes across the index in a way that is bad for caching and disk. UUID v7 (time-ordered, like a "disguised serial") exists to fix that — and <code>ULID</code> is a non-UUID-standard alternative with the same idea. Prefer v7/ULID when you need UUID's advantages without losing an increasing ID's locality.</>} /></Callout>
      </Section>
      <Section id="fulltext" title={<T pt="Full-text search no lugar de LIKE" en="Full-text search instead of LIKE" />}>
        <p><T pt={<><code>LIKE '%palavra%'</code> funciona, mas não usa índice de forma eficiente (o <code>%</code> no início impede o B-tree de "pular" direto ao lugar certo) e não entende idioma nenhum — busca "corre" não acha "correu". Para busca de texto de verdade, o Postgres tem busca textual embutida.</>} en={<><code>LIKE '%word%'</code> works, but does not use an index efficiently (the leading <code>%</code> stops a B-tree from "jumping" straight to the right place) and understands no language at all — searching "run" will not find "ran". For real text search, Postgres has built-in full-text search.</>} /></p>
        <h3><T pt="tsvector e tsquery" en="tsvector and tsquery" /></h3>
        <CodeBlock>
          <span className="tok-k">ALTER</span>{" "}<span className="tok-k">TABLE</span>{" produtos ADD COLUMN busca tsvector\n"}
          {"  "}<span className="tok-k">GENERATED</span>{" "}<span className="tok-k">ALWAYS</span>{" "}<span className="tok-k">AS</span>{" (to_tsvector("}<span className="tok-s">'portuguese'</span>{", nome || "}<span className="tok-s">' '</span>{" || descricao)) STORED;\n"}
          {"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_produtos_busca "}<span className="tok-k">ON</span>{" produtos "}<span className="tok-k">USING</span>{" gin (busca);\n"}
          {"\n"}
          <span className="tok-k">SELECT</span>{" nome "}<span className="tok-k">FROM</span>{" produtos\n"}
          <span className="tok-k">WHERE</span>{" busca @@ to_tsquery("}<span className="tok-s">'portuguese'</span>{", "}<span className="tok-s">'camisa &amp; azul'</span>{")     "}<span className="tok-c">-- E</span>{"\n"}
          {"   "}<span className="tok-k">OR</span>{" busca @@ to_tsquery("}<span className="tok-s">'portuguese'</span>{", "}<span className="tok-s">'camisa | blusa'</span>{");   "}<span className="tok-c">-- OU</span>{"\n"}
          {"\n"}
          <span className="tok-k">SELECT</span>{" nome, ts_rank(busca, to_tsquery("}<span className="tok-s">'portuguese'</span>{", "}<span className="tok-s">'camisa'</span>{")) "}<span className="tok-k">AS</span>{" relevancia\n"}
          <span className="tok-k">FROM</span>{" produtos\n"}
          <span className="tok-k">WHERE</span>{" busca @@ to_tsquery("}<span className="tok-s">'portuguese'</span>{", "}<span className="tok-s">'camisa'</span>{")\n"}
          <span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" relevancia DESC;"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> buscar "camisa" encontra também "camisas" (o <code>to_tsvector</code> reduz palavras à raiz — <em>stemming</em>) e o <code>ts_rank</code> ordena pela relevância, algo que <code>LIKE</code> nunca faz.</>} en={<><strong>Expected result:</strong> searching "shirt" also finds "shirts" (<code>to_tsvector</code> reduces words to their root — <em>stemming</em>) and <code>ts_rank</code> sorts by relevance, something <code>LIKE</code> never does.</>} /></p>
        <h3><T pt="Quando o full-text search é demais: pg_trgm" en="When full-text search is overkill: pg_trgm" /></h3>
        <p><T pt={<>Para "busca parecida" (tolerar erros de digitação, autocompletar) sem a complexidade de idioma do full-text, a extensão <code>pg_trgm</code> indexa trigramas (grupos de 3 letras) e acelera <code>ILIKE</code>/<code>similarity()</code>.</>} en={<>For "fuzzy search" (tolerating typos, autocomplete) without full-text's language complexity, the <code>pg_trgm</code> extension indexes trigrams (groups of 3 letters) and speeds up <code>ILIKE</code>/<code>similarity()</code>.</>} /></p>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">EXTENSION</span>{" "}<span className="tok-k">IF</span>{" "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">EXISTS</span>{" pg_trgm;\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_produtos_nome_trgm "}<span className="tok-k">ON</span>{" produtos "}<span className="tok-k">USING</span>{" gin (nome gin_trgm_ops);\n"}
          {"\n"}
          <span className="tok-k">SELECT</span>{" nome "}<span className="tok-k">FROM</span>{" produtos "}<span className="tok-k">WHERE</span>{" nome "}<span className="tok-k">ILIKE</span>{" "}<span className="tok-s">'%camisa%'</span>{";         "}<span className="tok-c">-- agora usa o índice</span>{"\n"}
          <span className="tok-k">SELECT</span>{" nome, similarity(nome, "}<span className="tok-s">'camiza azul'</span>{") "}<span className="tok-k">AS</span>{" parecido\n"}
          <span className="tok-k">FROM</span>{" produtos "}<span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" parecido DESC "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">5</span>{";                  "}<span className="tok-c">-- tolera o erro de digitação</span>
        </CodeBlock>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Use quando" en="Use when" />]}
          rows={[
            [<><code>LIKE</code>/<code>ILIKE</code> sem índice</>, <T pt={<>tabela pequena, ou um prefixo fixo (<code>LIKE 'joão%'</code>, que ainda usa B-tree)</>} en={<>small table, or a fixed prefix (<code>LIKE 'joão%'</code>, which still uses a B-tree)</>} />],
            [<>Full-text search (<code>tsvector</code>)</>, <T pt="busca de verdade em texto corrido: artigos, descrições, documentos" en="real search over running text: articles, descriptions, documents" />],
            [<code>pg_trgm</code>, <T pt="autocompletar, tolerar erro de digitação, busca parecida em nomes/códigos" en="autocomplete, typo tolerance, fuzzy search over names/codes" />],
            [<T pt="Elasticsearch/Meilisearch (fora do Postgres)" en="Elasticsearch/Meilisearch (outside Postgres)" />, <T pt="busca como funcionalidade central do produto, facetas, escala muito grande" en="search as the product's core feature, facets, very large scale" />],
          ]}
        />
      </Section>
      <Section id="access-grants" title={<T pt="Quem tem acesso ao quê" en="Who has access to what" />}>
        <p><T pt={<>"Quem tem acesso a quê" no Postgres se decide em camadas: a role precisa existir, precisa de permissão no database, no schema, e por fim na tabela (ou até na linha). <code>GRANT</code> concede, <code>REVOKE</code> retira.</>} en={<>Who has access to what, in Postgres, is decided in layers: the role must exist, and needs permission on the database, on the schema, and finally on the table (or even on the row). <code>GRANT</code> gives, <code>REVOKE</code> takes away.</>} /></p>
        <CodeBlock>
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">CONNECT</span>{" "}<span className="tok-k">ON</span>{" "}<span className="tok-k">DATABASE</span>{" loja "}<span className="tok-k">TO</span>{" ana;\n"}
          <span className="tok-k">GRANT</span>{" USAGE "}<span className="tok-k">ON</span>{" "}<span className="tok-k">SCHEMA</span>{" vendas "}<span className="tok-k">TO</span>{" ana;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">SELECT</span>{", "}<span className="tok-k">INSERT</span>{" "}<span className="tok-k">ON</span>{" vendas.pedidos "}<span className="tok-k">TO</span>{" ana;\n"}
          <span className="tok-k">GRANT</span>{" "}<span className="tok-k">SELECT</span>{" (nome, email) "}<span className="tok-k">ON</span>{" clientes "}<span className="tok-k">TO</span>{" suporte;        "}<span className="tok-c">-- só essas colunas</span>{"\n"}
          <span className="tok-k">REVOKE</span>{" "}<span className="tok-k">INSERT</span>{" "}<span className="tok-k">ON</span>{" vendas.pedidos "}<span className="tok-k">FROM</span>{" ana;\n"}
          {"\n"}
          <span className="tok-c">-- o que uma role pode fazer:</span>{"\n"}
          <span className="tok-k">SELECT</span>{" grantee, table_name, privilege_type\n"}
          <span className="tok-k">FROM</span>{" information_schema.role_table_grants\n"}
          <span className="tok-k">WHERE</span>{" grantee = "}<span className="tok-s">'ana'</span>{";"}
        </CodeBlock>
        <h3><T pt="Row-Level Security (RLS): permissão por linha" en="Row-Level Security (RLS): permission per row" /></h3>
        <p><T pt={<>Quando até <em>colunas</em> não bastam — por exemplo, cada cliente só pode ver seus próprios pedidos — o RLS aplica um filtro automático em toda consulta daquela role, sem precisar confiar que todo <code>WHERE</code> da aplicação está correto.</>} en={<>When even <em>columns</em> are not enough — for example, each customer may only see their own orders — RLS applies an automatic filter to every query from that role, without having to trust that every <code>WHERE</code> in the application is correct.</>} /></p>
        <CodeBlock>
          <span className="tok-k">ALTER</span>{" "}<span className="tok-k">TABLE</span>{" pedidos "}<span className="tok-k">ENABLE</span>{" ROW LEVEL "}<span className="tok-k">SECURITY</span>{";\n"}
          {"\n"}
          <span className="tok-k">CREATE</span>{" POLICY pedidos_do_proprio_cliente "}<span className="tok-k">ON</span>{" pedidos\n"}
          {"  "}<span className="tok-k">USING</span>{" (cliente_id = current_setting("}<span className="tok-s">'app.cliente_id'</span>{")::bigint);\n"}
          {"\n"}
          <span className="tok-c">-- a aplicação define quem está logado antes de consultar:</span>{"\n"}
          <span className="tok-k">SET</span>{" app.cliente_id = "}<span className="tok-s">'42'</span>{";\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos;   "}<span className="tok-c">-- só retorna pedidos do cliente 42, mesmo sem WHERE</span>
        </CodeBlock>
        <Callout icon="check"><T pt={<>RLS é uma segunda camada de defesa, não uma desculpa para pular a checagem na aplicação — mas é exatamente o tipo de coisa que evita um vazamento quando um <code>WHERE</code> é esquecido em algum lugar do código.</>} en={<>RLS is a second layer of defence, not an excuse to skip the check in the application — but it is exactly the kind of thing that prevents a leak when a <code>WHERE</code> is forgotten somewhere in the code.</>} /></Callout>
      </Section>
      <Section id="backups" title={<T pt="Backups e a regra 3-2-1" en="Backups and the 3-2-1 rule" />}>
        <p><T pt={<>Um backup só vale alguma coisa se você já tiver <em>restaurado</em> ele com sucesso pelo menos uma vez. O Postgres tem três ferramentas principais, e por cima delas vale uma regra que não é específica de banco de dados: a <strong>3-2-1</strong>.</>} en={<>A backup is only worth something once you have <em>restored</em> it successfully at least once. Postgres has three main tools, and on top of them sits a rule that is not database-specific at all: the <strong>3-2-1</strong> rule.</>} /></p>
        <h3><T pt="As três ferramentas" en="The three tools" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="O que faz" en="What it does" />, <T pt="Use para" en="Use for" />]}
          rows={[
            [<code>pg_dump</code>, <T pt="exporta um database (ou parte dele) para um arquivo lógico (SQL ou formato próprio)" en="exports a database (or part of it) to a logical file (SQL or custom format)" />, <T pt="backups do dia a dia, mover dados entre versões/servidores" en="day-to-day backups, moving data between versions/servers" />],
            [<code>pg_dumpall</code>, <T pt={<>como o <code>pg_dump</code>, mas inclui roles e configurações de todo o cluster</>} en={<>like <code>pg_dump</code>, but includes roles and settings for the whole cluster</>} />, <T pt="backup completo de um servidor com vários databases" en="a full backup of a server with several databases" />],
            [<><code>pg_basebackup</code> + WAL</>, <T pt="cópia física dos arquivos de dados + o log de escrita contínuo (WAL)" en="a physical copy of the data files + the continuous write-ahead log (WAL)" />, <T pt="bancos grandes, e recuperação para QUALQUER instante (PITR)" en="large databases, and recovery to ANY point in time (PITR)" />],
          ]}
        />
        <CodeBlock>
          {"pg_dump -U postgres -h localhost -Fc loja > loja_$(date +%F).dump   "}<span className="tok-c"># formato comprimido, -Fc</span>{"\n"}
          {"pg_dump -U postgres loja > loja.sql                                 "}<span className="tok-c"># texto puro, legível, dá pra ler/editar</span>{"\n"}
          {"\n"}
          {"pg_restore -U postgres -d loja_nova loja_$(date +%F).dump           "}<span className="tok-c"># restaura o formato -Fc</span>{"\n"}
          {"psql -U postgres -d loja_nova < loja.sql                            "}<span className="tok-c"># restaura o SQL puro</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> depois do <code>pg_restore</code> num database novo e vazio, <code>\dt</code> mostra as mesmas tabelas do original, e um <code>SELECT count(*)</code> bate com a contagem de antes do dump.</>} en={<><strong>Expected result:</strong> after <code>pg_restore</code> into a new, empty database, <code>\dt</code> shows the same tables as the original, and a <code>SELECT count(*)</code> matches the count from before the dump.</>} /></p>
        <h3><T pt="Point-in-time recovery (PITR), em uma frase" en="Point-in-time recovery (PITR), in one sentence" /></h3>
        <p><T pt={<>Com <code>pg_basebackup</code> (uma foto dos arquivos) mais o <em>WAL</em> (write-ahead log: todo write é gravado ali antes de ir para a tabela) arquivado continuamente, dá para reconstruir o banco exatamente como estava um segundo antes de alguém rodar um <code>DELETE</code> sem <code>WHERE</code> — não só "como estava no backup de ontem à noite".</>} en={<>With <code>pg_basebackup</code> (a snapshot of the files) plus the continuously archived <em>WAL</em> (write-ahead log: every write is recorded there before it reaches the table), you can rebuild the database exactly as it was one second before someone ran a <code>DELETE</code> with no <code>WHERE</code> — not just "as it was in last night's backup".</>} /></p>
        <h3><T pt="A regra 3-2-1" en="The 3-2-1 rule" /></h3>
        <Diagram minWidth={600} caption={<T pt="3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 delas fora do local — não é regra de banco de dados, é regra de qualquer backup que importa." en="3 copies of the data, on 2 different kinds of media, with 1 kept off-site — not a database-specific rule, it is the rule for any backup that matters." />}>
          <svg viewBox="0 0 660 150" role="img" aria-label="A regra 3-2-1 / The 3-2-1 rule">
            <rect x="10" y="10" width="200" height="56" rx="4" className="brandfill" />
            <text x="110" y="34" className="pt" textAnchor="middle">3 cópias</text>
            <text x="110" y="34" className="en" textAnchor="middle">3 copies</text>
            <text x="110" y="53" className="pt mut mono" textAnchor="middle">o original + 2 backups</text>
            <text x="110" y="53" className="en mut mono" textAnchor="middle">the original + 2 backups</text>
            <rect x="230" y="10" width="200" height="56" rx="4" className="ln fillsoft" />
            <text x="330" y="34" className="pt" textAnchor="middle">2 mídias diferentes</text>
            <text x="330" y="34" className="en" textAnchor="middle">2 different media</text>
            <text x="330" y="53" className="pt mut mono" textAnchor="middle">ex.: disco local + nuvem</text>
            <text x="330" y="53" className="en mut mono" textAnchor="middle">e.g. local disk + cloud</text>
            <rect x="450" y="10" width="200" height="56" rx="4" className="ln fillsoft" />
            <text x="550" y="34" className="pt" textAnchor="middle">1 fora do local</text>
            <text x="550" y="34" className="en" textAnchor="middle">1 off-site</text>
            <text x="550" y="53" className="pt mut mono" textAnchor="middle">outra região/provedor</text>
            <text x="550" y="53" className="en mut mono" textAnchor="middle">another region/provider</text>
            <text x="10" y="96" className="pt mut" textAnchor="start">Se as 3 cópias estiverem no mesmo disco: um disco falho apaga tudo.</text>
            <text x="10" y="96" className="en mut" textAnchor="start">If all 3 copies are on the same disk: one failed disk wipes everything.</text>
            <text x="10" y="116" className="pt mut" textAnchor="start">Se as 2 mídias estiverem na mesma sala: um incêndio/roubo apaga tudo.</text>
            <text x="10" y="116" className="en mut" textAnchor="start">If the 2 media are in the same room: one fire/theft wipes everything.</text>
            <text x="10" y="136" className="pt mut" textAnchor="start">A cópia fora do local sobrevive a um desastre na região inteira.</text>
            <text x="10" y="136" className="en mut" textAnchor="start">The off-site copy survives a disaster affecting the whole region.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="Exemplo no mundo Postgres" en="Example in the Postgres world" />]}
          rows={[
            [<T pt="Cópia 1" en="Copy 1" />, <T pt="o banco em produção" en="the production database" />],
            [<T pt="Cópia 2" en="Copy 2" />, <T pt={<><code>pg_dump</code> diário num disco/volume separado da mesma máquina</>} en={<>a daily <code>pg_dump</code> on a disk/volume separate from the same machine</>} />],
            [<T pt="Cópia 3 (fora do local)" en="Copy 3 (off-site)" />, <T pt="o dump enviado para outro provedor/região (S3 em outra região, outra nuvem)" en="the dump shipped to another provider/region (S3 in another region, another cloud)" />],
            [<T pt="Em serviços gerenciados" en="On managed services" />, <T pt="RDS já faz backups automáticos com retenção e cópia entre zonas; confirme se ela cobre outra REGIÃO também" en="RDS already does automatic backups with retention and cross-zone copies; confirm it also covers another REGION" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Um backup que nunca foi restaurado é uma hipótese, não um backup. Agende um teste de restauração periódico — mensal é um bom começo — e meça quanto tempo leva (seu RTO, <em>recovery time objective</em>).</>} en={<>A backup that has never been restored is a hypothesis, not a backup. Schedule a periodic restore test — monthly is a good start — and measure how long it takes (your RTO, <em>recovery time objective</em>).</>} /></Callout>
      </Section>
      <Section id="caching" title={<T pt="Cache: o 80/20 para quem programa" en="Caching: the 80/20 for developers" />}>
        <p><T pt={"Cache é \"guardar uma resposta pronta para não refazer o trabalho\". É provavelmente a técnica isolada que mais acelera sistemas reais — e também a que mais causa bugs sutis, porque introduz uma segunda fonte de verdade que pode ficar desatualizada."} en={"A cache is \"keeping a ready-made answer so you do not redo the work\". It is probably the single technique that speeds up real systems the most — and also the one that causes the most subtle bugs, because it introduces a second source of truth that can go stale."} /></p>
        <h3><T pt="Onde o Postgres já faz cache por conta própria" en="Where Postgres already caches on its own" /></h3>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="O que guarda" en="What it keeps" />]}
          rows={[
            [<code>shared_buffers</code>, <T pt="páginas de dados recentemente usadas, na memória do próprio Postgres" en="recently used data pages, in Postgres's own memory" />],
            [<T pt="cache de página do SO" en="OS page cache" />, <T pt="o Linux também guarda os mesmos arquivos em memória livre — é por isso que a segunda leitura de algo é quase sempre mais rápida" en="Linux also keeps those same files in free memory — which is why a second read of something is almost always faster" />],
            [<T pt="plano de consulta" en="query plan" />, <T pt="consultas preparadas reaproveitam o plano já calculado" en="prepared statements reuse an already-computed plan" />],
          ]}
        />
        <h3><T pt="O 80/20 de cache de aplicação" en="The 80/20 of application caching" /></h3>
        <Table
          head={[<T pt="Padrão" en="Pattern" />, <T pt="Como funciona" en="How it works" />, <T pt="Risco principal" en="Main risk" />]}
          rows={[
            [<T pt="Cache-aside (lazy loading)" en="Cache-aside (lazy loading)" />, <T pt="a aplicação lê o cache; se faltar, lê o banco e GRAVA no cache" en="the application reads the cache; on a miss, it reads the database and WRITES to the cache" />, <T pt="dado desatualizado até expirar ou ser invalidado" en="stale data until it expires or is invalidated" />],
            [<T pt="Write-through" en="Write-through" />, <T pt="toda escrita vai para o banco E o cache, juntas" en="every write goes to the database AND the cache, together" />, <T pt="escrita fica mais lenta (duas gravações)" en="writes get slower (two writes)" />],
            [<T pt="TTL (time to live)" en="TTL (time to live)" />, <T pt="cada entrada expira sozinha depois de N segundos" en="each entry expires on its own after N seconds" />, <T pt={"escolher N é um equilíbrio entre \"atual\" e \"rápido\""} en={"choosing N is a trade-off between \"fresh\" and \"fast\""} />],
            [<T pt="Invalidação explícita" en="Explicit invalidation" />, <T pt="ao escrever, apaga/atualiza a entrada do cache na hora" en="on write, delete/update the cache entry right away" />, <T pt={"é fácil esquecer um caminho de escrita e deixar cache \"furado\""} en={"easy to forget a write path and leave the cache \"stale\""} />],
          ]}
        />
        <Callout icon="check"><T pt={"\"Existem só duas coisas difíceis em ciência da computação: invalidação de cache e nomear coisas.\" A piada clássica de Phil Karlton é clássica porque é verdade: prefira TTLs curtos e caches simples a esquemas de invalidação espertos demais."} en={"\"There are only two hard things in computer science: cache invalidation and naming things.\" Phil Karlton's classic joke is classic because it is true: prefer short TTLs and simple caches over overly clever invalidation schemes."} /></Callout>
        <h3><T pt="Onde colocar o cache" en="Where to put the cache" /></h3>
        <Diagram minWidth={640} caption={<T pt="Camadas de cache de um pedido típico, da borda até o banco." en="Cache layers of a typical request, from the edge down to the database." />}>
          <svg viewBox="0 0 710 112" role="img" aria-label="Onde cachear / Where to cache">
            <rect x="10" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="85" y="34" className="pt" textAnchor="middle">navegador</text>
            <text x="85" y="34" className="en" textAnchor="middle">browser</text>
            <text x="85" y="53" className="pt mut mono" textAnchor="middle">cache HTTP</text>
            <text x="85" y="53" className="en mut mono" textAnchor="middle">HTTP cache</text>
            <rect x="190" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="265" y="34" className="" textAnchor="middle">CDN</text>
            <text x="265" y="53" className="pt mut mono" textAnchor="middle">respostas inteiras</text>
            <text x="265" y="53" className="en mut mono" textAnchor="middle">whole responses</text>
            <rect x="370" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="445" y="34" className="" textAnchor="middle">app / Redis</text>
            <text x="445" y="53" className="pt mut mono" textAnchor="middle">objetos, sessões</text>
            <text x="445" y="53" className="en mut mono" textAnchor="middle">objects, sessions</text>
            <rect x="550" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="625" y="34" className="" textAnchor="middle">Postgres</text>
            <text x="625" y="53" className="mut mono" textAnchor="middle">shared_buffers</text>
            <path d="M160 38L190 38" className="ln" />
            <path d="M183.2 34.7L190 38L183.2 41.3" className="ln" />
            <path d="M340 38L370 38" className="ln" />
            <path d="M363.2 34.7L370 38L363.2 41.3" className="ln" />
            <path d="M520 38L550 38" className="ln" />
            <path d="M543.2 34.7L550 38L543.2 41.3" className="ln" />
            <text x="10" y="96" className="pt mut" textAnchor="start">Quanto mais perto do usuário, mais rápido — e mais fácil servir dado velho sem perceber.</text>
            <text x="10" y="96" className="en mut" textAnchor="start">The closer to the user, the faster — and the easier to serve stale data without noticing.</text>
          </svg>
        </Diagram>
        <h3><T pt={"O problema N+1: o \"cache que você nem precisava\""} en={"The N+1 problem: the \"cache you did not even need\""} /></h3>
        <CodeBlock>
          <span className="tok-c">-- N+1: 1 consulta para os pedidos + N consultas, uma por pedido, para o cliente</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">20</span>{";                     "}<span className="tok-c">-- 1</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" clientes "}<span className="tok-k">WHERE</span>{" id = "}<span className="tok-n">1</span>{";                "}<span className="tok-c">-- repetida 20x por um ORM "ingênuo"</span>{"\n"}
          {"\n"}
          <span className="tok-c">-- resolvido com UM join, sem precisar de cache nenhum</span>{"\n"}
          <span className="tok-k">SELECT</span>{" p.*, c.nome "}<span className="tok-k">FROM</span>{" pedidos p "}<span className="tok-k">JOIN</span>{" clientes c "}<span className="tok-k">ON</span>{" c.id = p.cliente_id "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">20</span>{";"}
        </CodeBlock>
        <p><T pt={<>Boa parte do "preciso de cache" na prática é, na verdade, uma consulta ruim. Antes de adicionar uma camada de cache, rode <code>EXPLAIN ANALYZE</code> e confira se um índice ou um <code>JOIN</code> já resolvem.</>} en={<>A good part of "I need a cache" in practice is actually a bad query. Before adding a cache layer, run <code>EXPLAIN ANALYZE</code> and check whether an index or a <code>JOIN</code> already fixes it.</>} /></p>
      </Section>
      <Section id="docker-lab" title={<T pt="Laboratório com Docker" en="Lab with Docker" />}>
        <p><T pt="Um Postgres local em segundos, para treinar tudo desta nota sem instalar nada no sistema." en="A local Postgres in seconds, to practise everything in this note without installing anything on your system." /></p>
        <CodeBlock>
          {"mkdir lab-postgres && cd lab-postgres\n"}
          {"cat > docker-compose.yml <<"}<span className="tok-s">'EOF'</span>{"\n"}
          {"services:\n"}
          {"  db:\n"}
          {"    image: postgres:16\n"}
          {"    environment:\n"}
          {"      POSTGRES_USER: ana\n"}
          {"      POSTGRES_PASSWORD: s3nha-forte-de-verdade\n"}
          {"      POSTGRES_DB: loja\n"}
          {"    ports:\n"}
          {"      - "}<span className="tok-s">"127.0.0.1:5432:5432"</span>{"\n"}
          {"    volumes:\n"}
          {"      - dados:/var/lib/postgresql/data\n"}
          {"volumes:\n"}
          {"  dados:\n"}
          {"EOF\n"}
          {"docker compose up -d\n"}
          {"docker compose exec db psql -U ana -d loja -c "}<span className="tok-s">"SELECT version();"</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> a última linha imprime a versão do Postgres — se aparecer, o container subiu, aceitou a senha definida e criou o database <code>loja</code>.</>} en={<><strong>Expected result:</strong> the last line prints the Postgres version — if it shows up, the container came up, accepted the configured password, and created the <code>loja</code> database.</>} /></p>
        <CodeBlock>
          {"psql "}<span className="tok-s">"postgresql://ana:s3nha-forte-de-verdade@localhost:5432/loja"</span>{"   "}<span className="tok-c"># do seu HOST, direto</span>{"\n"}
          {"docker compose exec db pg_dump -U ana loja > backup.sql              "}<span className="tok-c"># pratique o backup da seção anterior</span>{"\n"}
          {"docker compose down                                                   "}<span className="tok-c"># para os containers, mantém o volume</span>{"\n"}
          {"docker compose down -v                                                "}<span className="tok-c"># remove TAMBÉM o volume (apaga os dados)</span>
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt={<>Diferenças entre este laboratório e um banco real (gerenciado ou em produção): aqui os dados vivem num <em>volume Docker</em> no seu disco — ele sobrevive a um <code>docker compose down</code>, mas some com <code>-v</code>, com uma reinstalação do Docker, ou se você trocar de máquina; um serviço gerenciado como o RDS tem o disco (EBS) e os backups automáticos independentes do processo. A rede também é a mesma do Docker explicada na nota de segurança: <code>127.0.0.1:5432:5432</code> deixa a porta só no seu host; sem o <code>127.0.0.1</code>, ficaria acessível por qualquer coisa que alcance a sua máquina. E não há TLS nem <code>pg_hba.conf</code> customizado aqui — a imagem oficial já libera senha de qualquer host dentro do container por padrão, o que é aceitável só porque é um laboratório local.</>} en={<>Differences between this lab and a real database (managed or in production): here the data lives in a <em>Docker volume</em> on your disk — it survives a <code>docker compose down</code>, but disappears with <code>-v</code>, with a Docker reinstall, or if you switch machines; a managed service like RDS has the disk (EBS) and automated backups independent of the process. The network is also the same Docker setup explained in the security note: <code>127.0.0.1:5432:5432</code> keeps the port local to your host only; without the <code>127.0.0.1</code>, it would be reachable by anything that can reach your machine. And there is no TLS or custom <code>pg_hba.conf</code> here — the official image already allows password auth from any host inside the container by default, which is acceptable only because this is a local lab.</>} /></Callout>
        <p><T pt={<>Para algo mais perto de produção, veja a nota de AWS (RDS) ou suba um Postgres numa VM de verdade e aplique o <code>pg_hba.conf</code> e o TLS desta nota de propósito.</>} en={<>For something closer to production, see the AWS note (RDS) or spin up Postgres on a real VM and apply this note's <code>pg_hba.conf</code> and TLS on purpose.</>} /></p>
      </Section>
      <Section id="cheat-pg" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Comando" en="Command" />]}
          rows={[
            [<T pt="listar databases/schemas/tabelas" en="list databases/schemas/tables" />, <><code>\l</code> · <code>\dn</code> · <code>\dt</code></>],
            [<T pt="ver a estrutura de uma tabela" en="see a table's structure" />, <code>\d nome_tabela</code>],
            [<T pt="criar usuário e dar acesso só leitura" en="create a user and grant read-only access" />, <code>CREATE ROLE ... LOGIN; GRANT SELECT ON ...</code>],
            [<T pt="ver se uma consulta usa índice" en="see whether a query uses an index" />, <code>EXPLAIN ANALYZE SELECT ...</code>],
            [<T pt="backup e restauração" en="backup and restore" />, <><code>pg_dump -Fc db &gt; f.dump</code> · <code>pg_restore -d db f.dump</code></>],
            [<T pt="buscar texto de verdade" en="search text for real" />, <><code>to_tsvector</code> / <code>to_tsquery</code></>],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Resposta" en="Answer" />]}
          rows={[
            [<T pt="Qual a diferença entre um database e um schema?" en="What is the difference between a database and a schema?" />, <T pt="Database é isolado (não dá para fazer JOIN entre dois); schema é um namespace DENTRO de um database." en="A database is isolated (you cannot JOIN across two); a schema is a namespace INSIDE one database." />],
            [<T pt="Por que o Postgres pede senha às vezes e não pede outras?" en="Why does Postgres sometimes ask for a password and sometimes not?" />, <T pt="Depende do método no pg_hba.conf: peer/ident confia no usuário do SO; scram-sha-256 pede senha." en="It depends on the pg_hba.conf method: peer/ident trusts the OS user; scram-sha-256 asks for a password." />],
            [<T pt={"A role \"ana\" do Postgres precisa existir como usuário do Linux?"} en={"Does the Postgres role \"ana\" need to exist as a Linux user?"} />, <T pt="Não — são sistemas de identidade completamente separados." en="No — they are completely separate identity systems." />],
            [<T pt="Quando um índice B-tree não ajuda num LIKE?" en="When does a B-tree index not help with a LIKE?" />, <T pt="Quando o padrão começa com %, como '%palavra%'; aí nem o índice nem um prefixo fixo ajudam." en="When the pattern starts with %, like '%word%'; then neither the index nor a fixed prefix helps." />],
            [<T pt="O que muda entre EXPLAIN e EXPLAIN ANALYZE?" en="What changes between EXPLAIN and EXPLAIN ANALYZE?" />, <T pt="EXPLAIN só mostra o plano estimado; EXPLAIN ANALYZE executa de verdade e mostra tempos reais." en="EXPLAIN only shows the estimated plan; EXPLAIN ANALYZE actually runs it and shows real timings." />],
            [<T pt="Por que UUID v4 pode ser ruim para performance de índice?" en="Why can UUID v4 be bad for index performance?" />, <T pt={"É totalmente aleatório, então as escritas se espalham pelo índice inteiro em vez de ficarem no \"final\"."} en={"It is fully random, so writes spread across the whole index instead of staying at the \"end\"."} />],
            [<T pt={"O que a regra 3-2-1 exige além de \"ter backup\"?"} en={"What does the 3-2-1 rule require beyond \"having a backup\"?"} />, <T pt="3 cópias, em 2 mídias diferentes, com 1 fora do local — e testar a restauração." en="3 copies, on 2 different media, with 1 kept off-site — and testing the restore." />],
          ]}
        />
      </Section>
      <Sources
        links={[
          { label: "PostgreSQL Global Development Group. PostgreSQL Documentation (official, free).", href: "https://www.postgresql.org/docs/current/" },
          { label: "Martin Kleppmann. Designing Data-Intensive Applications. O'Reilly, 2017.", href: "https://www.dataintensive.net/" },
          { label: "Dimitri Fontaine. The Art of PostgreSQL.", href: "https://theartofpostgresql.com/" },
          { label: "Markus Winand. Use The Index, Luke! (free online, SQL indexing).", href: "https://use-the-index-luke.com/" },
          { label: "PostgreSQL Documentation. The pg_hba.conf file.", href: "https://www.postgresql.org/docs/current/auth-pg-hba-conf.html" },
          { label: "PostgreSQL Documentation. Full Text Search.", href: "https://www.postgresql.org/docs/current/textsearch.html" },
          { label: "PostgreSQL Documentation. Backup and Restore.", href: "https://www.postgresql.org/docs/current/backup.html" },
          { label: "PostgreSQL Documentation. Privileges and Row Security Policies.", href: "https://www.postgresql.org/docs/current/rules-privileges.html" },
          { label: "Redis documentation. Caching architecture patterns (cache-aside, write-through).", href: "https://redis.io/learn/howtos/solutions/caching-architecture" },
        ]}
      />
    </>
  );
}
