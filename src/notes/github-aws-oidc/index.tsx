import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "github-aws-oidc",
  title: "Deploy do GitHub para a AWS com OIDC",
  seo: {
    title: "GitHub para AWS: OIDC, Docker, ECR e ECS",
    description: "Um push em develop ou main faz deploy na AWS sem chaves guardadas: provedor OIDC, roles IAM, environments, imagem Docker por ambiente, ECR e troca no ECS, passo a passo com base na documentação oficial.",
  },
  summary: "CI/CD do GitHub Actions para a AWS, em develop e produção, sem chave guardada: provedor OIDC e roles, environments do GitHub, uma imagem Docker por ambiente, ECR e rolling update no ECS (ou Docker puro no EC2 via SSM), com base na documentação oficial.",
  kicker: "CI/CD",
  heroTitle: <>Do push ao container no ar: <em>OIDC, Docker, ECR e ECS.</em></>,
  heroLede: <>Um push em <code>develop</code> ou <code>main</code> constrói uma imagem Docker com a configuração do ambiente, guarda no ECR e troca o container em execução na conta AWS correspondente, sem chaves de acesso guardadas.</>,
  published: "2026-10-13",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "overview", title: "O fluxo completo" },
        { id: "how", title: "Como o OIDC funciona" },
        { id: "anatomy", title: "Os nomes: issuer, audience, STS" },
        { id: "layout", title: "Uma branch, um ambiente, uma conta" },
        { id: "prereq", title: "Antes de começar" },
        { id: "provider", title: "1. Provedor OIDC na AWS" },
        { id: "roles", title: "2. Roles IAM e trust policy" },
        { id: "environments", title: "3. Environments e variáveis no GitHub" },
        { id: "secrets", title: "4. Secrets: onde ficam e por quê" },
        { id: "config", title: "5. Configuração por ambiente" },
        { id: "ecr", title: "6. O repositório de imagens (ECR)" },
        { id: "ecs", title: "7. Como o ECS troca o container" },
        { id: "workflow", title: "8. O workflow completo" },
        { id: "run", title: "9. Primeiro deploy" },
        { id: "ec2", title: "10. Alternativa: Docker puro numa EC2" },
        { id: "production", title: "Como fica em produção real" },
        { id: "checks", title: "Voltar atrás e problemas comuns" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={"O fluxo completo"}>
        <p>O objetivo: depois de um commit chegar em <code>develop</code> ou <code>main</code>, o GitHub constrói uma imagem Docker com a configuração <b>daquele ambiente</b>, guarda a imagem no repositório de imagens (Amazon ECR) <b>da conta AWS correta</b> e troca o container em execução pelo novo. Ninguém entra em servidor, ninguém guarda chave de acesso.</p>
        <Diagram minWidth={560} caption={"O caminho de um commit até o container novo rodando."}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Fluxo completo: push, build, OIDC, ECR e ECS">
            <rect x="276" y="14" width="418" height="118" rx="6" className="ln dash" />
            <text x="485" y="150" className="mut" textAnchor="middle">tudo isto acontece na conta AWS do ambiente (dev ou prod)</text>
            <rect x="8" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="67" y="32" className="mono mut" textAnchor="middle">1</text>
            <text x="67" y="67" textAnchor="middle">git push</text>
            <text x="67" y="87" className="mut" textAnchor="middle">develop ou main</text>
            <path d="M126 72L146 72" className="ln" />
            <path d="M138.8 75.5L146 72L138.8 68.5" className="ln" />
            <rect x="146" y="40" width="118" height="64" rx="4" className="ln brandfill" />
            <text x="205" y="32" className="mono mut" textAnchor="middle">2</text>
            <text x="205" y="67" textAnchor="middle">GitHub Actions</text>
            <text x="205" y="87" className="mut" textAnchor="middle">build da imagem</text>
            <path d="M264 72L284 72" className="ln" />
            <path d="M276.8 75.5L284 72L276.8 68.5" className="ln" />
            <rect x="284" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="343" y="32" className="mono mut" textAnchor="middle">3</text>
            <text x="343" y="67" textAnchor="middle">OIDC → STS</text>
            <text x="343" y="87" className="mut" textAnchor="middle">credenciais de 1 h</text>
            <path d="M402 72L422 72" className="ln" />
            <path d="M414.8 75.5L422 72L414.8 68.5" className="ln" />
            <rect x="422" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="481" y="32" className="mono mut" textAnchor="middle">4</text>
            <text x="481" y="67" textAnchor="middle">Amazon ECR</text>
            <text x="481" y="87" className="mut" textAnchor="middle">guarda a imagem</text>
            <path d="M540 72L560 72" className="ln" />
            <path d="M552.8 75.5L560 72L552.8 68.5" className="ln" />
            <rect x="560" y="40" width="118" height="64" rx="4" className="ln brandfill" />
            <text x="619" y="32" className="mono mut" textAnchor="middle">5</text>
            <text x="619" y="67" textAnchor="middle">Amazon ECS</text>
            <text x="619" y="87" className="mut" textAnchor="middle">troca a task</text>
            <text x="8" y="176" className="mut" textAnchor="start">Cada passo só roda se o anterior deu certo; se qualquer um falhar, o container que está no ar continua intocado.</text>
            <text x="8" y="200" className="mut" textAnchor="start">A imagem leva como tag o SHA do commit: cada versão é rastreável e pode ser reimplantada.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><b>Push.</b> O merge de um PR em <code>develop</code> (ou <code>main</code>) registra um evento <code>push</code> e dispara o workflow.</li>
          <li><b>Build.</b> O job escolhe o environment pelo nome da branch e constrói a imagem passando como <code>--build-arg</code> as variáveis <b>desse</b> environment.</li>
          <li><b>Credenciais.</b> O GitHub emite um token OIDC; a AWS o troca por credenciais temporárias da role da conta do ambiente (etapas 1 a 3).</li>
          <li><b>Registro.</b> A imagem sobe para o ECR da <b>mesma conta</b>, com o SHA do commit como tag.</li>
          <li><b>Troca.</b> O workflow registra uma task definition nova apontando para a imagem nova e manda o serviço ECS usá-la. O ECS sobe o container novo, espera ele ficar saudável e para o antigo.</li>
          <li><b>Verificação.</b> O job espera o serviço estabilizar. Se a versão nova não ficar saudável, o job falha e o ECS pode desfazer sozinho.</li>
        </ol>
        <Callout tone="use" icon="check"><b>E o “parar e excluir o container atual”?</b> No ECS você não roda <code>docker stop</code> e <code>docker rm</code>. O serviço faz a troca (<i>rolling update</i>): a documentação diz que o scheduler “substitui as tasks em execução por tasks novas”. A task antiga é parada e o container dela é descartado junto. Se você usa Docker puro numa EC2, o mesmo passo é manual: veja <a href="#ec2">a alternativa com EC2 (etapa 10)</a>.</Callout>
      </Section>
      <Section id="how" title={"Como o OIDC funciona"}>
        <p>Em vez de guardar chaves de acesso da AWS nos secrets do GitHub, o GitHub Actions emite um token OIDC de curta duração para cada execução. A AWS confia no GitHub como provedor de identidade e troca esse token por credenciais temporárias de uma role IAM.</p>
        <ol className="ds-steps">
          <li>O job pede um token ao GitHub (precisa de <code>id-token: write</code>).</li>
          <li>A action <code>aws-actions/configure-aws-credentials</code> envia o token à AWS (<code>sts:AssumeRoleWithWebIdentity</code>).</li>
          <li>A AWS confere a <em>trust policy</em> da role: emissor, audiência (<code>aud</code>) e quem está pedindo (<code>sub</code>).</li>
          <li>Se bater, devolve credenciais temporárias (por padrão, 1 hora) que os passos seguintes usam.</li>
        </ol>
        <p>Não há segredo para vazar nem para rotacionar. O controle de quem pode fazer deploy passa a morar na trust policy.</p>
      </Section>
      <Section id="anatomy" title={"Os nomes: issuer, audience, STS"}>
        <p>Os valores <code>token.actions.githubusercontent.com</code> e <code>sts.amazonaws.com</code> parecem endereços para onde algo é enviado, mas na maior parte do tempo são <b>identificadores</b> que precisam ser iguais nos dois lados. Esta seção separa o que é padrão aberto do que é convenção da AWS.</p>
        <h3>Glossário</h3>
        <Table
          head={["Termo", "O que é"]}
          rows={[
            [<code>token.actions.githubusercontent.com</code>, <>O <b>emissor</b> (<i>issuer</i>) dos tokens do GitHub Actions: o serviço do GitHub que assina o JWT de cada execução. Vai no campo <code>iss</code> do token e é o “Provider URL” que você cadastra na AWS. Como tem esse nome, é também um servidor real e público, de onde a AWS busca as chaves de verificação (veja abaixo). É o mesmo emissor para <b>todos</b> os repositórios do GitHub, e é por isso que a condição em <code>sub</code> é obrigatória.</>],
            [<code>sts.amazonaws.com</code>, <>Dois papéis com o mesmo nome. (1) É o endereço da API do <b>STS</b> (Security Token Service), o serviço da AWS que emite credenciais temporárias. (2) Neste fluxo, é o valor da <b>audiência</b> (<code>aud</code>): para quem o token se destina. O GitHub coloca esse texto no token, e a AWS compara com a lista de “Audience” do provedor. Nenhuma chamada vai para um “endereço de audiência”; é só uma etiqueta combinada.</>],
            ["STS", <>AWS Security Token Service. Recebe uma prova de identidade (aqui, o token do GitHub) e devolve um trio temporário: <code>AccessKeyId</code>, <code>SecretAccessKey</code> e <code>SessionToken</code>, com data de expiração. Existe um endpoint global (<code>sts.amazonaws.com</code>) e endpoints regionais (por exemplo <code>sts.sa-east-1.amazonaws.com</code>).</>],
            ["JWT", <>JSON Web Token: três partes em base64url separadas por ponto (cabeçalho, conteúdo e assinatura). O conteúdo é uma lista de <i>claims</i> (afirmações). Qualquer um lê, mas só quem tem a chave privada do emissor consegue assinar.</>],
            [<><code>iss</code> · <code>aud</code> · <code>sub</code></>, <>Claims do JWT. <code>iss</code>: quem emitiu. <code>aud</code>: para quem é. <code>sub</code>: quem é o “sujeito”, aqui montado pelo GitHub a partir do repositório e do environment/branch (tabela na etapa 2).</>],
            ["JWKS", <>JSON Web Key Set: a lista de <b>chaves públicas</b> do emissor, publicada numa URL (<code>jwks_uri</code>). A AWS baixa essa lista para verificar a assinatura do token.</>],
            [<code>sts:AssumeRoleWithWebIdentity</code>, <>A chamada de API do STS que troca o token por credenciais de uma role. Ela <b>não é assinada</b> com credenciais AWS (não há nenhuma ainda): o próprio token é a credencial. É também o nome da <i>Action</i> na trust policy.</>],
            ["Provedor OIDC (IAM)", "O registro, dentro da sua conta, dizendo “aceito tokens deste emissor, com esta audiência”. Não guarda segredo nenhum; guarda só a URL do emissor e a lista de audiências."],
          ]}
        />
        <h3>O que a AWS faz com o token, em ordem</h3>
        <ol className="ds-steps">
          <li>O runner do GitHub pede o token ao emissor (a action faz isso por você quando o job tem <code>id-token: write</code>) e o envia ao STS com <code>AssumeRoleWithWebIdentity</code>, indicando o ARN da role.</li>
          <li>O STS lê o <code>iss</code> e procura, <b>na conta da role</b>, um provedor OIDC com essa URL. Se não houver, falha.</li>
          <li>Busca <code>https://token.actions.githubusercontent.com/.well-known/openid-configuration</code>, de onde tira o <code>jwks_uri</code>, e baixa as chaves públicas. A conexão é validada pelas autoridades raiz confiáveis da AWS; só se o certificado não for de uma delas entram os thumbprints cadastrados.</li>
          <li>Verifica a <b>assinatura</b> com a chave pública certa e confere a validade do token (<code>iat</code> e expiração).</li>
          <li>Confere a <b>audiência</b>: o <code>aud</code> do token precisa estar na lista de Audience do provedor.</li>
          <li>Avalia a <b>trust policy</b> da role: <code>Principal.Federated</code> é este provedor? As condições em <code>:aud</code> e <code>:sub</code> batem? Só então emite as credenciais temporárias.</li>
        </ol>
        <p>Os passos 2 a 5 são a parte “padrão OIDC”; o passo 6 é IAM puro. Por isso, quem controla <i>quem</i> pode fazer deploy é a trust policy: a assinatura só prova que o token veio mesmo do GitHub, não que veio do seu repositório.</p>
        <h3>Dá para olhar com as próprias mãos</h3>
        <p>As duas URLs abaixo são públicas e não exigem login:</p>
        <CodeBlock code={`curl -s https://token.actions.githubusercontent.com/.well-known/openid-configuration
curl -s https://token.actions.githubusercontent.com/.well-known/jwks`} />
        <p>A primeira é o documento de descoberta (<i>issuer</i>, <code>jwks_uri</code>, algoritmos de assinatura); a segunda, as chaves públicas. Dentro de um job com <code>id-token: write</code> você também consegue imprimir as claims do token (sem a assinatura) para ver o <code>sub</code> real, útil para depurar uma trust policy:</p>
        <CodeBlock code={`TOKEN=$(curl -s -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
    "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com" | jq -r .value)
  echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | jq .`} />
        <p>O resultado tem esta forma (valores de exemplo, lista abreviada):</p>
        <CodeBlock code={`{
    "iss": "https://token.actions.githubusercontent.com",
    "aud": "sts.amazonaws.com",
    "sub": "repo:minha-org/meu-repo:environment:production",
    "repository": "minha-org/meu-repo",
    "ref": "refs/heads/main",
    "environment": "production",
    "job_workflow_ref": "minha-org/meu-repo/.github/workflows/deploy.yml@refs/heads/main",
    "iat": 1790000000,
    "exp": 1790000900
  }`} />
        <Callout tone="warn" icon="alert">Não imprima o token inteiro no log nem o cole em lugar nenhum. Sem a assinatura (só o trecho do meio) é inofensivo, mas o token completo vale como credencial até expirar.</Callout>
        <h3>É protocolo da AWS?</h3>
        <p>Não. A base é aberta; a AWS só fornece o lado que recebe.</p>
        <Table
          head={["Parte", "De quem é"]}
          rows={[
            [<>Formato JWT, JWKS, documento <code>.well-known/openid-configuration</code>, claims <code>iss</code>/<code>aud</code>/<code>sub</code></>, "Padrões abertos (OpenID Connect Discovery, RFCs de JWT/JWK). Os mesmos que o Google e o Cognito usam; GCP e Azure têm equivalentes para o GitHub (Workload Identity Federation, federated credentials)."],
            [<>Quais claims existem e o que cada uma contém (<code>repository</code>, <code>environment</code>, <code>job_workflow_ref</code>...)</>, "GitHub."],
            [<><code>AssumeRoleWithWebIdentity</code>, STS, role, trust policy, ARN do provedor</>, "AWS (a ideia de trocar um token por credenciais temporárias existe em todas as nuvens, mas cada uma tem a sua API)."],
            [<>O texto <code>sts.amazonaws.com</code> como audiência</>, <>Convenção. O OIDC deixa a audiência livre. A action <code>configure-aws-credentials</code> pede esse valor por padrão e a documentação da AWS o usa nos exemplos; se você trocar nos dois lados (e na opção <code>audience</code> da action), funciona do mesmo jeito. Um valor próprio só serve para evitar que um token emitido para outro destino seja aceito aqui.</>],
            [<>As chaves de condição <code>token.actions.githubusercontent.com:sub</code></>, <>AWS: é a URL do provedor sem <code>https://</code>, seguida de <code>:</code> e da claim. Para o GitHub, a AWS só expõe <code>aud</code>, <code>sub</code>, <code>amr</code>, <code>email</code> e <code>oaud</code>; claims como <code>repository</code> ou <code>job_workflow_ref</code> não podem ser usadas direto na trust policy.</>],
          ]}
        />
      </Section>
      <Section id="layout" title={"Uma branch, um ambiente, uma conta"}>
        <p>O desenho que o resto da nota segue. Os nomes são iguais nos dois lados; o que muda é o valor guardado em cada environment.</p>
        <Diagram minWidth={560} caption={"Uma branch aponta para um environment do GitHub, e o environment aponta (pela role) para uma conta AWS."}>
          <svg viewBox="0 0 700 266" role="img" aria-label="Branches, environments e contas">
            <text x="10" y="16" className="mut mono" textAnchor="start">Branch</text>
            <text x="160" y="16" className="mut mono" textAnchor="start">GitHub Environment</text>
            <text x="400" y="16" className="mut mono" textAnchor="start">Conta AWS</text>
            <rect x="10" y="50" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="77" className="mono" textAnchor="middle">develop</text>
            <path d="M120 72L160 72" className="ln" />
            <path d="M152.8 75.5L160 72L152.8 68.5" className="ln" />
            <rect x="160" y="38" width="190" height="68" rx="4" className="ln fillsoft" />
            <text x="255" y="66" className="mono" textAnchor="middle">environment: develop</text>
            <text x="255" y="88" className="mut" textAnchor="middle">vars: role, região, ECR, ECS</text>
            <path d="M350 72L400 72" className="ln" />
            <path d="M392.8 75.5L400 72L392.8 68.5" className="ln" />
            <rect x="400" y="30" width="290" height="84" rx="4" className="ln" />
            <text x="412" y="48" className="mut mono" textAnchor="start">conta dev</text>
            <rect x="416" y="60" width="106" height="38" rx="4" className="ln fillsoft" />
            <text x="469" y="84" textAnchor="middle">ECR</text>
            <path d="M522 79L560 79" className="ln" />
            <path d="M552.8 82.5L560 79L552.8 75.5" className="ln" />
            <rect x="560" y="60" width="114" height="38" rx="4" className="ln fillsoft" />
            <text x="617" y="84" textAnchor="middle">ECS (serviço)</text>
            <rect x="10" y="166" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="193" className="mono" textAnchor="middle">main</text>
            <path d="M120 188L160 188" className="ln" />
            <path d="M152.8 191.5L160 188L152.8 184.5" className="ln" />
            <rect x="160" y="154" width="190" height="68" rx="4" className="ln brandfill" />
            <text x="255" y="182" className="mono" textAnchor="middle">environment: production</text>
            <text x="255" y="204" className="mut" textAnchor="middle">+ aprovação manual</text>
            <path d="M350 188L400 188" className="ln" />
            <path d="M392.8 191.5L400 188L392.8 184.5" className="ln" />
            <rect x="400" y="146" width="290" height="84" rx="4" className="ln" />
            <text x="412" y="164" className="mut mono" textAnchor="start">conta prod</text>
            <rect x="416" y="176" width="106" height="38" rx="4" className="ln fillsoft" />
            <text x="469" y="200" textAnchor="middle">ECR</text>
            <path d="M522 195L560 195" className="ln" />
            <path d="M552.8 198.5L560 195L552.8 191.5" className="ln" />
            <rect x="560" y="176" width="114" height="38" rx="4" className="ln fillsoft" />
            <text x="617" y="200" textAnchor="middle">ECS (serviço)</text>
            <text x="10" y="252" className="mut" textAnchor="start">Mesmo workflow e nomes, valores diferentes: o AWS_ROLE_ARN decide a conta.</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><em><code>develop</code> → conta dev.</em> Deploy automático, sem aprovação.</li>
          <li><em><code>main</code> → conta prod.</em> O environment <code>production</code> pode exigir um revisor antes de o job continuar.</li>
          <li><em>Mais ambientes?</em> Para um terceiro (por exemplo <code>staging</code>), crie outra branch, outro environment, outra conta (ou o mesmo par de contas com outro cluster) e acrescente a branch ao <code>on.push.branches</code> e ao mapeamento do <code>environment:</code> no workflow. Nada mais muda.</li>
        </ul>
        <p>O exemplo faz deploy de uma imagem Docker no Amazon ECR e atualiza um serviço do Amazon ECS, o mesmo caminho da nota de AWS. Se o seu destino for outro (S3, EC2, Lambda), as etapas 1 a 3 não mudam; só as permissões da role e os passos de deploy do workflow.</p>
        <p>Se develop e produção ficam em contas AWS diferentes, repita as etapas 1 e 2 em cada conta: o provedor OIDC usado na trust policy precisa estar na mesma conta da role.</p>
      </Section>
      <Section id="prereq" title={"Antes de começar"}>
        <p>O workflow <b>não cria</b> a infraestrutura: ele só publica a versão nova numa infraestrutura que já existe. Confira se cada ambiente tem o que está abaixo; sem isso, o primeiro deploy falha.</p>
        <Table
          head={["Onde", "O que precisa existir"]}
          rows={[
            ["Duas contas AWS (dev e prod)", <>Criadas dentro de uma Organization. Passo a passo na <a href="/notas/aws/#organizations">nota de AWS, seção Organizations</a>. Você precisa dos dois IDs de conta e de um perfil da CLI para cada uma (<code>--profile dev</code> e <code>--profile prod</code>).</>],
            ["Em cada conta", <>Um repositório <b>ECR</b>, um cluster e um <b>serviço ECS</b> já rodando (mesmo que com uma imagem de teste), e as duas roles do ECS: <i>task execution role</i> e <i>task role</i>. Nunca criou nada disso? <a href="/notas/ecs-todo-app/">ECS do zero</a> monta tudo passo a passo.</>],
            ["No repositório", <>Um <code>Dockerfile</code> na raiz, o arquivo <code>.aws/task-definition.json</code> (com um container chamado <code>app</code>) e as branches <code>develop</code> e <code>main</code>.</>],
            ["Na sua máquina", <>AWS CLI v2 e GitHub CLI (<code>gh</code>) autenticados. Opcionais: tudo o que a CLI faz aqui também dá para fazer pelo console.</>],
          ]}
        />
        <p>Variáveis usadas nos comandos abaixo (troque pelos seus valores):</p>
        <CodeBlock code={`GH_ORG=minha-org            # GitHub owner (user or organization)
  GH_REPO=meu-repo
  REGION=sa-east-1
  # AWS account IDs: <ID_CONTA_DEV> and <ID_CONTA_PROD>`} />
      </Section>
      <Section id="provider" title={"1. Provedor OIDC na AWS"}>
        <p>O provedor diz à AWS “confio nos tokens emitidos pelo GitHub Actions”. Ele vive <b>dentro de cada conta</b>, então esta etapa é feita <b>duas vezes</b>: uma na conta dev e outra na prod. Uma conta só precisa dele uma vez, não importa quantos repositórios ou roles use.</p>
        <h3>O que é um identity provider OIDC</h3>
        <p>Um <b>identity provider</b> (IdP, provedor de identidade) é um serviço que sabe <b>provar quem é alguém</b> e que outros sistemas aceitam como testemunha. Você já usou vários: ao clicar em “Entrar com Google”, o Google é o IdP e o site que você abriu confia na palavra dele em vez de pedir uma senha nova.</p>
        <p><b>OIDC</b> (OpenID Connect) é o protocolo padrão dessa conversa: o IdP entrega um <b>token assinado</b> (um JWT) dizendo “este sujeito é fulano, emitido por mim, para tal destino”, e quem recebe só precisa conferir a assinatura.</p>
        <p>Aqui o “fulano” não é uma pessoa, é <b>uma execução do GitHub Actions</b>. O GitHub faz o papel de IdP para os seus workflows: a cada job ele assina um token com a identidade daquela execução (repositório, branch, environment, workflow). A AWS faz o papel de quem recebe e precisa decidir se acredita.</p>
        <Table
          head={["Papel", "Quem é aqui", "O que faz"]}
          rows={[
            ["Identity provider (emissor)", <>GitHub Actions<br /><code>token.actions.githubusercontent.com</code></>, "Assina o token de cada execução com a sua chave privada e publica a chave pública."],
            ["Relying party (quem confia)", "AWS (STS)", "Recebe o token, verifica a assinatura com a chave pública e decide se entrega credenciais."],
            ["Sujeito (quem se identifica)", "O job do workflow", "Carrega o token do GitHub até a AWS. Não possui nenhuma senha própria."],
          ]}
        />
        <h3>Então o que é o “provedor OIDC” que criamos na AWS?</h3>
        <p>O nome engana: o provedor de identidade de verdade é o <b>GitHub</b>, e ele já existe. O que você cria dentro da conta AWS (IAM → Identity providers) é um <b>registro local</b> que diz “nesta conta, aceito tokens deste emissor, para esta audiência”.</p>
        <p>É uma lista de confiança, parecida com a lista de autoridades certificadoras do navegador: sem a entrada, o STS recusa qualquer token do GitHub, mesmo com assinatura perfeita, porque não tem motivo para acreditar nele.</p>
        <p>O registro guarda só duas coisas públicas, a <b>URL do emissor</b> e a <b>audiência</b>. Não há chave, senha nem segredo. Na hora da validação, a AWS descobre sozinha as chaves públicas do GitHub em <code>/.well-known/openid-configuration</code> (o <code>jwks_uri</code>), então você não copia nem rotaciona nada.</p>
        <h3>Por que isso substitui as chaves de acesso</h3>
        <ul>
          <li><b>Antes:</b> uma chave de acesso IAM de longa duração fica guardada nos secrets do GitHub. Quem a copiar (log vazado, fork malicioso, colaborador que sai) usa a conta até alguém notar e rotacionar.</li>
          <li><b>Agora:</b> nada de valioso é guardado. O token dura minutos, serve só para a audiência <code>sts.amazonaws.com</code> e as credenciais que a AWS devolve expiram em cerca de 1 hora. Um vazamento depois do job terminar não dá acesso a nada.</li>
          <li><b>Quem decide o acesso:</b> o provedor só estabelece que o token é genuíno. Quem restringe <i>qual repositório, branch ou environment</i> pode assumir a role é a trust policy (etapa 2). Sem condições no <code>sub</code>, qualquer repositório do GitHub passaria.</li>
        </ul>
        <Callout tone="warn" icon="alert"><b>Cuidado:</b> “o token é do GitHub” não significa “o token é do <i>seu</i> repositório”. Todo repositório do mundo recebe tokens assinados pelo mesmo emissor. Por isso a trust policy precisa fixar o <code>sub</code> (por exemplo, <code>repo:minha-org/meu-repo:environment:production</code>).</Callout>
        <h3>Criando o provedor</h3>
        <ol className="ds-steps">
          <li>Entre na conta (portal do Identity Center, escolha a conta <code>dev</code> e a role de administrador). Abra <b>IAM → Identity providers → Add provider</b>.</li>
          <li>Em <b>Provider type</b>, escolha <b>OpenID Connect</b>.</li>
          <li><b>Provider URL</b> · <code>https://token.actions.githubusercontent.com</code></li>
          <li><b>Audience</b> · <code>sts.amazonaws.com</code></li>
          <li>Clique em <b>Add provider</b>. Confirme que apareceu na lista, com o ARN <code>arn:aws:iam::&lt;ID_CONTA&gt;:oidc-provider/token.actions.githubusercontent.com</code>.</li>
          <li>Troque para a conta <code>prod</code> e repita os passos 1 a 5.</li>
        </ol>
        <p>Pela CLI, o comando é o abaixo (confira na referência da CLI se ele pede a lista de thumbprints na sua versão).</p>
        <CodeBlock code={`for P in dev prod; do
    aws iam create-open-id-connect-provider \\
      --url https://token.actions.githubusercontent.com \\
      --client-id-list sts.amazonaws.com \\
      --profile $P
  done`} />
        <p>Se o comando falhar com “EntityAlreadyExists”, o provedor já existe naquela conta e não há nada a fazer.</p>
        <p>Sobre thumbprints: a AWS valida o certificado do endpoint do provedor com a sua biblioteca de autoridades raiz confiáveis, e só recorre aos thumbprints cadastrados se o certificado não for assinado por uma delas.</p>
      </Section>
      <Section id="roles" title={"2. Roles IAM e trust policy"}>
        <p>Crie uma role por ambiente (por exemplo <code>github-deploy-develop</code> e <code>github-deploy-production</code>). A trust policy diz quem pode assumir a role. A condição em <code>sub</code> é obrigatória: sem ela, qualquer repositório do GitHub poderia pedir acesso.</p>
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
            "token.actions.githubusercontent.com:sub": "repo:<ORG>/<REPO>:environment:develop"
          }
        }
      }
    ]
  }`} />
        <p>Na role de produção, troque o final do <code>sub</code> por <code>environment:production</code>.</p>
        <h3>Como o <code>sub</code> é montado</h3>
        <Table
          head={["Quando o job", <code>sub</code>]}
          rows={[
            ["referencia um environment", <code>repo:ORG/REPO:environment:NAME</code>],
            ["roda de uma branch (sem environment)", <code>repo:ORG/REPO:ref:refs/heads/BRANCH</code>],
            ["roda por pull request (sem environment)", <code>repo:ORG/REPO:pull_request</code>],
            ["roda de uma tag (sem environment)", <code>repo:ORG/REPO:ref:refs/tags/TAG</code>],
          ]}
        />
        <Callout tone="warn" icon="alert">Quando o job referencia um environment, o <code>sub</code> usa a forma <code>environment:NAME</code> e não mais a da branch. Por isso a trust policy acima usa <code>environment:develop</code>, e não <code>ref:refs/heads/develop</code>.</Callout>
        <Callout tone="warn" icon="alert">Repositórios criados depois de 15/07/2026, ou que optaram por isso, usam o formato imutável com IDs do dono e do repositório. Nesse caso uma trust policy só com nomes falha com “Not authorized to perform sts:AssumeRoleWithWebIdentity”. O valor passa a ser, por exemplo: <code>repo:&lt;ORG&gt;@&lt;ORG_ID&gt;/&lt;REPO&gt;@&lt;REPO_ID&gt;:environment:develop</code>.</Callout>
        <h3>Permissões da role</h3>
        <p>A role só precisa do mínimo para este deploy. A lista abaixo junta as permissões que as documentações das actions de ECR e ECS indicam; ajuste ARNs e, se usar CodeDeploy, acrescente o que a documentação da action pedir.</p>
        <CodeBlock code={`{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "EcrLogin",
        "Effect": "Allow",
        "Action": "ecr:GetAuthorizationToken",
        "Resource": "*"
      },
      {
        "Sid": "EcrPush",
        "Effect": "Allow",
        "Action": [
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ],
        "Resource": "arn:aws:ecr:<REGION>:<ACCOUNT_ID>:repository/<ECR_REPOSITORY>"
      },
      {
        "Sid": "EcsRegister",
        "Effect": "Allow",
        "Action": "ecs:RegisterTaskDefinition",
        "Resource": "*"
      },
      {
        "Sid": "EcsPassRoles",
        "Effect": "Allow",
        "Action": "iam:PassRole",
        "Resource": [
          "arn:aws:iam::<ACCOUNT_ID>:role/<TASK_ROLE>",
          "arn:aws:iam::<ACCOUNT_ID>:role/<TASK_EXECUTION_ROLE>"
        ]
      },
      {
        "Sid": "EcsDeploy",
        "Effect": "Allow",
        "Action": [
          "ecs:UpdateService",
          "ecs:DescribeServices"
        ],
        "Resource": "arn:aws:ecs:<REGION>:<ACCOUNT_ID>:service/<CLUSTER>/<SERVICE>"
      }
    ]
  }`} />
        <h3>Criar a role, passo a passo</h3>
        <p>Uma role por conta: <code>github-deploy-develop</code> na conta dev e <code>github-deploy-production</code> na conta prod. Pelo console:</p>
        <ol className="ds-steps">
          <li>Na conta dev: <b>IAM → Policies → Create policy → JSON</b>. Cole a política de permissões acima (com os ARNs da conta dev) e salve como <code>github-deploy-develop-policy</code>.</li>
          <li><b>IAM → Roles → Create role</b>. Em <b>Trusted entity type</b>, escolha <b>Web identity</b>; em <b>Identity provider</b>, <code>token.actions.githubusercontent.com</code>; em <b>Audience</b>, <code>sts.amazonaws.com</code>. Preencha a organização e o repositório do GitHub.</li>
          <li>Anexe a política criada no passo 1, dê o nome <code>github-deploy-develop</code> e crie a role.</li>
          <li>Abra a role → aba <b>Trust relationships</b> → <b>Edit trust policy</b> e ajuste a condição <code>sub</code> para <code>repo:&lt;ORG&gt;/&lt;REPO&gt;:environment:develop</code>, como na trust policy mostrada antes. O assistente do console só oferece a forma por branch; a por environment você escreve à mão.</li>
          <li>Copie o <b>ARN</b> da role (algo como <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/github-deploy-develop</code>). Ele vai para a variável <code>AWS_ROLE_ARN</code> do environment <code>develop</code> (etapa 3).</li>
          <li>Na conta prod, repita tudo com os ARNs da prod, o nome <code>github-deploy-production</code> e <code>environment:production</code> no <code>sub</code>.</li>
        </ol>
        <p>O mesmo pela CLI, com os JSONs salvos em arquivos (<code>trust-develop.json</code> e <code>deploy-policy-develop.json</code>):</p>
        <CodeBlock code={`aws iam create-role --role-name github-deploy-develop \\
    --assume-role-policy-document file://trust-develop.json --profile dev
  aws iam put-role-policy --role-name github-deploy-develop \\
    --policy-name deploy --policy-document file://deploy-policy-develop.json --profile dev
  aws iam get-role --role-name github-deploy-develop --profile dev \\
    --query Role.Arn --output text      # <- value for AWS_ROLE_ARN

  # then repeat with --profile prod, github-deploy-production and the prod files`} />
        <Callout tone="warn" icon="alert">Cada trust policy referencia o provedor <b>da própria conta</b> (o ARN tem o ID da conta). Se você copiar o arquivo da dev para a prod sem trocar o ID, a role cria, mas ninguém consegue assumi-la.</Callout>
      </Section>
      <Section id="environments" title={"3. Environments e variáveis no GitHub"}>
        <p>Um Environment é a “porta” entre o repositório e uma role da AWS: é nele que ficam as variáveis daquele ambiente e as regras de quem pode fazer deploy. Passo a passo no repositório:</p>
        <ol className="ds-steps">
          <li><b>Settings → Environments → New environment</b>, nome <code>develop</code> (exatamente igual ao usado no <code>sub</code> da trust policy), <b>Configure environment</b>.</li>
          <li>Em <b>Deployment branches and tags</b>, escolha <b>Selected branches and tags</b> → <b>Add deployment branch or tag rule</b> → <code>develop</code>.</li>
          <li>Em <b>Environment variables → Add variable</b>, crie as cinco variáveis abaixo com os valores <b>da conta dev</b>.</li>
          <li>Volte e crie o environment <code>production</code>: branch permitida <code>main</code>, <b>Required reviewers</b> marcado com quem aprova, e as mesmas cinco variáveis com os valores <b>da conta prod</b>.</li>
        </ol>
        <p>Os nomes das variáveis são iguais nos dois ambientes; o que muda é o valor. É isso que faz o mesmo workflow mandar o <code>develop</code> para uma conta e o <code>main</code> para outra.</p>
        <ul className="ds-list">
          <li><em>Deployment branches.</em> Em <code>develop</code>, permita só a branch <code>develop</code>; em <code>production</code>, só a <code>main</code>. É o que impede outra branch de obter acesso à role.</li>
          <li><em>Required reviewers</em> em <code>production</code> (até 6 pessoas ou times; basta uma aprovação), se quiser aprovação manual antes do deploy.</li>
          <li><em>Variables</em> por ambiente: <code>AWS_ROLE_ARN</code>, <code>AWS_REGION</code>, <code>ECR_REPOSITORY</code>, <code>ECS_CLUSTER</code>, <code>ECS_SERVICE</code>. Ficam disponíveis só para jobs que usam o environment, pelo contexto <code>vars</code>.</li>
        </ul>
        <Callout tone="use" icon="check">O ARN de uma role não é segredo, então variáveis bastam: não há chave nenhuma para guardar.</Callout>
        <p>A AWS recomenda proteger environments usados em políticas OIDC com regras de proteção, como a restrição de branches e tags de deploy.</p>
        <h3>O mesmo pela CLI do GitHub</h3>
        <CodeBlock code={`# create the environment and restrict deployments to one branch
  gh api -X PUT repos/$GH_ORG/$GH_REPO/environments/develop \\
    -F 'deployment_branch_policy[protected_branches]=false' \\
    -F 'deployment_branch_policy[custom_branch_policies]=true'
  gh api -X POST repos/$GH_ORG/$GH_REPO/environments/develop/deployment-branch-policies \\
    -f name=develop -f type=branch

  # variables of the environment (dev account values)
  gh variable set AWS_ROLE_ARN    --env develop --body "arn:aws:iam::<ID_CONTA_DEV>:role/github-deploy-develop"
  gh variable set AWS_REGION      --env develop --body "$REGION"
  gh variable set ECR_REPOSITORY  --env develop --body "meu-app"
  gh variable set ECS_CLUSTER     --env develop --body "meu-cluster"
  gh variable set ECS_SERVICE     --env develop --body "meu-servico"

  gh variable list --env develop     # check

  # repeat for "production" (branch: main; prod account values)`} />
        <p className="muted">Os corpos da API REST de environments e de branch policies estão na referência “REST API endpoints for deployment environments / branch policies”. Os revisores obrigatórios são mais simples de configurar pela interface.</p>
        <h3>As duas variáveis do build</h3>
        <p>Além das cinco variáveis acima, acrescente as duas que alimentam o build (etapa 5). Mesmo nome nos dois environments, valor diferente.</p>
        <Table
          head={["Variável", <>Em <code>develop</code></>, <>Em <code>production</code></>]}
          rows={[
            [<><code>APP_ENV</code></>, <><code>development</code></>, <><code>production</code></>],
            [<><code>PUBLIC_API_URL</code></>, <><code>https://api-dev.exemplo.com</code></>, <><code>https://api.exemplo.com</code></>],
          ]}
        />
        <ol className="ds-steps">
          <li>No repositório: <b>Settings → Environments → develop → Environment variables → Add variable</b>.</li>
          <li>Crie <code>APP_ENV</code> e <code>PUBLIC_API_URL</code> com os valores de dev.</li>
          <li>Repita em <b>production</b> com os valores de prod.</li>
        </ol>
        <CodeBlock code={`gh variable set APP_ENV        --env develop    --body "development"
gh variable set PUBLIC_API_URL --env develop    --body "https://api-dev.example.com"
gh variable set APP_ENV        --env production --body "production"
gh variable set PUBLIC_API_URL --env production --body "https://api.example.com"`} />
        <Callout tone="use" icon="check">Use <i>variables</i>, não <i>secrets</i>, para esses dois valores: são públicos (acabam dentro da imagem) e em variável você consegue conferir o que está configurado. Segredos continuam no Secrets Manager.</Callout>
      </Section>
      <Section id="secrets" title={"4. Secrets: onde ficam e por quê"}>
        <p>Pergunta frequente: “a senha do banco vai nos secrets do GitHub ou na AWS?”. Depende de <b>quem precisa ler o valor</b>. Separe três tipos de informação:</p>
        <Table
          head={["O que é", "Onde guardar", "Por quê"]}
          rows={[
            ["Credencial da AWS para o deploy", <><b>Em lugar nenhum</b> (OIDC)</>, "O token é emitido por execução e expira. Não existe chave para vazar nem para rotacionar."],
            ["ARN da role, região, nomes de ECR/cluster/serviço", <b>GitHub · Environment <i>variables</i></b>, "Não são segredo e mudam por ambiente. Em variável você consegue ver e conferir o valor."],
            [<>Senha do banco, chaves de API, tokens que a <b>aplicação</b> usa ao rodar</>, <><b>AWS · Secrets Manager</b> (ou SSM Parameter Store <code>SecureString</code>), na conta de cada ambiente</>, "Quem lê é o ECS, na hora de iniciar o container, não o pipeline. Veja abaixo."],
            [<>Token de terceiro que só o <b>CI</b> usa (registry privado de pacotes, scanner, etc.)</>, <><b>GitHub · Environment <i>secrets</i></b> (ou do repositório)</>, "A AWS não precisa dele. Só o workflow o lê, então é lá que ele deve ficar."],
          ]}
        />
        <h3>Por que o segredo da aplicação fica na AWS e não no GitHub</h3>
        <ul className="ds-list">
          <li><em>Quem lê é o runtime.</em> A aplicação precisa do valor sempre que uma task sobe: no deploy, mas também em autoscaling, reinício ou troca de host, quando o GitHub não está envolvido. Se o valor só existe nos secrets do GitHub, você teria de reimplantar para qualquer task nova.</li>
          <li><em>O pipeline nunca vê o valor.</em> Com o segredo na AWS, o workflow só carrega o ARN dele. Quem tem permissão de rodar workflows (ou uma action de terceiros comprometida) não consegue lê-lo. Segredos do GitHub chegam ao runner como variáveis do job; a documentação avisa que o mascaramento nos logs não é garantido e que valores transformados podem escapar.</li>
          <li><em>Um valor por ambiente, na conta dele.</em> O segredo de prod existe só na conta prod, e o IAM dessa conta decide quem lê. Um desenvolvedor com acesso à dev nunca alcança a senha de produção. O CloudTrail registra cada leitura.</li>
          <li><em>Rotação e criptografia nativas.</em> O Secrets Manager rotaciona segredos e criptografa com o KMS. Os secrets do GitHub são criptografados antes de chegar ao GitHub (libsodium), mas ele é um cofre para o CI, sem rotação automática.</li>
        </ul>
        <Callout tone="use" icon="check">Regra prática: se a <b>aplicação</b> lê, o segredo fica na <b>AWS</b>. Se só o <b>CI</b> lê, fica no <b>GitHub</b>. Se ninguém precisa ler (credencial de deploy), use <b>OIDC</b> e não guarde nada.</Callout>
        <h3>Ligando o segredo ao serviço, passo a passo</h3>
        <ol className="ds-steps">
          <li>
            <b>Criar o segredo em cada conta</b>, com valores diferentes. Leia o valor de um arquivo ou de um prompt, para não ficar no histórico do shell:
            <CodeBlock code={`aws secretsmanager create-secret --name meu-app/develop/db \\
      --secret-string file://db-develop.json --profile dev
  # db-develop.json: {"username":"app","password":"..."}  (delete the file afterwards)`} />
          </li>
          <li>
            <b>Dar permissão de leitura à task execution role</b> (não à role de deploy). É ela que o ECS usa para buscar o segredo ao iniciar o container. Acrescente à role, em cada conta, uma política como esta (<code>kms:Decrypt</code> só se o segredo usar uma chave KMS própria):
            <CodeBlock code={`{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:meu-app/develop/db-*"
    }]
  }`} />
          </li>
          <li>
            <b>Referenciar o segredo no <code>.aws/task-definition.json</code></b>, em <code>containerDefinitions[].secrets</code>. O ECS injeta o valor como variável de ambiente; o sufixo <code>:password::</code> escolhe uma chave do JSON:
            <CodeBlock code={`"secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:meu-app/develop/db-AbCdEf:password::"
    }
  ]`} />
          </li>
          <li><b>Cuidado com o arquivo único.</b> O <code>task-definition.json</code> é o mesmo nos dois ambientes, mas o ARN do segredo tem o ID da conta e o nome do ambiente. Duas saídas: manter um arquivo por ambiente (<code>.aws/task-definition.develop.json</code> e <code>.production.json</code>) ou nomear o segredo igual nas duas contas e montar o ARN com o ID da conta da variável. O exemplo do workflow usa um arquivo só; adapte o caminho se escolher um por ambiente.</li>
          <li><b>Deploy.</b> O workflow não muda. A role de deploy só precisa do <code>iam:PassRole</code> sobre a execution role (já está na política da etapa 2) e <b>não</b> precisa de nenhuma permissão no Secrets Manager.</li>
        </ol>
        <Callout tone="warn" icon="alert">O ECS busca o valor quando o container <b>inicia</b>. Se você atualizar ou rotacionar o segredo depois, as tasks em execução não recebem o valor novo: é preciso subir tasks novas (por exemplo, um novo deploy ou “Force new deployment” no serviço). Além disso, a aplicação, os logs e as ferramentas de depuração do container enxergam as variáveis de ambiente.</Callout>
        <h3>Quando você usa secrets do GitHub</h3>
        <ul className="ds-list">
          <li>Crie pela interface (<b>Settings → Secrets and variables → Actions</b>, ou dentro do environment) ou pela CLI: <code>gh secret set NOME --env develop</code> (sem <code>--env</code>, vai para o repositório). O valor não pode ser lido de volta depois.</li>
          <li>Prefira <b>environment secrets</b> a repository secrets: só chegam a jobs que usam aquele environment e respeitam as regras dele (branch permitida, revisores).</li>
          <li>O workflow só lê um secret que você cita de forma explícita (<code>$&#123;&#123; secrets.NOME &#125;&#125;</code>). Passe-o por <code>env:</code> ou <code>with:</code>, nunca escrito direto no comando.</li>
          <li>Secrets <b>não</b> são passados a workflows disparados de forks (exceto o <code>GITHUB_TOKEN</code>), nem a jobs do Dependabot, nem automaticamente a reusable workflows.</li>
        </ul>
      </Section>
      <Section id="config" title={"5. Configuração por ambiente no Dockerfile"}>
        <p>Você pediu uma imagem “com todas as envs corretas de dev ou prod”. Há dois tipos de configuração e cada um entra num momento diferente:</p>
        <Diagram minWidth={560} caption={"Config pública entra no build; segredo entra só na hora de rodar, vindo do Secrets Manager."}>
          <svg viewBox="0 0 700 276" role="img" aria-label="Onde cada configuração entra">
            <text x="10" y="18" className="mut mono" textAnchor="start">BUILD · no GitHub Actions</text>
            <rect x="10" y="30" width="190" height="56" rx="4" className="ln fillsoft" />
            <text x="105" y="54" textAnchor="middle">Environment variables</text>
            <text x="105" y="72" className="mut mono" textAnchor="middle">APP_ENV, PUBLIC_API_URL</text>
            <path d="M200 58L230 58" className="ln" />
            <path d="M222.8 61.5L230 58L222.8 54.5" className="ln" />
            <rect x="230" y="30" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="295" y="54" className="mono" textAnchor="middle">docker build</text>
            <text x="295" y="72" className="mut mono" textAnchor="middle">--build-arg</text>
            <path d="M360 58L390 58" className="ln" />
            <path d="M382.8 61.5L390 58L382.8 54.5" className="ln" />
            <rect x="390" y="30" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="455" y="54" textAnchor="middle">Imagem no ECR</text>
            <text x="455" y="72" className="mut" textAnchor="middle">valores gravados</text>
            <text x="10" y="108" className="mut" textAnchor="start">Valor público, fica dentro da imagem.</text>
            <text x="10" y="170" className="mut mono" textAnchor="start">RUNTIME · no ECS, quando a task inicia</text>
            <rect x="10" y="182" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="85" y="206" textAnchor="middle">Secrets Manager</text>
            <text x="85" y="224" className="mut" textAnchor="middle">na conta do ambiente</text>
            <path d="M160 210L200 210" className="ln" />
            <path d="M192.8 213.5L200 210L192.8 206.5" className="ln" />
            <rect x="200" y="182" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="275" y="206" textAnchor="middle">Task execution role</text>
            <text x="275" y="224" className="mut" textAnchor="middle">lê o segredo</text>
            <text x="10" y="262" className="mut" textAnchor="start">Segredo: nunca entra na imagem nem passa pelo pipeline.</text>
            <rect x="560" y="100" width="130" height="90" rx="4" className="ln brandfill" />
            <text x="625" y="138" textAnchor="middle">Container</text>
            <text x="625" y="158" className="mut" textAnchor="middle">em execução</text>
            <path d="M520 66L560 118" className="ln" />
            <path d="M552.8 114.4L560 118L558.4 110.2" className="ln" />
            <path d="M350 210L560 172" className="ln" />
            <path d="M553.5 176.7L560 172L552.3 169.9" className="ln" />
          </svg>
        </Diagram>
        <Table
          head={["Tipo", "Exemplo", "Entra quando e como"]}
          rows={[
            ["Pública, conhecida no build", "URL pública da API, nome do ambiente, ID de analytics, variáveis embutidas no bundle do front-end", <><b>Build.</b> GitHub Environment <i>variables</i> → <code>--build-arg</code> → <code>ARG</code>/<code>ENV</code> no Dockerfile.</>],
            ["Não secreta, só necessária ao rodar", "Nível de log, nome da fila, flags", <><b>Runtime.</b> Campo <code>environment</code> da task definition.</>],
            ["Segredo", "Senha do banco, chave de API, token", <><b>Runtime.</b> Secrets Manager → campo <code>secrets</code> da task definition. Nunca no build.</>],
          ]}
        />
        <h3>Dockerfile de exemplo</h3>
        <p>Um app Node com build em duas etapas, só para mostrar onde ficam os <code>ARG</code>. Adapte ao seu stack; a ideia vale para qualquer linguagem.</p>
        <CodeBlock code={`FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG APP_ENV
ARG PUBLIC_API_URL
RUN APP_ENV=$APP_ENV PUBLIC_API_URL=$PUBLIC_API_URL npm run build

FROM node:22-alpine
WORKDIR /app
ARG APP_ENV
ENV NODE_ENV=production APP_ENV=$APP_ENV
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`} />
        <Callout tone="warn" icon="alert"><b>Segredo no build é vazamento.</b> Valores de <code>ARG</code> e <code>ENV</code> ficam gravados nos metadados e nas camadas da imagem, e qualquer pessoa com permissão de baixá-la os lê (por exemplo com <code>docker history</code>). A documentação do Docker recomenda <i>secret mounts</i> (<code>RUN --mount=type=secret</code>) para segredos de build, que não ficam na imagem. Para a senha do banco, use o caminho de runtime da tabela.</Callout>
        <Callout tone="personal" icon="alert"><strong>Nota pessoal, não verificada nas fontes:</strong> reconstruir a imagem por ambiente significa que o que você testou em dev não é exatamente o artefato que roda em prod. A alternativa comum é construir uma vez e injetar tudo em runtime. Esta nota segue o seu pedido (imagem por ambiente) e mantém no build só valores públicos, o que reduz esse risco.</Callout>
      </Section>
      <Section id="ecr" title={"6. O repositório de imagens (ECR)"}>
        <p>Cada conta tem o seu repositório ECR, com o mesmo nome nas duas. O workflow envia a imagem para o repositório da conta em que a role foi assumida, então dev e prod nunca compartilham imagens.</p>
        <h3>Criar o repositório, passo a passo</h3>
        <ol className="ds-steps">
          <li>Na conta dev, abra <b>Amazon ECR → Private registry → Repositories → Create repository</b>.</li>
          <li>Em <b>Repository name</b>, informe <code>meu-app</code>. Ative <b>Tag immutability</b>: uma tag, uma vez enviada, não pode ser sobrescrita.</li>
          <li>Ative <b>Scan on push</b> para analisar vulnerabilidades a cada envio e crie o repositório.</li>
          <li>Repita na conta prod, com o mesmo nome.</li>
        </ol>
        <CodeBlock code={`for P in dev prod; do
  aws ecr create-repository --repository-name $APP \\
    --image-tag-mutability IMMUTABLE \\
    --image-scanning-configuration scanOnPush=true \\
    --region $REGION --profile $P
done`} />
        <h3>Limpeza automática</h3>
        <p>Cada deploy acrescenta uma imagem. Uma <i>lifecycle policy</i> expira as mais antigas. Segundo a documentação, as imagens expiram em até 24 horas depois de cumprir o critério, e a pré-visualização (<i>preview</i>) mostra o que seria apagado antes de você aplicar.</p>
        <CodeBlock code={`{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep the last 30 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 30
      },
      "action": { "type": "expire" }
    }
  ]
}`} />
        <CodeBlock code={`aws ecr put-lifecycle-policy --repository-name $APP \\
  --lifecycle-policy-text file://lifecycle.json --profile dev
# repeat with --profile prod`} />
        <Callout tone="warn" icon="alert">Mantenha uma contagem folgada. Se a imagem da versão em execução expirar, uma task nova (autoscaling, reinício) não consegue baixá-la. Trinta imagens deixam bastante margem para voltar atrás.</Callout>
      </Section>
      <Section id="ecs" title={"7. Como o ECS troca o container"}>
        <p>É aqui que o container antigo é parado e descartado. O comportamento é controlado por dois números do serviço, descritos na documentação do ECS:</p>
        <ul className="ds-list">
          <li><em><code>minimumHealthyPercent</code></em> é o limite inferior de tasks saudáveis durante a troca, em % do número desejado (arredondado para cima).</li>
          <li><em><code>maximumPercent</code></em> é o limite superior de tasks em execução durante a troca (arredondado para baixo).</li>
        </ul>
        <Diagram minWidth={560} caption={"v1 é a task atual, v2 a nova. O ECS para a antiga e descarta o container dela; você não roda docker stop nem docker rm."}>
          <svg viewBox="0 0 700 296" role="img" aria-label="Duas configurações de rolling update">
            <text x="10" y="18" textAnchor="start">Padrão: sobe a nova, depois derruba a antiga</text>
            <text x="10" y="36" className="mono mut" textAnchor="start">minimumHealthyPercent 100 · maximumPercent 200</text>
            <rect x="112" y="52" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="130" y="71" className="mono" textAnchor="middle">v1</text>
            <text x="130" y="102" className="mut mono" textAnchor="middle">antes</text>
            <path d="M190 66L290 66" className="ln" />
            <path d="M282.8 69.5L290 66L282.8 62.5" className="ln" />
            <rect x="310" y="52" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="328" y="71" className="mono" textAnchor="middle">v1</text>
            <rect x="354" y="52" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="372" y="71" className="mono" textAnchor="middle">v2</text>
            <text x="350" y="102" className="mut mono" textAnchor="middle">durante</text>
            <path d="M410 66L510 66" className="ln" />
            <path d="M502.8 69.5L510 66L502.8 62.5" className="ln" />
            <rect x="552" y="52" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="570" y="71" className="mono" textAnchor="middle">v2</text>
            <text x="570" y="102" className="mut mono" textAnchor="middle">depois</text>
            <text x="10" y="126" className="mut" textAnchor="start">Sem indisponibilidade; por alguns instantes roda o dobro de tasks.</text>
            <text x="10" y="168" textAnchor="start">Para a antiga, depois sobe a nova</text>
            <text x="10" y="186" className="mono mut" textAnchor="start">minimumHealthyPercent 0 · maximumPercent 100</text>
            <rect x="112" y="202" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="130" y="221" className="mono" textAnchor="middle">v1</text>
            <text x="130" y="252" className="mut mono" textAnchor="middle">antes</text>
            <path d="M190 216L290 216" className="ln" />
            <path d="M282.8 219.5L290 216L282.8 212.5" className="ln" />
            <rect x="332" y="202" width="36" height="28" rx="4" className="ln dash" />
            <text x="350" y="221" className="mut mono" textAnchor="middle">–</text>
            <text x="350" y="252" className="mut mono" textAnchor="middle">durante</text>
            <path d="M410 216L510 216" className="ln" />
            <path d="M502.8 219.5L510 216L502.8 212.5" className="ln" />
            <rect x="552" y="202" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="570" y="221" className="mono" textAnchor="middle">v2</text>
            <text x="570" y="252" className="mut mono" textAnchor="middle">depois</text>
            <text x="10" y="276" className="mut" textAnchor="start">Há uma janela sem container, mas nunca duas versões ao mesmo tempo.</text>
            <path d="M10 148L690 148" className="ln dash" />
          </svg>
        </Diagram>
        <p>Com <b>1 task desejada</b>, o padrão (100/200) sobe a nova antes de parar a antiga: sem indisponibilidade, desde que a nova passe no health check. Com 0/100 o ECS é forçado a parar a antiga antes: é o equivalente literal de “parar, excluir e criar de novo”, ao custo de uma janela fora do ar.</p>
        <Callout tone="warn" icon="alert">A documentação avisa: ao definir esses percentuais, garanta que o scheduler consiga parar ou iniciar <b>pelo menos uma task</b>. Com 1 task desejada, 100/100 trava o deploy (nem sobe a nova, nem para a antiga) e o serviço registra um evento de erro.</Callout>
        <h3>Configurar, passo a passo</h3>
        <ol className="ds-steps">
          <li>No console: <b>ECS → Clusters → seu cluster → seu serviço → Update service</b>, seção de opções de deployment.</li>
          <li>Defina <code>Minimum healthy percent</code> e <code>Maximum percent</code> conforme o desenho acima (a primeira opção é a recomendada).</li>
          <li>Ative o <b>deployment circuit breaker</b> com <b>rollback</b>: se as tasks novas não conseguirem iniciar, o ECS marca o deploy como falho e volta para a revisão anterior. A documentação o indica para parar um deploy quando as tasks não sobem.</li>
          <li>Repita no serviço da outra conta (em prod, mantenha o padrão 100/200 para não ter janela fora do ar).</li>
        </ol>
        <CodeBlock code={`aws ecs update-service --cluster meu-cluster --service meu-servico \\
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200,deploymentCircuitBreaker={enable=true,rollback=true}" \\
  --profile dev`} />
        <h3>O health check decide quando a antiga pode parar</h3>
        <p>O ECS só considera a task nova saudável se o container passar no health check. Defina um na task definition (o comando depende do que existe na imagem; este exemplo usa <code>wget</code>, presente na imagem Alpine):</p>
        <CodeBlock code={`"healthCheck": {
  "command": ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"],
  "interval": 15,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 20
}`} />
        <p>Se o serviço está atrás de um load balancer, o health check do target group também vale. Sem nenhum health check, o ECS só sabe que o processo iniciou, não que a aplicação responde.</p>
      </Section>
      <Section id="workflow" title={"8. O workflow completo"}>
        <p>Um único arquivo atende os dois ambientes: o nome do environment sai do nome da branch, e as <code>--build-arg</code> vêm das variáveis do environment.</p>
        <CodeBlock code={`.github/workflows/deploy.yml
Dockerfile
.aws/task-definition.json     # container named "app"`} />
        <CodeBlock code={`name: Build and deploy

on:
  push:
    branches:
      - develop
      - main

# One deploy at a time per branch; a newer push waits for the running one.
concurrency:
  group: deploy-\${{ github.ref_name }}
  cancel-in-progress: false

permissions:
  id-token: write   # lets the job request the OIDC token
  contents: read    # actions/checkout

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ github.ref_name == 'main' && 'production' || 'develop' }}
    env:
      AWS_REGION: \${{ vars.AWS_REGION }}
      ECR_REPOSITORY: \${{ vars.ECR_REPOSITORY }}
      ECS_CLUSTER: \${{ vars.ECS_CLUSTER }}
      ECS_SERVICE: \${{ vars.ECS_SERVICE }}
      ECS_TASK_DEFINITION: .aws/task-definition.json
      CONTAINER_NAME: app
    steps:
      - uses: actions/checkout@v6

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: \${{ vars.AWS_ROLE_ARN }}
          role-session-name: gh-\${{ github.run_id }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push the image
        id: build-image
        env:
          REGISTRY: \${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: \${{ github.sha }}
          APP_ENV: \${{ vars.APP_ENV }}
          PUBLIC_API_URL: \${{ vars.PUBLIC_API_URL }}
        run: |
          IMAGE="$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
          if aws ecr describe-images --repository-name "$ECR_REPOSITORY" \\
               --image-ids imageTag="$IMAGE_TAG" > /dev/null 2>&1; then
            echo "Image $IMAGE_TAG already in ECR, skipping build"
          else
            docker build \\
              --build-arg APP_ENV="$APP_ENV" \\
              --build-arg PUBLIC_API_URL="$PUBLIC_API_URL" \\
              -t "$IMAGE" .
            docker push "$IMAGE"
          fi
          echo "image=$IMAGE" >> "$GITHUB_OUTPUT"

      - name: Render the task definition
        id: render
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: \${{ env.ECS_TASK_DEFINITION }}
          container-name: \${{ env.CONTAINER_NAME }}
          image: \${{ steps.build-image.outputs.image }}

      - name: Deploy to Amazon ECS (replaces the running container)
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: \${{ steps.render.outputs.task-definition }}
          service: \${{ env.ECS_SERVICE }}
          cluster: \${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true`} />
        <Callout tone="use" icon="check">Complemento recomendado: proteja <code>develop</code> e <code>main</code> com uma regra de branch (<b>Settings → Rules → Rulesets</b>) que exija pull request e a passagem dos testes. Assim ninguém dá <code>push</code> direto e todo deploy passa por revisão. Crie um workflow de testes separado, disparado por <code>pull_request</code>, <b>sem</b> environment: ele não consegue assumir as roles de deploy, porque o <code>sub</code> de um PR (<code>repo:ORG/REPO:pull_request</code>) não bate com nenhuma trust policy.</Callout>
        <h3>O que cada parte faz</h3>
        <ul className="ds-list">
          <li><em><code>on.push.branches</code>.</em> Só <code>develop</code> e <code>main</code> disparam. Uma branch de feature não faz deploy.</li>
          <li><em><code>environment:</code>.</em> A expressão escolhe <code>production</code> para <code>main</code> e <code>develop</code> para o resto. É isso que seleciona as variáveis (<code>vars.*</code>), a role e as regras de aprovação.</li>
          <li><em>Build.</em> As variáveis do environment viram <code>--build-arg</code>. A imagem nasce com os valores do ambiente certo.</li>
          <li><em>Checagem de existência.</em> Com tags imutáveis, enviar de novo a mesma tag dá erro. Se você reexecutar um job do mesmo commit, o workflow pula o build e reaproveita a imagem. Consequência: se mudar uma variável do environment e reexecutar o <i>mesmo</i> commit, a imagem não é refeita; faça um commit novo.</li>
          <li><em>Render + deploy.</em> A primeira ação grava a imagem nova na task definition; a segunda registra a revisão e atualiza o serviço. A partir daí, o ECS faz a troca descrita na etapa 7.</li>
          <li><em><code>wait-for-service-stability</code>.</em> O job só termina quando o serviço estabiliza. Se a versão nova não ficar saudável, o job falha e você vê no GitHub.</li>
        </ul>
        <Callout tone="warn" icon="alert">As actions não são certificadas pelo GitHub e os exemplos usam tags (<code>@v6</code>, <code>@v2</code>, <code>@v1</code>) por legibilidade. Em produção, fixe por SHA de commit, como recomenda a documentação do GitHub.</Callout>
      </Section>
      <Section id="run" title={"9. Primeiro deploy, passo a passo"}>
        <ol className="ds-steps">
          <li><b>Confira o checklist.</b> Repositório ECR e serviço ECS em cada conta; as sete variáveis em cada environment (as cinco da etapa 3 mais <code>APP_ENV</code> e <code>PUBLIC_API_URL</code>); <code>ecr:DescribeImages</code> na política da role.</li>
          <li><b>Commit na <code>develop</code>.</b> Mergeie um PR (ou faça um commit) e abra a aba <b>Actions</b>. O job mostra o environment <code>develop</code>.</li>
          <li><b>Acompanhe os passos.</b> Credenciais, login no ECR, build e push, render, deploy. Se o de credenciais falhar, veja os problemas comuns no fim da página.</li>
          <li>
            <b>Confirme a imagem no ECR da conta dev:</b>
            <CodeBlock code={`aws ecr describe-images --repository-name $APP --profile dev \\
  --query 'sort_by(imageDetails,&imagePushedAt)[-1].{tags:imageTags,pushed:imagePushedAt}'`} />
          </li>
          <li>
            <b>Veja a troca acontecer.</b> Durante o deploy, o serviço lista duas revisões; quando termina, só a nova:
            <CodeBlock code={`aws ecs describe-services --cluster meu-cluster --services meu-servico --profile dev \\
  --query 'services[0].deployments[].[status,rolloutState,runningCount,taskDefinition]'
# PRIMARY   IN_PROGRESS  ...  new task definition
# ACTIVE    COMPLETED    ...  old task definition  (disappears when done)`} />
          </li>
          <li><b>Veja quem fez a chamada.</b> No CloudTrail da conta dev, procure o evento <code>AssumeRoleWithWebIdentity</code>: o nome da sessão é <code>gh-&lt;id da execução&gt;</code>, o que liga a ação da AWS à execução exata do workflow.</li>
          <li><b>Confirme o container novo.</b> Em <b>ECS → serviço → Tasks</b>, a task antiga aparece como parada e a nova em execução. A aplicação deve responder com a configuração de dev (por exemplo a URL de API de dev).</li>
          <li><b>Promova para produção.</b> Abra um PR de <code>develop</code> para <code>main</code> e mergeie. O job fica em “Waiting” até um revisor aprovar em <b>Review deployments</b>; depois constrói <b>outra</b> imagem, com os valores de prod, no ECR da conta prod.</li>
        </ol>
        <Callout tone="use" icon="check">Se algo der errado no meio, o container que estava no ar continua rodando: o ECS só para a versão antiga depois que a nova ficou saudável (configuração padrão). Com o circuit breaker, ele volta sozinho para a revisão anterior.</Callout>
      </Section>
      <Section id="ec2" title={"10. Alternativa: Docker puro numa EC2"}>
        <p>Se você não usa ECS e roda o container direto numa EC2, o “parar, excluir e criar” é um script na instância, e o workflow o dispara pelo <b>AWS Systems Manager Run Command</b>, sem abrir SSH. Os passos do build, o ECR e o OIDC são os mesmos; só mudam os dois últimos passos do workflow.</p>
        <Diagram minWidth={560} caption={"Sem ECS, o workflow manda a instância trocar o container, na ordem: baixar, parar, remover, rodar."}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Alternativa com Docker puro numa EC2">
            <rect x="10" y="40" width="120" height="50" rx="4" className="ln brandfill" />
            <text x="70" y="70" textAnchor="middle">GitHub Actions</text>
            <path d="M130 65L150 65" className="ln" />
            <path d="M142.8 68.5L150 65L142.8 61.5" className="ln" />
            <rect x="150" y="40" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="230" y="62" textAnchor="middle">SSM Run Command</text>
            <text x="230" y="80" className="mut mono" textAnchor="middle">AWS-RunShellScript</text>
            <path d="M310 65L330 65" className="ln" />
            <path d="M322.8 68.5L330 65L322.8 61.5" className="ln" />
            <rect x="330" y="16" width="360" height="168" rx="4" className="ln fillsoft" />
            <text x="346" y="38" className="mono" textAnchor="start">Instância EC2 (SSM Agent + Docker)</text>
            <text x="350" y="72" className="mono" textAnchor="start">1 docker pull a imagem nova</text>
            <text x="350" y="102" className="mono" textAnchor="start">2 docker stop app</text>
            <text x="350" y="132" className="mono" textAnchor="start">3 docker rm app</text>
            <text x="350" y="162" className="mono" textAnchor="start">4 docker run a imagem nova</text>
            <text x="10" y="130" className="mut" textAnchor="start">a role de deploy só precisa de ssm:SendCommand</text>
            <text x="10" y="150" className="mut" textAnchor="start">no documento e na instância</text>
          </svg>
        </Diagram>
        <h3>Preparar a instância, uma vez por conta</h3>
        <ol className="ds-steps">
          <li>A instância precisa de um <i>instance profile</i> com a política gerenciada <code>AmazonSSMManagedInstanceCore</code> (para o SSM Agent) e permissão de leitura no ECR (por exemplo <code>AmazonEC2ContainerRegistryReadOnly</code>). Em <b>EC2 → Instances → Actions → Security → Modify IAM role</b>.</li>
          <li>Confirme em <b>Systems Manager → Fleet Manager</b> que a instância aparece como gerenciada. Docker e AWS CLI instalados nela.</li>
          <li>Salve o script abaixo em <code>/opt/meu-app/deploy.sh</code> (<code>chmod +x</code>).</li>
          <li>Na role de deploy (OIDC), troque as permissões do ECS por <code>ssm:SendCommand</code> (nos ARNs do documento <code>AWS-RunShellScript</code> e da instância) e <code>ssm:GetCommandInvocation</code>. Crie a variável <code>EC2_INSTANCE_ID</code> em cada environment.</li>
        </ol>
        <CodeBlock code={`#!/usr/bin/env bash
# /opt/meu-app/deploy.sh <image>
set -euo pipefail
IMAGE="$1"
REGISTRY="\${IMAGE%%/*}"
REGION="$(echo "$REGISTRY" | cut -d. -f4)"

aws ecr get-login-password --region "$REGION" \\
  | docker login --username AWS --password-stdin "$REGISTRY"

docker pull "$IMAGE"          # download first: shortens the downtime
docker stop app || true       # stop the running container
docker rm app || true         # delete it
docker run -d --name app --restart unless-stopped -p 80:3000 "$IMAGE"`} />
        <p>No workflow, remova os passos “Render” e “Deploy to Amazon ECS” e acrescente este:</p>
        <CodeBlock code={`- name: Replace the container on the instance
  env:
    IMAGE: \${{ steps.build-image.outputs.image }}
    INSTANCE_ID: \${{ vars.EC2_INSTANCE_ID }}
  run: |
    COMMAND_ID=$(aws ssm send-command \\
      --document-name AWS-RunShellScript \\
      --instance-ids "$INSTANCE_ID" \\
      --parameters commands="bash /opt/meu-app/deploy.sh $IMAGE" \\
      --query Command.CommandId --output text)
    aws ssm wait command-executed \\
      --command-id "$COMMAND_ID" --instance-id "$INSTANCE_ID"`} />
        <Callout tone="warn" icon="alert">Aqui há sempre uma janela sem container (entre o <code>docker stop</code> e o <code>docker run</code>) e nenhum rollback automático: se a versão nova não subir, você precisa reexecutar o deploy de um commit anterior. É o que o ECS resolve para você. Segredos: leia-os do Secrets Manager no próprio script, com a role da instância; não os passe pelo workflow.</Callout>
      </Section>
      <Section id="production" title={"Como fica em produção real"}>
        <p>O fluxo das etapas 1 a 9 é o mesmo em produção. O que muda é quem cria e quem pode mexer em cada peça. Esta lista mistura o que a AWS e o GitHub recomendam com prática comum de times; o que não vem das fontes oficiais está marcado.</p>
        <ul className="ds-list">
          <li><em>Infraestrutura como código.</em> Provedor, roles e políticas ficam em Terraform (ou CloudFormation), revisados por PR, e não criados no console. Assim a trust policy tem histórico e revisão, e recriar uma conta é repetir o código.</li>
          <li><em>Um provedor por conta, muitas roles.</em> A AWS recomenda um provedor por IdP externo. Cada repositório ou serviço ganha a sua própria role, com a sua trust policy e permissões só para o que ele faz. Uma role “de deploy para tudo” é o oposto disso.</li>
          <li><em>A proteção de produção mora no GitHub, não na AWS.</em> Quando o job usa <code>environment: production</code>, o <code>sub</code> é <code>repo:ORG/REPO:environment:production</code> e <b>não contém a branch</b>. Quem decide que só <code>main</code> chega lá é a regra <b>Deployment branches</b> do environment, junto de <b>Required reviewers</b>. Sem essas regras, qualquer branch cujo workflow declare esse environment obtém a role de produção.</li>
          <li><em>Quem pode editar workflows e environments.</em> Quem consegue alterar o workflow ou as regras do environment controla o que a role faz. Em produção: <code>CODEOWNERS</code> sobre <code>.github/workflows/</code>, proteção de branch em <code>main</code>, e poucos administradores no repositório.</li>
          <li><em>Restringir por workflow.</em> Como a AWS só lê <code>sub</code> e <code>aud</code>, o jeito de amarrar a role a um arquivo de workflow (por exemplo um workflow reutilizável central) é pedir ao GitHub que inclua <code>job_workflow_ref</code> no formato do <code>sub</code>, pela customização do assunto do OIDC (API do repositório ou da organização). Depois a trust policy compara o <code>sub</code> novo. Confira na documentação do GitHub o formato exato antes, e lembre que mudar o <code>sub</code> quebra as trust policies existentes.</li>
          <li><em>Permissões mínimas e nada de chaves.</em> A política da etapa 2 já usa ARNs específicos onde a ação permite. Em produção, revise com o IAM Access Analyzer e considere uma SCP na Organization negando <code>iam:CreateAccessKey</code> e <code>iam:CreateUser</code> na conta de produção, para que ninguém reintroduza chaves de longa duração. <i>(Prática comum, não está no artigo.)</i></li>
          <li><em>Auditoria.</em> Cada troca de token vira um evento <code>AssumeRoleWithWebIdentity</code> no CloudTrail, com o <code>sub</code> e a role. Use <code>role-session-name</code> com o número da execução para ligar a sessão ao run do GitHub, e crie um alerta (EventBridge ou CloudWatch) para trocas de produção fora do horário esperado ou com <code>sub</code> inesperado.</li>
          <li><em>Dependências do pipeline.</em> O token só vale para quem roda dentro do job, então uma action de terceiros comprometida enxerga a role. Fixe actions por SHA do commit (não por tag móvel), mantenha poucas e atualize com revisão (Dependabot). <i>(Prática comum, não está no artigo.)</i></li>
          <li><em>Recuperação.</em> Se a role for abusada, você pode negar novas sessões e revogar as ativas pelo console do IAM (“Revoke active sessions”) e depois corrigir a trust policy. Como não há chave, não há o que rotacionar.</li>
        </ul>
        <p>Exemplo em Terraform do provedor e da role de produção (adapte nomes e ARNs; em versões recentes do provider AWS os thumbprints são opcionais, confira a sua):</p>
        <CodeBlock code={`resource "aws_iam_openid_connect_provider" "github" {
    url            = "https://token.actions.githubusercontent.com"
    client_id_list = ["sts.amazonaws.com"]
  }

  data "aws_iam_policy_document" "trust" {
    statement {
      actions = ["sts:AssumeRoleWithWebIdentity"]
      principals {
        type        = "Federated"
        identifiers = [aws_iam_openid_connect_provider.github.arn]
      }
      condition {
        test     = "StringEquals"
        variable = "token.actions.githubusercontent.com:aud"
        values   = ["sts.amazonaws.com"]
      }
      condition {
        test     = "StringEquals"
        variable = "token.actions.githubusercontent.com:sub"
        values   = ["repo:minha-org/meu-repo:environment:production"]
      }
    }
  }

  resource "aws_iam_role" "deploy_production" {
    name               = "github-deploy-production"
    assume_role_policy = data.aws_iam_policy_document.trust.json
    max_session_duration = 3600
  }`} />
        <Callout tone="personal" icon="alert"><strong>Nota pessoal, não verificada nas fontes:</strong> o exemplo em Terraform e as práticas marcadas como “comuns” (SCP, alertas, fixar actions por SHA) vêm de prática geral, não do artigo da AWS. O artigo cobre o provedor, a trust policy com <code>aud</code> e <code>sub</code>, permissões mínimas, um provedor por IdP e auditoria com CloudTrail.</Callout>
      </Section>
      <Section id="checks" title={"Voltar atrás e problemas comuns"}>
        <h3>Voltar para uma versão anterior</h3>
        <ul className="ds-list">
          <li><em>Automático.</em> Com o circuit breaker e rollback ativos, uma versão que não sobe é desfeita pelo ECS.</li>
          <li><em>Manual.</em> Reverta o commit na branch (<code>git revert</code>) e faça o push, ou use <b>Re-run jobs</b> numa execução antiga que deu certo. Como as tags são imutáveis e únicas por commit, a imagem antiga ainda está no ECR e o workflow a reaproveita.</li>
        </ul>
        <h3>Problemas do build e do deploy</h3>
        <ul className="ds-list">
          <li><em>“tag invalid: The image tag ... already exists” no push.</em> O repositório tem tags imutáveis e a tag já existe. A checagem do workflow evita isso; se aparecer, confira se <code>ecr:DescribeImages</code> está na política (sem ela a checagem falha e o workflow tenta construir de novo).</li>
          <li><em>A task nova não sobe: <code>CannotPullContainerError</code>.</em> A task execution role não pode baixar do ECR, ou a task está numa sub-rede privada sem caminho até o ECR (NAT ou VPC endpoints). Confira também se a imagem existe com aquela tag.</li>
          <li><em>O deploy fica parado e o serviço registra “unable to stop or start tasks”.</em> Os percentuais do serviço não deixam o scheduler iniciar nem parar nenhuma task (por exemplo 100/100 com 1 task). Ajuste <code>minimumHealthyPercent</code> ou <code>maximumPercent</code>.</li>
          <li><em>A aplicação em dev usa a URL de prod (ou o contrário).</em> Confira as variáveis do environment e o ARN em <code>AWS_ROLE_ARN</code>: o ID da conta no ARN decide o destino. ARNs trocados entre os dois environments é o erro mais caro desta configuração.</li>
          <li><em>Mudei uma variável e o deploy continua com o valor antigo.</em> Reexecutar o mesmo commit reaproveita a imagem. Faça um commit novo (pode ser vazio: <code>git commit --allow-empty</code>).</li>
          <li><em>O segredo mudou e a app não viu.</em> O ECS lê o segredo quando o container inicia. Faça um novo deploy ou “Force new deployment” no serviço.</li>
        </ul>
        <h3>OIDC, roles e permissões</h3>
        <ul className="ds-list">
          <li><em>“Credentials could not be loaded” ou “Could not assume role”.</em> Falta <code>permissions: id-token: write</code> no workflow ou o <code>AWS_ROLE_ARN</code> está vazio: confira se o job usa o environment que contém a variável (variáveis de environment só existem para jobs que o declaram).</li>
          <li><em>Deploy de dev caiu na conta errada.</em> Confira o ARN em <code>AWS_ROLE_ARN</code> de cada environment: o ID da conta no ARN é o que decide o destino. Os dois environments com ARNs trocados é o erro mais caro desta configuração.</li>
          <li><em>AccessDenied em <code>iam:PassRole</code> ou <code>ecs:RegisterTaskDefinition</code>.</em> A política da role de deploy não cobre os ARNs das roles de task da <b>mesma conta</b> (os ARNs têm o ID da conta).</li>
          <li><em>A task não sobe com “ResourceInitializationError ... unable to pull secrets”.</em> A task execution role não tem <code>secretsmanager:GetSecretValue</code> sobre o segredo (ou o ARN no <code>valueFrom</code> está errado). Não é a role de deploy que precisa dessa permissão.</li>
          <li><em>“Not authorized to perform sts:AssumeRoleWithWebIdentity”.</em> O <code>sub</code> da trust policy não bate com o do token: confira se o job referencia o environment, o nome exato dele e o formato imutável.</li>
          <li><em>Nunca</em> use só curinga no <code>sub</code>. O IAM rejeita uma trust policy do GitHub sem a condição, ou com valor que seja só <code>*</code>.</li>
          <li>Evite <code>ForAllValues:</code> em statements <code>Allow</code>: pode liberar acesso quando a claim está ausente ou escrita errada. Use <code>StringEquals</code> ou <code>StringLike</code>.</li>
          <li>Cuidado com gatilhos <code>pull_request_target</code>. Jobs do Dependabot têm <code>event_name</code> igual a <code>dynamic</code>; se a trust policy deve valer só para Actions, restrinja os eventos esperados.</li>
          <li>A AWS não suporta claims OIDC personalizadas; o GitHub permite personalizar o formato do <code>sub</code>, mas crie antes a condição correspondente na AWS.</li>
          <li>A sessão dura 1 hora por padrão (<code>role-duration-seconds</code>, de 15 min a 12 h). Deploys longos precisam de uma duração maior.</li>
        </ul>
        <Callout tone="personal" icon="alert"><strong>Nota pessoal, não verificada nas fontes:</strong> esta combinação (OIDC, build com variáveis por environment, ECR com tags imutáveis e troca no ECS) não aparece num único exemplo oficial; ela junta as páginas listadas abaixo. Os comandos <code>aws ecr create-repository</code> e <code>aws ecs update-service</code> foram escritos pela referência da CLI e não foram executados aqui: confira os parâmetros com <code>--help</code> na sua versão.</Callout>
        <Callout tone="personal" icon="alert"><strong>Nota pessoal, não verificada nas fontes:</strong> o exemplo do GitHub para ECS usa chaves de acesso em secrets. A troca delas por OIDC (esta página) segue a documentação de OIDC do GitHub e das actions da AWS, mas a combinação completa não aparece num único exemplo oficial.</Callout>
        <Sources title={"Fontes oficiais · AWS verificada em 2026-10-26; Docker em 2026-10-24; GitHub em 2026-10-21"}>
          <ul>
            <li><a href="https://aws.amazon.com/pt/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/">AWS Security Blog · Use IAM roles to connect GitHub Actions to actions in AWS</a></li>
            <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html">AWS Docs · Create an OpenID Connect (OIDC) identity provider in IAM (issuer, JWKS, audience, thumbprints)</a></li>
            <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html#condition-keys-wif">AWS Docs · Available keys for AWS OIDC federation (aud, sub, amr, email, oaud)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html">AWS Docs · Deploy Amazon ECS services by replacing tasks (rolling update, minimumHealthyPercent, maximumPercent)</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html">AWS Docs · How the Amazon ECS deployment circuit breaker detects failures</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html">AWS Docs · Automate the cleanup of images by using lifecycle policies in Amazon ECR</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html">AWS Docs · Preventing image tags from being overwritten in Amazon ECR</a></li>
            <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html">AWS Docs · AWS Systems Manager Run Command</a></li>
            <li><a href="https://docs.docker.com/build/ci/github-actions/secrets/">Docker Docs · Build secrets with GitHub Actions</a></li>
            <li><a href="https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws">GitHub Docs · Configuring OpenID Connect in Amazon Web Services</a></li>
            <li><a href="https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables">GitHub Docs · Store information in variables</a></li>
            <li><a href="https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/amazon-elastic-container-service">GitHub Docs · Deploying to Amazon Elastic Container Service</a></li>
            <li><a href="https://github.com/aws-actions/configure-aws-credentials">aws-actions/configure-aws-credentials</a> · <a href="https://github.com/aws-actions/amazon-ecr-login">amazon-ecr-login</a> · <a href="https://github.com/aws-actions/amazon-ecs-render-task-definition">amazon-ecs-render-task-definition</a> · <a href="https://github.com/aws-actions/amazon-ecs-deploy-task-definition">amazon-ecs-deploy-task-definition</a></li>
            <li><a href="https://docs.github.com/en/actions/reference/security/oidc">GitHub Docs · OpenID Connect reference (sub claim formats)</a></li>
            <li><a href="https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments">GitHub Docs · Managing environments for deployment</a></li>
            <li><a href="https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax">GitHub Docs · Workflow syntax (push branches, concurrency, permissions, environment)</a></li>
            <li><a href="https://docs.github.com/en/actions/concepts/security/secrets">GitHub Docs · Secrets</a> · <a href="https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets">Using secrets in GitHub Actions</a> · <a href="https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables">Store information in variables</a></li>
            <li><a href="https://docs.github.com/en/rest/deployments/branch-policies">GitHub Docs · REST API endpoints for deployment branch policies</a> · <a href="https://cli.github.com/manual/gh_variable_set">gh variable set</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html">AWS Docs · Pass Secrets Manager secrets through Amazon ECS environment variables</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html">AWS Docs · Amazon ECS task execution IAM role</a></li>
            <li><a href="https://docs.aws.amazon.com/organizations/latest/userguide/orgs_tutorials_basic.html">AWS Docs · Creating and configuring an organization</a></li>
            <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html">AWS Docs · Create an OpenID Connect (OIDC) identity provider in IAM</a></li>
            <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html">AWS Docs · Create a role for OpenID Connect federation (GitHub section)</a></li>
            <li><a href="https://github.com/aws-actions/configure-aws-credentials">aws-actions/configure-aws-credentials</a></li>
            <li><a href="https://github.com/aws-actions/amazon-ecr-login">aws-actions/amazon-ecr-login</a></li>
            <li><a href="https://github.com/aws-actions/amazon-ecs-deploy-task-definition">aws-actions/amazon-ecs-deploy-task-definition</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
