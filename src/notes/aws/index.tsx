import { Callout, CodeBlock, Diagram, Icon, Sources, T } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "aws",
  title: { en: "AWS", pt: "AWS" },
  seo: {
    title: { en: "AWS Notes — IAM, Organizations, VPC, ECS, RDS, S3 and more", pt: "Notas de AWS — IAM, Organizations, VPC, ECS, RDS, S3 e mais" },
    description: { en: "Interactive AWS guide based on the official documentation: IAM, Organizations, Identity Center, OIDC, VPC, ALB, ECR, ECS, RDS, S3 and Route 53, with diagrams and simulators.", pt: "Guia interativo de AWS baseado na documentação oficial: IAM, Organizations, Identity Center, OIDC, VPC, ALB, ECR, ECS, RDS, S3 e Route 53, com diagramas e simuladores." },
  },
  summary: "interactive AWS study guide (IAM, Organizations, VPC, ECS, RDS, S3, Route 53 and more) based on the official documentation, in English and Brazilian Portuguese.",
  kicker: { en: "Based on the official docs", pt: "Baseado na documentação oficial" },
  heroTitle: { en: <>Learn <em>AWS</em> visually and interactively.</>, pt: <>Aprenda <em>AWS</em> de forma visual e interativa.</> },
  heroLede: { en: "From accounts and permissions to networking, servers, databases and domains. Click, simulate and test what you learned in every section.", pt: "Das contas e permissões até rede, servidores, bancos de dados e domínios. Clique, simule e teste o que aprendeu em cada seção." },
  published: "2026-10-13",
  updated: "2026-10-25",
  variant: "aws",
  runtimeIcons: ["ban", "check"],
  toc: [
    {
      label: <T pt="Contas" en="Accounts" />,
      items: [
        { id: "organizations", title: <T pt="Organizations (dev e prod)" en="Organizations (dev and prod)" /> },
        { id: "accounts-roles", title: <T pt="Contas, usuários, roles e ARN" en="Accounts, users, roles and ARNs" /> },
        { id: "budget", title: <T pt="Orçamento e cobrança" en="Budget &amp; billing" /> },
      ],
    },
    {
      label: <T pt="Visão geral" en="Overview" />,
      items: [
        { id: "mapa", title: <T pt="Mapa da arquitetura" en="Architecture map" /> },
      ],
    },
    {
      label: <T pt="Fundamentos" en="Foundations" />,
      items: [
        { id: "iam", title: "IAM" },
        { id: "identity-center", title: "IAM Identity Center" },
        { id: "oidc", title: "OIDC & GitHub Actions" },
        { id: "cli", title: "AWS CLI" },
      ],
    },
    {
      label: <T pt="Rede" en="Networking" />,
      items: [
        { id: "vpc", title: "VPC" },
        { id: "sg", title: "Security Groups" },
        { id: "elb", title: "Load Balancer (ALB)" },
        { id: "acm", title: "ACM" },
      ],
    },
    {
      label: <T pt="Computação" en="Compute" />,
      items: [
        { id: "ec2", title: "EC2 & Auto Scaling" },
        { id: "ssh", title: "SSH" },
        { id: "eip", title: <T pt="IPs Elásticos" en="Elastic IPs" /> },
        { id: "ecr", title: "ECR" },
        { id: "ecs", title: "ECS" },
      ],
    },
    {
      label: <T pt="Segredos e acesso" en="Secrets &amp; access" />,
      items: [
        { id: "ssm", title: "Systems Manager" },
        { id: "secrets", title: "Secrets Manager" },
      ],
    },
    {
      label: <T pt="Dados" en="Data" />,
      items: [
        { id: "rds", title: "RDS" },
        { id: "s3", title: "S3" },
      ],
    },
    {
      label: <>DNS</>,
      items: [
        { id: "dominios", title: <T pt="Domínios e DNS" en="Domains &amp; DNS" /> },
        { id: "route53", title: "Route 53" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <div className="wrap">
        {/* ============ ORGANIZATIONS ============ */}
        <section className="topic" id="organizations">
          <header>
            <span className="tag"><T pt="Contas" en="Accounts" /></span>
            <h2>AWS Organizations</h2>
            <p className="lead"><T pt="Gerencie e governe várias contas AWS de forma central: criar contas, agrupá-las em OUs, aplicar políticas e ter uma fatura única." en="Centrally manage and govern many AWS accounts: create accounts, group them into OUs, apply policies and get a single bill." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="institution" /> Management account</h4>
              <T pt={<>Conta que administra a organização. <b>SCPs não afetam</b> usuários e roles dela, só as contas-membro.</>} en={<>The account that administers the organization. <b>SCPs do not affect</b> its users and roles, only member accounts.</>} />
            </div>
            <div className="card">
              <h4><Icon name="building" /> Member accounts</h4>
              <T pt="As demais contas. Cada conta AWS é um limite natural de permissão, segurança, custo e carga de trabalho." en="All other accounts. Each AWS account is a natural boundary for permissions, security, cost and workloads." />
            </div>
            <div className="card">
              <h4><Icon name="folder" /> OU</h4>
              <T pt="Organizational Unit: grupo de contas (por exemplo, as que atendem a uma aplicação ou a um ambiente). Políticas anexadas a uma OU valem para as contas dentro dela." en="Organizational Unit: a group of accounts (for example those serving one application or environment). Policies attached to an OU apply to the accounts inside it." />
            </div>
            <div className="card">
              <h4><Icon name="shield" /> SCP</h4>
              <T pt={<>Service Control Policy: define o <b>máximo de permissões</b> disponível para IAM users e roles das contas. Não concede nada.</>} en={<>Service Control Policy: defines the <b>maximum permissions</b> available to IAM users and roles in the accounts. It grants nothing.</>} />
            </div>
          </div>
          <p><T pt="Exemplo de desenho (uma sugestão didática, não um padrão obrigatório da AWS): uma conta para cada ambiente, agrupadas em OUs." en="Example layout (a teaching suggestion, not a mandatory AWS standard): one account per environment, grouped in OUs." /></p>
          <div className="vpc">
            <div className="label"><T pt="Organização" en="Organization" /></div>
            <div className="flow"> <span className="node"><Icon name="institution" /> Management</span><span className="arrow">→</span> <span className="node"><Icon name="folder" /> OU Prod<br /><small>prod · &lt;ID_CONTA_PROD&gt;</small></span> <span className="node"><Icon name="folder" /> OU Non-prod<br /><small>dev · &lt;ID_CONTA_DEV&gt;</small></span> <span className="node"><Icon name="folder" /> OU Shared<br /><small><T pt="tooling: ECR, CI/CD" en="tooling: ECR, CI/CD" /> · &lt;ID_CONTA_TOOLING&gt;</small></span> </div>
          </div>
          <p><T pt={<>A conta de <b>tooling/compartilhada</b> é opcional e costuma guardar o que várias contas usam, como o repositório de imagens no <a href="#ecr">ECR</a> (acesso entre contas via repository policy). Para começar, duas contas (dev e prod) já bastam.</>} en={<>The <b>tooling/shared</b> account is optional and usually holds what several accounts use, such as the image repository in <a href="#ecr">ECR</a> (cross-account access through a repository policy). To start, two accounts (dev and prod) are enough.</>} /></p>
          <h3><T pt="Passo a passo: criar a organização com contas dev e prod" en="Step by step: create the organization with dev and prod accounts" /></h3>
          <p><T pt={<>A ideia em uma frase: você já tem uma conta AWS; ela vira a <b>management account</b> e, a partir dela, você <b>cria</b> as contas dev e prod. Nenhuma conta nova é feita “do zero” no site da AWS: todas nascem dentro da organização.</>} en={<>The idea in one sentence: you already have an AWS account; it becomes the <b>management account</b> and, from it, you <b>create</b> the dev and prod accounts. No new account is made “from scratch” on the AWS site: they are all born inside the organization.</>} /></p>
          <h4><T pt="Passo 0 · Nunca usou a AWS? Crie sua primeira conta" en="Step 0 · New to AWS? Create your first account" /></h4>
          <ul>
            <li><T pt={<>Acesse <a href="https://signup.aws.amazon.com/" rel="noopener">signup.aws.amazon.com</a> (ou o botão “Create an AWS Account” em aws.amazon.com) e informe um <b>e-mail que só você controla</b> e um nome para a conta (pode mudar depois). Esse e-mail vira o login do <b>root user</b> — a identidade mais poderosa que existe na conta, acima de qualquer usuário IAM.</>} en={<>Go to <a href="https://signup.aws.amazon.com/" rel="noopener">signup.aws.amazon.com</a> (or the “Create an AWS Account” button on aws.amazon.com) and enter an <b>email only you control</b> and a name for the account (you can change it later). That email becomes the <b>root user</b>’s login — the single most powerful identity in the account, above any IAM user.</>} /></li>
            <li><T pt="Confirme o e-mail (a AWS manda um código), defina uma senha forte para o root e preencha o endereço de contato." en="Confirm the email (AWS sends a code), set a strong root password and fill in the contact address." /></li>
            <li><T pt={<>Informe um <b>cartão de crédito válido</b>. A AWS faz uma cobrança pequena e temporária só para verificar o cartão (ela estorna). Sem cartão, a conta não é criada — mesmo que você só use o nível gratuito.</>} en={<>Enter a <b>valid credit card</b>. AWS makes a small, temporary charge just to verify the card (it refunds it). Without a card, the account cannot be created — even if you only plan to use the free tier.</>} /></li>
            <li><T pt="Confirme sua identidade por SMS ou chamada de voz (um código de verificação)." en="Verify your identity by SMS or voice call (a verification code)." /></li>
            <li><T pt={<>Escolha um <b>plano de suporte</b>: <i>Basic</i> (gratuito; suporte só por fórum e documentação) é suficiente para aprender e para a maioria dos projetos pequenos. Dá para mudar de plano depois, a qualquer momento.</>} en={<>Choose a <b>support plan</b>: <i>Basic</i> (free; forum and documentation support only) is enough for learning and for most small projects. You can change plans later, at any time.</>} /></li>
            <li><T pt={<>Pronto: essa é a sua conta AWS. <b>Antes de fazer qualquer outra coisa</b>, ative MFA no root user (<b>IAM → Dashboard → Root user → Add MFA</b>, ou um app autenticador/chave de segurança) e nunca use o root no dia a dia — ele é só para tarefas que exigem root, como trocar o plano de suporte ou fechar a conta.</>} en={<>Done: that is your AWS account. <b>Before doing anything else</b>, enable MFA on the root user (<b>IAM → Dashboard → Root user → Add MFA</b>, with an authenticator app or a security key) and never use root day to day — it is only for tasks that require it, like changing the support plan or closing the account.</>} /></li>
          </ul>
          <Callout tone="good">
            <strong><T pt="Nível gratuito (Free Tier)" en="Free Tier" /></strong>
            <p><T pt={<>Contas novas ganham, por 12 meses, uma cota mensal gratuita de serviços comuns (por exemplo, 750 horas de uma instância EC2 <code>t2.micro</code>/<code>t3.micro</code>, 5 GB no S3). Além disso, alguns serviços têm uma cota <b>sempre gratuita</b> (não expira), como 1 milhão de requisições mensais no Lambda. Ultrapassar a cota não bloqueia nada: você simplesmente passa a pagar pelo excedente — é por isso que a seção de orçamento logo abaixo importa desde o primeiro dia.</>} en={<>New accounts get, for 12 months, a free monthly quota of common services (for example, 750 hours of a <code>t2.micro</code>/<code>t3.micro</code> EC2 instance, 5 GB on S3). On top of that, some services have an <b>always-free</b> quota (it never expires), like 1 million monthly Lambda requests. Going over the quota does not block anything: you simply start paying for the extra usage — which is why the budget section just below matters from day one.</>} /></p>
          </Callout>
          <h4><T pt="Passo 1 · Prepare a conta que será a management" en="Step 1 · Prepare the account that will be the management account" /></h4>
          <ul>
            <li><T pt={<>Use a conta mais antiga e “limpa” que você tem, de preferência sem recursos de aplicação: <b>a management account não deve rodar cargas de trabalho</b>, pois SCPs não a limitam.</>} en={<>Use the oldest, “cleanest” account you have, ideally with no application resources: <b>the management account should not run workloads</b>, since SCPs do not limit it.</>} /></li>
            <li><T pt="Proteja o root user com MFA e um e-mail que você controla. Esse e-mail é o dono de toda a organização." en="Protect the root user with MFA and an email you control. That email owns the whole organization." /></li>
          </ul>
          <h4><T pt="Passo 2 · Criar a organização" en="Step 2 · Create the organization" /></h4>
          <ul>
            <li><T pt={<>No console, entre como root ou como um admin da management account e abra <b>AWS Organizations → Create an organization</b>.</>} en={<>In the console, sign in as root or as an admin of the management account and open <b>AWS Organizations → Create an organization</b>.</>} /></li>
            <li><T pt={<>Isso cria a <b>Root</b> (a raiz da árvore) e deixa a conta atual como management. O modo padrão é <b>all features</b>, o que habilita SCPs; deixe assim.</>} en={<>This creates the <b>Root</b> (the top of the tree) and leaves the current account as the management account. The default mode is <b>all features</b>, which enables SCPs; keep it.</>} /></li>
            <li><T pt={<>Confirme o e-mail de verificação que a AWS envia (pode demorar a chegar) <b>em até 24 horas</b>; passado esse prazo, é preciso pedir o reenvio. A verificação é exigida antes de convidar contas.</>} en={<>Confirm the verification email AWS sends (it may be delayed) <b>within 24 hours</b>; after that you must request a resend. Verification is required before inviting accounts.</>} /></li>
          </ul>
          <h4><T pt="Passo 3 · Criar as OUs" en="Step 3 · Create the OUs" /></h4>
          <ul>
            <li><T pt={<>Em <b>AWS accounts</b>, marque a Root e use <b>Actions → Create new</b> (organizational unit). Crie <code>Prod</code> e <code>Non-prod</code>. Uma OU é só uma pasta: ela existe para você aplicar a mesma política a várias contas de uma vez.</>} en={<>Under <b>AWS accounts</b>, select the Root and use <b>Actions → Create new</b> (organizational unit). Create <code>Prod</code> and <code>Non-prod</code>. An OU is just a folder: it exists so you can apply the same policy to several accounts at once.</>} /></li>
          </ul>
          <h4><T pt="Passo 4 · Criar as contas dev e prod" en="Step 4 · Create the dev and prod accounts" /></h4>
          <p><T pt={<>Antes, separe <b>dois e-mails diferentes</b> que nunca tenham sido usados em outra conta AWS (incluindo a management). Um alias como <code>nome+dev@dominio.com</code> costuma ser aceito e cai na mesma caixa de entrada, mas escolha uma caixa que a sua equipe também monitore: é por ela que se recupera o root da conta.</>} en={<>First, set aside <b>two different emails</b> that have never been used for another AWS account (including the management account). An alias such as <code>name+dev@domain.com</code> is usually accepted and lands in the same inbox, but pick a mailbox your team also monitors: it is how the account’s root is recovered.</>} /></p>
          <ol>
            <li><T pt={<>Na management account: <b>AWS Organizations → AWS accounts → Add an AWS account → Create an AWS account</b>.</>} en={<>In the management account: <b>AWS Organizations → AWS accounts → Add an AWS account → Create an AWS account</b>.</>} /></li>
            <li><T pt={<><b>AWS account name</b>: <code>dev</code>. <b>Email address of the account’s root user</b>: o e-mail exclusivo desta conta (global e único: duas contas não podem ter o mesmo). Regras da API: de 6 a 64 caracteres, só ASCII de 7 bits, um único <code>@</code>. Um e-mail inválido impede acessar o root e remover a conta depois.</>} en={<><b>AWS account name</b>: <code>dev</code>. <b>Email address of the account’s root user</b>: the email exclusive to this account (globally unique: two accounts cannot share one). API rules: 6 to 64 characters, 7-bit ASCII only, a single <code>@</code>. An invalid email makes it impossible to reach the root and to remove the account later.</>} /></li>
            <li><T pt={<><b>IAM role name</b>: deixe em branco para usar <code>OrganizationAccountAccessRole</code>. Essa role é criada <i>dentro</i> da conta nova, confia na management account e dá permissões de administrador. O nome não pode começar com <code>AWSServiceRoleFor</code>.</>} en={<><b>IAM role name</b>: leave blank to use <code>OrganizationAccountAccessRole</code>. This role is created <i>inside</i> the new account, trusts the management account and grants administrator permissions. The name cannot start with <code>AWSServiceRoleFor</code>.</>} /></li>
            <li><T pt={<><b>Tags</b> (opcional, mas útil): por exemplo <code>Environment=dev</code>. Se uma tag for inválida, a requisição inteira falha e a conta não é criada.</>} en={<><b>Tags</b> (optional, but useful): for example <code>Environment=dev</code>. If any tag is invalid, the whole request fails and the account is not created.</>} /></li>
            <li><T pt={<>Clique em <b>Create AWS account</b>. A criação é <b>assíncrona</b>: a conta aparece na lista como pendente e pode levar alguns minutos até ficar utilizável. Atualize a página.</>} en={<>Click <b>Create AWS account</b>. Creation is <b>asynchronous</b>: the account shows up as pending and can take a few minutes to become usable. Refresh the page.</>} /></li>
            <li><T pt={<>Repita tudo para <code>prod</code>, com outro e-mail.</>} en={<>Repeat everything for <code>prod</code>, with a different email.</>} /></li>
            <li><T pt={<>Anote o <b>ID de 12 dígitos</b> de cada conta (<code>&lt;ID_CONTA_DEV&gt;</code> e <code>&lt;ID_CONTA_PROD&gt;</code>). Você vai usá-los em ARNs, em trust policies e nos perfis da CLI.</>} en={<>Write down each account’s <b>12-digit ID</b> (<code>&lt;ID_CONTA_DEV&gt;</code> and <code>&lt;ID_CONTA_PROD&gt;</code>). You will use them in ARNs, trust policies and CLI profiles.</>} /></li>
            <li><T pt={<>Mova cada conta para a OU certa: marque <code>dev</code> (a caixa de seleção, não o nome) → <b>Actions → AWS account → Move</b> → <code>Non-prod</code>; <code>prod</code> → <code>Prod</code>. Contas novas nascem na Root.</>} en={<>Move each account to the right OU: select <code>dev</code> (the checkbox, not the name) → <b>Actions → AWS account → Move</b> → <code>Non-prod</code>; <code>prod</code> → <code>Prod</code>. New accounts are born in the Root.</>} /></li>
          </ol>
          <Callout tone="warn">
            <strong><T pt="Pegadinhas ao criar contas" en="Gotchas when creating accounts" /></strong>
            <ul>
              <li><T pt={<><b>“Organization still initializing” ou limite excedido logo após criar a organização:</b> espere cerca de uma hora e tente de novo; se persistir, fale com o AWS Support. Contas fechadas ou excluídas continuam contando para o limite de contas.</>} en={<><b>“Organization still initializing” or limit exceeded right after creating the organization:</b> wait about an hour and try again; if it persists, contact AWS Support. Closed or deleted accounts still count toward the account limit.</>} /></li>
              <li><T pt={<><b>Forma de pagamento:</b> conta criada pelo Organizations <b>não</b> coleta sozinha os dados para operar como conta avulsa (por exemplo, meio de pagamento). Quem paga é a management (fatura consolidada), mas se um dia você precisar <i>remover</i> a conta da organização, terá de informar esses dados antes.</>} en={<><b>Payment method:</b> an account created through Organizations does <b>not</b> collect on its own the information needed to run as a standalone account (for example, a payment method). The management account pays (consolidated billing), but if you ever need to <i>remove</i> the account from the organization, you must provide that information first.</>} /></li>
              <li><T pt={<><b>Root da conta nova:</b> contas criadas pelo Organizations nascem sem credenciais de root e, por padrão, não conseguem entrar como root nem recuperar a senha (a menos que a recuperação de conta esteja habilitada). Se uma tarefa exigir root numa conta-membro, fale com o administrador da organização. No dia a dia você não usa o root.</>} en={<><b>Root of the new account:</b> accounts created through Organizations are born with no root credentials and, by default, cannot sign in as root or recover the password (unless account recovery is enabled). If a task requires root in a member account, ask the organization’s administrator. Day to day you do not use root.</>} /></li>
              <li><T pt={<><b>Acesso do IAM ao billing:</b> a API tem o parâmetro <code>IamUserAccessToBilling</code> (padrão <code>ALLOW</code>: usuários e roles com a permissão adequada podem ver o billing da conta). Com <code>DENY</code>, só o root vê.</>} en={<><b>IAM access to billing:</b> the API has the <code>IamUserAccessToBilling</code> parameter (default <code>ALLOW</code>: users and roles with the right permission can see the account’s billing). With <code>DENY</code>, only root can.</>} /></li>
            </ul>
          </Callout>
          <h4><T pt="Passo 5 · Dar acesso às pessoas (IAM Identity Center)" en="Step 5 · Give people access (IAM Identity Center)" /></h4>
          <p><T pt={<>Para testar rápido, basta o <b>Switch role</b> com a <code>OrganizationAccountAccessRole</code> (ao fim deste passo). Para o dia a dia, a AWS recomenda o <a href="#identity-center">IAM Identity Center</a>: uma pessoa entra uma vez no portal e escolhe a conta e o nível de acesso, com credenciais temporárias. Tudo abaixo é feito na <b>management account</b>.</>} en={<>To test quickly, <b>Switch role</b> with <code>OrganizationAccountAccessRole</code> is enough (at the end of this step). For daily use, AWS recommends <a href="#identity-center">IAM Identity Center</a>: a person signs in once to the portal and picks the account and the level of access, with temporary credentials. Everything below is done in the <b>management account</b>.</>} /></p>
          <ol>
            <li><T pt={<><b>Habilitar.</b> Abra o <a href="https://console.aws.amazon.com/singlesignon" rel="noopener">console do IAM Identity Center</a> e habilite-o com uma <b>instância da organização</b> (a recomendada; só ela gerencia acesso a várias contas). Escolha a região com cuidado: é nela que o serviço vive, e ela aparece depois como <code>sso_region</code> na CLI. Ao habilitar pela primeira vez, o diretório do próprio Identity Center já vem como fonte de identidade padrão.</>} en={<><b>Enable.</b> Open the <a href="https://console.aws.amazon.com/singlesignon" rel="noopener">IAM Identity Center console</a> and enable it with an <b>organization instance</b> (the recommended one; only it manages access to many accounts). Choose the Region carefully: that is where the service lives, and it later shows up as <code>sso_region</code> in the CLI. When you enable it for the first time, the Identity Center directory is already the default identity source.</>} /></li>
            <li><T pt={<><b>Criar grupos.</b> <b>Groups → Create group</b>: por exemplo <code>admins</code> e <code>devs</code>. Dê permissões a grupos, não a pessoas: quem entra ou sai do time muda só a associação.</>} en={<><b>Create groups.</b> <b>Groups → Create group</b>: for example <code>admins</code> and <code>devs</code>. Give permissions to groups, not people: someone joining or leaving the team only changes membership.</>} /></li>
            <li><T pt={<><b>Criar o usuário.</b> <b>Users → Add user</b>: informe o <i>username</i> (fácil de lembrar, <b>não pode ser mudado depois</b>), deixe marcada a opção de enviar um e-mail com as instruções de senha, informe um e-mail único, nome e sobrenome e, na tela seguinte, adicione a pessoa ao grupo. Confirme em <b>Add user</b>.</>} en={<><b>Create the user.</b> <b>Users → Add user</b>: enter the <i>username</i> (easy to remember, <b>cannot be changed later</b>), keep the option to email password-setup instructions, enter a unique email, first and last name, and on the next screen add the person to the group. Confirm with <b>Add user</b>.</>} /></li>
            <li><T pt={<><b>Criar os permission sets.</b> <b>Permission sets → Create permission set → Predefined permission set</b>. Sugestão: <code>AdministratorAccess</code>, <code>PowerUserAccess</code> e <code>ReadOnlyAccess</code>. A duração padrão da sessão é de 1 hora. <code>PowerUserAccess</code> não gerencia usuários e grupos IAM, ao contrário do administrador.</>} en={<><b>Create the permission sets.</b> <b>Permission sets → Create permission set → Predefined permission set</b>. Suggestion: <code>AdministratorAccess</code>, <code>PowerUserAccess</code> and <code>ReadOnlyAccess</code>. The default session duration is 1 hour. <code>PowerUserAccess</code> cannot manage IAM users and groups, unlike administrator.</>} /></li>
            <li><T pt={<><b>Atribuir por conta.</b> <b>AWS accounts</b> (em <i>Multi-account permissions</i>) → marque a conta → <b>Assign users or groups</b> → escolha o grupo → escolha o permission set → <b>Submit</b>. O Identity Center cria dentro da conta uma role IAM gerenciada por ele. Aguarde a mensagem de que a conta foi reprovisionada.</>} en={<><b>Assign per account.</b> <b>AWS accounts</b> (under <i>Multi-account permissions</i>) → select the account → <b>Assign users or groups</b> → pick the group → pick the permission set → <b>Submit</b>. Identity Center creates an IAM role it manages inside the account. Wait for the message that the account was reprovisioned.</>} /></li>
            <li><T pt={<><b>A pessoa ativa o acesso.</b> Ela recebe o e-mail “Invitation to join IAM Identity Center” (de <code>no-reply@signin.aws</code> ou <code>no-reply@login.awsapps.com</code>: libere esses remetentes), aceita o convite, define a senha e registra o MFA. Depois entra no <b>AWS access portal</b>, expande a organização, escolhe a conta e a role. “Role” abre o console; “Access keys” dá credenciais temporárias para CLI e SDK.</>} en={<><b>The person activates access.</b> They receive the “Invitation to join IAM Identity Center” email (from <code>no-reply@signin.aws</code> or <code>no-reply@login.awsapps.com</code>: allow those senders), accept the invitation, set a password and register MFA. Then they sign in to the <b>AWS access portal</b>, expand the organization, and pick the account and role. “Role” opens the console; “Access keys” gives temporary credentials for the CLI and SDKs.</>} /></li>
          </ol>
          <p><T pt="Uma divisão razoável para começar (adapte à sua equipe):" en="A reasonable split to start with (adapt it to your team):" /></p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th><T pt="Grupo" en="Group" /></th>
                  <th><code>dev</code></th>
                  <th><code>prod</code></th>
                  <th><T pt="Management" en="Management" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>admins</code></td>
                  <td>AdministratorAccess</td>
                  <td>AdministratorAccess</td>
                  <td>AdministratorAccess</td>
                </tr>
                <tr>
                  <td><code>devs</code></td>
                  <td>PowerUserAccess</td>
                  <td>ReadOnlyAccess</td>
                  <td><T pt="(nada)" en="(none)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4><T pt="Passo 5b · Usar as contas no terminal" en="Step 5b · Use the accounts from the terminal" /></h4>
          <p><T pt={<>Crie um perfil para cada conta. Pegue a <i>SSO start URL</i> e a região no portal (<b>Access keys → IAM Identity Center credentials</b>) ou a Issuer URL no painel do Identity Center. Com a CLI v2:</>} en={<>Create a profile for each account. Get the <i>SSO start URL</i> and Region from the portal (<b>Access keys → IAM Identity Center credentials</b>) or the Issuer URL from the Identity Center dashboard. With CLI v2:</>} /></p>
          <CodeBlock code={`aws configure sso
# SSO session name:      baselarte
# SSO start URL:         https://<seu-portal>.awsapps.com/start
# SSO region:            us-east-1
# SSO registration scopes: sso:account:access
# (choose the dev account and role, then name the profile: dev)

aws configure sso      # repeat: choose the prod account, profile name: prod

aws sso login --profile dev
aws sts get-caller-identity --profile dev     # Account = <ID_CONTA_DEV>
aws sts get-caller-identity --profile prod    # Account = <ID_CONTA_PROD>`} />
          <p><T pt={<>O resultado em <code>~/.aws/config</code>: os dois perfis compartilham a mesma <code>sso-session</code>, então um único login vale para ambos.</>} en={<>The result in <code>~/.aws/config</code>: both profiles share the same <code>sso-session</code>, so a single login covers both.</>} /></p>
          <CodeBlock code={`[profile dev]
sso_session = baselarte
sso_account_id = <ID_CONTA_DEV>
sso_role_name = PowerUserAccess
region = sa-east-1

[profile prod]
sso_session = baselarte
sso_account_id = <ID_CONTA_PROD>
sso_role_name = ReadOnlyAccess
region = sa-east-1

[sso-session baselarte]
sso_region = us-east-1
sso_start_url = https://<seu-portal>.awsapps.com/start
sso_registration_scopes = sso:account:access`} />
          <ul>
            <li><T pt={<><b>Alternativa rápida, sem Identity Center:</b> entre na management como um <b>usuário não-root</b> com permissão <code>sts:AssumeRole</code> sobre a role (o root não troca de role) e use <b>Switch role</b> no console com o ID da conta e a role <code>OrganizationAccountAccessRole</code>; veja <a href="#accounts-roles">Contas, usuários, roles e ARN</a>. Serve para testar, mas dá administrador total e não escala para uma equipe.</>} en={<><b>Quick alternative, without Identity Center:</b> sign in to the management account as a <b>non-root user</b> with the <code>sts:AssumeRole</code> permission on the role (root cannot switch roles) and use <b>Switch role</b> in the console with the account ID and the <code>OrganizationAccountAccessRole</code> role; see <a href="#accounts-roles">Accounts, users, roles and ARNs</a>. Fine for testing, but it grants full administrator and does not scale to a team.</>} /></li>
            <li><T pt={<>Quando as credenciais expiram, rode <code>aws sso login --profile dev</code> de novo; <code>aws sso logout</code> apaga as credenciais em cache.</>} en={<>When credentials expire, run <code>aws sso login --profile dev</code> again; <code>aws sso logout</code> deletes the cached credentials.</>} /></li>
          </ul>
          <h4><T pt="Passo 6 · Preparar cada conta (o que se repete em dev e prod)" en="Step 6 · Prepare each account (what repeats in dev and prod)" /></h4>
          <p><T pt={<>Cada conta nasce vazia. Para receber o deploy automático do GitHub, faça o mesmo checklist nas duas, com os perfis <code>dev</code> e <code>prod</code> (as permissões de administrador só são necessárias nesta preparação inicial):</>} en={<>Each account is born empty. To receive automatic deploys from GitHub, run the same checklist in both, with the <code>dev</code> and <code>prod</code> profiles (administrator permissions are only needed for this initial setup):</>} /></p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th><T pt="O que fazer, em cada conta" en="What to do, in each account" /></th>
                  <th><T pt="Onde está o passo a passo" en="Where the how-to is" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><T pt="Escolher a região de trabalho (a mesma nas duas, para o código não mudar)." en="Pick the working Region (the same in both, so the code does not change)." /></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><T pt="Criar um orçamento com alerta." en="Create a budget with an alert." /></td>
                  <td><a href="#budget"><T pt="Orçamento e cobrança" en="Budget &amp; billing" /></a></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td><T pt={<>Criar rede, repositório <a href="#ecr">ECR</a>, cluster e serviço <a href="#ecs">ECS</a> (um conjunto por conta).</>} en={<>Create the network, the <a href="#ecr">ECR</a> repository, the <a href="#ecs">ECS</a> cluster and service (one set per account).</>} /></td>
                  <td><a href="#vpc">VPC</a>, <a href="#ecr">ECR</a>, <a href="#ecs">ECS</a></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td><T pt="Criar os segredos da aplicação (cada conta com os seus valores)." en="Create the application secrets (each account with its own values)." /></td>
                  <td><a href="#secrets">Secrets Manager</a></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td><T pt={<>Criar o provedor <a href="#oidc">OIDC</a> do GitHub e a role de deploy da conta.</>} en={<>Create the GitHub <a href="#oidc">OIDC</a> provider and the account’s deploy role.</>} /></td>
                  <td><a href="/notas/github-aws-oidc/"><T pt="Nota GitHub para AWS com OIDC" en="GitHub to AWS with OIDC note" /></a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted"><T pt={<>Se preferir um repositório ECR único para todos os ambientes, use a conta de <i>tooling</i> e libere as outras por repository policy. Para começar com duas contas, um ECR por conta é mais simples e mantém o isolamento total.</>} en={<>If you prefer a single ECR repository for all environments, use the <i>tooling</i> account and allow the others through a repository policy. To start with two accounts, one ECR per account is simpler and keeps isolation complete.</>} /></p>
          <h4><T pt="Passo 7 · Conferir se ficou certo" en="Step 7 · Check that it is right" /></h4>
          <CodeBlock code={`# from the management account (profile with access to it)
aws organizations describe-organization --query 'Organization.FeatureSet'   # "ALL"
aws organizations list-accounts --query 'Accounts[].[Name,Id,Status]' --output table
aws organizations list-organizational-units-for-parent --parent-id r-abcd

# each profile must land in a DIFFERENT account
aws sts get-caller-identity --profile dev
aws sts get-caller-identity --profile prod`} />
          <ul>
            <li><T pt={<>Esperado: <code>FeatureSet</code> igual a <code>ALL</code>; as contas <code>dev</code> e <code>prod</code> com status <code>ACTIVE</code> e IDs diferentes; cada perfil devolvendo o ID da sua própria conta.</>} en={<>Expected: <code>FeatureSet</code> equal to <code>ALL</code>; the <code>dev</code> and <code>prod</code> accounts <code>ACTIVE</code> with different IDs; each profile returning its own account ID.</>} /></li>
            <li><T pt={<>Se um perfil devolver o ID errado, o <code>sso_account_id</code> do perfil está trocado: é o erro mais comum, e o mais perigoso, porque o deploy de dev iria para a produção.</>} en={<>If a profile returns the wrong ID, the profile’s <code>sso_account_id</code> is swapped: the most common mistake and the most dangerous, because a dev deploy would land in production.</>} /></li>
          </ul>
          <h4><T pt="Passo 8 · Aplicar guardrails (opcional, mas vale a pena)" en="Step 8 · Apply guardrails (optional, but worth it)" /></h4>
          <ul>
            <li><T pt={<>Habilite o tipo de política em <b>Policies → Service control policies → Enable service control policies</b>. Teste uma SCP primeiro na OU <code>Non-prod</code> (veja o exemplo mais abaixo) e só depois leve para <code>Prod</code>. Nunca comece pela Root.</>} en={<>Enable the policy type under <b>Policies → Service control policies → Enable service control policies</b>. Try an SCP first on the <code>Non-prod</code> OU (see the example below) and only then take it to <code>Prod</code>. Never start at the Root.</>} /></li>
            <li><T pt={<>Para anexar: abra a OU (clique no nome) → aba <b>Policies</b> → <b>Attach</b>. A <code>FullAWSAccess</code> padrão continua anexada; só a remova se tiver uma lista de permissões (allow list) que a substitua.</>} en={<>To attach: open the OU (click its name) → <b>Policies</b> tab → <b>Attach</b>. The default <code>FullAWSAccess</code> stays attached; only remove it if you have an allow list replacing it.</>} /></li>
          </ul>
          <h4><T pt="O mesmo pelo terminal" en="The same from the terminal" /></h4>
          <p><T pt="Com a CLI autenticada na management account (os IDs abaixo são ilustrativos):" en="With the CLI authenticated to the management account (the IDs below are illustrative):" /></p>
          <CodeBlock code={`# 1 · create the organization (all features)
aws organizations create-organization --feature-set ALL

# 2 · find the Root ID and create the OUs
aws organizations list-roots --query 'Roots[0].Id' --output text      # r-abcd
aws organizations create-organizational-unit --parent-id r-abcd --name Prod
aws organizations create-organizational-unit --parent-id r-abcd --name Non-prod

# 3 · create the dev account (asynchronous: follow the status)
aws organizations create-account \\
  --account-name dev --email nome+dev@dominio.com \\
  --role-name OrganizationAccountAccessRole \\
  --tags Key=Environment,Value=dev
aws organizations describe-create-account-status --create-account-request-id car-xxxxxxxx

# 4 · move the account to its OU (the account ID comes from the status above)
aws organizations move-account --account-id 111111111111 \\
  --source-parent-id r-abcd --destination-parent-id ou-abcd-11111111`} />
          <Callout tone="good">
            <strong><T pt="Como fica o resto da AWS" en="What the rest of AWS looks like" /></strong>
            <p><T pt={<>Cada conta é um ambiente completo e isolado: a conta <code>dev</code> tem sua própria <a href="#vpc">VPC</a>, seu RDS e seus serviços; a <code>prod</code> tem os dela. Nada é compartilhado, a não ser que você libere (por exemplo, a imagem Docker no <a href="#ecr">ECR</a> de uma conta de tooling). O mesmo código sobe nas duas contas; só muda para onde a pipeline aponta, via <a href="#oidc">OIDC</a>, com uma role por conta.</>} en={<>Each account is a full, isolated environment: the <code>dev</code> account has its own <a href="#vpc">VPC</a>, RDS and services; <code>prod</code> has its own. Nothing is shared unless you allow it (for example, the Docker image in the <a href="#ecr">ECR</a> of a tooling account). The same code ships to both accounts; only where the pipeline points changes, through <a href="#oidc">OIDC</a>, with one role per account.</>} /></p>
          </Callout>
          <h3><T pt="Por que separar contas por ambiente" en="Why separate accounts by environment" /></h3>
          <p><T pt="A AWS recomenda usar várias contas para separar cargas de trabalho, em vez de uma só. Por padrão não existe acesso entre contas: se produção e não-produção ficam em contas distintas, elas permanecem isoladas até você liberar explicitamente. O número de contas não altera a cobrança, que é baseada no uso dos recursos." en="AWS recommends using several accounts to separate workloads rather than a single one. By default there is no access between accounts: if production and non-production live in different accounts, they stay isolated until you explicitly allow access. The number of accounts does not change billing, which is based on resource usage." /></p>
          <h3><T pt="Simulador de herança de SCP" en="SCP inheritance simulator" /></h3>
          <div className="widget" data-org="">
            <div className="wtitle"><T pt="Clique em um nó da árvore" en="Click a node of the tree" /></div>
            <ul className="tree root">
              <li>
                <button className="node" id="o-root" data-scp="full deny-leave" aria-pressed="true"><Icon name="tree" /> Root</button>
                <ul className="tree">
                  <li><button className="node" id="o-mgmt" data-parent="o-root" data-exempt="1"><Icon name="institution" /> Management account</button></li>
                  <li>
                    <button className="node" id="o-prod" data-parent="o-root" data-scp="regions"><Icon name="folder" /> OU Prod</button>
                    <ul className="tree">
                      <li><button className="node" id="o-app" data-parent="o-prod"><Icon name="building" /> prod</button></li>
                    </ul>
                  </li>
                  <li>
                    <button className="node" id="o-nonprod" data-parent="o-root" data-scp="costly"><Icon name="folder" /> OU Non-prod</button>
                    <ul className="tree">
                      <li><button className="node" id="o-stg" data-parent="o-nonprod"><Icon name="building" /> dev</button></li>
                    </ul>
                  </li>
                  <li>
                    <button className="node" id="o-shared" data-parent="o-root"><Icon name="folder" /> OU Shared</button>
                    <ul className="tree">
                      <li><button className="node" id="o-tool" data-parent="o-shared"><Icon name="building" /> tooling</button></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="chips" aria-label="Effective SCPs"> <span className="chip" data-id="full">FullAWSAccess</span> <span className="chip" data-id="deny-leave"><T pt="Negar sair da organização" en="Deny leaving the organization" /></span> <span className="chip" data-id="regions"><T pt="Só regiões aprovadas" en="Approved regions only" /></span> <span className="chip" data-id="costly"><T pt="Negar instâncias caras" en="Deny expensive instances" /></span> </div>
            <p className="org-note" hidden><T pt={<><Icon name="alert" /> SCPs <b>não</b> afetam a management account.</>} en={<><Icon name="alert" /> SCPs do <b>not</b> affect the management account.</>} /></p>
            <p className="muted"><T pt="As SCPs destacadas são as efetivas: cada conta só tem o que é permitido por todos os níveis acima dela. Os nomes das SCPs aqui são ilustrativos." en="Highlighted SCPs are the effective ones: an account only has what every level above it allows. The SCP names here are illustrative." /></p>
          </div>
          <h3><T pt="Exemplo de SCP" en="SCP example" /></h3>
          <p><T pt="Exemplo didático que nega ações fora de duas regiões, com exceção de serviços globais. Adapte e teste em uma OU de teste antes de usar. A AWS publica exemplos oficiais de SCP na página de exemplos de SCP." en="Teaching example denying actions outside two regions, except for global services. Adapt it and test it in a test OU first. AWS publishes official SCP examples in its SCP examples page." /></p>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "NotAction": ["iam:*", "organizations:*", "route53:*", "support:*"],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": { "aws:RequestedRegion": ["us-east-1", "sa-east-1"] }
      }
    }
  ]
}`} />
          <Callout tone="warn">
            <strong><T pt="Limites e pegadinhas (segundo a documentação)" en="Limits and gotchas (per the docs)" /></strong>
            <ul>
              <li><T pt={<>SCPs só existem em organizações com <b>all features</b> habilitado; no modo apenas de cobrança consolidada elas não estão disponíveis.</>} en={<>SCPs exist only in organizations with <b>all features</b> enabled; they are not available with consolidated billing only.</>} /></li>
              <li><T pt="SCP nunca concede permissão. A permissão efetiva é a interseção entre SCP/RCP e as políticas de identidade e de recurso." en="An SCP never grants permission. Effective permission is the intersection of SCP/RCP and identity/resource policies." /></li>
              <li><T pt={<>SCPs afetam também o root user das contas-membro, mas <b>não</b> afetam service-linked roles nem usuários de fora da organização.</>} en={<>SCPs also affect member-account root users, but they do <b>not</b> affect service-linked roles or principals outside the organization.</>} /></li>
              <li><T pt={<>Não remova a <code>FullAWSAccess</code> sem substituí-la: todas as ações das contas-membro falhariam.</>} en={<>Do not remove <code>FullAWSAccess</code> without replacing it: all member-account actions would fail.</>} /></li>
              <li><T pt="A AWS recomenda não anexar SCPs na raiz sem testar: use uma OU e mova as contas aos poucos." en="AWS recommends not attaching SCPs to the root without testing: use an OU and move accounts a few at a time." /></li>
              <li><T pt="Todos os caracteres da SCP contam para o tamanho máximo (veja as cotas)." en="Every character counts toward an SCP's maximum size (see the quotas)." /></li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Mais de um ambiente ou time; necessidade de guardrails (regiões, serviços); fatura única; compartilhamento central de recursos." en="More than one environment or team; need for guardrails (regions, services); a single bill; central resource sharing." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Aplicar SCP direto na raiz sem teste; esperar que SCP libere permissões; rodar cargas de trabalho na management account (ela não é limitada por SCP)." en="Applying an SCP straight to the root without testing; expecting an SCP to grant permissions; running workloads in the management account (it is not limited by SCPs)." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt={<>Uma SCP que permite <code>s3:*</code> já dá acesso ao S3 aos usuários?</>} en={<>Does an SCP that allows <code>s3:*</code> already give users S3 access?</>} /></summary>
            <div className="ans"><T pt="Não. SCP só define o teto. É preciso uma política IAM (ou de recurso) que conceda a permissão." en="No. An SCP only sets the ceiling. An IAM (or resource) policy must still grant the permission." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Qual conta não é afetada por SCPs?" en="Which account is not affected by SCPs?" /></summary>
            <div className="ans"><T pt="A management account." en="The management account." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html" rel="noopener">Creating an AWS account</a></li>
              <li><a href="https://aws.amazon.com/free/" rel="noopener">AWS Free Tier</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html" rel="noopener">What is AWS Organizations?</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_tutorials_basic.html" rel="noopener">Tutorial: Creating and configuring an organization</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create-cross.html" rel="noopener">Creating a member account in your organization</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/APIReference/API_CreateAccount.html" rel="noopener">Organizations API: CreateAccount</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/about-email-verification.html" rel="noopener">Email address verification with AWS Organizations</a></li>
              <li><a href="https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html" rel="noopener">Getting started with IAM Identity Center</a> · <a href="https://docs.aws.amazon.com/singlesignon/latest/userguide/quick-start-default-idc.html" rel="noopener">Configure user access with the default directory</a></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" rel="noopener">Configuring IAM Identity Center authentication with the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html" rel="noopener">Service control policies (SCPs)</a></li>
              <li><a href="https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html" rel="noopener">Organizing Your AWS Environment Using Multiple Accounts</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html" rel="noopener">IAM: Policy evaluation logic</a></li>
            </ul>
            <p><T pt={<><b>Removido por falta de fonte oficial:</b> a anotação sobre descontos por volume e compartilhamento de Savings Plans/Reservas na fatura consolidada. Consulte a documentação de billing antes de afirmar isso.</>} en={<><b>Removed for lack of an official source:</b> the note on volume discounts and Savings Plans/Reservations sharing under consolidated billing. Check the billing docs before claiming it.</>} /></p>
          </Sources>
        </section>
        {/* ============ ACCOUNTS, USERS, ROLES AND ARNS ============ */}
        <section className="topic" id="accounts-roles">
          <header>
            <span className="tag"><T pt="Contas" en="Accounts" /></span>
            <h2><T pt="Contas, usuários, roles e ARN" en="Accounts, users, roles and ARNs" /></h2>
            <p className="lead"><T pt="O que cada nome significa (e-mail do root, nome da conta, username), como criar uma identidade que não é root e como uma conta dá acesso a outra por role." en="What each name means (root email, account name, username), how to create an identity that is not root and how one account grants access to another through a role." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="crown" /> Root user</h4>
              <T pt={<>É a identidade criada com a conta. Entra com o <b>e-mail da conta</b> e a senha. Tem acesso completo a todos os serviços e recursos. Use só nas tarefas que exigem root e proteja com MFA.</>} en={<>It is the identity created with the account. It signs in with the <b>account email</b> and password. It has complete access to all services and resources. Use it only for tasks that require root and protect it with MFA.</>} />
            </div>
            <div className="card">
              <h4><Icon name="building" /> Account name</h4>
              <T pt={<>Um <b>rótulo</b> para humanos (por exemplo <code>dev</code>), mostrado em faturas e consoles como o Billing e o Organizations. Não é usado para entrar e não é um identificador: quem identifica a conta é o ID de 12 dígitos.</>} en={<>A <b>label</b> for humans (for example <code>dev</code>), shown on invoices and in consoles such as Billing and Organizations. It is not used to sign in and it is not an identifier: the 12-digit ID identifies the account.</>} />
            </div>
            <div className="card">
              <h4><Icon name="user" /> Username</h4>
              <T pt={<>Nome de uma identidade <b>que não é root</b>: um usuário IAM ou um usuário do Identity Center. Só faz sentido <i>dentro</i> de uma conta (ou de um portal) e vem sempre acompanhado de uma senha.</>} en={<>The name of an identity that <b>is not root</b>: an IAM user or an Identity Center user. It only makes sense <i>inside</i> an account (or a portal) and always comes with a password.</>} />
            </div>
            <div className="card">
              <h4><Icon name="key" /> ARN</h4>
              <T pt="Amazon Resource Name: o endereço único de um recurso da AWS (um usuário, uma role, um bucket). É assim que políticas dizem “sobre quem” e “sobre o quê”." en="Amazon Resource Name: the unique address of an AWS resource (a user, a role, a bucket). It is how policies say “about whom” and “about what”." />
            </div>
          </div>
          <h3><T pt="Quem é quem: root, nome da conta e username" en="Who is who: root, account name and username" /></h3>
          <p><T pt={<>Uma conta AWS tem <b>um</b> root e quantas identidades não-root você criar. Cada tipo de identidade entra por uma porta diferente, com dados diferentes:</>} en={<>An AWS account has <b>one</b> root and as many non-root identities as you create. Each kind of identity signs in through a different door, with different data:</>} /></p>
          <Diagram minWidth={620} caption={<T pt="Três portas para a mesma conta. O e-mail é do root; o username é de quem não é root; o nome da conta não entra em nenhum login." en="Three doors into the same account. The email belongs to root; the username belongs to non-root identities; the account name is not part of any sign-in." />}>
            <svg viewBox="0 0 700 300" role="img" aria-label="Quem entra como quem / Who signs in as whom">
              <rect x="330" y="14" width="360" height="272" rx="6" className="ln dash" />
              <text x="344" y="34" className="pt mut" textAnchor="start">Conta AWS · ID de 12 dígitos</text>
              <text x="344" y="34" className="en mut" textAnchor="start">AWS account · 12-digit ID</text>
              <text x="344" y="52" className="pt mut" textAnchor="start">account name = só um rótulo</text>
              <text x="344" y="52" className="en mut" textAnchor="start">account name = just a label</text>
              <rect x="10" y="70" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="92" className="pt" textAnchor="middle">Entrar como root</text>
              <text x="150" y="92" className="en" textAnchor="middle">Sign in as root</text>
              <text x="150" y="112" className="pt mut" textAnchor="middle">e-mail da conta + senha</text>
              <text x="150" y="112" className="en mut" textAnchor="middle">account email + password</text>
              <path d="M290 97L350 97" className="ln" />
              <path d="M342.8 100.5L350 97L342.8 93.5" className="ln" />
              <rect x="350" y="70" width="320" height="54" rx="4" className="ln brandfill" />
              <text x="510" y="92" className="pt" textAnchor="middle">Root user</text>
              <text x="510" y="92" className="en" textAnchor="middle">Root user</text>
              <text x="510" y="112" className="pt mut" textAnchor="middle">acesso total · só tarefas raras</text>
              <text x="510" y="112" className="en mut" textAnchor="middle">full access · rare tasks only</text>
              <rect x="10" y="142" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="164" className="pt" textAnchor="middle">Entrar como usuário IAM</text>
              <text x="150" y="164" className="en" textAnchor="middle">Sign in as an IAM user</text>
              <text x="150" y="184" className="pt mut" textAnchor="middle">ID ou alias da conta + username + senha</text>
              <text x="150" y="184" className="en mut" textAnchor="middle">account ID or alias + username + password</text>
              <path d="M290 169L350 169" className="ln" />
              <path d="M342.8 172.5L350 169L342.8 165.5" className="ln" />
              <rect x="350" y="142" width="320" height="54" rx="4" className="ln fillsoft" />
              <text x="510" y="164" className="pt" textAnchor="middle">IAM user</text>
              <text x="510" y="164" className="en" textAnchor="middle">IAM user</text>
              <text x="510" y="184" className="pt mut" textAnchor="middle">credencial de longo prazo</text>
              <text x="510" y="184" className="en mut" textAnchor="middle">long-term credentials</text>
              <rect x="10" y="214" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="236" className="pt" textAnchor="middle">Entrar pelo portal</text>
              <text x="150" y="236" className="en" textAnchor="middle">Sign in via the portal</text>
              <text x="150" y="256" className="pt mut" textAnchor="middle">URL do portal + username (+ MFA)</text>
              <text x="150" y="256" className="en mut" textAnchor="middle">portal URL + username (+ MFA)</text>
              <path d="M290 241L350 241" className="ln" />
              <path d="M342.8 244.5L350 241L342.8 237.5" className="ln" />
              <rect x="350" y="214" width="320" height="54" rx="4" className="ln fillsoft" />
              <text x="510" y="236" className="pt" textAnchor="middle">Identity Center user → role</text>
              <text x="510" y="236" className="en" textAnchor="middle">Identity Center user → role</text>
              <text x="510" y="256" className="pt mut" textAnchor="middle">credenciais temporárias</text>
              <text x="510" y="256" className="en mut" textAnchor="middle">temporary credentials</text>
            </svg>
          </Diagram>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th><T pt="Nome" en="Name" /></th>
                  <th><T pt="O que é" en="What it is" /></th>
                  <th><T pt="Para que serve" en="What it is for" /></th>
                  <th><T pt="Regras (documentação)" en="Rules (documentation)" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><T pt={<><b>E-mail do root</b></>} en={<><b>Root email</b></>} /></td>
                  <td><T pt="Definido ao criar a conta" en="Set when the account is created" /></td>
                  <td><T pt="É o login do root, junto com a senha. Também é por onde a senha do root é recuperada, então precisa ser uma caixa que você controla." en="It is the root’s login, together with the password. It is also how the root password is recovered, so it must be a mailbox you control." /></td>
                  <td><T pt="Único no mundo entre contas (veja o Passo 4 de Organizations)." en="Globally unique across accounts (see Step 4 of Organizations)." /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>Account name</b></>} en={<><b>Account name</b></>} /></td>
                  <td><T pt="Rótulo da conta" en="The account’s label" /></td>
                  <td><T pt="Aparece na fatura e em consoles como o Billing e o Organizations. Nenhuma política nem login depende dele." en="It appears on the invoice and in consoles such as Billing and Organizations. No policy or sign-in depends on it." /></td>
                  <td><T pt={<>Pode ser alterado depois (permissão <code>account:PutAccountName</code>; o root também pode). A documentação sugere um padrão como <code>organização-finalidade-ambiente</code> e evitar dados pessoais.</>} en={<>It can be changed later (<code>account:PutAccountName</code> permission; root can too). The documentation suggests a pattern such as <code>organization-purpose-environment</code> and avoiding personal data.</>} /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>ID da conta</b></>} en={<><b>Account ID</b></>} /></td>
                  <td><T pt="12 dígitos, gerado pela AWS" en="12 digits, generated by AWS" /></td>
                  <td><T pt="É o identificador de verdade: vai nos ARNs, nas trust policies e nos perfis da CLI." en="It is the real identifier: it goes in ARNs, trust policies and CLI profiles." /></td>
                  <td><T pt="Não muda." en="It does not change." /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>Alias da conta</b></>} en={<><b>Account alias</b></>} /></td>
                  <td><T pt="Apelido opcional do ID" en="Optional nickname for the ID" /></td>
                  <td><T pt={<>Deixa o link de login dos usuários IAM legível: <code>https://&lt;alias&gt;.signin.aws.amazon.com/console/</code>.</>} en={<>Makes IAM users’ sign-in link readable: <code>https://&lt;alias&gt;.signin.aws.amazon.com/console/</code>.</>} /></td>
                  <td><T pt="De 3 a 63 caracteres; minúsculas, dígitos e hífens (sem hífen no começo ou no fim, sem dois seguidos, e não pode ser um número de 12 dígitos); único na AWS; só um por conta; não é secreto." en="3 to 63 characters; lowercase, digits and hyphens (no hyphen at the start or end, no two in a row, and it cannot be a 12-digit number); unique across AWS; only one per account; not secret." /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>Username do usuário IAM</b></>} en={<><b>IAM user name</b></>} /></td>
                  <td><T pt="Nome do usuário dentro da conta" en="The user’s name inside the account" /></td>
                  <td><T pt={<>Junto com o ID (ou alias) e a senha, é o login de quem não é root. Também aparece no ARN: <code>arn:aws:iam::&lt;ID&gt;:user/maria</code>.</>} en={<>Together with the ID (or alias) and the password, it is the login of someone who is not root. It also appears in the ARN: <code>arn:aws:iam::&lt;ID&gt;:user/maria</code>.</>} /></td>
                  <td><T pt={<>Até 64 caracteres; letras, números e <code>+ = , . @ _ -</code>; único na conta, sem distinguir maiúsculas (no login e na unicidade). Em políticas e ARNs, distingue.</>} en={<>Up to 64 characters; letters, numbers and <code>+ = , . @ _ -</code>; unique in the account, case-insensitive (at sign-in and for uniqueness). In policies and ARNs, case matters.</>} /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>Username do Identity Center</b></>} en={<><b>Identity Center username</b></>} /></td>
                  <td><T pt="Nome do usuário no portal" en="The user’s name in the portal" /></td>
                  <td><T pt="Login no portal de acesso. Quem usa é a pessoa; as contas aparecem como opções depois." en="Login to the access portal. The person uses it; the accounts show up as options afterwards." /></td>
                  <td><T pt="De 1 a 100 caracteres; definido ao criar o usuário e não pode ser mudado depois (veja o Passo 5 de Organizations)." en="1 to 100 characters; set when the user is created and cannot be changed later (see Step 5 of Organizations)." /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn"><strong><T pt="Resumindo a diferença que você perguntou" en="The difference you asked about" /></strong> <T pt={<>O <b>e-mail do root</b> prova que você é o dono da conta e é único por conta. O <b>account name</b> é só um rótulo, e o <b>username</b> pertence a uma identidade não-root que você cria depois, dentro da conta. Nenhum dos três substitui o <b>ID da conta</b>, que é o que a AWS usa por baixo.</>} en={<>The <b>root email</b> proves you own the account and is unique per account. The <b>account name</b> is only a label, and the <b>username</b> belongs to a non-root identity you create later, inside the account. None of the three replaces the <b>account ID</b>, which is what AWS uses underneath.</>} /></Callout>
          <h3><T pt="ARN: a sigla e como ler" en="ARN: the acronym and how to read it" /></h3>
          <p><T pt={<><b>ARN</b> é <b>Amazon Resource Name</b>. Segundo a documentação, ARNs identificam recursos de forma única em toda a AWS e são exigidos quando você precisa apontar um recurso sem ambiguidade, como em políticas do IAM e em chamadas de API. Um ARN não é considerado segredo, mas deve ser compartilhado com cuidado.</>} en={<><b>ARN</b> stands for <b>Amazon Resource Name</b>. According to the documentation, ARNs uniquely identify resources across all of AWS and are required when you must point to a resource unambiguously, such as in IAM policies and API calls. An ARN is not considered secret, but should be shared with care.</>} /></p>
          <Diagram minWidth={620} caption={<T pt="ARN é a sigla de Amazon Resource Name: o endereço único de qualquer recurso da AWS." en="ARN stands for Amazon Resource Name: the unique address of any AWS resource." />}>
            <svg viewBox="0 0 700 200" role="img" aria-label="Anatomia de um ARN / Anatomy of an ARN">
              <rect x="24" y="30" width="56" height="38" rx="4" className="ln fillsoft" />
              <text x="52.0" y="54" className="mono" textAnchor="middle">arn</text>
              <text x="90" y="54" className="mono" textAnchor="middle">:</text>
              <rect x="100" y="30" width="56" height="38" rx="4" className="ln fillsoft" />
              <text x="128.0" y="54" className="mono" textAnchor="middle">aws</text>
              <text x="166" y="54" className="mono" textAnchor="middle">:</text>
              <rect x="176" y="30" width="56" height="38" rx="4" className="ln fillsoft" />
              <text x="204.0" y="54" className="mono" textAnchor="middle">iam</text>
              <text x="242" y="54" className="mono" textAnchor="middle">:</text>
              <rect x="252" y="30" width="70" height="38" rx="4" className="ln fillsoft" />
              <text x="287.0" y="54" className="mono mut" textAnchor="middle">(vazio)</text>
              <text x="332" y="54" className="mono" textAnchor="middle">:</text>
              <rect x="342" y="30" width="150" height="38" rx="4" className="ln fillsoft" />
              <text x="417.0" y="54" className="mono" textAnchor="middle">111122223333</text>
              <text x="502" y="54" className="mono" textAnchor="middle">:</text>
              <rect x="512" y="30" width="150" height="38" rx="4" className="ln brandfill" />
              <text x="587.0" y="54" className="mono" textAnchor="middle">role/deploy</text>
              <path d="M52.0 68L52.0 86" className="ln dash" />
              <text x="52.0" y="100" className="pt mut" textAnchor="middle">prefixo fixo</text>
              <text x="52.0" y="100" className="en mut" textAnchor="middle">fixed prefix</text>
              <path d="M128.0 68L128.0 126" className="ln dash" />
              <text x="128.0" y="140" className="pt mut" textAnchor="middle">partição</text>
              <text x="128.0" y="140" className="en mut" textAnchor="middle">partition</text>
              <path d="M204.0 68L204.0 86" className="ln dash" />
              <text x="204.0" y="100" className="pt mut" textAnchor="middle">serviço</text>
              <text x="204.0" y="100" className="en mut" textAnchor="middle">service</text>
              <path d="M287.0 68L287.0 126" className="ln dash" />
              <text x="287.0" y="140" className="pt mut" textAnchor="middle">região (vazia no IAM)</text>
              <text x="287.0" y="140" className="en mut" textAnchor="middle">Region (empty in IAM)</text>
              <path d="M417.0 68L417.0 86" className="ln dash" />
              <text x="417.0" y="100" className="pt mut" textAnchor="middle">ID da conta (12 dígitos)</text>
              <text x="417.0" y="100" className="en mut" textAnchor="middle">account ID (12 digits)</text>
              <path d="M587.0 68L587.0 126" className="ln dash" />
              <text x="587.0" y="140" className="pt mut" textAnchor="middle">recurso: tipo/nome</text>
              <text x="587.0" y="140" className="en mut" textAnchor="middle">resource: type/name</text>
              <text x="24" y="186" className="pt mut mono" textAnchor="start">Alguns ARNs omitem região e conta, como o de um bucket S3: arn:aws:s3:::meu-bucket</text>
              <text x="24" y="186" className="en mut mono" textAnchor="start">Some ARNs omit the Region and account, like an S3 bucket’s: arn:aws:s3:::my-bucket</text>
            </svg>
          </Diagram>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th><T pt="Recurso" en="Resource" /></th>
                  <th><T pt="ARN de exemplo" en="Example ARN" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><T pt="Usuário IAM" en="IAM user" /></td>
                  <td><code>arn:aws:iam::111122223333:user/maria</code></td>
                </tr>
                <tr>
                  <td><T pt="Role" en="Role" /></td>
                  <td><code>arn:aws:iam::111122223333:role/PowerUserFromMgmt</code></td>
                </tr>
                <tr>
                  <td><T pt="“Qualquer identidade desta conta” (usado em trust policies)" en="“Any identity in this account” (used in trust policies)" /></td>
                  <td><code>arn:aws:iam::111122223333:root</code></td>
                </tr>
                <tr>
                  <td><T pt="Repositório ECR" en="ECR repository" /></td>
                  <td><code>arn:aws:ecr:sa-east-1:111122223333:repository/meu-app</code></td>
                </tr>
                <tr>
                  <td><T pt="Bucket S3" en="S3 bucket" /></td>
                  <td><code>arn:aws:s3:::meu-bucket</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><T pt={<>A partição é <code>aws</code> nas regiões comuns (<code>aws-cn</code> na China, <code>aws-us-gov</code> no GovCloud). Para achar o formato de qualquer recurso, a documentação indica a <i>Service Authorization Reference</i>. Curingas (<code>*</code>) valem no <code>Resource</code> (por exemplo <code>role/*</code>), mas não no <code>Principal</code>.</>} en={<>The partition is <code>aws</code> in the regular Regions (<code>aws-cn</code> in China, <code>aws-us-gov</code> in GovCloud). To find any resource’s format, the documentation points to the <i>Service Authorization Reference</i>. Wildcards (<code>*</code>) work in <code>Resource</code> (for example <code>role/*</code>), but not in <code>Principal</code>.</>} /></p>
          <h3><T pt="Como uma conta dá acesso à outra" en="How one account grants access to another" /></h3>
          <p><T pt={<>A conta root (management) <b>não</b> empresta o root dela. O acesso entre contas sempre passa por uma <b>role</b>, que entrega credenciais temporárias. Há três caminhos, do mais pronto ao mais controlado:</>} en={<>The root (management) account does <b>not</b> lend its root. Cross-account access always goes through a <b>role</b>, which hands out temporary credentials. There are three paths, from the most ready-made to the most controlled:</>} /></p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th><T pt="Caminho" en="Path" /></th>
                  <th><T pt="Como funciona" en="How it works" /></th>
                  <th><T pt="Quando usar" en="When to use" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><T pt={<><b>1 · Já vem pronta</b></>} en={<><b>1 · Ready-made</b></>} /></td>
                  <td><T pt={<>A AWS cria a role <code>OrganizationAccountAccessRole</code> dentro de toda conta criada pelo Organizations. Ela confia na management e dá administrador.</>} en={<>AWS creates the <code>OrganizationAccountAccessRole</code> role inside every account created through Organizations. It trusts the management account and grants administrator.</>} /></td>
                  <td><T pt="Testes e emergência. É administrador total." en="Tests and emergencies. It is full administrator." /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>2 · Role própria</b></>} en={<><b>2 · Your own role</b></>} /></td>
                  <td><T pt="Você cria uma role na conta destino, com a trust policy apontando para a origem e só as permissões necessárias. É o que o passo a passo abaixo faz." en="You create a role in the destination account, with the trust policy pointing to the source and only the needed permissions. It is what the step by step below does." /></td>
                  <td><T pt="Acesso mínimo e nomeado, por exemplo “só leitura em prod”." en="Minimal, named access, for example “read-only in prod”." /></td>
                </tr>
                <tr>
                  <td><T pt={<><b>3 · Identity Center</b></>} en={<><b>3 · Identity Center</b></>} /></td>
                  <td><T pt="Você atribui um permission set a um grupo em cada conta; o serviço cria e gerencia as roles." en="You assign a permission set to a group in each account; the service creates and manages the roles." /></td>
                  <td><T pt="O dia a dia de pessoas (recomendado pela AWS). Passo 5 de Organizations." en="People’s daily use (recommended by AWS). Step 5 of Organizations." /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><T pt={<>O caminho 2 precisa de <b>duas chaves</b>, uma em cada conta. É o desenho que a documentação chama de conta confiável (<i>trusted</i>, onde ficam os usuários) e conta confiante (<i>trusting</i>, onde está o recurso):</>} en={<>Path 2 needs <b>two keys</b>, one in each account. It is the design the documentation calls the trusted account (where the users are) and the trusting account (where the resource is):</>} /></p>
          <Diagram minWidth={620} caption={<T pt="Duas chaves, uma em cada conta: a trust policy no destino e a permissão sts:AssumeRole na origem. Sem as duas, nada acontece." en="Two keys, one in each account: the trust policy at the destination and the sts:AssumeRole permission at the source. Without both, nothing happens." />}>
            <svg viewBox="0 0 700 356" role="img" aria-label="Acesso entre contas com uma role / Cross-account access with a role">
              <rect x="10" y="14" width="260" height="300" rx="4" className="ln" />
              <text x="22" y="34" className="pt mut mono" textAnchor="start">Conta management · origem</text>
              <text x="22" y="34" className="en mut mono" textAnchor="start">Management · source</text>
              <rect x="430" y="14" width="260" height="300" rx="4" className="ln" />
              <text x="442" y="34" className="pt mut mono" textAnchor="start">Conta dev · destino</text>
              <text x="442" y="34" className="en mut mono" textAnchor="start">Dev · destination</text>
              <rect x="30" y="56" width="220" height="62" rx="4" className="ln fillsoft" />
              <text x="140" y="82" className="pt" textAnchor="middle">Quem entra</text>
              <text x="140" y="82" className="en" textAnchor="middle">Who signs in</text>
              <text x="140" y="102" className="pt mut" textAnchor="middle">usuário IAM ou Identity Center</text>
              <text x="140" y="102" className="en mut" textAnchor="middle">IAM user or Identity Center</text>
              <rect x="30" y="150" width="220" height="110" rx="4" className="ln brandfill" />
              <text x="140" y="174" className="pt" textAnchor="middle">2 · Permissão na origem</text>
              <text x="140" y="174" className="en" textAnchor="middle">2 · Permission at the source</text>
              <text x="140" y="198" className="mono" textAnchor="middle">Action: sts:AssumeRole</text>
              <text x="140" y="218" className="mono" textAnchor="middle">Resource: ARN da role</text>
              <text x="140" y="242" className="pt mut" textAnchor="middle">(política do usuário ou do grupo)</text>
              <text x="140" y="242" className="en mut" textAnchor="middle">(user or group policy)</text>
              <rect x="450" y="56" width="220" height="40" rx="4" className="ln fillsoft" />
              <text x="560" y="81" className="mono" textAnchor="middle">role/PowerUserFromMgmt</text>
              <rect x="450" y="112" width="220" height="70" rx="4" className="ln brandfill" />
              <text x="560" y="136" className="pt" textAnchor="middle">1 · Trust policy</text>
              <text x="560" y="136" className="en" textAnchor="middle">1 · Trust policy</text>
              <text x="560" y="156" className="pt mut" textAnchor="middle">quem pode assumir:</text>
              <text x="560" y="156" className="en mut" textAnchor="middle">who may assume it:</text>
              <text x="560" y="172" className="pt mut" textAnchor="middle">a conta management</text>
              <text x="560" y="172" className="en mut" textAnchor="middle">the management account</text>
              <rect x="450" y="198" width="220" height="62" rx="4" className="ln fillsoft" />
              <text x="560" y="222" className="pt" textAnchor="middle">Permissions policy</text>
              <text x="560" y="222" className="en" textAnchor="middle">Permissions policy</text>
              <text x="560" y="242" className="pt mut" textAnchor="middle">o que a role pode fazer</text>
              <text x="560" y="242" className="en mut" textAnchor="middle">what the role can do</text>
              <rect x="300" y="56" width="100" height="62" rx="4" className="ln fillsoft" />
              <text x="350" y="82" className="pt" textAnchor="middle">AWS STS</text>
              <text x="350" y="82" className="en" textAnchor="middle">AWS STS</text>
              <text x="350" y="102" className="pt mut" textAnchor="middle">3 · assume</text>
              <text x="350" y="102" className="en mut" textAnchor="middle">3 · assume</text>
              <path d="M250 78L300 78" className="ln" />
              <path d="M292.8 81.5L300 78L292.8 74.5" className="ln" />
              <path d="M400 78L450 76" className="ln" />
              <path d="M442.9 79.8L450 76L442.7 72.8" className="ln" />
              <path d="M300 104L250 104" className="ln dash" />
              <path d="M257.2 100.5L250 104L257.2 107.5" className="ln" />
              <text x="350" y="140" className="pt mut" textAnchor="middle">credenciais</text>
              <text x="350" y="140" className="en mut" textAnchor="middle">credentials</text>
              <text x="350" y="156" className="pt mut" textAnchor="middle">temporárias</text>
              <text x="350" y="156" className="en mut" textAnchor="middle">temporary</text>
              <text x="10" y="336" className="pt mut" textAnchor="start">Passos 1 e 2 são configuração (uma vez). O passo 3 acontece a cada sessão e dura, por padrão, 1 hora.</text>
              <text x="10" y="336" className="en mut" textAnchor="start">Steps 1 and 2 are setup (once). Step 3 happens on every session and lasts 1 hour by default.</text>
            </svg>
          </Diagram>
          <Callout tone="warn"><strong><T pt="Pegadinhas que travam o acesso" en="Gotchas that block access" /></strong> <T pt={<>O <b>root não consegue trocar de role</b>: a documentação diz que não dá para trocar de role entrando como root; só como usuário IAM, usuário do IAM Identity Center ou identidade federada. Entre como um admin não-root (veja abaixo). Além disso, a trust policy só <i>permite</i> que a conta confie; <b>cada usuário ou grupo</b> da origem ainda precisa da permissão <code>sts:AssumeRole</code> sobre o ARN da role. Se um ARN de usuário ou role citado no <code>Principal</code> for apagado e recriado, a trust policy precisa ser editada, porque a AWS guarda um ID interno.</>} en={<>The <b>root cannot switch roles</b>: the documentation says you cannot switch roles when signed in as root; only as an IAM user, an IAM Identity Center user or a federated identity. Sign in as a non-root admin (see below). Also, the trust policy only <i>lets</i> the account trust; <b>each user or group</b> at the source still needs the <code>sts:AssumeRole</code> permission on the role’s ARN. If a user or role ARN named in <code>Principal</code> is deleted and recreated, the trust policy must be edited, because AWS stores an internal ID.</>} /></Callout>
          <h3><T pt="Passo a passo" en="Step by step" /></h3>
          <p><T pt={<>Cenário: você tem a conta management (<code>&lt;ID_CONTA_MGMT&gt;</code>, só com o root) e a conta <code>dev</code> (<code>&lt;ID_CONTA_DEV&gt;</code>, criada pelo Organizations). Meta: uma pessoa não-root da management trabalhar na dev com permissão limitada.</>} en={<>Scenario: you have the management account (<code>&lt;ID_CONTA_MGMT&gt;</code>, with only the root) and the <code>dev</code> account (<code>&lt;ID_CONTA_DEV&gt;</code>, created through Organizations). Goal: a non-root person in the management account works in dev with limited permissions.</>} /></p>
          <h4><T pt="Passo A · Criar uma identidade que não é root na management" en="Step A · Create a non-root identity in the management account" /></h4>
          <Callout tone="good"><strong><T pt="O caminho recomendado" en="The recommended path" /></strong> <T pt={<>A AWS recomenda que pessoas usem credenciais temporárias (federação) e reserva usuários IAM para os casos que isso não atende, como um acesso de emergência. Para pessoas, siga o <b>Passo 5 de Organizations</b> (IAM Identity Center). O roteiro abaixo, da documentação “Create an IAM user for emergency access”, cria um <b>usuário IAM</b>: serve para aprender e para ter um administrador não-root. Na nova experiência de console da AWS, usuários IAM com acesso ao console não podem ser criados.</>} en={<>AWS recommends that people use temporary credentials (federation) and reserves IAM users for cases federation does not cover, such as emergency access. For people, follow <b>Step 5 of Organizations</b> (IAM Identity Center). The outline below, from the “Create an IAM user for emergency access” documentation, creates an <b>IAM user</b>: it is useful for learning and for having a non-root administrator. In AWS’s new console experience, IAM users with console access cannot be created.</>} /></Callout>
          <ol>
            <li><T pt={<>Entre na management como root (uma das raras vezes em que ele é necessário aqui) e, em <b>IAM</b>, escolha <b>Users → Create user</b>.</>} en={<>Sign in to the management account as root (one of the rare times it is needed here) and, in <b>IAM</b>, choose <b>Users → Create user</b>.</>} /></li>
            <li><T pt={<>Em <b>Specify user details → User name</b>, escreva o <i>username</i> (por exemplo <code>maria</code>). É o nome de login dela. Marque <b>Provide user access to the AWS Management Console</b> e escolha <b>I want to create an IAM user</b>.</>} en={<>Under <b>Specify user details → User name</b>, type the <i>username</i> (for example <code>maria</code>). It is her sign-in name. Check <b>Provide user access to the AWS Management Console</b> and choose <b>I want to create an IAM user</b>.</>} /></li>
            <li><T pt={<>Em <b>Console password</b>, escolha <b>Autogenerated password</b> (ou uma senha personalizada) e mantenha marcado <b>User must create a new password at next sign-in (recommended)</b>. Clique em <b>Next</b>.</>} en={<>Under <b>Console password</b>, choose <b>Autogenerated password</b> (or a custom one) and keep <b>User must create a new password at next sign-in (recommended)</b> checked. Click <b>Next</b>.</>} /></li>
            <li><T pt={<>Em <b>Set permissions</b>, escolha <b>Add user to group → Create group</b>. Nome do grupo: <code>admins</code>; em <b>Permissions policies</b>, marque <code>AdministratorAccess</code> e clique em <b>Create user group</b>. De volta à lista, marque o grupo novo e clique em <b>Next</b>. Dê permissões ao grupo, não ao usuário.</>} en={<>Under <b>Set permissions</b>, choose <b>Add user to group → Create group</b>. Group name: <code>admins</code>; under <b>Permissions policies</b>, check <code>AdministratorAccess</code> and click <b>Create user group</b>. Back on the list, check the new group and click <b>Next</b>. Give permissions to the group, not the user.</>} /></li>
            <li><T pt={<>Em <b>Review and create</b>, confira e clique em <b>Create user</b>. Na página <b>Retrieve password</b>, use <b>Download .csv file</b>: o arquivo traz a <i>Connection URL</i>, o username e a senha. Entregue por um canal seguro.</>} en={<>On <b>Review and create</b>, check and click <b>Create user</b>. On the <b>Retrieve password</b> page, use <b>Download .csv file</b>: the file has the <i>Connection URL</i>, the username and the password. Hand it over through a secure channel.</>} /></li>
            <li><T pt={<>A pessoa entra em <code>https://&lt;ID_CONTA_MGMT&gt;.signin.aws.amazon.com/console/</code> (ou em <code>console.aws.amazon.com</code>, digitando o ID ou alias) com <b>ID da conta, username e senha</b>. A documentação recomenda digitar essa URL no favorito à mão, porque redirecionamentos podem esconder o endereço real.</>} en={<>The person signs in at <code>https://&lt;ID_CONTA_MGMT&gt;.signin.aws.amazon.com/console/</code> (or at <code>console.aws.amazon.com</code>, typing the ID or alias) with the <b>account ID, username and password</b>. The documentation recommends typing that URL into the bookmark by hand, because redirects can hide the real address.</>} /></li>
            <li><T pt={<>Registre o <b>MFA</b>: <b>IAM → Users → maria → Security credentials → Multi-factor authentication (MFA) → Assign MFA device</b>, informe um nome, escolha <b>Authenticator app</b> e digite dois códigos seguidos. A AWS recomenda, quando possível, passkey ou chave de segurança no lugar do app. Depois disso, o root volta para o cofre.</>} en={<>Register <b>MFA</b>: <b>IAM → Users → maria → Security credentials → Multi-factor authentication (MFA) → Assign MFA device</b>, enter a name, choose <b>Authenticator app</b> and type two consecutive codes. AWS recommends a passkey or security key instead of the app when possible. After that, the root goes back in the vault.</>} /></li>
            <li><T pt={<>(Opcional) Crie um <b>alias</b> para o link ficar legível: <b>IAM → Dashboard → AWS Account → Account Alias → Create</b> (exige <code>iam:CreateAccountAlias</code>). Só existe um alias por conta, e o link com o ID continua funcionando.</>} en={<>(Optional) Create an <b>alias</b> so the link is readable: <b>IAM → Dashboard → AWS Account → Account Alias → Create</b> (requires <code>iam:CreateAccountAlias</code>). There is only one alias per account, and the link with the ID keeps working.</>} /></li>
          </ol>
          <p><T pt="O mesmo pela CLI, no padrão da documentação (a senha vai num arquivo JSON, não na linha de comando):" en="The same from the CLI, following the documentation’s pattern (the password goes in a JSON file, not on the command line):" /></p>
          <CodeBlock code={`aws iam create-user --user-name maria

