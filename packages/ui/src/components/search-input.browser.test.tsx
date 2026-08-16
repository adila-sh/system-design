import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CurrencyInput } from "./currency-input";
import { PasswordInput } from "./password-input";
import { SearchInput } from "./search-input";
import { MINIMO, contrasteDoPlaceholder } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

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
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

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
