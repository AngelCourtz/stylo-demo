import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

const ENLACES = [
  ['#gimnasio', 'Gimnasio'],
  ['#membresias', 'Membresías'],
  ['#tienda', 'Suplementos'],
  ['#como-pedir', 'Cómo pedir'],
  ['#ubicacion', 'Ubicación'],
];

export default function Header({ cantidad, onPedido }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <header className="cabecera">
      <a className="marca" href="#inicio" onClick={cerrar} aria-label="Stylo Fitness, inicio">
        STYLO<b>FITNESS</b>
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
