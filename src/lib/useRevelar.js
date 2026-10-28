import { useEffect } from 'react';

// Marca con "visto" los elementos .revelar cuando entran en pantalla (las columnas suben, las tarjetas aparecen).
// Sin IntersectionObserver o con "reducir movimiento", todo se muestra de inmediato.
export const useRevelar = () => {
  useEffect(() => {
    const raiz = document.documentElement;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducir || !('IntersectionObserver' in window)) return undefined;

    raiz.classList.add('anima');
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visto');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    const observar = () => document.querySelectorAll('.revelar:not(.visto)').forEach((el) => obs.observe(el));
    observar();
    // La tienda y la ficha agregan tarjetas después: se vuelven a buscar cuando cambia la página.
    const mut = new MutationObserver(observar);
    mut.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mut.disconnect(); raiz.classList.remove('anima'); };
  }, []);
};
