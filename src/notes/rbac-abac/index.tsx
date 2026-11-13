import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "rbac-abac",
  title: { en: "Authorization: RBAC and ABAC", pt: "Autorização: RBAC e ABAC" },
  seo: {
    title: { en: "Authorization: RBAC, ABAC and how to combine them", pt: "Autorização: RBAC, ABAC e como combinar os dois" },
    description: { en: "What RBAC and ABAC are, when each one fits, how to model roles, permissions and policies in Postgres, a single can() function for the whole app, tests and the mistakes that cause broken access control.", pt: "O que são RBAC e ABAC, quando cada um serve, como modelar papéis, permissões e políticas no Postgres, uma única função can() para o app inteiro, testes e os erros que causam controle de acesso quebrado." },
  },
  summary: "what RBAC (role-based) and ABAC (attribute-based) access control are, when to use each, how to model roles, permissions and policies in Postgres, one central can() function, how to test it and the common mistakes (IDOR, checks only in the UI).",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Who can do what, <em>decided in one place.</em></>, pt: <>Quem pode fazer o quê, <em>decidido num só lugar.</em></> },
  heroLede: { en: "RBAC gives people roles; ABAC decides with the attributes of the person, the resource and the situation. Most real apps need RBAC for the coarse part and a few ABAC rules for the rest.", pt: "RBAC dá papéis às pessoas; ABAC decide com os atributos da pessoa, do recurso e da situação. A maioria dos apps reais usa RBAC para a parte grossa e algumas regras ABAC para o resto." },
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="Autenticação x autorização" en="Authentication vs authorization" /> },
        { id: "rbac", title: <T pt="RBAC: papéis e permissões" en="RBAC: roles and permissions" /> },
        { id: "abac", title: <T pt="ABAC: regras por atributos" en="ABAC: attribute rules" /> },
        { id: "combine", title: <T pt="Combinando os dois: uma função can()" en="Combining both: one can() function" /> },
        { id: "model", title: <T pt="Modelo de dados" en="Data model" /> },
        { id: "build", title: <T pt="Como construir no app" en="How to build it in the app" /> },
        { id: "tools", title: <T pt="Quando usar uma biblioteca ou serviço" en="When to use a library or service" /> },
        { id: "mistakes", title: <T pt="Erros comuns e cola" en="Common mistakes and cheat sheet" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="Autenticação x autorização" en="Authentication vs authorization" />}>
        <p><T pt={<><strong>Autenticação</strong> responde "quem é você?" (senha, SSO, OIDC; veja <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>). <strong>Autorização</strong> responde "o que você pode fazer?". Esta nota é só sobre a segunda: depois de saber quem é o usuário, como decidir se ele pode ler, editar ou apagar aquilo.</>} en={<><strong>Authentication</strong> answers "who are you?" (password, SSO, OIDC; see <a href="/notas/auth-sso-oauth-oidc/">Login and authentication</a>). <strong>Authorization</strong> answers "what may you do?". This note is only about the second: once you know who the user is, how to decide whether they may read, edit or delete that thing.</>} /></p>
        <p><T pt={<>Falhas de autorização são a categoria nº 1 do <a href="/notas/owasp-top-10/">OWASP Top 10</a> (Broken Access Control). Por isso a regra de ouro é: <strong>negar por padrão e checar no servidor, em toda requisição</strong>. Esconder um botão na interface não protege nada.</>} en={<>Authorization failures are the #1 category of the <a href="/notas/owasp-top-10/">OWASP Top 10</a> (Broken Access Control). So the golden rule is: <strong>deny by default and check on the server, on every request</strong>. Hiding a button in the UI protects nothing.</>} /></p>
      </Section>

      <Section id="rbac" title={<T pt="RBAC: papéis e permissões" en="RBAC: roles and permissions" />}>
        <p><T pt={<>No <strong>RBAC</strong> (role-based access control) o usuário recebe <em>papéis</em> e cada papel agrupa <em>permissões</em>. Você nunca dá permissão direto à pessoa: dá um papel. Trocar de cargo é trocar de papel.</>} en={<>In <strong>RBAC</strong> (role-based access control) a user gets <em>roles</em> and each role bundles <em>permissions</em>. You never give a permission straight to a person: you give a role. Changing jobs means changing roles.</>} /></p>
        <Table
          head={[<T pt="Papel" en="Role" />, <code>invoice:read</code>, <code>invoice:create</code>, <code>invoice:delete</code>, <code>member:invite</code>]}
          rows={[
            [<code>viewer</code>, "✓", "", "", ""],
            [<code>editor</code>, "✓", "✓", "", ""],
            [<code>admin</code>, "✓", "✓", "✓", "✓"],
          ]}
        />
        <p><T pt={<>Nomeie permissões como <code>recurso:ação</code> e verifique <strong>permissões</strong> no código, nunca papéis. <code>can(user, "invoice:delete")</code> sobrevive quando você cria o papel <code>finance</code>; <code>if (user.role === "admin")</code> não.</>} en={<>Name permissions <code>resource:action</code> and check <strong>permissions</strong> in code, never roles. <code>can(user, "invoice:delete")</code> survives when you add a <code>finance</code> role; <code>if (user.role === "admin")</code> does not.</>} /></p>
        <h3><T pt="Onde o RBAC é suficiente e onde falha" en="Where RBAC is enough and where it fails" /></h3>
        <ul>
          <li><T pt="Serve: painéis administrativos, equipes pequenas, 3 a 6 papéis fixos." en="Fits: admin panels, small teams, 3 to 6 fixed roles." /></li>
          <li><T pt={<>Falha: "o editor só edita <em>os próprios</em> documentos", "gerente aprova até R$ 5.000", "só em horário comercial". Resolver isso com papéis gera explosão de papéis (<code>editor-do-time-a</code>, <code>gerente-ate-5k</code>…).</>} en={<>Fails: "the editor may only edit <em>their own</em> documents", "a manager approves up to $5,000", "business hours only". Solving that with roles causes role explosion (<code>editor-of-team-a</code>, <code>manager-up-to-5k</code>…).</>} /></li>
        </ul>
      </Section>

      <Section id="abac" title={<T pt="ABAC: regras por atributos" en="ABAC: attribute rules" />}>
        <p><T pt={<>No <strong>ABAC</strong> (attribute-based access control) a decisão é uma regra sobre atributos de quatro coisas: o <em>sujeito</em> (departamento, nível), o <em>recurso</em> (dono, status, valor), a <em>ação</em> e o <em>ambiente</em> (hora, IP). Exemplos de regra:</>} en={<>In <strong>ABAC</strong> (attribute-based access control) the decision is a rule over attributes of four things: the <em>subject</em> (department, level), the <em>resource</em> (owner, status, amount), the <em>action</em> and the <em>environment</em> (time, IP). Example rules:</>} /></p>
        <ul>
          <li><T pt={<><code>resource.ownerId == subject.id</code>: só o dono edita.</>} en={<><code>resource.ownerId == subject.id</code>: only the owner edits.</>} /></li>
          <li><T pt={<><code>resource.status != "closed"</code>: ninguém edita pedido fechado.</>} en={<><code>resource.status != "closed"</code>: nobody edits a closed order.</>} /></li>
          <li><T pt={<><code>resource.amount &lt;= subject.approvalLimit</code>: aprova até o próprio limite.</>} en={<><code>resource.amount &lt;= subject.approvalLimit</code>: approves up to their own limit.</>} /></li>
        </ul>
        <Table
          head={["", "RBAC", "ABAC"]}
          rows={[
            [<T pt="Pergunta" en="Question" />, <T pt="Que papel você tem?" en="What role do you have?" />, <T pt="Os atributos satisfazem a regra?" en="Do the attributes satisfy the rule?" />],
            [<T pt="Granularidade" en="Granularity" />, <T pt="grossa (tipo de recurso)" en="coarse (resource type)" />, <T pt="fina (cada instância e contexto)" en="fine (each instance and context)" />],
            [<T pt="Simplicidade" en="Simplicity" />, <T pt="fácil de explicar e auditar" en="easy to explain and audit" />, <T pt="mais flexível, mais difícil de auditar" en="more flexible, harder to audit" />],
            [<T pt="Risco" en="Risk" />, <T pt="explosão de papéis" en="role explosion" />, <T pt="regras espalhadas e conflitantes" en="scattered, conflicting rules" />],
          ]}
        />
      </Section>

      <Section id="combine" title={<T pt="Combinando os dois: uma função can()" en="Combining both: one can() function" />}>
        <p><T pt={<>O desenho que funciona na prática: <strong>RBAC responde "esse tipo de usuário pode tentar essa ação?"</strong> e <strong>ABAC refina "neste recurso específico, agora?"</strong>. Tudo passa por uma única função, usada por todas as rotas, jobs e consultas. Assim a política vive num lugar só e dá para testá-la.</>} en={<>The design that works in practice: <strong>RBAC answers "may this kind of user attempt this action?"</strong> and <strong>ABAC refines "on this specific resource, right now?"</strong>. Everything goes through a single function used by every route, job and query. The policy lives in one place and can be tested.</>} /></p>
        <CodeBlock code={`type Action = 'invoice:read' | 'invoice:update' | 'invoice:delete';

interface Subject  { id: string; tenantId: string; permissions: Set<Action> }
interface Resource { tenantId: string; ownerId: string; status: 'draft' | 'sent' | 'closed' }

// ABAC rules: extra conditions per action, evaluated on the concrete resource
const rules: Partial<Record<Action, (s: Subject, r: Resource) => boolean>> = {
  'invoice:update': (s, r) => r.status !== 'closed' && r.ownerId === s.id,
  'invoice:delete': (_s, r) => r.status === 'draft',
};

export function can(subject: Subject, action: Action, resource: Resource): boolean {
  if (subject.tenantId !== resource.tenantId) return false; // never cross tenants
  if (!subject.permissions.has(action)) return false;       // RBAC: coarse gate
  const rule = rules[action];
  return rule ? rule(subject, resource) : true;              // ABAC: fine gate
}`} />
        <p><T pt={<>Note a primeira linha: em um app multi-tenant, a checagem de tenant vem antes de tudo (veja <a href="/notas/multi-tenant-saas/">Multi-tenant</a>). Note também que o padrão é negar: se a permissão não existe, retorna <code>false</code>.</>} en={<>Note the first line: in a multi-tenant app the tenant check comes before everything (see <a href="/notas/multi-tenant-saas/">Multi-tenant</a>). Note too that the default is deny: if the permission is missing, it returns <code>false</code>.</>} /></p>
      </Section>

      <Section id="model" title={<T pt="Modelo de dados" en="Data model" />}>
        <CodeBlock code={`CREATE TABLE roles (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,                        -- NULL = built-in role shared by all tenants
  name      text NOT NULL
);

CREATE TABLE role_permissions (
  role_id    uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission text NOT NULL,              -- 'invoice:delete'
  PRIMARY KEY (role_id, permission)
);

-- A user can have different roles in different tenants (the membership)
CREATE TABLE memberships (
  user_id   uuid NOT NULL,
  tenant_id uuid NOT NULL,
  role_id   uuid NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, tenant_id)
);`} />
        <p><T pt={<>O papel pertence à <strong>associação</strong> (usuário + tenant), não ao usuário: a mesma pessoa pode ser <code>admin</code> na empresa A e <code>viewer</code> na B. Carregue as permissões uma vez por requisição, a partir da associação, e coloque no objeto <code>subject</code>. Se usar JWT, guarde só o <code>tenantId</code> e o id do usuário e busque as permissões no banco (ou num cache curto): permissões dentro do token ficam velhas até ele expirar.</>} en={<>The role belongs to the <strong>membership</strong> (user + tenant), not to the user: the same person can be <code>admin</code> at company A and <code>viewer</code> at B. Load permissions once per request from the membership and put them on the <code>subject</code> object. If you use a JWT, store only the <code>tenantId</code> and user id and fetch permissions from the database (or a short cache): permissions inside the token go stale until it expires.</>} /></p>
      </Section>

      <Section id="build" title={<T pt="Como construir no app" en="How to build it in the app" />}>
        <ol>
          <li><T pt="Liste os recursos e ações (invoice:read, member:invite…). Comece pequeno." en="List resources and actions (invoice:read, member:invite…). Start small." /></li>
          <li><T pt="Defina 3 a 5 papéis padrão e mapeie para permissões em um arquivo ou seed." en="Define 3 to 5 default roles and map them to permissions in a file or seed." /></li>
          <li><T pt="Escreva can() e seus testes antes das rotas." en="Write can() and its tests before the routes." /></li>
          <li><T pt="Crie um middleware que autentica, carrega a associação e monta o subject." en="Create a middleware that authenticates, loads the membership and builds the subject." /></li>
          <li><T pt="Em cada rota: carregue o recurso, chame can(), responda 403 (ou 404 para não revelar que existe)." en="In each route: load the resource, call can(), answer 403 (or 404 so as not to reveal it exists)." /></li>
          <li><T pt="Para listas, filtre na consulta (WHERE tenant_id = …, owner_id = …) em vez de carregar tudo e filtrar em memória." en="For lists, filter in the query (WHERE tenant_id = …, owner_id = …) instead of loading everything and filtering in memory." /></li>
          <li><T pt="Exponha as permissões ao front (GET /me) só para esconder botões; o servidor continua sendo a autoridade." en="Expose permissions to the front end (GET /me) only to hide buttons; the server stays the authority." /></li>
        </ol>
        <CodeBlock code={`app.delete('/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await db.invoice.findById(req.params.id);
  if (!invoice || invoice.tenantId !== req.subject.tenantId) return res.sendStatus(404);
  if (!can(req.subject, 'invoice:delete', invoice)) return res.sendStatus(403);
  await db.invoice.delete(invoice.id);
  await audit.log(req.subject.id, 'invoice:delete', invoice.id);   // who did what
  res.sendStatus(204);
});`} />
        <h3><T pt="Testes" en="Tests" /></h3>
        <p><T pt="Teste a política como uma tabela: para cada papel e ação, o resultado esperado, incluindo os casos de negação (outro tenant, recurso fechado, sem permissão)." en="Test the policy as a table: for each role and action, the expected result, including denial cases (other tenant, closed resource, missing permission)." /></p>
        <CodeBlock code={`test.each([
  ['viewer', 'invoice:update', 'draft',  false],
  ['editor', 'invoice:update', 'draft',  true],
  ['editor', 'invoice:update', 'closed', false],
])('%s %s on %s -> %s', (role, action, status, expected) => {
  expect(can(subjectWithRole(role), action, invoiceOf({ status }))).toBe(expected);
});`} />
      </Section>

      <Section id="tools" title={<T pt="Quando usar uma biblioteca ou serviço" en="When to use a library or service" />}>
        <p><T pt="Comece com a função acima. Migre quando as regras ficarem numerosas, mudarem sem deploy ou virarem um grafo de relações:" en="Start with the function above. Move on when rules become numerous, must change without a deploy, or turn into a graph of relationships:" /></p>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Ideia" en="Idea" />]}
          rows={[
            ["Casbin", <T pt="biblioteca de política (RBAC/ABAC) em várias linguagens, modelo em arquivo" en="policy library (RBAC/ABAC) in many languages, model in a file" />],
            ["Cedar", <T pt="linguagem de política da AWS; regras legíveis e analisáveis" en="AWS policy language; readable, analysable rules" />],
            ["OPA (Rego)", <T pt="motor de política geral, comum em infraestrutura e Kubernetes" en="general policy engine, common in infrastructure and Kubernetes" />],
            ["OpenFGA / SpiceDB", <T pt={<>ReBAC (estilo Google Zanzibar): "pode editar quem é membro da pasta que contém o documento"</>} en={<>ReBAC (Google Zanzibar style): "may edit if a member of the folder that contains the document"</>} />],
          ]}
        />
      </Section>

      <Section id="mistakes" title={<T pt="Erros comuns e cola" en="Common mistakes and cheat sheet" />}>
        <ul>
          <li><T pt={<><strong>IDOR:</strong> <code>GET /invoices/123</code> devolve a fatura de outro usuário porque só se checou "está logado". Sempre cheque o recurso concreto.</>} en={<><strong>IDOR:</strong> <code>GET /invoices/123</code> returns another user's invoice because only "is logged in" was checked. Always check the concrete resource.</>} /></li>
          <li><T pt="Checar só na interface, ou só no gateway da API, e esquecer jobs, exports e webhooks." en="Checking only in the UI, or only at the API gateway, and forgetting jobs, exports and webhooks." /></li>
          <li><T pt={<>Aceitar <code>role</code> ou <code>tenantId</code> vindo do corpo da requisição (mass assignment). Eles vêm da sessão.</>} en={<>Accepting <code>role</code> or <code>tenantId</code> from the request body (mass assignment). They come from the session.</>} /></li>
          <li><T pt="Permissões em JWT longo: o usuário rebaixado continua com poder até o token expirar." en="Permissions in a long-lived JWT: a demoted user keeps power until the token expires." /></li>
          <li><T pt="Sem trilha de auditoria de ações sensíveis e de mudanças de papel." en="No audit trail of sensitive actions and role changes." /></li>
          <li><T pt="Sempre deve existir pelo menos um admin: bloqueie remover o último." en="There must always be at least one admin: block removing the last one." /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>Teste de mesa: faça login como usuário comum e chame, via <code>curl</code>, as rotas de admin e os IDs de outro tenant. Se algo voltar 200, a política tem um buraco.</>} en={<>Desk test: log in as a regular user and call the admin routes and another tenant's IDs with <code>curl</code>. If anything returns 200, the policy has a hole.</>} /></Callout>
      </Section>

      <Sources
        links={[
          { label: "NIST: Role Based Access Control", href: "https://csrc.nist.gov/projects/role-based-access-control" },
          { label: "NIST SP 800-162: Guide to ABAC", href: "https://csrc.nist.gov/pubs/sp/800/162/upd2/final" },
          { label: "OWASP: Authorization Cheat Sheet", href: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" },
          { label: "OWASP Top 10: A01 Broken Access Control", href: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/" },
          { label: "Casbin", href: "https://casbin.org/docs/overview" },
          { label: "Cedar", href: "https://www.cedarpolicy.com/" },
          { label: "OpenFGA", href: "https://openfga.dev/docs" },
        ]}
      />
    </>
  );
}
