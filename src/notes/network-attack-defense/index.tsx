import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "network-attack-defense",
  title: { en: "Network attack and defence lab: scan, sniff, tunnel, firewall", pt: "Laboratório de ataque e defesa em redes: escanear, capturar, tunelar, firewall" },
  seo: {
    title: { en: "Network attack and defence lab: scan, sniff, tunnel, firewall", pt: "Laboratório de ataque e defesa em redes: escanear, capturar, tunelar, firewall" },
    description: { en: "Tutorial with exercises on your own machines: how TCP/UDP sessions, nmap, Wireshark, SSH tunnels, WireGuard, ARP spoofing and brute force work, and the Linux firewall (ufw/nftables), fail2ban and monitoring that stop them.", pt: "Tutorial com exercícios nas suas próprias máquinas: como funcionam sessões TCP/UDP, nmap, Wireshark, túneis SSH, WireGuard, ARP spoofing e força bruta, e o firewall do Linux (ufw/nftables), fail2ban e monitoramento que os barram." },
  },
  summary: "a tutorial with exercises on your own machines (Docker or home network): TCP/UDP sessions, nmap, Wireshark, SSH tunnels, WireGuard VPNs (full tunnel, no DNS leak, kill switch), a hands-on project to build your own multi-country ProtonVPN-style VPN on cloud servers (NAT, per-country profiles, leak tests), ARP spoofing and SSH brute force, and the defences: Linux firewall (ufw, nftables), fail2ban, egress filtering and monitoring.",
  kicker: { en: "Hands-on lab", pt: "Laboratório prático" },
  heroTitle: { en: <>Network attack and defence, <em>on your own machines.</em></>, pt: <>Ataque e defesa em redes, <em>nas suas próprias máquinas.</em></> },
  heroLede: { en: "How the network layer is probed and abused, and how a Linux firewall, VPN and monitoring answer back, with Docker and home-lab exercises, official documentation and a clear expected result for each.", pt: "Como a camada de rede é sondada e abusada, e como firewall Linux, VPN e monitoramento respondem, com exercícios em Docker e na rede de casa, documentação oficial e um resultado esperado claro para cada um." },
  published: "2026-10-23",
  updated: "2026-10-30",
  toc: [
    {
      items: [
        { id: "intro", title: <T pt="Antes de começar" en="Before you start" /> },
        { id: "sessions", title: <T pt="Sessões: TCP com estado, UDP sem estado" en="Sessions: stateful TCP, stateless UDP" /> },
        { id: "nmap", title: <T pt="nmap: o que existe na rede" en="nmap: what exists on the network" /> },
        { id: "ssh", title: <T pt="SSH como ferramenta de rede" en="SSH as a network tool" /> },
        { id: "wireguard", title: <T pt="VPN e WireGuard: hospede a sua" en="VPN and WireGuard: host your own" /> },
        { id: "vpn-project", title: <T pt="Projeto: VPN com escolha de país" en="Project: VPN with a country picker" /> },
        { id: "wireshark", title: <T pt="Wireshark e tcpdump: ver os pacotes" en="Wireshark and tcpdump: seeing the packets" /> },
        { id: "firewall-lab", title: <T pt="Firewall: medir a defesa com o nmap" en="Firewall: measuring the defence with nmap" /> },
        { id: "arp-spoof", title: <T pt="ARP spoofing: ataque e defesa na LAN" en="ARP spoofing: attack and defence on the LAN" /> },
        { id: "recon", title: <T pt="O kit de reconhecimento, com limites" en="The recon kit, with limits" /> },
        { id: "docker-net", title: <T pt="Docker para o laboratório local" en="Docker for the local lab" /> },
        { id: "cheat-sec", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={<T pt="Antes de começar" en="Before you start" />}>
        <p><T pt={<>Esta nota é um laboratório: cada seção ensina uma ferramenta e termina num exercício com um <em>resultado esperado</em> explícito, para você saber se funcionou. A ideia é 80/20: as ferramentas que cobrem a maior parte do que um desenvolvedor precisa de redes e segurança no dia a dia, sem tentar ser um curso de pentest.</>} en={<>This note is a lab: each section teaches one tool and ends with an exercise that states an explicit <em>expected result</em>, so you know whether it worked. The idea is 80/20: the tools that cover most of what a developer needs from networking and security day to day, without trying to be a pentest course.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Regra de ouro: só escaneie, capture tráfego ou teste firewalls em máquinas e redes <em>suas</em> (sua própria VM, seu laboratório Docker, sua VPN) ou com autorização explícita por escrito. Fazer isso contra redes de terceiros sem permissão pode ser crime em praticamente todo lugar. Toda ferramenta aqui é a mesma usada por times de segurança <em>defensivos</em>: para entender e proteger o que é seu.</>} en={<>Golden rule: only scan, capture traffic or test firewalls on machines and networks that are <em>yours</em> (your own VM, your Docker lab, your VPN) or with explicit written authorization. Doing this against someone else's network without permission can be a crime almost everywhere. Every tool here is the same one <em>defensive</em> security teams use: to understand and protect what is yours.</>} /></Callout>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é a <strong>etapa 0</strong> da <a href="/notas/cybersecurity-for-devs/">trilha de cibersegurança para quem programa</a> (fundamentos de rede e sistema). As ferramentas daqui servem aos dois lados: o nmap e o Wireshark do atacante são o inventário e a investigação do defensor. Os próximos passos são a <a href="/notas/web-app-security/">nota de aplicações web seguras</a> e a <a href="/notas/web-host-attack-defense/">nota de ataque e defesa web e de servidor</a>.</>} en={<>Where this note fits: it is <strong>stage 0</strong> of the <a href="/notas/cybersecurity-for-devs/">cybersecurity path for developers</a> (network and system fundamentals). The tools here serve both sides: the attacker's nmap and Wireshark are the defender's inventory and investigation. The next steps are the <a href="/notas/web-app-security/">secure web apps note</a> and the <a href="/notas/web-host-attack-defense/">web and host attack and defence note</a>.</>} /></Callout>
        <h3><T pt="O que você precisa" en="What you need" /></h3>
        <ul className="ds-list">
          <li><T pt="Uma máquina Linux: uma VM (VirtualBox/UTM/Multipass), WSL2 no Windows, ou um servidor de estudo na nuvem (veja a nota de AWS)." en="A Linux machine: a VM (VirtualBox/UTM/Multipass), WSL2 on Windows, or a cloud study server (see the AWS note)." /></li>
          <li><T pt="Docker, para a seção de laboratório local (opcional nas outras seções)." en="Docker, for the local-lab section (optional in the other sections)." /></li>
          <li><T pt={"Um segundo dispositivo na mesma rede (celular, outro notebook) ajuda a ver o tráfego \"de fora\" em alguns exercícios, mas não é obrigatório."} en={"A second device on the same network (phone, another laptop) helps see traffic \"from outside\" in some exercises, but is not required."} /></li>
        </ul>
        <h3><T pt="Mapa da nota" en="Map of this note" /></h3>
        <Diagram minWidth={700} caption={<T pt="A ordem sugerida: cada seção usa uma ideia da anterior." en="The suggested order: each section uses an idea from the previous one." />}>
          <svg viewBox="0 0 760 72" role="img" aria-label="Mapa do laboratório / Lab map">
            <rect x="10" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="50.0" y="39.0" className="pt" textAnchor="middle">Sessões</text>
            <text x="50.0" y="39.0" className="en" textAnchor="middle">Sessions</text>
            <rect x="102" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="142.0" y="39.0" className="" textAnchor="middle">nmap</text>
            <path d="M90 35L102 35" className="ln" />
            <path d="M94.8 38.5L102 35L94.8 31.5" className="ln" />
            <rect x="194" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="234.0" y="39.0" className="" textAnchor="middle">SSH</text>
            <path d="M182 35L194 35" className="ln" />
            <path d="M186.8 38.5L194 35L186.8 31.5" className="ln" />
            <rect x="286" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="326.0" y="39.0" className="" textAnchor="middle">WireGuard</text>
            <path d="M274 35L286 35" className="ln" />
            <path d="M278.8 38.5L286 35L278.8 31.5" className="ln" />
            <rect x="378" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="418.0" y="39.0" className="" textAnchor="middle">Wireshark</text>
            <path d="M366 35L378 35" className="ln" />
            <path d="M370.8 38.5L378 35L370.8 31.5" className="ln" />
            <rect x="470" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="510.0" y="39.0" className="" textAnchor="middle">Firewall</text>
            <path d="M458 35L470 35" className="ln" />
            <path d="M462.8 38.5L470 35L462.8 31.5" className="ln" />
            <rect x="562" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="602.0" y="39.0" className="" textAnchor="middle">Recon</text>
            <path d="M550 35L562 35" className="ln" />
            <path d="M554.8 38.5L562 35L554.8 31.5" className="ln" />
            <rect x="654" y="10" width="80" height="50" rx="4" className="ln fillsoft" />
            <text x="694.0" y="39.0" className="" textAnchor="middle">Docker</text>
            <path d="M642 35L654 35" className="ln" />
            <path d="M646.8 38.5L654 35L646.8 31.5" className="ln" />
          </svg>
        </Diagram>
      </Section>
      <Section id="sessions" title={<T pt="Sessões: TCP com estado, UDP sem estado" en="Sessions: stateful TCP, stateless UDP" />}>
        <p><T pt={<>Uma <em>sessão</em> é o estado que duas pontas guardam sobre uma conversa em andamento: quem é o outro lado, o que já foi enviado, o que falta confirmar. TCP é <em>stateful</em> (com estado): abre uma conexão, numera os bytes, reenvia o que se perde. UDP é <em>stateless</em> (sem estado): cada pacote (datagrama) é independente, sem conexão nem garantia de entrega.</>} en={<>A <em>session</em> is the state both ends keep about an ongoing conversation: who the other side is, what has been sent, what is still unacknowledged. TCP is <em>stateful</em>: it opens a connection, numbers the bytes, and resends what gets lost. UDP is <em>stateless</em>: each packet (datagram) is independent, with no connection and no delivery guarantee.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="TCP: a sessão existe nos dois lados desde o handshake até o FIN (encerramento)." en="TCP: the session exists on both ends from the handshake until the FIN (close)." />}>
          <svg viewBox="0 0 650 305" role="img" aria-label="TCP com estado / TCP, stateful">
            <rect x="10" y="10" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="65" y="35" className="pt" textAnchor="middle">cliente</text>
            <text x="65" y="35" className="en" textAnchor="middle">client</text>
            <rect x="400" y="10" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="455" y="35" className="pt" textAnchor="middle">servidor</text>
            <text x="455" y="35" className="en" textAnchor="middle">server</text>
            <path d="M65 50L65 265" className="ln dash" />
            <path d="M455 50L455 265" className="ln dash" />
            <text x="260" y="74" className="pt mut" textAnchor="middle">handshake de 3 vias (abre a sessão)</text>
            <text x="260" y="74" className="en mut" textAnchor="middle">3-way handshake (opens the session)</text>
            <path d="M65 108L455 108" className="ln" />
            <path d="M448.2 104.7L455 108L448.2 111.3" className="ln" />
            <text x="260" y="102" className="mono" textAnchor="middle">SYN</text>
            <path d="M455 142L65 142" className="ln" />
            <path d="M71.8 145.3L65 142L71.8 138.7" className="ln" />
            <text x="260" y="136" className="mono" textAnchor="middle">SYN-ACK</text>
            <path d="M65 176L455 176" className="ln" />
            <path d="M448.2 172.7L455 176L448.2 179.3" className="ln" />
            <text x="260" y="170" className="mono" textAnchor="middle">ACK</text>
            <path d="M10 196L510 196" className="ln dash" />
            <path d="M65 226L455 226" className="ln" />
            <path d="M448.2 222.7L455 226L448.2 229.3" className="ln" />
            <text x="260" y="220" className="pt mono" textAnchor="middle">dados, com número de sequência</text>
            <text x="260" y="220" className="en mono" textAnchor="middle">data, with a sequence number</text>
            <path d="M455 256L65 256" className="ln" />
            <path d="M71.8 259.3L65 256L71.8 252.7" className="ln" />
            <text x="260" y="250" className="pt mono" textAnchor="middle">ACK: "recebi até aqui"</text>
            <text x="260" y="250" className="en mono" textAnchor="middle">ACK: "got this far"</text>
            <text x="10" y="290" className="pt mut" textAnchor="start">Se um ACK não chega, o remetente reenvia: é isso que torna o TCP confiável e "com estado".</text>
            <text x="10" y="290" className="en mut" textAnchor="start">If an ACK does not arrive, the sender resends: that is what makes TCP reliable and "stateful".</text>
          </svg>
        </Diagram>
        <Diagram minWidth={560} caption={<T pt="UDP: sem sessão. Quem precisa de confiabilidade (como DNS às vezes) cuida disso na camada de cima." en="UDP: no session. Whoever needs reliability (like DNS sometimes) handles it a layer up." />}>
          <svg viewBox="0 0 650 200" role="img" aria-label="UDP sem estado / UDP, stateless">
            <rect x="10" y="20" width="110" height="130" rx="4" className="ln fillsoft" />
            <text x="65" y="89" className="pt" textAnchor="middle">cliente</text>
            <text x="65" y="89" className="en" textAnchor="middle">client</text>
            <rect x="400" y="20" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="455" y="45" className="pt" textAnchor="middle">servidor DNS</text>
            <text x="455" y="45" className="en" textAnchor="middle">DNS server</text>
            <rect x="400" y="110" width="110" height="40" rx="4" className="ln fillsoft" />
            <text x="455" y="135" className="pt" textAnchor="middle">servidor NTP</text>
            <text x="455" y="135" className="en" textAnchor="middle">NTP server</text>
            <path d="M120 34L400 34" className="ln" />
            <path d="M393.2 30.7L400 34L393.2 37.3" className="ln" />
            <text x="260" y="28" className="pt mono" textAnchor="middle">datagrama 1 (consulta)</text>
            <text x="260" y="28" className="en mono" textAnchor="middle">datagram 1 (query)</text>
            <path d="M400 54L120 54" className="ln" />
            <path d="M126.8 57.3L120 54L126.8 50.7" className="ln" />
            <text x="260" y="72" className="pt mono" textAnchor="middle">datagrama 2 (resposta)</text>
            <text x="260" y="72" className="en mono" textAnchor="middle">datagram 2 (response)</text>
            <path d="M120 128L400 128" className="ln" />
            <path d="M393.2 124.7L400 128L393.2 131.3" className="ln" />
            <text x="260" y="122" className="pt mono" textAnchor="middle">datagrama 3 (hora?)</text>
            <text x="260" y="122" className="en mono" textAnchor="middle">datagram 3 (time?)</text>
            <text x="10" y="185" className="pt mut" textAnchor="start">cada datagrama é independente: sem conexão, sem reenvio automático</text>
            <text x="10" y="185" className="en mut" textAnchor="start">each datagram is independent: no connection, no automatic resend</text>
          </svg>
        </Diagram>
        <h3><T pt="Por que isso importa na prática" en="Why this matters in practice" /></h3>
        <Table
          head={[<T pt="Conceito" en="Concept" />, <T pt="O que significa" en="What it means" />]}
          rows={[
            [<T pt="Firewall stateful" en="Stateful firewall" />, <T pt={<>lembra as conexões TCP que você abriu e libera as respostas sozinho (<code>ct state established</code> no nftables)</>} en={<>remembers the TCP connections you opened and lets the replies through on its own (<code>ct state established</code> in nftables)</>} />],
            [<T pt="NAT e conntrack" en="NAT and conntrack" />, <T pt="seu roteador doméstico guarda uma tabela de sessões para saber a quem devolver cada resposta" en="your home router keeps a session table to know whom to return each reply to" />],
            [<T pt={"Por que UDP \"vaza\" menos pelo NAT"} en={"Why UDP \"leaks\" less through NAT"} />, <T pt="sem sessão formal, o NAT usa um timeout curto; é por isso que WireGuard (UDP) manda pacotes de keepalive" en="with no formal session, NAT uses a short timeout; that is why WireGuard (UDP) sends keepalive packets" />],
            [<T pt={"Balanceador de carga \"sticky\""} en={"\"Sticky\" load balancer"} />, <T pt="precisa lembrar a sessão para mandar sempre o mesmo cliente ao mesmo servidor" en="needs to remember the session to always send the same client to the same server" />],
          ]}
        />
        <h3><T pt="Exercício: ver as duas coisas ao vivo" en="Exercise: see both live" /></h3>
        <CodeBlock>
          {"ss -tn state established        "}<span className="tok-c"># conexões TCP com sessão aberta agora (seu navegador, SSH...)</span>{"\n"}
          {"ss -un                          "}<span className="tok-c"># "conexões" UDP: na verdade sockets locais, sem sessão de verdade</span>{"\n"}
          {"dig example.com                 "}<span className="tok-c"># uma consulta DNS: um datagrama de ida, um de volta</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> <code>ss -tn</code> mostra pares <code>Local Address:Port</code> / <code>Peer Address:Port</code> com estado <code>ESTAB</code> — isso é uma sessão TCP de verdade. <code>ss -un</code> mostra só sockets locais, sem "estado" de conexão, porque UDP não tem sessão no protocolo.</>} en={<><strong>Expected result:</strong> <code>ss -tn</code> shows <code>Local Address:Port</code> / <code>Peer Address:Port</code> pairs with state <code>ESTAB</code> — that is a real TCP session. <code>ss -un</code> shows only local sockets, with no connection "state", because UDP has no session in the protocol.</>} /></p>
      </Section>
      <Section id="nmap" title={<T pt="nmap: o que existe na rede" en="nmap: what exists on the network" />}>
        <p><T pt={<><code>nmap</code> (Network Mapper) responde a pergunta mais básica de rede: <em>o que existe, e o que está aberto?</em> Ele manda pacotes de teste para um alvo e lê as respostas para descobrir hosts vivos, portas abertas e, às vezes, até a versão do serviço rodando nelas. É a primeira ferramenta que qualquer time de segurança roda contra os <em>próprios</em> sistemas, para ver o que um atacante veria de fora.</>} en={<><code>nmap</code> (Network Mapper) answers the most basic network question: <em>what exists, and what is open?</em> It sends test packets to a target and reads the replies to find live hosts, open ports and sometimes even the service version running on them. It is the first tool any security team runs against its <em>own</em> systems, to see what an attacker would see from outside.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Rode o <code>nmap</code> só contra IPs seus (sua VM, seu contêiner, um servidor de estudo seu) ou contra <code>scanme.nmap.org</code>, que o próprio projeto Nmap mantém de propósito para testes. Escanear redes alheias sem permissão é ilegal em quase todo lugar.</>} en={<>Only run <code>nmap</code> against your own IPs (your VM, your container, a study server of yours) or against <code>scanme.nmap.org</code>, which the Nmap project itself keeps around on purpose for testing. Scanning other people's networks without permission is illegal almost everywhere.</>} /></Callout>
        <h3><T pt="Instalar" en="Install" /></h3>
        <CodeBlock>
          {"sudo apt install nmap     "}<span className="tok-c"># Debian/Ubuntu</span>{"\n"}
          {"sudo dnf install nmap     "}<span className="tok-c"># Fedora</span>{"\n"}
          {"brew install nmap         "}<span className="tok-c"># macOS</span>
        </CodeBlock>
        <h3><T pt="Anatomia de um scan de portas" en="Anatomy of a port scan" /></h3>
        <Diagram minWidth={700} caption={<T pt={<>Um SYN scan (<code>-sS</code>) manda um SYN para cada porta e classifica pela resposta, sem completar a conexão.</>} en={<>A SYN scan (<code>-sS</code>) sends a SYN to each port and classifies it by the reply, without completing the connection.</>} />}>
          <svg viewBox="0 0 780 290" role="img" aria-label="Como o nmap classifica portas / How nmap classifies ports">
            <rect x="10" y="100" width="110" height="50" rx="4" className="ln fillsoft" />
            <text x="65" y="129" className="" textAnchor="middle">nmap</text>
            <rect x="330" y="10" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="410" y="39" className="pt" textAnchor="middle">:22 aberta</text>
            <text x="410" y="39" className="en" textAnchor="middle">:22 open</text>
            <path d="M120 125L330 35" className="ln" />
            <path d="M322.5 34.7L330 35L325.1 40.7" className="ln" />
            <text x="510" y="39" className="pt mut" textAnchor="start">← SYN-ACK: aberta</text>
            <text x="510" y="39" className="en mut" textAnchor="start">← SYN-ACK: open</text>
            <rect x="330" y="80" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="410" y="109" className="pt" textAnchor="middle">:80 aberta</text>
            <text x="410" y="109" className="en" textAnchor="middle">:80 open</text>
            <path d="M120 125L330 105" className="ln" />
            <path d="M323.0 102.4L330 105L323.6 108.9" className="ln" />
            <text x="510" y="109" className="pt mut" textAnchor="start">← SYN-ACK: aberta</text>
            <text x="510" y="109" className="en mut" textAnchor="start">← SYN-ACK: open</text>
            <rect x="330" y="150" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="410" y="179" className="pt" textAnchor="middle">:443 fechada</text>
            <text x="410" y="179" className="en" textAnchor="middle">:443 closed</text>
            <path d="M120 125L330 175" className="ln" />
            <path d="M324.2 170.3L330 175L322.7 176.6" className="ln" />
            <text x="510" y="179" className="pt mut" textAnchor="start">← RST: fechada</text>
            <text x="510" y="179" className="en mut" textAnchor="start">← RST: closed</text>
            <rect x="330" y="220" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="410" y="249" className="pt" textAnchor="middle">:8080 filtrada</text>
            <text x="410" y="249" className="en" textAnchor="middle">:8080 filtered</text>
            <path d="M120 125L330 245" className="ln" />
            <path d="M325.8 238.8L330 245L322.5 244.5" className="ln" />
            <text x="510" y="249" className="pt mut" textAnchor="start">sem resposta: filtrada</text>
            <text x="510" y="249" className="en mut" textAnchor="start">no reply: filtered</text>
            <text x="215" y="95" className="mono mut" textAnchor="middle">SYN</text>
            <text x="510" y="267" className="pt mut" textAnchor="start">(o firewall descarta o pacote)</text>
            <text x="510" y="267" className="en mut" textAnchor="start">(a firewall drops the packet)</text>
          </svg>
        </Diagram>
        <h3><T pt="Exercício 1: escaneie a sua própria máquina" en="Exercise 1: scan your own machine" /></h3>
        <CodeBlock>
          {"nmap localhost                       "}<span className="tok-c"># scan básico das 1000 portas mais comuns</span>{"\n"}
          {"nmap -p- localhost                   "}<span className="tok-c"># TODAS as 65535 portas (mais lento)</span>{"\n"}
          {"nmap -sV localhost                   "}<span className="tok-c"># tenta identificar a VERSÃO de cada serviço</span>{"\n"}
          {"nmap -O localhost                    "}<span className="tok-c"># tenta adivinhar o sistema operacional (precisa de sudo)</span>{"\n"}
          {"sudo nmap -sS -p 1-1000 localhost    "}<span className="tok-c"># SYN scan "silencioso", não completa a conexão</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> uma lista como <code>22/tcp open ssh</code>, <code>631/tcp open ipp</code> (se você tem impressão compartilhada), ou "0 portas abertas" numa máquina bem fechada. Compare com <code>ss -tulpn</code> (nota de Linux): toda porta que o nmap mostra como aberta deve aparecer também ali, do lado do servidor.</>} en={<><strong>Expected result:</strong> a list like <code>22/tcp open ssh</code>, <code>631/tcp open ipp</code> (if you have printer sharing), or "0 open ports" on a well-closed machine. Compare it with <code>ss -tulpn</code> (Linux note): every port nmap shows as open should also show up there, from the server side.</>} /></p>
        <h3><T pt="Exercício 2: escaneie um contêiner Docker" en="Exercise 2: scan a Docker container" /></h3>
        <CodeBlock>
          {"docker run -d --name web -p 8080:80 nginx\n"}
          {"nmap -p 8080 localhost               "}<span className="tok-c"># a porta publicada</span>{"\n"}
          {"nmap localhost                       "}<span className="tok-c"># as outras portas do HOST continuam aparecendo, a 80 do container não</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> só a porta <code>8080</code> aparece aberta (a publicada com <code>-p</code>); a <code>80</code> "de dentro" do contêiner não aparece, porque o nmap, rodando no host, só enxerga a interface do host, não a rede interna do Docker. A seção sobre Docker mais abaixo explica por quê.</>} en={<><strong>Expected result:</strong> only port <code>8080</code> shows as open (the one published with <code>-p</code>); the container's internal <code>80</code> does not show up, because nmap, running on the host, only sees the host's interface, not Docker's internal network. The Docker section below explains why.</>} /></p>
        <h3><T pt="Opções do dia a dia" en="Everyday options" /></h3>
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Faz" en="Does" />]}
          rows={[
            [<code>-sS</code>, <T pt={<>SYN scan: rápido, não completa a conexão (precisa de <code>sudo</code>)</>} en={<>SYN scan: fast, does not complete the connection (needs <code>sudo</code>)</>} />],
            [<code>-sT</code>, <T pt={<>connect scan: completa a conexão TCP normal (não precisa de <code>sudo</code>)</>} en={<>connect scan: completes a normal TCP connection (no <code>sudo</code> needed)</>} />],
            [<code>-sU</code>, <T pt="escaneia portas UDP (mais lento e menos confiável que TCP)" en="scans UDP ports (slower and less reliable than TCP)" />],
            [<><code>-p 1-1000</code> · <code>-p-</code> · <code>-p 22,80,443</code></>, <T pt="faixa, tudo, ou portas específicas" en="a range, everything, or specific ports" />],
            [<code>-sV</code>, <T pt="detecta a versão do serviço (“nginx 1.25”)" en="detects the service version (“nginx 1.25”)" />],
            [<code>-A</code>, <T pt="tudo junto: versão, SO, script básico, traceroute (mais barulhento e lento)" en="everything together: version, OS, basic scripts, traceroute (noisier and slower)" />],
            [<code>-T4</code>, <T pt={<>mais rápido (até <code>-T5</code>); o padrão é conservador</>} en={<>faster (up to <code>-T5</code>); the default is conservative</>} />],
            [<code>-oN arquivo.txt</code>, <T pt="salva a saída legível em arquivo" en="saves readable output to a file" />],
            [<code>192.168.1.0/24</code>, <T pt="escaneia uma faixa inteira (só na sua LAN!)" en="scans a whole range (only on your own LAN!)" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Nmap tem uma engine de scripts (NSE, <code>--script</code>) usada para checagens específicas, como testar se um servidor tem uma configuração TLS fraca. É poderosa e também de uso exclusivo em sistemas seus ou autorizados.</>} en={<>Nmap has a scripting engine (NSE, <code>--script</code>) used for specific checks, like testing whether a server has weak TLS configuration. It is powerful, and likewise for use only on your own or authorized systems.</>} /></Callout>
      </Section>
      <Section id="ssh" title={<T pt="SSH como ferramenta de rede" en="SSH as a network tool" />}>
        <p><T pt={<>A nota de Linux já cobre chaves e <code>sshd_config</code>. Aqui o foco é usar o SSH como <em>ferramenta de rede</em>: um túnel cifrado que você pode usar para alcançar serviços que, de outro jeito, não exporia.</>} en={<>The Linux note already covers keys and <code>sshd_config</code>. Here the focus is using SSH as a <em>network tool</em>: an encrypted tunnel you can use to reach services that would otherwise not be exposed.</>} /></p>
        <Diagram minWidth={620} caption={<T pt={<>Encaminhamento local (<code>-L</code>): o que você manda para uma porta sua sai do outro lado do túnel.</>} en={<>Local forwarding (<code>-L</code>): what you send to a port of yours comes out the other end of the tunnel.</>} />}>
          <svg viewBox="0 0 700 185" role="img" aria-label="Túnel SSH local / Local SSH tunnel">
            <rect x="10" y="40" width="130" height="50" rx="4" className="ln fillsoft" />
            <text x="75" y="69" className="pt" textAnchor="middle">seu notebook</text>
            <text x="75" y="69" className="en" textAnchor="middle">your laptop</text>
            <rect x="260" y="40" width="150" height="50" rx="4" className="ln" />
            <text x="335" y="69" className="pt" textAnchor="middle">servidor (SSH)</text>
            <text x="335" y="69" className="en" textAnchor="middle">server (SSH)</text>
            <rect x="530" y="35" width="150" height="60" rx="4" className="ln fillsoft" />
            <text x="605" y="60" className="pt" textAnchor="middle">banco :5432</text>
            <text x="605" y="60" className="en" textAnchor="middle">database :5432</text>
            <text x="605" y="78" className="pt mut mono" textAnchor="middle">só localhost</text>
            <text x="605" y="78" className="en mut mono" textAnchor="middle">localhost only</text>
            <path d="M140 65L260 65" className="ln" />
            <path d="M253.2 61.7L260 65L253.2 68.3" className="ln" />
            <text x="200" y="56" className="pt mono" textAnchor="middle">túnel :5432</text>
            <text x="200" y="56" className="en mono" textAnchor="middle">tunnel :5432</text>
            <path d="M410 65L530 65" className="ln dash" />
            <path d="M523.2 61.7L530 65L523.2 68.3" className="ln" />
            <text x="470" y="56" className="mut" textAnchor="middle">local</text>
            <text x="10" y="140" className="pt mono" textAnchor="start">ssh -L 5432:localhost:5432 ana@servidor</text>
            <text x="10" y="140" className="en mono" textAnchor="start">ssh -L 5432:localhost:5432 ana@server</text>
            <text x="10" y="165" className="pt mut" textAnchor="start">agora localhost:5432 no seu notebook é o banco do servidor</text>
            <text x="10" y="165" className="en mut" textAnchor="start">now localhost:5432 on your laptop is the server’s database</text>
          </svg>
        </Diagram>
        <h3><T pt="Exercício: um túnel de verdade" en="Exercise: a real tunnel" /></h3>
        <CodeBlock>
          <span className="tok-c"># no "servidor" (pode ser uma segunda VM, ou um contêiner com sshd):</span>{"\n"}
          {"docker run -d --name srv -p 2222:22 -p 127.0.0.1:8081:80 linuxserver/openssh-server \\\n"}
          {"  -e PASSWORD_ACCESS=true -e USER_PASSWORD=estudo -e USER_NAME=ana\n"}
          {"docker exec srv apk add --no-cache python3 2>/dev/null || true\n"}
          {"docker exec -d srv python3 -m http.server 80\n"}
          {"\n"}
          <span className="tok-c"># no seu notebook: abra o túnel</span>{"\n"}
          {"ssh -p 2222 -L 9000:localhost:8081 ana@localhost   "}<span className="tok-c"># senha: estudo</span>{"\n"}
          {"\n"}
          <span className="tok-c"># numa SEGUNDA aba, com o túnel ainda aberto:</span>{"\n"}
          {"curl http://localhost:9000"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>curl</code> retorna a página servida por <code>python3 -m http.server</code> <em>dentro</em> do contêiner, mesmo que a porta 80 dele só esteja ligada ao <code>localhost</code> interno — porque o túnel SSH carrega o tráfego da sua porta 9000 até lá. Feche o SSH (<code>Ctrl+C</code>) e repita o <code>curl</code>: agora falha, porque o túnel não existe mais.</>} en={<><strong>Expected result:</strong> <code>curl</code> returns the page served by <code>python3 -m http.server</code> <em>inside</em> the container, even though its port 80 is only bound to its internal <code>localhost</code> — because the SSH tunnel carries the traffic from your port 9000 there. Close SSH (<code>Ctrl+C</code>) and repeat the <code>curl</code>: it now fails, because the tunnel no longer exists.</>} /></p>
        <h3><T pt="As três formas de encaminhamento" en="The three kinds of forwarding" /></h3>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="Direção" en="Direction" />, <T pt="Use quando" en="Use when" />]}
          rows={[
            [<code>ssh -L porta_local:destino:porta ana@srv</code>, <T pt="você → servidor → destino" en="you → server → destination" />, <T pt="alcançar um banco/painel que só existe na rede do servidor" en="reaching a database/panel that only exists on the server’s network" />],
            [<code>ssh -R porta_remota:localhost:porta ana@srv</code>, <T pt="servidor → você" en="server → you" />, <T pt="expor algo seu (um app local) através de um servidor com IP público" en="exposing something of yours (a local app) through a server with a public IP" />],
            [<code>ssh -D 1080 ana@srv</code>, <T pt="proxy SOCKS: qualquer app → servidor → internet" en="SOCKS proxy: any app → server → internet" />, <T pt="navegar como se estivesse saindo pela rede do servidor" en="browsing as if leaving from the server’s network" />],
          ]}
        />
      </Section>
      <Section id="wireguard" title={<T pt="VPN e WireGuard: hospede a sua" en="VPN and WireGuard: host your own" />}>
        <p><T pt={<>Uma <em>VPN</em> (Virtual Private Network) estende uma rede privada pela internet: o tráfego entra cifrado num ponto e sai do outro lado como se estivesse dentro da rede remota. <code>WireGuard</code> é a forma moderna de fazer isso: um protocolo enxuto (poucos milhares de linhas, contra centenas de milhares do OpenVPN/IPsec), baseado em criptografia de chave pública, que vira uma interface de rede comum (<code>wg0</code>). É simples o bastante para você <em>hospedar a sua própria VPN</em> em minutos.</>} en={<>A <em>VPN</em> (Virtual Private Network) extends a private network across the internet: traffic goes in encrypted at one point and comes out the other side as if it were inside the remote network. <code>WireGuard</code> is the modern way to do this: a lean protocol (a few thousand lines, versus hundreds of thousands for OpenVPN/IPsec), based on public-key cryptography, that shows up as an ordinary network interface (<code>wg0</code>). It is simple enough that you can <em>host your own VPN</em> in minutes.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={<>Os dois lados viram uma pequena rede própria, <code>10.8.0.0/24</code>, por cima da internet normal.</>} en={<>Both sides become a small network of their own, <code>10.8.0.0/24</code>, on top of the ordinary internet.</>} />}>
          <svg viewBox="0 0 690 275" role="img" aria-label="WireGuard: dois peers, um túnel / WireGuard: two peers, one tunnel">
            <rect x="10" y="20" width="170" height="60" rx="4" className="ln fillsoft" />
            <text x="95" y="47" className="pt" textAnchor="middle">seu notebook</text>
            <text x="95" y="47" className="en" textAnchor="middle">your laptop</text>
            <text x="95" y="65" className="mut mono" textAnchor="middle">wg0: 10.8.0.2</text>
            <rect x="510" y="20" width="170" height="60" rx="4" className="ln fillsoft" />
            <text x="595" y="47" className="pt" textAnchor="middle">seu servidor</text>
            <text x="595" y="47" className="en" textAnchor="middle">your server</text>
            <text x="595" y="65" className="mut mono" textAnchor="middle">wg0: 10.8.0.1</text>
            <rect x="10" y="120" width="670" height="90" rx="4" className="ln dash" />
            <text x="345" y="142" className="pt mut" textAnchor="middle">internet (tudo aqui é cifrado)</text>
            <text x="345" y="142" className="en mut" textAnchor="middle">internet (everything here is encrypted)</text>
            <path d="M95 80L95 120" className="ln" />
            <path d="M98.3 113.2L95 120L91.7 113.2" className="ln" />
            <path d="M595 80L595 120" className="ln" />
            <path d="M598.3 113.2L595 120L591.7 113.2" className="ln" />
            <path d="M95 185L595 185" className="ln" />
            <path d="M588.2 181.7L595 185L588.2 188.3" className="ln" />
            <text x="345" y="176" className="pt mono" textAnchor="middle">UDP :51820 · pacotes cifrados e autenticados</text>
            <text x="345" y="176" className="en mono" textAnchor="middle">UDP :51820 · encrypted, authenticated packets</text>
            <text x="10" y="240" className="pt mut" textAnchor="start">Cada lado tem uma chave privada (que nunca sai da máquina)</text>
            <text x="10" y="240" className="en mut" textAnchor="start">Each side has a private key (that never leaves the machine)</text>
            <text x="10" y="258" className="pt mut" textAnchor="start">e conhece a chave PÚBLICA do outro — como SSH, mas para toda a conexão.</text>
            <text x="10" y="258" className="en mut" textAnchor="start">and knows the other’s PUBLIC key — like SSH, but for the whole connection.</text>
          </svg>
        </Diagram>
        <h3><T pt="Exercício: hospede a sua própria VPN" en="Exercise: host your own VPN" /></h3>
        <p><T pt="No seu servidor (uma VM de estudo na nuvem, ou uma VM local — veja a nota de AWS para subir uma de graça/baixo custo):" en="On your server (a cloud study VM, or a local VM — see the AWS note to spin one up cheaply):" /></p>
        <CodeBlock>
          <span className="tok-c"># SERVIDOR</span>{"\n"}
          {"sudo apt install wireguard\n"}
          {"umask 077   "}<span className="tok-c"># garante que as chaves nasçam só legíveis pelo dono</span>{"\n"}
          {"wg genkey | tee server.key | wg pubkey > server.pub\n"}
          {"cat server.key   "}<span className="tok-c"># guarde: vai no [Interface] do servidor</span>{"\n"}
          {"cat server.pub   "}<span className="tok-c"># guarde: vai no [Peer] do notebook</span>{"\n"}
          {"\n"}
          {"sudo sysctl -w net.ipv4.ip_forward=1    "}<span className="tok-c"># deixa o servidor RETRANSMITIR pacotes (só até o reboot; o projeto abaixo grava em /etc/sysctl.d)</span>
        </CodeBlock>
        <p><T pt="Arquivo de configuração do servidor:" en="The server’s configuration file:" /></p>
        <CodeBlock code={`# /etc/wireguard/wg0.conf  (servidor)
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <conteúdo de server.key>

[Peer]                      # um bloco [Peer] para cada cliente
PublicKey = <conteúdo de laptop.pub>
AllowedIPs = 10.8.0.2/32    # só este IP da VPN vem desse peer`} />
        <CodeBlock>
          {"sudo wg-quick up wg0                    "}<span className="tok-c"># sobe a interface</span>{"\n"}
          {"sudo systemctl enable wg-quick@wg0      "}<span className="tok-c"># liga no boot</span>{"\n"}
          {"sudo wg show                            "}<span className="tok-c"># confirma: peer, handshake, transferência</span>
        </CodeBlock>
        <p><T pt="No seu notebook (o cliente):" en="On your laptop (the client):" /></p>
        <CodeBlock>
          <span className="tok-c"># NOTEBOOK</span>{"\n"}
          {"wg genkey | tee laptop.key | wg pubkey > laptop.pub\n"}
          <span className="tok-c"># copie laptop.pub para o bloco [Peer] do servidor (acima) e reinicie: sudo wg-quick down wg0 &amp;&amp; sudo wg-quick up wg0</span>
        </CodeBlock>
        <CodeBlock code={`# /etc/wireguard/wg0.conf  (notebook)
[Interface]
Address = 10.8.0.2/24
PrivateKey = <conteúdo de laptop.key>

[Peer]
PublicKey = <conteúdo de server.pub>
Endpoint = SEU_IP_PUBLICO:51820
AllowedIPs = 10.8.0.0/24    # só a rede da VPN passa pelo túnel (não TUDO)
PersistentKeepalive = 25    # mantém o NAT "vivo" (lembra: UDP não tem sessão!)`} />
        <CodeBlock>
          {"sudo wg-quick up wg0\n"}
          {"ping 10.8.0.1                 "}<span className="tok-c"># chega ao servidor pela VPN?</span>{"\n"}
          {"sudo wg show                  "}<span className="tok-c"># "latest handshake" recente = funcionando</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> <code>ping 10.8.0.1</code> responde, e <code>sudo wg show</code> mostra um <code>latest handshake</code> de segundos atrás nos dois lados. Se não houver handshake, confira: porta 51820/UDP liberada no firewall e no grupo de segurança da nuvem, <code>ip_forward</code> ligado no servidor, e se as chaves públicas foram trocadas corretamente (a pública do notebook no servidor, e vice-versa).</>} en={<><strong>Expected result:</strong> <code>ping 10.8.0.1</code> replies, and <code>sudo wg show</code> shows a <code>latest handshake</code> from seconds ago on both sides. If there is no handshake, check: port 51820/UDP open in the firewall and the cloud security group, <code>ip_forward</code> on at the server, and whether the public keys were exchanged correctly (the laptop’s public key on the server, and vice versa).</>} /></p>
        <Callout icon="check"><T pt={<>Com <code>AllowedIPs = 0.0.0.0/0</code> no cliente, TODO o seu tráfego de internet passa pelo servidor (uma VPN "completa", útil em Wi-Fi não confiável). Com uma faixa menor (como <code>10.8.0.0/24</code>), só o tráfego para a rede da VPN passa por ela — o resto sai direto. Essa escolha é só o <code>AllowedIPs</code>.</>} en={<>With <code>AllowedIPs = 0.0.0.0/0</code> on the client, ALL of your internet traffic goes through the server (a "full" VPN, useful on untrusted Wi-Fi). With a smaller range (like <code>10.8.0.0/24</code>), only traffic to the VPN network goes through it — everything else goes out directly. That choice is just <code>AllowedIPs</code>.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Atenção:</strong> para o túnel completo (<code>0.0.0.0/0</code>) realmente dar internet, o servidor também precisa de <em>NAT</em> (<code>MASQUERADE</code>) na interface de saída; só o <code>ip_forward</code> não basta. A seção <a href="#vpn-project">Projeto: VPN com escolha de país</a> faz isso, de forma permanente, e mostra como ter um servidor por país.</>} en={<><strong>Heads-up:</strong> for the full tunnel (<code>0.0.0.0/0</code>) to actually give you internet, the server also needs <em>NAT</em> (<code>MASQUERADE</code>) on its outbound interface; <code>ip_forward</code> alone is not enough. The <a href="#vpn-project">Project: VPN with a country picker</a> section does that, permanently, and shows how to run one server per country.</>} /></Callout>
        <h3><T pt="Para que serve de verdade: usar fora de casa, em Wi-Fi público" en="What it is really for: using it away from home, on public Wi-Fi" /></h3>
        <p><T pt={<>Um Wi-Fi de aeroporto, cafeteria ou hotel é uma rede que você não controla: qualquer outro cliente nela pode tentar capturar seu tráfego (o mesmo <code>tcpdump</code>/Wireshark da seção anterior, só que operado por outra pessoa) ou criar um ponto de acesso falso com o mesmo nome ("evil twin"). Ligar a VPN antes de usar essa rede resolve isso: todo o seu tráfego sai cifrado do seu aparelho até o SEU servidor, então quem está no Wi-Fi local só vê bytes WireGuard sem sentido, exatamente como a captura da porta 443 na seção de Wireshark.</>} en={<>Airport, coffee-shop or hotel Wi-Fi is a network you do not control: any other client on it can try to capture your traffic (the same <code>tcpdump</code>/Wireshark from the previous section, just run by someone else) or stand up a fake access point with the same name (an "evil twin"). Turning the VPN on before using that network fixes this: all your traffic leaves your device encrypted all the way to YOUR server, so whoever is on the local Wi-Fi only sees meaningless WireGuard bytes, exactly like the port-443 capture in the Wireshark section.</>} /></p>
        <h3><T pt="Configurar o celular (com QR code)" en="Setting up your phone (with a QR code)" /></h3>
        <CodeBlock>
          <span className="tok-c"># no SERVIDOR: gere a config completa de um novo peer "celular" e mostre como QR code</span>{"\n"}
          {"sudo apt install qrencode\n"}
          {"wg genkey | tee celular.key | wg pubkey > celular.pub\n"}
          {"\n"}
          {"cat > celular.conf <<EOF\n"}
          {"[Interface]\n"}
          {"Address = 10.8.0.3/24\n"}
          {"PrivateKey = $(cat celular.key)\n"}
          {"DNS = 10.8.0.1                       "}<span className="tok-c"># veja "sem vazar DNS" abaixo</span>{"\n"}
          {"\n"}
          {"[Peer]\n"}
          {"PublicKey = $(cat server.pub)\n"}
          {"Endpoint = SEU_IP_PUBLICO:51820\n"}
          {"AllowedIPs = 0.0.0.0/0, ::/0          "}<span className="tok-c"># TUNEL COMPLETO: todo o tráfego do celular</span>{"\n"}
          {"PersistentKeepalive = 25\n"}
          {"EOF\n"}
          {"\n"}
          {"qrencode -t ansiutf8 < celular.conf    "}<span className="tok-c"># mostra o QR no próprio terminal</span>{"\n"}
          <span className="tok-c"># adicione o peer no servidor (bloco [Peer] com celular.pub e AllowedIPs = 10.8.0.3/32) e recarregue o wg0</span>
        </CodeBlock>
        <p><T pt={<>Abra o app oficial <strong>WireGuard</strong> (Android/iOS), toque em "+", escaneie o QR do terminal, e pronto: um toque liga e desliga a VPN. Para o notebook, use <code>AllowedIPs = 0.0.0.0/0</code> do mesmo jeito no lugar de <code>10.8.0.0/24</code> (o exemplo principal desta seção usava a faixa menor de propósito, para separar "túnel completo" de "só a rede da VPN").</>} en={<>Open the official <strong>WireGuard</strong> app (Android/iOS), tap "+", scan the QR code from the terminal, and that's it: one tap turns the VPN on and off. For a laptop, use <code>AllowedIPs = 0.0.0.0/0</code> the same way in place of <code>10.8.0.0/24</code> (this section's main example used the smaller range on purpose, to keep "full tunnel" separate from "just the VPN network").</>} /></p>
        <h3><T pt="Sem vazar DNS" en="Without leaking DNS" /></h3>
        <p><T pt={<>Se o <code>AllowedIPs</code> manda todo o TRÁFEGO pela VPN mas o aparelho continua perguntando o DNS do Wi-Fi local "qual o IP de banco.com?", o dono daquele Wi-Fi ainda vê quais sites você visita — isso é um <em>vazamento de DNS</em>. A linha <code>DNS = 10.8.0.1</code> na config do cliente resolve isso, desde que o servidor tenha um resolvedor DNS escutando na VPN.</>} en={<>If <code>AllowedIPs</code> sends all TRAFFIC through the VPN but the device still asks the local Wi-Fi "what is banco.com's IP?", whoever owns that Wi-Fi can still see which sites you visit — that is a <em>DNS leak</em>. The <code>DNS = 10.8.0.1</code> line in the client config fixes this, as long as the server has a DNS resolver listening on the VPN.</>} /></p>
        <CodeBlock>
          <span className="tok-c"># no SERVIDOR: um resolvedor simples, só para a rede da VPN</span>{"\n"}
          {"sudo apt install unbound\n"}
          {"echo "}<span className="tok-s">'interface: 10.8.0.1'</span>{" | sudo tee -a /etc/unbound/unbound.conf.d/wg.conf\n"}
          {"echo "}<span className="tok-s">'access-control: 10.8.0.0/24 allow'</span>{" | sudo tee -a /etc/unbound/unbound.conf.d/wg.conf\n"}
          {"sudo systemctl restart unbound\n"}
          {"\n"}
          <span className="tok-c"># teste de vazamento, dos dois lados</span>{"\n"}
          {"dig @10.8.0.1 example.com            "}<span className="tok-c"># pelo resolvedor da VPN: deve responder</span>{"\n"}
          {"cat /etc/resolv.conf                 "}<span className="tok-c"># no cliente, depois de subir o túnel: deve apontar para 10.8.0.1</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> com a VPN ligada, abra <a href="https://www.dnsleaktest.com" rel="noopener">dnsleaktest.com</a> num navegador: os servidores de DNS listados devem ser os do SEU servidor (ou do provedor que ele usa), nunca os do Wi-Fi em que você está.</>} en={<><strong>Expected result:</strong> with the VPN on, open <a href="https://www.dnsleaktest.com" rel="noopener">dnsleaktest.com</a> in a browser: the DNS servers listed should be YOUR server's (or whatever provider it uses), never the Wi-Fi's you are on.</>} /></p>
        <h3><T pt="Kill switch: não deixar vazar se a VPN cair" en="Kill switch: don't leak if the VPN drops" /></h3>
        <p><T pt={<>Com túnel completo, se o WireGuard cair por um instante (trocou de rede, o app travou), o sistema operacional pode voltar a mandar tráfego direto pela rede local sem avisar. Um <em>kill switch</em> é uma regra de firewall que só libera saída pela interface <code>wg0</code> (e descarta o resto), então, se o túnel cai, a internet para de funcionar em vez de vazar.</>} en={<>With a full tunnel, if WireGuard drops for a moment (you switched networks, the app froze), the operating system may fall back to sending traffic directly over the local network without warning. A <em>kill switch</em> is a firewall rule that only allows outbound traffic through the <code>wg0</code> interface (and drops the rest), so if the tunnel drops, the internet stops working instead of leaking.</>} /></p>
        <CodeBlock code={`# /etc/wireguard/wg0.conf (notebook) — bloco [Interface], regras extras
[Interface]
Address = 10.8.0.2/24
PrivateKey = <conteúdo de laptop.key>
DNS = 10.8.0.1
PostUp = iptables -I OUTPUT ! -o %i -m mark ! --mark $(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT
PostDown = iptables -D OUTPUT ! -o %i -m mark ! --mark $(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT`} />
        <Callout icon="check"><T pt={<>Esse <code>PostUp</code>/<code>PostDown</code> é a receita oficial do próprio projeto WireGuard para kill switch no Linux. Nos apps oficiais de celular (Android/iOS), procure a opção "Always-on VPN" / "Bloquear conexões sem VPN" nas configurações do sistema — ela faz o mesmo sem editar config nenhuma.</>} en={"This PostUp/PostDown is the WireGuard project's own recipe for a Linux kill switch. In the official phone apps (Android/iOS), look for \"Always-on VPN\" / \"Block connections without VPN\" in the system settings — it does the same thing with no config editing."} /></Callout>
        <h3><T pt="WireGuard gerenciado" en="Managed WireGuard" /></h3>
        <p><T pt={<>Quando configurar à mão em vários dispositivos cansa, <code>wg-easy</code> (um contêiner com painel web) e <code>Tailscale</code>/<code>Netbird</code> (redes "mesh" sobre WireGuard, com login por conta) resolvem a parte chata de distribuir chaves. Internamente, todos usam o mesmo protocolo que você acabou de configurar à mão.</>} en={<>When configuring by hand on several devices gets old, <code>wg-easy</code> (a container with a web panel) and <code>Tailscale</code>/<code>Netbird</code> (WireGuard-based "mesh" networks with account login) solve the tedious part of distributing keys. Internally, all of them use the same protocol you just configured by hand.</>} /></p>
      </Section>
      <Section id="vpn-project" title={<T pt="Projeto: sua VPN com escolha de país (estilo ProtonVPN)" en="Project: your own VPN with a country picker (ProtonVPN-style)" />}>
        <p><T pt={<>Serviços como o ProtonVPN deixam você escolher um país e passar a navegar com o IP de lá, por um túnel cifrado. Dá para montar o mesmo princípio com peças abertas: <code>WireGuard</code> (o túnel), <code>iptables</code> (o NAT que troca o seu IP) e <code>unbound</code> (o DNS), em <em>um servidor pequeno por país</em> numa nuvem. Esta seção é um projeto passo a passo, com scripts prontos, e termina com testes que provam que o IP mudou e que nada vaza.</>} en={<>Services like ProtonVPN let you pick a country and browse with an IP from there, through an encrypted tunnel. You can build the same principle from open parts: <code>WireGuard</code> (the tunnel), <code>iptables</code> (the NAT that swaps your IP) and <code>unbound</code> (the DNS), on <em>one small server per country</em> in a cloud. This section is a step-by-step project with ready-made scripts, and it ends with tests that prove the IP changed and that nothing leaks.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Dois avisos antes de começar. <strong>1)</strong> Isto é <em>privacidade</em> contra a rede local, o seu provedor de internet e sites que olham o seu IP; <em>não é anonimato</em> (veja "Limites" no fim). <strong>2)</strong> Servidores na nuvem custam dinheiro (instância + tráfego de saída): confira o preço atual do provedor antes de subir vários e desligue o que não usar. Use só para o seu próprio tráfego e respeitando os termos do provedor e a lei do seu país.</>} en={<>Two warnings before you start. <strong>1)</strong> This is <em>privacy</em> against the local network, your ISP and sites that look at your IP; it is <em>not anonymity</em> (see "Limits" at the end). <strong>2)</strong> Cloud servers cost money (instance + outbound traffic): check the provider’s current pricing before spinning up several, and shut down what you do not use. Use it only for your own traffic and within the provider’s terms and your country’s law.</>} /></Callout>
        <h3><T pt="O que vamos construir e como se compara" en="What we are building and how it compares" /></h3>
        <Table
          head={[<T pt="Aspecto" en="Aspect" />, <T pt="ProtonVPN e similares" en="ProtonVPN and similar" />, <T pt="A sua VPN" en="Your VPN" />]}
          rows={[
            [<T pt="Escolher o país" en="Picking the country" />, <T pt="centenas de servidores, um clique" en="hundreds of servers, one click" />, <T pt={<>um servidor por país que <em>você</em> subir; <code>vpn de</code> troca</>} en={<>one server per country <em>you</em> spin up; <code>vpn de</code> switches</>} />],
            [<T pt="IP de saída" en="Exit IP" />, <T pt="compartilhado por muitos usuários" en="shared by many users" />, <T pt="só seu, fixo, de datacenter" en="yours alone, fixed, from a datacenter" />],
            [<T pt="Quem vê o que" en="Who sees what" />, <T pt="você confia na política de não registro deles" en="you trust their no-logs policy" />, <T pt="você controla os logs, mas a nuvem sabe quem você é (cobrança)" en="you control the logs, but the cloud knows who you are (billing)" />],
            [<T pt="Streaming e sites" en="Streaming and sites" />, <T pt="IPs residenciais/otimizados" en="residential/optimised IPs" />, <T pt="IP de datacenter: alguns sites bloqueiam ou pedem captcha" en="datacenter IP: some sites block it or show captchas" />],
            [<T pt="Custo e manutenção" en="Cost and upkeep" />, <T pt="assinatura" en="subscription" />, <T pt="você paga a nuvem e faz as atualizações" en="you pay the cloud and do the updates" />],
          ]}
        />
        <Diagram minWidth={620} caption={<T pt={<>Um perfil de cliente por país. Só um túnel fica ligado por vez (traço cheio); os outros (tracejados) ficam desligados. Cada servidor é uma rede WireGuard independente, por isso todos podem usar <code>10.8.0.1</code>.</>} en={<>One client profile per country. Only one tunnel is up at a time (solid line); the others (dashed) stay off. Each server is an independent WireGuard network, which is why they can all use <code>10.8.0.1</code>.</>} />}>
          <svg viewBox="0 0 720 300" role="img" aria-label="Um notebook, três servidores VPN em países diferentes, a internet / One laptop, three VPN servers in different countries, the internet">
            <rect x="10" y="100" width="150" height="100" rx="4" className="ln fillsoft" />
            <text x="85" y="128" className="pt" textAnchor="middle">seu notebook</text>
            <text x="85" y="128" className="en" textAnchor="middle">your laptop</text>
            <text x="85" y="150" className="pt mut mono" textAnchor="middle">br · de · us</text>
            <text x="85" y="150" className="en mut mono" textAnchor="middle">br · de · us</text>
            <text x="85" y="170" className="mut mono" textAnchor="middle">wg0: 10.8.0.2</text>
            <rect x="290" y="10" width="190" height="64" rx="4" className="ln fillsoft" />
            <text x="385" y="36" className="" textAnchor="middle">São Paulo (br)</text>
            <text x="385" y="56" className="pt mut mono" textAnchor="middle">wg0 10.8.0.1 · IP público</text>
            <text x="385" y="56" className="en mut mono" textAnchor="middle">wg0 10.8.0.1 · public IP</text>
            <path d="M160 150L290 42" className="ln dash" />
            <path d="M286.9 49.2L290 42L282.4 43.8" className="ln" />
            <path d="M480 42L600 150" className="ln dash" />
            <path d="M592.5 147.9L600 150L597.1 142.7" className="ln" />
            <rect x="290" y="118" width="190" height="64" rx="4" className="ln fillsoft" />
            <text x="385" y="144" className="" textAnchor="middle">Frankfurt (de)</text>
            <text x="385" y="164" className="pt mut mono" textAnchor="middle">wg0 10.8.0.1 · IP público</text>
            <text x="385" y="164" className="en mut mono" textAnchor="middle">wg0 10.8.0.1 · public IP</text>
            <path d="M160 150L290 150" className="ln" />
            <path d="M283.0 153.5L290 150L283.0 146.5" className="ln" />
            <path d="M480 150L600 150" className="ln" />
            <path d="M593.0 153.5L600 150L593.0 146.5" className="ln" />
            <rect x="290" y="226" width="190" height="64" rx="4" className="ln fillsoft" />
            <text x="385" y="252" className="pt" textAnchor="middle">Virgínia (us)</text>
            <text x="385" y="252" className="en" textAnchor="middle">Virginia (us)</text>
            <text x="385" y="272" className="pt mut mono" textAnchor="middle">wg0 10.8.0.1 · IP público</text>
            <text x="385" y="272" className="en mut mono" textAnchor="middle">wg0 10.8.0.1 · public IP</text>
            <path d="M160 150L290 258" className="ln dash" />
            <path d="M282.4 256.2L290 258L286.9 250.8" className="ln" />
            <path d="M480 258L600 150" className="ln dash" />
            <path d="M597.1 157.3L600 150L592.5 152.1" className="ln" />
            <rect x="600" y="100" width="110" height="100" rx="4" className="ln fillsoft" />
            <text x="655" y="146" className="" textAnchor="middle">internet</text>
            <text x="655" y="166" className="pt mut" textAnchor="middle">seus sites</text>
            <text x="655" y="166" className="en mut" textAnchor="middle">your sites</text>
            <text x="225" y="140" className="pt mut mono" textAnchor="middle">túnel cifrado</text>
            <text x="225" y="140" className="en mut mono" textAnchor="middle">encrypted tunnel</text>
            <text x="540" y="140" className="pt mut mono" textAnchor="middle">IP do servidor</text>
            <text x="540" y="140" className="en mut mono" textAnchor="middle">server IP</text>
          </svg>
        </Diagram>
        <h3><T pt="A peça que faltava: o NAT no servidor" en="The missing piece: NAT on the server" /></h3>
        <p><T pt={<>Ligar o <code>ip_forward</code> só deixa o servidor <em>retransmitir</em> pacotes. Mas o seu notebook tem um IP <em>privado</em> da VPN (<code>10.8.0.2</code>), que a internet não sabe rotear de volta. O servidor precisa reescrever a origem de cada pacote para o IP público dele: isso é o <code>MASQUERADE</code>, o mesmo NAT que o seu roteador doméstico faz. Sem essa regra o handshake funciona e o <code>ping 10.8.0.1</code> responde, mas nenhum site abre. É também por isso que o IP "muda": o site vê o servidor, não você.</>} en={<>Turning on <code>ip_forward</code> only lets the server <em>relay</em> packets. But your laptop has a <em>private</em> VPN IP (<code>10.8.0.2</code>) that the internet cannot route back to. The server has to rewrite each packet’s source to its own public IP: that is <code>MASQUERADE</code>, the same NAT your home router does. Without this rule the handshake works and <code>ping 10.8.0.1</code> replies, but no website opens. It is also why your IP "changes": the site sees the server, not you.</>} /></p>
        <Diagram minWidth={620} caption={<T pt={<>O que muda o seu IP é o NAT do servidor, não o WireGuard em si. <code>203.0.113.10</code> é um IP de documentação, no lugar do IP real do seu servidor.</>} en={<>What changes your IP is the server’s NAT, not WireGuard itself. <code>203.0.113.10</code> is a documentation IP standing in for your server’s real IP.</>} />}>
          <svg viewBox="0 0 720 270" role="img" aria-label="O caminho de um pacote: notebook, servidor com NAT, site / A packet path: laptop, server with NAT, site">
            <rect x="10" y="20" width="150" height="80" rx="4" className="ln fillsoft" />
            <text x="85" y="50" className="pt" textAnchor="middle">notebook</text>
            <text x="85" y="50" className="en" textAnchor="middle">laptop</text>
            <text x="85" y="72" className="mut mono" textAnchor="middle">10.8.0.2</text>
            <rect x="270" y="10" width="190" height="100" rx="4" className="ln fillsoft" />
            <text x="365" y="38" className="pt" textAnchor="middle">servidor (de)</text>
            <text x="365" y="38" className="en" textAnchor="middle">server (de)</text>
            <text x="365" y="62" className="mut mono" textAnchor="middle">wg0 10.8.0.1</text>
            <text x="365" y="82" className="mut mono" textAnchor="middle">eth0 203.0.113.10</text>
            <rect x="570" y="20" width="140" height="80" rx="4" className="ln fillsoft" />
            <text x="640" y="50" className="" textAnchor="middle">example.com</text>
            <text x="640" y="72" className="pt mut" textAnchor="middle">o site</text>
            <text x="640" y="72" className="en mut" textAnchor="middle">the site</text>
            <path d="M160 60L270 60" className="ln" />
            <path d="M263.0 63.5L270 60L263.0 56.5" className="ln" />
            <path d="M460 60L570 60" className="ln" />
            <path d="M563.0 63.5L570 60L563.0 56.5" className="ln" />
            <text x="215" y="50" className="pt mut mono" textAnchor="middle">1. cifrado</text>
            <text x="215" y="50" className="en mut mono" textAnchor="middle">1. encrypted</text>
            <text x="515" y="50" className="mut mono" textAnchor="middle">2. NAT</text>
            <text x="10" y="150" className="pt" textAnchor="start">1. notebook: src 10.8.0.2 → dst example.com, tudo dentro do túnel cifrado</text>
            <text x="10" y="150" className="en" textAnchor="start">1. laptop: src 10.8.0.2 → dst example.com, all inside the encrypted tunnel</text>
            <text x="10" y="178" className="pt" textAnchor="start">2. servidor: decifra, encaminha (ip_forward) e o MASQUERADE troca o src por 203.0.113.10</text>
            <text x="10" y="178" className="en" textAnchor="start">2. server: decrypts, forwards (ip_forward) and MASQUERADE swaps the src for 203.0.113.10</text>
            <text x="10" y="206" className="pt" textAnchor="start">3. example.com: só enxerga 203.0.113.10 (o país do servidor) e responde para ele</text>
            <text x="10" y="206" className="en" textAnchor="start">3. example.com: only sees 203.0.113.10 (the server’s country) and replies to it</text>
            <text x="10" y="234" className="pt" textAnchor="start">4. servidor: desfaz o NAT (conntrack) e devolve a resposta cifrada ao notebook</text>
            <text x="10" y="234" className="en" textAnchor="start">4. server: undoes the NAT (conntrack) and returns the reply, encrypted, to the laptop</text>
          </svg>
        </Diagram>
        <h3><T pt="Passo 1 — Suba um servidor por país" en="Step 1 — Spin up one server per country" /></h3>
        <p><T pt={<>Para cada país que quiser, crie uma VM pequena (1 vCPU e 512 MB a 1 GB de RAM bastam para uso pessoal) com <strong>Ubuntu 24.04 LTS</strong>, na região desse país. Os nomes de região abaixo são os da AWS; outros provedores têm equivalentes.</>} en={<>For each country you want, create a small VM (1 vCPU and 512 MB to 1 GB of RAM is plenty for personal use) running <strong>Ubuntu 24.04 LTS</strong>, in that country’s region. The region names below are AWS’s; other providers have equivalents.</>} /></p>
        <Table
          head={[<T pt="País" en="Country" />, <T pt="Região (AWS)" en="Region (AWS)" />, <T pt="Perfil no cliente" en="Client profile" />]}
          rows={[
            [<T pt="Brasil" en="Brazil" />, <><code>sa-east-1</code> (São Paulo)</>, <code>br</code>],
            [<T pt="Alemanha" en="Germany" />, <><code>eu-central-1</code> (Frankfurt)</>, <code>de</code>],
            [<T pt="Estados Unidos" en="United States" />, <><code>us-east-1</code> (N. Virgínia)</>, <T pt={<><code>us</code></>} en={<><code>us</code></>} />],
            [<T pt="Japão" en="Japan" />, <><code>ap-northeast-1</code> (Tóquio)</>, <code>jp</code>],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<><strong>IP fixo:</strong> reserve um IP estático (na AWS, um <em>Elastic IP</em>). Sem isso o IP público muda quando a VM é parada e religada, e o <code>Endpoint</code> dos seus perfis para de funcionar.</>} en={<><strong>Fixed IP:</strong> reserve a static IP (on AWS, an <em>Elastic IP</em>). Without it the public IP changes when the VM is stopped and started, and your profiles’ <code>Endpoint</code> stops working.</>} /></li>
          <li><T pt={<><strong>Firewall da nuvem (security group):</strong> libere <code>UDP 51820</code> de qualquer origem, e <code>TCP 22</code> (SSH) só do seu IP.</>} en={<><strong>Cloud firewall (security group):</strong> allow <code>UDP 51820</code> from anywhere, and <code>TCP 22</code> (SSH) only from your IP.</>} /></li>
          <li><T pt={<>Se usar <code>ufw</code> no servidor: <code>sudo ufw allow 51820/udp</code>. As regras de <code>FORWARD</code> do script entram antes das do <code>ufw</code>.</>} en={<>If you use <code>ufw</code> on the server: <code>sudo ufw allow 51820/udp</code>. The script’s <code>FORWARD</code> rules go in ahead of <code>ufw</code>’s.</>} /></li>
        </ul>
        <h3><T pt="Passo 2 — O script do servidor (rode em cada um)" en="Step 2 — The server script (run it on each one)" /></h3>
        <p><T pt={<>Entre por SSH no servidor, salve o script abaixo como <code>setup-vpn-server.sh</code> e rode com <code>sudo bash setup-vpn-server.sh</code>. Ele instala tudo, cria a chave, liga o encaminhamento <em>de forma permanente</em>, configura o NAT (IPv4 e IPv6), sobe o DNS e deixa o WireGuard ligando sozinho no boot. Pode rodar de novo sem apagar seus peers.</>} en={<>SSH into the server, save the script below as <code>setup-vpn-server.sh</code> and run it with <code>sudo bash setup-vpn-server.sh</code>. It installs everything, creates the key, turns on forwarding <em>permanently</em>, sets up the NAT (IPv4 and IPv6), starts the DNS and makes WireGuard start on boot. You can re-run it without wiping your peers.</>} /></p>
        <CodeBlock>
          <span className="tok-c">#!/usr/bin/env bash</span>{"\n"}
          <span className="tok-c"># setup-vpn-server.sh — rode UMA vez em cada servidor (um por país): sudo bash setup-vpn-server.sh</span>{"\n"}
          {"set -euo pipefail\n"}
          {"[ \"$(id -u)\" -eq 0 ] || { echo \"rode com sudo\"; exit 1; }\n"}
          {"\n"}
          <span className="tok-c"># interface de saída para a internet (eth0, ens5, enp1s0...)</span>{"\n"}
          {"WAN=$(ip -o -4 route show to default | awk '{print $5}' | head -n1)\n"}
          {"echo \"interface de saída: $WAN\"\n"}
          {"\n"}
          {"apt-get update\n"}
          {"apt-get install -y wireguard unbound qrencode\n"}
          {"\n"}
          {"umask 077\n"}
          {"mkdir -p /etc/wireguard\n"}
          {"[ -f /etc/wireguard/server.key ] || wg genkey | tee /etc/wireguard/server.key | wg pubkey > /etc/wireguard/server.pub\n"}
          {"\n"}
          <span className="tok-c"># encaminhar pacotes: agora PERMANENTE (sobrevive ao reboot)</span>{"\n"}
          {"cat > /etc/sysctl.d/99-wg.conf <<EOF\n"}
          {"net.ipv4.ip_forward=1\n"}
          {"net.ipv6.conf.all.forwarding=1\n"}
          {"EOF\n"}
          {"sysctl --system > /dev/null\n"}
          {"\n"}
          <span className="tok-c"># configuração do WireGuard: só cria se ainda não existir (não apaga seus peers)</span>{"\n"}
          {"if [ ! -f /etc/wireguard/wg0.conf ]; then\n"}
          {"cat > /etc/wireguard/wg0.conf <<EOF\n"}
          {"[Interface]\n"}
          {"Address = 10.8.0.1/24, fd42:42:42::1/64\n"}
          {"ListenPort = 51820\n"}
          {"PrivateKey = $(cat /etc/wireguard/server.key)\n"}
          {"\n"}
          <span className="tok-c"># NAT: troca o IP de origem pelo IP público deste servidor</span>{"\n"}
          {"PostUp = iptables  -t nat -A POSTROUTING -s 10.8.0.0/24 -o $WAN -j MASQUERADE\n"}
          {"PostUp = ip6tables -t nat -A POSTROUTING -s fd42:42:42::/64 -o $WAN -j MASQUERADE\n"}
          <span className="tok-c"># deixa passar o tráfego da VPN para fora e as respostas de volta</span>{"\n"}
          {"PostUp = iptables  -I FORWARD -i %i -j ACCEPT\n"}
          {"PostUp = iptables  -I FORWARD -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n"}
          {"PostUp = ip6tables -I FORWARD -i %i -j ACCEPT\n"}
          {"PostUp = ip6tables -I FORWARD -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n"}
          {"\n"}
          {"PostDown = iptables  -t nat -D POSTROUTING -s 10.8.0.0/24 -o $WAN -j MASQUERADE\n"}
          {"PostDown = ip6tables -t nat -D POSTROUTING -s fd42:42:42::/64 -o $WAN -j MASQUERADE\n"}
          {"PostDown = iptables  -D FORWARD -i %i -j ACCEPT\n"}
          {"PostDown = iptables  -D FORWARD -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n"}
          {"PostDown = ip6tables -D FORWARD -i %i -j ACCEPT\n"}
          {"PostDown = ip6tables -D FORWARD -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n"}
          {"EOF\n"}
          {"fi\n"}
          {"\n"}
          <span className="tok-c"># DNS próprio, só para a VPN (ip-freebind: sobe mesmo antes do wg0 existir)</span>{"\n"}
          {"cat > /etc/unbound/unbound.conf.d/wg.conf <<EOF\n"}
          {"server:\n"}
          {"    interface: 10.8.0.1\n"}
          {"    access-control: 10.8.0.0/24 allow\n"}
          {"    ip-freebind: yes\n"}
          {"EOF\n"}
          {"systemctl enable --now unbound\n"}
          {"systemctl restart unbound\n"}
          {"\n"}
          {"systemctl enable --now wg-quick@wg0\n"}
          {"\n"}
          {"echo\n"}
          {"echo \"Pronto. Chave PÚBLICA deste servidor (vai nos perfis do cliente):\"\n"}
          {"cat /etc/wireguard/server.pub"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o script termina imprimindo a chave pública do servidor. Anote <em>essa chave e o IP público</em> de cada servidor. Confira: <code>sudo wg show</code> mostra a interface <code>wg0</code> escutando na porta 51820; <code>sudo iptables -t nat -S POSTROUTING</code> lista a regra <code>MASQUERADE</code>; <code>dig @10.8.0.1 example.com</code> responde.</>} en={<><strong>Expected result:</strong> the script ends by printing the server’s public key. Write down <em>that key and the public IP</em> of each server. Check: <code>sudo wg show</code> shows the <code>wg0</code> interface listening on port 51820; <code>sudo iptables -t nat -S POSTROUTING</code> lists the <code>MASQUERADE</code> rule; <code>dig @10.8.0.1 example.com</code> answers.</>} /></p>
        <h3><T pt="Passo 3 — Uma chave de cliente, registrada em todos os servidores" en="Step 3 — One client key, registered on every server" /></h3>
        <p><T pt={<>Truque que simplifica tudo: o notebook tem <em>um único par de chaves</em> e a mesma chave pública é cadastrada nos servidores de todos os países. Assim cada perfil só difere no <code>Endpoint</code> e na chave pública do servidor. A chave <em>privada</em> nunca sai do notebook.</>} en={<>A trick that simplifies everything: the laptop has <em>a single key pair</em> and the same public key is registered on the servers of every country. That way each profile only differs in the <code>Endpoint</code> and the server’s public key. The <em>private</em> key never leaves the laptop.</>} /></p>
        <CodeBlock>
          <span className="tok-c"># NO NOTEBOOK (uma vez só)</span>{"\n"}
          {"mkdir -p ~/vpn && cd ~/vpn\n"}
          {"umask 077\n"}
          {"wg genkey | tee laptop.key | wg pubkey > laptop.pub\n"}
          {"cat laptop.pub        "}<span className="tok-c"># copie esta chave pública</span>
        </CodeBlock>
        <p><T pt={<>Em <strong>cada servidor</strong>, salve e rode o script que cadastra o notebook como peer (o último argumento é o final do IP dele na VPN: <code>2</code> para o notebook, <code>3</code> para o celular, e assim por diante):</>} en={<>On <strong>each server</strong>, save and run the script that registers the laptop as a peer (the last argument is the end of its VPN IP: <code>2</code> for the laptop, <code>3</code> for the phone, and so on):</>} /></p>
        <CodeBlock>
          <span className="tok-c">#!/usr/bin/env bash</span>{"\n"}
          <span className="tok-c"># add-peer.sh NOME CHAVE_PUBLICA_DO_CLIENTE N (N = final do IP do cliente: 2, 3, 4...)</span>{"\n"}
          <span className="tok-c"># exemplo: sudo bash add-peer.sh notebook 'AbC...=' 2</span>{"\n"}
          {"set -euo pipefail\n"}
          {"NAME=$1; PUB=$2; N=$3\n"}
          {"\n"}
          <span className="tok-c"># vale já, sem derrubar ninguém...</span>{"\n"}
          {"wg set wg0 peer \"$PUB\" allowed-ips 10.8.0.$N/32,fd42:42:42::$N/128\n"}
          <span className="tok-c"># ...e fica gravado para o próximo reboot</span>{"\n"}
          {"cat >> /etc/wireguard/wg0.conf <<EOF\n"}
          {"\n"}
          {"[Peer]  "}<span className="tok-c"># $NAME</span>{"\n"}
          {"PublicKey = $PUB\n"}
          {"AllowedIPs = 10.8.0.$N/32, fd42:42:42::$N/128\n"}
          {"EOF\n"}
          {"echo \"peer $NAME adicionado: 10.8.0.$N\""}
        </CodeBlock>
        <CodeBlock>
          <span className="tok-c"># em cada servidor, depois de salvar o script como add-peer.sh:</span>{"\n"}
          {"sudo bash add-peer.sh notebook 'COLE_AQUI_O_CONTEUDO_DE_laptop.pub' 2"}
        </CodeBlock>
        <h3><T pt={<>Passo 4 — Um perfil por país e o comando <code>vpn</code></>} en={<>Step 4 — One profile per country and the <code>vpn</code> command</>} /></h3>
        <p><T pt="No notebook, gere um perfil por servidor. O script já traz o kill switch (também para IPv6) e o DNS do servidor:" en="On the laptop, generate one profile per server. The script already includes the kill switch (IPv6 too) and the server’s DNS:" /></p>
        <CodeBlock>
          <span className="tok-c">#!/usr/bin/env bash</span>{"\n"}
          <span className="tok-c"># make-profile.sh PAIS IP_DO_SERVIDOR CHAVE_PUBLICA_DO_SERVIDOR [N]</span>{"\n"}
          <span className="tok-c"># exemplo: bash make-profile.sh de 203.0.113.10 'XyZ...=' -&gt; /etc/wireguard/de.conf</span>{"\n"}
          {"set -euo pipefail\n"}
          {"CC=$1; ENDPOINT=$2; SERVER_PUB=$3; N=${4:-2}\n"}
          {"\n"}
          {"umask 077\n"}
          {"sudo tee /etc/wireguard/$CC.conf > /dev/null <<EOF\n"}
          {"[Interface]\n"}
          {"Address = 10.8.0.$N/24, fd42:42:42::$N/64\n"}
          {"PrivateKey = $(cat ~/vpn/laptop.key)\n"}
          {"DNS = 10.8.0.1\n"}
          <span className="tok-c"># kill switch: sem o túnel, sem internet (IPv4 e IPv6)</span>{"\n"}
          {"PostUp = iptables  -I OUTPUT ! -o %i -m mark ! --mark \\$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT\n"}
          {"PostUp = ip6tables -I OUTPUT ! -o %i -m mark ! --mark \\$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT\n"}
          {"PostDown = iptables  -D OUTPUT ! -o %i -m mark ! --mark \\$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT\n"}
          {"PostDown = ip6tables -D OUTPUT ! -o %i -m mark ! --mark \\$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT\n"}
          {"\n"}
          {"[Peer]\n"}
          {"PublicKey = $SERVER_PUB\n"}
          {"Endpoint = $ENDPOINT:51820\n"}
          {"AllowedIPs = 0.0.0.0/0, ::/0\n"}
          {"PersistentKeepalive = 25\n"}
          {"EOF\n"}
          {"echo \"perfil criado: /etc/wireguard/$CC.conf\""}
        </CodeBlock>
        <CodeBlock>
          <span className="tok-c"># um perfil por país (IP e chave pública que você anotou no Passo 2)</span>{"\n"}
          {"bash make-profile.sh br  IP_DO_SERVIDOR_BR  'CHAVE_PUBLICA_BR='\n"}
          {"bash make-profile.sh de  IP_DO_SERVIDOR_DE  'CHAVE_PUBLICA_DE='\n"}
          {"bash make-profile.sh us  IP_DO_SERVIDOR_US  'CHAVE_PUBLICA_US='"}
        </CodeBlock>
        <p><T pt={<>O nome do arquivo vira o nome da interface (<code>br</code>, <code>de</code>, <code>us</code>), e é isso que seleciona o país. Para trocar com um comando só, ponha esta função no <code>~/.bashrc</code> (abra um terminal novo depois):</>} en={<>The file name becomes the interface name (<code>br</code>, <code>de</code>, <code>us</code>), and that is what selects the country. To switch with one command, put this function in <code>~/.bashrc</code> (open a new terminal afterwards):</>} /></p>
        <CodeBlock>
          <span className="tok-c"># ~/.bashrc — vpn de | vpn br | vpn us | vpn off</span>{"\n"}
          {"vpn() {\n"}
          {"  for i in $(sudo wg show interfaces); do sudo wg-quick down \"$i\"; done\n"}
          {"  [ \"${1:-off}\" = off ] || sudo wg-quick up \"$1\"\n"}
          {"  curl -s -m 5 https://ipinfo.io/country || echo \"sem VPN / sem rede\"\n"}
          {"}"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> <code>vpn de</code> imprime <code>DE</code>; <code>vpn br</code> imprime <code>BR</code>; <code>vpn off</code> volta ao seu país de verdade. A troca derruba o túnel antigo e sobe o novo, então há uma janela de alguns segundos sem túnel durante a troca.</>} en={<><strong>Expected result:</strong> <code>vpn de</code> prints <code>DE</code>; <code>vpn br</code> prints <code>BR</code>; <code>vpn off</code> returns to your real country. Switching tears the old tunnel down and brings the new one up, so there is a window of a few seconds without a tunnel during the switch.</>} /></p>
        <h3><T pt="Passo 5 — Prove que funciona (e que não vaza)" en="Step 5 — Prove it works (and does not leak)" /></h3>
        <p><T pt={<>Com <code>vpn de</code> ligado, faça cada teste. Um VPN que "parece" funcionar mas vaza é pior do que nenhum, porque dá falsa segurança.</>} en={<>With <code>vpn de</code> on, run each test. A VPN that "seems" to work but leaks is worse than none, because it gives false security.</>} /></p>
        <CodeBlock>
          {"curl -s https://ipinfo.io            "}<span className="tok-c"># IP e país: devem ser os do SERVIDOR (203.0.113.10, DE)</span>{"\n"}
          {"curl -6 -s -m 5 https://ifconfig.co  "}<span className="tok-c"># IPv6: o IPv6 do servidor, ou ERRO. Nunca o seu IPv6 de casa</span>{"\n"}
          {"cat /etc/resolv.conf                 "}<span className="tok-c"># DNS deve ser 10.8.0.1 (ou o stub do sistema apontando para ele)</span>{"\n"}
          {"resolvectl status | grep -i 'DNS Server'   # confirma o DNS ativo na interface\n"}
          {"\n"}
          <span className="tok-c"># kill switch: derrube o túnel SEM desligar o firewall</span>{"\n"}
          {"sudo ip link set de down\n"}
          {"curl -m 5 https://ipinfo.io          "}<span className="tok-c"># tem que FALHAR (timeout/recusado), não mostrar seu IP real</span>{"\n"}
          {"sudo ip link set de up"}
        </CodeBlock>
        <Table
          head={[<T pt="Teste" en="Test" />, <T pt="Passou se..." en="Passes if..." />, <T pt="Se falhar" en="If it fails" />]}
          rows={[
            [<T pt="IP e país" en="IP and country" />, <T pt="mostra o IP e o país do servidor" en="shows the server’s IP and country" />, <T pt="NAT ausente ou túnel não é o padrão de rota: veja a tabela de problemas" en="missing NAT or tunnel is not the default route: see the troubleshooting table" />],
            [<T pt="DNS" en="DNS" />, <T pt={<><a href="https://www.dnsleaktest.com" rel="noopener">dnsleaktest.com</a> (teste "extended") lista só o DNS do servidor/provedor dele</>} en={<><a href="https://www.dnsleaktest.com" rel="noopener">dnsleaktest.com</a> ("extended" test) lists only the server’s / its provider’s DNS</>} />, <T pt={<>conferir <code>DNS = 10.8.0.1</code> no perfil e <code>unbound</code> ativo no servidor</>} en={<>check <code>DNS = 10.8.0.1</code> in the profile and <code>unbound</code> active on the server</>} />],
            [<T pt="IPv6" en="IPv6" />, <T pt="mostra IPv6 do servidor ou falha" en="shows the server’s IPv6 or fails" />, <T pt={<>o perfil precisa de <code>::/0</code> no <code>AllowedIPs</code> e do <code>ip6tables</code> no kill switch</>} en={<>the profile needs <code>::/0</code> in <code>AllowedIPs</code> and the <code>ip6tables</code> kill switch</>} />],
            [<T pt="Kill switch" en="Kill switch" />, <T pt="sem túnel, sem internet" en="no tunnel, no internet" />, <T pt={<>conferir <code>sudo iptables -S OUTPUT</code>: deve existir a regra <code>REJECT</code></>} en={<>check <code>sudo iptables -S OUTPUT</code>: the <code>REJECT</code> rule should be there</>} />],
          ]}
        />
        <h3><T pt="Celular: um QR code por país" en="Phone: one QR code per country" /></h3>
        <p><T pt={<>No app oficial do WireGuard (Android/iOS) você pode ter vários túneis salvos e ligar o que quiser com um toque: um por país. Use outra chave para o celular, cadastre-a em cada servidor com <code>add-peer.sh celular CHAVE 3</code>, monte um <code>.conf</code> por servidor (como o da seção anterior, mas com <code>Address = 10.8.0.3/24, fd42:42:42::3/64</code> e <code>AllowedIPs = 0.0.0.0/0, ::/0</code>) e gere um QR com <code>qrencode -t ansiutf8 &lt; br.conf</code>. No celular, ative "Always-on VPN" / "Bloquear conexões sem VPN" para ter o kill switch do sistema.</>} en={<>In the official WireGuard app (Android/iOS) you can save several tunnels and switch on whichever you want with one tap: one per country. Use a different key for the phone, register it on each server with <code>add-peer.sh phone KEY 3</code>, build one <code>.conf</code> per server (like the one in the previous section, but with <code>Address = 10.8.0.3/24, fd42:42:42::3/64</code> and <code>AllowedIPs = 0.0.0.0/0, ::/0</code>) and generate a QR with <code>qrencode -t ansiutf8 &lt; br.conf</code>. On the phone, turn on "Always-on VPN" / "Block connections without VPN" for the system kill switch.</>} /></p>
        <h3><T pt="Problemas comuns" en="Common problems" /></h3>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável e conserto" en="Likely cause and fix" />]}
          rows={[
            [<T pt="Handshake ok, mas nenhum site abre" en="Handshake OK, but no site opens" />, <T pt={<>falta o NAT, ou a interface <code>$WAN</code> está errada: <code>ip -o -4 route show to default</code> mostra a certa; refaça o <code>wg0.conf</code> e <code>sudo systemctl restart wg-quick@wg0</code></>} en={<>NAT missing, or the <code>$WAN</code> interface is wrong: <code>ip -o -4 route show to default</code> shows the right one; redo <code>wg0.conf</code> and <code>sudo systemctl restart wg-quick@wg0</code></>} />],
            [<T pt={<>Nunca há <code>latest handshake</code></>} en={<>There is never a <code>latest handshake</code></>} />, <T pt="UDP 51820 fechado no security group/firewall; IP público mudou (use IP fixo); chave pública trocada ou com espaço sobrando" en="UDP 51820 closed in the security group/firewall; public IP changed (use a fixed IP); public key swapped or with a stray space" />],
            [<T pt="Alguns sites travam, outros abrem" en="Some sites hang, others open" />, <T pt={<>MTU: ponha <code>MTU = 1280</code> no <code>[Interface]</code> do perfil e teste de novo</>} en={<>MTU: put <code>MTU = 1280</code> in the profile’s <code>[Interface]</code> and retest</>} />],
            [<T pt="Nomes não resolvem" en="Names do not resolve" />, <T pt={<><code>sudo systemctl status unbound</code> no servidor; confira <code>access-control</code> e <code>interface</code> em <code>wg.conf</code></>} en={<><code>sudo systemctl status unbound</code> on the server; check <code>access-control</code> and <code>interface</code> in <code>wg.conf</code></>} />],
            [<T pt={<><code>resolvconf: command not found</code> ao subir</>} en={<><code>resolvconf: command not found</code> on bring-up</>} />, <T pt={<>instale <code>resolvconf</code> (ou <code>systemd-resolved</code>) no notebook, pois o <code>wg-quick</code> usa isso para aplicar a linha <code>DNS</code></>} en={<>install <code>resolvconf</code> (or <code>systemd-resolved</code>) on the laptop, since <code>wg-quick</code> uses it to apply the <code>DNS</code> line</>} />],
            [<T pt="Site pede captcha ou bloqueia" en="Site shows captchas or blocks" />, <T pt="IP de datacenter: limite do método, não bug. Tente outro país/provedor" en="datacenter IP: a limit of the method, not a bug. Try another country/provider" />],
          ]}
        />
        <h3><T pt="Limites: o que isso protege e o que não protege" en="Limits: what this protects and what it does not" /></h3>
        <Table
          head={[<T pt="Ameaça" en="Threat" />, <T pt="Protege?" en="Protected?" />, <T pt="Por quê" en="Why" />]}
          rows={[
            [<T pt="Wi-Fi público e provedor de internet vendo seu tráfego" en="Public Wi-Fi and ISP seeing your traffic" />, <T pt="Sim" en="Yes" />, <T pt="só veem pacotes WireGuard cifrados até o seu servidor" en="they only see WireGuard packets, encrypted up to your server" />],
            [<T pt="Sites vendo seu IP e país reais" en="Sites seeing your real IP and country" />, <T pt="Sim" en="Yes" />, <T pt="veem o IP do servidor" en="they see the server’s IP" />],
            [<T pt="O trecho servidor → site" en="The server → site leg" />, <T pt="Não" en="No" />, <T pt="sai como o tráfego normal da internet: só HTTPS protege o conteúdo dali em diante" en="it leaves as ordinary internet traffic: only HTTPS protects the content from there on" />],
            [<T pt="O provedor de nuvem saber quem você é" en="The cloud provider knowing who you are" />, <T pt="Não" en="No" />, <T pt="há cadastro e cobrança; o IP do servidor é ligado à sua conta" en="there is an account and billing; the server IP is tied to your account" />],
            [<T pt="Ser anônimo" en="Being anonymous" />, <T pt="Não" en="No" />, <T pt="um IP fixo e só seu é fácil de correlacionar; para anonimato o desenho é outro (Tor)" en="a fixed, yours-alone IP is easy to correlate; anonymity is a different design (Tor)" />],
            [<T pt="Login em contas, cookies, fingerprint do navegador" en="Account logins, cookies, browser fingerprint" />, <T pt="Não" en="No" />, <T pt="identificam você mesmo com outro IP" en="they identify you even with another IP" />],
          ]}
        />
        <h3><T pt="Atalhos e alternativas" en="Shortcuts and alternatives" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Automatizar a criação:</strong> coloque o script do Passo 2 no <em>user data / cloud-init</em> da VM, e o servidor nasce pronto, sem SSH. Depois é só ler a chave pública (<code>cat /etc/wireguard/server.pub</code>) e cadastrar o cliente.</>} en={<><strong>Automating creation:</strong> put the Step 2 script in the VM’s <em>user data / cloud-init</em> and the server is born ready, with no SSH. Then just read the public key (<code>cat /etc/wireguard/server.pub</code>) and register the client.</>} /></li>
          <li><T pt={<><code>wg-easy</code>: um contêiner com painel web que gera perfis e QR codes, em vez dos scripts de <code>add-peer.sh</code>/<code>make-profile.sh</code>. Você ainda precisa de um servidor por país.</>} en={<><code>wg-easy</code>: a container with a web panel that generates profiles and QR codes, instead of the <code>add-peer.sh</code>/<code>make-profile.sh</code> scripts. You still need one server per country.</>} /></li>
          <li><T pt={<><code>Tailscale</code> com <em>exit node</em>: você escolhe qual máquina sua (por exemplo, a VM de cada país) vira a saída para a internet, sem abrir portas nem editar configs. Em troca, depende do serviço de coordenação deles.</>} en={<><code>Tailscale</code> with an <em>exit node</em>: you pick which of your machines (say, each country’s VM) becomes the way out to the internet, with no open ports and no config editing. In return, it depends on their coordination service.</>} /></li>
        </ul>
        <Callout icon="check"><T pt={<><strong>Checklist final:</strong> um servidor por país com IP fixo; <code>UDP 51820</code> aberto e SSH restrito; NAT e <code>ip_forward</code> permanentes; um perfil por país com <code>AllowedIPs = 0.0.0.0/0, ::/0</code>, DNS do servidor e kill switch; os cinco testes do Passo 5 passando; e uma VM desligada quando você não estiver usando aquele país.</>} en={<><strong>Final checklist:</strong> one server per country with a fixed IP; <code>UDP 51820</code> open and SSH restricted; permanent NAT and <code>ip_forward</code>; one profile per country with <code>AllowedIPs = 0.0.0.0/0, ::/0</code>, the server’s DNS and a kill switch; the Step 5 tests passing; and a VM switched off when you are not using that country.</>} /></Callout>
      </Section>
      <Section id="wireshark" title={<T pt="Wireshark e tcpdump: ver os pacotes" en="Wireshark and tcpdump: seeing the packets" />}>
        <p><T pt={<><code>tcpdump</code> captura pacotes no terminal; <code>Wireshark</code> faz o mesmo com uma interface gráfica para ler e filtrar o que foi capturado. Os dois leem a mesma coisa: os bytes que realmente passam pela sua placa de rede, camada por camada.</>} en={<><code>tcpdump</code> captures packets in the terminal; <code>Wireshark</code> does the same with a graphical interface to read and filter what was captured. Both read the same thing: the bytes that actually travel through your network card, layer by layer.</>} /></p>
        <h3><T pt="Instalar" en="Install" /></h3>
        <CodeBlock>
          {"sudo apt install tcpdump wireshark termshark   "}<span className="tok-c"># termshark = Wireshark no terminal</span>{"\n"}
          {"sudo usermod -aG wireshark $USER               "}<span className="tok-c"># captura sem sudo (requer novo login)</span>
        </CodeBlock>
        <h3><T pt="Exercício 1: ver um handshake TCP" en="Exercise 1: see a TCP handshake" /></h3>
        <CodeBlock>
          {"sudo tcpdump -i any -n port 80 -c 20 &          "}<span className="tok-c"># captura em segundo plano</span>{"\n"}
          {"curl -s http://example.com -o /dev/null\n"}
          {"wait"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> três linhas com flags <code>[S]</code>, <code>[S.]</code>, <code>[.]</code> (o SYN, SYN-ACK, ACK da seção de sessões), depois pacotes <code>[P.]</code> com dados, e no fim <code>[F.]</code> de cada lado fechando a conexão. É o diagrama da seção "Sessões", agora em bytes de verdade.</>} en={<><strong>Expected result:</strong> three lines with flags <code>[S]</code>, <code>[S.]</code>, <code>[.]</code> (the SYN, SYN-ACK, ACK from the sessions section), then <code>[P.]</code> data packets, and at the end <code>[F.]</code> from each side closing the connection. It is the "Sessions" diagram, now in real bytes.</>} /></p>
        <h3><T pt="Exercício 2: texto puro vs. cifrado" en="Exercise 2: plain text vs. encrypted" /></h3>
        <CodeBlock>
          {"sudo tcpdump -i any -n -A port 80 -c 30 &\n"}
          {"curl -s http://neverssl.com -o /dev/null\n"}
          {"wait\n"}
          <span className="tok-c"># compare:</span>{"\n"}
          {"sudo tcpdump -i any -n -A port 443 -c 30 &\n"}
          {"curl -s https://example.com -o /dev/null\n"}
          {"wait"}
        </CodeBlock>
        <Diagram minWidth={600} caption={<T pt={<><strong>Resultado esperado:</strong> a captura da porta 80 mostra a requisição HTTP em texto puro, inclusive o <code>Host</code>; a da 443 mostra só ruído — é o TLS funcionando. Isso é literalmente por que HTTPS existe.</>} en={<><strong>Expected result:</strong> the port-80 capture shows the HTTP request in plain text, including the <code>Host</code>; the 443 one shows only noise — that is TLS working. This is literally why HTTPS exists.</>} />}>
          <svg viewBox="0 0 640 150" role="img" aria-label="Texto puro vs. cifrado / Plain text vs. encrypted">
            <rect x="10" y="10" width="270" height="60" rx="4" className="ln fillsoft" />
            <text x="145.0" y="44.0" className="pt mono" textAnchor="middle">captura da porta 80 (HTTP)</text>
            <text x="145.0" y="44.0" className="en mono" textAnchor="middle">port 80 capture (HTTP)</text>
            <text x="20" y="90" className="mono">GET / HTTP/1.1</text>
            <text x="20" y="108" className="mono mut">Host: neverssl.com</text>
            <text x="20" y="126" className="pt mut">← tudo legível</text>
            <text x="20" y="126" className="en mut">← all readable</text>
            <rect x="350" y="10" width="270" height="60" rx="4" className="ln fillsoft" />
            <text x="485.0" y="44.0" className="pt mono" textAnchor="middle">captura da porta 443 (HTTPS)</text>
            <text x="485.0" y="44.0" className="en mono" textAnchor="middle">port 443 capture (HTTPS)</text>
            <text x="360" y="90" className="mono">\x17\x03\x03\x00\x45\xa2\xf1...</text>
            <text x="360" y="108" className="pt mut">(bytes sem sentido)</text>
            <text x="360" y="108" className="en mut">(meaningless bytes)</text>
            <text x="360" y="126" className="pt mut">← cifrado pelo TLS</text>
            <text x="360" y="126" className="en mut">← encrypted by TLS</text>
          </svg>
        </Diagram>
        <h3><T pt="Filtros essenciais" en="Essential filters" /></h3>
        <Table
          head={[<T pt="Filtro (Wireshark)" en="Filter (Wireshark)" />, <T pt="Mostra" en="Shows" />]}
          rows={[
            [<code>tcp.port == 443</code>, <T pt="tráfego HTTPS" en="HTTPS traffic" />],
            [<code>http</code>, <T pt="requisições e respostas HTTP decodificadas" en="decoded HTTP requests and responses" />],
            [<code>dns</code>, <T pt="consultas e respostas de DNS" en="DNS queries and responses" />],
            [<code>ip.addr == 10.8.0.1</code>, <T pt="tudo de/para um IP" en="everything to/from one IP" />],
            [<code>tcp.flags.syn == 1 &amp;&amp; tcp.flags.ack == 0</code>, <T pt="só os SYN iniciais (útil para achar varreduras de porta)" en="only the initial SYNs (useful for spotting port scans)" />],
          ]}
        />
        <CodeBlock>
          {"tcpdump -i any -n port 53                               "}<span className="tok-c"># equivalente em tcpdump</span>{"\n"}
          {"tcpdump -i any -n "}<span className="tok-s">"tcp[13] &amp; 2 != 0 and tcp[13] &amp; 16 = 0"</span>{"  "}<span className="tok-c"># só SYN (sem ACK) — filtro cru de bits</span>{"\n"}
          {"sudo tcpdump -i any -w captura.pcap                      "}<span className="tok-c"># salva para abrir no Wireshark depois</span>
        </CodeBlock>
      </Section>
      <Section id="firewall-lab" title={<T pt="Firewall: medir a defesa com o nmap" en="Firewall: measuring the defence with nmap" />}>
        <p><T pt={<>A nota de Linux explica a teoria do firewall. Aqui o exercício é fechar o laço: configurar uma regra e <em>provar</em> com o nmap que ela funciona, de fora para dentro.</>} en={<>The Linux note explains the firewall theory. Here the exercise is to close the loop: set a rule and <em>prove</em> with nmap that it works, from the outside in.</>} /></p>
        <h3><T pt="Exercício: negar por padrão e medir com nmap" en="Exercise: deny by default and measure with nmap" /></h3>
        <CodeBlock>
          <span className="tok-c"># ANTES: confirme o que está aberto hoje</span>{"\n"}
          {"sudo ss -tulpn\n"}
          {"nmap -p- localhost\n"}
          {"\n"}
          <span className="tok-c"># aplique uma política restritiva (ufw; veja a nota de Linux para nftables puro)</span>{"\n"}
          {"sudo ufw default deny incoming\n"}
          {"sudo ufw default allow outgoing\n"}
          {"sudo ufw allow 22/tcp          "}<span className="tok-c"># não se tranque fora se isto for remoto!</span>{"\n"}
          {"sudo ufw enable\n"}
          {"\n"}
          <span className="tok-c"># DEPOIS: meça de novo</span>{"\n"}
          {"nmap -p- localhost"}
        </CodeBlock>
        <Diagram minWidth={600} caption={<T pt="O nmap antes mostra tudo que estava escutando sem querer; depois, só o que você liberou de propósito." en="nmap before shows everything that was listening unintentionally; after, only what you opened on purpose." />}>
          <svg viewBox="0 0 660 180" role="img" aria-label="O antes e depois medidos pelo nmap / Before and after, measured by nmap">
            <rect x="10" y="10" width="160" height="50" rx="4" className="ln fillsoft" />
            <text x="90.0" y="39.0" className="pt" textAnchor="middle">antes</text>
            <text x="90.0" y="39.0" className="en" textAnchor="middle">before</text>
            <rect x="200" y="10" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="250" y="40" className="mono" textAnchor="middle">22 ssh</text>
            <rect x="310" y="10" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="360" y="40" className="mono" textAnchor="middle">80 http</text>
            <rect x="420" y="10" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="470" y="40" className="mono" textAnchor="middle">3000 app-dev</text>
            <rect x="530" y="10" width="100" height="50" rx="4" className="ln fillsoft" />
            <text x="580" y="40" className="mono" textAnchor="middle">5432 postgres</text>
            <rect x="10" y="110" width="160" height="50" rx="4" className="ln" />
            <text x="90.0" y="139.0" className="pt" textAnchor="middle">depois</text>
            <text x="90.0" y="139.0" className="en" textAnchor="middle">after</text>
            <rect x="200" y="110" width="100" height="50" rx="4" className="brandfill" />
            <text x="250" y="140" className="mono brandtext" textAnchor="middle">22 ssh</text>
            <rect x="310" y="110" width="100" height="50" rx="4" className="ln dash" />
            <text x="360" y="140" className="pt mut" textAnchor="middle">80 filtrada</text>
            <text x="360" y="140" className="en mut" textAnchor="middle">80 filtered</text>
            <rect x="420" y="110" width="100" height="50" rx="4" className="ln dash" />
            <text x="470" y="140" className="pt mut" textAnchor="middle">3000 filtrada</text>
            <text x="470" y="140" className="en mut" textAnchor="middle">3000 filtered</text>
            <rect x="530" y="110" width="100" height="50" rx="4" className="ln dash" />
            <text x="580" y="140" className="pt mut" textAnchor="middle">5432 filtrada</text>
            <text x="580" y="140" className="en mut" textAnchor="middle">5432 filtered</text>
          </svg>
        </Diagram>
        <p><T pt={<><strong>Resultado esperado:</strong> o segundo <code>nmap -p-</code> mostra só a porta 22 (ou as que você liberou de propósito); as outras aparecem como <code>filtered</code> em vez de <code>open</code>. Se alguma porta que você <em>queria</em> aberta sumiu, falta uma regra <code>ufw allow</code> para ela.</>} en={<><strong>Expected result:</strong> the second <code>nmap -p-</code> shows only port 22 (or whichever you opened on purpose); the others show as <code>filtered</code> instead of <code>open</code>. If a port you <em>wanted</em> open disappeared, it is missing a <code>ufw allow</code> rule.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Teste primeiro numa VM ou contêiner descartável. Se estiver numa máquina remota, confirme que a porta do SSH está liberada <em>antes</em> de ativar o <code>ufw</code>, ou abra uma segunda sessão para testar sem se trancar fora.</>} en={<>Test on a throwaway VM or container first. If you are on a remote machine, confirm the SSH port is allowed <em>before</em> enabling <code>ufw</code>, or open a second session to test without locking yourself out.</>} /></Callout>
      </Section>
      <Section id="arp-spoof" title={<T pt="ARP spoofing: se passar pelo roteador da sua própria rede" en="ARP spoofing: posing as your own network's router" />}>
        <p><T pt={<>ARP (Address Resolution Protocol) traduz um IP para o endereço MAC da placa de rede, numa LAN, mas não tem nenhuma autenticação: qualquer host pode anunciar "este IP é meu MAC" e os outros aceitam sem verificar. <em>ARP spoofing</em> (ou ARP poisoning) explora exatamente isso para se colocar no meio do tráfego de outra máquina — um ataque <em>man-in-the-middle</em> clássico, só dentro da sua própria LAN.</>} en={<>ARP (Address Resolution Protocol) translates an IP into a network card's MAC address on a LAN, but has no authentication at all: any host can announce "this IP is mine" and others accept it without checking. <em>ARP spoofing</em> (or ARP poisoning) exploits exactly that to insert itself into another machine's traffic — a classic <em>man-in-the-middle</em> attack, just inside your own LAN.</>} /></p>
        <Diagram minWidth={600} caption={<T pt={"Nenhum pacote \"quebra\" nada: ARP simplesmente confia em quem fala por último."} en={"No packet \"breaks\" anything: ARP simply trusts whoever speaks last."} />}>
          <svg viewBox="0 0 660 230" role="img" aria-label="ARP spoofing / ARP spoofing">
            <rect x="10" y="10" width="140" height="50" rx="4" className="ln fillsoft" />
            <text x="80" y="39" className="pt" textAnchor="middle">vítima</text>
            <text x="80" y="39" className="en" textAnchor="middle">victim</text>
            <rect x="260" y="10" width="140" height="50" rx="4" className="ln" />
            <text x="330" y="39" className="pt" textAnchor="middle">atacante</text>
            <text x="330" y="39" className="en" textAnchor="middle">attacker</text>
            <rect x="510" y="10" width="140" height="50" rx="4" className="ln fillsoft" />
            <text x="580" y="39" className="pt" textAnchor="middle">roteador real</text>
            <text x="580" y="39" className="en" textAnchor="middle">real router</text>
            <text x="330" y="90" className="pt mono" textAnchor="middle">"o IP do roteador é o MEU MAC"</text>
            <text x="330" y="90" className="en mono" textAnchor="middle">"the router's IP is MY MAC"</text>
            <path d="M260 50L150 50" className="ln" />
            <path d="M156.8 53.3L150 50L156.8 46.7" className="ln" />
            <path d="M400 50L510 50" className="ln" />
            <path d="M503.2 46.7L510 50L503.2 53.3" className="ln" />
            <text x="10" y="135" className="pt mut" textAnchor="start">O atacante manda ARP replies forjados para os dois lados; cada um passa a mandar</text>
            <text x="10" y="135" className="en mut" textAnchor="start">The attacker sends forged ARP replies to both sides; each one now sends its</text>
            <text x="10" y="153" className="pt mut" textAnchor="start">o tráfego do outro para o atacante, que o repassa (e pode ler ou alterar).</text>
            <text x="10" y="153" className="en mut" textAnchor="start">traffic for the other to the attacker, who forwards it on (and can read or alter it).</text>
            <rect x="10" y="175" width="640" height="40" rx="4" className="ln dash" />
            <text x="330" y="199" className="pt mut" textAnchor="middle">tráfego da vítima para a internet agora passa pelo atacante primeiro</text>
            <text x="330" y="199" className="en mut" textAnchor="middle">the victim's traffic to the internet now passes through the attacker first</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={"Faça este exercício só na sua própria rede doméstica ou numa rede Docker isolada, com dispositivos seus. Interceptar tráfego de terceiros, mesmo \"só para ver\", é crime na maioria dos países."} en={"Only do this exercise on your own home network or an isolated Docker network, with devices of your own. Intercepting someone else's traffic, even \"just to see\", is a crime in most countries."} /></Callout>
        <h3><T pt="Exercício: ver a tabela ARP mudar" en="Exercise: watch the ARP table change" /></h3>
        <CodeBlock>
          <span className="tok-c"># numa VM "vítima", confira a tabela ARP normal</span>{"\n"}
          {"ip neigh show                     "}<span className="tok-c"># mostra IP, MAC, interface de cada vizinho conhecido</span>{"\n"}
          {"\n"}
          <span className="tok-c"># numa segunda VM "atacante", na MESMA rede, instale o arpspoof (pacote dsniff)</span>{"\n"}
          {"sudo apt install dsniff\n"}
          {"sudo arpspoof -i eth0 -t IP_DA_VITIMA IP_DO_ROTEADOR   "}<span className="tok-c"># anuncia: "eu sou o roteador"</span>{"\n"}
          {"\n"}
          <span className="tok-c"># de volta na vítima, enquanto o comando acima roda:</span>{"\n"}
          {"ip neigh show                     "}<span className="tok-c"># o MAC associado ao IP do roteador mudou?</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o MAC associado ao IP do roteador na tabela ARP da vítima passa a ser o MAC da máquina atacante, sem nenhum alerta visível — é exatamente por isso que o ataque funciona tão bem. Combine com o Wireshark da seção anterior (filtro <code>arp</code>) para ver os ARP replies forjados chegando repetidamente.</>} en={<><strong>Expected result:</strong> the MAC associated with the router's IP in the victim's ARP table becomes the attacker machine's MAC, with no visible warning — this is exactly why the attack works so well. Pair it with the Wireshark from the previous section (<code>arp</code> filter) to see the forged ARP replies arriving repeatedly.</>} /></p>
        <h3><T pt="Defesa: detectar e, onde possível, travar" en="Defence: detect, and lock down where you can" /></h3>
        <Table
          head={[<T pt="Controle" en="Control" />, <T pt="Como funciona" en="How it works" />]}
          rows={[
            [<code>arpwatch</code>, <T pt="daemon que observa a rede e avisa (por e-mail/log) quando um IP troca de MAC — detecta o spoofing em segundos" en="a daemon that watches the network and alerts (email/log) when an IP changes MAC — detects spoofing within seconds" />],
            [<T pt="ARP estático para hosts críticos" en="Static ARP for critical hosts" />, <><code>ip neigh add IP lladdr MAC nud permanent dev eth0</code> fixa o MAC do roteador/gateway, ignorando qualquer ARP reply forjado</>],
            [<T pt="Dynamic ARP Inspection (DAI)" en="Dynamic ARP Inspection (DAI)" />, <T pt={"recurso de switches gerenciados (Cisco, muitos domésticos \"prosumer\"): só aceita ARP replies que casam com o DHCP conhecido"} en={"a managed-switch feature (Cisco, many \"prosumer\" home switches): only accepts ARP replies that match known DHCP leases"} />],
            [<T pt="VPN de ponta a ponta (WireGuard, acima)" en="End-to-end VPN (WireGuard, above)" />, <T pt="não impede o spoofing, mas o tráfego dentro do túnel já está cifrado — o atacante no meio só vê ruído" en="does not stop the spoofing, but traffic inside the tunnel is already encrypted — the attacker in the middle only sees noise" />],
          ]}
        />
        <CodeBlock>
          {"sudo apt install arpwatch\n"}
          {"sudo systemctl enable --now arpwatch\n"}
          <span className="tok-c"># gere o spoof de novo (exercício acima) e observe:</span>{"\n"}
          {"sudo journalctl -u arpwatch -f    "}<span className="tok-c"># ou /var/log/syslog, dependendo da distro</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>arpwatch</code> registra uma linha <code>changed ethernet address</code> para o IP do roteador, com o MAC antigo e o novo — o mesmo evento que, numa rede de verdade, dispararia um alerta para o time de segurança.</>} en={<><strong>Expected result:</strong> <code>arpwatch</code> logs a <code>changed ethernet address</code> line for the router's IP, with the old and new MAC — the same event that, on a real network, would fire an alert to the security team.</>} /></p>
      </Section>
      <Section id="recon" title={<T pt="O kit de reconhecimento, com limites" en="The recon kit, with limits" />}>
        <p><T pt="Um time de segurança (e um atacante) usa um kit pequeno e bem conhecido. Conhecer os nomes e para que servem já tira o mistério; usá-los de verdade exige sempre o mesmo limite: sistemas seus ou autorização explícita por escrito (um contrato de pentest, uma competição de CTF, um laboratório próprio)." en="A security team (and an attacker) uses a small, well-known kit. Knowing the names and what they are for already removes the mystery; actually using them always requires the same boundary: your own systems or explicit written authorization (a pentest contract, a CTF competition, your own lab)." /></p>
        <Table
          head={[<T pt="Ferramenta" en="Tool" />, <T pt="Para quê" en="What it is for" />, <T pt="Já viu nesta nota?" en="Seen in this note?" />]}
          rows={[
            [<code>nmap</code>, <T pt="descobrir hosts e portas" en="discovering hosts and ports" />, <T pt="sim" en="yes" />],
            [<><code>Wireshark</code> / <code>tcpdump</code></>, <T pt="ler o tráfego" en="reading traffic" />, <T pt="sim" en="yes" />],
            [<><code>netcat</code> (<code>nc</code>)</>, <T pt="canivete de rede: testar portas, mandar/ouvir bytes crus" en="network Swiss Army knife: testing ports, sending/listening raw bytes" />, <T pt="nota de Linux" en="Linux note" />],
            [<T pt={<><em>Scanners de vulnerabilidade</em> (Nessus, OpenVAS)</>} en={<><em>Vulnerability scanners</em> (Nessus, OpenVAS)</>} />, <T pt="comparam serviços e versões com um banco de falhas conhecidas" en="compare services and versions against a database of known flaws" />, <T pt="não (fora do 80/20)" en="no (outside the 80/20)" />],
            [<T pt={<><em>Proxies de aplicação web</em> (Burp Suite, OWASP ZAP)</>} en={<><em>Web app proxies</em> (Burp Suite, OWASP ZAP)</>} />, <T pt="interceptam e editam requisições HTTP para testar uma aplicação" en="intercept and edit HTTP requests to test an application" />, <T pt="não" en="no" />],
            [<T pt={<><em>Testadores de senha</em> (Hydra, John the Ripper)</>} en={<><em>Password testers</em> (Hydra, John the Ripper)</>} />, <T pt="tentam credenciais ou quebram hashes para medir a força de senhas" en="try credentials or crack hashes to measure password strength" />, <T pt="não" en="no" />],
            [<T pt={<><em>Frameworks de exploração</em> (Metasploit)</>} en={<><em>Exploitation frameworks</em> (Metasploit)</>} />, <T pt="automatizam o uso de falhas conhecidas contra um alvo autorizado" en="automate using known flaws against an authorized target" />, <T pt="não" en="no" />],
          ]}
        />
        <Callout icon="check"><T pt={<>Esse kit é literalmente o currículo de certificações defensivas como CompTIA Security+ e do caminho de pentest como o eJPT/OSCP — e também o que times de "blue team" usam ao contrário, para caçar essas mesmas ferramentas sendo usadas contra eles nos logs. Se quiser praticar de verdade, plataformas como <a href="https://tryhackme.com" rel="noopener">TryHackMe</a> e <a href="https://www.hackthebox.com" rel="noopener">Hack The Box</a> dão alvos de propósito, de forma legal.</>} en={<>This kit is literally the curriculum of defensive certifications like CompTIA Security+ and of the pentest path like eJPT/OSCP — and also what "blue team" defenders use in reverse, hunting for these same tools being used against them in the logs. If you want to practice for real, platforms like <a href="https://tryhackme.com" rel="noopener">TryHackMe</a> and <a href="https://www.hackthebox.com" rel="noopener">Hack The Box</a> give you purpose-built, legal targets.</>} /></Callout>
        <h3><T pt={"O único exercício seguro de \"ataque\": força bruta contra o seu próprio SSH"} en={"The one safe \"attack\" exercise: brute force against your own SSH"} /></h3>
        <CodeBlock>
          <span className="tok-c"># no seu laboratório: veja as tentativas de login falharem, do lado do SERVIDOR</span>{"\n"}
          {"sudo journalctl -u ssh -f &\n"}
          <span className="tok-c"># de outro terminal, erre a senha de propósito algumas vezes</span>{"\n"}
          {"ssh ana@localhost   "}<span className="tok-c"># digite qualquer coisa errada, 3x</span>{"\n"}
          {"\n"}
          <span className="tok-c"># instale e observe o fail2ban reagir</span>{"\n"}
          {"sudo apt install fail2ban\n"}
          {"sudo systemctl enable --now fail2ban\n"}
          {"sudo fail2ban-client status sshd"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o journal mostra <code>Failed password</code> para cada tentativa; depois de configurar o <code>fail2ban</code> (padrão: 5 tentativas), o IP some de <code>fail2ban-client status sshd</code> e entra na lista de banidos — tente de novo e a conexão nem completa o handshake TCP.</>} en={<><strong>Expected result:</strong> the journal shows <code>Failed password</code> for each attempt; after setting up <code>fail2ban</code> (default: 5 attempts), the IP shows up in <code>fail2ban-client status sshd</code>'s ban list — try again and the connection does not even complete the TCP handshake.</>} /></p>
      </Section>
      <Section id="docker-net" title={<T pt="Docker para o laboratório local" en="Docker for the local lab" />}>
        <p><T pt={<>Para praticar com duas ou mais "máquinas" sem comprar duas máquinas, o jeito mais rápido é o Docker. Mas a rede de um contêiner <em>não é</em> a rede de uma máquina real, e isso confunde muita gente quando o laboratório não se comporta como esperado. Esta seção explica as duas, nessa ordem.</>} en={<>To practice with two or more "machines" without buying two machines, the fastest way is Docker. But a container's network is <em>not</em> a real machine's network, and that confuses a lot of people when the lab does not behave as expected. This section explains both, in that order.</>} /></p>
        <h3><T pt="Sem Docker: como é numa máquina de verdade" en="Without Docker: how it is on a real machine" /></h3>
        <Diagram minWidth={700} caption={<T pt={"A rede \"de verdade\": uma interface, um firewall, hardware real entre as máquinas."} en={"The \"real\" network: one interface, one firewall, real hardware between machines."} />}>
          <svg viewBox="0 0 810 150" role="img" aria-label="Rede sem Docker / Network without Docker">
            <rect x="10" y="20" width="150" height="60" rx="4" className="ln fillsoft" />
            <text x="85.0" y="47.0" className="pt" textAnchor="middle">sua máquina</text>
            <text x="85.0" y="47.0" className="en" textAnchor="middle">your machine</text>
            <text x="85.0" y="63.0" className="pt mut mono" textAnchor="middle">processos</text>
            <text x="85.0" y="63.0" className="en mut mono" textAnchor="middle">processes</text>
            <rect x="220" y="20" width="150" height="60" rx="4" className="ln" />
            <text x="295.0" y="54.0" className="pt" textAnchor="middle">placa de rede (NIC)</text>
            <text x="295.0" y="54.0" className="en" textAnchor="middle">network card (NIC)</text>
            <rect x="430" y="20" width="150" height="60" rx="4" className="ln fillsoft" />
            <text x="505.0" y="54.0" className="pt" textAnchor="middle">switch físico</text>
            <text x="505.0" y="54.0" className="en" textAnchor="middle">physical switch</text>
            <rect x="640" y="20" width="150" height="60" rx="4" className="ln fillsoft" />
            <text x="715.0" y="54.0" className="pt" textAnchor="middle">roteador / internet</text>
            <text x="715.0" y="54.0" className="en" textAnchor="middle">router / internet</text>
            <path d="M170 50L220 50" className="ln" />
            <path d="M212.8 53.5L220 50L212.8 46.5" className="ln" />
            <path d="M380 50L430 50" className="ln" />
            <path d="M422.8 53.5L430 50L422.8 46.5" className="ln" />
            <path d="M590 50L640 50" className="ln" />
            <path d="M632.8 53.5L640 50L632.8 46.5" className="ln" />
            <text x="10" y="110" className="pt mut">Um IP real por NIC. O firewall do Linux (netfilter) decide o que entra e sai nessa única interface.</text>
            <text x="10" y="110" className="en mut">One real IP per NIC. Linux's firewall (netfilter) decides what comes in and out through that one interface.</text>
            <text x="10" y="130" className="pt mut">Outra máquina na rede fala com você por um switch e um cabo/Wi-Fi físicos — há hardware real no meio.</text>
            <text x="10" y="130" className="en mut">Another machine on the network talks to you through a physical switch and cable/Wi-Fi — there is real hardware in between.</text>
          </svg>
        </Diagram>
        <h3><T pt="Com Docker: uma rede inteira simulada dentro da sua máquina" en="With Docker: a whole network simulated inside your machine" /></h3>
        <Diagram minWidth={680} caption={<T pt={<>Namespaces de rede dão a cada contêiner sua própria pilha de rede (interfaces, rotas, regras); o <code>docker0</code> os liga como um switch e faz NAT para o mundo de fora.</>} en={<>Network namespaces give each container its own network stack (interfaces, routes, rules); <code>docker0</code> links them like a switch and NATs them out to the world.</>} />}>
          <svg viewBox="0 0 720 275" role="img" aria-label="Rede do Docker / Docker networking">
            <rect x="10" y="10" width="700" height="250" rx="4" className="ln dash" />
            <text x="24" y="32" className="pt mut" textAnchor="start">sua máquina (host)</text>
            <text x="24" y="32" className="en mut" textAnchor="start">your machine (host)</text>
            <rect x="30" y="60" width="120" height="50" rx="4" className="ln" />
            <text x="90" y="80" className="" textAnchor="middle">eth0</text>
            <text x="90" y="98" className="pt mut mono" textAnchor="middle">IP real</text>
            <text x="90" y="98" className="en mut mono" textAnchor="middle">real IP</text>
            <rect x="250" y="60" width="170" height="50" rx="4" className="ln fillsoft" />
            <text x="335" y="80" className="" textAnchor="middle">docker0 (bridge)</text>
            <text x="335" y="98" className="mut mono" textAnchor="middle">172.17.0.1</text>
            <path d="M150 85L250 85" className="ln" />
            <path d="M243.2 81.7L250 85L243.2 88.3" className="ln" />
            <rect x="560" y="60" width="130" height="50" rx="4" className="ln" />
            <text x="625" y="90" className="mono" textAnchor="middle">-p 8080:80</text>
            <path d="M560 85L420 85" className="ln dash" />
            <path d="M426.8 88.3L420 85L426.8 81.7" className="ln" />
            <text x="490" y="76" className="mut" textAnchor="middle">NAT</text>
            <rect x="210" y="170" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="285" y="190" className="pt" textAnchor="middle">contêiner A</text>
            <text x="285" y="190" className="en" textAnchor="middle">container A</text>
            <text x="285" y="208" className="mut mono" textAnchor="middle">172.17.0.2</text>
            <rect x="400" y="170" width="150" height="50" rx="4" className="ln fillsoft" />
            <text x="475" y="190" className="pt" textAnchor="middle">contêiner B</text>
            <text x="475" y="190" className="en" textAnchor="middle">container B</text>
            <text x="475" y="208" className="mut mono" textAnchor="middle">172.17.0.3</text>
            <path d="M300 110L285 170" className="ln" />
            <path d="M289.8 164.2L285 170L283.5 162.7" className="ln" />
            <path d="M370 110L475 170" className="ln" />
            <path d="M470.8 163.8L475 170L467.5 169.5" className="ln" />
            <text x="24" y="246" className="pt mut" textAnchor="start">docker0 é um switch de software; cada contêiner ganha um par "veth" (um cabo de rede virtual).</text>
            <text x="24" y="246" className="en mut" textAnchor="start">docker0 is a software switch; each container gets a "veth" pair (a virtual network cable).</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<T pt="Namespace de rede" en="Network namespace" />, <T pt="uma pilha de rede isolada por processo/contêiner: suas próprias interfaces, rotas e regras de firewall" en="an isolated network stack per process/container: its own interfaces, routes and firewall rules" />],
            [<T pt="veth pair" en="veth pair" />, <T pt={"um \"cabo\" de rede virtual com duas pontas: uma dentro do contêiner, outra ligada ao bridge"} en={"a virtual network \"cable\" with two ends: one inside the container, one plugged into the bridge"} />],
            [<T pt={<>Bridge (<code>docker0</code>)</>} en={<>Bridge (<code>docker0</code>)</>} />, <T pt="um switch de software que liga os contêineres entre si e ao host" en="a software switch that links containers to each other and to the host" />],
            [<T pt={<><code>-p 8080:80</code></>} en={<><code>-p 8080:80</code></>} />, <T pt="uma regra de NAT: tráfego na porta 8080 do HOST é redirecionado para a 80 do contêiner" en="a NAT rule: traffic on the HOST's port 8080 is redirected to the container's port 80" />],
            [<T pt="DNS embutido" en="Embedded DNS" />, <T pt="o Docker roda um DNS interno (127.0.0.11) para contêineres se acharem pelo nome do serviço" en="Docker runs an internal DNS server (127.0.0.11) so containers find each other by service name" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>A diferença que mais confunde: dois contêineres na mesma rede Docker se enxergam <em>direto</em>, sem passar pelo firewall do host — o netfilter do host só vê o tráfego que cruza para fora do bridge. Isso também já apareceu na nota de Linux: regras do Docker ficam numa cadeia própria (<code>DOCKER-USER</code>) e podem abrir uma porta ao mundo <em>mesmo com o ufw negando</em>. Nunca assuma que um firewall de host protege contêineres sem conferir.</>} en={<>The most confusing difference: two containers on the same Docker network see each other <em>directly</em>, without going through the host firewall — the host's netfilter only sees traffic that crosses out of the bridge. This also showed up in the Linux note: Docker's rules live in their own chain (<code>DOCKER-USER</code>) and can open a port to the world <em>even with ufw denying it</em>. Never assume a host firewall protects containers without checking.</>} /></Callout>
        <h3><T pt={"Laboratório: duas \"máquinas\" em contêineres"} en={"Lab: two \"machines\" in containers"} /></h3>
        <CodeBlock>
          {"mkdir lab-rede && cd lab-rede\n"}
          {"cat > docker-compose.yml <<"}<span className="tok-s">'EOF'</span>{"\n"}
          {"services:\n"}
          {"  alvo:\n"}
          {"    image: nginx\n"}
          {"    networks: [lab]\n"}
          {"  ferramentas:\n"}
          {"    image: instrumentisto/nmap     "}<span className="tok-c"># já vem com nmap, tcpdump, curl</span>{"\n"}
          {"    networks: [lab]\n"}
          {"    command: sleep infinity\n"}
          {"networks:\n"}
          {"  lab:\n"}
          {"    driver: bridge\n"}
          {"EOF\n"}
          {"docker compose up -d\n"}
          {"docker compose exec ferramentas nmap alvo          "}<span className="tok-c"># escaneia pelo NOME (o DNS embutido resolve)</span>{"\n"}
          {"docker compose exec ferramentas sh -c "}<span className="tok-s">"nc -zv alvo 80 &amp;&amp; echo OK"</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> <code>nmap alvo</code> resolve o nome pelo DNS interno do Docker e mostra <code>80/tcp open</code>, mesmo sem nenhum <code>-p</code> no <code>docker-compose.yml</code> — porque, <em>dentro</em> da rede <code>lab</code>, os contêineres se enxergam direto, sem precisar publicar porta nenhuma. Compare com o exercício de nmap da seção anterior, feito do HOST contra a porta publicada: são dois cenários diferentes, e é exatamente essa diferença que costuma confundir.</>} en={<><strong>Expected result:</strong> <code>nmap alvo</code> resolves the name through Docker's internal DNS and shows <code>80/tcp open</code>, even with no <code>-p</code> at all in <code>docker-compose.yml</code> — because, <em>inside</em> the <code>lab</code> network, the containers see each other directly, with no port to publish. Compare this with the nmap exercise from the previous section, done from the HOST against the published port: these are two different scenarios, and that difference is exactly what usually trips people up.</>} /></p>
        <h3><T pt="Onde a simulação para" en="Where the simulation stops" /></h3>
        <Table
          head={[<T pt="No contêiner" en="In the container" />, <T pt="Numa máquina/nuvem real" en="On a real machine/cloud" />]}
          rows={[
            [<T pt={"Um \"cabo\" virtual (veth) sem latência real"} en={"A virtual \"cable\" (veth) with no real latency"} />, <T pt="cabo, Wi-Fi ou fibra de verdade, com latência, perda de pacote e limite de banda reais" en="a real cable, Wi-Fi or fibre, with real latency, packet loss and bandwidth limits" />],
            [<T pt={<>Um switch de software (<code>docker0</code>) sem ARP de verdade</>} en={<>A software switch (<code>docker0</code>) with no real ARP</>} />, <T pt="um switch físico (ou uma VPC na nuvem) com tabelas ARP, VLANs, possivelmente outros inquilinos" en="a physical switch (or a cloud VPC) with ARP tables, VLANs, possibly other tenants" />],
            [<T pt="Firewall do host pode nem ver o tráfego entre contêineres" en="Host firewall may not even see inter-container traffic" />, <T pt="grupos de segurança/NACLs da nuvem, e o firewall do SO, realmente filtram cada pacote" en="cloud security groups/NACLs, and the OS firewall, really filter every packet" />],
            [<T pt={<>IP muda a cada <code>docker compose up</code></>} en={<>IP changes on every <code>docker compose up</code></>} />, <T pt="IP costuma ser estável (ou um Elastic IP/DNS gerenciado)" en="IP is usually stable (or a managed Elastic IP/DNS)" />],
          ]}
        />
        <p><T pt="Use contêineres para aprender comandos e ler saídas sem custo. Para medir o que um atacante real veria — latência, firewall de verdade, uma rota pela internet — volte para uma VM real ou de nuvem (nota de AWS) de vez em quando." en="Use containers to learn commands and read output at no cost. To measure what a real attacker would see — latency, a real firewall, a route across the actual internet — go back to a real or cloud VM (AWS note) every so often." /></p>
      </Section>
      <Section id="cheat-sec" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Comando" en="Command" />]}
          rows={[
            [<T pt="ver conexões TCP abertas" en="see open TCP connections" />, <code>ss -tn state established</code>],
            [<T pt="escanear minha própria máquina" en="scan my own machine" />, <code>nmap -sV -p- localhost</code>],
            [<T pt="abrir um túnel SSH para um serviço remoto" en="open an SSH tunnel to a remote service" />, <code>ssh -L porta_local:localhost:porta ana@servidor</code>],
            [<T pt="subir minha VPN" en="bring my VPN up" />, <><code>sudo wg-quick up wg0</code> · <code>sudo wg show</code></>],
            [<T pt="capturar um handshake TCP" en="capture a TCP handshake" />, <code>sudo tcpdump -i any -n port 80 -c 20</code>],
            [<T pt="provar que o firewall funciona" en="prove the firewall works" />, <><code>nmap -p- localhost</code> antes e depois do <code>ufw enable</code></>],
            [<T pt="ver o Docker simular uma rede" en="see Docker simulate a network" />, <code>docker network inspect bridge</code>],
            [<T pt="ver a tabela ARP e fixar uma entrada" en="see the ARP table and pin an entry" />, <><code>ip neigh show</code> · <code>ip neigh add IP lladdr MAC nud permanent dev eth0</code></>],
            [<T pt="detectar ARP spoofing" en="detect ARP spoofing" />, <code>sudo systemctl enable --now arpwatch</code>],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Resposta" en="Answer" />]}
          rows={[
            [<T pt={"Por que o TCP é \"com estado\" e o UDP não?"} en={"Why is TCP \"stateful\" and UDP is not?"} />, <T pt="TCP abre uma conexão com handshake e numera/reenvia bytes; UDP manda datagramas independentes, sem conexão." en="TCP opens a connection with a handshake and numbers/resends bytes; UDP sends independent datagrams, with no connection." />],
            [<T pt={"O que significa uma porta aparecer \"filtered\" no nmap?"} en={"What does a port showing \"filtered\" in nmap mean?"} />, <T pt="O pacote de teste não teve resposta nenhuma — geralmente um firewall descartando, em vez de recusar." en="The test packet got no reply at all — usually a firewall dropping it instead of refusing it." />],
            [<T pt={<>Qual a diferença entre <code>ssh -L</code> e <code>ssh -R</code>?</>} en={<>What is the difference between <code>ssh -L</code> and <code>ssh -R</code>?</>} />, <T pt={<><code>-L</code> leva uma porta sua até o lado de lá; <code>-R</code> leva uma porta de lá até o seu lado.</>} en={<><code>-L</code> carries a port of yours to the far side; <code>-R</code> carries a port from the far side to you.</>} />],
            [<T pt="Por que o WireGuard manda pacotes de keepalive?" en="Why does WireGuard send keepalive packets?" />, <T pt="Porque é UDP, sem sessão; sem keepalive, o NAT no meio do caminho esquece a tradução depois de um tempo." en="Because it is UDP, with no session; without keepalives, NAT along the way forgets the translation after a while." />],
            [<T pt="Como o Wireshark prova que o HTTPS funciona?" en="How does Wireshark prove HTTPS works?" />, <T pt="Uma captura da porta 443 mostra só bytes sem sentido, enquanto a da porta 80 mostra a requisição em texto puro." en="A port-443 capture shows only meaningless bytes, while the port-80 one shows the request in plain text." />],
            [<T pt={<>Dois contêineres no mesmo <code>docker-compose.yml</code> precisam de <code>-p</code> para se enxergar?</>} en={<>Do two containers in the same <code>docker-compose.yml</code> need <code>-p</code> to see each other?</>} />, <T pt={<>Não: na mesma rede Docker eles se enxergam direto pelo nome do serviço; <code>-p</code> é só para expor ao HOST.</>} en={<>No: on the same Docker network they see each other directly by service name; <code>-p</code> is only to expose to the HOST.</>} />],
            [<T pt="Que ferramentas requerem autorização explícita antes de usar?" en="Which tools require explicit authorization before use?" />, <T pt="Praticamente todas desta nota contra sistemas que não são seus: nmap, testadores de senha, frameworks de exploração." en="Practically all of this note's tools, against systems that are not yours: nmap, password testers, exploitation frameworks." />],
            [<T pt="Por que o ARP spoofing funciona sem explorar nenhum bug?" en="Why does ARP spoofing work without exploiting any bug?" />, <T pt="O protocolo ARP não tem autenticação: ele confia no último ARP reply recebido para cada IP." en="The ARP protocol has no authentication: it trusts the last ARP reply received for each IP." />],
          ]}
        />
        <h3><T pt="Fontes recomendadas" en="Recommended sources" /></h3>
        <p><T pt="Os livros abaixo aprofundam cada ferramenta desta nota." en="The books below go deeper into each tool in this note." /></p>
      </Section>
      <Sources
        links={[
          { label: "Gordon \"Fyodor\" Lyon. Nmap Network Scanning. Nmap Project (free online book).", href: "https://nmap.org/book/" },
          { label: "Jason A. Donenfeld. WireGuard: Next Generation Kernel Network Tunnel (whitepaper).", href: "https://www.wireguard.com/papers/wireguard.pdf" },
          { label: "Chris Sanders. Practical Packet Analysis, 3rd edition. No Starch Press, 2017.", href: "https://nostarch.com/packetanalysis3" },
          { label: "Charles M. Kozierok. The TCP/IP Guide. No Starch Press.", href: "https://nostarch.com/tcpipguide" },
          { label: "Richard Bejtlich. The Practice of Network Security Monitoring. No Starch Press, 2013.", href: "https://nostarch.com/network-security-monitoring" },
          { label: "Docker documentation. Networking overview.", href: "https://docs.docker.com/network/" },
          { label: "Michael Kerrisk. The Linux Programming Interface, ch. 56-61 (sockets). No Starch Press, 2010.", href: "https://nostarch.com/tlpi" },
          { label: "nftables wiki. Official documentation for the Linux firewall used behind ufw.", href: "https://wiki.nftables.org/" },
          { label: "fail2ban documentation. Log-based intrusion prevention for SSH and other services.", href: "https://github.com/fail2ban/fail2ban" },
          { label: "arpwatch (LBNL). Ethernet/FDDI station activity monitor used to detect ARP spoofing.", href: "https://ee.lbl.gov/" },
          { label: "CompTIA Security+ exam objectives (for the defensive side of this toolkit).", href: "https://www.comptia.org/certifications/security" },
        ]}
      />
    </>
  );
}
