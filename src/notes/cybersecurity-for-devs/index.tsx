import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "cybersecurity-for-devs",
  title: { en: "Security for developers: where to start", pt: "Segurança para quem programa: por onde começar" },
  seo: {
    title: { en: "Cybersecurity for developers: where to start", pt: "Cibersegurança para quem programa: por onde começar" },
    description: { en: "The map of cybersecurity for developers: red, blue and purple team, AppSec and cloud; the core concepts (CIA, STRIDE, CVE, ATT&CK); a five-stage study path; portfolio projects; where to learn; certifications; ethics and law; and a 90-day plan.", pt: "O mapa da cibersegurança para quem programa: red, blue e purple team, AppSec e nuvem; os conceitos essenciais (CIA, STRIDE, CVE, ATT&CK); uma trilha de estudo em cinco etapas; projetos de portfólio; onde aprender; certificações; ética e lei; e um plano de 90 dias." },
  },
  summary: "the entry point to the security series: the map of the field (red, blue, purple team, AppSec, cloud), core concepts (CIA, STRIDE, CVE/CWE/CVSS, ATT&CK), a five-stage study path, eight portfolio projects (scanning, CI security, a home SOC with Suricata and Wazuh, Sigma rules), where to learn, certifications, ethics and law, and a 90-day plan.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Cybersecurity for developers, <em>where to start.</em></>, pt: <>Cibersegurança para quem programa, <em>por onde começar.</em></> },
  heroLede: { en: "The map of the field, the concepts that matter, a five-stage study path, portfolio projects and where to learn, written for people who already program.", pt: "O mapa da área, os conceitos que importam, uma trilha de estudo em cinco etapas, projetos de portfólio e onde aprender, escrito para quem já programa." },
  published: "2026-10-20",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro-cs", title: <T pt="Antes de começar: o mapa" en="Before you start: the map" /> },
        { id: "concepts-cs", title: <T pt="Os conceitos que sustentam tudo" en="The concepts that hold everything up" /> },
        { id: "paths-cs", title: <T pt="Os caminhos: red, blue, purple e AppSec" en="The paths: red, blue, purple and AppSec" /> },
        { id: "roadmap-cs", title: <T pt="A trilha em cinco etapas" en="The path in five stages" /> },
        { id: "projects-cs", title: <T pt="Projetos práticos para o portfólio" en="Practical projects for your portfolio" /> },
        { id: "learn-cs", title: <T pt="Onde aprender" en="Where to learn" /> },
        { id: "ethics-cs", title: <T pt="Ética e lei" en="Ethics and law" /> },
        { id: "plan-cs", title: <T pt="Um plano de 90 dias" en="A 90-day plan" /> },
        { id: "cheat-cs", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro-cs" title={<T pt="Antes de começar: o mapa" en="Before you start: the map" />}>
        <p><T pt={<>Cibersegurança parece um território único, mas é um conjunto de ofícios com perguntas diferentes: <em>como eu quebro isto?</em> (red team), <em>como eu percebo que quebraram?</em> (blue team) e <em>como eu construo de um jeito que seja difícil de quebrar?</em> (segurança de aplicações). Quem já programa começa com uma vantagem real: entende como o software é montado, onde as suposições escondem falhas e como um deploy funciona. Esta nota é o ponto de entrada da série de segurança do site: o mapa, os conceitos, uma trilha de estudo, projetos para o portfólio e onde aprender.</>} en={<>Cybersecurity looks like one territory, but it is a set of crafts that ask different questions: <em>how do I break this?</em> (red team), <em>how do I notice someone broke it?</em> (blue team) and <em>how do I build it so it is hard to break?</em> (application security). Anyone who already programs starts with a real advantage: you understand how software is assembled, where assumptions hide flaws and how a deploy works. This note is the entry point to the site's security series: the map, the concepts, a study path, portfolio projects and where to learn.</>} /></p>
        <Diagram minWidth={680} caption={<T pt="Red e blue se encontram no purple team; a base de AppSec e DevSecOps reduz o trabalho dos dois." en="Red and blue meet in purple; the AppSec and DevSecOps base reduces the work of both." />}>
          <svg viewBox="0 0 760 190" role="img" aria-label="O mapa da cibersegurança / The cybersecurity map">
            <rect x="10" y="10" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="120.0" y="33.0" className="pt" textAnchor="middle">Red team</text>
            <text x="120.0" y="33.0" className="en" textAnchor="middle">Red team</text>
            <text x="120.0" y="51.0" className="pt" textAnchor="middle">atacar para provar</text>
            <text x="120.0" y="51.0" className="en" textAnchor="middle">attack to prove</text>
            <path d="M230 38L270 38" className="ln" />
            <path d="M263.2 34.7L270 38L263.2 41.3" className="ln" />
            <rect x="270" y="10" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="380.0" y="33.0" className="pt" textAnchor="middle">Purple team</text>
            <text x="380.0" y="33.0" className="en" textAnchor="middle">Purple team</text>
            <text x="380.0" y="51.0" className="pt" textAnchor="middle">compartilhar o que aprendeu</text>
            <text x="380.0" y="51.0" className="en" textAnchor="middle">share what was learned</text>
            <path d="M490 38L530 38" className="ln" />
            <path d="M523.2 34.7L530 38L523.2 41.3" className="ln" />
            <rect x="530" y="10" width="220" height="56" rx="4" className="ln fillsoft" />
            <text x="640.0" y="33.0" className="pt" textAnchor="middle">Blue team</text>
            <text x="640.0" y="33.0" className="en" textAnchor="middle">Blue team</text>
            <text x="640.0" y="51.0" className="pt" textAnchor="middle">detectar e responder</text>
            <text x="640.0" y="51.0" className="en" textAnchor="middle">detect and respond</text>
            <rect x="10" y="100" width="740" height="46" rx="4" className="ln fillsoft" />
            <text x="380.0" y="127.0" className="pt" textAnchor="middle">AppSec · DevSecOps · segurança em nuvem: construir seguro desde o início (onde o dev entra)</text>
            <text x="380.0" y="127.0" className="en" textAnchor="middle">AppSec · DevSecOps · cloud security: build it secure from the start (where the developer enters)</text>
            <text x="10" y="176" className="pt mut" textAnchor="start">Os três de cima descobrem e corrigem; o de baixo evita que o problema nasça.</text>
            <text x="10" y="176" className="en mut" textAnchor="start">The top three find and fix; the bottom one stops the problem being born.</text>
          </svg>
        </Diagram>
        <h3><T pt="O que você já sabe e vira segurança" en="What you already know that turns into security" /></h3>
        <Table
          head={[<T pt="Habilidade de dev" en="Developer skill" />, <T pt="Vira, em segurança…" en="Becomes, in security…" />]}
          rows={[
            [<T pt="code review" en="code review" />, <T pt="revisão de código seguro: procurar entrada não confiável chegando a uma consulta, a um comando ou ao HTML" en="secure code review: looking for untrusted input reaching a query, a command or the HTML" />],
            [<T pt="testes automatizados" en="automated tests" />, <T pt="testes de segurança e fuzzing: o caso de teste é a entrada hostil" en="security tests and fuzzing: the test case is the hostile input" />],
            [<T pt="CI/CD" en="CI/CD" />, <T pt="DevSecOps: varredura de segredos, dependências e código a cada push" en="DevSecOps: scanning for secrets, dependencies and code on every push" />],
            [<T pt="logs e observabilidade" en="logs and observability" />, <T pt="detecção: o mesmo log que depura um bug mostra um ataque, se alguém olhar" en="detection: the same log that debugs a bug shows an attack, if someone looks" />],
            [<T pt="post-mortem de incidente" en="incident post-mortem" />, <T pt="resposta a incidentes: linha do tempo, causa raiz e correção sem culpa" en="incident response: timeline, root cause and a blameless fix" />],
            [<T pt="Infraestrutura como código" en="Infrastructure as code" />, <T pt="segurança em nuvem: IAM de menor privilégio e configuração revisável em pull request" en="cloud security: least-privilege IAM and configuration reviewable in a pull request" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>Regra de ouro de toda a série: só pratique em sistemas <em>seus</em> (sua máquina, seu laboratório Docker, sua conta de nuvem) ou em alvos que autorizam o teste por escrito (plataformas de treino, CTFs, programas de bug bounty dentro do escopo). A mesma técnica que é um exercício hoje é crime sem autorização. A seção de ética e lei, mais abaixo, detalha isso.</>} en={<>Golden rule of the whole series: only practise on systems that are <em>yours</em> (your machine, your Docker lab, your cloud account) or on targets that authorise testing in writing (training platforms, CTFs, bug bounty programmes within scope). The same technique that is an exercise today is a crime without authorisation. The ethics and law section below goes into detail.</>} /></Callout>
      </Section>
      <Section id="concepts-cs" title={<T pt="Os conceitos que sustentam tudo" en="The concepts that hold everything up" />}>
        <p><T pt="Antes de ferramenta, vocabulário. Estes onze conceitos aparecem em toda prova de certificação, toda entrevista e todo relatório de incidente. Se você dominar só isto, já lê o resto da área com sentido." en="Vocabulary comes before tools. These eleven concepts show up in every certification exam, every interview and every incident report. Master only these and you can already read the rest of the field with understanding." /></p>
        <Table
          head={[<T pt="Conceito" en="Concept" />, <T pt="Em uma frase" en="In one sentence" />, <T pt="Onde praticar nesta série" en="Where to practise in this series" />]}
          rows={[
            [<T pt="Tríade CIA" en="CIA triad" />, <T pt="Confidencialidade (só quem pode lê), integridade (ninguém altera sem querer ou sem permissão) e disponibilidade (funciona quando precisa): todo controle protege uma dessas três." en="Confidentiality (only those allowed can read), integrity (nobody alters it by accident or without permission) and availability (it works when needed): every control protects one of these three." />, <a href="/notas/web-app-security/"><T pt="Aplicações web seguras" en="Secure web apps" /></a>],
            [<T pt="Ameaça, vulnerabilidade, risco" en="Threat, vulnerability, risk" />, <T pt="A ameaça é quem ou o que pode causar dano, a vulnerabilidade é a fraqueza que permite, o risco é a probabilidade vezes o impacto." en="The threat is who or what can cause harm, the vulnerability is the weakness that allows it, the risk is probability times impact." />, <a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20" en="Red team 80/20" /></a>],
            [<T pt="Superfície de ataque" en="Attack surface" />, <T pt="Tudo o que um atacante consegue tocar: portas abertas, endpoints, contas, dependências. Reduzir isso é a defesa mais barata." en="Everything an attacker can touch: open ports, endpoints, accounts, dependencies. Shrinking it is the cheapest defence." />, <a href="/notas/docker/"><T pt="Docker: menos superfície de ataque" en="Docker: a smaller attack surface" /></a>],
            [<T pt="Menor privilégio" en="Least privilege" />, <T pt="Cada pessoa, processo e token recebe só a permissão de que precisa, pelo tempo de que precisa." en="Every person, process and token gets only the permission it needs, for as long as it needs." />, <a href="/notas/postgres-for-devs/"><T pt="Postgres (roles e grants)" en="Postgres (roles and grants)" /></a>],
            [<T pt="Defesa em profundidade" en="Defence in depth" />, <T pt="Camadas independentes: se uma falha, a próxima segura. Firewall, autenticação, validação, criptografia e monitoramento juntos." en="Independent layers: if one fails, the next holds. Firewall, authentication, validation, encryption and monitoring together." />, <a href="/notas/web-app-security/"><T pt="Apps web seguros" en="Secure web apps" /></a>],
            [<T pt="Autenticação e autorização" en="Authentication and authorisation" />, <T pt="Autenticar é provar quem você é; autorizar é decidir o que você pode fazer. Confundir as duas é a origem de metade das falhas de acesso. MFA reforça a primeira." en="Authenticating is proving who you are; authorising is deciding what you may do. Mixing them up is the root of half of all access flaws. MFA strengthens the first." />, <a href="/notas/web-app-security/"><T pt="Aplicações web seguras (sessões, JWT)" en="Secure web apps (sessions, JWT)" /></a>],
            [<T pt="Criptografia aplicada" en="Applied cryptography" />, <T pt="Hash para senhas (lento e com sal), cifra simétrica para dados, assimétrica para trocar chaves e assinar, TLS para o tráfego. Nunca invente a sua." en="Hashing for passwords (slow and salted), symmetric ciphers for data, asymmetric for exchanging keys and signing, TLS for traffic. Never invent your own." />, <a href="/notas/web-app-security/"><T pt="HTTPS e cabeçalhos" en="HTTPS and headers" /></a>],
            [<T pt="Modelagem de ameaças" en="Threat modelling" />, <T pt="Desenhar o sistema e perguntar, para cada fluxo, o que pode dar errado (veja o STRIDE abaixo) antes de escrever o código." en="Drawing the system and asking, for each flow, what can go wrong (see STRIDE below) before writing the code." />, <T pt="Projeto 4 desta nota" en="Project 4 in this note" />],
            [<T pt="Gestão de vulnerabilidades" en="Vulnerability management" />, <T pt="Achar, priorizar e corrigir falhas conhecidas (CVE, CVSS) em dependências, imagens e servidores, de forma contínua." en="Finding, prioritising and fixing known flaws (CVE, CVSS) in dependencies, images and servers, continuously." />, <T pt="Projetos 1 e 2 desta nota" en="Projects 1 and 2 in this note" />],
            [<T pt="Supor a invasão (assume breach)" en="Assume breach" />, <T pt="Projete como se alguém já estivesse dentro: segmente, limite o que sai da rede, registre tudo e tenha um plano de resposta." en="Design as if someone were already inside: segment, limit what leaves the network, log everything and have a response plan." />, <a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20 (seção do shell)" en="Red team 80/20 (shell section)" /></a>],
            [<T pt="Zero trust" en="Zero trust" />, <T pt="Nenhuma requisição é confiável só por vir da rede interna: cada acesso é verificado por identidade, dispositivo e contexto." en="No request is trusted just for coming from the internal network: every access is verified by identity, device and context." />, <a href="/notas/github-aws-oidc/"><T pt="GitHub para AWS com OIDC (sem chaves fixas)" en="GitHub to AWS with OIDC (no static keys)" /></a>],
          ]}
        />
        <h3><T pt="STRIDE: seis perguntas para modelar ameaças" en="STRIDE: six questions for threat modelling" /></h3>
        <Table
          head={[<T pt="Letra" en="Letter" />, <T pt="Ameaça" en="Threat" />, <T pt="Pergunta" en="Question" />, <T pt="Propriedade violada" en="Property violated" />]}
          rows={[
            ["S", "Spoofing", <T pt="alguém consegue se passar por outro usuário ou serviço?" en="can someone pose as another user or service?" />, <T pt="autenticidade" en="authenticity" />],
            ["T", "Tampering", <T pt="alguém consegue alterar dados em trânsito ou em repouso?" en="can someone change data in transit or at rest?" />, <T pt="integridade" en="integrity" />],
            ["R", "Repudiation", <T pt="alguém consegue negar uma ação sem que haja prova?" en="can someone deny an action with no proof?" />, <T pt="não repúdio (logs)" en="non-repudiation (logs)" />],
            ["I", "Information disclosure", <T pt="algum dado vaza para quem não devia ver?" en="does any data leak to someone who should not see it?" />, <T pt="confidencialidade" en="confidentiality" />],
            ["D", "Denial of service", <T pt="alguém consegue derrubar ou esgotar o serviço?" en="can someone take down or exhaust the service?" />, <T pt="disponibilidade" en="availability" />],
            ["E", "Elevation of privilege", <T pt="um usuário comum consegue virar administrador?" en="can an ordinary user become an admin?" />, <T pt="autorização" en="authorisation" />],
          ]}
        />
        <h3><T pt="Cinco siglas que organizam o vocabulário" en="Five acronyms that organise the vocabulary" /></h3>
        <Table
          head={[<T pt="Sigla" en="Acronym" />, <T pt="O que identifica" en="What it identifies" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<a href="https://www.cve.org" rel="noopener">CVE</a>, <T pt="uma vulnerabilidade específica e pública, com um número" en="one specific, public vulnerability, with a number" />, "CVE-2021-44228 (Log4Shell)"],
            [<a href="https://cwe.mitre.org" rel="noopener">CWE</a>, <T pt={<>a <em>classe</em> de fraqueza por trás de muitos CVEs</>} en={<>the <em>class</em> of weakness behind many CVEs</>} />, "CWE-89 (SQL injection)"],
            [<a href="https://www.first.org/cvss/" rel="noopener">CVSS</a>, <T pt="a gravidade de 0 a 10 de uma vulnerabilidade" en="the 0-to-10 severity of a vulnerability" />, <T pt="9.8 = crítico" en="9.8 = critical" />],
            [<a href="https://attack.mitre.org/" rel="noopener">MITRE ATT&amp;CK</a>, <T pt="o catálogo de táticas e técnicas de atacantes, usado por red e blue" en="the catalogue of attacker tactics and techniques, used by red and blue" />, "T1190 (Exploit Public-Facing Application)"],
            [<a href="https://owasp.org/www-project-top-ten/" rel="noopener">OWASP Top 10</a>, <T pt="os riscos mais comuns em aplicações web, para quem constrói" en="the most common web application risks, for builders" />, "A01 Broken Access Control"],
          ]}
        />
      </Section>
      <Section id="paths-cs" title={<T pt="Os caminhos: red, blue, purple e AppSec" en="The paths: red, blue, purple and AppSec" />}>
        <Table
          head={[<T pt="Caminho" en="Path" />, <T pt="Pergunta central" en="Core question" />, <T pt="Dia a dia" en="Day to day" />, <T pt="Primeiros passos" en="First steps" />]}
          rows={[
            [<T pt={<><strong>AppSec / DevSecOps</strong></>} en={<><strong>AppSec / DevSecOps</strong></>} />, <T pt="como eu construo isto sem as falhas comuns?" en="how do I build this without the common flaws?" />, <T pt="revisão de código, threat modeling, SAST/DAST, pipelines seguros, treinar devs" en="code review, threat modelling, SAST/DAST, secure pipelines, training developers" />, <><a href="/notas/web-app-security/"><T pt="Aplicações web seguras" en="Aplicações web seguras" /></a> · PortSwigger Web Security Academy · Juice Shop</>],
            [<T pt={<><strong>Red team / pentest</strong></>} en={<><strong>Red team / pentest</strong></>} />, <T pt="como um atacante chegaria aqui?" en="how would an attacker get here?" />, <T pt="testes autorizados, relatórios com evidência e correção sugerida" en="authorised testing, reports with evidence and a suggested fix" />, <><a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20" en="Red team 80/20" /></a> · TryHackMe · Hack The Box Academy</>],
            [<T pt={<><strong>Blue team / SOC</strong></>} en={<><strong>Blue team / SOC</strong></>} />, <T pt="estamos sendo atacados agora? o que aconteceu?" en="are we being attacked right now? what happened?" />, <T pt="triagem de alertas, caça a ameaças, resposta a incidentes, engenharia de detecção" en="alert triage, threat hunting, incident response, detection engineering" />, <><a href="/notas/observability/"><T pt="Observabilidade" en="Observability" /></a> · CyberDefenders · LetsDefend · <T pt="Projeto 3" en="Project 3" /></>],
            [<T pt={<><strong>Purple team</strong></>} en={<><strong>Purple team</strong></>} />, <T pt="a detecção pega o que o ataque faz?" en="does detection catch what the attack does?" />, <T pt="rodar uma técnica do ATT&amp;CK e conferir se o alerta dispara; ajustar as regras" en="running an ATT&amp;CK technique and checking whether the alert fires; tuning the rules" />, <T pt="Projetos 3 e 5 (Sigma + Atomic Red Team)" en="Projects 3 and 5 (Sigma + Atomic Red Team)" />],
            [<T pt={<><strong>Cloud security</strong></>} en={<><strong>Cloud security</strong></>} />, <T pt="esta conta de nuvem está configurada com segurança?" en="is this cloud account configured securely?" />, <T pt="IAM, rede, segredos, logs de auditoria, políticas como código" en="IAM, networking, secrets, audit logs, policy as code" />, <><a href="/notas/github-aws-oidc/"><T pt="GitHub para AWS com OIDC" en="GitHub para AWS com OIDC" /></a> · <a href="/notas/aws/"><T pt="AWS" en="AWS" /></a></>],
          ]}
        />
        <h3><T pt="Como um dev deve escolher" en="How a developer should choose" /></h3>
        <p><T pt={<>Comece por <strong>AppSec</strong>: é onde o que você já sabe rende mais rápido, a nota de aplicações web seguras já cobre a base e o mercado sempre precisa de quem fale as duas línguas, a do código e a da segurança. Em paralelo, faça a trilha ofensiva em laboratório para entender o atacante, e a defensiva para entender o que ele deixa nos logs. Depois de uns seis meses você saberá se prefere quebrar (red), investigar (blue) ou construir (AppSec/cloud). Ninguém acerta de primeira, e as bases são as mesmas.</>} en={<>Start with <strong>AppSec</strong>: it is where what you already know pays off fastest, the secure web apps note already covers the base and the market always needs people who speak both languages, code and security. In parallel, do the offensive path in a lab to understand the attacker, and the defensive one to understand what the attacker leaves in the logs. After about six months you will know whether you prefer to break (red), investigate (blue) or build (AppSec/cloud). Nobody gets it right the first time, and the foundations are the same.</>} /></p>
        <h3><T pt="O lado blue em uma página" en="The blue side on one page" /></h3>
        <p><T pt={<>As notas existentes são fortes no lado ofensivo e no de quem constrói; o lado de quem <em>detecta</em> cabe aqui, em resumo. O ciclo de resposta a incidentes do NIST (SP 800-61) tem quatro fases, e cada uma tem uma ferramenta típica.</>} en={<>The existing notes are strong on the offensive side and on the builder's side; the side of those who <em>detect</em> fits here, in summary. The NIST incident response lifecycle (SP 800-61) has four phases, and each has a typical tool.</>} /></p>
        <Table
          head={[<T pt="Fase" en="Phase" />, <T pt="O que acontece" en="What happens" />, <T pt="Ferramenta típica" en="Typical tool" />]}
          rows={[
            [<T pt="Preparação" en="Preparation" />, <T pt="inventário, logs centralizados, backups testados, plano e contatos de resposta" en="inventory, centralised logs, tested backups, response plan and contacts" />, <T pt="Wazuh, Elastic, auditd, CloudTrail" en="Wazuh, Elastic, auditd, CloudTrail" />],
            [<T pt="Detecção e análise" en="Detection and analysis" />, <T pt="um alerta dispara; o analista confirma se é real e qual o alcance" en="an alert fires; the analyst confirms whether it is real and how far it reaches" />, <T pt="Suricata (rede), regras Sigma (logs), EDR" en="Suricata (network), Sigma rules (logs), EDR" />],
            [<T pt="Contenção, erradicação e recuperação" en="Containment, eradication and recovery" />, <T pt="isolar o host, revogar credenciais, remover a persistência, restaurar de backup" en="isolate the host, revoke credentials, remove persistence, restore from backup" />, <T pt="firewall, IAM, snapshots, backups 3-2-1" en="firewall, IAM, snapshots, 3-2-1 backups" />],
            [<T pt="Pós-incidente" en="Post-incident" />, <T pt="linha do tempo, causa raiz, o que muda para não repetir" en="timeline, root cause, what changes so it does not repeat" />, <T pt="post-mortem sem culpa, ATT&amp;CK para classificar" en="blameless post-mortem, ATT&amp;CK to classify" />],
          ]}
        />
      </Section>
      <Section id="roadmap-cs" title={<T pt="A trilha em cinco etapas" en="The path in five stages" />}>
        <Diagram minWidth={680} caption={<T pt="Cada etapa tem um marco de saída: só avance quando conseguir fazê-lo sem consultar." en="Each stage has an exit milestone: only move on when you can do it without looking it up." />}>
          <svg viewBox="0 0 760 84" role="img" aria-label="A trilha em cinco etapas / The path in five stages">
            <rect x="10" y="12" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="70.0" y="41.0" className="pt" textAnchor="middle">0 · Fundamentos</text>
            <text x="70.0" y="41.0" className="en" textAnchor="middle">0 · Foundations</text>
            <path d="M130 37L160 37" className="ln" />
            <path d="M153.2 33.7L160 37L153.2 40.3" className="ln" />
            <rect x="160" y="12" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="220.0" y="41.0" className="pt" textAnchor="middle">1 · Apps</text>
            <text x="220.0" y="41.0" className="en" textAnchor="middle">1 · Apps</text>
            <path d="M280 37L310 37" className="ln" />
            <path d="M303.2 33.7L310 37L303.2 40.3" className="ln" />
            <rect x="310" y="12" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="370.0" y="41.0" className="pt" textAnchor="middle">2 · Ofensiva</text>
            <text x="370.0" y="41.0" className="en" textAnchor="middle">2 · Offence</text>
            <path d="M430 37L460 37" className="ln" />
            <path d="M453.2 33.7L460 37L453.2 40.3" className="ln" />
            <rect x="460" y="12" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="520.0" y="41.0" className="pt" textAnchor="middle">3 · Defesa</text>
            <text x="520.0" y="41.0" className="en" textAnchor="middle">3 · Defence</text>
            <path d="M580 37L610 37" className="ln" />
            <path d="M603.2 33.7L610 37L603.2 40.3" className="ln" />
            <rect x="610" y="12" width="120" height="50" rx="4" className="ln fillsoft" />
            <text x="670.0" y="41.0" className="pt" textAnchor="middle">4 · Provar</text>
            <text x="670.0" y="41.0" className="en" textAnchor="middle">4 · Prove it</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Etapa" en="Stage" />, <T pt="Aprender" en="Learn" />, <T pt="Nesta série" en="In this series" />, <T pt="Fora daqui" en="Beyond this site" />, <T pt="Marco de saída" en="Exit milestone" />]}
          rows={[
            [<T pt={<><strong>0 · Fundamentos</strong><br />4 a 6 semanas</>} en={<><strong>0 · Foundations</strong><br />4 to 6 weeks</>} />, <T pt="TCP/IP, DNS, HTTP, TLS; Linux e shell; um idioma de script (Python ou Bash); Git" en="TCP/IP, DNS, HTTP, TLS; Linux and the shell; a scripting language (Python or Bash); Git" />, <><a href="/notas/linux/"><T pt="Como o Linux funciona" en="How Linux works" /></a></>, <><a href="https://overthewire.org/wargames/bandit/" rel="noopener">OverTheWire Bandit</a><br /><a href="https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" rel="noopener">Professor Messer, Security+</a><br /><a href="https://roadmap.sh/cyber-security" rel="noopener">roadmap.sh/cyber-security</a></>, <T pt="explicar um handshake TCP, ler uma captura no Wireshark e prender um serviço atrás de um firewall" en="explain a TCP handshake, read a Wireshark capture and put a service behind a firewall" />],
            [<T pt={<><strong>1 · Segurança de aplicações</strong><br />6 a 8 semanas</>} en={<><strong>1 · Application security</strong><br />6 to 8 weeks</>} />, <T pt="OWASP Top 10, autenticação e sessão, cabeçalhos, injeção, XSS, CSRF, gestão de segredos e dependências" en="OWASP Top 10, authentication and sessions, headers, injection, XSS, CSRF, secrets and dependency management" />, <><a href="/notas/web-app-security/"><T pt="Aplicações web seguras" en="Secure web apps" /></a><br /><a href="/notas/postgres-for-devs/"><T pt="Postgres para quem programa" en="Postgres for developers" /></a></>, <><a href="https://portswigger.net/web-security" rel="noopener">PortSwigger Web Security Academy</a><br /><a href="https://owasp.org/www-project-juice-shop/" rel="noopener">OWASP Juice Shop</a><br /><a href="https://cheatsheetseries.owasp.org" rel="noopener">OWASP Cheat Sheet Series</a></>, <T pt="corrigir uma injeção e um XSS no seu próprio código e provar com um teste" en="fix an injection and an XSS in your own code and prove it with a test" />],
            [<T pt={<><strong>2 · Ofensiva em laboratório</strong><br />6 a 8 semanas</>} en={<><strong>2 · Offence in a lab</strong><br />6 to 8 weeks</>} />, <T pt="o ciclo de ataque, reconhecimento, exploração web, shells, escalada de privilégio, relatório" en="the attack lifecycle, recon, web exploitation, shells, privilege escalation, reporting" />, <a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20" en="Red team 80/20" /></a>, <><a href="https://tryhackme.com" rel="noopener">TryHackMe</a><br /><a href="https://academy.hackthebox.com" rel="noopener">Hack The Box Academy</a><br /><a href="https://picoctf.org" rel="noopener">picoCTF</a></>, <T pt="resolver uma máquina fácil de ponta a ponta e escrever o relatório com a correção" en="solve an easy machine end to end and write the report with the fix" />],
            [<T pt={<><strong>3 · Defesa e detecção</strong><br />6 a 8 semanas</>} en={<><strong>3 · Defence and detection</strong><br />6 to 8 weeks</>} />, <T pt="logs, SIEM, IDS, resposta a incidentes, regras de detecção, ATT&amp;CK do lado de quem defende" en="logs, SIEM, IDS, incident response, detection rules, ATT&amp;CK from the defender's side" />, <><a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20 (o que o blue vê)" en="Red team 80/20 (what blue sees)" /></a><br /><T pt="Projetos 3 e 5" en="Projects 3 and 5" /></>, <><a href="https://cyberdefenders.org" rel="noopener">CyberDefenders</a><br /><a href="https://letsdefend.io" rel="noopener">LetsDefend</a><br /><a href="https://blueteamlabs.online" rel="noopener">Blue Team Labs Online</a></>, <T pt="ver o seu próprio ataque de laboratório aparecer num alerta e escrever a regra que o pega" en="see your own lab attack show up in an alert and write the rule that catches it" />],
            [<T pt={<><strong>4 · Especializar e provar</strong><br />contínuo</>} en={<><strong>4 · Specialise and prove it</strong><br />ongoing</>} />, <T pt="nuvem, mobile, reversing, forense ou GRC; certificação; contribuição pública" en="cloud, mobile, reversing, forensics or GRC; certification; public contribution" />, <><a href="/notas/aws/"><T pt="AWS" en="AWS" /></a><br /><a href="/notas/terraform/"><T pt="Terraform 80/20" en="Terraform 80/20" /></a></>, <><a href="https://ctftime.org" rel="noopener">CTFtime</a><br /><a href="https://hackerone.com/bug-bounty-programs" rel="noopener">HackerOne</a><br /><a href="https://www.root-me.org" rel="noopener">Root-Me</a></>, <T pt="um portfólio público (write-ups, regras, ferramentas) e uma certificação da sua área" en="a public portfolio (write-ups, rules, tools) and one certification in your area" />],
          ]}
        />
      </Section>
      <Section id="projects-cs" title={<T pt="Projetos práticos para o portfólio" en="Practical projects for your portfolio" />}>
        <p><T pt="Certificado diz que você estudou; projeto público mostra que você faz. Cada projeto abaixo gera um artefato que cabe num repositório ou num post: um relatório, uma regra, um pipeline. Todos rodam na sua máquina ou em contêineres." en="A certificate says you studied; a public project shows you can do it. Each project below produces an artefact that fits in a repository or a post: a report, a rule, a pipeline. All of them run on your machine or in containers." /></p>
        <Table
          head={[<T pt="#" en="#" />, <T pt="Projeto" en="Project" />, <T pt="O que você entrega" en="What you deliver" />, <T pt="Nível" en="Level" />, <T pt="Etapa" en="Stage" />]}
          rows={[
            ["1", <T pt="Auditar e endurecer o seu próprio app" en="Audit and harden your own app" />, <T pt="relatório com achados priorizados (CVSS) e os commits que corrigem" en="report with prioritised findings (CVSS) and the commits that fix them" />, <T pt="iniciante" en="beginner" />, "1"],
            ["2", <T pt="Pipeline de segurança no CI" en="Security pipeline in CI" />, <T pt="workflow que falha o build com segredo ou CVE crítico" en="a workflow that fails the build on a secret or a critical CVE" />, <T pt="iniciante" en="beginner" />, "1"],
            ["3", <T pt="Mini SOC doméstico" en="Home mini-SOC" />, <T pt="alertas do Suricata e do Wazuh para ataques que você mesmo rodou" en="Suricata and Wazuh alerts for attacks you ran yourself" />, <T pt="intermediário" en="intermediate" />, "3"],
            ["4", <T pt="Modelo de ameaças de um sistema" en="Threat model of a system" />, <T pt="diagrama de fluxo de dados e tabela STRIDE com mitigações" en="data flow diagram and STRIDE table with mitigations" />, <T pt="iniciante" en="beginner" />, "1"],
            ["5", <T pt="Regra de detecção em Sigma" en="Detection rule in Sigma" />, <T pt="regra versionada, testada contra o ataque do laboratório" en="a versioned rule, tested against the lab attack" />, <T pt="intermediário" en="intermediate" />, "3"],
            ["6", <T pt="Write-ups de laboratórios" en="Lab write-ups" />, <T pt="10 desafios do Juice Shop ou da PortSwigger explicados passo a passo" en="10 Juice Shop or PortSwigger challenges explained step by step" />, <T pt="iniciante" en="beginner" />, "2"],
            ["7", <T pt="Honeypot SSH isolado" en="Isolated SSH honeypot" />, <T pt="uma semana de tentativas reais analisadas (IPs, senhas, comandos)" en="a week of real attempts analysed (IPs, passwords, commands)" />, <T pt="intermediário" en="intermediate" />, "3"],
            ["8", <T pt="CTF em equipe ou programa de divulgação" en="Team CTF or disclosure programme" />, <T pt="participação no CTFtime e um relato do que você aprendeu" en="a CTFtime entry and an account of what you learned" />, <T pt="todos os níveis" en="all levels" />, "4"],
          ]}
        />
        <h3><T pt="Projeto 1: auditar e endurecer o seu próprio app" en="Project 1: audit and harden your own app" /></h3>
        <p><T pt="Pegue um projeto seu (qualquer um) e rode três varreduras: segredos, dependências e padrões de código inseguro. Priorize o que achar por gravidade, corrija o que for crítico e registre cada correção num commit com a explicação do risco. Em seguida revise cabeçalhos e cookies com o checklist da nota de aplicações web seguras." en="Take one of your projects (any of them) and run three scans: secrets, dependencies and insecure code patterns. Prioritise what you find by severity, fix what is critical and record each fix in a commit that explains the risk. Then review headers and cookies with the checklist in the secure web apps note." /></p>
        <CodeBlock>
          <span className="tok-c"># dentro da pasta do seu projeto: três varreduras, nenhuma sai da sua máquina</span>{"\n"}
          {"docker run --rm -v \"$PWD:/repo\" zricethezav/gitleaks:latest detect --source /repo --redact\n"}
          <span className="tok-c"># ^ segredos no código e no histórico do Git</span>{"\n"}
          {"docker run --rm -v \"$PWD:/src\" aquasec/trivy:latest fs /src\n"}
          <span className="tok-c"># ^ dependências com CVE, Dockerfile e IaC mal configurados</span>{"\n"}
          {"docker run --rm -v \"$PWD:/src\" semgrep/semgrep semgrep scan --config auto --metrics=off /src\n"}
          <span className="tok-c"># ^ padrões de código inseguro (injeção, criptografia fraca, XSS)</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> uma lista de achados, quase sempre com falsos positivos. Aprender a separá-los é metade do ofício: para cada item, escreva "real" ou "falso positivo, porque…". Se o gitleaks achar um segredo real, <strong>revogue-o primeiro</strong> e só depois limpe o histórico: um segredo que já foi para o Git deve ser tratado como vazado.</>} en={<><strong>Expected result:</strong> a list of findings, almost always with false positives. Learning to tell them apart is half the craft: for each item write "real" or "false positive, because…". If gitleaks finds a real secret, <strong>revoke it first</strong> and only then clean the history: a secret that reached Git must be treated as leaked.</>} /></p>
        <h3><T pt="Projeto 2: o mesmo, a cada push" en="Project 2: the same, on every push" /></h3>
        <p><T pt="Transforme as varreduras do projeto 1 num workflow do GitHub Actions. O objetivo é que um segredo ou uma dependência com CVE crítico quebre o build antes de chegar à produção. Ative também o Dependabot e o secret scanning do repositório (Settings → Code security)." en="Turn the scans from project 1 into a GitHub Actions workflow. The goal is that a secret or a dependency with a critical CVE breaks the build before it reaches production. Also turn on Dependabot and the repository's secret scanning (Settings → Code security)." /></p>
        <CodeBlock>
          <span className="tok-c"># .github/workflows/security.yml (esqueleto; fixe versões e SHAs dos actions que você usar)</span>{"\n"}
          <span className="tok-k">name</span>{": security\n"}
          <span className="tok-k">on</span>{": [push, pull_request]\n"}
          <span className="tok-k">jobs</span>{":\n"}
          {"  scan:\n"}
          {"    "}<span className="tok-k">runs-on</span>{": ubuntu-latest\n"}
          {"    "}<span className="tok-k">steps</span>{":\n"}
          {"      - "}<span className="tok-k">uses</span>{": actions/checkout@v4\n"}
          {"        "}<span className="tok-k">with</span>{": { fetch-depth: 0 }   "}<span className="tok-c"># gitleaks lê o histórico inteiro</span>{"\n"}
          {"      - "}<span className="tok-k">name</span>{": segredos\n"}
          {"        "}<span className="tok-k">run</span>{": docker run --rm -v \"$PWD:/repo\" zricethezav/gitleaks:latest detect --source /repo --redact\n"}
          {"      - "}<span className="tok-k">name</span>{": dependências e arquivos de configuração\n"}
          {"        "}<span className="tok-k">run</span>{": docker run --rm -v \"$PWD:/src\" aquasec/trivy:latest fs --exit-code 1 --severity HIGH,CRITICAL /src\n"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> um push com um arquivo <code>.env</code> falso (use um valor inventado) deixa o job vermelho. Teste isso de propósito, em um branch, para ter certeza de que o pipeline realmente barra. Veja também a nota de OIDC: o pipeline não deve ter chaves de nuvem fixas.</>} en={<><strong>Expected result:</strong> a push with a fake <code>.env</code> file (use an invented value) turns the job red. Test it on purpose, on a branch, to be sure the pipeline really blocks. See also the OIDC note: the pipeline must not hold static cloud keys.</>} /></p>
        <h3><T pt="Projeto 3: um mini SOC doméstico" en="Project 3: a home mini-SOC" /></h3>
        <p><T pt="Aqui o lado blue se encontra com o laboratório da nota de red team. Primeiro, o jeito mais simples: gere tráfego de ataque (um scan com o nmap e uma SQL injection no DVWA), capture com o tcpdump e peça ao Suricata, um IDS de código aberto, que leia a captura." en="Here the blue side meets the lab from the red team note. First, the simplest way: generate attack traffic (an nmap scan and a SQL injection on DVWA), capture it with tcpdump and ask Suricata, an open-source IDS, to read the capture." /></p>
        <CodeBlock>
          <span className="tok-c"># 1. capture tráfego do laboratório (o mesmo da nota de segurança e redes)</span>{"\n"}
          {"sudo tcpdump -i any -n -w lab.pcap port 80 or port 8081 -c 2000\n"}
          <span className="tok-c"># 2. rode um ataque conhecido contra o DVWA: um scan com nmap e uma SQL injection</span>{"\n"}
          <span className="tok-c"># 3. leia a captura com o Suricata e as regras Emerging Threats (gratuitas)</span>{"\n"}
          {"mkdir -p suricata-out && sudo suricata-update          "}<span className="tok-c"># baixa o conjunto de regras</span>{"\n"}
          {"suricata -r lab.pcap -l suricata-out\n"}
          {"cat suricata-out/fast.log                              "}<span className="tok-c"># os alertas, uma linha cada</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>fast.log</code> lista alertas como o do scan de portas e de tentativas de injeção. Anote quais ataques foram vistos e <em>quais passaram em silêncio</em>: os que passaram são o seu trabalho de detecção. Depois suba o Wazuh (SIEM e agente de host) seguindo o guia oficial de implantação com Docker e instale o agente na máquina que hospeda o laboratório; compare o que cada ferramenta enxerga.</>} en={<><strong>Expected result:</strong> <code>fast.log</code> lists alerts such as the port scan and the injection attempts. Note which attacks were seen and <em>which slipped past silently</em>: the ones that slipped past are your detection work. Then bring up Wazuh (SIEM and host agent) following the official Docker deployment guide and install the agent on the machine hosting the lab; compare what each tool sees.</>} /></p>
        <h3><T pt="Projeto 5: uma regra de detecção em Sigma" en="Project 5: a detection rule in Sigma" /></h3>
        <p><T pt="Sigma é um formato aberto e neutro de regras de detecção: você escreve uma vez e converte para o SIEM que usar. A regra abaixo traduz em código a defesa da nota de red team: um processo de servidor web não deveria gerar um shell filho. Teste rodando o exercício do shell reverso do laboratório e conferindo se a regra, convertida, dispara no seu Wazuh ou Elastic." en="Sigma is an open, vendor-neutral format for detection rules: you write it once and convert it for whichever SIEM you use. The rule below turns the defence from the red team note into code: a web server process should not spawn a child shell. Test it by running the reverse shell exercise from the lab and checking that the converted rule fires in your Wazuh or Elastic." /></p>
        <CodeBlock>
          <span className="tok-c"># web-shell.yml: um servidor web não deveria abrir um shell (o padrão da nota de red team)</span>{"\n"}
          <span className="tok-k">title</span>{": Web server spawning a shell\n"}
          <span className="tok-k">id</span>{": 1dca4040-3843-4463-a982-c8a755bbeddc\n"}
          <span className="tok-k">status</span>{": experimental\n"}
          <span className="tok-k">description</span>{": A web server process starting a shell, a common sign of a reverse shell\n"}
          <span className="tok-k">logsource</span>{":\n"}
          {"  category: process_creation\n"}
          {"  product: linux\n"}
          <span className="tok-k">detection</span>{":\n"}
          {"  selection:\n"}
          {"    ParentImage|endswith: ['/nginx', '/apache2', '/httpd', '/php-fpm']\n"}
          {"    Image|endswith: ['/bash', '/sh', '/dash']\n"}
          {"  condition: selection\n"}
          <span className="tok-k">falsepositives</span>{":\n"}
          {"  - Deploy scripts started by the web server\n"}
          <span className="tok-k">level</span>{": high"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> um arquivo YAML versionado, um teste que o dispara e uma nota sobre falsos positivos. O repositório <code>SigmaHQ/sigma</code> tem milhares de regras para você ler e o <code>atomic-red-team</code> (Red Canary) tem testes de técnicas do ATT&amp;CK para provar cada regra: é o purple team em casa.</>} en={<><strong>Expected result:</strong> a versioned YAML file, a test that triggers it and a note on false positives. The <code>SigmaHQ/sigma</code> repository has thousands of rules to read and <code>atomic-red-team</code> (Red Canary) has ATT&amp;CK technique tests to prove each rule: purple team at home.</>} /></p>
        <h3><T pt="Projetos 4, 6, 7 e 8, em poucas linhas" en="Projects 4, 6, 7 and 8, in a few lines" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Modelo de ameaças:</strong> desenhe o diagrama de fluxo de dados do sistema (usuário, front, API, banco, filas, terceiros), marque as fronteiras de confiança e percorra cada fluxo com o STRIDE. O OWASP Threat Dragon é uma ferramenta gratuita para isso. Entregue o diagrama e uma tabela "ameaça, mitigação, status".</>} en={<><strong>Threat model:</strong> draw the system's data flow diagram (user, front end, API, database, queues, third parties), mark the trust boundaries and walk each flow with STRIDE. OWASP Threat Dragon is a free tool for it. Deliver the diagram and a "threat, mitigation, status" table.</>} /></li>
          <li><T pt={<><strong>Write-ups:</strong> resolva desafios do Juice Shop e da Web Security Academy da PortSwigger e explique, para cada um, a falha, como você a encontrou e a correção. Escrever é o que transforma exercício em portfólio (e em memória).</>} en={<><strong>Write-ups:</strong> solve Juice Shop and PortSwigger Web Security Academy challenges and explain, for each, the flaw, how you found it and the fix. Writing is what turns an exercise into a portfolio (and into memory).</>} /></li>
          <li><T pt={<><strong>Honeypot:</strong> o Cowrie simula um servidor SSH e registra o que os bots tentam. Rode-o <em>isolado</em> (contêiner, VPS descartável, sem credenciais reais e sem rota para a sua rede) e analise os logs. Só publique algo assim com o isolamento bem pensado.</>} en={<><strong>Honeypot:</strong> Cowrie simulates an SSH server and records what bots try. Run it <em>isolated</em> (container, disposable VPS, no real credentials and no route to your network) and analyse the logs. Only expose something like this with the isolation well thought through.</>} /></li>
          <li><T pt={<><strong>CTF e divulgação:</strong> jogue um CTF por mês (picoCTF é o melhor começo). Quando se sentir pronto, procure programas de divulgação de vulnerabilidades (VDP) e bug bounty, sempre dentro do escopo publicado.</>} en={<><strong>CTF and disclosure:</strong> play one CTF a month (picoCTF is the best start). When you feel ready, look for vulnerability disclosure programmes (VDP) and bug bounty, always within the published scope.</>} /></li>
        </ul>
      </Section>
      <Section id="learn-cs" title={<T pt="Onde aprender" en="Where to learn" />}>
        <h3><T pt="Plataformas práticas" en="Hands-on platforms" /></h3>
        <p><T pt={"Aprende-se segurança fazendo. Todas as plataformas abaixo têm trilhas guiadas; as marcadas como \"gratuito\" não exigem pagamento para o conteúdo principal, e as com \"planos pagos\" têm uma parte gratuita e outra paga (os preços mudam, confira no site)."} en={"Security is learned by doing. All the platforms below have guided paths; those marked \"free\" need no payment for the core content, and those with \"paid plans\" have a free part and a paid part (prices change, check the site)."} /></p>
        <Table
          head={[<T pt="Plataforma" en="Platform" />, <T pt="Foco" en="Focus" />, <T pt="Custo" en="Cost" />, <T pt="Para quem" en="Best for" />]}
          rows={[
            [<a href="https://overthewire.org/wargames/bandit/" rel="noopener">OverTheWire: Bandit</a>, <T pt="Linux e shell por meio de jogos" en="Linux and shell through games" />, <T pt="gratuito" en="free" />, <T pt="o primeiro dia" en="day one" />],
            [<a href="https://picoctf.org" rel="noopener">picoCTF</a>, <T pt="CTF para iniciantes, da Carnegie Mellon" en="beginner CTF from Carnegie Mellon" />, <T pt="gratuito" en="free" />, <T pt="treinar jogando" en="learning by playing" />],
            [<a href="https://portswigger.net/web-security" rel="noopener">PortSwigger Web Security Academy</a>, <T pt="segurança web em profundidade, com laboratórios" en="web security in depth, with labs" />, <T pt="gratuito" en="free" />, <T pt="o melhor para devs" en="the best for developers" />],
            [<a href="https://owasp.org/www-project-juice-shop/" rel="noopener">OWASP Juice Shop</a>, <T pt="loja vulnerável de propósito, com placar" en="a deliberately vulnerable shop, with a scoreboard" />, <T pt="gratuito" en="free" />, <T pt="AppSec prático" en="practical AppSec" />],
            [<a href="https://tryhackme.com" rel="noopener">TryHackMe</a>, <T pt="trilhas guiadas, no navegador" en="guided paths, in the browser" />, <T pt="gratuito + planos pagos" en="free + paid plans" />, <T pt="iniciantes, ofensiva e defesa" en="beginners, offence and defence" />],
            [<a href="https://academy.hackthebox.com" rel="noopener">Hack The Box Academy</a>, <T pt="módulos aprofundados e máquinas" en="in-depth modules and machines" />, <T pt="gratuito + planos pagos" en="free + paid plans" />, <T pt="depois do TryHackMe" en="after TryHackMe" />],
            [<a href="https://cyberdefenders.org" rel="noopener">CyberDefenders</a>, <T pt="investigações de blue team" en="blue team investigations" />, <T pt="gratuito + planos pagos" en="free + paid plans" />, <T pt="analistas de SOC" en="SOC analysts" />],
            [<a href="https://letsdefend.io" rel="noopener">LetsDefend</a>, <T pt="simulador de SOC com alertas" en="SOC simulator with alerts" />, <T pt="gratuito + planos pagos" en="free + paid plans" />, <T pt="triagem de alertas" en="alert triage" />],
            [<a href="https://blueteamlabs.online" rel="noopener">Blue Team Labs Online</a>, <T pt="forense e resposta a incidentes" en="forensics and incident response" />, <T pt="gratuito + planos pagos" en="free + paid plans" />, <T pt="DFIR" en="DFIR" />],
            [<a href="https://www.root-me.org" rel="noopener">Root-Me</a>, <T pt="desafios em várias áreas (inclui versão em português)" en="challenges in many areas (includes a Portuguese version)" />, <T pt="gratuito" en="free" />, <T pt="variedade" en="variety" />],
          ]}
        />
        <h3><T pt="Referências que valem os favoritos" en="References worth bookmarking" /></h3>
        <ul className="ds-list">
          <li><T pt={<><a href="https://roadmap.sh/cyber-security" rel="noopener">roadmap.sh/cyber-security</a>: um mapa visual e aberto de tópicos, bom para checar se algo ficou de fora.</>} en={<><a href="https://roadmap.sh/cyber-security" rel="noopener">roadmap.sh/cyber-security</a>: an open, visual map of topics, good for checking whether something was left out.</>} /></li>
          <li><T pt={<><a href="https://cheatsheetseries.owasp.org" rel="noopener">OWASP Cheat Sheet Series</a> e o <a href="https://owasp.org/www-project-web-security-testing-guide/" rel="noopener">Web Security Testing Guide</a>: como defender e como testar cada risco, em páginas curtas.</>} en={<><a href="https://cheatsheetseries.owasp.org" rel="noopener">OWASP Cheat Sheet Series</a> and the <a href="https://owasp.org/www-project-web-security-testing-guide/" rel="noopener">Web Security Testing Guide</a>: how to defend and how to test each risk, in short pages.</>} /></li>
          <li><T pt={<><a href="https://owasp.org/www-project-application-security-verification-standard/" rel="noopener">OWASP ASVS</a>: a lista de requisitos de segurança de um app, ótima como checklist de projeto e de revisão.</>} en={<><a href="https://owasp.org/www-project-application-security-verification-standard/" rel="noopener">OWASP ASVS</a>: the list of an app's security requirements, great as a design and review checklist.</>} /></li>
          <li><T pt={<><a href="https://attack.mitre.org/" rel="noopener">MITRE ATT&amp;CK</a>: o vocabulário comum de red e blue; leia as técnicas que aparecem nos seus laboratórios.</>} en={<><a href="https://attack.mitre.org/" rel="noopener">MITRE ATT&amp;CK</a>: the shared vocabulary of red and blue; read the techniques that show up in your labs.</>} /></li>
          <li><T pt={<><a href="https://www.nist.gov/cyberframework" rel="noopener">NIST Cybersecurity Framework</a> e <a href="https://www.cisecurity.org/controls" rel="noopener">CIS Controls</a>: como as organizações estruturam a segurança; úteis para entrevistas e para GRC.</>} en={<><a href="https://www.nist.gov/cyberframework" rel="noopener">NIST Cybersecurity Framework</a> and <a href="https://www.cisecurity.org/controls" rel="noopener">CIS Controls</a>: how organisations structure security; useful for interviews and for GRC.</>} /></li>
          <li><T pt={<><a href="https://cartilha.cert.br" rel="noopener">Cartilha de Segurança para Internet (CERT.br)</a>: em português, para o básico e para explicar segurança a quem não é da área.</>} en={<><a href="https://cartilha.cert.br" rel="noopener">Cartilha de Segurança para Internet (CERT.br)</a>: in Portuguese, for the basics and for explaining security to non-specialists.</>} /></li>
        </ul>
        <h3><T pt="Livros" en="Books" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>The Web Application Hacker's Handbook</strong> (Stuttard e Pinto): o clássico de segurança web, ainda útil nos fundamentos.</>} en={<><strong>The Web Application Hacker's Handbook</strong> (Stuttard and Pinto): the web security classic, still useful for the fundamentals.</>} /></li>
          <li><T pt={<><strong>Threat Modeling: Designing for Security</strong> (Adam Shostack): o livro de referência para o projeto 4.</>} en={<><strong>Threat Modeling: Designing for Security</strong> (Adam Shostack): the reference book for project 4.</>} /></li>
          <li><T pt={<><a href="https://www.cl.cam.ac.uk/~rja14/book.html" rel="noopener">Security Engineering</a> (Ross Anderson): por que sistemas reais falham; a obra inteira está disponível online, de graça.</>} en={<><a href="https://www.cl.cam.ac.uk/~rja14/book.html" rel="noopener">Security Engineering</a> (Ross Anderson): why real systems fail; the whole book is available online, free.</>} /></li>
          <li><T pt={<><strong>Linux Basics for Hackers</strong> (OccupyTheWeb) e <strong>Practical Packet Analysis</strong> (Chris Sanders): a base de sistema e rede para a etapa 0.</>} en={<><strong>Linux Basics for Hackers</strong> (OccupyTheWeb) and <strong>Practical Packet Analysis</strong> (Chris Sanders): the system and network base for stage 0.</>} /></li>
        </ul>
        <h3><T pt="Certificações, na ordem em que fazem sentido" en="Certifications, in the order they make sense" /></h3>
        <p><T pt="Certificação não é habilidade: é um filtro de currículo e um roteiro de estudo. Faça uma quando ela te empurrar a estudar o que você evitaria, não como primeiro passo." en="A certification is not a skill: it is a résumé filter and a study outline. Take one when it pushes you to study what you would otherwise avoid, not as a first step." /></p>
        <Table
          head={[<T pt="Certificação" en="Certification" />, <T pt="Para quem" en="For whom" />, <T pt="Observação" en="Note" />]}
          rows={[
            [<a href="https://www.comptia.org/certifications/security" rel="noopener">CompTIA Security+</a>, <T pt="base geral, a mais pedida em vagas de entrada" en="general foundation, the most requested in entry-level jobs" />, <T pt="conceitos, não prática; combina com a etapa 0" en="concepts, not practice; matches stage 0" />],
            [<a href="https://ine.com/security" rel="noopener">eJPT (INE)</a>, <T pt="primeiro teste prático de pentest" en="first practical pentest exam" />, <T pt="etapa 2, com laboratório" en="stage 2, with a lab" />],
            [<a href="https://securityblue.team/why-btl1/" rel="noopener">BTL1 (Security Blue Team)</a>, <T pt="analista de SOC, prática" en="SOC analyst, practical" />, <T pt="etapa 3" en="stage 3" />],
            [<a href="https://www.offsec.com/courses/pen-200/" rel="noopener">OSCP (OffSec PEN-200)</a>, <T pt="pentest intermediário, prova de 24 horas" en="intermediate pentest, 24-hour exam" />, <T pt="exige base sólida; reconhecida em ofensiva" en="needs a solid base; well regarded in offence" />],
            [<a href="https://aws.amazon.com/certification/certified-security-specialty/" rel="noopener">AWS Certified Security – Specialty</a>, <T pt="segurança em nuvem" en="cloud security" />, <T pt="faz par com as notas de AWS e Terraform" en="pairs with the AWS and Terraform notes" />],
            [<a href="https://www.isc2.org/certifications/cissp" rel="noopener">CISSP (ISC2)</a>, <T pt="gestão e arquitetura de segurança" en="security management and architecture" />, <T pt="exige anos de experiência; só mais adiante" en="requires years of experience; only later on" />],
          ]}
        />
      </Section>
      <Section id="ethics-cs" title={<T pt="Ética e lei: o que separa estudo de crime" en="Ethics and law: what separates study from crime" />}>
        <p><T pt={<>A diferença entre um pentester e um criminoso não é a técnica, é a <strong>autorização</strong>. Antes de testar qualquer coisa, responda por escrito às três perguntas abaixo. Se alguma resposta for "não sei", não teste.</>} en={<>The difference between a pentester and a criminal is not the technique, it is <strong>authorisation</strong>. Before testing anything, answer the three questions below in writing. If any answer is "I don't know", don't test.</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>É meu?</strong> Máquina, rede, conta de nuvem e aplicação que você administra e pode quebrar sem prejudicar ninguém.</>} en={<><strong>Is it mine?</strong> A machine, network, cloud account and application you run and can break without harming anyone.</>} /></li>
          <li><T pt={<><strong>Tenho autorização por escrito?</strong> Contrato de pentest, regras de um CTF, política de um programa de bug bounty ou a licença da plataforma de treino.</>} en={<><strong>Do I have written authorisation?</strong> A pentest contract, the rules of a CTF, a bug bounty programme's policy or the training platform's terms.</>} /></li>
          <li><T pt={<><strong>Qual é o escopo?</strong> Quais alvos, quais técnicas e quais horários estão permitidos. Fora do escopo é fora da autorização, mesmo no mesmo domínio.</>} en={<><strong>What is the scope?</strong> Which targets, techniques and hours are allowed. Outside the scope is outside the authorisation, even on the same domain.</>} /></li>
        </ul>
        <p><T pt={<>No Brasil, a <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12737.htm" rel="noopener">Lei 12.737/2012</a> criou o crime de invasão de dispositivo informático (art. 154-A do Código Penal), e a <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" rel="noopener">LGPD (Lei 13.709/2018)</a> regula o tratamento de dados pessoais, o que importa se um teste expõe dados reais. Se achar uma falha em um sistema que não é seu, pare, não explore além do mínimo para confirmar, não baixe dados e reporte pelo canal oficial de divulgação (muitas empresas têm um <code>security.txt</code> ou um VDP). Isto é uma orientação geral, não consultoria jurídica.</>} en={<>In Brazil, <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12737.htm" rel="noopener">Law 12,737/2012</a> created the crime of invading a computing device (art. 154-A of the Penal Code), and the <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" rel="noopener">LGPD (Law 13,709/2018)</a> regulates the processing of personal data, which matters if a test exposes real data. If you find a flaw in a system that is not yours, stop, do not exploit beyond the minimum needed to confirm, do not download data and report through the official disclosure channel (many companies have a <code>security.txt</code> or a VDP). This is general guidance, not legal advice.</>} /></p>
        <Callout tone="good" icon="check"><T pt="Hábito que vale ouro: mantenha um diário de laboratório com data, alvo, objetivo e resultado de cada exercício. Em uma entrevista, em um relatório ou numa dúvida sobre autorização, esse registro mostra que você trabalha como profissional." en="A habit worth gold: keep a lab journal with the date, target, goal and result of every exercise. In an interview, in a report or in a doubt about authorisation, that record shows you work like a professional." /></Callout>
      </Section>
      <Section id="plan-cs" title={<T pt="Um plano de 90 dias" en="A 90-day plan" />}>
        <p><T pt="Cerca de seis horas por semana, três blocos de duas horas. O plano assume que você já programa e usa o terminal; ajuste o ritmo, mas não pule os marcos." en="About six hours a week, three two-hour blocks. The plan assumes you already program and use the terminal; adjust the pace, but do not skip the milestones." /></p>
        <Table
          head={[<T pt="Semanas" en="Weeks" />, <T pt="Foco" en="Focus" />, <T pt="Entregável" en="Deliverable" />]}
          rows={[
            ["1 a 3", <T pt="Fundamentos: OverTheWire Bandit; nota de Linux; nota de segurança e redes (sessões, nmap, Wireshark)" en="Foundations: OverTheWire Bandit; the Linux note; the security and networking note (sessions, nmap, Wireshark)" />, <T pt="Bandit até o nível 15; uma captura TCP explicada num post curto" en="Bandit up to level 15; a TCP capture explained in a short post" />],
            ["4 a 6", <T pt="AppSec: nota de aplicações web seguras; 10 laboratórios da Web Security Academy" en="AppSec: the secure web apps note; 10 Web Security Academy labs" />, <T pt="projetos 1 e 2 (auditoria e pipeline) num repositório público" en="projects 1 and 2 (audit and pipeline) in a public repository" />],
            ["7 a 9", <T pt="Ofensiva: nota de red team; Juice Shop; uma trilha do TryHackMe" en="Offence: the red team note; Juice Shop; one TryHackMe path" />, <T pt="projeto 6 (write-ups) com pelo menos 5 desafios" en="project 6 (write-ups) with at least 5 challenges" />],
            ["10 a 12", <T pt="Defesa: projetos 3 e 5; duas investigações do CyberDefenders ou LetsDefend; um modelo de ameaças" en="Defence: projects 3 and 5; two CyberDefenders or LetsDefend investigations; one threat model" />, <T pt="a regra Sigma, o mini SOC e o modelo de ameaças; decidir o caminho (AppSec, red, blue ou nuvem)" en="the Sigma rule, the mini-SOC and the threat model; decide the path (AppSec, red, blue or cloud)" />],
          ]}
        />
      </Section>
      <Section id="cheat-cs" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola: por onde começar, em uma tabela" en="Cheat sheet: where to start, in one table" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faça" en="Do" />]}
          rows={[
            [<T pt="entender redes e Linux" en="to understand networks and Linux" />, <><T pt={<><a href="/notas/linux/"><T pt="Nota de Linux" en="Nota de Linux" /></a> + OverTheWire Bandit</>} en={<><a href="/notas/linux/"><T pt="Linux note" en="Linux note" /></a> + OverTheWire Bandit</>} /></>],
            [<T pt="proteger o que eu construo" en="to protect what I build" />, <><T pt={<><a href="/notas/web-app-security/"><T pt="Aplicações web seguras" en="Aplicações web seguras" /></a> + Projetos 1, 2 e 4</>} en={<><a href="/notas/web-app-security/"><T pt="Secure web apps" en="Secure web apps" /></a> + Projects 1, 2 and 4</>} /></>],
            [<T pt="entender o atacante" en="to understand the attacker" />, <><T pt={<><a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20" en="Red team 80/20" /></a> + TryHackMe + Juice Shop</>} en={<><a href="/notas/cybersecurity-for-devs/"><T pt="Red team 80/20" en="Red team 80/20" /></a> + TryHackMe + Juice Shop</>} /></>],
            [<T pt="ver o que o ataque deixa nos logs" en="to see what the attack leaves in the logs" />, <T pt="Projetos 3 e 5 + CyberDefenders" en="Projects 3 and 5 + CyberDefenders" />],
            [<T pt="praticar sem risco" en="to practise safely" />, <T pt="só em alvos seus ou de treino, com o diário de laboratório" en="only on targets of your own or training ones, with the lab journal" />],
            [<T pt="provar o que sei" en="to prove what I know" />, <T pt="write-ups públicos, CTFs e, depois, uma certificação" en="public write-ups, CTFs and, later, a certification" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="Qual a diferença entre ameaça, vulnerabilidade e risco?" en="What is the difference between threat, vulnerability and risk?" />, <T pt="Ameaça é quem ou o que pode causar dano; vulnerabilidade é a fraqueza que permite; risco é a probabilidade vezes o impacto." en="Threat is who or what can cause harm; vulnerability is the weakness that allows it; risk is probability times impact." />],
            [<T pt="Para que serve a modelagem de ameaças e quando fazê-la?" en="What is threat modelling for and when should you do it?" />, <T pt="Achar falhas de projeto antes do código, percorrendo cada fluxo de dados com perguntas como as do STRIDE; quanto mais cedo, mais barato." en="Finding design flaws before the code, walking each data flow with questions like STRIDE's; the earlier, the cheaper." />],
            [<T pt="Qual a relação entre CVE, CWE e CVSS?" en="How do CVE, CWE and CVSS relate?" />, <T pt="CVE identifica uma vulnerabilidade específica, CWE a classe de fraqueza por trás dela e CVSS a gravidade de 0 a 10." en="CVE identifies one specific vulnerability, CWE the class of weakness behind it and CVSS the 0-to-10 severity." />],
            [<T pt="O que diferencia red team, blue team e purple team?" en="What distinguishes red, blue and purple team?" />, <T pt="Red ataca com autorização, blue detecta e responde, purple faz os dois trabalharem juntos: roda a técnica e confere se o alerta dispara." en="Red attacks with authorisation, blue detects and responds, purple makes the two work together: runs the technique and checks whether the alert fires." />],
            [<T pt="Por que um dev deve começar por AppSec?" en="Why should a developer start with AppSec?" />, <T pt="Porque reaproveita o que já sabe (código, testes, CI) e porque cada falha corrigida no projeto evita trabalho de red e de blue depois." en="Because it reuses what you already know (code, tests, CI) and because each flaw fixed in the design saves red and blue work later." />],
            [<T pt={"Por que \"supor a invasão\" é uma boa premissa de projeto?"} en={"Why is \"assume breach\" a good design premise?"} />, <T pt="Porque nenhuma prevenção é perfeita; segmentação, menor privilégio, logs e plano de resposta limitam o dano quando algo passa." en="Because no prevention is perfect; segmentation, least privilege, logs and a response plan limit the damage when something gets through." />],
            [<T pt="Quais três perguntas responder antes de testar algo?" en="Which three questions must you answer before testing anything?" />, <T pt="É meu? Tenho autorização por escrito? Qual é o escopo?" en="Is it mine? Do I have written authorisation? What is the scope?" />],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "roadmap.sh. Cyber Security Roadmap.", href: "https://roadmap.sh/cyber-security" },
          { label: "OWASP Top 10. The most common web application security risks.", href: "https://owasp.org/www-project-top-ten/" },
          { label: "OWASP Application Security Verification Standard (ASVS).", href: "https://owasp.org/www-project-application-security-verification-standard/" },
          { label: "OWASP Web Security Testing Guide (WSTG).", href: "https://owasp.org/www-project-web-security-testing-guide/" },
          { label: "OWASP Cheat Sheet Series.", href: "https://cheatsheetseries.owasp.org" },
          { label: "MITRE ATT&CK. Public catalogue of adversary tactics and techniques.", href: "https://attack.mitre.org/" },
          { label: "NIST Cybersecurity Framework.", href: "https://www.nist.gov/cyberframework" },
          { label: "NIST SP 800-61 Rev. 3. Incident Response Recommendations and Considerations for Cybersecurity Risk Management.", href: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" },
          { label: "CIS Critical Security Controls.", href: "https://www.cisecurity.org/controls" },
          { label: "OWASP Threat Dragon. Open-source threat modelling tool.", href: "https://owasp.org/www-project-threat-dragon/" },
          { label: "SigmaHQ. Generic signature format for SIEM systems.", href: "https://github.com/SigmaHQ/sigma" },
          { label: "Red Canary. Atomic Red Team, small tests mapped to MITRE ATT&CK.", href: "https://github.com/redcanaryco/atomic-red-team" },
          { label: "Suricata. Open-source network IDS, IPS and monitoring engine.", href: "https://suricata.io" },
          { label: "Wazuh documentation. Deployment on Docker.", href: "https://documentation.wazuh.com/current/deployment-options/docker/index.html" },
          { label: "Gitleaks. Secret detection in Git repositories.", href: "https://github.com/gitleaks/gitleaks" },
          { label: "Trivy. Vulnerability and misconfiguration scanner.", href: "https://trivy.dev" },
          { label: "Semgrep documentation. Getting started.", href: "https://semgrep.dev/docs/getting-started/" },
          { label: "Cowrie. SSH and Telnet honeypot.", href: "https://github.com/cowrie/cowrie" },
          { label: "CERT.br. Cartilha de Segurança para Internet.", href: "https://cartilha.cert.br" },
          { label: "Ross Anderson. Security Engineering (free online).", href: "https://www.cl.cam.ac.uk/~rja14/book.html" },
        ]}
      />
    </>
  );
}
