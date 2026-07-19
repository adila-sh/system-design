---
name: use-adila-sidebar
description: Implement, refactor, or debug responsive application shells with the Adila Sidebar React component. Use when working with src/components/ui/sidebar.tsx, SidebarProvider, collapsible sidebars, active navigation, mobile sidebar behavior, persisted open state, or router layouts that must preserve the sidebar across page navigation.
---

# Use Adila Sidebar

Build the sidebar as persistent application chrome. Inspect
`src/components/ui/sidebar.tsx` and `content/docs/components/sidebar.mdx` before
changing its API or behavior.

## Compose the shell

Mount one `SidebarProvider` around one `Sidebar` and the corresponding
`SidebarInset`. Put page content in the inset.

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <Header />
    <Outlet />
  </SidebarInset>
</SidebarProvider>
```

Place this composition in the router's persistent layout, not inside each page.
With TanStack Router file routes, prefer a pathless parent such as `_app.tsx`
and make application pages its children. Keep the provider mounted while the
`Outlet` changes. Do not solve route remounts with module-global UI state.

## Build navigation

- Use `Sidebar collapsible="icon"` for compact desktop navigation,
  `"offcanvas"` for fully hidden navigation, or `"none"` for a fixed sidebar.
- Render router links through `SidebarMenuButton`, for example
  `render={<Link to={item.href} />}`.
- Derive `isActive` from the router pathname or route matching.
- Supply `tooltip` on icon-collapsible menu buttons so collapsed items remain
  understandable.
- Keep each visible label in a `<span>`; the sidebar's state selectors handle
  collapsed presentation.
- Use `SidebarTrigger` rather than implementing a separate desktop toggle.
  The provider also supports `Cmd/Ctrl + B`.
- Let the component's mobile `Sheet` behavior handle small screens. Do not use
  desktop collapsed state as mobile drawer state.

## Manage state

Use the provider uncontrolled unless the application genuinely owns the state:

```tsx
<SidebarProvider defaultOpen>{/* shell */}</SidebarProvider>
```

For controlled usage, pass both `open` and `onOpenChange`. Keep the controlled
state in the persistent layout. The component writes `sidebar_state` as a
cookie and restores it after hydration; preserve this behavior when editing the
provider.

## Verify changes

1. Collapse the desktop sidebar and navigate across at least two child routes.
   Confirm it stays collapsed without flicker.
2. Refresh and confirm the cookie preference is restored.
3. Check active item styling, collapsed tooltips, `Cmd/Ctrl + B`, and the mobile
   drawer.
4. Run `npm run typecheck`, `npm run lint`, and the relevant smoke/build check.

Avoid mounting a provider per page, duplicating shell markup across routes,
nested interactive elements, or reading `document` during server rendering.
