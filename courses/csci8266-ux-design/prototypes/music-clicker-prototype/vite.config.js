import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/courses/csci8266-ux-design/prototype-music-clicker/',
  build: {
    outDir: '../../prototype-music-clicker',
    emptyOutDir: true,
  },
})
