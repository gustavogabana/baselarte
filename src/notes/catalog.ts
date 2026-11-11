import type { Localized } from "../i18n/localized.ts";

export interface NoteGroup {
  id: string;
  title: Localized;
  /** One line under the group's title. */
  description: Localized;
  /** Note slugs, in the order they are listed. */
  notes: string[];
}

/** A broad area of the blog (a section of the home page and an entry in its navigation). */
export interface NoteArea {
  id: string;
  title: Localized;
  description: Localized;
  /** Cover photo in public/assets/aesthetic/ (already optimised). */
  cover: { file: string; alt: Localized; credit: string };
  groups: NoteGroup[];
}

/** How the notes are organised on the home and notes pages: areas, then groups, then notes. */
export const catalog: NoteArea[] = [
  {
    id: "engineering",
    title: { en: "Engineering", pt: "Engenharia" },
    description: { en: "Systems, data and the backend and frontend patterns we build on.", pt: "Sistemas, dados e os padrões de backend e frontend em que construímos." },
    cover: { file: "city-night.webp", alt: { en: "A city at night, seen as blurred lights", pt: "Uma cidade à noite, vista como luzes desfocadas" }, credit: "Josh Hild / Unsplash" },
    groups: [
      {
        id: "systems",
        title: { en: "Linux and networking", pt: "Linux e redes" },
        description: { en: "What the machine is doing under your app.", pt: "O que a máquina faz por baixo do seu app." },
        notes: ["linux", "smtp"],
      },
      {
        id: "data",
        title: { en: "Databases", pt: "Bancos de dados" },
        description: { en: "Postgres, scaling reads and writes, and changing schemas safely.", pt: "Postgres, escala de leitura e escrita e mudanças seguras de schema." },
        notes: ["postgres-for-devs", "db-replicas-sharding", "db-migrations"],
      },
      {
        id: "backend",
        title: { en: "Backend and architecture", pt: "Backend e arquitetura" },
        description: { en: "Runtimes, retries, tenancy and money.", pt: "Runtimes, retentativas, multi-tenancy e pagamentos." },
        notes: ["language-runtimes", "nodejs-typescript", "idempotency", "multi-tenant-saas", "payment-gateways"],
      },
      {
        id: "frontend",
        title: { en: "Frontend and the web", pt: "Frontend e web" },
        description: { en: "State management and being found by search engines and AI.", pt: "Gerenciamento de estado e como ser encontrado por buscadores e IA." },
        notes: ["react-state", "seo-geo"],
      },
    ],
  },
  {
    id: "infrastructure",
    title: { en: "Infrastructure", pt: "Infraestrutura" },
    description: { en: "Cloud, containers, delivery pipelines and hosting.", pt: "Nuvem, contêineres, pipelines de entrega e hospedagem." },
    cover: { file: "concrete.webp", alt: { en: "A concrete tower in black and white", pt: "Uma torre de concreto em preto e branco" }, credit: "Klim Musalimov / Unsplash" },
    groups: [
      {
        id: "cloud",
        title: { en: "Cloud platforms", pt: "Plataformas de nuvem" },
        description: { en: "AWS, Cloudflare and infrastructure as code.", pt: "AWS, Cloudflare e infraestrutura como código." },
        notes: ["aws", "cloudflare", "terraform"],
      },
      {
        id: "containers",
        title: { en: "Containers and orchestration", pt: "Contêineres e orquestração" },
        description: { en: "Docker and Kubernetes, from the image to the cluster.", pt: "Docker e Kubernetes, da imagem ao cluster." },
        notes: ["docker", "kubernetes"],
      },
      {
        id: "delivery",
        title: { en: "Delivery and operations", pt: "Entrega e operação" },
        description: { en: "Walkthroughs that ship an app to AWS, and how to see it running.", pt: "Passo a passo para colocar um app na AWS e enxergá-lo rodando." },
        notes: ["github-aws-oidc", "ecs-todo-app", "front-back-ecs-cloudflare", "observability"],
      },
      {
        id: "hosting",
        title: { en: "Hosting for small projects", pt: "Hospedagem para projetos pequenos" },
        description: { en: "Cheap, simple setups and handing them to a client.", pt: "Arranjos simples e baratos, e como entregá-los a um cliente." },
        notes: ["small-project-hosting", "agency-hosting-handover"],
      },
    ],
  },
  {
    id: "security",
    title: { en: "Security", pt: "Segurança" },
    description: { en: "How apps break, who may do what, and how to practise attack and defence.", pt: "Como apps quebram, quem pode fazer o quê e como praticar ataque e defesa." },
    cover: { file: "grate.webp", alt: { en: "City lights behind a metal grate", pt: "Luzes da cidade atrás de uma grade de metal" }, credit: "Kelvin Taylor / Unsplash" },
    groups: [
      {
        id: "appsec",
        title: { en: "Application security", pt: "Segurança de aplicações" },
        description: { en: "A starting map, the OWASP list and hardening a web app.", pt: "Um mapa para começar, a lista OWASP e o endurecimento de um app web." },
        notes: ["cybersecurity-for-devs", "owasp-top-10", "web-app-security"],
      },
      {
        id: "identity",
        title: { en: "Identity, access and cryptography", pt: "Identidade, acesso e criptografia" },
        description: { en: "Signing in, authorising and the keys underneath.", pt: "Login, autorização e as chaves por baixo." },
        notes: ["auth-sso-oauth-oidc", "rbac-abac", "crypto-keys-ssh"],
      },
      {
        id: "offensive",
        title: { en: "Attack and defence labs", pt: "Laboratórios de ataque e defesa" },
        description: { en: "Hands-on practice: networks, hosts, people and certification.", pt: "Prática: redes, hosts, pessoas e certificação." },
        notes: ["network-attack-defense", "web-host-attack-defense", "social-engineering", "ethical-hacking-ceh-practice"],
      },
    ],
  },
  {
    id: "ai",
    title: { en: "Artificial intelligence", pt: "Inteligência artificial" },
    description: { en: "How models work, and how to build with agents.", pt: "Como os modelos funcionam e como construir com agentes." },
    cover: { file: "distant-glow.webp", alt: { en: "A distant glow on the horizon at night", pt: "Um brilho distante no horizonte à noite" }, credit: "Emma Swoboda / Unsplash" },
    groups: [
      {
        id: "models",
        title: { en: "Models and research", pt: "Modelos e pesquisa" },
        description: { en: "The transformer, and open-weight models you can run.", pt: "O transformer e modelos de pesos abertos que você pode rodar." },
        notes: ["attention-is-all-you-need", "llm-agents-open-source", "kimi-k2-k3"],
      },
      {
        id: "agents",
        title: { en: "Agents and tooling", pt: "Agentes e ferramentas" },
        description: { en: "MCP, harnesses, skills and self-hosted workspaces.", pt: "MCP, harnesses, skills e ambientes auto-hospedados." },
        notes: ["mcp-server-client", "agent-harness", "agent-skills", "hermes-agent", "private-ai-workspace", "doop-design-canvas"],
      },
    ],
  },
  {
    id: "craft",
    title: { en: "Business and craft", pt: "Negócios e ofício" },
    description: { en: "Selling, contracting, learning and the habits behind steady work.", pt: "Vender, contratar, aprender e os hábitos de um trabalho constante." },
    cover: { file: "wet-window.webp", alt: { en: "City lights through a rainy window", pt: "Luzes da cidade através de uma janela com chuva" }, credit: "lesha tuman / Unsplash" },
    groups: [
      {
        id: "business",
        title: { en: "Business and sales", pt: "Negócios e vendas" },
        description: { en: "Positioning, contracts and the company's own accounts.", pt: "Posicionamento, contratos e as contas da própria empresa." },
        notes: ["sales-marketing", "small-project-contracts", "company-accounts"],
      },
      {
        id: "learning",
        title: { en: "Learning and habits", pt: "Estudo e hábitos" },
        description: { en: "Courses, languages and keeping focus.", pt: "Cursos, idiomas e como manter o foco." },
        notes: ["harvard-cs50", "language-learning", "focus-and-attention"],
      },
      {
        id: "books",
        title: { en: "Book notes", pt: "Notas de livros" },
        description: { en: "What stayed after reading.", pt: "O que ficou depois da leitura." },
        notes: ["entendendo-algoritmos", "software-engineering-at-google", "ai-engineering"],
      },
    ],
  },
];

/** Every group, flat. */
export const allGroups: NoteGroup[] = catalog.flatMap((area) => area.groups);

/** The area and group a note is listed under. */
export function locate(slug: string): { area: NoteArea; group: NoteGroup } {
  for (const area of catalog) {
    for (const group of area.groups) {
      if (group.notes.includes(slug)) return { area, group };
    }
  }
  throw new Error(`Note "${slug}" is not listed in src/notes/catalog.ts.`);
}
