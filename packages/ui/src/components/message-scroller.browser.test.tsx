import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "./message-scroller";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function Exemplo() {
  return (
    <div className="h-40 w-64">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <MessageScrollerItem messageId="primeira">
                Primeira mensagem
              </MessageScrollerItem>
              <MessageScrollerItem messageId="ultima" scrollAnchor>
                Última mensagem
              </MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}

descreverContrasteDosTextos({
  nome: "MessageScroller",
  montar: () => <Exemplo />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("MessageScroller", () => {
  test("expõe região, log, mensagens e âncora", async () => {
    const tela = await render(<Exemplo />);
    const viewport = tela.getByRole("region", { name: "Messages" }).element();
    const log = tela.getByRole("log").element();
    const itens = tela.container.querySelectorAll(
      '[data-slot="message-scroller-item"]',
    );

    expect(viewport.getAttribute("tabindex")).toBe("0");
    expect(log.getAttribute("aria-relevant")).toBe("additions");
    expect(itens).toHaveLength(2);
    expect(itens[0]?.getAttribute("data-message-id")).toBe("primeira");
    expect(itens[1]?.getAttribute("data-scroll-anchor")).toBe("true");
  });

  test("configura o botão para o fim da conversa", async () => {
    const tela = await render(<Exemplo />);
    const botao = tela.container.querySelector(
      '[data-slot="message-scroller-button"]',
    );

    expect(botao?.getAttribute("data-direction")).toBe("end");
    expect(botao?.textContent).toContain("Scroll to end");
  });
});
