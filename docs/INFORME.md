# Stylo Fitness 2.1 — Informe de entrega

Demo independiente. No se tocó la web oficial, ni dominios, ni hosting, ni se enviaron mensajes reales.
El proyecto anterior (`stylofitness-2.0`) quedó sin modificar; este es una copia de trabajo.

## 1. Auditoría (estado de la 2.0)
- React 19 + Vite 8, sin backend. Datos comerciales en `src/data/catalogo.js` (126 productos),
  `src/data/descripciones.js` y `src/data/negocio.js`. Respaldo en `docs/respaldo-catalogo/`.
- Funcionaba: catálogo, buscador, categorías, orden, ficha, pedido guardado en el navegador y mensaje de WhatsApp.
- Problemas encontrados y corregidos:
  1. La portada usaba una foto de stock de un gimnasio que podía pasar por el local de Stylo → se quitó.
  2. Botones naranjas con texto blanco: contraste 3:1, insuficiente para texto normal → texto negro (6.6:1).
  3. Al agregar un producto no había confirmación general → aviso "agregado a tu pedido" con botón "Ver pedido", anunciado a lectores de pantalla.
  4. Con el pedido abierto se podía tabular por la página de atrás → la página queda inactiva (`inert`) mientras el pedido está abierto.
  5. El gimnasio tenía menos peso que la tienda → franja "Entrena / Recarga" justo después de la portada y botón de consulta en la sección del gimnasio.
  6. Faltaba explicar el flujo → nueva sección "Cómo pedir" (3 pasos reales).
  7. El precio normal solo se veía tachado → ahora dice "Antes S/ X".

## 2. Dirección creativa
Ver `docs/DIRECCION-CREATIVA.md` (concepto "Carga real", paleta, tipografía, componentes y arquitectura).

## 3. Archivos
- Cambiados: `src/App.jsx`, `src/styles.css` (reescrito), `src/components/Secciones.jsx` (reescrito),
  `src/components/Header.jsx`, `src/components/ProductCard.jsx`, `src/components/ProductModal.jsx`, `README.md`.
- Nuevos: `scripts/inventario.mjs`, `docs/` (este informe, dirección creativa, inventarios y respaldo).
- Sin cambios: `src/data/*` (catálogo, descripciones y negocio), `src/lib/*`, `CartDrawer.jsx`, `Tienda.jsx`.

## 4. Inventario de productos
`node scripts/inventario.mjs comparar docs/inventario-antes.json`:
126 productos antes y después, **sin diferencias** en id, nombre, precio, precio normal, categoría ni foto.
Suma de precios S/ 18,509 antes y después. Tabla completa en `docs/INVENTARIO-PRODUCTOS.md`.
Además se comprobó en el navegador que los 126 precios y precios normales mostrados coinciden con el inventario.

### Anomalías de datos (reportadas, no corregidas)
- Posibles duplicados: 1452 "Whey Pro 1.1 kg" y 1319 "Whey Pro UN 1.1 kg" (S/ 79 ambos);
  1344 "Colágeno Pro UN 500 g" y 1081 "Collagen Pro UN 500 g" (S/ 80 ambos);
  1394 "One Prenox 500 g" (S/ 80) y 1045 "One Prenox INN 500 g" (S/ 82).
- Los 126 productos tienen precio normal mayor al de venta: viene así de stylofitness.com, no se pudo verificar.
- Los nombres se escribieron de forma uniforme a partir de stylofitness.com (ej. "CREATINA UN 1KG – UN" → "Creatina UN 1 kg").
  En la web original 22 productos no tenían categoría; se les asignó una por su nombre.
- Las fotos se cargan desde stylofitness.com (no están en el proyecto).

## 5. Pruebas ejecutadas (27/10/2026)
| Prueba | Resultado |
|---|---|
| `npm ci` y `npm run build` | OK, sin errores |
| Comparación de inventario (script) | OK, 0 diferencias |
| 126 tarjetas en pantalla vs inventario (precio y precio normal) | OK, 0 diferencias |
| Contador de cada categoría = productos mostrados (11 casos) | OK |
| Orden menor→mayor, mayor→menor y por descuento | OK |
| Buscador sin tildes ("proteina") y estado vacío | OK |
| Objetivo desde la portada (Definir) filtra y se puede quitar | OK |
| Agregar desde tarjeta y desde ficha (sabor + cantidad) | OK, aviso visible |
| Sumar, restar y quitar en el pedido; total y ahorro | OK (1×120 + 3×359 = 1197; ahorro 120) |
| Pedido se conserva al recargar | OK |
| Pedido vacío: mensaje y botón de envío deshabilitado | OK |
| Mensaje de WhatsApp codificado (con "100%", "ñ" y "&") | OK |
| Cerrar ficha con X, clic afuera y Esc; cerrar pedido con Esc | OK |
| Página de atrás inactiva con el pedido abierto | OK |
| Sin desplazamiento horizontal en 360, 390, 768 y 1440 px | OK |
| Revisión visual en 360, 390, 768 y 1440 px | OK |
| Controles sin nombre accesible | 0 |
| Errores de consola y recursos fallidos | 0 |

No probado: lectores de pantalla reales (NVDA/VoiceOver), Safari/iPhone real, y envío real por WhatsApp
(no se envió ningún mensaje). No hay pruebas automáticas en el proyecto.

## 6. Pendiente de confirmar con el dueño antes de publicar
Horario · servicios y clases · nombres, precios y beneficios de membresías · fotos del local ·
vigencia de precios de productos · envíos en Lima · pago con tarjeta · permiso para usar y copiar las fotos de productos ·
qué hacer con los posibles duplicados.
