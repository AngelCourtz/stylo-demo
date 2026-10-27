import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Política de seguridad de contenido (CSP): la página solo puede cargar recursos de estos orígenes.
// Si agregas un servicio nuevo (otra fuente de fotos, analítica, etc.), añádelo aquí.
const CSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", 'https://fonts.googleapis.com'],
  'font-src': ['https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https://stylofitness.com'], // fotos de productos
  'frame-src': ['https://www.google.com', 'https://maps.google.com'], // mapa
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
};
const cspTexto = (extra = {}) =>
  Object.entries({ ...CSP, ...extra })
    .map(([k, v]) => [k, ...v].join(' '))
    .join('; ');

// Cabeceras para hostings que las permiten (Netlify y Cloudflare Pages leen el archivo _headers).
// GitHub Pages no permite cabeceras: ahí queda la CSP dentro del HTML.
const CABECERAS = {
  'Content-Security-Policy': cspTexto({ 'frame-ancestors': ["'none'"] }),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000',
};

// Solo al compilar (en desarrollo Vite necesita cargar estilos y recargar en vivo).
function seguridad() {
  return {
    name: 'stylo-seguridad',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${cspTexto()}" />`);
    },
    generateBundle() {
      const lineas = Object.entries(CABECERAS).map(([k, v]) => `  ${k}: ${v}`).join('\n');
      this.emitFile({ type: 'asset', fileName: '_headers', source: `/*\n${lineas}\n` });
    },
  };
}

export default defineConfig({
  plugins: [react(), seguridad()],
  // Rutas relativas: la web funciona igual en GitHub Pages (usuario.github.io/repositorio/),
  // Netlify o abierta desde una subcarpeta.
  base: './',
});
