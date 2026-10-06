import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Progress,
  ProgressLabel,
  ProgressValue,
  Status,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@adila-sh/ui";

function GalleryItem({
  title,
  description,
  component,
  children,
}: {
  title: string;
  description: string;
  component: string;
  children: ReactNode;
}) {
  return (
    <article className="home-gallery-item">
      <div className="home-gallery-preview">{children}</div>
      <div className="home-gallery-description">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link
          to="/docs/$"
          params={{ _splat: `components/${component}` }}
          className="home-text-link"
        >
          Ver {component}
          <ArrowRightIcon aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function HomeGallery() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(48);
  return (
    <section
      className="home-container home-gallery-section"
      aria-labelledby="gallery-title"
    >
      <div className="home-section-heading">
        <h2 id="gallery-title">
          Pequenas peças.
          <br />
          Grandes possibilidades.
        </h2>
        <p>
          Explore algumas partes da biblioteca. Cada exemplo usa os componentes
          reais que você leva para o seu produto.
        </p>
      </div>
      <div className="home-gallery-grid">
        <GalleryItem
          title="Ações com hierarquia"
          description="Da ação principal à alternativa discreta, com a mesma linguagem."
          component="button"
        >
          <div className="home-sample-stack">
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => setCount(count + 1)}>
                <PlusIcon data-icon="inline-start" />
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Limpar
              </Button>
            </div>
            <p role="status" className="home-sample-note">
              {count === 0
                ? "Experimente adicionar um item."
                : `${count} ${count === 1 ? "item adicionado" : "itens adicionados"}.`}
            </p>
          </div>
        </GalleryItem>
        <GalleryItem
          title="Formulários que orientam"
          description="Rótulo, campo e retorno trabalham juntos para guiar cada escolha."
          component="input"
        >
          <form
            className="w-full max-w-xs"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="gallery-name">Nome do projeto</FieldLabel>
                <Input
                  id="gallery-name"
                  placeholder="Seu próximo produto"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setSubmitted(false);
                  }}
                  required
                  maxLength={60}
                />
                <FieldDescription role="status">
                  {submitted
                    ? `Projeto ${name} nomeado na demonstração.`
                    : "Um nome para começar a dar forma."}
                </FieldDescription>
              </Field>
              <Button type="submit">Experimentar</Button>
            </FieldGroup>
          </form>
        </GalleryItem>
        <GalleryItem
          title="Estados que fazem sentido"
          description="Cor e texto comunicam o andamento sem depender um do outro."
          component="status"
        >
          <div className="home-sample-stack">
            <div className="flex flex-wrap justify-center gap-3">
              <Status variant="success">Concluído</Status>
              <Status variant="info">Em andamento</Status>
              <Status variant="warning">Em revisão</Status>
            </div>
            <Alert>
              <CheckCircleIcon />
              <AlertTitle>Tudo pronto para continuar</AlertTitle>
              <AlertDescription>
                Um retorno claro para o próximo passo.
              </AlertDescription>
            </Alert>
          </div>
        </GalleryItem>
        <GalleryItem
          title="Navegação sem ruído"
          description="Organize o conteúdo e mantenha as opções sempre à mão."
          component="tabs"
        >
          <Tabs defaultValue="overview" className="w-full max-w-xs">
            <TabsList aria-label="Exemplo de navegação" className="mx-auto">
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="home-sample-message">
                O que importa agora, em um só lugar.
              </p>
            </TabsContent>
            <TabsContent value="activity">
              <p className="home-sample-message">
                Um histórico claro do que aconteceu.
              </p>
            </TabsContent>
          </Tabs>
        </GalleryItem>
        <GalleryItem
          title="Pessoas e colaboração"
          description="Identifique quem participa, mesmo quando a imagem não está disponível."
          component="avatar"
        >
          <div className="home-sample-stack">
            <AvatarGroup aria-label="Equipes de design, produto e engenharia">
              <Avatar size="lg">
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>PD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>EN</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+2</AvatarGroupCount>
            </AvatarGroup>
            <p className="home-sample-note">Design, produto e engenharia.</p>
            <Badge variant="secondary">Uma base compartilhada</Badge>
          </div>
        </GalleryItem>
        <GalleryItem
          title="Progresso perceptível"
          description="Mostre o andamento e deixe claro quando a tarefa termina."
          component="progress"
        >
          <div className="home-sample-stack w-full max-w-xs">
            <Progress value={progress}>
              <ProgressLabel>Seu primeiro fluxo</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Button
              variant="outline"
              onClick={() =>
                setProgress(progress >= 100 ? 0 : Math.min(progress + 26, 100))
              }
            >
              {progress >= 100 ? "Recomeçar" : "Avançar etapa"}
            </Button>
          </div>
        </GalleryItem>
      </div>
    </section>
  );
}
