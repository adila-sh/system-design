import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Moon, Sun, ChevronDown, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  )
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  )
}

export default function App() {
  const { dark, toggle } = useTheme()

  return (
    <TooltipProvider>
      <div className="min-h-svh bg-background text-foreground">
        <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-primary" />
            <span className="text-sm font-semibold">LAI UI Registry</span>
            <Badge variant="secondary">Base UI</Badge>
          </div>
          <Button variant="outline" size="icon" onClick={toggle} aria-label="Alternar tema">
            {dark ? <Sun /> : <Moon />}
          </Button>
        </header>

        <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Design System LAI
            </h1>
            <p className="text-sm text-muted-foreground">
              Componentes shadcn sobre Base UI, tema verde LAI, light &amp; dark.
            </p>
          </div>

          <Section title="Buttons" description="Variantes e tamanhos.">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </Section>

          <Section title="Badges">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </Section>

          <Section title="Form" description="Inputs e controles.">
            <div className="grid w-72 gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="voce@lai.com" />
            </div>
            <div className="grid w-72 gap-2">
              <Label htmlFor="msg">Mensagem</Label>
              <Textarea id="msg" placeholder="Escreva algo..." />
            </div>
            <div className="grid w-56 gap-2">
              <Label>Plano</Label>
              <Select defaultValue="pro">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>

          <Section title="Selection" description="Checkbox, switch, radio, slider.">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Aceito os termos</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notif" defaultChecked />
              <Label htmlFor="notif">Notificações</Label>
            </div>
            <RadioGroup defaultValue="a" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="r-a" />
                <Label htmlFor="r-a">Opção A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="r-b" />
                <Label htmlFor="r-b">Opção B</Label>
              </div>
            </RadioGroup>
            <div className="w-64">
              <Slider defaultValue={[60]} max={100} step={1} />
            </div>
          </Section>

          <Section title="Overlays" description="Dialog, dropdown, popover, tooltip.">
            <Dialog>
              <DialogTrigger render={<Button variant="outline">Abrir Dialog</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar ação</DialogTitle>
                  <DialogDescription>
                    Essa ação carrega o DNA LAI. Deseja continuar?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Cancelar</Button>} />
                  <DialogClose render={<Button>Confirmar</Button>} />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline">
                    Menu <ChevronDown />
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger render={<Button variant="outline">Popover</Button>} />
              <PopoverContent className="w-64">
                <p className="text-sm text-muted-foreground">
                  Conteúdo flutuante posicionado com Base UI.
                </p>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Tooltip</Button>} />
              <TooltipContent>Dica rápida</TooltipContent>
            </Tooltip>

            <Button
              onClick={() =>
                toast("Evento registrado", {
                  description: "Lead Twin atualizado com sucesso.",
                })
              }
            >
              <Bell /> Toast
            </Button>
          </Section>

          <Section title="Data display" description="Card, tabs, accordion, avatar, table.">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Lead Twin</CardTitle>
                <CardDescription>Leitura comportamental ativa</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Engajamento alto detectado nos últimos 5 minutos.
              </CardContent>
              <CardFooter>
                <Button size="sm">Ver detalhes</Button>
              </CardFooter>
            </Card>

            <Tabs defaultValue="visao" className="w-72">
              <TabsList>
                <TabsTrigger value="visao">Visão</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
              </TabsList>
              <TabsContent value="visao" className="text-sm text-muted-foreground">
                Resumo do módulo.
              </TabsContent>
              <TabsContent value="dados" className="text-sm text-muted-foreground">
                Métricas detalhadas.
              </TabsContent>
            </Tabs>

            <Accordion className="w-72">
              <AccordionItem value="1">
                <AccordionTrigger>O que é o DNA LAI?</AccordionTrigger>
                <AccordionContent>
                  Camada comportamental embutida em cada módulo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger>Como consumir?</AccordionTrigger>
                <AccordionContent>
                  Via <code>npx shadcn add</code> apontando para o registry.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@lai" />
                <AvatarFallback>LA</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            <Table className="w-full max-w-md">
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>LAI-Core</TableCell>
                  <TableCell>
                    <Badge>ativo</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>LAI-Connect</TableCell>
                  <TableCell>
                    <Badge variant="secondary">beta</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section title="Feedback" description="Alert, progress, skeleton, separator.">
            <Alert className="w-96">
              <AlertTitle>Sincronização concluída</AlertTitle>
              <AlertDescription>
                Todos os leads foram processados.
              </AlertDescription>
            </Alert>
            <div className="w-64 space-y-2">
              <Label>Progresso</Label>
              <Progress value={68} />
            </div>
            <div className="w-64 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="w-64">
              <p className="text-sm">Acima</p>
              <Separator className="my-2" />
              <p className="text-sm">Abaixo</p>
            </div>
          </Section>

          <footer className="border-t pt-6 text-sm text-muted-foreground">
            LAI UI Registry — instale com{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              npx shadcn@latest add https://&lt;host&gt;/r/button.json
            </code>
          </footer>
        </main>

        <Toaster />
      </div>
    </TooltipProvider>
  )
}
