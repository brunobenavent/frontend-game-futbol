import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 👇 ESTO ES LO QUE ARREGLA TU ERROR 👇
      // Obliga a todas las librerías a usar TU copia de React
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  
  
})
