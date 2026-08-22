import type { ComponentProps, ReactElement } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  ChartContainer,
  ChartLegendContent,
  ChartStyle,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { MINIMO, razao, sobre, toRGBA } from "../../test/contrast";
import {
  CROMA_MINIMO,
  SEPARACAO_ALVO,
  croma,
  luminosidade,
  separacaoCvd,
} from "../../test/paleta";
import { TEMAS } from "../../test/variantes";

/**
 * A paleta de gráfico é o único lugar do pacote onde contraste contra o fundo
 * não é o critério principal. Num gráfico o leitor precisa distinguir uma SÉRIE
 * DA OUTRA, e é aí que a coisa quebra para quem tem daltonismo: duas cores com
 * ótimo contraste contra o branco podem colapsar entre si sob deuteranopia.
 *
 * Os limites vêm da prática de visualização de dados: separação de ΔE 8 (OKLab
 * ×100) entre séries adjacentes sob visão simulada, croma mínimo para a série
 * não ler como "sem dado", e a banda de luminosidade em que a paleta foi
 * pensada — mais estreita no escuro, onde sobra menos espaço.
 */
const BANDA_L = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;

const SERIES = [1, 2, 3, 4, 5] as const;

const CONFIG = {
  receita: { label: "Receita", color: "#4f46e5" },
  pedidos: {
    label: "Pedidos",
    theme: { light: "#2563eb", dark: "#60a5fa" },
  },
} satisfies ChartConfig;

const PAYLOAD = [
  {
    graphicalItemId: "receita",
    dataKey: "receita",
    name: "receita",
    value: 1234,
    color: "#4f46e5",
    payload: { fill: "#4338ca", chave: "receita" },
  },
];

async function renderNoContexto(conteudo: ReactElement) {
  return render(
    <ChartContainer
      config={CONFIG}
      initialDimension={{ width: 320, height: 200 }}
    >
      {conteudo}
    </ChartContainer>,
  );
}

function lerPaleta() {
  const cs = getComputedStyle(document.documentElement);
  return {
    series: SERIES.map((i) => cs.getPropertyValue(`--chart-${i}`).trim()),
    fundo: cs.getPropertyValue("--background").trim(),
  };
}

describe.each(TEMAS)("Paleta de gráfico no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("séries adjacentes se distinguem sob daltonismo", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();

    const ruins: string[] = [];
    for (let i = 0; i < series.length - 1; i++) {
      const separacao = separacaoCvd(series[i], series[i + 1]);
      if (separacao < SEPARACAO_ALVO) {
        ruins.push(`${i + 1}↔${i + 2} ΔE ${separacao.toFixed(1)}`);
      }
    }
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("nenhuma série lê como cinza", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const c = croma(cor);
      if (c < CROMA_MINIMO) ruins.push(`chart-${i + 1} croma ${c.toFixed(3)}`);
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("as séries ficam na banda de luminosidade do tema", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();
    const [min, max] = BANDA_L[tema];

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const l = luminosidade(cor);
      if (l < min || l > max) {
        ruins.push(`chart-${i + 1} L ${l.toFixed(3)} fora de ${min}–${max}`);
      }
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("as séries se destacam do fundo do gráfico", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series, fundo } = lerPaleta();
    const base = sobre(toRGBA(fundo), [255, 255, 255]);

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const contraste = razao(sobre(toRGBA(cor), base), base);
      if (contraste < MINIMO.naoTexto) {
        ruins.push(`chart-${i + 1} ${contraste.toFixed(2)}`);
      }
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });
});

