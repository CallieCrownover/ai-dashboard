import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Produce source maps for Vercel's error tracking integration
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split heavy vendored libs into separate cacheable chunks
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'recharts-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-vendor'
          }
        },
      },
    },
  },
})
