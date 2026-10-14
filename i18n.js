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
      "nav.practice": "Practice",
      "nav.principles": "Principles",
      "nav.notes": "Notes",
      "themeToggle.studio": "Switch to the Studio theme",
      "themeToggle.default": "Back to the default theme",
      "nav.status": "Status",
      "sideNav.label": "On this page",
      "sideNav.onThisPage": "On this page",
      "sideNav.toggle": "Sections",
      "sideNav.notes": "Notes",
      "backToTop.label": "Back to top",
      "back.label": "Page navigation",
      "back.home": "Home",
      "back.notes": "Notes",
      "languageToggle.label": "PT",
      "languageToggle.description": "Ver em português",

      "hero.title": "Software engineering, built with <em>quiet precision.</em>",
      "hero.lede": "Baselarte is a software engineering and creative technology company. We build systems, interfaces and infrastructure that are <em>simple on the surface</em> and rigorous underneath.",

      "about.title": "Simplicity is a discipline",
      "about.body": "Most software fails slowly, under the weight of what it never needed. We start from fundamentals, build only what is necessary, and then make it excellent. Clarity over abstraction. Fundamentals over fashion.",

      "practice.title": "What we work on",
      "practice.intro": "Four areas, in no particular hurry.",
      "practice.engineering": "<em>Engineering.</em> Software that is correct first, fast second and clever only when it must be. Clear boundaries, honest abstractions, code meant to be read.",
      "practice.infrastructure": "<em>Infrastructure.</em> Cloud, storage and delivery treated as craft: observable, reproducible and cheap to keep alive.",
      "practice.interfaces": "<em>Interfaces.</em> Calm, legible, fast. Fewer screens, better words, motion with a purpose.",
      "practice.creative": "<em>Creative technology.</em> Experiments, tools and small instruments that make an idea tangible before it becomes a product.",

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
      "notes.ds.title": "Design system",
      "notes.ds.description": "How this site is designed: colour, type, layout, icons, motion, theme and language.",
      "ds.metaTitle": "Design System Notes | Baselarte",
      "ds.metaDescription": "How the Baselarte site is designed: colour, type, layout, icons, motion, theme and language.",
      "ds.kicker": "Design system",
      "ds.heroTitle": "Calm by default, <em>precise underneath.</em>",
      "ds.heroLede": "How this site is designed: a handful of tokens, three typefaces, one column, a small set of icons and motion that stays out of the way.",
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
      "notes.st.title": "Site theme",
      "notes.st.description": "How the theme button works and how the Studio theme was derived from a reference site, with its triangular background.",
      "st.metaTitle": "Site Theme Notes | Baselarte",
      "st.metaDescription": "How the theme button works and how the “studio” theme was derived from a reference site, with a triangular line pattern.",
      "st.kicker": "Site theme",
      "st.heroTitle": "One site, <em>two looks.</em>",
      "st.heroLede": "The theme button changes how the site looks, never what it says.",
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
      "nav.practice": "Prática",
      "nav.principles": "Princípios",
      "nav.notes": "Notas",
      "themeToggle.studio": "Mudar para o tema Estúdio",
      "themeToggle.default": "Voltar ao tema padrão",
      "nav.status": "Status",
      "sideNav.label": "Nesta página",
      "sideNav.onThisPage": "Nesta página",
      "sideNav.toggle": "Seções",
      "sideNav.notes": "Notas",
      "backToTop.label": "Voltar ao topo",
      "back.label": "Navegação da página",
      "back.home": "Início",
      "back.notes": "Notas",
      "languageToggle.label": "EN",
      "languageToggle.description": "View in English",

      "hero.title": "Engenharia de software, feita com <em>precisão silenciosa.</em>",
      "hero.lede": "A Baselarte é uma empresa de engenharia de software e tecnologia criativa. Construímos sistemas, interfaces e infraestrutura <em>simples na superfície</em> e rigorosos por dentro.",

      "about.title": "Simplicidade é disciplina",
      "about.body": "A maior parte dos softwares falha devagar, sob o peso do que nunca precisou ter. Partimos dos fundamentos, construímos apenas o necessário e, então, o tornamos excelente. Clareza acima da abstração. Fundamentos acima da moda.",

      "practice.title": "No que trabalhamos",
      "practice.intro": "Quatro frentes, sem pressa alguma.",
      "practice.engineering": "<em>Engenharia.</em> Software correto primeiro, rápido depois e engenhoso só quando necessário. Limites claros, abstrações honestas, código feito para ser lido.",
      "practice.infrastructure": "<em>Infraestrutura.</em> Nuvem, armazenamento e entrega tratados como ofício: observáveis, reproduzíveis e baratos de manter.",
      "practice.interfaces": "<em>Interfaces.</em> Calmas, legíveis, rápidas. Menos telas, palavras melhores, movimento com propósito.",
      "practice.creative": "<em>Tecnologia criativa.</em> Experimentos, ferramentas e pequenos instrumentos que tornam uma ideia tangível antes de ela virar produto.",

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
      "notes.ds.title": "Design system",
      "notes.ds.description": "Como este site é desenhado: cor, tipografia, layout, ícones, movimento, tema e idioma.",
      "ds.metaTitle": "Notas de Design System | Baselarte",
      "ds.metaDescription": "Como o site da Baselarte é desenhado: cor, tipografia, layout, ícones, movimento, tema e idioma.",
      "ds.kicker": "Design system",
      "ds.heroTitle": "Calmo por padrão, <em>preciso por dentro.</em>",
      "ds.heroLede": "Como este site é desenhado: poucos tokens, três fontes, uma coluna, um conjunto pequeno de ícones e um movimento que não atrapalha.",
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
      "notes.st.title": "Tema do site",
      "notes.st.description": "Como funciona o botão de tema e como o tema Estúdio foi derivado de um site de referência, com seu fundo triangular.",
      "st.metaTitle": "Notas do Tema do Site | Baselarte",
      "st.metaDescription": "Como funciona o botão de tema e como o tema “studio” foi derivado de um site de referência, com um padrão de linhas triangular.",
      "st.kicker": "Tema do site",
      "st.heroTitle": "Um site, <em>dois visuais.</em>",
      "st.heroLede": "O botão de tema muda como o site parece, nunca o que ele diz.",
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
