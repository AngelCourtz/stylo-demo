import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import PaginaQR from './components/PaginaQR.jsx';
import './styles.css';

const raiz = document.getElementById('root');
const pagina = <StrictMode><PaginaQR /></StrictMode>;

// Igual que main.jsx: activa el HTML prerenderizado o, en desarrollo, dibuja la página.
if (raiz.firstElementChild) hydrateRoot(raiz, pagina);
else createRoot(raiz).render(pagina);
