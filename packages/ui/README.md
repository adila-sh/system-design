# @adila-sh/ui

Componentes React e estilos do design system da adila.co.

[Documentação e exemplos](https://ds.adila.co/docs) · [Pacote no npm](https://www.npmjs.com/package/@adila-sh/ui)

## Instalação

```bash
npm install @adila-sh/ui
# ou: bun add @adila-sh/ui
```

O pacote requer React e React DOM `^19.2.7` como dependências de projeto.

## Uso

Importe o CSS uma vez na entrada da aplicação e use os componentes:

```tsx
import "@adila-sh/ui/style.css";
import { Button } from "@adila-sh/ui";

export function App() {
  return <Button>Continuar</Button>;
}
```

O CSS dos componentes já é distribuído compilado; não é necessário configurar
Tailwind CSS para utilizá-los. A folha importa as fontes Adila hospedadas em
`assets.adila.co`.

Consulte a [documentação](https://ds.adila.co/docs) para conhecer os componentes,
suas propriedades e exemplos de uso.

## Licença

[MIT](./LICENSE).
