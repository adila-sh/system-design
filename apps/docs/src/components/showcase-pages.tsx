import {
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  CubeIcon,
  LifebuoyIcon,
  PackageIcon,
  TrendUpIcon,
  UserPlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { CodeThemeSelect } from "@/components/ui/code-theme";
import {
  DataList,
  DataListItem,
  DataListTerm,
  DataListValue,
} from "@/components/ui/data-list";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import {
  SectionHeader,
  SectionHeaderActions,
  SectionHeaderContent,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@/components/ui/section-header";
import {
  Stat,
  StatDescription,
  StatFooter,
  StatGroup,
  StatHeader,
  StatIcon,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/components/ui/stat";
import { Status } from "@/components/ui/status";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/timeline";

const customers = [
  ["Acme Tecnologia", "Marina Costa", "Enterprise", "Ativa"],
  ["Norte Labs", "Caio Lima", "Pro", "Ativa"],
  ["Orbit Systems", "Ana Souza", "Pro", "Pendente"],
  ["Vértice Cloud", "Leo Rocha", "Starter", "Inativa"],
];

export function AnalyticsShowcase() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Plataforma / Analytics</PageHeaderEyebrow>
          <PageHeaderTitle>Performance do produto</PageHeaderTitle>
          <PageHeaderDescription>
            Indicadores de adoção, estabilidade e conversão dos últimos 30 dias.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="outline">Exportar relatório</Button>
        </PageHeaderActions>
      </PageHeader>
      <StatGroup>
        <Stat>
          <StatHeader>
            <StatLabel>Usuários ativos</StatLabel>
            <StatIcon>
              <UsersIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>12.842</StatValue>
          <StatFooter>
            <StatTrend trend="up">
              <TrendUpIcon /> 18,2%
            </StatTrend>
            <StatDescription>no período</StatDescription>
          </StatFooter>
        </Stat>
        <Stat>
          <StatHeader>
            <StatLabel>Conversão</StatLabel>
            <StatIcon>
              <CheckCircleIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>8,4%</StatValue>
          <StatFooter>
            <StatTrend trend="up">+1,2 pp</StatTrend>
            <StatDescription>vs. anterior</StatDescription>
          </StatFooter>
        </Stat>
        <Stat>
          <StatHeader>
            <StatLabel>Tempo de resposta</StatLabel>
            <StatIcon>
              <ClockIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>184 ms</StatValue>
          <StatFooter>
            <StatTrend trend="down">-24 ms</StatTrend>
            <StatDescription>mais rápido</StatDescription>
          </StatFooter>
        </Stat>
        <Stat>
          <StatHeader>
            <StatLabel>Deploys</StatLabel>
            <StatIcon>
              <CodeIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>327</StatValue>
          <StatFooter>
            <Status variant="success">99,2% sucesso</Status>
          </StatFooter>
        </Stat>
      </StatGroup>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uso por capacidade</CardTitle>
            <CardDescription>
              Consumo relativo aos limites do plano.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              ["Build minutes", 72],
              ["Armazenamento", 46],
              ["Transferência", 84],
            ].map(([label, value]) => (
              <Progress key={label} value={value as number}>
                <ProgressLabel>{label}</ProgressLabel>
                <ProgressValue />
              </Progress>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos recentes</CardTitle>
            <CardDescription>
              Alterações que afetaram os indicadores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline>
              <TimelineItem>
                <TimelineIndicator status="complete" />
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Release 2.4 publicado</TimelineTitle>
                    <TimelineTime>Hoje, 14:32</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    Conversão aumentou após o novo onboarding.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineIndicator status="current" />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Experimento em execução</TimelineTitle>
                    <TimelineTime>3 dias</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    Nova navegação disponível para 50% da base.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function CustomersShowcase() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Plataforma / Clientes</PageHeaderEyebrow>
          <PageHeaderTitle>Clientes</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie contas, planos e responsáveis.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button>
            <UserPlusIcon />
            Adicionar cliente
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <SectionHeader>
        <SectionHeaderContent>
          <SectionHeaderTitle>Base de clientes</SectionHeaderTitle>
          <SectionHeaderDescription>
            2.350 registros em todos os planos.
          </SectionHeaderDescription>
        </SectionHeaderContent>
        <SectionHeaderActions>
          <SearchInput
            placeholder="Buscar cliente…"
            aria-label="Buscar cliente"
          />
        </SectionHeaderActions>
      </SectionHeader>
      <Card className="min-w-0">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(([company, owner, plan, status]) => (
                <TableRow key={company}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback>{company.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="whitespace-nowrap font-medium">
                        {company}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{owner}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Status
                      variant={
                        status === "Ativa"
                          ? "success"
                          : status === "Pendente"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {status}
                    </Status>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export function ProductsShowcase() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Catálogo / Produtos</PageHeaderEyebrow>
          <PageHeaderTitle>Produtos</PageHeaderTitle>
          <PageHeaderDescription>
            Serviços disponíveis no ecossistema adila.co.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button>
            <PackageIcon />
            Novo produto
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Deploy", "Infraestrutura contínua", "Disponível"],
          ["Object Storage", "Buckets compatíveis com S3", "Beta"],
          ["Observability", "Logs, métricas e traces", "Em breve"],
        ].map(([name, description, status]) => (
          <Card key={name}>
            <CardHeader>
              <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-muted">
                <CubeIcon className="size-4" />
              </div>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem>
                  <DataListTerm>Status</DataListTerm>
                  <DataListValue>
                    <Status
                      variant={
                        status === "Disponível"
                          ? "success"
                          : status === "Beta"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {status}
                    </Status>
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListTerm>Regiões</DataListTerm>
                  <DataListValue>3 regiões</DataListValue>
                </DataListItem>
              </DataList>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>Crie uma integração própria</EmptyTitle>
          <EmptyDescription>
            Use os componentes e APIs do ecossistema para estender o catálogo.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">Abrir documentação</Button>
        </EmptyContent>
      </Empty>
    </>
  );
}

export function SettingsShowcase() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Workspace / Configurações</PageHeaderEyebrow>
          <PageHeaderTitle>Configurações</PageHeaderTitle>
          <PageHeaderDescription>
            Preferências compartilhadas pelo workspace.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button>Salvar alterações</Button>
        </PageHeaderActions>
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do workspace</CardTitle>
            <CardDescription>
              Informações visíveis para todos os membros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="workspace-name">Nome</FieldLabel>
                <Input id="workspace-name" defaultValue="Adila Inc." />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input id="slug" defaultValue="adila-inc" />
                <FieldDescription>
                  Usado em URLs e identificadores da API.
                </FieldDescription>
              </Field>
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel htmlFor="preview">Deploys de preview</FieldLabel>
                  <FieldDescription>
                    Cria ambientes para cada pull request.
                  </FieldDescription>
                </div>
                <Switch id="preview" defaultChecked />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tema de código</CardTitle>
            <CardDescription>
              Aplicado a snippets, terminal e diffs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeThemeSelect className="w-full" />
            <CodeBlock
              hideHeader
              language="json"
              code={'{\n  "theme": "shared"\n}'}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function HelpShowcase() {
  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderEyebrow>Suporte / Ajuda</PageHeaderEyebrow>
          <PageHeaderTitle>Como podemos ajudar?</PageHeaderTitle>
          <PageHeaderDescription>
            Encontre respostas, atalhos e exemplos de integração.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="outline">
            <LifebuoyIcon />
            Falar com suporte
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <SearchInput
        className="h-11 w-full"
        placeholder="Buscar na documentação…"
        aria-label="Buscar ajuda"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perguntas frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem value="install">
                <AccordionTrigger>
                  Como instalar um componente?
                </AccordionTrigger>
                <AccordionContent>
                  Use o comando do registry disponível em cada página da
                  documentação.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="theme">
                <AccordionTrigger>
                  Os temas funcionam em dark mode?
                </AccordionTrigger>
                <AccordionContent>
                  Sim. Tokens de interface e temas de código podem ser
                  controlados de forma independente.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="access">
                <AccordionTrigger>
                  Os componentes são acessíveis?
                </AccordionTrigger>
                <AccordionContent>
                  Os primitives interativos usam Base UI e incluem navegação por
                  teclado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atalhos úteis</CardTitle>
            <CardDescription>
              Ações disponíveis em qualquer tela.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>Abrir busca</span>
              <span className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>Alternar sidebar</span>
              <span className="flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </span>
            </div>
            <Alert>
              <CodeIcon />
              <AlertTitle>API disponível</AlertTitle>
              <AlertDescription>
                Explore exemplos de requests na documentação técnica.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
