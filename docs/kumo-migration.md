# Migração dos componentes para Kumo

O pacote mantém as APIs históricas para permitir adoção por fluxo. Os exports com prefixo `Kumo` usam os componentes upstream e os tokens Adila; a presença de um export novo não significa que todos os consumidores antigos foram migrados.

| API existente | API compartilhada sobre Kumo | Adaptação do consumidor |
| --- | --- | --- |
| `Button` | `Button` | O botão nativo usa Kumo. Renderização personalizada e recursos específicos de Base UI mantêm compatibilidade. |
| Botão com link | `KumoLinkButton` | Usar `href`, `external` e `disabled`; `render` não faz parte desta API. |
| `Input` | `KumoInput` | Pode incluir label, descrição, erro, ícone e ação de limpeza. |
| `Textarea` | `Textarea` | Implementação migrada, preservando props HTML, ref e formulário. |
| Dialog composto | `KumoDialog` | Root, Trigger, Title, Description e Close; o próprio `KumoDialog` é o conteúdo. |
| Popover composto | `KumoPopover` | Preferir Portal, Positioner e Popup; Title e Description preservam as associações. |
| Tooltip composto | `KumoTooltip` e `KumoTooltipProvider` | Usar `content` e `render` ou children. O adaptador associa a descrição ao gatilho. |
| `Badge` | `KumoBadge` | Variantes semânticas e variantes de cor; não aceita o `render` da API histórica. |
| `Field` | `KumoField` | Label, descrição e erro são props. Usar controles Kumo para compartilhar o contexto do campo. |
| Alert/aviso | `KumoBanner` | Título, descrição e ação são slots da API Kumo. |
| Select composto | `KumoSelect` | Usar `items` ou `renderValue` para apresentar rótulos, evitando exibir códigos internos. |
| Tabela | `KumoTable` | Cabeçalho usa scope col por padrão; permite substituição explícita. |
| Paginação | `KumoPagination` | Page, setPage e controles compostos; labels permitem tradução. |
| Estado vazio | `KumoEmpty` | Título, descrição, ilustração e ação continuam sendo decisões do produto. |
| `Switch` | `KumoSwitch` | A API controlada usa checked e onCheckedChange; mantém a geometria redonda do Pay. |
| `Checkbox` | `KumoCheckbox` | Suporta rótulo, estado misto, seleção controlada e grupos. |
| Tabs compostas | `KumoTabs` | Usa array de tabs, value/selectedValue e onValueChange; não é uma troca direta das APIs compostas. |

## Verificação por lote

Verificar comportamento, teclado, foco, associações acessíveis, contraste em light/dark, formulários e portais. Preservar APIs legadas quando o contrato ainda não puder ser adaptado. Não enfraquecer os critérios de contraste para acomodar a migração.

O pacote inclui CSS compilado e o tema Adila. Consumidores devem usar os estilos de `@adila-sh/ui`, sem importar diretamente estilos ou componentes de `@cloudflare/kumo`. A biblioteca continua responsável pela dependência Kumo.

Cada consumidor precisa instalar uma versão publicada que contenha os novos exports. Commit na main e changeset não comprovam publicação no registry.
