---
"@adila-sh/ui": patch
---

Corrige o contraste de `--destructive` e `--success` usados como texto direto
sobre o fundo da página, sem tinta atrás.

Nos valores de preenchimento eles ficavam em 4.36 e 4.33 no tema claro, logo
abaixo do mínimo AA. Em vez de escurecer os tokens base outra vez — o que
arrastaria também o preenchimento sólido —, quem desce é o
`--{destructive,success}-tint-foreground`, que existe justamente para guardar "a
cor legível como texto".

`StatTrend` e `FieldError` passam a apontar para esses tokens. A mudança visual é
imperceptível: a maior diferença medida foi de 16 em 765 num único pixel.
