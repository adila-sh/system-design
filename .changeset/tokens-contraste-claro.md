---
"@adila-sh/ui": patch
---

Ajusta `--destructive`, `--success` e `--muted-foreground` no tema claro para
atingir o mínimo AA de texto (4.5:1).

Só a luminosidade muda; matiz e croma seguem idênticos, então a identidade da
paleta é preservada — o vermelho e o verde ficam mais profundos, não diferentes.

- `--destructive`: L 0.5915 → 0.49
- `--success`: L 0.5385 → 0.50
- `--muted-foreground`: L 0.551 → 0.545

Corrige 12 combinações que estavam abaixo do mínimo em Button, Badge, Alert,
Status, DeploymentStatus e ApiRequestMethod. O foreground branco sobre o
preenchimento sólido continua passando, porque as cores ficaram mais escuras.

O tema escuro **não** muda: lá não existe luminosidade que satisfaça ao mesmo
tempo o texto colorido sobre a própria tinta e o branco sobre o preenchimento
sólido. Resolver aquele lado exige decisão de design, não ajuste de token.
