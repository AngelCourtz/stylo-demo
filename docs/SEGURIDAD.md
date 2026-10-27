# Seguridad — revisión de las 8 claves (27/10/2026)

**Contexto:** la web es estática (React + Vite). No tiene servidor propio, base de datos, cuentas,
contraseñas ni pagos. Los pedidos solo abren WhatsApp con un mensaje escrito; nada se envía a un servidor.
Por eso varios puntos "no aplican": no hay nada que proteger en esa parte. Si en el futuro se agrega
un panel, pagos en línea o cuentas de clientes, hay que volver a revisar los puntos 2, 3, 5 y 6.

| # | Punto | Estado | Qué se comprobó / qué se hizo |
|---|---|---|---|
| 1 | APIs y contraseñas | ✅ Correcto | Búsqueda en todo el código: sin claves, tokens ni contraseñas; sin archivo `.env`. Se agregó `.gitignore` para que `.env`, `node_modules` y `dist` nunca se suban a GitHub. El número de WhatsApp es público (ya está en stylofitness.com). |
| 2 | Spam y ataques | ✅ No aplica | No hay formularios que envíen datos a un servidor ni inicio de sesión: no hay nada que un bot pueda llenar ni contraseñas que adivinar. El "formulario" del pedido solo arma un mensaje que el propio cliente envía desde su WhatsApp. |
| 3 | Formularios | ✅ Corregido | Antes: nombre, distrito y búsqueda no tenían límite de largo. Ahora: límite en cada campo (nombre 60, distrito 40, sabor 40, búsqueda 60) y limpieza con `limpiarTexto()` en `src/lib/tienda.js`, que quita saltos de línea y caracteres invisibles o de control para que nadie pueda alterar el formato del mensaje de WhatsApp. La forma de pago solo acepta las 3 opciones. Todo el mensaje va codificado con `encodeURIComponent`. |
| 4 | Inyección de código (XSS, SQL) | ✅ Correcto + reforzado | No hay base de datos (no hay SQL). React escapa todo el texto que muestra; no se usa `dangerouslySetInnerHTML`, `innerHTML` ni `eval` (comprobado). Se reforzó el pedido guardado en el navegador: solo se aceptan líneas con formato válido, de productos existentes y cantidades enteras de 1 a 99 (`src/lib/usePedido.js`). Se agregó una **Política de Seguridad de Contenido (CSP)** que solo permite cargar recursos de la propia web, Google Fonts, Google Maps y las fotos de stylofitness.com (`vite.config.js`). |
| 5 | Contraseñas | ✅ No aplica | No hay cuentas ni contraseñas. |
| 6 | Sesiones y cookies | ✅ No aplica | La web no crea cookies ni sesiones. Solo guarda el pedido en el navegador del cliente (`localStorage`), sin datos personales: el nombre y el distrito no se guardan. Nota: el mapa de Google, al cargarse, puede poner sus propias cookies. |
| 7 | HTTPS | ⚠️ Depende del hosting | Todos los recursos usan `https://` (comprobado) y la CSP incluye `upgrade-insecure-requests`. Al publicar: en **GitHub Pages** marcar *Settings → Pages → Enforce HTTPS*; en **Netlify/Cloudflare** el certificado es automático y se agrega `Strict-Transport-Security`. Verificar el candado después de publicar. |
| 8 | Dependencias | ✅ Correcto | `npm audit`: **0 vulnerabilidades**. `npm outdated`: todo en la última versión. Versiones fijas en `package.json`. Nuevo comando: `npm run seguridad` (audit + outdated) para repetir la revisión antes de cada publicación. |

## Cabeceras de seguridad (se generan solas con `npm run build`)
- En el HTML (funciona en cualquier hosting, incluido GitHub Pages): `Content-Security-Policy` y `referrer`.
- En `dist/_headers` (lo usan Netlify y Cloudflare Pages): CSP + `frame-ancestors 'none'`, `X-Frame-Options: DENY`
  (nadie puede meter tu web dentro de otra para engañar), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `Permissions-Policy` (sin cámara, micrófono, ubicación ni pagos) y `Strict-Transport-Security`.
- GitHub Pages no permite cabeceras propias: ahí no aplican `frame-ancestors`, `X-Frame-Options` ni HSTS.
  Si eso importa, publicar en Netlify o Cloudflare Pages (también gratis).

## Pruebas ejecutadas
| Prueba | Resultado |
|---|---|
| Búsqueda de claves/tokens/contraseñas en el código | 0 encontrados |
| Búsqueda de `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `http://` | 0 encontrados |
| `npm audit` / `npm outdated` | 0 vulnerabilidades / todo al día |
| `limpiarTexto`: salto de línea, caracteres invisibles, texto de 100 letras | Limpiados y cortados correctamente |
| Sabor con `|` y salto de línea | Se guarda limpio y con formato válido |
| Pedido guardado manipulado (id inexistente, HTML, cantidad 500, negativa, texto) | Solo quedan las líneas válidas |
| Versión compilada con CSP: fuentes, fotos de productos y mapa | Cargan; 0 avisos de CSP en la consola |
| Catálogo (126 productos y precios) | Sin cambios |

## Antes de cada publicación
1. `npm run seguridad` → debe decir 0 vulnerabilidades.
2. `npm run build` y subir el contenido de `dist/`.
3. Abrir la web publicada y comprobar el candado (HTTPS) y que carguen fotos y mapa.
4. Opcional: revisar las cabeceras en https://securityheaders.com (en Netlify/Cloudflare debería dar A).
