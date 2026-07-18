"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

function BottomBar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Navegação principal"
      data-slot="bottom-bar"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden",
        className,
      )}
      {...props}
    />
  );
}

function BottomBarList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="bottom-bar-list"
      className={cn(
        "mx-auto flex h-16 w-full max-w-lg items-stretch",
        className,
      )}
      {...props}
    />
  );
}

function BottomBarItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="bottom-bar-item"
      className={cn("flex min-w-0 flex-1", className)}
      {...props}
    />
  );
}

const bottomBarButtonVariants = cva(
  "relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      isActive: {
        true: "text-primary after:absolute after:top-0 after:h-0.5 after:w-8 after:rounded-b-full after:bg-primary",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

function BottomBarButton({
  className,
  isActive = false,
  render,
  ...props
}: useRender.ComponentProps<"button"> &
  VariantProps<typeof bottomBarButtonVariants>) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-current": isActive ? "page" : undefined,
        className: cn(bottomBarButtonVariants({ isActive, className })),
        type: "button",
      },
      props,
    ),
    render,
    state: {
      slot: "bottom-bar-button",
      active: isActive,
    },
  });
}

function BottomBarLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="bottom-bar-label"
      className={cn("max-w-full truncate", className)}
      {...props}
    />
  );
}

function BottomBarDrawer({
  showSwipeHandle = true,
  ...props
}: React.ComponentProps<typeof Drawer>) {
  return <Drawer showSwipeHandle={showSwipeHandle} {...props} />;
}

function BottomBarDrawerTrigger({
  className,
  isActive = false,
  ...props
}: React.ComponentProps<typeof DrawerTrigger> &
  VariantProps<typeof bottomBarButtonVariants>) {
  return (
    <DrawerTrigger
      data-slot="bottom-bar-drawer-trigger"
      className={cn(bottomBarButtonVariants({ isActive, className }))}
      {...props}
    />
  );
}

function BottomBarDrawerContent({
  className,
  ...props
}: React.ComponentProps<typeof DrawerContent>) {
  return (
    <DrawerContent
      data-slot="bottom-bar-drawer-content"
      className={cn("[--drawer-content-max-height:85dvh]", className)}
      {...props}
    />
  );
}

export {
  BottomBar,
  BottomBarButton,
  BottomBarDrawer,
  BottomBarDrawerContent,
  BottomBarDrawerTrigger,
  BottomBarItem,
  BottomBarLabel,
  BottomBarList,
  bottomBarButtonVariants,
};
