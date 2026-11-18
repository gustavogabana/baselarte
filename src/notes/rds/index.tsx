import { Callout, CodeBlock, Diagram, QA, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "rds",
  title: { en: "RDS: dev and prod in one account, tested backups", pt: "RDS: dev e prod na mesma conta, backups testados" },
  seo: {
    title: { en: "Amazon RDS: dev and prod in the same AWS account, and backups you have actually restored", pt: "Amazon RDS: dev e prod na mesma conta AWS, e backups que você já restaurou" },
    description: { en: "How to run development and production RDS databases in one AWS account without them touching each other (network, tags, IAM, KMS, Terraform), how to configure automated backups, snapshots and AWS Backup, and how to test restores on a schedule, with an AWS CLI lab.", pt: "Como rodar bancos RDS de desenvolvimento e produção numa só conta AWS sem um encostar no outro (rede, tags, IAM, KMS, Terraform), como configurar backups automáticos, snapshots e AWS Backup, e como testar restaurações com frequência, com laboratório na AWS CLI." },
  },
  summary: "Amazon RDS in practice for a small team: what RDS manages and what it leaves to you, how to keep development and production databases in a single AWS account isolated (separate VPCs or subnets and security groups, an env tag on everything, IAM policies that deny prod actions by tag, one KMS key and one secret per environment, Terraform with separate state per environment, no production data copied to dev), when to move to separate accounts, how to configure backups (automated backups and point-in-time recovery, manual snapshots, final snapshots and deletion protection, AWS Backup plans and vaults, Vault Lock, cross-region and cross-account copies), and how to test them: a restore drill with the AWS CLI, checks to run on the restored database, measuring RPO and RTO, and AWS Backup restore testing to automate it.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Two databases, one account, <em>and a backup you have already restored.</em></>, pt: <>Dois bancos, uma conta, <em>e um backup que você já restaurou.</em></> },
  heroLede: { en: "Amazon RDS runs the database server for you, but the decisions are still yours: how to keep dev from ever touching prod when both live in the same AWS account, how long to keep backups and where, and how to prove, on a schedule, that a restore actually works.", pt: "O Amazon RDS opera o servidor de banco por você, mas as decisões continuam suas: como impedir que dev encoste em prod quando os dois moram na mesma conta AWS, por quanto tempo e onde guardar backups, e como provar, com frequência, que uma restauração funciona de verdade." },
  published: "2026-11-18",
  updated: "2026-11-18",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que o RDS faz por você" en="What RDS does for you" /> },
        { id: "glossary", title: <T pt="Vocabulário" en="Vocabulary" /> },
        { id: "one-account", title: <T pt="Dev e prod na mesma conta" en="Dev and prod in one account" /> },
        { id: "network", title: <T pt="Rede: nada cruza" en="Network: nothing crosses" /> },
        { id: "iam", title: <T pt="Tags, IAM, KMS e segredos" en="Tags, IAM, KMS and secrets" /> },
        { id: "terraform", title: <T pt="Terraform: um módulo, dois estados" en="Terraform: one module, two states" /> },
        { id: "backups", title: <T pt="Como o RDS faz backup" en="How RDS backs up" /> },
        { id: "configure", title: <T pt="Configurar backups" en="Configuring backups" /> },
        { id: "aws-backup", title: <T pt="AWS Backup: cópias fora do alcance" en="AWS Backup: copies out of reach" /> },
        { id: "test", title: <T pt="Testar: o ensaio de restauração" en="Testing: the restore drill" /> },
        { id: "automate", title: <T pt="Automatizar o teste" en="Automating the test" /> },
        { id: "prod", title: <T pt="Em produção" en="In production" /> },
        { id: "lab", title: <T pt="Exercício: apagar e recuperar" en="Exercise: delete and recover" /> },
        { id: "cheat-rds", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

/** The two environments drawn side by side in the account diagram. */
const ENVIRONMENTS = [
  { x: 30, pt: "VPC dev  10.10.0.0/16", en: "VPC dev  10.10.0.0/16", app: "app-dev", db: "db-dev", az: "1 AZ, t4g.micro" },
  { x: 370, pt: "VPC prod  10.20.0.0/16", en: "VPC prod  10.20.0.0/16", app: "app-prod", db: "db-prod", az: "Multi-AZ, m7g.large" },
];

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que o RDS faz por você" en="What RDS does for you" />}>
        <p><T pt={<>O <strong>Amazon RDS</strong> é o Postgres (ou MySQL, MariaDB, SQL Server, Oracle, Db2) rodando numa máquina que a AWS opera. Você escolhe o motor, a versão, o tamanho e o disco; a AWS instala, aplica patches, faz backup, troca o hardware que falha e, com Multi-AZ, promove a réplica em espera quando a principal cai. O que continua seu: o schema, as queries, os índices, as conexões, o custo, quem acessa e se o backup restaura.</>} en={<><strong>Amazon RDS</strong> is Postgres (or MySQL, MariaDB, SQL Server, Oracle, Db2) running on a machine AWS operates. You pick the engine, the version, the size and the disk; AWS installs it, patches it, backs it up, replaces failed hardware and, with Multi-AZ, promotes the standby when the primary dies. What stays yours: the schema, the queries, the indexes, the connections, the cost, who has access, and whether the backup restores.</>} /></p>
        <Table
          head={[<T pt="Tarefa" en="Task" />, <T pt="Postgres numa EC2" en="Postgres on EC2" />, <T pt="RDS" en="RDS" />]}
          rows={[
            [<T pt="Instalar, atualizar o SO e o motor" en="Install, patch the OS and the engine" />, <T pt="você" en="you" />, <T pt="AWS, na janela de manutenção que você escolhe" en="AWS, in the maintenance window you choose" />],
            [<T pt="Backup e restauração a qualquer segundo" en="Backup and restore to any second" />, <T pt="você (pgBackRest, WAL-G, scripts)" en="you (pgBackRest, WAL-G, scripts)" />, <T pt="ligado com uma configuração" en="on with one setting" />],
            [<T pt="Failover para outra zona" en="Failover to another zone" />, <T pt="você (Patroni, repmgr)" en="you (Patroni, repmgr)" />, <T pt="Multi-AZ: automático, 1 a 2 minutos" en="Multi-AZ: automatic, 1 to 2 minutes" />],
            [<T pt="Acesso root ao servidor" en="Root access to the server" />, <T pt="sim" en="yes" />, <T pt={<>não; extensões só da lista suportada, configuração via <em>parameter group</em></>} en={<>no; extensions only from the supported list, configuration via <em>parameter group</em></>} />],
            [<T pt="Custo" en="Cost" />, <T pt="menor na fatura, maior em horas suas" en="lower on the bill, higher in your hours" />, <T pt="maior na fatura, quase nada de operação" en="higher on the bill, almost no operations" />],
          ]}
        />
        <p><T pt={<>O <strong>Aurora</strong> é a versão da AWS com armazenamento próprio (seis cópias em três zonas, réplicas que leem o mesmo disco). Tudo nesta nota vale para os dois, com uma diferença: no Aurora o backup é do <em>cluster</em>, não da instância, e os comandos mudam de <code>db-instance</code> para <code>db-cluster</code>. Para um projeto pequeno ou médio, RDS Postgres com <code>gp3</code> é o ponto de partida. O básico do Postgres está em <a href="/notas/postgres-for-devs/">Postgres para quem programa</a>.</>} en={<><strong>Aurora</strong> is AWS's own version with its own storage (six copies across three zones, replicas reading the same disk). Everything in this note applies to both, with one difference: in Aurora the backup belongs to the <em>cluster</em>, not the instance, and the commands change from <code>db-instance</code> to <code>db-cluster</code>. For a small or medium project, RDS Postgres on <code>gp3</code> is the starting point. Postgres basics are in <a href="/notas/postgres-for-devs/">Postgres for developers</a>.</>} /></p>
      </Section>

      <Section id="glossary" title={<T pt="Vocabulário" en="Vocabulary" />}>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<T pt="Instância" en="Instance" />, <T pt={<>o servidor de banco, com um <em>identifier</em> (<code>app-prod</code>) e um endpoint DNS</>} en={<>the database server, with an <em>identifier</em> (<code>app-prod</code>) and a DNS endpoint</>} />],
            [<T pt="Classe" en="Instance class" />, <T pt={<>CPU e memória: <code>db.t4g.micro</code> (burst, dev), <code>db.m7g.large</code> (uso geral, prod)</>} en={<>CPU and memory: <code>db.t4g.micro</code> (burstable, dev), <code>db.m7g.large</code> (general purpose, prod)</>} />],
            [<T pt="Subnet group" en="Subnet group" />, <T pt="as sub-redes privadas (em 2 ou mais zonas) onde a instância pode morar" en="the private subnets (in 2 or more zones) the instance may live in" />],
            [<T pt="Security group" en="Security group" />, <T pt="o firewall da instância: quem pode abrir conexão na porta 5432" en="the instance's firewall: who may open a connection on port 5432" />],
            [<T pt="Parameter group" en="Parameter group" />, <T pt={<>a configuração do motor (<code>postgresql.conf</code>); um por ambiente</>} en={<>the engine configuration (<code>postgresql.conf</code>); one per environment</>} />],
            [<strong>Multi-AZ</strong>, <T pt="uma cópia síncrona em espera em outra zona; failover automático. Não serve para leitura (uma read replica serve)" en="a synchronous standby copy in another zone; automatic failover. Not for reads (a read replica is)" />],
            [<T pt="Backup automático" en="Automated backup" />, <T pt="um snapshot diário mais os logs de transação, guardados de 1 a 35 dias; apagado junto com a instância, a menos que você peça para manter" en="a daily snapshot plus the transaction logs, kept 1 to 35 days; deleted with the instance unless you ask to keep it" />],
            [<strong>PITR</strong>, <T pt="point-in-time recovery: restaurar para qualquer segundo dentro da retenção, até uns 5 minutos atrás" en="point-in-time recovery: restore to any second within retention, up to about 5 minutes ago" />],
            [<T pt="Snapshot manual" en="Manual snapshot" />, <T pt="uma foto do disco que você tira e que fica até você apagar, mesmo sem a instância" en="a picture of the disk you take, kept until you delete it, even without the instance" />],
            [<T pt="Snapshot final" en="Final snapshot" />, <T pt="o snapshot manual que o RDS tira ao apagar a instância (se você não pular)" en="the manual snapshot RDS takes when you delete the instance (unless you skip it)" />],
            [<T pt="Deletion protection" en="Deletion protection" />, <T pt="uma trava: a instância não pode ser apagada enquanto estiver ligada" en="a lock: the instance cannot be deleted while it is on" />],
            [<T pt="AWS Backup" en="AWS Backup" />, <T pt="o serviço central de backup: planos, retenção longa, cópia para outra região ou conta" en="the central backup service: plans, long retention, copies to another region or account" />],
            [<T pt="Vault / Vault Lock" en="Vault / Vault Lock" />, <T pt="o cofre onde o AWS Backup guarda pontos de recuperação; com Lock, nem o root apaga antes do prazo" en="the vault where AWS Backup keeps recovery points; with Lock, not even root can delete them early" />],
            [<strong>RPO</strong>, <T pt="quanto dado você aceita perder (o intervalo entre o último ponto restaurável e a falha)" en="how much data you accept losing (the gap between the last restorable point and the failure)" />],
            [<strong>RTO</strong>, <T pt="quanto tempo você aceita ficar fora até o banco voltar" en="how long you accept being down until the database is back" />],
          ]}
        />
      </Section>

      <Section id="one-account" title={<T pt="Dev e prod na mesma conta" en="Dev and prod in one account" />}>
        <p><T pt={<>A recomendação da AWS é uma <strong>conta por ambiente</strong>, dentro de uma AWS Organization: a fronteira de conta é a mais forte que existe, e um erro em dev não alcança prod por construção. Para uma empresa pequena, um projeto de cliente ou o começo de um produto, duas contas (com SSO, faturamento consolidado e pipelines separados) costumam ser mais estrutura do que o time consegue manter. Uma conta só é aceitável se o isolamento for feito <em>de propósito</em>, em quatro camadas:</>} en={<>AWS recommends <strong>one account per environment</strong>, inside an AWS Organization: the account boundary is the strongest there is, and a mistake in dev cannot reach prod by construction. For a small company, a client project or the start of a product, two accounts (with SSO, consolidated billing and separate pipelines) are often more structure than the team can keep up. One account is acceptable if the isolation is done <em>on purpose</em>, in four layers:</>} /></p>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="O que separa" en="What it separates" />, <T pt="Como" en="How" />]}
          rows={[
            [<T pt="Rede" en="Network" />, <T pt="quem consegue abrir uma conexão" en="who can open a connection" />, <T pt="uma VPC por ambiente (ou sub-redes e security groups separados); SG do banco só aceita o SG do app do mesmo ambiente" en="one VPC per environment (or separate subnets and security groups); the database SG only accepts the app SG of the same environment" />],
            [<T pt="Identidade" en="Identity" />, <T pt="quem consegue mudar, apagar ou restaurar" en="who can change, delete or restore" />, <T pt={<>tag <code>env</code> em tudo, políticas IAM que negam ações em <code>env=prod</code> para quem não é de prod</>} en={<>an <code>env</code> tag on everything, IAM policies denying actions on <code>env=prod</code> to anyone who is not prod</>} />],
            [<T pt="Chaves e segredos" en="Keys and secrets" />, <T pt="quem consegue ler os dados e a senha" en="who can read the data and the password" />, <T pt="uma chave KMS e um segredo no Secrets Manager por ambiente" en="one KMS key and one Secrets Manager secret per environment" />],
            [<T pt="Código" en="Code" />, <T pt={<>quem consegue rodar um <code>apply</code> em prod</>} en={<>who can run an <code>apply</code> against prod</>} />, <T pt="Terraform com estado separado por ambiente; o pipeline de prod só roda a partir da main" en="Terraform with separate state per environment; the prod pipeline only runs from main" />],
          ]}
        />
        <Diagram minWidth={640} caption={<T pt="Uma conta, dois ambientes que não se enxergam: cada app só alcança o banco do seu ambiente, e cada banco tem sua chave e seu segredo." en="One account, two environments that cannot see each other: each app only reaches its own environment's database, and each database has its own key and secret." />}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Uma conta AWS com VPCs de dev e prod isoladas / One AWS account with isolated dev and prod VPCs">
            <rect x="10" y="10" width="680" height="250" rx="8" className="ln dash" />
            <text x="24" y="32" className="pt mut" textAnchor="start">conta AWS 1234-5678-9012 · região sa-east-1</text>
            <text x="24" y="32" className="en mut" textAnchor="start">AWS account 1234-5678-9012 · region sa-east-1</text>
            {ENVIRONMENTS.map((env) => (
              <g key={env.db}>
                <rect x={env.x} y="48" width="300" height="196" rx="6" className="ln" />
                <text x={env.x + 14} y="70" className="pt mono" textAnchor="start">{env.pt}</text>
                <text x={env.x + 14} y="70" className="en mono" textAnchor="start">{env.en}</text>
                <rect x={env.x + 20} y="90" width="110" height="40" rx="4" className="ln fillsoft" />
                <text x={env.x + 75} y="115" className="" textAnchor="middle">{env.app}</text>
                <rect x={env.x + 170} y="90" width="110" height="40" rx="4" className="brandfill" />
                <text x={env.x + 225} y="115" className="" textAnchor="middle">{env.db}</text>
                <path d={`M${env.x + 130} 110L${env.x + 170} 110`} className="ln" />
                <path d={`M${env.x + 163.2} 106.7L${env.x + 170} 110L${env.x + 163.2} 113.3`} className="ln" />
                <text x={env.x + 225} y="150" className="mut" textAnchor="middle">{env.az}</text>
                <text x={env.x + 14} y="182" className="mono mut" textAnchor="start">{`tag env=${env.db.slice(3)}`}</text>
                <text x={env.x + 14} y="202" className="mono mut" textAnchor="start">{`kms alias/rds-${env.db.slice(3)}`}</text>
                <text x={env.x + 14} y="222" className="mono mut" textAnchor="start">{`secret ${env.db.slice(3)}/db`}</text>
              </g>
            ))}
            <path d="M330 110L370 110" className="ln dash" />
            <text x="350" y="100" className="mut" textAnchor="middle">✕</text>
          </svg>
        </Diagram>
        <Table
          head={["", "dev", "prod"]}
          rows={[
            [<T pt="Classe" en="Class" />, <code>db.t4g.micro</code>, <T pt={<><code>db.m7g.large</code> (ou o que o uso pedir)</>} en={<><code>db.m7g.large</code> (or whatever the load asks for)</>} />],
            ["Multi-AZ", <T pt="não" en="no" />, <T pt="sim" en="yes" />],
            [<T pt="Retenção de backup" en="Backup retention" />, <T pt="1 dia" en="1 day" />, <T pt="14 a 35 dias + AWS Backup" en="14 to 35 days + AWS Backup" />],
            ["Deletion protection", <T pt="não" en="no" />, <T pt="sim" en="yes" />],
            [<T pt="Snapshot final" en="Final snapshot" />, <T pt="pode pular" en="may skip" />, <T pt="obrigatório" en="mandatory" />],
            [<T pt="Horário" en="Hours" />, <T pt="parado fora do expediente (o RDS religa sozinho depois de 7 dias)" en="stopped outside working hours (RDS restarts it on its own after 7 days)" />, <T pt="sempre ligado" en="always on" />],
            [<T pt="Dados" en="Data" />, <T pt="seed sintético" en="synthetic seed" />, <T pt="reais" en="real" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Não copie o banco de produção para dev "para ter dados realistas". Dev tem mais gente com acesso, menos auditoria e senhas em <code>.env</code>; é ali que dado pessoal vaza (e a LGPD trata isso como incidente). Use um seed gerado, ou restaure um snapshot num ambiente temporário, anonimize lá e só então exporte.</>} en={<>Do not copy the production database into dev "to have realistic data". Dev has more people with access, less auditing and passwords in <code>.env</code>; that is where personal data leaks (and GDPR/LGPD treat it as an incident). Use a generated seed, or restore a snapshot into a temporary environment, anonymize it there, and only then export.</>} /></Callout>
        <p><T pt={<><strong>Quando separar em contas:</strong> quando houver exigência de auditoria ou compliance (PCI, SOC 2), quando o time crescer a ponto de nem todo mundo poder ver prod, quando você precisar de SCPs (políticas que nem o administrador da conta escapa), ou depois do primeiro susto. A migração é tranquila se as quatro camadas acima já existirem: elas viram contas. Veja <a href="/notas/company-accounts/">Contas da empresa</a> e <a href="/notas/aws/">AWS</a>.</>} en={<><strong>When to split into accounts:</strong> when an audit or compliance requirement shows up (PCI, SOC 2), when the team grows to the point where not everyone may see prod, when you need SCPs (policies not even the account admin escapes), or after the first scare. The move is easy if the four layers above already exist: they become accounts. See <a href="/notas/company-accounts/">Company accounts</a> and <a href="/notas/aws/">AWS</a>.</>} /></p>
      </Section>

      <Section id="network" title={<T pt="Rede: nada cruza" en="Network: nothing crosses" />}>
        <p><T pt={<>O jeito mais simples de garantir que o app de dev nunca fale com o banco de prod é ele não ter <em>rota</em> até lá. Duas VPCs sem peering resolvem isso: nenhuma regra mal escrita abre o caminho. Se você já tem uma VPC só, separe pelo security group, que é a regra que de fato decide:</>} en={<>The simplest way to make sure the dev app never talks to the prod database is for it to have no <em>route</em> there. Two VPCs without peering do that: no badly written rule can open the way. If you already have a single VPC, separate by security group, which is the rule that actually decides:</>} /></p>
        <ul>
          <li><T pt={<>O banco fica em <strong>sub-redes privadas</strong>, com <code>publicly_accessible = false</code>. Nunca abra 5432 para <code>0.0.0.0/0</code>, nem "só por um minuto".</>} en={<>The database lives in <strong>private subnets</strong>, with <code>publicly_accessible = false</code>. Never open 5432 to <code>0.0.0.0/0</code>, not even "just for a minute".</>} /></li>
          <li><T pt={<>O SG do banco de prod aceita a porta 5432 <strong>só do SG do app de prod</strong> (uma regra que referencia outro security group, não um bloco de IP). O SG do app de dev nunca aparece ali.</>} en={<>The prod database SG accepts port 5432 <strong>only from the prod app SG</strong> (a rule that references another security group, not an IP range). The dev app SG never appears there.</>} /></li>
          <li><T pt={<>Para acessar o banco do seu computador, use o <strong>Session Manager</strong> (port forwarding por um bastion sem porta aberta) ou um túnel temporário; nada de IP de casa na regra.</>} en={<>To reach the database from your laptop, use <strong>Session Manager</strong> (port forwarding through a bastion with no open port) or a temporary tunnel; no home IP in the rule.</>} /></li>
          <li><T pt={<>O app encontra o banco por um nome estável (um segredo com o host, ou um CNAME numa zona privada do Route 53), não pelo endpoint cravado no código. Isso importa na hora de restaurar, porque <strong>toda restauração cria uma instância nova, com endpoint novo</strong>.</>} en={<>The app finds the database by a stable name (a secret holding the host, or a CNAME in a Route 53 private zone), not by an endpoint hardcoded in the code. This matters when restoring, because <strong>every restore creates a new instance, with a new endpoint</strong>.</>} /></li>
        </ul>
      </Section>

      <Section id="iam" title={<T pt="Tags, IAM, KMS e segredos" en="Tags, IAM, KMS and secrets" />}>
        <p><T pt={<>Numa conta compartilhada, a <strong>tag <code>env</code></strong> é o que diz a quem cada recurso pertence. Coloque em tudo (instância, snapshot, chave, segredo, security group) e ligue <code>copy_tags_to_snapshot</code> para os snapshots herdarem a tag. Depois, deixe o IAM usar essa tag: o papel de desenvolvimento pode fazer quase tudo, menos alterar, apagar ou restaurar recursos de prod.</>} en={<>In a shared account, the <strong><code>env</code> tag</strong> is what says who owns each resource. Put it on everything (instance, snapshot, key, secret, security group) and turn on <code>copy_tags_to_snapshot</code> so snapshots inherit it. Then let IAM use that tag: the development role may do almost anything, except change, delete or restore prod resources.</>} /></p>
        <CodeBlock code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyProdDatabaseChangesOutsideProdRole",
      "Effect": "Deny",
      "Action": [
        "rds:ModifyDBInstance",
        "rds:DeleteDBInstance",
        "rds:DeleteDBSnapshot",
        "rds:RebootDBInstance",
        "rds:StopDBInstance",
        "rds:RestoreDBInstanceToPointInTime",
        "rds:RestoreDBInstanceFromDBSnapshot",
        "rds:ModifyDBSnapshotAttribute",
        "rds:AddTagsToResource",
        "rds:RemoveTagsFromResource"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": { "aws:ResourceTag/env": "prod" }
      }
    },
    {
      "Sid": "DenyReadingProdSecrets",
      "Effect": "Deny",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:*:*:secret:prod/*"
    }
  ]
}`} />
        <p><T pt={<>Anexe essa política ao papel de dev (o que as pessoas assumem pelo SSO e o que o pipeline de dev usa). Note as ações de tag na lista: sem elas, alguém troca <code>env=prod</code> por <code>env=dev</code> e passa pela regra. O pipeline de prod assume outro papel, liberado só para a branch <code>main</code> pelo OIDC do GitHub (veja <a href="/notas/github-aws-oidc/">Deploy do GitHub para a AWS com OIDC</a>).</>} en={<>Attach this policy to the dev role (the one people assume through SSO and the dev pipeline uses). Note the tag actions in the list: without them, someone changes <code>env=prod</code> to <code>env=dev</code> and walks past the rule. The prod pipeline assumes a different role, allowed only for the <code>main</code> branch through GitHub's OIDC (see <a href="/notas/github-aws-oidc/">GitHub to AWS deploys with OIDC</a>).</>} /></p>
        <ul>
          <li><T pt={<><strong>Uma chave KMS por ambiente</strong> (<code>alias/rds-dev</code>, <code>alias/rds-prod</code>), gerenciada por você, não a padrão <code>aws/rds</code>. A política da chave de prod só deixa usar o papel de prod e o RDS. Bônus: snapshots criptografados com a chave padrão não podem ser compartilhados com outra conta; com a sua, podem (você vai precisar disso para copiar backups para fora).</>} en={<><strong>One KMS key per environment</strong> (<code>alias/rds-dev</code>, <code>alias/rds-prod</code>), customer managed, not the default <code>aws/rds</code>. The prod key policy only lets the prod role and RDS use it. Bonus: snapshots encrypted with the default key cannot be shared with another account; with yours, they can (you will need that to copy backups out).</>} /></li>
          <li><T pt={<><strong>Senha no Secrets Manager</strong>, com <code>manage_master_user_password = true</code>: o RDS cria o segredo, gira a senha e você nunca a vê no Terraform nem no state. Um segredo por ambiente, com prefixo (<code>dev/</code>, <code>prod/</code>) para a política acima funcionar.</>} en={<><strong>Password in Secrets Manager</strong>, with <code>manage_master_user_password = true</code>: RDS creates the secret, rotates the password and you never see it in Terraform or in the state. One secret per environment, prefixed (<code>dev/</code>, <code>prod/</code>) so the policy above works.</>} /></li>
          <li><T pt={<><strong>Custos por tag:</strong> ative <code>env</code> como <em>cost allocation tag</em> no Billing e crie um AWS Budget para dev. É assim que você descobre a instância de teste esquecida ligada há três meses.</>} en={<><strong>Costs by tag:</strong> activate <code>env</code> as a <em>cost allocation tag</em> in Billing and create an AWS Budget for dev. That is how you find the test instance left running for three months.</>} /></li>
        </ul>
      </Section>

      <Section id="terraform" title={<T pt="Terraform: um módulo, dois estados" en="Terraform: one module, two states" />}>
        <p><T pt={<>Um módulo descreve o banco uma vez; cada ambiente é uma pasta com seu próprio <em>state</em> e suas variáveis. Estados separados significam que um <code>terraform destroy</code> rodado em <code>envs/dev</code> não tem como tocar prod. Prefira pastas a <em>workspaces</em>: com pastas, o ambiente está no caminho, visível no terminal e no pipeline. Mais em <a href="/notas/terraform/">Terraform</a>.</>} en={<>A module describes the database once; each environment is a folder with its own <em>state</em> and variables. Separate states mean a <code>terraform destroy</code> run in <code>envs/dev</code> has no way to touch prod. Prefer folders to <em>workspaces</em>: with folders, the environment is in the path, visible in the terminal and in the pipeline. More in <a href="/notas/terraform/">Terraform</a>.</>} /></p>
        <CodeBlock code={`infra/
  modules/database/        main.tf, variables.tf, outputs.tf
  envs/
    dev/                   main.tf (module "database" { env = "dev" ... }), backend: state key dev/
    prod/                  main.tf (module "database" { env = "prod" ... }), backend: state key prod/`} />
        <CodeBlock code={`# modules/database/main.tf
locals {
  is_prod = var.env == "prod"
}

resource "aws_db_instance" "main" {
  identifier     = "\${var.app}-\${var.env}"
  engine         = "postgres"
  engine_version = "17"
  instance_class = var.instance_class          # db.t4g.micro in dev, db.m7g.large in prod

  allocated_storage     = 20
  max_allocated_storage = local.is_prod ? 500 : 50   # storage autoscaling ceiling
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.db.arn          # one key per environment

  db_subnet_group_name   = var.subnet_group_name      # private subnets of this env's VPC
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false
  multi_az               = local.is_prod

  username                    = "app_admin"
  manage_master_user_password = true                  # secret in Secrets Manager, rotated by RDS

  # Backups
  backup_retention_period  = local.is_prod ? 14 : 1   # days of point-in-time recovery (max 35)
  backup_window            = "06:00-07:00"            # UTC: 03:00-04:00 in Brasília
  maintenance_window       = "sun:07:30-sun:08:30"    # after the backup window, never overlapping
  copy_tags_to_snapshot    = true
  delete_automated_backups = !local.is_prod           # prod: keep automated backups if the instance is deleted

  deletion_protection       = local.is_prod
  skip_final_snapshot       = !local.is_prod
  final_snapshot_identifier = "\${var.app}-\${var.env}-final"

  auto_minor_version_upgrade   = true
  performance_insights_enabled = true

  tags = { env = var.env, app = var.app, backup = local.is_prod ? "daily" : "none" }
}

resource "aws_security_group_rule" "db_from_app" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.db.id
  source_security_group_id = var.app_security_group_id   # only this env's app
}`} />
        <Callout icon="check"><T pt={<>Adicione <code>lifecycle {"{ prevent_destroy = true }"}</code> ao banco no ambiente de prod (ou num módulo só para prod). Junto com <code>deletion_protection</code>, um plano que tentaria recriar o banco (porque alguém mudou o <code>identifier</code> ou a chave KMS) falha antes de apagar qualquer coisa.</>} en={<>Add <code>lifecycle {"{ prevent_destroy = true }"}</code> to the database in prod (or in a prod-only module). Together with <code>deletion_protection</code>, a plan that would recreate the database (because someone changed the <code>identifier</code> or the KMS key) fails before deleting anything.</>} /></Callout>
      </Section>

      <Section id="backups" title={<T pt="Como o RDS faz backup" en="How RDS backs up" />}>
        <p><T pt={<>O RDS tem dois tipos de backup, e eles se completam:</>} en={<>RDS has two kinds of backup, and they complement each other:</>} /></p>
        <Table
          head={["", <T pt="Backup automático" en="Automated backup" />, <T pt="Snapshot manual" en="Manual snapshot" />]}
          rows={[
            [<T pt="O que é" en="What it is" />, <T pt="snapshot diário + logs de transação enviados ao S3 a cada ~5 min" en="daily snapshot + transaction logs shipped to S3 every ~5 min" />, <T pt="uma foto do disco num momento" en="a picture of the disk at one moment" />],
            [<T pt="Restaura para" en="Restores to" />, <T pt="qualquer segundo dentro da retenção (PITR)" en="any second within retention (PITR)" />, <T pt="exatamente o momento da foto" en="exactly the moment of the picture" />],
            [<T pt="Fica por" en="Kept for" />, <T pt="1 a 35 dias" en="1 to 35 days" />, <T pt="até você apagar" en="until you delete it" />],
            [<T pt="Se a instância for apagada" en="If the instance is deleted" />, <T pt={<>some, a menos que <code>delete_automated_backups = false</code> (aí fica até o fim da retenção)</>} en={<>gone, unless <code>delete_automated_backups = false</code> (then kept until retention ends)</>} />, <T pt="fica" en="stays" />],
            [<T pt="Quando usar" en="When to use" />, <T pt={<>o "desfazer" do dia a dia: o <code>DELETE</code> sem <code>WHERE</code> de ontem</>} en={<>the everyday "undo": yesterday's <code>DELETE</code> without a <code>WHERE</code></>} />, <T pt="antes de migração grande, upgrade de versão, ou para guardar por meses" en="before a big migration, a version upgrade, or to keep for months" />],
          ]}
        />
        <p><T pt={<>Os snapshots são <strong>incrementais</strong> (só os blocos que mudaram desde o anterior) e o RDS dá de graça armazenamento de backup igual ao tamanho do banco na região; acima disso, você paga por GB. O primeiro snapshot de uma instância Single-AZ pode causar uma breve pausa de I/O; com Multi-AZ, o backup é tirado da standby e o primário não sente.</>} en={<>Snapshots are <strong>incremental</strong> (only the blocks changed since the previous one) and RDS gives you free backup storage equal to the database size in the region; beyond that you pay per GB. The first snapshot of a Single-AZ instance can cause a brief I/O pause; with Multi-AZ, the backup is taken from the standby and the primary does not feel it.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Três coisas que surpreendem na primeira restauração: <strong>(1)</strong> restaurar nunca sobrescreve a instância existente, cria uma nova com outro nome e outro endpoint; <strong>(2)</strong> a nova instância sobe com o security group e o parameter group <em>padrão</em> se você não informar os seus; <strong>(3)</strong> o tempo de restauração cresce com o tamanho do banco e com a quantidade de log a reaplicar. Só um teste te diz quanto tempo leva no seu caso.</>} en={<>Three things that surprise people on their first restore: <strong>(1)</strong> restoring never overwrites the existing instance, it creates a new one with another name and another endpoint; <strong>(2)</strong> the new instance comes up with the <em>default</em> security group and parameter group unless you pass yours; <strong>(3)</strong> restore time grows with the database size and the amount of log to replay. Only a test tells you how long it takes in your case.</>} /></Callout>
      </Section>

      <Section id="configure" title={<T pt="Configurar backups" en="Configuring backups" />}>
        <p><T pt={<>Comece pelo que o negócio aceita perder. A pergunta para o cliente ou para você mesmo é: "se o banco sumir agora, quantos minutos de dados podemos perder (RPO) e quantas horas podemos ficar fora (RTO)?" A resposta escolhe a configuração:</>} en={<>Start from what the business can afford to lose. The question for the client, or yourself, is: "if the database vanished right now, how many minutes of data can we lose (RPO) and how many hours can we be down (RTO)?" The answer picks the setup:</>} /></p>
        <Table
          head={[<T pt="Ameaça" en="Threat" />, <T pt="Proteção" en="Protection" />, <T pt="RPO / RTO típicos" en="Typical RPO / RTO" />]}
          rows={[
            [<T pt="hardware ou zona cai" en="hardware or a zone fails" />, "Multi-AZ", <T pt="0 / 1–2 min (automático)" en="0 / 1–2 min (automatic)" />],
            [<T pt={<><code>DELETE</code> errado, migração ruim</>} en={<>a wrong <code>DELETE</code>, a bad migration</>} />, <T pt="PITR (backup automático)" en="PITR (automated backup)" />, <T pt="~5 min / dezenas de minutos" en="~5 min / tens of minutes" />],
            [<T pt="instância apagada por engano" en="instance deleted by mistake" />, <T pt="deletion protection + snapshot final + backups retidos" en="deletion protection + final snapshot + retained backups" />, <T pt="~5 min / dezenas de minutos" en="~5 min / tens of minutes" />],
            [<T pt="região inteira fora" en="a whole region down" />, <T pt="cópia de backup para outra região" en="backup copy to another region" />, <T pt="horas / horas" en="hours / hours" />],
            [<T pt="credencial de admin vazada, ransomware" en="leaked admin credential, ransomware" />, <T pt="cópia para outra conta + Vault Lock" en="copy to another account + Vault Lock" />, <T pt="1 dia / horas" en="1 day / hours" />],
            [<T pt="precisa do dado de 6 meses atrás (auditoria)" en="need the data from 6 months ago (audit)" />, <T pt="AWS Backup com retenção mensal" en="AWS Backup with monthly retention" />, <T pt="1 mês / horas" en="1 month / hours" />],
          ]}
        />
        <h3><T pt="Ligando e conferindo pela CLI" en="Turning it on and checking with the CLI" /></h3>
        <CodeBlock code={`# 14 days of PITR, backup at 03:00 Brasília (06:00 UTC); applies now, no restart
aws rds modify-db-instance --db-instance-identifier app-prod \\
  --backup-retention-period 14 --preferred-backup-window 06:00-07:00 \\
  --copy-tags-to-snapshot --deletion-protection --apply-immediately

# Is it on, and how far back / how recent can I restore?
aws rds describe-db-instances --db-instance-identifier app-prod \\
  --query 'DBInstances[0].{retention:BackupRetentionPeriod,window:PreferredBackupWindow,latest:LatestRestorableTime,protected:DeletionProtection}'

aws rds describe-db-instance-automated-backups --db-instance-identifier app-prod \\
  --query 'DBInstanceAutomatedBackups[0].RestoreWindow'     # {EarliestTime, LatestTime}

# A manual snapshot before a risky migration
aws rds create-db-snapshot --db-instance-identifier app-prod \\
  --db-snapshot-identifier app-prod-before-migration-0042`} />
        <ul>
          <li><T pt={<><code>backup_retention_period = 0</code> desliga os backups automáticos <em>e apaga os existentes</em>. Nunca em prod; considere uma regra do AWS Config (<code>db-instance-backup-enabled</code>) para alertar.</>} en={<><code>backup_retention_period = 0</code> turns automated backups off <em>and deletes the existing ones</em>. Never in prod; consider an AWS Config rule (<code>db-instance-backup-enabled</code>) to alert on it.</>} /></li>
          <li><T pt="A janela de backup e a de manutenção não podem se sobrepor; deixe as duas no horário de menos uso." en="The backup window and the maintenance window cannot overlap; put both in your quietest hours." /></li>
          <li><T pt={<>Para ter PITR também em outra região, ligue a <strong>replicação de backups automáticos</strong> entre regiões (<code>start-db-instance-automated-backups-replication</code>). Precisa de uma chave KMS na região de destino.</>} en={<>To have PITR in another region too, turn on <strong>cross-region automated backup replication</strong> (<code>start-db-instance-automated-backups-replication</code>). It needs a KMS key in the target region.</>} /></li>
        </ul>
      </Section>

      <Section id="aws-backup" title={<T pt="AWS Backup: cópias fora do alcance" en="AWS Backup: copies out of reach" />}>
        <p><T pt={<>O backup automático do RDS mora na mesma conta, gerenciado pelas mesmas credenciais que gerenciam o banco. Se essas credenciais vazam (ou se alguém com acesso decide apagar tudo), os backups vão junto. É exatamente o risco que uma conta compartilhada aumenta. O <strong>AWS Backup</strong> resolve com três peças:</>} en={<>RDS automated backups live in the same account, managed by the same credentials that manage the database. If those credentials leak (or someone with access decides to delete everything), the backups go too. That is exactly the risk a shared account increases. <strong>AWS Backup</strong> addresses it with three pieces:</>} /></p>
        <ul>
          <li><T pt={<><strong>Plano</strong>: quando fazer (diário, mensal), quanto guardar (35 dias, 12 meses) e para onde copiar. Seleciona recursos por tag: <code>backup=daily</code> pega só prod.</>} en={<><strong>Plan</strong>: when to back up (daily, monthly), how long to keep (35 days, 12 months) and where to copy. It selects resources by tag: <code>backup=daily</code> picks prod only.</>} /></li>
          <li><T pt={<><strong>Vault com Vault Lock</strong> em modo <em>compliance</em>: depois do período de carência, ninguém (nem o root da conta, nem a AWS) apaga um ponto de recuperação antes do prazo nem encurta a retenção. É o backup imutável (WORM).</>} en={<><strong>Vault with Vault Lock</strong> in <em>compliance</em> mode: after the grace period, no one (not the account root, not AWS) can delete a recovery point early or shorten retention. It is the immutable (WORM) backup.</>} /></li>
          <li><T pt={<><strong>Cópia para outra conta</strong> (com AWS Organizations) ou para um <em>logically air-gapped vault</em>: uma conta só para backups, onde as credenciais do dia a dia não entram. Mesmo mantendo dev e prod juntos, vale ter essa conta: ela não precisa de rede, app nem gente.</>} en={<><strong>Copy to another account</strong> (with AWS Organizations) or to a <em>logically air-gapped vault</em>: an account just for backups, where everyday credentials never go. Even if you keep dev and prod together, this account is worth having: it needs no network, no app and no people.</>} /></li>
        </ul>
        <CodeBlock code={`resource "aws_backup_vault" "prod" {
  name        = "prod-db"
  kms_key_arn = aws_kms_key.backup.arn
}

resource "aws_backup_vault_lock_configuration" "prod" {
  backup_vault_name   = aws_backup_vault.prod.name
  min_retention_days  = 7
  max_retention_days  = 400
  changeable_for_days = 3            # grace period; after it, the lock is permanent (compliance mode)
}

resource "aws_backup_plan" "prod" {
  name = "prod-db"

  rule {
    rule_name         = "daily"
    target_vault_name = aws_backup_vault.prod.name
    schedule          = "cron(0 7 * * ? *)"      # 07:00 UTC, after the RDS backup window
    lifecycle { delete_after = 35 }

    copy_action {
      destination_vault_arn = var.backup_account_vault_arn   # another region or account
      lifecycle { delete_after = 35 }
    }
  }

  rule {
    rule_name         = "monthly"
    target_vault_name = aws_backup_vault.prod.name
    schedule          = "cron(0 8 1 * ? *)"
    lifecycle { delete_after = 365 }
  }
}

resource "aws_backup_selection" "prod" {
  name         = "tagged-daily"
  plan_id      = aws_backup_plan.prod.id
  iam_role_arn = aws_iam_role.backup.arn
  selection_tag {
    type  = "STRINGEQUALS"
    key   = "backup"
    value = "daily"
  }
}`} />
        <Callout tone="warn" icon="alert"><T pt={<>Teste o Vault Lock num vault de teste antes. No modo compliance, depois de <code>changeable_for_days</code>, não há volta: você paga por aquela retenção até ela vencer, e não dá para apagar o vault enquanto houver pontos dentro.</>} en={<>Try Vault Lock on a test vault first. In compliance mode, once <code>changeable_for_days</code> passes, there is no going back: you pay for that retention until it expires, and the vault cannot be deleted while it holds recovery points.</>} /></Callout>
      </Section>

      <Section id="test" title={<T pt="Testar: o ensaio de restauração" en="Testing: the restore drill" />}>
        <p><T pt={<>Um backup que nunca foi restaurado é uma esperança, não um backup. O console mostrando "backup concluído" diz que um arquivo foi escrito; não diz que ele abre, que tem os dados certos, nem quanto tempo leva para voltar. O teste é simples: <strong>restaurar numa instância nova, isolada, conferir, medir e apagar</strong>. Faça uma vez por mês (ou depois de qualquer mudança de backup, chave ou versão) e anote o resultado.</>} en={<>A backup that has never been restored is a hope, not a backup. The console saying "backup completed" tells you a file was written; it does not tell you it opens, that it holds the right data, or how long it takes to come back. The test is simple: <strong>restore into a new, isolated instance, check it, measure it and delete it</strong>. Do it once a month (or after any change to backups, keys or versions) and write down the result.</>} /></p>
        <h3><T pt="1. Restaurar para um momento" en="1. Restore to a point in time" /></h3>
        <CodeBlock code={`STAMP=$(date -u +%Y%m%d-%H%M)
TARGET=restore-test-$STAMP
START=$(date -u +%s)

aws rds restore-db-instance-to-point-in-time \\
  --source-db-instance-identifier app-prod \\
  --target-db-instance-identifier "$TARGET" \\
  --use-latest-restorable-time \\
  --db-instance-class db.t4g.medium \\
  --no-multi-az \\
  --no-publicly-accessible \\
  --db-subnet-group-name prod-db-private \\
  --vpc-security-group-ids sg-0restoretest00000 \\
  --db-parameter-group-name app-prod-pg17 \\
  --no-deletion-protection \\
  --tags Key=env,Value=restore-test Key=purpose,Value=backup-drill

aws rds wait db-instance-available --db-instance-identifier "$TARGET"
echo "RTO (restore only): $(( ($(date -u +%s) - START) / 60 )) min"`} />
        <ul>
          <li><T pt={<>Use <code>--restore-time 2026-11-18T09:30:00Z</code> em vez de <code>--use-latest-restorable-time</code> para ensaiar o caso real "voltar para antes do erro".</>} en={<>Use <code>--restore-time 2026-11-18T09:30:00Z</code> instead of <code>--use-latest-restorable-time</code> to rehearse the real case "go back to before the mistake".</>} /></li>
          <li><T pt={<>O security group <code>sg-0restoretest…</code> só aceita conexões do seu bastion ou do job de teste: a cópia tem dados de produção, e <strong>o app de produção não pode enxergá-la</strong> (senão algum worker esquecido grava nela).</>} en={<>The <code>sg-0restoretest…</code> security group only accepts connections from your bastion or the test job: the copy holds production data, and <strong>the production app must not see it</strong> (otherwise some forgotten worker writes to it).</>} /></li>
          <li><T pt={<>A tag <code>env=restore-test</code> deixa a política de "nega prod" fora do caminho e permite que o papel de teste apague a instância depois. A senha é a mesma do banco de origem (o segredo de prod).</>} en={<>The <code>env=restore-test</code> tag keeps the "deny prod" policy out of the way and lets the test role delete the instance afterwards. The password is the source database's (the prod secret).</>} /></li>
        </ul>
        <h3><T pt="2. Conferir" en="2. Check" /></h3>
        <p><T pt={<>"Subiu" não é o critério. Confira se os dados estão lá e se são de quando deveriam ser:</>} en={<>"It came up" is not the bar. Check that the data is there and that it is from when it should be:</>} /></p>
        <CodeBlock code={`-- Does it open, and is it the right database?
SELECT current_database(), version(), pg_size_pretty(pg_database_size(current_database()));

-- The newest row: should be minutes before the restore time (this is your real RPO)
SELECT max(created_at) AS newest_order, now() - max(created_at) AS gap FROM orders;

-- Row counts of the tables that matter, to compare with production at the same moment
SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 10;

-- Migrations: the same last version as production
SELECT version, applied_at FROM schema_migrations ORDER BY applied_at DESC LIMIT 1;

-- A business query the app actually runs (an index-backed read, a join)
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;`} />
        <p><T pt={<>Se der, rode a suíte de smoke test do app apontada para a cópia, em modo só leitura. Isso pega o que SQL não pega: extensões faltando, um parameter group diferente, permissões de usuário que não vieram.</>} en={<>If you can, run the app's smoke test suite against the copy, read-only. That catches what SQL does not: missing extensions, a different parameter group, user grants that did not come along.</>} /></p>
        <h3><T pt="3. Medir, anotar e apagar" en="3. Measure, record and delete" /></h3>
        <CodeBlock code={`aws rds delete-db-instance --db-instance-identifier "$TARGET" \\
  --skip-final-snapshot --delete-automated-backups

# One line per drill, in the repo or a spreadsheet:
# date        source    restore point          restore min  RPO gap  checks  who
# 2026-11-18  app-prod  latest (09:41:03 UTC)  23           4m12s    ok      ops-oncall`} />
        <Table
          head={[<T pt="Ensaio" en="Drill" />, <T pt="Frequência" en="How often" />, <T pt="Prova que…" en="Proves that…" />]}
          rows={[
            [<T pt="PITR para o momento mais recente" en="PITR to the latest point" />, <T pt="mensal" en="monthly" />, <T pt="os logs estão chegando e o RPO é o esperado" en="the logs are arriving and the RPO is what you expect" />],
            [<T pt="PITR para um horário específico" en="PITR to a specific time" />, <T pt="trimestral" en="quarterly" />, <T pt={<>você sabe desfazer um <code>DELETE</code> sem pânico</>} en={<>you can undo a <code>DELETE</code> without panic</>} />],
            [<T pt="Restaurar a cópia de outra conta ou região" en="Restore the copy in another account or region" />, <T pt="semestral" en="twice a year" />, <T pt="a chave KMS e as permissões funcionam lá" en="the KMS key and the permissions work there" />],
            [<T pt="Troca completa: app apontando para a cópia" en="Full switch: app pointed at the copy" />, <T pt="anual (num ambiente de ensaio)" en="yearly (in a staging environment)" />, <T pt="o RTO de ponta a ponta, incluindo DNS, segredos e pessoas" en="the end-to-end RTO, including DNS, secrets and people" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Recuperar uma tabela só (o caso mais comum): restaure para um momento antes do erro numa instância temporária, exporte a tabela com <code>pg_dump -t orders</code>, e importe numa tabela auxiliar em prod (<code>orders_recovered</code>) para comparar e copiar só as linhas perdidas. Nunca restaure a instância inteira por cima de prod por causa de uma tabela.</>} en={<>Recovering a single table (the most common case): restore to a point before the mistake into a temporary instance, export the table with <code>pg_dump -t orders</code>, and load it into a side table in prod (<code>orders_recovered</code>) to compare and copy only the lost rows. Never restore the whole instance over prod because of one table.</>} /></Callout>
      </Section>

      <Section id="automate" title={<T pt="Automatizar o teste" en="Automating the test" />}>
        <p><T pt={<>Ensaio manual some da agenda no terceiro mês. Duas formas de automatizar:</>} en={<>A manual drill drops off the calendar by the third month. Two ways to automate it:</>} /></p>
        <ul>
          <li><T pt={<><strong>AWS Backup restore testing:</strong> um <em>restore testing plan</em> escolhe, num cron, um ponto de recuperação (o mais recente ou aleatório numa janela), restaura numa instância temporária, publica o resultado no EventBridge e apaga a instância depois de algumas horas. Você liga uma Lambda no evento para rodar as consultas de verificação e reportar o status de validação. O tempo de restauração fica registrado no console: é o seu RTO medido toda semana.</>} en={<><strong>AWS Backup restore testing:</strong> a <em>restore testing plan</em> picks, on a cron, a recovery point (the latest or a random one in a window), restores it into a temporary instance, publishes the result to EventBridge and deletes the instance after a few hours. You attach a Lambda to the event to run the check queries and report a validation status. The restore duration is recorded in the console: your RTO, measured every week.</>} /></li>
          <li><T pt={<><strong>Um job agendado seu</strong> (GitHub Actions com OIDC, ou EventBridge Scheduler chamando um Step Functions): o script desta seção, com as consultas num <code>psql -f checks.sql</code> e um alerta se algo falhar ou se o RPO medido passar do combinado.</>} en={<><strong>A scheduled job of your own</strong> (GitHub Actions with OIDC, or EventBridge Scheduler calling Step Functions): this section's script, with the queries in a <code>psql -f checks.sql</code> and an alert if anything fails or the measured RPO exceeds the target.</>} /></li>
        </ul>
        <CodeBlock code={`# .github/workflows/restore-drill.yml (outline)
on:
  schedule: [{ cron: "0 9 1 * *" }]       # 1st of each month, 06:00 Brasília
  workflow_dispatch: {}
permissions: { id-token: write, contents: read }
jobs:
  drill:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/restore-drill   # may restore and delete env=restore-test only
          aws-region: sa-east-1
      - run: ./ops/restore-drill.sh          # restore, wait, checks via SSM port forward, delete, print RPO/RTO`} />
        <Callout tone="warn" icon="alert"><T pt={<>Alerta também quando o ensaio <em>não roda</em>. Um job que falha em silêncio por três meses é pior que nenhum, porque dá falsa confiança. Um alarme "nenhum resultado de restore test nos últimos 35 dias" fecha esse buraco.</>} en={<>Alert also when the drill <em>does not run</em>. A job that silently fails for three months is worse than none, because it gives false confidence. An alarm for "no restore test result in the last 35 days" closes that gap.</>} /></Callout>
      </Section>

      <Section id="prod" title={<T pt="Em produção" en="In production" />}>
        <h3><T pt="Checklist" en="Checklist" /></h3>
        <ul>
          <li><T pt={<>Dev e prod em VPCs (ou pelo menos security groups) separados; o SG do banco só aceita o SG do app do mesmo ambiente; <code>publicly_accessible = false</code>.</>} en={<>Dev and prod in separate VPCs (or at least security groups); the database SG only accepts the same environment's app SG; <code>publicly_accessible = false</code>.</>} /></li>
          <li><T pt={<>Tag <code>env</code> em tudo, <code>copy_tags_to_snapshot</code>, política IAM que nega mudanças em <code>env=prod</code> (incluindo mudar a tag) para o papel de dev.</>} en={<>An <code>env</code> tag on everything, <code>copy_tags_to_snapshot</code>, an IAM policy denying changes to <code>env=prod</code> (including changing the tag) for the dev role.</>} /></li>
          <li><T pt="Uma chave KMS gerenciada por você e um segredo por ambiente; senha gerenciada pelo RDS." en="One customer managed KMS key and one secret per environment; password managed by RDS." /></li>
          <li><T pt="Terraform com estado separado por ambiente; prod só aplica a partir da main, com aprovação." en="Terraform with separate state per environment; prod only applies from main, with approval." /></li>
          <li><T pt={<>Prod: Multi-AZ, retenção de 14+ dias, <code>deletion_protection</code>, snapshot final, <code>delete_automated_backups = false</code>, <code>prevent_destroy</code>.</>} en={<>Prod: Multi-AZ, 14+ days retention, <code>deletion_protection</code>, final snapshot, <code>delete_automated_backups = false</code>, <code>prevent_destroy</code>.</>} /></li>
          <li><T pt="AWS Backup com cópia para outra conta ou região, e Vault Lock no vault de destino." en="AWS Backup with a copy to another account or region, and Vault Lock on the destination vault." /></li>
          <li><T pt="Ensaio de restauração mensal, automatizado, com RPO e RTO anotados e alerta se não rodar." en="A monthly, automated restore drill, with RPO and RTO recorded and an alert if it does not run." /></li>
          <li><T pt="O app encontra o banco por um nome estável (segredo ou CNAME), para que trocar para uma instância restaurada seja mudar um valor, não fazer deploy." en="The app finds the database by a stable name (secret or CNAME), so switching to a restored instance means changing one value, not deploying." /></li>
          <li><T pt="Dev parado fora do expediente e com budget; nenhum dado de produção em dev." en="Dev stopped outside working hours and under a budget; no production data in dev." /></li>
        </ul>
      </Section>

      <Section id="lab" title={<T pt="Exercício: apagar e recuperar" en="Exercise: delete and recover" />}>
        <p><T pt={<>Pré-requisitos: AWS CLI configurada numa conta de estudo, a VPC padrão, e <code>psql</code>. Custo: uma <code>db.t4g.micro</code> por cerca de uma hora, duas vezes (centavos de dólar; fora do free tier, ainda menos de um dólar). Você vai criar um banco, gravar dados, "apagar por engano" e voltar para antes do erro. Para simplificar o acesso, o banco do laboratório é público e liberado só para o seu IP; <strong>nunca faça isso com um banco de verdade</strong>.</>} en={<>Prerequisites: the AWS CLI set up on a study account, the default VPC, and <code>psql</code>. Cost: one <code>db.t4g.micro</code> for about an hour, twice (cents; outside the free tier, still under a dollar). You will create a database, write data, "delete it by mistake" and go back to before the mistake. To keep access simple, the lab database is public and open only to your IP; <strong>never do this with a real database</strong>.</>} /></p>
        <CodeBlock code={`MYIP=$(curl -s https://checkip.amazonaws.com)/32
SG=$(aws ec2 create-security-group --group-name rds-lab --description "rds lab" --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id "$SG" --protocol tcp --port 5432 --cidr "$MYIP"

aws rds create-db-instance --db-instance-identifier rds-lab \\
  --engine postgres --db-instance-class db.t4g.micro --allocated-storage 20 \\
  --master-username lab --master-user-password 'change-me-lab-only' \\
  --backup-retention-period 1 --publicly-accessible --vpc-security-group-ids "$SG" \\
  --tags Key=env,Value=lab
aws rds wait db-instance-available --db-instance-identifier rds-lab
HOST=$(aws rds describe-db-instances --db-instance-identifier rds-lab --query 'DBInstances[0].Endpoint.Address' --output text)`} />
        <p><T pt="Grave dados, espere o backup ter algo para restaurar, anote a hora e cometa o erro:" en="Write data, wait for the backup to have something to restore, note the time and make the mistake:" /></p>
        <CodeBlock code={`export PGPASSWORD='change-me-lab-only'
psql "host=$HOST user=lab dbname=postgres sslmode=require" <<'SQL'
CREATE TABLE orders (id serial PRIMARY KEY, total int, created_at timestamptz DEFAULT now());
INSERT INTO orders (total) SELECT (random() * 1000)::int FROM generate_series(1, 5000);
SELECT count(*) FROM orders;      -- 5000
SQL

sleep 600                          # let a transaction log upload happen (~5 min) and a bit more
BEFORE=$(date -u +%Y-%m-%dT%H:%M:%SZ); echo "good point: $BEFORE"
sleep 60

psql "host=$HOST user=lab dbname=postgres sslmode=require" -c "DELETE FROM orders;"   # the mistake`} />
        <p><T pt="Agora recupere para o momento bom, numa instância nova, e confira:" en="Now recover to the good point, into a new instance, and check:" /></p>
        <CodeBlock code={`aws rds describe-db-instances --db-instance-identifier rds-lab --query 'DBInstances[0].LatestRestorableTime'
# wait until LatestRestorableTime is later than $BEFORE

aws rds restore-db-instance-to-point-in-time \\
  --source-db-instance-identifier rds-lab --target-db-instance-identifier rds-lab-restored \\
  --restore-time "$BEFORE" --db-instance-class db.t4g.micro \\
  --publicly-accessible --vpc-security-group-ids "$SG" --tags Key=env,Value=lab
aws rds wait db-instance-available --db-instance-identifier rds-lab-restored

HOST2=$(aws rds describe-db-instances --db-instance-identifier rds-lab-restored --query 'DBInstances[0].Endpoint.Address' --output text)
psql "host=$HOST2 user=lab dbname=postgres sslmode=require" -c "SELECT count(*), max(created_at) FROM orders;"   # 5000 again`} />
        <p><T pt={<><strong>O que observar:</strong> o endpoint mudou (é outra instância); quanto tempo levou entre o comando e o <code>wait</code> terminar (seu RTO para um banco minúsculo); e que <code>max(created_at)</code> é anterior a <code>$BEFORE</code>. Em produção, o passo seguinte seria copiar as linhas de volta ou apontar o app para a instância restaurada.</>} en={<><strong>What to watch:</strong> the endpoint changed (it is another instance); how long it took between the command and the <code>wait</code> finishing (your RTO for a tiny database); and that <code>max(created_at)</code> is before <code>$BEFORE</code>. In production, the next step would be copying the rows back or pointing the app at the restored instance.</>} /></p>
        <CodeBlock code={`# Cleanup (both instances, no final snapshots, then the security group)
for id in rds-lab rds-lab-restored; do
  aws rds delete-db-instance --db-instance-identifier "$id" --skip-final-snapshot --delete-automated-backups
done
aws rds wait db-instance-deleted --db-instance-identifier rds-lab
aws rds wait db-instance-deleted --db-instance-identifier rds-lab-restored
aws ec2 delete-security-group --group-id "$SG"`} />
      </Section>

      <Section id="cheat-rds" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="dev nunca alcançar o banco de prod" en="dev never to reach the prod database" />, <T pt="VPCs separadas; SG do banco aceita só o SG do app do mesmo ambiente" en="separate VPCs; database SG accepts only the same environment's app SG" />],
            [<T pt="dev nunca alterar prod" en="dev never to change prod" />, <T pt={<>tag <code>env</code> + Deny com <code>aws:ResourceTag/env = prod</code></>} en={<><code>env</code> tag + Deny on <code>aws:ResourceTag/env = prod</code></>} />],
            [<T pt="voltar para antes de um erro" en="go back to before a mistake" />, <code>restore-db-instance-to-point-in-time --restore-time</code>],
            [<T pt="guardar antes de uma migração" en="keep a copy before a migration" />, <code>create-db-snapshot</code>],
            [<T pt="não perder backups ao apagar a instância" en="not lose backups when deleting the instance" />, <T pt={<><code>deletion_protection</code>, snapshot final, <code>delete_automated_backups = false</code></>} en={<><code>deletion_protection</code>, final snapshot, <code>delete_automated_backups = false</code></>} />],
            [<T pt="backup que nem o admin apaga" en="a backup not even the admin can delete" />, <T pt="AWS Backup + Vault Lock (compliance) + cópia para outra conta" en="AWS Backup + Vault Lock (compliance) + copy to another account" />],
            [<T pt="saber se o backup funciona" en="know the backup works" />, <T pt="ensaio mensal: restaurar, conferir, medir RPO/RTO, apagar" en="a monthly drill: restore, check, measure RPO/RTO, delete" />],
            [<T pt="automatizar o ensaio" en="automate the drill" />, <T pt="AWS Backup restore testing, ou um job agendado com OIDC" en="AWS Backup restore testing, or a scheduled job with OIDC" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
          [<T pt="Por que a AWS recomenda contas separadas, e quando uma conta só é aceitável?" en="Why does AWS recommend separate accounts, and when is a single account acceptable?" />, <T pt="A conta é a fronteira de isolamento mais forte: permissões, limites e erros não a atravessam. Uma conta só é aceitável em projetos pequenos se rede, identidade (tags + IAM), chaves/segredos e código (estado do Terraform) forem separados de propósito, e se os backups forem copiados para fora dela." en="The account is the strongest isolation boundary: permissions, limits and mistakes do not cross it. A single account is acceptable for small projects if network, identity (tags + IAM), keys/secrets and code (Terraform state) are separated on purpose, and backups are copied out of it." />],
          [<T pt="Por que a política que nega ações em prod também precisa negar mudar tags?" en="Why must the policy denying prod actions also deny changing tags?" />, <T pt="Porque a regra é baseada na tag. Se o papel de dev pode trocar env=prod por env=dev, ele remove a proteção e depois faz o que quiser." en="Because the rule is based on the tag. If the dev role can change env=prod to env=dev, it removes the protection and then does whatever it wants." />],
          [<T pt="Qual a diferença entre backup automático e snapshot manual?" en="What is the difference between an automated backup and a manual snapshot?" />, <T pt="O automático (snapshot diário + logs) permite restaurar para qualquer segundo dentro de 1 a 35 dias e, por padrão, some com a instância. O manual é uma foto de um momento e fica até ser apagado." en="The automated one (daily snapshot + logs) restores to any second within 1 to 35 days and, by default, disappears with the instance. The manual one is a picture of one moment and stays until deleted." />],
          [<T pt="O que acontece com a instância original quando você faz um PITR?" en="What happens to the original instance when you run a PITR?" />, <T pt="Nada. O RDS cria uma instância nova, com outro identificador e outro endpoint. Você decide depois se copia dados de volta ou aponta o app para a nova." en="Nothing. RDS creates a new instance, with another identifier and endpoint. You decide afterwards whether to copy data back or point the app at the new one." />],
          [<T pt="Multi-AZ substitui backup?" en="Does Multi-AZ replace backups?" />, <T pt="Não. Multi-AZ protege contra falha de hardware ou de zona, mas replica tudo na hora, inclusive o DELETE errado. Só o backup volta no tempo." en="No. Multi-AZ protects against hardware or zone failure, but it replicates everything instantly, including the wrong DELETE. Only a backup goes back in time." />],
          [<T pt="Por que usar uma chave KMS gerenciada por você e não a aws/rds?" en="Why use a customer managed KMS key instead of aws/rds?" />, <T pt="Para controlar quem usa a chave (separando dev de prod) e porque snapshots criptografados com a chave padrão não podem ser compartilhados com outra conta, o que impede a cópia de backup para fora." en="To control who can use the key (separating dev from prod), and because snapshots encrypted with the default key cannot be shared with another account, which blocks copying backups out." />],
          [<T pt="O que um ensaio de restauração precisa medir?" en="What must a restore drill measure?" />, <T pt="Se restaura, se os dados são os certos (contagens, versão das migrations, linha mais recente), o RPO real (diferença entre a linha mais recente e o momento pedido) e o RTO (tempo até o banco estar utilizável)." en="Whether it restores, whether the data is right (counts, migration version, newest row), the real RPO (gap between the newest row and the requested time) and the RTO (time until the database is usable)." />],
          [<T pt="Por que a instância restaurada no teste fica num security group próprio?" en="Why does the test restore get its own security group?" />, <T pt="Ela tem dados de produção e não pode ser alcançada pelo app de produção nem por dev: um worker que gravasse nela, ou alguém de dev lendo dados reais, seria um incidente." en="It holds production data and must not be reachable by the production app or by dev: a worker writing to it, or someone in dev reading real data, would be an incident." />],
          [<T pt="Como proteger backups de alguém com credencial de administrador da conta?" en="How do you protect backups from someone holding the account's admin credentials?" />, <T pt="Copiando para outra conta (ou um vault isolado) onde essas credenciais não entram, com Vault Lock em modo compliance, que impede apagar antes do prazo até para o root." en="By copying them to another account (or an isolated vault) those credentials cannot enter, with Vault Lock in compliance mode, which prevents early deletion even by root." />],
        ]} />
      </Section>
      <Sources
        links={[
          { label: "Amazon RDS: Introduction to backups", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" },
          { label: "Amazon RDS: Restoring a DB instance to a specified time", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html" },
          { label: "Amazon RDS: Creating a DB snapshot", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html" },
          { label: "Amazon RDS: Replicating automated backups to another AWS Region", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReplicateBackups.html" },
          { label: "Amazon RDS: Stopping a DB instance temporarily", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html" },
          { label: "Amazon RDS: Password management with Secrets Manager", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html" },
          { label: "AWS Backup: Restore testing", href: "https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing.html" },
          { label: "AWS Backup: Vault Lock", href: "https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html" },
          { label: "AWS Whitepaper: Organizing your AWS environment using multiple accounts", href: "https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html" },
          { label: "Terraform AWS provider: aws_db_instance", href: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance" },
        ]}
      />
    </>
  );
}
