import { useState } from 'react'
import ARExperience from './ARExperience.jsx'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('intro') // intro | ar | qr

  if (screen === 'ar') {
    return <ARExperience onExit={() => setScreen('intro')} />
  }

  if (screen === 'qr') {
    return (
      <div className="qr-screen">
        <button type="button" className="exit-btn" onClick={() => setScreen('intro')} aria-label="Cerrar">
          ✕
        </button>
        <h1>Código QR</h1>
        <p>Imprime este código o muéstralo en una pantalla.</p>
        <img
          src={`${import.meta.env.BASE_URL}qr.png`}
          alt="Código QR del personaje 3D en AR"
          className="qr-image"
        />
      </div>
    )
  }

  return (
    <div className="intro-screen">
      <div className="intro-card">
        <h1>Personaje 3D en AR</h1>
        <p>
          Apunta la cámara al código QR y el personaje aparecerá animado
          sobre él, con la cámara siempre en vivo detrás.
        </p>
        <button type="button" className="primary-btn" onClick={() => setScreen('ar')}>
          Iniciar cámara
        </button>
        <button type="button" className="secondary-btn" onClick={() => setScreen('qr')}>
          Ver / imprimir el código QR
        </button>
        <p className="hint">
          Funciona mejor en el móvil, con buena luz y el QR bien enfocado.
        </p>
      </div>
    </div>
  )
}
