# Stylo Fitness 2.1 — Dirección creativa

## Concepto: "Carga real"
Stylo no vende atajos: vende hierro y lo que te ayuda a levantarlo. Toda la identidad sale del
lenguaje de la sala de pesas: la barra, los discos con su peso marcado, el acero, la tiza.
El elemento memorable es **la barra cargada**: en la portada cada disco es un objetivo
(Energía 10, Definir 15, Más fuerza 20, Ganar masa 25) y lleva directo a los suplementos que sirven
para eso. Los discos pesados van al centro, como en una barra real.

## Por qué no es una plantilla
- No hay foto de stock de "gimnasio cualquiera": hasta tener fotos del local, la portada es
  tipografía + la barra dibujada. Nada sugiere instalaciones que no están confirmadas.
- Gimnasio y tienda tienen el mismo peso: justo después de la portada hay una franja partida
  en dos ("Entrena" / "Recarga") con la misma altura y tamaño de botón.
- Los números (precios, kilos, pasos del pedido) usan la misma tipografía condensada que los discos.
- El naranja se usa solo para acciones y para marcar descuentos de verdad (25% o más).

## Sistema visual
| Token | Valor | Uso |
|---|---|---|
| Negro | #0F1012 | Portada, membresías, pie |
| Grafito | #1A1C20 | Superficies sobre negro |
| Metal | #2B2F36 | Bordes y discos |
| Gris acero | #8C929B | Texto secundario sobre oscuro |
| Blanco cálido | #F3F1EC | Texto sobre oscuro |
| Fondo claro | #ECEEF0 | Tienda y secciones claras |
| Naranja Stylo | #F2701D | Acciones principales, descuentos |
| Naranja oscuro | #A9470A | Texto naranja sobre fondo claro (contraste AA) |

- **Tipografía:** Barlow Condensed 800–900 en mayúsculas para titulares, precios y discos;
  DM Sans 400–700 para todo lo demás. Escala: 0.85 / 1 / 1.125 / 1.5 / 2.25 / 3.5 / 5.5 rem.
- **Espaciado:** múltiplos de 4 px; secciones 56–112 px según ancho.
- **Radios:** 6 px botones y campos, 10 px tarjetas, 16 px ventanas. Nada redondeado por decorar.
- **Botones:** principal naranja con texto negro (contraste 6.6:1); secundario con borde;
  WhatsApp verde. Hover más oscuro, foco con contorno de 3 px, deshabilitado al 45%.
- **Íconos:** Lucide, trazo 2 px, siempre acompañando texto salvo en botones con etiqueta accesible.
- **Tarjetas de producto:** foto cuadrada sobre gris claro (las fotos de WhatsApp se funden con
  `mix-blend-mode: multiply`), categoría, nombre, precio grande y "Antes S/ X" tachado.
  La etiqueta −% solo aparece desde 25% de descuento.
- **Movimiento:** un solo momento coreografiado (los discos se cargan en la barra al abrir la
  página). Todo lo demás responde a una acción del usuario. Se desactiva con "reducir movimiento".

## Arquitectura
1. Franja "Propuesta de nueva web"
2. Cabecera: Gimnasio · Membresías · Suplementos · Cómo pedir · Ubicación · Mi pedido
3. Portada: mensaje, valor, dos acciones (Conocer el gimnasio / Comprar suplementos) y la barra
4. Dos caminos: Entrena / Recarga
5. Gimnasio (claro) y Membresías (oscuro)
6. Tienda (claro): descuentos más grandes, buscador, categorías, orden, catálogo, ficha
7. Cómo pedir (oscuro): 3 pasos reales del flujo de WhatsApp
8. Ubicación (claro) y pie

## Pendiente de confirmar con el dueño
Horario, servicios y clases, membresías (nombres, precios, beneficios), fotos del local,
vigencia de precios, envíos en Lima, pago con tarjeta y permiso para usar las fotos de productos.
