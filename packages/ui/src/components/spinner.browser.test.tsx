import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Spinner } from "./spinner";
import { MINIMO, contrasteDe } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

describe.each(TEMAS)("Spinner no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o indicador gráfico atinge contraste não textual", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Spinner aria-label="Carregando relatório" />);
    const spinner = tela.getByRole("status", {
      name: "Carregando relatório",
    });

    expect(contrasteDe(spinner.element())).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
  });
});

describe("Spinner semântico", () => {
  test("oferece um nome padrão para o estado de carregamento", async () => {
    const tela = await render(<Spinner />);
    await expect
      .element(tela.getByRole("status", { name: "Loading" }))
      .toBeInTheDocument();
  });
});
