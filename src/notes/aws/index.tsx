import { Callout, CodeBlock, Diagram, Icon, Sources } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "aws",
  title: "AWS: IAM, rede, contêineres e dados",
  seo: {
    title: "Notas de AWS — IAM, Organizations, VPC, ECS, RDS, S3 e mais",
    description: "Guia interativo de AWS baseado na documentação oficial: IAM, Organizations, Identity Center, OIDC, VPC, ALB, ECR, ECS, RDS, S3 e Route 53, com diagramas e simuladores.",
  },
  summary: "guia de estudo interativo de AWS (IAM, Organizations, VPC, ECS, RDS, S3, Route 53 e mais), baseado na documentação oficial.",
  kicker: "Baseado na documentação oficial",
  heroTitle: <>Aprenda <em>AWS</em> de forma visual e interativa.</>,
  heroLede: "Das contas e permissões até rede, servidores, bancos de dados e domínios. Clique, simule e teste o que aprendeu em cada seção.",
  published: "2026-10-13",
  updated: "2026-10-25",
  variant: "aws",
  runtimeIcons: ["ban", "check"],
  toc: [
    {
      label: "Contas",
      items: [
        { id: "organizations", title: "Organizations (dev e prod)" },
        { id: "accounts-roles", title: "Contas, usuários, roles e ARN" },
        { id: "budget", title: "Orçamento e cobrança" },
      ],
    },
    {
      label: "Visão geral",
      items: [
        { id: "mapa", title: "Mapa da arquitetura" },
      ],
    },
    {
      label: "Fundamentos",
      items: [
        { id: "iam", title: "IAM" },
        { id: "identity-center", title: "IAM Identity Center" },
        { id: "oidc", title: "OIDC & GitHub Actions" },
        { id: "cli", title: "AWS CLI" },
      ],
    },
    {
      label: "Rede",
      items: [
        { id: "vpc", title: "VPC" },
        { id: "sg", title: "Security Groups" },
        { id: "elb", title: "Load Balancer (ALB)" },
        { id: "acm", title: "ACM" },
      ],
    },
    {
      label: "Computação",
      items: [
        { id: "ec2", title: "EC2 & Auto Scaling" },
        { id: "ssh", title: "SSH" },
        { id: "eip", title: "IPs Elásticos" },
        { id: "ecr", title: "ECR" },
        { id: "ecs", title: "ECS" },
      ],
    },
    {
      label: "Segredos e acesso",
      items: [
        { id: "ssm", title: "Systems Manager" },
        { id: "secrets", title: "Secrets Manager" },
      ],
    },
    {
      label: "Dados",
      items: [
        { id: "rds", title: "RDS" },
        { id: "s3", title: "S3" },
      ],
    },
    {
      label: <>DNS</>,
      items: [
        { id: "dominios", title: "Domínios e DNS" },
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
            <span className="tag">Contas</span>
            <h2>AWS Organizations</h2>
            <p className="lead">Gerencie e governe várias contas AWS de forma central: criar contas, agrupá-las em OUs, aplicar políticas e ter uma fatura única.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="institution" /> Management account</h4>
              Conta que administra a organização. <b>SCPs não afetam</b> usuários e roles dela, só as contas-membro.
            </div>
            <div className="card">
              <h4><Icon name="building" /> Member accounts</h4>
              As demais contas. Cada conta AWS é um limite natural de permissão, segurança, custo e carga de trabalho.
            </div>
            <div className="card">
              <h4><Icon name="folder" /> OU</h4>
              Organizational Unit: grupo de contas (por exemplo, as que atendem a uma aplicação ou a um ambiente). Políticas anexadas a uma OU valem para as contas dentro dela.
            </div>
            <div className="card">
              <h4><Icon name="shield" /> SCP</h4>
              Service Control Policy: define o <b>máximo de permissões</b> disponível para IAM users e roles das contas. Não concede nada.
            </div>
          </div>
          <p>Exemplo de desenho (uma sugestão didática, não um padrão obrigatório da AWS): uma conta para cada ambiente, agrupadas em OUs.</p>
          <div className="vpc">
            <div className="label">Organização</div>
            <div className="flow"> <span className="node"><Icon name="institution" /> Management</span><span className="arrow">→</span> <span className="node"><Icon name="folder" /> OU Prod<br /><small>prod · &lt;ID_CONTA_PROD&gt;</small></span> <span className="node"><Icon name="folder" /> OU Non-prod<br /><small>dev · &lt;ID_CONTA_DEV&gt;</small></span> <span className="node"><Icon name="folder" /> OU Shared<br /><small>tooling: ECR, CI/CD · &lt;ID_CONTA_TOOLING&gt;</small></span> </div>
          </div>
          <p>A conta de <b>tooling/compartilhada</b> é opcional e costuma guardar o que várias contas usam, como o repositório de imagens no <a href="#ecr">ECR</a> (acesso entre contas via repository policy). Para começar, duas contas (dev e prod) já bastam.</p>
          <h3>Passo a passo: criar a organização com contas dev e prod</h3>
          <p>A ideia em uma frase: você já tem uma conta AWS; ela vira a <b>management account</b> e, a partir dela, você <b>cria</b> as contas dev e prod. Nenhuma conta nova é feita “do zero” no site da AWS: todas nascem dentro da organização.</p>
          <h4>Passo 0 · Nunca usou a AWS? Crie sua primeira conta</h4>
          <ul>
            <li>Acesse <a href="https://signup.aws.amazon.com/" rel="noopener">signup.aws.amazon.com</a> (ou o botão “Create an AWS Account” em aws.amazon.com) e informe um <b>e-mail que só você controla</b> e um nome para a conta (pode mudar depois). Esse e-mail vira o login do <b>root user</b> — a identidade mais poderosa que existe na conta, acima de qualquer usuário IAM.</li>
            <li>Confirme o e-mail (a AWS manda um código), defina uma senha forte para o root e preencha o endereço de contato.</li>
            <li>Informe um <b>cartão de crédito válido</b>. A AWS faz uma cobrança pequena e temporária só para verificar o cartão (ela estorna). Sem cartão, a conta não é criada — mesmo que você só use o nível gratuito.</li>
            <li>Confirme sua identidade por SMS ou chamada de voz (um código de verificação).</li>
            <li>Escolha um <b>plano de suporte</b>: <i>Basic</i> (gratuito; suporte só por fórum e documentação) é suficiente para aprender e para a maioria dos projetos pequenos. Dá para mudar de plano depois, a qualquer momento.</li>
            <li>Pronto: essa é a sua conta AWS. <b>Antes de fazer qualquer outra coisa</b>, ative MFA no root user (<b>IAM → Dashboard → Root user → Add MFA</b>, ou um app autenticador/chave de segurança) e nunca use o root no dia a dia — ele é só para tarefas que exigem root, como trocar o plano de suporte ou fechar a conta.</li>
          </ul>
          <Callout tone="good">
            <strong>Nível gratuito (Free Tier)</strong>
            <p>Contas novas ganham, por 12 meses, uma cota mensal gratuita de serviços comuns (por exemplo, 750 horas de uma instância EC2 <code>t2.micro</code>/<code>t3.micro</code>, 5 GB no S3). Além disso, alguns serviços têm uma cota <b>sempre gratuita</b> (não expira), como 1 milhão de requisições mensais no Lambda.</p>
            <p>Ultrapassar a cota não bloqueia nada: você simplesmente passa a pagar pelo excedente — é por isso que a seção de orçamento logo abaixo importa desde o primeiro dia.</p>
          </Callout>
          <h4>Passo 1 · Prepare a conta que será a management</h4>
          <ul>
            <li>Use a conta mais antiga e “limpa” que você tem, de preferência sem recursos de aplicação: <b>a management account não deve rodar cargas de trabalho</b>, pois SCPs não a limitam.</li>
            <li>Proteja o root user com MFA e um e-mail que você controla. Esse e-mail é o dono de toda a organização.</li>
          </ul>
          <h4>Passo 2 · Criar a organização</h4>
          <ul>
            <li>No console, entre como root ou como um admin da management account e abra <b>AWS Organizations → Create an organization</b>.</li>
            <li>Isso cria a <b>Root</b> (a raiz da árvore) e deixa a conta atual como management. O modo padrão é <b>all features</b>, o que habilita SCPs; deixe assim.</li>
            <li>Confirme o e-mail de verificação que a AWS envia (pode demorar a chegar) <b>em até 24 horas</b>; passado esse prazo, é preciso pedir o reenvio. A verificação é exigida antes de convidar contas.</li>
          </ul>
          <h4>Passo 3 · Criar as OUs</h4>
          <ul>
            <li>Em <b>AWS accounts</b>, marque a Root e use <b>Actions → Create new</b> (organizational unit). Crie <code>Prod</code> e <code>Non-prod</code>. Uma OU é só uma pasta: ela existe para você aplicar a mesma política a várias contas de uma vez.</li>
          </ul>
          <h4>Passo 4 · Criar as contas dev e prod</h4>
          <p>Antes, separe <b>dois e-mails diferentes</b> que nunca tenham sido usados em outra conta AWS (incluindo a management). Um alias como <code>nome+dev@dominio.com</code> costuma ser aceito e cai na mesma caixa de entrada, mas escolha uma caixa que a sua equipe também monitore: é por ela que se recupera o root da conta.</p>
          <ol>
            <li>Na management account: <b>AWS Organizations → AWS accounts → Add an AWS account → Create an AWS account</b>.</li>
            <li><b>AWS account name</b>: <code>dev</code>. <b>Email address of the account’s root user</b>: o e-mail exclusivo desta conta (global e único: duas contas não podem ter o mesmo). Regras da API: de 6 a 64 caracteres, só ASCII de 7 bits, um único <code>@</code>. Um e-mail inválido impede acessar o root e remover a conta depois.</li>
            <li><b>IAM role name</b>: deixe em branco para usar <code>OrganizationAccountAccessRole</code>. Essa role é criada <i>dentro</i> da conta nova, confia na management account e dá permissões de administrador. O nome não pode começar com <code>AWSServiceRoleFor</code>.</li>
            <li><b>Tags</b> (opcional, mas útil): por exemplo <code>Environment=dev</code>. Se uma tag for inválida, a requisição inteira falha e a conta não é criada.</li>
            <li>Clique em <b>Create AWS account</b>. A criação é <b>assíncrona</b>: a conta aparece na lista como pendente e pode levar alguns minutos até ficar utilizável. Atualize a página.</li>
            <li>Repita tudo para <code>prod</code>, com outro e-mail.</li>
            <li>Anote o <b>ID de 12 dígitos</b> de cada conta (<code>&lt;ID_CONTA_DEV&gt;</code> e <code>&lt;ID_CONTA_PROD&gt;</code>). Você vai usá-los em ARNs, em trust policies e nos perfis da CLI.</li>
            <li>Mova cada conta para a OU certa: marque <code>dev</code> (a caixa de seleção, não o nome) → <b>Actions → AWS account → Move</b> → <code>Non-prod</code>; <code>prod</code> → <code>Prod</code>. Contas novas nascem na Root.</li>
          </ol>
          <Callout tone="warn">
            <strong>Pegadinhas ao criar contas</strong>
            <ul>
              <li><b>“Organization still initializing” ou limite excedido logo após criar a organização:</b> espere cerca de uma hora e tente de novo; se persistir, fale com o AWS Support. Contas fechadas ou excluídas continuam contando para o limite de contas.</li>
              <li><b>Forma de pagamento:</b> conta criada pelo Organizations <b>não</b> coleta sozinha os dados para operar como conta avulsa (por exemplo, meio de pagamento). Quem paga é a management (fatura consolidada), mas se um dia você precisar <i>remover</i> a conta da organização, terá de informar esses dados antes.</li>
              <li><b>Root da conta nova:</b> contas criadas pelo Organizations nascem sem credenciais de root e, por padrão, não conseguem entrar como root nem recuperar a senha (a menos que a recuperação de conta esteja habilitada). Se uma tarefa exigir root numa conta-membro, fale com o administrador da organização. No dia a dia você não usa o root.</li>
              <li><b>Acesso do IAM ao billing:</b> a API tem o parâmetro <code>IamUserAccessToBilling</code> (padrão <code>ALLOW</code>: usuários e roles com a permissão adequada podem ver o billing da conta). Com <code>DENY</code>, só o root vê.</li>
            </ul>
          </Callout>
          <h4>Passo 5 · Dar acesso às pessoas (IAM Identity Center)</h4>
          <p>Para testar rápido, basta o <b>Switch role</b> com a <code>OrganizationAccountAccessRole</code> (ao fim deste passo). Para o dia a dia, a AWS recomenda o <a href="#identity-center">IAM Identity Center</a>: uma pessoa entra uma vez no portal e escolhe a conta e o nível de acesso, com credenciais temporárias. Tudo abaixo é feito na <b>management account</b>.</p>
          <ol>
            <li><b>Habilitar.</b> Abra o <a href="https://console.aws.amazon.com/singlesignon" rel="noopener">console do IAM Identity Center</a> e habilite-o com uma <b>instância da organização</b> (a recomendada; só ela gerencia acesso a várias contas). Escolha a região com cuidado: é nela que o serviço vive, e ela aparece depois como <code>sso_region</code> na CLI. Ao habilitar pela primeira vez, o diretório do próprio Identity Center já vem como fonte de identidade padrão.</li>
            <li><b>Criar grupos.</b> <b>Groups → Create group</b>: por exemplo <code>admins</code> e <code>devs</code>. Dê permissões a grupos, não a pessoas: quem entra ou sai do time muda só a associação.</li>
            <li><b>Criar o usuário.</b> <b>Users → Add user</b>: informe o <i>username</i> (fácil de lembrar, <b>não pode ser mudado depois</b>), deixe marcada a opção de enviar um e-mail com as instruções de senha, informe um e-mail único, nome e sobrenome e, na tela seguinte, adicione a pessoa ao grupo. Confirme em <b>Add user</b>.</li>
            <li><b>Criar os permission sets.</b> <b>Permission sets → Create permission set → Predefined permission set</b>. Sugestão: <code>AdministratorAccess</code>, <code>PowerUserAccess</code> e <code>ReadOnlyAccess</code>. A duração padrão da sessão é de 1 hora. <code>PowerUserAccess</code> não gerencia usuários e grupos IAM, ao contrário do administrador.</li>
            <li><b>Atribuir por conta.</b> <b>AWS accounts</b> (em <i>Multi-account permissions</i>) → marque a conta → <b>Assign users or groups</b> → escolha o grupo → escolha o permission set → <b>Submit</b>. O Identity Center cria dentro da conta uma role IAM gerenciada por ele. Aguarde a mensagem de que a conta foi reprovisionada.</li>
            <li><b>A pessoa ativa o acesso.</b> Ela recebe o e-mail “Invitation to join IAM Identity Center” (de <code>no-reply@signin.aws</code> ou <code>no-reply@login.awsapps.com</code>: libere esses remetentes), aceita o convite, define a senha e registra o MFA. Depois entra no <b>AWS access portal</b>, expande a organização, escolhe a conta e a role. “Role” abre o console; “Access keys” dá credenciais temporárias para CLI e SDK.</li>
          </ol>
          <p>Uma divisão razoável para começar (adapte à sua equipe):</p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th><code>dev</code></th>
                  <th><code>prod</code></th>
                  <th>Management</th>
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
                  <td>(nada)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4>Passo 5b · Usar as contas no terminal</h4>
          <p>Crie um perfil para cada conta. Pegue a <i>SSO start URL</i> e a região no portal (<b>Access keys → IAM Identity Center credentials</b>) ou a Issuer URL no painel do Identity Center. Com a CLI v2:</p>
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
          <p>O resultado em <code>~/.aws/config</code>: os dois perfis compartilham a mesma <code>sso-session</code>, então um único login vale para ambos.</p>
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
            <li><b>Alternativa rápida, sem Identity Center:</b> entre na management como um <b>usuário não-root</b> com permissão <code>sts:AssumeRole</code> sobre a role (o root não troca de role) e use <b>Switch role</b> no console com o ID da conta e a role <code>OrganizationAccountAccessRole</code>; veja <a href="#accounts-roles">Contas, usuários, roles e ARN</a>. Serve para testar, mas dá administrador total e não escala para uma equipe.</li>
            <li>Quando as credenciais expiram, rode <code>aws sso login --profile dev</code> de novo; <code>aws sso logout</code> apaga as credenciais em cache.</li>
          </ul>
          <h4>Passo 6 · Preparar cada conta (o que se repete em dev e prod)</h4>
          <p>Cada conta nasce vazia. Para receber o deploy automático do GitHub, faça o mesmo checklist nas duas, com os perfis <code>dev</code> e <code>prod</code> (as permissões de administrador só são necessárias nesta preparação inicial):</p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>O que fazer, em cada conta</th>
                  <th>Onde está o passo a passo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Escolher a região de trabalho (a mesma nas duas, para o código não mudar).</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Criar um orçamento com alerta.</td>
                  <td><a href="#budget">Orçamento e cobrança</a></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Criar rede, repositório <a href="#ecr">ECR</a>, cluster e serviço <a href="#ecs">ECS</a> (um conjunto por conta).</td>
                  <td><a href="#vpc">VPC</a>, <a href="#ecr">ECR</a>, <a href="#ecs">ECS</a></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Criar os segredos da aplicação (cada conta com os seus valores).</td>
                  <td><a href="#secrets">Secrets Manager</a></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Criar o provedor <a href="#oidc">OIDC</a> do GitHub e a role de deploy da conta.</td>
                  <td><a href="/notas/github-aws-oidc/">Nota GitHub para AWS com OIDC</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">Se preferir um repositório ECR único para todos os ambientes, use a conta de <i>tooling</i> e libere as outras por repository policy. Para começar com duas contas, um ECR por conta é mais simples e mantém o isolamento total.</p>
          <h4>Passo 7 · Conferir se ficou certo</h4>
          <CodeBlock code={`# from the management account (profile with access to it)
aws organizations describe-organization --query 'Organization.FeatureSet'   # "ALL"
aws organizations list-accounts --query 'Accounts[].[Name,Id,Status]' --output table
aws organizations list-organizational-units-for-parent --parent-id r-abcd

# each profile must land in a DIFFERENT account
aws sts get-caller-identity --profile dev
aws sts get-caller-identity --profile prod`} />
          <ul>
            <li>Esperado: <code>FeatureSet</code> igual a <code>ALL</code>; as contas <code>dev</code> e <code>prod</code> com status <code>ACTIVE</code> e IDs diferentes; cada perfil devolvendo o ID da sua própria conta.</li>
            <li>Se um perfil devolver o ID errado, o <code>sso_account_id</code> do perfil está trocado: é o erro mais comum, e o mais perigoso, porque o deploy de dev iria para a produção.</li>
          </ul>
          <h4>Passo 8 · Aplicar guardrails (opcional, mas vale a pena)</h4>
          <ul>
            <li>Habilite o tipo de política em <b>Policies → Service control policies → Enable service control policies</b>. Teste uma SCP primeiro na OU <code>Non-prod</code> (veja o exemplo mais abaixo) e só depois leve para <code>Prod</code>. Nunca comece pela Root.</li>
            <li>Para anexar: abra a OU (clique no nome) → aba <b>Policies</b> → <b>Attach</b>. A <code>FullAWSAccess</code> padrão continua anexada; só a remova se tiver uma lista de permissões (allow list) que a substitua.</li>
          </ul>
          <h4>O mesmo pelo terminal</h4>
          <p>Com a CLI autenticada na management account (os IDs abaixo são ilustrativos):</p>
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
            <strong>Como fica o resto da AWS</strong>
            <p>Cada conta é um ambiente completo e isolado: a conta <code>dev</code> tem sua própria <a href="#vpc">VPC</a>, seu RDS e seus serviços; a <code>prod</code> tem os dela. Nada é compartilhado, a não ser que você libere (por exemplo, a imagem Docker no <a href="#ecr">ECR</a> de uma conta de tooling). O mesmo código sobe nas duas contas; só muda para onde a pipeline aponta, via <a href="#oidc">OIDC</a>, com uma role por conta.</p>
          </Callout>
          <h3>Por que separar contas por ambiente</h3>
          <p>A AWS recomenda usar várias contas para separar cargas de trabalho, em vez de uma só. Por padrão não existe acesso entre contas: se produção e não-produção ficam em contas distintas, elas permanecem isoladas até você liberar explicitamente. O número de contas não altera a cobrança, que é baseada no uso dos recursos.</p>
          <h3>Simulador de herança de SCP</h3>
          <div className="widget" data-org="">
            <div className="wtitle">Clique em um nó da árvore</div>
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
            <div className="chips" aria-label="SCPs efetivas"> <span className="chip" data-id="full">FullAWSAccess</span> <span className="chip" data-id="deny-leave">Negar sair da organização</span> <span className="chip" data-id="regions">Só regiões aprovadas</span> <span className="chip" data-id="costly">Negar instâncias caras</span> </div>
            <p className="org-note" hidden><Icon name="alert" /> SCPs <b>não</b> afetam a management account.</p>
            <p className="muted">As SCPs destacadas são as efetivas: cada conta só tem o que é permitido por todos os níveis acima dela. Os nomes das SCPs aqui são ilustrativos.</p>
          </div>
          <h3>Exemplo de SCP</h3>
          <p>Exemplo didático que nega ações fora de duas regiões, com exceção de serviços globais. Adapte e teste em uma OU de teste antes de usar. A AWS publica exemplos oficiais de SCP na página de exemplos de SCP.</p>
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
            <strong>Limites e pegadinhas (segundo a documentação)</strong>
            <ul>
              <li>SCPs só existem em organizações com <b>all features</b> habilitado; no modo apenas de cobrança consolidada elas não estão disponíveis.</li>
              <li>SCP nunca concede permissão. A permissão efetiva é a interseção entre SCP/RCP e as políticas de identidade e de recurso.</li>
              <li>SCPs afetam também o root user das contas-membro, mas <b>não</b> afetam service-linked roles nem usuários de fora da organização.</li>
              <li>Não remova a <code>FullAWSAccess</code> sem substituí-la: todas as ações das contas-membro falhariam.</li>
              <li>A AWS recomenda não anexar SCPs na raiz sem testar: use uma OU e mova as contas aos poucos.</li>
              <li>Todos os caracteres da SCP contam para o tamanho máximo (veja as cotas).</li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Mais de um ambiente ou time; necessidade de guardrails (regiões, serviços); fatura única; compartilhamento central de recursos.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Aplicar SCP direto na raiz sem teste; esperar que SCP libere permissões; rodar cargas de trabalho na management account (ela não é limitada por SCP).
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Uma SCP que permite <code>s3:*</code> já dá acesso ao S3 aos usuários?</summary>
            <div className="ans">Não. SCP só define o teto. É preciso uma política IAM (ou de recurso) que conceda a permissão.</div>
          </details>
          <details className="fc">
            <summary>Qual conta não é afetada por SCPs?</summary>
            <div className="ans">A management account.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
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
            <p><b>Removido por falta de fonte oficial:</b> a anotação sobre descontos por volume e compartilhamento de Savings Plans/Reservas na fatura consolidada. Consulte a documentação de billing antes de afirmar isso.</p>
          </Sources>
        </section>
        {/* ============ ACCOUNTS, USERS, ROLES AND ARNS ============ */}
        <section className="topic" id="accounts-roles">
          <header>
            <span className="tag">Contas</span>
            <h2>Contas, usuários, roles e ARN</h2>
            <p className="lead">O que cada nome significa (e-mail do root, nome da conta, username), como criar uma identidade que não é root e como uma conta dá acesso a outra por role.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="crown" /> Root user</h4>
              É a identidade criada com a conta. Entra com o <b>e-mail da conta</b> e a senha. Tem acesso completo a todos os serviços e recursos. Use só nas tarefas que exigem root e proteja com MFA.
            </div>
            <div className="card">
              <h4><Icon name="building" /> Account name</h4>
              Um <b>rótulo</b> para humanos (por exemplo <code>dev</code>), mostrado em faturas e consoles como o Billing e o Organizations. Não é usado para entrar e não é um identificador: quem identifica a conta é o ID de 12 dígitos.
            </div>
            <div className="card">
              <h4><Icon name="user" /> Username</h4>
              Nome de uma identidade <b>que não é root</b>: um usuário IAM ou um usuário do Identity Center. Só faz sentido <i>dentro</i> de uma conta (ou de um portal) e vem sempre acompanhado de uma senha.
            </div>
            <div className="card">
              <h4><Icon name="key" /> ARN</h4>
              Amazon Resource Name: o endereço único de um recurso da AWS (um usuário, uma role, um bucket). É assim que políticas dizem “sobre quem” e “sobre o quê”.
            </div>
          </div>
          <h3>Quem é quem: root, nome da conta e username</h3>
          <p>Uma conta AWS tem <b>um</b> root e quantas identidades não-root você criar. Cada tipo de identidade entra por uma porta diferente, com dados diferentes:</p>
          <Diagram minWidth={620} caption={"Três portas para a mesma conta. O e-mail é do root; o username é de quem não é root; o nome da conta não entra em nenhum login."}>
            <svg viewBox="0 0 700 300" role="img" aria-label="Quem entra como quem">
              <rect x="330" y="14" width="360" height="272" rx="6" className="ln dash" />
              <text x="344" y="34" className="mut" textAnchor="start">Conta AWS · ID de 12 dígitos</text>
              <text x="344" y="52" className="mut" textAnchor="start">account name = só um rótulo</text>
              <rect x="10" y="70" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="92" textAnchor="middle">Entrar como root</text>
              <text x="150" y="112" className="mut" textAnchor="middle">e-mail da conta + senha</text>
              <path d="M290 97L350 97" className="ln" />
              <path d="M342.8 100.5L350 97L342.8 93.5" className="ln" />
              <rect x="350" y="70" width="320" height="54" rx="4" className="ln brandfill" />
              <text x="510" y="92" textAnchor="middle">Root user</text>
              <text x="510" y="112" className="mut" textAnchor="middle">acesso total · só tarefas raras</text>
              <rect x="10" y="142" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="164" textAnchor="middle">Entrar como usuário IAM</text>
              <text x="150" y="184" className="mut" textAnchor="middle">ID ou alias da conta + username + senha</text>
              <path d="M290 169L350 169" className="ln" />
              <path d="M342.8 172.5L350 169L342.8 165.5" className="ln" />
              <rect x="350" y="142" width="320" height="54" rx="4" className="ln fillsoft" />
              <text x="510" y="164" textAnchor="middle">IAM user</text>
              <text x="510" y="184" className="mut" textAnchor="middle">credencial de longo prazo</text>
              <rect x="10" y="214" width="280" height="54" rx="4" className="ln fillsoft" />
              <text x="150" y="236" textAnchor="middle">Entrar pelo portal</text>
              <text x="150" y="256" className="mut" textAnchor="middle">URL do portal + username (+ MFA)</text>
              <path d="M290 241L350 241" className="ln" />
              <path d="M342.8 244.5L350 241L342.8 237.5" className="ln" />
              <rect x="350" y="214" width="320" height="54" rx="4" className="ln fillsoft" />
              <text x="510" y="236" textAnchor="middle">Identity Center user → role</text>
              <text x="510" y="256" className="mut" textAnchor="middle">credenciais temporárias</text>
            </svg>
          </Diagram>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>O que é</th>
                  <th>Para que serve</th>
                  <th>Regras (documentação)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>E-mail do root</b></td>
                  <td>Definido ao criar a conta</td>
                  <td>É o login do root, junto com a senha. Também é por onde a senha do root é recuperada, então precisa ser uma caixa que você controla.</td>
                  <td>Único no mundo entre contas (veja o Passo 4 de Organizations).</td>
                </tr>
                <tr>
                  <td><b>Account name</b></td>
                  <td>Rótulo da conta</td>
                  <td>Aparece na fatura e em consoles como o Billing e o Organizations. Nenhuma política nem login depende dele.</td>
                  <td>Pode ser alterado depois (permissão <code>account:PutAccountName</code>; o root também pode). A documentação sugere um padrão como <code>organização-finalidade-ambiente</code> e evitar dados pessoais.</td>
                </tr>
                <tr>
                  <td><b>ID da conta</b></td>
                  <td>12 dígitos, gerado pela AWS</td>
                  <td>É o identificador de verdade: vai nos ARNs, nas trust policies e nos perfis da CLI.</td>
                  <td>Não muda.</td>
                </tr>
                <tr>
                  <td><b>Alias da conta</b></td>
                  <td>Apelido opcional do ID</td>
                  <td>Deixa o link de login dos usuários IAM legível: <code>https://&lt;alias&gt;.signin.aws.amazon.com/console/</code>.</td>
                  <td>De 3 a 63 caracteres; minúsculas, dígitos e hífens (sem hífen no começo ou no fim, sem dois seguidos, e não pode ser um número de 12 dígitos); único na AWS; só um por conta; não é secreto.</td>
                </tr>
                <tr>
                  <td><b>Username do usuário IAM</b></td>
                  <td>Nome do usuário dentro da conta</td>
                  <td>Junto com o ID (ou alias) e a senha, é o login de quem não é root. Também aparece no ARN: <code>arn:aws:iam::&lt;ID&gt;:user/maria</code>.</td>
                  <td>Até 64 caracteres; letras, números e <code>+ = , . @ _ -</code>; único na conta, sem distinguir maiúsculas (no login e na unicidade). Em políticas e ARNs, distingue.</td>
                </tr>
                <tr>
                  <td><b>Username do Identity Center</b></td>
                  <td>Nome do usuário no portal</td>
                  <td>Login no portal de acesso. Quem usa é a pessoa; as contas aparecem como opções depois.</td>
                  <td>De 1 a 100 caracteres; definido ao criar o usuário e não pode ser mudado depois (veja o Passo 5 de Organizations).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn"><strong>Resumindo a diferença que você perguntou</strong> O <b>e-mail do root</b> prova que você é o dono da conta e é único por conta. O <b>account name</b> é só um rótulo, e o <b>username</b> pertence a uma identidade não-root que você cria depois, dentro da conta. Nenhum dos três substitui o <b>ID da conta</b>, que é o que a AWS usa por baixo.</Callout>
          <h3>ARN: a sigla e como ler</h3>
          <p><b>ARN</b> é <b>Amazon Resource Name</b>. Segundo a documentação, ARNs identificam recursos de forma única em toda a AWS e são exigidos quando você precisa apontar um recurso sem ambiguidade, como em políticas do IAM e em chamadas de API. Um ARN não é considerado segredo, mas deve ser compartilhado com cuidado.</p>
          <Diagram minWidth={620} caption={"ARN é a sigla de Amazon Resource Name: o endereço único de qualquer recurso da AWS."}>
            <svg viewBox="0 0 700 200" role="img" aria-label="Anatomia de um ARN">
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
              <text x="52.0" y="100" className="mut" textAnchor="middle">prefixo fixo</text>
              <path d="M128.0 68L128.0 126" className="ln dash" />
              <text x="128.0" y="140" className="mut" textAnchor="middle">partição</text>
              <path d="M204.0 68L204.0 86" className="ln dash" />
              <text x="204.0" y="100" className="mut" textAnchor="middle">serviço</text>
              <path d="M287.0 68L287.0 126" className="ln dash" />
              <text x="287.0" y="140" className="mut" textAnchor="middle">região (vazia no IAM)</text>
              <path d="M417.0 68L417.0 86" className="ln dash" />
              <text x="417.0" y="100" className="mut" textAnchor="middle">ID da conta (12 dígitos)</text>
              <path d="M587.0 68L587.0 126" className="ln dash" />
              <text x="587.0" y="140" className="mut" textAnchor="middle">recurso: tipo/nome</text>
              <text x="24" y="186" className="mut mono" textAnchor="start">Alguns ARNs omitem região e conta, como o de um bucket S3: arn:aws:s3:::meu-bucket</text>
            </svg>
          </Diagram>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Recurso</th>
                  <th>ARN de exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Usuário IAM</td>
                  <td><code>arn:aws:iam::111122223333:user/maria</code></td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td><code>arn:aws:iam::111122223333:role/PowerUserFromMgmt</code></td>
                </tr>
                <tr>
                  <td>“Qualquer identidade desta conta” (usado em trust policies)</td>
                  <td><code>arn:aws:iam::111122223333:root</code></td>
                </tr>
                <tr>
                  <td>Repositório ECR</td>
                  <td><code>arn:aws:ecr:sa-east-1:111122223333:repository/meu-app</code></td>
                </tr>
                <tr>
                  <td>Bucket S3</td>
                  <td><code>arn:aws:s3:::meu-bucket</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>A partição é <code>aws</code> nas regiões comuns (<code>aws-cn</code> na China, <code>aws-us-gov</code> no GovCloud). Para achar o formato de qualquer recurso, a documentação indica a <i>Service Authorization Reference</i>. Curingas (<code>*</code>) valem no <code>Resource</code> (por exemplo <code>role/*</code>), mas não no <code>Principal</code>.</p>
          <h3>Como uma conta dá acesso à outra</h3>
          <p>A conta root (management) <b>não</b> empresta o root dela. O acesso entre contas sempre passa por uma <b>role</b>, que entrega credenciais temporárias. Há três caminhos, do mais pronto ao mais controlado:</p>
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Caminho</th>
                  <th>Como funciona</th>
                  <th>Quando usar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>1 · Já vem pronta</b></td>
                  <td>A AWS cria a role <code>OrganizationAccountAccessRole</code> dentro de toda conta criada pelo Organizations. Ela confia na management e dá administrador.</td>
                  <td>Testes e emergência. É administrador total.</td>
                </tr>
                <tr>
                  <td><b>2 · Role própria</b></td>
                  <td>Você cria uma role na conta destino, com a trust policy apontando para a origem e só as permissões necessárias. É o que o passo a passo abaixo faz.</td>
                  <td>Acesso mínimo e nomeado, por exemplo “só leitura em prod”.</td>
                </tr>
                <tr>
                  <td><b>3 · Identity Center</b></td>
                  <td>Você atribui um permission set a um grupo em cada conta; o serviço cria e gerencia as roles.</td>
                  <td>O dia a dia de pessoas (recomendado pela AWS). Passo 5 de Organizations.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>O caminho 2 precisa de <b>duas chaves</b>, uma em cada conta. É o desenho que a documentação chama de conta confiável (<i>trusted</i>, onde ficam os usuários) e conta confiante (<i>trusting</i>, onde está o recurso):</p>
          <Diagram minWidth={620} caption={"Duas chaves, uma em cada conta: a trust policy no destino e a permissão sts:AssumeRole na origem. Sem as duas, nada acontece."}>
            <svg viewBox="0 0 700 356" role="img" aria-label="Acesso entre contas com uma role">
              <rect x="10" y="14" width="260" height="300" rx="4" className="ln" />
              <text x="22" y="34" className="mut mono" textAnchor="start">Conta management · origem</text>
              <rect x="430" y="14" width="260" height="300" rx="4" className="ln" />
              <text x="442" y="34" className="mut mono" textAnchor="start">Conta dev · destino</text>
              <rect x="30" y="56" width="220" height="62" rx="4" className="ln fillsoft" />
              <text x="140" y="82" textAnchor="middle">Quem entra</text>
              <text x="140" y="102" className="mut" textAnchor="middle">usuário IAM ou Identity Center</text>
              <rect x="30" y="150" width="220" height="110" rx="4" className="ln brandfill" />
              <text x="140" y="174" textAnchor="middle">2 · Permissão na origem</text>
              <text x="140" y="198" className="mono" textAnchor="middle">Action: sts:AssumeRole</text>
              <text x="140" y="218" className="mono" textAnchor="middle">Resource: ARN da role</text>
              <text x="140" y="242" className="mut" textAnchor="middle">(política do usuário ou do grupo)</text>
              <rect x="450" y="56" width="220" height="40" rx="4" className="ln fillsoft" />
              <text x="560" y="81" className="mono" textAnchor="middle">role/PowerUserFromMgmt</text>
              <rect x="450" y="112" width="220" height="70" rx="4" className="ln brandfill" />
              <text x="560" y="136" textAnchor="middle">1 · Trust policy</text>
              <text x="560" y="156" className="mut" textAnchor="middle">quem pode assumir:</text>
              <text x="560" y="172" className="mut" textAnchor="middle">a conta management</text>
              <rect x="450" y="198" width="220" height="62" rx="4" className="ln fillsoft" />
              <text x="560" y="222" textAnchor="middle">Permissions policy</text>
              <text x="560" y="242" className="mut" textAnchor="middle">o que a role pode fazer</text>
              <rect x="300" y="56" width="100" height="62" rx="4" className="ln fillsoft" />
              <text x="350" y="82" textAnchor="middle">AWS STS</text>
              <text x="350" y="102" className="mut" textAnchor="middle">3 · assume</text>
              <path d="M250 78L300 78" className="ln" />
              <path d="M292.8 81.5L300 78L292.8 74.5" className="ln" />
              <path d="M400 78L450 76" className="ln" />
              <path d="M442.9 79.8L450 76L442.7 72.8" className="ln" />
              <path d="M300 104L250 104" className="ln dash" />
              <path d="M257.2 100.5L250 104L257.2 107.5" className="ln" />
              <text x="350" y="140" className="mut" textAnchor="middle">credenciais</text>
              <text x="350" y="156" className="mut" textAnchor="middle">temporárias</text>
              <text x="10" y="336" className="mut" textAnchor="start">Passos 1 e 2 são configuração (uma vez). O passo 3 acontece a cada sessão e dura, por padrão, 1 hora.</text>
            </svg>
          </Diagram>
          <Callout tone="warn"><strong>Pegadinhas que travam o acesso</strong> O <b>root não consegue trocar de role</b>: a documentação diz que não dá para trocar de role entrando como root; só como usuário IAM, usuário do IAM Identity Center ou identidade federada. Entre como um admin não-root (veja abaixo). Além disso, a trust policy só <i>permite</i> que a conta confie; <b>cada usuário ou grupo</b> da origem ainda precisa da permissão <code>sts:AssumeRole</code> sobre o ARN da role. Se um ARN de usuário ou role citado no <code>Principal</code> for apagado e recriado, a trust policy precisa ser editada, porque a AWS guarda um ID interno.</Callout>
          <h3>Passo a passo</h3>
          <p>Cenário: você tem a conta management (<code>&lt;ID_CONTA_MGMT&gt;</code>, só com o root) e a conta <code>dev</code> (<code>&lt;ID_CONTA_DEV&gt;</code>, criada pelo Organizations). Meta: uma pessoa não-root da management trabalhar na dev com permissão limitada.</p>
          <h4>Passo A · Criar uma identidade que não é root na management</h4>
          <Callout tone="good"><strong>O caminho recomendado</strong> A AWS recomenda que pessoas usem credenciais temporárias (federação) e reserva usuários IAM para os casos que isso não atende, como um acesso de emergência. Para pessoas, siga o <b>Passo 5 de Organizations</b> (IAM Identity Center). O roteiro abaixo, da documentação “Create an IAM user for emergency access”, cria um <b>usuário IAM</b>: serve para aprender e para ter um administrador não-root. Na nova experiência de console da AWS, usuários IAM com acesso ao console não podem ser criados.</Callout>
          <ol>
            <li>Entre na management como root (uma das raras vezes em que ele é necessário aqui) e, em <b>IAM</b>, escolha <b>Users → Create user</b>.</li>
            <li>Em <b>Specify user details → User name</b>, escreva o <i>username</i> (por exemplo <code>maria</code>). É o nome de login dela. Marque <b>Provide user access to the AWS Management Console</b> e escolha <b>I want to create an IAM user</b>.</li>
            <li>Em <b>Console password</b>, escolha <b>Autogenerated password</b> (ou uma senha personalizada) e mantenha marcado <b>User must create a new password at next sign-in (recommended)</b>. Clique em <b>Next</b>.</li>
            <li>Em <b>Set permissions</b>, escolha <b>Add user to group → Create group</b>. Nome do grupo: <code>admins</code>; em <b>Permissions policies</b>, marque <code>AdministratorAccess</code> e clique em <b>Create user group</b>. De volta à lista, marque o grupo novo e clique em <b>Next</b>. Dê permissões ao grupo, não ao usuário.</li>
            <li>Em <b>Review and create</b>, confira e clique em <b>Create user</b>. Na página <b>Retrieve password</b>, use <b>Download .csv file</b>: o arquivo traz a <i>Connection URL</i>, o username e a senha. Entregue por um canal seguro.</li>
            <li>A pessoa entra em <code>https://&lt;ID_CONTA_MGMT&gt;.signin.aws.amazon.com/console/</code> (ou em <code>console.aws.amazon.com</code>, digitando o ID ou alias) com <b>ID da conta, username e senha</b>. A documentação recomenda digitar essa URL no favorito à mão, porque redirecionamentos podem esconder o endereço real.</li>
            <li>Registre o <b>MFA</b>: <b>IAM → Users → maria → Security credentials → Multi-factor authentication (MFA) → Assign MFA device</b>, informe um nome, escolha <b>Authenticator app</b> e digite dois códigos seguidos. A AWS recomenda, quando possível, passkey ou chave de segurança no lugar do app. Depois disso, o root volta para o cofre.</li>
            <li>(Opcional) Crie um <b>alias</b> para o link ficar legível: <b>IAM → Dashboard → AWS Account → Account Alias → Create</b> (exige <code>iam:CreateAccountAlias</code>). Só existe um alias por conta, e o link com o ID continua funcionando.</li>
          </ol>
          <p>O mesmo pela CLI, no padrão da documentação (a senha vai num arquivo JSON, não na linha de comando):</p>
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
          <p>A senha precisa respeitar a política de senhas da conta; se não respeitar, o erro é <code>PasswordPolicyViolation</code>.</p>
          <h4>Passo B · Criar a role na conta dev (as chaves 1 e 2)</h4>
          <p>Entre na <b>dev</b> como administrador. Como a conta foi criada pelo Organizations, ela tem a <code>OrganizationAccountAccessRole</code> (administrador total, confiando em toda a management) e <b>não tem credenciais de root</b>: contas-membro criadas assim não entram como root nem recuperam a senha, a menos que a recuperação esteja habilitada.</p>
          <p>Use a role a partir de um usuário não-root da management (ou o permission set de administrador do Identity Center).</p>
          <ol>
            <li><b>IAM → Roles → Create role</b>. Em <b>Trusted entity type</b>, escolha <b>AWS account</b> → <b>Another AWS account</b> e informe o ID da management (<code>&lt;ID_CONTA_MGMT&gt;</code>). Isso gera a <b>trust policy</b>: quem pode assumir a role.</li>
            <li>Marque <b>Require MFA</b>: só entra quem fez login com MFA. (Não marque <i>Require external ID</i>: ela é para contas de terceiros e impede o uso pelo console.)</li>
            <li>Em permissões, escolha o <b>mínimo</b> necessário (por exemplo <code>PowerUserAccess</code> ou <code>ReadOnlyAccess</code>). Por padrão, uma role não tem permissão nenhuma.</li>
            <li>Em <b>Role name</b>, use <code>PowerUserFromMgmt</code> (até 64 caracteres; diferencia maiúsculas no ARN; não dá para renomear depois). Crie e copie o <b>ARN da role</b> (na página da role, <b>Summary</b>): <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/PowerUserFromMgmt</code>. A mesma página mostra o link de <i>Switch role</i> já preenchido.</li>
          </ol>
          <p>A trust policy gerada tem esta forma. O <code>:root</code> no <code>Principal</code> significa “esta conta”, e não o usuário root: quem de fato pode assumir é decidido pelas permissões dentro da management (Passo C).</p>
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
          <h4>Passo C · Liberar a permissão na management (a chave 2)</h4>
          <ol>
            <li>Na <b>management</b>: <b>IAM → Policies → Create policy → JSON</b>. Cole a política abaixo, com o ARN da role da dev, e salve como <code>assume-dev-poweruser</code>.</li>
            <li>Anexe a política ao grupo <code>admins</code> (ou a um grupo só para isso). Evite <code>Resource: "*"</code>: ele permitiria assumir qualquer role de qualquer conta que confie na sua. (Pelo editor visual: <b>Create policy → Visual</b>, serviço <b>STS</b>, ação <b>AssumeRole</b>, recurso <b>Specific → Add ARNs → Other account</b>, com o ID da dev e o nome da role.)</li>
          </ol>
          <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::<ID_CONTA_DEV>:role/PowerUserFromMgmt"
  }
}`} />
          <h4>Passo D · Usar a role (a etapa 3 do diagrama)</h4>
          <ul>
            <li><b>Console.</b> A pessoa entra na management, clica no nome dela na barra superior e escolhe <b>Switch role</b>. Em <b>Account</b>, o ID (ou alias) da dev; em <b>Role</b>, <code>PowerUserFromMgmt</code>; opcionalmente um <b>Display name</b> e uma cor (por exemplo vermelho para prod). <b>Switch Role</b>. Ou usa o link <code>https://signin.aws.amazon.com/switchrole?account=&lt;ID_CONTA_DEV&gt;&amp;roleName=PowerUserFromMgmt</code>. Para voltar: o nome de exibição na barra → <b>Switch back</b>.</li>
            <li><b>CLI.</b> Um perfil que usa as credenciais da management como origem e assume a role. Como a trust policy exige MFA, o perfil precisa do <code>mfa_serial</code> (o ARN do dispositivo de MFA do usuário); a CLI pede o código de 6 dígitos ao usar. Sem <code>mfa_serial</code>, a chamada falha com AccessDenied.</li>
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
          <p>Repare no ARN devolvido: <code>assumed-role</code>, a conta <b>dev</b> e o nome da sessão (<code>role_session_name</code>), que também aparece nos logs do CloudTrail.</p>
          <p>É a prova de que a pessoa opera <b>na dev</b>. Só um conjunto de permissões vale por vez: ao assumir a role, ela deixa de lado as permissões do usuário e fica com as da role. A sessão da CLI dura 1 hora, salvo se você pedir outra duração (<code>--duration-seconds</code>, até o máximo configurado na role).</p>
          <p>Este perfil usa as chaves de um usuário IAM como origem. Para quem entra pelo Identity Center, não encadeie roles: atribua um permission set na conta dev (caminho 3).</p>
          <Callout tone="personal"><strong>Observação sobre a nota de Organizations</strong> Os passos acima usam o root só para criar o primeiro administrador. Segundo a documentação do Organizations, para usar a <code>OrganizationAccountAccessRole</code> é preciso entrar como um usuário da management com permissão <code>sts:AssumeRole</code> sobre ela. Por isso, no Passo 5b de Organizations, entre como esse usuário não-root.</Callout>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O account name serve para entrar na conta?</summary>
            <div className="ans">Não. É só um rótulo. O root entra com o e-mail; o usuário IAM, com o ID (ou alias) da conta, o username e a senha.</div>
          </details>
          <details className="fc">
            <summary>Por que só criar a role na dev não basta?</summary>
            <div className="ans">Falta a segunda chave: a permissão sts:AssumeRole sobre o ARN da role, dada a um usuário ou grupo na conta de origem.</div>
          </details>
          <details className="fc">
            <summary>O que significa ARN e onde ele aparece?</summary>
            <div className="ans">Amazon Resource Name, o endereço único de um recurso. Aparece em Resource e Principal das políticas, em trust policies, em perfis da CLI e nas respostas de get-caller-identity.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-24"}>
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
            <p>Os passos, as opções do console e os comandos seguem a documentação citada; nada foi executado numa conta real.</p>
          </Sources>
        </section>
        {/* ============ BUDGET ============ */}
        <section className="topic" id="budget">
          <header>
            <span className="tag">Contas</span>
            <h2>Orçamento e cobrança</h2>
            <p className="lead">Saber quanto você está gastando, ser avisado antes de gastar demais, e entender a fatura — para uma conta só ou para uma organização inteira.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="coins" /> AWS Billing and Cost Management</h4>
              O painel central: fatura atual, histórico, métodos de pagamento e créditos.
            </div>
            <div className="card">
              <h4><Icon name="bolt" /> AWS Budgets</h4>
              Você define um limite (de custo, de uso ou de cobertura de Savings Plan) e a AWS avisa por e-mail/SNS quando ultrapassar, ou está previsto ultrapassar.
            </div>
            <div className="card">
              <h4><Icon name="balance" /> Cost Explorer</h4>
              Gráficos do gasto ao longo do tempo, filtrados por serviço, conta, tag e muito mais. Até 12 meses de histórico, de graça.
            </div>
            <div className="card">
              <h4><Icon name="tree" /> Fatura consolidada</h4>
              Numa <a href="#organizations">Organization</a>, a management account recebe UMA fatura com o total de todas as contas-membro.
            </div>
          </div>
          <h3>Passo a passo: o primeiro orçamento com alerta</h3>
          <p>A ideia em uma frase: um Budget não impede gasto nenhum sozinho — ele só <b>avisa</b>. Para realmente travar, combine com uma SCP ou automação (veja o aviso mais abaixo).</p>
          <h4>Passo 1 · Criar um Budget de custo mensal</h4>
          <ul>
            <li>Abra <b>Billing and Cost Management → Budgets → Create a budget</b> e escolha <b>Cost budget</b>.</li>
            <li>Defina um valor mensal (por exemplo, US$ 20 enquanto estiver estudando) e o período (recorrente, mês a mês).</li>
            <li>Adicione alertas em vários limiares: por exemplo, 50% do real (já gasto) e 100% do <b>previsto</b> (forecast) — o previsto avisa ANTES de você realmente estourar.</li>
            <li>Informe um e-mail (ou um tópico SNS, se quiser integrar com Slack/chat depois) para receber o alerta.</li>
          </ul>
          <h4>Passo 2 · Ativar o alarme clássico de cobrança (opcional, mas simples)</h4>
          <ul>
            <li>Em <b>Billing and Cost Management → Billing preferences</b>, marque <b>Receive Billing Alerts</b>.</li>
            <li>No CloudWatch, <b>sempre na região <code>us-east-1</code></b> (é onde a métrica de cobrança vive, mesmo que seus recursos estejam em outra região), crie um alarme sobre a métrica <code>EstimatedCharges</code>.</li>
          </ul>
          <h4>O mesmo pelo terminal</h4>
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
          <h3>Cost allocation tags: o custo, explicado por etiqueta</h3>
          <p>Tags como <code>Project=loja</code> ou <code>Environment=dev</code> nos seus recursos viram colunas no Cost Explorer depois de ativadas em <b>Billing → Cost allocation tags</b>. É a forma de responder “quanto cada projeto/time/ambiente está custando?” sem precisar de uma conta separada para cada um.</p>
          <Callout tone="good">
            <strong>Numa Organization: a fatura consolidada</strong>
            <p>A management account vê e paga o total; cada conta-membro vê <b>só o próprio gasto</b> em <b>Billing → Bills</b>, a não ser que a management libere mais acesso. Budgets podem ser criados tanto na management (cobrindo tudo ou uma conta específica via filtro de <code>LINKED_ACCOUNT</code>) quanto dentro de cada conta-membro, para o próprio gasto.</p>
          </Callout>
          <Callout tone="warn">
            <strong>Um Budget não desliga nada sozinho</strong>
            <ul>
              <li>Por padrão, estourar um Budget só manda um e-mail — os recursos continuam rodando e cobrando.</li>
              <li>Para um limite que realmente BLOQUEIA, combine com uma <a href="#organizations">SCP</a> que nega ações caras numa conta de estudo, ou uma automação (ex.: uma função Lambda disparada pelo alerta do Budget, que para instâncias).</li>
              <li>Por padrão, só o <b>root user</b> (ou um usuário/role com a permissão explícita) vê a página de Billing. Ative <b>IAM user and role access to Billing</b> em Account settings se quiser dar acesso de leitura a outros usuários IAM.</li>
            </ul>
          </Callout>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Um alerta de Budget em 100% impede que você continue gastando?</summary>
            <div className="ans">Não sozinho. Ele só notifica; bloquear de verdade exige uma SCP ou automação adicional.</div>
          </details>
          <details className="fc">
            <summary>Por que o alarme clássico de cobrança precisa ser criado em us-east-1?</summary>
            <div className="ans">Porque a métrica <code>EstimatedCharges</code> do CloudWatch só existe nessa região, independentemente de onde seus recursos rodam.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-18"}
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
            <span className="tag">Visão geral</span>
            <h2>Mapa da arquitetura</h2>
            <p className="lead">Um caminho típico de uma requisição. Clique em cada peça para entender o papel dela. Cada seção abaixo traz os links da documentação oficial.</p>
          </header>
          <div className="widget" data-explorer="">
            <div className="wtitle">Explorador</div>
            <div className="flow"> <button className="node" data-t="x-dns"><Icon name="globe" /> DNS</button><span className="arrow">→</span> <button className="node" data-t="x-elb"><Icon name="balance" /> ELB</button><span className="arrow">→</span> <button className="node" data-t="x-ec2"><Icon name="server" /> EC2</button><span className="arrow">→</span> <button className="node" data-t="x-rds"><Icon name="database" /> RDS</button> </div>
            <div className="flow"> <button className="node" data-t="x-iam"><Icon name="lock" /> IAM</button> <button className="node" data-t="x-vpc"><Icon name="network" /> VPC</button> <button className="node" data-t="x-s3"><Icon name="bucket" /> S3</button> <button className="node" data-t="x-ecr"><Icon name="box" /> ECR</button> <button className="node" data-t="x-ecs"><Icon name="grid" /> ECS</button> </div>
            <div className="panel">
              <div id="x-dns"><b>Route 53</b> traduz <code>meusite.com.br</code> no endereço do load balancer.</div>
              <div id="x-elb" hidden><b>ELB</b> é o ponto único de entrada: recebe o tráfego, termina o HTTPS com o certificado (ACM) e distribui entre os destinos saudáveis.</div>
              <div id="x-ec2" hidden><b>EC2</b> são os servidores onde seu código roda, em subnets públicas ou privadas, protegidos por Security Groups.</div>
              <div id="x-rds" hidden><b>RDS</b> é o banco de dados gerenciado. Fica numa subnet privada, sem acesso direto da internet.</div>
              <div id="x-iam" hidden><b>IAM</b> define quem pode fazer o quê em toda a conta.</div>
              <div id="x-vpc" hidden><b>VPC</b> é a rede privada que contém tudo isso: subnets, rotas e gateways.</div>
              <div id="x-s3" hidden><b>S3</b> guarda arquivos (imagens, backups, sites estáticos) com alta durabilidade.</div>
              <div id="x-ecs" hidden><b>ECS</b> roda os containers das imagens do ECR como tasks de um service, atrás do load balancer, e faz os deploys (rolling update).</div>
              <div id="x-ecr" hidden><b>ECR</b> guarda as imagens Docker que EC2, ECS e EKS baixam para executar.</div>
            </div>
          </div>
        </section>
        {/* ============ IAM ============ */}
        <section className="topic" id="iam">
          <header>
            <span className="tag">Fundamentos · 01</span>
            <h2>IAM</h2>
            <p className="lead">Identity and Access Management: o serviço que controla quem se autentica (login) e quem está autorizado (permissões) a usar os recursos da AWS.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="crown" /> Root user</h4>
              Identidade criada junto com a conta, com acesso total. A AWS recomenda <b>não</b> usá-la no dia a dia. Algumas tarefas exigem o root, e a documentação lista quais.
            </div>
            <div className="card">
              <h4><Icon name="user" /> User</h4>
              Identidade com credenciais de longo prazo (senha, access keys). A AWS recomenda usá-lo só quando federação e roles não servem, por exemplo em ferramentas de terceiros que não suportam o IAM Identity Center.
            </div>
            <div className="card">
              <h4><Icon name="users" /> User Group</h4>
              Coleção de usuários IAM: anexe a política ao grupo e todos herdam. Um usuário pode estar em vários grupos. Grupos <b>não</b> podem ser aninhados e não podem ser <code>Principal</code> em uma política.
            </div>
            <div className="card">
              <h4><Icon name="badge" /> Role</h4>
              Identidade sem credenciais próprias de longo prazo, feita para ser <b>assumida</b> por quem precisar (pessoas, outras contas, serviços AWS ou IdPs externos). Ao assumir, você recebe credenciais temporárias da sessão.
            </div>
          </div>
          <Callout><strong>Role = permissões + confiança</strong> Uma role tem dois tipos de política: a <b>política de permissões</b> (o que a role pode fazer) e a <b>trust policy</b> (quem pode assumi-la). A trust policy é uma política baseada em recurso, obrigatória em toda role.</Callout>
          <h3>Fluxo comum com grupos</h3>
          <div className="flow"> <span className="node"><Icon name="doc" /> Policy</span><span className="arrow">→</span> <span className="node"><Icon name="users" /> User Group (Devs)</span><span className="arrow">→</span> <span className="node"><Icon name="user" /> Users</span> </div>
          <h3>Anatomia de uma política</h3>
          <p>Uma política é um documento JSON. Exemplo de permissão para enviar (push) imagens a um repositório do ECR, com placeholders no lugar de IDs reais:</p>
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
                <th>Significado</th>
              </tr>
              <tr>
                <td><code>Version</code></td>
                <td>Versão da linguagem de política. Os exemplos da AWS usam <code>2012-10-17</code>.</td>
              </tr>
              <tr>
                <td><code>Effect</code></td>
                <td><code>Allow</code> ou <code>Deny</code>.</td>
              </tr>
              <tr>
                <td><code>Action</code></td>
                <td>As operações da API do serviço. Normalmente é preciso listar várias ações.</td>
              </tr>
              <tr>
                <td><code>Resource</code></td>
                <td>Sobre quais recursos vale, identificados pelo ARN (Amazon Resource Name).</td>
              </tr>
              <tr>
                <td><code>Condition</code></td>
                <td>Opcional. Restringe quando a permissão vale (ex.: exigir TLS, limitar a um IP).</td>
              </tr>
            </tbody>
          </table>
          <Callout tone="warn"><strong>Pegadinha: negar vence</strong> Um <code>Deny</code> explícito (em política de identidade, SCP ou RCP) sobrepõe qualquer <code>Allow</code>. Em contas de uma organização, a permissão efetiva é a interseção entre as políticas IAM e as SCPs.</Callout>
          <Callout tone="good"><strong>Boas práticas oficiais (resumo)</strong> Pessoas acessam por federação com credenciais temporárias (a AWS recomenda o IAM Identity Center); cargas de trabalho usam roles; exija MFA onde houver usuário IAM ou root; aplique privilégio mínimo; revise e remova credenciais não usadas; use várias contas com Organizations e SCPs como guardrails. Veja as seções <a href="#organizations">Organizations</a> e <a href="#identity-center">IAM Identity Center</a>.</Callout>
          <Callout tone="personal"><strong>Mudança em relação às anotações antigas</strong> As anotações sugeriam criar usuários, grupos e roles separados por ambiente (dev, staging, prod) dentro da mesma conta. A documentação recomenda separar as cargas de trabalho em <b>contas diferentes</b>, gerenciadas com Organizations.</Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Roles para serviços e CI/CD; grupos + políticas quando houver usuários IAM; Access Analyzer para revisar permissões.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Usuário IAM com access key de longo prazo para pessoas ou para workloads que poderiam usar role; uso do root no dia a dia.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Por que usar grupos em vez de políticas direto no usuário?</summary>
            <div className="ans">Muda uma vez e vale para todos do grupo. Quem troca de função só muda de grupo.</div>
          </details>
          <details className="fc">
            <summary>Qual a diferença entre User e Role?</summary>
            <div className="ans">User tem credenciais de longo prazo e dono fixo. Role é assumida por quem precisar e entrega credenciais temporárias.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Fundamentos · 02</span>
            <h2>IAM Identity Center</h2>
            <p className="lead">Login único (SSO) para a força de trabalho: pessoas entram uma vez e acessam várias contas AWS e aplicações, com credenciais temporárias.</p>
          </header>
          <p>O IAM Identity Center (antigo AWS Single Sign-On) conecta o seu provedor de identidade existente, sincronizando usuários e grupos, ou permite criar e gerenciar usuários direto nele. Para acesso a contas, a AWS o recomenda como forma de dar acesso a pessoas. Não há cobrança adicional pelo IAM Identity Center; você paga pelos recursos que usa.</p>
          <div className="flow"> <span className="node"><Icon name="user" /> Pessoa</span><span className="arrow">→</span> <span className="node"><Icon name="gateway" /> AWS access portal</span><span className="arrow">→</span> <span className="node"><Icon name="ticket" /> Permission set</span><span className="arrow">→</span> <span className="node"><Icon name="building" /> Contas staging / prod</span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="institution" /> Instância da organização</h4>
              É a melhor prática e a única que permite gerenciar acesso a contas AWS. Fica na management account do Organizations.
            </div>
            <div className="card">
              <h4><Icon name="ticket" /> Permission set</h4>
              Modelo que reúne uma ou mais políticas IAM. Ao atribuí-lo a um usuário ou grupo em uma conta, o Identity Center cria e mantém uma role IAM nela e anexa as políticas.
            </div>
            <div className="card">
              <h4><Icon name="key" /> Credenciais temporárias</h4>
              A duração da sessão da conta vem do permission set (padrão de 1 hora, máximo de 12 horas). A sessão no portal tem outro limite (padrão de 8 horas, máximo de 90 dias).
            </div>
          </div>
          <h3>Permission sets na prática</h3>
          <ul>
            <li>Permission sets exigem a instância da organização com <i>multi-account permissions</i> habilitado (padrão ao criar a instância).</li>
            <li>Aceitam políticas gerenciadas pela AWS, gerenciadas pelo cliente, inline e de função de trabalho, além de uma permissions boundary.</li>
            <li>Você pode atribuir mais de um permission set à mesma pessoa. A documentação recomenda escolher, no portal, o mais restritivo que resolve a tarefa, em vez de sempre usar administrador.</li>
            <li>Exemplo da documentação: <code>PowerUserAccess</code> não permite gerenciar usuários e grupos IAM, ao contrário de <code>AdministratorAccess</code>.</li>
            <li>Precisa de recursos além do que permission sets oferecem (trust policy customizada, tags de role)? Veja o <i>account access manager</i> do IAM.</li>
          </ul>
          <h3>Uso no terminal</h3>
          <CodeBlock code={`aws configure sso          # cria o perfil (sso-session, conta e permission set)
aws sso login --profile meu-perfil
aws sts get-caller-identity --profile meu-perfil
aws sso logout`} />
          <p className="muted">Quando as credenciais do SSO expiram, é preciso fazer login de novo. Veja também a seção <a href="#cli">AWS CLI</a>.</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Pessoas que acessam várias contas (staging, prod, tooling); quando se quer um único ponto de login e permissões centralizadas por perfil de trabalho.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Para pipelines de CI/CD e workloads (use roles com <a href="#oidc">OIDC</a>); instâncias de conta para gerenciar acesso a várias contas (só a instância da organização faz isso).
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O que o Identity Center cria na conta quando você atribui um permission set?</summary>
            <div className="ans">Uma role IAM gerenciada por ele, com as políticas do permission set anexadas.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Fundamentos · 03</span>
            <h2>OIDC &amp; GitHub Actions</h2>
            <p className="lead">Federação OIDC: um serviço externo (como o GitHub Actions) prova quem é com um token e troca por credenciais temporárias da AWS, sem guardar access keys.</p>
          </header>
          <p>A AWS recomenda <b>não</b> guardar credenciais de longo prazo em aplicações fora da AWS. Com OIDC, o provedor emite um JSON Web Token (JWT); a AWS valida o token e devolve credenciais temporárias de uma role IAM. A operação da API é <code>AssumeRoleWithWebIdentity</code> (AWS STS).</p>
          <div className="flow"> <span className="node"><Icon name="gear" /> GitHub Actions</span><span className="arrow">① JWT →</span> <span className="node"><Icon name="badge" /> Provedor OIDC no IAM</span><span className="arrow">② AssumeRoleWithWebIdentity →</span> <span className="node"><Icon name="badge" /> Role + trust policy</span><span className="arrow">③ credenciais temporárias →</span> <span className="node"><Icon name="cloud" /> Recursos AWS</span> </div>
          <h3>1 · Criar o provedor OIDC no IAM</h3>
          <ul>
            <li>A URL do provedor começa com <code>https://</code>, não tem porta e não tem query string. É sensível a maiúsculas e deve ser única na conta. Para o GitHub Actions: <code>https://token.actions.githubusercontent.com</code>.</li>
            <li>O campo <b>Audience</b> (<code>aud</code>) deve bater com o valor que o provedor coloca no token. Para o GitHub Actions no console, é <code>sts.amazonaws.com</code>.</li>
            <li>A AWS verifica o certificado do endpoint JWKS com sua biblioteca de CAs confiáveis; thumbprints só entram como alternativa quando o certificado não é de uma CA conhecida.</li>
            <li>O provedor OIDC usado na trust policy precisa estar na <b>mesma conta</b> da role.</li>
          </ul>
          <h3>2 · Trust policy da role</h3>
          <p>O GitHub é um provedor OIDC <b>compartilhado</b> entre muitos clientes. Por isso o IAM exige que a trust policy avalie a condição <code>token.actions.githubusercontent.com:sub</code>, e o valor não pode ser só um curinga. Sem essa restrição, workflows de repositórios fora do seu controle poderiam assumir a role. Exemplo restrito a um repositório e uma branch:</p>
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
          <h3>O claim <code>sub</code> do GitHub</h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Contexto do job</th>
                  <th>sub</th>
                </tr>
                <tr>
                  <td>Branch</td>
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
            <li>Se o job referencia um <b>environment</b>, o <code>sub</code> usa o formato de environment (ele tem prioridade). Pull request só aparece quando não há environment. Branch e tag valem quando não há environment nem pull request.</li>
            <li>Para restringir <b>repositório</b>, use <code>StringLike</code> com <code>repo:ORG/REPO:*</code>. Para <b>branch</b>, use o valor exato da branch. Para <b>environment</b>, use <code>repo:ORG/REPO:environment:producao</code> e proteja o environment com regras de deploy (quais branches e tags podem fazer deploy nele), como a AWS e o GitHub recomendam.</li>
            <li>Repositórios novos podem emitir o formato <i>imutável</i>, que inclui IDs: <code>repo:ORG@ORG_ID/REPO@REPO_ID:...</code>. A documentação da action avisa que, se a trust policy usa o formato antigo e o repositório emite o novo, o assume-role falha com "Not authorized". Confira o formato que o seu repositório emite.</li>
            <li>Dois-pontos dentro de valores aparecem como <code>%3A</code> no <code>sub</code>.</li>
          </ul>
          <p><b>E o workflow?</b> O arquivo completo (um para <code>develop</code> e <code>main</code>), os environments do GitHub, o build da imagem, o ECR e a troca no ECS estão na nota <a href="/notas/github-aws-oidc/">GitHub para AWS: OIDC, Docker, ECR e ECS</a>. Aqui ficam só os conceitos da AWS. A action usada é a <code>aws-actions/configure-aws-credentials</code> e o job precisa de <code>permissions: id-token: write</code>.</p>
          <Callout tone="warn">
            <strong>Pegadinhas</strong>
            <ul>
              <li>Uma role por ambiente (staging, prod) e, idealmente, cada uma na sua própria conta, com <code>sub</code> diferente.</li>
              <li>A trust policy de uma role OIDC só pode ter um tipo de provedor; para vários IdPs, crie uma role para cada.</li>
              <li>O IAM aceita o token por até 5 minutos além do <code>exp</code>, por causa de diferença de relógio.</li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              CI/CD que precisa chamar a AWS (push no ECR, deploy no ECS, sync no S3) sem access keys guardadas como secret.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Trust policy com <code>sub</code> aberto (ex.: <code>repo:ORG/*</code> em produção); pessoas fazendo login (prefira <a href="#identity-center">Identity Center</a>).
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Por que a condição em <code>sub</code> é obrigatória para o GitHub?</summary>
            <div className="ans">Porque o provedor é compartilhado: sem ela, workflows de qualquer repositório poderiam assumir a sua role.</div>
          </details>
          <details className="fc">
            <summary>Que permissão o job precisa para pedir o token?</summary>
            <div className="ans"><code>permissions: id-token: write</code>.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html" rel="noopener">OIDC federation (IAM)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html" rel="noopener">Create an OpenID Connect (OIDC) identity provider in IAM</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html" rel="noopener">Create a role for OpenID Connect federation (inclui a seção sobre GitHub)</a></li>
              <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc_secure-by-default.html" rel="noopener">Identity-provider controls for shared OIDC providers</a></li>
              <li><a href="https://github.com/aws-actions/configure-aws-credentials" rel="noopener">aws-actions/configure-aws-credentials (repositório oficial da action)</a></li>
              <li><a href="https://docs.github.com/en/actions/reference/security/oidc" rel="noopener">GitHub Docs: OpenID Connect reference (formatos de sub)</a></li>
            </ul>
            <p>Os formatos de <code>sub</code> e o comportamento do GitHub vêm da documentação do GitHub, não da AWS. Revise-os na fonte antes de aplicar em produção.</p>
          </Sources>
        </section>
        {/* ============ CLI ============ */}
        <section className="topic" id="cli">
          <header>
            <span className="tag">Fundamentos · 04</span>
            <h2>AWS CLI (Linux)</h2>
            <p className="lead">Controle serviços da AWS pela linha de comando. Esta página usa a versão 2 do AWS CLI.</p>
          </header>
          <h3>Instalar</h3>
          <p>O script de instalação é o método recomendado pela documentação. Por padrão ele instala só para o usuário atual, em <code>$HOME/.local</code>. O método com <code>sudo</code> e <code>--system</code> instala para todos.</p>
          <CodeBlock code={`curl -fsSL https://awscli.amazonaws.com/v2/install.sh | bash
aws --version`} />
          <Callout tone="warn"><strong>Cuidado</strong> Rodar um script baixado direto no shell é uma escolha sua. A documentação também oferece o instalador em .zip, com verificação opcional de assinatura (GPG), e um pacote <code>snap</code>. No Amazon Linux, remova antes o pacote <code>awscli</code> do <code>yum</code> se quiser a versão mais recente.</Callout>
          <h3>Atualizar e remover</h3>
          <CodeBlock code={`aws update`} />
          <p>Em instalações feitas pelo script ou pelos instaladores oficiais, o comando acima atualiza o CLI. Se foi instalado para todos os usuários, rode-o com <code>sudo</code>. Para desinstalar, siga a página oficial de desinstalação (link abaixo).</p>
          <Callout tone="personal"><strong>Correção</strong> A anotação antiga dizia para repetir o comando de instalação com <code>--update</code> e removia arquivos à mão. A documentação atual traz o comando <code>aws update</code>. Os passos manuais de remoção foram trocados por link para a página oficial.</Callout>
          <h3>Quem sou eu? e login</h3>
          <CodeBlock code={`aws sts get-caller-identity --profile meu-perfil`} />
          <p>Mostra a identidade (conta e ARN) das credenciais em uso. Para pessoas, configure o login com <a href="#identity-center">IAM Identity Center</a> (<code>aws configure sso</code> e <code>aws sso login</code>).</p>
          <p><b>ECR</b> — autenticação com um token temporário (válido por 12 horas) para o Docker:</p>
          <CodeBlock code={`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com`} />
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Automação, scripts, diagnóstico rápido e tarefas repetíveis que o console não resolve bem.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Access keys fixas em arquivo para pessoas (prefira SSO) ou em CI (prefira <a href="#oidc">OIDC</a>).
            </div>
          </div>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" rel="noopener">Installing or updating to the latest version of the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/uninstall.html" rel="noopener">Uninstalling the AWS CLI version 2</a> <span className="muted">(referenciada pela página de instalação; não lida integralmente)</span></li>
              <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" rel="noopener">Configuring IAM Identity Center authentication with the AWS CLI</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html" rel="noopener">ECR: Pushing a Docker image</a></li>
            </ul>
          </Sources>
        </section>
        {/* ============ VPC ============ */}
        <section className="topic" id="vpc">
          <header>
            <span className="tag">Rede · 05</span>
            <h2>VPC</h2>
            <p className="lead">Amazon Virtual Private Cloud: uma rede virtual logicamente isolada, parecida com a de um data center tradicional, onde você lança seus recursos AWS.</p>
          </header>
          <div className="vpc">
            <div className="label">VPC · 10.0.0.0/16 (exemplo)</div>
            <div className="az-row">
              <div className="az">
                <div className="label">AZ A</div>
                <div className="subnet pub">
                  <Icon name="globe" />
                  <b>Pública</b> 10.0.1.0/24<br /><small>ALB · NAT Gateway</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b>Privada</b> 10.0.11.0/24<br /><small>Aplicação (ECS/EC2)</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b>Privada</b> 10.0.21.0/24<br /><small>Banco de dados (RDS)</small>
                </div>
              </div>
              <div className="az">
                <div className="label">AZ B</div>
                <div className="subnet pub">
                  <Icon name="globe" />
                  <b>Pública</b> 10.0.2.0/24<br /><small>ALB · NAT Gateway</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b>Privada</b> 10.0.12.0/24<br /><small>Aplicação (ECS/EC2)</small>
                </div>
                <div className="subnet priv">
                  <Icon name="lock" />
                  <b>Privada</b> 10.0.22.0/24<br /><small>Banco de dados (RDS)</small>
                </div>
              </div>
            </div>
            <div className="igw">
              <Icon name="gateway" />
              Internet Gateway ⇄
              <Icon name="globe" />
              Internet <small>(rota 0.0.0.0/0 → IGW nas públicas; nas privadas, 0.0.0.0/0 → NAT Gateway)</small>
            </div>
          </div>
          <p className="muted">Os blocos CIDR acima são apenas um exemplo didático de desenho; a AWS não define um padrão obrigatório.</p>
          <h3>Peças principais</h3>
          <ul>
            <li><b>Subnet:</b> faixa de IPs da VPC que fica em <b>uma única</b> zona de disponibilidade.</li>
            <li><b>Route table:</b> conjunto de rotas (destino + alvo) que decide para onde vai o tráfego de uma subnet ou gateway. Todo VPC nasce com uma <i>main route table</i>, e você pode criar outras.</li>
            <li><b>Internet gateway:</b> conecta a VPC à internet.</li>
            <li><b>NAT gateway, VPC endpoint, peering, transit gateway, VPN, Flow Logs</b> completam o quadro (veja abaixo e na página oficial).</li>
            <li>Cada Region já tem uma <b>VPC default</b>, pronta para uso. Não há cobrança pela VPC em si, mas há por alguns componentes, como NAT gateways e IPv4 públicos.</li>
          </ul>
          <h3>Subnets e CIDR</h3>
          <p>O bloco de uma subnet pode ser igual ao da VPC (uma subnet só) ou parte dele. Subnets da mesma VPC <b>não podem se sobrepor</b>. O tamanho permitido para IPv4 vai de <code>/28</code> a <code>/16</code>. Em cada subnet, os quatro primeiros IPs e o último <b>não estão disponíveis</b> (rede, roteador da VPC, DNS, uso futuro e broadcast): são 5 reservados.</p>
          <div className="widget" data-cidr="">
            <div className="wtitle">Calculadora CIDR</div>
            <div className="row"><label htmlFor="cidr-r">Máscara:</label> <input id="cidr-r" type="range" min="16" max="28" defaultValue="24" /> <span className="big cidr-n">/24</span></div>
            <p><b className="cidr-total big">256</b> IPs no total · <b className="cidr-usable">251</b> utilizáveis (a AWS reserva 5 por subnet)</p>
          </div>
          <h3>Subnets públicas e privadas</h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="globe" /> Pública</h4>
              A route table tem uma rota para o internet gateway. Abriga o que precisa ser alcançado de fora: <a href="#elb">load balancer</a> e NAT gateway.
            </div>
            <div className="card">
              <h4><Icon name="lock" /> Privada</h4>
              Sem rota para o internet gateway. Para sair para a internet, usa um NAT gateway; para falar com serviços AWS, pode usar VPC endpoints. Boa para aplicação e banco de dados.
            </div>
          </div>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Route table</th>
                  <th>Destination</th>
                  <th>Target</th>
                </tr>
                <tr>
                  <td>Subnet pública</td>
                  <td><code>10.0.0.0/16</code></td>
                  <td><code>local</code></td>
                </tr>
                <tr>
                  <td>Subnet pública</td>
                  <td><code>0.0.0.0/0</code></td>
                  <td><code>igw-…</code></td>
                </tr>
                <tr>
                  <td>Subnet privada</td>
                  <td><code>10.0.0.0/16</code></td>
                  <td><code>local</code></td>
                </tr>
                <tr>
                  <td>Subnet privada</td>
                  <td><code>0.0.0.0/0</code></td>
                  <td><code>nat-…</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">A rota <code>local</code> permite que as subnets da VPC conversem entre si; quem restringe quem fala com quem são os <a href="#sg">Security Groups</a>. Um RDS "publicamente acessível" exige que todas as subnets do seu DB subnet group tenham internet gateway; o recomendado para bancos é subnet privada (veja <a href="#rds">RDS</a>).</p>
          <h3>NAT Gateway</h3>
          <p>Permite que instâncias em subnet privada <b>iniciem</b> conexões para fora da VPC, enquanto serviços externos não conseguem iniciar conexão com elas. O NAT gateway <b>público</b> (padrão) fica numa <b>subnet pública</b>, exige um Elastic IP e roteia o tráfego para o internet gateway.</p>
          <p>O <b>privado</b> serve para outras VPCs ou redes on-premises (via transit gateway ou virtual private gateway) e não aceita Elastic IP. Existe também o NAT gateway regional, com expansão multi-AZ automática.</p>
          <div className="flow"><span className="node"><Icon name="lock" /> Subnet privada</span><span className="arrow">0.0.0.0/0 →</span><span className="node"><Icon name="swap" /> NAT (subnet pública)</span><span className="arrow">→</span><span className="node"><Icon name="gateway" /> IGW</span><span className="arrow">→</span><span className="node"><Icon name="globe" /> Internet</span></div>
          <Callout tone="warn"><strong>Custo</strong> O NAT gateway é um componente cobrado. A documentação mostra como comparar o custo com IPv4 públicos e sugere alternativas como VPC endpoints (PrivateLink) para falar com serviços AWS. Veja os preços na <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">página de preços da VPC</a>.</Callout>
          <h3>VPC endpoints</h3>
          <p>Conectam a VPC a serviços AWS de forma privada, sem internet gateway nem NAT. O tráfego fica na rede da AWS.</p>
          <div className="grid">
            <div className="card">
              <h4>Gateway endpoint</h4>
              Para <b>S3</b> e <b>DynamoDB</b>. Não usa AWS PrivateLink; o tráfego é direcionado por rota.
            </div>
            <div className="card">
              <h4>Interface endpoint</h4>
              Usa AWS PrivateLink: cria uma interface de rede (com IP privado) em cada subnet escolhida e o tráfego é resolvido por DNS. Aceita uma <i>endpoint policy</i> para controlar quem o usa.
            </div>
          </div>
          <p className="muted">Exemplo: instâncias sem IP público podem usar o Session Manager com VPC endpoints do Systems Manager (veja <a href="#ssm">Systems Manager</a>).</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Sempre que houver mais de um ambiente ou camada: borda (ALB) em subnets públicas, aplicação e banco em privadas, em pelo menos duas AZs.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Colocar instâncias de aplicação com IP público só por conveniência; usar NAT gateway quando um endpoint resolveria; CIDRs sobrepostos se houver planos de peering ou transit gateway.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>{"O que torna uma subnet \"pública\"?"}</summary>
            <div className="ans">A route table dela tem uma rota <code>0.0.0.0/0</code> para o internet gateway.</div>
          </details>
          <details className="fc">
            <summary>Onde fica o NAT gateway público?</summary>
            <div className="ans">Em uma subnet pública, com um Elastic IP associado.</div>
          </details>
          <details className="fc">
            <summary>Quantos IPs utilizáveis tem uma subnet /24?</summary>
            <div className="ans">251: 256 menos os 5 reservados pela AWS.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" rel="noopener">What is Amazon VPC?</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html" rel="noopener">Subnet CIDR blocks</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" rel="noopener">Configure route tables</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" rel="noopener">NAT gateways</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html" rel="noopener">AWS PrivateLink concepts (VPC endpoints)</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html" rel="noopener">EC2 instance IP addressing (otimização de IPv4 público)</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html" rel="noopener">RDS: Working with a DB instance in a VPC</a></li>
            </ul>
            <p><b>Removido por falta de fonte nas páginas lidas:</b> valores padrão de DNS hostnames/DNS resolution e a afirmação de que a rota local "não pode ser deletada". <b>Reformulado:</b> "10.0.0.0/16 é o IPv4 comum" virou apenas um exemplo; "subnet privada nunca fala com a internet" passou a mencionar NAT gateway e VPC endpoints.</p>
          </Sources>
        </section>
        {/* ============ SG ============ */}
        <section className="topic" id="sg">
          <header>
            <span className="tag">Rede · 06</span>
            <h2>Security Groups &amp; Prefix Lists</h2>
            <p className="lead">Security group: firewall virtual que controla o tráfego que pode chegar e sair dos recursos associados a ele. Prefix list: um conjunto de CIDRs reutilizável nas regras.</p>
          </header>
          <h3>Como funciona</h3>
          <ul>
            <li>Só existem regras de <b>permissão</b> (allow), não de bloqueio. Um SG novo não tem regra inbound, então <b>nenhum tráfego de entrada</b> é permitido até você adicionar.</li>
            <li>Um SG novo vem com uma regra outbound que libera toda a saída. Se você remover e não houver regras de saída, nenhuma saída é permitida.</li>
            <li><b>Stateful:</b> a resposta a um tráfego permitido é liberada independentemente das regras do outro sentido. Por isso o outbound de um banco pode ficar vazio e ele ainda responde ao que o inbound autorizou.</li>
            <li>Vários SGs em um recurso têm suas regras somadas. Mudanças nas regras valem na hora para todos os recursos associados. O SG é associado a interfaces de rede, não a IPs individuais.</li>
            <li>Cada regra tem protocolo, faixa de portas e origem (inbound) ou destino (outbound): um IP (<code>/32</code>), um CIDR, uma <b>prefix list</b> ou <b>outro Security Group</b>.</li>
            <li>Não há cobrança por usar security groups. Existem cotas (SGs por VPC, regras por SG, SGs por interface).</li>
            <li>SGs <b>não filtram</b> tráfego para DNS da Amazon, DHCP, metadados da instância, Time Sync e o roteador da VPC.</li>
          </ul>
          <h3>Security Groups encadeados</h3>
          <p>Em vez de liberar por IP, use como origem o <b>ID de outro SG</b>. A regra vale para as instâncias associadas àquele SG, pelo IP privado delas, e sobrevive à troca de instâncias. Exemplo clássico da documentação (load balancer, web e banco):</p>
          <div className="flow"> <span className="node"><Icon name="globe" /> Internet</span><span className="arrow">80/443 →</span> <span className="node"><Icon name="balance" /> sg-alb<br /><small>in: 0.0.0.0/0</small></span><span className="arrow">app port →</span> <span className="node"><Icon name="server" /> sg-app<br /><small>in: sg-alb</small></span><span className="arrow">db port →</span> <span className="node"><Icon name="database" /> sg-db<br /><small>in: sg-app</small></span> </div>
          <ul>
            <li>Referenciar um SG <b>não copia</b> as regras dele para o SG que referencia.</li>
            <li>Para referenciar em regra inbound, os SGs devem estar na mesma VPC ou em VPCs ligadas por peering ou transit gateway. Em regra outbound: mesma VPC ou peering.</li>
            <li>Uma regra que referencia outro SG conta como <b>uma</b> regra, não importa o tamanho do SG referenciado.</li>
            <li>Se o tráfego passa por uma appliance intermediária (middlebox), referenciar o SG do outro lado <b>não</b> basta: use o IP privado ou o CIDR da subnet.</li>
          </ul>
          <div className="widget" data-sg="">
            <div className="wtitle">Simulador: SG da EC2</div>
            <p><small>Regras inbound do SG da aplicação: porta <b>3000</b> vinda do SG do load balancer · porta <b>22</b> vinda do meu IP. Tudo o mais é negado.</small></p>
            <div className="row"> <label>Origem <select className="sg-source" defaultValue="lb"> <option value="net">Internet (0.0.0.0/0)</option> <option value="lb">SG load balancer</option> <option value="me">My IP</option> <option value="other">Other SG</option> </select></label> <label>Porta <select className="port" defaultValue="3000"><option>80</option><option>443</option><option>22</option><option>3000</option></select></label> </div>
            <div className="result sg-out"></div>
          </div>
          <h3>Managed Prefix Lists</h3>
          <p>Conjunto de um ou mais blocos CIDR que você referencia como uma unidade em regras de security group e em route tables. Ao adicionar um CIDR à lista, todos os SGs que a usam são atualizados.</p>
          <div className="grid">
            <div className="card">
              <h4>Gerenciada pelo cliente</h4>
              Você define e mantém. Só IPv4 <i>ou</i> IPv6, vale na Region onde foi criada, e você escolhe o <b>máximo de entradas</b> na criação. Pode ser compartilhada com outras contas via AWS RAM. Cada edição cria uma nova versão.
            </div>
            <div className="card">
              <h4>Gerenciada pela AWS</h4>
              Faixas de IP de serviços da AWS. Você não pode criar, alterar, compartilhar nem apagar.
            </div>
          </div>
          <Callout tone="warn"><strong>Pegadinha de cotas</strong> Uma regra que referencia uma prefix list conta como o <b>máximo de entradas</b> da lista (não o número atual): lista de 20 entradas máximas = 20 regras. Para listas gerenciadas pela AWS conta o "peso" da lista.</Callout>
          <p className="muted">Uso típico: um único conjunto de IPs do escritório/VPN liberado para SSH ou para um painel em vários SGs.</p>
          <Callout tone="good"><strong>Boas práticas da documentação</strong> Limite quem pode criar e alterar SGs; crie o mínimo de SGs possível; para as portas 22 (SSH) e 3389 (RDP), autorize só faixas de IP específicas (nunca <code>0.0.0.0/0</code>); não abra faixas largas de portas; considere NACLs como camada extra.</Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              SG por papel (alb, app, db) encadeados por referência; prefix lists para conjuntos de IPs que mudam e se repetem em várias regras.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Origem <code>0.0.0.0/0</code> em portas administrativas ou de banco; prefix list com máximo de entradas grande sem necessidade (consome cota); depender de SG para filtrar DNS.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O banco precisa de regra outbound para responder à API?</summary>
            <div className="ans">Não. SG é stateful: a resposta ao tráfego permitido pelo inbound sai sozinha.</div>
          </details>
          <details className="fc">
            <summary>Quantas regras consome uma prefix list com máximo de 20 entradas e 3 CIDRs hoje?</summary>
            <div className="ans">20, pois conta o máximo configurado.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" rel="noopener">Control traffic to your AWS resources using security groups</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" rel="noopener">Security group rules</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists.html" rel="noopener">Managed prefix lists</a></li>
            </ul>
            <p><b>Removido das anotações antigas (sem fonte):</b> regras de "frontend estático exige backend público" e "SSR: backend só aceita frontends". São decisões de arquitetura, não afirmações da documentação; o encadeamento por SG acima cobre o caso do backend privado.</p>
          </Sources>
        </section>
        {/* ============ ELB ============ */}
        <section className="topic" id="elb">
          <header>
            <span className="tag">Rede · 07</span>
            <h2>Application Load Balancer</h2>
            <p className="lead">O Elastic Load Balancing distribui o tráfego entre vários destinos (instâncias EC2, containers, IPs) em uma ou mais zonas de disponibilidade e só envia para destinos saudáveis. O ALB faz isso na camada de aplicação (HTTP/HTTPS).</p>
          </header>
          <h3>Tipos de load balancer</h3>
          <div className="grid">
            <div className="card">
              <h4>ALB</h4>
              Application: camada 7. Roteia por conteúdo da requisição (host, caminho, cabeçalhos...), faz redirect e respostas fixas, e aceita targets por instância, IP ou Lambda.
            </div>
            <div className="card">
              <h4>NLB</h4>
              Network: camada 4 (TCP, UDP, TLS, QUIC). Lida com milhões de requisições por segundo e tem IP estático por zona (com opção de Elastic IP).
            </div>
            <div className="card">
              <h4>GWLB</h4>
              Gateway: camada 3. Implanta e escala appliances virtuais (firewalls, detecção de intrusão, inspeção profunda de pacotes) usando o protocolo GENEVE.
            </div>
          </div>
          <p className="muted">Há ainda o Classic Load Balancer. O restante desta página trata do ALB.</p>
          <h3>Peças do ALB</h3>
          <div className="flow"> <span className="node"><Icon name="globe" /> Cliente</span><span className="arrow">→</span> <span className="node"><Icon name="listener" /> Listener<br /><small>HTTPS :443</small></span><span className="arrow">→</span> <span className="node"><Icon name="rules" /> Rules<br /><small>host / path</small></span><span className="arrow">→</span> <span className="node"><Icon name="target" /> Target group</span><span className="arrow">→</span> <span className="node"><Icon name="server" /> Targets</span> </div>
          <ul>
            <li><b>Listener:</b> verifica pedidos de conexão com o protocolo e a porta que você configura. Toda listener tem uma <i>regra default</i>, e você pode adicionar outras.</li>
            <li><b>Target group:</b> encaminha para um ou mais targets usando o protocolo e a porta que você definir (a porta do target deve ser a em que a aplicação escuta). Health checks são configurados por target group. Um target pode estar em mais de um target group.</li>
            <li>O algoritmo padrão do target group é <b>round robin</b>; a alternativa é <i>least outstanding requests</i>.</li>
          </ul>
          <div className="widget" data-lb="">
            <div className="wtitle">Demo: round-robin e health check</div>
            <div className="lb-demo">
              <span className="node user"><Icon name="user" /> Usuário</span> <span className="node lb"><Icon name="balance" /> ALB</span>
              <div className="targets">
                <div className="node" data-name="EC2-1">EC2-1 <button className="btn">derrubar</button></div>
                <div className="node" data-name="EC2-2">EC2-2 <button className="btn">derrubar</button></div>
                <div className="node" data-name="EC2-3">EC2-3 <button className="btn">derrubar</button></div>
              </div>
              <div className="pkt"></div>
            </div>
            <div className="row"><button className="btn primary send">Enviar requisição</button> <span className="lb-out"></span></div>
            <small>Derrube instâncias: o ALB percebe pelo health check e só envia às saudáveis.</small>
          </div>
          <h3>Regras por host e caminho</h3>
          <p>As regras são avaliadas em ordem de prioridade, da <b>menor</b> para a maior; a regra default é avaliada por último e não tem condições. Exemplo (um ALB para vários domínios):</p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Prioridade</th>
                  <th>Condição</th>
                  <th>Ação</th>
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
                  <td>default</td>
                  <td>—</td>
                  <td>fixed-response 404</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li>Cada regra tem exatamente <b>uma</b> ação entre <code>forward</code>, <code>redirect</code> e <code>fixed-response</code>, e ela é a última a executar.</li>
            <li>Condições disponíveis: <code>host-header</code>, <code>path-pattern</code>, <code>http-request-method</code>, <code>source-ip</code>, <code>http-header</code> e <code>query-string</code>. Há limite de três valores de comparação por condição e cinco por regra.</li>
            <li>As regex das condições não suportam lookahead, lookbehind, backreferences, entre outros recursos.</li>
          </ul>
          <h3>Health checks</h3>
          <p>O ALB testa periodicamente cada target e só roteia para os saudáveis. Valores padrão segundo a documentação em 2026-10-13 (podem mudar):</p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Configuração</th>
                  <th>Padrão</th>
                </tr>
                <tr>
                  <td>Protocol / Path / Port</td>
                  <td>HTTP · <code>/</code> · porta do tráfego</td>
                </tr>
                <tr>
                  <td>Interval</td>
                  <td>30 s (5–300 s)</td>
                </tr>
                <tr>
                  <td>Timeout</td>
                  <td>5 s (2–120 s)</td>
                </tr>
                <tr>
                  <td>Healthy / Unhealthy threshold</td>
                  <td>5 / 2 (2–10)</td>
                </tr>
                <tr>
                  <td>Success codes</td>
                  <td>200 (aceita 200–499, listas e faixas)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn">
            <strong>Pegadinhas</strong>
            <ul>
              <li><b>Fail open:</b> se todos os targets do grupo estão não saudáveis, o ALB roteia para todos eles, independentemente do estado.</li>
              <li>Health checks não suportam WebSockets.</li>
              <li>O path do health check precisa responder com um código aceito; apontar para uma página que redireciona (ex.: 301) faz o target ficar <i>unhealthy</i> se 301 não estiver nos success codes.</li>
            </ul>
          </Callout>
          <h3>HTTPS</h3>
          <p>Um listener HTTPS exige pelo menos um certificado X.509: o <b>certificado default</b>. Para vários domínios na mesma porta, adicione certificados à <i>certificate list</i> (o ALB escolhe o certificado pelo nome enviado via SNI) ou use um certificado com SANs/curinga.</p>
          <p>A AWS recomenda emitir os certificados no <a href="#acm">AWS Certificate Manager</a>. O nome no certificado precisa bater com o host pedido, senão a conexão falha.</p>
          <p>Security Groups: o do ALB libera 80/443 da internet; o da aplicação libera a porta da app <b>só do SG do ALB</b> (veja <a href="#sg">Security Groups encadeados</a>).</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Aplicações HTTP/HTTPS, vários serviços ou domínios atrás de um único ponto de entrada, containers no <a href="#ecs">ECS</a>, redirect HTTP→HTTPS.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Tráfego TCP/UDP genérico ou necessidade de IP estático (NLB); inspeção por appliances (GWLB); health check em WebSocket ou que depende de redirects.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Para quem o ALB envia o tráfego?</summary>
            <div className="ans">Para target groups, escolhidos pelas regras do listener; cada target group tem seus targets e health checks.</div>
          </details>
          <details className="fc">
            <summary>O que acontece quando todos os targets ficam unhealthy?</summary>
            <div className="ans">O ALB faz fail open e roteia para todos eles.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" rel="noopener">What is an Application Load Balancer?</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html" rel="noopener">Listener rules for your Application Load Balancer</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" rel="noopener">Health checks for ALB target groups</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html" rel="noopener">SSL certificates for your Application Load Balancer</a></li>
              <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html" rel="noopener">What is a Network Load Balancer?</a> · <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html" rel="noopener">What is a Gateway Load Balancer?</a></li>
              <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" rel="noopener">VPC: Security group rules (exemplo com ALB)</a></li>
            </ul>
            <p><b>Corrigido/reformulado:</b> "NLB: performance extrema (jogos, streaming)" foi trocado pelo que a documentação diz (camada 4, milhões de req/s, IP estático); o ELB agora é apresentado como família de quatro tipos. A frase sobre redirect no health check é uma consequência dos success codes documentados, não uma citação.</p>
          </Sources>
        </section>
        {/* ============ ACM ============ */}
        <section className="topic" id="acm">
          <header>
            <span className="tag">Rede · 08</span>
            <h2>ACM (Certificate Manager)</h2>
            <p className="lead">AWS Certificate Manager emite e gerencia certificados SSL/TLS para usar com serviços integrados, como o Application Load Balancer. A validação por DNS prova que você controla o domínio.</p>
          </header>
          <div className="flow"> <span className="node"><Icon name="doc" /> Pedir certificado</span><span className="arrow">→</span> <span className="node"><Icon name="key" /> ACM devolve um CNAME</span><span className="arrow">→</span> <span className="node"><Icon name="doc" /> Você cria o CNAME no DNS</span><span className="arrow">→</span> <span className="node"><Icon name="check" /> Issued</span><span className="arrow">→</span> <span className="node"><Icon name="balance" /> Listener HTTPS do ALB</span> </div>
          <h3>Validação por DNS</h3>
          <ul>
            <li>Ao escolher DNS, o ACM fornece um ou mais registros <b>CNAME</b> (nome e valor únicos para o seu domínio e conta). Eles são a prova de que você controla o domínio.</li>
            <li>O CNAME é adicionado <b>uma única vez</b>. O ACM renova o certificado automaticamente enquanto ele estiver em uso e o CNAME continuar no DNS. Apagar o CNAME interrompe a renovação.</li>
            <li>Com o <a href="#route53">Route 53</a> como DNS e permissão de escrita na zona, o console mostra o botão <b>Create records in Route 53</b>. O status pode continuar <i>Pending validation</i> por até 30 minutos.</li>
            <li>Se o ACM não conseguir validar em 72 horas, o status vira <i>Validation timed out</i> e é preciso pedir um novo certificado.</li>
            <li>Se o DNS não é Route 53, copie o CNAME (ou exporte o CSV) e crie-o no provedor. Alguns provedores acrescentam o domínio ao nome sozinhos: se você colar o nome completo, ele vira <code>_x.exemplo.com.exemplo.com</code> e a validação falha.</li>
          </ul>
          <Callout tone="warn">
            <strong>Pegadinhas</strong>
            <ul>
              <li>Um certificado criado com validação por e-mail <b>não</b> pode ser trocado para DNS: apague e crie outro.</li>
              <li>O CNAME do domínio base e o do curinga (<code>*.exemplo.com</code> e <code>exemplo.com</code>) são iguais; subdomínios específicos têm CNAMEs próprios.</li>
              <li>Um curinga <code>*.exemplo.com</code> cobre <b>um</b> nível de subdomínio e <b>não</b> cobre o domínio raiz (<code>exemplo.com</code>); inclua os dois no certificado se precisar.</li>
              <li>A resolução de CNAME falha se houver mais de cinco CNAMEs encadeados na configuração de DNS.</li>
              <li>O token de validação funciona em qualquer Region, então dá para recriar o mesmo certificado em várias Regions.</li>
              <li>Certificados <b>importados</b> no ACM não renovam sozinhos: você acompanha a expiração e troca antes do fim.</li>
            </ul>
          </Callout>
          <p className="muted">{"Se você usa registros CAA no domínio, é preciso autorizar a AWS a emitir; veja a página \"Configure a CAA record\" do ACM, referenciada na documentação do Route 53."}</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              HTTPS em ALB (e outros serviços integrados) com renovação automática; domínios cujo DNS você controla (Route 53 facilita).
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              {"Validação por e-mail se o DNS é seu; apagar o CNAME \"que sobrou\" (quebra a renovação); depender de renovação automática em certificado importado."}
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Por que não apagar o CNAME de validação depois de emitir?</summary>
            <div className="ans">O ACM o usa para renovar o certificado automaticamente; sem ele a renovação para.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Computação · 09</span>
            <h2>EC2 &amp; Auto Scaling</h2>
            <p className="lead">Amazon EC2 entrega servidores virtuais na nuvem. O Auto Scaling mantém a quantidade certa de instâncias para a sua carga.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="disc" /> AMI</h4>
              Amazon Machine Image: fornece o software para iniciar a instância e um mapeamento de dispositivos de bloco (os discos a anexar). É específica de Region, sistema operacional, arquitetura de processador, tipo de volume raiz e tipo de virtualização. Dá para copiar para outra Region e compartilhar com outras contas.
            </div>
            <div className="card">
              <h4><Icon name="bolt" /> Instance type</h4>
              Define o hardware (CPU, memória, armazenamento, rede). Os tipos são agrupados em famílias; os nomes seguem uma convenção (família, geração, processador, capacidades, tamanho). Há instâncias <i>burstable</i> (como a série T). Como o faturamento é por segundo, é barato testar vários tipos.
            </div>
            <div className="card">
              <h4><Icon name="globe" /> Public IPv4</h4>
              O IP público automático vem do pool da Amazon e <b>não</b> é seu: é liberado ao parar, hibernar ou encerrar, e a instância recebe outro ao iniciar de novo. Para um endereço fixo, use <a href="#eip">Elastic IP</a>. A AWS cobra por todo IPv4 público.
            </div>
          </div>
          <h3>Snapshot vs. Imagem</h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Snapshot (EBS)</th>
                  <th>Imagem (AMI)</th>
                </tr>
                <tr>
                  <td><b>O que é</b></td>
                  <td>Cópia pontual (point-in-time) de um volume EBS, <b>incremental</b>: guarda só os blocos alterados desde o último snapshot.</td>
                  <td>Software de boot + mapeamento de discos, usado para lançar instâncias.</td>
                </tr>
                <tr>
                  <td><b>Uso</b></td>
                  <td>Backup e restauração: cria um volume novo idêntico ao original no momento do snapshot.</td>
                  <td>Clonar a configuração de uma instância: lançar várias com a mesma base.</td>
                </tr>
                <tr>
                  <td><b>Onde fica</b></td>
                  <td>Em buckets do S3 que você não acessa diretamente; replicado entre as AZs da Region.</td>
                  <td>Dentro da Region; pode ser copiada e compartilhada.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout tone="warn"><strong>Pegadinhas</strong> A AWS <b>não</b> faz backup automático dos volumes EBS: criar snapshots (ou automatizá-los com Data Lifecycle Manager ou AWS Backup) é responsabilidade sua. Como snapshots são incrementais, apagar um nem sempre reduz o custo de armazenamento.</Callout>
          <Callout tone="personal"><strong>Não verificado</strong> {"A anotação antiga dizia que \"toda imagem contém um snapshot\" e que \"snapshot não cria instâncias\". As páginas lidas confirmam o papel de cada um, mas não essa relação exata; consulte a documentação de criação de AMIs antes de depender dela."}</Callout>
          <h3>Launch Template</h3>
          <p>Especifica a configuração de uma instância: ID da AMI, tipo de instância, key pair, security groups e outros parâmetros. Tem <b>versões</b>: dá para manter uma base e criar versões novas (por exemplo, com a AMI da última versão da aplicação).</p>
          <p>A AWS recomenda launch templates em vez de launch configurations, que não suportam recursos como misturar Spot e On-Demand ou vários tipos de instância.</p>
          <h3>Auto Scaling Group (ASG)</h3>
          <p>Coleção de instâncias tratada como uma unidade. Você define:</p>
          <ol>
            <li><b>Minimum size:</b> o grupo nunca fica abaixo disso.</li>
            <li><b>Maximum size:</b> o grupo nunca passa disso.</li>
            <li><b>Desired capacity:</b> quantas instâncias você quer rodando agora (dentro do mínimo e máximo).</li>
          </ol>
          <Callout tone="good"><strong>Substituição automática de instâncias</strong> O ASG monitora a saúde das instâncias (health checks do EC2, e opcionalmente os do load balancer ou checks próprios) e substitui as encerradas ou comprometidas para manter a capacidade desejada. Ele também distribui as instâncias entre as zonas de disponibilidade e registra/remove instâncias do <a href="#elb">load balancer</a> automaticamente.</Callout>
          <p className="muted">Não há cobrança adicional pelo Auto Scaling; você paga pelos recursos usados (instâncias, volumes EBS, alarmes do CloudWatch).</p>
          <h3>Scaling policies</h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="target" /> Target tracking</h4>
              Escolhe uma métrica e um valor-alvo, como um termostato. Recomendada pela AWS; use métricas que variem de forma inversamente proporcional à capacidade (CPU média, requisições por target). O Auto Scaling cria os alarmes do CloudWatch por você.
            </div>
            <div className="card">
              <h4><Icon name="steps" /> Step / simple</h4>
              Ajustes por faixa de violação do alarme (step) ou um único ajuste com cooldown (simple). Cuidado ao combinar com target tracking: conflitos podem causar comportamento indesejado.
            </div>
            <div className="card">
              <h4><Icon name="calendar" /> Scheduled</h4>
              Ações agendadas mudam a capacidade em horários definidos (única ou recorrente, com cron e fuso horário). Bom para picos previsíveis.
            </div>
            <div className="card">
              <h4><Icon name="sparkle" /> Predictive</h4>
              Analisa a carga histórica para achar padrões diários ou semanais e prever a demanda, lançando capacidade antes do pico. Indicado para tráfego cíclico e aplicações lentas para iniciar.
            </div>
          </div>
          <p className="muted">Sempre dentro do mínimo e do máximo do grupo. Se mais de uma política pedir mudança ao mesmo tempo, prevalece a que resulta em mais capacidade.</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Aplicação com carga variável ou que precisa se recuperar sozinha de falhas; servidores idênticos atrás de um load balancer.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Servidor único com estado em disco local, sem automação de configuração; quando containers no <a href="#ecs">ECS</a> já resolvem o problema.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O IP público automático de uma instância continua o mesmo depois de parar e iniciar?</summary>
            <div className="ans">Não. Ele é liberado ao parar e um novo é atribuído ao iniciar. Use Elastic IP para um endereço fixo.</div>
          </details>
          <details className="fc">
            <summary>O que o ASG faz com uma instância comprometida?</summary>
            <div className="ans">Substitui, para manter a capacidade desejada.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html" rel="noopener">Amazon EC2 instance types</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html" rel="noopener">Amazon Machine Images in Amazon EC2</a></li>
              <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html" rel="noopener">Amazon EC2 instance IP addressing</a></li>
              <li><a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html" rel="noopener">Amazon EBS snapshots</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html" rel="noopener">What is Amazon EC2 Auto Scaling?</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html" rel="noopener">Auto Scaling launch templates</a></li>
              <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html" rel="noopener">Dynamic scaling</a> · <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html" rel="noopener">Scheduled scaling</a> · <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html" rel="noopener">Predictive scaling</a></li>
            </ul>
            <p><b>Corrigido:</b> a anotação antiga citava "t4.micro" como família; a documentação lida lista a série <code>T4g</code> (e <code>T3</code>), então os exemplos de tipos foram removidos. Valores como "launch template é gratuito" e o "CPU ou memória" no target tracking também saíram por falta de suporte nas páginas lidas.</p>
          </Sources>
        </section>
        {/* ============ SSH ============ */}
        <section className="topic" id="ssh">
          <header>
            <span className="tag">Computação · 10</span>
            <h2>SSH (Secure Shell)</h2>
            <p className="lead">Forma clássica de abrir um terminal remoto em uma instância EC2 Linux, usando um par de chaves.</p>
          </header>
          <h3>Pré-requisitos segundo a documentação da EC2</h3>
          <ul>
            <li>A instância passou nas status checks (pode levar alguns minutos).</li>
            <li>Você tem a chave privada (<code>.pem</code>) do key pair e as permissões do arquivo configuradas (a página de pré-requisitos da EC2 detalha isso).</li>
            <li>O <a href="#sg">Security Group</a> da instância libera SSH (porta 22) <b>só do seu IP</b>. Abrir 22 para <code>0.0.0.0/0</code> deixa qualquer um tentar entrar.</li>
          </ul>
          <h3>Conectar</h3>
          <CodeBlock code={`ssh -i /caminho/minha-chave.pem usuario-da-instancia@dns-publico-da-instancia`} />
          <p>No primeiro acesso, o SSH mostra a impressão digital (fingerprint) do servidor. A documentação sugere conferi-la com a da instância: se não bater, pode ser um ataque man-in-the-middle.</p>
          <Callout tone="good"><strong>Alternativa sem porta 22</strong> O Session Manager (Systems Manager) permite acessar nós sem abrir portas de entrada, sem bastion host e sem chaves SSH. Veja <a href="#ssm">Systems Manager</a>.</Callout>
          <Callout tone="personal"><strong>Nota pessoal · sem fonte oficial da AWS</strong> As explicações abaixo (handshake e camadas TCP/IP) são conteúdo didático geral sobre o protocolo SSH, mantido das anotações originais. Elas não vêm da documentação da AWS e não foram verificadas nela. Também ficaram como nota pessoal: <code>chmod 400</code> na chave e o usuário padrão <code>ec2-user</code> no Amazon Linux.</Callout>
          <h3>Handshake passo a passo</h3>
          <div className="widget" data-stepper="">
            <div className="wtitle">Animação</div>
            <div className="stage">
              <div className="line"></div>
              <span className="node c"><Icon name="client" /> Client</span> <span className="node s"><Icon name="server" /> Server</span>
              <div className="dot"></div>
            </div>
            <ol className="steps">
              <li data-dir="s2c">{"O servidor envia sua chave pública de host (a \"impressão digital\" dele)."}</li>
              <li data-dir="none">O cliente verifica se conhece essa chave, sabendo quem é o outro lado.</li>
              <li data-dir="both" data-enc="1">Ambos geram um segredo compartilhado pela matemática, sem transmiti-lo. O canal passa a ser criptografado.</li>
              <li data-dir="c2s" data-enc="1">O cliente envia o usuário e sua chave pública (ou senha).</li>
              <li data-dir="s2c" data-enc="1">O servidor reconhece a chave e envia um desafio: uma mensagem aleatória trancada com a chave pública do cliente.</li>
              <li data-dir="none" data-enc="1">O cliente destranca a mensagem com a chave privada (só ela consegue) e a assina.</li>
              <li data-dir="c2s" data-enc="1">A assinatura volta ao servidor, provando a posse da chave privada.</li>
              <li data-dir="s2c" data-enc="1">O servidor confirma e libera o terminal. Agora é possível executar comandos com segurança.</li>
            </ol>
            <div className="row"> <button className="btn prev">◀</button><button className="btn primary next">Próximo ▶</button><button className="btn play">▶▶ Auto</button> </div>
          </div>
          <h3>Protocolos e TCP/IP</h3>
          <p>Um protocolo é um contrato: regras de como os dados são formatados, transmitidos e recebidos. O SSH é da camada de <b>Aplicação</b> e roda sobre TCP/IP.</p>
          <table>
            <tbody>
              <tr>
                <th>Camada</th>
                <th>Função</th>
              </tr>
              <tr>
                <td>4 · Aplicação</td>
                <td>Onde os programas trabalham: SSH, SMTP, HTTP.</td>
              </tr>
              <tr>
                <td>3 · Transporte (TCP)</td>
                <td>Abre a conexão e garante que todos os pedaços cheguem sem erros.</td>
              </tr>
              <tr>
                <td>2 · Internet (IP)</td>
                <td>Endereçamento: garante que os pacotes cheguem ao destino.</td>
              </tr>
              <tr>
                <td>1 · Link</td>
                <td>Meio físico: cabos ethernet, wi-fi.</td>
              </tr>
            </tbody>
          </table>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Depuração pontual em instâncias de teste, com porta 22 restrita ao seu IP.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Porta 22 aberta para a internet; acesso rotineiro em produção (prefira Session Manager).
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>De onde deve vir o tráfego SSH liberado no Security Group?</summary>
            <div className="ans">Do seu IP (ou faixa) específico, nunca de <code>0.0.0.0/0</code>.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Computação · 11</span>
            <h2>IPs Elásticos</h2>
            <p className="lead">Um endereço IPv4 público e estático, pensado para a computação em nuvem dinâmica.</p>
          </header>
          <p>{"O Elastic IP é alocado à sua conta e é seu até você liberá-lo. Você pode \"mascarar\" a falha de uma instância remapeando o endereço para outra instância da conta, ou usá-lo em um registro DNS do seu domínio."}</p>
          <div className="flow"> <span className="node"><Icon name="server" /> EC2 A <Icon name="x" /></span><span className="arrow">⇢</span><span className="node"><Icon name="pin" /> Elastic IP</span><span className="arrow">⇢</span><span className="node"><Icon name="server" /> EC2 B <Icon name="check" /></span> </div>
          <ul>
            <li>É específico de uma Region e não pode ser movido para outra. Não há Elastic IP para IPv6.</li>
            <li>Ao associar um Elastic IP a uma instância que já tinha IP público automático, esse IP automático é liberado e não pode ser reaproveitado.</li>
            <li>Um Elastic IP desassociado continua alocado (e cobrado) até você liberá-lo.</li>
            <li>Há uma cota padrão de Elastic IPs por Region, que pode ser aumentada no Service Quotas. Consulte a página oficial para o valor atual.</li>
          </ul>
          <Callout tone="warn"><strong>Custo</strong> A AWS cobra por <b>todos</b> os endereços IPv4 públicos, estejam em uso ou ociosos, incluindo os de instâncias em execução. Os valores estão na aba "Public IPv4 Address" da <a href="https://aws.amazon.com/vpc/pricing/" rel="noopener">página de preços da VPC</a>. A anotação antiga dizia que o IP era grátis enquanto associado, o que contradiz a documentação atual.</Callout>
          <p>{"A documentação ainda sugere reduzir o número de IPv4 públicos usando um load balancer na frente das instâncias, desligando o \"auto-assign public IP\" onde não for preciso."}</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Endereço fixo que precisa sobreviver à troca de instância e que alguém registra (DNS, allowlist de um parceiro).
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Quando um load balancer com nome DNS (<a href="#route53">Alias</a>) resolve; e o IP não deve ficar ocioso, pois é cobrado.
            </div>
          </div>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Computação · 12</span>
            <h2>ECR</h2>
            <p className="lead">Elastic Container Registry: registro gerenciado de imagens de container (Docker, OCI) dentro da AWS, com permissões via IAM.</p>
          </header>
          <p className="muted">Para enviar a imagem automaticamente a cada push, com um repositório por conta e tags imutáveis, veja <a href="/notas/github-aws-oidc/#ecr">GitHub para AWS, etapa 6</a>.</p>
          <div className="flow"> <span className="node"><Icon name="gear" /> CI (build)</span><span className="arrow">push →</span> <span className="node"><Icon name="box" /> ECR (conta tooling)</span><span className="arrow">← pull</span> <span className="node"><Icon name="server" /> ECS / EKS / EC2 (staging, prod)</span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="folder" /> Repository</h4>
              Repositório privado com permissões baseadas em recurso. Ele precisa existir antes do push, ou você precisa de um <i>repository creation template</i>.
            </div>
            <div className="card">
              <h4><Icon name="key" /> Auth</h4>
              O token de autenticação vale <b>12 horas</b> e é por registry. No <code>docker login</code> o usuário é <code>AWS</code>. A identidade precisa da permissão <code>ecr:GetAuthorizationToken</code> via política IAM.
            </div>
            <div className="card">
              <h4><Icon name="briefcase" /> Recursos</h4>
              Lifecycle policies (limpeza de imagens), scan de vulnerabilidades no push, replicação entre Regions e contas, pull through cache e assinatura gerenciada.
            </div>
          </div>
          <h3>Push passo a passo</h3>
          <CodeBlock code={`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com
docker tag minha-app:1.4.2 111122223333.dkr.ecr.us-east-1.amazonaws.com/minha-app:1.4.2
docker push 111122223333.dkr.ecr.us-east-1.amazonaws.com/minha-app:1.4.2`} />
          <p className="muted">Se você omitir a tag no <code>docker tag</code>, a tag assumida é <code>latest</code>.</p>
          <h3>Acesso entre contas (repository policy)</h3>
          <p>Para a conta de tooling guardar as imagens e as contas de staging e produção baixarem, anexe uma <b>repository policy</b> ao repositório. Exemplo de pull para uma conta (placeholder no lugar do ID real):</p>
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
            <li>O ECR exige que quem autentica tenha <code>ecr:GetAuthorizationToken</code> por política IAM antes de qualquer push ou pull. Essa permissão não vem da repository policy.</li>
            <li>A conta que recebe a permissão precisa ter a Region do repositório habilitada, senão a criação da policy dá erro.</li>
            <li>Para ações de push, a documentação inclui também <code>BatchCheckLayerAvailability</code>, <code>InitiateLayerUpload</code>, <code>UploadLayerPart</code>, <code>CompleteLayerUpload</code> e <code>PutImage</code>.</li>
          </ul>
          <h3>Tags e digests</h3>
          <ul>
            <li><b>Tag mutável</b>: o mesmo nome de tag pode ser sobrescrito por um novo push. Com <b>tag immutability</b> ligada, repetir uma tag retorna <code>ImageTagAlreadyExistsException</code>. A imutabilidade vale para todas as tags (com filtros de exceção opcionais).</li>
            <li>O ECS, por padrão, resolve a tag da task definition para o <b>digest</b> da imagem no momento do deploy e usa o digest nas demais tarefas, para que todas rodem exatamente a mesma imagem. Veja <a href="#ecs">ECS</a>.</li>
          </ul>
          <Callout tone="personal"><strong>Nota pessoal · sem fonte oficial nesta rodada</strong> Boa prática de projeto: usar tags que identifiquem a versão (por exemplo, o hash do commit) em vez de <code>latest</code>. A ideia combina com a tag immutability, mas a recomendação em si não foi lida na documentação.</Callout>
          <Callout><strong>Custos</strong> Você paga pelos dados armazenados, pela transferência nos pushes e pulls e por ações opcionais (assinatura, replicação). Valores: <a href="https://aws.amazon.com/ecr/pricing/" rel="noopener">página de preços do ECR</a>. Os números da anotação antiga foram removidos.</Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Imagens que rodam em ECS, EKS ou EC2 na AWS; repositório central em uma conta de tooling compartilhado entre ambientes.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Repository policy com <code>Principal: "*"</code> sem condição; tags mutáveis em produção quando você precisa saber exatamente qual imagem rodou; acumular imagens sem lifecycle policy.
            </div>
          </div>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Computação · 13</span>
            <h2>ECS</h2>
            <p className="lead">Amazon Elastic Container Service: orquestrador totalmente gerenciado para implantar, gerenciar e escalar aplicações em containers.</p>
          </header>
          <p className="muted">Para disparar o deploy a cada push em <code>develop</code> ou <code>main</code>, veja <a href="/notas/github-aws-oidc/#workflow">GitHub para AWS, etapa 8</a>.</p>
          <p className="muted">Nunca criou um cluster, task definition e service? O roteiro completo, da VPC privada ao SSL até o RDS, está em <a href="/notas/ecs-todo-app/">ECS do zero: um app de to-do</a>.</p>
          <div className="flow"> <span className="node"><Icon name="box" /> ECR</span><span className="arrow">→</span> <span className="node"><Icon name="doc" /> Task definition</span><span className="arrow">→</span> <span className="node"><Icon name="grid" /> Service</span><span className="arrow">→</span> <span className="node"><Icon name="play" /> Tasks no cluster</span><span className="arrow">←</span> <span className="node"><Icon name="balance" /> ALB</span> </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="doc" /> Task definition</h4>
              {"O \"projeto\" da aplicação: quais containers rodam e como."}
            </div>
            <div className="card">
              <h4><Icon name="layers" /> Cluster</h4>
              A infraestrutura onde a aplicação roda.
            </div>
            <div className="card">
              <h4><Icon name="play" /> Task</h4>
              Uma execução da aplicação, como um job em lote que trabalha e termina.
            </div>
            <div className="card">
              <h4><Icon name="grid" /> Service</h4>
              Aplicação de longa duração e sem estado: o ECS mantém o número desejado de tasks rodando e faz os deploys.
            </div>
          </div>
          <p><b>Capacidade</b> (onde os containers rodam): Fargate (serverless, sem gerenciar servidores), instâncias EC2 que você gerencia, ECS Managed Instances (EC2 com a infraestrutura gerenciada pela AWS) ou servidores externos com ECS Anywhere. O custo depende da capacidade escolhida; veja as páginas de preços do ECS e do Fargate.</p>
          <h3>Deploy com rolling update</h3>
          <p>No tipo de deploy <i>rolling update</i>, o scheduler do ECS substitui as tasks em execução por tasks novas. Dois parâmetros do serviço controlam o ritmo:</p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Parâmetro</th>
                  <th>Significado</th>
                  <th>Exemplo da documentação</th>
                </tr>
                <tr>
                  <td><code>minimumHealthyPercent</code></td>
                  <td>Mínimo de tasks saudáveis durante o deploy, em % do desejado (arredonda para cima).</td>
                  <td>50% com 4 tasks: pode parar 2 antes de iniciar 2 novas.</td>
                </tr>
                <tr>
                  <td><code>maximumPercent</code></td>
                  <td>Máximo de tasks em execução durante o deploy, em % do desejado (arredonda para baixo).</td>
                  <td>200% com 4 tasks: pode iniciar 4 novas antes de parar as 4 antigas.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li>Garanta que o scheduler consiga parar ou iniciar <b>pelo menos uma</b> task no deploy. Com 75% mínimo e 2 tasks, nada pode ser parado e o deploy trava.</li>
            <li>Para detectar falha rápido, use o <b>deployment circuit breaker</b> (falha quando as tasks não conseguem iniciar) e/ou <b>alarmes do CloudWatch</b> (falha por métricas da aplicação). Ambos suportam <b>rollback</b> para a revisão anterior do serviço.</li>
            <li>O ECS resolve a tag da imagem para o <b>digest</b> no início do deploy e usa o digest nas outras tasks, garantindo a mesma imagem em todas. Para pegar um digest atualizado, force um novo deploy (<code>forceNewDeployment</code>).</li>
            <li>Variáveis de ambiente vindas do Parameter Store são resolvidas quando a task inicia: uma task em execução só vê o valor novo após um novo deploy. Veja <a href="#ssm">Systems Manager</a> e <a href="#secrets">Secrets Manager</a>.</li>
          </ul>
          <CodeBlock code={`aws ecs update-service --cluster meu-cluster --service minha-api --force-new-deployment`} />
          <h3>Com o load balancer</h3>
          <p>O ALB consegue registrar tasks do ECS em um target group, inclusive escolhendo uma porta livre quando a task é agendada. Os health checks do target group definem se a task está saudável. Veja <a href="#elb">Load Balancer</a>.</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Aplicações em containers que precisam de deploy repetível, rollback e escala sem operar um plano de controle próprio.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Cargas que não são containers; <code>minimumHealthyPercent</code>/<code>maximumPercent</code> que impedem qualquer substituição; esperar que um valor mudado no Parameter Store apareça em tasks já rodando.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Qual a diferença entre task e service?</summary>
            <div className="ans">Task é uma execução (pode terminar). Service mantém um número desejado de tasks rodando continuamente.</div>
          </details>
          <details className="fc">
            <summary>Como garantir que um deploy com problema volte sozinho?</summary>
            <div className="ans">Habilite o circuit breaker e/ou alarmes do CloudWatch com rollback.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}
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
            <span className="tag">Segredos e acesso · 14</span>
            <h2>Systems Manager</h2>
            <p className="lead">Duas ferramentas do AWS Systems Manager muito usadas no dia a dia: o Session Manager (acesso a servidores sem SSH) e o Parameter Store (configuração centralizada).</p>
          </header>
          <h3>Session Manager</h3>
          <p>Ferramenta totalmente gerenciada para acessar instâncias EC2 (e servidores on-premises/VMs) por um shell interativo no navegador ou pela AWS CLI, <b>sem abrir portas de entrada, sem bastion host e sem gerenciar chaves SSH</b>.</p>
          <div className="flow"> <span className="node"><Icon name="user" /> Você (IAM / SSO)</span><span className="arrow">TLS 1.2 →</span> <span className="node"><Icon name="terminal" /> Session Manager</span><span className="arrow">→</span> <span className="node"><Icon name="chip" /> SSM Agent</span><span className="arrow">→</span> <span className="node"><Icon name="server" /> Instância (subnet privada)</span> </div>
          <ul>
            <li><b>Controle por IAM:</b> as políticas definem quem pode abrir sessões e em quais nós; dá para conceder acesso temporário (ex.: plantão).</li>
            <li><b>Sem IP público:</b> com VPC endpoints (AWS PrivateLink) do Systems Manager, o tráfego fica na rede da AWS. Veja <a href="#vpc">VPC endpoints</a>.</li>
            <li><b>Port forwarding:</b> redireciona uma porta da instância para uma porta local (útil para acessar um banco privado).</li>
            <li><b>Auditoria:</b> integra com CloudTrail, S3, CloudWatch Logs e EventBridge/SNS. Sessões de port forwarding ou SSH <b>não</b> têm log do conteúdo.</li>
            <li><b>Pré-requisitos:</b> o nó precisa ser gerenciado pelo Systems Manager (SSM Agent e permissões IAM; veja "Setting up Session Manager"). Na AWS CLI é preciso a versão 1.16.12 ou superior e o plugin do Session Manager.</li>
          </ul>
          <CodeBlock code={`aws ssm start-session --target i-0123456789abcdef0`} />
          <Callout><strong>Aviso da documentação</strong> A página legada do Session Manager será descontinuada em 31/12/2026; as funções passam para a experiência unificada do console do Systems Manager (você continua iniciando sessões e vendo o histórico).</Callout>
          <h3>Parameter Store</h3>
          <p>Armazém centralizado de configuração: valores nomeados (<i>parameters</i>) que a aplicação lê em tempo de execução, sem deixar valores fixos no código.</p>
          <div className="grid">
            <div className="card">
              <h4>String</h4>
              Texto simples: nome do ambiente, URL de endpoint, ID de recurso.
            </div>
            <div className="card">
              <h4>StringList</h4>
              Lista separada por vírgulas, como <code>subnet-aaa,subnet-bbb</code>.
            </div>
            <div className="card">
              <h4>SecureString</h4>
              Valor criptografado com AWS KMS. Para segredos como senhas, chaves de API e tokens, a documentação recomenda o <a href="#secrets">Secrets Manager</a>.
            </div>
          </div>
          <CodeBlock code={`/minha-app/prod/db-host        # hierarquia: /app/ambiente/nome
/minha-app/staging/db-host`} />
          <ul>
            <li><b>Hierarquia:</b> agrupe por caminho (ex.: <code>/app/ambiente/chave</code>) para buscar e filtrar vários parâmetros de uma vez e dar permissões IAM por prefixo (ler <code>/minha-app/prod/*</code> mas não <code>/minha-app/dev/*</code>).</li>
            <li><b>Versões:</b> guarda as 100 versões mais recentes de cada parâmetro.</li>
            <li><b>Camadas:</b> standard (sem custo adicional; até 10.000 parâmetros por conta/Region, valor de até 4 KB) e advanced (até 100.000; 8 KB; políticas de parâmetro e compartilhamento entre contas; cobrado). Valores da documentação em 2026-10-13; confira a página de preços.</li>
            <li><b>Integrações:</b> ECS/Fargate injetam parâmetros como variáveis de ambiente; Lambda tem extensão; CloudFormation e CodeBuild leem parâmetros. Há também parâmetros públicos que apontam para as AMIs atuais.</li>
          </ul>
          <Callout tone="warn">
            <strong>Pegadinhas</strong>
            <ul>
              <li>Uma atualização vale na próxima leitura, <b>sem validação, rollout gradual ou rollback automático</b>. Para configuração em que um valor ruim derruba o sistema, a AWS aponta o AWS AppConfig.</li>
              <li>No ECS, variáveis do Parameter Store são resolvidas quando a task inicia; mudar o valor exige novo deploy (veja <a href="#ecs">ECS</a>).</li>
              <li>Throughput padrão serve cargas menores; há modo de alto throughput, com custo adicional. Avalie cedo se a aplicação lê parâmetros com frequência.</li>
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
                  <td>Para</td>
                  <td>Configuração estática, endpoints, IDs</td>
                  <td>Credenciais e segredos</td>
                  <td>Configuração que muda com frequência, feature flags</td>
                </tr>
                <tr>
                  <td>Rotação</td>
                  <td>Nenhuma</td>
                  <td>Automática</td>
                  <td>Não se aplica</td>
                </tr>
                <tr>
                  <td>Custo</td>
                  <td>Standard sem custo adicional</td>
                  <td>Por segredo/mês e por chamada</td>
                  <td>Por requisição de configuração</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              <b>Session Manager:</b> acesso a instâncias privadas, sem porta 22. <b>Parameter Store:</b> configuração por ambiente (/app/prod/...) lida pela aplicação.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Parameter Store para segredos que precisam de rotação (use Secrets Manager); alterar parâmetros críticos sem validação; esperar log do conteúdo de sessões SSH/port forwarding.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O que o Session Manager dispensa?</summary>
            <div className="ans">Portas de entrada abertas, bastion hosts e chaves SSH.</div>
          </details>
          <details className="fc">
            <summary>Um SecureString é ideal para uma senha de banco com rotação?</summary>
            <div className="ans">Não. A documentação recomenda o Secrets Manager para credenciais, pois ele rotaciona automaticamente.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" rel="noopener">AWS Systems Manager Session Manager</a></li>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" rel="noopener">AWS Systems Manager Parameter Store</a></li>
              <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" rel="noopener">What is AWS Secrets Manager?</a></li>
            </ul>
            <p><b>Não verificado nesta rodada:</b> o comando <code>aws ssm start-session</code> exato e as permissões necessárias no perfil da instância (consulte "Setting up Session Manager").</p>
          </Sources>
        </section>
        {/* ============ SECRETS ============ */}
        <section className="topic" id="secrets">
          <header>
            <span className="tag">Segredos e acesso · 15</span>
            <h2>Secrets Manager</h2>
            <p className="lead">AWS Secrets Manager ajuda a gerenciar, recuperar e rotacionar credenciais de banco, credenciais de aplicação, tokens OAuth, chaves de API e outros segredos durante todo o ciclo de vida.</p>
          </header>
          <div className="flow"> <span className="node"><Icon name="play" /> Task / função (role IAM)</span><span className="arrow">GetSecretValue →</span> <span className="node"><Icon name="key" /> Secrets Manager</span><span className="arrow"><Icon name="refresh" /> rotação (Lambda) →</span> <span className="node"><Icon name="database" /> RDS</span> </div>
          <ul>
            <li>Em vez de credenciais fixas no código, a aplicação faz uma chamada em tempo de execução ao Secrets Manager. Assim, quem inspeciona a aplicação não encontra a senha.</li>
            <li><b>Rotação automática:</b> troca segredos de longo prazo por segredos de curta duração. Como as credenciais não ficam com a aplicação, rotacionar não exige alterar e redeployar os clientes. A rotação (exceto a gerenciada) usa uma função Lambda, cobrada pelo preço do Lambda.</li>
            <li><b>Criptografia:</b> com AWS KMS. A chave gerenciada <code>aws/secretsmanager</code> é gratuita; chaves próprias são cobradas pela tarifa do KMS.</li>
            <li><b>Versionamento:</b> versões com <i>staging labels</i>. Também há acesso entre contas e log de auditoria detalhado.</li>
            <li><b>Custo:</b> paga-se por segredo por mês e por chamada de API, sem taxa mínima. Segredos marcados para exclusão não são cobrados. Veja a <a href="https://aws.amazon.com/secrets-manager/pricing" rel="noopener">página de preços</a>.</li>
          </ul>
          <h3>Integração com o RDS</h3>
          <p>Ao criar um banco, a opção <b>Manage master credentials in AWS Secrets Manager</b> guarda a senha do usuário master em um segredo (com KMS opcional). O <b>RDS Proxy</b> também conecta no banco usando credenciais guardadas no Secrets Manager. Veja <a href="#rds">RDS</a>.</p>
          <Callout>
            <strong>Cada tipo de segredo, a ferramenta certa (segundo a documentação)</strong>
            <ul>
              <li>Credenciais AWS → IAM · Chaves de criptografia → KMS · Chaves SSH → EC2 Instance Connect · Chaves privadas e certificados → ACM.</li>
            </ul>
          </Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Credenciais de banco, chaves de API e tokens que devem ser rotacionados, auditados ou compartilhados entre contas.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Configuração comum (endpoints, nomes): use <a href="#ssm">Parameter Store</a>, que no tier standard não tem custo adicional; credenciais AWS (use roles).
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Rotacionar a senha exige redeploy da aplicação?</summary>
            <div className="ans">Não, se a aplicação busca o segredo em tempo de execução: as credenciais não ficam embutidas nela.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" rel="noopener">What is AWS Secrets Manager?</a></li>
              <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" rel="noopener">Parameter Store (comparativo com Secrets Manager e AppConfig)</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.Settings.html" rel="noopener">RDS: Settings for DB instances</a> · <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html" rel="noopener">Amazon RDS Proxy</a></li>
            </ul>
            <p><b>Não verificado nesta rodada:</b> o nome exato da chamada de API <code>GetSecretValue</code> usada no diagrama (é a operação padrão de leitura, mas a página lida não a cita).</p>
          </Sources>
        </section>
        {/* ============ RDS ============ */}
        <section className="topic" id="rds">
          <header>
            <span className="tag">Dados · 16</span>
            <h2>RDS</h2>
            <p className="lead">Amazon Relational Database Service: facilita criar, operar e escalar bancos relacionais na nuvem, com a AWS cuidando de backups, patches, detecção de falhas e recuperação.</p>
          </header>
          <p>Motores suportados: Db2, MariaDB, SQL Server, MySQL, Oracle e PostgreSQL (o Aurora tem guia próprio). A AWS recomenda o RDS como escolha padrão para a maioria dos bancos relacionais; em um banco sobre EC2, instalação, patch do SO e do banco, backup e alta disponibilidade ficam por sua conta.</p>
          <div className="vpc">
            <div className="label">Arquitetura típica</div>
            <div className="flow"> <span className="node"><Icon name="balance" /> ALB<br /><small>subnet pública</small></span><span className="arrow">→</span> <span className="node"><Icon name="server" /> App<br /><small>subnet privada</small></span><span className="arrow">→</span> <span className="node"><Icon name="database" /> DB primary<br /><small>AZ A · privada</small></span><span className="arrow">⇄ sync</span> <span className="node"><Icon name="database" /> DB standby<br /><small>AZ B · privada</small></span> </div>
          </div>
          <h3>Conceitos</h3>
          <div className="grid">
            <div className="card">
              <h4><Icon name="layers" /> DB instance</h4>
              Ambiente de banco isolado na nuvem; pode conter um ou mais bancos criados por você. A <b>classe</b> define CPU e memória: há classes de uso geral (db.m), otimizadas para memória (db.r, db.x, db.z), para computação (db.c) e <b>burstable</b> (db.t).
            </div>
            <div className="card">
              <h4><Icon name="database" /> Storage</h4>
              Volumes EBS. Tipos: General Purpose SSD (indicado para dev/teste), Provisioned IOPS SSD (para cargas intensivas em I/O, indicado para produção) e Magnetic (obsoleto). O storage autoscaling aumenta o espaço sozinho (veja abaixo).
            </div>
            <div className="card">
              <h4><Icon name="network" /> VPC</h4>
              O banco roda em uma VPC. Você cria um <b>DB subnet group</b> com subnets em pelo menos <b>duas</b> zonas de disponibilidade da Region (mesmo em Single-AZ, para poder virar Multi-AZ depois). Reserve IPs livres nas subnets: o RDS usa para failover e manutenção.
            </div>
          </div>
          <h3>Acesso e segurança</h3>
          <ul>
            <li><b>Public access:</b> "Yes" dá um IP público ao banco; para isso todas as subnets do DB subnet group precisam de internet gateway. "No" deixa o acesso só de dentro da VPC. O acesso final é sempre controlado pelo <a href="#sg">Security Group</a>: libere a porta do banco só do SG da aplicação.</li>
            <li><b>Master user:</b> usuário criado com a instância, com privilégios altos mas <b>não</b> equivalentes a superusuário total (a lista varia por motor). O nome não pode ser alterado depois. A AWS recomenda <b>não</b> usar o master na aplicação: crie um usuário com o mínimo de privilégios.</li>
            <li><b>Secrets Manager:</b> a opção <i>Manage master credentials in AWS Secrets Manager</i> guarda a senha master em um segredo. Veja <a href="#secrets">Secrets Manager</a>.</li>
            <li><b>Encryption / KMS:</b> criptografia em repouso é opção na criação; com ela você escolhe a chave KMS.</li>
            <li><b>Deletion protection:</b> impede apagar o banco por engano (no console, é ligada por padrão ao criar uma instância de produção).</li>
            <li><b>RDS Proxy:</b> mantém um pool de conexões e as compartilha, ajuda a aplicação a escalar e a suportar picos, e se reconecta ao standby em falhas. Fica na mesma VPC do banco e não é publicamente acessível; só funciona para MariaDB, MySQL e PostgreSQL (entre os motores listados). Tem cobrança própria; veja os preços.</li>
          </ul>
          <h3>Multi-AZ</h3>
          <div className="grid">
            <div className="card">
              <h4>Multi-AZ DB instance</h4>
              Um <b>standby</b> síncrono em outra AZ, para failover. O standby <b>não atende leitura</b>.
            </div>
            <div className="card">
              <h4>Multi-AZ DB cluster</h4>
              Um writer e <b>dois readers</b> em três AZs; os três atendem leitura e dão suporte a failover.
            </div>
          </div>
          <p>Multi-AZ traz redundância de dados e suporte a failover, elimina congelamentos de I/O e reduz picos de latência em backups. É recomendado para produção; para desenvolvimento e teste dá para criar sem standby.</p>
          <p>Não confunda com <i>read replicas</i> (escalam leitura, replicação assíncrona). O IP do banco muda no failover: conecte-se sempre pelo nome DNS (endpoint).</p>
          <h3>Backups</h3>
          <ul>
            <li><b>Backups automáticos:</b> o RDS faz um snapshot do volume da instância na janela de backup e guarda pelo <i>backup retention period</i> que você define, permitindo restaurar a <b>qualquer ponto no tempo</b> dentro do período. Só ocorrem com o banco no estado <code>available</code>. Para qualquer banco que importe, use retenção de 1 dia ou mais.</li>
            <li><b>Snapshots manuais:</b> você cria quando quiser; não são apagados quando a instância é excluída (até 100 manuais por Region, segundo a página lida). Backups automáticos são apagados com a instância, a não ser que você escolha retê-los; o snapshot final é opcional.</li>
            <li>O primeiro snapshot tem o banco completo; os seguintes são incrementais. Backups ficam no S3 e geram custo de armazenamento.</li>
          </ul>
          <h3>Storage autoscaling</h3>
          <p>Você define um <b>Maximum storage threshold</b>. O RDS aumenta o storage quando o espaço livre cai a 10% ou menos do alocado por pelo menos 5 minutos, e as modificações anteriores terminaram (máximo de quatro por 24 h). O aumento é do maior valor entre 10 GiB, 10% do alocado e o crescimento previsto. Não precisa de reinício nem causa downtime.</p>
          <Callout tone="warn"><strong>Pegadinhas</strong> O autoscaling <b>nunca reduz</b> o storage alocado. Cargas grandes de dados podem esgotar o espaço mesmo com autoscaling, porque há intervalo mínimo entre modificações. O threshold máximo deve ser pelo menos 10% maior que o alocado (a AWS sugere 26%).</Callout>
          <h3>Nomes: instância vs. banco</h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Campo / Field</th>
                  <th>O que é</th>
                </tr>
                <tr>
                  <td>DB instance identifier</td>
                  <td>Nome da instância no RDS (até 63 caracteres alfanuméricos, único na conta e Region).</td>
                </tr>
                <tr>
                  <td>Initial database name</td>
                  <td>Nome do banco criado dentro da instância. Se você não informar, o RDS <b>não</b> cria banco (exceto em Oracle e PostgreSQL).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Bancos relacionais de aplicações, com backup, patch e failover gerenciados. Multi-AZ e deletion protection em produção.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Acesso público sem necessidade; usar o master na aplicação; achar que Multi-AZ substitui backup; depender de read replica como alta disponibilidade.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>O standby de um Multi-AZ DB instance atende consultas de leitura?</summary>
            <div className="ans">Não. Só o Multi-AZ DB <i>cluster</i> tem readers que atendem leitura.</div>
          </details>
          <details className="fc">
            <summary>Instance Identifier e Initial Database Name são a mesma coisa?</summary>
            <div className="ans">Não. Um nomeia a instância no RDS, o outro o banco dentro dela.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
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
            <p><b>Corrigido ou removido:</b> "você não tem acesso ao root; o master é restrito" foi trocado pela descrição da documentação (privilégios elevados do master, lista por motor); "a VPC não muda depois" e "a chave KMS não pode ser alterada depois" saíram por falta de suporte nas páginas lidas; itens sobre o helper "Connect to an EC2" e sobre Certificate Authority ficaram fora por falta de leitura da fonte (consulte "Settings for DB instances").</p>
          </Sources>
        </section>
        {/* ============ S3 ============ */}
        <section className="topic" id="s3">
          <header>
            <span className="tag">Dados · 17</span>
            <h2>S3</h2>
            <p className="lead">Amazon Simple Storage Service: armazenamento de objetos com grande escala, disponibilidade, segurança e desempenho, para sites, backups, aplicações, data lakes e mais.</p>
          </header>
          <div className="grid">
            <div className="card">
              <h4><Icon name="bucket" /> Bucket</h4>
              Contêiner de objetos, criado em uma Region. Nome e Region não mudam depois. O nome de um bucket de uso geral é único no namespace global (ou no namespace regional da sua conta).
            </div>
            <div className="card">
              <h4><Icon name="doc" /> Object &amp; key</h4>
              Objeto = dados + metadados. A <b>key</b> é o identificador dentro do bucket. Bucket + key (+ versão) identificam o objeto. Com <b>versioning</b>, você preserva e restaura cada versão.
            </div>
            <div className="card">
              <h4><Icon name="lock" /> Privado por padrão</h4>
              Buckets e objetos são privados até você conceder acesso (políticas de bucket, IAM, access points). O <b>Block Public Access</b> vem ativado; mantenha-o, salvo necessidade específica.
            </div>
            <div className="card">
              <h4><Icon name="check" /> Consistência forte</h4>
              Leitura-após-escrita forte para PUT e DELETE em todas as Regions: após um PUT bem-sucedido, o GET/LIST seguinte já vê o dado novo. Para gravações simultâneas na mesma key, vale a última (last-writer-wins).
            </div>
          </div>
          <h3>Presigned URL</h3>
          <p>Link temporário que dá acesso a <b>um objeto</b> por tempo limitado, sem mexer na bucket policy. Usa as credenciais de quem gerou a URL; para funcionar, essa identidade precisa ter a permissão da operação (ex.: <code>s3:GetObject</code>).</p>
          <p>Serve para download (GET) e upload (PUT) direto no S3, sem passar pelo seu servidor. Se já existir um objeto com a mesma key, o upload o <b>substitui</b>.</p>
          <div className="flow"><span className="node"><Icon name="globe" /> Navegador</span><span className="arrow">①→</span><span className="node"><Icon name="server" /> Seu servidor</span><span className="arrow">② URL assinada ←</span><span className="node"><Icon name="globe" /></span><span className="arrow">③ PUT/GET →</span><span className="node"><Icon name="bucket" /> S3</span></div>
          <ul>
            <li><b>Validade:</b> pelo console, de 1 minuto a 12 horas; pela AWS CLI/SDKs, até 7 dias (credenciais de usuário IAM com Signature V4).</li>
            <li><b>Pegadinha:</b> se a URL foi gerada com credenciais temporárias (role, STS, perfil da EC2/ECS), ela expira junto com a credencial, mesmo que você tenha pedido prazo maior. O S3 confere a validade no momento da requisição: um download já iniciado continua, mas retomar depois do prazo falha.</li>
            <li>A URL é um "bearer token": quem a tiver acessa o objeto. Proteja-a e, se quiser, restrinja com condições (ex.: <code>s3:signatureAge</code>, origem de rede).</li>
          </ul>
          <h3>Custos</h3>
          <p>A cobrança do S3 é por uso, sem taxas mínimas ou de excedente. Valores reais ficam na <a href="https://aws.amazon.com/s3/pricing/" rel="noopener">página de preços do S3</a> (as cifras da anotação antiga foram removidas). Pontos que a documentação destaca:</p>
          <ul>
            <li>Armazenamento por classe, requisições e transferência de dados.</li>
            <li>Classes IA e Glacier têm <b>taxa de recuperação</b>, duração mínima de armazenamento e tamanho mínimo cobrado.</li>
            <li>Transições de lifecycle têm custo por requisição (não há taxa de recuperação nas transições).</li>
          </ul>
          <h3>Classes de armazenamento</h3>
          <p>Todas as classes são projetadas para alta durabilidade (11 noves, 99,999999999%, exceto a legada Reduced Redundancy). A diferença está em acesso, disponibilidade, custo e regras mínimas:</p>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Classe</th>
                  <th>Indicada para</th>
                  <th>Duração mínima</th>
                </tr>
                <tr>
                  <td>Standard</td>
                  <td>Dados acessados com frequência, acesso em milissegundos (padrão)</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Intelligent-Tiering</td>
                  <td>Padrão de acesso desconhecido ou variável: move objetos entre camadas sozinho. Sem taxa de recuperação; há taxa de monitoramento. Objetos menores que 128 KB não são monitorados.</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Standard-IA / One Zone-IA</td>
                  <td>Dados de longa vida e acesso raro, ainda em milissegundos. One Zone-IA guarda em uma única AZ (não resiste à perda da AZ).</td>
                  <td>30 dias</td>
                </tr>
                <tr>
                  <td>Glacier Instant Retrieval</td>
                  <td>Arquivo acessado cerca de uma vez por trimestre, com acesso em milissegundos</td>
                  <td>90 dias</td>
                </tr>
                <tr>
                  <td>Glacier Flexible Retrieval</td>
                  <td>Arquivo acessado cerca de uma vez por ano; recuperação de minutos a horas, é preciso <i>restaurar</i> antes de ler</td>
                  <td>90 dias</td>
                </tr>
                <tr>
                  <td>Glacier Deep Archive</td>
                  <td>Arquivo acessado menos de uma vez por ano; recuperação em horas, é preciso restaurar</td>
                  <td>180 dias</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">{"Existe ainda o S3 Express One Zone (latência de um dígito de milissegundo em uma única AZ). Os tamanhos mínimos faturáveis (128 KB nas IA e Glacier IR) e as disponibilidades por classe estão na tabela de comparação oficial. Correção: o \"Glacier\" da anotação antiga virou três classes, e só duas exigem restauração."}</p>
          <h3>Lifecycle rules</h3>
          <p>Um conjunto de regras no bucket que faz o S3 agir sobre grupos de objetos. Dois tipos de ação: <b>transition</b> (mover para uma classe mais barata) e <b>expiration</b> (apagar quando expirar). As regras valem para objetos existentes e futuros; uma bucket policy <b>não</b> consegue impedir a ação do lifecycle.</p>
          <div className="flow"><span className="node">Standard</span><span className="arrow">30d →</span><span className="node">Standard-IA</span><span className="arrow">90d →</span><span className="node">Glacier Flexible</span><span className="arrow">365d →</span><span className="node"><Icon name="trash" /> Expira</span></div>
          <p className="muted">Prazos de exemplo. Respeite as durações mínimas das classes (30/90/180 dias): apagar ou mover cedo gera cobrança proporcional.</p>
          <h3>Static website hosting</h3>
          <p>O S3 pode hospedar um site <b>estático</b>: páginas com conteúdo estático, possivelmente com scripts no navegador (SPA, HTML puro). É preciso configurar um <i>index document</i> e permissões de acesso.</p>
          <p>A AWS recomenda usar o <b>AWS Amplify Hosting</b> para servir o conteúdo do S3 com CDN (CloudFront) e URL HTTPS. Se o bucket usa criptografia SSE-KMS, é obrigatório servir via CloudFront com <b>origin access control (OAC)</b>, pois SSE-KMS não suporta usuários anônimos.</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Arquivos, uploads de usuários (com presigned URL), backups, logs, sites estáticos, dados que seguem o ciclo hot→cold com lifecycle.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Desligar o Block Public Access sem necessidade; presigned URL longa com credencial temporária; mover objetos pequenos para classes com tamanho mínimo; bloquear o lifecycle esperando que a bucket policy resolva.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Uma presigned URL gerada por uma role de 1 hora vale 7 dias se eu pedir?</summary>
            <div className="ans">Não. Ela expira quando a credencial da role expira.</div>
          </details>
          <details className="fc">
            <summary>Quais classes exigem restaurar o objeto antes de ler?</summary>
            <div className="ans">Glacier Flexible Retrieval e Glacier Deep Archive (e as camadas de arquivo opcionais do Intelligent-Tiering).</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" rel="noopener">What is Amazon S3?</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" rel="noopener">Download and upload objects with presigned URLs</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" rel="noopener">Understanding and managing Amazon S3 storage classes</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html" rel="noopener">Managing the lifecycle of objects</a></li>
              <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html" rel="noopener">Hosting a static website using Amazon S3</a></li>
            </ul>
            <p><b>Removido por falta de fonte:</b> "$0,023 por GB", "uploads são mais caros", "entrada é grátis" e "egress costuma ser o maior custo". <b>Ajustado:</b> "index.html obrigatório" (a documentação fala em configurar um index document).</p>
          </Sources>
        </section>
        {/* ============ DOMINIOS ============ */}
        <section className="topic" id="dominios">
          <header>
            <span className="tag">DNS · 18</span>
            <h2>Domínios e DNS</h2>
            <p className="lead">O DNS traduz nomes (<code>app.exemplo.com.br</code>) em destinos. Os <b>registros</b> de uma zona dizem para onde cada nome aponta; o domínio em si é só o nome registrado.</p>
          </header>
          <h3>Tipos de registro</h3>
          <div className="scroll-x">
            <table>
              <tbody>
                <tr>
                  <th>Tipo</th>
                  <th>Função</th>
                </tr>
                <tr>
                  <td><b>A</b></td>
                  <td>Aponta um nome para um endereço <b>IPv4</b> (ex.: <code>192.0.2.1</code>).</td>
                </tr>
                <tr>
                  <td><b>AAAA</b></td>
                  <td>Igual ao A, mas para <b>IPv6</b> (ex.: <code>2001:0db8:85a3:0:0:8a2e:0370:7334</code>).</td>
                </tr>
                <tr>
                  <td><b>CNAME</b></td>
                  <td>Mapeia um nome para <b>outro nome</b>. O protocolo DNS <b>não permite</b> CNAME no topo da zona (o apex, ex.: <code>exemplo.com</code>), só em subdomínios. E, se um nome tem CNAME, não pode ter outros registros.</td>
                </tr>
                <tr>
                  <td><b>Alias</b> (Route 53)</td>
                  <td>Extensão do Route 53: aponta para certos recursos AWS (ALB, CloudFront, bucket S3 de site, API Gateway...). <b>Pode ser usado no apex.</b> Não é cobrada a consulta a alias para recursos AWS.</td>
                </tr>
                <tr>
                  <td><b>NS</b></td>
                  <td>Identifica os <b>name servers</b> da zona, quem responde pelo DNS dela. Também delega subdomínios para outra zona.</td>
                </tr>
                <tr>
                  <td><b>MX</b></td>
                  <td>Servidores de e-mail do domínio, cada um com uma <b>prioridade</b> (o menor valor vence). Deve apontar para o nome de um registro A/AAAA, não de um CNAME.</td>
                </tr>
                <tr>
                  <td><b>TXT</b></td>
                  <td>Uma ou mais strings entre aspas (até 255 caracteres cada; até 4.000 no valor). Muito usado para verificações e e-mail (SPF).</td>
                </tr>
                <tr>
                  <td><b>SOA</b></td>
                  <td>Informações administrativas da zona (criado pelo Route 53).</td>
                </tr>
                <tr>
                  <td><b>CAA</b></td>
                  <td>Define quais autoridades certificadoras podem emitir certificados para o domínio.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">E-mail profissional no seu domínio exige o domínio e registros MX apontando para o provedor de e-mail. A AWS não recomenda mais o tipo SPF: use um TXT.</p>
          <h3>Provar que o domínio é seu</h3>
          <p>O padrão da AWS para certificados é a validação por DNS: o ACM entrega um <b>CNAME</b> único e você o cria na zona. Veja <a href="#acm">ACM</a>.</p>
          <Callout tone="personal"><strong>Nota pessoal · fora da documentação da AWS</strong> <b>Cloudflare "Proxied":</b> nas anotações do curso, o tráfego passa pelos servidores da Cloudflare antes de chegar ao seu servidor (proteção DDoS, WAF, cache, IP final escondido). É um serviço de terceiros, não coberto pela documentação da AWS, e não foi verificado. Consulte a documentação da Cloudflare.</Callout>
          <div className="flow"><span className="node"><Icon name="globe" /> Usuário</span><span className="arrow">→</span><span className="node"><Icon name="cloud" /> Cloudflare</span><span className="arrow">→</span><span className="node"><Icon name="server" /> Seu servidor</span></div>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              CNAME para subdomínios que apontam a outro nome; Alias para o apex e para recursos AWS; TXT/MX para verificação e e-mail.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              CNAME no apex; CNAME com outros registros no mesmo nome; MX apontando para um CNAME; SPF como tipo de registro.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Posso usar CNAME no domínio raiz?</summary>
            <div className="ans">Não: o DNS não permite no apex. No Route 53 use um registro Alias.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" rel="noopener">Supported DNS record types (Route 53)</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" rel="noopener">Choosing between alias and non-alias records</a></li>
              <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" rel="noopener">ACM DNS validation</a></li>
            </ul>
            <p><b>Removido por falta de fonte:</b> "você prova que é dono criando registros TXT no painel do registrador" (a documentação da AWS descreve CNAME para o ACM).</p>
          </Sources>
        </section>
        {/* ============ ROUTE 53 ============ */}
        <section className="topic" id="route53">
          <header>
            <span className="tag">DNS · 19</span>
            <h2>Route 53</h2>
            <p className="lead">Serviço de DNS da AWS. Você cria <b>hosted zones</b> com os registros dos seus domínios e aponta nomes para recursos como o load balancer.</p>
          </header>
          <h3>Hosted Zones</h3>
          <p>Uma hosted zone é um <b>contêiner de registros</b> que dizem como rotear o tráfego de um domínio e seus subdomínios. Ela tem o mesmo nome do domínio. O preço por zona e por consulta está na <a href="https://aws.amazon.com/route53/pricing/" rel="noopener">página de preços do Route 53</a> (o valor fixo da anotação antiga foi removido).</p>
          <div className="grid">
            <div className="card">
              <h4><Icon name="globe" /> Pública</h4>
              Registros que dizem como rotear o tráfego na <b>internet</b> (site, API, e-mail).
            </div>
            <div className="card">
              <h4><Icon name="lock" /> Privada</h4>
              Registros que dizem como rotear o tráfego dentro de uma <b>VPC</b>, por exemplo <code>db.interno.exemplo</code> resolvendo só para quem está na rede.
            </div>
          </div>
          <h3>NS &amp; SOA</h3>
          <p>Ao criar uma zona pública, o Route 53 cria os registros <b>NS</b> (quatro name servers) e <b>SOA</b>. Para que a internet use essa zona, vá ao registrador do domínio (onde ele foi registrado) e configure os quatro name servers do NS padrão da zona. Para delegar um subdomínio a outra zona, crie um NS na zona do domínio raiz.</p>
          <div className="flow"><span className="node"><Icon name="cart" /> Registrador</span><span className="arrow">NS →</span><span className="node"><Icon name="doc" /> Route 53 HZ</span><span className="arrow">A/AAAA Alias →</span><span className="node"><Icon name="balance" /> ALB</span></div>
          <h3>Apontar o domínio para o ALB</h3>
          <p>Crie um registro <b>Alias</b> do tipo A (e AAAA, se o ALB tiver IPv6) para o ALB. Quando o IP do load balancer muda, o Route 53 passa a responder com o novo sem você fazer nada. Para um alias a um recurso AWS você não define o TTL (vale o padrão do recurso) e não paga a consulta. O Alias funciona também no apex (<code>exemplo.com.br</code>), onde o CNAME não é permitido.</p>
          <ul>
            <li>O alias precisa ter o mesmo <b>nome e tipo</b> da consulta (A ou AAAA) para ser respondido.</li>
            <li>Há políticas de roteamento além da simples: weighted, latency, failover, geolocation e geoproximity também aceitam alias.</li>
            <li>Para HTTPS, emita o certificado no <a href="#acm">ACM</a> (a validação por DNS cria um CNAME nesta mesma zona).</li>
          </ul>
          <Callout tone="personal"><strong>Removido</strong> {"A seção \"Classes de IP\" das anotações antigas (os quatro números de um IP chamados de classes A, B, C e D) não tem apoio na documentação do Route 53 e não foi mantida."}</Callout>
          <div className="grid">
            <div className="card">
              <h4><Icon name="check" /> Quando usar</h4>
              Domínios que apontam para recursos AWS (Alias); nomes internos por VPC (zona privada); controle do DNS junto da infraestrutura.
            </div>
            <div className="card">
              <h4><Icon name="alert" /> Quando evitar</h4>
              Ter zonas duplicadas para o mesmo domínio sem saber qual está nos NS do registrador; CNAME no apex; esquecer de atualizar os NS no registrador.
            </div>
          </div>
          <div className="fc-title">Teste-se</div>
          <details className="fc">
            <summary>Onde coloco os 4 NS da Route 53 se comprei o domínio em outro lugar?</summary>
            <div className="ans">No painel do registrador onde o domínio foi registrado, nas configurações de name servers do domínio.</div>
          </details>
          <details className="fc">
            <summary>Alias ou CNAME para apontar o domínio raiz ao ALB?</summary>
            <div className="ans">Alias, porque CNAME não pode ficar no apex.</div>
          </details>
          <Sources title={"Fontes oficiais · verificado em 2026-10-13"}>
            <ul>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html" rel="noopener">Working with hosted zones</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" rel="noopener">Choosing between alias and non-alias records</a></li>
              <li><a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" rel="noopener">Supported DNS record types</a></li>
              <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" rel="noopener">ACM DNS validation</a></li>
            </ul>
            <p><b>Movido:</b> o item "ACM" que ficava aqui agora tem sua própria seção. <b>Não verificado nesta rodada:</b> compra/registro de domínio pelo Route 53 (a anotação antiga o citava; consulte a documentação de registro de domínios).</p>
          </Sources>
        </section>
      </div>
    </>
  );
}
