import type { Localized } from "./localized.ts";

/** Copy used by the page chrome (header, footer, navigation). Note content lives with each note. */
export const ui = {
  skipLink: { en: "Skip to content", pt: "Pular para o conteúdo" },
  home: { en: "Home", pt: "Início" },
  notes: { en: "Notes", pt: "Notas" },
  backToTop: { en: "Top", pt: "Topo" },
  onThisPage: { en: "On this page", pt: "Nesta página" },
  sources: { en: "Sources", pt: "Fontes" },
  copy: { en: "Copy", pt: "Copiar" },
  copied: { en: "Copied", pt: "Copiado" },
  copyFailed: { en: "Failed", pt: "Falhou" },
  expandDiagram: { en: "Expand", pt: "Ampliar" },
  closeDiagram: { en: "Close", pt: "Fechar" },
  zoomIn: { en: "Zoom in", pt: "Aumentar" },
  zoomOut: { en: "Zoom out", pt: "Diminuir" },
  theme: { en: "Theme", pt: "Tema" },
  themeAuto: { en: "auto", pt: "auto" },
  themeLight: { en: "light", pt: "claro" },
  themeDark: { en: "dark", pt: "escuro" },
  themeHurricane: { en: "hurricane", pt: "furacão" },
  language: { en: "Language", pt: "Idioma" },
  filesForMachines: { en: "Files for machines", pt: "Arquivos para máquinas" },
  quote: {
    en: "A computer can never be held accountable, therefore a computer must never make a management decision.",
    pt: "Um computador nunca pode ser responsabilizado; portanto, um computador nunca deve tomar uma decisão de gestão.",
  },
  quoteCitation: { en: "IBM internal training presentation, 1979", pt: "Apresentação interna de treinamento da IBM, 1979" },
  notFoundBackHome: { en: "Back home", pt: "Voltar ao início" },
} satisfies Record<string, Localized>;
