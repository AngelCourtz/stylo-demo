import { ArrowRight, MapPin, Navigation, Tag } from 'lucide-react';
import { EQUIPO, FOTOS_SEDE, HORARIO, NEGOCIO, OFERTA_MINIMA, REDES, SEDES } from '../data/negocio.js';
import { PRODUCTOS, linkWhatsApp } from '../lib/tienda.js';
import { cuentaRegresiva, estadoDelGimnasio, promosVigentes, useAhora } from '../lib/tiempo.js';
import Display from './Display.jsx';
import IconoWhatsApp from './IconoWhatsApp.jsx';
import IconoRed from './IconoRed.jsx';

const TOTAL_PRODUCTOS = PRODUCTOS.length;
const dos = (n) => String(n).padStart(2, '0');

// Título de sección con su columna naranja al costado, como las del local.
function Cabeza({ id, etiqueta, titulo, bajada, children }) {
  return (
    <div className="cabeza revelar">
      <span className="columna" aria-hidden="true" />
      <div>
        {etiqueta && <p className="etiqueta">{etiqueta}</p>}
        <h2 className="titulo" id={id}>{titulo}</h2>
        {bajada && <p className="bajada">{bajada}</p>}
      </div>
      {children}
    </div>
  );
}

function Estado({ estado }) {
  return (
    <span className={estado.abierto ? 'estado abierto' : 'estado'}>
      <i aria-hidden="true" /> {estado.texto}
    </span>
  );
}

