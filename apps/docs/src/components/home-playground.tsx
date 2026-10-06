import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@adila-sh/ui";

const COLORS = [
  { name: "Principal", token: "--primary" },
  { name: "Sucesso", token: "--success" },
  { name: "Informação", token: "--info" },
  { name: "Aviso", token: "--warning" },
  { name: "Superfície", token: "--muted" },
] as const;

export function HomePlayground() {
  const [notifications, setNotifications] = useState(true);
  const [summary, setSummary] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Tabs defaultValue="interface" className="home-playground">
      <TabsList aria-label="Explorar o design system" className="mx-auto">
        <TabsTrigger value="interface">Interface</TabsTrigger>
        <TabsTrigger value="colors">Cores</TabsTrigger>
        <TabsTrigger value="type">Tipografia</TabsTrigger>
      </TabsList>
      <TabsContent value="interface" className="home-demo-panel">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="mb-3">
              <Badge variant="secondary">Demonstração interativa</Badge>
            </div>
            <CardTitle>Do seu jeito.</CardTitle>
            <CardDescription>
              Uma interface simples para escolher o que acompanhar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="home-notifications">
                    Notificações
                  </FieldLabel>
                  <FieldDescription>
                    Receba as atualizações do produto.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="home-notifications"
                  checked={notifications}
                  onCheckedChange={(value) => {
                    setNotifications(value);
                    setSaved(false);
                  }}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="home-summary">Resumo semanal</FieldLabel>
                  <FieldDescription>
                    Os destaques em um só lugar.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="home-summary"
                  checked={summary}
                  onCheckedChange={(value) => {
                    setSummary(value);
                    setSaved(false);
                  }}
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-wrap justify-between gap-3">
            <p role="status" className="text-xs text-muted-foreground">
              {saved
                ? "Preferências aplicadas à demonstração."
                : "Experimente os controles."}
            </p>
            <Button onClick={() => setSaved(true)}>
              {saved ? "Aplicado" : "Aplicar"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="colors" className="home-demo-panel">
        <div className="home-color-samples">
          <div>
            <h3>Cor com intenção.</h3>
            <p>Tokens semânticos que acompanham os temas claro e escuro.</p>
          </div>
          <div className="home-swatches">
            {COLORS.map((color) => (
              <div key={color.token}>
                <span
                  aria-hidden="true"
                  style={{ background: `var(${color.token})` }}
                />
                <p>{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="type" className="home-demo-panel">
        <div className="home-type-samples">
          <div>
            <p>Adila Std</p>
            <span className="home-type-std">Clareza em cada detalhe.</span>
          </div>
          <div>
            <p>Adila Code</p>
            <span className="font-mono">const design = consistente;</span>
          </div>
          <div>
            <p>Adila Pixel</p>
            <span className="font-pixel">Um toque de identidade.</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
