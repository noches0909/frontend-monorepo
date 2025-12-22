import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
})
