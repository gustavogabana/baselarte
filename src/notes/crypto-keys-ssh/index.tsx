import { Callout, CodeBlock, Diagram, Section, Sources, T, Table, QA } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "crypto-keys-ssh",
  title: { en: "Cryptography, keys and SSH: how public and private keys work", pt: "Criptografia, chaves e SSH: como funcionam chaves públicas e privadas" },
  seo: {
    title: { en: "Cryptography, keys and SSH: how public and private keys work", pt: "Criptografia, chaves e SSH: como funcionam chaves públicas e privadas" },
    description: { en: "Hashes, symmetric and asymmetric encryption, digital signatures, Diffie-Hellman, TLS and certificates, private keys kept on the device (passkeys), how the session follows sign-in, and SSH step by step, with 16 diagrams.", pt: "Hashes, criptografia simétrica e assimétrica, assinaturas digitais, Diffie-Hellman, TLS e certificados, chaves privadas guardadas no aparelho (passkeys), como a sessão segue o login e o SSH passo a passo, com 16 diagramas." },
  },
  summary: "hashes, symmetric and asymmetric encryption, public and private keys, digital signatures, Diffie-Hellman, TLS and certificates, private keys kept on the device (passkeys), sessions after sign-in, and SSH step by step, with 16 diagrams, a cheat sheet and common errors.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Cryptography and keys: <em>public, private, sessions and SSH.</em></>, pt: <>Criptografia e chaves: <em>públicas, privadas, sessões e SSH.</em></> },
  heroLede: { en: "How encryption, signatures and key pairs work, how apps keep a private key on the device, how the session carries on from there, and what SSH does step by step.", pt: "Como funcionam criptografia, assinaturas e pares de chaves, como os apps guardam a chave privada no aparelho, como a sessão continua depois disso e o que o SSH faz passo a passo." },
  published: "2026-10-22",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "tldr", title: <T pt="Resumo (TL;DR)" en="Summary (TL;DR)" /> },
        { id: "basics", title: <T pt="Três promessas e um ingrediente" en="Three promises and one ingredient" /> },
        { id: "symmetric", title: <T pt="Chave simétrica: um segredo, dois lados" en="Symmetric key: one secret, two sides" /> },
        { id: "asymmetric", title: <T pt="Chaves pública e privada" en="Public and private keys" /> },
        { id: "signature", title: <T pt="Assinatura digital passo a passo" en="Digital signature step by step" /> },
        { id: "tls", title: <T pt="Juntando tudo: troca de chaves, TLS e certificados" en="Putting it together: key exchange, TLS and certificates" /> },
        { id: "device", title: <T pt="Apps com a chave privada no aparelho" en="Apps with the private key on the device" /> },
        { id: "session", title: <T pt="E depois do login: a sessão" en="After sign-in: the session" /> },
        { id: "ssh", title: <T pt="Como o SSH funciona" en="How SSH works" /> },
        { id: "where", title: <T pt="Onde isso aparece no dia a dia" en="Where this shows up day to day" /> },
        { id: "glossary", title: <T pt="Glossário" en="Glossary" /> },
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
      <Section id="tldr" title={<T pt="Resumo (TL;DR)" en="Summary (TL;DR)" />}>
        <Callout icon="check"><T pt={<>Onde esta nota se encaixa: é o alicerce de matemática e chaves por baixo de login, HTTPS e SSH. O mapa de identidade (SSO, OAuth, OIDC) está em <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>; sessões e cookies do lado do app, em <a href="/notas/web-app-security/">Apps web seguros</a>; o uso prático com chaves de curta duração, em <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</>} en={<>Where this note fits: it is the math-and-keys foundation under sign-in, HTTPS and SSH. The identity map (SSO, OAuth, OIDC) is in <a href="/notas/auth-sso-oauth-oidc/">Sign-in and authentication</a>; sessions and cookies from the app’s side, in <a href="/notas/web-app-security/">Secure web apps</a>; the practical use with short-lived credentials, in <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>.</>} /></Callout>
        <ol className="ds-steps">
          <li><T pt={<><b>Chave simétrica</b>: um segredo só, igual nos dois lados (rápido, mas difícil de combinar). <b>Par de chaves</b>: uma <b>pública</b> (todos podem ter) e uma <b>privada</b> (só você). O que uma fecha, só a outra abre.</>} en={<><b>Symmetric key</b>: a single secret, the same on both sides (fast, but hard to agree on). <b>Key pair</b>: a <b>public</b> key (everyone may have it) and a <b>private</b> key (only you). What one locks, only the other unlocks.</>} /></li>
          <li><T pt={<>Com o par você <b>cifra</b> (pública cifra, privada decifra) e <b>assina</b> (privada assina, pública verifica). Na prática, tudo combina os dois mundos: o par acorda uma chave simétrica e a simétrica protege os dados (TLS, SSH).</>} en={<>With the pair you <b>encrypt</b> (public encrypts, private decrypts) and <b>sign</b> (private signs, public verifies). In practice everything mixes both worlds: the pair agrees on a symmetric key and the symmetric key protects the data (TLS, SSH).</>} /></li>
          <li><T pt={<>Apps com a chave privada no aparelho (passkeys, bancos, autenticadores) provam quem você é <b>assinando um desafio</b>; o servidor só guarda a pública. Depois da prova, uma <b>sessão</b> (cookie ou token) evita repetir a assinatura a cada requisição. O <b>SSH</b> usa o mesmo truque: o servidor se prova a você, depois você se prova a ele.</>} en={<>Apps with the private key on the device (passkeys, banks, authenticators) prove who you are by <b>signing a challenge</b>; the server only keeps the public key. After the proof, a <b>session</b> (cookie or token) avoids repeating the signature on every request. <b>SSH</b> uses the same trick: the server proves itself to you, then you prove yourself to it.</>} /></li>
        </ol>
      </Section>
      <Section id="basics" title={<T pt="Três promessas e um ingrediente" en="Three promises and one ingredient" />}>
        <p><T pt="Criptografia não é uma coisa só: é um conjunto de ferramentas que entregam promessas diferentes. Saber qual promessa você quer evita usar a ferramenta errada." en="Cryptography is not one thing: it is a toolbox whose tools deliver different promises. Knowing which promise you want avoids using the wrong tool." /></p>
        <Table
          head={[<T pt="Promessa" en="Promise" />, <T pt="Significa" en="Means" />, <T pt="Ferramenta" en="Tool" />]}
          rows={[
            [<T pt={<><b>Sigilo</b> (confidencialidade)</>} en={<><b>Secrecy</b> (confidentiality)</>} />, <T pt="Só quem deve consegue ler." en="Only the intended people can read it." />, <T pt="Cifra (simétrica ou assimétrica)" en="Cipher (symmetric or asymmetric)" />],
            [<T pt={<><b>Integridade</b></>} en={<><b>Integrity</b></>} />, <T pt="Ninguém alterou o dado no caminho." en="Nobody changed the data on the way." />, <T pt="Hash, MAC, assinatura" en="Hash, MAC, signature" />],
            [<T pt={<><b>Autenticidade</b></>} en={<><b>Authenticity</b></>} />, <T pt="Veio mesmo de quem diz que enviou." en="It really came from who says sent it." />, <T pt="Assinatura digital, certificado" en="Digital signature, certificate" />],
          ]}
        />
        <h3><T pt="O ingrediente: o hash" en="The ingredient: the hash" /></h3>
        <p><T pt={<>Um <b>hash</b> transforma qualquer dado em um resumo de tamanho fixo. Mesma entrada, mesmo resumo; mudou um caractere, o resumo muda por inteiro; e não há caminho de volta. Ele não esconde nada (não é cifra): serve de impressão digital, e por isso aparece dentro das assinaturas, dos certificados e das senhas guardadas.</>} en={<>A <b>hash</b> turns any data into a fixed-size digest. Same input, same digest; change one character and the whole digest changes; and there is no way back. It hides nothing (it is not a cipher): it works as a fingerprint, which is why it shows up inside signatures, certificates and stored passwords.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Hash é a impressão digital de um dado. Os valores acima são SHA-256 reais (truncados na tela)." en="A hash is the fingerprint of a piece of data. The values above are real SHA-256 digests (truncated on screen)." />}>
          <svg viewBox="0 0 700 210" role="img" aria-label="Um hash como impressão digital / A hash as a fingerprint">
            <path d="M20 30L39 30L48 39L48 66L20 66Z" className="ln fillsoft" />
            <path d="M26 46L42 46" className="ln" />
            <path d="M26 54L42 54" className="ln" />
            <path d="M26 62L42 62" className="ln" />
            <rect x="58" y="30" width="150" height="36" rx="4" className="ln" />
            <text x="133.0" y="52.5" className="mono" textAnchor="middle">Olá, mundo</text>
            <path d="M208 48L330 48" className="ln" />
            <path d="M322.0 51.6L330 48L322.0 44.4" className="ln" />
            <text x="269" y="42" className="pt mut mono" textAnchor="middle">SHA-256</text>
            <text x="269" y="42" className="en mut mono" textAnchor="middle">SHA-256</text>
            <rect x="330" y="30" width="350" height="36" rx="4" className="ln fillsoft" />
            <text x="505.0" y="52.5" className="mono" textAnchor="middle">b8a0136dcb2459c3070d390239f18258248d9f9d…</text>
            <path d="M20 100L39 100L48 109L48 136L20 136Z" className="ln fillsoft" />
            <path d="M26 116L42 116" className="ln" />
            <path d="M26 124L42 124" className="ln" />
            <path d="M26 132L42 132" className="ln" />
            <rect x="58" y="100" width="150" height="36" rx="4" className="ln" />
            <text x="133.0" y="122.5" className="mono" textAnchor="middle">Olá, mundo!</text>
            <path d="M208 118L330 118" className="ln" />
            <path d="M322.0 121.6L330 118L322.0 114.4" className="ln" />
            <text x="269" y="112" className="pt mut mono" textAnchor="middle">SHA-256</text>
            <text x="269" y="112" className="en mut mono" textAnchor="middle">SHA-256</text>
            <rect x="330" y="100" width="350" height="36" rx="4" className="ln fillsoft" />
            <text x="505.0" y="122.5" className="mono" textAnchor="middle">9583b013baa520d3a893c4270d0c67732d7ef176…</text>
            <text x="505" y="78" className="pt mut" textAnchor="middle">↑ muda 1 caractere → o resultado inteiro muda</text>
            <text x="505" y="78" className="en mut" textAnchor="middle">↑ change 1 character → the whole result changes</text>
            <text x="20" y="168" className="pt" textAnchor="start">Mesma entrada → mesmo hash</text>
            <text x="20" y="168" className="en" textAnchor="start">Same input → same hash</text>
            <text x="250" y="168" className="pt" textAnchor="start">Entrada de qualquer tamanho → saída de tamanho fixo (256 bits)</text>
            <text x="250" y="168" className="en" textAnchor="start">Input of any size → fixed-size output (256 bits)</text>
            <text x="20" y="194" className="pt mut" textAnchor="start">Mão única: do hash não se volta ao texto. É uma impressão digital, não uma cifra.</text>
            <text x="20" y="194" className="en mut" textAnchor="start">One way: you cannot go from hash back to text. It is a fingerprint, not a cipher.</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={<><b>Três palavras que não são sinônimos.</b> <i>Cifrar</i> esconde com uma chave e dá para desfazer; <i>hash</i> resume e não dá para desfazer; <i>codificar</i> (Base64, URL-encoding) só muda a representação e não protege nada. Um JWT, por exemplo, é Base64URL: qualquer um lê; o que o protege é a assinatura.</>} en={<><b>Three words that are not synonyms.</b> <i>Encrypting</i> hides with a key and can be undone; <i>hashing</i> summarizes and cannot be undone; <i>encoding</i> (Base64, URL-encoding) only changes the representation and protects nothing. A JWT, for example, is Base64URL: anyone can read it; what protects it is the signature.</>} /></Callout>
      </Section>
      <Section id="symmetric" title={<T pt="Chave simétrica: um segredo, dois lados" en="Symmetric key: one secret, two sides" />}>
        <p><T pt="É a ideia mais antiga: a mesma chave cifra e decifra. Pense em um cofre com uma só chave, da qual existem duas cópias." en="It is the oldest idea: the same key encrypts and decrypts. Think of a safe with a single key, of which there are two copies." /></p>
        <Diagram minWidth={560} caption={<T pt="Na simétrica há um só segredo compartilhado. O problema deixa de ser a matemática e passa a ser a distribuição da chave." en="Symmetric encryption has a single shared secret. The problem stops being the math and becomes distributing the key." />}>
          <svg viewBox="0 0 700 240" role="img" aria-label="Criptografia simétrica: a mesma chave cifra e decifra / Symmetric cryptography: the same key encrypts and decrypts">
            <circle cx="45" cy="60" r="7" className="ln fillsoft" />
            <path d="M32 84C32 69 58 69 58 84Z" className="ln fillsoft" />
            <text x="45" y="110" className="pt mut" textAnchor="middle">Alice</text>
            <text x="45" y="110" className="en mut" textAnchor="middle">Alice</text>
            <circle cx="655" cy="60" r="7" className="ln fillsoft" />
            <path d="M642 84C642 69 668 69 668 84Z" className="ln fillsoft" />
            <text x="655" y="110" className="pt mut" textAnchor="middle">Bob</text>
            <text x="655" y="110" className="en mut" textAnchor="middle">Bob</text>
            <rect x="85" y="40" width="82" height="40" rx="4" className="ln" />
            <text x="126.0" y="56.0" className="pt" textAnchor="middle">texto</text>
            <text x="126.0" y="56.0" className="en" textAnchor="middle">text</text>
            <text x="126.0" y="73.0" className="pt" textAnchor="middle">"oi"</text>
            <text x="126.0" y="73.0" className="en" textAnchor="middle">"hi"</text>
            <path d="M167 60L205 60" className="ln" />
            <path d="M197.0 63.6L205 60L197.0 56.4" className="ln" />
            <rect x="205" y="40" width="90" height="40" rx="4" className="ln fillsoft" />
            <text x="250.0" y="56.0" className="pt" textAnchor="middle">cifrar</text>
            <text x="250.0" y="56.0" className="en" textAnchor="middle">encrypt</text>
            <text x="250.0" y="73.0" className="mono" textAnchor="middle">AES</text>
            <path d="M295 60L320 60" className="ln" />
            <path d="M312.0 63.6L320 60L312.0 56.4" className="ln" />
            <rect x="320" y="40" width="100" height="40" rx="4" className="ln" />
            <text x="370.0" y="56.0" className="pt" textAnchor="middle">cifrado</text>
            <text x="370.0" y="56.0" className="en" textAnchor="middle">ciphertext</text>
            <text x="370.0" y="73.0" className="mono" textAnchor="middle">x9#kQ2…</text>
            <path d="M420 60L445 60" className="ln" />
            <path d="M437.0 63.6L445 60L437.0 56.4" className="ln" />
            <rect x="445" y="40" width="90" height="40" rx="4" className="ln fillsoft" />
            <text x="490.0" y="56.0" className="pt" textAnchor="middle">decifrar</text>
            <text x="490.0" y="56.0" className="en" textAnchor="middle">decrypt</text>
            <text x="490.0" y="73.0" className="mono" textAnchor="middle">AES</text>
            <path d="M535 60L555 60" className="ln" />
            <path d="M547.0 63.6L555 60L547.0 56.4" className="ln" />
            <rect x="555" y="40" width="60" height="40" rx="4" className="ln" />
            <text x="585.0" y="56.0" className="pt" textAnchor="middle">texto</text>
            <text x="585.0" y="56.0" className="en" textAnchor="middle">text</text>
            <text x="585.0" y="73.0" className="pt" textAnchor="middle">"oi"</text>
            <text x="585.0" y="73.0" className="en" textAnchor="middle">"hi"</text>
            <circle cx="237" cy="150" r="8" className="fill" />
            <circle cx="237" cy="150" r="3" className="inv" />
            <path d="M245 150L267 150M261 150L261 156M267 150L267 156" className="ln" />
            <circle cx="477" cy="150" r="8" className="fill" />
            <circle cx="477" cy="150" r="3" className="inv" />
            <path d="M485 150L507 150M501 150L501 156M507 150L507 156" className="ln" />
            <path d="M250 134L250 82" className="ln" />
            <path d="M253.6 90.0L250 82L246.4 90.0" className="ln" />
            <path d="M490 134L490 82" className="ln" />
            <path d="M493.6 90.0L490 82L486.4 90.0" className="ln" />
            <path d="M290 150L450 150" className="ln dash" />
            <path d="M442.0 153.6L450 150L442.0 146.4" className="ln" />
            <path d="M298.0 146.4L290 150L298.0 153.6" className="ln" />
            <text x="370" y="144" className="pt" textAnchor="middle">a MESMA chave nos dois lados</text>
            <text x="370" y="144" className="en" textAnchor="middle">the SAME key on both sides</text>
            <text x="370" y="170" className="pt mut" textAnchor="middle">(precisa ser combinada antes, em segredo)</text>
            <text x="370" y="170" className="en mut" textAnchor="middle">(must be agreed beforehand, in secret)</text>
            <text x="20" y="206" className="pt mut" textAnchor="start">Rápido e simples, mas: como entregar a chave sem ninguém copiar?</text>
            <text x="20" y="206" className="en mut" textAnchor="start">Fast and simple, but: how do you hand over the key without anyone copying it?</text>
            <text x="20" y="226" className="pt" textAnchor="start">Para n pessoas conversarem em pares são n(n−1)/2 chaves: 10 pessoas → 45 · 100 pessoas → 4.950.</text>
            <text x="20" y="226" className="en" textAnchor="start">For n people to talk in pairs you need n(n−1)/2 keys: 10 people → 45 · 100 people → 4,950.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Algoritmo" en="Algorithm" />, <T pt="Para que serve" en="What it is for" />, <T pt="Nota" en="Note" />]}
          rows={[
            [<><b>AES</b> (128/256 bits)</>, <T pt="Padrão de fato para cifrar dados: arquivos, discos, TLS." en="The de facto standard for encrypting data: files, disks, TLS." />, <T pt={<>Usado em modos autenticados como <b>GCM</b>, que também detectam alteração.</>} en={<>Used in authenticated modes such as <b>GCM</b>, which also detect tampering.</>} />],
            [<b>ChaCha20-Poly1305</b>, <T pt="Alternativa moderna ao AES, rápida mesmo sem hardware dedicado (celulares)." en="Modern alternative to AES, fast even without dedicated hardware (phones)." />, <T pt="Presente no TLS 1.3 e no SSH." en="Present in TLS 1.3 and SSH." />],
            [<><b>HMAC</b> (ex.: HMAC-SHA-256)</>, <T pt="Não cifra: prova integridade e autoria entre quem divide o segredo." en="Does not encrypt: proves integrity and origin between parties that share the secret." />, <T pt="É como as requisições da AWS (SigV4) são assinadas com a secret key." en="It is how AWS requests (SigV4) are signed with the secret key." />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>O limite da simétrica não é a segurança, é a logística.</b> Para duas pessoas que nunca se encontraram, como combinar a chave sem que alguém a copie no caminho? E com muitas pessoas, o número de chaves explode. A criptografia assimétrica existe para resolver isso.</>} en={<><b>The limit of symmetric is not security, it is logistics.</b> For two people who never met, how do you agree on the key without someone copying it on the way? And with many people, the number of keys explodes. Asymmetric cryptography exists to solve this.</>} /></Callout>
      </Section>
      <Section id="asymmetric" title={<T pt="Chaves pública e privada" en="Public and private keys" />}>
        <p><T pt={<>Aqui a chave vem em <b>par</b>, gerado junto por uma conta matemática: o que uma chave faz, só a outra desfaz. Uma você espalha (<b>pública</b>); a outra nunca sai de você (<b>privada</b>). Descobrir a privada a partir da pública é inviável com os tamanhos usados hoje.</>} en={<>Here the key comes as a <b>pair</b>, generated together by a mathematical operation: what one key does, only the other undoes. You spread one (<b>public</b>); the other never leaves you (<b>private</b>). Deriving the private key from the public one is infeasible at today’s key sizes.</>} /></p>
        <Callout tone="good" icon="check"><T pt={<><b>Analogia do cadeado.</b> Você fabrica milhares de cadeados abertos idênticos e os distribui (chave pública). Qualquer um pode fechar um cadeado numa caixa e mandar para você. Só você tem a chave que abre (chave privada). Quem distribuiu cadeados não perdeu segurança alguma.</>} en={<><b>Padlock analogy.</b> You make thousands of identical open padlocks and hand them out (public key). Anyone can snap one shut on a box and send it to you. Only you have the key that opens it (private key). Handing out padlocks cost you no security at all.</>} /></Callout>
        <Diagram minWidth={560} caption={<T pt="Pense num cadeado aberto: Bob distribui cópias à vontade, qualquer um fecha, mas só ele tem a chave que abre." en="Think of an open padlock: Bob hands out copies freely, anyone can snap one shut, but only he holds the key that opens it." />}>
          <svg viewBox="0 0 700 288" role="img" aria-label="Par de chaves: Alice cifra com a pública, só Bob decifra com a privada / Key pair: Alice encrypts with the public key, only Bob decrypts with the private key">
            <rect x="20" y="20" width="210" height="132" rx="4" className="ln" />
            <text x="125" y="42" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Bob</text>
            <text x="125" y="42" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Bob</text>
            <circle cx="45" cy="78" r="8" className="fill" />
            <circle cx="45" cy="78" r="3" className="inv" />
            <path d="M53 78L75 78M69 78L69 84M75 78L75 84" className="ln" />
            <text x="94" y="82" className="pt" textAnchor="start">privada: só Bob</text>
            <text x="94" y="82" className="en" textAnchor="start">private: Bob only</text>
            <circle cx="45" cy="122" r="8" className="brandfill" />
            <circle cx="45" cy="122" r="3" className="inv" />
            <path d="M53 122L75 122M69 122L69 128M75 122L75 128" className="ln" />
            <text x="94" y="126" className="pt" textAnchor="start">pública: para todos</text>
            <text x="94" y="126" className="en" textAnchor="start">public: for everyone</text>
            <rect x="470" y="20" width="210" height="132" rx="4" className="ln" />
            <text x="575" y="42" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Alice</text>
            <text x="575" y="42" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Alice</text>
            <path d="M490 62L511 62L520 71L520 100L490 100Z" className="ln fillsoft" />
            <path d="M496 78L514 78" className="ln" />
            <path d="M496 86L514 86" className="ln" />
            <path d="M496 94L514 94" className="ln" />
            <text x="530" y="85" className="pt" textAnchor="start">quer enviar "oi"</text>
            <text x="530" y="85" className="en" textAnchor="start">wants to send "hi"</text>
            <circle cx="495" cy="126" r="8" className="brandfill" />
            <circle cx="495" cy="126" r="3" className="inv" />
            <path d="M503 126L525 126M519 126L519 132M525 126L525 132" className="ln" />
            <text x="544" y="130" className="pt mut" textAnchor="start">cópia da pública</text>
            <text x="544" y="130" className="en mut" textAnchor="start">copy of the public one</text>
            <path d="M232 122L468 122" className="ln dash" />
            <path d="M460.0 125.6L468 122L460.0 118.4" className="ln" />
            <circle cx="350" cy="98" r="9" className="ln fillsoft" />
            <text x="350" y="102" className="mono" textAnchor="middle">1</text>
            <text x="350" y="82" className="pt" textAnchor="middle">envia a chave pública</text>
            <text x="350" y="82" className="en" textAnchor="middle">sends the public key</text>
            <text x="350" y="144" className="pt mut" textAnchor="middle">(por qualquer canal, até público)</text>
            <text x="350" y="144" className="en mut" textAnchor="middle">(over any channel, even public)</text>
            <path d="M575 154L575 232L125 232L125 156" className="ln" />
            <path d="M128.6 164.0L125 156L121.4 164.0" className="ln" />
            <rect x="310" y="218" width="130" height="28" rx="4" className="ln fillsoft" />
            <text x="375.0" y="236.5" className="mono" textAnchor="middle">x9#kQ2…</text>
            <circle cx="575" cy="190" r="9" className="ln fillsoft" />
            <text x="575" y="194" className="mono" textAnchor="middle">2</text>
            <text x="562" y="194" className="pt" textAnchor="end">cifra com a pública de Bob</text>
            <text x="562" y="194" className="en" textAnchor="end">encrypts with Bob’s public key</text>
            <circle cx="125" cy="190" r="9" className="ln fillsoft" />
            <text x="125" y="194" className="mono" textAnchor="middle">3</text>
            <text x="138" y="194" className="pt" textAnchor="start">só a privada de Bob decifra</text>
            <text x="138" y="194" className="en" textAnchor="start">only Bob’s private key decrypts</text>
            <rect x="565" y="160" width="20" height="15" rx="2" className="ln fillsoft" />
            <path d="M569 160L569 154A6 6 0 0 1 581 154L581 160" className="ln" />
            <text x="375" y="272" className="pt mut" textAnchor="middle">Quem intercepta o canal (Eve) vê só x9#kQ2…: a pública não decifra o que ela mesma cifrou.</text>
            <text x="375" y="272" className="en mut" textAnchor="middle">Whoever taps the channel (Eve) sees only x9#kQ2…: the public key cannot decrypt what it encrypted.</text>
          </svg>
        </Diagram>
        <h3><T pt="Dois usos opostos do mesmo par" en="Two opposite uses of the same pair" /></h3>
        <Diagram minWidth={560} caption={<T pt="O mesmo par serve a duas coisas opostas: a pública protege o que vai para o dono; a privada prova que algo veio do dono." en="The same pair does two opposite jobs: the public key protects what goes to the owner; the private key proves something came from the owner." />}>
          <svg viewBox="0 0 700 252" role="img" aria-label="Os dois usos de um par de chaves / The two uses of a key pair">
            <rect x="10" y="10" width="330" height="232" rx="4" className="ln" />
            <text x="175" y="34" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Cifrar → sigilo</text>
            <text x="175" y="34" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Encrypt → secrecy</text>
            <rect x="360" y="10" width="330" height="232" rx="4" className="ln" />
            <text x="525" y="34" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Assinar → autenticidade</text>
            <text x="525" y="34" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Sign → authenticity</text>
            <rect x="30" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="80.0" y="79.5" className="pt" textAnchor="middle">Remetente</text>
            <text x="80.0" y="79.5" className="en" textAnchor="middle">Sender</text>
            <rect x="220" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="270.0" y="79.5" className="pt" textAnchor="middle">Destinatário</text>
            <text x="270.0" y="79.5" className="en" textAnchor="middle">Recipient</text>
            <path d="M130 75L220 75" className="ln" />
            <path d="M212.0 78.6L220 75L212.0 71.4" className="ln" />
            <text x="175" y="68" className="pt mut" textAnchor="middle">texto cifrado</text>
            <text x="175" y="68" className="en mut" textAnchor="middle">ciphertext</text>
            <circle cx="67" cy="130" r="8" className="brandfill" />
            <circle cx="67" cy="130" r="3" className="inv" />
            <path d="M75 130L97 130M91 130L91 136M97 130L97 136" className="ln" />
            <text x="80" y="156" className="pt mut" textAnchor="middle">pública do</text>
            <text x="80" y="156" className="en mut" textAnchor="middle">recipient’s</text>
            <text x="80" y="172" className="pt mut" textAnchor="middle">destinatário</text>
            <text x="80" y="172" className="en mut" textAnchor="middle">public key</text>
            <circle cx="257" cy="130" r="8" className="fill" />
            <circle cx="257" cy="130" r="3" className="inv" />
            <path d="M265 130L287 130M281 130L281 136M287 130L287 136" className="ln" />
            <text x="270" y="156" className="pt mut" textAnchor="middle">privada do</text>
            <text x="270" y="156" className="en mut" textAnchor="middle">recipient’s</text>
            <text x="270" y="172" className="pt mut" textAnchor="middle">destinatário</text>
            <text x="270" y="172" className="en mut" textAnchor="middle">private key</text>
            <path d="M80 118L80 96" className="ln" />
            <path d="M270 118L270 96" className="ln" />
            <text x="175" y="205" className="pt" textAnchor="middle">Qualquer um cifra;</text>
            <text x="175" y="205" className="en" textAnchor="middle">Anyone can encrypt;</text>
            <text x="175" y="224" className="pt" textAnchor="middle">só o dono da privada lê.</text>
            <text x="175" y="224" className="en" textAnchor="middle">only the private-key owner reads.</text>
            <rect x="380" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="430.0" y="79.5" className="pt" textAnchor="middle">Autor</text>
            <text x="430.0" y="79.5" className="en" textAnchor="middle">Author</text>
            <rect x="570" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="620.0" y="79.5" className="pt" textAnchor="middle">Verificador</text>
            <text x="620.0" y="79.5" className="en" textAnchor="middle">Verifier</text>
            <path d="M480 75L570 75" className="ln" />
            <path d="M562.0 78.6L570 75L562.0 71.4" className="ln" />
            <text x="525" y="68" className="pt mut" textAnchor="middle">mensagem</text>
            <text x="525" y="68" className="en mut" textAnchor="middle">message</text>
            <text x="525" y="91" className="pt mut" textAnchor="middle">+ assinatura</text>
            <text x="525" y="91" className="en mut" textAnchor="middle">+ signature</text>
            <circle cx="417" cy="130" r="8" className="fill" />
            <circle cx="417" cy="130" r="3" className="inv" />
            <path d="M425 130L447 130M441 130L441 136M447 130L447 136" className="ln" />
            <text x="430" y="156" className="pt mut" textAnchor="middle">privada</text>
            <text x="430" y="156" className="en mut" textAnchor="middle">author’s</text>
            <text x="430" y="172" className="pt mut" textAnchor="middle">do autor</text>
            <text x="430" y="172" className="en mut" textAnchor="middle">private key</text>
            <circle cx="607" cy="130" r="8" className="brandfill" />
            <circle cx="607" cy="130" r="3" className="inv" />
            <path d="M615 130L637 130M631 130L631 136M637 130L637 136" className="ln" />
            <text x="620" y="156" className="pt mut" textAnchor="middle">pública</text>
            <text x="620" y="156" className="en mut" textAnchor="middle">author’s</text>
            <text x="620" y="172" className="pt mut" textAnchor="middle">do autor</text>
            <text x="620" y="172" className="en mut" textAnchor="middle">public key</text>
            <path d="M430 118L430 96" className="ln" />
            <path d="M620 118L620 96" className="ln" />
            <text x="525" y="205" className="pt" textAnchor="middle">Qualquer um verifica;</text>
            <text x="525" y="205" className="en" textAnchor="middle">Anyone can verify;</text>
            <text x="525" y="224" className="pt" textAnchor="middle">só o dono da privada assina.</text>
            <text x="525" y="224" className="en" textAnchor="middle">only the private-key owner signs.</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="" en="" />, <T pt="Cifrar" en="Encrypt" />, <T pt="Assinar" en="Sign" />]}
          rows={[
            [<T pt={<><b>Quem usa a privada</b></>} en={<><b>Who uses the private key</b></>} />, <T pt="Destinatário, para ler" en="Recipient, to read" />, <T pt="Autor, para assinar" en="Author, to sign" />],
            [<T pt={<><b>Quem usa a pública</b></>} en={<><b>Who uses the public key</b></>} />, <T pt="Qualquer um, para cifrar" en="Anyone, to encrypt" />, <T pt="Qualquer um, para verificar" en="Anyone, to verify" />],
            [<T pt={<><b>Garante</b></>} en={<><b>Guarantees</b></>} />, <T pt="Sigilo" en="Secrecy" />, <T pt="Autenticidade e integridade" en="Authenticity and integrity" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>Cuidado com o ditado “assinar é cifrar com a privada”.</b> É uma simplificação que funciona no RSA clássico, mas assinatura e cifragem são operações diferentes (e algoritmos como Ed25519 só assinam). Pense em dois papéis: <b>a privada prova autoria; a pública protege o envio ao dono</b>.</>} en={<><b>Beware of the saying “signing is encrypting with the private key”.</b> It is a simplification that works for classic RSA, but signing and encrypting are different operations (and algorithms like Ed25519 only sign). Think of two roles: <b>the private key proves authorship; the public key protects what is sent to the owner</b>.</>} /></Callout>
        <h3><T pt="Algoritmos que você encontra" en="Algorithms you will meet" /></h3>
        <Table
          head={[<T pt="Algoritmo" en="Algorithm" />, <T pt="Faz" en="Does" />, <T pt="Onde aparece" en="Where you see it" />, <T pt="Nota" en="Note" />]}
          rows={[
            [<b>RSA</b>, <T pt="Cifrar e assinar" en="Encrypt and sign" />, <T pt={<>Certificados mais antigos, chaves SSH antigas, JWT <code>RS256</code></>} en={<>Older certificates, older SSH keys, JWT <code>RS256</code></>} />, <T pt="Chaves grandes (2048 bits no mínimo; 3072 ou 4096 para folga). Mais lento e mais pesado." en="Large keys (2048 bits at least; 3072 or 4096 for margin). Slower and heavier." />],
            [<><b>ECDSA</b> (curvas P-256, P-384)</>, <T pt="Assinar" en="Sign" />, <T pt={<>Certificados TLS, JWT <code>ES256</code>, passkeys</>} en={<>TLS certificates, JWT <code>ES256</code>, passkeys</>} />, <T pt="Chaves curtas para a mesma força que o RSA." en="Short keys for the same strength as RSA." />],
            [<b>Ed25519</b>, <T pt="Assinar" en="Sign" />, <T pt="Chaves SSH modernas, assinatura de commits" en="Modern SSH keys, commit signing" />, <T pt="Rápido, chaves pequenas e poucas armadilhas de uso. Padrão recomendado para novas chaves SSH." en="Fast, small keys and few pitfalls. The recommended default for new SSH keys." />],
            [<><b>X25519</b> / ECDH</>, <T pt="Acordar uma chave compartilhada" en="Agree on a shared key" />, <T pt="TLS 1.3, SSH" en="TLS 1.3, SSH" />, <T pt="Não cifra nem assina: só produz o segredo comum (veja a seção de TLS)." en="Neither encrypts nor signs: it only produces the common secret (see the TLS section)." />],
          ]}
        />
      </Section>
      <Section id="signature" title={<T pt="Assinatura digital passo a passo" en="Digital signature step by step" />}>
        <p><T pt={<>A assinatura responde duas perguntas ao mesmo tempo: <i>quem</i> fez isto e <i>se algo mudou</i> desde então. Ela não esconde o conteúdo; qualquer um lê, e qualquer um confere.</>} en={<>A signature answers two questions at once: <i>who</i> made this and <i>whether anything changed</i> since. It does not hide the content; anyone can read it, and anyone can check it.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Na prática assina-se o hash do documento (curto e de tamanho fixo), não o documento inteiro. Detalhes variam por algoritmo; a ideia é esta." en="In practice you sign the hash of the document (short, fixed-size), not the whole document. Details vary by algorithm; the idea is this." />}>
          <svg viewBox="0 0 700 286" role="img" aria-label="Assinatura digital: assinar e verificar / Digital signature: sign and verify">
            <text x="20" y="20" className="pt mut" textAnchor="start">ASSINAR (o autor, com a chave privada)</text>
            <text x="20" y="20" className="en mut" textAnchor="start">SIGN (the author, with the private key)</text>
            <rect x="15" y="32" width="90" height="44" rx="4" className="ln" />
            <text x="60.0" y="58.5" className="pt" textAnchor="middle">documento</text>
            <text x="60.0" y="58.5" className="en" textAnchor="middle">document</text>
            <path d="M105 54L135 54" className="ln" />
            <path d="M127.0 57.6L135 54L127.0 50.4" className="ln" />
            <rect x="135" y="32" width="80" height="44" rx="4" className="ln fillsoft" />
            <text x="175.0" y="50.0" className="pt" textAnchor="middle">hash</text>
            <text x="175.0" y="50.0" className="en" textAnchor="middle">hash</text>
            <text x="175.0" y="67.0" className="mono" textAnchor="middle">SHA-256</text>
            <path d="M215 54L245 54" className="ln" />
            <path d="M237.0 57.6L245 54L237.0 50.4" className="ln" />
            <rect x="245" y="32" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="50.0" className="pt" textAnchor="middle">resumo</text>
            <text x="285.0" y="50.0" className="en" textAnchor="middle">digest</text>
            <text x="285.0" y="67.0" className="mono" textAnchor="middle">H</text>
            <path d="M325 54L355 54" className="ln" />
            <path d="M347.0 57.6L355 54L347.0 50.4" className="ln" />
            <rect x="355" y="32" width="150" height="44" rx="4" className="ln fillsoft" />
            <text x="430" y="50" className="pt" textAnchor="middle">assina com a</text>
            <text x="430" y="50" className="en" textAnchor="middle">signs with the</text>
            <text x="430" y="68" className="pt" textAnchor="middle">chave PRIVADA</text>
            <text x="430" y="68" className="en" textAnchor="middle">PRIVATE key</text>
            <path d="M505 54L535 54" className="ln" />
            <path d="M527.0 57.6L535 54L527.0 50.4" className="ln" />
            <rect x="535" y="32" width="150" height="44" rx="4" className="ln brandfill" />
            <text x="610.0" y="50.0" className="pt" textAnchor="middle">assinatura</text>
            <text x="610.0" y="50.0" className="en" textAnchor="middle">signature</text>
            <text x="610.0" y="67.0" className="mono" textAnchor="middle">S</text>
            <text x="20" y="118" className="pt mut" textAnchor="start">VERIFICAR (qualquer um, com a chave pública)</text>
            <text x="20" y="118" className="en mut" textAnchor="start">VERIFY (anyone, with the public key)</text>
            <rect x="15" y="130" width="90" height="44" rx="4" className="ln" />
            <text x="60.0" y="148.0" className="pt" textAnchor="middle">documento</text>
            <text x="60.0" y="148.0" className="en" textAnchor="middle">document</text>
            <text x="60.0" y="165.0" className="pt" textAnchor="middle">recebido</text>
            <text x="60.0" y="165.0" className="en" textAnchor="middle">received</text>
            <path d="M105 152L135 152" className="ln" />
            <path d="M127.0 155.6L135 152L127.0 148.4" className="ln" />
            <rect x="135" y="130" width="80" height="44" rx="4" className="ln fillsoft" />
            <text x="175.0" y="148.0" className="pt" textAnchor="middle">hash</text>
            <text x="175.0" y="148.0" className="en" textAnchor="middle">hash</text>
            <text x="175.0" y="165.0" className="mono" textAnchor="middle">SHA-256</text>
            <path d="M215 152L245 152" className="ln" />
            <path d="M237.0 155.6L245 152L237.0 148.4" className="ln" />
            <rect x="245" y="130" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="148.0" className="pt" textAnchor="middle">resumo</text>
            <text x="285.0" y="148.0" className="en" textAnchor="middle">digest</text>
            <text x="285.0" y="165.0" className="mono" textAnchor="middle">H₁</text>
            <rect x="535" y="205" width="150" height="44" rx="4" className="ln brandfill" />
            <text x="610.0" y="223.0" className="pt" textAnchor="middle">assinatura</text>
            <text x="610.0" y="223.0" className="en" textAnchor="middle">signature</text>
            <text x="610.0" y="240.0" className="mono" textAnchor="middle">S</text>
            <path d="M535 227L505 227" className="ln" />
            <path d="M513.0 223.4L505 227L513.0 230.6" className="ln" />
            <rect x="355" y="205" width="150" height="44" rx="4" className="ln fillsoft" />
            <text x="430" y="223" className="pt" textAnchor="middle">abre com a</text>
            <text x="430" y="223" className="en" textAnchor="middle">opens with the</text>
            <text x="430" y="241" className="pt" textAnchor="middle">chave PÚBLICA</text>
            <text x="430" y="241" className="en" textAnchor="middle">PUBLIC key</text>
            <path d="M355 227L325 227" className="ln" />
            <path d="M333.0 223.4L325 227L333.0 230.6" className="ln" />
            <rect x="245" y="205" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="223.0" className="pt" textAnchor="middle">resumo</text>
            <text x="285.0" y="223.0" className="en" textAnchor="middle">digest</text>
            <text x="285.0" y="240.0" className="mono" textAnchor="middle">H₂</text>
            <path d="M285 174L285 205" className="ln" />
            <path d="M281.4 197.0L285 205L288.6 197.0" className="ln" />
            <path d="M288.6 182.0L285 174L281.4 182.0" className="ln" />
            <text x="300" y="196" className="pt mono" textAnchor="start">=?</text>
            <text x="300" y="196" className="en mono" textAnchor="start">=?</text>
            <circle cx="30" cy="221" r="10" className="brandfill" />
            <path d="M25 221L29 225L36 216" className="ln" />
            <text x="48" y="217" className="pt" textAnchor="start">iguais: válido</text>
            <text x="48" y="217" className="en" textAnchor="start">equal: valid</text>
            <text x="48" y="235" className="pt mut" textAnchor="start">autor certo, texto intacto</text>
            <text x="48" y="235" className="en mut" textAnchor="start">right author, text intact</text>
            <text x="20" y="272" className="pt mut" textAnchor="start">Se 1 bit do documento mudar, H₁ ≠ H₂ e a verificação falha. Sem a privada, ninguém gera uma S válida.</text>
            <text x="20" y="272" className="en mut" textAnchor="start">If a single bit of the document changes, H₁ ≠ H₂ and verification fails. Without the private key, nobody can produce a valid S.</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><b>Em um JWT</b>: o emissor assina cabeçalho + payload com a chave privada (<code>RS256</code>, <code>ES256</code>); quem recebe baixa as chaves públicas do emissor (o endereço <code>jwks_uri</code> do documento de descoberta do OIDC) e verifica. Foi assim que a AWS confiou no token do GitHub Actions.</>} en={<><b>In a JWT</b>: the issuer signs header + payload with the private key (<code>RS256</code>, <code>ES256</code>); the receiver downloads the issuer’s public keys (the <code>jwks_uri</code> address in the OIDC discovery document) and verifies. That is how AWS trusted the GitHub Actions token.</>} /></li>
          <li><T pt={<><b>Em um commit do Git</b>: você assina com a privada; o GitHub mostra “Verified” ao conferir com a pública cadastrada na sua conta.</>} en={<><b>In a Git commit</b>: you sign with the private key; GitHub shows “Verified” after checking against the public key registered on your account.</>} /></li>
          <li><T pt={<><b>Em um certificado TLS</b>: a autoridade certificadora assina “esta chave pública pertence a este domínio”.</>} en={<><b>In a TLS certificate</b>: the certificate authority signs “this public key belongs to this domain”.</>} /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<><b>HS256 é outra coisa.</b> No JWT <code>HS256</code> existe um segredo compartilhado (HMAC): quem verifica também consegue forjar. Com <code>RS256</code>/<code>ES256</code>, só o dono da privada assina. Sempre fixe o algoritmo esperado ao verificar (RFC 8725).</>} en={<><b>HS256 is something else.</b> In an <code>HS256</code> JWT there is a shared secret (HMAC): whoever verifies can also forge. With <code>RS256</code>/<code>ES256</code>, only the private-key owner signs. Always pin the expected algorithm when verifying (RFC 8725).</>} /></Callout>
      </Section>
      <Section id="tls" title={<T pt="Juntando tudo: troca de chaves, TLS e certificados" en="Putting it together: key exchange, TLS and certificates" />}>
        <p><T pt={<>A assimétrica é mais lenta e só trata blocos pequenos; a simétrica é rápida e cuida de qualquer volume, mas precisa de uma chave combinada. A solução é <b>híbrida</b>: use a assimétrica para <i>combinar</i> uma chave e a simétrica para <i>proteger os dados</i>. É assim no HTTPS e no SSH.</>} en={<>Asymmetric is slower and handles only small blocks; symmetric is fast and handles any volume, but needs an agreed key. The solution is <b>hybrid</b>: use asymmetric to <i>agree</i> on a key and symmetric to <i>protect the data</i>. That is how HTTPS and SSH work.</>} /></p>
        <h3><T pt="Acordar uma chave em público: Diffie-Hellman" en="Agreeing on a key in public: Diffie-Hellman" /></h3>
        <p><T pt={<>Duas partes trocam mensagens à vista de todos e, no fim, cada uma calcula o <b>mesmo segredo</b> sem que ele tenha trafegado. A analogia das tintas mostra a intuição: misturar é fácil, desmisturar é inviável.</>} en={<>Two parties exchange messages in plain sight and, at the end, each computes the <b>same secret</b> without it ever having travelled. The paint analogy shows the intuition: mixing is easy, unmixing is infeasible.</>} /></p>
        <Diagram minWidth={560} caption={<T pt={"Misturar é fácil, desmisturar é inviável. Na prática a \"tinta\" é matemática (curvas elípticas, como no X25519), e o resultado vira a chave simétrica da sessão."} en={"Mixing is easy, unmixing is infeasible. In practice the \"paint\" is math (elliptic curves, as in X25519), and the result becomes the session’s symmetric key."} />}>
          <svg viewBox="0 0 700 366" role="img" aria-label="Troca de chaves de Diffie-Hellman com cores / Diffie-Hellman key exchange with colors">
            <circle cx="70" cy="28" r="7" className="ln fillsoft" />
            <path d="M57 52C57 37 83 37 83 52Z" className="ln fillsoft" />
            <text x="70" y="78" className="pt" textAnchor="middle">Alice</text>
            <text x="70" y="78" className="en" textAnchor="middle">Alice</text>
            <circle cx="630" cy="28" r="7" className="ln fillsoft" />
            <path d="M617 52C617 37 643 37 643 52Z" className="ln fillsoft" />
            <text x="630" y="78" className="pt" textAnchor="middle">Bob</text>
            <text x="630" y="78" className="en" textAnchor="middle">Bob</text>
            <circle cx="350" cy="40" r="16" fill="#f2c94c" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="350" y="72" className="pt mut" textAnchor="middle">cor pública (todos veem)</text>
            <text x="350" y="72" className="en mut" textAnchor="middle">public color (everyone sees)</text>
            <circle cx="70" cy="112" r="16" fill="#d9534f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="70" y="144" className="pt mut" textAnchor="middle">segredo de Alice</text>
            <text x="70" y="144" className="en mut" textAnchor="middle">Alice’s secret</text>
            <circle cx="630" cy="112" r="16" fill="#4a7fd6" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="630" y="144" className="pt mut" textAnchor="middle">segredo de Bob</text>
            <text x="630" y="144" className="en mut" textAnchor="middle">Bob’s secret</text>
            <rect x="175" y="96" width="350" height="118" rx="4" className="ln dash fillsoft" />
            <text x="350" y="116" className="pt mut" textAnchor="middle">canal público: Eve vê tudo o que passa aqui</text>
            <text x="350" y="116" className="en mut" textAnchor="middle">public channel: Eve sees everything that passes here</text>
            <circle cx="205" cy="150" r="16" fill="#f0883e" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M227 150L495 150" className="ln" />
            <path d="M487.0 153.6L495 150L487.0 146.4" className="ln" />
            <text x="360" y="143" className="pt" textAnchor="middle">amarelo + vermelho = laranja</text>
            <text x="360" y="143" className="en" textAnchor="middle">yellow + red = orange</text>
            <circle cx="495" cy="188" r="16" fill="#4caf6a" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M473 188L205 188" className="ln" />
            <path d="M213.0 184.4L205 188L213.0 191.6" className="ln" />
            <text x="340" y="206" className="pt" textAnchor="middle">amarelo + azul = verde</text>
            <text x="340" y="206" className="en" textAnchor="middle">yellow + blue = green</text>
            <circle cx="70" cy="300" r="16" fill="#8a6a4f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <circle cx="630" cy="300" r="16" fill="#8a6a4f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M175 200L92 286" className="ln" />
            <path d="M95.0 277.7L92 286L100.1 282.7" className="ln" />
            <path d="M525 160L608 286" className="ln" />
            <path d="M600.6 281.3L608 286L606.6 277.3" className="ln" />
            <text x="70" y="336" className="pt mut" textAnchor="middle">verde + vermelho</text>
            <text x="70" y="336" className="en mut" textAnchor="middle">green + red</text>
            <text x="630" y="336" className="pt mut" textAnchor="middle">laranja + azul</text>
            <text x="630" y="336" className="en mut" textAnchor="middle">orange + blue</text>
            <text x="350" y="284" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>mesmo marrom nos dois lados</text>
            <text x="350" y="284" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>same brown on both sides</text>
            <text x="350" y="304" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>= segredo compartilhado</text>
            <text x="350" y="304" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>= shared secret</text>
            <text x="350" y="336" className="pt mut" textAnchor="middle">Eve tem amarelo, laranja e verde,</text>
            <text x="350" y="336" className="en mut" textAnchor="middle">Eve has yellow, orange and green,</text>
            <text x="350" y="354" className="pt mut" textAnchor="middle">mas não consegue "desmisturar" para achar o vermelho ou o azul.</text>
            <text x="350" y="354" className="en mut" textAnchor="middle">but cannot "unmix" to recover the red or the blue.</text>
          </svg>
        </Diagram>
        <Callout tone="good" icon="check"><T pt={<><b>Chaves efêmeras e sigilo futuro.</b> No TLS 1.3 e no SSH as chaves desse acordo são geradas para a conexão e descartadas depois (<i>forward secrecy</i>). Se alguém roubar a chave privada do servidor no futuro, as conversas antigas gravadas continuam ilegíveis.</>} en={<><b>Ephemeral keys and forward secrecy.</b> In TLS 1.3 and SSH the keys for this agreement are generated for the connection and discarded afterwards. If someone steals the server’s private key in the future, old recorded conversations stay unreadable.</>} /></Callout>
        <h3><T pt="O handshake do TLS 1.3" en="The TLS 1.3 handshake" /></h3>
        <Diagram minWidth={560} caption={<T pt="Sequência simplificada do TLS 1.3. A criptografia assimétrica só faz o acordo de chave e a prova de identidade; os dados passam pela simétrica." en="Simplified TLS 1.3 sequence. Asymmetric cryptography only does the key agreement and identity proof; the data goes through symmetric encryption." />}>
          <svg viewBox="0 0 700 380" role="img" aria-label="Handshake TLS 1.3: assimétrico para combinar, simétrico para o resto / TLS 1.3 handshake: asymmetric to agree, symmetric for the rest">
            <rect x="55" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="110.0" y="28.5" className="pt" textAnchor="middle">Navegador</text>
            <text x="110.0" y="28.5" className="en" textAnchor="middle">Browser</text>
            <rect x="535" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="590.0" y="28.5" className="pt" textAnchor="middle">Servidor</text>
            <text x="590.0" y="28.5" className="en" textAnchor="middle">Server</text>
            <path d="M110 40L110 372" className="ln dash" />
            <path d="M590 40L590 372" className="ln dash" />
            <rect x="20" y="56" width="660" height="188" rx="4" className="brandfill" />
            <text x="32" y="74" className="pt mut" textAnchor="start">Handshake: criptografia assimétrica</text>
            <text x="32" y="74" className="en mut" textAnchor="start">Handshake: asymmetric cryptography</text>
            <rect x="20" y="264" width="660" height="100" rx="4" className="ln fillsoft" />
            <text x="32" y="282" className="pt mut" textAnchor="start">Dados: criptografia simétrica (rápida)</text>
            <text x="32" y="282" className="en mut" textAnchor="start">Data: symmetric cryptography (fast)</text>
            <path d="M114 100L586 100" className="ln" />
            <path d="M578.0 103.6L586 100L578.0 96.4" className="ln" />
            <text x="350" y="88" className="pt" textAnchor="middle">① ClientHello</text>
            <text x="350" y="88" className="en" textAnchor="middle">① ClientHello</text>
            <text x="350" y="116" className="pt mut" textAnchor="middle">algoritmos aceitos + metade pública efêmera (X25519)</text>
            <text x="350" y="116" className="en mut" textAnchor="middle">accepted algorithms + ephemeral public half (X25519)</text>
            <path d="M586 150L114 150" className="ln" />
            <path d="M122.0 146.4L114 150L122.0 153.6" className="ln" />
            <text x="350" y="138" className="pt" textAnchor="middle">② ServerHello</text>
            <text x="350" y="138" className="en" textAnchor="middle">② ServerHello</text>
            <text x="350" y="166" className="pt mut" textAnchor="middle">algoritmo escolhido + metade pública do servidor</text>
            <text x="350" y="166" className="en mut" textAnchor="middle">chosen algorithm + the server’s public half</text>
            <text x="110" y="178" className="pt" textAnchor="middle"></text>
            <text x="110" y="178" className="en" textAnchor="middle"></text>
            <text x="350" y="190" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>os dois calculam o mesmo segredo e derivam as chaves de sessão</text>
            <text x="350" y="190" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>both compute the same secret and derive the session keys</text>
            <path d="M586 222L114 222" className="ln" />
            <path d="M122.0 218.4L114 222L122.0 225.6" className="ln" />
            <text x="350" y="210" className="pt" textAnchor="middle">③ Certificado + assinatura</text>
            <text x="350" y="210" className="en" textAnchor="middle">③ Certificate + signature</text>
            <text x="350" y="238" className="pt mut" textAnchor="middle">(já cifrado) prova que o servidor é dono do domínio</text>
            <text x="350" y="238" className="en mut" textAnchor="middle">(already encrypted) proves the server owns the domain</text>
            <path d="M114 308L586 308" className="ln" />
            <path d="M578.0 311.6L586 308L578.0 304.4" className="ln" />
            <text x="350" y="296" className="pt" textAnchor="middle">④ Dados HTTP cifrados</text>
            <text x="350" y="296" className="en" textAnchor="middle">④ Encrypted HTTP data</text>
            <text x="350" y="324" className="pt mut" textAnchor="middle">AES-GCM ou ChaCha20-Poly1305, com a chave de sessão</text>
            <text x="350" y="324" className="en mut" textAnchor="middle">AES-GCM or ChaCha20-Poly1305, with the session key</text>
            <path d="M586 340L114 340" className="ln" />
            <path d="M122.0 336.4L114 340L122.0 343.6" className="ln" />
            <text x="350" y="356" className="pt mut" textAnchor="middle">← resposta cifrada com a mesma chave de sessão</text>
            <text x="350" y="356" className="en mut" textAnchor="middle">← response encrypted with the same session key</text>
          </svg>
        </Diagram>
        <h3><T pt="Certificados: quem garante que a chave pública é do site?" en="Certificates: who guarantees the public key belongs to the site?" /></h3>
        <p><T pt={<>Se o seu navegador aceitasse qualquer chave pública enviada pelo servidor, um intermediário poderia mandar a dele. O <b>certificado</b> resolve: é a chave pública do site <b>mais o nome do domínio</b>, assinada por uma autoridade (CA) em quem o sistema já confia. As raízes confiáveis vêm instaladas no sistema operacional e no navegador.</>} en={<>If your browser accepted any public key the server sent, a man in the middle could send its own. The <b>certificate</b> fixes this: it is the site’s public key <b>plus the domain name</b>, signed by an authority (CA) the system already trusts. The trusted roots ship with the operating system and the browser.</>} /></p>
        <Diagram minWidth={560} caption={<T pt="Um certificado é uma chave pública com um nome, assinada por alguém em quem o navegador já confia. A confiança desce a cadeia." en="A certificate is a public key with a name, signed by someone the browser already trusts. Trust flows down the chain." />}>
          <svg viewBox="0 0 700 252" role="img" aria-label="Cadeia de confiança dos certificados / Certificate chain of trust">
            <rect x="20" y="18" width="372" height="56" rx="4" className="brandfill" />
            <text x="206" y="42" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Autoridade raiz (Root CA)</text>
            <text x="206" y="42" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Root CA</text>
            <text x="206" y="62" className="pt mut" textAnchor="middle">já vem instalada no sistema/navegador</text>
            <text x="206" y="62" className="en mut" textAnchor="middle">ships with the OS/browser</text>
            <rect x="20" y="100" width="372" height="56" rx="4" className="ln fillsoft" />
            <text x="206" y="124" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Autoridade intermediária</text>
            <text x="206" y="124" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Intermediate CA</text>
            <text x="206" y="144" className="pt mut" textAnchor="middle">assinada pela raiz</text>
            <text x="206" y="144" className="en mut" textAnchor="middle">signed by the root</text>
            <rect x="20" y="182" width="372" height="56" rx="4" className="ln" />
            <text x="206" y="206" className="pt" textAnchor="middle" style={{ fontWeight: "600" }}>Certificado do site: baselarte.com</text>
            <text x="206" y="206" className="en" textAnchor="middle" style={{ fontWeight: "600" }}>Site certificate: baselarte.com</text>
            <text x="206" y="226" className="pt mut" textAnchor="middle">assinado pela intermediária · traz a chave pública</text>
            <text x="206" y="226" className="en mut" textAnchor="middle">signed by the intermediate · carries the public key</text>
            <path d="M206 74L206 100" className="ln" />
            <path d="M202.4 92.0L206 100L209.6 92.0" className="ln" />
            <text x="220" y="92" className="pt mut" textAnchor="start">assina</text>
            <text x="220" y="92" className="en mut" textAnchor="start">signs</text>
            <path d="M206 156L206 182" className="ln" />
            <path d="M202.4 174.0L206 182L209.6 174.0" className="ln" />
            <text x="220" y="174" className="pt mut" textAnchor="start">assina</text>
            <text x="220" y="174" className="en mut" textAnchor="start">signs</text>
            <text x="420" y="40" className="pt" textAnchor="start" style={{ fontWeight: "600" }}>O navegador confere:</text>
            <text x="420" y="40" className="en" textAnchor="start" style={{ fontWeight: "600" }}>The browser checks:</text>
            <circle cx="430" cy="62" r="9" className="ln fillsoft" />
            <text x="430" y="66" className="mono" textAnchor="middle">1</text>
            <text x="448" y="58" className="pt" textAnchor="start">cada assinatura da cadeia,</text>
            <text x="448" y="58" className="en" textAnchor="start">each signature in the chain,</text>
            <text x="448" y="74" className="pt mut" textAnchor="start">até uma raiz confiável</text>
            <text x="448" y="74" className="en mut" textAnchor="start">up to a trusted root</text>
            <circle cx="430" cy="106" r="9" className="ln fillsoft" />
            <text x="430" y="110" className="mono" textAnchor="middle">2</text>
            <text x="448" y="102" className="pt" textAnchor="start">o nome no certificado =</text>
            <text x="448" y="102" className="en" textAnchor="start">the name in the certificate =</text>
            <text x="448" y="118" className="pt mut" textAnchor="start">o domínio acessado</text>
            <text x="448" y="118" className="en mut" textAnchor="start">the domain visited</text>
            <circle cx="430" cy="150" r="9" className="ln fillsoft" />
            <text x="430" y="154" className="mono" textAnchor="middle">3</text>
            <text x="448" y="154" className="pt" textAnchor="start">a data: dentro da validade</text>
            <text x="448" y="154" className="en" textAnchor="start">the date: within the validity period</text>
            <circle cx="430" cy="194" r="9" className="ln fillsoft" />
            <text x="430" y="198" className="mono" textAnchor="middle">4</text>
            <text x="448" y="190" className="pt" textAnchor="start">depois: o servidor assina o handshake</text>
            <text x="448" y="190" className="en" textAnchor="start">then: the server signs the handshake</text>
            <text x="448" y="206" className="pt mut" textAnchor="start">com a privada do certificado</text>
            <text x="448" y="206" className="en mut" textAnchor="start">with the certificate’s private key</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><T pt={<><b>O cadeado do navegador prova o canal, não a honestidade.</b> Ele diz que você fala com quem controla o domínio e que ninguém lê no meio. Um site de golpe também pode ter um certificado válido para o domínio dele.</>} en={<><b>The browser padlock proves the channel, not honesty.</b> It says you are talking to whoever controls the domain and that nobody reads in the middle. A scam site can also hold a valid certificate for its own domain.</>} /></Callout>
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
            <text x="190" y="154" className="pt" textAnchor="start">privada: nasce e fica aqui</text>
            <text x="190" y="154" className="en" textAnchor="start">private: born and stays here</text>
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
            <path d="M120 42L120 400" className="ln dash" />
            <path d="M580 42L580 400" className="ln dash" />
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
      <Section id="where" title={<T pt="Onde isso aparece no dia a dia" en="Where this shows up day to day" />}>
        <Table
          head={[<T pt="Situação" en="Situation" />, <T pt="Quem tem a privada" en="Who holds the private key" />, <T pt="O que a pública faz" en="What the public key does" />, <T pt="Parte simétrica" en="Symmetric part" />]}
          rows={[
            [<T pt={<><b>HTTPS</b></>} en={<><b>HTTPS</b></>} />, <T pt="O servidor (chave do certificado)" en="The server (certificate key)" />, <T pt="Navegador verifica a assinatura do handshake" en="Browser verifies the handshake signature" />, <T pt="Chave de sessão do TLS (AES-GCM, ChaCha20)" en="TLS session key (AES-GCM, ChaCha20)" />],
            [<T pt={<><b>SSH</b></>} en={<><b>SSH</b></>} />, <T pt="Você (login) e o servidor (host key)" en="You (login) and the server (host key)" />, <T pt={<><code>authorized_keys</code> e <code>known_hosts</code></>} en={<><code>authorized_keys</code> and <code>known_hosts</code></>} />, <T pt="Túnel cifrado da sessão" en="The session’s encrypted tunnel" />],
            [<T pt={<><b>Passkey / app de banco</b></>} en={<><b>Passkey / banking app</b></>} />, <T pt="O chip do seu aparelho" en="Your device’s chip" />, <T pt="O servidor verifica a assinatura do desafio" en="The server verifies the challenge signature" />, <T pt="Sessão (cookie/token) e TLS" en="Session (cookie/token) and TLS" />],
            [<T pt={<><b>JWT / OIDC</b></>} en={<><b>JWT / OIDC</b></>} />, <T pt="O provedor de identidade (GitHub, Google)" en="The identity provider (GitHub, Google)" />, <T pt="Quem recebe o token baixa a pública (JWKS) e verifica" en="Whoever receives the token downloads the public key (JWKS) and verifies" />, <T pt="TLS na chamada" en="TLS on the call" />],
            [<T pt={<><b>Commit assinado</b></>} en={<><b>Signed commit</b></>} />, <T pt="Você" en="You" />, <T pt="GitHub verifica e mostra “Verified”" en="GitHub verifies and shows “Verified”" />, <T pt="—" en="—" />],
            [<T pt={<><b>Chaves de acesso da AWS</b></>} en={<><b>AWS access keys</b></>} />, <T pt={<>Ninguém: é <b>simétrico</b> (HMAC). A secret key fica em dois lugares.</>} en={<>Nobody: it is <b>symmetric</b> (HMAC). The secret key lives in two places.</>} />, <T pt="—" en="—" />, <T pt="A requisição é assinada com HMAC-SHA-256 (SigV4)" en="The request is signed with HMAC-SHA-256 (SigV4)" />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt={<><b>Por que o OIDC do GitHub Actions é melhor que chaves da AWS.</b> As chaves de acesso são simétricas: quem as copia assina como você, para sempre. No OIDC, o GitHub assina cada token com uma chave privada que só ele tem, e a AWS só precisa da pública para verificar; o job recebe credenciais temporárias que expiram. Veja <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</>} en={<><b>Why GitHub Actions OIDC beats AWS access keys.</b> Access keys are symmetric: whoever copies them signs as you, forever. With OIDC, GitHub signs each token with a private key only it holds, and AWS needs only the public key to verify; the job gets temporary credentials that expire. See <a href="/notas/github-aws-oidc/">GitHub to AWS with OIDC</a>.</>} /></Callout>
      </Section>
      <Section id="glossary" title={<T pt="Glossário" en="Glossary" />}>
        <Table
          head={[<T pt="Termo" en="Term" />, <T pt="O que é" en="What it is" />]}
          rows={[
            [<b>Criptografia</b>, <T pt="Técnicas matemáticas para proteger sigilo, integridade e autenticidade." en="Mathematical techniques to protect secrecy, integrity and authenticity." />],
            [<b>Texto claro / texto cifrado</b>, <T pt="O dado legível e o dado embaralhado pela cifra." en="The readable data and the data scrambled by the cipher." />],
            [<b>Chave</b>, <T pt="Um número (ou bytes) que controla a cifra. Quem tem a chave certa desfaz o embaralhamento." en="A number (or bytes) that controls the cipher. Whoever holds the right key undoes the scrambling." />],
            [<b>Chave pública / privada</b>, <T pt="As duas metades de um par. A pública pode ser distribuída; a privada nunca sai do dono." en="The two halves of a pair. The public one may be shared; the private one never leaves its owner." />],
            [<b>Hash / resumo (digest)</b>, <T pt="Impressão digital de tamanho fixo, sem volta. Ex.: SHA-256." en="Fixed-size fingerprint, no way back. E.g. SHA-256." />],
            [<b>Assinatura digital</b>, <T pt="Prova de autoria e integridade feita com a chave privada e conferida com a pública." en="Proof of authorship and integrity made with the private key and checked with the public one." />],
            [<b>Certificado (X.509)</b>, <T pt="Chave pública + identidade (domínio), assinada por uma CA." en="Public key + identity (domain), signed by a CA." />],
            [<><b>CA</b> (autoridade certificadora)</>, <T pt="Entidade em quem o sistema confia para assinar certificados. Ex.: Let’s Encrypt." en="Entity the system trusts to sign certificates. E.g. Let’s Encrypt." />],
            [<b>Desafio (nonce)</b>, <T pt="Valor aleatório usado uma única vez para que a resposta não possa ser reaproveitada." en="Random value used only once so the answer cannot be reused." />],
            [<b>Chave efêmera / forward secrecy</b>, <T pt="Chave criada só para uma conexão. Garante que roubar chaves futuras não decifra conversas passadas." en="Key created just for one connection. Ensures that stealing later keys does not decrypt past conversations." />],
            [<b>Impressão digital (fingerprint)</b>, <T pt={<>Hash curto de uma chave pública, para conferir a olho. Ex.: <code>SHA256:…</code> no SSH.</>} en={<>Short hash of a public key, for checking by eye. E.g. <code>SHA256:…</code> in SSH.</>} />],
            [<b>Passphrase</b>, <T pt="Senha que cifra o arquivo da chave privada no disco." en="Password that encrypts the private-key file on disk." />],
            [<b>Enclave / TPM / StrongBox</b>, <T pt="Hardware seguro que guarda a chave privada e assina sem entregá-la." en="Secure hardware that keeps the private key and signs without handing it out." />],
            [<b>Sessão</b>, <T pt="Estado “você já entrou”, guardado no servidor ou num token, que dispensa nova prova a cada requisição." en="The “you are already in” state, kept on the server or in a token, which avoids a new proof on every request." />],
            [<b>TOFU</b>, <T pt={<><i>Trust on first use</i>: confiar na chave vista na primeira conexão e alertar se mudar depois.</>} en={<><i>Trust on first use</i>: trust the key seen on the first connection and warn if it changes later.</>} />],
          ]}
        />
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
