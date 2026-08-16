import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";

/**
 * O que um `Button` vira quando o `render` é um link.
 *
 * Antes da dedução de `nativeButton`, o Base UI mantinha a premissa de botão
 * nativo e colava `type="button"` numa âncora — atributo que não existe em `<a>`
 * — sem nenhum tratamento de teclado para o elemento não-nativo, e ainda
 * reclamava no console. Estes testes fixam o resultado correto.
 */
describe("Button renderizado como link", () => {
  test("não recebe type, que não é atributo de âncora", async () => {
    const tela = await render(
      <Button render={<a href="/planos" />}>Ver planos</Button>,
    );
    const ancora = tela.container.querySelector("a");

    expect(ancora).not.toBeNull();
    expect(ancora?.hasAttribute("type")).toBe(false);
  });

  test("mantém o href, então continua navegando", async () => {
    const tela = await render(
      <Button render={<a href="/planos" />}>Ver planos</Button>,
    );

    expect(tela.container.querySelector("a")?.getAttribute("href")).toBe(
      "/planos",
    );
  });

  /**
   * O Base UI aplica `role="button"` no modo não-nativo. É a contrapartida
   * consciente: o elemento se parece com um botão e ganha o acionamento por
   * Espaço que o link não tem. Quem quiser semântica de link num caso
   * específico passa `role="link"`, que vence por vir das props externas.
   */
  test("assume role de botão, coerente com a aparência e o teclado", async () => {
    const tela = await render(
      <Button render={<a href="/planos" />}>Ver planos</Button>,
    );

    expect(tela.container.querySelector("a")?.getAttribute("role")).toBe(
      "button",
    );
  });

  test("role explícito do consumidor vence a decisão do Base UI", async () => {
    const tela = await render(
      <Button render={<a href="/planos" role="link" />}>Ver planos</Button>,
    );

    expect(tela.container.querySelector("a")?.getAttribute("role")).toBe(
      "link",
    );
  });

  test("botão comum segue nativo, com type e sem role", async () => {
    const tela = await render(<Button>Salvar</Button>);
    const botao = tela.container.querySelector("button");

    expect(botao?.getAttribute("type")).toBe("button");
    expect(botao?.hasAttribute("role")).toBe(false);
  });
});
