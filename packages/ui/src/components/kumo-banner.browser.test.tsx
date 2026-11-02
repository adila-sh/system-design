import { descreverContrasteDosTextos } from "../../test/textos";
import { KumoBanner } from "./kumo-banner";

for (const variant of ["default", "alert", "error", "secondary"] as const) {
  descreverContrasteDosTextos({
    nome: `KumoBanner ${variant}`,
    montar: () => (
      <KumoBanner
        variant={variant}
        title="Aviso"
        description="Confira os dados."
      />
    ),
  });
}