aws iam create-login-profile --generate-cli-skeleton > create-login-profile.json
# edit the file: {"UserName": "maria", "Password": "<password>", "PasswordResetRequired": true}
aws iam create-login-profile --cli-input-json file://create-login-profile.json

aws iam create-group --group-name admins
aws iam attach-group-policy --group-name admins \\
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws iam add-user-to-group --user-name maria --group-name admins
aws iam get-group --group-name admins

aws iam create-account-alias --account-alias minha-empresa-mgmt   # optional`} />
          <p><T pt={<>A senha precisa respeitar a política de senhas da conta; se não respeitar, o erro é <code>PasswordPolicyViolation</code>.</>} en={<>The password must comply with the account’s password policy; if it does not, the error is <code>PasswordPolicyViolation</code>.</>} /></p>
          <h4><T pt="Passo B · Criar a role na conta dev (as chaves 1 e 2)" en="Step B · Create the role in the dev account (keys 1 and 2)" /></h4>
          <p><T pt={<>Entre na <b>dev</b> como administrador. Como a conta foi criada pelo Organizations, ela tem a <code>OrganizationAccountAccessRole</code> (administrador total, confiando em toda a management) e <b>não tem credenciais de root</b>: contas-membro criadas assim não entram como root nem recuperam a senha, a menos que a recuperação esteja habilitada. Use a role a partir de um usuário não-root da management (ou o permission set de administrador do Identity Center).</>} en={<>Sign in to <b>dev</b> as an administrator. Since the account was created by Organizations, it has the <code>OrganizationAccountAccessRole</code> (full administrator, trusting the whole management account) and <b>no root credentials</b>: member accounts created this way cannot sign in as root or recover the password unless recovery is enabled. Use the role from a non-root user of the management account (or the administrator permission set from Identity Center).</>} /></p>
          <ol>
            <li><T pt={<><b>IAM → Roles → Create role</b>. Em <b>Trusted entity type</b>, escolha <b>AWS account</b> → <b>Another AWS account</b> e informe o ID da management (<code>&lt;ID_CONTA_MGMT&gt;</code>). Isso gera a <b>trust policy</b>: quem pode assumir a role.</>} en={<><b>IAM → Roles → Create role</b>. Under <b>Trusted entity type</b>, choose <b>AWS account</b> → <b>Another AWS account</b> and enter the management account ID (<code>&lt;ID_CONTA_MGMT&gt;</code>). This generates the <b>trust policy</b>: who may assume the role.</>} /></li>
            <li><T pt={<>Marque <b>Require MFA</b>: só entra quem fez login com MFA. (Não marque <i>Require external ID</i>: ela é para contas de terceiros e impede o uso pelo console.)</>} en={<>Check <b>Require MFA</b>: only someone who signed in with MFA gets in. (Do not check <i>Require external ID</i>: it is for third-party accounts and blocks console use.)</>} /></li>
            <li><T pt={<>Em permissões, escolha o <b>mínimo</b> necessário (por exemplo <code>PowerUserAccess</code> ou <code>ReadOnlyAccess</code>). Por padrão, uma role não tem permissão nenhuma.</>} en={<>Under permissions, pick the <b>minimum</b> needed (for example <code>PowerUserAccess</code> or <code>ReadOnlyAccess</code>). By default a role has no permissions at all.</>} /></li>
            <li><T pt={<>Em <b>Role name</b>, use <code>PowerUserFromMgmt</code> (até 64 caracteres; diferencia maiúsculas no ARN; não dá para renomear depois). Crie e copie o <b>ARN da role</b> (na página da role, <b>Summary</b>): <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/PowerUserFromMgmt</code>. A mesma página mostra o link de <i>Switch role</i> já preenchido.</>} en={<>Under <b>Role name</b>, use <code>PowerUserFromMgmt</code> (up to 64 characters; case-sensitive in the ARN; cannot be renamed later). Create it and copy the <b>role ARN</b> (on the role page, <b>Summary</b>): <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/PowerUserFromMgmt</code>. The same page shows the prefilled <i>Switch role</i> link.</>} /></li>
          </ol>
          <p><T pt={<>A trust policy gerada tem esta forma. O <code>:root</code> no <code>Principal</code> significa “esta conta”, e não o usuário root: quem de fato pode assumir é decidido pelas permissões dentro da management (Passo C).</>} en={<>The generated trust policy looks like this. The <code>:root</code> in <code>Principal</code> means “this account”, not the root user: who can actually assume it is decided by the permissions inside the management account (Step C).</>} /></p>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::<ID_CONTA_MGMT>:root" },
      "Action": "sts:AssumeRole",
      "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }
    }
  ]
}`} />
          <CodeBlock code={`# the same from the CLI, with the dev profile (trust.json = the policy above)
