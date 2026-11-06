// Escribe dentro de dist/ el HTML ya armado de cada página, más los archivos de SEO.
// Lo llama scripts/build.mjs después de compilar; no se usa por separado.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const PAGINAS = [
  { archivo: 'dist/index.html', pagina: 'web', ruta: '' },
  { archivo: 'dist/qr/index.html', pagina: 'qr', ruta: 'qr/', siempreNoIndex: true },
];

// Texto seguro dentro de un atributo HTML.
const attr = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// JSON dentro de <script type="application/ld+json">: "<" escapado para que no pueda cerrar la etiqueta.
const jsonSeguro = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

export async function prerenderizar() {
  const servidor = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);
  const { SITIO } = await import(pathToFileURL(resolve('src/data/sitio.js')).href);

  for (const p of PAGINAS) {
    let html = await readFile(p.archivo, 'utf8');
    const cuerpo = servidor.renderizar(p.pagina);
    if (!cuerpo || cuerpo.length < 500) throw new Error(`Prerender vacío en ${p.archivo}`);

    const url = SITIO.url + p.ruta;
    const indexar = SITIO.indexar && !p.siempreNoIndex;
    const seo = [
      `<link rel="canonical" href="${attr(url)}" />`,
      `<meta name="robots" content="${indexar ? 'index, follow' : 'noindex, follow'}" />`,
      `<meta property="og:url" content="${attr(url)}" />`,
      `<meta property="og:image" content="${attr(SITIO.url + SITIO.imagenSocial)}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      p.pagina === 'web' ? `<script type="application/ld+json">${jsonSeguro(servidor.datosEstructurados())}</script>` : '',
    ].filter(Boolean).join('\n    ');

    if (!html.includes('<div id="root"></div>')) throw new Error(`No encontré <div id="root"> en ${p.archivo}`);
    html = html
      .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`)
      .replace(/<meta name="robots"[^>]*>\s*/, '')
      .replace('</head>', `    ${seo}\n  </head>`);
    await writeFile(p.archivo, html);
    console.log(`prerender: ${p.archivo} (${Math.round(cuerpo.length / 1024)} KB de HTML)`);
  }

  // robots.txt y sitemap.xml (la página del QR no va al sitemap: es solo para quien escanea).
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO.url}sitemap.xml\n`);
  const hoy = new Date().toISOString().slice(0, 10);
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITIO.url}</loc><lastmod>${hoy}</lastmod></url>\n</urlset>\n`,
  );
  console.log(`prerender: robots.txt y sitemap.xml (indexar: ${SITIO.indexar})`);
}
