import type { ComponentProps } from "react";
import { BackgroundImageLayer } from "@/components/background-image-layer";
import type { SanityImageValue } from "@/config/cms-images";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const sizes = {
  sm: styles.sm,
  md: styles.md,
} as const;

export function CircularPortrait({
  image,
  alt,
  size = "md",
  className,
  imageClassName,
  imageSizes,
  sticky = false,
  ...props
}: {
  image: SanityImageValue;
  alt: string;
  size?: keyof typeof sizes;
  imageClassName?: string;
  imageSizes?: string;
  sticky?: boolean | "md";
} & Omit<ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="circular-portrait"
      data-size={size}
      data-sticky={sticky || undefined}
      className={cn(
        styles.shell,
        sizes[size],
        sticky === true && styles.sticky,
        sticky === "md" && styles.stickyMd,
        className,
      )}
      {...props}
    >
      <div data-slot="circular-portrait-frame" className={styles.frame}>
        <BackgroundImageLayer
          image={image}
          alt={alt}
          className={imageClassName}
          sizes={imageSizes}
        />
      </div>
    </div>
  );
}
