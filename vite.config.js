import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss(),
  ],
  
export default defineConfig({
  preview: {
    allowedHosts: ['json-sever-mru6.onrender.com', 'localhost', '0.0.0.0']
  }
});
})  
