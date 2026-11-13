import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "react-state",
  title: { en: "React: state with Context API and Zustand", pt: "React: estado com Context API e Zustand" },
  seo: {
    title: { en: "React state: Context API and Zustand", pt: "Estado no React: Context API e Zustand" },
    description: { en: "How React's Context API and Zustand work, from the official docs: createContext and useContext, the reducer + context pattern, selectors, per-request stores in Next.js, and when to use each.", pt: "Como funcionam a Context API do React e o Zustand, pela documentação oficial: createContext e useContext, o padrão reducer + contexto, seletores, stores por requisição no Next.js e quando usar cada um." },
  },
  summary: "from the official docs, prop drilling, createContext and useContext, the reducer + context pattern, Zustand stores and selectors, per-request stores in Next.js, and when to use each.",
  kicker: { en: "Study guide", pt: "Guia de estudo" },
  heroTitle: { en: <>State in React, <em>shared on purpose.</em></>, pt: <>Estado no React, <em>compartilhado de propósito.</em></> },
  heroLede: { en: "Context API and Zustand, straight from the official docs: how each works, how they behave in React and Next.js, and when to pick which.", pt: "Context API e Zustand direto da documentação oficial: como cada um funciona, como se comportam no React e no Next.js e quando escolher qual." },
  published: "2026-10-19",
  updated: "2026-10-23",
  toc: [
    {
      items: [
        { id: "why", title: <T pt="O problema que as duas resolvem" en="The problem both solve" /> },
        { id: "context", title: <T pt="Context API: o que o React já traz" en="Context API: what React ships with" /> },
        { id: "reducer", title: <T pt="Context + useReducer: o padrão oficial" en="Context + useReducer: the official pattern" /> },
        { id: "ctx-next", title: <T pt="Context no Next.js (App Router)" en="Context in Next.js (App Router)" /> },
        { id: "zustand", title: <T pt="Zustand: store, seletores e ações" en="Zustand: store, selectors and actions" /> },
        { id: "zustand-next", title: <T pt="Zustand no Next.js: um store por requisição" en="Zustand in Next.js: one store per request" /> },
        { id: "compare", title: <T pt="Context ou Zustand? Comparando" en="Context or Zustand? Comparing" /> },
        { id: "lab", title: <T pt="Exercício: tema e contador" en="Exercise: theme and counter" /> },
        { id: "cheat-rs", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="why" title={<T pt="O problema que as duas resolvem" en="The problem both solve" />}>
        <p><T pt={<>Quase todo app React precisa, cedo ou tarde, que dois componentes distantes enxerguem o mesmo dado: o usuário logado, o tema, o carrinho. Esta nota usa só a documentação oficial (react.dev, Next.js e Zustand) para mostrar as duas ferramentas mais comuns para isso: a <strong>Context API</strong>, que já vem no React, e o <strong>Zustand</strong>, uma biblioteca pequena de estado. E, principalmente, <em>quando</em> usar cada uma.</>} en={<>Almost every React app eventually needs two distant components to see the same data: the signed-in user, the theme, the cart. This note uses only the official documentation (react.dev, Next.js and Zustand) to show the two most common tools for that: the <strong>Context API</strong>, which ships with React, and <strong>Zustand</strong>, a small state library. And above all, <em>when</em> to use each one.</>} /></p>
        <h3><T pt="O problema: prop drilling" en="The problem: prop drilling" /></h3>
        <p><T pt={<>Props são o caminho normal para passar dados de pai para filho. Quando o dado precisa atravessar muitas camadas que não o usam, só para chegar lá embaixo, o código vira encanamento: isso é o <em>prop drilling</em>. A própria documentação do React manda tentar duas coisas antes de buscar contexto: <strong>passar props explicitamente</strong> (deixa o fluxo claro) e <strong>extrair componentes e passar JSX como <code>children</code></strong>, o que elimina camadas que só repassam dados.</>} en={<>Props are the normal way to pass data from parent to child. When the data has to cross many layers that do not use it just to reach the bottom, the code turns into plumbing: that is <em>prop drilling</em>. The React docs themselves say to try two things before reaching for context: <strong>pass props explicitly</strong> (it keeps the flow clear) and <strong>extract components and pass JSX as <code>children</code></strong>, which removes layers that only forward data.</>} /></p>
        <Table
          head={[<T pt="Onde o estado mora" en="Where the state lives" />, <T pt="Quando" en="When" />]}
          rows={[
            [<><code>useState</code> / <code>useReducer</code></>, <T pt="só um componente (ou seus filhos diretos) precisa" en="only one component (or its direct children) needs it" />],
            [<T pt={"Subir o estado (\"lifting up\")"} en="Lifting state up" />, <T pt="poucos irmãos precisam; props bastam" en="a few siblings need it; props are enough" />],
            ["Context API", <T pt="muitos componentes em profundidades diferentes leem o mesmo valor, que muda pouco (tema, usuário, idioma)" en="many components at different depths read the same value, which changes rarely (theme, user, language)" />],
            ["Zustand", <T pt="estado compartilhado que muda com frequência ou tem muitos consumidores, e você quer re-renderizar só quem usa a parte alterada" en="shared state that changes often or has many consumers, and you want to re-render only whoever uses the changed part" />],
          ]}
        />
      </Section>
      <Section id="context" title={<T pt="Context API: o que o React já traz" en="Context API: what React ships with" />}>
        <p><T pt={<>Context deixa um componente pai oferecer um valor a <em>toda a subárvore</em> abaixo dele, em qualquer profundidade, sem passar props camada por camada. São três passos:</>} en={<>Context lets a parent component offer a value to <em>the whole subtree</em> below it, at any depth, without passing props layer by layer. There are three steps:</>} /></p>
        <ul>
          <li><T pt={<><strong>Criar</strong> o contexto com <code>createContext(valorPadrão)</code> e exportá-lo.</>} en={<><strong>Create</strong> the context with <code>createContext(defaultValue)</code> and export it.</>} /></li>
          <li><T pt={<><strong>Usar</strong> o valor em qualquer componente com <code>useContext(MeuContexto)</code>.</>} en={<><strong>Use</strong> the value in any component with <code>useContext(MyContext)</code>.</>} /></li>
          <li><T pt={<><strong>Prover</strong> o valor a partir de um ancestral, envolvendo os filhos em <code>&lt;MeuContexto value=&#123;...&#125;&gt;</code>.</>} en={<><strong>Provide</strong> the value from an ancestor by wrapping the children in <code>&lt;MyContext value=&#123;...&#125;&gt;</code>.</>} /></li>
        </ul>
        <CodeBlock code={`// ThemeContext.js
import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext('light');   // 1) criar (valor padrão: 'light')

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    // 3) prover (React 19: o próprio contexto é o provider)
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  return useContext(ThemeContext);                     // 2) usar
}

// Qualquer componente, em qualquer profundidade:
function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme}</button>;
}`} />
        <Table
          head={[<T pt="Regra da documentação" en="Rule from the docs" />, <T pt="Significa" en="Meaning" />]}
          rows={[
            [<T pt="O provider mais próximo vence" en="Nearest provider wins" />, <T pt="é como herança de CSS; providers aninhados sobrescrevem o valor só para a sua subárvore" en="like CSS inheritance; nested providers override the value only for their subtree" />],
            [<T pt="O valor padrão só vale sem provider" en="The default only applies without a provider" />, <T pt={<>nunca muda; escolha um padrão útil (<code>'light'</code>, não <code>null</code>) e os testes funcionam sem provider</>} en={<>it never changes; pick a useful default (<code>'light'</code>, not <code>null</code>) and tests work without a provider</>} />],
            [<T pt={<>O provider fica <em>acima</em></>} en={<>The provider sits <em>above</em></>} />, <T pt={<><code>useContext</code> não enxerga o provider renderizado pelo mesmo componente</>} en={<><code>useContext</code> does not see a provider rendered by the same component</>} />],
            [<T pt="Componentes intermediários não importam" en="Intermediate components do not matter" />, <T pt={<>podem existir quantos quiser, até <code>&lt;div&gt;</code>; nem <code>memo</code> impede o consumidor de receber o valor novo</>} en={<>there can be any number, even <code>&lt;div&gt;</code>; not even <code>memo</code> stops a consumer from receiving the new value</>} />],
            [<T pt={<>Sempre <code>value</code></>} en={<>Always <code>value</code></>} />, <T pt={<>escrever <code>&lt;Ctx theme=&#123;theme&#125;&gt;</code> em vez de <code>value=</code> faz o consumidor receber <code>undefined</code></>} en={<>writing <code>&lt;Ctx theme=&#123;theme&#125;&gt;</code> instead of <code>value=</code> makes consumers receive <code>undefined</code></>} />],
          ]}
        />
        <Callout icon="check"><T pt={<>Em React 18 e anterior o provider se escrevia <code>&lt;MeuContexto.Provider value=&#123;...&#125;&gt;</code>. Em React 19 o contexto vira o provider (<code>&lt;MeuContexto value=&#123;...&#125;&gt;</code>); a forma antiga ainda aparece em muito código e em alguns trechos da documentação do Next.js.</>} en={<>In React 18 and earlier the provider was written <code>&lt;MyContext.Provider value=&#123;...&#125;&gt;</code>. In React 19 the context itself is the provider (<code>&lt;MyContext value=&#123;...&#125;&gt;</code>); the old form still shows up in a lot of code and in some Next.js docs snippets.</>} /></Callout>
        <h3><T pt="A pegadinha: re-render de todos os consumidores" en="The catch: every consumer re-renders" /></h3>
        <p><T pt={<>Quando o <code>value</code> do provider muda (comparado com <code>Object.is</code>), o React re-renderiza <strong>todos</strong> os componentes que leem aquele contexto. Não existe "selecionar só uma parte". E um objeto ou função escrito direto no <code>value</code> é novo a cada render do pai, o que dispara re-render nos consumidores mesmo sem mudança real. A documentação mostra a correção com <code>useMemo</code> e <code>useCallback</code>:</>} en={<>When the provider's <code>value</code> changes (compared with <code>Object.is</code>), React re-renders <strong>all</strong> components that read that context. There is no "select only one part". And an object or function written straight into <code>value</code> is new on every parent render, which triggers consumer re-renders even with no real change. The docs show the fix with <code>useMemo</code> and <code>useCallback</code>:</>} /></p>
        <CodeBlock code={`function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({ currentUser, login }), [currentUser, login]);

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}`} />
      </Section>
      <Section id="reducer" title={<T pt="Context + useReducer: o padrão oficial" en="Context + useReducer: the official pattern" />}>
        <p><T pt={<>Para estado com várias ações (adicionar, remover, editar), a documentação do React recomenda juntar <code>useReducer</code> com contexto. O padrão: <strong>dois contextos</strong>, um para ler o estado e outro para o <code>dispatch</code>, mais <em>custom hooks</em> para esconder a fiação. Quem só dispara ações não precisa re-renderizar quando o estado muda, porque o <code>dispatch</code> nunca muda de identidade.</>} en={<>For state with several actions (add, remove, edit), the React docs recommend combining <code>useReducer</code> with context. The pattern: <strong>two contexts</strong>, one to read the state and another for <code>dispatch</code>, plus <em>custom hooks</em> to hide the wiring. Whoever only fires actions does not need to re-render when state changes, because <code>dispatch</code> never changes identity.</>} /></p>
        <CodeBlock code={`// TasksContext.js — contexto, reducer, provider e hooks no mesmo arquivo
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export const useTasks = () => useContext(TasksContext);
export const useTasksDispatch = () => useContext(TasksDispatchContext);

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':   return [...tasks, { id: action.id, text: action.text, done: false }];
    case 'deleted': return tasks.filter((t) => t.id !== action.id);
    default: throw Error('Unknown action: ' + action.type);
  }
}
const initialTasks = [];

// Em qualquer lugar abaixo do provider:
const tasks = useTasks();
const dispatch = useTasksDispatch();
dispatch({ type: 'added', id: nextId++, text });`} />
        <p><T pt="Um app pode ter vários pares assim (um para tarefas, outro para o usuário, outro para o tema). Separar contextos por assunto também limita o estrago do re-render: mudar o tema não acorda quem só lê tarefas." en="An app can have several such pairs (one for tasks, another for the user, another for the theme). Splitting contexts by topic also limits the re-render cost: changing the theme does not wake up whoever only reads tasks." /></p>
      </Section>
      <Section id="ctx-next" title={<T pt="Context no Next.js (App Router)" en="Context in Next.js (App Router)" />}>
        <p><T pt={<>O App Router do Next.js faz de <strong>Server Components</strong> o padrão para layouts e páginas. Eles buscam dados, usam segredos e não enviam JavaScript ao navegador, mas <strong>não suportam contexto nem hooks</strong>. Ou seja: o contexto vive só nos <strong>Client Components</strong> (arquivos com <code>'use client'</code>).</>} en={<>The Next.js App Router makes <strong>Server Components</strong> the default for layouts and pages. They fetch data, use secrets and ship no JavaScript to the browser, but they <strong>do not support context or hooks</strong>. In other words: context lives only in <strong>Client Components</strong> (files with <code>'use client'</code>).</>} /></p>
        <p><T pt={<>A receita oficial: criar um Client Component que recebe <code>children</code> e importá-lo no <code>layout</code>, que continua sendo um Server Component.</>} en={<>The official recipe: create a Client Component that accepts <code>children</code> and import it in the <code>layout</code>, which stays a Server Component.</>} /></p>
        <CodeBlock code={`// app/theme-provider.tsx
'use client';
import { createContext } from 'react';

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

// app/layout.tsx  (Server Component)
import ThemeProvider from './theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}`} />
        <ul>
          <li><T pt={<><strong>Provider o mais fundo possível.</strong> Note que o <code>ThemeProvider</code> envolve só <code>&#123;children&#125;</code>, não o <code>&lt;html&gt;</code> inteiro: assim o Next.js consegue otimizar as partes estáticas dos Server Components.</>} en={<><strong>Providers as deep as possible.</strong> Note that <code>ThemeProvider</code> wraps only <code>&#123;children&#125;</code>, not the whole <code>&lt;html&gt;</code>: that lets Next.js optimize the static parts of your Server Components.</>} /></li>
          <li><T pt={<><strong><code>'use client'</code> é uma fronteira.</strong> Tudo que o arquivo importa e renderiza diretamente entra no bundle do cliente; Server Components passados como <code>children</code> continuam no servidor.</>} en={<><strong><code>'use client'</code> is a boundary.</strong> Everything the file imports and renders directly goes into the client bundle; Server Components passed as <code>children</code> stay on the server.</>} /></li>
          <li><T pt={<><strong>Dados do servidor chegam por props.</strong> Um Server Component busca o dado e o passa a um Client Component como prop (precisa ser serializável); só então ele pode ir para um contexto ou store.</>} en={<><strong>Server data arrives via props.</strong> A Server Component fetches the data and passes it to a Client Component as a prop (it must be serializable); only then can it go into a context or store.</>} /></li>
        </ul>
      </Section>
      <Section id="zustand" title={<T pt="Zustand: store, seletores e ações" en="Zustand: store, selectors and actions" />}>
        <p><T pt={<>O Zustand é uma biblioteca pequena de estado com API de hooks, pouca cerimônia e <strong>sem provider</strong> no uso básico. O <em>store</em> é um hook criado com <code>create</code>; ele guarda dados <em>e</em> as ações que os alteram.</>} en={<>Zustand is a small state library with a hooks API, little ceremony and <strong>no provider</strong> in basic use. The <em>store</em> is a hook created with <code>create</code>; it holds data <em>and</em> the actions that change it.</>} /></p>
        <CodeBlock code={`npm install zustand`} />
        <CodeBlock code={`import { create } from 'zustand';

const useBear = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

function BearCounter() {
  const bears = useBear((state) => state.bears);       // seletor: pega só o que usa
  return <h1>{bears} bears around here...</h1>;
}

function Controls() {
  const increasePopulation = useBear((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}`} />
        <h3><T pt="Seletores: a diferença que importa" en="Selectors: the difference that matters" /></h3>
        <p><T pt={<>Cada componente passa ao hook um <strong>seletor</strong>, uma função que escolhe um pedaço do estado. O componente só re-renderiza quando o resultado do seletor muda (comparado com <code>Object.is</code>). No exemplo, o <code>BearCounter</code> atualiza quando <code>bears</code> muda; o <code>Controls</code> lê só a função e quase nunca re-renderiza.</>} en={<>Each component hands the hook a <strong>selector</strong>, a function that picks a slice of the state. The component re-renders only when the selector's result changes (compared with <code>Object.is</code>). In the example, <code>BearCounter</code> updates when <code>bears</code> changes; <code>Controls</code> reads only the function and almost never re-renders.</>} /></p>
        <p><T pt={<>Cuidado com seletores que devolvem um valor <em>novo</em> a cada chamada (como <code>Object.keys(state)</code>, que cria um array novo): eles re-renderizam a cada mudança do store. A correção oficial é embrulhar o seletor em <code>useShallow</code>, que compara o resultado de forma rasa:</>} en={<>Beware of selectors that return a <em>new</em> value on every call (like <code>Object.keys(state)</code>, which builds a new array): they re-render on every store change. The official fix is to wrap the selector in <code>useShallow</code>, which compares the result shallowly:</>} /></p>
        <CodeBlock code={`import { useShallow } from 'zustand/react/shallow';

const names = useMeals(useShallow((state) => Object.keys(state)));`} />
        <h3><T pt="Atualizando o estado" en="Updating state" /></h3>
        <ul>
          <li><T pt={<><strong><code>set</code> faz mesclagem rasa:</strong> passe só as chaves que mudam; as outras do primeiro nível continuam.</>} en={<><strong><code>set</code> merges shallowly:</strong> pass only the keys that change; the other first-level keys stay.</>} /></li>
          <li><T pt={<><strong>Objetos aninhados são imutáveis:</strong> copie cada nível com spread (<code>...state.deep</code>) ou use o middleware <strong>Immer</strong> para escrever em estilo "mutável" dentro de <code>produce</code>.</>} en={<><strong>Nested objects are immutable:</strong> copy each level with spread (<code>...state.deep</code>) or use the <strong>Immer</strong> middleware to write in a "mutable" style inside <code>produce</code>.</>} /></li>
          <li><T pt={<><strong>Em TypeScript</strong> use a forma curried <code>create&lt;Estado&gt;()((set) =&gt; ...)</code> para tipar o store.</>} en={<><strong>In TypeScript</strong> use the curried form <code>create&lt;State&gt;()((set) =&gt; ...)</code> to type the store.</>} /></li>
        </ul>
        <CodeBlock code={`set((state) => ({
  deep: {
    ...state.deep,
    nested: { ...state.deep.nested, count: state.deep.nested.count + 1 },
  },
}));`} />
      </Section>
      <Section id="zustand-next" title={<T pt="Zustand no Next.js: um store por requisição" en="Zustand in Next.js: one store per request" />}>
        <p><T pt={<>Aqui está a pegadinha central. Um store criado com <code>create</code> é <strong>estado de módulo</strong>, global. Um servidor Next.js atende muitas requisições ao mesmo tempo; se o store for global, <strong>o estado de um usuário pode vazar para a renderização de outro</strong>. Por isso o guia oficial do Zustand para Next.js manda criar o store <strong>por requisição</strong>, com uma fábrica, e distribuí-lo por contexto.</>} en={<>Here is the central catch. A store created with <code>create</code> is <strong>module state</strong>, global. A Next.js server handles many requests at once; if the store is global, <strong>one user's state can leak into another's render</strong>. That is why the official Zustand guide for Next.js says to create the store <strong>per request</strong>, with a factory, and distribute it through context.</>} /></p>
        <CodeBlock code={`// src/stores/counter-store.ts — a fábrica (zustand/vanilla)
import { createStore } from 'zustand/vanilla';

export type CounterState = { count: number };
export type CounterActions = { incrementCount: () => void; decrementCount: () => void };
export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = { count: 0 };

export const createCounterStore = (initState: CounterState = defaultInitState) =>
  createStore<CounterStore>()((set) => ({
    ...initState,
    incrementCount: () => set((s) => ({ count: s.count + 1 })),
    decrementCount: () => set((s) => ({ count: s.count - 1 })),
  }));`} />
        <CodeBlock code={`// src/providers/counter-store-provider.tsx
'use client';
import { type ReactNode, createContext, useState, useContext } from 'react';
import { useStore } from 'zustand';
import { type CounterStore, createCounterStore } from '@/stores/counter-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;
const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export const CounterStoreProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() => createCounterStore());   // criado uma vez por instância
  return <CounterStoreContext.Provider value={store}>{children}</CounterStoreContext.Provider>;
};

export const useCounterStore = <T,>(selector: (s: CounterStore) => T): T => {
  const ctx = useContext(CounterStoreContext);
  if (!ctx) throw new Error('useCounterStore must be used within CounterStoreProvider');
  return useStore(ctx, selector);
};`} />
        <CodeBlock code={`// src/app/layout.tsx — App Router (no Pages Router: dentro do _app)
import { CounterStoreProvider } from '@/providers/counter-store-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  );
}

// src/components/home-page.tsx
'use client';
import { useCounterStore } from '@/providers/counter-store-provider';

export const HomePage = () => {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.incrementCount);
  return <button onClick={increment}>Count: {count}</button>;
};`} />
        <Callout icon="check"><T pt={<>Repare: aqui o Zustand usa <strong>Context só como encanamento</strong> para entregar a instância do store. O re-render seletivo continua vindo dos seletores. A consequência prática é que o contexto distribui <em>onde está</em> o store, mas não o faz re-renderizar todo mundo (a referência do store nunca muda).</>} en={<>Note: here Zustand uses <strong>Context only as plumbing</strong> to deliver the store instance. Selective re-rendering still comes from selectors. The practical result is that context distributes <em>where the store is</em> without re-rendering everyone (the store reference never changes).</>} /></Callout>
        <ul>
          <li><T pt={<><strong>Server Components não leem nem escrevem no store.</strong> Eles não usam hooks nem contexto; busque dados no servidor e passe-os por props.</>} en={<><strong>Server Components neither read nor write the store.</strong> They cannot use hooks or context; fetch data on the server and pass it down as props.</>} /></li>
          <li><T pt={<><strong>Hidratação:</strong> o Next.js renderiza no servidor e de novo no cliente; se os dois resultados diferem, há erro de hidratação. Inicialize o store no servidor com dados e reinicialize no cliente com os <em>mesmos</em> dados (a fábrica aceita um <code>initState</code> para isso). Valores do navegador, como <code>localStorage</code> ou <code>window.matchMedia</code>, só devem ser lidos depois da hidratação.</>} en={<><strong>Hydration:</strong> Next.js renders on the server and again on the client; if the two outputs differ you get a hydration error. Initialise the store on the server with data and re-initialise on the client with the <em>same</em> data (the factory accepts an <code>initState</code> for that). Browser-only values such as <code>localStorage</code> or <code>window.matchMedia</code> should be read only after hydration.</>} /></li>
          <li><T pt={<><strong>Um store por rota</strong> é possível (provider dentro da página), mas o guia desaconselha, a menos que cada rota precise de um store separado.</>} en={<><strong>One store per route</strong> is possible (provider inside the page), but the guide advises against it unless each route truly needs a separate store.</>} /></li>
        </ul>
      </Section>
      <Section id="compare" title={<T pt="Context ou Zustand? Comparando" en="Context or Zustand? Comparing" />}>
        <Table
          head={[<T pt="" en="" />, <T pt="Context API" en="Context API" />, <T pt="Zustand" en="Zustand" />]}
          rows={[
            [<T pt="Vem de onde" en="Where it comes from" />, <T pt="React (nada a instalar)" en="React (nothing to install)" />, <T pt="biblioteca separada" en="separate library" />],
            [<T pt="Provider" en="Provider" />, <T pt="obrigatório" en="required" />, <T pt="não, no uso básico; no Next.js, sim (store por requisição)" en="not in basic use; in Next.js, yes (per-request store)" />],
            [<T pt="Re-render" en="Re-render" />, <T pt={<>todo consumidor quando o <code>value</code> muda</>} en={<>every consumer when <code>value</code> changes</>} />, <T pt="só quem usa o pedaço mudado (seletores)" en="only whoever uses the changed slice (selectors)" />],
            [<T pt="Onde fica a lógica" en="Where logic lives" />, <T pt={<>em <code>useState</code>/<code>useReducer</code> do provider</>} en={<>in the provider's <code>useState</code>/<code>useReducer</code></>} />, <T pt="dentro do store (dados + ações juntos)" en="inside the store (data + actions together)" />],
            [<T pt="Uso fora de componentes" en="Use outside components" />, <T pt="não" en="no" />, <T pt={<>sim (o store é um objeto com <code>getState</code>)</>} en={<>yes (the store is an object with <code>getState</code>)</>} />],
            [<T pt="Melhor para" en="Best for" />, <T pt="valores estáveis e injeção de dependência: tema, idioma, usuário" en="stable values and dependency injection: theme, language, user" />, <T pt="estado de cliente dinâmico: carrinho, filtros, UI complexa, editores" en="dynamic client state: cart, filters, complex UI, editors" />],
          ]}
        />
        <Diagram minWidth={640} caption={<T pt="A diferença central: Context avisa todos os consumidores; Zustand compara o resultado de cada seletor." en="The core difference: Context notifies every consumer; Zustand compares each selector's result." />}>
          <svg viewBox="0 0 700 250" role="img" aria-label="Re-render: Context vs Zustand">
            <text x="10" y="20" className="pt mut">Context: o valor muda e TODOS os consumidores re-renderizam</text>
            <text x="10" y="20" className="en mut">Context: the value changes and ALL consumers re-render</text>
            <rect x="10" y="32" width="140" height="44" rx="4" className="ln fillsoft" />
            <text x="80" y="59" className="mono" textAnchor="middle">Provider</text>
            <rect x="190" y="32" width="100" height="44" rx="4" className="ln fillsoft" />
            <text x="240" y="59" className="mono" textAnchor="middle">A ↻</text>
            <rect x="310" y="32" width="100" height="44" rx="4" className="ln fillsoft" />
            <text x="360" y="59" className="mono" textAnchor="middle">B ↻</text>
            <rect x="430" y="32" width="100" height="44" rx="4" className="ln fillsoft" />
            <text x="480" y="59" className="mono" textAnchor="middle">C ↻</text>
            <path d="M150 54L190 54M290 54L310 54M410 54L430 54" className="ln" />
            <text x="10" y="120" className="pt mut">Zustand: só o componente cujo seletor mudou re-renderiza</text>
            <text x="10" y="120" className="en mut">Zustand: only the component whose selector changed re-renders</text>
            <rect x="10" y="132" width="140" height="44" rx="4" className="ln fillsoft" />
            <text x="80" y="159" className="mono" textAnchor="middle">store</text>
            <rect x="190" y="132" width="100" height="44" rx="4" className="ln fillsoft" />
            <text x="240" y="159" className="mono" textAnchor="middle">A ↻</text>
            <rect x="310" y="132" width="100" height="44" rx="4" className="ln" />
            <text x="360" y="159" className="mono mut" textAnchor="middle">B</text>
            <rect x="430" y="132" width="100" height="44" rx="4" className="ln" />
            <text x="480" y="159" className="mono mut" textAnchor="middle">C</text>
            <path d="M150 154L190 154" className="ln" />
            <path d="M150 164L310 164" className="ln dash" />
            <path d="M150 174L430 174" className="ln dash" />
            <text x="10" y="220" className="pt mut">↻ = re-renderiza. Linhas pontilhadas: conectados ao store, mas o seletor deles não mudou.</text>
            <text x="10" y="220" className="en mut">↻ = re-renders. Dashed lines: connected to the store, but their selector did not change.</text>
          </svg>
        </Diagram>
        <h3><T pt="Como decidir" en="How to decide" /></h3>
        <ul>
          <li><T pt={<><strong>Comece pelo mais simples:</strong> estado local, depois subir o estado, depois <code>children</code>. Só então contexto.</>} en={<><strong>Start with the simplest:</strong> local state, then lifting state up, then <code>children</code>. Only then context.</>} /></li>
          <li><T pt={<><strong>Contexto</strong> para o que muda pouco e muitos leem: tema, idioma, usuário autenticado, configuração.</>} en={<><strong>Context</strong> for what rarely changes and many read: theme, language, authenticated user, configuration.</>} /></li>
          <li><T pt={<><strong>Zustand</strong> quando o estado muda com frequência, tem muitos consumidores independentes, ou a lógica fica grande demais para um provider.</>} en={<><strong>Zustand</strong> when state changes often, has many independent consumers, or the logic grows too big for a provider.</>} /></li>
          <li><T pt={<><strong>Dados que vêm do servidor</strong> (listas, perfis) não são "estado global de UI": busque-os em Server Components e passe por props. Guarde no store só o que é estado de interface.</>} en={<><strong>Data that comes from the server</strong> (lists, profiles) is not "global UI state": fetch it in Server Components and pass it down as props. Keep only interface state in the store.</>} /></li>
          <li><T pt="Os dois combinam: Context para tema e usuário, Zustand para o carrinho." en="They combine: Context for theme and user, Zustand for the cart." /></li>
        </ul>
      </Section>
      <Section id="lab" title={<T pt="Exercício: tema e contador" en="Exercise: theme and counter" />}>
        <p><T pt="Um app Next.js pequeno com os dois: tema por Context, contador por Zustand (store por requisição). Pré-requisito: Node.js instalado." en="A small Next.js app with both: theme through Context, counter through Zustand (per-request store). Prerequisite: Node.js installed." /></p>
        <CodeBlock code={`npx create-next-app@latest lab-estado --ts --app
cd lab-estado
npm install zustand
mkdir -p src/stores src/providers`} />
        <p><T pt={<>Crie os arquivos <code>src/stores/counter-store.ts</code> e <code>src/providers/counter-store-provider.tsx</code> da seção anterior, e um <code>src/providers/theme-provider.tsx</code> (<code>'use client'</code>) com o <code>ThemeProvider</code> e o <code>useTheme</code> da seção de Context. Depois envolva o <code>&#123;children&#125;</code> do <code>layout.tsx</code> nos dois providers e crie um componente cliente que use os hooks.</>} en={<>Create the files <code>src/stores/counter-store.ts</code> and <code>src/providers/counter-store-provider.tsx</code> from the previous section, and a <code>src/providers/theme-provider.tsx</code> (<code>'use client'</code>) with the <code>ThemeProvider</code> and <code>useTheme</code> from the Context section. Then wrap the <code>&#123;children&#125;</code> of <code>layout.tsx</code> in both providers and create a client component that uses the hooks.</>} /></p>
        <CodeBlock code={`npm run dev      # http://localhost:3000`} />
        <p><T pt={<><strong>Resultado esperado:</strong> o botão do tema alterna o texto e o contador sobe ao clicar. Para <em>ver</em> a diferença de re-render, instale a extensão React Developer Tools, ative "Highlight updates when components render" e clique no contador: só os componentes que leem o <code>count</code> piscam. Depois troque o seletor por <code>useCounterStore((s) =&gt; s)</code> (o store inteiro) e veja mais componentes piscarem.</>} en={<><strong>Expected result:</strong> the theme button toggles the text and the counter goes up on click. To <em>see</em> the re-render difference, install the React Developer Tools extension, enable "Highlight updates when components render" and click the counter: only the components that read <code>count</code> flash. Then change the selector to <code>useCounterStore((s) =&gt; s)</code> (the whole store) and watch more components flash.</>} /></p>
      </Section>
      <Section id="cheat-rs" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Quero…" en="I want…" />, <T pt="Uso" en="I use" />]}
          rows={[
            [<T pt="passar um valor para toda a subárvore" en="pass a value to the whole subtree" />, <><code>createContext</code> + <code>useContext</code> + <code>&lt;Ctx value&gt;</code></>],
            [<T pt="estado com várias ações via contexto" en="state with several actions via context" />, <><code>useReducer</code> + 2 contextos + custom hooks</>],
            [<T pt="contexto no App Router" en="context in the App Router" />, <T pt={<>Client Component com <code>'use client'</code> recebendo <code>children</code>, importado no layout</>} en={<>Client Component with <code>'use client'</code> accepting <code>children</code>, imported in the layout</>} />],
            [<T pt="um store simples" en="a simple store" />, <code>create((set) =&gt; (&#123;...&#125;))</code>],
            [<T pt="re-renderizar só o necessário" en="re-render only what is needed" />, <T pt={<>seletor, e <code>useShallow</code> se ele devolve objeto/array novo</>} en={<>a selector, and <code>useShallow</code> if it returns a new object/array</>} />],
            [<T pt="Zustand com Next.js" en="Zustand with Next.js" />, <T pt={<><code>createStore</code> + provider <code>'use client'</code> com <code>useState(() =&gt; ...)</code></>} en={<><code>createStore</code> + <code>'use client'</code> provider with <code>useState(() =&gt; ...)</code></>} />],
          ]}
        />
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt="O que é prop drilling e o que a documentação do React manda tentar antes do contexto?" en="What is prop drilling and what do the React docs say to try before context?" /></li>
          <li><T pt={<>Por que um objeto escrito direto em <code>value</code> causa re-renders extras, e como corrigir?</>} en={<>Why does an object written straight into <code>value</code> cause extra re-renders, and how do you fix it?</>} /></li>
          <li><T pt="Por que o padrão reducer + contexto usa dois contextos?" en="Why does the reducer + context pattern use two contexts?" /></li>
          <li><T pt="Por que Server Components não usam contexto, e onde o provider deve ficar?" en="Why can Server Components not use context, and where should the provider live?" /></li>
          <li><T pt={<>O que um seletor do Zustand faz e quando o <code>useShallow</code> entra?</>} en={<>What does a Zustand selector do and when does <code>useShallow</code> come in?</>} /></li>
          <li><T pt="Por que um store global é um risco num servidor Next.js, e qual é a correção oficial?" en="Why is a global store a risk on a Next.js server, and what is the official fix?" /></li>
        </ul>
      </Section>
      <Sources
        links={[
          { label: "React: Passing Data Deeply with Context", href: "https://react.dev/learn/passing-data-deeply-with-context" },
          { label: "React: Scaling Up with Reducer and Context", href: "https://react.dev/learn/scaling-up-with-reducer-and-context" },
          { label: "React: useContext", href: "https://react.dev/reference/react/useContext" },
          { label: "Next.js: Server and Client Components (Context providers)", href: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
          { label: "Zustand: Introduction", href: "https://zustand.docs.pmnd.rs/learn/getting-started/introduction" },
          { label: "Zustand: Setup with Next.js", href: "https://zustand.docs.pmnd.rs/learn/guides/nextjs" },
          { label: "Zustand: Updating state", href: "https://zustand.docs.pmnd.rs/learn/guides/updating-state" },
          { label: "Zustand: Prevent rerenders with useShallow", href: "https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow" },
          { label: "Zustand: SSR and Hydration", href: "https://zustand.docs.pmnd.rs/learn/guides/ssr-and-hydration" },
        ]}
      />
    </>
  );
}
