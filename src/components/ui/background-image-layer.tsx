import Image from "next/image";
import { imageSrc, type SanityImageValue } from "@/lib/cms-images";

export function BackgroundImageLayer({
  image,
  alt = "",
  className = "",
  eager = false,
  objectPosition,
  quality = 72,
  sizes = "100vw",
}: {
  image: SanityImageValue;
  alt?: string;
  className?: string;
  eager?: boolean;
  objectPosition?: string;
  quality?: number;
  sizes?: string;
}) {
  const src = imageSrc(image);
  if (!src) return null;

  return (
    <Image
      alt={alt}
      className={`absolute inset-0 z-0 object-cover ${className}`.trim()}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      fill
      loading={eager ? "eager" : "lazy"}
      quality={quality}
      sizes={sizes}
      src={src}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
