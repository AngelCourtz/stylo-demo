// Contador de visitas y clics con GoatCounter (gratis, sin cookies, sin datos personales).
// Para activarlo: crea tu cuenta en goatcounter.com y escribe aquí el nombre que elegiste
// (si tu panel es https://stylofitness.goatcounter.com, escribe 'stylofitness').
// Mientras sea null no se cuenta nada.
export const GOATCOUNTER = 'stylofitness';

const activo = () =>
  Boolean(GOATCOUNTER) &&
  !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

// Se manda como una imagen de 1 píxel: no carga ningún script de terceros.
const enviar = (datos) => {
  if (!activo()) return;
  const q = new URLSearchParams({ ...datos, rnd: Math.random().toString(36).slice(2) });
  const img = new Image();
  img.referrerPolicy = 'no-referrer-when-downgrade';
  img.src = `https://${GOATCOUNTER}.goatcounter.com/count?${q}`;
};

// Una visita. "q" lleva ?origen=facebook o ?utm_source=... para saber de qué anuncio vino.
// Se cuenta una sola vez por carga de página.
let visitaContada = false;
export const contarVisita = () => {
  if (visitaContada) return;
  visitaContada = true;
  enviar({
    p: window.location.pathname,
    t: document.title,
    r: document.referrer,
    q: window.location.search,
    s: `${window.screen.width},${window.screen.height},${window.devicePixelRatio || 1}`,
  });
};

// Un clic importante, por ejemplo 'whatsapp-promo-6-meses'. Aparece como evento en el panel.
export const contarEvento = (nombre) =>
  enviar({ p: nombre, t: nombre, e: 'true', q: window.location.search });

// Todo enlace con data-evento se cuenta solo al hacer clic.
// Los demás enlaces a WhatsApp se cuentan con el nombre de la sección donde están.
export const escucharClics = () => {
  const alClic = (ev) => {
    const a = ev.target.closest?.('a[href]');
    if (!a) return;
    if (a.dataset.evento) { contarEvento(a.dataset.evento); return; }
    if (a.href.includes('wa.me/')) {
      const seccion = a.closest('section[id], header, footer');
      const lugar = seccion?.id || seccion?.tagName.toLowerCase() || 'pagina';
      contarEvento(`whatsapp-${a.classList.contains('flotante') ? 'flotante' : lugar}`);
    }
  };
  document.addEventListener('click', alClic);
  return () => document.removeEventListener('click', alClic);
};
