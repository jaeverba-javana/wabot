import {createApp} from 'vue'
import App from './App.vue'
import 'vuetify/styles/main.css'

import './style.css'

import vuetify from "./plugins/vuetify.ts";
import router from "./plugins/router.ts";
import {createPinia} from "pinia";
import SVGIcon from "@jamescoyle/vue-icon/lib/svg-icon.vue";

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
/*export function createApp() {
  const app = createSSRApp(App)
  return { app }
}*/


const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(vuetify)
	.component('SVGIcon', SVGIcon)

app.mount("#app")
