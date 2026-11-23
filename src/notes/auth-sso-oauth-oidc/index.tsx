import { Callout, CodeBlock, Diagram, Section, Sources, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "auth-sso-oauth-oidc",
  title: "Autenticação: SSO, OAuth e OIDC",
  seo: {
    title: "Login e autenticação: SSO, OAuth, OIDC e companhia",
    description: "Autenticação vs. autorização, passkeys e MFA, SSO, OAuth 2.0, OpenID Connect, SAML, LDAP e Kerberos, o fluxo completo de \"Entrar com Google\" e OIDC do GitHub Actions para a AWS sem chaves guardadas.",
  },
  summary: "autenticação vs. autorização, MFA e passkeys, SSO, OAuth 2.0, OpenID Connect, SAML, LDAP e Kerberos, um fluxo completo de \"Entrar com o Google\" e GitHub Actions na AWS com OIDC (sem chave guardada), com trust policy, workflow e erros comuns.",
  kicker: "Guia de estudo",
  heroTitle: <>Login e autenticação: <em>SSO, OAuth, OIDC e companhia.</em></>,
  heroLede: "Quem você é, o que você pode fazer e como os padrões se encaixam, terminando com o GitHub Actions entrando na AWS sem chaves guardadas.",
  published: "2026-10-22",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "tldr", title: "Resumo (TL;DR)" },
        { id: "authn-authz", title: "Autenticação vs. autorização" },
        { id: "prove", title: "Formas de provar identidade" },
        { id: "protocols", title: "Protocolos e padrões" },
        { id: "glossary", title: "Glossário" },
        { id: "flow", title: "Fluxo completo: “Entrar com Google”" },
        { id: "rule", title: "Regra de bolso" },
        { id: "actions-aws", title: "Prática: OIDC no GitHub Actions → AWS" },
        { id: "errors", title: "Erros comuns e como resolver" },
        { id: "cheat-au", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="tldr" title={"Resumo (TL;DR)"}>
        <Callout icon="check">Onde esta nota se encaixa: é o mapa de conceitos de identidade e acesso. Sessões, cookies e JWT do lado de quem constrói o app estão na <a href="/notas/web-app-security/">nota de apps web seguros</a> e o passo a passo completo do deploy está em <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</Callout>
        <ol className="ds-steps">
          <li><b>Autenticar</b> é provar quem você é; <b>autorizar</b> é decidir o que você pode fazer. São perguntas diferentes e protocolos diferentes.</li>
          <li><b>OAuth 2.0</b> cuida de autorização (tokens com escopo); <b>OIDC</b> e <b>SAML</b> cuidam de autenticação; <b>SSO</b> é a experiência de entrar uma vez só; <b>MFA</b> reforça a prova de identidade.</li>
          <li>Em CI/CD, use <b>OIDC</b> para o GitHub Actions entrar na AWS com credenciais temporárias, sem chaves de acesso fixas guardadas em secrets.</li>
        </ol>
      </Section>
      <Section id="authn-authz" title={"Autenticação vs. autorização"}>
        <p>Dois conceitos que parecem um só e são a fonte da maior parte da confusão nesta área.</p>
        <Table
          head={["Pergunta", "Nome", "Exemplo"]}
          rows={[
            ["Quem é você?", <><b>Autenticação</b> (AuthN)</>, "Senha + código do app autenticador"],
            ["O que você pode fazer?", <><b>Autorização</b> (AuthZ)</>, "Pode ler o bucket, mas não apagar"],
          ]}
        />
        <Callout tone="good" icon="check"><b>Analogia do hotel.</b> Na recepção você mostra o documento (autenticação). Em troca, recebe um cartão que abre só o seu quarto e a academia, não os outros quartos (autorização). O cartão não diz o seu nome; só diz o que abre.</Callout>
        <p>A ordem importa: primeiro se autentica, depois se autoriza. Um sistema que autoriza sem autenticar libera acesso para qualquer um; um que autentica sem autorizar deixa todo mundo logado ver tudo.</p>
        <Callout tone="warn" icon="alert"><b>Regra para o resto da nota:</b> toda vez que aparecer OAuth, lembre que ele é sobre <b>autorização</b> (delegar acesso com um token). Saber <i>quem</i> é o usuário é trabalho do OpenID Connect, que roda por cima do OAuth.</Callout>
      </Section>
      <Section id="prove" title={"Formas de provar identidade"}>
        <p>Os métodos se agrupam em três tipos de fator: algo que você <b>sabe</b>, algo que você <b>tem</b> e algo que você <b>é</b>.</p>
        <Table
          head={["Método", "Fator", "Como funciona", "Ponto de atenção"]}
          rows={[
            [<><b>Senha</b></>, "Sabe", "Segredo compartilhado: você e o servidor conhecem o mesmo valor (o servidor guarda um hash).", "Reuso, vazamento e phishing. Sozinha é o elo mais fraco."],
            [<><b>MFA / 2FA</b></>, "Combina fatores", "Exige dois ou mais fatores de tipos diferentes (MFA = múltiplos; 2FA = exatamente dois). Ex.: senha + código TOTP (RFC 6238) ou chave de segurança.", "SMS é o mais fraco (troca de chip, interceptação). Prefira app autenticador ou chave física."],
            [<><b>Passwordless</b></>, "Tem / É", "Entrar sem digitar senha: link ou código por e-mail, notificação no celular ou passkey.", "Link e código por e-mail só são tão seguros quanto a caixa de e-mail."],
            [<><b>Passkeys</b></>, "Tem + (É ou Sabe)", "Par de chaves: a privada fica no seu dispositivo (ou no gerenciador de senhas), o site guarda só a pública. Você desbloqueia com biometria ou PIN do aparelho.", "Resistente a phishing, porque a credencial só funciona no domínio para o qual foi criada. Planeje a recuperação de conta."],
            [<><b>Biometria</b></>, "É", "Impressão digital, rosto. Em geral só desbloqueia uma chave guardada no aparelho; a digital não vai para o servidor.", "Não dá para trocar uma digital vazada. Por isso costuma ser um desbloqueio local, não a credencial em si."],
          ]}
        />
        <h3>WebAuthn, FIDO2 e passkeys: quem é quem</h3>
        <ul className="ds-list">
          <li><b>WebAuthn</b>: API do navegador (padrão do W3C) que cria e usa as credenciais de chave pública.</li>
          <li><b>FIDO2</b>: conjunto da FIDO Alliance formado por WebAuthn (navegador ↔ site) e CTAP (navegador ↔ chave de segurança).</li>
          <li><b>Passkey</b>: o nome amigável de uma credencial FIDO/WebAuthn, muitas vezes sincronizada entre os dispositivos do usuário.</li>
        </ul>
      </Section>
      <Section id="protocols" title={"Protocolos e padrões"}>
        <h3>SSO: um conceito, não um protocolo</h3>
        <p><b>Single Sign-On</b> é a experiência de entrar uma vez e usar vários sistemas sem digitar a senha de novo. Não existe um “protocolo SSO”: ele é implementado com OIDC, SAML ou Kerberos. O que as apps têm em comum é confiar no mesmo provedor de identidade.</p>
        <h3>OAuth 2.0 (autorização)</h3>
        <p>Framework (RFC 6749) para um app obter <b>acesso limitado</b> a algo seu sem receber a sua senha. É a analogia da chave de manobrista: ela liga o carro, mas não abre o porta-malas. O resultado é um <b>access token</b> com <b>escopos</b>.</p>
        <Callout tone="warn" icon="alert"><b>OAuth é autorização, não autenticação.</b> O access token diz “quem o carrega pode fazer X”; ele não é uma prova padronizada de quem é o usuário. Usar só OAuth para “fazer login” é um erro clássico: para isso existe o OIDC.</Callout>
        <Table
          head={["Fluxo (grant)", "Quando usar"]}
          rows={[
            [<b>Authorization Code + PKCE</b>, "Apps web, mobile e SPAs com usuário. É o recomendado hoje (PKCE: RFC 7636)."],
            [<b>Client Credentials</b>, "Máquina para máquina, sem usuário (um serviço chamando outro)."],
            [<b>Device Code</b>, "TVs e CLIs, sem teclado confortável (RFC 8628)."],
            [<><b>Implicit</b> e <b>Password</b></>, "Evite: são desencorajados pelas práticas atuais de segurança do OAuth (RFC 9700)."],
          ]}
        />
        <h3>OpenID Connect, OIDC (autenticação)</h3>
        <p>Camada de identidade <b>sobre o OAuth 2.0</b>. Acrescenta o escopo <code>openid</code>, o <b>ID token</b> (um JWT com claims sobre o usuário e sobre o login), o endpoint <code>userinfo</code> e um documento de descoberta em <code>/.well-known/openid-configuration</code>. Responde “quem é este usuário?”.</p>
        <h3>SAML 2.0 (autenticação, mundo corporativo)</h3>
        <p>Padrão mais antigo, baseado em <b>XML</b>. O provedor de identidade devolve uma <b>assertion</b> assinada ao app via navegador. Muito comum em ferramentas corporativas (SaaS B2B). Faz o mesmo papel do OIDC; apps novas costumam preferir OIDC por ser mais simples (JSON/JWT).</p>
        <h3>LDAP e Active Directory</h3>
        <p><b>LDAP</b> (RFC 4511) é um protocolo para consultar e autenticar contra um <b>diretório</b> de usuários, grupos e dispositivos. <b>Active Directory (AD)</b> é o serviço de diretório da Microsoft, que fala LDAP e Kerberos; <b>Microsoft Entra ID</b> (antigo Azure AD) é a versão em nuvem, acessada com OIDC e SAML.</p>
        <h3>Kerberos</h3>
        <p>Autenticação por <b>tickets</b> dentro de uma rede corporativa (RFC 4120). Você prova a identidade uma vez a um servidor central (o KDC) e recebe um ticket que as outras máquinas aceitam. É a base do “login do Windows que vale para tudo” em domínios AD.</p>
        <Table
          head={["Padrão", "Responde", "Formato", "Onde aparece"]}
          rows={[
            [<b>OAuth 2.0</b>, "O que posso acessar?", "Access token", "APIs, “Permitir que o app acesse seu GitHub”"],
            [<b>OIDC</b>, "Quem é o usuário?", "ID token (JWT)", "“Entrar com Google”, GitHub Actions → AWS"],
            [<b>SAML 2.0</b>, "Quem é o usuário?", "Assertion (XML)", "SaaS corporativo, SSO da empresa"],
            [<b>LDAP</b>, "Quem existe e em quais grupos?", "Consultas ao diretório", "Servidores Linux, VPN, apps internas"],
            [<b>Kerberos</b>, "Quem é o usuário na rede?", "Tickets", "Domínio Windows/AD"],
          ]}
        />
      </Section>
      <Section id="glossary" title={"Glossário"}>
        <Table
          head={["Termo", "O que é"]}
          rows={[
            [<><b>IdP</b> (Identity Provider)</>, "Quem autentica o usuário e emite a prova de identidade. Ex.: Google, Okta, Entra ID, e o GitHub Actions para os jobs."],
            [<><b>SP</b> / <b>Relying Party</b> (RP)</>, "O app que confia no IdP. “SP” (Service Provider) é o termo do SAML; “Relying Party” é o do OIDC. Na AWS, o papel de RP é do IAM/STS."],
            [<b>Token</b>, <>Texto que representa uma prova ou uma permissão, com prazo. <i>Access token</i>: autoriza chamar uma API. <i>ID token</i>: diz quem é o usuário. <i>Refresh token</i>: obtém novos access tokens.</>],
            [<><b>JWT</b> (JSON Web Token)</>, <>Formato de token (RFC 7519): três partes em Base64URL separadas por ponto (cabeçalho, payload, assinatura). Fica <b>assinado</b>, não escondido: qualquer um lê o conteúdo, só quem tem a chave o forja.</>],
            [<><b>Sessão</b> / <b>cookie</b></>, <>Depois do login, o app cria uma sessão e guarda um identificador num cookie. Os requests seguintes mostram o cookie em vez de pedir login de novo. Use <code>HttpOnly</code>, <code>Secure</code> e <code>SameSite</code>.</>],
            [<b>API key</b>, "Segredo fixo que identifica um app ou projeto. Simples, mas não tem usuário, prazo nem escopo por padrão: se vazar, vale até alguém revogar."],
            [<><b>RBAC</b> (Role-Based Access Control)</>, <>Autorização por papéis: você recebe um papel (ex.: <i>deploy</i>) e o papel concede as permissões. Na AWS, o equivalente são as <b>roles</b> do IAM.</>],
            [<><b>Scope</b> (escopo)</>, <>Permissão pedida num token OAuth. Ex.: <code>read:user</code>, <code>email</code>, <code>openid</code>. O usuário vê e aprova na tela de consentimento.</>],
            [<b>Claim</b>, <>Uma afirmação dentro do token: um par nome/valor. Ex.: <code>sub</code> (quem), <code>iss</code> (quem emitiu), <code>aud</code> (para quem), <code>exp</code> (quando expira).</>],
          ]}
        />
      </Section>
      <Section id="flow" title={"Fluxo completo: “Entrar com Google”"}>
        <p>Usa OIDC sobre OAuth 2.0, com o fluxo Authorization Code + PKCE. O app é a Relying Party; o Google, o IdP.</p>
        <ol className="ds-steps">
          <li>O usuário clica em <b>Entrar com Google</b> no app.</li>
          <li>O app gera <code>state</code> (anti-CSRF), <code>nonce</code> (anti-replay do ID token) e um par PKCE (<code>code_verifier</code> secreto e <code>code_challenge</code> derivado).</li>
          <li>O app redireciona o navegador para o endpoint de autorização do Google com <code>client_id</code>, <code>redirect_uri</code>, <code>response_type=code</code>, <code>scope=openid email profile</code>, <code>state</code>, <code>nonce</code> e <code>code_challenge</code>.</li>
          <li><b>[Autenticação]</b> O Google verifica quem é o usuário: senha, MFA ou passkey. Se já há sessão ativa no Google, é aqui que o SSO acontece e nada é digitado.</li>
          <li><b>[Autorização]</b> O Google mostra a tela de consentimento: “o app quer ver seu nome e e-mail”. O usuário aprova os escopos.</li>
          <li>O Google redireciona de volta ao <code>redirect_uri</code> com um <code>code</code> de uso único e o <code>state</code>.</li>
          <li>O app confere que o <code>state</code> é o mesmo que enviou. Se não for, aborta.</li>
          <li>O <b>backend</b> do app troca o <code>code</code> por tokens no endpoint de token do Google, enviando também o <code>code_verifier</code>.</li>
          <li>O Google devolve o <b>ID token</b> (JWT, diz quem é), o <b>access token</b> (autoriza chamar APIs do Google) e, às vezes, um refresh token.</li>
          <li>O app <b>valida o ID token</b>: assinatura (chaves públicas do IdP), <code>iss</code>, <code>aud</code> igual ao seu <code>client_id</code>, <code>exp</code> e <code>nonce</code>.</li>
          <li>O app cria a <b>sessão</b> própria (cookie <code>HttpOnly</code>). A partir daí o Google já saiu de cena; o access token só é usado se o app precisar chamar APIs do Google.</li>
        </ol>
        <Callout icon="check">Os endpoints exatos (autorização, token, chaves públicas) estão no documento de descoberta do IdP. Para o Google, confira a documentação oficial de OpenID Connect.</Callout>
      </Section>
      <Section id="rule" title={"Regra de bolso"}>
        <ul className="ds-list">
          <li><b>OAuth 2.0</b> = autorização. “Este app pode acessar isto, com estes escopos.”</li>
          <li><b>OIDC</b> = autenticação, em cima do OAuth. “Este usuário é fulano.”</li>
          <li><b>SAML</b> = autenticação, com XML, no mundo corporativo.</li>
          <li><b>SSO</b> = experiência: entrar uma vez, usar várias apps. Implementado com OIDC, SAML ou Kerberos.</li>
          <li><b>MFA</b> = reforço: mais de um fator para provar a identidade.</li>
          <li><b>JWT</b> = formato do token, não um protocolo.</li>
          <li><b>LDAP / AD</b> = o diretório de usuários; <b>Kerberos</b> = tickets na rede interna.</li>
        </ul>
      </Section>
      <Section id="actions-aws" title={"Prática: OIDC no GitHub Actions → AWS"}>
        <p>Aqui o “usuário” é um job de CI/CD. O GitHub é o IdP, a AWS é quem confia, e o resultado são credenciais temporárias no lugar de uma chave de acesso fixa (<code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code>) guardada em secrets. A troca de credenciais é <b>autenticação</b> (o token prova qual repositório e branch pediram) seguida de <b>autorização</b> (a role define o que pode ser feito).</p>
        <h3>Diagrama do fluxo</h3>
        <Diagram minWidth={560} caption={"O job nunca guarda segredo: o GitHub assina uma prova de identidade por execução e a AWS troca essa prova por credenciais de curta duração."}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Fluxo OIDC do GitHub Actions para a AWS">
            <rect x="10" y="100" width="140" height="50" rx="4" className="ln fillsoft" />
            <text x="80" y="122" textAnchor="middle">Job do Actions</text>
            <text x="80" y="140" className="mut mono" textAnchor="middle">id-token: write</text>
            <rect x="260" y="10" width="200" height="50" rx="4" className="ln" />
            <text x="360" y="32" textAnchor="middle">GitHub OIDC (IdP)</text>
            <text x="360" y="50" className="mut" textAnchor="middle">emite o JWT assinado</text>
            <rect x="540" y="100" width="150" height="50" rx="4" className="brandfill" />
            <text x="615" y="122" textAnchor="middle">AWS STS + IAM</text>
            <text x="615" y="140" textAnchor="middle">role + trust policy</text>
            <rect x="540" y="195" width="150" height="40" rx="4" className="ln" />
            <text x="615" y="220" textAnchor="middle">ECR / ECS / S3 ...</text>
            <path d="M95 100L260 45" className="ln" />
            <path d="M252.0 46.4L260 45L254.8 51.7" className="ln" />
            <path d="M260 52L110 100" className="ln" />
            <path d="M118.3 98.6L110 100L115.4 93.3" className="ln" />
            <text x="55" y="68" textAnchor="start">1. pede o token</text>
            <text x="270" y="82" className="mut" textAnchor="start">2. JWT assinado</text>
            <path d="M150 118L540 118" className="ln" />
            <path d="M532.7 114.7L540 118L532.7 121.3" className="ln" />
            <text x="345" y="112" textAnchor="middle">3. AssumeRoleWithWebIdentity + JWT</text>
            <path d="M540 134L150 134" className="ln" />
            <path d="M157.3 130.7L150 134L157.3 137.3" className="ln" />
            <text x="345" y="152" textAnchor="middle">4. credenciais temporárias</text>
            <path d="M600 100L470 55" className="ln dash" />
            <text x="565" y="84" className="mut" textAnchor="start">valida a assinatura</text>
            <path d="M80 150L80 215L540 215" className="ln" />
            <path d="M532.7 211.7L540 215L532.7 218.3" className="ln" />
            <text x="300" y="208" textAnchor="middle">5. usa as credenciais (expiram sozinhas)</text>
          </svg>
        </Diagram>
        <h3>Passo 0: criar o provedor OIDC na AWS (uma vez por conta)</h3>
        <ul className="ds-list">
          <li><b>Provider URL</b>: <code>https://token.actions.githubusercontent.com</code></li>
          <li><b>Audience</b>: <code>sts.amazonaws.com</code></li>
        </ul>
        <p>O passo a passo completo (console e CLI, duas contas, environments, secrets) está na nota <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>. Aqui ficam o mínimo e a teoria.</p>
        <h3>Trust policy da role IAM</h3>
        <p>A trust policy diz <b>quem pode assumir</b> a role. As duas condições são o coração da segurança: <code>aud</code> garante que o token foi feito para a AWS e <code>sub</code> garante que veio do seu repositório e da sua branch.</p>
        <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:<ORG>/<REPO>:ref:refs/heads/main"
        }
      }
    }
  ]
}`} />
        <Callout tone="warn" icon="alert">Nunca deixe o <code>sub</code> só com curinga. Sem ele restringido, outro repositório do GitHub poderia pedir a role. Se o job usa um <i>environment</i>, o <code>sub</code> muda para <code>repo:ORG/REPO:environment:NOME</code>. Repositórios novos podem usar um formato com IDs numéricos: confira os formatos atuais na documentação do GitHub.</Callout>
        <h3>Workflow do GitHub Actions</h3>
        <CodeBlock>
          {"name: deploy\n"}
          {"\n"}
          {"on:\n"}
          {"  push:\n"}
          {"    branches: [main]\n"}
          {"\n"}
          {"permissions:\n"}
          {"  id-token: write   "}<span className="tok-c"># lets the job request the OIDC token</span>{"\n"}
          {"  contents: read    "}<span className="tok-c"># lets actions/checkout read the repo</span>{"\n"}
          {"\n"}
          {"jobs:\n"}
          {"  deploy:\n"}
          {"    runs-on: ubuntu-latest\n"}
          {"    steps:\n"}
          {"      - uses: actions/checkout@v6\n"}
          {"\n"}
          {"      - name: Configure AWS credentials (OIDC)\n"}
          {"        uses: aws-actions/configure-aws-credentials@v6\n"}
          {"        with:\n"}
          {"          role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/github-deploy-main\n"}
          {"          aws-region: sa-east-1\n"}
          {"\n"}
          {"      - name: Who am I?\n"}
          {"        run: aws sts get-caller-identity"}
        </CodeBlock>
        <p>Sem <code>permissions: id-token: write</code> o job não consegue pedir o token e a ação falha. A action <code>configure-aws-credentials</code> faz o passo 3 do diagrama e exporta as credenciais temporárias para os passos seguintes. Confira na página da action as versões e opções atuais.</p>
        <h3>Claims do token</h3>
        <p>Esse é o <i>payload</i> de um token do GitHub (valores de exemplo). É isso que a AWS compara com a trust policy.</p>
        <CodeBlock code={`{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "sts.amazonaws.com",
  "sub": "repo:<ORG>/<REPO>:ref:refs/heads/main",
  "repository": "<ORG>/<REPO>",
  "repository_owner": "<ORG>",
  "ref": "refs/heads/main",
  "sha": "<commit sha>",
  "workflow": "deploy",
  "event_name": "push",
  "actor": "<github user>",
  "job_workflow_ref": "<ORG>/<REPO>/.github/workflows/deploy.yml@refs/heads/main",
  "iat": 1760000000,
  "nbf": 1760000000,
  "exp": 1760003600
}`} />
        <Table
          head={["Claim", "Significado", "Uso na segurança"]}
          rows={[
            [<code>iss</code>, "Quem emitiu (o GitHub)", "Identifica o provedor OIDC cadastrado na AWS"],
            [<code>aud</code>, "Para quem o token foi feito", <>Condição obrigatória: <code>sts.amazonaws.com</code></>],
            [<code>sub</code>, "Quem pede: repositório + branch, tag, PR ou environment", "Principal condição de restrição"],
            [<><code>repository</code>, <code>repository_owner</code></>, "Repositório e dono", "Úteis em políticas por organização"],
            [<><code>ref</code>, <code>sha</code></>, "Branch/tag e commit", "Auditoria: qual código rodou"],
            [<code>job_workflow_ref</code>, "Qual arquivo de workflow rodou", "Permite amarrar a role a um workflow específico (verifique o suporte na documentação)"],
            [<><code>iat</code>, <code>nbf</code>, <code>exp</code></>, "Emitido em, válido a partir de, expira em", "O token é de curta duração"],
          ]}
        />
        <p>Para ver os claims reais do seu job, decodifique o token em um passo de teste do workflow (o payload do JWT é Base64URL). Faça isso só em um repositório de teste, e não publique o token inteiro nos logs.</p>
        <h3>Boas práticas de segurança</h3>
        <ul className="ds-list">
          <li><b>Uma role por ambiente</b> (develop, production), cada uma com a sua trust policy e o mínimo de permissões (menor privilégio).</li>
          <li><b>Restrinja o <code>sub</code> ao máximo</b>: repositório e branch/environment exatos. Use <code>StringEquals</code> sempre que der.</li>
          <li><b>Environments com aprovação</b> para produção: o deploy só segue depois de um revisor aprovar.</li>
          <li><b>Permissões mínimas no workflow</b>: declare <code>permissions</code> explicitamente em vez de herdar o padrão.</li>
          <li><b>Cuidado com PRs de forks e com <code>pull_request_target</code></b>: não dê a role de deploy para código que você não revisou.</li>
          <li><b>Fixe versões de actions de terceiros</b> (por SHA do commit, quando possível), porque elas rodam no job que tem a role.</li>
          <li><b>Remova as chaves antigas</b>: depois de migrar, apague o usuário IAM e as chaves fixas que existiam.</li>
          <li><b>Audite</b>: o CloudTrail registra <code>AssumeRoleWithWebIdentity</code> com o token usado; monitore usos inesperados.</li>
        </ul>
      </Section>
      <Section id="errors" title={"Erros comuns e como resolver"}>
        <Table
          head={["Sintoma", "Causa provável", "Como resolver"]}
          rows={[
            [<><code>Credentials could not be loaded</code> / falha ao pegar o token</>, <>Falta <code>permissions: id-token: write</code> (ou o <code>permissions</code> do workflow o removeu)</>, "Adicione a permissão no workflow ou no job"],
            [<code>Not authorized to perform sts:AssumeRoleWithWebIdentity</code>, <>O <code>sub</code> ou o <code>aud</code> do token não bate com a trust policy</>, <>Compare os claims reais com a condição; confira branch × environment × PR e o formato do <code>sub</code></>],
            [<>Funciona na <code>main</code>, falha no pull request</>, <>No PR o <code>sub</code> é <code>repo:ORG/REPO:pull_request</code></>, "Use uma role separada, de leitura, para PRs; não afrouxe a de deploy"],
            [<code>No OpenIDConnect provider found in your account</code>, "O provedor OIDC não existe na conta em que a role está", "Crie o provedor em cada conta que tem a role"],
            [<>Erro de audiência (<code>aud</code>)</>, "A condição espera outro valor que o do token", <>Use <code>sts.amazonaws.com</code> nos dois lados, a menos que você tenha mudado a audience de propósito</>],
            [<><code>redirect_uri_mismatch</code> (OAuth/OIDC com Google etc.)</>, "A URL de retorno enviada difere da cadastrada no IdP", "Cadastre a URL exata (protocolo, domínio, caminho e barra final)"],
            [<><code>invalid_grant</code> na troca do code</>, <>Code expirado ou já usado, ou <code>code_verifier</code> não corresponde ao <code>code_challenge</code></>, "Troque o code uma única vez, logo após o retorno; guarde o verifier por sessão"],
            ["Login em loop / sessão some após o retorno", <>Cookie de sessão bloqueado (<code>SameSite</code>, <code>Secure</code> em HTTP, domínio errado)</>, "Revise os atributos do cookie e use HTTPS"],
            ["Usar o access token para “saber quem é o usuário”", "Confusão entre autorização e autenticação", "Use o ID token (OIDC), validado, para identidade; o access token é para chamar APIs"],
            ["Aceitar um JWT sem validar", "Só decodificar o JWT não prova nada: qualquer um forja o payload", <>Valide assinatura, <code>iss</code>, <code>aud</code> e <code>exp</code> com uma biblioteca madura</>],
            [<>Tokens guardados em <code>localStorage</code></>, "Qualquer XSS rouba o token", <>Prefira cookie <code>HttpOnly</code> para a sessão</>],
            ["Chave de acesso da AWS vazada em repositório ou log", "Credencial fixa sem prazo", "Revogue a chave agora, rode a auditoria no CloudTrail e migre para OIDC"],
          ]}
        />
      </Section>
      <Section id="cheat-au" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Faça"]}
          rows={[
            ["entrar em apps sem digitar senha toda hora", "use SSO (OIDC ou SAML) com um IdP central"],
            ["proteger uma conta além da senha", "MFA com app autenticador ou chave física; passkeys quando houver suporte"],
            ["saber quem é o usuário que entrou", <>OIDC: valide o ID token (assinatura, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nonce</code>)</>],
            ["dar a um app acesso limitado a uma API", "OAuth 2.0 Authorization Code + PKCE, com os menores escopos possíveis"],
            ["um serviço chamar outro, sem usuário", "OAuth Client Credentials"],
            ["o GitHub Actions acessar a AWS sem chave fixa", <>OIDC: provedor na AWS + role com trust policy em <code>aud</code> e <code>sub</code> + <code>id-token: write</code></>],
            ["ver o que o token do job contém", "decodifique o payload (Base64URL) num repositório de teste; nunca publique o token inteiro"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <QA items={[
            ["Qual é a diferença entre autenticação e autorização, e por que o OAuth 2.0 sozinho não serve para “fazer login”?", "Autenticar prova quem você é; autorizar define o que você pode fazer. O OAuth entrega um access token (autorização), que não é uma prova padronizada de identidade; para isso existe o OIDC, com o ID token."],
            ["No fluxo “Entrar com Google”, onde ocorre a autenticação, onde ocorre a autorização e o que o app faz com o ID token?", "A autenticação ocorre no Google (senha, MFA ou passkey); a autorização, na tela de consentimento dos escopos. O app valida o ID token e cria a própria sessão."],
            [<>Na trust policy da role que o GitHub Actions assume, o que <code>aud</code> e <code>sub</code> protegem, e o que acontece se o <code>sub</code> estiver aberto demais?</>, <><code>aud</code> garante que o token foi feito para a AWS; <code>sub</code> garante repositório e branch/environment. Aberto demais, outros repositórios ou branches conseguem assumir a role.</>],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "RFC 6749 · The OAuth 2.0 Authorization Framework", href: "https://datatracker.ietf.org/doc/html/rfc6749" },
          { label: "RFC 6750 · OAuth 2.0 Bearer Token Usage", href: "https://datatracker.ietf.org/doc/html/rfc6750" },
          { label: "RFC 7636 · Proof Key for Code Exchange (PKCE)", href: "https://datatracker.ietf.org/doc/html/rfc7636" },
          { label: "RFC 8628 · OAuth 2.0 Device Authorization Grant", href: "https://datatracker.ietf.org/doc/html/rfc8628" },
          { label: "RFC 9700 · Best Current Practice for OAuth 2.0 Security", href: "https://datatracker.ietf.org/doc/html/rfc9700" },
          { label: "RFC 7519 · JSON Web Token (JWT)", href: "https://datatracker.ietf.org/doc/html/rfc7519" },
          { label: "RFC 8725 · JWT Best Current Practices", href: "https://datatracker.ietf.org/doc/html/rfc8725" },
          { label: "OpenID Connect Core 1.0", href: "https://openid.net/specs/openid-connect-core-1_0.html" },
          { label: "OpenID Connect Discovery 1.0", href: "https://openid.net/specs/openid-connect-discovery-1_0.html" },
          { label: "OASIS · SAML 2.0 specifications", href: "https://docs.oasis-open.org/security/saml/v2.0/" },
          { label: "RFC 4120 · The Kerberos Network Authentication Service (V5)", href: "https://datatracker.ietf.org/doc/html/rfc4120" },
          { label: "RFC 4511 · LDAP: The Protocol", href: "https://datatracker.ietf.org/doc/html/rfc4511" },
          { label: "RFC 6238 · TOTP: Time-Based One-Time Password", href: "https://datatracker.ietf.org/doc/html/rfc6238" },
          { label: "W3C · Web Authentication (WebAuthn)", href: "https://www.w3.org/TR/webauthn-2/" },
          { label: "FIDO Alliance · FIDO2", href: "https://fidoalliance.org/fido2/" },
          { label: "NIST SP 800-63B · Authentication and Lifecycle Management", href: "https://pages.nist.gov/800-63-3/sp800-63b.html" },
          { label: "GitHub Docs · Configuring OpenID Connect in Amazon Web Services", href: "https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws" },
          { label: "GitHub Docs · OpenID Connect reference (claims and sub formats)", href: "https://docs.github.com/en/actions/reference/security/oidc" },
          { label: "GitHub · aws-actions/configure-aws-credentials", href: "https://github.com/aws-actions/configure-aws-credentials" },
          { label: "AWS Docs · Create an OpenID Connect (OIDC) identity provider in IAM", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html" },
          { label: "AWS Docs · Create a role for OpenID Connect federation", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html" },
          { label: "AWS Docs · AssumeRoleWithWebIdentity", href: "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html" },
        ]}
      />
    </>
  );
}
