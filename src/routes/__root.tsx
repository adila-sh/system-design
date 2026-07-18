import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ptBR } from "@/lib/translations";

const siteUrl = "https://ds.adila.co";
const siteTitle = "DS | Adila.co";
const siteDescription =
  "Design system adila.co: registry shadcn sobre Base UI, acento indigo, light & dark.";
const ogImage = `${siteUrl}/icon-512.png`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteTitle },
      { name: "description", content: siteDescription },
      // Open Graph — preview ao compartilhar o link (Slack, WhatsApp, etc.)
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteTitle },
      { property: "og:title", content: siteTitle },
      { property: "og:description", content: siteDescription },
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      // Twitter/X
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: siteTitle },
      { name: "twitter:description", content: siteDescription },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: siteUrl },
      {
        rel: "preconnect",
        href: "https://assets.adila.co",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "https://assets.adila.co/fonts/adila-std/woff2/AdilaStd-Book.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "https://assets.adila.co/fonts/adila-std/woff2/AdilaStd-Medium.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      // Favicon dual: Safari/Firefox trocam com o tema do SO; Chrome ignora
      // `media` em rel=icon e cai no .ico (fundo azul) — degradação aceitável.
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      // Fallback universal — precisa vir depois dos com `media`.
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={{ locale: "pt-br", translations: ptBR }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
