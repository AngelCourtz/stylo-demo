import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { LIMITES, abrirWhatsApp, fotoDe, limpiarTexto, nombreLinea, saborDe, sol } from '../lib/tienda.js';
import IconoWhatsApp from './IconoWhatsApp.jsx';

const METODOS = ['Yape o Plin', 'Efectivo', 'Tarjeta'];

export default function CartDrawer({ abierto, onCerrar, pedido }) {
  const cerrarRef = useRef(null);
  const [nombre, setNombre] = useState('');
  const [entrega, setEntrega] = useState('recojo');
  const [distrito, setDistrito] = useState('');
  const [metodo, setMetodo] = useState(METODOS[0]);

  useEffect(() => {
    if (!abierto) return undefined;
    cerrarRef.current?.focus();
    const alTeclear = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [abierto, onCerrar]);

  const enviar = (e) => {
    e.preventDefault();
    if (!pedido.items.length) return;
    const lineas = pedido.items.map((i) => `• ${i.n} × ${nombreLinea(i.clave)} — ${sol(i.n * i.producto.precio)}`);
    // Los textos del cliente se limpian para que no puedan alterar el formato del mensaje.
    const nombreLimpio = limpiarTexto(nombre, LIMITES.nombre);
    const distritoLimpio = limpiarTexto(distrito, LIMITES.distrito);
    const metodoValido = METODOS.includes(metodo) ? metodo : METODOS[0];
    const lugar = entrega === 'envio' ? `Envío a domicilio en ${distritoLimpio || 'Lima'}` : 'Recojo en el local (Comas)';
    abrirWhatsApp(
      `Hola, quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${sol(pedido.total)}\nEntrega: ${lugar}\nForma de pago: ${metodoValido}` +
        `${nombreLimpio ? `\nNombre: ${nombreLimpio}` : ''}\n\n¿Tienen stock?`,
    );
  };

  return (
    <>
      <div className={abierto ? 'velo on' : 'velo'} onClick={onCerrar} aria-hidden="true" />
      <aside className={abierto ? 'cajon on' : 'cajon'} aria-label="Mi pedido" inert={!abierto}>
        <header className="cajon-cab">
          <h2>Mi pedido</h2>
          <button ref={cerrarRef} type="button" className="icono-boton" onClick={onCerrar} aria-label="Cerrar pedido">
            <X size={20} />
          </button>
        </header>

        <div className="cajon-lista">
          {pedido.items.length === 0 ? (
            <div className="cajon-vacio">
              <ShoppingBag size={38} strokeWidth={1.4} />
              <p>Tu pedido está vacío. Agrega productos desde la tienda y los verás aquí.</p>
            </div>
          ) : (
            pedido.items.map(({ clave, n, producto: p }) => (
              <div className="linea" key={clave}>
                <img src={fotoDe(p)} alt="" loading="lazy" />
                <div>
                  <b>{p.nombre}</b>
                  {saborDe(clave) && <span className="sabor">Sabor: {saborDe(clave)}</span>}
                  <span className="unitario">{sol(p.precio)} c/u</span>
                  <div className="linea-cant">
                    <button type="button" aria-label="Quitar uno" onClick={() => pedido.cambiar(clave, -1)}><Minus size={14} /></button>
                    <output>{n}</output>
                    <button type="button" aria-label="Agregar uno" onClick={() => pedido.cambiar(clave, 1)}><Plus size={14} /></button>
                    <button type="button" className="linea-quitar" aria-label={`Quitar ${p.nombre}`} onClick={() => pedido.quitar(clave)}><Trash2 size={15} /></button>
                  </div>
                </div>
                <span className="linea-sub">{sol(n * p.precio)}</span>
              </div>
            ))
          )}
        </div>

        <form className="cajon-pago" onSubmit={enviar} noValidate>
          <label className="campo">
            <span>Tu nombre</span>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Ej. Carlos" maxLength={LIMITES.nombre} />
          </label>
          <label className="campo">
            <span>Entrega</span>
            <select value={entrega} onChange={(e) => setEntrega(e.target.value)}>
              <option value="recojo">Recojo en el local (Comas)</option>
              <option value="envio">Envío a domicilio en Lima</option>
            </select>
          </label>
          {entrega === 'envio' && (
            <label className="campo">
              <span>Distrito</span>
              <input value={distrito} onChange={(e) => setDistrito(e.target.value)} placeholder="Ej. Los Olivos" maxLength={LIMITES.distrito} />
            </label>
          )}
          <fieldset className="metodos">
            <legend>Forma de pago</legend>
            {METODOS.map((m) => (
              <label key={m}>
                <input type="radio" name="metodo" value={m} checked={metodo === m} onChange={() => setMetodo(m)} />
                <span>{m}</span>
              </label>
            ))}
          </fieldset>
          <div className="total">
            <span>Total{pedido.ahorro > 0 && <small>Ahorras {sol(pedido.ahorro)}</small>}</span>
            <strong>{sol(pedido.total)}</strong>
          </div>
          <button type="submit" className="boton wa" disabled={!pedido.items.length}>
            <IconoWhatsApp /> Enviar pedido por WhatsApp
          </button>
          <p className="nota">Aún no pagas nada aquí. Te confirmamos stock, entrega y cómo pagar por WhatsApp.</p>
        </form>
      </aside>
    </>
  );
}
