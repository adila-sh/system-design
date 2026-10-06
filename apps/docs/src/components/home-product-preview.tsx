import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CubeIcon,
  UsersIcon,
  SlidersIcon,
} from "@phosphor-icons/react";
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  ProgressLabel,
  ProgressValue,
  Status,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@adila-sh/ui";

const PROJECTS = [
  {
    name: "Portal do cliente",
    team: "Produto",
    status: "Em andamento",
    variant: "info",
  },
  {
    name: "Central de atendimento",
    team: "Operações",
    status: "Em revisão",
    variant: "warning",
  },
  {
    name: "Área da equipe",
    team: "Design",
    status: "Concluído",
    variant: "success",
  },
] as const;

export function HomeProductPreview() {
  return (
    <section
      id="em-produto"
      className="home-product-section"
      aria-labelledby="product-title"
    >
      <div className="home-container">
        <div className="home-section-heading">
          <h2 id="product-title">
            As peças se conectam.
            <br />O produto acontece.
          </h2>
          <p>
            Uma tabela, um status, uma ação. A consistência aparece quando todos
            os detalhes trabalham na mesma direção.
          </p>
        </div>
        <div className="home-product-demo">
          <div className="home-product-toolbar">
            <div className="flex items-center gap-3">
              <CubeIcon aria-hidden="true" className="size-6" />
              <span>Workspace Adila</span>
            </div>
            <Badge variant="secondary">Dados de demonstração</Badge>
          </div>
          <div className="home-product-body">
            <div className="home-product-heading">
              <div>
                <h3>Um lugar para acompanhar.</h3>
                <p>Projetos, prioridades e próximos passos.</p>
              </div>
              <Link to="/showcase" className={buttonVariants()}>
                Abrir showcase
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </div>
            <div className="home-product-panels">
              <Card>
                <CardHeader>
                  <CardTitle>Projetos da equipe</CardTitle>
                  <CardDescription>
                    Uma visão compartilhada de cada entrega.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table aria-label="Projetos de demonstração">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projeto</TableHead>
                        <TableHead>Equipe</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PROJECTS.map((project) => (
                        <TableRow key={project.name}>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.team}</TableCell>
                          <TableCell>
                            <Status variant={project.variant}>
                              {project.status}
                            </Status>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <p className="home-sample-note">
                    Três projetos, uma linguagem em comum.
                  </p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Próximo lançamento</CardTitle>
                  <CardDescription>
                    Cada etapa fica mais clara quando o sistema acompanha.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <Progress value={75}>
                    <ProgressLabel>Preparação</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                  <ul className="home-product-checklist">
                    <li>
                      <CheckCircleIcon aria-hidden="true" />
                      Fundamentos definidos
                    </li>
                    <li>
                      <CheckCircleIcon aria-hidden="true" />
                      Componentes conectados
                    </li>
                    <li>
                      <CheckCircleIcon aria-hidden="true" />
                      Fluxos em revisão
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Status variant="info">Em preparação</Status>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <div className="home-product-paths">
          <Link to="/showcase">
            <CubeIcon aria-hidden="true" />
            <span>
              <strong>Painéis e operações</strong>
              <span>Dados, tabelas e ações no mesmo fluxo.</span>
            </span>
            <ArrowRightIcon aria-hidden="true" />
          </Link>
          <Link to="/clientes">
            <UsersIcon aria-hidden="true" />
            <span>
              <strong>Clientes e equipes</strong>
              <span>Pessoas, contexto e colaboração.</span>
            </span>
            <ArrowRightIcon aria-hidden="true" />
          </Link>
          <Link to="/configuracoes">
            <SlidersIcon aria-hidden="true" />
            <span>
              <strong>Preferências e ajustes</strong>
              <span>Controle com uma interface familiar.</span>
            </span>
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
