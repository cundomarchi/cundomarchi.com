// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function ShopPage({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <div className="page shop-coming-soon" id="page-shop">
      <div className="page-bg" id="bg-shop">
        <img
          loading="lazy"
          decoding="async"
          src="/images/site/bg_shop_hollywood.jpg"
          alt=""
          data-key="bg_shop"
          width={1500}
          height={2000}
          srcSet="/images/site/bg_shop_hollywood-600.jpg 600w, /images/site/bg_shop_hollywood-800.jpg 800w, /images/site/bg_shop_hollywood-1200.jpg 1200w, /images/site/bg_shop_hollywood.jpg 1500w"
          sizes="100vw"
        />
      </div>
      <button
        className="page-bg-edit-btn"
        data-on-click="editSectionBg('shop', this)"
        data-en="🖼 Edit this background"
        data-es="🖼 Editar este fondo"
      >
        {t("🖼 Edit this background", "🖼 Editar este fondo")}
      </button>
      <div className="coming-soon-stage" aria-labelledby="comingSoonTitle">
        <p className="coming-soon-kicker" data-en="New pieces are on the way" data-es="Se vienen nuevas piezas">
          {t("New pieces are on the way", "Se vienen nuevas piezas")}
        </p>
        <h2 id="comingSoonTitle" className="sr-only" data-en="Shop coming soon" data-es="Tienda próximamente">
          {t("Shop coming soon", "Tienda próximamente")}
        </h2>
        <div className="coming-soon-tape" aria-hidden="true">
          <div>COMING SOON · COMING SOON · COMING SOON · COMING SOON · COMING SOON ·</div>
        </div>
      </div>
      <section className="section shop">
        <div className="wrap">
          <span className="eyebrow" data-en="Wearable Murals" data-es="Murales Para Vestir">
            {t("Wearable Murals", "Murales Para Vestir")}
          </span>{" "}
          <h2 className="section-title" data-en="Shop" data-es="Tienda">
            {t("Shop", "Tienda")}
          </h2>
          <p
            style={{
              color: "var(--gray)",
              marginTop: "-24px",
              marginBottom: "36px",
              fontSize: "14px",
              maxWidth: "540px",
            }}
            data-en="Limited-run merch from past editions and events. Once it's gone, it's gone."
            data-es="Merch de tiradas limitadas de ediciones y eventos pasados. Una vez que se agota, se agotó."
          >
            {t(
              "Limited-run merch from past editions and events. Once it's gone, it's gone.",
              "Merch de tiradas limitadas de ediciones y eventos pasados. Una vez que se agota, se agotó.",
            )}
          </p>
          <div className="shop-category">
            <h3 className="shop-category-title" data-en="Hoodies" data-es="Buzos">
              {t("Hoodies", "Buzos")}
            </h3>
            <div className="shop-grid">
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_hoodie_miami/shop_hoodie_miami_mockup.jpg"
                    alt={t(
                      "Miami Bitch Hoodie digital mockup by Cundo Marchi",
                      "Miami Bitch Hoodie digital mockup de Cundo Marchi",
                    )}
                    data-key="shop_hoodie_miami"
                    width={909}
                    height={909}
                    srcSet="/images/shop/shop_hoodie_miami/shop_hoodie_miami_mockup-600.jpg 600w, /images/shop/shop_hoodie_miami/shop_hoodie_miami_mockup-800.jpg 800w, /images/shop/shop_hoodie_miami/shop_hoodie_miami_mockup.jpg 909w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Miami Bitch Hoodie</h4>
                  <p className="shop-card-meta">2024</p>{" "}
                  <span className="price" data-usd="80">
                    $80 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_hoodie_bsas/shop_hoodie_bsas_mockup.jpg"
                    alt={t(
                      "Buenos Aires Hoodie digital mockup by Cundo Marchi",
                      "Buenos Aires Hoodie digital mockup de Cundo Marchi",
                    )}
                    data-key="shop_hoodie_bsas"
                    width={1131}
                    height={1600}
                    srcSet="/images/shop/shop_hoodie_bsas/shop_hoodie_bsas_mockup-600.jpg 600w, /images/shop/shop_hoodie_bsas/shop_hoodie_bsas_mockup-800.jpg 800w, /images/shop/shop_hoodie_bsas/shop_hoodie_bsas_mockup.jpg 1131w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Buenos Aires Hoodie</h4>
                  <p className="shop-card-meta">2023</p>{" "}
                  <span className="price" data-usd="80">
                    $80 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_hoodie_sugar/shop_hoodie_sugar_mockup.jpg"
                    alt={t(
                      "Sugar Hoodie digital mockup by Cundo Marchi",
                      "Sugar Hoodie digital mockup de Cundo Marchi",
                    )}
                    data-key="shop_hoodie_sugar"
                    width={1600}
                    height={1131}
                    srcSet="/images/shop/shop_hoodie_sugar/shop_hoodie_sugar_mockup-600.jpg 600w, /images/shop/shop_hoodie_sugar/shop_hoodie_sugar_mockup-800.jpg 800w, /images/shop/shop_hoodie_sugar/shop_hoodie_sugar_mockup.jpg 1600w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Sugar Hoodie</h4>
                  <p className="shop-card-meta">2023</p>{" "}
                  <span className="price" data-usd="80">
                    $80 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="shop-category">
            <h3 className="shop-category-title" data-en="T-Shirts" data-es="Remeras">
              {t("T-Shirts", "Remeras")}
            </h3>
            <div className="shop-grid">
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_tee_sugar2/shop_tee_sugar2_mockup_new.jpg"
                    alt={t(
                      "Sugar Shirt Vol II digital mockup by Cundo Marchi",
                      "Sugar Shirt Vol II digital mockup de Cundo Marchi",
                    )}
                    data-key="shop_tee_sugar2"
                    width={1600}
                    height={1117}
                    srcSet="/images/shop/shop_tee_sugar2/shop_tee_sugar2_mockup_new-600.jpg 600w, /images/shop/shop_tee_sugar2/shop_tee_sugar2_mockup_new-800.jpg 800w, /images/shop/shop_tee_sugar2/shop_tee_sugar2_mockup_new.jpg 1600w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Sugar Shirt Vol II</h4>
                  <p className="shop-card-meta">2024</p>{" "}
                  <span className="price" data-usd="40">
                    $40 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_tee_sugar2/shop_tee_sugar_white_mockup.jpg"
                    alt={t(
                      "Original white Sugar T-Shirt by Cundo Marchi",
                      "Original white Sugar T-Shirt de Cundo Marchi",
                    )}
                    data-key="shop_tee_sugar_white"
                    width={1109}
                    height={1109}
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Sugar T-Shirt — White</h4>
                  <p className="shop-card-meta">2023</p>{" "}
                  <span className="price" data-usd="40">
                    $40 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_tee_sugar2/shop_tee_sugar_black_mockup.jpg"
                    alt={t(
                      "Original black Sugar T-Shirt by Cundo Marchi",
                      "Original black Sugar T-Shirt de Cundo Marchi",
                    )}
                    data-key="shop_tee_sugar_black"
                    width={1091}
                    height={1091}
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Sugar T-Shirt — Black</h4>
                  <p className="shop-card-meta">2023</p>{" "}
                  <span className="price" data-usd="40">
                    $40 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_tee_player/shop_tee_player_mockup_new.jpg"
                    alt={t(
                      "Player T-Shirt digital mockup by Cundo Marchi",
                      "Player T-Shirt digital mockup de Cundo Marchi",
                    )}
                    data-key="shop_tee_player"
                    width={1131}
                    height={1600}
                    srcSet="/images/shop/shop_tee_player/shop_tee_player_mockup_new-600.jpg 600w, /images/shop/shop_tee_player/shop_tee_player_mockup_new-800.jpg 800w, /images/shop/shop_tee_player/shop_tee_player_mockup_new.jpg 1131w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Player T Shirt</h4>
                  <p className="shop-card-meta">2024</p>{" "}
                  <span className="price" data-usd="40">
                    $40 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_tee_miami/shop_tee_miami_mockup_new.jpg"
                    alt={t(
                      "Miami T-Shirt digital mockup by Cundo Marchi, Dade County print",
                      "Miami T-Shirt digital mockup de Cundo Marchi, Dade County print",
                    )}
                    data-key="shop_tee_miami"
                    width={1131}
                    height={1600}
                    srcSet="/images/shop/shop_tee_miami/shop_tee_miami_mockup_new-600.jpg 600w, /images/shop/shop_tee_miami/shop_tee_miami_mockup_new-800.jpg 800w, /images/shop/shop_tee_miami/shop_tee_miami_mockup_new.jpg 1131w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Miami T Shirt</h4>
                  <p className="shop-card-meta">2025</p>{" "}
                  <span className="price" data-usd="40">
                    $40 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="shop-category">
            <h3 className="shop-category-title" data-en="Buffs" data-es="Buffs">
              Buffs
            </h3>
            <div className="shop-grid">
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-blur"
                    src="/images/shop/shop_buff_psycho/shop_buff_1-600.jpg"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={600}
                  />
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_buff_psycho/shop_buff_1.jpg"
                    alt={t("Psycho Buff neck gaiter by Cundo Marchi", "Psycho Buff buff de cuello de Cundo Marchi")}
                    data-key="shop_buff_psycho"
                    width={1539}
                    height={1539}
                    srcSet="/images/shop/shop_buff_psycho/shop_buff_1-600.jpg 600w, /images/shop/shop_buff_psycho/shop_buff_1-800.jpg 800w, /images/shop/shop_buff_psycho/shop_buff_1.jpg 1539w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>Psycho Buff</h4>
                  <p className="shop-card-meta">2025</p>{" "}
                  <span className="price" data-usd="30">
                    $30 USD
                  </span>
                </div>
              </div>
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-blur"
                    src="/images/shop/shop_buff_bsas/shop_buff_2-600.jpg"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={600}
                  />
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_buff_bsas/shop_buff_2.jpg"
                    alt={t(
                      "Buenos Aires Buff neck gaiter by Cundo Marchi",
                      "Buenos Aires Buff buff de cuello de Cundo Marchi",
                    )}
                    data-key="shop_buff_bsas"
                    width={700}
                    height={700}
                    srcSet="/images/shop/shop_buff_bsas/shop_buff_2-600.jpg 600w, /images/shop/shop_buff_bsas/shop_buff_2.jpg 700w"
                    sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 300px"
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>BsAs Buff</h4>
                  <p className="shop-card-meta">2026</p>{" "}
                  <span className="price" data-usd="30">
                    $30 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="shop-category">
            <h3 className="shop-category-title" data-en="Mugs" data-es="Tazas">
              {t("Mugs", "Tazas")}
            </h3>
            <div className="shop-grid">
              <div className="shop-card sold-out">
                <div className="shop-card-img">
                  <img
                    className="card-main"
                    loading="lazy"
                    decoding="async"
                    src="/images/shop/shop_mug_golo/shop_mug_2.jpg"
                    alt={t("GoloTaza mug by Cundo Marchi", "GoloTaza mug de Cundo Marchi")}
                    data-key="shop_mug_golo"
                    width={1600}
                    height={1066}
                  />
                  <span className="sold-out-badge" data-en="Sold Out" data-es="Agotado">
                    {t("Sold Out", "Agotado")}
                  </span>
                </div>
                <div className="shop-card-body">
                  <h4>GoloTaza</h4>{" "}
                  <span className="price" data-usd="20">
                    $20 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p
            className="shop-footnote"
            data-en="More drops coming as new murals happen. Follow along on Instagram."
            data-es="Más lanzamientos a medida que salgan nuevos murales. Seguime en Instagram."
          >
            {t(
              "More drops coming as new murals happen. Follow along on Instagram.",
              "Más lanzamientos a medida que salgan nuevos murales. Seguime en Instagram.",
            )}
          </p>
        </div>
      </section>
      <section className="section instagram-feed">
        <div className="wrap">
          <div className="ig-profile">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/hero_bio_portrait.jpg"
              alt="Cundo Marchi"
              className="ig-profile-pic"
              data-key="ig_profile_pic"
              width={850}
              height={1124}
            />
            <div className="ig-profile-info">
              <span className="ig-handle">@cundomarchi</span>{" "}
              <p
                className="ig-bio"
                data-en={"Visual & Urban Artist, murals in 15+ countries"}
                data-es="Artista Visual y Urbano, murales en más de 15 países"
              >
                {t(
                  "Visual & Urban Artist, murals in 15+ countries",
                  "Artista Visual y Urbano, murales en más de 15 países",
                )}
              </p>{" "}
              <a
                href="https://instagram.com/cundomarchi"
                target="_blank"
                rel="noopener"
                className="btn-primary ig-follow-btn"
                data-en="Follow on Instagram"
                data-es="Seguir en Instagram"
              >
                {t("Follow on Instagram", "Seguir en Instagram")}
              </a>
            </div>
          </div>
          <div className="ig-feed-grid">
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/king_of_kings/king_of_kings-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={734}
              />
              <img
                className="card-main"
                src="/images/king_of_kings/king_of_kings.jpg"
                alt={t("The King of Kings mural, Ushuaia, Argentina", "Mural The King of Kings, Ushuaia, Argentina")}
                loading="lazy"
                width={900}
                height={1101}
                srcSet="/images/king_of_kings/king_of_kings-600.jpg 600w, /images/king_of_kings/king_of_kings-800.jpg 800w, /images/king_of_kings/king_of_kings.jpg 900w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/meeting_of_styles/meeting_of_styles_after-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={800}
              />
              <img
                className="card-main"
                src="/images/meeting_of_styles/meeting_of_styles_after.jpg"
                alt={t("Meeting of Styles mural, Malmo, Sweden", "Mural Meeting of Styles, Malmo, Sweden")}
                loading="lazy"
                width={1200}
                height={1600}
                srcSet="/images/meeting_of_styles/meeting_of_styles_after-600.jpg 600w, /images/meeting_of_styles/meeting_of_styles_after-800.jpg 800w, /images/meeting_of_styles/meeting_of_styles_after.jpg 1200w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/zeus_athens/zeus_athens-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={450}
              />
              <img
                className="card-main"
                src="/images/zeus_athens/zeus_athens.jpg"
                alt={t("Herakles mural, Athens, Greece", "Mural Herakles, Athens, Greece")}
                loading="lazy"
                width={1600}
                height={1200}
                srcSet="/images/zeus_athens/zeus_athens-600.jpg 600w, /images/zeus_athens/zeus_athens-800.jpg 800w, /images/zeus_athens/zeus_athens-1200.jpg 1200w, /images/zeus_athens/zeus_athens.jpg 1600w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/ocean_heart/ocean_heart-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={406}
              />
              <img
                className="card-main"
                src="/images/ocean_heart/ocean_heart.jpg"
                alt={t("Ocean Heart mural by Cundo Marchi", "Ocean Heart mural de Cundo Marchi")}
                loading="lazy"
                width={1600}
                height={1084}
                srcSet="/images/ocean_heart/ocean_heart-600.jpg 600w, /images/ocean_heart/ocean_heart-800.jpg 800w, /images/ocean_heart/ocean_heart-1200.jpg 1200w, /images/ocean_heart/ocean_heart.jpg 1600w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/tlaloc/tlaloc_extra5-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={338}
              />
              <img
                className="card-main"
                src="/images/tlaloc/tlaloc_extra5.jpg"
                alt={t(
                  "Tlaloc mural by Cundo Marchi, Playa del Carmen, Quintana Roo, Mexico",
                  "Tlaloc mural de Cundo Marchi, Playa del Carmen, Quintana Roo, Mexico",
                )}
                loading="lazy"
                width={1600}
                height={900}
                srcSet="/images/tlaloc/tlaloc_extra5-600.jpg 600w, /images/tlaloc/tlaloc_extra5-800.jpg 800w, /images/tlaloc/tlaloc_extra5-1200.jpg 1200w, /images/tlaloc/tlaloc_extra5.jpg 1600w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/the_eyes/the_eyes-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={426}
              />
              <img
                className="card-main"
                src="/images/the_eyes/the_eyes.jpg"
                alt={t("The Eyes mural, San Fernando, Argentina", "Mural The Eyes, San Fernando, Argentina")}
                loading="lazy"
                width={1351}
                height={960}
                srcSet="/images/the_eyes/the_eyes-600.jpg 600w, /images/the_eyes/the_eyes-800.jpg 800w, /images/the_eyes/the_eyes-1200.jpg 1200w, /images/the_eyes/the_eyes.jpg 1351w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/flower_octopus/flower_octopus-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={408}
              />
              <img
                className="card-main"
                src="/images/flower_octopus/flower_octopus.jpg"
                alt={t(
                  "Flower Octopus mural, Buenos Aires, Argentina",
                  "Mural Flower Octopus, Buenos Aires, Argentina",
                )}
                loading="lazy"
                width={1600}
                height={1088}
                srcSet="/images/flower_octopus/flower_octopus-600.jpg 600w, /images/flower_octopus/flower_octopus-800.jpg 800w, /images/flower_octopus/flower_octopus-1200.jpg 1200w, /images/flower_octopus/flower_octopus.jpg 1600w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>{" "}
            <a href="https://instagram.com/cundomarchi" target="_blank" rel="noopener" className="ig-feed-item">
              <img
                className="card-blur"
                src="/images/laos_california/laos_california-600.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={600}
                height={314}
              />
              <img
                className="card-main"
                src="/images/laos_california/laos_california.jpg"
                alt={t("Laos California mural by Cundo Marchi", "Laos California mural de Cundo Marchi")}
                loading="lazy"
                width={900}
                height={472}
                srcSet="/images/laos_california/laos_california-600.jpg 600w, /images/laos_california/laos_california-800.jpg 800w, /images/laos_california/laos_california.jpg 900w"
                sizes="(max-width:700px) 30vw, 220px"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