/* ---------- portada ---------- */
export function Portada() {
  const ahora = useAhora(30000);
  const estado = estadoDelGimnasio(new Date(ahora));
  const { lista } = promosVigentes(ahora);
  const desde = Math.min(...lista.map((p) => p.precio));
  const hoy = estado.turno ?? HORARIO[0];

  return (
    <section className="portada" id="inicio" aria-labelledby="portada-titulo">
      <div className="envoltura portada-grid">
        <div className="portada-txt">
          <Estado estado={estado} />
          <h1 id="portada-titulo">Tu nuevo <span>estilo de vida</span></h1>
          <p className="portada-donde">
            está en la esquina de <b>Universitaria</b> con <b>Belaúnde</b>. Dos sedes en la misma cuadra de Comas,
            abiertas desde las 6:30 de la mañana.
          </p>
          <div className="portada-acc">
            <a className="boton" href="#promos"><Tag size={19} aria-hidden="true" /> Ver promos</a>
            <a className="boton borde-osc" href={linkWhatsApp('Hola, quiero información para inscribirme en Stylo Fitness.')} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp size={19} /> Inscribirme por WhatsApp
            </a>
          </div>
        </div>

        <div className="portada-foto">
          <span className="pilar" aria-hidden="true" />
          <figure>
            <img src="img/sede-cardio.webp" alt="Fila de caminadoras en Stylo Fitness con el logo en la pared del fondo" width="940" height="1674" fetchpriority="high" />
          </figure>
          <span className="pilar" aria-hidden="true" />
        </div>
      </div>

      <div className="envoltura">
        <dl className="consola" aria-label="Datos rápidos">
          <div>
            <dt>Hoy · {hoy.titulo.toLowerCase()}</dt>
            <dd><Display valor={hoy.abre} /> <span className="consola-a">a</span> <Display valor={hoy.cierra} /></dd>
          </div>
          <div>
            <dt>Sedes</dt>
            <dd><Display valor={dos(SEDES.length)} /></dd>
          </div>
          <div>
            <dt>Promos desde</dt>
            <dd><span className="consola-sol">S/</span><Display valor={desde} /></dd>
          </div>
          <div>
            <dt>Suplementos</dt>
            <dd><Display valor={TOTAL_PRODUCTOS} /></dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ---------- promos ---------- */
function Cuenta({ hasta, ahora }) {
  const [d, h, m, s] = cuentaRegresiva(hasta, ahora);
  return (
    <div className="cuenta-reg">
      <span className="cuenta-tit">Termina en</span>
      <Display valor={`${d}:${h}:${m}:${s}`} etiqueta={`${Number(d)} días, ${Number(h)} horas y ${Number(m)} minutos`} />
      <span className="cuenta-uni" aria-hidden="true"><i>días</i><i>hrs</i><i>min</i><i>seg</i></span>
    </div>
  );
}

export function Promos() {
  const ahora = useAhora(1000);
  const { lista, conFecha } = promosVigentes(ahora);

  return (
    <section className="promos" id="promos" aria-labelledby="promos-titulo">
      <div className="envoltura">
        <Cabeza
          id="promos-titulo"
          etiqueta={conFecha ? 'Por tiempo limitado' : 'Promos frecuentes'}
          titulo={conFecha ? 'Promos del mes' : 'Entrena más, paga menos'}
          bajada="Elige tu promo, escríbenos por WhatsApp y te inscribimos."
        />
        <div className="consolas">
          {lista.map((p) => {
            const mensual = Math.round(p.precio / p.meses);
            const mensaje = `Hola, quiero la ${p.etiqueta.toLowerCase()}: ${p.meses} meses por S/ ${p.precio}.`;
            return (
              <article key={p.id} className={p.destacada ? 'promo destacada revelar' : 'promo revelar'}>
                <p className="promo-etq">{p.etiqueta}</p>
                <h3 className="promo-meses">{p.meses === 12 ? '1 año' : `${p.meses} meses`}</h3>
                <div className="pantalla">
                  <span className="pantalla-sol">S/</span>
                  <Display valor={p.precio} etiqueta={`${p.precio} soles`} className="pantalla-num" />
                </div>
                <p className="promo-sub">
                  {p.antes && <span className="antes">Antes <s>S/ {p.antes}</s></span>}
                  <span>Sale a S/ {mensual} al mes</span>
                </p>
                {p.hasta && <Cuenta hasta={p.hasta} ahora={ahora} />}
                <a className={p.destacada ? 'boton' : 'boton borde'} href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer">
                  <IconoWhatsApp size={19} /> La quiero
                </a>
              </article>
            );
          })}
        </div>
        {!conFecha && <p className="nota-demo">Precios de ejemplo: se actualizan con cada promo del gimnasio.</p>}
      </div>
    </section>
  );
}

/* ---------- el gym ---------- */
export function ElGym() {
  return (
    <section className="elgym" id="el-gym" aria-labelledby="gym-titulo">
      <div className="envoltura">
        <Cabeza
          id="gym-titulo"
          etiqueta="El gym"
          titulo="Columnas naranjas, fierro de verdad"
          bajada="Cardio, máquinas, poleas y peso libre. Si es tu primera vez, pregúntale al entrenador por dónde empezar."
        />
        <div className="galeria">
          {FOTOS_SEDE.map((f, i) => (
            <figure key={f.src} className={`foto f${i + 1} revelar`}>
              <img src={f.src} alt={f.titulo} loading="lazy" decoding="async" />
              <figcaption><b>{f.titulo}</b><span>{f.texto}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="nota-demo">Fotos de prueba: se reemplazan por fotos reales del local antes de publicar.</p>
      </div>
    </section>
  );
}

/* ---------- sedes y horario ---------- */
export function Sedes() {
  const ahora = useAhora(30000);
  const estado = estadoDelGimnasio(new Date(ahora));
  const mapa = encodeURIComponent(NEGOCIO.mapaConsulta);

  return (
    <section className="sedes" id="sedes" aria-labelledby="sedes-titulo">
      <div className="envoltura">
        <Cabeza id="sedes-titulo" etiqueta="Sedes y horario" titulo="Dos sedes, una sola cuadra">
          <Estado estado={estado} />
        </Cabeza>

        <div className="sedes-grid">
          <div className="sedes-info">
            <ul className="lista-sedes">
              {SEDES.map((s, i) => (
                <li key={s.id} className="sede revelar">
                  <Display valor={dos(i + 1)} className="sede-num" />
                  <div>
                    <h3>{s.nombre}</h3>
                    <p className="sede-dir"><MapPin size={16} aria-hidden="true" /> {s.direccion}</p>
                    <p className="sede-det">{s.detalle}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="sub">Horario</h3>
            <ul className="horario">
              {HORARIO.map((t) => (
                <li key={t.id} className={t.dias.includes(estado.dia) ? 'hoy' : undefined}>
                  <div>
                    <b>{t.titulo}</b>
                    {t.dias.includes(estado.dia) && <span className="chip-hoy">Hoy</span>}
                    <small>{t.sedes}</small>
                  </div>
                  <span className="horas">
                    <Display valor={t.abre} /> <i>a</i> <Display valor={t.cierra} />
                  </span>
                </li>
              ))}
            </ul>

            <div className="sedes-acc">
              <a className="boton" href={`https://www.google.com/maps/search/?api=1&query=${mapa}`} target="_blank" rel="noopener noreferrer">
                <Navigation size={18} aria-hidden="true" /> Cómo llegar
              </a>
              <a className="boton wa" href={linkWhatsApp('Hola, quiero hacer una consulta sobre las sedes y el horario.')} target="_blank" rel="noopener noreferrer">
                <IconoWhatsApp size={19} /> Preguntar
              </a>
            </div>
          </div>

          <div className="mapa revelar">
            <iframe title={`Mapa: ${NEGOCIO.direccion}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapa}&z=17&output=embed`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- equipo ---------- */
// Silueta mientras no haya foto real del entrenador.
function Silueta() {
  return (
    <svg className="silueta" viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="72" r="40" />
      <path d="M22 220c4-52 38-86 78-86s74 34 78 86z" />
    </svg>
  );
}

export function Equipo() {
  return (
    <section className="equipo" id="equipo" aria-labelledby="equipo-titulo">
      <div className="envoltura">
        <Cabeza
          id="equipo-titulo"
          etiqueta="Equipo"
          titulo="Te reciben caras conocidas"
          bajada="Llevan años en Stylo. Pregúntales por tu rutina, tu técnica o por dónde empezar."
        />
        <div className="entrenadores">
          {EQUIPO.map((p) => (
            <article key={p.id} className="entrenador revelar">
              <div className="retrato">
                {p.foto
                  ? <img src={p.foto} alt={`${p.cargo} ${p.nombre}`} loading="lazy" />
                  : <><Silueta /><span className="pronto">Foto próximamente</span></>}
              </div>
              <div className="entrenador-txt">
                <p className="cargo">{p.cargo}</p>
                <h3>{p.nombre}</h3>
                <a className="enlace-flecha" href={linkWhatsApp(`Hola, quiero entrenar con el entrenador ${p.nombre}.`)} target="_blank" rel="noopener noreferrer">
                  Entrenar con {p.nombre} <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- cómo pedir suplementos ---------- */
export function ComoPedir() {
  const pasos = [
    ['Arma tu pedido', 'Agrega los suplementos que quieras. Si es proteína o pre entreno, escribe el sabor que prefieres.'],
    ['Envíalo por WhatsApp', 'El mensaje sale escrito con productos, cantidades, total y forma de entrega. Solo presionas enviar.'],
    ['Confirma y paga', 'Te confirmamos stock y entrega por WhatsApp. Pagas al confirmar: aquí no se cobra nada.'],
  ];
  return (
    <section className="como" id="como-pedir" aria-labelledby="como-titulo">
      <div className="envoltura">
        <Cabeza id="como-titulo" etiqueta="Suplementos" titulo="Cómo pedir" />
        <ol className="pasos">
          {pasos.map(([t, d], i) => (
            <li key={t} className="revelar">
              <Display valor={dos(i + 1)} className="paso-num" />
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className="como-nota">Descuentos de {OFERTA_MINIMA}% o más marcados en cada producto. Precios tomados de stylofitness.com.</p>
      </div>
    </section>
  );
}

/* ---------- pie ---------- */
export function Pie() {
  return (
    <footer className="pie">
      <div className="pie-columnas" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} />)}</div>
      <div className="envoltura pie-grid">
        <div>
          <a className="pie-logo" href="#inicio" aria-label="Stylo Fitness, volver al inicio">
            <img src="img/logo-stylo.webp" alt="" loading="lazy" />
          </a>
          <p>Gimnasio y tienda de suplementos en Comas, Lima.</p>
          <ul className="redes" aria-label="Redes sociales">
            {REDES.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`Stylo Fitness en ${r.nombre}`}>
                  <IconoRed red={r.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Secciones">
          <h3>Secciones</h3>
          <ul>
            <li><a href="#promos">Promos</a></li>
            <li><a href="#el-gym">El gym</a></li>
            <li><a href="#sedes">Sedes y horario</a></li>
            <li><a href="#tienda">Suplementos</a></li>
          </ul>
        </nav>
        <div>
          <h3>Horario</h3>
          {HORARIO.map((t) => <p key={t.id}>{t.titulo}: {t.abre} a {t.cierra}</p>)}
          <h3 className="pie-h3">Contacto</h3>
          <p>{NEGOCIO.direccion}</p>
          <p>WhatsApp {NEGOCIO.whatsappVisible}</p>
        </div>
        <p className="aviso-salud">Los suplementos no reemplazan una alimentación balanceada. Si estás en tratamiento médico, embarazada o tienes alguna condición de salud, consulta a un profesional antes de usarlos.</p>
        <p className="aviso-demo">Propuesta de nueva web para Stylo Fitness. Versión de demostración, no oficial.</p>
      </div>
    </footer>
  );
}
