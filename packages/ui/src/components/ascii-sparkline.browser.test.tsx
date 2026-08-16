import { AsciiGauge } from "./ascii-gauge";
import { AsciiHeatmap } from "./ascii-heatmap";
import { AsciiProgress } from "./ascii-progress";
import { AsciiSparkline } from "./ascii-sparkline";
import { AsciiTree } from "./ascii-tree";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
  soGlifos,
} from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Nos componentes ASCII o dado é desenhado com CARACTERE. Isso não os torna
// texto para efeito de contraste: `▇`, `⣿` e `░▒▓` desenham uma série, não uma
// frase, então valem o mínimo de GRÁFICO (3:1, WCAG 1.4.11).
//
// O critério é por alvo, não por componente: `soGlifos` separa o que desenha do
// que se lê, então os rótulos e números de cada montagem continuam cobrados em
// 4.5:1. É por isso que toda montagem aqui traz um label de verdade — sem ele, o
// bloco não exercitaria o lado de texto.
//
// A moldura (`╭──╮`) e o trilho vazio (braille em branco) ficam de fora: são
// contorno e fundo, e quem comunica o valor é a extensão do preenchimento.

descreverContrasteDosTextos({
  nome: "AsciiSparkline (alta)",
  montar: () => (
    <AsciiSparkline values={[3, 5, 4, 8, 9, 12, 14]} label="Receita" />
  ),
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

// Série em queda: é o caminho que pinta o resumo em destructive.
descreverContrasteDosTextos({
  nome: "AsciiSparkline (queda)",
  montar: () => (
    <AsciiSparkline values={[14, 12, 9, 8, 4, 5, 3]} label="Receita" />
  ),
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

descreverContrasteDosTextos({
  nome: "AsciiGauge",
  montar: () => <AsciiGauge value={72} max={100} label="Uso de CPU" />,
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

descreverContrasteDosTextos({
  nome: "AsciiProgress",
  montar: () => <AsciiProgress value={40} max={100} label="Importando" />,
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

/**
 * O heatmap é o único aqui que usa RAMPA: a célula codifica intensidade variando
 * a opacidade, de `░` a `█`. As células fracas medem entre 1.46 e 2.89 contra o
 * fundo, e isso é a codificação funcionando, não um defeito — numa escala
 * sequencial o passo baixo é fraco por definição, e quem dá a referência é a
 * legenda, não o contraste de cada célula.
 *
 * Por isso as células ficam de fora da asserção e o que continua medido é o
 * rótulo. Se um dia o heatmap ganhar valores em texto sobre as células, eles
 * entram como texto normal.
 */
descreverContrasteDosTextos({
  nome: "AsciiHeatmap",
  montar: () => (
    <AsciiHeatmap
      values={[
        [0, 2, 5, 9],
        [3, 7, 1, 8],
      ]}
      label="Atividade semanal"
    />
  ),
  comoGrafico: soGlifos,
  ignorar: (rotulo) => soDecoracaoAscii(rotulo) || soGlifos(rotulo),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

descreverContrasteDosTextos({
  nome: "AsciiTree",
  montar: () => (
    <AsciiTree
      label="Estrutura"
      nodes={[
        { label: "src", children: [{ label: "components" }, { label: "lib" }] },
      ]}
    />
  ),
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
