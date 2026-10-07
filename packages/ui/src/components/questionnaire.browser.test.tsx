import type { FormEvent } from "react";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { descreverContrasteDosTextos } from "../../test/textos";
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
} from "./questionnaire";

const perguntas = [
  {
    name: "objetivo",
    required: true,
    choices: [
      { value: "produto" },
      { value: "estudo" },
      { value: "bloqueado", disabled: true },
    ],
  },
  {
    name: "recursos",
    required: false,
    choices: [{ value: "tokens" }, { value: "componentes" }],
  },
  { name: "prazo", required: true, choices: [{ value: "agora" }] },
] as const;

function Exemplo({
  onSubmit,
  invalid = false,
}: {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  invalid?: boolean;
}) {
  return (
    <div style={{ width: 240 }}>
      <Questionnaire items={perguntas} shortcuts="letters" onSubmit={onSubmit}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="objetivo" required invalid={invalid}>
          <QuestionnaireTitle>Qual é o objetivo?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Escolha uma opção ou escreva outra.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="produto">
              Produto
              <QuestionnaireChoiceDescription>
                Construir uma aplicação
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="estudo">Estudo</QuestionnaireChoice>
            <QuestionnaireChoice value="bloqueado" disabled>
              Indisponível
            </QuestionnaireChoice>
            <QuestionnaireInput
              aria-label="Outro objetivo"
              placeholder="Seu objetivo"
            />
          </QuestionnaireChoices>
          <QuestionnaireError>Escolha uma resposta.</QuestionnaireError>
        </QuestionnaireItem>
        <QuestionnaireItem name="recursos" multiple>
          <QuestionnaireTitle>Quais recursos?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="tokens">Tokens</QuestionnaireChoice>
            <QuestionnaireChoice value="componentes">
              Componentes
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="prazo" required>
          <QuestionnaireTitle>Quando começar?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="agora">Agora</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
}

descreverContrasteDosTextos({
  nome: "Questionnaire",
  montar: () => <Exemplo invalid />,
});

describe("Questionnaire", () => {
  test("valida obrigatoriedade e associa erro, legenda e progresso em português", async () => {
    const tela = await render(<Exemplo />);
    await expect
      .element(
        tela.getByRole("progressbar", { name: "Progresso do questionário" }),
      )
      .toHaveAttribute("aria-valuenow", "1");
    await expect
      .element(
        tela.container.querySelector<HTMLButtonElement>(
          '[data-slot="questionnaire-skip"]',
        )!,
      )
      .not.toBeVisible();
    await tela.getByRole("button", { name: "Próxima" }).click();
    await expect
      .element(tela.getByRole("alert"))
      .toHaveTextContent("Escolha uma resposta.");
    const grupo = tela
      .getByRole("group", { name: "Qual é o objetivo?" })
      .element();
    const erro = tela.getByRole("alert").element();
    expect(grupo.getAttribute("aria-describedby")?.split(" ")).toContain(
      erro.id,
    );
    await expect
      .element(tela.getByRole("radio", { name: "Indisponível" }))
      .toBeDisabled();
  });

  test("navega pelo teclado, preserva seleção ao voltar e envia respostas simples e múltiplas", async () => {
    const enviar = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return Array.from(new FormData(event.currentTarget));
    });
    const tela = await render(<Exemplo onSubmit={enviar} />);
    const primeiro = tela.getByRole("radio", {
      name: "Produto Construir uma aplicação",
    });
    (primeiro.element() as HTMLElement).focus();
    await userEvent.keyboard(" ");
    await expect.element(primeiro).toBeChecked();
    const opcao = primeiro
      .element()
      .closest('[data-slot="questionnaire-choice"]')!;
    expect(getComputedStyle(opcao).boxShadow).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    await expect.element(tela.getByText("Quais recursos?")).toBeVisible();
    await tela.getByRole("checkbox", { name: "Tokens" }).click();
    await tela.getByRole("checkbox", { name: "Componentes" }).click();
    await tela.getByRole("button", { name: "Anterior" }).click();
    await expect.element(primeiro).toBeChecked();
    await tela.getByRole("button", { name: "Próxima" }).click();
    await expect
      .element(tela.getByRole("checkbox", { name: "Tokens" }))
      .toBeChecked();
    await tela.getByRole("button", { name: "Próxima" }).click();
    await tela.getByRole("radio", { name: "Agora" }).click();
    await tela.getByRole("button", { name: "Enviar" }).click();
    expect(enviar).toHaveBeenCalledOnce();
    expect(enviar.mock.results[0]?.value).toEqual([
      ["objetivo", "produto"],
      ["recursos", "tokens"],
      ["recursos", "componentes"],
      ["prazo", "agora"],
    ]);
  });

  test("resposta livre substitui opção fixa e pular remove as respostas da pergunta opcional", async () => {
    const enviar = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return Array.from(new FormData(event.currentTarget));
    });
    const tela = await render(<Exemplo onSubmit={enviar} />);
    await tela.getByRole("radio", { name: "Estudo" }).click();
    await tela
      .getByRole("textbox", { name: "Outro objetivo" })
      .fill("Pesquisa");
    await expect
      .element(tela.getByRole("radio", { name: "Estudo" }))
      .not.toBeChecked();
    await tela.getByRole("button", { name: "Próxima" }).click();
    await tela.getByRole("checkbox", { name: "Tokens" }).click();
    await tela.getByRole("button", { name: "Pular", exact: true }).click();
    await tela.getByRole("radio", { name: "Agora" }).click();
    await tela.getByRole("button", { name: "Enviar" }).click();
    expect(enviar.mock.results[0]?.value).toEqual([
      ["objetivo", "Pesquisa"],
      ["prazo", "agora"],
    ]);
  });

  test("atalhos selecionam opções sem interferir na digitação e ações cabem em 240px", async () => {
    const tela = await render(<Exemplo />);
    (
      tela.getByRole("radio", { name: "Estudo" }).element() as HTMLElement
    ).focus();
    await userEvent.keyboard("a");
    await expect
      .element(
        tela.getByRole("radio", { name: "Produto Construir uma aplicação" }),
      )
      .toBeChecked();
    await tela.getByRole("textbox", { name: "Outro objetivo" }).fill("abc");
    await expect
      .element(tela.getByRole("textbox", { name: "Outro objetivo" }))
      .toHaveValue("abc");
    await tela.getByRole("button", { name: "Próxima" }).click();
    const caixa = tela.container
      .querySelector('[data-slot="questionnaire-actions"]')!
      .getBoundingClientRect();
    for (const button of tela.container.querySelectorAll<HTMLButtonElement>(
      '[data-slot="questionnaire-actions"] button:not([hidden])',
    )) {
      const rect = button.getBoundingClientRect();
      expect(rect.left).toBeGreaterThanOrEqual(caixa.left);
      expect(rect.right).toBeLessThanOrEqual(caixa.right + 1);
    }
  });
});
