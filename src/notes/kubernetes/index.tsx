import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "kubernetes",
  title: { en: "Kubernetes from zero: concepts, security and AWS", pt: "Kubernetes do zero: conceitos, segurança e AWS" },
  seo: {
    title: { en: "Kubernetes from zero: concepts, security and AWS", pt: "Kubernetes do zero: conceitos, segurança e AWS" },
    description: { en: "Kubernetes explained from zero: what it is and the problem it solves, the core objects (Pod, Deployment, Service), the YAML files and their security options (securityContext, Pod Security, RBAC, NetworkPolicy, Secrets), nine small hands-on labs with Docker and kind, and a secure production setup on AWS EKS.", pt: "Kubernetes explicado do zero: o que é e o problema que resolve, os objetos principais (Pod, Deployment, Service), os arquivos YAML e suas opções de segurança (securityContext, Pod Security, RBAC, NetworkPolicy, Secrets), nove laboratórios curtos com Docker e kind e uma produção segura na AWS com EKS." },
  },
  summary: "what Kubernetes is and the problem it solves, the YAML files and their security options, small progressive labs with Docker (kind), and how to run it securely on AWS with EKS.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Kubernetes, <em>from zero to production.</em></>, pt: <>Kubernetes, <em>do zero à produção.</em></> },
  heroLede: { en: "What Kubernetes is, the problem it solves, the configuration files and their security options, small hands-on labs with Docker on your machine, and how to run it securely on AWS.", pt: "O que é o Kubernetes, o problema que resolve, os arquivos de configuração e suas opções de segurança, laboratórios curtos com Docker na sua máquina e como rodar com segurança na AWS." },
  published: "2026-10-21",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é e o problema" en="What it is and the problem" /> },
        { id: "inside", title: <T pt="Como funciona por dentro" en="How it works inside" /> },
        { id: "objects", title: <T pt="Os objetos principais" en="The main objects" /> },
        { id: "files", title: <T pt="Os arquivos de configuração" en="The configuration files" /> },
        { id: "security", title: <T pt="Segurança nos arquivos" en="Security in the files" /> },
        { id: "lab", title: <T pt="Praticar com Docker (kind)" en="Practise with Docker (kind)" /> },
        { id: "aws", title: <T pt="Produção segura na AWS (EKS)" en="Secure production on AWS (EKS)" /> },
        { id: "cheat-k8s", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é o Kubernetes e que problema ele resolve" en="What Kubernetes is and the problem it solves" />}>
        <p><T pt={<><strong>Kubernetes</strong> (K8s: o 8 são as letras entre K e s) é um sistema open source, criado no Google e hoje mantido pela CNCF, que <strong>roda e cuida de contêineres em várias máquinas</strong> como se fossem uma só. O nome vem do grego e significa “timoneiro”: quem conduz o navio. Pense num <em>maestro</em>: cada músico (contêiner) sabe tocar o seu trecho, mas alguém precisa dizer quem toca, quando, e substituir quem faltar.</>} en={<><strong>Kubernetes</strong> (K8s: the 8 stands for the letters between K and s) is an open source system, created at Google and now maintained by the CNCF, that <strong>runs and looks after containers across many machines</strong> as if they were one. The name is Greek for “helmsman”: the one who steers the ship. Think of a <em>conductor</em>: each musician (container) knows their part, but someone has to say who plays, when, and replace whoever is missing.</>} /></p>
        <p><T pt={<>Pré-requisito: saber o que é um <strong>contêiner</strong>. Uma <em>imagem</em> é o pacote pronto (programa + bibliotecas); um <em>contêiner</em> é essa imagem em execução, isolada do resto da máquina. O Docker constrói e roda contêineres em <em>uma</em> máquina. O Kubernetes entra quando são muitos contêineres em muitas máquinas.</>} en={<>Prerequisite: knowing what a <strong>container</strong> is. An <em>image</em> is the ready-made package (program + libraries); a <em>container</em> is that image running, isolated from the rest of the machine. Docker builds and runs containers on <em>one</em> machine. Kubernetes enters when there are many containers on many machines.</>} /></p>
        <h3><T pt="O problema" en="The problem" /></h3>
        <p><T pt={<>Rodar um contêiner com <code>docker run</code> é fácil. Operar dezenas deles em produção traz perguntas que o Docker sozinho não responde:</>} en={<>Running one container with <code>docker run</code> is easy. Operating dozens in production raises questions Docker alone does not answer:</>} /></p>
        <ul>
          <li><T pt={<><strong>O contêiner caiu às 3h da manhã.</strong> Quem sobe de novo?</>} en={<><strong>The container died at 3 a.m.</strong> Who starts it again?</>} /></li>
          <li><T pt={<><strong>A máquina inteira morreu.</strong> Quem move os contêineres para outra?</>} en={<><strong>The whole machine died.</strong> Who moves the containers to another one?</>} /></li>
          <li><T pt={<><strong>Chegou mais tráfego.</strong> Como ter 10 cópias em vez de 2, e dividir os acessos entre elas?</>} en={<><strong>More traffic arrived.</strong> How do you get 10 copies instead of 2, and split the requests among them?</>} /></li>
          <li><T pt={<><strong>Versão nova.</strong> Como trocar sem derrubar o site, e voltar atrás se der errado?</>} en={<><strong>New version.</strong> How do you swap without downtime, and go back if it fails?</>} /></li>
          <li><T pt={<><strong>Configuração e segredos.</strong> Como entregar senhas e variáveis sem colocá-las na imagem?</>} en={<><strong>Configuration and secrets.</strong> How do you deliver passwords and variables without baking them into the image?</>} /></li>
          <li><T pt={<><strong>Quem pode fazer o quê?</strong> E quem pode falar com quem dentro do sistema?</>} en={<><strong>Who may do what?</strong> And who may talk to whom inside the system?</>} /></li>
        </ul>
        <Diagram minWidth={620} caption={<T pt="Você descreve o resultado (3 cópias); o cluster distribui entre os nós e recria o que cair." en="You describe the result (3 copies); the cluster spreads them across nodes and recreates whatever dies." />}>
          <svg viewBox="0 0 700 255" role="img" aria-label="Você declara 3 cópias e o cluster mantém / You declare 3 copies and the cluster keeps them">
            <rect x="10" y="90" width="120" height="60" rx="4" className="ln fillsoft" />
            <text x="70.0" y="124.0" className="pt" textAnchor="middle">você + YAML</text>
            <text x="70.0" y="124.0" className="en" textAnchor="middle">you + YAML</text>
            <path d="M130 120L225 120" className="ln" />
            <path d="M218.0 123.4L225 120L218.0 116.6" className="ln" />
            <text x="177" y="108" className="pt mut" textAnchor="middle">3 cópias</text>
            <text x="177" y="108" className="en mut" textAnchor="middle">3 copies</text>
            <rect x="230" y="10" width="460" height="235" rx="4" className="ln dash" />
            <text x="245" y="32" className="pt mut" textAnchor="start">cluster Kubernetes</text>
            <text x="245" y="32" className="en mut" textAnchor="start">Kubernetes cluster</text>
            <rect x="245" y="48" width="120" height="150" rx="4" className="ln" />
            <text x="305" y="68" className="pt mut" textAnchor="middle">nó 1</text>
            <text x="305" y="68" className="en mut" textAnchor="middle">node 1</text>
            <rect x="260" y="80" width="90" height="32" rx="4" className="ln fillsoft" />
            <text x="305.0" y="100.0" textAnchor="middle">app</text>
            <rect x="260" y="124" width="90" height="32" rx="4" className="ln fillsoft" />
            <text x="305.0" y="144.0" textAnchor="middle">app</text>
            <rect x="375" y="48" width="120" height="150" rx="4" className="ln" />
            <text x="435" y="68" className="pt mut" textAnchor="middle">nó 2</text>
            <text x="435" y="68" className="en mut" textAnchor="middle">node 2</text>
            <rect x="390" y="80" width="90" height="32" rx="4" className="ln fillsoft" />
            <text x="435.0" y="100.0" textAnchor="middle">app</text>
            <rect x="390" y="124" width="90" height="32" rx="4" className="ln dash" />
            <text x="435.0" y="144.0" className="pt" textAnchor="middle">✗ caiu</text>
            <text x="435.0" y="144.0" className="en" textAnchor="middle">✗ died</text>
            <rect x="505" y="48" width="120" height="150" rx="4" className="ln" />
            <text x="565" y="68" className="pt mut" textAnchor="middle">nó 3</text>
            <text x="565" y="68" className="en mut" textAnchor="middle">node 3</text>
            <rect x="520" y="80" width="90" height="32" rx="4" className="ln fillsoft" />
            <text x="565.0" y="100.0" textAnchor="middle">app</text>
            <rect x="520" y="124" width="90" height="32" rx="4" className="brandfill" />
            <text x="565.0" y="144.0" className="pt" textAnchor="middle">recriado</text>
            <text x="565.0" y="144.0" className="en" textAnchor="middle">recreated</text>
            <text x="460" y="224" className="pt mut" textAnchor="middle">O Kubernetes recria o que caiu e mantém 3 cópias no ar</text>
            <text x="460" y="224" className="en mut" textAnchor="middle">Kubernetes recreates what died and keeps 3 copies running</text>
          </svg>
        </Diagram>
        <h3><T pt="A ideia central: declarativo" en="The core idea: declarative" /></h3>
        <p><T pt={<>Você não manda “suba o contêiner A na máquina 2”. Você escreve um arquivo YAML dizendo <em>como quer que fique</em> (“3 cópias do app A, na versão 1.27”) e o Kubernetes trabalha sem parar para que a realidade fique igual ao arquivo. É a mesma ideia do <a href="/notas/terraform/">Terraform</a>, só que para aplicações em execução.</>} en={<>You do not say “start container A on machine 2”. You write a YAML file saying <em>how you want things to be</em> (“3 copies of app A, version 1.27”) and Kubernetes works non-stop to make reality match the file. It is the same idea as <a href="/notas/terraform/">Terraform</a>, but for running applications.</>} /></p>
        <Callout icon="check"><T pt={<><strong>Quando usar, e quando não.</strong> Kubernetes vale quando você tem vários serviços, precisa de alta disponibilidade e de deploys frequentes. Para um site simples ou um único app, uma VM, o ECS/Fargate ou um PaaS custam muito menos esforço. K8s tem curva de aprendizado e custo operacional reais.</>} en={<><strong>When to use it, and when not.</strong> Kubernetes pays off when you have several services, need high availability and deploy often. For a simple site or a single app, a VM, ECS/Fargate or a PaaS take far less effort. K8s has a real learning curve and operating cost.</>} /></Callout>
      </Section>
      <Section id="inside" title={<T pt="Como funciona por dentro" en="How it works inside" />}>
        <p><T pt={<>Um <strong>cluster</strong> é um conjunto de máquinas (chamadas <strong>nós</strong>). Um grupo delas, o <strong>control plane</strong>, decide; as outras, os <strong>workers</strong>, executam. Você só conversa com o control plane, pelo <code>kubectl</code> (a linha de comando) que chama o <strong>API server</strong>.</>} en={<>A <strong>cluster</strong> is a set of machines (called <strong>nodes</strong>). Some of them, the <strong>control plane</strong>, decide; the others, the <strong>workers</strong>, execute. You only talk to the control plane, through <code>kubectl</code> (the command line) calling the <strong>API server</strong>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O control plane decide e guarda o estado; os nós executam. Tudo passa pelo API server." en="The control plane decides and stores state; the nodes execute. Everything goes through the API server." />}>
          <svg viewBox="0 0 700 398" role="img" aria-label="Arquitetura do cluster / Cluster architecture">
            <rect x="10" y="45" width="90" height="40" rx="4" className="ln fillsoft" />
            <text x="55.0" y="69.0" className="mono" textAnchor="middle">kubectl</text>
            <path d="M100 65L165 65" className="ln" />
            <path d="M158.0 68.4L165 65L158.0 61.6" className="ln" />
            <rect x="140" y="8" width="550" height="172" rx="4" className="ln dash" />
            <text x="155" y="28" className="pt mut" textAnchor="start">control plane (o cérebro)</text>
            <text x="155" y="28" className="en mut" textAnchor="start">control plane (the brain)</text>
            <rect x="165" y="45" width="170" height="60" rx="4" className="brandfill" />
            <text x="250.0" y="73.0" textAnchor="middle">API server</text>
            <text x="250.0" y="89.0" className="pt mut" textAnchor="middle">porta de entrada</text>
            <text x="250.0" y="89.0" className="en mut" textAnchor="middle">front door</text>
            <rect x="165" y="118" width="170" height="50" rx="4" className="ln" />
            <text x="250.0" y="141.0" textAnchor="middle">etcd</text>
            <text x="250.0" y="157.0" className="pt mut" textAnchor="middle">estado do cluster</text>
            <text x="250.0" y="157.0" className="en mut" textAnchor="middle">cluster state</text>
            <path d="M250 105L250 118" className="ln" />
            <path d="M246.6 111.0L250 118L253.4 111.0" className="ln" />
            <rect x="405" y="38" width="270" height="48" rx="4" className="ln" />
            <text x="540.0" y="60.0" textAnchor="middle">scheduler</text>
            <text x="540.0" y="76.0" className="pt mut" textAnchor="middle">escolhe o nó de cada Pod</text>
            <text x="540.0" y="76.0" className="en mut" textAnchor="middle">picks a node for each Pod</text>
            <rect x="405" y="100" width="270" height="48" rx="4" className="ln" />
            <text x="540.0" y="122.0" textAnchor="middle">controller manager</text>
            <text x="540.0" y="138.0" className="pt mut" textAnchor="middle">compara desejado × atual</text>
            <text x="540.0" y="138.0" className="en mut" textAnchor="middle">compares desired × actual</text>
            <path d="M335 65L405 62" className="ln" />
            <path d="M398.2 65.7L405 62L397.9 58.9" className="ln" />
            <path d="M335 90L405 124" className="ln" />
            <path d="M397.2 124.0L405 124L400.2 117.9" className="ln" />
            <path d="M185 180L185 218" className="ln" />
            <path d="M181.6 211.0L185 218L188.4 211.0" className="ln" />
            <rect x="30" y="218" width="310" height="170" rx="4" className="ln" />
            <text x="44" y="240" className="pt mut" textAnchor="start">nó (worker)</text>
            <text x="44" y="240" className="en mut" textAnchor="start">node (worker)</text>
            <rect x="40" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="85.0" y="275.0" className="mono" textAnchor="middle">kubelet</text>
            <rect x="140" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="185.0" y="275.0" className="mono" textAnchor="middle">kube-proxy</text>
            <rect x="240" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="285.0" y="275.0" className="mono" textAnchor="middle">containerd</text>
            <rect x="45" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="85.0" y="344.0" textAnchor="middle">Pod</text>
            <rect x="140" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="180.0" y="344.0" textAnchor="middle">Pod</text>
            <rect x="235" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="275.0" y="344.0" textAnchor="middle">Pod</text>
            <text x="185" y="308" className="pt mut" textAnchor="middle">contêineres rodam dentro de Pods</text>
            <text x="185" y="308" className="en mut" textAnchor="middle">containers run inside Pods</text>
            <path d="M515 180L515 218" className="ln" />
            <path d="M511.6 211.0L515 218L518.4 211.0" className="ln" />
            <rect x="360" y="218" width="310" height="170" rx="4" className="ln" />
            <text x="374" y="240" className="pt mut" textAnchor="start">nó (worker)</text>
            <text x="374" y="240" className="en mut" textAnchor="start">node (worker)</text>
            <rect x="370" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="415.0" y="275.0" className="mono" textAnchor="middle">kubelet</text>
            <rect x="470" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="515.0" y="275.0" className="mono" textAnchor="middle">kube-proxy</text>
            <rect x="570" y="252" width="90" height="38" rx="4" className="ln fillsoft" />
            <text x="615.0" y="275.0" className="mono" textAnchor="middle">containerd</text>
            <rect x="375" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="415.0" y="344.0" textAnchor="middle">Pod</text>
            <rect x="470" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="510.0" y="344.0" textAnchor="middle">Pod</text>
            <rect x="565" y="320" width="80" height="40" rx="4" className="brandfill" />
            <text x="605.0" y="344.0" textAnchor="middle">Pod</text>
            <text x="515" y="308" className="pt mut" textAnchor="middle">contêineres rodam dentro de Pods</text>
            <text x="515" y="308" className="en mut" textAnchor="middle">containers run inside Pods</text>
            <text x="350" y="203" className="pt mut" textAnchor="middle">API server ⇄ kubelet de cada nó</text>
            <text x="350" y="203" className="en mut" textAnchor="middle">API server ⇄ each node's kubelet</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Peça" en="Piece" />, <T pt="Onde" en="Where" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<T pt="API server" en="API server" />, <T pt="control plane" en="control plane" />, <T pt={<>Única porta de entrada: autentica, autoriza, valida e grava. <code>kubectl</code>, nós e controllers só falam com ele.</>} en={<>The only entry point: authenticates, authorizes, validates and stores. <code>kubectl</code>, nodes and controllers only talk to it.</>} />],
            [<T pt="etcd" en="etcd" />, <T pt="control plane" en="control plane" />, <T pt={<>Banco chave-valor com todo o estado do cluster, <em>inclusive os Secrets</em>. Perdeu o etcd, perdeu o cluster.</>} en={<>Key-value database with all cluster state, <em>including Secrets</em>. Lose etcd, lose the cluster.</>} />],
            [<T pt="scheduler" en="scheduler" />, <T pt="control plane" en="control plane" />, <T pt="Para cada Pod novo, escolhe o nó que tem espaço (CPU, memória, regras)." en="For each new Pod, picks the node with room (CPU, memory, rules)." />],
            [<T pt="controller manager" en="controller manager" />, <T pt="control plane" en="control plane" />, <T pt="Conjunto de “vigias”: cada um compara o estado desejado com o real e corrige." en="A set of “watchers”: each compares desired state with actual state and fixes it." />],
            [<T pt="kubelet" en="kubelet" />, <T pt="cada worker" en="each worker" />, <T pt="Agente no nó: recebe a lista de Pods do API server e manda o runtime executá-los; reporta a saúde." en="Agent on the node: receives the Pod list from the API server and tells the runtime to run them; reports health." />],
            [<T pt="kube-proxy" en="kube-proxy" />, <T pt="cada worker" en="each worker" />, <T pt="Programa as regras de rede para que um Service chegue aos Pods certos." en="Programs the network rules so a Service reaches the right Pods." />],
            [<T pt="container runtime" en="container runtime" />, <T pt="cada worker" en="each worker" />, <T pt={<>Quem de fato roda os contêineres (<code>containerd</code> ou CRI-O).</>} en={<>What actually runs the containers (<code>containerd</code> or CRI-O).</>} />],
          ]}
        />
        <h3><T pt="O laço de reconciliação" en="The reconciliation loop" /></h3>
        <p><T pt={<>Tudo no Kubernetes segue o mesmo padrão: cada controller olha o <em>estado desejado</em> (o que você escreveu) e o <em>estado atual</em> (o que existe) e age sobre a diferença, para sempre. Por isso um Pod apagado volta, e por isso você nunca “inicia” coisas à mão.</>} en={<>Everything in Kubernetes follows the same pattern: each controller looks at the <em>desired state</em> (what you wrote) and the <em>current state</em> (what exists) and acts on the difference, forever. That is why a deleted Pod comes back, and why you never “start” things by hand.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O coração do Kubernetes: um laço que compara o estado desejado com o real e corrige a diferença." en="The heart of Kubernetes: a loop that compares desired state with actual state and fixes the difference." />}>
          <svg viewBox="0 0 700 172" role="img" aria-label="Loop de reconciliação / Reconciliation loop">
            <rect x="10" y="30" width="150" height="62" rx="4" className="ln fillsoft" />
            <text x="85.0" y="59.0" className="pt" textAnchor="middle">1. Você declara</text>
            <text x="85.0" y="59.0" className="en" textAnchor="middle">1. You declare</text>
            <text x="85.0" y="75.0" className="mut" textAnchor="middle">replicas: 3</text>
            <path d="M160 61L185 61" className="ln" />
            <path d="M178.0 64.4L185 61L178.0 57.6" className="ln" />
            <rect x="185" y="30" width="150" height="62" rx="4" className="ln fillsoft" />
            <text x="260.0" y="59.0" className="pt" textAnchor="middle">2. API grava</text>
            <text x="260.0" y="59.0" className="en" textAnchor="middle">2. API stores</text>
            <text x="260.0" y="75.0" className="pt mut" textAnchor="middle">no etcd</text>
            <text x="260.0" y="75.0" className="en mut" textAnchor="middle">in etcd</text>
            <path d="M335 61L360 61" className="ln" />
            <path d="M353.0 64.4L360 61L353.0 57.6" className="ln" />
            <rect x="360" y="30" width="150" height="62" rx="4" className="ln fillsoft" />
            <text x="435.0" y="59.0" className="pt" textAnchor="middle">3. Controller vê</text>
            <text x="435.0" y="59.0" className="en" textAnchor="middle">3. Controller sees</text>
            <text x="435.0" y="75.0" className="pt mut" textAnchor="middle">tem 2, quer 3</text>
            <text x="435.0" y="75.0" className="en mut" textAnchor="middle">has 2, wants 3</text>
            <path d="M510 61L535 61" className="ln" />
            <path d="M528.0 64.4L535 61L528.0 57.6" className="ln" />
            <rect x="535" y="30" width="150" height="62" rx="4" className="brandfill" />
            <text x="610.0" y="59.0" className="pt" textAnchor="middle">4. Cria 1 Pod</text>
            <text x="610.0" y="59.0" className="en" textAnchor="middle">4. Creates 1 Pod</text>
            <text x="610.0" y="75.0" className="pt mut" textAnchor="middle">e volta ao passo 3</text>
            <text x="610.0" y="75.0" className="en mut" textAnchor="middle">then back to step 3</text>
            <path d="M610 92L610 135L435 135L435 99" className="ln dash" />
            <path d="M431.6 106L435 99L438.4 106" className="ln" />
            <text x="522" y="156" className="pt mut" textAnchor="middle">repete para sempre: é isso que “autocura” significa</text>
            <text x="522" y="156" className="en mut" textAnchor="middle">repeats forever: this is what “self-healing” means</text>
          </svg>
        </Diagram>
        <Callout icon="check"><T pt="Em nuvem gerenciada (EKS, GKE, AKS) o control plane é da empresa de nuvem: você cuida só dos workers e do que roda neles. É o caminho recomendado para produção." en="On a managed cloud (EKS, GKE, AKS) the control plane belongs to the cloud provider: you only look after the workers and what runs on them. This is the recommended path for production." /></Callout>
      </Section>
      <Section id="objects" title={<T pt="Os objetos que você vai usar" en="The objects you will use" />}>
        <p><T pt={<>Tudo que você cria é um <strong>objeto</strong> descrito em YAML. Estes são os que cobrem 80% do dia a dia:</>} en={<>Everything you create is an <strong>object</strong> described in YAML. These cover 80% of daily work:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O caminho de uma requisição (Internet → Ingress → Service → Pods) e o que alimenta os Pods." en="A request's path (Internet → Ingress → Service → Pods) and what feeds the Pods." />}>
          <svg viewBox="0 0 700 300" role="img" aria-label="Objetos principais / Main objects">
            <rect x="10" y="100" width="80" height="40" rx="4" className="ln fillsoft" />
            <text x="50.0" y="124.0" textAnchor="middle">Internet</text>
            <path d="M90 120L125 120" className="ln" />
            <path d="M118.0 123.4L125 120L118.0 116.6" className="ln" />
            <rect x="125" y="100" width="95" height="40" rx="4" className="ln" />
            <text x="172.5" y="124.0" textAnchor="middle">Ingress</text>
            <text x="172" y="160" className="pt mut" textAnchor="middle">HTTP(S) de fora</text>
            <text x="172" y="160" className="en mut" textAnchor="middle">HTTP(S) from outside</text>
            <path d="M220 120L255 120" className="ln" />
            <path d="M248.0 123.4L255 120L248.0 116.6" className="ln" />
            <rect x="255" y="100" width="90" height="40" rx="4" className="ln" />
            <text x="300.0" y="124.0" textAnchor="middle">Service</text>
            <text x="300" y="178" className="pt mut" textAnchor="middle">IP/DNS fixo</text>
            <text x="300" y="178" className="en mut" textAnchor="middle">fixed IP/DNS</text>
            <path d="M345 120L385 120" className="ln" />
            <path d="M378.0 123.4L385 120L378.0 116.6" className="ln" />
            <rect x="385" y="25" width="305" height="185" rx="4" className="ln dash" />
            <text x="400" y="47" className="mut" textAnchor="start">Deployment → ReplicaSet → Pods</text>
            <rect x="397" y="70" width="86" height="56" rx="4" className="brandfill" />
            <text x="440.0" y="96.0" textAnchor="middle">Pod</text>
            <text x="440.0" y="112.0" className="mut" textAnchor="middle">app: web</text>
            <rect x="493" y="70" width="86" height="56" rx="4" className="brandfill" />
            <text x="536.0" y="96.0" textAnchor="middle">Pod</text>
            <text x="536.0" y="112.0" className="mut" textAnchor="middle">app: web</text>
            <rect x="589" y="70" width="86" height="56" rx="4" className="brandfill" />
            <text x="632.0" y="96.0" textAnchor="middle">Pod</text>
            <text x="632.0" y="112.0" className="mut" textAnchor="middle">app: web</text>
            <text x="537" y="160" className="pt mut" textAnchor="middle">o Deployment mantém N cópias iguais</text>
            <text x="537" y="160" className="en mut" textAnchor="middle">the Deployment keeps N identical copies</text>
            <text x="537" y="182" className="pt mut" textAnchor="middle">e troca versões aos poucos</text>
            <text x="537" y="182" className="en mut" textAnchor="middle">and swaps versions gradually</text>
            <rect x="400" y="235" width="130" height="36" rx="4" className="ln fillsoft" />
            <text x="465.0" y="257.0" textAnchor="middle">ConfigMap</text>
            <rect x="550" y="235" width="130" height="36" rx="4" className="ln fillsoft" />
            <text x="615.0" y="257.0" textAnchor="middle">Secret</text>
            <path d="M465 235L465 210" className="ln" />
            <path d="M468.4 217.0L465 210L461.6 217.0" className="ln" />
            <path d="M615 235L615 210" className="ln" />
            <path d="M618.4 217.0L615 210L611.6 217.0" className="ln" />
            <text x="465" y="290" className="pt mut" textAnchor="middle">configuração</text>
            <text x="465" y="290" className="en mut" textAnchor="middle">configuration</text>
            <text x="615" y="290" className="pt mut" textAnchor="middle">senhas e tokens</text>
            <text x="615" y="290" className="en mut" textAnchor="middle">passwords and tokens</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Objeto" en="Object" />, <T pt="Em uma frase" en="In one sentence" />, <T pt="Analogia" en="Analogy" />]}
          rows={[
            [<T pt="Pod" en="Pod" />, <T pt="A menor unidade: 1 ou mais contêineres que dividem rede e disco. É descartável: morreu, é substituído por outro (com IP novo)." en="The smallest unit: 1 or more containers sharing network and disk. Disposable: when it dies it is replaced by another (with a new IP)." />, <T pt="um funcionário" en="one employee" />],
            [<T pt="ReplicaSet" en="ReplicaSet" />, <T pt="Garante que existam N Pods iguais. Raramente você o cria; o Deployment o faz." en="Ensures N identical Pods exist. You rarely create it; the Deployment does." />, <T pt="o RH que mantém o quadro" en="HR keeping headcount" />],
            [<T pt="Deployment" en="Deployment" />, <T pt="Descreve o app: imagem, cópias, atualização gradual e rollback. É o objeto mais usado." en="Describes the app: image, copies, gradual update and rollback. The most-used object." />, <T pt="o gerente do time" en="the team manager" />],
            [<T pt="Service" en="Service" />, <T pt="Dá um nome e IP fixos a um grupo de Pods e divide o tráfego entre eles. Os Pods mudam; o Service não." en="Gives a fixed name and IP to a group of Pods and splits traffic among them. Pods change; the Service does not." />, <T pt="o telefone da empresa" en="the company phone number" />],
            [<T pt="Ingress / Gateway" en="Ingress / Gateway" />, <T pt="Regras HTTP(S) de entrada: domínio e caminho para qual Service, com TLS." en="Inbound HTTP(S) rules: domain and path to which Service, with TLS." />, <T pt="a recepção" en="the front desk" />],
            [<T pt="ConfigMap / Secret" en="ConfigMap / Secret" />, <T pt="Configuração e dados sensíveis, fora da imagem. O Secret é “aviso de cuidado”, não cofre (veja segurança)." en="Configuration and sensitive data, outside the image. A Secret is a “handle with care” label, not a vault (see security)." />, <T pt="o manual / o cofre" en="the manual / the safe" />],
            [<T pt="Namespace" en="Namespace" />, <T pt="Divide o cluster em “pastas” isoladas (dev, prod, times), com regras e cotas próprias." en="Splits the cluster into isolated “folders” (dev, prod, teams), with their own rules and quotas." />, <T pt="departamentos" en="departments" />],
            [<T pt="PersistentVolumeClaim" en="PersistentVolumeClaim" />, <T pt="Pedido de disco que sobrevive ao Pod (bancos de dados, uploads)." en="A request for disk that outlives the Pod (databases, uploads)." />, <T pt="um armário trancado" en="a locker" />],
            [<T pt="Job / CronJob" en="Job / CronJob" />, <T pt="Tarefa que roda até terminar (uma vez ou agendada)." en="A task that runs to completion (once or scheduled)." />, <T pt="uma tarefa avulsa" en="a one-off task" />],
            [<T pt="ServiceAccount, Role, RoleBinding" en="ServiceAccount, Role, RoleBinding" />, <T pt="Identidade e permissões (RBAC) de Pods e pessoas dentro do cluster." en="Identity and permissions (RBAC) for Pods and people inside the cluster." />, <T pt="crachá e catraca" en="badge and turnstile" />],
            [<T pt="NetworkPolicy" en="NetworkPolicy" />, <T pt="Firewall entre Pods: quem pode falar com quem." en="Firewall between Pods: who may talk to whom." />, <T pt="portas internas trancadas" en="locked internal doors" />],
          ]}
        />
        <Callout icon="check"><T pt={<>O elo entre os objetos são os <strong>rótulos (labels)</strong>. O Service acha seus Pods por <code>selector: &#123;app: web&#125;</code>; o Deployment acha os dele pelo mesmo mecanismo. Rótulo diferente entre os dois é o erro nº 1 de iniciante: o Service existe, mas aponta para ninguém.</>} en={<>The glue between objects is <strong>labels</strong>. A Service finds its Pods by <code>selector: &#123;app: web&#125;</code>; the Deployment finds its own the same way. A label mismatch between the two is the #1 beginner error: the Service exists but points at nobody.</>} /></Callout>
      </Section>
      <Section id="files" title={<T pt="Os arquivos de configuração" en="The configuration files" />}>
        <p><T pt={<>Você trabalha com <strong>manifestos</strong>: arquivos YAML, um ou vários objetos por arquivo (separados por <code>---</code>), que vão no Git como código. O comando é sempre <code>kubectl apply -f arquivo.yaml</code>.</>} en={<>You work with <strong>manifests</strong>: YAML files, one or several objects per file (separated by <code>---</code>), kept in Git as code. The command is always <code>kubectl apply -f file.yaml</code>.</>} /></p>
        <h3><T pt="Anatomia: quatro campos em todo objeto" en="Anatomy: four fields in every object" /></h3>
        <CodeBlock code={`apiVersion: apps/v1        # which API group/version defines this kind
kind: Deployment           # the type of object
metadata:                  # identity
  name: web                #   unique name inside the namespace
  namespace: default       #   optional; defaults to "default"
  labels:                  #   free key/values other objects use to find this one
    app: web
spec:                      # the DESIRED state: this is what you write
  replicas: 3
  # ...
# status:                  # the ACTUAL state: filled in by the cluster, never by you`} />
        <p><T pt={<>Não decore os campos: pergunte ao próprio cluster. <code>kubectl explain deployment.spec.template.spec.securityContext</code> mostra a documentação oficial de qualquer campo, e <code>kubectl get deploy web -o yaml</code> mostra o objeto completo como o cluster o enxerga.</>} en={<>Do not memorise fields: ask the cluster itself. <code>kubectl explain deployment.spec.template.spec.securityContext</code> shows the official documentation of any field, and <code>kubectl get deploy web -o yaml</code> shows the whole object as the cluster sees it.</>} /></p>
        <h3><T pt="Mapa dos arquivos" en="File map" /></h3>
        <Table
          head={[<T pt="Arquivo (kind)" en="File (kind)" />, <T pt="Para quê" en="What for" />, <T pt="Campos de segurança que importam" en="Security fields that matter" />]}
          rows={[
            [<T pt={<><code>Deployment</code></>} en={<><code>Deployment</code></>} />, <T pt="o app: imagem, cópias, atualização" en="the app: image, copies, rollout" />, <T pt={<><code>securityContext</code>, <code>resources</code>, <code>image</code> (tag/digest), <code>serviceAccountName</code>, <code>automountServiceAccountToken</code></>} en={<><code>securityContext</code>, <code>resources</code>, <code>image</code> (tag/digest), <code>serviceAccountName</code>, <code>automountServiceAccountToken</code></>} />],
            [<T pt={<><code>Service</code></>} en={<><code>Service</code></>} />, <T pt="endereço estável para os Pods" en="stable address for the Pods" />, <T pt={<><code>type</code>: prefira <code>ClusterIP</code>; <code>NodePort</code>/<code>LoadBalancer</code> expõem ao mundo</>} en={<><code>type</code>: prefer <code>ClusterIP</code>; <code>NodePort</code>/<code>LoadBalancer</code> expose to the world</>} />],
            [<T pt={<><code>Ingress</code></>} en={<><code>Ingress</code></>} />, <T pt="entrada HTTP(S) por domínio/caminho" en="HTTP(S) entry by domain/path" />, <T pt={<><code>spec.tls</code> (HTTPS), anotações do controller (WAF, restrição de IP)</>} en={<><code>spec.tls</code> (HTTPS), controller annotations (WAF, IP restriction)</>} />],
            [<T pt={<><code>ConfigMap</code></>} en={<><code>ConfigMap</code></>} />, <T pt="configuração não sensível" en="non-sensitive configuration" />, <T pt="nada de senha aqui" en="no passwords here" />],
            [<T pt={<><code>Secret</code></>} en={<><code>Secret</code></>} />, <T pt="dados sensíveis" en="sensitive data" />, <T pt="só base64 (não cifrado); nunca no Git; RBAC restrito" en="base64 only (not encrypted); never in Git; tight RBAC" />],
            [<T pt={<><code>Namespace</code></>} en={<><code>Namespace</code></>} />, <T pt="isolamento lógico" en="logical isolation" />, <T pt={<>rótulos <code>pod-security.kubernetes.io/*</code></>} en={<><code>pod-security.kubernetes.io/*</code> labels</>} />],
            [<T pt={<><code>ServiceAccount</code></>} en={<><code>ServiceAccount</code></>} />, <T pt="identidade do Pod" en="the Pod's identity" />, <T pt={<><code>automountServiceAccountToken: false</code></>} en={<><code>automountServiceAccountToken: false</code></>} />],
            [<T pt={<><code>Role</code> / <code>ClusterRole</code> + <code>RoleBinding</code></>} en={<><code>Role</code> / <code>ClusterRole</code> + <code>RoleBinding</code></>} />, <T pt="permissões (RBAC)" en="permissions (RBAC)" />, <T pt={<><code>verbs</code>, <code>resources</code>: mínimo necessário, sem <code>*</code></>} en={<><code>verbs</code>, <code>resources</code>: the bare minimum, no <code>*</code></>} />],
            [<T pt={<><code>NetworkPolicy</code></>} en={<><code>NetworkPolicy</code></>} />, <T pt="firewall entre Pods" en="firewall between Pods" />, <T pt={<><code>podSelector</code>, <code>ingress</code>, <code>egress</code></>} en={<><code>podSelector</code>, <code>ingress</code>, <code>egress</code></>} />],
            [<T pt={<><code>ResourceQuota</code> / <code>LimitRange</code></>} en={<><code>ResourceQuota</code> / <code>LimitRange</code></>} />, <T pt="tetos por namespace e por contêiner" en="caps per namespace and per container" />, <T pt="impedem um time ou um invasor de consumir o cluster todo" en="stop a team or an intruder from eating the whole cluster" />],
            [<T pt={<><code>PodDisruptionBudget</code>, <code>HorizontalPodAutoscaler</code></>} en={<><code>PodDisruptionBudget</code>, <code>HorizontalPodAutoscaler</code></>} />, <T pt="disponibilidade e escala" en="availability and scaling" />, <T pt="disponibilidade também é segurança" en="availability is security too" />],
            [<T pt={<><code>kubeconfig</code> (<code>~/.kube/config</code>)</>} en={<><code>kubeconfig</code> (<code>~/.kube/config</code>)</>} />, <T pt={<><em>seu</em> acesso: clusters, usuários, contextos</>} en={<><em>your</em> access: clusters, users, contexts</>} />, <T pt="equivale a uma senha de administrador; não vai no Git" en="equals an admin password; never goes in Git" />],
            [<T pt={<><code>kustomization.yaml</code> / Helm <code>values.yaml</code></>} en={<><code>kustomization.yaml</code> / Helm <code>values.yaml</code></>} />, <T pt="reaproveitar manifestos entre ambientes" en="reuse manifests across environments" />, <T pt="valores sensíveis fora do Git" en="keep sensitive values out of Git" />],
          ]}
        />
        <h3><T pt="Kustomize e Helm: o mesmo app em dev e prod" en="Kustomize and Helm: the same app in dev and prod" /></h3>
        <p><T pt={<>Copiar YAML de ambiente em ambiente vira bagunça. O <strong>Kustomize</strong> (já dentro do <code>kubectl</code>) parte de uma base e aplica <em>remendos</em> por ambiente. O <strong>Helm</strong> usa modelos com <code>values.yaml</code> e é o formato da maioria dos pacotes prontos (Argo CD, ingress, cert-manager).</>} en={<>Copying YAML from environment to environment gets messy. <strong>Kustomize</strong> (built into <code>kubectl</code>) starts from a base and applies per-environment <em>patches</em>. <strong>Helm</strong> uses templates with <code>values.yaml</code> and is the format of most ready-made packages (Argo CD, ingress, cert-manager).</>} /></p>
        <CodeBlock code={`# overlays/prod/kustomization.yaml
resources:
  - ../../base              # the shared Deployment + Service
replicas:
  - name: web
    count: 5                # prod runs 5 copies; dev keeps the base value
images:
  - name: nginxinc/nginx-unprivileged
    newTag: "1.27"          # change the version in ONE place

# kubectl apply -k overlays/prod`} />
        <h3><T pt="kubeconfig: sua chave de acesso" en="kubeconfig: your access key" /></h3>
        <CodeBlock code={`kubectl config get-contexts            # which clusters you can reach (* = current)
kubectl config use-context kind-lab    # switch cluster
kubectl config current-context         # ALWAYS check before apply/delete: wrong cluster = incident`} />
      </Section>
      <Section id="security" title={<T pt="Segurança nos arquivos" en="Security in the files" />}>
        <p><T pt={<>O Kubernetes vem <strong>aberto por padrão</strong>: um Pod roda como root se você não disser o contrário, fala com qualquer outro Pod, e recebe um token para falar com o API server. A boa notícia: quase toda proteção é uma linha de YAML. Pense em camadas:</>} en={<>Kubernetes is <strong>open by default</strong>: a Pod runs as root unless you say otherwise, talks to any other Pod, and gets a token to talk to the API server. The good news: almost every protection is one line of YAML. Think in layers:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Defesa em profundidade: se uma camada falha, a de dentro ainda limita o estrago." en="Defence in depth: if one layer fails, the inner one still limits the damage." />}>
          <svg viewBox="0 0 700 328" role="img" aria-label="Camadas de segurança / Security layers">
            <rect x="10" y="8" width="680" height="312" rx="4" className="ln" />
            <text x="26" y="30" className="pt" textAnchor="start">1. Nuvem e cluster</text>
            <text x="26" y="30" className="en" textAnchor="start">1. Cloud and cluster</text>
            <text x="26" y="48" className="pt mut" textAnchor="start">IAM · endpoint da API · criptografia do etcd · nós atualizados</text>
            <text x="26" y="48" className="en mut" textAnchor="start">IAM · API endpoint · etcd encryption · patched nodes</text>
            <rect x="30" y="66" width="640" height="242" rx="4" className="ln fillsoft" />
            <text x="46" y="88" textAnchor="start">2. Namespace</text>
            <text x="46" y="106" className="mut" textAnchor="start">Pod Security · RBAC · quotas · NetworkPolicy</text>
            <rect x="50" y="124" width="600" height="172" rx="4" className="ln" />
            <text x="66" y="146" textAnchor="start">3. Pod</text>
            <text x="66" y="164" className="pt mut" textAnchor="start">ServiceAccount sem token · securityContext do Pod · seccomp</text>
            <text x="66" y="164" className="en mut" textAnchor="start">tokenless ServiceAccount · Pod securityContext · seccomp</text>
            <rect x="70" y="180" width="560" height="104" rx="4" className="brandfill" />
            <text x="86" y="204" className="pt" textAnchor="start">4. Contêiner</text>
            <text x="86" y="204" className="en" textAnchor="start">4. Container</text>
            <text x="86" y="222" className="pt mut" textAnchor="start">imagem mínima e fixa · non-root · FS somente leitura</text>
            <text x="86" y="222" className="en mut" textAnchor="start">minimal pinned image · non-root · read-only FS</text>
            <text x="86" y="240" className="pt mut" textAnchor="start">sem capabilities · sem escalada de privilégio · limites de CPU/memória</text>
            <text x="86" y="240" className="en mut" textAnchor="start">no capabilities · no privilege escalation · CPU/memory limits</text>
            <text x="86" y="262" className="pt mut" textAnchor="start">← o que você escreve no YAML do app</text>
            <text x="86" y="262" className="en mut" textAnchor="start">← what you write in the app's YAML</text>
          </svg>
        </Diagram>
        <h3><T pt="Camada 4 e 3: o securityContext e o Pod" en="Layers 4 and 3: the securityContext and the Pod" /></h3>
        <CodeBlock code={`spec:
  serviceAccountName: web
  automountServiceAccountToken: false   # the app does not call the K8s API: give it no token
  securityContext:                      # Pod level
    runAsNonRoot: true                  # refuses to start if the image wants root
    runAsUser: 101
    seccompProfile:
      type: RuntimeDefault              # blocks dangerous system calls
  containers:
    - name: web
      image: nginxinc/nginx-unprivileged:1.27   # fixed tag (better: @sha256:digest)
      securityContext:                  # container level
        allowPrivilegeEscalation: false # no setuid tricks to become root
        readOnlyRootFilesystem: true    # attacker cannot write or drop tools
        capabilities:
          drop: ["ALL"]                 # no special Linux powers
      resources:
        requests: { cpu: 50m, memory: 64Mi }
        limits:   { cpu: 200m, memory: 128Mi }   # a crypto-miner or a leak cannot eat the node`} />
        <Table
          head={[<T pt="Campo" en="Field" />, <T pt="O que impede" en="What it stops" />]}
          rows={[
            [<T pt={<><code>runAsNonRoot: true</code></>} en={<><code>runAsNonRoot: true</code></>} />, <T pt="Se o invasor sair do app, ele não é root dentro do contêiner; fugir para o nó fica bem mais difícil." en="If the attacker breaks out of the app, they are not root inside the container; escaping to the node gets much harder." />],
            [<T pt={<><code>allowPrivilegeEscalation: false</code></>} en={<><code>allowPrivilegeEscalation: false</code></>} />, <T pt="Programas com setuid ganhando mais privilégio do que o processo pai." en="setuid programs gaining more privilege than their parent process." />],
            [<T pt={<><code>readOnlyRootFilesystem: true</code></>} en={<><code>readOnlyRootFilesystem: true</code></>} />, <T pt={<>Gravar malware ou editar arquivos do sistema. Dê um <code>emptyDir</code> só para as pastas que precisam de escrita (<code>/tmp</code>).</>} en={<>Writing malware or editing system files. Give an <code>emptyDir</code> only to folders that need writes (<code>/tmp</code>).</>} />],
            [<T pt={<><code>capabilities.drop: [ALL]</code></>} en={<><code>capabilities.drop: [ALL]</code></>} />, <T pt="Poderes de root fatiados do Linux (abrir portas baixas, mudar rede, montar discos). Adicione de volta só o indispensável." en="Root powers sliced up by Linux (low ports, network changes, mounting disks). Add back only what is indispensable." />],
            [<T pt={<><code>seccompProfile: RuntimeDefault</code></>} en={<><code>seccompProfile: RuntimeDefault</code></>} />, <T pt="Chamadas de sistema perigosas usadas em exploits de kernel." en="Dangerous system calls used in kernel exploits." />],
            [<T pt={<><code>resources.limits</code></>} en={<><code>resources.limits</code></>} />, <T pt="Um Pod comprometido (ou com bug) esgotar CPU/memória do nó e derrubar os vizinhos." en="A compromised (or buggy) Pod exhausting the node's CPU/memory and taking neighbours down." />],
            [<T pt={<><code>automountServiceAccountToken: false</code></>} en={<><code>automountServiceAccountToken: false</code></>} />, <T pt={<>O token em <code>/var/run/secrets/…</code> ser roubado e usado contra o API server.</>} en={<>The token in <code>/var/run/secrets/…</code> being stolen and used against the API server.</>} />],
            [<T pt={<><code>image: repo:1.27</code> ou <code>@sha256:…</code></>} en={<><code>image: repo:1.27</code> or <code>@sha256:…</code></>} />, <T pt={<><code>:latest</code> muda sem aviso. O digest garante os mesmos bytes que você escaneou. Use registro privado e <code>imagePullSecrets</code>.</>} en={<><code>:latest</code> changes silently. A digest guarantees the same bytes you scanned. Use a private registry and <code>imagePullSecrets</code>.</>} />],
            [<T pt={<><code>privileged: true</code>, <code>hostNetwork</code>, <code>hostPID</code>, <code>hostPath</code></>} en={<><code>privileged: true</code>, <code>hostNetwork</code>, <code>hostPID</code>, <code>hostPath</code></>} />, <T pt={<><strong>Evite.</strong> Cada um derruba o isolamento entre o contêiner e o nó. É o primeiro item de qualquer auditoria.</>} en={<><strong>Avoid.</strong> Each one tears down the isolation between container and node. The first item of any audit.</>} />],
          ]}
        />
        <h3><T pt="Camada 2: o namespace diz o que é permitido (Pod Security)" en="Layer 2: the namespace says what is allowed (Pod Security)" /></h3>
        <p><T pt={<>O <strong>Pod Security Admission</strong> vem ligado no cluster e é controlado por rótulos no Namespace. Há três perfis: <code>privileged</code> (sem limites), <code>baseline</code> (bloqueia o pior) e <code>restricted</code> (as boas práticas acima, obrigatórias). Três modos: <code>enforce</code> (recusa), <code>audit</code> (registra) e <code>warn</code> (avisa o usuário). Ele substituiu o antigo PodSecurityPolicy, removido no Kubernetes 1.25.</>} en={<><strong>Pod Security Admission</strong> is built into the cluster and controlled by labels on the Namespace. There are three profiles: <code>privileged</code> (no limits), <code>baseline</code> (blocks the worst) and <code>restricted</code> (the best practices above, mandatory). Three modes: <code>enforce</code> (rejects), <code>audit</code> (logs) and <code>warn</code> (warns the user). It replaced the old PodSecurityPolicy, removed in Kubernetes 1.25.</>} /></p>
        <CodeBlock code={`apiVersion: v1
kind: Namespace
metadata:
  name: secure
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest`} />
        <h3><T pt="Camada 2: RBAC, o mínimo de permissão" en="Layer 2: RBAC, least privilege" /></h3>
        <p><T pt={<>RBAC liga <em>quem</em> (ServiceAccount, usuário, grupo) a <em>o que pode fazer</em> (verbos sobre recursos). Um <strong>Role</strong> vale em um namespace; um <strong>ClusterRole</strong> no cluster todo. Regras de ouro: nada de <code>cluster-admin</code> para apps, nada de <code>verbs: ["*"]</code>, e <code>secrets</code> só para quem realmente precisa.</>} en={<>RBAC ties <em>who</em> (ServiceAccount, user, group) to <em>what they may do</em> (verbs on resources). A <strong>Role</strong> applies in one namespace; a <strong>ClusterRole</strong> cluster-wide. Golden rules: no <code>cluster-admin</code> for apps, no <code>verbs: ["*"]</code>, and <code>secrets</code> only for those who truly need them.</>} /></p>
        <CodeBlock code={`kind: Role
metadata: { name: pod-reader, namespace: secure }
rules:
  - apiGroups: [""]               # "" = the core API group
    resources: ["pods"]
    verbs: ["get", "list", "watch"]   # read only
---
kind: RoleBinding                 # ties the Role to a subject
metadata: { name: pod-reader, namespace: secure }
subjects:
  - { kind: ServiceAccount, name: pod-reader, namespace: secure }
roleRef: { kind: Role, name: pod-reader, apiGroup: rbac.authorization.k8s.io }`} />
        <h3><T pt="Camada 2: NetworkPolicy, o firewall interno" en="Layer 2: NetworkPolicy, the internal firewall" /></h3>
        <p><T pt={<>Sem nenhuma política, <strong>todo Pod fala com todo Pod</strong>, de qualquer namespace. Um invasor que entra em um Pod passeia pelo cluster inteiro. O padrão seguro é negar tudo e liberar só o necessário. (O plugin de rede precisa suportar NetworkPolicy; o do EKS, o Calico e o Cilium suportam.)</>} en={<>With no policy, <strong>every Pod talks to every Pod</strong>, from any namespace. An intruder who gets into one Pod roams the whole cluster. The safe default is to deny everything and allow only what is needed. (The network plugin must support NetworkPolicy; EKS's, Calico and Cilium do.)</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Com a política, só quem tem o rótulo certo chega ao web; o resto é descartado." en="With the policy, only whoever has the right label reaches web; the rest is dropped." />}>
          <svg viewBox="0 0 700 222" role="img" aria-label="NetworkPolicy / NetworkPolicy">
            <rect x="10" y="25" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="85.0" y="50.0" className="mono" textAnchor="middle">client</text>
            <text x="85.0" y="66.0" className="mut" textAnchor="middle">role=client</text>
            <rect x="10" y="135" width="150" height="54" rx="4" className="ln fillsoft" />
            <text x="85.0" y="160.0" className="mono" textAnchor="middle">other</text>
            <text x="85.0" y="176.0" className="pt mut" textAnchor="middle">sem o rótulo</text>
            <text x="85.0" y="176.0" className="en mut" textAnchor="middle">without the label</text>
            <rect x="290" y="40" width="140" height="140" rx="4" className="ln dash" />
            <text x="360" y="64" textAnchor="middle">NetworkPolicy</text>
            <text x="360" y="84" className="pt mut" textAnchor="middle">só role=client</text>
            <text x="360" y="84" className="en mut" textAnchor="middle">only role=client</text>
            <text x="360" y="100" className="pt mut" textAnchor="middle">entra na porta 8080</text>
            <text x="360" y="100" className="en mut" textAnchor="middle">gets in on port 8080</text>
            <rect x="520" y="85" width="170" height="54" rx="4" className="brandfill" />
            <text x="605.0" y="110.0" className="mono" textAnchor="middle">web</text>
            <text x="605.0" y="126.0" className="mut" textAnchor="middle">app=web · :8080</text>
            <path d="M160 52L290 80" className="ln" />
            <path d="M282.4 81.8L290 80L283.9 75.2" className="ln" />
            <path d="M430 100L520 108" className="ln" />
            <path d="M512.7 110.8L520 108L513.3 104.0" className="ln" />
            <text x="225" y="56" className="pt mut" textAnchor="middle">✓ passa</text>
            <text x="225" y="56" className="en mut" textAnchor="middle">✓ allowed</text>
            <path d="M160 162L285 138" className="ln" />
            <path d="M278.8 142.7L285 138L277.5 136.0" className="ln" />
            <text x="225" y="172" className="pt mut" textAnchor="middle">✗ bloqueado</text>
            <text x="225" y="172" className="en mut" textAnchor="middle">✗ blocked</text>
            <text x="360" y="208" className="pt mut" textAnchor="middle">sem NetworkPolicy: todo Pod fala com todo Pod</text>
            <text x="360" y="208" className="en mut" textAnchor="middle">without a NetworkPolicy: every Pod talks to every Pod</text>
          </svg>
        </Diagram>
        <CodeBlock code={`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny, namespace: secure }
spec:
  podSelector: {}                   # {} = every Pod in the namespace
  policyTypes: ["Ingress"]          # no ingress rules listed = nothing may enter
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: allow-client-to-web, namespace: secure }
spec:
  podSelector: { matchLabels: { app: web } }   # applies to the web Pods
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - podSelector: { matchLabels: { role: client } }
      ports:
        - port: 8080`} />
        <h3><T pt="Secrets: o que o base64 não faz" en="Secrets: what base64 does not do" /></h3>
        <Callout tone="warn" icon="alert"><T pt={<>Um <code>Secret</code> guarda o valor em <strong>base64, que é só codificação, não criptografia</strong>: <code>echo czNjcjN0 | base64 -d</code> devolve a senha. Quem pode ler o Secret via API (ou ler o etcd) lê a senha. O que realmente protege: RBAC apertado, criptografia do etcd em repouso, e nunca versionar o YAML com o valor.</>} en={<>A <code>Secret</code> stores the value in <strong>base64, which is just encoding, not encryption</strong>: <code>echo czNjcjN0 | base64 -d</code> returns the password. Whoever can read the Secret via the API (or read etcd) reads the password. What really protects it: tight RBAC, etcd encryption at rest, and never committing the YAML with the value.</>} /></Callout>
        <ul>
          <li><T pt={<><strong>Monte como arquivo</strong> (<code>volumeMounts</code> com <code>readOnly: true</code>) em vez de variável de ambiente: variáveis aparecem em dumps de erro, em <code>/proc</code> e em logs de depuração.</>} en={<><strong>Mount as a file</strong> (<code>volumeMounts</code> with <code>readOnly: true</code>) instead of an environment variable: variables show up in crash dumps, in <code>/proc</code> and in debug logs.</>} /></li>
          <li><T pt={<><strong>Em produção, mantenha o segredo fora do cluster</strong> (AWS Secrets Manager, Vault) e sincronize com o External Secrets Operator ou o Secrets Store CSI Driver. No Git, use Sealed Secrets ou SOPS (o valor vai cifrado).</>} en={<><strong>In production, keep the secret outside the cluster</strong> (AWS Secrets Manager, Vault) and sync it with the External Secrets Operator or the Secrets Store CSI Driver. In Git, use Sealed Secrets or SOPS (the value goes encrypted).</>} /></li>
          <li><T pt={<><strong>Rotacione</strong>: um segredo que muda é um segredo que, se vazar, expira.</>} en={<><strong>Rotate</strong>: a secret that changes is one that, if leaked, expires.</>} /></li>
        </ul>
        <h3><T pt="Camada 1: o cluster em si" en="Layer 1: the cluster itself" /></h3>
        <ul>
          <li><T pt={<>API server <strong>não exposto</strong> à internet (ou restrito por IP), autenticação por identidade da nuvem, nada de usuário com senha estática.</>} en={<>API server <strong>not exposed</strong> to the internet (or restricted by IP), authentication through cloud identity, no static-password users.</>} /></li>
          <li><T pt={<><strong>Logs de auditoria</strong> ligados: quem fez o quê, quando.</>} en={<><strong>Audit logs</strong> on: who did what, when.</>} /></li>
          <li><T pt={<>Nós e Kubernetes <strong>atualizados</strong>: o projeto lança uma versão menor a cada ~4 meses e dá correções por cerca de 14 meses.</>} en={<>Nodes and Kubernetes <strong>up to date</strong>: the project ships a minor version about every 4 months and backports fixes for roughly 14 months.</>} /></li>
          <li><T pt={<>Imagens escaneadas (Trivy, ECR scan) e, idealmente, assinadas (cosign); políticas de admissão (Kyverno, OPA Gatekeeper ou <code>ValidatingAdmissionPolicy</code>) para barrar manifestos fora do padrão.</>} en={<>Images scanned (Trivy, ECR scan) and ideally signed (cosign); admission policies (Kyverno, OPA Gatekeeper or <code>ValidatingAdmissionPolicy</code>) to reject manifests that break the standard.</>} /></li>
        </ul>
        <Callout icon="check"><T pt={<>Ferramentas para auditar o que você escreveu: <code>kubescape scan</code> e <code>trivy config .</code> (manifestos), <code>kube-bench</code> (CIS Benchmark do cluster) e <code>kubeconform</code> (valida o YAML). Rode no CI, como o <code>plan</code> do Terraform.</>} en={<>Tools to audit what you wrote: <code>kubescape scan</code> and <code>trivy config .</code> (manifests), <code>kube-bench</code> (the cluster's CIS Benchmark) and <code>kubeconform</code> (validates the YAML). Run them in CI, like Terraform's <code>plan</code>.</>} /></Callout>
      </Section>
      <Section id="lab" title={<T pt="Praticar na sua máquina com Docker" en="Practise on your machine with Docker" />}>
        <p><T pt={<>Você vai usar o <strong>kind</strong> (“Kubernetes IN Docker”): ele cria um cluster real em que cada nó é um contêiner Docker. Sem nuvem, sem custo, e se quebrar basta apagar e criar de novo. As atividades são pequenas e cada uma se apoia na anterior. Todos os comandos desta seção foram executados de ponta a ponta num cluster kind.</>} en={<>You will use <strong>kind</strong> (“Kubernetes IN Docker”): it creates a real cluster in which every node is a Docker container. No cloud, no cost, and if it breaks you just delete and recreate it. The activities are small and each builds on the previous one. Every command in this section was run end to end on a kind cluster.</>} /></p>
        <Table
          head={[<T pt="#" en="#" />, <T pt="Atividade" en="Activity" />, <T pt="Você aprende" en="You learn" />]}
          rows={[
            [<T pt="0" en="0" />, <T pt="Instalar e criar o cluster" en="Install and create the cluster" />, <T pt="nós, kubectl, contexto" en="nodes, kubectl, context" />],
            [<T pt="1" en="1" />, <T pt="Seu primeiro Pod" en="Your first Pod" />, <T pt="Pod, logs, exec, e por que Pod solto não se cura" en="Pod, logs, exec, and why a bare Pod does not heal" />],
            [<T pt="2" en="2" />, <T pt="Deployment e Service" en="Deployment and Service" />, <T pt="cópias, autocura, escala, acesso pelo navegador" en="copies, self-healing, scaling, browser access" />],
            [<T pt="3" en="3" />, <T pt="ConfigMap e Secret" en="ConfigMap and Secret" />, <T pt="configuração fora da imagem; base64 não é cifra" en="configuration outside the image; base64 is not encryption" />],
            [<T pt="4" en="4" />, <T pt="Atualização gradual e rollback" en="Rolling update and rollback" />, <T pt="trocar versão sem parar; voltar quando erra" en="swap versions without stopping; go back when it fails" />],
            [<T pt="5" en="5" />, <T pt="Endurecer o Pod" en="Harden the Pod" />, <T pt="Pod Security, securityContext, limites, probes" en="Pod Security, securityContext, limits, probes" />],
            [<T pt="6" en="6" />, <T pt="RBAC" en="RBAC" />, <T pt={<>permissão mínima e <code>can-i</code></>} en={<>least privilege and <code>can-i</code></>} />],
            [<T pt="7" en="7" />, <T pt="NetworkPolicy" en="NetworkPolicy" />, <T pt="negar tudo e liberar só o necessário" en="deny everything and allow only what is needed" />],
            [<T pt="8" en="8" />, <T pt="Limpar" en="Clean up" />, <T pt="apagar tudo" en="delete everything" />],
          ]}
        />
        <h3><T pt="Atividade 0: instalar e criar o cluster" en="Activity 0: install and create the cluster" /></h3>
        <p><T pt={<>Pré-requisito: Docker funcionando (<code>docker ps</code> responde). Instale o <code>kind</code> e o <code>kubectl</code> (no macOS: <code>brew install kind kubectl</code>; Linux, abaixo; Windows: <code>winget</code> ou use o WSL2).</>} en={<>Prerequisite: Docker working (<code>docker ps</code> answers). Install <code>kind</code> and <code>kubectl</code> (on macOS: <code>brew install kind kubectl</code>; Linux below; Windows: <code>winget</code> or use WSL2).</>} /></p>
        <CodeBlock code={`# Linux (amd64)
curl -Lo kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kind kubectl && sudo mv kind kubectl /usr/local/bin/

mkdir k8s-lab && cd k8s-lab`} />
        <p><T pt={<>Crie o arquivo <code>kind.yaml</code>: um nó de control plane e dois workers, e uma porta do seu computador (<code>8088</code>) ligada à porta <code>30080</code> do cluster, para abrir o app no navegador.</>} en={<>Create the file <code>kind.yaml</code>: one control-plane node and two workers, and one port of your computer (<code>8088</code>) wired to the cluster's port <code>30080</code>, so you can open the app in the browser.</>} /></p>
        <CodeBlock code={`# kind.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: lab
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 30080
        hostPort: 8088
        listenAddress: "127.0.0.1"    # only your machine, not the whole network
  - role: worker
  - role: worker`} />
        <CodeBlock code={`kind create cluster --config kind.yaml
kubectl get nodes`} />
        <p><T pt={<><strong>Resultado esperado:</strong> três nós <code>Ready</code> (a versão depende do kind instalado).</>} en={<><strong>Expected result:</strong> three <code>Ready</code> nodes (the version depends on your kind).</>} /></p>
        <CodeBlock code={`NAME                STATUS   ROLES           AGE   VERSION
lab-control-plane   Ready    control-plane   34s   v1.37.0
lab-worker          Ready    <none>          19s   v1.37.0
lab-worker2         Ready    <none>          20s   v1.37.0`} />
        <p><T pt={<>Curiosidade: <code>docker ps</code> mostra três contêineres, um por nó, e <code>kubectl get pods -n kube-system</code> mostra as peças da seção “Como funciona por dentro” rodando como Pods (<code>etcd</code>, <code>kube-apiserver</code>, <code>kube-scheduler</code>…).</>} en={<>Curiosity: <code>docker ps</code> shows three containers, one per node, and <code>kubectl get pods -n kube-system</code> shows the pieces from “How it works inside” running as Pods (<code>etcd</code>, <code>kube-apiserver</code>, <code>kube-scheduler</code>…).</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Se a porta <code>8088</code> já estiver em uso, o kind falha com “port is already allocated”. Troque o <code>hostPort</code> por outro número e use o mesmo nas atividades seguintes.</>} en={<>If port <code>8088</code> is already in use, kind fails with “port is already allocated”. Change <code>hostPort</code> to another number and use it in the following activities.</>} /></Callout>
        <h3><T pt="Atividade 1: seu primeiro Pod" en="Activity 1: your first Pod" /></h3>
        <CodeBlock code={`kubectl run hello --image=nginx:1.27
kubectl get pods -o wide                    # which node it landed on, and its IP
kubectl logs hello                          # the container's output
kubectl exec hello -- nginx -v              # run a command inside it
kubectl delete pod hello
kubectl get pods                            # gone for good`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o Pod passa a <code>Running</code>, o <code>exec</code> mostra a versão do nginx, e depois de apagado <strong>ele não volta</strong>.</>} en={<><strong>Expected result:</strong> the Pod becomes <code>Running</code>, <code>exec</code> prints the nginx version, and once deleted <strong>it does not come back</strong>.</>} /></p>
        <CodeBlock code={`NAME    READY   STATUS    RESTARTS   AGE   IP           NODE
hello   1/1     Running   0          32s   10.244.2.2   lab-worker
nginx version: nginx/1.27.5
pod "hello" deleted from default namespace
No resources found in default namespace.`} />
        <p><T pt="Lição: um Pod solto não tem ninguém cuidando dele. Para a autocura você precisa de um controller, o Deployment." en="Lesson: a bare Pod has nobody looking after it. For self-healing you need a controller, the Deployment." /></p>
        <h3><T pt="Atividade 2: Deployment e Service" en="Activity 2: Deployment and Service" /></h3>
        <p><T pt={<>Usaremos a imagem <code>nginxinc/nginx-unprivileged</code>, que já roda sem root e escuta na porta <code>8080</code> (a atividade 5 depende disso). Crie <code>web.yaml</code>:</>} en={<>We will use the <code>nginxinc/nginx-unprivileged</code> image, which already runs without root and listens on port <code>8080</code> (activity 5 depends on that). Create <code>web.yaml</code>:</>} /></p>
        <CodeBlock code={`# web.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 3                          # desired state: 3 copies
  selector:
    matchLabels:
      app: web                         # "my Pods are the ones labelled app=web"
  template:                            # the Pod template
    metadata:
      labels:
        app: web                       # MUST match the selector above
    spec:
      containers:
        - name: web
          image: nginxinc/nginx-unprivileged:1.27
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: NodePort                       # lab only: opens a port on the nodes
  selector:
    app: web                           # sends traffic to Pods labelled app=web
  ports:
    - port: 80                         # the Service's port
      targetPort: 8080                 # the container's port
      nodePort: 30080                  # the port kind forwards to localhost:8088`} />
        <CodeBlock code={`kubectl apply -f web.yaml
kubectl rollout status deploy/web
kubectl get deploy,rs,pods
curl -s -o /dev/null -w "%{http_code}\\n" localhost:8088      # or open http://localhost:8088`} />
        <p><T pt={<><strong>Resultado esperado:</strong> <code>3/3</code> prontos, um ReplicaSet e três Pods, e <code>200</code> do curl.</>} en={<><strong>Expected result:</strong> <code>3/3</code> ready, one ReplicaSet and three Pods, and <code>200</code> from curl.</>} /></p>
        <CodeBlock code={`NAME                  READY   UP-TO-DATE   AVAILABLE
deployment.apps/web   3/3     3            3

NAME                       READY   STATUS    RESTARTS   AGE
pod/web-7bf55664b5-6qznz   1/1     Running   0          39s
pod/web-7bf55664b5-mcxwf   1/1     Running   0          39s
pod/web-7bf55664b5-vp2ws   1/1     Running   0          39s
200`} />
        <p><T pt={<>Agora a <strong>autocura</strong>. Apague um Pod (use um nome da sua lista) e olhe de novo, rápido:</>} en={<>Now <strong>self-healing</strong>. Delete a Pod (use a name from your list) and look again, quickly:</>} /></p>
        <CodeBlock code={`kubectl delete pod web-7bf55664b5-6qznz
kubectl get pods                          # a new Pod is already being created

kubectl scale deploy/web --replicas=5     # scale up
kubectl get pods                          # 5 Pods
kubectl scale deploy/web --replicas=3`} />
        <p><T pt={<><strong>Resultado esperado:</strong> assim que um Pod entra em <code>Terminating</code>, outro nasce em <code>ContainerCreating</code>: o laço de reconciliação em ação.</>} en={<><strong>Expected result:</strong> as soon as one Pod goes <code>Terminating</code>, another is born in <code>ContainerCreating</code>: the reconciliation loop in action.</>} /></p>
        <CodeBlock code={`NAME                   READY   STATUS              RESTARTS   AGE
web-7bf55664b5-6qznz   1/1     Terminating         0          41s
web-7bf55664b5-7tq5l   0/1     ContainerCreating   0          1s
web-7bf55664b5-mcxwf   1/1     Running             0          41s
web-7bf55664b5-vp2ws   1/1     Running             0          41s`} />
        <p><T pt={<>Desafio: troque o rótulo do Service para <code>app: errado</code>, aplique e rode <code>kubectl get endpoints web</code>. A lista fica vazia e o curl falha: é o erro nº 1 de rótulos que vimos antes. Desfaça com <code>kubectl apply -f web.yaml</code>.</>} en={<>Challenge: change the Service's label to <code>app: wrong</code>, apply and run <code>kubectl get endpoints web</code>. The list is empty and curl fails: the #1 label error we saw earlier. Undo with <code>kubectl apply -f web.yaml</code>.</>} /></p>
        <h3><T pt="Atividade 3: ConfigMap e Secret" en="Activity 3: ConfigMap and Secret" /></h3>
        <CodeBlock code={`kubectl create configmap web-config --from-literal=GREETING="hello from k8s"
kubectl create secret generic web-secret --from-literal=API_KEY=s3cr3t

# inject both as environment variables in the Deployment (this triggers a new rollout)
kubectl set env deploy/web --from=configmap/web-config
kubectl set env deploy/web --from=secret/web-secret
kubectl rollout status deploy/web

kubectl exec deploy/web -- printenv GREETING API_KEY
kubectl get secret web-secret -o jsonpath='{.data.API_KEY}'; echo
kubectl get secret web-secret -o jsonpath='{.data.API_KEY}' | base64 -d; echo`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o Pod enxerga os dois valores; o Secret guardado é só base64, e qualquer um com acesso de leitura recupera a senha.</>} en={<><strong>Expected result:</strong> the Pod sees both values; the stored Secret is just base64, and anyone with read access recovers the password.</>} /></p>
        <CodeBlock code={`hello from k8s
s3cr3t
czNjcjN0
s3cr3t`} />
        <p><T pt={<>Lição: a configuração ficou fora da imagem (a mesma imagem serve a dev e prod), mas o Secret <em>não</em> está protegido por ser Secret. Quem protege é o RBAC (atividade 6) e, em produção, o cofre externo.</>} en={<>Lesson: the configuration lives outside the image (the same image serves dev and prod), but the Secret is <em>not</em> protected just for being a Secret. RBAC (activity 6) and, in production, an external vault protect it.</>} /></p>
        <h3><T pt="Atividade 4: atualização gradual e rollback" en="Activity 4: rolling update and rollback" /></h3>
        <CodeBlock code={`kubectl set image deploy/web web=nginxinc/nginx-unprivileged:1.28
kubectl rollout status deploy/web           # old Pods leave as new ones become ready
kubectl rollout history deploy/web

# now ship a broken version on purpose
kubectl set image deploy/web web=nginxinc/nginx-unprivileged:nao-existe
kubectl get pods                            # one new Pod in ErrImagePull; the 3 old ones still serve
curl -s -o /dev/null -w "%{http_code}\\n" localhost:8088      # still 200

kubectl rollout undo deploy/web             # go back to the last good version
kubectl rollout status deploy/web`} />
        <p><T pt={<><strong>Resultado esperado:</strong> a versão quebrada nunca derruba o site, porque o Kubernetes só tira um Pod antigo quando o novo fica pronto. O <code>undo</code> restaura a versão boa.</>} en={<><strong>Expected result:</strong> the broken version never takes the site down, because Kubernetes only removes an old Pod once the new one is ready. <code>undo</code> restores the good version.</>} /></p>
        <CodeBlock code={`NAME                   READY   STATUS         RESTARTS   AGE
web-6b6f99c975-86zgm   0/1     ErrImagePull   0          16s
web-7db97c8d9-2blnr    1/1     Running        0          65s
web-7db97c8d9-nn5t6    1/1     Running        0          41s
web-7db97c8d9-t9256    1/1     Running        0          18s`} />
        <p><T pt={<>Em equipe, o <code>undo</code> manual é o plano B: o normal é reverter o commit no Git e deixar o pipeline reaplicar.</>} en={<>On a team, the manual <code>undo</code> is plan B: normally you revert the commit in Git and let the pipeline reapply.</>} /></p>
        <h3><T pt="Atividade 5: endurecer o Pod" en="Activity 5: harden the Pod" /></h3>
        <p><T pt={<>Crie um namespace que <strong>só aceita Pods que seguem o perfil restricted</strong> e tente subir um Pod comum:</>} en={<>Create a namespace that <strong>only accepts Pods following the restricted profile</strong> and try to start an ordinary Pod:</>} /></p>
        <CodeBlock code={`# secure-ns.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: secure
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest`} />
        <CodeBlock code={`kubectl apply -f secure-ns.yaml
kubectl run bad --image=nginx:1.27 -n secure`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o cluster recusa e diz exatamente o que faltou, o que é um roteiro do que escrever.</>} en={<><strong>Expected result:</strong> the cluster refuses and says exactly what is missing, which is a to-do list of what to write.</>} /></p>
        <CodeBlock code={`Error from server (Forbidden): pods "bad" is forbidden: violates PodSecurity "restricted:latest":
allowPrivilegeEscalation != false (container "bad" must set securityContext.allowPrivilegeEscalation=false),
unrestricted capabilities (container "bad" must set securityContext.capabilities.drop=["ALL"]),
runAsNonRoot != true (pod or container "bad" must set securityContext.runAsNonRoot=true),
seccompProfile (pod or container "bad" must set securityContext.seccompProfile.type to
"RuntimeDefault" or "Localhost")`} />
        <p><T pt={<>Agora a versão endurecida, <code>web-secure.yaml</code>, com os campos da seção de segurança mais <em>probes</em> (o Kubernetes só manda tráfego quando o <code>readinessProbe</code> responde, e reinicia o contêiner se o <code>livenessProbe</code> falhar):</>} en={<>Now the hardened version, <code>web-secure.yaml</code>, with the fields from the security section plus <em>probes</em> (Kubernetes only sends traffic once the <code>readinessProbe</code> answers, and restarts the container if the <code>livenessProbe</code> fails):</>} /></p>
        <CodeBlock code={`# web-secure.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: web
automountServiceAccountToken: false
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      serviceAccountName: web
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        runAsUser: 101
        runAsGroup: 101
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: web
          image: nginxinc/nginx-unprivileged:1.27
          ports:
            - containerPort: 8080
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
          readinessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 2
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
          volumeMounts:
            - name: tmp
              mountPath: /tmp          # the only writable folder
      volumes:
        - name: tmp
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 8080               # ClusterIP (default): reachable only inside the cluster`} />
        <CodeBlock code={`kubectl apply -n secure -f web-secure.yaml
kubectl rollout status deploy/web -n secure
kubectl exec -n secure deploy/web -- sh -c 'id; touch /etc/x; touch /tmp/ok && echo tmp-ok; ls /var/run/secrets'`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o Pod passa pelo namespace restricted; roda como usuário 101 (não root); não consegue escrever fora de <code>/tmp</code>; e não tem token do Kubernetes.</>} en={<><strong>Expected result:</strong> the Pod passes the restricted namespace; runs as user 101 (not root); cannot write outside <code>/tmp</code>; and has no Kubernetes token.</>} /></p>
        <CodeBlock code={`uid=101(nginx) gid=101(nginx) groups=101(nginx)
touch: cannot touch '/etc/x': Read-only file system
tmp-ok
ls: cannot access '/var/run/secrets': No such file or directory
command terminated with exit code 2        # the last error is expected: that folder does not exist`} />
        <Callout icon="check"><T pt={<>Dica: ao aplicar um <code>Deployment</code> inseguro num namespace restrito, o Deployment é criado, mas os Pods são recusados. Se um Deployment mostra <code>0/3</code>, rode <code>kubectl describe rs</code> ou <code>kubectl get events</code> para ver o motivo.</>} en={<>Tip: when you apply an insecure <code>Deployment</code> to a restricted namespace, the Deployment is created but its Pods are rejected. If a Deployment shows <code>0/3</code>, run <code>kubectl describe rs</code> or <code>kubectl get events</code> to see why.</>} /></Callout>
        <h3><T pt="Atividade 6: RBAC" en="Activity 6: RBAC" /></h3>
        <CodeBlock code={`# rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-reader
  namespace: secure
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: secure
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader
  namespace: secure
subjects:
  - kind: ServiceAccount
    name: pod-reader
    namespace: secure
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`} />
        <CodeBlock code={`kubectl apply -f rbac.yaml
SA=system:serviceaccount:secure:pod-reader
kubectl auth can-i list pods     -n secure  --as=$SA
kubectl auth can-i delete pods   -n secure  --as=$SA
kubectl auth can-i get secrets   -n secure  --as=$SA
kubectl auth can-i list pods     -n default --as=$SA`} />
        <p><T pt={<><strong>Resultado esperado:</strong> só a ação liberada, no namespace liberado, responde <code>yes</code>.</>} en={<><strong>Expected result:</strong> only the allowed action, in the allowed namespace, answers <code>yes</code>.</>} /></p>
        <CodeBlock code={`yes
no
no
no`} />
        <p><T pt={<><code>kubectl auth can-i --list --as=$SA -n secure</code> mostra tudo o que uma identidade pode fazer. É o primeiro comando de uma revisão de permissões.</>} en={<><code>kubectl auth can-i --list --as=$SA -n secure</code> shows everything an identity can do. It is the first command of a permissions review.</>} /></p>
        <h3><T pt="Atividade 7: NetworkPolicy" en="Activity 7: NetworkPolicy" /></h3>
        <p><T pt={<>Suba dois Pods de teste no namespace <code>secure</code>: um com o rótulo <code>role=client</code> e outro sem. Como o namespace é restricted, eles também precisam do <code>securityContext</code>. Crie <code>clients.yaml</code>:</>} en={<>Start two test Pods in the <code>secure</code> namespace: one with the label <code>role=client</code> and one without. Since the namespace is restricted, they also need the <code>securityContext</code>. Create <code>clients.yaml</code>:</>} /></p>
        <CodeBlock code={`# clients.yaml
apiVersion: v1
kind: Pod
metadata:
  name: client
  namespace: secure
  labels:
    role: client
spec:
  securityContext: { runAsNonRoot: true, runAsUser: 1000, seccompProfile: { type: RuntimeDefault } }
  containers:
    - name: client
      image: busybox:1.37
      command: ["sleep", "3600"]
      securityContext: { allowPrivilegeEscalation: false, capabilities: { drop: ["ALL"] } }
---
apiVersion: v1
kind: Pod
metadata:
  name: other
  namespace: secure
spec:
  securityContext: { runAsNonRoot: true, runAsUser: 1000, seccompProfile: { type: RuntimeDefault } }
  containers:
    - name: other
      image: busybox:1.37
      command: ["sleep", "3600"]
      securityContext: { allowPrivilegeEscalation: false, capabilities: { drop: ["ALL"] } }`} />
        <CodeBlock code={`kubectl apply -f clients.yaml
kubectl wait -n secure --for=condition=Ready pod/client pod/other

# BEFORE any policy: both reach web
kubectl exec -n secure client -- wget -qO- -T 3 http://web | head -2
kubectl exec -n secure other  -- wget -qO- -T 3 http://web | head -2`} />
        <p><T pt={<>Salve as duas políticas da seção de segurança em <code>netpol.yaml</code> (a <code>default-deny</code> e a <code>allow-client-to-web</code>) e aplique:</>} en={<>Save the two policies from the security section as <code>netpol.yaml</code> (<code>default-deny</code> and <code>allow-client-to-web</code>) and apply them:</>} /></p>
        <CodeBlock code={`kubectl apply -f netpol.yaml
kubectl exec -n secure client -- wget -qO- -T 3 http://web | head -2    # allowed
kubectl exec -n secure other  -- wget -qO- -T 3 http://web | head -2    # blocked`} />
        <p><T pt={<><strong>Resultado esperado:</strong> antes, os dois recebem o HTML; depois, só o <code>client</code> recebe, e o <code>other</code> fica sem resposta até o tempo esgotar.</>} en={<><strong>Expected result:</strong> before, both get the HTML; after, only <code>client</code> does, and <code>other</code> gets no answer until it times out.</>} /></p>
        <CodeBlock code={`# client (allowed)
<!DOCTYPE html>
<html>
# other (blocked)
wget: download timed out
command terminated with exit code 1`} />
        <h3><T pt="Bônus: fechar também a saída (egress)" en="Bonus: also close the outbound side (egress)" /></h3>
        <p><T pt={<>Negar a <em>saída</em> impede um Pod comprometido de “ligar para casa” (exfiltrar dados, baixar ferramentas). Mas ao negar tudo você também bloqueia o <strong>DNS</strong>, e nada mais resolve nomes (o erro é <code>bad address 'web'</code>). Por isso liberamos o DNS e depois cada destino necessário:</>} en={<>Denying <em>outbound</em> traffic stops a compromised Pod from “phoning home” (exfiltrating data, downloading tools). But denying everything also blocks <strong>DNS</strong>, and nothing resolves names any more (the error is <code>bad address 'web'</code>). So we allow DNS first and then each needed destination:</>} /></p>
        <CodeBlock code={`# egress.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny-egress, namespace: secure }
spec:
  podSelector: {}
  policyTypes: ["Egress"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: allow-dns, namespace: secure }
spec:
  podSelector: {}
  policyTypes: ["Egress"]
  egress:
    - to:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: kube-system }
          podSelector:
            matchLabels: { k8s-app: kube-dns }
      ports:
        - { port: 53, protocol: UDP }
        - { port: 53, protocol: TCP }
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: client-egress-to-web, namespace: secure }
spec:
  podSelector: { matchLabels: { role: client } }
  policyTypes: ["Egress"]
  egress:
    - to:
        - podSelector: { matchLabels: { app: web } }
      ports:
        - port: 8080`} />
        <CodeBlock code={`kubectl apply -f egress.yaml
kubectl exec -n secure client -- wget -qO- -T 3 http://web | head -2          # still works
kubectl exec -n secure client -- wget -qO- -T 3 http://example.com | head -2  # blocked`} />
        <h3><T pt="Atividade 8: limpar" en="Activity 8: clean up" /></h3>
        <CodeBlock code={`kind delete cluster --name lab      # removes the three node containers; nothing else is left behind`} />
        <h3><T pt="E depois? Um roteiro de estudo" en="What next? A study path" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Repita as atividades <em>sem copiar</em>, escrevendo os YAMLs com a ajuda de <code>kubectl explain</code> e <code>kubectl create ... --dry-run=client -o yaml</code>.</>} en={<>Repeat the activities <em>without copying</em>, writing the YAMLs with the help of <code>kubectl explain</code> and <code>kubectl create ... --dry-run=client -o yaml</code>.</>} /></li>
          <li><T pt={<>Quebre de propósito: imagem inexistente, rótulo errado, limite de memória baixo demais (<code>OOMKilled</code>), probe errado. Aprenda a ler <code>kubectl describe</code>, <code>logs</code> e <code>get events</code>.</>} en={<>Break things on purpose: missing image, wrong label, memory limit too low (<code>OOMKilled</code>), wrong probe. Learn to read <code>kubectl describe</code>, <code>logs</code> and <code>get events</code>.</>} /></li>
          <li><T pt={<>Suba um app seu: um Deployment, Service, ConfigMap e um PersistentVolumeClaim para o banco (use o <a href="/notas/postgres-for-devs/">Postgres</a> da outra nota).</>} en={<>Deploy an app of your own: a Deployment, Service, ConfigMap and a PersistentVolumeClaim for the database (use the <a href="/notas/postgres-for-devs/">Postgres</a> from the other note).</>} /></li>
          <li><T pt={<>Instale um Ingress/Gateway e um <code>cert-manager</code>; empacote o app com Kustomize ou Helm.</>} en={<>Install an Ingress/Gateway and <code>cert-manager</code>; package the app with Kustomize or Helm.</>} /></li>
          <li><T pt={<>Passe os manifestos por <code>kubescape</code> ou <code>trivy config</code> e corrija os achados.</>} en={<>Run the manifests through <code>kubescape</code> or <code>trivy config</code> and fix the findings.</>} /></li>
          <li><T pt="Preparação formal: as provas CKA, CKAD e CKS (segurança) da Linux Foundation, e o simulador killer.sh, são o melhor treino prático." en="Formal preparation: the Linux Foundation's CKA, CKAD and CKS (security) exams, and the killer.sh simulator, are the best hands-on practice." /></li>
        </ol>
      </Section>
      <Section id="aws" title={<T pt="Colocar em produção com segurança na AWS (EKS)" en="Running it in production, securely, on AWS (EKS)" />}>
        <p><T pt={<>O serviço gerenciado da AWS é o <strong>EKS</strong> (Elastic Kubernetes Service): a AWS opera o control plane (alta disponibilidade em várias zonas, atualizações, backup do etcd) e você cuida dos nós e dos apps. O modelo de responsabilidade compartilhada vale aqui: a AWS protege o control plane; <strong>a configuração do seu cluster e dos seus Pods é com você</strong>.</>} en={<>AWS's managed service is <strong>EKS</strong> (Elastic Kubernetes Service): AWS runs the control plane (multi-zone high availability, upgrades, etcd backups) and you look after the nodes and the apps. The shared-responsibility model applies: AWS protects the control plane; <strong>your cluster's and Pods' configuration is on you</strong>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Nós em subnets privadas, só o ALB exposto; o resto da AWS é acessado por IAM, não por senha." en="Nodes in private subnets, only the ALB exposed; the rest of AWS is reached through IAM, not passwords." />}>
          <svg viewBox="0 0 700 428" role="img" aria-label="Arquitetura de referência no EKS / Reference architecture on EKS">
            <rect x="5" y="115" width="75" height="44" rx="4" className="ln fillsoft" />
            <text x="42.5" y="141.0" textAnchor="middle">Internet</text>
            <path d="M80 137L140 137" className="ln" />
            <path d="M133.0 140.4L140 137L133.0 133.6" className="ln" />
            <text x="42" y="104" className="mut" textAnchor="middle">HTTPS</text>
            <rect x="100" y="8" width="590" height="412" rx="4" className="ln dash" />
            <text x="114" y="28" className="pt mut" textAnchor="start">conta AWS · região</text>
            <text x="114" y="28" className="en mut" textAnchor="start">AWS account · region</text>
            <rect x="115" y="40" width="560" height="262" rx="4" className="ln" />
            <text x="128" y="60" className="mut" textAnchor="start">VPC</text>
            <rect x="130" y="72" width="150" height="218" rx="4" className="ln fillsoft" />
            <text x="142" y="92" className="pt mut" textAnchor="start">subnets públicas</text>
            <text x="142" y="92" className="en mut" textAnchor="start">public subnets</text>
            <rect x="140" y="114" width="130" height="46" rx="4" className="brandfill" />
            <text x="205.0" y="135.0" textAnchor="middle">ALB</text>
            <text x="205.0" y="151.0" className="mut" textAnchor="middle">AWS LB Controller</text>
            <rect x="140" y="180" width="130" height="46" rx="4" className="ln" />
            <text x="205.0" y="201.0" textAnchor="middle">NAT gateway</text>
            <text x="205.0" y="217.0" className="pt mut" textAnchor="middle">saída para a internet</text>
            <text x="205.0" y="217.0" className="en mut" textAnchor="middle">outbound internet</text>
            <rect x="298" y="72" width="365" height="218" rx="4" className="ln fillsoft" />
            <text x="310" y="92" className="pt mut" textAnchor="start">subnets privadas (2+ zonas)</text>
            <text x="310" y="92" className="en mut" textAnchor="start">private subnets (2+ zones)</text>
            <rect x="308" y="106" width="168" height="170" rx="4" className="ln" />
            <text x="392" y="126" className="pt mut" textAnchor="middle">nó · zona a</text>
            <text x="392" y="126" className="en mut" textAnchor="middle">node · zone a</text>
            <rect x="318" y="140" width="70" height="40" rx="4" className="brandfill" />
            <text x="353.0" y="164.0" textAnchor="middle">Pod</text>
            <rect x="396" y="140" width="70" height="40" rx="4" className="brandfill" />
            <text x="431.0" y="164.0" textAnchor="middle">Pod</text>
            <text x="392" y="208" className="mut" textAnchor="middle">managed node group</text>
            <text x="392" y="226" className="pt mut" textAnchor="middle">IMDSv2 · SG · disco cifrado</text>
            <text x="392" y="226" className="en mut" textAnchor="middle">IMDSv2 · SG · encrypted disk</text>
            <text x="392" y="244" className="pt mut" textAnchor="middle">sem IP público</text>
            <text x="392" y="244" className="en mut" textAnchor="middle">no public IP</text>
            <rect x="488" y="106" width="168" height="170" rx="4" className="ln" />
            <text x="572" y="126" className="pt mut" textAnchor="middle">nó · zona b</text>
            <text x="572" y="126" className="en mut" textAnchor="middle">node · zone b</text>
            <rect x="498" y="140" width="70" height="40" rx="4" className="brandfill" />
            <text x="533.0" y="164.0" textAnchor="middle">Pod</text>
            <rect x="576" y="140" width="70" height="40" rx="4" className="brandfill" />
            <text x="611.0" y="164.0" textAnchor="middle">Pod</text>
            <text x="572" y="208" className="mut" textAnchor="middle">managed node group</text>
            <text x="572" y="226" className="pt mut" textAnchor="middle">IMDSv2 · SG · disco cifrado</text>
            <text x="572" y="226" className="en mut" textAnchor="middle">IMDSv2 · SG · encrypted disk</text>
            <text x="572" y="244" className="pt mut" textAnchor="middle">sem IP público</text>
            <text x="572" y="244" className="en mut" textAnchor="middle">no public IP</text>
            <path d="M270 137L318 160" className="ln" />
            <path d="M310.2 160.0L318 160L313.2 153.9" className="ln" />
            <rect x="115" y="322" width="130" height="50" rx="4" className="ln fillsoft" />
            <text x="180.0" y="345.0" textAnchor="middle">EKS control plane</text>
            <text x="180.0" y="361.0" className="pt mut" textAnchor="middle">gerenciado pela AWS</text>
            <text x="180.0" y="361.0" className="en mut" textAnchor="middle">managed by AWS</text>
            <rect x="255" y="322" width="85" height="50" rx="4" className="ln fillsoft" />
            <text x="297.5" y="345.0" textAnchor="middle">ECR</text>
            <text x="297.5" y="361.0" className="pt mut" textAnchor="middle">imagens</text>
            <text x="297.5" y="361.0" className="en mut" textAnchor="middle">images</text>
            <rect x="350" y="322" width="130" height="50" rx="4" className="ln fillsoft" />
            <text x="415.0" y="345.0" textAnchor="middle">Secrets Manager</text>
            <text x="415.0" y="361.0" className="pt mut" textAnchor="middle">segredos</text>
            <text x="415.0" y="361.0" className="en mut" textAnchor="middle">secrets</text>
            <rect x="490" y="322" width="70" height="50" rx="4" className="ln fillsoft" />
            <text x="525.0" y="345.0" textAnchor="middle">KMS</text>
            <text x="525.0" y="361.0" className="pt mut" textAnchor="middle">chaves</text>
            <text x="525.0" y="361.0" className="en mut" textAnchor="middle">keys</text>
            <rect x="570" y="322" width="105" height="50" rx="4" className="ln fillsoft" />
            <text x="622.5" y="345.0" textAnchor="middle">CloudWatch</text>
            <text x="622.5" y="361.0" className="pt mut" textAnchor="middle">logs e alarmes</text>
            <text x="622.5" y="361.0" className="en mut" textAnchor="middle">logs &amp; alarms</text>
            <text x="395" y="392" className="pt mut" textAnchor="middle">Pods acessam a AWS com uma IAM role própria (Pod Identity / IRSA), sem chaves fixas.</text>
            <text x="395" y="392" className="en mut" textAnchor="middle">Pods reach AWS with their own IAM role (Pod Identity / IRSA), with no static keys.</text>
            <text x="395" y="410" className="pt mut" textAnchor="middle">Control plane e nós se falam por ENIs dentro da sua VPC.</text>
            <text x="395" y="410" className="en mut" textAnchor="middle">The control plane and nodes talk through ENIs inside your VPC.</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Custo.</strong> O EKS cobra pelo control plane por hora (cerca de US$ 0,10/h, uns US$ 73 por mês, consulte a tabela de preços atual), mais os nós EC2, o NAT gateway e o ALB. Crie o cluster de estudo, pratique e <strong>apague no mesmo dia</strong> (<code>eksctl delete cluster</code>). Defina um alerta de orçamento (AWS Budgets) antes de começar.</>} en={<><strong>Cost.</strong> EKS charges for the control plane by the hour (about US$ 0.10/h, roughly US$ 73 a month, check the current price list), plus the EC2 nodes, the NAT gateway and the ALB. Create the study cluster, practise and <strong>delete it the same day</strong> (<code>eksctl delete cluster</code>). Set a budget alert (AWS Budgets) before you begin.</>} /></Callout>
        <h3><T pt="Passo 1: o cluster, já com os controles de segurança" en="Step 1: the cluster, with security controls from day one" /></h3>
        <p><T pt={<>O jeito mais curto de aprender é o <code>eksctl</code>, que lê um arquivo e cria VPC, control plane e nós. Em produção real, descreva a mesma coisa em <a href="/notas/terraform/">Terraform</a> (módulos <code>terraform-aws-modules/eks</code>). Os comentários mostram o que cada linha protege:</>} en={<>The shortest way to learn is <code>eksctl</code>, which reads a file and creates the VPC, control plane and nodes. In real production, describe the same thing in <a href="/notas/terraform/">Terraform</a> (the <code>terraform-aws-modules/eks</code> modules). The comments show what each line protects:</>} /></p>
        <CodeBlock code={`# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: demo
  region: us-east-1
  version: "1.35"                      # use a version currently in standard support

accessConfig:
  authenticationMode: API              # access via IAM "access entries"; no legacy aws-auth ConfigMap

vpc:
  clusterEndpoints:
    privateAccess: true
    publicAccess: true                 # best for production: false + VPN/bastion
  publicAccessCIDRs: ["203.0.113.10/32"]   # replace with YOUR IP: only it can reach the API server

secretsEncryption:
  keyARN: arn:aws:kms:us-east-1:111122223333:key/REPLACE-ME   # your own KMS key for Secrets

cloudWatch:
  clusterLogging:
    enableTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"]

iam:
  withOIDC: true                       # lets Pods assume IAM roles (IRSA)

addons:
  - name: vpc-cni
    configurationValues: '{"enableNetworkPolicy": "true"}'   # NetworkPolicy enforcement
  - name: eks-pod-identity-agent       # IAM roles for Pods (Pod Identity)

managedNodeGroups:
  - name: ng-private
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 2
    maxSize: 4
    privateNetworking: true            # nodes in private subnets, no public IP
    volumeEncrypted: true              # encrypted disks`} />
        <CodeBlock code={`eksctl create cluster -f cluster.yaml                       # ~15-20 minutes
aws eks update-kubeconfig --name demo --region us-east-1    # writes your kubeconfig (short-lived tokens via IAM)
kubectl get nodes`} />
        <Callout icon="check"><T pt={<>O <code>kubectl</code> do EKS não usa senha: o <code>kubeconfig</code> chama <code>aws eks get-token</code> e o acesso segue as suas credenciais da AWS (SSO, de preferência). Quem entra no cluster é decidido por <em>access entries</em> do IAM, com políticas como <code>AmazonEKSViewPolicy</code>; evite dar <code>cluster-admin</code> a todo mundo.</>} en={<>EKS's <code>kubectl</code> uses no password: the <code>kubeconfig</code> calls <code>aws eks get-token</code> and access follows your AWS credentials (SSO, ideally). Who gets into the cluster is decided by IAM <em>access entries</em>, with policies such as <code>AmazonEKSViewPolicy</code>; avoid giving <code>cluster-admin</code> to everyone.</>} /></Callout>
        <h3><T pt="Passo 2: imagens no ECR" en="Step 2: images in ECR" /></h3>
        <CodeBlock code={`aws ecr create-repository --repository-name web \\
  --image-scanning-configuration scanOnPush=true \\
  --image-tag-mutability IMMUTABLE \\
  --encryption-configuration encryptionType=KMS

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com
docker build -t 111122223333.dkr.ecr.us-east-1.amazonaws.com/web:1.0.0 .
docker push 111122223333.dkr.ecr.us-east-1.amazonaws.com/web:1.0.0`} />
        <p><T pt={<>Tags imutáveis impedem que a <code>1.0.0</code> seja sobrescrita; o scan na publicação aponta CVEs conhecidas. No manifesto, referencie a imagem pelo <strong>digest</strong> (<code>web@sha256:…</code>). Em CI, o próprio pipeline faz o <code>push</code>, com OIDC (veja a nota <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>), sem chave guardada.</>} en={<>Immutable tags stop <code>1.0.0</code> from being overwritten; scan-on-push flags known CVEs. In the manifest, reference the image by <strong>digest</strong> (<code>web@sha256:…</code>). In CI, the pipeline itself does the <code>push</code>, with OIDC (see the <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a> note), with no stored key.</>} /></p>
        <h3><T pt="Passo 3: o app com identidade própria na AWS" en="Step 3: the app with its own AWS identity" /></h3>
        <p><T pt={<>Um Pod que precisa ler um bucket S3 ou um segredo <strong>não</strong> deve usar as credenciais do nó (que serviriam a todos os Pods) nem chaves fixas. Crie uma IAM role só com o que ele precisa e ligue-a à ServiceAccount:</>} en={<>A Pod that must read an S3 bucket or a secret should <strong>not</strong> use the node's credentials (which would serve every Pod) nor static keys. Create an IAM role with only what it needs and tie it to the ServiceAccount:</>} /></p>
        <CodeBlock code={`# IRSA: the ServiceAccount carries the role to assume
apiVersion: v1
kind: ServiceAccount
metadata:
  name: web
  namespace: prod
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/web-s3-read
automountServiceAccountToken: true     # IRSA needs the projected token; set false only for Pods with no AWS access`} />
        <p><T pt={<>A alternativa mais nova, o <strong>EKS Pod Identity</strong>, dispensa a anotação: <code>aws eks create-pod-identity-association --cluster-name demo --namespace prod --service-account web --role-arn …</code>. Nos dois casos a role aceita <em>só</em> aquela ServiceAccount daquele namespace.</>} en={<>The newer alternative, <strong>EKS Pod Identity</strong>, drops the annotation: <code>aws eks create-pod-identity-association --cluster-name demo --namespace prod --service-account web --role-arn …</code>. In both cases the role accepts <em>only</em> that ServiceAccount in that namespace.</>} /></p>
        <h3><T pt="Passo 4: expor com HTTPS" en="Step 4: expose it with HTTPS" /></h3>
        <p><T pt={<>Instale o <strong>AWS Load Balancer Controller</strong> (Helm). Ele transforma um <code>Ingress</code> em um ALB. Certificado no ACM, HTTPS e, se quiser, WAF:</>} en={<>Install the <strong>AWS Load Balancer Controller</strong> (Helm). It turns an <code>Ingress</code> into an ALB. Certificate in ACM, HTTPS and, if you want, WAF:</>} /></p>
        <CodeBlock code={`apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  namespace: prod
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:111122223333:certificate/REPLACE-ME
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
    # alb.ingress.kubernetes.io/wafv2-acl-arn: arn:aws:wafv2:...   # optional WAF
spec:
  ingressClassName: alb
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: web, port: { number: 80 } }`} />
        <p><T pt={<>Mantenha os Services como <code>ClusterIP</code> e as subnets dos nós privadas: só o ALB fica na internet. Aponte seu domínio para o ALB (Route 53 ou <a href="/notas/cloudflare/">Cloudflare</a>).</>} en={<>Keep Services as <code>ClusterIP</code> and the node subnets private: only the ALB faces the internet. Point your domain at the ALB (Route 53 or <a href="/notas/cloudflare/">Cloudflare</a>).</>} /></p>
        <h3><T pt="Passo 5: entregar com pipeline" en="Step 5: deliver through a pipeline" /></h3>
        <Diagram minWidth={620} caption={<T pt="Do commit ao cluster: cada etapa checa algo, e o cluster é o último portão." en="From commit to cluster: every stage checks something, and the cluster is the last gate." />}>
          <svg viewBox="0 0 700 148" role="img" aria-label="Pipeline de entrega / Delivery pipeline">
            <rect x="10" y="30" width="118" height="56" rx="4" className="ln fillsoft" />
            <text x="69.0" y="56.0" textAnchor="middle">git push</text>
            <text x="69.0" y="72.0" className="pt mut" textAnchor="middle">PR revisado</text>
            <text x="69.0" y="72.0" className="en mut" textAnchor="middle">reviewed PR</text>
            <path d="M128 58L150 58" className="ln" />
            <path d="M143.0 61.4L150 58L143.0 54.6" className="ln" />
            <rect x="150" y="30" width="118" height="56" rx="4" className="ln fillsoft" />
            <text x="209.0" y="56.0" textAnchor="middle">CI</text>
            <text x="209.0" y="72.0" className="pt mut" textAnchor="middle">build+teste+scan</text>
            <text x="209.0" y="72.0" className="en mut" textAnchor="middle">build+test+scan</text>
            <path d="M268 58L290 58" className="ln" />
            <path d="M283.0 61.4L290 58L283.0 54.6" className="ln" />
            <rect x="290" y="30" width="118" height="56" rx="4" className="ln fillsoft" />
            <text x="349.0" y="56.0" textAnchor="middle">ECR</text>
            <text x="349.0" y="72.0" className="pt mut" textAnchor="middle">imagem por digest</text>
            <text x="349.0" y="72.0" className="en mut" textAnchor="middle">image by digest</text>
            <path d="M408 58L430 58" className="ln" />
            <path d="M423.0 61.4L430 58L423.0 54.6" className="ln" />
            <rect x="430" y="30" width="118" height="56" rx="4" className="ln fillsoft" />
            <text x="489.0" y="56.0" textAnchor="middle">GitOps / deploy</text>
            <text x="489.0" y="72.0" className="mut" textAnchor="middle">Argo CD · kubectl</text>
            <path d="M548 58L570 58" className="ln" />
            <path d="M563.0 61.4L570 58L563.0 54.6" className="ln" />
            <rect x="570" y="30" width="118" height="56" rx="4" className="brandfill" />
            <text x="629.0" y="56.0" textAnchor="middle">EKS</text>
            <text x="629.0" y="72.0" className="pt mut" textAnchor="middle">admission barra</text>
            <text x="629.0" y="72.0" className="en mut" textAnchor="middle">admission blocks</text>
            <text x="10" y="116" className="pt mut" textAnchor="start">O CI assume um papel da AWS por OIDC (nenhuma chave guardada no GitHub).</text>
            <text x="10" y="116" className="en mut" textAnchor="start">CI assumes an AWS role through OIDC (no key stored in GitHub).</text>
            <text x="10" y="134" className="pt mut" textAnchor="start">O cluster recusa manifestos inseguros (Pod Security, Kyverno ou Gatekeeper).</text>
            <text x="10" y="134" className="en mut" textAnchor="start">The cluster rejects insecure manifests (Pod Security, Kyverno or Gatekeeper).</text>
          </svg>
        </Diagram>
        <p><T pt={<>O ideal é <strong>GitOps</strong>: o Git é a fonte da verdade e uma ferramenta dentro do cluster (Argo CD ou Flux) aplica o que está lá. Ninguém precisa de <code>kubectl</code> com permissão de escrita em produção, e todo deploy vira um commit auditável.</>} en={<>The ideal is <strong>GitOps</strong>: Git is the source of truth and a tool inside the cluster (Argo CD or Flux) applies what is there. Nobody needs write-enabled <code>kubectl</code> in production, and every deploy becomes an auditable commit.</>} /></p>
        <h3><T pt="Lista de verificação de produção" en="Production checklist" /></h3>
        <Table
          head={[<T pt="Área" en="Area" />, <T pt="O que fazer" en="What to do" />]}
          rows={[
            [<T pt="Acesso ao cluster" en="Cluster access" />, <T pt="Endpoint do API server privado ou restrito por IP; access entries do IAM com menor privilégio; SSO; nenhum usuário com chave fixa." en="Private or IP-restricted API server endpoint; least-privilege IAM access entries; SSO; no static-key users." />],
            [<T pt="Rede" en="Network" />, <T pt={<>Nós em subnets privadas, em 2+ zonas; só o ALB público; Security Groups mínimos; NetworkPolicy <em>default deny</em> em cada namespace; VPC endpoints para ECR/S3/STS.</>} en={<>Nodes in private subnets, in 2+ zones; only the ALB public; minimal Security Groups; <em>default deny</em> NetworkPolicy in every namespace; VPC endpoints for ECR/S3/STS.</>} />],
            [<T pt="Nós" en="Nodes" />, <T pt={<>Managed node groups com AMI atualizada; IMDSv2 obrigatório e <code>hop limit = 1</code> (Pod não alcança as credenciais do nó); discos cifrados; sem SSH (use SSM).</>} en={<>Managed node groups with a current AMI; IMDSv2 required and <code>hop limit = 1</code> (Pods cannot reach the node's credentials); encrypted disks; no SSH (use SSM).</>} />],
            [<T pt="Pods" en="Pods" />, <T pt={<>Pod Security <code>restricted</code> como <code>enforce</code> nos namespaces de apps; securityContext, limites e probes em todo Deployment; PodDisruptionBudget e spread entre zonas.</>} en={<>Pod Security <code>restricted</code> as <code>enforce</code> on app namespaces; securityContext, limits and probes on every Deployment; PodDisruptionBudget and zone spread.</>} />],
            [<T pt="Identidade dos Pods" en="Pod identity" />, <T pt="Uma ServiceAccount e uma IAM role por app (Pod Identity/IRSA), com política mínima; nunca chaves de acesso em Secret." en="One ServiceAccount and one IAM role per app (Pod Identity/IRSA), minimal policy; never access keys in a Secret." />],
            [<T pt="Segredos" en="Secrets" />, <T pt={<>Valores no Secrets Manager/Parameter Store, sincronizados por External Secrets ou CSI Driver; envelope encryption do EKS com sua chave KMS; RBAC sem <code>get secrets</code> amplo.</>} en={<>Values in Secrets Manager/Parameter Store, synced by External Secrets or the CSI Driver; EKS envelope encryption with your KMS key; RBAC without broad <code>get secrets</code>.</>} />],
            [<T pt="Imagens" en="Images" />, <T pt="ECR privado, tags imutáveis, scan na publicação (e contínuo com Inspector), digest nos manifestos, imagens mínimas (distroless/alpine), assinatura com cosign + política de admissão." en="Private ECR, immutable tags, scan on push (and continuous with Inspector), digests in manifests, minimal images (distroless/alpine), cosign signing + an admission policy." />],
            [<T pt="Políticas" en="Policies" />, <T pt={<>Kyverno, Gatekeeper ou <code>ValidatingAdmissionPolicy</code> barrando <code>:latest</code>, <code>privileged</code>, <code>hostPath</code> e imagens de fora do seu ECR.</>} en={<>Kyverno, Gatekeeper or <code>ValidatingAdmissionPolicy</code> blocking <code>:latest</code>, <code>privileged</code>, <code>hostPath</code> and images from outside your ECR.</>} />],
            [<T pt="Observabilidade e detecção" en="Observability and detection" />, <T pt={<>Logs do control plane (principalmente <code>audit</code>) no CloudWatch; GuardDuty com proteção para EKS; métricas e alertas (Prometheus/CloudWatch Container Insights).</>} en={<>Control-plane logs (especially <code>audit</code>) in CloudWatch; GuardDuty with EKS protection; metrics and alerts (Prometheus/CloudWatch Container Insights).</>} />],
            [<T pt="Atualizações" en="Upgrades" />, <T pt="Acompanhe o calendário de versões do EKS; atualize o control plane e depois os nós, em dev antes de prod; versões fora de suporte padrão custam mais e deixam de receber correções." en="Follow the EKS version calendar; upgrade the control plane and then the nodes, dev before prod; versions out of standard support cost more and stop getting fixes." />],
            [<T pt="Dados e recuperação" en="Data and recovery" />, <T pt="Manifestos no Git (recria o cluster); Velero ou AWS Backup para volumes; bancos preferencialmente em RDS, fora do cluster; teste a restauração." en="Manifests in Git (recreates the cluster); Velero or AWS Backup for volumes; databases preferably on RDS, outside the cluster; test the restore." />],
            [<T pt="Custo" en="Cost" />, <T pt="Tags de custo, requests/limits realistas, autoscaling (Karpenter ou Cluster Autoscaler + HPA), AWS Budgets." en="Cost tags, realistic requests/limits, autoscaling (Karpenter or Cluster Autoscaler + HPA), AWS Budgets." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>O erro mais comum em produção não é um ataque sofisticado: é um painel, um API server ou um Service <code>LoadBalancer</code> exposto sem querer, e um Pod root com token de ServiceAccount poderoso. As três linhas que mais valem: <strong>NetworkPolicy default deny</strong>, <strong>Pod Security restricted</strong> e <strong>RBAC mínimo</strong>.</>} en={<>The most common production failure is not a sophisticated attack: it is a dashboard, API server or <code>LoadBalancer</code> Service exposed by accident, and a root Pod with a powerful ServiceAccount token. The three lines that pay off most: <strong>default-deny NetworkPolicy</strong>, <strong>restricted Pod Security</strong> and <strong>minimal RBAC</strong>.</>} /></Callout>
        <CodeBlock code={`# When you are done studying: remove everything (control plane, nodes, VPC, NAT) to stop the billing
eksctl delete cluster -f cluster.yaml`} />
      </Section>
      <Section id="cheat-k8s" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Comandos do dia a dia" en="Everyday commands" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="aplicar um arquivo / uma pasta" en="apply a file / a folder" />, <T pt={<><code>kubectl apply -f arquivo.yaml</code> / <code>-f pasta/</code> / <code>-k overlay/</code></>} en={<><code>kubectl apply -f file.yaml</code> / <code>-f folder/</code> / <code>-k overlay/</code></>} />],
            [<T pt="ver recursos" en="see resources" />, <T pt={<><code>kubectl get pods,svc,deploy -n NS</code> (<code>-A</code> = todos os namespaces, <code>-o wide</code>, <code>-o yaml</code>)</>} en={<><code>kubectl get pods,svc,deploy -n NS</code> (<code>-A</code> = all namespaces, <code>-o wide</code>, <code>-o yaml</code>)</>} />],
            [<T pt="entender por que não sobe" en="understand why it does not start" />, <T pt={<><code>kubectl describe pod X</code> · <code>kubectl get events --sort-by=.lastTimestamp</code></>} en={<><code>kubectl describe pod X</code> · <code>kubectl get events --sort-by=.lastTimestamp</code></>} />],
            [<T pt="ver logs" en="see logs" />, <T pt={<><code>kubectl logs X</code> · <code>-f</code> (seguir) · <code>--previous</code> (contêiner que reiniciou)</>} en={<><code>kubectl logs X</code> · <code>-f</code> (follow) · <code>--previous</code> (the container that restarted)</>} />],
            [<T pt="entrar no contêiner" en="get inside the container" />, <T pt={<><code>kubectl exec -it X -- sh</code></>} en={<><code>kubectl exec -it X -- sh</code></>} />],
            [<T pt="testar sem expor" en="test without exposing" />, <T pt={<><code>kubectl port-forward svc/web 8080:80</code></>} en={<><code>kubectl port-forward svc/web 8080:80</code></>} />],
            [<T pt="escalar / atualizar / voltar" en="scale / update / roll back" />, <T pt={<><code>kubectl scale</code> · <code>set image</code> · <code>rollout status|history|undo</code></>} en={<><code>kubectl scale</code> · <code>set image</code> · <code>rollout status|history|undo</code></>} />],
            [<T pt="gerar um YAML-base" en="generate a starter YAML" />, <T pt={<><code>kubectl create deploy web --image=nginx --dry-run=client -o yaml</code></>} en={<><code>kubectl create deploy web --image=nginx --dry-run=client -o yaml</code></>} />],
            [<T pt="ver a diferença antes de aplicar" en="see the diff before applying" />, <T pt={<><code>kubectl diff -f arquivo.yaml</code></>} en={<><code>kubectl diff -f file.yaml</code></>} />],
            [<T pt="consultar a documentação de um campo" en="look up a field's docs" />, <T pt={<><code>kubectl explain pod.spec.containers.securityContext</code></>} en={<><code>kubectl explain pod.spec.containers.securityContext</code></>} />],
            [<T pt="checar permissões" en="check permissions" />, <T pt={<><code>kubectl auth can-i VERBO RECURSO --as=…</code></>} en={<><code>kubectl auth can-i VERB RESOURCE --as=…</code></>} />],
            [<T pt={<>estado de erro comum: <code>CrashLoopBackOff</code></>} en={<>common error: <code>CrashLoopBackOff</code></>} />, <T pt={<>o app morre ao iniciar: <code>logs --previous</code></>} en={<>the app dies on start: <code>logs --previous</code></>} />],
            [<T pt={<><code>ImagePullBackOff</code> / <code>Pending</code> / <code>OOMKilled</code></>} en={<><code>ImagePullBackOff</code> / <code>Pending</code> / <code>OOMKilled</code></>} />, <T pt="imagem/credencial errada · sem recurso ou sem nó que sirva · limite de memória baixo" en="wrong image/credential · no resources or no fitting node · memory limit too low" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt={<>Que problema o Kubernetes resolve que o <code>docker run</code> sozinho não resolve?</>} en={<>What problem does Kubernetes solve that <code>docker run</code> alone does not?</>} /></li>
          <li><T pt="Por que dizemos que ele é declarativo e o que é o laço de reconciliação?" en="Why do we say it is declarative, and what is the reconciliation loop?" /></li>
          <li><T pt="Qual a diferença entre Pod, Deployment e Service? Por que um Pod solto não se cura?" en="What is the difference between a Pod, a Deployment and a Service? Why does a bare Pod not heal?" /></li>
          <li><T pt={<>O que acontece se o <code>selector</code> do Service não casa com os rótulos dos Pods?</>} en={<>What happens if the Service's <code>selector</code> does not match the Pods' labels?</>} /></li>
          <li><T pt="Por que um Secret não é seguro só por ser Secret? O que de fato o protege?" en="Why is a Secret not safe just for being a Secret? What actually protects it?" /></li>
          <li><T pt={<>Cite cinco campos de <code>securityContext</code>/Pod e o ataque que cada um dificulta.</>} en={<>Name five <code>securityContext</code>/Pod fields and the attack each one hinders.</>} /></li>
          <li><T pt="O que o Pod Security Admission faz e quais são seus três perfis?" en="What does Pod Security Admission do and what are its three profiles?" /></li>
          <li><T pt={<>Por que usar NetworkPolicy <em>default deny</em>, e por que ao negar a saída é preciso liberar o DNS?</>} en={<>Why use a <em>default deny</em> NetworkPolicy, and why must DNS be allowed when egress is denied?</>} /></li>
          <li><T pt="No EKS, como um Pod acessa o S3 sem chave de acesso guardada?" en="On EKS, how does a Pod reach S3 without a stored access key?" /></li>
          <li><T pt="Por que os nós ficam em subnets privadas e só o ALB é público?" en="Why do the nodes sit in private subnets while only the ALB is public?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "Kubernetes docs: Overview and concepts", href: "https://kubernetes.io/docs/concepts/overview/" },
          { label: "Kubernetes docs: Cluster architecture", href: "https://kubernetes.io/docs/concepts/architecture/" },
          { label: "Kubernetes docs: Security concepts", href: "https://kubernetes.io/docs/concepts/security/" },
          { label: "Kubernetes docs: Pod Security Standards", href: "https://kubernetes.io/docs/concepts/security/pod-security-standards/" },
          { label: "Kubernetes docs: Configure a Security Context", href: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/" },
          { label: "Kubernetes docs: RBAC", href: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
          { label: "Kubernetes docs: Network Policies", href: "https://kubernetes.io/docs/concepts/services-networking/network-policies/" },
          { label: "Kubernetes docs: Secrets (good practices)", href: "https://kubernetes.io/docs/concepts/configuration/secret/" },
          { label: "kind: Quick start", href: "https://kind.sigs.k8s.io/docs/user/quick-start/" },
          { label: "AWS: Amazon EKS Best Practices Guide", href: "https://docs.aws.amazon.com/eks/latest/best-practices/" },
          { label: "AWS: Amazon EKS User Guide", href: "https://docs.aws.amazon.com/eks/latest/userguide/" },
          { label: "eksctl", href: "https://eksctl.io/" },
          { label: "NSA/CISA: Kubernetes Hardening Guidance", href: "https://media.defense.gov/2022/Aug/29/2003066362/-1/-1/0/CTR_KUBERNETES_HARDENING_GUIDANCE_1.2_20220829.PDF" },
          { label: "CIS Kubernetes Benchmark", href: "https://www.cisecurity.org/benchmark/kubernetes" },
        ]}
      />
    </>
  );
}
