import { Callout, CodeBlock, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "owasp-top-10",
  title: "OWASP Top 10 (2025): falhas e defesas",
  seo: {
    title: "OWASP Top 10 (2025): como os apps quebram e como proteger o seu",
    description: "Um guia prático do OWASP Top 10:2025: cada risco com um exemplo da falha, a correção que importa e um plano de ação com listas de verificação para proteger uma aplicação web.",
  },
  summary: "como os apps quebram e o que fazer: os dez riscos do OWASP Top 10:2025 (controle de acesso quebrado, configuração insegura, falhas na cadeia de suprimentos de software, falhas criptográficas, injeção, design inseguro, falhas de autenticação, falhas de integridade de software ou dados, falhas de log e alerta, tratamento errado de condições excepcionais), cada um com um exemplo da falha, a correção que importa, um plano de ação para 1 hora, 1 semana e 1 mês, uma atividade de auditoria de um endpoint e fontes da OWASP.",
  kicker: "Guia prático",
  heroTitle: <>OWASP Top 10 (2025): <em>como os apps quebram e o que fazer.</em></>,
  heroLede: "Os dez riscos mais comuns em aplicações web segundo a OWASP, cada um com um exemplo curto da falha, a correção que importa e uma lista que você pode aplicar ao seu app ainda esta semana.",
  published: "2026-10-28",
  updated: "2026-10-28",
  toc: [
    {
      items: [
        { id: "what", title: "O que é o Top 10" },
        { id: "list", title: "A lista de 2025 de relance" },
        { id: "a01", title: "A01: Controle de acesso quebrado" },
        { id: "a02", title: "A02: Configuração incorreta de segurança" },
        { id: "a03", title: "A03: Falhas na cadeia de suprimentos" },
        { id: "a04", title: "A04: Falhas criptográficas" },
        { id: "a05", title: "A05: Injeção" },
        { id: "a06", title: "A06: Design inseguro" },
        { id: "a07", title: "A07: Falhas de autenticação" },
        { id: "a08", title: "A08: Integridade de software e dados" },
        { id: "a09", title: "A09: Falhas de log e alerta" },
        { id: "a10", title: "A10: Tratamento de condições excepcionais" },
        { id: "plan", title: "Plano de ação para o seu app" },
        { id: "cheat-ow", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que é o Top 10"}>
        <p>O OWASP Top 10 é um documento de conscientização da Open Worldwide Application Security Project: as dez categorias de risco mais críticas em aplicações web, montadas a partir de dados de testes de segurança reais e de uma pesquisa com a comunidade.</p>
        <p>A edição mais recente é a de 2025. Ele não é uma lista de tudo que pode dar errado nem um padrão de conformidade; é um ponto de partida para decidir o que corrigir primeiro.</p>
        <Callout icon="check"><strong>Como usar:</strong> uma categoria é um <em>grupo</em> de falhas (CWEs), não uma falha só. Leia cada seção como “o que procurar no meu código” e “qual controle impede”. Para cabeçalhos HTTP, SQL injection e XSS em detalhe, veja as notas de segurança já publicadas aqui.</Callout>
      </Section>
      <Section id="list" title={"A lista de 2025 de relance"}>
        <Table
          head={["ID", "Categoria", "Defesa principal"]}
          rows={[
            ["A01", "Broken Access Control", "Checar permissão no servidor, em toda requisição, negando por padrão"],
            ["A02", "Security Misconfiguration", "Configuração segura repetível, sem padrões nem debug em produção"],
            ["A03", "Software Supply Chain Failures", "Lockfile, SBOM, varredura de dependências, CI com permissões mínimas"],
            ["A04", "Cryptographic Failures", "TLS em tudo, algoritmos modernos, hash de senha lento, chaves fora do código"],
            ["A05", "Injection", "Consultas parametrizadas e codificação de saída"],
            ["A06", "Insecure Design", "Modelagem de ameaças e limites de abuso desde o projeto"],
            ["A07", "Authentication Failures", "MFA, proteção contra força bruta, sessões seguras"],
            ["A08", "Software or Data Integrity Failures", "Verificar assinatura e origem de código e dados; evitar desserialização insegura"],
            ["A09", "Security Logging and Alerting Failures", "Registrar eventos de segurança e alertar de verdade"],
            ["A10", "Mishandling of Exceptional Conditions", "Falhar de forma fechada, tratar todos os erros, não vazar detalhes"],
          ]}
        />
        <p>Em relação à edição de 2021, a de 2025 mantém o controle de acesso quebrado em primeiro lugar (a SSRF, antes categoria própria, foi incorporada a ele), sobe a configuração incorreta para o segundo lugar, amplia “componentes vulneráveis” para falhas na cadeia de suprimentos e acrescenta o tratamento de condições excepcionais. Confira a lista oficial para os detalhes de cada mudança.</p>
      </Section>
      <Section id="a01" title={"A01: Controle de acesso quebrado"}>
        <p><strong>A falha:</strong> o usuário consegue fazer ou ver o que não deveria. Exemplo clássico: <code>GET /api/faturas/1042</code> devolve a fatura de outra pessoa quando você troca o número (IDOR). Também entram aqui acesso a rotas de admin sem checar o papel, CORS aberto demais e SSRF, quando o servidor busca uma URL escolhida pelo atacante (por exemplo o endereço de metadados da nuvem).</p>
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
          <li>Negar por padrão; liberar por papel e por dono do recurso, <strong>no servidor</strong>. Esconder o botão no front não é controle.</li>
          <li>Centralizar a checagem (middleware ou política) em vez de repetir <code>if</code> em cada rota.</li>
          <li>Contra SSRF: lista de destinos permitidos, bloquear IPs internos e de metadados, não seguir redirecionamentos às cegas.</li>
          <li>Testes automáticos: “o usuário A não lê o recurso do usuário B” para cada endpoint.</li>
        </ul>
      </Section>
      <Section id="a02" title={"A02: Configuração incorreta de segurança"}>
        <p><strong>A falha:</strong> o software é seguro, a configuração não. Senhas padrão, bucket público, modo debug ligado, listagem de diretório, mensagens de erro com stack trace, cabeçalhos de segurança ausentes, portas abertas à toa, permissões amplas demais na nuvem.</p>
        <ul className="ds-list">
          <li>Definir a configuração como código (Terraform, Docker, Nginx versionados) e revisar em PR; o mesmo molde para dev, teste e produção, mudando só os segredos.</li>
          <li>Remover o que não é usado: contas, rotas de exemplo, portas, recursos e funcionalidades.</li>
          <li>Cabeçalhos HTTP e CSP: veja a nota de segurança de apps web. Parsers de XML sem entidades externas (XXE) também ficam aqui.</li>
          <li>Varrer a infraestrutura com regularidade (por exemplo, um scanner de IaC no CI) e alertar em desvio de configuração.</li>
        </ul>
      </Section>
      <Section id="a03" title={"A03: Falhas na cadeia de suprimentos"}>
        <p><strong>A falha:</strong> o problema vem de código que você não escreveu: dependências vulneráveis ou desatualizadas, pacote malicioso com nome parecido (typosquatting), mantenedor comprometido, imagem de contêiner adulterada, pipeline de CI que roda código não confiável com acesso a segredos.</p>
        <CodeBlock code={`npm ci                 # instala exatamente o lockfile
npm audit --omit=dev   # vulnerabilidades conhecidas
pip-audit              # equivalente em Python
trivy fs .             # dependências e IaC no repositório`} />
        <ul className="ds-list">
          <li>Versionar o lockfile e instalar com <code>npm ci</code>/equivalente; fixar imagens por digest.</li>
          <li>Automatizar atualizações (Dependabot ou Renovate) e varredura no CI; ter um prazo para corrigir vulnerabilidades críticas.</li>
          <li>Gerar um SBOM (lista de componentes) e saber o que está em produção.</li>
          <li>No CI: permissões mínimas no token, ações de terceiros fixadas por commit, segredos nunca expostos a PRs de forks, credenciais de nuvem por OIDC em vez de chaves longas.</li>
          <li>Antes de adicionar uma dependência, pergunte se precisa dela; menos pacotes, menos superfície.</li>
        </ul>
      </Section>
      <Section id="a04" title={"A04: Falhas criptográficas"}>
        <p><strong>A falha:</strong> dado sensível sem proteção ou com cripto fraca: tráfego em HTTP, senha com MD5/SHA-1 sem sal, algoritmos antigos, chaves no repositório, números aleatórios previsíveis (<code>Math.random()</code> para tokens), certificados sem validação.</p>
        <ul className="ds-list">
          <li>Classificar os dados e guardar só o necessário; o que não existe não vaza.</li>
          <li>TLS 1.2+ em tudo, com HSTS; cifrar em repouso os dados sensíveis (disco, banco, backup).</li>
          <li>Senhas: Argon2id, scrypt ou bcrypt (nunca SHA simples). Tokens: gerador criptográfico (<code>crypto.randomBytes</code>, <code>secrets.token_urlsafe</code>).</li>
          <li>Chaves em um gerenciador de segredos (KMS, Vault, Secrets Manager), com rotação; nunca no Git. Não inventar algoritmo próprio.</li>
        </ul>
      </Section>
      <Section id="a05" title={"A05: Injeção"}>
        <p><strong>A falha:</strong> dado do usuário é interpretado como comando: SQL, NoSQL, comandos do sistema, LDAP, templates e também XSS (injeção no navegador). A causa é sempre a mesma: concatenar texto não confiável numa linguagem interpretada.</p>
        <CodeBlock code={`// ruim
db.query("SELECT * FROM users WHERE email = '" + email + "'");

// bom: parâmetro separado do comando
db.query("SELECT * FROM users WHERE email = $1", [email]);`} />
        <ul className="ds-list">
          <li>Consultas parametrizadas ou ORM bem usado; nunca montar SQL por concatenação, nem em <code>ORDER BY</code> (use lista permitida de colunas).</li>
          <li>Comandos do sistema: evitar o shell; chamar o programa com lista de argumentos (<code>subprocess.run([...])</code>, sem <code>shell=True</code>).</li>
          <li>XSS: codificar a saída conforme o contexto (HTML, atributo, JS), usar o auto-escape do framework, evitar <code>innerHTML</code>/<code>dangerouslySetInnerHTML</code> e adicionar CSP.</li>
          <li>Validar a entrada (tipo, tamanho, formato) como defesa em camadas, mas sem confiar só nela. O usuário do banco da aplicação deve ter o mínimo de privilégio.</li>
        </ul>
      </Section>
      <Section id="a06" title={"A06: Design inseguro"}>
        <p><strong>A falha:</strong> o erro está no projeto, e código perfeito não o conserta. Exemplos: recuperação de senha por “pergunta secreta”, cupom que pode ser reusado em paralelo, fluxo de compra sem limite por usuário, API que devolve o objeto inteiro e confia que o front esconda os campos.</p>
        <ul className="ds-list">
          <li>Modelar ameaças antes de codar (STRIDE: falsificação, adulteração, repúdio, vazamento, negação de serviço, elevação de privilégio) e escrever “casos de abuso” junto com as histórias de usuário.</li>
          <li>Limites de uso (rate limit, cotas, tamanho de upload), separação de ambientes e de privilégios, menor privilégio por padrão.</li>
          <li>Regras de negócio críticas com transações e checagens atômicas (condição de corrida); nunca confiar em preço ou desconto vindo do cliente.</li>
          <li>Revisão de segurança de cada recurso novo grande; testes que tentam abusar, não só usar.</li>
        </ul>
      </Section>
      <Section id="a07" title={"A07: Falhas de autenticação"}>
        <p><strong>A falha:</strong> o app aceita força bruta e <em>credential stuffing</em> (senhas vazadas de outros sites), permite senhas fracas, expõe o ID de sessão na URL, não invalida a sessão no logout, tem recuperação de conta fraca.</p>
        <ul className="ds-list">
          <li>MFA, de preferência passkeys/WebAuthn; ou delegar a um provedor (OIDC) em vez de reinventar o login (veja a nota de SSO).</li>
          <li>Senhas: tamanho mínimo longo (12+), sem regras de composição absurdas, checar contra listas de senhas vazadas, permitir gerenciadores de senha.</li>
          <li>Limitar tentativas por conta e por IP, com atraso crescente; mensagem de erro igual para “usuário não existe” e “senha errada”.</li>
          <li>Sessão: ID aleatório novo após o login, cookie <code>HttpOnly; Secure; SameSite=Lax</code>, expiração e invalidação no servidor ao sair.</li>
        </ul>
      </Section>
      <Section id="a08" title={"A08: Integridade de software e dados"}>
        <p><strong>A falha:</strong> o app confia em código ou dados sem verificar a origem: atualização automática sem assinatura, script de CDN sem verificação, objeto serializado vindo do cliente (<code>pickle</code>, desserialização Java), artefato de build que ninguém comprova de onde veio.</p>
        <ul className="ds-list">
          <li>Nunca desserializar dado não confiável com formatos que executam código; usar JSON com validação de esquema.</li>
          <li>Scripts de terceiros com Subresource Integrity: <code>&lt;script src="…" integrity="sha384-…" crossorigin="anonymous"&gt;</code>.</li>
          <li>Assinar e verificar artefatos e imagens (por exemplo com Sigstore/cosign); revisão obrigatória de código e proteção da branch principal.</li>
          <li>Proteger a integridade de dados importantes com assinatura ou HMAC (cookies, links de e-mail, webhooks verificados pela assinatura do remetente).</li>
        </ul>
      </Section>
      <Section id="a09" title={"A09: Falhas de log e alerta"}>
        <p><strong>A falha:</strong> um ataque acontece e ninguém vê. Logins falhos não são registrados, os logs ficam só na máquina atacada, ninguém recebe alerta, ou o log guarda senhas e tokens. Sem isso, o tempo entre invasão e descoberta é de meses.</p>
        <ul className="ds-list">
          <li>Registrar eventos de segurança: logins (sucesso e falha), mudança de senha e de permissão, acesso negado, falhas de validação, ações administrativas. Incluir quem, o quê, quando e de onde.</li>
          <li>Logs estruturados (JSON), enviados para fora do servidor e com retenção definida; nunca registrar senha, token ou dado pessoal desnecessário.</li>
          <li>Alertas acionáveis (picos de 401/403, muitos logins falhos, uso de conta de admin fora do horário) com responsável e um plano de resposta a incidentes testado. Veja a nota de observabilidade.</li>
          <li>Cuidado com injeção em logs: remover quebras de linha do dado do usuário antes de registrar.</li>
        </ul>
      </Section>
      <Section id="a10" title={"A10: Tratamento de condições excepcionais"}>
        <p><strong>A falha:</strong> o app reage mal ao inesperado: erro não tratado que derruba o serviço, exceção que “abre” em vez de “fechar” (a checagem de permissão falha e o acesso é liberado), mensagem de erro que revela o banco ou o caminho de arquivos, recurso não liberado após falha, estado inconsistente no meio de uma transação.</p>
        <CodeBlock code={`// ruim: se a checagem lançar erro, o acesso passa
try { allowed = await can(user, 'delete', doc); } catch (e) { log(e); }
if (allowed !== false) remove(doc);

// bom: falha fechada
let allowed = false;
try { allowed = await can(user, 'delete', doc); } catch (e) { log.error(e); }
if (!allowed) return res.sendStatus(403);`} />
        <ul className="ds-list">
          <li>Falhar de forma fechada: na dúvida, negar. Definir um tratador de erros global que devolve mensagem genérica ao cliente e registra o detalhe no servidor.</li>
          <li>Tratar explicitamente entradas ausentes, nulas, grandes demais e timeouts de dependências; usar transações com rollback e liberar recursos em <code>finally</code>.</li>
          <li>Limites de recurso (tamanho, tempo, memória, taxa) para que um erro ou abuso não vire negação de serviço.</li>
          <li>Testar o caminho de erro: testes de falha, fuzzing e injeção de falhas das dependências.</li>
        </ul>
      </Section>
      <Section id="plan" title={"Plano de ação para o seu app"}>
        <p>Tudo de uma vez é impossível; ordene por risco e esforço. Uma ordem que costuma funcionar:</p>
        <Table
          head={["Quando", "Ação", "Categorias"]}
          rows={[
            ["Hoje (1 hora)", "Ligar HTTPS e HSTS; desligar debug; tirar segredos do Git e rotacionar os vazados; ligar MFA nas contas de admin e da nuvem", "A02, A04, A07"],
            ["Esta semana", <>Dependabot/Renovate e <code>audit</code> no CI; lockfile; consultas parametrizadas em todo lugar; checagem de dono em cada endpoint; cabeçalhos e CSP</>, "A01, A02, A03, A05"],
            ["Este mês", "Rate limit e bloqueio de login; tratador de erros global; logs de segurança centralizados com alertas; SBOM; CI com permissões mínimas", "A03, A07, A09, A10"],
            ["Contínuo", "Modelagem de ameaças a cada recurso grande; testes de autorização e de abuso; revisão de código com foco em segurança; teste de invasão periódico", "A01, A06, A08"],
          ]}
        />
        <Callout tone="warn" icon="alert"><strong>Ferramentas ajudam, não substituem:</strong> SAST (Semgrep, CodeQL), DAST (OWASP ZAP), varredura de dependências e de segredos (gitleaks, Trivy) encontram a parte repetitiva. Falhas de autorização e de lógica de negócio (A01, A06) quase sempre exigem teste e revisão humana. Teste apenas sistemas que você é dono ou tem autorização escrita para testar.</Callout>
        <h3>Atividade: auditar um endpoint (45 minutos)</h3>
        <p><strong>O que fazer:</strong> escolha um endpoint do seu app que leia ou altere dados de um usuário. Com duas contas de teste, tente: (1) acessar o recurso de A estando logado como B; (2) enviar aspas simples e <code>&lt;script&gt;</code> em cada campo; (3) repetir o login errado 20 vezes; (4) mandar um corpo vazio, enorme e com tipos errados; (5) conferir se cada tentativa apareceu nos logs. Anote o que passou e corrija na ordem A01, A05, A07, A10, A09.</p>
        <p><strong>Resultado esperado:</strong> é comum achar pelo menos uma falha de autorização ou de log na primeira rodada; o valor está em transformar cada achado em um teste automático para que não volte.</p>
      </Section>
      <Section id="cheat-ow" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Pergunta", "Regra curta"]}
          rows={[
            ["Quem pode?", "Servidor decide, negar por padrão (A01)"],
            ["O que é meu código?", "Dependências são código seu: travar, varrer, atualizar (A03, A08)"],
            ["O que entra?", "Dado é dado, nunca comando: parametrizar e codificar (A05)"],
            ["O que fica?", "Cifrar, guardar pouco, chaves fora do código (A04)"],
            ["E se falhar?", "Falhar fechado, mensagem genérica, log detalhado (A09, A10)"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <ul>
          <li>Por que esconder um botão no front-end não é controle de acesso, e onde a checagem deve ficar?</li>
          <li>Qual a diferença entre a causa de uma injeção SQL e a de um XSS, e o que as duas defesas têm em comum?</li>
          <li>Dê um exemplo de falha de design (A06) que nenhuma correção de código resolve.</li>
          <li>O que significa “falhar de forma fechada” e como você testaria isso?</li>
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
