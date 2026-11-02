import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "docker",
  title: { en: "Docker: images, containers, Compose, networks and a smaller attack surface", pt: "Docker: imagens, contêineres, Compose, redes e menos superfície de ataque" },
  seo: {
    title: { en: "Docker: images, containers, Compose, networks and a smaller attack surface", pt: "Docker: imagens, contêineres, Compose, redes e menos superfície de ataque" },
    description: { en: "Docker from zero: images and containers, essential commands, Dockerfile, Ubuntu versus Alpine, multi-stage builds, reducing the attack surface, port mapping, networks, Compose, health checks, logs and a hands-on lab.", pt: "Docker do zero: imagens e contêineres, comandos essenciais, Dockerfile, Ubuntu versus Alpine, multi-stage build, redução da superfície de ataque, mapeamento de portas, redes, Compose, healthchecks, logs e um laboratório prático." },
  },
  summary: "Docker from zero with a runnable lab: image versus container, essential commands, Dockerfile instructions and layer cache, PID 1 and signals, Ubuntu versus Alpine versus distroless (measured sizes), multi-stage builds, reducing the attack surface (no shell, non-root, read-only, cap-drop, secrets, scanning), port mapping and the Docker firewall bypass, bridge networks and DNS by service name, volumes, Docker Compose YAML, HEALTHCHECK and depends_on, logs, docker stats and cAdvisor, troubleshooting and a cheat sheet, with sources from the Docker docs, OWASP and CIS.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Docker: <em>from the first container to a smaller attack surface.</em></>, pt: <>Docker: <em>do primeiro contêiner a uma superfície de ataque menor.</em></> },
  heroLede: { en: "What images and containers are, the commands you use every day, how to write a Dockerfile, choose between Ubuntu and Alpine, shrink the image with multi-stage builds and remove what an attacker would use, plus ports, networks, Compose, health checks and logs, with a lab you can run.", pt: "O que são imagens e contêineres, os comandos do dia a dia, como escrever um Dockerfile, escolher entre Ubuntu e Alpine, encolher a imagem com multi-stage build e tirar o que um atacante usaria, além de portas, redes, Compose, healthchecks e logs, com um laboratório que você pode rodar." },
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é Docker: contêiner, imagem e por que usar" en="What Docker is: container, image and why use it" /> },
        { id: "lifecycle", title: <T pt="Do Dockerfile ao contêiner: o ciclo de vida" en="From Dockerfile to container: the life cycle" /> },
        { id: "commands", title: <T pt="Comandos essenciais" en="Essential commands" /> },
        { id: "dockerfile", title: <T pt="Dockerfile: escrevendo a receita" en="Dockerfile: writing the recipe" /> },
        { id: "base", title: <T pt="Ubuntu ou Alpine? Escolhendo a imagem base" en="Ubuntu or Alpine? Choosing the base image" /> },
        { id: "multistage", title: <T pt="Multi-stage build: levar para produção só o que roda" en="Multi-stage build: ship only what runs" /> },
        { id: "hardening", title: <T pt="Reduzir a superfície de ataque" en="Reducing the attack surface" /> },
        { id: "ports", title: <T pt="Mapeamento de portas" en="Port mapping" /> },
        { id: "networks", title: <T pt="Redes e comunicação entre contêineres" en="Networks and container-to-container communication" /> },
        { id: "volumes", title: <T pt="Volumes: dados que sobrevivem" en="Volumes: data that survives" /> },
        { id: "compose", title: <T pt="Docker Compose: vários contêineres num arquivo YAML" en="Docker Compose: several containers in one YAML file" /> },
        { id: "health", title: <T pt="Saúde do contêiner: HEALTHCHECK" en="Container health: HEALTHCHECK" /> },
        { id: "logs", title: <T pt="Logs e observabilidade" en="Logs and observability" /> },
        { id: "lab", title: <T pt="Praticar na sua máquina" en="Practise on your machine" /> },
        { id: "trouble", title: <T pt="Quando algo dá errado" en="When something goes wrong" /> },
        { id: "cheat-dk", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é Docker: contêiner, imagem e por que usar" en="What Docker is: container, image and why use it" />}>
        <p><T pt={<>Todo mundo já ouviu “na minha máquina funciona”. O <strong>Docker</strong> resolve isso empacotando o app <em>junto com tudo que ele precisa para rodar</em> (runtime, bibliotecas, arquivos de sistema) numa unidade que se comporta igual no seu notebook, no CI e no servidor. Essa unidade em execução é um <strong>contêiner</strong>.</>} en={<>Everyone has heard “it works on my machine”. <strong>Docker</strong> fixes that by packaging the app <em>together with everything it needs to run</em> (runtime, libraries, system files) into a unit that behaves the same on your laptop, in CI and on the server. That unit, running, is a <strong>container</strong>.</>} /></p>
        <p><T pt={<>Um contêiner <strong>não é uma máquina virtual</strong>. A VM simula um computador e roda um sistema operacional inteiro por cima. O contêiner é só um <em>processo comum do Linux</em>, isolado por recursos do próprio kernel (<em>namespaces</em> escondem o resto do sistema; <em>cgroups</em> limitam CPU e memória). Por isso sobe em milissegundos e pesa megabytes em vez de gigabytes.</>} en={<>A container is <strong>not a virtual machine</strong>. A VM simulates a computer and runs a whole operating system on top. A container is just an <em>ordinary Linux process</em>, isolated by features of the kernel itself (<em>namespaces</em> hide the rest of the system; <em>cgroups</em> cap CPU and memory). That is why it starts in milliseconds and weighs megabytes instead of gigabytes.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Cada VM carrega um sistema operacional inteiro; os contêineres dividem o kernel do host e só levam o app e suas bibliotecas." en="Each VM carries a whole operating system; containers share the host kernel and carry only the app and its libraries." />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Máquina virtual versus contêiner / Virtual machine versus container">
            <text x="175" y="22" className="pt mut" textAnchor="middle">Máquina virtual</text>
            <text x="175" y="22" className="en mut" textAnchor="middle">Virtual machine</text>
            <rect x="10" y="32" width="330" height="170" rx="4" className="ln dash" />
            <rect x="20" y="44" width="94" height="92" rx="4" className="ln" />
            <text x="67" y="62" textAnchor="middle">app</text>
            <text x="67" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="26" y="90" width="82" height="38" rx="4" className="ln fillsoft" />
            <text x="67" y="113" className="pt mut" textAnchor="middle">SO inteiro</text>
            <text x="67" y="113" className="en mut" textAnchor="middle">full OS</text>
            <rect x="128" y="44" width="94" height="92" rx="4" className="ln" />
            <text x="175" y="62" textAnchor="middle">app</text>
            <text x="175" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="134" y="90" width="82" height="38" rx="4" className="ln fillsoft" />
            <text x="175" y="113" className="pt mut" textAnchor="middle">SO inteiro</text>
            <text x="175" y="113" className="en mut" textAnchor="middle">full OS</text>
            <rect x="236" y="44" width="94" height="92" rx="4" className="ln" />
            <text x="283" y="62" textAnchor="middle">app</text>
            <text x="283" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="242" y="90" width="82" height="38" rx="4" className="ln fillsoft" />
            <text x="283" y="113" className="pt mut" textAnchor="middle">SO inteiro</text>
            <text x="283" y="113" className="en mut" textAnchor="middle">full OS</text>
            <rect x="20" y="146" width="310" height="24" rx="4" className="ln" />
            <text x="175" y="162" className="mut" textAnchor="middle">hypervisor</text>
            <rect x="20" y="174" width="310" height="20" rx="4" className="brandfill" />
            <text x="175" y="188" className="pt" textAnchor="middle">SO do host + hardware</text>
            <text x="175" y="188" className="en" textAnchor="middle">host OS + hardware</text>
            <text x="525" y="22" className="pt mut" textAnchor="middle">Contêineres</text>
            <text x="525" y="22" className="en mut" textAnchor="middle">Containers</text>
            <rect x="360" y="32" width="330" height="170" rx="4" className="ln dash" />
            <rect x="372" y="44" width="82" height="62" rx="4" className="ln" />
            <text x="413" y="62" textAnchor="middle">app</text>
            <text x="413" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="484" y="44" width="82" height="62" rx="4" className="ln" />
            <text x="525" y="62" textAnchor="middle">app</text>
            <text x="525" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="596" y="44" width="82" height="62" rx="4" className="ln" />
            <text x="637" y="62" textAnchor="middle">app</text>
            <text x="637" y="80" className="mut" textAnchor="middle">libs</text>
            <rect x="372" y="116" width="306" height="24" rx="4" className="ln" />
            <text x="525" y="132" className="mut" textAnchor="middle">Docker Engine (runtime)</text>
            <rect x="372" y="146" width="306" height="48" rx="4" className="brandfill" />
            <text x="525" y="166" className="pt" textAnchor="middle">kernel do host (compartilhado)</text>
            <text x="525" y="166" className="en" textAnchor="middle">host kernel (shared)</text>
            <text x="525" y="184" className="mut" textAnchor="middle">+ hardware</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />, <T pt="Analogia" en="Analogy" />]}
          rows={[
            [<T pt="Imagem" en="Image" />, <T pt={<>Pacote imutável e em camadas com o sistema de arquivos e o comando de partida do app. Tem nome e tag (<code>postgres:17-alpine</code>).</>} en={<>Immutable, layered package with the app's file system and start command. It has a name and a tag (<code>postgres:17-alpine</code>).</>} />, <T pt="A receita pronta e congelada" en="The finished, frozen recipe" />],
            [<T pt="Contêiner" en="Container" />, <T pt="Uma imagem em execução: processo isolado + uma camada gravável por cima." en="An image running: an isolated process + a writable layer on top." />, <T pt="O prato servido" en="The dish served" />],
            ["Dockerfile", <T pt="Texto com os passos para construir uma imagem." en="Text with the steps to build an image." />, <T pt="O caderno de receitas" en="The recipe book" />],
            ["Registry", <T pt="Servidor de imagens: Docker Hub, GitHub Container Registry, AWS ECR." en="Image server: Docker Hub, GitHub Container Registry, AWS ECR." />, <T pt="A estante de onde se pega a receita" en="The shelf the recipe comes from" />],
            [<T pt="Volume" en="Volume" />, <T pt="Pasta gerenciada pelo Docker que sobrevive ao contêiner." en="Docker-managed folder that outlives the container." />, <T pt="O armário externo" en="The storage locker" />],
            [<T pt="Rede" en="Network" />, <T pt="Rede virtual que liga contêineres e dá DNS por nome." en="Virtual network that connects containers and gives DNS by name." />, <T pt="O ramal interno" en="The internal phone line" />],
            ["Compose", <T pt="Um arquivo YAML que descreve vários contêineres, redes e volumes e sobe tudo junto." en="A YAML file describing several containers, networks and volumes, started together." />, <T pt="O cardápio completo" en="The full menu" />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Em Mac e Windows</strong> o Docker Desktop roda uma VM Linux escondida, porque contêineres precisam de um kernel Linux. No Linux ele usa o kernel da própria máquina. Os comandos desta nota são os mesmos nos três.</>} en={<><strong>On Mac and Windows</strong> Docker Desktop runs a hidden Linux VM, because containers need a Linux kernel. On Linux it uses the machine's own kernel. The commands in this note are the same on all three.</>} /></Callout>
        <p><T pt={<>O exemplo que acompanha a nota é um mini serviço em Go (o código completo está na <a href="#lab">atividade 0</a>) com três rotas: <code>/</code> responde com o nome do contêiner, <code>/health</code> diz que está vivo e <code>/db</code> tenta abrir uma conexão com um Postgres vizinho. Go foi escolhido porque gera um binário único, o que deixa o multi-stage build (mais abaixo) bem visível; nada aqui depende de Go.</>} en={<>The example that runs through the note is a tiny Go service (full code in <a href="#lab">activity 0</a>) with three routes: <code>/</code> answers with the container name, <code>/health</code> says it is alive and <code>/db</code> tries to open a connection to a neighbouring Postgres. Go was chosen because it produces a single binary, which makes the multi-stage build (below) very visible; nothing here depends on Go.</>} /></p>
      </Section>
      <Section id="lifecycle" title={<T pt="Do Dockerfile ao contêiner: o ciclo de vida" en="From Dockerfile to container: the life cycle" />}>
        <Diagram minWidth={620} caption={<T pt="O Dockerfile gera uma imagem imutável; a imagem pode ser guardada num registry e iniciada quantas vezes quiser como contêiner." en="The Dockerfile builds an immutable image; the image can be stored in a registry and started as a container as many times as you like." />}>
          <svg viewBox="0 0 700 186" role="img" aria-label="Do Dockerfile ao contêiner / From Dockerfile to container">
            <rect x="10" y="50" width="110" height="56" rx="4" className="ln fillsoft" />
            <text x="65.0" y="75.0" className="mono" textAnchor="middle">Dockerfile</text>
            <text x="65.0" y="91.0" className="pt mut" textAnchor="middle">a receita</text>
            <text x="65.0" y="91.0" className="en mut" textAnchor="middle">the recipe</text>
            <path d="M120 78L190 78" className="ln" />
            <path d="M183.7 81.0L190 78L183.7 75.0" className="ln" />
            <text x="155" y="68" className="mono mut" textAnchor="middle">build</text>
            <rect x="190" y="50" width="110" height="56" rx="4" className="ln fillsoft" />
            <text x="245.0" y="75.0" textAnchor="middle">imagem</text>
            <text x="245.0" y="91.0" className="pt mut" textAnchor="middle">somente leitura</text>
            <text x="245.0" y="91.0" className="en mut" textAnchor="middle">read-only</text>
            <path d="M300 78L370 78" className="ln" />
            <path d="M363.7 81.0L370 78L363.7 75.0" className="ln" />
            <text x="335" y="68" className="mono mut" textAnchor="middle">run</text>
            <rect x="370" y="50" width="110" height="56" rx="4" className="brandfill" />
            <text x="425.0" y="75.0" textAnchor="middle">contêiner</text>
            <text x="425.0" y="91.0" className="pt mut" textAnchor="middle">processo vivo</text>
            <text x="425.0" y="91.0" className="en mut" textAnchor="middle">running process</text>
            <rect x="190" y="130" width="110" height="36" rx="4" className="ln" />
            <text x="245" y="152" className="mono" textAnchor="middle">registry</text>
            <path d="M245 106L245 130" className="ln" />
            <path d="M242.0 123.7L245 130L248.0 123.7" className="ln" />
            <text x="255" y="122" className="mono mut" textAnchor="start">push / pull</text>
            <text x="425" y="128" className="mono mut" textAnchor="middle">stop · rm</text>
            <text x="500" y="62" className="pt mut" textAnchor="start">1 imagem</text>
            <text x="500" y="62" className="en mut" textAnchor="start">1 image</text>
            <text x="500" y="80" className="pt mut" textAnchor="start">→ N contêineres</text>
            <text x="500" y="80" className="en mut" textAnchor="start">→ N containers</text>
            <text x="500" y="98" className="pt mut" textAnchor="start">(cada um com sua</text>
            <text x="500" y="98" className="en mut" textAnchor="start">(each with its own</text>
            <text x="500" y="114" className="pt mut" textAnchor="start">camada gravável)</text>
            <text x="500" y="114" className="en mut" textAnchor="start">writable layer)</text>
          </svg>
        </Diagram>
        <p><T pt={<>O fluxo é sempre o mesmo: <strong>build</strong> (Dockerfile → imagem), <strong>push/pull</strong> (levar a imagem de e para um registry) e <strong>run</strong> (imagem → contêiner). Uma imagem pode virar muitos contêineres, e apagar um contêiner nunca apaga a imagem.</>} en={<>The flow is always the same: <strong>build</strong> (Dockerfile → image), <strong>push/pull</strong> (move the image to and from a registry) and <strong>run</strong> (image → container). One image can become many containers, and deleting a container never deletes the image.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Mudou uma linha, só as camadas dali para baixo são refeitas. O que o contêiner grava vai numa camada temporária; o que precisa sobreviver vai num volume." en="Change one line and only the layers from there down are rebuilt. What the container writes goes into a temporary layer; what must survive goes into a volume." />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Camadas da imagem e do contêiner / Image and container layers">
            <text x="110" y="22" className="pt mut" textAnchor="middle">Imagem (camadas, só leitura)</text>
            <text x="110" y="22" className="en mut" textAnchor="middle">Image (layers, read-only)</text>
            <rect x="20" y="160" width="180" height="24" rx="4" className="ln fillsoft" />
            <text x="110" y="176" className="mono" textAnchor="middle">FROM distroless</text>
            <rect x="20" y="132" width="180" height="24" rx="4" className="ln fillsoft" />
            <text x="110" y="148" className="mono" textAnchor="middle">COPY go.mod</text>
            <rect x="20" y="104" width="180" height="24" rx="4" className="ln fillsoft" />
            <text x="110" y="120" className="mono" textAnchor="middle">RUN go mod download</text>
            <rect x="20" y="76" width="180" height="24" rx="4" className="ln fillsoft" />
            <text x="110" y="92" className="mono" textAnchor="middle">COPY . .</text>
            <rect x="20" y="48" width="180" height="24" rx="4" className="ln" />
            <text x="110" y="64" className="mono" textAnchor="middle">RUN go build</text>
            <text x="20" y="204" className="pt mut" textAnchor="start">cada instrução = uma camada em cache</text>
            <text x="20" y="204" className="en mut" textAnchor="start">each instruction = one cached layer</text>
            <path d="M215 80L290 80" className="ln" />
            <path d="M283.7 83.0L290 80L283.7 77.0" className="ln" />
            <text x="252" y="70" className="mono mut" textAnchor="middle">run</text>
            <text x="430" y="22" className="pt mut" textAnchor="middle">Contêiner</text>
            <text x="430" y="22" className="en mut" textAnchor="middle">Container</text>
            <rect x="300" y="40" width="260" height="36" rx="4" className="brandfill" />
            <text x="430" y="62" className="pt" textAnchor="middle">camada gravável (some no rm)</text>
            <text x="430" y="62" className="en" textAnchor="middle">writable layer (gone on rm)</text>
            <rect x="300" y="80" width="260" height="24" rx="4" className="ln fillsoft" />
            <text x="430" y="96" className="pt mut" textAnchor="middle">camadas da imagem (compartilhadas)</text>
            <text x="430" y="96" className="en mut" textAnchor="middle">image layers (shared)</text>
            <rect x="300" y="124" width="260" height="30" rx="4" className="ln" />
            <text x="430" y="143" className="pt" textAnchor="middle">volume (dados que sobrevivem)</text>
            <text x="430" y="143" className="en" textAnchor="middle">volume (data that survives)</text>
            <path d="M430 124L430 104" className="ln" />
            <path d="M433.0 110.3L430 104L427.0 110.3" className="ln" />
          </svg>
        </Diagram>
        <p><T pt={<>A imagem é feita de <strong>camadas</strong>, uma por instrução do Dockerfile. O Docker guarda cada camada em cache: se a instrução e tudo acima dela não mudaram, ele reaproveita. Por isso a <em>ordem</em> das linhas importa (veja a seção do Dockerfile). Dois contêineres da mesma imagem compartilham as camadas de leitura e só cada um tem a sua camada gravável, que <strong>desaparece junto com o contêiner</strong>.</>} en={<>The image is made of <strong>layers</strong>, one per Dockerfile instruction. Docker caches each layer: if the instruction and everything above it did not change, it reuses it. That is why the <em>order</em> of the lines matters (see the Dockerfile section). Two containers from the same image share the read-only layers and each has its own writable layer, which <strong>vanishes with the container</strong>.</>} /></p>
      </Section>
      <Section id="commands" title={<T pt="Comandos essenciais" en="Essential commands" />}>
        <CodeBlock code={`# --- imagens ---
docker pull alpine:3.22                 # baixa do registry
docker images                           # lista imagens locais
docker build -t meu-app:1.0 .           # constroi a imagem a partir do ./Dockerfile
docker history meu-app:1.0              # camadas e tamanho de cada uma
docker rmi meu-app:1.0                  # apaga a imagem

# --- contêineres ---
docker run -d --name web -p 8080:8080 meu-app:1.0   # cria + inicia em segundo plano
docker run --rm -it alpine:3.22 sh                  # descartavel e interativo
docker ps                               # os que estao rodando (-a: todos)
docker stop web                         # SIGTERM, espera 10 s, depois SIGKILL
docker start web                        # liga de novo o mesmo contêiner
docker rm web                           # apaga o contêiner parado (-f: forca)
docker exec -it web sh                  # abre um shell DENTRO de um contêiner rodando
docker cp web:/app/arquivo.txt .        # copia arquivo para fora

# --- investigar ---
docker logs -f --tail 50 web            # ultimas 50 linhas e segue
docker inspect web                      # JSON com tudo (IP, volumes, saude, usuario)
docker stats                            # CPU e memoria ao vivo
docker top web                          # processos dentro do contêiner

# --- limpeza ---
docker system df                        # quanto espaco o Docker usa
docker system prune                     # apaga parados, redes e imagens sem tag`} />
        <Table
          head={[<T pt={<>Flag do <code>docker run</code></>} en={<><code>docker run</code> flag</>} />, <T pt="Efeito" en="Effect" />]}
          rows={[
            [<code>-d</code>, <T pt={<>Roda em segundo plano (<em>detached</em>); sem ele o terminal fica preso ao contêiner.</>} en={<>Runs in the background (<em>detached</em>); without it the terminal stays attached to the container.</>} />],
            [<code>--name</code>, <T pt={<>Nome fixo. Sem ele o Docker inventa um (<code>vigilant_curie</code>), e o nome também vira o host na rede.</>} en={<>A fixed name. Without it Docker invents one (<code>vigilant_curie</code>), and the name also becomes the host on the network.</>} />],
            [<code>-p H:C</code>, <T pt={<>Publica a porta C do contêiner na porta H do host (veja <a href="#ports">portas</a>).</>} en={<>Publishes container port C on host port H (see <a href="#ports">ports</a>).</>} />],
            [<code>-e CHAVE=valor</code>, <T pt={<>Variável de ambiente. <code>--env-file .env</code> lê de um arquivo.</>} en={<>Environment variable. <code>--env-file .env</code> reads from a file.</>} />],
            [<code>-v nome:/caminho</code>, <T pt={<>Monta um volume (veja <a href="#volumes">volumes</a>).</>} en={<>Mounts a volume (see <a href="#volumes">volumes</a>).</>} />],
            [<code>--rm</code>, <T pt="Apaga o contêiner quando ele termina. Ótimo para testes." en="Deletes the container when it exits. Great for experiments." />],
            [<code>--restart</code>, <T pt={<><code>no</code> (padrão), <code>on-failure</code>, <code>always</code>, <code>unless-stopped</code>: o que fazer quando o processo sai.</>} en={<><code>no</code> (default), <code>on-failure</code>, <code>always</code>, <code>unless-stopped</code>: what to do when the process exits.</>} />],
            [<><code>--memory</code>, <code>--cpus</code></>, <T pt="Limites de recurso. Sem eles um contêiner com bug pode consumir a máquina inteira." en="Resource limits. Without them a buggy container can eat the whole machine." />],
            [<code>--network</code>, <T pt={<>Em qual rede o contêiner entra (veja <a href="#networks">redes</a>).</>} en={<>Which network the container joins (see <a href="#networks">networks</a>).</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Contêiner é descartável.</strong> Tudo o que o app grava dentro do contêiner some no <code>docker rm</code>. Dados que importam vão em volume (ou num banco gerenciado); configuração vai em variável de ambiente; logs vão para a saída padrão. É a base de tudo que vem a seguir.</>} en={<><strong>A container is disposable.</strong> Anything the app writes inside the container disappears on <code>docker rm</code>. Data that matters goes in a volume (or a managed database); configuration goes in environment variables; logs go to standard output. This is the basis of everything that follows.</>} /></Callout>
      </Section>
      <Section id="dockerfile" title={<T pt="Dockerfile: escrevendo a receita" en="Dockerfile: writing the recipe" />}>
        <p><T pt={<>Primeiro uma versão <em>ingênua</em>, de um único estágio, para entender as instruções. Ela funciona, e é exatamente o tipo de imagem que você <strong>não</strong> quer em produção (veja o motivo na seção de multi-stage):</>} en={<>First a <em>naive</em>, single-stage version, to understand the instructions. It works, and it is exactly the kind of image you do <strong>not</strong> want in production (see why in the multi-stage section):</>} /></p>
        <CodeBlock code={`FROM golang:1.25-alpine          # imagem base: ponto de partida
WORKDIR /app                     # pasta de trabalho (criada se nao existir)
COPY go.mod ./                   # 1) so o arquivo de dependencias...
RUN go mod download              #    ...e baixa as dependencias (camada em cache)
COPY . .                         # 2) depois o codigo (muda toda hora)
RUN go build -o /app/server .    # compila
EXPOSE 8080                      # documenta a porta (nao publica nada)
CMD ["/app/server"]              # comando de partida`} />
        <Table
          head={[<T pt="Instrução" en="Instruction" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<code>FROM</code>, <T pt={<>Escolhe a imagem base. Toda imagem começa em outra. Use tag fixa (<code>1.25-alpine</code>), nunca <code>latest</code>.</>} en={<>Picks the base image. Every image starts from another. Use a fixed tag (<code>1.25-alpine</code>), never <code>latest</code>.</>} />],
            [<code>WORKDIR</code>, <T pt="Define a pasta atual para as instruções seguintes." en="Sets the current folder for the following instructions." />],
            [<code>COPY</code>, <T pt={<>Copia arquivos do seu projeto para a imagem. Prefira <code>COPY</code> a <code>ADD</code> (que também baixa URLs e descompacta, comportamento surpreendente).</>} en={<>Copies files from your project into the image. Prefer <code>COPY</code> to <code>ADD</code> (which also fetches URLs and unpacks archives, surprising behaviour).</>} />],
            [<code>RUN</code>, <T pt={<>Executa um comando <strong>durante o build</strong> e grava o resultado numa camada (instalar pacote, compilar).</>} en={<>Runs a command <strong>at build time</strong> and stores the result in a layer (install a package, compile).</>} />],
            [<><code>ENV</code> / <code>ARG</code></>, <T pt={<><code>ENV</code> vale também em execução. <code>ARG</code> só no build. <strong>Nenhum dos dois é lugar de segredo</strong>: ficam visíveis em <code>docker history</code> e <code>docker inspect</code>.</>} en={<><code>ENV</code> also applies at run time. <code>ARG</code> only at build time. <strong>Neither is a place for secrets</strong>: both show up in <code>docker history</code> and <code>docker inspect</code>.</>} />],
            [<code>EXPOSE</code>, <T pt={<>Só <em>documenta</em> a porta em que o app escuta. Não abre nada para fora (isso é o <code>-p</code>).</>} en={<>Only <em>documents</em> the port the app listens on. It opens nothing to the outside (that is <code>-p</code>).</>} />],
            [<code>USER</code>, <T pt="Roda o que vem depois (e o contêiner) como esse usuário, em vez de root." en="Runs what follows (and the container) as that user instead of root." />],
            [<code>HEALTHCHECK</code>, <T pt={<>Ensina o Docker a testar se o app está bem (veja <a href="#health">saúde</a>).</>} en={<>Teaches Docker how to test whether the app is well (see <a href="#health">health</a>).</>} />],
            [<><code>ENTRYPOINT</code> / <code>CMD</code></>, <T pt={<>O que executar quando o contêiner inicia. <code>ENTRYPOINT</code> é o programa; <code>CMD</code> são os argumentos padrão, que o <code>docker run imagem args</code> substitui.</>} en={<>What to run when the container starts. <code>ENTRYPOINT</code> is the program; <code>CMD</code> are the default arguments, which <code>docker run image args</code> replaces.</>} />],
          ]}
        />
        <h3><T pt="Cache: a ordem das linhas importa" en="Cache: line order matters" /></h3>
        <p><T pt={<>Repare que o Dockerfile acima copia o <code>go.mod</code> e baixa as dependências <em>antes</em> de copiar o resto do código. Como o código muda a cada commit e as dependências quase nunca, o Docker reaproveita a camada pesada do <code>go mod download</code> e só refaz o <code>COPY . .</code> e o build. A regra geral: <strong>o que muda menos vem primeiro</strong>. No Node seria <code>COPY package*.json</code> + <code>npm ci</code> antes do <code>COPY . .</code>; no Python, <code>requirements.txt</code> + <code>pip install</code>.</>} en={<>Notice that the Dockerfile above copies <code>go.mod</code> and downloads dependencies <em>before</em> copying the rest of the code. Since code changes on every commit and dependencies almost never do, Docker reuses the heavy <code>go mod download</code> layer and only redoes <code>COPY . .</code> and the build. General rule: <strong>what changes least comes first</strong>. In Node it would be <code>COPY package*.json</code> + <code>npm ci</code> before <code>COPY . .</code>; in Python, <code>requirements.txt</code> + <code>pip install</code>.</>} /></p>
        <h3><T pt=".dockerignore" en=".dockerignore" /></h3>
        <p><T pt={<>O <code>COPY . .</code> leva a pasta inteira. O arquivo <code>.dockerignore</code> (mesma sintaxe do <code>.gitignore</code>) diz o que ficar de fora: acelera o build e, mais importante, <strong>evita que <code>.env</code>, chaves e a pasta <code>.git</code> entrem na imagem</strong>, onde qualquer pessoa com a imagem os encontraria.</>} en={<>The <code>COPY . .</code> takes the whole folder. The <code>.dockerignore</code> file (same syntax as <code>.gitignore</code>) says what to leave out: it speeds up the build and, more importantly, <strong>keeps <code>.env</code>, keys and the <code>.git</code> folder out of the image</strong>, where anyone holding the image would find them.</>} /></p>
        <CodeBlock code={`.git
.env
*.pem
node_modules
*.md
Dockerfile*
compose.yaml`} />
        <h3><T pt="Executar o app: PID 1, sinais e um processo por contêiner" en="Running the app: PID 1, signals and one process per container" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Um processo principal por contêiner.</strong> O contêiner vive enquanto esse processo viver; quando ele sai, o contêiner para. Banco, API e fila ficam em contêineres separados, ligados por rede (veja <a href="#compose">Compose</a>), não todos dentro de um só com systemd ou <code>supervisord</code>.</>} en={<><strong>One main process per container.</strong> The container lives as long as that process lives; when it exits, the container stops. Database, API and queue go in separate containers, joined by a network (see <a href="#compose">Compose</a>), not all inside one with systemd or <code>supervisord</code>.</>} /></li>
          <li><T pt={<><strong>Use a forma <em>exec</em></strong> (<code>CMD ["/server"]</code>, com colchetes), não a forma <em>shell</em> (<code>CMD /server</code>). A forma shell executa <code>sh -c "/server"</code>: o shell vira o PID 1 e <strong>não repassa o SIGTERM</strong> ao app, então o <code>docker stop</code> espera 10 s e acaba matando com SIGKILL, sem desligamento limpo.</>} en={<><strong>Use the <em>exec</em> form</strong> (<code>CMD ["/server"]</code>, with brackets), not the <em>shell</em> form (<code>CMD /server</code>). The shell form runs <code>sh -c "/server"</code>: the shell becomes PID 1 and <strong>does not forward SIGTERM</strong> to the app, so <code>docker stop</code> waits 10 s and ends up killing it with SIGKILL, with no clean shutdown.</>} /></li>
          <li><T pt={<>O app deve tratar o <strong>SIGTERM</strong> (parar de aceitar requisições, terminar as em andamento, fechar conexões). Se ele cria processos filhos, rode com <code>--init</code> (ou <code>init: true</code> no Compose) para um init mínimo recolher os zumbis.</>} en={<>The app should handle <strong>SIGTERM</strong> (stop accepting requests, finish in-flight ones, close connections). If it spawns child processes, run with <code>--init</code> (or <code>init: true</code> in Compose) so a minimal init reaps the zombies.</>} /></li>
          <li><T pt={<>O app deve <strong>escutar em <code>0.0.0.0</code></strong>, não em <code>127.0.0.1</code>: dentro do contêiner, “localhost” é o próprio contêiner, e a porta publicada chega pela interface de rede dele, não pelo loopback.</>} en={<>The app must <strong>listen on <code>0.0.0.0</code></strong>, not <code>127.0.0.1</code>: inside the container “localhost” is the container itself, and the published port arrives through its network interface, not the loopback.</>} /></li>
          <li><T pt={<>Configuração por <strong>variáveis de ambiente</strong> (<code>PORT</code>, <code>DB_ADDR</code>), e logs na <strong>saída padrão</strong>. Assim a mesma imagem serve para dev, teste e produção.</>} en={<>Configuration through <strong>environment variables</strong> (<code>PORT</code>, <code>DB_ADDR</code>) and logs on <strong>standard output</strong>. That way the same image serves dev, test and production.</>} /></li>
        </ul>
      </Section>
      <Section id="base" title={<T pt="Ubuntu ou Alpine? Escolhendo a imagem base" en="Ubuntu or Alpine? Choosing the base image" />}>
        <p><T pt={<>Quando um Dockerfile diz <code>FROM ubuntu:24.04</code>, o contêiner <strong>não roda o Ubuntu</strong> como sistema: ele roda o <em>kernel do host</em> com o sistema de arquivos do Ubuntu por cima (<code>/bin</code>, <code>/etc</code>, o <code>apt</code>, a glibc). Não há boot, systemd nem login. A escolha da base decide <em>quais ferramentas e bibliotecas existem dentro</em>, e portanto o tamanho e a superfície de ataque.</>} en={<>When a Dockerfile says <code>FROM ubuntu:24.04</code>, the container <strong>does not run Ubuntu</strong> as a system: it runs the <em>host kernel</em> with the Ubuntu file system on top (<code>/bin</code>, <code>/etc</code>, <code>apt</code>, glibc). There is no boot, no systemd, no login. The base you pick decides <em>which tools and libraries exist inside</em>, and therefore the size and the attack surface.</>} /></p>
        <Table
          head={[null, "Ubuntu / Debian", "Alpine", "Distroless / scratch"]}
          rows={[
            [<T pt="Tamanho da base" en="Base size" />, <T pt={<>≈ 30 a 80 MB (<code>-slim</code> é menor)</>} en={<>≈ 30 to 80 MB (<code>-slim</code> is smaller)</>} />, "≈ 8 MB", <T pt="≈ 2 MB (static) a 20 MB" en="≈ 2 MB (static) to 20 MB" />],
            [<T pt="Biblioteca C" en="C library" />, "glibc", "musl", <T pt="glibc ou nenhuma" en="glibc or none" />],
            [<T pt="Gerenciador de pacotes" en="Package manager" />, <code>apt</code>, <code>apk</code>, <T pt="nenhum" en="none" />],
            ["Shell", "bash", <T pt="sh (BusyBox)" en="sh (BusyBox)" />, <T pt="nenhum" en="none" />],
            [<T pt="Compatibilidade" en="Compatibility" />, <T pt="A mais ampla; quase todo binário pré-compilado funciona" en="The widest; nearly every prebuilt binary works" />, <T pt="Alguns binários e wheels Python assumem glibc e quebram ou compilam devagar" en="Some binaries and Python wheels assume glibc and break or build slowly" />, <T pt="Só roda o que você já trouxe pronto (binário estático)" en="Only runs what you bring prebuilt (static binary)" />],
            [<T pt="Depuração" en="Debugging" />, <T pt="Fácil (tem tudo)" en="Easy (has everything)" />, <T pt="Boa (BusyBox)" en="Good (BusyBox)" />, <T pt="Difícil de propósito" en="Hard on purpose" />],
            [<T pt="Superfície de ataque" en="Attack surface" />, <T pt="Maior (muitos pacotes, mais CVEs a acompanhar)" en="Larger (many packages, more CVEs to follow)" />, <T pt="Pequena" en="Small" />, <T pt="Mínima" en="Minimal" />],
          ]}
        />
        <p><T pt={<>Medido no exemplo desta nota (o <strong>mesmo binário</strong> copiado para cada base, tamanho descomprimido de <code>docker image inspect</code>; varia com a versão e a arquitetura):</>} en={<>Measured on this note's example (the <strong>same binary</strong> copied onto each base, uncompressed size from <code>docker image inspect</code>; varies with version and architecture):</>} /></p>
        <Table
          head={[<T pt="Imagem final" en="Final image" />, <T pt="Tamanho" en="Size" />]}
          rows={[
            [<T pt={<>Um estágio, sobre <code>golang:1.25-alpine</code> (compilador e fontes inclusos)</>} en={<>Single stage on <code>golang:1.25-alpine</code> (compiler and sources included)</>} />, "452 MB"],
            [<><code>ubuntu:24.04</code> <T pt="+ binário" en="+ binary" /></>, "126 MB"],
            [<><code>alpine:3.22</code> <T pt="+ binário" en="+ binary" /></>, "22 MB"],
            [<><code>distroless/static:nonroot</code> <T pt="+ binário" en="+ binary" /></>, "15 MB"],
          ]}
        />
        <h3><T pt="Como decidir" en="How to decide" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Comece pela variante <code>-slim</code> (Debian) ou <code>-alpine</code></strong> da imagem oficial da sua linguagem (<code>node:22-slim</code>, <code>python:3.13-slim</code>), em vez de partir de <code>ubuntu</code> e instalar o runtime. Já vem configurada, atualizada e menor.</>} en={<><strong>Start from the <code>-slim</code> (Debian) or <code>-alpine</code> variant</strong> of your language's official image (<code>node:22-slim</code>, <code>python:3.13-slim</code>) instead of starting from <code>ubuntu</code> and installing the runtime. It comes configured, maintained and smaller.</>} /></li>
          <li><T pt={<><strong>Alpine</strong> quando o app roda bem em musl (Go, Node, a maioria dos apps Java e Python puros) e você quer uma base pequena. Cuidado com dependências nativas: se algo falhar com erros de biblioteca ou o <code>pip install</code> demorar para compilar, troque para <code>-slim</code>.</>} en={<><strong>Alpine</strong> when the app runs fine on musl (Go, Node, most Java and pure Python apps) and you want a small base. Mind native dependencies: if something fails with library errors or <code>pip install</code> takes forever compiling, switch to <code>-slim</code>.</>} /></li>
          <li><T pt={<><strong>Ubuntu</strong> quando você precisa de pacotes específicos do <code>apt</code>, de compatibilidade máxima ou segue o padrão da empresa. Não é “errado”, só maior; mantenha-o enxuto (exemplo abaixo).</>} en={<><strong>Ubuntu</strong> when you need specific <code>apt</code> packages, maximum compatibility, or your company standard. It is not “wrong”, just larger; keep it lean (example below).</>} /></li>
          <li><T pt={<><strong>Distroless ou <code>scratch</code></strong> para produção de binários estáticos (Go, Rust) ou apps com runtime mínimo, geralmente como estágio final de um multi-stage.</>} en={<><strong>Distroless or <code>scratch</code></strong> for production of static binaries (Go, Rust) or minimal-runtime apps, usually as the final stage of a multi-stage build.</>} /></li>
        </ul>
        <CodeBlock code={`# Ubuntu enxuto: um RUN so, sem recomendados, limpando o cache do apt na mesma camada
FROM ubuntu:24.04
RUN apt-get update \\
 && apt-get install -y --no-install-recommends ca-certificates curl \\
 && rm -rf /var/lib/apt/lists/* \\
 && useradd --system --uid 10001 app
USER app

# Alpine equivalente
FROM alpine:3.22
RUN apk add --no-cache ca-certificates curl \\
 && adduser -S -u 10001 app
USER app`} />
        <Callout icon="check"><T pt={<><strong>Por que “limpar na mesma camada”:</strong> uma camada nunca encolhe. Se você instala no <code>RUN</code> A e apaga no <code>RUN</code> B, os arquivos continuam na camada A e a imagem não diminui. Instalar e limpar precisam estar no <strong>mesmo</strong> <code>RUN</code>.</>} en={<><strong>Why “clean in the same layer”:</strong> a layer never shrinks. If you install in <code>RUN</code> A and delete in <code>RUN</code> B, the files stay in layer A and the image does not get smaller. Installing and cleaning must happen in the <strong>same</strong> <code>RUN</code>.</>} /></Callout>
      </Section>
      <Section id="multistage" title={<T pt="Multi-stage build: levar para produção só o que roda" en="Multi-stage build: ship only what runs" />}>
        <p><T pt={<>Compilar um app exige compilador, cabeçalhos, gerenciador de pacotes, código-fonte e, às vezes, chaves de acesso a repositórios privados. <strong>Nada disso é necessário para executar o resultado</strong>, mas num Dockerfile de um estágio tudo fica na imagem final, pesando e dando ao atacante ferramentas prontas (um compilador, <code>curl</code>, <code>apk</code>). O <em>multi-stage build</em> usa vários <code>FROM</code> no mesmo arquivo: o primeiro estágio constrói, o último recebe só o artefato.</>} en={<>Compiling an app needs a compiler, headers, a package manager, source code and sometimes access keys for private repositories. <strong>None of that is needed to run the result</strong>, but in a single-stage Dockerfile it all stays in the final image, adding weight and handing an attacker ready-made tools (a compiler, <code>curl</code>, <code>apk</code>). A <em>multi-stage build</em> uses several <code>FROM</code> lines in one file: the first stage builds, the last receives only the artifact.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O primeiro estágio tem tudo para compilar; o segundo recebe só o resultado. Só o último estágio vira a imagem publicada." en="The first stage has everything to compile; the second receives only the result. Only the last stage becomes the published image." />}>
          <svg viewBox="0 0 700 190" role="img" aria-label="Multi-stage build / Multi-stage build">
            <rect x="10" y="20" width="290" height="150" rx="4" className="ln dash" />
            <text x="155" y="40" className="pt mut" textAnchor="middle">Estágio 1: build</text>
            <text x="155" y="40" className="en mut" textAnchor="middle">Stage 1: build</text>
            <rect x="20" y="52" width="150" height="40" rx="4" className="ln fillsoft" />
            <text x="95.0" y="76.0" className="mono" textAnchor="middle">golang:1.25-alpine</text>
            <rect x="180" y="52" width="105" height="40" rx="4" className="ln" />
            <text x="232.5" y="76.0" className="mono" textAnchor="middle">go build</text>
            <text x="155" y="118" className="pt mut" textAnchor="middle">compilador · shell · apk · código-fonte</text>
            <text x="155" y="118" className="en mut" textAnchor="middle">compiler · shell · apk · source code</text>
            <text x="155" y="140" className="pt mut" textAnchor="middle">(≈ 450 MB, descartado)</text>
            <text x="155" y="140" className="en mut" textAnchor="middle">(≈ 450 MB, thrown away)</text>
            <path d="M300 80L370 80" className="ln" />
            <path d="M363.7 83.0L370 80L363.7 77.0" className="ln" />
            <text x="335" y="56" className="mono mut" textAnchor="middle">COPY</text>
            <text x="335" y="69" className="mono mut" textAnchor="middle">--from</text>
            <text x="335" y="100" className="pt mut" textAnchor="middle">binário</text>
            <text x="335" y="100" className="en mut" textAnchor="middle">binary</text>
            <rect x="370" y="20" width="320" height="150" rx="4" className="ln dash" />
            <text x="530" y="40" className="pt mut" textAnchor="middle">Estágio 2: imagem final</text>
            <text x="530" y="40" className="en mut" textAnchor="middle">Stage 2: final image</text>
            <rect x="380" y="52" width="160" height="40" rx="4" className="brandfill" />
            <text x="460.0" y="76.0" className="mono" textAnchor="middle">distroless:nonroot</text>
            <rect x="550" y="52" width="130" height="40" rx="4" className="ln fillsoft" />
            <text x="615.0" y="76.0" className="mono" textAnchor="middle">/server</text>
            <text x="530" y="118" className="pt mut" textAnchor="middle">sem shell · sem apt/apk · usuário não-root</text>
            <text x="530" y="118" className="en mut" textAnchor="middle">no shell · no apt/apk · non-root user</text>
            <text x="530" y="140" className="pt mut" textAnchor="middle">(≈ 15 MB, é o que vai para produção)</text>
            <text x="530" y="140" className="en mut" textAnchor="middle">(≈ 15 MB, the one that ships)</text>
          </svg>
        </Diagram>
        <CodeBlock code={`# ---- estagio 1: compila (tem compilador, shell, apk; nada disso vai para o final)
FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/server .

# ---- estagio 2: so o binario, sem shell, sem apt/apk, usuario nao-root
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/server /server
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\
  CMD ["/server", "healthcheck"]
ENTRYPOINT ["/server"]`} />
        <ul className="ds-list">
          <li><T pt={<><code>AS build</code> dá nome ao primeiro estágio; <code>COPY --from=build</code> traz de lá <strong>apenas</strong> o binário. Os outros arquivos do estágio 1 são descartados e não entram na imagem final nem nas suas camadas.</>} en={<><code>AS build</code> names the first stage; <code>COPY --from=build</code> brings over <strong>only</strong> the binary. The other files of stage 1 are discarded and do not enter the final image or its layers.</>} /></li>
          <li><T pt={<><code>CGO_ENABLED=0</code> gera um binário <strong>estático</strong> (não depende de glibc nem musl), o que permite rodar sobre a base mínima <code>distroless/static</code> ou até <code>scratch</code> (imagem vazia). <code>-s -w</code> remove símbolos de depuração e <code>-trimpath</code> tira caminhos da máquina de build.</>} en={<><code>CGO_ENABLED=0</code> produces a <strong>static</strong> binary (depends on neither glibc nor musl), which lets it run on the minimal <code>distroless/static</code> base or even <code>scratch</code> (an empty image). <code>-s -w</code> strips debug symbols and <code>-trimpath</code> removes build-machine paths.</>} /></li>
          <li><T pt={<>A tag <code>:nonroot</code> da distroless já define <code>USER 65532</code>: o app não roda como root.</>} en={<>The distroless <code>:nonroot</code> tag already sets <code>USER 65532</code>: the app does not run as root.</>} /></li>
          <li><T pt={<>Em linguagens interpretadas o desenho é o mesmo: estágio de build instala dependências de desenvolvimento e gera o bundle (<code>npm run build</code>, <code>pip wheel</code>); o final copia só <code>dist/</code> ou o virtualenv para uma imagem <code>-slim</code> ou distroless do runtime (<code>gcr.io/distroless/nodejs22-debian12</code>).</>} en={<>In interpreted languages the design is the same: the build stage installs development dependencies and produces the bundle (<code>npm run build</code>, <code>pip wheel</code>); the final one copies only <code>dist/</code> or the virtualenv onto a <code>-slim</code> or distroless runtime image (<code>gcr.io/distroless/nodejs22-debian12</code>).</>} /></li>
          <li><T pt={<>É possível construir só um estágio com <code>docker build --target build .</code>, útil para rodar testes dentro do estágio de build.</>} en={<>You can build just one stage with <code>docker build --target build .</code>, handy for running tests inside the build stage.</>} /></li>
        </ul>
      </Section>
      <Section id="hardening" title={<T pt="Reduzir a superfície de ataque" en="Reducing the attack surface" />}>
        <p><T pt={<>Se alguém conseguir executar código dentro do seu contêiner (uma falha no app, uma dependência comprometida), o estrago depende do <strong>que existe lá dentro</strong>. Um shell permite navegar e rodar comandos; um <code>curl</code> baixa ferramentas; o root altera o que quiser; capacidades extras permitem mexer na rede. A estratégia é tirar tudo o que o app não usa, em camadas:</>} en={<>If someone manages to execute code inside your container (a flaw in the app, a compromised dependency), the damage depends on <strong>what exists in there</strong>. A shell lets them roam and run commands; <code>curl</code> downloads tools; root can change anything; extra capabilities let them touch the network. The strategy is to remove everything the app does not use, in layers:</>} /></p>
        <Table
          head={[<T pt="Camada" en="Layer" />, <T pt="O que fazer" en="What to do" />, <T pt="O que o atacante perde" en="What the attacker loses" />]}
          rows={[
            [<T pt="Imagem" en="Image" />, <T pt={<>Base mínima (alpine, <code>-slim</code>, distroless) + multi-stage. <strong>Sem shell, sem gerenciador de pacotes, sem curl</strong> na imagem final.</>} en={<>Minimal base (alpine, <code>-slim</code>, distroless) + multi-stage. <strong>No shell, no package manager, no curl</strong> in the final image.</>} />, <T pt={<>Terminal interativo, <code>apt install</code>, download de ferramentas, compilador</>} en={<>Interactive terminal, <code>apt install</code>, tool download, compiler</>} />],
            [<T pt="Usuário" en="User" />, <T pt={<><code>USER</code> não-root (uid fixo, ex.: 10001 ou 65532).</>} en={<>Non-root <code>USER</code> (fixed uid, e.g. 10001 or 65532).</>} />, <T pt="Escrever em áreas do sistema, instalar, abrir portas < 1024" en="Writing to system areas, installing, opening ports < 1024" />],
            [<T pt="Sistema de arquivos" en="File system" />, <T pt={<><code>--read-only</code> (e <code>--tmpfs /tmp</code> se o app precisar de temporários).</>} en={<><code>--read-only</code> (and <code>--tmpfs /tmp</code> if the app needs temp files).</>} />, <T pt="Gravar um binário ou script e executá-lo" en="Writing a binary or script and running it" />],
            [<T pt="Capacidades" en="Capabilities" />, <T pt={<><code>--cap-drop ALL</code> (devolva só as necessárias com <code>--cap-add</code>) e <code>--security-opt no-new-privileges</code>.</>} en={<><code>--cap-drop ALL</code> (add back only what is needed with <code>--cap-add</code>) and <code>--security-opt no-new-privileges</code>.</>} />, <T pt="Operações privilegiadas de rede e de sistema; escalar privilégios via binários setuid" en="Privileged network and system operations; escalating through setuid binaries" />],
            [<T pt="Recursos" en="Resources" />, <T pt={<><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>.</>} en={<><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>.</>} />, <T pt="Derrubar o host por consumo (DoS), fork bomb" en="Taking the host down by consumption (DoS), fork bombs" />],
            [<T pt="Rede" en="Network" />, <T pt={<>Só as portas necessárias, em <code>127.0.0.1</code> quando possível; redes <code>internal</code> para o que não precisa de internet (veja <a href="#networks">redes</a>).</>} en={<>Only the necessary ports, on <code>127.0.0.1</code> when possible; <code>internal</code> networks for what does not need the internet (see <a href="#networks">networks</a>).</>} />, <T pt="Alcançar o banco de fora; exfiltrar dados pela internet" en="Reaching the database from outside; exfiltrating data to the internet" />],
            [<T pt="Segredos" en="Secrets" />, <T pt={<>Nunca em <code>ENV</code>, <code>ARG</code> ou <code>COPY</code>. Em execução, <em>secrets</em> do Compose/orquestrador (arquivo em <code>/run/secrets</code>); no build, <code>RUN --mount=type=secret</code>.</>} en={<>Never in <code>ENV</code>, <code>ARG</code> or <code>COPY</code>. At run time, Compose/orchestrator <em>secrets</em> (a file in <code>/run/secrets</code>); at build time, <code>RUN --mount=type=secret</code>.</>} />, <T pt={<>Ler senhas com <code>docker inspect</code>, <code>docker history</code> ou no <code>env</code> do processo</>} en={<>Reading passwords with <code>docker inspect</code>, <code>docker history</code> or the process <code>env</code></>} />],
            [<T pt="Cadeia de suprimentos" en="Supply chain" />, <T pt={<>Tags fixas ou digest (<code>FROM img@sha256:…</code>), imagens oficiais, escaneamento (Trivy, Docker Scout) no CI, rebuild periódico para pegar correções.</>} en={<>Fixed tags or digest (<code>FROM img@sha256:…</code>), official images, scanning (Trivy, Docker Scout) in CI, periodic rebuilds to pick up fixes.</>} />, <T pt="Explorar CVEs conhecidos de pacotes que você nem usa" en="Exploiting known CVEs in packages you do not even use" />],
          ]}
        />
        <p><T pt="Na prática, as opções de execução ficam assim (e viram campos do Compose, veja adiante):" en="In practice the run options look like this (and become Compose fields, see below):" /></p>
        <CodeBlock code={`docker run -d --name app \\
  --read-only --tmpfs /tmp \\
  --cap-drop ALL --security-opt no-new-privileges:true \\
  --memory 128m --pids-limit 100 \\
  -p 127.0.0.1:8080:8080 \\
  meu-app:1.0`} />
        <h3><T pt="“Mas e se eu precisar de um terminal para depurar?”" en="“But what if I need a terminal to debug?”" /></h3>
        <p><T pt={<>Em uma imagem sem shell, <code>docker exec -it app sh</code> falha de propósito:</>} en={<>On an image with no shell, <code>docker exec -it app sh</code> fails on purpose:</>} /></p>
        <CodeBlock code={`$ docker exec -it app sh
OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH`} />
        <p><T pt={<>Isso é o objetivo, mas você ainda consegue investigar sem pôr ferramentas na imagem de produção: use <code>docker logs</code> e <code>docker inspect</code>; ou suba um <strong>contêiner de depuração descartável</strong> que <em>compartilha a rede e os processos</em> do alvo:</>} en={<>That is the point, but you can still investigate without putting tools in the production image: use <code>docker logs</code> and <code>docker inspect</code>; or start a <strong>throwaway debug container</strong> that <em>shares the network and processes</em> of the target:</>} /></p>
        <CodeBlock code={`docker run --rm -it --network container:app --pid container:app nicolaka/netshoot
# dentro dele: ss -ltn, curl localhost:8080, ps aux (veem o alvo)`} />
        <p><T pt={<>Outra opção é construir uma variante de depuração da mesma imagem (por exemplo, a tag <code>:debug</code> da distroless inclui um BusyBox) e usá-la só em desenvolvimento. O que não se faz é deixar o shell na imagem de produção “para o caso de precisar”.</>} en={<>Another option is to build a debug variant of the same image (for example, the distroless <code>:debug</code> tag includes a BusyBox) and use it in development only. What you do not do is leave the shell in the production image “just in case”.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Três coisas que anulam todo o resto:</strong> <code>--privileged</code> (o contêiner ganha quase os poderes do host), montar <code>/var/run/docker.sock</code> dentro de um contêiner (quem controla o socket controla o Docker e, na prática, o host) e rodar como root com o diretório do host montado. Se uma ferramenta pede isso, procure outra forma. Veja também <a href="/notas/owasp-top-10/">OWASP Top 10</a> (configuração insegura e cadeia de suprimentos).</>} en={<><strong>Three things that undo everything else:</strong> <code>--privileged</code> (the container gets nearly the host's powers), mounting <code>/var/run/docker.sock</code> inside a container (whoever controls the socket controls Docker and, in practice, the host) and running as root with a host directory mounted. If a tool asks for that, look for another way. See also the <a href="/notas/owasp-top-10/">OWASP Top 10</a> (security misconfiguration and supply chain).</>} /></Callout>
      </Section>
      <Section id="ports" title={<T pt="Mapeamento de portas" en="Port mapping" />}>
        <p><T pt={<>Cada contêiner tem sua própria rede, e as portas dele <strong>não são visíveis fora</strong> até você publicá-las. O <code>-p</code> liga uma porta do host a uma porta do contêiner:</>} en={<>Each container has its own network, and its ports are <strong>not visible outside</strong> until you publish them. <code>-p</code> ties a host port to a container port:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="-p HOST:CONTÊINER abre uma porta no host e encaminha para dentro. Prefixar com 127.0.0.1 deixa só a sua máquina acessar." en="-p HOST:CONTAINER opens a port on the host and forwards it inside. Prefixing 127.0.0.1 lets only your own machine reach it." />}>
          <svg viewBox="0 0 700 184" role="img" aria-label="Mapeamento de portas / Port mapping">
            <rect x="10" y="60" width="100" height="48" rx="4" className="ln fillsoft" />
            <text x="60.0" y="81.0" textAnchor="middle">navegador</text>
            <text x="60.0" y="97.0" className="pt mut" textAnchor="middle">ou curl</text>
            <text x="60.0" y="97.0" className="en mut" textAnchor="middle">or curl</text>
            <path d="M110 84L185 84" className="ln" />
            <path d="M178.7 87.0L185 84L178.7 81.0" className="ln" />
            <rect x="185" y="20" width="505" height="150" rx="4" className="ln dash" />
            <text x="200" y="40" className="pt mut" textAnchor="start">host (sua máquina)</text>
            <text x="200" y="40" className="en mut" textAnchor="start">host (your machine)</text>
            <rect x="195" y="62" width="115" height="44" rx="4" className="ln" />
            <text x="252.5" y="81.0" textAnchor="middle">127.0.0.1</text>
            <text x="252.5" y="97.0" className="mut" textAnchor="middle">:8080</text>
            <path d="M310 84L400 84" className="ln" />
            <path d="M393.7 87.0L400 84L393.7 81.0" className="ln" />
            <text x="195" y="124" className="mono mut" textAnchor="start">-p 8080:8080</text>
            <rect x="395" y="50" width="285" height="108" rx="4" className="ln" />
            <text x="540" y="70" className="pt mut" textAnchor="middle">contêiner app</text>
            <text x="540" y="70" className="en mut" textAnchor="middle">app container</text>
            <rect x="405" y="84" width="160" height="44" rx="4" className="brandfill" />
            <text x="485.0" y="103.0" textAnchor="middle">processo Go</text>
            <text x="485.0" y="119.0" className="pt mut" textAnchor="middle">escuta 0.0.0.0:8080</text>
            <text x="485.0" y="119.0" className="en mut" textAnchor="middle">listens 0.0.0.0:8080</text>
            <text x="624" y="100" className="pt mut" textAnchor="middle">porta 8080</text>
            <text x="624" y="100" className="en mut" textAnchor="middle">port 8080</text>
            <text x="624" y="118" className="pt mut" textAnchor="middle">(interna)</text>
            <text x="624" y="118" className="en mut" textAnchor="middle">(inside)</text>
            <text x="195" y="150" className="pt mut" textAnchor="start">host:contêiner</text>
            <text x="195" y="150" className="en mut" textAnchor="start">host:container</text>
          </svg>
        </Diagram>
        <CodeBlock code={`-p 8080:8080                  # host:contêiner  (escuta em TODAS as interfaces do host)
-p 127.0.0.1:8080:8080        # só a sua própria máquina acessa
-p 3000:8080                  # porta 3000 do host -> 8080 do contêiner
-p 8080                       # porta aleatória do host -> 8080 (veja com docker port)
-p 8080:8080/udp              # UDP em vez de TCP (o padrão é TCP)
-P                            # publica todas as portas do EXPOSE em portas aleatórias`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Ordem é <code>HOST:CONTÊINER</code>.</strong> A do contêiner é a que o app escuta (variável <code>PORT</code>); a do host é livre, mas dois contêineres não podem usar a mesma porta do host.</>} en={<><strong>The order is <code>HOST:CONTAINER</code>.</strong> The container side is the one the app listens on (the <code>PORT</code> variable); the host side is your choice, but two containers cannot use the same host port.</>} /></li>
          <li><T pt={<><code>EXPOSE</code> no Dockerfile <strong>não publica nada</strong>: é documentação (e o que o <code>-P</code> usa). Quem abre a porta é o <code>-p</code> ou o campo <code>ports</code> do Compose.</>} en={<><code>EXPOSE</code> in the Dockerfile <strong>publishes nothing</strong>: it is documentation (and what <code>-P</code> uses). What opens the port is <code>-p</code> or the Compose <code>ports</code> field.</>} /></li>
          <li><T pt={<>Para <strong>conversa entre contêineres você não precisa publicar porta nenhuma</strong>: eles se falam pela rede interna, direto na porta do contêiner (veja <a href="#networks">redes</a>). Publique só o que precisa ser acessado de fora, como a API ou um proxy reverso.</>} en={<>For <strong>container-to-container traffic you do not need to publish any port</strong>: they talk over the internal network, straight to the container port (see <a href="#networks">networks</a>). Publish only what must be reached from outside, like the API or a reverse proxy.</>} /></li>
          <li><T pt={<>Pergunte ao Docker o que está publicado: <code>docker port app</code> ou a coluna PORTS do <code>docker ps</code>.</>} en={<>Ask Docker what is published: <code>docker port app</code> or the PORTS column of <code>docker ps</code>.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><strong>O Docker fura o firewall do host.</strong> Ao publicar com <code>-p 5432:5432</code>, ele escreve suas próprias regras de iptables, que valem <em>antes</em> do UFW e do firewalld. Resultado clássico: o banco “protegido” pelo UFW fica aberto para a internet. Para bancos e painéis internos, <strong>não publique</strong> ou publique em <code>127.0.0.1</code> (e acesse por túnel SSH).</>} en={<><strong>Docker bypasses the host firewall.</strong> When you publish with <code>-p 5432:5432</code> it writes its own iptables rules, which apply <em>before</em> UFW and firewalld. The classic result: the database “protected” by UFW is open to the internet. For databases and internal dashboards, <strong>do not publish</strong> or publish on <code>127.0.0.1</code> (and reach it through an SSH tunnel).</>} /></Callout>
      </Section>
      <Section id="networks" title={<T pt="Redes e comunicação entre contêineres" en="Networks and container-to-container communication" />}>
        <p><T pt="O Docker cria redes virtuais e liga cada contêiner a uma ou mais. Os tipos que importam:" en="Docker creates virtual networks and attaches each container to one or more. The types that matter:" /></p>
        <Table
          head={[<T pt="Driver" en="Driver" />, <T pt="Como funciona" en="How it works" />, <T pt="Quando usar" en="When to use" />]}
          rows={[
            [<><code>bridge</code> (<T pt="padrão" en="default" />)</>, <T pt="Rede privada no host; os contêineres ganham IPs internos e saem para a internet por NAT." en="Private network on the host; containers get internal IPs and reach the internet through NAT." />, <T pt={<>Quase sempre. Use uma bridge <strong>criada por você</strong> (ou pelo Compose), não a rede <code>bridge</code> padrão.</>} en={<>Almost always. Use a bridge <strong>you create</strong> (or Compose creates), not the built-in default <code>bridge</code> network.</>} />],
            [<code>host</code>, <T pt={<>O contêiner usa diretamente a rede do host: sem isolamento e sem <code>-p</code>.</>} en={<>The container uses the host network directly: no isolation and no <code>-p</code>.</>} />, <T pt="Raro (desempenho extremo, ferramentas de rede). Perde o isolamento." en="Rare (extreme performance, network tools). Loses isolation." />],
            [<code>none</code>, <T pt="Sem rede além do loopback." en="No network except loopback." />, <T pt="Jobs que processam arquivos e nunca devem falar com a rede." en="Jobs that process files and must never talk to the network." />],
            [<><code>overlay</code>, <code>macvlan</code></>, <T pt="Redes entre vários hosts (Swarm) ou com IP próprio na LAN." en="Networks across several hosts (Swarm) or with their own LAN IP." />, <T pt="Cenários avançados; em vários hosts o normal é Kubernetes/ECS." en="Advanced scenarios; across several hosts the norm is Kubernetes/ECS." />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt="O app participa das duas redes e fala com o banco pelo nome (db). O banco só existe na rede interna: ninguém de fora o alcança." en="The app sits on both networks and reaches the database by name (db). The database only exists on the internal network: nobody outside can reach it." />}>
          <svg viewBox="0 0 700 260" role="img" aria-label="Redes do Compose / Compose networks">
            <rect x="10" y="100" width="100" height="48" rx="4" className="ln fillsoft" />
            <text x="60.0" y="121.0" textAnchor="middle">você</text>
            <text x="60.0" y="137.0" className="mut" textAnchor="middle">127.0.0.1:8080</text>
            <path d="M110 124L195 124" className="ln" />
            <path d="M188.7 127.0L195 124L188.7 121.0" className="ln" />
            <rect x="180" y="12" width="220" height="236" rx="4" className="ln dash" />
            <text x="290" y="30" className="pt mut" textAnchor="middle">rede frontend</text>
            <text x="290" y="30" className="en mut" textAnchor="middle">frontend network</text>
            <rect x="440" y="12" width="250" height="236" rx="4" className="ln dash" />
            <text x="565" y="30" className="pt mut" textAnchor="middle">rede backend (internal)</text>
            <text x="565" y="30" className="en mut" textAnchor="middle">backend network (internal)</text>
            <rect x="205" y="90" width="170" height="70" rx="4" className="brandfill" />
            <text x="290.0" y="122.0" className="mono" textAnchor="middle">app</text>
            <text x="290.0" y="138.0" className="pt mut" textAnchor="middle">chama db:5432</text>
            <text x="290.0" y="138.0" className="en mut" textAnchor="middle">calls db:5432</text>
            <path d="M375 125L465 125" className="ln" />
            <path d="M458.7 128.0L465 125L458.7 122.0" className="ln" />
            <rect x="465" y="90" width="200" height="70" rx="4" className="ln fillsoft" />
            <text x="565.0" y="122.0" className="mono" textAnchor="middle">db</text>
            <text x="565.0" y="138.0" className="pt mut" textAnchor="middle">Postgres, sem porta publicada</text>
            <text x="565.0" y="138.0" className="en mut" textAnchor="middle">Postgres, no published port</text>
            <rect x="205" y="190" width="170" height="44" rx="4" className="ln" />
            <text x="290" y="216" className="pt mut" textAnchor="middle">saída para a internet: sim</text>
            <text x="290" y="216" className="en mut" textAnchor="middle">outbound internet: yes</text>
            <rect x="465" y="190" width="200" height="44" rx="4" className="ln" />
            <text x="565" y="216" className="pt mut" textAnchor="middle">saída para a internet: não</text>
            <text x="565" y="216" className="en mut" textAnchor="middle">outbound internet: no</text>
          </svg>
        </Diagram>
        <h3><T pt="DNS por nome: a regra mais importante" en="DNS by name: the most important rule" /></h3>
        <p><T pt={<>Numa rede criada pelo usuário (e em toda rede do Compose), o Docker roda um DNS interno: <strong>o nome do contêiner (ou do serviço) vira o endereço</strong>. O app não precisa saber o IP do banco, que muda a cada recriação; ele conecta em <code>db:5432</code>. Na rede <code>bridge</code> padrão isso <em>não</em> funciona, e é por isso que ela deve ser evitada.</>} en={<>On a user-created network (and every Compose network), Docker runs an internal DNS: <strong>the container (or service) name becomes the address</strong>. The app does not need to know the database IP, which changes on every recreation; it connects to <code>db:5432</code>. On the default <code>bridge</code> network this does <em>not</em> work, which is why it should be avoided.</>} /></p>
        <CodeBlock code={`docker network create minha-rede
docker run -d --name db  --network minha-rede -e POSTGRES_PASSWORD=dev postgres:17-alpine
docker run --rm --network minha-rede alpine:3.22 nc -zv db 5432    # db (172.x.x.x:5432) open

docker network ls                       # redes existentes
docker network inspect minha-rede       # quem esta nela, sub-rede, IPs
docker network connect minha-rede app   # liga um contêiner existente a outra rede`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Dentro de um contêiner, <code>localhost</code> é ele mesmo.</strong> O erro mais comum é configurar o app com <code>DB_HOST=localhost</code>: ele procura o banco dentro de si. Use o nome do serviço (<code>db</code>).</>} en={<><strong>Inside a container, <code>localhost</code> is itself.</strong> The most common mistake is configuring the app with <code>DB_HOST=localhost</code>: it looks for the database inside itself. Use the service name (<code>db</code>).</>} /></li>
          <li><T pt={<><strong>Entre contêineres vale a porta do contêiner</strong>, não a publicada. Se o Compose diz <code>"5433:5432"</code>, os outros serviços usam <code>db:5432</code>; o 5433 é só para você, no host.</>} en={<><strong>Between containers the container port applies</strong>, not the published one. If Compose says <code>"5433:5432"</code>, other services use <code>db:5432</code>; 5433 is only for you, on the host.</>} /></li>
          <li><T pt={<><strong>Para o contêiner falar com algo no host</strong> (um banco rodando fora do Docker), use <code>host.docker.internal</code> (Docker Desktop; no Linux adicione <code>extra_hosts: ["host.docker.internal:host-gateway"]</code>).</>} en={<><strong>For a container to reach something on the host</strong> (a database running outside Docker), use <code>host.docker.internal</code> (Docker Desktop; on Linux add <code>extra_hosts: ["host.docker.internal:host-gateway"]</code>).</>} /></li>
          <li><T pt={<><strong>Segmentação:</strong> contêineres só se enxergam se estiverem em uma rede em comum. Separe em <code>frontend</code> (proxy e API) e <code>backend</code> (API e banco): o proxy nunca alcança o banco. Marcar a rede como <code>internal: true</code> também corta a saída para a internet, o que impede um banco comprometido de “ligar para casa”.</>} en={<><strong>Segmentation:</strong> containers only see each other if they share a network. Split into <code>frontend</code> (proxy and API) and <code>backend</code> (API and database): the proxy never reaches the database. Marking the network <code>internal: true</code> also cuts outbound internet, which stops a compromised database from “phoning home”.</>} /></li>
        </ul>
      </Section>
      <Section id="volumes" title={<T pt="Volumes: dados que sobrevivem" en="Volumes: data that survives" />}>
        <p><T pt="Como a camada gravável some com o contêiner, o que precisa persistir (arquivos do Postgres, uploads) fica fora dela:" en="Since the writable layer vanishes with the container, whatever must persist (Postgres files, uploads) lives outside it:" /></p>
        <Table
          head={[<T pt="Tipo" en="Type" />, <T pt="Sintaxe" en="Syntax" />, <T pt="Para quê" en="What for" />]}
          rows={[
            [<T pt="Volume nomeado" en="Named volume" />, <code>-v dbdata:/var/lib/postgresql/data</code>, <T pt={<>Dados de produção; o Docker gerencia onde ficam. Sobrevive a <code>docker rm</code>.</>} en={<>Production data; Docker manages where it lives. Survives <code>docker rm</code>.</>} />],
            ["Bind mount", <code>-v ./src:/app/src</code>, <T pt={<>Mapeia uma pasta do host. Bom em desenvolvimento (editar sem rebuild); em produção expõe o host, use com cuidado e <code>:ro</code>.</>} en={<>Maps a host folder. Good in development (edit without rebuilding); in production it exposes the host, use with care and <code>:ro</code>.</>} />],
            ["tmpfs", <code>--tmpfs /tmp</code>, <T pt={<>Memória RAM, some ao parar. Ideal para temporários com <code>--read-only</code>.</>} en={<>RAM, gone on stop. Ideal for temp files with <code>--read-only</code>.</>} />],
          ]}
        />
        <CodeBlock code={`docker volume ls
docker volume inspect dbdata            # onde fica no host
docker volume rm dbdata                 # APAGA os dados`} />
      </Section>
      <Section id="compose" title={<T pt="Docker Compose: vários contêineres num arquivo YAML" en="Docker Compose: several containers in one YAML file" />}>
        <p><T pt={<>Subir app, banco e proxy com três <code>docker run</code> cheios de flags não escala. O <strong>Compose</strong> descreve tudo num <code>compose.yaml</code> (também aceita <code>docker-compose.yml</code>) e sobe com um comando. É <em>declarativo</em>, como o <a href="/notas/kubernetes/">Kubernetes</a> ou o <a href="/notas/terraform/">Terraform</a>, só que para uma máquina só.</>} en={<>Starting app, database and proxy with three flag-heavy <code>docker run</code> commands does not scale. <strong>Compose</strong> describes everything in a <code>compose.yaml</code> (<code>docker-compose.yml</code> is also accepted) and starts it with one command. It is <em>declarative</em>, like <a href="/notas/kubernetes/">Kubernetes</a> or <a href="/notas/terraform/">Terraform</a>, only for a single machine.</>} /></p>
        <Callout icon="check"><T pt={<><strong>YAML em 30 segundos.</strong> A estrutura é dada pela <em>indentação</em> (use espaços, nunca tabs). <code>chave: valor</code> é um mapa; linhas começando com <code>- </code> são uma lista; <code>[a, b]</code> e <code>&#123;x: 1&#125;</code> são as versões numa linha; <code>#</code> comenta. Valores como <code>"8080:8080"</code> ficam entre aspas para o YAML não interpretar <code>:</code> como número. A chave <code>version:</code> do topo é obsoleta e pode ser omitida. O comando <code>docker compose</code> (com espaço) é o atual; <code>docker-compose</code> com hífen é a versão antiga.</>} en={<><strong>YAML in 30 seconds.</strong> Structure comes from <em>indentation</em> (spaces, never tabs). <code>key: value</code> is a map; lines starting with <code>- </code> are a list; <code>[a, b]</code> and <code>&#123;x: 1&#125;</code> are the one-line forms; <code>#</code> comments. Values like <code>"8080:8080"</code> are quoted so YAML does not read <code>:</code> as a number. The top-level <code>version:</code> key is obsolete and can be omitted. The <code>docker compose</code> command (with a space) is the current one; <code>docker-compose</code> with a hyphen is the old version.</>} /></Callout>
        <CodeBlock code={`services:
  app:
    build: .                              # constroi a imagem do ./Dockerfile
    ports:
      - "127.0.0.1:8080:8080"             # so a sua maquina acessa
    environment:
      DB_ADDR: db:5432                    # o NOME do servico e o host
    depends_on:
      db:
        condition: service_healthy        # so inicia quando o db estiver saudavel
    networks: [frontend, backend]
    restart: unless-stopped
    read_only: true
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    mem_limit: 128m
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets: [db_password]
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks: [backend]                   # sem "ports": ninguem de fora chega aqui
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

networks:
  frontend:
  backend:
    internal: true                        # sem saida para a internet

volumes:
  dbdata:

secrets:
  db_password:
    file: ./db_password.txt`} />
        <Table
          head={[<T pt="Campo" en="Field" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<code>services</code>, <T pt={<>Cada entrada é um contêiner (ou vários, com <code>deploy.replicas</code>). O nome da chave (<code>app</code>, <code>db</code>) é o nome DNS na rede.</>} en={<>Each entry is a container (or several, with <code>deploy.replicas</code>). The key name (<code>app</code>, <code>db</code>) is the DNS name on the network.</>} />],
            [<><code>build</code> / <code>image</code></>, <T pt={<><code>build</code> constrói a partir de um Dockerfile; <code>image</code> baixa pronta de um registry. Pode ter os dois (constrói e nomeia).</>} en={<><code>build</code> builds from a Dockerfile; <code>image</code> pulls a ready one from a registry. You can have both (builds and names).</>} />],
            [<code>ports</code>, <T pt={<>Publica portas, igual ao <code>-p</code>. Ausente = só acessível por outros serviços da mesma rede.</>} en={<>Publishes ports, same as <code>-p</code>. Absent = reachable only by other services on the same network.</>} />],
            [<><code>environment</code> / <code>env_file</code></>, <T pt={<>Variáveis de ambiente. <code>$&#123;VAR&#125;</code> é substituída pelo valor do seu shell ou de um arquivo <code>.env</code> ao lado do compose.</>} en={<>Environment variables. <code>$&#123;VAR&#125;</code> is replaced by your shell's value or by a <code>.env</code> file next to the compose file.</>} />],
            [<code>depends_on</code>, <T pt={<>Ordem de partida. Sem <code>condition</code>, espera só o contêiner <em>iniciar</em>, não o app estar pronto; com <code>service_healthy</code>, espera o healthcheck passar.</>} en={<>Start order. Without <code>condition</code> it waits only for the container to <em>start</em>, not for the app to be ready; with <code>service_healthy</code> it waits for the healthcheck to pass.</>} />],
            [<code>networks</code>, <T pt={<>Em quais redes o serviço entra. Sem a chave, o Compose cria uma rede <code>default</code> para o projeto.</>} en={<>Which networks the service joins. Without the key, Compose creates a <code>default</code> network for the project.</>} />],
            [<code>volumes</code>, <T pt={<>Monta volumes nomeados (declarados no bloco <code>volumes:</code> de baixo) ou pastas do host.</>} en={<>Mounts named volumes (declared in the bottom <code>volumes:</code> block) or host folders.</>} />],
            [<code>restart</code>, <T pt={<><code>unless-stopped</code> religa se o processo cair ou o Docker reiniciar, exceto se você parou de propósito.</>} en={<><code>unless-stopped</code> restarts if the process dies or Docker restarts, unless you stopped it on purpose.</>} />],
            [<code>secrets</code>, <T pt={<>Monta o arquivo em <code>/run/secrets/NOME</code> dentro do contêiner. A imagem oficial do Postgres lê a senha de <code>POSTGRES_PASSWORD_FILE</code>.</>} en={<>Mounts the file at <code>/run/secrets/NAME</code> inside the container. The official Postgres image reads the password from <code>POSTGRES_PASSWORD_FILE</code>.</>} />],
          ]}
        />
        <CodeBlock code={`docker compose up -d --build     # constroi (se preciso) e sobe tudo em segundo plano
docker compose ps                # estado e saude de cada servico
docker compose logs -f app       # logs de um servico (sem o nome: de todos)
docker compose exec db psql -U postgres   # comando dentro de um servico rodando
docker compose config            # valida o YAML e mostra o resultado final
docker compose stop              # para sem apagar
docker compose down              # para e APAGA contêineres e redes (volumes ficam)
docker compose down -v           # idem, e apaga os volumes: os dados vao junto`} />
        <Callout tone="warn" icon="alert"><T pt={<><strong>Não versione segredos.</strong> O <code>db_password.txt</code> do exemplo é só para o laboratório: ponha-o no <code>.gitignore</code>, e em produção use o gerenciador de segredos da plataforma (AWS Secrets Manager, Docker Swarm secrets, Kubernetes Secrets). Um <code>.env</code> com senhas também fica fora do Git.</>} en={<><strong>Do not commit secrets.</strong> The example's <code>db_password.txt</code> is for the lab only: put it in <code>.gitignore</code>, and in production use the platform's secret manager (AWS Secrets Manager, Docker Swarm secrets, Kubernetes Secrets). A <code>.env</code> with passwords also stays out of Git.</>} /></Callout>
      </Section>
      <Section id="health" title={<T pt="Saúde do contêiner: HEALTHCHECK" en="Container health: HEALTHCHECK" />}>
        <p><T pt={<>“Contêiner rodando” só diz que o <em>processo</em> existe. Um app pode estar de pé e travado, sem conexão com o banco ou sem memória. O <strong>healthcheck</strong> é um comando que o Docker executa de tempos em tempos <em>dentro</em> do contêiner; o código de saída decide o estado: <code>0</code> saudável, <code>1</code> doente.</>} en={<>“Container running” only says the <em>process</em> exists. An app can be up and stuck, with no database connection or out of memory. The <strong>healthcheck</strong> is a command Docker runs from time to time <em>inside</em> the container; the exit code decides the state: <code>0</code> healthy, <code>1</code> unhealthy.</>} /></p>
        <CodeBlock code={`# no Dockerfile
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\
  CMD ["/server", "healthcheck"]

# ou no Compose (sobrepoe o do Dockerfile)
healthcheck:
  test: ["CMD", "/server", "healthcheck"]
  interval: 10s
  timeout: 3s
  start_period: 5s
  retries: 3`} />
        <Table
          head={[<T pt="Parâmetro" en="Parameter" />, <T pt="Significado" en="Meaning" />]}
          rows={[
            [<code>interval</code>, <T pt="De quanto em quanto tempo testar (padrão 30 s)." en="How often to test (default 30 s)." />],
            [<code>timeout</code>, <T pt="Quanto esperar pelo comando antes de contar como falha (padrão 30 s)." en="How long to wait for the command before counting a failure (default 30 s)." />],
            [<code>retries</code>, <T pt={<>Falhas seguidas até virar <code>unhealthy</code> (padrão 3).</>} en={<>Consecutive failures until it becomes <code>unhealthy</code> (default 3).</>} />],
            [<code>start_period</code>, <T pt="Tempo de graça na partida: falhas aqui não contam. Dê ao app o tempo que ele leva para subir." en="Grace time at start: failures here do not count. Give the app the time it takes to boot." />],
          ]}
        />
        <p><T pt={<>Os estados são <code>starting</code> → <code>healthy</code> ou <code>unhealthy</code>, visíveis em <code>docker ps</code> (coluna STATUS) e em <code>docker inspect</code>:</>} en={<>The states are <code>starting</code> → <code>healthy</code> or <code>unhealthy</code>, visible in <code>docker ps</code> (STATUS column) and in <code>docker inspect</code>:</>} /></p>
        <CodeBlock code={`$ docker compose ps
NAME        SERVICE   STATUS
lab-app-1   app       Up 12 seconds (healthy)
lab-db-1    db        Up 18 seconds (healthy)

$ docker inspect --format '{{.State.Health.Status}}' lab-app-1
healthy
$ docker inspect --format '{{json .State.Health.Log}}' lab-app-1   # ultimas execucoes e saidas`} />
        <ul className="ds-list">
          <li><T pt={<><strong>O que o Docker faz com um contêiner <code>unhealthy</code>?</strong> Sozinho, <em>nada</em>: <code>restart: unless-stopped</code> só reage a um processo que <em>saiu</em>. O estado serve para o <code>depends_on: service_healthy</code>, para balanceadores e para orquestradores (Kubernetes, ECS, Swarm), que trocam a instância doente. Em um host único, alerte sobre ele (veja <a href="#logs">observabilidade</a>) ou use uma ferramenta que reinicie por saúde.</>} en={<><strong>What does Docker do with an <code>unhealthy</code> container?</strong> By itself, <em>nothing</em>: <code>restart: unless-stopped</code> only reacts to a process that <em>exited</em>. The state serves <code>depends_on: service_healthy</code>, load balancers and orchestrators (Kubernetes, ECS, Swarm), which replace the sick instance. On a single host, alert on it (see <a href="#logs">observability</a>) or use a tool that restarts on health.</>} /></li>
          <li><T pt={<><strong>Teste algo que importa, mas barato.</strong> Um <code>/health</code> que só devolve 200 prova que o servidor HTTP responde. Um que também testa uma consulta simples ao banco prova mais, mas se o banco cair <em>todas</em> as instâncias ficam doentes ao mesmo tempo. Separe <em>liveness</em> (“estou vivo?”) de <em>readiness</em> (“posso receber tráfego?”) quando usar orquestrador.</>} en={<><strong>Test something that matters, but cheap.</strong> A <code>/health</code> that only returns 200 proves the HTTP server answers. One that also runs a simple database query proves more, but if the database goes down <em>every</em> instance turns sick at once. Separate <em>liveness</em> (“am I alive?”) from <em>readiness</em> (“can I take traffic?”) when you use an orchestrator.</>} /></li>
          <li><T pt={<><strong>Imagens sem <code>curl</code> e sem shell</strong> (distroless, scratch) não conseguem rodar <code>curl localhost/health</code>. A saída é o próprio binário ter um modo de checagem, como no exemplo (<code>/server healthcheck</code> faz a requisição e sai com 0 ou 1). Em Alpine, <code>wget -qO- http://127.0.0.1:8080/health</code> (BusyBox) dispensa instalar o curl.</>} en={<><strong>Images with no <code>curl</code> and no shell</strong> (distroless, scratch) cannot run <code>curl localhost/health</code>. The way out is for the binary itself to have a check mode, as in the example (<code>/server healthcheck</code> makes the request and exits 0 or 1). On Alpine, <code>wget -qO- http://127.0.0.1:8080/health</code> (BusyBox) saves installing curl.</>} /></li>
        </ul>
      </Section>
      <Section id="logs" title={<T pt="Logs e observabilidade" en="Logs and observability" />}>
        <p><T pt={<>A regra do contêiner é simples: <strong>o app escreve seus logs na saída padrão (stdout) e de erro (stderr)</strong>, não em arquivos dentro dele. O Docker captura esses dois fluxos por um <em>driver de log</em> e deixa você ler com <code>docker logs</code>.</>} en={<>The container rule is simple: <strong>the app writes its logs to standard output (stdout) and standard error (stderr)</strong>, not to files inside it. Docker captures those two streams through a <em>log driver</em> and lets you read them with <code>docker logs</code>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="O app só escreve na saída padrão; o Docker guarda, você lê com docker logs, e um coletor pode levar tudo para um sistema central." en="The app only writes to standard output; Docker stores it, you read it with docker logs, and a collector can ship it all to a central system." />}>
          <svg viewBox="0 0 700 190" role="img" aria-label="Caminho dos logs / Log path">
            <rect x="10" y="50" width="165" height="56" rx="4" className="brandfill" />
            <text x="92.5" y="75.0" className="mono" textAnchor="middle">app</text>
            <text x="92.5" y="91.0" className="pt mut" textAnchor="middle">escreve em stdout/stderr</text>
            <text x="92.5" y="91.0" className="en mut" textAnchor="middle">writes to stdout/stderr</text>
            <path d="M175 78L230 78" className="ln" />
            <path d="M223.7 81.0L230 78L223.7 75.0" className="ln" />
            <rect x="230" y="50" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="295.0" y="75.0" textAnchor="middle">driver de log</text>
            <text x="295.0" y="91.0" className="pt mut" textAnchor="middle">json-file (padrão)</text>
            <text x="295.0" y="91.0" className="en mut" textAnchor="middle">json-file (default)</text>
            <path d="M360 78L420 78" className="ln" />
            <path d="M413.7 81.0L420 78L413.7 75.0" className="ln" />
            <rect x="420" y="50" width="130" height="56" rx="4" className="ln" />
            <text x="485.0" y="75.0" className="mono" textAnchor="middle">docker logs</text>
            <text x="485.0" y="91.0" className="pt mut" textAnchor="middle">você lê aqui</text>
            <text x="485.0" y="91.0" className="en mut" textAnchor="middle">you read here</text>
            <path d="M330 106L420 150" className="ln" />
            <path d="M413.0 150.0L420 150L415.7 144.5" className="ln" />
            <rect x="420" y="130" width="130" height="44" rx="4" className="ln" />
            <text x="485.0" y="149.0" textAnchor="middle">coletor</text>
            <text x="485.0" y="165.0" className="mut" textAnchor="middle">Alloy · Fluent Bit</text>
            <path d="M550 152L595 152" className="ln" />
            <path d="M588.7 155.0L595 152L588.7 149.0" className="ln" />
            <rect x="595" y="130" width="95" height="44" rx="4" className="ln fillsoft" />
            <text x="642.5" y="156.0" textAnchor="middle">Loki · ELK</text>
            <text x="230" y="130" className="pt mut" textAnchor="start">rotação:</text>
            <text x="230" y="130" className="en mut" textAnchor="start">rotation:</text>
            <text x="230" y="146" className="mono mut" textAnchor="start">max-size, max-file</text>
          </svg>
        </Diagram>
        <CodeBlock code={`docker logs web                        # tudo
docker logs -f --tail 100 web          # ultimas 100 linhas e segue (Ctrl+C sai)
docker logs --since 10m -t web         # ultimos 10 min, com data/hora
docker compose logs -f --no-log-prefix app | jq 'select(.path == "/db")'   # filtra JSON`} />
        <ul className="ds-list">
          <li><T pt={<><strong>Logue em JSON</strong> (uma linha por evento, como no exemplo: <code>&#123;"msg":"request","method":"GET","path":"/db"&#125;</code>). Texto livre é difícil de filtrar; JSON entra direto em <code>jq</code>, Loki ou Elasticsearch.</>} en={<><strong>Log in JSON</strong> (one line per event, as in the example: <code>&#123;"msg":"request","method":"GET","path":"/db"&#125;</code>). Free text is hard to filter; JSON feeds straight into <code>jq</code>, Loki or Elasticsearch.</>} /></li>
          <li><T pt={<><strong>Sem rotação, o log enche o disco.</strong> O driver padrão (<code>json-file</code>) guarda tudo sem limite. Configure <code>max-size</code> e <code>max-file</code> (como no Compose acima) ou global em <code>/etc/docker/daemon.json</code>. O driver <code>local</code> já faz rotação por padrão.</>} en={<><strong>Without rotation, logs fill the disk.</strong> The default driver (<code>json-file</code>) keeps everything with no limit. Set <code>max-size</code> and <code>max-file</code> (as in the Compose above) or globally in <code>/etc/docker/daemon.json</code>. The <code>local</code> driver rotates by default.</>} /></li>
          <li><T pt={<><strong>Não registre segredos nem dados pessoais</strong>: o log é copiado, indexado e guardado por meses. Veja <em>Logging and alerting failures</em> no <a href="/notas/owasp-top-10/">OWASP Top 10</a>.</>} en={<><strong>Do not log secrets or personal data</strong>: logs are copied, indexed and kept for months. See <em>Logging and alerting failures</em> in the <a href="/notas/owasp-top-10/">OWASP Top 10</a>.</>} /></li>
          <li><T pt={<>Para centralizar, um coletor (Grafana Alloy, Fluent Bit, Promtail) lê os logs dos contêineres e envia ao Loki/Elasticsearch; alternativamente, um driver como <code>syslog</code>, <code>fluentd</code> ou <code>awslogs</code> envia direto. Isso é montado passo a passo na nota de <a href="/notas/observability/">observabilidade</a>.</>} en={<>To centralise, a collector (Grafana Alloy, Fluent Bit, Promtail) reads the containers' logs and ships them to Loki/Elasticsearch; alternatively a driver such as <code>syslog</code>, <code>fluentd</code> or <code>awslogs</code> ships directly. This is built step by step in the <a href="/notas/observability/">observability</a> note.</>} /></li>
        </ul>
        <h3><T pt="Além dos logs: o que olhar num contêiner" en="Beyond logs: what to look at in a container" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Ferramenta" en="Tool" />]}
          rows={[
            [<T pt="Está de pé e saudável? Quantas vezes reiniciou?" en="Is it up and healthy? How many times has it restarted?" />, <><code>docker ps</code>, <code>docker inspect --format '&#123;&#123;.State.Health.Status&#125;&#125; &#123;&#123;.RestartCount&#125;&#125;' app</code></>],
            [<T pt="Por que parou? Foi falta de memória?" en="Why did it stop? Was it out of memory?" />, <><code>docker inspect --format '&#123;&#123;.State.ExitCode&#125;&#125; &#123;&#123;.State.OOMKilled&#125;&#125;' app</code> (137 = SIGKILL; <code>OOMKilled=true</code> = <T pt="estourou o limite de memória" en="hit the memory limit" />)</>],
            [<T pt="Quanta CPU e memória usa agora?" en="How much CPU and memory does it use now?" />, <code>docker stats --no-stream</code>],
            [<T pt="Que processos rodam lá dentro e com qual usuário?" en="Which processes run in there and as which user?" />, <code>docker top app -o user,pid,comm</code>],
            [<T pt="O que aconteceu no Docker (start, die, oom, health_status)?" en="What happened in Docker (start, die, oom, health_status)?" />, <code>docker events --since 30m</code>],
            [<T pt="Histórico de métricas e alertas?" en="Metrics history and alerts?" />, <T pt={<>cAdvisor expõe CPU, memória, rede e disco por contêiner ao Prometheus; Grafana desenha e alerta (<a href="/notas/observability/">nota de observabilidade</a>)</>} en={<>cAdvisor exposes per-container CPU, memory, network and disk to Prometheus; Grafana draws and alerts (<a href="/notas/observability/">observability note</a>)</>} />],
          ]}
        />
        <p><T pt={<>Resumindo: <code>docker logs</code> e <code>docker stats</code> resolvem o dia a dia numa máquina; assim que você tem vários contêineres ou hosts, precisa de métricas históricas e logs centralizados, senão só descobre o problema depois que o usuário reclama.</>} en={<>In short: <code>docker logs</code> and <code>docker stats</code> cover day-to-day work on one machine; as soon as you have several containers or hosts you need historical metrics and centralised logs, or you only learn about the problem after the user complains.</>} /></p>
      </Section>
      <Section id="lab" title={<T pt="Praticar na sua máquina" en="Practise on your machine" />}>
        <p><T pt={<>Pré-requisito: Docker com Compose v2 (<code>docker version</code> e <code>docker compose version</code> funcionando). Todos os comandos abaixo foram executados nesta ordem para escrever a nota. Cada atividade é pequena e usa a anterior.</>} en={<>Prerequisite: Docker with Compose v2 (<code>docker version</code> and <code>docker compose version</code> working). Every command below was run in this order while writing the note. Each activity is small and builds on the previous one.</>} /></p>
        <Table
          head={["#", <T pt="Atividade" en="Activity" />, <T pt="Você aprende" en="You learn" />]}
          rows={[
            ["0", <T pt="Criar os arquivos" en="Create the files" />, <T pt="Estrutura do projeto" en="Project layout" />],
            ["1", <T pt="Build ingênuo × multi-stage" en="Naive × multi-stage build" />, <T pt={<>Camadas, tamanho, <code>docker images</code></>} en={<>Layers, size, <code>docker images</code></>} />],
            ["2", <T pt="Rodar, mapear porta, ler logs" en="Run, map a port, read logs" />, <><code>run</code>, <code>-p</code>, <code>logs</code>, <code>stats</code></>],
            ["3", <T pt="Tentar abrir um terminal" en="Try to open a terminal" />, <T pt="Superfície de ataque reduzida" en="Reduced attack surface" />],
            ["4", <T pt="Subir app + banco com Compose" en="Start app + database with Compose" />, <T pt="Redes, DNS por nome, healthcheck" en="Networks, DNS by name, healthcheck" />],
            ["5", <T pt="Provar o isolamento da rede" en="Prove the network isolation" />, <><code>internal</code>, <T pt="porta não publicada" en="unpublished port" /></>],
            ["6", <T pt="Derrubar o banco e observar" en="Take the database down and observe" />, <T pt="Logs JSON, falha de dependência" en="JSON logs, dependency failure" />],
            ["7", <T pt="Limpar tudo" en="Clean up" />, <><code>down -v</code>, <code>prune</code></>],
          ]}
        />
        <h3><T pt="Atividade 0: criar os arquivos" en="Activity 0: create the files" /></h3>
        <CodeBlock code={`mkdir lab && cd lab
# arquivos: main.go  go.mod  .dockerignore  Dockerfile  compose.yaml  db_password.txt
echo "troque-esta-senha" > db_password.txt
printf 'db_password.txt\\n' > .gitignore`} />
        <p><T pt={<><code>main.go</code> (o serviço de exemplo; a rota <code>/db</code> só abre uma conexão TCP com <code>db:5432</code> para provar a rede, sem driver de banco):</>} en={<><code>main.go</code> (the example service; the <code>/db</code> route just opens a TCP connection to <code>db:5432</code> to prove the network, no database driver):</>} /></p>
        <CodeBlock code={`package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"
)

func main() {
	port := getenv("PORT", "8080")

	// Modo healthcheck: o proprio binario testa /health e sai com 0 ou 1.
	if len(os.Args) > 1 && os.Args[1] == "healthcheck" {
		c := http.Client{Timeout: 2 * time.Second}
		res, err := c.Get("http://127.0.0.1:" + port + "/health")
		if err != nil || res.StatusCode != 200 {
			os.Exit(1)
		}
		return
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		host, _ := os.Hostname()
		fmt.Fprintf(w, "ola do container %s\\n", host)
	})
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})
	// Prova a comunicacao entre containers: abre TCP para o banco pelo NOME do servico.
	http.HandleFunc("/db", func(w http.ResponseWriter, r *http.Request) {
		addr := getenv("DB_ADDR", "db:5432")
		conn, err := net.DialTimeout("tcp", addr, 2*time.Second)
		if err != nil {
			http.Error(w, "db inacessivel: "+err.Error(), http.StatusBadGateway)
			return
		}
		conn.Close()
		fmt.Fprintf(w, "db alcancavel em %s\\n", addr)
	})

	logJSON("start", map[string]any{"port": port})
	log.Fatal(http.ListenAndServe(":"+port, logged(http.DefaultServeMux)))
}

func logged(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/health" { // o healthcheck roda a cada 10 s; nao polui o log
			logJSON("request", map[string]any{"method": r.Method, "path": r.URL.Path})
		}
		next.ServeHTTP(w, r)
	})
}

func logJSON(msg string, fields map[string]any) {
	fields["msg"], fields["time"] = msg, time.Now().UTC().Format(time.RFC3339)
	b, _ := json.Marshal(fields)
	fmt.Println(string(b))
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}`} />
        <CodeBlock code={`# go.mod
module hello

go 1.25`} />
        <p><T pt={<>O <code>.dockerignore</code> é o da seção do Dockerfile; o <code>Dockerfile</code> é o do multi-stage e o <code>compose.yaml</code> é o da seção do Compose. Para o contraste da próxima atividade, salve também o Dockerfile ingênuo como <code>Dockerfile.naive</code>.</>} en={<>The <code>.dockerignore</code> is the one from the Dockerfile section; the <code>Dockerfile</code> is the multi-stage one and <code>compose.yaml</code> is the one from the Compose section. For the next activity's contrast, also save the naive Dockerfile as <code>Dockerfile.naive</code>.</>} /></p>
        <h3><T pt="Atividade 1: build ingênuo × multi-stage" en="Activity 1: naive × multi-stage build" /></h3>
        <CodeBlock code={`docker build -f Dockerfile.naive -t lab:naive .
docker build -t lab:final .
docker images lab
docker history lab:final            # poucas camadas, nenhuma com compilador`} />
        <p><T pt={<><strong>Resultado esperado:</strong> <code>lab:naive</code> com centenas de megabytes (452 MB nesta máquina) e <code>lab:final</code> com cerca de 15 MB. Rode o build de novo sem mudar nada e veja as linhas <code>CACHED</code>; depois mude uma linha do <code>main.go</code> e note que o <code>go mod download</code> continua em cache.</>} en={<><strong>Expected result:</strong> <code>lab:naive</code> at hundreds of megabytes (452 MB on this machine) and <code>lab:final</code> at about 15 MB. Run the build again without changes and watch the <code>CACHED</code> lines; then change one line of <code>main.go</code> and notice that <code>go mod download</code> stays cached.</>} /></p>
        <h3><T pt="Atividade 2: rodar, mapear porta, ler logs" en="Activity 2: run, map a port, read logs" /></h3>
        <CodeBlock code={`docker run -d --name app -p 127.0.0.1:8080:8080 lab:final
curl localhost:8080/                 # ola do container 3f2a...
curl localhost:8080/db               # 502: nao existe "db" nesta rede (ainda)
docker ps                            # STATUS: Up ... (healthy)
docker logs app                      # linhas JSON: start, request, request
docker stats --no-stream app         # poucos MB de memoria
docker stop app && docker rm app`} />
        <p><T pt={<>Troque o mapeamento para <code>-p 3000:8080</code> e acesse <code>localhost:3000</code>; depois use <code>-e PORT=9090 -p 9090:9090</code> e veja que a porta do contêiner acompanha a variável.</>} en={<>Change the mapping to <code>-p 3000:8080</code> and reach <code>localhost:3000</code>; then use <code>-e PORT=9090 -p 9090:9090</code> and see that the container port follows the variable.</>} /></p>
        <h3><T pt="Atividade 3: tentar abrir um terminal" en="Activity 3: try to open a terminal" /></h3>
        <CodeBlock code={`docker run -d --name app lab:final
docker exec -it app sh               # falha: "sh": executable file not found
docker exec app id                   # falha tambem: nao ha nem o comando id
docker inspect app --format '{{.Config.User}}'    # 65532 (nao e root)
docker top app -o user,pid,comm      # 65532  ...  server
docker rm -f app

# compare com uma base que tem tudo:
docker run --rm -it ubuntu:24.04 bash    # aqui voce teria shell, apt, e seria root
whoami                                   # root`} />
        <p><T pt={<><strong>Resultado esperado:</strong> na imagem final não há shell, gerenciador de pacotes nem root. Quem invadir o app encontra um único binário.</>} en={<><strong>Expected result:</strong> the final image has no shell, no package manager and no root. Whoever breaks into the app finds a single binary.</>} /></p>
        <h3><T pt="Atividade 4: app + banco com Compose" en="Activity 4: app + database with Compose" /></h3>
        <CodeBlock code={`docker compose up -d --build
docker compose ps                    # db healthy primeiro, depois app healthy
curl localhost:8080/db               # db alcancavel em db:5432
docker compose logs app              # o app resolveu "db" pelo DNS do Docker
docker inspect lab-app-1 --format 'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}}'
# user=65532 ro=true caps=[ALL]`} />
        <p><T pt={<>Repare na ordem: o Compose esperou o Postgres ficar <code>healthy</code> antes de iniciar o app (<code>service_healthy</code>). Sem isso, o app subiria antes do banco aceitar conexões.</>} en={<>Notice the order: Compose waited for Postgres to be <code>healthy</code> before starting the app (<code>service_healthy</code>). Without it the app would start before the database accepts connections.</>} /></p>
        <h3><T pt="Atividade 5: provar o isolamento da rede" en="Activity 5: prove the network isolation" /></h3>
        <CodeBlock code={`# 1) o banco NAO tem porta publicada: PORTS mostra so "5432/tcp", sem "0.0.0.0:"
docker compose ps db
ss -ltn | grep 5432                  # nada escutando no host

# 2) a rede backend e interna: quem esta so nela nao sai para a internet
docker run --rm --network lab_backend alpine:3.22 wget -qO- -T2 http://example.com
# wget: bad address 'example.com'

# 3) mas dentro da rede os nomes resolvem
docker run --rm --network lab_backend alpine:3.22 wget -qO- -T2 http://app:8080/db
# db alcancavel em db:5432`} />
        <p><T pt={<>O nome da rede é <code>&lt;pasta&gt;_&lt;rede&gt;</code>: se sua pasta não se chama <code>lab</code>, veja o nome real em <code>docker network ls</code>.</>} en={<>The network name is <code>&lt;folder&gt;_&lt;network&gt;</code>: if your folder is not called <code>lab</code>, see the real name in <code>docker network ls</code>.</>} /></p>
        <h3><T pt="Atividade 6: derrubar o banco e observar" en="Activity 6: take the database down and observe" /></h3>
        <CodeBlock code={`docker compose stop db
curl -i localhost:8080/db            # 502 Bad Gateway: db inacessivel
docker compose logs --no-log-prefix app | jq .     # cada requisicao como JSON
docker compose start db
curl localhost:8080/db               # volta a responder
docker events --since 2m --filter type=container   # start, die, health_status...`} />
        <p><T pt={<>Desafio: coloque <code>healthcheck</code> no app que também chama <code>/db</code> (um modo <code>healthcheck</code> que testa o banco) e veja o estado do app virar <code>unhealthy</code> quando o banco cai. Depois discuta: isso é desejável? (Dica: leia o texto sobre liveness e readiness.)</>} en={<>Challenge: give the app a <code>healthcheck</code> that also calls <code>/db</code> (a <code>healthcheck</code> mode that tests the database) and watch the app turn <code>unhealthy</code> when the database goes down. Then discuss: is that desirable? (Hint: re-read the liveness and readiness text.)</>} /></p>
        <h3><T pt="Atividade 7: limpar tudo" en="Activity 7: clean up" /></h3>
        <CodeBlock code={`docker compose down -v               # contêineres, redes e o volume dbdata
docker rmi lab:naive lab:final
docker system df                     # confira o que sobrou
docker system prune                  # apaga o que esta parado e sem uso`} />
        <h3><T pt="Para ir além" en="Going further" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><strong>Escaneie a imagem:</strong> <code>docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image lab:final</code> (ou <code>docker scout cves lab:final</code>) e compare o número de vulnerabilidades com a variante Ubuntu. Note que aqui você montou o socket <em>de propósito</em>, num contêiner descartável de ferramenta confiável; é o tipo de exceção que deve ser consciente.</>} en={<><strong>Scan the image:</strong> <code>docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image lab:final</code> (or <code>docker scout cves lab:final</code>) and compare the number of vulnerabilities with the Ubuntu variant. Note that you mounted the socket <em>on purpose</em> here, in a throwaway container of a trusted tool; that is the kind of exception that should be a conscious one.</>} /></li>
          <li><T pt={<><strong>Reverse proxy:</strong> adicione um serviço <code>caddy</code> ou <code>nginx</code> na rede <code>frontend</code>, publique só a porta dele e remova o <code>ports</code> do app.</>} en={<><strong>Reverse proxy:</strong> add a <code>caddy</code> or <code>nginx</code> service on the <code>frontend</code> network, publish only its port and remove the app's <code>ports</code>.</>} /></li>
          <li><T pt={<><strong>Tag por digest:</strong> troque o <code>FROM</code> por <code>gcr.io/distroless/static-debian12:nonroot@sha256:…</code> (veja o digest com <code>docker buildx imagetools inspect</code>) e entenda por que isso torna o build reproduzível.</>} en={<><strong>Pin by digest:</strong> change the <code>FROM</code> to <code>gcr.io/distroless/static-debian12:nonroot@sha256:…</code> (see the digest with <code>docker buildx imagetools inspect</code>) and understand why that makes the build reproducible.</>} /></li>
          <li><T pt={<><strong>Observabilidade:</strong> acrescente Prometheus, Grafana e Loki como na nota de <a href="/notas/observability/">observabilidade</a> e leve os logs JSON deste app para o Grafana.</>} en={<><strong>Observability:</strong> add Prometheus, Grafana and Loki as in the <a href="/notas/observability/">observability</a> note and ship this app's JSON logs to Grafana.</>} /></li>
          <li><T pt={<><strong>Para produção em mais de uma máquina:</strong> publique a imagem num registry e rode no <a href="/notas/ecs-todo-app/">ECS</a> ou no <a href="/notas/kubernetes/">Kubernetes</a>; os conceitos de imagem, porta, healthcheck e variáveis são os mesmos.</>} en={<><strong>For production on more than one machine:</strong> push the image to a registry and run it on <a href="/notas/ecs-todo-app/">ECS</a> or <a href="/notas/kubernetes/">Kubernetes</a>; the concepts of image, port, healthcheck and variables are the same.</>} /></li>
        </ol>
      </Section>
      <Section id="trouble" title={<T pt="Quando algo dá errado" en="When something goes wrong" />}>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa comum" en="Common cause" />, <T pt="Como investigar" en="How to investigate" />]}
          rows={[
            [<T pt="Contêiner sai logo ao iniciar" en="Container exits right after start" />, <T pt="O processo principal terminou ou falhou (config faltando, porta ocupada, comando errado)" en="The main process finished or failed (missing config, busy port, wrong command)" />, <><code>docker ps -a</code>, <code>docker logs</code>, <code>docker inspect --format '&#123;&#123;.State.ExitCode&#125;&#125;'</code></>],
            [<T pt="Código de saída 137" en="Exit code 137" />, <T pt={<>Morto por SIGKILL: falta de memória (<code>OOMKilled</code>) ou <code>docker stop</code> que estourou o prazo</>} en={<>Killed by SIGKILL: out of memory (<code>OOMKilled</code>) or a <code>docker stop</code> that hit the timeout</>} />, <><code>docker inspect --format '&#123;&#123;.State.OOMKilled&#125;&#125;'</code>; <T pt={<>aumente <code>--memory</code> ou trate o SIGTERM</>} en={<>raise <code>--memory</code> or handle SIGTERM</>} /></>],
            [<T pt={<>“Connection refused” no <code>localhost:8080</code></>} en={<>“Connection refused” on <code>localhost:8080</code></>} />, <T pt={<>Faltou o <code>-p</code>, ou o app escuta em <code>127.0.0.1</code> dentro do contêiner</>} en={<>Missing <code>-p</code>, or the app listens on <code>127.0.0.1</code> inside the container</>} />, <><code>docker port app</code>; <T pt={<>configure o app para <code>0.0.0.0</code></>} en={<>set the app to <code>0.0.0.0</code></>} /></>],
            [<T pt={<>App não acha o banco (<code>no such host</code>, <code>connection refused</code>)</>} en={<>App cannot find the database (<code>no such host</code>, <code>connection refused</code>)</>} />, <T pt={<>Usou <code>localhost</code>; contêineres em redes diferentes; banco ainda subindo</>} en={<>Used <code>localhost</code>; containers on different networks; database still starting</>} />, <><code>docker network inspect</code>; <T pt={<>use o nome do serviço; adicione <code>depends_on</code> com <code>service_healthy</code></>} en={<>use the service name; add <code>depends_on</code> with <code>service_healthy</code></>} /></>],
            [<T pt={<>Fica <code>starting</code> ou vira <code>unhealthy</code></>} en={<>Stays <code>starting</code> or turns <code>unhealthy</code></>} />, <T pt={<>O comando do healthcheck usa uma ferramenta que não existe na imagem (<code>curl</code>), ou o app demora mais que o <code>start_period</code></>} en={<>The healthcheck command uses a tool missing from the image (<code>curl</code>), or the app takes longer than <code>start_period</code></>} />, <code>docker inspect --format '&#123;&#123;json .State.Health.Log&#125;&#125;'</code>],
            [<T pt="Dados sumiram depois de recriar" en="Data vanished after recreating" />, <T pt={<>Gravava na camada do contêiner, sem volume; ou rodou <code>down -v</code></>} en={<>Was writing to the container layer, with no volume; or ran <code>down -v</code></>} />, <><code>docker volume ls</code>, <code>docker inspect</code> <T pt="(seção Mounts)" en="(Mounts section)" /></>],
            [<T pt="Build lento ou sempre refaz tudo" en="Build slow or always redoes everything" />, <T pt={<><code>COPY . .</code> antes das dependências; falta <code>.dockerignore</code></>} en={<><code>COPY . .</code> before the dependencies; no <code>.dockerignore</code></>} />, <T pt={<>Reordene as linhas; veja o que o <code>docker build</code> marca como <code>CACHED</code></>} en={<>Reorder the lines; see what <code>docker build</code> marks as <code>CACHED</code></>} />],
            [<T pt="Disco cheio" en="Disk full" />, <T pt="Logs sem rotação, imagens e volumes antigos" en="Logs with no rotation, old images and volumes" />, <><code>docker system df</code>, <code>docker system prune</code>; <T pt={<>configure <code>max-size</code></>} en={<>set <code>max-size</code></>} /></>],
          ]}
        />
      </Section>
      <Section id="cheat-dk" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Assunto" en="Topic" />, <T pt="Regra" en="Rule" />]}
          rows={[
            [<T pt="Imagem × contêiner" en="Image × container" />, <T pt="Imagem é imutável; contêiner é descartável. O que importa vai em volume." en="The image is immutable; the container is disposable. What matters goes in a volume." />],
            ["Dockerfile", <T pt={<>O que muda menos vem primeiro; tag fixa; exec form; <code>.dockerignore</code>; sem segredos.</>} en={<>What changes least goes first; fixed tag; exec form; <code>.dockerignore</code>; no secrets.</>} />],
            [<T pt="Base" en="Base" />, <T pt={<>Comece em <code>-slim</code> ou <code>alpine</code>; Ubuntu quando precisar do <code>apt</code>; distroless/scratch no final.</>} en={<>Start from <code>-slim</code> or <code>alpine</code>; Ubuntu when you need <code>apt</code>; distroless/scratch at the end.</>} />],
            ["Multi-stage", <T pt={<>Estágio 1 compila, o último recebe só o artefato com <code>COPY --from</code>.</>} en={<>Stage 1 compiles, the last one receives only the artifact via <code>COPY --from</code>.</>} />],
            [<T pt="Superfície de ataque" en="Attack surface" />, <T pt={<>Sem shell, não-root, <code>--read-only</code>, <code>--cap-drop ALL</code>, limites, escaneamento. Nunca <code>--privileged</code> nem <code>docker.sock</code>.</>} en={<>No shell, non-root, <code>--read-only</code>, <code>--cap-drop ALL</code>, limits, scanning. Never <code>--privileged</code> or <code>docker.sock</code>.</>} />],
            [<T pt="Portas" en="Ports" />, <T pt={<><code>-p HOST:CONTÊINER</code>; <code>EXPOSE</code> só documenta; <code>127.0.0.1:</code> para uso local; o app escuta em <code>0.0.0.0</code>.</>} en={<><code>-p HOST:CONTAINER</code>; <code>EXPOSE</code> only documents; <code>127.0.0.1:</code> for local use; the app listens on <code>0.0.0.0</code>.</>} />],
            [<T pt="Redes" en="Networks" />, <T pt={<>Rede criada por você + DNS por nome; <code>localhost</code> é o próprio contêiner; <code>internal</code> para o que não sai.</>} en={<>A network you create + DNS by name; <code>localhost</code> is the container itself; <code>internal</code> for what must not go out.</>} />],
            ["Compose", <T pt={<><code>up -d --build</code>, <code>ps</code>, <code>logs -f</code>, <code>down</code>; <code>down -v</code> apaga dados.</>} en={<><code>up -d --build</code>, <code>ps</code>, <code>logs -f</code>, <code>down</code>; <code>down -v</code> deletes data.</>} />],
            [<T pt="Saúde" en="Health" />, <T pt={<><code>HEALTHCHECK</code> + <code>start_period</code>; Docker sozinho não reinicia <code>unhealthy</code>; use <code>service_healthy</code>.</>} en={<><code>HEALTHCHECK</code> + <code>start_period</code>; Docker alone does not restart <code>unhealthy</code>; use <code>service_healthy</code>.</>} />],
            ["Logs", <T pt={<>stdout/stderr, em JSON, com <code>max-size</code>; <code>docker logs -f</code>; coletor para centralizar.</>} en={<>stdout/stderr, in JSON, with <code>max-size</code>; <code>docker logs -f</code>; a collector to centralise.</>} />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="Por que um contêiner sobe em milissegundos e uma VM não? O que eles compartilham com o host?" en="Why does a container start in milliseconds and a VM does not? What do they share with the host?" /></li>
          <li><T pt="Apagar o contêiner apaga a imagem? E os dados gravados dentro dele? Onde você os guardaria?" en="Does deleting the container delete the image? And the data written inside it? Where would you keep it?" /></li>
          <li><T pt={<>Por que <code>CMD ["/server"]</code> é melhor que <code>CMD /server</code> para o <code>docker stop</code>?</>} en={<>Why is <code>CMD ["/server"]</code> better than <code>CMD /server</code> for <code>docker stop</code>?</>} /></li>
          <li><T pt={<>Quando você escolheria Alpine, <code>-slim</code>, Ubuntu e distroless? Dê um exemplo de dependência que quebra no Alpine.</>} en={<>When would you choose Alpine, <code>-slim</code>, Ubuntu and distroless? Give an example of a dependency that breaks on Alpine.</>} /></li>
          <li><T pt={<>Por que apagar um arquivo em um <code>RUN</code> posterior não reduz a imagem? Como o multi-stage resolve isso?</>} en={<>Why does deleting a file in a later <code>RUN</code> not shrink the image? How does multi-stage solve it?</>} /></li>
          <li><T pt="Liste cinco medidas que reduzem a superfície de ataque de um contêiner e o que cada uma impede." en="List five measures that reduce a container's attack surface and what each prevents." /></li>
          <li><T pt={<>O que <code>-p 5433:5432</code> faz? Que porta um outro contêiner usa para falar com esse banco? E por que publicar o banco pode abrir a internet mesmo com o UFW ativo?</>} en={<>What does <code>-p 5433:5432</code> do? Which port does another container use to talk to that database? And why can publishing the database open it to the internet even with UFW enabled?</>} /></li>
          <li><T pt={<>Por que <code>DB_HOST=localhost</code> falha dentro de um contêiner? O que usar no lugar?</>} en={<>Why does <code>DB_HOST=localhost</code> fail inside a container? What to use instead?</>} /></li>
          <li><T pt={<>O que o Docker faz quando um contêiner fica <code>unhealthy</code>? E o que muda num orquestrador?</>} en={<>What does Docker do when a container turns <code>unhealthy</code>? And what changes in an orchestrator?</>} /></li>
          <li><T pt="Seu contêiner morreu com código 137. Quais são as duas causas prováveis e como diferenciá-las?" en="Your container died with exit code 137. What are the two likely causes and how do you tell them apart?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://docs.docker.com/get-started/docker-overview/" rel="noopener">Docker docs: What is Docker?</a> · <a href="https://docs.docker.com/reference/dockerfile/" rel="noopener">Dockerfile reference</a> · <a href="https://docs.docker.com/build/building/best-practices/" rel="noopener">Building best practices</a> · <a href="https://docs.docker.com/build/building/multi-stage/" rel="noopener">Multi-stage builds</a></li>
          <li><a href="https://docs.docker.com/engine/containers/run/" rel="noopener">Running containers (docker run)</a> · <a href="https://docs.docker.com/engine/network/" rel="noopener">Networking overview</a> · <a href="https://docs.docker.com/engine/network/port-publishing/" rel="noopener">Port publishing and mapping</a> · <a href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" rel="noopener">Packet filtering and firewalls</a></li>
          <li><a href="https://docs.docker.com/reference/compose-file/" rel="noopener">Compose file reference</a> · <a href="https://docs.docker.com/compose/how-tos/startup-order/" rel="noopener">Control startup order</a> · <a href="https://docs.docker.com/compose/how-tos/use-secrets/" rel="noopener">Secrets in Compose</a></li>
          <li><a href="https://docs.docker.com/engine/logging/configure/" rel="noopener">Configure logging drivers</a> · <a href="https://docs.docker.com/reference/cli/docker/container/stats/" rel="noopener">docker stats</a> · <a href="https://github.com/google/cadvisor" rel="noopener">cAdvisor</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html" rel="noopener">OWASP Docker Security Cheat Sheet</a> · <a href="https://www.cisecurity.org/benchmark/docker" rel="noopener">CIS Docker Benchmark</a> · <a href="https://docs.docker.com/engine/security/" rel="noopener">Docker Engine security</a></li>
          <li><a href="https://github.com/GoogleContainerTools/distroless" rel="noopener">Distroless images</a> · <a href="https://hub.docker.com/_/alpine" rel="noopener">Alpine on Docker Hub</a> · <a href="https://trivy.dev/" rel="noopener">Trivy</a> · <a href="https://docs.docker.com/scout/" rel="noopener">Docker Scout</a> · <a href="https://github.com/hadolint/hadolint" rel="noopener">hadolint</a> · <a href="https://github.com/nicolaka/netshoot" rel="noopener">netshoot</a></li>
        </ul>
      </Sources>
    </>
  );
}
