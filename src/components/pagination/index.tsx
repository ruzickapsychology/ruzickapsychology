import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { Eyebrow } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  className,
  ...props
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => LinkProps<string>["href"];
} & Omit<ComponentProps<"nav">, "children">) {
  if (totalPages <= 1) return null;

  return (
    <nav
      data-slot="pagination"
      aria-label="Pagination"
      className={cn(styles.root, className)}
      {...props}
    >
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <Link
            data-slot="pagination-link"
            key={page}
            href={hrefForPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(styles.link, page === currentPage && styles.active)}
          >
            <Eyebrow as="span" variant="meta" tone="inherit">
              {page}
            </Eyebrow>
          </Link>
        ),
      )}
    </nav>
  );
}
