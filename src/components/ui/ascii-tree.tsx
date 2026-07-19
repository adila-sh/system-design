import * as React from "react";

import { cn } from "@/lib/utils";

type AsciiTreeNode = {
  id?: React.Key;
  label: string;
  meta?: string;
  children?: AsciiTreeNode[];
};

type AsciiTreeProps = Omit<React.ComponentProps<"div">, "children"> & {
  nodes: AsciiTreeNode[];
  label?: string;
};

type TreeNodeProps = {
  node: AsciiTreeNode;
  prefix: string;
  isLast: boolean;
  level: number;
};

function TreeNode({ node, prefix, isLast, level }: TreeNodeProps) {
  const connector = isLast ? "└─" : "├─";
  const childPrefix = prefix + (isLast ? "  " : "│ ");
  const children = node.children ?? [];

  return (
    <div
      role="treeitem"
      aria-level={level}
      aria-expanded={children.length > 0 ? true : undefined}
    >
      <div className="flex items-baseline gap-0 leading-snug">
        <span aria-hidden="true" className="text-muted-foreground/40">
          {prefix}
          {connector}{" "}
        </span>
        <span className="text-foreground">{node.label}</span>
        {node.meta ? (
          <span className="ml-1.5 text-muted-foreground/60">{node.meta}</span>
        ) : null}
      </div>
      {children.length > 0 ? (
        <div role="group">
          {children.map((child, index) => (
            <TreeNode
              key={child.id ?? `${child.label}-${index}`}
              node={child}
              prefix={childPrefix}
              isLast={index === children.length - 1}
              level={level + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AsciiTree({
  nodes,
  label = "Árvore",
  className,
  ...props
}: AsciiTreeProps) {
  return (
    <div
      data-slot="ascii-tree"
      role="tree"
      aria-label={label}
      className={cn("font-mono text-sm", className)}
      {...props}
    >
      {nodes.map((node, index) => (
        <TreeNode
          key={node.id ?? `${node.label}-${index}`}
          node={node}
          prefix=""
          isLast={index === nodes.length - 1}
          level={1}
        />
      ))}
    </div>
  );
}

export { AsciiTree };
export type { AsciiTreeNode, AsciiTreeProps };
