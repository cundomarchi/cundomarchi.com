import type { Figure, GalleryBlock } from "@/data/mural-types";
import { Photo } from "./Photo";

function Figures({ figures }: { figures: Figure[] }) {
  return figures.map((f, i) => (
    <figure key={i}>
      <Photo photo={f.img} />
      <figcaption>{f.caption}</figcaption>
    </figure>
  ));
}

export function Gallery({ blocks }: { blocks: GalleryBlock[] }) {
  return blocks.map((block, i) => {
    switch (block.kind) {
      case "ba":
        return (
          <div key={i} className={block.className} style={block.style}>
            <Figures figures={block.figures} />
          </div>
        );
      case "rows":
        return (
          <div key={i} className={block.fixed ? "m-rows m-rows--fixed" : "m-rows"}>
            {block.rows.map((row, j) =>
              row.kind === "ba" ? (
                <div key={j} className={row.className} style={row.style}>
                  <Figures figures={row.figures} />
                </div>
              ) : (
                <div key={j} className="m-row" style={row.maxWidth ? { maxWidth: row.maxWidth } : undefined}>
                  {row.images.map((p, k) => (
                    <Photo key={k} photo={p} />
                  ))}
                </div>
              ),
            )}
          </div>
        );
      case "detail-ba":
        return (
          <div key={i} className={block.full ? "detail-ba detail-ba--full" : "detail-ba"}>
            <Figures figures={block.figures} />
          </div>
        );
      case "detail-gallery":
        return (
          <div key={i} className="detail-gallery">
            {block.images.map((p, k) => (
              <Photo key={k} photo={p} />
            ))}
          </div>
        );
    }
  });
}
