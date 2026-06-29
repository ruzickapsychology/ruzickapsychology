import { urlFor } from '@/sanity/lib/image'

type SanityImageAsset = {
  _id?: string
  url?: string
  metadata?: {
    dimensions?: {
      width?: number
      height?: number
    }
  }
}

export type SanityImageValue = {
  asset?: SanityImageAsset | null
  alt?: string | null
} | null | undefined

type BackgroundImageOptions = {
  width?: number
  width2x?: number
  quality?: number
}

const DEFAULT_BACKGROUND_WIDTH = 900
const DEFAULT_BACKGROUND_WIDTH_2X = 1400
const DEFAULT_BACKGROUND_QUALITY = 72

function cssUrl(url: string) {
  return `url("${url}")`
}

export function imageUrl(
  image: SanityImageValue,
  {
    width = DEFAULT_BACKGROUND_WIDTH,
    quality = DEFAULT_BACKGROUND_QUALITY,
  }: Pick<BackgroundImageOptions, 'width' | 'quality'> = {},
) {
  if (image?.asset?._id) {
    return urlFor(image)
      .width(width)
      .quality(quality)
      .auto('format')
      .url()
  }

  return image?.asset?.url
}

export function imageSrc(image: SanityImageValue) {
  return image?.asset?.url
}

export function backgroundImage(
  image: SanityImageValue,
  {
    width = DEFAULT_BACKGROUND_WIDTH,
    width2x = DEFAULT_BACKGROUND_WIDTH_2X,
    quality = DEFAULT_BACKGROUND_QUALITY,
  }: BackgroundImageOptions = {},
) {
  const url = imageUrl(image, {width, quality})
  if (!url) return undefined

  const highDensityUrl = imageUrl(image, {width: width2x, quality})
  if (!highDensityUrl || highDensityUrl === url) return cssUrl(url)

  return `image-set(${cssUrl(url)} 1x, ${cssUrl(highDensityUrl)} 2x)`
}

export function overlayBackgroundImage(
  image: SanityImageValue,
  overlay: string,
  options?: BackgroundImageOptions,
) {
  const imageSet = backgroundImage(image, options)
  return imageSet ? `${overlay}, ${imageSet}` : overlay
}
