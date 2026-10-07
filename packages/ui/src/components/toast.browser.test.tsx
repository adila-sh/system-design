import { useEffect, useState } from "react";
import { describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { descreverContrasteDosTextos } from "../../test/textos";
import { Toaster, createToastManager } from "./toast";

function Exemplo() {
  const [manager] = useState(createToastManager);
  useEffect(() => {
    manager.add({
      title: "Alterações salvas",
      description: "As preferências foram atualizadas.",
      type: "success",
      timeout: 0,
      actionProps: { children: "Desfazer" },
    });
    return () => manager.close();
  }, [manager]);
  return <Toaster toastManager={manager} />;
}

descreverContrasteDosTextos({
  nome: "Toast",
  montar: () => <Exemplo />,
  raiz: '[data-slot="toast"]',
});

describe("Toast", () => {
  test.each([undefined, "success", "info", "warning", "error", "loading"])(
    "renderiza tipo %s com descrição e fechamento acessível",
    async (type) => {
      const manager = createToastManager();
      await render(<Toaster toastManager={manager} />);
      const fechar = vi.fn();
      manager.add({
        title: "Uma notificação",
        description: "Confira as alterações.",
        type,
        timeout: 0,
        onClose: fechar,
      });
      await expect.element(page.getByText("Uma notificação")).toBeVisible();
      await expect
        .element(page.getByText("Confira as alterações."))
        .toBeVisible();
      const toast = document.querySelector('[data-slot="toast"]')!;
      expect(toast.querySelector('[data-slot="toast-icon"]') !== null).toBe(
        type !== undefined,
      );
      await page.getByText("Uma notificação").hover();
      await page.getByRole("button", { name: "Fechar notificação" }).click();
      expect(fechar).toHaveBeenCalledOnce();
      await expect
        .element(page.getByText("Uma notificação"))
        .not.toBeInTheDocument();
    },
  );

  test("executa uma ação e permite atualizar a notificação sem duplicar", async () => {
    const manager = createToastManager();
    await render(<Toaster toastManager={manager} />);
    const agir = vi.fn();
    const id = manager.add({
      title: "Arquivo removido",
      timeout: 0,
      actionProps: { children: "Desfazer", onClick: agir },
    });
    await page.getByRole("button", { name: "Desfazer" }).click();
    expect(agir).toHaveBeenCalledOnce();
    manager.update(id, { title: "Arquivo restaurado", type: "success" });
    await expect.element(page.getByText("Arquivo restaurado")).toBeVisible();
    expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);
    manager.close(id);
    await expect
      .element(page.getByText("Arquivo restaurado"))
      .not.toBeInTheDocument();
  });

  test.each(["success", "error"] as const)(
    "promise passa de carregando para %s",
    async (outcome) => {
      const manager = createToastManager();
      await render(<Toaster toastManager={manager} timeout={0} />);
      let resolve!: (value: string) => void;
      let reject!: (reason: Error) => void;
      const promise = new Promise<string>((yes, no) => {
        resolve = yes;
        reject = no;
      });
      const result = manager.promise(promise, {
        loading: "Salvando",
        success: (value) => `Salvo: ${value}`,
        error: "Falha ao salvar",
      });
      // O consumidor continua responsável por tratar o resultado da operação.
      const handled = result.catch(() => undefined);
      await expect.element(page.getByText("Salvando")).toBeVisible();
      if (outcome === "success") resolve("preferências");
      else reject(new Error("Falha"));
      await handled;
      await expect
        .element(
          page.getByText(
            outcome === "success" ? "Salvo: preferências" : "Falha ao salvar",
          ),
        )
        .toBeVisible();
      expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);
    },
  );
});
