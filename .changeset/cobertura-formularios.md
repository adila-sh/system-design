---
"@adila-sh/ui": patch
---

Nada muda em runtime: este changeset existe só para registrar que a suíte de
contraste passou a cobrir os campos de formulário, incluindo o placeholder — que
é pseudo-elemento e escapava da varredura de textos.

Ficou registrado, sem correção, que a borda de `--input` mede 1.23:1 no tema
claro e 1.56:1 no escuro contra o mínimo de 3:1 da WCAG 1.4.11. Corrigir passa
por escurecer o token, o que muda a borda de todo campo do sistema.
