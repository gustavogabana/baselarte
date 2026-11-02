import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "cloudflare",
  title: { en: "Cloudflare: domain, R2 and SSL", pt: "Cloudflare: domínio, R2 e SSL" },
  seo: {
    title: { en: "Cloudflare: Domain, R2, SSL and AWS ALB Notes", pt: "Cloudflare: Notas de Domínio, R2, SSL e ALB da AWS" },
    description: { en: "Buy and configure a domain on Cloudflare, use R2 with presigned URLs, CDN and SSL, and take HTTPS all the way to an AWS ALB, based on the official docs.", pt: "Compre e configure um domínio na Cloudflare, use o R2 com URLs pré-assinadas, CDN e SSL, e leve o HTTPS até um ALB da AWS, com base na documentação oficial." },
  },
  summary: "buying and configuring a domain, R2 with presigned URLs (private/public buckets, CDN), SSL certificates and HTTPS to an AWS ALB, based on the official docs.",
  kicker: { en: "Cloudflare", pt: "Cloudflare" },
  heroTitle: { en: <>Domain, storage and SSL, <em>all the way to AWS.</em></>, pt: <>Domínio, storage e SSL, <em>até a AWS.</em></> },
  heroLede: { en: "Buy and configure a domain, serve files from R2 with presigned URLs and a CDN, and keep every hop HTTPS up to your AWS load balancer.", pt: "Compre e configure um domínio, sirva arquivos do R2 com URLs pré-assinadas e CDN, e mantenha cada trecho em HTTPS até o seu load balancer na AWS." },
  published: "2026-10-13",
  updated: "2026-10-25",
  toc: [
    {
      items: [
        { id: "overview", title: <T pt="Visão geral" en="Overview" /> },
        { id: "buy", title: <T pt="1. Comprar um domínio" en="1. Buy a domain" /> },
        { id: "dns", title: <T pt="2. Configurar o domínio e o DNS" en="2. Configure the domain and DNS" /> },
        { id: "ssl", title: <T pt="3. Certificado SSL e CDN" en="3. SSL certificate and CDN" /> },
        { id: "r2", title: <T pt="4. R2: bucket, chaves e acesso" en="4. R2: bucket, keys and access" /> },
        { id: "presigned", title: <T pt="5. URLs pré-assinadas: o que são e como funcionam" en="5. Presigned URLs: what they are and how they work" /> },
        { id: "browser", title: <T pt="6. Como o navegador renderiza foto e vídeo" en="6. How the browser renders photos and video" /> },
        { id: "variables", title: <T pt="7. Variáveis, valores e chaves" en="7. Variables, values and keys" /> },
        { id: "checklist", title: <T pt="8. O que cada recurso precisa para funcionar" en="8. What each feature needs to work" /> },
        { id: "alb", title: <T pt="9. Certificado no ALB: HTTPS até a AWS" en="9. Certificate on the ALB: HTTPS all the way to AWS" /> },
        { id: "problems", title: <T pt="10. Problemas comuns" en="10. Common problems" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="overview" title={<T pt="Visão geral" en="Overview" />}>
        <p><T pt="A Cloudflare entra em três papéis neste desenho: registrar do domínio e DNS, CDN e proxy na frente da sua aplicação, e storage de arquivos (R2). A AWS continua rodando a aplicação atrás de um ALB. O objetivo é que toda a viagem seja HTTPS." en="Cloudflare plays three roles in this layout: domain registrar and DNS, a CDN and proxy in front of your application, and file storage (R2). AWS keeps running the application behind an ALB. The goal is for the whole trip to be HTTPS." /></p>
        <ol className="ds-steps">
          <li><T pt={<><em>Navegador → Cloudflare:</em> o navegador abre <code>https://app.exemplo.com</code>. A Cloudflare responde com o certificado de borda (Universal SSL).</>} en={<><em>Browser → Cloudflare:</em> the browser opens <code>https://app.example.com</code>. Cloudflare answers with its edge certificate (Universal SSL).</>} /></li>
          <li><T pt={<><em>Cloudflare → ALB:</em> com o modo <em>Full (strict)</em>, a Cloudflare abre uma conexão HTTPS com o ALB e valida o certificado de origem que você instalou nele.</>} en={<><em>Cloudflare → ALB:</em> with <em>Full (strict)</em> mode, Cloudflare opens an HTTPS connection to the ALB and validates the origin certificate you installed on it.</>} /></li>
          <li><T pt={<><em>Arquivos:</em> o navegador baixa e envia mídia direto do R2, por URL pré-assinada (bucket privado) ou por um domínio público com CDN (bucket público).</>} en={<><em>Files:</em> the browser downloads and uploads media straight from R2, through a presigned URL (private bucket) or a public custom domain with CDN (public bucket).</>} /></li>
        </ol>
        <Callout tone="use" icon="check"><T pt="As seções seguem a ordem de montagem: domínio, DNS, SSL, R2, URLs pré-assinadas, como o navegador renderiza a mídia, variáveis, e por fim o certificado no ALB." en="The sections follow the build order: domain, DNS, SSL, R2, presigned URLs, how the browser renders media, variables, and finally the certificate on the ALB." /></Callout>
      </Section>
      <Section id="buy" title={<T pt="1. Comprar um domínio" en="1. Buy a domain" />}>
        <p><T pt={<>No painel da Cloudflare: <em>Register domains</em>. O caminho é:</>} en={<>In the Cloudflare dashboard: <em>Register domains</em>. The path is:</>} /></p>
        <ol className="ds-steps">
          <li><T pt="Pesquise o nome ou palavras-chave. Domínios que não aparecem nas sugestões não estão disponíveis." en="Search for a name or keywords. Domains missing from the suggestions are unavailable." /></li>
          <li><T pt={<>Clique em <em>Purchase</em>; a Cloudflare faz uma última checagem de disponibilidade.</>} en={<>Click <em>Purchase</em>; Cloudflare runs a final availability check.</>} /></li>
          <li><T pt="Escolha o prazo (a maioria das TLDs vai até dez anos). A renovação automática vem ligada e pode ser desligada depois." en="Pick the term (most TLDs go up to ten years). Auto-renew is on by default and can be turned off later." /></li>
          <li><T pt="Preencha os contatos (registrante, administrativo, técnico e cobrança) e a forma de pagamento." en="Fill in the contacts (registrant, admin, technical and billing) and the payment method." /></li>
          <li><T pt={<>Revise os contratos e clique em <em>Complete purchase</em>. O registro leva até cerca de 30 segundos.</>} en={<>Review the agreements and click <em>Complete purchase</em>. Registration takes up to about 30 seconds.</>} /></li>
        </ol>
        <h3><T pt="Requisitos e pegadinhas" en="Requirements and gotchas" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Precisa de um <em>e-mail verificado</em> na conta e de uma forma de pagamento.</>} en={<>You need a <em>verified email</em> on the account and a payment method.</>} /></li>
          <li><T pt="Os contatos aceitam só caracteres ASCII, e devem ser completos e corretos: dados inexatos podem levar à suspensão ou cancelamento." en="Contacts accept ASCII characters only, and must be complete and accurate: inaccurate details can lead to suspension or cancellation." /></li>
          <li><T pt={<><em>Verifique o e-mail do registrante.</em> Se a verificação ficar pendente ou expirar, a ICANN coloca o domínio em <em>hold</em> e os nameservers viram servidores de estacionamento até a verificação ser concluída.</>} en={<><em>Verify the registrant email.</em> If verification stays pending or expires, ICANN places a hold on the domain and the nameservers are replaced with parking nameservers until verification is completed.</>} /></li>
          <li><T pt="Domínios registrados lá usam os nameservers da Cloudflare, e não é possível trocá-los por outro provedor de DNS enquanto estiver no Registrar." en="Domains registered there use Cloudflare nameservers, and you cannot switch to another DNS provider’s nameservers while using Registrar." /></li>
          <li><T pt="Nomes internacionalizados (IDN, com acentos) não são suportados. A Cloudflare recomenda ligar o DNSSEC." en="Internationalised domain names (IDNs, with accents) are not supported. Cloudflare recommends enabling DNSSEC." /></li>
        </ul>
      </Section>
      <Section id="dns" title={<T pt="2. Configurar o domínio e o DNS" en="2. Configure the domain and DNS" />}>
        <p><T pt="Se você comprou pela Cloudflare, o domínio já usa os nameservers dela. Se comprou em outro registrador, adicione-o à Cloudflare e troque os nameservers lá." en="If you bought through Cloudflare, the domain already uses its nameservers. If you bought somewhere else, add it to Cloudflare and change the nameservers at your registrar." /></p>
        <h3><T pt="Domínio vindo de outro registrador" en="Domain from another registrar" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Em <em>Domains → Onboard a domain</em>, informe o domínio raiz (por exemplo <code>exemplo.com</code>; subdomínios não servem) e escolha um plano.</>} en={<>In <em>Domains → Onboard a domain</em>, enter the apex domain (for example <code>example.com</code>; subdomains do not work) and pick a plan.</>} /></li>
          <li><T pt={<>Revise os registros DNS. O scan automático pode não achar todos: confira o registro da raiz, o <code>www</code> e os de e-mail (MX, SPF, DKIM, DMARC).</>} en={<>Review the DNS records. The automatic scan may not find every one: check the apex record, <code>www</code> and the email ones (MX, SPF, DKIM, DMARC).</>} /></li>
          <li><T pt="A Cloudflare indica dois nameservers. No registrador, troque os atuais por esses dois." en="Cloudflare assigns two nameservers. At your registrar, replace the current ones with them." /></li>
          <li><T pt="Aguarde a ativação (um domínio novo pode levar até 24 horas para ser verificado). Depois disso a Cloudflare passa a ser seu DNS e proxy reverso." en="Wait for activation (a newly added domain can take up to 24 hours to be verified). After that, Cloudflare is your DNS and reverse proxy." /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<>Se o DNSSEC estiver ligado no registrador, desligue-o <em>antes</em> de trocar os nameservers; senão o domínio pode ficar inacessível. Reative-o depois, pela Cloudflare.</>} en={<>If DNSSEC is enabled at the registrar, turn it off <em>before</em> changing nameservers; otherwise the domain can become unreachable. Re-enable it afterwards, through Cloudflare.</>} /></Callout>
        <h3><T pt="Proxy ligado ou desligado" en="Proxied or DNS only" /></h3>
        <p><T pt="Cada registro A, AAAA ou CNAME tem um status de proxy:" en="Each A, AAAA or CNAME record has a proxy status:" /></p>
        <Table
          head={[<T pt="Status" en="Status" />, <T pt="O que acontece" en="What happens" />]}
          rows={[
            [<T pt={<><em>Proxied</em> (nuvem laranja)</>} en={<><em>Proxied</em> (orange cloud)</>} />, <T pt="O tráfego HTTP/HTTPS passa pela Cloudflare: CDN, cache, WAF, proteção DDoS. O DNS devolve IPs anycast da Cloudflare, e não o IP da sua origem." en="HTTP/HTTPS traffic goes through Cloudflare: CDN, cache, WAF, DDoS protection. DNS returns Cloudflare anycast IPs, not your origin IP." />],
            [<T pt={<><em>DNS only</em> (nuvem cinza)</>} en={<><em>DNS only</em> (grey cloud)</>} />, <T pt="O DNS devolve o endereço real e o tráfego não passa pela Cloudflare. Sua origem fica exposta. Use para registros que não são web, como e-mail e verificação de domínio." en="DNS returns the real address and traffic does not pass through Cloudflare. Your origin is exposed. Use it for non-web records, such as email and domain verification." />],
          ]}
        />
        <h3><T pt="Registros deste desenho" en="Records for this layout" /></h3>
        <Table
          head={["Type", "Name", "Target", <T pt="Proxy" en="Proxy" />]}
          rows={[
            ["CNAME", <code>app</code>, <T pt={<>DNS do ALB (<code>xxx.us-east-1.elb.amazonaws.com</code>)</>} en={<>the ALB DNS name (<code>xxx.us-east-1.elb.amazonaws.com</code>)</>} />, <T pt="Proxied" en="Proxied" />],
            ["CNAME", <code>media</code>, <T pt="criado pelo R2 ao conectar o domínio personalizado" en="created by R2 when you connect the custom domain" />, <T pt="Proxied" en="Proxied" />],
            ["CNAME", <T pt={<><code>_xxxx</code> (validação do ACM)</>} en={<><code>_xxxx</code> (ACM validation)</>} />, <T pt="valor fornecido pelo ACM, se usar certificado público da AWS" en="value given by ACM, if you use an AWS public certificate" />, <T pt="DNS only" en="DNS only" />],
          ]}
        />
        <Callout tone="use" icon="alert"><T pt={<>Limitação do proxy: um registro com proxy tem TTL fixo em Auto (300 s), e se a origem não responder dentro do <em>Proxy Read Timeout</em> a Cloudflare devolve o erro 524.</>} en={<>Proxy limitation: a proxied record has a fixed TTL of Auto (300 s), and if the origin does not respond within the <em>Proxy Read Timeout</em> Cloudflare returns a 524 error.</>} /></Callout>
      </Section>
      <Section id="ssl" title={<T pt="3. Certificado SSL e CDN" en="3. SSL certificate and CDN" />}>
        <p><T pt={<>Há <em>dois</em> trechos de conexão, e cada um tem seu certificado:</>} en={<>There are <em>two</em> connection legs, and each has its own certificate:</>} /></p>
        <Table
          head={[<T pt="Trecho" en="Leg" />, <T pt="Certificado" en="Certificate" />, <T pt="Quem cuida" en="Who handles it" />]}
          rows={[
            [<T pt="Visitante → Cloudflare" en="Visitor → Cloudflare" />, <T pt={<>Certificado de borda (<em>Universal SSL</em>), gratuito e confiável para navegadores</>} en={<>Edge certificate (<em>Universal SSL</em>), free and browser-trusted</>} />, <T pt="A Cloudflare emite, renova e instala sozinha." en="Cloudflare issues, renews and installs it automatically." />],
            [<T pt="Cloudflare → origem (ALB)" en="Cloudflare → origin (ALB)" />, <T pt="Certificado de origem (Cloudflare Origin CA ou de uma CA pública)" en="Origin certificate (Cloudflare Origin CA or from a public CA)" />, <T pt="Você instala no ALB (seção 9)." en="You install it on the ALB (section 9)." />],
          ]}
        />
        <h3><T pt="Universal SSL (borda)" en="Universal SSL (edge)" /></h3>
        <p><T pt={<>É um certificado DV gratuito, que cobre o domínio raiz e os subdomínios de primeiro nível (<code>exemplo.com</code>, <code>app.exemplo.com</code>). Só é emitido depois que o domínio está ativo na Cloudflare. Subdomínios de vários níveis (<code>a.b.exemplo.com</code>) não são cobertos em setup completo; exigem Total TLS ou certificados avançados.</>} en={<>It is a free DV certificate covering the apex domain and first-level subdomains (<code>example.com</code>, <code>app.example.com</code>). It is only issued once the domain is active on Cloudflare. Multi-level subdomains (<code>a.b.example.com</code>) are not covered on a full setup; they need Total TLS or advanced certificates.</>} /></p>
        <h3><T pt="Modos de criptografia" en="Encryption modes" /></h3>
        <Table
          head={[<T pt="Modo" en="Mode" />, <T pt="Visitante → Cloudflare" en="Visitor → Cloudflare" />, <T pt="Cloudflare → origem" en="Cloudflare → origin" />, <T pt="Valida o certificado da origem?" en="Validates origin certificate?" />]}
          rows={[
            ["Off", "HTTP", "HTTP", <T pt="Não" en="No" />],
            ["Flexible", "HTTPS", "HTTP", <T pt="Não" en="No" />],
            ["Full", "HTTPS", <T pt="Acompanha o protocolo do visitante" en="Matches the visitor’s protocol" />, <T pt="Não (aceita autoassinado)" en="No (accepts self-signed)" />],
            [<em>Full (strict)</em>, "HTTPS", "HTTPS", <T pt={<><em>Sim</em></>} en={<><em>Yes</em></>} />],
            ["Strict (SSL-Only Origin Pull)", <T pt="HTTP ou HTTPS" en="HTTP or HTTPS" />, <T pt="Sempre HTTPS" en="Always HTTPS" />, <T pt="Sim" en="Yes" />],
          ]}
        />
        <Callout tone="good" icon="check"><T pt={<>Use <em>Full (strict)</em>. É o único dos modos comuns que cifra o trecho até a origem <em>e</em> confere o certificado. O Full (strict) aceita certificado de uma CA pública (como o Let’s Encrypt ou um certificado público do ACM) ou da Cloudflare Origin CA. A Cloudflare recomenda Full ou Full (strict) sempre que possível.</>} en={<>Use <em>Full (strict)</em>. It is the only common mode that encrypts the trip to the origin <em>and</em> checks the certificate. Full (strict) accepts a certificate from a public CA (such as Let’s Encrypt or an ACM public certificate) or from the Cloudflare Origin CA. Cloudflare recommends Full or Full (strict) whenever possible.</>} /></Callout>
        <h3><T pt="Forçar HTTPS no visitante" en="Force HTTPS for the visitor" /></h3>
        <p><T pt={<>Em <em>SSL/TLS → Edge Certificates</em>, ligue <em>Always Use HTTPS</em>: toda requisição HTTP é redirecionada para HTTPS na borda. A opção só aparece se o modo de criptografia não for Off. A Cloudflare recomenda <em>não</em> fazer esse redirecionamento na origem, porque pode causar loop de redirecionamento.</>} en={<>Under <em>SSL/TLS → Edge Certificates</em>, turn on <em>Always Use HTTPS</em>: every HTTP request is redirected to HTTPS at the edge. The option only shows when the encryption mode is not Off. Cloudflare recommends <em>not</em> redirecting at the origin as well, because that can cause redirect loops.</>} /></p>
        <h3><T pt="CDN e cache" en="CDN and cache" /></h3>
        <p><T pt={<>Com o proxy ligado, a Cloudflare serve conteúdo de seus pontos de presença e aplica cache, WAF e proteção DDoS. Por padrão só alguns tipos de arquivo são cacheados; para cachear tudo é preciso uma regra de cache (<em>Cache Everything</em>). No R2, o cache só vale quando o bucket é acessado por um domínio personalizado (seção 4); a Cloudflare recomenda o <em>Smart Tiered Cache</em> nesse caso.</>} en={<>With the proxy on, Cloudflare serves content from its points of presence and applies cache, WAF and DDoS protection. By default only certain file types are cached; to cache everything you need a cache rule (<em>Cache Everything</em>). On R2, the cache only applies when the bucket is reached through a custom domain (section 4); Cloudflare recommends <em>Smart Tiered Cache</em> in that case.</>} /></p>
      </Section>
      <Section id="r2" title={<T pt="4. R2: bucket, chaves e acesso" en="4. R2: bucket, keys and access" />}>
        <p><T pt={<>R2 é o storage de objetos da Cloudflare, com API compatível com S3. Por isso você o acessa com SDKs da AWS (<code>@aws-sdk/client-s3</code>, <code>boto3</code>) apontando o <em>endpoint</em> para a Cloudflare.</>} en={<>R2 is Cloudflare’s object storage, with an S3-compatible API. That is why you reach it with AWS SDKs (<code>@aws-sdk/client-s3</code>, <code>boto3</code>) pointing the <em>endpoint</em> at Cloudflare.</>} /></p>
        <h3><T pt="Chaves de API (S3)" en="API keys (S3)" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>No painel do R2 (<em>Overview</em>), em <em>Account Details</em>, clique em <em>Manage</em> ao lado de <em>API Tokens</em>.</>} en={<>In the R2 dashboard (<em>Overview</em>), under <em>Account Details</em>, click <em>Manage</em> next to <em>API Tokens</em>.</>} /></li>
          <li><T pt="Escolha o tipo: token de conta (vale até ser revogado) ou de usuário (fica inativo se você sair da conta)." en="Choose the type: account token (valid until revoked) or user token (becomes inactive if you leave the account)." /></li>
          <li><T pt={<>Escolha a permissão e, se quiser, limite a buckets específicos: <em>Object Read &amp; Write</em> (ler, gravar e listar objetos) é o suficiente para gerar URLs pré-assinadas.</>} en={<>Choose the permission and, if you like, limit it to specific buckets: <em>Object Read &amp; Write</em> (read, write and list objects) is enough to generate presigned URLs.</>} /></li>
          <li><T pt={<>Copie o <em>Access Key ID</em> e o <em>Secret Access Key</em>.</>} en={<>Copy the <em>Access Key ID</em> and the <em>Secret Access Key</em>.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<>O <em>Secret Access Key</em> aparece uma única vez. Depois não dá para recuperá-lo; se perder, crie outro token.</>} en={<>The <em>Secret Access Key</em> is shown only once. You cannot retrieve it afterwards; if you lose it, create another token.</>} /></Callout>
        <p><T pt={<>O endpoint S3 é <code>https://&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code>. Buckets com jurisdição (UE, EUA, FedRAMP) só respondem pelo endpoint correspondente, por exemplo <code>&lt;ACCOUNT_ID&gt;.eu.r2.cloudflarestorage.com</code>.</>} en={<>The S3 endpoint is <code>https://&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code>. Jurisdictional buckets (EU, US, FedRAMP) only answer on their matching endpoint, for example <code>&lt;ACCOUNT_ID&gt;.eu.r2.cloudflarestorage.com</code>.</>} /></p>
        <h3><T pt="Bucket privado e bucket público" en="Private and public bucket" /></h3>
        <p><T pt={<>Todo bucket nasce <em>privado</em>: nunca é acessível publicamente sem uma ação explícita sua. Há duas formas de abrir leitura pública, e podem ser usadas separadamente:</>} en={<>Every bucket starts <em>private</em>: it is never publicly accessible without an explicit action from you. There are two ways to open public reads, and they can be used independently:</>} /></p>
        <Table
          head={[null, <T pt="Domínio personalizado" en="Custom domain" />, <T pt={<>Subdomínio <code>r2.dev</code></>} en={<><code>r2.dev</code> subdomain</>} />]}
          rows={[
            [<T pt="Uso" en="Use" />, <T pt="Produção" en="Production" />, <T pt="Só desenvolvimento; tem limite de requisições" en="Development only; rate-limited" />],
            [<T pt="Cache / CDN" en="Cache / CDN" />, <T pt="Sim (Cloudflare Cache)" en="Yes (Cloudflare Cache)" />, <T pt="Não" en="No" />],
            [<T pt="WAF, controle de acesso, Bot Management" en="WAF, access control, Bot Management" />, <T pt="Sim" en="Yes" />, <T pt="Não" en="No" />],
            [<T pt="Requisito" en="Requirement" />, <T pt="Domínio é uma zona na mesma conta do bucket" en="Domain is a zone in the same account as the bucket" />, <T pt="Nenhum" en="None" />],
          ]}
        />
        <p><T pt={<>Para conectar o domínio: bucket → <em>Settings</em> → <em>Custom Domains</em> → <em>Add</em> → informe o domínio (por exemplo <code>media.exemplo.com</code>) → revise o registro DNS → <em>Connect Domain</em>. Aguarde o status passar de <em>Initializing</em> a <em>Active</em>. A listagem do conteúdo na raiz do domínio não existe: só dá para acessar objetos por chave.</>} en={<>To connect the domain: bucket → <em>Settings</em> → <em>Custom Domains</em> → <em>Add</em> → enter the domain (for example <code>media.example.com</code>) → review the DNS record → <em>Connect Domain</em>. Wait for the status to go from <em>Initializing</em> to <em>Active</em>. There is no listing of contents at the domain root: objects are only reachable by key.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Se você protege o bucket com WAF ou Cloudflare Access, desative também o <code>r2.dev</code>; do contrário o bucket continua público por ele. Para desativar: <em>Public Development URL → Disable</em> e digite <code>disallow</code>.</>} en={<>If you protect the bucket with WAF or Cloudflare Access, disable <code>r2.dev</code> too; otherwise the bucket stays public through it. To disable it: <em>Public Development URL → Disable</em> and type <code>disallow</code>.</>} /></Callout>
        <h3><T pt="Quando usar cada um" en="When to use each" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Privado + URL pré-assinada:</em> arquivos de usuário, documentos, qualquer coisa que exija decidir quem acessa e por quanto tempo.</>} en={<><em>Private + presigned URL:</em> user files, documents, anything where you must decide who gets access and for how long.</>} /></li>
          <li><T pt={<><em>Público + domínio personalizado:</em> imagens e vídeos do site, assets estáticos, tudo que é para qualquer pessoa e que se beneficia de CDN.</>} en={<><em>Public + custom domain:</em> site images and videos, static assets, anything meant for everyone that benefits from a CDN.</>} /></li>
        </ul>
      </Section>
      <Section id="presigned" title={<T pt="5. URLs pré-assinadas: o que são e como funcionam" en="5. Presigned URLs: what they are and how they work" />}>
        <p><T pt={<>Uma URL pré-assinada dá acesso temporário a <em>um único objeto</em> sem expor suas chaves de API. A assinatura vai embutida na própria URL e é gerada no seu servidor, sem falar com o R2: o cálculo usa as suas chaves e o algoritmo AWS Signature Version 4.</>} en={<>A presigned URL grants temporary access to <em>a single object</em> without exposing your API keys. The signature is embedded in the URL itself and is generated on your server, without contacting R2: the calculation uses your keys and the AWS Signature Version 4 algorithm.</>} /></p>
        <h3><T pt="O que a assinatura amarra" en="What the signature binds" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Recurso:</em> conta, bucket e caminho do objeto.</>} en={<><em>Resource:</em> account, bucket and object path.</>} /></li>
          <li><T pt={<><em>Operação:</em> GET, PUT, HEAD ou DELETE. POST (formulário HTML) não é suportado.</>} en={<><em>Operation:</em> GET, PUT, HEAD or DELETE. POST (HTML form uploads) is not supported.</>} /></li>
          <li><T pt={<><em>Validade:</em> de 1 segundo a 7 dias (604.800 s).</>} en={<><em>Expiry:</em> from 1 second to 7 days (604,800 s).</>} /></li>
          <li><T pt={<><em>Content-Type</em>, se você o informar ao gerar uma URL de PUT: o cliente tem de enviar exatamente esse tipo.</>} en={<><em>Content-Type</em>, if you set it when generating a PUT URL: the client must send exactly that type.</>} /></li>
        </ul>
        <p><T pt={<>Alterar qualquer um desses parâmetros na URL (ou enviar outro Content-Type) invalida a assinatura e o R2 responde 403 <code>SignatureDoesNotMatch</code>. Quando o R2 recebe a requisição, ele recalcula a assinatura com a mesma chave e compara; se a URL ainda estiver dentro da validade, executa a operação.</>} en={<>Changing any of these parameters in the URL (or sending another Content-Type) invalidates the signature and R2 answers 403 <code>SignatureDoesNotMatch</code>. When R2 receives the request, it recomputes the signature with the same key and compares; if the URL is still within its validity, it performs the operation.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<>Trate a URL pré-assinada como um <em>token de portador</em>: quem a tiver pode executar a operação até ela expirar. Prefira validades curtas (por exemplo 10 minutos para upload) e entregue-a só a quem deve usá-la.</>} en={<>Treat a presigned URL as a <em>bearer token</em>: anyone holding it can perform the operation until it expires. Prefer short validities (for example 10 minutes for uploads) and hand it only to whoever must use it.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt={<>URLs pré-assinadas funcionam <em>só no domínio da API S3</em> (<code>&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code>). Não funcionam em domínio personalizado. Para controlar acesso num domínio personalizado há a validação HMAC do WAF, a partir do plano Pro.</>} en={<>Presigned URLs work <em>only on the S3 API domain</em> (<code>&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code>). They do not work on a custom domain. To control access on a custom domain there is WAF HMAC validation, on the Pro plan or above.</>} /></Callout>
        <h3><T pt="Gerando no servidor (Node.js)" en="Generating on the server (Node.js)" /></h3>
        <CodeBlock code={`import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto", // required by the SDK, not used by R2
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export function signedDownloadUrl(key) {
  const command = new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key });
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}

export function signedUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: contentType, // the browser must send exactly this Content-Type
  });
  return getSignedUrl(r2, command, { expiresIn: 600 });
}`} />
        <h3><T pt="O mesmo em Python" en="The same in Python" /></h3>
        <CodeBlock code={`import os, boto3

r2 = boto3.client(
    service_name="s3",
    endpoint_url=os.environ["R2_ENDPOINT"],
    aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
    region_name="auto",  # required by the SDK, not used by R2
)

download_url = r2.generate_presigned_url(
    "get_object",
    Params={"Bucket": os.environ["R2_BUCKET"], "Key": "image.png"},
    ExpiresIn=3600,
)
upload_url = r2.generate_presigned_url(
    "put_object",
    Params={"Bucket": os.environ["R2_BUCKET"], "Key": "image.png", "ContentType": "image/png"},
    ExpiresIn=600,
)`} />
        <p><T pt={<>A CLI da AWS (<code>aws s3 presign</code>) só gera URLs de GET; para PUT use um SDK.</>} en={<>The AWS CLI (<code>aws s3 presign</code>) only generates GET URLs; for PUT use an SDK.</>} /></p>
        <h3><T pt="Fluxo de upload pelo navegador" en="Browser upload flow" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>O navegador pede ao <em>seu backend</em> uma URL de upload, informando o nome e o tipo do arquivo. O backend decide a chave do objeto e gera a URL.</>} en={<>The browser asks <em>your backend</em> for an upload URL, sending the file name and type. The backend decides the object key and generates the URL.</>} /></li>
          <li><T pt={<>O navegador envia o arquivo direto ao R2 com <code>PUT</code>. O arquivo não passa pelo seu servidor.</>} en={<>The browser sends the file straight to R2 with <code>PUT</code>. The file never goes through your server.</>} /></li>
          <li><T pt="O backend guarda a chave do objeto (não a URL) no banco. Quando alguém precisar ver o arquivo, gera uma URL de download nova." en="The backend stores the object key (not the URL) in the database. When someone needs to see the file, it generates a fresh download URL." /></li>
        </ol>
        <CodeBlock code={`const { url } = await (await fetch("/api/uploads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: file.name, type: file.type }),
})).json();

await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": file.type }, // same value used to sign the URL
  body: file,
});`} />
        <h3><T pt="CORS no bucket" en="CORS on the bucket" /></h3>
        <p><T pt={<>Como o navegador faz esse <code>PUT</code> para outra origem, o R2 precisa de uma política de CORS. Um <code>PUT</code> é sempre precedido de uma requisição <em>preflight</em> (<code>OPTIONS</code>); o navegador só envia o arquivo se o bucket autorizar a origem, o método e o cabeçalho. Em <em>bucket → Settings → CORS Policy → Add CORS policy</em> (aba JSON):</>} en={<>Because the browser makes this <code>PUT</code> to another origin, R2 needs a CORS policy. A <code>PUT</code> is always preceded by a <em>preflight</em> request (<code>OPTIONS</code>); the browser only sends the file if the bucket allows the origin, the method and the header. Under <em>bucket → Settings → CORS Policy → Add CORS policy</em> (JSON tab):</>} /></p>
        <CodeBlock code={`[
  {
    "AllowedOrigins": ["https://app.example.com"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]`} />
        <p><T pt={<>Ao mudar a política de um domínio personalizado, limpe o cache do hostname (<em>Cache Purge</em>), porque respostas cacheadas podem não ter os novos cabeçalhos.</>} en={<>When you change the policy of a custom domain, purge the hostname’s cache (<em>Cache Purge</em>), because cached responses may not carry the new headers.</>} /></p>
      </Section>
      <Section id="browser" title={<T pt="6. Como o navegador renderiza foto e vídeo" en="6. How the browser renders photos and video" />}>
        <p><T pt={<>Para o navegador, uma URL pré-assinada é uma URL comum. Ele não sabe de assinatura: faz um <code>GET</code> e usa o que vier na resposta.</>} en={<>To the browser, a presigned URL is an ordinary URL. It knows nothing about signatures: it makes a <code>GET</code> and uses whatever comes back.</>} /></p>
        <h3><T pt={<>Foto: <code>&lt;img&gt;</code></>} en={<>Photo: <code>&lt;img&gt;</code></>} /></h3>
        <CodeBlock code={`<img src="https://my-bucket.<ACCOUNT_ID>.r2.cloudflarestorage.com/photo.jpg?X-Amz-Algorithm=…&X-Amz-Signature=…" alt="Description">`} />
        <ol className="ds-steps">
          <li><T pt={<>O navegador encontra o <code>&lt;img&gt;</code> e dispara um <code>GET</code> para a URL, com a assinatura na <em>query string</em>.</>} en={<>The browser finds the <code>&lt;img&gt;</code> and fires a <code>GET</code> to the URL, with the signature in the <em>query string</em>.</>} /></li>
          <li><T pt={<>O R2 confere a assinatura e a validade e responde <code>200</code> com o corpo do arquivo e o cabeçalho <code>Content-Type</code> (por exemplo <code>image/jpeg</code>).</>} en={<>R2 checks the signature and the expiry and answers <code>200</code> with the file body and the <code>Content-Type</code> header (for example <code>image/jpeg</code>).</>} /></li>
          <li><T pt="O navegador decodifica os bytes conforme o tipo e desenha a imagem. Se a URL expirou ou foi alterada, a resposta é 403 e aparece a imagem quebrada." en="The browser decodes the bytes according to the type and paints the image. If the URL expired or was altered, the answer is 403 and a broken image appears." /></li>
        </ol>
        <p><T pt={<>Mostrar a imagem <em>não exige CORS</em>: elementos <code>&lt;img&gt;</code> e <code>&lt;video&gt;</code> carregam recursos de outra origem normalmente. O CORS passa a ser necessário quando o código <em>lê</em> os dados, por exemplo com <code>fetch()</code>, ou desenha a imagem ou um quadro de vídeo num <code>&lt;canvas&gt;</code>; nesse caso use o atributo <code>crossorigin</code> e configure o CORS do bucket.</>} en={<>Showing the image <em>does not require CORS</em>: <code>&lt;img&gt;</code> and <code>&lt;video&gt;</code> elements load cross-origin resources normally. CORS becomes necessary when code <em>reads</em> the data, for example with <code>fetch()</code>, or draws the image or a video frame to a <code>&lt;canvas&gt;</code>; in that case use the <code>crossorigin</code> attribute and configure the bucket’s CORS.</>} /></p>
        <h3><T pt={<>Vídeo: <code>&lt;video&gt;</code></>} en={<>Video: <code>&lt;video&gt;</code></>} /></h3>
        <CodeBlock code={`<video controls preload="metadata" playsinline poster="poster.jpg">
  <source src="https://…signed-url…/clip.mp4" type="video/mp4">
</video>`} />
        <p><T pt={<>O vídeo é diferente da foto porque o navegador não baixa tudo de uma vez. Ele usa <em>requisições por faixa de bytes</em> (HTTP Range):</>} en={<>Video differs from a photo because the browser does not download everything at once. It uses <em>byte-range requests</em> (HTTP Range):</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<>Com <code>preload="metadata"</code> o navegador busca só o começo do arquivo, o bastante para saber a duração e as dimensões, e mostra o <code>poster</code> (ou o primeiro quadro).</>} en={<>With <code>preload="metadata"</code> the browser fetches only the start of the file, enough to learn duration and dimensions, and shows the <code>poster</code> (or the first frame).</>} /></li>
          <li><T pt={<>O servidor precisa anunciar <code>Accept-Ranges: bytes</code>. O navegador então pede trechos com <code>Range: bytes=0-1023</code> e recebe <code>206 Partial Content</code> com <code>Content-Range</code>.</>} en={<>The server must advertise <code>Accept-Ranges: bytes</code>. The browser then asks for chunks with <code>Range: bytes=0-1023</code> and receives <code>206 Partial Content</code> with <code>Content-Range</code>.</>} /></li>
          <li><T pt={<>Ao tocar o vídeo ou arrastar a barra de progresso, o navegador pede o trecho do ponto escolhido, sem baixar o que vem antes. Sem suporte a Range, o servidor manda o arquivo inteiro com <code>200</code> e não dá para pular com eficiência.</>} en={<>When you play or drag the progress bar, the browser asks for the chunk at the chosen point, without downloading what comes before. Without Range support the server sends the whole file with <code>200</code> and seeking is not efficient.</>} /></li>
        </ol>
        <p><T pt={<>O R2 aceita o cabeçalho <code>Range</code> em <code>GetObject</code>, então vídeo em bucket R2 pode ser buscado por trechos.</>} en={<>R2 supports the <code>Range</code> header on <code>GetObject</code>, so video in an R2 bucket can be fetched in chunks.</>} /></p>
        <Callout tone="warn" icon="alert"><T pt={<><em>Consequência das URLs pré-assinadas:</em> cada requisição por faixa é uma requisição nova com a mesma URL. Se a URL expirar durante a reprodução, os próximos trechos falham com 403 e o vídeo trava. Gere a URL com validade maior que a duração do vídeo.</>} en={<><em>Consequence for presigned URLs:</em> each range request is a new request with the same URL. If the URL expires during playback, the next chunks fail with 403 and the video stalls. Generate the URL with a validity longer than the video’s duration.</>} /></Callout>
        <h3><T pt="Content-Type, o detalhe que mais importa" en="Content-Type, the detail that matters most" /></h3>
        <ul className="ds-list">
          <li><T pt={<>O navegador decide como decodificar pelo <code>Content-Type</code> da resposta. Se o tipo estiver errado ou faltar, a mídia pode não aparecer; vídeos podem exibir um quadro cinza com um X.</>} en={<>The browser decides how to decode by the response’s <code>Content-Type</code>. If the type is wrong or missing, the media may not show; videos can display a grey box with an X.</>} /></li>
          <li><T pt={<>No R2 o tipo vem dos metadados gravados no upload (<code>PutObject</code> aceita <code>Content-Type</code>, <code>Cache-Control</code> e <code>Content-Disposition</code>). Por isso assine o PUT com o <code>ContentType</code> correto, como no exemplo da seção 5.</>} en={<>On R2 the type comes from the metadata stored at upload (<code>PutObject</code> accepts <code>Content-Type</code>, <code>Cache-Control</code> and <code>Content-Disposition</code>). That is why you sign the PUT with the correct <code>ContentType</code>, as in the example in section 5.</>} /></li>
          <li><T pt={<>No <code>&lt;video&gt;</code>, o atributo <code>type</code> do <code>&lt;source&gt;</code> (<code>video/mp4</code>, <code>video/webm</code>) deixa o navegador pular formatos que não toca, sem baixá-los.</>} en={<>On <code>&lt;video&gt;</code>, the <code>type</code> attribute of <code>&lt;source&gt;</code> (<code>video/mp4</code>, <code>video/webm</code>) lets the browser skip formats it cannot play, without downloading them.</>} /></li>
          <li><T pt={<><code>Content-Disposition: attachment</code> pede ao navegador que <em>baixe</em> o arquivo em vez de exibi-lo; <code>inline</code> (padrão) o exibe. Para mídia exibida em <code>&lt;img&gt;</code>/<code>&lt;video&gt;</code>, evite <code>attachment</code> e teste nos navegadores que você atende: a documentação do MDN descreve o cabeçalho para páginas e downloads, não para esses elementos.</>} en={<><code>Content-Disposition: attachment</code> asks the browser to <em>download</em> the file instead of displaying it; <code>inline</code> (the default) displays it. For media shown in <code>&lt;img&gt;</code>/<code>&lt;video&gt;</code>, avoid <code>attachment</code> and test in the browsers you support: MDN describes the header for pages and downloads, not for these elements.</>} /></li>
        </ul>
        <h3><T pt="Presignado ou público: o que muda na renderização" en="Presigned or public: what changes in rendering" /></h3>
        <Table
          head={[null, <T pt="URL pré-assinada (privado)" en="Presigned URL (private)" />, <T pt="Domínio personalizado (público)" en="Custom domain (public)" />]}
          rows={[
            [<T pt="Endereço" en="Address" />, <T pt={<><code>…r2.cloudflarestorage.com/chave?X-Amz-…</code>, muda a cada geração</>} en={<><code>…r2.cloudflarestorage.com/key?X-Amz-…</code>, changes on every generation</>} />, <T pt={<><code>https://media.exemplo.com/chave</code>, estável</>} en={<><code>https://media.example.com/key</code>, stable</>} />],
            [<T pt="Expira?" en="Expires?" />, <T pt="Sim, até 7 dias" en="Yes, up to 7 days" />, <T pt="Não" en="No" />],
            [<T pt="CDN da Cloudflare" en="Cloudflare CDN" />, <T pt="Não (domínio da API S3)" en="No (S3 API domain)" />, <T pt="Sim" en="Yes" />],
            [<T pt="Quem pode ver" en="Who can see" />, <T pt="Quem tiver a URL, até expirar" en="Whoever has the URL, until it expires" />, <T pt="Qualquer pessoa" en="Anyone" />],
          ]}
        />
      </Section>
      <Section id="variables" title={<T pt="7. Variáveis, valores e chaves" en="7. Variables, values and keys" />}>
        <p><T pt="O que cada parte precisa e onde obter. Segredos vão para o AWS Secrets Manager ou o Parameter Store (veja as notas de AWS), nunca para o repositório." en="What each part needs and where to get it. Secrets go to AWS Secrets Manager or Parameter Store (see the AWS notes), never into the repository." /></p>
        <Table
          head={[<T pt="Variável / valor" en="Variable / value" />, <T pt="O que é e onde obter" en="What it is and where to get it" />, <T pt="Segredo?" en="Secret?" />]}
          rows={[
            [<code>R2_ACCOUNT_ID</code>, <T pt="ID da conta Cloudflare, mostrado no painel do R2. Compõe o endpoint." en="Cloudflare account ID, shown in the R2 dashboard. Part of the endpoint." />, <T pt="Não" en="No" />],
            [<code>R2_ENDPOINT</code>, <T pt={<><code>https://&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code> (com jurisdição: <code>.eu.</code>, <code>.us.</code>, <code>.fedramp.</code>).</>} en={<><code>https://&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com</code> (with a jurisdiction: <code>.eu.</code>, <code>.us.</code>, <code>.fedramp.</code>).</>} />, <T pt="Não" en="No" />],
            [<code>R2_ACCESS_KEY_ID</code>, <T pt="Gerado em R2 → API Tokens (seção 4)." en="Generated under R2 → API Tokens (section 4)." />, <T pt="Sim" en="Yes" />],
            [<code>R2_SECRET_ACCESS_KEY</code>, <T pt="Gerado junto com o Access Key ID; exibido uma única vez." en="Generated together with the Access Key ID; shown only once." />, <T pt={<><em>Sim</em></>} en={<><em>Yes</em></>} />],
            [<code>R2_BUCKET</code>, <T pt="Nome do bucket criado no R2." en="Name of the bucket created in R2." />, <T pt="Não" en="No" />],
            [<code>R2_PRESIGN_EXPIRES_SECONDS</code>, <T pt="Validade das URLs. De 1 a 604.800 (7 dias). Use valores curtos." en="URL validity. From 1 to 604,800 (7 days). Use short values." />, <T pt="Não" en="No" />],
            [<code>R2_PUBLIC_BASE_URL</code>, <T pt={<>Domínio personalizado do bucket público (<code>https://media.exemplo.com</code>).</>} en={<>Custom domain of the public bucket (<code>https://media.example.com</code>).</>} />, <T pt="Não" en="No" />],
            [<T pt={<>Região do SDK = <code>auto</code></>} en={<>SDK region = <code>auto</code></>} />, <T pt="Obrigatória pelo SDK, mas o R2 não a usa." en="Required by the SDK, but R2 does not use it." />, <T pt="Não" en="No" />],
            [<code>origin.pem</code>, <T pt="Certificado de origem (Cloudflare Origin CA), parte pública (seção 9)." en="Origin certificate (Cloudflare Origin CA), public part (section 9)." />, <T pt="Não" en="No" />],
            [<code>origin.key</code>, <T pt="Chave privada do certificado de origem; só aparece na criação." en="Private key of the origin certificate; only shown at creation." />, <T pt={<><em>Sim</em></>} en={<><em>Yes</em></>} />],
            [<code>CERTIFICATE_ARN</code>, <T pt={<>ARN devolvido pelo <code>aws acm import-certificate</code>, usado no listener HTTPS.</>} en={<>ARN returned by <code>aws acm import-certificate</code>, used on the HTTPS listener.</>} />, <T pt="Não" en="No" />],
            [<><code>ALB_ARN</code>, <code>TARGET_GROUP_ARN</code></>, <T pt="ARNs do load balancer e do target group na AWS." en="ARNs of the load balancer and target group on AWS." />, <T pt="Não" en="No" />],
          ]}
        />
        <h3><T pt="Exemplo de arquivo de ambiente (backend)" en="Example environment file (backend)" /></h3>
        <CodeBlock code={`# --- Cloudflare R2 (backend) ---
R2_ACCOUNT_ID=<ACCOUNT_ID>
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<ACCESS_KEY_ID>
R2_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
R2_BUCKET=<BUCKET_NAME>
R2_PRESIGN_EXPIRES_SECONDS=600
# only if the bucket has a public custom domain
R2_PUBLIC_BASE_URL=https://media.example.com`} />
        <Callout tone="warn" icon="alert"><T pt={<>Não grave o <code>.env</code> no Git. No ECS, injete os segredos como <em>secrets</em> da task definition, vindos do Secrets Manager ou do Parameter Store.</>} en={<>Do not commit the <code>.env</code> to Git. On ECS, inject the secrets as task definition <em>secrets</em>, coming from Secrets Manager or Parameter Store.</>} /></Callout>
        <p><T pt={<>O token de API do R2 pode ser limitado a buckets específicos (permissões <em>Object</em>). Crie um token por ambiente (develop e produção), cada um com acesso só ao bucket daquele ambiente.</>} en={<>The R2 API token can be limited to specific buckets (<em>Object</em> permissions). Create one token per environment (develop and production), each with access only to that environment’s bucket.</>} /></p>
      </Section>
      <Section id="checklist" title={<T pt="8. O que cada recurso precisa para funcionar" en="8. What each feature needs to work" />}>
        <Table
          head={[<T pt="Recurso" en="Feature" />, <T pt="Precisa de" en="Needs" />]}
          rows={[
            [<T pt="Domínio funcionando" en="Working domain" />, <T pt="Registro/NS na Cloudflare, zona ativa, registro DNS com proxy." en="Registration/NS on Cloudflare, active zone, a proxied DNS record." />],
            [<T pt="HTTPS para o visitante" en="HTTPS for the visitor" />, <T pt={<>Zona ativa (Universal SSL) e <em>Always Use HTTPS</em>.</>} en={<>Active zone (Universal SSL) and <em>Always Use HTTPS</em>.</>} />],
            [<T pt="HTTPS até a AWS" en="HTTPS to AWS" />, <T pt={<>Modo <em>Full (strict)</em>, certificado no ALB (seção 9), listener 443, SG liberando 443.</>} en={<><em>Full (strict)</em> mode, a certificate on the ALB (section 9), a 443 listener, a security group allowing 443.</>} />],
            [<T pt="Upload por URL pré-assinada" en="Presigned upload" />, <T pt={<>Chaves S3 do R2, endpoint, bucket, backend que assina o PUT com <code>ContentType</code>, CORS com PUT e Content-Type.</>} en={<>R2 S3 keys, endpoint, bucket, a backend that signs the PUT with <code>ContentType</code>, CORS with PUT and Content-Type.</>} />],
            [<T pt="Download por URL pré-assinada" en="Presigned download" />, <T pt="Chaves S3, endpoint, bucket, backend que assina o GET com validade suficiente." en="S3 keys, endpoint, bucket, a backend that signs the GET with enough validity." />],
            [<T pt="Mídia pública com CDN" en="Public media with CDN" />, <T pt="Domínio personalizado no bucket (zona na mesma conta) e regra de cache, se quiser cachear todos os tipos." en="Custom domain on the bucket (zone in the same account) and a cache rule, if you want every type cached." />],
          ]}
        />
      </Section>
      <Section id="alb" title={<T pt="9. Certificado no ALB: HTTPS até a AWS" en="9. Certificate on the ALB: HTTPS all the way to AWS" />}>
        <p><T pt={<>Com o modo <em>Full (strict)</em>, a Cloudflare conecta ao ALB por HTTPS e valida o certificado. O ALB precisa, então, de um certificado válido para o hostname (por exemplo <code>app.exemplo.com</code>) num listener HTTPS. Há dois caminhos; este usa o certificado de origem gratuito da Cloudflare.</>} en={<>With <em>Full (strict)</em> mode, Cloudflare connects to the ALB over HTTPS and validates the certificate. The ALB therefore needs a valid certificate for the hostname (for example <code>app.example.com</code>) on an HTTPS listener. There are two paths; this one uses Cloudflare’s free origin certificate.</>} /></p>
        <h3><T pt="Passo 1: criar o certificado de origem na Cloudflare" en="Step 1: create the origin certificate on Cloudflare" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Painel → seu domínio → <em>SSL/TLS → Origin Server → Origin Certificates → Create Certificate</em>.</>} en={<>Dashboard → your domain → <em>SSL/TLS → Origin Server → Origin Certificates → Create Certificate</em>.</>} /></li>
          <li><T pt="Deixe a Cloudflare gerar a chave privada e o CSR, e escolha o tipo da chave (RSA ou ECC)." en="Let Cloudflare generate the private key and CSR, and choose the key type (RSA or ECC)." /></li>
          <li><T pt="Liste os hostnames cobertos (a raiz e o curinga de primeiro nível vêm por padrão) e o prazo de validade." en="List the covered hostnames (the apex and the first-level wildcard come by default) and the validity period." /></li>
          <li><T pt={<>Escolha o formato <em>PEM</em> e salve o certificado como <code>origin.pem</code> e a chave privada como <code>origin.key</code>.</>} en={<>Choose the <em>PEM</em> format and save the certificate as <code>origin.pem</code> and the private key as <code>origin.key</code>.</>} /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<>A chave privada <em>não pode ser vista depois</em> de você sair da tela. Guarde-a num cofre de segredos. A Cloudflare também <em>não avisa</em> quando o certificado de origem está perto de expirar: anote a data.</>} en={<>The private key <em>cannot be viewed afterwards</em> once you leave the screen. Store it in a secrets vault. Cloudflare also <em>does not notify</em> you when the origin certificate is close to expiring: note the date.</>} /></Callout>
        <Callout tone="use" icon="alert"><T pt={<>Esse certificado só é confiável <em>para a Cloudflare</em>. Navegadores não confiam nele: se você pausar o proxy ou deixar o registro como DNS only, os visitantes verão erro de certificado. Por isso o registro do ALB fica sempre com proxy.</>} en={<>This certificate is only trusted <em>by Cloudflare</em>. Browsers do not trust it: if you pause the proxy or leave the record as DNS only, visitors will see a certificate error. That is why the ALB record always stays proxied.</>} /></Callout>
        <h3><T pt="Passo 2: importar para o ACM" en="Step 2: import into ACM" /></h3>
        <p><T pt={<>O ACM exige certificado e chave em PEM, e a chave <em>sem senha</em> (iniciando em <code>-----BEGIN PRIVATE KEY-----</code>, com no máximo 5 KB). O ALB aceita todos os algoritmos do ACM (RSA 1024 a 4096 e ECDSA 256, 384 e 521). O certificado precisa estar dentro da validade no momento da importação. Importe na mesma região do load balancer.</>} en={<>ACM requires the certificate and key in PEM, and the key <em>without a passphrase</em> (starting with <code>-----BEGIN PRIVATE KEY-----</code>, up to 5 KB). The ALB accepts every ACM algorithm (RSA 1024 to 4096 and ECDSA 256, 384 and 521). The certificate must be inside its validity period at import time. Import in the same Region as the load balancer.</>} /></p>
        <CodeBlock code={`aws acm import-certificate \\
  --certificate fileb://origin.pem \\
  --private-key fileb://origin.key
# prints the certificate ARN: save it as CERTIFICATE_ARN`} />
        <p><T pt={<>A cadeia (<code>--certificate-chain</code>) é opcional. Se for usar, ela deve estar em PEM, em ordem, sem repetir o seu certificado. Também dá para importar pelo console: <em>ACM → Import a certificate</em> e colar o corpo, a chave privada e, se houver, a cadeia.</>} en={<>The chain (<code>--certificate-chain</code>) is optional. If you use it, it must be PEM, in order, without repeating your own certificate. You can also import through the console: <em>ACM → Import a certificate</em> and paste the body, the private key and, if any, the chain.</>} /></p>
        <h3><T pt="Passo 3: listener HTTPS no ALB" en="Step 3: HTTPS listener on the ALB" /></h3>
        <CodeBlock code={`aws elbv2 create-listener \\
  --load-balancer-arn <ALB_ARN> \\
  --protocol HTTPS \\
  --port 443 \\
  --default-actions Type=forward,TargetGroupArn=<TARGET_GROUP_ARN> \\
  --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \\
  --certificates CertificateArn=<CERTIFICATE_ARN>`} />
        <p><T pt={<>No console: <em>EC2 → Load Balancers → seu ALB → Listeners and rules → Add listener</em>, protocolo HTTPS, porta 443, ação <em>Forward to target groups</em>, política de segurança e, em <em>Default SSL/TLS certificate</em>, o certificado do ACM importado. O ALB usa esse certificado para encerrar a conexão do cliente (a Cloudflare, neste caso) e então repassa a requisição aos alvos. O ALB não suporta chaves ED25519.</>} en={<>In the console: <em>EC2 → Load Balancers → your ALB → Listeners and rules → Add listener</em>, protocol HTTPS, port 443, action <em>Forward to target groups</em>, a security policy and, under <em>Default SSL/TLS certificate</em>, the imported ACM certificate. The ALB uses that certificate to terminate the client connection (Cloudflare, in this case) and then forwards the request to the targets. The ALB does not support ED25519 keys.</>} /></p>
        <h3><T pt="Passo 4: nada em HTTP puro" en="Step 4: nothing over plain HTTP" /></h3>
        <p><T pt="Para garantir que nada chegue ao ALB sem criptografia, libere no security group do ALB só a porta 443 e, se mantiver a porta 80, faça dela um redirecionamento permanente para HTTPS:" en="To make sure nothing reaches the ALB unencrypted, allow only port 443 in the ALB’s security group and, if you keep port 80, make it a permanent redirect to HTTPS:" /></p>
        <CodeBlock code={`aws elbv2 create-listener \\
  --load-balancer-arn <ALB_ARN> \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions '[{
    "Type": "redirect",
    "RedirectConfig": {
      "Protocol": "HTTPS",
      "Port": "443",
      "Host": "#{host}",
      "Path": "/#{path}",
      "Query": "#{query}",
      "StatusCode": "HTTP_301"
    }
  }]'`} />
        <p><T pt="Como o modo Full (strict) já faz a Cloudflare falar HTTPS com a origem, esse redirecionamento no ALB não cria loop; ele só protege contra acessos que ignorem a Cloudflare." en="Because Full (strict) mode already makes Cloudflare speak HTTPS to the origin, this redirect on the ALB does not create a loop; it only protects against access that bypasses Cloudflare." /></p>
        <h3><T pt="Passo 5: ligar a Cloudflare ao ALB" en="Step 5: connect Cloudflare to the ALB" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Em <em>DNS → Records</em>, crie um CNAME <code>app</code> apontando para o nome DNS do ALB, com proxy ligado.</>} en={<>Under <em>DNS → Records</em>, create a CNAME <code>app</code> pointing to the ALB DNS name, with the proxy on.</>} /></li>
          <li><T pt={<>Em <em>SSL/TLS → Overview</em>, escolha <em>Full (strict)</em>.</>} en={<>Under <em>SSL/TLS → Overview</em>, choose <em>Full (strict)</em>.</>} /></li>
          <li><T pt={<>Em <em>Edge Certificates</em>, ligue <em>Always Use HTTPS</em>.</>} en={<>Under <em>Edge Certificates</em>, turn on <em>Always Use HTTPS</em>.</>} /></li>
          <li><T pt={<>Teste: <code>curl -I https://app.exemplo.com</code> deve responder pela Cloudflare, e <code>http://app.exemplo.com</code> deve redirecionar para HTTPS.</>} en={<>Test: <code>curl -I https://app.example.com</code> should answer through Cloudflare, and <code>http://app.example.com</code> should redirect to HTTPS.</>} /></li>
        </ol>
        <p><T pt="Resultado: visitante → Cloudflare em HTTPS (certificado de borda) e Cloudflare → ALB em HTTPS (certificado de origem validado). A Cloudflare conecta ao seu domínio nas portas HTTPS que ela proxia (a 443 está entre elas)." en="Result: visitor → Cloudflare over HTTPS (edge certificate) and Cloudflare → ALB over HTTPS (validated origin certificate). Cloudflare proxies the HTTPS ports it supports (443 is among them)." /></p>
        <h3><T pt="Alternativa: certificado público do ACM" en="Alternative: ACM public certificate" /></h3>
        <p><T pt={<>O Full (strict) também aceita certificados de CA pública. Um certificado público do ACM é gratuito e se renova sozinho, mas a validação é por DNS: o ACM fornece um CNAME de validação que você cria na Cloudflare <em>como DNS only</em>. Esse caminho evita ter de controlar a expiração do certificado de origem (veja a seção ACM das notas de AWS).</>} en={<>Full (strict) also accepts certificates from a public CA. An ACM public certificate is free and renews itself, but validation is by DNS: ACM gives you a validation CNAME that you create on Cloudflare <em>as DNS only</em>. This path avoids having to track the origin certificate’s expiry (see the ACM section of the AWS notes).</>} /></p>
        <h3><T pt="Renovação" en="Renewal" /></h3>
        <ul className="ds-list">
          <li><T pt={<>Certificado de origem da Cloudflare: sem aviso de expiração. Renove-o criando outro e reimportando-o no ACM; a reimportação não pode remover extensões <em>KeyUsage</em>/<em>ExtendedKeyUsage</em> que o certificado anterior tinha (com exceções descritas nas docs do ACM).</>} en={<>Cloudflare origin certificate: no expiry notice. Renew it by creating another and reimporting it into ACM; a reimport cannot remove <em>KeyUsage</em>/<em>ExtendedKeyUsage</em> extensions that the previous certificate had (with exceptions described in the ACM docs).</>} /></li>
          <li><T pt="Certificado de borda (Universal SSL): a Cloudflare cuida da emissão, renovação e instalação." en="Edge certificate (Universal SSL): Cloudflare handles issuance, renewal and installation." /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Nota pessoal, não verificada nas fontes:</strong> o trecho ALB → alvos (ECS, EC2) pode seguir em HTTP dentro da VPC ou ser HTTPS se o target group usar esse protocolo; as páginas consultadas não detalham isso. Se “100% HTTPS” inclui esse último salto, confirme nas docs de target groups do ELB. As páginas da Cloudflare consultadas também não detalham como o modo Full (strict) confere o hostname e a expiração do certificado de origem; use um certificado válido para o hostname.</>} en={<><strong>Personal note, not verified in the sources:</strong> the ALB → targets (ECS, EC2) leg can stay HTTP inside the VPC or be HTTPS if the target group uses that protocol; the pages consulted do not detail this. If “100% HTTPS” includes that last hop, confirm in the ELB target group docs. The Cloudflare pages consulted also do not detail how Full (strict) checks the origin certificate’s hostname and expiry; use a certificate valid for the hostname.</>} /></Callout>
        <p><T pt={<>E o trecho do ALB até o container? Para levar o HTTPS até dentro da task (ECS) e até o RDS, veja <a href="/notas/ecs-todo-app/#tls">ECS do zero, seção SSL ponta a ponta</a>.</>} en={<>And the leg from the ALB to the container? To carry HTTPS all the way into the task (ECS) and on to RDS, see <a href="/notas/ecs-todo-app/#tls">ECS from zero, End-to-end SSL</a>.</>} /></p>
      </Section>
      <Section id="problems" title={<T pt="10. Problemas comuns" en="10. Common problems" />}>
        <ul className="ds-list">
          <li><T pt={<><em>403 SignatureDoesNotMatch no upload:</em> o <code>Content-Type</code> do PUT é diferente do usado para assinar, ou a URL foi alterada.</>} en={<><em>403 SignatureDoesNotMatch on upload:</em> the PUT’s <code>Content-Type</code> differs from the one used to sign, or the URL was altered.</>} /></li>
          <li><T pt={<><em>Erro de CORS no upload:</em> falta a política no bucket, ou ela não inclui a origem, o método PUT ou o cabeçalho <code>Content-Type</code>.</>} en={<><em>CORS error on upload:</em> the bucket policy is missing, or it does not include the origin, the PUT method or the <code>Content-Type</code> header.</>} /></li>
          <li><T pt={<><em>URL pré-assinada não funciona no meu domínio:</em> ela só funciona no domínio da API S3, não em domínio personalizado.</>} en={<><em>Presigned URL does not work on my domain:</em> it only works on the S3 API domain, not on a custom domain.</>} /></li>
          <li><T pt={<><em>Vídeo não pula ou trava:</em> a URL expirou durante a reprodução, ou o servidor não responde a <code>Range</code> com <code>206</code>.</>} en={<><em>Video does not seek or stalls:</em> the URL expired during playback, or the server does not answer <code>Range</code> with <code>206</code>.</>} /></li>
          <li><T pt={<><em>Mídia não aparece:</em> <code>Content-Type</code> errado ou ausente no objeto.</>} en={<><em>Media does not show:</em> wrong or missing <code>Content-Type</code> on the object.</>} /></li>
          <li><T pt={<><em>Erro 524:</em> a origem demorou mais que o <em>Proxy Read Timeout</em> da Cloudflare para responder.</>} en={<><em>Error 524:</em> the origin took longer than Cloudflare’s <em>Proxy Read Timeout</em> to answer.</>} /></li>
          <li><T pt={<><em>Domínio parou de resolver:</em> a verificação do e-mail do registrante expirou e a ICANN pôs o domínio em hold.</>} en={<><em>Domain stopped resolving:</em> registrant email verification expired and ICANN put the domain on hold.</>} /></li>
          <li><T pt={<><em>Domínio personalizado do bucket preso em Initializing:</em> use <em>Retry connection</em>; confira se a zona está na mesma conta do bucket.</>} en={<><em>Bucket custom domain stuck on Initializing:</em> use <em>Retry connection</em>; check that the zone is in the same account as the bucket.</>} /></li>
        </ul>
        <Sources title={<T pt="Fontes oficiais · verificado em 2026-10-13" en="Official sources · verified on 2026-10-13" />}>
          <ul>
            <li><a href="https://developers.cloudflare.com/registrar/get-started/register-domain/">Cloudflare Docs · Register a domain (Registrar)</a></li>
            <li><a href="https://developers.cloudflare.com/fundamentals/manage-domains/add-site/">Cloudflare Docs · Add a site</a></li>
            <li><a href="https://developers.cloudflare.com/dns/proxy-status/">Cloudflare Docs · Proxy status</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/">Cloudflare Docs · Universal SSL</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/">Cloudflare Docs · SSL/TLS encryption modes</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/">Cloudflare Docs · Origin CA certificates</a></li>
            <li><a href="https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/">Cloudflare Docs · Always Use HTTPS</a></li>
            <li><a href="https://developers.cloudflare.com/fundamentals/reference/network-ports/">Cloudflare Docs · Network ports</a></li>
            <li><a href="https://developers.cloudflare.com/r2/api/tokens/">Cloudflare Docs · R2 API tokens</a></li>
            <li><a href="https://developers.cloudflare.com/r2/api/s3/presigned-urls/">Cloudflare Docs · R2 presigned URLs</a></li>
            <li><a href="https://developers.cloudflare.com/r2/api/s3/api/">Cloudflare Docs · R2 S3 API compatibility</a></li>
            <li><a href="https://developers.cloudflare.com/r2/buckets/public-buckets/">Cloudflare Docs · R2 public buckets</a></li>
            <li><a href="https://developers.cloudflare.com/r2/buckets/cors/">Cloudflare Docs · R2 CORS</a></li>
            <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/import-certificate-prerequisites.html">AWS Docs · Prerequisites for importing ACM certificates</a></li>
            <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/import-certificate-format.html">AWS Docs · Certificate and key format for importing</a></li>
            <li><a href="https://docs.aws.amazon.com/acm/latest/userguide/import-certificate-api-cli.html">AWS Docs · Import a certificate</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html">AWS Docs · Create an HTTPS listener for your Application Load Balancer</a></li>
            <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-action-types.html">AWS Docs · Action types for listener rules (redirect)</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">MDN · Cross-Origin Resource Sharing (CORS)</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests">MDN · HTTP range requests</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video">MDN · The &lt;video&gt; element</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition">MDN · Content-Disposition</a></li>
          </ul>
        </Sources>
      </Section>
    </>
  );
}
