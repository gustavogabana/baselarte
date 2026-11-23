import { Callout, CodeBlock, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "rbac-abac",
  title: "Autorização: RBAC e ABAC",
  seo: {
    title: "Autorização: RBAC, ABAC e como combinar os dois",
    description: "O que são RBAC e ABAC, quando cada um serve, como modelar papéis, permissões e políticas no Postgres, uma única função can() para o app inteiro, testes e os erros que causam controle de acesso quebrado.",
  },
  summary: "o que são controle de acesso por papel (RBAC) e por atributo (ABAC), quando usar cada um, como modelar papéis, permissões e políticas no Postgres, uma função can() central, como testar e os erros comuns (IDOR, checagem só na interface).",
  kicker: "Guia de estudo",
  heroTitle: <>Quem pode fazer o quê, <em>decidido num só lugar.</em></>,
  heroLede: "RBAC dá papéis às pessoas; ABAC decide com os atributos da pessoa, do recurso e da situação. A maioria dos apps reais usa RBAC para a parte grossa e algumas regras ABAC para o resto.",
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: "Autenticação x autorização" },
        { id: "rbac", title: "RBAC: papéis e permissões" },
        { id: "abac", title: "ABAC: regras por atributos" },
        { id: "combine", title: "Combinando os dois: uma função can()" },
        { id: "model", title: "Modelo de dados" },
        { id: "build", title: "Como construir no app" },
        { id: "tools", title: "Quando usar uma biblioteca ou serviço" },
        { id: "mistakes", title: "Erros comuns e cola" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"Autenticação x autorização"}>
        <p><strong>Autenticação</strong> responde "quem é você?" (senha, SSO, OIDC; veja <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>). <strong>Autorização</strong> responde "o que você pode fazer?". Esta nota é só sobre a segunda: depois de saber quem é o usuário, como decidir se ele pode ler, editar ou apagar aquilo.</p>
        <p>Falhas de autorização são a categoria nº 1 do <a href="/notas/owasp-top-10/">OWASP Top 10</a> (Broken Access Control). Por isso a regra de ouro é: <strong>negar por padrão e checar no servidor, em toda requisição</strong>. Esconder um botão na interface não protege nada.</p>
      </Section>

      <Section id="rbac" title={"RBAC: papéis e permissões"}>
        <p>No <strong>RBAC</strong> (role-based access control) o usuário recebe <em>papéis</em> e cada papel agrupa <em>permissões</em>. Você nunca dá permissão direto à pessoa: dá um papel. Trocar de cargo é trocar de papel.</p>
        <Table
          head={["Papel", <code>invoice:read</code>, <code>invoice:create</code>, <code>invoice:delete</code>, <code>member:invite</code>]}
          rows={[
            [<code>viewer</code>, "✓", "", "", ""],
            [<code>editor</code>, "✓", "✓", "", ""],
            [<code>admin</code>, "✓", "✓", "✓", "✓"],
          ]}
        />
        <p>Nomeie permissões como <code>recurso:ação</code> e verifique <strong>permissões</strong> no código, nunca papéis. <code>can(user, "invoice:delete")</code> sobrevive quando você cria o papel <code>finance</code>; <code>if (user.role === "admin")</code> não.</p>
        <h3>Onde o RBAC é suficiente e onde falha</h3>
        <ul>
          <li>Serve: painéis administrativos, equipes pequenas, 3 a 6 papéis fixos.</li>
          <li>Falha: "o editor só edita <em>os próprios</em> documentos", "gerente aprova até R$ 5.000", "só em horário comercial". Resolver isso com papéis gera explosão de papéis (<code>editor-do-time-a</code>, <code>gerente-ate-5k</code>…).</li>
        </ul>
      </Section>

      <Section id="abac" title={"ABAC: regras por atributos"}>
        <p>No <strong>ABAC</strong> (attribute-based access control) a decisão é uma regra sobre atributos de quatro coisas: o <em>sujeito</em> (departamento, nível), o <em>recurso</em> (dono, status, valor), a <em>ação</em> e o <em>ambiente</em> (hora, IP). Exemplos de regra:</p>
        <ul>
          <li><code>resource.ownerId == subject.id</code>: só o dono edita.</li>
          <li><code>resource.status != "closed"</code>: ninguém edita pedido fechado.</li>
          <li><code>resource.amount &lt;= subject.approvalLimit</code>: aprova até o próprio limite.</li>
        </ul>
        <Table
          head={["", "RBAC", "ABAC"]}
          rows={[
            ["Pergunta", "Que papel você tem?", "Os atributos satisfazem a regra?"],
            ["Granularidade", "grossa (tipo de recurso)", "fina (cada instância e contexto)"],
            ["Simplicidade", "fácil de explicar e auditar", "mais flexível, mais difícil de auditar"],
            ["Risco", "explosão de papéis", "regras espalhadas e conflitantes"],
          ]}
        />
      </Section>

      <Section id="combine" title={"Combinando os dois: uma função can()"}>
        <p>O desenho que funciona na prática: <strong>RBAC responde "esse tipo de usuário pode tentar essa ação?"</strong> e <strong>ABAC refina "neste recurso específico, agora?"</strong>. Tudo passa por uma única função, usada por todas as rotas, jobs e consultas. Assim a política vive num lugar só e dá para testá-la.</p>
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
        <p>Note a primeira linha: em um app multi-tenant, a checagem de tenant vem antes de tudo (veja <a href="/notas/multi-tenant-saas/">Multi-tenant</a>). Note também que o padrão é negar: se a permissão não existe, retorna <code>false</code>.</p>
      </Section>

      <Section id="model" title={"Modelo de dados"}>
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
        <p>O papel pertence à <strong>associação</strong> (usuário + tenant), não ao usuário: a mesma pessoa pode ser <code>admin</code> na empresa A e <code>viewer</code> na B. Carregue as permissões uma vez por requisição, a partir da associação, e coloque no objeto <code>subject</code>. Se usar JWT, guarde só o <code>tenantId</code> e o id do usuário e busque as permissões no banco (ou num cache curto): permissões dentro do token ficam velhas até ele expirar.</p>
      </Section>

      <Section id="build" title={"Como construir no app"}>
        <ol>
          <li>Liste os recursos e ações (invoice:read, member:invite…). Comece pequeno.</li>
          <li>Defina 3 a 5 papéis padrão e mapeie para permissões em um arquivo ou seed.</li>
          <li>Escreva can() e seus testes antes das rotas.</li>
          <li>Crie um middleware que autentica, carrega a associação e monta o subject.</li>
          <li>Em cada rota: carregue o recurso, chame can(), responda 403 (ou 404 para não revelar que existe).</li>
          <li>Para listas, filtre na consulta (WHERE tenant_id = …, owner_id = …) em vez de carregar tudo e filtrar em memória.</li>
          <li>Exponha as permissões ao front (GET /me) só para esconder botões; o servidor continua sendo a autoridade.</li>
        </ol>
        <CodeBlock code={`app.delete('/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await db.invoice.findById(req.params.id);
  if (!invoice || invoice.tenantId !== req.subject.tenantId) return res.sendStatus(404);
  if (!can(req.subject, 'invoice:delete', invoice)) return res.sendStatus(403);
  await db.invoice.delete(invoice.id);
  await audit.log(req.subject.id, 'invoice:delete', invoice.id);   // who did what
  res.sendStatus(204);
});`} />
        <h3>Testes</h3>
        <p>Teste a política como uma tabela: para cada papel e ação, o resultado esperado, incluindo os casos de negação (outro tenant, recurso fechado, sem permissão).</p>
        <CodeBlock code={`test.each([
  ['viewer', 'invoice:update', 'draft',  false],
  ['editor', 'invoice:update', 'draft',  true],
  ['editor', 'invoice:update', 'closed', false],
])('%s %s on %s -> %s', (role, action, status, expected) => {
  expect(can(subjectWithRole(role), action, invoiceOf({ status }))).toBe(expected);
});`} />
      </Section>

      <Section id="tools" title={"Quando usar uma biblioteca ou serviço"}>
        <p>Comece com a função acima. Migre quando as regras ficarem numerosas, mudarem sem deploy ou virarem um grafo de relações:</p>
        <Table
          head={["Ferramenta", "Ideia"]}
          rows={[
            ["Casbin", "biblioteca de política (RBAC/ABAC) em várias linguagens, modelo em arquivo"],
            ["Cedar", "linguagem de política da AWS; regras legíveis e analisáveis"],
            ["OPA (Rego)", "motor de política geral, comum em infraestrutura e Kubernetes"],
            ["OpenFGA / SpiceDB", <>ReBAC (estilo Google Zanzibar): "pode editar quem é membro da pasta que contém o documento"</>],
          ]}
        />
      </Section>

      <Section id="mistakes" title={"Erros comuns e cola"}>
        <ul>
          <li><strong>IDOR:</strong> <code>GET /invoices/123</code> devolve a fatura de outro usuário porque só se checou "está logado". Sempre cheque o recurso concreto.</li>
          <li>Checar só na interface, ou só no gateway da API, e esquecer jobs, exports e webhooks.</li>
          <li>Aceitar <code>role</code> ou <code>tenantId</code> vindo do corpo da requisição (mass assignment). Eles vêm da sessão.</li>
          <li>Permissões em JWT longo: o usuário rebaixado continua com poder até o token expirar.</li>
          <li>Sem trilha de auditoria de ações sensíveis e de mudanças de papel.</li>
          <li>Sempre deve existir pelo menos um admin: bloqueie remover o último.</li>
        </ul>
        <Callout tone="warn" icon="alert">Teste de mesa: faça login como usuário comum e chame, via <code>curl</code>, as rotas de admin e os IDs de outro tenant. Se algo voltar 200, a política tem um buraco.</Callout>
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
