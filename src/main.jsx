import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Nota: sin StrictMode a propósito. StrictMode duplica el montaje de efectos
// en desarrollo, y aquí el efecto de AR pide la cámara e inicia MindAR:
// duplicarlo genera parpadeos y una segunda petición de permiso de cámara.
createRoot(document.getElementById('root')).render(<App />)
