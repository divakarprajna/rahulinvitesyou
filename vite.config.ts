import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/rahulinvitesyou/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    // Phone previews arrive through a tunnel hostname, not localhost.
    allowedHosts: true,
  },
})
