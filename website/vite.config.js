import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel auto-detects this Vite project (build: `npm run build`, output: `dist/`).
export default defineConfig({
  plugins: [react()],
})
