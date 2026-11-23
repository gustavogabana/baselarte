import { Callout, CodeBlock, Diagram, Section, Sources, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "postgres-for-devs",
  title: "Postgres: o essencial para quem programa",
  seo: {
    title: "Postgres para quem programa, o 80/20",
    description: "Bancos relacionais 80/20, com foco em Postgres: schemas, gerenciadores de banco, como conectar, usuários e senhas (a confusão clássica), segurança de acesso, CTEs e window functions, índices, UUIDs, busca textual no lugar de LIKE, permissões, backups (3-2-1) e cache, com um laboratório em Docker.",
  },
  summary: "bancos relacionais 80/20 com foco no Postgres: schemas, conexão, roles e senhas, segurança de acesso, CTEs e window functions, índices, UUIDs, busca textual, grants, backups (3-2-1) e cache, com um laboratório em Docker.",
  kicker: "Guia de estudo",
  heroTitle: <>Postgres, <em>o 80/20 para quem programa.</em></>,
  heroLede: "Bancos relacionais do zero, com foco em Postgres: schemas, como conectar, usuários e senhas, segurança de acesso, índices, CTEs, busca textual, backups e cache — com um laboratório em Docker para rodar hoje.",
  published: "2026-10-18",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "basics", title: "O que é um banco relacional e um schema" },
        { id: "connecting", title: "Como conectar" },
        { id: "users", title: "Usuários e senhas: as três camadas" },
        { id: "access-security", title: "Segurança de acesso: pg_hba, TLS e privilégio mínimo" },
        { id: "commands", title: "Comandos do dia a dia" },
        { id: "cte-window", title: "CTEs e window functions (o \"pivô\")" },
        { id: "indexes", title: "Index: ler sem escanear tudo" },
        { id: "uuid", title: "UUID ou serial?" },
        { id: "fulltext", title: "Full-text search no lugar de LIKE" },
        { id: "access-grants", title: "Quem tem acesso ao quê" },
        { id: "backups", title: "Backups e a regra 3-2-1" },
        { id: "caching", title: "Cache: o 80/20 para quem programa" },
        { id: "docker-lab", title: "Laboratório com Docker" },
        { id: "cheat-pg", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="basics" title={"O que é um banco relacional e um schema"}>
        <p>Um banco <em>relacional</em> guarda dados em tabelas: linhas (registros) e colunas (campos), com <em>relações</em> entre tabelas por chaves. É "relacional" no sentido matemático de relação (um conjunto de tuplas), não porque as tabelas se relacionam entre si — embora também façam isso.</p>
        <p>O gerenciador que guarda, organiza e responde consultas sobre esses dados é um <em>SGBD</em> (sistema de gerenciamento de banco de dados; em inglês, <em>RDBMS</em>).</p>
        <Diagram minWidth={680} caption={"A hierarquia: instância → database → schema → tabela. Confundir \"database\" com \"schema\" é a troca mais comum."}>
          <svg viewBox="0 0 720 300" role="img" aria-label="Hierarquia do Postgres">
            <rect x="10" y="10" width="700" height="210" rx="4" className="ln dash" />
            <text x="24" y="32" className="mut" textAnchor="start">instância = servidor Postgres (um processo: postgres)</text>
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
            <text x="605" y="63" className="mono" textAnchor="middle">tabela usuarios</text>
            <rect x="520" y="92" width="170" height="36" rx="4" className="ln fillsoft" />
            <text x="605" y="115" className="mono" textAnchor="middle">tabela pedidos</text>
            <path d="M210 74L290 74" className="ln" />
            <path d="M283.2 70.7L290 74L283.2 77.3" className="ln" />
            <path d="M210 74L290 124" className="ln" />
            <path d="M286.0 117.7L290 124L282.5 123.2" className="ln" />
            <path d="M440 74L520 58" className="ln" />
            <path d="M512.7 56.1L520 58L514.0 62.5" className="ln" />
            <path d="M440 74L520 110" className="ln" />
            <path d="M515.2 104.3L520 110L512.5 110.2" className="ln" />
            <text x="10" y="244" className="mut" textAnchor="start">Uma instância roda vários DATABASES isolados; um database tem vários SCHEMAS</text>
            <text x="10" y="264" className="mut" textAnchor="start">(pastas lógicas); um schema tem as TABELAS.</text>
            <text x="10" y="284" className="mut" textAnchor="start">Por padrão você está no schema "public" — por isso o SQL quase nunca o nomeia.</text>
          </svg>
        </Diagram>
        <h3>O que é um schema, de fato</h3>
        <p>Um <em>schema</em> é um namespace dentro de um database: uma forma de organizar tabelas (por exemplo, <code>vendas.pedidos</code> e <code>rh.funcionarios</code> no mesmo database) sem precisar de um database separado para cada área. É diferente do uso da palavra "schema" em outros bancos (no MySQL, "schema" costuma ser sinônimo de "database" inteiro).</p>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">SCHEMA</span>{" vendas;\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">TABLE</span>{" vendas.pedidos (id bigint, total numeric("}<span className="tok-n">10</span>{","}<span className="tok-n">2</span>{"));\n"}
          {"\n"}
          <span className="tok-k">SET</span>{" search_path "}<span className="tok-k">TO</span>{" vendas, public;   "}<span className="tok-c">-- define a ordem de busca; agora "pedidos" sozinho já encontra vendas.pedidos</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos;               "}<span className="tok-c">-- funciona sem o prefixo "vendas."</span>
        </CodeBlock>
        <h3>Gerenciadores de banco: as opções mais comuns</h3>
        <Table
          head={["SGBD", "Tipo", "Quando escolher"]}
          rows={[
            [<strong>PostgreSQL</strong>, "relacional, objeto-relacional", "o padrão para a maioria dos projetos novos: tipos avançados (JSON, arrays, UUID), extensível, forte em correção e concorrência"],
            [<strong>MySQL / MariaDB</strong>, "relacional", "onipresente em hospedagem compartilhada e WordPress; engines de storage plugáveis (InnoDB)"],
            [<strong>SQLite</strong>, "relacional, embutido (sem servidor)", "um arquivo só, zero configuração: apps mobile/desktop, testes, protótipos"],
            [<strong>SQL Server</strong>, "relacional", "ecossistema Microsoft/.NET"],
            [<strong>Oracle Database</strong>, "relacional", "grandes empresas com contratos legados"],
            ["Gerenciados (RDS, Cloud SQL, Neon, Supabase)", "o mesmo Postgres/MySQL, hospedado", "backups, patches e failover geridos pelo provedor (veja a nota de AWS, seção RDS)"],
          ]}
        />
        <p>Esta nota usa Postgres porque é hoje a escolha padrão para projetos novos: licença permissiva, extensões (PostGIS, pg_trgm, pgvector), tipos de dado ricos e um dos motores de consulta mais corretos que existem.</p>
        <h3>Ferramentas para abrir um banco</h3>
        <Table
          head={["Ferramenta", "Tipo"]}
          rows={[
            [<code>psql</code>, "o cliente de linha de comando oficial, sempre disponível"],
            ["pgAdmin", "painel web oficial do projeto Postgres"],
            ["DBeaver / TablePlus / DataGrip", "clientes gráficos multiplataforma, funcionam com vários SGBDs"],
            ["VS Code (extensão SQLTools/PostgreSQL)", "abrir e consultar sem sair do editor"],
          ]}
        />
      </Section>
      <Section id="connecting" title={"Como conectar"}>
        <p>Conectar ao Postgres sempre passa pelos mesmos seis dados: quem você é, com qual senha, em qual máquina, em qual porta, e em qual database. Toda ferramenta — <code>psql</code>, uma lib de app, um painel gráfico — pede exatamente isso, às vezes como uma <em>connection string</em> só.</p>
        <Diagram minWidth={620} caption={<>A anatomia de uma connection string. <code>DATABASE_URL=postgresql://ana:s3nha@db.exemplo.com:5432/loja?sslmode=require</code></>}>
          <svg viewBox="0 0 640 100" role="img" aria-label="Anatomia da connection string">
            <rect x="10" y="20" width="96" height="40" rx="4" className="ln fillsoft" />
            <text x="58.0" y="45" className="mono" textAnchor="middle">postgresql://</text>
            <text x="58.0" y="80" className="mut" textAnchor="middle">esquema</text>
            <rect x="110" y="20" width="46" height="40" rx="4" className="ln fillsoft" />
            <text x="133.0" y="45" className="mono" textAnchor="middle">ana</text>
            <text x="133.0" y="80" className="mut" textAnchor="middle">usuário</text>
            <rect x="160" y="20" width="58" height="40" rx="4" className="ln fillsoft" />
            <text x="189.0" y="45" className="mono" textAnchor="middle">:s3nha@</text>
            <text x="189.0" y="80" className="mut" textAnchor="middle">senha</text>
            <rect x="222" y="20" width="150" height="40" rx="4" className="ln fillsoft" />
            <text x="297.0" y="45" className="mono" textAnchor="middle">db.exemplo.com</text>
            <text x="297.0" y="80" className="mut" textAnchor="middle">host</text>
            <rect x="376" y="20" width="50" height="40" rx="4" className="ln fillsoft" />
            <text x="401.0" y="45" className="mono" textAnchor="middle">:5432</text>
            <text x="401.0" y="80" className="mut" textAnchor="middle">porta</text>
            <rect x="430" y="20" width="50" height="40" rx="4" className="ln fillsoft" />
            <text x="455.0" y="45" className="mono" textAnchor="middle">/loja</text>
            <text x="455.0" y="80" className="mut" textAnchor="middle">database</text>
            <rect x="484" y="20" width="148" height="40" rx="4" className="ln fillsoft" />
            <text x="558.0" y="45" className="mono" textAnchor="middle">?sslmode=require</text>
            <text x="558.0" y="80" className="mut" textAnchor="middle">parâmetros</text>
          </svg>
        </Diagram>
        <h3>Pelo psql</h3>
        <CodeBlock>
          {"psql -h db.exemplo.com -p 5432 -U ana -d loja        "}<span className="tok-c"># pede a senha interativamente</span>{"\n"}
          {"psql "}<span className="tok-s">"postgresql://ana:s3nha@db.exemplo.com:5432/loja"</span>{"   "}<span className="tok-c"># tudo numa string só</span>{"\n"}
          {"psql -U postgres                                     "}<span className="tok-c"># local, usuário "postgres", pede/usa auth local</span>{"\n"}
          {"PGPASSWORD=s3nha psql -h localhost -U ana loja        "}<span className="tok-c"># senha por variável (cuidado: aparece em `ps`!)</span>
        </CodeBlock>
        <p>Dentro do <code>psql</code>, estes comandos resolvem 80% do dia a dia:</p>
        <Table
          head={["Comando", "Faz"]}
          rows={[
            [<code>\l</code>, "lista os databases"],
            [<code>\c loja</code>, "troca de database"],
            [<code>\dn</code>, "lista os schemas"],
            [<><code>\dt</code> · <code>\dt vendas.*</code></>, "lista tabelas (de um schema)"],
            [<code>\d pedidos</code>, "descreve uma tabela: colunas, tipos, índices, chaves estrangeiras"],
            [<code>\du</code>, "lista roles (usuários)"],
            [<code>\x</code>, "alterna exibição \"expandida\" (uma coluna por linha, ótimo para tabelas largas)"],
            [<code>\timing</code>, "mostra quanto tempo cada consulta leva"],
            [<code>\q</code>, "sai"],
          ]}
        />
        <Callout icon="check">Localmente, muita gente nem digita usuário/senha: o Postgres usa o método <code>peer</code> por padrão em conexões locais (via socket Unix), que confia no seu usuário <em>do sistema operacional</em>. Isso é exatamente o que a próxima seção desembaraça.</Callout>
      </Section>
      <Section id="users" title={"Usuários e senhas: as três camadas"}>
        <p>Esta é a maior fonte de confusão para quem está começando, porque a palavra "usuário" significa <em>três coisas diferentes</em> que não têm relação automática entre si. Desembaraçar isso resolve a maioria dos "funciona na minha máquina, não funciona no servidor".</p>
        <Diagram minWidth={680} caption={"As três camadas de \"usuário\" que costumam ser confundidas."}>
          <svg viewBox="0 0 720 205" role="img" aria-label="Três tipos de usuário">
            <rect x="10" y="10" width="220" height="54" rx="4" className="ln fillsoft" />
            <text x="120" y="34" textAnchor="middle">usuário do SO</text>
            <text x="120" y="52" className="mut mono" textAnchor="middle">ex.: "gustavo"</text>
            <text x="18" y="90" textAnchor="start">• login na MÁQUINA</text>
            <text x="18" y="110" textAnchor="start">• vive em /etc/passwd</text>
            <rect x="250" y="10" width="220" height="54" rx="4" className="ln" />
            <text x="360" y="34" textAnchor="middle">role do Postgres</text>
            <text x="360" y="52" className="mut mono" textAnchor="middle">ex.: "ana"</text>
            <text x="258" y="90" textAnchor="start">• login no BANCO</text>
            <text x="258" y="110" textAnchor="start">• vive em pg_roles</text>
            <text x="258" y="130" textAnchor="start">• senha e permissões PRÓPRIAS</text>
            <rect x="490" y="10" width="220" height="54" rx="4" className="ln fillsoft" />
            <text x="600" y="34" textAnchor="middle">usuário da aplicação</text>
            <text x="600" y="52" className="mut mono" textAnchor="middle">ex.: conta do cliente</text>
            <text x="498" y="90" textAnchor="start">• é uma LINHA em "usuarios"</text>
            <text x="498" y="110" textAnchor="start">• só a aplicação a entende</text>
            <text x="498" y="130" textAnchor="start">• o Postgres nem sabe dela</text>
            <text x="10" y="170" className="mut" textAnchor="start">Os três são independentes: a role "ana" não precisa existir como usuário do SO,</text>
            <text x="10" y="190" className="mut" textAnchor="start">e o Postgres nunca vê os usuários da sua aplicação.</text>
          </svg>
        </Diagram>
        <h3>Como as camadas se conectam na prática</h3>
        <Table
          head={["Cenário", "O que acontece"]}
          rows={[
            [<>Você digita <code>psql</code> sem argumentos</>, "tenta conectar como uma role do Postgres com o MESMO NOME do seu usuário do SO, no database de mesmo nome — coincidência de nome, não de identidade"],
            ["Instalação padrão cria o usuário do SO \"postgres\" e a role \"postgres\"", <><code>sudo -u postgres psql</code> funciona porque o SO deixa o usuário "postgres" rodar o psql, que conecta à role "postgres" (super-usuária DO BANCO, não do SO)</>],
            [<>Sua aplicação conecta com <code>DATABASE_URL</code></>, <>usa uma role do Postgres (ex.: <code>app_user</code>) e SUA senha; não tem nenhuma relação com o usuário do SO onde o app roda</>],
            ["Um cliente faz login no seu site", "sua aplicação confere a senha na SUA tabela de usuários; o Postgres só vê a role da aplicação executando a consulta"],
          ]}
        />
        <h3>Exercício: criar uma role, um database e testar</h3>
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
        <p><strong>Resultado esperado:</strong> o segundo <code>psql</code> pede senha (porque agora você está entrando como a <em>role</em> <code>ana</code>, via rede/senha, não por confiança do sistema operacional) e o prompt muda para <code>loja=&gt;</code>. Se <code>ana</code> tentar <code>CREATE DATABASE</code> sem <code>CREATEDB</code>, recebe um erro de permissão — ela só é dona do banco <code>loja</code>, não super-usuária.</p>
        <h3>Atributos de role mais usados</h3>
        <Table
          head={["Atributo", "Significa"]}
          rows={[
            [<code>LOGIN</code>, "pode se conectar (sem isso, a role só serve para agrupar permissões)"],
            [<code>SUPERUSER</code>, "ignora toda checagem de permissão — use só para administração, nunca para apps"],
            [<code>CREATEDB</code>, "pode criar databases"],
            [<code>PASSWORD</code>, "define a senha (hash scram-sha-256 por padrão desde o Postgres 14)"],
            [<code>VALID UNTIL</code>, "data de expiração da senha"],
            [<code>IN ROLE outra_role</code>, <>herda as permissões de outra role (ótimo para grupos como <code>app_readonly</code>)</>],
          ]}
        />
      </Section>
      <Section id="access-security" title={"Segurança de acesso: pg_hba, TLS e privilégio mínimo"}>
        <p>Quem pode se conectar, de onde, e como ela precisa provar quem é — tudo isso é decidido por um arquivo: <code>pg_hba.conf</code> (host-based authentication). É o "firewall de identidade" do Postgres, separado do firewall de rede (nftables/ufw) e separado das permissões SQL (<code>GRANT</code>).</p>
        <Diagram minWidth={600} caption={"A conexão só acontece se passar pelos três."}>
          <svg viewBox="0 0 670 130" role="img" aria-label="Os três portões">
            <rect x="10" y="10" width="140" height="56" rx="4" className="ln fillsoft" />
            <text x="80" y="43" textAnchor="middle">cliente</text>
            <rect x="180" y="10" width="140" height="56" rx="4" className="ln" />
            <text x="250" y="34" className="" textAnchor="middle">firewall</text>
            <text x="250" y="53" className="mut mono" textAnchor="middle">porta aberta?</text>
            <rect x="350" y="10" width="140" height="56" rx="4" className="ln fillsoft" />
            <text x="420" y="34" className="" textAnchor="middle">pg_hba.conf</text>
            <text x="420" y="53" className="mut mono" textAnchor="middle">pode entrar?</text>
            <rect x="520" y="10" width="140" height="56" rx="4" className="ln" />
            <text x="590" y="34" className="" textAnchor="middle">GRANT</text>
            <text x="590" y="53" className="mut mono" textAnchor="middle">pode fazer o quê?</text>
            <path d="M150 38L180 38" className="ln" />
            <path d="M173.2 34.7L180 38L173.2 41.3" className="ln" />
            <path d="M320 38L350 38" className="ln" />
            <path d="M343.2 34.7L350 38L343.2 41.3" className="ln" />
            <path d="M490 38L520 38" className="ln" />
            <path d="M513.2 34.7L520 38L513.2 41.3" className="ln" />
            <text x="10" y="96" className="mut" textAnchor="start">Três portões independentes: rede, identidade (quem pode entrar)</text>
            <text x="10" y="114" className="mut" textAnchor="start">e permissão (o que pode fazer depois de dentro).</text>
          </svg>
        </Diagram>
        <h3>Lendo o pg_hba.conf</h3>
        <CodeBlock code={`# TYPE  DATABASE  USER   ADDRESS          METHOD
local   all       postgres                         peer
local   all       all                               scram-sha-256
host    loja      ana     127.0.0.1/32              scram-sha-256
host    loja      app     10.0.0.0/8                scram-sha-256
hostssl all       all     0.0.0.0/0                 scram-sha-256
host    all       all     0.0.0.0/0                 reject`} />
        <Table
          head={["Coluna", "Significa"]}
          rows={[
            ["TYPE", <><code>local</code> = socket Unix (mesma máquina); <code>host</code> = TCP (com ou sem TLS); <code>hostssl</code> = TCP, exige TLS</>],
            ["METHOD", <><code>peer</code>/<code>ident</code> = confia no usuário do SO; <code>scram-sha-256</code> = senha (o padrão recomendado); <code>trust</code> = sem senha nenhuma; <code>reject</code> = nega</>],
          ]}
        />
        <Callout tone="warn" icon="alert">Regras são lidas de cima para baixo e a <em>primeira</em> que combinar vence. <code>trust</code> (sem senha) só faz sentido para <code>local</code>, numa máquina de estudo só sua — nunca em algo acessível pela rede. Depois de editar: <code>sudo systemctl reload postgresql</code> (recarrega sem derrubar conexões).</Callout>
        <h3>{"TLS e o que \"sslmode\" realmente garante"}</h3>
        <Table
          head={[<><code>sslmode</code></>, "Garante"]}
          rows={[
            [<code>disable</code>, <>nada: conexão em texto puro — ok só em <code>localhost</code></>],
            [<code>require</code>, "cifra o tráfego, mas NÃO confere a identidade do servidor (vulnerável a um impostor na rede)"],
            [<code>verify-full</code>, "cifra e confere o certificado do servidor contra uma CA confiável — o equivalente real de \"HTTPS seguro\""],
          ]}
        />
        <h3>Privilégio mínimo</h3>
        <p>A aplicação nunca deveria conectar como super-usuária. O padrão sensato: uma role por aplicação, com só as permissões que ela usa.</p>
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
        <h3>Pooling de conexões</h3>
        <p>Cada conexão Postgres custa memória (um processo por conexão). Para apps com muitas conexões curtas (serverless, muitas réplicas), um <em>pooler</em> como <code>PgBouncer</code> ou <code>Supavisor</code> fica entre a aplicação e o Postgres, reaproveitando um número menor de conexões reais — o lado de segurança é que o pooler também costuma ser o lugar certo para autenticar e limitar por aplicação.</p>
      </Section>
      <Section id="commands" title={"Comandos do dia a dia"}>
        <p>Um resumo do SQL que cobre a maior parte do trabalho de um desenvolvedor: criar estrutura (DDL) e ler/escrever dados (DML).</p>
        <h3>DDL: estrutura</h3>
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
        <h3>DML: dados</h3>
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
          head={["Tipo de JOIN", "Traz"]}
          rows={[
            [<code>INNER JOIN</code>, "só linhas com correspondência nas duas tabelas"],
            [<code>LEFT JOIN</code>, "todas as linhas da esquerda, com NULL onde não houver correspondência à direita"],
            [<code>FULL JOIN</code>, "todas as linhas dos dois lados"],
          ]}
        />
        <Callout icon="check">A transação é a unidade de "tudo ou nada": <code>BEGIN; ... ; COMMIT;</code> (ou <code>ROLLBACK;</code> para desfazer). O Postgres já roda cada comando isolado em sua própria transação implícita por padrão.</Callout>
      </Section>
      <Section id="cte-window" title={"CTEs e window functions (o \"pivô\")"}>
        <p><em>CTEs</em> (Common Table Expressions, o bloco <code>WITH</code>) dão nome a uma subconsulta para usá-la como se fosse uma tabela, tornando consultas grandes legíveis. <em>Window functions</em> (funções de janela) fazem cálculos "através" de um grupo de linhas sem colapsá-las numa só — é a ferramenta certa para o que costuma ser pedido como "pivô" (comparar cada linha com um agregado do seu grupo).</p>
        <h3>CTE simples</h3>
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
        <h3>CTE recursiva: percorrer uma árvore</h3>
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
        <p><strong>Resultado esperado:</strong> todos os subordinados diretos e indiretos do funcionário 1, por quantos níveis existirem — sem precisar saber a profundidade do organograma de antemão.</p>
        <h3>{"Window functions: o \"pivô\" do Postgres"}</h3>
        <p>Bancos como o SQL Server têm um comando <code>PIVOT</code>; o Postgres resolve o mesmo problema com <code>FILTER</code> (agregação condicional) ou funções de janela com <code>OVER</code>.</p>
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
        <p><strong>Resultado esperado:</strong> a segunda consulta mantém uma linha por pedido (diferente de um <code>GROUP BY</code>, que colapsaria), com <code>total_do_cliente</code> repetindo a soma do grupo em cada linha e <code>posicao</code> ranqueando os pedidos de cada cliente do maior para o menor.</p>
      </Section>
      <Section id="indexes" title={"Index: ler sem escanear tudo"}>
        <p>Um índice é como o sumário de um livro: uma estrutura à parte que aponta direto para onde cada valor está, em vez de o Postgres ler a tabela inteira (<em>sequential scan</em>) para achar o que você pediu. Custa espaço em disco e um pouco de velocidade a mais em cada escrita; em compensação, consultas que filtram ou ordenam por aquela coluna ficam ordens de magnitude mais rápidas.</p>
        <Table
          head={["Tipo", "Bom para", "Exemplo"]}
          rows={[
            [<><strong>B-tree</strong> (padrão)</>, <>igualdade e faixas: <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>, <code>ORDER BY</code></>, <code>CREATE INDEX ON pedidos (cliente_id);</code>],
            [<strong>GIN</strong>, "valores \"compostos\": JSONB, arrays, full-text search", <code>CREATE INDEX ON produtos USING gin (busca);</code>],
            [<strong>GiST</strong>, "dados geométricos/geográficos, faixas que se sobrepõem", <>PostGIS, <code>tsrange</code></>],
            [<strong>BRIN</strong>, "tabelas enormes, ordenadas fisicamente (ex.: logs por data)", "bem menor que um B-tree, bom o bastante quando os dados já chegam em ordem"],
            [<><strong>Único</strong> (<code>UNIQUE</code>)</>, "garante que não haja duplicata, além de acelerar", <code>CREATE UNIQUE INDEX ON usuarios (email);</code>],
          ]}
        />
        <h3>Exercício: ver o índice funcionando</h3>
        <CodeBlock>
          <span className="tok-k">EXPLAIN</span>{" "}<span className="tok-k">ANALYZE</span>{" "}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" cliente_id = "}<span className="tok-n">42</span>{";\n"}
          <span className="tok-c">-- antes de criar o índice: "Seq Scan on pedidos ... rows=1 ... Execution Time: 8.421 ms"</span>{"\n"}
          {"\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_pedidos_cliente "}<span className="tok-k">ON</span>{" pedidos (cliente_id);\n"}
          {"\n"}
          <span className="tok-k">EXPLAIN</span>{" "}<span className="tok-k">ANALYZE</span>{" "}<span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">WHERE</span>{" cliente_id = "}<span className="tok-n">42</span>{";\n"}
          <span className="tok-c">-- depois: "Index Scan using idx_pedidos_cliente ... Execution Time: 0.045 ms"</span>
        </CodeBlock>
        <p><strong>Resultado esperado:</strong> o plano muda de <code>Seq Scan</code> (lê a tabela inteira) para <code>Index Scan</code> ou <code>Bitmap Index Scan</code>, e o <code>Execution Time</code> cai — em tabelas pequenas a diferença é pequena, mas cresce junto com a tabela. <code>EXPLAIN ANALYZE</code> <em>executa</em> a consulta de verdade; para só ver o plano sem rodar, use <code>EXPLAIN</code> sozinho.</p>
        <Callout tone="warn" icon="alert">Índice não é de graça: cada <code>INSERT</code>/<code>UPDATE</code> precisa atualizar todos os índices da tabela também. Não crie um índice "só por garantia" em toda coluna — crie para as consultas que você de fato tem (olhe o <code>WHERE</code>, o <code>JOIN</code> e o <code>ORDER BY</code> das consultas lentas).</Callout>
      </Section>
      <Section id="uuid" title={"UUID ou serial?"}>
        <p>A chave primária de uma tabela costuma ser um número sequencial (<code>serial</code>/<code>GENERATED ALWAYS AS IDENTITY</code>) ou um <code>UUID</code> (um número aleatório gigante, praticamente único no universo). Cada um resolve um problema diferente.</p>
        <Table
          head={["", "serial / IDENTITY", "UUID"]}
          rows={[
            ["Tamanho", "4–8 bytes", "16 bytes"],
            ["Ordem", "crescente e previsível", "aleatório (v4) — ruim para o índice; ordenável no tempo (v7) — bom"],
            ["Adivinhável?", "sim: o pedido 1001 existe se o 1000 existir", "não, na prática impossível de adivinhar"],
            ["Gerar sem ir ao banco", "não (o banco decide o próximo número)", "sim: o cliente pode gerar o ID antes de inserir"],
            ["Bom para", "a maioria dos casos internos; IDs curtos em URLs", "IDs expostos publicamente, sistemas distribuídos, merges entre bancos"],
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
        <Callout icon="check">UUID v4 (totalmente aleatório) espalha as escritas pelo índice de forma ruim para o cache e o disco. UUID v7 (ordenado no tempo, como um "serial disfarçado") existe para resolver isso — e o <code>ULID</code> é uma alternativa fora do padrão UUID com a mesma ideia. Prefira v7/ULID quando precisar das vantagens do UUID sem perder a localidade de um ID crescente.</Callout>
      </Section>
      <Section id="fulltext" title={"Full-text search no lugar de LIKE"}>
        <p><code>LIKE '%palavra%'</code> funciona, mas não usa índice de forma eficiente (o <code>%</code> no início impede o B-tree de "pular" direto ao lugar certo) e não entende idioma nenhum — busca "corre" não acha "correu". Para busca de texto de verdade, o Postgres tem busca textual embutida.</p>
        <h3>tsvector e tsquery</h3>
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
        <p><strong>Resultado esperado:</strong> buscar "camisa" encontra também "camisas" (o <code>to_tsvector</code> reduz palavras à raiz — <em>stemming</em>) e o <code>ts_rank</code> ordena pela relevância, algo que <code>LIKE</code> nunca faz.</p>
        <h3>Quando o full-text search é demais: pg_trgm</h3>
        <p>Para "busca parecida" (tolerar erros de digitação, autocompletar) sem a complexidade de idioma do full-text, a extensão <code>pg_trgm</code> indexa trigramas (grupos de 3 letras) e acelera <code>ILIKE</code>/<code>similarity()</code>.</p>
        <CodeBlock>
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">EXTENSION</span>{" "}<span className="tok-k">IF</span>{" "}<span className="tok-k">NOT</span>{" "}<span className="tok-k">EXISTS</span>{" pg_trgm;\n"}
          <span className="tok-k">CREATE</span>{" "}<span className="tok-k">INDEX</span>{" idx_produtos_nome_trgm "}<span className="tok-k">ON</span>{" produtos "}<span className="tok-k">USING</span>{" gin (nome gin_trgm_ops);\n"}
          {"\n"}
          <span className="tok-k">SELECT</span>{" nome "}<span className="tok-k">FROM</span>{" produtos "}<span className="tok-k">WHERE</span>{" nome "}<span className="tok-k">ILIKE</span>{" "}<span className="tok-s">'%camisa%'</span>{";         "}<span className="tok-c">-- agora usa o índice</span>{"\n"}
          <span className="tok-k">SELECT</span>{" nome, similarity(nome, "}<span className="tok-s">'camiza azul'</span>{") "}<span className="tok-k">AS</span>{" parecido\n"}
          <span className="tok-k">FROM</span>{" produtos "}<span className="tok-k">ORDER</span>{" "}<span className="tok-k">BY</span>{" parecido DESC "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">5</span>{";                  "}<span className="tok-c">-- tolera o erro de digitação</span>
        </CodeBlock>
        <Table
          head={["Ferramenta", "Use quando"]}
          rows={[
            [<><code>LIKE</code>/<code>ILIKE</code> sem índice</>, <>tabela pequena, ou um prefixo fixo (<code>LIKE 'joão%'</code>, que ainda usa B-tree)</>],
            [<>Full-text search (<code>tsvector</code>)</>, "busca de verdade em texto corrido: artigos, descrições, documentos"],
            [<code>pg_trgm</code>, "autocompletar, tolerar erro de digitação, busca parecida em nomes/códigos"],
            ["Elasticsearch/Meilisearch (fora do Postgres)", "busca como funcionalidade central do produto, facetas, escala muito grande"],
          ]}
        />
      </Section>
      <Section id="access-grants" title={"Quem tem acesso ao quê"}>
        <p>"Quem tem acesso a quê" no Postgres se decide em camadas: a role precisa existir, precisa de permissão no database, no schema, e por fim na tabela (ou até na linha). <code>GRANT</code> concede, <code>REVOKE</code> retira.</p>
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
        <h3>Row-Level Security (RLS): permissão por linha</h3>
        <p>Quando até <em>colunas</em> não bastam — por exemplo, cada cliente só pode ver seus próprios pedidos — o RLS aplica um filtro automático em toda consulta daquela role, sem precisar confiar que todo <code>WHERE</code> da aplicação está correto.</p>
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
        <Callout icon="check">RLS é uma segunda camada de defesa, não uma desculpa para pular a checagem na aplicação — mas é exatamente o tipo de coisa que evita um vazamento quando um <code>WHERE</code> é esquecido em algum lugar do código.</Callout>
      </Section>
      <Section id="backups" title={"Backups e a regra 3-2-1"}>
        <p>Um backup só vale alguma coisa se você já tiver <em>restaurado</em> ele com sucesso pelo menos uma vez. O Postgres tem três ferramentas principais, e por cima delas vale uma regra que não é específica de banco de dados: a <strong>3-2-1</strong>.</p>
        <h3>As três ferramentas</h3>
        <Table
          head={["Ferramenta", "O que faz", "Use para"]}
          rows={[
            [<code>pg_dump</code>, "exporta um database (ou parte dele) para um arquivo lógico (SQL ou formato próprio)", "backups do dia a dia, mover dados entre versões/servidores"],
            [<code>pg_dumpall</code>, <>como o <code>pg_dump</code>, mas inclui roles e configurações de todo o cluster</>, "backup completo de um servidor com vários databases"],
            [<><code>pg_basebackup</code> + WAL</>, "cópia física dos arquivos de dados + o log de escrita contínuo (WAL)", "bancos grandes, e recuperação para QUALQUER instante (PITR)"],
          ]}
        />
        <CodeBlock>
          {"pg_dump -U postgres -h localhost -Fc loja > loja_$(date +%F).dump   "}<span className="tok-c"># formato comprimido, -Fc</span>{"\n"}
          {"pg_dump -U postgres loja > loja.sql                                 "}<span className="tok-c"># texto puro, legível, dá pra ler/editar</span>{"\n"}
          {"\n"}
          {"pg_restore -U postgres -d loja_nova loja_$(date +%F).dump           "}<span className="tok-c"># restaura o formato -Fc</span>{"\n"}
          {"psql -U postgres -d loja_nova < loja.sql                            "}<span className="tok-c"># restaura o SQL puro</span>
        </CodeBlock>
        <p><strong>Resultado esperado:</strong> depois do <code>pg_restore</code> num database novo e vazio, <code>\dt</code> mostra as mesmas tabelas do original, e um <code>SELECT count(*)</code> bate com a contagem de antes do dump.</p>
        <h3>Point-in-time recovery (PITR), em uma frase</h3>
        <p>Com <code>pg_basebackup</code> (uma foto dos arquivos) mais o <em>WAL</em> (write-ahead log: todo write é gravado ali antes de ir para a tabela) arquivado continuamente, dá para reconstruir o banco exatamente como estava um segundo antes de alguém rodar um <code>DELETE</code> sem <code>WHERE</code> — não só "como estava no backup de ontem à noite".</p>
        <h3>A regra 3-2-1</h3>
        <Diagram minWidth={600} caption={"3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 delas fora do local — não é regra de banco de dados, é regra de qualquer backup que importa."}>
          <svg viewBox="0 0 660 150" role="img" aria-label="A regra 3-2-1">
            <rect x="10" y="10" width="200" height="56" rx="4" className="brandfill" />
            <text x="110" y="34" textAnchor="middle">3 cópias</text>
            <text x="110" y="53" className="mut mono" textAnchor="middle">o original + 2 backups</text>
            <rect x="230" y="10" width="200" height="56" rx="4" className="ln fillsoft" />
            <text x="330" y="34" textAnchor="middle">2 mídias diferentes</text>
            <text x="330" y="53" className="mut mono" textAnchor="middle">ex.: disco local + nuvem</text>
            <rect x="450" y="10" width="200" height="56" rx="4" className="ln fillsoft" />
            <text x="550" y="34" textAnchor="middle">1 fora do local</text>
            <text x="550" y="53" className="mut mono" textAnchor="middle">outra região/provedor</text>
            <text x="10" y="96" className="mut" textAnchor="start">Se as 3 cópias estiverem no mesmo disco: um disco falho apaga tudo.</text>
            <text x="10" y="116" className="mut" textAnchor="start">Se as 2 mídias estiverem na mesma sala: um incêndio/roubo apaga tudo.</text>
            <text x="10" y="136" className="mut" textAnchor="start">A cópia fora do local sobrevive a um desastre na região inteira.</text>
          </svg>
        </Diagram>
        <Table
          head={["Camada", "Exemplo no mundo Postgres"]}
          rows={[
            ["Cópia 1", "o banco em produção"],
            ["Cópia 2", <><code>pg_dump</code> diário num disco/volume separado da mesma máquina</>],
            ["Cópia 3 (fora do local)", "o dump enviado para outro provedor/região (S3 em outra região, outra nuvem)"],
            ["Em serviços gerenciados", "RDS já faz backups automáticos com retenção e cópia entre zonas; confirme se ela cobre outra REGIÃO também"],
          ]}
        />
        <Callout tone="warn" icon="alert">Um backup que nunca foi restaurado é uma hipótese, não um backup. Agende um teste de restauração periódico — mensal é um bom começo — e meça quanto tempo leva (seu RTO, <em>recovery time objective</em>).</Callout>
      </Section>
      <Section id="caching" title={"Cache: o 80/20 para quem programa"}>
        <p>{"Cache é \"guardar uma resposta pronta para não refazer o trabalho\". É provavelmente a técnica isolada que mais acelera sistemas reais — e também a que mais causa bugs sutis, porque introduz uma segunda fonte de verdade que pode ficar desatualizada."}</p>
        <h3>Onde o Postgres já faz cache por conta própria</h3>
        <Table
          head={["Camada", "O que guarda"]}
          rows={[
            [<code>shared_buffers</code>, "páginas de dados recentemente usadas, na memória do próprio Postgres"],
            ["cache de página do SO", "o Linux também guarda os mesmos arquivos em memória livre — é por isso que a segunda leitura de algo é quase sempre mais rápida"],
            ["plano de consulta", "consultas preparadas reaproveitam o plano já calculado"],
          ]}
        />
        <h3>O 80/20 de cache de aplicação</h3>
        <Table
          head={["Padrão", "Como funciona", "Risco principal"]}
          rows={[
            ["Cache-aside (lazy loading)", "a aplicação lê o cache; se faltar, lê o banco e GRAVA no cache", "dado desatualizado até expirar ou ser invalidado"],
            ["Write-through", "toda escrita vai para o banco E o cache, juntas", "escrita fica mais lenta (duas gravações)"],
            ["TTL (time to live)", "cada entrada expira sozinha depois de N segundos", "escolher N é um equilíbrio entre \"atual\" e \"rápido\""],
            ["Invalidação explícita", "ao escrever, apaga/atualiza a entrada do cache na hora", "é fácil esquecer um caminho de escrita e deixar cache \"furado\""],
          ]}
        />
        <Callout icon="check">{"\"Existem só duas coisas difíceis em ciência da computação: invalidação de cache e nomear coisas.\" A piada clássica de Phil Karlton é clássica porque é verdade: prefira TTLs curtos e caches simples a esquemas de invalidação espertos demais."}</Callout>
        <h3>Onde colocar o cache</h3>
        <Diagram minWidth={640} caption={"Camadas de cache de um pedido típico, da borda até o banco."}>
          <svg viewBox="0 0 710 112" role="img" aria-label="Onde cachear">
            <rect x="10" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="85" y="34" textAnchor="middle">navegador</text>
            <text x="85" y="53" className="mut mono" textAnchor="middle">cache HTTP</text>
            <rect x="190" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="265" y="34" className="" textAnchor="middle">CDN</text>
            <text x="265" y="53" className="mut mono" textAnchor="middle">respostas inteiras</text>
            <rect x="370" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="445" y="34" className="" textAnchor="middle">app / Redis</text>
            <text x="445" y="53" className="mut mono" textAnchor="middle">objetos, sessões</text>
            <rect x="550" y="10" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="625" y="34" className="" textAnchor="middle">Postgres</text>
            <text x="625" y="53" className="mut mono" textAnchor="middle">shared_buffers</text>
            <path d="M160 38L190 38" className="ln" />
            <path d="M183.2 34.7L190 38L183.2 41.3" className="ln" />
            <path d="M340 38L370 38" className="ln" />
            <path d="M363.2 34.7L370 38L363.2 41.3" className="ln" />
            <path d="M520 38L550 38" className="ln" />
            <path d="M543.2 34.7L550 38L543.2 41.3" className="ln" />
            <text x="10" y="96" className="mut" textAnchor="start">Quanto mais perto do usuário, mais rápido — e mais fácil servir dado velho sem perceber.</text>
          </svg>
        </Diagram>
        <h3>{"O problema N+1: o \"cache que você nem precisava\""}</h3>
        <CodeBlock>
          <span className="tok-c">-- N+1: 1 consulta para os pedidos + N consultas, uma por pedido, para o cliente</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" pedidos "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">20</span>{";                     "}<span className="tok-c">-- 1</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" clientes "}<span className="tok-k">WHERE</span>{" id = "}<span className="tok-n">1</span>{";                "}<span className="tok-c">-- repetida 20x por um ORM "ingênuo"</span>{"\n"}
          {"\n"}
          <span className="tok-c">-- resolvido com UM join, sem precisar de cache nenhum</span>{"\n"}
          <span className="tok-k">SELECT</span>{" p.*, c.nome "}<span className="tok-k">FROM</span>{" pedidos p "}<span className="tok-k">JOIN</span>{" clientes c "}<span className="tok-k">ON</span>{" c.id = p.cliente_id "}<span className="tok-k">LIMIT</span>{" "}<span className="tok-n">20</span>{";"}
        </CodeBlock>
        <p>Boa parte do "preciso de cache" na prática é, na verdade, uma consulta ruim. Antes de adicionar uma camada de cache, rode <code>EXPLAIN ANALYZE</code> e confira se um índice ou um <code>JOIN</code> já resolvem.</p>
      </Section>
      <Section id="docker-lab" title={"Laboratório com Docker"}>
        <p>Um Postgres local em segundos, para treinar tudo desta nota sem instalar nada no sistema.</p>
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
        <p><strong>Resultado esperado:</strong> a última linha imprime a versão do Postgres — se aparecer, o container subiu, aceitou a senha definida e criou o database <code>loja</code>.</p>
        <CodeBlock>
          {"psql "}<span className="tok-s">"postgresql://ana:s3nha-forte-de-verdade@localhost:5432/loja"</span>{"   "}<span className="tok-c"># do seu HOST, direto</span>{"\n"}
          {"docker compose exec db pg_dump -U ana loja > backup.sql              "}<span className="tok-c"># pratique o backup da seção anterior</span>{"\n"}
          {"docker compose down                                                   "}<span className="tok-c"># para os containers, mantém o volume</span>{"\n"}
          {"docker compose down -v                                                "}<span className="tok-c"># remove TAMBÉM o volume (apaga os dados)</span>
        </CodeBlock>
        <Callout tone="warn" icon="alert">Diferenças entre este laboratório e um banco real (gerenciado ou em produção): aqui os dados vivem num <em>volume Docker</em> no seu disco — ele sobrevive a um <code>docker compose down</code>, mas some com <code>-v</code>, com uma reinstalação do Docker, ou se você trocar de máquina; um serviço gerenciado como o RDS tem o disco (EBS) e os backups automáticos independentes do processo. A rede também é a mesma do Docker explicada na nota de segurança: <code>127.0.0.1:5432:5432</code> deixa a porta só no seu host; sem o <code>127.0.0.1</code>, ficaria acessível por qualquer coisa que alcance a sua máquina. E não há TLS nem <code>pg_hba.conf</code> customizado aqui — a imagem oficial já libera senha de qualquer host dentro do container por padrão, o que é aceitável só porque é um laboratório local.</Callout>
        <p>Para algo mais perto de produção, veja a nota de AWS (RDS) ou suba um Postgres numa VM de verdade e aplique o <code>pg_hba.conf</code> e o TLS desta nota de propósito.</p>
      </Section>
      <Section id="cheat-pg" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Comando"]}
          rows={[
            ["listar databases/schemas/tabelas", <><code>\l</code> · <code>\dn</code> · <code>\dt</code></>],
            ["ver a estrutura de uma tabela", <code>\d nome_tabela</code>],
            ["criar usuário e dar acesso só leitura", <code>CREATE ROLE ... LOGIN; GRANT SELECT ON ...</code>],
            ["ver se uma consulta usa índice", <code>EXPLAIN ANALYZE SELECT ...</code>],
            ["backup e restauração", <><code>pg_dump -Fc db &gt; f.dump</code> · <code>pg_restore -d db f.dump</code></>],
            ["buscar texto de verdade", <><code>to_tsvector</code> / <code>to_tsquery</code></>],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <QA items={[
            ["Qual a diferença entre um database e um schema?", "Database é isolado (não dá para fazer JOIN entre dois); schema é um namespace DENTRO de um database."],
            ["Por que o Postgres pede senha às vezes e não pede outras?", "Depende do método no pg_hba.conf: peer/ident confia no usuário do SO; scram-sha-256 pede senha."],
            ["A role \"ana\" do Postgres precisa existir como usuário do Linux?", "Não — são sistemas de identidade completamente separados."],
            ["Quando um índice B-tree não ajuda num LIKE?", "Quando o padrão começa com %, como '%palavra%'; aí nem o índice nem um prefixo fixo ajudam."],
            ["O que muda entre EXPLAIN e EXPLAIN ANALYZE?", "EXPLAIN só mostra o plano estimado; EXPLAIN ANALYZE executa de verdade e mostra tempos reais."],
            ["Por que UUID v4 pode ser ruim para performance de índice?", "É totalmente aleatório, então as escritas se espalham pelo índice inteiro em vez de ficarem no \"final\"."],
            ["O que a regra 3-2-1 exige além de \"ter backup\"?", "3 cópias, em 2 mídias diferentes, com 1 fora do local — e testar a restauração."],
          ]} />
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
