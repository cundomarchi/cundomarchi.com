// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";
import { WorldMap } from "./WorldMap";

export function BioPage({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <div className="page" id="page-bio">
      <div className="page-bg" id="bg-bio">
        <img
          loading="lazy"
          decoding="async"
          src="/images/meeting_of_styles/meeting_of_styles_after.jpg"
          alt={t("Meeting of Styles mural, Malmo, Sweden", "Mural Meeting of Styles, Malmo, Sweden")}
          data-key="bg_bio"
          width={1200}
          height={1600}
          srcSet="/images/meeting_of_styles/meeting_of_styles_after-600.jpg 600w, /images/meeting_of_styles/meeting_of_styles_after-800.jpg 800w, /images/meeting_of_styles/meeting_of_styles_after.jpg 1200w"
          sizes="100vw"
        />
      </div>
      <button
        className="page-bg-edit-btn"
        data-on-click="editSectionBg('bio', this)"
        data-en="🖼 Edit this background"
        data-es="🖼 Editar este fondo"
      >
        {t("🖼 Edit this background", "🖼 Editar este fondo")}
      </button>
      <section className="section about-full" id="bio-full">
        <div className="wrap about-grid">
          <div className="polaroid">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/hero_bio_portrait.jpg"
              alt="Cundo Marchi portrait"
              data-key="hero_bio_portrait"
              width={850}
              height={1124}
            />
            <div className="caption">Have a creative day!</div>
          </div>
          <div className="about-text">
            <span className="eyebrow" data-en="Who I Am" data-es="Quién Soy">
              {t("Who I Am", "Quién Soy")}
            </span>{" "}
            <h2
              className="section-title"
              style={{ marginBottom: "20px", fontSize: "32px" }}
              data-en="Hello!"
              data-es="¡Hola!"
            >
              {t("Hello!", "¡Hola!")}
            </h2>
            <p
              data-en="Hello! I'm Cundo Marchi, a visual and urban artist from Argentina."
              data-es="¡Hola! Soy Cundo Marchi, artista visual y urbano de Argentina."
            >
              {t(
                "Hello! I'm Cundo Marchi, a visual and urban artist from Argentina.",
                "¡Hola! Soy Cundo Marchi, artista visual y urbano de Argentina.",
              )}
            </p>
            <p
              data-en="My beginnings in muralism were in the middle of 2012, in the streets of San Fernando, Buenos Aires, Argentina. Since then, I've been traveling through 15 countries, in 5 different continents."
              data-es="Mis comienzos en el muralismo fueron a mediados de 2012, en las calles de San Fernando, Buenos Aires, Argentina. Desde entonces, viajé por 15 países, en 5 continentes."
            >
              {t(
                "My beginnings in muralism were in the middle of 2012, in the streets of San Fernando, Buenos Aires, Argentina. Since then, I've been traveling through 15 countries, in 5 different continents.",
                "Mis comienzos en el muralismo fueron a mediados de 2012, en las calles de San Fernando, Buenos Aires, Argentina. Desde entonces, viajé por 15 países, en 5 continentes.",
              )}
            </p>
            <p
              data-en="Being part of visual and urban arts events, and in different national and international muralism meetings, spreading my unique style, a fusion between surrealism and psychodraws, where I find a balance to spread a message of conscience."
              data-es="Siendo parte de eventos de arte visual y urbano, y de distintos encuentros de muralismo nacionales e internacionales, difundiendo mi estilo único, una fusión entre surrealismo y psicodibujos, donde encuentro un equilibrio para transmitir un mensaje de conciencia."
            >
              {t(
                "Being part of visual and urban arts events, and in different national and international muralism meetings, spreading my unique style, a fusion between surrealism and psychodraws, where I find a balance to spread a message of conscience.",
                "Siendo parte de eventos de arte visual y urbano, y de distintos encuentros de muralismo nacionales e internacionales, difundiendo mi estilo único, una fusión entre surrealismo y psicodibujos, donde encuentro un equilibrio para transmitir un mensaje de conciencia.",
              )}
            </p>
            <div className="bio-stats">
              <div className="bio-stat">
                <strong>5</strong>
                <span data-en="Continents" data-es="Continentes">
                  {t("Continents", "Continentes")}
                </span>
              </div>
              <div className="bio-stat">
                <strong>15+</strong>
                <span data-en="Countries" data-es="Países">
                  {t("Countries", "Países")}
                </span>
              </div>
              <div className="bio-stat">
                <strong>10+</strong>
                <span data-en="Years of Experience" data-es="Años de Experiencia">
                  {t("Years of Experience", "Años de Experiencia")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section events-in-bio" id="events">
        <div className="wrap">
          <span className="eyebrow" data-en="Since 2012" data-es="Desde 2012">
            {t("Since 2012", "Desde 2012")}
          </span>{" "}
          <h2 className="section-title" data-en="Events" data-es="Eventos">
            {t("Events", "Eventos")}
          </h2>
          <p
            style={{
              color: "var(--gray)",
              marginTop: "-24px",
              marginBottom: "36px",
              fontSize: "14px",
              maxWidth: "520px",
            }}
            data-en={
              "15+ international & national events across Argentina, Mexico, USA, Brazil, Sweden, Italy and Switzerland."
            }
            data-es="15+ eventos internacionales y nacionales en Argentina, México, USA, Brasil, Suecia, Italia y Suiza."
          >
            {t(
              "15+ international & national events across Argentina, Mexico, USA, Brazil, Sweden, Italy and Switzerland.",
              "15+ eventos internacionales y nacionales en Argentina, México, USA, Brasil, Suecia, Italia y Suiza.",
            )}
          </p>
          <div className="world-map-wrap">
            <div className="world-map-scroll">
              <WorldMap ariaLabel={"World map showing countries where murals have been painted"} />
            </div>
          </div>
          <p
            className="world-map-caption"
            data-en="Countries where a mural has been painted."
            data-es="Países donde ya pinté un mural."
          >
            {t("Countries where a mural has been painted.", "Países donde ya pinté un mural.")}
          </p>
          <div className="world-map-list" id="worldMapList">
            <div className="continent-group">
              <button className="continent-toggle" aria-expanded="true" data-on-click="toggleContinent(this)">
                <span>SOUTH AMERICA</span>
                <span className="continent-toggle-icon">−</span>
              </button>
              <ul className="country-items country-items--1col">
                <li>
                  <button className="country-item" data-country="Argentina">
                    <span className="country-item-flag">🇦🇷</span>
                    <span className="country-item-text">
                      <span className="country-item-name">Argentina</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Brazil">
                    <span className="country-item-flag">🇧🇷</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Brazil", "Brasil")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Bolivia">
                    <span className="country-item-flag">🇧🇴</span>
                    <span className="country-item-text">
                      <span className="country-item-name">Bolivia</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Peru">
                    <span className="country-item-flag">🇵🇪</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Peru", "Perú")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Ecuador">
                    <span className="country-item-flag">🇪🇨</span>
                    <span className="country-item-text">
                      <span className="country-item-name">Ecuador</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="continent-group">
              <button className="continent-toggle" aria-expanded="true" data-on-click="toggleContinent(this)">
                <span>NORTH AMERICA</span>
                <span className="continent-toggle-icon">−</span>
              </button>
              <ul className="country-items country-items--1col">
                <li>
                  <button className="country-item" data-country="USA">
                    <span className="country-item-flag">🇺🇸</span>
                    <span className="country-item-text">
                      <span className="country-item-name" data-en="United States" data-es="Estados Unidos">
                        {t("United States", "Estados Unidos")}
                      </span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Mexico">
                    <span className="country-item-flag">🇲🇽</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Mexico", "México")}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="continent-group">
              <button className="continent-toggle" aria-expanded="true" data-on-click="toggleContinent(this)">
                <span>EUROPE</span>
                <span className="continent-toggle-icon">−</span>
              </button>
              <ul className="country-items country-items--2col">
                <li>
                  <button className="country-item" data-country="Spain">
                    <span className="country-item-flag">🇪🇸</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Spain", "España")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Italy">
                    <span className="country-item-flag">🇮🇹</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Italy", "Italia")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Germany">
                    <span className="country-item-flag">🇩🇪</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Germany", "Alemania")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Switzerland">
                    <span className="country-item-flag">🇨🇭</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Switzerland", "Suiza")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Sweden">
                    <span className="country-item-flag">🇸🇪</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Sweden", "Suecia")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Denmark">
                    <span className="country-item-flag">🇩🇰</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Denmark", "Dinamarca")}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="country-item" data-country="Greece">
                    <span className="country-item-flag">🇬🇷</span>
                    <span className="country-item-text">
                      <span className="country-item-name">{t("Greece", "Grecia")}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="continent-group">
              <button className="continent-toggle" aria-expanded="true" data-on-click="toggleContinent(this)">
                <span>OCEANIA</span>
                <span className="continent-toggle-icon">−</span>
              </button>
              <ul className="country-items">
                <li>
                  <button className="country-item" data-country="Australia">
                    <span className="country-item-flag">🇦🇺</span>
                    <span className="country-item-text">
                      <span className="country-item-name">Australia</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="continent-group">
              <button className="continent-toggle" aria-expanded="true" data-on-click="toggleContinent(this)">
                <span>ASIA</span>
                <span className="continent-toggle-icon">−</span>
              </button>
              <ul className="country-items">
                <li>
                  <button className="country-item" data-country="Indonesia">
                    <span className="country-item-flag">🇮🇩</span>
                    <span className="country-item-text">
                      <span className="country-item-name">Indonesia</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="event-list">
            <div className="event-row">
              <span className="event-year">2018</span>
              <span className="event-name">🇦🇷 Jam of Draw</span>
              <span className="event-loc">
                {t("Colón Theater, Buenos Aires, Argentina", "Teatro Colón, Buenos Aires, Argentina")}
              </span>
            </div>
            <div className="event-row">
              <span className="event-year">2018</span>
              <span className="event-name">{t("🇦🇷 Pinto Tigre Mural Event", "🇦🇷 Pinto Tigre")}</span>
              <span className="event-loc">Buenos Aires, Argentina</span>
            </div>
            <div className="event-row">
              <span className="event-year">2019</span>
              <span className="event-name">
                {t(
                  "🇦🇷 Meeting Maaanso, Int'l Festival of Murals",
                  "🇦🇷 Meeting Maaanso, Festival Internacional de Murales",
                )}
              </span>
              <span className="event-loc">San Juan, Argentina</span>
            </div>
            <div className="event-row">
              <span className="event-year">2019</span>
              <span className="event-name">{t("🇧🇷 Street Art Tour", "🇧🇷 Gira de Arte Urbano")}</span>
              <span className="event-loc">{t("Florianópolis, Brazil", "Florianópolis, Brasil")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2022</span>
              <span className="event-name"> {t("Street Art Tour Mexico", "Gira de Arte Urbano, México")}</span>
              <span className="event-loc">Estado de México · Playa del Carmen · Tulum</span>
            </div>
            <div className="event-row">
              <span className="event-year">2022</span>
              <span className="event-name">🇲🇽 Urban Street Event, Bonfil Beach</span>
              <span className="event-loc">{t("Acapulco, Mexico", "Acapulco, México")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2023</span>
              <span className="event-name">🇦🇷 Emush Mural Event</span>
              <span className="event-loc">Ushuaia, Tierra del Fuego, Argentina</span>
            </div>
            <div className="event-row">
              <span className="event-year">2023</span>
              <span className="event-name">
                {t("🇦🇷 Otamendi Palace Opening, Live Painting", "🇦🇷 Apertura del Palacio Otamendi, Pintura en Vivo")}
              </span>
              <span className="event-loc">Buenos Aires, Argentina</span>
            </div>
            <div className="event-row">
              <span className="event-year">2024</span>
              <span className="event-name">
                {t("🇺🇸 Art Basel Week, Live Painting", "🇺🇸 Art Basel Week, Pintura en Vivo")}
              </span>
              <span className="event-loc">{t("Wynwood, Miami, USA", "Wynwood, Miami, Estados Unidos")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2024</span>
              <span className="event-name">
                {t("🇺🇸 Chiquita Day, Live Painting", "🇺🇸 Chiquita Day, Pintura en Vivo")}
              </span>
              <span className="event-loc">{t("Wynwood, Miami, USA", "Wynwood, Miami, Estados Unidos")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2024</span>
              <span className="event-name">
                {t("🇺🇸 Tik Tok Live Fest, Live Painting", "🇺🇸 Tik Tok Live Fest, Pintura en Vivo")}
              </span>
              <span className="event-loc">{t("Downtown Miami, USA", "Downtown Miami, Estados Unidos")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2025</span>
              <span className="event-name">🇸🇪 MOS, Meeting of Styles</span>
              <span className="event-loc">{t("Malmö, Sweden", "Malmö, Suecia")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2025</span>
              <span className="event-name">{t("🇸🇪 Street Art Tour", "🇸🇪 Gira de Arte Urbano")}</span>
              <span className="event-loc">
                {t(
                  "Sweden · Denmark · Germany · France · Italy · Greece",
                  "Suecia · Dinamarca · Alemania · Francia · Italia · Grecia",
                )}
              </span>
            </div>
            <div className="event-row">
              <span className="event-year">2025</span>
              <span className="event-name">🇮🇹 Urban Street Event</span>
              <span className="event-loc">{t("Parma, Italy", "Parma, Italia")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2025</span>
              <span className="event-name">{t("🇨🇭 You Are What You See", "🇨🇭 Sos Lo Que Ves")}</span>
              <span className="event-loc">{t("Sierre, Switzerland", "Sierre, Suiza")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2026</span>
              <span className="event-name">🇮🇩 Indonesia</span>
              <span className="event-loc">{t("Bali, Street Art Tour", "Bali, Gira de Arte Urbano")}</span>
            </div>
            <div className="event-row">
              <span className="event-year">2026</span>
              <span className="event-name">🇦🇺 Australia</span>
              <span className="event-loc">
                {t(
                  "Broadbeach, Gold Coast, Queensland, Street Art Tour",
                  "Broadbeach, Gold Coast, Queensland, Gira de Arte Urbano",
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
