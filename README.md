# Personaje 3D en AR (QR)

App React + Three.js + [MindAR](https://hiukim.github.io/mind-ar-js-doc/) que muestra
un personaje 3D animado en realidad aumentada al escanear un código QR. La cámara
del móvil se queda siempre en vivo detrás del personaje (no es un visor 3D con
fondo negro).

Cómo funciona el QR: el propio código QR cumple dos funciones. Al escanearlo con
la cámara normal del móvil, abre la URL de esta app (por eso el QR "es un enlace").
Una vez dentro de la app, apuntas la cámara de nuevo al mismo QR impreso: MindAR
reconoce visualmente su patrón como marcador y ancla el personaje justo encima
(por eso el QR "también es el marcador").

## Puesta en marcha

```bash
npm install
npm run dev
```

Nota técnica: `mind-ar` trae como dependencia `canvas` (normalmente requiere
compilar C++ con node-gyp, lo que falla en Windows y también en Vercel si
faltan herramientas de compilación). El `package.json` ya trae un `overrides`
que sustituye `canvas` por `@napi-rs/canvas` — misma API, pero con binarios
precompilados para Windows/Linux/Mac, así que `npm install` funciona sin
instalar nada extra, tanto en tu PC como al desplegar en Vercel.

## Probar en el móvil (necesitas HTTPS)

El acceso a la cámara (`getUserMedia`) solo funciona en un contexto seguro
(HTTPS), salvo en `localhost`. Por eso `npm run dev` en tu PC no sirve para
probar desde el móvil en la misma wifi: necesitas desplegar la app.

Recomendado: desplegar en [Vercel](https://vercel.com) (gratis, y ya tienes
cuenta por tu portfolio). Con el repo conectado, cada `git push` genera una URL
`https://tu-proyecto.vercel.app` con HTTPS automático.

## Generar el QR definitivo

El QR y el marcador que trae el proyecto ahora mismo son un **placeholder**
(apuntan a `https://placeholder.local/ar`, una URL de prueba). En cuanto tengas
la URL real (por ejemplo, tras desplegar en Vercel), regenera ambos archivos:

```bash
npm run generate:qr -- https://tu-proyecto.vercel.app
npm run compile:target
```

Esto sobrescribe `public/qr.png` (la imagen del QR) y `public/targets.mind` (el
marcador compilado que usa MindAR para reconocerlo). Vuelve a desplegar después
de regenerarlos.

Para imprimir el QR o mostrarlo en una pantalla, la propia app tiene un botón
"Ver / imprimir el código QR" en la pantalla de inicio.

El QR en sí **no cambia** de un personaje a otro — es siempre el mismo enlace y
el mismo marcador. Lo que cambia semana a semana es qué personaje carga la app
al reconocerlo (ver siguiente sección), así que no hace falta reimprimir nada.

## Personaje de la semana

Los personajes disponibles y cuál está activo se controlan desde
`src/characters.js`:

```js
export const ACTIVE_CHARACTER_ID = 'explorador'

export const CHARACTERS = [
  { id: 'robot', name: 'Robot', file: 'robot.glb', ... },
  { id: 'explorador', name: 'Explorador', file: 'explorador.glb', ... },
]
```

**Para cambiar el personaje de la semana**: cambia `ACTIVE_CHARACTER_ID` por el
`id` de otro personaje de la lista, guarda y despliega. Es una elección manual
— tú decides cada semana cuál toca, la app no rota sola.

**Para añadir un personaje nuevo**:

1. Exporta tu modelo como `.glb` (idealmente con al menos un clip de
   animación — desde Maya: exporta a FBX y conviértelo a glTF/GLB, por
   ejemplo con Blender o con [FBX2glTF](https://github.com/facebookincubator/FBX2glTF)).
   Si el archivo pesa mucho (varios MB) u tiene muchísimos polígonos, vale la
   pena pasarlo antes por [`gltf-transform`](https://gltf-transform.dev/) para
   aligerarlo — un móvil escaneando un QR no debería esperar a descargar
   decenas de MB.
2. Pon el `.glb` en `public/characters/` (por ejemplo `public/characters/mi-personaje.glb`).
3. Añade una entrada en el array `CHARACTERS` de `src/characters.js` con su
   `id`, `name`, `file`, `scale` y `position`. Si el clip que quieres
   reproducir no se llama "Dance", "Wave" ni "Idle", ajusta `clipPattern` (o
   pon `null` si el modelo no tiene animación — aparecerá estático).
4. Ajusta `scale`/`position` si el modelo aparece demasiado grande/pequeño o
   descentrado sobre el marcador.

El nombre del personaje activo se muestra también en la pantalla de inicio de
la app ("Personaje de esta semana: ...").

## Estructura

- `src/App.jsx` — pantalla de inicio (muestra el personaje activo), pantalla
  del QR y pantalla de AR.
- `src/characters.js` — registro de personajes disponibles y cuál está activo.
- `src/ARExperience.jsx` — inicializa MindAR + Three.js, carga el `.glb` del
  personaje activo y reproduce su animación (si tiene) al detectar el marcador.
- `public/characters/` — modelos 3D de los personajes (`robot.glb` es el
  placeholder original, `explorador.glb` el primero real).
- `public/targets.mind` — marcador de imagen compilado por MindAR a partir de
  `public/qr.png`.
- `scripts/generate-qr.mjs` — genera `public/qr.png` a partir de una URL.
- `scripts/compile-target.mjs` — compila `public/qr.png` como marcador MindAR.

## Build de producción

```bash
npm run build   # genera dist/
npm run preview # sirve dist/ localmente para comprobarlo
```
