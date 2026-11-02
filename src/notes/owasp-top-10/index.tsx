import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "owasp-top-10",
  title: { en: "OWASP Top 10 (2025): how apps break and what to do about it", pt: "OWASP Top 10 (2025): como os apps quebram e o que fazer" },
  seo: {
    title: { en: "OWASP Top 10 (2025): how apps break and how to protect yours", pt: "OWASP Top 10 (2025): como os apps quebram e como proteger o seu" },
    description: { en: "A practical guide to the OWASP Top 10:2025: each risk with an example of the flaw, the fix that matters and an action plan with checklists to protect a web application.", pt: "Um guia prático do OWASP Top 10:2025: cada risco com um exemplo da falha, a correção que importa e um plano de ação com listas de verificação para proteger uma aplicação web." },
  },
  summary: "how apps break and what to do about it](https://baselarte.com/notas/owasp-top-10/): the ten OWASP Top 10:2025 risks (broken access control, security misconfiguration, software supply chain failures, cryptographic failures, injection, insecure design, authentication failures, software or data integrity failures, logging and alerting failures, mishandling of exceptional conditions), each with an example of the flaw, the fix that matters, a 1-hour/week/month action plan, a single-endpoint audit activity and OWASP sources.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>OWASP Top 10 (2025): <em>how apps break and what to do about it.</em></>, pt: <>OWASP Top 10 (2025): <em>como os apps quebram e o que fazer.</em></> },
  heroLede: { en: "The ten most common web application risks according to OWASP, each with a short example of the flaw, the fix that matters and a checklist you can apply to your own app this week.", pt: "Os dez riscos mais comuns em aplicações web segundo a OWASP, cada um com um exemplo curto da falha, a correção que importa e uma lista que você pode aplicar ao seu app ainda esta semana." },
  published: "2026-10-28",
  updated: "2026-10-28",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é o Top 10" en="What the Top 10 is" /> },
        { id: "list", title: <T pt="A lista de 2025 de relance" en="The 2025 list at a glance" /> },
        { id: "a01", title: <T pt="A01: Controle de acesso quebrado" en="A01: Broken access control" /> },
        { id: "a02", title: <T pt="A02: Configuração incorreta de segurança" en="A02: Security misconfiguration" /> },
        { id: "a03", title: <T pt="A03: Falhas na cadeia de suprimentos" en="A03: Software supply chain failures" /> },
        { id: "a04", title: <T pt="A04: Falhas criptográficas" en="A04: Cryptographic failures" /> },
        { id: "a05", title: <T pt="A05: Injeção" en="A05: Injection" /> },
        { id: "a06", title: <T pt="A06: Design inseguro" en="A06: Insecure design" /> },
        { id: "a07", title: <T pt="A07: Falhas de autenticação" en="A07: Authentication failures" /> },
        { id: "a08", title: <T pt="A08: Integridade de software e dados" en="A08: Software or data integrity failures" /> },
        { id: "a09", title: <T pt="A09: Falhas de log e alerta" en="A09: Logging and alerting failures" /> },
        { id: "a10", title: <T pt="A10: Tratamento de condições excepcionais" en="A10: Mishandling of exceptional conditions" /> },
        { id: "plan", title: <T pt="Plano de ação para o seu app" en="Action plan for your app" /> },
        { id: "cheat-ow", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é o Top 10" en="What the Top 10 is" />}>
        <p><T pt="O OWASP Top 10 é um documento de conscientização da Open Worldwide Application Security Project: as dez categorias de risco mais críticas em aplicações web, montadas a partir de dados de testes de segurança reais e de uma pesquisa com a comunidade. A edição mais recente é a de 2025. Ele não é uma lista de tudo que pode dar errado nem um padrão de conformidade; é um ponto de partida para decidir o que corrigir primeiro." en="The OWASP Top 10 is an awareness document from the Open Worldwide Application Security Project: the ten most critical risk categories for web applications, built from real security-testing data and a community survey. The latest edition is 2025. It is not a list of everything that can go wrong nor a compliance standard; it is a starting point for deciding what to fix first." /></p>
        <Callout icon="check"><T pt={<><strong>Como usar:</strong> uma categoria é um <em>grupo</em> de falhas (CWEs), não uma falha só. Leia cada seção como “o que procurar no meu código” e “qual controle impede”. Para cabeçalhos HTTP, SQL injection e XSS em detalhe, veja as notas de segurança já publicadas aqui.</>} en={<><strong>How to use it:</strong> a category is a <em>group</em> of flaws (CWEs), not a single flaw. Read each section as “what to look for in my code” and “which control stops it”. For HTTP headers, SQL injection and XSS in depth, see the other security notes published here.</>} /></Callout>
      </Section>
      <Section id="list" title={<T pt="A lista de 2025 de relance" en="The 2025 list at a glance" />}>
        <Table
          head={["ID", <T pt="Categoria" en="Category" />, <T pt="Defesa principal" en="Main defence" />]}
          rows={[
            ["A01", "Broken Access Control", <T pt="Checar permissão no servidor, em toda requisição, negando por padrão" en="Check permission on the server, on every request, deny by default" />],
            ["A02", "Security Misconfiguration", <T pt="Configuração segura repetível, sem padrões nem debug em produção" en="Repeatable secure configuration, no defaults or debug in production" />],
            ["A03", "Software Supply Chain Failures", <T pt="Lockfile, SBOM, varredura de dependências, CI com permissões mínimas" en="Lockfile, SBOM, dependency scanning, least-privilege CI" />],
            ["A04", "Cryptographic Failures", <T pt="TLS em tudo, algoritmos modernos, hash de senha lento, chaves fora do código" en="TLS everywhere, modern algorithms, slow password hashing, keys outside code" />],
            ["A05", "Injection", <T pt="Consultas parametrizadas e codificação de saída" en="Parameterised queries and output encoding" />],
            ["A06", "Insecure Design", <T pt="Modelagem de ameaças e limites de abuso desde o projeto" en="Threat modelling and abuse limits from the design stage" />],
            ["A07", "Authentication Failures", <T pt="MFA, proteção contra força bruta, sessões seguras" en="MFA, brute-force protection, secure sessions" />],
            ["A08", "Software or Data Integrity Failures", <T pt="Verificar assinatura e origem de código e dados; evitar desserialização insegura" en="Verify signature and origin of code and data; avoid unsafe deserialisation" />],
            ["A09", "Security Logging and Alerting Failures", <T pt="Registrar eventos de segurança e alertar de verdade" en="Log security events and actually alert on them" />],
            ["A10", "Mishandling of Exceptional Conditions", <T pt="Falhar de forma fechada, tratar todos os erros, não vazar detalhes" en="Fail closed, handle every error, leak no details" />],
          ]}
        />
        <p><T pt="Em relação à edição de 2021, a de 2025 mantém o controle de acesso quebrado em primeiro lugar (a SSRF, antes categoria própria, foi incorporada a ele), sobe a configuração incorreta para o segundo lugar, amplia “componentes vulneráveis” para falhas na cadeia de suprimentos e acrescenta o tratamento de condições excepcionais. Confira a lista oficial para os detalhes de cada mudança." en="Compared with 2021, the 2025 edition keeps broken access control first (SSRF, previously its own category, was folded into it), moves misconfiguration up to second, widens “vulnerable components” into supply chain failures and adds the mishandling of exceptional conditions. Check the official list for the details of each change." /></p>
      </Section>
      <Section id="a01" title={<T pt="A01: Controle de acesso quebrado" en="A01: Broken access control" />}>
        <p><T pt={<><strong>A falha:</strong> o usuário consegue fazer ou ver o que não deveria. Exemplo clássico: <code>GET /api/faturas/1042</code> devolve a fatura de outra pessoa quando você troca o número (IDOR). Também entram aqui acesso a rotas de admin sem checar o papel, CORS aberto demais e SSRF, quando o servidor busca uma URL escolhida pelo atacante (por exemplo o endereço de metadados da nuvem).</>} en={<><strong>The flaw:</strong> the user can do or see what they should not. Classic example: <code>GET /api/invoices/1042</code> returns someone else’s invoice when you change the number (IDOR). Also here: admin routes without a role check, overly open CORS and SSRF, when the server fetches a URL chosen by the attacker (for example the cloud metadata address).</>} /></p>
        <CodeBlock code={`// ruim: confia no id da URL
app.get('/api/invoices/:id', auth, async (req, res) => {
  res.json(await db.invoice.findById(req.params.id));
});

// bom: o dono vem da sessão, não do cliente
app.get('/api/invoices/:id', auth, async (req, res) => {
  const inv = await db.invoice.findOne({ id: req.params.id, ownerId: req.user.id });
  if (!inv) return res.sendStatus(404);
  res.json(inv);
});`} />
        <ul className="ds-list">
          <li><T pt={<>Negar por padrão; liberar por papel e por dono do recurso, <strong>no servidor</strong>. Esconder o botão no front não é controle.</>} en={<>Deny by default; allow by role and by resource owner, <strong>on the server</strong>. Hiding the button in the front end is not a control.</>} /></li>
          <li><T pt={<>Centralizar a checagem (middleware ou política) em vez de repetir <code>if</code> em cada rota.</>} en={<>Centralise the check (middleware or policy) instead of repeating <code>if</code> in every route.</>} /></li>
          <li><T pt="Contra SSRF: lista de destinos permitidos, bloquear IPs internos e de metadados, não seguir redirecionamentos às cegas." en="Against SSRF: allow-list of destinations, block internal and metadata IPs, do not follow redirects blindly." /></li>
          <li><T pt="Testes automáticos: “o usuário A não lê o recurso do usuário B” para cada endpoint." en="Automated tests: “user A cannot read user B’s resource” for each endpoint." /></li>
        </ul>
      </Section>
      <Section id="a02" title={<T pt="A02: Configuração incorreta de segurança" en="A02: Security misconfiguration" />}>
        <p><T pt={<><strong>A falha:</strong> o software é seguro, a configuração não. Senhas padrão, bucket público, modo debug ligado, listagem de diretório, mensagens de erro com stack trace, cabeçalhos de segurança ausentes, portas abertas à toa, permissões amplas demais na nuvem.</>} en={<><strong>The flaw:</strong> the software is secure, the configuration is not. Default passwords, public buckets, debug mode on, directory listing, error messages with stack traces, missing security headers, needlessly open ports, overly broad cloud permissions.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Definir a configuração como código (Terraform, Docker, Nginx versionados) e revisar em PR; o mesmo molde para dev, teste e produção, mudando só os segredos." en="Define configuration as code (Terraform, Docker, Nginx under version control) and review it in PRs; the same template for dev, test and production, changing only the secrets." /></li>
          <li><T pt="Remover o que não é usado: contas, rotas de exemplo, portas, recursos e funcionalidades." en="Remove what is unused: accounts, sample routes, ports, features." /></li>
          <li><T pt="Cabeçalhos HTTP e CSP: veja a nota de segurança de apps web. Parsers de XML sem entidades externas (XXE) também ficam aqui." en="HTTP headers and CSP: see the web app security note. XML parsers with external entities disabled (XXE) also belong here." /></li>
          <li><T pt="Varrer a infraestrutura com regularidade (por exemplo, um scanner de IaC no CI) e alertar em desvio de configuração." en="Scan infrastructure regularly (for example an IaC scanner in CI) and alert on configuration drift." /></li>
        </ul>
      </Section>
      <Section id="a03" title={<T pt="A03: Falhas na cadeia de suprimentos" en="A03: Software supply chain failures" />}>
        <p><T pt={<><strong>A falha:</strong> o problema vem de código que você não escreveu: dependências vulneráveis ou desatualizadas, pacote malicioso com nome parecido (typosquatting), mantenedor comprometido, imagem de contêiner adulterada, pipeline de CI que roda código não confiável com acesso a segredos.</>} en={<><strong>The flaw:</strong> the problem comes from code you did not write: vulnerable or outdated dependencies, a malicious package with a look-alike name (typosquatting), a compromised maintainer, a tampered container image, a CI pipeline running untrusted code with access to secrets.</>} /></p>
        <CodeBlock code={`npm ci                 # instala exatamente o lockfile
npm audit --omit=dev   # vulnerabilidades conhecidas
pip-audit              # equivalente em Python
trivy fs .             # dependências e IaC no repositório`} />
        <ul className="ds-list">
          <li><T pt={<>Versionar o lockfile e instalar com <code>npm ci</code>/equivalente; fixar imagens por digest.</>} en={<>Commit the lockfile and install with <code>npm ci</code>/equivalent; pin images by digest.</>} /></li>
          <li><T pt="Automatizar atualizações (Dependabot ou Renovate) e varredura no CI; ter um prazo para corrigir vulnerabilidades críticas." en="Automate updates (Dependabot or Renovate) and scan in CI; set a deadline for fixing critical vulnerabilities." /></li>
          <li><T pt="Gerar um SBOM (lista de componentes) e saber o que está em produção." en="Generate an SBOM (component list) and know what runs in production." /></li>
          <li><T pt="No CI: permissões mínimas no token, ações de terceiros fixadas por commit, segredos nunca expostos a PRs de forks, credenciais de nuvem por OIDC em vez de chaves longas." en="In CI: minimal token permissions, third-party actions pinned by commit, secrets never exposed to fork PRs, cloud credentials via OIDC instead of long-lived keys." /></li>
          <li><T pt="Antes de adicionar uma dependência, pergunte se precisa dela; menos pacotes, menos superfície." en="Before adding a dependency, ask whether you need it; fewer packages, less surface." /></li>
        </ul>
      </Section>
      <Section id="a04" title={<T pt="A04: Falhas criptográficas" en="A04: Cryptographic failures" />}>
        <p><T pt={<><strong>A falha:</strong> dado sensível sem proteção ou com cripto fraca: tráfego em HTTP, senha com MD5/SHA-1 sem sal, algoritmos antigos, chaves no repositório, números aleatórios previsíveis (<code>Math.random()</code> para tokens), certificados sem validação.</>} en={<><strong>The flaw:</strong> sensitive data unprotected or protected by weak crypto: HTTP traffic, passwords hashed with MD5/SHA-1 without salt, old algorithms, keys in the repository, predictable random numbers (<code>Math.random()</code> for tokens), unvalidated certificates.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Classificar os dados e guardar só o necessário; o que não existe não vaza." en="Classify data and keep only what is needed; what does not exist cannot leak." /></li>
          <li><T pt="TLS 1.2+ em tudo, com HSTS; cifrar em repouso os dados sensíveis (disco, banco, backup)." en="TLS 1.2+ everywhere, with HSTS; encrypt sensitive data at rest (disk, database, backup)." /></li>
          <li><T pt={<>Senhas: Argon2id, scrypt ou bcrypt (nunca SHA simples). Tokens: gerador criptográfico (<code>crypto.randomBytes</code>, <code>secrets.token_urlsafe</code>).</>} en={<>Passwords: Argon2id, scrypt or bcrypt (never plain SHA). Tokens: a cryptographic generator (<code>crypto.randomBytes</code>, <code>secrets.token_urlsafe</code>).</>} /></li>
          <li><T pt="Chaves em um gerenciador de segredos (KMS, Vault, Secrets Manager), com rotação; nunca no Git. Não inventar algoritmo próprio." en="Keys in a secrets manager (KMS, Vault, Secrets Manager), with rotation; never in Git. Never invent your own algorithm." /></li>
        </ul>
      </Section>
      <Section id="a05" title={<T pt="A05: Injeção" en="A05: Injection" />}>
        <p><T pt={<><strong>A falha:</strong> dado do usuário é interpretado como comando: SQL, NoSQL, comandos do sistema, LDAP, templates e também XSS (injeção no navegador). A causa é sempre a mesma: concatenar texto não confiável numa linguagem interpretada.</>} en={<><strong>The flaw:</strong> user data is interpreted as a command: SQL, NoSQL, OS commands, LDAP, templates and also XSS (injection in the browser). The cause is always the same: concatenating untrusted text into an interpreted language.</>} /></p>
        <CodeBlock code={`// ruim
db.query("SELECT * FROM users WHERE email = '" + email + "'");

// bom: parâmetro separado do comando
db.query("SELECT * FROM users WHERE email = $1", [email]);`} />
        <ul className="ds-list">
          <li><T pt={<>Consultas parametrizadas ou ORM bem usado; nunca montar SQL por concatenação, nem em <code>ORDER BY</code> (use lista permitida de colunas).</>} en={<>Parameterised queries or a well-used ORM; never build SQL by concatenation, not even in <code>ORDER BY</code> (use an allow-list of columns).</>} /></li>
          <li><T pt={<>Comandos do sistema: evitar o shell; chamar o programa com lista de argumentos (<code>subprocess.run([...])</code>, sem <code>shell=True</code>).</>} en={<>OS commands: avoid the shell; call the program with an argument list (<code>subprocess.run([...])</code>, without <code>shell=True</code>).</>} /></li>
          <li><T pt={<>XSS: codificar a saída conforme o contexto (HTML, atributo, JS), usar o auto-escape do framework, evitar <code>innerHTML</code>/<code>dangerouslySetInnerHTML</code> e adicionar CSP.</>} en={<>XSS: encode output for its context (HTML, attribute, JS), use the framework’s auto-escaping, avoid <code>innerHTML</code>/<code>dangerouslySetInnerHTML</code> and add CSP.</>} /></li>
          <li><T pt="Validar a entrada (tipo, tamanho, formato) como defesa em camadas, mas sem confiar só nela. O usuário do banco da aplicação deve ter o mínimo de privilégio." en="Validate input (type, length, format) as defence in depth, but do not rely on it alone. The application’s database user should have minimum privilege." /></li>
        </ul>
      </Section>
      <Section id="a06" title={<T pt="A06: Design inseguro" en="A06: Insecure design" />}>
        <p><T pt={<><strong>A falha:</strong> o erro está no projeto, e código perfeito não o conserta. Exemplos: recuperação de senha por “pergunta secreta”, cupom que pode ser reusado em paralelo, fluxo de compra sem limite por usuário, API que devolve o objeto inteiro e confia que o front esconda os campos.</>} en={<><strong>The flaw:</strong> the mistake is in the design, and perfect code cannot fix it. Examples: password recovery by “secret question”, a coupon that can be reused in parallel, a purchase flow with no per-user limit, an API that returns the whole object and trusts the front end to hide fields.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Modelar ameaças antes de codar (STRIDE: falsificação, adulteração, repúdio, vazamento, negação de serviço, elevação de privilégio) e escrever “casos de abuso” junto com as histórias de usuário." en="Threat-model before coding (STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege) and write “abuse cases” next to user stories." /></li>
          <li><T pt="Limites de uso (rate limit, cotas, tamanho de upload), separação de ambientes e de privilégios, menor privilégio por padrão." en="Usage limits (rate limit, quotas, upload size), separation of environments and privileges, least privilege by default." /></li>
          <li><T pt="Regras de negócio críticas com transações e checagens atômicas (condição de corrida); nunca confiar em preço ou desconto vindo do cliente." en="Critical business rules with transactions and atomic checks (race conditions); never trust a price or discount coming from the client." /></li>
          <li><T pt="Revisão de segurança de cada recurso novo grande; testes que tentam abusar, não só usar." en="Security review for each large new feature; tests that try to abuse, not only use." /></li>
        </ul>
      </Section>
      <Section id="a07" title={<T pt="A07: Falhas de autenticação" en="A07: Authentication failures" />}>
        <p><T pt={<><strong>A falha:</strong> o app aceita força bruta e <em>credential stuffing</em> (senhas vazadas de outros sites), permite senhas fracas, expõe o ID de sessão na URL, não invalida a sessão no logout, tem recuperação de conta fraca.</>} en={<><strong>The flaw:</strong> the app accepts brute force and credential stuffing (passwords leaked from other sites), allows weak passwords, exposes the session ID in the URL, does not invalidate the session on logout, has weak account recovery.</>} /></p>
        <ul className="ds-list">
          <li><T pt="MFA, de preferência passkeys/WebAuthn; ou delegar a um provedor (OIDC) em vez de reinventar o login (veja a nota de SSO)." en="MFA, preferably passkeys/WebAuthn; or delegate to a provider (OIDC) instead of reinventing login (see the SSO note)." /></li>
          <li><T pt="Senhas: tamanho mínimo longo (12+), sem regras de composição absurdas, checar contra listas de senhas vazadas, permitir gerenciadores de senha." en="Passwords: long minimum length (12+), no absurd composition rules, check against breached-password lists, allow password managers." /></li>
          <li><T pt="Limitar tentativas por conta e por IP, com atraso crescente; mensagem de erro igual para “usuário não existe” e “senha errada”." en="Limit attempts per account and per IP, with increasing delay; the same error message for “user does not exist” and “wrong password”." /></li>
          <li><T pt={<>Sessão: ID aleatório novo após o login, cookie <code>HttpOnly; Secure; SameSite=Lax</code>, expiração e invalidação no servidor ao sair.</>} en={<>Session: new random ID after login, cookie <code>HttpOnly; Secure; SameSite=Lax</code>, expiry and server-side invalidation on logout.</>} /></li>
        </ul>
      </Section>
      <Section id="a08" title={<T pt="A08: Integridade de software e dados" en="A08: Software or data integrity failures" />}>
        <p><T pt={<><strong>A falha:</strong> o app confia em código ou dados sem verificar a origem: atualização automática sem assinatura, script de CDN sem verificação, objeto serializado vindo do cliente (<code>pickle</code>, desserialização Java), artefato de build que ninguém comprova de onde veio.</>} en={<><strong>The flaw:</strong> the app trusts code or data without verifying origin: auto-update without signature, a CDN script without verification, a serialised object coming from the client (<code>pickle</code>, Java deserialisation), a build artefact nobody can prove the origin of.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Nunca desserializar dado não confiável com formatos que executam código; usar JSON com validação de esquema." en="Never deserialise untrusted data with formats that execute code; use JSON with schema validation." /></li>
          <li><T pt={<>Scripts de terceiros com Subresource Integrity: <code>&lt;script src="…" integrity="sha384-…" crossorigin="anonymous"&gt;</code>.</>} en={<>Third-party scripts with Subresource Integrity: <code>&lt;script src="…" integrity="sha384-…" crossorigin="anonymous"&gt;</code>.</>} /></li>
          <li><T pt="Assinar e verificar artefatos e imagens (por exemplo com Sigstore/cosign); revisão obrigatória de código e proteção da branch principal." en="Sign and verify artefacts and images (for example with Sigstore/cosign); mandatory code review and a protected main branch." /></li>
          <li><T pt="Proteger a integridade de dados importantes com assinatura ou HMAC (cookies, links de e-mail, webhooks verificados pela assinatura do remetente)." en="Protect the integrity of important data with a signature or HMAC (cookies, email links, webhooks verified by the sender’s signature)." /></li>
        </ul>
      </Section>
      <Section id="a09" title={<T pt="A09: Falhas de log e alerta" en="A09: Logging and alerting failures" />}>
        <p><T pt={<><strong>A falha:</strong> um ataque acontece e ninguém vê. Logins falhos não são registrados, os logs ficam só na máquina atacada, ninguém recebe alerta, ou o log guarda senhas e tokens. Sem isso, o tempo entre invasão e descoberta é de meses.</>} en={<><strong>The flaw:</strong> an attack happens and nobody sees it. Failed logins are not recorded, logs stay only on the attacked machine, nobody gets an alert, or the log stores passwords and tokens. Without this, the time between breach and discovery is months.</>} /></p>
        <ul className="ds-list">
          <li><T pt="Registrar eventos de segurança: logins (sucesso e falha), mudança de senha e de permissão, acesso negado, falhas de validação, ações administrativas. Incluir quem, o quê, quando e de onde." en="Log security events: logins (success and failure), password and permission changes, access denied, validation failures, admin actions. Include who, what, when and from where." /></li>
          <li><T pt="Logs estruturados (JSON), enviados para fora do servidor e com retenção definida; nunca registrar senha, token ou dado pessoal desnecessário." en="Structured logs (JSON), shipped off the server with a defined retention; never log passwords, tokens or unneeded personal data." /></li>
          <li><T pt="Alertas acionáveis (picos de 401/403, muitos logins falhos, uso de conta de admin fora do horário) com responsável e um plano de resposta a incidentes testado. Veja a nota de observabilidade." en="Actionable alerts (spikes of 401/403, many failed logins, admin account use out of hours) with an owner and a tested incident-response plan. See the observability note." /></li>
          <li><T pt="Cuidado com injeção em logs: remover quebras de linha do dado do usuário antes de registrar." en="Beware of log injection: strip newlines from user data before logging." /></li>
        </ul>
      </Section>
      <Section id="a10" title={<T pt="A10: Tratamento de condições excepcionais" en="A10: Mishandling of exceptional conditions" />}>
        <p><T pt={<><strong>A falha:</strong> o app reage mal ao inesperado: erro não tratado que derruba o serviço, exceção que “abre” em vez de “fechar” (a checagem de permissão falha e o acesso é liberado), mensagem de erro que revela o banco ou o caminho de arquivos, recurso não liberado após falha, estado inconsistente no meio de uma transação.</>} en={<><strong>The flaw:</strong> the app reacts badly to the unexpected: an unhandled error that takes the service down, an exception that “fails open” (the permission check fails and access is granted), an error message revealing the database or file paths, a resource not released after failure, inconsistent state in the middle of a transaction.</>} /></p>
        <CodeBlock code={`// ruim: se a checagem lançar erro, o acesso passa
try { allowed = await can(user, 'delete', doc); } catch (e) { log(e); }
if (allowed !== false) remove(doc);

// bom: falha fechada
let allowed = false;
try { allowed = await can(user, 'delete', doc); } catch (e) { log.error(e); }
if (!allowed) return res.sendStatus(403);`} />
        <ul className="ds-list">
          <li><T pt="Falhar de forma fechada: na dúvida, negar. Definir um tratador de erros global que devolve mensagem genérica ao cliente e registra o detalhe no servidor." en="Fail closed: when in doubt, deny. Define a global error handler that returns a generic message to the client and logs the detail on the server." /></li>
          <li><T pt={<>Tratar explicitamente entradas ausentes, nulas, grandes demais e timeouts de dependências; usar transações com rollback e liberar recursos em <code>finally</code>.</>} en={<>Explicitly handle missing, null and oversized input and dependency timeouts; use transactions with rollback and release resources in <code>finally</code>.</>} /></li>
          <li><T pt="Limites de recurso (tamanho, tempo, memória, taxa) para que um erro ou abuso não vire negação de serviço." en="Resource limits (size, time, memory, rate) so an error or abuse does not become denial of service." /></li>
          <li><T pt="Testar o caminho de erro: testes de falha, fuzzing e injeção de falhas das dependências." en="Test the error path: failure tests, fuzzing and fault injection of dependencies." /></li>
        </ul>
      </Section>
      <Section id="plan" title={<T pt="Plano de ação para o seu app" en="Action plan for your app" />}>
        <p><T pt="Tudo de uma vez é impossível; ordene por risco e esforço. Uma ordem que costuma funcionar:" en="Everything at once is impossible; order by risk and effort. An order that usually works:" /></p>
        <Table
          head={[<T pt="Quando" en="When" />, <T pt="Ação" en="Action" />, <T pt="Categorias" en="Categories" />]}
          rows={[
            [<T pt="Hoje (1 hora)" en="Today (1 hour)" />, <T pt="Ligar HTTPS e HSTS; desligar debug; tirar segredos do Git e rotacionar os vazados; ligar MFA nas contas de admin e da nuvem" en="Enable HTTPS and HSTS; turn off debug; remove secrets from Git and rotate leaked ones; enable MFA on admin and cloud accounts" />, "A02, A04, A07"],
            [<T pt="Esta semana" en="This week" />, <T pt={<>Dependabot/Renovate e <code>audit</code> no CI; lockfile; consultas parametrizadas em todo lugar; checagem de dono em cada endpoint; cabeçalhos e CSP</>} en={<>Dependabot/Renovate and <code>audit</code> in CI; lockfile; parameterised queries everywhere; owner check on every endpoint; headers and CSP</>} />, "A01, A02, A03, A05"],
            [<T pt="Este mês" en="This month" />, <T pt="Rate limit e bloqueio de login; tratador de erros global; logs de segurança centralizados com alertas; SBOM; CI com permissões mínimas" en="Rate limit and login lockout; global error handler; centralised security logs with alerts; SBOM; least-privilege CI" />, "A03, A07, A09, A10"],
            [<T pt="Contínuo" en="Ongoing" />, <T pt="Modelagem de ameaças a cada recurso grande; testes de autorização e de abuso; revisão de código com foco em segurança; teste de invasão periódico" en="Threat modelling for each large feature; authorisation and abuse tests; security-focused code review; periodic penetration test" />, "A01, A06, A08"],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Ferramentas ajudam, não substituem:</strong> SAST (Semgrep, CodeQL), DAST (OWASP ZAP), varredura de dependências e de segredos (gitleaks, Trivy) encontram a parte repetitiva. Falhas de autorização e de lógica de negócio (A01, A06) quase sempre exigem teste e revisão humana. Teste apenas sistemas que você é dono ou tem autorização escrita para testar.</>} en={<><strong>Tools help, they do not replace:</strong> SAST (Semgrep, CodeQL), DAST (OWASP ZAP), dependency and secret scanning (gitleaks, Trivy) find the repetitive part. Authorisation and business-logic flaws (A01, A06) almost always need human testing and review. Only test systems you own or have written authorisation to test.</>} /></Callout>
        <h3><T pt="Atividade: auditar um endpoint (45 minutos)" en="Activity: audit one endpoint (45 minutes)" /></h3>
        <p><T pt={<><strong>O que fazer:</strong> escolha um endpoint do seu app que leia ou altere dados de um usuário. Com duas contas de teste, tente: (1) acessar o recurso de A estando logado como B; (2) enviar aspas simples e <code>&lt;script&gt;</code> em cada campo; (3) repetir o login errado 20 vezes; (4) mandar um corpo vazio, enorme e com tipos errados; (5) conferir se cada tentativa apareceu nos logs. Anote o que passou e corrija na ordem A01, A05, A07, A10, A09.</>} en={<><strong>What to do:</strong> pick one endpoint of your app that reads or changes a user’s data. With two test accounts, try: (1) accessing A’s resource while logged in as B; (2) sending a single quote and <code>&lt;script&gt;</code> in every field; (3) failing the login 20 times; (4) sending an empty, huge and wrongly typed body; (5) checking that each attempt showed up in the logs. Note what got through and fix in the order A01, A05, A07, A10, A09.</>} /></p>
        <p><T pt={<><strong>Resultado esperado:</strong> é comum achar pelo menos uma falha de autorização ou de log na primeira rodada; o valor está em transformar cada achado em um teste automático para que não volte.</>} en={<><strong>Expected result:</strong> finding at least one authorisation or logging gap in the first round is common; the value is in turning each finding into an automated test so it does not come back.</>} /></p>
      </Section>
      <Section id="cheat-ow" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Regra curta" en="Short rule" />]}
          rows={[
            [<T pt="Quem pode?" en="Who can?" />, <T pt="Servidor decide, negar por padrão (A01)" en="Server decides, deny by default (A01)" />],
            [<T pt="O que é meu código?" en="What is my code?" />, <T pt="Dependências são código seu: travar, varrer, atualizar (A03, A08)" en="Dependencies are your code: lock, scan, update (A03, A08)" />],
            [<T pt="O que entra?" en="What comes in?" />, <T pt="Dado é dado, nunca comando: parametrizar e codificar (A05)" en="Data is data, never a command: parameterise and encode (A05)" />],
            [<T pt="O que fica?" en="What is stored?" />, <T pt="Cifrar, guardar pouco, chaves fora do código (A04)" en="Encrypt, store little, keys outside code (A04)" />],
            [<T pt="E se falhar?" en="What if it fails?" />, <T pt="Falhar fechado, mensagem genérica, log detalhado (A09, A10)" en="Fail closed, generic message, detailed log (A09, A10)" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Por que esconder um botão no front-end não é controle de acesso, e onde a checagem deve ficar?" en="Why is hiding a button in the front end not access control, and where should the check live?" /></li>
          <li><T pt="Qual a diferença entre a causa de uma injeção SQL e a de um XSS, e o que as duas defesas têm em comum?" en="What is the difference between the cause of SQL injection and XSS, and what do the two defences have in common?" /></li>
          <li><T pt="Dê um exemplo de falha de design (A06) que nenhuma correção de código resolve." en="Give an example of a design flaw (A06) that no code fix resolves." /></li>
          <li><T pt="O que significa “falhar de forma fechada” e como você testaria isso?" en="What does “fail closed” mean and how would you test it?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://top10.owasp.org/2025" rel="noopener">OWASP Top 10:2025</a> · <a href="https://owasp.org/www-project-top-ten/" rel="noopener">OWASP Top Ten project page</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/" rel="noopener">OWASP Cheat Sheet Series</a> (authorization, SQL injection prevention, XSS prevention, password storage, session management, error handling, logging, SSRF prevention, deserialization)</li>
          <li><a href="https://owasp.org/www-project-application-security-verification-standard/" rel="noopener">OWASP Application Security Verification Standard (ASVS)</a> · <a href="https://owasp.org/www-project-web-security-testing-guide/" rel="noopener">OWASP Web Security Testing Guide</a></li>
          <li><a href="https://slsa.dev/" rel="noopener">SLSA: supply-chain levels for software artifacts</a> · <a href="https://www.sigstore.dev/" rel="noopener">Sigstore</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity" rel="noopener">MDN: Subresource Integrity</a></li>
        </ul>
      </Sources>
    </>
  );
}
