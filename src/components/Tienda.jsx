import { useMemo, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIAS, OBJETIVOS, OFERTA_MINIMA } from '../data/negocio.js';
import { PRODUCTOS, normalizar } from '../lib/tienda.js';
import ProductCard from './ProductCard.jsx';

const POR_PAGINA = 12;

const ordenar = (lista, orden) => {
  const l = [...lista];
  if (orden === 'menor') l.sort((a, b) => a.precio - b.precio);
  if (orden === 'mayor') l.sort((a, b) => b.precio - a.precio);
  if (orden === 'descuento') l.sort((a, b) => b.pct - a.pct || b.antes - b.precio - (a.antes - a.precio));
  return l;
};

export default function Tienda({ filtros, setFiltros, onVer, onAgregar }) {
  const { q, cat, objetivo, orden } = filtros;
  const [visibles, setVisibles] = useState(POR_PAGINA);

  // al cambiar cualquier filtro se vuelve a mostrar la primera página
  useEffect(() => setVisibles(POR_PAGINA), [q, cat, objetivo, orden]);

  const obj = OBJETIVOS.find((o) => o.id === objetivo);

  const lista = useMemo(() => {
    const t = normalizar(q.trim());
    const filtrados = PRODUCTOS.filter((p) => {
      const enCategoria = obj ? obj.cats.includes(p.cat) : cat === 'todos' || p.cat === cat;
      return enCategoria && (!t || normalizar(`${p.nombre} ${CATEGORIAS[p.cat]}`).includes(t));
    });
    return ordenar(filtrados, orden);
  }, [q, cat, obj, orden]);

  const ofertas = useMemo(() => ordenar(PRODUCTOS.filter((p) => p.pct >= OFERTA_MINIMA), 'descuento').slice(0, 10), []);

  const cuenta = (k) => PRODUCTOS.filter((p) => p.cat === k).length;
  const categorias = [['todos', 'Todos los productos', PRODUCTOS.length], ...Object.entries(CATEGORIAS).map(([k, n]) => [k, n, cuenta(k)])];
  const mostrados = lista.slice(0, visibles);
  const resta = lista.length - mostrados.length;

  return (
    <section className="tienda" id="tienda" aria-labelledby="tienda-titulo">
      <div className="envoltura">
        <div className="ofertas">
          <div className="cab-seccion">
            <div>
              <h2 className="titulo">Los descuentos más grandes</h2>
              <p className="bajada">Todo tiene descuento, pero en estos ahorras {OFERTA_MINIMA}% o más.</p>
            </div>
            <button
              type="button"
              className="enlace"
              onClick={() => {
                setFiltros({ q: '', cat: 'todos', objetivo: null, orden: 'descuento' });
                document.getElementById('tienda-titulo').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver todos ordenados por descuento
            </button>
          </div>
          <div className="carril">
            {ofertas.map((p) => <ProductCard key={p.id} producto={p} onVer={onVer} onAgregar={onAgregar} />)}
          </div>
        </div>

        <h2 className="titulo" id="tienda-titulo">Suplementos</h2>
        {/* Cada disco es un objetivo: más peso, objetivo más exigente */}
        <div className="objetivos" role="group" aria-label="Filtrar por objetivo">
          <span className="objetivos-tit">¿Cuál es tu objetivo?</span>
          {OBJETIVOS.map((o) => (
            <button
              key={o.id}
              type="button"
              className="objetivo"
              aria-pressed={objetivo === o.id}
              onClick={() => setFiltros({ objetivo: objetivo === o.id ? null : o.id, cat: 'todos', q: '' })}
            >
              <span className="disco-mini" aria-hidden="true">{o.kg}</span>
              {o.nombre}
            </button>
          ))}
        </div>
        <div className="tienda-cols">
          <ul className="cats" aria-label="Categorías">
            {categorias.map(([k, n, c]) => (
              <li key={k}>
                <button type="button" aria-pressed={!obj && cat === k} onClick={() => setFiltros({ cat: k, objetivo: null })}>
                  {n}<span>{c}</span>
                </button>
              </li>
            ))}
          </ul>

          <div>
            <div className="buscador">
              <Search size={18} aria-hidden="true" />
              <label className="sr" htmlFor="buscar-tienda">Buscar productos</label>
              <input
                id="buscar-tienda"
                type="search"
                placeholder="Busca proteína, creatina, marca…"
                autoComplete="off"
                maxLength={60}
                value={q}
                onChange={(e) => setFiltros({ q: e.target.value, ...(e.target.value ? { cat: 'todos', objetivo: null } : {}) })}
              />
            </div>
            <div className="barra-res">
              <p className="cuenta" aria-live="polite">
                {lista.length > 0 && <>Mostrando <b>{mostrados.length}</b> de <b>{lista.length}</b> productos</>}
              </p>
              {obj && (
                <button type="button" className="chip-filtro" onClick={() => setFiltros({ objetivo: null })}>
                  Objetivo: {obj.nombre} <X size={15} aria-hidden="true" /><span className="sr">Quitar objetivo</span>
                </button>
              )}
              <label className="sr" htmlFor="orden">Ordenar por</label>
              <select id="orden" className="orden" value={orden} onChange={(e) => setFiltros({ orden: e.target.value })}>
                <option value="recientes">Más recientes</option>
                <option value="menor">Precio: menor a mayor</option>
                <option value="mayor">Precio: mayor a menor</option>
                <option value="descuento">Mayor descuento</option>
              </select>
            </div>

            <div className="grilla">
              {mostrados.length ? (
                mostrados.map((p) => <ProductCard key={p.id} producto={p} onVer={onVer} onAgregar={onAgregar} />)
              ) : (
                <p className="vacio">
                  <b>No encontramos “{q}”.</b><br />Revisa cómo está escrito o pregúntanos por WhatsApp si lo tenemos en tienda.
                </p>
              )}
            </div>
            {resta > 0 && (
              <div className="mas">
                <button type="button" className="boton borde" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                  Ver {Math.min(resta, POR_PAGINA)} productos más
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
