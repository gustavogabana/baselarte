import { Callout, CodeBlock, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "multi-tenant-saas",
  title: "SaaS multi-tenant: um app, vários clientes",
  seo: {
    title: "Multi-tenant (SaaS): um app, vários clientes",
    description: "O que é multi-tenancy, os três modelos de dados (compartilhado, schema e banco por tenant), como isolar tenants com tenant_id e row-level security do Postgres, como resolver o tenant por requisição, associações, onboarding e as armadilhas.",
  },
  summary: "o que é multi-tenancy, os três modelos de dados (tabelas compartilhadas, schema por tenant, banco por tenant), isolar tenants com tenant_id e row-level security do Postgres, descobrir o tenant em cada pedido, associações (memberships), onboarding e armadilhas comuns.",
  kicker: "Guia de estudo",
  heroTitle: <>Vários clientes, <em>um código, nenhum vazamento.</em></>,
  heroLede: "Um tenant é a conta de um cliente (uma empresa, um time). Multi-tenancy é atender todos com o mesmo app em execução, garantindo que nenhum veja os dados de outro.",
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: "O que é" },
        { id: "models", title: "Três modelos de dados" },
        { id: "shared", title: "Tabelas compartilhadas com tenant_id" },
        { id: "rls", title: "Row-level security no Postgres" },
        { id: "resolve", title: "Descobrir o tenant em cada requisição" },
        { id: "build", title: "Roteiro para construir o app" },
        { id: "pitfalls", title: "Armadilhas e cola" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que é"}>
        <p>Em um app <strong>single-tenant</strong>, cada cliente tem sua própria instalação. Em um app <strong>multi-tenant</strong>, uma instalação atende todos. É o modelo da maioria dos SaaS: Slack, Notion, Shopify. Ganha-se custo menor, um único deploy e correções para todos de uma vez; paga-se com a obrigação de <em>isolar</em> os dados e de impedir que um cliente pesado derrube os outros (o "vizinho barulhento").</p>
        <p>Vocabulário: <strong>tenant</strong> = a organização cliente; <strong>usuário</strong> = uma pessoa; <strong>associação</strong> (membership) = a ligação usuário-tenant com um papel. Uma pessoa pode pertencer a vários tenants. Quem pode fazer o quê dentro do tenant é assunto de <a href="/notas/rbac-abac/">RBAC e ABAC</a>.</p>
      </Section>

      <Section id="models" title={"Três modelos de dados"}>
        <Table
          head={["Modelo", "Como é", "Isolamento", "Custo e operação"]}
          rows={[
            ["Compartilhado (pool)", <>mesmas tabelas, coluna <code>tenant_id</code></>, "lógico (depende do seu código e do RLS)", "o mais barato; uma migration atende todos"],
            ["Schema por tenant", "um schema Postgres para cada tenant no mesmo banco", "médio", "migrations rodam N vezes; centenas de schemas pesam"],
            ["Banco por tenant (silo)", "um banco (ou instância) para cada cliente", "forte", "o mais caro; exigido por clientes grandes, regulados ou com residência de dados"],
          ]}
        />
        <Callout icon="check"><strong>Recomendação para começar:</strong> tabelas compartilhadas com <code>tenant_id</code> + row-level security. Reserve "banco por tenant" como plano premium para o cliente que exigir. Dá para misturar: pool para a maioria, silo para alguns.</Callout>
      </Section>

      <Section id="shared" title={"Tabelas compartilhadas com tenant_id"}>
        <CodeBlock code={`CREATE TABLE tenants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,              -- acme -> acme.app.com
  name       text NOT NULL,
  plan       text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenants(id),
  name       text NOT NULL,
  UNIQUE (tenant_id, name)                      -- unique PER tenant, not global
);
CREATE INDEX ON projects (tenant_id);           -- every query filters by it`} />
        <p>Regras: <strong>toda</strong> tabela de negócio tem <code>tenant_id NOT NULL</code>; toda unicidade é composta com ele; todo índice útil começa por ele; chaves estrangeiras entre tabelas de negócio devem incluir o tenant (<code>FOREIGN KEY (tenant_id, project_id)</code>) para impedir que uma tarefa do tenant A aponte para um projeto do B.</p>
        <p>Esquecer um WHERE tenant_id é o vazamento clássico. Por isso não confie só na disciplina: coloque uma segunda trava no banco.</p>
      </Section>

      <Section id="rls" title={"Row-level security no Postgres"}>
        <p>Com <strong>RLS</strong>, o próprio Postgres acrescenta o filtro a toda consulta, mesmo que o código esqueça. Você informa o tenant da requisição numa variável de sessão e a política compara com a coluna.</p>
        <CodeBlock code={`ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE  ROW LEVEL SECURITY;   -- applies to the table owner too

CREATE POLICY tenant_isolation ON projects
  USING      (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- The app connects with a role that is NOT superuser and does NOT own the tables
CREATE ROLE app_user LOGIN PASSWORD '...' NOBYPASSRLS;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;`} />
        <CodeBlock code={`// One transaction per request; set_config(..., true) lasts only until COMMIT
export async function withTenant<T>(pool: Pool, tenantId: string, fn: (tx: PoolClient) => Promise<T>) {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    await tx.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const out = await fn(tx);          // any query in here only sees this tenant's rows
    await tx.query('COMMIT');
    return out;
  } catch (e) { await tx.query('ROLLBACK'); throw e; }
  finally { tx.release(); }
}`} />
        <Callout tone="warn" icon="alert">Superusuários e papéis com <code>BYPASSRLS</code> ignoram as políticas, e o dono da tabela também, a menos que use <code>FORCE ROW LEVEL SECURITY</code>. Use <code>set_config(..., true)</code> (local à transação) e não <code>false</code>: com pool de conexões, um valor de sessão vazaria para a próxima requisição que reusar a conexão. Migrations e jobs administrativos usam outro papel, de propósito.</Callout>
      </Section>

      <Section id="resolve" title={"Descobrir o tenant em cada requisição"}>
        <Table
          head={["Estratégia", "Exemplo", "Observação"]}
          rows={[
            ["Subdomínio", <code>acme.app.com</code>, "o mais comum; precisa de DNS curinga (*.app.com) e certificado curinga"],
            ["Caminho", <code>app.com/acme/projects</code>, "simples, sem DNS extra"],
            ["Sessão/token", <>claim <code>tenant_id</code> no token</>, "bom para APIs; ao trocar de tenant, emita novo token"],
            ["Domínio próprio", <code>app.cliente.com</code>, "tabela domínio → tenant; certificado por domínio (Cloudflare for SaaS, Caddy)"],
          ]}
        />
        <p>O ponto crítico: o tenant da requisição é <strong>resolvido e validado no servidor</strong>. Se vier do subdomínio ou de um cabeçalho, confirme que o usuário autenticado tem uma associação naquele tenant antes de seguir. Nunca confie num <code>tenantId</code> enviado no corpo.</p>
        <CodeBlock code={`async function tenantContext(req, res, next) {
  const slug = req.hostname.split('.')[0];                 // acme.app.com -> acme
  const tenant = await db.tenant.findBySlug(slug);
  if (!tenant) return res.sendStatus(404);

  const membership = await db.membership.find(req.user.id, tenant.id);
  if (!membership) return res.sendStatus(403);             // logged in, but not a member

  req.tenant = tenant;
  req.subject = await loadSubject(req.user, membership);   // permissions, see the RBAC/ABAC note
  next();
}`} />
      </Section>

      <Section id="build" title={"Roteiro para construir o app"}>
        <ol>
          <li><strong>Modelo:</strong> <code>tenants</code>, <code>users</code>, <code>memberships</code> (com papel) e as tabelas de negócio com <code>tenant_id</code>.</li>
          <li><strong>Isolamento:</strong> RLS + papel de banco sem bypass + <code>withTenant()</code> em toda requisição.</li>
          <li><strong>Autenticação e tenant:</strong> login (<a href="/notas/auth-sso-oauth-oidc/">OIDC</a> ou senha), middleware <code>tenantContext</code>.</li>
          <li><strong>Autorização:</strong> papéis e <code>can()</code> (<a href="/notas/rbac-abac/">RBAC + ABAC</a>).</li>
          <li><strong>Onboarding:</strong> ao cadastrar, uma transação cria o tenant, o usuário e a associação <code>owner</code>. Convites por e-mail criam associações com outros papéis.</li>
          <li><strong>Cobrança:</strong> o plano e a assinatura pertencem ao <em>tenant</em>, não ao usuário. Veja <a href="/notas/payment-gateways/">Gateways de pagamento</a>.</li>
          <li>Limites por tenant: rate limit, cotas de armazenamento, tamanho de fila, para conter o vizinho barulhento.</li>
          <li>Observabilidade: inclua tenant_id em logs, métricas e traces para achar quem está pesando.</li>
        </ol>
        <CodeBlock code={`export async function signUp(pool: Pool, email: string, companyName: string, slug: string) {
  return pool.connect().then(async (tx) => {
    try {
      await tx.query('BEGIN');
      const { rows: [tenant] } = await tx.query(
        'INSERT INTO tenants (slug, name) VALUES ($1, $2) RETURNING id', [slug, companyName]);
      const { rows: [user] } = await tx.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING id', [email]);
      await tx.query(
        "INSERT INTO memberships (user_id, tenant_id, role_id) SELECT $1, $2, id FROM roles WHERE name = 'owner' AND tenant_id IS NULL",
        [user.id, tenant.id]);
      await tx.query('COMMIT');
      return { tenantId: tenant.id, userId: user.id };
    } catch (e) { await tx.query('ROLLBACK'); throw e; }
    finally { tx.release(); }
  });
}`} />
      </Section>

      <Section id="pitfalls" title={"Armadilhas e cola"}>
        <ul>
          <li>Jobs, filas e cron rodam fora da requisição: carregue o tenant_id na mensagem e chame withTenant() também ali.</li>
          <li>{"Cache sem tenant na chave (cache:projects:list) serve dados de um cliente a outro. Prefixe sempre: t:<tenant>:projects."}</li>
          <li>Arquivos (S3/R2): um prefixo por tenant e URLs assinadas de curta duração; nunca um bucket público com nomes previsíveis.</li>
          <li>Migrations em tabelas grandes bloqueiam todos os tenants ao mesmo tempo; veja Migrations de banco.</li>
          <li>Backup e restauração por tenant são difíceis no modelo compartilhado. Decida cedo se vai prometer isso.</li>
          <li>Teste de vazamento: crie dois tenants, dados em ambos, e prove que cada rota, export e busca do A não retorna nada do B.</li>
        </ul>
        <Table
          head={["Quero…", "Uso"]}
          rows={[
            ["começar barato", "tabelas compartilhadas + tenant_id"],
            ["rede de segurança contra WHERE esquecido", "RLS + FORCE + papel sem BYPASSRLS"],
            ["cliente exigente / regulado", "banco ou instância dedicada para ele"],
            ["uma pessoa em vários tenants", "tabela memberships (usuário + tenant + papel)"],
          ]}
        />
      </Section>

      <Sources
        links={[
          { label: "PostgreSQL: Row Security Policies", href: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html" },
          { label: "Microsoft: Multitenant architecture considerations", href: "https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview" },
        ]}
      />
    </>
  );
}
