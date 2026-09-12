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
npm install --ignore-scripts
npm run dev
```

Usa `--ignore-scripts` porque `mind-ar` trae como dependencia el paquete `canvas`
(compilación nativa), que aquí **solo hace falta para el script de recompilar el
QR** (ver más abajo), no para que la app funcione. Con `--ignore-scripts` te
ahorras instalar herramientas de compilación (Visual Studio Build Tools, etc.)
en Windows. Si alguna vez necesitas ejecutar `npm run compile:target` en tu
propio equipo, instala `canvas` aparte (`npm install canvas`), que en Windows
requiere las build tools de C++; si prefieres evitarlo, pídeme que recompile el
target y te paso los archivos `public/qr.png` y `public/targets.mind`.

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

## Cambiar el personaje 3D

Ahora mismo se usa un modelo de prueba: `public/character.glb`
(**RobotExpressive.glb**, CC-BY 4.0 de Tomás Laulhé, vía los ejemplos de
three.js). Trae varias animaciones (Idle, Dance, Wave, Walking, Running...).

Para poner tu propio personaje animado:

1. Exporta tu modelo como `.glb` con al menos un clip de animación (desde Maya:
   exporta a FBX y conviértelo a glTF/GLB, por ejemplo con Blender o con la
   herramienta [FBX2glTF](https://github.com/facebookincubator/FBX2glTF)).
2. Sustituye `public/character.glb` por el tuyo (mismo nombre de archivo).
3. Si el clip que quieres reproducir no se llama "Dance", "Wave" ni "Idle",
   ajusta `PREFERRED_CLIP` en `src/ARExperience.jsx` (o indica directamente el
   índice/nombre del clip que quieres reproducir).
4. Ajusta escala/posición en `src/ARExperience.jsx` si el modelo aparece
   demasiado grande/pequeño o descentrado (`model.scale`, `model.position`).

## Estructura

- `src/App.jsx` — pantalla de inicio, pantalla del QR y pantalla de AR.
- `src/ARExperience.jsx` — inicializa MindAR + Three.js, carga el `.glb` y
  reproduce su animación al detectar el marcador.
- `public/character.glb` — modelo 3D animado (placeholder).
- `public/targets.mind` — marcador de imagen compilado por MindAR a partir de
  `public/qr.png`.
- `scripts/generate-qr.mjs` — genera `public/qr.png` a partir de una URL.
- `scripts/compile-target.mjs` — compila `public/qr.png` como marcador MindAR.

## Build de producción

```bash
npm run build   # genera dist/
npm run preview # sirve dist/ localmente para comprobarlo
```
