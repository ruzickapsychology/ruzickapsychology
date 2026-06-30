import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import type { SanityImageValue } from "@/lib/cms-images";
import styles from "./styles.module.css";

const sizes = {
  sm: styles.sm,
  md: styles.md,
} as const;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CircularPortrait({
  image,
  alt,
  size = "md",
  className,
  imageClassName,
  imageSizes,
  sticky = false,
}: {
  image: SanityImageValue;
  alt: string;
  size?: keyof typeof sizes;
  className?: string;
  imageClassName?: string;
  imageSizes?: string;
  sticky?: boolean | "md";
}) {
  return (
    <div
      className={classNames(
        styles.shell,
        sizes[size],
        sticky === true && styles.sticky,
        sticky === "md" && styles.stickyMd,
        className,
      )}
    >
      <div className={styles.frame}>
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
