// Inventario del catálogo: guarda una foto de los datos comerciales y compara con otra.
// Uso:
//   node scripts/inventario.mjs guardar docs/inventario-antes.json
//   node scripts/inventario.mjs comparar docs/inventario-antes.json
import { readFileSync, writeFileSync } from 'node:fs';
import { PRODUCTOS } from '../src/data/catalogo.js';
import { DESCRIPCIONES } from '../src/data/descripciones.js';

const [accion, archivo] = process.argv.slice(2);
const actual = PRODUCTOS.map(({ id, nombre, precio, antes, cat, foto }) => ({ id, nombre, precio, antes, cat, foto }));

if (accion === 'guardar') {
  writeFileSync(archivo, JSON.stringify(actual, null, 1));
  console.log(`Guardado: ${actual.length} productos en ${archivo}`);
} else if (accion === 'comparar') {
  const base = JSON.parse(readFileSync(archivo, 'utf8'));
  const porId = new Map(actual.map((p) => [p.id, p]));
  const diferencias = [];
  for (const b of base) {
    const a = porId.get(b.id);
    if (!a) { diferencias.push(`Falta el producto ${b.id} (${b.nombre})`); continue; }
    for (const campo of ['nombre', 'precio', 'antes', 'cat', 'foto']) {
      if (a[campo] !== b[campo]) diferencias.push(`${b.id}: ${campo} cambió de ${JSON.stringify(b[campo])} a ${JSON.stringify(a[campo])}`);
    }
  }
  const nuevos = actual.filter((a) => !base.some((b) => b.id === a.id));
  nuevos.forEach((n) => diferencias.push(`Producto nuevo: ${n.id} (${n.nombre})`));
  console.log(`Antes: ${base.length} productos. Ahora: ${actual.length}.`);
  console.log(`Suma de precios antes: S/ ${base.reduce((s, p) => s + p.precio, 0)}. Ahora: S/ ${actual.reduce((s, p) => s + p.precio, 0)}.`);
  console.log(diferencias.length ? `DIFERENCIAS (${diferencias.length}):\n` + diferencias.join('\n') : 'Sin diferencias: ids, nombres, precios, precios normales, categorías y fotos iguales.');
  process.exitCode = diferencias.length ? 1 : 0;
} else if (accion === 'anomalias') {
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]+/g, ' ').trim();
  const grupos = {};
  actual.forEach((p) => { (grupos[norm(p.nombre)] ||= []).push(p); });
  const repetidos = Object.values(grupos).filter((g) => g.length > 1);
  console.log('Nombres repetidos:', repetidos.map((g) => g.map((p) => `${p.id} "${p.nombre}" S/${p.precio}`).join(' | ')));
  console.log('Precio normal <= precio:', actual.filter((p) => !(p.antes > p.precio)).map((p) => p.id));
  console.log('Sin foto:', actual.filter((p) => !p.foto).map((p) => p.id));
  console.log('Sin descripción:', actual.filter((p) => !DESCRIPCIONES[p.id]).map((p) => p.id));
  console.log('Ids repetidos:', actual.length - new Set(actual.map((p) => p.id)).size);
} else {
  console.log('Acción no válida. Usa: guardar | comparar | anomalias');
}
