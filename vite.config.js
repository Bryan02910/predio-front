import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    // Configura el proxy para redirigir todas las solicitudes al host deseado.
    proxy: {
      '/api': 'https://predio-front.onrender.com', // Si tienes rutas API
    },
  },
})

