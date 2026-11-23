# Produto

<!-- impeccable:product-schema 1 -->

## Plataforma

web

## Público

Três públicos, todos confirmados como principais:

- Pessoas desenvolvedoras que chegam a uma nota por um buscador ou por uma resposta de IA e querem aprender um assunto (AWS, Docker, segurança, agentes de IA, bancos de dados).
- Possíveis clientes avaliando a Baselarte Ltda. como fornecedora; as notas são a prova de competência.
- O autor, que usa as notas como referência de trabalho.

## Propósito do produto

O baselarte.com é o site da Baselarte Ltda., uma empresa de engenharia de software e tecnologia criativa. O conteúdo é uma biblioteca de notas de estudo longas (27 quando isto foi escrito, em seis séries numeradas), escritas em português do Brasil. Sucesso: quem lê encontra rápido a nota de que precisa e fica para ler; um cliente sai convencido de que a empresa domina o ofício.

## Posicionamento

Notas escritas a partir da prática, com diagramas, simuladores e laboratórios para rodar, num site estático que funciona sem JavaScript.

## Contexto de uso

A maior parte dos leitores chega direto numa nota, no computador e no celular. As notas são longas (tabelas, código, diagramas, listas de perguntas e respostas, fontes). A página inicial é o índice de todas as notas, agrupadas por tema.

## Capacidades e restrições

- Site estático: o React renderiza cada página no build; ilhas para o tema e o player de música.
- Um idioma só, português do Brasil.
- Funciona sem JavaScript; os metadados de SEO e de busca por IA saem de cada nota.
- Tema: auto (sistema) / claro / escuro, precisa ficar.
- A página inicial abre com o índice das notas.

## Compromissos de marca

- Nome: Baselarte. Marca: a magnólia de cinco pétalas (forma fixa; a cor pode mudar).
- A citação da IBM de 1979 ("Um computador nunca pode ser responsabilizado…") fica na página inicial.
- Tipografia: Instrument Serif nos títulos, Inter no texto.
- Cor: página off-white quente, cinzas e um azul-marinho (#1b2a4e) para hover e para o item atual. A marca é cinza.
- Imagens: uma só, a magnólia como um pequeno contorno cinza no canto do rodapé; sem fotografias, sem arte decorativa. Favicon: um quadrado azul-marinho num bloco cinza-claro.
- Referência: um site editorial pessoal e mínimo (coluna estreita, títulos em serifa, texto cinza, filetes), como o autor pediu, com azul-marinho no lugar do vermelho-escuro dele.

## Evidências disponíveis

As próprias notas (src/notes/*), os seus diagramas e simuladores. Não existem depoimentos, lista de clientes nem métricas; nada disso pode ser inventado.

## Princípios do produto

- A leitura vem primeiro: estrutura, orientação e medida antes de decoração.
- Simples e expressivo: poucos elementos, cada um com convicção.
- Inspirado, nunca copiado: as referências definem o nível de acabamento, não a aparência.
- Tudo em português e funcionando sem JavaScript.
