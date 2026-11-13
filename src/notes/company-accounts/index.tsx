import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "company-accounts",
  title: { en: "Company accounts: domain, email and cloud", pt: "Contas da empresa: domínio, e-mail e nuvem" },
  seo: {
    title: { en: "Company identity and accounts: domain, email, cloud providers and access", pt: "Identidade e contas da empresa: domínio, e-mail, provedores de nuvem e acesso" },
    description: { en: "How a company gets its own domain and professional email (Google Workspace or alternatives), creates and runs accounts on Cloudflare, AWS, Google Cloud, Netlify, Vercel and Supabase, keeps every resource owned by the company instead of a founder's personal login, and secures it all with MFA, separate admin accounts, least privilege, credential management and access recovery.", pt: "Como uma empresa adquire domínio próprio e e-mail profissional (Google Workspace ou alternativas), cria e administra contas na Cloudflare, AWS, Google Cloud, Netlify, Vercel e Supabase, garante que todo recurso pertença à empresa e não ao login pessoal de um fundador, e protege tudo com MFA, contas administrativas separadas, menor privilégio, gerenciamento de credenciais e recuperação de acesso." },
  },
  summary: "how a company registers its own domain (registrant, auto-renew, registrar lock) and sets up professional email with Google Workspace or alternatives (MX, SPF, DKIM, DMARC, role addresses as groups); how to create and run company-owned organizations on Cloudflare, AWS (Organizations, root user, IAM Identity Center), Google Cloud (Organization, folders, billing), Netlify, Vercel and Supabase; ownership rules that avoid dependence on founders' or employees' personal accounts, an account inventory, and security: phishing-resistant MFA, separate admin and break-glass accounts, least privilege, credential management, access recovery, onboarding and offboarding checklists.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>The company owns the accounts, <em>not the people who created them.</em></>, pt: <>As contas são da empresa, <em>não de quem as criou.</em></> },
  heroLede: { en: "How to get a domain and professional email, open and run company accounts on Cloudflare, AWS, Google Cloud, Netlify, Vercel and Supabase, keep them owned by the company rather than a founder's personal login, and secure them with MFA, separate admin accounts, least privilege and a recovery plan.", pt: "Como ter domínio e e-mail profissional, abrir e administrar contas da empresa na Cloudflare, AWS, Google Cloud, Netlify, Vercel e Supabase, mantê-las em nome da empresa e não no login pessoal de um fundador, e protegê-las com MFA, contas administrativas separadas, menor privilégio e um plano de recuperação." },
  published: "2026-11-02",
  updated: "2026-11-02",
  toc: [
    {
      items: [
        { id: "root", title: <T pt="O domínio é a raiz de tudo" en="The domain is the root of everything" /> },
        { id: "domain", title: <T pt="Comprando o domínio" en="Buying the domain" /> },
        { id: "email", title: <T pt="E-mail profissional" en="Professional email" /> },
        { id: "accounts", title: <T pt="Contas nos provedores" en="Provider accounts" /> },
        { id: "ownership", title: <T pt="Propriedade e acesso" en="Ownership and access" /> },
        { id: "security", title: <T pt="Segurança" en="Security" /> },
        { id: "checklist", title: <T pt="Checklists" en="Checklists" /> },
        { id: "cheat-org", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="root" title={<T pt="O domínio é a raiz de tudo" en="The domain is the root of everything" />}>
        <p><T pt={<>Quase toda conta de uma empresa (AWS, Cloudflare, GitHub, Vercel, o banco, o contador) é criada com um <strong>e-mail</strong>. Quase todo "esqueci a senha" manda um link para esse e-mail. E o e-mail <code>@suaempresa.com</code> só funciona porque alguém controla o <strong>DNS</strong> do domínio, que por sua vez depende da conta no <strong>registrador</strong>. É uma corrente: quem controla o elo de cima controla todos os de baixo.</>} en={<>Almost every company account (AWS, Cloudflare, GitHub, Vercel, the bank, the accountant) is created with an <strong>email address</strong>. Almost every "forgot password" sends a link to that address. And <code>@yourcompany.com</code> only works because someone controls the domain's <strong>DNS</strong>, which in turn depends on the account at the <strong>registrar</strong>. It is a chain: whoever controls a link controls every link below it.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A ordem certa para montar (e para proteger) a identidade da empresa: registrador, DNS, e-mail, e só então as contas nos provedores." en="The right order to build (and to protect) the company's identity: registrar, DNS, email, and only then the provider accounts." />}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Cadeia de controle: registrador, DNS, e-mail, contas / Chain of control: registrar, DNS, email, accounts">
            <rect x="10" y="40" width="130" height="60" rx="4" className="brandfill" />
            <text x="75" y="66" className="pt" textAnchor="middle">registrador</text>
            <text x="75" y="66" className="en" textAnchor="middle">registrar</text>
            <text x="75" y="84" className="mono" textAnchor="middle">empresa.com</text>
            <rect x="180" y="40" width="130" height="60" rx="4" className="ln fillsoft" />
            <text x="245" y="66" className="pt" textAnchor="middle">DNS</text>
            <text x="245" y="66" className="en" textAnchor="middle">DNS</text>
            <text x="245" y="84" className="mono mut" textAnchor="middle">MX · TXT</text>
            <rect x="350" y="40" width="130" height="60" rx="4" className="ln fillsoft" />
            <text x="415" y="66" className="pt" textAnchor="middle">e-mail</text>
            <text x="415" y="66" className="en" textAnchor="middle">email</text>
            <text x="415" y="84" className="mono mut" textAnchor="middle">admin@empresa.com</text>
            <rect x="520" y="14" width="170" height="30" rx="3" className="ln" />
            <text x="605" y="34" className="mono" textAnchor="middle">AWS · GCP</text>
            <rect x="520" y="55" width="170" height="30" rx="3" className="ln" />
            <text x="605" y="75" className="mono" textAnchor="middle">Cloudflare · GitHub</text>
            <rect x="520" y="96" width="170" height="30" rx="3" className="ln" />
            <text x="605" y="116" className="mono" textAnchor="middle">Vercel · Supabase</text>
            <path d="M140 70L180 70" className="ln" />
            <path d="M173.2 66.7L180 70L173.2 73.3" className="ln" />
            <path d="M310 70L350 70" className="ln" />
            <path d="M343.2 66.7L350 70L343.2 73.3" className="ln" />
            <path d="M480 70L520 29" className="ln dash" />
            <path d="M480 70L520 70" className="ln dash" />
            <path d="M480 70L520 111" className="ln dash" />
            <text x="500" y="150" className="pt mut" textAnchor="middle">recuperação de senha</text>
            <text x="500" y="150" className="en mut" textAnchor="middle">password reset</text>
            <text x="10" y="185" className="pt mut" textAnchor="start">Perdeu o registrador ou o e-mail? Perdeu, aos poucos, todas as contas que dependem deles.</text>
            <text x="10" y="185" className="en mut" textAnchor="start">Lose the registrar or the email and you slowly lose every account that depends on them.</text>
          </svg>
        </Diagram>
        <p><T pt="Daí saem as três ideias que guiam o resto da nota:" en="Three ideas follow from that and guide the rest of this note:" /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>A empresa é a titular</strong> do domínio, do e-mail e das contas, no nome e no CNPJ dela, não no CPF ou no Gmail de alguém.</>} en={<><strong>The company is the holder</strong> of the domain, the email and the accounts, in its own legal name, not in someone's personal ID or Gmail.</>} /></li>
          <li><T pt={<><strong>Pessoas recebem acesso</strong>, cada uma com o próprio login e só com as permissões de que precisa. Ninguém compartilha senha.</>} en={<><strong>People are granted access</strong>, each with their own login and only the permissions they need. Nobody shares a password.</>} /></li>
          <li><T pt={<><strong>Sempre existe um caminho de volta</strong>: mais de um administrador, códigos de recuperação guardados, e um inventário que diz onde está cada coisa.</>} en={<><strong>There is always a way back in</strong>: more than one admin, stored recovery codes, and an inventory that says where everything is.</>} /></li>
        </ul>
      </Section>
      <Section id="domain" title={<T pt="Comprando o domínio" en="Buying the domain" />}>
        <h3><T pt="Onde registrar" en="Where to register" /></h3>
        <Table
          head={[<T pt="Registrador" en="Registrar" />, <T pt="Bom para" en="Good for" />, <T pt="Observação" en="Note" />]}
          rows={[
            ["Registro.br", <><code>.com.br</code>, <code>.br</code></>, <T pt={<>exige CPF ou CNPJ do titular: registre com o <strong>CNPJ</strong> da empresa</>} en={<>requires the holder's Brazilian tax ID: register with the company's <strong>CNPJ</strong></>} />],
            ["Cloudflare Registrar", <><code>.com</code>, <code>.dev</code>, <code>.io</code>…</>, <T pt="preço de custo, sem margem; o DNS precisa ficar na Cloudflare" en="at-cost pricing, no markup; DNS must stay on Cloudflare" />],
            ["Porkbun, Namecheap", <T pt="TLDs que a Cloudflare não vende" en="TLDs Cloudflare does not sell" />, <T pt="preço baixo, DNS livre para apontar para onde quiser" en="low price, DNS free to point anywhere" />],
            ["Google Workspace / provedor de hospedagem", <T pt="conveniência" en="convenience" />, <T pt={"evite \"domínio grátis no plano\": ele fica preso à conta de hospedagem"} en={"avoid \"free domain with the plan\": it ends up tied to the hosting account"} />],
          ]}
        />
        <p><T pt={<>O detalhe técnico da Cloudflare (zonas, nameservers, SSL) está na nota <a href="/notas/cloudflare/">Cloudflare: domínio, R2 e SSL</a>. Aqui o foco é <em>de quem</em> é o domínio.</>} en={<>The Cloudflare details (zones, nameservers, SSL) are in the <a href="/notas/cloudflare/">Cloudflare: domain, R2 and SSL</a> note. Here the focus is <em>who</em> owns the domain.</>} /></p>
        <h3><T pt="Registre certo desde o primeiro dia" en="Register it right from day one" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Titular (registrant) = a empresa.</strong> Razão social e CNPJ nos dados do registro. Se um sócio registrou no nome próprio "só para começar", transfira a titularidade agora, enquanto todos ainda se falam bem.</>} en={<><strong>Registrant = the company.</strong> Legal name and company ID in the registration data. If a founder registered it in their own name "just to get started", transfer the holder now, while everyone is still on good terms.</>} /></li>
          <li><T pt={<><strong>Conta do registrador com e-mail da empresa</strong> (um grupo como <code>dominios@</code> ou <code>admin@</code>), e não com o e-mail pessoal de quem comprou. Até o e-mail próprio existir, use um provisório e troque assim que ele funcionar.</>} en={<><strong>Registrar account on a company address</strong> (a group like <code>domains@</code> or <code>admin@</code>), not the buyer's personal email. Until your own email exists use a temporary one, and switch as soon as it works.</>} /></li>
          <li><T pt={<><strong>Renovação automática + cartão da empresa</strong>, e registro por vários anos. Domínio que expira é o jeito mais bobo de derrubar site e e-mail ao mesmo tempo.</>} en={<><strong>Auto-renew + company card</strong>, and register for several years. An expired domain is the silliest way to take down the site and the email at once.</>} /></li>
          <li><T pt={<><strong>Trava de transferência (registrar lock) ligada</strong> e MFA na conta do registrador. É a conta mais valiosa da empresa e costuma ser a menos protegida.</>} en={<><strong>Transfer lock (registrar lock) on</strong> and MFA on the registrar account. It is the most valuable account the company has and usually the least protected.</>} /></li>
          <li><T pt={<><strong>Compre as variações óbvias</strong> (<code>.com</code> e <code>.com.br</code>, por exemplo) e redirecione para o principal; dificulta phishing com o seu nome.</>} en={<><strong>Buy the obvious variations</strong> (<code>.com</code> and your country TLD, for example) and redirect them to the main one; it makes phishing with your name harder.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>Quando uma agência ou freelancer registra o domínio "para você", ele quase sempre fica na conta deles. Peça no contrato que o domínio seja registrado <strong>na conta e no nome da empresa</strong>, ou transferido na entrega. Veja <a href="/notas/small-project-contracts/">Contratos e preços para pequenos projetos web</a>.</>} en={<>When an agency or freelancer registers the domain "for you", it almost always lands in their account. Put it in the contract that the domain is registered <strong>in the company's account and name</strong>, or transferred on delivery. See <a href="/notas/small-project-contracts/">Contracts and pricing for small web projects</a>.</>} /></Callout>
      </Section>
      <Section id="email" title={<T pt="E-mail profissional" en="Professional email" />}>
        <p><T pt={<>Com o domínio em mãos, você escolhe quem vai <em>hospedar</em> as caixas de e-mail. O provedor também vira, na prática, o seu <strong>provedor de identidade</strong>: as contas <code>nome@empresa.com</code> são as que as pessoas usam para entrar em todo o resto (inclusive via SSO).</>} en={<>With the domain in hand, you choose who will <em>host</em> the mailboxes. That provider also becomes, in practice, your <strong>identity provider</strong>: the <code>name@company.com</code> accounts are what people use to sign in to everything else (including through SSO).</>} /></p>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Quando faz sentido" en="When it fits" />, <T pt="Bônus de identidade" en="Identity bonus" />]}
          rows={[
            ["Google Workspace", <T pt="equipe que já vive em Gmail, Docs, Drive e Meet" en="teams already living in Gmail, Docs, Drive and Meet" />, <T pt={<>cria uma <strong>organização</strong> no Google Cloud automaticamente; SSO "Entrar com Google" em quase tudo</>} en={<>creates a Google Cloud <strong>organization</strong> automatically; "Sign in with Google" almost everywhere</>} />],
            ["Microsoft 365", <T pt="empresa que usa Office, Teams e Windows" en="companies on Office, Teams and Windows" />, <T pt="Microsoft Entra ID como diretório e SSO" en="Microsoft Entra ID as directory and SSO" />],
            ["Zoho Mail, Fastmail", <T pt="só e-mail, bom e barato" en="just email, good and cheap" />, <T pt="limitado; SSO depende de outro provedor" en="limited; SSO needs another provider" />],
            ["Proton for Business", <T pt="privacidade e criptografia ponta a ponta como prioridade" en="privacy and end-to-end encryption first" />, <T pt="limitado" en="limited" />],
            ["Cloudflare Email Routing", <T pt={<>só <em>receber</em> e encaminhar <code>contato@</code> para outra caixa</>} en={<>only <em>receive</em> and forward <code>contact@</code> to another inbox</>} />, <T pt="nenhum: não envia nem é diretório" en="none: it does not send and is not a directory" />],
          ]}
        />
        <h3><T pt="Configurando o Google Workspace (o caminho mais comum)" en="Setting up Google Workspace (the most common path)" /></h3>
        <ol>
          <li><T pt={<>Assine com o domínio da empresa. A primeira conta criada vira <strong>super admin</strong>: use um nome de função, como <code>admin@empresa.com</code>, e não <code>joao@</code>.</>} en={<>Sign up with the company domain. The first account created becomes <strong>super admin</strong>: use a role name like <code>admin@company.com</code>, not <code>john@</code>.</>} /></li>
          <li><T pt={<><strong>Verifique o domínio</strong> com o registro TXT que o Google mostra.</>} en={<><strong>Verify the domain</strong> with the TXT record Google shows you.</>} /></li>
          <li><T pt={<>Aponte o <strong>MX</strong> para o Google e publique <strong>SPF</strong>, <strong>DKIM</strong> (gerado no Admin console) e <strong>DMARC</strong>. Sem os três, seu e-mail cai no spam, e Google, Yahoo e Microsoft já exigem autenticação de quem envia em volume.</>} en={<>Point <strong>MX</strong> to Google and publish <strong>SPF</strong>, <strong>DKIM</strong> (generated in the Admin console) and <strong>DMARC</strong>. Without all three your mail lands in spam, and Google, Yahoo and Microsoft already require authentication from bulk senders.</>} /></li>
          <li><T pt={<>Crie uma conta por pessoa e <strong>grupos</strong> para funções (<code>financeiro@</code>, <code>seguranca@</code>, <code>infra@</code>). Grupo não é caixa compartilhada com senha: é uma lista de entrega, e você troca os membros sem trocar nenhuma senha.</>} en={<>Create one account per person and <strong>groups</strong> for roles (<code>billing@</code>, <code>security@</code>, <code>ops@</code>). A group is not a shared mailbox with a password: it is a distribution list, and you change members without changing any password.</>} /></li>
          <li><T pt={<>Em Segurança, <strong>obrigue a verificação em duas etapas</strong> para todos, com um período de adesão curto.</>} en={<>Under Security, <strong>enforce 2-Step Verification</strong> for everyone, with a short enrollment period.</>} /></li>
        </ol>
        <CodeBlock code={`# DNS records for Google Workspace (example.com)
example.com.          MX   1  smtp.google.com.
example.com.          TXT  "v=spf1 include:_spf.google.com ~all"
google._domainkey     TXT  "v=DKIM1; k=rsa; p=MIIBIjANBg..."     # copied from Admin console
_dmarc                TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"

# Start DMARC at p=none to watch the reports, then move to quarantine, then reject.
# A domain that never sends email should say so, so nobody can spoof it:
#   TXT "v=spf1 -all"   and   _dmarc TXT "v=DMARC1; p=reject"`} />
        <h3><T pt="Os endereços de função" en="Role addresses" /></h3>
        <p><T pt={<>A regra prática: <strong>contas em provedores são abertas com endereços de função, nunca com o de uma pessoa</strong>. Pessoas saem; a função fica.</>} en={<>The rule of thumb: <strong>provider accounts are opened with role addresses, never a person's address</strong>. People leave; the role stays.</>} /></p>
        <Table
          head={[<T pt="Endereço (grupo)" en="Address (group)" />, <T pt="Usado para" en="Used for" />]}
          rows={[
            [<code>admin@</code>, <T pt="registrador, super admin do Workspace, contas-raiz" en="registrar, Workspace super admin, root accounts" />],
            [<><code>aws-root+prod@</code>, <code>aws-root+dev@</code></>, <T pt={<>o e-mail único de cada conta AWS (o <code>+</code> cai no mesmo grupo)</>} en={<>the unique email of each AWS account (the <code>+</code> lands in the same group)</>} />],
            [<code>financeiro@</code>, <T pt="faturas, contato de cobrança dos provedores" en="invoices, billing contact at providers" />],
            [<code>seguranca@</code>, <T pt={<>alertas de segurança, contato de segurança da AWS, <code>security.txt</code></>} en={<>security alerts, AWS security contact, <code>security.txt</code></>} />],
            [<code>infra@</code>, <T pt="alertas operacionais, avisos de manutenção" en="operational alerts, maintenance notices" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Confirme que o Workspace aceita o <code>+</code> no endereço (subaddressing) antes de depender dele; o Gmail aceita por padrão. Se preferir, crie grupos separados.</>} en={<>Check that your provider accepts <code>+</code> in addresses (subaddressing) before relying on it; Gmail does by default. If you prefer, create separate groups.</>} /></Callout>
      </Section>
      <Section id="accounts" title={<T pt="Contas nos provedores" en="Provider accounts" />}>
        <p><T pt={<>Todo provedor sério separa dois conceitos: o <strong>usuário</strong> (uma pessoa que faz login) e a <strong>organização</strong> (chamada de conta, time, team ou organization), que é quem <em>possui</em> os recursos e paga a fatura. O erro clássico é criar tudo dentro do usuário pessoal do fundador, porque é o que aparece primeiro depois do cadastro.</>} en={<>Every serious provider separates two concepts: the <strong>user</strong> (a person who signs in) and the <strong>organization</strong> (called account, team or organization), which <em>owns</em> the resources and pays the bill. The classic mistake is creating everything inside the founder's personal user, because that is what shows up right after sign-up.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Se a pessoa sair, você remove o membro; os recursos continuam na organização, intactos." en="If a person leaves, you remove the member; the resources stay in the organization, untouched." />}>
          <svg viewBox="0 0 700 190" role="img" aria-label="Organização possui recursos; usuários são membros / The organization owns resources; users are members">
            <rect x="230" y="14" width="240" height="56" rx="4" className="brandfill" />
            <text x="350" y="38" className="pt" textAnchor="middle">organização da empresa</text>
            <text x="350" y="38" className="en" textAnchor="middle">company organization</text>
            <text x="350" y="56" className="pt mono" textAnchor="middle">fatura · cartão da empresa</text>
            <text x="350" y="56" className="en mono" textAnchor="middle">billing · company card</text>
            <rect x="10" y="120" width="200" height="56" rx="4" className="ln fillsoft" />
            <text x="110" y="144" className="pt" textAnchor="middle">recursos</text>
            <text x="110" y="144" className="en" textAnchor="middle">resources</text>
            <text x="110" y="162" className="pt mono mut" textAnchor="middle">projetos · zonas · bancos</text>
            <text x="110" y="162" className="en mono mut" textAnchor="middle">projects · zones · databases</text>
            <rect x="250" y="120" width="200" height="56" rx="4" className="ln" />
            <text x="350" y="144" className="pt" textAnchor="middle">membros (pessoas)</text>
            <text x="350" y="144" className="en" textAnchor="middle">members (people)</text>
            <text x="350" y="162" className="pt mono mut" textAnchor="middle">cada um com seu login</text>
            <text x="350" y="162" className="en mono mut" textAnchor="middle">each with own login</text>
            <rect x="490" y="120" width="200" height="56" rx="4" className="ln" />
            <text x="590" y="144" className="pt" textAnchor="middle">identidades de máquina</text>
            <text x="590" y="144" className="en" textAnchor="middle">machine identities</text>
            <text x="590" y="162" className="mono mut" textAnchor="middle">tokens · OIDC · roles</text>
            <path d="M300 70L110 120" className="ln" />
            <path d="M117.4 121.7L110 120L115.7 115.3" className="ln" />
            <text x="180" y="92" className="pt mut" textAnchor="middle">possui</text>
            <text x="180" y="92" className="en mut" textAnchor="middle">owns</text>
            <path d="M350 70L350 120" className="ln" />
            <path d="M346.7 113.2L350 120L353.3 113.2" className="ln" />
            <text x="385" y="100" className="pt mut" textAnchor="middle">papel</text>
            <text x="385" y="100" className="en mut" textAnchor="middle">role</text>
            <path d="M400 70L590 120" className="ln" />
            <path d="M584.3 115.3L590 120L582.6 121.7" className="ln" />
            <text x="530" y="92" className="pt mut" textAnchor="middle">escopo mínimo</text>
            <text x="530" y="92" className="en mut" textAnchor="middle">minimal scope</text>
          </svg>
        </Diagram>
        <h3>Cloudflare</h3>
        <ul className="ds-list">
          <li><T pt={<>Crie a conta com <code>admin@</code>. Zonas (domínios), Workers, R2 e Pages pertencem à <strong>conta</strong>, não ao usuário.</>} en={<>Create the account with <code>admin@</code>. Zones (domains), Workers, R2 and Pages belong to the <strong>account</strong>, not the user.</>} /></li>
          <li><T pt={<>Convide cada pessoa em <em>Manage Account → Members</em>, com o seu próprio e-mail, e escolha papéis: Super Administrator para no máximo dois, Administrator ou papéis restritos (DNS, Analytics, Billing) para o resto, opcionalmente limitados a um domínio.</>} en={<>Invite each person under <em>Manage Account → Members</em> with their own email, and pick roles: Super Administrator for two people at most, Administrator or narrower roles (DNS, Analytics, Billing) for everyone else, optionally scoped to one domain.</>} /></li>
          <li><T pt={<>Para automação, <strong>API Tokens</strong> com escopo (uma zona, uma permissão), nunca a Global API Key.</>} en={<>For automation, scoped <strong>API Tokens</strong> (one zone, one permission), never the Global API Key.</>} /></li>
        </ul>
        <h3>AWS</h3>
        <ul className="ds-list">
          <li><T pt={<>Cada conta AWS tem um <strong>usuário root</strong> preso a um e-mail. Use um grupo da empresa (<code>aws-root+prod@</code>), ative MFA no root (dá para registrar mais de um dispositivo), não crie chaves de acesso para ele e só o use para as poucas tarefas que exigem root.</>} en={<>Every AWS account has a <strong>root user</strong> tied to one email. Use a company group (<code>aws-root+prod@</code>), turn on MFA for root (more than one device can be registered), never create access keys for it and use it only for the few tasks that require root.</>} /></li>
          <li><T pt={<>Com <strong>AWS Organizations</strong>, a primeira conta vira a <em>management account</em> (só cobrança e governança) e você cria contas-membro por ambiente: <code>prod</code>, <code>staging</code>, <code>dev</code>. Uma fatura, isolamento real entre ambientes.</>} en={<>With <strong>AWS Organizations</strong>, the first account becomes the <em>management account</em> (billing and governance only) and you create member accounts per environment: <code>prod</code>, <code>staging</code>, <code>dev</code>. One bill, real isolation between environments.</>} /></li>
          <li><T pt={<>Pessoas entram pelo <strong>IAM Identity Center</strong> (SSO), com permission sets por conta, e de preferência federado ao Google Workspace ou Entra ID: desativar a pessoa no diretório corta o acesso à AWS. Evite usuários IAM com chave de longa duração para humanos.</>} en={<>People sign in through <strong>IAM Identity Center</strong> (SSO), with permission sets per account, ideally federated with Google Workspace or Entra ID: disabling the person in the directory cuts their AWS access. Avoid IAM users with long-lived keys for humans.</>} /></li>
          <li><T pt={<>Preencha os <strong>contatos alternativos</strong> (cobrança, operações, segurança) com os grupos, e crie um <strong>AWS Budget</strong> com alerta de gasto no primeiro dia.</>} en={<>Fill in the <strong>alternate contacts</strong> (billing, operations, security) with the groups, and create an <strong>AWS Budget</strong> with a spend alert on day one.</>} /></li>
        </ul>
        <p><T pt={<>Organizations, IAM e SCPs em detalhe: <a href="/notas/aws/">AWS</a>. CI sem chaves guardadas: <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</>} en={<>Organizations, IAM and SCPs in detail: <a href="/notas/aws/">AWS</a>. CI without stored keys: <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>.</>} /></p>
        <h3>Google Cloud</h3>
        <ul className="ds-list">
          <li><T pt={<>Com Google Workspace (ou o <strong>Cloud Identity Free</strong>, se o e-mail for outro), o primeiro acesso ao console cria o nó <strong>Organization</strong> do seu domínio. Projetos criados sob ela pertencem à empresa; projetos criados com um Gmail pessoal ficam em "Sem organização" e pertencem àquela pessoa.</>} en={<>With Google Workspace (or <strong>Cloud Identity Free</strong> if your email lives elsewhere), the first console sign-in creates your domain's <strong>Organization</strong> node. Projects created under it belong to the company; projects created with a personal Gmail sit under "No organization" and belong to that person.</>} /></li>
          <li><T pt={<>Hierarquia: Organization → Folders (<code>prod</code>, <code>dev</code>) → Projects. Conceda papéis a <strong>grupos</strong> do Workspace (<code>gcp-devs@</code>) em vez de a pessoas, e no nível mais baixo que resolva.</>} en={<>Hierarchy: Organization → Folders (<code>prod</code>, <code>dev</code>) → Projects. Grant roles to Workspace <strong>groups</strong> (<code>gcp-devs@</code>) rather than people, at the lowest level that works.</>} /></li>
          <li><T pt={<>A <strong>Billing Account</strong> é um recurso separado, com administradores próprios. Mantenha pelo menos dois Billing Account Administrators e dois Organization Administrators.</>} en={<>The <strong>Billing Account</strong> is a separate resource with its own admins. Keep at least two Billing Account Administrators and two Organization Administrators.</>} /></li>
        </ul>
        <h3>Netlify <T pt="e" en="and" /> Vercel</h3>
        <ul className="ds-list">
          <li><T pt={<>Os dois têm conta pessoal e <strong>Team</strong>. Projetos comerciais vão num Team da empresa: o plano Hobby da Vercel é só para uso pessoal e não comercial.</>} en={<>Both have a personal account and a <strong>Team</strong>. Commercial projects go in a company Team: Vercel's Hobby plan is for personal, non-commercial use only.</>} /></li>
          <li><T pt="Papéis: na Vercel, Owner, Member, Developer, Billing e Viewer; no Netlify, Owner, Developer, Billing Admin e Reviewer. Deixe Owner com dois fundadores e Developer para o resto." en="Roles: on Vercel, Owner, Member, Developer, Billing and Viewer; on Netlify, Owner, Developer, Billing Admin and Reviewer. Keep Owner with two founders and Developer for everyone else." /></li>
          <li><T pt={<>O repositório Git conectado deve estar numa <strong>organização do GitHub</strong> da empresa, não no usuário de quem criou. Projetos criados na conta pessoal podem ser transferidos para o Team.</>} en={<>The connected Git repository should live in the company's <strong>GitHub organization</strong>, not the creator's user. Projects created in a personal account can be transferred to the Team.</>} /></li>
        </ul>
        <h3>Supabase</h3>
        <ul className="ds-list">
          <li><T pt={<>Projetos pertencem a uma <strong>Organization</strong>; a cobrança é por organização. Crie uma para a empresa, com cartão da empresa, e transfira para ela projetos que nasceram na organização pessoal.</>} en={<>Projects belong to an <strong>Organization</strong>; billing is per organization. Create one for the company, on the company card, and transfer into it any project born in a personal organization.</>} /></li>
          <li><T pt={<>Papéis: Owner, Administrator, Developer e Read-only. A senha do banco e a chave <code>service_role</code> são credenciais de máquina: ficam no gerenciador de segredos, nunca no front-end.</>} en={<>Roles: Owner, Administrator, Developer and Read-only. The database password and the <code>service_role</code> key are machine credentials: they live in the secrets manager, never in the front end.</>} /></li>
        </ul>
        <Table
          head={[<T pt="Provedor" en="Provider" />, <T pt="Quem possui os recursos" en="What owns resources" />, <T pt="Acesso humano" en="Human access" />, <T pt="Acesso de máquina" en="Machine access" />]}
          rows={[
            ["Cloudflare", "Account", "Members + roles", <T pt="API Token com escopo" en="scoped API Token" />],
            ["AWS", "Organization → accounts", "IAM Identity Center", <T pt="IAM roles, OIDC" en="IAM roles, OIDC" />],
            ["Google Cloud", "Organization → folders → projects", <T pt="grupos do Workspace + IAM" en="Workspace groups + IAM" />, <T pt="service accounts, Workload Identity Federation" en="service accounts, Workload Identity Federation" />],
            ["Netlify", "Team", "Team members", <T pt="tokens de acesso" en="access tokens" />],
            ["Vercel", "Team", "Team members", <T pt="tokens com escopo de team" en="team-scoped tokens" />],
            ["Supabase", "Organization → projects", "Organization members", <T pt="chaves do projeto, access tokens" en="project keys, access tokens" />],
            ["GitHub", "Organization", <T pt="membros + times" en="members + teams" />, <T pt="GitHub Apps, tokens finos" en="GitHub Apps, fine-grained tokens" />],
          ]}
        />
      </Section>
      <Section id="ownership" title={<T pt="Propriedade e acesso" en="Ownership and access" />}>
        <p><T pt="O cenário que você quer evitar: um sócio sai brigado, um funcionário é desligado, ou alguém simplesmente perde o celular, e descobre-se que o domínio, a AWS ou o banco de produção estavam no login pessoal dele. Recuperar isso pode levar semanas de suporte, documentos societários e, às vezes, advogado." en="The scenario you want to avoid: a partner leaves on bad terms, an employee is let go, or someone simply loses their phone, and it turns out the domain, AWS or the production database were on their personal login. Getting that back can take weeks of support tickets, company documents and sometimes a lawyer." /></p>
        <h3><T pt="As regras" en="The rules" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Toda conta raiz/owner usa um e-mail de função da empresa</strong> (um grupo), nunca um e-mail pessoal nem o e-mail individual de um funcionário.</>} en={<><strong>Every root/owner account uses a company role address</strong> (a group), never a personal address nor one employee's individual address.</>} /></li>
          <li><T pt={<><strong>Toda fatura vai num cartão da empresa</strong>, em nome da empresa. Cartão pessoal na conta é, na prática, prova de que a conta é da pessoa.</>} en={<><strong>Every bill goes on a company card</strong>, in the company's name. A personal card on the account is, in practice, evidence that the account is that person's.</>} /></li>
          <li><T pt={<><strong>Pelo menos dois owners/admins em cada organização</strong>, e nunca mais que o necessário. Um só é ponto único de falha; muitos é superfície de ataque.</>} en={<><strong>At least two owners/admins per organization</strong>, and never more than needed. One is a single point of failure; many is attack surface.</>} /></li>
          <li><T pt={<><strong>Recursos vivem na organização</strong> (team, account, org), nunca no espaço pessoal de um usuário, mesmo que seja só um teste que "depois a gente move".</>} en={<><strong>Resources live in the organization</strong> (team, account, org), never in a user's personal space, even if it is just a test "we will move later".</>} /></li>
          <li><T pt={<><strong>Fornecedores e freelancers recebem convite</strong> como membros da organização da empresa, com papel limitado e data para sair. Nunca o contrário (a empresa sendo convidada na conta deles).</>} en={<><strong>Vendors and freelancers get invited</strong> as members of the company's organization, with a limited role and an end date. Never the other way round (the company being invited into theirs).</>} /></li>
        </ul>
        <h3><T pt="O inventário de contas" en="The account inventory" /></h3>
        <p><T pt={"Uma planilha ou página interna, sem senhas, que responde \"onde está cada coisa e quem manda nela\". Ela é o que torna offboarding, auditoria e recuperação possíveis."} en={"A spreadsheet or internal page, with no passwords, that answers \"where is everything and who controls it\". It is what makes offboarding, audits and recovery possible."} /></p>
        <Table
          head={[<T pt="Serviço" en="Service" />, <T pt="E-mail dono" en="Owner email" />, "Admins", <T pt="Pagamento" en="Billing" />, "MFA", <T pt="Recuperação" en="Recovery" />]}
          rows={[
            ["Registro.br", <code>admin@</code>, "Ana, Bruno", <T pt="cartão PJ ••42" en="company card ••42" />, <T pt="chave + app" en="key + app" />, <T pt="códigos no cofre" en="codes in vault" />],
            [<T pt="AWS (gestão)" en="AWS (management)" />, <code>aws-root+mgmt@</code>, "Ana, Bruno (SSO)", <T pt="cartão PJ ••42" en="company card ••42" />, <T pt="2 chaves no root" en="2 keys on root" />, <T pt="reset por e-mail do grupo" en="reset via group email" />],
            ["Vercel", <code>admin@</code>, "Ana, Bruno", <T pt="cartão PJ ••42" en="company card ••42" />, "passkey", <T pt="códigos no cofre" en="codes in vault" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>"Conta compartilhada" (um login <code>admin@</code> que três pessoas usam com a mesma senha) não resolve o problema de propriedade: troca um ponto único de falha por zero rastreabilidade. O e-mail de função é o <em>dono</em> e a via de recuperação; o uso diário é sempre por contas individuais.</>} en={<>A "shared account" (one <code>admin@</code> login three people use with the same password) does not solve ownership: it swaps a single point of failure for zero traceability. The role address is the <em>owner</em> and the recovery path; daily use is always through individual accounts.</>} /></Callout>
      </Section>
      <Section id="security" title={<T pt="Segurança" en="Security" />}>
        <h3><T pt="MFA em tudo, e do tipo certo" en="MFA everywhere, and the right kind" /></h3>
        <Table
          head={[<T pt="Fator" en="Factor" />, <T pt="Resiste a phishing?" en="Phishing-resistant?" />, <T pt="Use para" en="Use for" />]}
          rows={[
            [<T pt="Chave física FIDO2 (YubiKey, Titan)" en="FIDO2 hardware key (YubiKey, Titan)" />, <T pt="sim" en="yes" />, <T pt="registrador, super admin, root da AWS, owners" en="registrar, super admin, AWS root, owners" />],
            [<T pt="Passkey (no celular ou gerenciador de senhas)" en="Passkey (on phone or password manager)" />, <T pt="sim" en="yes" />, <T pt="contas individuais do dia a dia" en="daily individual accounts" />],
            [<T pt="App autenticador (TOTP)" en="Authenticator app (TOTP)" />, <T pt="não: o código pode ser digitado num site falso" en="no: the code can be typed into a fake site" />, <T pt="onde não houver passkey" en="where passkeys are not offered" />],
            ["SMS", <T pt="não, e ainda sofre SIM swap" en="no, and it is exposed to SIM swap" />, <T pt="evite; remova como fator de recuperação" en="avoid; remove it as a recovery factor" />],
          ]}
        />
        <p><T pt={<>Compre <strong>duas chaves físicas por administrador</strong>: uma no chaveiro, outra guardada em local seguro. Registre as duas em cada conta crítica. Quem tem uma chave só tem, na verdade, um plano de perder o acesso.</>} en={<>Buy <strong>two hardware keys per administrator</strong>: one on the keyring, one stored somewhere safe. Register both on every critical account. Someone with a single key actually has a plan to lose access.</>} /></p>
        <h3><T pt="Contas administrativas separadas" en="Separate admin accounts" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Super admin do Workspace, root da AWS e owner da organização <strong>não são para o uso diário</strong>. O Google recomenda ter mais de um super admin e não usá-lo para tarefas comuns; a AWS diz o mesmo do root.</>} en={<>Workspace super admin, AWS root and organization owner <strong>are not for daily use</strong>. Google recommends having more than one super admin and not using it for everyday tasks; AWS says the same about root.</>} /></li>
          <li><T pt={<>Para quem administra, considere duas identidades: <code>ana@</code> (e-mail, docs, papel de Developer) e <code>ana.admin@</code> (só para tarefas administrativas, MFA com chave física, sem e-mail lendo links de fora).</>} en={<>For admins, consider two identities: <code>ana@</code> (email, docs, Developer role) and <code>ana.admin@</code> (admin tasks only, hardware-key MFA, no inbox clicking outside links).</>} /></li>
          <li><T pt={<>Uma conta de <strong>break-glass</strong> (emergência) por plataforma crítica: credencial e chaves guardadas offline, uso registrado e alerta quando alguém entra nela.</>} en={<>One <strong>break-glass</strong> (emergency) account per critical platform: credentials and keys stored offline, use logged, and an alert when anyone signs in.</>} /></li>
        </ul>
        <h3><T pt="Permissões individuais e menor privilégio" en="Individual permissions and least privilege" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Uma pessoa, um login.</strong> Sem isso, o log de auditoria diz "admin fez" e ninguém sabe quem.</>} en={<><strong>One person, one login.</strong> Without it, the audit log says "admin did it" and nobody knows who.</>} /></li>
          <li><T pt={<><strong>Comece com o papel mais fraco</strong> que permite fazer o trabalho (Viewer, Developer) e suba só quando faltar algo concreto. Acesso a produção é exceção, não padrão.</>} en={<><strong>Start with the weakest role</strong> that gets the job done (Viewer, Developer) and raise it only when something concrete is missing. Production access is the exception, not the default.</>} /></li>
          <li><T pt={<><strong>Conceda a grupos, não a pessoas</strong> (onde o provedor permitir). Entrar ou sair do grupo <code>devs@</code> ajusta o acesso em todos os lugares de uma vez.</>} en={<><strong>Grant to groups, not people</strong> (where the provider allows it). Joining or leaving the <code>devs@</code> group adjusts access everywhere at once.</>} /></li>
          <li><T pt={<><strong>SSO quando der</strong>: com login via Google Workspace ou Entra ID, desligar a conta no diretório desliga o acesso aos serviços federados. Os planos mais baratos de alguns provedores não têm SSO; aí o offboarding manual precisa do inventário.</>} en={<><strong>SSO when possible</strong>: with sign-in through Google Workspace or Entra ID, disabling the directory account disables access to federated services. Some providers' cheaper plans lack SSO; then manual offboarding depends on the inventory.</>} /></li>
          <li><T pt={<><strong>Revisão trimestral de acessos</strong>: para cada serviço do inventário, quem ainda está lá e precisa estar?</>} en={<><strong>Quarterly access review</strong>: for each service in the inventory, who is still there and still needs to be?</>} /></li>
        </ul>
        <h3><T pt="Gerenciamento de credenciais" en="Credential management" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Gerenciador de senhas da empresa</strong> (Bitwarden, 1Password) com cofres compartilhados por função. Ele guarda os códigos de recuperação e o raro segredo que precisa ser humano.</>} en={<><strong>Company password manager</strong> (Bitwarden, 1Password) with vaults shared by role. It holds recovery codes and the rare secret that has to be human.</>} /></li>
          <li><T pt={<><strong>Segredos de máquina em gerenciador de segredos</strong> (AWS Secrets Manager, variáveis criptografadas da Vercel/Netlify, GitHub Actions secrets), nunca no repositório nem no <code>.env</code> commitado.</>} en={<><strong>Machine secrets in a secrets manager</strong> (AWS Secrets Manager, Vercel/Netlify encrypted variables, GitHub Actions secrets), never in the repository or a committed <code>.env</code>.</>} /></li>
          <li><T pt={<><strong>Prefira credencial temporária</strong>: OIDC do CI para a nuvem, SSO com sessões curtas. Toda chave de longa duração tem dono, escopo mínimo e data de rotação.</>} en={<><strong>Prefer short-lived credentials</strong>: OIDC from CI to the cloud, SSO with short sessions. Every long-lived key has an owner, minimal scope and a rotation date.</>} /></li>
          <li><T pt={<><strong>Quando alguém sai, rotacione</strong> todo segredo que essa pessoa pôde ver, além de remover o acesso.</>} en={<><strong>When someone leaves, rotate</strong> every secret that person could see, besides removing their access.</>} /></li>
        </ul>
        <h3><T pt="Recuperação de acesso" en="Access recovery" /></h3>
        <p><T pt={"Planeje a recuperação antes de precisar dela. Para cada conta crítica, alguém deve conseguir responder: \"se a pessoa X sumir hoje com o celular e as chaves, como entramos amanhã?\""} en={"Plan recovery before you need it. For each critical account, someone should be able to answer: \"if person X disappears today with their phone and keys, how do we get in tomorrow?\""} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>E-mail e telefone de recuperação são da empresa</strong>, não o celular pessoal de um sócio.</>} en={<><strong>Recovery email and phone belong to the company</strong>, not a partner's personal mobile.</>} /></li>
          <li><T pt={<><strong>Códigos de recuperação</strong> gerados, impressos ou guardados no cofre, e testados uma vez.</>} en={<><strong>Recovery codes</strong> generated, printed or stored in the vault, and tested once.</>} /></li>
          <li><T pt={<><strong>Segundo admin</strong> que consegue redefinir o primeiro (no Workspace, um super admin redefine o outro; na AWS, outro admin do Identity Center ou a conta de gestão).</>} en={<><strong>A second admin</strong> who can reset the first (in Workspace one super admin resets another; in AWS another Identity Center admin or the management account).</>} /></li>
          <li><T pt={<><strong>Documentos à mão</strong>: contrato social e CNPJ. É o que o suporte do registrador ou da nuvem pede para provar que a conta é da empresa, e é por isso que a titularidade tem de estar no nome dela.</>} en={<><strong>Documents at hand</strong>: articles of incorporation and company registration. That is what registrar or cloud support asks for to prove the account is the company's, which is why ownership must be in its name.</>} /></li>
        </ul>
        <Callout icon="check"><T pt={<>Ative os <strong>logs de auditoria</strong> (CloudTrail na AWS, Audit Logs no Google Cloud e no Workspace, Audit Logs da Cloudflare) e mande os alertas de login de admin para <code>seguranca@</code>. Ver o problema cedo é metade da recuperação.</>} en={<>Turn on <strong>audit logs</strong> (CloudTrail on AWS, Audit Logs on Google Cloud and Workspace, Cloudflare Audit Logs) and send admin sign-in alerts to <code>security@</code>. Seeing the problem early is half the recovery.</>} /></Callout>
      </Section>
      <Section id="checklist" title={<T pt="Checklists" en="Checklists" />}>
        <h3><T pt="Dia 1 da empresa" en="Company day one" /></h3>
        <ol>
          <li><T pt="Registrar o domínio no nome e CNPJ da empresa, com renovação automática, trava e MFA." en="Register the domain in the company's name, with auto-renew, lock and MFA." /></li>
          <li><T pt="Contratar o e-mail, verificar o domínio, configurar MX, SPF, DKIM e DMARC." en="Set up email, verify the domain, configure MX, SPF, DKIM and DMARC." /></li>
          <li><T pt={<>Criar <code>admin@</code>, <code>financeiro@</code>, <code>seguranca@</code>, <code>infra@</code> como grupos; obrigar MFA para todos.</>} en={<>Create <code>admin@</code>, <code>billing@</code>, <code>security@</code>, <code>ops@</code> as groups; enforce MFA for everyone.</>} /></li>
          <li><T pt="Abrir as organizações (GitHub, Cloudflare, AWS, Vercel/Netlify, Supabase) com os e-mails de função e o cartão da empresa." en="Open the organizations (GitHub, Cloudflare, AWS, Vercel/Netlify, Supabase) with role addresses and the company card." /></li>
          <li><T pt="Dois owners por organização, cada um com duas chaves físicas; todos os outros com papel mínimo." en="Two owners per organization, each with two hardware keys; everyone else on the minimum role." /></li>
          <li><T pt="Gerenciador de senhas com os códigos de recuperação; inventário de contas preenchido." en="Password manager holding recovery codes; account inventory filled in." /></li>
          <li><T pt="Alertas de orçamento e de login administrativo apontando para os grupos." en="Budget and admin sign-in alerts pointing at the groups." /></li>
        </ol>
        <h3><T pt="Quando alguém sai" en="When someone leaves" /></h3>
        <ol>
          <li><T pt="Suspender a conta no diretório (corta o SSO) e transferir os arquivos e o e-mail para um responsável." en="Suspend the directory account (cuts SSO) and transfer files and mail to someone responsible." /></li>
          <li><T pt="Remover dos membros de cada serviço do inventário que não usa SSO." en="Remove from members of every inventory service that does not use SSO." /></li>
          <li><T pt="Tirar dos grupos de função e da lista de destinatários de alertas." en="Remove from role groups and alert recipient lists." /></li>
          <li><T pt="Revogar tokens pessoais, chaves SSH e chaves de API criadas pela pessoa; rotacionar segredos que ela viu." en="Revoke personal tokens, SSH keys and API keys the person created; rotate secrets they saw." /></li>
          <li><T pt={<>Se era owner ou admin: promover o substituto <em>antes</em> de remover, e conferir que ainda há dois.</>} en={<>If they were an owner or admin: promote the replacement <em>before</em> removing them, and check there are still two.</>} /></li>
        </ol>
        <h3><T pt="Herdou uma bagunça?" en="Inherited a mess?" /></h3>
        <ul className="ds-list">
          <li><T pt="Faça o inventário primeiro, mesmo incompleto: liste o que você sabe que existe e de quem é cada login." en="Do the inventory first, even if incomplete: list what you know exists and whose login each one is." /></li>
          <li><T pt="Comece pelo topo da corrente: registrador, depois e-mail, depois nuvem." en="Start at the top of the chain: registrar, then email, then cloud." /></li>
          <li><T pt="Use as ferramentas de transferência (de titular no registrador, de projeto na Vercel e na Supabase, de repositório no GitHub) em vez de recriar." en="Use the transfer tools (registrant change at the registrar, project transfer on Vercel and Supabase, repository transfer on GitHub) instead of recreating." /></li>
          <li><T pt="Troque o e-mail de login das contas pessoais que não dá para transferir por um e-mail de função, e então adicione os outros admins." en="For personal accounts that cannot be transferred, change the sign-in email to a role address, then add the other admins." /></li>
        </ul>
      </Section>
      <Section id="cheat-org" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Faça" en="Do" />, <T pt="Não faça" en="Don't" />]}
          rows={[
            [<T pt={<>domínio no CNPJ, em conta com <code>admin@</code></>} en={<>domain in the company's name, on an <code>admin@</code> account</>} />, <T pt="domínio no CPF do sócio ou na conta da agência" en="domain in a partner's name or the agency's account" />],
            [<T pt="e-mails de função como grupos" en="role addresses as groups" />, <T pt="login compartilhado com senha conhecida por todos" en="a shared login whose password everyone knows" />],
            [<T pt="recursos dentro da organização/team" en="resources inside the organization/team" />, <T pt={"projetos na conta pessoal \"por enquanto\""} en={"projects in a personal account \"for now\""} />],
            [<T pt="dois owners, cada um com duas chaves FIDO2" en="two owners, each with two FIDO2 keys" />, <T pt="um único admin com MFA por SMS" en="a single admin with SMS MFA" />],
            [<T pt="papel mínimo, concedido a grupos" en="minimal role, granted to groups" />, <T pt={"todo mundo Owner \"para não travar\""} en={"everyone Owner \"so nothing gets blocked\""} />],
            [<T pt="OIDC e tokens com escopo para máquinas" en="OIDC and scoped tokens for machines" />, <T pt="chave de root ou Global API Key no CI" en="root keys or Global API Key in CI" />],
            [<T pt="inventário + códigos de recuperação no cofre" en="inventory + recovery codes in the vault" />, <T pt={"\"a senha está com o Fulano\""} en={"\"so-and-so has the password\""} />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul className="ds-list">
          <li><T pt="Por que a conta do registrador é a mais crítica da empresa?" en="Why is the registrar account the most critical one the company has?" /></li>
          <li><T pt="Quais registros DNS um domínio precisa para enviar e-mail sem cair no spam, e o que fazer com um domínio que não envia?" en="Which DNS records does a domain need to send mail without landing in spam, and what do you do with a domain that never sends?" /></li>
          <li><T pt="Qual a diferença entre um e-mail de função (grupo) e uma conta compartilhada?" en="What is the difference between a role address (group) and a shared account?" /></li>
          <li><T pt="O que acontece com um projeto do Google Cloud criado com um Gmail pessoal? Como evitar?" en="What happens to a Google Cloud project created with a personal Gmail? How do you avoid it?" /></li>
          <li><T pt="Por que passkeys e chaves FIDO2 resistem a phishing e TOTP não?" en="Why do passkeys and FIDO2 keys resist phishing while TOTP does not?" /></li>
          <li><T pt="Um sócio com o único acesso de owner na AWS sai da empresa amanhã. O que deveria ter sido feito antes?" en="A partner holding the only AWS owner access leaves tomorrow. What should have been done before?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "Google Workspace: Security best practices for administrator accounts", href: "https://support.google.com/a/answer/9184226" },
          { label: "Google Workspace: Set up SPF", href: "https://support.google.com/a/answer/174124" },
          { label: "Google Workspace: Set up DMARC", href: "https://support.google.com/a/answer/2466580" },
          { label: "Google Cloud: Creating and managing organization resources", href: "https://cloud.google.com/resource-manager/docs/creating-managing-organization" },
          { label: "AWS: Root user best practices", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html" },
          { label: "AWS Organizations: Best practices", href: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices.html" },
          { label: "Cloudflare: Manage account members", href: "https://developers.cloudflare.com/fundamentals/manage-members/" },
          { label: "Vercel: Access roles", href: "https://vercel.com/docs/rbac/access-roles" },
          { label: "Netlify: Manage team members", href: "https://docs.netlify.com/accounts-and-billing/team-management/manage-team-members/" },
          { label: "Supabase: Access control", href: "https://supabase.com/docs/guides/platform/access-control" },
          { label: "NIST SP 800-63B: Authentication and authenticator management", href: "https://pages.nist.gov/800-63-4/sp800-63b.html" },
        ]}
      />
    </>
  );
}
