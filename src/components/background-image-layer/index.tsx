import Image from "next/image";
import {
  imageBlurData,
  imageSrc,
  type SanityImageValue,
} from "@/config/cms-images";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function BackgroundImageLayer({
  image,
  alt = "",
  className = "",
  eager = false,
  quality = 75,
  sizes = "100vw",
}: {
  image: SanityImageValue;
  alt?: string;
  className?: string;
  eager?: boolean;
  quality?: number;
  sizes?: string;
}) {
  const src = imageSrc(image);
  const blurDataURL = imageBlurData(image);
  if (!src) return null;

  return (
    <Image
      data-slot="background-image-layer"
      alt={alt}
      className={cn(styles.image, className)}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      fill
      loading={eager ? "eager" : "lazy"}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      quality={quality}
      sizes={sizes}
      src={src}
    />
  );
}
