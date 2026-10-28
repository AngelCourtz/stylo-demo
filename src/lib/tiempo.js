import { useEffect, useState } from 'react';
import { HORARIO, PROMOS, PROMOS_HABITUALES } from '../data/negocio.js';

const ZONA = 'America/Lima';
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Día de la semana y minutos del día en Lima, sin importar dónde esté el visitante.
export const ahoraEnLima = (fecha = new Date()) => {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(fecha)
      .map((p) => [p.type, p.value]),
  );
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.weekday);
  return { dia, minutos: Number(partes.hour) * 60 + Number(partes.minute) };
};

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const turnoDelDia = (dia) => HORARIO.find((t) => t.dias.includes(dia));

// "Abierto ahora · cierra 22:30" o "Cerrado · abre mañana 06:30".
export const estadoDelGimnasio = (fecha = new Date()) => {
  const { dia, minutos } = ahoraEnLima(fecha);
  const hoy = turnoDelDia(dia);
  if (hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra)) {
    return { abierto: true, texto: `Abierto ahora · cierra ${hoy.cierra}`, turno: hoy, dia };
  }
  if (hoy && minutos < aMinutos(hoy.abre)) {
    return { abierto: false, texto: `Cerrado · abre hoy ${hoy.abre}`, turno: hoy, dia };
  }
  const manana = turnoDelDia((dia + 1) % 7);
  return { abierto: false, texto: `Cerrado · abre mañana ${manana.abre}`, turno: hoy, dia };
};

export const nombreDia = (dia) => DIAS[dia];

// La promo vale hasta las 23:59:59 de su último día, hora de Lima (UTC−5, sin horario de verano).
export const finDePromo = (hasta) => new Date(`${hasta}T23:59:59-05:00`).getTime();

export const promosVigentes = (ahora = Date.now()) => {
  const conFecha = PROMOS.filter((p) => finDePromo(p.hasta) > ahora);
  return conFecha.length ? { lista: conFecha, conFecha: true } : { lista: PROMOS_HABITUALES, conFecha: false };
};

// Días, horas, minutos y segundos que faltan, con dos dígitos cada uno.
export const cuentaRegresiva = (hasta, ahora = Date.now()) => {
  let s = Math.max(0, Math.floor((finDePromo(hasta) - ahora) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  return [d, h, m, s].map((n) => String(n).padStart(2, '0'));
};

// Reloj compartido: vuelve a dibujar cada `cada` milisegundos.
export const useAhora = (cada = 1000) => {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), cada);
    return () => clearInterval(id);
  }, [cada]);
  return ahora;
};
