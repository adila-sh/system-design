import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  Terminal,
  TerminalBody,
  TerminalCommand,
  TerminalControls,
  TerminalHeader,
  TerminalLine,
  TerminalOutput,
  TerminalPrompt,
  TerminalTitle,
} from "./terminal";
import { descreverContrasteDosTextos, soGlifos } from "../../test/textos";

// O tema de código é fixo. Title e Output usam --code-muted, que mede 2.76:1
// contra --code-bg nos dois temas e permanece registrado como catraca.
const ABAIXO_DO_MINIMO = new Map([
  ["light/Terminal local", 2.76],
  ["light/Testes concluídos", 2.76],
  ["dark/Terminal local", 2.76],
  ["dark/Testes concluídos", 2.76],
]);

descreverContrasteDosTextos({
  nome: "Terminal",
  montar: () => (
    <Terminal>
      <TerminalHeader>
        <TerminalControls />
        <TerminalTitle>Terminal local</TerminalTitle>
      </TerminalHeader>
      <TerminalBody>
        <TerminalLine>
          <TerminalPrompt>$</TerminalPrompt>
          <TerminalCommand>bun test</TerminalCommand>
        </TerminalLine>
        <TerminalOutput>Testes concluídos</TerminalOutput>
      </TerminalBody>
    </Terminal>
  ),
  comoGrafico: soGlifos,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Terminal semântico", () => {
  test("mantém prompt e controles decorativos fora da árvore acessível", async () => {
    const tela = await render(
      <Terminal>
        <TerminalHeader>
          <TerminalControls />
        </TerminalHeader>
        <TerminalBody>
          <TerminalLine>
            <TerminalPrompt>$</TerminalPrompt>
            <TerminalCommand>bun test</TerminalCommand>
          </TerminalLine>
        </TerminalBody>
      </Terminal>,
    );

    expect(
      tela.container
        .querySelector('[data-slot="terminal-controls"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(
      tela.container
        .querySelector('[data-slot="terminal-prompt"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(tela.container.querySelector("code")?.textContent).toBe("bun test");
  });
});
