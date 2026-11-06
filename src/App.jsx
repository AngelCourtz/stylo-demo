import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Check, Info } from 'lucide-react';
import Header from './components/Header.jsx';
import Tienda from './components/Tienda.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import IconoWhatsApp from './components/IconoWhatsApp.jsx';
import { ComoPedir, ElGym, Equipo, Opiniones, Pie, Portada, Preguntas, Promos, Sedes } from './components/Secciones.jsx';
import Intro from './components/Intro.jsx';

// La ficha trae las descripciones de los 126 productos (unos 110 KB): se descarga recién
// cuando alguien abre un producto, no al cargar la página.
const ProductModal = lazy(() => import('./components/ProductModal.jsx'));
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
  // Todo lo que depende del navegador (enlace, intro) arranca igual que el HTML prerenderizado
  // y se ajusta al activarse la página.
  const [ficha, setFicha] = useState(null);
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [aviso, setAviso] = useState('');
  const temporizador = useRef(null);
  const [introLista, setIntroLista] = useState(true);
  const finIntro = useCallback(() => setIntroLista(true), []);
  useRevelar();
  useEffect(() => {
    contarVisita();
    return escucharClics();
  }, []);

  // La intro (columnas que suben y el logo que vuela) tapa la página 2.5 s: ya no sale en cada visita,
  // solo con ?intro en la dirección, para mostrarla en la presentación al dueño.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('intro')) setIntroLista(false);
  }, []);

  const setFiltros = useCallback((cambios) => setFiltrosCompletos((f) => ({ ...f, ...cambios })), []);

  useEffect(() => {
    const alCambiar = () => setFicha(idDelEnlace());
    alCambiar();
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
          <Opiniones />
          <Tienda filtros={filtros} setFiltros={setFiltros} onVer={verProducto} onAgregar={agregar} />
          <ComoPedir />
          <Preguntas />
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

      {ficha !== null && (
        <Suspense fallback={null}>
          <ProductModal id={ficha} onCerrar={cerrarFicha} onVer={verProducto} onAgregar={agregar} />
        </Suspense>
      )}
      <CartDrawer abierto={pedidoAbierto} onCerrar={cerrarPedido} pedido={pedido} />
      {!introLista && <Intro onFin={finIntro} />}
    </>
  );
}
