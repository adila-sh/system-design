import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Símbolo vetorial azul no tema claro e branco no escuro.
      // Decorativo ao lado do texto → alt vazio.
      title: (
        <>
          <img
            src="/brand/adila.svg"
            alt=""
            width={20}
            height={20}
            className="dark:hidden"
          />
          <img
            src="/brand/adila-light.svg"
            alt=""
            width={20}
            height={20}
            className="hidden dark:block"
          />
          {appName}
        </>
      ),
    },
    links: [
      {
        text: "Showcase",
        url: "/showcase",
        active: "url",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
