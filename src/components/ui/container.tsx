import type { ComponentProps } from "react";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
} as const;

export function Container({
  size = "lg",
  className = "",
  ...props
}: { size?: keyof typeof widths } & ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-8 ${widths[size]} ${className}`.trim()}
      {...props}
    />
  );
}
