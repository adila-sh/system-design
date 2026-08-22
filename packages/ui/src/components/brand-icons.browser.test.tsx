import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { GitHubBrandIcon, GoogleBrandIcon } from "./brand-icons";

describe("BrandIcons", () => {
  test("preserva as quatro cores oficiais do Google", async () => {
    const tela = await render(<GoogleBrandIcon aria-label="Google" />);
    const icon = tela.getByLabelText("Google").element();
    const fills = [...icon.querySelectorAll("path")].map((path) =>
      path.getAttribute("fill"),
    );

    expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(fills).toEqual(["#4285F4", "#34A853", "#FBBC05", "#EA4335"]);
  });

  test("faz a marca do GitHub herdar a cor do contexto", async () => {
    const tela = await render(<GitHubBrandIcon aria-label="GitHub" />);
    const icon = tela.getByLabelText("GitHub").element();

    expect(icon.getAttribute("fill")).toBe("currentColor");
    expect(icon.querySelectorAll("path")).toHaveLength(1);
  });
});
