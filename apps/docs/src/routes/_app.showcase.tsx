import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  PulseIcon as Activity,
  ArrowUpRightIcon as ArrowUpRight,
  CreditCardIcon as CreditCard,
  CurrencyDollarIcon as DollarSign,
  PlusIcon as Plus,
  TrendDownIcon as TrendingDown,
  TrendUpIcon as TrendingUp,
  UsersIcon as Users,
} from "@phosphor-icons/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { DataTable } from "@/components/data-table";
import { Badge } from "@adila-sh/ui";
import { Button } from "@adila-sh/ui";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@adila-sh/ui";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@adila-sh/ui";
import { CodeBlock } from "@adila-sh/ui";
import { CodeThemeSelect } from "@adila-sh/ui";
import {
  ApiRequest,
  ApiRequestCode,
  ApiRequestHeader,
  ApiRequestMeta,
  ApiRequestMethod,
  ApiRequestSection,
  ApiRequestSectionHeader,
  ApiRequestSectionTitle,
  ApiRequestUrl,
} from "@adila-sh/ui";
import { CopyButton } from "@adila-sh/ui";
import {
  DataList,
  DataListItem,
  DataListTerm,
  DataListValue,
} from "@adila-sh/ui";
import {
  FilterBar,
  FilterBarActions,
  FilterBarGroup,
  FilterBarResults,
} from "@adila-sh/ui";
import { FileUpload } from "@adila-sh/ui";
import { DiffViewer } from "@adila-sh/ui";
import { NewTransactionDrawer } from "@/components/new-transaction-drawer";
import { Checkbox } from "@adila-sh/ui";
import { Label } from "@adila-sh/ui";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@adila-sh/ui";
import { PackageInstall } from "@adila-sh/ui";
import { Progress } from "@adila-sh/ui";
import { RadioGroup, RadioGroupItem } from "@adila-sh/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@adila-sh/ui";
import { Separator } from "@adila-sh/ui";
import {
  SectionHeader,
  SectionHeaderActions,
  SectionHeaderContent,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@adila-sh/ui";
import { SearchInput } from "@adila-sh/ui";
import { Slider } from "@adila-sh/ui";
import { Status } from "@adila-sh/ui";
import { Switch } from "@adila-sh/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@adila-sh/ui";
import {
  Terminal,
  TerminalBody,
  TerminalCommand,
  TerminalControls,
  TerminalHeader,
  TerminalLine,
  TerminalOutput,
  TerminalPrompt,
  TerminalTitle,
} from "@adila-sh/ui";

export const Route = createFileRoute("/_app/showcase")({
  component: ShowcaseDashboard,
});

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

function AnimationShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden border-0 bg-[#10111a] text-white shadow-none">
        <CardHeader className="relative z-10">
          <CardDescription className="text-white/50">
            01 / DITHER
          </CardDescription>
          <CardTitle className="text-white">Sinal em movimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="adila-dither relative flex min-h-52 flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-5">
            <div className="relative z-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-pixel text-xs uppercase tracking-[0.18em] text-[#9da7ff]">
                  transmissão ativa
                </p>
                <p className="mt-2 text-2xl font-medium tracking-tight">
                  84.6% de nitidez
                </p>
              </div>
              <span className="adila-live-dot size-2.5 rounded-full bg-[#b9ff71]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="relative z-10">
          <CardDescription>02 / SHIMMER</CardDescription>
          <CardTitle>Estado de carregamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="adila-shimmer-surface relative flex min-h-52 flex-col justify-end overflow-hidden rounded-xl border p-5">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Sincronizando dados</span>
                <span>72%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <div className="adila-shimmer-bar h-full w-3/4 rounded-full bg-primary" />
              </div>
              <p className="adila-shimmer-text pt-2 text-3xl font-medium tracking-tight">
                Quase lá.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>03 / AURORA BORDER</CardDescription>
          <CardTitle>Foco sem ruído</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="adila-aurora-border rounded-xl p-px">
            <div className="flex min-h-40 flex-col justify-between rounded-xl bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pipeline de deploy</span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-medium tracking-tight">Produção</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Todas as etapas concluídas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>04 / PULSE + SCANLINE</CardDescription>
          <CardTitle>Atividade em tempo real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="adila-scanline relative flex min-h-40 items-center justify-between overflow-hidden rounded-xl border bg-muted/30 p-5">
            <div className="relative z-10 flex items-center gap-3">
              <span className="adila-live-dot size-3 rounded-full bg-primary" />
              <div>
                <p className="font-medium">Webhook recebido</p>
                <p className="text-sm text-muted-foreground">há 2 segundos</p>
              </div>
            </div>
            <div className="relative z-10 flex items-end gap-1">
              {[18, 30, 22, 42, 26, 36, 20].map((height, index) => (
                <span
                  key={index}
                  className="adila-audio-bar w-1.5 rounded-full bg-primary/70"
                  style={{ height }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShowcaseDashboard() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [notify, setNotify] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Workspace / Clientes</PageHeaderEyebrow>
          <PageHeaderTitle>Visão geral de clientes</PageHeaderTitle>
          <PageHeaderDescription>
            Acompanhe contas, encontre clientes e gerencie documentos em um
            único lugar.
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

      <SectionHeader className="pt-2">
        <SectionHeaderContent>
          <SectionHeaderTitle>Developer experience</SectionHeaderTitle>
          <SectionHeaderDescription>
            Componentes para documentação, APIs e ferramentas de
            desenvolvimento.
          </SectionHeaderDescription>
        </SectionHeaderContent>
        <SectionHeaderActions>
          <CodeThemeSelect aria-label="Tema dos blocos de código" />
        </SectionHeaderActions>
      </SectionHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Instalação e terminal</CardTitle>
            <CardDescription>
              Comandos prontos para copiar e saídas de execução.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PackageInstall
              commands={{
                bun: "bun add @adila-sh/ui",
              }}
            />
            <Terminal>
              <TerminalHeader>
                <TerminalControls />
                <TerminalTitle>adila — zsh</TerminalTitle>
              </TerminalHeader>
              <TerminalBody>
                <TerminalLine>
                  <TerminalPrompt>❯</TerminalPrompt>
                  <TerminalCommand>bun run build</TerminalCommand>
                </TerminalLine>
                <TerminalOutput className="text-[var(--code-success,#9ece6a)]">
                  ✓ pacote pronto · 76 componentes
                </TerminalOutput>
                <TerminalOutput>✓ build concluído em 4.1s</TerminalOutput>
              </TerminalBody>
            </Terminal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API playground</CardTitle>
            <CardDescription>
              Requisição e resposta com metadados operacionais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiRequest>
              <ApiRequestHeader>
                <ApiRequestMethod method="POST" />
                <ApiRequestUrl>/v1/deployments</ApiRequestUrl>
                <ApiRequestMeta>201 · 184 ms</ApiRequestMeta>
              </ApiRequestHeader>
              <ApiRequestSection>
                <ApiRequestSectionHeader>
                  <ApiRequestSectionTitle>Payload</ApiRequestSectionTitle>
                </ApiRequestSectionHeader>
                <ApiRequestCode
                  value={`{
  "project": "adila-ui",
  "environment": "production"
}`}
                />
              </ApiRequestSection>
              <ApiRequestSection>
                <ApiRequestSectionHeader>
                  <ApiRequestSectionTitle>Resposta</ApiRequestSectionTitle>
                  <Status variant="success">Created</Status>
                </ApiRequestSectionHeader>
                <ApiRequestCode
                  value={`{
  "id": "dep_8H2K91",
  "status": "queued"
}`}
                />
              </ApiRequestSection>
            </ApiRequest>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revisão de alterações</CardTitle>
          <CardDescription>
            Diff unificado com syntax highlighting via Pierre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiffViewer
            filename="deployment.ts"
            language="typescript"
            oldCode={`export const deployment = {
  region: "us-east",
  replicas: 1,
  autoscaling: false,
};`}
            newCode={`export const deployment = {
  region: "sa-east",
  replicas: 3,
  autoscaling: true,
};`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader>
            <SectionHeaderContent>
              <SectionHeaderTitle>Integração rápida</SectionHeaderTitle>
              <SectionHeaderDescription>
                Exemplo com syntax highlighting, linhas numeradas e ação de
                copiar.
              </SectionHeaderDescription>
            </SectionHeaderContent>
          </SectionHeader>
        </CardHeader>
        <CardContent>
          <CodeBlock
            filename="customer-status.tsx"
            language="tsx"
            showLineNumbers
            highlightLines={[5, 6]}
            code={`import { Status } from "@adila-sh/ui";

export function CustomerStatus({ active }: { active: boolean }) {
  return (
    <Status variant={active ? "success" : "neutral"}>
      {active ? "Ativo" : "Inativo"}
    </Status>
  );
}`}
          />
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{s.value}</CardTitle>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
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
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="fillCusto" x1="0" y1="0" x2="0" y2="1">
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
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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

      {/* Tabs: tabela / atividade / config / animações */}
      <Tabs defaultValue="transacoes">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="max-w-full overflow-x-auto">
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="atividade">Atividade</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="animacoes">Animações</TabsTrigger>
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
              <CardDescription>Ajuste notificações e conta</CardDescription>
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
                    onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="notify">Notificações por e-mail</Label>
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
                      <SelectItem value="eu-west">Europa (Irlanda)</SelectItem>
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

        {/* Animações */}
        <TabsContent value="animacoes">
          <Card>
            <CardHeader>
              <CardTitle>Laboratório de animações</CardTitle>
              <CardDescription>
                Efeitos de estado e textura para interfaces vivas, sem excesso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimationShowcase />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
