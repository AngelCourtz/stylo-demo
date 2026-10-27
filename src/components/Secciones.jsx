import { ArrowRight, Clock3, MapPin, ShoppingBag, Dumbbell } from 'lucide-react';
import { MEMBRESIAS, NEGOCIO, OBJETIVOS, POR_CONFIRMAR, OFERTA_MINIMA } from '../data/negocio.js';
import { PRODUCTOS, abrirWhatsApp, linkWhatsApp, sol } from '../lib/tienda.js';
import IconoWhatsApp from './IconoWhatsApp.jsx';

const TOTAL_PRODUCTOS = PRODUCTOS.length;
const MAX_DESCUENTO = Math.max(...PRODUCTOS.map((p) => p.pct));

// Barra con discos: cada disco es un objetivo. Los más pesados van al centro, como en una barra real.
function Barra({ activo, onElegir }) {
  return (
    <div className="barra" role="group" aria-label="Elige tu objetivo">
      <div className="lado izq">
        <span className="tope" aria-hidden="true" />
        {OBJETIVOS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`disco d${o.kg}`}
            aria-pressed={activo === o.id}
            onClick={() => onElegir(activo === o.id ? null : o.id)}
          >
            <small aria-hidden="true">{o.kg}</small>
            <span>{o.nombre}</span>
          </button>
        ))}
      </div>
      <div className="agarre" aria-hidden="true" />
      <div className="lado der" aria-hidden="true">
        <span className="tope" />
        {OBJETIVOS.map((o) => <span key={o.id} className={`disco d${o.kg}`} />)}
      </div>
    </div>
  );
}

export function Portada({ objetivo, onObjetivo }) {
  return (
    <section className="portada" id="inicio" aria-labelledby="portada-titulo">
      <div className="envoltura portada-grid">
        <div className="portada-txt">
          <p className="lugar"><MapPin size={16} aria-hidden="true" /> Gimnasio y suplementos · Comas, Lima</p>
          <h1 id="portada-titulo">No hay atajos.<span>Hay Stylo.</span></h1>
          <p className="portada-valor">
            Entrena con nosotros y llévate tu proteína, creatina o pre entreno en el mismo lugar.
            {` ${TOTAL_PRODUCTOS}`} suplementos con descuento y pedido directo por WhatsApp.
          </p>
          <div className="portada-acc">
            <a className="boton" href="#gimnasio"><Dumbbell size={19} aria-hidden="true" /> Conocer el gimnasio</a>
            <a className="boton claro" href="#tienda"><ShoppingBag size={19} aria-hidden="true" /> Comprar suplementos</a>
          </div>
        </div>
        <div className="portada-barra">
          <p className="barra-titulo">¿Cuál es tu objetivo?</p>
          <p className="barra-ayuda">Toca un disco y te mostramos los suplementos que sirven para eso.</p>
          <Barra activo={objetivo} onElegir={onObjetivo} />
        </div>
      </div>
    </section>
  );
}

export function DosCaminos() {
  return (
    <section className="caminos" aria-label="Gimnasio y tienda">
      <a className="camino entrena" href="#gimnasio">
        <span className="camino-etq">Entrena</span>
        <strong>El gimnasio</strong>
        <span className="camino-txt">Membresías, horario y ubicación en Av. Universitaria 7455.</span>
        <span className="camino-ir">Ver el gimnasio <ArrowRight size={18} aria-hidden="true" /></span>
      </a>
      <a className="camino recarga" href="#tienda">
        <span className="camino-etq">Recarga</span>
        <strong>La tienda</strong>
        <span className="camino-txt">{TOTAL_PRODUCTOS} suplementos, todos con descuento y hasta {MAX_DESCUENTO}% en los más rebajados.</span>
        <span className="camino-ir">Ver suplementos <ArrowRight size={18} aria-hidden="true" /></span>
      </a>
    </section>
  );
}

export function Gimnasio() {
  return (
    <section className="gimnasio" id="gimnasio" aria-labelledby="gim-titulo">
      <div className="envoltura gim-grid">
        <div>
          <h2 className="titulo" id="gim-titulo">Entrena y recarga en el mismo lugar</h2>
          <p className="bajada">
            Stylo Fitness es gimnasio y tienda de suplementos. Terminas tu rutina y te llevas lo que necesitas sin ir a otro
            sitio. Si no sabes qué suplemento te conviene, escríbenos y te orientamos antes de comprar.
          </p>
          <dl className="datos">
            <div><dt><MapPin size={18} aria-hidden="true" /> Dónde</dt><dd>{NEGOCIO.direccion}</dd></div>
            <div><dt><Clock3 size={18} aria-hidden="true" /> Horario</dt><dd>{NEGOCIO.horario || <span className="pendiente">Por confirmar</span>}</dd></div>
            <div>
              <dt><IconoWhatsApp size={18} /> WhatsApp</dt>
              <dd><a href={linkWhatsApp('Hola, quiero información sobre el gimnasio.')} target="_blank" rel="noopener noreferrer">{NEGOCIO.whatsappVisible}</a></dd>
            </div>
          </dl>
          <a className="boton wa" href={linkWhatsApp('Hola, quiero información sobre el gimnasio.')} target="_blank" rel="noopener noreferrer">
            <IconoWhatsApp /> Consultar por el gimnasio
          </a>
        </div>
        <aside className="pendientes" aria-labelledby="pend-titulo">
          <h3 id="pend-titulo">Falta confirmar con el gimnasio</h3>
          <p>Esta sección se completa con datos y fotos reales antes de publicar:</p>
          <ul>{POR_CONFIRMAR.map((t) => <li key={t}>{t}</li>)}</ul>
        </aside>
      </div>
    </section>
  );
}

