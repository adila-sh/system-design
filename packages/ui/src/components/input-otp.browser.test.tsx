import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploOTP({
  defaultValue = "1234",
  onComplete,
}: {
  defaultValue?: string;
  onComplete?: (value: string) => void;
}) {
  return (
    <InputOTP
      maxLength={4}
      defaultValue={defaultValue}
      aria-label="Código de verificação"
      onComplete={onComplete}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}

descreverContrasteDosTextos({
  nome: "InputOTP",
  montar: () => <ExemploOTP />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("InputOTP", () => {
  test("distribui o valor inicial pelos slots e expõe separador", async () => {
    const tela = await render(<ExemploOTP />);
    const slots = tela.container.querySelectorAll(
      '[data-slot="input-otp-slot"]',
    );

    expect(Array.from(slots, (slot) => slot.textContent).join("")).toBe("1234");
    expect(tela.getByRole("separator").element()).toBeVisible();
    expect(
      (
        tela
          .getByRole("textbox", { name: "Código de verificação" })
          .element() as HTMLInputElement
      ).spellcheck,
    ).toBe(false);
  });

  test("atualiza slots e informa o código completo", async () => {
    const aoCompletar = vi.fn();
    const tela = await render(
      <ExemploOTP defaultValue="" onComplete={aoCompletar} />,
    );
    const campo = tela.getByRole("textbox", { name: "Código de verificação" });

    await campo.fill("9876");

    expect(aoCompletar).toHaveBeenCalledWith("9876");
    expect(
      Array.from(
        tela.container.querySelectorAll('[data-slot="input-otp-slot"]'),
        (slot) => slot.textContent,
      ).join(""),
    ).toBe("9876");
  });
});
