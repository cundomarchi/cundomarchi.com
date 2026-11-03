// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator, localizer } from "./i18n";

export function HomePage({ lang }: { lang: Lang }) {
  const t = translator(lang);
  const l = localizer(lang);
  return (
    <div className="page active" id="page-home">
      <div className="page-bg" id="bg-home">
        <img
          src="/images/site/bg_home_maanso.jpg"
          alt=""
          data-key="bg_home"
          width={2000}
          height={1325}
          srcSet="/images/site/bg_home_maanso-600.jpg 600w, /images/site/bg_home_maanso-800.jpg 800w, /images/site/bg_home_maanso-1200.jpg 1200w, /images/site/bg_home_maanso.jpg 2000w"
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <button
        className="page-bg-edit-btn"
        data-on-click="editSectionBg('home', this)"
        data-en="🖼 Edit this background"
        data-es="🖼 Editar este fondo"
      >
        {t("🖼 Edit this background", "🖼 Editar este fondo")}
      </button>
      <section className="hero">
        <img
          src="/images/site/cmz_logo.png"
          alt="Cundo Marchi logo"
          className="hero-logo"
          width={1239}
          height={516}
          srcSet="/images/site/cmz_logo-120.png 120w, /images/site/cmz_logo-400.png 400w, /images/site/cmz_logo-700.png 700w, /images/site/cmz_logo-900.png 900w, /images/site/cmz_logo.png 1239w"
          sizes="(max-width:700px) 70vw, 420px"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <h1
          className="sr-only"
          data-en="Cundo Marchi, Muralist and Visual Artist painting murals worldwide"
          data-es="Cundo Marchi, Muralista y Artista Visual pintando murales en todo el mundo"
        >
          {t(
            "Cundo Marchi, Muralist and Visual Artist painting murals worldwide",
            "Cundo Marchi, Muralista y Artista Visual pintando murales en todo el mundo",
          )}
        </h1>
        <p
          className="sub"
          data-text-key="hero-sub"
          data-en={"Visual Artist & Urban Artist, Argentinian, painting murals across 5 continents since 2012."}
          data-es="Artista Visual y Urbano, Argentino, pintando murales en 5 continentes desde 2012."
        >
          {lang === "es" ? (
            <>Artista Visual y Urbano, Argentino, pintando murales en 5 continentes desde 2012.</>
          ) : (
            <>
              {"Visual Artist & Urban Artist,"} <strong>Argentinian</strong>, painting murals across 5 continents since
              2012.
            </>
          )}
        </p>
        <div className="hero-ctas">
          <a href={l("#quote")} className="btn-primary" data-en="Get a Quote" data-es="Cotizar">
            {t("Get a Quote", "Cotizar")}
          </a>{" "}
          <a
            data-on-click="showPage('work')"
            className="btn-secondary"
            style={{ cursor: "pointer" }}
            data-en="See the Work"
            data-es="Ver el Trabajo"
          >
            {t("See the Work", "Ver el Trabajo")}
          </a>
        </div>
      </section>
      <section className="about" id="bio">
        <div className="wrap about-grid">
          <div className="polaroid">
            <img
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
              style={{ marginBottom: "16px", fontSize: "32px" }}
              data-text-key="bio-heading"
              data-en="Hello!"
              data-es="¡Hola!"
            >
              {t("Hello!", "¡Hola!")}
            </h2>
            <p
              data-text-key="bio-p1"
              style={{ maxWidth: "640px", marginBottom: "16px" }}
              data-en="Hello! I'm Cundo Marchi, a visual and urban artist from Argentina."
              data-es="¡Hola! Soy Cundo Marchi, artista visual y urbano de Argentina."
            >
              {t(
                "Hello! I'm Cundo Marchi, a visual and urban artist from Argentina.",
                "¡Hola! Soy Cundo Marchi, artista visual y urbano de Argentina.",
              )}
            </p>
            <p
              data-text-key="bio-p2"
              style={{ maxWidth: "640px", marginBottom: "16px" }}
              data-en="My beginnings in muralism were in the middle of 2012, in the streets of San Fernando, Buenos Aires, Argentina. Since then, I've been traveling through more than 15 countries, in 5 different continents."
              data-es="Mis comienzos en el muralismo fueron a mediados de 2012, en las calles de San Fernando, Buenos Aires, Argentina. Desde entonces, viajé por más de 15 países, en 5 continentes."
            >
              {t(
                "My beginnings in muralism were in the middle of 2012, in the streets of San Fernando, Buenos Aires, Argentina. Since then, I've been traveling through more than 15 countries, in 5 different continents.",
                "Mis comienzos en el muralismo fueron a mediados de 2012, en las calles de San Fernando, Buenos Aires, Argentina. Desde entonces, viajé por más de 15 países, en 5 continentes.",
              )}
            </p>
            <p
              data-text-key="bio-p3"
              style={{ maxWidth: "640px", marginBottom: "22px" }}
              data-en="Being part of visual and urban arts events, and in different national and international muralism meetings, spreading my unique style, a fusion between surrealism and psychodraws, where I find a balance to spread a message of conscience."
              data-es="Siendo parte de eventos de arte visual y urbano, y de distintos encuentros de muralismo nacionales e internacionales, difundiendo mi estilo único, una fusión entre surrealismo y psicodibujos, donde encuentro un equilibrio para transmitir un mensaje de conciencia."
            >
              {t(
                "Being part of visual and urban arts events, and in different national and international muralism meetings, spreading my unique style, a fusion between surrealism and psychodraws, where I find a balance to spread a message of conscience.",
                "Siendo parte de eventos de arte visual y urbano, y de distintos encuentros de muralismo nacionales e internacionales, difundiendo mi estilo único, una fusión entre surrealismo y psicodibujos, donde encuentro un equilibrio para transmitir un mensaje de conciencia.",
              )}
            </p>{" "}
            <a
              data-on-click="showPage('bio')"
              className="btn-secondary"
              style={{ cursor: "pointer", display: "inline-block" }}
              data-en="Read My Full Story"
              data-es="Leer Mi Historia Completa"
            >
              {t("Read My Full Story", "Leer Mi Historia Completa")}
            </a>
          </div>
        </div>
      </section>
      <div className="carousel-wrap">
        <div className="carousel-track" id="carousel"></div>
        <button className="carousel-arrow left" data-on-click="prevSlide()">
          ‹
        </button>
        <button className="carousel-arrow right" data-on-click="nextSlide()">
          ›
        </button>
        <div className="carousel-dots" id="carouselDots"></div>
      </div>
      <section className="section home-work-preview">
        <div className="wrap">
          <span className="eyebrow" data-en="Selected Work" data-es="Trabajos Seleccionados">
            {t("Selected Work", "Trabajos Seleccionados")}
          </span>{" "}
          <h2 className="section-title" data-en="Portfolio" data-es="Portfolio">
            Portfolio
          </h2>
        </div>
        <div className="mural-grid-wrap" id="homeGridWrap">
          <div className="mural-grid preview-grid" id="homePreviewGrid">
            <article className="mural-card" data-mural-id="meeting_of_styles">
              <a
                className="mural-photo"
                href={l("mural/meeting-of-styles.html")}
                data-on-click="return muralCardClick(event,'meeting_of_styles')"
              >
                <img
                  className="card-main"
                  src="/images/meeting_of_styles/meeting_of_styles_after.jpg"
                  alt={t(
                    "Meeting of Styles, mural by Cundo Marchi, Malmö, Sweden, 2025",
                    "Meeting of Styles, mural de Cundo Marchi, Malmö, Sweden, 2025",
                  )}
                  loading="lazy"
                  data-key="meeting_of_styles_after"
                  width={1200}
                  height={1600}
                  srcSet="/images/meeting_of_styles/meeting_of_styles_after-600.jpg 600w, /images/meeting_of_styles/meeting_of_styles_after-800.jpg 800w, /images/meeting_of_styles/meeting_of_styles_after.jpg 1200w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/meeting-of-styles.html")}
                data-on-click="return muralCardClick(event,'meeting_of_styles')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-fill">{t("Mural Event", "Encuentro de muralismo")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Meeting of Styles"'} data-es={'"Meeting of Styles"'}>
                  {'"Meeting of Styles"'}
                </h3>
                <p className="meta">{t("🇸🇪 Malmö, Sweden, 2025 · 5m x 3m", "🇸🇪 Malmö, Suecia, 2025 · 5m x 3m")}</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="bullshit_turin">
              <a
                className="mural-photo"
                href={l("mural/bulll-hit.html")}
                data-on-click="return muralCardClick(event,'bullshit_turin')"
              >
                <img
                  className="card-main"
                  src="/images/bullshit_turin/bullshit_turin.jpg"
                  alt={t(
                    "Bull Balls, mural by Cundo Marchi, Turin, Italy, 2025",
                    "Bull Balls, mural de Cundo Marchi, Turin, Italy, 2025",
                  )}
                  loading="lazy"
                  data-key="bullshit_turin"
                  width={900}
                  height={850}
                  srcSet="/images/bullshit_turin/bullshit_turin-600.jpg 600w, /images/bullshit_turin/bullshit_turin-800.jpg 800w, /images/bullshit_turin/bullshit_turin.jpg 900w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/bulll-hit.html")}
                data-on-click="return muralCardClick(event,'bullshit_turin')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Bull Balls"'} data-es={'"Bull Balls"'}>
                  {'"Bull Balls"'}
                </h3>
                <p className="meta">{t("🇮🇹 Turin, Italy, 2025 · 5m x 2.2m", "🇮🇹 Turín, Italia, 2025 · 5m x 2.2m")}</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="zeus_athens">
              <a
                className="mural-photo"
                href={l("mural/hercules.html")}
                data-on-click="return muralCardClick(event,'zeus_athens')"
              >
                <img
                  className="card-main"
                  src="/images/zeus_athens/zeus_athens.jpg"
                  alt={t(
                    "Herakles, mural by Cundo Marchi, Athens, Greece, 2025",
                    "Herakles, mural de Cundo Marchi, Athens, Greece, 2025",
                  )}
                  loading="lazy"
                  data-key="zeus_athens"
                  width={1600}
                  height={1200}
                  srcSet="/images/zeus_athens/zeus_athens-600.jpg 600w, /images/zeus_athens/zeus_athens-800.jpg 800w, /images/zeus_athens/zeus_athens-1200.jpg 1200w, /images/zeus_athens/zeus_athens.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/hercules.html")}
                data-on-click="return muralCardClick(event,'zeus_athens')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Herakles"'} data-es={'"Herakles"'}>
                  {'"Herakles"'}
                </h3>
                <p className="meta">
                  {t("🇬🇷 Athens, Greece, 2025 · 5m x 2.2m", "🇬🇷 Atenas, Grecia, 2025 · 5m x 2.2m")}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="king_of_kings">
              <a
                className="mural-photo"
                href={l("mural/the-king-of-kings.html")}
                data-on-click="return muralCardClick(event,'king_of_kings')"
              >
                <img
                  className="card-main"
                  src="/images/king_of_kings/king_of_kings.jpg"
                  alt={t(
                    "The King of Kings, mural by Cundo Marchi, Ushuaia, Tierra del Fuego, Argentina, 2023",
                    "The King of Kings, mural de Cundo Marchi, Ushuaia, Tierra del Fuego, Argentina, 2023",
                  )}
                  loading="lazy"
                  data-key="king_of_kings"
                  width={900}
                  height={1101}
                  srcSet="/images/king_of_kings/king_of_kings-600.jpg 600w, /images/king_of_kings/king_of_kings-800.jpg 800w, /images/king_of_kings/king_of_kings.jpg 900w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-king-of-kings.html")}
                data-on-click="return muralCardClick(event,'king_of_kings')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Mural Event", "Encuentro de muralismo")}</span>
                  <span className="pill tag-outline">
                    {t("Exterior Paint & Brush", "Pintura de exterior y pincel")}
                  </span>
                </div>
                <h3 data-en={'"The King of Kings"'} data-es={'"El Rey de Reyes"'}>
                  {t('"The King of Kings"', '"El Rey de Reyes"')}
                </h3>
                <p className="meta">🇦🇷 Ushuaia, Tierra del Fuego, Argentina, 2023 · 1.7m x 3.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="city_of_fury">
              <a
                className="mural-photo"
                href={l("mural/the-city-of-the-fury.html")}
                data-on-click="return muralCardClick(event,'city_of_fury')"
              >
                <img
                  className="card-main"
                  src="/images/city_of_fury/city_of_fury_extra1.jpg"
                  alt={t(
                    "The City of the Fury, mural by Cundo Marchi, Buenos Aires, Argentina, 2021",
                    "The City of the Fury, mural de Cundo Marchi, Buenos Aires, Argentina, 2021",
                  )}
                  loading="lazy"
                  data-key="city_of_fury_extra1"
                  width={1600}
                  height={1600}
                  srcSet="/images/city_of_fury/city_of_fury_extra1-600.jpg 600w, /images/city_of_fury/city_of_fury_extra1-800.jpg 800w, /images/city_of_fury/city_of_fury_extra1-1200.jpg 1200w, /images/city_of_fury/city_of_fury_extra1.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-city-of-the-fury.html")}
                data-on-click="return muralCardClick(event,'city_of_fury')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">
                    {t("Exterior Paint & Brush", "Pintura de exterior y pincel")}
                  </span>
                </div>
                <h3 data-en={'"The City of the Fury"'} data-es={'"La Ciudad de la Furia"'}>
                  {t('"The City of the Fury"', '"La Ciudad de la Furia"')}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2021 · 4.5m x 2.8m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="fusion_of_life">
              <a
                className="mural-photo"
                href={l("mural/the-fusion-of-life.html")}
                data-on-click="return muralCardClick(event,'fusion_of_life')"
              >
                <img
                  className="card-main"
                  src="/images/fusion_of_life/fusion_of_life.jpg"
                  alt={t(
                    "The Fusion of Life, mural by Cundo Marchi, San Juan, Argentina, Maanso Meeting II, 2018",
                    "The Fusion of Life, mural de Cundo Marchi, San Juan, Argentina, Maanso Meeting II, 2018",
                  )}
                  loading="lazy"
                  data-key="fusion_of_life"
                  width={1600}
                  height={892}
                  srcSet="/images/fusion_of_life/fusion_of_life-600.jpg 600w, /images/fusion_of_life/fusion_of_life-800.jpg 800w, /images/fusion_of_life/fusion_of_life-1200.jpg 1200w, /images/fusion_of_life/fusion_of_life.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-fusion-of-life.html")}
                data-on-click="return muralCardClick(event,'fusion_of_life')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Mural Event", "Encuentro de muralismo")}</span>
                  <span className="pill tag-outline">{t("Mix Media", "Técnica mixta")}</span>
                </div>
                <h3 data-en={'"The Fusion of Life"'} data-es={'"La Fusión de la Vida"'}>
                  {t('"The Fusion of Life"', '"La Fusión de la Vida"')}
                </h3>
                <p className="meta">🇦🇷 San Juan, Argentina, Maanso Meeting II, 2018 · 9m x 2.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="down_ocean">
              <a
                className="mural-photo"
                href={l("mural/down-the-ocean.html")}
                data-on-click="return muralCardClick(event,'down_ocean')"
              >
                <img
                  className="card-main"
                  src="/images/down_ocean/down_ocean.jpg"
                  alt={t(
                    "Down the Ocean, mural by Cundo Marchi, Bicentennial Tunnel, Tigre, Buenos Aires, Argentina, 2019",
                    "Down the Ocean, mural de Cundo Marchi, Bicentennial Tunnel, Tigre, Buenos Aires, Argentina, 2019",
                  )}
                  loading="lazy"
                  data-key="down_ocean_6"
                  width={1600}
                  height={1600}
                  srcSet="/images/down_ocean/down_ocean-600.jpg 600w, /images/down_ocean/down_ocean-800.jpg 800w, /images/down_ocean/down_ocean-1200.jpg 1200w, /images/down_ocean/down_ocean.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/down-the-ocean.html")}
                data-on-click="return muralCardClick(event,'down_ocean')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Mix Media", "Técnica mixta")}</span>
                </div>
                <h3 data-en={'"Down the Ocean"'} data-es={'"Bajo el Océano"'}>
                  {t('"Down the Ocean"', '"Bajo el Océano"')}
                </h3>
                <p className="meta">
                  {t(
                    "🇦🇷 Bicentennial Tunnel, Tigre, Buenos Aires, Argentina, 2019 · 150 m²",
                    "🇦🇷 Túnel del Bicentenario, Tigre, Buenos Aires, Argentina, 2019 · 150 m²",
                  )}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="flower_octopus">
              <a
                className="mural-photo"
                href={l("mural/flower-octopus.html")}
                data-on-click="return muralCardClick(event,'flower_octopus')"
              >
                <img
                  className="card-main"
                  src="/images/flower_octopus/flower_octopus.jpg"
                  alt={t(
                    "Flower Octopus, mural by Cundo Marchi, Buenos Aires, Argentina, 2018",
                    "Flower Octopus, mural de Cundo Marchi, Buenos Aires, Argentina, 2018",
                  )}
                  loading="lazy"
                  data-key="flower_octopus"
                  width={1600}
                  height={1088}
                  srcSet="/images/flower_octopus/flower_octopus-600.jpg 600w, /images/flower_octopus/flower_octopus-800.jpg 800w, /images/flower_octopus/flower_octopus-1200.jpg 1200w, /images/flower_octopus/flower_octopus.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/flower-octopus.html")}
                data-on-click="return muralCardClick(event,'flower_octopus')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">
                    {t("Exterior Paint & Brush", "Pintura de exterior y pincel")}
                  </span>
                </div>
                <h3 data-en={'"Flower Octopus"'} data-es={'"Pulpo Flor"'}>
                  {t('"Flower Octopus"', '"Pulpo Flor"')}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2018 · 3.5m x 2.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="ocean_heart">
              <a
                className="mural-photo"
                href={l("mural/ocean-heart.html")}
                data-on-click="return muralCardClick(event,'ocean_heart')"
              >
                <img
                  className="card-main"
                  src="/images/ocean_heart/ocean_heart_extra12.jpg"
                  alt={t(
                    "Ocean Heart, mural by Cundo Marchi, Bonfil Urban Mural Fest, Acapulco, Mexico, 2022",
                    "Ocean Heart, mural de Cundo Marchi, Bonfil Urban Mural Fest, Acapulco, Mexico, 2022",
                  )}
                  loading="lazy"
                  data-key="ocean_heart"
                  width={1600}
                  height={1200}
                  srcSet="/images/ocean_heart/ocean_heart_extra12-800.jpg 800w, /images/ocean_heart/ocean_heart_extra12.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/ocean-heart.html")}
                data-on-click="return muralCardClick(event,'ocean_heart')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Mural Event", "Encuentro de muralismo")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Ocean Heart"'} data-es={'"Corazón del Océano"'}>
                  {t('"Ocean Heart"', '"Corazón del Océano"')}
                </h3>
                <p className="meta">
                  {t(
                    "🇲🇽 Bonfil Urban Mural Fest, Acapulco, Mexico, 2022 · 7m x 2.5m",
                    "🇲🇽 Bonfil Urban Mural Fest, Acapulco, México, 2022 · 7m x 2.5m",
                  )}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="the_eyes">
              <a
                className="mural-photo"
                href={l("mural/the-eyes.html")}
                data-on-click="return muralCardClick(event,'the_eyes')"
              >
                <img
                  className="card-main"
                  src="/images/the_eyes/the_eyes.jpg"
                  alt={t(
                    "The Eyes, mural by Cundo Marchi, Buenos Aires, Argentina, 2023",
                    "The Eyes, mural de Cundo Marchi, Buenos Aires, Argentina, 2023",
                  )}
                  loading="lazy"
                  data-key="the_eyes"
                  width={1351}
                  height={960}
                  srcSet="/images/the_eyes/the_eyes-600.jpg 600w, /images/the_eyes/the_eyes-800.jpg 800w, /images/the_eyes/the_eyes-1200.jpg 1200w, /images/the_eyes/the_eyes.jpg 1351w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-eyes.html")}
                data-on-click="return muralCardClick(event,'the_eyes')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"The Eyes"'} data-es={'"Los Ojos"'}>
                  {t('"The Eyes"', '"Los Ojos"')}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2023 · 4.2m x 1.2m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="el_eternauta">
              <a
                className="mural-photo"
                href={l("mural/el-eternauta.html")}
                data-on-click="return muralCardClick(event,'el_eternauta')"
              >
                <img
                  className="card-main"
                  src="/images/el_eternauta/el_eternauta.jpg"
                  alt={t(
                    "El Eternauta, mural by Cundo Marchi, Buenos Aires, Argentina, 2024",
                    "El Eternauta, mural de Cundo Marchi, Buenos Aires, Argentina, 2024",
                  )}
                  loading="lazy"
                  data-key="el_eternauta"
                  width={900}
                  height={1600}
                  srcSet="/images/el_eternauta/el_eternauta-600.jpg 600w, /images/el_eternauta/el_eternauta-800.jpg 800w, /images/el_eternauta/el_eternauta.jpg 900w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/el-eternauta.html")}
                data-on-click="return muralCardClick(event,'el_eternauta')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"El Eternauta"'} data-es={'"El Eternauta"'}>
                  {'"El Eternauta"'}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2024 · 2m x 2.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="laos_california">
              <a
                className="mural-photo"
                href={l("mural/laos-california.html")}
                data-on-click="return muralCardClick(event,'laos_california')"
              >
                <img
                  className="card-main"
                  src="/images/laos_california/laos_california.jpg"
                  alt={t(
                    "Laos & California, mural by Cundo Marchi, California, USA, 2022",
                    "Laos & California, mural de Cundo Marchi, California, USA, 2022",
                  )}
                  loading="lazy"
                  data-key="laos_california"
                  width={900}
                  height={472}
                  srcSet="/images/laos_california/laos_california-600.jpg 600w, /images/laos_california/laos_california-800.jpg 800w, /images/laos_california/laos_california.jpg 900w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/laos-california.html")}
                data-on-click="return muralCardClick(event,'laos_california')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Mix Media", "Técnica mixta")}</span>
                </div>
                <h3 data-en={'"Laos & California"'} data-es={'"Laos & California"'}>
                  {'"Laos & California"'}
                </h3>
                <p className="meta">
                  {t("🇺🇸 California, USA, 2022 · 8m x 2.8m", "🇺🇸 California, Estados Unidos, 2022 · 8m x 2.8m")}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="tlaloc">
              <a
                className="mural-photo"
                href={l("mural/tlaloc.html")}
                data-on-click="return muralCardClick(event,'tlaloc')"
              >
                <img
                  className="card-main"
                  src="/images/tlaloc/tlaloc_extra5.jpg"
                  alt={t(
                    "Tlaloc, mural by Cundo Marchi, Playa del Carmen, Quintana Roo, Mexico, 2022",
                    "Tlaloc, mural de Cundo Marchi, Playa del Carmen, Quintana Roo, Mexico, 2022",
                  )}
                  loading="lazy"
                  data-key="tlaloc_extra5"
                  width={1600}
                  height={900}
                  srcSet="/images/tlaloc/tlaloc_extra5-600.jpg 600w, /images/tlaloc/tlaloc_extra5-800.jpg 800w, /images/tlaloc/tlaloc_extra5-1200.jpg 1200w, /images/tlaloc/tlaloc_extra5.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/tlaloc.html")}
                data-on-click="return muralCardClick(event,'tlaloc')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Tlaloc"'} data-es={'"Tlaloc"'}>
                  {'"Tlaloc"'}
                </h3>
                <p className="meta">
                  {t(
                    "🇲🇽 Playa del Carmen, Quintana Roo, Mexico, 2022 · 2.5m x 2.5m",
                    "🇲🇽 Playa del Carmen, Quintana Roo, México, 2022 · 2.5m x 2.5m",
                  )}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="circle_of_nature">
              <a
                className="mural-photo"
                href={l("mural/the-circle-of-nature.html")}
                data-on-click="return muralCardClick(event,'circle_of_nature')"
              >
                <img
                  className="card-main"
                  src="/images/circle_of_nature/circle_of_nature.jpg"
                  alt={t(
                    "The Circle of Nature, mural by Cundo Marchi, Buenos Aires, Argentina, 2022",
                    "The Circle of Nature, mural de Cundo Marchi, Buenos Aires, Argentina, 2022",
                  )}
                  loading="lazy"
                  data-key="circle_of_nature"
                  width={1600}
                  height={1066}
                  srcSet="/images/circle_of_nature/circle_of_nature-600.jpg 600w, /images/circle_of_nature/circle_of_nature-800.jpg 800w, /images/circle_of_nature/circle_of_nature-1200.jpg 1200w, /images/circle_of_nature/circle_of_nature.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-circle-of-nature.html")}
                data-on-click="return muralCardClick(event,'circle_of_nature')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">
                    {t("Exterior Paint & Brush", "Pintura de exterior y pincel")}
                  </span>
                </div>
                <h3 data-en={'"The Circle of Nature"'} data-es={'"El Círculo de la Naturaleza"'}>
                  {t('"The Circle of Nature"', '"El Círculo de la Naturaleza"')}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2022 · 2.2m x 3m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="the_seesaw">
              <a
                className="mural-photo"
                href={l("mural/the-seesaw.html")}
                data-on-click="return muralCardClick(event,'the_seesaw')"
              >
                <img
                  className="card-main"
                  src="/images/the_seesaw/the_seesaw.jpg"
                  alt={t(
                    "The Seesaw, mural by Cundo Marchi, Buenos Aires, Argentina, 2022",
                    "The Seesaw, mural de Cundo Marchi, Buenos Aires, Argentina, 2022",
                  )}
                  loading="lazy"
                  data-key="the_seesaw"
                  width={1200}
                  height={1600}
                  srcSet="/images/the_seesaw/the_seesaw-600.jpg 600w, /images/the_seesaw/the_seesaw-800.jpg 800w, /images/the_seesaw/the_seesaw.jpg 1200w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-seesaw.html")}
                data-on-click="return muralCardClick(event,'the_seesaw')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"The Seesaw"'} data-es={'"El Subibaja"'}>
                  {t('"The Seesaw"', '"El Subibaja"')}
                </h3>
                <p className="meta">🇦🇷 Buenos Aires, Argentina, 2022 · 5m x 2.2m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="you_see">
              <a
                className="mural-photo"
                href={l("mural/you-are-what-you-see.html")}
                data-on-click="return muralCardClick(event,'you_see')"
              >
                <img
                  className="card-main"
                  src="/images/you_see/you_see.jpg"
                  alt={t(
                    "You Are What You See, mural by Cundo Marchi, Sierre, Switzerland, 2025",
                    "You Are What You See, mural de Cundo Marchi, Sierre, Switzerland, 2025",
                  )}
                  loading="lazy"
                  data-key="you_see"
                  width={1600}
                  height={1138}
                  srcSet="/images/you_see/you_see-600.jpg 600w, /images/you_see/you_see-800.jpg 800w, /images/you_see/you_see-1200.jpg 1200w, /images/you_see/you_see.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/you-are-what-you-see.html")}
                data-on-click="return muralCardClick(event,'you_see')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"You Are What You See"'} data-es={'"Sos Lo Que Ves"'}>
                  {t('"You Are What You See"', '"Sos Lo Que Ves"')}
                </h3>
                <p className="meta">
                  {t("🇨🇭 Sierre, Switzerland, 2025 · 3.5m x 2.2m", "🇨🇭 Sierre, Suiza, 2025 · 3.5m x 2.2m")}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="bear_virreyes">
              <a
                className="mural-photo"
                href={l("mural/california-bear.html")}
                data-on-click="return muralCardClick(event,'bear_virreyes')"
              >
                <img
                  className="card-main"
                  src="/images/bear_virreyes/bear_virreyes.jpg"
                  alt={t(
                    "California Bear, mural by Cundo Marchi, Virreyes, Buenos Aires, Argentina, 2025",
                    "California Bear, mural de Cundo Marchi, Virreyes, Buenos Aires, Argentina, 2025",
                  )}
                  loading="lazy"
                  data-key="bear_virreyes"
                  width={1200}
                  height={1600}
                  srcSet="/images/bear_virreyes/bear_virreyes-600.jpg 600w, /images/bear_virreyes/bear_virreyes-800.jpg 800w, /images/bear_virreyes/bear_virreyes.jpg 1200w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/california-bear.html")}
                data-on-click="return muralCardClick(event,'bear_virreyes')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"California Bear"'} data-es={'"Oso de California"'}>
                  {t('"California Bear"', '"Oso de California"')}
                </h3>
                <p className="meta">🇦🇷 Virreyes, Buenos Aires, Argentina, 2025 · 3m x 2.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="bailarina">
              <a
                className="mural-photo"
                href={l("mural/the-ballerina.html")}
                data-on-click="return muralCardClick(event,'bailarina')"
              >
                <img
                  className="card-main"
                  src="/images/bailarina/bailarina.jpg"
                  alt={t(
                    "The Ballerina, mural by Cundo Marchi, San Fernando, Buenos Aires, Argentina, 2025",
                    "The Ballerina, mural de Cundo Marchi, San Fernando, Buenos Aires, Argentina, 2025",
                  )}
                  loading="lazy"
                  data-key="bailarina"
                  width={900}
                  height={1600}
                  srcSet="/images/bailarina/bailarina-600.jpg 600w, /images/bailarina/bailarina-800.jpg 800w, /images/bailarina/bailarina.jpg 900w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-ballerina.html")}
                data-on-click="return muralCardClick(event,'bailarina')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{"Exterior Paint & Brush"}</span>
                </div>
                <h3 data-en={'"The Ballerina"'} data-es={'"La Bailarina"'}>
                  {t('"The Ballerina"', '"La Bailarina"')}
                </h3>
                <p className="meta">🇦🇷 San Fernando, Buenos Aires, Argentina, 2025 · 2.5m x 1.2m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="dinamarca_hostel">
              <a
                className="mural-photo"
                href={l("mural/it-s-more-fun.html")}
                data-on-click="return muralCardClick(event,'dinamarca_hostel')"
              >
                <img
                  className="card-main"
                  src="/images/dinamarca_hostel/dinamarca_hostel.jpg"
                  alt={t(
                    "It's More Fun, mural by Cundo Marchi, Denmark, 2025",
                    "It's More Fun, mural de Cundo Marchi, Denmark, 2025",
                  )}
                  loading="lazy"
                  data-key="dinamarca_hostel"
                  width={1600}
                  height={900}
                  srcSet="/images/dinamarca_hostel/dinamarca_hostel-600.jpg 600w, /images/dinamarca_hostel/dinamarca_hostel-800.jpg 800w, /images/dinamarca_hostel/dinamarca_hostel-1200.jpg 1200w, /images/dinamarca_hostel/dinamarca_hostel.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/it-s-more-fun.html")}
                data-on-click="return muralCardClick(event,'dinamarca_hostel')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"It\'s More Fun"'} data-es={'"It\'s More Fun"'}>
                  {'"It\'s More Fun"'}
                </h3>
                <p className="meta">{t("🇩🇰 Denmark, 2025 · 3.5m x 1.2m", "🇩🇰 Dinamarca, 2025 · 3.5m x 1.2m")}</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="parma_medusa">
              <a
                className="mural-photo"
                href={l("mural/medusa.html")}
                data-on-click="return muralCardClick(event,'parma_medusa')"
              >
                <img
                  className="card-main"
                  src="/images/parma_medusa/parma_medusa.jpg"
                  alt={t(
                    "Medusa, mural by Cundo Marchi, Parma, Italy, 2025",
                    "Medusa, mural de Cundo Marchi, Parma, Italy, 2025",
                  )}
                  loading="lazy"
                  data-key="parma_medusa"
                  width={1200}
                  height={1600}
                  srcSet="/images/parma_medusa/parma_medusa-600.jpg 600w, /images/parma_medusa/parma_medusa-800.jpg 800w, /images/parma_medusa/parma_medusa.jpg 1200w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/medusa.html")}
                data-on-click="return muralCardClick(event,'parma_medusa')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Medusa"'} data-es={'"Medusa"'}>
                  {'"Medusa"'}
                </h3>
                <p className="meta">
                  {t("🇮🇹 Parma, Italy, 2025 · 3.5m x 2.5m", "🇮🇹 Parma, Italia, 2025 · 3.5m x 2.5m")}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="viking_malmo">
              <a
                className="mural-photo"
                href={l("mural/the-viking.html")}
                data-on-click="return muralCardClick(event,'viking_malmo')"
              >
                <img
                  className="card-main"
                  src="/images/viking_malmo/viking_malmo.jpg"
                  alt={t(
                    "The Viking, mural by Cundo Marchi, Malmö, Sweden, 2025",
                    "The Viking, mural de Cundo Marchi, Malmö, Sweden, 2025",
                  )}
                  loading="lazy"
                  data-key="viking_malmo"
                  width={1200}
                  height={1600}
                  srcSet="/images/viking_malmo/viking_malmo-600.jpg 600w, /images/viking_malmo/viking_malmo-800.jpg 800w, /images/viking_malmo/viking_malmo.jpg 1200w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-viking.html")}
                data-on-click="return muralCardClick(event,'viking_malmo')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"The Viking"'} data-es={'"El Vikingo"'}>
                  {t('"The Viking"', '"El Vikingo"')}
                </h3>
                <p className="meta">
                  {t("🇸🇪 Malmö, Sweden, 2025 · size TBC", "🇸🇪 Malmö, Suecia, 2025 · medida a confirmar")}
                </p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="nino_interior">
              <a
                className="mural-photo"
                href={l("mural/inner-child.html")}
                data-on-click="return muralCardClick(event,'nino_interior')"
              >
                <img
                  className="card-main"
                  src="/images/nino_interior/nino_interior.jpg"
                  alt={t(
                    "Inner Child, mural by Cundo Marchi, San Fernando, Buenos Aires, Argentina, 2025",
                    "Inner Child, mural de Cundo Marchi, San Fernando, Buenos Aires, Argentina, 2025",
                  )}
                  loading="lazy"
                  data-key="nino_interior"
                  width={1600}
                  height={2844}
                  srcSet="/images/nino_interior/nino_interior-600.jpg 600w, /images/nino_interior/nino_interior-800.jpg 800w, /images/nino_interior/nino_interior-1200.jpg 1200w, /images/nino_interior/nino_interior.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/inner-child.html")}
                data-on-click="return muralCardClick(event,'nino_interior')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Inner Child"'} data-es={'"Niño Interior"'}>
                  {t('"Inner Child"', '"Niño Interior"')}
                </h3>
                <p className="meta">🇦🇷 San Fernando, Buenos Aires, Argentina, 2025 · 2.5m x 2m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="inac_hospitality">
              <a
                className="mural-photo"
                href={l("mural/the-chef.html")}
                data-on-click="return muralCardClick(event,'inac_hospitality')"
              >
                <img
                  className="card-main"
                  src="/images/inac_hospitality/inac_hospitality.jpg"
                  alt={t(
                    "The Chef, mural by Cundo Marchi, Broadbeach, Queensland, Australia, 2026",
                    "The Chef, mural de Cundo Marchi, Broadbeach, Queensland, Australia, 2026",
                  )}
                  loading="lazy"
                  data-key="inac_hospitality"
                  width={1518}
                  height={1600}
                  srcSet="/images/inac_hospitality/inac_hospitality-600.jpg 600w, /images/inac_hospitality/inac_hospitality-800.jpg 800w, /images/inac_hospitality/inac_hospitality-1200.jpg 1200w, /images/inac_hospitality/inac_hospitality.jpg 1518w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-chef.html")}
                data-on-click="return muralCardClick(event,'inac_hospitality')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Interior Mural", "Mural de interior")}</span>
                </div>
                <h3 data-en={'"The Chef"'} data-es={'"El Chef"'}>
                  {t('"The Chef"', '"El Chef"')}
                </h3>
                <p className="meta">🇦🇺 Broadbeach, Queensland, Australia, 2026 · 2m x 2m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="kangaroo">
              <a
                className="mural-photo"
                href={l("mural/the-boxing-kangaroo.html")}
                data-on-click="return muralCardClick(event,'kangaroo')"
              >
                <img
                  className="card-main"
                  src="/images/kangaroo/kangaroo.jpg"
                  alt={t(
                    "The Boxing Kangaroo, mural by Cundo Marchi, Gold Coast, Queensland, Australia, 2026",
                    "The Boxing Kangaroo, mural de Cundo Marchi, Gold Coast, Queensland, Australia, 2026",
                  )}
                  loading="lazy"
                  data-key="kangaroo"
                  width={1440}
                  height={1558}
                  srcSet="/images/kangaroo/kangaroo-600.jpg 600w, /images/kangaroo/kangaroo-800.jpg 800w, /images/kangaroo/kangaroo-1200.jpg 1200w, /images/kangaroo/kangaroo.jpg 1440w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a
                className="mural-info"
                href={l("mural/the-boxing-kangaroo.html")}
                data-on-click="return muralCardClick(event,'kangaroo')"
              >
                <div className="pills">
                  <span className="pill tag-fill">{t("Street Art", "Arte urbano")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"The Boxing Kangaroo"'} data-es={'"El Canguro Boxeador"'}>
                  {t('"The Boxing Kangaroo"', '"El Canguro Boxeador"')}
                </h3>
                <p className="meta">🇦🇺 Gold Coast, Queensland, Australia, 2026 · 2.5m x 2.5m</p>
              </a>
            </article>
            <article className="mural-card" data-mural-id="tay">
              <a className="mural-photo" href={l("mural/tay.html")} data-on-click="return muralCardClick(event,'tay')">
                <img
                  className="card-main"
                  src="/images/tay/tay.jpg"
                  alt={t(
                    "Tay, portrait mural by Cundo Marchi in Australia, 2026",
                    "Tay, mural de retrato de Cundo Marchi en Australia, 2026",
                  )}
                  loading="lazy"
                  data-key="tay"
                  width={1600}
                  height={2133}
                  srcSet="/images/tay/tay-600.jpg 600w, /images/tay/tay-800.jpg 800w, /images/tay/tay-1200.jpg 1200w, /images/tay/tay.jpg 1600w"
                  sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                />
              </a>{" "}
              <a className="mural-info" href={l("mural/tay.html")} data-on-click="return muralCardClick(event,'tay')">
                <div className="pills">
                  <span className="pill tag-fill">{t("Commission Work", "Obra por encargo")}</span>
                  <span className="pill tag-outline">{t("Spray Paint", "Aerosol")}</span>
                </div>
                <h3 data-en={'"Tay"'} data-es={'"Tay"'}>
                  {'"Tay"'}
                </h3>
                <p className="meta">🇦🇺 Victoria, Australia, 2026</p>
              </a>
            </article>
          </div>
          <div className="grid-fade" id="homeGridFade"></div>
        </div>
        <div style={{ textAlign: "center", padding: "32px 0 0" }}>
          <button
            className="btn-secondary"
            id="homeSeeMoreBtn"
            data-on-click="expandHomeGrid()"
            data-en="See the Work"
            data-es="Ver los Trabajos"
          >
            {t("See the Work", "Ver los Trabajos")}
          </button>
        </div>
      </section>
    </div>
  );
}
