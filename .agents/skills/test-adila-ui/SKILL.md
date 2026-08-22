---
name: test-adila-ui
description: Create, refine, diagnose, or review tests for the Adila UI package with Vitest, React Browser Mode, Playwright, accessibility locators, computed CSS, contrast, themes, and component interactions. Use when work touches packages/ui test files, test helpers, Vitest configuration, test performance, or the test-status manifest.
---

# Test Adila UI

Produce the smallest test that proves the requested observable contract and fits the existing suite. Preserve unrelated workspace changes.

## Start from local evidence

Before changing tests:

1. Inspect the component, its nearest existing test, `packages/ui/vitest.config.ts`, and only the relevant helper under `packages/ui/test`.
2. Check `git status` because this repository is often edited concurrently.
3. If the request is only a diagnosis or review, report findings without modifying files.

Do not create a new helper until existing helpers and parameterized tests cannot express the behavior clearly.

## Choose the test environment

- Use `*.test.ts` for pure logic that does not need DOM layout, browser events, CSS resolution, canvas, or accessibility APIs. These run in the `unit` Node project.
- Use `*.browser.test.tsx` for React rendering, user interaction, portals, roles and accessible names, computed styles, themes, layout, or contrast. These run in real headless Chromium.
- Prefer extending the component test already present. Create another file only when it represents a distinct contract or keeps a large file coherent.

Do not replace a Browser Mode assertion with jsdom-style simulation when the contract depends on what the browser paints or exposes.

## Reuse the test vocabulary

Select only what the behavior needs:

- `test/variantes.ts`: use `descreverContrasteDeTexto` for one text-bearing target across variants and light/dark themes. Existing below-minimum entries are regression floors, not tolerances.
- `test/textos.ts`: use `descreverContrasteDosTextos` to inspect all visible text in a composite component. Pass `raiz` for content rendered through a portal; use `soGlifos` or `soDecoracaoAscii` only for their documented visual cases.
- `test/contrast.ts`: use the low-level computed-style functions for borders, fills, placeholders, and custom contrast assertions. They require Browser Mode.
- `test/paleta.ts`: use palette luminosity, chroma, and color-vision separation helpers for chart or series colors.
- `test/setup.ts`: owns real design-system CSS and per-test React cleanup. Do not duplicate that setup in test files.

Follow nearby naming and fixture patterns. Use `test.each` or `describe.each` when the same contract applies to a finite matrix of variants, sizes, orientations, or themes.

### Copyable helper patterns

For one text target across variants and both themes:

```tsx
import { descreverContrasteDeTexto } from "../../test/variantes";
import { Badge } from "./badge";

const VARIANTES = ["default", "secondary", "outline"] as const;

descreverContrasteDeTexto({
  nome: "Badge",
  variantes: VARIANTES,
  montar: (variant) => <Badge variant={variant}>Em revisão</Badge>,
  seletor: '[data-slot="badge"]',
});
```

For composite text inside an animated portal, open it in the fixture and point
`raiz` at the portalled content. The helper waits for it to reach full opacity:

```tsx
import { descreverContrasteDosTextos } from "../../test/textos";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

descreverContrasteDosTextos({
  nome: "Select",
  montar: () => (
    <Select defaultOpen defaultValue="pix">
      <SelectTrigger aria-label="Pagamento" />
      <SelectContent>
        <SelectItem value="pix">Pix</SelectItem>
      </SelectContent>
    </Select>
  ),
  raiz: '[data-slot="select-content"]',
});
```

For a single border, fill, or placeholder contract, render in a
`*.browser.test.tsx`, select the painted element, and assert the relevant
function from `test/contrast.ts` against `MINIMO.naoTexto` or `MINIMO.texto`.
Do not add a regression-floor map for a new failure; those maps only preserve
already accepted design findings.

## Assert user-visible contracts

- Query by role and accessible name when possible. Verify relevant state and relationships such as `aria-checked`, `aria-expanded`, `aria-current`, `aria-controls`, or label association.
- For interactions, assert both the initial state and the observable transition after `click`, keyboard input, focus, or blur.
- For styling contracts, inspect computed CSS, geometry, or the repository contrast helpers. A Tailwind class string alone does not prove what Chromium rendered.
- Scope queries to the render result unless a portal intentionally requires document-level access.
- Avoid snapshots for ordinary component behavior. Use focused assertions that make regressions explain themselves.
- Do not weaken a threshold, add a regression floor, skip a test, or add retries merely to make a failure green. First determine whether the implementation, fixture, or expectation is wrong.

## Preserve safe parallelism

Vitest already runs files in parallel. The browser project uses `isolate: false` to avoid rebuilding an iframe for every small file, while `test/setup.ts` explicitly cleans React roots before each test.

Do not enable `sequence.concurrent` globally. Do not mark a browser test or suite concurrent when it renders React or touches DOM, `document.documentElement`, portals, focus, timers, clipboard, mocks, or other shared browser state: `vitest-browser-react` cleanup and those resources are global within the file.

Use `{ concurrent: true }` or `test.concurrent` only when all of these are true:

- the test is asynchronous and spends meaningful time waiting;
- consecutive concurrent tests are independent;
- they do not render React or share mutable state;
- repeated execution demonstrates no flakiness.

Concurrent snapshots and asynchronous assertions must use `expect` from the local test context, as required by the Vitest API. Benchmark wall-clock time before keeping a concurrency change; synchronous tests gain nothing.

The safe shape is limited to independent asynchronous unit work:

```ts
test.concurrent.each(cases)("normalizes $name", async (entry, { expect }) => {
  const result = await normalizeAsync(entry.input);
  expect(result).toEqual(entry.output);
});
```

Do not copy that shape into a browser test that calls `render`, changes the
theme class, opens a portal, controls timers, or stubs globals.

If a new dependency is imported by browser setup code, predeclare it in `optimizeDeps.include`. A Vite dependency reload during a test invalidates the run.

## Run proportionate validation

Work from `packages/ui` for targeted commands:

```bash
bunx vitest run src/components/<component>.browser.test.tsx
bunx vitest run src/lib/<module>.test.ts
```

For a fast feedback loop across dependency edges, prefer:

```bash
bun run test:changed
bun run test:related src/<changed-module>.ts
```

`test:related` follows transitive imports, so it can intentionally select many
component tests. Use the file-specific command when only one test contract needs
validation. Vitest automatically clears and restores mocks, stubbed globals, and
stubbed environment variables between tests; still clean up non-Vitest external
side effects explicitly.

After a test or test-infrastructure change, run:

```bash
bun run test
bun run test:coverage
bun run typecheck
```

Coverage has repository baselines enforced by Vitest. Do not lower them to land
a change. Use `bun run test:shuffle` when diagnosing state or order dependence;
record the printed seed so a failure can be reproduced with
`--sequence.seed=<seed>`.

Run the repository formatter check for changed files. When tests are added or removed, regenerate the versioned docs manifest from the repository root:

```bash
bun run test:status
```

Before concluding, distinguish failures caused by the requested change from pre-existing or concurrent workspace changes. Report exact passed file/test counts, relevant warnings, and any validation that could not be completed.
