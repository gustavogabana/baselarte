import type { Localized } from "../i18n/localized.ts";

export interface NoteGroup {
  id: string;
  title: Localized;
  /** Note slugs, in reading order: the basics of the subject first, applied cases after. */
  notes: string[];
}

/**
 * How the notes are grouped and ordered on the home and notes pages. Each group is a numbered
 * series (01, 02…) and each note gets its place in it (03.2), so the order here is the numbering.
 * Series run from foundations to practice: computing, code, data, infrastructure, security, AI,
 * then the business around the work and the habits behind it.
 */
export const catalog: NoteGroup[] = [
  {
    id: "foundations",
    title: { en: "Computing foundations", pt: "Fundamentos da computação" },
    notes: [
      "harvard-cs50",
      "entendendo-algoritmos",
      "linux",
      "software-engineering-at-google",
    ],
  },
  {
    id: "apps",
    title: { en: "Building applications", pt: "Desenvolvimento de aplicações" },
    notes: [
      "nodejs-typescript",
      "react-state",
      "idempotency",
      "multi-tenant-saas",
      "payment-gateways",
      "seo-geo",
    ],
  },
  {
    id: "data",
    title: { en: "Data and databases", pt: "Dados e bancos de dados" },
    notes: [
      "postgres-for-devs",
      "db-migrations",
      "db-replicas-sharding",
    ],
  },
  {
    id: "infra",
    title: { en: "Cloud and delivery", pt: "Nuvem e entrega" },
    notes: [
      "docker",
      "aws",
      "terraform",
      "cloudflare",
      "github-aws-oidc",
      "ecs-todo-app",
      "front-back-ecs-cloudflare",
      "kubernetes",
      "observability",
    ],
  },
  {
    id: "security",
    title: { en: "Security", pt: "Segurança" },
    notes: [
      "cybersecurity-for-devs",
      "crypto-keys-ssh",
      "auth-sso-oauth-oidc",
      "rbac-abac",
      "owasp-top-10",
      "web-app-security",
    ],
  },
  {
    id: "ai",
    title: { en: "Artificial intelligence", pt: "Inteligência artificial" },
    notes: [
      "attention-is-all-you-need",
      "ai-engineering",
      "kimi-k2-k3",
      "llm-agents-open-source",
      "agent-harness",
      "agent-skills",
      "mcp-server-client",
      "hermes-agent",
      "private-ai-workspace",
      "doop-design-canvas",
    ],
  },
  {
    id: "business",
    title: { en: "Running the business", pt: "Empresa e clientes" },
    notes: [
      "company-accounts",
      "small-project-hosting",
      "small-project-contracts",
      "agency-hosting-handover",
      "sales-marketing",
    ],
  },
  {
    id: "habits",
    title: { en: "Learning and habits", pt: "Estudo e hábitos" },
    notes: [
      "focus-and-attention",
      "language-learning",
    ],
  },
];
