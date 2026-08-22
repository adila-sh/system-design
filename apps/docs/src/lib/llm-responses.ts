import { markdownPathToSlugs } from "./markdown-path";

export type LLMPage = {
  url: string;
  data: {
    title: string;
    getText: (format: "processed") => Promise<string>;
  };
};

const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
};

export async function getLLMText(page: LLMPage) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}

export async function createMarkdownPageResponse(
  pathSegments: string[],
  getPage: (slugs: string[]) => LLMPage | undefined,
) {
  const page = getPage(markdownPathToSlugs(pathSegments));

  if (!page) {
    return new Response("Not found", {
      status: 404,
      headers: MARKDOWN_HEADERS,
    });
  }

  return new Response(await getLLMText(page), {
    headers: MARKDOWN_HEADERS,
  });
}

export async function createLlmsFullResponse(pages: LLMPage[]) {
  const body = await Promise.all(pages.map(getLLMText));

  return new Response(body.join("\n\n"), {
    headers: MARKDOWN_HEADERS,
  });
}

export function createLlmsIndexResponse(guide: string, index: string) {
  return new Response(`${guide}\n${index}\n`, {
    headers: MARKDOWN_HEADERS,
  });
}
