import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath} from "node:url";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsxPlugin(), vuetify()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
      '@Views': fileURLToPath(new URL('./src/ui/views', import.meta.url)),
      '@Utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@Components': fileURLToPath(new URL('./src/ui/components', import.meta.url)),
      '@Fragments': fileURLToPath(new URL('./src/fragments', import.meta.url)),
      '@Layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
    }
  }
})