describe("Runtime de Chart", () => {
  test("publica as cores simples e temáticas no escopo do gráfico", async () => {
    const tela = await render(
      <ChartContainer id="vendas" config={CONFIG}>
        <div />
      </ChartContainer>,
    );

    const raiz = tela.container.querySelector('[data-slot="chart"]');
    const css = tela.container.querySelector("style")?.textContent ?? "";

    expect(raiz?.getAttribute("data-chart")).toBe("chart-vendas");
    expect(css).toContain("[data-chart=chart-vendas]");
    expect(css).toContain("--color-receita: #4f46e5");
    expect(css).toContain("--color-pedidos: #2563eb");
    expect(css).toContain(".dark [data-chart=chart-vendas]");
    expect(css).toContain("--color-pedidos: #60a5fa");
  });

  test("não cria CSS quando a configuração não possui cores", async () => {
    const tela = await render(
      <ChartStyle id="sem-cor" config={{ vazio: {} }} />,
    );
    expect(tela.container.querySelector("style")).toBeNull();
  });

  test("não renderiza tooltip inativo ou sem payload", async () => {
    const inativo = await renderNoContexto(
      <ChartTooltipContent active={false} payload={PAYLOAD} />,
    );
    expect(
      inativo.container.querySelector('[data-slot="chart-tooltip-content"]'),
    ).toBeNull();

    const vazio = await renderNoContexto(
      <ChartTooltipContent active payload={[]} />,
    );
    expect(
      vazio.container.querySelector('[data-slot="chart-tooltip-content"]'),
    ).toBeNull();
  });

  test("resolve label, indicador e valor numérico pelo config", async () => {
    const tela = await renderNoContexto(
      <ChartTooltipContent active label="receita" payload={PAYLOAD} />,
    );

    expect(tela.container.textContent).toContain("Receita");
    expect(tela.container.textContent).toContain((1234).toLocaleString());

    const indicador = tela.container.querySelector(
      '[style*="--color-bg"]',
    ) as HTMLElement;
    expect(indicador.style.getPropertyValue("--color-bg")).toBe("#4338ca");
  });

  test.each([
    { indicator: "line" as const, width: "4px", borderStyle: "solid" },
    { indicator: "dashed" as const, width: "2px", borderStyle: "dashed" },
  ])(
    "aninha label no indicador $indicator e resolve o payload interno",
    async ({ indicator, width, borderStyle }) => {
      const tela = await renderNoContexto(
        <ChartTooltipContent
          active
          indicator={indicator}
          labelKey="chave"
          nameKey="chave"
          payload={PAYLOAD}
        />,
      );

      expect(tela.container.textContent).toContain("Receita");
      const marcador = tela.container.querySelector(
        '[data-slot="chart-tooltip-indicator"]',
      )!;
      const estilo = getComputedStyle(marcador);
      expect(estilo.width).toBe(width);
      expect(estilo.borderStyle).toBe(borderStyle);
    },
  );

  test("honra formatadores e omite séries ocultas", async () => {
    const formatarLabel = vi.fn(() => <strong>Período atual</strong>);
    const formatarValor = vi.fn(() => <output>Total customizado</output>);
    const payload = [
      ...PAYLOAD,
      { ...PAYLOAD[0], name: "oculto", type: "none" as const },
    ];

    const tela = await renderNoContexto(
      <ChartTooltipContent
        active
        label="receita"
        labelFormatter={formatarLabel}
        formatter={formatarValor}
        payload={payload}
      />,
    );

    expect(formatarLabel).toHaveBeenCalledOnce();
    expect(formatarValor).toHaveBeenCalledOnce();
    expect(tela.container.textContent).toContain("Período atual");
    expect(tela.container.textContent).toContain("Total customizado");
    expect(tela.container.textContent).not.toContain("oculto");
  });

  test("usa ícone configurado e permite esconder o indicador", async () => {
    function Icone() {
      return <svg aria-label="Ícone da série" />;
    }
    const config = { receita: { label: "Receita", icon: Icone } };

    const comIcone = await render(
      <ChartContainer config={config}>
        <ChartTooltipContent active payload={PAYLOAD} />
      </ChartContainer>,
    );
    expect(comIcone.getByLabelText("Ícone da série")).toBeInTheDocument();

    const semIndicador = await renderNoContexto(
      <ChartTooltipContent active hideIndicator payload={PAYLOAD} />,
    );
    expect(
      semIndicador.container.querySelector('[style*="--color-bg"]'),
    ).toBeNull();
  });

  test("renderiza legenda com ícone, fallback de cor e alinhamento", async () => {
    function Icone() {
      return <svg aria-label="Ícone da receita" />;
    }
    const config = {
      receita: { label: "Receita", icon: Icone },
      pedidos: { label: "Pedidos", color: "#2563eb" },
    } satisfies ChartConfig;
    const payload: ComponentProps<typeof ChartLegendContent>["payload"] = [
      { dataKey: "receita", value: "receita", color: "#4f46e5" },
      { dataKey: "pedidos", value: "pedidos", color: "#2563eb" },
      { dataKey: "oculto", value: "oculto", type: "none" },
    ];

    const tela = await render(
      <ChartContainer config={config}>
        <ChartLegendContent verticalAlign="top" payload={payload} />
      </ChartContainer>,
    );

    expect(tela.getByLabelText("Ícone da receita")).toBeInTheDocument();
    expect(tela.container.textContent).toContain("Receita");
    expect(tela.container.textContent).toContain("Pedidos");
    expect(tela.container.textContent).not.toContain("oculto");
    const legenda = tela.container.querySelector(
      '[data-slot="chart-legend-content"]',
    )!;
    expect(getComputedStyle(legenda).paddingBottom).toBe("12px");
    const marcador = tela.container.querySelector(
      '[style*="background-color"]',
    )!;
    expect(getComputedStyle(marcador).backgroundColor).toBe("rgb(37, 99, 235)");
  });

  test("legenda vazia não produz conteúdo", async () => {
    const tela = await renderNoContexto(<ChartLegendContent payload={[]} />);
    expect(
      tela.container.querySelector('[data-slot="chart-legend-content"]'),
    ).toBeNull();
  });
});
