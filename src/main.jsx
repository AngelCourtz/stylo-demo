import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const raiz = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;

// Compilada, la página ya trae el HTML armado (prerenderizado): React solo lo activa.
// En desarrollo (npm run dev) llega vacía y React la dibuja completa.
if (raiz.firstElementChild) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
