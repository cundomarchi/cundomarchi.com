// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function QuoteSection({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <section className="section" id="quote">
      <div className="wrap">
        <div className="quote-intro">
          <span className="eyebrow" data-en="Let's Talk" data-es="Hablemos">
            {t("Let's Talk", "Hablemos")}
          </span>{" "}
          <h2 className="section-title" data-en="Let's Work Together" data-es="Trabajemos Juntos">
            {t("Let's Work Together", "Trabajemos Juntos")}
          </h2>
          <p
            data-en="Every mural begins with something real: an idea, a wall and the feeling a place should carry. I listen to the story behind the project and turn it into an image that belongs to that space."
            data-es="Cada mural empieza con algo real: una idea, una pared y la sensación que ese lugar debería transmitir. Escucho la historia detrás del proyecto y la convierto en una imagen que pertenezca a ese espacio."
          >
            {t(
              "Every mural begins with something real: an idea, a wall and the feeling a place should carry. I listen to the story behind the project and turn it into an image that belongs to that space.",
              "Cada mural empieza con algo real: una idea, una pared y la sensación que ese lugar debería transmitir. Escucho la historia detrás del proyecto y la convierto en una imagen que pertenezca a ese espacio.",
            )}
          </p>
          <p
            data-en="From our first conversation to the finished wall, wherever the project takes us."
            data-es="Desde nuestra primera conversación hasta la pared terminada, adonde sea que nos lleve el proyecto."
          >
            {t(
              "From our first conversation to the finished wall, wherever the project takes us.",
              "Desde nuestra primera conversación hasta la pared terminada, adonde sea que nos lleve el proyecto.",
            )}
          </p>
          <p
            className="quote-reassurance"
            data-en="Based in Australia, available worldwide. I usually reply within 24–48 hours."
            data-es="Con base en Australia y disponible en todo el mundo. Normalmente respondo dentro de 24–48 horas."
          >
            {t(
              "Based in Australia, available worldwide. I usually reply within 24–48 hours.",
              "Con base en Australia y disponible en todo el mundo. Normalmente respondo dentro de 24–48 horas.",
            )}
          </p>
        </div>
        <div className="quote-layout">
          <div className="quote-content">
            <div className="quote-box">
              <div className="step active" id="wallFormStep">
                <div style={{ display: "flex", gap: "16px" }}>
                  <input
                    className="field"
                    id="w-first"
                    data-en-ph="First Name *"
                    data-es-ph="Nombre *"
                    placeholder={t("First Name *", "Nombre *")}
                  />
                  <input
                    className="field"
                    id="w-last"
                    data-en-ph="Last Name *"
                    data-es-ph="Apellido *"
                    placeholder={t("Last Name *", "Apellido *")}
                  />
                </div>
                <input
                  className="field"
                  id="w-email"
                  type="email"
                  data-en-ph="Email *"
                  data-es-ph="Email *"
                  placeholder="Email *"
                />
                <input
                  className="field"
                  id="w-phone"
                  type="tel"
                  data-en-ph="Phone"
                  data-es-ph="Teléfono"
                  placeholder={t("Phone", "Teléfono")}
                />
                <input
                  className="field"
                  id="w-location"
                  data-en-ph="Location (City, State/Country) *"
                  data-es-ph="Ubicación (Ciudad, Provincia/País) *"
                  placeholder={t("Location (City, State/Country) *", "Ubicación (Ciudad, Provincia/País) *")}
                />
                <input
                  className="field"
                  id="w-company"
                  data-en-ph="Company / Organization (if applicable)"
                  data-es-ph="Empresa / Organización (si corresponde)"
                  placeholder={t("Company / Organization (if applicable)", "Empresa / Organización (si corresponde)")}
                />
                <p
                  className="step-label required-label"
                  style={{ marginTop: "14px" }}
                  data-en="Type of Art"
                  data-es="Tipo de Arte"
                >
                  {t("Type of Art", "Tipo de Arte")}
                </p>
                <select className="field" data-on-change="chooseArtTypeSelect(this)">
                  <option value="" data-en="Select..." data-es="Seleccionar...">
                    {t("Select...", "Seleccionar...")}
                  </option>
                  <option value="mural" data-en="Mural" data-es="Mural">
                    Mural
                  </option>
                  <option value="live" data-en="Live Painting" data-es="Pintura en Vivo">
                    {t("Live Painting", "Pintura en Vivo")}
                  </option>
                  <option value="workshop" data-en="Paint Workshop" data-es="Taller de Pintura">
                    {t("Paint Workshop", "Taller de Pintura")}
                  </option>
                </select>
                <div id="artMuralBlock" style={{ display: "none" }}>
                  <p
                    className="step-label required-label"
                    style={{ marginTop: "14px" }}
                    data-en="Type of Wall"
                    data-es="Tipo de Pared"
                  >
                    {t("Type of Wall", "Tipo de Pared")}
                  </p>
                  <select className="field" data-on-change="chooseWallSelect(this,'wallType')">
                    <option value="" data-en="Select..." data-es="Seleccionar...">
                      {t("Select...", "Seleccionar...")}
                    </option>
                    <option data-en="Home Interior" data-es="Interior de Casa">
                      {t("Home Interior", "Interior de Casa")}
                    </option>
                    <option data-en="Commercial Space" data-es="Espacio Comercial">
                      {t("Commercial Space", "Espacio Comercial")}
                    </option>
                    <option data-en="Exterior Wall / Public Space" data-es="Pared Exterior / Espacio Público">
                      {t("Exterior Wall / Public Space", "Pared Exterior / Espacio Público")}
                    </option>
                  </select>
                  <p
                    className="step-label required-label"
                    style={{ marginTop: "14px" }}
                    data-en="Approximate Size (ft/m)"
                    data-es="Medidas Aproximadas (ft/m)"
                  >
                    {t("Approximate Size (ft/m)", "Medidas Aproximadas (ft/m)")}
                  </p>
                  <input
                    className="field"
                    id="w-size"
                    data-en-ph="e.g. 6m x 3m (or ft)"
                    data-es-ph="ej. 6m x 3m (o ft)"
                    placeholder={t("e.g. 6m x 3m (or ft)", "ej. 6m x 3m (o ft)")}
                  />
                  <p
                    className="step-label"
                    style={{ marginTop: "14px" }}
                    data-en="Photo of Your Wall (optional)"
                    data-es="Foto de tu Pared (opcional)"
                  >
                    {t("Photo of Your Wall (optional)", "Foto de tu Pared (opcional)")}
                  </p>
                  <p
                    style={{ color: "var(--gray)", fontSize: "13px", marginTop: "-8px", marginBottom: "10px" }}
                    data-en="A photo of the space helps me quote faster and more accurately"
                    data-es="Una foto del espacio me ayuda a cotizar más rápido y con más precisión"
                  >
                    {t(
                      "A photo of the space helps me quote faster and more accurately",
                      "Una foto del espacio me ayuda a cotizar más rápido y con más precisión",
                    )}
                  </p>
                  <input
                    className="field"
                    id="w-photo"
                    type="file"
                    accept="image/*"
                    style={{ padding: "10px" }}
                    data-on-change="handleWallPhotoChange(this)"
                  />
                  <p
                    id="w-photo-name"
                    style={{
                      color: "var(--gray)",
                      fontSize: "12px",
                      marginTop: "6px",
                      marginBottom: "10px",
                      display: "none",
                    }}
                  ></p>
                </div>
                <div id="artLiveBlock" style={{ display: "none" }}>
                  <p
                    className="step-label"
                    style={{ marginTop: "14px" }}
                    data-en="How many people will attend?"
                    data-es="¿Cuántas personas asisten?"
                  >
                    {t("How many people will attend?", "¿Cuántas personas asisten?")}
                  </p>
                  <select className="field" data-on-change="chooseWallSelect(this,'attendance')">
                    <option value="" data-en="Select..." data-es="Seleccionar...">
                      {t("Select...", "Seleccionar...")}
                    </option>
                    <option data-en="1 – 50" data-es="1 – 50">
                      1 – 50
                    </option>
                    <option data-en="51 – 150" data-es="51 – 150">
                      51 – 150
                    </option>
                    <option data-en="151 – 400" data-es="151 – 400">
                      151 – 400
                    </option>
                    <option data-en="400+" data-es="400+">
                      400+
                    </option>
                  </select>
                </div>
                <div id="artWorkshopBlock" style={{ display: "none" }}>
                  <p
                    className="step-label"
                    style={{ marginTop: "14px" }}
                    data-en="What kind of workshop?"
                    data-es="¿Qué tipo de taller?"
                  >
                    {t("What kind of workshop?", "¿Qué tipo de taller?")}
                  </p>
                  <select className="field" data-on-change="chooseWallSelect(this,'workshopType')">
                    <option value="" data-en="Select..." data-es="Seleccionar...">
                      {t("Select...", "Seleccionar...")}
                    </option>
                    <option data-en="Community Mural" data-es="Mural Comunitario">
                      {t("Community Mural", "Mural Comunitario")}
                    </option>
                    <option data-en="Individual Canvas" data-es="Lienzo Individual">
                      {t("Individual Canvas", "Lienzo Individual")}
                    </option>
                  </select>
                  <p
                    className="step-label"
                    style={{ marginTop: "14px" }}
                    data-en="Group size"
                    data-es="Tamaño del grupo"
                  >
                    {t("Group size", "Tamaño del grupo")}
                  </p>
                  <select className="field" data-on-change="chooseWallSelect(this,'groupSize')">
                    <option value="" data-en="Select..." data-es="Seleccionar...">
                      {t("Select...", "Seleccionar...")}
                    </option>
                    <option data-en="1 – 10" data-es="1 – 10">
                      1 – 10
                    </option>
                    <option data-en="11 – 25" data-es="11 – 25">
                      11 – 25
                    </option>
                    <option data-en="26 – 50" data-es="26 – 50">
                      26 – 50
                    </option>
                    <option data-en="50+" data-es="50+">
                      50+
                    </option>
                  </select>
                </div>
                <div id="wallBudgetBlock">
                  <p className="step-label" style={{ marginTop: "14px" }} data-en="Budget" data-es="Presupuesto">
                    {t("Budget", "Presupuesto")}
                  </p>
                  <select className="field" data-on-change="chooseWallSelect(this,'budget')">
                    <option value="" data-en="Select..." data-es="Seleccionar...">
                      {t("Select...", "Seleccionar...")}
                    </option>
                    {/* Los tramos van fijos en dolares australianos: el presupuesto
                 no cambia cuando alguien mira los
                 precios de la tienda en otra moneda. */}
                    <option>{"< A$2,500 AUD"}</option>
                    <option>A$2,500 – A$5,000 AUD</option>
                    <option>A$5,000 – A$10,000 AUD</option>
                    <option>{"> A$10,000 AUD"}</option>
                    <option data-en="Not sure yet" data-es="Todavía no sé">
                      {t("Not sure yet", "Todavía no sé")}
                    </option>
                  </select>
                </div>
                <p
                  className="step-label"
                  style={{ marginTop: "14px" }}
                  data-en="Preferred Date"
                  data-es="Fecha Preferida"
                >
                  {t("Preferred Date", "Fecha Preferida")}
                </p>
                <p
                  style={{ color: "var(--gray)", fontSize: "13px", marginTop: "-8px", marginBottom: "10px" }}
                  data-en="When would you like this done by, ideally?"
                  data-es="¿Para cuándo te gustaría tenerlo listo, idealmente?"
                >
                  {t(
                    "When would you like this done by, ideally?",
                    "¿Para cuándo te gustaría tenerlo listo, idealmente?",
                  )}
                </p>
                <input
                  className="field"
                  id="w-date"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  data-en-ph="DD/MM/YYYY"
                  data-es-ph="DD/MM/AAAA"
                  placeholder={t("DD/MM/YYYY", "DD/MM/AAAA")}
                  data-on-input="formatDateInput(this)"
                />
                <p
                  className="step-label required-label"
                  style={{ marginTop: "14px" }}
                  data-en="Project / Event Details"
                  data-es="Detalles del Proyecto / Evento"
                >
                  {t("Project / Event Details", "Detalles del Proyecto / Evento")}
                </p>
                <p
                  style={{ color: "var(--gray)", fontSize: "13px", marginTop: "-8px", marginBottom: "10px" }}
                  data-en="Describe your wall, event or group, and your idea/vision for it"
                  data-es="Describí tu pared, evento o grupo, y tu idea/visión"
                >
                  {t(
                    "Describe your wall, event or group, and your idea/vision for it",
                    "Describí tu pared, evento o grupo, y tu idea/visión",
                  )}
                </p>
                <textarea
                  className="field"
                  id="w-details"
                  rows={4}
                  style={{ resize: "none", overflow: "hidden" }}
                  data-on-input="autoGrow(this)"
                />
                <p
                  id="wallFormError"
                  style={{
                    color: "#e0b667",
                    fontSize: "12px",
                    marginTop: "4px",
                    marginBottom: "14px",
                    display: "none",
                  }}
                  data-en="Please fill in all required fields (*)."
                  data-es="Completá todos los campos obligatorios (*)."
                >
                  {t("Please fill in all required fields (*).", "Completá todos los campos obligatorios (*).")}
                </p>
                <p
                  className="form-privacy"
                  data-en="Your project details are used only to prepare and reply to your quote. They are never shared with third parties."
                  data-es="Los datos de tu proyecto se usan únicamente para preparar y responder tu cotización. Nunca se comparten con terceros."
                >
                  {t(
                    "Your project details are used only to prepare and reply to your quote. They are never shared with third parties.",
                    "Los datos de tu proyecto se usan únicamente para preparar y responder tu cotización. Nunca se comparten con terceros.",
                  )}
                </p>
                <div className="step-nav">
                  <span></span>
                  <button
                    className="btn-primary"
                    id="wallSubmitBtn"
                    style={{ padding: "12px 28px", fontSize: "12px" }}
                    data-on-click="submitWallForm()"
                    data-en="Submit"
                    data-es="Enviar"
                  >
                    {t("Submit", "Enviar")}
                  </button>
                </div>
              </div>
              <div className="step confirm" id="wallFormConfirm">
                <div className="check">✓</div>
                <h3 data-en="Got it." data-es="¡Listo!">
                  {t("Got it.", "¡Listo!")}
                </h3>
                <p
                  data-en="I'll get back to you within 24–48 hours with a personalized quote."
                  data-es="Te respondo en 24–48 horas con un presupuesto personalizado."
                >
                  {t(
                    "I'll get back to you within 24–48 hours with a personalized quote.",
                    "Te respondo en 24–48 horas con un presupuesto personalizado.",
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="quote-photo-wrap">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/quote_photo.jpg"
              alt={t("Cundo Marchi painting the Coral Heart mural", "Cundo Marchi pintando el mural Coral Heart")}
              data-key="quote_photo"
              width={1200}
              height={1600}
              srcSet="/images/site/quote_photo-600.jpg 600w, /images/site/quote_photo-800.jpg 800w, /images/site/quote_photo.jpg 1200w"
              sizes="(max-width:700px) 92vw, 420px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
