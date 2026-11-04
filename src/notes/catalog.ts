import type { Localized } from "../i18n/localized.ts";

export interface NoteGroup {
  id: string;
  title: Localized;
  /** Note slugs, in the order they are listed. */
  notes: string[];
}

/** How the notes are grouped and ordered on the home and notes pages. */
export const catalog: NoteGroup[] = [
  {
    id: "systems",
    title: { en: "Systems", pt: "Sistemas" },
    notes: [
      "linux",
      "postgres-for-devs",
      "db-replicas-sharding",
      "db-migrations",
    ],
  },
  {
    id: "web",
    title: { en: "Web development", pt: "Desenvolvimento web" },
    notes: [
      "react-state",
      "idempotency",
      "small-project-hosting",
      "small-project-contracts",
      "seo-geo",
      "language-runtimes",
      "nodejs-typescript",
    ],
  },
  {
    id: "cloud",
    title: { en: "Cloud and infrastructure", pt: "Nuvem e infraestrutura" },
    notes: [
      "aws",
      "cloudflare",
      "terraform",
      "docker",
      "kubernetes",
      "observability",
      "github-aws-oidc",
      "ecs-todo-app",
      "front-back-ecs-cloudflare",
    ],
  },
  {
    id: "security",
    title: { en: "Security", pt: "Segurança" },
    notes: [
      "cybersecurity-for-devs",
      "network-attack-defense",
      "web-app-security",
      "web-host-attack-defense",
      "social-engineering",
      "owasp-top-10",
      "ethical-hacking-ceh-practice",
      "auth-sso-oauth-oidc",
      "crypto-keys-ssh",
      "smtp",
    ],
  },
  {
    id: "ai",
    title: { en: "Artificial intelligence", pt: "Inteligência artificial" },
    notes: [
      "attention-is-all-you-need",
      "llm-agents-open-source",
      "mcp-server-client",
      "agent-harness",
      "agent-skills",
      "private-ai-workspace",
      "doop-design-canvas",
      "hermes-agent",
      "kimi-k2-k3",
    ],
  },
  {
    id: "biz",
    title: { en: "Business and sales", pt: "Negócios e vendas" },
    notes: [
      "sales-marketing",
      "company-accounts",
    ],
  },
  {
    id: "agency",
    title: { en: "Agency and clients", pt: "Agência e clientes" },
    notes: [
      "agency-hosting-handover",
    ],
  },
  {
    id: "learning",
    title: { en: "Learning and courses", pt: "Estudo e cursos" },
    notes: [
      "harvard-cs50",
      "language-learning",
    ],
  },
  {
    id: "mind",
    title: { en: "Mind and habits", pt: "Mente e hábitos" },
    notes: [
      "focus-and-attention",
    ],
  },
  {
    id: "books",
    title: { en: "Book notes", pt: "Notas de livros" },
    notes: [
      "entendendo-algoritmos",
      "software-engineering-at-google",
      "ai-engineering",
    ],
  },
];
