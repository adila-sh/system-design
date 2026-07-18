import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  PulseIcon as Activity,
  ArrowUpRightIcon as ArrowUpRight,
  BellIcon as Bell,
  CaretUpDownIcon as ChevronsUpDown,
  CreditCardIcon as CreditCard,
  CurrencyDollarIcon as DollarSign,
  SquaresFourIcon as LayoutDashboard,
  LifebuoyIcon as LifeBuoy,
  ChartLineIcon as LineChart,
  SignOutIcon as LogOut,
  MoonStarsIcon as MoonStar,
  PackageIcon as Package,
  PlusIcon as Plus,
  MagnifyingGlassIcon as Search,
  GearSixIcon as Settings2,
  SparkleIcon as Sparkles,
  TrendDownIcon as TrendingDown,
  TrendUpIcon as TrendingUp,
  UsersIcon as Users,
} from "@phosphor-icons/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CommandMenu } from "@/components/command-menu";
import { CopyButton } from "@/components/ui/copy-button";
import {
  DataList,
  DataListItem,
  DataListTerm,
  DataListValue,
} from "@/components/ui/data-list";
import {
  FilterBar,
  FilterBarActions,
  FilterBarGroup,
  FilterBarResults,
} from "@/components/ui/filter-bar";
import { FileUpload } from "@/components/ui/file-upload";
import { NewTransactionDrawer } from "@/components/new-transaction-drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Kbd } from "@/components/ui/kbd";
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
import { Label } from "@/components/ui/label";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SectionHeader,
  SectionHeaderActions,
  SectionHeaderContent,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@/components/ui/section-header";
import { SearchInput } from "@/components/ui/search-input";
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
import { Slider } from "@/components/ui/slider";
import { Status } from "@/components/ui/status";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/showcase")({
  component: Showcase,
});

/* ------------------------------------------------------------------ */
/* Dados de exemplo                                                    */
/* ------------------------------------------------------------------ */

const revenueData = [
  { month: "Jan", receita: 4200, custo: 2400 },
  { month: "Fev", receita: 5100, custo: 2210 },
  { month: "Mar", receita: 4800, custo: 2290 },
  { month: "Abr", receita: 6300, custo: 3000 },
  { month: "Mai", receita: 7200, custo: 3400 },
  { month: "Jun", receita: 8100, custo: 3600 },
];

const revenueConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  custo: { label: "Custo", color: "var(--chart-2)" },
} satisfies ChartConfig;

const trafficData = [
  { canal: "Orgânico", visitas: 3200 },
  { canal: "Social", visitas: 2100 },
  { canal: "E-mail", visitas: 1600 },
  { canal: "Direto", visitas: 1400 },
  { canal: "Referência", visitas: 900 },
];

const trafficConfig = {
  visitas: { label: "Visitas", color: "var(--chart-1)" },
} satisfies ChartConfig;

const stats = [
  {
    label: "Receita total",
    value: "R$ 45.231",
    delta: "+20,1%",
    up: true,
    icon: DollarSign,
  },
  {
    label: "Assinantes",
    value: "2.350",
    delta: "+180,1%",
    up: true,
    icon: Users,
  },
  {
    label: "Vendas",
    value: "12.234",
    delta: "+19%",
    up: true,
    icon: CreditCard,
  },
  {
    label: "Ativos agora",
    value: "573",
    delta: "-2,4%",
    up: false,
    icon: Activity,
  },
];

const activity = [
  { nome: "Deploy de produção", progresso: 100 },
  { nome: "Migração do banco", progresso: 72 },
  { nome: "Índice de busca", progresso: 46 },
  { nome: "Backfill de eventos", progresso: 18 },
];

