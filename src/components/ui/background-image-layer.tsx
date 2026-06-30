import Image from "next/image";
import {
  imageBlurData,
  imageSrc,
  type SanityImageValue,
} from "@/lib/cms-images";

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
  const blurDataURL = imageBlurData(image);
  if (!src) return null;

  return (
    <Image
      alt={alt}
      className={`pointer-events-none absolute inset-0 z-0 object-cover ${className}`.trim()}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      fill
      loading={eager ? "eager" : "lazy"}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      quality={quality}
      sizes={sizes}
      src={src}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
