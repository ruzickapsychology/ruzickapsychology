import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

type DividerGridProps = {
  children: ReactNode;
  columns?: 2 | 4;
  twoColumnBreakpoint?: "sm" | "md";
  className?: string;
  itemClassName?: string;
};

export function DividerGrid({
  children,
  columns = 2,
  twoColumnBreakpoint = "sm",
  className = "",
  itemClassName = "",
}: DividerGridProps) {
  const items = Children.toArray(children);

  return (
    <div
      className={cn(
        columns === 4 ? styles.columns4 : styles.columns2,
        className,
      )}
      data-slot="divider-grid"
      data-divider-grid={columns}
    >
      {items.map((child, index) => (
        <div
          key={isValidElement(child) && child.key ? child.key : index}
          data-slot="divider-grid-item"
          className={cn(
            dividerClasses(index, items.length, columns, twoColumnBreakpoint),
            itemClassName,
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function dividerClasses(
  index: number,
  count: number,
  columns: 2 | 4,
  breakpoint: "sm" | "md",
) {
  if (columns === 4) {
    const lastTwoColumnRowStart = Math.floor((count - 1) / 2) * 2;
    const lastFourColumnRowStart = Math.floor((count - 1) / 4) * 4;
    const hasTwoColumnSibling = index % 2 === 0 && index + 1 < count;
    const hasFourColumnSibling = index % 4 !== 3 && index + 1 < count;

    return cn(
      styles.item,
      index < count - 1 ? styles.borderBottom : "",
      index >= lastTwoColumnRowStart ? styles.borderBottomOffSm : "",
      index >= lastFourColumnRowStart ? styles.borderBottomOffLg : "",
      hasTwoColumnSibling ? styles.borderRightSm : "",
      hasFourColumnSibling ? styles.borderRightLg : "",
    );
  }

  const borderRight =
    breakpoint === "md" ? styles.borderRightMd : styles.borderRightSm;
  const borderBottomOff =
    breakpoint === "md" ? styles.borderBottomOffMd : styles.borderBottomOffSm;
  const lastRowStart = Math.floor((count - 1) / columns) * columns;
  const hasColumnSibling = index % columns === 0 && index + 1 < count;

  return cn(
    styles.item,
    index < count - 1 ? styles.borderBottom : "",
    hasColumnSibling ? borderRight : "",
    index >= lastRowStart ? borderBottomOff : "",
  );
}
