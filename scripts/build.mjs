// npm run build: compila la web y la prerenderiza.
// 1. Compilación normal (dist/): JavaScript, CSS e imágenes para el navegador.
// 2. Compilación de prerender (dist-ssr/): la misma app, para ejecutarla en Node.
// 3. scripts/prerender.mjs escribe el HTML armado dentro de dist/ y borra dist-ssr/.
// Las dos compilaciones usan la misma hora (ver vite.config.js), así el HTML coincide con el primer dibujo.
import { build } from 'vite';
import { rm } from 'node:fs/promises';

process.env.STYLO_HORA_COMPILACION = String(Date.now());

await build();
await build({ build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', emptyOutDir: true } });
const { prerenderizar } = await import('./prerender.mjs');
await prerenderizar();
await rm('dist-ssr', { recursive: true, force: true });
