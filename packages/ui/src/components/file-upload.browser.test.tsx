import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FileUpload } from "./file-upload";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();
const PDF = new File([new Uint8Array(2048)], "relatorio.pdf", {
  type: "application/pdf",
  lastModified: 1,
});

descreverContrasteDosTextos({
  nome: "FileUpload",
  montar: () => <FileUpload defaultValue={[PDF]} maxSize={1024 * 1024} />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("FileUpload", () => {
  test("seleciona múltiplos arquivos aceitos e informa tamanhos", async () => {
    const aoMudar = vi.fn();
    const imagem = new File([new Uint8Array(512)], "avatar.png", {
      type: "image/png",
    });
    const tela = await render(
      <FileUpload
        accept="image/*,application/pdf"
        multiple
        onFilesChange={aoMudar}
      />,
    );
    const input = tela.container.querySelector('input[type="file"]')!;

    await userEvent.upload(input, [imagem, PDF]);

    expect(aoMudar).toHaveBeenCalledWith([imagem, PDF]);
    await expect.element(tela.getByText("avatar.png")).toBeVisible();
    await expect.element(tela.getByText("relatorio.pdf")).toBeVisible();
    await expect.element(tela.getByText("512 B")).toBeVisible();
    await expect.element(tela.getByText("2.0 KB")).toBeVisible();
  });

  test("rejeita formato não aceito sem alterar a lista", async () => {
    const aoMudar = vi.fn();
    const executavel = new File(["binário"], "instalador.exe", {
      type: "application/octet-stream",
    });
    const tela = await render(
      <FileUpload accept=".pdf" onFilesChange={aoMudar} />,
    );

    await userEvent.upload(
      tela.container.querySelector('input[type="file"]')!,
      executavel,
    );

    await expect
      .element(tela.getByRole("alert"))
      .toHaveTextContent(
        "instalador.exe não corresponde aos formatos aceitos.",
      );
    expect(aoMudar).not.toHaveBeenCalled();
    expect(
      tela.container.querySelector('[data-slot="file-upload-list"]'),
    ).toBeNull();
  });

  test("rejeita arquivo acima do limite formatado", async () => {
    const grande = new File([new Uint8Array(2049)], "grande.pdf", {
      type: "application/pdf",
    });
    const tela = await render(<FileUpload maxSize={2048} />);

    await userEvent.upload(
      tela.container.querySelector('input[type="file"]')!,
      grande,
    );

    await expect
      .element(tela.getByRole("alert"))
      .toHaveTextContent("grande.pdf excede o limite de 2.0 KB.");
  });

  test("remove arquivo no modo controlado sem alterar a interface sozinho", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <FileUpload value={[PDF]} onFilesChange={aoMudar} />,
    );

    await tela.getByRole("button", { name: "Remover relatorio.pdf" }).click();

    expect(aoMudar).toHaveBeenCalledWith([]);
    await expect.element(tela.getByText("relatorio.pdf")).toBeVisible();
  });

  test("desabilita entrada e seleção e publica o estado", async () => {
    const tela = await render(<FileUpload disabled multiple />);
    const raiz = tela.container.querySelector('[data-slot="file-upload"]')!;
    const input = tela.container.querySelector('input[type="file"]')!;

    expect(raiz.hasAttribute("data-disabled")).toBe(true);
    expect((input as HTMLInputElement).disabled).toBe(true);
    await expect
      .element(tela.getByRole("button", { name: "Selecionar arquivos" }))
      .toBeDisabled();
  });
});
