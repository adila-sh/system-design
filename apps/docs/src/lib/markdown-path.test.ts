import { describe, expect, it } from "vitest";
import { markdownPathToSlugs, slugsToMarkdownPath } from "./markdown-path";

describe("markdownPathToSlugs", () => {
  it.each([
    { path: [], slugs: [] },
    { path: ["index.md"], slugs: [] },
    { path: ["button.md"], slugs: ["button"] },
    {
      path: ["guides", "installation.md"],
      slugs: ["guides", "installation"],
    },
  ])("converte $path", ({ path, slugs }) => {
    expect(markdownPathToSlugs(path)).toEqual(slugs);
  });

  it("não altera os segmentos recebidos", () => {
    const path = ["guides", "installation.md"];

    markdownPathToSlugs(path);

    expect(path).toEqual(["guides", "installation.md"]);
  });
});

describe("slugsToMarkdownPath", () => {
  it.each([
    { slugs: [], segments: ["index.md"], url: "/docs/index.md" },
    { slugs: ["button"], segments: ["button.md"], url: "/docs/button.md" },
    {
      slugs: ["guides", "installation"],
      segments: ["guides", "installation.md"],
      url: "/docs/guides/installation.md",
    },
  ])("converte $slugs", ({ slugs, segments, url }) => {
    expect(slugsToMarkdownPath(slugs)).toEqual({ segments, url });
  });
});
