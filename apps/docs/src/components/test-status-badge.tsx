import {
  CheckCircleIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { gitConfig } from "@/lib/shared";
import manifesto from "@/lib/test-status.json";

type StatusDeTestes = {
  status: "passando" | "falhando" | "sem-testes" | "desconhecido";
  total: number;
  passando?: number;
  falhando?: number;
  arquivos?: string[];
};

const COMPONENTES = manifesto.componentes as Record<string, StatusDeTestes>;

/**
 * `components/button.mdx` -> `button`. Retorna null para qualquer página que
 * não seja de componente (guias, index), que é onde o selo não se aplica.
 */
function slugDoPath(path: string): string | null {
  const m = /^components\/(.+)\.mdx$/.exec(path);
  return m ? m[1] : null;
}

function urlDoArquivo(arquivo: string): string {
  const { user, repo, branch } = gitConfig;
  return `https://github.com/${user}/${repo}/blob/${branch}/packages/ui/${arquivo}`;
}

/**
 * Selo com o resultado da suíte de testes do componente da página.
 *
 * Os dados vêm de src/lib/test-status.json, gerado por
 * `bun run test:status` a partir do relatório do Vitest — ou seja, refletem a
 * última execução registrada no repositório, não o estado ao vivo.
 */
export function TestStatusBadge({ path }: { path: string }) {
  const slug = slugDoPath(path);
  if (!slug) return null;

  const dados = COMPONENTES[slug];
  if (!dados || dados.status === "desconhecido") return null;

  if (dados.status === "sem-testes") {
    return (
      <Selo tom="neutro" icone={<WarningIcon weight="fill" />}>
        Sem testes automatizados
      </Selo>
    );
  }

  const plural = dados.total === 1 ? "teste" : "testes";
  const conteudo =
    dados.status === "falhando"
      ? `${dados.falhando} de ${dados.total} ${plural} falhando`
      : `${dados.total} ${plural} passando`;

  const arquivo = dados.arquivos?.[0];
  const selo = (
    <Selo
      tom={dados.status === "falhando" ? "erro" : "ok"}
      icone={
        dados.status === "falhando" ? (
          <XCircleIcon weight="fill" />
        ) : (
          <CheckCircleIcon weight="fill" />
        )
      }
    >
      {conteudo}
    </Selo>
  );

  if (!arquivo) return selo;

  return (
    <a
      href={urlDoArquivo(arquivo)}
      target="_blank"
      rel="noopener noreferrer"
      title={`Ver ${dados.arquivos?.join(", ")}`}
      className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
    >
      {selo}
    </a>
  );
}

const TONS = {
  ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  erro: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  neutro: "border-fd-border bg-fd-muted text-fd-muted-foreground",
} as const;

function Selo({
  tom,
  icone,
  children,
}: {
  tom: keyof typeof TONS;
  icone: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        "transition-colors [&_svg]:size-3.5",
        TONS[tom],
      )}
    >
      {icone}
      {children}
    </span>
  );
}
