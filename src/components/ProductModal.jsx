import { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CATEGORIAS, CON_SABOR } from '../data/negocio.js';
import { DESCRIPCIONES } from '../data/descripciones.js';
import { PRODUCTOS, abrirWhatsApp, claveLinea, nombreLinea, sol } from '../lib/tienda.js';
import FotoProducto from './FotoProducto.jsx';
import IconoWhatsApp from './IconoWhatsApp.jsx';
import ProductCard from './ProductCard.jsx';

// Convierte el texto de la tienda vieja en párrafos, subtítulos y listas.
function Descripcion({ texto }) {
  const bloques = [];
  let lista = [];
  const cerrarLista = () => {
    if (lista.length) bloques.push(<ul key={`ul${bloques.length}`}>{lista}</ul>);
    lista = [];
  };
  texto.split('\n').forEach((l, i) => {
    if (l.startsWith('• ')) {
      lista.push(<li key={i}>{l.slice(2)}</li>);
      return;
    }
    cerrarLista();
    const mayus = l === l.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3}/.test(l);
    if (l.length < 60 && (l.endsWith(':') || l.endsWith('?') || mayus)) {
      const s = l.replace(/:$/, '');
      bloques.push(<h4 key={i}>{mayus ? s.toLowerCase().replace(/^([¿¡]?)(.)/, (m, a, b) => a + b.toUpperCase()) : s}</h4>);
    } else bloques.push(<p key={i}>{l}</p>);
  });
  cerrarLista();
  return bloques;
}

export default function ProductModal({ id, onCerrar, onVer, onAgregar }) {
  const ref = useRef(null);
  const p = PRODUCTOS.find((x) => x.id === id);
  const [cantidad, setCantidad] = useState(1);
  const [sabor, setSabor] = useState('');
  const [completa, setCompleta] = useState(false);
  const [agregado, setAgregado] = useState(false);

  // al cambiar de producto se reinicia la ficha y vuelve arriba
  useEffect(() => {
    setCantidad(1);
    setSabor('');
    setCompleta(false);
    const d = ref.current;
    if (!p || !d) return;
    if (!d.open) d.showModal();
    d.scrollTop = 0;
  }, [id, p]);

  const relacionados = useMemo(
    () => (p ? PRODUCTOS.filter((x) => x.cat === p.cat && x.id !== p.id).sort((a, b) => Math.abs(a.precio - p.precio) - Math.abs(b.precio - p.precio)).slice(0, 4) : []),
    [p],
  );

  if (!p) return null;
  const texto = DESCRIPCIONES[p.id] || '';
  const conSabor = CON_SABOR.includes(p.cat);
  const larga = texto.length > 420;
  const clave = () => claveLinea(p.id, conSabor ? sabor : ''); // claveLinea limpia el texto del sabor

  const agregar = () => {
    onAgregar(clave(), cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };

  return (
    <dialog
      ref={ref}
      className="ficha"
      aria-labelledby="ficha-nombre"
      // Esc: se cierra desde React (no se espera el evento "close" del navegador)
      onCancel={(e) => { e.preventDefault(); onCerrar(); }}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <button type="button" className="icono-boton ficha-x" aria-label="Cerrar" onClick={onCerrar}>
        <X size={20} />
      </button>
      <div className="ficha-grid">
        <div className="ficha-foto">
          <FotoProducto key={p.id} producto={p} alt={p.nombre} lazy={false} />
        </div>
        <div className="ficha-info">
          <span className="prod-cat">{CATEGORIAS[p.cat]}</span>
          <h2 id="ficha-nombre">{p.nombre}</h2>
          <div className="precios grande">
            <strong>{sol(p.precio)}</strong>
            {p.antes > p.precio && <span className="antes">Antes <s>{sol(p.antes)}</s></span>}
          </div>
          {p.antes > p.precio && <span className="ahorro">Ahorras {sol(p.antes - p.precio)} ({p.pct}%)</span>}

          {conSabor && (
            <>
              <label className="campo">
                <span>Sabor que prefieres <em>(opcional)</em></span>
                <input value={sabor} onChange={(e) => setSabor(e.target.value)} placeholder="Ej. chocolate, vainilla, frutas" maxLength={40} autoComplete="off" />
              </label>
              <p className="nota">Te confirmamos por WhatsApp los sabores disponibles.</p>
            </>
          )}

          <div className="ficha-acc">
            <div className="cantidad">
              <button type="button" aria-label="Uno menos" onClick={() => setCantidad((c) => Math.max(1, c - 1))}><Minus size={16} /></button>
              <output aria-label="Cantidad">{cantidad}</output>
              <button type="button" aria-label="Uno más" onClick={() => setCantidad((c) => Math.min(99, c + 1))}><Plus size={16} /></button>
            </div>
            <button type="button" className={agregado ? 'boton ok' : 'boton'} onClick={agregar}>
              {agregado ? 'Agregado ✓' : 'Agregar al pedido'}
            </button>
          </div>
          <button
            type="button"
            className="boton wa-borde"
            onClick={() => abrirWhatsApp(`Hola, quiero consultar por este producto:\n• ${cantidad} × ${nombreLinea(clave())} — ${sol(p.precio * cantidad)}\n\n¿Tienen stock?`, 'whatsapp-producto-ficha')}
          >
            <IconoWhatsApp /> Preguntar por WhatsApp
          </button>

          <div className={larga && !completa ? 'descripcion corta' : 'descripcion'}>
            {texto ? <Descripcion texto={texto} /> : <p>Escríbenos por WhatsApp y te contamos para qué sirve y cómo tomarlo.</p>}
          </div>
          {larga && !completa && (
            <button type="button" className="enlace" onClick={() => setCompleta(true)}>Leer todo</button>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="ficha-rel">
          <h3>Del mismo tipo</h3>
          <div className="grilla cuatro">
            {relacionados.map((r) => <ProductCard key={r.id} producto={r} onVer={onVer} onAgregar={onAgregar} />)}
          </div>
        </div>
      )}
    </dialog>
  );
}
