import {createApp} from 'vue'
import App from './App.vue'
import './style.css'
import 'vuetify/styles/main.css'

import vuetify from "./plugins/vuetify.ts";
import router from "./plugins/router.ts";

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
/*export function createApp() {
  const app = createSSRApp(App)
  return { app }
}*/


const app = createApp(App)
    .use(router)
    .use(vuetify)

app.mount("#app")
