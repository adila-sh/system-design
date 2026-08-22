import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Bubble, BubbleContent } from "./bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./message";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Message",
  montar: () => (
    <MessageGroup>
      <Message align="start">
        <MessageAvatar>IA</MessageAvatar>
        <MessageContent>
          <MessageHeader>Assistente</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Como posso ajudar?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Mostre os resultados.</BubbleContent>
          </Bubble>
          <MessageFooter>agora</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Message", () => {
  test.each(["start", "end"] as const)(
    "expõe align=%s para o layout dos subcomponentes",
    async (align) => {
      const tela = await render(
        <Message align={align}>
          <MessageContent>Mensagem</MessageContent>
        </Message>,
      );

      expect(
        tela.container
          .querySelector('[data-slot="message"]')
          ?.getAttribute("data-align"),
      ).toBe(align);
    },
  );
});
