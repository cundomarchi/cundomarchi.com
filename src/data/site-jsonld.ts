// Datos estructurados de la home: quien es Cundo Marchi, el sitio y los servicios.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "Person",
        "VisualArtist"
      ],
      "@id": "https://www.cundomarchi.com/#person",
      "name": "Cundo Marchi",
      "alternateName": "CMZ",
      "jobTitle": "Muralist and Visual Artist",
      "description": "Argentinian muralist and visual artist painting large-scale murals across 5 continents since 2012.",
      "url": "https://www.cundomarchi.com/",
      "image": "https://www.cundomarchi.com/images/site/og_image.jpg",
      "email": "cundomarchi@gmail.com",
      "nationality": {
        "@type": "Country",
        "name": "Argentina"
      },
      "knowsAbout": [
        "Mural Painting",
        "Mural Artist",
        "Wall Art",
        "Large-Scale Murals",
        "Commissioned Murals",
        "Street Art",
        "Graffiti Art",
        "Spray Paint",
        "Aerosol Art",
        "Public Art",
        "Urban Art",
        "Live Painting",
        "Paint Workshops",
        "Interior Murals",
        "Exterior Murals",
        "Commercial Murals",
        "Muralismo",
        "Muralista",
        "Arte Mural",
        "Murales por Encargo",
        "Pintura Mural",
        "Arte Urbano",
        "Grafiti",
        "Pintura en Vivo",
        "Talleres de Pintura",
        "Murales Comerciales"
      ],
      "sameAs": [
        "https://instagram.com/cundomarchi",
        "https://facebook.com/cundomarchi",
        "https://youtube.com/@cundomarchi"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.cundomarchi.com/#website",
      "url": "https://www.cundomarchi.com/",
      "name": "Cundo Marchi",
      "description": "Portfolio of muralist and visual artist Cundo Marchi.",
      "publisher": {
        "@id": "https://www.cundomarchi.com/#person"
      },
      "inLanguage": [
        "en",
        "es",
        "fr",
        "it"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.cundomarchi.com/#service",
      "name": "Cundo Marchi, Mural Commissions",
      "description": "Commissioned murals, live painting and paint workshops, delivered worldwide.",
      "url": "https://www.cundomarchi.com/",
      "image": "https://www.cundomarchi.com/images/site/og_image.jpg",
      "email": "cundomarchi@gmail.com",
      "founder": {
        "@id": "https://www.cundomarchi.com/#person"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      },
      "priceRange": "$$-$$$",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mural Painting",
              "description": "Large-scale commissioned murals for home interiors, commercial spaces and exterior or public walls."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Live Painting",
              "description": "Full pieces painted live at galas, brand activations and public openings."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Paint Workshop",
              "description": "Community mural and individual canvas painting workshops for groups."
            }
          }
        ]
      }
    }
  ]
} as const;
