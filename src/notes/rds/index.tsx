import { Callout, CodeBlock, Diagram, QA, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "rds",
  title: "RDS: dev e prod na mesma conta, backups testados",
  seo: {
    title: "Amazon RDS: dev e prod na mesma conta AWS, e backups que você já restaurou",
    description: "Como rodar bancos RDS de desenvolvimento e produção numa só conta AWS sem um encostar no outro (rede, tags, IAM, KMS, Terraform), como configurar backups automáticos, snapshots e AWS Backup, e como testar restaurações com frequência, com laboratório na AWS CLI.",
  },
  summary: "Amazon RDS na prática para um time pequeno: o que o RDS gerencia e o que fica com você, como manter isolados os bancos de desenvolvimento e de produção numa só conta AWS (VPCs ou sub-redes e security groups separados, uma tag env em tudo, políticas IAM que negam ações em prod pela tag, uma chave KMS e um segredo por ambiente, Terraform com estado separado por ambiente, nenhum dado de produção copiado para dev), quando passar para contas separadas, como configurar backups (backups automáticos e point-in-time recovery, snapshots manuais, snapshot final e proteção contra exclusão, planos e cofres do AWS Backup, Vault Lock, cópias entre regiões e entre contas) e como testá-los: um ensaio de restauração com a AWS CLI, o que conferir no banco restaurado, como medir RPO e RTO, e o restore testing do AWS Backup para automatizar.",
  kicker: "Guia prático",
  heroTitle: <>Dois bancos, uma conta, <em>e um backup que você já restaurou.</em></>,
  heroLede: "O Amazon RDS opera o servidor de banco por você, mas as decisões continuam suas: como impedir que dev encoste em prod quando os dois moram na mesma conta AWS, por quanto tempo e onde guardar backups, e como provar, com frequência, que uma restauração funciona de verdade.",
  published: "2026-11-18",
  updated: "2026-11-18",
  toc: [
    {
      items: [
        { id: "what", title: "O que o RDS faz por você" },
        { id: "glossary", title: "Vocabulário" },
        { id: "one-account", title: "Dev e prod na mesma conta" },
        { id: "network", title: "Rede: nada cruza" },
        { id: "iam", title: "Tags, IAM, KMS e segredos" },
        { id: "terraform", title: "Terraform: um módulo, dois estados" },
        { id: "backups", title: "Como o RDS faz backup" },
        { id: "configure", title: "Configurar backups" },
        { id: "aws-backup", title: "AWS Backup: cópias fora do alcance" },
        { id: "test", title: "Testar: o ensaio de restauração" },
        { id: "automate", title: "Automatizar o teste" },
        { id: "prod", title: "Em produção" },
        { id: "lab", title: "Exercício: apagar e recuperar" },
        { id: "cheat-rds", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

/** The two environments drawn side by side in the account diagram. */
const ENVIRONMENTS = [
  { x: 30, label: "VPC dev  10.10.0.0/16", app: "app-dev", db: "db-dev", az: "1 AZ, t4g.micro" },
  { x: 370, label: "VPC prod  10.20.0.0/16", app: "app-prod", db: "db-prod", az: "Multi-AZ, m7g.large" },
];

function Body() {
  return (
    <>
      <Section id="what" title={"O que o RDS faz por você"}>
        <p>O <strong>Amazon RDS</strong> é o Postgres (ou MySQL, MariaDB, SQL Server, Oracle, Db2) rodando numa máquina que a AWS opera. Você escolhe o motor, a versão, o tamanho e o disco; a AWS instala, aplica patches, faz backup, troca o hardware que falha e, com Multi-AZ, promove a réplica em espera quando a principal cai.</p>
        <p>O que continua seu: o schema, as queries, os índices, as conexões, o custo, quem acessa e se o backup restaura.</p>
        <Table
          head={["Tarefa", "Postgres numa EC2", "RDS"]}
          rows={[
            ["Instalar, atualizar o SO e o motor", "você", "AWS, na janela de manutenção que você escolhe"],
            ["Backup e restauração a qualquer segundo", "você (pgBackRest, WAL-G, scripts)", "ligado com uma configuração"],
            ["Failover para outra zona", "você (Patroni, repmgr)", "Multi-AZ: automático, 1 a 2 minutos"],
            ["Acesso root ao servidor", "sim", <>não; extensões só da lista suportada, configuração via <em>parameter group</em></>],
            ["Custo", "menor na fatura, maior em horas suas", "maior na fatura, quase nada de operação"],
          ]}
        />
        <p>O <strong>Aurora</strong> é a versão da AWS com armazenamento próprio (seis cópias em três zonas, réplicas que leem o mesmo disco).</p>
        <p>Tudo nesta nota vale para os dois, com uma diferença: no Aurora o backup é do <em>cluster</em>, não da instância, e os comandos mudam de <code>db-instance</code> para <code>db-cluster</code>. Para um projeto pequeno ou médio, RDS Postgres com <code>gp3</code> é o ponto de partida. O básico do Postgres está em <a href="/notas/postgres-for-devs/">Postgres para quem programa</a>.</p>
      </Section>

      <Section id="glossary" title={"Vocabulário"}>
        <Table
          head={["Termo", "O que é"]}
          rows={[
            ["Instância", <>o servidor de banco, com um <em>identifier</em> (<code>app-prod</code>) e um endpoint DNS</>],
            ["Classe", <>CPU e memória: <code>db.t4g.micro</code> (burst, dev), <code>db.m7g.large</code> (uso geral, prod)</>],
            ["Subnet group", "as sub-redes privadas (em 2 ou mais zonas) onde a instância pode morar"],
            ["Security group", "o firewall da instância: quem pode abrir conexão na porta 5432"],
            ["Parameter group", <>a configuração do motor (<code>postgresql.conf</code>); um por ambiente</>],
            [<strong>Multi-AZ</strong>, "uma cópia síncrona em espera em outra zona; failover automático. Não serve para leitura (uma read replica serve)"],
            ["Backup automático", "um snapshot diário mais os logs de transação, guardados de 1 a 35 dias; apagado junto com a instância, a menos que você peça para manter"],
            [<strong>PITR</strong>, "point-in-time recovery: restaurar para qualquer segundo dentro da retenção, até uns 5 minutos atrás"],
            ["Snapshot manual", "uma foto do disco que você tira e que fica até você apagar, mesmo sem a instância"],
            ["Snapshot final", "o snapshot manual que o RDS tira ao apagar a instância (se você não pular)"],
            ["Deletion protection", "uma trava: a instância não pode ser apagada enquanto estiver ligada"],
            ["AWS Backup", "o serviço central de backup: planos, retenção longa, cópia para outra região ou conta"],
            ["Vault / Vault Lock", "o cofre onde o AWS Backup guarda pontos de recuperação; com Lock, nem o root apaga antes do prazo"],
            [<strong>RPO</strong>, "quanto dado você aceita perder (o intervalo entre o último ponto restaurável e a falha)"],
            [<strong>RTO</strong>, "quanto tempo você aceita ficar fora até o banco voltar"],
          ]}
        />
      </Section>

      <Section id="one-account" title={"Dev e prod na mesma conta"}>
        <p>A recomendação da AWS é uma <strong>conta por ambiente</strong>, dentro de uma AWS Organization: a fronteira de conta é a mais forte que existe, e um erro em dev não alcança prod por construção.</p>
        <p>Para uma empresa pequena, um projeto de cliente ou o começo de um produto, duas contas (com SSO, faturamento consolidado e pipelines separados) costumam ser mais estrutura do que o time consegue manter. Uma conta só é aceitável se o isolamento for feito <em>de propósito</em>, em quatro camadas:</p>
        <Table
          head={["Camada", "O que separa", "Como"]}
          rows={[
            ["Rede", "quem consegue abrir uma conexão", "uma VPC por ambiente (ou sub-redes e security groups separados); SG do banco só aceita o SG do app do mesmo ambiente"],
            ["Identidade", "quem consegue mudar, apagar ou restaurar", <>tag <code>env</code> em tudo, políticas IAM que negam ações em <code>env=prod</code> para quem não é de prod</>],
            ["Chaves e segredos", "quem consegue ler os dados e a senha", "uma chave KMS e um segredo no Secrets Manager por ambiente"],
            ["Código", <>quem consegue rodar um <code>apply</code> em prod</>, "Terraform com estado separado por ambiente; o pipeline de prod só roda a partir da main"],
          ]}
        />
        <Diagram minWidth={640} caption={"Uma conta, dois ambientes que não se enxergam: cada app só alcança o banco do seu ambiente, e cada banco tem sua chave e seu segredo."}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Uma conta AWS com VPCs de dev e prod isoladas">
            <rect x="10" y="10" width="680" height="250" rx="8" className="ln dash" />
            <text x="24" y="32" className="mut" textAnchor="start">conta AWS 1234-5678-9012 · região sa-east-1</text>
            {ENVIRONMENTS.map((env) => (
              <g key={env.db}>
                <rect x={env.x} y="48" width="300" height="196" rx="6" className="ln" />
                <text x={env.x + 14} y="70" className="mono" textAnchor="start">{env.label}</text>
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
            ["Classe", <code>db.t4g.micro</code>, <><code>db.m7g.large</code> (ou o que o uso pedir)</>],
            ["Multi-AZ", "não", "sim"],
            ["Retenção de backup", "1 dia", "14 a 35 dias + AWS Backup"],
            ["Deletion protection", "não", "sim"],
            ["Snapshot final", "pode pular", "obrigatório"],
            ["Horário", "parado fora do expediente (o RDS religa sozinho depois de 7 dias)", "sempre ligado"],
            ["Dados", "seed sintético", "reais"],
          ]}
        />
        <Callout tone="warn" icon="alert">Não copie o banco de produção para dev "para ter dados realistas". Dev tem mais gente com acesso, menos auditoria e senhas em <code>.env</code>; é ali que dado pessoal vaza (e a LGPD trata isso como incidente). Use um seed gerado, ou restaure um snapshot num ambiente temporário, anonimize lá e só então exporte.</Callout>
        <p><strong>Quando separar em contas:</strong> quando houver exigência de auditoria ou compliance (PCI, SOC 2), quando o time crescer a ponto de nem todo mundo poder ver prod, quando você precisar de SCPs (políticas que nem o administrador da conta escapa), ou depois do primeiro susto. A migração é tranquila se as quatro camadas acima já existirem: elas viram contas. Veja a nota de <a href="/notas/aws/">AWS</a>.</p>
      </Section>

      <Section id="network" title={"Rede: nada cruza"}>
        <p>O jeito mais simples de garantir que o app de dev nunca fale com o banco de prod é ele não ter <em>rota</em> até lá. Duas VPCs sem peering resolvem isso: nenhuma regra mal escrita abre o caminho. Se você já tem uma VPC só, separe pelo security group, que é a regra que de fato decide:</p>
        <ul>
          <li>O banco fica em <strong>sub-redes privadas</strong>, com <code>publicly_accessible = false</code>. Nunca abra 5432 para <code>0.0.0.0/0</code>, nem "só por um minuto".</li>
          <li>O SG do banco de prod aceita a porta 5432 <strong>só do SG do app de prod</strong> (uma regra que referencia outro security group, não um bloco de IP). O SG do app de dev nunca aparece ali.</li>
          <li>Para acessar o banco do seu computador, use o <strong>Session Manager</strong> (port forwarding por um bastion sem porta aberta) ou um túnel temporário; nada de IP de casa na regra.</li>
          <li>O app encontra o banco por um nome estável (um segredo com o host, ou um CNAME numa zona privada do Route 53), não pelo endpoint cravado no código. Isso importa na hora de restaurar, porque <strong>toda restauração cria uma instância nova, com endpoint novo</strong>.</li>
        </ul>
      </Section>

      <Section id="iam" title={"Tags, IAM, KMS e segredos"}>
        <p>Numa conta compartilhada, a <strong>tag <code>env</code></strong> é o que diz a quem cada recurso pertence. Coloque em tudo (instância, snapshot, chave, segredo, security group) e ligue <code>copy_tags_to_snapshot</code> para os snapshots herdarem a tag. Depois, deixe o IAM usar essa tag: o papel de desenvolvimento pode fazer quase tudo, menos alterar, apagar ou restaurar recursos de prod.</p>
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
        <p>Anexe essa política ao papel de dev (o que as pessoas assumem pelo SSO e o que o pipeline de dev usa). Note as ações de tag na lista: sem elas, alguém troca <code>env=prod</code> por <code>env=dev</code> e passa pela regra. O pipeline de prod assume outro papel, liberado só para a branch <code>main</code> pelo OIDC do GitHub (veja <a href="/notas/github-aws-oidc/">Deploy do GitHub para a AWS com OIDC</a>).</p>
        <ul>
          <li><strong>Uma chave KMS por ambiente</strong> (<code>alias/rds-dev</code>, <code>alias/rds-prod</code>), gerenciada por você, não a padrão <code>aws/rds</code>. A política da chave de prod só deixa usar o papel de prod e o RDS. Bônus: snapshots criptografados com a chave padrão não podem ser compartilhados com outra conta; com a sua, podem (você vai precisar disso para copiar backups para fora).</li>
          <li><strong>Senha no Secrets Manager</strong>, com <code>manage_master_user_password = true</code>: o RDS cria o segredo, gira a senha e você nunca a vê no Terraform nem no state. Um segredo por ambiente, com prefixo (<code>dev/</code>, <code>prod/</code>) para a política acima funcionar.</li>
          <li><strong>Custos por tag:</strong> ative <code>env</code> como <em>cost allocation tag</em> no Billing e crie um AWS Budget para dev. É assim que você descobre a instância de teste esquecida ligada há três meses.</li>
        </ul>
      </Section>

      <Section id="terraform" title={"Terraform: um módulo, dois estados"}>
        <p>Um módulo descreve o banco uma vez; cada ambiente é uma pasta com seu próprio <em>state</em> e suas variáveis. Estados separados significam que um <code>terraform destroy</code> rodado em <code>envs/dev</code> não tem como tocar prod. Prefira pastas a <em>workspaces</em>: com pastas, o ambiente está no caminho, visível no terminal e no pipeline.</p>
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
        <Callout icon="check">Adicione <code>lifecycle {"{ prevent_destroy = true }"}</code> ao banco no ambiente de prod (ou num módulo só para prod). Junto com <code>deletion_protection</code>, um plano que tentaria recriar o banco (porque alguém mudou o <code>identifier</code> ou a chave KMS) falha antes de apagar qualquer coisa.</Callout>
      </Section>

      <Section id="backups" title={"Como o RDS faz backup"}>
        <p>O RDS tem dois tipos de backup, e eles se completam:</p>
        <Table
          head={["", "Backup automático", "Snapshot manual"]}
          rows={[
            ["O que é", "snapshot diário + logs de transação enviados ao S3 a cada ~5 min", "uma foto do disco num momento"],
            ["Restaura para", "qualquer segundo dentro da retenção (PITR)", "exatamente o momento da foto"],
            ["Fica por", "1 a 35 dias", "até você apagar"],
            ["Se a instância for apagada", <>some, a menos que <code>delete_automated_backups = false</code> (aí fica até o fim da retenção)</>, "fica"],
            ["Quando usar", <>o "desfazer" do dia a dia: o <code>DELETE</code> sem <code>WHERE</code> de ontem</>, "antes de migração grande, upgrade de versão, ou para guardar por meses"],
          ]}
        />
        <p>Os snapshots são <strong>incrementais</strong> (só os blocos que mudaram desde o anterior) e o RDS dá de graça armazenamento de backup igual ao tamanho do banco na região; acima disso, você paga por GB. O primeiro snapshot de uma instância Single-AZ pode causar uma breve pausa de I/O; com Multi-AZ, o backup é tirado da standby e o primário não sente.</p>
        <Callout tone="warn" icon="alert">Três coisas que surpreendem na primeira restauração: <strong>(1)</strong> restaurar nunca sobrescreve a instância existente, cria uma nova com outro nome e outro endpoint; <strong>(2)</strong> a nova instância sobe com o security group e o parameter group <em>padrão</em> se você não informar os seus; <strong>(3)</strong> o tempo de restauração cresce com o tamanho do banco e com a quantidade de log a reaplicar. Só um teste te diz quanto tempo leva no seu caso.</Callout>
      </Section>

      <Section id="configure" title={"Configurar backups"}>
        <p>Comece pelo que o negócio aceita perder. A pergunta para o cliente ou para você mesmo é: "se o banco sumir agora, quantos minutos de dados podemos perder (RPO) e quantas horas podemos ficar fora (RTO)?" A resposta escolhe a configuração:</p>
        <Table
          head={["Ameaça", "Proteção", "RPO / RTO típicos"]}
          rows={[
            ["hardware ou zona cai", "Multi-AZ", "0 / 1–2 min (automático)"],
            [<><code>DELETE</code> errado, migração ruim</>, "PITR (backup automático)", "~5 min / dezenas de minutos"],
            ["instância apagada por engano", "deletion protection + snapshot final + backups retidos", "~5 min / dezenas de minutos"],
            ["região inteira fora", "cópia de backup para outra região", "horas / horas"],
            ["credencial de admin vazada, ransomware", "cópia para outra conta + Vault Lock", "1 dia / horas"],
            ["precisa do dado de 6 meses atrás (auditoria)", "AWS Backup com retenção mensal", "1 mês / horas"],
          ]}
        />
        <h3>Ligando e conferindo pela CLI</h3>
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
          <li><code>backup_retention_period = 0</code> desliga os backups automáticos <em>e apaga os existentes</em>. Nunca em prod; considere uma regra do AWS Config (<code>db-instance-backup-enabled</code>) para alertar.</li>
          <li>A janela de backup e a de manutenção não podem se sobrepor; deixe as duas no horário de menos uso.</li>
          <li>Para ter PITR também em outra região, ligue a <strong>replicação de backups automáticos</strong> entre regiões (<code>start-db-instance-automated-backups-replication</code>). Precisa de uma chave KMS na região de destino.</li>
        </ul>
      </Section>

      <Section id="aws-backup" title={"AWS Backup: cópias fora do alcance"}>
        <p>O backup automático do RDS mora na mesma conta, gerenciado pelas mesmas credenciais que gerenciam o banco. Se essas credenciais vazam (ou se alguém com acesso decide apagar tudo), os backups vão junto. É exatamente o risco que uma conta compartilhada aumenta. O <strong>AWS Backup</strong> resolve com três peças:</p>
        <ul>
          <li><strong>Plano</strong>: quando fazer (diário, mensal), quanto guardar (35 dias, 12 meses) e para onde copiar. Seleciona recursos por tag: <code>backup=daily</code> pega só prod.</li>
          <li><strong>Vault com Vault Lock</strong> em modo <em>compliance</em>: depois do período de carência, ninguém (nem o root da conta, nem a AWS) apaga um ponto de recuperação antes do prazo nem encurta a retenção. É o backup imutável (WORM).</li>
          <li><strong>Cópia para outra conta</strong> (com AWS Organizations) ou para um <em>logically air-gapped vault</em>: uma conta só para backups, onde as credenciais do dia a dia não entram. Mesmo mantendo dev e prod juntos, vale ter essa conta: ela não precisa de rede, app nem gente.</li>
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
        <Callout tone="warn" icon="alert">Teste o Vault Lock num vault de teste antes. No modo compliance, depois de <code>changeable_for_days</code>, não há volta: você paga por aquela retenção até ela vencer, e não dá para apagar o vault enquanto houver pontos dentro.</Callout>
      </Section>

      <Section id="test" title={"Testar: o ensaio de restauração"}>
        <p>Um backup que nunca foi restaurado é uma esperança, não um backup. O console mostrando "backup concluído" diz que um arquivo foi escrito; não diz que ele abre, que tem os dados certos, nem quanto tempo leva para voltar.</p>
        <p>O teste é simples: <strong>restaurar numa instância nova, isolada, conferir, medir e apagar</strong>. Faça uma vez por mês (ou depois de qualquer mudança de backup, chave ou versão) e anote o resultado.</p>
        <h3>1. Restaurar para um momento</h3>
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
          <li>Use <code>--restore-time 2026-11-18T09:30:00Z</code> em vez de <code>--use-latest-restorable-time</code> para ensaiar o caso real "voltar para antes do erro".</li>
          <li>O security group <code>sg-0restoretest…</code> só aceita conexões do seu bastion ou do job de teste: a cópia tem dados de produção, e <strong>o app de produção não pode enxergá-la</strong> (senão algum worker esquecido grava nela).</li>
          <li>A tag <code>env=restore-test</code> deixa a política de "nega prod" fora do caminho e permite que o papel de teste apague a instância depois. A senha é a mesma do banco de origem (o segredo de prod).</li>
        </ul>
        <h3>2. Conferir</h3>
        <p>"Subiu" não é o critério. Confira se os dados estão lá e se são de quando deveriam ser:</p>
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
        <p>Se der, rode a suíte de smoke test do app apontada para a cópia, em modo só leitura. Isso pega o que SQL não pega: extensões faltando, um parameter group diferente, permissões de usuário que não vieram.</p>
        <h3>3. Medir, anotar e apagar</h3>
        <CodeBlock code={`aws rds delete-db-instance --db-instance-identifier "$TARGET" \\
  --skip-final-snapshot --delete-automated-backups

# One line per drill, in the repo or a spreadsheet:
# date        source    restore point          restore min  RPO gap  checks  who
# 2026-11-18  app-prod  latest (09:41:03 UTC)  23           4m12s    ok      ops-oncall`} />
        <Table
          head={["Ensaio", "Frequência", "Prova que…"]}
          rows={[
            ["PITR para o momento mais recente", "mensal", "os logs estão chegando e o RPO é o esperado"],
            ["PITR para um horário específico", "trimestral", <>você sabe desfazer um <code>DELETE</code> sem pânico</>],
            ["Restaurar a cópia de outra conta ou região", "semestral", "a chave KMS e as permissões funcionam lá"],
            ["Troca completa: app apontando para a cópia", "anual (num ambiente de ensaio)", "o RTO de ponta a ponta, incluindo DNS, segredos e pessoas"],
          ]}
        />
        <Callout icon="check">Recuperar uma tabela só (o caso mais comum): restaure para um momento antes do erro numa instância temporária, exporte a tabela com <code>pg_dump -t orders</code>, e importe numa tabela auxiliar em prod (<code>orders_recovered</code>) para comparar e copiar só as linhas perdidas. Nunca restaure a instância inteira por cima de prod por causa de uma tabela.</Callout>
      </Section>

      <Section id="automate" title={"Automatizar o teste"}>
        <p>Ensaio manual some da agenda no terceiro mês. Duas formas de automatizar:</p>
        <ul>
          <li><strong>AWS Backup restore testing:</strong> um <em>restore testing plan</em> escolhe, num cron, um ponto de recuperação (o mais recente ou aleatório numa janela), restaura numa instância temporária, publica o resultado no EventBridge e apaga a instância depois de algumas horas. Você liga uma Lambda no evento para rodar as consultas de verificação e reportar o status de validação. O tempo de restauração fica registrado no console: é o seu RTO medido toda semana.</li>
          <li><strong>Um job agendado seu</strong> (GitHub Actions com OIDC, ou EventBridge Scheduler chamando um Step Functions): o script desta seção, com as consultas num <code>psql -f checks.sql</code> e um alerta se algo falhar ou se o RPO medido passar do combinado.</li>
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
        <Callout tone="warn" icon="alert">Alerta também quando o ensaio <em>não roda</em>. Um job que falha em silêncio por três meses é pior que nenhum, porque dá falsa confiança. Um alarme "nenhum resultado de restore test nos últimos 35 dias" fecha esse buraco.</Callout>
      </Section>

      <Section id="prod" title={"Em produção"}>
        <h3>Checklist</h3>
        <ul>
          <li>Dev e prod em VPCs (ou pelo menos security groups) separados; o SG do banco só aceita o SG do app do mesmo ambiente; <code>publicly_accessible = false</code>.</li>
          <li>Tag <code>env</code> em tudo, <code>copy_tags_to_snapshot</code>, política IAM que nega mudanças em <code>env=prod</code> (incluindo mudar a tag) para o papel de dev.</li>
          <li>Uma chave KMS gerenciada por você e um segredo por ambiente; senha gerenciada pelo RDS.</li>
          <li>Terraform com estado separado por ambiente; prod só aplica a partir da main, com aprovação.</li>
          <li>Prod: Multi-AZ, retenção de 14+ dias, <code>deletion_protection</code>, snapshot final, <code>delete_automated_backups = false</code>, <code>prevent_destroy</code>.</li>
          <li>AWS Backup com cópia para outra conta ou região, e Vault Lock no vault de destino.</li>
          <li>Ensaio de restauração mensal, automatizado, com RPO e RTO anotados e alerta se não rodar.</li>
          <li>O app encontra o banco por um nome estável (segredo ou CNAME), para que trocar para uma instância restaurada seja mudar um valor, não fazer deploy.</li>
          <li>Dev parado fora do expediente e com budget; nenhum dado de produção em dev.</li>
        </ul>
      </Section>

      <Section id="lab" title={"Exercício: apagar e recuperar"}>
        <p>Pré-requisitos: AWS CLI configurada numa conta de estudo, a VPC padrão, e <code>psql</code>. Custo: uma <code>db.t4g.micro</code> por cerca de uma hora, duas vezes (centavos de dólar; fora do free tier, ainda menos de um dólar).</p>
        <p>Você vai criar um banco, gravar dados, "apagar por engano" e voltar para antes do erro. Para simplificar o acesso, o banco do laboratório é público e liberado só para o seu IP; <strong>nunca faça isso com um banco de verdade</strong>.</p>
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
        <p>Grave dados, espere o backup ter algo para restaurar, anote a hora e cometa o erro:</p>
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
        <p>Agora recupere para o momento bom, numa instância nova, e confira:</p>
        <CodeBlock code={`aws rds describe-db-instances --db-instance-identifier rds-lab --query 'DBInstances[0].LatestRestorableTime'
# wait until LatestRestorableTime is later than $BEFORE

aws rds restore-db-instance-to-point-in-time \\
  --source-db-instance-identifier rds-lab --target-db-instance-identifier rds-lab-restored \\
  --restore-time "$BEFORE" --db-instance-class db.t4g.micro \\
  --publicly-accessible --vpc-security-group-ids "$SG" --tags Key=env,Value=lab
aws rds wait db-instance-available --db-instance-identifier rds-lab-restored

HOST2=$(aws rds describe-db-instances --db-instance-identifier rds-lab-restored --query 'DBInstances[0].Endpoint.Address' --output text)
psql "host=$HOST2 user=lab dbname=postgres sslmode=require" -c "SELECT count(*), max(created_at) FROM orders;"   # 5000 again`} />
        <p><strong>O que observar:</strong> o endpoint mudou (é outra instância); quanto tempo levou entre o comando e o <code>wait</code> terminar (seu RTO para um banco minúsculo); e que <code>max(created_at)</code> é anterior a <code>$BEFORE</code>. Em produção, o passo seguinte seria copiar as linhas de volta ou apontar o app para a instância restaurada.</p>
        <CodeBlock code={`# Cleanup (both instances, no final snapshots, then the security group)
for id in rds-lab rds-lab-restored; do
  aws rds delete-db-instance --db-instance-identifier "$id" --skip-final-snapshot --delete-automated-backups
done
aws rds wait db-instance-deleted --db-instance-identifier rds-lab
aws rds wait db-instance-deleted --db-instance-identifier rds-lab-restored
aws ec2 delete-security-group --group-id "$SG"`} />
      </Section>

      <Section id="cheat-rds" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Uso"]}
          rows={[
            ["dev nunca alcançar o banco de prod", "VPCs separadas; SG do banco aceita só o SG do app do mesmo ambiente"],
            ["dev nunca alterar prod", <>tag <code>env</code> + Deny com <code>aws:ResourceTag/env = prod</code></>],
            ["voltar para antes de um erro", <code>restore-db-instance-to-point-in-time --restore-time</code>],
            ["guardar antes de uma migração", <code>create-db-snapshot</code>],
            ["não perder backups ao apagar a instância", <><code>deletion_protection</code>, snapshot final, <code>delete_automated_backups = false</code></>],
            ["backup que nem o admin apaga", "AWS Backup + Vault Lock (compliance) + cópia para outra conta"],
            ["saber se o backup funciona", "ensaio mensal: restaurar, conferir, medir RPO/RTO, apagar"],
            ["automatizar o ensaio", "AWS Backup restore testing, ou um job agendado com OIDC"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <QA items={[
          ["Por que a AWS recomenda contas separadas, e quando uma conta só é aceitável?", "A conta é a fronteira de isolamento mais forte: permissões, limites e erros não a atravessam. Uma conta só é aceitável em projetos pequenos se rede, identidade (tags + IAM), chaves/segredos e código (estado do Terraform) forem separados de propósito, e se os backups forem copiados para fora dela."],
          ["Por que a política que nega ações em prod também precisa negar mudar tags?", "Porque a regra é baseada na tag. Se o papel de dev pode trocar env=prod por env=dev, ele remove a proteção e depois faz o que quiser."],
          ["Qual a diferença entre backup automático e snapshot manual?", "O automático (snapshot diário + logs) permite restaurar para qualquer segundo dentro de 1 a 35 dias e, por padrão, some com a instância. O manual é uma foto de um momento e fica até ser apagado."],
          ["O que acontece com a instância original quando você faz um PITR?", "Nada. O RDS cria uma instância nova, com outro identificador e outro endpoint. Você decide depois se copia dados de volta ou aponta o app para a nova."],
          ["Multi-AZ substitui backup?", "Não. Multi-AZ protege contra falha de hardware ou de zona, mas replica tudo na hora, inclusive o DELETE errado. Só o backup volta no tempo."],
          ["Por que usar uma chave KMS gerenciada por você e não a aws/rds?", "Para controlar quem usa a chave (separando dev de prod) e porque snapshots criptografados com a chave padrão não podem ser compartilhados com outra conta, o que impede a cópia de backup para fora."],
          ["O que um ensaio de restauração precisa medir?", "Se restaura, se os dados são os certos (contagens, versão das migrations, linha mais recente), o RPO real (diferença entre a linha mais recente e o momento pedido) e o RTO (tempo até o banco estar utilizável)."],
          ["Por que a instância restaurada no teste fica num security group próprio?", "Ela tem dados de produção e não pode ser alcançada pelo app de produção nem por dev: um worker que gravasse nela, ou alguém de dev lendo dados reais, seria um incidente."],
          ["Como proteger backups de alguém com credencial de administrador da conta?", "Copiando para outra conta (ou um vault isolado) onde essas credenciais não entram, com Vault Lock em modo compliance, que impede apagar antes do prazo até para o root."],
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
