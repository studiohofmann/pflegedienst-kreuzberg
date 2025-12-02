import Image, { ImageProps } from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

type SanityImageProps = {
  image?: SanityImageSource | null;
  alt?: string;
  width?: number;
  height?: number;
} & Omit<ImageProps, "src" | "alt" | "width" | "height">;

export default function SanityImage({
  image,
  alt = "",
  width = 800,
  height = 600,
  ...props
}: SanityImageProps) {
  if (!image) return null;
  const imageUrl = urlFor(image).width(width).height(height).url();

  const rest = props as Record<string, unknown>;

  return (
    <Image {...rest} src={imageUrl} alt={alt} width={width} height={height} />
  );
}
