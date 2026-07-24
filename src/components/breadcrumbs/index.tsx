import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: LinkProps<string>["href"];
};

export function Breadcrumbs({
  items,
  className,
  ...props
}: {
  items: readonly BreadcrumbItem[];
} & Omit<ComponentProps<"nav">, "children">) {
  return (
    <nav
      data-slot="breadcrumbs"
      aria-label="Breadcrumb"
      className={cn(styles.root, className)}
      {...props}
    >
      <ol data-slot="breadcrumbs-list" className={styles.list}>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li
              data-slot="breadcrumbs-item"
              key={item.label}
              className={styles.item}
            >
              {index > 0 ? (
                <span
                  data-slot="breadcrumbs-separator"
                  className={styles.separator}
                  aria-hidden
                >
                  /
                </span>
              ) : null}
              {item.href && !current ? (
                <Link
                  data-slot="breadcrumbs-link"
                  href={item.href}
                  className={styles.link}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  data-slot="breadcrumbs-current"
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
