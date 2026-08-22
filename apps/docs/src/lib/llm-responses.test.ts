import { describe, expect, it, vi } from "vitest";
import {
  createLlmsFullResponse,
  createLlmsIndexResponse,
  createMarkdownPageResponse,
  type LLMPage,
} from "./llm-responses";

function page(title: string, url: string, text: string): LLMPage {
  return {
    url,
    data: {
      title,
      getText: vi.fn().mockResolvedValue(text),
    },
  };
}

describe("respostas Markdown", () => {
  it("serve uma página simples com os slugs e headers corretos", async () => {
    const getPage = vi.fn(() => page("Button", "/docs/button", "Conteúdo"));

    const response = await createMarkdownPageResponse(["button.md"], getPage);

    expect(getPage).toHaveBeenCalledWith(["button"]);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toBe("# Button (/docs/button)\n\nConteúdo");
  });

  it("resolve uma página Markdown aninhada", async () => {
    const getPage = vi.fn(() =>
      page("Instalação", "/docs/guides/install", "Ok"),
    );

    await createMarkdownPageResponse(["guides", "install.md"], getPage);

    expect(getPage).toHaveBeenCalledWith(["guides", "install"]);
  });

  it("retorna 404 Markdown quando a página não existe", async () => {
    const response = await createMarkdownPageResponse(
      ["missing.md"],
      () => undefined,
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toBe("Not found");
  });

  it("combina todas as páginas no documento completo", async () => {
    const response = await createLlmsFullResponse([
      page("Button", "/docs/button", "Primeiro"),
      page("Input", "/docs/input", "Segundo"),
    ]);

    expect(await response.text()).toBe(
      "# Button (/docs/button)\n\nPrimeiro\n\n# Input (/docs/input)\n\nSegundo",
    );
  });

  it("combina o guia e o índice no endpoint resumido", async () => {
    const response = createLlmsIndexResponse("# Guia", "- [Button](/button)");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toBe("# Guia\n- [Button](/button)\n");
  });
});
