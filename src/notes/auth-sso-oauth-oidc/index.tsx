import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "auth-sso-oauth-oidc",
  title: { en: "Sign-in and authentication: SSO, OAuth, OIDC and friends", pt: "Login e autenticação: SSO, OAuth, OIDC e companhia" },
  seo: {
    title: { en: "Sign-in and authentication: SSO, OAuth, OIDC and friends", pt: "Login e autenticação: SSO, OAuth, OIDC e companhia" },
    description: { en: "Authentication vs. authorization, passkeys and MFA, SSO, OAuth 2.0, OpenID Connect, SAML, LDAP and Kerberos, a full \"Sign in with Google\" flow, and OIDC from GitHub Actions to AWS without stored keys.", pt: "Autenticação vs. autorização, passkeys e MFA, SSO, OAuth 2.0, OpenID Connect, SAML, LDAP e Kerberos, o fluxo completo de \"Entrar com Google\" e OIDC do GitHub Actions para a AWS sem chaves guardadas." },
  },
  summary: "authentication vs. authorization, MFA and passkeys, SSO, OAuth 2.0, OpenID Connect, SAML, LDAP and Kerberos, a full \"Sign in with Google\" flow, and GitHub Actions to AWS with OIDC (no stored keys), with trust policy, workflow and common errors.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Sign-in and authentication: <em>SSO, OAuth, OIDC and friends.</em></>, pt: <>Login e autenticação: <em>SSO, OAuth, OIDC e companhia.</em></> },
  heroLede: { en: "Who you are, what you may do, and how the standards fit together, ending with GitHub Actions signing in to AWS without stored keys.", pt: "Quem você é, o que você pode fazer e como os padrões se encaixam, terminando com o GitHub Actions entrando na AWS sem chaves guardadas." },
  published: "2026-10-22",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "tldr", title: <T pt="Resumo (TL;DR)" en="Summary (TL;DR)" /> },
        { id: "authn-authz", title: <T pt="Autenticação vs. autorização" en="Authentication vs. authorization" /> },
        { id: "prove", title: <T pt="Formas de provar identidade" en="Ways to prove identity" /> },
        { id: "protocols", title: <T pt="Protocolos e padrões" en="Protocols and standards" /> },
        { id: "glossary", title: <T pt="Glossário" en="Glossary" /> },
        { id: "flow", title: <T pt="Fluxo completo: “Entrar com Google”" en="Full flow: “Sign in with Google”" /> },
        { id: "rule", title: <T pt="Regra de bolso" en="Rule of thumb" /> },
        { id: "actions-aws", title: <T pt="Prática: OIDC no GitHub Actions → AWS" en="Practice: OIDC from GitHub Actions → AWS" /> },
        { id: "errors", title: <T pt="Erros comuns e como resolver" en="Common errors and how to fix them" /> },
        { id: "cheat-au", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="tldr" title={<T pt="Resumo (TL;DR)" en="Summary (TL;DR)" />}>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é o mapa de conceitos de identidade e acesso. Sessões, cookies e JWT do lado de quem constrói o app estão na <a href="/notas/web-app-security/">nota de apps web seguros</a>; o passo a passo completo do deploy está em <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>; o panorama da área, na <a href="/notas/cybersecurity-for-devs/">trilha de cibersegurança</a>.</>} en={<>Where this note fits: it is the concept map for identity and access. Sessions, cookies and JWT from the app builder’s side are in the <a href="/notas/web-app-security/">secure web apps note</a>; the full deploy walkthrough is in <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>; the big picture of the field is in the <a href="/notas/cybersecurity-for-devs/">cybersecurity path</a>.</>} /></Callout>
        <ol className="ds-steps">
          <li><T pt={<><b>Autenticar</b> é provar quem você é; <b>autorizar</b> é decidir o que você pode fazer. São perguntas diferentes e protocolos diferentes.</>} en={<><b>Authenticating</b> is proving who you are; <b>authorizing</b> is deciding what you may do. They are different questions with different protocols.</>} /></li>
          <li><T pt={<><b>OAuth 2.0</b> cuida de autorização (tokens com escopo); <b>OIDC</b> e <b>SAML</b> cuidam de autenticação; <b>SSO</b> é a experiência de entrar uma vez só; <b>MFA</b> reforça a prova de identidade.</>} en={<><b>OAuth 2.0</b> handles authorization (scoped tokens); <b>OIDC</b> and <b>SAML</b> handle authentication; <b>SSO</b> is the log-in-once experience; <b>MFA</b> strengthens the proof of identity.</>} /></li>
          <li><T pt={<>Em CI/CD, use <b>OIDC</b> para o GitHub Actions entrar na AWS com credenciais temporárias, sem chaves de acesso fixas guardadas em secrets.</>} en={<>In CI/CD, use <b>OIDC</b> so GitHub Actions signs in to AWS with temporary credentials, with no fixed access keys stored in secrets.</>} /></li>
        </ol>
      </Section>
      <Section id="authn-authz" title={<T pt="Autenticação vs. autorização" en="Authentication vs. authorization" />}>
        <p><T pt="Dois conceitos que parecem um só e são a fonte da maior parte da confusão nesta área." en="Two concepts that look like one and cause most of the confusion in this area." /></p>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Nome" en="Name" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<T pt="Quem é você?" en="Who are you?" />, <T pt={<><b>Autenticação</b> (AuthN)</>} en={<><b>Authentication</b> (AuthN)</>} />, <T pt="Senha + código do app autenticador" en="Password + authenticator-app code" />],
            [<T pt="O que você pode fazer?" en="What may you do?" />, <T pt={<><b>Autorização</b> (AuthZ)</>} en={<><b>Authorization</b> (AuthZ)</>} />, <T pt="Pode ler o bucket, mas não apagar" en="May read the bucket, but not delete it" />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt={<><b>Analogia do hotel.</b> Na recepção você mostra o documento (autenticação). Em troca, recebe um cartão que abre só o seu quarto e a academia, não os outros quartos (autorização). O cartão não diz o seu nome; só diz o que abre.</>} en={<><b>Hotel analogy.</b> At the front desk you show your ID (authentication). In return you get a key card that opens only your room and the gym, not the other rooms (authorization). The card does not say your name; it only says what it opens.</>} /></Callout>
        <p><T pt="A ordem importa: primeiro se autentica, depois se autoriza. Um sistema que autoriza sem autenticar libera acesso para qualquer um; um que autentica sem autorizar deixa todo mundo logado ver tudo." en="Order matters: authenticate first, then authorize. A system that authorizes without authenticating gives access to anyone; one that authenticates without authorizing lets every logged-in user see everything." /></p>
        <Callout tone="warn" icon="alert"><T pt={<><b>Regra para o resto da nota:</b> toda vez que aparecer OAuth, lembre que ele é sobre <b>autorização</b> (delegar acesso com um token). Saber <i>quem</i> é o usuário é trabalho do OpenID Connect, que roda por cima do OAuth.</>} en={<><b>Rule for the rest of the note:</b> whenever OAuth appears, remember it is about <b>authorization</b> (delegating access with a token). Knowing <i>who</i> the user is is the job of OpenID Connect, which runs on top of OAuth.</>} /></Callout>
      </Section>
      <Section id="prove" title={<T pt="Formas de provar identidade" en="Ways to prove identity" />}>
        <p><T pt={<>Os métodos se agrupam em três tipos de fator: algo que você <b>sabe</b>, algo que você <b>tem</b> e algo que você <b>é</b>.</>} en={<>Methods fall into three kinds of factor: something you <b>know</b>, something you <b>have</b> and something you <b>are</b>.</>} /></p>
        <Table
          head={[<T pt="Método" en="Method" />, <T pt="Fator" en="Factor" />, <T pt="Como funciona" en="How it works" />, <T pt="Ponto de atenção" en="Watch out for" />]}
          rows={[
            [<T pt={<><b>Senha</b></>} en={<><b>Password</b></>} />, <T pt="Sabe" en="Know" />, <T pt="Segredo compartilhado: você e o servidor conhecem o mesmo valor (o servidor guarda um hash)." en="Shared secret: you and the server know the same value (the server stores a hash)." />, <T pt="Reuso, vazamento e phishing. Sozinha é o elo mais fraco." en="Reuse, leaks and phishing. Alone, it is the weakest link." />],
            [<T pt={<><b>MFA / 2FA</b></>} en={<><b>MFA / 2FA</b></>} />, <T pt="Combina fatores" en="Combines factors" />, <T pt="Exige dois ou mais fatores de tipos diferentes (MFA = múltiplos; 2FA = exatamente dois). Ex.: senha + código TOTP (RFC 6238) ou chave de segurança." en="Requires two or more factors of different kinds (MFA = multiple; 2FA = exactly two). E.g. password + TOTP code (RFC 6238) or a security key." />, <T pt="SMS é o mais fraco (troca de chip, interceptação). Prefira app autenticador ou chave física." en="SMS is the weakest (SIM swap, interception). Prefer an authenticator app or a hardware key." />],
            [<T pt={<><b>Passwordless</b></>} en={<><b>Passwordless</b></>} />, <T pt="Tem / É" en="Have / Are" />, <T pt="Entrar sem digitar senha: link ou código por e-mail, notificação no celular ou passkey." en="Signing in without typing a password: emailed link or code, phone prompt or passkey." />, <T pt="Link e código por e-mail só são tão seguros quanto a caixa de e-mail." en="Emailed link and code are only as safe as the mailbox." />],
            [<T pt={<><b>Passkeys</b></>} en={<><b>Passkeys</b></>} />, <T pt="Tem + (É ou Sabe)" en="Have + (Are or Know)" />, <T pt="Par de chaves: a privada fica no seu dispositivo (ou no gerenciador de senhas), o site guarda só a pública. Você desbloqueia com biometria ou PIN do aparelho." en="Key pair: the private key stays on your device (or password manager), the site stores only the public one. You unlock with the device biometrics or PIN." />, <T pt="Resistente a phishing, porque a credencial só funciona no domínio para o qual foi criada. Planeje a recuperação de conta." en="Phishing-resistant, because the credential only works on the domain it was created for. Plan account recovery." />],
            [<T pt={<><b>Biometria</b></>} en={<><b>Biometrics</b></>} />, <T pt="É" en="Are" />, <T pt="Impressão digital, rosto. Em geral só desbloqueia uma chave guardada no aparelho; a digital não vai para o servidor." en="Fingerprint, face. It usually only unlocks a key stored on the device; the fingerprint is not sent to the server." />, <T pt="Não dá para trocar uma digital vazada. Por isso costuma ser um desbloqueio local, não a credencial em si." en="You cannot replace a leaked fingerprint. That is why it is usually a local unlock, not the credential itself." />],
          ]}
        />
        <h3><T pt="WebAuthn, FIDO2 e passkeys: quem é quem" en="WebAuthn, FIDO2 and passkeys: who is who" /></h3>
        <ul className="ds-list">
          <li><T pt={<><b>WebAuthn</b>: API do navegador (padrão do W3C) que cria e usa as credenciais de chave pública.</>} en={<><b>WebAuthn</b>: the browser API (a W3C standard) that creates and uses public-key credentials.</>} /></li>
          <li><T pt={<><b>FIDO2</b>: conjunto da FIDO Alliance formado por WebAuthn (navegador ↔ site) e CTAP (navegador ↔ chave de segurança).</>} en={<><b>FIDO2</b>: the FIDO Alliance set made of WebAuthn (browser ↔ site) and CTAP (browser ↔ security key).</>} /></li>
          <li><T pt={<><b>Passkey</b>: o nome amigável de uma credencial FIDO/WebAuthn, muitas vezes sincronizada entre os dispositivos do usuário.</>} en={<><b>Passkey</b>: the friendly name for a FIDO/WebAuthn credential, often synced across the user’s devices.</>} /></li>
        </ul>
      </Section>
      <Section id="protocols" title={<T pt="Protocolos e padrões" en="Protocols and standards" />}>
        <h3><T pt="SSO: um conceito, não um protocolo" en="SSO: a concept, not a protocol" /></h3>
        <p><T pt={<><b>Single Sign-On</b> é a experiência de entrar uma vez e usar vários sistemas sem digitar a senha de novo. Não existe um “protocolo SSO”: ele é implementado com OIDC, SAML ou Kerberos. O que as apps têm em comum é confiar no mesmo provedor de identidade.</>} en={<><b>Single Sign-On</b> is the experience of signing in once and using several systems without typing the password again. There is no “SSO protocol”: it is implemented with OIDC, SAML or Kerberos. What the apps share is trusting the same identity provider.</>} /></p>
        <h3><T pt="OAuth 2.0 (autorização)" en="OAuth 2.0 (authorization)" /></h3>
        <p><T pt={<>Framework (RFC 6749) para um app obter <b>acesso limitado</b> a algo seu sem receber a sua senha. É a analogia da chave de manobrista: ela liga o carro, mas não abre o porta-malas. O resultado é um <b>access token</b> com <b>escopos</b>.</>} en={<>A framework (RFC 6749) for an app to get <b>limited access</b> to something of yours without receiving your password. Think of a valet key: it starts the car but does not open the trunk. The result is an <b>access token</b> with <b>scopes</b>.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><b>OAuth é autorização, não autenticação.</b> O access token diz “quem o carrega pode fazer X”; ele não é uma prova padronizada de quem é o usuário. Usar só OAuth para “fazer login” é um erro clássico: para isso existe o OIDC.</>} en={<><b>OAuth is authorization, not authentication.</b> The access token says “whoever holds it may do X”; it is not a standardized proof of who the user is. Using plain OAuth to “log in” is a classic mistake: that is what OIDC is for.</>} /></Callout>
        <Table
          head={[<T pt="Fluxo (grant)" en="Flow (grant)" />, <T pt="Quando usar" en="When to use" />]}
          rows={[
            [<b>Authorization Code + PKCE</b>, <T pt="Apps web, mobile e SPAs com usuário. É o recomendado hoje (PKCE: RFC 7636)." en="Web, mobile and SPA apps with a user. The recommended one today (PKCE: RFC 7636)." />],
            [<b>Client Credentials</b>, <T pt="Máquina para máquina, sem usuário (um serviço chamando outro)." en="Machine to machine, no user (one service calling another)." />],
            [<b>Device Code</b>, <T pt="TVs e CLIs, sem teclado confortável (RFC 8628)." en="TVs and CLIs, without a comfortable keyboard (RFC 8628)." />],
            [<><b>Implicit</b> e <b>Password</b></>, <T pt="Evite: são desencorajados pelas práticas atuais de segurança do OAuth (RFC 9700)." en="Avoid: discouraged by current OAuth security practice (RFC 9700)." />],
          ]}
        />
        <h3><T pt="OpenID Connect, OIDC (autenticação)" en="OpenID Connect, OIDC (authentication)" /></h3>
        <p><T pt={<>Camada de identidade <b>sobre o OAuth 2.0</b>. Acrescenta o escopo <code>openid</code>, o <b>ID token</b> (um JWT com claims sobre o usuário e sobre o login), o endpoint <code>userinfo</code> e um documento de descoberta em <code>/.well-known/openid-configuration</code>. Responde “quem é este usuário?”.</>} en={<>An identity layer <b>on top of OAuth 2.0</b>. It adds the <code>openid</code> scope, the <b>ID token</b> (a JWT with claims about the user and the login), the <code>userinfo</code> endpoint and a discovery document at <code>/.well-known/openid-configuration</code>. It answers “who is this user?”.</>} /></p>
        <h3><T pt="SAML 2.0 (autenticação, mundo corporativo)" en="SAML 2.0 (authentication, enterprise world)" /></h3>
        <p><T pt={<>Padrão mais antigo, baseado em <b>XML</b>. O provedor de identidade devolve uma <b>assertion</b> assinada ao app via navegador. Muito comum em ferramentas corporativas (SaaS B2B). Faz o mesmo papel do OIDC; apps novas costumam preferir OIDC por ser mais simples (JSON/JWT).</>} en={<>An older standard based on <b>XML</b>. The identity provider returns a signed <b>assertion</b> to the app through the browser. Very common in enterprise tools (B2B SaaS). It plays the same role as OIDC; new apps usually prefer OIDC because it is simpler (JSON/JWT).</>} /></p>
        <h3><T pt="LDAP e Active Directory" en="LDAP and Active Directory" /></h3>
        <p><T pt={<><b>LDAP</b> (RFC 4511) é um protocolo para consultar e autenticar contra um <b>diretório</b> de usuários, grupos e dispositivos. <b>Active Directory (AD)</b> é o serviço de diretório da Microsoft, que fala LDAP e Kerberos; <b>Microsoft Entra ID</b> (antigo Azure AD) é a versão em nuvem, acessada com OIDC e SAML.</>} en={<><b>LDAP</b> (RFC 4511) is a protocol to query and authenticate against a <b>directory</b> of users, groups and devices. <b>Active Directory (AD)</b> is Microsoft’s directory service, which speaks LDAP and Kerberos; <b>Microsoft Entra ID</b> (formerly Azure AD) is the cloud version, reached with OIDC and SAML.</>} /></p>
        <h3><T pt="Kerberos" en="Kerberos" /></h3>
        <p><T pt={<>Autenticação por <b>tickets</b> dentro de uma rede corporativa (RFC 4120). Você prova a identidade uma vez a um servidor central (o KDC) e recebe um ticket que as outras máquinas aceitam. É a base do “login do Windows que vale para tudo” em domínios AD.</>} en={<>Authentication by <b>tickets</b> inside a corporate network (RFC 4120). You prove your identity once to a central server (the KDC) and get a ticket that other machines accept. It is the base of the “Windows login that works everywhere” in AD domains.</>} /></p>
        <Table
          head={[<T pt="Padrão" en="Standard" />, <T pt="Responde" en="Answers" />, <T pt="Formato" en="Format" />, <T pt="Onde aparece" en="Where you see it" />]}
          rows={[
            [<b>OAuth 2.0</b>, <T pt="O que posso acessar?" en="What may I access?" />, "Access token", <T pt="APIs, “Permitir que o app acesse seu GitHub”" en="APIs, “Allow the app to access your GitHub”" />],
            [<b>OIDC</b>, <T pt="Quem é o usuário?" en="Who is the user?" />, "ID token (JWT)", <T pt="“Entrar com Google”, GitHub Actions → AWS" en="“Sign in with Google”, GitHub Actions → AWS" />],
            [<b>SAML 2.0</b>, <T pt="Quem é o usuário?" en="Who is the user?" />, "Assertion (XML)", <T pt="SaaS corporativo, SSO da empresa" en="Enterprise SaaS, company SSO" />],
            [<b>LDAP</b>, <T pt="Quem existe e em quais grupos?" en="Who exists and in which groups?" />, <T pt="Consultas ao diretório" en="Directory queries" />, <T pt="Servidores Linux, VPN, apps internas" en="Linux servers, VPN, internal apps" />],
            [<b>Kerberos</b>, <T pt="Quem é o usuário na rede?" en="Who is the user on the network?" />, "Tickets", <T pt="Domínio Windows/AD" en="Windows/AD domain" />],
          ]}
        />
      </Section>
      <Section id="glossary" title={<T pt="Glossário" en="Glossary" />}>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<><b>IdP</b> (Identity Provider)</>, <T pt="Quem autentica o usuário e emite a prova de identidade. Ex.: Google, Okta, Entra ID, e o GitHub Actions para os jobs." en="Who authenticates the user and issues the proof of identity. E.g. Google, Okta, Entra ID, and GitHub Actions for jobs." />],
            [<><b>SP</b> / <b>Relying Party</b> (RP)</>, <T pt="O app que confia no IdP. “SP” (Service Provider) é o termo do SAML; “Relying Party” é o do OIDC. Na AWS, o papel de RP é do IAM/STS." en="The app that trusts the IdP. “SP” (Service Provider) is the SAML term; “Relying Party” is the OIDC one. In the GitHub-to-AWS case, AWS IAM/STS plays the RP." />],
            [<b>Token</b>, <T pt={<>Texto que representa uma prova ou uma permissão, com prazo. <i>Access token</i>: autoriza chamar uma API. <i>ID token</i>: diz quem é o usuário. <i>Refresh token</i>: obtém novos access tokens.</>} en={<>Text that represents a proof or a permission, with an expiry. <i>Access token</i>: authorizes calling an API. <i>ID token</i>: says who the user is. <i>Refresh token</i>: gets new access tokens.</>} />],
            [<><b>JWT</b> (JSON Web Token)</>, <T pt={<>Formato de token (RFC 7519): três partes em Base64URL separadas por ponto (cabeçalho, payload, assinatura). Fica <b>assinado</b>, não escondido: qualquer um lê o conteúdo, só quem tem a chave o forja.</>} en={<>Token format (RFC 7519): three Base64URL parts separated by dots (header, payload, signature). It is <b>signed</b>, not hidden: anyone can read the content, only the key holder can forge it.</>} />],
            [<><b>Sessão</b> / <b>cookie</b></>, <T pt={<>Depois do login, o app cria uma sessão e guarda um identificador num cookie. Os requests seguintes mostram o cookie em vez de pedir login de novo. Use <code>HttpOnly</code>, <code>Secure</code> e <code>SameSite</code>.</>} en={<>After login, the app creates a session and stores an identifier in a cookie. Later requests show the cookie instead of asking for login again. Use <code>HttpOnly</code>, <code>Secure</code> and <code>SameSite</code>.</>} />],
            [<b>API key</b>, <T pt="Segredo fixo que identifica um app ou projeto. Simples, mas não tem usuário, prazo nem escopo por padrão: se vazar, vale até alguém revogar." en="Fixed secret that identifies an app or project. Simple, but has no user, expiry or scope by default: if leaked, it works until someone revokes it." />],
            [<><b>RBAC</b> (Role-Based Access Control)</>, <T pt={<>Autorização por papéis: você recebe um papel (ex.: <i>deploy</i>) e o papel concede as permissões. Na AWS, o equivalente são as <b>roles</b> do IAM.</>} en={<>Authorization by roles: you get a role (e.g. <i>deploy</i>) and the role grants the permissions. On AWS, the equivalent is IAM <b>roles</b>.</>} />],
            [<><b>Scope</b> (escopo)</>, <T pt={<>Permissão pedida num token OAuth. Ex.: <code>read:user</code>, <code>email</code>, <code>openid</code>. O usuário vê e aprova na tela de consentimento.</>} en={<>Permission requested in an OAuth token. E.g. <code>read:user</code>, <code>email</code>, <code>openid</code>. The user sees and approves it on the consent screen.</>} />],
            [<b>Claim</b>, <T pt={<>Uma afirmação dentro do token: um par nome/valor. Ex.: <code>sub</code> (quem), <code>iss</code> (quem emitiu), <code>aud</code> (para quem), <code>exp</code> (quando expira).</>} en={<>A statement inside the token: a name/value pair. E.g. <code>sub</code> (who), <code>iss</code> (who issued it), <code>aud</code> (for whom), <code>exp</code> (when it expires).</>} />],
          ]}
        />
      </Section>
      <Section id="flow" title={<T pt="Fluxo completo: “Entrar com Google”" en="Full flow: “Sign in with Google”" />}>
        <p><T pt="Usa OIDC sobre OAuth 2.0, com o fluxo Authorization Code + PKCE. O app é a Relying Party; o Google, o IdP." en="Uses OIDC on top of OAuth 2.0, with the Authorization Code + PKCE flow. The app is the Relying Party; Google is the IdP." /></p>
        <ol className="ds-steps">
          <li><T pt={<>O usuário clica em <b>Entrar com Google</b> no app.</>} en={<>The user clicks <b>Sign in with Google</b> in the app.</>} /></li>
          <li><T pt={<>O app gera <code>state</code> (anti-CSRF), <code>nonce</code> (anti-replay do ID token) e um par PKCE (<code>code_verifier</code> secreto e <code>code_challenge</code> derivado).</>} en={<>The app generates <code>state</code> (anti-CSRF), <code>nonce</code> (ID-token anti-replay) and a PKCE pair (secret <code>code_verifier</code> and derived <code>code_challenge</code>).</>} /></li>
          <li><T pt={<>O app redireciona o navegador para o endpoint de autorização do Google com <code>client_id</code>, <code>redirect_uri</code>, <code>response_type=code</code>, <code>scope=openid email profile</code>, <code>state</code>, <code>nonce</code> e <code>code_challenge</code>.</>} en={<>The app redirects the browser to Google’s authorization endpoint with <code>client_id</code>, <code>redirect_uri</code>, <code>response_type=code</code>, <code>scope=openid email profile</code>, <code>state</code>, <code>nonce</code> and <code>code_challenge</code>.</>} /></li>
          <li><T pt={<><b>[Autenticação]</b> O Google verifica quem é o usuário: senha, MFA ou passkey. Se já há sessão ativa no Google, é aqui que o SSO acontece e nada é digitado.</>} en={<><b>[Authentication]</b> Google checks who the user is: password, MFA or passkey. If there is already an active Google session, this is where SSO happens and nothing is typed.</>} /></li>
          <li><T pt={<><b>[Autorização]</b> O Google mostra a tela de consentimento: “o app quer ver seu nome e e-mail”. O usuário aprova os escopos.</>} en={<><b>[Authorization]</b> Google shows the consent screen: “the app wants to see your name and email”. The user approves the scopes.</>} /></li>
          <li><T pt={<>O Google redireciona de volta ao <code>redirect_uri</code> com um <code>code</code> de uso único e o <code>state</code>.</>} en={<>Google redirects back to the <code>redirect_uri</code> with a one-time <code>code</code> and the <code>state</code>.</>} /></li>
          <li><T pt={<>O app confere que o <code>state</code> é o mesmo que enviou. Se não for, aborta.</>} en={<>The app checks that <code>state</code> is the one it sent. If not, it aborts.</>} /></li>
          <li><T pt={<>O <b>backend</b> do app troca o <code>code</code> por tokens no endpoint de token do Google, enviando também o <code>code_verifier</code>.</>} en={<>The app’s <b>backend</b> exchanges the <code>code</code> for tokens at Google’s token endpoint, also sending the <code>code_verifier</code>.</>} /></li>
          <li><T pt={<>O Google devolve o <b>ID token</b> (JWT, diz quem é), o <b>access token</b> (autoriza chamar APIs do Google) e, às vezes, um refresh token.</>} en={<>Google returns the <b>ID token</b> (JWT, says who it is), the <b>access token</b> (authorizes calling Google APIs) and, sometimes, a refresh token.</>} /></li>
          <li><T pt={<>O app <b>valida o ID token</b>: assinatura (chaves públicas do IdP), <code>iss</code>, <code>aud</code> igual ao seu <code>client_id</code>, <code>exp</code> e <code>nonce</code>.</>} en={<>The app <b>validates the ID token</b>: signature (the IdP’s public keys), <code>iss</code>, <code>aud</code> equal to your <code>client_id</code>, <code>exp</code> and <code>nonce</code>.</>} /></li>
          <li><T pt={<>O app cria a <b>sessão</b> própria (cookie <code>HttpOnly</code>). A partir daí o Google já saiu de cena; o access token só é usado se o app precisar chamar APIs do Google.</>} en={<>The app creates its own <b>session</b> (<code>HttpOnly</code> cookie). From then on Google is out of the picture; the access token is only used if the app needs to call Google APIs.</>} /></li>
        </ol>
        <Callout icon="check"><T pt="Os endpoints exatos (autorização, token, chaves públicas) estão no documento de descoberta do IdP. Para o Google, confira a documentação oficial de OpenID Connect." en="The exact endpoints (authorization, token, public keys) are in the IdP’s discovery document. For Google, check the official OpenID Connect documentation." /></Callout>
      </Section>
      <Section id="rule" title={<T pt="Regra de bolso" en="Rule of thumb" />}>
        <ul className="ds-list">
          <li><T pt={<><b>OAuth 2.0</b> = autorização. “Este app pode acessar isto, com estes escopos.”</>} en={<><b>OAuth 2.0</b> = authorization. “This app may access this, with these scopes.”</>} /></li>
          <li><T pt={<><b>OIDC</b> = autenticação, em cima do OAuth. “Este usuário é fulano.”</>} en={<><b>OIDC</b> = authentication, on top of OAuth. “This user is so-and-so.”</>} /></li>
          <li><T pt={<><b>SAML</b> = autenticação, com XML, no mundo corporativo.</>} en={<><b>SAML</b> = authentication, with XML, in the enterprise world.</>} /></li>
          <li><T pt={<><b>SSO</b> = experiência: entrar uma vez, usar várias apps. Implementado com OIDC, SAML ou Kerberos.</>} en={<><b>SSO</b> = experience: sign in once, use several apps. Implemented with OIDC, SAML or Kerberos.</>} /></li>
          <li><T pt={<><b>MFA</b> = reforço: mais de um fator para provar a identidade.</>} en={<><b>MFA</b> = reinforcement: more than one factor to prove identity.</>} /></li>
          <li><T pt={<><b>JWT</b> = formato do token, não um protocolo.</>} en={<><b>JWT</b> = the token format, not a protocol.</>} /></li>
          <li><T pt={<><b>LDAP / AD</b> = o diretório de usuários; <b>Kerberos</b> = tickets na rede interna.</>} en={<><b>LDAP / AD</b> = the user directory; <b>Kerberos</b> = tickets on the internal network.</>} /></li>
        </ul>
      </Section>
      <Section id="actions-aws" title={<T pt="Prática: OIDC no GitHub Actions → AWS" en="Practice: OIDC from GitHub Actions → AWS" />}>
        <p><T pt={<>Aqui o “usuário” é um job de CI/CD. O GitHub é o IdP, a AWS é quem confia, e o resultado são credenciais temporárias no lugar de uma chave de acesso fixa (<code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code>) guardada em secrets. A troca de credenciais é <b>autenticação</b> (o token prova qual repositório e branch pediram) seguida de <b>autorização</b> (a role define o que pode ser feito).</>} en={<>Here the “user” is a CI/CD job. GitHub is the IdP, AWS is the one that trusts it, and the result is temporary credentials instead of a fixed access key (<code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code>) stored in secrets. The exchange is <b>authentication</b> (the token proves which repository and branch asked) followed by <b>authorization</b> (the role defines what may be done).</>} /></p>
        <h3><T pt="Diagrama do fluxo" en="Flow diagram" /></h3>
        <Diagram minWidth={560} caption={<T pt="O job nunca guarda segredo: o GitHub assina uma prova de identidade por execução e a AWS troca essa prova por credenciais de curta duração." en="The job never stores a secret: GitHub signs a proof of identity per run and AWS swaps that proof for short-lived credentials." />}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Fluxo OIDC do GitHub Actions para a AWS / GitHub Actions to AWS OIDC flow">
            <rect x="10" y="100" width="140" height="50" rx="4" className="ln fillsoft" />
            <text x="80" y="122" className="pt" textAnchor="middle">Job do Actions</text>
            <text x="80" y="122" className="en" textAnchor="middle">Actions job</text>
            <text x="80" y="140" className="pt mut mono" textAnchor="middle">id-token: write</text>
            <text x="80" y="140" className="en mut mono" textAnchor="middle">id-token: write</text>
            <rect x="260" y="10" width="200" height="50" rx="4" className="ln" />
            <text x="360" y="32" className="pt" textAnchor="middle">GitHub OIDC (IdP)</text>
            <text x="360" y="32" className="en" textAnchor="middle">GitHub OIDC (IdP)</text>
            <text x="360" y="50" className="pt mut" textAnchor="middle">emite o JWT assinado</text>
            <text x="360" y="50" className="en mut" textAnchor="middle">issues the signed JWT</text>
            <rect x="540" y="100" width="150" height="50" rx="4" className="brandfill" />
            <text x="615" y="122" className="pt" textAnchor="middle">AWS STS + IAM</text>
            <text x="615" y="122" className="en" textAnchor="middle">AWS STS + IAM</text>
            <text x="615" y="140" className="pt" textAnchor="middle">role + trust policy</text>
            <text x="615" y="140" className="en" textAnchor="middle">role + trust policy</text>
            <rect x="540" y="195" width="150" height="40" rx="4" className="ln" />
            <text x="615" y="220" className="pt" textAnchor="middle">ECR / ECS / S3 ...</text>
            <text x="615" y="220" className="en" textAnchor="middle">ECR / ECS / S3 ...</text>
            <path d="M95 100L260 45" className="ln" />
            <path d="M252.0 46.4L260 45L254.8 51.7" className="ln" />
            <path d="M260 52L110 100" className="ln" />
            <path d="M118.3 98.6L110 100L115.4 93.3" className="ln" />
            <text x="55" y="68" className="pt" textAnchor="start">1. pede o token</text>
            <text x="55" y="68" className="en" textAnchor="start">1. asks for the token</text>
            <text x="270" y="82" className="pt mut" textAnchor="start">2. JWT assinado</text>
            <text x="270" y="82" className="en mut" textAnchor="start">2. signed JWT</text>
            <path d="M150 118L540 118" className="ln" />
            <path d="M532.7 114.7L540 118L532.7 121.3" className="ln" />
            <text x="345" y="112" className="pt" textAnchor="middle">3. AssumeRoleWithWebIdentity + JWT</text>
            <text x="345" y="112" className="en" textAnchor="middle">3. AssumeRoleWithWebIdentity + JWT</text>
            <path d="M540 134L150 134" className="ln" />
            <path d="M157.3 130.7L150 134L157.3 137.3" className="ln" />
            <text x="345" y="152" className="pt" textAnchor="middle">4. credenciais temporárias</text>
            <text x="345" y="152" className="en" textAnchor="middle">4. temporary credentials</text>
            <path d="M600 100L470 55" className="ln dash" />
            <text x="565" y="84" className="pt mut" textAnchor="start">valida a assinatura</text>
            <text x="565" y="84" className="en mut" textAnchor="start">verifies the signature</text>
            <path d="M80 150L80 215L540 215" className="ln" />
            <path d="M532.7 211.7L540 215L532.7 218.3" className="ln" />
            <text x="300" y="208" className="pt" textAnchor="middle">5. usa as credenciais (expiram sozinhas)</text>
            <text x="300" y="208" className="en" textAnchor="middle">5. uses the credentials (they expire on their own)</text>
          </svg>
        </Diagram>
        <h3><T pt="Passo 0: criar o provedor OIDC na AWS (uma vez por conta)" en="Step 0: create the OIDC provider in AWS (once per account)" /></h3>
        <ul className="ds-list">
          <li><T pt={<><b>Provider URL</b>: <code>https://token.actions.githubusercontent.com</code></>} en={<><b>Provider URL</b>: <code>https://token.actions.githubusercontent.com</code></>} /></li>
          <li><T pt={<><b>Audience</b>: <code>sts.amazonaws.com</code></>} en={<><b>Audience</b>: <code>sts.amazonaws.com</code></>} /></li>
        </ul>
        <p><T pt={<>O passo a passo completo (console e CLI, duas contas, environments, secrets) está na nota <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>. Aqui ficam o mínimo e a teoria.</>} en={<>The full walkthrough (console and CLI, two accounts, environments, secrets) is in the note <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>. Here you get the minimum and the theory.</>} /></p>
        <h3><T pt="Trust policy da role IAM" en="IAM role trust policy" /></h3>
        <p><T pt={<>A trust policy diz <b>quem pode assumir</b> a role. As duas condições são o coração da segurança: <code>aud</code> garante que o token foi feito para a AWS e <code>sub</code> garante que veio do seu repositório e da sua branch.</>} en={<>The trust policy says <b>who may assume</b> the role. The two conditions are the heart of the security: <code>aud</code> makes sure the token was meant for AWS and <code>sub</code> makes sure it came from your repository and your branch.</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<>Nunca deixe o <code>sub</code> só com curinga. Sem ele restringido, outro repositório do GitHub poderia pedir a role. Se o job usa um <i>environment</i>, o <code>sub</code> muda para <code>repo:ORG/REPO:environment:NOME</code>. Repositórios novos podem usar um formato com IDs numéricos: confira os formatos atuais na documentação do GitHub.</>} en={<>Never leave <code>sub</code> as just a wildcard. Without it restricted, another GitHub repository could request the role. If the job uses an <i>environment</i>, <code>sub</code> becomes <code>repo:ORG/REPO:environment:NAME</code>. New repositories may use a format with numeric IDs: check the current formats in the GitHub documentation.</>} /></Callout>
        <h3><T pt="Workflow do GitHub Actions" en="GitHub Actions workflow" /></h3>
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
        <p><T pt={<>Sem <code>permissions: id-token: write</code> o job não consegue pedir o token e a ação falha. A action <code>configure-aws-credentials</code> faz o passo 3 do diagrama e exporta as credenciais temporárias para os passos seguintes. Confira na página da action as versões e opções atuais.</>} en={<>Without <code>permissions: id-token: write</code> the job cannot request the token and the action fails. The <code>configure-aws-credentials</code> action performs step 3 of the diagram and exports the temporary credentials to the following steps. Check the action’s page for current versions and options.</>} /></p>
        <h3><T pt="Claims do token" en="Token claims" /></h3>
        <p><T pt={<>Esse é o <i>payload</i> de um token do GitHub (valores de exemplo). É isso que a AWS compara com a trust policy.</>} en={<>This is the <i>payload</i> of a GitHub token (example values). This is what AWS compares against the trust policy.</>} /></p>
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
          head={[<T pt="Claim" en="Claim" />, <T pt="Significado" en="Meaning" />, <T pt="Uso na segurança" en="Use in security" />]}
          rows={[
            [<code>iss</code>, <T pt="Quem emitiu (o GitHub)" en="Who issued it (GitHub)" />, <T pt="Identifica o provedor OIDC cadastrado na AWS" en="Identifies the OIDC provider registered in AWS" />],
            [<code>aud</code>, <T pt="Para quem o token foi feito" en="Who the token was made for" />, <T pt={<>Condição obrigatória: <code>sts.amazonaws.com</code></>} en={<>Required condition: <code>sts.amazonaws.com</code></>} />],
            [<code>sub</code>, <T pt="Quem pede: repositório + branch, tag, PR ou environment" en="Who is asking: repository + branch, tag, PR or environment" />, <T pt="Principal condição de restrição" en="Main restricting condition" />],
            [<><code>repository</code>, <code>repository_owner</code></>, <T pt="Repositório e dono" en="Repository and owner" />, <T pt="Úteis em políticas por organização" en="Useful in organization-wide policies" />],
            [<><code>ref</code>, <code>sha</code></>, <T pt="Branch/tag e commit" en="Branch/tag and commit" />, <T pt="Auditoria: qual código rodou" en="Audit: which code ran" />],
            [<code>job_workflow_ref</code>, <T pt="Qual arquivo de workflow rodou" en="Which workflow file ran" />, <T pt="Permite amarrar a role a um workflow específico (verifique o suporte na documentação)" en="Lets you tie the role to a specific workflow (check support in the documentation)" />],
            [<><code>iat</code>, <code>nbf</code>, <code>exp</code></>, <T pt="Emitido em, válido a partir de, expira em" en="Issued at, not valid before, expires at" />, <T pt="O token é de curta duração" en="The token is short-lived" />],
          ]}
        />
        <p><T pt="Para ver os claims reais do seu job, decodifique o token em um passo de teste do workflow (o payload do JWT é Base64URL). Faça isso só em um repositório de teste, e não publique o token inteiro nos logs." en="To see the real claims of your job, decode the token in a test step of the workflow (the JWT payload is Base64URL). Do this only in a test repository, and do not publish the whole token in the logs." /></p>
        <h3><T pt="Boas práticas de segurança" en="Security best practices" /></h3>
        <ul className="ds-list">
          <li><T pt={<><b>Uma role por ambiente</b> (develop, production), cada uma com a sua trust policy e o mínimo de permissões (menor privilégio).</>} en={<><b>One role per environment</b> (develop, production), each with its own trust policy and minimum permissions (least privilege).</>} /></li>
          <li><T pt={<><b>Restrinja o <code>sub</code> ao máximo</b>: repositório e branch/environment exatos. Use <code>StringEquals</code> sempre que der.</>} en={<><b>Restrict <code>sub</code> as much as possible</b>: exact repository and branch/environment. Use <code>StringEquals</code> whenever you can.</>} /></li>
          <li><T pt={<><b>Environments com aprovação</b> para produção: o deploy só segue depois de um revisor aprovar.</>} en={<><b>Environments with approval</b> for production: the deploy only proceeds after a reviewer approves.</>} /></li>
          <li><T pt={<><b>Permissões mínimas no workflow</b>: declare <code>permissions</code> explicitamente em vez de herdar o padrão.</>} en={<><b>Minimal workflow permissions</b>: declare <code>permissions</code> explicitly instead of inheriting the default.</>} /></li>
          <li><T pt={<><b>Cuidado com PRs de forks e com <code>pull_request_target</code></b>: não dê a role de deploy para código que você não revisou.</>} en={<><b>Careful with fork PRs and <code>pull_request_target</code></b>: do not hand the deploy role to code you have not reviewed.</>} /></li>
          <li><T pt={<><b>Fixe versões de actions de terceiros</b> (por SHA do commit, quando possível), porque elas rodam no job que tem a role.</>} en={<><b>Pin third-party action versions</b> (by commit SHA when possible), because they run in the job that holds the role.</>} /></li>
          <li><T pt={<><b>Remova as chaves antigas</b>: depois de migrar, apague o usuário IAM e as chaves fixas que existiam.</>} en={<><b>Remove the old keys</b>: after migrating, delete the IAM user and the fixed keys that existed.</>} /></li>
          <li><T pt={<><b>Audite</b>: o CloudTrail registra <code>AssumeRoleWithWebIdentity</code> com o token usado; monitore usos inesperados.</>} en={<><b>Audit</b>: CloudTrail records <code>AssumeRoleWithWebIdentity</code> with the token used; monitor unexpected uses.</>} /></li>
        </ul>
      </Section>
      <Section id="errors" title={<T pt="Erros comuns e como resolver" en="Common errors and how to fix them" />}>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />, <T pt="Como resolver" en="How to fix" />]}
          rows={[
            [<><code>Credentials could not be loaded</code> / falha ao pegar o token</>, <T pt={<>Falta <code>permissions: id-token: write</code> (ou o <code>permissions</code> do workflow o removeu)</>} en={<>Missing <code>permissions: id-token: write</code> (or the workflow <code>permissions</code> removed it)</>} />, <T pt="Adicione a permissão no workflow ou no job" en="Add the permission to the workflow or job" />],
            [<code>Not authorized to perform sts:AssumeRoleWithWebIdentity</code>, <T pt={<>O <code>sub</code> ou o <code>aud</code> do token não bate com a trust policy</>} en={<>The token’s <code>sub</code> or <code>aud</code> does not match the trust policy</>} />, <T pt={<>Compare os claims reais com a condição; confira branch × environment × PR e o formato do <code>sub</code></>} en={<>Compare the real claims with the condition; check branch × environment × PR and the <code>sub</code> format</>} />],
            [<>Funciona na <code>main</code>, falha no pull request</>, <T pt={<>No PR o <code>sub</code> é <code>repo:ORG/REPO:pull_request</code></>} en={<>On a PR, <code>sub</code> is <code>repo:ORG/REPO:pull_request</code></>} />, <T pt="Use uma role separada, de leitura, para PRs; não afrouxe a de deploy" en="Use a separate read-only role for PRs; do not loosen the deploy one" />],
            [<code>No OpenIDConnect provider found in your account</code>, <T pt="O provedor OIDC não existe na conta em que a role está" en="The OIDC provider does not exist in the account that holds the role" />, <T pt="Crie o provedor em cada conta que tem a role" en="Create the provider in every account that has the role" />],
            [<>Erro de audiência (<code>aud</code>)</>, <T pt="A condição espera outro valor que o do token" en="The condition expects a different value than the token" />, <T pt={<>Use <code>sts.amazonaws.com</code> nos dois lados, a menos que você tenha mudado a audience de propósito</>} en={<>Use <code>sts.amazonaws.com</code> on both sides, unless you changed the audience on purpose</>} />],
            [<><code>redirect_uri_mismatch</code> (OAuth/OIDC com Google etc.)</>, <T pt="A URL de retorno enviada difere da cadastrada no IdP" en="The return URL sent differs from the one registered at the IdP" />, <T pt="Cadastre a URL exata (protocolo, domínio, caminho e barra final)" en="Register the exact URL (scheme, domain, path and trailing slash)" />],
            [<><code>invalid_grant</code> na troca do code</>, <T pt={<>Code expirado ou já usado, ou <code>code_verifier</code> não corresponde ao <code>code_challenge</code></>} en={<>Code expired or already used, or <code>code_verifier</code> does not match the <code>code_challenge</code></>} />, <T pt="Troque o code uma única vez, logo após o retorno; guarde o verifier por sessão" en="Exchange the code only once, right after the return; keep the verifier per session" />],
            ["Login em loop / sessão some após o retorno", <T pt={<>Cookie de sessão bloqueado (<code>SameSite</code>, <code>Secure</code> em HTTP, domínio errado)</>} en={<>Session cookie blocked (<code>SameSite</code>, <code>Secure</code> over HTTP, wrong domain)</>} />, <T pt="Revise os atributos do cookie e use HTTPS" en="Review the cookie attributes and use HTTPS" />],
            ["Usar o access token para “saber quem é o usuário”", <T pt="Confusão entre autorização e autenticação" en="Mixing up authorization and authentication" />, <T pt="Use o ID token (OIDC), validado, para identidade; o access token é para chamar APIs" en="Use the validated ID token (OIDC) for identity; the access token is for calling APIs" />],
            ["Aceitar um JWT sem validar", <T pt="Só decodificar o JWT não prova nada: qualquer um forja o payload" en="Just decoding a JWT proves nothing: anyone can forge the payload" />, <T pt={<>Valide assinatura, <code>iss</code>, <code>aud</code> e <code>exp</code> com uma biblioteca madura</>} en={<>Validate signature, <code>iss</code>, <code>aud</code> and <code>exp</code> with a mature library</>} />],
            [<>Tokens guardados em <code>localStorage</code></>, <T pt="Qualquer XSS rouba o token" en="Any XSS steals the token" />, <T pt={<>Prefira cookie <code>HttpOnly</code> para a sessão</>} en={<>Prefer an <code>HttpOnly</code> cookie for the session</>} />],
            ["Chave de acesso da AWS vazada em repositório ou log", <T pt="Credencial fixa sem prazo" en="Fixed credential with no expiry" />, <T pt="Revogue a chave agora, rode a auditoria no CloudTrail e migre para OIDC" en="Revoke the key now, audit CloudTrail and migrate to OIDC" />],
          ]}
        />
      </Section>
      <Section id="cheat-au" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faça" en="Do" />]}
          rows={[
            [<T pt="entrar em apps sem digitar senha toda hora" en="sign in to apps without retyping the password" />, <T pt="use SSO (OIDC ou SAML) com um IdP central" en="use SSO (OIDC or SAML) with a central IdP" />],
            [<T pt="proteger uma conta além da senha" en="protect an account beyond the password" />, <T pt="MFA com app autenticador ou chave física; passkeys quando houver suporte" en="MFA with an authenticator app or hardware key; passkeys where supported" />],
            [<T pt="saber quem é o usuário que entrou" en="know who the signed-in user is" />, <T pt={<>OIDC: valide o ID token (assinatura, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nonce</code>)</>} en={<>OIDC: validate the ID token (signature, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nonce</code>)</>} />],
            [<T pt="dar a um app acesso limitado a uma API" en="give an app limited access to an API" />, <T pt="OAuth 2.0 Authorization Code + PKCE, com os menores escopos possíveis" en="OAuth 2.0 Authorization Code + PKCE, with the smallest possible scopes" />],
            [<T pt="um serviço chamar outro, sem usuário" en="one service calling another, no user" />, <T pt="OAuth Client Credentials" en="OAuth Client Credentials" />],
            [<T pt="o GitHub Actions acessar a AWS sem chave fixa" en="GitHub Actions to reach AWS with no fixed key" />, <T pt={<>OIDC: provedor na AWS + role com trust policy em <code>aud</code> e <code>sub</code> + <code>id-token: write</code></>} en={<>OIDC: provider in AWS + role with a trust policy on <code>aud</code> and <code>sub</code> + <code>id-token: write</code></>} />],
            [<T pt="ver o que o token do job contém" en="see what the job’s token contains" />, <T pt="decodifique o payload (Base64URL) num repositório de teste; nunca publique o token inteiro" en="decode the payload (Base64URL) in a test repository; never publish the whole token" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="Qual é a diferença entre autenticação e autorização, e por que o OAuth 2.0 sozinho não serve para “fazer login”?" en="What is the difference between authentication and authorization, and why is plain OAuth 2.0 not meant for “logging in”?" />, <T pt="Autenticar prova quem você é; autorizar define o que você pode fazer. O OAuth entrega um access token (autorização), que não é uma prova padronizada de identidade; para isso existe o OIDC, com o ID token." en="Authenticating proves who you are; authorizing defines what you may do. OAuth delivers an access token (authorization), which is not a standardized proof of identity; that is what OIDC and the ID token are for." />],
            [<T pt="No fluxo “Entrar com Google”, onde ocorre a autenticação, onde ocorre a autorização e o que o app faz com o ID token?" en="In the “Sign in with Google” flow, where does authentication happen, where does authorization happen, and what does the app do with the ID token?" />, <T pt="A autenticação ocorre no Google (senha, MFA ou passkey); a autorização, na tela de consentimento dos escopos. O app valida o ID token e cria a própria sessão." en="Authentication happens at Google (password, MFA or passkey); authorization, at the scope consent screen. The app validates the ID token and creates its own session." />],
            [<T pt={<>Na trust policy da role que o GitHub Actions assume, o que <code>aud</code> e <code>sub</code> protegem, e o que acontece se o <code>sub</code> estiver aberto demais?</>} en={<>In the trust policy of the role GitHub Actions assumes, what do <code>aud</code> and <code>sub</code> protect, and what happens if <code>sub</code> is too open?</>} />, <T pt={<><code>aud</code> garante que o token foi feito para a AWS; <code>sub</code> garante repositório e branch/environment. Aberto demais, outros repositórios ou branches conseguem assumir a role.</>} en={<><code>aud</code> makes sure the token was meant for AWS; <code>sub</code> pins the repository and branch/environment. Too open, other repositories or branches can assume the role.</>} />],
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
