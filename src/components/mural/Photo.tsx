import type { Photo as PhotoData } from "@/data/mural-types";

/** <img> con sus variantes de tamano. Las fotos se sirven tal cual, ya optimizadas. */
export function Photo({ photo, className, style }: { photo: PhotoData; className?: string; style?: PhotoData["style"] }) {
  const cls = [className, photo.className].filter(Boolean).join(" ") || undefined;
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={photo.loading}
      fetchPriority={photo.fetchPriority}
      decoding="async"
      data-key={photo.dataKey}
      className={cls}
      style={{ ...photo.style, ...style }}
    />
  );
}
