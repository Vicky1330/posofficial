import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 50426, // Development server port
    },
    build: {
        outDir: 'dist', // Specify the output directory
    },
});
