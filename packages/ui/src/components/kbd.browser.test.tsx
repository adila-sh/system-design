import { Kbd, KbdGroup } from "./kbd";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Atalhos combinam texto pequeno com muted-foreground sobre muted, um par que
// precisa ser medido já composto em vez de inferido apenas pelos tokens.
descreverContrasteDosTextos({
  nome: "Kbd",
  montar: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
