type SanityImageAsset = {
  url?: string
}

export type SanityImageValue = {
  asset?: SanityImageAsset | null
  alt?: string | null
} | null | undefined

export function imageUrl(image: SanityImageValue) {
  return image?.asset?.url
}

export function backgroundImage(image: SanityImageValue) {
  const url = imageUrl(image)
  return url ? `url(${url})` : undefined
}

export function overlayBackgroundImage(
  image: SanityImageValue,
  overlay: string,
) {
  const url = imageUrl(image)
  return url ? `${overlay}, url(${url})` : overlay
}
