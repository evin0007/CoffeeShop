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
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            '@': path.resolve(__dirname, 'react/src'),
        },
    },
    server: {
        host: '127.0.0.1', 
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
    },
});