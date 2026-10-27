# Stylo Fitness 2.1 — Demo

Propuesta de nueva web para Stylo Fitness (gimnasio + tienda de suplementos en Comas, Lima), hecha en React + Vite.
Demo no oficial para presentar al dueño. No está conectada a ningún sistema del gimnasio y no cobra nada.

## Instalar y ejecutar

Necesitas Node.js 20.19 o más nuevo (se probó con Node 24).

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).
Para verla en un celular de la misma red: `npm run dev -- --host` y abre la dirección "Network".

## Compilar para publicar

```bash
npm run build
```

Sube el contenido de `dist/` a GitHub Pages, Netlify o Cloudflare Pages. Las rutas son relativas,
así que funciona también dentro de una subcarpeta (por ejemplo `usuario.github.io/stylo-demo/`).

## Comprobar que el catálogo no cambió

```bash
node scripts/inventario.mjs comparar docs/inventario-antes.json
```

## Dónde se cambian los datos

| Qué | Archivo |
|---|---|
| WhatsApp, dirección, horario, membresías y precios | `src/data/negocio.js` |
| Productos y precios | `src/data/catalogo.js` |
| Descripciones de productos | `src/data/descripciones.js` |

Lo que está en `null` se muestra como "por confirmar".

## Documentos

- `docs/INFORME.md`: auditoría, cambios, pruebas ejecutadas y pendientes.
- `docs/DIRECCION-CREATIVA.md`: concepto, sistema visual y arquitectura.
- `docs/INVENTARIO-PRODUCTOS.md`: los 126 productos con sus precios.
- `docs/respaldo-catalogo/`: copia de los datos antes del rediseño.
