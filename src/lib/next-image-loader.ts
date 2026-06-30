type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function sanityNextImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (!src.includes("cdn.sanity.io")) return src;

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality ?? 72}&auto=format`;
}
