// Baselarte — English / Brazilian Portuguese.
// Classic (non-module) script at the end of <body>, so it runs right after the
// markup is parsed and before main.js. Depends on window.siteBoot (boot.js).
//
// Markup hooks:
//   data-i18n="key"                          → element innerHTML (strings may contain <em>)
//   data-i18n-attributes="attribute:key;..." → element attributes (e.g. meta content, aria-label)
//   data-language-toggle                     → button that flips between the two languages
//   data-language-option="en|pt-BR"          → button that picks a specific language

(() => {
  const TRANSLATIONS = {
    en: {
      "meta.title": "Baselarte — Software Engineering & Creative Technology",
      "meta.description": "Baselarte is a software engineering and creative technology company. Quietly building precise systems, interfaces and infrastructure.",
      "meta.locale": "en_US",
      "meta.localeAlternate": "pt_BR",

      "skipLink": "Skip to content",
      "nav.label": "Main",
      "nav.about": "About",
      "nav.principles": "Principles",
      "nav.notes": "Notes",
      "landing.kicker": "Software engineering",
      "landing.explore": "Explore the notes",
      "landing.startTitle": "Start here",
      "landing.startLede": "Short, practical references on the tools we build with, with diagrams and runnable examples.",
      "landing.allNotes": "All notes",
      "nav.menu": "All notes",
      "nav.index": "Index",
      "nav.start": "Terraform 80/20",
      "nav.section": "Notes",
      "sidebar.toggle": "Notes menu",
      "sidebar.home": "Notes home",
      "sidebar.filter": "Filter notes",
      "sidebar.groupCloud": "Cloud and infrastructure",
      "sidebar.groupSystems": "Systems",
      "sidebar.groupSecurity": "Security",
      "sidebar.groupBooks": "Book notes",
      "sidebar.groupWeb": "Web development",
      "breadcrumb.label": "Breadcrumb",
      "copy.label": "Copy",
      "copy.done": "Copied",
      "copy.failed": "Failed",
      "theme.label": "Theme",
      "theme.auto": "Automatic: dark from 18:00 to 06:00 by your clock",
      "theme.light": "Light theme",
      "theme.dark": "Dark theme",
      "sideNav.label": "On this page",
      "sideNav.onThisPage": "On this page",
      "sideNav.toggle": "Sections",
      "backToTop.label": "Back to top",
      "languageToggle.label": "PT",
      "languageToggle.description": "Ver em português",

      "hero.title": "Software engineering, built with <em>quiet precision.</em>",
      "hero.lede": "Baselarte is a software engineering and creative technology company. We build systems, interfaces and infrastructure that are <em>simple on the surface</em> and rigorous underneath.",

      "about.title": "Simplicity is a discipline",
      "about.body": "Most software fails slowly, under the weight of what it never needed. We start from fundamentals, build only what is necessary, and then make it excellent. Clarity over abstraction. Fundamentals over fashion.",

      "principles.title": "Accountability stays human",
      "principles.quote": "A computer can never be held accountable, therefore a computer must never make a management decision.",
      "principles.citation": "IBM internal training presentation, 1979",
      "principles.body": "We build tools that help people decide, not tools that decide for them. Automation should sharpen judgment, never replace it.",

      "status.title": "Something is being built",
      "status.body": "Inquiries by introduction only.",

      "footer.company": "Company",
      "footer.language": "Language",
      "footer.index": "Index",
      "footer.localTime": "Local time",
      "dayPeriod.day": "day",
      "dayPeriod.night": "night",

      "notes.metaTitle": "Notes | Baselarte",
      "notes.metaDescription": "Study notes from Baselarte: short, practical references on the tools and platforms we build with.",
      "notes.kicker": "Notes",
      "notes.heroTitle": "Things we learned, <em>written down.</em>",
      "notes.heroLede": "Short, practical references on the tools and platforms we build with. Pick a topic.",
      "notes.aws.title": "AWS",
      "notes.aws.description": "An interactive guide based on the official documentation: IAM, VPC, ECS, RDS, S3, Route 53 and more, with diagrams and simulators.",
      "notes.oidc.title": "GitHub to AWS with OIDC",
      "notes.oidc.description": "CI/CD with GitHub Actions: a push to develop or main deploys to AWS using OIDC, with no stored access keys.",
      "oidc.metaTitle": "GitHub to AWS with OIDC: CI/CD Notes | Baselarte",
      "oidc.metaDescription": "Deploy from GitHub Actions to AWS without stored keys: OIDC provider, IAM roles, environments and a develop/production workflow, based on the official docs.",
      "oidc.kicker": "CI/CD",
      "oidc.heroTitle": "Deploy from GitHub to AWS, <em>without stored keys.</em>",
      "oidc.heroLede": "A push to <code>develop</code> or <code>main</code> deploys to the matching AWS environment, using OpenID Connect instead of long-lived access keys.",
      "notes.cf.title": "Cloudflare: domain, R2 and SSL",
      "notes.cf.description": "Buy and configure a domain, R2 with presigned URLs, CDN, SSL certificates, and HTTPS all the way to an AWS load balancer.",
      "cf.metaTitle": "Cloudflare: Domain, R2, SSL and AWS ALB Notes | Baselarte",
      "cf.metaDescription": "Buy and configure a domain on Cloudflare, use R2 with presigned URLs, CDN and SSL, and take HTTPS all the way to an AWS ALB, based on the official docs.",
      "cf.kicker": "Cloudflare",
      "cf.heroTitle": "Domain, storage and SSL, <em>all the way to AWS.</em>",
      "cf.heroLede": "Buy and configure a domain, serve files from R2 with presigned URLs and a CDN, and keep every hop HTTPS up to your AWS load balancer.",
      "notes.fs.title": "Anatomy of a full-stack platform",
      "notes.fs.description": "Case study of a real front end and back end: API-first, layered caching, security, direct uploads, batched analytics and tests.",
      "fs.metaTitle": "Anatomy of a full-stack platform | Baselarte",
      "fs.metaDescription": "Engineering notes on a real front end plus back end project: API-first design, layered caching, stable listing order, session security, direct uploads, batched analytics and testing.",
      "fs.kicker": "Case study",
      "fs.heroTitle": "Anatomy of a <em>full-stack platform.</em>",
      "fs.heroLede": "What stands out in the engineering of a real front end and back end: API-first, layered caching, defense in depth and tests that check performance.",
      "notes.aie.title": "AI Engineering",
      "notes.aie.description": "Book notes: tokens, sampling, prompting, RAG, agents, evaluation, LoRA finetuning, inference and architecture, with simple examples and diagrams.",
      "aie.metaTitle": "AI Engineering, book notes | Baselarte",
      "aie.metaDescription": "A friendly walkthrough of the book AI Engineering by Chip Huyen: tokens, sampling, prompting, RAG, agents, evaluation, finetuning with LoRA, inference and application architecture, with simple examples and diagrams.",
      "aie.kicker": "Book notes",
      "aie.heroTitle": "AI engineering, <em>one layer at a time.</em>",
      "aie.heroLede": "A friendly walkthrough of AI Engineering by Chip Huyen: how models write, how to prompt, retrieve, evaluate and ship them.",
      "notes.aie.title": "AI Engineering",
      "notes.aie.description": "Book notes: tokens, sampling, prompting, RAG, agents, evaluation, LoRA finetuning, inference and architecture, with simple examples and diagrams.",
      "aie.metaTitle": "AI Engineering, book notes | Baselarte",
      "aie.metaDescription": "A friendly walkthrough of the book AI Engineering by Chip Huyen: tokens, sampling, prompting, RAG, agents, evaluation, finetuning with LoRA, inference and application architecture, with simple examples and diagrams.",
      "aie.kicker": "Book notes",
      "aie.heroTitle": "AI engineering, <em>one layer at a time.</em>",
      "aie.heroLede": "A friendly walkthrough of AI Engineering by Chip Huyen: how models write, how to prompt, retrieve, evaluate and ship them.",
      "notes.seg.title": "Software Engineering at Google",
      "notes.seg.description": "Book notes: time, scale and trade-offs, Hyrum’s Law, testing, code review and continuous delivery, explained with simple examples and diagrams.",
      "seg.metaTitle": "Software Engineering at Google, book notes | Baselarte",
      "seg.metaDescription": "A friendly walkthrough of the book Software Engineering at Google: time, scale and trade-offs, Hyrum’s Law, testing, code review and continuous delivery, with simple examples and diagrams.",
      "seg.kicker": "Book notes",
      "seg.heroTitle": "Software engineering is <em>programming over time.</em>",
      "seg.heroLede": "A friendly walkthrough of Software Engineering at Google: what changes when code has to live for decades and teams have to grow.",
      "notes.alg.title": "Grokking Algorithms",
      "notes.alg.description": "Book notes: Big O notation, binary search, sorting, recursion, hash tables, graphs, Dijkstra, greedy algorithms, dynamic programming and k-NN, with everyday examples and code.",
      "alg.metaTitle": "Grokking Algorithms, book notes | Baselarte",
      "alg.metaDescription": "A friendly walkthrough of the book Grokking Algorithms (Entendendo Algoritmos): Big O notation, binary search, sorting, recursion, hash tables, graphs, Dijkstra, greedy algorithms, dynamic programming and k-nearest neighbours, with simple examples and code.",
      "alg.kicker": "Book notes",
      "alg.heroTitle": "Algorithms, <em>and how fast they grow.</em>",
      "alg.heroLede": "A friendly walkthrough of Grokking Algorithms: Big O notation first, then every algorithm of the book, with everyday examples and short Python code.",
      "notes.lx.title": "How Linux works",
      "notes.lx.description": "Visual guide: users and root, permissions, file tree, commands, processes, networking, SSH, firewall, terminal and web tools, and clearing history, with diagrams and exam questions.",
      "lx.metaTitle": "How Linux works, visual guide | Baselarte",
      "lx.metaDescription": "A visual, exam-style guide to how Linux works: users and root, files and permissions, the directory tree, commands, processes, networking, SSH, firewalls, terminal tools and clearing history.",
      "lx.kicker": "Visual guide",
      "lx.heroTitle": "Linux, <em>from user to firewall.</em>",
      "lx.heroLede": "A visual, exam-style guide: users and root, permissions, processes, the file tree, commands, networking, SSH, firewalls, health tools and cleaning your history.",
      "notes.tf.title": "Terraform 80/20",
      "notes.tf.description": "The 20% of Terraform that covers 80% of the work: workflow, HCL, state, modules, CI, and a complete AWS walkthrough with remote state on S3, VPC, EC2 and S3.",
      "tf.metaTitle": "Terraform 80/20, general and AWS | Baselarte",
      "tf.metaDescription": "The 20% of Terraform that covers 80% of the work: workflow, HCL, state, modules, CI, and a complete AWS walkthrough with remote state on S3, VPC, EC2, IAM and S3.",
      "tf.kicker": "Study guide",
      "tf.heroTitle": "Terraform, <em>the 80/20.</em>",
      "tf.heroLede": "The part of Terraform you will use every day, explained step by step and then applied to AWS: remote state, VPC, EC2, IAM and S3.",
      "notes.sec.title": "Security and networking lab",
      "notes.sec.description": "Hands-on exercises on your own machines: sessions, stateful vs. stateless, nmap, SSH, WireGuard VPNs you host yourself, Wireshark, firewalls and basic recon tools, plus Docker networking explained.",
      "sec.metaTitle": "Security and networking lab | Baselarte",
      "sec.metaDescription": "Hands-on exercises on your own machines: sessions, stateful vs. stateless, nmap, SSH tunnels, WireGuard VPNs you host yourself, Wireshark, firewalls and a safe recon-tool overview, plus Docker networking explained with a real-machine comparison.",
      "sec.kicker": "Hands-on lab",
      "sec.heroTitle": "Security, <em>hands on.</em>",
      "sec.heroLede": "A practical 80/20 of networking and security tools: run them on your own machines, read the output, and know exactly what success looks like.",
      "notes.rt.title": "Red team 80/20",
      "notes.rt.description": "Offensive concepts and defences: the attack lifecycle, social engineering and phishing simulation, SQL injection and XSS, reverse shells, all in a safe Docker lab, each technique paired with its defence.",
      "rt.metaTitle": "Red team 80/20: offensive concepts and defences | Baselarte",
      "rt.metaDescription": "A defensive-minded 80/20 of red team concepts: the attack lifecycle, social engineering and phishing simulation, SQL injection and XSS, reverse shells, all in a safe Docker lab (DVWA, Juice Shop, Gophish) with a named defence for every technique.",
      "rt.kicker": "Hands-on lab",
      "rt.heroTitle": "Red team, <em>the 80/20.</em>",
      "rt.heroLede": "The attack lifecycle, social engineering, web exploitation and reverse shells — each one in a safe Docker lab, each one paired with the defence that stops it.",
      "notes.wa.title": "Secure web apps: headers, auth and AI agents",
      "notes.wa.description": "HTTPS and security headers (HSTS, CSP with nonces, building your own middleware, Next.js and Nginx), cookie attributes, stateful sessions vs. stateless JWT (access + refresh tokens), CSRF, SQL injection and XSS from the builder's side, and the new frontier: AI agent security, per OWASP.",
      "wa.metaTitle": "Secure web apps: headers, auth and AI agents | Baselarte",
      "wa.metaDescription": "HTTPS and security headers (HSTS, CSP with nonces, building your own middleware, Next.js and Nginx), cookie attributes, stateful sessions vs. stateless JWT (access + refresh tokens), CSRF, SQL injection and XSS from the builder's side, and the new frontier: AI agent security (prompt injection, excessive agency, MCP risks), per OWASP.",
      "wa.kicker": "Study guide",
      "wa.heroTitle": "Web apps, <em>protected end to end.</em>",
      "wa.heroLede": "From HTTPS and security headers to stateful sessions, stateless JWTs, CSRF, injection — and the new frontier of AI agent security.",
      "notes.rs.title": "React state: Context API and Zustand",
      "notes.rs.description": "From the official docs: prop drilling, createContext and useContext, the reducer + context pattern, Zustand stores and selectors, per-request stores in Next.js, and when to use each.",
      "rs.metaTitle": "React state: Context API and Zustand | Baselarte",
      "rs.metaDescription": "How React's Context API and Zustand work, from the official docs: createContext and useContext, the reducer + context pattern, selectors, per-request stores in Next.js, and when to use each.",
      "rs.kicker": "Study guide",
      "rs.heroTitle": "State in React, <em>shared on purpose.</em>",
      "rs.heroLede": "Context API and Zustand, straight from the official docs: how each works, how they behave in React and Next.js, and when to pick which.",
      "notes.pg.title": "Postgres for developers",
      "notes.pg.description": "Relational databases 80/20: schemas, roles and passwords, access security, indexes, CTEs, UUIDs, full-text search, backups (3-2-1) and caching, with a Docker lab.",
      "pg.metaTitle": "Postgres for developers, the 80/20 | Baselarte",
      "pg.metaDescription": "Relational databases 80/20, Postgres-focused: schemas, database managers, connecting, roles and passwords (the classic mix-up), access security, CTEs and window functions, indexes, UUIDs, full-text search instead of LIKE, grants, backups (3-2-1) and caching, with a Docker lab.",
      "pg.kicker": "Study guide",
      "pg.heroTitle": "Postgres, <em>the 80/20 for developers.</em>",
      "pg.heroLede": "Relational databases from the ground up, Postgres-focused: schemas, connecting, roles and passwords, access security, indexes, CTEs, full-text search, backups and caching — with a Docker lab you can run today.",
      "aws.metaTitle": "AWS Notes — IAM, Organizations, VPC, ECS, RDS, S3 and more | Baselarte",
      "aws.metaDescription": "Interactive AWS guide based on the official documentation: IAM, Organizations, Identity Center, OIDC, VPC, ALB, ECR, ECS, RDS, S3 and Route 53, with diagrams and simulators.",
      "aws.kicker": "Based on the official docs",
      "aws.heroTitle": "Learn <em>AWS</em> visually and interactively.",
      "aws.heroLede": "From accounts and permissions to networking, servers, databases and domains. Click, simulate and test what you learned in every section.",
      "aws.sectionsToggle": "Sections",
      "aws.disclaimer": "Content based on the official AWS documentation (each section lists its links and last-verified date). Items without an official source are marked as personal notes. Independent project, not affiliated with or endorsed by Amazon Web Services.",

      "notFound.metaTitle": "Not found — Baselarte",
      "notFound.title": "Nothing <em>here, yet.</em>",
      "notFound.backHome": "Back to baselarte.com"
    },

    "pt-BR": {
      "meta.title": "Baselarte — Engenharia de Software e Tecnologia Criativa",
      "meta.description": "A Baselarte é uma empresa de engenharia de software e tecnologia criativa. Construindo, em silêncio, sistemas, interfaces e infraestrutura precisos.",
      "meta.locale": "pt_BR",
      "meta.localeAlternate": "en_US",

      "skipLink": "Pular para o conteúdo",
      "nav.label": "Principal",
      "nav.about": "Sobre",
      "nav.principles": "Princípios",
      "nav.notes": "Notas",
      "landing.kicker": "Engenharia de software",
      "landing.explore": "Explorar as notas",
      "landing.startTitle": "Comece por aqui",
      "landing.startLede": "Referências curtas e práticas sobre as ferramentas com que construímos, com diagramas e exemplos que você pode rodar.",
      "landing.allNotes": "Todas as notas",
      "nav.menu": "Todas as notas",
      "nav.index": "Índice",
      "nav.start": "Terraform 80/20",
      "nav.section": "Notas",
      "sidebar.toggle": "Menu de notas",
      "sidebar.home": "Início das notas",
      "sidebar.filter": "Filtrar notas",
      "sidebar.groupCloud": "Nuvem e infraestrutura",
      "sidebar.groupSystems": "Sistemas",
      "sidebar.groupSecurity": "Segurança",
      "sidebar.groupBooks": "Notas de livros",
      "sidebar.groupWeb": "Desenvolvimento web",
      "breadcrumb.label": "Caminho",
      "copy.label": "Copiar",
      "copy.done": "Copiado",
      "copy.failed": "Falhou",
      "theme.label": "Tema",
      "theme.auto": "Automático: escuro das 18h às 6h pelo seu relógio",
      "theme.light": "Tema claro",
      "theme.dark": "Tema escuro",
      "sideNav.label": "Nesta página",
      "sideNav.onThisPage": "Nesta página",
      "sideNav.toggle": "Seções",
      "backToTop.label": "Voltar ao topo",
      "languageToggle.label": "EN",
      "languageToggle.description": "View in English",

      "hero.title": "Engenharia de software, feita com <em>precisão silenciosa.</em>",
      "hero.lede": "A Baselarte é uma empresa de engenharia de software e tecnologia criativa. Construímos sistemas, interfaces e infraestrutura <em>simples na superfície</em> e rigorosos por dentro.",

      "about.title": "Simplicidade é disciplina",
      "about.body": "A maior parte dos softwares falha devagar, sob o peso do que nunca precisou ter. Partimos dos fundamentos, construímos apenas o necessário e, então, o tornamos excelente. Clareza acima da abstração. Fundamentos acima da moda.",

      "principles.title": "A responsabilidade continua humana",
      "principles.quote": "Um computador nunca pode ser responsabilizado; portanto, um computador nunca deve tomar uma decisão de gestão.",
      "principles.citation": "Apresentação interna de treinamento da IBM, 1979",
      "principles.body": "Construímos ferramentas que ajudam pessoas a decidir, não ferramentas que decidem por elas. A automação deve afiar o julgamento, nunca substituí-lo.",

      "status.title": "Algo está sendo construído",
      "status.body": "Contatos apenas por indicação.",

      "footer.company": "Empresa",
      "footer.language": "Idioma",
      "footer.index": "Índice",
      "footer.localTime": "Hora local",
      "dayPeriod.day": "dia",
      "dayPeriod.night": "noite",

      "notes.metaTitle": "Notas | Baselarte",
      "notes.metaDescription": "Notas de estudo da Baselarte: referências curtas e práticas sobre as ferramentas e plataformas com que construímos.",
      "notes.kicker": "Notas",
      "notes.heroTitle": "Coisas que aprendemos, <em>postas no papel.</em>",
      "notes.heroLede": "Referências curtas e práticas sobre as ferramentas e plataformas com que construímos. Escolha um tema.",
      "notes.aws.title": "AWS",
      "notes.aws.description": "Um guia interativo baseado na documentação oficial: IAM, VPC, ECS, RDS, S3, Route 53 e mais, com diagramas e simuladores.",
      "notes.oidc.title": "GitHub para AWS com OIDC",
      "notes.oidc.description": "CI/CD com GitHub Actions: um push em develop ou main faz deploy na AWS usando OIDC, sem chaves de acesso guardadas.",
      "oidc.metaTitle": "GitHub para AWS com OIDC: Notas de CI/CD | Baselarte",
      "oidc.metaDescription": "Deploy do GitHub Actions para a AWS sem chaves guardadas: provedor OIDC, roles IAM, environments e um workflow develop/produção, com base na documentação oficial.",
      "oidc.kicker": "CI/CD",
      "oidc.heroTitle": "Deploy do GitHub para a AWS, <em>sem chaves guardadas.</em>",
      "oidc.heroLede": "Um push em <code>develop</code> ou <code>main</code> faz deploy no ambiente correspondente da AWS, usando OpenID Connect em vez de chaves de acesso de longa duração.",
      "notes.cf.title": "Cloudflare: domínio, R2 e SSL",
      "notes.cf.description": "Compra e configuração de domínio, R2 com URLs pré-assinadas, CDN, certificados SSL e HTTPS até o load balancer da AWS.",
      "cf.metaTitle": "Cloudflare: Notas de Domínio, R2, SSL e ALB da AWS | Baselarte",
      "cf.metaDescription": "Compre e configure um domínio na Cloudflare, use o R2 com URLs pré-assinadas, CDN e SSL, e leve o HTTPS até um ALB da AWS, com base na documentação oficial.",
      "cf.kicker": "Cloudflare",
      "cf.heroTitle": "Domínio, storage e SSL, <em>até a AWS.</em>",
      "cf.heroLede": "Compre e configure um domínio, sirva arquivos do R2 com URLs pré-assinadas e CDN, e mantenha cada trecho em HTTPS até o seu load balancer na AWS.",
      "notes.fs.title": "Anatomia de uma plataforma full-stack",
      "notes.fs.description": "Estudo de caso de um front end e um back end reais: API-first, cache em camadas, segurança, uploads diretos, analytics em lote e testes.",
      "fs.metaTitle": "Anatomia de uma plataforma full-stack | Baselarte",
      "fs.metaDescription": "Notas de engenharia sobre um projeto real de front end e back end: API-first, cache em camadas, ordem estável da listagem, segurança de sessão, uploads diretos, analytics em lote e testes.",
      "fs.kicker": "Estudo de caso",
      "fs.heroTitle": "Anatomia de uma <em>plataforma full-stack.</em>",
      "fs.heroLede": "O que se destaca na engenharia de um front end e um back end reais: API-first, cache em camadas, defesa em profundidade e testes que verificam desempenho.",
      "notes.aie.title": "AI Engineering",
      "notes.aie.description": "Notas do livro: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas.",
      "aie.metaTitle": "AI Engineering, notas do livro | Baselarte",
      "aie.metaDescription": "Um passeio didático pelo livro AI Engineering, de Chip Huyen: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas.",
      "aie.kicker": "Notas de livro",
      "aie.heroTitle": "Engenharia de IA, <em>uma camada por vez.</em>",
      "aie.heroLede": "Um passeio didático por AI Engineering, de Chip Huyen: como os modelos escrevem e como pedir, buscar, avaliar e entregar.",
      "notes.aie.title": "AI Engineering",
      "notes.aie.description": "Notas do livro: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas.",
      "aie.metaTitle": "AI Engineering, notas do livro | Baselarte",
      "aie.metaDescription": "Um passeio didático pelo livro AI Engineering, de Chip Huyen: tokens, amostragem, prompts, RAG, agentes, avaliação, finetuning com LoRA, inferência e arquitetura, com exemplos simples e diagramas.",
      "aie.kicker": "Notas de livro",
      "aie.heroTitle": "Engenharia de IA, <em>uma camada por vez.</em>",
      "aie.heroLede": "Um passeio didático por AI Engineering, de Chip Huyen: como os modelos escrevem e como pedir, buscar, avaliar e entregar.",
      "notes.seg.title": "Software Engineering at Google",
      "notes.seg.description": "Notas do livro: tempo, escala e trade-offs, Lei de Hyrum, testes, code review e entrega contínua, explicados com exemplos simples e diagramas.",
      "seg.metaTitle": "Software Engineering at Google, notas do livro | Baselarte",
      "seg.metaDescription": "Um passeio didático pelo livro Software Engineering at Google: tempo, escala e trade-offs, Lei de Hyrum, testes, code review e entrega contínua, com exemplos simples e diagramas.",
      "seg.kicker": "Notas de livro",
      "seg.heroTitle": "Engenharia de software é <em>programação ao longo do tempo.</em>",
      "seg.heroLede": "Um passeio didático por Software Engineering at Google: o que muda quando o código precisa viver por décadas e as equipes precisam crescer.",
      "notes.alg.title": "Entendendo Algoritmos",
      "notes.alg.description": "Notas do livro: notação Big O, busca binária, ordenação, recursão, tabelas hash, grafos, Dijkstra, algoritmos gulosos, programação dinâmica e k-NN, com exemplos do dia a dia e código.",
      "alg.metaTitle": "Entendendo Algoritmos, notas do livro | Baselarte",
      "alg.metaDescription": "Um passeio didático pelo livro Entendendo Algoritmos (Grokking Algorithms): notação Big O, busca binária, ordenação, recursão, tabelas hash, grafos, Dijkstra, algoritmos gulosos, programação dinâmica e k-vizinhos mais próximos, com exemplos simples e código.",
      "alg.kicker": "Notas de livro",
      "alg.heroTitle": "Algoritmos, <em>e a velocidade com que crescem.</em>",
      "alg.heroLede": "Um passeio didático por Entendendo Algoritmos: primeiro a notação Big O, depois cada algoritmo do livro, com exemplos do dia a dia e códigos curtos em Python.",
      "notes.lx.title": "Como o Linux funciona",
      "notes.lx.description": "Guia visual: usuários e root, permissões, árvore de arquivos, comandos, processos, redes, SSH, firewall, ferramentas de terminal e web e limpeza do histórico, com diagramas e questões de prova.",
      "lx.metaTitle": "Como o Linux funciona, guia visual | Baselarte",
      "lx.metaDescription": "Um guia visual, no estilo de prova, de como o Linux funciona: usuários e root, arquivos e permissões, árvore de diretórios, comandos, processos, redes, SSH, firewall, ferramentas de terminal e limpeza do histórico.",
      "lx.kicker": "Guia visual",
      "lx.heroTitle": "Linux, <em>do usuário ao firewall.</em>",
      "lx.heroLede": "Um guia visual, no estilo de prova: usuários e root, permissões, processos, a árvore de arquivos, comandos, redes, SSH, firewall, ferramentas de saúde e como limpar o histórico.",
      "notes.tf.title": "Terraform 80/20",
      "notes.tf.description": "Os 20% do Terraform que cobrem 80% do trabalho: fluxo, HCL, estado, módulos, CI e um passo a passo completo na AWS com estado remoto no S3, VPC, EC2 e S3.",
      "tf.metaTitle": "Terraform 80/20, geral e AWS | Baselarte",
      "tf.metaDescription": "Os 20% do Terraform que cobrem 80% do trabalho: fluxo, HCL, estado, módulos, CI e um passo a passo completo na AWS com estado remoto no S3, VPC, EC2, IAM e S3.",
      "tf.kicker": "Guia de estudo",
      "tf.heroTitle": "Terraform, <em>o 80/20.</em>",
      "tf.heroLede": "A parte do Terraform que você vai usar todo dia, explicada passo a passo e depois aplicada à AWS: estado remoto, VPC, EC2, IAM e S3.",
      "notes.sec.title": "Laboratório de segurança e redes",
      "notes.sec.description": "Exercícios práticos nas suas próprias máquinas: sessões, com e sem estado, nmap, SSH, VPNs WireGuard hospedadas por você, Wireshark, firewall e ferramentas básicas de reconhecimento, além da rede do Docker explicada.",
      "sec.metaTitle": "Laboratório de segurança e redes | Baselarte",
      "sec.metaDescription": "Exercícios práticos nas suas próprias máquinas: sessões, com e sem estado, nmap, túneis SSH, VPNs WireGuard hospedadas por você, Wireshark, firewall e um panorama seguro de ferramentas de reconhecimento, além da rede do Docker explicada com comparação a uma máquina real.",
      "sec.kicker": "Laboratório prático",
      "sec.heroTitle": "Segurança, <em>na prática.</em>",
      "sec.heroLede": "Um 80/20 prático de ferramentas de rede e segurança: rode nas suas próprias máquinas, leia a saída e saiba exatamente como é o sucesso.",
      "notes.rt.title": "Red team 80/20",
      "notes.rt.description": "Conceitos e defesas ofensivas: o ciclo de ataque, engenharia social e simulação de phishing, SQL injection e XSS, shells reversos, tudo num laboratório Docker seguro, cada técnica pareada com sua defesa.",
      "rt.metaTitle": "Red team 80/20: conceitos ofensivos e defesas | Baselarte",
      "rt.metaDescription": "Um 80/20 de conceitos de red team, com foco defensivo: o ciclo de ataque, engenharia social e simulação de phishing, SQL injection e XSS, shells reversos, tudo num laboratório Docker seguro (DVWA, Juice Shop, Gophish) com uma defesa nomeada para cada técnica.",
      "rt.kicker": "Laboratório prático",
      "rt.heroTitle": "Red team, <em>o 80/20.</em>",
      "rt.heroLede": "O ciclo de ataque, engenharia social, exploração web e shells reversos — cada um num laboratório Docker seguro, cada um pareado com a defesa que o barra.",
      "notes.wa.title": "Apps web seguros: cabeçalhos, auth e agentes de IA",
      "notes.wa.description": "HTTPS e cabeçalhos de segurança (HSTS, CSP com nonce, middleware próprio, Next.js e Nginx), atributos de cookie, sessões stateful vs. JWT stateless (access e refresh tokens), CSRF, SQL injection e XSS do lado de quem constrói, e a nova fronteira: segurança de agentes de IA, segundo a OWASP.",
      "wa.metaTitle": "Apps web seguros: cabeçalhos, auth e agentes de IA | Baselarte",
      "wa.metaDescription": "HTTPS e cabeçalhos de segurança (HSTS, CSP com nonce, middleware próprio, Next.js e Nginx), atributos de cookie, sessões stateful vs. JWT stateless (access e refresh tokens), CSRF, SQL injection e XSS do lado de quem constrói, e a nova fronteira: segurança de agentes de IA (prompt injection, agência excessiva, riscos do MCP), segundo a OWASP.",
      "wa.kicker": "Guia de estudo",
      "wa.heroTitle": "Apps web, <em>protegidos de ponta a ponta.</em>",
      "wa.heroLede": "De HTTPS e cabeçalhos de segurança a sessões stateful, JWTs stateless, CSRF, injeção — e a nova fronteira da segurança de agentes de IA.",
      "notes.rs.title": "Estado no React: Context API e Zustand",
      "notes.rs.description": "Pela documentação oficial: prop drilling, createContext e useContext, o padrão reducer + contexto, stores e seletores do Zustand, stores por requisição no Next.js e quando usar cada um.",
      "rs.metaTitle": "Estado no React: Context API e Zustand | Baselarte",
      "rs.metaDescription": "Como funcionam a Context API do React e o Zustand, pela documentação oficial: createContext e useContext, o padrão reducer + contexto, seletores, stores por requisição no Next.js e quando usar cada um.",
      "rs.kicker": "Guia de estudo",
      "rs.heroTitle": "Estado no React, <em>compartilhado de propósito.</em>",
      "rs.heroLede": "Context API e Zustand direto da documentação oficial: como cada um funciona, como se comportam no React e no Next.js e quando escolher qual.",
      "notes.pg.title": "Postgres para quem programa",
      "notes.pg.description": "Bancos relacionais 80/20: schemas, usuários e senhas, segurança de acesso, índices, CTEs, UUIDs, busca textual, backups (3-2-1) e cache, com um laboratório em Docker.",
      "pg.metaTitle": "Postgres para quem programa, o 80/20 | Baselarte",
      "pg.metaDescription": "Bancos relacionais 80/20, com foco em Postgres: schemas, gerenciadores de banco, como conectar, usuários e senhas (a confusão clássica), segurança de acesso, CTEs e window functions, índices, UUIDs, busca textual no lugar de LIKE, permissões, backups (3-2-1) e cache, com um laboratório em Docker.",
      "pg.kicker": "Guia de estudo",
      "pg.heroTitle": "Postgres, <em>o 80/20 para quem programa.</em>",
      "pg.heroLede": "Bancos relacionais do zero, com foco em Postgres: schemas, como conectar, usuários e senhas, segurança de acesso, índices, CTEs, busca textual, backups e cache — com um laboratório em Docker para rodar hoje.",
      "aws.metaTitle": "Notas de AWS — IAM, Organizations, VPC, ECS, RDS, S3 e mais | Baselarte",
      "aws.metaDescription": "Guia interativo de AWS baseado na documentação oficial: IAM, Organizations, Identity Center, OIDC, VPC, ALB, ECR, ECS, RDS, S3 e Route 53, com diagramas e simuladores.",
      "aws.kicker": "Baseado na documentação oficial",
      "aws.heroTitle": "Aprenda <em>AWS</em> de forma visual e interativa.",
      "aws.heroLede": "Das contas e permissões até rede, servidores, bancos de dados e domínios. Clique, simule e teste o que aprendeu em cada seção.",
      "aws.sectionsToggle": "Seções",
      "aws.disclaimer": "Conteúdo baseado na documentação oficial da AWS (cada seção traz os links e a data da última verificação). Itens sem fonte oficial aparecem marcados como nota pessoal. Projeto independente, sem afiliação ou endorsement da Amazon Web Services.",

      "notFound.metaTitle": "Página não encontrada — Baselarte",
      "notFound.title": "Nada <em>aqui, ainda.</em>",
      "notFound.backHome": "Voltar para baselarte.com"
    }
  };

  const documentRoot = document.documentElement;
  const { DEFAULT_LANGUAGE, storeLanguage } = window.siteBoot;

  function currentLanguage() {
    return documentRoot.lang in TRANSLATIONS ? documentRoot.lang : DEFAULT_LANGUAGE;
  }

  function translate(key) {
    const activeTranslations = TRANSLATIONS[currentLanguage()];
    return key in activeTranslations ? activeTranslations[key] : TRANSLATIONS[DEFAULT_LANGUAGE][key];
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.innerHTML = translate(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-attributes]").forEach((element) => {
      element.dataset.i18nAttributes.split(";").forEach((attributeMapping) => {
        const [attributeName, translationKey] = attributeMapping.split(":").map((part) => part.trim());
        element.setAttribute(attributeName, translate(translationKey));
      });
    });

    document.querySelectorAll("[data-language-option]").forEach((optionButton) => {
      const isActive = optionButton.dataset.languageOption === currentLanguage();
      optionButton.setAttribute("aria-pressed", String(isActive));
    });
  }

  async function setLanguage(language) {
    if (language === currentLanguage()) return;

    // main.js may register a cross-fade; switching works without it.
    const transition = window.languageTransition;
    if (transition) await transition.fadeOut();

    documentRoot.lang = language;
    storeLanguage(language);
    applyTranslations();

    if (transition) transition.fadeIn();
  }

  document.querySelectorAll("[data-language-toggle]").forEach((toggleButton) => {
    toggleButton.addEventListener("click", () => {
      setLanguage(currentLanguage() === "en" ? "pt-BR" : "en");
    });
  });

  document.querySelectorAll("[data-language-option]").forEach((optionButton) => {
    optionButton.addEventListener("click", () => {
      setLanguage(optionButton.dataset.languageOption);
    });
  });

  window.i18n = { translate, applyTranslations, currentLanguage, setLanguage };

  // The markup ships in English; this switches it to the detected language and
  // marks the active option in the footer.
  applyTranslations();
})();
