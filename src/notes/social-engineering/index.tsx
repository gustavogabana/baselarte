import { Callout, CodeBlock, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "social-engineering",
  title: { en: "Social engineering: attacks, defences and a phishing-simulation lab", pt: "Engenharia social: ataques, defesas e um laboratório de simulação de phishing" },
  seo: {
    title: { en: "Social engineering: attacks, defences and a phishing-simulation lab", pt: "Engenharia social: ataques, defesas e um laboratório de simulação de phishing" },
    description: { en: "Why people are the most exploited link: Cialdini's principles, phishing, vishing, pretexting and physical tactics, how to spot them, the controls that stop them, and a Gophish simulation to run locally.", pt: "Por que as pessoas são o elo mais explorado: princípios de Cialdini, phishing, vishing, pretexting e táticas físicas, como reconhecê-las, os controles que as barram e uma simulação com Gophish para rodar localmente." },
  },
  summary: "attacks and defences: Cialdini's principles, phishing, vishing, pretexting, physical tactics, red flags, email authentication (SPF, DKIM, DMARC), phishing-resistant MFA, and a Gophish simulation to run locally.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Social engineering: <em>attack and defence.</em></>, pt: <>Engenharia social: <em>ataque e defesa.</em></> },
  heroLede: { en: "How attackers manipulate trust, the tactics you will actually meet, the signs that give them away, and the technical and human controls that stop them, with a safe phishing simulation to run on your own machine.", pt: "Como atacantes manipulam a confiança, as táticas que você realmente vai encontrar, os sinais que as denunciam e os controles técnicos e humanos que as barram, com uma simulação segura de phishing para rodar na sua máquina." },
  published: "2026-10-23",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro-se", title: <T pt="Antes de começar: por que o fator humano importa mais" en="Before you start: why the human factor matters most" /> },
        { id: "principles", title: <T pt="Os seis princípios de influência (Cialdini)" en="The six principles of influence (Cialdini)" /> },
        { id: "tactics", title: <T pt="As táticas mais comuns, e como reconhecê-las" en="The most common tactics, and how to spot them" /> },
        { id: "email-auth", title: <T pt="Defesa de domínio: SPF, DKIM e DMARC" en="Domain defence: SPF, DKIM and DMARC" /> },
        { id: "gophish-lab", title: <T pt="Laboratório: uma campanha de phishing simulada" en="Lab: a simulated phishing campaign" /> },
        { id: "human-defense", title: <T pt="Defesa: processo, cultura e controles técnicos" en="Defence: process, culture and technical controls" /> },
        { id: "cheat-se", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro-se" title={<T pt="Antes de começar: por que o fator humano importa mais" en="Before you start: why the human factor matters most" />}>
        <p><T pt={<>A maioria das invasões reais não começa com um exploit técnico: começa com uma pessoa confiando em quem não devia. <em>Engenharia social</em> é a técnica de manipular essa confiança para obter acesso, informação ou dinheiro. Segundo relatórios anuais de resposta a incidentes (como o Verizon DBIR), é o vetor inicial mais comum de violação de dados — mais do que qualquer vulnerabilidade de software isolada, porque explora algo que nenhum patch corrige: confiança humana.</>} en={<>Most real breaches do not start with a technical exploit: they start with a person trusting someone they should not have. <em>Social engineering</em> is the technique of manipulating that trust to gain access, information or money. According to annual incident-response reports (like the Verizon DBIR), it is the most common initial breach vector — more than any single software vulnerability, because it exploits something no patch fixes: human trust.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt="Esta nota explica o ataque para que você o reconheça e o defenda — não é um roteiro para manipular pessoas reais. O laboratório de phishing usa e-mails fictícios seus, interceptados por um servidor de teste, nunca alvos reais sem consentimento. Simular phishing contra colegas ou terceiros sem autorização explícita da organização é, no mínimo, uma violação ética, e pode ser crime." en="This note explains the attack so you can recognise and defend against it — it is not a script for manipulating real people. The phishing lab uses fictional emails of your own, intercepted by a test server, never real targets without consent. Simulating phishing against colleagues or third parties without an organisation's explicit authorization is, at minimum, an ethical violation, and can be a crime." /></Callout>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é o complemento humano da <a href="/notas/web-host-attack-defense/">nota de ataque e defesa web e de servidor</a> — a mesma trilha da <a href="/notas/cybersecurity-for-devs/">cibersegurança para quem programa</a>, só que do lado de quem nunca escreve uma linha de SQL malicioso e ainda assim entra.</>} en={<>Where this note fits: it is the human counterpart to the <a href="/notas/web-host-attack-defense/">web and host attack and defence note</a> — the same path as <a href="/notas/cybersecurity-for-devs/">cybersecurity for developers</a>, just from the side of someone who never writes a line of malicious SQL and still gets in.</>} /></Callout>
      </Section>
      <Section id="principles" title={<T pt="Os seis princípios de influência (Cialdini)" en="The six principles of influence (Cialdini)" />}>
        <p><T pt={"O psicólogo Robert Cialdini catalogou os gatilhos que fazem pessoas dizerem \"sim\" — e são exatamente os que um pretexto de engenharia social explora. Reconhecer o gatilho, no momento em que ele é usado contra você, já é metade da defesa."} en={"Psychologist Robert Cialdini catalogued the triggers that make people say \"yes\" — and they are exactly the ones a social-engineering pretext exploits. Recognising the trigger, at the moment it is used against you, is already half the defence."} /></p>
        <Table
          head={[<T pt="Princípio" en="Principle" />, <T pt="Como aparece num ataque" en="How it shows up in an attack" />]}
          rows={[
            [<T pt="Autoridade" en="Authority" />, <T pt={"\"Sou do suporte de TI / da diretoria\" — um crachá falso, um e-mail que parece do chefe"} en={"\"I'm from IT support / from the board\" — a fake badge, an email that looks like it's from the boss"} />],
            [<T pt="Urgência/escassez" en="Urgency/scarcity" />, <T pt={"\"Sua conta será bloqueada em 1 hora\" — não dá tempo de pensar ou confirmar"} en={"\"Your account will be locked in 1 hour\" — no time to think or verify"} />],
            [<T pt="Prova social" en="Social proof" />, <T pt={"\"Todo o seu time já preencheu isso\" — nomes reais de colegas aumentam a credibilidade"} en={"\"Your whole team already filled this out\" — real colleagues' names boost credibility"} />],
            [<T pt="Simpatia/afinidade" en="Liking" />, <T pt="um perfil falso que parece interessado nos mesmos hobbies, antes de pedir algo" en="a fake profile that seems interested in the same hobbies, before asking for something" />],
            [<T pt="Reciprocidade" en="Reciprocity" />, <T pt={"um \"favor\" pequeno antes (segurar a porta, ajudar com algo) antes do pedido real"} en={"a small \"favour\" first (holding the door, helping with something) before the real ask"} />],
            [<T pt="Compromisso/coerência" en="Commitment/consistency" />, <T pt="fazer a pessoa concordar com algo pequeno primeiro, depois pedir mais" en="getting the person to agree to something small first, then asking for more" />],
          ]}
        />
      </Section>
      <Section id="tactics" title={<T pt="As táticas mais comuns, e como reconhecê-las" en="The most common tactics, and how to spot them" />}>
        <p><T pt="Cada tática combina um ou mais dos princípios acima com um canal específico (e-mail, telefone, presença física). Saber o nome ajuda a reconhecer o padrão rápido, antes de reagir ao conteúdo." en="Each tactic combines one or more of the principles above with a specific channel (email, phone, physical presence). Knowing the name helps you spot the pattern quickly, before reacting to the content." /></p>
        <Table
          head={[<T pt="Tática" en="Tactic" />, <T pt="Como funciona" en="How it works" />, <T pt="Sinal de alerta" en="Red flag" />]}
          rows={[
            [<T pt="Phishing" en="Phishing" />, <T pt="e-mail em massa fingindo ser de um serviço confiável, com um link ou anexo malicioso" en="mass email pretending to be from a trusted service, with a malicious link or attachment" />, <T pt="domínio do remetente quase certo, mas não exatamente igual" en="sender domain almost right, but not exactly matching" />],
            [<T pt="Spear phishing" en="Spear phishing" />, <T pt="phishing dirigido a UMA pessoa, com detalhes reais sobre ela (cargo, projetos, colegas) para parecer legítimo" en="phishing aimed at ONE person, with real details about them (role, projects, colleagues) to look legitimate" />, <T pt="um pedido fora do padrão, mesmo vindo de alguém conhecido" en="an out-of-the-ordinary request, even from someone known" />],
            [<T pt="Vishing" en="Vishing" />, <T pt={"a mesma ideia, por telefone — \"sou do banco, preciso confirmar seu código\""} en={"the same idea, by phone — \"I'm from the bank, I need to confirm your code\""} />, <T pt="pedido de um código de uso único por telefone — nenhuma instituição legítima faz isso" en="asking for a one-time code by phone — no legitimate institution does this" />],
            [<T pt="Pretexting" en="Pretexting" />, <T pt="uma história inventada e consistente (um técnico, um auditor, um novo funcionário) para justificar um pedido fora do comum" en="a made-up, consistent story (a technician, an auditor, a new hire) to justify an out-of-the-ordinary request" />, <T pt="a história muda levemente se você pedir para confirmar um detalhe" en="the story shifts slightly if you ask to confirm one detail" />],
            [<T pt="Baiting" en="Baiting" />, <T pt={"deixar um pendrive \"esquecido\" no estacionamento, esperando que alguém o conecte por curiosidade"} en={"leaving a \"lost\" USB drive in the parking lot, hoping someone plugs it in out of curiosity"} />, <T pt="qualquer mídia física não solicitada" en="any unsolicited physical media" />],
            [<T pt="Tailgating" en="Tailgating" />, <T pt="seguir alguém por uma porta com controle de acesso, sem crachá próprio, confiando na educação da pessoa" en="following someone through an access-controlled door with no badge of their own, relying on politeness" />, <T pt={"alguém sem crachá visível pedindo para \"só passar rapidinho\""} en={"someone with no visible badge asking to \"just slip through\""} />],
            [<T pt="MFA fatigue" en="MFA fatigue" />, <T pt="disparar vários pedidos de aprovação de MFA seguidos, na esperança de que a vítima aprove um por cansaço" en="firing several MFA approval prompts in a row, hoping the victim approves one out of fatigue" />, <T pt="prompts de MFA que você não solicitou, em sequência" en="MFA prompts you did not request, in a row" />],
          ]}
        />
      </Section>
      <Section id="email-auth" title={<T pt="Defesa de domínio: SPF, DKIM e DMARC" en="Domain defence: SPF, DKIM and DMARC" />}>
        <p><T pt={"Antes de chegar à caixa de entrada de alguém, o phishing geralmente tenta forjar o campo \"De\" de um e-mail. Três registros DNS, usados juntos, fecham essa porta na maior parte dos provedores modernos."} en={"Before it reaches someone's inbox, phishing usually tries to forge an email's \"From\" field. Three DNS records, used together, close that door on most modern providers."} /></p>
        <Table
          head={[<T pt="Registro" en="Record" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            ["SPF", <T pt={"lista quais servidores têm permissão de enviar e-mail \"em nome\" do seu domínio"} en={"lists which servers are allowed to send mail \"on behalf of\" your domain"} />],
            ["DKIM", <T pt="assina criptograficamente cada e-mail enviado, provando que não foi alterado no caminho" en="cryptographically signs each outgoing email, proving it was not altered in transit" />],
            ["DMARC", <T pt="diz ao servidor de quem recebe o que fazer quando SPF ou DKIM falham (rejeitar, colocar em quarentena) e manda relatórios" en="tells the receiving server what to do when SPF or DKIM fail (reject, quarantine) and sends reports" />],
          ]}
        />
        <CodeBlock>
          <span className="tok-c"># checar os três registros de um domínio (seu, ou qualquer um público)</span>{"\n"}
          {"dig TXT +short exemplo.com | grep spf\n"}
          {"dig TXT +short _dmarc.exemplo.com\n"}
          {"dig TXT +short default._domainkey.exemplo.com   "}<span className="tok-c"># o seletor DKIM varia por provedor</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> um domínio bem configurado mostra uma linha <code>v=spf1 ...</code>, uma <code>v=DMARC1; p=reject;</code> (ou <code>quarantine</code>) e um registro DKIM de pelo menos uma chave. A ausência de qualquer um deles é o tipo de falha que um relatório de postura de segurança aponta primeiro.</>} en={<><strong>Expected result:</strong> a well-configured domain shows a <code>v=spf1 ...</code> line, a <code>v=DMARC1; p=reject;</code> (or <code>quarantine</code>) one, and a DKIM record for at least one key. The absence of any of them is the kind of gap a security-posture report flags first.</>} /></p>
      </Section>
      <Section id="gophish-lab" title={<T pt="Laboratório: uma campanha de phishing simulada" en="Lab: a simulated phishing campaign" />}>
        <p><T pt={<><code>Gophish</code> é um framework de código aberto feito exatamente para isso: equipes de segurança o usam para treinar a própria organização, enviando phishing simulado e medindo quem clicou — sem nenhum dado real sendo roubado.</>} en={<><code>Gophish</code> is an open-source framework built exactly for this: security teams use it to train their own organisation, sending simulated phishing and measuring who clicked — with no real data ever stolen.</>} /></p>
        <CodeBlock>
          {"docker run -d --name gophish -p 127.0.0.1:3333:3333 -p 127.0.0.1:8080:80 gophish/gophish\n"}
          {"docker logs gophish 2>&1 | grep -i "}<span className="tok-s">"password"</span>{"   "}<span className="tok-c"># a senha inicial do admin fica nos logs do container</span>{"\n"}
          <span className="tok-c"># abra https://localhost:3333 (aceite o certificado autoassinado) e entre com admin / a senha acima</span>
        </CodeBlock>
        <p><T pt={<>No painel, crie: um "Sending Profile" (um servidor SMTP de teste, como o <a href="https://mailtrap.io" rel="noopener">Mailtrap</a>, que captura e-mails sem enviá-los de verdade), um "Landing Page" (uma cópia visual de uma tela de login, só para medir cliques) e um grupo de "alvos" com e-mails fictícios seus. Dispare a campanha e veja o painel mostrar, em tempo real, quem abriu o e-mail e quem clicou — é exatamente essa métrica que times de segurança usam para medir o risco humano da própria empresa.</>} en={<>In the panel, create: a "Sending Profile" (a test SMTP server, like <a href="https://mailtrap.io" rel="noopener">Mailtrap</a>, which captures emails without really sending them), a "Landing Page" (a visual copy of a login screen, just to measure clicks) and a "targets" group with fictional emails of your own. Launch the campaign and watch the panel show, in real time, who opened the email and who clicked — this is exactly the metric security teams use to measure their own company's human risk.</>} /></p>
        <p><T pt={<><strong>Resultado esperado:</strong> o painel do Gophish mostra uma linha do tempo com "Email Sent" → "Email Opened" → "Clicked Link" para cada alvo de teste, sem que nenhum e-mail real tenha saído (o Mailtrap intercepta tudo). É assim que uma empresa mede sua taxa de cliques antes e depois de um treinamento de conscientização.</>} en={<><strong>Expected result:</strong> the Gophish dashboard shows a timeline with "Email Sent" → "Email Opened" → "Clicked Link" for each test target, with no real email ever leaving (Mailtrap intercepts everything). This is how a company measures its click rate before and after an awareness training.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={"Use só e-mails e \"targets\" fictícios seus (contas de teste, endereços que você controla). Rodar uma campanha do Gophish contra pessoas reais sem o consentimento explícito delas e da organização é o mesmo phishing que esta nota ensina a identificar — só que feito por você."} en={"Only use fictional emails and \"targets\" of your own (test accounts, addresses you control). Running a Gophish campaign against real people without their and the organisation's explicit consent is the same phishing this note teaches you to spot — just done by you."} /></Callout>
      </Section>
      <Section id="human-defense" title={<T pt="Defesa: processo, cultura e controles técnicos" en="Defence: process, culture and technical controls" />}>
        <p><T pt="Nenhum controle único resolve engenharia social — é uma combinação de tecnologia (que reduz o volume que chega) e cultura (que reduz a chance de alguém cair no que passa)." en="No single control solves social engineering — it is a combination of technology (which reduces the volume that gets through) and culture (which reduces the odds that someone falls for what does)." /></p>
        <Table
          head={[<T pt="Controle" en="Control" />, <T pt="Reduz" en="Reduces" />]}
          rows={[
            [<T pt="SPF, DKIM e DMARC no domínio (acima)" en="SPF, DKIM and DMARC on the domain (above)" />, <T pt={"e-mails forjados \"de\" o seu próprio domínio chegando a outras empresas, e vice-versa"} en={"emails forged \"from\" your own domain reaching other companies, and vice versa"} />],
            [<T pt="MFA resistente a phishing (chaves FIDO2/passkeys)" en="Phishing-resistant MFA (FIDO2 keys/passkeys)" />, <T pt="uma senha roubada sozinha não é mais suficiente para entrar — veja a nota de criptografia e chaves" en="a stolen password alone is no longer enough to log in — see the cryptography and keys note" />],
            [<T pt={"Cultura de verificação (\"ligue de volta pelo número oficial\")"} en={"A verification culture (\"call back on the official number\")"} />, <T pt="pedidos urgentes e fora do padrão por e-mail/telefone sozinho" en="urgent, out-of-the-ordinary requests by email/phone alone" />],
            [<T pt="Treinamento recorrente + campanhas simuladas (como a do Gophish acima)" en="Recurring training + simulated campaigns (like the Gophish one above)" />, <T pt="a taxa de cliques cai de forma mensurável com prática" en="the click rate measurably drops with practice" />],
            [<T pt={"Crachá visível + política de \"sem exceção\" para tailgating"} en={"Visible badge + a \"no exceptions\" tailgating policy"} />, <T pt="acesso físico não autorizado" en="unauthorised physical access" />],
            [<T pt={"Desabilitar USB autorun; política de \"achou, entregue, não conecte\""} en={"Disable USB autorun; a \"found it, hand it in, don't plug it in\" policy"} />, <T pt="ataques de baiting com pendrive" en="USB baiting attacks" />],
            [<T pt="Limitar o número de pedidos de MFA por janela de tempo" en="Rate-limiting MFA prompts per time window" />, <T pt="ataques de MFA fatigue" en="MFA-fatigue attacks" />],
          ]}
        />
      </Section>
      <Section id="cheat-se" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola: tática, sinal e defesa" en="Cheat sheet: tactic, signal and defence" /></h3>
        <Table
          head={[<T pt="Tática" en="Tactic" />, <T pt="Sinal de alerta" en="Red flag" />, <T pt="Defesa principal" en="Main defence" />]}
          rows={[
            ["Phishing", <T pt="domínio quase certo" en="near-right domain" />, "SPF/DKIM/DMARC + treinamento"],
            ["Vishing", <T pt="pedido de código por telefone" en="code requested by phone" />, <T pt="cultura de callback" en="callback culture" />],
            ["Pretexting", <T pt="história que muda com detalhe" en="story shifts under detail" />, <T pt="verificação de identidade por canal oficial" en="identity check via an official channel" />],
            ["Baiting", <T pt="mídia física não solicitada" en="unsolicited physical media" />, <T pt="desabilitar autorun, política de entrega" en="disable autorun, hand-in policy" />],
            ["Tailgating", <T pt="sem crachá, pedindo passagem" en="no badge, asking to be let through" />, <T pt="crachá obrigatório, sem exceções" en="mandatory badge, no exceptions" />],
            ["MFA fatigue", <T pt="prompts não solicitados em série" en="unsolicited prompts in a row" />, <T pt="MFA resistente a phishing, rate limit" en="phishing-resistant MFA, rate limit" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="Por que o phishing é o vetor inicial mais comum, segundo os relatórios do setor?" en="Why is phishing the most common initial vector, per industry reports?" />, <T pt="Explora confiança humana, que é mais difícil de corrigir com uma atualização do que uma falha de software." en="It exploits human trust, which is harder to patch than a software flaw." />],
            [<T pt={"Qual princípio de Cialdini um e-mail de \"sua conta será bloqueada em 1 hora\" usa?"} en={"Which Cialdini principle does a \"your account will be locked in 1 hour\" email use?"} />, <T pt="Urgência/escassez: não dá tempo de verificar antes de agir." en="Urgency/scarcity: it gives no time to verify before acting." />],
            [<T pt="O que o DMARC adiciona que SPF e DKIM sozinhos não dão?" en="What does DMARC add that SPF and DKIM alone do not?" />, <T pt="Diz ao servidor de quem recebe o que fazer quando um dos dois falha, e manda relatórios de abuso." en="It tells the receiving server what to do when one of them fails, and sends abuse reports." />],
            [<T pt="Cite dois controles que reduzem o risco de engenharia social sem depender só do usuário perceber." en="Name two controls that reduce social-engineering risk without relying solely on the user noticing." />, <T pt="MFA resistente a phishing e SPF/DKIM/DMARC no domínio (entre outros: rate limit de MFA, políticas físicas)." en="Phishing-resistant MFA and SPF/DKIM/DMARC on the domain (among others: MFA rate limiting, physical policies)." />],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "Christopher Hadnagy. Social Engineering: The Science of Human Hacking, 2nd edition. Wiley, 2018 (and the Social-Engineer.org framework).", href: "https://www.social-engineer.org/" },
          { label: "Robert Cialdini. The Science of Persuasion (official summary of the six principles).", href: "https://www.influenceatwork.com/principles-of-persuasion/" },
          { label: "Gophish documentation. Open-source phishing simulation framework.", href: "https://www.getgophish.com/" },
          { label: "Verizon. Data Breach Investigations Report (DBIR), annual.", href: "https://www.verizon.com/business/resources/reports/dbir/" },
          { label: "RFC 7489. Domain-based Message Authentication, Reporting and Conformance (DMARC).", href: "https://datatracker.ietf.org/doc/html/rfc7489" },
          { label: "CISA. Phishing and Social Engineering guidance.", href: "https://www.cisa.gov/stopransomware/phishing-and-social-engineering" },
          { label: "MITRE ATT&CK, T1566: Phishing.", href: "https://attack.mitre.org/techniques/T1566/" },
        ]}
      />
    </>
  );
}
