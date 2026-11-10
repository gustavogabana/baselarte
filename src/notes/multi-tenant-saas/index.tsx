import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "multi-tenant-saas",
  title: { en: "Multi-tenant SaaS: one app, many customers", pt: "Multi-tenant (SaaS): um app, vários clientes" },
  seo: {
    title: { en: "Multi-tenant SaaS: one app, many customers", pt: "Multi-tenant (SaaS): um app, vários clientes" },
    description: { en: "What multi-tenancy is, the three data models (shared, schema, database per tenant), how to isolate tenants with tenant_id and Postgres row-level security, how to resolve the tenant per request, memberships, onboarding and the pitfalls.", pt: "O que é multi-tenancy, os três modelos de dados (compartilhado, schema e banco por tenant), como isolar tenants com tenant_id e row-level security do Postgres, como resolver o tenant por requisição, associações, onboarding e as armadilhas." },
  },
  summary: "what multi-tenancy is, the three data models (shared tables, schema per tenant, database per tenant), isolating tenants with tenant_id and Postgres row-level security, resolving the tenant per request, memberships, onboarding and common pitfalls.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Many customers, <em>one codebase, no leaks.</em></>, pt: <>Vários clientes, <em>um código, nenhum vazamento.</em></> },
  heroLede: { en: "A tenant is a customer account (a company, a team). Multi-tenancy is serving all of them from the same running app while making sure none of them can ever see another's data.", pt: "Um tenant é a conta de um cliente (uma empresa, um time). Multi-tenancy é atender todos com o mesmo app em execução, garantindo que nenhum veja os dados de outro." },
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é" en="What it is" /> },
        { id: "models", title: <T pt="Três modelos de dados" en="Three data models" /> },
        { id: "shared", title: <T pt="Tabelas compartilhadas com tenant_id" en="Shared tables with tenant_id" /> },
        { id: "rls", title: <T pt="Row-level security no Postgres" en="Postgres row-level security" /> },
        { id: "resolve", title: <T pt="Descobrir o tenant em cada requisição" en="Finding the tenant on each request" /> },
        { id: "build", title: <T pt="Roteiro para construir o app" en="Roadmap to build the app" /> },
        { id: "pitfalls", title: <T pt="Armadilhas e cola" en="Pitfalls and cheat sheet" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é" en="What it is" />}>
        <p><T pt={<>Em um app <strong>single-tenant</strong>, cada cliente tem sua própria instalação. Em um app <strong>multi-tenant</strong>, uma instalação atende todos. É o modelo da maioria dos SaaS: Slack, Notion, Shopify. Ganha-se custo menor, um único deploy e correções para todos de uma vez; paga-se com a obrigação de <em>isolar</em> os dados e de impedir que um cliente pesado derrube os outros (o "vizinho barulhento").</>} en={<>In a <strong>single-tenant</strong> app each customer has their own installation. In a <strong>multi-tenant</strong> app one installation serves everyone. It is the model of most SaaS: Slack, Notion, Shopify. You gain lower cost, a single deploy and fixes for everyone at once; you pay with the duty to <em>isolate</em> data and to stop a heavy customer from dragging others down (the "noisy neighbour").</>} /></p>
        <p><T pt={<>Vocabulário: <strong>tenant</strong> = a organização cliente; <strong>usuário</strong> = uma pessoa; <strong>associação</strong> (membership) = a ligação usuário-tenant com um papel. Uma pessoa pode pertencer a vários tenants. Quem pode fazer o quê dentro do tenant é assunto de <a href="/notas/rbac-abac/">RBAC e ABAC</a>.</>} en={<>Vocabulary: <strong>tenant</strong> = the customer organisation; <strong>user</strong> = a person; <strong>membership</strong> = the user-tenant link with a role. One person can belong to several tenants. Who may do what inside the tenant is the topic of <a href="/notas/rbac-abac/">RBAC and ABAC</a>.</>} /></p>
      </Section>

      <Section id="models" title={<T pt="Três modelos de dados" en="Three data models" />}>
        <Table
          head={[<T pt="Modelo" en="Model" />, <T pt="Como é" en="What it is" />, <T pt="Isolamento" en="Isolation" />, <T pt="Custo e operação" en="Cost and operations" />]}
          rows={[
            [<T pt="Compartilhado (pool)" en="Shared (pool)" />, <T pt={<>mesmas tabelas, coluna <code>tenant_id</code></>} en={<>same tables, a <code>tenant_id</code> column</>} />, <T pt="lógico (depende do seu código e do RLS)" en="logical (depends on your code and RLS)" />, <T pt="o mais barato; uma migration atende todos" en="cheapest; one migration serves all" />],
            [<T pt="Schema por tenant" en="Schema per tenant" />, <T pt="um schema Postgres para cada tenant no mesmo banco" en="one Postgres schema per tenant in the same database" />, <T pt="médio" en="medium" />, <T pt="migrations rodam N vezes; centenas de schemas pesam" en="migrations run N times; hundreds of schemas get heavy" />],
            [<T pt="Banco por tenant (silo)" en="Database per tenant (silo)" />, <T pt="um banco (ou instância) para cada cliente" en="one database (or instance) per customer" />, <T pt="forte" en="strong" />, <T pt="o mais caro; exigido por clientes grandes, regulados ou com residência de dados" en="most expensive; required by large, regulated or data-residency customers" />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Recomendação para começar:</strong> tabelas compartilhadas com <code>tenant_id</code> + row-level security. Reserve "banco por tenant" como plano premium para o cliente que exigir. Dá para misturar: pool para a maioria, silo para alguns.</>} en={<><strong>Recommendation to start:</strong> shared tables with <code>tenant_id</code> + row-level security. Keep "database per tenant" as a premium plan for the customer who demands it. You can mix: pool for most, silo for a few.</>} /></Callout>
      </Section>

      <Section id="shared" title={<T pt="Tabelas compartilhadas com tenant_id" en="Shared tables with tenant_id" />}>
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
        <p><T pt={<>Regras: <strong>toda</strong> tabela de negócio tem <code>tenant_id NOT NULL</code>; toda unicidade é composta com ele; todo índice útil começa por ele; chaves estrangeiras entre tabelas de negócio devem incluir o tenant (<code>FOREIGN KEY (tenant_id, project_id)</code>) para impedir que uma tarefa do tenant A aponte para um projeto do B.</>} en={<>Rules: <strong>every</strong> business table has <code>tenant_id NOT NULL</code>; every uniqueness is composite with it; every useful index starts with it; foreign keys between business tables should include the tenant (<code>FOREIGN KEY (tenant_id, project_id)</code>) so a task of tenant A cannot point at a project of B.</>} /></p>
        <p><T pt="Esquecer um WHERE tenant_id é o vazamento clássico. Por isso não confie só na disciplina: coloque uma segunda trava no banco." en="Forgetting a WHERE tenant_id is the classic leak. So do not rely on discipline alone: add a second lock in the database." /></p>
      </Section>

      <Section id="rls" title={<T pt="Row-level security no Postgres" en="Postgres row-level security" />}>
        <p><T pt={<>Com <strong>RLS</strong>, o próprio Postgres acrescenta o filtro a toda consulta, mesmo que o código esqueça. Você informa o tenant da requisição numa variável de sessão e a política compara com a coluna.</>} en={<>With <strong>RLS</strong>, Postgres itself adds the filter to every query, even if the code forgets. You pass the request's tenant in a session variable and the policy compares it with the column.</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<>Superusuários e papéis com <code>BYPASSRLS</code> ignoram as políticas, e o dono da tabela também, a menos que use <code>FORCE ROW LEVEL SECURITY</code>. Use <code>set_config(..., true)</code> (local à transação) e não <code>false</code>: com pool de conexões, um valor de sessão vazaria para a próxima requisição que reusar a conexão. Migrations e jobs administrativos usam outro papel, de propósito.</>} en={<>Superusers and roles with <code>BYPASSRLS</code> ignore policies, and so does the table owner unless you use <code>FORCE ROW LEVEL SECURITY</code>. Use <code>set_config(..., true)</code> (transaction-local), not <code>false</code>: with connection pooling a session value would leak to the next request that reuses the connection. Migrations and admin jobs use a different role, on purpose.</>} /></Callout>
      </Section>

      <Section id="resolve" title={<T pt="Descobrir o tenant em cada requisição" en="Finding the tenant on each request" />}>
        <Table
          head={[<T pt="Estratégia" en="Strategy" />, <T pt="Exemplo" en="Example" />, <T pt="Observação" en="Note" />]}
          rows={[
            [<T pt="Subdomínio" en="Subdomain" />, <code>acme.app.com</code>, <T pt="o mais comum; precisa de DNS curinga (*.app.com) e certificado curinga" en="the most common; needs wildcard DNS (*.app.com) and a wildcard certificate" />],
            [<T pt="Caminho" en="Path" />, <code>app.com/acme/projects</code>, <T pt="simples, sem DNS extra" en="simple, no extra DNS" />],
            [<T pt="Sessão/token" en="Session/token" />, <T pt={<>claim <code>tenant_id</code> no token</>} en={<><code>tenant_id</code> claim in the token</>} />, <T pt="bom para APIs; ao trocar de tenant, emita novo token" en="good for APIs; issue a new token when switching tenant" />],
            [<T pt="Domínio próprio" en="Custom domain" />, <code>app.cliente.com</code>, <T pt="tabela domínio → tenant; certificado por domínio (Cloudflare for SaaS, Caddy)" en="domain → tenant table; a certificate per domain (Cloudflare for SaaS, Caddy)" />],
          ]}
        />
        <p><T pt={<>O ponto crítico: o tenant da requisição é <strong>resolvido e validado no servidor</strong>. Se vier do subdomínio ou de um cabeçalho, confirme que o usuário autenticado tem uma associação naquele tenant antes de seguir. Nunca confie num <code>tenantId</code> enviado no corpo.</>} en={<>The critical point: the request's tenant is <strong>resolved and validated on the server</strong>. If it comes from the subdomain or a header, confirm the authenticated user has a membership in that tenant before continuing. Never trust a <code>tenantId</code> sent in the body.</>} /></p>
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

      <Section id="build" title={<T pt="Roteiro para construir o app" en="Roadmap to build the app" />}>
        <ol>
          <li><T pt={<><strong>Modelo:</strong> <code>tenants</code>, <code>users</code>, <code>memberships</code> (com papel) e as tabelas de negócio com <code>tenant_id</code>.</>} en={<><strong>Model:</strong> <code>tenants</code>, <code>users</code>, <code>memberships</code> (with role) and business tables with <code>tenant_id</code>.</>} /></li>
          <li><T pt={<><strong>Isolamento:</strong> RLS + papel de banco sem bypass + <code>withTenant()</code> em toda requisição.</>} en={<><strong>Isolation:</strong> RLS + a database role without bypass + <code>withTenant()</code> on every request.</>} /></li>
          <li><T pt={<><strong>Autenticação e tenant:</strong> login (<a href="/notas/auth-sso-oauth-oidc/">OIDC</a> ou senha), middleware <code>tenantContext</code>.</>} en={<><strong>Authentication and tenant:</strong> login (<a href="/notas/auth-sso-oauth-oidc/">OIDC</a> or password), the <code>tenantContext</code> middleware.</>} /></li>
          <li><T pt={<><strong>Autorização:</strong> papéis e <code>can()</code> (<a href="/notas/rbac-abac/">RBAC + ABAC</a>).</>} en={<><strong>Authorization:</strong> roles and <code>can()</code> (<a href="/notas/rbac-abac/">RBAC + ABAC</a>).</>} /></li>
          <li><T pt={<><strong>Onboarding:</strong> ao cadastrar, uma transação cria o tenant, o usuário e a associação <code>owner</code>. Convites por e-mail criam associações com outros papéis.</>} en={<><strong>Onboarding:</strong> on sign-up, one transaction creates the tenant, the user and the <code>owner</code> membership. Email invitations create memberships with other roles.</>} /></li>
          <li><T pt={<><strong>Cobrança:</strong> o plano e a assinatura pertencem ao <em>tenant</em>, não ao usuário. Veja <a href="/notas/payment-gateways/">Gateways de pagamento</a>.</>} en={<><strong>Billing:</strong> the plan and subscription belong to the <em>tenant</em>, not the user. See <a href="/notas/payment-gateways/">Payment gateways</a>.</>} /></li>
          <li><T pt="Limites por tenant: rate limit, cotas de armazenamento, tamanho de fila, para conter o vizinho barulhento." en="Per-tenant limits: rate limit, storage quotas, queue size, to contain the noisy neighbour." /></li>
          <li><T pt="Observabilidade: inclua tenant_id em logs, métricas e traces para achar quem está pesando." en="Observability: include tenant_id in logs, metrics and traces to find who is heavy." /></li>
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

      <Section id="pitfalls" title={<T pt="Armadilhas e cola" en="Pitfalls and cheat sheet" />}>
        <ul>
          <li><T pt="Jobs, filas e cron rodam fora da requisição: carregue o tenant_id na mensagem e chame withTenant() também ali." en="Jobs, queues and cron run outside the request: carry the tenant_id in the message and call withTenant() there too." /></li>
          <li><T pt="Cache sem tenant na chave (cache:projects:list) serve dados de um cliente a outro. Prefixe sempre: t:<tenant>:projects." en="A cache without the tenant in the key (cache:projects:list) serves one customer's data to another. Always prefix: t:<tenant>:projects." /></li>
          <li><T pt="Arquivos (S3/R2): um prefixo por tenant e URLs assinadas de curta duração; nunca um bucket público com nomes previsíveis." en="Files (S3/R2): one prefix per tenant and short-lived signed URLs; never a public bucket with guessable names." /></li>
          <li><T pt="Migrations em tabelas grandes bloqueiam todos os tenants ao mesmo tempo; veja Migrations de banco." en="Migrations on big tables block all tenants at once; see Database migrations." /></li>
          <li><T pt="Backup e restauração por tenant são difíceis no modelo compartilhado. Decida cedo se vai prometer isso." en="Per-tenant backup and restore are hard in the shared model. Decide early whether you will promise it." /></li>
          <li><T pt="Teste de vazamento: crie dois tenants, dados em ambos, e prove que cada rota, export e busca do A não retorna nada do B." en="Leak test: create two tenants with data in both and prove that every route, export and search of A returns nothing of B." /></li>
        </ul>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="começar barato" en="start cheap" />, <T pt="tabelas compartilhadas + tenant_id" en="shared tables + tenant_id" />],
            [<T pt="rede de segurança contra WHERE esquecido" en="a safety net against a forgotten WHERE" />, <T pt="RLS + FORCE + papel sem BYPASSRLS" en="RLS + FORCE + role without BYPASSRLS" />],
            [<T pt="cliente exigente / regulado" en="demanding / regulated customer" />, <T pt="banco ou instância dedicada para ele" en="dedicated database or instance for them" />],
            [<T pt="uma pessoa em vários tenants" en="one person in several tenants" />, <T pt="tabela memberships (usuário + tenant + papel)" en="memberships table (user + tenant + role)" />],
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
