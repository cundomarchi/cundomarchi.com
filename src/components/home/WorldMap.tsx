import { MAP_GROUP_CLASS, MAP_VIEWBOX, mapShapes } from "@/data/world-map";

/** Mapa de los paises donde se pintaron murales (script.js lo anima al aparecer). */
export function WorldMap({ ariaLabel }: { ariaLabel: string }) {
  return (
    <svg viewBox={MAP_VIEWBOX} className="world-map-svg" id="worldMapSvg" role="img" aria-label={ariaLabel}>
      <g className={MAP_GROUP_CLASS}>
        {mapShapes.map((s, i) => (
          <path key={i} className={s.className} data-country={s.country} d={s.d} />
        ))}
      </g>
    </svg>
  );
}
