import { useState } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoPagination } from "./kumo-pagination";

function Paginas() {
  const [page, setPage] = useState(1);
  return (
    <KumoPagination
      page={page}
      setPage={setPage}
      perPage={10}
      totalCount={30}
      labels={{ nextPage: "Próxima página" }}
    >
      <KumoPagination.Info>
        {({ page }) => `Página ${page}`}
      </KumoPagination.Info>
      <KumoPagination.Controls controls="simple" />
    </KumoPagination>
  );
}
test("avança a página", async () => {
  const tela = await render(<Paginas />);
  await tela.getByRole("button", { name: "Próxima página" }).click();
  await expect.element(tela.getByText("Página 2")).toBeVisible();
});
