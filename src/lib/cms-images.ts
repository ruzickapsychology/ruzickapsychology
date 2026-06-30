type SanityImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
    lqip?: string;
  };
};

export type SanityImageValue =
  | {
      asset?: SanityImageAsset | null;
      alt?: string | null;
      crop?: Record<string, unknown> | null;
      hotspot?: Record<string, unknown> | null;
    }
  | null
  | undefined;

export function imageSrc(image: SanityImageValue) {
  return image?.asset?.url;
}

export function imageBlurData(image: SanityImageValue) {
  return image?.asset?.metadata?.lqip;
}
