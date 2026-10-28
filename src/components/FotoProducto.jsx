import { useState } from 'react';
import { Package } from 'lucide-react';
import { fotoDe, fotoGrande } from '../lib/tienda.js';

// Intenta la foto original (nítida); si falla usa la miniatura; si también falla, un ícono.
export default function FotoProducto({ producto, alt = '', lazy = true }) {
  const fuentes = [fotoGrande(producto), fotoDe(producto)].filter(Boolean);
  const [intento, setIntento] = useState(0);

  if (intento >= fuentes.length) return <Package size={56} strokeWidth={1.2} aria-hidden="true" />;
  return (
    <img
      src={fuentes[intento]}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      onError={() => setIntento((i) => i + 1)}
    />
  );
}
