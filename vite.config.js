import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: así el build funciona tanto en la raíz de un dominio
  // (Vercel, etc.) como si se sirve dentro de una subcarpeta.
  base: './',
  plugins: [react()],
})
