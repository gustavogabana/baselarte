import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "linux",
  title: { en: "How Linux works", pt: "Como o Linux funciona" },
  seo: {
    title: { en: "How Linux works, visual guide", pt: "Como o Linux funciona, guia visual" },
    description: { en: "A visual, exam-style guide to how Linux works: users and root, files and permissions, the directory tree, commands, processes, networking, SSH, firewalls, terminal tools and clearing history.", pt: "Um guia visual, no estilo de prova, de como o Linux funciona: usuários e root, arquivos e permissões, árvore de diretórios, comandos, processos, redes, SSH, firewall, ferramentas de terminal e limpeza do histórico." },
  },
  summary: "visual, exam-style guide to users and root, permissions, the file tree, commands, processes, networking, SSH, firewalls, terminal and web monitoring tools, and clearing shell history.",
  kicker: { en: "Visual guide", pt: "Guia visual" },
  heroTitle: { en: <>Linux, <em>from user to firewall.</em></>, pt: <>Linux, <em>do usuário ao firewall.</em></> },
  heroLede: { en: "A visual, exam-style guide: users and root, permissions, processes, the file tree, commands, networking, SSH, firewalls, health tools and cleaning your history.", pt: "Um guia visual, no estilo de prova: usuários e root, permissões, processos, a árvore de arquivos, comandos, redes, SSH, firewall, ferramentas de saúde e como limpar o histórico." },
  published: "2026-10-18",
  updated: "2026-10-26",
  toc: [
    {
      items: [
        { id: "intro", title: <T pt="O que é o Linux" en="What Linux is" /> },
        { id: "users", title: <T pt="Usuários, grupos e superusuário" en="Users, groups and the superuser" /> },
        { id: "perms", title: <T pt="Arquivos e permissões" en="Files and permissions" /> },
        { id: "fhs", title: <T pt="Estrutura de arquivos" en="File structure" /> },
        { id: "links", title: <T pt="Links simbólicos (e hard links)" en="Symbolic links (and hard links)" /> },
        { id: "commands", title: <T pt="Comandos do dia a dia" en="Everyday commands" /> },
        { id: "processes", title: <T pt="Processos, pais e filhos" en="Processes, parents and children" /> },
        { id: "network", title: <T pt="Redes: ver, entender e interagir" en="Networking: see, understand and interact" /> },
        { id: "ssh", title: <T pt="SSH: entrar, acompanhar e proteger" en="SSH: log in, watch and protect" /> },
        { id: "firewall", title: <T pt="Firewall: filtrar o que entra" en="Firewall: filtering what comes in" /> },
        { id: "hardening", title: <T pt="Proteger o computador e como saber" en="Protecting the computer and how to know" /> },
        { id: "tools", title: <T pt="Ferramentas visuais: TUI e web" en="Visual tools: TUI and web" /> },
        { id: "history", title: <T pt="Limpar o histórico do terminal" en="Clearing the terminal history" /> },
        { id: "exam", title: <T pt="Questões de prova e revisão" en="Exam questions and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={<T pt="O que é o Linux" en="What Linux is" />}>
        <p><T pt={<>Linux é, em sentido estrito, só o <em>kernel</em> (o núcleo): o programa que fala com o hardware e reparte CPU, memória, disco e rede entre os outros programas. Tudo o que você usa no terminal (shell, <code>ls</code>, <code>grep</code>, <code>ssh</code>) são programas comuns que pedem coisas ao kernel. A combinação kernel + ferramentas + gerenciador de pacotes é uma <em>distribuição</em> (Ubuntu, Debian, Fedora, Arch).</>} en={<>Strictly speaking, Linux is just the <em>kernel</em>: the program that talks to the hardware and shares CPU, memory, disk and network among the other programs. Everything you use in the terminal (shell, <code>ls</code>, <code>grep</code>, <code>ssh</code>) is an ordinary program that asks the kernel for things. Kernel + tools + package manager is a <em>distribution</em> (Ubuntu, Debian, Fedora, Arch).</>} /></p>
        <p><T pt={<>Dois princípios explicam quase tudo nesta nota: <em>“tudo é arquivo”</em> (discos, terminais, processos e até a rede aparecem como arquivos ou descritores de arquivo) e <em>“todo programa roda como algum usuário”</em> (as permissões decidem o que ele pode tocar). Aprenda esses dois e o resto vira consequência.</>} en={<>Two principles explain almost everything in this note: <em>“everything is a file”</em> (disks, terminals, processes and even the network show up as files or file descriptors) and <em>“every program runs as some user”</em> (permissions decide what it may touch). Learn these two and the rest follows.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="As camadas do Linux. Programas nunca tocam o hardware: pedem ao kernel por syscalls, e o kernel decide se permite." en="The Linux layers. Programs never touch the hardware: they ask the kernel through syscalls, and the kernel decides whether to allow it." />}>
          <svg viewBox="0 0 640 336" role="img" aria-label="Camadas do Linux / Linux layers">
            <rect x="150" y="8" width="470" height="44" rx="4" className="ln fillsoft" />
            <text x="166" y="27" className="pt">Aplicações</text>
            <text x="166" y="27" className="en">Applications</text>
            <text x="166" y="43" className="mut mono">firefox · vim · ssh · python · docker</text>
            <rect x="150" y="62" width="470" height="44" rx="4" className="ln fillsoft" />
            <text x="166" y="81" className="pt">Shell e utilitários</text>
            <text x="166" y="81" className="en">Shell and utilities</text>
            <text x="166" y="97" className="mut mono">bash · zsh · ls · cp · grep · systemctl</text>
            <rect x="150" y="116" width="470" height="44" rx="4" className="ln fillsoft" />
            <text x="166" y="135" className="pt">Bibliotecas</text>
            <text x="166" y="135" className="en">Libraries</text>
            <text x="166" y="151" className="pt mut mono">glibc (libc): traduz funções em chamadas ao kernel</text>
            <text x="166" y="151" className="en mut mono">glibc (libc): turns functions into kernel calls</text>
            <text x="20" y="34" className="pt mut">espaço do</text>
            <text x="20" y="34" className="en mut">user</text>
            <text x="20" y="48" className="pt mut">usuário</text>
            <text x="20" y="48" className="en mut">space</text>
            <path d="M138 8V160" className="ln" />
            <path d="M150 172L620 172" className="ln dash" />
            <text x="385" y="188" className="pt mut mono" textAnchor="middle">chamadas de sistema (syscalls): open, read, write, fork, socket…</text>
            <text x="385" y="188" className="en mut mono" textAnchor="middle">system calls (syscalls): open, read, write, fork, socket…</text>
            <rect x="150" y="200" width="470" height="74" rx="4" className="ln" />
            <rect x="160" y="214" width="84" height="46" rx="4" className="ln fillsoft" />
            <text x="202" y="241" className="pt" textAnchor="middle">Processos</text>
            <text x="202" y="241" className="en" textAnchor="middle">Processes</text>
            <rect x="252" y="214" width="84" height="46" rx="4" className="ln fillsoft" />
            <text x="294" y="241" className="pt" textAnchor="middle">Memória</text>
            <text x="294" y="241" className="en" textAnchor="middle">Memory</text>
            <rect x="344" y="214" width="84" height="46" rx="4" className="ln fillsoft" />
            <text x="386" y="241" className="pt" textAnchor="middle">Arquivos</text>
            <text x="386" y="241" className="en" textAnchor="middle">Files</text>
            <rect x="436" y="214" width="84" height="46" rx="4" className="ln fillsoft" />
            <text x="478" y="241" className="pt" textAnchor="middle">Rede</text>
            <text x="478" y="241" className="en" textAnchor="middle">Network</text>
            <rect x="528" y="214" width="84" height="46" rx="4" className="ln fillsoft" />
            <text x="570" y="241" className="" textAnchor="middle">Drivers</text>
            <text x="20" y="232" className="mut">kernel</text>
            <path d="M138 196V280" className="ln" />
            <rect x="150" y="292" width="470" height="34" rx="4" className="ln" />
            <text x="385" y="313" className="pt" textAnchor="middle">Hardware: CPU · RAM · disco · placa de rede</text>
            <text x="385" y="313" className="en" textAnchor="middle">Hardware: CPU · RAM · disk · network card</text>
            <path d="M385 276L385 292" className="ln" />
            <path d="M381.5 284.8L385 292L388.5 284.8" className="ln" />
          </svg>
        </Diagram>
        <h3><T pt="Livros e fontes recomendados" en="Recommended books and sources" /></h3>
        <Table
          head={[<T pt="Fonte" en="Source" />, <T pt="Use para" en="Use it for" />]}
          rows={[
            [<><em>The Linux Programming Interface</em>, Michael Kerrisk (No Starch, 2010)</>, <T pt="A referência definitiva: o que cada syscall faz de verdade. Cap. 8–9 usuários e credenciais, 15 atributos de arquivo, 17 ACLs, 24–27 processos, 56–61 sockets." en="The definitive reference: what each syscall really does. Ch. 8–9 users and credentials, 15 file attributes, 17 ACLs, 24–27 processes, 56–61 sockets." />],
            [<><em>How Linux Works</em>, Brian Ward (No Starch, 3ª ed. 2021)</>, <T pt="A melhor ponte entre “usar” e “entender”: boot, kernel, disco, rede, serviços." en="The best bridge between “using” and “understanding”: boot, kernel, disk, network, services." />],
            [<><em>UNIX and Linux System Administration Handbook</em>, Nemeth et al. (5ª ed.)</>, <T pt="Administração do dia a dia: contas, armazenamento, rede, segurança, monitoramento." en="Day-to-day administration: accounts, storage, networking, security, monitoring." />],
            [<><em>Operating Systems: Three Easy Pieces</em> (OSTEP), Arpaci-Dusseau</>, <T pt="Teoria gratuita e muito clara: processos, escalonamento, memória virtual, arquivos." en="Free and very clear theory: processes, scheduling, virtual memory, files." />],
            [<T pt={<>Páginas <code>man</code> (<code>man7.org</code>) e Filesystem Hierarchy Standard</>} en={<>The <code>man</code> pages (<code>man7.org</code>) and the Filesystem Hierarchy Standard</>} />, <T pt={<>Texto oficial: <code>man 7 hier</code>, <code>man 5 passwd</code>, <code>man 7 signal</code>, <code>man 7 capabilities</code>.</>} en={<>The official text: <code>man 7 hier</code>, <code>man 5 passwd</code>, <code>man 7 signal</code>, <code>man 7 capabilities</code>.</>} />],
            [<T pt="Guias de certificação: Linux Essentials e LPIC-1 (LPI), RHCSA (Red Hat)" en="Certification guides: Linux Essentials and LPIC-1 (LPI), RHCSA (Red Hat)" />, <T pt="Listas de tópicos de prova; esta nota cobre o núcleo de todos eles." en="Exam topic lists; this note covers the core of all of them." />],
          ]}
        />
        <Callout icon="check"><T pt="Estratégia de estudo: leia a seção, rode os comandos numa máquina virtual ou num contêiner descartável e só então faça as questões de prova no fim. Em Linux, ler sem digitar não fixa nada." en="Study strategy: read the section, run the commands in a throwaway virtual machine or container, and only then do the exam questions at the end. In Linux, reading without typing does not stick." /></Callout>
      </Section>
      <Section id="users" title={<T pt="Usuários, grupos e superusuário" en="Users, groups and the superuser" />}>
        <p><T pt={<>Para o kernel, um usuário é só um número: o <em>UID</em>. Nomes como “ana” existem para humanos; o kernel compara números. Cada usuário tem também um <em>GID</em> principal e pode pertencer a outros grupos. Os dados ficam em arquivos de texto em <code>/etc</code>.</>} en={<>To the kernel a user is just a number: the <em>UID</em>. Names like “ana” exist for humans; the kernel compares numbers. Each user also has a primary <em>GID</em> and may belong to other groups. The data lives in plain text files in <code>/etc</code>.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Uma linha de /etc/passwd tem sete campos. É o “cadastro” de cada usuário." en="One line of /etc/passwd has seven fields. It is each user’s “registration”." />}>
          <svg viewBox="0 0 640 176" role="img" aria-label="Anatomia de uma linha do passwd / Anatomy of a passwd line">
            <text x="20" y="20" className="mut mono">/etc/passwd</text>
            <rect x="20" y="32" width="60" height="38" rx="4" className="ln fillsoft" />
            <text x="50.0" y="56" className="mono" textAnchor="middle">ana</text>
            <text x="50.0" y="94" className="pt mut" textAnchor="middle">nome</text>
            <text x="50.0" y="94" className="en mut" textAnchor="middle">login</text>
            <rect x="80" y="32" width="50" height="38" rx="4" className="ln fillsoft" />
            <text x="105.0" y="56" className="mono" textAnchor="middle">x</text>
            <text x="105.0" y="94" className="pt mut" textAnchor="middle">senha</text>
            <text x="105.0" y="94" className="en mut" textAnchor="middle">password</text>
            <rect x="130" y="32" width="60" height="38" rx="4" className="ln fillsoft" />
            <text x="160.0" y="56" className="mono" textAnchor="middle">1000</text>
            <text x="160.0" y="94" className="mut" textAnchor="middle">UID</text>
            <rect x="190" y="32" width="60" height="38" rx="4" className="ln fillsoft" />
            <text x="220.0" y="56" className="mono" textAnchor="middle">1000</text>
            <text x="220.0" y="94" className="mut" textAnchor="middle">GID</text>
            <rect x="250" y="32" width="110" height="38" rx="4" className="ln fillsoft" />
            <text x="305.0" y="56" className="mono" textAnchor="middle">Ana Silva</text>
            <text x="305.0" y="94" className="pt mut" textAnchor="middle">comentário</text>
            <text x="305.0" y="94" className="en mut" textAnchor="middle">comment</text>
            <rect x="360" y="32" width="110" height="38" rx="4" className="ln fillsoft" />
            <text x="415.0" y="56" className="mono" textAnchor="middle">/home/ana</text>
            <text x="415.0" y="94" className="pt mut" textAnchor="middle">diretório</text>
            <text x="415.0" y="94" className="en mut" textAnchor="middle">home</text>
            <rect x="470" y="32" width="110" height="38" rx="4" className="ln fillsoft" />
            <text x="525.0" y="56" className="mono" textAnchor="middle">/bin/bash</text>
            <text x="525.0" y="94" className="mut" textAnchor="middle">shell</text>
            <text x="20" y="140" className="pt mut">O “x” diz: o hash da senha está em /etc/shadow, legível só pelo root.</text>
            <text x="20" y="140" className="en mut">The “x” means: the password hash is in /etc/shadow, readable only by root.</text>
            <text x="20" y="162" className="pt mut">Campos separados por “:”. UID 0 = superusuário; 1–999 = contas de sistema; 1000+ = pessoas.</text>
            <text x="20" y="162" className="en mut">Fields separated by “:”. UID 0 = superuser; 1–999 = system accounts; 1000+ = people.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Arquivo" en="File" />, <T pt="Guarda" en="Holds" />, <T pt="Quem lê" en="Who can read" />]}
          rows={[
            [<code>/etc/passwd</code>, <T pt="contas: nome, UID, GID, home, shell" en="accounts: name, UID, GID, home, shell" />, <T pt="todos" en="everyone" />],
            [<code>/etc/shadow</code>, <T pt="hash da senha, validade, bloqueio" en="password hash, expiry, lock" />, <T pt="só root" en="root only" />],
            [<code>/etc/group</code>, <T pt="grupos e seus membros" en="groups and their members" />, <T pt="todos" en="everyone" />],
            [<><code>/etc/sudoers</code> e <code>/etc/sudoers.d/</code></>, <T pt={<>quem pode virar quem (editar só com <code>visudo</code>)</>} en={<>who may become whom (edit only with <code>visudo</code>)</>} />, <T pt="só root" en="root only" />],
          ]}
        />
        <h3><T pt="O superusuário (root)" en="The superuser (root)" /></h3>
        <p><T pt={<>O superusuário é quem tem <em>UID 0</em>, não quem se chama “root”. Para o kernel, UID 0 ignora as checagens de permissão de arquivos e pode, por exemplo, ler qualquer arquivo, matar qualquer processo e abrir portas abaixo de 1024. No Linux moderno esse poder é dividido em <em>capabilities</em> (ex.: <code>CAP_NET_BIND_SERVICE</code> só para abrir portas baixas), mas o root tradicional tem todas. Por isso a regra de ouro é: <em>use root só no instante em que precisar</em>.</>} en={<>The superuser is whoever has <em>UID 0</em>, not whoever is named “root”. To the kernel, UID 0 skips file permission checks and can, for example, read any file, kill any process and bind ports below 1024. Modern Linux splits that power into <em>capabilities</em> (e.g. <code>CAP_NET_BIND_SERVICE</code> just for low ports), but the traditional root has them all. Hence the golden rule: <em>use root only at the moment you need it</em>.</>} /></p>
        <Diagram minWidth={700} caption={<T pt="O fluxo do sudo: a pessoa continua sendo ela mesma, e só aquele comando roda como root. Isso deixa um rastro de auditoria, ao contrário de um shell root permanente." en="The sudo flow: the person stays themselves, and only that command runs as root. That leaves an audit trail, unlike a permanent root shell." />}>
          <svg viewBox="0 0 780 164" role="img" aria-label="Fluxo do sudo / sudo flow">
            <rect x="10" y="40" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="75" y="65" className="" textAnchor="middle">ana (UID 1000)</text>
            <text x="75" y="83" className="pt mut mono" textAnchor="middle">usuário comum</text>
            <text x="75" y="83" className="en mut mono" textAnchor="middle">regular user</text>
            <rect x="190" y="20" width="140" height="96" rx="4" className="ln" />
            <text x="260" y="64" className="mono" textAnchor="middle">sudo apt update</text>
            <text x="260" y="90" className="pt mut" textAnchor="middle">pede ao sudo</text>
            <text x="260" y="90" className="en mut" textAnchor="middle">asks sudo</text>
            <rect x="390" y="20" width="190" height="40" rx="4" className="ln" />
            <text x="485" y="44" className="pt" textAnchor="middle">está no sudoers?</text>
            <text x="485" y="44" className="en" textAnchor="middle">in sudoers?</text>
            <rect x="390" y="76" width="190" height="40" rx="4" className="ln" />
            <text x="485" y="100" className="pt" textAnchor="middle">pede a senha de ana</text>
            <text x="485" y="100" className="en" textAnchor="middle">asks ana’s password</text>
            <rect x="640" y="40" width="130" height="56" rx="4" className="ln fillsoft" />
            <text x="705" y="65" className="" textAnchor="middle">root (UID 0)</text>
            <text x="705" y="83" className="pt mut mono" textAnchor="middle">1 comando</text>
            <text x="705" y="83" className="en mut mono" textAnchor="middle">1 command</text>
            <path d="M140 68L190 68" className="ln" />
            <path d="M183.2 64.7L190 68L183.2 71.3" className="ln" />
            <path d="M330 50L390 40" className="ln" />
            <path d="M382.8 37.9L390 40L383.9 44.3" className="ln" />
            <path d="M330 86L390 96" className="ln" />
            <path d="M383.9 91.7L390 96L382.8 98.1" className="ln" />
            <path d="M580 40L640 58" className="ln" />
            <path d="M634.5 52.9L640 58L632.6 59.2" className="ln" />
            <path d="M580 96L640 78" className="ln" />
            <path d="M632.6 76.8L640 78L634.5 83.1" className="ln" />
            <text x="20" y="150" className="pt mut" textAnchor="start">Tudo fica registrado: /var/log/auth.log (Debian/Ubuntu) ou journalctl _COMM=sudo.</text>
            <text x="20" y="150" className="en mut" textAnchor="start">Everything is logged: /var/log/auth.log (Debian/Ubuntu) or journalctl _COMM=sudo.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`id                         # uid=1000(ana) gid=1000(ana) groups=1000(ana),27(sudo),1001(dev)
whoami                     # ana
groups ana                 # grupos de ana
getent passwd ana          # a linha de ana (funciona com LDAP também)

sudo useradd -m -s /bin/bash -G sudo ana   # cria usuário + home + shell + grupo extra
sudo passwd ana                            # define a senha
sudo usermod -aG dev ana                   # ADICIONA ao grupo dev (sem -a, apaga os outros!)
sudo groupadd dev                          # cria grupo
sudo gpasswd -d ana dev                    # tira ana do grupo dev
sudo passwd -l ana                         # bloqueia a conta (-u desbloqueia)
sudo userdel -r ana                        # remove usuário e o home

su - ana                   # vira ana (pede a senha DE ANA); o "-" carrega o ambiente dela
sudo -i                    # shell de root, autenticando com a SUA senha
sudo -l                    # lista o que você pode rodar com sudo
sudo visudo                # edita o sudoers com validação de sintaxe`} />
        <Callout tone="warn" icon="alert"><T pt={<>Pegadinha clássica: <code>usermod -G dev ana</code> (sem <code>-a</code>) <em>substitui</em> todos os grupos suplementares de ana, inclusive o <code>sudo</code>. Use sempre <code>-aG</code>. E quem muda de grupo precisa abrir uma nova sessão (logout/login ou <code>newgrp</code>) para o grupo valer.</>} en={<>Classic trap: <code>usermod -G dev ana</code> (without <code>-a</code>) <em>replaces</em> all of ana’s supplementary groups, including <code>sudo</code>. Always use <code>-aG</code>. And someone whose groups changed needs a new session (log out/in or <code>newgrp</code>) for it to take effect.</>} /></Callout>
        <Callout icon="check"><T pt={<>No Debian/Ubuntu existe também <code>adduser</code>, mais amigável (pergunta nome e senha). <code>useradd</code> é o comando de baixo nível, igual em todas as distribuições. Para a teoria de UID real, efetivo e salvo, veja o cap. 9 do Kerrisk.</>} en={<>Debian/Ubuntu also have <code>adduser</code>, friendlier (it asks name and password). <code>useradd</code> is the low-level command, the same on every distribution. For the theory of real, effective and saved UIDs, see Kerrisk ch. 9.</>} /></Callout>
      </Section>
      <Section id="perms" title={<T pt="Arquivos e permissões" en="Files and permissions" />}>
        <p><T pt={<>Todo arquivo tem um <em>dono</em> (usuário), um <em>grupo</em> e nove bits de permissão: leitura (<code>r</code>), escrita (<code>w</code>) e execução (<code>x</code>) para três públicos: o dono (<code>u</code>), o grupo (<code>g</code>) e todo o resto (<code>o</code>). O kernel escolhe <em>um</em> público, nesta ordem: se você é o dono, vale só a regra do dono; senão, se está no grupo, vale a do grupo; senão, a de outros.</>} en={<>Every file has an <em>owner</em> (user), a <em>group</em> and nine permission bits: read (<code>r</code>), write (<code>w</code>) and execute (<code>x</code>) for three audiences: the owner (<code>u</code>), the group (<code>g</code>) and everybody else (<code>o</code>). The kernel picks <em>one</em> audience, in this order: if you are the owner, only the owner rule applies; otherwise, if you are in the group, the group rule; otherwise, the others rule.</>} /></p>
        <Diagram minWidth={700} caption={<T pt={<>Lendo <code>-rwxr-xr--</code>: tipo, depois três trios. Em octal, r vale 4, w vale 2 e x vale 1; somam-se por público.</>} en={<>Reading <code>-rwxr-xr--</code>: type, then three triplets. In octal, r is 4, w is 2 and x is 1; add them per audience.</>} />}>
          <svg viewBox="0 0 780 178" role="img" aria-label="Anatomia das permissões / Permission anatomy">
            <text x="20" y="40" className="mut mono">ls -l:</text>
            <rect x="130" y="20" width="42" height="34" rx="4" className="ln" />
            <text x="151" y="43" className="mono" textAnchor="middle">-</text>
            <rect x="176" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="197" y="43" className="mono" textAnchor="middle">r</text>
            <rect x="222" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="243" y="43" className="mono" textAnchor="middle">w</text>
            <rect x="268" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="289" y="43" className="mono" textAnchor="middle">x</text>
            <rect x="314" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="335" y="43" className="mono" textAnchor="middle">r</text>
            <rect x="360" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="381" y="43" className="mono" textAnchor="middle">-</text>
            <rect x="406" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="427" y="43" className="mono" textAnchor="middle">x</text>
            <rect x="452" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="473" y="43" className="mono" textAnchor="middle">r</text>
            <rect x="498" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="519" y="43" className="mono" textAnchor="middle">-</text>
            <rect x="544" y="20" width="42" height="34" rx="4" className="ln fillsoft" />
            <text x="565" y="43" className="mono" textAnchor="middle">-</text>
            <text x="602" y="43" className="mono">1 ana dev 812 build.sh</text>
            <path d="M130 64L172 64" className="ln" />
            <text x="151.0" y="82" className="pt" textAnchor="middle">tipo</text>
            <text x="151.0" y="82" className="en" textAnchor="middle">type</text>
            <path d="M176 64L310 64" className="ln" />
            <text x="243.0" y="82" className="pt" textAnchor="middle">dono (u)</text>
            <text x="243.0" y="82" className="en" textAnchor="middle">owner (u)</text>
            <path d="M314 64L448 64" className="ln" />
            <text x="381.0" y="82" className="pt" textAnchor="middle">grupo (g)</text>
            <text x="381.0" y="82" className="en" textAnchor="middle">group (g)</text>
            <path d="M452 64L586 64" className="ln" />
            <text x="519.0" y="82" className="pt" textAnchor="middle">outros (o)</text>
            <text x="519.0" y="82" className="en" textAnchor="middle">others (o)</text>
            <text x="243.0" y="104" className="mono mut" textAnchor="middle">rwx = 4+2+1 = 7</text>
            <text x="381.0" y="104" className="mono mut" textAnchor="middle">r-x = 4+0+1 = 5</text>
            <text x="519.0" y="104" className="mono mut" textAnchor="middle">r-- = 4+0+0 = 4</text>
            <text x="130" y="140" className="pt mono">chmod 754 build.sh ← 7 (dono) 5 (grupo) 4 (outros)</text>
            <text x="130" y="140" className="en mono">chmod 754 build.sh ← 7 (owner) 5 (group) 4 (others)</text>
            <text x="130" y="164" className="pt mut">tipo: - arquivo · d diretório · l link simbólico · c/b dispositivo · s socket · p fifo</text>
            <text x="130" y="164" className="en mut">type: - file · d directory · l symlink · c/b device · s socket · p fifo</text>
          </svg>
        </Diagram>
        <h3><T pt="O que r, w e x significam em cada tipo" en="What r, w and x mean for each type" /></h3>
        <Table
          head={[<T pt="Bit" en="Bit" />, <T pt="Em arquivo" en="On a file" />, <T pt="Em diretório" en="On a directory" />]}
          rows={[
            [<code>r</code>, <T pt="ler o conteúdo" en="read the content" />, <T pt={<>listar os nomes (<code>ls</code>)</>} en={<>list the names (<code>ls</code>)</>} />],
            [<code>w</code>, <T pt="alterar o conteúdo" en="change the content" />, <T pt="criar, renomear e apagar entradas dentro dele" en="create, rename and delete entries inside it" />],
            [<code>x</code>, <T pt="executar como programa" en="run as a program" />, <T pt={<>“atravessar”: entrar com <code>cd</code> e acessar arquivos pelo nome</>} en={<>“traverse”: <code>cd</code> into it and reach files by name</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Pegadinha: apagar um arquivo depende da permissão <code>w</code> <em>do diretório</em>, não do arquivo. Quem pode escrever no diretório pode apagar arquivos de outros dentro dele, a não ser que o <em>sticky bit</em> (abaixo) esteja ligado.</>} en={<>Trap: deleting a file depends on the <code>w</code> permission <em>of the directory</em>, not of the file. Whoever can write to the directory can delete other people’s files inside it, unless the <em>sticky bit</em> (below) is on.</>} /></Callout>
        <CodeBlock code={`ls -l arquivo               # permissões, dono, grupo, tamanho, data
ls -ld /etc /tmp            # -d: o próprio diretório, não o conteúdo
stat arquivo                # tudo, inclusive inode e octal
namei -l /var/www/index.html   # mostra a permissão de CADA pedaço do caminho

chmod u+x script.sh         # simbólico: dono ganha x
chmod g-w,o-rwx arquivo     # grupo perde w; outros perdem tudo
chmod 640 arquivo           # octal: rw- r-- ---
chmod -R 755 pasta/         # recursivo (cuidado: põe x em arquivos também)
chmod a+r arquivo           # a = all (u+g+o)

sudo chown ana arquivo      # muda dono
sudo chown ana:dev arquivo  # dono e grupo de uma vez
sudo chown -R ana: pasta/   # "ana:" = grupo principal de ana
chgrp dev arquivo           # muda só o grupo (se você pertence a ele)

umask                       # máscara atual (típico 0022)
umask 027                   # novos arquivos: 640, novos diretórios: 750`} />
        <p><T pt={<>A <em>umask</em> é subtraída das permissões-padrão (666 para arquivos, 777 para diretórios). Com <code>umask 022</code>: arquivos viram 644 e diretórios 755. Com <code>027</code>: 640 e 750, ou seja, “outros” não veem nada.</>} en={<>The <em>umask</em> is subtracted from the default permissions (666 for files, 777 for directories). With <code>umask 022</code>: files become 644 and directories 755. With <code>027</code>: 640 and 750, meaning “others” see nothing.</>} /></p>
        <h3><T pt="Bits especiais: setuid, setgid e sticky" en="Special bits: setuid, setgid and sticky" /></h3>
        <Table
          head={[<T pt="Bit" en="Bit" />, <T pt="Octal" en="Octal" />, <T pt="Efeito" en="Effect" />, <T pt="Exemplo real" en="Real example" />]}
          rows={[
            [<>setuid (<code>s</code> no dono)</>, "4000", <T pt={<>o programa roda com os privilégios do <em>dono do arquivo</em></>} en={<>the program runs with the privileges of the <em>file’s owner</em></>} />, <T pt={<><code>/usr/bin/passwd</code> (dono root) altera <code>/etc/shadow</code> para um usuário comum</>} en={<><code>/usr/bin/passwd</code> (owner root) edits <code>/etc/shadow</code> for a regular user</>} />],
            [<>setgid (<code>s</code> no grupo)</>, "2000", <T pt={<>em arquivo: roda com o grupo do arquivo. Em <em>diretório</em>: novos arquivos herdam o grupo do diretório</>} en={<>on a file: runs with the file’s group. On a <em>directory</em>: new files inherit the directory’s group</>} />, <T pt={<>pasta compartilhada de um time: <code>chmod g+s /srv/projeto</code></>} en={<>a team’s shared folder: <code>chmod g+s /srv/projeto</code></>} />],
            [<>sticky (<code>t</code> em outros)</>, "1000", <T pt="em diretório: só o dono do arquivo (ou root) apaga ou renomeia" en="on a directory: only the file’s owner (or root) can delete or rename" />, <T pt={<><code>/tmp</code> tem <code>drwxrwxrwt</code></>} en={<><code>/tmp</code> is <code>drwxrwxrwt</code></>} />],
          ]}
        />
        <CodeBlock code={`chmod 4755 programa         # setuid + rwxr-xr-x
chmod g+s /srv/projeto      # setgid no diretório
chmod +t /srv/publico       # sticky
find / -perm -4000 -type f 2>/dev/null   # AUDITORIA: lista todos os programas setuid`} />
        <Callout tone="warn" icon="alert"><T pt={<>Segurança: programas setuid de root são alvo preferido de ataque; qualquer bug neles vira escalada de privilégio. Audite a lista com o <code>find</code> acima e desconfie de itens que você não reconhece.</>} en={<>Security: setuid-root programs are a favourite attack target; any bug in them becomes privilege escalation. Audit the list with the <code>find</code> above and distrust entries you do not recognise.</>} /></Callout>
        <h3><T pt="ACLs: quando três públicos não bastam" en="ACLs: when three audiences are not enough" /></h3>
        <p><T pt={<>Se você precisa dar acesso a <em>uma</em> pessoa específica sem mexer no dono nem no grupo, use ACL (<em>Access Control List</em>; Kerrisk, cap. 17). O <code>ls -l</code> mostra um <code>+</code> no fim das permissões quando existe ACL.</>} en={<>If you need to give access to <em>one</em> specific person without touching owner or group, use an ACL (<em>Access Control List</em>; Kerrisk, ch. 17). <code>ls -l</code> shows a <code>+</code> after the permissions when an ACL exists.</>} /></p>
        <CodeBlock code={`setfacl -m u:bia:rw relatorio.txt     # dá rw à usuária bia
setfacl -x u:bia relatorio.txt        # remove a regra
getfacl relatorio.txt                 # mostra todas`} />
      </Section>
      <Section id="fhs" title={<T pt="Estrutura de arquivos" en="File structure" />}>
        <p><T pt={<>O Linux tem <em>uma única árvore</em> de diretórios que começa em <code>/</code> (a raiz). Não existe “C:” ou “D:”: um pendrive ou outro disco é <em>montado</em> em algum diretório (por exemplo <code>/mnt/usb</code>) e seu conteúdo aparece ali. O Filesystem Hierarchy Standard (FHS) define o papel de cada diretório, e <code>man 7 hier</code> resume.</>} en={<>Linux has <em>one single tree</em> of directories that starts at <code>/</code> (the root). There is no “C:” or “D:”: a USB stick or another disk is <em>mounted</em> on some directory (for example <code>/mnt/usb</code>) and its content appears there. The Filesystem Hierarchy Standard (FHS) defines each directory’s role, and <code>man 7 hier</code> summarises it.</>} /></p>
        <Diagram minWidth={640} caption={<T pt={<>O mapa do sistema de arquivos. Memorize os quatro mais cobrados em prova: <code>/etc</code> (configuração), <code>/var</code> (dados variáveis e logs), <code>/home</code> (usuários) e <code>/proc</code> (kernel em tempo real).</>} en={<>The filesystem map. Memorise the four most asked in exams: <code>/etc</code> (configuration), <code>/var</code> (variable data and logs), <code>/home</code> (users) and <code>/proc</code> (live kernel).</>} />}>
          <svg viewBox="0 0 700 413" role="img" aria-label="Estrutura de diretórios / Directory structure">
            <text x="20" y="24" className="mono">/</text>
            <path d="M30 30L30 381" className="ln" />
            <path d="M30 44L48 44" className="ln" />
            <text x="54" y="49" className="mono">/bin /sbin /lib</text>
            <text x="220" y="49" className="pt mut">comandos e bibliotecas essenciais (hoje links para /usr/…)</text>
            <text x="220" y="49" className="en mut">essential commands and libraries (today links to /usr/…)</text>
            <path d="M30 69L48 69" className="ln" />
            <text x="54" y="74" className="mono">/boot</text>
            <text x="220" y="74" className="pt mut">kernel e bootloader (GRUB)</text>
            <text x="220" y="74" className="en mut">kernel and bootloader (GRUB)</text>
            <path d="M30 94L48 94" className="ln" />
            <text x="54" y="99" className="mono">/dev</text>
            <text x="220" y="99" className="pt mut">dispositivos como arquivos: /dev/sda, /dev/null, /dev/tty</text>
            <text x="220" y="99" className="en mut">devices as files: /dev/sda, /dev/null, /dev/tty</text>
            <path d="M30 119L48 119" className="ln" />
            <text x="54" y="124" className="mono">/etc</text>
            <text x="220" y="124" className="pt mut">configuração do sistema, em texto</text>
            <text x="220" y="124" className="en mut">system configuration, in text</text>
            <path d="M30 144L48 144" className="ln" />
            <text x="54" y="149" className="mono">/home</text>
            <text x="220" y="149" className="pt mut">pastas dos usuários (/home/ana)</text>
            <text x="220" y="149" className="en mut">users’ folders (/home/ana)</text>
            <path d="M30 169L48 169" className="ln" />
            <text x="54" y="174" className="mono">/root</text>
            <text x="220" y="174" className="pt mut">home do superusuário (fora de /home)</text>
            <text x="220" y="174" className="en mut">superuser’s home (outside /home)</text>
            <path d="M30 194L48 194" className="ln" />
            <text x="54" y="199" className="mono">/media /mnt</text>
            <text x="220" y="199" className="pt mut">pontos de montagem de mídias e discos</text>
            <text x="220" y="199" className="en mut">mount points for media and disks</text>
            <path d="M30 219L48 219" className="ln" />
            <text x="54" y="224" className="mono">/opt</text>
            <text x="220" y="224" className="pt mut">software de terceiros em bloco (ex.: /opt/google)</text>
            <text x="220" y="224" className="en mut">self-contained third-party software (e.g. /opt/google)</text>
            <path d="M30 244L48 244" className="ln" />
            <text x="54" y="249" className="mono">/proc</text>
            <text x="220" y="249" className="pt mut">janela virtual para o kernel e os processos: /proc/PID, /proc/cpuinfo</text>
            <text x="220" y="249" className="en mut">virtual window into the kernel and processes: /proc/PID, /proc/cpuinfo</text>
            <path d="M30 269L48 269" className="ln" />
            <text x="54" y="274" className="mono">/sys</text>
            <text x="220" y="274" className="pt mut">dispositivos e drivers, também virtual</text>
            <text x="220" y="274" className="en mut">devices and drivers, also virtual</text>
            <path d="M30 294L48 294" className="ln" />
            <text x="54" y="299" className="mono">/run</text>
            <text x="220" y="299" className="pt mut">estado de execução desde o boot (PIDs, sockets); some ao reiniciar</text>
            <text x="220" y="299" className="en mut">runtime state since boot (PIDs, sockets); gone on reboot</text>
            <path d="M30 319L48 319" className="ln" />
            <text x="54" y="324" className="mono">/srv</text>
            <text x="220" y="324" className="pt mut">dados servidos pela máquina (sites, FTP)</text>
            <text x="220" y="324" className="en mut">data served by the machine (sites, FTP)</text>
            <path d="M30 344L48 344" className="ln" />
            <text x="54" y="349" className="mono">/tmp</text>
            <text x="220" y="349" className="pt mut">temporários de todos (sticky bit); limpo no boot ou periodicamente</text>
            <text x="220" y="349" className="en mut">everyone’s temporaries (sticky bit); cleaned at boot or periodically</text>
            <path d="M30 369L48 369" className="ln" />
            <text x="54" y="374" className="mono">/usr</text>
            <text x="220" y="374" className="pt mut">programas, bibliotecas e docs instalados (bin, lib, share, local)</text>
            <text x="220" y="374" className="en mut">installed programs, libraries and docs (bin, lib, share, local)</text>
            <path d="M30 394L48 394" className="ln" />
            <text x="54" y="399" className="mono">/var</text>
            <text x="220" y="399" className="pt mut">dados que mudam: logs (/var/log), filas, caches, bancos</text>
            <text x="220" y="399" className="en mut">data that changes: logs (/var/log), queues, caches, databases</text>
          </svg>
        </Diagram>
        <h3><T pt="Montagem, discos e inodes" en="Mounting, disks and inodes" /></h3>
        <p><T pt={<>Cada arquivo é, por baixo, um <em>inode</em>: um registro com dono, permissões, tamanhos e ponteiros para os blocos de dados. O <em>nome</em> do arquivo vive no diretório, que é só uma tabela “nome → número do inode”. Por isso um arquivo pode ter vários nomes (<em>hard links</em>) e por isso renomear é instantâneo (Kerrisk, cap. 14 e 18).</>} en={<>Underneath, each file is an <em>inode</em>: a record with owner, permissions, sizes and pointers to the data blocks. The file’s <em>name</em> lives in the directory, which is just a “name → inode number” table. That is why a file can have several names (<em>hard links</em>) and why renaming is instant (Kerrisk, ch. 14 and 18).</>} /></p>
        <Table
          head={[<T pt="Tipo de link" en="Link type" />, <T pt="O que é" en="What it is" />, <T pt="Comando" en="Command" />]}
          rows={[
            [<T pt="Hard link" en="Hard link" />, <T pt={<>outro nome para o <em>mesmo inode</em>; o dado só some quando o último nome some; não cruza partições</>} en={<>another name for the <em>same inode</em>; the data only goes when the last name goes; cannot cross partitions</>} />, <code>ln original apelido</code>],
            [<T pt="Link simbólico" en="Symbolic link" />, <T pt={<>um arquivo pequeno que guarda um <em>caminho</em>; quebra se o alvo some; pode cruzar partições</>} en={<>a small file that stores a <em>path</em>; breaks if the target disappears; can cross partitions</>} />, <code>ln -s alvo atalho</code>],
          ]}
        />
        <p><T pt={<>Mais detalhes, diagramas e exemplos na seção <a href="#links">Links simbólicos</a>.</>} en={<>More detail, diagrams and examples in the <a href="#links">Symbolic links</a> section.</>} /></p>
        <CodeBlock code={`lsblk                       # discos e partições em árvore
df -h                       # espaço livre por sistema de arquivos
du -sh * | sort -h          # quem está ocupando espaço aqui
findmnt                     # o que está montado onde
sudo mount /dev/sdb1 /mnt/usb
sudo umount /mnt/usb        # (é umount, sem "n")
cat /etc/fstab              # o que monta automaticamente no boot
ls -i arquivo               # número do inode`} />
      </Section>
      <Section id="links" title={<T pt="Links simbólicos (e hard links)" en="Symbolic links (and hard links)" />}>
        <p><T pt={<>Um <em>link simbólico</em> (<i>symlink</i>, ou <i>soft link</i>) é um arquivo especial e minúsculo cujo conteúdo é só um <b>caminho</b>, escrito como texto. Quando um programa abre o link, o kernel lê esse texto e segue para o caminho indicado, como se o programa tivesse aberto o alvo. Parece um “atalho” do Windows, com uma diferença importante: o atalho é entendido só pelo gerenciador de arquivos, enquanto o symlink é entendido pelo <b>sistema inteiro</b>. Para o <code>cat</code>, o <code>nginx</code> ou um script, o link <i>é</i> o alvo.</>} en={<>A <em>symbolic link</em> (<i>symlink</i>, or <i>soft link</i>) is a tiny special file whose content is just a <b>path</b>, written as text. When a program opens the link, the kernel reads that text and follows it to the path, as if the program had opened the target. It looks like a Windows “shortcut”, with one important difference: a shortcut is understood only by the file manager, while a symlink is understood by the <b>whole system</b>. To <code>cat</code>, <code>nginx</code> or a script, the link <i>is</i> the target.</>} /></p>
        <p><T pt={<>Para entender a diferença para o <em>hard link</em> (do fim da seção anterior), lembre que o diretório é uma tabela “nome → inode”. O hard link é uma segunda linha apontando para o <b>mesmo inode</b>. O symlink é um <b>inode novo</b>, do tipo “link”, que guarda o nome de outro arquivo.</>} en={<>To see the difference from the <em>hard link</em> (at the end of the previous section), remember that a directory is a “name → inode” table. A hard link is a second row pointing to the <b>same inode</b>. A symlink is a <b>new inode</b>, of type “link”, that stores the name of another file.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="Dois nomes para o mesmo inode (esquerda) contra um inode novo que guarda um caminho (direita)." en="Two names for the same inode (left) versus a new inode that stores a path (right)." />}>
          <svg viewBox="0 0 700 300" role="img" aria-label="Hard link e link simbólico / Hard link and symbolic link">
            <text x="10" y="18" className="pt mut mono" textAnchor="start">hard link</text>
            <text x="10" y="18" className="en mut mono" textAnchor="start">hard link</text>
            <text x="370" y="18" className="pt mut mono" textAnchor="start">link simbólico</text>
            <text x="370" y="18" className="en mut mono" textAnchor="start">symbolic link</text>
            <path d="M350 8L350 240" className="ln dash" />
            <rect x="10" y="40" width="100" height="32" rx="4" className="ln fillsoft" />
            <text x="60" y="61" className="mono" textAnchor="middle">a.txt</text>
            <rect x="10" y="120" width="100" height="32" rx="4" className="ln fillsoft" />
            <text x="60" y="141" className="mono" textAnchor="middle">hard.txt</text>
            <path d="M110 56L190 56" className="ln" />
            <path d="M182.8 59.5L190 56L182.8 52.5" className="ln" />
            <path d="M110 136L190 136" className="ln" />
            <path d="M182.8 139.5L190 136L182.8 132.5" className="ln" />
            <rect x="190" y="40" width="150" height="112" rx="4" className="ln brandfill" />
            <text x="265" y="82" className="mono" textAnchor="middle">inode 1839781</text>
            <text x="265" y="104" className="pt mut" textAnchor="middle">tipo: arquivo</text>
            <text x="265" y="104" className="en mut" textAnchor="middle">type: file</text>
            <text x="265" y="124" className="pt mut" textAnchor="middle">links: 2</text>
            <text x="265" y="124" className="en mut" textAnchor="middle">links: 2</text>
            <path d="M265 152L265 196" className="ln" />
            <path d="M261.5 188.8L265 196L268.5 188.8" className="ln" />
            <rect x="190" y="196" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="265" y="217" className="pt" textAnchor="middle">dados: “ola”</text>
            <text x="265" y="217" className="en" textAnchor="middle">data: “ola”</text>
            <text x="10" y="196" className="pt mut" textAnchor="start">dois nomes,</text>
            <text x="10" y="196" className="en mut" textAnchor="start">two names,</text>
            <text x="10" y="214" className="pt mut" textAnchor="start">um só arquivo</text>
            <text x="10" y="214" className="en mut" textAnchor="start">one single file</text>
            <rect x="370" y="40" width="100" height="32" rx="4" className="ln fillsoft" />
            <text x="420" y="61" className="mono" textAnchor="middle">soft.txt</text>
            <path d="M470 56L520 56" className="ln" />
            <path d="M512.8 59.5L520 56L512.8 52.5" className="ln" />
            <rect x="520" y="30" width="170" height="60" rx="4" className="ln brandfill" />
            <text x="605" y="52" className="mono" textAnchor="middle">inode 1839783</text>
            <text x="605" y="70" className="pt mut" textAnchor="middle">tipo: link · guarda o texto</text>
            <text x="605" y="70" className="en mut" textAnchor="middle">type: link · stores the text</text>
            <text x="605" y="84" className="mono" textAnchor="middle">"a.txt"</text>
            <path d="M605 90L605 108L420 108L420 120" className="ln dash" />
            <path d="M416.5 112.8L420 120L423.5 112.8" className="ln" />
            <text x="512" y="102" className="pt mut" textAnchor="middle">o kernel procura este nome</text>
            <text x="512" y="102" className="en mut" textAnchor="middle">the kernel looks this name up</text>
            <rect x="370" y="120" width="100" height="32" rx="4" className="ln fillsoft" />
            <text x="420" y="141" className="mono" textAnchor="middle">a.txt</text>
            <path d="M470 136L520 136" className="ln" />
            <path d="M512.8 139.5L520 136L512.8 132.5" className="ln" />
            <rect x="520" y="120" width="170" height="52" rx="4" className="ln fillsoft" />
            <text x="605" y="142" className="mono" textAnchor="middle">inode 1839781</text>
            <text x="605" y="160" className="pt mut" textAnchor="middle">tipo: arquivo</text>
            <text x="605" y="160" className="en mut" textAnchor="middle">type: file</text>
            <path d="M605 172L605 196" className="ln" />
            <path d="M601.5 188.8L605 196L608.5 188.8" className="ln" />
            <rect x="520" y="196" width="170" height="34" rx="4" className="ln fillsoft" />
            <text x="605" y="217" className="pt" textAnchor="middle">dados: “ola”</text>
            <text x="605" y="217" className="en" textAnchor="middle">data: “ola”</text>
            <text x="10" y="250" className="pt mut" textAnchor="start">Apague a.txt: o hard link ainda lê “ola” (o inode tem outro nome).</text>
            <text x="10" y="250" className="en mut" textAnchor="start">Delete a.txt: the hard link still reads “ola” (the inode has another name).</text>
            <text x="10" y="268" className="pt mut" textAnchor="start">O symlink quebra: o nome “a.txt” não existe mais.</text>
            <text x="10" y="268" className="en mut" textAnchor="start">The symlink breaks: the name “a.txt” no longer exists.</text>
            <text x="10" y="288" className="pt mut" textAnchor="start">O symlink aponta para um nome; o hard link aponta para o próprio arquivo.</text>
            <text x="10" y="284" className="en mut" textAnchor="start">A symlink points to a name; a hard link points to the file itself.</text>
          </svg>
        </Diagram>
        <h3><T pt="Criar e ler" en="Creating and reading" /></h3>
        <p><T pt={<>A ordem é a do <code>cp</code>: primeiro o que já existe, depois o nome novo. Ou seja, <code>ln -s ALVO NOME_DO_LINK</code>.</>} en={<>The order is the same as <code>cp</code>: first what already exists, then the new name. That is, <code>ln -s TARGET LINK_NAME</code>.</>} /></p>
        <CodeBlock code={`ln -s alvo atalho           # cria o symlink "atalho" que aponta para "alvo"
ls -l atalho                # mostra:  atalho -> alvo   (o "l" no começo = link)
readlink atalho             # só o texto guardado no link
readlink -f atalho          # caminho final, absoluto, com todos os links resolvidos
find . -type l              # lista todos os links simbólicos daqui para baixo
find . -xtype l             # lista só os links QUEBRADOS`} />
        <h3><T pt="Mão na massa: hard link contra symlink" en="Hands on: hard link versus symlink" /></h3>
        <p><T pt="Rode numa pasta vazia qualquer. A saída abaixo é de uma execução real (número do inode e datas mudam na sua máquina)." en="Run it in any empty folder. The output below comes from a real run (inode numbers and dates will differ on your machine)." /></p>
        <CodeBlock code={`$ echo ola > a.txt
$ ln a.txt hard.txt          # hard link: segundo nome, mesmo inode
$ ln -s a.txt soft.txt       # symlink: arquivo novo que guarda o texto "a.txt"
$ ls -li a.txt hard.txt soft.txt
1839781 -rw-rw-r-- 2 ana ana 4 out 26 23:13 a.txt
1839781 -rw-rw-r-- 2 ana ana 4 out 26 23:13 hard.txt
1839783 lrwxrwxrwx 1 ana ana 5 out 26 23:13 soft.txt -> a.txt

$ rm a.txt                   # apago o nome original
$ cat hard.txt
ola                          # o dado continua: o inode ainda tinha outro nome
$ cat soft.txt
cat: soft.txt: No such file or directory   # o link aponta para um nome que sumiu
$ file soft.txt
soft.txt: broken symbolic link to a.txt`} />
        <p><T pt={<>Repare em três pistas no <code>ls -li</code>: o <b>mesmo número de inode</b> (1839781) nos dois primeiros, a <b>contagem de links</b> (o “2” depois das permissões) e o tamanho do symlink, <b>5 bytes</b>, que é exatamente o comprimento do texto <code>a.txt</code>.</>} en={<>Notice three clues in <code>ls -li</code>: the <b>same inode number</b> (1839781) on the first two, the <b>link count</b> (the “2” after the permissions) and the symlink’s size, <b>5 bytes</b>, which is exactly the length of the text <code>a.txt</code>.</>} /></p>
        <Table
          head={[null, <T pt="Hard link" en="Hard link" />, <T pt="Link simbólico" en="Symbolic link" />]}
          rows={[
            [<T pt="Aponta para" en="Points to" />, <T pt="o inode (o arquivo em si)" en="the inode (the file itself)" />, <T pt="um caminho (texto)" en="a path (text)" />],
            [<T pt="Se o original for apagado" en="If the original is deleted" />, <T pt="continua funcionando" en="keeps working" />, <T pt={<>quebra (<i>dangling</i>)</>} en={<>breaks (<i>dangling</i>)</>} />],
            [<T pt="Cruza partições e discos" en="Crosses partitions and disks" />, <T pt="não (inodes são por sistema de arquivos)" en="no (inodes are per filesystem)" />, <T pt="sim" en="yes" />],
            [<T pt="Pode apontar para diretório" en="Can point to a directory" />, <T pt={<>não (<code>ln: app: hard link not allowed for directory</code>)</>} en={<>no (<code>ln: app: hard link not allowed for directory</code>)</>} />, <T pt="sim" en="yes" />],
            [<T pt="Pode apontar para algo que não existe" en="Can point to something that does not exist" />, <T pt="não" en="no" />, <T pt="sim (é só texto)" en="yes (it is just text)" />],
            [<T pt="Como saber que é link" en="How to tell it is a link" />, <T pt="contagem de links > 1 e mesmo inode" en="link count > 1 and same inode" />, <T pt={<><code>l</code> no <code>ls -l</code> e <code>-&gt;</code> mostrando o alvo</>} en={<><code>l</code> in <code>ls -l</code> and <code>-&gt;</code> showing the target</>} />],
            [<T pt="Uso típico" en="Typical use" />, <T pt="dois nomes para o mesmo dado sem copiar (backups por snapshot, por exemplo)" en="two names for the same data without copying (snapshot-style backups, for example)" />, <T pt="quase todo o resto: atalhos, versões, compatibilidade" en="almost everything else: shortcuts, versions, compatibility" />],
          ]}
        />
        <h3><T pt="Quando usar: exemplos reais" en="When to use: real examples" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Trocar de versão sem parar de apontar para o mesmo lugar.</em> O padrão mais valioso para quem faz deploy: as versões ficam em <code>releases/v1</code>, <code>releases/v2</code> e um link <code>current</code> aponta para a ativa. O servidor sempre lê <code>/opt/app/current</code>. Publicar é trocar o link; voltar atrás é apontar de novo (veja o diagrama abaixo).</>} en={<><em>Switching version without ever changing the path.</em> The most valuable pattern for anyone who deploys: versions sit in <code>releases/v1</code>, <code>releases/v2</code> and a <code>current</code> link points to the active one. The server always reads <code>/opt/app/current</code>. Releasing is swapping the link; rolling back is pointing it back (see the diagram below).</>} /></li>
          <li><T pt={<><em>Habilitar e desabilitar configuração.</em> Em Debian e Ubuntu o Nginx guarda os sites em <code>/etc/nginx/sites-available/</code> e “liga” um deles com um link em <code>/etc/nginx/sites-enabled/</code>: <code>sudo ln -s /etc/nginx/sites-available/meusite /etc/nginx/sites-enabled/</code>. Desligar é apagar o link; o arquivo de configuração continua guardado.</>} en={<><em>Enabling and disabling configuration.</em> On Debian and Ubuntu, Nginx keeps sites in <code>/etc/nginx/sites-available/</code> and “turns one on” with a link in <code>/etc/nginx/sites-enabled/</code>: <code>sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/</code>. Turning it off is deleting the link; the configuration file stays stored.</>} /></li>
          <li><T pt={<><em>Dotfiles num repositório.</em> Guarde <code>.bashrc</code> e <code>.gitconfig</code> em <code>~/dotfiles</code> (com Git) e aponte para eles: <code>ln -s ~/dotfiles/.bashrc ~/.bashrc</code>. O programa lê o caminho de sempre; a versão controlada fica no repositório.</>} en={<><em>Dotfiles in a repository.</em> Keep <code>.bashrc</code> and <code>.gitconfig</code> in <code>~/dotfiles</code> (under Git) and point to them: <code>ln -s ~/dotfiles/.bashrc ~/.bashrc</code>. The program reads the usual path; the versioned copy lives in the repository.</>} /></li>
          <li><T pt={<><em>Pasta que mora em outro disco.</em> Sem espaço no disco principal? Mova a pasta para outro disco e deixe um link no lugar: <code>mv ~/Videos /mnt/hd/Videos &amp;&amp; ln -s /mnt/hd/Videos ~/Videos</code>. Os programas não notam a diferença.</>} en={<><em>A folder that lives on another disk.</em> Out of space on the main disk? Move the folder to another disk and leave a link in its place: <code>mv ~/Videos /mnt/hd/Videos &amp;&amp; ln -s /mnt/hd/Videos ~/Videos</code>. Programs do not notice the difference.</>} /></li>
          <li><T pt={<><em>Compatibilidade de nomes.</em> O próprio sistema usa muito: em distribuições modernas <code>/bin</code> é um link para <code>usr/bin</code> (veja o mapa acima), e é comum <code>python</code> apontar para <code>python3</code> ou <code>/usr/bin/vi</code> para o editor escolhido (o sistema <code>alternatives</code> do Debian é feito de links). Confira com <code>ls -l /bin /usr/bin/python3</code>.</>} en={<><em>Name compatibility.</em> The system itself uses them a lot: on modern distributions <code>/bin</code> is a link to <code>usr/bin</code> (see the map above), and it is common for <code>python</code> to point to <code>python3</code> or <code>/usr/bin/vi</code> to the chosen editor (Debian’s <code>alternatives</code> system is made of links). Check with <code>ls -l /bin /usr/bin/python3</code>.</>} /></li>
        </ul>
        <Diagram minWidth={600} caption={<T pt={<>O padrão <code>current</code>: o servidor nunca muda de caminho, só o destino do link muda.</>} en={<>The <code>current</code> pattern: the server never changes path, only the link’s destination does.</>} />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Trocar de versão com um link current / Switching version with a current link">
            <rect x="10" y="62" width="170" height="52" rx="4" className="ln fillsoft" />
            <text x="95" y="84" className="pt" textAnchor="middle">servidor (Nginx, app)</text>
            <text x="95" y="84" className="en" textAnchor="middle">server (Nginx, app)</text>
            <text x="95" y="102" className="mono mut" textAnchor="middle">/opt/app/current</text>
            <path d="M180 88L240 88" className="ln" />
            <path d="M232.8 91.5L240 88L232.8 84.5" className="ln" />
            <rect x="240" y="20" width="140" height="136" rx="4" className="ln brandfill" />
            <text x="310" y="46" className="mono" textAnchor="middle">current</text>
            <text x="310" y="66" className="pt mut" textAnchor="middle">(link simbólico)</text>
            <text x="310" y="66" className="en mut" textAnchor="middle">(symlink)</text>
            <text x="310" y="124" className="pt mut" textAnchor="middle">o único nome que</text>
            <text x="310" y="124" className="en mut" textAnchor="middle">the only name that</text>
            <text x="310" y="142" className="pt mut" textAnchor="middle">o servidor conhece</text>
            <text x="310" y="142" className="en mut" textAnchor="middle">the server knows</text>
            <path d="M380 44L480 44" className="ln dash" />
            <path d="M472.8 47.5L480 44L472.8 40.5" className="ln" />
            <text x="430" y="36" className="pt mut" textAnchor="middle">antes</text>
            <text x="430" y="36" className="en mut" textAnchor="middle">before</text>
            <path d="M380 132L480 132" className="ln" />
            <path d="M472.8 135.5L480 132L472.8 128.5" className="ln" />
            <text x="430" y="124" className="pt mut" textAnchor="middle">depois</text>
            <text x="430" y="124" className="en mut" textAnchor="middle">after</text>
            <rect x="480" y="24" width="200" height="40" rx="4" className="ln dash fillsoft" />
            <text x="580" y="49" className="mono" textAnchor="middle">releases/v1</text>
            <rect x="480" y="112" width="200" height="40" rx="4" className="ln fillsoft" />
            <text x="580" y="137" className="mono" textAnchor="middle">releases/v2</text>
            <text x="10" y="186" className="mono mut" textAnchor="start">ln -sfn releases/v2 current</text>
            <text x="10" y="206" className="pt mut" textAnchor="start">Publicar e voltar atrás são o mesmo gesto: reapontar o link. Nada é copiado.</text>
            <text x="10" y="206" className="en mut" textAnchor="start">Releasing and rolling back are the same gesture: repoint the link. Nothing is copied.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`$ mkdir -p app/releases/v1 app/releases/v2
$ echo v1 > app/releases/v1/version.txt ; echo v2 > app/releases/v2/version.txt
$ ln -s releases/v1 app/current
$ ls -l app
lrwxrwxrwx 1 ana ana   11 out 26 23:13 current -> releases/v1
drwxrwxr-x 4 ana ana 4096 out 26 23:13 releases
$ cat app/current/version.txt
v1
$ ln -sfn releases/v2 app/current        # publicar a v2
$ cat app/current/version.txt
v2
$ readlink -f app/current
/home/ana/app/releases/v2`} />
        <p><T pt={<>As três letras de <code>-sfn</code> importam: <code>-s</code> simbólico, <code>-f</code> (<i>force</i>) substitui um link que já existe e <code>-n</code> (<i>no-dereference</i>) trata um link para diretório como o próprio link, e não como a pasta para onde ele aponta.</>} en={<>The three letters in <code>-sfn</code> matter: <code>-s</code> symbolic, <code>-f</code> (<i>force</i>) replaces a link that already exists and <code>-n</code> (<i>no-dereference</i>) treats a link to a directory as the link itself, not as the folder it points to.</>} /></p>
        <h3><T pt="Caminho relativo ou absoluto" en="Relative or absolute path" /></h3>
        <p><T pt={<>O texto guardado pode ser <b>absoluto</b> (<code>/home/ana/dados</code>) ou <b>relativo</b> (<code>../dados</code>). O relativo é resolvido a partir da <b>pasta onde o link está</b>, não de onde você está no terminal. Resultado prático: se você move a pasta inteira (projeto, backup), links relativos <i>dentro dela</i> continuam certos; links absolutos continuam apontando para o lugar antigo. Já se você move só o link para outra pasta, é o relativo que quebra.</>} en={<>The stored text can be <b>absolute</b> (<code>/home/ana/data</code>) or <b>relative</b> (<code>../data</code>). A relative one is resolved from <b>the folder the link lives in</b>, not from where you are in the terminal. Practical result: if you move a whole folder (project, backup), relative links <i>inside it</i> stay correct; absolute links keep pointing at the old place. If you move only the link to another folder, it is the relative one that breaks.</>} /></p>
        <CodeBlock code={`$ ln -s ../hard.txt p/sub/rel          # relativo: "um nível acima de p/sub"
$ ln -s /home/ana/p/hard.txt p/sub/abs # absoluto
$ mv p/sub x/sub                       # mudei a pasta de lugar
$ cat x/sub/rel
cat: x/sub/rel: No such file or directory   # "../hard.txt" agora é x/hard.txt
$ cat x/sub/abs
hi                                          # o absoluto ainda acha o arquivo`} />
        <p><T pt={<>Regra prática: use <b>relativo</b> para links dentro do mesmo projeto (releases, repositório) e <b>absoluto</b> para apontar para um lugar fixo do sistema (<code>/mnt/hd/Videos</code>, <code>/etc/...</code>).</>} en={<>Rule of thumb: use <b>relative</b> for links inside the same project (releases, repository) and <b>absolute</b> to point to a fixed place on the system (<code>/mnt/hd/Videos</code>, <code>/etc/...</code>).</>} /></p>
        <h3><T pt="Armadilhas" en="Pitfalls" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Recriar sem <code>-n</code> cria o link no lugar errado.</em> Se <code>current</code> já aponta para uma pasta e você roda <code>ln -s releases/v1 app/current</code>, o <code>ln</code> entende que <code>current</code> é a pasta e cria um link <i>dentro</i> da versão ativa: <code>app/releases/v2/v1 -&gt; releases/v1</code>. Sem erro e sem trocar nada. Por isso o hábito é <code>ln -sfn</code>.</>} en={<><em>Recreating without <code>-n</code> puts the link in the wrong place.</em> If <code>current</code> already points to a folder and you run <code>ln -s releases/v1 app/current</code>, <code>ln</code> treats <code>current</code> as the folder and creates a link <i>inside</i> the active version: <code>app/releases/v2/v1 -&gt; releases/v1</code>. No error and nothing swapped. That is why the habit is <code>ln -sfn</code>.</>} /></li>
          <li><T pt={<><em>Apagar o link não apaga o alvo.</em> <code>rm app/current</code> remove só o link (o <code>releases</code> continua). Cuidado com a barra final: <code>rm app/current/</code> falha com “Is a directory” e, com <code>-r</code>, o <code>rm</code> não consegue remover o link e ainda reclama; escreva o nome <b>sem</b> a barra.</>} en={<><em>Deleting the link does not delete the target.</em> <code>rm app/current</code> removes only the link (<code>releases</code> stays). Watch the trailing slash: <code>rm app/current/</code> fails with “Is a directory” and, with <code>-r</code>, <code>rm</code> cannot remove the link and still complains; write the name <b>without</b> the slash.</>} /></li>
          <li><T pt={<><em>Permissões.</em> As permissões do link (<code>lrwxrwxrwx</code>) são sempre abertas e não valem nada; vale a permissão do <b>alvo</b>. Um <code>chmod 700 link</code> altera o alvo, não o link (testado: o alvo ficou <code>-rwx------</code>). Para ver o caminho todo com as permissões de cada pedaço, use <code>namei -l link</code>.</>} en={<><em>Permissions.</em> A link’s permissions (<code>lrwxrwxrwx</code>) are always wide open and mean nothing; the <b>target’s</b> permission is what counts. A <code>chmod 700 link</code> changes the target, not the link (tested: the target became <code>-rwx------</code>). To see the whole path with each part’s permissions, use <code>namei -l link</code>.</>} /></li>
          <li><T pt={<><em>Copiar e compactar.</em> <code>cp -r</code> copia links <i>como links</i> (o texto vai junto, e pode quebrar no destino). <code>cp -rL</code> segue os links e copia o conteúdo para onde eles apontam, e na pasta copiada <code>current</code> vira uma pasta de verdade, ocupando espaço.</>} en={<><em>Copying and archiving.</em> <code>cp -r</code> copies links <i>as links</i> (the text goes along, and may break at the destination). <code>cp -rL</code> follows links and copies the content they point to, and in the copied folder <code>current</code> becomes a real folder, taking space.</>} /></li>
          <li><T pt={<><em>Segurança.</em> Um atacante com acesso a uma pasta compartilhada como <code>/tmp</code> pode criar um symlink com o nome que um programa privilegiado vai abrir, e fazê-lo escrever em outro arquivo (ataque de <i>symlink</i>, CWE-59). O kernel mitiga isso com <code>fs.protected_symlinks</code> (veja com <code>sysctl fs.protected_symlinks</code>; vale <code>1</code> nas distribuições comuns). Programas que rodam como root devem criar arquivos temporários com <code>mktemp</code>, e não com nomes previsíveis.</>} en={<><em>Security.</em> An attacker with access to a shared folder such as <code>/tmp</code> can create a symlink named like a file a privileged program will open, and make it write to another file (a <i>symlink</i> attack, CWE-59). The kernel mitigates this with <code>fs.protected_symlinks</code> (check with <code>sysctl fs.protected_symlinks</code>; it is <code>1</code> on common distributions). Programs running as root should create temporary files with <code>mktemp</code>, not with predictable names.</>} /></li>
        </ul>
        <Callout tone="use" icon="check"><T pt={<><b>Para guardar:</b> <code>ln -s ALVO LINK</code> (alvo primeiro), <code>ls -l</code> e <code>readlink -f</code> para ver, <code>ln -sfn</code> para trocar, <code>find . -xtype l</code> para achar links quebrados, e <code>rm LINK</code> (sem barra) para remover só o link.</>} en={<><b>To remember:</b> <code>ln -s TARGET LINK</code> (target first), <code>ls -l</code> and <code>readlink -f</code> to look, <code>ln -sfn</code> to swap, <code>find . -xtype l</code> to find broken links, and <code>rm LINK</code> (no slash) to remove only the link.</>} /></Callout>
      </Section>
      <Section id="commands" title={<T pt="Comandos do dia a dia" en="Everyday commands" />}>
        <p><T pt={<>Todo comando segue o mesmo molde: <code>comando [opções] [argumentos]</code>. As opções curtas (<code>-l</code>) podem ser juntadas (<code>-la</code>); as longas usam dois traços (<code>--all</code>). Quando em dúvida, <code>man comando</code>, <code>comando --help</code> ou <code>tldr comando</code> (exemplos curtos).</>} en={<>Every command follows the same mould: <code>command [options] [arguments]</code>. Short options (<code>-l</code>) can be combined (<code>-la</code>); long ones use two dashes (<code>--all</code>). When in doubt, <code>man command</code>, <code>command --help</code> or <code>tldr command</code> (short examples).</>} /></p>
        <h3><T pt="Navegar e olhar" en="Move around and look" /></h3>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="Faz" en="Does" />]}
          rows={[
            [<code>pwd</code>, <T pt="mostra onde você está" en="shows where you are" />],
            [<code>ls -lah</code>, <T pt={<>lista com detalhes (<code>l</code>), ocultos (<code>a</code>) e tamanhos legíveis (<code>h</code>)</>} en={<>lists with details (<code>l</code>), hidden files (<code>a</code>) and human sizes (<code>h</code>)</>} />],
            [<><code>cd /etc</code> · <code>cd ..</code> · <code>cd ~</code> · <code>cd -</code></>, <T pt="entra · sobe · vai ao home · volta ao anterior" en="enter · up · go home · back to the previous" />],
            [<code>tree -L 2</code>, <T pt={<>árvore até 2 níveis (pacote <code>tree</code>)</>} en={<>tree two levels deep (package <code>tree</code>)</>} />],
            [<><code>cat</code> · <code>less</code> · <code>head -n 20</code> · <code>tail -f</code></>, <T pt="ver tudo · paginar · primeiras linhas · seguir um log ao vivo" en="view all · page through · first lines · follow a log live" />],
            [<><code>file x</code> · <code>stat x</code> · <code>du -sh x</code></>, <T pt="tipo · detalhes · tamanho" en="type · details · size" />],
          ]}
        />
        <h3><T pt="Criar, copiar, mover e remover" en="Create, copy, move and remove" /></h3>
        <CodeBlock code={`mkdir projeto                  # cria pasta
mkdir -p a/b/c                 # cria o caminho inteiro (-p = parents)
touch notas.txt                # cria arquivo vazio (ou atualiza a data)
echo "oi" > notas.txt          # cria/sobrescreve com conteúdo
echo "mais" >> notas.txt       # acrescenta ao fim

cp origem destino              # copia arquivo
cp -r pasta/ copia/            # copia pasta (-r = recursivo)
mv antigo novo                 # renomeia OU move (mesmo comando)
mv *.log /tmp/                 # move vários

rm arquivo                     # remove (NÃO vai para a lixeira!)
rm -r pasta/                   # remove pasta e conteúdo
rm -i arquivo                  # pergunta antes
rmdir pasta_vazia              # só remove se estiver vazia`} />
        <Callout tone="warn" icon="alert"><T pt={<>Não existe “desfazer” no <code>rm</code>. Nunca rode <code>rm -rf</code> com variável não conferida (<code>rm -rf "$DIR/"</code> com <code>DIR</code> vazio vira <code>rm -rf /</code>). Em dúvida, liste primeiro com <code>ls</code> usando exatamente o mesmo padrão, ou instale <code>trash-cli</code> e use <code>trash arquivo</code>.</>} en={<>There is no “undo” for <code>rm</code>. Never run <code>rm -rf</code> with an unchecked variable (<code>rm -rf "$DIR/"</code> with an empty <code>DIR</code> becomes <code>rm -rf /</code>). When in doubt, list first with <code>ls</code> using exactly the same pattern, or install <code>trash-cli</code> and use <code>trash file</code>.</>} /></Callout>
        <h3><T pt="Buscar e processar texto" en="Search and process text" /></h3>
        <CodeBlock code={`find /var/log -name "*.log" -mtime -1     # logs alterados nas últimas 24 h
find . -type f -size +100M                # arquivos grandes
find . -user ana -perm -o+w               # de ana e graváveis por todos
grep -rn "erro" /var/log/ 2>/dev/null     # procura texto (-r recursivo, -n linha)
grep -i -E "fail|denied" auth.log         # sem diferenciar maiúsculas, regex
locate nome                               # busca rápida num índice (updatedb)
which python3 ; type cd                   # onde está / o que é um comando

sort | uniq -c | sort -rn | head          # o trio clássico: contar e ranquear
wc -l arquivo                             # conta linhas
cut -d: -f1 /etc/passwd                   # só o 1º campo (nomes de usuário)
awk '{print $1}' access.log               # 1ª coluna
sed -i 's/foo/bar/g' arquivo              # troca texto no arquivo`} />
        <h3><T pt="Pipes e redirecionamento" en="Pipes and redirection" /></h3>
        <p><T pt={<>O poder do shell está em ligar programas pequenos. O <code>|</code> (pipe) liga a saída de um à entrada do outro. Cada processo nasce com três canais: 0 = entrada padrão (<em>stdin</em>), 1 = saída padrão (<em>stdout</em>), 2 = erros (<em>stderr</em>).</>} en={<>The shell’s power lies in connecting small programs. The <code>|</code> (pipe) connects one’s output to another’s input. Each process is born with three channels: 0 = standard input (<em>stdin</em>), 1 = standard output (<em>stdout</em>), 2 = errors (<em>stderr</em>).</>} /></p>
        <Table
          head={[<T pt="Operador" en="Operator" />, <T pt="Significa" en="Means" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<code>&gt;</code>, <T pt="stdout para arquivo (sobrescreve)" en="stdout to file (overwrites)" />, <code>ls &gt; lista.txt</code>],
            [<code>&gt;&gt;</code>, <T pt="stdout para arquivo (acrescenta)" en="stdout to file (appends)" />, <code>date &gt;&gt; log.txt</code>],
            [<code>2&gt;</code>, <T pt="só os erros" en="errors only" />, <code>find / 2&gt;/dev/null</code>],
            [<code>&amp;&gt;</code>, <T pt="stdout e stderr juntos" en="stdout and stderr together" />, <code>make &amp;&gt; build.log</code>],
            [<code>&lt;</code>, <T pt="arquivo como stdin" en="file as stdin" />, <code>sort &lt; nomes.txt</code>],
            [<code>|</code>, <T pt="saída de um vira entrada do outro" en="one’s output becomes the other’s input" />, <code>ps aux | grep ssh</code>],
            [<><code>&amp;&amp;</code> · <code>||</code> · <code>;</code></>, <T pt="só se deu certo · só se deu errado · sempre" en="only if it worked · only if it failed · always" />, <code>mkdir x &amp;&amp; cd x</code>],
            [<code>sudo tee</code>, <T pt="escrever em arquivo de root a partir de um pipe" en="write to a root-owned file from a pipe" />, <code>echo a | sudo tee /etc/x</code>],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Pegadinha: <code>sudo echo a &gt; /etc/x</code> falha, porque o <em>redirecionamento é feito pelo seu shell</em>, que não é root; o sudo só vale para o <code>echo</code>. Use <code>echo a | sudo tee /etc/x</code>.</>} en={<>Trap: <code>sudo echo a &gt; /etc/x</code> fails, because the <em>redirection is done by your shell</em>, which is not root; sudo only applies to <code>echo</code>. Use <code>echo a | sudo tee /etc/x</code>.</>} /></Callout>
        <h3><T pt="Instalar, atualizar e gerenciar serviços" en="Install, update and manage services" /></h3>
        <Table
          head={[<T pt="Tarefa" en="Task" />, <T pt="Debian / Ubuntu" en="Debian / Ubuntu" />, <T pt="Fedora / RHEL" en="Fedora / RHEL" />, <T pt="Arch" en="Arch" />]}
          rows={[
            [<T pt="Atualizar índice" en="Refresh index" />, <code>apt update</code>, <code>dnf check-update</code>, <code>pacman -Sy</code>],
            [<T pt="Atualizar tudo" en="Upgrade all" />, <code>apt upgrade</code>, <code>dnf upgrade</code>, <code>pacman -Syu</code>],
            [<T pt="Instalar" en="Install" />, <code>apt install htop</code>, <code>dnf install htop</code>, <code>pacman -S htop</code>],
            [<T pt="Remover" en="Remove" />, <code>apt remove htop</code>, <code>dnf remove htop</code>, <code>pacman -R htop</code>],
            [<T pt="Buscar" en="Search" />, <code>apt search x</code>, <code>dnf search x</code>, <code>pacman -Ss x</code>],
          ]}
        />
        <CodeBlock code={`systemctl status ssh           # estado de um serviço (o nome pode ser sshd no Fedora)
sudo systemctl start|stop|restart ssh
sudo systemctl enable --now ssh    # liga no boot E agora
systemctl --failed             # o que falhou
journalctl -u ssh -f           # log do serviço ao vivo
journalctl -p err -b           # só erros desde o último boot`} />
      </Section>
      <Section id="processes" title={<T pt="Processos, pais e filhos" en="Processes, parents and children" />}>
        <p><T pt={<>Um <em>programa</em> é um arquivo no disco; um <em>processo</em> é esse programa em execução, com seu <em>PID</em> (identificador), seu <em>PPID</em> (PID do pai), um dono (UID), memória própria, diretório atual e descritores de arquivos abertos. Em Linux todo processo tem um pai. A árvore começa no PID 1 (hoje, quase sempre o <code>systemd</code>), que o kernel inicia no boot.</>} en={<>A <em>program</em> is a file on disk; a <em>process</em> is that program running, with its <em>PID</em> (identifier), its <em>PPID</em> (parent’s PID), an owner (UID), its own memory, a current directory and open file descriptors. In Linux every process has a parent. The tree starts at PID 1 (today almost always <code>systemd</code>), which the kernel launches at boot.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>Uma sessão SSH vista como árvore: o <code>systemd</code> iniciou o <code>sshd</code>, que criou um processo para ana, que criou o <code>bash</code>, que criou <code>vim</code> e <code>ls</code>. Veja a sua com <code>pstree -p</code>.</>} en={<>An SSH session seen as a tree: <code>systemd</code> started <code>sshd</code>, which created a process for ana, which created <code>bash</code>, which created <code>vim</code> and <code>ls</code>. See yours with <code>pstree -p</code>.</>} />}>
          <svg viewBox="0 0 640 248" role="img" aria-label="Árvore de processos / Process tree">
            <rect x="10" y="90" width="130" height="50" rx="4" className="ln fillsoft" />
            <text x="75.0" y="112.0" className="" textAnchor="middle">systemd</text>
            <text x="75.0" y="128.0" className="mut mono" textAnchor="middle">PID 1</text>
            <rect x="190" y="20" width="130" height="50" rx="4" className="ln" />
            <text x="255.0" y="42.0" className="" textAnchor="middle">sshd</text>
            <text x="255.0" y="58.0" className="mut mono" textAnchor="middle">PID 842 · :22</text>
            <rect x="190" y="160" width="130" height="50" rx="4" className="ln" />
            <text x="255.0" y="182.0" className="" textAnchor="middle">cron</text>
            <text x="255.0" y="198.0" className="mut mono" textAnchor="middle">PID 901</text>
            <rect x="370" y="20" width="130" height="50" rx="4" className="ln" />
            <text x="435.0" y="42.0" className="" textAnchor="middle">sshd: ana</text>
            <text x="435.0" y="58.0" className="mut mono" textAnchor="middle">PID 2210</text>
            <rect x="540" y="20" width="90" height="50" rx="4" className="ln" />
            <text x="585.0" y="42.0" className="" textAnchor="middle">bash</text>
            <text x="585.0" y="58.0" className="mut mono" textAnchor="middle">PID 2215</text>
            <rect x="560" y="100" width="70" height="50" rx="4" className="ln" />
            <text x="595.0" y="122.0" className="" textAnchor="middle">vim</text>
            <text x="595.0" y="138.0" className="mut mono" textAnchor="middle">PID 2301</text>
            <rect x="560" y="180" width="70" height="50" rx="4" className="ln" />
            <text x="595.0" y="202.0" className="" textAnchor="middle">ls</text>
            <text x="595.0" y="218.0" className="mut mono" textAnchor="middle">PID 2320</text>
            <path d="M140 105L190 50" className="ln" />
            <path d="M187.7 57.7L190 50L182.6 53.0" className="ln" />
            <path d="M140 125L190 185" className="ln" />
            <path d="M182.7 181.7L190 185L188.1 177.2" className="ln" />
            <path d="M320 45L370 45" className="ln" />
            <path d="M362.8 48.5L370 45L362.8 41.5" className="ln" />
            <path d="M500 45L540 45" className="ln" />
            <path d="M532.8 48.5L540 45L532.8 41.5" className="ln" />
            <path d="M545 70L545 205" className="ln" />
            <path d="M545 125L560 125" className="ln" />
            <path d="M552.8 128.5L560 125L552.8 121.5" className="ln" />
            <path d="M545 205L560 205" className="ln" />
            <path d="M552.8 208.5L560 205L552.8 201.5" className="ln" />
            <text x="10" y="215" className="pt mut">seta = “criou” (fork)</text>
            <text x="10" y="215" className="en mut">arrow = “created” (fork)</text>
            <text x="10" y="240" className="pt mut">Se o pai morre antes do filho, o filho é “adotado” pelo PID 1 (órfão).</text>
            <text x="10" y="240" className="en mut">If the parent dies before the child, the child is “adopted” by PID 1 (orphan).</text>
          </svg>
        </Diagram>
        <h3><T pt="Como um processo nasce: fork, exec e wait" en="How a process is born: fork, exec and wait" /></h3>
        <p><T pt={<>Linux cria processos em duas etapas (Kerrisk, cap. 24–27). <code>fork()</code> <em>clona</em> o processo atual: nasce um filho idêntico, com PID novo. Em seguida o filho chama <code>exec()</code>, que <em>troca o programa</em> dentro dele (o PID continua). O pai chama <code>wait()</code> para esperar o filho terminar e ler o código de saída. É exatamente isso que o bash faz quando você digita <code>ls</code>.</>} en={<>Linux creates processes in two steps (Kerrisk, ch. 24–27). <code>fork()</code> <em>clones</em> the current process: an identical child is born with a new PID. Then the child calls <code>exec()</code>, which <em>swaps the program</em> inside it (the PID stays). The parent calls <code>wait()</code> to wait for the child to finish and read its exit code. This is exactly what bash does when you type <code>ls</code>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt={<>A dança fork → exec → exit → wait. Sem o <code>wait()</code> do pai, o filho terminado vira zumbi.</>} en={<>The fork → exec → exit → wait dance. Without the parent’s <code>wait()</code>, the finished child becomes a zombie.</>} />}>
          <svg viewBox="0 0 700 254" role="img" aria-label="fork exec wait">
            <rect x="70" y="8" width="160" height="34" rx="4" className="ln fillsoft" />
            <text x="150.0" y="29.0" className="pt" textAnchor="middle">bash (pai)</text>
            <text x="150.0" y="29.0" className="en" textAnchor="middle">bash (parent)</text>
            <rect x="400" y="8" width="190" height="34" rx="4" className="ln fillsoft" />
            <text x="495.0" y="29.0" className="pt" textAnchor="middle">filho</text>
            <text x="495.0" y="29.0" className="en" textAnchor="middle">child</text>
            <path d="M150 42L150 230" className="ln" />
            <path d="M495 100L495 230" className="ln" />
            <path d="M150 100L495 100" className="ln" />
            <path d="M487.8 103.5L495 100L487.8 96.5" className="ln" />
            <text x="322" y="92" className="mono" textAnchor="middle">fork()</text>
            <text x="505" y="94" className="pt mut">PID novo, cópia do pai</text>
            <text x="505" y="94" className="en mut">new PID, copy of parent</text>
            <rect x="440" y="128" width="110" height="28" rx="4" className="ln" />
            <text x="495" y="147" className="mono" textAnchor="middle">exec("ls")</text>
            <text x="505" y="176" className="pt mut">agora roda o ls</text>
            <text x="505" y="176" className="en mut">now runs ls</text>
            <rect x="170" y="112" width="150" height="74" rx="4" className="ln dash" />
            <text x="245" y="146" className="mono" textAnchor="middle">wait()</text>
            <text x="245" y="166" className="pt mut" textAnchor="middle">pai dorme esperando</text>
            <text x="245" y="166" className="en mut" textAnchor="middle">parent sleeps, waiting</text>
            <path d="M495 210L150 214" className="ln" />
            <path d="M157.2 210.4L150 214L157.2 217.4" className="ln" />
            <text x="322" y="205" className="mono" textAnchor="middle">exit(0) → SIGCHLD</text>
            <text x="322" y="242" className="pt mut" textAnchor="middle">o pai lê o código de saída ($?) e o kernel libera o filho</text>
            <text x="322" y="242" className="en mut" textAnchor="middle">the parent reads the exit code ($?) and the kernel frees the child</text>
          </svg>
        </Diagram>
        <CodeBlock code={`// fork_exec.c — gcc fork_exec.c -o fork_exec
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();                       // clona o processo
    if (pid == -1) { perror("fork"); exit(1); }

    if (pid == 0) {                           // aqui roda o FILHO
        execlp("ls", "ls", "-l", (char *)NULL);
        perror("execlp");                     // só chega aqui se o exec falhar
        _exit(127);
    }

    int status;                               // aqui roda o PAI
    waitpid(pid, &status, 0);                 // espera e "colhe" o filho
    printf("pai %d: filho %d saiu com %d\\n", getpid(), pid, WEXITSTATUS(status));
    return 0;
}`} />
        <h3><T pt="Estados de um processo" en="Process states" /></h3>
        <Diagram minWidth={560} caption={<T pt={<>O ciclo de vida. A coluna <code>STAT</code> do <code>ps</code> mostra a letra de cada estado.</>} en={<>The lifecycle. The <code>STAT</code> column of <code>ps</code> shows each state’s letter.</>} />}>
          <svg viewBox="0 0 640 248" role="img" aria-label="Estados de processo / Process states">
            <rect x="10" y="20" width="100" height="40" rx="4" className="ln" />
            <text x="60.0" y="44.0" className="pt" textAnchor="middle">novo</text>
            <text x="60.0" y="44.0" className="en" textAnchor="middle">new</text>
            <rect x="160" y="20" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="215.0" y="44.0" className="pt" textAnchor="middle">pronto (R)</text>
            <text x="215.0" y="44.0" className="en" textAnchor="middle">ready (R)</text>
            <rect x="340" y="20" width="130" height="40" rx="4" className="ln fillsoft" />
            <text x="405.0" y="44.0" className="pt" textAnchor="middle">executando (R)</text>
            <text x="405.0" y="44.0" className="en" textAnchor="middle">running (R)</text>
            <rect x="340" y="120" width="130" height="40" rx="4" className="ln fillsoft" />
            <text x="405.0" y="144.0" className="pt" textAnchor="middle">dormindo (S/D)</text>
            <text x="405.0" y="144.0" className="en" textAnchor="middle">sleeping (S/D)</text>
            <rect x="520" y="120" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="575.0" y="144.0" className="pt" textAnchor="middle">parado (T)</text>
            <text x="575.0" y="144.0" className="en" textAnchor="middle">stopped (T)</text>
            <rect x="520" y="20" width="110" height="40" rx="4" className="ln" />
            <text x="575.0" y="44.0" className="pt" textAnchor="middle">zumbi (Z)</text>
            <text x="575.0" y="44.0" className="en" textAnchor="middle">zombie (Z)</text>
            <path d="M110 40L160 40" className="ln" />
            <path d="M152.8 43.5L160 40L152.8 36.5" className="ln" />
            <text x="135" y="32" className="mono" textAnchor="middle">fork</text>
            <path d="M270 34L340 34" className="ln" />
            <path d="M332.8 37.5L340 34L332.8 30.5" className="ln" />
            <path d="M340 48L270 48" className="ln" />
            <path d="M277.2 44.5L270 48L277.2 51.5" className="ln" />
            <text x="305" y="24" className="mut" textAnchor="middle">CPU</text>
            <path d="M420 60L420 120" className="ln" />
            <path d="M416.5 112.8L420 120L423.5 112.8" className="ln" />
            <text x="412" y="94" className="pt mut" textAnchor="end">espera I/O</text>
            <text x="412" y="94" className="en mut" textAnchor="end">waits for I/O</text>
            <path d="M350 120L250 60" className="ln" />
            <path d="M258.0 60.7L250 60L254.4 66.7" className="ln" />
            <text x="318" y="112" className="pt mut" textAnchor="end">evento chegou</text>
            <text x="318" y="112" className="en mut" textAnchor="end">event arrived</text>
            <path d="M450 60L540 120" className="ln" />
            <path d="M532.1 118.9L540 120L535.9 113.1" className="ln" />
            <text x="520" y="96" className="mut">Ctrl+Z</text>
            <path d="M470 40L520 40" className="ln" />
            <path d="M512.8 43.5L520 40L512.8 36.5" className="ln" />
            <text x="495" y="32" className="mono" textAnchor="middle">exit</text>
            <text x="10" y="196" className="pt mut">zumbi: já terminou, mas o pai ainda não chamou wait(); só ocupa uma linha na tabela de processos.</text>
            <text x="10" y="196" className="en mut">zombie: already finished, but the parent has not called wait() yet; it only takes a row in the process table.</text>
            <text x="10" y="216" className="pt mut">D = sono ininterruptível (esperando disco/rede); nem kill -9 mata até o I/O voltar.</text>
            <text x="10" y="216" className="en mut">D = uninterruptible sleep (waiting on disk/network); not even kill -9 works until the I/O returns.</text>
            <text x="10" y="236" className="pt mut">SIGCONT (fg/bg) tira do estado parado.</text>
            <text x="10" y="236" className="en mut">SIGCONT (fg/bg) takes it out of the stopped state.</text>
          </svg>
        </Diagram>
        <h3><T pt="Sinais: como falar com um processo" en="Signals: how to talk to a process" /></h3>
        <Table
          head={[<T pt="Sinal" en="Signal" />, <T pt="Nº" en="No." />, <T pt="Quando" en="When" />, <T pt="Pode ser tratado?" en="Can be handled?" />]}
          rows={[
            [<code>SIGINT</code>, "2", <T pt={<><code>Ctrl+C</code>: “interrompa”</>} en={<><code>Ctrl+C</code>: “interrupt”</>} />, <T pt="sim" en="yes" />],
            [<code>SIGTERM</code>, "15", <T pt={<><code>kill PID</code> (padrão): “termine com educação”</>} en={<><code>kill PID</code> (default): “please terminate”</>} />, <T pt="sim (permite limpar)" en="yes (allows cleanup)" />],
            [<code>SIGKILL</code>, "9", <T pt={<><code>kill -9</code>: o kernel mata na hora</>} en={<><code>kill -9</code>: the kernel kills at once</>} />, <T pt={<><em>não</em></>} en={<><em>no</em></>} />],
            [<code>SIGHUP</code>, "1", <T pt="terminal fechou; muitos daemons recarregam a configuração" en="terminal closed; many daemons reload configuration" />, <T pt="sim" en="yes" />],
            [<><code>SIGSTOP</code> / <code>SIGCONT</code></>, "19 / 18", <T pt={<>pausar / continuar (<code>Ctrl+Z</code> usa SIGTSTP)</>} en={<>pause / continue (<code>Ctrl+Z</code> uses SIGTSTP)</>} />, <T pt="STOP não" en="STOP no" />],
          ]}
        />
        <CodeBlock code={`ps aux                          # todos os processos (user, PID, %CPU, %MEM, comando)
ps -eo pid,ppid,stat,user,cmd   # escolha as colunas: veja o PPID e o STAT
ps -ef --forest                 # a árvore em texto
pstree -p                       # a árvore, com PIDs
pgrep -a ssh                    # PIDs pelo nome
top        # ou htop / btop: ao vivo (q sai; k mata; M ordena por memória)

echo $$ ; echo $PPID            # PID do seu shell e do pai dele
bash -c 'echo eu=$$ pai=$PPID'  # um filho: o pai dele é o seu shell
cat /proc/$$/status | head      # o kernel descreve o processo como arquivo

kill 2301                       # SIGTERM (educado)
kill -9 2301                    # SIGKILL (último recurso)
kill -STOP 2301 ; kill -CONT 2301
pkill -f "python app.py"        # por padrão no comando
killall firefox                 # por nome

sleep 300 &                     # & = em segundo plano
jobs ; fg %1 ; bg %1            # lista; traz à frente; manda ao fundo
nohup ./job.sh &                # sobrevive ao fechar o terminal
nice -n 10 ./pesado.sh          # prioridade menor (-20 a 19; menor número = mais prioridade)
renice 5 -p 2301`} />
        <Callout icon="check"><T pt={<>Como lidar com um zumbi: ele já está morto, então <code>kill</code> não adianta. Descubra o pai (<code>ps -o ppid= -p PID</code>) e conserte ou reinicie <em>o pai</em>; quando o pai morre, o PID 1 adota e colhe os zumbis. Alguns zumbis passageiros são normais; milhares indicam um bug no pai.</>} en={<>How to handle a zombie: it is already dead, so <code>kill</code> is useless. Find the parent (<code>ps -o ppid= -p PID</code>) and fix or restart <em>the parent</em>; when the parent dies, PID 1 adopts and reaps the zombies. A few passing zombies are normal; thousands point to a bug in the parent.</>} /></Callout>
        <p><T pt={<><strong>Load average</strong> (<code>uptime</code>, <code>top</code>) mostra a média de processos prontos para rodar ou esperando disco em 1, 5 e 15 minutos. Compare com o número de CPUs (<code>nproc</code>): em 4 CPUs, load 4 é “cheio” e 12 é sobrecarga.</>} en={<><strong>Load average</strong> (<code>uptime</code>, <code>top</code>) shows the average number of processes ready to run or waiting for disk over 1, 5 and 15 minutes. Compare it with the number of CPUs (<code>nproc</code>): on 4 CPUs, load 4 is “full” and 12 is overload.</>} /></p>
      </Section>
      <Section id="network" title={<T pt="Redes: ver, entender e interagir" en="Networking: see, understand and interact" />}>
        <p><T pt={<>Para a rede, o Linux usa a pilha TCP/IP no kernel. Quem fala com ela são os <em>sockets</em> (Kerrisk, cap. 56–61): um programa pede ao kernel um socket, liga-o a um IP e uma <em>porta</em> e passa a enviar e receber bytes. Uma conexão é identificada por quatro valores: IP e porta de origem, IP e porta de destino.</>} en={<>For networking, Linux uses the TCP/IP stack inside the kernel. Programs talk to it through <em>sockets</em> (Kerrisk, ch. 56–61): a program asks the kernel for a socket, binds it to an IP and a <em>port</em>, and sends and receives bytes. A connection is identified by four values: source IP and port, destination IP and port.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="As quatro camadas do TCP/IP e a ferramenta certa para cada uma. Diagnostique de baixo para cima: cabo/Wi-Fi, IP, rota, DNS, porta, aplicação." en="The four TCP/IP layers and the right tool for each. Troubleshoot bottom-up: cable/Wi-Fi, IP, route, DNS, port, application." />}>
          <svg viewBox="0 0 660 288" role="img" aria-label="Camadas de rede / Network layers">
            <text x="20" y="20" className="pt mut" textAnchor="start">camada</text>
            <text x="20" y="20" className="en mut" textAnchor="start">layer</text>
            <text x="160" y="20" className="pt mut" textAnchor="start">protocolos</text>
            <text x="160" y="20" className="en mut" textAnchor="start">protocols</text>
            <text x="400" y="20" className="pt mut" textAnchor="start">ferramentas para ver e interagir</text>
            <text x="400" y="20" className="en mut" textAnchor="start">tools to inspect and interact</text>
            <rect x="10" y="32" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="75" y="60" className="pt" textAnchor="middle">Aplicação</text>
            <text x="75" y="60" className="en" textAnchor="middle">Application</text>
            <rect x="150" y="32" width="230" height="46" rx="4" className="ln" />
            <text x="160" y="60" className="mono" textAnchor="start">HTTP · SSH · DNS · SMTP</text>
            <rect x="390" y="32" width="260" height="46" rx="4" className="ln" />
            <text x="400" y="60" className="mono" textAnchor="start">curl · ssh · dig · wget</text>
            <rect x="10" y="88" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="75" y="116" className="pt" textAnchor="middle">Transporte</text>
            <text x="75" y="116" className="en" textAnchor="middle">Transport</text>
            <rect x="150" y="88" width="230" height="46" rx="4" className="ln" />
            <text x="160" y="116" className="pt mono" textAnchor="start">TCP · UDP · portas</text>
            <text x="160" y="116" className="en mono" textAnchor="start">TCP · UDP · ports</text>
            <rect x="390" y="88" width="260" height="46" rx="4" className="ln" />
            <text x="400" y="116" className="mono" textAnchor="start">ss · nc · nmap · lsof -i</text>
            <rect x="10" y="144" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="75" y="172" className="" textAnchor="middle">Internet</text>
            <rect x="150" y="144" width="230" height="46" rx="4" className="ln" />
            <text x="160" y="172" className="pt mono" textAnchor="start">IP · ICMP · rotas</text>
            <text x="160" y="172" className="en mono" textAnchor="start">IP · ICMP · routes</text>
            <rect x="390" y="144" width="260" height="46" rx="4" className="ln" />
            <text x="400" y="172" className="mono" textAnchor="start">ip addr · ip route · ping · mtr</text>
            <rect x="10" y="200" width="130" height="46" rx="4" className="ln fillsoft" />
            <text x="75" y="228" className="pt" textAnchor="middle">Enlace</text>
            <text x="75" y="228" className="en" textAnchor="middle">Link</text>
            <rect x="150" y="200" width="230" height="46" rx="4" className="ln" />
            <text x="160" y="228" className="mono" textAnchor="start">Ethernet · Wi-Fi · MAC · ARP</text>
            <rect x="390" y="200" width="260" height="46" rx="4" className="ln" />
            <text x="400" y="228" className="mono" textAnchor="start">ip link · ip neigh · iw · ethtool</text>
            <text x="10" y="276" className="pt mut" textAnchor="start">tcpdump e Wireshark capturam pacotes de todas as camadas ao mesmo tempo.</text>
            <text x="10" y="276" className="en mut" textAnchor="start">tcpdump and Wireshark capture packets of all layers at once.</text>
          </svg>
        </Diagram>
        <h3><T pt="Ver o que existe: interfaces, rotas e DNS" en="See what exists: interfaces, routes and DNS" /></h3>
        <CodeBlock code={`ip -br addr                     # interfaces e IPs, uma linha cada (-br = brief)
ip route                        # tabela de rotas; "default via X" é o seu gateway
ip neigh                        # vizinhos na LAN (tabela ARP): quem está na minha rede
ip -s link                      # contadores de pacotes e erros por interface
nmcli device status             # estado (NetworkManager); nmtui = menu em texto
resolvectl status               # servidores DNS em uso (systemd-resolved)
cat /etc/hosts                  # nomes locais fixos`} />
        <h3><T pt="Ver o que está acontecendo: conexões e portas" en="See what is happening: connections and ports" /></h3>
        <CodeBlock code={`ss -tulpn                       # QUEM ESTÁ ESCUTANDO: t=TCP u=UDP l=listen p=processo n=numérico
ss -tn state established        # conexões ativas agora
ss -tnp dst :443                # conexões saindo para a porta 443, com o processo
sudo lsof -i :8080              # que processo usa a porta 8080
sudo tcpdump -i any -n port 53  # pacotes DNS ao vivo (Ctrl+C para parar)
sudo tcpdump -i eth0 -w captura.pcap   # salva para abrir no Wireshark
sudo nethogs                    # banda por PROCESSO (apt install nethogs)
sudo iftop                      # banda por conexão`} />
        <p><T pt={<>Como ler <code>ss -tulpn</code>: a coluna <em>Local Address</em> é a chave. <code>0.0.0.0:22</code> ou <code>*:22</code> = aceita de qualquer lugar; <code>127.0.0.1:5432</code> = só deste computador (seguro); <code>[::]:80</code> = o mesmo, mas em IPv6. Cada linha com endereço público é uma porta que um atacante pode tentar.</>} en={<>How to read <code>ss -tulpn</code>: the <em>Local Address</em> column is the key. <code>0.0.0.0:22</code> or <code>*:22</code> = accepts from anywhere; <code>127.0.0.1:5432</code> = this computer only (safe); <code>[::]:80</code> = the same, but over IPv6. Every line with a public address is a port an attacker may try.</>} /></p>
        <h3><T pt="Interagir: testar, resolver nomes e falar HTTP" en="Interact: test, resolve names and speak HTTP" /></h3>
        <CodeBlock code={`ping -c 4 1.1.1.1               # chega? (testa IP, sem DNS)
ping -c 4 example.com           # se o IP funciona e este não, o problema é DNS
mtr example.com                 # traceroute + ping contínuo (apt install mtr-tiny)
traceroute example.com          # por quais roteadores o pacote passa

dig example.com +short          # resolve nome → IP
dig MX example.com              # registros de e-mail
curl -I https://example.com     # só os cabeçalhos HTTP
curl -v https://example.com     # tudo, inclusive o handshake TLS
curl -s https://api.exemplo.dev/health | jq .

nc -zv servidor 22              # a porta 22 está aberta? (z = só testa)
nc -l 9000                      # abre um "servidor" simples na porta 9000`} />
        <h3><T pt="Um roteiro de diagnóstico" en="A troubleshooting script" /></h3>
        <ol className="ds-steps">
          <li><T pt={<><code>ip -br addr</code>: a interface está <code>UP</code> e tem IP? Se não, o problema é cabo, Wi-Fi ou DHCP.</>} en={<><code>ip -br addr</code>: is the interface <code>UP</code> and does it have an IP? If not, it is the cable, Wi-Fi or DHCP.</>} /></li>
          <li><T pt={<><code>ip route</code> e <code>ping &lt;gateway&gt;</code>: você alcança o roteador?</>} en={<><code>ip route</code> and <code>ping &lt;gateway&gt;</code>: can you reach the router?</>} /></li>
          <li><T pt={<><code>ping 1.1.1.1</code>: sai para a internet?</>} en={<><code>ping 1.1.1.1</code>: does it reach the internet?</>} /></li>
          <li><T pt={<><code>dig example.com</code>: o nome resolve? Se o passo 3 funciona e este não, é DNS.</>} en={<><code>dig example.com</code>: does the name resolve? If step 3 works and this does not, it is DNS.</>} /></li>
          <li><T pt={<><code>nc -zv host porta</code>: a porta responde? Se não, firewall ou serviço parado.</>} en={<><code>nc -zv host port</code>: does the port answer? If not, firewall or stopped service.</>} /></li>
          <li><T pt={<><code>curl -v</code> e os logs do serviço (<code>journalctl -u</code>): a aplicação responde direito?</>} en={<><code>curl -v</code> and the service logs (<code>journalctl -u</code>): does the application answer properly?</>} /></li>
        </ol>
      </Section>
      <Section id="ssh" title={<T pt="SSH: entrar, acompanhar e proteger" en="SSH: log in, watch and protect" />}>
        <p><T pt={<>O <em>SSH</em> abre um terminal remoto cifrado (porta 22). É a porta de entrada de quase todo servidor Linux, então vale entender como funciona e como acompanhá-lo. O servidor prova quem é com uma <em>chave de host</em>; você prova quem é com senha ou, melhor, com um <em>par de chaves</em>: a privada nunca sai da sua máquina, a pública vai para o servidor.</>} en={<><em>SSH</em> opens an encrypted remote terminal (port 22). It is the front door of almost every Linux server, so it is worth understanding how it works and how to watch it. The server proves who it is with a <em>host key</em>; you prove who you are with a password or, better, a <em>key pair</em>: the private key never leaves your machine, the public one goes to the server.</>} /></p>
        <Diagram minWidth={600} caption={<T pt={<>Os arquivos de cada lado. Na primeira conexão o cliente pergunta se confia na chave do host e a grava em <code>known_hosts</code>; se ela mudar depois, o SSH avisa (pode ser ataque).</>} en={<>The files on each side. On first connection the client asks whether to trust the host key and stores it in <code>known_hosts</code>; if it changes later, SSH warns you (it may be an attack).</>} />}>
          <svg viewBox="0 0 700 212" role="img" aria-label="Como o SSH funciona / How SSH works">
            <rect x="10" y="10" width="250" height="190" rx="4" className="ln fillsoft" />
            <text x="135" y="32" className="pt" textAnchor="middle">Cliente (seu PC)</text>
            <text x="135" y="32" className="en" textAnchor="middle">Client (your PC)</text>
            <text x="24" y="62" className="mono">~/.ssh/id_ed25519</text>
            <text x="24" y="80" className="pt mut">sua chave PRIVADA (600)</text>
            <text x="24" y="80" className="en mut">your PRIVATE key (600)</text>
            <text x="24" y="108" className="mono">~/.ssh/known_hosts</text>
            <text x="24" y="126" className="pt mut">chaves de servidores já vistos</text>
            <text x="24" y="126" className="en mut">keys of servers already seen</text>
            <text x="24" y="154" className="mono">~/.ssh/config</text>
            <text x="24" y="172" className="pt mut">apelidos: “ssh meuserver”</text>
            <text x="24" y="172" className="en mut">aliases: “ssh myserver”</text>
            <rect x="440" y="10" width="250" height="190" rx="4" className="ln fillsoft" />
            <text x="565" y="32" className="pt" textAnchor="middle">Servidor</text>
            <text x="565" y="32" className="en" textAnchor="middle">Server</text>
            <text x="454" y="62" className="mono">/etc/ssh/sshd_config</text>
            <text x="454" y="80" className="pt mut">regras do servidor</text>
            <text x="454" y="80" className="en mut">server rules</text>
            <text x="454" y="108" className="mono">~/.ssh/authorized_keys</text>
            <text x="454" y="126" className="pt mut">chaves PÚBLICAS aceitas</text>
            <text x="454" y="126" className="en mut">accepted PUBLIC keys</text>
            <text x="454" y="154" className="mono">/etc/ssh/ssh_host_*_key</text>
            <text x="454" y="172" className="pt mut">identidade do servidor</text>
            <text x="454" y="172" className="en mut">server identity</text>
            <text x="350" y="52" className="mono" textAnchor="middle">TCP :22</text>
            <text x="350" y="82" className="pt mut" textAnchor="middle">1 chave do host</text>
            <text x="350" y="82" className="en mut" textAnchor="middle">1 host key</text>
            <text x="350" y="122" className="pt mut" textAnchor="middle">2 prova (assina)</text>
            <text x="350" y="122" className="en mut" textAnchor="middle">2 proof (signs)</text>
            <text x="350" y="150" className="pt mut" textAnchor="middle">3 canal cifrado</text>
            <text x="350" y="150" className="en mut" textAnchor="middle">3 encrypted channel</text>
            <path d="M260 60L440 60" className="ln" />
            <path d="M433.2 56.7L440 60L433.2 63.3" className="ln" />
            <path d="M440 90L260 90" className="ln" />
            <path d="M266.8 93.3L260 90L266.8 86.7" className="ln" />
            <path d="M260 130L440 130" className="ln" />
            <path d="M433.2 126.7L440 130L433.2 133.3" className="ln" />
          </svg>
        </Diagram>
        <CodeBlock code={`ssh-keygen -t ed25519 -C "ana@notebook"   # cria o par de chaves (defina uma passphrase)
ssh-copy-id ana@servidor                  # instala a pública no servidor
ssh ana@servidor                          # entra
ssh -v ana@servidor                       # diagnóstico: mostra cada etapa
ssh ana@servidor 'df -h'                  # roda um comando e sai
scp arquivo ana@servidor:/tmp/            # copia por SSH
rsync -avz --progress pasta/ ana@servidor:/backup/   # sincroniza (só o que mudou)
ssh -L 5432:localhost:5432 ana@servidor   # túnel: seu :5432 vira o banco do servidor
ssh -J bastion ana@interno                # salta por um bastion host`} />
        <CodeBlock code={`# ~/.ssh/config  ->  depois basta: ssh meuserver
Host meuserver
    HostName 203.0.113.10
    User ana
    IdentityFile ~/.ssh/id_ed25519`} />
        <h3><T pt="Quem está conectado e o que aconteceu" en="Who is connected and what happened" /></h3>
        <CodeBlock code={`who ; w                          # quem está logado agora e o que está executando
last -n 20                       # últimos logins
sudo lastb -n 20                 # tentativas de login que FALHARAM
ss -tnp state established '( sport = :22 )'   # sessões SSH abertas
sudo journalctl -u ssh --since "1 hour ago"   # log do sshd (Fedora: -u sshd)
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head`} />
        <h3><T pt="Endurecer o servidor SSH" en="Hardening the SSH server" /></h3>
        <p><T pt={<>Crie um arquivo em <code>/etc/ssh/sshd_config.d/</code> (ou edite o <code>sshd_config</code>). Comentários ficam em linhas próprias.</>} en={<>Create a file in <code>/etc/ssh/sshd_config.d/</code> (or edit <code>sshd_config</code>). Comments go on their own lines.</>} /></p>
        <CodeBlock code={`# /etc/ssh/sshd_config.d/10-hardening.conf
# ninguém entra direto como root
PermitRootLogin no
# só chaves (copie a sua ANTES de ligar isto!)
PasswordAuthentication no
PubkeyAuthentication yes
# lista branca de usuários
AllowUsers ana bia
MaxAuthTries 3`} />
        <CodeBlock code={`sudo sshd -t                     # valida a sintaxe ANTES de aplicar
sudo systemctl reload ssh        # aplica sem derrubar as sessões atuais (Fedora: sshd)`} />
        <Callout tone="warn" icon="alert"><T pt={<>Antes de desligar a senha, abra <em>uma segunda sessão</em> e confirme que entra com a chave. Se errar numa máquina remota, você se tranca para fora. O <code>fail2ban</code> complementa: bane por alguns minutos os IPs que erram muitas vezes.</>} en={<>Before turning the password off, open <em>a second session</em> and confirm the key works. If you get it wrong on a remote machine, you lock yourself out. <code>fail2ban</code> complements this: it bans IPs that fail too many times for a few minutes.</>} /></Callout>
      </Section>
      <Section id="firewall" title={<T pt="Firewall: filtrar o que entra" en="Firewall: filtering what comes in" />}>
        <p><T pt={<>Um <em>firewall</em> é um porteiro: olha cada pacote e decide deixar passar, descartar ou recusar. No Linux quem filtra é o <em>netfilter</em>, dentro do kernel. O que você usa são “controles” para ele: <code>nftables</code> (o moderno), <code>iptables</code> (o antigo, hoje muitas vezes um tradutor para nftables), e frentes simples como <code>ufw</code> (Ubuntu/Debian) e <code>firewalld</code> (Fedora/RHEL).</>} en={<>A <em>firewall</em> is a doorman: it looks at each packet and decides to let it through, drop it or reject it. In Linux the filtering is done by <em>netfilter</em>, inside the kernel. What you use are “controls” for it: <code>nftables</code> (the modern one), <code>iptables</code> (the old one, today often a translator to nftables), and simple front ends such as <code>ufw</code> (Ubuntu/Debian) and <code>firewalld</code> (Fedora/RHEL).</>} /></p>
        <Diagram minWidth={640} caption={<T pt={<>O caminho de um pacote pelos ganchos do netfilter. A regra mais importante de um computador pessoal está no <code>INPUT</code>: o que entra sem ter sido pedido.</>} en={<>A packet’s path through the netfilter hooks. The most important rule on a personal computer is in <code>INPUT</code>: what comes in without having been asked for.</>} />}>
          <svg viewBox="0 0 700 266" role="img" aria-label="Fluxo do netfilter / netfilter flow">
            <rect x="10" y="120" width="80" height="40" rx="4" className="ln fillsoft" />
            <text x="50.0" y="144.0" className="pt" textAnchor="middle">pacote entra</text>
            <text x="50.0" y="144.0" className="en" textAnchor="middle">packet in</text>
            <rect x="110" y="120" width="110" height="40" rx="4" className="ln" />
            <text x="165.0" y="144.0" className="mono" textAnchor="middle">PREROUTING</text>
            <rect x="250" y="120" width="90" height="40" rx="4" className="ln" />
            <text x="295.0" y="144.0" className="pt" textAnchor="middle">rota?</text>
            <text x="295.0" y="144.0" className="en" textAnchor="middle">route?</text>
            <rect x="380" y="120" width="100" height="40" rx="4" className="ln" />
            <text x="430.0" y="144.0" className="mono" textAnchor="middle">FORWARD</text>
            <rect x="540" y="120" width="130" height="40" rx="4" className="ln" />
            <text x="605.0" y="144.0" className="mono" textAnchor="middle">POSTROUTING</text>
            <rect x="250" y="210" width="100" height="40" rx="4" className="ln" />
            <text x="300.0" y="234.0" className="mono" textAnchor="middle">INPUT</text>
            <rect x="390" y="210" width="100" height="40" rx="4" className="ln fillsoft" />
            <text x="440.0" y="234.0" className="pt" textAnchor="middle">processo local</text>
            <text x="440.0" y="234.0" className="en" textAnchor="middle">local process</text>
            <rect x="540" y="210" width="130" height="40" rx="4" className="ln" />
            <text x="605.0" y="234.0" className="mono" textAnchor="middle">OUTPUT</text>
            <path d="M90 140L110 140" className="ln" />
            <path d="M102.8 143.5L110 140L102.8 136.5" className="ln" />
            <path d="M220 140L250 140" className="ln" />
            <path d="M242.8 143.5L250 140L242.8 136.5" className="ln" />
            <path d="M340 140L380 140" className="ln" />
            <path d="M372.8 143.5L380 140L372.8 136.5" className="ln" />
            <path d="M480 140L540 140" className="ln" />
            <path d="M532.8 143.5L540 140L532.8 136.5" className="ln" />
            <path d="M295 160L295 210" className="ln" />
            <path d="M291.5 202.8L295 210L298.5 202.8" className="ln" />
            <path d="M350 230L390 230" className="ln" />
            <path d="M382.8 233.5L390 230L382.8 226.5" className="ln" />
            <path d="M490 230L540 230" className="ln" />
            <path d="M532.8 233.5L540 230L532.8 226.5" className="ln" />
            <path d="M605 210L605 160" className="ln" />
            <path d="M608.5 167.2L605 160L601.5 167.2" className="ln" />
            <path d="M605 120L605 80" className="ln" />
            <path d="M608.5 87.2L605 80L601.5 87.2" className="ln" />
            <text x="615" y="98" className="pt mut">sai</text>
            <text x="615" y="98" className="en mut">out</text>
            <text x="300" y="188" className="pt mut">é para mim</text>
            <text x="300" y="188" className="en mut">for me</text>
            <text x="410" y="112" className="pt mut">só passando (roteador)</text>
            <text x="410" y="112" className="en mut">just passing (router)</text>
            <text x="10" y="30" className="pt mut">Cada gancho tem regras: ACCEPT (passa), DROP (descarta calado), REJECT (recusa avisando).</text>
            <text x="10" y="30" className="en mut">Each hook has rules: ACCEPT (let through), DROP (discard silently), REJECT (refuse with notice).</text>
            <text x="10" y="50" className="pt mut">Um PC comum usa quase só INPUT e OUTPUT; FORWARD é de roteadores e hosts de contêineres.</text>
            <text x="10" y="50" className="en mut">An ordinary PC mostly uses INPUT and OUTPUT; FORWARD is for routers and container hosts.</text>
          </svg>
        </Diagram>
        <h3><T pt="A política certa: negar por padrão" en="The right policy: deny by default" /></h3>
        <p><T pt={<>A ideia de ouro: <em>bloqueie tudo que entra, libere só o necessário</em>. O que sai continua livre, e as respostas a conexões que <em>você</em> iniciou entram sozinhas (o firewall é <em>stateful</em>: lembra das conexões).</>} en={<>The golden idea: <em>block everything coming in, allow only what is needed</em>. Outgoing traffic stays free, and replies to connections <em>you</em> started come in on their own (the firewall is <em>stateful</em>: it remembers connections).</>} /></p>
        <CodeBlock code={`# ufw (Ubuntu/Debian): o caminho mais simples
sudo ufw status verbose                  # está ativo? quais regras?
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp                    # LIBERE O SSH ANTES de ativar, se for remoto!
sudo ufw allow from 192.168.1.0/24 to any port 9090 proto tcp   # só a sua LAN
sudo ufw limit ssh                       # permite, mas freia força bruta
sudo ufw enable
sudo ufw status numbered ; sudo ufw delete 3   # listar e apagar uma regra

# firewalld (Fedora/RHEL)
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload`} />
        <CodeBlock code={`# /etc/nftables.conf
table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;
    ct state established,related accept   # respostas ao que EU pedi
    ct state invalid drop
    iif "lo" accept                       # tráfego interno da máquina
    ip protocol icmp accept               # ping
    ip6 nexthdr icmpv6 accept
    tcp dport 22 accept                   # SSH
  }
  chain forward { type filter hook forward priority 0; policy drop; }
  chain output  { type filter hook output  priority 0; policy accept; }
}`} />
        <CodeBlock code={`sudo nft -f /etc/nftables.conf            # aplica o arquivo
sudo nft list ruleset                     # ver tudo o que está valendo
sudo systemctl enable --now nftables      # carrega no boot`} />
        <Callout tone="warn" icon="alert"><T pt={<>Docker e ufw: o Docker mexe direto nas regras do netfilter, e portas publicadas com <code>-p 8080:80</code> podem ficar abertas ao mundo <em>mesmo com o ufw negando</em>. Publique só em localhost (<code>-p 127.0.0.1:8080:80</code>) ou trate o assunto na cadeia <code>DOCKER-USER</code>.</>} en={<>Docker and ufw: Docker edits the netfilter rules directly, and ports published with <code>-p 8080:80</code> can be open to the world <em>even when ufw denies them</em>. Publish only on localhost (<code>-p 127.0.0.1:8080:80</code>) or handle it in the <code>DOCKER-USER</code> chain.</>} /></Callout>
      </Section>
      <Section id="hardening" title={<T pt="Proteger o computador e como saber" en="Protecting the computer and how to know" />}>
        <p><T pt={<>Firewall é uma camada, não a defesa inteira. Segurança é <em>defesa em profundidade</em>: se uma camada falha, a próxima segura. A ordem prática é: reduzir o que está exposto, atualizar, limitar quem entra, vigiar e ter cópia de segurança.</>} en={<>A firewall is one layer, not the whole defence. Security is <em>defence in depth</em>: if one layer fails, the next holds. The practical order is: reduce what is exposed, update, limit who gets in, watch, and keep backups.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Defesa em profundidade, de fora para dentro. O atacante precisa vencer todas as camadas; você só precisa que uma segure." en="Defence in depth, from the outside in. The attacker must beat every layer; you only need one to hold." />}>
          <svg viewBox="0 0 700 270" role="img" aria-label="Defesa em profundidade / Defence in depth">
            <rect x="10" y="10" width="680" height="250" rx="4" className="ln" />
            <text x="24" y="30" className="pt" textAnchor="start">Rede</text>
            <text x="24" y="30" className="en" textAnchor="start">Network</text>
            <text x="24" y="48" className="pt mut" textAnchor="start">firewall · só portas necessárias · Wi-Fi/roteador seguros</text>
            <text x="24" y="48" className="en mut" textAnchor="start">firewall · only needed ports · secure Wi-Fi/router</text>
            <rect x="40" y="64" width="620" height="196" rx="4" className="ln" />
            <text x="54" y="84" className="pt" textAnchor="start">Sistema</text>
            <text x="54" y="84" className="en" textAnchor="start">System</text>
            <text x="54" y="102" className="pt mut" textAnchor="start">atualizações · usuários e sudo · SSH só com chave · fail2ban</text>
            <text x="54" y="102" className="en mut" textAnchor="start">updates · users and sudo · key-only SSH · fail2ban</text>
            <rect x="70" y="118" width="560" height="142" rx="4" className="ln" />
            <text x="84" y="138" className="pt" textAnchor="start">Serviços</text>
            <text x="84" y="138" className="en" textAnchor="start">Services</text>
            <text x="84" y="156" className="pt mut" textAnchor="start">desligue o que não usa · ss -tulpn · sem root em serviços</text>
            <text x="84" y="156" className="en mut" textAnchor="start">turn off what you do not use · ss -tulpn · no root services</text>
            <rect x="100" y="172" width="500" height="88" rx="4" className="ln" />
            <text x="114" y="192" className="pt" textAnchor="start">Dados</text>
            <text x="114" y="192" className="en" textAnchor="start">Data</text>
            <text x="114" y="210" className="pt mut" textAnchor="start">backup 3-2-1 · disco cifrado (LUKS) · permissões justas</text>
            <text x="114" y="210" className="en mut" textAnchor="start">3-2-1 backup · encrypted disk (LUKS) · tight permissions</text>
          </svg>
        </Diagram>
        <h3><T pt="Como saber se o seu computador está protegido" en="How to know whether your computer is protected" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Comando" en="Command" />, <T pt="Resultado saudável" en="Healthy result" />]}
          rows={[
            [<T pt="O que está escutando?" en="What is listening?" />, <code>ss -tulpn</code>, <T pt={<>só o que você reconhece; o resto em <code>127.0.0.1</code></>} en={<>only what you recognise; the rest on <code>127.0.0.1</code></>} />],
            [<T pt="O firewall está ativo?" en="Is the firewall on?" />, <><code>sudo ufw status verbose</code> · <code>sudo nft list ruleset</code></>, <T pt={<><em>Status: active</em>, política <em>deny (incoming)</em></>} en={<><em>Status: active</em>, policy <em>deny (incoming)</em></>} />],
            [<T pt="Como me veem de fora?" en="How do others see me?" />, <><code>nmap -sV IP-DA-MAQUINA</code> (de OUTRO computador seu)</>, <T pt="só as portas que você liberou" en="only the ports you opened" />],
            [<T pt="Há atualizações pendentes?" en="Any pending updates?" />, <><code>apt list --upgradable</code> · <code>dnf check-update</code></>, <T pt="vazio, ou só itens recentes" en="empty, or only recent items" />],
            [<T pt="Alguém tentou entrar?" en="Did anyone try to get in?" />, <><code>sudo lastb | head</code> · <code>journalctl -u ssh -p warning</code></>, <T pt={<>poucas falhas; sem sucesso desconhecido em <code>last</code></>} en={<>few failures; no unknown success in <code>last</code></>} />],
            [<T pt="Quem tem poder de root?" en="Who has root power?" />, <><code>getent group sudo</code> · <code>awk -F: '$3==0' /etc/passwd</code></>, <T pt={<>só quem deveria; só <code>root</code> com UID 0</>} en={<>only who should; only <code>root</code> with UID 0</>} />],
            [<T pt="Há contas sem senha?" en="Any accounts without a password?" />, <code>sudo awk -F: '$2==""' /etc/shadow</code>, <T pt="sem saída" en="no output" />],
            [<T pt="Existe uma auditoria pronta?" en="Is there a ready-made audit?" />, <code>sudo lynis audit system</code>, <T pt="lista de avisos e sugestões, com nota final" en="list of warnings and suggestions with a final score" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Só rode <code>nmap</code>, varreduras e testes de força bruta em máquinas e redes <em>suas</em> ou com autorização por escrito. Varrer redes alheias pode ser crime e costuma violar os termos de provedores.</>} en={<>Only run <code>nmap</code>, scans and brute-force tests on machines and networks that are <em>yours</em> or with written authorisation. Scanning other people’s networks can be a crime and usually breaks provider terms.</>} /></Callout>
        <h3><T pt="Lista de verificação mínima" en="Minimum checklist" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Atualizações automáticas de segurança ligadas (<code>unattended-upgrades</code> no Debian/Ubuntu, <code>dnf-automatic</code> no Fedora).</>} en={<>Automatic security updates on (<code>unattended-upgrades</code> on Debian/Ubuntu, <code>dnf-automatic</code> on Fedora).</>} /></li>
          <li><T pt="Firewall com política de negar entrada por padrão." en="Firewall with a deny-incoming default policy." /></li>
          <li><T pt={<>Uso diário com usuário comum; <code>sudo</code> só quando preciso. Nunca navegar como root.</>} en={<>Daily use with a regular user; <code>sudo</code> only when needed. Never browse as root.</>} /></li>
          <li><T pt={<>SSH (se existir) só com chave, sem login de root, com <code>fail2ban</code>.</>} en={<>SSH (if it exists) key-only, no root login, with <code>fail2ban</code>.</>} /></li>
          <li><T pt={<>Serviços desnecessários desligados: <code>systemctl disable --now nome</code>.</>} en={<>Unneeded services turned off: <code>systemctl disable --now name</code>.</>} /></li>
          <li><T pt="Senhas fortes e únicas em um gerenciador; disco cifrado (LUKS) em notebooks." en="Strong, unique passwords in a manager; encrypted disk (LUKS) on laptops." /></li>
          <li><T pt={<>Backup 3-2-1 (3 cópias, 2 mídias, 1 fora do local) e <em>teste de restauração</em>.</>} en={<>3-2-1 backup (3 copies, 2 media, 1 off-site) and a <em>restore test</em>.</>} /></li>
          <li><T pt={<>Instalar software só de repositórios oficiais ou fontes verificadas; ler antes de rodar <code>curl … | sh</code>.</>} en={<>Install software only from official repositories or verified sources; read before running <code>curl … | sh</code>.</>} /></li>
        </ol>
      </Section>
      <Section id="tools" title={<T pt="Ferramentas visuais: TUI e web" en="Visual tools: TUI and web" />}>
        <p><T pt={<>Você não precisa decorar tudo: existem interfaces de terminal (TUI) e web que mostram saúde do sistema, logs, SSH, Git e contêineres de forma visual. As “lazy” (<em>lazygit</em>, <em>lazydocker</em>…) seguem a ideia de resumir dezenas de comandos em atalhos de teclado. Todas abaixo são projetos abertos conhecidos; confira a página oficial do projeto para a forma de instalação mais atual da sua distribuição.</>} en={<>You do not need to memorise everything: there are terminal (TUI) and web interfaces that show system health, logs, SSH, Git and containers visually. The “lazy” ones (<em>lazygit</em>, <em>lazydocker</em>…) follow the idea of folding dozens of commands into keyboard shortcuts. All of the below are well-known open projects; check the project’s official page for the most current install method for your distribution.</>} /></p>
        <h3><T pt="No terminal (TUI)" en="In the terminal (TUI)" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Para quê" en="What for" />, <T pt="Instalar" en="Install" />]}
          rows={[
            [<><code>btop</code> · <code>htop</code> · <code>glances</code></>, <T pt="saúde do sistema: CPU, memória, disco, rede e processos num painel ao vivo" en="system health: CPU, memory, disk, network and processes in a live panel" />, <code>sudo apt install btop htop glances</code>],
            [<code>ncdu</code>, <T pt="“quem está comendo meu disco?”, navegando por pastas por tamanho" en="“what is eating my disk?”, browsing folders by size" />, <code>sudo apt install ncdu</code>],
            [<code>lazygit</code>, <T pt="Git inteiro com atalhos: stage, commit, branch, rebase" en="all of Git with shortcuts: stage, commit, branch, rebase" />, <T pt="gerenciador de pacotes, Homebrew ou binário do GitHub" en="package manager, Homebrew or GitHub binary" />],
            [<code>lazydocker</code>, <T pt="contêineres, imagens, logs e uso de recursos do Docker" en="Docker containers, images, logs and resource use" />, <T pt={<>Homebrew, <code>go install</code> ou binário do GitHub</>} en={<>Homebrew, <code>go install</code> or GitHub binary</>} />],
            [<code>lazyjournal</code>, <T pt={<>navegar pelos logs do <code>journalctl</code> e de contêineres com filtro</>} en={<>browse <code>journalctl</code> and container logs with filtering</>} />, <T pt="binário do GitHub ou Homebrew" en="GitHub binary or Homebrew" />],
            [<code>sshs</code>, <T pt={<>menu para escolher hosts do seu <code>~/.ssh/config</code> e conectar</>} en={<>menu to pick hosts from your <code>~/.ssh/config</code> and connect</>} />, <T pt={<>Homebrew, <code>cargo install</code> ou binário</>} en={<>Homebrew, <code>cargo install</code> or binary</>} />],
            [<><code>bandwhich</code> · <code>nethogs</code> · <code>iftop</code></>, <T pt="quem usa a rede: por processo, conexão e host remoto" en="who is using the network: by process, connection and remote host" />, <code>sudo apt install nethogs iftop</code>],
            [<><code>trippy</code> · <code>mtr</code> · <code>gping</code></>, <T pt="traceroute e ping contínuos, com gráfico" en="continuous traceroute and ping, with a graph" />, <T pt={<><code>sudo apt install mtr-tiny</code> (mtr); os outros pelo site do projeto</>} en={<><code>sudo apt install mtr-tiny</code> (mtr); the others from the project site</>} />],
            [<code>termshark</code>, <T pt="o Wireshark no terminal" en="Wireshark in the terminal" />, <T pt={<><code>sudo apt install termshark</code> (se disponível) ou binário</>} en={<><code>sudo apt install termshark</code> (if available) or binary</>} />],
            [<><code>nmtui</code> · <code>yazi</code> · <code>ranger</code> · <code>fzf</code> · <code>tldr</code></>, <T pt="rede por menu · navegador de arquivos · busca difusa · exemplos curtos de comandos" en="network via menu · file browser · fuzzy search · short command examples" />, <T pt="repositório da distribuição" en="distribution repository" />],
          ]}
        />
        <h3><T pt="Pelo navegador (web)" en="In the browser (web)" /></h3>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="O que mostra" en="What it shows" />, <T pt="Como subir" en="How to start" />]}
          rows={[
            [<strong>Cockpit</strong>, <T pt={<>painel oficial da Red Hat: saúde, logs, serviços, discos, rede, usuários, firewall e <em>terminal</em>. Boa porta de entrada para ver SSH e o sistema sem decorar comandos</>} en={<>the Red Hat project’s panel: health, logs, services, disks, network, users, firewall and a <em>terminal</em>. A good entry point for watching SSH and the system without memorising commands</>} />, <><code>sudo apt install cockpit &amp;&amp; sudo systemctl enable --now cockpit.socket</code> → <code>https://IP:9090</code></>],
            [<strong>Netdata</strong>, <T pt="milhares de métricas em tempo real, com alertas" en="thousands of real-time metrics with alerts" />, <T pt="script oficial de instalação ou pacote; porta 19999. Leia o script antes de executar." en="official install script or package; port 19999. Read the script before running it." />],
            [<><strong>Glances</strong> (modo web)</>, <T pt="o mesmo painel do glances, no navegador" en="the same glances panel, in the browser" />, <><code>glances -w</code> → porta 61208</>],
            [<strong>Grafana + Prometheus</strong>, <T pt={<>histórico e painéis para vários servidores (com <code>node_exporter</code> em cada um)</>} en={<>history and dashboards for several servers (with <code>node_exporter</code> on each)</>} />, <T pt="padrão de mercado; mais trabalho para montar" en="industry standard; more work to set up" />],
            [<strong>Uptime Kuma</strong>, <T pt="“o site/serviço está no ar?”, com avisos" en="“is the site/service up?”, with notifications" />, <T pt="contêiner Docker" en="Docker container" />],
            [<strong>Portainer</strong>, <T pt="gerenciar Docker pela web" en="manage Docker from the web" />, <T pt="contêiner Docker" en="Docker container" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Todo painel web é uma porta nova aberta, com poder de administração. Exponha só na sua LAN ou via túnel SSH/VPN (<code>ssh -L 9090:localhost:9090 ana@servidor</code>), com senha forte e, se possível, um segundo fator. Nunca na internet aberta.</>} en={<>Every web panel is a new open port with admin power. Expose it only on your LAN or through an SSH tunnel/VPN (<code>ssh -L 9090:localhost:9090 ana@server</code>), with a strong password and, if possible, a second factor. Never on the open internet.</>} /></Callout>
        <h3><T pt="Painel de saúde com comandos puros" en="A health panel using plain commands" /></h3>
        <CodeBlock code={`uptime                          # há quanto tempo está ligado e o load average
free -h                         # memória (olhe "available", não "free")
df -h                           # discos cheios?
lsblk                           # discos e partições
vmstat 1 5                      # CPU, memória, swap e I/O a cada 1 s
iostat -x 1 3                   # utilização de disco (pacote sysstat)
systemctl --failed              # serviços que falharam
journalctl -p err -b            # erros desde o boot
sudo dmesg -T | tail            # mensagens recentes do kernel (disco, USB, memória)
sensors                         # temperaturas (lm-sensors)
sudo smartctl -H /dev/sda       # saúde do disco (smartmontools)
lscpu ; lspci ; lsusb           # inventário de hardware
uname -r ; cat /etc/os-release  # versão do kernel e da distribuição`} />
      </Section>
      <Section id="history" title={<T pt="Limpar o histórico do terminal" en="Clearing the terminal history" />}>
        <p><T pt={<>O shell guarda os comandos que você digita para poder repeti-los (seta para cima, <code>Ctrl+R</code>). No bash a lista fica na memória durante a sessão e é gravada em <code>~/.bash_history</code> quando você sai. Por isso uma senha digitada na linha de comando <em>fica gravada em texto puro</em>.</>} en={<>The shell keeps the commands you type so you can repeat them (up arrow, <code>Ctrl+R</code>). In bash the list stays in memory during the session and is written to <code>~/.bash_history</code> when you exit. That is why a password typed on the command line <em>stays stored in plain text</em>.</>} /></p>
        <CodeBlock code={`history | tail -20              # veja os últimos
history -d 482                  # apaga UMA entrada (pelo número)
history -c                      # limpa a lista em MEMÓRIA
history -w                      # grava a memória no arquivo -> junto com -c, zera o arquivo
history -c && history -w        # zerar tudo de uma vez
> ~/.bash_history               # alternativa: esvazia o arquivo direto`} />
        <p><T pt={<>Um detalhe que pega muita gente: <code>history -c</code> sozinho limpa só a memória; ao sair, o bash <em>grava de volta</em> o que ainda estiver no arquivo ou o que você digitar depois. Para uma sessão sem rastro, use um dos modos abaixo.</>} en={<>A detail that catches many people: <code>history -c</code> alone clears only memory; on exit bash <em>writes back</em> what is still in the file or what you type afterwards. For a session without a trace, use one of the modes below.</>} /></p>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faça" en="Do" />, <T pt="Efeito" en="Effect" />]}
          rows={[
            [<T pt="Que esta sessão não seja salva" en="This session not to be saved" />, <><code>unset HISTFILE</code> ou <code>HISTFILE=/dev/null</code></>, <T pt="ao sair, nada é gravado" en="nothing is written on exit" />],
            [<T pt="Parar de registrar daqui para frente" en="Stop recording from now on" />, <><code>set +o history</code> (volta com <code>set -o history</code>)</>, <T pt="os próximos comandos nem entram na lista" en="the next commands do not even enter the list" />],
            [<T pt="Não gravar um comando só" en="Not save one command" />, <T pt={<>começar a linha com um <em>espaço</em> (precisa de <code>HISTCONTROL=ignorespace</code>, padrão no Ubuntu)</>} en={<>start the line with a <em>space</em> (needs <code>HISTCONTROL=ignorespace</code>, the Ubuntu default)</>} />, <T pt="aquela linha é ignorada" en="that line is ignored" />],
            [<T pt="Ignorar padrões para sempre" en="Ignore patterns forever" />, <><code>HISTIGNORE="ls:cd:*senha*"</code> no <code>~/.bashrc</code></>, <T pt="comandos que casam com o padrão não entram" en="commands that match are not stored" />],
            [<T pt="Apagar tudo agora" en="Erase everything now" />, <code>history -c &amp;&amp; history -w</code>, <T pt="memória e arquivo zerados" en="memory and file emptied" />],
            [<T pt="Limitar o tamanho" en="Limit the size" />, <><code>HISTSIZE=1000</code> · <code>HISTFILESIZE=2000</code></>, <T pt="memória e arquivo, respectivamente" en="memory and file, respectively" />],
          ]}
        />
        <h3><T pt="Outros shells e a tela" en="Other shells and the screen" /></h3>
        <CodeBlock code={`# zsh: arquivo ~/.zsh_history
: > ~/.zsh_history ; unset HISTFILE ; exit      # esvazia e não regrava ao sair
setopt HIST_IGNORE_SPACE                         # espaço no começo = não grava

# fish
history clear

# limpar a TELA (não é o histórico!)
clear                           # limpa a tela (e, nos terminais modernos, o rolamento)
clear -x                        # limpa a tela mas mantém o rolamento
Ctrl+L                          # limpa a tela, mantém o rolamento
reset                           # reinicializa o terminal se ele "quebrou"`} />
        <h3><T pt="O histórico também vaza por outros lugares" en="History also leaks elsewhere" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Arquivos de histórico de outros programas: <code>~/.python_history</code>, <code>~/.lesshst</code>, <code>~/.viminfo</code>, <code>~/.mysql_history</code>, <code>~/.psql_history</code>.</>} en={<>Other programs’ history files: <code>~/.python_history</code>, <code>~/.lesshst</code>, <code>~/.viminfo</code>, <code>~/.mysql_history</code>, <code>~/.psql_history</code>.</>} /></li>
          <li><T pt={<>Os logs do sistema: o <code>sudo</code> registra cada comando em <code>/var/log/auth.log</code> ou no journal, e isso <em>não</em> é apagado por limpar o histórico do shell.</>} en={<>System logs: <code>sudo</code> records each command in <code>/var/log/auth.log</code> or the journal, and that is <em>not</em> erased by clearing the shell history.</>} /></li>
          <li><T pt={<>A lista de processos: argumentos de linha de comando aparecem para outros usuários em <code>ps</code> e em <code>/proc/PID/cmdline</code> enquanto o comando roda.</>} en={<>The process list: command-line arguments are visible to other users in <code>ps</code> and <code>/proc/PID/cmdline</code> while the command runs.</>} /></li>
          <li><T pt={<>Ferramentas de histórico sincronizado (como o <code>atuin</code>) guardam cópias fora do arquivo local.</>} en={<>Synced-history tools (such as <code>atuin</code>) keep copies outside the local file.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>Se uma senha, token ou chave de API foi digitada e gravada, <em>limpar o histórico não basta</em>: considere o segredo vazado e <em>troque-o</em>. Para o futuro, não coloque segredos em argumentos: leia sem eco (<code>read -rs SENHA</code>), use variáveis de ambiente, arquivos com permissão 600 ou o gerenciador de segredos.</>} en={<>If a password, token or API key was typed and stored, <em>clearing the history is not enough</em>: treat the secret as leaked and <em>rotate it</em>. For the future, keep secrets out of arguments: read without echo (<code>read -rs SECRET</code>), use environment variables, files with permission 600 or a secrets manager.</>} /></Callout>
        <Callout icon="check"><T pt="Limpar o seu próprio histórico é privacidade e higiene. Apagar rastros em sistemas que não são seus, ou para esconder atividade de quem administra o ambiente, é outra coisa: em empresas o histórico e os logs costumam ser exigência de auditoria." en="Clearing your own history is privacy and hygiene. Erasing traces on systems that are not yours, or to hide activity from whoever administers the environment, is something else: in companies, history and logs are often an audit requirement." /></Callout>
      </Section>
      <Section id="exam" title={<T pt="Questões de prova e revisão" en="Exam questions and review" />}>
        <p><T pt="Estas perguntas cobrem o que costuma cair em Linux Essentials, LPIC-1 e RHCSA. Tente responder antes de ler a resposta abaixo de cada pergunta." en="These questions cover what usually shows up in Linux Essentials, LPIC-1 and RHCSA. Try to answer before reading the answer under each question." /></p>
        <QA items={[
            [<T pt="O que é UID 0 e por que ele importa?" en="What is UID 0 and why does it matter?" />, <T pt="O superusuário. O kernel ignora as checagens de permissão de arquivos para ele. O que manda é o número, não o nome “root”." en="The superuser. The kernel skips file permission checks for it. The number matters, not the name “root”." />],
            [<T pt="Qual arquivo guarda os hashes das senhas e quem lê?" en="Which file stores the password hashes, and who can read it?" />, <T pt={<><code>/etc/shadow</code>; só root (o <code>/etc/passwd</code> é legível por todos e só tem um “x”).</>} en={<><code>/etc/shadow</code>; only root (<code>/etc/passwd</code> is world-readable and only has an “x”).</>} />],
            [<T pt={<>Traduza <code>chmod 640 f</code> e <code>-rwxr-x---</code>.</>} en={<>Translate <code>chmod 640 f</code> and <code>-rwxr-x---</code>.</>} />, <T pt={<>640 = dono rw-, grupo r--, outros ---. E <code>rwxr-x---</code> = 750.</>} en={<>640 = owner rw-, group r--, others ---. And <code>rwxr-x---</code> = 750.</>} />],
            [<T pt={<>Que permissões tem um arquivo novo com <code>umask 027</code>?</>} en={<>What permissions does a new file get with <code>umask 027</code>?</>} />, <T pt="666 − 027 = 640 (diretórios: 777 − 027 = 750)." en="666 − 027 = 640 (directories: 777 − 027 = 750)." />],
            [<T pt={<>Para que serve o bit <em>sticky</em> em <code>/tmp</code>?</>} en={<>What is the <em>sticky</em> bit on <code>/tmp</code> for?</>} />, <T pt="Todos escrevem, mas só o dono do arquivo (ou root) pode apagá-lo ou renomeá-lo." en="Everyone writes, but only the file’s owner (or root) may delete or rename it." />],
            [<T pt={<>Por que o <code>passwd</code> consegue mudar o <code>/etc/shadow</code> se o usuário comum não pode?</>} en={<>How can <code>passwd</code> change <code>/etc/shadow</code> if a regular user cannot?</>} />, <T pt="Ele é setuid root: roda com o UID efetivo do dono do arquivo (root)." en="It is setuid root: it runs with the effective UID of the file’s owner (root)." />],
            [<T pt="Qual a diferença entre hard link e link simbólico?" en="What is the difference between a hard link and a symbolic link?" />, <T pt="Hard link: outro nome para o mesmo inode (não cruza partições). Simbólico: arquivo que guarda um caminho (pode quebrar)." en="Hard link: another name for the same inode (cannot cross partitions). Symbolic: a file that stores a path (can break)." />],
            [<T pt={<>Diferença entre <code>fork()</code> e <code>exec()</code>?</>} en={<>Difference between <code>fork()</code> and <code>exec()</code>?</>} />, <T pt="fork cria um processo novo (cópia); exec troca o programa do processo atual, mantendo o PID." en="fork creates a new process (a copy); exec replaces the current process’s program, keeping the PID." />],
            [<T pt="O que é um processo zumbi e um órfão? Como resolver?" en="What are a zombie and an orphan process? How to fix?" />, <T pt={<>Zumbi: terminou, mas o pai não deu <code>wait()</code>; resolve-se pelo pai. Órfão: o pai morreu antes; o PID 1 o adota.</>} en={<>Zombie: finished, but the parent did not <code>wait()</code>; fix it via the parent. Orphan: the parent died first; PID 1 adopts it.</>} />],
            [<T pt="Qual a diferença entre SIGTERM e SIGKILL?" en="Difference between SIGTERM and SIGKILL?" />, <T pt="SIGTERM (15) pode ser tratado, permitindo limpeza; SIGKILL (9) não pode ser capturado nem ignorado." en="SIGTERM (15) can be handled, allowing cleanup; SIGKILL (9) cannot be caught or ignored." />],
            [<T pt="Onde ficam logs, configurações e dados de usuários?" en="Where do logs, configuration and user data live?" />, <T pt={<><code>/var/log</code>, <code>/etc</code>, <code>/home</code>.</>} en={<><code>/var/log</code>, <code>/etc</code>, <code>/home</code>.</>} />],
            [<T pt="Que comando lista as portas em escuta e o processo dono?" en="Which command lists listening ports and the owning process?" />, <T pt={<><code>sudo ss -tulpn</code> (ou <code>lsof -i</code>); o antigo <code>netstat -tulpn</code> faz o mesmo.</>} en={<><code>sudo ss -tulpn</code> (or <code>lsof -i</code>); the old <code>netstat -tulpn</code> does the same.</>} />],
            [<T pt={<>Se <code>ping 1.1.1.1</code> funciona e <code>ping example.com</code> não, onde está o problema?</>} en={<>If <code>ping 1.1.1.1</code> works and <code>ping example.com</code> does not, where is the problem?</>} />, <T pt="DNS (resolução de nomes), não a conectividade." en="DNS (name resolution), not connectivity." />],
            [<T pt="Qual a política de firewall recomendada para um desktop?" en="What firewall policy is recommended for a desktop?" />, <T pt="Negar entrada por padrão, permitir saída e respostas a conexões já estabelecidas; liberar só as portas necessárias." en="Deny incoming by default, allow outgoing and replies to established connections; open only needed ports." />],
            [<T pt={<><code>usermod -G dev ana</code> ou <code>usermod -aG dev ana</code>?</>} en={<><code>usermod -G dev ana</code> or <code>usermod -aG dev ana</code>?</>} />, <T pt={<>Com <code>-a</code> (acrescenta). Sem ele, os outros grupos suplementares são removidos.</>} en={<>With <code>-a</code> (append). Without it, the other supplementary groups are removed.</>} />],
            [<T pt={<>Por que <code>sudo echo x &gt; /etc/arquivo</code> falha?</>} en={<>Why does <code>sudo echo x &gt; /etc/file</code> fail?</>} />, <T pt={<>O redirecionamento é feito pelo shell do usuário, não pelo sudo. Use <code>| sudo tee</code>.</>} en={<>The redirection is done by the user’s shell, not sudo. Use <code>| sudo tee</code>.</>} />],
            [<T pt={<><code>history -c</code> apaga o arquivo <code>~/.bash_history</code>?</>} en={<>Does <code>history -c</code> erase <code>~/.bash_history</code>?</>} />, <T pt={<>Não; só a memória. Combine com <code>history -w</code> ou esvazie o arquivo.</>} en={<>No; only memory. Combine with <code>history -w</code> or truncate the file.</>} />],
            [<T pt="Qual a diferença entre hard link e link simbólico?" en="What is the difference between a hard link and a symbolic link?" />, <T pt="O hard link é outro nome para o mesmo inode (não cruza partições, não vale para diretórios, sobrevive se o original for apagado). O symlink é um arquivo que guarda um caminho; cruza partições e quebra se o alvo some." en="A hard link is another name for the same inode (cannot cross partitions, not allowed for directories, survives deleting the original). A symlink is a file that stores a path; it can cross partitions and breaks if the target goes away." />],
            [<T pt="Como trocar um symlink que aponta para um diretório, e achar os quebrados?" en="How do you replace a symlink that points to a directory, and find broken ones?" />, <T pt={<><code>ln -sfn novo_alvo link</code> (o <code>-n</code> evita criar o link dentro do diretório). Quebrados: <code>find . -xtype l</code>.</>} en={<><code>ln -sfn new_target link</code> (the <code>-n</code> avoids creating the link inside the directory). Broken ones: <code>find . -xtype l</code>.</>} />],
          ]} />
        <h3><T pt="Mapa de revisão em uma tabela" en="Review map in one table" /></h3>
        <Table
          head={[<T pt="Tema" en="Topic" />, <T pt="Comandos-chave" en="Key commands" />, <T pt="Arquivos-chave" en="Key files" />]}
          rows={[
            [<T pt="Usuários" en="Users" />, <code>id useradd usermod passwd sudo su visudo</code>, <code>/etc/passwd /etc/shadow /etc/group /etc/sudoers</code>],
            [<T pt="Permissões" en="Permissions" />, <code>ls -l chmod chown chgrp umask setfacl find -perm</code>, <T pt="bits rwx, octal, setuid/setgid/sticky" en="rwx bits, octal, setuid/setgid/sticky" />],
            [<T pt="Estrutura" en="Structure" />, <code>ls cd pwd df du lsblk mount ln find</code>, <code>/etc /var /home /proc /dev /tmp /usr</code>],
            [<T pt="Processos" en="Processes" />, <code>ps top pstree kill nice jobs fg bg systemctl</code>, <code>/proc/PID/ journalctl</code>],
            [<T pt="Rede" en="Network" />, <code>ip ss ping dig curl nc tcpdump traceroute</code>, <code>/etc/hosts /etc/resolv.conf</code>],
            [<T pt="Firewall" en="Firewall" />, <code>ufw nft iptables firewall-cmd</code>, <code>/etc/nftables.conf /etc/ufw/</code>],
            [<T pt="SSH" en="SSH" />, <code>ssh ssh-keygen ssh-copy-id scp rsync</code>, <code>~/.ssh/ /etc/ssh/sshd_config</code>],
          ]}
        />
      </Section>
      <Sources
        links={[
          { label: "Linux man-pages. symlink(7): symbolic link handling.", href: "https://man7.org/linux/man-pages/man7/symlink.7.html" },
          { label: "Linux man-pages. ln(1): make links between files.", href: "https://man7.org/linux/man-pages/man1/ln.1.html" },
          { label: "Michael Kerrisk. The Linux Programming Interface. No Starch Press, 2010.", href: "https://nostarch.com/tlpi" },
          { label: "Brian Ward. How Linux Works, 3rd edition. No Starch Press, 2021.", href: "https://nostarch.com/how-linux-works-3rd-edition" },
          { label: "Arpaci-Dusseau. Operating Systems: Three Easy Pieces (free online).", href: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
          { label: "Linux man-pages project (man7.org): hier(7), passwd(5), signal(7), capabilities(7), ss(8), nft(8).", href: "https://man7.org/linux/man-pages/" },
          { label: "Filesystem Hierarchy Standard, Linux Foundation.", href: "https://refspecs.linuxfoundation.org/fhs.shtml" },
          { label: "nftables wiki.", href: "https://wiki.nftables.org/" },
          { label: "Cockpit project.", href: "https://cockpit-project.org/" },
        ]}
      />
    </>
  );
}
