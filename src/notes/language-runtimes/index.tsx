import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "language-runtimes",
  title: { en: "Java, Python and TypeScript in practice: Spring Boot, FastAPI and Node (environments, variables and Docker)", pt: "Java, Python e TypeScript na prática: Spring Boot, FastAPI e Node (ambientes, variáveis e Docker)" },
  seo: {
    title: { en: "Java, Python and TypeScript in practice: Spring Boot, FastAPI and Node (environments, variables and Docker)", pt: "Java, Python e TypeScript na prática: Spring Boot, FastAPI e Node (ambientes, variáveis e Docker)" },
    description: { en: "A practical guide to three stacks: Java with Spring Boot and Maven, Python with FastAPI and uv, and TypeScript with Node. Tools, environments, how .env, environment variables and profiles reach the program, how to run, how to clean your machine, and how to run each one with Docker.", pt: "Um guia prático de três pilhas: Java com Spring Boot e Maven, Python com FastAPI e uv, e TypeScript com Node. Ferramentas, ambientes, como o .env, as variáveis de ambiente e os perfis chegam ao programa, como executar, como limpar a máquina e como rodar cada uma com Docker." },
  },
  summary: "A practical guide to three stacks: Java with Spring Boot and Maven, Python with FastAPI and uv, and TypeScript with Node. Tools, environments, how .env, environment variables and profiles reach the program, how to run, how to clean your machine, and how to run each one with Docker. Covers JDK, Maven (lifecycle, wrapper) and Spring Boot profiles, .env import and the property precedence ladder; Python pitfalls (PEP 668, venv), uv, FastAPI dev versus run and pydantic-settings; Node type stripping, tsc, npm ci, --env-file and zod; a Compose file running all three; cleanup commands and a symptom/cause table, with official sources.",
  kicker: { en: "Practical guide", pt: "Guia prático" },
  heroTitle: { en: <>Java, Python and TypeScript, <em>what the tutorials skip.</em></>, pt: <>Java, Python e TypeScript, <em>o que os tutoriais pulam.</em></> },
  heroLede: { en: "Maven and Spring profiles, uv and virtual environments, npm and tsconfig: what each tool does, how .env and environment variables reach your program, how to clean up what they leave behind, and how to run all three with Docker.", pt: "Maven e perfis do Spring, uv e ambientes virtuais, npm e tsconfig: o que cada ferramenta faz, como o .env e as variáveis de ambiente chegam ao seu programa, como limpar o que elas deixam para trás e como rodar as três com Docker." },
  published: "2026-10-29",
  updated: "2026-10-29",
  toc: [
    {
      items: [
        { id: "map", title: <T pt="O mapa: o que toda pilha tem" en="The map: what every stack has" /> },
        { id: "config", title: <T pt="Configuração: a regra que vale nas três" en="Configuration: the rule that holds in all three" /> },
        { id: "java", title: <T pt="Java com Spring Boot" en="Java with Spring Boot" /> },
        { id: "python", title: <T pt="Python com FastAPI" en="Python with FastAPI" /> },
        { id: "ts", title: <T pt="TypeScript com Node" en="TypeScript with Node" /> },
        { id: "docker", title: <T pt="Docker: o mesmo desenho nas três" en="Docker: the same shape in all three" /> },
        { id: "tracks", title: <T pt="Limpando os trilhos: o que fica na sua máquina" en="Cleaning the tracks: what stays on your machine" /> },
        { id: "cheat-lg", title: <T pt="Cola e revisão" en="Cheat sheet and review" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="map" title={<T pt="O mapa: o que toda pilha tem" en="The map: what every stack has" />}>
        <p><T pt={<>Aprender uma linguagem nova costuma travar não na linguagem, e sim nas <strong>ferramentas ao redor</strong>: qual versão está instalada, onde as dependências vão parar, por que o programa não enxerga a variável que você definiu. As três pilhas desta nota (Java com Spring Boot, Python com FastAPI e TypeScript com Node) têm o mesmo esqueleto. Se você aprender o esqueleto uma vez, cada pilha vira só uma troca de nomes.</>} en={<>Learning a new language usually gets stuck not on the language but on the <strong>tools around it</strong>: which version is installed, where dependencies end up, why the program does not see the variable you set. The three stacks in this note (Java with Spring Boot, Python with FastAPI and TypeScript with Node) share the same skeleton. Learn the skeleton once and each stack becomes a change of names.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Cada linguagem repete o mesmo desenho: um runtime, uma ferramenta que gerencia dependências a partir de um manifesto, um artefato e um comando de início." en="Each language repeats the same shape: a runtime, a tool that manages dependencies from a manifest, an artifact and a start command." />}>
          <svg viewBox="0 0 700 292" role="img" aria-label="As três pilhas lado a lado / The three stacks side by side">
            <text x="115" y="18" className="mut" textAnchor="middle">Java + Spring Boot</text>
            <rect x="10" y="30" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="115" y="49" className="mono" textAnchor="middle">JDK 25</text>
            <text x="115" y="67" className="mono mut" textAnchor="middle">javac + java</text>
            <path d="M115 80L115 96" className="ln" />
            <path d="M112.0 89.7L115 96L118.0 89.7" className="ln" />
            <rect x="10" y="96" width="210" height="50" rx="4" className="brandfill" />
            <text x="115" y="115" className="mono" textAnchor="middle">Maven</text>
            <text x="115" y="133" className="mono mut" textAnchor="middle">pom.xml</text>
            <path d="M115 146L115 162" className="ln" />
            <path d="M112.0 155.7L115 162L118.0 155.7" className="ln" />
            <rect x="10" y="162" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="115" y="181" className="mono" textAnchor="middle">target/hello.jar</text>
            <text x="115" y="199" className="mono mut" textAnchor="middle">jar executável</text>
            <path d="M115 212L115 228" className="ln" />
            <path d="M112.0 221.7L115 228L118.0 221.7" className="ln" />
            <rect x="10" y="228" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="115" y="247" className="mono" textAnchor="middle">java -jar app.jar</text>
            <text x="115" y="265" className="mono mut" textAnchor="middle">Tomcat embutido</text>
            <text x="350" y="18" className="mut" textAnchor="middle">Python + FastAPI</text>
            <rect x="245" y="30" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="350" y="49" className="mono" textAnchor="middle">Python 3.12</text>
            <text x="350" y="67" className="mono mut" textAnchor="middle">python / python3</text>
            <path d="M350 80L350 96" className="ln" />
            <path d="M347.0 89.7L350 96L353.0 89.7" className="ln" />
            <rect x="245" y="96" width="210" height="50" rx="4" className="brandfill" />
            <text x="350" y="115" className="mono" textAnchor="middle">uv</text>
            <text x="350" y="133" className="mono mut" textAnchor="middle">pyproject.toml + uv.lock</text>
            <path d="M350 146L350 162" className="ln" />
            <path d="M347.0 155.7L350 162L353.0 155.7" className="ln" />
            <rect x="245" y="162" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="350" y="181" className="mono" textAnchor="middle">.venv/</text>
            <text x="350" y="199" className="mono mut" textAnchor="middle">python + pacotes</text>
            <path d="M350 212L350 228" className="ln" />
            <path d="M347.0 221.7L350 228L353.0 221.7" className="ln" />
            <rect x="245" y="228" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="350" y="247" className="mono" textAnchor="middle">fastapi run</text>
            <text x="350" y="265" className="mono mut" textAnchor="middle">uvicorn por baixo</text>
            <text x="585" y="18" className="mut" textAnchor="middle">TypeScript + Node</text>
            <rect x="480" y="30" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="585" y="49" className="mono" textAnchor="middle">Node 24</text>
            <text x="585" y="67" className="mono mut" textAnchor="middle">node</text>
            <path d="M585 80L585 96" className="ln" />
            <path d="M582.0 89.7L585 96L588.0 89.7" className="ln" />
            <rect x="480" y="96" width="210" height="50" rx="4" className="brandfill" />
            <text x="585" y="115" className="mono" textAnchor="middle">npm</text>
            <text x="585" y="133" className="mono mut" textAnchor="middle">package.json + lock</text>
            <path d="M585 146L585 162" className="ln" />
            <path d="M582.0 155.7L585 162L588.0 155.7" className="ln" />
            <rect x="480" y="162" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="585" y="181" className="mono" textAnchor="middle">node_modules/ + dist/</text>
            <text x="585" y="199" className="mono mut" textAnchor="middle">pacotes + JS compilado</text>
            <path d="M585 212L585 228" className="ln" />
            <path d="M582.0 221.7L585 228L588.0 221.7" className="ln" />
            <rect x="480" y="228" width="210" height="50" rx="4" className="ln fillsoft" />
            <text x="585" y="247" className="mono" textAnchor="middle">node dist/server.js</text>
            <text x="585" y="265" className="mono mut" textAnchor="middle">ou node src/server.ts</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Peça" en="Piece" />, "Java + Spring Boot", "Python + FastAPI", "TypeScript + Node"]}
          rows={[
            [<T pt="Runtime" en="Runtime" />, <>JDK 25 (<code>java</code>, <code>javac</code>)</>, <>Python 3.12 (<code>python3</code>)</>, <>Node 24 (<code>node</code>)</>],
            [<T pt="Gerenciador de dependências e build" en="Dependency and build manager" />, <>Maven (<code>mvn</code> ou <code>./mvnw</code>)</>, <>uv (<code>uv</code>)</>, <>npm (<code>npm</code>)</>],
            [<T pt="Manifesto (o que o projeto pede)" en="Manifest (what the project asks for)" />, <code>pom.xml</code>, <code>pyproject.toml</code>, <code>package.json</code>],
            [<T pt="Lock (versões exatas)" en="Lock (exact versions)" />, <T pt={<>não há por padrão; o <code>starter-parent</code> fixa as versões</>} en={<>none by default; the <code>starter-parent</code> pins versions</>} />, <code>uv.lock</code>, <code>package-lock.json</code>],
            [<T pt="Onde as dependências ficam" en="Where dependencies live" />, <><code>~/.m2/repository</code> (<T pt="global" en="global" />)</>, <><code>.venv/</code> (<T pt="por projeto" en="per project" />)</>, <><code>node_modules/</code> (<T pt="por projeto" en="per project" />)</>],
            [<T pt="Framework web" en="Web framework" />, <>Spring Boot (Tomcat <T pt="embutido" en="embedded" />)</>, "FastAPI (uvicorn)", <T pt={<>no lab, só <code>node:http</code></>} en={<>in the lab, just <code>node:http</code></>} />],
            [<T pt="Arquivo de configuração" en="Configuration file" />, <code>application.properties</code>, <T pt={<>classe <code>Settings</code> (+ <code>.env</code>)</>} en={<><code>Settings</code> class (+ <code>.env</code>)</>} />, <T pt={<>objeto validado (+ <code>.env</code>)</>} en={<>validated object (+ <code>.env</code>)</>} />],
            [<T pt="Porta padrão do lab" en="Lab default port" />, "8080", "8000", "3000"],
          ]}
        />
        <p><T pt={<>Todo o código desta nota foi construído e executado de verdade (Maven 3.9.16 e uv 0.13.6 em contêineres, Node e JDK também no host). Onde algo <em>não</em> foi executado, a nota diz. O projeto de laboratório é o mesmo nas três linguagens: um servidor com <code>/health</code> e <code>/config</code>, que devolve uma saudação lida da configuração e se existe uma senha, <em>sem nunca devolver a senha</em>.</>} en={<>All the code in this note was built and run for real (Maven 3.9.16 and uv 0.13.6 in containers, Node and the JDK on the host too). Where something was <em>not</em> run, the note says so. The lab project is the same in all three languages: a server with <code>/health</code> and <code>/config</code> that returns a greeting read from the configuration and whether a password is set, <em>never returning the password itself</em>.</>} /></p>
      </Section>
      <Section id="config" title={<T pt="Configuração: a regra que vale nas três" en="Configuration: the rule that holds in all three" />}>
        <p><T pt={<>Antes de cada pilha, a ideia que mais confunde iniciantes: <strong>nenhuma linguagem lê o arquivo <code>.env</code> sozinha</strong>. O <code>.env</code> é só um arquivo de texto com <code>CHAVE=valor</code>. Quem o transforma em configuração é uma biblioteca ou uma opção que você liga de propósito. O que todas as linguagens leem sozinhas são as <strong>variáveis de ambiente</strong> do processo, ou seja, o que o sistema operacional entrega ao programa quando ele inicia.</>} en={<>Before each stack, the idea that confuses beginners the most: <strong>no language reads the <code>.env</code> file by itself</strong>. A <code>.env</code> is just a text file with <code>KEY=value</code>. What turns it into configuration is a library or an option you switch on on purpose. What every language reads by itself are the process's <strong>environment variables</strong>, that is, what the operating system hands to the program when it starts.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A mesma escada vale nas três linguagens: o que está acima vence o que está abaixo. Foi o que medimos em cada uma." en="The same ladder holds in all three languages: what is higher wins over what is lower. It is what we measured in each one." />}>
          <svg viewBox="0 0 700 284" role="img" aria-label="Ordem de precedência da configuração / Configuration precedence">
            <rect x="10" y="16" width="380" height="52" rx="4" className="brandfill" />
            <text x="200" y="37" className="pt" textAnchor="middle">1. Argumentos explícitos</text>
            <text x="200" y="37" className="en" textAnchor="middle">1. Explicit arguments</text>
            <text x="200" y="56" className="mono mut" textAnchor="middle">--app.greeting=x · Settings(greeting=…)</text>
            <path d="M390 42L450 104" className="ln" />
            <path d="M443.4 101.6L450 104L447.8 97.4" className="ln" />
            <rect x="10" y="78" width="380" height="52" rx="4" className="ln fillsoft" />
            <text x="200" y="99" className="pt" textAnchor="middle">2. Variáveis de ambiente</text>
            <text x="200" y="99" className="en" textAnchor="middle">2. Environment variables</text>
            <text x="200" y="118" className="mono mut" textAnchor="middle">APP_GREETING=x (SO, Docker, CI)</text>
            <path d="M390 104L450 104" className="ln" />
            <path d="M443.7 107.0L450 104L443.7 101.0" className="ln" />
            <rect x="10" y="140" width="380" height="52" rx="4" className="ln fillsoft" />
            <text x="200" y="161" className="pt" textAnchor="middle">3. Arquivo .env, se o runtime for mandado ler</text>
            <text x="200" y="161" className="en" textAnchor="middle">3. A .env file, if the runtime is told to read it</text>
            <text x="200" y="180" className="mono mut" textAnchor="middle">config.import · env_file= · --env-file</text>
            <path d="M390 166L450 104" className="ln" />
            <path d="M447.8 110.6L450 104L443.4 106.4" className="ln" />
            <rect x="10" y="202" width="380" height="52" rx="4" className="ln" />
            <text x="200" y="223" className="pt" textAnchor="middle">4. Valores padrão</text>
            <text x="200" y="223" className="en" textAnchor="middle">4. Defaults</text>
            <text x="200" y="242" className="mono mut" textAnchor="middle">application.properties · settings.py · env.ts</text>
            <path d="M390 228L450 104" className="ln" />
            <path d="M450.0 111.0L450 104L444.5 108.3" className="ln" />
            <rect x="450" y="70" width="240" height="68" rx="4" className="brandfill" />
            <text x="570" y="98" className="pt" textAnchor="middle">o processo enxerga</text>
            <text x="570" y="98" className="en" textAnchor="middle">the process sees</text>
            <text x="570" y="118" className="pt mut" textAnchor="middle">UM valor por nome</text>
            <text x="570" y="118" className="en mut" textAnchor="middle">ONE value per name</text>
            <text x="402" y="266" className="pt mut" textAnchor="start">mais forte ↑ / ↓ mais fraco</text>
            <text x="402" y="266" className="en mut" textAnchor="start">stronger ↑ / ↓ weaker</text>
          </svg>
        </Diagram>
        <p><T pt={<>A escada acima é a regra comum, e eu a medi nas três (a tabela de cada linguagem mostra os números). Em todas, uma variável de ambiente vence o <code>.env</code>, e o <code>.env</code> vence o valor padrão do código. Isso é intencional: no seu computador você usa o <code>.env</code>; no servidor ou no Docker, o ambiente entra por fora e substitui, sem tocar no código. É a ideia do fator III do <a href="https://12factor.net/config" rel="noopener">The Twelve-Factor App</a>: configuração que muda entre ambientes mora no ambiente, não no código.</>} en={<>The ladder above is the common rule, and I measured it in all three (each language's table shows the numbers). In every one, an environment variable beats the <code>.env</code>, and the <code>.env</code> beats the default in the code. That is intentional: on your computer you use the <code>.env</code>; on a server or in Docker the environment comes in from outside and overrides it, without touching the code. It is the idea of factor III of <a href="https://12factor.net/config" rel="noopener">The Twelve-Factor App</a>: configuration that changes between environments lives in the environment, not in the code.</>} /></p>
        <ul className="ds-list">
          <li><T pt={<><strong>Variável de ambiente só vale para o processo que a recebe.</strong> <code>export GREETING=oi</code> afeta aquele terminal e o que ele iniciar depois; outro terminal, o IDE e o Docker não enxergam. É a causa número um de “defini a variável e o programa não vê”. Para testar, prefixe o comando: <code>GREETING=oi node src/server.ts</code>.</>} en={<><strong>An environment variable only applies to the process that receives it.</strong> <code>export GREETING=oi</code> affects that terminal and what it starts afterwards; another terminal, the IDE and Docker do not see it. It is the number one cause of “I set the variable and the program does not see it”. To test, prefix the command: <code>GREETING=oi node src/server.ts</code>.</>} /></li>
          <li><T pt={<><strong>Tudo é texto.</strong> <code>PORT=8080</code> chega como a string <code>"8080"</code>. Cada pilha converte de um jeito (Spring converte pelo tipo do campo, o pydantic pela anotação, no TypeScript você usa o zod). Converta e valide <em>uma vez, na partida</em>: se faltar algo, o app deve nem subir.</>} en={<><strong>Everything is text.</strong> <code>PORT=8080</code> arrives as the string <code>"8080"</code>. Each stack converts in its own way (Spring converts by the field type, pydantic by the annotation, in TypeScript you use zod). Convert and validate <em>once, at startup</em>: if something is missing, the app should not even start.</>} /></li>
          <li><T pt={<><strong>Nunca versione o <code>.env</code> real.</strong> Coloque <code>.env</code> no <code>.gitignore</code> e no <code>.dockerignore</code>, e versione um <code>.env.example</code> sem segredos. Um segredo que entrou no Git continua no histórico mesmo depois de apagado.</>} en={<><strong>Never commit the real <code>.env</code>.</strong> Put <code>.env</code> in <code>.gitignore</code> and <code>.dockerignore</code>, and commit a <code>.env.example</code> with no secrets. A secret that got into Git stays in the history even after it is deleted.</>} /></li>
          <li><T pt={<><strong>Não devolva segredos nas respostas nem nos logs.</strong> O endpoint <code>/config</code> do laboratório responde só <code>dbPasswordSet: true/false</code>, nunca o valor.</>} en={<><strong>Do not return secrets in responses or logs.</strong> The lab's <code>/config</code> endpoint only answers <code>dbPasswordSet: true/false</code>, never the value.</>} /></li>
        </ul>
      </Section>
      <Section id="java" title={<T pt="Java com Spring Boot" en="Java with Spring Boot" />}>
        <h3><T pt="O que precisa estar instalado: o JDK" en="What must be installed: the JDK" /></h3>
        <p><T pt={<>Para <em>desenvolver</em> você precisa do <strong>JDK</strong> (Java Development Kit): ele traz o compilador <code>javac</code> e o <code>java</code> que executa. Para só <em>rodar</em> um jar basta o <strong>JRE</strong>, a parte de execução (as imagens Docker <code>-jre</code> trazem só ela). O Spring Boot 4.1 exige Java 17 ou mais e funciona até o Java 27, segundo a <a href="https://docs.spring.io/spring-boot/system-requirements.html" rel="noopener">página de requisitos</a>; nos testes usei o 25 (LTS). Confira com <code>java -version</code> e <code>javac -version</code>; se o segundo não existir, você tem só o JRE. A variável <code>JAVA_HOME</code> diz ao Maven qual JDK usar quando há mais de um instalado.</>} en={<>To <em>develop</em> you need the <strong>JDK</strong> (Java Development Kit): it brings the <code>javac</code> compiler and the <code>java</code> launcher. To just <em>run</em> a jar the <strong>JRE</strong>, the runtime part, is enough (the <code>-jre</code> Docker images carry only that). Spring Boot 4.1 requires Java 17 or later and works up to Java 27, per the <a href="https://docs.spring.io/spring-boot/system-requirements.html" rel="noopener">requirements page</a>; in the tests I used 25 (LTS). Check with <code>java -version</code> and <code>javac -version</code>; if the second does not exist, you have only the JRE. The <code>JAVA_HOME</code> variable tells Maven which JDK to use when more than one is installed.</>} /></p>
        <h3><T pt="Maven: o que ele faz" en="Maven: what it does" /></h3>
        <p><T pt={<>O <strong>Maven</strong> é a ferramenta de build do Java. Ele lê o <code>pom.xml</code> (Project Object Model), baixa do <a href="https://central.sonatype.com/" rel="noopener">Maven Central</a> as bibliotecas que você declarou (e as que elas precisam), compila, roda os testes e empacota o resultado. As bibliotecas ficam num <strong>repositório local global</strong>, <code>~/.m2/repository</code>, compartilhado por todos os projetos. Cada biblioteca é identificada por três coordenadas: <code>groupId:artifactId:version</code>.</>} en={<><strong>Maven</strong> is Java's build tool. It reads the <code>pom.xml</code> (Project Object Model), downloads from <a href="https://central.sonatype.com/" rel="noopener">Maven Central</a> the libraries you declared (and the ones they need), compiles, runs the tests and packages the result. Libraries live in a <strong>global local repository</strong>, <code>~/.m2/repository</code>, shared by all projects. Each library is identified by three coordinates: <code>groupId:artifactId:version</code>.</>} /></p>
        <CodeBlock code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.2</version>
  </parent>

  <groupId>demo</groupId>
  <artifactId>hello</artifactId>
  <version>0.0.1</version>

  <properties>
    <java.version>25</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>`} />
        <ul className="ds-list">
          <li><T pt={<><code>&lt;parent&gt;</code> com o <code>spring-boot-starter-parent</code>: herda as versões testadas juntas de centenas de bibliotecas. Por isso os <code>&lt;dependency&gt;</code> abaixo <em>não têm versão</em>. A versão do Spring Boot (aqui 4.1.2) é a única que você escolhe.</>} en={<><code>&lt;parent&gt;</code> with <code>spring-boot-starter-parent</code>: inherits the versions of hundreds of libraries tested together. That is why the <code>&lt;dependency&gt;</code> entries below have <em>no version</em>. The Spring Boot version (here 4.1.2) is the only one you choose.</>} /></li>
          <li><T pt={<><strong>Starters</strong> (<code>spring-boot-starter-webmvc</code>, <code>-actuator</code>): uma dependência que puxa o conjunto certo de bibliotecas para um assunto. Um starter para web traz o servidor embutido, o JSON e o framework MVC.</>} en={<><strong>Starters</strong> (<code>spring-boot-starter-webmvc</code>, <code>-actuator</code>): one dependency that pulls in the right set of libraries for a topic. A web starter brings the embedded server, JSON and the MVC framework.</>} /></li>
          <li><T pt={<><code>spring-boot-maven-plugin</code>: ao empacotar, reescreve o jar para ser <strong>executável</strong> (um “fat jar” com as dependências dentro e um lançador). Sem ele você teria só o jar comum, sem as dependências dentro.</>} en={<><code>spring-boot-maven-plugin</code>: when packaging, rewrites the jar to be <strong>executable</strong> (a “fat jar” with the dependencies inside and a launcher). Without it you would get only a plain jar, without the dependencies inside.</>} /></li>
        </ul>
        <Diagram minWidth={620} caption={<T pt="Pedir uma fase executa todas as anteriores. Por isso mvn package também compila e testa. O clean é outro ciclo." en="Asking for a phase runs all the earlier ones. That is why mvn package also compiles and tests. clean is a separate lifecycle." />}>
          <svg viewBox="0 0 700 208" role="img" aria-label="Ciclo de vida do Maven / Maven lifecycle">
            <rect x="14" y="30" width="84" height="38" rx="4" className="ln fillsoft" />
            <text x="56" y="54" className="mono" textAnchor="middle">validate</text>
            <path d="M98 49L112 49" className="ln" />
            <path d="M105.7 52.0L112 49L105.7 46.0" className="ln" />
            <rect x="112" y="30" width="84" height="38" rx="4" className="ln fillsoft" />
            <text x="154" y="54" className="mono" textAnchor="middle">compile</text>
            <path d="M196 49L210 49" className="ln" />
            <path d="M203.7 52.0L210 49L203.7 46.0" className="ln" />
            <rect x="210" y="30" width="84" height="38" rx="4" className="ln fillsoft" />
            <text x="252" y="54" className="mono" textAnchor="middle">test</text>
            <path d="M294 49L308 49" className="ln" />
            <path d="M301.7 52.0L308 49L301.7 46.0" className="ln" />
            <rect x="308" y="30" width="84" height="38" rx="4" className="brandfill" />
            <text x="350" y="54" className="mono" textAnchor="middle">package</text>
            <path d="M392 49L406 49" className="ln" />
            <path d="M399.7 52.0L406 49L399.7 46.0" className="ln" />
            <rect x="406" y="30" width="84" height="38" rx="4" className="ln" />
            <text x="448" y="54" className="mono" textAnchor="middle">verify</text>
            <path d="M490 49L504 49" className="ln" />
            <path d="M497.7 52.0L504 49L497.7 46.0" className="ln" />
            <rect x="504" y="30" width="84" height="38" rx="4" className="ln" />
            <text x="546" y="54" className="mono" textAnchor="middle">install</text>
            <path d="M588 49L602 49" className="ln" />
            <path d="M595.7 52.0L602 49L595.7 46.0" className="ln" />
            <rect x="602" y="30" width="84" height="38" rx="4" className="ln" />
            <text x="644" y="54" className="mono" textAnchor="middle">deploy</text>
            <path d="M14 82L14 92L378 92L378 82" className="ln" fill="none" />
            <text x="14" y="112" className="pt" textAnchor="start">mvn package executa estas quatro, em ordem</text>
            <text x="14" y="112" className="en" textAnchor="start">mvn package runs these four, in order</text>
            <text x="14" y="18" className="pt mut" textAnchor="start">ciclo de vida padrão</text>
            <text x="14" y="18" className="en mut" textAnchor="start">default lifecycle</text>
            <rect x="255" y="140" width="190" height="52" rx="4" className="ln" />
            <text x="350" y="162" className="mono" textAnchor="middle">hello-0.0.1.jar</text>
            <text x="350" y="180" className="pt mut" textAnchor="middle">saída do package</text>
            <text x="350" y="180" className="en mut" textAnchor="middle">output of package</text>
            <rect x="451" y="140" width="190" height="52" rx="4" className="ln" />
            <text x="546" y="162" className="mono" textAnchor="middle">~/.m2/repository</text>
            <text x="546" y="180" className="pt mut" textAnchor="middle">cópia local no install</text>
            <text x="546" y="180" className="en mut" textAnchor="middle">local copy on install</text>
            <rect x="14" y="140" width="200" height="52" rx="4" className="ln dash" />
            <text x="114" y="162" className="mono" textAnchor="middle">mvn clean</text>
            <text x="114" y="180" className="pt mut" textAnchor="middle">apaga o target/ (ciclo à parte)</text>
            <text x="114" y="180" className="en mut" textAnchor="middle">deletes target/ (separate lifecycle)</text>
            <path d="M350 92L350 140" className="ln" />
            <path d="M347.0 133.7L350 140L353.0 133.7" className="ln" />
            <path d="M546 68L546 140" className="ln" />
            <path d="M543.0 133.7L546 140L549.0 133.7" className="ln" />
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="O que faz" en="What it does" />]}
          rows={[
            [<code>mvn package</code>, <T pt={<>Valida, compila, testa e gera <code>target/hello-0.0.1.jar</code>.</>} en={<>Validates, compiles, tests and produces <code>target/hello-0.0.1.jar</code>.</>} />],
            [<code>mvn clean package</code>, <T pt={<>Apaga o <code>target/</code> antes. Use quando algo “não atualiza”.</>} en={<>Deletes <code>target/</code> first. Use it when something “does not update”.</>} />],
            [<code>mvn spring-boot:run</code>, <T pt="Compila e roda direto, sem montar o jar. É o “modo dev”." en="Compiles and runs directly, without building the jar. It is the “dev mode”." />],
            [<code>mvn -DskipTests package</code>, <T pt="Pula os testes (use no Dockerfile; rode os testes no CI)." en="Skips the tests (use in the Dockerfile; run the tests in CI)." />],
            [<code>mvn dependency:tree</code>, <T pt="Mostra quem trouxe cada biblioteca. Útil para conflitos de versão." en="Shows who brought in each library. Useful for version conflicts." />],
          ]}
        />
        <Callout icon="check"><T pt={<><strong>Use o Maven Wrapper (<code>./mvnw</code>).</strong> Rodei <code>mvn wrapper:wrapper</code> no projeto e ele criou <code>mvnw</code>, <code>mvnw.cmd</code> e <code>.mvn/wrapper/</code>. Na primeira execução o <code>./mvnw</code> baixa a versão exata do Maven escrita em <code>maven-wrapper.properties</code> (aqui, 3.9.16), então ninguém precisa instalar o Maven e todos usam a mesma versão. Versione esses arquivos. A saída de <code>./mvnw -v</code> confirmou Maven 3.9.16 e Java 25.</>} en={<><strong>Use the Maven Wrapper (<code>./mvnw</code>).</strong> I ran <code>mvn wrapper:wrapper</code> in the project and it created <code>mvnw</code>, <code>mvnw.cmd</code> and <code>.mvn/wrapper/</code>. On first run <code>./mvnw</code> downloads the exact Maven version written in <code>maven-wrapper.properties</code> (here, 3.9.16), so nobody needs to install Maven and everyone uses the same version. Commit those files. The <code>./mvnw -v</code> output confirmed Maven 3.9.16 and Java 25.</>} /></Callout>
        <h3><T pt="Spring Boot: como funciona" en="Spring Boot: how it works" /></h3>
        <p><T pt={<>O <strong>Spring</strong> é um contêiner de objetos. Você escreve classes e o Spring as cria e as liga umas às outras (<em>injeção de dependência</em>): no código abaixo, o construtor de <code>Hello</code> pede um <code>Settings</code> e um <code>Environment</code>, e o Spring entrega os dois, sem nenhum <code>new</code>. O <strong>Spring Boot</strong> acrescenta a conveniência: a <em>autoconfiguração</em> olha o que está no classpath e configura sozinha. Pusemos o starter web, então ele sobe um Tomcat embutido na porta 8080 e registra o JSON; pusemos o actuator, então ele expõe <code>/actuator/health</code>. A anotação <code>@SpringBootApplication</code> liga tudo isso, e o <code>main</code> só chama <code>SpringApplication.run</code>.</>} en={<><strong>Spring</strong> is an object container. You write classes and Spring creates them and wires them together (<em>dependency injection</em>): in the code below, the <code>Hello</code> constructor asks for a <code>Settings</code> and an <code>Environment</code>, and Spring supplies both, with no <code>new</code>. <strong>Spring Boot</strong> adds the convenience: <em>auto-configuration</em> looks at what is on the classpath and configures by itself. We added the web starter, so it starts an embedded Tomcat on port 8080 and registers JSON; we added the actuator, so it exposes <code>/actuator/health</code>. The <code>@SpringBootApplication</code> annotation switches all that on, and <code>main</code> just calls <code>SpringApplication.run</code>.</>} /></p>
        <CodeBlock code={`package demo;

import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableConfigurationProperties(App.Settings.class)
public class App {

  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }

  // app.greeting  <-  APP_GREETING (variável de ambiente) ou app.greeting (.properties)
  @ConfigurationProperties(prefix = "app")
  public record Settings(String greeting, String dbPassword) {}

  @RestController
  static class Hello {
    private final Settings settings;
    private final Environment env;

    Hello(Settings settings, Environment env) {
      this.settings = settings;
      this.env = env;
    }

    @GetMapping("/config")
    Map<String, Object> config() {
      return Map.of(
          "greeting", settings.greeting(),
          "profiles", env.getActiveProfiles(),
          "dbPasswordSet", settings.dbPassword() != null && !settings.dbPassword().isBlank());
    }
  }
}`} />
        <ul className="ds-list">
          <li><T pt={<><code>@ConfigurationProperties(prefix = "app")</code> liga o grupo de propriedades <code>app.*</code> ao <code>record Settings</code>, já convertido para o tipo certo. É o jeito recomendado de ler configuração, em vez de espalhar <code>@Value</code>.</>} en={<><code>@ConfigurationProperties(prefix = "app")</code> binds the <code>app.*</code> group of properties to the <code>Settings</code> record, already converted to the right type. It is the recommended way to read configuration, instead of scattering <code>@Value</code>.</>} /></li>
          <li><T pt={<>O <strong>actuator</strong> dá observabilidade pronta. Com <code>management.endpoint.health.probes.enabled=true</code> ele publica <code>/actuator/health/liveness</code> e <code>/readiness</code>, que testei: <code>&#123;"status":"UP"&#125;</code>. Só expus o <code>health</code>; expor tudo (<code>*</code>) revela detalhes internos.</>} en={<>The <strong>actuator</strong> gives ready-made observability. With <code>management.endpoint.health.probes.enabled=true</code> it publishes <code>/actuator/health/liveness</code> and <code>/readiness</code>, which I tested: <code>&#123;"status":"UP"&#125;</code>. I exposed only <code>health</code>; exposing everything (<code>*</code>) reveals internal details.</>} /></li>
          <li><T pt={<>Documentação: a <a href="https://docs.spring.io/spring-boot/index.html" rel="noopener">referência do Spring Boot</a> (conceitos), o <a href="https://start.spring.io/" rel="noopener">Spring Initializr</a> (gera um projeto com as dependências que você marcar) e o <a href="https://docs.spring.io/spring-boot/appendix/application-properties/index.html" rel="noopener">apêndice de propriedades</a> (todas as chaves possíveis).</>} en={<>Documentation: the <a href="https://docs.spring.io/spring-boot/index.html" rel="noopener">Spring Boot reference</a> (concepts), the <a href="https://start.spring.io/" rel="noopener">Spring Initializr</a> (generates a project with the dependencies you tick) and the <a href="https://docs.spring.io/spring-boot/appendix/application-properties/index.html" rel="noopener">properties appendix</a> (every possible key).</>} /></li>
        </ul>
        <h3><T pt="Configuração: do .env ao .properties, e os perfis" en="Configuration: from .env to .properties, and profiles" /></h3>
        <p><T pt={<>O Spring lê a configuração de um arquivo, o <code>src/main/resources/application.properties</code> (ou <code>application.yml</code>), que vai para dentro do jar. É um arquivo de <code>chave=valor</code> com nomes em minúsculas separados por ponto (<code>app.greeting</code>). Já o <code>.env</code> usa MAIÚSCULAS com sublinhado (<code>APP_GREETING</code>). As duas formas se encontram assim:</>} en={<>Spring reads configuration from a file, <code>src/main/resources/application.properties</code> (or <code>application.yml</code>), which goes inside the jar. It is a <code>key=value</code> file with lowercase names separated by dots (<code>app.greeting</code>). A <code>.env</code> uses UPPERCASE with underscores (<code>APP_GREETING</code>). The two forms meet like this:</>} /></p>
        <CodeBlock code={`spring.application.name=hello
server.port=\${PORT:8080}

# valores padrão; qualquer um pode ser trocado por variável de ambiente
app.greeting=olá do application.properties
app.db-password=

management.endpoints.web.exposure.include=health
management.endpoint.health.probes.enabled=true

# lê o arquivo .env (se existir) como se fosse um .properties
spring.config.import=optional:file:.env[.properties]`} />
        <ol className="ds-steps">
          <li><T pt={<><strong>Variável de ambiente → propriedade, automático.</strong> O Spring converte o nome: troca <code>_</code> por <code>.</code> e ignora maiúsculas, então <code>APP_GREETING</code> vira <code>app.greeting</code> e <code>APP_DB_PASSWORD</code> vira <code>app.db-password</code>. Medi: <code>APP_DB_PASSWORD=x</code> e <code>APP_DBPASSWORD=x</code> ligaram o campo <code>dbPassword</code>. A <a href="https://docs.spring.io/spring-boot/reference/features/external-config.html" rel="noopener">referência</a> descreve a regra em “Binding From Environment Variables”.</>} en={<><strong>Environment variable → property, automatic.</strong> Spring converts the name: it turns <code>_</code> into <code>.</code> and ignores case, so <code>APP_GREETING</code> becomes <code>app.greeting</code> and <code>APP_DB_PASSWORD</code> becomes <code>app.db-password</code>. I measured: <code>APP_DB_PASSWORD=x</code> and <code>APP_DBPASSWORD=x</code> both set the <code>dbPassword</code> field. The <a href="https://docs.spring.io/spring-boot/reference/features/external-config.html" rel="noopener">reference</a> describes the rule under “Binding From Environment Variables”.</>} /></li>
          <li><T pt={<><strong>Placeholder: <code>$&#123;VARIAVEL:padrão&#125;</code>.</strong> Um valor do <code>.properties</code> pode citar outra propriedade ou variável. É o que a linha <code>server.port=$&#123;PORT:8080&#125;</code> faz: usa <code>PORT</code> se existir, senão 8080. É assim que você faz o <code>.properties</code> “ler” uma variável com nome livre.</>} en={<><strong>Placeholder: <code>$&#123;VARIABLE:default&#125;</code>.</strong> A <code>.properties</code> value can cite another property or variable. That is what the line <code>server.port=$&#123;PORT:8080&#125;</code> does: it uses <code>PORT</code> if it exists, otherwise 8080. This is how you make the <code>.properties</code> “read” a variable with a free name.</>} /></li>
          <li><T pt={<><strong>O <code>.env</code> só entra se você mandar:</strong> a última linha, <code>spring.config.import=optional:file:.env[.properties]</code>, diz ao Spring para ler o arquivo <code>.env</code> como se fosse um <code>.properties</code>. O <code>optional:</code> evita erro quando o arquivo não existe (no servidor, por exemplo), e o caminho é relativo a <em>onde você roda o comando</em>.</>} en={<><strong>The <code>.env</code> only comes in if you tell it to:</strong> the last line, <code>spring.config.import=optional:file:.env[.properties]</code>, tells Spring to read the <code>.env</code> file as if it were a <code>.properties</code>. The <code>optional:</code> prevents an error when the file does not exist (on a server, say), and the path is relative to <em>where you run the command</em>.</>} /></li>
        </ol>
        <p><T pt={<>Medi cada caso com o jar, trocando só a origem do valor. A coluna do meio é o que o <code>/config</code> devolveu em <code>greeting</code>:</>} en={<>I measured each case with the jar, changing only where the value came from. The middle column is what <code>/config</code> returned in <code>greeting</code>:</>} /></p>
        <Table
          head={[<T pt="Situação" en="Situation" />, "greeting", <T pt="Lição" en="Lesson" />]}
          rows={[
            [<T pt="nada definido" en="nothing set" />, <T pt={<>valor do <code>application.properties</code></>} en={<>value from <code>application.properties</code></>} />, <T pt="o padrão" en="the default" />],
            [<code>SPRING_PROFILES_ACTIVE=dev</code>, <T pt="“do perfil dev”" en="“from the dev profile”" />, <T pt="o arquivo do perfil sobrepõe o base" en="the profile file overrides the base" />],
            [<code>APP_GREETING=do-ambiente</code>, "do-ambiente", <T pt="o ambiente sobrepõe o arquivo" en="the environment overrides the file" />],
            [<T pt={<>ambiente + perfil <code>dev</code></>} en={<>environment + <code>dev</code> profile</>} />, "do-ambiente", <T pt="ambiente vence até o arquivo do perfil" en="environment beats even the profile file" />],
            [<><code>--app.greeting=do-argumento</code> + <T pt="ambiente" en="environment" /></>, "do-argumento", <T pt="o argumento de linha de comando vence tudo" en="the command-line argument beats everything" />],
            [<><code>.env</code> com <code>app.greeting=do-dotenv</code></>, "do-dotenv", <T pt="funciona: o nome é o da propriedade" en="works: the name is the property's" />],
            [<><code>.env</code> <T pt="e" en="and" /> <code>APP_GREETING=do-ambiente</code></>, "do-ambiente", <T pt={<>o ambiente vence o <code>.env</code></>} en={<>the environment beats the <code>.env</code></>} />],
            [<><code>.env</code> <T pt="com" en="with" /> <code>APP_GREETING=x</code> <T pt="(estilo shell)" en="(shell style)" /></>, <T pt={<>valor do <code>application.properties</code></>} en={<>value from <code>application.properties</code></>} />, <strong><T pt="não surtiu efeito!" en="had no effect!" /></strong>],
            [<T pt={<>o mesmo <code>.env</code> + <code>$&#123;APP_GREETING:…&#125;</code> no <code>.properties</code></>} en={<>the same <code>.env</code> + <code>$&#123;APP_GREETING:…&#125;</code> in the <code>.properties</code></>} />, "veio-do-dotenv", <T pt="o placeholder resolve" en="the placeholder resolves" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><strong>A pegadinha do <code>.env</code> no Spring.</strong> O <code>spring.config.import</code> carrega o <code>.env</code> como um arquivo de propriedades, e as chaves ficam <em>literais</em>. A conversão automática de <code>APP_GREETING</code> em <code>app.greeting</code> vale para variáveis de <em>ambiente do sistema</em>, não para chaves de um arquivo. Então: (a) escreva no <code>.env</code> os nomes das propriedades (<code>app.greeting=…</code>), ou (b) mantenha o estilo shell no <code>.env</code> e referencie com <code>$&#123;APP_GREETING:padrão&#125;</code> no <code>application.properties</code>. E, como o Docker e o shell exportam <code>APP_GREETING</code> de verdade, essa mesma chave passa a valer por fora, sem mudar nada.</>} en={<><strong>The <code>.env</code> trap in Spring.</strong> <code>spring.config.import</code> loads the <code>.env</code> as a properties file, and the keys stay <em>literal</em>. The automatic conversion of <code>APP_GREETING</code> into <code>app.greeting</code> applies to <em>system environment</em> variables, not to keys in a file. So: (a) write the property names in the <code>.env</code> (<code>app.greeting=…</code>), or (b) keep the shell style in the <code>.env</code> and reference it with <code>$&#123;APP_GREETING:default&#125;</code> in <code>application.properties</code>. And since Docker and the shell really export <code>APP_GREETING</code>, that same key then works from outside, with nothing changed.</>} /></Callout>
        <Callout tone="warn" icon="alert"><T pt={<><strong>Acentos no <code>.properties</code>.</strong> Escrevi “olá” em UTF-8 no <code>application.properties</code> e a resposta veio “olÃ¡”: o arquivo foi lido como Latin-1, o padrão dos <code>.properties</code>. Com o escape <code>olá</code> a resposta saiu correta (“olá”). Para textos com acento, use o escape ou o formato YAML. Não reproduzi com o <code>application.yml</code>; a referência é que decide.</>} en={<><strong>Accents in <code>.properties</code>.</strong> I wrote “olá” in UTF-8 in <code>application.properties</code> and the response came back “olÃ¡”: the file was read as Latin-1, the <code>.properties</code> default. With the escape <code>olá</code> the response was correct (“olá”). For text with accents, use the escape or the YAML format. I did not reproduce it with <code>application.yml</code>; the reference is what decides.</>} /></Callout>
        <h3><T pt="Perfis: dev, prod e o que são" en="Profiles: dev, prod and what they are" /></h3>
        <p><T pt={<>Um <strong>perfil</strong> (profile) é um <em>nome de ambiente</em> que escolhe quais arquivos de configuração entram. O arquivo base, <code>application.properties</code>, vale sempre. Se o perfil <code>dev</code> está ativo, o Spring também lê <code>application-dev.properties</code> e os valores dele <strong>sobrepõem</strong> os do base. Nada mais: um perfil não é uma opção mágica do Java, é só a convenção de nome <code>application-&#123;perfil&#125;.properties</code>.</>} en={<>A <strong>profile</strong> is an <em>environment name</em> that picks which configuration files come in. The base file, <code>application.properties</code>, always applies. If the <code>dev</code> profile is active, Spring also reads <code>application-dev.properties</code> and its values <strong>override</strong> the base ones. That is all: a profile is not a Java magic option, just the naming convention <code>application-&#123;profile&#125;.properties</code>.</>} /></p>
        <CodeBlock code={`app.greeting=olá do perfil dev
logging.level.demo=DEBUG

app.greeting=olá do perfil prod
logging.level.root=WARN`} />
        <Table
          head={[<T pt="Como ativar" en="How to activate" />, <T pt="Exemplo" en="Example" />]}
          rows={[
            [<T pt="Variável de ambiente (a mais usada em Docker)" en="Environment variable (the most used in Docker)" />, <code>SPRING_PROFILES_ACTIVE=prod</code>],
            [<T pt="Argumento do jar" en="Jar argument" />, <code>java -jar app.jar --spring.profiles.active=prod</code>],
            [<T pt="Maven em modo dev" en="Maven in dev mode" />, <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</code>],
            [<T pt="Vários perfis (o último vence)" en="Several profiles (last wins)" />, <code>SPRING_PROFILES_ACTIVE=prod,live</code>],
          ]}
        />
        <p><T pt={<>Testei o <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</code> (a resposta veio do arquivo do perfil dev) e a ativação por variável de ambiente, nas duas formas com o jar. Se nenhum perfil for ativado, o Spring usa o perfil <code>default</code>, e o log avisa: <em>No active profile set, falling back to 1 default profile: "default"</em>. Dois cuidados: (1) <strong>use perfis para o que muda de verdade entre ambientes</strong> (nível de log, endereço do banco); segredo não vai em arquivo de perfil dentro do jar, e sim em variável de ambiente; (2) um jar que contém <code>application-dev.properties</code> e <code>application-prod.properties</code> é <em>o mesmo jar</em> nos dois ambientes, e quem escolhe é o perfil ativo na hora de rodar. Também existe o formato de um arquivo só com várias seções (<code>#---</code> no <code>.properties</code>, <code>---</code> no YAML) com <code>spring.config.activate.on-profile</code>.</>} en={<>I tested <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</code> (the response came from the dev profile file) and activation by environment variable, in both forms with the jar. If no profile is activated, Spring uses the <code>default</code> profile, and the log says so: <em>No active profile set, falling back to 1 default profile: "default"</em>. Two cautions: (1) <strong>use profiles for what really changes between environments</strong> (log level, database address); a secret does not go in a profile file inside the jar, it goes in an environment variable; (2) a jar that contains <code>application-dev.properties</code> and <code>application-prod.properties</code> is <em>the same jar</em> in both environments, and the profile active at run time chooses. There is also a single-file format with several sections (<code>#---</code> in <code>.properties</code>, <code>---</code> in YAML) with <code>spring.config.activate.on-profile</code>.</>} /></p>
        <h3><T pt="Rodar e executar com Docker" en="Running and running with Docker" /></h3>
        <CodeBlock code={`# dev (compila e roda; o .env da pasta atual é lido)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# "produção" sem Docker: gerar o jar e rodar
./mvnw -DskipTests package
SPRING_PROFILES_ACTIVE=prod APP_GREETING=oi java -jar target/hello-0.0.1.jar`} />
        <p><T pt={<>No Docker, o build em duas etapas separa o JDK pesado (que tem o Maven) do JRE que roda o jar. O <code>--mount=type=cache</code> guarda o <code>~/.m2</code> entre builds; sem ele, cada mudança no código baixaria tudo de novo.</>} en={<>In Docker, the two-stage build separates the heavy JDK (which has Maven) from the JRE that runs the jar. The <code>--mount=type=cache</code> keeps <code>~/.m2</code> between builds; without it, each code change would download everything again.</>} /></p>
        <CodeBlock code={`# ---- etapa 1: compila com Maven (JDK completo) ----
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml .
# o cache do ~/.m2 sobrevive entre builds; sem ele, todo build baixa o mundo de novo
RUN --mount=type=cache,target=/root/.m2 mvn -q -B dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -B -DskipTests package

# ---- etapa 2: só o JRE e o jar ----
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /src/target/hello-0.0.1.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]`} />
        <CodeBlock code={`docker build -t lang-java .
docker run --rm -p 8080:8080 \\
  -e SPRING_PROFILES_ACTIVE=prod \\
  -e APP_GREETING="olá do contêiner" \\
  -e APP_DB_PASSWORD=segredo \\
  lang-java
curl localhost:8080/config`} />
        <p><T pt={<>Resultado medido: imagem de 517 MB; a resposta do contêiner trouxe o <code>greeting</code> da variável, o usuário do processo era 10001 (não root) e o <code>docker stop</code> terminou em menos de 1 s. Duas armadilhas reais: o <code>ENTRYPOINT</code> é o <code>java -jar</code>, então <code>docker run lang-java sh -c "…"</code> <em>não abre um shell</em>, passa os argumentos ao app (me custou um contêiner esquecido rodando; para abrir um shell use <code>--entrypoint sh</code>). E a imagem JRE não traz <code>curl</code> nem <code>wget</code>, então o <code>HEALTHCHECK</code> “clássico” não funciona nela. A saída que testei está no Compose da seção de Docker: o <code>bash</code> da imagem abre a conexão sozinho (<code>/dev/tcp</code>) e consulta <code>/actuator/health</code>.</>} en={<>Measured result: a 517 MB image; the container's response carried the <code>greeting</code> from the variable, the process user was 10001 (not root) and <code>docker stop</code> finished in under 1 s. Two real traps: the <code>ENTRYPOINT</code> is <code>java -jar</code>, so <code>docker run lang-java sh -c "…"</code> <em>does not open a shell</em>, it passes the arguments to the app (it cost me a forgotten running container; to open a shell use <code>--entrypoint sh</code>). And the JRE image carries neither <code>curl</code> nor <code>wget</code>, so the “classic” <code>HEALTHCHECK</code> does not work in it. The way out that I tested is in the Compose file in the Docker section: the image's <code>bash</code> opens the connection itself (<code>/dev/tcp</code>) and queries <code>/actuator/health</code>.</>} /></p>
      </Section>
      <Section id="python" title={<T pt="Python com FastAPI" en="Python with FastAPI" />}>
        <h3><T pt="O que costuma atrapalhar quem está aprendendo" en="What usually trips up learners" /></h3>
        <p><T pt={<>Python é fácil de escrever e difícil de <em>preparar</em>. Quatro tropeços vêm sempre, e reproduzi os principais no Ubuntu 24.04:</>} en={<>Python is easy to write and hard to <em>set up</em>. Four stumbles come up every time, and I reproduced the main ones on Ubuntu 24.04:</>} /></p>
        <ol className="ds-steps">
          <li><T pt={<><strong><code>python</code> não existe, só <code>python3</code>.</strong> No Ubuntu o comando é <code>python3</code>, e o <code>pip</code> pode nem estar instalado (aqui no meu computador não está; ele vem no pacote <code>python3-pip</code>). Dentro de uma <code>.venv</code> ativada, <code>python</code> passa a existir.</>} en={<><strong><code>python</code> does not exist, only <code>python3</code>.</strong> On Ubuntu the command is <code>python3</code>, and <code>pip</code> may not even be installed (on my computer here it is not; it comes in the <code>python3-pip</code> package). Inside an activated <code>.venv</code>, <code>python</code> starts to exist.</>} /></li>
          <li><T pt={<><strong><code>pip install</code> global dá erro.</strong> No Ubuntu 24.04, <code>pip install requests</code> respondeu <code>error: externally-managed-environment</code>. O Python do sistema é gerenciado pelo <code>apt</code> e o <a href="https://peps.python.org/pep-0668/" rel="noopener">PEP 668</a> o protege de proposital. Não use <code>--break-system-packages</code>: crie um ambiente virtual.</>} en={<><strong>A global <code>pip install</code> errors.</strong> On Ubuntu 24.04, <code>pip install requests</code> answered <code>error: externally-managed-environment</code>. The system Python is managed by <code>apt</code> and <a href="https://peps.python.org/pep-0668/" rel="noopener">PEP 668</a> protects it on purpose. Do not use <code>--break-system-packages</code>: create a virtual environment.</>} /></li>
          <li><T pt={<><strong>O ambiente virtual (<code>venv</code>) precisa de um pacote a parte.</strong> <code>python3 -m venv</code> falhou com “ensurepip is not available… install the python3-venv package” até eu instalar <code>python3-venv</code>. Depois funcionou.</>} en={<><strong>The virtual environment (<code>venv</code>) needs a separate package.</strong> <code>python3 -m venv</code> failed with “ensurepip is not available… install the python3-venv package” until I installed <code>python3-venv</code>. After that it worked.</>} /></li>
          <li><T pt={<><strong>Ferramentas demais.</strong> <code>pip</code>, <code>venv</code>, <code>pyenv</code>, <code>pip-tools</code>, <code>poetry</code>, <code>pipx</code>: cada uma resolve um pedaço. O <strong>uv</strong> junta tudo numa só: instala o próprio Python, cria a <code>.venv</code>, resolve e trava dependências e roda comandos. É o que uso na nota.</>} en={<><strong>Too many tools.</strong> <code>pip</code>, <code>venv</code>, <code>pyenv</code>, <code>pip-tools</code>, <code>poetry</code>, <code>pipx</code>: each solves a piece. <strong>uv</strong> joins them in one: it installs Python itself, creates the <code>.venv</code>, resolves and locks dependencies and runs commands. It is what I use in the note.</>} /></li>
        </ol>
        <Diagram minWidth={620} caption={<T pt="O manifesto e o lock ficam no Git. A .venv e o cache são descartáveis: nascem do manifesto e podem ser apagados sem medo." en="The manifest and the lock live in Git. The .venv and the cache are disposable: they are born from the manifest and can be deleted without fear." />}>
          <svg viewBox="0 0 700 188" role="img" aria-label="Onde ficam as coisas no Python com uv / Where things live in Python with uv">
            <rect x="10" y="20" width="190" height="70" rx="4" className="ln fillsoft" />
            <text x="105" y="44" className="mono" textAnchor="middle">pyproject.toml</text>
            <text x="105" y="62" className="mono" textAnchor="middle">uv.lock</text>
            <text x="105" y="80" className="pt mut" textAnchor="middle">no repositório (Git)</text>
            <text x="105" y="80" className="en mut" textAnchor="middle">in the repository (Git)</text>
            <path d="M200 55L250 55" className="ln" />
            <path d="M243.7 58.0L250 55L243.7 52.0" className="ln" />
            <rect x="250" y="30" width="120" height="50" rx="4" className="brandfill" />
            <text x="310" y="52" className="mono" textAnchor="middle">uv sync</text>
            <text x="310" y="69" className="mono" textAnchor="middle">uv run</text>
            <path d="M370 55L420 55" className="ln" />
            <path d="M413.7 58.0L420 55L413.7 52.0" className="ln" />
            <rect x="420" y="20" width="270" height="70" rx="4" className="ln" />
            <text x="555" y="44" className="mono" textAnchor="middle">.venv/</text>
            <text x="555" y="62" className="pt mut" textAnchor="middle">python + pacotes só deste projeto</text>
            <text x="555" y="62" className="en mut" textAnchor="middle">python + packages for this project only</text>
            <text x="555" y="80" className="pt mut" textAnchor="middle">apague e recrie quando quiser</text>
            <text x="555" y="80" className="en mut" textAnchor="middle">delete and recreate whenever you want</text>
            <rect x="250" y="128" width="120" height="44" rx="4" className="ln dash" />
            <text x="310" y="148" className="mono" textAnchor="middle">~/.cache/uv</text>
            <text x="310" y="164" className="pt mut" textAnchor="middle">cache de pacotes</text>
            <text x="310" y="164" className="en mut" textAnchor="middle">package cache</text>
            <path d="M310 128L310 80" className="ln" />
            <path d="M313.0 86.3L310 80L307.0 86.3" className="ln" />
            <rect x="420" y="128" width="270" height="44" rx="4" className="ln dash" />
            <text x="555" y="148" className="pt mono" textAnchor="middle">/usr/bin/python3 (sistema)</text>
            <text x="555" y="148" className="en mono" textAnchor="middle">/usr/bin/python3 (system)</text>
            <text x="555" y="164" className="pt mut" textAnchor="middle">pip aqui falha: PEP 668</text>
            <text x="555" y="164" className="en mut" textAnchor="middle">pip here fails: PEP 668</text>
            <rect x="10" y="128" width="190" height="44" rx="4" className="ln dash" />
            <text x="105" y="148" className="mono" textAnchor="middle">~/.local/share/uv/python</text>
            <text x="105" y="164" className="pt mut" textAnchor="middle">Pythons baixados pelo uv</text>
            <text x="105" y="164" className="en mut" textAnchor="middle">Pythons downloaded by uv</text>
          </svg>
        </Diagram>
        <h3><T pt="uv: ambiente, dependências e execução" en="uv: environment, dependencies and execution" /></h3>
        <p><T pt={<>O <a href="https://docs.astral.sh/uv/" rel="noopener">uv</a> segue o padrão do <code>pyproject.toml</code>. A ideia: você declara o que o projeto precisa e o uv produz o resto. Um <code>.venv</code> é só uma pasta com um <code>python</code> e os pacotes <em>deste</em> projeto, então “ativar” o ambiente é opcional: o <code>uv run</code> já usa a <code>.venv</code> certa, criando-a se faltar.</>} en={<><a href="https://docs.astral.sh/uv/" rel="noopener">uv</a> follows the <code>pyproject.toml</code> standard. The idea: you declare what the project needs and uv produces the rest. A <code>.venv</code> is just a folder with a <code>python</code> and the packages for <em>this</em> project, so “activating” the environment is optional: <code>uv run</code> already uses the right <code>.venv</code>, creating it if missing.</>} /></p>
        <CodeBlock code={`[project]
name = "hello"
version = "0.0.1"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.162",
    "pydantic-settings>=2.16",
]`} />
        <Table
          head={[<T pt="Comando" en="Command" />, <T pt="O que faz (conferido)" en="What it does (checked)" />]}
          rows={[
            [<code>uv init --bare</code>, <T pt={<>Cria só o <code>pyproject.toml</code>.</>} en={<>Creates only the <code>pyproject.toml</code>.</>} />],
            [<code>uv add "fastapi[standard]"</code>, <T pt={<>Escreve a dependência no <code>pyproject.toml</code>, gera o <code>uv.lock</code> e cria a <code>.venv</code> com tudo instalado. Foi o que vi com o <code>httpx</code>.</>} en={<>Writes the dependency into <code>pyproject.toml</code>, generates <code>uv.lock</code> and creates the <code>.venv</code> with everything installed. It is what I saw with <code>httpx</code>.</>} />],
            [<code>uv sync</code>, <T pt={<>Faz a <code>.venv</code> bater com o lock. Use <code>--frozen</code> para não alterar o lock (CI e Docker).</>} en={<>Makes the <code>.venv</code> match the lock. Use <code>--frozen</code> to not change the lock (CI and Docker).</>} />],
            [<code>uv run &lt;comando&gt;</code>, <T pt={<>Roda o comando dentro da <code>.venv</code> do projeto.</>} en={<>Runs the command inside the project's <code>.venv</code>.</>} />],
            [<code>uv python install 3.12</code>, <T pt={<>Baixa um Python para <code>~/.local/share/uv/python</code>, sem tocar no do sistema.</>} en={<>Downloads a Python into <code>~/.local/share/uv/python</code>, without touching the system one.</>} />],
            [<><code>uv cache dir</code> / <code>uv cache clean</code></>, <T pt={<>Mostra (<code>~/.cache/uv</code>) e limpa o cache de pacotes.</>} en={<>Shows (<code>~/.cache/uv</code>) and clears the package cache.</>} />],
          ]}
        />
        <p><T pt={<>Um achado que explica muita confusão: dentro do contêiner do uv, <code>python -c "import fastapi"</code> deu <code>ModuleNotFoundError</code>, enquanto <code>.venv/bin/python</code> e <code>uv run python</code> funcionaram. O <code>python</code> “solto” é o do sistema; os pacotes do projeto só existem no Python da <code>.venv</code>. Se o editor ou o terminal mostra “módulo não encontrado” para algo que você acabou de instalar, quase sempre é o interpretador errado.</>} en={<>A finding that explains a lot of confusion: inside the uv container, <code>python -c "import fastapi"</code> gave <code>ModuleNotFoundError</code>, while <code>.venv/bin/python</code> and <code>uv run python</code> worked. The “loose” <code>python</code> is the system one; the project's packages only exist in the <code>.venv</code>'s Python. If the editor or terminal shows “module not found” for something you just installed, it is almost always the wrong interpreter.</>} /></p>
        <h3><T pt="FastAPI: como funciona" en="FastAPI: how it works" /></h3>
        <p><T pt={<>O <a href="https://fastapi.tiangolo.com/" rel="noopener">FastAPI</a> é um framework web baseado em <strong>anotações de tipo</strong>: você declara uma função e o tipo dos parâmetros, e ele valida a entrada (via <a href="https://docs.pydantic.dev/" rel="noopener">pydantic</a>), converte e gera a documentação OpenAPI sozinho, em <code>/docs</code> (Swagger UI). Ele fala o protocolo <strong>ASGI</strong>, que precisa de um servidor: o uvicorn, que o extra <code>fastapi[standard]</code> instala. O comando <code>fastapi</code> (da CLI incluída) escolhe o servidor por você.</>} en={<><a href="https://fastapi.tiangolo.com/" rel="noopener">FastAPI</a> is a web framework based on <strong>type annotations</strong>: you declare a function and the parameter types, and it validates the input (via <a href="https://docs.pydantic.dev/" rel="noopener">pydantic</a>), converts it and generates the OpenAPI documentation by itself, at <code>/docs</code> (Swagger UI). It speaks the <strong>ASGI</strong> protocol, which needs a server: uvicorn, which the <code>fastapi[standard]</code> extra installs. The <code>fastapi</code> command (from the bundled CLI) picks the server for you.</>} /></p>
        <CodeBlock code={`from fastapi import FastAPI

from app.settings import settings

app = FastAPI(title="hello")


@app.get("/config")
def config():
    return {
        "env": settings.app_env,
        "greeting": settings.greeting,
        "dbPasswordSet": bool(settings.db_password),
    }


@app.get("/health")
def health():
    return {"status": "UP"}`} />
        <Callout tone="warn" icon="alert"><T pt={<><strong><code>fastapi dev</code> não é alcançável de fora do contêiner.</strong> Rodei os dois num contêiner com a porta publicada. O <code>fastapi dev</code> (recarrega ao salvar) escuta em <code>127.0.0.1</code> e a requisição do host ficou sem resposta; o <code>fastapi run</code> escuta em <code>0.0.0.0</code> e respondeu <code>&#123;"status":"UP"&#125;</code>. Use <code>dev</code> no seu computador e <code>run</code> em contêiner e produção.</>} en={<><strong><code>fastapi dev</code> is not reachable from outside the container.</strong> I ran both in a container with the port published. <code>fastapi dev</code> (reloads on save) listens on <code>127.0.0.1</code> and the request from the host got no answer; <code>fastapi run</code> listens on <code>0.0.0.0</code> and answered <code>&#123;"status":"UP"&#125;</code>. Use <code>dev</code> on your computer and <code>run</code> in a container and in production.</>} /></Callout>
        <h3><T pt="Variáveis de ambiente e o .env" en="Environment variables and the .env" /></h3>
        <p><T pt={<>O Python expõe as variáveis de ambiente em <code>os.environ</code>, mas <strong>não lê o <code>.env</code></strong>: com um <code>.env</code> contendo <code>GREETING</code>, <code>os.environ.get("GREETING")</code> devolveu <code>None</code>. A biblioteca <a href="https://docs.pydantic.dev/latest/concepts/pydantic_settings/" rel="noopener">pydantic-settings</a> resolve os dois problemas (ler o <code>.env</code> e converter os tipos) com uma classe:</>} en={<>Python exposes environment variables in <code>os.environ</code>, but <strong>does not read the <code>.env</code></strong>: with a <code>.env</code> containing <code>GREETING</code>, <code>os.environ.get("GREETING")</code> returned <code>None</code>. The <a href="https://docs.pydantic.dev/latest/concepts/pydantic_settings/" rel="noopener">pydantic-settings</a> library solves both problems (reading the <code>.env</code> and converting types) with a class:</>} /></p>
        <CodeBlock code={`from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # lê o .env (se existir) e as variáveis de ambiente; o ambiente vence o .env
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "dev"            # APP_ENV
    greeting: str = "olá do código"  # GREETING
    db_password: str = ""           # DB_PASSWORD


settings = Settings()`} />
        <Table
          head={[<T pt="Situação" en="Situation" />, "greeting", "db_password"]}
          rows={[
            [<T pt="nada definido" en="nothing set" />, <T pt="olá do código" en="olá do código" />, <T pt="vazio" en="empty" />],
            [<code>GREETING=ambiente</code>, "ambiente", <T pt="vazio" en="empty" />],
            [<T pt={<>só <code>.env</code> com <code>GREETING</code>, <code>DB_PASSWORD</code> e uma chave <code>OUTRA</code></>} en={<><code>.env</code> only, with <code>GREETING</code>, <code>DB_PASSWORD</code> and a key <code>OUTRA</code></>} />, "do-dotenv", "segredo"],
            [<><code>.env</code> <T pt="e" en="and" /> <code>GREETING=ambiente</code></>, "ambiente", "segredo"],
            [<><code>greeting=minusc</code> <T pt="(minúsculas no ambiente)" en="(lowercase in the environment)" /></>, "minusc", "segredo"],
          ]}
        />
        <ul className="ds-list">
          <li><T pt={<>O nome do campo (<code>db_password</code>) casa com a variável <code>DB_PASSWORD</code> <strong>sem diferenciar maiúsculas</strong> (o último caso da tabela). O ambiente vence o <code>.env</code>, e o <code>.env</code> vence o padrão da classe, a mesma escada do começo.</>} en={<>The field name (<code>db_password</code>) matches the <code>DB_PASSWORD</code> variable <strong>case-insensitively</strong> (the last row of the table). The environment beats the <code>.env</code>, and the <code>.env</code> beats the class default, the same ladder as in the beginning.</>} /></li>
          <li><T pt={<><code>env_file=".env"</code> é relativo a <em>onde você roda o comando</em>, não a onde está o arquivo Python. Rodar de outra pasta faz o <code>.env</code> “sumir” sem erro.</>} en={<><code>env_file=".env"</code> is relative to <em>where you run the command</em>, not to where the Python file is. Running from another folder makes the <code>.env</code> “vanish” with no error.</>} /></li>
          <li><T pt={<>Com <code>extra="ignore"</code> as chaves do <code>.env</code> que a classe não declara (como <code>OUTRA</code>) são ignoradas, em vez de dar erro.</>} en={<>With <code>extra="ignore"</code> the <code>.env</code> keys the class does not declare (like <code>OUTRA</code>) are ignored instead of raising an error.</>} /></li>
        </ul>
        <h3><T pt="Rodar e executar com Docker" en="Running and running with Docker" /></h3>
        <CodeBlock code={`# preparar o ambiente a partir do pyproject + uv.lock
uv sync --frozen

# dev (recarrega ao salvar; só acessível de 127.0.0.1)
uv run fastapi dev app/main.py

# produção (escuta em 0.0.0.0)
GREETING=oi uv run fastapi run app/main.py --port 8000`} />
        <CodeBlock code={`# ---- etapa 1: resolve e instala as dependências com uv ----
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS build
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY app ./app

# ---- etapa 2: só o Python, a .venv e o código ----
FROM python:3.12-slim-bookworm
WORKDIR /app
COPY --from=build /app/.venv /app/.venv
COPY --from=build /app/app /app/app
ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1
USER 10001
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s \\
  CMD ["python", "-c", "import urllib.request as u; u.urlopen('http://127.0.0.1:8000/health')"]
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]`} />
        <CodeBlock code={`docker build -t lang-py .
docker run --rm -p 8000:8000 \\
  -e GREETING="olá do contêiner" -e DB_PASSWORD=segredo \\
  lang-py
curl localhost:8000/config`} />
        <p><T pt={<>Medi: imagem de 305 MB; o contêiner ficou <code>healthy</code> pelo <code>HEALTHCHECK</code> (feito com o próprio Python, já que a imagem não tem <code>curl</code>); o processo roda como o usuário 10001; o <code>uv</code> não está na imagem final. Três pontos que quebram builds: (1) a <code>.venv</code> guarda caminhos absolutos, então ela precisa ficar no <strong>mesmo caminho</strong> (<code>/app/.venv</code>) nas duas etapas, e o Python das duas imagens tem de ser a mesma versão; (2) sem o <code>.dockerignore</code> listando <code>.venv</code>, a <code>.venv</code> do seu computador (de outro sistema) seria copiada para a imagem; (3) <code>--frozen</code> garante que o build use exatamente o <code>uv.lock</code>.</>} en={<>Measured: a 305 MB image; the container became <code>healthy</code> through the <code>HEALTHCHECK</code> (made with Python itself, since the image has no <code>curl</code>); the process runs as user 10001; <code>uv</code> is not in the final image. Three points that break builds: (1) the <code>.venv</code> stores absolute paths, so it must sit at the <strong>same path</strong> (<code>/app/.venv</code>) in both stages, and the Python in both images must be the same version; (2) without a <code>.dockerignore</code> listing <code>.venv</code>, your computer's <code>.venv</code> (from another system) would be copied into the image; (3) <code>--frozen</code> guarantees the build uses exactly <code>uv.lock</code>.</>} /></p>
      </Section>
      <Section id="ts" title={<T pt="TypeScript com Node" en="TypeScript with Node" />}>
        <h3><T pt="O que é cada peça" en="What each piece is" /></h3>
        <p><T pt={<>A confusão aqui é que “TypeScript” e “Node” são coisas diferentes. <strong>Node.js</strong> é o runtime que executa JavaScript fora do navegador. <strong>TypeScript</strong> é JavaScript com <em>tipos</em>, e os tipos <strong>não existem na execução</strong>: servem para conferir o código antes. <strong>npm</strong> é o gerenciador de pacotes que vem com o Node. Por muitos anos a regra era “compile o <code>.ts</code> para <code>.js</code> e rode o <code>.js</code>”, com o <code>tsc</code> (ou ferramentas como <code>ts-node</code> e <code>tsx</code>). Hoje o Node 24 também roda <code>.ts</code> direto, e isso muda o desenho:</>} en={<>The confusion here is that “TypeScript” and “Node” are different things. <strong>Node.js</strong> is the runtime that executes JavaScript outside the browser. <strong>TypeScript</strong> is JavaScript with <em>types</em>, and types <strong>do not exist at run time</strong>: they serve to check the code beforehand. <strong>npm</strong> is the package manager that comes with Node. For many years the rule was “compile the <code>.ts</code> to <code>.js</code> and run the <code>.js</code>”, with <code>tsc</code> (or tools like <code>ts-node</code> and <code>tsx</code>). Today Node 24 also runs <code>.ts</code> directly, and that changes the picture:</>} /></p>
        <Diagram minWidth={620} caption={<T pt="Rodar, conferir e compilar são tarefas diferentes. O Node roda .ts sem checar; quem checa é o tsc." en="Running, checking and compiling are different jobs. Node runs .ts without checking; tsc is what checks." />}>
          <svg viewBox="0 0 700 224" role="img" aria-label="Três formas de usar o TypeScript / Three ways to use TypeScript">
            <rect x="10" y="74" width="140" height="52" rx="4" className="brandfill" />
            <text x="80" y="96" className="mono" textAnchor="middle">src/*.ts</text>
            <text x="80" y="114" className="pt mut" textAnchor="middle">seu código</text>
            <text x="80" y="114" className="en mut" textAnchor="middle">your code</text>
            <rect x="230" y="16" width="460" height="52" rx="4" className="ln fillsoft" />
            <text x="460" y="37" className="mono" textAnchor="middle">node src/server.ts</text>
            <text x="460" y="55" className="pt mut" textAnchor="middle">remove os tipos e roda; não confere tipos</text>
            <text x="460" y="55" className="en mut" textAnchor="middle">strips types and runs; does not check types</text>
            <path d="M150 100L230 42" className="ln" />
            <path d="M226.7 48.2L230 42L223.1 43.2" className="ln" />
            <rect x="230" y="86" width="460" height="52" rx="4" className="ln fillsoft" />
            <text x="460" y="107" className="mono" textAnchor="middle">tsc --noEmit</text>
            <text x="460" y="125" className="pt mut" textAnchor="middle">só confere os tipos; não gera nada</text>
            <text x="460" y="125" className="en mut" textAnchor="middle">only checks types; emits nothing</text>
            <path d="M150 100L230 112" className="ln" />
            <path d="M223.3 114.1L230 112L224.2 108.1" className="ln" />
            <rect x="230" y="156" width="460" height="52" rx="4" className="ln fillsoft" />
            <text x="460" y="177" className="mono" textAnchor="middle">tsc → dist/*.js</text>
            <text x="460" y="195" className="pt mut" textAnchor="middle">confere e gera o JavaScript</text>
            <text x="460" y="195" className="en mut" textAnchor="middle">checks and emits the JavaScript</text>
            <path d="M150 100L230 182" className="ln" />
            <path d="M223.4 179.6L230 182L227.8 175.4" className="ln" />
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><strong>O Node roda <code>.ts</code> “apagando” os tipos, sem conferi-los.</strong> Testei um arquivo com <code>const x: number = "texto"</code>: o Node executou normalmente, com o erro de tipo. Quem acusa o erro é o <code>tsc --noEmit</code>. Por isso o projeto tem o script <code>typecheck</code>, que deve rodar no CI e no editor.</>} en={<><strong>Node runs <code>.ts</code> by “erasing” the types, without checking them.</strong> I tested a file with <code>const x: number = "texto"</code>: Node ran it normally, type error and all. What reports the error is <code>tsc --noEmit</code>. That is why the project has a <code>typecheck</code> script, which should run in CI and in the editor.</>} /></li>
          <li><T pt={<><strong>Só vale sintaxe “apagável”.</strong> Um <code>enum</code> precisa de código gerado, e o Node recusou com <code>ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX</code>. A opção <code>erasableSyntaxOnly</code> do <code>tsconfig.json</code> existe para o <code>tsc</code> avisar disso no editor, antes de rodar.</>} en={<><strong>Only “erasable” syntax is valid.</strong> An <code>enum</code> needs generated code, and Node refused with <code>ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX</code>. The <code>erasableSyntaxOnly</code> option in <code>tsconfig.json</code> exists so <code>tsc</code> warns you in the editor, before running.</>} /></li>
          <li><T pt={<><strong>Em produção ainda se compila.</strong> O <code>tsc</code> gera o <code>dist/*.js</code> e você roda <code>node dist/server.js</code>. É mais previsível e não depende do recurso de apagar tipos. A <a href="https://nodejs.org/api/typescript.html" rel="noopener">documentação do Node</a> descreve os limites do modo nativo.</>} en={<><strong>In production you still compile.</strong> <code>tsc</code> emits <code>dist/*.js</code> and you run <code>node dist/server.js</code>. It is more predictable and does not depend on the type-stripping feature. The <a href="https://nodejs.org/api/typescript.html" rel="noopener">Node documentation</a> describes the limits of the native mode.</>} /></li>
        </ul>
        <h3><T pt="npm: package.json, lock e node_modules" en="npm: package.json, lock and node_modules" /></h3>
        <CodeBlock code={`{
  "name": "hello",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "node --watch --env-file-if-exists=.env src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "typescript": "^7.0.2"
  }
}`} />
        <ul className="ds-list">
          <li><T pt={<><code>dependencies</code> vão para a produção (aqui, o <code>zod</code>). <code>devDependencies</code> são só para desenvolver e compilar (<code>typescript</code>, <code>@types/node</code>). No Docker final, <code>npm ci --omit=dev</code> deixa as segundas de fora.</>} en={<><code>dependencies</code> go to production (here, <code>zod</code>). <code>devDependencies</code> are only for developing and compiling (<code>typescript</code>, <code>@types/node</code>). In the final Docker image, <code>npm ci --omit=dev</code> leaves the second group out.</>} /></li>
          <li><T pt={<><code>"type": "module"</code> faz o Node tratar os <code>.js</code> como módulos ES (<code>import</code>). Sem isso, ele espera <code>require</code> (CommonJS). É um dos erros mais comuns: “Cannot use import statement outside a module”.</>} en={<><code>"type": "module"</code> makes Node treat <code>.js</code> files as ES modules (<code>import</code>). Without it, it expects <code>require</code> (CommonJS). It is one of the most common errors: “Cannot use import statement outside a module”.</>} /></li>
          <li><T pt={<><code>package-lock.json</code> fixa as versões exatas, como o <code>uv.lock</code>. <strong><code>npm install</code></strong> pode alterar o lock; <strong><code>npm ci</code></strong> apaga o <code>node_modules</code> e instala <em>exatamente</em> o lock, e falha se o lock e o <code>package.json</code> divergirem. Use <code>npm ci</code> no CI e no Docker.</>} en={<><code>package-lock.json</code> pins exact versions, like <code>uv.lock</code>. <strong><code>npm install</code></strong> may change the lock; <strong><code>npm ci</code></strong> deletes <code>node_modules</code> and installs <em>exactly</em> the lock, and fails if the lock and <code>package.json</code> disagree. Use <code>npm ci</code> in CI and Docker.</>} /></li>
          <li><T pt={<><code>npx &lt;ferramenta&gt;</code> roda um programa instalado no projeto (ou baixa um temporário). <code>npm run &lt;script&gt;</code> roda um item de <code>scripts</code>. A versão do Node pode ser fixada em <code>engines</code>; ferramentas como <code>nvm</code> e <code>fnm</code> trocam de versão por projeto.</>} en={<><code>npx &lt;tool&gt;</code> runs a program installed in the project (or downloads a temporary one). <code>npm run &lt;script&gt;</code> runs an item from <code>scripts</code>. The Node version can be pinned in <code>engines</code>; tools like <code>nvm</code> and <code>fnm</code> switch versions per project.</>} /></li>
        </ul>
        <h3><T pt="tsconfig.json: as opções que importam" en="tsconfig.json: the options that matter" /></h3>
        <CodeBlock code={`{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"]
}`} />
        <Table
          head={[<T pt="Opção" en="Option" />, <T pt="Para que serve" en="What it is for" />]}
          rows={[
            [<><code>module</code> / <code>moduleResolution: nodenext</code></>, <T pt={<>Segue as regras de módulos do Node moderno (ESM com extensão nos <code>import</code>).</>} en={<>Follows modern Node's module rules (ESM with extensions in <code>import</code>).</>} />],
            [<code>rewriteRelativeImportExtensions</code>, <T pt={<>Você escreve <code>import "./env.ts"</code> (que o Node roda direto) e o <code>tsc</code> reescreve para <code>"./env.js"</code> no <code>dist/</code>. Conferi no arquivo gerado.</>} en={<>You write <code>import "./env.ts"</code> (which Node runs directly) and <code>tsc</code> rewrites it to <code>"./env.js"</code> in <code>dist/</code>. I checked the generated file.</>} />],
            [<><code>erasableSyntaxOnly</code>, <code>verbatimModuleSyntax</code></>, <T pt="Mantêm o código dentro do que o Node consegue rodar apagando tipos." en="Keep the code within what Node can run by erasing types." />],
            [<code>strict</code>, <T pt="Liga as conferências mais úteis (null, tipos implícitos). Deixe ligado." en="Turns on the most useful checks (null, implicit types). Leave it on." />],
            [<><code>outDir</code> / <code>rootDir</code></>, <T pt={<>De onde o <code>tsc</code> lê (<code>src</code>) e onde grava (<code>dist</code>).</>} en={<>Where <code>tsc</code> reads from (<code>src</code>) and writes to (<code>dist</code>).</>} />],
            [<code>types: ["node"]</code>, <T pt={<>Carrega os tipos do <code>@types/node</code> (<code>process</code>, <code>node:http</code>). Sem eles, o <code>tsc</code> acusa que <code>process</code> não existe.</>} en={<>Loads the types from <code>@types/node</code> (<code>process</code>, <code>node:http</code>). Without them, <code>tsc</code> complains that <code>process</code> does not exist.</>} />],
          ]}
        />
        <p><T pt={<>Uma pegadinha do <code>tsc</code>: rodar <code>tsc arquivo.ts</code> <em>ignora</em> o <code>tsconfig.json</code>; a versão 7.0.2 que usei chega a recusar (<code>error TS5112</code>) sugerindo <code>--ignoreConfig</code>. Para usar a configuração do projeto, rode só <code>tsc</code>.</>} en={<>A <code>tsc</code> trap: running <code>tsc file.ts</code> <em>ignores</em> <code>tsconfig.json</code>; the 7.0.2 version I used even refuses (<code>error TS5112</code>) suggesting <code>--ignoreConfig</code>. To use the project's configuration, run just <code>tsc</code>.</>} /></p>
        <h3><T pt="Variáveis de ambiente e o .env" en="Environment variables and the .env" /></h3>
        <p><T pt={<>No Node as variáveis ficam em <code>process.env</code>, um objeto de <code>string | undefined</code>. Desde o Node 20.6 existe a opção <code><a href="https://nodejs.org/api/cli.html#--env-fileconfig" rel="noopener">--env-file</a></code>, que lê um arquivo <code>.env</code> sem biblioteca nenhuma (o antigo pacote <code>dotenv</code> deixou de ser necessário para o caso simples). Como tudo chega como texto, o <code>zod</code> valida e converte na partida:</>} en={<>In Node, variables live in <code>process.env</code>, an object of <code>string | undefined</code>. Since Node 20.6 there is the <code><a href="https://nodejs.org/api/cli.html#--env-fileconfig" rel="noopener">--env-file</a></code> option, which reads a <code>.env</code> file with no library at all (the old <code>dotenv</code> package is no longer needed for the simple case). Since everything arrives as text, <code>zod</code> validates and converts at startup:</>} /></p>
        <CodeBlock code={`import { z } from "zod";

// process.env é Record<string, string | undefined>: tudo chega como texto.
// O zod valida e converte uma vez, na partida; se faltar algo, o app nem sobe.
const Env = z.object({
  PORT: z.coerce.number().int().default(3000),
  GREETING: z.string().default("olá do código"),
  DB_PASSWORD: z.string().default(""),
});

export const env = Env.parse(process.env);`} />
        <Table
          head={[<T pt="Comando (medido)" en="Command (measured)" />, <T pt="Resultado" en="Result" />]}
          rows={[
            [<><code>PORT=7041 node src/server.ts</code> <T pt={<>com um <code>.env</code> ao lado</>} en={<>with a <code>.env</code> next to it</>} /></>, <T pt={<>o <code>.env</code> é <strong>ignorado</strong>: greeting = padrão do código</>} en={<>the <code>.env</code> is <strong>ignored</strong>: greeting = code default</>} />],
            [<code>node --env-file=.env src/server.ts</code>, <T pt={<>lê o <code>.env</code>: greeting = do-dotenv</>} en={<>reads the <code>.env</code>: greeting = do-dotenv</>} />],
            [<code>GREETING=ambiente node --env-file=.env …</code>, <T pt="o ambiente vence: greeting = ambiente" en="the environment wins: greeting = ambiente" />],
            [<><code>--env-file=.env</code> <T pt="sem o arquivo" en="without the file" /></>, <T pt={<>erro <code>node: .env: not found</code> e o processo termina</>} en={<>error <code>node: .env: not found</code> and the process exits</>} />],
            [<><code>--env-file-if-exists=.env</code> <T pt="sem o arquivo" en="without the file" /></>, <T pt={<>segue em frente com os padrões (é o que o <code>npm run dev</code> usa)</>} en={<>carries on with the defaults (it is what <code>npm run dev</code> uses)</>} />],
            [<code>PORT=abc node src/server.ts</code>, <T pt="o zod recusa e o app nem sobe" en="zod refuses and the app does not even start" />],
          ]}
        />
        <p><T pt={<>Repare no primeiro caso: ter um <code>.env</code> na pasta <strong>não basta</strong>, a opção precisa estar no comando. É o mesmo princípio de antes. Em produção e no Docker, prefira nem usar o arquivo e passar as variáveis por fora.</>} en={<>Notice the first case: having a <code>.env</code> in the folder is <strong>not enough</strong>, the option must be in the command. It is the same principle as before. In production and Docker, prefer not to use the file at all and pass the variables from outside.</>} /></p>
        <h3><T pt="Rodar e executar com Docker" en="Running and running with Docker" /></h3>
        <CodeBlock code={`# instalar exatamente o que o lock manda
npm ci

# dev: roda o .ts direto, recarrega ao salvar, lê o .env se existir
npm run dev

# conferir tipos / compilar / rodar o compilado
npm run typecheck
npm run build
GREETING=oi npm start`} />
        <CodeBlock code={`import { createServer } from "node:http";
import { env } from "./env.ts";

const server = createServer((req, res) => {
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
  };
  if (req.url === "/health") return send(200, { status: "UP" });
  if (req.url === "/config") {
    return send(200, { greeting: env.GREETING, dbPasswordSet: env.DB_PASSWORD !== "" });
  }
  send(404, { error: "not found" });
});

server.listen(env.PORT, "0.0.0.0", () => console.log(\`ouvindo em :\${env.PORT}\`));

// o Docker manda SIGTERM no "docker stop"; sem isso o Node espera 10 s e leva SIGKILL
process.on("SIGTERM", () => server.close(() => process.exit(0)));`} />
        <CodeBlock code={`# ---- etapa 1: instala tudo e compila o TypeScript ----
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- etapa 2: só as dependências de produção e o JS compilado ----
FROM node:24-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s \\
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "dist/server.js"]`} />
        <CodeBlock code={`docker build -t lang-ts .
docker run --rm -p 3000:3000 \\
  -e GREETING="olá do contêiner" -e DB_PASSWORD=segredo \\
  lang-ts
curl localhost:3000/config`} />
        <p><T pt={<>Medi: imagem de 343 MB, contêiner <code>healthy</code>, usuário <code>node</code> (não root), e o <code>docker stop</code> terminou em 0,33 s. Esse tempo curto é por causa da linha <code>process.on("SIGTERM", …)</code> do <code>server.ts</code>: o Docker avisa com SIGTERM e, sem tratador, o Node como PID 1 pode ignorar o sinal e levar um SIGKILL depois do prazo. Não testei a versão sem o tratador, então trate isso como boa prática e não como número medido. A etapa final só instala o que é de produção (<code>--omit=dev</code>): o <code>typescript</code> fica na etapa de build. O <code>npm run dev</code> em si eu <em>não</em> executei; testei os mesmos comandos <code>node</code> que ele chama.</>} en={<>Measured: a 343 MB image, <code>healthy</code> container, user <code>node</code> (not root), and <code>docker stop</code> finished in 0.33 s. That short time is thanks to the <code>process.on("SIGTERM", …)</code> line in <code>server.ts</code>: Docker signals with SIGTERM and, without a handler, Node as PID 1 may ignore the signal and take a SIGKILL after the grace period. I did not test the version without the handler, so treat that as good practice, not a measured number. The final stage installs only production packages (<code>--omit=dev</code>): <code>typescript</code> stays in the build stage. I did <em>not</em> run <code>npm run dev</code> itself; I tested the same <code>node</code> commands it calls.</>} /></p>
      </Section>
      <Section id="docker" title={<T pt="Docker: o mesmo desenho nas três" en="Docker: the same shape in all three" />}>
        <p><T pt={<>Como você previu, o Docker deixa as três pilhas parecidas: uma <strong>etapa de build</strong> com as ferramentas pesadas, uma <strong>etapa final</strong> só com o runtime e o artefato, e a configuração entrando <em>de fora</em>, na hora de rodar. O que muda é o que se copia entre as etapas: um jar, uma <code>.venv</code>, uma pasta <code>dist/</code> com <code>node_modules</code> de produção. Para fundamentos (imagem, camadas, redes, volumes), veja a <a href="/notas/docker/">nota de Docker</a>.</>} en={<>As you predicted, Docker makes the three stacks look alike: a <strong>build stage</strong> with the heavy tools, a <strong>final stage</strong> with only the runtime and the artifact, and the configuration coming in <em>from outside</em>, at run time. What changes is what gets copied between stages: a jar, a <code>.venv</code>, a <code>dist/</code> folder with production <code>node_modules</code>. For fundamentals (image, layers, networks, volumes), see the <a href="/notas/docker/">Docker note</a>.</>} /></p>
        <Diagram minWidth={620} caption={<T pt="A etapa de build tem as ferramentas pesadas. A etapa final leva só o artefato e o runtime, e recebe a configuração de fora, na hora de rodar." en="The build stage has the heavy tools. The final stage carries only the artifact and the runtime, and gets its configuration from outside, at run time." />}>
          <svg viewBox="0 0 700 224" role="img" aria-label="Build em duas etapas nas três pilhas / Two-stage build on the three stacks">
            <rect x="10" y="14" width="220" height="52" rx="4" className="ln fillsoft" />
            <text x="120" y="36" className="mono" textAnchor="middle">maven:3.9-eclipse-temurin-25</text>
            <text x="120" y="55" className="mono mut" textAnchor="middle">mvn package</text>
            <path d="M230 40L288 40" className="ln" />
            <path d="M281.7 43.0L288 40L281.7 37.0" className="ln" />
            <text x="259" y="32" className="mono mut" textAnchor="middle">app.jar</text>
            <rect x="290" y="14" width="230" height="52" rx="4" className="brandfill" />
            <text x="405" y="36" className="mono" textAnchor="middle">eclipse-temurin:25-jre</text>
            <text x="405" y="55" className="pt mut" textAnchor="middle">só o necessário para rodar</text>
            <text x="405" y="55" className="en mut" textAnchor="middle">only what is needed to run</text>
            <path d="M520 40L560 105" className="ln" />
            <path d="M554.1 101.2L560 105L559.3 98.0" className="ln" />
            <rect x="10" y="84" width="220" height="52" rx="4" className="ln fillsoft" />
            <text x="120" y="106" className="mono" textAnchor="middle">uv:python3.12-bookworm-slim</text>
            <text x="120" y="125" className="mono mut" textAnchor="middle">uv sync --no-dev</text>
            <path d="M230 110L288 110" className="ln" />
            <path d="M281.7 113.0L288 110L281.7 107.0" className="ln" />
            <text x="259" y="102" className="mono mut" textAnchor="middle">.venv</text>
            <rect x="290" y="84" width="230" height="52" rx="4" className="brandfill" />
            <text x="405" y="106" className="mono" textAnchor="middle">python:3.12-slim-bookworm</text>
            <text x="405" y="125" className="pt mut" textAnchor="middle">só o necessário para rodar</text>
            <text x="405" y="125" className="en mut" textAnchor="middle">only what is needed to run</text>
            <path d="M520 110L560 105" className="ln" />
            <path d="M554.1 108.8L560 105L553.4 102.8" className="ln" />
            <rect x="10" y="154" width="220" height="52" rx="4" className="ln fillsoft" />
            <text x="120" y="176" className="mono" textAnchor="middle">node:24-slim</text>
            <text x="120" y="195" className="mono mut" textAnchor="middle">npm ci + tsc</text>
            <path d="M230 180L288 180" className="ln" />
            <path d="M281.7 183.0L288 180L281.7 177.0" className="ln" />
            <text x="259" y="172" className="mono mut" textAnchor="middle">dist/</text>
            <rect x="290" y="154" width="230" height="52" rx="4" className="brandfill" />
            <text x="405" y="176" className="mono" textAnchor="middle">node:24-slim (final)</text>
            <text x="405" y="195" className="pt mut" textAnchor="middle">só o necessário para rodar</text>
            <text x="405" y="195" className="en mut" textAnchor="middle">only what is needed to run</text>
            <path d="M520 180L560 105" className="ln" />
            <path d="M559.7 112.0L560 105L554.3 109.1" className="ln" />
            <rect x="560" y="66" width="130" height="78" rx="4" className="ln" />
            <text x="625" y="88" className="mono" textAnchor="middle">docker run -e</text>
            <text x="625" y="104" className="mono" textAnchor="middle">--env-file</text>
            <text x="625" y="120" className="mono mut" textAnchor="middle">env_file:</text>
            <text x="625" y="136" className="pt mut" textAnchor="middle">a config entra aqui</text>
            <text x="625" y="136" className="en mut" textAnchor="middle">config comes in here</text>
          </svg>
        </Diagram>
        <Table
          head={[<T pt="Medido" en="Measured" />, "Java", "Python", "TypeScript"]}
          rows={[
            [<T pt="Tamanho da imagem final" en="Final image size" />, "517 MB", "305 MB", "343 MB"],
            [<T pt="Usuário do processo" en="Process user" />, "10001", "10001", <code>node</code>],
            [<T pt="Healthcheck" en="Healthcheck" />, <T pt={<>bash + <code>/dev/tcp</code> (sem curl)</>} en={<>bash + <code>/dev/tcp</code> (no curl)</>} />, <T pt={<>Python + <code>urllib</code></>} en={<>Python + <code>urllib</code></>} />, <T pt={<>Node + <code>fetch</code></>} en={<>Node + <code>fetch</code></>} />],
            [<T pt="Porta no Compose" en="Port in Compose" />, "8080", "8000", "3000"],
          ]}
        />
        <p><T pt={<>O Compose abaixo sobe as três de uma vez, cada uma com o <code>env_file</code> e a mesma checagem de saúde. Rodei com <code>docker compose up -d --build --wait</code>: os três serviços ficaram <code>healthy</code> e cada <code>/config</code> respondeu com o valor certo (a do Java, <code>"olá do compose"</code>, veio do <code>environment:</code> e saiu com o acento certo, porque variável de ambiente não passa pelo problema do Latin-1). Depois, <code>docker compose down -v</code>.</>} en={<>The Compose file below brings all three up at once, each with its <code>env_file</code> and the same health check. I ran it with <code>docker compose up -d --build --wait</code>: the three services became <code>healthy</code> and each <code>/config</code> answered with the right value (the Java one, <code>"olá do compose"</code>, came from <code>environment:</code> and came out with the right accent, because an environment variable does not go through the Latin-1 problem). Afterwards, <code>docker compose down -v</code>.</>} /></p>
        <CodeBlock code={`services:
  java:
    build: ./java
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: prod
      APP_GREETING: "olá do compose"
    env_file: [.env]
    healthcheck:
      # a imagem JRE não tem curl; o bash do Ubuntu abre a conexão sozinho
      test: ["CMD", "bash", "-c", "exec 3<>/dev/tcp/127.0.0.1/8080 && printf 'GET /actuator/health HTTP/1.0\\\\r\\\\n\\\\r\\\\n' >&3 && grep -q UP <&3"]
      interval: 10s
      start_period: 20s
  python:
    build: ./py
    ports: ["8000:8000"]
    env_file: [.env]
  node:
    build: ./ts
    ports: ["3000:3000"]
    env_file: [.env]`} />
        <h3><T pt="Armadilhas que valem nas três" en="Traps that hold in all three" /></h3>
        <ul className="ds-list">
          <li><T pt={<><strong>Escute em <code>0.0.0.0</code>, não em <code>localhost</code>.</strong> Dentro do contêiner, <code>127.0.0.1</code> é só o próprio contêiner. O <code>fastapi dev</code> falhou por isso; o Spring, o <code>fastapi run</code> e o <code>listen(…, "0.0.0.0")</code> do Node funcionaram.</>} en={<><strong>Listen on <code>0.0.0.0</code>, not <code>localhost</code>.</strong> Inside the container, <code>127.0.0.1</code> is only the container itself. <code>fastapi dev</code> failed because of that; Spring, <code>fastapi run</code> and Node's <code>listen(…, "0.0.0.0")</code> worked.</>} /></li>
          <li><T pt={<><strong><code>EXPOSE</code> não publica porta.</strong> Quem abre a porta para o seu computador é o <code>-p host:contêiner</code> (ou <code>ports:</code> no Compose). O <code>EXPOSE</code> é só documentação.</>} en={<><strong><code>EXPOSE</code> does not publish a port.</strong> What opens the port to your computer is <code>-p host:container</code> (or <code>ports:</code> in Compose). <code>EXPOSE</code> is only documentation.</>} /></li>
          <li><T pt={<><strong><code>docker run --env-file</code> não é um parser de shell.</strong> Com <code>GREETING="com aspas"</code> o valor chegou ao app <em>com as aspas</em> (<code>"com aspas"</code>), e <code>DB_PASSWORD=x # comentario</code> chegou como <code>x # comentario</code>. O <code>env_file</code> do Compose, ao contrário, tirou as aspas e o comentário (conferi com <code>docker compose config</code>). Escreva o <code>.env</code> sem aspas e sem comentário na mesma linha, e ele serve aos dois.</>} en={<><strong><code>docker run --env-file</code> is not a shell parser.</strong> With <code>GREETING="com aspas"</code> the value reached the app <em>with the quotes</em> (<code>"com aspas"</code>), and <code>DB_PASSWORD=x # comentario</code> arrived as <code>x # comentario</code>. Compose's <code>env_file</code>, by contrast, stripped the quotes and the comment (I checked with <code>docker compose config</code>). Write the <code>.env</code> with no quotes and no comment on the same line, and it works for both.</>} /></li>
          <li><T pt={<><strong><code>.dockerignore</code> evita três desastres:</strong> copiar o seu <code>.env</code> (segredos na imagem), copiar a <code>.venv</code> ou o <code>node_modules</code> do seu computador (outro sistema, outro caminho) e invalidar o cache de camadas a cada mudança.</>} en={<><strong><code>.dockerignore</code> avoids three disasters:</strong> copying your <code>.env</code> (secrets in the image), copying your computer's <code>.venv</code> or <code>node_modules</code> (another system, another path) and invalidating the layer cache on every change.</>} /></li>
          <li><T pt={<><strong>Copie o manifesto antes do código.</strong> Os três Dockerfiles copiam <code>pom.xml</code>, <code>pyproject.toml</code>/<code>uv.lock</code> ou <code>package*.json</code> primeiro e instalam as dependências; só então copiam o código. Mudar uma linha de código não refaz o download das bibliotecas.</>} en={<><strong>Copy the manifest before the code.</strong> The three Dockerfiles copy <code>pom.xml</code>, <code>pyproject.toml</code>/<code>uv.lock</code> or <code>package*.json</code> first and install the dependencies; only then do they copy the code. Changing one line of code does not redo the library download.</>} /></li>
          <li><T pt={<><strong>Rode como usuário comum</strong> (<code>USER 10001</code> ou <code>USER node</code>) e deixe segredos só nas variáveis em tempo de execução, nunca em <code>ENV</code> do Dockerfile nem em <code>ARG</code>, que ficam no histórico da imagem.</>} en={<><strong>Run as a regular user</strong> (<code>USER 10001</code> or <code>USER node</code>) and keep secrets only in run-time variables, never in a Dockerfile <code>ENV</code> or <code>ARG</code>, which stay in the image history.</>} /></li>
        </ul>
      </Section>
      <Section id="tracks" title={<T pt="Limpando os trilhos: o que fica na sua máquina" en="Cleaning the tracks: what stays on your machine" />}>
        <p><T pt={<>Cada ferramenta deixa coisas no seu computador, e a diferença entre “projeto que quebrou” e “projeto que só precisa recomeçar do zero” é saber onde elas ficam. A regra: <strong>tudo que nasce de um manifesto e de um lock é descartável</strong>. Apague sem medo e reconstrua. Os tamanhos abaixo são do meu computador e dos projetos do laboratório.</>} en={<>Each tool leaves things on your computer, and the difference between “a broken project” and “a project that only needs to start over” is knowing where they are. The rule: <strong>everything born from a manifest and a lock is disposable</strong>. Delete it without fear and rebuild. The sizes below are from my computer and the lab projects.</>} /></p>
        <Table
          head={[<T pt="O que" en="What" />, <T pt="Onde" en="Where" />, <T pt="Tamanho visto" en="Size seen" />, <T pt="Como limpar (e o que acontece)" en="How to clean (and what happens)" />]}
          rows={[
            [<T pt="Java: saída do build" en="Java: build output" />, <code>target/</code>, "22 MB", <><code>./mvnw clean</code> <T pt="(o próximo build recria)" en="(the next build recreates it)" /></>],
            [<T pt="Java: bibliotecas" en="Java: libraries" />, <code>~/.m2/repository</code>, "478 MB", <T pt="apagar a pasta; tudo é baixado de novo no próximo build" en="delete the folder; everything is downloaded again on the next build" />],
            [<T pt="Java: Maven do wrapper" en="Java: wrapper's Maven" />, <code>~/.m2/wrapper</code>, "—", <T pt={<>apagar; o <code>./mvnw</code> baixa a versão de novo</>} en={<>delete; <code>./mvnw</code> downloads the version again</>} />],
            [<T pt="Python: ambiente do projeto" en="Python: project environment" />, <code>.venv/</code>, "~70 MB", <><code>rm -rf .venv</code> <T pt="e" en="and" /> <code>uv sync</code></>],
            [<T pt="Python: cache do uv" en="Python: uv cache" />, <code>~/.cache/uv</code>, "—", <><code>uv cache clean</code> <T pt="(conferi: “Removed 204 files”)" en="(I checked: “Removed 204 files”)" /></>],
            [<T pt="Python: bytecode" en="Python: bytecode" />, <code>__pycache__/</code>, <T pt="pequeno" en="small" />, <T pt={<>apagar; o Python recria. Já vai no <code>.gitignore</code>.</>} en={<>delete; Python recreates it. Already in <code>.gitignore</code>.</>} />],
            [<T pt="Node: dependências" en="Node: dependencies" />, <code>node_modules/</code>, <>42 MB (<T pt="só 3 pacotes" en="just 3 packages" />)</>, <><code>rm -rf node_modules</code> <T pt="e" en="and" /> <code>npm ci</code></>],
            [<T pt="Node: compilado" en="Node: compiled output" />, <code>dist/</code>, <T pt="pequeno" en="small" />, <><code>rm -rf dist</code> <T pt="e" en="and" /> <code>npm run build</code></>],
            [<T pt="Node: cache global do npm" en="Node: global npm cache" />, <code>~/.npm</code>, <strong>4,8 GB</strong>, <code>npm cache clean --force</code>],
            ["Docker", <T pt="imagens, cache de build" en="images, build cache" />, <T pt="14 GB recuperáveis na minha máquina" en="14 GB reclaimable on my machine" />, <><code>docker system df</code> <T pt="para ver; remova as imagens do laboratório pelo nome" en="to see; remove the lab images by name" /></>],
          ]}
        />
        <p><T pt={<>O caso do <code>~/.npm</code> é típico: 4,8 GB de cache acumulado de todos os projetos que já passaram pela máquina, que nunca atrapalha e nunca é limpo. Dois cuidados: <code>rm -rf ~/.m2</code> apaga também o <code>settings.xml</code> (credenciais e espelhos do Maven), se existir, então apague só <code>repository</code>; e nunca apague a pasta de dados de um banco só porque estava no mesmo lugar de um cache.</>} en={<>The <code>~/.npm</code> case is typical: 4.8 GB of cache piled up from every project that ever went through the machine, which never hurts and is never cleaned. Two cautions: <code>rm -rf ~/.m2</code> also deletes <code>settings.xml</code> (Maven credentials and mirrors), if there is one, so delete only <code>repository</code>; and never delete a database's data folder just because it sat next to a cache.</>} /></p>
        <h3><T pt="Quando algo quebra: sintoma, causa, saída" en="When something breaks: symptom, cause, way out" /></h3>
        <Table
          head={[<T pt="Sintoma" en="Symptom" />, <T pt="Causa provável" en="Likely cause" />, <T pt="Saída" en="Way out" />]}
          rows={[
            [<code>javac: command not found</code>, <T pt="só o JRE instalado" en="only the JRE installed" />, <T pt={<>instalar o JDK; conferir <code>JAVA_HOME</code></>} en={<>install the JDK; check <code>JAVA_HOME</code></>} />],
            [<T pt={<>Variável do <code>.env</code> não surte efeito (Spring)</>} en={<>A <code>.env</code> variable has no effect (Spring)</>} />, <T pt="chave literal, sem conversão" en="literal key, no conversion" />, <><code>app.greeting=…</code> <T pt={<>no <code>.env</code> ou</>} en={<>in the <code>.env</code>, or</>} /> <code>$&#123;APP_GREETING:x&#125;</code></>],
            [<T pt="“olÃ¡” no lugar de “olá” (Spring)" en="“olÃ¡” instead of “olá” (Spring)" />, <T pt={<><code>.properties</code> lido como Latin-1</>} en={<><code>.properties</code> read as Latin-1</>} />, <T pt={<>escape <code>á</code>, ou valor vindo de variável de ambiente</>} en={<>the <code>á</code> escape, or a value coming from an environment variable</>} />],
            [<T pt="Porta 8080 já em uso" en="Port 8080 already in use" />, <T pt="outro processo ou um contêiner esquecido" en="another process or a forgotten container" />, <><code>ss -ltnp | grep 8080</code>; <code>docker ps</code>; <code>--server.port=…</code></>],
            [<code>externally-managed-environment</code>, <T pt="pip no Python do sistema (PEP 668)" en="pip on the system Python (PEP 668)" />, <T pt={<>usar <code>uv</code> (ou <code>python3 -m venv</code>)</>} en={<>use <code>uv</code> (or <code>python3 -m venv</code>)</>} />],
            [<code>ModuleNotFoundError</code>, <T pt={<>interpretador errado (não é o da <code>.venv</code>)</>} en={<>wrong interpreter (not the <code>.venv</code>'s)</>} />, <><code>uv run …</code> <T pt="ou" en="or" /> <code>.venv/bin/python</code></>],
            [<T pt="FastAPI no Docker sem resposta" en="FastAPI in Docker, no answer" />, <><code>fastapi dev</code> <T pt="escuta em 127.0.0.1" en="listens on 127.0.0.1" /></>, <code>fastapi run</code>],
            ["“Cannot use import statement outside a module”", <T pt={<>falta <code>"type": "module"</code></>} en={<>missing <code>"type": "module"</code></>} />, <T pt={<>acrescentar ao <code>package.json</code></>} en={<>add it to <code>package.json</code></>} />],
            [<T pt={<><code>.env</code> ignorado no Node</>} en={<><code>.env</code> ignored in Node</>} />, <T pt="faltou a opção" en="the option is missing" />, <code>--env-file=.env</code>],
            [<T pt="O código roda mas o editor mostra erro de tipo" en="The code runs but the editor shows a type error" />, <T pt="o Node não confere tipos" en="Node does not check types" />, <code>npm run typecheck</code>],
            [<T pt={<>Arquivos do projeto com dono <code>root</code></>} en={<>Project files owned by <code>root</code></>} />, <T pt="contêiner rodou como root com a pasta montada" en="container ran as root with the folder mounted" />, <code>docker run -u "$(id -u):$(id -g)" -e HOME=/tmp …</code>],
          ]}
        />
        <p><T pt={<>O último caso aconteceu comigo: o primeiro <code>mvn package</code> em contêiner deixou o <code>target/</code> com dono <code>root</code>. Repeti com <code>-u "$(id -u):$(id -g)"</code> e o dono voltou a ser o meu usuário.</>} en={<>The last case happened to me: the first <code>mvn package</code> in a container left <code>target/</code> owned by <code>root</code>. I repeated it with <code>-u "$(id -u):$(id -g)"</code> and the owner went back to being my user.</>} /></p>
      </Section>
      <Section id="cheat-lg" title={<T pt="Cola e revisão" en="Cheat sheet and review" />}>
        <h3><T pt="Cola" en="Cheat sheet" /></h3>
        <Table
          head={[<T pt="Tarefa" en="Task" />, "Java + Spring Boot", "Python + FastAPI", "TypeScript + Node"]}
          rows={[
            [<T pt="Ver a versão" en="Check version" />, <code>java -version</code>, <code>python3 --version</code>, <code>node -v</code>],
            [<T pt="Instalar dependências" en="Install dependencies" />, <code>./mvnw package</code>, <code>uv sync --frozen</code>, <code>npm ci</code>],
            [<T pt="Rodar em dev" en="Run in dev" />, <code>./mvnw spring-boot:run</code>, <code>uv run fastapi dev app/main.py</code>, <code>npm run dev</code>],
            [<T pt="Gerar o artefato" en="Build the artifact" />, <code>./mvnw package</code>, <T pt="(não precisa)" en="(not needed)" />, <code>npm run build</code>],
            [<T pt="Rodar “produção”" en="Run “production”" />, <code>java -jar target/*.jar</code>, <code>uv run fastapi run app/main.py</code>, <code>node dist/server.js</code>],
            [<T pt="Variável de ambiente" en="Environment variable" />, <><code>APP_DB_PASSWORD</code> → <code>app.db-password</code></>, <><code>DB_PASSWORD</code> → <code>db_password</code></>, <code>process.env.DB_PASSWORD</code>],
            [<T pt={<>Ler o <code>.env</code></>} en={<>Read the <code>.env</code></>} />, <code>spring.config.import=optional:file:.env[.properties]</code>, <><code>env_file=".env"</code> (pydantic-settings)</>, <code>--env-file-if-exists=.env</code>],
            [<T pt="Ambientes" en="Environments" />, <T pt={<>perfis: <code>SPRING_PROFILES_ACTIVE</code></>} en={<>profiles: <code>SPRING_PROFILES_ACTIVE</code></>} />, <T pt={<>um campo como <code>APP_ENV</code></>} en={<>a field like <code>APP_ENV</code></>} />, <code>NODE_ENV</code>],
            [<T pt="Limpar o projeto" en="Clean the project" />, <code>./mvnw clean</code>, <code>rm -rf .venv</code>, <code>rm -rf node_modules dist</code>],
            [<T pt="Documentação" en="Documentation" />, "docs.spring.io/spring-boot", "fastapi.tiangolo.com", "nodejs.org/docs"],
          ]}
        />
        <h3><T pt="Laboratório: reproduza em 15 minutos" en="Lab: reproduce in 15 minutes" /></h3>
        <ol className="ds-steps">
          <li><T pt={<>Crie as três pastas (<code>java/</code>, <code>py/</code>, <code>ts/</code>) com os arquivos desta nota e rode <code>./mvnw package</code>, <code>uv sync</code> e <code>npm ci</code>. Anote o que cada um criou (<code>target/</code>, <code>.venv/</code>, <code>node_modules/</code>).</>} en={<>Create the three folders (<code>java/</code>, <code>py/</code>, <code>ts/</code>) with the files in this note and run <code>./mvnw package</code>, <code>uv sync</code> and <code>npm ci</code>. Note what each one created (<code>target/</code>, <code>.venv/</code>, <code>node_modules/</code>).</>} /></li>
          <li><T pt={<>Em cada uma, preencha a tabela de precedência: rode sem nada, com variável de ambiente, com <code>.env</code>, com os dois. Confirme que o ambiente vence o <code>.env</code> e que a senha nunca aparece na resposta.</>} en={<>In each, fill in the precedence table: run with nothing, with an environment variable, with a <code>.env</code>, with both. Confirm that the environment beats the <code>.env</code> and that the password never shows up in the response.</>} /></li>
          <li><T pt={<>Reproduza as três armadilhas: o <code>.env</code> estilo shell no Spring, o <code>fastapi dev</code> dentro do Docker e o <code>node src/server.ts</code> sem <code>--env-file</code>.</>} en={<>Reproduce the three traps: the shell-style <code>.env</code> in Spring, <code>fastapi dev</code> inside Docker and <code>node src/server.ts</code> without <code>--env-file</code>.</>} /></li>
          <li><T pt={<>Suba os três com <code>docker compose up -d --build --wait</code>, confira os três <code>/config</code> e encerre com <code>docker compose down -v</code>.</>} en={<>Bring the three up with <code>docker compose up -d --build --wait</code>, check the three <code>/config</code> and finish with <code>docker compose down -v</code>.</>} /></li>
          <li><T pt={<>Limpe: apague <code>target/</code>, <code>.venv/</code>, <code>node_modules/</code>, <code>dist/</code> e remova as três imagens. Reconstrua um projeto do zero para provar que nada se perdeu.</>} en={<>Clean up: delete <code>target/</code>, <code>.venv/</code>, <code>node_modules/</code>, <code>dist/</code> and remove the three images. Rebuild one project from scratch to prove nothing was lost.</>} /></li>
        </ol>
        <Callout icon="check"><T pt={<><strong>O que foi e o que não foi executado.</strong> Executei: o build e a execução dos três apps (o jar com o JDK 25 do computador; o Python e o uv em contêiner; o Node no computador e em contêiner), todas as tabelas de precedência, o <code>mvn wrapper:wrapper</code>, o <code>./mvnw spring-boot:run</code> com perfil, as três imagens, o Compose com as três e as limpezas. <em>Não</em> executei: o <code>npm run dev</code> em si, o <code>uv python install</code>, a instalação do uv e do Maven pelo seu método oficial no computador, e o <code>application.yml</code> (só o <code>.properties</code>). Os números de tamanho são do meu computador e mudam com a versão das imagens-base.</>} en={<><strong>What was and was not run.</strong> I ran: the build and execution of the three apps (the jar with the computer's JDK 25; Python and uv in a container; Node on the computer and in a container), all the precedence tables, <code>mvn wrapper:wrapper</code>, <code>./mvnw spring-boot:run</code> with a profile, the three images, the Compose file with the three and the cleanups. I did <em>not</em> run: <code>npm run dev</code> itself, <code>uv python install</code>, installing uv and Maven through their official method on the computer, and <code>application.yml</code> (only <code>.properties</code>). The size numbers are from my computer and change with the base-image version.</>} /></Callout>
        <h3><T pt="Perguntas de revisão" en="Review questions" /></h3>
        <ul>
          <li><T pt={<>Por que nenhuma das três linguagens lê o <code>.env</code> sozinha? O que cada uma usa para lê-lo?</>} en={<>Why does none of the three languages read the <code>.env</code> by itself? What does each use to read it?</>} /></li>
          <li><T pt={<>Explique a escada de precedência. O que vence entre um argumento, uma variável de ambiente e um <code>.env</code>?</>} en={<>Explain the precedence ladder. What wins among an argument, an environment variable and a <code>.env</code>?</>} /></li>
          <li><T pt={<>O que faz o Maven quando você roda <code>mvn package</code>? Por que o <code>pom.xml</code> não tem versão nas dependências do Spring?</>} en={<>What does Maven do when you run <code>mvn package</code>? Why does the <code>pom.xml</code> have no version on the Spring dependencies?</>} /></li>
          <li><T pt={<>O que é um perfil do Spring? Se <code>application-prod.properties</code> e uma variável de ambiente definem a mesma chave, qual vence?</>} en={<>What is a Spring profile? If <code>application-prod.properties</code> and an environment variable define the same key, which wins?</>} /></li>
          <li><T pt={<>Por que <code>APP_GREETING=x</code> no <code>.env</code> não funciona no Spring, mas funciona como variável de ambiente?</>} en={<>Why does <code>APP_GREETING=x</code> in the <code>.env</code> not work in Spring, but work as an environment variable?</>} /></li>
          <li><T pt={<>Para que serve a <code>.venv</code>? Por que <code>pip install</code> global falha no Ubuntu 24.04, e o que o uv muda?</>} en={<>What is the <code>.venv</code> for? Why does a global <code>pip install</code> fail on Ubuntu 24.04, and what does uv change?</>} /></li>
          <li><T pt={<>Qual a diferença entre <code>fastapi dev</code> e <code>fastapi run</code>, e por que isso importa em Docker?</>} en={<>What is the difference between <code>fastapi dev</code> and <code>fastapi run</code>, and why does it matter in Docker?</>} /></li>
          <li><T pt={<>O Node roda <code>.ts</code> sem conferir tipos. Quem confere? O que o <code>erasableSyntaxOnly</code> evita?</>} en={<>Node runs <code>.ts</code> without checking types. What does check? What does <code>erasableSyntaxOnly</code> prevent?</>} /></li>
          <li><T pt={<>Qual a diferença entre <code>npm install</code> e <code>npm ci</code>? Qual vai no Dockerfile e por quê?</>} en={<>What is the difference between <code>npm install</code> and <code>npm ci</code>? Which goes in the Dockerfile and why?</>} /></li>
          <li><T pt="O que é descartável em cada pilha e como se recria? O que você nunca apagaria?" en="What is disposable in each stack and how do you recreate it? What would you never delete?" /></li>
        </ul>
      </Section>
      <Sources>
        <ul>
          <li><a href="https://docs.spring.io/spring-boot/reference/features/external-config.html" rel="noopener">Spring Boot: externalized configuration</a> · <a href="https://docs.spring.io/spring-boot/system-requirements.html" rel="noopener">System requirements</a> · <a href="https://docs.spring.io/spring-boot/maven-plugin/index.html" rel="noopener">Spring Boot Maven plugin</a> · <a href="https://start.spring.io/" rel="noopener">Spring Initializr</a></li>
          <li><a href="https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html" rel="noopener">Maven: build lifecycle</a> · <a href="https://maven.apache.org/tools/wrapper/" rel="noopener">Maven Wrapper</a></li>
          <li><a href="https://docs.astral.sh/uv/" rel="noopener">uv</a> · <a href="https://docs.astral.sh/uv/guides/integration/docker/" rel="noopener">uv: Docker</a> · <a href="https://peps.python.org/pep-0668/" rel="noopener">PEP 668</a> · <a href="https://packaging.python.org/en/latest/guides/writing-pyproject-toml/" rel="noopener">Writing pyproject.toml</a></li>
          <li><a href="https://fastapi.tiangolo.com/fastapi-cli/" rel="noopener">FastAPI CLI</a> · <a href="https://fastapi.tiangolo.com/deployment/docker/" rel="noopener">FastAPI in containers</a> · <a href="https://docs.pydantic.dev/latest/concepts/pydantic_settings/" rel="noopener">pydantic-settings</a></li>
          <li><a href="https://nodejs.org/api/cli.html#--env-fileconfig" rel="noopener">Node.js: --env-file</a> · <a href="https://nodejs.org/api/typescript.html" rel="noopener">Node.js: TypeScript</a> · <a href="https://www.typescriptlang.org/tsconfig/" rel="noopener">TSConfig reference</a> · <a href="https://docs.npmjs.com/cli/commands/npm-ci" rel="noopener">npm ci</a> · <a href="https://zod.dev/" rel="noopener">Zod</a></li>
          <li><a href="https://12factor.net/config" rel="noopener">The Twelve-Factor App: config</a> · <a href="https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/" rel="noopener">Docker Compose: environment variables</a> · <a href="https://docs.docker.com/build/building/multi-stage/" rel="noopener">Docker: multi-stage builds</a></li>
        </ul>
      </Sources>
    </>
  );
}
