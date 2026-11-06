import { useEffect } from 'react';
import { ChevronRight, Navigation, ShoppingBag, Star, Tag } from 'lucide-react';
import { NEGOCIO, REDES, linkResenaGoogle } from '../data/negocio.js';
import { contarVisita, escucharClics } from '../lib/contador.js';
import { linkWhatsApp } from '../lib/tienda.js';
import { estadoDelGimnasio, useAhora } from '../lib/tiempo.js';
import IconoWhatsApp from './IconoWhatsApp.jsx';
import IconoRed from './IconoRed.jsx';

// Página a la que lleva el QR del local (recepción, mesa, caja).
// Cada botón se cuenta como evento en GoatCounter, para saber qué usa la gente que escanea.
const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(NEGOCIO.mapaConsulta)}`;

export default function PaginaQR() {
  const ahora = useAhora(30000);
  const estado = estadoDelGimnasio(new Date(ahora));
  useEffect(() => {
    contarVisita();
    return escucharClics();
  }, []);

  const botones = [
    { id: 'promos', href: '../#promos', icono: <Tag size={26} aria-hidden="true" />, titulo: 'Ver promos', texto: 'Membresías por meses', clase: 'qr-boton principal' },
    { id: 'catalogo', href: '../#tienda', icono: <ShoppingBag size={26} aria-hidden="true" />, titulo: 'Ver suplementos', texto: 'Proteínas, creatinas y más con descuento', clase: 'qr-boton' },
    { id: 'resena', href: linkResenaGoogle(), externo: true, icono: <Star size={26} aria-hidden="true" />, titulo: 'Califícanos en Google', texto: 'Tu opinión nos ayuda mucho', clase: 'qr-boton google' },
    { id: 'whatsapp', href: linkWhatsApp('Hola, escaneé el QR del local y quiero hacer una consulta.'), externo: true, icono: <IconoWhatsApp size={26} />, titulo: 'Escríbenos al WhatsApp', texto: 'Pedidos, inscripciones y consultas', clase: 'qr-boton wa' },
  ];

  return (
    <main className="qr">
      <div className="qr-columnas" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} />)}</div>
      <div className="qr-caja">
        <a className="qr-logo" href="../" aria-label="Stylo Fitness, ir a la web">
          <img src="../img/logo-stylo.webp" alt="" width="900" height="450" />
        </a>
        <span className={estado.abierto ? 'estado abierto' : 'estado'}><i aria-hidden="true" /> {estado.texto}</span>
        <h1>¡Gracias por entrenar con nosotros!</h1>
        <p className="qr-bajada">¿Qué quieres hacer?</p>

        <ul className="qr-lista">
          {botones.map((b) => (
            <li key={b.id}>
              <a className={b.clase} href={b.href} data-evento={`qr-${b.id}`} {...(b.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="qr-icono">{b.icono}</span>
                <span className="qr-txt"><b>{b.titulo}</b><small>{b.texto}</small></span>
                <ChevronRight size={22} aria-hidden="true" className="qr-flecha" />
              </a>
            </li>
          ))}
        </ul>

        <a className="qr-llegar" href={mapa} data-evento="qr-como-llegar" target="_blank" rel="noopener noreferrer">
          <Navigation size={16} aria-hidden="true" /> {NEGOCIO.direccion}
        </a>
        <ul className="redes qr-redes" aria-label="Redes sociales">
          {REDES.map((r) => (
            <li key={r.id}>
              <a href={r.url} data-evento={`qr-red-${r.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Stylo Fitness en ${r.nombre}`}>
                <IconoRed red={r.id} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
