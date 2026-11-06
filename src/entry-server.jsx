// Entrada del prerenderizado. scripts/prerender.mjs la usa al compilar para escribir el HTML
// de cada página ya armado, antes de que cargue JavaScript. En el navegador, main.jsx y qr.jsx
// "activan" ese mismo HTML (hydrateRoot) sin volver a dibujarlo.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import PaginaQR from './components/PaginaQR.jsx';
import { HORARIO, NEGOCIO, REDES } from './data/negocio.js';
import { SITIO } from './data/sitio.js';

export const renderizar = (pagina) =>
  renderToString(<StrictMode>{pagina === 'qr' ? <PaginaQR /> : <App />}</StrictMode>);

const DIA_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Datos estructurados del gimnasio, armados con los mismos datos que muestra la web
// (negocio.js), para que nunca digan algo distinto a la página.
export const datosEstructurados = () => ({
  '@context': 'https://schema.org',
  '@type': 'ExerciseGym',
  name: NEGOCIO.nombre,
  url: SITIO.url,
  image: SITIO.url + SITIO.imagenSocial,
  telephone: `+${NEGOCIO.whatsapp.slice(0, 2)} ${NEGOCIO.whatsappVisible}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Universitaria 7455, El Retablo 2da etapa',
    addressLocality: 'Comas',
    addressRegion: 'Lima',
    addressCountry: 'PE',
  },
  openingHoursSpecification: HORARIO.map((t) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: t.dias.map((d) => DIA_SCHEMA[d]),
    opens: t.abre,
    closes: t.cierra,
  })),
  sameAs: REDES.map((r) => r.url),
});
