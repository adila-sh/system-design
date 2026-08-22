import { docsRoute } from "./shared";

export function markdownPathToSlugs(segments: string[]) {
  if (segments.length === 0) return [];

  const slugs = [...segments];
  slugs[slugs.length - 1] = slugs[slugs.length - 1].replace(/\.md$/, "");
  if (slugs.length === 1 && slugs[0] === "index") slugs.pop();
  return slugs;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join("/")}`,
  };
}
