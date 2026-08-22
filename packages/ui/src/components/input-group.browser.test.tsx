import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploInputGroup() {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Endereço" defaultValue="adila.co" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Copiar</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

descreverContrasteDosTextos({
  nome: "InputGroup",
  montar: () => <ExemploInputGroup />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("InputGroup", () => {
  test("agrupa campo, addons e botão com tipos seguros", async () => {
    const tela = await render(<ExemploInputGroup />);
    const grupo = tela.container.querySelector('[data-slot="input-group"]')!;
    const campo = tela.getByRole("textbox", { name: "Endereço" }).element();
    const botao = tela.getByRole("button", { name: "Copiar" }).element();

    expect(grupo.getAttribute("data-slot")).toBe("input-group");
    expect(
      grupo.querySelectorAll('[data-slot="input-group-addon"]'),
    ).toHaveLength(2);
    expect((campo as HTMLInputElement).value).toBe("adila.co");
    expect((botao as HTMLButtonElement).type).toBe("button");
  });

  test("foca o campo ao clicar no addon, mas preserva o clique do botão", async () => {
    const aoClicar = vi.fn();
    const tela = await render(
      <InputGroup>
        <InputGroupAddon>Prefixo</InputGroupAddon>
        <InputGroupInput aria-label="Busca" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={aoClicar}>Executar</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    );
    const campo = tela.getByRole("textbox", { name: "Busca" }).element();
    const addons = tela.container.querySelectorAll(
      '[data-slot="input-group-addon"]',
    );

    (addons[0] as HTMLElement).click();
    expect(document.activeElement).toBe(campo);

    await tela.getByRole("button", { name: "Executar" }).click();
    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  test("admite addon em bloco e textarea como controle", async () => {
    const tela = await render(
      <InputGroup>
        <InputGroupAddon align="block-start">Descrição</InputGroupAddon>
        <InputGroupTextarea aria-label="Descrição detalhada" rows={3} />
      </InputGroup>,
    );
    const grupo = tela.container.querySelector('[data-slot="input-group"]')!;
    const addon = tela.container.querySelector(
      '[data-slot="input-group-addon"]',
    )!;

    expect(addon.getAttribute("data-align")).toBe("block-start");
    expect(getComputedStyle(grupo).flexDirection).toBe("column");
    expect(
      tela.getByRole("textbox", { name: "Descrição detalhada" }).element(),
    ).toBeInstanceOf(HTMLTextAreaElement);
  });
});
