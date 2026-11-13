import { Callout, CodeBlock, Diagram, Section, Sources, T, Table } from "../../components/note/index.ts";
import type { Note } from "../types.ts";

export const note: Note = {
  slug: "harvard-cs50",
  title: { en: "Harvard CS50: the course, who it is for and how to take it", pt: "Harvard CS50: o curso, para quem serve e como fazer" },
  seo: {
    title: { en: "Harvard CS50: who it is for, what it teaches and how to take it", pt: "Harvard CS50: para quem serve, o que ensina e como cursar" },
    description: { en: "Harvard's CS50x explained: who it is for, the week-by-week syllabus (C, Python, SQL, web), the weekly rhythm with check50 and submit50, free and paid certificates, the CS50 duck and AI rules, and whether it still makes sense in the AI era.", pt: "O CS50x de Harvard explicado: para quem serve, o conteúdo semana a semana (C, Python, SQL, web), o ritmo semanal com check50 e submit50, certificados gratuito e pago, o pato do CS50 e as regras de IA, e se ainda faz sentido na era da IA." },
  },
  summary: "Harvard's free CS50x intro to computer science: who it is for, the week-by-week syllabus (Scratch, C, Python, SQL, web), the weekly rhythm with check50 and submit50, how to take it and claim the free or paid certificate, the CS50 duck and AI policy, and whether it still makes sense in the AI era.",
  kicker: { en: "Learning", pt: "Estudo" },
  heroTitle: { en: <>Harvard CS50: <em>who it is for, what it teaches and how to take it.</em></>, pt: <>Harvard CS50: <em>para quem serve, o que ensina e como cursar.</em></> },
  heroLede: { en: "The free intro to computer science from Harvard: the 11-week syllabus, how the weeks work, how to take it and earn a certificate, what the CS50 duck is, and whether it still makes sense when an AI can write code.", pt: "A introdução gratuita de Harvard à ciência da computação: o conteúdo das 11 semanas, como as semanas funcionam, como cursar e obter o certificado, o que é o pato do CS50 e se ainda faz sentido quando uma IA escreve código." },
  published: "2026-10-26",
  updated: "2026-10-26",
  toc: [
    {
      items: [
        { id: "what", title: <T pt="O que é o CS50" en="What CS50 is" /> },
        { id: "who", title: <T pt="Para quem serve" en="Who it is for" /> },
        { id: "syllabus", title: <T pt="O que ele ensina, semana a semana" en="What it teaches, week by week" /> },
        { id: "how", title: <T pt="Como é: o ritmo de cada semana" en="What it is like: each week’s rhythm" /> },
        { id: "take", title: <T pt="Como cursar, passo a passo" en="How to take it, step by step" /> },
        { id: "ai", title: <T pt="E a IA? O pato de borracha e as regras" en="What about AI? The rubber duck and the rules" /> },
        { id: "sense", title: <T pt="Faz sentido na era da IA?" en="Does it make sense in the AI era?" /> },
      ],
    },
  ],
  Body,
};

