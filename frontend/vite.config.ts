import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        https: false,
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000/',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            '@pages': resolve(__dirname, 'src/pages'),
            '@components': resolve(__dirname, 'src/components'),
            '@shared': resolve(__dirname, 'src/shared'),
            '@actions': resolve(__dirname, 'src/actions'),
            '@enteties': resolve(__dirname, 'src/enteties'),
        },
    },
});
