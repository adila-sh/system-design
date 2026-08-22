# Instrucoes para agentes

## Testes do `@adila-sh/ui`

Antes de criar, alterar ou diagnosticar testes em `packages/ui`, leia o guia
canônico em [`.agents/skills/test-adila-ui/SKILL.md`](.agents/skills/test-adila-ui/SKILL.md).
Ele documenta os helpers, isolamento, concorrência, cobertura e critérios de
qualidade da suíte.

Escolha o ambiente pelo contrato observado:

- `*.test.ts`: lógica pura que roda em Node, sem DOM, CSS ou APIs do browser.
- `*.browser.test.tsx`: renderização React, CSS computado, acessibilidade,
  interação, foco, teclado, layout ou portals no Chromium real.
- Amplie um teste parametrizado existente quando o mesmo contrato só ganha uma
  variante ou tema; não crie outra suite para repetir a mesma estrutura.

Exemplos de execução direcionada, a partir de `packages/ui`:

```bash
bunx vitest run src/components/button.browser.test.tsx
bunx vitest run src/lib/native-button.test.ts
```

Antes de concluir uma mudança de teste ou infraestrutura de testes:

```bash
bun run test
bun run test:coverage
bun run typecheck
```

Se testes forem adicionados ou removidos, atualize o manifesto das docs a
partir da raiz com `bun run test:status`. Verifique a formatação dos arquivos
alterados com `bunx oxfmt --check <arquivos>`.
