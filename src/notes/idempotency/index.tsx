import { Callout, CodeBlock, Diagram, Section, Sources, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "idempotency",
  title: "Idempotência: retries seguros em APIs e filas",
  seo: {
    title: "Idempotência: retries seguros em APIs e filas",
    description: "Como tornar operações seguras de repetir: métodos HTTP, o cabeçalho Idempotency-Key, restrições de unicidade e transações no Postgres, deduplicação de filas e webhooks, como testar (inclusive concorrência) e como operar em produção.",
  },
  summary: "como tornar operações seguras de repetir: métodos HTTP, o header Idempotency-Key, restrições únicas e transações no Postgres, deduplicação em filas e webhooks, como testar (inclusive concorrência) e como operar em produção.",
  kicker: "Guia de estudo",
  heroTitle: <>Idempotente por projeto, <em>seguro para repetir.</em></>,
  heroLede: "Como tornar uma operação segura de repetir: o que é idempotência, como implementar com chaves e restrições de unicidade, como verificar e como operar em produção.",
  published: "2026-10-19",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "what", title: "O que é idempotência" },
        { id: "why", title: "Onde as repetições aparecem" },
        { id: "implement", title: "Como implementar" },
        { id: "verify", title: "Como verificar" },
        { id: "prod", title: "Em produção" },
        { id: "lab", title: "Exercício: pagamentos sem cobrança dupla" },
        { id: "cheat-id", title: "Cola e revisão" },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={"O que é idempotência"}>
        <p>Uma operação é <strong>idempotente</strong> quando executá-la uma vez ou várias vezes com a mesma entrada deixa o sistema no mesmo estado final. Em matemática: <code>f(f(x)) = f(x)</code>. No dia a dia: apertar o botão do elevador cinco vezes não chama cinco elevadores.</p>
        <p>Em APIs isso importa porque a rede falha no pior momento: o servidor processa, a resposta se perde, e o cliente <em>não sabe</em> se deu certo. A única reação segura é tentar de novo, e tentar de novo só é seguro se a operação for idempotente.</p>
        <Diagram minWidth={620} caption={"Sem chave, o timeout seguido de retry duplica o efeito; com chave, o servidor reconhece o pedido repetido."}>
          <svg viewBox="0 0 700 320" role="img" aria-label="Retry sem e com chave de idempotência">
            <rect x="10" y="10" width="100" height="36" rx="4" className="ln fillsoft" />
            <text x="60" y="33" textAnchor="middle">cliente</text>
            <rect x="300" y="10" width="100" height="36" rx="4" className="ln" />
            <text x="350" y="33" className="" textAnchor="middle">API</text>
            <rect x="575" y="10" width="100" height="36" rx="4" className="ln fillsoft" />
            <text x="625" y="33" textAnchor="middle">banco</text>
            <path d="M60 46L60 310" className="ln dash" />
            <path d="M350 46L350 310" className="ln dash" />
            <path d="M625 46L625 310" className="ln dash" />
            <text x="70" y="70" className="mut" textAnchor="start">Sem chave: o retry cobra duas vezes</text>
            <path d="M60 96L350 96" className="ln" />
            <path d="M343.2 92.7L350 96L343.2 99.3" className="ln" />
            <text x="205" y="90" className="mono" textAnchor="middle">POST /charge</text>
            <path d="M350 112L625 112" className="ln" />
            <path d="M618.2 108.7L625 112L618.2 115.3" className="ln" />
            <text x="487" y="106" className="mut" textAnchor="middle">cobra #1</text>
            <text x="205" y="140" className="mut" textAnchor="middle">timeout: a resposta se perdeu</text>
            <path d="M60 166L350 166" className="ln" />
            <path d="M343.2 162.7L350 166L343.2 169.3" className="ln" />
            <text x="205" y="160" className="mono" textAnchor="middle">POST /charge (retry)</text>
            <path d="M350 182L625 182" className="ln" />
            <path d="M618.2 178.7L625 182L618.2 185.3" className="ln" />
            <text x="487" y="176" className="mut" textAnchor="middle">cobra #2 ✗</text>
            <path d="M10 204L690 204" className="ln dash" />
            <text x="70" y="228" className="mut" textAnchor="start">Com chave: o retry devolve o resultado salvo</text>
            <path d="M60 252L350 252" className="ln" />
            <path d="M343.2 248.7L350 252L343.2 255.3" className="ln" />
            <text x="205" y="246" className="mono" textAnchor="middle">POST + Key: k1</text>
            <path d="M350 268L625 268" className="ln" />
            <path d="M618.2 264.7L625 268L618.2 271.3" className="ln" />
            <text x="487" y="262" className="mut" textAnchor="middle">cobra #1</text>
            <path d="M60 296L350 296" className="ln" />
            <path d="M343.2 292.7L350 296L343.2 299.3" className="ln" />
            <text x="205" y="290" className="mono" textAnchor="middle">retry + Key: k1</text>
            <text x="487" y="300" className="mut" textAnchor="middle">k1 já visto: devolve o #1</text>
          </svg>
        </Diagram>
        <h3>Idempotente não é o mesmo que seguro</h3>
        <Table
          head={["Método", "Seguro?", "Idempotente?", "Observação"]}
          rows={[
            [<code>GET</code>, "sim", "sim", "só lê"],
            [<code>PUT</code>, "não", "sim", "substitui o recurso inteiro: repetir dá o mesmo resultado"],
            [<code>DELETE</code>, "não", "sim", "o 2º pode devolver 404, mas o estado final é o mesmo"],
            [<code>POST</code>, "não", "não", "cria algo novo a cada chamada: precisa de chave"],
            [<code>PATCH</code>, "não", "depende", <><code>&#123;"name":"Ana"&#125;</code> é idempotente; <code>&#123;"balance":"+10"&#125;</code> não</>],
          ]}
        />
        <Callout icon="check">Idempotente fala do <em>estado final</em>, não da resposta. Um <code>DELETE</code> repetido pode responder <code>404</code> em vez de <code>204</code> e continuar idempotente. A RFC 9110 define as coisas assim: o efeito pretendido no servidor é o mesmo.</Callout>
      </Section>
      <Section id="why" title={"Onde as repetições aparecem"}>
        <p>Você não precisa de um cliente mal-educado para receber a mesma requisição duas vezes. Ela vem de comportamento normal:</p>
        <ul>
          <li><strong>Timeout e retry</strong> do cliente, do SDK, do proxy ou do load balancer.</li>
          <li><strong>Clique duplo</strong> ou botão "voltar e reenviar" no navegador.</li>
          <li><strong>Filas "at-least-once"</strong> (SQS, Kafka, RabbitMQ): a mensagem pode ser entregue mais de uma vez.</li>
          <li><strong>Webhooks</strong>: Stripe, GitHub e outros reenviam o evento se você não responder 2xx a tempo.</li>
          <li><strong>Jobs e deploys</strong>: um worker morre no meio e o job é reexecutado do começo.</li>
        </ul>
        <p>Como "exatamente uma vez" não existe de verdade em sistemas distribuídos, o desenho prático é <strong>entrega pelo menos uma vez + processamento idempotente</strong>.</p>
      </Section>
      <Section id="implement" title={"Como implementar"}>
        <h3>1. Prefira operações naturalmente idempotentes</h3>
        <p>O jeito mais barato é desenhar a operação para que repetir não faça diferença: grave valores <em>absolutos</em> em vez de relativos, use <code>PUT</code> para substituir, e deixe o banco impor unicidade.</p>
        <CodeBlock code={`-- Naturally idempotent: the final state is the same no matter how many times it runs
INSERT INTO subscriptions (user_id, plan) VALUES (42, 'pro')
ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan;

UPDATE orders SET status = 'paid' WHERE id = 7;            -- set an absolute value: idempotent
-- UPDATE accounts SET balance = balance + 10 ...          -- relative change: NOT idempotent`} />
        <p>Dê ao cliente o poder de escolher o ID: <code>PUT /orders/&#123;uuid&#125;</code> é idempotente por construção, enquanto <code>POST /orders</code> deixa o servidor gerar um ID novo a cada chamada.</p>
        <h3>2. Idempotency-Key para o que não tem como ser idempotente (POST)</h3>
        <p>Para <code>POST</code>, o cliente gera uma chave única por <em>intenção</em> (um UUID) e a envia no cabeçalho <code>Idempotency-Key</code>. Em todo retry da mesma intenção, a mesma chave. O servidor guarda a chave junto com a resposta e, ao ver a chave de novo, devolve a resposta guardada em vez de executar outra vez. É o modelo da Stripe e do rascunho do IETF para o cabeçalho.</p>
        <CodeBlock code={`curl -X POST https://api.example.com/payments \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Idempotency-Key: 7c1f3a52-0e4b-4d0a-9a3e-5b2c8d1f6e90" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 1990}'`} />
        <h3>Tabela de chaves (Postgres)</h3>
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
        <h3>Middleware: reivindicar a chave, executar, salvar</h3>
        <Diagram minWidth={620} caption={"A chave é reivindicada com um INSERT; o índice único decide quem executa e quem só repete a resposta."}>
          <svg viewBox="0 0 700 170" role="img" aria-label="Fluxo da chave de idempotência">
            <rect x="10" y="20" width="110" height="44" rx="4" className="ln fillsoft" />
            <text x="65" y="46" textAnchor="middle">requisição</text>
            <rect x="170" y="20" width="150" height="44" rx="4" className="ln" />
            <text x="245" y="40" textAnchor="middle">INSERT da chave</text>
            <text x="245" y="56" className="mut mono" textAnchor="middle">(índice único)</text>
            <rect x="380" y="10" width="150" height="34" rx="4" className="brandfill" />
            <text x="455" y="32" textAnchor="middle">novo: executa e salva</text>
            <rect x="380" y="56" width="150" height="34" rx="4" className="ln fillsoft" />
            <text x="455" y="78" textAnchor="middle">visto: devolve o salvo</text>
            <rect x="555" y="56" width="140" height="34" rx="4" className="ln" />
            <text x="625" y="78" className="mut" textAnchor="middle">outro hash: 422</text>
            <path d="M120 42L170 42" className="ln" />
            <path d="M163.2 38.7L170 42L163.2 45.3" className="ln" />
            <path d="M320 34L380 27" className="ln" />
            <path d="M372.9 24.5L380 27L373.7 31.0" className="ln" />
            <path d="M320 52L380 73" className="ln" />
            <path d="M374.7 67.7L380 73L372.5 73.8" className="ln" />
            <path d="M530 73L555 73" className="ln" />
            <path d="M548.2 69.7L555 73L548.2 76.3" className="ln" />
            <text x="10" y="130" className="mut" textAnchor="start">Tudo (INSERT da chave + trabalho + resposta salva) acontece numa transação.</text>
            <text x="10" y="150" className="mut" textAnchor="start">Uma duplicata concorrente espera no INSERT e, depois do commit, só lê o resultado.</text>
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
          head={["Situação", "Resposta"]}
          rows={[
            ["Chave nova", <>executa e responde normalmente (<code>201</code>)</>],
            ["Mesma chave, mesmo corpo", <>devolve a resposta salva, com <code>Idempotent-Replayed: true</code></>],
            ["Mesma chave, corpo diferente", <><code>422</code>: a chave foi reutilizada para outra coisa (bug do cliente)</>],
            ["Sem a chave", <><code>400</code> (ou aceite como opcional, mas então sem proteção)</>],
            ["Falha antes do commit", "rollback libera a chave: o retry executa de verdade"],
          ]}
        />
        <Callout tone="warn" icon="alert">O trabalho e a gravação da chave <strong>precisam estar na mesma transação</strong>. Se a chave fosse salva em outro lugar (ou em outro banco, como Redis), um crash entre as duas gravações deixaria o efeito feito sem registro (duplica no retry) ou o registro feito sem efeito (perde a operação).</Callout>
        <h3>E quando o efeito é externo (chamar um gateway de pagamento)?</h3>
        <p>Aí uma transação local não basta: você não consegue dar rollback na cobrança. Repasse a <em>mesma</em> chave ao provedor (a Stripe aceita <code>Idempotency-Key</code> nas próprias chamadas), e use um estado intermediário (<code>processing</code> → <code>done</code>): um duplicado que chega enquanto o primeiro roda recebe <code>409</code> com <code>Retry-After</code>.</p>
        <h3>3. Consumidores de fila e webhooks</h3>
        <p>Mesmo princípio, outra chave: o <em>id da mensagem ou do evento</em>. Registre o id numa tabela com restrição de unicidade, na mesma transação do efeito.</p>
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
      <Section id="verify" title={"Como verificar"}>
        <p>Idempotência é uma propriedade que se <em>testa</em>, não que se presume. O teste central é sempre o mesmo: faça a operação N vezes e confira que o <strong>efeito colateral aconteceu uma vez só</strong>.</p>
        <h3>Na mão, com curl</h3>
        <CodeBlock code={`KEY=$(uuidgen)
for i in 1 2 3; do
  curl -si -X POST localhost:3000/payments \\
    -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" \\
    -d '{"amount":1990}' | grep -E "^HTTP|Idempotent-Replayed|\\"id\\""
done
# 1st: HTTP/1.1 201            2nd and 3rd: HTTP/1.1 201 + Idempotent-Replayed: true, same id

psql -c "SELECT count(*) FROM payments;"      # must be 1`} />
        <h3>Teste automatizado (inclui concorrência)</h3>
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
        <p>O teste em paralelo é o que pega o bug mais comum: um <code>SELECT</code> para ver se a chave existe, seguido de um <code>INSERT</code>. Entre os dois, outra requisição passa. Só uma restrição de unicidade no banco fecha essa janela.</p>
        <h3>Falhas injetadas</h3>
        <ul>
          <li><strong>Derrubar a resposta:</strong> use um proxy de falhas (Toxiproxy) ou um <code>kill</code> logo após o <code>COMMIT</code> e antes de responder. O retry deve devolver o resultado salvo, sem cobrar de novo.</li>
          <li><strong>Derrubar antes do commit:</strong> o retry precisa executar de verdade (a chave não pode ficar "presa").</li>
          <li><strong>Entrega duplicada:</strong> envie o mesmo evento duas vezes ao consumidor e confira o estado.</li>
          <li><strong>Propriedade:</strong> em testes de propriedade, para qualquer entrada <code>x</code>, <code>apply(apply(x))</code> deve dar o mesmo estado que <code>apply(x)</code>.</li>
        </ul>
      </Section>
      <Section id="prod" title={"Em produção"}>
        <Table
          head={["Ponto", "Prática"]}
          rows={[
            ["Geração da chave", <>o <strong>cliente</strong> gera (UUID v4) uma vez por intenção e a reutiliza em todo retry; nunca gere a chave a cada tentativa</>],
            ["Escopo", <>chave única <em>por usuário/tenant</em> (<code>PRIMARY KEY (user_id, key)</code>), para um cliente não colidir nem espiar outro</>],
            ["Validade (TTL)", "guarde por 24h a 7 dias e apague com um job; o prazo deve ser maior que a janela de retry dos clientes"],
            ["Onde guardar", <>no mesmo banco do efeito, na mesma transação; Redis (<code>SET NX</code>) só serve de trava rápida, não de registro durável</>],
            ["Corpo diferente", <>compare um hash do pedido e responda <code>422</code>; senão uma chave reaproveitada executa a coisa errada em silêncio</>],
            ["Só guarde respostas definitivas", "erros 5xx transitórios não devem \"queimar\" a chave; já 4xx de validação podem ser repetidos como estão"],
            ["Retries do cliente", <>backoff exponencial com jitter e limite de tentativas, respeitando <code>Retry-After</code></>],
            ["Observabilidade", "métricas de replays, conflitos (409) e hashes divergentes (422); log da chave em todo request"],
            ["Segurança", "trate a chave como dado do cliente: valide tamanho (ex.: até 255 caracteres) e formato, e nunca a use como caminho de arquivo"],
          ]}
        />
        <CodeBlock code={`-- job de limpeza (diário)
DELETE FROM idempotency_keys WHERE created_at < now() - interval '7 days';`} />
        <h3>Checklist antes de subir</h3>
        <ul>
          <li>Todo <code>POST</code> que cria dinheiro, pedido ou envio aceita <code>Idempotency-Key</code>.</li>
          <li>Existe restrição de unicidade no banco (não só um <code>SELECT</code> antes).</li>
          <li>Chave, efeito e resposta salva na mesma transação (ou a chave é repassada ao provedor externo).</li>
          <li>Consumidores de fila e webhooks deduplicam pelo id do evento.</li>
          <li>Há teste de concorrência e teste de falha entre o commit e a resposta.</li>
          <li>Existe TTL com job de limpeza e métricas de replay/409/422.</li>
        </ul>
        <Callout tone="warn" icon="alert">Um <code>POST</code> sem chave que o cliente repete automaticamente (SDK, proxy, fila) é uma cobrança dupla esperando para acontecer. Se não dá para exigir a chave, desligue os retries automáticos desse endpoint.</Callout>
      </Section>
      <Section id="lab" title={"Exercício: pagamentos sem cobrança dupla"}>
        <p>Pré-requisitos: Node.js, Docker e <code>curl</code>. Você vai subir um Postgres, criar as tabelas desta nota e provar que dez requisições simultâneas com a mesma chave geram um único pagamento.</p>
        <CodeBlock code={`docker run -d --name pg-idem -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:17
export PGPASSWORD=dev
psql -h localhost -U postgres -c "CREATE TABLE payments (id bigserial PRIMARY KEY, user_id bigint, amount int);"
# create idempotency_keys with the SQL from the "How to implement" section`} />
        <p>Monte a rota <code>POST /payments</code> (Express + <code>pg</code>) com a função <code>idempotent</code> acima e rode o servidor. Depois dispare as dez chamadas em paralelo:</p>
        <CodeBlock code={`KEY=$(uuidgen)
seq 10 | xargs -P 10 -I{} curl -s -o /dev/null -w "%{http_code}\\n" -X POST localhost:3000/payments \\
  -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" -d '{"amount":1990}' | sort | uniq -c

psql -h localhost -U postgres -c "SELECT count(*) FROM payments;"`} />
        <p><strong>Resultado esperado:</strong> as dez respostas são <code>201</code> (uma real, nove replays) e a contagem é <code>1</code>. Agora quebre de propósito: troque o <code>INSERT ... ON CONFLICT</code> por um <code>SELECT</code> seguido de <code>INSERT</code> e repita. Você deve ver mais de um pagamento: é a corrida que a restrição de unicidade evita.</p>
        <CodeBlock code={`docker rm -f pg-idem   # cleanup`} />
      </Section>
      <Section id="cheat-id" title={"Cola e revisão"}>
        <h3>Cola</h3>
        <Table
          head={["Quero…", "Uso"]}
          rows={[
            ["repetir sem efeito duplicado em POST", <><code>Idempotency-Key</code> + tabela com <code>PRIMARY KEY</code> + mesma transação</>],
            ["substituir um recurso", <><code>PUT /recurso/&#123;id&#125;</code> com ID escolhido pelo cliente</>],
            ["criar ou atualizar", <><code>INSERT ... ON CONFLICT DO UPDATE</code></>],
            ["processar fila/webhook uma vez", <>tabela <code>processed_events(event_id UNIQUE)</code> na mesma transação</>],
            ["chave reutilizada com outro corpo", <><code>422</code></>],
            ["duplicata ainda em execução", <><code>409</code> + <code>Retry-After</code></>],
            ["provar que funciona", "N chamadas paralelas, uma linha no banco; falha entre commit e resposta"],
          ]}
        />
        <h3>Perguntas de revisão</h3>
        <ul>
          <li>Por que <code>DELETE</code> é idempotente mesmo que a segunda chamada devolva <code>404</code>?</li>
          <li>Por que <code>POST</code> não é idempotente e como a <code>Idempotency-Key</code> resolve?</li>
          <li>Por que um <code>SELECT</code> seguido de <code>INSERT</code> não basta para deduplicar?</li>
          <li>Por que a chave e o efeito precisam estar na mesma transação?</li>
          <li>O que fazer quando o efeito é uma chamada a um provedor externo?</li>
          <li>Qual deve ser o TTL das chaves e o que decide esse valor?</li>
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