const navMain = [
  { title: "Visão geral", icon: LayoutDashboard, active: true, badge: null },
  { title: "Analytics", icon: LineChart, active: false, badge: "3" },
  { title: "Clientes", icon: Users, active: false, badge: null },
  { title: "Produtos", icon: Package, active: false, badge: "12" },
];

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function AppSidebar({ onOpenCommand }: { onOpenCommand: () => void }) {
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
                    isActive={item.active}
                    tooltip={item.title}
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
                <SidebarMenuButton tooltip="Configurações">
                  <Settings2 />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Ajuda">
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

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

function Showcase() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [notify, setNotify] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

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
      <SidebarProvider>
        <AppSidebar onOpenCommand={() => setCmdOpen(true)} />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium">Visão geral</h1>
              <p className="text-xs text-muted-foreground">
                Bem-vindo de volta, João
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

              <Avatar className="size-9">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Conteúdo */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            <PageHeader>
              <PageHeaderContent>
                <PageHeaderEyebrow>Workspace / Clientes</PageHeaderEyebrow>
                <PageHeaderTitle>Visão geral de clientes</PageHeaderTitle>
                <PageHeaderDescription>
                  Acompanhe contas, encontre clientes e gerencie documentos em
                  um único lugar.
                </PageHeaderDescription>
              </PageHeaderContent>
              <PageHeaderActions>
                <Button variant="outline">Exportar</Button>
                <Button>
                  <Plus />
                  Novo cliente
                </Button>
              </PageHeaderActions>
            </PageHeader>

            <FilterBar>
              <FilterBarGroup>
                <SearchInput
                  className="w-full sm:w-72"
                  placeholder="Buscar cliente…"
                  aria-label="Buscar cliente"
                  value={customerSearch}
                  onValueChange={setCustomerSearch}
                />
                <Select
                  defaultValue="todos"
                  items={{
                    todos: "Todos",
                    ativos: "Ativos",
                    pendentes: "Pendentes",
                  }}
                >
                  <SelectTrigger size="sm" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativos">Ativos</SelectItem>
                    <SelectItem value="pendentes">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </FilterBarGroup>
              <FilterBarActions>
                <FilterBarResults>
                  {customerSearch ? "3 resultados" : "2.350 clientes"}
                </FilterBarResults>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!customerSearch}
                  onClick={() => setCustomerSearch("")}
                >
                  Limpar
                </Button>
              </FilterBarActions>
            </FilterBar>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <SectionHeader>
                    <SectionHeaderContent>
                      <SectionHeaderTitle>Conta em destaque</SectionHeaderTitle>
                      <SectionHeaderDescription>
                        Informações comerciais e operacionais.
                      </SectionHeaderDescription>
                    </SectionHeaderContent>
                    <SectionHeaderActions>
                      <Status variant="success">Ativa</Status>
                    </SectionHeaderActions>
                  </SectionHeader>
                </CardHeader>
                <CardContent>
                  <DataList>
                    <DataListItem>
                      <DataListTerm>Empresa</DataListTerm>
                      <DataListValue>Acme Tecnologia Ltda.</DataListValue>
                    </DataListItem>
                    <DataListItem>
                      <DataListTerm>Responsável</DataListTerm>
                      <DataListValue>Marina Costa</DataListValue>
                    </DataListItem>
                    <DataListItem>
                      <DataListTerm>Identificador</DataListTerm>
                      <DataListValue className="flex items-center gap-2 sm:justify-end">
                        <code className="font-mono text-xs">cli_8H2K91</code>
                        <CopyButton
                          value="cli_8H2K91"
                          size="icon-xs"
                          aria-label="Copiar identificador"
                        />
                      </DataListValue>
                    </DataListItem>
                    <DataListItem>
                      <DataListTerm>Plano</DataListTerm>
                      <DataListValue>Enterprise · R$ 4.900/mês</DataListValue>
                    </DataListItem>
                  </DataList>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionHeader>
                    <SectionHeaderContent>
                      <SectionHeaderTitle>Documentos</SectionHeaderTitle>
                      <SectionHeaderDescription>
                        Envie contratos e comprovantes da conta.
                      </SectionHeaderDescription>
                    </SectionHeaderContent>
                    <SectionHeaderActions>
                      <Status variant="warning">2 pendentes</Status>
                    </SectionHeaderActions>
                  </SectionHeader>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    maxSize={5 * 1024 * 1024}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <Card key={s.label}>
                  <CardHeader>
                    <CardDescription>{s.label}</CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                      {s.value}
                    </CardTitle>
                    <CardAction>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <s.icon className="size-4" />
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant={s.up ? "default" : "destructive"}>
                      {s.up ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {s.delta}
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      vs. mês anterior
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Receita x Custo</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                  <CardAction>
                    <Select
                      defaultValue="6m"
                      items={{
                        "7d": "7 dias",
                        "30d": "30 dias",
                        "6m": "6 meses",
                        "12m": "12 meses",
                      }}
                    >
                      <SelectTrigger size="sm" className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="6m">6 meses</SelectItem>
                        <SelectItem value="12m">12 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={revenueConfig}
                    className="aspect-auto h-[240px] w-full"
                  >
                    <AreaChart
                      data={revenueData}
                      margin={{ left: 4, right: 4, top: 8 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <defs>
                        <linearGradient
                          id="fillReceita"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-receita)"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-receita)"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillCusto"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-custo)"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-custo)"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="custo"
                        type="natural"
                        stroke="var(--color-custo)"
                        fill="url(#fillCusto)"
                        stackId="a"
                      />
                      <Area
                        dataKey="receita"
                        type="natural"
                        stroke="var(--color-receita)"
                        fill="url(#fillReceita)"
                        stackId="b"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Tráfego por canal</CardTitle>
                  <CardDescription>Sessões nesta semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={trafficConfig}
                    className="aspect-auto h-[240px] w-full"
                  >
                    <BarChart
                      data={trafficData}
                      margin={{ left: 4, right: 4, top: 8 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="canal"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="visitas"
                        fill="var(--color-visitas)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabs: tabela / atividade / config */}
            <Tabs defaultValue="transacoes">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="transacoes">Transações</TabsTrigger>
                  <TabsTrigger value="atividade">Atividade</TabsTrigger>
                  <TabsTrigger value="config">Configurações</TabsTrigger>
                </TabsList>
                <NewTransactionDrawer />
              </div>

              {/* Transações */}
              <TabsContent value="transacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Transações recentes</CardTitle>
                    <CardDescription>
                      Filtre, ordene e selecione — data table completa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Atividade */}
              <TabsContent value="atividade">
                <Card>
                  <CardHeader>
                    <CardTitle>Tarefas em execução</CardTitle>
                    <CardDescription>Pipeline de deploy</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    {activity.map((a) => (
                      <div key={a.nome} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{a.nome}</span>
                          <span className="text-muted-foreground tabular-nums">
                            {a.progresso}%
                          </span>
                        </div>
                        <Progress value={a.progresso} />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Ver histórico
                      <ArrowUpRight />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Configurações — form controls */}
              <TabsContent value="config">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                    <CardDescription>
                      Ajuste notificações e conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    {/* Coluna 1 */}
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <Label htmlFor="dark">Modo escuro</Label>
                          <span className="text-xs text-muted-foreground">
                            Alterna o tema da interface
                          </span>
                        </div>
                        <Switch
                          id="dark"
                          checked={isDark}
                          onCheckedChange={(v) =>
                            setTheme(v ? "dark" : "light")
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <Label htmlFor="notify">
                            Notificações por e-mail
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            Resumo diário de atividade
                          </span>
                        </div>
                        <Switch
                          id="notify"
                          checked={notify}
                          onCheckedChange={setNotify}
                        />
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <Label>Alertas</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox id="c1" defaultChecked />
                          <Label htmlFor="c1" className="font-normal">
                            Falhas de pagamento
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="c2" defaultChecked />
                          <Label htmlFor="c2" className="font-normal">
                            Novos assinantes
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="c3" />
                          <Label htmlFor="c3" className="font-normal">
                            Relatórios semanais
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-3">
                        <Label>Plano de cobrança</Label>
                        <RadioGroup defaultValue="pro" className="gap-3">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="free" id="p-free" />
                            <Label htmlFor="p-free" className="font-normal">
                              Free — R$ 0
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="pro" id="p-pro" />
                            <Label htmlFor="p-pro" className="font-normal">
                              Pro — R$ 49/mês
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="ent" id="p-ent" />
                            <Label htmlFor="p-ent" className="font-normal">
                              Enterprise — sob consulta
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Label>Limite de gastos</Label>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            R$ 2.500
                          </span>
                        </div>
                        <Slider defaultValue={50} max={100} step={5} />
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="region">Região</Label>
                        <Select
                          defaultValue="sa-east"
                          items={{
                            "sa-east": "América do Sul (São Paulo)",
                            "us-east": "EUA Leste (N. Virgínia)",
                            "eu-west": "Europa (Irlanda)",
                          }}
                        >
                          <SelectTrigger id="region" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sa-east">
                              América do Sul (São Paulo)
                            </SelectItem>
                            <SelectItem value="us-east">
                              EUA Leste (N. Virgínia)
                            </SelectItem>
                            <SelectItem value="eu-west">
                              Europa (Irlanda)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    <Button variant="ghost">Cancelar</Button>
                    <Button>Salvar alterações</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
