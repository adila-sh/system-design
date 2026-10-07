import { useState } from "react";
import { Button } from "@adila-sh/ui/button";
import { Toaster, createToastManager } from "@adila-sh/ui/toast";

export function ToastDemo() {
  const [manager] = useState(createToastManager);
  return (
    <Toaster toastManager={manager}>
      <div className="flex w-full flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            manager.add({
              title: "Preferências salvas",
              description: "Seu tema está pronto para usar.",
              type: "success",
            })
          }
        >
          Sucesso
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            manager.add({
              title: "Não foi possível salvar",
              description: "Tente novamente em alguns instantes.",
              type: "error",
              priority: "high",
            })
          }
        >
          Erro
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const id = manager.add({
              title: "Item removido",
              description: "Você pode desfazer esta ação.",
              actionProps: {
                children: "Desfazer",
                onClick: () => {
                  manager.close(id);
                  manager.add({ title: "Item restaurado", type: "info" });
                },
              },
            });
          }}
        >
          Com ação
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void manager.promise(
              new Promise<string>((resolve) =>
                setTimeout(() => resolve("Preferências atualizadas"), 1500),
              ),
              {
                loading: "Salvando preferências…",
                success: (title) => ({
                  title,
                  description: "Esta operação é uma demonstração local.",
                  type: "success",
                }),
                error: "Não foi possível salvar",
              },
            );
          }}
        >
          Operação assíncrona
        </Button>
      </div>
    </Toaster>
  );
}
