import { Callout, CodeBlock, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "payment-gateways",
  title: { en: "Payment gateways: Stripe, Mercado Pago and Asaas", pt: "Gateways de pagamento: Stripe, Mercado Pago e Asaas" },
  seo: {
    title: { en: "Payment gateways: Stripe, Mercado Pago and Asaas", pt: "Gateways de pagamento: Stripe, Mercado Pago e Asaas" },
    description: { en: "How to integrate a payment gateway the simple way: the checkout flow, webhooks as the source of truth, idempotency, subscriptions tied to a tenant, Pix and boleto in Brazil, and what changes between Stripe, Mercado Pago and Asaas.", pt: "Como integrar um gateway de pagamento do jeito simples: o fluxo de checkout, webhooks como fonte da verdade, idempotência, assinaturas ligadas a um tenant, Pix e boleto no Brasil e o que muda entre Stripe, Mercado Pago e Asaas." },
  },
  summary: "how to integrate a payment gateway simply: hosted checkout, webhooks as the source of truth with signature verification, idempotency, subscriptions tied to a tenant and entitlements, Pix and boleto in Brazil, and the differences between Stripe, Mercado Pago and Asaas.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Take the money, <em>trust the webhook.</em></>, pt: <>Receber o dinheiro, <em>confiar no webhook.</em></> },
  heroLede: { en: "A gateway handles cards, Pix and boleto so you never touch card numbers. The integration is small: create a checkout, receive a webhook, update your database. The care goes into the details.", pt: "Um gateway cuida de cartão, Pix e boleto para você nunca tocar em número de cartão. A integração é pequena: criar um checkout, receber um webhook, atualizar o banco. O cuidado está nos detalhes." },
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que um gateway faz" en="What a gateway does" /> },
        { id: "flow", title: <T pt="O fluxo em quatro passos" en="The four-step flow" /> },
        { id: "providers", title: <T pt="Stripe, Mercado Pago e Asaas" en="Stripe, Mercado Pago and Asaas" /> },
        { id: "code", title: <T pt="Código: checkout e webhook" en="Code: checkout and webhook" /> },
        { id: "saas", title: <T pt="Assinaturas num SaaS multi-tenant" en="Subscriptions in a multi-tenant SaaS" /> },
        { id: "safe", title: <T pt="Segurança e confiabilidade" en="Security and reliability" /> },
        { id: "test", title: <T pt="Testar e ir para produção" en="Testing and going live" /> },
        { id: "cheat", title: <T pt="Cola" en="Cheat sheet" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que um gateway faz" en="What a gateway does" />}>
        <p><T pt={<>Um <strong>gateway de pagamento</strong> (Stripe, Mercado Pago, Asaas, Pagar.me, PayPal…) conversa com bandeiras, bancos e o Banco Central (Pix) por você. Ele guarda os dados do cartão, faz antifraude, gera boleto e QR Code Pix, repete cobranças de assinaturas e avisa o seu sistema quando algo muda. Você só guarda <em>identificadores</em> (id do cliente, da assinatura, do pagamento) e o <em>status</em>.</>} en={<>A <strong>payment gateway</strong> (Stripe, Mercado Pago, Asaas, Pagar.me, PayPal…) talks to card networks, banks and the central bank (Pix) for you. It stores card data, runs anti-fraud, generates boleto and Pix QR codes, repeats subscription charges and tells your system when something changes. You only store <em>identifiers</em> (customer, subscription, payment id) and the <em>status</em>.</>} /></p>
        <Callout icon="shield"><T pt={<>Nunca receba nem guarde número de cartão no seu servidor. Use a página hospedada do gateway (checkout) ou os campos hospedados do SDK: assim o cartão vai direto ao gateway e o seu escopo de conformidade PCI-DSS fica mínimo.</>} en={<>Never receive or store card numbers on your server. Use the gateway's hosted page (checkout) or the SDK's hosted fields: the card goes straight to the gateway and your PCI-DSS scope stays minimal.</>} /></Callout>
      </Section>

      <Section id="flow" title={<T pt="O fluxo em quatro passos" en="The four-step flow" />}>
        <ol>
          <li><T pt={<><strong>Seu backend cria o checkout</strong> (ou a cobrança) via API, informando valor/plano, o cliente e um <code>metadata</code> com o seu <code>tenant_id</code>. Resposta: uma URL.</>} en={<><strong>Your backend creates the checkout</strong> (or charge) through the API, passing amount/plan, the customer and a <code>metadata</code> with your <code>tenant_id</code>. Response: a URL.</>} /></li>
          <li><T pt="O front redireciona o cliente para essa URL. Ele paga na página do gateway." en="The front end redirects the customer to that URL. They pay on the gateway's page." /></li>
          <li><T pt={<><strong>O gateway chama o seu webhook</strong> (POST) com o evento: pago, falhou, renovado, cancelado.</>} en={<><strong>The gateway calls your webhook</strong> (POST) with the event: paid, failed, renewed, canceled.</>} /></li>
          <li><T pt="Seu backend valida o webhook, atualiza o banco (plano ativo, pedido pago) e libera o acesso." en="Your backend validates the webhook, updates the database (plan active, order paid) and grants access." /></li>
        </ol>
        <Callout tone="warn" icon="alert"><T pt={<>A página de sucesso (<code>?success=true</code>) <strong>não prova</strong> pagamento: o cliente pode digitar a URL, e no Pix/boleto o pagamento acontece minutos ou dias depois. Só o webhook (ou uma consulta à API do gateway) é fonte da verdade.</>} en={<>The success page (<code>?success=true</code>) <strong>does not prove</strong> payment: a customer can type the URL, and with Pix/boleto payment happens minutes or days later. Only the webhook (or a query to the gateway's API) is the source of truth.</>} /></Callout>
      </Section>

      <Section id="providers" title={<T pt="Stripe, Mercado Pago e Asaas" en="Stripe, Mercado Pago and Asaas" />}>
        <Table
          head={["", "Stripe", "Mercado Pago", "Asaas"]}
          rows={[
            [<T pt="Foco" en="Focus" />, <T pt="SaaS e cobrança global, ótima API e documentação" en="SaaS and global billing, great API and docs" />, <T pt="e-commerce e marketplace na América Latina, base de usuários grande" en="e-commerce and marketplaces in Latin America, huge user base" />, <T pt="cobrança recorrente no Brasil: boleto, Pix, cartão, e emissão de nota" en="recurring billing in Brazil: boleto, Pix, card, invoice issuing" />],
            [<T pt="Checkout pronto" en="Hosted checkout" />, <code>Checkout Session</code>, <T pt={<>Checkout Pro (<code>preference</code>)</>} en={<>Checkout Pro (<code>preference</code>)</>} />, <T pt={<>link de pagamento ou fatura de uma cobrança (<code>invoiceUrl</code>)</>} en={<>payment link or a charge's invoice page (<code>invoiceUrl</code>)</>} />],
            [<T pt="Assinaturas" en="Subscriptions" />, <T pt="Billing: produtos, preços, trials, proration, portal do cliente" en="Billing: products, prices, trials, proration, customer portal" />, <T pt="assinaturas (preapproval), mais básicas" en="subscriptions (preapproval), more basic" />, <T pt={<>endpoint <code>/subscriptions</code>; gera uma cobrança por ciclo</>} en={<><code>/subscriptions</code> endpoint; generates one charge per cycle</>} />],
            [<T pt="Pix / boleto" en="Pix / boleto" />, <T pt="Pix e boleto disponíveis no Brasil; confira conta e região" en="Pix and boleto available in Brazil; check account and region" />, <T pt="Pix, boleto e cartão nativos" en="Pix, boleto and card, native" />, <T pt="Pix, boleto e cartão nativos" en="Pix, boleto and card, native" />],
            [<T pt="Autenticação" en="Authentication" />, <T pt={<>chave secreta no <code>Authorization: Bearer</code></>} en={<>secret key in <code>Authorization: Bearer</code></>} />, <T pt={<><code>access token</code> em <code>Authorization: Bearer</code></>} en={<><code>access token</code> in <code>Authorization: Bearer</code></>} />, <T pt={<>chave de API no cabeçalho <code>access_token</code></>} en={<>API key in the <code>access_token</code> header</>} />],
            [<T pt="Webhook seguro" en="Webhook security" />, <T pt={<>assinatura HMAC em <code>Stripe-Signature</code></>} en={<>HMAC signature in <code>Stripe-Signature</code></>} />, <T pt={<>assinatura em <code>x-signature</code>; o aviso traz só o id, consulte o pagamento na API</>} en={<>signature in <code>x-signature</code>; the notice only carries the id, fetch the payment from the API</>} />, <T pt={<>token que você define, enviado no cabeçalho <code>asaas-access-token</code></>} en={<>a token you define, sent in the <code>asaas-access-token</code> header</>} />],
            [<T pt="Ambiente de teste" en="Test environment" />, <T pt={<>modo teste com chaves <code>sk_test_…</code> e Stripe CLI</>} en={<>test mode with <code>sk_test_…</code> keys and the Stripe CLI</>} />, <T pt="credenciais e usuários de teste" en="test credentials and test users" />, <T pt="sandbox separado, com outra URL e outra chave" en="a separate sandbox with another URL and key" />],
          ]}
        />
        <p><T pt={<>Como escolher: <strong>cobra de fora do Brasil ou quer o melhor cobrança recorrente?</strong> Stripe. <strong>Vende para consumidor brasileiro e quer a conta do Mercado Pago?</strong> Mercado Pago. <strong>Cobra empresas e pessoas recorrentemente por Pix/boleto, com cobrança automática e nota?</strong> Asaas. Taxas, prazos de recebimento e recursos mudam: confira a página de preços e a documentação atual antes de decidir.</>} en={<>How to choose: <strong>billing outside Brazil, or want the best recurring billing?</strong> Stripe. <strong>Selling to Brazilian consumers who already use Mercado Pago?</strong> Mercado Pago. <strong>Billing companies and people recurrently by Pix/boleto with automatic charges and invoices?</strong> Asaas. Fees, payout times and features change: check the current pricing page and docs before deciding.</>} /></p>
        <p><T pt="Para não ficar preso a um provedor, isole tudo atrás de uma interface sua (veja o código abaixo): o resto do app fala com PaymentProvider, não com o SDK." en="To avoid lock-in, hide everything behind your own interface (see the code below): the rest of the app talks to PaymentProvider, not to the SDK." /></p>
      </Section>

      <Section id="code" title={<T pt="Código: checkout e webhook" en="Code: checkout and webhook" />}>
        <h3><T pt="Uma interface sua" en="Your own interface" /></h3>
        <CodeBlock code={`export interface PaymentProvider {
  createCheckout(input: { tenantId: string; planId: string; email: string; successUrl: string; cancelUrl: string }): Promise<{ url: string }>;
  parseWebhook(rawBody: Buffer, headers: Record<string, string | undefined>): Promise<BillingEvent>; // verifies authenticity
}

export type BillingEvent =
  | { id: string; type: 'payment_succeeded'; tenantId: string; externalSubscriptionId: string; paidUntil: Date }
  | { id: string; type: 'payment_failed';    tenantId: string; externalSubscriptionId: string }
  | { id: string; type: 'subscription_canceled'; tenantId: string; externalSubscriptionId: string };`} />
        <h3>Stripe</h3>
        <CodeBlock code={`import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 1) create the checkout
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: 'price_123', quantity: 1 }],
  customer_email: email,
  client_reference_id: tenantId,                     // our tenant
  subscription_data: { metadata: { tenantId } },     // copied to later events
  success_url: 'https://app.example.com/billing?ok=1',
  cancel_url:  'https://app.example.com/billing',
}, { idempotencyKey: \`checkout-\${tenantId}-\${planId}-\${Date.now() / 60000 | 0}\` });
// redirect to session.url

// 2) webhook: needs the RAW body, not parsed JSON
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.header('stripe-signature')!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch { return res.sendStatus(400); }          // bad signature: not from Stripe
  // enqueue/process event (see "Security and reliability"), then answer fast
  res.sendStatus(200);
});`} />
        <p><T pt={<>Eventos úteis: <code>checkout.session.completed</code>, <code>invoice.paid</code> (renovação paga), <code>invoice.payment_failed</code>, <code>customer.subscription.updated</code> e <code>customer.subscription.deleted</code>. Para o cliente trocar cartão ou cancelar sozinho, use o <em>Customer Portal</em> em vez de construir telas.</>} en={<>Useful events: <code>checkout.session.completed</code>, <code>invoice.paid</code> (renewal paid), <code>invoice.payment_failed</code>, <code>customer.subscription.updated</code> and <code>customer.subscription.deleted</code>. For customers to change card or cancel on their own, use the <em>Customer Portal</em> instead of building screens.</>} /></p>
        <h3>Mercado Pago</h3>
        <CodeBlock code={`// Checkout Pro: create a preference, redirect to init_point
const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${process.env.MP_ACCESS_TOKEN}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ title: 'Pro plan', quantity: 1, unit_price: 49.9, currency_id: 'BRL' }],
    external_reference: tenantId,                    // comes back on the payment
    notification_url: 'https://api.example.com/webhooks/mercadopago',
    back_urls: { success: 'https://app.example.com/billing?ok=1' },
  }),
});
const { init_point } = await res.json();

// Webhook: the notice carries only the payment id. Verify x-signature, then ASK the API:
//   GET https://api.mercadopago.com/v1/payments/{id}  -> status 'approved', external_reference, ...`} />
        <h3>Asaas</h3>
        <CodeBlock code={`const ASAAS = 'https://api-sandbox.asaas.com/v3';   // production: https://api.asaas.com/v3
const headers = { access_token: process.env.ASAAS_API_KEY!, 'Content-Type': 'application/json' };

// customer, then a monthly subscription that accepts Pix, boleto or card
const customer = await (await fetch(\`\${ASAAS}/customers\`, {
  method: 'POST', headers, body: JSON.stringify({ name, cpfCnpj, email }) })).json();

const subscription = await (await fetch(\`\${ASAAS}/subscriptions\`, {
  method: 'POST', headers,
  body: JSON.stringify({
    customer: customer.id, billingType: 'UNDEFINED',   // customer picks Pix, boleto or card
    value: 49.9, nextDueDate: '2026-12-10', cycle: 'MONTHLY',
    externalReference: tenantId,
  }) })).json();

// Webhook: compare the 'asaas-access-token' header with the token you configured.
// Events: PAYMENT_CONFIRMED / PAYMENT_RECEIVED (paid), PAYMENT_OVERDUE (late), ...`} />
        <Callout icon="check"><T pt="Os trechos acima mostram a forma, não são cópias para colar: URLs de sandbox, nomes de campos e eventos mudam entre versões. Confirme cada campo na documentação do provedor." en="The snippets above show the shape; they are not paste-ready: sandbox URLs, field names and events change between versions. Confirm each field in the provider's documentation." /></Callout>
      </Section>

      <Section id="saas" title={<T pt="Assinaturas num SaaS multi-tenant" en="Subscriptions in a multi-tenant SaaS" />}>
        <p><T pt={<>Num app <a href="/notas/multi-tenant-saas/">multi-tenant</a>, quem paga é o <strong>tenant</strong>. Guarde o estado da cobrança nele e derive o que cada tenant pode usar (os <em>entitlements</em>) a partir do plano.</>} en={<>In a <a href="/notas/multi-tenant-saas/">multi-tenant</a> app, the one who pays is the <strong>tenant</strong>. Store the billing state on it and derive what each tenant may use (the <em>entitlements</em>) from the plan.</>} /></p>
        <CodeBlock code={`CREATE TABLE subscriptions (
  tenant_id        uuid PRIMARY KEY REFERENCES tenants(id),
  provider         text NOT NULL,                  -- 'stripe' | 'mercadopago' | 'asaas'
  external_id      text NOT NULL,                  -- subscription id at the provider
  plan             text NOT NULL,                  -- 'free' | 'pro' | 'business'
  status           text NOT NULL,                  -- 'active' | 'past_due' | 'canceled'
  current_period_end timestamptz,
  UNIQUE (provider, external_id)
);

CREATE TABLE billing_events (                      -- for deduplication, see below
  provider text NOT NULL, event_id text NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider, event_id)
);`} />
        <CodeBlock code={`const limits = {
  free:     { seats: 3,  projects: 2 },
  pro:      { seats: 20, projects: 50 },
  business: { seats: 200, projects: Infinity },
} as const;

export function entitlements(sub: { plan: keyof typeof limits; status: string; current_period_end: Date }) {
  const paid = sub.status === 'active' || (sub.status === 'past_due' && sub.current_period_end > new Date()); // grace
  return paid ? limits[sub.plan] : limits.free;      // lapsed -> free limits, never lose the data
}

// where it is used (together with can() from the RBAC note)
if (members.length >= entitlements(sub).seats) return res.status(402).json({ error: 'Plan limit reached' });`} />
        <p><T pt={<>Só quem tem a permissão <code>billing:manage</code> (normalmente <code>owner</code>) pode abrir o checkout ou o portal: é uma regra do <a href="/notas/rbac-abac/">RBAC</a>. Quando o pagamento falha, dê um período de tolerância e avise por e-mail antes de rebaixar; nunca apague dados do cliente por inadimplência.</>} en={<>Only whoever has the <code>billing:manage</code> permission (usually <code>owner</code>) may open the checkout or portal: that is an <a href="/notas/rbac-abac/">RBAC</a> rule. When payment fails, give a grace period and email before downgrading; never delete customer data over non-payment.</>} /></p>
      </Section>

      <Section id="safe" title={<T pt="Segurança e confiabilidade" en="Security and reliability" />}>
        <h3><T pt="Webhooks: verificar, deduplicar, responder rápido" en="Webhooks: verify, deduplicate, answer fast" /></h3>
        <ul>
          <li><T pt="Verifique a assinatura (ou o token) antes de qualquer coisa. Sem isso, qualquer pessoa pode forjar “pagamento aprovado”." en="Verify the signature (or token) before anything else. Without it, anyone can forge “payment approved”." /></li>
          <li><T pt={<>Gateways reenviam eventos (<em>at-least-once</em>) e podem entregar fora de ordem. Grave o <code>event_id</code> numa tabela com chave primária na <strong>mesma transação</strong> que o efeito: se já existe, ignore. É o padrão de <a href="/notas/idempotency/">Idempotência</a>.</>} en={<>Gateways resend events (<em>at-least-once</em>) and may deliver them out of order. Insert the <code>event_id</code> into a table with a primary key in the <strong>same transaction</strong> as the effect: if it already exists, ignore it. This is the <a href="/notas/idempotency/">Idempotency</a> pattern.</>} /></li>
          <li><T pt="Responda 2xx rápido (em segundos). Se o trabalho for longo, grave o evento e processe numa fila." en="Answer 2xx fast (within seconds). If the work is long, store the event and process it from a queue." /></li>
          <li><T pt="Não confie na ordem: ao receber um evento, prefira reconsultar o estado atual na API do gateway e gravar o resultado." en="Do not trust ordering: on an event, prefer re-fetching the current state from the gateway's API and storing that." /></li>
        </ul>
        <CodeBlock code={`export async function handleBillingEvent(pool: Pool, provider: string, ev: BillingEvent) {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const seen = await tx.query(
      'INSERT INTO billing_events (provider, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [provider, ev.id]);
    if (seen.rowCount === 0) { await tx.query('COMMIT'); return; }          // duplicate: do nothing

    if (ev.type === 'payment_succeeded')
      await tx.query("UPDATE subscriptions SET status='active', current_period_end=$2 WHERE tenant_id=$1", [ev.tenantId, ev.paidUntil]);
    if (ev.type === 'payment_failed')
      await tx.query("UPDATE subscriptions SET status='past_due' WHERE tenant_id=$1", [ev.tenantId]);
    if (ev.type === 'subscription_canceled')
      await tx.query("UPDATE subscriptions SET status='canceled' WHERE tenant_id=$1", [ev.tenantId]);
    await tx.query('COMMIT');
  } catch (e) { await tx.query('ROLLBACK'); throw e; }   // 5xx -> the gateway retries
  finally { tx.release(); }
}`} />
        <h3><T pt="Outros cuidados" en="Other care" /></h3>
        <ul>
          <li><T pt={<>Ao criar cobranças, mande a <strong>chave de idempotência</strong> do provedor (Stripe: <code>Idempotency-Key</code>; Mercado Pago: <code>X-Idempotency-Key</code>) para um retry não cobrar duas vezes.</>} en={<>When creating charges, send the provider's <strong>idempotency key</strong> (Stripe: <code>Idempotency-Key</code>; Mercado Pago: <code>X-Idempotency-Key</code>) so a retry does not charge twice.</>} /></li>
          <li><T pt="Valores: use inteiros em centavos (Stripe) ou decimais do provedor com cuidado; nunca float em contas. O valor cobrado vem do SEU servidor/plano, nunca do navegador." en="Amounts: use integer cents (Stripe) or the provider's decimals with care; never float for money. The amount charged comes from YOUR server/plan, never from the browser." /></li>
          <li><T pt="Chaves secretas só em variáveis de ambiente do servidor; chaves de teste e de produção separadas; rotacione se vazar." en="Secret keys only in server environment variables; separate test and production keys; rotate if leaked." /></li>
          <li><T pt="LGPD: guarde o mínimo (ids e status); CPF/CNPJ só se o provedor exigir; registre o consentimento." en="Privacy law (LGPD): store the minimum (ids and status); CPF/CNPJ only if the provider requires it; record consent." /></li>
          <li><T pt="Concilie: um job diário compara os pagamentos do provedor com o seu banco e alerta divergências (webhook perdido)." en="Reconcile: a daily job compares the provider's payments with your database and alerts on mismatches (lost webhook)." /></li>
          <li><T pt="Reembolsos e chargebacks também chegam por webhook: trate os eventos." en="Refunds and chargebacks also arrive by webhook: handle those events." /></li>
        </ul>
      </Section>

      <Section id="test" title={<T pt="Testar e ir para produção" en="Testing and going live" />}>
        <CodeBlock code={`# Stripe: forward real test events to your local server
stripe listen --forward-to localhost:3000/webhooks/stripe
stripe trigger invoice.payment_failed

# Any provider locally: expose the port with a tunnel (e.g. cloudflared) and
# register the public URL as the webhook in the provider's sandbox
cloudflared tunnel --url http://localhost:3000`} />
        <ol>
          <li><T pt="No sandbox: pague, falhe, repita o mesmo evento duas vezes, envie fora de ordem e confirme que o estado final está certo." en="In the sandbox: pay, fail, replay the same event twice, send out of order, and confirm the final state is right." /></li>
          <li><T pt="Teste a assinatura inválida: deve responder 400 e não mudar nada." en="Test an invalid signature: it must answer 400 and change nothing." /></li>
          <li><T pt="Troque chaves, URL do webhook e segredos para os de produção (variáveis de ambiente, não código)." en="Switch keys, webhook URL and secrets to the production ones (environment variables, not code)." /></li>
          <li><T pt="Faça um pagamento real de valor baixo e depois reembolse." en="Make a real low-value payment and then refund it." /></li>
          <li><T pt="Alertas: falhas de webhook, eventos não processados, divergência na conciliação." en="Alerts: webhook failures, unprocessed events, reconciliation mismatches." /></li>
        </ol>
      </Section>

      <Section id="cheat" title={<T pt="Cola" en="Cheat sheet" />}>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Faço" en="I do" />]}
          rows={[
            [<T pt="receber pagamento sem tocar no cartão" en="take payment without touching the card" />, <T pt="checkout hospedado do gateway" en="the gateway's hosted checkout" />],
            [<T pt="saber que foi pago" en="know it was paid" />, <T pt="webhook verificado (+ reconsulta na API)" en="verified webhook (+ re-fetch from the API)" />],
            [<T pt="ligar pagamento ao cliente certo" en="tie payment to the right customer" />, <T pt="tenant_id em metadata / external_reference" en="tenant_id in metadata / external_reference" />],
            [<T pt="não cobrar nem processar duas vezes" en="never charge or process twice" />, <T pt="chave de idempotência + tabela de event_id" en="idempotency key + event_id table" />],
            [<T pt="trocar de provedor no futuro" en="switch provider later" />, <T pt="interface PaymentProvider própria" en="your own PaymentProvider interface" />],
            [<T pt="liberar recursos por plano" en="unlock features by plan" />, <T pt="entitlements derivados de plano + status" en="entitlements derived from plan + status" />],
          ]}
        />
      </Section>

      <Sources
        links={[
          { label: "Stripe: Build a subscriptions integration", href: "https://docs.stripe.com/billing/subscriptions/build-subscriptions" },
          { label: "Stripe: Webhooks", href: "https://docs.stripe.com/webhooks" },
          { label: "Stripe: Idempotent requests", href: "https://docs.stripe.com/api/idempotent_requests" },
          { label: "Mercado Pago: Developers", href: "https://www.mercadopago.com.br/developers" },
          { label: "Asaas: Documentação da API", href: "https://docs.asaas.com/" },
          { label: "PCI Security Standards Council", href: "https://www.pcisecuritystandards.org/" },
        ]}
      />
    </>
  );
}
