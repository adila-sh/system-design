import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { ptBR } from '@/lib/translations';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content:
          'Design system adila.co: registry shadcn sobre Base UI, tema verde adila.co, light & dark.',
      },
      {
        title: 'DS | Adila.co',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://assets.adila.co', crossOrigin: 'anonymous' },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://assets.adila.co/fonts/woff2/CircularStd-Book.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://assets.adila.co/fonts/woff2/CircularStd-Medium.woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={{ locale: 'pt-br', translations: ptBR }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
