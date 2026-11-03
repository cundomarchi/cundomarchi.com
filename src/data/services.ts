// Paginas de servicios, en ingles y espanol.
// Generado una sola vez desde las paginas HTML del sitio anterior; de ahora en
// adelante se edita a mano.
import type { ServicePage } from "./service-types";

export const servicePages: ServicePage[] = [
  {
    "slug": "murals",
    "lang": "en",
    "alternateSlug": "murales",
    "seo": {
      "title": "Commissioned Murals | Cundo Marchi",
      "description": "Custom murals for homes, businesses and public spaces, painted worldwide by muralist Cundo Marchi.",
      "ogTitle": "Murals — Cundo Marchi",
      "ogDescription": "Custom murals for homes, businesses and public spaces, painted worldwide by muralist Cundo Marchi.",
      "ogImage": "https://www.cundomarchi.com/images/flower_octopus/flower_octopus.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Murals",
          "description": "Custom murals for homes, businesses and public spaces, painted worldwide by muralist Cundo Marchi.",
          "url": "https://www.cundomarchi.com/services/murals.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/flower_octopus/flower_octopus.jpg",
        "alt": "Murals by Cundo Marchi",
        "width": 1600,
        "height": 1088,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Service 01",
      "title": "Murals",
      "text": "Custom wall art designed for the architecture, audience and story of each space."
    },
    "sections": [
      {
        "kind": "categories",
        "items": [
          {
            "title": "Home interiors",
            "text": "A piece designed around the room's light, scale and architecture."
          },
          {
            "title": "Commercial spaces",
            "text": "Murals for stores, offices, restaurants and hospitality spaces, built around the identity of each place."
          },
          {
            "title": "Exterior and public walls",
            "text": "Large-scale work made for facades, festivals and public spaces, with materials chosen for outdoor durability."
          }
        ]
      },
      {
        "kind": "eyebrow",
        "text": "Before & after"
      },
      {
        "kind": "comparisons",
        "items": [
          {
            "title": "Flower Octopus",
            "beforeLabel": "Before",
            "afterLabel": "After",
            "before": {
              "src": "/images/flower_octopus/flower_octopus_before.jpg",
              "alt": "Flower Octopus — Before",
              "width": 1600,
              "height": 1212,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/flower_octopus/flower_octopus.jpg",
              "alt": "Flower Octopus — After",
              "width": 1600,
              "height": 1088,
              "loading": "lazy"
            },
            "caption": "Flower Octopus · click to compare"
          },
          {
            "title": "The Circle of Nature",
            "beforeLabel": "Before",
            "afterLabel": "After",
            "before": {
              "src": "/images/circle_of_nature/circle_of_nature_before.jpg",
              "alt": "The Circle of Nature — Before",
              "width": 1600,
              "height": 1066,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/circle_of_nature/circle_of_nature.jpg",
              "alt": "The Circle of Nature — After",
              "width": 1600,
              "height": 1066,
              "loading": "lazy"
            },
            "caption": "The Circle of Nature · click to compare"
          },
          {
            "title": "The City of the Fury",
            "beforeLabel": "Before",
            "afterLabel": "After",
            "before": {
              "src": "/images/city_of_fury/city_of_fury_before.jpg",
              "alt": "The City of the Fury — Before",
              "width": 1600,
              "height": 1200,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/city_of_fury/city_of_fury_extra1.jpg",
              "alt": "The City of the Fury — After",
              "width": 1600,
              "height": 1600,
              "loading": "lazy"
            },
            "caption": "The City of the Fury · click to compare"
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Tell me about your project",
        "text": "Answer a few simple questions and I will prepare a proposal for your space, event or team.",
        "label": "Request a quote",
        "request": "mural"
      }
    ]
  },
  {
    "slug": "live-painting",
    "lang": "en",
    "alternateSlug": "pintura-en-vivo",
    "seo": {
      "title": "Live Painting for Events | Cundo Marchi",
      "description": "Live painting for events, brand activations, galas and public openings worldwide.",
      "ogTitle": "Live Painting — Cundo Marchi",
      "ogDescription": "Live painting for events, brand activations, galas and public openings worldwide.",
      "ogImage": "https://www.cundomarchi.com/images/live-painting/bg_live.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Live Painting",
          "description": "Live painting for events, brand activations, galas and public openings worldwide.",
          "url": "https://www.cundomarchi.com/services/live-painting.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/live-painting/bg_live.jpg",
        "alt": "Live Painting by Cundo Marchi",
        "width": 1360,
        "height": 906,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Service 02",
      "title": "Live Painting",
      "text": "A complete artwork created live in front of the audience, turning the painting process into part of the event."
    },
    "sections": [
      {
        "kind": "live-event",
        "title": "Art Basel Week, Wynwood, Miami",
        "meta": "Live painting for Fume Vapors at 1-800 Lucky · 2024",
        "figures": [
          {
            "img": {
              "src": "/images/live-painting/live_basel_night1.jpg",
              "alt": "Cundo Marchi painting live under blacklight",
              "width": 1360,
              "height": 906,
              "loading": "lazy"
            },
            "caption": "Painting live under blacklight"
          },
          {
            "img": {
              "src": "/images/live-painting/live_basel_night2.jpg",
              "alt": "Live painting in progress",
              "width": 698,
              "height": 1047,
              "loading": "lazy"
            },
            "caption": "Canvas in progress"
          },
          {
            "img": {
              "src": "/images/live-painting/live_basel_night3.jpg",
              "alt": "Finished live painting",
              "width": 900,
              "height": 1200,
              "loading": "lazy"
            },
            "caption": "Finished piece"
          }
        ]
      },
      {
        "kind": "live-event",
        "title": "Otamendi Palace Opening",
        "meta": "Buenos Aires, Argentina · 2023",
        "figures": [
          {
            "img": {
              "src": "/images/live-painting/live_painting_1.jpg",
              "alt": "Sketching at Otamendi Palace",
              "width": 1080,
              "height": 1350,
              "loading": "lazy"
            }
          },
          {
            "img": {
              "src": "/images/live-painting/live_otamendi_day3.jpg",
              "alt": "Live painting composition",
              "width": 626,
              "height": 782,
              "loading": "lazy"
            }
          },
          {
            "img": {
              "src": "/images/live-painting/live_otamendi_final2.jpg",
              "alt": "Finished piece at Otamendi Palace",
              "width": 1284,
              "height": 1600,
              "loading": "lazy"
            }
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Tell me about your project",
        "text": "Answer a few simple questions and I will prepare a proposal for your space, event or team.",
        "label": "Request a quote",
        "request": "live"
      }
    ]
  },
  {
    "slug": "workshops",
    "lang": "en",
    "alternateSlug": "talleres",
    "seo": {
      "title": "Painting and Mural Workshops | Cundo Marchi",
      "description": "Hands-on painting, graffiti and mural workshops for companies, events and groups.",
      "ogTitle": "Workshops — Cundo Marchi",
      "ogDescription": "Hands-on painting, graffiti and mural workshops for companies, events and groups.",
      "ogImage": "https://www.cundomarchi.com/images/live-painting/workshop_tiktok_3.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Workshops",
          "description": "Hands-on painting, graffiti and mural workshops for companies, events and groups.",
          "url": "https://www.cundomarchi.com/services/workshops.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/live-painting/workshop_tiktok_3.jpg",
        "alt": "Workshops by Cundo Marchi",
        "width": 739,
        "height": 1600,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Service 03",
      "title": "Workshops",
      "text": "Practical, collaborative sessions designed for teams, events and people painting for the first time."
    },
    "sections": [
      {
        "kind": "categories",
        "items": [
          {
            "title": "Community mural",
            "text": "The group designs and paints one shared piece, guided from the first sketch to the final wall."
          },
          {
            "title": "Individual canvases",
            "text": "Each participant creates and keeps a personal artwork while learning practical spray and painting techniques."
          },
          {
            "title": "Teams and events",
            "text": "Sessions adapted for companies, festivals, brand activations and beginner groups."
          }
        ]
      },
      {
        "kind": "workshop-gallery",
        "label": "TikTok Live Fest 2023 · Ice Palace Films, Downtown Miami",
        "images": [
          {
            "src": "/images/live-painting/workshop_tiktok_3.jpg",
            "alt": "TikTok Live Fest workshop stage",
            "width": 739,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          },
          {
            "src": "/images/live-painting/workshop_tiktok_1.jpg",
            "alt": "Cundo Marchi leading a painting workshop",
            "width": 1200,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          },
          {
            "src": "/images/live-painting/workshop_tiktok_2.jpg",
            "alt": "Workshop participants with their finished canvas",
            "width": 1200,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Tell me about your project",
        "text": "Answer a few simple questions and I will prepare a proposal for your space, event or team.",
        "label": "Request a quote",
        "request": "workshop"
      }
    ]
  },
  {
    "slug": "murales",
    "lang": "es",
    "alternateSlug": "murals",
    "seo": {
      "title": "Murales por Encargo | Cundo Marchi",
      "description": "Murales personalizados para casas, negocios y espacios públicos, pintados en todo el mundo por Cundo Marchi.",
      "ogTitle": "Murales — Cundo Marchi",
      "ogDescription": "Murales personalizados para casas, negocios y espacios públicos, pintados en todo el mundo por Cundo Marchi.",
      "ogImage": "https://www.cundomarchi.com/images/flower_octopus/flower_octopus.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Murales",
          "description": "Murales personalizados para casas, negocios y espacios públicos, pintados en todo el mundo por Cundo Marchi.",
          "url": "https://www.cundomarchi.com/es/services/murales.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/flower_octopus/flower_octopus.jpg",
        "alt": "Murales by Cundo Marchi",
        "width": 1600,
        "height": 1088,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Servicio 01",
      "title": "Murales",
      "text": "Arte mural diseñado para la arquitectura, el público y la historia de cada espacio."
    },
    "sections": [
      {
        "kind": "categories",
        "items": [
          {
            "title": "Interiores",
            "text": "Una obra diseñada alrededor de la luz, la escala y la arquitectura del ambiente."
          },
          {
            "title": "Espacios comerciales",
            "text": "Murales para tiendas, oficinas, restaurantes y espacios de hospitalidad, creados alrededor de la identidad de cada lugar."
          },
          {
            "title": "Paredes exteriores y espacios públicos",
            "text": "Obras de gran escala para fachadas, festivales y espacios públicos, con materiales elegidos para resistir a la intemperie."
          }
        ]
      },
      {
        "kind": "eyebrow",
        "text": "Antes y después"
      },
      {
        "kind": "comparisons",
        "items": [
          {
            "title": "Pulpo Flor",
            "beforeLabel": "Antes",
            "afterLabel": "Después",
            "before": {
              "src": "/images/flower_octopus/flower_octopus_before.jpg",
              "alt": "Pulpo Flor — Antes",
              "width": 1600,
              "height": 1212,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/flower_octopus/flower_octopus.jpg",
              "alt": "Pulpo Flor — Después",
              "width": 1600,
              "height": 1088,
              "loading": "lazy"
            },
            "caption": "Pulpo Flor · tocá para comparar"
          },
          {
            "title": "El Círculo de la Naturaleza",
            "beforeLabel": "Antes",
            "afterLabel": "Después",
            "before": {
              "src": "/images/circle_of_nature/circle_of_nature_before.jpg",
              "alt": "El Círculo de la Naturaleza — Antes",
              "width": 1600,
              "height": 1066,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/circle_of_nature/circle_of_nature.jpg",
              "alt": "El Círculo de la Naturaleza — Después",
              "width": 1600,
              "height": 1066,
              "loading": "lazy"
            },
            "caption": "El Círculo de la Naturaleza · tocá para comparar"
          },
          {
            "title": "La Ciudad de la Furia",
            "beforeLabel": "Antes",
            "afterLabel": "Después",
            "before": {
              "src": "/images/city_of_fury/city_of_fury_before.jpg",
              "alt": "La Ciudad de la Furia — Antes",
              "width": 1600,
              "height": 1200,
              "loading": "lazy"
            },
            "after": {
              "src": "/images/city_of_fury/city_of_fury_extra1.jpg",
              "alt": "La Ciudad de la Furia — Después",
              "width": 1600,
              "height": 1600,
              "loading": "lazy"
            },
            "caption": "La Ciudad de la Furia · tocá para comparar"
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Contame sobre tu proyecto",
        "text": "Respondeme unas preguntas simples y preparo una propuesta para tu espacio, evento o equipo.",
        "label": "Solicitar presupuesto",
        "request": "mural"
      }
    ]
  },
  {
    "slug": "pintura-en-vivo",
    "lang": "es",
    "alternateSlug": "live-painting",
    "seo": {
      "title": "Pintura en Vivo para Eventos | Cundo Marchi",
      "description": "Pintura en vivo para eventos, activaciones de marca, galas y aperturas públicas.",
      "ogTitle": "Pintura en vivo — Cundo Marchi",
      "ogDescription": "Pintura en vivo para eventos, activaciones de marca, galas y aperturas públicas.",
      "ogImage": "https://www.cundomarchi.com/images/live-painting/bg_live.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Pintura en vivo",
          "description": "Pintura en vivo para eventos, activaciones de marca, galas y aperturas públicas.",
          "url": "https://www.cundomarchi.com/es/services/pintura-en-vivo.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/live-painting/bg_live.jpg",
        "alt": "Pintura en vivo by Cundo Marchi",
        "width": 1360,
        "height": 906,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Servicio 02",
      "title": "Pintura en vivo",
      "text": "Una obra completa creada frente al público, donde el proceso de pintura se vuelve parte del evento."
    },
    "sections": [
      {
        "kind": "live-event",
        "title": "Art Basel Week, Wynwood, Miami",
        "meta": "Pintura en vivo para Fume Vapors en 1-800 Lucky · 2024",
        "figures": [
          {
            "img": {
              "src": "/images/live-painting/live_basel_night1.jpg",
              "alt": "Cundo Marchi pintando en vivo con luz negra",
              "width": 1360,
              "height": 906,
              "loading": "lazy"
            },
            "caption": "Pintando en vivo con luz negra"
          },
          {
            "img": {
              "src": "/images/live-painting/live_basel_night2.jpg",
              "alt": "Pintura en vivo en proceso",
              "width": 698,
              "height": 1047,
              "loading": "lazy"
            },
            "caption": "Lienzo en proceso"
          },
          {
            "img": {
              "src": "/images/live-painting/live_basel_night3.jpg",
              "alt": "Pintura en vivo terminada",
              "width": 900,
              "height": 1200,
              "loading": "lazy"
            },
            "caption": "Obra terminada"
          }
        ]
      },
      {
        "kind": "live-event",
        "title": "Apertura del Palacio Otamendi",
        "meta": "Buenos Aires, Argentina · 2023",
        "figures": [
          {
            "img": {
              "src": "/images/live-painting/live_painting_1.jpg",
              "alt": "Bocetando en el Palacio Otamendi",
              "width": 1080,
              "height": 1350,
              "loading": "lazy"
            }
          },
          {
            "img": {
              "src": "/images/live-painting/live_otamendi_day3.jpg",
              "alt": "Composición de pintura en vivo",
              "width": 626,
              "height": 782,
              "loading": "lazy"
            }
          },
          {
            "img": {
              "src": "/images/live-painting/live_otamendi_final2.jpg",
              "alt": "Obra terminada en el Palacio Otamendi",
              "width": 1284,
              "height": 1600,
              "loading": "lazy"
            }
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Contame sobre tu proyecto",
        "text": "Respondeme unas preguntas simples y preparo una propuesta para tu espacio, evento o equipo.",
        "label": "Solicitar presupuesto",
        "request": "live"
      }
    ]
  },
  {
    "slug": "talleres",
    "lang": "es",
    "alternateSlug": "workshops",
    "seo": {
      "title": "Talleres de Pintura y Muralismo | Cundo Marchi",
      "description": "Talleres prácticos de pintura, grafiti y muralismo para empresas, eventos y grupos.",
      "ogTitle": "Talleres — Cundo Marchi",
      "ogDescription": "Talleres prácticos de pintura, grafiti y muralismo para empresas, eventos y grupos.",
      "ogImage": "https://www.cundomarchi.com/images/live-painting/workshop_tiktok_3.jpg",
      "jsonLd": [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Talleres",
          "description": "Talleres prácticos de pintura, grafiti y muralismo para empresas, eventos y grupos.",
          "url": "https://www.cundomarchi.com/es/services/talleres.html",
          "provider": {
            "@type": "Person",
            "@id": "https://www.cundomarchi.com/#person",
            "name": "Cundo Marchi"
          },
          "areaServed": "Worldwide"
        }
      ]
    },
    "hero": {
      "img": {
        "src": "/images/live-painting/workshop_tiktok_3.jpg",
        "alt": "Talleres by Cundo Marchi",
        "width": 739,
        "height": 1600,
        "loading": "eager",
        "fetchPriority": "high"
      },
      "eyebrow": "Servicio 03",
      "title": "Talleres",
      "text": "Sesiones prácticas y colaborativas para equipos, eventos y personas que pintan por primera vez."
    },
    "sections": [
      {
        "kind": "categories",
        "items": [
          {
            "title": "Mural comunitario",
            "text": "El grupo diseña y pinta una obra compartida, con guía desde el primer boceto hasta la pared terminada."
          },
          {
            "title": "Lienzos individuales",
            "text": "Cada participante crea y se lleva una obra personal mientras aprende técnicas prácticas de aerosol y pintura."
          },
          {
            "title": "Equipos y eventos",
            "text": "Sesiones adaptadas para empresas, festivales, activaciones de marca y grupos de principiantes."
          }
        ]
      },
      {
        "kind": "workshop-gallery",
        "label": "TikTok Live Fest 2023 · Ice Palace Films, Downtown Miami",
        "images": [
          {
            "src": "/images/live-painting/workshop_tiktok_3.jpg",
            "alt": "TikTok Live Fest escenario del taller",
            "width": 739,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          },
          {
            "src": "/images/live-painting/workshop_tiktok_1.jpg",
            "alt": "Cundo Marchi guiando un taller de pintura",
            "width": 1200,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          },
          {
            "src": "/images/live-painting/workshop_tiktok_2.jpg",
            "alt": "Participantes del taller con el lienzo terminado",
            "width": 1200,
            "height": 1600,
            "loading": "lazy",
            "className": "card-main"
          }
        ]
      },
      {
        "kind": "cta",
        "eyebrow": "Contame sobre tu proyecto",
        "text": "Respondeme unas preguntas simples y preparo una propuesta para tu espacio, evento o equipo.",
        "label": "Solicitar presupuesto",
        "request": "workshop"
      }
    ]
  }
];