function Body() {
  return (
    <>
      <Section id="what" title={<T pt="O que é o CS50" en="What CS50 is" />}>
        <p><T pt={<>O <b>CS50</b> é a disciplina de introdução à ciência da computação da Universidade de Harvard, dada pelo professor David J. Malan. A versão aberta para o mundo todo se chama <b>CS50x</b>: as aulas em vídeo, os exercícios e a correção automática são <b>gratuitos</b>. O site oficial a descreve como uma introdução ao uso de computação para resolver problemas, com e sem código, valorizando correção, design e estilo. Dois terços dos alunos nunca tinham feito uma disciplina de computação antes.</>} en={<><b>CS50</b> is Harvard University’s introductory computer science course, taught by professor David J. Malan. The version open to the whole world is called <b>CS50x</b>: the video lectures, the exercises and the automatic grading are <b>free</b>. The official site describes it as an introduction to using computation to solve problems, with and without code, valuing correctness, design and style. Two thirds of students had never taken a computing course before.</>} /></p>
        <p><T pt="Ele não ensina “uma linguagem”. Ele usa várias (Scratch, C, Python, SQL, HTML, CSS, JavaScript) como ferramenta para ensinar ideias que valem em qualquer lugar: abstração, algoritmos, estruturas de dados, memória, segurança e engenharia de software." en="It does not teach “a language”. It uses several (Scratch, C, Python, SQL, HTML, CSS, JavaScript) as tools to teach ideas that hold everywhere: abstraction, algorithms, data structures, memory, security and software engineering." /></p>
        <Callout tone="use" icon="check"><T pt={<><b>Curso gratuito, certificado opcional.</b> Estudar e entregar os exercícios para correção não custa nada. O que pode ter custo é o certificado verificado da edX; existe também um certificado gratuito emitido pelo próprio CS50 (detalhes na seção “Como cursar”).</>} en={<><b>Free course, optional certificate.</b> Studying and submitting the exercises for grading costs nothing. What may cost money is the edX verified certificate; there is also a free certificate issued by CS50 itself (details in the “How to take it” section).</>} /></Callout>
      </Section>
      <Section id="who" title={<T pt="Para quem serve" en="Who it is for" />}>
        <Table
          head={[<T pt="Seu perfil" en="Your profile" />, <T pt="O CS50x serve?" en="Is CS50x right?" />]}
          rows={[
            [<T pt="Nunca programou e quer entender computação de verdade" en="Never programmed and wants to really understand computing" />, <T pt={<><b>É o público central.</b> Não há pré-requisito formal. Prepare-se para um ritmo exigente nas semanas de C.</>} en={<><b>It is the core audience.</b> There is no formal prerequisite. Be ready for a demanding pace in the C weeks.</>} />],
            [<T pt="Estudante de tecnologia que quer base sólida" en="Tech student who wants a solid base" />, <T pt="Sim: memória, ponteiros, estruturas de dados e SQL costumam ser as lacunas de quem aprendeu só “o framework”." en="Yes: memory, pointers, data structures and SQL are usually the gaps of people who only learned “the framework”." />],
            [<T pt="Já desenvolve (trabalha com web, scripts)" en="Already develops (works with web, scripts)" />, <T pt="Talvez em parte. A orientação do próprio CS50 é que quem tem alguma experiência técnica pode pular o CS50x e ir direto a um curso específico (Python, Web, IA, SQL, Cibersegurança). Se nunca viu C e gerência de memória, as semanas 1 a 5 ainda valem." en="Maybe partly. CS50’s own guidance is that people with some technical experience can skip CS50x and go straight to a specific course (Python, Web, AI, SQL, Cybersecurity). If you never saw C and memory management, weeks 1 to 5 are still worth it." />],
            [<T pt="Quer só “aprender a fazer um site rápido”" en="Just wants to “learn to build a quick website”" />, <T pt="Provavelmente não é o caminho mais curto. O CS50W (web com Python e JavaScript) é mais direto. O CS50x é investimento em base." en="Probably not the shortest path. CS50W (web with Python and JavaScript) is more direct. CS50x is an investment in foundations." />],
            [<T pt="Profissional de outra área (negócios, direito)" en="Professional from another field (business, law)" />, <T pt="Existem versões próprias, CS50 for Business e CS50 for Lawyers, com menos código." en="There are dedicated versions, CS50 for Business and CS50 for Lawyers, with less code." />],
          ]}
        />
      </Section>
      <Section id="syllabus" title={<T pt="O que ele ensina, semana a semana" en="What it teaches, week by week" />}>
        <p><T pt="A estrutura abaixo é a do site oficial do CS50x. A coluna da direita é minha tradução do tema para o dia a dia de quem programa." en="The structure below is the one on the official CS50x site. The right-hand column is my translation of each topic into day-to-day programming." /></p>
        <Table
          head={[<T pt="Semana" en="Week" />, <T pt="Tema" en="Topic" />, <T pt="Para que serve depois" en="What it is for later" />]}
          rows={[
            ["0", "Scratch", <T pt="Pensar em passos, laços e condições antes da sintaxe." en="Thinking in steps, loops and conditions before syntax." />],
            ["1", "C", <T pt="Ver o que uma linguagem faz “de verdade”: compilar, tipos, laços." en="Seeing what a language really does: compiling, types, loops." />],
            ["2", <T pt="Arrays (vetores)" en="Arrays" />, <T pt="Texto como sequência de bytes; base de criptografia simples e de toda manipulação de dados." en="Text as a sequence of bytes; the base of simple cryptography and of all data handling." />],
            ["3", <T pt="Algoritmos" en="Algorithms" />, <T pt={<>Busca, ordenação e custo (Big O). Veja também <a href="/notas/entendendo-algoritmos/">Entendendo Algoritmos</a>.</>} en={<>Search, sorting and cost (Big O). See also <a href="/notas/entendendo-algoritmos/">Grokking Algorithms</a>.</>} />],
            ["4", <T pt="Memória" en="Memory" />, <T pt="Ponteiros, pilha e heap. É a base para entender vazamentos de memória e por que existem falhas de segurança como o buffer overflow." en="Pointers, stack and heap. The base for understanding memory leaks and why security flaws such as buffer overflow exist." />],
            ["5", <T pt="Estruturas de dados" en="Data structures" />, <T pt={<>Listas ligadas, tabelas hash, árvores, filas, pilhas: o que há dentro de <code>dict</code>, <code>Map</code> e dos índices de banco.</>} en={<>Linked lists, hash tables, trees, queues, stacks: what is inside <code>dict</code>, <code>Map</code> and database indexes.</>} />],
            ["6", "Python", <T pt="Mesma lógica em uma linguagem de alto nível: você percebe quanto trabalho ela esconde." en="The same logic in a high-level language: you notice how much work it hides." />],
            ["7", "SQL", <T pt={<>Consultar e modelar dados. Continue em <a href="/notas/postgres-for-devs/">Postgres para desenvolvedores</a>.</>} en={<>Querying and modelling data. Continue in <a href="/notas/postgres-for-devs/">Postgres for developers</a>.</>} />],
            ["—", <T pt="Inteligência Artificial (módulo)" en="Artificial Intelligence (module)" />, <T pt={<>Uma visão do que está por trás dos sistemas de IA atuais. Veja <a href="/notas/attention-is-all-you-need/">Attention Is All You Need</a>.</>} en={<>A look at what is behind today’s AI systems. See <a href="/notas/attention-is-all-you-need/">Attention Is All You Need</a>.</>} />],
            ["8", "HTML, CSS, JavaScript", <T pt="O que o navegador entende; a base do front-end." en="What the browser understands; the base of the front end." />],
            ["9", "Flask", <T pt="Um servidor web em Python, ligando dados e páginas." en="A web server in Python, tying data to pages." />],
            ["10", <T pt="O fim + projeto final" en="The end + final project" />, <T pt="Um software seu, resolvendo um problema real." en="Software of your own, solving a real problem." />],
          ]}
        />
        <h3><T pt="Um gostinho: “olá, mundo” em C e em Python" en="A taste: “hello, world” in C and in Python" /></h3>
        <p><T pt={<>O curso começa a programar de verdade pelo C. A mesma ideia nas duas linguagens mostra o que o Python faz por você. O exemplo de C é o clássico da semana 1 (usa a biblioteca <code>cs50.h</code> do curso, que já vem no ambiente dele). Não o executei aqui.</>} en={<>The course starts real programming with C. The same idea in both languages shows what Python does for you. The C example is the classic from week 1 (it uses the course’s <code>cs50.h</code> library, already present in its environment). I did not run it here.</>} /></p>
        <CodeBlock code={`// hello.c
#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string name = get_string("What's your name? ");
    printf("hello, %s\\n", name);
}

// no terminal:   make hello   e depois   ./hello`} />
        <CodeBlock code={`# hello.py
name = input("What's your name? ")
print(f"hello, {name}")

# no terminal:   python hello.py`} />
        <p><T pt="Em C você declara o tipo, inclui bibliotecas, compila e sabe que o texto é uma sequência de caracteres na memória. Em Python tudo isso é invisível. O curso faz você passar pelo difícil primeiro para que o fácil, depois, não seja mágica." en="In C you declare the type, include libraries, compile, and know the text is a sequence of characters in memory. In Python all of that is invisible. The course makes you go through the hard part first so that the easy part, later, is not magic." /></p>
      </Section>
      <Section id="how" title={<T pt="Como é: o ritmo de cada semana" en="What it is like: each week’s rhythm" />}>
        <Diagram minWidth={600} caption={<T pt="O ciclo de uma semana: assistir, praticar, testar, entregar." en="One week’s cycle: watch, practise, test, submit." />}>
          <svg viewBox="0 0 700 214" role="img" aria-label="Ciclo semanal do CS50 / CS50 weekly cycle">
            <rect x="10" y="30" width="108" height="56" rx="4" className="ln fillsoft" />
            <text x="64" y="54" className="pt" textAnchor="middle">aula</text>
            <text x="64" y="54" className="en" textAnchor="middle">lecture</text>
            <text x="64" y="72" className="pt mut" textAnchor="middle">em vídeo</text>
            <text x="64" y="72" className="en mut" textAnchor="middle">on video</text>
            <path d="M118 58L146 58" className="ln" />
            <path d="M138.8 61.5L146 58L138.8 54.5" className="ln" />
            <rect x="146" y="30" width="108" height="56" rx="4" className="ln fillsoft dash" />
            <text x="200" y="54" className="pt" textAnchor="middle">seção · shorts</text>
            <text x="200" y="54" className="en" textAnchor="middle">section · shorts</text>
            <text x="200" y="72" className="pt mut" textAnchor="middle">opcional</text>
            <text x="200" y="72" className="en mut" textAnchor="middle">optional</text>
            <path d="M254 58L282 58" className="ln" />
            <path d="M274.8 61.5L282 58L274.8 54.5" className="ln" />
            <rect x="282" y="30" width="108" height="56" rx="4" className="ln brandfill" />
            <text x="336" y="54" className="pt" textAnchor="middle">problem set</text>
            <text x="336" y="54" className="en" textAnchor="middle">problem set</text>
            <text x="336" y="72" className="pt mut" textAnchor="middle">10 a 20 h</text>
            <text x="336" y="72" className="en mut" textAnchor="middle">10 to 20 h</text>
            <path d="M390 58L418 58" className="ln" />
            <path d="M410.8 61.5L418 58L410.8 54.5" className="ln" />
            <rect x="418" y="30" width="108" height="56" rx="4" className="ln fillsoft" />
            <text x="472" y="54" className="mono" textAnchor="middle">check50</text>
            <text x="472" y="72" className="pt mut" textAnchor="middle">testa antes</text>
            <text x="472" y="72" className="en mut" textAnchor="middle">tests first</text>
            <path d="M526 58L554 58" className="ln" />
            <path d="M546.8 61.5L554 58L546.8 54.5" className="ln" />
            <rect x="554" y="30" width="136" height="56" rx="4" className="ln fillsoft" />
            <text x="622" y="54" className="mono" textAnchor="middle">submit50</text>
            <text x="622" y="72" className="pt mut" textAnchor="middle">entrega e nota</text>
            <text x="622" y="72" className="en mut" textAnchor="middle">hand in and grade</text>
            <path d="M472 86L472 124L336 124L336 92" className="ln dash" />
            <path d="M332.5 99.2L336 92L339.5 99.2" className="ln" />
            <text x="404" y="118" className="pt mut" textAnchor="middle">falhou? corrija e rode de novo</text>
            <text x="404" y="118" className="en mut" textAnchor="middle">failed? fix it and run again</text>
            <text x="10" y="164" className="pt mut" textAnchor="start">Cada semana conta só quando todos os problemas obrigatórios dela atingem a nota mínima (70%).</text>
            <text x="10" y="164" className="en mut" textAnchor="start">Each week counts only when all of its required problems reach the minimum score (70%).</text>
            <text x="10" y="186" className="pt mut" textAnchor="start">Reenviar é permitido; vale a última entrega. No seu ritmo, sem prazo por exercício.</text>
            <text x="10" y="186" className="en mut" textAnchor="start">Resubmitting is allowed; the latest counts. Self-paced, with no per-exercise deadline.</text>
          </svg>
        </Diagram>
        <ul className="ds-list">
          <li><T pt={<><em>Aulas.</em> Vídeos longos e bem produzidos, com demonstrações ao vivo. As aulas foram dubladas para português e espanhol (via lingopal.ai), e existe uma versão do site em português em <code>cs50.ly/pt</code>.</>} en={<><em>Lectures.</em> Long, well-produced videos with live demonstrations. The lectures were dubbed into Portuguese and Spanish (via lingopal.ai), and there is a Portuguese version of the site at <code>cs50.ly/pt</code>.</>} /></li>
          <li><T pt={<><em>Problem sets.</em> É onde o aprendizado acontece. São programas de verdade, corrigidos por <code>check50</code> (correção) e <code>style50</code> (estilo). A nota semanal é 75% correção e 25% estilo. Não há prova; o requisito final é o projeto.</>} en={<><em>Problem sets.</em> This is where learning happens. They are real programs, graded by <code>check50</code> (correctness) and <code>style50</code> (style). The weekly score is 75% correctness and 25% style. There is no exam; the final requirement is the project.</>} /></li>
          <li><T pt={<><em>Ambiente.</em> O curso recomenda o Visual Studio Code do CS50 (<code>cs50.dev</code>), que roda no navegador com tudo já instalado, então você não precisa configurar compilador nenhum para começar.</>} en={<><em>Environment.</em> The course recommends CS50’s Visual Studio Code (<code>cs50.dev</code>), which runs in the browser with everything preinstalled, so you do not need to set up a compiler to start.</>} /></li>
          <li><T pt={<><em>Projeto final.</em> Você constrói um software seu, em qualquer linguagem, que resolva um problema real. Pode ser em grupo de até três pessoas (com escopo proporcional). O próprio enunciado sugere criar “algo que sobreviva ao curso”.</>} en={<><em>Final project.</em> You build software of your own, in any language, that solves a real problem. It can be in a group of up to three (with proportional scope). The brief itself encourages you to create “something that outlives this course”.</>} /></li>
          <li><T pt={<><em>Dificuldade.</em> A curva é íngreme nas semanas 1 a 5 (C, memória, estruturas de dados). É normal travar. O curso foi desenhado para isso: recomenda-se estimar de 10 a 20 horas por semana só nos problem sets.</>} en={<><em>Difficulty.</em> The curve is steep in weeks 1 to 5 (C, memory, data structures). Getting stuck is normal. The course is designed for it: it suggests estimating 10 to 20 hours per week on problem sets alone.</>} /></li>
        </ul>
      </Section>
      <Section id="take" title={<T pt="Como cursar, passo a passo" en="How to take it, step by step" />}>
        <ol className="ds-steps">
          <li><T pt={<><b>Crie as contas.</b> Uma conta no GitHub (o certificado gratuito é resgatado com o login do GitHub) e uma conta na edX (o CS50 diz que o registro na edX é necessário para os dois tipos de certificado).</>} en={<><b>Create the accounts.</b> A GitHub account (the free certificate is claimed with the GitHub login) and an edX account (CS50 says edX registration is required for both certificate types).</>} /></li>
          <li><T pt={<><b>Entre no site do curso</b> (<code>cs50.harvard.edu/x</code>), comece pela semana 0 e assista à aula. Se preferir em português, use a versão em <code>cs50.ly/pt</code>.</>} en={<><b>Open the course site</b> (<code>cs50.harvard.edu/x</code>), start at week 0 and watch the lecture. For Portuguese, use the version at <code>cs50.ly/pt</code>.</>} /></li>
          <li><T pt={<><b>Abra o ambiente</b> (<code>cs50.dev</code>) e faça o problem set da semana, seguindo o enunciado.</>} en={<><b>Open the environment</b> (<code>cs50.dev</code>) and do the week’s problem set, following the brief.</>} /></li>
          <li><T pt={<><b>Teste e entregue.</b> Rode <code>check50</code> com o identificador do problema (está no enunciado) até passar, depois <code>submit50</code> com o mesmo identificador. Os envios aparecem no seu Gradebook na hora.</>} en={<><b>Test and submit.</b> Run <code>check50</code> with the problem’s identifier (it is in the brief) until it passes, then <code>submit50</code> with the same identifier. Submissions show up in your Gradebook right away.</>} /></li>
          <li><T pt={<><b>Repita até a semana 10</b> e entregue o projeto final.</>} en={<><b>Repeat through week 10</b> and submit the final project.</>} /></li>
          <li><T pt={<><b>Resgate o certificado</b>, se quiser (veja abaixo).</>} en={<><b>Claim the certificate</b>, if you want one (see below).</>} /></li>
        </ol>
        <h3><T pt="Quanto tempo reservar (conta minha)" en="How much time to set aside (my arithmetic)" /></h3>
        <p><T pt="São 11 unidades (semanas 0 a 10) e o curso sugere 10 a 20 horas por semana de conteúdo só nos problem sets. Multiplicando, são algo entre 110 e 220 horas, fora o tempo de assistir às aulas. Com isso:" en="There are 11 units (weeks 0 to 10) and the course suggests 10 to 20 hours per unit on problem sets alone. Multiplying, that is somewhere between 110 and 220 hours, not counting time spent watching lectures. With that:" /></p>
        <Table
          head={[<T pt="Se você estuda" en="If you study" />, <T pt="Termina em cerca de" en="You finish in about" />]}
          rows={[
            [<T pt="5 h por semana" en="5 h per week" />, <T pt="22 a 44 semanas" en="22 to 44 weeks" />],
            [<T pt="10 h por semana" en="10 h per week" />, <T pt="11 a 22 semanas" en="11 to 22 weeks" />],
            [<T pt="20 h por semana" en="20 h per week" />, <T pt="6 a 11 semanas" en="6 to 11 weeks" />],
          ]}
        />
        <Callout tone="warn" icon="alert"><T pt={<><b>Existe um prazo geral.</b> Segundo o FAQ, o prazo atual do curso é o fim do dia 30 de junho de 2027 (UTC); ele pode ser estendido em seis ou doze meses, e parte do trabalho pode ser transferida. Trabalho enviado antes de 1º de janeiro de 2026 não é transferido. De 26 de outubro de 2026 a essa data são cerca de 35 semanas: quem estuda 5 h por semana está no limite. Confira o FAQ para o prazo vigente.</>} en={<><b>There is an overall deadline.</b> According to the FAQ, the course’s current deadline is the end of June 30, 2027 (UTC); it may be extended by six or twelve months, and some work may carry forward. Work submitted before January 1, 2026 does not carry forward. From October 26, 2026 to that date is about 35 weeks: at 5 h per week you are at the limit. Check the FAQ for the current deadline.</>} /></Callout>
        <h3><T pt="Certificado: gratuito ou pago" en="Certificate: free or paid" /></h3>
        <div className="scroll-x">
          <table className="ds-table">
            <thead>
              <tr>
                <th></th>
                <th><T pt="Certificado do CS50" en="CS50 Certificate" /></th>
                <th><T pt="Certificado verificado da edX" en="edX verified certificate" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><T pt="Custo" en="Cost" /></td>
                <td><T pt="gratuito" en="free" /></td>
                <td><T pt="pago (o preço fica na edX; há ajuda financeira para quem não pode pagar)" en="paid (the price is set on edX; financial aid exists for those who cannot pay)" /></td>
              </tr>
              <tr>
                <td><T pt="Como sai" en="How you get it" /></td>
                <td><T pt="emitido pelo CS50; resgatado no Gradebook com o login do GitHub" en="issued by CS50; claimed in the Gradebook with the GitHub login" /></td>
                <td><T pt="comprado na edX; gerado em até 30 dias depois de cumpridos os requisitos, com verificação de identidade" en="purchased on edX; generated within 30 days after the requirements are met, with identity verification" /></td>
              </tr>
              <tr>
                <td><T pt="Requisito" en="Requirement" /></td>
                <td colSpan={2}><T pt="Nota mínima de 70% em cada problema obrigatório e o projeto final. Sem prova." en="At least 70% on every required problem and the final project. No exam." /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><T pt={<>O próprio CS50 avisa que o certificado verificado <b>não</b> é crédito acadêmico de Harvard (créditos e transferência vêm pela Harvard Extension School ou Summer School). Para o mercado, o que pesa é o que você construiu: o projeto final e os repositórios dizem mais que o PDF.</>} en={<>CS50 itself notes that the verified certificate is <b>not</b> Harvard academic credit (credit and transfer come through Harvard Extension School or Summer School). For the job market, what weighs most is what you built: the final project and repositories say more than the PDF.</>} /></p>
        <h3><T pt="Depois do CS50x: a família de cursos" en="After CS50x: the family of courses" /></h3>
        <Diagram minWidth={600} caption={<T pt="O CS50x é a porta de entrada; quem já programa pode ir direto a um curso específico." en="CS50x is the front door; people who already program can go straight to a specific course." />}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Caminhos depois do CS50x / Paths after CS50x">
            <rect x="10" y="84" width="130" height="52" rx="4" className="ln brandfill" />
            <text x="75" y="106" className="mono" textAnchor="middle">CS50x</text>
            <text x="75" y="124" className="pt mut" textAnchor="middle">a base</text>
            <text x="75" y="124" className="en mut" textAnchor="middle">the base</text>
            <path d="M140 110L200 110" className="ln" />
            <path d="M200 24L200 196" className="ln" />
            <path d="M200 24L240 24" className="ln" />
            <path d="M232.8 27.5L240 24L232.8 20.5" className="ln" />
            <path d="M200 66L240 66" className="ln" />
            <path d="M232.8 69.5L240 66L232.8 62.5" className="ln" />
            <path d="M200 108L240 108" className="ln" />
            <path d="M232.8 111.5L240 108L232.8 104.5" className="ln" />
            <path d="M200 150L240 150" className="ln" />
            <path d="M232.8 153.5L240 150L232.8 146.5" className="ln" />
            <path d="M200 192L240 192" className="ln" />
            <path d="M232.8 195.5L240 192L232.8 188.5" className="ln" />
            <rect x="240" y="8" width="230" height="32" rx="4" className="ln fillsoft" />
            <text x="255" y="29" className="mono" textAnchor="start">CS50P</text>
            <text x="320" y="29" className="mut" textAnchor="start">Python</text>
            <rect x="240" y="50" width="230" height="32" rx="4" className="ln fillsoft" />
            <text x="255" y="71" className="mono" textAnchor="start">CS50W</text>
            <text x="320" y="71" className="pt mut" textAnchor="start">web: Python e JavaScript</text>
            <text x="320" y="71" className="en mut" textAnchor="start">web: Python and JavaScript</text>
            <rect x="240" y="92" width="230" height="32" rx="4" className="ln fillsoft" />
            <text x="255" y="113" className="mono" textAnchor="start">CS50 AI</text>
            <text x="320" y="113" className="pt mut" textAnchor="start">IA com Python</text>
            <text x="320" y="113" className="en mut" textAnchor="start">AI with Python</text>
            <rect x="240" y="134" width="230" height="32" rx="4" className="ln fillsoft" />
            <text x="255" y="155" className="mono" textAnchor="start">CS50 SQL</text>
            <text x="330" y="155" className="pt mut" textAnchor="start">bancos de dados</text>
            <text x="330" y="155" className="en mut" textAnchor="start">databases</text>
            <rect x="240" y="176" width="230" height="32" rx="4" className="ln fillsoft" />
            <text x="255" y="197" className="mono" textAnchor="start">CS50 Cybersecurity</text>
            <text x="490" y="30" className="pt mut" textAnchor="start">também: Scratch, R,</text>
            <text x="490" y="30" className="en mut" textAnchor="start">also: Scratch, R,</text>
            <text x="490" y="48" className="pt mut" textAnchor="start">React Native, Business,</text>
            <text x="490" y="48" className="en mut" textAnchor="start">React Native, Business,</text>
            <text x="490" y="66" className="pt mut" textAnchor="start">Lawyers, AP CSP</text>
            <text x="490" y="66" className="en mut" textAnchor="start">Lawyers, AP CSP</text>
          </svg>
        </Diagram>
        <p><T pt={<>A edX também vende “Professional Certificates” que juntam o CS50x a um curso específico (IA, Python, Web, Ciência de Dados, Cibersegurança ou Bancos de Dados com SQL), com 10% de desconto. A lista oficial muda; confira em <code>cs50.harvard.edu/courses</code>.</>} en={<>edX also sells “Professional Certificates” that bundle CS50x with one specific course (AI, Python, Web, Data Science, Cybersecurity or Databases with SQL), at a 10% discount. The official list changes; check <code>cs50.harvard.edu/courses</code>.</>} /></p>
      </Section>
      <Section id="ai" title={<T pt="E a IA? O pato de borracha e as regras" en="What about AI? The rubber duck and the rules" />}>
        <p><T pt={<>O CS50 não ignora a IA; ele a incorporou com regras claras. Existe o <b>CS50 Duck</b>, uma adaptação do ChatGPT para alunos e professores, disponível em <code>cs50.ai</code> e dentro do VS Code do curso (<code>cs50.dev</code>). O nome vem do <i>rubber duck debugging</i>: explicar o problema em voz alta, para um patinho de borracha, costuma revelar o erro. O pato foi desenhado como <b>tutor</b>: ele guia, faz perguntas e explica conceitos, mas <b>não entrega a resposta</b> do problem set.</>} en={<>CS50 does not ignore AI; it built it in, with clear rules. There is the <b>CS50 Duck</b>, an adaptation of ChatGPT for students and teachers, available at <code>cs50.ai</code> and inside the course’s VS Code (<code>cs50.dev</code>). The name comes from <i>rubber duck debugging</i>: explaining the problem aloud to a rubber duck often reveals the bug. The duck was designed as a <b>tutor</b>: it guides, asks questions and explains concepts, but <b>does not hand over the answer</b> to the problem set.</>} /></p>
        <Diagram minWidth={600} caption={<T pt="A regra do CS50 para IA: a do próprio curso pode, a que resolve por você não." en="CS50’s rule for AI: the course’s own is fine, one that solves it for you is not." />}>
          <svg viewBox="0 0 700 220" role="img" aria-label="Regras de IA no CS50 / AI rules in CS50">
            <rect x="10" y="20" width="330" height="150" rx="4" className="ln brandfill" />
            <text x="175" y="46" className="pt" textAnchor="middle">Permitido (política do curso)</text>
            <text x="175" y="46" className="en" textAnchor="middle">Allowed (course policy)</text>
            <text x="28" y="76" className="pt mut" textAnchor="start">• CS50 Duck (cs50.ai, cs50.dev)</text>
            <text x="28" y="76" className="en mut" textAnchor="start">• CS50 Duck (cs50.ai, cs50.dev)</text>
            <text x="28" y="98" className="pt mut" textAnchor="start">• explica conceitos e mensagens de erro</text>
            <text x="28" y="98" className="en mut" textAnchor="start">• explains concepts and error messages</text>
            <text x="28" y="120" className="pt mut" textAnchor="start">• faz perguntas para você pensar</text>
            <text x="28" y="120" className="en mut" textAnchor="start">• asks questions so you think</text>
            <text x="28" y="142" className="pt mut" textAnchor="start">• não escreve a solução por você</text>
            <text x="28" y="142" className="en mut" textAnchor="start">• does not write the solution for you</text>
            <rect x="360" y="20" width="330" height="150" rx="4" className="ln" />
            <text x="525" y="46" className="pt" textAnchor="middle">Desonestidade acadêmica</text>
            <text x="525" y="46" className="en" textAnchor="middle">Academic dishonesty</text>
            <text x="378" y="76" className="pt mut" textAnchor="start">• outras IAs que sugerem ou completam</text>
            <text x="378" y="76" className="en mut" textAnchor="start">• other AIs that suggest or complete</text>
            <text x="378" y="94" className="pt mut" textAnchor="start"> respostas ou código (ChatGPT, Copilot…)</text>
            <text x="378" y="94" className="en mut" textAnchor="start"> answers or code (ChatGPT, Copilot…)</text>
            <text x="378" y="120" className="pt mut" textAnchor="start">• exceto se um curso permitir de forma</text>
            <text x="378" y="120" className="en mut" textAnchor="start">• unless a course explicitly allows it</text>
            <text x="378" y="138" className="pt mut" textAnchor="start"> explícita</text>
            <text x="378" y="138" className="en mut" textAnchor="start"> </text>
            <text x="10" y="200" className="pt mut" textAnchor="start">Para dúvidas sobre o que conta como cola, o FAQ remete à política de honestidade acadêmica do curso.</text>
            <text x="10" y="200" className="en mut" textAnchor="start">For doubts about what counts as cheating, the FAQ points to the course’s academic honesty policy.</text>
          </svg>
        </Diagram>
        <p><T pt="A página do CS50 sobre o assunto diz que usar IAs de terceiros que sugerem ou completam respostas ou código é desonestidade acadêmica, a menos que o curso permita; as ferramentas do próprio CS50 (o pato) são aceitas. O texto da política pode ser atualizado: leia a versão vigente no site antes de submeter qualquer trabalho." en="CS50’s page on the subject says that using third-party AIs that suggest or complete answers or code is academic dishonesty unless the course allows it; CS50’s own tools (the duck) are accepted. The policy text can be updated: read the current version on the site before submitting any work." /></p>
        <p><T pt="Há mais um motivo, prático, para respeitar a regra mesmo sem ninguém conferindo: se uma IA resolve o problem set, você aprende o que a IA faz, não o que o curso quer que você aprenda. A nota perfeita sem o entendimento é um certificado de nada." en="There is one more reason, a practical one, to respect the rule even when nobody checks: if an AI solves the problem set, you learn what the AI does, not what the course wants you to learn. A perfect score without the understanding is a certificate of nothing." /></p>
      </Section>
      <Section id="sense" title={<T pt="Faz sentido na era da IA?" en="Does it make sense in the AI era?" />}>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Opinião, não verificada nas fontes:</strong> o que segue é a minha leitura, apoiada nos fatos acima (conteúdo do curso e política de IA), não uma pesquisa sobre emprego nem uma garantia de resultado.</>} en={<><strong>Opinion, not verified in the sources:</strong> what follows is my reading, based on the facts above (course content and AI policy), not job-market research nor a guarantee of results.</>} /></Callout>
        <p><T pt={<>Se uma IA escreve código, para que aprender a escrever? A resposta curta: <b>para saber se o que ela escreveu está certo.</b> Um assistente de código gera algo plausível e, de vez em quando, errado de um jeito sutil (um índice fora do limite, uma consulta que explode em volume, uma falha de segurança). Quem não tem a base não enxerga o erro e entrega o código mesmo assim.</>} en={<>If an AI writes code, why learn to write it? The short answer: <b>to know whether what it wrote is right.</b> A coding assistant produces something plausible and, now and then, wrong in a subtle way (an out-of-bounds index, a query that blows up at volume, a security flaw). Someone without the foundation does not see the error and ships the code anyway.</>} /></p>
        <Table
          head={[<T pt="A favor" en="For" />, <T pt="Contra / cuidado" en="Against / caution" />]}
          rows={[
            [<T pt="Ensina o que a IA não substitui: decompor um problema, raciocinar sobre custo (Big O), memória, dados e depuração." en="Teaches what AI does not replace: breaking a problem down, reasoning about cost (Big O), memory, data and debugging." />, <T pt="É longo (centenas de horas) e as semanas de C não são o caminho mais curto para construir um produto." en="It is long (hundreds of hours) and the C weeks are not the shortest path to building a product." />],
            [<T pt="Quem entende memória e estruturas de dados lê melhor o código gerado e faz revisões melhores." en="People who understand memory and data structures read generated code better and review better." />, <T pt="Se você deixar uma IA fazer os problem sets, o curso perde todo o valor (e viola a política)." en="If you let an AI do the problem sets, the course loses all its value (and breaks the policy)." />],
            [<T pt="O curso mesmo adotou IA como tutor 24h, o que reduz o maior problema do estudo sozinho: ficar travado sem ajuda." en="The course itself adopted AI as a 24/7 tutor, which reduces the biggest problem of studying alone: being stuck with no help." />, <T pt="Um tutor que sempre responde pode virar muleta. Tente ficar um tempo travado antes de perguntar." en="A tutor that always answers can become a crutch. Try to stay stuck for a while before asking." />],
            [<T pt="É gratuito, com projeto final que vira portfólio." en="It is free, with a final project that becomes a portfolio." />, <T pt="O certificado, sozinho, pesa pouco. O que pesa é o que você consegue explicar e construir." en="The certificate alone carries little weight. What carries weight is what you can explain and build." />],
          ]}
        />
        <h3><T pt="Um jeito de estudar com IA sem se enganar" en="A way to study with AI without fooling yourself" /></h3>
        <ol className="ds-steps">
          <li><T pt="Tente resolver sozinho primeiro, por um tempo definido (por exemplo, 30 minutos)." en="Try to solve it on your own first, for a set time (for example, 30 minutes)." /></li>
          <li><T pt="Se travar, explique o problema em voz alta ou por escrito (o “pato de borracha” funciona até sem IA)." en="If stuck, explain the problem aloud or in writing (the “rubber duck” works even without AI)." /></li>
          <li><T pt="Ainda travado? Pergunte ao pato do curso: peça uma dica, não a solução." en="Still stuck? Ask the course’s duck: ask for a hint, not the solution." /></li>
          <li><T pt={<>Quando funcionar, faça o <b>teste de explicar</b>: consegue dizer o que cada linha faz, e por que, sem olhar? Se não, ainda não aprendeu.</>} en={<>When it works, do the <b>explain test</b>: can you say what each line does, and why, without looking? If not, you have not learned it yet.</>} /></li>
          <li><T pt="Fora do curso, depois da base, use qualquer IA para produzir código, mas revisando linha a linha. É aqui que o CS50 se paga." en="Outside the course, after the base, use any AI to produce code, but review it line by line. This is where CS50 pays off." /></li>
        </ol>
        <h3><T pt="Resumo por perfil" en="Summary by profile" /></h3>
        <ul className="ds-list">
          <li><T pt={<><em>Iniciante total.</em> Sim, é um dos melhores pontos de partida. Faça sem atalhos com IA.</>} en={<><em>Total beginner.</em> Yes, it is one of the best starting points. Do it without AI shortcuts.</>} /></li>
          <li><T pt={<><em>Quem já programa com ajuda de IA mas sente que “não entende o que está por baixo”.</em> Sim, e é onde o ganho é maior. Faça ao menos as semanas 1 a 5 e o módulo de SQL.</>} en={<><em>People who already program with AI help but feel they “do not understand what is underneath”.</em> Yes, and that is where the gain is biggest. Do at least weeks 1 to 5 and the SQL module.</>} /></li>
          <li><T pt={<><em>Desenvolvedor experiente.</em> Provavelmente vá direto ao curso específico (CS50 AI, CS50 SQL, CS50 Cybersecurity) ou use o CS50x como revisão seletiva.</>} en={<><em>Experienced developer.</em> Probably go straight to a specific course (CS50 AI, CS50 SQL, CS50 Cybersecurity) or use CS50x as selective review.</>} /></li>
          <li><T pt={<><em>Quer emprego rápido.</em> O CS50x sozinho não basta; combine-o com um projeto real e com uma trilha específica (web, dados). Pense nele como a fundação, não como a casa.</>} en={<><em>Wants a job fast.</em> CS50x alone is not enough; combine it with a real project and a specific track (web, data). Think of it as the foundation, not the house.</>} /></li>
        </ul>
        <Callout tone="personal" icon="alert"><T pt={<><strong>Limites desta nota.</strong> Estrutura, regras de certificado, prazo, tempo estimado e lista de cursos vêm das páginas oficiais do CS50 (conteúdo, FAQ, syllabus e cs50.ai) e da página de cursos da edX, consultadas em 2026-10-26; prazos e preços mudam. A política de IA veio do resumo da página do CS50 sobre o pato; não consegui abrir a página de honestidade acadêmica em si. O preço do certificado da edX não está nas fontes oficiais que li. Não fiz o curso nem executei o exemplo em C; a seção “faz sentido” é opinião minha.</>} en={<><strong>Limits of this note.</strong> Structure, certificate rules, deadline, estimated time and course list come from CS50’s official pages (content, FAQ, syllabus and cs50.ai) and edX’s course page, checked on 2026-10-26; deadlines and prices change. The AI policy comes from CS50’s own summary on the duck page; I could not open the academic honesty page itself. The edX certificate price is not in the official sources I read. I did not take the course nor run the C example; the “does it make sense” section is my opinion.</>} /></Callout>
        <Sources title={<T pt="Fontes · verificadas em 2026-10-26" en="Sources · checked on 2026-10-26" />}
          links={[
            { label: "CS50x · página do curso (semanas, projeto, como cursar, certificados)", href: "https://cs50.harvard.edu/x/" },
            { label: "CS50x · FAQs (certificados, requisitos, prazo, check50 e submit50, dublagem em português)", href: "https://cs50.harvard.edu/x/faqs/" },
            { label: "CS50x · syllabus (nota, projeto final, ferramentas)", href: "https://cs50.harvard.edu/x/syllabus/" },
            { label: "CS50 · documentação do CS50.ai (o pato e a política de IA)", href: "https://cs50.readthedocs.io/cs50.ai/" },
            { label: "CS50.ai", href: "https://cs50.ai/" },
            { label: "edX · CS50 (lista de cursos e Professional Certificates)", href: "https://edx.org/cs50" },
            { label: "Harvard Magazine · Embracing AI (a adoção de IA no CS50)", href: "https://www.harvardmagazine.com/2023/08/ai-in-education" },
          ]}
        />
      </Section>
    </>
  );
}
