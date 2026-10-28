// Datos del negocio. Todo lo que dice null o "porConfirmar" se muestra en la web como
// "por confirmar", para que nadie lo tome como dato real hasta que el gimnasio lo apruebe.

export const NEGOCIO = {
  nombre: 'Stylo Fitness',
  // Número público que aparece en stylofitness.com
  whatsapp: '51928034563',
  whatsappVisible: '928 034 563',
  direccion: 'Av. Universitaria 7455, urb. El Retablo, Comas, Lima',
  referencia: 'Esquina de Av. Universitaria con Av. Belaúnde',
  mapaConsulta: 'Av. Universitaria 7455, Comas, Lima, Peru',
};

export const REDES = [
  { id: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com/stylofitnessgym/' },
  { id: 'facebook', nombre: 'Facebook', url: 'https://www.facebook.com/stylofitnessgym/' },
  { id: 'tiktok', nombre: 'TikTok', url: 'https://www.tiktok.com/@stylofitnessgym' },
];

// Las dos sedes están en la misma cuadra de Av. Universitaria.
export const SEDES = [
  {
    id: 'esquina',
    nombre: 'Sede Esquina',
    direccion: 'Av. Universitaria 7455',
    detalle: 'En la esquina con Av. Belaúnde, frente a la avenida.',
  },
  {
    id: 'cuadra',
    nombre: 'Sede 2',
    direccion: 'Av. Universitaria, misma cuadra',
    detalle: 'A cuatro casas de la Sede Esquina, hacia la izquierda.',
  },
];

// Horario en hora de Lima. dias: 0 = domingo … 6 = sábado.
export const HORARIO = [
  { id: 'semana', titulo: 'Lunes a sábado', dias: [1, 2, 3, 4, 5, 6], abre: '06:30', cierra: '22:30', sedes: 'Las dos sedes' },
  { id: 'domingo', titulo: 'Domingo', dias: [0], abre: '07:00', cierra: '15:00', sedes: 'Abre una sede (por confirmar cuál)' },
];

// Promos con fecha límite: desaparecen solas al vencer. Formato de fecha: 'AAAA-MM-DD' (último día válido).
export const PROMOS = [
  { id: 'halloween-6', etiqueta: 'Promo Halloween', meses: 6, precio: 169, antes: 249, hasta: '2026-10-31', destacada: true },
  { id: 'aniversario-5', etiqueta: 'Promo flash aniversario', meses: 5, precio: 100, hasta: '2026-10-31' },
  { id: 'halloween-12', etiqueta: 'Promo Halloween', meses: 12, precio: 299, antes: 449, hasta: '2026-10-31' },
];

// Se muestran cuando no hay ninguna promo con fecha vigente. Precios de ejemplo hasta confirmarlos.
export const PROMOS_HABITUALES = [
  { id: 'tres', etiqueta: 'Promo frecuente', meses: 3, precio: 100, destacada: true },
  { id: 'cinco', etiqueta: 'Promo frecuente', meses: 5, precio: 150 },
];

// Fotos pendientes: mientras foto sea null se muestra la inicial sobre una columna naranja.
export const EQUIPO = [
  { id: 'franklin', nombre: 'Franklin', cargo: 'Entrenador', foto: null },
  { id: 'fernando', nombre: 'Fernando', cargo: 'Entrenador', foto: null },
];

// Fotos del local (carpeta public/img). Son de prueba: se reemplazan por fotos reales con el mismo nombre.
export const FOTOS_SEDE = [
  { src: 'img/sede-cardio.webp', titulo: 'Zona cardio', texto: 'Una fila completa de caminadoras con pantalla.' },
  { src: 'img/sede-maquinas.webp', titulo: 'Máquinas y poleas', texto: 'Espacio amplio, espejos y luz natural.' },
  { src: 'img/sede-fuerza.webp', titulo: 'Zona de fuerza', texto: 'Discos, barras y racks con piso de caucho.' },
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
