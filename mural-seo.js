(function () {
  var canonical = document.querySelector('link[rel="canonical"]');
  var image = document.querySelector('meta[property="og:image"]');
  var description = document.querySelector('meta[name="description"]');
  var title = document.querySelector('h1');
  if (!canonical || !image || !description || !title) return;
  var data = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: title.textContent.trim(),
    artform: 'Mural',
    inLanguage: document.documentElement.lang,
    description: description.content,
    image: image.content,
    url: canonical.href,
    creator: {
      '@type': 'Person',
      '@id': 'https://www.cundomarchi.com/#person',
      name: 'Cundo Marchi',
      url: 'https://www.cundomarchi.com/'
    }
  };
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}());
