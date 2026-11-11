import { Callout, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "ethical-hacking-ceh-practice",
  title: { en: "Ethical hacking: where to practise, TryHackMe and the CEH", pt: "Hacking ético: onde praticar, TryHackMe e a CEH" },
  seo: {
    title: { en: "Ethical hacking: where to practise, TryHackMe and the CEH", pt: "Hacking ético: onde praticar, TryHackMe e a CEH" },
    description: { en: "A learning map: legal practice platforms (TryHackMe, Hack The Box, PortSwigger, OverTheWire), what the EC-Council CEH is, how to prepare for it or use it as a syllabus, and alternatives.", pt: "Um mapa de aprendizado: plataformas legais de prática (TryHackMe, Hack The Box, PortSwigger, OverTheWire), o que é a CEH do EC-Council, como se preparar para ela ou usá-la como currículo, e alternativas." },
  },
  summary: "legal practice platforms (TryHackMe, Hack The Box, PortSwigger, OverTheWire), what the EC-Council CEH is, how to prepare or use it as a syllabus, and alternatives such as Security+, eJPT, PNPT and OSCP.",
  kicker: { en: "Learning path", pt: "Trilha de estudo" },
  heroTitle: { en: <>Ethical hacking: <em>practise, then certify.</em></>, pt: <>Hacking ético: <em>pratique, depois certifique.</em></> },
  heroLede: { en: "Where to practise legally, in which order, what the EC-Council CEH is and how to prepare for it (or just use it as a syllabus), and the other certifications worth comparing.", pt: "Onde praticar de forma legal, em que ordem, o que é a CEH do EC-Council e como se preparar (ou só usá-la como currículo), e as outras certificações que vale comparar." },
  published: "2026-10-23",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro-eh", title: <T pt="Antes de começar: pratique antes de certificar" en="Before you start: practise before you certify" /> },
        { id: "platforms", title: <T pt="Onde praticar, de forma legal" en="Where to practise, legally" /> },
        { id: "ceh", title: <T pt="O que é a CEH do EC-Council" en="What the EC-Council CEH is" /> },
        { id: "ceh-prep", title: <T pt="Como se preparar, ou só usá-la como currículo" en="How to prepare, or just use it as a syllabus" /> },
        { id: "alternatives", title: <T pt="Alternativas: Security+, eJPT, PNPT, OSCP" en="Alternatives: Security+, eJPT, PNPT, OSCP" /> },
        { id: "cheat-eh", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro-eh" title={<T pt="Antes de começar: pratique antes de certificar" en="Before you start: practise before you certify" />}>
        <p><T pt={<>As notas anteriores desta trilha (<a href="/notas/network-attack-defense/">ataque e defesa em redes</a>, <a href="/notas/web-host-attack-defense/">ataque e defesa web e de servidor</a>, <a href="/notas/social-engineering/">engenharia social</a>) ensinam as técnicas num laboratório Docker seu. Esta nota é diferente: é um mapa de <em>onde continuar praticando</em>, de forma legal e estruturada, e de <em>como a indústria mede</em> esse conhecimento através de certificações — com a <a href="https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" rel="noopener">Certified Ethical Hacker (CEH)</a> do EC-Council como referência central, por ser a certificação de "hacking ético" mais reconhecida fora do círculo técnico (RH, editais públicos, muitos países exigem-na para cargos de segurança governamentais).</>} en={<>The previous notes in this path (<a href="/notas/network-attack-defense/">network attack and defence</a>, <a href="/notas/web-host-attack-defense/">web and host attack and defence</a>, <a href="/notas/social-engineering/">social engineering</a>) teach the techniques in a Docker lab of your own. This note is different: it is a map of <em>where to keep practising</em>, legally and in a structured way, and of <em>how the industry measures</em> that knowledge through certifications — with the EC-Council's <a href="https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" rel="noopener">Certified Ethical Hacker (CEH)</a> as the central reference, since it is the best-known "ethical hacking" certification outside technical circles (HR, public job postings, and several countries require it for government security roles).</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={"\"Hacking ético\" significa sempre a mesma coisa: autorização explícita por escrito, ou uma plataforma que a dá de propósito (as desta nota). A certificação não muda essa regra — ela avalia conhecimento, não concede permissão para testar sistemas de terceiros."} en={"\"Ethical hacking\" always means the same thing: explicit written authorization, or a platform that grants it on purpose (the ones in this note). The certification does not change that rule — it assesses knowledge, it does not grant permission to test third-party systems."} /></Callout>
      </Section>
      <Section id="platforms" title={<T pt="Onde praticar, de forma legal" en="Where to practise, legally" />}>
        <p><T pt="Todas as plataformas abaixo dão alvos feitos de propósito para serem atacados, de forma legal. A ordem sugerida vai do mais guiado ao mais livre." en="Every platform below gives you purpose-built targets to attack, legally. The suggested order goes from most guided to most open-ended." /></p>
        <Table
          head={[<T pt="Plataforma" en="Platform" />, <T pt="Formato" en="Format" />, <T pt="Melhor para" en="Best for" />]}
          rows={[
            [<a href="https://overthewire.org/wargames/" rel="noopener">OverTheWire Wargames</a>, <T pt="desafios de linha de comando via SSH, gratuitos" en="free SSH command-line challenges" />, <T pt="fundamentos de Linux e lógica de exploração, antes de tudo" en="Linux fundamentals and exploitation logic, before anything else" />],
            [<a href="https://portswigger.net/web-security" rel="noopener">PortSwigger Web Security Academy</a>, <T pt="labs interativos, gratuitos, com o Burp Suite" en="free, interactive labs with Burp Suite" />, <T pt="falhas de aplicação web em profundidade (o que a nota de web e host cobre no 80/20)" en="web application flaws in depth (the 80/20 the web-and-host note covers)" />],
            [<a href="https://tryhackme.com" rel="noopener">TryHackMe</a>, <T pt="salas guiadas, passo a passo, com teoria embutida" en="guided, step-by-step rooms with built-in theory" />, <T pt={"quem está começando: o caminho \"Jr Penetration Tester\" é a continuação natural desta trilha"} en={"beginners: the \"Jr Penetration Tester\" path is the natural continuation of this track"} />],
            [<a href="https://www.hackthebox.com" rel="noopener">Hack The Box</a>, <T pt="máquinas inteiras, menos guiadas, estilo CTF" en="whole machines, less guided, CTF-style" />, <T pt={"depois do TryHackMe: menos teoria, mais \"descubra você mesmo\""} en={"after TryHackMe: less theory, more \"figure it out yourself\""} />],
            [<a href="https://ctftime.org" rel="noopener">CTFtime</a>, <T pt="calendário de competições CTF (Capture The Flag) ao vivo, em equipe" en="calendar of live, team-based CTF (Capture The Flag) competitions" />, <T pt="praticar sob pressão de tempo e junto de outras pessoas" en="practising under time pressure, alongside other people" />],
          ]}
        />
        <Callout icon="check"><T pt="Todas essas plataformas são o mesmo princípio desta trilha, só escaladas: alvos feitos para ter falhas, autorização dada de propósito, nenhuma delas substitui as outras — combine OverTheWire/PortSwigger para teoria aplicada e TryHackMe/HTB para prática livre." en="All of these platforms follow the same principle as this path, just scaled up: targets built to have flaws, authorization given on purpose, none of them replaces the others — combine OverTheWire/PortSwigger for applied theory and TryHackMe/HTB for open-ended practice." /></Callout>
      </Section>
      <Section id="ceh" title={<T pt="O que é a CEH do EC-Council" en="What the EC-Council CEH is" />}>
        <p><T pt={<>A <strong>Certified Ethical Hacker (CEH)</strong>, hoje na versão CEH v13 (também vendida como "CEH AI"), é a certificação de hacking ético do <a href="https://www.eccouncil.org" rel="noopener">EC-Council</a>. Ela segue um framework próprio de quatro etapas: <strong>Learn</strong> (20 módulos e 221 laboratórios práticos), <strong>Certify</strong> (os exames abaixo), <strong>Engage</strong> (um exercício simulado de quatro fases num cyber range) e <strong>Compete</strong> (acesso a 12 desafios de CTF por um ano).</>} en={<>The <strong>Certified Ethical Hacker (CEH)</strong>, currently version CEH v13 (also marketed as "CEH AI"), is the <a href="https://www.eccouncil.org" rel="noopener">EC-Council</a>'s ethical hacking certification. It follows its own four-stage framework: <strong>Learn</strong> (20 modules and 221 hands-on labs), <strong>Certify</strong> (the exams below), <strong>Engage</strong> (a simulated four-phase exercise in a cyber range) and <strong>Compete</strong> (a year of access to 12 CTF challenges).</>} /></p>
        <Table
          head={[<T pt="Item" en="Item" />, <T pt="Exame de conhecimento" en="Knowledge exam" />, <T pt="Exame prático (opcional)" en="Practical exam (optional)" />]}
          rows={[
            [<T pt="Formato" en="Format" />, <T pt="125 questões de múltipla escolha" en="125 multiple-choice questions" />, <T pt="20 desafios práticos reais" en="20 real-world practical challenges" />],
            [<T pt="Duração" en="Duration" />, "4 horas", "6 horas"],
            [<T pt="Onde" en="Where" />, <T pt="online, pelo portal de exames do EC-Council" en="online, via the EC-Council's exam portal" />, <T pt="cyber range iLabs" en="iLabs cyber range" />],
            [<T pt="Nota de corte" en="Passing score" />, "60%–85%", "60%–85%"],
          ]}
        />
        <p><T pt={<>Passar só no exame de conhecimento já concede a certificação CEH; passar também no exame prático concede o título de <strong>CEH Master</strong>. Não há pré-requisito formal, mas o EC-Council recomenda fortemente pelo menos dois anos de experiência em segurança de TI; quem não os tem é direcionado à sua "Cybersecurity Essentials Series" introdutória.</>} en={<>Passing just the knowledge exam already grants the CEH certification; passing the practical exam too grants the <strong>CEH Master</strong> title. There is no formal prerequisite, but the EC-Council strongly recommends at least two years of IT security experience; those without it are pointed to its introductory "Cybersecurity Essentials Series".</>} /></p>
      </Section>
      <Section id="ceh-prep" title={<T pt="Como se preparar, ou só usá-la como currículo" en="How to prepare, or just use it as a syllabus" />}>
        <p><T pt="Você não precisa pagar pela CEH para se beneficiar dela: os 20 módulos do seu currículo público (reconhecimento, varredura, enumeração, hacking de sistema, malware, sniffing, engenharia social, negação de serviço, sequestro de sessão, evasão de IDS/firewall, hacking de servidores e aplicações web, SQL injection, redes sem fio, mobile, IoT, computação em nuvem e criptografia) cobrem quase exatamente o que as notas desta trilha ensinam, na mesma ordem. Use-o como um checklist de lacunas." en="You do not need to pay for the CEH to benefit from it: the 20 modules of its public syllabus (reconnaissance, scanning, enumeration, system hacking, malware, sniffing, social engineering, denial of service, session hijacking, evading IDS/firewalls, hacking web servers and applications, SQL injection, wireless networks, mobile, IoT, cloud computing and cryptography) cover almost exactly what this path's notes teach, in the same order. Use it as a gap checklist." /></p>
        <Table
          head={[<T pt="Módulo típico da CEH" en="Typical CEH module" />, <T pt="Onde esta trilha já cobre" en="Where this path already covers it" />]}
          rows={[
            [<T pt="Reconhecimento, varredura, enumeração" en="Reconnaissance, scanning, enumeration" />, <a href="/notas/network-attack-defense/"><T pt="Ataque e defesa em redes" en="Network attack and defence" /></a>],
            [<T pt="Sniffing, hacking de sistema, sequestro de sessão" en="Sniffing, system hacking, session hijacking" />, <><a href="/notas/network-attack-defense/"><T pt="Ataque e defesa em redes" en="Network attack and defence" /></a> + <a href="/notas/crypto-keys-ssh/"><T pt="Criptografia e chaves" en="Cryptography and keys" /></a></>],
            [<T pt="Hacking de servidores/aplicações web, SQL injection" en="Hacking web servers/applications, SQL injection" />, <a href="/notas/web-host-attack-defense/"><T pt="Ataque e defesa web e de servidor" en="Web and host attack and defence" /></a>],
            [<T pt="Engenharia social" en="Social engineering" />, <a href="/notas/social-engineering/"><T pt="Engenharia social" en="Social engineering" /></a>],
            [<T pt="Evasão de IDS/firewall, negação de serviço" en="Evading IDS/firewalls, denial of service" />, <><a href="/notas/network-attack-defense/"><T pt="Ataque e defesa em redes" en="Network attack and defence" /></a> (firewall e monitoramento)</>],
            [<T pt="Computação em nuvem, mobile, IoT, sem fio" en="Cloud computing, mobile, IoT, wireless" />, <T pt="fora do escopo desta trilha; procure cursos dedicados por área" en="outside this path's scope; look for dedicated courses per area" />],
          ]}
        />
        <p><T pt="Se a meta for de fato o certificado (exigência de vaga, edital público, mercado de outro país), o caminho prático é: treine nas plataformas da seção anterior, use o currículo acima para achar lacunas específicas (nuvem, mobile, wireless), e só então pague pelo exame — o EC-Council vende o treinamento oficial, mas ele não é obrigatório para fazer a prova." en="If the certificate itself is the actual goal (a job requirement, a public tender, another country's job market), the practical path is: train on the previous section's platforms, use the syllabus above to find specific gaps (cloud, mobile, wireless), and only then pay for the exam — the EC-Council sells official training, but it is not required to sit the exam." /></p>
      </Section>
      <Section id="alternatives" title={<T pt="Alternativas: Security+, eJPT, PNPT, OSCP" en="Alternatives: Security+, eJPT, PNPT, OSCP" />}>
        <p><T pt="A CEH é majoritariamente teórica (múltipla escolha, mais o exame prático opcional). Quem quer uma prova 100% prática, mais respeitada tecnicamente, costuma olhar para estas outras." en="The CEH is mostly theoretical (multiple choice, plus the optional practical exam). Those who want a 100% hands-on exam, more technically respected, usually look at these instead." /></p>
        <Table
          head={[<T pt="Certificação" en="Certification" />, <T pt="Formato" en="Format" />, <T pt="Nível" en="Level" />]}
          rows={[
            [<a href="https://www.comptia.org/certifications/security" rel="noopener">CompTIA Security+</a>, <T pt="múltipla escolha, conceitos gerais de segurança" en="multiple choice, general security concepts" />, <T pt="iniciante, sem pré-requisitos" en="entry-level, no prerequisites" />],
            [<a href="https://www.ine.com/certifications/ejpt-certification" rel="noopener">eJPT (INE)</a>, <T pt="prática, num ambiente controlado, mais barata" en="hands-on, in a controlled environment, cheaper" />, <T pt="iniciante-intermediário" en="beginner-to-intermediate" />],
            [<a href="https://www.thecybermentor.com/pnpt" rel="noopener">PNPT (TCM Security)</a>, <T pt="um pentest completo simulado, com relatório escrito avaliado" en="a full simulated pentest, with a written report that gets graded" />, <T pt="intermediário" en="intermediate" />],
            [<a href="https://www.offsec.com/courses/pen-200/" rel="noopener">OSCP (OffSec)</a>, <T pt="24 horas de exame prático contra várias máquinas reais" en="24-hour practical exam against several real machines" />, <T pt="avançado, referência do mercado de pentest" en="advanced, the pentest market's benchmark" />],
          ]}
        />
        <p><T pt={"Uma progressão razoável para quem vem desta trilha: Security+ (vocabulário e conceitos, se ainda faltar), depois eJPT ou a CEH (conhecimento amplo, com ou sem o exame prático), depois PNPT ou OSCP quando já tiver prática real acumulada nas plataformas da seção \"Onde praticar\"."} en={"A reasonable progression coming from this path: Security+ (vocabulary and concepts, if still missing), then eJPT or the CEH (broad knowledge, with or without the practical exam), then PNPT or OSCP once you have real practice accumulated on the \"Where to practise\" platforms."} /></p>
      </Section>
      <Section id="cheat-eh" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola: qual caminho seguir" en="Cheat sheet: which path to follow" /></h3>
        <Table
          head={[<T pt="Se você…" en="If you…" />, <T pt="Comece por" en="Start with" />]}
          rows={[
            [<T pt="nunca usou a linha de comando do Linux de verdade" en="have never really used the Linux command line" />, "OverTheWire Wargames"],
            [<T pt="quer aprofundar falhas de aplicação web" en="wants to go deep on web application flaws" />, "PortSwigger Web Security Academy"],
            [<T pt="quer um currículo guiado, passo a passo" en="wants a guided, step-by-step syllabus" />, "TryHackMe"],
            [<T pt={"já tem alguma base e quer \"descobrir sozinho\""} en={"already has some base and wants to \"figure it out alone\""} />, "Hack The Box"],
            [<T pt="precisa de um certificado reconhecido por RH/edital" en="needs a certificate recognised by HR/a public tender" />, "CEH"],
            [<T pt="quer a prova mais respeitada tecnicamente" en="wants the most technically respected exam" />, "OSCP"],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="A CEH exige experiência prévia?" en="Does the CEH require prior experience?" />, <T pt="Não formalmente; o EC-Council recomenda dois anos de experiência e direciona quem não os tem a um curso introdutório." en="Not formally; the EC-Council recommends two years of experience and points those without it to an introductory course." />],
            [<T pt="Qual a diferença entre CEH e CEH Master?" en="What is the difference between CEH and CEH Master?" />, <T pt="CEH exige só o exame de conhecimento; CEH Master exige também passar no exame prático de 20 desafios." en="CEH requires only the knowledge exam; CEH Master also requires passing the 20-challenge practical exam." />],
            [<T pt="Por que praticar em TryHackMe/HTB antes de pagar por uma certificação?" en="Why practise on TryHackMe/HTB before paying for a certification?" />, <T pt="São gratuitos ou baratos, dão prática real e ajudam a identificar lacunas antes de investir num exame." en="They are free or cheap, give real practice and help identify gaps before investing in an exam." />],
            [<T pt="Qual certificação é mais prática: CEH ou OSCP?" en="Which certification is more hands-on: CEH or OSCP?" />, <T pt="OSCP: um exame prático de 24 horas contra máquinas reais, sem componente de múltipla escolha." en="OSCP: a 24-hour practical exam against real machines, with no multiple-choice component." />],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "EC-Council. Certified Ethical Hacker (CEH) — official program page.", href: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" },
          { label: "TryHackMe. Guided, hands-on security training rooms.", href: "https://tryhackme.com" },
          { label: "Hack The Box. CTF-style penetration testing labs.", href: "https://www.hackthebox.com" },
          { label: "PortSwigger Web Security Academy. Free web security training.", href: "https://portswigger.net/web-security" },
          { label: "OverTheWire. Wargames for learning security concepts via SSH.", href: "https://overthewire.org/wargames/" },
          { label: "OffSec. PEN-200 / OSCP certification.", href: "https://www.offsec.com/courses/pen-200/" },
          { label: "CompTIA Security+ certification.", href: "https://www.comptia.org/certifications/security" },
          { label: "CTFtime. Calendar and archive of CTF competitions.", href: "https://ctftime.org" },
        ]}
      />
    </>
  );
}
