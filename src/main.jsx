import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Componente raíz
import App from './App.jsx'

// Estilos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'

// Estilos propios
import './styles/index.css'

// Montar la app en el <div id="root">
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
