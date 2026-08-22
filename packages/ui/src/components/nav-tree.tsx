import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";

import { cn } from "@/lib/utils";

/**
 * O desenho de navegação em árvore, na forma de classes cruas.
 *
 * A `Sidebar` consome tudo daqui — `SidebarMenuSub variant="tree"` e
 * `activeIndicator="gradient"` montam estas mesmas classes — então o desenho
 * mora num lugar só. O que justifica exportá-las é o caso de fora: um menu
 * dentro de `Drawer` ou `Sheet` não pode usar os componentes de `Sidebar`,
 * porque `useSidebar` lança fora do `SidebarProvider`. Aplicando estas classes
 * a elementos próprios, a navegação do mobile fica idêntica à do desktop.
 *
 * O estado ativo é lido do DOM, via `has-data-active` e `last`, em vez de vir
 * por prop. Isso mantém a mesma string servindo aos dois casos: quem monta à
 * mão só precisa marcar o link ativo com `data-active`, exatamente como os
 * componentes de `Sidebar` já fazem sozinhos.
 */

/**
 * Trilho vertical do grupo. Recua nas pontas para a linha não encostar no
 * primeiro e no último conector, o que deixa a árvore com começo e fim visíveis
 * em vez de parecer cortada.
 */
export const navTreeRail =
  "relative before:absolute before:top-5 before:bottom-5 before:left-2 before:w-0.5 before:rounded-full before:bg-sidebar-border before:content-['']";

/**
 * Conector horizontal de um item, mais o segmento vertical que acende quando
 * ele está ativo.
 *
 * O segmento existe sempre, transparente, e só ganha cor no estado ativo — é o
 * que permite a transição em vez de um salto. No último item ele morre na
 * metade da altura (`last:has-data-active:after:bottom-1/2`), para a linha
 * terminar no próprio conector em vez de vazar para baixo.
 */
export const navTreeItem = cn(
  "relative pl-4 transition-colors duration-slow ease-linear",
  "before:absolute before:top-1/2 before:left-2 before:h-0.5 before:w-3 before:rounded-full before:bg-sidebar-border before:transition-colors before:duration-slow before:content-['']",
  "after:absolute after:top-0 after:bottom-0 after:left-2 after:w-0.5 after:rounded-full after:bg-transparent after:transition-colors after:duration-slow after:content-['']",
  "has-data-active:before:bg-foreground has-data-active:after:bg-foreground",
  "last:has-data-active:after:bottom-1/2",
);

/**
 * Realce do item ativo, alternativa à barra deslizante padrão da `Sidebar`.
 *
 * Vai como filho de um container `isolate`: o `-z-10` mantém o gradiente acima
 * do fundo do botão e abaixo do texto, sem exigir que o conteúdo seja
 * empilhado à mão. A opacidade responde ao `data-active` do próprio container,
 * então a entrada e a saída são suaves.
 */
export function NavActiveGlow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="nav-active-glow"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-r from-white/35 via-white/10 to-gray-500/25 opacity-0 transition-opacity duration-slow ease-linear dark:from-white/20 dark:via-white/5 dark:to-gray-500/30",
        // Os três grupos que podem comandar o realce, listados por extenso
        // porque o Tailwind não enxerga classe montada em template. Os dois
        // primeiros são os botões da Sidebar; o terceiro, sem nome, atende quem
        // monta a própria linha e marca o container com `group` e `data-active`.
        "group-data-active/menu-button:opacity-100 group-data-active/menu-sub-button:opacity-100 group-data-active:opacity-100",
        className,
      )}
    />
  );
}

/**
 * Caret de um grupo colapsável, apontando para baixo e girando meia volta ao
 * abrir. Depende de `group/collapsible` no `Collapsible` que o contém.
 */
export function NavCaret({ className }: { className?: string }) {
  return (
    <CaretDownIcon
      data-slot="nav-caret"
      className={cn(
        "ml-auto size-3.5 shrink-0 transition-transform duration-normal group-data-open/collapsible:rotate-180",
        className,
      )}
    />
  );
}
