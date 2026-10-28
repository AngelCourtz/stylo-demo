import { FOTOS_BASE, PRODUCTOS as CRUDOS } from '../data/catalogo.js';
import { NEGOCIO } from '../data/negocio.js';

export const PRODUCTOS = CRUDOS.map((p) => ({
  ...p,
  pct: p.antes > p.precio ? Math.round(((p.antes - p.precio) / p.antes) * 100) : 0,
}));

export const sol = (n) => `S/ ${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const fotoDe = (p) => (p.foto ? FOTOS_BASE + p.foto : '');

// WordPress guarda la foto original y miniaturas con sufijo "-300x300". La original se ve nítida;
// si no existe, el componente cae a la miniatura.
export const fotoGrande = (p) => (p.foto ? FOTOS_BASE + p.foto.replace(/-\d+x\d+(?=\.\w+$)/, '') : '');

// Quita tildes y mayúsculas para que "proteina" encuentre "Proteína".
export const normalizar = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Límites de los campos que escribe el cliente.
export const LIMITES = { nombre: 60, distrito: 40, sabor: 40, busqueda: 60 };

// Rangos de caracteres invisibles o de control (saltos de línea, tabulaciones, marcas de dirección del texto).
// Se arman con números para que ningún editor los convierta en caracteres reales.
const RANGOS_INVISIBLES = [[0x00, 0x1f], [0x7f, 0x9f], [0x200b, 0x200f], [0x2028, 0x202e], [0x2066, 0x2069], [0xfeff, 0xfeff]];
const cod = (n) => '\\u' + n.toString(16).padStart(4, '0');
const INVISIBLES = new RegExp('[' + RANGOS_INVISIBLES.map(([a, b]) => cod(a) + '-' + cod(b)).join('') + ']', 'g');

// Limpia lo que escribe el cliente antes de usarlo: quita caracteres invisibles o de control,
// junta espacios y corta al largo máximo.
export const limpiarTexto = (texto, max) =>
  String(texto ?? '')
    .replace(INVISIBLES, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export const linkWhatsApp = (texto) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;

export const abrirWhatsApp = (texto) => window.open(linkWhatsApp(texto), '_blank', 'noopener');

// En el pedido cada línea se guarda como "id" o "id|sabor".
export const claveLinea = (id, sabor) => {
  const s = limpiarTexto(String(sabor ?? '').replace(/\|/g, ' '), LIMITES.sabor);
  return s ? `${id}|${s}` : String(id);
};
// Formato válido de una línea guardada: id numérico y, opcional, "|sabor" sin otro "|".
export const CLAVE_VALIDA = /^\d{1,6}(\|[^|]{1,40})?$/;
export const MAX_POR_PRODUCTO = 99;
export const productoDe = (clave) => PRODUCTOS.find((p) => p.id === Number(String(clave).split('|')[0]));
export const saborDe = (clave) => String(clave).split('|')[1] || '';
export const nombreLinea = (clave) => {
  const p = productoDe(clave);
  const s = saborDe(clave);
  return p ? p.nombre + (s ? ` (sabor ${s})` : '') : '';
};
