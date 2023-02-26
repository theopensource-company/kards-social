import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), ssr()],
});
