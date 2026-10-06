import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { luminosidade } from "../../test/paleta";

import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

const SUPERFICIES = ["background", "sidebar", "card", "popover"] as const;

describe("Hierarquia semântica de superfícies", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o tema escuro forma uma escada perceptível até o plano flutuante", async () => {
    document.documentElement.classList.add("dark");
    await render(<div />);

    const estilos = getComputedStyle(document.documentElement);
    const niveis = SUPERFICIES.map((token) =>
      luminosidade(estilos.getPropertyValue(`--${token}`).trim()),
    );

    for (let i = 1; i < niveis.length; i++) {
      expect(
        niveis[i] - niveis[i - 1],
        `${SUPERFICIES[i]} não se separa de ${SUPERFICIES[i - 1]}`,
      ).toBeGreaterThanOrEqual(0.025);
    }
    expect(niveis.at(-1)! - niveis[0]).toBeGreaterThanOrEqual(0.12);
  });
});

// Uma composição mantém alinhamento e hierarquia ao trocar o tema ou a densidade.
describe.each(["light", "dark"] as const)(
  "Geometria do sistema no tema %s",
  (tema) => {
    afterEach(() => document.documentElement.classList.remove("dark"));

    test("alinha campos e ações e separa o raio do painel do raio dos controles", async () => {
      document.documentElement.classList.toggle("dark", tema === "dark");
      const tela = await render(
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent>
            <Input aria-label="Nome" />
            <Button>Salvar</Button>
            <Select defaultValue="email">
              <SelectTrigger aria-label="Canal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="email">Email</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Perfil</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">Preferências do perfil</TabsContent>
            </Tabs>
          </CardContent>
        </Card>,
      );
      const controles = ["input", "button", "select-trigger", "tabs-list"].map(
        (slot) =>
          tela.container.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!,
      );
      const alturas = controles.map((el) => el.getBoundingClientRect().height);
      expect(new Set(alturas).size).toBe(1);
      expect(alturas[0]).toBeGreaterThanOrEqual(40);
      const campo = getComputedStyle(controles[0]);
      const painel = getComputedStyle(
        tela.container.querySelector('[data-slot="card"]')!,
      );
      expect(parseFloat(campo.borderRadius)).toBeGreaterThanOrEqual(8);
      expect(parseFloat(painel.borderRadius)).toBeGreaterThan(
        parseFloat(campo.borderRadius),
      );
      expect(
        parseFloat(
          getComputedStyle(
            tela.container.querySelector('[data-slot="card-content"]')!,
          ).paddingLeft,
        ),
      ).toBeGreaterThanOrEqual(24);
    });
  },
);
