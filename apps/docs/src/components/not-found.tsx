import { baseOptions } from "@/lib/layout.shared";
import { Button } from "@/components/ui/button";
import {
  PageState,
  PageStateActions,
  PageStateBackdrop,
  PageStateCode,
  PageStateContent,
  PageStateDescription,
  PageStateEyebrow,
  PageStateTitle,
} from "@/components/ui/page-state";
import { Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <PageState className="min-h-[calc(100svh-3.5rem)] rounded-none">
        <PageStateBackdrop />
        <PageStateContent>
          <PageStateCode>404</PageStateCode>
          <PageStateEyebrow>Página não encontrada</PageStateEyebrow>
          <PageStateTitle>Talvez ela tenha mudado de endereço</PageStateTitle>
          <PageStateDescription>
            O link pode estar desatualizado ou a página não está mais
            disponível. Volte ao início ou consulte a documentação.
          </PageStateDescription>
          <PageStateActions>
            <Button render={<Link to="/">Voltar ao início</Link>} />
            <Button
              variant="outline"
              render={
                <Link to="/docs/$" params={{ _splat: "" }}>
                  Documentação
                </Link>
              }
            />
          </PageStateActions>
        </PageStateContent>
      </PageState>
    </HomeLayout>
  );
}
