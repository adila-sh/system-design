import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { PasswordInput } from "./password-input";
import { descreverContrasteDeTexto } from "../../test/variantes";

const ESTADOS = ["password"] as const;
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "PasswordInput",
  variantes: ESTADOS,
  prop: "estado",
  montar: () => <PasswordInput aria-label="Senha" defaultValue="segredo" />,
  seletor: "input",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("PasswordInput", () => {
  test("alterna a visibilidade sem perder o nome acessível", async () => {
    const tela = await render(
      <PasswordInput
        aria-label="Senha"
        defaultValue="segredo"
        showLabel="Exibir senha"
        hideLabel="Esconder senha"
      />,
    );
    const campo = tela.getByRole("textbox", { name: "Senha" }).element();
    const mostrar = tela.getByRole("button", { name: "Exibir senha" });

    expect(campo.getAttribute("type")).toBe("password");
    expect(mostrar.element().getAttribute("aria-pressed")).toBe("false");

    await mostrar.click();

    expect(campo.getAttribute("type")).toBe("text");
    expect(
      tela
        .getByRole("button", { name: "Esconder senha" })
        .element()
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  test("avisa sobre Caps Lock e limpa o aviso ao perder o foco", async () => {
    const tela = await render(
      <PasswordInput aria-label="Senha" capsLockMessage="Maiúsculas ativas" />,
    );
    const campo = tela.getByRole("textbox", { name: "Senha" }).element();
    const evento = new KeyboardEvent("keydown", { bubbles: true });
    vi.spyOn(evento, "getModifierState").mockImplementation(
      (tecla) => tecla === "CapsLock",
    );

    campo.focus();
    campo.dispatchEvent(evento);
    await expect.element(tela.getByText("Maiúsculas ativas")).toBeVisible();

    campo.blur();
    await expect
      .element(tela.getByText("Maiúsculas ativas"))
      .not.toBeInTheDocument();
  });

  test("propaga os eventos de teclado e desfoque", async () => {
    const aoPressionar = vi.fn();
    const aoSoltar = vi.fn();
    const aoDesfocar = vi.fn();
    const tela = await render(
      <PasswordInput
        aria-label="Senha"
        onKeyDown={aoPressionar}
        onKeyUp={aoSoltar}
        onBlur={aoDesfocar}
      />,
    );
    const campo = tela.getByRole("textbox", { name: "Senha" }).element();

    campo.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", bubbles: true }),
    );
    campo.dispatchEvent(
      new KeyboardEvent("keyup", { key: "a", bubbles: true }),
    );
    campo.focus();
    campo.blur();

    expect(aoPressionar).toHaveBeenCalledTimes(1);
    expect(aoSoltar).toHaveBeenCalledTimes(1);
    expect(aoDesfocar).toHaveBeenCalledTimes(1);
  });
});
