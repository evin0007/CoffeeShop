import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            // Siguraduhin na ang file na ito ay nasa folder na /app/react/src/main.jsx
            input: ['react/src/main.jsx'], 
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // TANGGALIN ang 'react' at 'react-dom' aliases dito
            '@': path.resolve(__dirname, 'react/src'),
        },
    },
    // Opsyonal: Sa Docker/Railpack, mas mainam na 0.0.0.0 ang host kung gagamit ng dev server,
    // pero para sa build stage, hindi ito masyadong kritikal.
    server: {
        host: '0.0.0.0', 
        port: 5173,
    },
});