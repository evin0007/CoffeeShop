export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, '../public/build'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      // Huwag gamitin ang path.resolve dito para 'src/main.jsx' lang ang lumabas sa manifest
      input: 'src/main.jsx', 
    },
  },
})