aws iam create-role --role-name PowerUserFromMgmt \\
  --assume-role-policy-document file://trust.json --profile dev
aws iam attach-role-policy --role-name PowerUserFromMgmt \\
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess --profile dev`} />
          <h4><T pt="Passo C · Liberar a permissão na management (a chave 2)" en="Step C · Grant the permission in the management account (key 2)" /></h4>
          <ol>
            <li><T pt={<>Na <b>management</b>: <b>IAM → Policies → Create policy → JSON</b>. Cole a política abaixo, com o ARN da role da dev, e salve como <code>assume-dev-poweruser</code>.</>} en={<>In the <b>management</b> account: <b>IAM → Policies → Create policy → JSON</b>. Paste the policy below, with the dev role’s ARN, and save it as <code>assume-dev-poweruser</code>.</>} /></li>
            <li><T pt={<>Anexe a política ao grupo <code>admins</code> (ou a um grupo só para isso). Evite <code>Resource: "*"</code>: ele permitiria assumir qualquer role de qualquer conta que confie na sua. (Pelo editor visual: <b>Create policy → Visual</b>, serviço <b>STS</b>, ação <b>AssumeRole</b>, recurso <b>Specific → Add ARNs → Other account</b>, com o ID da dev e o nome da role.)</>} en={<>Attach the policy to the <code>admins</code> group (or to a group just for this). Avoid <code>Resource: "*"</code>: it would allow assuming any role in any account that trusts yours. (In the visual editor: <b>Create policy → Visual</b>, service <b>STS</b>, action <b>AssumeRole</b>, resource <b>Specific → Add ARNs → Other account</b>, with the dev ID and the role name.)</>} /></li>
          </ol>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::<ID_CONTA_DEV>:role/PowerUserFromMgmt"
  }
}`} />
          <h4><T pt="Passo D · Usar a role (a etapa 3 do diagrama)" en="Step D · Use the role (step 3 of the diagram)" /></h4>
          <ul>
            <li><T pt={<><b>Console.</b> A pessoa entra na management, clica no nome dela na barra superior e escolhe <b>Switch role</b>. Em <b>Account</b>, o ID (ou alias) da dev; em <b>Role</b>, <code>PowerUserFromMgmt</code>; opcionalmente um <b>Display name</b> e uma cor (por exemplo vermelho para prod). <b>Switch Role</b>. Ou usa o link <code>https://signin.aws.amazon.com/switchrole?account=&lt;ID_CONTA_DEV&gt;&amp;roleName=PowerUserFromMgmt</code>. Para voltar: o nome de exibição na barra → <b>Switch back</b>.</>} en={<><b>Console.</b> The person signs in to the management account, clicks their name in the top bar and chooses <b>Switch role</b>. Under <b>Account</b>, the dev ID (or alias); under <b>Role</b>, <code>PowerUserFromMgmt</code>; optionally a <b>Display name</b> and a color (for example red for prod). <b>Switch Role</b>. Or uses the link <code>https://signin.aws.amazon.com/switchrole?account=&lt;ID_CONTA_DEV&gt;&amp;roleName=PowerUserFromMgmt</code>. To go back: the display name in the bar → <b>Switch back</b>.</>} /></li>
            <li><T pt={<><b>CLI.</b> Um perfil que usa as credenciais da management como origem e assume a role. Como a trust policy exige MFA, o perfil precisa do <code>mfa_serial</code> (o ARN do dispositivo de MFA do usuário); a CLI pede o código de 6 dígitos ao usar. Sem <code>mfa_serial</code>, a chamada falha com AccessDenied.</>} en={<><b>CLI.</b> A profile that uses the management credentials as the source and assumes the role. Because the trust policy requires MFA, the profile needs <code>mfa_serial</code> (the ARN of the user’s MFA device); the CLI asks for the 6-digit code on use. Without <code>mfa_serial</code>, the call fails with AccessDenied.</>} /></li>
          </ul>
          <CodeBlock code={`# ~/.aws/config
[profile mgmt-user]
region = sa-east-1                 # the IAM user's access keys (aws configure --profile mgmt-user)

[profile dev-from-mgmt]
role_arn = arn:aws:iam::<ID_CONTA_DEV>:role/PowerUserFromMgmt
source_profile = mgmt-user
mfa_serial = arn:aws:iam::<ID_CONTA_MGMT>:mfa/maria
role_session_name = maria-dev
region = sa-east-1`} />
          <CodeBlock code={`aws sts get-caller-identity --profile dev-from-mgmt
# Enter MFA code for arn:aws:iam::<ID_CONTA_MGMT>:mfa/maria:
# "Account": "<ID_CONTA_DEV>"
# "Arn": "arn:aws:sts::<ID_CONTA_DEV>:assumed-role/PowerUserFromMgmt/maria-dev"

# or by hand, to see the temporary credentials:
aws sts assume-role --role-arn arn:aws:iam::<ID_CONTA_DEV>:role/PowerUserFromMgmt \\
  --role-session-name maria-dev --profile mgmt-user \\
  --serial-number arn:aws:iam::<ID_CONTA_MGMT>:mfa/maria --token-code 123456`} />
          <p><T pt={<>Repare no ARN devolvido: <code>assumed-role</code>, a conta <b>dev</b> e o nome da sessão (<code>role_session_name</code>), que também aparece nos logs do CloudTrail. É a prova de que a pessoa opera <b>na dev</b>. Só um conjunto de permissões vale por vez: ao assumir a role, ela deixa de lado as permissões do usuário e fica com as da role. A sessão da CLI dura 1 hora, salvo se você pedir outra duração (<code>--duration-seconds</code>, até o máximo configurado na role).</>} en={<>Note the returned ARN: <code>assumed-role</code>, the <b>dev</b> account and the session name (<code>role_session_name</code>), which also shows up in CloudTrail logs. It is proof the person operates <b>in dev</b>. Only one set of permissions is in effect at a time: when assuming the role, they set aside the user’s permissions and keep the role’s. The CLI session lasts 1 hour, unless you request another duration (<code>--duration-seconds</code>, up to the role’s configured maximum).</>} /></p>
          <p><T pt="Este perfil usa as chaves de um usuário IAM como origem. Para quem entra pelo Identity Center, não encadeie roles: atribua um permission set na conta dev (caminho 3)." en="This profile uses an IAM user’s keys as the source. For people who sign in through Identity Center, do not chain roles: assign a permission set in the dev account (path 3)." /></p>
          <Callout tone="personal"><strong><T pt="Observação sobre a nota de Organizations" en="A note about the Organizations section" /></strong> <T pt={<>Os passos acima usam o root só para criar o primeiro administrador. Segundo a documentação do Organizations, para usar a <code>OrganizationAccountAccessRole</code> é preciso entrar como um usuário da management com permissão <code>sts:AssumeRole</code> sobre ela. Por isso, no Passo 5b de Organizations, entre como esse usuário não-root.</>} en={<>The steps above use root only to create the first administrator. According to the Organizations documentation, to use <code>OrganizationAccountAccessRole</code> you must sign in as a user of the management account with the <code>sts:AssumeRole</code> permission on it. So, in Step 5b of Organizations, sign in as that non-root user.</>} /></Callout>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O account name serve para entrar na conta?" en="Is the account name used to sign in?" /></summary>
            <div className="ans"><T pt="Não. É só um rótulo. O root entra com o e-mail; o usuário IAM, com o ID (ou alias) da conta, o username e a senha." en="No. It is just a label. Root signs in with the email; an IAM user, with the account ID (or alias), the username and the password." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Por que só criar a role na dev não basta?" en="Why is creating the role in dev not enough?" /></summary>
            <div className="ans"><T pt="Falta a segunda chave: a permissão sts:AssumeRole sobre o ARN da role, dada a um usuário ou grupo na conta de origem." en="The second key is missing: the sts:AssumeRole permission on the role’s ARN, given to a user or group in the source account." /></div>
          </details>
          <details className="fc">
            <summary><T pt="O que significa ARN e onde ele aparece?" en="What does ARN stand for and where does it appear?" /></summary>
            <div className="ans"><T pt="Amazon Resource Name, o endereço único de um recurso. Aparece em Resource e Principal das políticas, em trust policies, em perfis da CLI e nas respostas de get-caller-identity." en="Amazon Resource Name, a resource’s unique address. It appears in the Resource and Principal of policies, in trust policies, in CLI profiles and in get-caller-identity responses." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-24" en="Official sources · verified on 2026-10-24" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html" rel="noopener">IAM: Identify AWS resources with Amazon Resource Names (ARNs)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html" rel="noopener">IAM: Create an IAM user in your AWS account</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html" rel="noopener">IAM: Using an alias for your AWS account ID</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html" rel="noopener">IAM and AWS STS quotas (name requirements)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started-emergency-iam-user.html" rel="noopener">IAM: Create an IAM user for emergency access (console and CLI steps)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_sign-in.html" rel="noopener">IAM: How IAM users sign in to AWS</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/account-alias-create.html" rel="noopener">IAM: Creating an account alias</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html" rel="noopener">IAM: AWS account root user</a></li>
              <li><a href="https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-acct-name.html" rel="noopener">Account Management: Update your AWS account name</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html" rel="noopener">IAM: Assign a virtual MFA device</a></li>
              <li><a href="https://docs.aws.amazon.com/singlesignon/latest/userguide/addusers.html" rel="noopener">IAM Identity Center: Add users to your Identity Center directory</a></li>
              <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html" rel="noopener">Organizations: Accessing member accounts</a> · <a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access-cross-account-role.html" rel="noopener">OrganizationAccountAccessRole</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-console.html" rel="noopener">IAM: Switch from a user to an IAM role (console)</a></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html" rel="noopener">AWS CLI: Using an IAM role in the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html" rel="noopener">IAM: Create a role to give permissions to an IAM user</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_permissions-to-switch.html" rel="noopener">IAM: Grant a user permissions to switch roles</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html" rel="noopener">IAM tutorial: Delegate access across AWS accounts using IAM roles</a></li>
            </ul>
            <p><T pt="Os passos, as opções do console e os comandos seguem a documentação citada; nada foi executado numa conta real." en="The steps, console options and commands follow the cited documentation; nothing was run on a real account." /></p>
          </Sources>
        </section>
        {/* ============ BUDGET ============ */}
        <section className="topic" id="budget">
          <header>
            <span className="tag"><T pt="Contas" en="Accounts" /></span>
            <h2><T pt="Orçamento e cobrança" en="Budget &amp; billing" /></h2>
            <p className="lead"><T pt="Saber quanto você está gastando, ser avisado antes de gastar demais, e entender a fatura — para uma conta só ou para uma organização inteira." en="Knowing how much you are spending, being warned before you overspend, and understanding the bill — for a single account or a whole organization." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="coins" /> <T pt="AWS Billing and Cost Management" en="AWS Billing and Cost Management" /></h4>
              <T pt="O painel central: fatura atual, histórico, métodos de pagamento e créditos." en="The central console: current bill, history, payment methods and credits." />
            </div>
            <div className="card">
              <h4><Icon name="bolt" /> AWS Budgets</h4>
              <T pt="Você define um limite (de custo, de uso ou de cobertura de Savings Plan) e a AWS avisa por e-mail/SNS quando ultrapassar, ou está previsto ultrapassar." en="You set a limit (cost, usage or Savings Plan coverage) and AWS warns you by email/SNS when it is crossed, or forecast to be crossed." />
            </div>
            <div className="card">
              <h4><Icon name="balance" /> Cost Explorer</h4>
              <T pt="Gráficos do gasto ao longo do tempo, filtrados por serviço, conta, tag e muito mais. Até 12 meses de histórico, de graça." en="Charts of spend over time, filtered by service, account, tag and more. Up to 12 months of history, free." />
            </div>
            <div className="card">
              <h4><Icon name="tree" /> <T pt="Fatura consolidada" en="Consolidated billing" /></h4>
              <T pt={<>Numa <a href="#organizations">Organization</a>, a management account recebe UMA fatura com o total de todas as contas-membro.</>} en={<>In an <a href="#organizations">Organization</a>, the management account gets ONE bill totalling every member account.</>} />
            </div>
          </div>
          <h3><T pt="Passo a passo: o primeiro orçamento com alerta" en="Step by step: your first budget with an alert" /></h3>
          <p><T pt={<>A ideia em uma frase: um Budget não impede gasto nenhum sozinho — ele só <b>avisa</b>. Para realmente travar, combine com uma SCP ou automação (veja o aviso mais abaixo).</>} en={<>The idea in one sentence: a Budget does not block any spend by itself — it only <b>warns</b>. To actually enforce a limit, combine it with an SCP or automation (see the warning below).</>} /></p>
          <h4><T pt="Passo 1 · Criar um Budget de custo mensal" en="Step 1 · Create a monthly cost budget" /></h4>
          <ul>
            <li><T pt={<>Abra <b>Billing and Cost Management → Budgets → Create a budget</b> e escolha <b>Cost budget</b>.</>} en={<>Open <b>Billing and Cost Management → Budgets → Create a budget</b> and choose <b>Cost budget</b>.</>} /></li>
            <li><T pt="Defina um valor mensal (por exemplo, US$ 20 enquanto estiver estudando) e o período (recorrente, mês a mês)." en="Set a monthly amount (for example, US$ 20 while you are learning) and the period (recurring, month by month)." /></li>
            <li><T pt={<>Adicione alertas em vários limiares: por exemplo, 50% do real (já gasto) e 100% do <b>previsto</b> (forecast) — o previsto avisa ANTES de você realmente estourar.</>} en={<>Add alerts at several thresholds: for example, 50% of actual (already spent) and 100% of <b>forecasted</b> — the forecast one warns you BEFORE you actually go over.</>} /></li>
            <li><T pt="Informe um e-mail (ou um tópico SNS, se quiser integrar com Slack/chat depois) para receber o alerta." en="Enter an email (or an SNS topic, if you want to integrate with Slack/chat later) to receive the alert." /></li>
          </ul>
          <h4><T pt="Passo 2 · Ativar o alarme clássico de cobrança (opcional, mas simples)" en="Step 2 · Enable the classic billing alarm (optional, but simple)" /></h4>
          <ul>
            <li><T pt={<>Em <b>Billing and Cost Management → Billing preferences</b>, marque <b>Receive Billing Alerts</b>.</>} en={<>Under <b>Billing and Cost Management → Billing preferences</b>, check <b>Receive Billing Alerts</b>.</>} /></li>
            <li><T pt={<>No CloudWatch, <b>sempre na região <code>us-east-1</code></b> (é onde a métrica de cobrança vive, mesmo que seus recursos estejam em outra região), crie um alarme sobre a métrica <code>EstimatedCharges</code>.</>} en={<>In CloudWatch, <b>always in the <code>us-east-1</code> region</b> (that is where the billing metric lives, even if your resources are elsewhere), create an alarm on the <code>EstimatedCharges</code> metric.</>} /></li>
          </ul>
          <h4><T pt="O mesmo pelo terminal" en="The same from the terminal" /></h4>
          <CodeBlock code={`# cria um budget de custo mensal de US$ 20, com alerta em 80% do real
aws budgets create-budget --account-id 111111111111 --budget '{
  "BudgetName": "orcamento-mensal",
  "BudgetLimit": {"Amount": "20", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}' --notifications-with-subscribers '[{
  "Notification": {"NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 80},
  "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "voce@exemplo.com"}]
}]'

# alarme clássico de cobrança (rode em us-east-1)
aws cloudwatch put-metric-alarm --alarm-name cobranca-acima-de-20usd \\
  --metric-name EstimatedCharges --namespace AWS/Billing --statistic Maximum \\
  --period 21600 --threshold 20 --comparison-operator GreaterThanThreshold \\
  --dimensions Name=Currency,Value=USD --evaluation-periods 1 \\
  --alarm-actions arn:aws:sns:us-east-1:111111111111:alerta-de-custo --region us-east-1`} />
          <h3><T pt="Cost allocation tags: o custo, explicado por etiqueta" en="Cost allocation tags: cost, explained by tag" /></h3>
          <p><T pt={<>Tags como <code>Project=loja</code> ou <code>Environment=dev</code> nos seus recursos viram colunas no Cost Explorer depois de ativadas em <b>Billing → Cost allocation tags</b>. É a forma de responder “quanto cada projeto/time/ambiente está custando?” sem precisar de uma conta separada para cada um.</>} en={<>Tags like <code>Project=store</code> or <code>Environment=dev</code> on your resources become columns in Cost Explorer once activated under <b>Billing → Cost allocation tags</b>. This is how you answer “how much does each project/team/environment cost?” without needing a separate account for each.</>} /></p>
          <Callout tone="good">
            <strong><T pt="Numa Organization: a fatura consolidada" en="In an Organization: consolidated billing" /></strong>
            <p><T pt={<>A management account vê e paga o total; cada conta-membro vê <b>só o próprio gasto</b> em <b>Billing → Bills</b>, a não ser que a management libere mais acesso. Budgets podem ser criados tanto na management (cobrindo tudo ou uma conta específica via filtro de <code>LINKED_ACCOUNT</code>) quanto dentro de cada conta-membro, para o próprio gasto.</>} en={<>The management account sees and pays the total; each member account sees <b>only its own spend</b> under <b>Billing → Bills</b>, unless the management account grants more access. Budgets can be created either in the management account (covering everything, or one account via a <code>LINKED_ACCOUNT</code> filter) or inside each member account, for its own spend.</>} /></p>
          </Callout>
          <Callout tone="warn">
            <strong><T pt="Um Budget não desliga nada sozinho" en="A Budget does not turn anything off by itself" /></strong>
            <ul>
              <li><T pt="Por padrão, estourar um Budget só manda um e-mail — os recursos continuam rodando e cobrando." en="By default, going over a Budget only sends an email — resources keep running and billing." /></li>
              <li><T pt={<>Para um limite que realmente BLOQUEIA, combine com uma <a href="#organizations">SCP</a> que nega ações caras numa conta de estudo, ou uma automação (ex.: uma função Lambda disparada pelo alerta do Budget, que para instâncias).</>} en={<>For a limit that actually BLOCKS, combine it with an <a href="#organizations">SCP</a> that denies expensive actions on a study account, or automation (e.g. a Lambda function triggered by the Budget alert, which stops instances).</>} /></li>
              <li><T pt={<>Por padrão, só o <b>root user</b> (ou um usuário/role com a permissão explícita) vê a página de Billing. Ative <b>IAM user and role access to Billing</b> em Account settings se quiser dar acesso de leitura a outros usuários IAM.</>} en={<>By default, only the <b>root user</b> (or a user/role with explicit permission) sees the Billing page. Enable <b>IAM user and role access to Billing</b> in Account settings if you want to give other IAM users read access.</>} /></li>
            </ul>
          </Callout>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Um alerta de Budget em 100% impede que você continue gastando?" en="Does a 100% Budget alert stop you from spending further?" /></summary>
            <div className="ans"><T pt="Não sozinho. Ele só notifica; bloquear de verdade exige uma SCP ou automação adicional." en="Not by itself. It only notifies; actually blocking requires an SCP or extra automation." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Por que o alarme clássico de cobrança precisa ser criado em us-east-1?" en="Why must the classic billing alarm be created in us-east-1?" /></summary>
            <div className="ans"><T pt={<>Porque a métrica <code>EstimatedCharges</code> do CloudWatch só existe nessa região, independentemente de onde seus recursos rodam.</>} en={<>Because CloudWatch’s <code>EstimatedCharges</code> metric only exists in that region, regardless of where your resources run.</>} /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-18" en="Official sources · verified on 2026-10-18" />}
            links={[
              { label: "Managing your costs with AWS Budgets", href: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html" },
              { label: "What is Cost Explorer?", href: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html" },
              { label: "Creating a billing alarm to monitor your estimated AWS charges", href: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/monitor-estimated-charges-alarm.html" },
              { label: "Using cost allocation tags", href: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html" },
              { label: "Consolidated billing for AWS Organizations", href: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html" },
              { label: "Giving IAM users and roles access to billing information", href: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/grantaccess.html" },
            ]}
          />
        </section>
        {/* ============ MAPA ============ */}
        <section className="topic" id="mapa">
          <header>
            <span className="tag"><T pt="Visão geral" en="Overview" /></span>
            <h2><T pt="Mapa da arquitetura" en="Architecture map" /></h2>
            <p className="lead"><T pt="Um caminho típico de uma requisição. Clique em cada peça para entender o papel dela. Cada seção abaixo traz os links da documentação oficial." en="A typical request path. Click each piece to understand its role. Each section below lists its official documentation links." /></p>
          </header>
          <div className="widget" data-explorer="">
            <div className="wtitle"><T pt="Explorador" en="Explorer" /></div>
            <div className="flow"> <button className="node" data-t="x-dns"><Icon name="globe" /> DNS</button><span className="arrow">→</span> <button className="node" data-t="x-elb"><Icon name="balance" /> ELB</button><span className="arrow">→</span> <button className="node" data-t="x-ec2"><Icon name="server" /> EC2</button><span className="arrow">→</span> <button className="node" data-t="x-rds"><Icon name="database" /> RDS</button> </div>
            <div className="flow"> <button className="node" data-t="x-iam"><Icon name="lock" /> IAM</button> <button className="node" data-t="x-vpc"><Icon name="network" /> VPC</button> <button className="node" data-t="x-s3"><Icon name="bucket" /> S3</button> <button className="node" data-t="x-ecr"><Icon name="box" /> ECR</button> <button className="node" data-t="x-ecs"><Icon name="grid" /> ECS</button> </div>
            <div className="panel">
              <div id="x-dns"><T pt={<><b>Route 53</b> traduz <code>meusite.com.br</code> no endereço do load balancer.</>} en={<><b>Route 53</b> translates <code>mysite.com</code> into the load balancer's address.</>} /></div>
              <div id="x-elb" hidden><T pt={<><b>ELB</b> é o ponto único de entrada: recebe o tráfego, termina o HTTPS com o certificado (ACM) e distribui entre os destinos saudáveis.</>} en={<><b>ELB</b> is the single entry point: it receives traffic, terminates HTTPS with the certificate (ACM) and spreads traffic across healthy targets.</>} /></div>
              <div id="x-ec2" hidden><T pt={<><b>EC2</b> são os servidores onde seu código roda, em subnets públicas ou privadas, protegidos por Security Groups.</>} en={<><b>EC2</b> are the servers running your code, in public or private subnets, protected by Security Groups.</>} /></div>
              <div id="x-rds" hidden><T pt={<><b>RDS</b> é o banco de dados gerenciado. Fica numa subnet privada, sem acesso direto da internet.</>} en={<><b>RDS</b> is the managed database. It lives in a private subnet, with no direct internet access.</>} /></div>
              <div id="x-iam" hidden><T pt={<><b>IAM</b> define quem pode fazer o quê em toda a conta.</>} en={<><b>IAM</b> defines who can do what across the whole account.</>} /></div>
              <div id="x-vpc" hidden><T pt={<><b>VPC</b> é a rede privada que contém tudo isso: subnets, rotas e gateways.</>} en={<><b>VPC</b> is the private network that contains all of this: subnets, routes and gateways.</>} /></div>
              <div id="x-s3" hidden><T pt={<><b>S3</b> guarda arquivos (imagens, backups, sites estáticos) com alta durabilidade.</>} en={<><b>S3</b> stores files (images, backups, static sites) with high durability.</>} /></div>
              <div id="x-ecs" hidden><T pt={<><b>ECS</b> roda os containers das imagens do ECR como tasks de um service, atrás do load balancer, e faz os deploys (rolling update).</>} en={<><b>ECS</b> runs the containers from ECR images as tasks of a service, behind the load balancer, and performs deployments (rolling update).</>} /></div>
              <div id="x-ecr" hidden><T pt={<><b>ECR</b> guarda as imagens Docker que EC2, ECS e EKS baixam para executar.</>} en={<><b>ECR</b> stores the Docker images that EC2, ECS and EKS pull to run.</>} /></div>
            </div>
          </div>
        </section>
        {/* ============ IAM ============ */}
        <section className="topic" id="iam">
          <header>
            <span className="tag"><T pt="Fundamentos · 01" en="Foundations · 01" /></span>
            <h2>IAM</h2>
            <p className="lead"><T pt="Identity and Access Management: o serviço que controla quem se autentica (login) e quem está autorizado (permissões) a usar os recursos da AWS." en="Identity and Access Management: the service that controls who is authenticated (signed in) and who is authorized (has permissions) to use AWS resources." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="crown" /> Root user</h4>
              <T pt={<>Identidade criada junto com a conta, com acesso total. A AWS recomenda <b>não</b> usá-la no dia a dia. Algumas tarefas exigem o root, e a documentação lista quais.</>} en={<>The identity created with the account, with complete access. AWS recommends <b>not</b> using it for everyday tasks. A few tasks do require root, and the docs list them.</>} />
            </div>
            <div className="card">
              <h4><Icon name="user" /> User</h4>
              <T pt="Identidade com credenciais de longo prazo (senha, access keys). A AWS recomenda usá-lo só quando federação e roles não servem, por exemplo em ferramentas de terceiros que não suportam o IAM Identity Center." en="An identity with long-term credentials (password, access keys). AWS recommends it only when federation and roles do not fit, for example third-party tools that do not support IAM Identity Center." />
            </div>
            <div className="card">
              <h4><Icon name="users" /> User Group</h4>
              <T pt={<>Coleção de usuários IAM: anexe a política ao grupo e todos herdam. Um usuário pode estar em vários grupos. Grupos <b>não</b> podem ser aninhados e não podem ser <code>Principal</code> em uma política.</>} en={<>A collection of IAM users: attach the policy to the group and everyone inherits it. A user can be in many groups. Groups <b>cannot</b> be nested and cannot be a <code>Principal</code> in a policy.</>} />
            </div>
            <div className="card">
              <h4><Icon name="badge" /> Role</h4>
              <T pt={<>Identidade sem credenciais próprias de longo prazo, feita para ser <b>assumida</b> por quem precisar (pessoas, outras contas, serviços AWS ou IdPs externos). Ao assumir, você recebe credenciais temporárias da sessão.</>} en={<>An identity with no long-term credentials of its own, meant to be <b>assumed</b> by whoever needs it (people, other accounts, AWS services or external IdPs). On assuming it, you get temporary session credentials.</>} />
            </div>
          </div>
          <Callout><strong><T pt="Role = permissões + confiança" en="Role = permissions + trust" /></strong> <T pt={<>Uma role tem dois tipos de política: a <b>política de permissões</b> (o que a role pode fazer) e a <b>trust policy</b> (quem pode assumi-la). A trust policy é uma política baseada em recurso, obrigatória em toda role.</>} en={<>A role has two kinds of policy: the <b>permissions policy</b> (what the role can do) and the <b>trust policy</b> (who can assume it). The trust policy is a resource-based policy, required on every role.</>} /></Callout>
          <h3><T pt="Fluxo comum com grupos" en="Common flow with groups" /></h3>
          <div className="flow"> <span className="node"><Icon name="doc" /> Policy</span><span className="arrow">→</span> <span className="node"><Icon name="users" /> User Group (Devs)</span><span className="arrow">→</span> <span className="node"><Icon name="user" /> Users</span> </div>
          <h3><T pt="Anatomia de uma política" en="Anatomy of a policy" /></h3>
          <p><T pt="Uma política é um documento JSON. Exemplo de permissão para enviar (push) imagens a um repositório do ECR, com placeholders no lugar de IDs reais:" en="A policy is a JSON document. Example permission to push images to an ECR repository, with placeholders instead of real IDs:" /></p>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "arn:aws:ecr:us-east-1:111122223333:repository/meu-repositorio"
    }
  ]
}`} />
          <table>
            <tbody>
              <tr>
                <th>Campo / Field</th>
                <th><T pt="Significado" en="Meaning" /></th>
              </tr>
              <tr>
                <td><code>Version</code></td>
                <td><T pt={<>Versão da linguagem de política. Os exemplos da AWS usam <code>2012-10-17</code>.</>} en={<>Policy language version. AWS examples use <code>2012-10-17</code>.</>} /></td>
              </tr>
              <tr>
                <td><code>Effect</code></td>
                <td><T pt={<><code>Allow</code> ou <code>Deny</code>.</>} en={<><code>Allow</code> or <code>Deny</code>.</>} /></td>
              </tr>
              <tr>
                <td><code>Action</code></td>
                <td><T pt="As operações da API do serviço. Normalmente é preciso listar várias ações." en="The service API operations. You usually need to list several actions." /></td>
              </tr>
              <tr>
                <td><code>Resource</code></td>
                <td><T pt="Sobre quais recursos vale, identificados pelo ARN (Amazon Resource Name)." en="Which resources it covers, identified by ARN (Amazon Resource Name)." /></td>
              </tr>
              <tr>
                <td><code>Condition</code></td>
                <td><T pt="Opcional. Restringe quando a permissão vale (ex.: exigir TLS, limitar a um IP)." en="Optional. Restricts when the permission applies (e.g. require TLS, limit to an IP)." /></td>
              </tr>
            </tbody>
          </table>
          <Callout tone="warn"><strong><T pt="Pegadinha: negar vence" en="Gotcha: deny wins" /></strong> <T pt={<>Um <code>Deny</code> explícito (em política de identidade, SCP ou RCP) sobrepõe qualquer <code>Allow</code>. Em contas de uma organização, a permissão efetiva é a interseção entre as políticas IAM e as SCPs.</>} en={<>An explicit <code>Deny</code> (in an identity policy, SCP or RCP) overrides any <code>Allow</code>. In accounts of an organization, effective permission is the intersection of IAM policies and SCPs.</>} /></Callout>
          <Callout tone="good"><strong><T pt="Boas práticas oficiais (resumo)" en="Official best practices (summary)" /></strong> <T pt={<>Pessoas acessam por federação com credenciais temporárias (a AWS recomenda o IAM Identity Center); cargas de trabalho usam roles; exija MFA onde houver usuário IAM ou root; aplique privilégio mínimo; revise e remova credenciais não usadas; use várias contas com Organizations e SCPs como guardrails. Veja as seções <a href="#organizations">Organizations</a> e <a href="#identity-center">IAM Identity Center</a>.</>} en={<>People access through federation with temporary credentials (AWS recommends IAM Identity Center); workloads use roles; require MFA wherever an IAM user or root exists; apply least privilege; review and remove unused credentials; use multiple accounts with Organizations and SCPs as guardrails. See <a href="#organizations">Organizations</a> and <a href="#identity-center">IAM Identity Center</a>.</>} /></Callout>
          <Callout tone="personal"><strong><T pt="Mudança em relação às anotações antigas" en="Change from the old notes" /></strong> <T pt={<>As anotações sugeriam criar usuários, grupos e roles separados por ambiente (dev, staging, prod) dentro da mesma conta. A documentação recomenda separar as cargas de trabalho em <b>contas diferentes</b>, gerenciadas com Organizations.</>} en={<>The old notes suggested separate users, groups and roles per environment (dev, staging, prod) inside one account. The docs recommend separating workloads into <b>different accounts</b> managed with Organizations.</>} /></Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Roles para serviços e CI/CD; grupos + políticas quando houver usuários IAM; Access Analyzer para revisar permissões." en="Roles for services and CI/CD; groups + policies when IAM users exist; Access Analyzer to review permissions." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Usuário IAM com access key de longo prazo para pessoas ou para workloads que poderiam usar role; uso do root no dia a dia." en="IAM users with long-term access keys for people, or for workloads that could use a role; everyday use of root." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Por que usar grupos em vez de políticas direto no usuário?" en="Why use groups instead of attaching policies directly to users?" /></summary>
            <div className="ans"><T pt="Muda uma vez e vale para todos do grupo. Quem troca de função só muda de grupo." en="You change it once and it applies to everyone in the group. Someone changing jobs just changes group." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Qual a diferença entre User e Role?" en="What is the difference between a User and a Role?" /></summary>
            <div className="ans"><T pt="User tem credenciais de longo prazo e dono fixo. Role é assumida por quem precisar e entrega credenciais temporárias." en="A User has long-term credentials and a fixed owner. A Role is assumed by whoever needs it and issues temporary credentials." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "What is IAM?", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
              { label: "Security best practices in IAM", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
              { label: "IAM roles", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html" },
              { label: "IAM user groups", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html" },
              { label: "IAM JSON policy element reference", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html" },
              { label: "Policy evaluation logic", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html" },
              { label: "ECR: repository policy examples (ações de push)", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html" },
            ]}
          />
        </section>
        {/* ============ IDENTITY CENTER ============ */}
        <section className="topic" id="identity-center">
          <header>
            <span className="tag"><T pt="Fundamentos · 02" en="Foundations · 02" /></span>
            <h2>IAM Identity Center</h2>
            <p className="lead"><T pt="Login único (SSO) para a força de trabalho: pessoas entram uma vez e acessam várias contas AWS e aplicações, com credenciais temporárias." en="Single sign-on (SSO) for your workforce: people sign in once and reach many AWS accounts and applications, using temporary credentials." /></p>
          </header>
          <p><T pt="O IAM Identity Center (antigo AWS Single Sign-On) conecta o seu provedor de identidade existente, sincronizando usuários e grupos, ou permite criar e gerenciar usuários direto nele. Para acesso a contas, a AWS o recomenda como forma de dar acesso a pessoas. Não há cobrança adicional pelo IAM Identity Center; você paga pelos recursos que usa." en="IAM Identity Center (formerly AWS Single Sign-On) connects your existing identity provider, syncing users and groups, or lets you create and manage users directly in it. For account access, AWS recommends it as the way to give access to people. There is no additional charge for IAM Identity Center; you pay for the resources you use." /></p>
          <div className="flow"> <span className="node"><Icon name="user" /> <T pt="Pessoa" en="Person" /></span><span className="arrow">→</span> <span className="node"><Icon name="gateway" /> AWS access portal</span><span className="arrow">→</span> <span className="node"><Icon name="ticket" /> Permission set</span><span className="arrow">→</span> <span className="node"><Icon name="building" /> <T pt="Contas staging / prod" en="staging / prod accounts" /></span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="institution" /> <T pt="Instância da organização" en="Organization instance" /></h4>
              <T pt="É a melhor prática e a única que permite gerenciar acesso a contas AWS. Fica na management account do Organizations." en="It is the best practice and the only one that lets you manage access to AWS accounts. It lives in the Organizations management account." />
            </div>
            <div className="card">
              <h4><Icon name="ticket" /> Permission set</h4>
              <T pt="Modelo que reúne uma ou mais políticas IAM. Ao atribuí-lo a um usuário ou grupo em uma conta, o Identity Center cria e mantém uma role IAM nela e anexa as políticas." en="A template grouping one or more IAM policies. When you assign it to a user or group in an account, Identity Center creates and maintains an IAM role there and attaches the policies." />
            </div>
            <div className="card">
              <h4><Icon name="key" /> <T pt="Credenciais temporárias" en="Temporary credentials" /></h4>
              <T pt="A duração da sessão da conta vem do permission set (padrão de 1 hora, máximo de 12 horas). A sessão no portal tem outro limite (padrão de 8 horas, máximo de 90 dias)." en="Account session length comes from the permission set (default 1 hour, maximum 12 hours). The portal session has its own limit (default 8 hours, maximum 90 days)." />
            </div>
          </div>
          <h3><T pt="Permission sets na prática" en="Permission sets in practice" /></h3>
          <ul>
            <li><T pt={<>Permission sets exigem a instância da organização com <i>multi-account permissions</i> habilitado (padrão ao criar a instância).</>} en={<>Permission sets require the organization instance with <i>multi-account permissions</i> enabled (default when the instance is created).</>} /></li>
            <li><T pt="Aceitam políticas gerenciadas pela AWS, gerenciadas pelo cliente, inline e de função de trabalho, além de uma permissions boundary." en="They accept AWS managed, customer managed, inline and job-function policies, plus a permissions boundary." /></li>
            <li><T pt="Você pode atribuir mais de um permission set à mesma pessoa. A documentação recomenda escolher, no portal, o mais restritivo que resolve a tarefa, em vez de sempre usar administrador." en="You can assign more than one permission set to the same person. The docs recommend choosing, in the portal, the most restrictive one that does the job rather than always using admin." /></li>
            <li><T pt={<>Exemplo da documentação: <code>PowerUserAccess</code> não permite gerenciar usuários e grupos IAM, ao contrário de <code>AdministratorAccess</code>.</>} en={<>Docs example: <code>PowerUserAccess</code> does not allow managing IAM users and groups, unlike <code>AdministratorAccess</code>.</>} /></li>
            <li><T pt={<>Precisa de recursos além do que permission sets oferecem (trust policy customizada, tags de role)? Veja o <i>account access manager</i> do IAM.</>} en={<>Need more than permission sets offer (custom trust policy, role tags)? See IAM's <i>account access manager</i>.</>} /></li>
          </ul>
          <h3><T pt="Uso no terminal" en="Using it in the terminal" /></h3>
          <CodeBlock code={`aws configure sso          # cria o perfil (sso-session, conta e permission set)
aws sso login --profile meu-perfil
aws sts get-caller-identity --profile meu-perfil
aws sso logout`} />
          <p className="muted"><T pt={<>Quando as credenciais do SSO expiram, é preciso fazer login de novo. Veja também a seção <a href="#cli">AWS CLI</a>.</>} en={<>When SSO credentials expire you must sign in again. See also the <a href="#cli">AWS CLI</a> section.</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Pessoas que acessam várias contas (staging, prod, tooling); quando se quer um único ponto de login e permissões centralizadas por perfil de trabalho." en="People who access several accounts (staging, prod, tooling); when you want a single sign-in point and permissions centralized per job role." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Para pipelines de CI/CD e workloads (use roles com <a href="#oidc">OIDC</a>); instâncias de conta para gerenciar acesso a várias contas (só a instância da organização faz isso).</>} en={<>For CI/CD pipelines and workloads (use roles with <a href="#oidc">OIDC</a>); account instances to manage access across accounts (only the organization instance does that).</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O que o Identity Center cria na conta quando você atribui um permission set?" en="What does Identity Center create in the account when you assign a permission set?" /></summary>
            <div className="ans"><T pt="Uma role IAM gerenciada por ele, com as políticas do permission set anexadas." en="An IAM role managed by it, with the permission set's policies attached." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "What is IAM Identity Center?", href: "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html" },
              { label: "Manage AWS accounts with permission sets", href: "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html" },
              { label: "Configuring IAM Identity Center authentication with the AWS CLI", href: "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" },
              { label: "IAM: Security best practices", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
            ]}
          />
        </section>
        {/* ============ OIDC ============ */}
        <section className="topic" id="oidc">
          <header>
            <span className="tag"><T pt="Fundamentos · 03" en="Foundations · 03" /></span>
            <h2>OIDC &amp; GitHub Actions</h2>
            <p className="lead"><T pt="Federação OIDC: um serviço externo (como o GitHub Actions) prova quem é com um token e troca por credenciais temporárias da AWS, sem guardar access keys." en="OIDC federation: an external service (such as GitHub Actions) proves who it is with a token and exchanges it for temporary AWS credentials, with no stored access keys." /></p>
          </header>
          <p><T pt={<>A AWS recomenda <b>não</b> guardar credenciais de longo prazo em aplicações fora da AWS. Com OIDC, o provedor emite um JSON Web Token (JWT); a AWS valida o token e devolve credenciais temporárias de uma role IAM. A operação da API é <code>AssumeRoleWithWebIdentity</code> (AWS STS).</>} en={<>AWS recommends <b>not</b> storing long-term credentials in applications outside AWS. With OIDC, the provider issues a JSON Web Token (JWT); AWS validates it and returns temporary credentials for an IAM role. The API operation is <code>AssumeRoleWithWebIdentity</code> (AWS STS).</>} /></p>
          <div className="flow"> <span className="node"><Icon name="gear" /> GitHub Actions</span><span className="arrow">① JWT →</span> <span className="node"><Icon name="badge" /> <T pt="Provedor OIDC no IAM" en="OIDC provider in IAM" /></span><span className="arrow">② AssumeRoleWithWebIdentity →</span> <span className="node"><Icon name="badge" /> Role + trust policy</span><span className="arrow">③ <T pt="credenciais temporárias" en="temporary credentials" /> →</span> <span className="node"><Icon name="cloud" /> <T pt="Recursos AWS" en="AWS resources" /></span> </div>
          <h3><T pt="1 · Criar o provedor OIDC no IAM" en="1 · Create the OIDC provider in IAM" /></h3>
          <ul>
            <li><T pt={<>A URL do provedor começa com <code>https://</code>, não tem porta e não tem query string. É sensível a maiúsculas e deve ser única na conta. Para o GitHub Actions: <code>https://token.actions.githubusercontent.com</code>.</>} en={<>The provider URL starts with <code>https://</code>, has no port and no query string. It is case-sensitive and must be unique in the account. For GitHub Actions: <code>https://token.actions.githubusercontent.com</code>.</>} /></li>
            <li><T pt={<>O campo <b>Audience</b> (<code>aud</code>) deve bater com o valor que o provedor coloca no token. Para o GitHub Actions no console, é <code>sts.amazonaws.com</code>.</>} en={<>The <b>Audience</b> (<code>aud</code>) must match the value the provider puts in the token. For GitHub Actions in the console, it is <code>sts.amazonaws.com</code>.</>} /></li>
            <li><T pt="A AWS verifica o certificado do endpoint JWKS com sua biblioteca de CAs confiáveis; thumbprints só entram como alternativa quando o certificado não é de uma CA conhecida." en="AWS verifies the JWKS endpoint certificate against its library of trusted CAs; thumbprints are only a fallback when the certificate is not from a known CA." /></li>
            <li><T pt={<>O provedor OIDC usado na trust policy precisa estar na <b>mesma conta</b> da role.</>} en={<>The OIDC provider used in a trust policy must be in the <b>same account</b> as the role.</>} /></li>
          </ul>
          <h3><T pt="2 · Trust policy da role" en="2 · The role's trust policy" /></h3>
          <p><T pt={<>O GitHub é um provedor OIDC <b>compartilhado</b> entre muitos clientes. Por isso o IAM exige que a trust policy avalie a condição <code>token.actions.githubusercontent.com:sub</code>, e o valor não pode ser só um curinga. Sem essa restrição, workflows de repositórios fora do seu controle poderiam assumir a role. Exemplo restrito a um repositório e uma branch:</>} en={<>GitHub is an OIDC provider <b>shared</b> across many customers. So IAM requires the trust policy to evaluate the condition <code>token.actions.githubusercontent.com:sub</code>, and the value cannot be only a wildcard. Without that restriction, workflows from repositories outside your control could assume the role. Example limited to one repository and one branch:</>} /></p>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::111122223333:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:MINHA_ORG/MEU_REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}`} />
          <h3><T pt={<>O claim <code>sub</code> do GitHub</>} en={<>The GitHub <code>sub</code> claim</>} /></h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Contexto do job" en="Job context" /></th>
                  <th>sub</th>
                </tr>
                <tr>
                  <td><T pt="Branch" en="Branch" /></td>
                  <td><code>repo:ORG/REPO:ref:refs/heads/BRANCH</code></td>
                </tr>
                <tr>
                  <td>Tag</td>
                  <td><code>repo:ORG/REPO:ref:refs/tags/TAG</code></td>
                </tr>
                <tr>
                  <td>Environment</td>
                  <td><code>repo:ORG/REPO:environment:NOME</code></td>
                </tr>
                <tr>
                  <td>Pull request</td>
                  <td><code>repo:ORG/REPO:pull_request</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li><T pt={<>Se o job referencia um <b>environment</b>, o <code>sub</code> usa o formato de environment (ele tem prioridade). Pull request só aparece quando não há environment. Branch e tag valem quando não há environment nem pull request.</>} en={<>If the job references an <b>environment</b>, the <code>sub</code> uses the environment format (it takes priority). Pull request only appears when there is no environment. Branch and tag apply when there is neither environment nor pull request.</>} /></li>
            <li><T pt={<>Para restringir <b>repositório</b>, use <code>StringLike</code> com <code>repo:ORG/REPO:*</code>. Para <b>branch</b>, use o valor exato da branch. Para <b>environment</b>, use <code>repo:ORG/REPO:environment:producao</code> e proteja o environment com regras de deploy (quais branches e tags podem fazer deploy nele), como a AWS e o GitHub recomendam.</>} en={<>To restrict the <b>repository</b>, use <code>StringLike</code> with <code>repo:ORG/REPO:*</code>. For a <b>branch</b>, use the exact branch value. For an <b>environment</b>, use <code>repo:ORG/REPO:environment:production</code> and protect the environment with deployment rules (which branches and tags may deploy to it), as AWS and GitHub recommend.</>} /></li>
            <li><T pt={<>Repositórios novos podem emitir o formato <i>imutável</i>, que inclui IDs: <code>repo:ORG@ORG_ID/REPO@REPO_ID:...</code>. A documentação da action avisa que, se a trust policy usa o formato antigo e o repositório emite o novo, o assume-role falha com "Not authorized". Confira o formato que o seu repositório emite.</>} en={<>New repositories may issue the <i>immutable</i> format, which includes IDs: <code>repo:ORG@ORG_ID/REPO@REPO_ID:...</code>. The action's docs warn that if the trust policy uses the old format and the repository issues the new one, assume-role fails with "Not authorized". Check which format your repository issues.</>} /></li>
            <li><T pt={<>Dois-pontos dentro de valores aparecem como <code>%3A</code> no <code>sub</code>.</>} en={<>Colons inside values appear as <code>%3A</code> in the <code>sub</code>.</>} /></li>
          </ul>
          <p><T pt={<><b>E o workflow?</b> O arquivo completo (um para <code>develop</code> e <code>main</code>), os environments do GitHub, o build da imagem, o ECR e a troca no ECS estão na nota <a href="/notas/github-aws-oidc/">GitHub para AWS: OIDC, Docker, ECR e ECS</a>. Aqui ficam só os conceitos da AWS. A action usada é a <code>aws-actions/configure-aws-credentials</code> e o job precisa de <code>permissions: id-token: write</code>.</>} en={<><b>And the workflow?</b> The full file (one for <code>develop</code> and <code>main</code>), the GitHub environments, the image build, ECR and the ECS swap are in the <a href="/notas/github-aws-oidc/">GitHub to AWS: OIDC, Docker, ECR and ECS</a> note. This page keeps only the AWS concepts. The action used is <code>aws-actions/configure-aws-credentials</code> and the job needs <code>permissions: id-token: write</code>.</>} /></p>
          <Callout tone="warn">
            <strong><T pt="Pegadinhas" en="Gotchas" /></strong>
            <ul>
              <li><T pt={<>Uma role por ambiente (staging, prod) e, idealmente, cada uma na sua própria conta, com <code>sub</code> diferente.</>} en={<>One role per environment (staging, prod) and ideally each in its own account, with a different <code>sub</code>.</>} /></li>
              <li><T pt="A trust policy de uma role OIDC só pode ter um tipo de provedor; para vários IdPs, crie uma role para cada." en="An OIDC role's trust policy supports only one provider; for several IdPs, create one role each." /></li>
              <li><T pt={<>O IAM aceita o token por até 5 minutos além do <code>exp</code>, por causa de diferença de relógio.</>} en={<>IAM accepts the token up to 5 minutes past its <code>exp</code>, to allow for clock skew.</>} /></li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="CI/CD que precisa chamar a AWS (push no ECR, deploy no ECS, sync no S3) sem access keys guardadas como secret." en="CI/CD that needs to call AWS (ECR push, ECS deploy, S3 sync) without access keys stored as secrets." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Trust policy com <code>sub</code> aberto (ex.: <code>repo:ORG/*</code> em produção); pessoas fazendo login (prefira <a href="#identity-center">Identity Center</a>).</>} en={<>A trust policy with an open <code>sub</code> (e.g. <code>repo:ORG/*</code> in production); people signing in (prefer <a href="#identity-center">Identity Center</a>).</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt={<>Por que a condição em <code>sub</code> é obrigatória para o GitHub?</>} en={<>Why is the <code>sub</code> condition mandatory for GitHub?</>} /></summary>
            <div className="ans"><T pt="Porque o provedor é compartilhado: sem ela, workflows de qualquer repositório poderiam assumir a sua role." en="Because the provider is shared: without it, workflows from any repository could assume your role." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Que permissão o job precisa para pedir o token?" en="What permission does the job need to request the token?" /></summary>
            <div className="ans"><T pt={<><code>permissions: id-token: write</code>.</>} en={<><code>permissions: id-token: write</code>.</>} /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html" rel="noopener">OIDC federation (IAM)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html" rel="noopener">Create an OpenID Connect (OIDC) identity provider in IAM</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html" rel="noopener">Create a role for OpenID Connect federation (inclui a seção sobre GitHub)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc_secure-by-default.html" rel="noopener">Identity-provider controls for shared OIDC providers</a></li>
              <li><a href="https://github.com/aws-actions/configure-aws-credentials" rel="noopener">aws-actions/configure-aws-credentials (repositório oficial da action)</a></li>
              <li><a href="https://docs.github.com/en/actions/reference/security/oidc" rel="noopener">GitHub Docs: OpenID Connect reference (formatos de sub)</a></li>
            </ul>
            <p><T pt={<>Os formatos de <code>sub</code> e o comportamento do GitHub vêm da documentação do GitHub, não da AWS. Revise-os na fonte antes de aplicar em produção.</>} en={<>The <code>sub</code> formats and GitHub behavior come from GitHub's docs, not AWS. Review them at the source before applying to production.</>} /></p>
          </Sources>
        </section>
        {/* ============ CLI ============ */}
        <section className="topic" id="cli">
          <header>
            <span className="tag"><T pt="Fundamentos · 04" en="Foundations · 04" /></span>
            <h2>AWS CLI (Linux)</h2>
            <p className="lead"><T pt="Controle serviços da AWS pela linha de comando. Esta página usa a versão 2 do AWS CLI." en="Control AWS services from the command line. This page covers AWS CLI version 2." /></p>
          </header>
          <h3><T pt="Instalar" en="Install" /></h3>
          <p><T pt={<>O script de instalação é o método recomendado pela documentação. Por padrão ele instala só para o usuário atual, em <code>$HOME/.local</code>. O método com <code>sudo</code> e <code>--system</code> instala para todos.</>} en={<>The install script is the method the docs recommend. By default it installs for the current user only, under <code>$HOME/.local</code>. The <code>sudo</code> + <code>--system</code> form installs for everyone.</>} /></p>
          <CodeBlock code={`curl -fsSL https://awscli.amazonaws.com/v2/install.sh | bash
aws --version`} />
          <Callout tone="warn"><strong><T pt="Cuidado" en="Careful" /></strong> <T pt={<>Rodar um script baixado direto no shell é uma escolha sua. A documentação também oferece o instalador em .zip, com verificação opcional de assinatura (GPG), e um pacote <code>snap</code>. No Amazon Linux, remova antes o pacote <code>awscli</code> do <code>yum</code> se quiser a versão mais recente.</>} en={<>Piping a downloaded script into the shell is your call. The docs also offer the .zip installer, with optional GPG signature verification, and a <code>snap</code> package. On Amazon Linux, first remove the <code>yum</code> <code>awscli</code> package if you want the latest version.</>} /></Callout>
          <h3><T pt="Atualizar e remover" en="Update and remove" /></h3>
          <CodeBlock code={`aws update`} />
          <p><T pt={<>Em instalações feitas pelo script ou pelos instaladores oficiais, o comando acima atualiza o CLI. Se foi instalado para todos os usuários, rode-o com <code>sudo</code>. Para desinstalar, siga a página oficial de desinstalação (link abaixo).</>} en={<>For installs done with the script or the official installers, the command above updates the CLI. If it was installed for all users, run it with <code>sudo</code>. To uninstall, follow the official uninstall page (link below).</>} /></p>
          <Callout tone="personal"><strong><T pt="Correção" en="Correction" /></strong> <T pt={<>A anotação antiga dizia para repetir o comando de instalação com <code>--update</code> e removia arquivos à mão. A documentação atual traz o comando <code>aws update</code>. Os passos manuais de remoção foram trocados por link para a página oficial.</>} en={<>The old note said to repeat the install command with <code>--update</code> and removed files by hand. The current docs have the <code>aws update</code> command. The manual removal steps were replaced by a link to the official page.</>} /></Callout>
          <h3><T pt="Quem sou eu? e login" en="Who am I? and login" /></h3>
          <CodeBlock code={`aws sts get-caller-identity --profile meu-perfil`} />
          <p><T pt={<>Mostra a identidade (conta e ARN) das credenciais em uso. Para pessoas, configure o login com <a href="#identity-center">IAM Identity Center</a> (<code>aws configure sso</code> e <code>aws sso login</code>).</>} en={<>Shows the identity (account and ARN) of the credentials in use. For people, set up sign-in with <a href="#identity-center">IAM Identity Center</a> (<code>aws configure sso</code> and <code>aws sso login</code>).</>} /></p>
          <p><b>ECR</b> — <T pt="autenticação com um token temporário (válido por 12 horas) para o Docker:" en="authentication with a temporary token (valid for 12 hours) for Docker:" /></p>
          <CodeBlock code={`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com`} />
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Automação, scripts, diagnóstico rápido e tarefas repetíveis que o console não resolve bem." en="Automation, scripts, quick diagnostics and repeatable tasks the console does not handle well." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Access keys fixas em arquivo para pessoas (prefira SSO) ou em CI (prefira <a href="#oidc">OIDC</a>).</>} en={<>Static access keys in files for people (prefer SSO) or in CI (prefer <a href="#oidc">OIDC</a>).</>} />
            </div>
          </div>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" rel="noopener">Installing or updating to the latest version of the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/uninstall.html" rel="noopener">Uninstalling the AWS CLI version 2</a> <span className="muted">(<T pt="referenciada pela página de instalação; não lida integralmente" en="referenced by the install page; not read in full" />)</span></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" rel="noopener">Configuring IAM Identity Center authentication with the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html" rel="noopener">ECR: Pushing a Docker image</a></li>
            </ul>
          </Sources>
        </section>
        {/* ============ VPC ============ */}
        <section className="topic" id="vpc">
          <header>
            <span className="tag"><T pt="Rede · 05" en="Networking · 05" /></span>
            <h2>VPC</h2>
            <p className="lead"><T pt="Amazon Virtual Private Cloud: uma rede virtual logicamente isolada, parecida com a de um data center tradicional, onde você lança seus recursos AWS." en="Amazon Virtual Private Cloud: a logically isolated virtual network, similar to a traditional data center network, where you launch your AWS resources." /></p>
          </header>
          <div className="vpc">
            <div className="label">VPC · 10.0.0.0/16 <T pt="(exemplo)" en="(example)" /></div>
            <div className="az-row">
              <div className="az">
                <div className="label">AZ A</div>
                <div className="subnet pub">
                  <Icon name="globe" />
                  <b><T pt="Pública" en="Public" /></b> 10.0.1.0/24<br /><small>ALB · NAT Gateway</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b><T pt="Privada" en="Private" /></b> 10.0.11.0/24<br /><small><T pt="Aplicação (ECS/EC2)" en="Application (ECS/EC2)" /></small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b><T pt="Privada" en="Private" /></b> 10.0.21.0/24<br /><small><T pt="Banco de dados (RDS)" en="Database (RDS)" /></small>
                </div>
              </div>
              <div className="az">
                <div className="label">AZ B</div>
                <div className="subnet pub">
                  <Icon name="globe" />
                  <b><T pt="Pública" en="Public" /></b> 10.0.2.0/24<br /><small>ALB · NAT Gateway</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b><T pt="Privada" en="Private" /></b> 10.0.12.0/24<br /><small><T pt="Aplicação (ECS/EC2)" en="Application (ECS/EC2)" /></small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b><T pt="Privada" en="Private" /></b> 10.0.22.0/24<br /><small><T pt="Banco de dados (RDS)" en="Database (RDS)" /></small>
                </div>
              </div>
            </div>
            <div className="igw">
              <Icon name="gateway" />
              Internet Gateway ⇄
              <Icon name="globe" />
              Internet <small>(<T pt="rota 0.0.0.0/0 → IGW nas públicas; nas privadas, 0.0.0.0/0 → NAT Gateway" en="0.0.0.0/0 → IGW route in public subnets; in private ones, 0.0.0.0/0 → NAT Gateway" />)</small>
            </div>
          </div>
          <p className="muted"><T pt="Os blocos CIDR acima são apenas um exemplo didático de desenho; a AWS não define um padrão obrigatório." en="The CIDR blocks above are only a teaching example of a layout; AWS does not mandate a standard." /></p>
          <h3><T pt="Peças principais" en="Main pieces" /></h3>
          <ul>
            <li><b>Subnet:</b> <T pt={<>faixa de IPs da VPC que fica em <b>uma única</b> zona de disponibilidade.</>} en={<>a range of VPC IP addresses living in <b>a single</b> Availability Zone.</>} /></li>
            <li><b>Route table:</b> <T pt={<>conjunto de rotas (destino + alvo) que decide para onde vai o tráfego de uma subnet ou gateway. Todo VPC nasce com uma <i>main route table</i>, e você pode criar outras.</>} en={<>a set of routes (destination + target) deciding where a subnet's or gateway's traffic goes. Every VPC starts with a <i>main route table</i>, and you can create more.</>} /></li>
            <li><b>Internet gateway:</b> <T pt="conecta a VPC à internet." en="connects the VPC to the internet." /></li>
            <li><b>NAT gateway, VPC endpoint, peering, transit gateway, VPN, Flow Logs</b> <T pt="completam o quadro (veja abaixo e na página oficial)." en="complete the picture (see below and the official page)." /></li>
            <li><T pt={<>Cada Region já tem uma <b>VPC default</b>, pronta para uso. Não há cobrança pela VPC em si, mas há por alguns componentes, como NAT gateways e IPv4 públicos.</>} en={<>Each Region already has a <b>default VPC</b>, ready to use. There is no charge for the VPC itself, but there is for some components, such as NAT gateways and public IPv4 addresses.</>} /></li>
          </ul>
          <h3><T pt="Subnets e CIDR" en="Subnets and CIDR" /></h3>
          <p><T pt={<>O bloco de uma subnet pode ser igual ao da VPC (uma subnet só) ou parte dele. Subnets da mesma VPC <b>não podem se sobrepor</b>. O tamanho permitido para IPv4 vai de <code>/28</code> a <code>/16</code>. Em cada subnet, os quatro primeiros IPs e o último <b>não estão disponíveis</b> (rede, roteador da VPC, DNS, uso futuro e broadcast): são 5 reservados.</>} en={<>A subnet's block can equal the VPC's (a single subnet) or be part of it. Subnets in the same VPC <b>cannot overlap</b>. The allowed IPv4 size ranges from <code>/28</code> to <code>/16</code>. In each subnet, the first four IPs and the last one are <b>unavailable</b> (network, VPC router, DNS, future use and broadcast): that is 5 reserved.</>} /></p>
          <div className="widget" data-cidr="">
            <div className="wtitle"><T pt="Calculadora CIDR" en="CIDR calculator" /></div>
            <div className="row"><label htmlFor="cidr-r"><T pt="Máscara" en="Prefix" />:</label> <input id="cidr-r" type="range" min="16" max="28" defaultValue="24" /> <span className="big cidr-n">/24</span></div>
            <p><b className="cidr-total big">256</b> <T pt="IPs no total ·" en="IPs total ·" /> <b className="cidr-usable">251</b> <T pt="utilizáveis (a AWS reserva 5 por subnet)" en="usable (AWS reserves 5 per subnet)" /></p>
          </div>
          <h3><T pt="Subnets públicas e privadas" en="Public and private subnets" /></h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="globe" /> <T pt="Pública" en="Public" /></h4>
              <T pt={<>A route table tem uma rota para o internet gateway. Abriga o que precisa ser alcançado de fora: <a href="#elb">load balancer</a> e NAT gateway.</>} en={<>The route table has a route to the internet gateway. Home to what must be reached from outside: the <a href="#elb">load balancer</a> and the NAT gateway.</>} />
            </div>
            <div className="card">
              <h4><Icon name="lock" /> <T pt="Privada" en="Private" /></h4>
              <T pt="Sem rota para o internet gateway. Para sair para a internet, usa um NAT gateway; para falar com serviços AWS, pode usar VPC endpoints. Boa para aplicação e banco de dados." en="No route to the internet gateway. To reach the internet it uses a NAT gateway; to talk to AWS services it can use VPC endpoints. Good for application and database." />
            </div>
          </div>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Route table" en="Route table" /></th>
                  <th>Destination</th>
                  <th>Target</th>
                </tr>
                <tr>
                  <td><T pt="Subnet pública" en="Public subnet" /></td>
                  <td><code>10.0.0.0/16</code></td>
                  <td><code>local</code></td>
                </tr>
                <tr>
                  <td><T pt="Subnet pública" en="Public subnet" /></td>
                  <td><code>0.0.0.0/0</code></td>
                  <td><code>igw-…</code></td>
                </tr>
                <tr>
                  <td><T pt="Subnet privada" en="Private subnet" /></td>
                  <td><code>10.0.0.0/16</code></td>
                  <td><code>local</code></td>
                </tr>
                <tr>
                  <td><T pt="Subnet privada" en="Private subnet" /></td>
                  <td><code>0.0.0.0/0</code></td>
                  <td><code>nat-…</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted"><T pt={<>A rota <code>local</code> permite que as subnets da VPC conversem entre si; quem restringe quem fala com quem são os <a href="#sg">Security Groups</a>. Um RDS "publicamente acessível" exige que todas as subnets do seu DB subnet group tenham internet gateway; o recomendado para bancos é subnet privada (veja <a href="#rds">RDS</a>).</>} en={<>The <code>local</code> route lets the VPC's subnets talk to each other; what restricts who talks to whom is <a href="#sg">Security Groups</a>. A "publicly accessible" RDS requires every subnet in its DB subnet group to have an internet gateway; for databases a private subnet is the usual choice (see <a href="#rds">RDS</a>).</>} /></p>
          <h3>NAT Gateway</h3>
          <p><T pt={<>Permite que instâncias em subnet privada <b>iniciem</b> conexões para fora da VPC, enquanto serviços externos não conseguem iniciar conexão com elas. O NAT gateway <b>público</b> (padrão) fica numa <b>subnet pública</b>, exige um Elastic IP e roteia o tráfego para o internet gateway. O <b>privado</b> serve para outras VPCs ou redes on-premises (via transit gateway ou virtual private gateway) e não aceita Elastic IP. Existe também o NAT gateway regional, com expansão multi-AZ automática.</>} en={<>Lets instances in a private subnet <b>initiate</b> connections out of the VPC, while external services cannot start connections to them. The <b>public</b> NAT gateway (default) lives in a <b>public subnet</b>, needs an Elastic IP and routes traffic to the internet gateway. The <b>private</b> one is for other VPCs or on-premises networks (through a transit gateway or virtual private gateway) and does not accept an Elastic IP. There is also a regional NAT gateway with automatic multi-AZ expansion.</>} /></p>
          <div className="flow"><span className="node"><Icon name="lock" /> <T pt="Subnet privada" en="Private subnet" /></span><span className="arrow">0.0.0.0/0 →</span><span className="node"><Icon name="swap" /> NAT <T pt="(subnet pública)" en="(public subnet)" /></span><span className="arrow">→</span><span className="node"><Icon name="gateway" /> IGW</span><span className="arrow">→</span><span className="node"><Icon name="globe" /> Internet</span></div>
          <Callout tone="warn"><strong><T pt="Custo" en="Cost" /></strong> <T pt={<>O NAT gateway é um componente cobrado. A documentação mostra como comparar o custo com IPv4 públicos e sugere alternativas como VPC endpoints (PrivateLink) para falar com serviços AWS. Veja os preços na <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">página de preços da VPC</a>.</>} en={<>The NAT gateway is a billed component. The docs show how to compare its cost against public IPv4 addresses and suggest alternatives such as VPC endpoints (PrivateLink) to reach AWS services. See prices on the <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">VPC pricing page</a>.</>} /></Callout>
          <h3>VPC endpoints</h3>
          <p><T pt="Conectam a VPC a serviços AWS de forma privada, sem internet gateway nem NAT. O tráfego fica na rede da AWS." en="Connect the VPC to AWS services privately, with no internet gateway or NAT. Traffic stays on the AWS network." /></p>
          <div className="grid">
            <div className="card">
              <h4>Gateway endpoint</h4>
              <T pt={<>Para <b>S3</b> e <b>DynamoDB</b>. Não usa AWS PrivateLink; o tráfego é direcionado por rota.</>} en={<>For <b>S3</b> and <b>DynamoDB</b>. Does not use AWS PrivateLink; traffic is directed by route.</>} />
            </div>
            <div className="card">
              <h4>Interface endpoint</h4>
              <T pt={<>Usa AWS PrivateLink: cria uma interface de rede (com IP privado) em cada subnet escolhida e o tráfego é resolvido por DNS. Aceita uma <i>endpoint policy</i> para controlar quem o usa.</>} en={<>Uses AWS PrivateLink: creates a network interface (with a private IP) in each chosen subnet and traffic is resolved through DNS. Accepts an <i>endpoint policy</i> to control who uses it.</>} />
            </div>
          </div>
          <p className="muted"><T pt={<>Exemplo: instâncias sem IP público podem usar o Session Manager com VPC endpoints do Systems Manager (veja <a href="#ssm">Systems Manager</a>).</>} en={<>Example: instances without a public IP can use Session Manager with Systems Manager VPC endpoints (see <a href="#ssm">Systems Manager</a>).</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Sempre que houver mais de um ambiente ou camada: borda (ALB) em subnets públicas, aplicação e banco em privadas, em pelo menos duas AZs." en="Whenever there is more than one environment or tier: edge (ALB) in public subnets, application and database in private ones, in at least two AZs." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Colocar instâncias de aplicação com IP público só por conveniência; usar NAT gateway quando um endpoint resolveria; CIDRs sobrepostos se houver planos de peering ou transit gateway." en="Giving application instances public IPs just for convenience; using a NAT gateway when an endpoint would do; overlapping CIDRs if peering or a transit gateway is planned." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt={"O que torna uma subnet \"pública\"?"} en={"What makes a subnet \"public\"?"} /></summary>
            <div className="ans"><T pt={<>A route table dela tem uma rota <code>0.0.0.0/0</code> para o internet gateway.</>} en={<>Its route table has a <code>0.0.0.0/0</code> route to the internet gateway.</>} /></div>
          </details>
          <details className="fc">
            <summary><T pt="Onde fica o NAT gateway público?" en="Where does the public NAT gateway live?" /></summary>
            <div className="ans"><T pt="Em uma subnet pública, com um Elastic IP associado." en="In a public subnet, with an Elastic IP attached." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Quantos IPs utilizáveis tem uma subnet /24?" en="How many usable IPs does a /24 subnet have?" /></summary>
            <div className="ans"><T pt="251: 256 menos os 5 reservados pela AWS." en="251: 256 minus the 5 AWS reserves." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" rel="noopener">What is Amazon VPC?</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html" rel="noopener">Subnet CIDR blocks</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" rel="noopener">Configure route tables</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" rel="noopener">NAT gateways</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html" rel="noopener">AWS PrivateLink concepts (VPC endpoints)</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html" rel="noopener">EC2 instance IP addressing (otimização de IPv4 público)</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html" rel="noopener">RDS: Working with a DB instance in a VPC</a></li>
            </ul>
            <p><T pt={<><b>Removido por falta de fonte nas páginas lidas:</b> valores padrão de DNS hostnames/DNS resolution e a afirmação de que a rota local "não pode ser deletada". <b>Reformulado:</b> "10.0.0.0/16 é o IPv4 comum" virou apenas um exemplo; "subnet privada nunca fala com a internet" passou a mencionar NAT gateway e VPC endpoints.</>} en={<><b>Removed for lack of a source in the pages read:</b> default values for DNS hostnames/DNS resolution and the claim that the local route "cannot be deleted". <b>Reworded:</b> "10.0.0.0/16 is the common IPv4" became only an example; "a private subnet never talks to the internet" now mentions NAT gateways and VPC endpoints.</>} /></p>
          </Sources>
        </section>
        {/* ============ SG ============ */}
        <section className="topic" id="sg">
          <header>
            <span className="tag"><T pt="Rede · 06" en="Networking · 06" /></span>
            <h2>Security Groups &amp; Prefix Lists</h2>
            <p className="lead"><T pt="Security group: firewall virtual que controla o tráfego que pode chegar e sair dos recursos associados a ele. Prefix list: um conjunto de CIDRs reutilizável nas regras." en="Security group: a virtual firewall controlling the traffic allowed to reach and leave the resources it is associated with. Prefix list: a reusable set of CIDRs for your rules." /></p>
          </header>
          <h3><T pt="Como funciona" en="How it works" /></h3>
          <ul>
            <li><T pt={<>Só existem regras de <b>permissão</b> (allow), não de bloqueio. Um SG novo não tem regra inbound, então <b>nenhum tráfego de entrada</b> é permitido até você adicionar.</>} en={<>Rules are <b>allow</b> only, no deny. A new SG has no inbound rules, so <b>no inbound traffic</b> is allowed until you add some.</>} /></li>
            <li><T pt="Um SG novo vem com uma regra outbound que libera toda a saída. Se você remover e não houver regras de saída, nenhuma saída é permitida." en="A new SG comes with an outbound rule allowing all outbound traffic. If you remove it and have no outbound rules, no outbound traffic is allowed." /></li>
            <li><b>Stateful:</b> <T pt="a resposta a um tráfego permitido é liberada independentemente das regras do outro sentido. Por isso o outbound de um banco pode ficar vazio e ele ainda responde ao que o inbound autorizou." en="the response to allowed traffic is permitted regardless of the other direction's rules. That is why a database's outbound can be empty and it still answers what inbound allowed." /></li>
            <li><T pt="Vários SGs em um recurso têm suas regras somadas. Mudanças nas regras valem na hora para todos os recursos associados. O SG é associado a interfaces de rede, não a IPs individuais." en="Several SGs on one resource have their rules aggregated. Rule changes apply immediately to all associated resources. An SG is tied to network interfaces, not individual IPs." /></li>
            <li><T pt={<>Cada regra tem protocolo, faixa de portas e origem (inbound) ou destino (outbound): um IP (<code>/32</code>), um CIDR, uma <b>prefix list</b> ou <b>outro Security Group</b>.</>} en={<>Each rule has a protocol, port range and a source (inbound) or destination (outbound): an IP (<code>/32</code>), a CIDR, a <b>prefix list</b> or <b>another Security Group</b>.</>} /></li>
            <li><T pt="Não há cobrança por usar security groups. Existem cotas (SGs por VPC, regras por SG, SGs por interface)." en="There is no charge for security groups. There are quotas (SGs per VPC, rules per SG, SGs per interface)." /></li>
            <li><T pt={<>SGs <b>não filtram</b> tráfego para DNS da Amazon, DHCP, metadados da instância, Time Sync e o roteador da VPC.</>} en={<>SGs do <b>not filter</b> traffic to Amazon DNS, DHCP, instance metadata, Time Sync and the VPC router.</>} /></li>
          </ul>
          <h3><T pt="Security Groups encadeados" en="Chained Security Groups" /></h3>
          <p><T pt={<>Em vez de liberar por IP, use como origem o <b>ID de outro SG</b>. A regra vale para as instâncias associadas àquele SG, pelo IP privado delas, e sobrevive à troca de instâncias. Exemplo clássico da documentação (load balancer, web e banco):</>} en={<>Instead of allowing by IP, use <b>another SG's ID</b> as the source. The rule applies to instances associated with that SG, through their private IPs, and survives instance replacement. The docs' classic example (load balancer, web and database):</>} /></p>
          <div className="flow"> <span className="node"><Icon name="globe" /> Internet</span><span className="arrow">80/443 →</span> <span className="node"><Icon name="balance" /> sg-alb<br /><small>in: 0.0.0.0/0</small></span><span className="arrow">app port →</span> <span className="node"><Icon name="server" /> sg-app<br /><small>in: sg-alb</small></span><span className="arrow">db port →</span> <span className="node"><Icon name="database" /> sg-db<br /><small>in: sg-app</small></span> </div>
          <ul>
            <li><T pt={<>Referenciar um SG <b>não copia</b> as regras dele para o SG que referencia.</>} en={<>Referencing an SG does <b>not</b> copy its rules into the referencing SG.</>} /></li>
            <li><T pt="Para referenciar em regra inbound, os SGs devem estar na mesma VPC ou em VPCs ligadas por peering ou transit gateway. Em regra outbound: mesma VPC ou peering." en="To reference in an inbound rule, the SGs must be in the same VPC or in VPCs linked by peering or a transit gateway. In an outbound rule: same VPC or peering." /></li>
            <li><T pt={<>Uma regra que referencia outro SG conta como <b>uma</b> regra, não importa o tamanho do SG referenciado.</>} en={<>A rule referencing another SG counts as <b>one</b> rule, no matter the size of the referenced SG.</>} /></li>
            <li><T pt={<>Se o tráfego passa por uma appliance intermediária (middlebox), referenciar o SG do outro lado <b>não</b> basta: use o IP privado ou o CIDR da subnet.</>} en={<>If traffic goes through a middlebox appliance, referencing the other side's SG is <b>not</b> enough: use the private IP or the subnet CIDR.</>} /></li>
          </ul>
          <div className="widget" data-sg="">
            <div className="wtitle"><T pt="Simulador: SG da EC2" en="Simulator: the EC2's SG" /></div>
            <p><small><T pt={<>Regras inbound do SG da aplicação: porta <b>3000</b> vinda do SG do load balancer · porta <b>22</b> vinda do meu IP. Tudo o mais é negado.</>} en={<>Inbound rules of the application SG: port <b>3000</b> from the load balancer's SG · port <b>22</b> from my IP. Everything else is denied.</>} /></small></p>
            <div className="row"> <label><T pt="Origem" en="Source" /> <select className="sg-source" defaultValue="lb"> <option value="net">Internet (0.0.0.0/0)</option> <option value="lb">SG load balancer</option> <option value="me">My IP</option> <option value="other">Other SG</option> </select></label> <label><T pt="Porta" en="Port" /> <select className="port" defaultValue="3000"><option>80</option><option>443</option><option>22</option><option>3000</option></select></label> </div>
            <div className="result sg-out"></div>
          </div>
          <h3>Managed Prefix Lists</h3>
          <p><T pt="Conjunto de um ou mais blocos CIDR que você referencia como uma unidade em regras de security group e em route tables. Ao adicionar um CIDR à lista, todos os SGs que a usam são atualizados." en="A set of one or more CIDR blocks you reference as a unit in security group rules and route tables. Adding a CIDR to the list updates every SG using it." /></p>
          <div className="grid">
            <div className="card">
              <h4><T pt="Gerenciada pelo cliente" en="Customer-managed" /></h4>
              <T pt={<>Você define e mantém. Só IPv4 <i>ou</i> IPv6, vale na Region onde foi criada, e você escolhe o <b>máximo de entradas</b> na criação. Pode ser compartilhada com outras contas via AWS RAM. Cada edição cria uma nova versão.</>} en={<>You define and maintain it. IPv4 <i>or</i> IPv6 only, applies to the Region it was created in, and you set the <b>maximum entries</b> at creation. It can be shared with other accounts via AWS RAM. Each edit creates a new version.</>} />
            </div>
            <div className="card">
              <h4><T pt="Gerenciada pela AWS" en="AWS-managed" /></h4>
              <T pt="Faixas de IP de serviços da AWS. Você não pode criar, alterar, compartilhar nem apagar." en="IP ranges of AWS services. You cannot create, modify, share or delete them." />
            </div>
          </div>
          <Callout tone="warn"><strong><T pt="Pegadinha de cotas" en="Quota gotcha" /></strong> <T pt={<>Uma regra que referencia uma prefix list conta como o <b>máximo de entradas</b> da lista (não o número atual): lista de 20 entradas máximas = 20 regras. Para listas gerenciadas pela AWS conta o "peso" da lista.</>} en={<>A rule referencing a prefix list counts as the list's <b>maximum entries</b> (not the current number): a list with max 20 entries = 20 rules. For AWS-managed lists, the list's "weight" counts.</>} /></Callout>
          <p className="muted"><T pt="Uso típico: um único conjunto de IPs do escritório/VPN liberado para SSH ou para um painel em vários SGs." en="Typical use: a single set of office/VPN IPs allowed for SSH or an admin panel across several SGs." /></p>
          <Callout tone="good"><strong><T pt="Boas práticas da documentação" en="Docs best practices" /></strong> <T pt={<>Limite quem pode criar e alterar SGs; crie o mínimo de SGs possível; para as portas 22 (SSH) e 3389 (RDP), autorize só faixas de IP específicas (nunca <code>0.0.0.0/0</code>); não abra faixas largas de portas; considere NACLs como camada extra.</>} en={<>Limit who can create and change SGs; create as few SGs as possible; for ports 22 (SSH) and 3389 (RDP), authorize only specific IP ranges (never <code>0.0.0.0/0</code>); do not open wide port ranges; consider network ACLs as an extra layer.</>} /></Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="SG por papel (alb, app, db) encadeados por referência; prefix lists para conjuntos de IPs que mudam e se repetem em várias regras." en="One SG per role (alb, app, db) chained by reference; prefix lists for IP sets that change and repeat across many rules." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Origem <code>0.0.0.0/0</code> em portas administrativas ou de banco; prefix list com máximo de entradas grande sem necessidade (consome cota); depender de SG para filtrar DNS.</>} en={<>Source <code>0.0.0.0/0</code> on admin or database ports; a prefix list with a large max size for no reason (it eats quota); relying on SGs to filter DNS.</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O banco precisa de regra outbound para responder à API?" en="Does the database need an outbound rule to answer the API?" /></summary>
            <div className="ans"><T pt="Não. SG é stateful: a resposta ao tráfego permitido pelo inbound sai sozinha." en="No. SGs are stateful: the reply to traffic allowed by inbound goes out on its own." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Quantas regras consome uma prefix list com máximo de 20 entradas e 3 CIDRs hoje?" en="How many rules does a prefix list with max 20 entries and 3 CIDRs today consume?" /></summary>
            <div className="ans"><T pt="20, pois conta o máximo configurado." en="20, because the configured maximum counts." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" rel="noopener">Control traffic to your AWS resources using security groups</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" rel="noopener">Security group rules</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists.html" rel="noopener">Managed prefix lists</a></li>
            </ul>
            <p><T pt={<><b>Removido das anotações antigas (sem fonte):</b> regras de "frontend estático exige backend público" e "SSR: backend só aceita frontends". São decisões de arquitetura, não afirmações da documentação; o encadeamento por SG acima cobre o caso do backend privado.</>} en={<><b>Removed from the old notes (no source):</b> the "static frontend requires a public backend" and "SSR: backend accepts only frontends" rules. They are architecture decisions, not documentation claims; the SG chaining above covers the private-backend case.</>} /></p>
          </Sources>
        </section>
        {/* ============ ELB ============ */}
        <section className="topic" id="elb">
          <header>
            <span className="tag"><T pt="Rede · 07" en="Networking · 07" /></span>
            <h2>Application Load Balancer</h2>
            <p className="lead"><T pt="O Elastic Load Balancing distribui o tráfego entre vários destinos (instâncias EC2, containers, IPs) em uma ou mais zonas de disponibilidade e só envia para destinos saudáveis. O ALB faz isso na camada de aplicação (HTTP/HTTPS)." en="Elastic Load Balancing distributes traffic across multiple targets (EC2 instances, containers, IPs) in one or more Availability Zones and only sends to healthy targets. The ALB does this at the application layer (HTTP/HTTPS)." /></p>
          </header>
          <h3><T pt="Tipos de load balancer" en="Load balancer types" /></h3>
          <div className="grid">
            <div className="card">
              <h4>ALB</h4>
              <T pt="Application: camada 7. Roteia por conteúdo da requisição (host, caminho, cabeçalhos...), faz redirect e respostas fixas, e aceita targets por instância, IP ou Lambda." en="Application: layer 7. Routes by request content (host, path, headers...), does redirects and fixed responses, and supports instance, IP or Lambda targets." />
            </div>
            <div className="card">
              <h4>NLB</h4>
              <T pt="Network: camada 4 (TCP, UDP, TLS, QUIC). Lida com milhões de requisições por segundo e tem IP estático por zona (com opção de Elastic IP)." en="Network: layer 4 (TCP, UDP, TLS, QUIC). Handles millions of requests per second and has a static IP per zone (with Elastic IP option)." />
            </div>
            <div className="card">
              <h4>GWLB</h4>
              <T pt="Gateway: camada 3. Implanta e escala appliances virtuais (firewalls, detecção de intrusão, inspeção profunda de pacotes) usando o protocolo GENEVE." en="Gateway: layer 3. Deploys and scales virtual appliances (firewalls, intrusion detection, deep packet inspection) using the GENEVE protocol." />
            </div>
          </div>
          <p className="muted"><T pt="Há ainda o Classic Load Balancer. O restante desta página trata do ALB." en="There is also the Classic Load Balancer. The rest of this page covers the ALB." /></p>
          <h3><T pt="Peças do ALB" en="ALB components" /></h3>
          <div className="flow"> <span className="node"><Icon name="globe" /> Cliente</span><span className="arrow">→</span> <span className="node"><Icon name="listener" /> Listener<br /><small>HTTPS :443</small></span><span className="arrow">→</span> <span className="node"><Icon name="rules" /> Rules<br /><small>host / path</small></span><span className="arrow">→</span> <span className="node"><Icon name="target" /> Target group</span><span className="arrow">→</span> <span className="node"><Icon name="server" /> Targets</span> </div>
          <ul>
            <li><b>Listener:</b> <T pt={<>verifica pedidos de conexão com o protocolo e a porta que você configura. Toda listener tem uma <i>regra default</i>, e você pode adicionar outras.</>} en={<>checks for connection requests using the protocol and port you configure. Every listener has a <i>default rule</i>, and you can add others.</>} /></li>
            <li><b>Target group:</b> <T pt="encaminha para um ou mais targets usando o protocolo e a porta que você definir (a porta do target deve ser a em que a aplicação escuta). Health checks são configurados por target group. Um target pode estar em mais de um target group." en="routes to one or more targets using the protocol and port you set (the target port must be the one the app listens on). Health checks are configured per target group. A target can be in more than one target group." /></li>
            <li><T pt={<>O algoritmo padrão do target group é <b>round robin</b>; a alternativa é <i>least outstanding requests</i>.</>} en={<>The target group's default algorithm is <b>round robin</b>; the alternative is <i>least outstanding requests</i>.</>} /></li>
          </ul>
          <div className="widget" data-lb="">
            <div className="wtitle"><T pt="Demo: round-robin e health check" en="Demo: round-robin and health check" /></div>
            <div className="lb-demo">
              <span className="node user"><Icon name="user" /> <T pt="Usuário" en="User" /></span> <span className="node lb"><Icon name="balance" /> ALB</span>
              <div className="targets">
                <div className="node" data-name="EC2-1">EC2-1 <button className="btn"><T pt="derrubar" en="kill" /></button></div>
                <div className="node" data-name="EC2-2">EC2-2 <button className="btn"><T pt="derrubar" en="kill" /></button></div>
                <div className="node" data-name="EC2-3">EC2-3 <button className="btn"><T pt="derrubar" en="kill" /></button></div>
              </div>
              <div className="pkt"></div>
            </div>
            <div className="row"><button className="btn primary send"><T pt="Enviar requisição" en="Send request" /></button> <span className="lb-out"></span></div>
            <small><T pt="Derrube instâncias: o ALB percebe pelo health check e só envia às saudáveis." en="Kill instances: the ALB notices through health checks and only sends to healthy ones." /></small>
          </div>
          <h3><T pt="Regras por host e caminho" en="Host and path rules" /></h3>
          <p><T pt={<>As regras são avaliadas em ordem de prioridade, da <b>menor</b> para a maior; a regra default é avaliada por último e não tem condições. Exemplo (um ALB para vários domínios):</>} en={<>Rules are evaluated in priority order, from the <b>lowest</b> to the highest; the default rule is evaluated last and has no conditions. Example (one ALB for several domains):</>} /></p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Prioridade" en="Priority" /></th>
                  <th><T pt="Condição" en="Condition" /></th>
                  <th><T pt="Ação" en="Action" /></th>
                </tr>
                <tr>
                  <td>10</td>
                  <td><code>host-header: api.exemplo.com.br</code></td>
                  <td>forward → tg-api</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td><code>host-header: app.exemplo.com.br</code></td>
                  <td>forward → tg-app</td>
                </tr>
                <tr>
                  <td>30</td>
                  <td><code>path-pattern: /admin/*</code></td>
                  <td>fixed-response 403</td>
                </tr>
                <tr>
                  <td><T pt="default" en="default" /></td>
                  <td>—</td>
                  <td>fixed-response 404</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li><T pt={<>Cada regra tem exatamente <b>uma</b> ação entre <code>forward</code>, <code>redirect</code> e <code>fixed-response</code>, e ela é a última a executar.</>} en={<>Each rule has exactly <b>one</b> action among <code>forward</code>, <code>redirect</code> and <code>fixed-response</code>, and it runs last.</>} /></li>
            <li><T pt={<>Condições disponíveis: <code>host-header</code>, <code>path-pattern</code>, <code>http-request-method</code>, <code>source-ip</code>, <code>http-header</code> e <code>query-string</code>. Há limite de três valores de comparação por condição e cinco por regra.</>} en={<>Available conditions: <code>host-header</code>, <code>path-pattern</code>, <code>http-request-method</code>, <code>source-ip</code>, <code>http-header</code> and <code>query-string</code>. Limits: three comparison strings per condition and five per rule.</>} /></li>
            <li><T pt="As regex das condições não suportam lookahead, lookbehind, backreferences, entre outros recursos." en="Condition regexes do not support lookahead, lookbehind, backreferences, among other features." /></li>
          </ul>
          <h3>Health checks</h3>
          <p><T pt="O ALB testa periodicamente cada target e só roteia para os saudáveis. Valores padrão segundo a documentação em 2026-10-13 (podem mudar):" en="The ALB periodically tests each target and only routes to healthy ones. Defaults per the docs on 2026-10-13 (they may change):" /></p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Configuração" en="Setting" /></th>
                  <th><T pt="Padrão" en="Default" /></th>
                </tr>
                <tr>
                  <td>Protocol / Path / Port</td>
                  <td>HTTP · <code>/</code> · <T pt="porta do tráfego" en="traffic port" /></td>
                </tr>
                <tr>
                  <td>Interval</td>
                  <td><T pt="30 s (5–300 s)" en="30 s (5–300 s)" /></td>
                </tr>
                <tr>
                  <td>Timeout</td>
                  <td><T pt="5 s (2–120 s)" en="5 s (2–120 s)" /></td>
                </tr>
                <tr>
                  <td>Healthy / Unhealthy threshold</td>
                  <td><T pt="5 / 2 (2–10)" en="5 / 2 (2–10)" /></td>
                </tr>
                <tr>
                  <td>Success codes</td>
                  <td>200 <T pt="(aceita 200–499, listas e faixas)" en="(accepts 200–499, lists and ranges)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn">
            <strong><T pt="Pegadinhas" en="Gotchas" /></strong>
            <ul>
              <li><T pt={<><b>Fail open:</b> se todos os targets do grupo estão não saudáveis, o ALB roteia para todos eles, independentemente do estado.</>} en={<><b>Fail open:</b> if all targets in a group are unhealthy, the ALB routes to all of them regardless of state.</>} /></li>
              <li><T pt="Health checks não suportam WebSockets." en="Health checks do not support WebSockets." /></li>
              <li><T pt={<>O path do health check precisa responder com um código aceito; apontar para uma página que redireciona (ex.: 301) faz o target ficar <i>unhealthy</i> se 301 não estiver nos success codes.</>} en={<>The health check path must answer with an accepted code; pointing at a page that redirects (e.g. 301) makes the target <i>unhealthy</i> unless 301 is in the success codes.</>} /></li>
            </ul>
          </Callout>
          <h3>HTTPS</h3>
          <p><T pt={<>Um listener HTTPS exige pelo menos um certificado X.509: o <b>certificado default</b>. Para vários domínios na mesma porta, adicione certificados à <i>certificate list</i> (o ALB escolhe o certificado pelo nome enviado via SNI) ou use um certificado com SANs/curinga. A AWS recomenda emitir os certificados no <a href="#acm">AWS Certificate Manager</a>. O nome no certificado precisa bater com o host pedido, senão a conexão falha.</>} en={<>An HTTPS listener requires at least one X.509 certificate: the <b>default certificate</b>. For several domains on the same port, add certificates to the <i>certificate list</i> (the ALB picks by the name sent via SNI) or use a certificate with SANs/wildcard. AWS recommends issuing certificates in <a href="#acm">AWS Certificate Manager</a>. The name on the certificate must match the requested host or the connection fails.</>} /></p>
          <p><T pt={<>Security Groups: o do ALB libera 80/443 da internet; o da aplicação libera a porta da app <b>só do SG do ALB</b> (veja <a href="#sg">Security Groups encadeados</a>).</>} en={<>Security Groups: the ALB's allows 80/443 from the internet; the app's allows the app port <b>only from the ALB's SG</b> (see <a href="#sg">chained Security Groups</a>).</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt={<>Aplicações HTTP/HTTPS, vários serviços ou domínios atrás de um único ponto de entrada, containers no <a href="#ecs">ECS</a>, redirect HTTP→HTTPS.</>} en={<>HTTP/HTTPS apps, several services or domains behind one entry point, containers on <a href="#ecs">ECS</a>, HTTP→HTTPS redirect.</>} />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Tráfego TCP/UDP genérico ou necessidade de IP estático (NLB); inspeção por appliances (GWLB); health check em WebSocket ou que depende de redirects." en="Generic TCP/UDP traffic or a need for static IPs (NLB); appliance inspection (GWLB); health checks over WebSocket or relying on redirects." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Para quem o ALB envia o tráfego?" en="Who does the ALB send traffic to?" /></summary>
            <div className="ans"><T pt="Para target groups, escolhidos pelas regras do listener; cada target group tem seus targets e health checks." en="To target groups, chosen by the listener's rules; each target group has its targets and health checks." /></div>
          </details>
          <details className="fc">
            <summary><T pt="O que acontece quando todos os targets ficam unhealthy?" en="What happens when all targets are unhealthy?" /></summary>
            <div className="ans"><T pt="O ALB faz fail open e roteia para todos eles." en="The ALB fails open and routes to all of them." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" rel="noopener">What is an Application Load Balancer?</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html" rel="noopener">Listener rules for your Application Load Balancer</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" rel="noopener">Health checks for ALB target groups</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html" rel="noopener">SSL certificates for your Application Load Balancer</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html" rel="noopener">What is a Network Load Balancer?</a> · <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html" rel="noopener">What is a Gateway Load Balancer?</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" rel="noopener">VPC: Security group rules (exemplo com ALB)</a></li>
            </ul>
            <p><T pt={<><b>Corrigido/reformulado:</b> "NLB: performance extrema (jogos, streaming)" foi trocado pelo que a documentação diz (camada 4, milhões de req/s, IP estático); o ELB agora é apresentado como família de quatro tipos. A frase sobre redirect no health check é uma consequência dos success codes documentados, não uma citação.</>} en={<><b>Corrected/reworded:</b> "NLB: extreme performance (games, streaming)" was replaced by what the docs say (layer 4, millions of req/s, static IP); ELB is now presented as a family of four types. The redirect/health-check remark is a consequence of the documented success codes, not a quote.</>} /></p>
          </Sources>
        </section>
        {/* ============ ACM ============ */}
        <section className="topic" id="acm">
          <header>
            <span className="tag"><T pt="Rede · 08" en="Networking · 08" /></span>
            <h2>ACM (Certificate Manager)</h2>
            <p className="lead"><T pt="AWS Certificate Manager emite e gerencia certificados SSL/TLS para usar com serviços integrados, como o Application Load Balancer. A validação por DNS prova que você controla o domínio." en="AWS Certificate Manager issues and manages SSL/TLS certificates for integrated services such as the Application Load Balancer. DNS validation proves you control the domain." /></p>
          </header>
          <div className="flow"> <span className="node"><Icon name="doc" /> <T pt="Pedir certificado" en="Request certificate" /></span><span className="arrow">→</span> <span className="node"><Icon name="key" /> <T pt="ACM devolve um CNAME" en="ACM returns a CNAME" /></span><span className="arrow">→</span> <span className="node"><Icon name="doc" /> <T pt="Você cria o CNAME no DNS" en="You create the CNAME in DNS" /></span><span className="arrow">→</span> <span className="node"><Icon name="check" /> Issued</span><span className="arrow">→</span> <span className="node"><Icon name="balance" /> <T pt="Listener HTTPS do ALB" en="ALB HTTPS listener" /></span> </div>
          <h3><T pt="Validação por DNS" en="DNS validation" /></h3>
          <ul>
            <li><T pt={<>Ao escolher DNS, o ACM fornece um ou mais registros <b>CNAME</b> (nome e valor únicos para o seu domínio e conta). Eles são a prova de que você controla o domínio.</>} en={<>When you choose DNS, ACM gives you one or more <b>CNAME</b> records (a name and value unique to your domain and account). They are proof that you control the domain.</>} /></li>
            <li><T pt={<>O CNAME é adicionado <b>uma única vez</b>. O ACM renova o certificado automaticamente enquanto ele estiver em uso e o CNAME continuar no DNS. Apagar o CNAME interrompe a renovação.</>} en={<>The CNAME is added <b>only once</b>. ACM renews the certificate automatically as long as it is in use and the CNAME stays in DNS. Deleting the CNAME stops renewal.</>} /></li>
            <li><T pt={<>Com o <a href="#route53">Route 53</a> como DNS e permissão de escrita na zona, o console mostra o botão <b>Create records in Route 53</b>. O status pode continuar <i>Pending validation</i> por até 30 minutos.</>} en={<>With <a href="#route53">Route 53</a> as DNS and write permission on the zone, the console shows a <b>Create records in Route 53</b> button. Status may remain <i>Pending validation</i> for up to 30 minutes.</>} /></li>
            <li><T pt={<>Se o ACM não conseguir validar em 72 horas, o status vira <i>Validation timed out</i> e é preciso pedir um novo certificado.</>} en={<>If ACM cannot validate within 72 hours, the status becomes <i>Validation timed out</i> and you must request a new certificate.</>} /></li>
            <li><T pt={<>Se o DNS não é Route 53, copie o CNAME (ou exporte o CSV) e crie-o no provedor. Alguns provedores acrescentam o domínio ao nome sozinhos: se você colar o nome completo, ele vira <code>_x.exemplo.com.exemplo.com</code> e a validação falha.</>} en={<>If DNS is not Route 53, copy the CNAME (or export the CSV) and create it at your provider. Some providers append the domain to the name themselves: if you paste the full name it becomes <code>_x.example.com.example.com</code> and validation fails.</>} /></li>
          </ul>
          <Callout tone="warn">
            <strong><T pt="Pegadinhas" en="Gotchas" /></strong>
            <ul>
              <li><T pt={<>Um certificado criado com validação por e-mail <b>não</b> pode ser trocado para DNS: apague e crie outro.</>} en={<>A certificate created with email validation <b>cannot</b> be switched to DNS: delete it and create a new one.</>} /></li>
              <li><T pt={<>O CNAME do domínio base e o do curinga (<code>*.exemplo.com</code> e <code>exemplo.com</code>) são iguais; subdomínios específicos têm CNAMEs próprios.</>} en={<>The CNAME for the base domain and the wildcard (<code>*.example.com</code> and <code>example.com</code>) are identical; specific subdomains have their own CNAMEs.</>} /></li>
              <li><T pt={<>Um curinga <code>*.exemplo.com</code> cobre <b>um</b> nível de subdomínio e <b>não</b> cobre o domínio raiz (<code>exemplo.com</code>); inclua os dois no certificado se precisar.</>} en={<>A <code>*.example.com</code> wildcard covers <b>one</b> subdomain level and does <b>not</b> cover the apex (<code>example.com</code>); include both in the certificate if needed.</>} /></li>
              <li><T pt="A resolução de CNAME falha se houver mais de cinco CNAMEs encadeados na configuração de DNS." en="CNAME resolution fails if more than five CNAMEs are chained in your DNS configuration." /></li>
              <li><T pt="O token de validação funciona em qualquer Region, então dá para recriar o mesmo certificado em várias Regions." en="The validation token works in any Region, so you can re-create the same certificate in multiple Regions." /></li>
              <li><T pt={<>Certificados <b>importados</b> no ACM não renovam sozinhos: você acompanha a expiração e troca antes do fim.</>} en={<><b>Imported</b> certificates in ACM do not renew by themselves: you track expiry and replace them before it ends.</>} /></li>
            </ul>
          </Callout>
          <p className="muted"><T pt={"Se você usa registros CAA no domínio, é preciso autorizar a AWS a emitir; veja a página \"Configure a CAA record\" do ACM, referenciada na documentação do Route 53."} en={"If you use CAA records on the domain, you must authorize AWS to issue; see ACM's \"Configure a CAA record\" page, referenced in the Route 53 docs."} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="HTTPS em ALB (e outros serviços integrados) com renovação automática; domínios cujo DNS você controla (Route 53 facilita)." en="HTTPS on an ALB (and other integrated services) with automatic renewal; domains whose DNS you control (Route 53 makes it easy)." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={"Validação por e-mail se o DNS é seu; apagar o CNAME \"que sobrou\" (quebra a renovação); depender de renovação automática em certificado importado."} en={"Email validation if you own the DNS; deleting the \"leftover\" CNAME (breaks renewal); counting on automatic renewal for an imported certificate."} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Por que não apagar o CNAME de validação depois de emitir?" en="Why not delete the validation CNAME after issuance?" /></summary>
            <div className="ans"><T pt="O ACM o usa para renovar o certificado automaticamente; sem ele a renovação para." en="ACM uses it to renew the certificate automatically; without it, renewal stops." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "AWS Certificate Manager DNS validation", href: "https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" },
              { label: "ALB: SSL certificates (padrões de nome, renovação)", href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html" },
              { label: "Route 53: Supported DNS record types (CAA)", href: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" },
            ]}
          />
        </section>
        {/* ============ EC2 ============ */}
        <section className="topic" id="ec2">
          <header>
            <span className="tag"><T pt="Computação · 09" en="Compute · 09" /></span>
            <h2>EC2 &amp; Auto Scaling</h2>
            <p className="lead"><T pt="Amazon EC2 entrega servidores virtuais na nuvem. O Auto Scaling mantém a quantidade certa de instâncias para a sua carga." en="Amazon EC2 provides virtual servers in the cloud. Auto Scaling keeps the right number of instances for your load." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="disc" /> AMI</h4>
              <T pt="Amazon Machine Image: fornece o software para iniciar a instância e um mapeamento de dispositivos de bloco (os discos a anexar). É específica de Region, sistema operacional, arquitetura de processador, tipo de volume raiz e tipo de virtualização. Dá para copiar para outra Region e compartilhar com outras contas." en="Amazon Machine Image: provides the software to boot the instance and a block device mapping (the disks to attach). It is specific to Region, operating system, processor architecture, root volume type and virtualization type. You can copy it to another Region and share it with other accounts." />
            </div>
            <div className="card">
              <h4><Icon name="bolt" /> Instance type</h4>
              <T pt={<>Define o hardware (CPU, memória, armazenamento, rede). Os tipos são agrupados em famílias; os nomes seguem uma convenção (família, geração, processador, capacidades, tamanho). Há instâncias <i>burstable</i> (como a série T). Como o faturamento é por segundo, é barato testar vários tipos.</>} en={<>Defines the hardware (CPU, memory, storage, network). Types are grouped into families; names follow a convention (family, generation, processor, capabilities, size). There are <i>burstable</i> instances (such as the T series). Since billing is per second, testing several types is cheap.</>} />
            </div>
            <div className="card">
              <h4><Icon name="globe" /> Public IPv4</h4>
              <T pt={<>O IP público automático vem do pool da Amazon e <b>não</b> é seu: é liberado ao parar, hibernar ou encerrar, e a instância recebe outro ao iniciar de novo. Para um endereço fixo, use <a href="#eip">Elastic IP</a>. A AWS cobra por todo IPv4 público.</>} en={<>The automatic public IP comes from Amazon's pool and is <b>not</b> yours: it is released on stop, hibernate or terminate, and the instance gets a new one on start. For a fixed address use an <a href="#eip">Elastic IP</a>. AWS charges for every public IPv4 address.</>} />
            </div>
          </div>
          <h3>Snapshot vs. <T pt="Imagem" en="Image" /></h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Snapshot (EBS)</th>
                  <th><T pt="Imagem (AMI)" en="Image (AMI)" /></th>
                </tr>
                <tr>
                  <td><b><T pt="O que é" en="What it is" /></b></td>
                  <td><T pt={<>Cópia pontual (point-in-time) de um volume EBS, <b>incremental</b>: guarda só os blocos alterados desde o último snapshot.</>} en={<>A point-in-time copy of an EBS volume, <b>incremental</b>: it stores only the blocks changed since the last snapshot.</>} /></td>
                  <td><T pt="Software de boot + mapeamento de discos, usado para lançar instâncias." en="Boot software + disk mapping, used to launch instances." /></td>
                </tr>
                <tr>
                  <td><b><T pt="Uso" en="Use" /></b></td>
                  <td><T pt="Backup e restauração: cria um volume novo idêntico ao original no momento do snapshot." en="Backup and restore: creates a new volume identical to the original at snapshot time." /></td>
                  <td><T pt="Clonar a configuração de uma instância: lançar várias com a mesma base." en="Cloning an instance's setup: launch many from the same base." /></td>
                </tr>
                <tr>
                  <td><b><T pt="Onde fica" en="Where it lives" /></b></td>
                  <td><T pt="Em buckets do S3 que você não acessa diretamente; replicado entre as AZs da Region." en="In S3 buckets you cannot access directly; replicated across the Region's AZs." /></td>
                  <td><T pt="Dentro da Region; pode ser copiada e compartilhada." en="Within a Region; can be copied and shared." /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn"><strong><T pt="Pegadinhas" en="Gotchas" /></strong> <T pt={<>A AWS <b>não</b> faz backup automático dos volumes EBS: criar snapshots (ou automatizá-los com Data Lifecycle Manager ou AWS Backup) é responsabilidade sua. Como snapshots são incrementais, apagar um nem sempre reduz o custo de armazenamento.</>} en={<>AWS does <b>not</b> automatically back up EBS volumes: creating snapshots (or automating them with Data Lifecycle Manager or AWS Backup) is your responsibility. Because snapshots are incremental, deleting one does not always reduce storage cost.</>} /></Callout>
          <Callout tone="personal"><strong><T pt="Não verificado" en="Not verified" /></strong> <T pt={"A anotação antiga dizia que \"toda imagem contém um snapshot\" e que \"snapshot não cria instâncias\". As páginas lidas confirmam o papel de cada um, mas não essa relação exata; consulte a documentação de criação de AMIs antes de depender dela."} en={"The old note said \"every image contains a snapshot\" and \"a snapshot cannot launch instances\". The pages read confirm each one's role but not that exact relation; check the AMI creation docs before relying on it."} /></Callout>
          <h3>Launch Template</h3>
          <p><T pt={<>Especifica a configuração de uma instância: ID da AMI, tipo de instância, key pair, security groups e outros parâmetros. Tem <b>versões</b>: dá para manter uma base e criar versões novas (por exemplo, com a AMI da última versão da aplicação). A AWS recomenda launch templates em vez de launch configurations, que não suportam recursos como misturar Spot e On-Demand ou vários tipos de instância.</>} en={<>Specifies an instance's configuration: AMI ID, instance type, key pair, security groups and other parameters. It has <b>versions</b>: you can keep a base and create new versions (for example with the AMI of the latest app version). AWS recommends launch templates over launch configurations, which lack features such as mixing Spot and On-Demand or multiple instance types.</>} /></p>
          <h3>Auto Scaling Group (ASG)</h3>
          <p><T pt="Coleção de instâncias tratada como uma unidade. Você define:" en="A collection of instances treated as one unit. You define:" /></p>
          <ol>
            <li><b>Minimum size:</b> <T pt="o grupo nunca fica abaixo disso." en="the group never goes below it." /></li>
            <li><b>Maximum size:</b> <T pt="o grupo nunca passa disso." en="the group never exceeds it." /></li>
            <li><b>Desired capacity:</b> <T pt="quantas instâncias você quer rodando agora (dentro do mínimo e máximo)." en="how many instances you want running now (within the min and max)." /></li>
          </ol>
          <Callout tone="good"><strong><T pt="Substituição automática de instâncias" en="Automatic instance replacement" /></strong> <T pt={<>O ASG monitora a saúde das instâncias (health checks do EC2, e opcionalmente os do load balancer ou checks próprios) e substitui as encerradas ou comprometidas para manter a capacidade desejada. Ele também distribui as instâncias entre as zonas de disponibilidade e registra/remove instâncias do <a href="#elb">load balancer</a> automaticamente.</>} en={<>The ASG monitors instance health (EC2 health checks, and optionally the load balancer's or custom checks) and replaces terminated or impaired instances to keep the desired capacity. It also spreads instances across Availability Zones and registers/deregisters instances with the <a href="#elb">load balancer</a> automatically.</>} /></Callout>
          <p className="muted"><T pt="Não há cobrança adicional pelo Auto Scaling; você paga pelos recursos usados (instâncias, volumes EBS, alarmes do CloudWatch)." en="There is no additional charge for Auto Scaling; you pay for the resources used (instances, EBS volumes, CloudWatch alarms)." /></p>
          <h3>Scaling policies</h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="target" /> Target tracking</h4>
              <T pt="Escolhe uma métrica e um valor-alvo, como um termostato. Recomendada pela AWS; use métricas que variem de forma inversamente proporcional à capacidade (CPU média, requisições por target). O Auto Scaling cria os alarmes do CloudWatch por você." en="Pick a metric and a target value, like a thermostat. Recommended by AWS; use metrics that move inversely with capacity (average CPU, request count per target). Auto Scaling creates the CloudWatch alarms for you." />
            </div>
            <div className="card">
              <h4><Icon name="steps" /> Step / simple</h4>
              <T pt="Ajustes por faixa de violação do alarme (step) ou um único ajuste com cooldown (simple). Cuidado ao combinar com target tracking: conflitos podem causar comportamento indesejado." en="Adjustments by alarm-breach size (step) or one adjustment with a cooldown (simple). Be careful combining with target tracking: conflicts can cause unwanted behavior." />
            </div>
            <div className="card">
              <h4><Icon name="calendar" /> Scheduled</h4>
              <T pt="Ações agendadas mudam a capacidade em horários definidos (única ou recorrente, com cron e fuso horário). Bom para picos previsíveis." en="Scheduled actions change capacity at set times (one-off or recurring, with cron and time zone). Good for predictable peaks." />
            </div>
            <div className="card">
              <h4><Icon name="sparkle" /> Predictive</h4>
              <T pt="Analisa a carga histórica para achar padrões diários ou semanais e prever a demanda, lançando capacidade antes do pico. Indicado para tráfego cíclico e aplicações lentas para iniciar." en="Analyzes historical load to detect daily or weekly patterns and forecast demand, launching capacity ahead of the peak. Suited to cyclical traffic and slow-starting apps." />
            </div>
          </div>
          <p className="muted"><T pt="Sempre dentro do mínimo e do máximo do grupo. Se mais de uma política pedir mudança ao mesmo tempo, prevalece a que resulta em mais capacidade." en="Always within the group's min and max. If more than one policy asks for a change at once, the one giving the most capacity wins." /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Aplicação com carga variável ou que precisa se recuperar sozinha de falhas; servidores idênticos atrás de um load balancer." en="Apps with variable load or that must self-heal from failures; identical servers behind a load balancer." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Servidor único com estado em disco local, sem automação de configuração; quando containers no <a href="#ecs">ECS</a> já resolvem o problema.</>} en={<>A single server with state on local disk and no configuration automation; when containers on <a href="#ecs">ECS</a> already solve the problem.</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O IP público automático de uma instância continua o mesmo depois de parar e iniciar?" en="Does an instance's automatic public IP stay the same after stop and start?" /></summary>
            <div className="ans"><T pt="Não. Ele é liberado ao parar e um novo é atribuído ao iniciar. Use Elastic IP para um endereço fixo." en="No. It is released on stop and a new one is assigned on start. Use an Elastic IP for a fixed address." /></div>
          </details>
          <details className="fc">
            <summary><T pt="O que o ASG faz com uma instância comprometida?" en="What does the ASG do with an impaired instance?" /></summary>
            <div className="ans"><T pt="Substitui, para manter a capacidade desejada." en="Replaces it to keep the desired capacity." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html" rel="noopener">Amazon EC2 instance types</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html" rel="noopener">Amazon Machine Images in Amazon EC2</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html" rel="noopener">Amazon EC2 instance IP addressing</a></li>
              <li><a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html" rel="noopener">Amazon EBS snapshots</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html" rel="noopener">What is Amazon EC2 Auto Scaling?</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html" rel="noopener">Auto Scaling launch templates</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html" rel="noopener">Dynamic scaling</a> · <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html" rel="noopener">Scheduled scaling</a> · <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html" rel="noopener">Predictive scaling</a></li>
            </ul>
            <p><T pt={<><b>Corrigido:</b> a anotação antiga citava "t4.micro" como família; a documentação lida lista a série <code>T4g</code> (e <code>T3</code>), então os exemplos de tipos foram removidos. Valores como "launch template é gratuito" e o "CPU ou memória" no target tracking também saíram por falta de suporte nas páginas lidas.</>} en={<><b>Corrected:</b> the old note cited "t4.micro" as a family; the docs read list the <code>T4g</code> series (and <code>T3</code>), so type examples were removed. Claims like "launch templates are free" and "CPU or memory" for target tracking also left for lack of support in the pages read.</>} /></p>
          </Sources>
        </section>
        {/* ============ SSH ============ */}
        <section className="topic" id="ssh">
          <header>
            <span className="tag"><T pt="Computação · 10" en="Compute · 10" /></span>
            <h2>SSH (Secure Shell)</h2>
            <p className="lead"><T pt="Forma clássica de abrir um terminal remoto em uma instância EC2 Linux, usando um par de chaves." en="The classic way to open a remote terminal on a Linux EC2 instance, using a key pair." /></p>
          </header>
          <h3><T pt="Pré-requisitos segundo a documentação da EC2" en="Prerequisites per the EC2 docs" /></h3>
          <ul>
            <li><T pt="A instância passou nas status checks (pode levar alguns minutos)." en="The instance passed its status checks (it can take a few minutes)." /></li>
            <li><T pt={<>Você tem a chave privada (<code>.pem</code>) do key pair e as permissões do arquivo configuradas (a página de pré-requisitos da EC2 detalha isso).</>} en={<>You have the key pair's private key (<code>.pem</code>) with file permissions set (the EC2 prerequisites page explains this).</>} /></li>
            <li><T pt={<>O <a href="#sg">Security Group</a> da instância libera SSH (porta 22) <b>só do seu IP</b>. Abrir 22 para <code>0.0.0.0/0</code> deixa qualquer um tentar entrar.</>} en={<>The instance's <a href="#sg">Security Group</a> allows SSH (port 22) <b>only from your IP</b>. Opening 22 to <code>0.0.0.0/0</code> lets anyone try.</>} /></li>
          </ul>
          <h3><T pt="Conectar" en="Connect" /></h3>
          <CodeBlock code={`ssh -i /caminho/minha-chave.pem usuario-da-instancia@dns-publico-da-instancia`} />
          <p><T pt="No primeiro acesso, o SSH mostra a impressão digital (fingerprint) do servidor. A documentação sugere conferi-la com a da instância: se não bater, pode ser um ataque man-in-the-middle." en="On first connection SSH shows the server fingerprint. The docs suggest checking it against the instance's: if it does not match, it may be a man-in-the-middle attack." /></p>
          <Callout tone="good"><strong><T pt="Alternativa sem porta 22" en="Alternative without port 22" /></strong> <T pt={<>O Session Manager (Systems Manager) permite acessar nós sem abrir portas de entrada, sem bastion host e sem chaves SSH. Veja <a href="#ssm">Systems Manager</a>.</>} en={<>Session Manager (Systems Manager) lets you access nodes with no inbound ports, no bastion hosts and no SSH keys. See <a href="#ssm">Systems Manager</a>.</>} /></Callout>
          <Callout tone="personal"><strong><T pt="Nota pessoal · sem fonte oficial da AWS" en="Personal note · no official AWS source" /></strong> <T pt={<>As explicações abaixo (handshake e camadas TCP/IP) são conteúdo didático geral sobre o protocolo SSH, mantido das anotações originais. Elas não vêm da documentação da AWS e não foram verificadas nela. Também ficaram como nota pessoal: <code>chmod 400</code> na chave e o usuário padrão <code>ec2-user</code> no Amazon Linux.</>} en={<>The explanations below (handshake and TCP/IP layers) are general teaching content about the SSH protocol, kept from the original notes. They do not come from AWS documentation and were not verified there. Also left as personal notes: <code>chmod 400</code> on the key and the default <code>ec2-user</code> on Amazon Linux.</>} /></Callout>
          <h3><T pt="Handshake passo a passo" en="Handshake step by step" /></h3>
          <div className="widget" data-stepper="">
            <div className="wtitle"><T pt="Animação" en="Animation" /></div>
            <div className="stage">
              <div className="line"></div>
              <span className="node c"><Icon name="client" /> Client</span> <span className="node s"><Icon name="server" /> Server</span>
              <div className="dot"></div>
            </div>
            <ol className="steps">
              <li data-dir="s2c"><T pt={"O servidor envia sua chave pública de host (a \"impressão digital\" dele)."} en={"The server sends its public host key (its \"fingerprint\")."} /></li>
              <li data-dir="none"><T pt="O cliente verifica se conhece essa chave, sabendo quem é o outro lado." en="The client checks whether it knows that key, knowing who is on the other side." /></li>
              <li data-dir="both" data-enc="1"><T pt="Ambos geram um segredo compartilhado pela matemática, sem transmiti-lo. O canal passa a ser criptografado." en="Both derive a shared secret through math, without ever sending it. The channel is now encrypted." /></li>
              <li data-dir="c2s" data-enc="1"><T pt="O cliente envia o usuário e sua chave pública (ou senha)." en="The client sends the username and its public key (or password)." /></li>
              <li data-dir="s2c" data-enc="1"><T pt="O servidor reconhece a chave e envia um desafio: uma mensagem aleatória trancada com a chave pública do cliente." en="The server recognizes the key and sends a challenge: a random message locked with the client's public key." /></li>
              <li data-dir="none" data-enc="1"><T pt="O cliente destranca a mensagem com a chave privada (só ela consegue) e a assina." en="The client unlocks the message with its private key (only it can) and signs it." /></li>
              <li data-dir="c2s" data-enc="1"><T pt="A assinatura volta ao servidor, provando a posse da chave privada." en="The signature goes back to the server, proving possession of the private key." /></li>
              <li data-dir="s2c" data-enc="1"><T pt="O servidor confirma e libera o terminal. Agora é possível executar comandos com segurança." en="The server confirms and opens the terminal. Now you can run commands securely." /></li>
            </ol>
            <div className="row"> <button className="btn prev">◀</button><button className="btn primary next"><T pt="Próximo" en="Next" /> ▶</button><button className="btn play">▶▶ Auto</button> </div>
          </div>
          <h3><T pt="Protocolos e TCP/IP" en="Protocols and TCP/IP" /></h3>
          <p><T pt={<>Um protocolo é um contrato: regras de como os dados são formatados, transmitidos e recebidos. O SSH é da camada de <b>Aplicação</b> e roda sobre TCP/IP.</>} en={<>A protocol is a contract: rules for how data is formatted, sent and received. SSH is an <b>Application</b>-layer protocol running on top of TCP/IP.</>} /></p>
          <table>
            <tbody>
              <tr>
                <th><T pt="Camada" en="Layer" /></th>
                <th><T pt="Função" en="Role" /></th>
              </tr>
              <tr>
                <td>4 · <T pt="Aplicação" en="Application" /></td>
                <td><T pt="Onde os programas trabalham: SSH, SMTP, HTTP." en="Where programs work: SSH, SMTP, HTTP." /></td>
              </tr>
              <tr>
                <td>3 · <T pt="Transporte (TCP)" en="Transport (TCP)" /></td>
                <td><T pt="Abre a conexão e garante que todos os pedaços cheguem sem erros." en="Opens the connection and ensures every piece arrives without errors." /></td>
              </tr>
              <tr>
                <td>2 · <T pt="Internet (IP)" en="Internet (IP)" /></td>
                <td><T pt="Endereçamento: garante que os pacotes cheguem ao destino." en="Addressing: ensures packets reach their destination." /></td>
              </tr>
              <tr>
                <td>1 · Link</td>
                <td><T pt="Meio físico: cabos ethernet, wi-fi." en="Physical medium: ethernet cables, wi-fi." /></td>
              </tr>
            </tbody>
          </table>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Depuração pontual em instâncias de teste, com porta 22 restrita ao seu IP." en="Occasional debugging on test instances, with port 22 limited to your IP." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Porta 22 aberta para a internet; acesso rotineiro em produção (prefira Session Manager)." en="Port 22 open to the internet; routine production access (prefer Session Manager)." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="De onde deve vir o tráfego SSH liberado no Security Group?" en="Where should the SSH traffic allowed in the Security Group come from?" /></summary>
            <div className="ans"><T pt={<>Do seu IP (ou faixa) específico, nunca de <code>0.0.0.0/0</code>.</>} en={<>From your specific IP (or range), never <code>0.0.0.0/0</code>.</>} /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "Connect to your Linux instance using an SSH client", href: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html" },
              { label: "AWS Systems Manager Session Manager", href: "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" },
              { label: "Security groups: best practices (portas 22/3389)", href: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" },
            ]}
          />
        </section>
        {/* ============ EIP ============ */}
        <section className="topic" id="eip">
          <header>
            <span className="tag"><T pt="Computação · 11" en="Compute · 11" /></span>
            <h2><T pt="IPs Elásticos" en="Elastic IPs" /></h2>
            <p className="lead"><T pt="Um endereço IPv4 público e estático, pensado para a computação em nuvem dinâmica." en="A static public IPv4 address designed for dynamic cloud computing." /></p>
          </header>
          <p><T pt={"O Elastic IP é alocado à sua conta e é seu até você liberá-lo. Você pode \"mascarar\" a falha de uma instância remapeando o endereço para outra instância da conta, ou usá-lo em um registro DNS do seu domínio."} en="An Elastic IP is allocated to your account and stays yours until you release it. You can mask an instance failure by remapping the address to another instance in your account, or use it in a DNS record for your domain." /></p>
          <div className="flow"> <span className="node"><Icon name="server" /> EC2 A <Icon name="x" /></span><span className="arrow">⇢</span><span className="node"><Icon name="pin" /> Elastic IP</span><span className="arrow">⇢</span><span className="node"><Icon name="server" /> EC2 B <Icon name="check" /></span> </div>
          <ul>
            <li><T pt="É específico de uma Region e não pode ser movido para outra. Não há Elastic IP para IPv6." en="It is specific to one Region and cannot be moved to another. There are no Elastic IPs for IPv6." /></li>
            <li><T pt="Ao associar um Elastic IP a uma instância que já tinha IP público automático, esse IP automático é liberado e não pode ser reaproveitado." en="When you associate an Elastic IP with an instance that had an automatic public IP, that automatic IP is released and cannot be reused." /></li>
            <li><T pt="Um Elastic IP desassociado continua alocado (e cobrado) até você liberá-lo." en="A disassociated Elastic IP stays allocated (and billed) until you release it." /></li>
            <li><T pt="Há uma cota padrão de Elastic IPs por Region, que pode ser aumentada no Service Quotas. Consulte a página oficial para o valor atual." en="There is a default quota of Elastic IPs per Region, which can be raised in Service Quotas. See the official page for the current value." /></li>
          </ul>
          <Callout tone="warn"><strong><T pt="Custo" en="Cost" /></strong> <T pt={<>A AWS cobra por <b>todos</b> os endereços IPv4 públicos, estejam em uso ou ociosos, incluindo os de instâncias em execução. Os valores estão na aba "Public IPv4 Address" da <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">página de preços da VPC</a>. A anotação antiga dizia que o IP era grátis enquanto associado, o que contradiz a documentação atual.</>} en={<>AWS charges for <b>all</b> public IPv4 addresses, in use or idle, including those on running instances. Values are on the "Public IPv4 Address" tab of the <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">VPC pricing page</a>. The old note said it was free while associated, which contradicts the current docs.</>} /></Callout>
          <p><T pt={"A documentação ainda sugere reduzir o número de IPv4 públicos usando um load balancer na frente das instâncias, desligando o \"auto-assign public IP\" onde não for preciso."} en={"The docs also suggest reducing the number of public IPv4 addresses by putting a load balancer in front of the instances and turning off \"auto-assign public IP\" where not needed."} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Endereço fixo que precisa sobreviver à troca de instância e que alguém registra (DNS, allowlist de um parceiro)." en="A fixed address that must survive an instance swap and that someone registers (DNS, a partner's allowlist)." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Quando um load balancer com nome DNS (<a href="#route53">Alias</a>) resolve; e o IP não deve ficar ocioso, pois é cobrado.</>} en={<>When a load balancer with a DNS name (<a href="#route53">Alias</a>) solves it; and do not leave it idle, since it is billed.</>} />
            </div>
          </div>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "Elastic IP addresses", href: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html" },
              { label: "Amazon EC2 instance IP addressing", href: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html" },
              { label: "What is Amazon VPC? (seção de preços de IPv4 público)", href: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
            ]}
          />
        </section>
        {/* ============ ECR ============ */}
        <section className="topic" id="ecr">
          <header>
            <span className="tag"><T pt="Computação · 12" en="Compute · 12" /></span>
            <h2>ECR</h2>
            <p className="lead"><T pt="Elastic Container Registry: registro gerenciado de imagens de container (Docker, OCI) dentro da AWS, com permissões via IAM." en="Elastic Container Registry: a managed registry for container images (Docker, OCI) inside AWS, with permissions through IAM." /></p>
          </header>
          <p className="muted"><T pt={<>Para enviar a imagem automaticamente a cada push, com um repositório por conta e tags imutáveis, veja <a href="/notas/github-aws-oidc/#ecr">GitHub para AWS, etapa 6</a>.</>} en={<>To push the image automatically on every push, with one repository per account and immutable tags, see <a href="/notas/github-aws-oidc/#ecr">GitHub to AWS, step 6</a>.</>} /></p>
          <div className="flow"> <span className="node"><Icon name="gear" /> CI <T pt="(build)" en="(build)" /></span><span className="arrow">push →</span> <span className="node"><Icon name="box" /> ECR <T pt="(conta tooling)" en="(tooling account)" /></span><span className="arrow">← pull</span> <span className="node"><Icon name="server" /> ECS / EKS / EC2 <T pt="(staging, prod)" en="(staging, prod)" /></span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="folder" /> Repository</h4>
              <T pt={<>Repositório privado com permissões baseadas em recurso. Ele precisa existir antes do push, ou você precisa de um <i>repository creation template</i>.</>} en={<>A private repository with resource-based permissions. It must exist before the push, or you need a <i>repository creation template</i>.</>} />
            </div>
            <div className="card">
              <h4><Icon name="key" /> Auth</h4>
              <T pt={<>O token de autenticação vale <b>12 horas</b> e é por registry. No <code>docker login</code> o usuário é <code>AWS</code>. A identidade precisa da permissão <code>ecr:GetAuthorizationToken</code> via política IAM.</>} en={<>The authentication token is valid for <b>12 hours</b> and is per registry. In <code>docker login</code> the user is <code>AWS</code>. The identity needs <code>ecr:GetAuthorizationToken</code> via an IAM policy.</>} />
            </div>
            <div className="card">
              <h4><Icon name="briefcase" /> <T pt="Recursos" en="Features" /></h4>
              <T pt="Lifecycle policies (limpeza de imagens), scan de vulnerabilidades no push, replicação entre Regions e contas, pull through cache e assinatura gerenciada." en="Lifecycle policies (image cleanup), vulnerability scan on push, replication across Regions and accounts, pull through cache and managed signing." />
            </div>
          </div>
          <h3><T pt="Push passo a passo" en="Push step by step" /></h3>
          <CodeBlock code={`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com
docker tag minha-app:1.4.2 111122223333.dkr.ecr.us-east-1.amazonaws.com/minha-app:1.4.2
docker push 111122223333.dkr.ecr.us-east-1.amazonaws.com/minha-app:1.4.2`} />
          <p className="muted"><T pt={<>Se você omitir a tag no <code>docker tag</code>, a tag assumida é <code>latest</code>.</>} en={<>If you omit the tag in <code>docker tag</code>, the assumed tag is <code>latest</code>.</>} /></p>
          <h3><T pt="Acesso entre contas (repository policy)" en="Cross-account access (repository policy)" /></h3>
          <p><T pt={<>Para a conta de tooling guardar as imagens e as contas de staging e produção baixarem, anexe uma <b>repository policy</b> ao repositório. Exemplo de pull para uma conta (placeholder no lugar do ID real):</>} en={<>For the tooling account to hold the images and the staging and production accounts to pull them, attach a <b>repository policy</b> to the repository. Example pull access for one account (placeholder instead of the real ID):</>} /></p>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPullFromProd",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::<ID_CONTA_PROD>:root" },
      "Action": [
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ]
    }
  ]
}`} />
          <ul>
            <li><T pt={<>O ECR exige que quem autentica tenha <code>ecr:GetAuthorizationToken</code> por política IAM antes de qualquer push ou pull. Essa permissão não vem da repository policy.</>} en={<>ECR requires the caller to have <code>ecr:GetAuthorizationToken</code> through an IAM policy before any push or pull. That permission does not come from the repository policy.</>} /></li>
            <li><T pt="A conta que recebe a permissão precisa ter a Region do repositório habilitada, senão a criação da policy dá erro." en="The account being granted access must have the repository's Region enabled, otherwise creating the policy fails." /></li>
            <li><T pt={<>Para ações de push, a documentação inclui também <code>BatchCheckLayerAvailability</code>, <code>InitiateLayerUpload</code>, <code>UploadLayerPart</code>, <code>CompleteLayerUpload</code> e <code>PutImage</code>.</>} en={<>For push, the docs also include <code>BatchCheckLayerAvailability</code>, <code>InitiateLayerUpload</code>, <code>UploadLayerPart</code>, <code>CompleteLayerUpload</code> and <code>PutImage</code>.</>} /></li>
          </ul>
          <h3><T pt="Tags e digests" en="Tags and digests" /></h3>
          <ul>
            <li><T pt={<><b>Tag mutável</b>: o mesmo nome de tag pode ser sobrescrito por um novo push. Com <b>tag immutability</b> ligada, repetir uma tag retorna <code>ImageTagAlreadyExistsException</code>. A imutabilidade vale para todas as tags (com filtros de exceção opcionais).</>} en={<><b>Mutable tags</b>: the same tag name can be overwritten by a new push. With <b>tag immutability</b> on, reusing a tag returns <code>ImageTagAlreadyExistsException</code>. Immutability covers all tags (with optional exclusion filters).</>} /></li>
            <li><T pt={<>O ECS, por padrão, resolve a tag da task definition para o <b>digest</b> da imagem no momento do deploy e usa o digest nas demais tarefas, para que todas rodem exatamente a mesma imagem. Veja <a href="#ecs">ECS</a>.</>} en={<>By default ECS resolves the task definition's tag to the image <b>digest</b> at deploy time and uses the digest for the other tasks, so all of them run exactly the same image. See <a href="#ecs">ECS</a>.</>} /></li>
          </ul>
          <Callout tone="personal"><strong><T pt="Nota pessoal · sem fonte oficial nesta rodada" en="Personal note · no official source this round" /></strong> <T pt={<>Boa prática de projeto: usar tags que identifiquem a versão (por exemplo, o hash do commit) em vez de <code>latest</code>. A ideia combina com a tag immutability, mas a recomendação em si não foi lida na documentação.</>} en={<>A design habit: use tags that identify the version (for example the commit hash) instead of <code>latest</code>. It pairs well with tag immutability, but the recommendation itself was not read in the docs.</>} /></Callout>
          <Callout><strong><T pt="Custos" en="Costs" /></strong> <T pt={<>Você paga pelos dados armazenados, pela transferência nos pushes e pulls e por ações opcionais (assinatura, replicação). Valores: <a href="https://aws.amazon.com/ecr/pricing/" rel="noopener">página de preços do ECR</a>. Os números da anotação antiga foram removidos.</>} en={<>You pay for data stored, data transfer on pushes and pulls, and optional actions (signing, replication). Values: <a href="https://aws.amazon.com/ecr/pricing/" rel="noopener">ECR pricing page</a>. The numbers in the old note were removed.</>} /></Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Imagens que rodam em ECS, EKS ou EC2 na AWS; repositório central em uma conta de tooling compartilhado entre ambientes." en="Images that run on ECS, EKS or EC2 in AWS; a central repository in a tooling account shared across environments." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Repository policy com <code>Principal: "*"</code> sem condição; tags mutáveis em produção quando você precisa saber exatamente qual imagem rodou; acumular imagens sem lifecycle policy.</>} en={<>A repository policy with <code>Principal: "*"</code> and no condition; mutable tags in production when you must know exactly which image ran; piling up images with no lifecycle policy.</>} />
            </div>
          </div>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "What is Amazon Elastic Container Registry?", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html" },
              { label: "Pushing a Docker image to an Amazon ECR private repository", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html" },
              { label: "Private repository policy examples in Amazon ECR", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html" },
              { label: "Preventing image tags from being overwritten", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" },
              { label: "ECS: Deploy services by replacing tasks (resolução de digest)", href: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html" },
            ]}
          />
        </section>
        {/* ============ ECS ============ */}
        <section className="topic" id="ecs">
          <header>
            <span className="tag"><T pt="Computação · 13" en="Compute · 13" /></span>
            <h2>ECS</h2>
            <p className="lead"><T pt="Amazon Elastic Container Service: orquestrador totalmente gerenciado para implantar, gerenciar e escalar aplicações em containers." en="Amazon Elastic Container Service: a fully managed orchestrator to deploy, manage and scale containerized applications." /></p>
          </header>
          <p className="muted"><T pt={<>Para disparar o deploy a cada push em <code>develop</code> ou <code>main</code>, veja <a href="/notas/github-aws-oidc/#workflow">GitHub para AWS, etapa 8</a>.</>} en={<>To trigger the deploy on every push to <code>develop</code> or <code>main</code>, see <a href="/notas/github-aws-oidc/#workflow">GitHub to AWS, step 8</a>.</>} /></p>
          <p className="muted"><T pt={<>Nunca criou um cluster, task definition e service? O roteiro completo, da VPC privada ao SSL até o RDS, está em <a href="/notas/ecs-todo-app/">ECS do zero: um app de to-do</a>.</>} en={<>Never created a cluster, task definition and service? The full walkthrough, from the private VPC to SSL all the way to RDS, is in <a href="/notas/ecs-todo-app/">ECS from zero: a to-do app</a>.</>} /></p>
          <div className="flow"> <span className="node"><Icon name="box" /> ECR</span><span className="arrow">→</span> <span className="node"><Icon name="doc" /> Task definition</span><span className="arrow">→</span> <span className="node"><Icon name="grid" /> Service</span><span className="arrow">→</span> <span className="node"><Icon name="play" /> Tasks <T pt="no cluster" en="in the cluster" /></span><span className="arrow">←</span> <span className="node"><Icon name="balance" /> ALB</span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="doc" /> Task definition</h4>
              <T pt={"O \"projeto\" da aplicação: quais containers rodam e como."} en={"The application's \"blueprint\": which containers run and how."} />
            </div>
            <div className="card">
              <h4><Icon name="layers" /> Cluster</h4>
              <T pt="A infraestrutura onde a aplicação roda." en="The infrastructure the application runs on." />
            </div>
            <div className="card">
              <h4><Icon name="play" /> Task</h4>
              <T pt="Uma execução da aplicação, como um job em lote que trabalha e termina." en="One run of the application, like a batch job that works and stops." />
            </div>
            <div className="card">
              <h4><Icon name="grid" /> Service</h4>
              <T pt="Aplicação de longa duração e sem estado: o ECS mantém o número desejado de tasks rodando e faz os deploys." en="A long-running stateless application: ECS keeps the desired number of tasks running and performs deployments." />
            </div>
          </div>
          <p><T pt={<><b>Capacidade</b> (onde os containers rodam): Fargate (serverless, sem gerenciar servidores), instâncias EC2 que você gerencia, ECS Managed Instances (EC2 com a infraestrutura gerenciada pela AWS) ou servidores externos com ECS Anywhere. O custo depende da capacidade escolhida; veja as páginas de preços do ECS e do Fargate.</>} en={<><b>Capacity</b> (where containers run): Fargate (serverless, no servers to manage), EC2 instances you manage, ECS Managed Instances (EC2 with AWS-managed infrastructure) or external servers with ECS Anywhere. Cost depends on the chosen capacity; see the ECS and Fargate pricing pages.</>} /></p>
          <h3><T pt="Deploy com rolling update" en="Rolling update deployment" /></h3>
          <p><T pt={<>No tipo de deploy <i>rolling update</i>, o scheduler do ECS substitui as tasks em execução por tasks novas. Dois parâmetros do serviço controlam o ritmo:</>} en={<>With the <i>rolling update</i> deployment type, the ECS scheduler replaces running tasks with new ones. Two service parameters control the pace:</>} /></p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Parâmetro" en="Parameter" /></th>
                  <th><T pt="Significado" en="Meaning" /></th>
                  <th><T pt="Exemplo da documentação" en="Docs example" /></th>
                </tr>
                <tr>
                  <td><code>minimumHealthyPercent</code></td>
                  <td><T pt="Mínimo de tasks saudáveis durante o deploy, em % do desejado (arredonda para cima)." en="Minimum healthy tasks during the deployment, as a % of desired (rounded up)." /></td>
                  <td><T pt="50% com 4 tasks: pode parar 2 antes de iniciar 2 novas." en="50% with 4 tasks: it can stop 2 before starting 2 new ones." /></td>
                </tr>
                <tr>
                  <td><code>maximumPercent</code></td>
                  <td><T pt="Máximo de tasks em execução durante o deploy, em % do desejado (arredonda para baixo)." en="Maximum running tasks during the deployment, as a % of desired (rounded down)." /></td>
                  <td><T pt="200% com 4 tasks: pode iniciar 4 novas antes de parar as 4 antigas." en="200% with 4 tasks: it can start 4 new ones before stopping the 4 old ones." /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li><T pt={<>Garanta que o scheduler consiga parar ou iniciar <b>pelo menos uma</b> task no deploy. Com 75% mínimo e 2 tasks, nada pode ser parado e o deploy trava.</>} en={<>Make sure the scheduler can stop or start <b>at least one</b> task during a deployment. With 75% minimum and 2 tasks, nothing can be stopped and the deployment gets stuck.</>} /></li>
            <li><T pt={<>Para detectar falha rápido, use o <b>deployment circuit breaker</b> (falha quando as tasks não conseguem iniciar) e/ou <b>alarmes do CloudWatch</b> (falha por métricas da aplicação). Ambos suportam <b>rollback</b> para a revisão anterior do serviço.</>} en={<>To detect failure fast, use the <b>deployment circuit breaker</b> (fails when tasks cannot start) and/or <b>CloudWatch alarms</b> (fails on application metrics). Both support <b>rollback</b> to the previous service revision.</>} /></li>
            <li><T pt={<>O ECS resolve a tag da imagem para o <b>digest</b> no início do deploy e usa o digest nas outras tasks, garantindo a mesma imagem em todas. Para pegar um digest atualizado, force um novo deploy (<code>forceNewDeployment</code>).</>} en={<>ECS resolves the image tag to the <b>digest</b> at the start of the deployment and uses the digest for the other tasks, ensuring the same image everywhere. To pick up an updated digest, force a new deployment (<code>forceNewDeployment</code>).</>} /></li>
            <li><T pt={<>Variáveis de ambiente vindas do Parameter Store são resolvidas quando a task inicia: uma task em execução só vê o valor novo após um novo deploy. Veja <a href="#ssm">Systems Manager</a> e <a href="#secrets">Secrets Manager</a>.</>} en={<>Environment variables from Parameter Store are resolved when the task starts: a running task only sees the new value after a new deployment. See <a href="#ssm">Systems Manager</a> and <a href="#secrets">Secrets Manager</a>.</>} /></li>
          </ul>
          <CodeBlock code={`aws ecs update-service --cluster meu-cluster --service minha-api --force-new-deployment`} />
          <h3><T pt="Com o load balancer" en="With the load balancer" /></h3>
          <p><T pt={<>O ALB consegue registrar tasks do ECS em um target group, inclusive escolhendo uma porta livre quando a task é agendada. Os health checks do target group definem se a task está saudável. Veja <a href="#elb">Load Balancer</a>.</>} en={<>The ALB can register ECS tasks in a target group, even choosing an unused port when the task is scheduled. The target group's health checks decide whether a task is healthy. See <a href="#elb">Load Balancer</a>.</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Aplicações em containers que precisam de deploy repetível, rollback e escala sem operar um plano de controle próprio." en="Containerized apps needing repeatable deploys, rollback and scaling without running your own control plane." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Cargas que não são containers; <code>minimumHealthyPercent</code>/<code>maximumPercent</code> que impedem qualquer substituição; esperar que um valor mudado no Parameter Store apareça em tasks já rodando.</>} en={<>Non-container workloads; <code>minimumHealthyPercent</code>/<code>maximumPercent</code> values that block any replacement; expecting a changed Parameter Store value to show up in running tasks.</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Qual a diferença entre task e service?" en="What is the difference between a task and a service?" /></summary>
            <div className="ans"><T pt="Task é uma execução (pode terminar). Service mantém um número desejado de tasks rodando continuamente." en="A task is one run (it may stop). A service keeps a desired number of tasks running continuously." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Como garantir que um deploy com problema volte sozinho?" en="How do you make a bad deployment roll back by itself?" /></summary>
            <div className="ans"><T pt="Habilite o circuit breaker e/ou alarmes do CloudWatch com rollback." en="Enable the circuit breaker and/or CloudWatch alarms with rollback." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}
            links={[
              { label: "What is Amazon Elastic Container Service?", href: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html" },
              { label: "Deploy Amazon ECS services by replacing tasks", href: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html" },
              { label: "ALB: What is an Application Load Balancer? (integração com ECS)", href: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" },
              { label: "Parameter Store (variáveis resolvidas na inicialização da task)", href: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" },
            ]}
          />
        </section>
        {/* ============ SSM ============ */}
        <section className="topic" id="ssm">
          <header>
            <span className="tag"><T pt="Segredos e acesso · 14" en="Secrets &amp; access · 14" /></span>
            <h2>Systems Manager</h2>
            <p className="lead"><T pt="Duas ferramentas do AWS Systems Manager muito usadas no dia a dia: o Session Manager (acesso a servidores sem SSH) e o Parameter Store (configuração centralizada)." en="Two AWS Systems Manager tools used every day: Session Manager (server access without SSH) and Parameter Store (centralized configuration)." /></p>
          </header>
          <h3>Session Manager</h3>
          <p><T pt={<>Ferramenta totalmente gerenciada para acessar instâncias EC2 (e servidores on-premises/VMs) por um shell interativo no navegador ou pela AWS CLI, <b>sem abrir portas de entrada, sem bastion host e sem gerenciar chaves SSH</b>.</>} en={<>A fully managed tool to reach EC2 instances (and on-premises servers/VMs) through an interactive shell in the browser or the AWS CLI, <b>with no inbound ports, no bastion hosts and no SSH keys to manage</b>.</>} /></p>
          <div className="flow"> <span className="node"><Icon name="user" /> <T pt="Você (IAM / SSO)" en="You (IAM / SSO)" /></span><span className="arrow">TLS 1.2 →</span> <span className="node"><Icon name="terminal" /> Session Manager</span><span className="arrow">→</span> <span className="node"><Icon name="chip" /> SSM Agent</span><span className="arrow">→</span> <span className="node"><Icon name="server" /> <T pt="Instância (subnet privada)" en="Instance (private subnet)" /></span> </div>
          <ul>
            <li><T pt={<><b>Controle por IAM:</b> as políticas definem quem pode abrir sessões e em quais nós; dá para conceder acesso temporário (ex.: plantão).</>} en={<><b>IAM control:</b> policies define who can open sessions and on which nodes; you can grant temporary access (e.g. on-call).</>} /></li>
            <li><T pt={<><b>Sem IP público:</b> com VPC endpoints (AWS PrivateLink) do Systems Manager, o tráfego fica na rede da AWS. Veja <a href="#vpc">VPC endpoints</a>.</>} en={<><b>No public IP:</b> with Systems Manager VPC endpoints (AWS PrivateLink), traffic stays on the AWS network. See <a href="#vpc">VPC endpoints</a>.</>} /></li>
            <li><T pt={<><b>Port forwarding:</b> redireciona uma porta da instância para uma porta local (útil para acessar um banco privado).</>} en={<><b>Port forwarding:</b> redirects an instance port to a local port (handy for reaching a private database).</>} /></li>
            <li><T pt={<><b>Auditoria:</b> integra com CloudTrail, S3, CloudWatch Logs e EventBridge/SNS. Sessões de port forwarding ou SSH <b>não</b> têm log do conteúdo.</>} en={<><b>Auditing:</b> integrates with CloudTrail, S3, CloudWatch Logs and EventBridge/SNS. Port-forwarding or SSH sessions get <b>no</b> content logging.</>} /></li>
            <li><T pt={<><b>Pré-requisitos:</b> o nó precisa ser gerenciado pelo Systems Manager (SSM Agent e permissões IAM; veja "Setting up Session Manager"). Na AWS CLI é preciso a versão 1.16.12 ou superior e o plugin do Session Manager.</>} en={<><b>Prerequisites:</b> the node must be managed by Systems Manager (SSM Agent and IAM permissions; see "Setting up Session Manager"). The AWS CLI needs version 1.16.12 or later plus the Session Manager plugin.</>} /></li>
          </ul>
          <CodeBlock code={`aws ssm start-session --target i-0123456789abcdef0`} />
          <Callout><strong><T pt="Aviso da documentação" en="Docs notice" /></strong> <T pt="A página legada do Session Manager será descontinuada em 31/12/2026; as funções passam para a experiência unificada do console do Systems Manager (você continua iniciando sessões e vendo o histórico)." en="The legacy Session Manager page will be deprecated on December 31, 2026; its capabilities move to the unified Systems Manager console (you can still start sessions and view history)." /></Callout>
          <h3>Parameter Store</h3>
          <p><T pt={<>Armazém centralizado de configuração: valores nomeados (<i>parameters</i>) que a aplicação lê em tempo de execução, sem deixar valores fixos no código.</>} en={<>A centralized configuration store: named values (<i>parameters</i>) the application reads at runtime, with no hardcoded values in code.</>} /></p>
          <div className="grid">
            <div className="card">
              <h4>String</h4>
              <T pt="Texto simples: nome do ambiente, URL de endpoint, ID de recurso." en="Plain text: environment name, endpoint URL, resource ID." />
            </div>
            <div className="card">
              <h4>StringList</h4>
              <T pt={<>Lista separada por vírgulas, como <code>subnet-aaa,subnet-bbb</code>.</>} en={<>Comma-separated list, such as <code>subnet-aaa,subnet-bbb</code>.</>} />
            </div>
            <div className="card">
              <h4>SecureString</h4>
              <T pt={<>Valor criptografado com AWS KMS. Para segredos como senhas, chaves de API e tokens, a documentação recomenda o <a href="#secrets">Secrets Manager</a>.</>} en={<>A value encrypted with AWS KMS. For secrets such as passwords, API keys and tokens, the docs recommend <a href="#secrets">Secrets Manager</a>.</>} />
            </div>
          </div>
          <CodeBlock code={`/minha-app/prod/db-host        # hierarquia: /app/ambiente/nome
/minha-app/staging/db-host`} />
          <ul>
            <li><T pt={<><b>Hierarquia:</b> agrupe por caminho (ex.: <code>/app/ambiente/chave</code>) para buscar e filtrar vários parâmetros de uma vez e dar permissões IAM por prefixo (ler <code>/minha-app/prod/*</code> mas não <code>/minha-app/dev/*</code>).</>} en={<><b>Hierarchy:</b> group by path (e.g. <code>/app/env/key</code>) to fetch and filter several parameters at once and grant IAM permissions per prefix (read <code>/my-app/prod/*</code> but not <code>/my-app/dev/*</code>).</>} /></li>
            <li><T pt={<><b>Versões:</b> guarda as 100 versões mais recentes de cada parâmetro.</>} en={<><b>Versions:</b> keeps the 100 most recent versions of each parameter.</>} /></li>
            <li><T pt={<><b>Camadas:</b> standard (sem custo adicional; até 10.000 parâmetros por conta/Region, valor de até 4 KB) e advanced (até 100.000; 8 KB; políticas de parâmetro e compartilhamento entre contas; cobrado). Valores da documentação em 2026-10-13; confira a página de preços.</>} en={<><b>Tiers:</b> standard (no extra charge; up to 10,000 parameters per account/Region, value up to 4 KB) and advanced (up to 100,000; 8 KB; parameter policies and cross-account sharing; billed). Values per the docs on 2026-10-13; check the pricing page.</>} /></li>
            <li><T pt={<><b>Integrações:</b> ECS/Fargate injetam parâmetros como variáveis de ambiente; Lambda tem extensão; CloudFormation e CodeBuild leem parâmetros. Há também parâmetros públicos que apontam para as AMIs atuais.</>} en={<><b>Integrations:</b> ECS/Fargate inject parameters as environment variables; Lambda has an extension; CloudFormation and CodeBuild read parameters. There are also public parameters pointing to current AMIs.</>} /></li>
          </ul>
          <Callout tone="warn">
            <strong><T pt="Pegadinhas" en="Gotchas" /></strong>
            <ul>
              <li><T pt={<>Uma atualização vale na próxima leitura, <b>sem validação, rollout gradual ou rollback automático</b>. Para configuração em que um valor ruim derruba o sistema, a AWS aponta o AWS AppConfig.</>} en={<>An update takes effect on the next read, with <b>no validation, gradual rollout or automatic rollback</b>. For configuration where a bad value could cause an outage, AWS points to AWS AppConfig.</>} /></li>
              <li><T pt={<>No ECS, variáveis do Parameter Store são resolvidas quando a task inicia; mudar o valor exige novo deploy (veja <a href="#ecs">ECS</a>).</>} en={<>On ECS, Parameter Store variables are resolved when the task starts; changing the value needs a new deployment (see <a href="#ecs">ECS</a>).</>} /></li>
              <li><T pt="Throughput padrão serve cargas menores; há modo de alto throughput, com custo adicional. Avalie cedo se a aplicação lê parâmetros com frequência." en="Default throughput suits smaller workloads; a high-throughput mode exists at extra cost. Evaluate early if your app reads parameters often." /></li>
            </ul>
          </Callout>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Parameter Store</th>
                  <th>Secrets Manager</th>
                  <th>AppConfig</th>
                </tr>
                <tr>
                  <td><T pt="Para" en="For" /></td>
                  <td><T pt="Configuração estática, endpoints, IDs" en="Static config, endpoints, IDs" /></td>
                  <td><T pt="Credenciais e segredos" en="Credentials and secrets" /></td>
                  <td><T pt="Configuração que muda com frequência, feature flags" en="Frequently changing config, feature flags" /></td>
                </tr>
                <tr>
                  <td><T pt="Rotação" en="Rotation" /></td>
                  <td><T pt="Nenhuma" en="None" /></td>
                  <td><T pt="Automática" en="Automatic" /></td>
                  <td><T pt="Não se aplica" en="Not applicable" /></td>
                </tr>
                <tr>
                  <td><T pt="Custo" en="Cost" /></td>
                  <td><T pt="Standard sem custo adicional" en="Standard has no extra charge" /></td>
                  <td><T pt="Por segredo/mês e por chamada" en="Per secret/month and per call" /></td>
                  <td><T pt="Por requisição de configuração" en="Per configuration request" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt={<><b>Session Manager:</b> acesso a instâncias privadas, sem porta 22. <b>Parameter Store:</b> configuração por ambiente (/app/prod/...) lida pela aplicação.</>} en={<><b>Session Manager:</b> access to private instances without port 22. <b>Parameter Store:</b> per-environment config (/app/prod/...) read by the application.</>} />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Parameter Store para segredos que precisam de rotação (use Secrets Manager); alterar parâmetros críticos sem validação; esperar log do conteúdo de sessões SSH/port forwarding." en="Parameter Store for secrets that need rotation (use Secrets Manager); changing critical parameters without validation; expecting content logs for SSH/port-forwarding sessions." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O que o Session Manager dispensa?" en="What does Session Manager make unnecessary?" /></summary>
            <div className="ans"><T pt="Portas de entrada abertas, bastion hosts e chaves SSH." en="Open inbound ports, bastion hosts and SSH keys." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Um SecureString é ideal para uma senha de banco com rotação?" en="Is a SecureString ideal for a rotating database password?" /></summary>
            <div className="ans"><T pt="Não. A documentação recomenda o Secrets Manager para credenciais, pois ele rotaciona automaticamente." en="No. The docs recommend Secrets Manager for credentials, since it rotates automatically." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" rel="noopener">AWS Systems Manager Session Manager</a></li>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" rel="noopener">AWS Systems Manager Parameter Store</a></li>
              <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" rel="noopener">What is AWS Secrets Manager?</a></li>
            </ul>
            <p><T pt={<><b>Não verificado nesta rodada:</b> o comando <code>aws ssm start-session</code> exato e as permissões necessárias no perfil da instância (consulte "Setting up Session Manager").</>} en={<><b>Not verified this round:</b> the exact <code>aws ssm start-session</code> command and the permissions needed on the instance profile (see "Setting up Session Manager").</>} /></p>
          </Sources>
        </section>
        {/* ============ SECRETS ============ */}
        <section className="topic" id="secrets">
          <header>
            <span className="tag"><T pt="Segredos e acesso · 15" en="Secrets &amp; access · 15" /></span>
            <h2>Secrets Manager</h2>
            <p className="lead"><T pt="AWS Secrets Manager ajuda a gerenciar, recuperar e rotacionar credenciais de banco, credenciais de aplicação, tokens OAuth, chaves de API e outros segredos durante todo o ciclo de vida." en="AWS Secrets Manager helps you manage, retrieve and rotate database credentials, application credentials, OAuth tokens, API keys and other secrets throughout their lifecycle." /></p>
          </header>
          <div className="flow"> <span className="node"><Icon name="play" /> <T pt="Task / função (role IAM)" en="Task / function (IAM role)" /></span><span className="arrow">GetSecretValue →</span> <span className="node"><Icon name="key" /> Secrets Manager</span><span className="arrow"><Icon name="refresh" /> <T pt="rotação (Lambda)" en="rotation (Lambda)" /> →</span> <span className="node"><Icon name="database" /> RDS</span> </div>
          <ul>
            <li><T pt="Em vez de credenciais fixas no código, a aplicação faz uma chamada em tempo de execução ao Secrets Manager. Assim, quem inspeciona a aplicação não encontra a senha." en="Instead of hardcoded credentials, the application makes a runtime call to Secrets Manager. Anyone inspecting the application will not find the password." /></li>
            <li><b><T pt="Rotação automática:" en="Automatic rotation:" /></b> <T pt="troca segredos de longo prazo por segredos de curta duração. Como as credenciais não ficam com a aplicação, rotacionar não exige alterar e redeployar os clientes. A rotação (exceto a gerenciada) usa uma função Lambda, cobrada pelo preço do Lambda." en="replaces long-term secrets with short-term ones. Since credentials are not stored with the app, rotating them does not require changing and redeploying clients. Rotation (except managed rotation) uses a Lambda function, charged at Lambda rates." /></li>
            <li><b><T pt="Criptografia:" en="Encryption:" /></b> <T pt={<>com AWS KMS. A chave gerenciada <code>aws/secretsmanager</code> é gratuita; chaves próprias são cobradas pela tarifa do KMS.</>} en={<>with AWS KMS. The managed key <code>aws/secretsmanager</code> is free; your own keys are charged at KMS rates.</>} /></li>
            <li><b><T pt="Versionamento:" en="Versioning:" /></b> <T pt={<>versões com <i>staging labels</i>. Também há acesso entre contas e log de auditoria detalhado.</>} en={<>versions with <i>staging labels</i>. There are also cross-account access and fine-grained audit logging.</>} /></li>
            <li><b><T pt="Custo:" en="Cost:" /></b> <T pt={<>paga-se por segredo por mês e por chamada de API, sem taxa mínima. Segredos marcados para exclusão não são cobrados. Veja a <a href="https://aws.amazon.com/secrets-manager/pricing" rel="noopener">página de preços</a>.</>} en={<>you pay per secret per month and per API call, with no minimum fees. Secrets marked for deletion are not charged. See the <a href="https://aws.amazon.com/secrets-manager/pricing" rel="noopener">pricing page</a>.</>} /></li>
          </ul>
          <h3><T pt="Integração com o RDS" en="RDS integration" /></h3>
          <p><T pt={<>Ao criar um banco, a opção <b>Manage master credentials in AWS Secrets Manager</b> guarda a senha do usuário master em um segredo (com KMS opcional). O <b>RDS Proxy</b> também conecta no banco usando credenciais guardadas no Secrets Manager. Veja <a href="#rds">RDS</a>.</>} en={<>When creating a database, the <b>Manage master credentials in AWS Secrets Manager</b> option stores the master user password in a secret (with optional KMS). <b>RDS Proxy</b> also connects to the database using credentials stored in Secrets Manager. See <a href="#rds">RDS</a>.</>} /></p>
          <Callout>
            <strong><T pt="Cada tipo de segredo, a ferramenta certa (segundo a documentação)" en="Each kind of secret, the right tool (per the docs)" /></strong>
            <ul>
              <li><T pt="Credenciais AWS → IAM · Chaves de criptografia → KMS · Chaves SSH → EC2 Instance Connect · Chaves privadas e certificados → ACM." en="AWS credentials → IAM · Encryption keys → KMS · SSH keys → EC2 Instance Connect · Private keys and certificates → ACM." /></li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Credenciais de banco, chaves de API e tokens que devem ser rotacionados, auditados ou compartilhados entre contas." en="Database credentials, API keys and tokens that must be rotated, audited or shared across accounts." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt={<>Configuração comum (endpoints, nomes): use <a href="#ssm">Parameter Store</a>, que no tier standard não tem custo adicional; credenciais AWS (use roles).</>} en={<>Plain configuration (endpoints, names): use <a href="#ssm">Parameter Store</a>, which has no extra charge in the standard tier; AWS credentials (use roles).</>} />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Rotacionar a senha exige redeploy da aplicação?" en="Does rotating the password require redeploying the app?" /></summary>
            <div className="ans"><T pt="Não, se a aplicação busca o segredo em tempo de execução: as credenciais não ficam embutidas nela." en="No, if the app fetches the secret at runtime: the credentials are not embedded in it." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" rel="noopener">What is AWS Secrets Manager?</a></li>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" rel="noopener">Parameter Store (comparativo com Secrets Manager e AppConfig)</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.Settings.html" rel="noopener">RDS: Settings for DB instances</a> · <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html" rel="noopener">Amazon RDS Proxy</a></li>
            </ul>
            <p><T pt={<><b>Não verificado nesta rodada:</b> o nome exato da chamada de API <code>GetSecretValue</code> usada no diagrama (é a operação padrão de leitura, mas a página lida não a cita).</>} en={<><b>Not verified this round:</b> the exact <code>GetSecretValue</code> API call in the diagram (it is the standard read operation, but the page read does not name it).</>} /></p>
          </Sources>
        </section>
        {/* ============ RDS ============ */}
        <section className="topic" id="rds">
          <header>
            <span className="tag"><T pt="Dados · 16" en="Data · 16" /></span>
            <h2>RDS</h2>
            <p className="lead"><T pt="Amazon Relational Database Service: facilita criar, operar e escalar bancos relacionais na nuvem, com a AWS cuidando de backups, patches, detecção de falhas e recuperação." en="Amazon Relational Database Service: makes it easier to set up, operate and scale relational databases in the cloud, with AWS handling backups, patching, failure detection and recovery." /></p>
          </header>
          <p><T pt="Motores suportados: Db2, MariaDB, SQL Server, MySQL, Oracle e PostgreSQL (o Aurora tem guia próprio). A AWS recomenda o RDS como escolha padrão para a maioria dos bancos relacionais; em um banco sobre EC2, instalação, patch do SO e do banco, backup e alta disponibilidade ficam por sua conta." en="Supported engines: Db2, MariaDB, SQL Server, MySQL, Oracle and PostgreSQL (Aurora has its own guide). AWS recommends RDS as the default choice for most relational databases; with a database on EC2, installation, OS and database patching, backups and high availability are on you." /></p>
          <div className="vpc">
            <div className="label"><T pt="Arquitetura típica" en="Typical architecture" /></div>
            <div className="flow"> <span className="node"><Icon name="balance" /> ALB<br /><small><T pt="subnet pública" en="public subnet" /></small></span><span className="arrow">→</span> <span className="node"><Icon name="server" /> <T pt="App" en="App" /><br /><small><T pt="subnet privada" en="private subnet" /></small></span><span className="arrow">→</span> <span className="node"><Icon name="database" /> DB primary<br /><small>AZ A · <T pt="privada" en="private" /></small></span><span className="arrow">⇄ sync</span> <span className="node"><Icon name="database" /> DB standby<br /><small>AZ B · <T pt="privada" en="private" /></small></span> </div>
          </div>
          <h3><T pt="Conceitos" en="Concepts" /></h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="layers" /> DB instance</h4>
              <T pt={<>Ambiente de banco isolado na nuvem; pode conter um ou mais bancos criados por você. A <b>classe</b> define CPU e memória: há classes de uso geral (db.m), otimizadas para memória (db.r, db.x, db.z), para computação (db.c) e <b>burstable</b> (db.t).</>} en={<>An isolated database environment in the cloud; it can hold one or more databases you create. The <b>class</b> defines CPU and memory: general purpose (db.m), memory optimized (db.r, db.x, db.z), compute optimized (db.c) and <b>burstable</b> (db.t).</>} />
            </div>
            <div className="card">
              <h4><Icon name="database" /> Storage</h4>
              <T pt="Volumes EBS. Tipos: General Purpose SSD (indicado para dev/teste), Provisioned IOPS SSD (para cargas intensivas em I/O, indicado para produção) e Magnetic (obsoleto). O storage autoscaling aumenta o espaço sozinho (veja abaixo)." en="EBS volumes. Types: General Purpose SSD (suited to dev/test), Provisioned IOPS SSD (for I/O-intensive workloads, suited to production) and Magnetic (deprecated). Storage autoscaling grows the space on its own (see below)." />
            </div>
            <div className="card">
              <h4><Icon name="network" /> VPC</h4>
              <T pt={<>O banco roda em uma VPC. Você cria um <b>DB subnet group</b> com subnets em pelo menos <b>duas</b> zonas de disponibilidade da Region (mesmo em Single-AZ, para poder virar Multi-AZ depois). Reserve IPs livres nas subnets: o RDS usa para failover e manutenção.</>} en={<>The database runs in a VPC. You create a <b>DB subnet group</b> with subnets in at least <b>two</b> Availability Zones of the Region (even for Single-AZ, so it can become Multi-AZ later). Leave free IPs in the subnets: RDS uses them for failover and maintenance.</>} />
            </div>
          </div>
          <h3><T pt="Acesso e segurança" en="Access and security" /></h3>
          <ul>
            <li><b>Public access:</b> <T pt={<>"Yes" dá um IP público ao banco; para isso todas as subnets do DB subnet group precisam de internet gateway. "No" deixa o acesso só de dentro da VPC. O acesso final é sempre controlado pelo <a href="#sg">Security Group</a>: libere a porta do banco só do SG da aplicação.</>} en={<>"Yes" gives the database a public IP; for that every subnet in the DB subnet group needs an internet gateway. "No" keeps access to inside the VPC only. Final access is always controlled by the <a href="#sg">Security Group</a>: allow the database port only from the application's SG.</>} /></li>
            <li><b>Master user:</b> <T pt={<>usuário criado com a instância, com privilégios altos mas <b>não</b> equivalentes a superusuário total (a lista varia por motor). O nome não pode ser alterado depois. A AWS recomenda <b>não</b> usar o master na aplicação: crie um usuário com o mínimo de privilégios.</>} en={<>the user created with the instance, with high but <b>not</b> full-superuser privileges (the list varies by engine). The name cannot be changed later. AWS recommends <b>not</b> using the master in your application: create a user with minimum privileges.</>} /></li>
            <li><b>Secrets Manager:</b> <T pt={<>a opção <i>Manage master credentials in AWS Secrets Manager</i> guarda a senha master em um segredo. Veja <a href="#secrets">Secrets Manager</a>.</>} en={<>the <i>Manage master credentials in AWS Secrets Manager</i> option stores the master password in a secret. See <a href="#secrets">Secrets Manager</a>.</>} /></li>
            <li><b>Encryption / KMS:</b> <T pt="criptografia em repouso é opção na criação; com ela você escolhe a chave KMS." en="encryption at rest is a creation-time option; with it you pick the KMS key." /></li>
            <li><b>Deletion protection:</b> <T pt="impede apagar o banco por engano (no console, é ligada por padrão ao criar uma instância de produção)." en="prevents accidental deletion (in the console it is on by default when you create a production instance)." /></li>
            <li><b>RDS Proxy:</b> <T pt="mantém um pool de conexões e as compartilha, ajuda a aplicação a escalar e a suportar picos, e se reconecta ao standby em falhas. Fica na mesma VPC do banco e não é publicamente acessível; só funciona para MariaDB, MySQL e PostgreSQL (entre os motores listados). Tem cobrança própria; veja os preços." en="keeps and shares a connection pool, helps the application scale and absorb spikes, and reconnects to the standby on failures. It lives in the same VPC as the database and is not publicly accessible; among the listed engines it works for MariaDB, MySQL and PostgreSQL. It has its own pricing; see prices." /></li>
          </ul>
          <h3>Multi-AZ</h3>
          <div className="grid">
            <div className="card">
              <h4>Multi-AZ DB instance</h4>
              <T pt={<>Um <b>standby</b> síncrono em outra AZ, para failover. O standby <b>não atende leitura</b>.</>} en={<>One synchronous <b>standby</b> in another AZ, for failover. The standby <b>does not serve reads</b>.</>} />
            </div>
            <div className="card">
              <h4>Multi-AZ DB cluster</h4>
              <T pt={<>Um writer e <b>dois readers</b> em três AZs; os três atendem leitura e dão suporte a failover.</>} en={<>One writer and <b>two readers</b> across three AZs; all three serve reads and support failover.</>} />
            </div>
          </div>
          <p><T pt={<>Multi-AZ traz redundância de dados e suporte a failover, elimina congelamentos de I/O e reduz picos de latência em backups. É recomendado para produção; para desenvolvimento e teste dá para criar sem standby. Não confunda com <i>read replicas</i> (escalam leitura, replicação assíncrona). O IP do banco muda no failover: conecte-se sempre pelo nome DNS (endpoint).</>} en={<>Multi-AZ gives data redundancy and failover support, eliminates I/O freezes and minimizes latency spikes during backups. It is recommended for production; for development and testing you can create without a standby. Do not confuse it with <i>read replicas</i> (they scale reads, asynchronous replication). The database's IP changes on failover: always connect through the DNS name (endpoint).</>} /></p>
          <h3><T pt="Backups" en="Backups" /></h3>
          <ul>
            <li><T pt={<><b>Backups automáticos:</b> o RDS faz um snapshot do volume da instância na janela de backup e guarda pelo <i>backup retention period</i> que você define, permitindo restaurar a <b>qualquer ponto no tempo</b> dentro do período. Só ocorrem com o banco no estado <code>available</code>. Para qualquer banco que importe, use retenção de 1 dia ou mais.</>} en={<><b>Automated backups:</b> RDS takes a volume snapshot of the instance during the backup window and keeps it for the <i>backup retention period</i> you set, letting you restore to <b>any point in time</b> within it. They only happen while the database is in the <code>available</code> state. For any database that matters, use a retention of 1 day or more.</>} /></li>
            <li><T pt={<><b>Snapshots manuais:</b> você cria quando quiser; não são apagados quando a instância é excluída (até 100 manuais por Region, segundo a página lida). Backups automáticos são apagados com a instância, a não ser que você escolha retê-los; o snapshot final é opcional.</>} en={<><b>Manual snapshots:</b> you create them whenever you want; they are not deleted when the instance is deleted (up to 100 manual per Region per the page read). Automated backups are deleted with the instance unless you choose to retain them; the final snapshot is optional.</>} /></li>
            <li><T pt="O primeiro snapshot tem o banco completo; os seguintes são incrementais. Backups ficam no S3 e geram custo de armazenamento." en="The first snapshot holds the full database; later ones are incremental. Backups live in S3 and incur storage cost." /></li>
          </ul>
          <h3><T pt="Storage autoscaling" en="Storage autoscaling" /></h3>
          <p><T pt={<>Você define um <b>Maximum storage threshold</b>. O RDS aumenta o storage quando o espaço livre cai a 10% ou menos do alocado por pelo menos 5 minutos, e as modificações anteriores terminaram (máximo de quatro por 24 h). O aumento é do maior valor entre 10 GiB, 10% do alocado e o crescimento previsto. Não precisa de reinício nem causa downtime.</>} en={<>You set a <b>Maximum storage threshold</b>. RDS grows storage when free space falls to 10% or less of the allocated for at least 5 minutes and previous modifications have completed (at most four per 24 h). The increase is the greater of 10 GiB, 10% of allocated, and predicted growth. No reboot and no downtime.</>} /></p>
          <Callout tone="warn"><strong><T pt="Pegadinhas" en="Gotchas" /></strong> <T pt={<>O autoscaling <b>nunca reduz</b> o storage alocado. Cargas grandes de dados podem esgotar o espaço mesmo com autoscaling, porque há intervalo mínimo entre modificações. O threshold máximo deve ser pelo menos 10% maior que o alocado (a AWS sugere 26%).</>} en={<>Autoscaling <b>never shrinks</b> allocated storage. Large data loads can still fill the space, because modifications have a minimum spacing. The maximum threshold must be at least 10% above the allocated (AWS suggests 26%).</>} /></Callout>
          <h3><T pt="Nomes: instância vs. banco" en="Names: instance vs. database" /></h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Campo / Field</th>
                  <th><T pt="O que é" en="What it is" /></th>
                </tr>
                <tr>
                  <td>DB instance identifier</td>
                  <td><T pt="Nome da instância no RDS (até 63 caracteres alfanuméricos, único na conta e Region)." en="The instance's name in RDS (up to 63 alphanumeric characters, unique per account and Region)." /></td>
                </tr>
                <tr>
                  <td>Initial database name</td>
                  <td><T pt={<>Nome do banco criado dentro da instância. Se você não informar, o RDS <b>não</b> cria banco (exceto em Oracle e PostgreSQL).</>} en={<>Name of the database created inside the instance. If you leave it out, RDS does <b>not</b> create one (except for Oracle and PostgreSQL).</>} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Bancos relacionais de aplicações, com backup, patch e failover gerenciados. Multi-AZ e deletion protection em produção." en="Application relational databases with managed backups, patching and failover. Multi-AZ and deletion protection in production." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Acesso público sem necessidade; usar o master na aplicação; achar que Multi-AZ substitui backup; depender de read replica como alta disponibilidade." en="Public access without need; using the master in the application; assuming Multi-AZ replaces backups; relying on a read replica as high availability." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="O standby de um Multi-AZ DB instance atende consultas de leitura?" en="Does a Multi-AZ DB instance's standby serve read queries?" /></summary>
            <div className="ans"><T pt={<>Não. Só o Multi-AZ DB <i>cluster</i> tem readers que atendem leitura.</>} en={<>No. Only a Multi-AZ DB <i>cluster</i> has readers that serve reads.</>} /></div>
          </details>
          <details className="fc">
            <summary><T pt="Instance Identifier e Initial Database Name são a mesma coisa?" en="Are Instance Identifier and Initial Database Name the same?" /></summary>
            <div className="ans"><T pt="Não. Um nomeia a instância no RDS, o outro o banco dentro dela." en="No. One names the instance in RDS, the other the database inside it." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html" rel="noopener">What is Amazon RDS?</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html" rel="noopener">Working with a DB instance in a VPC</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.Settings.html" rel="noopener">Settings for DB instances</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.MasterAccounts.html" rel="noopener">Master user account privileges</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html" rel="noopener">Configuring and managing a Multi-AZ deployment</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" rel="noopener">Introduction to backups</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html" rel="noopener">Managing capacity automatically with storage autoscaling</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html" rel="noopener">Amazon RDS Proxy</a></li>
            </ul>
            <p><T pt={<><b>Corrigido ou removido:</b> "você não tem acesso ao root; o master é restrito" foi trocado pela descrição da documentação (privilégios elevados do master, lista por motor); "a VPC não muda depois" e "a chave KMS não pode ser alterada depois" saíram por falta de suporte nas páginas lidas; itens sobre o helper "Connect to an EC2" e sobre Certificate Authority ficaram fora por falta de leitura da fonte (consulte "Settings for DB instances").</>} en={<><b>Corrected or removed:</b> "you do not get root; the master is restricted" was replaced with the docs' description (the master's elevated privileges, listed per engine); "the VPC cannot change later" and "the KMS key cannot be changed afterwards" were dropped for lack of support in the pages read; the "Connect to an EC2" helper and Certificate Authority items were left out for lack of a source read (see "Settings for DB instances").</>} /></p>
          </Sources>
        </section>
        {/* ============ S3 ============ */}
        <section className="topic" id="s3">
          <header>
            <span className="tag"><T pt="Dados · 17" en="Data · 17" /></span>
            <h2>S3</h2>
            <p className="lead"><T pt="Amazon Simple Storage Service: armazenamento de objetos com grande escala, disponibilidade, segurança e desempenho, para sites, backups, aplicações, data lakes e mais." en="Amazon Simple Storage Service: object storage with great scalability, availability, security and performance, for websites, backups, applications, data lakes and more." /></p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="bucket" /> Bucket</h4>
              <T pt="Contêiner de objetos, criado em uma Region. Nome e Region não mudam depois. O nome de um bucket de uso geral é único no namespace global (ou no namespace regional da sua conta)." en="A container for objects, created in a Region. Name and Region cannot change afterwards. A general purpose bucket's name is unique in the global namespace (or in your account's regional namespace)." />
            </div>
            <div className="card">
              <h4><Icon name="doc" /> Object &amp; key</h4>
              <T pt={<>Objeto = dados + metadados. A <b>key</b> é o identificador dentro do bucket. Bucket + key (+ versão) identificam o objeto. Com <b>versioning</b>, você preserva e restaura cada versão.</>} en={<>Object = data + metadata. The <b>key</b> is the identifier inside the bucket. Bucket + key (+ version) identify the object. With <b>versioning</b> you preserve and restore every version.</>} />
            </div>
            <div className="card">
              <h4><Icon name="lock" /> <T pt="Privado por padrão" en="Private by default" /></h4>
              <T pt={<>Buckets e objetos são privados até você conceder acesso (políticas de bucket, IAM, access points). O <b>Block Public Access</b> vem ativado; mantenha-o, salvo necessidade específica.</>} en={<>Buckets and objects are private until you grant access (bucket policies, IAM, access points). <b>Block Public Access</b> comes on; keep it on unless you have a specific need.</>} />
            </div>
            <div className="card">
              <h4><Icon name="check" /> <T pt="Consistência forte" en="Strong consistency" /></h4>
              <T pt="Leitura-após-escrita forte para PUT e DELETE em todas as Regions: após um PUT bem-sucedido, o GET/LIST seguinte já vê o dado novo. Para gravações simultâneas na mesma key, vale a última (last-writer-wins)." en="Strong read-after-write consistency for PUT and DELETE in all Regions: after a successful PUT, the next GET/LIST already sees the new data. For concurrent writes to the same key, the last writer wins." />
            </div>
          </div>
          <h3>Presigned URL</h3>
          <p><T pt={<>Link temporário que dá acesso a <b>um objeto</b> por tempo limitado, sem mexer na bucket policy. Usa as credenciais de quem gerou a URL; para funcionar, essa identidade precisa ter a permissão da operação (ex.: <code>s3:GetObject</code>). Serve para download (GET) e upload (PUT) direto no S3, sem passar pelo seu servidor. Se já existir um objeto com a mesma key, o upload o <b>substitui</b>.</>} en={<>A temporary link granting access to <b>one object</b> for a limited time, without touching the bucket policy. It uses the credentials of whoever generated the URL; for it to work, that identity needs the operation's permission (e.g. <code>s3:GetObject</code>). It serves direct download (GET) and upload (PUT) to S3, bypassing your server. If an object with the same key already exists, the upload <b>replaces</b> it.</>} /></p>
          <div className="flow"><span className="node"><Icon name="globe" /> <T pt="Navegador" en="Browser" /></span><span className="arrow">①→</span><span className="node"><Icon name="server" /> <T pt="Seu servidor" en="Your server" /></span><span className="arrow">② URL assinada ←</span><span className="node"><Icon name="globe" /></span><span className="arrow">③ PUT/GET →</span><span className="node"><Icon name="bucket" /> S3</span></div>
          <ul>
            <li><T pt={<><b>Validade:</b> pelo console, de 1 minuto a 12 horas; pela AWS CLI/SDKs, até 7 dias (credenciais de usuário IAM com Signature V4).</>} en={<><b>Lifetime:</b> from the console, 1 minute to 12 hours; from the AWS CLI/SDKs, up to 7 days (IAM user credentials with Signature V4).</>} /></li>
            <li><T pt={<><b>Pegadinha:</b> se a URL foi gerada com credenciais temporárias (role, STS, perfil da EC2/ECS), ela expira junto com a credencial, mesmo que você tenha pedido prazo maior. O S3 confere a validade no momento da requisição: um download já iniciado continua, mas retomar depois do prazo falha.</>} en={<><b>Gotcha:</b> if the URL was generated with temporary credentials (role, STS, EC2/ECS profile) it expires together with the credential, even if you asked for a longer period. S3 checks validity at request time: a download already running continues, but resuming after expiry fails.</>} /></li>
            <li><T pt={<>A URL é um "bearer token": quem a tiver acessa o objeto. Proteja-a e, se quiser, restrinja com condições (ex.: <code>s3:signatureAge</code>, origem de rede).</>} en={<>The URL is a bearer token: whoever holds it reaches the object. Protect it and, if you want, restrict with conditions (e.g. <code>s3:signatureAge</code>, network origin).</>} /></li>
          </ul>
          <h3><T pt="Custos" en="Costs" /></h3>
          <p><T pt={<>A cobrança do S3 é por uso, sem taxas mínimas ou de excedente. Valores reais ficam na <a href="https://aws.amazon.com/s3/pricing/" rel="noopener">página de preços do S3</a> (as cifras da anotação antiga foram removidas). Pontos que a documentação destaca:</>} en={<>S3 billing is pay-as-you-go, with no minimum or overage fees. Real values are on the <a href="https://aws.amazon.com/s3/pricing/" rel="noopener">S3 pricing page</a> (the figures in the old note were removed). Points the docs highlight:</>} /></p>
          <ul>
            <li><T pt="Armazenamento por classe, requisições e transferência de dados." en="Storage per class, requests and data transfer." /></li>
            <li><T pt={<>Classes IA e Glacier têm <b>taxa de recuperação</b>, duração mínima de armazenamento e tamanho mínimo cobrado.</>} en={<>IA and Glacier classes have a <b>retrieval fee</b>, a minimum storage duration and a minimum billable size.</>} /></li>
            <li><T pt="Transições de lifecycle têm custo por requisição (não há taxa de recuperação nas transições)." en="Lifecycle transitions have a per-request cost (there is no retrieval charge on transitions)." /></li>
          </ul>
          <h3><T pt="Classes de armazenamento" en="Storage classes" /></h3>
          <p><T pt="Todas as classes são projetadas para alta durabilidade (11 noves, 99,999999999%, exceto a legada Reduced Redundancy). A diferença está em acesso, disponibilidade, custo e regras mínimas:" en="All classes are designed for high durability (eleven 9s, 99.999999999%, except the legacy Reduced Redundancy). The difference is access, availability, cost and minimum rules:" /></p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Classe" en="Class" /></th>
                  <th><T pt="Indicada para" en="Designed for" /></th>
                  <th><T pt="Duração mínima" en="Min duration" /></th>
                </tr>
                <tr>
                  <td>Standard</td>
                  <td><T pt="Dados acessados com frequência, acesso em milissegundos (padrão)" en="Frequently accessed data, millisecond access (default)" /></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Intelligent-Tiering</td>
                  <td><T pt="Padrão de acesso desconhecido ou variável: move objetos entre camadas sozinho. Sem taxa de recuperação; há taxa de monitoramento. Objetos menores que 128 KB não são monitorados." en="Unknown or changing access: moves objects between tiers by itself. No retrieval fee; there is a monitoring fee. Objects under 128 KB are not monitored." /></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Standard-IA / One Zone-IA</td>
                  <td><T pt="Dados de longa vida e acesso raro, ainda em milissegundos. One Zone-IA guarda em uma única AZ (não resiste à perda da AZ)." en="Long-lived, infrequently accessed data, still millisecond access. One Zone-IA stores in a single AZ (does not survive losing the AZ)." /></td>
                  <td>30 <T pt="dias" en="days" /></td>
                </tr>
                <tr>
                  <td>Glacier Instant Retrieval</td>
                  <td><T pt="Arquivo acessado cerca de uma vez por trimestre, com acesso em milissegundos" en="Archive accessed about once a quarter, millisecond access" /></td>
                  <td>90 <T pt="dias" en="days" /></td>
                </tr>
                <tr>
                  <td>Glacier Flexible Retrieval</td>
                  <td><T pt={<>Arquivo acessado cerca de uma vez por ano; recuperação de minutos a horas, é preciso <i>restaurar</i> antes de ler</>} en={<>Archive accessed about once a year; retrieval in minutes to hours, you must <i>restore</i> before reading</>} /></td>
                  <td>90 <T pt="dias" en="days" /></td>
                </tr>
                <tr>
                  <td>Glacier Deep Archive</td>
                  <td><T pt="Arquivo acessado menos de uma vez por ano; recuperação em horas, é preciso restaurar" en="Archive accessed less than once a year; retrieval in hours, you must restore" /></td>
                  <td>180 <T pt="dias" en="days" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted"><T pt={"Existe ainda o S3 Express One Zone (latência de um dígito de milissegundo em uma única AZ). Os tamanhos mínimos faturáveis (128 KB nas IA e Glacier IR) e as disponibilidades por classe estão na tabela de comparação oficial. Correção: o \"Glacier\" da anotação antiga virou três classes, e só duas exigem restauração."} en={"There is also S3 Express One Zone (single-digit millisecond latency in one AZ). Minimum billable sizes (128 KB for IA and Glacier IR) and per-class availability are in the official comparison table. Correction: the old note's \"Glacier\" is now three classes, and only two need a restore."} /></p>
          <h3>Lifecycle rules</h3>
          <p><T pt={<>Um conjunto de regras no bucket que faz o S3 agir sobre grupos de objetos. Dois tipos de ação: <b>transition</b> (mover para uma classe mais barata) e <b>expiration</b> (apagar quando expirar). As regras valem para objetos existentes e futuros; uma bucket policy <b>não</b> consegue impedir a ação do lifecycle.</>} en={<>A set of rules on the bucket that makes S3 act on groups of objects. Two kinds of action: <b>transition</b> (move to a cheaper class) and <b>expiration</b> (delete when it expires). Rules apply to existing and future objects; a bucket policy <b>cannot</b> prevent the lifecycle action.</>} /></p>
          <div className="flow"><span className="node">Standard</span><span className="arrow">30d →</span><span className="node">Standard-IA</span><span className="arrow">90d →</span><span className="node">Glacier Flexible</span><span className="arrow">365d →</span><span className="node"><Icon name="trash" /> <T pt="Expira" en="Expires" /></span></div>
          <p className="muted"><T pt="Prazos de exemplo. Respeite as durações mínimas das classes (30/90/180 dias): apagar ou mover cedo gera cobrança proporcional." en="Example timings. Respect the classes' minimum durations (30/90/180 days): deleting or moving early incurs a pro-rated charge." /></p>
          <h3>Static website hosting</h3>
          <p><T pt={<>O S3 pode hospedar um site <b>estático</b>: páginas com conteúdo estático, possivelmente com scripts no navegador (SPA, HTML puro). É preciso configurar um <i>index document</i> e permissões de acesso. A AWS recomenda usar o <b>AWS Amplify Hosting</b> para servir o conteúdo do S3 com CDN (CloudFront) e URL HTTPS. Se o bucket usa criptografia SSE-KMS, é obrigatório servir via CloudFront com <b>origin access control (OAC)</b>, pois SSE-KMS não suporta usuários anônimos.</>} en={<>S3 can host a <b>static</b> website: pages with static content, possibly with client-side scripts (SPA, plain HTML). You must configure an <i>index document</i> and access permissions. AWS recommends using <b>AWS Amplify Hosting</b> to serve S3 content through a CDN (CloudFront) with an HTTPS URL. If the bucket uses SSE-KMS encryption, you must serve through CloudFront with <b>origin access control (OAC)</b>, because SSE-KMS does not support anonymous users.</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Arquivos, uploads de usuários (com presigned URL), backups, logs, sites estáticos, dados que seguem o ciclo hot→cold com lifecycle." en="Files, user uploads (with presigned URLs), backups, logs, static sites, data following a hot→cold cycle with lifecycle." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Desligar o Block Public Access sem necessidade; presigned URL longa com credencial temporária; mover objetos pequenos para classes com tamanho mínimo; bloquear o lifecycle esperando que a bucket policy resolva." en="Turning Block Public Access off without need; long presigned URLs with temporary credentials; moving tiny objects to classes with a minimum size; expecting a bucket policy to block lifecycle." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Uma presigned URL gerada por uma role de 1 hora vale 7 dias se eu pedir?" en="Does a presigned URL generated by a 1-hour role last 7 days if I ask?" /></summary>
            <div className="ans"><T pt="Não. Ela expira quando a credencial da role expira." en="No. It expires when the role's credential expires." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Quais classes exigem restaurar o objeto antes de ler?" en="Which classes require restoring the object before reading?" /></summary>
            <div className="ans"><T pt="Glacier Flexible Retrieval e Glacier Deep Archive (e as camadas de arquivo opcionais do Intelligent-Tiering)." en="Glacier Flexible Retrieval and Glacier Deep Archive (and the optional archive tiers of Intelligent-Tiering)." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" rel="noopener">What is Amazon S3?</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" rel="noopener">Download and upload objects with presigned URLs</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" rel="noopener">Understanding and managing Amazon S3 storage classes</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html" rel="noopener">Managing the lifecycle of objects</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html" rel="noopener">Hosting a static website using Amazon S3</a></li>
            </ul>
            <p><T pt={<><b>Removido por falta de fonte:</b> "$0,023 por GB", "uploads são mais caros", "entrada é grátis" e "egress costuma ser o maior custo". <b>Ajustado:</b> "index.html obrigatório" (a documentação fala em configurar um index document).</>} en={<><b>Removed for lack of a source:</b> "$0.023 per GB", "uploads cost more", "ingress is free" and "egress is usually the biggest cost". <b>Adjusted:</b> "index.html required" (the docs speak of configuring an index document).</>} /></p>
          </Sources>
        </section>
        {/* ============ DOMINIOS ============ */}
        <section className="topic" id="dominios">
          <header>
            <span className="tag">DNS · 18</span>
            <h2><T pt="Domínios e DNS" en="Domains &amp; DNS" /></h2>
            <p className="lead"><T pt={<>O DNS traduz nomes (<code>app.exemplo.com.br</code>) em destinos. Os <b>registros</b> de uma zona dizem para onde cada nome aponta; o domínio em si é só o nome registrado.</>} en={<>DNS translates names (<code>app.example.com</code>) into destinations. A zone's <b>records</b> say where each name points; the domain itself is just the registered name.</>} /></p>
          </header>
          <h3><T pt="Tipos de registro" en="Record types" /></h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th><T pt="Tipo" en="Type" /></th>
                  <th><T pt="Função" en="Purpose" /></th>
                </tr>
                <tr>
                  <td><b>A</b></td>
                  <td><T pt={<>Aponta um nome para um endereço <b>IPv4</b> (ex.: <code>192.0.2.1</code>).</>} en={<>Points a name to an <b>IPv4</b> address (e.g. <code>192.0.2.1</code>).</>} /></td>
                </tr>
                <tr>
                  <td><b>AAAA</b></td>
                  <td><T pt={<>Igual ao A, mas para <b>IPv6</b> (ex.: <code>2001:0db8:85a3:0:0:8a2e:0370:7334</code>).</>} en={<>Same as A, but for <b>IPv6</b> (e.g. <code>2001:0db8:85a3:0:0:8a2e:0370:7334</code>).</>} /></td>
                </tr>
                <tr>
                  <td><b>CNAME</b></td>
                  <td><T pt={<>Mapeia um nome para <b>outro nome</b>. O protocolo DNS <b>não permite</b> CNAME no topo da zona (o apex, ex.: <code>exemplo.com</code>), só em subdomínios. E, se um nome tem CNAME, não pode ter outros registros.</>} en={<>Maps a name to <b>another name</b>. The DNS protocol <b>does not allow</b> a CNAME at the top of the zone (the apex, e.g. <code>example.com</code>), only on subdomains. And a name with a CNAME cannot have other records.</>} /></td>
                </tr>
                <tr>
                  <td><b>Alias</b> (Route 53)</td>
                  <td><T pt={<>Extensão do Route 53: aponta para certos recursos AWS (ALB, CloudFront, bucket S3 de site, API Gateway...). <b>Pode ser usado no apex.</b> Não é cobrada a consulta a alias para recursos AWS.</>} en={<>A Route 53 extension: points to certain AWS resources (ALB, CloudFront, S3 website bucket, API Gateway...). <b>It can be used at the apex.</b> Alias queries to AWS resources are not charged.</>} /></td>
                </tr>
                <tr>
                  <td><b>NS</b></td>
                  <td><T pt={<>Identifica os <b>name servers</b> da zona, quem responde pelo DNS dela. Também delega subdomínios para outra zona.</>} en={<>Identifies the zone's <b>name servers</b>, who answers for its DNS. Also delegates subdomains to another zone.</>} /></td>
                </tr>
                <tr>
                  <td><b>MX</b></td>
                  <td><T pt={<>Servidores de e-mail do domínio, cada um com uma <b>prioridade</b> (o menor valor vence). Deve apontar para o nome de um registro A/AAAA, não de um CNAME.</>} en={<>The domain's mail servers, each with a <b>priority</b> (the lowest value wins). It must point to the name of an A/AAAA record, not a CNAME.</>} /></td>
                </tr>
                <tr>
                  <td><b>TXT</b></td>
                  <td><T pt="Uma ou mais strings entre aspas (até 255 caracteres cada; até 4.000 no valor). Muito usado para verificações e e-mail (SPF)." en="One or more quoted strings (up to 255 characters each; up to 4,000 in the value). Widely used for verification and email (SPF)." /></td>
                </tr>
                <tr>
                  <td><b>SOA</b></td>
                  <td><T pt="Informações administrativas da zona (criado pelo Route 53)." en="Administrative information about the zone (created by Route 53)." /></td>
                </tr>
                <tr>
                  <td><b>CAA</b></td>
                  <td><T pt="Define quais autoridades certificadoras podem emitir certificados para o domínio." en="Defines which certificate authorities may issue certificates for the domain." /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted"><T pt="E-mail profissional no seu domínio exige o domínio e registros MX apontando para o provedor de e-mail. A AWS não recomenda mais o tipo SPF: use um TXT." en="Professional email on your domain needs the domain and MX records pointing to your email provider. AWS no longer recommends the SPF type: use a TXT record." /></p>
          <h3><T pt="Provar que o domínio é seu" en="Proving the domain is yours" /></h3>
          <p><T pt={<>O padrão da AWS para certificados é a validação por DNS: o ACM entrega um <b>CNAME</b> único e você o cria na zona. Veja <a href="#acm">ACM</a>.</>} en={<>AWS's standard for certificates is DNS validation: ACM hands you a unique <b>CNAME</b> and you create it in the zone. See <a href="#acm">ACM</a>.</>} /></p>
          <Callout tone="personal"><strong><T pt="Nota pessoal · fora da documentação da AWS" en="Personal note · outside AWS docs" /></strong> <T pt={<><b>Cloudflare "Proxied":</b> nas anotações do curso, o tráfego passa pelos servidores da Cloudflare antes de chegar ao seu servidor (proteção DDoS, WAF, cache, IP final escondido). É um serviço de terceiros, não coberto pela documentação da AWS, e não foi verificado. Consulte a documentação da Cloudflare.</>} en={<><b>Cloudflare "Proxied":</b> in the course notes, traffic goes through Cloudflare's servers before reaching yours (DDoS protection, WAF, caching, final IP hidden). It is a third-party service, not covered by AWS docs, and was not verified. See Cloudflare's documentation.</>} /></Callout>
          <div className="flow"><span className="node"><Icon name="globe" /> <T pt="Usuário" en="User" /></span><span className="arrow">→</span><span className="node"><Icon name="cloud" /> Cloudflare</span><span className="arrow">→</span><span className="node"><Icon name="server" /> <T pt="Seu servidor" en="Your server" /></span></div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="CNAME para subdomínios que apontam a outro nome; Alias para o apex e para recursos AWS; TXT/MX para verificação e e-mail." en="CNAME for subdomains pointing to another name; Alias for the apex and AWS resources; TXT/MX for verification and email." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="CNAME no apex; CNAME com outros registros no mesmo nome; MX apontando para um CNAME; SPF como tipo de registro." en="A CNAME at the apex; a CNAME together with other records on the same name; an MX pointing to a CNAME; SPF as a record type." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Posso usar CNAME no domínio raiz?" en="Can I use a CNAME on the root domain?" /></summary>
            <div className="ans"><T pt="Não: o DNS não permite no apex. No Route 53 use um registro Alias." en="No: DNS does not allow it at the apex. In Route 53 use an Alias record." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" rel="noopener">Supported DNS record types (Route 53)</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" rel="noopener">Choosing between alias and non-alias records</a></li>
              <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" rel="noopener">ACM DNS validation</a></li>
            </ul>
            <p><T pt={<><b>Removido por falta de fonte:</b> "você prova que é dono criando registros TXT no painel do registrador" (a documentação da AWS descreve CNAME para o ACM).</>} en={<><b>Removed for lack of a source:</b> "you prove ownership by creating TXT records in the registrar panel" (AWS docs describe a CNAME for ACM).</>} /></p>
          </Sources>
        </section>
        {/* ============ ROUTE 53 ============ */}
        <section className="topic" id="route53">
          <header>
            <span className="tag">DNS · 19</span>
            <h2>Route 53</h2>
            <p className="lead"><T pt={<>Serviço de DNS da AWS. Você cria <b>hosted zones</b> com os registros dos seus domínios e aponta nomes para recursos como o load balancer.</>} en={<>AWS's DNS service. You create <b>hosted zones</b> holding your domains' records and point names at resources such as the load balancer.</>} /></p>
          </header>
          <h3>Hosted Zones</h3>
          <p><T pt={<>Uma hosted zone é um <b>contêiner de registros</b> que dizem como rotear o tráfego de um domínio e seus subdomínios. Ela tem o mesmo nome do domínio. O preço por zona e por consulta está na <a href="https://aws.amazon.com/route53/pricing/" rel="noopener">página de preços do Route 53</a> (o valor fixo da anotação antiga foi removido).</>} en={<>A hosted zone is a <b>container of records</b> telling how to route traffic for a domain and its subdomains. It has the same name as the domain. Per-zone and per-query pricing is on the <a href="https://aws.amazon.com/route53/pricing/" rel="noopener">Route 53 pricing page</a> (the old note's fixed value was removed).</>} /></p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="globe" /> <T pt="Pública" en="Public" /></h4>
              <T pt={<>Registros que dizem como rotear o tráfego na <b>internet</b> (site, API, e-mail).</>} en={<>Records saying how to route traffic on the <b>internet</b> (website, API, email).</>} />
            </div>
            <div className="card">
              <h4><Icon name="lock" /> <T pt="Privada" en="Private" /></h4>
              <T pt={<>Registros que dizem como rotear o tráfego dentro de uma <b>VPC</b>, por exemplo <code>db.interno.exemplo</code> resolvendo só para quem está na rede.</>} en={<>Records saying how to route traffic inside a <b>VPC</b>, for example <code>db.internal.example</code> resolving only for those on the network.</>} />
            </div>
          </div>
          <h3>NS &amp; SOA</h3>
          <p><T pt={<>Ao criar uma zona pública, o Route 53 cria os registros <b>NS</b> (quatro name servers) e <b>SOA</b>. Para que a internet use essa zona, vá ao registrador do domínio (onde ele foi registrado) e configure os quatro name servers do NS padrão da zona. Para delegar um subdomínio a outra zona, crie um NS na zona do domínio raiz.</>} en={<>When you create a public zone, Route 53 creates the <b>NS</b> records (four name servers) and <b>SOA</b>. For the internet to use that zone, go to the domain's registrar (where it was registered) and set the four name servers from the zone's default NS record. To delegate a subdomain to another zone, create an NS record in the root domain's zone.</>} /></p>
          <div className="flow"><span className="node"><Icon name="cart" /> <T pt="Registrador" en="Registrar" /></span><span className="arrow">NS →</span><span className="node"><Icon name="doc" /> Route 53 HZ</span><span className="arrow">A/AAAA Alias →</span><span className="node"><Icon name="balance" /> ALB</span></div>
          <h3><T pt="Apontar o domínio para o ALB" en="Pointing the domain at the ALB" /></h3>
          <p><T pt={<>Crie um registro <b>Alias</b> do tipo A (e AAAA, se o ALB tiver IPv6) para o ALB. Quando o IP do load balancer muda, o Route 53 passa a responder com o novo sem você fazer nada. Para um alias a um recurso AWS você não define o TTL (vale o padrão do recurso) e não paga a consulta. O Alias funciona também no apex (<code>exemplo.com.br</code>), onde o CNAME não é permitido.</>} en={<>Create an <b>Alias</b> record of type A (and AAAA, if the ALB has IPv6) for the ALB. When the load balancer's IP changes, Route 53 starts answering with the new one without you doing anything. For an alias to an AWS resource you do not set the TTL (the resource's default applies) and queries are not charged. Alias also works at the apex (<code>example.com</code>), where CNAME is not allowed.</>} /></p>
          <ul>
            <li><T pt={<>O alias precisa ter o mesmo <b>nome e tipo</b> da consulta (A ou AAAA) para ser respondido.</>} en={<>The alias must match the query's <b>name and type</b> (A or AAAA) to be answered.</>} /></li>
            <li><T pt="Há políticas de roteamento além da simples: weighted, latency, failover, geolocation e geoproximity também aceitam alias." en="There are routing policies beyond simple: weighted, latency, failover, geolocation and geoproximity also accept alias." /></li>
            <li><T pt={<>Para HTTPS, emita o certificado no <a href="#acm">ACM</a> (a validação por DNS cria um CNAME nesta mesma zona).</>} en={<>For HTTPS, issue the certificate in <a href="#acm">ACM</a> (DNS validation creates a CNAME in this same zone).</>} /></li>
          </ul>
          <Callout tone="personal"><strong><T pt="Removido" en="Removed" /></strong> <T pt={"A seção \"Classes de IP\" das anotações antigas (os quatro números de um IP chamados de classes A, B, C e D) não tem apoio na documentação do Route 53 e não foi mantida."} en={"The \"IP classes\" section of the old notes (the four numbers of an IP called classes A, B, C and D) has no support in the Route 53 documentation and was not kept."} /></Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> <T pt="Quando usar" en="When to use" /></h4>
              <T pt="Domínios que apontam para recursos AWS (Alias); nomes internos por VPC (zona privada); controle do DNS junto da infraestrutura." en="Domains pointing to AWS resources (Alias); VPC-internal names (private zone); keeping DNS next to the infrastructure." />
            </div>
            <div className="card">
              <h4><Icon name="alert" /> <T pt="Quando evitar" en="When to avoid" /></h4>
              <T pt="Ter zonas duplicadas para o mesmo domínio sem saber qual está nos NS do registrador; CNAME no apex; esquecer de atualizar os NS no registrador." en="Having duplicate zones for the same domain without knowing which one the registrar's NS points to; a CNAME at the apex; forgetting to update the NS at the registrar." />
            </div>
          </div>
          <div className="fc-title"><T pt="Teste-se" en="Test yourself" /></div>
          <details className="fc">
            <summary><T pt="Onde coloco os 4 NS da Route 53 se comprei o domínio em outro lugar?" en="Where do I put Route 53's 4 NS if I bought the domain elsewhere?" /></summary>
            <div className="ans"><T pt="No painel do registrador onde o domínio foi registrado, nas configurações de name servers do domínio." en="In the panel of the registrar where the domain was registered, in the domain's name server settings." /></div>
          </details>
          <details className="fc">
            <summary><T pt="Alias ou CNAME para apontar o domínio raiz ao ALB?" en="Alias or CNAME to point the root domain at the ALB?" /></summary>
            <div className="ans"><T pt="Alias, porque CNAME não pode ficar no apex." en="Alias, because a CNAME cannot sit at the apex." /></div>
          </details>
          <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html" rel="noopener">Working with hosted zones</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" rel="noopener">Choosing between alias and non-alias records</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" rel="noopener">Supported DNS record types</a></li>
              <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" rel="noopener">ACM DNS validation</a></li>
            </ul>
            <p><T pt={<><b>Movido:</b> o item "ACM" que ficava aqui agora tem sua própria seção. <b>Não verificado nesta rodada:</b> compra/registro de domínio pelo Route 53 (a anotação antiga o citava; consulte a documentação de registro de domínios).</>} en={<><b>Moved:</b> the "ACM" item that lived here now has its own section. <b>Not verified this round:</b> buying/registering a domain through Route 53 (the old note mentioned it; see the domain registration docs).</>} /></p>
          </Sources>
        </section>
      </div>
    </>
  );
}
