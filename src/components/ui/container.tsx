import type { ComponentProps } from "react";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-[1200px]",
} as const;

export function Container({
  size = "lg",
  className = "",
  ...props
}: { size?: keyof typeof widths } & ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-10 ${widths[size]} ${className}`.trim()}
      {...props}
    />
  );
}
