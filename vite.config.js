import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Tailwind v4 plugin
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(), // Siguraduhing mauna ito o kasama ng react
        laravel({
            // Ituro ang main.jsx sa external folder
            input: [path.resolve(__dirname, '../react/src/main.jsx')],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // Fix para sa Hook Error: Isang React instance lang
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
    },
    server: {
        fs: {
            allow: ['..'], // Payagan ang pag-access sa labas na folder
        },
    },
});