export const appNavigation = [
  { title: "Visão geral", href: "/showcase", badge: null },
  { title: "Analytics", href: "/analytics", badge: "3" },
  { title: "Clientes", href: "/clientes", badge: null },
  { title: "Produtos", href: "/produtos", badge: "12" },
] as const;

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/showcase": {
    title: "Visão geral",
    description: "Bem-vindo de volta, João",
  },
  "/analytics": { title: "Analytics", description: "Performance e adoção" },
  "/clientes": { title: "Clientes", description: "Contas e relacionamentos" },
  "/produtos": {
    title: "Produtos",
    description: "Catálogo do ecossistema",
  },
  "/configuracoes": {
    title: "Configurações",
    description: "Preferências do workspace",
  },
  "/ajuda": { title: "Ajuda", description: "Documentação e suporte" },
};

type CommandShortcutEvent = Pick<
  KeyboardEvent,
  "key" | "metaKey" | "ctrlKey" | "preventDefault"
>;

export function handleCommandMenuShortcut(
  event: CommandShortcutEvent,
  toggle: () => void,
) {
  if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) {
    return false;
  }

  event.preventDefault();
  toggle();
  return true;
}

export function isActiveNavigation(pathname: string, href: string) {
  return pathname === href;
}

export function getPageMetadata(pathname: string) {
  return pageMetadata[pathname] ?? pageMetadata["/showcase"];
}
