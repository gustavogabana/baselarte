import { Callout, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "crypto-keys-ssh",
  title: "Criptografia: chaves, assinaturas e TLS",
  seo: {
    title: "Criptografia: como funcionam chaves públicas e privadas, assinaturas e TLS",
    description: "Hashes, criptografia simétrica e assimétrica, assinaturas digitais, Diffie-Hellman, TLS e certificados, explicados com diagramas.",
  },
  summary: "hashes, criptografia simétrica e assimétrica, chaves públicas e privadas, assinaturas digitais, Diffie-Hellman, TLS e certificados, onde cada um aparece no dia a dia, e um glossário. Passkeys, sessões e SSH estão numa nota irmã.",
  kicker: "Guia de estudo",
  heroTitle: <>Criptografia e chaves: <em>públicas, privadas, assinaturas e TLS.</em></>,
  heroLede: "Como funcionam criptografia, assinaturas e pares de chaves, e como o TLS junta tudo em cada requisição HTTPS.",
  published: "2026-10-22",
  updated: "2026-11-23",
  toc: [
    {
      items: [
        { id: "tldr", title: "Resumo (TL;DR)" },
        { id: "basics", title: "Três promessas e um ingrediente" },
        { id: "symmetric", title: "Chave simétrica: um segredo, dois lados" },
        { id: "asymmetric", title: "Chaves pública e privada" },
        { id: "signature", title: "Assinatura digital passo a passo" },
        { id: "tls", title: "Juntando tudo: troca de chaves, TLS e certificados" },
        { id: "where", title: "Onde isso aparece no dia a dia" },
        { id: "glossary", title: "Glossário" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="tldr" title={"Resumo (TL;DR)"}>
        <Callout icon="check">Onde esta nota se encaixa: é o alicerce de matemática e chaves por baixo de login, HTTPS e SSH. O mapa de identidade (SSO, OAuth, OIDC) está em <a href="/notas/auth-sso-oauth-oidc/">Login e autenticação</a>; sessões e cookies do lado do app, em <a href="/notas/web-app-security/">Apps web seguros</a>; o uso prático com chaves de curta duração, em <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</Callout>
        <ol className="ds-steps">
          <li><b>Chave simétrica</b>: um segredo só, igual nos dois lados (rápido, mas difícil de combinar). <b>Par de chaves</b>: uma <b>pública</b> (todos podem ter) e uma <b>privada</b> (só você). O que uma fecha, só a outra abre.</li>
          <li>Com o par você <b>cifra</b> (pública cifra, privada decifra) e <b>assina</b> (privada assina, pública verifica). Na prática, tudo combina os dois mundos: o par acorda uma chave simétrica e a simétrica protege os dados (TLS, SSH).</li>
          <li>Apps com a chave privada no aparelho (passkeys, bancos, autenticadores) provam quem você é <b>assinando um desafio</b>; o servidor só guarda a pública. Depois da prova, uma <b>sessão</b> (cookie ou token) evita repetir a assinatura a cada requisição. O <b>SSH</b> usa o mesmo truque: o servidor se prova a você, depois você se prova a ele. Isso tudo está na nota <a href="/notas/passkeys-sessions-ssh/">Passkeys, sessões e SSH</a>.</li>
        </ol>
      </Section>
      <Section id="basics" title={"Três promessas e um ingrediente"}>
        <p>Criptografia não é uma coisa só: é um conjunto de ferramentas que entregam promessas diferentes. Saber qual promessa você quer evita usar a ferramenta errada.</p>
        <Table
          head={["Promessa", "Significa", "Ferramenta"]}
          rows={[
            [<><b>Sigilo</b> (confidencialidade)</>, "Só quem deve consegue ler.", "Cifra (simétrica ou assimétrica)"],
            [<><b>Integridade</b></>, "Ninguém alterou o dado no caminho.", "Hash, MAC, assinatura"],
            [<><b>Autenticidade</b></>, "Veio mesmo de quem diz que enviou.", "Assinatura digital, certificado"],
          ]}
        />
        <h3>O ingrediente: o hash</h3>
        <p>Um <b>hash</b> transforma qualquer dado em um resumo de tamanho fixo. Mesma entrada, mesmo resumo; mudou um caractere, o resumo muda por inteiro; e não há caminho de volta. Ele não esconde nada (não é cifra): serve de impressão digital, e por isso aparece dentro das assinaturas, dos certificados e das senhas guardadas.</p>
        <Diagram minWidth={560} caption={"Hash é a impressão digital de um dado. Os valores acima são SHA-256 reais (truncados na tela)."}>
          <svg viewBox="0 0 700 210" role="img" aria-label="Um hash como impressão digital">
            <path d="M20 30L39 30L48 39L48 66L20 66Z" className="ln fillsoft" />
            <path d="M26 46L42 46" className="ln" />
            <path d="M26 54L42 54" className="ln" />
            <path d="M26 62L42 62" className="ln" />
            <rect x="58" y="30" width="150" height="36" rx="4" className="ln" />
            <text x="133.0" y="52.5" className="mono" textAnchor="middle">Olá, mundo</text>
            <path d="M208 48L330 48" className="ln" />
            <path d="M322.0 51.6L330 48L322.0 44.4" className="ln" />
            <text x="269" y="42" className="mut mono" textAnchor="middle">SHA-256</text>
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
            <text x="269" y="112" className="mut mono" textAnchor="middle">SHA-256</text>
            <rect x="330" y="100" width="350" height="36" rx="4" className="ln fillsoft" />
            <text x="505.0" y="122.5" className="mono" textAnchor="middle">9583b013baa520d3a893c4270d0c67732d7ef176…</text>
            <text x="505" y="78" className="mut" textAnchor="middle">↑ muda 1 caractere → o resultado inteiro muda</text>
            <text x="20" y="168" textAnchor="start">Mesma entrada → mesmo hash</text>
            <text x="250" y="168" textAnchor="start">Entrada de qualquer tamanho → saída de tamanho fixo (256 bits)</text>
            <text x="20" y="194" className="mut" textAnchor="start">Mão única: do hash não se volta ao texto. É uma impressão digital, não uma cifra.</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><b>Três palavras que não são sinônimos.</b> <i>Cifrar</i> esconde com uma chave e dá para desfazer; <i>hash</i> resume e não dá para desfazer; <i>codificar</i> (Base64, URL-encoding) só muda a representação e não protege nada. Um JWT, por exemplo, é Base64URL: qualquer um lê; o que o protege é a assinatura.</Callout>
      </Section>
      <Section id="symmetric" title={"Chave simétrica: um segredo, dois lados"}>
        <p>É a ideia mais antiga: a mesma chave cifra e decifra. Pense em um cofre com uma só chave, da qual existem duas cópias.</p>
        <Diagram minWidth={560} caption={"Na simétrica há um só segredo compartilhado. O problema deixa de ser a matemática e passa a ser a distribuição da chave."}>
          <svg viewBox="0 0 700 240" role="img" aria-label="Criptografia simétrica: a mesma chave cifra e decifra">
            <circle cx="45" cy="60" r="7" className="ln fillsoft" />
            <path d="M32 84C32 69 58 69 58 84Z" className="ln fillsoft" />
            <text x="45" y="110" className="mut" textAnchor="middle">Alice</text>
            <circle cx="655" cy="60" r="7" className="ln fillsoft" />
            <path d="M642 84C642 69 668 69 668 84Z" className="ln fillsoft" />
            <text x="655" y="110" className="mut" textAnchor="middle">Bob</text>
            <rect x="85" y="40" width="82" height="40" rx="4" className="ln" />
            <text x="126.0" y="56.0" textAnchor="middle">texto</text>
            <text x="126.0" y="73.0" textAnchor="middle">"oi"</text>
            <path d="M167 60L205 60" className="ln" />
            <path d="M197.0 63.6L205 60L197.0 56.4" className="ln" />
            <rect x="205" y="40" width="90" height="40" rx="4" className="ln fillsoft" />
            <text x="250.0" y="56.0" textAnchor="middle">cifrar</text>
            <text x="250.0" y="73.0" className="mono" textAnchor="middle">AES</text>
            <path d="M295 60L320 60" className="ln" />
            <path d="M312.0 63.6L320 60L312.0 56.4" className="ln" />
            <rect x="320" y="40" width="100" height="40" rx="4" className="ln" />
            <text x="370.0" y="56.0" textAnchor="middle">cifrado</text>
            <text x="370.0" y="73.0" className="mono" textAnchor="middle">x9#kQ2…</text>
            <path d="M420 60L445 60" className="ln" />
            <path d="M437.0 63.6L445 60L437.0 56.4" className="ln" />
            <rect x="445" y="40" width="90" height="40" rx="4" className="ln fillsoft" />
            <text x="490.0" y="56.0" textAnchor="middle">decifrar</text>
            <text x="490.0" y="73.0" className="mono" textAnchor="middle">AES</text>
            <path d="M535 60L555 60" className="ln" />
            <path d="M547.0 63.6L555 60L547.0 56.4" className="ln" />
            <rect x="555" y="40" width="60" height="40" rx="4" className="ln" />
            <text x="585.0" y="56.0" textAnchor="middle">texto</text>
            <text x="585.0" y="73.0" textAnchor="middle">"oi"</text>
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
            <text x="370" y="144" textAnchor="middle">a MESMA chave nos dois lados</text>
            <text x="370" y="170" className="mut" textAnchor="middle">(precisa ser combinada antes, em segredo)</text>
            <text x="20" y="206" className="mut" textAnchor="start">Rápido e simples, mas: como entregar a chave sem ninguém copiar?</text>
            <text x="20" y="226" textAnchor="start">Para n pessoas conversarem em pares são n(n−1)/2 chaves: 10 pessoas → 45 · 100 pessoas → 4.950.</text>
          </svg>
        </Diagram>
        <Table
          head={["Algoritmo", "Para que serve", "Nota"]}
          rows={[
            [<><b>AES</b> (128/256 bits)</>, "Padrão de fato para cifrar dados: arquivos, discos, TLS.", <>Usado em modos autenticados como <b>GCM</b>, que também detectam alteração.</>],
            [<b>ChaCha20-Poly1305</b>, "Alternativa moderna ao AES, rápida mesmo sem hardware dedicado (celulares).", "Presente no TLS 1.3 e no SSH."],
            [<><b>HMAC</b> (ex.: HMAC-SHA-256)</>, "Não cifra: prova integridade e autoria entre quem divide o segredo.", "É como as requisições da AWS (SigV4) são assinadas com a secret key."],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>O limite da simétrica não é a segurança, é a logística.</b> Para duas pessoas que nunca se encontraram, como combinar a chave sem que alguém a copie no caminho? E com muitas pessoas, o número de chaves explode. A criptografia assimétrica existe para resolver isso.</Callout>
      </Section>
      <Section id="asymmetric" title={"Chaves pública e privada"}>
        <p>Aqui a chave vem em <b>par</b>, gerado junto por uma conta matemática: o que uma chave faz, só a outra desfaz. Uma você espalha (<b>pública</b>); a outra nunca sai de você (<b>privada</b>). Descobrir a privada a partir da pública é inviável com os tamanhos usados hoje.</p>
        <Callout tone="good" icon="check"><b>Analogia do cadeado.</b> Você fabrica milhares de cadeados abertos idênticos e os distribui (chave pública). Qualquer um pode fechar um cadeado numa caixa e mandar para você. Só você tem a chave que abre (chave privada). Quem distribuiu cadeados não perdeu segurança alguma.</Callout>
        <Diagram minWidth={560} caption={"Pense num cadeado aberto: Bob distribui cópias à vontade, qualquer um fecha, mas só ele tem a chave que abre."}>
          <svg viewBox="0 0 700 288" role="img" aria-label="Par de chaves: Alice cifra com a pública, só Bob decifra com a privada">
            <rect x="20" y="20" width="210" height="132" rx="4" className="ln" />
            <text x="125" y="42" textAnchor="middle" style={{ fontWeight: "600" }}>Bob</text>
            <circle cx="45" cy="78" r="8" className="fill" />
            <circle cx="45" cy="78" r="3" className="inv" />
            <path d="M53 78L75 78M69 78L69 84M75 78L75 84" className="ln" />
            <text x="94" y="82" textAnchor="start">privada: só Bob</text>
            <circle cx="45" cy="122" r="8" className="brandfill" />
            <circle cx="45" cy="122" r="3" className="inv" />
            <path d="M53 122L75 122M69 122L69 128M75 122L75 128" className="ln" />
            <text x="94" y="126" textAnchor="start">pública: para todos</text>
            <rect x="470" y="20" width="210" height="132" rx="4" className="ln" />
            <text x="575" y="42" textAnchor="middle" style={{ fontWeight: "600" }}>Alice</text>
            <path d="M490 62L511 62L520 71L520 100L490 100Z" className="ln fillsoft" />
            <path d="M496 78L514 78" className="ln" />
            <path d="M496 86L514 86" className="ln" />
            <path d="M496 94L514 94" className="ln" />
            <text x="530" y="85" textAnchor="start">quer enviar "oi"</text>
            <circle cx="495" cy="126" r="8" className="brandfill" />
            <circle cx="495" cy="126" r="3" className="inv" />
            <path d="M503 126L525 126M519 126L519 132M525 126L525 132" className="ln" />
            <text x="544" y="130" className="mut" textAnchor="start">cópia da pública</text>
            <path d="M232 122L468 122" className="ln dash" />
            <path d="M460.0 125.6L468 122L460.0 118.4" className="ln" />
            <circle cx="350" cy="98" r="9" className="ln fillsoft" />
            <text x="350" y="102" className="mono" textAnchor="middle">1</text>
            <text x="350" y="82" textAnchor="middle">envia a chave pública</text>
            <text x="350" y="144" className="mut" textAnchor="middle">(por qualquer canal, até público)</text>
            <path d="M575 154L575 232L125 232L125 156" className="ln" />
            <path d="M128.6 164.0L125 156L121.4 164.0" className="ln" />
            <rect x="310" y="218" width="130" height="28" rx="4" className="ln fillsoft" />
            <text x="375.0" y="236.5" className="mono" textAnchor="middle">x9#kQ2…</text>
            <circle cx="575" cy="190" r="9" className="ln fillsoft" />
            <text x="575" y="194" className="mono" textAnchor="middle">2</text>
            <text x="562" y="194" textAnchor="end">cifra com a pública de Bob</text>
            <circle cx="125" cy="190" r="9" className="ln fillsoft" />
            <text x="125" y="194" className="mono" textAnchor="middle">3</text>
            <text x="138" y="194" textAnchor="start">só a privada de Bob decifra</text>
            <rect x="565" y="160" width="20" height="15" rx="2" className="ln fillsoft" />
            <path d="M569 160L569 154A6 6 0 0 1 581 154L581 160" className="ln" />
            <text x="375" y="272" className="mut" textAnchor="middle">Quem intercepta o canal (Eve) vê só x9#kQ2…: a pública não decifra o que ela mesma cifrou.</text>
          </svg>
        </Diagram>
        <h3>Dois usos opostos do mesmo par</h3>
        <Diagram minWidth={560} caption={"O mesmo par serve a duas coisas opostas: a pública protege o que vai para o dono; a privada prova que algo veio do dono."}>
          <svg viewBox="0 0 700 252" role="img" aria-label="Os dois usos de um par de chaves">
            <rect x="10" y="10" width="330" height="232" rx="4" className="ln" />
            <text x="175" y="34" textAnchor="middle" style={{ fontWeight: "600" }}>Cifrar → sigilo</text>
            <rect x="360" y="10" width="330" height="232" rx="4" className="ln" />
            <text x="525" y="34" textAnchor="middle" style={{ fontWeight: "600" }}>Assinar → autenticidade</text>
            <rect x="30" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="80.0" y="79.5" textAnchor="middle">Remetente</text>
            <rect x="220" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="270.0" y="79.5" textAnchor="middle">Destinatário</text>
            <path d="M130 75L220 75" className="ln" />
            <path d="M212.0 78.6L220 75L212.0 71.4" className="ln" />
            <text x="175" y="68" className="mut" textAnchor="middle">texto cifrado</text>
            <circle cx="67" cy="130" r="8" className="brandfill" />
            <circle cx="67" cy="130" r="3" className="inv" />
            <path d="M75 130L97 130M91 130L91 136M97 130L97 136" className="ln" />
            <text x="80" y="156" className="mut" textAnchor="middle">pública do</text>
            <text x="80" y="172" className="mut" textAnchor="middle">destinatário</text>
            <circle cx="257" cy="130" r="8" className="fill" />
            <circle cx="257" cy="130" r="3" className="inv" />
            <path d="M265 130L287 130M281 130L281 136M287 130L287 136" className="ln" />
            <text x="270" y="156" className="mut" textAnchor="middle">privada do</text>
            <text x="270" y="172" className="mut" textAnchor="middle">destinatário</text>
            <path d="M80 118L80 96" className="ln" />
            <path d="M270 118L270 96" className="ln" />
            <text x="175" y="205" textAnchor="middle">Qualquer um cifra;</text>
            <text x="175" y="224" textAnchor="middle">só o dono da privada lê.</text>
            <rect x="380" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="430.0" y="79.5" textAnchor="middle">Autor</text>
            <rect x="570" y="56" width="100" height="38" rx="4" className="ln" />
            <text x="620.0" y="79.5" textAnchor="middle">Verificador</text>
            <path d="M480 75L570 75" className="ln" />
            <path d="M562.0 78.6L570 75L562.0 71.4" className="ln" />
            <text x="525" y="68" className="mut" textAnchor="middle">mensagem</text>
            <text x="525" y="91" className="mut" textAnchor="middle">+ assinatura</text>
            <circle cx="417" cy="130" r="8" className="fill" />
            <circle cx="417" cy="130" r="3" className="inv" />
            <path d="M425 130L447 130M441 130L441 136M447 130L447 136" className="ln" />
            <text x="430" y="156" className="mut" textAnchor="middle">privada</text>
            <text x="430" y="172" className="mut" textAnchor="middle">do autor</text>
            <circle cx="607" cy="130" r="8" className="brandfill" />
            <circle cx="607" cy="130" r="3" className="inv" />
            <path d="M615 130L637 130M631 130L631 136M637 130L637 136" className="ln" />
            <text x="620" y="156" className="mut" textAnchor="middle">pública</text>
            <text x="620" y="172" className="mut" textAnchor="middle">do autor</text>
            <path d="M430 118L430 96" className="ln" />
            <path d="M620 118L620 96" className="ln" />
            <text x="525" y="205" textAnchor="middle">Qualquer um verifica;</text>
            <text x="525" y="224" textAnchor="middle">só o dono da privada assina.</text>
          </svg>
        </Diagram>
        <Table
          head={["", "Cifrar", "Assinar"]}
          rows={[
            [<><b>Quem usa a privada</b></>, "Destinatário, para ler", "Autor, para assinar"],
            [<><b>Quem usa a pública</b></>, "Qualquer um, para cifrar", "Qualquer um, para verificar"],
            [<><b>Garante</b></>, "Sigilo", "Autenticidade e integridade"],
          ]}
        />
        <Callout tone="warn" icon="alert"><b>Cuidado com o ditado “assinar é cifrar com a privada”.</b> É uma simplificação que funciona no RSA clássico, mas assinatura e cifragem são operações diferentes (e algoritmos como Ed25519 só assinam). Pense em dois papéis: <b>a privada prova autoria; a pública protege o envio ao dono</b>.</Callout>
        <h3>Algoritmos que você encontra</h3>
        <Table
          head={["Algoritmo", "Faz", "Onde aparece", "Nota"]}
          rows={[
            [<b>RSA</b>, "Cifrar e assinar", <>Certificados mais antigos, chaves SSH antigas, JWT <code>RS256</code></>, "Chaves grandes (2048 bits no mínimo; 3072 ou 4096 para folga). Mais lento e mais pesado."],
            [<><b>ECDSA</b> (curvas P-256, P-384)</>, "Assinar", <>Certificados TLS, JWT <code>ES256</code>, passkeys</>, "Chaves curtas para a mesma força que o RSA."],
            [<b>Ed25519</b>, "Assinar", "Chaves SSH modernas, assinatura de commits", "Rápido, chaves pequenas e poucas armadilhas de uso. Padrão recomendado para novas chaves SSH."],
            [<><b>X25519</b> / ECDH</>, "Acordar uma chave compartilhada", "TLS 1.3, SSH", "Não cifra nem assina: só produz o segredo comum (veja a seção de TLS)."],
          ]}
        />
      </Section>
      <Section id="signature" title={"Assinatura digital passo a passo"}>
        <p>A assinatura responde duas perguntas ao mesmo tempo: <i>quem</i> fez isto e <i>se algo mudou</i> desde então. Ela não esconde o conteúdo; qualquer um lê, e qualquer um confere.</p>
        <Diagram minWidth={560} caption={"Na prática assina-se o hash do documento (curto e de tamanho fixo), não o documento inteiro. Detalhes variam por algoritmo; a ideia é esta."}>
          <svg viewBox="0 0 700 286" role="img" aria-label="Assinatura digital: assinar e verificar">
            <text x="20" y="20" className="mut" textAnchor="start">ASSINAR (o autor, com a chave privada)</text>
            <rect x="15" y="32" width="90" height="44" rx="4" className="ln" />
            <text x="60.0" y="58.5" textAnchor="middle">documento</text>
            <path d="M105 54L135 54" className="ln" />
            <path d="M127.0 57.6L135 54L127.0 50.4" className="ln" />
            <rect x="135" y="32" width="80" height="44" rx="4" className="ln fillsoft" />
            <text x="175.0" y="50.0" textAnchor="middle">hash</text>
            <text x="175.0" y="67.0" className="mono" textAnchor="middle">SHA-256</text>
            <path d="M215 54L245 54" className="ln" />
            <path d="M237.0 57.6L245 54L237.0 50.4" className="ln" />
            <rect x="245" y="32" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="50.0" textAnchor="middle">resumo</text>
            <text x="285.0" y="67.0" className="mono" textAnchor="middle">H</text>
            <path d="M325 54L355 54" className="ln" />
            <path d="M347.0 57.6L355 54L347.0 50.4" className="ln" />
            <rect x="355" y="32" width="150" height="44" rx="4" className="ln fillsoft" />
            <text x="430" y="50" textAnchor="middle">assina com a</text>
            <text x="430" y="68" textAnchor="middle">chave PRIVADA</text>
            <path d="M505 54L535 54" className="ln" />
            <path d="M527.0 57.6L535 54L527.0 50.4" className="ln" />
            <rect x="535" y="32" width="150" height="44" rx="4" className="ln brandfill" />
            <text x="610.0" y="50.0" textAnchor="middle">assinatura</text>
            <text x="610.0" y="67.0" className="mono" textAnchor="middle">S</text>
            <text x="20" y="118" className="mut" textAnchor="start">VERIFICAR (qualquer um, com a chave pública)</text>
            <rect x="15" y="130" width="90" height="44" rx="4" className="ln" />
            <text x="60.0" y="148.0" textAnchor="middle">documento</text>
            <text x="60.0" y="165.0" textAnchor="middle">recebido</text>
            <path d="M105 152L135 152" className="ln" />
            <path d="M127.0 155.6L135 152L127.0 148.4" className="ln" />
            <rect x="135" y="130" width="80" height="44" rx="4" className="ln fillsoft" />
            <text x="175.0" y="148.0" textAnchor="middle">hash</text>
            <text x="175.0" y="165.0" className="mono" textAnchor="middle">SHA-256</text>
            <path d="M215 152L245 152" className="ln" />
            <path d="M237.0 155.6L245 152L237.0 148.4" className="ln" />
            <rect x="245" y="130" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="148.0" textAnchor="middle">resumo</text>
            <text x="285.0" y="165.0" className="mono" textAnchor="middle">H₁</text>
            <rect x="535" y="205" width="150" height="44" rx="4" className="ln brandfill" />
            <text x="610.0" y="223.0" textAnchor="middle">assinatura</text>
            <text x="610.0" y="240.0" className="mono" textAnchor="middle">S</text>
            <path d="M535 227L505 227" className="ln" />
            <path d="M513.0 223.4L505 227L513.0 230.6" className="ln" />
            <rect x="355" y="205" width="150" height="44" rx="4" className="ln fillsoft" />
            <text x="430" y="223" textAnchor="middle">abre com a</text>
            <text x="430" y="241" textAnchor="middle">chave PÚBLICA</text>
            <path d="M355 227L325 227" className="ln" />
            <path d="M333.0 223.4L325 227L333.0 230.6" className="ln" />
            <rect x="245" y="205" width="80" height="44" rx="4" className="ln" />
            <text x="285.0" y="223.0" textAnchor="middle">resumo</text>
            <text x="285.0" y="240.0" className="mono" textAnchor="middle">H₂</text>
            <path d="M285 174L285 205" className="ln" />
            <path d="M281.4 197.0L285 205L288.6 197.0" className="ln" />
            <path d="M288.6 182.0L285 174L281.4 182.0" className="ln" />
            <text x="300" y="196" className="mono" textAnchor="start">=?</text>
            <circle cx="30" cy="221" r="10" className="brandfill" />
            <path d="M25 221L29 225L36 216" className="ln" />
            <text x="48" y="217" textAnchor="start">iguais: válido</text>
            <text x="48" y="235" className="mut" textAnchor="start">autor certo, texto intacto</text>
            <text x="20" y="272" className="mut" textAnchor="start">Se 1 bit do documento mudar, H₁ ≠ H₂ e a verificação falha. Sem a privada, ninguém gera uma S válida.</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><b>Em um JWT</b>: o emissor assina cabeçalho + payload com a chave privada (<code>RS256</code>, <code>ES256</code>); quem recebe baixa as chaves públicas do emissor (o endereço <code>jwks_uri</code> do documento de descoberta do OIDC) e verifica. Foi assim que a AWS confiou no token do GitHub Actions.</li>
          <li><b>Em um commit do Git</b>: você assina com a privada; o GitHub mostra “Verified” ao conferir com a pública cadastrada na sua conta.</li>
          <li><b>Em um certificado TLS</b>: a autoridade certificadora assina “esta chave pública pertence a este domínio”.</li>
        </ul>
        <Callout tone="warn" icon="alert"><b>HS256 é outra coisa.</b> No JWT <code>HS256</code> existe um segredo compartilhado (HMAC): quem verifica também consegue forjar. Com <code>RS256</code>/<code>ES256</code>, só o dono da privada assina. Sempre fixe o algoritmo esperado ao verificar (RFC 8725).</Callout>
      </Section>
      <Section id="tls" title={"Juntando tudo: troca de chaves, TLS e certificados"}>
        <p>A assimétrica é mais lenta e só trata blocos pequenos; a simétrica é rápida e cuida de qualquer volume, mas precisa de uma chave combinada. A solução é <b>híbrida</b>: use a assimétrica para <i>combinar</i> uma chave e a simétrica para <i>proteger os dados</i>. É assim no HTTPS e no SSH.</p>
        <h3>Acordar uma chave em público: Diffie-Hellman</h3>
        <p>Duas partes trocam mensagens à vista de todos e, no fim, cada uma calcula o <b>mesmo segredo</b> sem que ele tenha trafegado. A analogia das tintas mostra a intuição: misturar é fácil, desmisturar é inviável.</p>
        <Diagram minWidth={560} caption={"Misturar é fácil, desmisturar é inviável. Na prática a \"tinta\" é matemática (curvas elípticas, como no X25519), e o resultado vira a chave simétrica da sessão."}>
          <svg viewBox="0 0 700 366" role="img" aria-label="Troca de chaves de Diffie-Hellman com cores">
            <circle cx="70" cy="28" r="7" className="ln fillsoft" />
            <path d="M57 52C57 37 83 37 83 52Z" className="ln fillsoft" />
            <text x="70" y="78" textAnchor="middle">Alice</text>
            <circle cx="630" cy="28" r="7" className="ln fillsoft" />
            <path d="M617 52C617 37 643 37 643 52Z" className="ln fillsoft" />
            <text x="630" y="78" textAnchor="middle">Bob</text>
            <circle cx="350" cy="40" r="16" fill="#f2c94c" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="350" y="72" className="mut" textAnchor="middle">cor pública (todos veem)</text>
            <circle cx="70" cy="112" r="16" fill="#d9534f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="70" y="144" className="mut" textAnchor="middle">segredo de Alice</text>
            <circle cx="630" cy="112" r="16" fill="#4a7fd6" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <text x="630" y="144" className="mut" textAnchor="middle">segredo de Bob</text>
            <rect x="175" y="96" width="350" height="118" rx="4" className="ln dash fillsoft" />
            <text x="350" y="116" className="mut" textAnchor="middle">canal público: Eve vê tudo o que passa aqui</text>
            <circle cx="205" cy="150" r="16" fill="#f0883e" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M227 150L495 150" className="ln" />
            <path d="M487.0 153.6L495 150L487.0 146.4" className="ln" />
            <text x="360" y="143" textAnchor="middle">amarelo + vermelho = laranja</text>
            <circle cx="495" cy="188" r="16" fill="#4caf6a" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M473 188L205 188" className="ln" />
            <path d="M213.0 184.4L205 188L213.0 191.6" className="ln" />
            <text x="340" y="206" textAnchor="middle">amarelo + azul = verde</text>
            <circle cx="70" cy="300" r="16" fill="#8a6a4f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <circle cx="630" cy="300" r="16" fill="#8a6a4f" stroke="currentColor" strokeWidth="1.2" style={{ stroke: "var(--fg-strong)" }} />
            <path d="M175 200L92 286" className="ln" />
            <path d="M95.0 277.7L92 286L100.1 282.7" className="ln" />
            <path d="M525 160L608 286" className="ln" />
            <path d="M600.6 281.3L608 286L606.6 277.3" className="ln" />
            <text x="70" y="336" className="mut" textAnchor="middle">verde + vermelho</text>
            <text x="630" y="336" className="mut" textAnchor="middle">laranja + azul</text>
            <text x="350" y="284" textAnchor="middle" style={{ fontWeight: "600" }}>mesmo marrom nos dois lados</text>
            <text x="350" y="304" textAnchor="middle" style={{ fontWeight: "600" }}>= segredo compartilhado</text>
            <text x="350" y="336" className="mut" textAnchor="middle">Eve tem amarelo, laranja e verde,</text>
            <text x="350" y="354" className="mut" textAnchor="middle">mas não consegue "desmisturar" para achar o vermelho ou o azul.</text>
          </svg>
        </Diagram>
        <Callout tone="good" icon="check"><b>Chaves efêmeras e sigilo futuro.</b> No TLS 1.3 e no SSH as chaves desse acordo são geradas para a conexão e descartadas depois (<i>forward secrecy</i>). Se alguém roubar a chave privada do servidor no futuro, as conversas antigas gravadas continuam ilegíveis.</Callout>
        <h3>O handshake do TLS 1.3</h3>
        <Diagram minWidth={560} caption={"Sequência simplificada do TLS 1.3. A criptografia assimétrica só faz o acordo de chave e a prova de identidade; os dados passam pela simétrica."}>
          <svg viewBox="0 0 700 380" role="img" aria-label="Handshake TLS 1.3: assimétrico para combinar, simétrico para o resto">
            <rect x="55" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="110.0" y="28.5" textAnchor="middle">Navegador</text>
            <rect x="535" y="8" width="110" height="32" rx="4" className="ln" />
            <text x="590.0" y="28.5" textAnchor="middle">Servidor</text>
            <path d="M110 40L110 372" className="ln dash" />
            <path d="M590 40L590 372" className="ln dash" />
            <rect x="20" y="56" width="660" height="188" rx="4" className="brandfill" />
            <text x="32" y="74" className="mut" textAnchor="start">Handshake: criptografia assimétrica</text>
            <rect x="20" y="264" width="660" height="100" rx="4" className="ln fillsoft" />
            <text x="32" y="282" className="mut" textAnchor="start">Dados: criptografia simétrica (rápida)</text>
            <path d="M114 100L586 100" className="ln" />
            <path d="M578.0 103.6L586 100L578.0 96.4" className="ln" />
            <text x="350" y="88" textAnchor="middle">① ClientHello</text>
            <text x="350" y="116" className="mut" textAnchor="middle">algoritmos aceitos + metade pública efêmera (X25519)</text>
            <path d="M586 150L114 150" className="ln" />
            <path d="M122.0 146.4L114 150L122.0 153.6" className="ln" />
            <text x="350" y="138" textAnchor="middle">② ServerHello</text>
            <text x="350" y="166" className="mut" textAnchor="middle">algoritmo escolhido + metade pública do servidor</text>
            <text x="110" y="178" textAnchor="middle"></text>
            <text x="350" y="190" textAnchor="middle" style={{ fontWeight: "600" }}>os dois calculam o mesmo segredo e derivam as chaves de sessão</text>
            <path d="M586 222L114 222" className="ln" />
            <path d="M122.0 218.4L114 222L122.0 225.6" className="ln" />
            <text x="350" y="210" textAnchor="middle">③ Certificado + assinatura</text>
            <text x="350" y="238" className="mut" textAnchor="middle">(já cifrado) prova que o servidor é dono do domínio</text>
            <path d="M114 308L586 308" className="ln" />
            <path d="M578.0 311.6L586 308L578.0 304.4" className="ln" />
            <text x="350" y="296" textAnchor="middle">④ Dados HTTP cifrados</text>
            <text x="350" y="324" className="mut" textAnchor="middle">AES-GCM ou ChaCha20-Poly1305, com a chave de sessão</text>
            <path d="M586 340L114 340" className="ln" />
            <path d="M122.0 336.4L114 340L122.0 343.6" className="ln" />
            <text x="350" y="356" className="mut" textAnchor="middle">← resposta cifrada com a mesma chave de sessão</text>
          </svg>
        </Diagram>
        <h3>Certificados: quem garante que a chave pública é do site?</h3>
        <p>Se o seu navegador aceitasse qualquer chave pública enviada pelo servidor, um intermediário poderia mandar a dele. O <b>certificado</b> resolve: é a chave pública do site <b>mais o nome do domínio</b>, assinada por uma autoridade (CA) em quem o sistema já confia. As raízes confiáveis vêm instaladas no sistema operacional e no navegador.</p>
        <Diagram minWidth={560} caption={"Um certificado é uma chave pública com um nome, assinada por alguém em quem o navegador já confia. A confiança desce a cadeia."}>
          <svg viewBox="0 0 700 252" role="img" aria-label="Cadeia de confiança dos certificados">
            <rect x="20" y="18" width="372" height="56" rx="4" className="brandfill" />
            <text x="206" y="42" textAnchor="middle" style={{ fontWeight: "600" }}>Autoridade raiz (Root CA)</text>
            <text x="206" y="62" className="mut" textAnchor="middle">já vem instalada no sistema/navegador</text>
            <rect x="20" y="100" width="372" height="56" rx="4" className="ln fillsoft" />
            <text x="206" y="124" textAnchor="middle" style={{ fontWeight: "600" }}>Autoridade intermediária</text>
            <text x="206" y="144" className="mut" textAnchor="middle">assinada pela raiz</text>
            <rect x="20" y="182" width="372" height="56" rx="4" className="ln" />
            <text x="206" y="206" textAnchor="middle" style={{ fontWeight: "600" }}>Certificado do site: baselarte.com</text>
            <text x="206" y="226" className="mut" textAnchor="middle">assinado pela intermediária · traz a chave pública</text>
            <path d="M206 74L206 100" className="ln" />
            <path d="M202.4 92.0L206 100L209.6 92.0" className="ln" />
            <text x="220" y="92" className="mut" textAnchor="start">assina</text>
            <path d="M206 156L206 182" className="ln" />
            <path d="M202.4 174.0L206 182L209.6 174.0" className="ln" />
            <text x="220" y="174" className="mut" textAnchor="start">assina</text>
            <text x="420" y="40" textAnchor="start" style={{ fontWeight: "600" }}>O navegador confere:</text>
            <circle cx="430" cy="62" r="9" className="ln fillsoft" />
            <text x="430" y="66" className="mono" textAnchor="middle">1</text>
            <text x="448" y="58" textAnchor="start">cada assinatura da cadeia,</text>
            <text x="448" y="74" className="mut" textAnchor="start">até uma raiz confiável</text>
            <circle cx="430" cy="106" r="9" className="ln fillsoft" />
            <text x="430" y="110" className="mono" textAnchor="middle">2</text>
            <text x="448" y="102" textAnchor="start">o nome no certificado =</text>
            <text x="448" y="118" className="mut" textAnchor="start">o domínio acessado</text>
            <circle cx="430" cy="150" r="9" className="ln fillsoft" />
            <text x="430" y="154" className="mono" textAnchor="middle">3</text>
            <text x="448" y="154" textAnchor="start">a data: dentro da validade</text>
            <circle cx="430" cy="194" r="9" className="ln fillsoft" />
            <text x="430" y="198" className="mono" textAnchor="middle">4</text>
            <text x="448" y="190" textAnchor="start">depois: o servidor assina o handshake</text>
            <text x="448" y="206" className="mut" textAnchor="start">com a privada do certificado</text>
          </svg>
        </Diagram>
        <Callout tone="warn" icon="alert"><b>O cadeado do navegador prova o canal, não a honestidade.</b> Ele diz que você fala com quem controla o domínio e que ninguém lê no meio. Um site de golpe também pode ter um certificado válido para o domínio dele.</Callout>
      </Section>
      <Section id="where" title={"Onde isso aparece no dia a dia"}>
        <Table
          head={["Situação", "Quem tem a privada", "O que a pública faz", "Parte simétrica"]}
          rows={[
            [<><b>HTTPS</b></>, "O servidor (chave do certificado)", "Navegador verifica a assinatura do handshake", "Chave de sessão do TLS (AES-GCM, ChaCha20)"],
            [<><b>SSH</b></>, "Você (login) e o servidor (host key)", <><code>authorized_keys</code> e <code>known_hosts</code></>, "Túnel cifrado da sessão"],
            [<><b>Passkey / app de banco</b></>, "O chip do seu aparelho", "O servidor verifica a assinatura do desafio", "Sessão (cookie/token) e TLS"],
            [<><b>JWT / OIDC</b></>, "O provedor de identidade (GitHub, Google)", "Quem recebe o token baixa a pública (JWKS) e verifica", "TLS na chamada"],
            [<><b>Commit assinado</b></>, "Você", "GitHub verifica e mostra “Verified”", "—"],
            [<><b>Chaves de acesso da AWS</b></>, <>Ninguém: é <b>simétrico</b> (HMAC). A secret key fica em dois lugares.</>, "—", "A requisição é assinada com HMAC-SHA-256 (SigV4)"],
          ]}
        />
        <Callout tone="good" icon="check"><b>Por que o OIDC do GitHub Actions é melhor que chaves da AWS.</b> As chaves de acesso são simétricas: quem as copia assina como você, para sempre. No OIDC, o GitHub assina cada token com uma chave privada que só ele tem, e a AWS só precisa da pública para verificar; o job recebe credenciais temporárias que expiram. Veja <a href="/notas/github-aws-oidc/">GitHub para AWS com OIDC</a>.</Callout>
      </Section>
      <Section id="glossary" title={"Glossário"}>
        <Table
          head={["Termo", "O que é"]}
          rows={[
            [<b>Criptografia</b>, "Técnicas matemáticas para proteger sigilo, integridade e autenticidade."],
            [<b>Texto claro / texto cifrado</b>, "O dado legível e o dado embaralhado pela cifra."],
            [<b>Chave</b>, "Um número (ou bytes) que controla a cifra. Quem tem a chave certa desfaz o embaralhamento."],
            [<b>Chave pública / privada</b>, "As duas metades de um par. A pública pode ser distribuída; a privada nunca sai do dono."],
            [<b>Hash / resumo (digest)</b>, "Impressão digital de tamanho fixo, sem volta. Ex.: SHA-256."],
            [<b>Assinatura digital</b>, "Prova de autoria e integridade feita com a chave privada e conferida com a pública."],
            [<b>Certificado (X.509)</b>, "Chave pública + identidade (domínio), assinada por uma CA."],
            [<><b>CA</b> (autoridade certificadora)</>, "Entidade em quem o sistema confia para assinar certificados. Ex.: Let’s Encrypt."],
            [<b>Desafio (nonce)</b>, "Valor aleatório usado uma única vez para que a resposta não possa ser reaproveitada."],
            [<b>Chave efêmera / forward secrecy</b>, "Chave criada só para uma conexão. Garante que roubar chaves futuras não decifra conversas passadas."],
            [<b>Impressão digital (fingerprint)</b>, <>Hash curto de uma chave pública, para conferir a olho. Ex.: <code>SHA256:…</code> no SSH.</>],
            [<b>Passphrase</b>, "Senha que cifra o arquivo da chave privada no disco."],
            [<b>Enclave / TPM / StrongBox</b>, "Hardware seguro que guarda a chave privada e assina sem entregá-la."],
            [<b>Sessão</b>, "Estado “você já entrou”, guardado no servidor ou num token, que dispensa nova prova a cada requisição."],
            [<b>TOFU</b>, <><i>Trust on first use</i>: confiar na chave vista na primeira conexão e alertar se mudar depois.</>],
          ]}
        />
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
