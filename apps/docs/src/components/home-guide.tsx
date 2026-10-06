import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@adila-sh/ui";

const STEPS = [
  {
    title: "Prepare a base",
    body: "Configure o GitHub Packages e instale a biblioteca no seu projeto React.",
    splat: "installation",
    link: "Instalar a biblioteca",
  },
  {
    title: "Monte o primeiro fluxo",
    body: "Escolha os componentes, conecte os estados e experimente os exemplos da documentação.",
    splat: "components/field",
    link: "Construir um formulário",
  },
  {
    title: "Encontre sua expressão",
    body: "Combine tokens, temas e composição para manter a identidade em cada tela.",
    splat: "philosophy",
    link: "Explorar os fundamentos",
  },
] as const;
const QUESTIONS = [
  {
    question: "Preciso configurar o Tailwind no meu projeto?",
    answer:
      "Não. O pacote inclui o CSS pré-compilado. Importe @adila-sh/ui/style.css junto dos componentes e siga o guia de instalação para configurar o GitHub Packages.",
  },
  {
    question: "Os exemplos são os mesmos componentes do pacote?",
    answer:
      "Sim. A home, o showcase e os previews da documentação usam a biblioteca @adila-sh/ui. Você explora aqui as mesmas peças que instala no seu produto.",
  },
  {
    question: "Posso adaptar a aparência ao meu produto?",
    answer:
      "Sim. Os tokens CSS organizam cores, fontes, raios e espaçamento. Você pode ajustar essa base e compor os componentes conforme os fluxos do seu produto.",
  },
  {
    question: "Como funcionam os temas e a navegação por teclado?",
    answer:
      "A biblioteca oferece temas claro e escuro, componentes com gerenciamento de foco e interações por teclado. A documentação mostra exemplos de uso, e os testes verificam os contratos de cada componente.",
  },
] as const;

export function HomeGuide() {
  return (
    <>
      <section
        className="home-container home-guide"
        aria-labelledby="guide-title"
      >
        <div className="home-section-heading">
          <h2 id="guide-title">
            Da primeira peça
            <br />
            ao primeiro fluxo.
          </h2>
          <p>
            Um caminho direto para sair da página em branco e começar a
            construir com a biblioteca.
          </p>
        </div>
        <ol className="home-guide-steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="home-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <Link
                to="/docs/$"
                params={{ _splat: step.splat }}
                className="home-text-link"
              >
                {step.link}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section
        id="duvidas"
        className="home-container home-faq"
        aria-labelledby="faq-title"
      >
        <div>
          <h2 id="faq-title">Antes de começar.</h2>
          <p>
            Algumas respostas para conhecer melhor a base que vai acompanhar seu
            produto.
          </p>
          <Link to="/docs/$" params={{ _splat: "" }} className="home-text-link">
            Ir para a documentação
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
        <Accordion>
          {QUESTIONS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
