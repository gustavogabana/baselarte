import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "idempotency",
  title: { en: "Idempotency: safe retries for APIs and queues", pt: "Idempotência: retries seguros em APIs e filas" },
  seo: {
    title: { en: "Idempotency: safe retries for APIs and queues", pt: "Idempotência: retries seguros em APIs e filas" },
    description: { en: "How to make operations safe to repeat: HTTP methods, the Idempotency-Key header, unique constraints and transactions in Postgres, queue and webhook deduplication, how to test it (including concurrency) and how to run it in production.", pt: "Como tornar operações seguras de repetir: métodos HTTP, o cabeçalho Idempotency-Key, restrições de unicidade e transações no Postgres, deduplicação de filas e webhooks, como testar (inclusive concorrência) e como operar em produção." },
  },
  summary: "how to make operations safe to repeat: HTTP methods, the Idempotency-Key header, unique constraints and transactions in Postgres, queue and webhook deduplication, how to test it (including concurrency) and how to run it in production.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>Idempotent by design, <em>safe to retry.</em></>, pt: <>Idempotente por projeto, <em>seguro para repetir.</em></> },
  heroLede: { en: "How to make an operation safe to repeat: what idempotency is, how to implement it with keys and unique constraints, how to verify it and how to run it in production.", pt: "Como tornar uma operação segura de repetir: o que é idempotência, como implementar com chaves e restrições de unicidade, como verificar e como operar em produção." },
  published: "2026-10-19",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é idempotência" en="What idempotency is" /> },
        { id: "why", title: <T pt="Onde as repetições aparecem" en="Where repeats come from" /> },
        { id: "implement", title: <T pt="Como implementar" en="How to implement" /> },
        { id: "verify", title: <T pt="Como verificar" en="How to verify" /> },
        { id: "prod", title: <T pt="Em produção" en="In production" /> },
        { id: "lab", title: <T pt="Exercício: pagamentos sem cobrança dupla" en="Exercise: payments without double charges" /> },
        { id: "cheat-id", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é idempotência" en="What idempotency is" />}>
        <p><T pt={<>Uma operação é <strong>idempotente</strong> quando executá-la uma vez ou várias vezes com a mesma entrada deixa o sistema no mesmo estado final. Em matemática: <code>f(f(x)) = f(x)</code>. No dia a dia: apertar o botão do elevador cinco vezes não chama cinco elevadores.</>} en={<>An operation is <strong>idempotent</strong> when running it once or many times with the same input leaves the system in the same final state. In maths: <code>f(f(x)) = f(x)</code>. In daily life: pressing the elevator button five times does not call five elevators.</>} /></p>
        <p><T pt={<>Em APIs isso importa porque a rede falha no pior momento: o servidor processa, a resposta se perde, e o cliente <em>não sabe</em> se deu certo. A única reação segura é tentar de novo, e tentar de novo só é seguro se a operação for idempotente.</>} en={<>In APIs this matters because the network fails at the worst moment: the server processes the request, the response is lost, and the client <em>does not know</em> whether it worked. The only safe reaction is to retry, and retrying is only safe if the operation is idempotent.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Sem chave, o timeout seguido de retry duplica o efeito; com chave, o servidor reconhece o pedido repetido." en="Without a key, a timeout followed by a retry duplicates the effect; with a key, the server recognises the repeated request." />}>
          <svg viewBox="0 0 700 320" role="img" aria-label="Retry sem e com chave de idempotência / Retry without and with an idempotency key">
            <rect x="10" y="10" width="100" height="36" rx="4" className="ln fillsoft" />
            <text x="60" y="33" className="pt" textAnchor="middle">cliente</text>
            <text x="60" y="33" className="en" textAnchor="middle">client</text>
            <rect x="300" y="10" width="100" height="36" rx="4" className="ln" />
            <text x="350" y="33" className="" textAnchor="middle">API</text>
            <rect x="575" y="10" width="100" height="36" rx="4" className="ln fillsoft" />
            <text x="625" y="33" className="pt" textAnchor="middle">banco</text>
            <text x="625" y="33" className="en" textAnchor="middle">database</text>
            <path d="M60 46L60 310" className="ln dash" />
            <path d="M350 46L350 310" className="ln dash" />
            <path d="M625 46L625 310" className="ln dash" />
            <text x="70" y="70" className="pt mut" textAnchor="start">Sem chave: o retry cobra duas vezes</text>
            <text x="70" y="70" className="en mut" textAnchor="start">Without a key: the retry charges twice</text>
            <path d="M60 96L350 96" className="ln" />
            <path d="M343.2 92.7L350 96L343.2 99.3" className="ln" />
            <text x="205" y="90" className="mono" textAnchor="middle">POST /charge</text>
            <path d="M350 112L625 112" className="ln" />
            <path d="M618.2 108.7L625 112L618.2 115.3" className="ln" />
            <text x="487" y="106" className="pt mut" textAnchor="middle">cobra #1</text>
            <text x="487" y="106" className="en mut" textAnchor="middle">charge #1</text>
            <text x="205" y="140" className="pt mut" textAnchor="middle">timeout: a resposta se perdeu</text>
            <text x="205" y="140" className="en mut" textAnchor="middle">timeout: the response was lost</text>
            <path d="M60 166L350 166" className="ln" />
            <path d="M343.2 162.7L350 166L343.2 169.3" className="ln" />
            <text x="205" y="160" className="mono" textAnchor="middle">POST /charge (retry)</text>
            <path d="M350 182L625 182" className="ln" />
            <path d="M618.2 178.7L625 182L618.2 185.3" className="ln" />
            <text x="487" y="176" className="pt mut" textAnchor="middle">cobra #2 ✗</text>
            <text x="487" y="176" className="en mut" textAnchor="middle">charge #2 ✗</text>
            <path d="M10 204L690 204" className="ln dash" />
            <text x="70" y="228" className="pt mut" textAnchor="start">Com chave: o retry devolve o resultado salvo</text>
            <text x="70" y="228" className="en mut" textAnchor="start">With a key: the retry returns the saved result</text>
            <path d="M60 252L350 252" className="ln" />
            <path d="M343.2 248.7L350 252L343.2 255.3" className="ln" />
            <text x="205" y="246" className="mono" textAnchor="middle">POST + Key: k1</text>
            <path d="M350 268L625 268" className="ln" />
            <path d="M618.2 264.7L625 268L618.2 271.3" className="ln" />
            <text x="487" y="262" className="pt mut" textAnchor="middle">cobra #1</text>
            <text x="487" y="262" className="en mut" textAnchor="middle">charge #1</text>
            <path d="M60 296L350 296" className="ln" />
            <path d="M343.2 292.7L350 296L343.2 299.3" className="ln" />
            <text x="205" y="290" className="mono" textAnchor="middle">retry + Key: k1</text>
            <text x="487" y="300" className="pt mut" textAnchor="middle">k1 já visto: devolve o #1</text>
            <text x="487" y="300" className="en mut" textAnchor="middle">k1 seen: returns #1</text>
          </svg>
        </Diagram>
        <h3><T pt="Idempotente não é o mesmo que seguro" en="Idempotent is not the same as safe" /></h3>
        <Table
          head={[<T pt="Método" en="Method" />, <T pt="Seguro?" en="Safe?" />, <T pt="Idempotente?" en="Idempotent?" />, <T pt="Observação" en="Note" />]}
          rows={[
            [<code>GET</code>, <T pt="sim" en="yes" />, <T pt="sim" en="yes" />, <T pt="só lê" en="read-only" />],
            [<code>PUT</code>, <T pt="não" en="no" />, <T pt="sim" en="yes" />, <T pt="substitui o recurso inteiro: repetir dá o mesmo resultado" en="replaces the whole resource: repeating gives the same result" />],
            [<code>DELETE</code>, <T pt="não" en="no" />, <T pt="sim" en="yes" />, <T pt="o 2º pode devolver 404, mas o estado final é o mesmo" en="the 2nd may return 404, but the final state is the same" />],
            [<code>POST</code>, <T pt="não" en="no" />, <T pt="não" en="no" />, <T pt="cria algo novo a cada chamada: precisa de chave" en="creates something new on each call: needs a key" />],
            [<code>PATCH</code>, <T pt="não" en="no" />, <T pt="depende" en="depends" />, <T pt={<><code>&#123;"name":"Ana"&#125;</code> é idempotente; <code>&#123;"balance":"+10"&#125;</code> não</>} en={<><code>&#123;"name":"Ana"&#125;</code> is idempotent; <code>&#123;"balance":"+10"&#125;</code> is not</>} />],
          ]}
        />
        <Callout icon="check"><T pt={<>Idempotente fala do <em>estado final</em>, não da resposta. Um <code>DELETE</code> repetido pode responder <code>404</code> em vez de <code>204</code> e continuar idempotente. A RFC 9110 define as coisas assim: o efeito pretendido no servidor é o mesmo.</>} en={<>Idempotent is about the <em>final state</em>, not the response. A repeated <code>DELETE</code> may answer <code>404</code> instead of <code>204</code> and still be idempotent. RFC 9110 defines it this way: the intended effect on the server is the same.</>} /></Callout>
      </Section>
      <Section id="why" title={<T pt="Onde as repetições aparecem" en="Where repeats come from" />}>
        <p><T pt="Você não precisa de um cliente mal-educado para receber a mesma requisição duas vezes. Ela vem de comportamento normal:" en="You do not need a badly behaved client to receive the same request twice. It comes from normal behaviour:" /></p>
        <ul>
          <li><T pt={<><strong>Timeout e retry</strong> do cliente, do SDK, do proxy ou do load balancer.</>} en={<><strong>Timeouts and retries</strong> from the client, SDK, proxy or load balancer.</>} /></li>
          <li><T pt={<><strong>Clique duplo</strong> ou botão "voltar e reenviar" no navegador.</>} en={<><strong>Double clicks</strong> or "back and resubmit" in the browser.</>} /></li>
          <li><T pt={<><strong>Filas "at-least-once"</strong> (SQS, Kafka, RabbitMQ): a mensagem pode ser entregue mais de uma vez.</>} en={<><strong>At-least-once queues</strong> (SQS, Kafka, RabbitMQ): a message may be delivered more than once.</>} /></li>
          <li><T pt={<><strong>Webhooks</strong>: Stripe, GitHub e outros reenviam o evento se você não responder 2xx a tempo.</>} en={<><strong>Webhooks</strong>: Stripe, GitHub and others resend the event if you do not answer 2xx in time.</>} /></li>
          <li><T pt={<><strong>Jobs e deploys</strong>: um worker morre no meio e o job é reexecutado do começo.</>} en={<><strong>Jobs and deploys</strong>: a worker dies halfway and the job is re-run from the start.</>} /></li>
        </ul>
        <p><T pt={<>Como "exatamente uma vez" não existe de verdade em sistemas distribuídos, o desenho prático é <strong>entrega pelo menos uma vez + processamento idempotente</strong>.</>} en={<>Because "exactly once" does not really exist in distributed systems, the practical design is <strong>at-least-once delivery + idempotent processing</strong>.</>} /></p>
      </Section>
      <Section id="implement" title={<T pt="Como implementar" en="How to implement" />}>
        <h3><T pt="1. Prefira operações naturalmente idempotentes" en="1. Prefer naturally idempotent operations" /></h3>
        <p><T pt={<>O jeito mais barato é desenhar a operação para que repetir não faça diferença: grave valores <em>absolutos</em> em vez de relativos, use <code>PUT</code> para substituir, e deixe o banco impor unicidade.</>} en={<>The cheapest way is to design the operation so that repeating it makes no difference: write <em>absolute</em> values instead of relative ones, use <code>PUT</code> to replace, and let the database enforce uniqueness.</>} /></p>
        <CodeBlock code={`-- Naturally idempotent: the final state is the same no matter how many times it runs
INSERT INTO subscriptions (user_id, plan) VALUES (42, 'pro')
ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan;

UPDATE orders SET status = 'paid' WHERE id = 7;            -- set an absolute value: idempotent
-- UPDATE accounts SET balance = balance + 10 ...          -- relative change: NOT idempotent`} />
        <p><T pt={<>Dê ao cliente o poder de escolher o ID: <code>PUT /orders/&#123;uuid&#125;</code> é idempotente por construção, enquanto <code>POST /orders</code> deixa o servidor gerar um ID novo a cada chamada.</>} en={<>Let the client choose the ID: <code>PUT /orders/&#123;uuid&#125;</code> is idempotent by construction, whereas <code>POST /orders</code> lets the server generate a new ID on every call.</>} /></p>
        <h3><T pt="2. Idempotency-Key para o que não tem como ser idempotente (POST)" en="2. Idempotency-Key for what cannot be idempotent (POST)" /></h3>
        <p><T pt={<>Para <code>POST</code>, o cliente gera uma chave única por <em>intenção</em> (um UUID) e a envia no cabeçalho <code>Idempotency-Key</code>. Em todo retry da mesma intenção, a mesma chave. O servidor guarda a chave junto com a resposta e, ao ver a chave de novo, devolve a resposta guardada em vez de executar outra vez. É o modelo da Stripe e do rascunho do IETF para o cabeçalho.</>} en={<>For <code>POST</code>, the client generates one unique key per <em>intent</em> (a UUID) and sends it in the <code>Idempotency-Key</code> header. Every retry of the same intent reuses the same key. The server stores the key with the response and, on seeing the key again, returns the stored response instead of running it again. This is the model used by Stripe and the IETF draft for the header.</>} /></p>
        <CodeBlock code={`curl -X POST https://api.example.com/payments \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Idempotency-Key: 7c1f3a52-0e4b-4d0a-9a3e-5b2c8d1f6e90" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 1990}'`} />
        <h3><T pt="Tabela de chaves (Postgres)" en="Key table (Postgres)" /></h3>
        <CodeBlock code={`CREATE TABLE idempotency_keys (
  user_id       bigint      NOT NULL,
  key           text        NOT NULL,
  request_hash  text        NOT NULL,          -- sha256 of method + path + body
  response_code int,
  response_body jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)                   -- the unique index does the real work
);
CREATE INDEX ON idempotency_keys (created_at);  -- for the cleanup job`} />
        <h3><T pt="Middleware: reivindicar a chave, executar, salvar" en="Middleware: claim the key, run, save" /></h3>
        <Diagram minWidth={620} caption={<T pt="A chave é reivindicada com um INSERT; o índice único decide quem executa e quem só repete a resposta." en="The key is claimed with an INSERT; the unique index decides who runs and who just replays the response." />}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Fluxo da chave de idempotência / Idempotency key flow">
            <rect x="10" y="20" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="46" className="pt" textAnchor="middle">requisição</text>
            <text x="65" y="46" className="en" textAnchor="middle">request</text>
            <rect x="170" y="20" width="150" height="44" rx="4" className="ln" />
            <text x="245" y="40" className="pt" textAnchor="middle">INSERT da chave</text>
            <text x="245" y="40" className="en" textAnchor="middle">INSERT the key</text>
            <text x="245" y="56" className="pt mut mono" textAnchor="middle">(índice único)</text>
            <text x="245" y="56" className="en mut mono" textAnchor="middle">(unique index)</text>
            <rect x="380" y="10" width="150" height="34" rx="4" className="brandfill" />
            <text x="455" y="32" className="pt" textAnchor="middle">novo: executa e salva</text>
            <text x="455" y="32" className="en" textAnchor="middle">new: run and save</text>
            <rect x="380" y="56" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="455" y="78" className="pt" textAnchor="middle">visto: devolve o salvo</text>
            <text x="455" y="78" className="en" textAnchor="middle">seen: replay saved</text>
            <rect x="555" y="56" width="140" height="34" rx="4" className="ln" />
            <text x="625" y="78" className="pt mut" textAnchor="middle">outro hash: 422</text>
            <text x="625" y="78" className="en mut" textAnchor="middle">other hash: 422</text>
            <path d="M120 42L170 42" className="ln" />
            <path d="M163.2 38.7L170 42L163.2 45.3" className="ln" />
            <path d="M320 34L380 27" className="ln" />
            <path d="M372.9 24.5L380 27L373.7 31.0" className="ln" />
            <path d="M320 52L380 73" className="ln" />
            <path d="M374.7 67.7L380 73L372.5 73.8" className="ln" />
            <path d="M530 73L555 73" className="ln" />
            <path d="M548.2 69.7L555 73L548.2 76.3" className="ln" />
            <text x="10" y="130" className="pt mut" textAnchor="start">Tudo (INSERT da chave + trabalho + resposta salva) acontece numa transação.</text>
            <text x="10" y="130" className="en mut" textAnchor="start">Everything (key INSERT + work + saved response) happens in one transaction.</text>
            <text x="10" y="150" className="pt mut" textAnchor="start">Uma duplicata concorrente espera no INSERT e, depois do commit, só lê o resultado.</text>
            <text x="10" y="150" className="en mut" textAnchor="start">A concurrent duplicate waits on the INSERT and, after the commit, just reads the result.</text>
          </svg>
        </Diagram>
        <CodeBlock code={`import { createHash } from 'node:crypto';
import type { Pool } from 'pg';

export async function idempotent(
  pool: Pool, userId: number, key: string, req: { method: string; path: string; body: unknown },
  work: (tx: import('pg').PoolClient) => Promise<{ status: number; body: unknown }>,
) {
  const hash = createHash('sha256')
    .update(\`\${req.method} \${req.path} \${JSON.stringify(req.body)}\`).digest('hex');

  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');

    // 1) Claim the key. A concurrent duplicate BLOCKS here until we commit or roll back.
    const claim = await tx.query(
      \`INSERT INTO idempotency_keys (user_id, key, request_hash)
       VALUES ($1, $2, $3) ON CONFLICT (user_id, key) DO NOTHING\`,
      [userId, key, hash],
    );

    if (claim.rowCount === 0) {
      // 2) Seen before: replay the saved response (or reject a reused key).
      const { rows: [saved] } = await tx.query(
        \`SELECT request_hash, response_code, response_body
           FROM idempotency_keys WHERE user_id = $1 AND key = $2\`, [userId, key]);
      await tx.query('COMMIT');
      if (saved.request_hash !== hash)
        return { status: 422, body: { error: 'Idempotency-Key reused with a different request' } };
      return { status: saved.response_code, body: saved.response_body, replayed: true };
    }

    // 3) First time: do the work and save the response in the SAME transaction.
    const result = await work(tx);
    await tx.query(
      \`UPDATE idempotency_keys SET response_code = $3, response_body = $4
        WHERE user_id = $1 AND key = $2\`,
      [userId, key, result.status, JSON.stringify(result.body)]);
    await tx.query('COMMIT');
    return result;
  } catch (err) {
    await tx.query('ROLLBACK');   // the key is released: the client can retry safely
    throw err;
  } finally {
    tx.release();
  }
}`} />
        <CodeBlock code={`app.post('/payments', async (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header is required' });

  const out = await idempotent(pool, req.user.id, key, req, async (tx) => {
    const { rows: [payment] } = await tx.query(
      'INSERT INTO payments (user_id, amount) VALUES ($1, $2) RETURNING id, amount',
      [req.user.id, req.body.amount]);
    return { status: 201, body: payment };
  });

  if (out.replayed) res.set('Idempotent-Replayed', 'true');
  res.status(out.status).json(out.body);
});`} />
        <Table
          head={[<T pt="Situação" en="Situation" />, <T pt="Resposta" en="Response" />]}
          rows={[
            [<T pt="Chave nova" en="New key" />, <T pt={<>executa e responde normalmente (<code>201</code>)</>} en={<>runs and responds normally (<code>201</code>)</>} />],
            [<T pt="Mesma chave, mesmo corpo" en="Same key, same body" />, <T pt={<>devolve a resposta salva, com <code>Idempotent-Replayed: true</code></>} en={<>returns the saved response, with <code>Idempotent-Replayed: true</code></>} />],
            [<T pt="Mesma chave, corpo diferente" en="Same key, different body" />, <T pt={<><code>422</code>: a chave foi reutilizada para outra coisa (bug do cliente)</>} en={<><code>422</code>: the key was reused for something else (client bug)</>} />],
            [<T pt="Sem a chave" en="No key" />, <T pt={<><code>400</code> (ou aceite como opcional, mas então sem proteção)</>} en={<><code>400</code> (or accept it as optional, but then without protection)</>} />],
            [<T pt="Falha antes do commit" en="Failure before commit" />, <T pt="rollback libera a chave: o retry executa de verdade" en="rollback releases the key: the retry really runs" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<>O trabalho e a gravação da chave <strong>precisam estar na mesma transação</strong>. Se a chave fosse salva em outro lugar (ou em outro banco, como Redis), um crash entre as duas gravações deixaria o efeito feito sem registro (duplica no retry) ou o registro feito sem efeito (perde a operação).</>} en={<>The work and the key write <strong>must be in the same transaction</strong>. If the key were saved elsewhere (or in another store like Redis), a crash between the two writes would leave the effect done with no record (duplicates on retry) or the record without the effect (loses the operation).</>} /></Callout>
        <h3><T pt="E quando o efeito é externo (chamar um gateway de pagamento)?" en="What if the effect is external (calling a payment gateway)?" /></h3>
        <p><T pt={<>Aí uma transação local não basta: você não consegue dar rollback na cobrança. Repasse a <em>mesma</em> chave ao provedor (a Stripe aceita <code>Idempotency-Key</code> nas próprias chamadas), e use um estado intermediário (<code>processing</code> → <code>done</code>): um duplicado que chega enquanto o primeiro roda recebe <code>409</code> com <code>Retry-After</code>.</>} en={<>Here a local transaction is not enough: you cannot roll back a charge. Forward the <em>same</em> key to the provider (Stripe accepts <code>Idempotency-Key</code> on its own calls), and use an intermediate state (<code>processing</code> → <code>done</code>): a duplicate that arrives while the first one runs gets a <code>409</code> with <code>Retry-After</code>.</>} /></p>
        <h3><T pt="3. Consumidores de fila e webhooks" en="3. Queue consumers and webhooks" /></h3>
        <p><T pt={<>Mesmo princípio, outra chave: o <em>id da mensagem ou do evento</em>. Registre o id numa tabela com restrição de unicidade, na mesma transação do efeito.</>} en={<>Same principle, different key: the <em>message or event id</em>. Record the id in a table with a unique constraint, in the same transaction as the effect.</>} /></p>
        <CodeBlock code={`// Queue consumer or webhook handler: dedupe by the message/event id, in the same transaction
async function handle(event: { id: string; type: string; data: unknown }) {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const seen = await tx.query(
      'INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING', [event.id]);
    if (seen.rowCount === 0) { await tx.query('COMMIT'); return; }   // duplicate: ack and skip

    await applyBusinessLogic(tx, event);                              // side effects in the DB
    await tx.query('COMMIT');
  } catch (err) {
    await tx.query('ROLLBACK');                                       // not acked: it will be redelivered
    throw err;
  } finally { tx.release(); }
}`} />
      </Section>
      <Section id="verify" title={<T pt="Como verificar" en="How to verify" />}>
        <p><T pt={<>Idempotência é uma propriedade que se <em>testa</em>, não que se presume. O teste central é sempre o mesmo: faça a operação N vezes e confira que o <strong>efeito colateral aconteceu uma vez só</strong>.</>} en={<>Idempotency is a property you <em>test</em>, not one you assume. The core test is always the same: run the operation N times and check that the <strong>side effect happened only once</strong>.</>} /></p>
        <h3><T pt="Na mão, com curl" en="By hand, with curl" /></h3>
        <CodeBlock code={`KEY=$(uuidgen)
for i in 1 2 3; do
  curl -si -X POST localhost:3000/payments \\
    -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" \\
    -d '{"amount":1990}' | grep -E "^HTTP|Idempotent-Replayed|\\"id\\""
done
# 1st: HTTP/1.1 201            2nd and 3rd: HTTP/1.1 201 + Idempotent-Replayed: true, same id

psql -c "SELECT count(*) FROM payments;"      # must be 1`} />
        <h3><T pt="Teste automatizado (inclui concorrência)" en="Automated test (including concurrency)" /></h3>
        <CodeBlock code={`import { test, expect } from 'vitest';

const KEY = crypto.randomUUID();
const call = (body = { amount: 1990 }) =>
  fetch('http://localhost:3000/payments', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': KEY, authorization: 'Bearer test' },
    body: JSON.stringify(body),
  });

test('same key, 10 parallel calls: exactly one payment', async () => {
  const responses = await Promise.all(Array.from({ length: 10 }, () => call()));
  const bodies = await Promise.all(responses.map((r) => r.json()));

  expect(new Set(bodies.map((b) => b.id)).size).toBe(1);               // all got the same payment
  expect(await countRows('payments WHERE user_id = 1')).toBe(1);        // one side effect
});

test('same key, different body: 422', async () => {
  const res = await call({ amount: 9999 });
  expect(res.status).toBe(422);
});`} />
        <p><T pt={<>O teste em paralelo é o que pega o bug mais comum: um <code>SELECT</code> para ver se a chave existe, seguido de um <code>INSERT</code>. Entre os dois, outra requisição passa. Só uma restrição de unicidade no banco fecha essa janela.</>} en={<>The parallel test catches the most common bug: a <code>SELECT</code> to check whether the key exists, followed by an <code>INSERT</code>. Between the two, another request slips through. Only a unique constraint in the database closes that window.</>} /></p>
        <h3><T pt="Falhas injetadas" en="Injected failures" /></h3>
        <ul>
          <li><T pt={<><strong>Derrubar a resposta:</strong> use um proxy de falhas (Toxiproxy) ou um <code>kill</code> logo após o <code>COMMIT</code> e antes de responder. O retry deve devolver o resultado salvo, sem cobrar de novo.</>} en={<><strong>Drop the response:</strong> use a fault proxy (Toxiproxy) or a <code>kill</code> right after the <code>COMMIT</code> and before responding. The retry must return the saved result, without charging again.</>} /></li>
          <li><T pt={<><strong>Derrubar antes do commit:</strong> o retry precisa executar de verdade (a chave não pode ficar "presa").</>} en={<><strong>Crash before the commit:</strong> the retry must really execute (the key must not get "stuck").</>} /></li>
          <li><T pt={<><strong>Entrega duplicada:</strong> envie o mesmo evento duas vezes ao consumidor e confira o estado.</>} en={<><strong>Duplicate delivery:</strong> send the same event twice to the consumer and check the state.</>} /></li>
          <li><T pt={<><strong>Propriedade:</strong> em testes de propriedade, para qualquer entrada <code>x</code>, <code>apply(apply(x))</code> deve dar o mesmo estado que <code>apply(x)</code>.</>} en={<><strong>Property:</strong> in property-based tests, for any input <code>x</code>, <code>apply(apply(x))</code> must give the same state as <code>apply(x)</code>.</>} /></li>
        </ul>
      </Section>
      <Section id="prod" title={<T pt="Em produção" en="In production" />}>
        <Table
          head={[<T pt="Ponto" en="Point" />, <T pt="Prática" en="Practice" />]}
          rows={[
            [<T pt="Geração da chave" en="Key generation" />, <T pt={<>o <strong>cliente</strong> gera (UUID v4) uma vez por intenção e a reutiliza em todo retry; nunca gere a chave a cada tentativa</>} en={<>the <strong>client</strong> generates it (UUID v4) once per intent and reuses it on every retry; never generate the key per attempt</>} />],
            [<T pt="Escopo" en="Scope" />, <T pt={<>chave única <em>por usuário/tenant</em> (<code>PRIMARY KEY (user_id, key)</code>), para um cliente não colidir nem espiar outro</>} en={<>unique <em>per user/tenant</em> (<code>PRIMARY KEY (user_id, key)</code>), so one client cannot collide with or peek at another</>} />],
            [<T pt="Validade (TTL)" en="Expiry (TTL)" />, <T pt="guarde por 24h a 7 dias e apague com um job; o prazo deve ser maior que a janela de retry dos clientes" en="keep for 24h to 7 days and delete with a job; the window must exceed your clients' retry window" />],
            [<T pt="Onde guardar" en="Where to store" />, <T pt={<>no mesmo banco do efeito, na mesma transação; Redis (<code>SET NX</code>) só serve de trava rápida, não de registro durável</>} en={<>in the same database as the effect, in the same transaction; Redis (<code>SET NX</code>) works only as a fast lock, not as a durable record</>} />],
            [<T pt="Corpo diferente" en="Different body" />, <T pt={<>compare um hash do pedido e responda <code>422</code>; senão uma chave reaproveitada executa a coisa errada em silêncio</>} en={<>compare a hash of the request and answer <code>422</code>; otherwise a reused key silently runs the wrong thing</>} />],
            [<T pt="Só guarde respostas definitivas" en="Store only final answers" />, <T pt={"erros 5xx transitórios não devem \"queimar\" a chave; já 4xx de validação podem ser repetidos como estão"} en={"transient 5xx errors must not \"burn\" the key; validation 4xx may be replayed as they are"} />],
            [<T pt="Retries do cliente" en="Client retries" />, <T pt={<>backoff exponencial com jitter e limite de tentativas, respeitando <code>Retry-After</code></>} en={<>exponential backoff with jitter and a retry cap, honouring <code>Retry-After</code></>} />],
            [<T pt="Observabilidade" en="Observability" />, <T pt="métricas de replays, conflitos (409) e hashes divergentes (422); log da chave em todo request" en="metrics for replays, conflicts (409) and mismatched hashes (422); log the key on every request" />],
            [<T pt="Segurança" en="Security" />, <T pt="trate a chave como dado do cliente: valide tamanho (ex.: até 255 caracteres) e formato, e nunca a use como caminho de arquivo" en="treat the key as client input: validate length (e.g. up to 255 chars) and format, and never use it as a file path" />],
          ]}
        />
        <CodeBlock code={`-- job de limpeza (diário)
DELETE FROM idempotency_keys WHERE created_at < now() - interval '7 days';`} />
        <h3><T pt="Checklist antes de subir" en="Pre-release checklist" /></h3>
        <ul>
          <li><T pt={<>Todo <code>POST</code> que cria dinheiro, pedido ou envio aceita <code>Idempotency-Key</code>.</>} en={<>Every <code>POST</code> that creates money, orders or shipments accepts <code>Idempotency-Key</code>.</>} /></li>
          <li><T pt={<>Existe restrição de unicidade no banco (não só um <code>SELECT</code> antes).</>} en={<>There is a unique constraint in the database (not just a <code>SELECT</code> beforehand).</>} /></li>
          <li><T pt="Chave, efeito e resposta salva na mesma transação (ou a chave é repassada ao provedor externo)." en="Key, effect and saved response in the same transaction (or the key is forwarded to the external provider)." /></li>
          <li><T pt="Consumidores de fila e webhooks deduplicam pelo id do evento." en="Queue consumers and webhooks deduplicate by event id." /></li>
          <li><T pt="Há teste de concorrência e teste de falha entre o commit e a resposta." en="There is a concurrency test and a failure test between the commit and the response." /></li>
          <li><T pt="Existe TTL com job de limpeza e métricas de replay/409/422." en="There is a TTL with a cleanup job and replay/409/422 metrics." /></li>
        </ul>
        <Callout tone="warn" icon="alert"><T pt={<>Um <code>POST</code> sem chave que o cliente repete automaticamente (SDK, proxy, fila) é uma cobrança dupla esperando para acontecer. Se não dá para exigir a chave, desligue os retries automáticos desse endpoint.</>} en={<>A keyless <code>POST</code> that the client retries automatically (SDK, proxy, queue) is a double charge waiting to happen. If you cannot require the key, turn off automatic retries for that endpoint.</>} /></Callout>
      </Section>
      <Section id="lab" title={<T pt="Exercício: pagamentos sem cobrança dupla" en="Exercise: payments without double charges" />}>
        <p><T pt={<>Pré-requisitos: Node.js, Docker e <code>curl</code>. Você vai subir um Postgres, criar as tabelas desta nota e provar que dez requisições simultâneas com a mesma chave geram um único pagamento.</>} en={<>Prerequisites: Node.js, Docker and <code>curl</code>. You will start a Postgres, create this note's tables and prove that ten simultaneous requests with the same key produce a single payment.</>} /></p>
        <CodeBlock code={`docker run -d --name pg-idem -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:17
export PGPASSWORD=dev
psql -h localhost -U postgres -c "CREATE TABLE payments (id bigserial PRIMARY KEY, user_id bigint, amount int);"
# create idempotency_keys with the SQL from the "How to implement" section`} />
        <p><T pt={<>Monte a rota <code>POST /payments</code> (Express + <code>pg</code>) com a função <code>idempotent</code> acima e rode o servidor. Depois dispare as dez chamadas em paralelo:</>} en={<>Build the <code>POST /payments</code> route (Express + <code>pg</code>) with the <code>idempotent</code> function above and run the server. Then fire the ten calls in parallel:</>} /></p>
        <CodeBlock code={`KEY=$(uuidgen)
seq 10 | xargs -P 10 -I{} curl -s -o /dev/null -w "%{http_code}\\n" -X POST localhost:3000/payments \\
  -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" -d '{"amount":1990}' | sort | uniq -c

psql -h localhost -U postgres -c "SELECT count(*) FROM payments;"`} />
        <p><T pt={<><strong>Resultado esperado:</strong> as dez respostas são <code>201</code> (uma real, nove replays) e a contagem é <code>1</code>. Agora quebre de propósito: troque o <code>INSERT ... ON CONFLICT</code> por um <code>SELECT</code> seguido de <code>INSERT</code> e repita. Você deve ver mais de um pagamento: é a corrida que a restrição de unicidade evita.</>} en={<><strong>Expected result:</strong> all ten responses are <code>201</code> (one real, nine replays) and the count is <code>1</code>. Now break it on purpose: replace the <code>INSERT ... ON CONFLICT</code> with a <code>SELECT</code> followed by an <code>INSERT</code> and repeat. You should see more than one payment: that is the race the unique constraint prevents.</>} /></p>
        <CodeBlock code={`docker rm -f pg-idem   # cleanup`} />
      </Section>
      <Section id="cheat-id" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="repetir sem efeito duplicado em POST" en="repeat a POST with no duplicate effect" />, <T pt={<><code>Idempotency-Key</code> + tabela com <code>PRIMARY KEY</code> + mesma transação</>} en={<><code>Idempotency-Key</code> + table with <code>PRIMARY KEY</code> + same transaction</>} />],
            [<T pt="substituir um recurso" en="replace a resource" />, <T pt={<><code>PUT /recurso/&#123;id&#125;</code> com ID escolhido pelo cliente</>} en={<><code>PUT /resource/&#123;id&#125;</code> with a client-chosen ID</>} />],
            [<T pt="criar ou atualizar" en="create or update" />, <T pt={<><code>INSERT ... ON CONFLICT DO UPDATE</code></>} en={<><code>INSERT ... ON CONFLICT DO UPDATE</code></>} />],
            [<T pt="processar fila/webhook uma vez" en="process a queue/webhook once" />, <T pt={<>tabela <code>processed_events(event_id UNIQUE)</code> na mesma transação</>} en={<><code>processed_events(event_id UNIQUE)</code> table in the same transaction</>} />],
            [<T pt="chave reutilizada com outro corpo" en="key reused with another body" />, <T pt={<><code>422</code></>} en={<><code>422</code></>} />],
            [<T pt="duplicata ainda em execução" en="duplicate still running" />, <T pt={<><code>409</code> + <code>Retry-After</code></>} en={<><code>409</code> + <code>Retry-After</code></>} />],
            [<T pt="provar que funciona" en="prove it works" />, <T pt="N chamadas paralelas, uma linha no banco; falha entre commit e resposta" en="N parallel calls, one row in the database; a failure between commit and response" />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt={<>Por que <code>DELETE</code> é idempotente mesmo que a segunda chamada devolva <code>404</code>?</>} en={<>Why is <code>DELETE</code> idempotent even when the second call returns <code>404</code>?</>} /></li>
          <li><T pt={<>Por que <code>POST</code> não é idempotente e como a <code>Idempotency-Key</code> resolve?</>} en={<>Why is <code>POST</code> not idempotent and how does <code>Idempotency-Key</code> fix it?</>} /></li>
          <li><T pt={<>Por que um <code>SELECT</code> seguido de <code>INSERT</code> não basta para deduplicar?</>} en={<>Why is a <code>SELECT</code> followed by an <code>INSERT</code> not enough to deduplicate?</>} /></li>
          <li><T pt="Por que a chave e o efeito precisam estar na mesma transação?" en="Why must the key and the effect be in the same transaction?" /></li>
          <li><T pt="O que fazer quando o efeito é uma chamada a um provedor externo?" en="What do you do when the effect is a call to an external provider?" /></li>
          <li><T pt="Qual deve ser o TTL das chaves e o que decide esse valor?" en="What should the key TTL be and what decides it?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "MDN: Idempotent", href: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent" },
          { label: "RFC 9110: Idempotent Methods", href: "https://www.rfc-editor.org/rfc/rfc9110#name-idempotent-methods" },
          { label: "IETF draft: The Idempotency-Key HTTP Header Field", href: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/" },
          { label: "Stripe: Idempotent requests", href: "https://docs.stripe.com/api/idempotent_requests" },
          { label: "AWS Builders' Library: Making retries safe with idempotent APIs", href: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/" },
        ]}
      />
    </>
  );
}
