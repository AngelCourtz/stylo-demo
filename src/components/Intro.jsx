import { useEffect, useRef, useState } from 'react';

const CLAVE = 'stylo-intro-vista';

// Se muestra una vez por visita (o siempre con ?intro en la dirección) y nunca con "reducir movimiento".
const debeMostrarse = () => {
  try {
    if (new URLSearchParams(window.location.search).has('intro')) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem(CLAVE) !== '1';
  } catch {
    return true;
  }
};

const marcarVista = () => {
  try { sessionStorage.setItem(CLAVE, '1'); } catch { /* sin almacenamiento: se verá de nuevo, no pasa nada */ }
};

// Las columnas naranjas suben como en el local, aparece el logo y vuela a su sitio en la cabecera.
export default function Intro({ onFin }) {
  const [mostrar] = useState(debeMostrarse);
  const [fase, setFase] = useState('entra');
  const logo = useRef(null);

  useEffect(() => {
    if (!mostrar) { onFin(); return undefined; }
    marcarVista();
    document.documentElement.classList.add('con-intro');

    const volar = () => {
      const destino = document.querySelector('.cabecera .marca img')?.getBoundingClientRect();
      const origen = logo.current?.getBoundingClientRect();
      if (destino && origen && origen.width) {
        const escala = destino.width / origen.width;
        logo.current.style.transform =
          `translate(${destino.left - origen.left}px, ${destino.top - origen.top}px) scale(${escala})`;
      }
      setFase('vuela');
    };

    const t1 = setTimeout(volar, 1700);
    const t2 = setTimeout(() => {
      document.documentElement.classList.remove('con-intro');
      onFin();
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove('con-intro');
    };
  }, [mostrar, onFin]);

  if (!mostrar) return null;

  const saltar = () => {
    document.documentElement.classList.remove('con-intro');
    onFin();
  };

  return (
    <div className={`intro ${fase}`} onClick={saltar} aria-hidden="true">
      <div className="intro-columnas">
        {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ '--i': i }} />)}
      </div>
      <div className="intro-centro">
        <img ref={logo} className="intro-logo" src="img/logo-stylo.webp" alt="" />
      </div>
    </div>
  );
}
