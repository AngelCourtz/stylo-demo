# Rendimiento, prerenderizado y SEO (06/11/2026)

## Decisión: Vite + prerender propio (no migrar a Next.js ni Astro)
- Es una sola página con dos vistas (web y QR), publicada en GitHub Pages (solo archivos estáticos).
- Todo el estado vive en el navegador: pedido, filtros, ficha. No hay servidor ni datos que cambien por visitante.
- Next.js o Astro obligarían a reescribir la app para obtener lo mismo que da `renderToString` de React.
- Resultado: cero dependencias nuevas, mismo hosting, mismo código de componentes.

## Cómo funciona
`npm run build` ejecuta `scripts/build.mjs`:
1. Compila la web normal en `dist/`.
2. Compila `src/entry-server.jsx` para Node en `dist-ssr/`.
3. `scripts/prerender.mjs` escribe el HTML ya armado dentro de `dist/index.html` y `dist/qr/index.html`,
   agrega canonical, robots, Open Graph y los datos estructurados, y genera `robots.txt` y `sitemap.xml`.
4. En el navegador, `main.jsx` y `qr.jsx` usan `hydrateRoot`: React activa ese HTML sin volver a dibujarlo.

Reglas para que el HTML y el primer dibujo coincidan (si no, React muestra errores de "hydration"):
- La hora: el primer dibujo usa la hora de compilación (`HORA_COMPILACION` en `src/lib/tiempo.js`) y enseguida
  pasa a la hora real. Afecta "Abierto ahora", promos vigentes y cuentas regresivas.
- Todo lo que lee `localStorage`, `sessionStorage` o `window.location` se lee en un `useEffect`, nunca al crear
  el estado (ver `usePedido.js` y `App.jsx`).

## Cambios de rendimiento
| Qué | Antes | Ahora |
|---|---|---|
| HTML inicial | contenedor vacío | 89 KB con portada, promos, sedes, equipo, tienda y preguntas |
| JavaScript propio al cargar | 147 KB | 39 KB (la ficha y sus descripciones se descargan al abrir un producto) |
| Logo | 207 KB (1774 px) | 60 KB (900 px) |
| Fotos del local en celular | 310–340 KB c/u | 37–105 KB (versiones `-640.webp` con `srcset`) |
| Intro de 2.5 s en cada visita | siempre | solo con `?intro` en la dirección (para presentarla al dueño) |

## SEO
- `src/data/sitio.js`: dirección pública e `indexar`. **Mientras sea demo, `indexar: false`** (meta `noindex`),
  para que Google no muestre esta copia en lugar de stylofitness.com. Al publicarla como web oficial:
  cambiar `url` al dominio final e `indexar: true`.
- Datos estructurados `ExerciseGym` generados desde `negocio.js` (dirección, teléfono, horario, redes).
  No se marcan productos con precio porque los precios aún no están confirmados por el negocio.
- Imagen para compartir en WhatsApp/Facebook: `public/img/og-stylo.jpg` (1200×630).
- La página del QR siempre es `noindex` y no va al sitemap.

## Contenido de confianza
- Testimonios: ninguno inventado. `TESTIMONIOS` en `negocio.js` está vacío hasta tener reseñas reales;
  mientras tanto la sección es una invitación a calificar en Google.
- Preguntas frecuentes: solo respuestas que salen de `negocio.js` y del funcionamiento real de la web.

## Comprobado
- HTML sin JavaScript contiene portada, promos, sedes, equipo, productos y preguntas.
- Sin errores en consola al activar la página (sin diferencias de hydration).
- Pedido: agregar, cambiar cantidades, total, se conserva al recargar, mensaje de WhatsApp con varias líneas.
- Enlace directo a un producto (`#producto-1606`) abre la ficha.
- `npm run dev` sigue funcionando. Catálogo: 126 productos sin cambios (S/ 18,509). `npm audit`: 0 vulnerabilidades.
