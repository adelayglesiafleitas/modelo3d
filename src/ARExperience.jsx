import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { getActiveCharacter } from './characters.js'

export default function ARExperience({ onExit }) {
  const containerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | searching | found
  const [error, setError] = useState(null)

  useEffect(() => {
    let mindarThree = null
    let renderer = null
    let mixer = null
    let clock = null
    let cancelled = false

    const init = async () => {
      try {
        const base = import.meta.env.BASE_URL
        const character = getActiveCharacter()

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: `${base}targets.mind`,
          maxTrack: 1,
          uiScanning: false,
          uiLoading: false,
        })

        const { renderer: r, scene, camera } = mindarThree
        renderer = r
        renderer.outputColorSpace = THREE.SRGBColorSpace

        scene.add(new THREE.HemisphereLight(0xffffff, 0x556677, 1.3))
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
        dirLight.position.set(0.5, 1, 0.7)
        scene.add(dirLight)

        const anchor = mindarThree.addAnchor(0)
        anchor.onTargetFound = () => setStatus('found')
        anchor.onTargetLost = () => setStatus('searching')

        clock = new THREE.Clock()
        const loader = new GLTFLoader()
        loader.load(
          `${base}characters/${character.file}`,
          (gltf) => {
            if (cancelled) return
            const model = gltf.scene
            model.scale.setScalar(character.scale)
            model.position.set(...character.position)
            anchor.group.add(model)

            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(model)
              const clip =
                (character.clipPattern &&
                  gltf.animations.find((a) => character.clipPattern.test(a.name))) ||
                gltf.animations[0]
              mixer.clipAction(clip).play()
            }
          },
          undefined,
          (err) => {
            console.error('Error cargando el modelo 3D', err)
            setError('No se pudo cargar el modelo 3D del personaje.')
          }
        )

        await mindarThree.start()
        if (cancelled) return
        setStatus('searching')

        renderer.setAnimationLoop(() => {
          const delta = clock.getDelta()
          if (mixer) mixer.update(delta)
          renderer.render(scene, camera)
        })
      } catch (e) {
        console.error(e)
        setError(
          e && e.message
            ? e.message
            : 'No se pudo iniciar la cámara. Revisa los permisos.'
        )
      }
    }

    init()

    return () => {
      cancelled = true
      if (renderer) renderer.setAnimationLoop(null)
      if (mindarThree) {
        try {
          mindarThree.stop()
        } catch {
          /* noop */
        }
      }
    }
  }, [])

  return (
    <div className="ar-screen">
      <div ref={containerRef} className="ar-container" />

      {!error && status !== 'found' && (
        <div className="ar-overlay">
          <div className="scan-frame" />
          <p>
            {status === 'loading'
              ? 'Iniciando cámara…'
              : 'Apunta la cámara al código QR'}
          </p>
        </div>
      )}

      {error && (
        <div className="ar-error">
          <p>{error}</p>
          <button type="button" onClick={onExit}>
            Volver
          </button>
        </div>
      )}

      <button type="button" className="exit-btn" onClick={onExit} aria-label="Cerrar">
        ✕
      </button>
    </div>
  )
}
