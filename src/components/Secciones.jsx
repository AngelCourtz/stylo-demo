import { ArrowUpRight, MapPin, Navigation, Plus, Quote, Star, Tag } from 'lucide-react';
import { FOTOS_SEDE, HORARIO, NEGOCIO, NOSOTROS, OFERTA_MINIMA, REDES, SEDES, TESTIMONIOS, linkResenaGoogle } from '../data/negocio.js';
import { PRODUCTOS, linkWhatsApp } from '../lib/tienda.js';
import { cuentaRegresiva, estadoDelGimnasio, promosVigentes, useAhora } from '../lib/tiempo.js';
import Display from './Display.jsx';
import IconoWhatsApp from './IconoWhatsApp.jsx';
import IconoRed from './IconoRed.jsx';

const TOTAL_PRODUCTOS = PRODUCTOS.length;
const dos = (n) => String(n).padStart(2, '0');

// Cada foto del local tiene una versión de 640 px (mismo nombre + "-640") para celulares.
const srcsetFoto = (src, ancho) => `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} ${ancho}w`;

// Encabezado de sección: etiqueta pequeña con una raya naranja, título grande y bajada.
function Cabeza({ id, etiqueta, titulo, bajada, children, centrado = false }) {
  return (
    <div className={centrado ? 'cabeza centrado revelar' : 'cabeza revelar'}>
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
          <p className="etiqueta">Gimnasio y suplementos · Comas</p>
          <h1 id="portada-titulo">Tu nuevo <span>estilo de vida</span></h1>
          <p className="portada-donde">
            En la esquina de <b>Universitaria</b> con <b>Belaúnde</b>. Dos sedes en la misma cuadra,
            abiertas desde las 6:30 de la mañana.
          </p>
          <div className="portada-acc">
            <a className="boton" href="#promos"><Tag size={19} aria-hidden="true" /> Ver promos</a>
            <a className="boton borde" data-evento="whatsapp-inscribirme-portada" href={linkWhatsApp('Hola, quiero información para inscribirme en Stylo Fitness.')} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp size={19} /> Inscribirme por WhatsApp
            </a>
          </div>
        </div>

        <figure className="portada-foto">
          {/* Recorte central de la foto de la zona de fuerza: columnas naranjas, discos y piso negro */}
          <img
            src="img/portada-fuerza.webp"
            srcSet={srcsetFoto('img/portada-fuerza.webp', 1100)}
            sizes="(max-width: 900px) 92vw, 48vw"
            alt="Zona de fuerza con columnas naranjas, discos y máquina de poleas"
            width="1100"
            height="940"
            fetchPriority="high"
          />
          <figcaption className="portada-estado">
            <Estado estado={estado} />
            <small>{hoy.titulo} · {hoy.abre} a {hoy.cierra}</small>
          </figcaption>
        </figure>
      </div>

      <div className="envoltura">
        <dl className="datos" aria-label="Datos rápidos">
          <div><dt>Horario de hoy</dt><dd><Display valor={hoy.abre} /><i>a</i><Display valor={hoy.cierra} /></dd></div>
          <div><dt>Sedes en Comas</dt><dd><Display valor={dos(SEDES.length)} /></dd></div>
          <div><dt>Promos desde</dt><dd><small>S/</small><Display valor={desde} etiqueta={`${desde} soles`} /></dd></div>
          <div><dt>Suplementos</dt><dd><Display valor={TOTAL_PRODUCTOS} /></dd></div>
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
          etiqueta={conFecha ? 'Por tiempo limitado' : 'Membresías'}
          titulo={conFecha ? 'Promos del mes' : 'Entrena más, paga menos'}
          bajada="Elige tu promo, escríbenos por WhatsApp y te inscribimos."
        />
        <div className="planes">
          {lista.map((p) => {
            const mensual = Math.round(p.precio / p.meses);
            const mensaje = `Hola, quiero la ${p.etiqueta.toLowerCase()}: ${p.meses} meses por S/ ${p.precio}.`;
            return (
              <article key={p.id} className={p.destacada ? 'plan destacado revelar' : 'plan revelar'}>
                <div className="plan-cab">
                  <p className="plan-etq">{p.etiqueta}</p>
                  {p.destacada && <span className="plan-sello">La más pedida</span>}
                </div>
                <h3 className="plan-meses">{p.meses === 12 ? '1 año' : `${p.meses} meses`}</h3>
                <div className="pantalla">
                  <span className="pantalla-sol">S/</span>
                  <Display valor={p.precio} etiqueta={`${p.precio} soles`} className="pantalla-num" />
                </div>
                <p className="plan-sub">
                  <span>Sale a S/ {mensual} al mes</span>
                  {p.antes && <span className="antes">Antes <s>S/ {p.antes}</s></span>}
                </p>
                {p.hasta && <Cuenta hasta={p.hasta} ahora={ahora} />}
                <a className={p.destacada ? 'boton' : 'boton borde'} data-evento={`whatsapp-promo-${p.meses}-meses`} href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer">
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
          titulo={<><span className="acento">Columnas naranjas,</span> fierro de verdad</>}
          bajada="Cardio, máquinas, poleas y peso libre. Si es tu primera vez, pregúntale al entrenador por dónde empezar."
        />
        <div className="galeria">
          {FOTOS_SEDE.map((f, i) => (
            <figure key={f.src} className={`foto f${i + 1} revelar`}>
              <img
                src={f.src}
                srcSet={srcsetFoto(f.src, f.ancho)}
                sizes={i === 0 ? '(max-width: 760px) 92vw, 36vw' : '(max-width: 760px) 92vw, 58vw'}
                alt={f.titulo}
                width={f.ancho}
                height={f.alto}
                loading="lazy"
                decoding="async"
              />
              <figcaption><b>{f.titulo}</b><span>{f.texto}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="nota-demo">Fotos de prueba: se reemplazan por fotos reales del local antes de publicar.</p>
      </div>
    </section>
  );
}

/* ---------- conócenos ---------- */
// Solo datos reales de negocio.js; lo que falta (año, socios, historia, foto) se muestra como pendiente.
export function Nosotros() {
  const { desde, socios, proposito, historia, lema, foto } = NOSOTROS;
  // con useAhora el HTML prerenderizado y el primer dibujo usan la misma fecha; luego pasa a la fecha real
  const ahora = useAhora(3600000);
  const anios = desde ? new Date(ahora).getFullYear() - desde : null;
  const datos = [
    { id: 'anios', valor: anios != null ? dos(anios) : '--', texto: anios != null ? `Años en Comas (desde ${desde})` : 'Años en Comas · por confirmar' },
    { id: 'sedes', valor: dos(SEDES.length), texto: 'Sedes en la misma cuadra' },
    { id: 'socios', valor: socios ?? '---', texto: socios ? 'Socios activos' : 'Socios activos · por confirmar' },
    { id: 'productos', valor: TOTAL_PRODUCTOS, texto: 'Suplementos en tienda' },
  ];
  return (
    <section className="nosotros" id="conocenos" aria-labelledby="nosotros-titulo">
      <div className="envoltura nosotros-grid">
        <div className="nosotros-txt revelar">
          <p className="etiqueta">Conócenos{desde ? ` · Desde ${desde}` : ''}</p>
          <h2 className="titulo" id="nosotros-titulo">
            {anios ? <>Más de {anios} años impulsando <span className="acento">un estilo de vida saludable</span></> : <>Impulsando <span className="acento">un estilo de vida saludable</span></>}
          </h2>
          {proposito && <p className="bajada">{proposito}</p>}
          {historia
            ? <p className="nosotros-historia">{historia}</p>
            : <p className="nosotros-historia pendiente-txt">Aquí va la historia de Stylo contada por el dueño: cómo empezó, desde cuándo y qué lo hace distinto. <b>Por confirmar.</b></p>}
          {lema && <p className="nosotros-lema">{lema}</p>}
          <a className="boton negro" data-evento="whatsapp-conocenos" href={linkWhatsApp('Hola, quiero conocer el gimnasio. ¿Puedo pasar a verlo?')} target="_blank" rel="noopener noreferrer">
            <IconoWhatsApp size={19} /> Ven a conocernos
          </a>
        </div>

        <div className="nosotros-panel revelar">
          <figure className="nosotros-foto">
            {foto
              ? <img src={foto} alt="El equipo de Stylo Fitness" loading="lazy" decoding="async" />
              : <img src="img/simbolo-stylo.webp" alt="" width="800" height="625" loading="lazy" decoding="async" className="simbolo" />}
          </figure>
          <dl className="nosotros-datos">
            {datos.map((d) => (
              <div key={d.id}>
                <dd><Display valor={d.valor} etiqueta={String(d.valor) === '--' || String(d.valor) === '---' ? 'por confirmar' : String(d.valor)} /></dd>
                <dt>{d.texto}</dt>
              </div>
            ))}
          </dl>
        </div>
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
                  <Display valor={dos(i + 1)} className="sede-num" etiqueta={`Sede ${i + 1}`} />
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
                  <span className="horas"><Display valor={t.abre} /> <i>a</i> <Display valor={t.cierra} /></span>
                </li>
              ))}
            </ul>

            <div className="sedes-acc">
              <a className="boton negro" data-evento="como-llegar" href={`https://www.google.com/maps/search/?api=1&query=${mapa}`} target="_blank" rel="noopener noreferrer">
                <Navigation size={18} aria-hidden="true" /> Cómo llegar
              </a>
              <a className="boton borde" href={linkWhatsApp('Hola, quiero hacer una consulta sobre las sedes y el horario.')} target="_blank" rel="noopener noreferrer">
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

/* ---------- opiniones de clientes ---------- */
function Estrellas({ n }) {
  return (
    <span className="estrellas" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} aria-hidden="true" className={i <= n ? 'llena' : undefined} />)}
    </span>
  );
}

// Franja negra a todo el ancho. Sin testimonios reales cargados, no inventa ninguno:
// es una invitación directa a calificar en Google.
export function Opiniones() {
  const hay = TESTIMONIOS.length > 0;
  return (
    <section className="opiniones" id="opiniones" aria-labelledby="opiniones-titulo">
      <div className="envoltura">
        <div className="opiniones-banda revelar">
          <div>
            <Estrellas n={5} />
            <h2 className="titulo" id="opiniones-titulo">{hay ? 'Lo que dicen nuestros clientes' : '¿Ya entrenas en Stylo?'}</h2>
            <p className="bajada">
              {hay
                ? 'Opiniones reales de quienes entrenan y compran con nosotros.'
                : 'Cuéntale a Comas cómo te va. Tu opinión en Google ayuda a que más vecinos nos encuentren.'}
            </p>
          </div>
          <a className="boton" data-evento="resena-google-web" href={linkResenaGoogle()} target="_blank" rel="noopener noreferrer">
            <Star size={19} aria-hidden="true" /> Califícanos en Google
          </a>
        </div>
        {hay && (
          <div className="testimonios">
            {TESTIMONIOS.map((t) => (
              <figure key={t.id} className="testimonio revelar">
                <Quote size={28} aria-hidden="true" className="comillas" />
                <Estrellas n={t.estrellas} />
                <blockquote>{t.texto}</blockquote>
                <figcaption><b>{t.nombre}</b><span>{t.detalle}</span></figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- preguntas frecuentes ---------- */
// Solo respuestas que salen de los datos de negocio.js y del funcionamiento real de la web.
// <details> abre y cierra sin JavaScript, así funcionan también en el HTML prerenderizado.
export function Preguntas() {
  const horario = HORARIO.map((t) => `${t.titulo}: ${t.abre} a ${t.cierra}, ${t.sedes.toLowerCase()}`).join('. ');
  const preguntas = [
    {
      p: '¿Cuál es el horario del gimnasio?',
      r: <>{horario}.</>,
    },
    {
      p: '¿Dónde quedan las sedes?',
      r: <>{SEDES.map((s) => `${s.nombre}: ${s.direccion}. ${s.detalle}`).join(' ')} {NEGOCIO.referencia}.</>,
    },
    {
      p: '¿Cómo me inscribo?',
      r: <>Elige tu promo en la sección <a href="#promos">Promos</a> y toca “La quiero”: se abre WhatsApp con el mensaje listo y te inscribimos por ahí.</>,
    },
    {
      p: '¿Cómo compro suplementos?',
      r: <>Agrega los productos a tu pedido desde la <a href="#tienda">tienda</a> y envíalo por WhatsApp. Te confirmamos stock, entrega y forma de pago antes de cobrar.</>,
    },
    {
      p: '¿Se paga en la web?',
      r: <>No. La web solo arma tu pedido; el pago se coordina por WhatsApp cuando confirmamos que hay stock.</>,
    },
  ];
  return (
    <section className="preguntas" id="preguntas" aria-labelledby="preguntas-titulo">
      <div className="envoltura preguntas-grid">
        <Cabeza id="preguntas-titulo" etiqueta="Antes de venir" titulo="Preguntas frecuentes">
          <a className="boton wa" href={linkWhatsApp('Hola, tengo una consulta sobre Stylo Fitness.')} target="_blank" rel="noopener noreferrer">
            <IconoWhatsApp size={19} /> ¿Otra duda? Escríbenos
          </a>
        </Cabeza>
        <div className="acordeon">
          {preguntas.map(({ p, r }) => (
            <details key={p}>
              <summary>{p}<Plus size={20} aria-hidden="true" /></summary>
              <p>{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- cómo pedir suplementos ---------- */
// Va dentro de la tienda, entre las ofertas y el catálogo: primero se explica cómo comprar y luego se elige.
export function ComoPedir() {
  const pasos = [
    ['Arma tu pedido', 'Agrega los suplementos que quieras. Si es proteína o pre entreno, escribe el sabor que prefieres.'],
    ['Envíalo por WhatsApp', 'El mensaje sale escrito con productos, cantidades, total y forma de entrega. Solo presionas enviar.'],
    ['Confirma y paga', 'Te confirmamos stock y entrega por WhatsApp. Pagas al confirmar: aquí no se cobra nada.'],
  ];
  return (
    <div className="como" id="como-pedir" aria-labelledby="como-titulo">
      <div>
        <Cabeza id="como-titulo" etiqueta="Tres pasos" titulo="Cómo pedir" />
        <ol className="pasos">
          {pasos.map(([t, d], i) => (
            <li key={t} className="revelar">
              <Display valor={dos(i + 1)} className="paso-num" etiqueta={`Paso ${i + 1}`} />
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className="como-nota">Descuentos de {OFERTA_MINIMA}% o más marcados en cada producto. Precios tomados de stylofitness.com.</p>
      </div>
    </div>
  );
}

/* ---------- pie ---------- */
export function Pie() {
  return (
    <footer className="pie">
      <div className="envoltura">
        <div className="pie-cta">
          <p className="pie-frase">Tu nuevo <span>estilo de vida</span> empieza hoy.</p>
          <a className="boton" data-evento="whatsapp-pie" href={linkWhatsApp('Hola, quiero información para inscribirme en Stylo Fitness.')} target="_blank" rel="noopener noreferrer">
            <IconoWhatsApp size={19} /> Escríbenos <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="pie-grid">
          <div>
            <a className="pie-logo" href="#inicio" aria-label="Stylo Fitness, volver al inicio">
              <img src="img/logo-stylo.webp" alt="" loading="lazy" />
            </a>
            <p>Gimnasio y tienda de suplementos en Comas, Lima.</p>
            <ul className="redes" aria-label="Redes sociales">
              {REDES.map((r) => (
                <li key={r.id}>
                  <a href={r.url} data-evento={`red-${r.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Stylo Fitness en ${r.nombre}`}>
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
              <li><a href="#conocenos">Conócenos</a></li>
              <li><a href="#opiniones">Opiniones</a></li>
              <li><a href="#sedes">Sedes y horario</a></li>
              <li><a href="#tienda">Suplementos</a></li>
              <li><a href="#preguntas">Preguntas frecuentes</a></li>
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
          <p className="aviso-demo">
            Contamos visitas de forma anónima, sin cookies ni datos personales.
            Propuesta de nueva web para Stylo Fitness. Versión de demostración, no oficial.
          </p>
        </div>
      </div>
    </footer>
  );
}