export function Membresias() {
  const consultar = (m) => abrirWhatsApp(`Hola, quiero información sobre la membresía ${m.nombre.toLowerCase()} (${m.duracion}).`);
  return (
    <section className="membresias" id="membresias" aria-labelledby="memb-titulo">
      <div className="envoltura">
        <div className="cab-seccion">
          <h2 className="titulo" id="memb-titulo">Membresías</h2>
          <p className="bajada">Elige cuánto tiempo quieres entrenar y te enviamos precio y condiciones por WhatsApp.</p>
        </div>
        <div className="planes">
          {MEMBRESIAS.map((m) => (
            <article key={m.id} className={m.destacada ? 'plan destacado' : 'plan'}>
              <h3>{m.nombre}</h3>
              <p className="duracion">{m.duracion}</p>
              <p className="plan-precio">{m.precio ? sol(m.precio) : <span className="pendiente">Precio por confirmar</span>}</p>
              <button type="button" className={m.destacada ? 'boton' : 'boton borde-claro'} onClick={() => consultar(m)}>
                <IconoWhatsApp size={19} /> Consultar por WhatsApp
              </button>
            </article>
          ))}
        </div>
        <p className="nota-demo">Planes de ejemplo: los nombres, precios y beneficios se definen con Stylo Fitness antes de publicar.</p>
      </div>
    </section>
  );
}

export function ComoPedir() {
  const pasos = [
    ['Arma tu pedido', 'Agrega los suplementos que quieras. Si es proteína o pre entreno, escribe el sabor que prefieres.'],
    ['Envíalo por WhatsApp', 'El mensaje sale escrito con productos, cantidades, total y forma de entrega. Solo presionas enviar.'],
    ['Confirma y paga', 'Te confirmamos stock y entrega por WhatsApp. Pagas al confirmar: aquí no se cobra nada.'],
  ];
  return (
    <section className="como" id="como-pedir" aria-labelledby="como-titulo">
      <div className="envoltura">
        <h2 className="titulo" id="como-titulo">Cómo pedir</h2>
        <ol className="pasos">
          {pasos.map(([t, d]) => (
            <li key={t}><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
        <p className="como-nota">Descuentos de {OFERTA_MINIMA}% o más marcados en cada producto. Precios tomados de stylofitness.com.</p>
      </div>
    </section>
  );
}

export function Ubicacion() {
  const mapa = encodeURIComponent(NEGOCIO.mapaConsulta);
  return (
    <section className="ubicacion" id="ubicacion" aria-labelledby="ubi-titulo">
      <div className="envoltura ubi-grid">
        <div>
          <h2 className="titulo" id="ubi-titulo">Visítanos en Comas</h2>
          <dl className="datos">
            <div><dt>Dirección</dt><dd>{NEGOCIO.direccion}</dd></div>
            <div><dt>Referencia</dt><dd>{NEGOCIO.referencia}</dd></div>
            <div><dt>Horario</dt><dd>{NEGOCIO.horario || <span className="pendiente">Por confirmar</span>}</dd></div>
            <div><dt>Pedidos y consultas</dt><dd>WhatsApp {NEGOCIO.whatsappVisible}</dd></div>
          </dl>
          <div className="ubi-acc">
            <a className="boton wa" href={linkWhatsApp('Hola, quiero hacer una consulta.')} target="_blank" rel="noopener noreferrer"><IconoWhatsApp /> Escribir por WhatsApp</a>
            <a className="boton borde" href={`https://www.google.com/maps/search/?api=1&query=${mapa}`} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
          </div>
        </div>
        <div className="mapa">
          <iframe title={`Mapa: ${NEGOCIO.direccion}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapa}&z=16&output=embed`} />
        </div>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="pie">
      <div className="envoltura pie-grid">
        <div>
          <a className="marca" href="#inicio">STYLO<b>FITNESS</b></a>
          <p>Gimnasio y tienda de suplementos importados y nacionales en Comas, Lima.</p>
        </div>
        <nav aria-label="Secciones">
          <h3>Secciones</h3>
          <ul>
            <li><a href="#gimnasio">Gimnasio</a></li>
            <li><a href="#membresias">Membresías</a></li>
            <li><a href="#tienda">Suplementos</a></li>
            <li><a href="#como-pedir">Cómo pedir</a></li>
          </ul>
        </nav>
        <div>
          <h3>Contacto</h3>
          <p>{NEGOCIO.direccion}</p>
          <p>WhatsApp {NEGOCIO.whatsappVisible}</p>
        </div>
        <p className="aviso-salud">Los suplementos no reemplazan una alimentación balanceada. Si estás en tratamiento médico, embarazada o tienes alguna condición de salud, consulta a un profesional antes de usarlos.</p>
        <p className="aviso-demo">Propuesta de nueva web para Stylo Fitness. Versión de demostración, no oficial.</p>
      </div>
    </footer>
  );
}
