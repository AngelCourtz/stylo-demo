import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

const ENLACES = [
  ['#promos', 'Promos'],
  ['#el-gym', 'El gym'],
  ['#sedes', 'Sedes y horario'],
  ['#equipo', 'Equipo'],
  ['#tienda', 'Suplementos'],
];

export default function Header({ cantidad, onPedido, introLista }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <header className="cabecera">
      <a className={introLista ? 'marca' : 'marca esperando'} href="#inicio" onClick={cerrar} aria-label="Stylo Fitness, inicio">
        <img src="img/logo-stylo.webp" alt="" width="1774" height="887" />
      </a>
      <button
        type="button"
        className="menu-boton"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="menu-principal"
        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
      >
        {abierto ? <X /> : <Menu />}
      </button>
      <nav id="menu-principal" className={abierto ? 'nav abierto' : 'nav'} aria-label="Principal">
        {ENLACES.map(([href, txt]) => (
          <a key={href} href={href} onClick={cerrar}>{txt}</a>
        ))}
      </nav>
      <button type="button" className="boton-pedido" onClick={() => { cerrar(); onPedido(); }} aria-label={`Abrir mi pedido, ${cantidad} productos`}>
        <ShoppingBag size={18} aria-hidden="true" />
        <span className="txt">Mi pedido</span>
        <b>{cantidad}</b>
      </button>
    </header>
  );
}
