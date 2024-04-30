import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src'],
      deep: true,
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_variables.scss"; @import "./src/styles/generics.scss";`,
      },
    },
  },
  server: {
    port: 42069,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/cdn': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
