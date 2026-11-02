import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "terraform",
  title: { en: "Terraform 80/20", pt: "Terraform 80/20" },
  seo: {
    title: { en: "Terraform 80/20, general and AWS", pt: "Terraform 80/20, geral e AWS" },
    description: { en: "The 20% of Terraform that covers 80% of the work: workflow, HCL, state, modules, CI, and a complete AWS walkthrough with remote state on S3, VPC, EC2, IAM and S3.", pt: "Os 20% do Terraform que cobrem 80% do trabalho: fluxo, HCL, estado, módulos, CI e um passo a passo completo na AWS com estado remoto no S3, VPC, EC2, IAM e S3." },
  },
  summary: "the 20% of Terraform that covers 80% of the work (workflow, HCL, state, modules, CI) plus a complete AWS walkthrough (remote state on S3, VPC, EC2, IAM, S3).",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Terraform, <em>the 80/20.</em></>, pt: <>Terraform, <em>o 80/20.</em></> },
  heroLede: { en: "The part of Terraform you will use every day, explained step by step and then applied to AWS: remote state, VPC, EC2, IAM and S3.", pt: "A parte do Terraform que você vai usar todo dia, explicada passo a passo e depois aplicada à AWS: estado remoto, VPC, EC2, IAM e S3." },
  published: "2026-10-18",
  updated: "2026-10-23",
  toc: [
    {
      label: <T pt="Parte 1 · Geral" en="Part 1 · General" />,
      items: [
        { id: "why", title: <T pt="O que é e o 20% que importa" en="What it is and the 20% that matters" /> },
        { id: "start", title: <T pt="Instalar e rodar o primeiro projeto" en="Install and run your first project" /> },
        { id: "hcl", title: <T pt="A linguagem HCL" en="The HCL language" /> },
        { id: "flow", title: <T pt="O fluxo e os comandos" en="The workflow and commands" /> },
        { id: "state", title: <T pt="Estado, backend e drift" en="State, backend and drift" /> },
        { id: "vars", title: <T pt="Variáveis, locals e outputs" en="Variables, locals and outputs" /> },
        { id: "scale", title: <T pt="Dependências, repetição e lifecycle" en="Dependencies, repetition and lifecycle" /> },
        { id: "modules", title: <T pt="Módulos e ambientes" en="Modules and environments" /> },
        { id: "team", title: <T pt="Times, CI e boas práticas" en="Teams, CI and best practices" /> },
      ],
    },
    {
      label: <T pt="Parte 2 · AWS" en="Part 2 · AWS" />,
      items: [
        { id: "aws-auth", title: <T pt="AWS: provider e credenciais" en="AWS: provider and credentials" /> },
        { id: "aws-state", title: <T pt="AWS: estado remoto no S3" en="AWS: remote state on S3" /> },
        { id: "aws-stack", title: <T pt="AWS: VPC, EC2 e S3 passo a passo" en="AWS: VPC, EC2 and S3 step by step" /> },
        { id: "aws-ops", title: <T pt="AWS: padrões, erros e roteiro" en="AWS: patterns, errors and roadmap" /> },
        { id: "cheat", title: <T pt="Cola e perguntas de revisão" en="Cheat sheet and review questions" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="why" title={<T pt="O que é e o 20% que importa" en="What it is and the 20% that matters" />}>
        <p><T pt={<>Terraform é uma ferramenta de <em>infraestrutura como código</em> (IaC): em vez de clicar no console da nuvem, você <em>descreve</em> em arquivos de texto o que quer que exista (redes, servidores, buckets, permissões) e o Terraform descobre o que precisa criar, alterar ou apagar para a realidade ficar igual à descrição. A linguagem é a HCL, e o trabalho é feito por <em>providers</em> (plugins) que falam com a API de cada serviço: AWS, Azure, Google Cloud, Cloudflare, GitHub, Kubernetes e milhares de outros.</>} en={<>Terraform is an <em>infrastructure as code</em> (IaC) tool: instead of clicking in the cloud console, you <em>describe</em> in text files what should exist (networks, servers, buckets, permissions) and Terraform works out what to create, change or delete so reality matches the description. The language is HCL, and the work is done by <em>providers</em> (plugins) that talk to each service’s API: AWS, Azure, Google Cloud, Cloudflare, GitHub, Kubernetes and thousands more.</>} /></p>
        <p><T pt={<>A ideia central é ser <em>declarativo</em>: você diz o <em>destino</em> (“quero 2 subnets e 1 bucket”), não os passos. É como a planta de uma casa: o Terraform compara a planta com a obra e só executa a diferença. Rodar de novo sem mudar nada não faz nada (<em>idempotência</em>).</>} en={<>The core idea is being <em>declarative</em>: you state the <em>destination</em> (“I want 2 subnets and 1 bucket”), not the steps. It is like a house blueprint: Terraform compares the blueprint with the building and only carries out the difference. Running it again with no changes does nothing (<em>idempotence</em>).</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>O ciclo do Terraform. O <code>plan</code> é o seu ponto de segurança: leia-o antes de aplicar.</>} en={<>The Terraform cycle. <code>plan</code> is your safety checkpoint: read it before applying.</>} />}>
          <svg viewBox="0 0 660 236" role="img" aria-label="Ciclo do Terraform / Terraform cycle">
            <rect x="10" y="10" width="110" height="56" rx="4" className="ln fillsoft" />
            <text x="65" y="35" className="pt" textAnchor="middle">Código</text>
            <text x="65" y="35" className="en" textAnchor="middle">Code</text>
            <text x="65" y="53" className="mut mono" textAnchor="middle">*.tf</text>
            <rect x="170" y="20" width="100" height="36" rx="4" className="ln" />
            <text x="220" y="43" className="mono" textAnchor="middle">init</text>
            <rect x="320" y="20" width="100" height="36" rx="4" className="ln brandfill" />
            <text x="370" y="43" className="mono" textAnchor="middle">plan</text>
            <rect x="470" y="20" width="100" height="36" rx="4" className="ln" />
            <text x="520" y="43" className="mono" textAnchor="middle">apply</text>
            <path d="M120 38L170 38" className="ln" />
            <path d="M163.2 34.7L170 38L163.2 41.3" className="ln" />
            <path d="M270 38L320 38" className="ln" />
            <path d="M313.2 34.7L320 38L313.2 41.3" className="ln" />
            <path d="M420 38L470 38" className="ln" />
            <path d="M463.2 34.7L470 38L463.2 41.3" className="ln" />
            <rect x="285" y="110" width="170" height="56" rx="4" className="ln fillsoft" />
            <text x="370" y="135" className="pt" textAnchor="middle">Estado</text>
            <text x="370" y="135" className="en" textAnchor="middle">State</text>
            <text x="370" y="153" className="mut mono" textAnchor="middle">terraform.tfstate</text>
            <rect x="500" y="110" width="140" height="56" rx="4" className="ln fillsoft" />
            <text x="570" y="135" className="pt" textAnchor="middle">Nuvem</text>
            <text x="570" y="135" className="en" textAnchor="middle">Cloud</text>
            <text x="570" y="153" className="pt mut mono" textAnchor="middle">API do provider</text>
            <text x="570" y="153" className="en mut mono" textAnchor="middle">provider API</text>
            <path d="M370 56L370 110" className="ln" />
            <path d="M373.3 103.2L370 110L366.7 103.2" className="ln" />
            <path d="M520 56L570 110" className="ln" />
            <path d="M567.8 102.8L570 110L563.0 107.3" className="ln" />
            <path d="M500 138L455 138" className="ln" />
            <path d="M461.8 141.3L455 138L461.8 134.7" className="ln" />
            <text x="10" y="200" className="pt mut" textAnchor="start">init baixa providers e módulos · plan mostra a diferença sem alterar nada.</text>
            <text x="10" y="200" className="en mut" textAnchor="start">init downloads providers and modules · plan shows the difference without changing anything.</text>
            <text x="10" y="220" className="pt mut" textAnchor="start">apply executa as ações na nuvem e grava o novo estado.</text>
            <text x="10" y="220" className="en mut" textAnchor="start">apply carries out the actions in the cloud and records the new state.</text>
          </svg>
        </Diagram>
        <h3><T pt="Terraform, OpenTofu, CloudFormation e Pulumi" en="Terraform, OpenTofu, CloudFormation and Pulumi" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Linguagem" en="Language" />, <T pt="Alcance" en="Scope" />, <T pt="Quando escolher" en="When to choose" />]}
          rows={[
            [<><strong>Terraform</strong> (HashiCorp)</>, "HCL", <T pt="qualquer nuvem e serviço com provider" en="any cloud and service with a provider" />, <T pt="padrão de mercado, enorme ecossistema; licença BSL desde 2023" en="market standard, huge ecosystem; BSL license since 2023" />],
            [<strong>OpenTofu</strong>, "HCL", <T pt="igual ao Terraform (fork da Linux Foundation, licença MPL)" en="same as Terraform (Linux Foundation fork, MPL license)" />, <T pt={<>você precisa de licença aberta; os comandos são quase iguais (<code>tofu</code>)</>} en={<>you need an open license; commands are nearly identical (<code>tofu</code>)</>} />],
            [<strong>CloudFormation</strong>, "YAML/JSON", <T pt="só AWS" en="AWS only" />, <T pt="tudo na AWS e você quer o estado gerenciado pela própria AWS" en="all-in on AWS and you want AWS-managed state" />],
            [<strong>Pulumi</strong>, "TypeScript, Python, Go…", <T pt="multi-nuvem" en="multi-cloud" />, <T pt="o time prefere linguagem de programação geral a uma DSL" en="the team prefers a general-purpose language to a DSL" />],
          ]}
        />
        <p><T pt={<>Tudo que você aprende aqui vale para o OpenTofu também; só troque <code>terraform</code> por <code>tofu</code> no terminal.</>} en={<>Everything you learn here also applies to OpenTofu; just swap <code>terraform</code> for <code>tofu</code> in the terminal.</>} /></p>
        <h3><T pt="O 20% que rende 80%" en="The 20% that pays 80%" /></h3>
        <Table
          head={[<T pt="#" en="#" />, <T pt="Conceito" en="Concept" />, <T pt="Por que importa" en="Why it matters" />]}
          rows={[
            ["1", <T pt={<>Ciclo <code>init → plan → apply</code></>} en={<>The <code>init → plan → apply</code> cycle</>} />, <T pt="é 90% do uso diário" en="it is 90% of daily use" />],
            ["2", <T pt={<>Blocos <code>resource</code> e <code>data</code></>} en={<><code>resource</code> and <code>data</code> blocks</>} />, <T pt="criar vs. apenas ler o que já existe" en="create vs. just reading what already exists" />],
            ["3", <T pt="Referências entre recursos" en="References between resources" />, <T pt="geram o grafo de dependências automaticamente" en="build the dependency graph automatically" />],
            ["4", <T pt={<><code>variable</code>, <code>locals</code>, <code>output</code></>} en={<><code>variable</code>, <code>locals</code>, <code>output</code></>} />, <T pt="entrada, valores internos e saída do módulo" en="input, internal values and module output" />],
            ["5", <T pt="Estado (state) e backend remoto" en="State and remote backend" />, <T pt="é a “memória” do Terraform; perder o estado é o maior risco" en="it is Terraform’s “memory”; losing state is the biggest risk" />],
            ["6", <T pt={<><code>count</code>, <code>for_each</code> e expressões <code>for</code></>} en={<><code>count</code>, <code>for_each</code> and <code>for</code> expressions</>} />, <T pt="evitam copiar e colar blocos" en="avoid copy-pasting blocks" />],
            ["7", <T pt="Módulos" en="Modules" />, <T pt="reuso e organização" en="reuse and organisation" />],
            ["8", <T pt={<><code>lifecycle</code> e <code>moved</code>/<code>import</code></>} en={<><code>lifecycle</code> and <code>moved</code>/<code>import</code></>} />, <T pt="refatorar e adotar recursos existentes sem destruir nada" en="refactor and adopt existing resources without destroying anything" />],
            ["9", <T pt={<>Trava de versões e <code>.terraform.lock.hcl</code></>} en={<>Version pinning and <code>.terraform.lock.hcl</code></>} />, <T pt="builds reprodutíveis" en="reproducible builds" />],
            ["10", <T pt={<>CI com <code>fmt</code>, <code>validate</code>, <code>plan</code></>} en={<>CI with <code>fmt</code>, <code>validate</code>, <code>plan</code></>} />, <T pt="ninguém aplica da máquina pessoal em produção" en="nobody applies from a personal machine in production" />],
          ]}
        />
      </Section>
      <Section id="start" title={<T pt="Instalar e rodar o primeiro projeto" en="Install and run your first project" />}>
        <p><T pt={<>Vamos rodar o ciclo completo sem nuvem nenhuma, usando o provider <code>local</code>, que só cria arquivos. Assim você vê o que o Terraform faz antes de gastar um centavo.</>} en={<>Let us run the full cycle with no cloud at all, using the <code>local</code> provider, which only creates files. That way you see what Terraform does before spending a cent.</>} /></p>
        <h3><T pt="Instalar" en="Install" /></h3>
        <CodeBlock>
          <span className="tok-c"># Linux (Debian/Ubuntu): repositório oficial da HashiCorp</span>{"\n"}
          {"wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg\n"}
          {"echo "}<span className="tok-s">"deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main"</span>{" | sudo tee /etc/apt/sources.list.d/hashicorp.list\n"}
          {"sudo apt update && sudo apt install terraform\n"}
          {"\n"}
          <span className="tok-c"># macOS</span>{"\n"}
          {"brew tap hashicorp/tap && brew install hashicorp/tap/terraform\n"}
          {"\n"}
          {"terraform version\n"}
          {"terraform -install-autocomplete    "}<span className="tok-c"># completa comandos com Tab (reabra o terminal)</span>
        </CodeBlock>
        <Callout icon="check"><T pt={<>Para trocar de versão por projeto, use um gerenciador como <code>tfenv</code> ou <code>mise</code>. As instruções oficiais mais recentes estão na página de instalação da HashiCorp.</>} en={<>To switch versions per project, use a manager such as <code>tfenv</code> or <code>mise</code>. The latest official instructions are on HashiCorp’s install page.</>} /></Callout>
        <h3><T pt="Primeiro projeto" en="First project" /></h3>
        <CodeBlock>
          <span className="tok-c"># main.tf</span>{"\n"}
          <span className="tok-k">terraform</span>{" {\n"}
          {"  "}<span className="tok-a">required_version</span>{" = "}<span className="tok-s">"&gt;= 1.10"</span>{"\n"}
          {"  "}<span className="tok-k">required_providers</span>{" {\n"}
          {"    "}<span className="tok-a">local</span>{" = {\n"}
          {"      "}<span className="tok-a">source</span>{"  = "}<span className="tok-s">"hashicorp/local"</span>{"\n"}
          {"      "}<span className="tok-a">version</span>{" = "}<span className="tok-s">"~&gt; 2.5"</span>{"\n"}
          {"    }\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"name"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"    = string\n"}
          {"  "}<span className="tok-a">default</span>{" = "}<span className="tok-s">"world"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"local_file"</span>{" "}<span className="tok-s">"greeting"</span>{" {\n"}
          {"  "}<span className="tok-a">filename</span>{" = "}<span className="tok-s">"$&#123;path.module&#125;/hello.txt"</span>{"\n"}
          {"  "}<span className="tok-a">content</span>{"  = "}<span className="tok-s">"Hello, $&#123;var.name&#125;!\n"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"file_path"</span>{" {\n"}
          {"  "}<span className="tok-a">value</span>{" = local_file.greeting.filename\n"}
          {"}"}
        </CodeBlock>
        <CodeBlock>
          {"terraform init       "}<span className="tok-c"># baixa o provider e cria .terraform/ e .terraform.lock.hcl</span>{"\n"}
          {"terraform fmt        "}<span className="tok-c"># formata o código no padrão oficial</span>{"\n"}
          {"terraform validate   "}<span className="tok-c"># confere sintaxe e referências</span>{"\n"}
          {"terraform plan       "}<span className="tok-c"># mostra o que vai acontecer</span>{"\n"}
          {"terraform apply      "}<span className="tok-c"># pede "yes" e executa</span>{"\n"}
          {"cat hello.txt        "}<span className="tok-c"># Hello, world!</span>{"\n"}
          {"terraform apply -var name=Ana   "}<span className="tok-c"># muda uma variável e aplica de novo</span>{"\n"}
          {"terraform destroy    "}<span className="tok-c"># apaga tudo o que ele criou</span>
        </CodeBlock>
        <p><T pt={<>O <code>plan</code> usa quatro símbolos. Aprenda a ler:</>} en={<>The <code>plan</code> uses four symbols. Learn to read them:</>} /></p>
        <Table
          head={[<T pt="Símbolo" en="Symbol" />, <T pt="Significa" en="Means" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<code>+</code>, <T pt="será criado" en="will be created" />, <T pt={<><code>+ resource "local_file" "greeting"</code></>} en={<><code>+ resource "local_file" "greeting"</code></>} />],
            [<code>~</code>, <T pt="será alterado no lugar" en="will be updated in place" />, <T pt="mudar uma tag" en="changing a tag" />],
            [<code>-/+</code>, <T pt={<>será <em>destruído e recriado</em> (atenção!)</>} en={<>will be <em>destroyed and recreated</em> (careful!)</>} />, <T pt={<>mudar o conteúdo de um <code>local_file</code>; mudar a AMI de uma EC2</>} en={<>changing a <code>local_file</code> content; changing an EC2 AMI</>} />],
            [<code>-</code>, <T pt="será destruído" en="will be destroyed" />, <T pt="removeu o bloco do código" en="you removed the block from the code" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Procure <code>-/+</code> e <code>-</code> no plan antes de confirmar. Em recurso com dados (banco, disco, bucket), “recriar” significa <em>perder os dados</em>. O resumo no fim (<code>Plan: 1 to add, 0 to change, 1 to destroy</code>) é a primeira coisa a ler.</>} en={<>Look for <code>-/+</code> and <code>-</code> in the plan before confirming. On resources that hold data (database, disk, bucket), “recreate” means <em>losing the data</em>. The summary at the end (<code>Plan: 1 to add, 0 to change, 1 to destroy</code>) is the first thing to read.</>} /></Callout>
        <h3><T pt="O que fica na pasta" en="What ends up in the folder" /></h3>
        <Table
          head={[<T pt="Arquivo/pasta" en="File/folder" />, <T pt="É o quê" en="What it is" />, <T pt="Git?" en="Git?" />]}
          rows={[
            [<code>*.tf</code>, <T pt="seu código" en="your code" />, <T pt="sim" en="yes" />],
            [<code>.terraform.lock.hcl</code>, <T pt="versões exatas dos providers (hashes)" en="exact provider versions (hashes)" />, <T pt={<><strong>sim</strong></>} en={<><strong>yes</strong></>} />],
            [<code>.terraform/</code>, <T pt="providers e módulos baixados" en="downloaded providers and modules" />, <T pt="não" en="no" />],
            [<code>terraform.tfstate</code>, <T pt="o estado local (pode ter segredos)" en="the local state (may hold secrets)" />, <T pt={<><strong>nunca</strong></>} en={<><strong>never</strong></>} />],
            [<code>*.tfvars</code>, <T pt="valores das variáveis (podem ter segredos)" en="variable values (may hold secrets)" />, <T pt="só os sem segredo" en="only secret-free ones" />],
          ]}
        />
        <CodeBlock>
          <span className="tok-c"># .gitignore para Terraform</span>{"\n"}
          {".terraform/\n"}
          {"*.tfstate\n"}
          {"*.tfstate.*\n"}
          {"crash.log\n"}
          {"*.tfplan\n"}
          {"override.tf\n"}
          {"override.tf.json\n"}
          <span className="tok-c"># valores com segredos: use um nome próprio e ignore-o aqui</span>{"\n"}
          {"*.auto.tfvars"}
        </CodeBlock>
      </Section>
      <Section id="hcl" title={<T pt="A linguagem HCL" en="The HCL language" />}>
        <p><T pt={<>HCL (HashiCorp Configuration Language) tem só duas peças: <em>blocos</em> e <em>argumentos</em>. Um bloco tem um tipo, zero ou mais rótulos e um corpo entre chaves; o corpo tem argumentos (<code>nome = valor</code>) e outros blocos.</>} en={<>HCL (HashiCorp Configuration Language) has only two pieces: <em>blocks</em> and <em>arguments</em>. A block has a type, zero or more labels and a body in braces; the body holds arguments (<code>name = value</code>) and other blocks.</>} /></p>
        <CodeBlock>
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_s3_bucket"</span>{" "}<span className="tok-s">"logs"</span>{" {   "}<span className="tok-c"># tipo do bloco, tipo do recurso, nome local</span>{"\n"}
          {"  "}<span className="tok-a">bucket</span>{" = "}<span className="tok-s">"acme-logs-prod"</span>{"         "}<span className="tok-c"># argumento</span>{"\n"}
          {"  "}<span className="tok-a">tags</span>{" = {                          "}<span className="tok-c"># argumento cujo valor é um mapa</span>{"\n"}
          {"    "}<span className="tok-a">Team</span>{" = "}<span className="tok-s">"platform"</span>{"\n"}
          {"  }\n"}
          {"  "}<span className="tok-k">lifecycle</span>{" {                       "}<span className="tok-c"># bloco aninhado</span>{"\n"}
          {"    "}<span className="tok-a">prevent_destroy</span>{" = true\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <Table
          head={[<T pt="Bloco" en="Block" />, <T pt="Para quê" en="What for" />, <T pt="Exemplo de uso" en="Usage example" />]}
          rows={[
            [<code>terraform</code>, <T pt="versão do Terraform, providers e backend" en="Terraform version, providers and backend" />, <code>required_version</code>],
            [<code>provider</code>, <T pt="configura um provider (região, credenciais)" en="configures a provider (region, credentials)" />, <code>provider "aws" &#123; region = … &#125;</code>],
            [<code>resource</code>, <T pt="algo que o Terraform cria e gerencia" en="something Terraform creates and manages" />, <code>aws_instance.web</code>],
            [<code>data</code>, <T pt="lê algo que já existe, sem gerenciar" en="reads something that already exists, without managing it" />, <code>data.aws_caller_identity.current</code>],
            [<code>variable</code>, <T pt="entrada configurável" en="configurable input" />, <code>var.region</code>],
            [<code>locals</code>, <T pt="valores calculados reutilizáveis" en="reusable computed values" />, <code>local.tags</code>],
            [<code>output</code>, <T pt="valor exposto no fim ou para outro módulo" en="value exposed at the end or to another module" />, <code>terraform output ip</code>],
            [<code>module</code>, <T pt="usa um conjunto de código empacotado" en="uses a packaged set of code" />, <code>module.vpc.vpc_id</code>],
            [<><code>moved</code> · <code>import</code> · <code>removed</code></>, <T pt="refatorar e adotar/soltar recursos" en="refactor and adopt/release resources" />, <T pt="veja “Estado”" en="see “State”" />],
            [<code>check</code>, <T pt="verificações que avisam sem bloquear" en="checks that warn without blocking" />, <T pt="“o site responde 200?”" en="“does the site answer 200?”" />],
          ]}
        />
        <h3><T pt="Tipos, referências e expressões" en="Types, references and expressions" /></h3>
        <CodeBlock>
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"region"</span>{"   { type = string }                     "}<span className="tok-c"># "sa-east-1"</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"count_n"</span>{"  { type = number }                     "}<span className="tok-c"># 3</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"enabled"</span>{"  { type = bool }                       "}<span className="tok-c"># true</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"azs"</span>{"      { type = list(string) }               "}<span className="tok-c"># ["a", "b"] (ordenada)</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"cidrs"</span>{"    { type = set(string) }                "}<span className="tok-c"># sem ordem e sem repetição</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"tags"</span>{"     { type = map(string) }                "}<span className="tok-c"># &#123; Team = "x" &#125;</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"disk"</span>{"     {\n"}
          {"  "}<span className="tok-a">type</span>{" = object({ size = number, encrypted = bool })      "}<span className="tok-c"># estrutura fixa</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">locals</span>{" {\n"}
          {"  "}<span className="tok-a">env</span>{"      = "}<span className="tok-s">"dev"</span>{"\n"}
          {"  "}<span className="tok-a">name</span>{"     = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;local.env&#125;"</span>{"                 "}<span className="tok-c"># interpolação</span>{"\n"}
          {"  "}<span className="tok-a">size</span>{"     = var.enabled ? "}<span className="tok-n">100</span>{" : "}<span className="tok-n">20</span>{"                        "}<span className="tok-c"># condicional</span>{"\n"}
          {"  "}<span className="tok-a">upper</span>{"    = [for s in var.azs : upper(s)]                 "}<span className="tok-c"># lista -&gt; lista</span>{"\n"}
          {"  "}<span className="tok-a">by_az</span>{"    = { for s in var.azs : s => "}<span className="tok-s">"$&#123;var.region&#125;$&#123;s&#125;"</span>{" }   "}<span className="tok-c"># lista -&gt; mapa</span>{"\n"}
          {"  "}<span className="tok-a">ids</span>{"      = aws_instance.web[*].id                        "}<span className="tok-c"># splat: todos os ids</span>{"\n"}
          {"  "}<span className="tok-a">merged</span>{"   = merge(var.tags, { Env = local.env })          "}<span className="tok-c"># junta mapas</span>{"\n"}
          {"  "}<span className="tok-a">safe</span>{"     = try(var.disk.size, "}<span className="tok-n">20</span>{")                        "}<span className="tok-c"># valor padrão se falhar</span>{"\n"}
          {"}"}
        </CodeBlock>
        <p><T pt={<>Referências seguem o padrão <code>tipo.nome.atributo</code>: <code>aws_vpc.main.id</code>, <code>var.region</code>, <code>local.tags</code>, <code>module.vpc.public_subnets</code>, <code>data.aws_region.current.name</code>. Funções úteis para decorar: <code>merge</code>, <code>lookup</code>, <code>join</code>, <code>format</code>, <code>toset</code>, <code>try</code>, <code>coalesce</code>, <code>cidrsubnet</code>, <code>jsonencode</code>, <code>file</code>. Teste qualquer expressão no <code>terraform console</code>.</>} en={<>References follow the <code>type.name.attribute</code> pattern: <code>aws_vpc.main.id</code>, <code>var.region</code>, <code>local.tags</code>, <code>module.vpc.public_subnets</code>, <code>data.aws_region.current.name</code>. Useful functions to memorise: <code>merge</code>, <code>lookup</code>, <code>join</code>, <code>format</code>, <code>toset</code>, <code>try</code>, <code>coalesce</code>, <code>cidrsubnet</code>, <code>jsonencode</code>, <code>file</code>. Test any expression in <code>terraform console</code>.</>} /></p>
        <CodeBlock>
          {"terraform console\n"}
          {"> cidrsubnet("}<span className="tok-s">"10.0.0.0/16"</span>{", 8, 1)\n"}
          <span className="tok-s">"10.0.1.0/24"</span>{"\n"}
          {"> upper("}<span className="tok-s">"abc"</span>{")\n"}
          <span className="tok-s">"ABC"</span>
        </CodeBlock>
        <Callout icon="check"><T pt={<>A ordem dos blocos no arquivo <em>não importa</em>. O Terraform lê todos os <code>*.tf</code> da pasta como um só e monta o grafo pelas referências. Por convenção: <code>main.tf</code>, <code>variables.tf</code>, <code>outputs.tf</code>, <code>versions.tf</code> (ou <code>providers.tf</code>).</>} en={<>The order of blocks in a file does <em>not</em> matter. Terraform reads every <code>*.tf</code> in the folder as one and builds the graph from references. By convention: <code>main.tf</code>, <code>variables.tf</code>, <code>outputs.tf</code>, <code>versions.tf</code> (or <code>providers.tf</code>).</>} /></Callout>
      </Section>
      <Section id="flow" title={<T pt="O fluxo e os comandos" en="The workflow and commands" />}>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<code>terraform init</code>, <T pt="baixa providers/módulos e prepara o backend (rode após clonar ou mudar versões)" en="downloads providers/modules and sets up the backend (run after cloning or changing versions)" />],
            [<code>terraform fmt -recursive</code>, <T pt={<>formata todos os <code>.tf</code></>} en={<>formats every <code>.tf</code></>} />],
            [<code>terraform validate</code>, <T pt="confere sintaxe e coerência, sem tocar na nuvem" en="checks syntax and consistency, without touching the cloud" />],
            [<code>terraform plan -out=tfplan</code>, <T pt="calcula a diferença e salva o plano" en="computes the difference and saves the plan" />],
            [<code>terraform apply tfplan</code>, <T pt={<>aplica <em>exatamente</em> o plano salvo (sem perguntar)</>} en={<>applies <em>exactly</em> the saved plan (no prompt)</>} />],
            [<code>terraform apply</code>, <T pt={<>planeja e pergunta <code>yes</code></>} en={<>plans and asks for <code>yes</code></>} />],
            [<code>terraform destroy</code>, <T pt={<>destrói tudo que o estado conhece (equivale a <code>apply -destroy</code>)</>} en={<>destroys everything the state knows (same as <code>apply -destroy</code>)</>} />],
            [<code>terraform output [-raw] nome</code>, <T pt={<>mostra saídas; <code>-raw</code> serve em scripts</>} en={<>shows outputs; <code>-raw</code> suits scripts</>} />],
            [<><code>terraform show</code> · <code>terraform graph</code></>, <T pt="estado/plano legível · grafo em DOT" en="readable state/plan · graph in DOT" />],
            [<code>terraform plan -refresh-only</code>, <T pt={<>só detecta <em>drift</em> (mudanças feitas fora do Terraform)</>} en={<>only detects <em>drift</em> (changes made outside Terraform)</>} />],
            [<code>terraform plan -replace=ADDR</code>, <T pt={<>força recriar um recurso (substitui o antigo <code>taint</code>)</>} en={<>forces recreating one resource (replaces the old <code>taint</code>)</>} />],
            [<code>terraform plan -target=ADDR</code>, <T pt={<>limita a um recurso; <em>exceção</em>, não rotina</>} en={<>limits to one resource; an <em>exception</em>, not routine</>} />],
          ]}
        />
        <Diagram minWidth={560} caption={<T pt={<>Três versões da verdade: o que você quer (código), o que o Terraform lembra (estado) e o que existe (nuvem). O <code>plan</code> concilia as três.</>} en={<>Three versions of the truth: what you want (code), what Terraform remembers (state) and what exists (cloud). <code>plan</code> reconciles the three.</>} />}>
          <svg viewBox="0 0 640 228" role="img" aria-label="Código, estado e nuvem / Code, state and cloud">
            <rect x="10" y="20" width="170" height="60" rx="4" className="ln fillsoft" />
            <text x="95.0" y="47.0" className="pt" textAnchor="middle">Código (desejado)</text>
            <text x="95.0" y="47.0" className="en" textAnchor="middle">Code (desired)</text>
            <text x="95.0" y="63.0" className="mut mono" textAnchor="middle">*.tf</text>
            <rect x="235" y="20" width="170" height="60" rx="4" className="ln fillsoft" />
            <text x="320.0" y="47.0" className="pt" textAnchor="middle">Estado (conhecido)</text>
            <text x="320.0" y="47.0" className="en" textAnchor="middle">State (known)</text>
            <text x="320.0" y="63.0" className="mut mono" textAnchor="middle">tfstate</text>
            <rect x="460" y="20" width="170" height="60" rx="4" className="ln fillsoft" />
            <text x="545.0" y="47.0" className="pt" textAnchor="middle">Nuvem (real)</text>
            <text x="545.0" y="47.0" className="en" textAnchor="middle">Cloud (actual)</text>
            <text x="545.0" y="63.0" className="pt mut mono" textAnchor="middle">o que existe de fato</text>
            <text x="545.0" y="63.0" className="en mut mono" textAnchor="middle">what actually exists</text>
            <rect x="180" y="130" width="280" height="50" rx="4" className="brandfill" />
            <text x="320.0" y="159.0" className="pt" textAnchor="middle">terraform plan = diferença</text>
            <text x="320.0" y="159.0" className="en" textAnchor="middle">terraform plan = difference</text>
            <path d="M95 80L250 130" className="ln" />
            <path d="M242.1 131.1L250 130L244.2 124.5" className="ln" />
            <path d="M320 80L320 130" className="ln" />
            <path d="M316.5 122.8L320 130L323.5 122.8" className="ln" />
            <path d="M545 80L400 130" className="ln" />
            <path d="M405.7 124.4L400 130L407.9 130.9" className="ln" />
            <text x="10" y="214" className="pt mut">O plan atualiza o que sabe da nuvem (refresh), compara com o código e lista as ações necessárias.</text>
            <text x="10" y="214" className="en mut">The plan refreshes what it knows of the cloud, compares it with the code and lists the needed actions.</text>
          </svg>
        </Diagram>
        <Callout icon="check"><T pt={<>Boa prática: em equipe, rode <code>plan -out</code> no CI, deixe alguém revisar e aplique <em>aquele mesmo plano salvo</em>. Assim o que foi revisado é exatamente o que roda, mesmo que a nuvem mude nesse meio-tempo.</>} en={<>Good practice: in a team, run <code>plan -out</code> in CI, have someone review it and apply <em>that very saved plan</em>. That way what was reviewed is exactly what runs, even if the cloud changes in between.</>} /></Callout>
      </Section>
      <Section id="state" title={<T pt="Estado, backend e drift" en="State, backend and drift" />}>
        <p><T pt={<>O <em>estado</em> é um arquivo JSON que mapeia cada bloco do código ao objeto real (por exemplo, <code>aws_s3_bucket.logs</code> ↔ o bucket <code>acme-logs-prod</code>) e guarda os atributos conhecidos. Sem ele o Terraform não sabe o que já criou. Três regras de ouro:</>} en={<>The <em>state</em> is a JSON file mapping each code block to the real object (for example, <code>aws_s3_bucket.logs</code> ↔ the bucket <code>acme-logs-prod</code>) and storing the known attributes. Without it Terraform does not know what it already created. Three golden rules:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><em>Nunca edite à mão</em> nem coloque no Git: ele pode conter senhas e chaves em texto puro.</>} en={<><em>Never edit it by hand</em> and never commit it: it may hold passwords and keys in plain text.</>} /></li>
          <li><T pt={<>Em equipe, use <em>backend remoto com trava</em> (S3, GCS, Azure Blob, HCP Terraform) para ninguém aplicar ao mesmo tempo.</>} en={<>In a team, use a <em>remote backend with locking</em> (S3, GCS, Azure Blob, HCP Terraform) so nobody applies at the same time.</>} /></li>
          <li><T pt={<>Mude o estado só pelos comandos e blocos oficiais (<code>terraform state</code>, <code>moved</code>, <code>import</code>, <code>removed</code>).</>} en={<>Change state only through the official commands and blocks (<code>terraform state</code>, <code>moved</code>, <code>import</code>, <code>removed</code>).</>} /></li>
        </ol>
        <CodeBlock>
          {"terraform state list                       "}<span className="tok-c"># tudo que o estado conhece</span>{"\n"}
          {"terraform state show aws_s3_bucket.logs    "}<span className="tok-c"># os atributos de um recurso</span>{"\n"}
          {"terraform state mv A B                     "}<span className="tok-c"># renomeia no estado (prefira o bloco moved)</span>{"\n"}
          {"terraform state rm aws_s3_bucket.logs      "}<span className="tok-c"># "esquece" sem apagar na nuvem (prefira removed)</span>{"\n"}
          {"terraform force-unlock LOCK_ID             "}<span className="tok-c"># só se um apply morreu e deixou a trava</span>
        </CodeBlock>
        <h3><T pt="Refatorar e adotar sem destruir" en="Refactor and adopt without destroying" /></h3>
        <CodeBlock>
          <span className="tok-c"># 1) Renomeou um recurso no código? Diga ao Terraform que é o MESMO objeto:</span>{"\n"}
          <span className="tok-k">moved</span>{" {\n"}
          {"  "}<span className="tok-a">from</span>{" = aws_s3_bucket.logs\n"}
          {"  "}<span className="tok-a">to</span>{"   = aws_s3_bucket.access_logs\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># 2) Já existe na nuvem e foi criado no console? Adote no estado (Terraform &gt;= 1.5):</span>{"\n"}
          <span className="tok-k">import</span>{" {\n"}
          {"  "}<span className="tok-a">to</span>{" = aws_s3_bucket.legacy\n"}
          {"  "}<span className="tok-a">id</span>{" = "}<span className="tok-s">"bucket-criado-no-console"</span>{"\n"}
          {"}\n"}
          <span className="tok-c"># terraform plan -generate-config-out=generated.tf escreve o código por você</span>{"\n"}
          {"\n"}
          <span className="tok-c"># 3) Quer parar de gerenciar sem apagar o objeto? (Terraform &gt;= 1.7)</span>{"\n"}
          <span className="tok-k">removed</span>{" {\n"}
          {"  "}<span className="tok-a">from</span>{" = aws_s3_bucket.legacy\n"}
          {"  "}<span className="tok-k">lifecycle</span>{" {\n"}
          {"    "}<span className="tok-a">destroy</span>{" = false\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt={<>Renomear um recurso no código <em>sem</em> um bloco <code>moved</code> faz o Terraform planejar “destruir o antigo e criar o novo”. É o acidente mais comum de refatoração. Sempre leia o plan depois de renomear.</>} en={<>Renaming a resource in code <em>without</em> a <code>moved</code> block makes Terraform plan “destroy the old, create the new”. It is the most common refactoring accident. Always read the plan after renaming.</>} /></Callout>
        <h3><T pt="Drift" en="Drift" /></h3>
        <p><T pt={<><em>Drift</em> é quando alguém muda a nuvem pelo console e o código fica desatualizado. O <code>plan</code> normal já mostra a diferença (o Terraform tenta desfazer a mudança manual). Use <code>plan -refresh-only</code> para só atualizar o estado com o que existe, ou aplique o código para corrigir a nuvem. Em times, o remédio é simples: permissões de escrita no console só para emergências.</>} en={<><em>Drift</em> is when someone changes the cloud in the console and the code gets out of date. A normal <code>plan</code> already shows the difference (Terraform tries to undo the manual change). Use <code>plan -refresh-only</code> to merely update state with what exists, or apply the code to fix the cloud. For teams the cure is simple: console write access only for emergencies.</>} /></p>
      </Section>
      <Section id="vars" title={<T pt="Variáveis, locals e outputs" en="Variables, locals and outputs" />}>
        <p><T pt={<>Três blocos separam o <em>que muda</em> do <em>como é feito</em>: <code>variable</code> (entrada de fora), <code>locals</code> (valor calculado dentro) e <code>output</code> (saída). Todo módulo, inclusive o diretório raiz, é uma função: entra variável, sai output.</>} en={<>Three blocks separate <em>what changes</em> from <em>how it is done</em>: <code>variable</code> (input from outside), <code>locals</code> (computed value inside) and <code>output</code> (result). Every module, including the root directory, is a function: variables go in, outputs come out.</>} /></p>
        <CodeBlock>
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"environment"</span>{" {\n"}
          {"  "}<span className="tok-a">description</span>{" = "}<span className="tok-s">"Nome do ambiente"</span>{"\n"}
          {"  "}<span className="tok-a">type</span>{"        = string\n"}
          {"  "}<span className="tok-a">default</span>{"     = "}<span className="tok-s">"dev"</span>{"\n"}
          {"\n"}
          {"  validation {\n"}
          {"    "}<span className="tok-a">condition</span>{"     = contains(["}<span className="tok-s">"dev"</span>{", "}<span className="tok-s">"staging"</span>{", "}<span className="tok-s">"prod"</span>{"], var.environment)\n"}
          {"    "}<span className="tok-a">error_message</span>{" = "}<span className="tok-s">"environment deve ser dev, staging ou prod."</span>{"\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"db_password"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"      = string\n"}
          {"  "}<span className="tok-a">sensitive</span>{" = true          "}<span className="tok-c"># some da saída do plan/apply (mas continua no state!)</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">locals</span>{" {\n"}
          {"  "}<span className="tok-a">name_prefix</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;"</span>{"\n"}
          {"  "}<span className="tok-a">tags</span>{" = {\n"}
          {"    "}<span className="tok-a">Project</span>{"     = var.project\n"}
          {"    "}<span className="tok-a">Environment</span>{" = var.environment\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"name_prefix"</span>{" {\n"}
          {"  "}<span className="tok-a">description</span>{" = "}<span className="tok-s">"Prefixo usado nos recursos"</span>{"\n"}
          {"  "}<span className="tok-a">value</span>{"       = local.name_prefix\n"}
          {"}"}
        </CodeBlock>
        <p><T pt={<>Os valores chegam por vários caminhos. Em caso de conflito vence o <em>de baixo</em> da lista (o último):</>} en={<>Values arrive through several paths. On conflict the one <em>lower</em> in the list (the last) wins:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<>o <code>default</code> da variável</>} en={<>the variable’s <code>default</code></>} /></li>
          <li><T pt={<>variáveis de ambiente <code>TF_VAR_nome</code></>} en={<>environment variables <code>TF_VAR_name</code></>} /></li>
          <li><T pt={<><code>terraform.tfvars</code> e <code>terraform.tfvars.json</code></>} en={<><code>terraform.tfvars</code> and <code>terraform.tfvars.json</code></>} /></li>
          <li><T pt={<><code>*.auto.tfvars</code> (em ordem alfabética)</>} en={<><code>*.auto.tfvars</code> (in alphabetical order)</>} /></li>
          <li><T pt={<><code>-var-file=…</code> e <code>-var nome=valor</code> na linha de comando, na ordem em que aparecem</>} en={<><code>-var-file=…</code> and <code>-var name=value</code> on the command line, in the order given</>} /></li>
        </ol>
        <CodeBlock>
          {"terraform plan -var-file=prod.tfvars\n"}
          {"export TF_VAR_db_password="}<span className="tok-s">"$(aws secretsmanager get-secret-value --secret-id app/db --query SecretString --output text)"</span>
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt={<><code>sensitive = true</code> só esconde o valor na tela. Ele <em>continua em texto puro no state</em>. Por isso: backend remoto cifrado e com acesso restrito, e preferir não ter o segredo no Terraform. Exemplos: o RDS pode gerar e guardar a senha no Secrets Manager (<code>manage_master_user_password = true</code>); versões recentes do Terraform também têm valores <em>efêmeros</em> e atributos <em>write-only</em> que não vão para o state (veja a documentação da sua versão).</>} en={<><code>sensitive = true</code> only hides the value on screen. It <em>stays in plain text in the state</em>. Hence: an encrypted, access-restricted remote backend, and preferably not having the secret in Terraform at all. For example, RDS can generate and store the password in Secrets Manager (<code>manage_master_user_password = true</code>); recent Terraform versions also have <em>ephemeral</em> values and <em>write-only</em> attributes that never reach the state (see your version’s documentation).</>} /></Callout>
      </Section>
      <Section id="scale" title={<T pt="Dependências, repetição e lifecycle" en="Dependencies, repetition and lifecycle" />}>
        <h3><T pt="Dependências e o grafo" en="Dependencies and the graph" /></h3>
        <p><T pt={<>Cada vez que um recurso <em>referencia</em> outro (<code>vpc_id = aws_vpc.main.id</code>) o Terraform cria uma aresta no grafo: o referenciado nasce primeiro e morre por último. O que não depende entre si roda <em>em paralelo</em> (padrão: 10 ao mesmo tempo). Você quase nunca precisa de <code>depends_on</code>; ele serve só para dependências que o Terraform não enxerga (por exemplo, uma política IAM que precisa existir antes de uma aplicação funcionar).</>} en={<>Each time a resource <em>references</em> another (<code>vpc_id = aws_vpc.main.id</code>) Terraform adds an edge to the graph: the referenced one is born first and dies last. Things that do not depend on each other run <em>in parallel</em> (default: 10 at a time). You almost never need <code>depends_on</code>; it is only for dependencies Terraform cannot see (for example, an IAM policy that must exist before an application works).</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>Grafo de dependências da pilha EC2 da seção AWS. Veja o seu com <code>terraform graph | dot -Tsvg &gt; graph.svg</code> (precisa do Graphviz).</>} en={<>Dependency graph of the EC2 stack in the AWS section. See yours with <code>terraform graph | dot -Tsvg &gt; graph.svg</code> (needs Graphviz).</>} />}>
          <svg viewBox="0 0 640 276" role="img" aria-label="Grafo de dependências / Dependency graph">
            <rect x="10" y="20" width="170" height="44" rx="4" className="ln fillsoft" />
            <text x="95.0" y="46" className="mono" textAnchor="middle">aws_vpc.main</text>
            <rect x="10" y="140" width="170" height="44" rx="4" className="ln fillsoft" />
            <text x="95.0" y="166" className="mono" textAnchor="middle">aws_iam_role.web</text>
            <rect x="230" y="20" width="215" height="44" rx="4" className="ln fillsoft" />
            <text x="337.5" y="46" className="mono" textAnchor="middle">aws_subnet.public</text>
            <rect x="230" y="80" width="215" height="44" rx="4" className="ln fillsoft" />
            <text x="337.5" y="106" className="mono" textAnchor="middle">aws_security_group.web</text>
            <rect x="230" y="140" width="215" height="44" rx="4" className="ln fillsoft" />
            <text x="337.5" y="166" className="mono" textAnchor="middle">aws_iam_instance_profile.web</text>
            <rect x="230" y="200" width="215" height="44" rx="4" className="ln fillsoft" />
            <text x="337.5" y="226" className="mono" textAnchor="middle">data.aws_ssm_parameter.ami</text>
            <rect x="490" y="100" width="140" height="56" rx="4" className="brandfill" />
            <text x="560" y="124" className="mono brandtext" textAnchor="middle">aws_instance.web</text>
            <text x="560" y="142" className="pt mut" textAnchor="middle">criada por último</text>
            <text x="560" y="142" className="en mut" textAnchor="middle">created last</text>
            <path d="M180 42L230 42" className="ln" />
            <path d="M222.8 45.5L230 42L222.8 38.5" className="ln" />
            <path d="M180 52L230 102" className="ln" />
            <path d="M222.4 99.4L230 102L227.4 94.4" className="ln" />
            <path d="M180 162L230 162" className="ln" />
            <path d="M222.8 165.5L230 162L222.8 158.5" className="ln" />
            <path d="M445 42L490 112" className="ln" />
            <path d="M483.2 107.8L490 112L489.0 104.1" className="ln" />
            <path d="M445 102L490 124" className="ln" />
            <path d="M482.0 124.0L490 124L485.1 117.7" className="ln" />
            <path d="M445 162L490 140" className="ln" />
            <path d="M485.1 146.3L490 140L482.0 140.0" className="ln" />
            <path d="M445 222L490 150" className="ln" />
            <path d="M489.1 158.0L490 150L483.2 154.3" className="ln" />
            <text x="10" y="262" className="pt mut">Setas = “precisa de”. As três ramas à esquerda são independentes e rodam ao mesmo tempo.</text>
            <text x="10" y="262" className="en mut">Arrows = “needed by”. The branches on the left are independent and run at the same time.</text>
          </svg>
        </Diagram>
        <h3><T pt="count, for_each e dynamic" en="count, for_each and dynamic" /></h3>
        <CodeBlock>
          <span className="tok-c"># for_each: um recurso por item, com CHAVE estável</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"buckets"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"    = set(string)\n"}
          {"  "}<span className="tok-a">default</span>{" = ["}<span className="tok-s">"logs"</span>{", "}<span className="tok-s">"assets"</span>{"]\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_s3_bucket"</span>{" "}<span className="tok-s">"this"</span>{" {\n"}
          {"  "}<span className="tok-a">for_each</span>{" = var.buckets\n"}
          {"  "}<span className="tok-a">bucket</span>{"   = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;each.key&#125;"</span>{"     "}<span className="tok-c"># each.key / each.value</span>{"\n"}
          {"}\n"}
          <span className="tok-c"># endereços: aws_s3_bucket.this["logs"], aws_s3_bucket.this["assets"]</span>{"\n"}
          {"\n"}
          <span className="tok-c"># count: ligar/desligar (0 ou 1) ou N cópias idênticas</span>{"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_eip"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">count</span>{"    = var.enable_eip ? "}<span className="tok-n">1</span>{" : "}<span className="tok-n">0</span>{"\n"}
          {"  "}<span className="tok-a">instance</span>{" = aws_instance.web.id\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># dynamic: repete um BLOCO ANINHADO</span>{"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_security_group"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">name</span>{"   = "}<span className="tok-s">"web"</span>{"\n"}
          {"  "}<span className="tok-a">vpc_id</span>{" = var.vpc_id\n"}
          {"\n"}
          {"  "}<span className="tok-k">dynamic</span>{" "}<span className="tok-s">"ingress"</span>{" {\n"}
          {"    "}<span className="tok-a">for_each</span>{" = var.allowed_ports\n"}
          {"    "}<span className="tok-k">content</span>{" {\n"}
          {"      "}<span className="tok-a">from_port</span>{"   = ingress.value\n"}
          {"      "}<span className="tok-a">to_port</span>{"     = ingress.value\n"}
          {"      "}<span className="tok-a">protocol</span>{"    = "}<span className="tok-s">"tcp"</span>{"\n"}
          {"      "}<span className="tok-a">cidr_blocks</span>{" = ["}<span className="tok-s">"0.0.0.0/0"</span>{"]\n"}
          {"    }\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <Table
          head={[<T pt="Use" en="Use" />, <T pt="Quando" en="When" />, <T pt="Cuidado" en="Careful" />]}
          rows={[
            [<code>count</code>, <T pt={<>liga/desliga (<code>0</code> ou <code>1</code>) ou cópias idênticas</>} en={<>on/off (<code>0</code> or <code>1</code>) or identical copies</>} />, <T pt={<>tirar um item do <em>meio</em> da lista muda os índices e recria os seguintes</>} en={<>removing an item from the <em>middle</em> of the list shifts indexes and recreates the following ones</>} />],
            [<code>for_each</code>, <T pt="itens com identidade (nome, chave)" en="items with an identity (name, key)" />, <T pt={<>as chaves precisam ser conhecidas no <code>plan</code> (não podem vir de algo ainda não criado)</>} en="keys must be known at plan time (cannot come from something not created yet)" />],
            [<code>dynamic</code>, <T pt="blocos aninhados repetidos" en="repeated nested blocks" />, <T pt="não abuse: blocos fixos são mais legíveis" en="do not overuse: fixed blocks are more readable" />],
          ]}
        />
        <h3><T pt="lifecycle: regras para casos delicados" en="lifecycle: rules for delicate cases" /></h3>
        <CodeBlock>
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_instance"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-c"># ...</span>{"\n"}
          {"  "}<span className="tok-k">lifecycle</span>{" {\n"}
          {"    "}<span className="tok-a">create_before_destroy</span>{" = true         "}<span className="tok-c"># sobe o novo antes de derrubar o velho</span>{"\n"}
          {"    "}<span className="tok-a">prevent_destroy</span>{"       = true         "}<span className="tok-c"># erro se um plan tentar destruir (proteção de dados)</span>{"\n"}
          {"    "}<span className="tok-a">ignore_changes</span>{"        = [ami, tags["}<span className="tok-s">"LastDeploy"</span>{"]]   "}<span className="tok-c"># ignora mudanças feitas por fora</span>{"\n"}
          {"    "}<span className="tok-a">replace_triggered_by</span>{"  = [aws_launch_template.web.latest_version]\n"}
          {"\n"}
          {"    precondition {\n"}
          {"      "}<span className="tok-a">condition</span>{"     = var.instance_type != "}<span className="tok-s">"t2.nano"</span>{"\n"}
          {"      "}<span className="tok-a">error_message</span>{" = "}<span className="tok-s">"Tipo de instância pequeno demais."</span>{"\n"}
          {"    }\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
      </Section>
      <Section id="modules" title={<T pt="Módulos e ambientes" en="Modules and environments" />}>
        <p><T pt={<>Um <em>módulo</em> é uma pasta com arquivos <code>.tf</code> usada por outro código via bloco <code>module</code>. O diretório onde você roda <code>terraform apply</code> é o <em>módulo raiz</em>; os que ele chama são <em>módulos filhos</em>. Variáveis são as entradas e outputs, as saídas. Módulos vêm de uma pasta local, do Terraform Registry, do Git ou de um bucket.</>} en={<>A <em>module</em> is a folder of <code>.tf</code> files used by other code through a <code>module</code> block. The directory where you run <code>terraform apply</code> is the <em>root module</em>; the ones it calls are <em>child modules</em>. Variables are the inputs and outputs the results. Modules come from a local folder, the Terraform Registry, Git or a bucket.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="O módulo raiz alimenta os filhos com variáveis e consome os outputs deles." en="The root module feeds the children with variables and consumes their outputs." />}>
          <svg viewBox="0 0 660 262" role="img" aria-label="Módulo raiz e módulos filhos / Root and child modules">
            <rect x="10" y="20" width="210" height="190" rx="4" className="ln fillsoft" />
            <text x="115" y="44" className="pt" textAnchor="middle">Módulo raiz</text>
            <text x="115" y="44" className="en" textAnchor="middle">Root module</text>
            <text x="115" y="62" className="mut mono" textAnchor="middle">envs/dev/main.tf</text>
            <text x="26" y="110" className="mono" textAnchor="start">module "network" &#123;…&#125;</text>
            <text x="26" y="140" className="mono" textAnchor="start">module "web" &#123;…&#125;</text>
            <text x="26" y="170" className="mono" textAnchor="start">module "data" &#123;…&#125;</text>
            <rect x="420" y="20" width="210" height="54" rx="4" className="brandfill" />
            <text x="525" y="42" className="mono brandtext" textAnchor="middle">modules/network</text>
            <text x="525" y="60" className="pt mut" textAnchor="middle">rede: VPC, subnets</text>
            <text x="525" y="60" className="en mut" textAnchor="middle">network: VPC, subnets</text>
            <path d="M220 100L420 36" className="ln" />
            <path d="M412.6 35.0L420 36L414.6 41.2" className="ln" />
            <path d="M420 58L220 118" className="ln dash" />
            <path d="M227.4 119.2L220 118L225.5 112.9" className="ln" />
            <rect x="420" y="86" width="210" height="54" rx="4" className="brandfill" />
            <text x="525" y="108" className="mono brandtext" textAnchor="middle">modules/web</text>
            <text x="525" y="126" className="pt mut" textAnchor="middle">servidores e SG</text>
            <text x="525" y="126" className="en mut" textAnchor="middle">servers and SG</text>
            <path d="M220 130L420 102" className="ln" />
            <path d="M412.9 99.7L420 102L413.8 106.2" className="ln" />
            <path d="M420 124L220 148" className="ln dash" />
            <path d="M227.1 150.4L220 148L226.3 144.0" className="ln" />
            <rect x="420" y="152" width="210" height="54" rx="4" className="brandfill" />
            <text x="525" y="174" className="mono brandtext" textAnchor="middle">modules/data</text>
            <text x="525" y="192" className="pt mut" textAnchor="middle">banco e bucket</text>
            <text x="525" y="192" className="en mut" textAnchor="middle">database and bucket</text>
            <path d="M220 160L420 168" className="ln" />
            <path d="M413.4 164.5L420 168L413.1 171.0" className="ln" />
            <path d="M420 190L220 178" className="ln dash" />
            <path d="M226.5 181.7L220 178L226.9 175.1" className="ln" />
            <text x="320" y="248" className="pt mut" textAnchor="middle">→ variáveis (linha cheia) · ← outputs (tracejada), ex.: module.network.public_subnets</text>
            <text x="320" y="248" className="en mut" textAnchor="middle">→ variables (solid) · ← outputs (dashed), e.g. module.network.public_subnets</text>
          </svg>
        </Diagram>
        <CodeBlock>
          {"infra/\n"}
          {"├── modules/\n"}
          {"│   └── web/                 "}<span className="tok-c"># módulo reutilizável</span>{"\n"}
          {"│       ├── main.tf          "}<span className="tok-c"># recursos</span>{"\n"}
          {"│       ├── variables.tf     "}<span className="tok-c"># entradas</span>{"\n"}
          {"│       ├── outputs.tf       "}<span className="tok-c"># saídas</span>{"\n"}
          {"│       └── README.md        "}<span className="tok-c"># gerado com terraform-docs</span>{"\n"}
          {"└── envs/\n"}
          {"    ├── dev/\n"}
          {"    │   ├── main.tf          "}<span className="tok-c"># module "web" &#123; source = "../../modules/web" ... &#125;</span>{"\n"}
          {"    │   ├── backend.tf       "}<span className="tok-c"># state em outro "key" do bucket</span>{"\n"}
          {"    │   └── dev.tfvars\n"}
          {"    └── prod/\n"}
          {"        └── ..."}
        </CodeBlock>
        <CodeBlock>
          <span className="tok-k">module</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">source</span>{"        = "}<span className="tok-s">"../../modules/web"</span>{"        "}<span className="tok-c"># pasta local</span>{"\n"}
          {"  "}<span className="tok-a">name</span>{"          = "}<span className="tok-s">"loja"</span>{"\n"}
          {"  "}<span className="tok-a">instance_type</span>{" = "}<span className="tok-s">"t3.micro"</span>{"\n"}
          {"  "}<span className="tok-a">subnet_id</span>{"     = "}<span className="tok-k">module</span>{".network.public_subnets["}<span className="tok-n">0</span>{"]\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">module</span>{" "}<span className="tok-s">"vpc"</span>{" {\n"}
          {"  "}<span className="tok-a">source</span>{"  = "}<span className="tok-s">"terraform-aws-modules/vpc/aws"</span>{"  "}<span className="tok-c"># Terraform Registry</span>{"\n"}
          {"  "}<span className="tok-a">version</span>{" = "}<span className="tok-s">"~&gt; 6.0"</span>{"                         "}<span className="tok-c"># SEMPRE fixe a versão</span>{"\n"}
          {"  "}<span className="tok-c"># ...</span>{"\n"}
          {"}"}
        </CodeBlock>
        <Table
          head={[<T pt="Regra de módulo" en="Module rule" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt="Faça pequeno e com uma responsabilidade" en="Keep it small, single-purpose" />, <T pt="módulos “faz-tudo” viram impossíveis de reusar e testar" en="“do-everything” modules become impossible to reuse and test" />],
            [<T pt={<>Não configure <code>provider</code> dentro do módulo</>} en={<>Do not configure <code>provider</code> inside the module</>} />, <T pt={<>o módulo herda do chamador; use <code>providers = &#123; aws = aws.east &#125;</code> para trocar</>} en={<>the module inherits from the caller; use <code>providers = &#123; aws = aws.east &#125;</code> to switch</>} />],
            [<T pt="Exponha só os outputs necessários" en="Expose only the needed outputs" />, <T pt="o que sai vira contrato; mudar depois quebra quem usa" en="what goes out becomes a contract; changing it later breaks users" />],
            [<T pt="Fixe versões de módulos de registry/Git" en="Pin versions of registry/Git modules" />, <T pt={<>um <code>init -upgrade</code> não pode mudar a sua infra de surpresa</>} en={<>an <code>init -upgrade</code> must not change your infra by surprise</>} />],
            [<T pt="Prefira composição a módulos aninhados fundo" en="Prefer composition over deeply nested modules" />, <T pt="é mais fácil de ler: o raiz “cola” os módulos" en="easier to read: the root “glues” the modules" />],
          ]}
        />
        <h3><T pt="Ambientes: pastas ou workspaces?" en="Environments: folders or workspaces?" /></h3>
        <Table
          head={[<T pt="" en="" />, <T pt="Pastas/estados separados" en="Separate folders/states" />, <T pt="Workspaces" en="Workspaces" />]}
          rows={[
            [<T pt="Como" en="How" />, <T pt={<><code>envs/dev</code>, <code>envs/prod</code>, cada um com seu <code>backend</code></>} en={<><code>envs/dev</code>, <code>envs/prod</code>, each with its own <code>backend</code></>} />, <T pt={<><code>terraform workspace new prod</code>: mesmo código e mesmo backend, estado por workspace</>} en={<><code>terraform workspace new prod</code>: same code and backend, one state per workspace</>} />],
            [<T pt="Isolamento" en="Isolation" />, <T pt="alto: contas AWS, permissões e estados diferentes" en="high: different AWS accounts, permissions and states" />, <T pt={<>baixo: um engano de <code>workspace select</code> aplica na produção</>} en={<>low: one wrong <code>workspace select</code> applies to production</>} />],
            [<T pt="Bom para" en="Good for" />, <T pt="dev/staging/prod de verdade" en="real dev/staging/prod" />, <T pt="cópias efêmeras e idênticas (testes, preview por PR)" en="ephemeral, identical copies (tests, per-PR previews)" />],
          ]}
        />
      </Section>
      <Section id="team" title={<T pt="Times, CI e boas práticas" en="Teams, CI and best practices" />}>
        <p><T pt={<>Em produção ninguém roda <code>apply</code> do notebook. O fluxo de equipe é: <em>Pull Request</em> → verificações automáticas + <code>plan</code> como comentário → revisão → merge → <code>apply</code> automático (ou aprovado) <em>do mesmo plano</em>.</>} en={<>In production nobody runs <code>apply</code> from a laptop. The team flow is: <em>Pull Request</em> → automatic checks + <code>plan</code> as a comment → review → merge → automatic (or approved) <code>apply</code> <em>of the same plan</em>.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>O pipeline típico. Todo passo antes do merge é barato e reversível; o <code>apply</code> é o único que muda o mundo.</>} en={<>The typical pipeline. Every step before merge is cheap and reversible; <code>apply</code> is the only one that changes the world.</>} />}>
          <svg viewBox="0 0 640 146" role="img" aria-label="Pipeline de CI do Terraform / Terraform CI pipeline">
            <rect x="10" y="30" width="78" height="64" rx="4" className="ln fillsoft" />
            <text x="49" y="58" className="pt" textAnchor="middle">PR aberto</text>
            <text x="49" y="58" className="en" textAnchor="middle">PR opened</text>
            <rect x="100" y="30" width="78" height="64" rx="4" className="ln fillsoft" />
            <text x="139" y="58" className="pt" textAnchor="middle">validar</text>
            <text x="139" y="58" className="en" textAnchor="middle">validate</text>
            <text x="139" y="76" className="mut" textAnchor="middle">tflint</text>
            <path d="M88 62L100 62" className="ln" />
            <path d="M92.8 65.5L100 62L92.8 58.5" className="ln" />
            <rect x="190" y="30" width="78" height="64" rx="4" className="ln fillsoft" />
            <text x="229" y="58" className="pt" textAnchor="middle">segurança</text>
            <text x="229" y="58" className="en" textAnchor="middle">security</text>
            <text x="229" y="76" className="mut" textAnchor="middle">trivy</text>
            <path d="M178 62L190 62" className="ln" />
            <path d="M182.8 65.5L190 62L182.8 58.5" className="ln" />
            <rect x="280" y="30" width="78" height="64" rx="4" className="brandfill" />
            <text x="319" y="58" className="" textAnchor="middle">plan</text>
            <text x="319" y="76" className="pt mut" textAnchor="middle">no PR</text>
            <text x="319" y="76" className="en mut" textAnchor="middle">on the PR</text>
            <path d="M268 62L280 62" className="ln" />
            <path d="M272.8 65.5L280 62L272.8 58.5" className="ln" />
            <rect x="370" y="30" width="78" height="64" rx="4" className="ln fillsoft" />
            <text x="409" y="58" className="pt" textAnchor="middle">revisão</text>
            <text x="409" y="58" className="en" textAnchor="middle">review</text>
            <text x="409" y="76" className="pt mut" textAnchor="middle">humana</text>
            <text x="409" y="76" className="en mut" textAnchor="middle">human</text>
            <path d="M358 62L370 62" className="ln" />
            <path d="M362.8 65.5L370 62L362.8 58.5" className="ln" />
            <rect x="460" y="30" width="78" height="64" rx="4" className="ln fillsoft" />
            <text x="499" y="58" className="" textAnchor="middle">merge</text>
            <text x="499" y="76" className="mut" textAnchor="middle">main</text>
            <path d="M448 62L460 62" className="ln" />
            <path d="M452.8 65.5L460 62L452.8 58.5" className="ln" />
            <rect x="550" y="30" width="78" height="64" rx="4" className="brandfill" />
            <text x="589" y="58" className="" textAnchor="middle">apply</text>
            <text x="589" y="76" className="mut" textAnchor="middle">o mesmo</text>
            <path d="M538 62L550 62" className="ln" />
            <path d="M542.8 65.5L550 62L542.8 58.5" className="ln" />
            <text x="10" y="130" className="pt mut">A autenticação com a nuvem usa OIDC (sem chaves fixas): veja a nota “GitHub para AWS com OIDC”.</text>
            <text x="10" y="130" className="en mut">Cloud authentication uses OIDC (no long-lived keys): see the “GitHub to AWS with OIDC” note.</text>
          </svg>
        </Diagram>
        <CodeBlock>
          <span className="tok-c"># .github/workflows/terraform.yml (trecho; confira as versões atuais das actions)</span>{"\n"}
          {"name: terraform\n"}
          {"on:\n"}
          {"  pull_request:\n"}
          {"  push:\n"}
          {"    branches: [main]\n"}
          {"permissions:\n"}
          {"  id-token: write       "}<span className="tok-c"># OIDC</span>{"\n"}
          {"  contents: read\n"}
          {"  pull-requests: write  "}<span className="tok-c"># comentar o plan</span>{"\n"}
          {"jobs:\n"}
          {"  plan:\n"}
          {"    runs-on: ubuntu-latest\n"}
          {"    steps:\n"}
          {"      - uses: actions/checkout@v4\n"}
          {"      - uses: hashicorp/setup-terraform@v3\n"}
          {"      - uses: aws-actions/configure-aws-credentials@v4\n"}
          {"        with:\n"}
          {"          role-to-assume: arn:aws:iam::123456789012:role/terraform-plan\n"}
          {"          aws-region: sa-east-1\n"}
          {"      - run: terraform fmt -check -recursive\n"}
          {"      - run: terraform init -input=false\n"}
          {"      - run: terraform validate\n"}
          {"      - run: terraform plan -input=false -out=tfplan"}
        </CodeBlock>
        <h3><T pt="Ferramentas que valem a pena" en="Tools worth having" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Faz" en="Does" />]}
          rows={[
            [<><code>terraform fmt</code> · <code>validate</code></>, <T pt="formato e sintaxe (vêm no binário)" en="format and syntax (built into the binary)" />],
            [<code>tflint</code>, <T pt="linter: tipos de instância inválidos, argumentos obsoletos, regras do provider AWS" en="linter: invalid instance types, deprecated arguments, AWS provider rules" />],
            [<><code>trivy config .</code> · <code>checkov</code></>, <T pt="segurança: bucket público, SG aberto, disco sem criptografia (o antigo tfsec foi incorporado ao Trivy)" en="security: public bucket, open SG, unencrypted disk (the old tfsec was merged into Trivy)" />],
            [<code>terraform-docs</code>, <T pt="gera o README de variáveis/outputs do módulo" en="generates the module’s variables/outputs README" />],
            [<code>infracost</code>, <T pt="estima o custo mensal da mudança no PR" en="estimates the monthly cost of the PR change" />],
            [<><code>pre-commit</code> (<code>pre-commit-terraform</code>)</>, <T pt="roda tudo isso antes do commit" en="runs all of the above before commit" />],
            [<code>terraform test</code>, <T pt={<>testes nativos em <code>.tftest.hcl</code> (Terraform ≥ 1.6)</>} en={<>native tests in <code>.tftest.hcl</code> (Terraform ≥ 1.6)</>} />],
            ["Atlantis · HCP Terraform · Terragrunt", <T pt="automação de PR · plataforma gerenciada · camada para reduzir repetição entre pastas" en="PR automation · managed platform · layer to reduce repetition between folders" />],
          ]}
        />
        <CodeBlock>
          <span className="tok-c"># tests/bucket.tftest.hcl</span>{"\n"}
          <span className="tok-k">run</span>{" "}<span className="tok-s">"bucket_is_private"</span>{" {\n"}
          {"  "}<span className="tok-a">command</span>{" = plan\n"}
          {"\n"}
          {"  "}<span className="tok-k">assert</span>{" {\n"}
          {"    "}<span className="tok-a">condition</span>{"     = aws_s3_bucket_public_access_block.assets.block_public_acls == true\n"}
          {"    "}<span className="tok-a">error_message</span>{" = "}<span className="tok-s">"O bucket precisa bloquear ACLs públicas."</span>{"\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <h3><T pt="Hábitos que evitam 90% dos incidentes" en="Habits that prevent 90% of incidents" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Versões fixas: <code>required_version</code>, <code>version = "~&gt; X.Y"</code> nos providers e módulos, e <code>.terraform.lock.hcl</code> no Git. Atualize de propósito (<code>init -upgrade</code> + revisar), de preferência com Renovate/Dependabot.</>} en={<>Pinned versions: <code>required_version</code>, <code>version = "~&gt; X.Y"</code> on providers and modules, and <code>.terraform.lock.hcl</code> in Git. Upgrade on purpose (<code>init -upgrade</code> + review), ideally with Renovate/Dependabot.</>} /></li>
          <li><T pt={<>Um estado por ambiente e por “raio de impacto”: um estado gigante deixa o <code>plan</code> lento e o risco enorme.</>} en={<>One state per environment and per “blast radius”: one giant state makes <code>plan</code> slow and the risk huge.</>} /></li>
          <li><T pt={<>Nomes e tags padronizados (<code>default_tags</code> no provider AWS).</>} en={<>Standard names and tags (<code>default_tags</code> on the AWS provider).</>} /></li>
          <li><T pt={<><code>prevent_destroy</code> em bancos e buckets de dados; backups e versionamento ligados.</>} en={<><code>prevent_destroy</code> on databases and data buckets; backups and versioning on.</>} /></li>
          <li><T pt={<>Nunca <code>-target</code> como rotina e nunca <code>apply</code> sem ler o plan.</>} en={<>Never <code>-target</code> as routine and never <code>apply</code> without reading the plan.</>} /></li>
          <li><T pt={<>O papel que o Terraform assume deve ter só as permissões necessárias (e papéis separados para <code>plan</code> e <code>apply</code>).</>} en={<>The role Terraform assumes should have only the needed permissions (and separate roles for <code>plan</code> and <code>apply</code>).</>} /></li>
          <li><T pt={<>Tudo na nuvem pelo código; o console é para ler. Drift se detecta com <code>plan</code> agendado.</>} en={<>Everything in the cloud through code; the console is for reading. Detect drift with a scheduled <code>plan</code>.</>} /></li>
        </ol>
      </Section>
      <Section id="aws-auth" title={<T pt="AWS: provider e credenciais" en="AWS: provider and credentials" />}>
        <p><T pt={<>A partir daqui o foco é a AWS. O provider <code>hashicorp/aws</code> usa as mesmas credenciais da AWS CLI e dos SDKs. A regra é simples: <em>nunca escreva chaves no código</em>. Para pessoas, use o IAM Identity Center (SSO); para pipelines, OIDC; para servidores na AWS, papéis de instância.</>} en={<>From here on the focus is AWS. The <code>hashicorp/aws</code> provider uses the same credentials as the AWS CLI and SDKs. The rule is simple: <em>never write keys in code</em>. For people, use IAM Identity Center (SSO); for pipelines, OIDC; for servers on AWS, instance roles.</>} /></p>
        <Table
          head={[<T pt="Quem executa" en="Who runs it" />, <T pt="Como autenticar" en="How to authenticate" />, <T pt="Detalhe" en="Detail" />]}
          rows={[
            [<T pt="Você, no notebook" en="You, on a laptop" />, <T pt={<><code>aws sso login --profile dev</code> + <code>export AWS_PROFILE=dev</code></>} en={<><code>aws sso login --profile dev</code> + <code>export AWS_PROFILE=dev</code></>} />, <T pt="credenciais temporárias; nada fica no disco além do cache do SSO" en="temporary credentials; nothing on disk except the SSO cache" />],
            [<T pt="GitHub Actions / CI" en="GitHub Actions / CI" />, <T pt={<>OIDC: <code>aws-actions/configure-aws-credentials</code> assume um papel</>} en={<>OIDC: <code>aws-actions/configure-aws-credentials</code> assumes a role</>} />, <T pt="veja a nota “GitHub para AWS com OIDC”" en="see the “GitHub to AWS with OIDC” note" />],
            [<T pt="Outra conta AWS" en="Another AWS account" />, <T pt={<>bloco <code>assume_role &#123; role_arn = … &#125;</code> no provider</>} en={<><code>assume_role &#123; role_arn = … &#125;</code> block on the provider</>} />, <T pt="um papel por conta/ambiente (veja a nota AWS, Organizations)" en="one role per account/environment (see the AWS note, Organizations)" />],
            [<T pt="Chaves de acesso fixas" en="Long-lived access keys" />, <T pt="evite" en="avoid" />, <T pt="se existirem, vão só em variáveis de ambiente do CI, e devem ser trocadas" en="if they exist, only in CI environment variables, and must be rotated" />],
          ]}
        />
        <CodeBlock>
          <span className="tok-c"># versions.tf</span>{"\n"}
          <span className="tok-k">terraform</span>{" {\n"}
          {"  "}<span className="tok-a">required_version</span>{" = "}<span className="tok-s">"&gt;= 1.10"</span>{"\n"}
          {"  "}<span className="tok-k">required_providers</span>{" {\n"}
          {"    "}<span className="tok-a">aws</span>{" = {\n"}
          {"      "}<span className="tok-a">source</span>{"  = "}<span className="tok-s">"hashicorp/aws"</span>{"\n"}
          {"      "}<span className="tok-a">version</span>{" = "}<span className="tok-s">"~&gt; 6.0"</span>{"          "}<span className="tok-c"># confira a versão maior atual no Registry</span>{"\n"}
          {"    }\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># providers.tf</span>{"\n"}
          <span className="tok-k">provider</span>{" "}<span className="tok-s">"aws"</span>{" {\n"}
          {"  "}<span className="tok-a">region</span>{"              = var.region\n"}
          {"  "}<span className="tok-a">allowed_account_ids</span>{" = [var.account_id]     "}<span className="tok-c"># TRAVA: recusa rodar na conta errada</span>{"\n"}
          {"\n"}
          {"  "}<span className="tok-k">default_tags</span>{" {\n"}
          {"    "}<span className="tok-a">tags</span>{" = {\n"}
          {"      "}<span className="tok-a">Project</span>{"     = var.project\n"}
          {"      "}<span className="tok-a">Environment</span>{" = var.environment\n"}
          {"      "}<span className="tok-a">ManagedBy</span>{"   = "}<span className="tok-s">"terraform"</span>{"\n"}
          {"    }\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># um segundo provider para outra região (ex.: certificados do CloudFront só em us-east-1)</span>{"\n"}
          <span className="tok-k">provider</span>{" "}<span className="tok-s">"aws"</span>{" {\n"}
          {"  "}<span className="tok-a">alias</span>{"  = "}<span className="tok-s">"virginia"</span>{"\n"}
          {"  "}<span className="tok-a">region</span>{" = "}<span className="tok-s">"us-east-1"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_acm_certificate"</span>{" "}<span className="tok-s">"site"</span>{" {\n"}
          {"  "}<span className="tok-a">provider</span>{"          = aws.virginia\n"}
          {"  "}<span className="tok-a">domain_name</span>{"       = "}<span className="tok-s">"exemplo.com"</span>{"\n"}
          {"  "}<span className="tok-a">validation_method</span>{" = "}<span className="tok-s">"DNS"</span>{"\n"}
          {"}"}
        </CodeBlock>
        <CodeBlock>
          {"aws sts get-caller-identity     "}<span className="tok-c"># SEMPRE confirme conta e papel antes de um apply</span>
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt={<>O erro mais caro de iniciantes é aplicar na conta errada (produção em vez de dev). <code>allowed_account_ids</code> no provider e o hábito de rodar <code>aws sts get-caller-identity</code> antes do <code>apply</code> evitam isso.</>} en={<>The costliest beginner mistake is applying to the wrong account (production instead of dev). <code>allowed_account_ids</code> on the provider and the habit of running <code>aws sts get-caller-identity</code> before <code>apply</code> prevent it.</>} /></Callout>
      </Section>
      <Section id="aws-state" title={<T pt="AWS: estado remoto no S3" en="AWS: remote state on S3" />}>
        <p><T pt={<>O estado em equipe vai para um <em>bucket S3</em>. Desde o Terraform 1.10 o backend S3 tem <em>trava nativa</em> (<code>use_lockfile = true</code>): ele grava um arquivo <code>.tflock</code> ao lado do estado, sem precisar de DynamoDB (o bloqueio por DynamoDB ainda existe, mas está obsoleto). Existe um ovo-e-galinha: o bucket precisa existir <em>antes</em> do Terraform que o usa. A solução mais simples é criá-lo uma vez à mão (ou com um pequeno projeto de “bootstrap” de estado local).</>} en={<>In a team, state goes into an <em>S3 bucket</em>. Since Terraform 1.10 the S3 backend has <em>native locking</em> (<code>use_lockfile = true</code>): it writes a <code>.tflock</code> file next to the state, with no DynamoDB needed (DynamoDB locking still exists but is deprecated). There is a chicken-and-egg problem: the bucket must exist <em>before</em> the Terraform that uses it. The simplest fix is to create it once by hand (or with a tiny local-state “bootstrap” project).</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>Estado remoto no S3: um arquivo por projeto/ambiente (<code>key</code>), versionado e travado.</>} en={<>Remote state in S3: one file per project/environment (<code>key</code>), versioned and locked.</>} />}>
          <svg viewBox="0 0 640 226" role="img" aria-label="Estado remoto no S3 / Remote state in S3">
            <rect x="10" y="20" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="70.0" y="49.0" className="pt" textAnchor="middle">Você (SSO)</text>
            <text x="70.0" y="49.0" className="en" textAnchor="middle">You (SSO)</text>
            <rect x="10" y="90" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="70.0" y="119.0" className="" textAnchor="middle">CI (OIDC)</text>
            <rect x="190" y="50" width="130" height="70" rx="4" className="brandfill" />
            <text x="255.0" y="89.0" className="mono" textAnchor="middle">terraform</text>
            <rect x="400" y="10" width="230" height="150" rx="4" className="ln" />
            <text x="515" y="32" className="pt" textAnchor="middle">Bucket S3 do estado</text>
            <text x="515" y="32" className="en" textAnchor="middle">State S3 bucket</text>
            <text x="414" y="60" className="mono">loja/dev/terraform.tfstate</text>
            <text x="414" y="82" className="pt mono mut">… .tfstate.tflock (trava)</text>
            <text x="414" y="82" className="en mono mut">… .tfstate.tflock (lock)</text>
            <text x="414" y="112" className="pt">✓ versionamento (recuperar)</text>
            <text x="414" y="112" className="en">✓ versioning (recover)</text>
            <text x="414" y="132" className="pt">✓ criptografia ✓ sem acesso público</text>
            <text x="414" y="132" className="en">✓ encryption ✓ no public access</text>
            <path d="M130 45L190 70" className="ln" />
            <path d="M182.0 70.4L190 70L184.7 64.0" className="ln" />
            <path d="M130 115L190 100" className="ln" />
            <path d="M183.9 105.1L190 100L182.2 98.4" className="ln" />
            <path d="M320 85L400 85" className="ln" />
            <path d="M392.8 88.5L400 85L392.8 81.5" className="ln" />
            <text x="360" y="76" className="pt mut" textAnchor="middle">estado</text>
            <text x="360" y="76" className="en mut" textAnchor="middle">state</text>
            <rect x="190" y="150" width="130" height="40" rx="4" className="ln fillsoft" />
            <text x="255.0" y="174.0" className="pt" textAnchor="middle">API da AWS</text>
            <text x="255.0" y="174.0" className="en" textAnchor="middle">AWS API</text>
            <path d="M255 120L255 150" className="ln" />
            <path d="M251.5 142.8L255 150L258.5 142.8" className="ln" />
            <text x="10" y="210" className="pt mut">Quem aplica primeiro cria o .tflock; quem tentar ao mesmo tempo recebe “Error acquiring the state lock”.</text>
            <text x="10" y="210" className="en mut">Whoever applies first creates the .tflock; anyone trying at the same time gets “Error acquiring the state lock”.</text>
          </svg>
        </Diagram>
        <CodeBlock>
          <span className="tok-c"># Bootstrap (uma vez por conta). Troque nome e região; S3 exige nome GLOBALMENTE único.</span>{"\n"}
          {"BUCKET=acme-tfstate-123456789012\n"}
          {"REGION=sa-east-1\n"}
          {"\n"}
          {"aws s3api create-bucket --bucket $BUCKET --region $REGION \\\n"}
          {"  --create-bucket-configuration LocationConstraint=$REGION   "}<span className="tok-c"># (em us-east-1 omita esta linha)</span>{"\n"}
          {"aws s3api put-bucket-versioning --bucket $BUCKET \\\n"}
          {"  --versioning-configuration Status=Enabled\n"}
          {"aws s3api put-public-access-block --bucket $BUCKET \\\n"}
          {"  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"}
        </CodeBlock>
        <CodeBlock>
          <span className="tok-c"># backend.tf (o bloco backend NÃO aceita variáveis)</span>{"\n"}
          <span className="tok-k">terraform</span>{" {\n"}
          {"  "}<span className="tok-k">backend</span>{" "}<span className="tok-s">"s3"</span>{" {\n"}
          {"    "}<span className="tok-a">bucket</span>{"       = "}<span className="tok-s">"acme-tfstate-123456789012"</span>{"\n"}
          {"    "}<span className="tok-a">key</span>{"          = "}<span className="tok-s">"loja/dev/terraform.tfstate"</span>{"   "}<span className="tok-c"># um "key" por projeto e ambiente</span>{"\n"}
          {"    "}<span className="tok-a">region</span>{"       = "}<span className="tok-s">"sa-east-1"</span>{"\n"}
          {"    "}<span className="tok-a">encrypt</span>{"      = true\n"}
          {"    "}<span className="tok-a">use_lockfile</span>{" = true                           "}<span className="tok-c"># trava nativa (Terraform &gt;= 1.10)</span>{"\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <CodeBlock>
          {"terraform init                    "}<span className="tok-c"># detecta o backend novo e oferece migrar o estado local</span>{"\n"}
          {"terraform init -migrate-state     "}<span className="tok-c"># (ou explicitamente)</span>{"\n"}
          {"terraform init -backend-config="}<span className="tok-s">"key=loja/prod/terraform.tfstate"</span>{"   "}<span className="tok-c"># muda o key sem editar o código</span>
        </CodeBlock>
        <p><T pt="Permissões mínimas do papel que roda o Terraform sobre o estado:" en="Minimum permissions for the role that runs Terraform over the state:" /></p>
        <CodeBlock>
          {"{\n"}
          {"  "}<span className="tok-s">"Version"</span>{": "}<span className="tok-s">"2012-10-17"</span>{",\n"}
          {"  "}<span className="tok-s">"Statement"</span>{": [\n"}
          {"    { "}<span className="tok-s">"Effect"</span>{": "}<span className="tok-s">"Allow"</span>{", "}<span className="tok-s">"Action"</span>{": "}<span className="tok-s">"s3:ListBucket"</span>{",\n"}
          {"      "}<span className="tok-s">"Resource"</span>{": "}<span className="tok-s">"arn:aws:s3:::acme-tfstate-123456789012"</span>{" },\n"}
          {"    { "}<span className="tok-s">"Effect"</span>{": "}<span className="tok-s">"Allow"</span>{", "}<span className="tok-s">"Action"</span>{": ["}<span className="tok-s">"s3:GetObject"</span>{", "}<span className="tok-s">"s3:PutObject"</span>{", "}<span className="tok-s">"s3:DeleteObject"</span>{"],\n"}
          {"      "}<span className="tok-s">"Resource"</span>{": "}<span className="tok-s">"arn:aws:s3:::acme-tfstate-123456789012/loja/*"</span>{" }\n"}
          {"  ]\n"}
          {"}"}
        </CodeBlock>
        <Callout icon="check"><T pt="Se o estado for apagado ou corrompido, o versionamento do bucket permite voltar a uma versão anterior. Guarde o bucket de estado em uma conta de infraestrutura/“shared” e restrinja o acesso: ele contém segredos." en="If the state is deleted or corrupted, bucket versioning lets you go back to an earlier version. Keep the state bucket in an infrastructure/“shared” account and restrict access: it contains secrets." /></Callout>
      </Section>
      <Section id="aws-stack" title={<T pt="AWS: VPC, EC2 e S3 passo a passo" en="AWS: VPC, EC2 and S3 step by step" />}>
        <p><T pt={<>Vamos montar uma pilha pequena e realista: uma <em>VPC</em> com subnets públicas, um servidor <em>EC2</em> com nginx acessível por HTTP, <em>sem SSH</em> (acesso pelo Session Manager do SSM, com papel IAM) e um <em>bucket S3</em> privado. É o mesmo esqueleto de muitos ambientes reais, em ponto pequeno.</>} en={<>Let us build a small, realistic stack: a <em>VPC</em> with public subnets, an <em>EC2</em> server running nginx reachable over HTTP, <em>no SSH</em> (access through SSM Session Manager, with an IAM role) and a private <em>S3 bucket</em>. It is the skeleton of many real environments, in miniature.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>A pilha construída nesta seção. O Terraform (do seu notebook ou do CI) cria tudo; o estado vive no bucket <code>tfstate</code>.</>} en={<>The stack built in this section. Terraform (from your laptop or CI) creates everything; the state lives in the <code>tfstate</code> bucket.</>} />}>
          <svg viewBox="0 0 640 336" role="img" aria-label="Arquitetura da pilha AWS / AWS stack architecture">
            <rect x="10" y="50" width="620" height="270" rx="4" className="ln dash" />
            <text x="140" y="70" className="pt mut">Conta AWS · sa-east-1</text>
            <text x="140" y="70" className="en mut">AWS account · sa-east-1</text>
            <rect x="20" y="6" width="90" height="30" rx="4" className="ln fillsoft" />
            <text x="65.0" y="25.0" className="" textAnchor="middle">Internet</text>
            <rect x="20" y="120" width="90" height="36" rx="4" className="ln" />
            <text x="65.0" y="142.0" className="" textAnchor="middle">Internet GW</text>
            <path d="M65 36L65 120" className="ln" />
            <path d="M61.5 112.8L65 120L68.5 112.8" className="ln" />
            <rect x="130" y="85" width="290" height="220" rx="4" className="ln" />
            <text x="142" y="104" className="mono">VPC 10.0.0.0/16</text>
            <rect x="145" y="115" width="130" height="175" rx="4" className="ln fillsoft" />
            <text x="155" y="132" className="pt mut">subnet pública a</text>
            <text x="155" y="132" className="en mut">public subnet a</text>
            <rect x="155" y="150" width="110" height="125" rx="4" className="ln dash" />
            <text x="163" y="166" className="mut">Security Group</text>
            <rect x="165" y="180" width="90" height="48" rx="4" className="brandfill" />
            <text x="210.0" y="208.0" className="brandtext" textAnchor="middle">EC2 nginx</text>
            <text x="210" y="250" className="pt mut" textAnchor="middle">:80 de entrada</text>
            <text x="210" y="250" className="en mut" textAnchor="middle">:80 inbound</text>
            <rect x="290" y="115" width="120" height="175" rx="4" className="ln fillsoft" />
            <text x="300" y="132" className="pt mut">subnet pública b</text>
            <text x="300" y="132" className="en mut">public subnet b</text>
            <text x="350" y="160" className="pt mut" textAnchor="middle">(reserva)</text>
            <text x="350" y="160" className="en mut" textAnchor="middle">(spare)</text>
            <path d="M110 138L145 138" className="ln" />
            <path d="M137.8 141.5L145 138L137.8 134.5" className="ln" />
            <rect x="470" y="60" width="150" height="36" rx="4" className="ln fillsoft" />
            <text x="545.0" y="82.0" className="" textAnchor="middle">S3: tfstate</text>
            <rect x="470" y="112" width="150" height="36" rx="4" className="ln fillsoft" />
            <text x="545.0" y="134.0" className="pt" textAnchor="middle">S3: assets (privado)</text>
            <text x="545.0" y="134.0" className="en" textAnchor="middle">S3: assets (private)</text>
            <rect x="470" y="170" width="150" height="44" rx="4" className="ln" />
            <text x="545.0" y="189.0" className="" textAnchor="middle">IAM role + profile</text>
            <text x="545.0" y="205.0" className="pt mut mono" textAnchor="middle">acesso via SSM</text>
            <text x="545.0" y="205.0" className="en mut mono" textAnchor="middle">access via SSM</text>
            <rect x="470" y="232" width="150" height="36" rx="4" className="ln fillsoft" />
            <text x="545.0" y="254.0" className="" textAnchor="middle">SSM Session Manager</text>
            <path d="M255 200L470 192" className="ln dash" />
            <path d="M462.9 195.7L470 192L462.7 188.8" className="ln" />
            <path d="M545 214L545 232" className="ln" />
            <path d="M541.5 224.8L545 232L548.5 224.8" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="Variáveis e rede" en="Variables and network" /></h3>
        <CodeBlock>
          <span className="tok-c"># variables.tf</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"project"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"    = string\n"}
          {"  "}<span className="tok-a">default</span>{" = "}<span className="tok-s">"loja"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"environment"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"    = string\n"}
          {"  "}<span className="tok-a">default</span>{" = "}<span className="tok-s">"dev"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"region"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"    = string\n"}
          {"  "}<span className="tok-a">default</span>{" = "}<span className="tok-s">"sa-east-1"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"account_id"</span>{" {\n"}
          {"  "}<span className="tok-a">type</span>{"        = string\n"}
          {"  "}<span className="tok-a">description</span>{" = "}<span className="tok-s">"ID da conta onde é permitido aplicar"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># network.tf</span>{"\n"}
          <span className="tok-k">data</span>{" "}<span className="tok-s">"aws_availability_zones"</span>{" "}<span className="tok-s">"available"</span>{" {\n"}
          {"  "}<span className="tok-a">state</span>{" = "}<span className="tok-s">"available"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">data</span>{" "}<span className="tok-s">"aws_caller_identity"</span>{" "}<span className="tok-s">"current"</span>{" {}\n"}
          {"\n"}
          <span className="tok-k">module</span>{" "}<span className="tok-s">"vpc"</span>{" {\n"}
          {"  "}<span className="tok-a">source</span>{"  = "}<span className="tok-s">"terraform-aws-modules/vpc/aws"</span>{"\n"}
          {"  "}<span className="tok-a">version</span>{" = "}<span className="tok-s">"~&gt; 6.0"</span>{"\n"}
          {"\n"}
          {"  "}<span className="tok-a">name</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;"</span>{"\n"}
          {"  "}<span className="tok-a">cidr</span>{" = "}<span className="tok-s">"10.0.0.0/16"</span>{"\n"}
          {"\n"}
          {"  "}<span className="tok-a">azs</span>{"            = slice("}<span className="tok-k">data</span>{".aws_availability_zones.available.names, "}<span className="tok-n">0</span>{", "}<span className="tok-n">2</span>{")\n"}
          {"  "}<span className="tok-a">public_subnets</span>{" = ["}<span className="tok-s">"10.0.1.0/24"</span>{", "}<span className="tok-s">"10.0.2.0/24"</span>{"]\n"}
          {"\n"}
          {"  "}<span className="tok-a">enable_nat_gateway</span>{" = false   "}<span className="tok-c"># NAT Gateway cobra por hora; só ligue se houver subnets privadas</span>{"\n"}
          {"}"}
        </CodeBlock>
        <h3><T pt="Segurança, papel e servidor" en="Security, role and server" /></h3>
        <CodeBlock>
          <span className="tok-c"># security.tf</span>{"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_security_group"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">name_prefix</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-web-"</span>{"\n"}
          {"  "}<span className="tok-a">description</span>{" = "}<span className="tok-s">"HTTP de entrada, tudo de saida"</span>{"\n"}
          {"  "}<span className="tok-a">vpc_id</span>{"      = "}<span className="tok-k">module</span>{".vpc.vpc_id\n"}
          {"\n"}
          {"  "}<span className="tok-k">lifecycle</span>{" {\n"}
          {"    "}<span className="tok-a">create_before_destroy</span>{" = true\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_vpc_security_group_ingress_rule"</span>{" "}<span className="tok-s">"http"</span>{" {\n"}
          {"  "}<span className="tok-a">security_group_id</span>{" = aws_security_group.web.id\n"}
          {"  "}<span className="tok-a">cidr_ipv4</span>{"         = "}<span className="tok-s">"0.0.0.0/0"</span>{"\n"}
          {"  "}<span className="tok-a">from_port</span>{"         = "}<span className="tok-n">80</span>{"\n"}
          {"  "}<span className="tok-a">to_port</span>{"           = "}<span className="tok-n">80</span>{"\n"}
          {"  "}<span className="tok-a">ip_protocol</span>{"       = "}<span className="tok-s">"tcp"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_vpc_security_group_egress_rule"</span>{" "}<span className="tok-s">"all"</span>{" {\n"}
          {"  "}<span className="tok-a">security_group_id</span>{" = aws_security_group.web.id\n"}
          {"  "}<span className="tok-a">cidr_ipv4</span>{"         = "}<span className="tok-s">"0.0.0.0/0"</span>{"\n"}
          {"  "}<span className="tok-a">ip_protocol</span>{"       = "}<span className="tok-s">"-1"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># iam.tf (acesso por SSM: sem chave SSH e sem porta 22)</span>{"\n"}
          <span className="tok-k">data</span>{" "}<span className="tok-s">"aws_iam_policy_document"</span>{" "}<span className="tok-s">"ec2_assume"</span>{" {\n"}
          {"  "}<span className="tok-k">statement</span>{" {\n"}
          {"    "}<span className="tok-a">actions</span>{" = ["}<span className="tok-s">"sts:AssumeRole"</span>{"]\n"}
          {"    "}<span className="tok-k">principals</span>{" {\n"}
          {"      "}<span className="tok-a">type</span>{"        = "}<span className="tok-s">"Service"</span>{"\n"}
          {"      "}<span className="tok-a">identifiers</span>{" = ["}<span className="tok-s">"ec2.amazonaws.com"</span>{"]\n"}
          {"    }\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_iam_role"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">name</span>{"               = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;-web"</span>{"\n"}
          {"  "}<span className="tok-a">assume_role_policy</span>{" = "}<span className="tok-k">data</span>{".aws_iam_policy_document.ec2_assume.json\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_iam_role_policy_attachment"</span>{" "}<span className="tok-s">"ssm"</span>{" {\n"}
          {"  "}<span className="tok-a">role</span>{"       = aws_iam_role.web.name\n"}
          {"  "}<span className="tok-a">policy_arn</span>{" = "}<span className="tok-s">"arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_iam_instance_profile"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">name</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;-web"</span>{"\n"}
          {"  "}<span className="tok-a">role</span>{" = aws_iam_role.web.name\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># compute.tf</span>{"\n"}
          <span className="tok-k">data</span>{" "}<span className="tok-s">"aws_ssm_parameter"</span>{" "}<span className="tok-s">"al2023"</span>{" {\n"}
          {"  "}<span className="tok-a">name</span>{" = "}<span className="tok-s">"/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_instance"</span>{" "}<span className="tok-s">"web"</span>{" {\n"}
          {"  "}<span className="tok-a">ami</span>{"                         = "}<span className="tok-k">data</span>{".aws_ssm_parameter.al2023.value\n"}
          {"  "}<span className="tok-a">instance_type</span>{"               = "}<span className="tok-s">"t3.micro"</span>{"\n"}
          {"  "}<span className="tok-a">subnet_id</span>{"                   = "}<span className="tok-k">module</span>{".vpc.public_subnets["}<span className="tok-n">0</span>{"]\n"}
          {"  "}<span className="tok-a">vpc_security_group_ids</span>{"      = [aws_security_group.web.id]\n"}
          {"  "}<span className="tok-a">iam_instance_profile</span>{"        = aws_iam_instance_profile.web.name\n"}
          {"  "}<span className="tok-a">associate_public_ip_address</span>{" = true\n"}
          {"\n"}
          {"  "}<span className="tok-a">user_data</span>{" = "}<span className="tok-k">&lt;&lt;-EOT</span>{"\n"}
          {"    "}<span className="tok-c">#!/bin/bash</span>{"\n"}
          {"    dnf install -y nginx\n"}
          {"    systemctl enable --now nginx\n"}
          {"  EOT\n"}
          {"\n"}
          {"  metadata_options {\n"}
          {"    "}<span className="tok-a">http_tokens</span>{" = "}<span className="tok-s">"required"</span>{"        "}<span className="tok-c"># IMDSv2 obrigatório</span>{"\n"}
          {"  }\n"}
          {"\n"}
          {"  root_block_device {\n"}
          {"    "}<span className="tok-a">encrypted</span>{" = true\n"}
          {"  }\n"}
          {"\n"}
          {"  "}<span className="tok-a">tags</span>{" = {\n"}
          {"    "}<span className="tok-a">Name</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;-web"</span>{"\n"}
          {"  }\n"}
          {"\n"}
          {"  "}<span className="tok-k">lifecycle</span>{" {\n"}
          {"    "}<span className="tok-a">ignore_changes</span>{" = [ami]          "}<span className="tok-c"># a AMI "latest" muda com o tempo: não recriar o servidor por isso</span>{"\n"}
          {"  }\n"}
          {"}"}
        </CodeBlock>
        <h3><T pt="Bucket privado e saídas" en="Private bucket and outputs" /></h3>
        <CodeBlock>
          <span className="tok-c"># storage.tf</span>{"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_s3_bucket"</span>{" "}<span className="tok-s">"assets"</span>{" {\n"}
          {"  "}<span className="tok-a">bucket</span>{" = "}<span className="tok-s">"$&#123;var.project&#125;-$&#123;var.environment&#125;-assets-$&#123;data.aws_caller_identity.current.account_id&#125;"</span>{"\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_s3_bucket_public_access_block"</span>{" "}<span className="tok-s">"assets"</span>{" {\n"}
          {"  "}<span className="tok-a">bucket</span>{"                  = aws_s3_bucket.assets.id\n"}
          {"  "}<span className="tok-a">block_public_acls</span>{"       = true\n"}
          {"  "}<span className="tok-a">block_public_policy</span>{"     = true\n"}
          {"  "}<span className="tok-a">ignore_public_acls</span>{"      = true\n"}
          {"  "}<span className="tok-a">restrict_public_buckets</span>{" = true\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"aws_s3_bucket_versioning"</span>{" "}<span className="tok-s">"assets"</span>{" {\n"}
          {"  "}<span className="tok-a">bucket</span>{" = aws_s3_bucket.assets.id\n"}
          {"  versioning_configuration {\n"}
          {"    "}<span className="tok-a">status</span>{" = "}<span className="tok-s">"Enabled"</span>{"\n"}
          {"  }\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-c"># outputs.tf</span>{"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"web_instance_id"</span>{" {\n"}
          {"  "}<span className="tok-a">value</span>{" = aws_instance.web.id\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"web_public_ip"</span>{" {\n"}
          {"  "}<span className="tok-a">value</span>{" = aws_instance.web.public_ip\n"}
          {"}\n"}
          {"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"assets_bucket"</span>{" {\n"}
          {"  "}<span className="tok-a">value</span>{" = aws_s3_bucket.assets.bucket\n"}
          {"}"}
        </CodeBlock>
        <CodeBlock>
          {"export AWS_PROFILE=dev\n"}
          {"aws sts get-caller-identity                     "}<span className="tok-c"># conta certa?</span>{"\n"}
          {"terraform init\n"}
          {"terraform plan -var account_id=123456789012 -out=tfplan\n"}
          {"terraform apply tfplan\n"}
          {"\n"}
          {"curl http://$(terraform output -raw web_public_ip)           "}<span className="tok-c"># página do nginx</span>{"\n"}
          {"aws ssm start-session --target $(terraform output -raw web_instance_id)   "}<span className="tok-c"># shell sem SSH</span>{"\n"}
          {"\n"}
          {"terraform destroy -var account_id=123456789012  "}<span className="tok-c"># ao terminar o estudo, para não gerar custo</span>
        </CodeBlock>
        <Callout tone="warn" icon="alert"><T pt={<>Custo: uma <code>t3.micro</code> custa centavos por hora, mas <em>endereço IPv4 público</em> e <em>NAT Gateway</em> também cobram por hora, e volumes/IPs esquecidos continuam cobrando. Faça <code>destroy</code> ao terminar, use uma conta de estudo e configure um alerta de orçamento (AWS Budgets). Para o bucket, <code>destroy</code> falha se ele tiver objetos (<code>BucketNotEmpty</code>); em ambientes de teste use <code>force_destroy = true</code>.</>} en={<>Cost: a <code>t3.micro</code> costs cents per hour, but a <em>public IPv4 address</em> and a <em>NAT Gateway</em> also bill by the hour, and forgotten volumes/IPs keep billing. Run <code>destroy</code> when finished, use a study account and set a budget alert (AWS Budgets). For the bucket, <code>destroy</code> fails if it has objects (<code>BucketNotEmpty</code>); in test environments use <code>force_destroy = true</code>.</>} /></Callout>
        <Callout icon="check"><T pt={<>Para aprender, o papel do Terraform pode ser administrador <em>numa conta de estudo isolada</em>. Em ambientes reais, use um papel com as permissões estritamente necessárias (e um papel só de leitura para o <code>plan</code> dos Pull Requests).</>} en={<>For learning, Terraform’s role can be admin <em>in an isolated study account</em>. In real environments, use a role with strictly the needed permissions (and a read-only role for pull-request <code>plan</code>s).</>} /></Callout>
      </Section>
      <Section id="aws-ops" title={<T pt="AWS: padrões, erros e roteiro" en="AWS: patterns, errors and roadmap" />}>
        <h3><T pt="Padrões que se repetem em toda pilha AWS" en="Patterns that repeat in every AWS stack" /></h3>
        <Table
          head={[<T pt="Padrão" en="Pattern" />, <T pt="Como no Terraform" en="How in Terraform" />]}
          rows={[
            [<T pt="Saber “onde estou”" en="Know “where I am”" />, <><code>data.aws_caller_identity.current.account_id</code>, <code>data.aws_region.current</code></>],
            [<T pt="Políticas IAM sem JSON na mão" en="IAM policies without hand-written JSON" />, <T pt={<><code>data "aws_iam_policy_document"</code> (valida e interpola)</>} en={<><code>data "aws_iam_policy_document"</code> (validates and interpolates)</>} />],
            [<T pt="Tags em tudo" en="Tags on everything" />, <T pt={<><code>default_tags</code> no provider + <code>tags</code> só onde for específico</>} en={<><code>default_tags</code> on the provider + <code>tags</code> only where specific</>} />],
            [<T pt="Usar o que outro time criou" en="Use what another team created" />, <T pt={<><code>data "aws_vpc"</code>, <code>data "aws_subnets"</code>, ou ler outputs de outro estado com <code>terraform_remote_state</code></>} en={<><code>data "aws_vpc"</code>, <code>data "aws_subnets"</code>, or read another state’s outputs with <code>terraform_remote_state</code></>} />],
            [<T pt="Segredos" en="Secrets" />, <T pt="Secrets Manager/SSM Parameter Store; o recurso lê em tempo de execução, o código não guarda o valor" en="Secrets Manager/SSM Parameter Store; the resource reads at run time, the code does not hold the value" />],
            [<T pt="Várias contas" en="Several accounts" />, <T pt={<>um provider por conta (<code>alias</code> + <code>assume_role</code>) ou uma pasta/estado por conta</>} en={<>one provider per account (<code>alias</code> + <code>assume_role</code>) or one folder/state per account</>} />],
            [<T pt="Mais de uma região" en="More than one region" />, <T pt={<><code>provider "aws" &#123; alias = "x" region = "…" &#125;</code> e <code>provider = aws.x</code> no recurso</>} en={<><code>provider "aws" &#123; alias = "x" region = "…" &#125;</code> and <code>provider = aws.x</code> on the resource</>} />],
          ]}
        />
        <h3><T pt="Erros comuns e o que fazer" en="Common errors and what to do" /></h3>
        <Table
          head={[<T pt="Mensagem" en="Message" />, <T pt="Causa provável" en="Likely cause" />, <T pt="Solução" en="Fix" />]}
          rows={[
            [<code>Error acquiring the state lock</code>, <T pt="outro apply rodando, ou um que morreu" en="another apply running, or one that died" />, <T pt={<>espere; se for um lock órfão, <code>terraform force-unlock ID</code></>} en={<>wait; for an orphan lock, <code>terraform force-unlock ID</code></>} />],
            [<><code>AccessDenied</code> / <code>UnauthorizedOperation</code></>, <T pt="o papel não tem a permissão" en="the role lacks the permission" />, <T pt={<>leia a ação na mensagem (<code>ec2:RunInstances</code>…), confira <code>sts get-caller-identity</code></>} en={<>read the action in the message (<code>ec2:RunInstances</code>…), check <code>sts get-caller-identity</code></>} />],
            [<code>BucketAlreadyExists</code>, <T pt="nome de bucket é global" en="bucket names are global" />, <T pt="inclua o ID da conta ou um sufixo aleatório" en="include the account ID or a random suffix" />],
            [<><code>EntityAlreadyExists</code> / “already exists”</>, <T pt="o objeto existe mas não está no estado" en="the object exists but is not in the state" />, <T pt={<><code>import</code> (bloco) e rode o plan de novo</>} en={<><code>import</code> (block) and re-run the plan</>} />],
            [<code>Invalid IAM Instance Profile</code>, <T pt="o IAM é eventualmente consistente" en="IAM is eventually consistent" />, <T pt={<>rode o <code>apply</code> de novo; mantenha as referências (não use nomes fixos como texto)</>} en={<>re-run <code>apply</code>; keep references (do not hard-code names as text)</>} />],
            [<><code>BucketNotEmpty</code> / <code>DependencyViolation</code></>, <T pt="destroy de algo ainda em uso" en="destroying something still in use" />, <T pt={<>esvazie o bucket (ou <code>force_destroy</code> em teste); apague antes o que usa a VPC/SG</>} en={<>empty the bucket (or <code>force_destroy</code> in test); delete first whatever uses the VPC/SG</>} />],
            [<code>Invalid for_each argument … known only after apply</code>, <T pt="as chaves dependem de algo ainda não criado" en="keys depend on something not yet created" />, <T pt="use chaves estáticas (nomes que você escreve) e valores dinâmicos" en="use static keys (names you write) and dynamic values" />],
            [<code>Cycle:</code>, <T pt="dois recursos se referenciam" en="two resources reference each other" />, <T pt={<>quebre o ciclo (ex.: regra de SG separada, como <code>aws_vpc_security_group_*_rule</code>)</>} en={<>break the cycle (e.g. separate SG rule, such as <code>aws_vpc_security_group_*_rule</code>)</>} />],
          ]}
        />
        <h3><T pt="Ordem sugerida para aprender AWS com Terraform" en="Suggested order for learning AWS with Terraform" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Conta de estudo, SSO e <code>aws sts get-caller-identity</code>.</>} en={<>Study account, SSO and <code>aws sts get-caller-identity</code>.</>} /></li>
          <li><T pt={<>Um bucket S3 privado (o “hello world” da AWS), com <code>plan</code>/<code>apply</code>/<code>destroy</code>.</>} en={<>A private S3 bucket (AWS’s “hello world”), with <code>plan</code>/<code>apply</code>/<code>destroy</code>.</>} /></li>
          <li><T pt="Backend remoto no S3 e migração do estado local." en="Remote backend on S3 and migrating local state." /></li>
          <li><T pt="A pilha VPC + EC2 + IAM desta nota." en="The VPC + EC2 + IAM stack from this note." /></li>
          <li><T pt={<>Extrair para um módulo e criar <code>envs/dev</code> e <code>envs/prod</code> (contas diferentes).</>} en={<>Extract into a module and create <code>envs/dev</code> and <code>envs/prod</code> (different accounts).</>} /></li>
          <li><T pt={<>Pipeline com OIDC: <code>plan</code> no PR, <code>apply</code> no merge.</>} en={<>Pipeline with OIDC: <code>plan</code> on PRs, <code>apply</code> on merge.</>} /></li>
          <li><T pt={<>Serviços de dados e contêineres: RDS (<code>manage_master_user_password</code>), ECS/Fargate, ALB, Route 53, ACM.</>} en={<>Data and container services: RDS (<code>manage_master_user_password</code>), ECS/Fargate, ALB, Route 53, ACM.</>} /></li>
        </ol>
      </Section>
      <Section id="cheat" title={<T pt="Cola e perguntas de revisão" en="Cheat sheet and review questions" />}>
        <h3><T pt="Cola (cheat sheet)" en="Cheat sheet" /></h3>
        <CodeBlock>
          <span className="tok-c"># bloco # forma mínima</span>{"\n"}
          <span className="tok-k">terraform</span>{" { required_version = "}<span className="tok-s">"&gt;= 1.10"</span>{" }\n"}
          <span className="tok-k">provider</span>{" "}<span className="tok-s">"aws"</span>{"       { region = "}<span className="tok-s">"sa-east-1"</span>{" }\n"}
          <span className="tok-k">resource</span>{" "}<span className="tok-s">"T"</span>{" "}<span className="tok-s">"N"</span>{"     { arg = valor }              "}<span className="tok-c"># criar: T.N.attr</span>{"\n"}
          <span className="tok-k">data</span>{" "}<span className="tok-s">"T"</span>{" "}<span className="tok-s">"N"</span>{"         { arg = valor }              "}<span className="tok-c"># ler: data.T.N.attr</span>{"\n"}
          <span className="tok-k">variable</span>{" "}<span className="tok-s">"v"</span>{"         { type = string }            "}<span className="tok-c"># var.v</span>{"\n"}
          <span className="tok-k">locals</span>{"               { x = "}<span className="tok-s">"$&#123;var.v&#125;-x"</span>{" }         "}<span className="tok-c"># local.x</span>{"\n"}
          <span className="tok-k">output</span>{" "}<span className="tok-s">"o"</span>{"           { value = T.N.attr }\n"}
          <span className="tok-k">module</span>{" "}<span className="tok-s">"m"</span>{"           { source = "}<span className="tok-s">"./m"</span>{" }           "}<span className="tok-c"># module.m.out</span>
        </CodeBlock>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Comando" en="Command" />]}
          rows={[
            [<T pt="começar/atualizar providers" en="start/update providers" />, <><code>terraform init</code> · <code>init -upgrade</code></>],
            [<T pt="ver o que muda e aplicar" en="see what changes and apply" />, <><code>plan -out=tfplan</code> → <code>apply tfplan</code></>],
            [<T pt="listar/ver o que está no estado" en="list/see what is in the state" />, <><code>state list</code> · <code>state show ADDR</code></>],
            [<T pt="recriar um recurso" en="recreate one resource" />, <code>apply -replace=ADDR</code>],
            [<T pt="detectar drift" en="detect drift" />, <code>plan -refresh-only</code>],
            [<T pt="testar uma expressão" en="test an expression" />, <code>terraform console</code>],
            [<T pt="migrar o estado para o backend novo" en="move state to the new backend" />, <code>init -migrate-state</code>],
            [<T pt="apagar tudo" en="delete everything" />, <><code>destroy</code> (com cuidado)</>],
          ]}
        />
        <h3><T pt="Perguntas de revisão (estilo Terraform Associate)" en="Review questions (Terraform Associate style)" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Resposta" en="Answer" />]}
          rows={[
            [<T pt={<>Qual a diferença entre <code>resource</code> e <code>data</code>?</>} en={<>Difference between <code>resource</code> and <code>data</code>?</>} />, <T pt={<><code>resource</code> cria e gerencia; <code>data</code> só lê algo existente.</>} en={<><code>resource</code> creates and manages; <code>data</code> only reads something existing.</>} />],
            [<T pt={<>O que o <code>terraform init</code> faz?</>} en={<>What does <code>terraform init</code> do?</>} />, <T pt="Baixa providers e módulos, prepara o backend e cria o lock file." en="Downloads providers and modules, sets up the backend and creates the lock file." />],
            [<T pt={<>Por que o <code>plan</code> mostra <code>-/+</code>?</>} en={<>Why does the <code>plan</code> show <code>-/+</code>?</>} />, <T pt="O recurso será destruído e recriado porque o argumento alterado não pode ser mudado no lugar." en="The resource will be destroyed and recreated because the changed argument cannot be updated in place." />],
            [<T pt="O que é o state e por que não vai para o Git?" en="What is state and why is it not committed?" />, <T pt="É o mapa código↔realidade; pode ter segredos em texto puro. Use backend remoto, cifrado e com trava." en="It is the code↔reality map; it may hold plain-text secrets. Use a remote, encrypted, locked backend." />],
            [<T pt="Como o Terraform decide a ordem de criação?" en="How does Terraform decide creation order?" />, <T pt={<>Pelo grafo de dependências formado pelas referências; <code>depends_on</code> só para o que não é visível.</>} en={<>By the dependency graph formed by references; <code>depends_on</code> only for what is not visible.</>} />],
            [<T pt={<><code>count</code> ou <code>for_each</code> para uma lista de nomes?</>} en={<><code>count</code> or <code>for_each</code> for a list of names?</>} />, <T pt={<><code>for_each</code>: tem chave estável; com <code>count</code>, remover um item do meio recria os seguintes.</>} en={<><code>for_each</code>: it has a stable key; with <code>count</code>, removing a middle item recreates the following ones.</>} />],
            [<T pt="Como renomear um recurso sem destruí-lo?" en="How to rename a resource without destroying it?" />, <T pt={<>Bloco <code>moved &#123; from = … to = … &#125;</code> (ou <code>terraform state mv</code>).</>} en={<><code>moved &#123; from = … to = … &#125;</code> block (or <code>terraform state mv</code>).</>} />],
            [<T pt="Como trazer para o Terraform algo criado no console?" en="How to bring something created in the console into Terraform?" />, <T pt={<>Bloco <code>import</code> (ou <code>terraform import</code>) e escrever o código correspondente.</>} en={<><code>import</code> block (or <code>terraform import</code>) and write the matching code.</>} />],
            [<T pt={<>O que protege contra dois <code>apply</code> simultâneos?</>} en={<>What protects against two simultaneous <code>apply</code>s?</>} />, <T pt={<>A trava do backend (no S3: <code>use_lockfile = true</code>).</>} en={<>The backend lock (on S3: <code>use_lockfile = true</code>).</>} />],
            [<T pt={<><code>sensitive = true</code> protege o segredo no state?</>} en={<>Does <code>sensitive = true</code> protect the secret in state?</>} />, <T pt="Não; só o oculta na saída. O state continua com o valor." en="No; it only hides it in output. The state still holds the value." />],
            [<T pt={<>Para que serve o <code>.terraform.lock.hcl</code>?</>} en={<>What is <code>.terraform.lock.hcl</code> for?</>} />, <T pt="Fixa as versões exatas dos providers (com hashes) para todos usarem as mesmas; vai para o Git." en="Pins exact provider versions (with hashes) so everyone uses the same; commit it." />],
            [<T pt="Como usar duas regiões AWS no mesmo código?" en="How to use two AWS regions in the same code?" />, <T pt={<>Dois blocos <code>provider "aws"</code>, um com <code>alias</code>, e <code>provider = aws.alias</code> no recurso.</>} en={<>Two <code>provider "aws"</code> blocks, one with <code>alias</code>, and <code>provider = aws.alias</code> on the resource.</>} />],
            [<T pt="Workspaces ou pastas para dev/prod?" en="Workspaces or folders for dev/prod?" />, <T pt="Pastas/estados (e contas) separados: isolamento forte. Workspaces são para cópias efêmeras." en="Separate folders/states (and accounts): strong isolation. Workspaces are for ephemeral copies." />],
          ]}
        />
      </Section>
      <Sources
        links={[
          { label: "HashiCorp. Terraform documentation (language, CLI, backends, tests).", href: "https://developer.hashicorp.com/terraform/docs" },
          { label: "Terraform Registry. AWS provider documentation.", href: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs" },
          { label: "HashiCorp. S3 backend (including use_lockfile).", href: "https://developer.hashicorp.com/terraform/language/backend/s3" },
          { label: "Yevgeniy Brikman. Terraform: Up and Running, 3rd edition. O’Reilly, 2022.", href: "https://www.oreilly.com/library/view/terraform-up-and/9781098116736/" },
          { label: "Anton Babenko. Terraform Best Practices.", href: "https://www.terraform-best-practices.com/" },
          { label: "AWS Prescriptive Guidance. Best practices for using the Terraform AWS Provider.", href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html" },
          { label: "OpenTofu documentation.", href: "https://opentofu.org/docs/" },
        ]}
      />
    </>
  );
}
