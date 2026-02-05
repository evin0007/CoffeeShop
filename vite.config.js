import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: ['react/src/main.jsx'], 
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'react/src'),
        },
    },
    server: {
        host: '0.0.0.0', 
        port: 5173,
    },
});