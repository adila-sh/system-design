import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CurrencyInput } from "./currency-input";
import { PasswordInput } from "./password-input";
import { SearchInput } from "./search-input";
import { MINIMO, contrasteDoPlaceholder } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.classList.remove("dark");
});

// As três variações de campo embrulham o Input com adornos próprios (ícone,
// botão de revelar, prefixo de moeda). O placeholder é medido em cada uma
// porque o adorno muda a superfície sob o texto.
const CAMPOS = [
  {
    nome: "SearchInput",
    montar: () => <SearchInput placeholder="Buscar transações" />,
  },
  {
    nome: "PasswordInput",
    montar: () => <PasswordInput placeholder="Sua senha" />,
  },
  {
    // O CurrencyInput é um NumberField por dentro, então o placeholder vai no
    // inputProps em vez de na raiz.
    nome: "CurrencyInput",
    montar: () => <CurrencyInput inputProps={{ placeholder: "0,00" }} />,
  },
] as const;

describe.each(TEMAS)("Campos com adorno no tema %s", (tema) => {
  test.each(CAMPOS)("o placeholder do $nome é legível", async ({ montar }) => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(montar());
    const campo = tela.container.querySelector("input");
    expect(campo, "nenhum <input> encontrado").not.toBeNull();
    expect(contrasteDoPlaceholder(campo as Element)).toBeGreaterThanOrEqual(
      MINIMO.texto,
    );
  });
});

describe("SearchInput", () => {
  test("mantém o defaultValue no modo não controlado e propaga edições", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar clientes"
        defaultValue="Ana"
        onValueChange={aoMudar}
      />,
    );
    const campo = tela.getByRole("searchbox", { name: "Buscar clientes" });

    expect((campo.element() as HTMLInputElement).value).toBe("Ana");
    await campo.fill("Beatriz");

    expect((campo.element() as HTMLInputElement).value).toBe("Beatriz");
    expect(aoMudar).toHaveBeenLastCalledWith("Beatriz");
  });

  test("delega o valor ao consumidor no modo controlado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar pedidos"
        value="aberto"
        onValueChange={aoMudar}
      />,
    );
    const campo = tela.getByRole("searchbox", { name: "Buscar pedidos" });

    await campo.fill("fechado");

    expect(aoMudar).toHaveBeenLastCalledWith("fechado");
    expect((campo.element() as HTMLInputElement).value).toBe("aberto");

    await tela.rerender(
      <SearchInput
        aria-label="Buscar pedidos"
        value="fechado"
        onValueChange={aoMudar}
      />,
    );
    expect((campo.element() as HTMLInputElement).value).toBe("fechado");
  });

  test("não busca na montagem e aplica debounce ao valor mais recente", async () => {
    vi.useFakeTimers();
    const aoBuscar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar faturas"
        defaultValue="inicial"
        debounce={300}
        onSearch={aoBuscar}
      />,
    );
    const campo = tela.getByRole("searchbox", { name: "Buscar faturas" });

    await vi.advanceTimersByTimeAsync(1_000);
    expect(aoBuscar).not.toHaveBeenCalled();

    await campo.fill("atrasada");
    await vi.advanceTimersByTimeAsync(200);
    await campo.fill("paga");
    await vi.advanceTimersByTimeAsync(299);
    expect(aoBuscar).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(aoBuscar).toHaveBeenCalledOnce();
    expect(aoBuscar).toHaveBeenLastCalledWith("paga");
  });

  test("cancela a busca pendente ao desmontar", async () => {
    vi.useFakeTimers();
    const aoBuscar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar contratos"
        debounce={300}
        onSearch={aoBuscar}
      />,
    );

    await tela
      .getByRole("searchbox", { name: "Buscar contratos" })
      .fill("2026");
    tela.unmount();
    await vi.advanceTimersByTimeAsync(300);

    expect(aoBuscar).not.toHaveBeenCalled();
  });

  test("usa o callback mais recente sem reiniciar o timer", async () => {
    vi.useFakeTimers();
    const buscaAntiga = vi.fn();
    const buscaAtual = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar notas"
        debounce={300}
        onSearch={buscaAntiga}
      />,
    );

    await tela.getByRole("searchbox", { name: "Buscar notas" }).fill("adila");
    await vi.advanceTimersByTimeAsync(200);
    await tela.rerender(
      <SearchInput
        aria-label="Buscar notas"
        debounce={300}
        onSearch={buscaAtual}
      />,
    );
    await vi.advanceTimersByTimeAsync(100);

    expect(buscaAntiga).not.toHaveBeenCalled();
    expect(buscaAtual).toHaveBeenCalledOnce();
    expect(buscaAtual).toHaveBeenCalledWith("adila");
  });

  test("limpa o valor e chama os callbacks esperados", async () => {
    vi.useFakeTimers();
    const aoMudar = vi.fn();
    const aoBuscar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar produtos"
        defaultValue="teclado"
        clearLabel="Remover filtro"
        debounce={100}
        onValueChange={aoMudar}
        onSearch={aoBuscar}
      />,
    );

    await tela.getByRole("button", { name: "Remover filtro" }).click();
    expect(aoMudar).toHaveBeenLastCalledWith("");
    expect(
      (
        tela
          .getByRole("searchbox", { name: "Buscar produtos" })
          .element() as HTMLInputElement
      ).value,
    ).toBe("");

    await vi.advanceTimersByTimeAsync(100);
    expect(aoBuscar).toHaveBeenCalledWith("");
    await expect
      .element(tela.getByRole("button", { name: "Remover filtro" }))
      .not.toBeInTheDocument();
  });

  test("impede edição e limpeza quando está desabilitado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <SearchInput
        aria-label="Buscar usuários"
        defaultValue="admin"
        disabled
        onValueChange={aoMudar}
      />,
    );
    const campo = tela.getByRole("searchbox", { name: "Buscar usuários" });
    const limpar = tela.getByRole("button", { name: "Limpar busca" });

    await expect.element(campo).toBeDisabled();
    await expect.element(limpar).toBeDisabled();
    (limpar.element() as HTMLButtonElement).click();

    expect(aoMudar).not.toHaveBeenCalled();
    expect((campo.element() as HTMLInputElement).value).toBe("admin");
  });

  test("troca o ícone de loading sem perder o nome acessível", async () => {
    const tela = await render(
      <SearchInput aria-label="Buscar relatórios" loading />,
    );
    const campo = tela.getByRole("searchbox", { name: "Buscar relatórios" });

    await expect.element(campo).toBeVisible();
    expect(tela.container.querySelector("svg.animate-spin")).not.toBeNull();

    await tela.rerender(
      <SearchInput aria-label="Buscar relatórios" loading={false} />,
    );
    await expect.element(campo).toBeVisible();
    expect(tela.container.querySelector("svg.animate-spin")).toBeNull();
  });
});
