import { Callout, CodeBlock, Diagram, Section, Sources, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "passkeys-sessions-ssh",
  title: "Passkeys, sessões e SSH",
  seo: {
    title: "Passkeys, sessões e SSH: chaves no aparelho, passo a passo",
    description: "Como os apps guardam a chave privada no aparelho (passkeys), como a sessão segue o login e o SSH passo a passo, com erros comuns e uma cola.",
  },
  summary: "chaves privadas guardadas no aparelho (passkeys, WebAuthn), login por desafio e assinatura, sessões depois do login (cookies, tokens, riscos), SSH passo a passo (host keys, known_hosts, authorized_keys, agent), erros comuns e uma cola.",
  kicker: "Guia de estudo",
  heroTitle: <>Passkeys, sessões e SSH: <em>a chave não sai do lugar.</em></>,
  heroLede: "Como os apps provam quem você é assinando um desafio, como a sessão continua depois disso e o que o SSH faz passo a passo.",
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "intro", title: "Antes de ler" },
        { id: "device", title: "Apps com a chave privada no aparelho" },
        { id: "session", title: "E depois do login: a sessão" },
        { id: "ssh", title: "Como o SSH funciona" },
        { id: "errors", title: "Erros comuns e como resolver" },
        { id: "cheat-cry", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={"Antes de ler"}>
        <Callout icon="check">Esta nota aplica o que está em <a href="/notas/crypto-keys-ssh/">Criptografia: chaves, assinaturas e TLS</a>: par de chaves, assinatura e desafio. Aqui elas viram login sem senha (passkeys), sessão depois do login e SSH.</Callout>
      </Section>
      <Section id="device" title={"Apps com a chave privada no aparelho"}>
        <p>Passkeys, apps de banco, autenticadores e chaves de segurança seguem o mesmo desenho: o <b>aparelho</b> gera o par, guarda a privada e entrega ao servidor só a pública. Daí em diante, entrar é <b>assinar um desafio</b>, não digitar um segredo que o servidor também conhece.</p>
        <h3>1. Cadastro: o par nasce no aparelho</h3>
        <Diagram minWidth={560} caption={"No cadastro (registro de passkey, ativação de biometria num app), o aparelho gera o par; a privada fica no chip, a pública vai para o servidor."}>
          <svg viewBox="0 0 700 262" role="img" aria-label="Cadastro de um login por chave no aparelho">
            <rect x="15" y="15" width="300" height="235" rx="4" className="ln" />
            <text x="165" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>Seu aparelho</text>
            <rect x="35" y="55" width="54" height="96" rx="8" className="ln fillsoft" />
            <path d="M56.0 61L68.0 61" className="ln" />
            <text x="62" y="168" className="mut" textAnchor="middle">app</text>
            <rect x="120" y="70" width="170" height="56" rx="3" className="brandfill" />
            <path d="M132.0 65L132.0 70M132.0 126L132.0 131" className="ln" />
            <path d="M180.7 65L180.7 70M180.7 126L180.7 131" className="ln" />
            <path d="M229.3 65L229.3 70M229.3 126L229.3 131" className="ln" />
            <path d="M278.0 65L278.0 70M278.0 126L278.0 131" className="ln" />
            <text x="205" y="94" textAnchor="middle" style={{ fontWeight: "600" }}>chip seguro</text>
            <text x="205" y="112" className="mut" textAnchor="middle">Enclave · TPM · StrongBox</text>
            <circle cx="147" cy="150" r="8" className="fill" />
            <circle cx="147" cy="150" r="3" className="inv" />
            <path d="M155 150L177 150M171 150L171 156M177 150L177 156" className="ln" />
            <text x="185" y="154" textAnchor="start">privada: fica aqui</text>
            <circle cx="147" cy="190" r="8" className="brandfill" />
            <circle cx="147" cy="190" r="3" className="inv" />
            <path d="M155 190L177 190M171 190L171 196M177 190L177 196" className="ln" />
            <text x="190" y="194" textAnchor="start">pública: pode sair</text>
            <text x="165" y="236" className="mut" textAnchor="middle">a privada é marcada como "não exportável"</text>
            <rect x="430" y="15" width="255" height="235" rx="4" className="ln" />
            <text x="557" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>Servidor</text>
            <rect x="455" y="55" width="54" height="66" rx="4" className="ln fillsoft" />
            <path d="M463 65L501 65" className="ln" />
            <circle cx="495" cy="73" r="2" className="fill" />
            <path d="M463 85L501 85" className="ln" />
            <circle cx="495" cy="93" r="2" className="fill" />
            <path d="M463 105L501 105" className="ln" />
            <circle cx="495" cy="113" r="2" className="fill" />
            <text x="550" y="80" className="mut" textAnchor="start">tabela de contas</text>
            <rect x="520" y="92" width="150" height="70" rx="4" className="ln fillsoft" />
            <text x="595.0" y="114.5" textAnchor="middle">gustavo</text>
            <text x="595.0" y="131.5" textAnchor="middle">credencial: id</text>
            <text x="595.0" y="148.5" textAnchor="middle">chave pública: …</text>
            <text x="557" y="190" textAnchor="middle">guarda só a pública</text>
            <text x="557" y="210" className="mut" textAnchor="middle">vazar o banco não permite</text>
            <text x="557" y="228" className="mut" textAnchor="middle">entrar como você</text>
            <path d="M315 214L430 214" className="ln" />
            <path d="M422.0 217.6L430 214L422.0 210.4" className="ln" />
            <text x="372" y="206" textAnchor="middle">só a pública viaja</text>
          </svg>
        </Diagram>
        <h3>2. Login: o servidor desafia, o aparelho assina</h3>
        <Diagram minWidth={560} caption={"O servidor nunca recebe senha nem a chave privada: recebe a prova de que o aparelho a possui. Como o desafio é novo a cada vez, copiar a resposta não adianta."}>
          <svg viewBox="0 0 700 396" role="img" aria-label="Login por desafio e assinatura com a chave do aparelho">
            <rect x="45" y="8" width="150" height="34" rx="4" className="ln" />
            <text x="120.0" y="29.5" textAnchor="middle">Aparelho + app</text>
            <rect x="505" y="8" width="150" height="34" rx="4" className="ln" />
            <text x="580.0" y="29.5" textAnchor="middle">Servidor</text>
            <path d="M120 42L120 388" className="ln dash" />
            <path d="M580 42L580 388" className="ln dash" />
            <path d="M124 75L576 75" className="ln" />
            <path d="M568.0 78.6L576 75L568.0 71.4" className="ln" />
            <text x="350" y="67" textAnchor="middle">① quero entrar como "gustavo"</text>
            <path d="M576 115L124 115" className="ln" />
            <path d="M132.0 111.4L124 115L132.0 118.6" className="ln" />
            <text x="350" y="107" textAnchor="middle">② desafio: número aleatório novo (nonce)</text>
            <rect x="30" y="140" width="200" height="56" rx="4" className="brandfill" />
            <text x="130.0" y="164.0" textAnchor="middle">③ biometria ou PIN</text>
            <text x="130.0" y="181.0" className="mut" textAnchor="middle">libera o uso da chave (local)</text>
            <rect x="30" y="212" width="200" height="56" rx="4" className="brandfill" />
            <text x="130.0" y="236.0" textAnchor="middle">④ o chip assina o desafio</text>
            <text x="130.0" y="253.0" className="mut" textAnchor="middle">com a chave privada</text>
            <path d="M124 300L576 300" className="ln" />
            <path d="M568.0 303.6L576 300L568.0 296.4" className="ln" />
            <text x="350" y="292" textAnchor="middle">⑤ assinatura do desafio (+ domínio/app)</text>
            <rect x="400" y="322" width="270" height="58" rx="4" className="ln fillsoft" />
            <text x="535.0" y="347.0" textAnchor="middle">⑥ verifica com a chave pública</text>
            <text x="535.0" y="364.0" className="mut" textAnchor="middle">guardada no cadastro → ok</text>
            <text x="350" y="330" textAnchor="middle"></text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><b>Por que um desafio novo a cada vez?</b> Se a assinatura fosse sempre a mesma, quem a interceptasse poderia reenviá-la (ataque de replay). Com um número aleatório inédito, cada resposta só vale uma vez.</li>
          <li><b>Por que a biometria não vai para o servidor?</b> Ela só autoriza o chip a usar a chave, localmente. O servidor recebe uma assinatura, nunca a digital nem o rosto.</li>
          <li><b>Por que resiste a phishing?</b> No WebAuthn a assinatura cobre o domínio (origem) da página. Uma página falsa em outro domínio não consegue obter uma assinatura que valha para o site verdadeiro.</li>
          <li><b>E se vazar o banco de dados do servidor?</b> Lá só há chaves públicas, que não permitem assinar. Compare com senhas, em que o vazamento de hashes já ajuda quem ataca.</li>
        </ul>
        <h3>Onde fica a chave privada</h3>
        <Diagram minWidth={560} caption={"Em cada plataforma o nome muda, a ideia não: um cofre em hardware que assina por você e nunca entrega a chave."}>
          <svg viewBox="0 0 700 226" role="img" aria-label="Onde fica a chave privada no aparelho">
            <rect x="30" y="14" width="380" height="54" rx="4" className="ln" />
            <text x="220" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>App (código do aplicativo)</text>
            <text x="220" y="55" className="mut" textAnchor="middle">só pede: "assine isto"</text>
            <rect x="30" y="84" width="380" height="54" rx="4" className="ln fillsoft" />
            <text x="220" y="106" textAnchor="middle" style={{ fontWeight: "600" }}>API do sistema (Keychain, Keystore, CNG)</text>
            <text x="220" y="125" className="mut" textAnchor="middle">controla quem pode usar a chave</text>
            <rect x="30" y="154" width="380" height="54" rx="4" className="brandfill" />
            <text x="220" y="176" textAnchor="middle" style={{ fontWeight: "600" }}>Hardware seguro (Enclave, TEE/StrongBox, TPM)</text>
            <text x="220" y="195" className="mut" textAnchor="middle">a chave privada vive e assina aqui dentro</text>
            <path d="M120 68L120 84" className="ln" />
            <path d="M116.4 76.0L120 84L123.6 76.0" className="ln" />
            <path d="M120 138L120 154" className="ln" />
            <path d="M116.4 146.0L120 154L123.6 146.0" className="ln" />
            <path d="M320 154L320 138" className="ln" />
            <path d="M323.6 146.0L320 138L316.4 146.0" className="ln" />
            <path d="M320 84L320 68" className="ln" />
            <path d="M323.6 76.0L320 68L316.4 76.0" className="ln" />
            <text x="110" y="80" textAnchor="middle"></text>
            <text x="445" y="50" textAnchor="start">↓ pedido de assinatura</text>
            <text x="445" y="70" textAnchor="start">↑ só a assinatura volta</text>
            <text x="445" y="110" textAnchor="start" style={{ fontWeight: "600" }}>A chave privada nunca sobe</text>
            <text x="445" y="128" textAnchor="start" style={{ fontWeight: "600" }}>ao app nem à memória comum</text>
            <text x="445" y="164" className="mut" textAnchor="start">Limite honesto: aparelho comprometido</text>
            <text x="445" y="182" className="mut" textAnchor="start">e desbloqueado ainda pode PEDIR</text>
            <text x="445" y="200" className="mut" textAnchor="start">assinaturas, mas não COPIA a chave.</text>
          </svg>
        </Diagram>
        <Table
          head={["Plataforma", "Cofre", "Comportamento"]}
          rows={[
            [<b>iPhone / Mac</b>, "Secure Enclave + Keychain", "Chaves podem ser geradas dentro do Enclave e não saem dele; o app só pede a assinatura."],
            [<b>Android</b>, "Android Keystore (TEE ou StrongBox)", "Chaves protegidas por hardware, marcadas como não exportáveis; uso pode exigir biometria."],
            [<b>Windows / Linux</b>, "TPM", "Chip na placa-mãe que guarda e usa chaves sem entregá-las."],
            [<b>Chave de segurança</b>, "YubiKey e similares (FIDO2)", "Hardware dedicado: a chave nunca está no seu computador e vale em vários aparelhos."],
            [<b>Gerenciador de senhas</b>, "Cofre sincronizado", "Passkeys sincronizadas entre aparelhos: mais conveniência, e a segurança passa a depender da conta do gerenciador."],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>Perdeu o aparelho?</b> A chave privada some com ele, e é isso que se quer. O servidor precisa de um caminho de recuperação (outra passkey, códigos de backup) e de um modo de <b>revogar</b> a chave pública antiga. Planejar a recuperação faz parte do projeto, não é detalhe.</Callout>
      </Section>
      <Section id="session" title={"E depois do login: a sessão"}>
        <p>Assinar um desafio a cada clique seria inviável (e irritante: uma biometria por requisição). Por isso a prova por chave serve para <b>abrir uma sessão</b>, e a sessão vale por um tempo.</p>
        <Diagram minWidth={560} caption={"A prova por chave abre a sessão; as requisições seguintes mostram apenas o cookie (ou token). Quem roubar o cookie age como você até a sessão cair."}>
          <svg viewBox="0 0 700 410" role="img" aria-label="Como a sessão funciona depois do login por chave">
            <rect x="50" y="8" width="120" height="34" rx="4" className="ln" />
            <text x="110.0" y="29.5" textAnchor="middle">App / navegador</text>
            <rect x="500" y="8" width="120" height="34" rx="4" className="ln" />
            <text x="560.0" y="29.5" textAnchor="middle">Servidor</text>
            <path d="M110 42L110 398" className="ln dash" />
            <path d="M560 42L560 398" className="ln dash" />
            <rect x="15" y="58" width="670" height="62" rx="4" className="brandfill" />
            <path d="M114 78L556 78" className="ln" />
            <path d="M548.0 81.6L556 78L548.0 74.4" className="ln" />
            <path d="M122.0 74.4L114 78L122.0 81.6" className="ln" />
            <text x="335" y="72" textAnchor="middle">① login por chave (desafio + assinatura): acontece UMA vez</text>
            <text x="335" y="106" className="mut" textAnchor="middle">a chave privada é usada só neste passo</text>
            <rect x="440" y="134" width="240" height="58" rx="4" className="ln fillsoft" />
            <text x="560.0" y="159.0" textAnchor="middle">② cria a sessão no servidor</text>
            <text x="560.0" y="176.0" className="mut mono" textAnchor="middle">sid=7f3a… → gustavo · 8h</text>
            <path d="M556 214L114 214" className="ln" />
            <path d="M122.0 210.4L114 214L122.0 217.6" className="ln" />
            <text x="335" y="206" className="mono" textAnchor="middle">③ Set-Cookie: sid=7f3a… (HttpOnly; Secure; SameSite)</text>
            <path d="M114 256L556 256" className="ln" />
            <path d="M548.0 259.6L556 256L548.0 252.4" className="ln" />
            <text x="335" y="248" className="mono" textAnchor="middle">④ GET /conta + Cookie: sid=7f3a…</text>
            <path d="M556 292L114 292" className="ln" />
            <path d="M122.0 288.4L114 292L122.0 295.6" className="ln" />
            <text x="335" y="284" className="mut" textAnchor="middle">200 OK: o servidor achou o sid e sabe que é o gustavo</text>
            <path d="M114 330L556 330" className="ln" />
            <path d="M548.0 333.6L556 330L548.0 326.4" className="ln" />
            <text x="335" y="322" textAnchor="middle">⑤ ação sensível → pode exigir nova assinatura (step-up)</text>
            <path d="M114 372L556 372" className="ln" />
            <path d="M548.0 375.6L556 372L548.0 368.4" className="ln" />
            <text x="335" y="364" textAnchor="middle">⑥ logout ou expiração: servidor apaga o sid; o cookie vira inútil</text>
          </svg>
        </Diagram>
        <Table
          head={["", "Sessão com ID opaco (cookie)", "Tokens (access + refresh, JWT)"]}
          rows={[
            [<><b>O que o cliente guarda</b></>, "Um ID aleatório sem significado.", "Um token assinado com claims dentro."],
            [<><b>Onde está o estado</b></>, "No servidor (memória, Redis, banco).", "No próprio token; o servidor só verifica a assinatura."],
            [<><b>Encerrar à força</b></>, "Fácil: apaga o ID no servidor.", "Mais difícil: o token vale até expirar; por isso o access token é curto e há refresh token."],
            [<><b>Cuidados</b></>, <><code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>; renovar o ID após o login.</>, <>Fixar o algoritmo, validar <code>iss</code>, <code>aud</code>, <code>exp</code>; guardar o refresh com mais cuidado.</>],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>A sessão é um “portador”: quem tiver o cookie ou o token age como você.</b> A chave no hardware protege o login, mas não impede que um token roubado seja usado até expirar. Por isso: prazos curtos, revogação, reautenticação em ações sensíveis (<i>step-up</i>) e, em cenários avançados, tokens amarrados a uma chave do cliente (<i>DPoP</i>, RFC 9449).</Callout>
        <p>Como as sessões, o OAuth e o OIDC se encaixam nisso está em <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>, e os detalhes de cookies e JWT do lado de quem constrói o app estão em <a href="/notas/web-app-security/">Apps web seguros</a>.</p>
      </Section>
      <Section id="ssh" title={"Como o SSH funciona"}>
        <p><b>SSH</b> (Secure Shell) abre um canal cifrado até outra máquina para shell remoto, execução de comandos, transferência de arquivos (<code>scp</code>, <code>sftp</code>) e túneis. É a seção anterior aplicada: acordo de chave efêmera, assinaturas, chaves públicas e privadas, e um túnel simétrico.</p>
        <h3>As três camadas</h3>
        <Diagram minWidth={560} caption={"O SSH constrói primeiro um túnel seguro que prova quem é o servidor; só depois, dentro dele, prova quem é você."}>
          <svg viewBox="0 0 700 258" role="img" aria-label="As três camadas do protocolo SSH">
            <rect x="30" y="14" width="520" height="50" rx="4" className="ln" />
            <text x="290" y="35" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de conexão</text>
            <text x="290" y="53" className="mut" textAnchor="middle">canais: shell, comando, sftp, túneis de porta</text>
            <text x="610" y="43" className="mut mono" textAnchor="middle">RFC 4254</text>
            <rect x="30" y="74" width="520" height="50" rx="4" className="brandfill" />
            <text x="290" y="95" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de autenticação do usuário</text>
            <text x="290" y="113" className="mut" textAnchor="middle">senha, chave pública, etc.</text>
            <text x="610" y="103" className="mut mono" textAnchor="middle">RFC 4252</text>
            <rect x="30" y="134" width="520" height="50" rx="4" className="brandfill" />
            <text x="290" y="155" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de transporte</text>
            <text x="290" y="173" className="mut" textAnchor="middle">troca de chaves · cifra · integridade · autentica o SERVIDOR</text>
            <text x="610" y="163" className="mut mono" textAnchor="middle">RFC 4253</text>
            <rect x="30" y="194" width="520" height="50" rx="4" className="ln fillsoft" />
            <text x="290" y="215" textAnchor="middle" style={{ fontWeight: "600" }}>TCP, porta 22</text>
            <text x="290" y="233" className="mut" textAnchor="middle">o transporte de rede comum</text>
          </svg>
        </Diagram>
        <h3>Quem confia em quem: os arquivos</h3>
        <p>O SSH tem <b>duas</b> verificações, uma em cada sentido, e cada uma usa um arquivo diferente. Confundi-las é a origem da maioria dos erros.</p>
        <Diagram minWidth={560} caption={"Dois sentidos de confiança: known_hosts (você confere o servidor) e authorized_keys (o servidor confere você). Cada lado guarda a PÚBLICA do outro."}>
          <svg viewBox="0 0 700 348" role="img" aria-label="Quais arquivos existem no cliente e no servidor SSH">
            <rect x="15" y="15" width="295" height="262" rx="4" className="ln" />
            <text x="162" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>Seu computador (cliente)</text>
            <rect x="390" y="15" width="295" height="262" rx="4" className="ln" />
            <text x="537" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>Servidor</text>
            <circle cx="37" cy="78" r="8" className="fill" />
            <circle cx="37" cy="78" r="3" className="inv" />
            <path d="M45 78L67 78M61 78L61 84M67 78L67 84" className="ln" />
            <text x="80" y="76" className="mono" textAnchor="start">~/.ssh/id_ed25519</text>
            <text x="80" y="94" className="mut" textAnchor="start">privada · chmod 600 · nunca sai</text>
            <circle cx="37" cy="134" r="8" className="brandfill" />
            <circle cx="37" cy="134" r="3" className="inv" />
            <path d="M45 134L67 134M61 134L61 140M67 134L67 140" className="ln" />
            <text x="80" y="132" className="mono" textAnchor="start">~/.ssh/id_ed25519.pub</text>
            <text x="80" y="150" className="mut" textAnchor="start">pública · pode ser copiada</text>
            <rect x="30" y="180" width="265" height="80" rx="4" className="ln fillsoft" />
            <text x="42" y="202" className="mono" textAnchor="start">~/.ssh/known_hosts</text>
            <text x="42" y="222" className="mut" textAnchor="start">impressões dos servidores em que</text>
            <text x="42" y="240" className="mut" textAnchor="start">você confia: você verifica o SERVIDOR</text>
            <circle cx="412" cy="78" r="8" className="fill" />
            <circle cx="412" cy="78" r="3" className="inv" />
            <path d="M420 78L442 78M436 78L436 84M442 78L442 84" className="ln" />
            <text x="455" y="76" className="mono" textAnchor="start">ssh_host_ed25519_key</text>
            <text x="455" y="94" className="mut" textAnchor="start">privada do servidor (host key)</text>
            <circle cx="412" cy="124" r="8" className="brandfill" />
            <circle cx="412" cy="124" r="3" className="inv" />
            <path d="M420 124L442 124M436 124L436 130M442 124L442 130" className="ln" />
            <text x="455" y="122" className="mono" textAnchor="start">ssh_host_ed25519_key.pub</text>
            <text x="455" y="140" className="mut" textAnchor="start">pública do servidor</text>
            <rect x="405" y="170" width="265" height="90" rx="4" className="ln fillsoft" />
            <text x="417" y="192" className="mono" textAnchor="start">~/.ssh/authorized_keys</text>
            <text x="417" y="212" className="mut" textAnchor="start">chaves públicas de quem pode</text>
            <text x="417" y="230" className="mut" textAnchor="start">entrar como este usuário:</text>
            <text x="417" y="248" className="mut" textAnchor="start">o servidor verifica VOCÊ</text>
            <path d="M298 140L405 205" className="ln dash" />
            <path d="M396.3 203.9L405 205L400.0 197.8" className="ln" />
            <path d="M405 150L298 200" className="ln dash" />
            <path d="M303.7 193.4L298 200L306.8 199.9" className="ln" />
            <circle cx="326" cy="156" r="9" className="ln fillsoft" />
            <text x="326" y="160" className="mono" textAnchor="middle">1</text>
            <circle cx="374" cy="160" r="9" className="ln fillsoft" />
            <text x="374" y="164" className="mono" textAnchor="middle">2</text>
            <circle cx="30" cy="304" r="9" className="ln fillsoft" />
            <text x="30" y="308" className="mono" textAnchor="middle">1</text>
            <text x="46" y="308" textAnchor="start">você copia a pública para o servidor (ssh-copy-id)</text>
            <circle cx="30" cy="330" r="9" className="ln fillsoft" />
            <text x="30" y="334" className="mono" textAnchor="middle">2</text>
            <text x="46" y="334" textAnchor="start">na 1ª conexão você aceita a impressão do servidor</text>
          </svg>
        </Diagram>
        <Table
          head={["Pergunta", "Quem verifica", "Arquivo", "Se falhar"]}
          rows={[
            ["“Este servidor é mesmo o servidor?”", "Você (cliente)", <><code>~/.ssh/known_hosts</code></>, "Aviso “REMOTE HOST IDENTIFICATION HAS CHANGED”"],
            ["“Esta pessoa pode entrar?”", "Servidor", <><code>~/.ssh/authorized_keys</code></>, <><code>Permission denied (publickey)</code></>],
          ]}
        />
        <h3>O handshake, passo a passo</h3>
        <Diagram minWidth={560} caption={"Primeiro o cliente confere o servidor (passos 3 e 4, com known_hosts); depois, já dentro do túnel cifrado, o servidor confere o cliente (passos 5 a 8)."}>
          <svg viewBox="0 0 700 516" role="img" aria-label="Handshake SSH passo a passo">
            <rect x="55" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="110.0" y="28.5" textAnchor="middle">Cliente</text>
            <rect x="535" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="590.0" y="28.5" textAnchor="middle">Servidor</text>
            <path d="M110 40L110 506" className="ln dash" />
            <path d="M590 40L590 506" className="ln dash" />
            <rect x="12" y="50" width="676" height="96" rx="4" className="ln fillsoft" />
            <text x="22" y="66" className="mut" textAnchor="start">em claro</text>
            <rect x="12" y="152" width="676" height="110" rx="4" className="brandfill" />
            <text x="22" y="168" className="mut" textAnchor="start">troca de chaves (autentica o servidor)</text>
            <rect x="12" y="268" width="676" height="230" rx="4" className="ln" />
            <text x="22" y="284" className="mut" textAnchor="start">TUDO daqui para baixo vai cifrado</text>
            <path d="M114 88L586 88" className="ln" />
            <path d="M578.0 91.6L586 88L578.0 84.4" className="ln" />
            <path d="M122.0 84.4L114 88L122.0 91.6" className="ln" />
            <text x="350" y="82" textAnchor="middle">① conecta na porta 22 · versões</text>
            <text x="350" y="102" className="mut" textAnchor="middle">SSH-2.0-OpenSSH_…</text>
            <path d="M114 130L586 130" className="ln" />
            <path d="M578.0 133.6L586 130L578.0 126.4" className="ln" />
            <path d="M122.0 126.4L114 130L122.0 133.6" className="ln" />
            <text x="350" y="124" textAnchor="middle">② lista de algoritmos aceitos (KEXINIT)</text>
            <path d="M114 196L586 196" className="ln" />
            <path d="M578.0 199.6L586 196L578.0 192.4" className="ln" />
            <text x="350" y="190" textAnchor="middle">③ metade pública efêmera do cliente</text>
            <path d="M586 238L114 238" className="ln" />
            <path d="M122.0 234.4L114 238L122.0 241.6" className="ln" />
            <text x="350" y="232" textAnchor="middle">④ metade do servidor + chave pública do host + assinatura</text>
            <path d="M114 318L586 318" className="ln" />
            <path d="M578.0 321.6L586 318L578.0 314.4" className="ln" />
            <text x="350" y="312" textAnchor="middle">⑤ usuário "ana" + chave pública id_ed25519.pub</text>
            <path d="M586 356L114 356" className="ln" />
            <path d="M122.0 352.4L114 356L122.0 359.6" className="ln" />
            <text x="350" y="350" textAnchor="middle">⑥ essa chave está em authorized_keys? sim</text>
            <path d="M114 394L586 394" className="ln" />
            <path d="M578.0 397.6L586 394L578.0 390.4" className="ln" />
            <text x="350" y="388" textAnchor="middle">⑦ assinatura (com a privada) sobre o ID da sessão</text>
            <path d="M586 432L114 432" className="ln" />
            <path d="M122.0 428.4L114 432L122.0 435.6" className="ln" />
            <text x="350" y="426" textAnchor="middle">⑧ servidor verifica com a pública → autenticado</text>
            <path d="M114 478L586 478" className="ln" />
            <path d="M578.0 481.6L586 478L578.0 474.4" className="ln" />
            <path d="M122.0 474.4L114 478L122.0 481.6" className="ln" />
            <text x="350" y="472" textAnchor="middle">⑨ abre canal: shell, comando, sftp, túnel</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><b>A primeira conexão é um ato de fé (TOFU, “trust on first use”).</b> Na primeira vez o SSH mostra a impressão da chave do servidor e pergunta se você confia. Se você aceitar sem conferir, um intermediário na primeira conexão passa despercebido. Em servidores importantes, confira a impressão por outro canal (console do provedor, quem administra).</Callout>
        <h3>Mão na massa</h3>
        <CodeBlock>
          <span className="tok-c"># 1. generate the pair: id_ed25519 (private) and id_ed25519.pub (public)</span>{"\n"}
          {"ssh-keygen -t ed25519 -C \"gustavo@laptop\"\n"}
          {"\n"}
          <span className="tok-c"># 2. show the fingerprint of the public key</span>{"\n"}
          {"ssh-keygen -lf ~/.ssh/id_ed25519.pub\n"}
          {"\n"}
          <span className="tok-c"># 3. install the public key on the server (it goes into ~/.ssh/authorized_keys)</span>{"\n"}
          {"ssh-copy-id -i ~/.ssh/id_ed25519.pub ana@server.example.com\n"}
          {"\n"}
          <span className="tok-c"># 4. sign in: the private key signs the challenge, it is never sent</span>{"\n"}
          {"ssh ana@server.example.com\n"}
          {"\n"}
          <span className="tok-c"># 5. debug: -v shows every key offered and every step</span>{"\n"}
          {"ssh -v ana@server.example.com"}
        </CodeBlock>
        <ul className="ds-list">
          <li><b>Defina uma passphrase</b> ao gerar a chave: ela cifra o arquivo da privada no disco. Sem ela, quem copiar o arquivo ganha o acesso.</li>
          <li><b>Permissões importam</b>: <code>chmod 700 ~/.ssh</code> e <code>chmod 600</code> na privada e no <code>authorized_keys</code>. O SSH recusa chaves legíveis por outros.</li>
          <li><b>Uma chave por aparelho</b>: assim, perdeu o notebook, remova só a pública dele dos servidores.</li>
        </ul>
        <h3>Endurecendo o servidor</h3>
        <CodeBlock>
          <span className="tok-c"># /etc/ssh/sshd_config (check the manual for your distribution)</span>{"\n"}
          {"PubkeyAuthentication yes\n"}
          {"PasswordAuthentication no"}<span className="tok-c"> # keys only: removes password guessing</span>{"\n"}
          {"PermitRootLogin no"}<span className="tok-c"> # sign in as a normal user, then use sudo</span>
        </CodeBlock>
        <p>Depois de alterar, recarregue o serviço (<code>sshd</code> ou <code>ssh</code>, conforme a distribuição) e <b>teste numa segunda sessão antes de fechar a primeira</b>: um erro aqui pode trancar você fora.</p>
        <h3>ssh-agent, bastion e ProxyJump</h3>
        <Diagram minWidth={560} caption={"O agent digita a passphrase uma única vez e assina por você. Com ProxyJump você chega a servidores internos sem expor a chave privada."}>
          <svg viewBox="0 0 700 334" role="img" aria-label="ssh-agent e ProxyJump">
            <rect x="15" y="15" width="250" height="175" rx="4" className="ln" />
            <text x="140" y="36" textAnchor="middle" style={{ fontWeight: "600" }}>Seu computador</text>
            <rect x="35" y="52" width="210" height="52" rx="4" className="brandfill" />
            <text x="140.0" y="74.0" textAnchor="middle">ssh-agent</text>
            <text x="140.0" y="91.0" className="mut" textAnchor="middle">guarda a chave já destravada</text>
            <rect x="35" y="126" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="140.0" y="147.0" textAnchor="middle">cliente ssh</text>
            <text x="140.0" y="164.0" className="mut" textAnchor="middle">pede: "assine isto"</text>
            <path d="M140 126L140 106" className="ln" />
            <path d="M143.6 114.0L140 106L136.4 114.0" className="ln" />
            <path d="M136.4 118.0L140 126L143.6 118.0" className="ln" />
            <rect x="320" y="60" width="150" height="80" rx="4" className="ln fillsoft" />
            <text x="395.0" y="96.0" textAnchor="middle">Bastion</text>
            <text x="395.0" y="113.0" className="mut" textAnchor="middle">(jump host)</text>
            <rect x="530" y="60" width="155" height="80" rx="4" className="ln fillsoft" />
            <text x="607.5" y="96.0" textAnchor="middle">Servidor interno</text>
            <text x="607.5" y="113.0" className="mut" textAnchor="middle">sem IP público</text>
            <path d="M265 100L320 100" className="ln" />
            <path d="M312.0 103.6L320 100L312.0 96.4" className="ln" />
            <text x="292" y="90" className="mut mono" textAnchor="middle">1</text>
            <path d="M470 100L530 100" className="ln" />
            <path d="M522.0 103.6L530 100L522.0 96.4" className="ln" />
            <text x="500" y="90" className="mut mono" textAnchor="middle">2</text>
            <text x="477" y="40" className="mono" textAnchor="middle">ssh -J bastion internal</text>
            <text x="350" y="220" textAnchor="middle">A assinatura acontece no seu computador; a chave não vai para o bastion.</text>
            <text x="350" y="242" className="mut" textAnchor="middle">O túnel 2 passa DENTRO da conexão 1, cifrado de ponta a ponta até o servidor interno.</text>
            <rect x="60" y="262" width="580" height="56" rx="4" className="ln dash" />
            <text x="350.0" y="286.0" textAnchor="middle">Prefira -J (ProxyJump). Evite o agent forwarding (-A) em hosts que você não controla:</text>
            <text x="350.0" y="303.0" className="mut" textAnchor="middle">quem é root lá pode usar seu agent enquanto você estiver conectado.</text>
          </svg>
        </Diagram>
        <CodeBlock>
          <span className="tok-c"># start an agent and load the key (the passphrase is asked once)</span>{"\n"}
          {"eval \"$(ssh-agent -s)\"\n"}
          {"ssh-add ~/.ssh/id_ed25519\n"}
          {"ssh-add -l"}<span className="tok-c"> # lists the keys the agent holds</span>{"\n"}
          {"\n"}
          <span className="tok-c"># reach an internal server through a bastion, without forwarding the agent</span>{"\n"}
          {"ssh -J ana@bastion.example.com ana@10.0.1.20"}
        </CodeBlock>
        <h3>SSH com o GitHub</h3>
        <p>Cadastre a <b>pública</b> em <i>Settings → SSH and GPG keys</i> e teste com <code>ssh -T git@github.com</code>. O mesmo par pode também <b>assinar commits</b> (Git 2.34 ou mais novo).</p>
        <CodeBlock code={`git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true`} />
      </Section>
      <Section id="errors" title={"Erros comuns e como resolver"}>
        <Table
          head={["Sintoma", "Causa provável", "O que fazer"]}
          rows={[
            [<code>Permission denied (publickey)</code>, "A pública não está no servidor, o usuário está errado ou o SSH ofereceu outra chave.", <>Rode <code>ssh -v</code> e veja as chaves oferecidas; confira <code>authorized_keys</code>, o nome do usuário e use <code>-i</code> ou <code>IdentityFile</code>.</>],
            [<code>UNPROTECTED PRIVATE KEY FILE!</code>, "A privada está legível por outros usuários.", <><code>chmod 600 ~/.ssh/id_ed25519</code> e <code>chmod 700 ~/.ssh</code>.</>],
            [<code>REMOTE HOST IDENTIFICATION HAS CHANGED!</code>, "A chave do servidor mudou: reinstalação, IP reaproveitado... ou um intermediário.", <>Não ignore. Confirme com quem administra o servidor; só então <code>ssh-keygen -R host</code> e reconecte.</>],
            [<code>Too many authentication failures</code>, "O agent oferece chaves demais antes da certa.", <>Use <code>IdentitiesOnly yes</code> e <code>IdentityFile</code> no <code>~/.ssh/config</code>.</>],
            [<>Colei a <b>pública</b> no lugar da privada (ou o contrário)</>, <>Confusão entre <code>id_ed25519</code> e <code>.pub</code>.</>, <>A <code>.pub</code> é a que se compartilha. Para conferir se um par combina: <code>ssh-keygen -y -f id_ed25519</code> imprime a pública correspondente.</>],
            [<code>Load key … invalid format</code>, "Arquivo da privada corrompido: quebra de linha trocada, cabeçalho cortado, falta a linha final.", "Recopie o arquivo inteiro, sem editar, ou gere um novo par."],
            [<>A <b>privada foi parar no repositório</b>, num chat ou num log</>, "Vazamento: considere-a comprometida.", "Remova a pública dos servidores e da conta do GitHub, gere um par novo. Apagar o commit não basta: o histórico e os clones guardam a cópia."],
            [<>Navegador: <code>NET::ERR_CERT_COMMON_NAME_INVALID</code> ou certificado expirado</>, "O nome no certificado não cobre o domínio acessado, ou a validade acabou.", "Confira os nomes (SAN) e a data; renove; instale também o certificado intermediário."],
            ["Tentei “cifrar com a privada” para proteger dados", "Confundir assinatura com cifragem.", "Para sigilo, cifre com a pública do destinatário (ou use uma chave simétrica). Para provar autoria, assine."],
            ["JWT aceito mesmo com a assinatura alterada", <>O verificador aceita <code>alg: none</code> ou troca <code>RS256</code> por <code>HS256</code> usando a pública como segredo.</>, "Fixe o algoritmo esperado na verificação e use bibliotecas mantidas (RFC 8725)."],
            ["Perdi o celular com a passkey", "A privada ficou no aparelho.", "Use outra passkey ou os códigos de backup, e revogue a credencial antiga no servidor."],
          ]}
        />
      </Section>
      <Section id="cheat-cry" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Faça"]}
          rows={[
            ["que ninguém leia os dados no caminho", "Cifre: TLS no tráfego, AES-GCM em dados em repouso."],
            ["provar que um arquivo ou token veio de mim", "Assine com a privada; quem recebe verifica com a pública."],
            ["detectar se algo foi alterado", "Compare hashes (ou use assinatura/MAC se houver adversário)."],
            ["entrar num servidor por SSH", <><code>ssh-keygen -t ed25519</code>, <code>ssh-copy-id</code>, desligar senha no servidor.</>],
            ["login sem senha em um app", "Passkey/WebAuthn: o aparelho assina um desafio; guarde só a pública."],
            ["manter o usuário logado sem pedir assinatura sempre", "Sessão com cookie seguro ou token curto + refresh; reautentique em ações sensíveis."],
            ["conferir um servidor SSH novo", "Compare a impressão (fingerprint) por outro canal antes de aceitar."],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <QA items={[
            ["Por que o TLS e o SSH combinam criptografia assimétrica e simétrica?", "A assimétrica resolve combinar uma chave em público (e prova identidade), mas é lenta; a simétrica é rápida para o volume de dados. Usa-se a primeira para acordar a chave e a segunda para os dados."],
            ["Num login por chave no aparelho, o que trafega e o que nunca sai do aparelho?", "Trafegam o desafio e a assinatura (e, no cadastro, a chave pública). A chave privada e a biometria nunca saem do aparelho; o servidor só verifica com a pública."],
            ["Por que existe a sessão depois da assinatura, e qual o risco dela?", "Para não assinar a cada requisição. O risco: é um portador, e um cookie ou token roubado vale até expirar; por isso prazos curtos, revogação e step-up."],
            [<>O que <code>known_hosts</code> e <code>authorized_keys</code> provam, cada um?</>, <><code>known_hosts</code>: você confere que o servidor é o mesmo de antes. <code>authorized_keys</code>: o servidor confere que a sua chave está autorizada a entrar.</>],
          ]} />
      </Section>
      <Sources
        links={[
          { label: "RFC 8446 · TLS 1.3", href: "https://datatracker.ietf.org/doc/html/rfc8446" },
          { label: "RFC 5280 · Internet X.509 PKI Certificate and CRL Profile", href: "https://datatracker.ietf.org/doc/html/rfc5280" },
          { label: "RFC 7748 · Elliptic Curves for Security (X25519)", href: "https://datatracker.ietf.org/doc/html/rfc7748" },
          { label: "RFC 8032 · Edwards-Curve Digital Signature Algorithm (Ed25519)", href: "https://datatracker.ietf.org/doc/html/rfc8032" },
          { label: "RFC 8017 · PKCS #1: RSA Cryptography Specifications", href: "https://datatracker.ietf.org/doc/html/rfc8017" },
          { label: "RFC 4251 · The Secure Shell (SSH) Protocol Architecture", href: "https://datatracker.ietf.org/doc/html/rfc4251" },
          { label: "RFC 4252 · The SSH Authentication Protocol", href: "https://datatracker.ietf.org/doc/html/rfc4252" },
          { label: "RFC 4253 · The SSH Transport Layer Protocol", href: "https://datatracker.ietf.org/doc/html/rfc4253" },
          { label: "RFC 4254 · The SSH Connection Protocol", href: "https://datatracker.ietf.org/doc/html/rfc4254" },
          { label: "RFC 8725 · JSON Web Token Best Current Practices", href: "https://datatracker.ietf.org/doc/html/rfc8725" },
          { label: "RFC 9449 · OAuth 2.0 Demonstrating Proof of Possession (DPoP)", href: "https://datatracker.ietf.org/doc/html/rfc9449" },
          { label: "W3C · Web Authentication (WebAuthn)", href: "https://www.w3.org/TR/webauthn-2/" },
          { label: "OpenSSH · Manual pages", href: "https://www.openssh.com/manual.html" },
          { label: "GitHub Docs · Connecting to GitHub with SSH", href: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh" },
          { label: "Apple · Protecting keys with the Secure Enclave", href: "https://developer.apple.com/documentation/security/protecting-keys-with-the-secure-enclave" },
          { label: "Android · Keystore system", href: "https://developer.android.com/privacy-and-security/keystore" },
          { label: "Let’s Encrypt · How it works", href: "https://letsencrypt.org/how-it-works/" },
          { label: "OWASP · Session Management Cheat Sheet", href: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
        ]}
      />
    </>
  );
}
