import { useCallback, useEffect, useMemo, useState } from 'react';
import { CLAVE_VALIDA, MAX_POR_PRODUCTO, productoDe } from './tienda.js';

const CLAVE_GUARDADO = 'stylo-pedido-v2';
const limitar = (n) => Math.min(MAX_POR_PRODUCTO, n);

// Lo guardado en el navegador se puede editar a mano: solo se aceptan líneas con formato válido,
// de productos que existen y con cantidades enteras entre 1 y 99. Todo lo demás se descarta.
const leerGuardado = () => {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || '{}');
    if (!g || typeof g !== 'object' || Array.isArray(g)) return {};
    return Object.fromEntries(
      Object.entries(g).filter(
        ([clave, n]) => CLAVE_VALIDA.test(clave) && productoDe(clave) && Number.isInteger(n) && n > 0 && n <= MAX_POR_PRODUCTO,
      ),
    );
  } catch {
    return {};
  }
};

// Pedido: { "820|Chocolate": 2, "1434": 1 }
export function usePedido() {
  const [lineas, setLineas] = useState(leerGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(lineas));
    } catch {
      // sin almacenamiento (modo privado): el pedido vive solo en esta pestaña
    }
  }, [lineas]);

  const agregar = useCallback((clave, cantidad = 1) => {
    if (!CLAVE_VALIDA.test(clave) || !productoDe(clave)) return;
    setLineas((l) => ({ ...l, [clave]: limitar((l[clave] || 0) + cantidad) }));
  }, []);

  const cambiar = useCallback((clave, delta) => {
    setLineas((l) => {
      const n = limitar((l[clave] || 0) + delta);
      const copia = { ...l };
      if (n > 0) copia[clave] = n;
      else delete copia[clave];
      return copia;
    });
  }, []);

  const quitar = useCallback((clave) => {
    setLineas((l) => {
      const copia = { ...l };
      delete copia[clave];
      return copia;
    });
  }, []);

  const resumen = useMemo(() => {
    const items = Object.entries(lineas)
      .filter(([clave, n]) => n > 0 && productoDe(clave))
      .map(([clave, n]) => ({ clave, n, producto: productoDe(clave) }));
    return {
      items,
      cantidad: items.reduce((a, i) => a + i.n, 0),
      total: items.reduce((a, i) => a + i.n * i.producto.precio, 0),
      ahorro: items.reduce((a, i) => a + i.n * Math.max(0, i.producto.antes - i.producto.precio), 0),
    };
  }, [lineas]);

  return { ...resumen, agregar, cambiar, quitar };
}
