import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  CaretUpDownIcon as ChevronsUpDown,
  BellIcon as Bell,
  CreditCardIcon as CreditCard,
  DotsThreeIcon as MoreHorizontal,
  SquaresFourIcon as LayoutDashboard,
  LifebuoyIcon as LifeBuoy,
  ChartLineIcon as LineChart,
  SignOutIcon as LogOut,
  MoonStarsIcon as MoonStar,
  PackageIcon as Package,
  MagnifyingGlassIcon as Search,
  GearSixIcon as Settings2,
  SparkleIcon as Sparkles,
  UsersIcon as Users,
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BottomBar,
  BottomBarButton,
  BottomBarDrawer,
  BottomBarDrawerContent,
  BottomBarDrawerTrigger,
  BottomBarItem,
  BottomBarLabel,
  BottomBarList,
} from "@/components/ui/bottom-bar";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/command-menu";
import {
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeThemeProvider } from "@/components/ui/code-theme";

const getSidebarDefaultOpen = createServerFn({ method: "GET" }).handler(
  () => getCookie("sidebar_state") !== "false",
);

export const Route = createFileRoute("/_app")({
  loader: () => getSidebarDefaultOpen(),
  component: AppShell,
});

const navMain = [
  {
    title: "Visão geral",
    icon: LayoutDashboard,
    href: "/showcase",
    badge: null,
  },
  { title: "Analytics", icon: LineChart, href: "/analytics", badge: "3" },
  { title: "Clientes", icon: Users, href: "/clientes", badge: null },
  { title: "Produtos", icon: Package, href: "/produtos", badge: "12" },
];

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function AppSidebar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">Adila Inc.</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Plano Pro
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onOpenCommand}
                  tooltip="Buscar (⌘K)"
                >
                  <Search />
                  <span>Buscar</span>
                  <Kbd className="ml-auto group-data-[collapsible=icon]:hidden">
                    ⌘K
                  </Kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link to={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Suporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Configurações"
                  isActive={pathname === "/configuracoes"}
                  render={<Link to="/configuracoes" />}
                >
                  <Settings2 />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Ajuda"
                  isActive={pathname === "/ajuda"}
                  render={<Link to="/ajuda" />}
                >
                  <LifeBuoy />
                  <span>Ajuda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">JS</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-medium">João Sousa</span>
                      <span className="truncate text-xs text-muted-foreground">
                        joao@adila.co
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Sparkles />
                  Fazer upgrade
                  <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Faturamento
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings2 />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppBottomBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <BottomBar>
      <BottomBarList>
        {navMain.slice(0, 3).map((item) => (
          <BottomBarItem key={item.title}>
            <BottomBarButton
              isActive={pathname === item.href}
              render={<Link to={item.href} />}
            >
              <item.icon />
              <BottomBarLabel>{item.title}</BottomBarLabel>
            </BottomBarButton>
          </BottomBarItem>
        ))}

        <BottomBarItem>
          <BottomBarDrawer>
            <BottomBarDrawerTrigger aria-label="Abrir menu completo">
              <MoreHorizontal />
              <BottomBarLabel>Menu</BottomBarLabel>
            </BottomBarDrawerTrigger>
            <BottomBarDrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>
                  Todos os itens da navegação.
                </DrawerDescription>
              </DrawerHeader>

              <nav
                aria-label="Menu completo"
                className="grid gap-1 overflow-y-auto p-4"
              >
                <DrawerClose
                  render={
                    <button
                      type="button"
                      onClick={onOpenCommand}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-muted"
                    />
                  }
                >
                  <Search className="size-5 text-muted-foreground" />
                  Buscar
                </DrawerClose>

                <p className="px-3 pt-4 pb-1 text-xs font-medium text-muted-foreground">
                  Plataforma
                </p>
                {navMain.map((item) => (
                  <DrawerClose
                    key={item.title}
                    render={
                      <Link
                        to={item.href}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:text-primary"
                      />
                    }
                  >
                    <item.icon className="size-5 text-muted-foreground" />
                    <span>{item.title}</span>
                    {item.badge ? (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </DrawerClose>
                ))}

                <p className="px-3 pt-4 pb-1 text-xs font-medium text-muted-foreground">
                  Suporte
                </p>
                <DrawerClose
                  render={
                    <Link
                      to="/configuracoes"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
                    />
                  }
                >
                  <Settings2 className="size-5 text-muted-foreground" />
                  Configurações
                </DrawerClose>
                <DrawerClose
                  render={
                    <Link
                      to="/ajuda"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
                    />
                  }
                >
                  <LifeBuoy className="size-5 text-muted-foreground" />
                  Ajuda
                </DrawerClose>
              </nav>
            </BottomBarDrawerContent>
          </BottomBarDrawer>
        </BottomBarItem>
      </BottomBarList>
    </BottomBar>
  );
}

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

function AppShell() {
  const sidebarDefaultOpen = Route.useLoaderData();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { title, description } =
    pageMetadata[pathname] ?? pageMetadata["/showcase"];
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <TooltipProvider>
      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
      <SidebarProvider defaultOpen={sidebarDefaultOpen}>
        <AppSidebar onOpenCommand={() => setCmdOpen(true)} />
        <SidebarInset className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          {/* Header */}
          <header className="flex h-16 min-w-0 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <div className="flex min-w-0 flex-col gap-0.5">
              <h1 className="sr-only">{title}</h1>
              <Breadcrumb>
                <BreadcrumbList className="flex-nowrap overflow-hidden text-xs sm:text-sm">
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    <BreadcrumbLink render={<Link to="/" />}>
                      Design System
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:list-item" />
                  <BreadcrumbItem>
                    {title === "Visão geral" ? (
                      <BreadcrumbPage className="truncate font-medium">
                        Showcase
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link to="/showcase" />}>
                        Showcase
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {title !== "Visão geral" ? (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className="min-w-0">
                        <BreadcrumbPage className="truncate font-medium">
                          {title}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  ) : null}
                </BreadcrumbList>
              </Breadcrumb>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {description}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar…"
                  className="h-9 w-48 pl-8"
                  aria-label="Buscar"
                />
              </div>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(isDark ? "light" : "dark")}
                      aria-label="Alternar tema"
                    >
                      <MoonStar />
                    </Button>
                  }
                />
                <TooltipContent>
                  Tema {isDark ? "escuro" : "claro"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Notificações"
                    >
                      <Bell />
                    </Button>
                  }
                />
                <TooltipContent>3 notificações</TooltipContent>
              </Tooltip>

              <Avatar className="hidden size-9 sm:flex">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Conteúdo */}
          <CodeThemeProvider
            defaultTheme="tokyo-night"
            className="flex min-w-0 flex-1 flex-col gap-4 p-3 sm:p-4"
          >
            <Outlet />
          </CodeThemeProvider>
        </SidebarInset>
        <AppBottomBar onOpenCommand={() => setCmdOpen(true)} />
      </SidebarProvider>
    </TooltipProvider>
  );
}
