import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Cada logo já embute o próprio fundo, então alternamos por visibilidade
      // em vez de filtro. Decorativo ao lado do texto → alt vazio.
      title: (
        <>
          <img
            src="/logo-light-40.png"
            alt=""
            width={20}
            height={20}
            className="rounded-[4px] dark:hidden"
          />
          <img
            src="/logo-dark-40.png"
            alt=""
            width={20}
            height={20}
            className="hidden rounded-[4px] dark:block"
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
