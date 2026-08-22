import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox";
import { descreverContrasteDosTextos } from "../../test/textos";

const FRAMEWORKS = ["Next.js", "Remix", "Astro", "SvelteKit"];
const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploCombobox({
  defaultOpen = false,
  defaultValue,
  onValueChange,
}: {
  defaultOpen?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
}) {
  return (
    <Combobox
      items={FRAMEWORKS}
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <ComboboxInput aria-label="Framework" placeholder="Buscar framework" />
      <ComboboxContent>
        <ComboboxEmpty>Nenhum resultado.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

descreverContrasteDosTextos({
  nome: "Combobox",
  montar: () => <ExemploCombobox defaultOpen defaultValue="Astro" />,
  raiz: '[data-slot="combobox-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Combobox", () => {
  test("abre opções e expõe seleção inicial", async () => {
    const tela = await render(<ExemploCombobox defaultValue="Astro" />);
    const campo = tela.getByRole("combobox", { name: "Framework" });

    expect((campo.element() as HTMLInputElement).value).toBe("Astro");
    await campo.click();
    await expect.element(tela.getByRole("listbox")).toBeVisible();
    await expect
      .element(tela.getByRole("option", { name: "Astro" }))
      .toHaveAttribute("aria-selected", "true");
  });

  test("seleciona opção e notifica o consumidor", async () => {
    const aoMudar = vi.fn();
    const tela = await render(<ExemploCombobox onValueChange={aoMudar} />);

    await tela.getByRole("combobox", { name: "Framework" }).click();
    await tela.getByRole("option", { name: "Remix" }).click();

    expect(aoMudar).toHaveBeenCalledWith("Remix", expect.anything());
    expect(
      (
        tela
          .getByRole("combobox", { name: "Framework" })
          .element() as HTMLInputElement
      ).value,
    ).toBe("Remix");
  });

  test("filtra itens e exibe estado vazio", async () => {
    const tela = await render(<ExemploCombobox />);
    const campo = tela.getByRole("combobox", { name: "Framework" });

    await campo.fill("Solid");

    await expect.element(tela.getByText("Nenhum resultado.")).toBeVisible();
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(0);
  });

  test("abre, percorre e seleciona opções pelo teclado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(<ExemploCombobox onValueChange={aoMudar} />);
    const campo = tela.getByRole("combobox", { name: "Framework" });

    campo.element().focus();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(tela.getByRole("listbox")).toBeVisible();
    const destacada = document.querySelector(
      '[role="option"][data-highlighted]',
    );
    expect(destacada).not.toBeNull();
    const rotulo = destacada!.textContent?.trim();

    await userEvent.keyboard("{Enter}");

    expect((campo.element() as HTMLInputElement).value).toBe(rotulo);
    expect(aoMudar).toHaveBeenCalledWith(rotulo, expect.anything());
  });
});
