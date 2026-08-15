---
"@adila-sh/ui": minor
---

DatePicker aceita `id` e `showToday`.

`id` é repassado ao botão do gatilho, permitindo que um `<Label htmlFor>` rotule
o campo — antes quem consumia precisava recorrer a `aria-labelledby` num wrapper.

`showToday` acrescenta um atalho para a data de hoje no rodapé do calendário,
desabilitado quando hoje cai fora de `fromDate`/`toDate`.
