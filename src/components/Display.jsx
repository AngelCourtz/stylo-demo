// Números estilo pantalla de caminadora (7 segmentos). Los segmentos apagados se ven tenues,
// como en una consola real. Acepta dígitos, ":", "." y "-".

const SEGMENTOS = {
  a: '11,5 49,5 54,10 49,15 11,15 6,10',
  b: '55,12 60,17 60,43 55,48 50,43 50,17',
  c: '55,52 60,57 60,83 55,88 50,83 50,57',
  d: '11,85 49,85 54,90 49,95 11,95 6,90',
  e: '5,52 10,57 10,83 5,88 0,83 0,57',
  f: '5,12 10,17 10,43 5,48 0,43 0,17',
  g: '11,45 49,45 54,50 49,55 11,55 6,50',
};

const ENCENDIDOS = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '',
};

function Digito({ c }) {
  const on = ENCENDIDOS[c] ?? '';
  return (
    <svg className="seg-dig" viewBox="-6 0 72 100" aria-hidden="true">
      <g transform="skewX(-6) translate(6 0)">
        {Object.entries(SEGMENTOS).map(([k, pts]) => (
          <polygon key={k} points={pts} className={on.includes(k) ? 'on' : 'off'} />
        ))}
      </g>
    </svg>
  );
}

function Separador({ c }) {
  return (
    <svg className="seg-sep" viewBox="0 0 20 100" aria-hidden="true">
      {c === ':' && <><circle cx="10" cy="32" r="6" className="on" /><circle cx="8" cy="70" r="6" className="on" /></>}
      {c === '.' && <circle cx="8" cy="90" r="6" className="on" />}
    </svg>
  );
}

export default function Display({ valor, etiqueta, className = '' }) {
  const texto = String(valor);
  return (
    <span className={`seg ${className}`} role="img" aria-label={etiqueta ?? texto}>
      {[...texto].map((c, i) => (c === ':' || c === '.' ? <Separador key={i} c={c} /> : <Digito key={i} c={c} />))}
    </span>
  );
}
