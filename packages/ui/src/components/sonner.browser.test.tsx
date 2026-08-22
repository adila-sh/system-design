import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Toaster, toast } from "./sonner";

describe("Toaster", () => {
  afterEach(() => {
    toast.dismiss();
  });

  test("publica tema e tokens visuais no container", async () => {
    const tela = await render(<Toaster theme="dark" />);
    toast("Configuração visual");
    await expect.element(tela.getByText("Configuração visual")).toBeVisible();
    const toaster = document.querySelector("[data-sonner-toaster]")!;

    expect(toaster.getAttribute("data-sonner-theme")).toBe("dark");
    expect((toaster as HTMLElement).style.getPropertyValue("--normal-bg")).toBe(
      "var(--popover)",
    );
    expect(
      (toaster as HTMLElement).style.getPropertyValue("--normal-text"),
    ).toBe("var(--popover-foreground)");
  });

  test.each([
    ["success", "Alterações salvas"],
    ["error", "Falha ao salvar"],
    ["loading", "Salvando alterações"],
  ] as const)(
    "renderiza toast %s com ícone e conteúdo",
    async (tipo, mensagem) => {
      const tela = await render(<Toaster duration={Infinity} />);

      toast[tipo](mensagem);

      await expect.element(tela.getByText(mensagem)).toBeVisible();
      const item = tela
        .getByText(mensagem)
        .element()
        .closest("[data-sonner-toast]");
      expect(item?.getAttribute("data-type")).toBe(tipo);
      expect(item?.querySelector("svg")).not.toBeNull();
      expect(item?.classList.contains("cn-toast")).toBe(true);
    },
  );
});
