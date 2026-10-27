// Datos del negocio. Todo lo que dice null o "porConfirmar" se muestra en la web como
// "por confirmar", para que nadie lo tome como dato real hasta que el gimnasio lo apruebe.

export const NEGOCIO = {
  nombre: 'Stylo Fitness',
  // Número público que aparece en stylofitness.com
  whatsapp: '51928034563',
  whatsappVisible: '928 034 563',
  direccion: 'Av. Universitaria 7455, urb. El Retablo 2da etapa, Comas, Lima',
  referencia: 'Cruce con Av. Belaúnde, cerca del supermercado Metro',
  mapaConsulta: 'Av. Universitaria 7455, Comas, Lima, Peru',
  horario: null, // ej. 'Lunes a sábado, 6:00 a 22:00'
};

// Membresías: cambia los precios cuando el gimnasio los confirme (número en soles o null).
export const MEMBRESIAS = [
  { id: 'mensual', nombre: 'Mensual', duracion: '1 mes', precio: null },
  { id: 'trimestral', nombre: 'Trimestral', duracion: '3 meses', precio: null, destacada: true },
  { id: 'anual', nombre: 'Anual', duracion: '12 meses', precio: null },
];

// Lo que el dueño debe confirmar antes de publicar. Se muestra en la sección del gimnasio.
export const POR_CONFIRMAR = [
  'Horario de atención',
  'Precios y beneficios de cada membresía',
  'Servicios y clases que ofrece el gimnasio',
  'Fotos del local y de las máquinas',
];

export const CATEGORIAS = {
  whey: 'Proteínas whey',
  iso: 'Proteínas isolatadas',
  masa: 'Ganadores de masa',
  creatina: 'Creatinas y glutaminas',
  pre: 'Pre entrenos y óxido nítrico',
  amino: 'Aminoácidos y BCAA',
  quemador: 'Quemadores de grasa',
  vita: 'Vitaminas, colágeno y omegas',
  testo: 'Precursores de testosterona',
  higado: 'Protectores hepáticos',
};

// Categorías donde el cliente puede escribir el sabor que prefiere.
export const CON_SABOR = ['whey', 'iso', 'masa', 'pre', 'amino'];

export const OBJETIVOS = [
  { id: 'energia', nombre: 'Energía', kg: 10, cats: ['pre'] },
  { id: 'definir', nombre: 'Definir', kg: 15, cats: ['quemador', 'iso'] },
  { id: 'fuerza', nombre: 'Más fuerza', kg: 20, cats: ['creatina', 'amino'] },
  { id: 'masa', nombre: 'Ganar masa', kg: 25, cats: ['masa', 'whey'] },
];

// Desde qué % de descuento un producto se destaca como oferta.
export const OFERTA_MINIMA = 25;
