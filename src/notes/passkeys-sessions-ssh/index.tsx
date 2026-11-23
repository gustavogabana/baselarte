import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "passkeys-sessions-ssh",
  title: { en: "Passkeys, sessions and SSH", pt: "Passkeys, sessões e SSH" },
  seo: {
    title: { en: "Passkeys, sessions and SSH: keys on the device, step by step", pt: "Passkeys, sessões e SSH: chaves no aparelho, passo a passo" },
    description: { en: "How apps keep a private key on the device (passkeys), how the session follows sign-in, and SSH step by step, with common errors and a cheat sheet.", pt: "Como os apps guardam a chave privada no aparelho (passkeys), como a sessão segue o login e o SSH passo a passo, com erros comuns e uma cola." },
  },
  summary: "private keys kept on the device (passkeys, WebAuthn), challenge-and-signature sign-in, sessions after sign-in (cookies, tokens, risks), SSH step by step (host keys, known_hosts, authorized_keys, agent), common errors and a cheat sheet.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Passkeys, sessions and SSH: <em>the key never leaves.</em></>, pt: <>Passkeys, sessões e SSH: <em>a chave não sai do lugar.</em></> },
  heroLede: { en: "How apps prove who you are by signing a challenge, how the session carries on from there, and what SSH does step by step.", pt: "Como os apps provam quem você é assinando um desafio, como a sessão continua depois disso e o que o SSH faz passo a passo." },
  published: "2026-11-23",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "intro", title: <T pt="Antes de ler" en="Before you read" /> },
        { id: "device", title: <T pt="Apps com a chave privada no aparelho" en="Apps with the private key on the device" /> },
        { id: "session", title: <T pt="E depois do login: a sessão" en="After sign-in: the session" /> },
        { id: "ssh", title: <T pt="Como o SSH funciona" en="How SSH works" /> },
        { id: "errors", title: <T pt="Erros comuns e como resolver" en="Common errors and how to fix them" /> },
        { id: "cheat-cry", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="intro" title={<T pt="Antes de ler" en="Before you read" />}>
        <Callout icon="check"><T pt={<>Esta nota aplica o que está em <a href="/notas/crypto-keys-ssh/">Criptografia: chaves, assinaturas e TLS</a>: par de chaves, assinatura e desafio. Aqui elas viram login sem senha (passkeys), sessão depois do login e SSH.</>} en={<>This note applies what is in <a href="/notas/crypto-keys-ssh/">Cryptography: keys, signatures and TLS</a>: key pairs, signatures and challenges. Here they become password-free sign-in (passkeys), the session after sign-in, and SSH.</>} /></Callout>
      </Section>
      <Section id="device" title={<T pt="Apps com a chave privada no aparelho" en="Apps with the private key on the device" />}>
        <p><T pt={<>Passkeys, apps de banco, autenticadores e chaves de segurança seguem o mesmo desenho: o <b>aparelho</b> gera o par, guarda a privada e entrega ao servidor só a pública. Daí em diante, entrar é <b>assinar um desafio</b>, não digitar um segredo que o servidor também conhece.</>} en={<>Passkeys, banking apps, authenticators and security keys follow the same design: the <b>device</b> generates the pair, keeps the private key and gives the server only the public key. From then on, signing in is <b>signing a challenge</b>, not typing a secret the server also knows.</>} /></p>
        <h3><T pt="1. Cadastro: o par nasce no aparelho" en="1. Enrollment: the pair is born on the device" /></h3>
        <Diagram minWidth={560} caption={<T pt="No cadastro (registro de passkey, ativação de biometria num app), o aparelho gera o par; a privada fica no chip, a pública vai para o servidor." en="At enrollment (registering a passkey, enabling biometrics in an app), the device generates the pair; the private key stays in the chip, the public key goes to the server." />}>
          <svg viewBox="0 0 700 262" role="img" aria-label="Cadastro de um login por chave no aparelho / Enrolling a device-bound key login">
            <rect x="15" y="15" width="300" height="235" rx="4" className="ln" />
            <text x="165" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Seu aparelho</text>
            <text x="165" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Your device</text>
            <rect x="35" y="55" width="54" height="96" rx="8" className="ln fillsoft" />
            <path d="M56.0 61L68.0 61" className="ln" />
            <text x="62" y="168" className="pt mut" textAnchor="middle">app</text>
            <text x="62" y="168" className="en mut" textAnchor="middle">app</text>
            <rect x="120" y="70" width="170" height="56" rx="3" className="brandfill" />
            <path d="M132.0 65L132.0 70M132.0 126L132.0 131" className="ln" />
            <path d="M180.7 65L180.7 70M180.7 126L180.7 131" className="ln" />
            <path d="M229.3 65L229.3 70M229.3 126L229.3 131" className="ln" />
            <path d="M278.0 65L278.0 70M278.0 126L278.0 131" className="ln" />
            <text x="205" y="94" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>chip seguro</text>
            <text x="205" y="94" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>secure chip</text>
            <text x="205" y="112" className="pt mut" textAnchor="middle">Enclave · TPM · StrongBox</text>
            <text x="205" y="112" className="en mut" textAnchor="middle">Enclave · TPM · StrongBox</text>
            <circle cx="147" cy="150" r="8" className="fill" />
            <circle cx="147" cy="150" r="3" className="inv" />
            <path d="M155 150L177 150M171 150L171 156M177 150L177 156" className="ln" />
            <text x="185" y="154" className="pt" textAnchor="start">privada: fica aqui</text>
            <text x="185" y="154" className="en" textAnchor="start">private: stays here</text>
            <circle cx="147" cy="190" r="8" className="brandfill" />
            <circle cx="147" cy="190" r="3" className="inv" />
            <path d="M155 190L177 190M171 190L171 196M177 190L177 196" className="ln" />
            <text x="190" y="194" className="pt" textAnchor="start">pública: pode sair</text>
            <text x="190" y="194" className="en" textAnchor="start">public: may leave</text>
            <text x="165" y="236" className="pt mut" textAnchor="middle">a privada é marcada como "não exportável"</text>
            <text x="165" y="236" className="en mut" textAnchor="middle">the private key is marked "non-exportable"</text>
            <rect x="430" y="15" width="255" height="235" rx="4" className="ln" />
            <text x="557" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Servidor</text>
            <text x="557" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Server</text>
            <rect x="455" y="55" width="54" height="66" rx="4" className="ln fillsoft" />
            <path d="M463 65L501 65" className="ln" />
            <circle cx="495" cy="73" r="2" className="fill" />
            <path d="M463 85L501 85" className="ln" />
            <circle cx="495" cy="93" r="2" className="fill" />
            <path d="M463 105L501 105" className="ln" />
            <circle cx="495" cy="113" r="2" className="fill" />
            <text x="550" y="80" className="pt mut" textAnchor="start">tabela de contas</text>
            <text x="550" y="80" className="en mut" textAnchor="start">accounts table</text>
            <rect x="520" y="92" width="150" height="70" rx="4" className="ln fillsoft" />
            <text x="595.0" y="114.5" className="pt" textAnchor="middle">gustavo</text>
            <text x="595.0" y="114.5" className="en" textAnchor="middle">gustavo</text>
            <text x="595.0" y="131.5" className="pt" textAnchor="middle">credencial: id</text>
            <text x="595.0" y="131.5" className="en" textAnchor="middle">credential: id</text>
            <text x="595.0" y="148.5" className="pt" textAnchor="middle">chave pública: …</text>
            <text x="595.0" y="148.5" className="en" textAnchor="middle">public key: …</text>
            <text x="557" y="190" className="pt" textAnchor="middle">guarda só a pública</text>
            <text x="557" y="190" className="en" textAnchor="middle">stores only the public key</text>
            <text x="557" y="210" className="pt mut" textAnchor="middle">vazar o banco não permite</text>
            <text x="557" y="210" className="en mut" textAnchor="middle">leaking the database does not let</text>
            <text x="557" y="228" className="pt mut" textAnchor="middle">entrar como você</text>
            <text x="557" y="228" className="en mut" textAnchor="middle">anyone sign in as you</text>
            <path d="M315 214L430 214" className="ln" />
            <path d="M422.0 217.6L430 214L422.0 210.4" className="ln" />
            <text x="372" y="206" className="pt" textAnchor="middle">só a pública viaja</text>
            <text x="372" y="206" className="en" textAnchor="middle">public key only</text>
          </svg>
        </Diagram>
        <h3><T pt="2. Login: o servidor desafia, o aparelho assina" en="2. Sign-in: the server challenges, the device signs" /></h3>
        <Diagram minWidth={560} caption={<T pt="O servidor nunca recebe senha nem a chave privada: recebe a prova de que o aparelho a possui. Como o desafio é novo a cada vez, copiar a resposta não adianta." en="The server never receives a password or the private key: it receives proof the device holds it. Since the challenge is new each time, copying the answer is useless." />}>
          <svg viewBox="0 0 700 396" role="img" aria-label="Login por desafio e assinatura com a chave do aparelho / Challenge-and-signature login with the device key">
            <rect x="45" y="8" width="150" height="34" rx="4" className="ln" />
            <text x="120.0" y="29.5" className="pt" textAnchor="middle">Aparelho + app</text>
            <text x="120.0" y="29.5" className="en" textAnchor="middle">Device + app</text>
            <rect x="505" y="8" width="150" height="34" rx="4" className="ln" />
            <text x="580.0" y="29.5" className="pt" textAnchor="middle">Servidor</text>
            <text x="580.0" y="29.5" className="en" textAnchor="middle">Server</text>
            <path d="M120 42L120 388" className="ln dash" />
            <path d="M580 42L580 388" className="ln dash" />
            <path d="M124 75L576 75" className="ln" />
            <path d="M568.0 78.6L576 75L568.0 71.4" className="ln" />
            <text x="350" y="67" className="pt" textAnchor="middle">① quero entrar como "gustavo"</text>
            <text x="350" y="67" className="en" textAnchor="middle">① I want to sign in as "gustavo"</text>
            <path d="M576 115L124 115" className="ln" />
            <path d="M132.0 111.4L124 115L132.0 118.6" className="ln" />
            <text x="350" y="107" className="pt" textAnchor="middle">② desafio: número aleatório novo (nonce)</text>
            <text x="350" y="107" className="en" textAnchor="middle">② challenge: a fresh random number (nonce)</text>
            <rect x="30" y="140" width="200" height="56" rx="4" className="brandfill" />
            <text x="130.0" y="164.0" className="pt" textAnchor="middle">③ biometria ou PIN</text>
            <text x="130.0" y="164.0" className="en" textAnchor="middle">③ biometrics or PIN</text>
            <text x="130.0" y="181.0" className="pt mut" textAnchor="middle">libera o uso da chave (local)</text>
            <text x="130.0" y="181.0" className="en mut" textAnchor="middle">unlocks the key (local only)</text>
            <rect x="30" y="212" width="200" height="56" rx="4" className="brandfill" />
            <text x="130.0" y="236.0" className="pt" textAnchor="middle">④ o chip assina o desafio</text>
            <text x="130.0" y="236.0" className="en" textAnchor="middle">④ the chip signs the challenge</text>
            <text x="130.0" y="253.0" className="pt mut" textAnchor="middle">com a chave privada</text>
            <text x="130.0" y="253.0" className="en mut" textAnchor="middle">with the private key</text>
            <path d="M124 300L576 300" className="ln" />
            <path d="M568.0 303.6L576 300L568.0 296.4" className="ln" />
            <text x="350" y="292" className="pt" textAnchor="middle">⑤ assinatura do desafio (+ domínio/app)</text>
            <text x="350" y="292" className="en" textAnchor="middle">⑤ signature of the challenge (+ domain/app)</text>
            <rect x="400" y="322" width="270" height="58" rx="4" className="ln fillsoft" />
            <text x="535.0" y="347.0" className="pt" textAnchor="middle">⑥ verifica com a chave pública</text>
            <text x="535.0" y="347.0" className="en" textAnchor="middle">⑥ verifies with the public key</text>
            <text x="535.0" y="364.0" className="pt mut" textAnchor="middle">guardada no cadastro → ok</text>
            <text x="535.0" y="364.0" className="en mut" textAnchor="middle">stored at enrollment → ok</text>
            <text x="350" y="330" className="pt" textAnchor="middle"></text>
            <text x="350" y="330" className="en" textAnchor="middle"></text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><b>Por que um desafio novo a cada vez?</b> Se a assinatura fosse sempre a mesma, quem a interceptasse poderia reenviá-la (ataque de replay). Com um número aleatório inédito, cada resposta só vale uma vez.</>} en={<><b>Why a new challenge every time?</b> If the signature were always the same, whoever intercepted it could resend it (replay attack). With a never-seen random number, each answer is good only once.</>} /></li>
          <li><T pt={<><b>Por que a biometria não vai para o servidor?</b> Ela só autoriza o chip a usar a chave, localmente. O servidor recebe uma assinatura, nunca a digital nem o rosto.</>} en={<><b>Why does the biometric not go to the server?</b> It only authorizes the chip to use the key, locally. The server receives a signature, never the fingerprint or the face.</>} /></li>
          <li><T pt={<><b>Por que resiste a phishing?</b> No WebAuthn a assinatura cobre o domínio (origem) da página. Uma página falsa em outro domínio não consegue obter uma assinatura que valha para o site verdadeiro.</>} en={<><b>Why is it phishing-resistant?</b> In WebAuthn the signature covers the page’s domain (origin). A fake page on another domain cannot obtain a signature that is valid for the real site.</>} /></li>
          <li><T pt={<><b>E se vazar o banco de dados do servidor?</b> Lá só há chaves públicas, que não permitem assinar. Compare com senhas, em que o vazamento de hashes já ajuda quem ataca.</>} en={<><b>And if the server database leaks?</b> It only holds public keys, which cannot sign. Compare with passwords, where leaked hashes already help the attacker.</>} /></li>
        </ul>
        <h3><T pt="Onde fica a chave privada" en="Where the private key lives" /></h3>
        <Diagram minWidth={560} caption={<T pt="Em cada plataforma o nome muda, a ideia não: um cofre em hardware que assina por você e nunca entrega a chave." en="Names change per platform, the idea does not: a hardware vault that signs for you and never hands over the key." />}>
          <svg viewBox="0 0 700 226" role="img" aria-label="Onde fica a chave privada no aparelho / Where the private key lives on the device">
            <rect x="30" y="14" width="380" height="54" rx="4" className="ln" />
            <text x="220" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>App (código do aplicativo)</text>
            <text x="220" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>App (application code)</text>
            <text x="220" y="55" className="pt mut" textAnchor="middle">só pede: "assine isto"</text>
            <text x="220" y="55" className="en mut" textAnchor="middle">only asks: "sign this"</text>
            <rect x="30" y="84" width="380" height="54" rx="4" className="ln fillsoft" />
            <text x="220" y="106" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>API do sistema (Keychain, Keystore, CNG)</text>
            <text x="220" y="106" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>OS API (Keychain, Keystore, CNG)</text>
            <text x="220" y="125" className="pt mut" textAnchor="middle">controla quem pode usar a chave</text>
            <text x="220" y="125" className="en mut" textAnchor="middle">controls who may use the key</text>
            <rect x="30" y="154" width="380" height="54" rx="4" className="brandfill" />
            <text x="220" y="176" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Hardware seguro (Enclave, TEE/StrongBox, TPM)</text>
            <text x="220" y="176" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Secure hardware (Enclave, TEE/StrongBox, TPM)</text>
            <text x="220" y="195" className="pt mut" textAnchor="middle">a chave privada vive e assina aqui dentro</text>
            <text x="220" y="195" className="en mut" textAnchor="middle">the private key lives and signs in here</text>
            <path d="M120 68L120 84" className="ln" />
            <path d="M116.4 76.0L120 84L123.6 76.0" className="ln" />
            <path d="M120 138L120 154" className="ln" />
            <path d="M116.4 146.0L120 154L123.6 146.0" className="ln" />
            <path d="M320 154L320 138" className="ln" />
            <path d="M323.6 146.0L320 138L316.4 146.0" className="ln" />
            <path d="M320 84L320 68" className="ln" />
            <path d="M323.6 76.0L320 68L316.4 76.0" className="ln" />
            <text x="110" y="80" className="pt" textAnchor="middle"></text>
            <text x="110" y="80" className="en" textAnchor="middle"></text>
            <text x="445" y="50" className="pt" textAnchor="start">↓ pedido de assinatura</text>
            <text x="445" y="50" className="en" textAnchor="start">↓ signing request</text>
            <text x="445" y="70" className="pt" textAnchor="start">↑ só a assinatura volta</text>
            <text x="445" y="70" className="en" textAnchor="start">↑ only the signature comes back</text>
            <text x="445" y="110" className="pt" textAnchor="start" style={{ fontWeight: "600" }}>A chave privada nunca sobe</text>
            <text x="445" y="110" className="en" textAnchor="start" style={{ fontWeight: "600" }}>The private key never moves up</text>
            <text x="445" y="128" className="pt" textAnchor="start" style={{ fontWeight: "600" }}>ao app nem à memória comum</text>
            <text x="445" y="128" className="en" textAnchor="start" style={{ fontWeight: "600" }}>to the app or to ordinary memory</text>
            <text x="445" y="164" className="pt mut" textAnchor="start">Limite honesto: aparelho comprometido</text>
            <text x="445" y="164" className="en mut" textAnchor="start">Honest limit: a compromised device</text>
            <text x="445" y="182" className="pt mut" textAnchor="start">e desbloqueado ainda pode PEDIR</text>
            <text x="445" y="182" className="en mut" textAnchor="start">that is unlocked can still ASK for</text>
            <text x="445" y="200" className="pt mut" textAnchor="start">assinaturas, mas não COPIA a chave.</text>
            <text x="445" y="200" className="en mut" textAnchor="start">signatures, but cannot COPY the key.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Plataforma" en="Platform" />, <T pt="Cofre" en="Vault" />, <T pt="Comportamento" en="Behavior" />]}
          rows={[
            [<b>iPhone / Mac</b>, <T pt="Secure Enclave + Keychain" en="Secure Enclave + Keychain" />, <T pt="Chaves podem ser geradas dentro do Enclave e não saem dele; o app só pede a assinatura." en="Keys can be generated inside the Enclave and never leave it; the app only requests the signature." />],
            [<b>Android</b>, <T pt="Android Keystore (TEE ou StrongBox)" en="Android Keystore (TEE or StrongBox)" />, <T pt="Chaves protegidas por hardware, marcadas como não exportáveis; uso pode exigir biometria." en="Hardware-backed keys, marked non-exportable; use can require biometrics." />],
            [<b>Windows / Linux</b>, <T pt="TPM" en="TPM" />, <T pt="Chip na placa-mãe que guarda e usa chaves sem entregá-las." en="Chip on the motherboard that stores and uses keys without handing them out." />],
            [<b>Chave de segurança</b>, <T pt="YubiKey e similares (FIDO2)" en="YubiKey and similar (FIDO2)" />, <T pt="Hardware dedicado: a chave nunca está no seu computador e vale em vários aparelhos." en="Dedicated hardware: the key is never on your computer and works across devices." />],
            [<b>Gerenciador de senhas</b>, <T pt="Cofre sincronizado" en="Synced vault" />, <T pt="Passkeys sincronizadas entre aparelhos: mais conveniência, e a segurança passa a depender da conta do gerenciador." en="Passkeys synced across devices: more convenience, and security now depends on the manager’s account." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>Perdeu o aparelho?</b> A chave privada some com ele, e é isso que se quer. O servidor precisa de um caminho de recuperação (outra passkey, códigos de backup) e de um modo de <b>revogar</b> a chave pública antiga. Planejar a recuperação faz parte do projeto, não é detalhe.</>} en={<><b>Lost the device?</b> The private key goes with it, which is what you want. The server needs a recovery path (another passkey, backup codes) and a way to <b>revoke</b> the old public key. Planning recovery is part of the design, not a detail.</>} /></Callout>
      </Section>
      <Section id="session" title={<T pt="E depois do login: a sessão" en="After sign-in: the session" />}>
        <p><T pt={<>Assinar um desafio a cada clique seria inviável (e irritante: uma biometria por requisição). Por isso a prova por chave serve para <b>abrir uma sessão</b>, e a sessão vale por um tempo.</>} en={<>Signing a challenge on every click would be impractical (and annoying: one biometric prompt per request). So the key proof is used to <b>open a session</b>, and the session lasts for a while.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="A prova por chave abre a sessão; as requisições seguintes mostram apenas o cookie (ou token). Quem roubar o cookie age como você até a sessão cair." en="The key proof opens the session; later requests show only the cookie (or token). Whoever steals the cookie acts as you until the session ends." />}>
          <svg viewBox="0 0 700 410" role="img" aria-label="Como a sessão funciona depois do login por chave / How the session works after a key login">
            <rect x="50" y="8" width="120" height="34" rx="4" className="ln" />
            <text x="110.0" y="29.5" className="pt" textAnchor="middle">App / navegador</text>
            <text x="110.0" y="29.5" className="en" textAnchor="middle">App / browser</text>
            <rect x="500" y="8" width="120" height="34" rx="4" className="ln" />
            <text x="560.0" y="29.5" className="pt" textAnchor="middle">Servidor</text>
            <text x="560.0" y="29.5" className="en" textAnchor="middle">Server</text>
            <path d="M110 42L110 398" className="ln dash" />
            <path d="M560 42L560 398" className="ln dash" />
            <rect x="15" y="58" width="670" height="62" rx="4" className="brandfill" />
            <path d="M114 78L556 78" className="ln" />
            <path d="M548.0 81.6L556 78L548.0 74.4" className="ln" />
            <path d="M122.0 74.4L114 78L122.0 81.6" className="ln" />
            <text x="335" y="72" className="pt" textAnchor="middle">① login por chave (desafio + assinatura): acontece UMA vez</text>
            <text x="335" y="72" className="en" textAnchor="middle">① key login (challenge + signature): happens ONCE</text>
            <text x="335" y="106" className="pt mut" textAnchor="middle">a chave privada é usada só neste passo</text>
            <text x="335" y="106" className="en mut" textAnchor="middle">the private key is used only in this step</text>
            <rect x="440" y="134" width="240" height="58" rx="4" className="ln fillsoft" />
            <text x="560.0" y="159.0" className="pt" textAnchor="middle">② cria a sessão no servidor</text>
            <text x="560.0" y="159.0" className="en" textAnchor="middle">② creates the session on the server</text>
            <text x="560.0" y="176.0" className="pt mut mono" textAnchor="middle">sid=7f3a… → gustavo · 8h</text>
            <text x="560.0" y="176.0" className="en mut mono" textAnchor="middle">sid=7f3a… → gustavo · 8h</text>
            <path d="M556 214L114 214" className="ln" />
            <path d="M122.0 210.4L114 214L122.0 217.6" className="ln" />
            <text x="335" y="206" className="pt mono" textAnchor="middle">③ Set-Cookie: sid=7f3a… (HttpOnly; Secure; SameSite)</text>
            <text x="335" y="206" className="en mono" textAnchor="middle">③ Set-Cookie: sid=7f3a… (HttpOnly; Secure; SameSite)</text>
            <path d="M114 256L556 256" className="ln" />
            <path d="M548.0 259.6L556 256L548.0 252.4" className="ln" />
            <text x="335" y="248" className="pt mono" textAnchor="middle">④ GET /conta + Cookie: sid=7f3a…</text>
            <text x="335" y="248" className="en mono" textAnchor="middle">④ GET /account + Cookie: sid=7f3a…</text>
            <path d="M556 292L114 292" className="ln" />
            <path d="M122.0 288.4L114 292L122.0 295.6" className="ln" />
            <text x="335" y="284" className="pt mut" textAnchor="middle">200 OK: o servidor achou o sid e sabe que é o gustavo</text>
            <text x="335" y="284" className="en mut" textAnchor="middle">200 OK: the server found the sid and knows it is gustavo</text>
            <path d="M114 330L556 330" className="ln" />
            <path d="M548.0 333.6L556 330L548.0 326.4" className="ln" />
            <text x="335" y="322" className="pt" textAnchor="middle">⑤ ação sensível → pode exigir nova assinatura (step-up)</text>
            <text x="335" y="322" className="en" textAnchor="middle">⑤ sensitive action → may require a new signature (step-up)</text>
            <path d="M114 372L556 372" className="ln" />
            <path d="M548.0 375.6L556 372L548.0 368.4" className="ln" />
            <text x="335" y="364" className="pt" textAnchor="middle">⑥ logout ou expiração: servidor apaga o sid; o cookie vira inútil</text>
            <text x="335" y="364" className="en" textAnchor="middle">⑥ logout or expiry: the server deletes the sid; the cookie becomes useless</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="" en="" />, <T pt="Sessão com ID opaco (cookie)" en="Opaque session ID (cookie)" />, <T pt="Tokens (access + refresh, JWT)" en="Tokens (access + refresh, JWT)" />]}
          rows={[
            [<T pt={<><b>O que o cliente guarda</b></>} en={<><b>What the client holds</b></>} />, <T pt="Um ID aleatório sem significado." en="A random ID with no meaning." />, <T pt="Um token assinado com claims dentro." en="A signed token with claims inside." />],
            [<T pt={<><b>Onde está o estado</b></>} en={<><b>Where the state lives</b></>} />, <T pt="No servidor (memória, Redis, banco)." en="On the server (memory, Redis, database)." />, <T pt="No próprio token; o servidor só verifica a assinatura." en="In the token itself; the server only verifies the signature." />],
            [<T pt={<><b>Encerrar à força</b></>} en={<><b>Force-ending it</b></>} />, <T pt="Fácil: apaga o ID no servidor." en="Easy: delete the ID on the server." />, <T pt="Mais difícil: o token vale até expirar; por isso o access token é curto e há refresh token." en="Harder: the token is valid until it expires; hence a short access token and a refresh token." />],
            [<T pt={<><b>Cuidados</b></>} en={<><b>Care points</b></>} />, <T pt={<><code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>; renovar o ID após o login.</>} en={<><code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>; renew the ID after login.</>} />, <T pt={<>Fixar o algoritmo, validar <code>iss</code>, <code>aud</code>, <code>exp</code>; guardar o refresh com mais cuidado.</>} en={<>Pin the algorithm, validate <code>iss</code>, <code>aud</code>, <code>exp</code>; guard the refresh token more carefully.</>} />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>A sessão é um “portador”: quem tiver o cookie ou o token age como você.</b> A chave no hardware protege o login, mas não impede que um token roubado seja usado até expirar. Por isso: prazos curtos, revogação, reautenticação em ações sensíveis (<i>step-up</i>) e, em cenários avançados, tokens amarrados a uma chave do cliente (<i>DPoP</i>, RFC 9449).</>} en={<><b>The session is a “bearer”: whoever holds the cookie or token acts as you.</b> The hardware key protects the sign-in, but does not stop a stolen token from being used until it expires. Hence: short lifetimes, revocation, re-authentication on sensitive actions (<i>step-up</i>) and, in advanced setups, tokens bound to a client key (<i>DPoP</i>, RFC 9449).</>} /></Callout>
        <p><T pt={<>Como as sessões, o OAuth e o OIDC se encaixam nisso está em <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>, e os detalhes de cookies e JWT do lado de quem constrói o app estão em <a href="/notas/web-app-security/">Apps web seguros</a>.</>} en={<>How sessions, OAuth and OIDC fit in is covered in <a href="/notas/auth-sso-oauth-oidc/">Sign-in and authentication</a>, and the cookie and JWT details from the app builder’s side are in <a href="/notas/web-app-security/">Secure web apps</a>.</>} /></p>
      </Section>
      <Section id="ssh" title={<T pt="Como o SSH funciona" en="How SSH works" />}>
        <p><T pt={<><b>SSH</b> (Secure Shell) abre um canal cifrado até outra máquina para shell remoto, execução de comandos, transferência de arquivos (<code>scp</code>, <code>sftp</code>) e túneis. É a seção anterior aplicada: acordo de chave efêmera, assinaturas, chaves públicas e privadas, e um túnel simétrico.</>} en={<><b>SSH</b> (Secure Shell) opens an encrypted channel to another machine for a remote shell, running commands, file transfer (<code>scp</code>, <code>sftp</code>) and tunnels. It is the previous sections applied: ephemeral key agreement, signatures, public and private keys, and a symmetric tunnel.</>} /></p>
        <h3><T pt="As três camadas" en="The three layers" /></h3>
        <Diagram minWidth={560} caption={<T pt="O SSH constrói primeiro um túnel seguro que prova quem é o servidor; só depois, dentro dele, prova quem é você." en="SSH first builds a secure tunnel that proves who the server is; only then, inside it, does it prove who you are." />}>
          <svg viewBox="0 0 700 258" role="img" aria-label="As três camadas do protocolo SSH / The three layers of the SSH protocol">
            <rect x="30" y="14" width="520" height="50" rx="4" className="ln" />
            <text x="290" y="35" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de conexão</text>
            <text x="290" y="35" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Connection layer</text>
            <text x="290" y="53" className="pt mut" textAnchor="middle">canais: shell, comando, sftp, túneis de porta</text>
            <text x="290" y="53" className="en mut" textAnchor="middle">channels: shell, command, sftp, port tunnels</text>
            <text x="610" y="43" className="mut mono" textAnchor="middle">RFC 4254</text>
            <rect x="30" y="74" width="520" height="50" rx="4" className="brandfill" />
            <text x="290" y="95" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de autenticação do usuário</text>
            <text x="290" y="95" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>User authentication layer</text>
            <text x="290" y="113" className="pt mut" textAnchor="middle">senha, chave pública, etc.</text>
            <text x="290" y="113" className="en mut" textAnchor="middle">password, public key, etc.</text>
            <text x="610" y="103" className="mut mono" textAnchor="middle">RFC 4252</text>
            <rect x="30" y="134" width="520" height="50" rx="4" className="brandfill" />
            <text x="290" y="155" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Camada de transporte</text>
            <text x="290" y="155" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Transport layer</text>
            <text x="290" y="173" className="pt mut" textAnchor="middle">troca de chaves · cifra · integridade · autentica o SERVIDOR</text>
            <text x="290" y="173" className="en mut" textAnchor="middle">key exchange · encryption · integrity · authenticates the SERVER</text>
            <text x="610" y="163" className="mut mono" textAnchor="middle">RFC 4253</text>
            <rect x="30" y="194" width="520" height="50" rx="4" className="ln fillsoft" />
            <text x="290" y="215" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>TCP, porta 22</text>
            <text x="290" y="215" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>TCP, port 22</text>
            <text x="290" y="233" className="pt mut" textAnchor="middle">o transporte de rede comum</text>
            <text x="290" y="233" className="en mut" textAnchor="middle">the ordinary network transport</text>
          </svg>
        </Diagram>
        <h3><T pt="Quem confia em quem: os arquivos" en="Who trusts whom: the files" /></h3>
        <p><T pt={<>O SSH tem <b>duas</b> verificações, uma em cada sentido, e cada uma usa um arquivo diferente. Confundi-las é a origem da maioria dos erros.</>} en={<>SSH has <b>two</b> checks, one in each direction, and each uses a different file. Mixing them up is the source of most errors.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Dois sentidos de confiança: known_hosts (você confere o servidor) e authorized_keys (o servidor confere você). Cada lado guarda a PÚBLICA do outro." en="Two directions of trust: known_hosts (you check the server) and authorized_keys (the server checks you). Each side keeps the other’s PUBLIC key." />}>
          <svg viewBox="0 0 700 348" role="img" aria-label="Quais arquivos existem no cliente e no servidor SSH / Which files exist on the SSH client and server">
            <rect x="15" y="15" width="295" height="262" rx="4" className="ln" />
            <text x="162" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Seu computador (cliente)</text>
            <text x="162" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Your computer (client)</text>
            <rect x="390" y="15" width="295" height="262" rx="4" className="ln" />
            <text x="537" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Servidor</text>
            <text x="537" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Server</text>
            <circle cx="37" cy="78" r="8" className="fill" />
            <circle cx="37" cy="78" r="3" className="inv" />
            <path d="M45 78L67 78M61 78L61 84M67 78L67 84" className="ln" />
            <text x="80" y="76" className="mono" textAnchor="start">~/.ssh/id_ed25519</text>
            <text x="80" y="94" className="pt mut" textAnchor="start">privada · chmod 600 · nunca sai</text>
            <text x="80" y="94" className="en mut" textAnchor="start">private · chmod 600 · never leaves</text>
            <circle cx="37" cy="134" r="8" className="brandfill" />
            <circle cx="37" cy="134" r="3" className="inv" />
            <path d="M45 134L67 134M61 134L61 140M67 134L67 140" className="ln" />
            <text x="80" y="132" className="mono" textAnchor="start">~/.ssh/id_ed25519.pub</text>
            <text x="80" y="150" className="pt mut" textAnchor="start">pública · pode ser copiada</text>
            <text x="80" y="150" className="en mut" textAnchor="start">public · safe to copy</text>
            <rect x="30" y="180" width="265" height="80" rx="4" className="ln fillsoft" />
            <text x="42" y="202" className="mono" textAnchor="start">~/.ssh/known_hosts</text>
            <text x="42" y="222" className="pt mut" textAnchor="start">impressões dos servidores em que</text>
            <text x="42" y="222" className="en mut" textAnchor="start">fingerprints of servers you</text>
            <text x="42" y="240" className="pt mut" textAnchor="start">você confia: você verifica o SERVIDOR</text>
            <text x="42" y="240" className="en mut" textAnchor="start">trust: you verify the SERVER</text>
            <circle cx="412" cy="78" r="8" className="fill" />
            <circle cx="412" cy="78" r="3" className="inv" />
            <path d="M420 78L442 78M436 78L436 84M442 78L442 84" className="ln" />
            <text x="455" y="76" className="mono" textAnchor="start">ssh_host_ed25519_key</text>
            <text x="455" y="94" className="pt mut" textAnchor="start">privada do servidor (host key)</text>
            <text x="455" y="94" className="en mut" textAnchor="start">server’s private host key</text>
            <circle cx="412" cy="124" r="8" className="brandfill" />
            <circle cx="412" cy="124" r="3" className="inv" />
            <path d="M420 124L442 124M436 124L436 130M442 124L442 130" className="ln" />
            <text x="455" y="122" className="mono" textAnchor="start">ssh_host_ed25519_key.pub</text>
            <text x="455" y="140" className="pt mut" textAnchor="start">pública do servidor</text>
            <text x="455" y="140" className="en mut" textAnchor="start">server’s public host key</text>
            <rect x="405" y="170" width="265" height="90" rx="4" className="ln fillsoft" />
            <text x="417" y="192" className="mono" textAnchor="start">~/.ssh/authorized_keys</text>
            <text x="417" y="212" className="pt mut" textAnchor="start">chaves públicas de quem pode</text>
            <text x="417" y="212" className="en mut" textAnchor="start">public keys of who may</text>
            <text x="417" y="230" className="pt mut" textAnchor="start">entrar como este usuário:</text>
            <text x="417" y="230" className="en mut" textAnchor="start">log in as this user:</text>
            <text x="417" y="248" className="pt mut" textAnchor="start">o servidor verifica VOCÊ</text>
            <text x="417" y="248" className="en mut" textAnchor="start">the server verifies YOU</text>
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
            <text x="46" y="308" className="pt" textAnchor="start">você copia a pública para o servidor (ssh-copy-id)</text>
            <text x="46" y="308" className="en" textAnchor="start">you copy the public key to the server (ssh-copy-id)</text>
            <circle cx="30" cy="330" r="9" className="ln fillsoft" />
            <text x="30" y="334" className="mono" textAnchor="middle">2</text>
            <text x="46" y="334" className="pt" textAnchor="start">na 1ª conexão você aceita a impressão do servidor</text>
            <text x="46" y="334" className="en" textAnchor="start">on the 1st connection you accept the server’s fingerprint</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Pergunta" en="Question" />, <T pt="Quem verifica" en="Who checks" />, <T pt="Arquivo" en="File" />, <T pt="Se falhar" en="If it fails" />]}
          rows={[
            [<T pt="“Este servidor é mesmo o servidor?”" en="“Is this server really the server?”" />, <T pt="Você (cliente)" en="You (client)" />, <T pt={<><code>~/.ssh/known_hosts</code></>} en={<><code>~/.ssh/known_hosts</code></>} />, <T pt="Aviso “REMOTE HOST IDENTIFICATION HAS CHANGED”" en="“REMOTE HOST IDENTIFICATION HAS CHANGED” warning" />],
            [<T pt="“Esta pessoa pode entrar?”" en="“May this person log in?”" />, <T pt="Servidor" en="Server" />, <T pt={<><code>~/.ssh/authorized_keys</code></>} en={<><code>~/.ssh/authorized_keys</code></>} />, <T pt={<><code>Permission denied (publickey)</code></>} en={<><code>Permission denied (publickey)</code></>} />],
          ]}
        />
        <h3><T pt="O handshake, passo a passo" en="The handshake, step by step" /></h3>
        <Diagram minWidth={560} caption={<T pt="Primeiro o cliente confere o servidor (passos 3 e 4, com known_hosts); depois, já dentro do túnel cifrado, o servidor confere o cliente (passos 5 a 8)." en="First the client checks the server (steps 3 and 4, with known_hosts); then, already inside the encrypted tunnel, the server checks the client (steps 5 to 8)." />}>
          <svg viewBox="0 0 700 516" role="img" aria-label="Handshake SSH passo a passo / SSH handshake step by step">
            <rect x="55" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="110.0" y="28.5" className="pt" textAnchor="middle">Cliente</text>
            <text x="110.0" y="28.5" className="en" textAnchor="middle">Client</text>
            <rect x="535" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="590.0" y="28.5" className="pt" textAnchor="middle">Servidor</text>
            <text x="590.0" y="28.5" className="en" textAnchor="middle">Server</text>
            <path d="M110 40L110 506" className="ln dash" />
            <path d="M590 40L590 506" className="ln dash" />
            <rect x="12" y="50" width="676" height="96" rx="4" className="ln fillsoft" />
            <text x="22" y="66" className="pt mut" textAnchor="start">em claro</text>
            <text x="22" y="66" className="en mut" textAnchor="start">in the clear</text>
            <rect x="12" y="152" width="676" height="110" rx="4" className="brandfill" />
            <text x="22" y="168" className="pt mut" textAnchor="start">troca de chaves (autentica o servidor)</text>
            <text x="22" y="168" className="en mut" textAnchor="start">key exchange (authenticates the server)</text>
            <rect x="12" y="268" width="676" height="230" rx="4" className="ln" />
            <text x="22" y="284" className="pt mut" textAnchor="start">TUDO daqui para baixo vai cifrado</text>
            <text x="22" y="284" className="en mut" textAnchor="start">EVERYTHING below this line is encrypted</text>
            <path d="M114 88L586 88" className="ln" />
            <path d="M578.0 91.6L586 88L578.0 84.4" className="ln" />
            <path d="M122.0 84.4L114 88L122.0 91.6" className="ln" />
            <text x="350" y="82" className="pt" textAnchor="middle">① conecta na porta 22 · versões</text>
            <text x="350" y="82" className="en" textAnchor="middle">① connects to port 22 · versions</text>
            <text x="350" y="102" className="pt mut" textAnchor="middle">SSH-2.0-OpenSSH_…</text>
            <text x="350" y="102" className="en mut" textAnchor="middle">SSH-2.0-OpenSSH_…</text>
            <path d="M114 130L586 130" className="ln" />
            <path d="M578.0 133.6L586 130L578.0 126.4" className="ln" />
            <path d="M122.0 126.4L114 130L122.0 133.6" className="ln" />
            <text x="350" y="124" className="pt" textAnchor="middle">② lista de algoritmos aceitos (KEXINIT)</text>
            <text x="350" y="124" className="en" textAnchor="middle">② lists of accepted algorithms (KEXINIT)</text>
            <path d="M114 196L586 196" className="ln" />
            <path d="M578.0 199.6L586 196L578.0 192.4" className="ln" />
            <text x="350" y="190" className="pt" textAnchor="middle">③ metade pública efêmera do cliente</text>
            <text x="350" y="190" className="en" textAnchor="middle">③ client’s ephemeral public half</text>
            <path d="M586 238L114 238" className="ln" />
            <path d="M122.0 234.4L114 238L122.0 241.6" className="ln" />
            <text x="350" y="232" className="pt" textAnchor="middle">④ metade do servidor + chave pública do host + assinatura</text>
            <text x="350" y="232" className="en" textAnchor="middle">④ server’s half + host public key + signature</text>
            <path d="M114 318L586 318" className="ln" />
            <path d="M578.0 321.6L586 318L578.0 314.4" className="ln" />
            <text x="350" y="312" className="pt" textAnchor="middle">⑤ usuário "ana" + chave pública id_ed25519.pub</text>
            <text x="350" y="312" className="en" textAnchor="middle">⑤ user "ana" + public key id_ed25519.pub</text>
            <path d="M586 356L114 356" className="ln" />
            <path d="M122.0 352.4L114 356L122.0 359.6" className="ln" />
            <text x="350" y="350" className="pt" textAnchor="middle">⑥ essa chave está em authorized_keys? sim</text>
            <text x="350" y="350" className="en" textAnchor="middle">⑥ is that key in authorized_keys? yes</text>
            <path d="M114 394L586 394" className="ln" />
            <path d="M578.0 397.6L586 394L578.0 390.4" className="ln" />
            <text x="350" y="388" className="pt" textAnchor="middle">⑦ assinatura (com a privada) sobre o ID da sessão</text>
            <text x="350" y="388" className="en" textAnchor="middle">⑦ signature (with the private key) over the session ID</text>
            <path d="M586 432L114 432" className="ln" />
            <path d="M122.0 428.4L114 432L122.0 435.6" className="ln" />
            <text x="350" y="426" className="pt" textAnchor="middle">⑧ servidor verifica com a pública → autenticado</text>
            <text x="350" y="426" className="en" textAnchor="middle">⑧ server verifies with the public key → authenticated</text>
            <path d="M114 478L586 478" className="ln" />
            <path d="M578.0 481.6L586 478L578.0 474.4" className="ln" />
            <path d="M122.0 474.4L114 478L122.0 481.6" className="ln" />
            <text x="350" y="472" className="pt" textAnchor="middle">⑨ abre canal: shell, comando, sftp, túnel</text>
            <text x="350" y="472" className="en" textAnchor="middle">⑨ opens channel: shell, command, sftp, tunnel</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={<><b>A primeira conexão é um ato de fé (TOFU, “trust on first use”).</b> Na primeira vez o SSH mostra a impressão da chave do servidor e pergunta se você confia. Se você aceitar sem conferir, um intermediário na primeira conexão passa despercebido. Em servidores importantes, confira a impressão por outro canal (console do provedor, quem administra).</>} en={<><b>The first connection is an act of faith (TOFU, “trust on first use”).</b> The first time, SSH shows the server key’s fingerprint and asks whether you trust it. If you accept without checking, a man in the middle on the first connection goes unnoticed. For important servers, check the fingerprint through another channel (provider console, the administrator).</>} /></Callout>
        <h3><T pt="Mão na massa" en="Hands-on" /></h3>
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
          <li><T pt={<><b>Defina uma passphrase</b> ao gerar a chave: ela cifra o arquivo da privada no disco. Sem ela, quem copiar o arquivo ganha o acesso.</>} en={<><b>Set a passphrase</b> when generating the key: it encrypts the private-key file on disk. Without it, whoever copies the file gets the access.</>} /></li>
          <li><T pt={<><b>Permissões importam</b>: <code>chmod 700 ~/.ssh</code> e <code>chmod 600</code> na privada e no <code>authorized_keys</code>. O SSH recusa chaves legíveis por outros.</>} en={<><b>Permissions matter</b>: <code>chmod 700 ~/.ssh</code> and <code>chmod 600</code> on the private key and on <code>authorized_keys</code>. SSH refuses keys readable by others.</>} /></li>
          <li><T pt={<><b>Uma chave por aparelho</b>: assim, perdeu o notebook, remova só a pública dele dos servidores.</>} en={<><b>One key per device</b>: that way, if you lose the laptop, you remove only its public key from the servers.</>} /></li>
        </ul>
        <h3><T pt="Endurecendo o servidor" en="Hardening the server" /></h3>
        <CodeBlock>
          <span className="tok-c"># /etc/ssh/sshd_config (check the manual for your distribution)</span>{"\n"}
          {"PubkeyAuthentication yes\n"}
          {"PasswordAuthentication no"}<span className="tok-c"> # keys only: removes password guessing</span>{"\n"}
          {"PermitRootLogin no"}<span className="tok-c"> # sign in as a normal user, then use sudo</span>
        </CodeBlock>
        <p><T pt={<>Depois de alterar, recarregue o serviço (<code>sshd</code> ou <code>ssh</code>, conforme a distribuição) e <b>teste numa segunda sessão antes de fechar a primeira</b>: um erro aqui pode trancar você fora.</>} en={<>After changing it, reload the service (<code>sshd</code> or <code>ssh</code>, depending on the distribution) and <b>test in a second session before closing the first</b>: a mistake here can lock you out.</>} /></p>
        <h3><T pt="ssh-agent, bastion e ProxyJump" en="ssh-agent, bastion and ProxyJump" /></h3>
        <Diagram minWidth={560} caption={<T pt="O agent digita a passphrase uma única vez e assina por você. Com ProxyJump você chega a servidores internos sem expor a chave privada." en="The agent unlocks the passphrase once and signs for you. With ProxyJump you reach internal servers without exposing the private key." />}>
          <svg viewBox="0 0 700 334" role="img" aria-label="ssh-agent e ProxyJump / ssh-agent and ProxyJump">
            <rect x="15" y="15" width="250" height="175" rx="4" className="ln" />
            <text x="140" y="36" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Seu computador</text>
            <text x="140" y="36" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Your computer</text>
            <rect x="35" y="52" width="210" height="52" rx="4" className="brandfill" />
            <text x="140.0" y="74.0" className="pt" textAnchor="middle">ssh-agent</text>
            <text x="140.0" y="74.0" className="en" textAnchor="middle">ssh-agent</text>
            <text x="140.0" y="91.0" className="pt mut" textAnchor="middle">guarda a chave já destravada</text>
            <text x="140.0" y="91.0" className="en mut" textAnchor="middle">holds the already unlocked key</text>
            <rect x="35" y="126" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="140.0" y="147.0" className="pt" textAnchor="middle">cliente ssh</text>
            <text x="140.0" y="147.0" className="en" textAnchor="middle">ssh client</text>
            <text x="140.0" y="164.0" className="pt mut" textAnchor="middle">pede: "assine isto"</text>
            <text x="140.0" y="164.0" className="en mut" textAnchor="middle">asks: "sign this"</text>
            <path d="M140 126L140 106" className="ln" />
            <path d="M143.6 114.0L140 106L136.4 114.0" className="ln" />
            <path d="M136.4 118.0L140 126L143.6 118.0" className="ln" />
            <rect x="320" y="60" width="150" height="80" rx="4" className="ln fillsoft" />
            <text x="395.0" y="96.0" className="pt" textAnchor="middle">Bastion</text>
            <text x="395.0" y="96.0" className="en" textAnchor="middle">Bastion</text>
            <text x="395.0" y="113.0" className="pt mut" textAnchor="middle">(jump host)</text>
            <text x="395.0" y="113.0" className="en mut" textAnchor="middle">(jump host)</text>
            <rect x="530" y="60" width="155" height="80" rx="4" className="ln fillsoft" />
            <text x="607.5" y="96.0" className="pt" textAnchor="middle">Servidor interno</text>
            <text x="607.5" y="96.0" className="en" textAnchor="middle">Internal server</text>
            <text x="607.5" y="113.0" className="pt mut" textAnchor="middle">sem IP público</text>
            <text x="607.5" y="113.0" className="en mut" textAnchor="middle">no public IP</text>
            <path d="M265 100L320 100" className="ln" />
            <path d="M312.0 103.6L320 100L312.0 96.4" className="ln" />
            <text x="292" y="90" className="pt mut mono" textAnchor="middle">1</text>
            <text x="292" y="90" className="en mut mono" textAnchor="middle">1</text>
            <path d="M470 100L530 100" className="ln" />
            <path d="M522.0 103.6L530 100L522.0 96.4" className="ln" />
            <text x="500" y="90" className="pt mut mono" textAnchor="middle">2</text>
            <text x="500" y="90" className="en mut mono" textAnchor="middle">2</text>
            <text x="477" y="40" className="mono" textAnchor="middle">ssh -J bastion internal</text>
            <text x="350" y="220" className="pt" textAnchor="middle">A assinatura acontece no seu computador; a chave não vai para o bastion.</text>
            <text x="350" y="220" className="en" textAnchor="middle">Signing happens on your computer; the key does not go to the bastion.</text>
            <text x="350" y="242" className="pt mut" textAnchor="middle">O túnel 2 passa DENTRO da conexão 1, cifrado de ponta a ponta até o servidor interno.</text>
            <text x="350" y="242" className="en mut" textAnchor="middle">Tunnel 2 runs INSIDE connection 1, encrypted end to end to the internal server.</text>
            <rect x="60" y="262" width="580" height="56" rx="4" className="ln dash" />
            <text x="350.0" y="286.0" className="pt" textAnchor="middle">Prefira -J (ProxyJump). Evite o agent forwarding (-A) em hosts que você não controla:</text>
            <text x="350.0" y="286.0" className="en" textAnchor="middle">Prefer -J (ProxyJump). Avoid agent forwarding (-A) on hosts you do not control:</text>
            <text x="350.0" y="303.0" className="pt mut" textAnchor="middle">quem é root lá pode usar seu agent enquanto você estiver conectado.</text>
            <text x="350.0" y="303.0" className="en mut" textAnchor="middle">anyone who is root there can use your agent while you are connected.</text>
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
        <h3><T pt="SSH com o GitHub" en="SSH with GitHub" /></h3>
        <p><T pt={<>Cadastre a <b>pública</b> em <i>Settings → SSH and GPG keys</i> e teste com <code>ssh -T git@github.com</code>. O mesmo par pode também <b>assinar commits</b> (Git 2.34 ou mais novo).</>} en={<>Register the <b>public</b> key under <i>Settings → SSH and GPG keys</i> and test with <code>ssh -T git@github.com</code>. The same pair can also <b>sign commits</b> (Git 2.34 or newer).</>} /></p>
        <CodeBlock code={`git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true`} />
      </Section>
      <Section id="errors" title={<T pt="Erros comuns e como resolver" en="Common errors and how to fix them" />}>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />, <T pt="O que fazer" en="What to do" />]}
          rows={[
            [<code>Permission denied (publickey)</code>, <T pt="A pública não está no servidor, o usuário está errado ou o SSH ofereceu outra chave." en="The public key is not on the server, the user is wrong, or SSH offered another key." />, <T pt={<>Rode <code>ssh -v</code> e veja as chaves oferecidas; confira <code>authorized_keys</code>, o nome do usuário e use <code>-i</code> ou <code>IdentityFile</code>.</>} en={<>Run <code>ssh -v</code> and look at the keys offered; check <code>authorized_keys</code>, the user name and use <code>-i</code> or <code>IdentityFile</code>.</>} />],
            [<code>UNPROTECTED PRIVATE KEY FILE!</code>, <T pt="A privada está legível por outros usuários." en="The private key is readable by other users." />, <T pt={<><code>chmod 600 ~/.ssh/id_ed25519</code> e <code>chmod 700 ~/.ssh</code>.</>} en={<><code>chmod 600 ~/.ssh/id_ed25519</code> and <code>chmod 700 ~/.ssh</code>.</>} />],
            [<code>REMOTE HOST IDENTIFICATION HAS CHANGED!</code>, <T pt="A chave do servidor mudou: reinstalação, IP reaproveitado... ou um intermediário." en="The server key changed: reinstall, reused IP... or a man in the middle." />, <T pt={<>Não ignore. Confirme com quem administra o servidor; só então <code>ssh-keygen -R host</code> e reconecte.</>} en={<>Do not ignore it. Confirm with whoever runs the server; only then <code>ssh-keygen -R host</code> and reconnect.</>} />],
            [<code>Too many authentication failures</code>, <T pt="O agent oferece chaves demais antes da certa." en="The agent offers too many keys before the right one." />, <T pt={<>Use <code>IdentitiesOnly yes</code> e <code>IdentityFile</code> no <code>~/.ssh/config</code>.</>} en={<>Use <code>IdentitiesOnly yes</code> and <code>IdentityFile</code> in <code>~/.ssh/config</code>.</>} />],
            [<>Colei a <b>pública</b> no lugar da privada (ou o contrário)</>, <T pt={<>Confusão entre <code>id_ed25519</code> e <code>.pub</code>.</>} en={<>Mixing up <code>id_ed25519</code> and <code>.pub</code>.</>} />, <T pt={<>A <code>.pub</code> é a que se compartilha. Para conferir se um par combina: <code>ssh-keygen -y -f id_ed25519</code> imprime a pública correspondente.</>} en={<>The <code>.pub</code> is the one you share. To check a pair matches: <code>ssh-keygen -y -f id_ed25519</code> prints the matching public key.</>} />],
            [<code>Load key … invalid format</code>, <T pt="Arquivo da privada corrompido: quebra de linha trocada, cabeçalho cortado, falta a linha final." en="Corrupted private-key file: changed line endings, cut header, missing final newline." />, <T pt="Recopie o arquivo inteiro, sem editar, ou gere um novo par." en="Copy the whole file again, unedited, or generate a new pair." />],
            [<>A <b>privada foi parar no repositório</b>, num chat ou num log</>, <T pt="Vazamento: considere-a comprometida." en="Leak: consider it compromised." />, <T pt="Remova a pública dos servidores e da conta do GitHub, gere um par novo. Apagar o commit não basta: o histórico e os clones guardam a cópia." en="Remove the public key from servers and the GitHub account, generate a new pair. Deleting the commit is not enough: history and clones keep the copy." />],
            [<>Navegador: <code>NET::ERR_CERT_COMMON_NAME_INVALID</code> ou certificado expirado</>, <T pt="O nome no certificado não cobre o domínio acessado, ou a validade acabou." en="The name in the certificate does not cover the domain visited, or the validity ended." />, <T pt="Confira os nomes (SAN) e a data; renove; instale também o certificado intermediário." en="Check the names (SAN) and the date; renew; also install the intermediate certificate." />],
            ["Tentei “cifrar com a privada” para proteger dados", <T pt="Confundir assinatura com cifragem." en="Mixing up signing with encrypting." />, <T pt="Para sigilo, cifre com a pública do destinatário (ou use uma chave simétrica). Para provar autoria, assine." en="For secrecy, encrypt with the recipient’s public key (or use a symmetric key). To prove authorship, sign." />],
            ["JWT aceito mesmo com a assinatura alterada", <T pt={<>O verificador aceita <code>alg: none</code> ou troca <code>RS256</code> por <code>HS256</code> usando a pública como segredo.</>} en={<>The verifier accepts <code>alg: none</code> or swaps <code>RS256</code> for <code>HS256</code> using the public key as the secret.</>} />, <T pt="Fixe o algoritmo esperado na verificação e use bibliotecas mantidas (RFC 8725)." en="Pin the expected algorithm when verifying and use maintained libraries (RFC 8725)." />],
            ["Perdi o celular com a passkey", <T pt="A privada ficou no aparelho." en="The private key was on the device." />, <T pt="Use outra passkey ou os códigos de backup, e revogue a credencial antiga no servidor." en="Use another passkey or the backup codes, and revoke the old credential on the server." />],
          ]}
        />
      </Section>
      <Section id="cheat-cry" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faça" en="Do" />]}
          rows={[
            [<T pt="que ninguém leia os dados no caminho" en="nobody to read the data on the way" />, <T pt="Cifre: TLS no tráfego, AES-GCM em dados em repouso." en="Encrypt: TLS for traffic, AES-GCM for data at rest." />],
            [<T pt="provar que um arquivo ou token veio de mim" en="to prove a file or token came from me" />, <T pt="Assine com a privada; quem recebe verifica com a pública." en="Sign with the private key; the receiver verifies with the public one." />],
            [<T pt="detectar se algo foi alterado" en="to detect tampering" />, <T pt="Compare hashes (ou use assinatura/MAC se houver adversário)." en="Compare hashes (or use a signature/MAC if there is an adversary)." />],
            [<T pt="entrar num servidor por SSH" en="to log in to a server over SSH" />, <T pt={<><code>ssh-keygen -t ed25519</code>, <code>ssh-copy-id</code>, desligar senha no servidor.</>} en={<><code>ssh-keygen -t ed25519</code>, <code>ssh-copy-id</code>, turn passwords off on the server.</>} />],
            [<T pt="login sem senha em um app" en="password-free sign-in in an app" />, <T pt="Passkey/WebAuthn: o aparelho assina um desafio; guarde só a pública." en="Passkey/WebAuthn: the device signs a challenge; store only the public key." />],
            [<T pt="manter o usuário logado sem pedir assinatura sempre" en="to keep the user signed in without asking for a signature every time" />, <T pt="Sessão com cookie seguro ou token curto + refresh; reautentique em ações sensíveis." en="Session with a secure cookie or short token + refresh; re-authenticate on sensitive actions." />],
            [<T pt="conferir um servidor SSH novo" en="to check a new SSH server" />, <T pt="Compare a impressão (fingerprint) por outro canal antes de aceitar." en="Compare the fingerprint over another channel before accepting." />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <QA items={[
            [<T pt="Por que o TLS e o SSH combinam criptografia assimétrica e simétrica?" en="Why do TLS and SSH combine asymmetric and symmetric cryptography?" />, <T pt="A assimétrica resolve combinar uma chave em público (e prova identidade), mas é lenta; a simétrica é rápida para o volume de dados. Usa-se a primeira para acordar a chave e a segunda para os dados." en="Asymmetric solves agreeing on a key in public (and proves identity) but is slow; symmetric is fast for the volume of data. The first agrees on the key, the second carries the data." />],
            [<T pt="Num login por chave no aparelho, o que trafega e o que nunca sai do aparelho?" en="In a device-key sign-in, what travels and what never leaves the device?" />, <T pt="Trafegam o desafio e a assinatura (e, no cadastro, a chave pública). A chave privada e a biometria nunca saem do aparelho; o servidor só verifica com a pública." en="The challenge and the signature travel (and, at enrollment, the public key). The private key and the biometric never leave the device; the server only verifies with the public key." />],
            [<T pt="Por que existe a sessão depois da assinatura, e qual o risco dela?" en="Why does the session exist after the signature, and what is its risk?" />, <T pt="Para não assinar a cada requisição. O risco: é um portador, e um cookie ou token roubado vale até expirar; por isso prazos curtos, revogação e step-up." en="To avoid signing on every request. The risk: it is a bearer, and a stolen cookie or token works until it expires; hence short lifetimes, revocation and step-up." />],
            [<T pt={<>O que <code>known_hosts</code> e <code>authorized_keys</code> provam, cada um?</>} en={<>What do <code>known_hosts</code> and <code>authorized_keys</code> each prove?</>} />, <T pt={<><code>known_hosts</code>: você confere que o servidor é o mesmo de antes. <code>authorized_keys</code>: o servidor confere que a sua chave está autorizada a entrar.</>} en={<><code>known_hosts</code>: you check that the server is the same as before. <code>authorized_keys</code>: the server checks that your key is allowed in.</>} />],
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
