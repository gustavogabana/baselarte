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
 * Series: books first, then the 80/20 of day-to-day work: web apps, databases, AWS, security, AI.
 */
export const catalog: NoteGroup[] = [
  {
    id: "books",
    title: { en: "Books", pt: "Livros" },
    notes: [
      "entendendo-algoritmos",
      "software-engineering-at-google",
      "ai-engineering",
    ],
  },
  {
    id: "apps",
    title: { en: "Building web apps", pt: "Aplicações web" },
    notes: [
      "idempotency",
      "multi-tenant-saas",
      "payment-gateways",
      "seo-geo",
    ],
  },
  {
    id: "data",
    title: { en: "Databases", pt: "Bancos de dados" },
    notes: [
      "postgres-for-devs",
      "db-migrations",
      "db-replicas-sharding",
      "db-sharding",
      "rds",
    ],
  },
  {
    id: "aws",
    title: { en: "AWS and deploy", pt: "AWS e deploy" },
    notes: [
      "aws",
      "github-aws-oidc",
      "ecs-todo-app",
      "front-back-ecs-cloudflare",
      "cloudflare-containers-neon",
    ],
  },
  {
    id: "security",
    title: { en: "Web app security", pt: "Segurança de apps web" },
    notes: [
      "web-app-security",
      "owasp-top-10",
      "auth-sso-oauth-oidc",
      "rbac-abac",
      "crypto-keys-ssh",
      "passkeys-sessions-ssh",
    ],
  },
  {
    id: "ai",
    title: { en: "Artificial intelligence", pt: "Inteligência artificial" },
    notes: [
      "attention-is-all-you-need",
      "agent-harness",
      "agent-docker-project",
      "agent-skills",
      "mcp-server-client",
    ],
  },
];
