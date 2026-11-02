import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "github-aws-oidc",
  title: { en: "GitHub to AWS: OIDC, Docker, ECR and ECS", pt: "GitHub para AWS: OIDC, Docker, ECR e ECS" },
  seo: {
    title: { en: "GitHub to AWS: OIDC, Docker, ECR and ECS", pt: "GitHub para AWS: OIDC, Docker, ECR e ECS" },
    description: { en: "Push to develop or main deploys to AWS without stored keys: OIDC provider, IAM roles, environments, a Docker image per environment, ECR and an ECS rolling update, step by step from the official docs.", pt: "Um push em develop ou main faz deploy na AWS sem chaves guardadas: provedor OIDC, roles IAM, environments, imagem Docker por ambiente, ECR e troca no ECS, passo a passo com base na documentação oficial." },
  },
  summary: "CI/CD from GitHub Actions to AWS for develop and production with no stored keys: OIDC provider and roles, GitHub environments, a Docker image per environment, ECR and an ECS rolling update (or plain Docker on EC2 via SSM), based on the official docs.",
  kicker: { en: "CI/CD", pt: "CI/CD" },
  heroTitle: { en: <>From push to running container: <em>OIDC, Docker, ECR and ECS.</em></>, pt: <>Do push ao container no ar: <em>OIDC, Docker, ECR e ECS.</em></> },
  heroLede: { en: <>A push to <code>develop</code> or <code>main</code> builds a Docker image with that environment’s settings, stores it in ECR and replaces the running container in the matching AWS account, with no stored access keys.</>, pt: <>Um push em <code>develop</code> ou <code>main</code> constrói uma imagem Docker com a configuração do ambiente, guarda no ECR e troca o container em execução na conta AWS correspondente, sem chaves de acesso guardadas.</> },
  published: "2026-10-13",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="O fluxo completo" en="The full flow" /> },
        { id: "how", title: <T pt="Como o OIDC funciona" en="How OIDC works" /> },
        { id: "anatomy", title: <T pt="Os nomes: issuer, audience, STS" en="The names: issuer, audience, STS" /> },
        { id: "layout", title: <T pt="Uma branch, um ambiente, uma conta" en="One branch, one environment, one account" /> },
        { id: "prereq", title: <T pt="Antes de começar" en="Before you start" /> },
        { id: "provider", title: <T pt="1. Provedor OIDC na AWS" en="1. OIDC provider in AWS" /> },
        { id: "roles", title: <T pt="2. Roles IAM e trust policy" en="2. IAM roles and trust policy" /> },
        { id: "environments", title: <T pt="3. Environments e variáveis no GitHub" en="3. GitHub environments and variables" /> },
        { id: "secrets", title: <T pt="4. Secrets: onde ficam e por quê" en="4. Secrets: where they live and why" /> },
        { id: "config", title: <T pt="5. Configuração por ambiente" en="5. Per-environment configuration" /> },
        { id: "ecr", title: <T pt="6. O repositório de imagens (ECR)" en="6. The image registry (ECR)" /> },
        { id: "ecs", title: <T pt="7. Como o ECS troca o container" en="7. How ECS swaps the container" /> },
        { id: "workflow", title: <T pt="8. O workflow completo" en="8. The full workflow" /> },
        { id: "run", title: <T pt="9. Primeiro deploy" en="9. First deploy" /> },
        { id: "ec2", title: <T pt="10. Alternativa: Docker puro numa EC2" en="10. Alternative: plain Docker on EC2" /> },
        { id: "production", title: <T pt="Como fica em produção real" en="What it looks like in real production" /> },
        { id: "checks", title: <T pt="Voltar atrás e problemas comuns" en="Rolling back and common problems" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={<T pt="O fluxo completo" en="The full flow" />}>
        <p><T pt={<>O objetivo: depois de um commit chegar em <code>develop</code> ou <code>main</code>, o GitHub constrói uma imagem Docker com a configuração <b>daquele ambiente</b>, guarda a imagem no repositório de imagens (Amazon ECR) <b>da conta AWS correta</b> e troca o container em execução pelo novo. Ninguém entra em servidor, ninguém guarda chave de acesso.</>} en={<>The goal: once a commit lands on <code>develop</code> or <code>main</code>, GitHub builds a Docker image with <b>that environment’s</b> configuration, stores it in the image registry (Amazon ECR) <b>of the right AWS account</b> and swaps the running container for the new one. Nobody logs in to a server, nobody stores an access key.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="O caminho de um commit até o container novo rodando." en="The path from a commit to the new container running." />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Fluxo completo: push, build, OIDC, ECR e ECS / Full flow: push, build, OIDC, ECR and ECS">
            <rect x="276" y="14" width="418" height="118" rx="6" className="ln dash" />
            <text x="485" y="150" className="pt mut" textAnchor="middle">tudo isto acontece na conta AWS do ambiente (dev ou prod)</text>
            <text x="485" y="150" className="en mut" textAnchor="middle">all of this happens in the environment’s AWS account (dev or prod)</text>
            <rect x="8" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="67" y="32" className="mono mut" textAnchor="middle">1</text>
            <text x="67" y="67" className="pt" textAnchor="middle">git push</text>
            <text x="67" y="67" className="en" textAnchor="middle">git push</text>
            <text x="67" y="87" className="pt mut" textAnchor="middle">develop ou main</text>
            <text x="67" y="87" className="en mut" textAnchor="middle">develop or main</text>
            <path d="M126 72L146 72" className="ln" />
            <path d="M138.8 75.5L146 72L138.8 68.5" className="ln" />
            <rect x="146" y="40" width="118" height="64" rx="4" className="ln brandfill" />
            <text x="205" y="32" className="mono mut" textAnchor="middle">2</text>
            <text x="205" y="67" className="pt" textAnchor="middle">GitHub Actions</text>
            <text x="205" y="67" className="en" textAnchor="middle">GitHub Actions</text>
            <text x="205" y="87" className="pt mut" textAnchor="middle">build da imagem</text>
            <text x="205" y="87" className="en mut" textAnchor="middle">image build</text>
            <path d="M264 72L284 72" className="ln" />
            <path d="M276.8 75.5L284 72L276.8 68.5" className="ln" />
            <rect x="284" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="343" y="32" className="mono mut" textAnchor="middle">3</text>
            <text x="343" y="67" className="pt" textAnchor="middle">OIDC → STS</text>
            <text x="343" y="67" className="en" textAnchor="middle">OIDC → STS</text>
            <text x="343" y="87" className="pt mut" textAnchor="middle">credenciais de 1 h</text>
            <text x="343" y="87" className="en mut" textAnchor="middle">1 h credentials</text>
            <path d="M402 72L422 72" className="ln" />
            <path d="M414.8 75.5L422 72L414.8 68.5" className="ln" />
            <rect x="422" y="40" width="118" height="64" rx="4" className="ln fillsoft" />
            <text x="481" y="32" className="mono mut" textAnchor="middle">4</text>
            <text x="481" y="67" className="pt" textAnchor="middle">Amazon ECR</text>
            <text x="481" y="67" className="en" textAnchor="middle">Amazon ECR</text>
            <text x="481" y="87" className="pt mut" textAnchor="middle">guarda a imagem</text>
            <text x="481" y="87" className="en mut" textAnchor="middle">stores the image</text>
            <path d="M540 72L560 72" className="ln" />
            <path d="M552.8 75.5L560 72L552.8 68.5" className="ln" />
            <rect x="560" y="40" width="118" height="64" rx="4" className="ln brandfill" />
            <text x="619" y="32" className="mono mut" textAnchor="middle">5</text>
            <text x="619" y="67" className="pt" textAnchor="middle">Amazon ECS</text>
            <text x="619" y="67" className="en" textAnchor="middle">Amazon ECS</text>
            <text x="619" y="87" className="pt mut" textAnchor="middle">troca a task</text>
            <text x="619" y="87" className="en mut" textAnchor="middle">replaces the task</text>
            <text x="8" y="176" className="pt mut" textAnchor="start">Cada passo só roda se o anterior deu certo; se qualquer um falhar, o container que está no ar continua intocado.</text>
            <text x="8" y="176" className="en mut" textAnchor="start">Each step runs only if the previous one succeeded; if any fails, the running container stays untouched.</text>
            <text x="8" y="200" className="pt mut" textAnchor="start">A imagem leva como tag o SHA do commit: cada versão é rastreável e pode ser reimplantada.</text>
            <text x="8" y="200" className="en mut" textAnchor="start">The image is tagged with the commit SHA: every version is traceable and can be redeployed.</text>
          </svg>
        </Diagram>
        <ol className="ds-steps">
          <li><T pt={<><b>Push.</b> O merge de um PR em <code>develop</code> (ou <code>main</code>) registra um evento <code>push</code> e dispara o workflow.</>} en={<><b>Push.</b> Merging a PR into <code>develop</code> (or <code>main</code>) records a <code>push</code> event and triggers the workflow.</>} /></li>
          <li><T pt={<><b>Build.</b> O job escolhe o environment pelo nome da branch e constrói a imagem passando como <code>--build-arg</code> as variáveis <b>desse</b> environment.</>} en={<><b>Build.</b> The job picks the environment from the branch name and builds the image passing <b>that</b> environment’s variables as <code>--build-arg</code>.</>} /></li>
          <li><T pt={<><b>Credenciais.</b> O GitHub emite um token OIDC; a AWS o troca por credenciais temporárias da role da conta do ambiente (etapas 1 a 3).</>} en={<><b>Credentials.</b> GitHub issues an OIDC token; AWS exchanges it for temporary credentials of the environment account’s role (steps 1 to 3).</>} /></li>
          <li><T pt={<><b>Registro.</b> A imagem sobe para o ECR da <b>mesma conta</b>, com o SHA do commit como tag.</>} en={<><b>Registry.</b> The image is pushed to the ECR of the <b>same account</b>, tagged with the commit SHA.</>} /></li>
          <li><T pt={<><b>Troca.</b> O workflow registra uma task definition nova apontando para a imagem nova e manda o serviço ECS usá-la. O ECS sobe o container novo, espera ele ficar saudável e para o antigo.</>} en={<><b>Swap.</b> The workflow registers a new task definition pointing to the new image and tells the ECS service to use it. ECS starts the new container, waits for it to be healthy and stops the old one.</>} /></li>
          <li><T pt={<><b>Verificação.</b> O job espera o serviço estabilizar. Se a versão nova não ficar saudável, o job falha e o ECS pode desfazer sozinho.</>} en={<><b>Check.</b> The job waits for the service to stabilise. If the new version does not become healthy, the job fails and ECS can roll back on its own.</>} /></li>
        </ol>
        <Callout tone="use" icon="check"><T pt={<><b>E o “parar e excluir o container atual”?</b> No ECS você não roda <code>docker stop</code> e <code>docker rm</code>. O serviço faz a troca (<i>rolling update</i>): a documentação diz que o scheduler “substitui as tasks em execução por tasks novas”. A task antiga é parada e o container dela é descartado junto. Se você usa Docker puro numa EC2, o mesmo passo é manual: veja <a href="#ec2">a alternativa com EC2 (etapa 10)</a>.</>} en={<><b>And “stop and delete the current container”?</b> On ECS you do not run <code>docker stop</code> and <code>docker rm</code>. The service does the swap (a <i>rolling update</i>): the docs say the scheduler “replaces the currently running tasks with new tasks”. The old task is stopped and its container is discarded with it. If you run plain Docker on an EC2 instance, the same step is manual: see <a href="#ec2">the EC2 alternative (step 10)</a>.</>} /></Callout>
      </Section>
      <Section id="how" title={<T pt="Como o OIDC funciona" en="How OIDC works" />}>
        <p><T pt="Em vez de guardar chaves de acesso da AWS nos secrets do GitHub, o GitHub Actions emite um token OIDC de curta duração para cada execução. A AWS confia no GitHub como provedor de identidade e troca esse token por credenciais temporárias de uma role IAM." en="Instead of storing AWS access keys in GitHub secrets, GitHub Actions issues a short-lived OIDC token for each run. AWS trusts GitHub as an identity provider and exchanges that token for temporary credentials of an IAM role." /></p>
        <ol className="ds-steps">
          <li><T pt={<>O job pede um token ao GitHub (precisa de <code>id-token: write</code>).</>} en={<>The job asks GitHub for a token (it needs <code>id-token: write</code>).</>} /></li>
          <li><T pt={<>A action <code>aws-actions/configure-aws-credentials</code> envia o token à AWS (<code>sts:AssumeRoleWithWebIdentity</code>).</>} en={<>The <code>aws-actions/configure-aws-credentials</code> action sends the token to AWS (<code>sts:AssumeRoleWithWebIdentity</code>).</>} /></li>
          <li><T pt={<>A AWS confere a <em>trust policy</em> da role: emissor, audiência (<code>aud</code>) e quem está pedindo (<code>sub</code>).</>} en={<>AWS checks the role’s <em>trust policy</em>: issuer, audience (<code>aud</code>) and who is asking (<code>sub</code>).</>} /></li>
          <li><T pt="Se bater, devolve credenciais temporárias (por padrão, 1 hora) que os passos seguintes usam." en="If it matches, AWS returns temporary credentials (1 hour by default) that the following steps use." /></li>
        </ol>
        <p><T pt="Não há segredo para vazar nem para rotacionar. O controle de quem pode fazer deploy passa a morar na trust policy." en="There is no secret to leak or rotate. Control over who can deploy now lives in the trust policy." /></p>
      </Section>
      <Section id="anatomy" title={<T pt="Os nomes: issuer, audience, STS" en="The names: issuer, audience, STS" />}>
        <p><T pt={<>Os valores <code>token.actions.githubusercontent.com</code> e <code>sts.amazonaws.com</code> parecem endereços para onde algo é enviado, mas na maior parte do tempo são <b>identificadores</b> que precisam ser iguais nos dois lados. Esta seção separa o que é padrão aberto do que é convenção da AWS.</>} en={<>The values <code>token.actions.githubusercontent.com</code> and <code>sts.amazonaws.com</code> look like addresses something is sent to, but most of the time they are <b>identifiers</b> that must be identical on both sides. This section separates what is an open standard from what is an AWS convention.</>} /></p>
        <h3><T pt="Glossário" en="Glossary" /></h3>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<code>token.actions.githubusercontent.com</code>, <T pt={<>O <b>emissor</b> (<i>issuer</i>) dos tokens do GitHub Actions: o serviço do GitHub que assina o JWT de cada execução. Vai no campo <code>iss</code> do token e é o “Provider URL” que você cadastra na AWS. Como tem esse nome, é também um servidor real e público, de onde a AWS busca as chaves de verificação (veja abaixo). É o mesmo emissor para <b>todos</b> os repositórios do GitHub, e é por isso que a condição em <code>sub</code> é obrigatória.</>} en={<>The <b>issuer</b> of GitHub Actions tokens: the GitHub service that signs each run’s JWT. It goes in the token’s <code>iss</code> field and is the “Provider URL” you register in AWS. It is also a real, public server, from which AWS fetches the verification keys (see below). It is the same issuer for <b>every</b> repository on GitHub, which is why the condition on <code>sub</code> is mandatory.</>} />],
            [<code>sts.amazonaws.com</code>, <T pt={<>Dois papéis com o mesmo nome. (1) É o endereço da API do <b>STS</b> (Security Token Service), o serviço da AWS que emite credenciais temporárias. (2) Neste fluxo, é o valor da <b>audiência</b> (<code>aud</code>): para quem o token se destina. O GitHub coloca esse texto no token, e a AWS compara com a lista de “Audience” do provedor. Nenhuma chamada vai para um “endereço de audiência”; é só uma etiqueta combinada.</>} en={<>Two roles with the same name. (1) It is the address of the <b>STS</b> API (Security Token Service), the AWS service that issues temporary credentials. (2) In this flow it is the <b>audience</b> (<code>aud</code>) value: who the token is meant for. GitHub puts that text in the token and AWS compares it with the provider’s “Audience” list. No call goes to an “audience address”; it is just an agreed label.</>} />],
            ["STS", <T pt={<>AWS Security Token Service. Recebe uma prova de identidade (aqui, o token do GitHub) e devolve um trio temporário: <code>AccessKeyId</code>, <code>SecretAccessKey</code> e <code>SessionToken</code>, com data de expiração. Existe um endpoint global (<code>sts.amazonaws.com</code>) e endpoints regionais (por exemplo <code>sts.sa-east-1.amazonaws.com</code>).</>} en={<>AWS Security Token Service. It receives a proof of identity (here, GitHub’s token) and returns a temporary trio: <code>AccessKeyId</code>, <code>SecretAccessKey</code> and <code>SessionToken</code>, with an expiry time. There is a global endpoint (<code>sts.amazonaws.com</code>) and regional ones (for example <code>sts.sa-east-1.amazonaws.com</code>).</>} />],
            ["JWT", <T pt={<>JSON Web Token: três partes em base64url separadas por ponto (cabeçalho, conteúdo e assinatura). O conteúdo é uma lista de <i>claims</i> (afirmações). Qualquer um lê, mas só quem tem a chave privada do emissor consegue assinar.</>} en={<>JSON Web Token: three base64url parts separated by dots (header, payload and signature). The payload is a list of <i>claims</i>. Anyone can read it, but only the holder of the issuer’s private key can sign it.</>} />],
            [<><code>iss</code> · <code>aud</code> · <code>sub</code></>, <T pt={<>Claims do JWT. <code>iss</code>: quem emitiu. <code>aud</code>: para quem é. <code>sub</code>: quem é o “sujeito”, aqui montado pelo GitHub a partir do repositório e do environment/branch (tabela na etapa 2).</>} en={<>JWT claims. <code>iss</code>: who issued it. <code>aud</code>: who it is for. <code>sub</code>: the “subject”, here built by GitHub from the repository and environment/branch (table in step 2).</>} />],
            ["JWKS", <T pt={<>JSON Web Key Set: a lista de <b>chaves públicas</b> do emissor, publicada numa URL (<code>jwks_uri</code>). A AWS baixa essa lista para verificar a assinatura do token.</>} en={<>JSON Web Key Set: the issuer’s list of <b>public keys</b>, published at a URL (<code>jwks_uri</code>). AWS downloads this list to verify the token’s signature.</>} />],
            [<code>sts:AssumeRoleWithWebIdentity</code>, <T pt={<>A chamada de API do STS que troca o token por credenciais de uma role. Ela <b>não é assinada</b> com credenciais AWS (não há nenhuma ainda): o próprio token é a credencial. É também o nome da <i>Action</i> na trust policy.</>} en={<>The STS API call that exchanges the token for a role’s credentials. It is <b>not signed</b> with AWS credentials (there are none yet): the token itself is the credential. It is also the name of the <i>Action</i> in the trust policy.</>} />],
            [<T pt="Provedor OIDC (IAM)" en="OIDC provider (IAM)" />, <T pt="O registro, dentro da sua conta, dizendo “aceito tokens deste emissor, com esta audiência”. Não guarda segredo nenhum; guarda só a URL do emissor e a lista de audiências." en="The record, inside your account, saying “I accept tokens from this issuer, with this audience”. It holds no secret; only the issuer URL and the audience list." />],
          ]}
        />
        <h3><T pt="O que a AWS faz com o token, em ordem" en="What AWS does with the token, in order" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>O runner do GitHub pede o token ao emissor (a action faz isso por você quando o job tem <code>id-token: write</code>) e o envia ao STS com <code>AssumeRoleWithWebIdentity</code>, indicando o ARN da role.</>} en={<>The GitHub runner asks the issuer for the token (the action does it for you when the job has <code>id-token: write</code>) and sends it to STS with <code>AssumeRoleWithWebIdentity</code>, naming the role ARN.</>} /></li>
          <li><T pt={<>O STS lê o <code>iss</code> e procura, <b>na conta da role</b>, um provedor OIDC com essa URL. Se não houver, falha.</>} en={<>STS reads <code>iss</code> and looks, <b>in the role’s account</b>, for an OIDC provider with that URL. If there is none, it fails.</>} /></li>
          <li><T pt={<>Busca <code>https://token.actions.githubusercontent.com/.well-known/openid-configuration</code>, de onde tira o <code>jwks_uri</code>, e baixa as chaves públicas. A conexão é validada pelas autoridades raiz confiáveis da AWS; só se o certificado não for de uma delas entram os thumbprints cadastrados.</>} en={<>It fetches <code>https://token.actions.githubusercontent.com/.well-known/openid-configuration</code>, takes the <code>jwks_uri</code> from it and downloads the public keys. The connection is validated against AWS’s trusted root CAs; the configured thumbprints only come into play if the certificate is not from one of them.</>} /></li>
          <li><T pt={<>Verifica a <b>assinatura</b> com a chave pública certa e confere a validade do token (<code>iat</code> e expiração).</>} en={<>It verifies the <b>signature</b> with the right public key and checks the token’s validity (<code>iat</code> and expiry).</>} /></li>
          <li><T pt={<>Confere a <b>audiência</b>: o <code>aud</code> do token precisa estar na lista de Audience do provedor.</>} en={<>It checks the <b>audience</b>: the token’s <code>aud</code> must be in the provider’s Audience list.</>} /></li>
          <li><T pt={<>Avalia a <b>trust policy</b> da role: <code>Principal.Federated</code> é este provedor? As condições em <code>:aud</code> e <code>:sub</code> batem? Só então emite as credenciais temporárias.</>} en={<>It evaluates the role’s <b>trust policy</b>: is <code>Principal.Federated</code> this provider? Do the conditions on <code>:aud</code> and <code>:sub</code> match? Only then does it issue the temporary credentials.</>} /></li>
        </ol>
        <p><T pt={<>Os passos 2 a 5 são a parte “padrão OIDC”; o passo 6 é IAM puro. Por isso, quem controla <i>quem</i> pode fazer deploy é a trust policy: a assinatura só prova que o token veio mesmo do GitHub, não que veio do seu repositório.</>} en={<>Steps 2 to 5 are the “standard OIDC” part; step 6 is pure IAM. That is why the trust policy controls <i>who</i> may deploy: the signature only proves the token really came from GitHub, not that it came from your repository.</>} /></p>
        <h3><T pt="Dá para olhar com as próprias mãos" en="You can look at it yourself" /></h3>
        <p><T pt="As duas URLs abaixo são públicas e não exigem login:" en="The two URLs below are public and need no login:" /></p>
        <CodeBlock code={`curl -s https://token.actions.githubusercontent.com/.well-known/openid-configuration
curl -s https://token.actions.githubusercontent.com/.well-known/jwks`} />
        <p><T pt={<>A primeira é o documento de descoberta (<i>issuer</i>, <code>jwks_uri</code>, algoritmos de assinatura); a segunda, as chaves públicas. Dentro de um job com <code>id-token: write</code> você também consegue imprimir as claims do token (sem a assinatura) para ver o <code>sub</code> real, útil para depurar uma trust policy:</>} en={<>The first is the discovery document (<i>issuer</i>, <code>jwks_uri</code>, signing algorithms); the second, the public keys. Inside a job with <code>id-token: write</code> you can also print the token’s claims (without the signature) to see the real <code>sub</code>, handy for debugging a trust policy:</>} /></p>
        <CodeBlock code={`TOKEN=$(curl -s -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
    "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com" | jq -r .value)
  echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | jq .`} />
        <p><T pt="O resultado tem esta forma (valores de exemplo, lista abreviada):" en="The result has this shape (example values, shortened list):" /></p>
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
        <Callout tone="warn" icon="alert"><T pt="Não imprima o token inteiro no log nem o cole em lugar nenhum. Sem a assinatura (só o trecho do meio) é inofensivo, mas o token completo vale como credencial até expirar." en="Do not print the whole token in a log or paste it anywhere. Without the signature (only the middle part) it is harmless, but the full token works as a credential until it expires." /></Callout>
        <h3><T pt="É protocolo da AWS?" en="Is it an AWS protocol?" /></h3>
        <p><T pt="Não. A base é aberta; a AWS só fornece o lado que recebe." en="No. The base is open; AWS only provides the receiving side." /></p>
        <Table
          head={[<T pt="Parte" en="Part" />, <T pt="De quem é" en="Whose it is" />]}
          rows={[
            [<T pt={<>Formato JWT, JWKS, documento <code>.well-known/openid-configuration</code>, claims <code>iss</code>/<code>aud</code>/<code>sub</code></>} en={<>JWT format, JWKS, the <code>.well-known/openid-configuration</code> document, <code>iss</code>/<code>aud</code>/<code>sub</code> claims</>} />, <T pt="Padrões abertos (OpenID Connect Discovery, RFCs de JWT/JWK). Os mesmos que o Google e o Cognito usam; GCP e Azure têm equivalentes para o GitHub (Workload Identity Federation, federated credentials)." en="Open standards (OpenID Connect Discovery, the JWT/JWK RFCs). The same ones Google and Cognito use; GCP and Azure have equivalents for GitHub (Workload Identity Federation, federated credentials)." />],
            [<T pt={<>Quais claims existem e o que cada uma contém (<code>repository</code>, <code>environment</code>, <code>job_workflow_ref</code>...)</>} en={<>Which claims exist and what each holds (<code>repository</code>, <code>environment</code>, <code>job_workflow_ref</code>...)</>} />, <T pt="GitHub." en="GitHub." />],
            [<T pt={<><code>AssumeRoleWithWebIdentity</code>, STS, role, trust policy, ARN do provedor</>} en={<><code>AssumeRoleWithWebIdentity</code>, STS, role, trust policy, provider ARN</>} />, <T pt="AWS (a ideia de trocar um token por credenciais temporárias existe em todas as nuvens, mas cada uma tem a sua API)." en="AWS (swapping a token for temporary credentials exists in every cloud, but each has its own API)." />],
            [<T pt={<>O texto <code>sts.amazonaws.com</code> como audiência</>} en={<>The text <code>sts.amazonaws.com</code> as the audience</>} />, <T pt={<>Convenção. O OIDC deixa a audiência livre. A action <code>configure-aws-credentials</code> pede esse valor por padrão e a documentação da AWS o usa nos exemplos; se você trocar nos dois lados (e na opção <code>audience</code> da action), funciona do mesmo jeito. Um valor próprio só serve para evitar que um token emitido para outro destino seja aceito aqui.</>} en={<>Convention. OIDC leaves the audience free. The <code>configure-aws-credentials</code> action asks for this value by default and the AWS docs use it in the examples; if you change it on both sides (and in the action’s <code>audience</code> option) it works the same. A custom value only helps keep a token issued for another destination from being accepted here.</>} />],
            [<T pt={<>As chaves de condição <code>token.actions.githubusercontent.com:sub</code></>} en={<>The condition keys <code>token.actions.githubusercontent.com:sub</code></>} />, <T pt={<>AWS: é a URL do provedor sem <code>https://</code>, seguida de <code>:</code> e da claim. Para o GitHub, a AWS só expõe <code>aud</code>, <code>sub</code>, <code>amr</code>, <code>email</code> e <code>oaud</code>; claims como <code>repository</code> ou <code>job_workflow_ref</code> não podem ser usadas direto na trust policy.</>} en={<>AWS: it is the provider URL without <code>https://</code>, followed by <code>:</code> and the claim. For GitHub, AWS only exposes <code>aud</code>, <code>sub</code>, <code>amr</code>, <code>email</code> and <code>oaud</code>; claims such as <code>repository</code> or <code>job_workflow_ref</code> cannot be used directly in the trust policy.</>} />],
          ]}
        />
      </Section>
      <Section id="layout" title={<T pt="Uma branch, um ambiente, uma conta" en="One branch, one environment, one account" />}>
        <p><T pt="O desenho que o resto da nota segue. Os nomes são iguais nos dois lados; o que muda é o valor guardado em cada environment." en="The layout the rest of the note follows. The names are the same on both sides; what changes is the value stored in each environment." /></p>
        <Diagram minWidth={560} caption={<T pt="Uma branch aponta para um environment do GitHub, e o environment aponta (pela role) para uma conta AWS." en="One branch maps to a GitHub environment, and the environment maps (through the role) to an AWS account." />}>
          <svg viewBox="0 0 700 266" role="img" aria-label="Branches, environments e contas / Branches, environments and accounts">
            <text x="10" y="16" className="pt mut mono" textAnchor="start">Branch</text>
            <text x="10" y="16" className="en mut mono" textAnchor="start">Branch</text>
            <text x="160" y="16" className="pt mut mono" textAnchor="start">GitHub Environment</text>
            <text x="160" y="16" className="en mut mono" textAnchor="start">GitHub Environment</text>
            <text x="400" y="16" className="pt mut mono" textAnchor="start">Conta AWS</text>
            <text x="400" y="16" className="en mut mono" textAnchor="start">AWS account</text>
            <rect x="10" y="50" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="77" className="mono" textAnchor="middle">develop</text>
            <path d="M120 72L160 72" className="ln" />
            <path d="M152.8 75.5L160 72L152.8 68.5" className="ln" />
            <rect x="160" y="38" width="190" height="68" rx="4" className="ln fillsoft" />
            <text x="255" y="66" className="mono" textAnchor="middle">environment: develop</text>
            <text x="255" y="88" className="pt mut" textAnchor="middle">vars: role, região, ECR, ECS</text>
            <text x="255" y="88" className="en mut" textAnchor="middle">vars: role, Region, ECR, ECS</text>
            <path d="M350 72L400 72" className="ln" />
            <path d="M392.8 75.5L400 72L392.8 68.5" className="ln" />
            <rect x="400" y="30" width="290" height="84" rx="4" className="ln" />
            <text x="412" y="48" className="pt mut mono" textAnchor="start">conta dev</text>
            <text x="412" y="48" className="en mut mono" textAnchor="start">dev account</text>
            <rect x="416" y="60" width="106" height="38" rx="4" className="ln fillsoft" />
            <text x="469" y="84" className="pt" textAnchor="middle">ECR</text>
            <text x="469" y="84" className="en" textAnchor="middle">ECR</text>
            <path d="M522 79L560 79" className="ln" />
            <path d="M552.8 82.5L560 79L552.8 75.5" className="ln" />
            <rect x="560" y="60" width="114" height="38" rx="4" className="ln fillsoft" />
            <text x="617" y="84" className="pt" textAnchor="middle">ECS (serviço)</text>
            <text x="617" y="84" className="en" textAnchor="middle">ECS (service)</text>
            <rect x="10" y="166" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="193" className="mono" textAnchor="middle">main</text>
            <path d="M120 188L160 188" className="ln" />
            <path d="M152.8 191.5L160 188L152.8 184.5" className="ln" />
            <rect x="160" y="154" width="190" height="68" rx="4" className="ln brandfill" />
            <text x="255" y="182" className="mono" textAnchor="middle">environment: production</text>
            <text x="255" y="204" className="pt mut" textAnchor="middle">+ aprovação manual</text>
            <text x="255" y="204" className="en mut" textAnchor="middle">+ manual approval</text>
            <path d="M350 188L400 188" className="ln" />
            <path d="M392.8 191.5L400 188L392.8 184.5" className="ln" />
            <rect x="400" y="146" width="290" height="84" rx="4" className="ln" />
            <text x="412" y="164" className="pt mut mono" textAnchor="start">conta prod</text>
            <text x="412" y="164" className="en mut mono" textAnchor="start">prod account</text>
            <rect x="416" y="176" width="106" height="38" rx="4" className="ln fillsoft" />
            <text x="469" y="200" className="pt" textAnchor="middle">ECR</text>
            <text x="469" y="200" className="en" textAnchor="middle">ECR</text>
            <path d="M522 195L560 195" className="ln" />
            <path d="M552.8 198.5L560 195L552.8 191.5" className="ln" />
            <rect x="560" y="176" width="114" height="38" rx="4" className="ln fillsoft" />
            <text x="617" y="200" className="pt" textAnchor="middle">ECS (serviço)</text>
            <text x="617" y="200" className="en" textAnchor="middle">ECS (service)</text>
            <text x="10" y="252" className="pt mut" textAnchor="start">Mesmo workflow, mesmos nomes de variáveis, valores diferentes: é o valor de AWS_ROLE_ARN que decide a conta.</text>
            <text x="10" y="252" className="en mut" textAnchor="start">Same workflow, same variable names, different values: AWS_ROLE_ARN decides the account.</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><em><code>develop</code> → conta dev.</em> Deploy automático, sem aprovação.</>} en={<><em><code>develop</code> → dev account.</em> Automatic deploy, no approval.</>} /></li>
          <li><T pt={<><em><code>main</code> → conta prod.</em> O environment <code>production</code> pode exigir um revisor antes de o job continuar.</>} en={<><em><code>main</code> → prod account.</em> The <code>production</code> environment can require a reviewer before the job continues.</>} /></li>
          <li><T pt={<><em>Mais ambientes?</em> Para um terceiro (por exemplo <code>staging</code>), crie outra branch, outro environment, outra conta (ou o mesmo par de contas com outro cluster) e acrescente a branch ao <code>on.push.branches</code> e ao mapeamento do <code>environment:</code> no workflow. Nada mais muda.</>} en={<><em>More environments?</em> For a third one (for example <code>staging</code>), create another branch, another environment, another account (or the same pair of accounts with another cluster) and add the branch to <code>on.push.branches</code> and to the <code>environment:</code> mapping in the workflow. Nothing else changes.</>} /></li>
        </ul>
        <p><T pt="O exemplo faz deploy de uma imagem Docker no Amazon ECR e atualiza um serviço do Amazon ECS, o mesmo caminho da nota de AWS. Se o seu destino for outro (S3, EC2, Lambda), as etapas 1 a 3 não mudam; só as permissões da role e os passos de deploy do workflow." en="The example deploys a Docker image to Amazon ECR and updates an Amazon ECS service, the same path as the AWS notes. If your target is something else (S3, EC2, Lambda), steps 1 to 3 stay the same; only the role’s permissions and the workflow’s deploy steps change." /></p>
        <p><T pt="Se develop e produção ficam em contas AWS diferentes, repita as etapas 1 e 2 em cada conta: o provedor OIDC usado na trust policy precisa estar na mesma conta da role." en="If develop and production live in different AWS accounts, repeat steps 1 and 2 in each account: the OIDC provider used in a trust policy must be in the same account as the role." /></p>
      </Section>
      <Section id="prereq" title={<T pt="Antes de começar" en="Before you start" />}>
        <p><T pt={<>O workflow <b>não cria</b> a infraestrutura: ele só publica a versão nova numa infraestrutura que já existe. Confira se cada ambiente tem o que está abaixo; sem isso, o primeiro deploy falha.</>} en={<>The workflow does <b>not create</b> the infrastructure: it only publishes the new version onto infrastructure that already exists. Check that each environment has the items below; without them the first deploy fails.</>} /></p>
        <Table
          head={[<T pt="Onde" en="Where" />, <T pt="O que precisa existir" en="What must exist" />]}
          rows={[
            [<T pt="Duas contas AWS (dev e prod)" en="Two AWS accounts (dev and prod)" />, <T pt={<>Criadas dentro de uma Organization. Passo a passo na <a href="/notas/aws/#organizations">nota de AWS, seção Organizations</a>. Você precisa dos dois IDs de conta e de um perfil da CLI para cada uma (<code>--profile dev</code> e <code>--profile prod</code>).</>} en={<>Created inside an Organization. Step by step in the <a href="/notas/aws/#organizations">AWS note, Organizations section</a>. You need both account IDs and a CLI profile for each (<code>--profile dev</code> and <code>--profile prod</code>).</>} />],
            [<T pt="Em cada conta" en="In each account" />, <T pt={<>Um repositório <b>ECR</b>, um cluster e um <b>serviço ECS</b> já rodando (mesmo que com uma imagem de teste), e as duas roles do ECS: <i>task execution role</i> e <i>task role</i>. Nunca criou nada disso? <a href="/notas/ecs-todo-app/">ECS do zero</a> monta tudo passo a passo.</>} en={<>An <b>ECR</b> repository, an <b>ECS</b> cluster and a service already running (even with a placeholder image), and the two ECS roles: the <i>task execution role</i> and the <i>task role</i>. Never created these? <a href="/notas/ecs-todo-app/">ECS from zero</a> builds all of them step by step.</>} />],
            [<T pt="No repositório" en="In the repository" />, <T pt={<>Um <code>Dockerfile</code> na raiz, o arquivo <code>.aws/task-definition.json</code> (com um container chamado <code>app</code>) e as branches <code>develop</code> e <code>main</code>.</>} en={<>A <code>Dockerfile</code> at the root, the <code>.aws/task-definition.json</code> file (with a container named <code>app</code>) and the <code>develop</code> and <code>main</code> branches.</>} />],
            [<T pt="Na sua máquina" en="On your machine" />, <T pt={<>AWS CLI v2 e GitHub CLI (<code>gh</code>) autenticados. Opcionais: tudo o que a CLI faz aqui também dá para fazer pelo console.</>} en={<>AWS CLI v2 and GitHub CLI (<code>gh</code>) authenticated. Both optional: everything the CLI does here can also be done in the console.</>} />],
          ]}
        />
        <p><T pt="Variáveis usadas nos comandos abaixo (troque pelos seus valores):" en="Variables used in the commands below (replace with your values):" /></p>
        <CodeBlock code={`GH_ORG=minha-org            # GitHub owner (user or organization)
  GH_REPO=meu-repo
  REGION=sa-east-1
  # AWS account IDs: <ID_CONTA_DEV> and <ID_CONTA_PROD>`} />
      </Section>
      <Section id="provider" title={<T pt="1. Provedor OIDC na AWS" en="1. OIDC provider in AWS" />}>
        <p><T pt={<>O provedor diz à AWS “confio nos tokens emitidos pelo GitHub Actions”. Ele vive <b>dentro de cada conta</b>, então esta etapa é feita <b>duas vezes</b>: uma na conta dev e outra na prod. Uma conta só precisa dele uma vez, não importa quantos repositórios ou roles use.</>} en={<>The provider tells AWS “I trust tokens issued by GitHub Actions”. It lives <b>inside each account</b>, so this step is done <b>twice</b>: once in the dev account and once in prod. An account needs it only once, no matter how many repositories or roles use it.</>} /></p>
        <h3><T pt="O que é um identity provider OIDC" en="What an OIDC identity provider is" /></h3>
        <p><T pt={<>Um <b>identity provider</b> (IdP, provedor de identidade) é um serviço que sabe <b>provar quem é alguém</b> e que outros sistemas aceitam como testemunha. Você já usou vários: ao clicar em “Entrar com Google”, o Google é o IdP e o site que você abriu confia na palavra dele em vez de pedir uma senha nova. <b>OIDC</b> (OpenID Connect) é o protocolo padrão dessa conversa: o IdP entrega um <b>token assinado</b> (um JWT) dizendo “este sujeito é fulano, emitido por mim, para tal destino”, e quem recebe só precisa conferir a assinatura.</>} en={<>An <b>identity provider</b> (IdP) is a service that can <b>prove who someone is</b> and that other systems accept as a witness. You have used plenty: when you click “Sign in with Google”, Google is the IdP and the site you opened trusts its word instead of asking for a new password. <b>OIDC</b> (OpenID Connect) is the standard protocol for that conversation: the IdP hands over a <b>signed token</b> (a JWT) saying “this subject is so-and-so, issued by me, for this destination”, and the receiver only has to check the signature.</>} /></p>
        <p><T pt={<>Aqui o “fulano” não é uma pessoa, é <b>uma execução do GitHub Actions</b>. O GitHub faz o papel de IdP para os seus workflows: a cada job ele assina um token com a identidade daquela execução (repositório, branch, environment, workflow). A AWS faz o papel de quem recebe e precisa decidir se acredita.</>} en={<>Here the “someone” is not a person, it is <b>a GitHub Actions run</b>. GitHub plays the IdP for your workflows: for each job it signs a token carrying that run’s identity (repository, branch, environment, workflow). AWS plays the receiver that has to decide whether to believe it.</>} /></p>
        <Table
          head={[<T pt="Papel" en="Role" />, <T pt="Quem é aqui" en="Who it is here" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<T pt="Identity provider (emissor)" en="Identity provider (issuer)" />, <>GitHub Actions<br /><code>token.actions.githubusercontent.com</code></>, <T pt="Assina o token de cada execução com a sua chave privada e publica a chave pública." en="Signs each run’s token with its private key and publishes the public key." />],
            [<T pt="Relying party (quem confia)" en="Relying party (who trusts)" />, "AWS (STS)", <T pt="Recebe o token, verifica a assinatura com a chave pública e decide se entrega credenciais." en="Receives the token, verifies the signature with the public key and decides whether to hand out credentials." />],
            [<T pt="Sujeito (quem se identifica)" en="Subject (who is identified)" />, <T pt="O job do workflow" en="The workflow job" />, <T pt="Carrega o token do GitHub até a AWS. Não possui nenhuma senha própria." en="Carries the token from GitHub to AWS. It owns no password of its own." />],
          ]}
        />
        <h3><T pt="Então o que é o “provedor OIDC” que criamos na AWS?" en="So what is the “OIDC provider” we create in AWS?" /></h3>
        <p><T pt={<>O nome engana: o provedor de identidade de verdade é o <b>GitHub</b>, e ele já existe. O que você cria dentro da conta AWS (IAM → Identity providers) é um <b>registro local</b> que diz “nesta conta, aceito tokens deste emissor, para esta audiência”. É uma lista de confiança, parecida com a lista de autoridades certificadoras do navegador: sem a entrada, o STS recusa qualquer token do GitHub, mesmo com assinatura perfeita, porque não tem motivo para acreditar nele.</>} en={<>The name is misleading: the real identity provider is <b>GitHub</b>, and it already exists. What you create inside the AWS account (IAM → Identity providers) is a <b>local record</b> saying “in this account, I accept tokens from this issuer, for this audience”. It is a trust list, similar to the browser’s list of certificate authorities: without the entry, STS rejects any GitHub token, even one with a perfect signature, because it has no reason to believe it.</>} /></p>
        <p><T pt={<>O registro guarda só duas coisas públicas, a <b>URL do emissor</b> e a <b>audiência</b>. Não há chave, senha nem segredo. Na hora da validação, a AWS descobre sozinha as chaves públicas do GitHub em <code>/.well-known/openid-configuration</code> (o <code>jwks_uri</code>), então você não copia nem rotaciona nada.</>} en={<>The record holds only two public things, the <b>issuer URL</b> and the <b>audience</b>. There is no key, password or secret. At validation time, AWS discovers GitHub’s public keys by itself at <code>/.well-known/openid-configuration</code> (the <code>jwks_uri</code>), so you copy and rotate nothing.</>} /></p>
        <h3><T pt="Por que isso substitui as chaves de acesso" en="Why this replaces access keys" /></h3>
        <ul>
          <li><T pt={<><b>Antes:</b> uma chave de acesso IAM de longa duração fica guardada nos secrets do GitHub. Quem a copiar (log vazado, fork malicioso, colaborador que sai) usa a conta até alguém notar e rotacionar.</>} en={<><b>Before:</b> a long-lived IAM access key sits in GitHub secrets. Whoever copies it (leaked log, malicious fork, departing collaborator) uses the account until someone notices and rotates it.</>} /></li>
          <li><T pt={<><b>Agora:</b> nada de valioso é guardado. O token dura minutos, serve só para a audiência <code>sts.amazonaws.com</code> e as credenciais que a AWS devolve expiram em cerca de 1 hora. Um vazamento depois do job terminar não dá acesso a nada.</>} en={<><b>Now:</b> nothing valuable is stored. The token lasts minutes, works only for the <code>sts.amazonaws.com</code> audience, and the credentials AWS returns expire in about 1 hour. A leak after the job ends grants nothing.</>} /></li>
          <li><T pt={<><b>Quem decide o acesso:</b> o provedor só estabelece que o token é genuíno. Quem restringe <i>qual repositório, branch ou environment</i> pode assumir a role é a trust policy (etapa 2). Sem condições no <code>sub</code>, qualquer repositório do GitHub passaria.</>} en={<><b>Who decides access:</b> the provider only establishes that the token is genuine. What restricts <i>which repository, branch or environment</i> may assume the role is the trust policy (step 2). Without conditions on <code>sub</code>, any GitHub repository would pass.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><b>Cuidado:</b> “o token é do GitHub” não significa “o token é do <i>seu</i> repositório”. Todo repositório do mundo recebe tokens assinados pelo mesmo emissor. Por isso a trust policy precisa fixar o <code>sub</code> (por exemplo, <code>repo:minha-org/meu-repo:environment:production</code>).</>} en={<><b>Careful:</b> “the token is from GitHub” does not mean “the token is from <i>your</i> repository”. Every repository in the world gets tokens signed by the same issuer. That is why the trust policy must pin <code>sub</code> (for example, <code>repo:my-org/my-repo:environment:production</code>).</>} /></Callout>
        <h3><T pt="Criando o provedor" en="Creating the provider" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Entre na conta (portal do Identity Center, escolha a conta <code>dev</code> e a role de administrador). Abra <b>IAM → Identity providers → Add provider</b>.</>} en={<>Sign in to the account (Identity Center portal, pick the <code>dev</code> account and the administrator role). Open <b>IAM → Identity providers → Add provider</b>.</>} /></li>
          <li><T pt={<>Em <b>Provider type</b>, escolha <b>OpenID Connect</b>.</>} en={<>Under <b>Provider type</b>, choose <b>OpenID Connect</b>.</>} /></li>
          <li><b>Provider URL</b> · <code>https://token.actions.githubusercontent.com</code></li>
          <li><b>Audience</b> · <code>sts.amazonaws.com</code></li>
          <li><T pt={<>Clique em <b>Add provider</b>. Confirme que apareceu na lista, com o ARN <code>arn:aws:iam::&lt;ID_CONTA&gt;:oidc-provider/token.actions.githubusercontent.com</code>.</>} en={<>Click <b>Add provider</b>. Confirm it appears in the list, with the ARN <code>arn:aws:iam::&lt;ACCOUNT_ID&gt;:oidc-provider/token.actions.githubusercontent.com</code>.</>} /></li>
          <li><T pt={<>Troque para a conta <code>prod</code> e repita os passos 1 a 5.</>} en={<>Switch to the <code>prod</code> account and repeat steps 1 to 5.</>} /></li>
        </ol>
        <p><T pt="Pela CLI, o comando é o abaixo (confira na referência da CLI se ele pede a lista de thumbprints na sua versão)." en="From the CLI, the command is the one below (check the CLI reference for whether your version asks for a thumbprint list)." /></p>
        <CodeBlock code={`for P in dev prod; do
    aws iam create-open-id-connect-provider \\
      --url https://token.actions.githubusercontent.com \\
      --client-id-list sts.amazonaws.com \\
      --profile $P
  done`} />
        <p><T pt="Se o comando falhar com “EntityAlreadyExists”, o provedor já existe naquela conta e não há nada a fazer." en="If the command fails with “EntityAlreadyExists”, the provider already exists in that account and there is nothing to do." /></p>
        <p><T pt="Sobre thumbprints: a AWS valida o certificado do endpoint do provedor com a sua biblioteca de autoridades raiz confiáveis, e só recorre aos thumbprints cadastrados se o certificado não for assinado por uma delas." en="About thumbprints: AWS verifies the provider endpoint’s certificate with its library of trusted root CAs, and only falls back to the configured thumbprints if the certificate is not signed by one of them." /></p>
      </Section>
      <Section id="roles" title={<T pt="2. Roles IAM e trust policy" en="2. IAM roles and trust policy" />}>
        <p><T pt={<>Crie uma role por ambiente (por exemplo <code>github-deploy-develop</code> e <code>github-deploy-production</code>). A trust policy diz quem pode assumir a role. A condição em <code>sub</code> é obrigatória: sem ela, qualquer repositório do GitHub poderia pedir acesso.</>} en={<>Create one role per environment (for example <code>github-deploy-develop</code> and <code>github-deploy-production</code>). The trust policy says who may assume the role. The <code>sub</code> condition is required: without it, any repository on GitHub could ask for access.</>} /></p>
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
        <p><T pt={<>Na role de produção, troque o final do <code>sub</code> por <code>environment:production</code>.</>} en={<>On the production role, change the end of <code>sub</code> to <code>environment:production</code>.</>} /></p>
        <h3><T pt={<>Como o <code>sub</code> é montado</>} en={<>How <code>sub</code> is built</>} /></h3>
        <Table
          head={[<T pt="Quando o job" en="When the job" />, <code>sub</code>]}
          rows={[
            [<T pt="referencia um environment" en="references an environment" />, <code>repo:ORG/REPO:environment:NAME</code>],
            [<T pt="roda de uma branch (sem environment)" en="runs from a branch (no environment)" />, <code>repo:ORG/REPO:ref:refs/heads/BRANCH</code>],
            [<T pt="roda por pull request (sem environment)" en="runs for a pull request (no environment)" />, <code>repo:ORG/REPO:pull_request</code>],
            [<T pt="roda de uma tag (sem environment)" en="runs from a tag (no environment)" />, <code>repo:ORG/REPO:ref:refs/tags/TAG</code>],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Quando o job referencia um environment, o <code>sub</code> usa a forma <code>environment:NAME</code> e não mais a da branch. Por isso a trust policy acima usa <code>environment:develop</code>, e não <code>ref:refs/heads/develop</code>.</>} en={<>When a job references an environment, <code>sub</code> uses the <code>environment:NAME</code> form, not the branch form. That is why the trust policy above uses <code>environment:develop</code> rather than <code>ref:refs/heads/develop</code>.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt={<>Repositórios criados depois de 15/07/2026, ou que optaram por isso, usam o formato imutável com IDs do dono e do repositório. Nesse caso uma trust policy só com nomes falha com “Not authorized to perform sts:AssumeRoleWithWebIdentity”. O valor passa a ser, por exemplo: <code>repo:&lt;ORG&gt;@&lt;ORG_ID&gt;/&lt;REPO&gt;@&lt;REPO_ID&gt;:environment:develop</code>.</>} en={<>Repositories created after July 15, 2026, or that opted in, use the immutable format with the owner and repository IDs. In that case a name-only trust policy fails with “Not authorized to perform sts:AssumeRoleWithWebIdentity”. The value becomes, for example: <code>repo:&lt;ORG&gt;@&lt;ORG_ID&gt;/&lt;REPO&gt;@&lt;REPO_ID&gt;:environment:develop</code>.</>} /></Callout>
        <h3><T pt="Permissões da role" en="Role permissions" /></h3>
        <p><T pt="A role só precisa do mínimo para este deploy. A lista abaixo junta as permissões que as documentações das actions de ECR e ECS indicam; ajuste ARNs e, se usar CodeDeploy, acrescente o que a documentação da action pedir." en="The role only needs the minimum for this deploy. The list below combines the permissions that the ECR and ECS action docs call for; adjust the ARNs and, if you use CodeDeploy, add what the action docs ask for." /></p>
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
        <h3><T pt="Criar a role, passo a passo" en="Creating the role, step by step" /></h3>
        <p><T pt={<>Uma role por conta: <code>github-deploy-develop</code> na conta dev e <code>github-deploy-production</code> na conta prod. Pelo console:</>} en={<>One role per account: <code>github-deploy-develop</code> in the dev account and <code>github-deploy-production</code> in the prod account. In the console:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<>Na conta dev: <b>IAM → Policies → Create policy → JSON</b>. Cole a política de permissões acima (com os ARNs da conta dev) e salve como <code>github-deploy-develop-policy</code>.</>} en={<>In the dev account: <b>IAM → Policies → Create policy → JSON</b>. Paste the permissions policy above (with the dev account ARNs) and save it as <code>github-deploy-develop-policy</code>.</>} /></li>
          <li><T pt={<><b>IAM → Roles → Create role</b>. Em <b>Trusted entity type</b>, escolha <b>Web identity</b>; em <b>Identity provider</b>, <code>token.actions.githubusercontent.com</code>; em <b>Audience</b>, <code>sts.amazonaws.com</code>. Preencha a organização e o repositório do GitHub.</>} en={<><b>IAM → Roles → Create role</b>. Under <b>Trusted entity type</b>, choose <b>Web identity</b>; under <b>Identity provider</b>, <code>token.actions.githubusercontent.com</code>; under <b>Audience</b>, <code>sts.amazonaws.com</code>. Fill in the GitHub organization and repository.</>} /></li>
          <li><T pt={<>Anexe a política criada no passo 1, dê o nome <code>github-deploy-develop</code> e crie a role.</>} en={<>Attach the policy created in step 1, name the role <code>github-deploy-develop</code> and create it.</>} /></li>
          <li><T pt={<>Abra a role → aba <b>Trust relationships</b> → <b>Edit trust policy</b> e ajuste a condição <code>sub</code> para <code>repo:&lt;ORG&gt;/&lt;REPO&gt;:environment:develop</code>, como na trust policy mostrada antes. O assistente do console só oferece a forma por branch; a por environment você escreve à mão.</>} en={<>Open the role → <b>Trust relationships</b> tab → <b>Edit trust policy</b> and set the <code>sub</code> condition to <code>repo:&lt;ORG&gt;/&lt;REPO&gt;:environment:develop</code>, as in the trust policy shown earlier. The console wizard only offers the branch form; you write the environment form by hand.</>} /></li>
          <li><T pt={<>Copie o <b>ARN</b> da role (algo como <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/github-deploy-develop</code>). Ele vai para a variável <code>AWS_ROLE_ARN</code> do environment <code>develop</code> (etapa 3).</>} en={<>Copy the role’s <b>ARN</b> (something like <code>arn:aws:iam::&lt;ID_CONTA_DEV&gt;:role/github-deploy-develop</code>). It goes into the <code>AWS_ROLE_ARN</code> variable of the <code>develop</code> environment (step 3).</>} /></li>
          <li><T pt={<>Na conta prod, repita tudo com os ARNs da prod, o nome <code>github-deploy-production</code> e <code>environment:production</code> no <code>sub</code>.</>} en={<>In the prod account, repeat everything with the prod ARNs, the name <code>github-deploy-production</code> and <code>environment:production</code> in <code>sub</code>.</>} /></li>
        </ol>
        <p><T pt={<>O mesmo pela CLI, com os JSONs salvos em arquivos (<code>trust-develop.json</code> e <code>deploy-policy-develop.json</code>):</>} en={<>The same from the CLI, with the JSONs saved to files (<code>trust-develop.json</code> and <code>deploy-policy-develop.json</code>):</>} /></p>
        <CodeBlock code={`aws iam create-role --role-name github-deploy-develop \\
    --assume-role-policy-document file://trust-develop.json --profile dev
  aws iam put-role-policy --role-name github-deploy-develop \\
    --policy-name deploy --policy-document file://deploy-policy-develop.json --profile dev
  aws iam get-role --role-name github-deploy-develop --profile dev \\
    --query Role.Arn --output text      # <- value for AWS_ROLE_ARN

  # then repeat with --profile prod, github-deploy-production and the prod files`} />
        <Callout tone="warn" icon="alert"><T pt={<>Cada trust policy referencia o provedor <b>da própria conta</b> (o ARN tem o ID da conta). Se você copiar o arquivo da dev para a prod sem trocar o ID, a role cria, mas ninguém consegue assumi-la.</>} en={<>Each trust policy references the provider <b>of its own account</b> (the ARN contains the account ID). If you copy the dev file to prod without changing the ID, the role is created but nobody can assume it.</>} /></Callout>
      </Section>
      <Section id="environments" title={<T pt="3. Environments e variáveis no GitHub" en="3. GitHub environments and variables" />}>
        <p><T pt="Um Environment é a “porta” entre o repositório e uma role da AWS: é nele que ficam as variáveis daquele ambiente e as regras de quem pode fazer deploy. Passo a passo no repositório:" en="An Environment is the “door” between the repository and an AWS role: it holds that environment’s variables and the rules about who may deploy. Step by step in the repository:" /></p>
        <ol className="ds-steps">
          <li><T pt={<><b>Settings → Environments → New environment</b>, nome <code>develop</code> (exatamente igual ao usado no <code>sub</code> da trust policy), <b>Configure environment</b>.</>} en={<><b>Settings → Environments → New environment</b>, name <code>develop</code> (exactly the same as used in the trust policy’s <code>sub</code>), <b>Configure environment</b>.</>} /></li>
          <li><T pt={<>Em <b>Deployment branches and tags</b>, escolha <b>Selected branches and tags</b> → <b>Add deployment branch or tag rule</b> → <code>develop</code>.</>} en={<>Under <b>Deployment branches and tags</b>, choose <b>Selected branches and tags</b> → <b>Add deployment branch or tag rule</b> → <code>develop</code>.</>} /></li>
          <li><T pt={<>Em <b>Environment variables → Add variable</b>, crie as cinco variáveis abaixo com os valores <b>da conta dev</b>.</>} en={<>Under <b>Environment variables → Add variable</b>, create the five variables below with the <b>dev account</b> values.</>} /></li>
          <li><T pt={<>Volte e crie o environment <code>production</code>: branch permitida <code>main</code>, <b>Required reviewers</b> marcado com quem aprova, e as mesmas cinco variáveis com os valores <b>da conta prod</b>.</>} en={<>Go back and create the <code>production</code> environment: allowed branch <code>main</code>, <b>Required reviewers</b> checked with who approves, and the same five variables with the <b>prod account</b> values.</>} /></li>
        </ol>
        <p><T pt={<>Os nomes das variáveis são iguais nos dois ambientes; o que muda é o valor. É isso que faz o mesmo workflow mandar o <code>develop</code> para uma conta e o <code>main</code> para outra.</>} en={<>The variable names are the same in both environments; the value is what changes. That is what makes the same workflow send <code>develop</code> to one account and <code>main</code> to another.</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Deployment branches.</em> Em <code>develop</code>, permita só a branch <code>develop</code>; em <code>production</code>, só a <code>main</code>. É o que impede outra branch de obter acesso à role.</>} en={<><em>Deployment branches.</em> On <code>develop</code>, allow only the <code>develop</code> branch; on <code>production</code>, only <code>main</code>. This is what stops another branch from reaching the role.</>} /></li>
          <li><T pt={<><em>Required reviewers</em> em <code>production</code> (até 6 pessoas ou times; basta uma aprovação), se quiser aprovação manual antes do deploy.</>} en={<><em>Required reviewers</em> on <code>production</code> (up to 6 people or teams; one approval is enough), if you want manual approval before deploying.</>} /></li>
          <li><T pt={<><em>Variables</em> por ambiente: <code>AWS_ROLE_ARN</code>, <code>AWS_REGION</code>, <code>ECR_REPOSITORY</code>, <code>ECS_CLUSTER</code>, <code>ECS_SERVICE</code>. Ficam disponíveis só para jobs que usam o environment, pelo contexto <code>vars</code>.</>} en={<><em>Variables</em> per environment: <code>AWS_ROLE_ARN</code>, <code>AWS_REGION</code>, <code>ECR_REPOSITORY</code>, <code>ECS_CLUSTER</code>, <code>ECS_SERVICE</code>. They are available only to jobs that use the environment, through the <code>vars</code> context.</>} /></li>
        </ul>
        <Callout tone="use" icon="check"><T pt="O ARN de uma role não é segredo, então variáveis bastam: não há chave nenhuma para guardar." en="A role ARN is not a secret, so variables are enough: there is no key to store." /></Callout>
        <p><T pt="A AWS recomenda proteger environments usados em políticas OIDC com regras de proteção, como a restrição de branches e tags de deploy." en="AWS recommends protecting environments used in OIDC policies with protection rules, such as deployment branch and tag restrictions." /></p>
        <h3><T pt="O mesmo pela CLI do GitHub" en="The same from the GitHub CLI" /></h3>
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
        <p className="muted"><T pt="Os corpos da API REST de environments e de branch policies estão na referência “REST API endpoints for deployment environments / branch policies”. Os revisores obrigatórios são mais simples de configurar pela interface." en="The REST bodies for environments and branch policies are in the “REST API endpoints for deployment environments / branch policies” reference. Required reviewers are simpler to set up in the UI." /></p>
        <h3><T pt="As duas variáveis do build" en="The two build variables" /></h3>
        <p><T pt="Além das cinco variáveis acima, acrescente as duas que alimentam o build (etapa 5). Mesmo nome nos dois environments, valor diferente." en="Besides the five variables above, add the two that feed the build (step 5). Same name in both environments, different value." /></p>
        <Table
          head={[<T pt="Variável" en="Variable" />, <T pt={<>Em <code>develop</code></>} en={<>In <code>develop</code></>} />, <T pt={<>Em <code>production</code></>} en={<>In <code>production</code></>} />]}
          rows={[
            [<T pt={<><code>APP_ENV</code></>} en={<><code>APP_ENV</code></>} />, <T pt={<><code>development</code></>} en={<><code>development</code></>} />, <T pt={<><code>production</code></>} en={<><code>production</code></>} />],
            [<T pt={<><code>PUBLIC_API_URL</code></>} en={<><code>PUBLIC_API_URL</code></>} />, <T pt={<><code>https://api-dev.exemplo.com</code></>} en={<><code>https://api-dev.example.com</code></>} />, <T pt={<><code>https://api.exemplo.com</code></>} en={<><code>https://api.example.com</code></>} />],
          ]}
        />
        <ol className="ds-steps">
          <li><T pt={<>No repositório: <b>Settings → Environments → develop → Environment variables → Add variable</b>.</>} en={<>In the repository: <b>Settings → Environments → develop → Environment variables → Add variable</b>.</>} /></li>
          <li><T pt={<>Crie <code>APP_ENV</code> e <code>PUBLIC_API_URL</code> com os valores de dev.</>} en={<>Create <code>APP_ENV</code> and <code>PUBLIC_API_URL</code> with the dev values.</>} /></li>
          <li><T pt={<>Repita em <b>production</b> com os valores de prod.</>} en={<>Repeat in <b>production</b> with the prod values.</>} /></li>
        </ol>
        <CodeBlock code={`gh variable set APP_ENV        --env develop    --body "development"
gh variable set PUBLIC_API_URL --env develop    --body "https://api-dev.example.com"
gh variable set APP_ENV        --env production --body "production"
gh variable set PUBLIC_API_URL --env production --body "https://api.example.com"`} />
        <Callout tone="use" icon="check"><T pt={<>Use <i>variables</i>, não <i>secrets</i>, para esses dois valores: são públicos (acabam dentro da imagem) e em variável você consegue conferir o que está configurado. Segredos continuam no Secrets Manager.</>} en={<>Use <i>variables</i>, not <i>secrets</i>, for these two values: they are public (they end up inside the image) and with a variable you can check what is configured. Secrets stay in Secrets Manager.</>} /></Callout>
      </Section>
      <Section id="secrets" title={<T pt="4. Secrets: onde ficam e por quê" en="4. Secrets: where they live and why" />}>
        <p><T pt={<>Pergunta frequente: “a senha do banco vai nos secrets do GitHub ou na AWS?”. Depende de <b>quem precisa ler o valor</b>. Separe três tipos de informação:</>} en={<>A common question: “does the database password go in GitHub secrets or in AWS?”. It depends on <b>who needs to read the value</b>. Separate three kinds of information:</>} /></p>
        <Table
          head={[<T pt="O que é" en="What it is" />, <T pt="Onde guardar" en="Where to keep it" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt="Credencial da AWS para o deploy" en="AWS credential for the deploy" />, <><b><T pt="Em lugar nenhum" en="Nowhere" /></b> (OIDC)</>, <T pt="O token é emitido por execução e expira. Não existe chave para vazar nem para rotacionar." en="The token is issued per run and expires. There is no key to leak or rotate." />],
            [<T pt="ARN da role, região, nomes de ECR/cluster/serviço" en="Role ARN, Region, ECR/cluster/service names" />, <b>GitHub · Environment <i>variables</i></b>, <T pt="Não são segredo e mudam por ambiente. Em variável você consegue ver e conferir o valor." en="They are not secret and change per environment. In a variable you can see and check the value." />],
            [<T pt={<>Senha do banco, chaves de API, tokens que a <b>aplicação</b> usa ao rodar</>} en={<>Database password, API keys, tokens the <b>application</b> uses at runtime</>} />, <><b>AWS · Secrets Manager</b> <T pt={<>(ou SSM Parameter Store <code>SecureString</code>), na conta de cada ambiente</>} en={<>(or SSM Parameter Store <code>SecureString</code>), in each environment’s account</>} /></>, <T pt="Quem lê é o ECS, na hora de iniciar o container, não o pipeline. Veja abaixo." en="The reader is ECS, when it starts the container, not the pipeline. See below." />],
            [<T pt={<>Token de terceiro que só o <b>CI</b> usa (registry privado de pacotes, scanner, etc.)</>} en={<>Third-party token used only by <b>CI</b> (private package registry, scanner, etc.)</>} />, <><b>GitHub · Environment <i>secrets</i></b> <T pt="(ou do repositório)" en="(or repository)" /></>, <T pt="A AWS não precisa dele. Só o workflow o lê, então é lá que ele deve ficar." en="AWS does not need it. Only the workflow reads it, so that is where it belongs." />],
          ]}
        />
        <h3><T pt="Por que o segredo da aplicação fica na AWS e não no GitHub" en="Why the application secret lives in AWS, not GitHub" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Quem lê é o runtime.</em> A aplicação precisa do valor sempre que uma task sobe: no deploy, mas também em autoscaling, reinício ou troca de host, quando o GitHub não está envolvido. Se o valor só existe nos secrets do GitHub, você teria de reimplantar para qualquer task nova.</>} en={<><em>The reader is the runtime.</em> The application needs the value whenever a task starts: at deploy, but also on autoscaling, restarts or host replacement, when GitHub is not involved. If the value exists only in GitHub secrets, you would have to redeploy for every new task.</>} /></li>
          <li><T pt={<><em>O pipeline nunca vê o valor.</em> Com o segredo na AWS, o workflow só carrega o ARN dele. Quem tem permissão de rodar workflows (ou uma action de terceiros comprometida) não consegue lê-lo. Segredos do GitHub chegam ao runner como variáveis do job; a documentação avisa que o mascaramento nos logs não é garantido e que valores transformados podem escapar.</>} en={<><em>The pipeline never sees the value.</em> With the secret in AWS, the workflow carries only its ARN. Anyone who can run workflows (or a compromised third-party action) cannot read it. GitHub secrets reach the runner as job variables; the docs warn that log masking is not guaranteed and that transformed values can slip through.</>} /></li>
          <li><T pt={<><em>Um valor por ambiente, na conta dele.</em> O segredo de prod existe só na conta prod, e o IAM dessa conta decide quem lê. Um desenvolvedor com acesso à dev nunca alcança a senha de produção. O CloudTrail registra cada leitura.</>} en={<><em>One value per environment, in its own account.</em> The prod secret exists only in the prod account, and that account’s IAM decides who reads it. A developer with dev access never reaches the production password. CloudTrail logs every read.</>} /></li>
          <li><T pt={<><em>Rotação e criptografia nativas.</em> O Secrets Manager rotaciona segredos e criptografa com o KMS. Os secrets do GitHub são criptografados antes de chegar ao GitHub (libsodium), mas ele é um cofre para o CI, sem rotação automática.</>} en={<><em>Native rotation and encryption.</em> Secrets Manager rotates secrets and encrypts them with KMS. GitHub secrets are encrypted before reaching GitHub (libsodium), but it is a vault for CI, with no automatic rotation.</>} /></li>
        </ul>
        <Callout tone="use" icon="check"><T pt={<>Regra prática: se a <b>aplicação</b> lê, o segredo fica na <b>AWS</b>. Se só o <b>CI</b> lê, fica no <b>GitHub</b>. Se ninguém precisa ler (credencial de deploy), use <b>OIDC</b> e não guarde nada.</>} en={<>Rule of thumb: if the <b>application</b> reads it, the secret lives in <b>AWS</b>. If only <b>CI</b> reads it, it lives in <b>GitHub</b>. If nobody needs to read it (deploy credential), use <b>OIDC</b> and store nothing.</>} /></Callout>
        <h3><T pt="Ligando o segredo ao serviço, passo a passo" en="Wiring the secret to the service, step by step" /></h3>
        <ol className="ds-steps">
          <li>
            <T pt={<><b>Criar o segredo em cada conta</b>, com valores diferentes. Leia o valor de um arquivo ou de um prompt, para não ficar no histórico do shell:</>} en={<><b>Create the secret in each account</b>, with different values. Read the value from a file or a prompt, so it does not stay in shell history:</>} />
            <CodeBlock code={`aws secretsmanager create-secret --name meu-app/develop/db \\
      --secret-string file://db-develop.json --profile dev
  # db-develop.json: {"username":"app","password":"..."}  (delete the file afterwards)`} />
          </li>
          <li>
            <T pt={<><b>Dar permissão de leitura à task execution role</b> (não à role de deploy). É ela que o ECS usa para buscar o segredo ao iniciar o container. Acrescente à role, em cada conta, uma política como esta (<code>kms:Decrypt</code> só se o segredo usar uma chave KMS própria):</>} en={<><b>Give read permission to the task execution role</b> (not to the deploy role). It is what ECS uses to fetch the secret when starting the container. Add a policy like this to the role, in each account (<code>kms:Decrypt</code> only if the secret uses a customer managed KMS key):</>} />
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
            <T pt={<><b>Referenciar o segredo no <code>.aws/task-definition.json</code></b>, em <code>containerDefinitions[].secrets</code>. O ECS injeta o valor como variável de ambiente; o sufixo <code>:password::</code> escolhe uma chave do JSON:</>} en={<><b>Reference the secret in <code>.aws/task-definition.json</code></b>, under <code>containerDefinitions[].secrets</code>. ECS injects the value as an environment variable; the <code>:password::</code> suffix picks one key of the JSON:</>} />
            <CodeBlock code={`"secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:meu-app/develop/db-AbCdEf:password::"
    }
  ]`} />
          </li>
          <li><T pt={<><b>Cuidado com o arquivo único.</b> O <code>task-definition.json</code> é o mesmo nos dois ambientes, mas o ARN do segredo tem o ID da conta e o nome do ambiente. Duas saídas: manter um arquivo por ambiente (<code>.aws/task-definition.develop.json</code> e <code>.production.json</code>) ou nomear o segredo igual nas duas contas e montar o ARN com o ID da conta da variável. O exemplo do workflow usa um arquivo só; adapte o caminho se escolher um por ambiente.</>} en={<><b>Watch out for the single file.</b> <code>task-definition.json</code> is the same in both environments, but the secret ARN contains the account ID and the environment name. Two ways out: keep one file per environment (<code>.aws/task-definition.develop.json</code> and <code>.production.json</code>) or name the secret the same in both accounts and build the ARN with the account ID from a variable. The workflow example uses a single file; adapt the path if you choose one per environment.</>} /></li>
          <li><T pt={<><b>Deploy.</b> O workflow não muda. A role de deploy só precisa do <code>iam:PassRole</code> sobre a execution role (já está na política da etapa 2) e <b>não</b> precisa de nenhuma permissão no Secrets Manager.</>} en={<><b>Deploy.</b> The workflow does not change. The deploy role only needs <code>iam:PassRole</code> on the execution role (already in the step 2 policy) and needs <b>no</b> Secrets Manager permission.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<>O ECS busca o valor quando o container <b>inicia</b>. Se você atualizar ou rotacionar o segredo depois, as tasks em execução não recebem o valor novo: é preciso subir tasks novas (por exemplo, um novo deploy ou “Force new deployment” no serviço). Além disso, a aplicação, os logs e as ferramentas de depuração do container enxergam as variáveis de ambiente.</>} en={<>ECS fetches the value when the container <b>starts</b>. If you update or rotate the secret later, running tasks do not get the new value: new tasks must be launched (for example a new deploy or “Force new deployment” on the service). Also, the application, logs and debugging tools in the container can see the environment variables.</>} /></Callout>
        <h3><T pt="Quando você usa secrets do GitHub" en="When you do use GitHub secrets" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Crie pela interface (<b>Settings → Secrets and variables → Actions</b>, ou dentro do environment) ou pela CLI: <code>gh secret set NOME --env develop</code> (sem <code>--env</code>, vai para o repositório). O valor não pode ser lido de volta depois.</>} en={<>Create them in the UI (<b>Settings → Secrets and variables → Actions</b>, or inside the environment) or from the CLI: <code>gh secret set NAME --env develop</code> (without <code>--env</code> it goes to the repository). The value cannot be read back afterwards.</>} /></li>
          <li><T pt={<>Prefira <b>environment secrets</b> a repository secrets: só chegam a jobs que usam aquele environment e respeitam as regras dele (branch permitida, revisores).</>} en={<>Prefer <b>environment secrets</b> over repository secrets: they only reach jobs that use that environment and respect its rules (allowed branch, reviewers).</>} /></li>
          <li><T pt={<>O workflow só lê um secret que você cita de forma explícita (<code>$&#123;&#123; secrets.NOME &#125;&#125;</code>). Passe-o por <code>env:</code> ou <code>with:</code>, nunca escrito direto no comando.</>} en={<>A workflow only reads a secret you cite explicitly (<code>$&#123;&#123; secrets.NAME &#125;&#125;</code>). Pass it through <code>env:</code> or <code>with:</code>, never written directly in the command.</>} /></li>
          <li><T pt={<>Secrets <b>não</b> são passados a workflows disparados de forks (exceto o <code>GITHUB_TOKEN</code>), nem a jobs do Dependabot, nem automaticamente a reusable workflows.</>} en={<>Secrets are <b>not</b> passed to workflows triggered from forks (except <code>GITHUB_TOKEN</code>), nor to Dependabot jobs, nor automatically to reusable workflows.</>} /></li>
        </ul>
      </Section>
      <Section id="config" title={<T pt="5. Configuração por ambiente no Dockerfile" en="5. Per-environment configuration in the Dockerfile" />}>
        <p><T pt="Você pediu uma imagem “com todas as envs corretas de dev ou prod”. Há dois tipos de configuração e cada um entra num momento diferente:" en="You asked for an image “with all the correct dev or prod envs”. There are two kinds of configuration and each enters at a different moment:" /></p>
        <Diagram minWidth={560} caption={<T pt="Config pública entra no build; segredo entra só na hora de rodar, vindo do Secrets Manager." en="Public config enters at build time; secrets enter only at run time, from Secrets Manager." />}>
          <svg viewBox="0 0 700 276" role="img" aria-label="Onde cada configuração entra / Where each setting enters">
            <text x="10" y="18" className="pt mut mono" textAnchor="start">BUILD · no GitHub Actions</text>
            <text x="10" y="18" className="en mut mono" textAnchor="start">BUILD · in GitHub Actions</text>
            <rect x="10" y="30" width="190" height="56" rx="4" className="ln fillsoft" />
            <text x="105" y="54" className="pt" textAnchor="middle">Environment variables</text>
            <text x="105" y="54" className="en" textAnchor="middle">Environment variables</text>
            <text x="105" y="72" className="pt mut mono" textAnchor="middle">APP_ENV, PUBLIC_API_URL</text>
            <text x="105" y="72" className="en mut mono" textAnchor="middle">APP_ENV, PUBLIC_API_URL</text>
            <path d="M200 58L230 58" className="ln" />
            <path d="M222.8 61.5L230 58L222.8 54.5" className="ln" />
            <rect x="230" y="30" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="295" y="54" className="pt mono" textAnchor="middle">docker build</text>
            <text x="295" y="54" className="en mono" textAnchor="middle">docker build</text>
            <text x="295" y="72" className="pt mut mono" textAnchor="middle">--build-arg</text>
            <text x="295" y="72" className="en mut mono" textAnchor="middle">--build-arg</text>
            <path d="M360 58L390 58" className="ln" />
            <path d="M382.8 61.5L390 58L382.8 54.5" className="ln" />
            <rect x="390" y="30" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="455" y="54" className="pt" textAnchor="middle">Imagem no ECR</text>
            <text x="455" y="54" className="en" textAnchor="middle">Image in ECR</text>
            <text x="455" y="72" className="pt mut" textAnchor="middle">valores gravados</text>
            <text x="455" y="72" className="en mut" textAnchor="middle">values baked in</text>
            <text x="10" y="108" className="pt mut" textAnchor="start">Valor público, fica dentro da imagem.</text>
            <text x="10" y="108" className="en mut" textAnchor="start">Public value, lives inside the image.</text>
            <text x="10" y="170" className="pt mut mono" textAnchor="start">RUNTIME · no ECS, quando a task inicia</text>
            <text x="10" y="170" className="en mut mono" textAnchor="start">RUNTIME · in ECS, when the task starts</text>
            <rect x="10" y="182" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="85" y="206" className="pt" textAnchor="middle">Secrets Manager</text>
            <text x="85" y="206" className="en" textAnchor="middle">Secrets Manager</text>
            <text x="85" y="224" className="pt mut" textAnchor="middle">na conta do ambiente</text>
            <text x="85" y="224" className="en mut" textAnchor="middle">in the environment’s account</text>
            <path d="M160 210L200 210" className="ln" />
            <path d="M192.8 213.5L200 210L192.8 206.5" className="ln" />
            <rect x="200" y="182" width="150" height="56" rx="4" className="ln fillsoft" />
            <text x="275" y="206" className="pt" textAnchor="middle">Task execution role</text>
            <text x="275" y="206" className="en" textAnchor="middle">Task execution role</text>
            <text x="275" y="224" className="pt mut" textAnchor="middle">lê o segredo</text>
            <text x="275" y="224" className="en mut" textAnchor="middle">reads the secret</text>
            <text x="10" y="262" className="pt mut" textAnchor="start">Segredo: nunca entra na imagem nem passa pelo pipeline.</text>
            <text x="10" y="262" className="en mut" textAnchor="start">Secret: never enters the image or goes through the pipeline.</text>
            <rect x="560" y="100" width="130" height="90" rx="4" className="ln brandfill" />
            <text x="625" y="138" className="pt" textAnchor="middle">Container</text>
            <text x="625" y="138" className="en" textAnchor="middle">Container</text>
            <text x="625" y="158" className="pt mut" textAnchor="middle">em execução</text>
            <text x="625" y="158" className="en mut" textAnchor="middle">running</text>
            <path d="M520 66L560 118" className="ln" />
            <path d="M552.8 114.4L560 118L558.4 110.2" className="ln" />
            <path d="M350 210L560 172" className="ln" />
            <path d="M553.5 176.7L560 172L552.3 169.9" className="ln" />
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Tipo" en="Kind" />, <T pt="Exemplo" en="Example" />, <T pt="Entra quando e como" en="Enters when and how" />]}
          rows={[
            [<T pt="Pública, conhecida no build" en="Public, known at build time" />, <T pt="URL pública da API, nome do ambiente, ID de analytics, variáveis embutidas no bundle do front-end" en="Public API URL, environment name, analytics ID, variables embedded in the front-end bundle" />, <T pt={<><b>Build.</b> GitHub Environment <i>variables</i> → <code>--build-arg</code> → <code>ARG</code>/<code>ENV</code> no Dockerfile.</>} en={<><b>Build.</b> GitHub Environment <i>variables</i> → <code>--build-arg</code> → <code>ARG</code>/<code>ENV</code> in the Dockerfile.</>} />],
            [<T pt="Não secreta, só necessária ao rodar" en="Non-secret, needed only at run time" />, <T pt="Nível de log, nome da fila, flags" en="Log level, queue name, flags" />, <T pt={<><b>Runtime.</b> Campo <code>environment</code> da task definition.</>} en={<><b>Runtime.</b> The task definition’s <code>environment</code> field.</>} />],
            [<T pt="Segredo" en="Secret" />, <T pt="Senha do banco, chave de API, token" en="Database password, API key, token" />, <T pt={<><b>Runtime.</b> Secrets Manager → campo <code>secrets</code> da task definition. Nunca no build.</>} en={<><b>Runtime.</b> Secrets Manager → the task definition’s <code>secrets</code> field. Never at build time.</>} />],
          ]}
        />
        <h3><T pt="Dockerfile de exemplo" en="Example Dockerfile" /></h3>
        <p><T pt={<>Um app Node com build em duas etapas, só para mostrar onde ficam os <code>ARG</code>. Adapte ao seu stack; a ideia vale para qualquer linguagem.</>} en={<>A Node app with a two-stage build, only to show where the <code>ARG</code>s go. Adapt it to your stack; the idea holds for any language.</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<><b>Segredo no build é vazamento.</b> Valores de <code>ARG</code> e <code>ENV</code> ficam gravados nos metadados e nas camadas da imagem, e qualquer pessoa com permissão de baixá-la os lê (por exemplo com <code>docker history</code>). A documentação do Docker recomenda <i>secret mounts</i> (<code>RUN --mount=type=secret</code>) para segredos de build, que não ficam na imagem. Para a senha do banco, use o caminho de runtime da tabela.</>} en={<><b>A secret at build time is a leak.</b> <code>ARG</code> and <code>ENV</code> values are recorded in the image metadata and layers, and anyone allowed to pull it can read them (for example with <code>docker history</code>). Docker’s documentation recommends <i>secret mounts</i> (<code>RUN --mount=type=secret</code>) for build secrets, which do not stay in the image. For the database password, use the runtime path from the table.</>} /></Callout>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Nota pessoal, não verificada nas fontes:</strong> reconstruir a imagem por ambiente significa que o que você testou em dev não é exatamente o artefato que roda em prod. A alternativa comum é construir uma vez e injetar tudo em runtime. Esta nota segue o seu pedido (imagem por ambiente) e mantém no build só valores públicos, o que reduz esse risco.</>} en={<><strong>Personal note, not verified in the sources:</strong> rebuilding the image per environment means what you tested in dev is not exactly the artifact that runs in prod. The common alternative is to build once and inject everything at run time. This note follows your request (an image per environment) and keeps only public values at build time, which reduces that risk.</>} /></Callout>
      </Section>
      <Section id="ecr" title={<T pt="6. O repositório de imagens (ECR)" en="6. The image registry (ECR)" />}>
        <p><T pt="Cada conta tem o seu repositório ECR, com o mesmo nome nas duas. O workflow envia a imagem para o repositório da conta em que a role foi assumida, então dev e prod nunca compartilham imagens." en="Each account has its own ECR repository, with the same name in both. The workflow pushes the image to the repository of the account whose role was assumed, so dev and prod never share images." /></p>
        <h3><T pt="Criar o repositório, passo a passo" en="Creating the repository, step by step" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Na conta dev, abra <b>Amazon ECR → Private registry → Repositories → Create repository</b>.</>} en={<>In the dev account, open <b>Amazon ECR → Private registry → Repositories → Create repository</b>.</>} /></li>
          <li><T pt={<>Em <b>Repository name</b>, informe <code>meu-app</code>. Ative <b>Tag immutability</b>: uma tag, uma vez enviada, não pode ser sobrescrita.</>} en={<>Under <b>Repository name</b>, enter <code>meu-app</code>. Turn on <b>Tag immutability</b>: once pushed, a tag cannot be overwritten.</>} /></li>
          <li><T pt={<>Ative <b>Scan on push</b> para analisar vulnerabilidades a cada envio e crie o repositório.</>} en={<>Turn on <b>Scan on push</b> to scan for vulnerabilities on every push, and create the repository.</>} /></li>
          <li><T pt="Repita na conta prod, com o mesmo nome." en="Repeat in the prod account, with the same name." /></li>
        </ol>
        <CodeBlock code={`for P in dev prod; do
  aws ecr create-repository --repository-name $APP \\
    --image-tag-mutability IMMUTABLE \\
    --image-scanning-configuration scanOnPush=true \\
    --region $REGION --profile $P
done`} />
        <h3><T pt="Limpeza automática" en="Automatic cleanup" /></h3>
        <p><T pt={<>Cada deploy acrescenta uma imagem. Uma <i>lifecycle policy</i> expira as mais antigas. Segundo a documentação, as imagens expiram em até 24 horas depois de cumprir o critério, e a pré-visualização (<i>preview</i>) mostra o que seria apagado antes de você aplicar.</>} en={<>Every deploy adds an image. A <i>lifecycle policy</i> expires the oldest ones. According to the docs, images expire within 24 hours of meeting the criteria, and the preview shows what would be deleted before you apply it.</>} /></p>
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
        <Callout tone="warn" icon="alert"><T pt="Mantenha uma contagem folgada. Se a imagem da versão em execução expirar, uma task nova (autoscaling, reinício) não consegue baixá-la. Trinta imagens deixam bastante margem para voltar atrás." en="Keep a generous count. If the running version’s image expires, a new task (autoscaling, restart) cannot pull it. Thirty images leave plenty of room to roll back." /></Callout>
      </Section>
      <Section id="ecs" title={<T pt="7. Como o ECS troca o container" en="7. How ECS swaps the container" />}>
        <p><T pt="É aqui que o container antigo é parado e descartado. O comportamento é controlado por dois números do serviço, descritos na documentação do ECS:" en="This is where the old container is stopped and discarded. The behaviour is controlled by two numbers on the service, described in the ECS documentation:" /></p>
        <ul className="ds-list">
          <li><T pt={<><em><code>minimumHealthyPercent</code></em> é o limite inferior de tasks saudáveis durante a troca, em % do número desejado (arredondado para cima).</>} en={<><em><code>minimumHealthyPercent</code></em> is the lower limit of healthy tasks during the swap, as a % of the desired count (rounded up).</>} /></li>
          <li><T pt={<><em><code>maximumPercent</code></em> é o limite superior de tasks em execução durante a troca (arredondado para baixo).</>} en={<><em><code>maximumPercent</code></em> is the upper limit of running tasks during the swap (rounded down).</>} /></li>
        </ul>
        <Diagram minWidth={560} caption={<T pt="v1 é a task atual, v2 a nova. O ECS para a antiga e descarta o container dela; você não roda docker stop nem docker rm." en="v1 is the current task, v2 the new one. ECS stops the old one and discards its container; you never run docker stop or docker rm." />}>
          <svg viewBox="0 0 700 296" role="img" aria-label="Duas configurações de rolling update / Two rolling-update settings">
            <text x="10" y="18" className="pt" textAnchor="start">Padrão: sobe a nova, depois derruba a antiga</text>
            <text x="10" y="18" className="en" textAnchor="start">Default: start the new one, then stop the old one</text>
            <text x="10" y="36" className="mono mut" textAnchor="start">minimumHealthyPercent 100 · maximumPercent 200</text>
            <rect x="112" y="52" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="130" y="71" className="pt mono" textAnchor="middle">v1</text>
            <text x="130" y="71" className="en mono" textAnchor="middle">v1</text>
            <text x="130" y="102" className="pt mut mono" textAnchor="middle">antes</text>
            <text x="130" y="102" className="en mut mono" textAnchor="middle">before</text>
            <path d="M190 66L290 66" className="ln" />
            <path d="M282.8 69.5L290 66L282.8 62.5" className="ln" />
            <rect x="310" y="52" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="328" y="71" className="pt mono" textAnchor="middle">v1</text>
            <text x="328" y="71" className="en mono" textAnchor="middle">v1</text>
            <rect x="354" y="52" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="372" y="71" className="pt mono" textAnchor="middle">v2</text>
            <text x="372" y="71" className="en mono" textAnchor="middle">v2</text>
            <text x="350" y="102" className="pt mut mono" textAnchor="middle">durante</text>
            <text x="350" y="102" className="en mut mono" textAnchor="middle">during</text>
            <path d="M410 66L510 66" className="ln" />
            <path d="M502.8 69.5L510 66L502.8 62.5" className="ln" />
            <rect x="552" y="52" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="570" y="71" className="pt mono" textAnchor="middle">v2</text>
            <text x="570" y="71" className="en mono" textAnchor="middle">v2</text>
            <text x="570" y="102" className="pt mut mono" textAnchor="middle">depois</text>
            <text x="570" y="102" className="en mut mono" textAnchor="middle">after</text>
            <text x="10" y="126" className="pt mut" textAnchor="start">Sem indisponibilidade; por alguns instantes roda o dobro de tasks.</text>
            <text x="10" y="126" className="en mut" textAnchor="start">No downtime; for a few moments twice the tasks run.</text>
            <text x="10" y="168" className="pt" textAnchor="start">Para a antiga, depois sobe a nova</text>
            <text x="10" y="168" className="en" textAnchor="start">Stop the old one, then start the new one</text>
            <text x="10" y="186" className="mono mut" textAnchor="start">minimumHealthyPercent 0 · maximumPercent 100</text>
            <rect x="112" y="202" width="36" height="28" rx="4" className="ln fillsoft" />
            <text x="130" y="221" className="pt mono" textAnchor="middle">v1</text>
            <text x="130" y="221" className="en mono" textAnchor="middle">v1</text>
            <text x="130" y="252" className="pt mut mono" textAnchor="middle">antes</text>
            <text x="130" y="252" className="en mut mono" textAnchor="middle">before</text>
            <path d="M190 216L290 216" className="ln" />
            <path d="M282.8 219.5L290 216L282.8 212.5" className="ln" />
            <rect x="332" y="202" width="36" height="28" rx="4" className="ln dash" />
            <text x="350" y="221" className="pt mut mono" textAnchor="middle">–</text>
            <text x="350" y="221" className="en mut mono" textAnchor="middle">–</text>
            <text x="350" y="252" className="pt mut mono" textAnchor="middle">durante</text>
            <text x="350" y="252" className="en mut mono" textAnchor="middle">during</text>
            <path d="M410 216L510 216" className="ln" />
            <path d="M502.8 219.5L510 216L502.8 212.5" className="ln" />
            <rect x="552" y="202" width="36" height="28" rx="4" className="ln brandfill" />
            <text x="570" y="221" className="pt mono" textAnchor="middle">v2</text>
            <text x="570" y="221" className="en mono" textAnchor="middle">v2</text>
            <text x="570" y="252" className="pt mut mono" textAnchor="middle">depois</text>
            <text x="570" y="252" className="en mut mono" textAnchor="middle">after</text>
            <text x="10" y="276" className="pt mut" textAnchor="start">Há uma janela sem container, mas nunca duas versões ao mesmo tempo.</text>
            <text x="10" y="276" className="en mut" textAnchor="start">There is a window with no container, but never two versions at once.</text>
            <path d="M10 148L690 148" className="ln dash" />
          </svg>
        </Diagram>
        <p><T pt={<>Com <b>1 task desejada</b>, o padrão (100/200) sobe a nova antes de parar a antiga: sem indisponibilidade, desde que a nova passe no health check. Com 0/100 o ECS é forçado a parar a antiga antes: é o equivalente literal de “parar, excluir e criar de novo”, ao custo de uma janela fora do ar.</>} en={<>With <b>1 desired task</b>, the default (100/200) starts the new one before stopping the old one: no downtime, as long as the new one passes the health check. With 0/100 ECS is forced to stop the old one first: the literal equivalent of “stop, delete and create again”, at the cost of a window offline.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>A documentação avisa: ao definir esses percentuais, garanta que o scheduler consiga parar ou iniciar <b>pelo menos uma task</b>. Com 1 task desejada, 100/100 trava o deploy (nem sobe a nova, nem para a antiga) e o serviço registra um evento de erro.</>} en={<>The docs warn: when you set these percentages, make sure the scheduler can stop or start <b>at least one task</b>. With 1 desired task, 100/100 stalls the deploy (it can neither start the new one nor stop the old one) and the service logs an error event.</>} /></Callout>
        <h3><T pt="Configurar, passo a passo" en="Configuring, step by step" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>No console: <b>ECS → Clusters → seu cluster → seu serviço → Update service</b>, seção de opções de deployment.</>} en={<>In the console: <b>ECS → Clusters → your cluster → your service → Update service</b>, deployment options section.</>} /></li>
          <li><T pt={<>Defina <code>Minimum healthy percent</code> e <code>Maximum percent</code> conforme o desenho acima (a primeira opção é a recomendada).</>} en={<>Set <code>Minimum healthy percent</code> and <code>Maximum percent</code> as drawn above (the first option is the recommended one).</>} /></li>
          <li><T pt={<>Ative o <b>deployment circuit breaker</b> com <b>rollback</b>: se as tasks novas não conseguirem iniciar, o ECS marca o deploy como falho e volta para a revisão anterior. A documentação o indica para parar um deploy quando as tasks não sobem.</>} en={<>Turn on the <b>deployment circuit breaker</b> with <b>rollback</b>: if the new tasks cannot start, ECS marks the deploy as failed and returns to the previous revision. The docs recommend it for stopping a deployment when tasks cannot start.</>} /></li>
          <li><T pt="Repita no serviço da outra conta (em prod, mantenha o padrão 100/200 para não ter janela fora do ar)." en="Repeat on the other account’s service (in prod, keep the default 100/200 to avoid an offline window)." /></li>
        </ol>
        <CodeBlock code={`aws ecs update-service --cluster meu-cluster --service meu-servico \\
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200,deploymentCircuitBreaker={enable=true,rollback=true}" \\
  --profile dev`} />
        <h3><T pt="O health check decide quando a antiga pode parar" en="The health check decides when the old one may stop" /></h3>
        <p><T pt={<>O ECS só considera a task nova saudável se o container passar no health check. Defina um na task definition (o comando depende do que existe na imagem; este exemplo usa <code>wget</code>, presente na imagem Alpine):</>} en={<>ECS only treats the new task as healthy if the container passes its health check. Define one in the task definition (the command depends on what the image contains; this example uses <code>wget</code>, present in the Alpine image):</>} /></p>
        <CodeBlock code={`"healthCheck": {
  "command": ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"],
  "interval": 15,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 20
}`} />
        <p><T pt="Se o serviço está atrás de um load balancer, o health check do target group também vale. Sem nenhum health check, o ECS só sabe que o processo iniciou, não que a aplicação responde." en="If the service is behind a load balancer, the target group’s health check counts too. With no health check, ECS only knows the process started, not that the application responds." /></p>
      </Section>
      <Section id="workflow" title={<T pt="8. O workflow completo" en="8. The full workflow" />}>
        <p><T pt={<>Um único arquivo atende os dois ambientes: o nome do environment sai do nome da branch, e as <code>--build-arg</code> vêm das variáveis do environment.</>} en={<>One file serves both environments: the environment name comes from the branch name, and the <code>--build-arg</code>s come from the environment variables.</>} /></p>
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
        <Callout tone="use" icon="check"><T pt={<>Complemento recomendado: proteja <code>develop</code> e <code>main</code> com uma regra de branch (<b>Settings → Rules → Rulesets</b>) que exija pull request e a passagem dos testes. Assim ninguém dá <code>push</code> direto e todo deploy passa por revisão. Crie um workflow de testes separado, disparado por <code>pull_request</code>, <b>sem</b> environment: ele não consegue assumir as roles de deploy, porque o <code>sub</code> de um PR (<code>repo:ORG/REPO:pull_request</code>) não bate com nenhuma trust policy.</>} en={<>Recommended addition: protect <code>develop</code> and <code>main</code> with a branch rule (<b>Settings → Rules → Rulesets</b>) requiring a pull request and passing tests. That way nobody pushes directly and every deploy goes through review. Create a separate tests workflow triggered by <code>pull_request</code>, <b>without</b> an environment: it cannot assume the deploy roles, because a PR’s <code>sub</code> (<code>repo:ORG/REPO:pull_request</code>) matches no trust policy.</>} /></Callout>
        <h3><T pt="O que cada parte faz" en="What each part does" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em><code>on.push.branches</code>.</em> Só <code>develop</code> e <code>main</code> disparam. Uma branch de feature não faz deploy.</>} en={<><em><code>on.push.branches</code>.</em> Only <code>develop</code> and <code>main</code> trigger. A feature branch does not deploy.</>} /></li>
          <li><T pt={<><em><code>environment:</code>.</em> A expressão escolhe <code>production</code> para <code>main</code> e <code>develop</code> para o resto. É isso que seleciona as variáveis (<code>vars.*</code>), a role e as regras de aprovação.</>} en={<><em><code>environment:</code>.</em> The expression picks <code>production</code> for <code>main</code> and <code>develop</code> otherwise. It is what selects the variables (<code>vars.*</code>), the role and the approval rules.</>} /></li>
          <li><T pt={<><em>Build.</em> As variáveis do environment viram <code>--build-arg</code>. A imagem nasce com os valores do ambiente certo.</>} en={<><em>Build.</em> The environment’s variables become <code>--build-arg</code>. The image is born with the right environment’s values.</>} /></li>
          <li><T pt={<><em>Checagem de existência.</em> Com tags imutáveis, enviar de novo a mesma tag dá erro. Se você reexecutar um job do mesmo commit, o workflow pula o build e reaproveita a imagem. Consequência: se mudar uma variável do environment e reexecutar o <i>mesmo</i> commit, a imagem não é refeita; faça um commit novo.</>} en={<><em>Existence check.</em> With immutable tags, pushing the same tag again is an error. If you re-run a job for the same commit, the workflow skips the build and reuses the image. Consequence: if you change an environment variable and re-run the <i>same</i> commit, the image is not rebuilt; make a new commit.</>} /></li>
          <li><T pt={<><em>Render + deploy.</em> A primeira ação grava a imagem nova na task definition; a segunda registra a revisão e atualiza o serviço. A partir daí, o ECS faz a troca descrita na etapa 7.</>} en={<><em>Render + deploy.</em> The first action writes the new image into the task definition; the second registers the revision and updates the service. From there ECS does the swap described in step 7.</>} /></li>
          <li><T pt={<><em><code>wait-for-service-stability</code>.</em> O job só termina quando o serviço estabiliza. Se a versão nova não ficar saudável, o job falha e você vê no GitHub.</>} en={<><em><code>wait-for-service-stability</code>.</em> The job finishes only when the service stabilises. If the new version does not become healthy, the job fails and you see it on GitHub.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>As actions não são certificadas pelo GitHub e os exemplos usam tags (<code>@v6</code>, <code>@v2</code>, <code>@v1</code>) por legibilidade. Em produção, fixe por SHA de commit, como recomenda a documentação do GitHub.</>} en={<>These actions are not certified by GitHub and the examples use tags (<code>@v6</code>, <code>@v2</code>, <code>@v1</code>) for readability. In production, pin to a commit SHA, as GitHub’s docs recommend.</>} /></Callout>
      </Section>
      <Section id="run" title={<T pt="9. Primeiro deploy, passo a passo" en="9. First deploy, step by step" />}>
        <ol className="ds-steps">
          <li><T pt={<><b>Confira o checklist.</b> Repositório ECR e serviço ECS em cada conta; as sete variáveis em cada environment (as cinco da etapa 3 mais <code>APP_ENV</code> e <code>PUBLIC_API_URL</code>); <code>ecr:DescribeImages</code> na política da role.</>} en={<><b>Check the list.</b> ECR repository and ECS service in each account; the seven variables in each environment (the five from step 3 plus <code>APP_ENV</code> and <code>PUBLIC_API_URL</code>); <code>ecr:DescribeImages</code> in the role policy.</>} /></li>
          <li><T pt={<><b>Commit na <code>develop</code>.</b> Mergeie um PR (ou faça um commit) e abra a aba <b>Actions</b>. O job mostra o environment <code>develop</code>.</>} en={<><b>Commit to <code>develop</code>.</b> Merge a PR (or commit) and open the <b>Actions</b> tab. The job shows the <code>develop</code> environment.</>} /></li>
          <li><T pt={<><b>Acompanhe os passos.</b> Credenciais, login no ECR, build e push, render, deploy. Se o de credenciais falhar, veja os problemas comuns no fim da página.</>} en={<><b>Follow the steps.</b> Credentials, ECR login, build and push, render, deploy. If credentials fail, see the common problems at the end of the page.</>} /></li>
          <li>
            <T pt={<><b>Confirme a imagem no ECR da conta dev:</b></>} en={<><b>Confirm the image in the dev account’s ECR:</b></>} />
            <CodeBlock code={`aws ecr describe-images --repository-name $APP --profile dev \\
  --query 'sort_by(imageDetails,&imagePushedAt)[-1].{tags:imageTags,pushed:imagePushedAt}'`} />
          </li>
          <li>
            <T pt={<><b>Veja a troca acontecer.</b> Durante o deploy, o serviço lista duas revisões; quando termina, só a nova:</>} en={<><b>Watch the swap happen.</b> During the deploy the service lists two revisions; when it ends, only the new one:</>} />
            <CodeBlock code={`aws ecs describe-services --cluster meu-cluster --services meu-servico --profile dev \\
  --query 'services[0].deployments[].[status,rolloutState,runningCount,taskDefinition]'
# PRIMARY   IN_PROGRESS  ...  new task definition
# ACTIVE    COMPLETED    ...  old task definition  (disappears when done)`} />
          </li>
          <li><T pt={<><b>Veja quem fez a chamada.</b> No CloudTrail da conta dev, procure o evento <code>AssumeRoleWithWebIdentity</code>: o nome da sessão é <code>gh-&lt;id da execução&gt;</code>, o que liga a ação da AWS à execução exata do workflow.</>} en={<><b>See who made the call.</b> In the dev account’s CloudTrail, look for the <code>AssumeRoleWithWebIdentity</code> event: the session name is <code>gh-&lt;run id&gt;</code>, which ties the AWS action to the exact workflow run.</>} /></li>
          <li><T pt={<><b>Confirme o container novo.</b> Em <b>ECS → serviço → Tasks</b>, a task antiga aparece como parada e a nova em execução. A aplicação deve responder com a configuração de dev (por exemplo a URL de API de dev).</>} en={<><b>Confirm the new container.</b> Under <b>ECS → service → Tasks</b>, the old task shows as stopped and the new one running. The application must answer with the dev configuration (for example the dev API URL).</>} /></li>
          <li><T pt={<><b>Promova para produção.</b> Abra um PR de <code>develop</code> para <code>main</code> e mergeie. O job fica em “Waiting” até um revisor aprovar em <b>Review deployments</b>; depois constrói <b>outra</b> imagem, com os valores de prod, no ECR da conta prod.</>} en={<><b>Promote to production.</b> Open a PR from <code>develop</code> to <code>main</code> and merge it. The job sits in “Waiting” until a reviewer approves under <b>Review deployments</b>; it then builds <b>another</b> image, with the prod values, in the prod account’s ECR.</>} /></li>
        </ol>
        <Callout tone="use" icon="check"><T pt="Se algo der errado no meio, o container que estava no ar continua rodando: o ECS só para a versão antiga depois que a nova ficou saudável (configuração padrão). Com o circuit breaker, ele volta sozinho para a revisão anterior." en="If something goes wrong midway, the container that was running keeps running: ECS stops the old version only after the new one is healthy (default configuration). With the circuit breaker, it returns to the previous revision on its own." /></Callout>
      </Section>
      <Section id="ec2" title={<T pt="10. Alternativa: Docker puro numa EC2" en="10. Alternative: plain Docker on an EC2 instance" />}>
        <p><T pt={<>Se você não usa ECS e roda o container direto numa EC2, o “parar, excluir e criar” é um script na instância, e o workflow o dispara pelo <b>AWS Systems Manager Run Command</b>, sem abrir SSH. Os passos do build, o ECR e o OIDC são os mesmos; só mudam os dois últimos passos do workflow.</>} en={<>If you do not use ECS and run the container directly on an EC2 instance, “stop, delete and create” is a script on the instance, and the workflow triggers it through <b>AWS Systems Manager Run Command</b>, with no SSH open. The build, ECR and OIDC steps are the same; only the last two workflow steps change.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Sem ECS, o workflow manda a instância trocar o container, na ordem: baixar, parar, remover, rodar." en="Without ECS, the workflow tells the instance to swap the container, in order: pull, stop, remove, run." />}>
          <svg viewBox="0 0 700 200" role="img" aria-label="Alternativa com Docker puro numa EC2 / Alternative with plain Docker on EC2">
            <rect x="10" y="40" width="120" height="50" rx="4" className="ln brandfill" />
            <text x="70" y="70" className="pt" textAnchor="middle">GitHub Actions</text>
            <text x="70" y="70" className="en" textAnchor="middle">GitHub Actions</text>
            <path d="M130 65L150 65" className="ln" />
            <path d="M142.8 68.5L150 65L142.8 61.5" className="ln" />
            <rect x="150" y="40" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="230" y="62" className="pt" textAnchor="middle">SSM Run Command</text>
            <text x="230" y="62" className="en" textAnchor="middle">SSM Run Command</text>
            <text x="230" y="80" className="pt mut mono" textAnchor="middle">AWS-RunShellScript</text>
            <text x="230" y="80" className="en mut mono" textAnchor="middle">AWS-RunShellScript</text>
            <path d="M310 65L330 65" className="ln" />
            <path d="M322.8 68.5L330 65L322.8 61.5" className="ln" />
            <rect x="330" y="16" width="360" height="168" rx="4" className="ln fillsoft" />
            <text x="346" y="38" className="pt mono" textAnchor="start">Instância EC2 (SSM Agent + Docker)</text>
            <text x="346" y="38" className="en mono" textAnchor="start">EC2 instance (SSM Agent + Docker)</text>
            <text x="350" y="72" className="pt mono" textAnchor="start">1 docker pull a imagem nova</text>
            <text x="350" y="72" className="en mono" textAnchor="start">1 docker pull the new image</text>
            <text x="350" y="102" className="pt mono" textAnchor="start">2 docker stop app</text>
            <text x="350" y="102" className="en mono" textAnchor="start">2 docker stop app</text>
            <text x="350" y="132" className="pt mono" textAnchor="start">3 docker rm app</text>
            <text x="350" y="132" className="en mono" textAnchor="start">3 docker rm app</text>
            <text x="350" y="162" className="pt mono" textAnchor="start">4 docker run a imagem nova</text>
            <text x="350" y="162" className="en mono" textAnchor="start">4 docker run the new image</text>
            <text x="10" y="130" className="pt mut" textAnchor="start">a role de deploy só precisa de ssm:SendCommand</text>
            <text x="10" y="130" className="en mut" textAnchor="start">the deploy role only needs ssm:SendCommand</text>
            <text x="10" y="150" className="pt mut" textAnchor="start">no documento e na instância</text>
            <text x="10" y="150" className="en mut" textAnchor="start">on the document and the instance</text>
          </svg>
        </Diagram>
        <h3><T pt="Preparar a instância, uma vez por conta" en="Preparing the instance, once per account" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>A instância precisa de um <i>instance profile</i> com a política gerenciada <code>AmazonSSMManagedInstanceCore</code> (para o SSM Agent) e permissão de leitura no ECR (por exemplo <code>AmazonEC2ContainerRegistryReadOnly</code>). Em <b>EC2 → Instances → Actions → Security → Modify IAM role</b>.</>} en={<>The instance needs an <i>instance profile</i> with the managed policy <code>AmazonSSMManagedInstanceCore</code> (for the SSM Agent) and read permission on ECR (for example <code>AmazonEC2ContainerRegistryReadOnly</code>). Under <b>EC2 → Instances → Actions → Security → Modify IAM role</b>.</>} /></li>
          <li><T pt={<>Confirme em <b>Systems Manager → Fleet Manager</b> que a instância aparece como gerenciada. Docker e AWS CLI instalados nela.</>} en={<>Confirm under <b>Systems Manager → Fleet Manager</b> that the instance shows as managed. Docker and the AWS CLI installed on it.</>} /></li>
          <li><T pt={<>Salve o script abaixo em <code>/opt/meu-app/deploy.sh</code> (<code>chmod +x</code>).</>} en={<>Save the script below at <code>/opt/meu-app/deploy.sh</code> (<code>chmod +x</code>).</>} /></li>
          <li><T pt={<>Na role de deploy (OIDC), troque as permissões do ECS por <code>ssm:SendCommand</code> (nos ARNs do documento <code>AWS-RunShellScript</code> e da instância) e <code>ssm:GetCommandInvocation</code>. Crie a variável <code>EC2_INSTANCE_ID</code> em cada environment.</>} en={<>On the deploy role (OIDC), replace the ECS permissions with <code>ssm:SendCommand</code> (on the ARNs of the <code>AWS-RunShellScript</code> document and the instance) and <code>ssm:GetCommandInvocation</code>. Create the <code>EC2_INSTANCE_ID</code> variable in each environment.</>} /></li>
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
        <p><T pt="No workflow, remova os passos “Render” e “Deploy to Amazon ECS” e acrescente este:" en="In the workflow, remove the “Render” and “Deploy to Amazon ECS” steps and add this one:" /></p>
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
        <Callout tone="warn" icon="alert"><T pt={<>Aqui há sempre uma janela sem container (entre o <code>docker stop</code> e o <code>docker run</code>) e nenhum rollback automático: se a versão nova não subir, você precisa reexecutar o deploy de um commit anterior. É o que o ECS resolve para você. Segredos: leia-os do Secrets Manager no próprio script, com a role da instância; não os passe pelo workflow.</>} en={<>Here there is always a window with no container (between <code>docker stop</code> and <code>docker run</code>) and no automatic rollback: if the new version does not start, you must redeploy an earlier commit. This is what ECS solves for you. Secrets: read them from Secrets Manager in the script itself, with the instance role; do not pass them through the workflow.</>} /></Callout>
      </Section>
      <Section id="production" title={<T pt="Como fica em produção real" en="What it looks like in real production" />}>
        <p><T pt="O fluxo das etapas 1 a 9 é o mesmo em produção. O que muda é quem cria e quem pode mexer em cada peça. Esta lista mistura o que a AWS e o GitHub recomendam com prática comum de times; o que não vem das fontes oficiais está marcado." en="The flow in steps 1 to 9 is the same in production. What changes is who creates each piece and who may touch it. This list mixes what AWS and GitHub recommend with common team practice; what does not come from the official sources is marked." /></p>
        <ul className="ds-list">
          <li><T pt={<><em>Infraestrutura como código.</em> Provedor, roles e políticas ficam em Terraform (ou CloudFormation), revisados por PR, e não criados no console. Assim a trust policy tem histórico e revisão, e recriar uma conta é repetir o código. Veja a <a href="/notas/terraform/">nota de Terraform</a>.</>} en={<><em>Infrastructure as code.</em> Provider, roles and policies live in Terraform (or CloudFormation), reviewed through PRs, not created in the console. That gives the trust policy history and review, and rebuilding an account is rerunning the code. See the <a href="/notas/terraform/">Terraform note</a>.</>} /></li>
          <li><T pt={<><em>Um provedor por conta, muitas roles.</em> A AWS recomenda um provedor por IdP externo. Cada repositório ou serviço ganha a sua própria role, com a sua trust policy e permissões só para o que ele faz. Uma role “de deploy para tudo” é o oposto disso.</>} en={<><em>One provider per account, many roles.</em> AWS recommends one provider per external IdP. Each repository or service gets its own role, with its own trust policy and permissions for only what it does. One “deploy everything” role is the opposite.</>} /></li>
          <li><T pt={<><em>A proteção de produção mora no GitHub, não na AWS.</em> Quando o job usa <code>environment: production</code>, o <code>sub</code> é <code>repo:ORG/REPO:environment:production</code> e <b>não contém a branch</b>. Quem decide que só <code>main</code> chega lá é a regra <b>Deployment branches</b> do environment, junto de <b>Required reviewers</b>. Sem essas regras, qualquer branch cujo workflow declare esse environment obtém a role de produção.</>} en={<><em>Production protection lives in GitHub, not in AWS.</em> When the job uses <code>environment: production</code>, <code>sub</code> is <code>repo:ORG/REPO:environment:production</code> and <b>does not contain the branch</b>. What makes sure only <code>main</code> gets there is the environment’s <b>Deployment branches</b> rule, together with <b>Required reviewers</b>. Without these rules, any branch whose workflow declares that environment gets the production role.</>} /></li>
          <li><T pt={<><em>Quem pode editar workflows e environments.</em> Quem consegue alterar o workflow ou as regras do environment controla o que a role faz. Em produção: <code>CODEOWNERS</code> sobre <code>.github/workflows/</code>, proteção de branch em <code>main</code>, e poucos administradores no repositório.</>} en={<><em>Who can edit workflows and environments.</em> Whoever can change the workflow or the environment rules controls what the role does. In production: <code>CODEOWNERS</code> on <code>.github/workflows/</code>, branch protection on <code>main</code>, and few repository admins.</>} /></li>
          <li><T pt={<><em>Restringir por workflow.</em> Como a AWS só lê <code>sub</code> e <code>aud</code>, o jeito de amarrar a role a um arquivo de workflow (por exemplo um workflow reutilizável central) é pedir ao GitHub que inclua <code>job_workflow_ref</code> no formato do <code>sub</code>, pela customização do assunto do OIDC (API do repositório ou da organização). Depois a trust policy compara o <code>sub</code> novo. Confira na documentação do GitHub o formato exato antes, e lembre que mudar o <code>sub</code> quebra as trust policies existentes.</>} en={<><em>Restricting by workflow.</em> Since AWS only reads <code>sub</code> and <code>aud</code>, the way to tie a role to a workflow file (for example a central reusable workflow) is to ask GitHub to include <code>job_workflow_ref</code> in the <code>sub</code> format, through the OIDC subject customization (repository or organization API). The trust policy then compares the new <code>sub</code>. Check GitHub’s docs for the exact format first, and remember that changing <code>sub</code> breaks existing trust policies.</>} /></li>
          <li><T pt={<><em>Permissões mínimas e nada de chaves.</em> A política da etapa 2 já usa ARNs específicos onde a ação permite. Em produção, revise com o IAM Access Analyzer e considere uma SCP na Organization negando <code>iam:CreateAccessKey</code> e <code>iam:CreateUser</code> na conta de produção, para que ninguém reintroduza chaves de longa duração. <i>(Prática comum, não está no artigo.)</i></>} en={<><em>Least privilege and no keys.</em> The policy in step 2 already uses specific ARNs where the action allows it. In production, review it with IAM Access Analyzer and consider an SCP in the Organization denying <code>iam:CreateAccessKey</code> and <code>iam:CreateUser</code> in the production account, so nobody reintroduces long-lived keys. <i>(Common practice, not in the article.)</i></>} /></li>
          <li><T pt={<><em>Auditoria.</em> Cada troca de token vira um evento <code>AssumeRoleWithWebIdentity</code> no CloudTrail, com o <code>sub</code> e a role. Use <code>role-session-name</code> com o número da execução para ligar a sessão ao run do GitHub, e crie um alerta (EventBridge ou CloudWatch) para trocas de produção fora do horário esperado ou com <code>sub</code> inesperado.</>} en={<><em>Auditing.</em> Every token exchange becomes an <code>AssumeRoleWithWebIdentity</code> event in CloudTrail, with the <code>sub</code> and the role. Use <code>role-session-name</code> with the run number to link the session to the GitHub run, and add an alert (EventBridge or CloudWatch) for production exchanges outside expected hours or with an unexpected <code>sub</code>.</>} /></li>
          <li><T pt={<><em>Dependências do pipeline.</em> O token só vale para quem roda dentro do job, então uma action de terceiros comprometida enxerga a role. Fixe actions por SHA do commit (não por tag móvel), mantenha poucas e atualize com revisão (Dependabot). <i>(Prática comum, não está no artigo.)</i></>} en={<><em>Pipeline dependencies.</em> The token works for whoever runs inside the job, so a compromised third-party action sees the role. Pin actions to a commit SHA (not a moving tag), keep few of them and update with review (Dependabot). <i>(Common practice, not in the article.)</i></>} /></li>
          <li><T pt={<><em>Recuperação.</em> Se a role for abusada, você pode negar novas sessões e revogar as ativas pelo console do IAM (“Revoke active sessions”) e depois corrigir a trust policy. Como não há chave, não há o que rotacionar.</>} en={<><em>Recovery.</em> If the role is abused, you can deny new sessions and revoke active ones from the IAM console (“Revoke active sessions”) and then fix the trust policy. Since there is no key, there is nothing to rotate.</>} /></li>
        </ul>
        <p><T pt="Exemplo em Terraform do provedor e da role de produção (adapte nomes e ARNs; em versões recentes do provider AWS os thumbprints são opcionais, confira a sua):" en="Terraform example of the provider and the production role (adapt names and ARNs; in recent AWS provider versions thumbprints are optional, check yours):" /></p>
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
        <Callout tone="personal" icon="alert"><T pt={<><strong>Nota pessoal, não verificada nas fontes:</strong> o exemplo em Terraform e as práticas marcadas como “comuns” (SCP, alertas, fixar actions por SHA) vêm de prática geral, não do artigo da AWS. O artigo cobre o provedor, a trust policy com <code>aud</code> e <code>sub</code>, permissões mínimas, um provedor por IdP e auditoria com CloudTrail.</>} en={<><strong>Personal note, not verified in the sources:</strong> the Terraform example and the practices marked as “common” (SCP, alerts, pinning actions by SHA) come from general practice, not from the AWS article. The article covers the provider, the trust policy with <code>aud</code> and <code>sub</code>, least privilege, one provider per IdP and auditing with CloudTrail.</>} /></Callout>
      </Section>
      <Section id="checks" title={<T pt="Voltar atrás e problemas comuns" en="Rolling back and common problems" />}>
        <h3><T pt="Voltar para uma versão anterior" en="Going back to an earlier version" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Automático.</em> Com o circuit breaker e rollback ativos, uma versão que não sobe é desfeita pelo ECS.</>} en={<><em>Automatic.</em> With the circuit breaker and rollback on, a version that does not start is undone by ECS.</>} /></li>
          <li><T pt={<><em>Manual.</em> Reverta o commit na branch (<code>git revert</code>) e faça o push, ou use <b>Re-run jobs</b> numa execução antiga que deu certo. Como as tags são imutáveis e únicas por commit, a imagem antiga ainda está no ECR e o workflow a reaproveita.</>} en={<><em>Manual.</em> Revert the commit on the branch (<code>git revert</code>) and push, or use <b>Re-run jobs</b> on an old successful run. Since tags are immutable and unique per commit, the old image is still in ECR and the workflow reuses it.</>} /></li>
        </ul>
        <h3><T pt="Problemas do build e do deploy" en="Common problems" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>“tag invalid: The image tag ... already exists” no push.</em> O repositório tem tags imutáveis e a tag já existe. A checagem do workflow evita isso; se aparecer, confira se <code>ecr:DescribeImages</code> está na política (sem ela a checagem falha e o workflow tenta construir de novo).</>} en={<><em>“tag invalid: The image tag ... already exists” on push.</em> The repository has immutable tags and the tag already exists. The workflow check avoids it; if it appears, check that <code>ecr:DescribeImages</code> is in the policy (without it the check fails and the workflow tries to build again).</>} /></li>
          <li><T pt={<><em>A task nova não sobe: <code>CannotPullContainerError</code>.</em> A task execution role não pode baixar do ECR, ou a task está numa sub-rede privada sem caminho até o ECR (NAT ou VPC endpoints). Confira também se a imagem existe com aquela tag.</>} en={<><em>The new task does not start: <code>CannotPullContainerError</code>.</em> The task execution role cannot pull from ECR, or the task is in a private subnet with no path to ECR (NAT or VPC endpoints). Also check that the image exists with that tag.</>} /></li>
          <li><T pt={<><em>O deploy fica parado e o serviço registra “unable to stop or start tasks”.</em> Os percentuais do serviço não deixam o scheduler iniciar nem parar nenhuma task (por exemplo 100/100 com 1 task). Ajuste <code>minimumHealthyPercent</code> ou <code>maximumPercent</code>.</>} en={<><em>The deploy stalls and the service logs “unable to stop or start tasks”.</em> The service percentages do not let the scheduler start or stop any task (for example 100/100 with 1 task). Adjust <code>minimumHealthyPercent</code> or <code>maximumPercent</code>.</>} /></li>
          <li><T pt={<><em>A aplicação em dev usa a URL de prod (ou o contrário).</em> Confira as variáveis do environment e o ARN em <code>AWS_ROLE_ARN</code>: o ID da conta no ARN decide o destino. ARNs trocados entre os dois environments é o erro mais caro desta configuração.</>} en={<><em>The application in dev uses the prod URL (or the reverse).</em> Check the environment variables and the ARN in <code>AWS_ROLE_ARN</code>: the account ID in the ARN decides the destination. Swapped ARNs between the two environments is the costliest mistake in this setup.</>} /></li>
          <li><T pt={<><em>Mudei uma variável e o deploy continua com o valor antigo.</em> Reexecutar o mesmo commit reaproveita a imagem. Faça um commit novo (pode ser vazio: <code>git commit --allow-empty</code>).</>} en={<><em>I changed a variable and the deploy still has the old value.</em> Re-running the same commit reuses the image. Make a new commit (it can be empty: <code>git commit --allow-empty</code>).</>} /></li>
          <li><T pt={<><em>O segredo mudou e a app não viu.</em> O ECS lê o segredo quando o container inicia. Faça um novo deploy ou “Force new deployment” no serviço.</>} en={<><em>The secret changed and the app did not see it.</em> ECS reads the secret when the container starts. Run a new deploy or “Force new deployment” on the service.</>} /></li>
        </ul>
        <h3><T pt="OIDC, roles e permissões" en="OIDC, roles and permissions" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>“Credentials could not be loaded” ou “Could not assume role”.</em> Falta <code>permissions: id-token: write</code> no workflow ou o <code>AWS_ROLE_ARN</code> está vazio: confira se o job usa o environment que contém a variável (variáveis de environment só existem para jobs que o declaram).</>} en={<><em>“Credentials could not be loaded” or “Could not assume role”.</em> The workflow lacks <code>permissions: id-token: write</code> or <code>AWS_ROLE_ARN</code> is empty: check that the job uses the environment that holds the variable (environment variables exist only for jobs that declare it).</>} /></li>
          <li><T pt={<><em>Deploy de dev caiu na conta errada.</em> Confira o ARN em <code>AWS_ROLE_ARN</code> de cada environment: o ID da conta no ARN é o que decide o destino. Os dois environments com ARNs trocados é o erro mais caro desta configuração.</>} en={<><em>A dev deploy landed in the wrong account.</em> Check the ARN in each environment’s <code>AWS_ROLE_ARN</code>: the account ID in the ARN decides the destination. Swapped ARNs between the two environments is the costliest mistake in this setup.</>} /></li>
          <li><T pt={<><em>AccessDenied em <code>iam:PassRole</code> ou <code>ecs:RegisterTaskDefinition</code>.</em> A política da role de deploy não cobre os ARNs das roles de task da <b>mesma conta</b> (os ARNs têm o ID da conta).</>} en={<><em>AccessDenied on <code>iam:PassRole</code> or <code>ecs:RegisterTaskDefinition</code>.</em> The deploy role’s policy does not cover the task role ARNs of the <b>same account</b> (the ARNs contain the account ID).</>} /></li>
          <li><T pt={<><em>A task não sobe com “ResourceInitializationError ... unable to pull secrets”.</em> A task execution role não tem <code>secretsmanager:GetSecretValue</code> sobre o segredo (ou o ARN no <code>valueFrom</code> está errado). Não é a role de deploy que precisa dessa permissão.</>} en={<><em>The task fails with “ResourceInitializationError ... unable to pull secrets”.</em> The task execution role lacks <code>secretsmanager:GetSecretValue</code> on the secret (or the ARN in <code>valueFrom</code> is wrong). It is not the deploy role that needs this permission.</>} /></li>
          <li><T pt={<><em>“Not authorized to perform sts:AssumeRoleWithWebIdentity”.</em> O <code>sub</code> da trust policy não bate com o do token: confira se o job referencia o environment, o nome exato dele e o formato imutável.</>} en={<><em>“Not authorized to perform sts:AssumeRoleWithWebIdentity”.</em> The trust policy’s <code>sub</code> does not match the token’s: check that the job references the environment, its exact name, and the immutable format.</>} /></li>
          <li><T pt={<><em>Nunca</em> use só curinga no <code>sub</code>. O IAM rejeita uma trust policy do GitHub sem a condição, ou com valor que seja só <code>*</code>.</>} en={<><em>Never</em> use only a wildcard in <code>sub</code>. IAM rejects a GitHub trust policy without the condition, or whose value is only <code>*</code>.</>} /></li>
          <li><T pt={<>Evite <code>ForAllValues:</code> em statements <code>Allow</code>: pode liberar acesso quando a claim está ausente ou escrita errada. Use <code>StringEquals</code> ou <code>StringLike</code>.</>} en={<>Avoid <code>ForAllValues:</code> in <code>Allow</code> statements: it can grant access when a claim is absent or misspelled. Use <code>StringEquals</code> or <code>StringLike</code>.</>} /></li>
          <li><T pt={<>Cuidado com gatilhos <code>pull_request_target</code>. Jobs do Dependabot têm <code>event_name</code> igual a <code>dynamic</code>; se a trust policy deve valer só para Actions, restrinja os eventos esperados.</>} en={<>Be careful with <code>pull_request_target</code> triggers. Dependabot jobs have <code>event_name</code> set to <code>dynamic</code>; if the trust policy should cover only Actions, restrict the expected events.</>} /></li>
          <li><T pt={<>A AWS não suporta claims OIDC personalizadas; o GitHub permite personalizar o formato do <code>sub</code>, mas crie antes a condição correspondente na AWS.</>} en={<>AWS does not support custom OIDC claims; GitHub lets you customise the <code>sub</code> format, but create the matching condition in AWS first.</>} /></li>
          <li><T pt={<>A sessão dura 1 hora por padrão (<code>role-duration-seconds</code>, de 15 min a 12 h). Deploys longos precisam de uma duração maior.</>} en={<>The session lasts 1 hour by default (<code>role-duration-seconds</code>, from 15 min to 12 h). Long deploys need a longer duration.</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Nota pessoal, não verificada nas fontes:</strong> esta combinação (OIDC, build com variáveis por environment, ECR com tags imutáveis e troca no ECS) não aparece num único exemplo oficial; ela junta as páginas listadas abaixo. Os comandos <code>aws ecr create-repository</code> e <code>aws ecs update-service</code> foram escritos pela referência da CLI e não foram executados aqui: confira os parâmetros com <code>--help</code> na sua versão.</>} en={<><strong>Personal note, not verified in the sources:</strong> this combination (OIDC, build with per-environment variables, ECR with immutable tags and an ECS swap) does not appear in a single official example; it joins the pages listed below. The <code>aws ecr create-repository</code> and <code>aws ecs update-service</code> commands were written from the CLI reference and were not run here: check the parameters with <code>--help</code> on your version.</>} /></Callout>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Nota pessoal, não verificada nas fontes:</strong> o exemplo do GitHub para ECS usa chaves de acesso em secrets. A troca delas por OIDC (esta página) segue a documentação de OIDC do GitHub e das actions da AWS, mas a combinação completa não aparece num único exemplo oficial.</>} en={<><strong>Personal note, not verified in the sources:</strong> GitHub’s own ECS example uses access keys in secrets. Replacing them with OIDC (this page) follows the GitHub and AWS-action OIDC docs, but the full combination does not appear in a single official example.</>} /></Callout>
        <Sources title={<T pt="Fontes oficiais · AWS verificada em 2026-10-26; Docker em 2026-10-24; GitHub em 2026-10-21" en="Official sources · AWS verified on 2026-10-26; Docker on 2026-10-24; GitHub on 2026-10-21" />}>
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
