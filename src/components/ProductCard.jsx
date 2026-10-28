import { useState } from 'react';
import { CATEGORIAS, OFERTA_MINIMA } from '../data/negocio.js';
import { abrirWhatsApp, sol } from '../lib/tienda.js';
import IconoWhatsApp from './IconoWhatsApp.jsx';
import FotoProducto from './FotoProducto.jsx';

export default function ProductCard({ producto: p, onVer, onAgregar }) {
  const [agregado, setAgregado] = useState(false);

  const agregar = () => {
    onAgregar(String(p.id));
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };
  const ver = (e) => {
    e.preventDefault();
    onVer(p.id);
  };

  return (
    <article className="prod">
      <a className="prod-foto" href={`#producto-${p.id}`} onClick={ver} tabIndex={-1} aria-hidden="true">
        <FotoProducto producto={p} />
      </a>
      {p.pct >= OFERTA_MINIMA && <span className="prod-pct">−{p.pct}%</span>}
      <div className="prod-info">
        <span className="prod-cat">{CATEGORIAS[p.cat]}</span>
        <h3>
          <a href={`#producto-${p.id}`} onClick={ver}>{p.nombre}</a>
        </h3>
        <div className="precios">
          <strong>{sol(p.precio)}</strong>
          {p.antes > p.precio && <span className="antes">Antes <s>{sol(p.antes)}</s></span>}
        </div>
        <div className="prod-acc">
          <button type="button" className={agregado ? 'agregar ok' : 'agregar'} onClick={agregar}>
            {agregado ? 'Agregado ✓' : 'Agregar al pedido'}
          </button>
          <button
            type="button"
            className="prod-wa"
            title="Preguntar por WhatsApp"
            aria-label={`Preguntar por ${p.nombre} en WhatsApp`}
            onClick={() => abrirWhatsApp(`Hola, quiero consultar por este producto:\n• ${p.nombre} — ${sol(p.precio)}\n\n¿Tienen stock?`, 'whatsapp-producto-tarjeta')}
          >
            <IconoWhatsApp size={21} />
          </button>
        </div>
      </div>
    </article>
  );
}
