import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Info } from 'lucide-react';
import Header from './components/Header.jsx';
import Tienda from './components/Tienda.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import IconoWhatsApp from './components/IconoWhatsApp.jsx';
import { ComoPedir, ElGym, Equipo, Pie, Portada, Promos, Sedes } from './components/Secciones.jsx';
import Intro from './components/Intro.jsx';
import { useRevelar } from './lib/useRevelar.js';
import { contarVisita, escucharClics } from './lib/contador.js';
import { linkWhatsApp, nombreLinea } from './lib/tienda.js';
import { usePedido } from './lib/usePedido.js';

const FILTROS_INICIALES = { q: '', cat: 'todos', objetivo: null, orden: 'recientes' };

// Un enlace como /#producto-1434 abre directo la ficha de ese producto.
const idDelEnlace = () => {
  const m = window.location.hash.match(/^#producto-(\d+)$/);
  return m ? Number(m[1]) : null;
};

export default function App() {
  const pedido = usePedido();
  const [filtros, setFiltrosCompletos] = useState(FILTROS_INICIALES);
  const [ficha, setFicha] = useState(idDelEnlace);
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [aviso, setAviso] = useState('');
  const temporizador = useRef(null);
  const [introLista, setIntroLista] = useState(false);
  const finIntro = useCallback(() => setIntroLista(true), []);
  useRevelar();
  useEffect(() => {
    contarVisita();
    return escucharClics();
  }, []);

  const setFiltros = useCallback((cambios) => setFiltrosCompletos((f) => ({ ...f, ...cambios })), []);

  useEffect(() => {
    const alCambiar = () => setFicha(idDelEnlace());
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  const verProducto = useCallback((id) => {
    setFicha(id);
    window.history.replaceState(null, '', `#producto-${id}`);
  }, []);

  const cerrarFicha = useCallback(() => {
    setFicha(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  const abrirPedido = useCallback(() => {
    setFicha(null);
    setAviso('');
    setPedidoAbierto(true);
  }, []);
  const cerrarPedido = useCallback(() => setPedidoAbierto(false), []);

  // Agrega al pedido y muestra una confirmación que se puede leer con lector de pantalla.
  const agregar = useCallback((clave, cantidad = 1) => {
    pedido.agregar(clave, cantidad);
    setAviso(`${cantidad} × ${nombreLinea(clave)} agregado a tu pedido`);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso(''), 4000);
  }, [pedido]);

  return (
    <>
      {/* Mientras el pedido está abierto, el resto de la página no recibe foco ni clics */}
      <div className="pagina" inert={pedidoAbierto}>
        <div className="franja-demo">
          <Info size={15} aria-hidden="true" />
          <span><b>Propuesta de nueva web.</b> Fotos de prueba; productos y precios tomados de stylofitness.com.</span>
        </div>
        <Header cantidad={pedido.cantidad} onPedido={abrirPedido} introLista={introLista} />
        <main>
          <Portada />
          <Promos />
          <ElGym />
          <Sedes />
          <Equipo />
          <Tienda filtros={filtros} setFiltros={setFiltros} onVer={verProducto} onAgregar={agregar} />
          <ComoPedir />
        </main>
        <Pie />
        <a className="flotante" href={linkWhatsApp('Hola, quiero hacer una consulta.')} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp">
          <IconoWhatsApp size={30} />
        </a>
      </div>

      <div className={aviso ? 'aviso on' : 'aviso'} role="status" aria-live="polite">
        {aviso && (
          <>
            <Check size={18} aria-hidden="true" />
            <span>{aviso}</span>
            <button type="button" onClick={abrirPedido}>Ver pedido</button>
          </>
        )}
      </div>

      {ficha !== null && <ProductModal id={ficha} onCerrar={cerrarFicha} onVer={verProducto} onAgregar={agregar} />}
      <CartDrawer abierto={pedidoAbierto} onCerrar={cerrarPedido} pedido={pedido} />
      {!introLista && <Intro onFin={finIntro} />}
    </>
  );
}
