import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@adila-sh/ui/alert";
import { Button } from "@adila-sh/ui/button";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@adila-sh/ui/questionnaire";

const perguntas = [
  {
    name: "objetivo",
    required: true,
    multiple: false,
    title: "O que você quer construir?",
    description: "Escolha uma direção ou escreva a sua.",
    choices: [
      {
        value: "produto",
        label: "Um novo produto",
        description: "Uma interface pronta para crescer.",
      },
      {
        value: "evolucao",
        label: "Evoluir uma interface",
        description: "Mais consistência no que já existe.",
      },
    ],
    input: {
      label: "Outro objetivo",
      placeholder: "Conte o que você tem em mente",
    },
  },
  {
    name: "recursos",
    required: false,
    multiple: true,
    title: "Por onde vamos começar?",
    description: "Você pode escolher mais de uma opção ou pular.",
    choices: [
      { value: "tokens", label: "Tokens e temas" },
      { value: "componentes", label: "Componentes" },
      { value: "fluxos", label: "Fluxos completos" },
    ],
  },
  {
    name: "prioridade",
    required: true,
    multiple: false,
    title: "Qual é a prioridade?",
    description:
      "Esta é a última pergunta. Revise as respostas antes de enviar.",
    choices: [
      { value: "consistencia", label: "Consistência visual" },
      { value: "acessibilidade", label: "Acessibilidade" },
      { value: "velocidade", label: "Velocidade de construção" },
    ],
  },
] as const;

export function QuestionnaireDemo() {
  const [respostas, setRespostas] = useState<FormData | null>(null);
  const [tentativa, setTentativa] = useState(0);
  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRespostas(new FormData(event.currentTarget));
  }
  if (respostas) {
    const rotulo = (name: string, value: FormDataEntryValue) => {
      const pergunta = perguntas.find((item) => item.name === name);
      return (
        pergunta?.choices.find((choice) => choice.value === value)?.label ??
        String(value)
      );
    };
    return (
      <div className="flex w-full max-w-md flex-col gap-4">
        <Alert>
          <AlertTitle>Respostas recebidas</AlertTitle>
          <AlertDescription>
            Este exemplo mantém as respostas apenas nesta página.
          </AlertDescription>
        </Alert>
        <dl className="flex flex-col gap-4 text-sm">
          {perguntas.map((pergunta) => (
            <div key={pergunta.name} className="flex flex-col gap-1">
              <dt className="font-medium">{pergunta.title}</dt>
              <dd className="text-muted-foreground wrap-break-word">
                {respostas
                  .getAll(pergunta.name)
                  .map((value) => rotulo(pergunta.name, value))
                  .join(", ") || "Pergunta pulada"}
              </dd>
            </div>
          ))}
        </dl>
        <Button
          variant="outline"
          onClick={() => {
            setRespostas(null);
            setTentativa((value) => value + 1);
          }}
        >
          Responder novamente
        </Button>
      </div>
    );
  }
  return (
    <Questionnaire
      key={tentativa}
      items={perguntas}
      shortcuts="numbers"
      onSubmit={enviar}
      className="max-w-md"
    >
      <QuestionnaireProgress />
      {perguntas.map((pergunta) => (
        <QuestionnaireItem
          key={pergunta.name}
          name={pergunta.name}
          required={pergunta.required}
          multiple={pergunta.multiple}
        >
          <QuestionnaireTitle>{pergunta.title}</QuestionnaireTitle>
          <QuestionnaireDescription>
            {pergunta.description}
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {pergunta.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                <span className="font-medium">{choice.label}</span>
                {"description" in choice && (
                  <QuestionnaireChoiceDescription>
                    {choice.description}
                  </QuestionnaireChoiceDescription>
                )}
              </QuestionnaireChoice>
            ))}
            {"input" in pergunta && (
              <QuestionnaireInput
                aria-label={pergunta.input.label}
                placeholder={pergunta.input.placeholder}
              />
            )}
          </QuestionnaireChoices>
          <QuestionnaireError>
            {pergunta.required
              ? "Escolha uma resposta para continuar."
              : "Escolha uma resposta ou pule esta pergunta."}
          </QuestionnaireError>
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}
