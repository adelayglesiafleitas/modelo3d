// Registro de personajes disponibles + cuál está activo esta semana.
//
// Para cambiar el personaje de la semana: cambia ACTIVE_CHARACTER_ID por el
// `id` de otro personaje de la lista. No hace falta tocar nada más — la app
// carga el .glb correspondiente en cuanto guardes y despliegues.
//
// Para añadir un personaje nuevo:
// 1. Pon su .glb en public/characters/ (con al menos un clip de animación si
//    quieres que se mueva al aparecer).
// 2. Añade una entrada aquí con su id, nombre, archivo, escala y posición.
// 3. Cuando le toque, pon su id en ACTIVE_CHARACTER_ID.

export const ACTIVE_CHARACTER_ID = 'explorador'

export const CHARACTERS = [
  {
    id: 'robot',
    name: 'Robot',
    file: 'robot.glb',
    // RobotExpressive.glb (placeholder original), trae varios clips.
    scale: 0.4,
    position: [0, -0.35, 0],
    clipPattern: /dance|wave|idle/i,
  },
  {
    id: 'explorador',
    name: 'Explorador',
    file: 'explorador.glb',
    // Modelo optimizado (Tripo -> gltf-transform). Sin clips de animación
    // todavía: aparece estático hasta que se rigee/anime.
    scale: 0.85,
    position: [0, -0.3, 0],
    clipPattern: null,
  },
]

export function getActiveCharacter() {
  return CHARACTERS.find((c) => c.id === ACTIVE_CHARACTER_ID) || CHARACTERS[0]
}
