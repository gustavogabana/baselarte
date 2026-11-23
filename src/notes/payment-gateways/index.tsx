import { Callout, CodeBlock, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "payment-gateways",
  title: "Pagamentos: Stripe, Mercado Pago e Asaas",
  seo: {
    title: "Gateways de pagamento: Stripe, Mercado Pago e Asaas",
    description: "Como integrar um gateway de pagamento do jeito simples: o fluxo de checkout, webhooks como fonte da verdade, idempotência, assinaturas ligadas a um tenant, Pix e boleto no Brasil e o que muda entre Stripe, Mercado Pago e Asaas.",
  },
  summary: "como integrar um gateway de pagamento de forma simples: checkout hospedado, webhooks como fonte da verdade com verificação de assinatura, idempotência, assinaturas ligadas a um tenant e direitos de acesso, Pix e boleto, e as diferenças entre Stripe, Mercado Pago e Asaas.",
  kicker: "Guia de estudo",
  heroTitle: <>Receber o dinheiro, <em>confiar no webhook.</em></>,
  heroLede: "Um gateway cuida de cartão, Pix e boleto para você nunca tocar em número de cartão. A integração é pequena: criar um checkout, receber um webhook, atualizar o banco. O cuidado está nos detalhes.",
  published: "2026-11-10",
  updated: "2026-11-10",
  toc: [
    {
      items: [
        { id: "what", title: "O que um gateway faz" },
        { id: "flow", title: "O fluxo em quatro passos" },
        { id: "providers", title: "Stripe, Mercado Pago e Asaas" },
        { id: "code", title: "Código: checkout e webhook" },
        { id: "saas", title: "Assinaturas num SaaS multi-tenant" },
        { id: "safe", title: "Segurança e confiabilidade" },
        { id: "test", title: "Testar e ir para produção" },
        { id: "cheat", title: "Cola" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que um gateway faz"}>
        <p>Um <strong>gateway de pagamento</strong> (Stripe, Mercado Pago, Asaas, Pagar.me, PayPal…) conversa com bandeiras, bancos e o Banco Central (Pix) por você. Ele guarda os dados do cartão, faz antifraude, gera boleto e QR Code Pix, repete cobranças de assinaturas e avisa o seu sistema quando algo muda. Você só guarda <em>identificadores</em> (id do cliente, da assinatura, do pagamento) e o <em>status</em>.</p>
        <Callout icon="shield">Nunca receba nem guarde número de cartão no seu servidor. Use a página hospedada do gateway (checkout) ou os campos hospedados do SDK: assim o cartão vai direto ao gateway e o seu escopo de conformidade PCI-DSS fica mínimo.</Callout>
      </Section>

      <Section id="flow" title={"O fluxo em quatro passos"}>
        <ol>
          <li><strong>Seu backend cria o checkout</strong> (ou a cobrança) via API, informando valor/plano, o cliente e um <code>metadata</code> com o seu <code>tenant_id</code>. Resposta: uma URL.</li>
          <li>O front redireciona o cliente para essa URL. Ele paga na página do gateway.</li>
          <li><strong>O gateway chama o seu webhook</strong> (POST) com o evento: pago, falhou, renovado, cancelado.</li>
          <li>Seu backend valida o webhook, atualiza o banco (plano ativo, pedido pago) e libera o acesso.</li>
        </ol>
        <Callout tone="warn" icon="alert">A página de sucesso (<code>?success=true</code>) <strong>não prova</strong> pagamento: o cliente pode digitar a URL, e no Pix/boleto o pagamento acontece minutos ou dias depois. Só o webhook (ou uma consulta à API do gateway) é fonte da verdade.</Callout>
      </Section>

      <Section id="providers" title={"Stripe, Mercado Pago e Asaas"}>
        <Table
          head={["", "Stripe", "Mercado Pago", "Asaas"]}
          rows={[
            ["Foco", "SaaS e cobrança global, ótima API e documentação", "e-commerce e marketplace na América Latina, base de usuários grande", "cobrança recorrente no Brasil: boleto, Pix, cartão, e emissão de nota"],
            ["Checkout pronto", <code>Checkout Session</code>, <>Checkout Pro (<code>preference</code>)</>, <>link de pagamento ou fatura de uma cobrança (<code>invoiceUrl</code>)</>],
            ["Assinaturas", "Billing: produtos, preços, trials, proration, portal do cliente", "assinaturas (preapproval), mais básicas", <>endpoint <code>/subscriptions</code>; gera uma cobrança por ciclo</>],
            ["Pix / boleto", "Pix e boleto disponíveis no Brasil; confira conta e região", "Pix, boleto e cartão nativos", "Pix, boleto e cartão nativos"],
            ["Autenticação", <>chave secreta no <code>Authorization: Bearer</code></>, <><code>access token</code> em <code>Authorization: Bearer</code></>, <>chave de API no cabeçalho <code>access_token</code></>],
            ["Webhook seguro", <>assinatura HMAC em <code>Stripe-Signature</code></>, <>assinatura em <code>x-signature</code>; o aviso traz só o id, consulte o pagamento na API</>, <>token que você define, enviado no cabeçalho <code>asaas-access-token</code></>],
            ["Ambiente de teste", <>modo teste com chaves <code>sk_test_…</code> e Stripe CLI</>, "credenciais e usuários de teste", "sandbox separado, com outra URL e outra chave"],
          ]}
        />
        <p>Como escolher: <strong>cobra de fora do Brasil ou quer o melhor cobrança recorrente?</strong> Stripe. <strong>Vende para consumidor brasileiro e quer a conta do Mercado Pago?</strong> Mercado Pago. <strong>Cobra empresas e pessoas recorrentemente por Pix/boleto, com cobrança automática e nota?</strong> Asaas. Taxas, prazos de recebimento e recursos mudam: confira a página de preços e a documentação atual antes de decidir.</p>
        <p>Para não ficar preso a um provedor, isole tudo atrás de uma interface sua (veja o código abaixo): o resto do app fala com PaymentProvider, não com o SDK.</p>
      </Section>

      <Section id="code" title={"Código: checkout e webhook"}>
        <h3>Uma interface sua</h3>
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
        <p>Eventos úteis: <code>checkout.session.completed</code>, <code>invoice.paid</code> (renovação paga), <code>invoice.payment_failed</code>, <code>customer.subscription.updated</code> e <code>customer.subscription.deleted</code>. Para o cliente trocar cartão ou cancelar sozinho, use o <em>Customer Portal</em> em vez de construir telas.</p>
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
        <Callout icon="check">Os trechos acima mostram a forma, não são cópias para colar: URLs de sandbox, nomes de campos e eventos mudam entre versões. Confirme cada campo na documentação do provedor.</Callout>
      </Section>

      <Section id="saas" title={"Assinaturas num SaaS multi-tenant"}>
        <p>Num app <a href="/notas/multi-tenant-saas/">multi-tenant</a>, quem paga é o <strong>tenant</strong>. Guarde o estado da cobrança nele e derive o que cada tenant pode usar (os <em>entitlements</em>) a partir do plano.</p>
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
        <p>Só quem tem a permissão <code>billing:manage</code> (normalmente <code>owner</code>) pode abrir o checkout ou o portal: é uma regra do <a href="/notas/rbac-abac/">RBAC</a>. Quando o pagamento falha, dê um período de tolerância e avise por e-mail antes de rebaixar; nunca apague dados do cliente por inadimplência.</p>
      </Section>

      <Section id="safe" title={"Segurança e confiabilidade"}>
        <h3>Webhooks: verificar, deduplicar, responder rápido</h3>
        <ul>
          <li>Verifique a assinatura (ou o token) antes de qualquer coisa. Sem isso, qualquer pessoa pode forjar “pagamento aprovado”.</li>
          <li>Gateways reenviam eventos (<em>at-least-once</em>) e podem entregar fora de ordem. Grave o <code>event_id</code> numa tabela com chave primária na <strong>mesma transação</strong> que o efeito: se já existe, ignore. É o padrão de <a href="/notas/idempotency/">Idempotência</a>.</li>
          <li>Responda 2xx rápido (em segundos). Se o trabalho for longo, grave o evento e processe numa fila.</li>
          <li>Não confie na ordem: ao receber um evento, prefira reconsultar o estado atual na API do gateway e gravar o resultado.</li>
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
        <h3>Outros cuidados</h3>
        <ul>
          <li>Ao criar cobranças, mande a <strong>chave de idempotência</strong> do provedor (Stripe: <code>Idempotency-Key</code>; Mercado Pago: <code>X-Idempotency-Key</code>) para um retry não cobrar duas vezes.</li>
          <li>Valores: use inteiros em centavos (Stripe) ou decimais do provedor com cuidado; nunca float em contas. O valor cobrado vem do SEU servidor/plano, nunca do navegador.</li>
          <li>Chaves secretas só em variáveis de ambiente do servidor; chaves de teste e de produção separadas; rotacione se vazar.</li>
          <li>LGPD: guarde o mínimo (ids e status); CPF/CNPJ só se o provedor exigir; registre o consentimento.</li>
          <li>Concilie: um job diário compara os pagamentos do provedor com o seu banco e alerta divergências (webhook perdido).</li>
          <li>Reembolsos e chargebacks também chegam por webhook: trate os eventos.</li>
        </ul>
      </Section>

      <Section id="test" title={"Testar e ir para produção"}>
        <CodeBlock code={`# Stripe: forward real test events to your local server
stripe listen --forward-to localhost:3000/webhooks/stripe
stripe trigger invoice.payment_failed

# Any provider locally: expose the port with a tunnel (e.g. cloudflared) and
# register the public URL as the webhook in the provider's sandbox
cloudflared tunnel --url http://localhost:3000`} />
        <ol>
          <li>No sandbox: pague, falhe, repita o mesmo evento duas vezes, envie fora de ordem e confirme que o estado final está certo.</li>
          <li>Teste a assinatura inválida: deve responder 400 e não mudar nada.</li>
          <li>Troque chaves, URL do webhook e segredos para os de produção (variáveis de ambiente, não código).</li>
          <li>Faça um pagamento real de valor baixo e depois reembolse.</li>
          <li>Alertas: falhas de webhook, eventos não processados, divergência na conciliação.</li>
        </ol>
      </Section>

      <Section id="cheat" title={"Cola"}>
        <Table
          head={["Quero…", "Faço"]}
          rows={[
            ["receber pagamento sem tocar no cartão", "checkout hospedado do gateway"],
            ["saber que foi pago", "webhook verificado (+ reconsulta na API)"],
            ["ligar pagamento ao cliente certo", "tenant_id em metadata / external_reference"],
            ["não cobrar nem processar duas vezes", "chave de idempotência + tabela de event_id"],
            ["trocar de provedor no futuro", "interface PaymentProvider própria"],
            ["liberar recursos por plano", "entitlements derivados de plano + status"],
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
