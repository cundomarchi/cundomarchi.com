// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function EditTools({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <>
      <button
        className="edit-toggle"
        id="editToggle"
        type="button"
        data-on-click="toggleEditMode()"
        style={{ display: "none" }}
      >
        ✎ Editar fotos y textos
      </button>
      <div className="bg-opacity-panel" id="bgOpacityPanel">
        <div className="bg-target-label">
          <span>
            <span data-en="Editing:" data-es="Editando:">
              {t("Editing:", "Editando:")}
            </span>{" "}
            <strong id="bgTargetName">—</strong>
          </span>
          <button className="bg-none-btn" data-on-click="clearSectionBg()" data-en="No photo" data-es="Sin foto">
            {t("No photo", "Sin foto")}
          </button>
        </div>
        <button
          className="bg-video-btn"
          id="bgVideoBtn"
          data-on-click="document.getElementById('bgVideoInput').click()"
        >
          📷{" "}
          <span data-en="Change photo/video" data-es="Cambiar foto/video">
            {t("Change photo/video", "Cambiar foto/video")}
          </span>
        </button>
        <div className="bg-adjust-row">
          <span data-en="Transparency" data-es="Transparencia">
            {t("Transparency", "Transparencia")}
          </span>
          <input
            type="range"
            id="bgOpacitySlider"
            min="1"
            max="100"
            defaultValue="50"
            data-on-input="setBgOpacity(this.value)"
          />
        </div>
        <div className="bg-adjust-row">
          <span data-en="Zoom" data-es="Zoom">
            Zoom
          </span>
          <input
            type="range"
            id="bgZoomSlider"
            min="100"
            max="250"
            defaultValue="100"
            data-on-input="setBgZoom(this.value)"
          />
        </div>
        <div className="bg-pos-controls">
          <span data-en="Position" data-es="Posición">
            {t("Position", "Posición")}
          </span>{" "}
          <div className="bg-pos-grid">
            <span></span>
            <button data-on-click="nudgeBg(0,-1)" title="Up">
              ▲
            </button>
            <span></span>{" "}
            <button data-on-click="nudgeBg(-1,0)" title="Left">
              ◀
            </button>
            <button data-on-click="resetBgTransform()" title="Reset">
              ↺
            </button>
            <button data-on-click="nudgeBg(1,0)" title="Right">
              ▶
            </button>{" "}
            <span></span>
            <button data-on-click="nudgeBg(0,1)" title="Down">
              ▼
            </button>
            <span></span>
          </div>
        </div>
      </div>
      <input type="file" id="bgVideoInput" accept="image/*,video/*" style={{ display: "none" }} />
      <div className="edit-toast" id="editToast"></div>
      <input type="file" id="fileInput" accept="image/*" multiple style={{ display: "none" }} />
    </>
  );
}
