import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploCarousel({
  orientation = "horizontal",
  setApi,
}: {
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}) {
  return (
    <Carousel
      aria-label="Destaques"
      className="h-64 w-64"
      orientation={orientation}
      setApi={setApi}
    >
      <CarouselContent>
        {["Módulo", "Registry", "DNA"].map((slide) => (
          <CarouselItem key={slide}>{slide}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

descreverContrasteDosTextos({
  nome: "Carousel",
  montar: () => <ExemploCarousel />,
  ignorar: (rotulo) => rotulo.endsWith("slide"),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Carousel", () => {
  test("expõe região e slides com descrições acessíveis", async () => {
    const tela = await render(<ExemploCarousel />);
    const carrossel = tela.getByRole("region", { name: "Destaques" }).element();
    const slides = tela.getByRole("group").all();

    expect(carrossel.getAttribute("aria-roledescription")).toBe("carousel");
    expect(slides).toHaveLength(3);
    for (const slide of slides) {
      expect(slide.element().getAttribute("aria-roledescription")).toBe(
        "slide",
      );
    }
    await expect
      .element(tela.getByRole("button", { name: "Previous slide" }))
      .toBeDisabled();
  });

  test("navega para o próximo slide e atualiza os controles", async () => {
    const definirApi = vi.fn();
    const tela = await render(<ExemploCarousel setApi={definirApi} />);
    const proximo = tela.getByRole("button", { name: "Next slide" });

    await expect.element(proximo).toBeEnabled();
    await proximo.click();

    const api = definirApi.mock.calls.at(-1)?.[0] as CarouselApi;
    if (!api) throw new Error("API do Carousel não foi inicializada");
    expect(api.selectedScrollSnap()).toBe(1);
    await expect
      .element(tela.getByRole("button", { name: "Previous slide" }))
      .toBeEnabled();
  });

  test.each([
    ["horizontal", "row", "16px", "0px"],
    ["vertical", "column", "0px", "16px"],
  ] as const)(
    "orientation=%s organiza conteúdo e espaçamento",
    async (orientation, direction, paddingLeft, paddingTop) => {
      const tela = await render(<ExemploCarousel orientation={orientation} />);
      const faixa = tela.container.querySelector(
        '[data-slot="carousel-content"] > div',
      )!;
      const item = tela.container.querySelector('[data-slot="carousel-item"]')!;

      expect(getComputedStyle(faixa).flexDirection).toBe(direction);
      expect(getComputedStyle(item).paddingLeft).toBe(paddingLeft);
      expect(getComputedStyle(item).paddingTop).toBe(paddingTop);
    },
  );
});
