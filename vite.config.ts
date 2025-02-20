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
      "@": fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
