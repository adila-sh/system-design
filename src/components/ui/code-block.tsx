import * as React from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

type TokenKind =
  | "comment"
  | "function"
  | "keyword"
  | "number"
  | "plain"
  | "string"
  | "tag";

type Token = { kind: TokenKind; value: string };

const javascriptPattern = new RegExp(
  [
    "(?<comment>\\/\\/.*|\\/\\*.*?\\*\\/)",
    "(?<string>`(?:\\\\.|[^`])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')",
    "(?<keyword>\\b(?:as|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|null|of|private|protected|public|return|satisfies|static|super|switch|this|throw|true|try|type|typeof|undefined|var|void|while|with|yield)\\b)",
    "(?<number>\\b(?:0[xob][\\da-f]+|\\d+(?:\\.\\d+)?)\\b)",
    "(?<function>\\b[A-Za-z_$][\\w$]*(?=\\s*\\())",
  ].join("|"),
  "gi",
);

const jsonPattern = new RegExp(
  [
    '(?<string>"(?:\\\\.|[^"\\\\])*")',
    "(?<keyword>\\b(?:false|null|true)\\b)",
    "(?<number>-?\\b\\d+(?:\\.\\d+)?(?:e[+-]?\\d+)?\\b)",
  ].join("|"),
  "gi",
);

const shellPattern = new RegExp(
  [
    "(?<comment>#.*)",
    "(?<string>\"(?:\\\\.|[^\"\\\\])*\"|'(?:[^'])*')",
    "(?<keyword>\\b(?:case|do|done|elif|else|esac|export|fi|for|function|if|in|local|then|until|while)\\b)",
    "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
    "(?<function>\\$[A-Za-z_][\\w]*|--?[a-z][\\w-]*)",
  ].join("|"),
  "gi",
);

const cssPattern = new RegExp(
  [
    "(?<comment>\\/\\*.*?\\*\\/)",
    "(?<string>\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')",
    "(?<keyword>@[a-z-]+|!important)",
    "(?<number>#[\\da-f]{3,8}\\b|-?\\d+(?:\\.\\d+)?(?:%|px|rem|em|vh|vw|s|ms|deg)?)",
    "(?<function>--[a-z][\\w-]*|[a-z-]+(?=\\s*:))",
  ].join("|"),
  "gi",
);

const markupPattern = new RegExp(
  [
    "(?<comment><!--.*?-->)",
    "(?<string>\"[^\"]*\"|'[^']*')",
    "(?<tag><\\/?[A-Za-z][^>]*>)",
  ].join("|"),
  "gi",
);

function patternFor(language: string) {
  const normalized = language.toLowerCase();
  if (["html", "markup", "mdx", "svg", "xml"].includes(normalized)) {
    return markupPattern;
  }
  if (["bash", "shell", "sh", "zsh"].includes(normalized)) return shellPattern;
  if (normalized === "css") return cssPattern;
  if (normalized === "json" || normalized === "jsonc") return jsonPattern;
  return javascriptPattern;
}

function tokenize(line: string, language: string): Token[] {
  const pattern = patternFor(language);
  pattern.lastIndex = 0;
  const tokens: Token[] = [];
  let cursor = 0;
  let match = pattern.exec(line);

  while (match) {
    if (match.index > cursor) {
      tokens.push({ kind: "plain", value: line.slice(cursor, match.index) });
    }
    const kind = Object.entries(match.groups ?? {}).find(
      ([, value]) => value,
    )?.[0];
    tokens.push({
      kind: (kind as TokenKind | undefined) ?? "plain",
      value: match[0],
    });
    cursor = match.index + match[0].length;
    match = pattern.exec(line);
  }

  if (cursor < line.length) {
    tokens.push({ kind: "plain", value: line.slice(cursor) });
  }
  return tokens;
}

type CodeBlockProps = Omit<React.ComponentProps<"figure">, "children"> & {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  codeClassName?: string;
  hideHeader?: boolean;
};

function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  hideHeader = false,
  className,
  codeClassName,
  ...props
}: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");
  const highlighted = new Set(highlightLines);

  return (
    <figure
      data-slot="code-block"
      className={cn(
        "relative overflow-hidden rounded-lg border border-[var(--code-border,#292e42)] bg-[var(--code-bg,#1a1b26)] text-[var(--code-fg,#c0caf5)] shadow-sm transition-colors",
        className,
      )}
      {...props}
    >
      {!hideHeader ? (
        <figcaption className="flex min-h-10 items-center gap-3 border-b border-[var(--code-border,#292e42)] px-3">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-[var(--code-muted,#565f89)]">
            {filename ?? language}
          </span>
          {filename ? (
            <span className="font-mono text-[10px] tracking-wide text-[var(--code-muted,#565f89)] uppercase">
              {language}
            </span>
          ) : null}
          <CopyButton
            value={code}
            variant="ghost"
            size="icon-xs"
            aria-label="Copiar código"
            className="text-[var(--code-muted,#565f89)] hover:bg-[var(--code-selection,#283457)] hover:text-[var(--code-fg,#c0caf5)]"
          />
        </figcaption>
      ) : (
        <CopyButton
          value={code}
          variant="ghost"
          size="icon-xs"
          aria-label="Copiar código"
          className="absolute top-2 right-2 z-10 text-[var(--code-muted,#565f89)] hover:bg-[var(--code-selection,#283457)] hover:text-[var(--code-fg,#c0caf5)]"
        />
      )}
      <pre
        tabIndex={0}
        className={cn(
          "overflow-x-auto py-4 text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          codeClassName,
        )}
      >
        <code data-language={language}>
          {lines.map((line, index) => {
            const number = index + 1;
            return (
              <span
                key={number}
                data-slot="code-block-line"
                data-highlighted={highlighted.has(number) || undefined}
                className="flex min-w-max px-4 data-[highlighted=true]:bg-[var(--code-selection,#283457)] data-[highlighted=true]:shadow-[inset_2px_0_0_var(--code-accent,#7aa2f7)]"
              >
                {showLineNumbers ? (
                  <span
                    aria-hidden="true"
                    className="mr-4 w-[2ch] shrink-0 text-right text-[var(--code-muted,#565f89)] select-none"
                  >
                    {number}
                  </span>
                ) : null}
                <span className="whitespace-pre">
                  {tokenize(line, language).map((token, tokenIndex) => (
                    <span
                      key={`${number}-${tokenIndex}`}
                      data-token={token.kind}
                      className={cn(
                        token.kind === "comment" &&
                          "text-[var(--code-comment,#565f89)] italic",
                        token.kind === "function" &&
                          "text-[var(--code-function,#7aa2f7)]",
                        token.kind === "keyword" &&
                          "text-[var(--code-keyword,#bb9af7)]",
                        token.kind === "number" &&
                          "text-[var(--code-number,#ff9e64)]",
                        token.kind === "string" &&
                          "text-[var(--code-string,#9ece6a)]",
                        token.kind === "tag" &&
                          "text-[var(--code-success,#9ece6a)]",
                      )}
                    >
                      {token.value}
                    </span>
                  ))}
                  {line.length === 0 ? "\n" : null}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

export { CodeBlock, type CodeBlockProps };
